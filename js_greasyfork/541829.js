// ==UserScript==
// @name         VOD Synchronizer (SOOP-SOOP 동기화)
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  SOOP 다시보기 타임스탬프 표시 및 다른 스트리머의 다시보기와 동기화
// @author       AINukeHere
// @match        https://vod.sooplive.co.kr/*
// @match        https://www.sooplive.co.kr/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541829/VOD%20Synchronizer%20%28SOOP-SOOP%20%EB%8F%99%EA%B8%B0%ED%99%94%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541829/VOD%20Synchronizer%20%28SOOP-SOOP%20%EB%8F%99%EA%B8%B0%ED%99%94%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 간소화된 로깅 함수
    function logToExtension(...data) {
        console.debug(`[${new Date().toLocaleString()}]`, ...data);
    }
    function warnToExtension(...data) {
        logToExtension(...data);
    }
    function errorToExtension(...data) {
        logToExtension(...data);
    }
    function debugToExtension(...data) {
        logToExtension(...data);
    }
    if (window.top !== window.self) return;

    // 메인 페이지에서 실행되는 경우 (vod.sooplive.co.kr)
    if (window.location.hostname === 'vod.sooplive.co.kr') {
        class IVodSync {
    constructor(){
        this.vodSyncClassName = this.constructor.name;
    }
    log(...data){
        logToExtension(`[${this.vodSyncClassName}]`, ...data);
    }
    warn(...data){
        warnToExtension(`[${this.vodSyncClassName}]`, ...data);
    }
    error(...data){
        errorToExtension(`[${this.vodSyncClassName}]`, ...data);
    }
    debug(...data){
        debugToExtension(`[${this.vodSyncClassName}]`, ...data);
    }
}
        class SoopAPI extends IVodSync{
    constructor(){
        super();
        window.VODSync = window.VODSync || {};
        if (window.VODSync.soopAPI) {
            this.warn('[VODSync] SoopAPI가 이미 존재합니다. 기존 인스턴스를 덮어씁니다.');
        }
        this.log('loaded');
        window.VODSync.soopAPI = this;
    }

    /**
     * @description Get Soop VOD Period
     * @param {number | string} videoId 
     * @returns {string} period or null
     */
    async GetSoopVodInfo(videoId) {
        const a = await fetch("https://api.m.sooplive.co.kr/station/video/a/view", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/x-www-form-urlencoded",
                "Referer": `https://vod.sooplive.co.kr/player/${videoId}`
            },
            "body": `nTitleNo=${videoId}&nApiLevel=11&nPlaylistIdx=0`,
            "method": "POST"
        });
        if (a.status !== 200){
            return null;
        }
        const b = await a.json();
        return b;
    }
    async GetStreamerID(nickname){
        const encodedNickname = encodeURI(nickname);
        const url = new URL('https://sch.sooplive.co.kr/api.php');
        url.searchParams.set('m', 'bjSearch');
        url.searchParams.set('v', '3.0');
        url.searchParams.set('szOrder', 'score');
        url.searchParams.set('szKeyword', encodedNickname);
        this.log(`GetStreamerID: ${url.toString()}`);
        const res = await fetch(url.toString());
        if (res.status !== 200){
            return null;
        }
        const b = await res.json();
        return b.DATA[0].user_id;
    }
    /**
     * @description Get Soop VOD List
     * @param {string} streamerId 
     * @param {Date} start_date
     * @param {Date} end_date
     * @returns 
     */
    async GetSoopVOD_List(streamerId, start_date, end_date){
        const start_date_str = start_date.toISOString().slice(0, 10).replace(/-/g, '');
        const end_date_str = end_date.toISOString().slice(0, 10).replace(/-/g, '');
        this.log(`start_date: ${start_date_str}, end_date: ${end_date_str}`);
        const url = new URL(`https://chapi.sooplive.co.kr/api/${streamerId}/vods/review`);
        url.searchParams.set("keyword", "");
        url.searchParams.set("orderby", "reg_date");
        url.searchParams.set("page", "1");
        url.searchParams.set("field", "title,contents,user_nick,user_id");
        url.searchParams.set("per_page", "60");
        url.searchParams.set("start_date", start_date_str);
        url.searchParams.set("end_date", end_date_str);
        this.log(`GetSoopVOD_List: ${url.toString()}`);
        const res = await fetch(url.toString());
        const b = await res.json();
        return b;
    }
}
        const isChromeExtension = false;
        class TimestampManagerBase extends IVodSync {
    constructor() {
        super();
        this.videoTag = null;
        this.timeStampDiv = null;
        this.isEditing = false;
        this.request_vod_ts = null;
        this.request_real_ts = null;
        this.isControllableState = false;
        this.lastMouseMoveTime = Date.now();
        this.isVisible = true;
        this.mouseCheckInterval = null;
        this.isHideCompletly = false; // 툴팁 숨기기 상태
        
        // VODSync 네임스페이스에 자동 등록
        window.VODSync = window.VODSync || {};
        if (window.VODSync.tsManager) {
            this.warn('[VODSync] TimestampManager가 이미 존재합니다. 기존 인스턴스를 덮어씁니다.');
        }
        window.VODSync.tsManager = this;
        
        this.startMonitoring();
    }
    // request_real_ts 가 null이면 request_vod_ts로 동기화하고 null이 아니면 동기화시도하는 시점과 request_real_ts와의 차이를 request_vod_ts와 더하여 동기화합니다.
    // 즉, 페이지가 로딩되는 동안의 시차를 적용할지 안할지 결정합니다.
    RequestGlobalTSAsync(request_vod_ts, request_real_ts = null){
        this.request_vod_ts = request_vod_ts;
        this.request_real_ts = request_real_ts;
    }

    RequestLocalTSAsync(request_local_ts){
        this.request_local_ts = request_local_ts;
    }

    startMonitoring() {
        this.observeDOMChanges();
        this.createTooltip();
        setInterval(() => {
            this.updateTooltip();
        }, 200);
        this.setupMouseTracking();
        this.listenBroadcastSyncEvent();
    }

    listenBroadcastSyncEvent() {
        if (isChromeExtension){
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.action === 'broadCastSync') {
                    this.moveToGlobalTS(message.request_vod_ts, false);
                    sendResponse({ success: true });
                }
                return true;
            });
        }
        else{
            this.channel = new BroadcastChannel('vod-synchronizer');
            this.channel.onmessage = (event) => {
                if (event.data.action === 'broadCastSync') {
                    this.moveToGlobalTS(event.data.request_vod_ts, false);
                }
            }
        }
    }

    setupMouseTracking() {
        // 마우스 움직임 감지 - 시간만 업데이트
        document.addEventListener('mousemove', () => {
            if (this.isHideCompletly) return;
            this.lastMouseMoveTime = Date.now();
            this.showTooltip();
        });

        // 마우스가 페이지 밖으로 나갈 때 툴팁 숨기기
        document.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });

        // 0.2초마다 마우스 상태 체크
        this.mouseCheckInterval = setInterval(() => {
            if (this.isHideCompletly) return;
            const currentTime = Date.now();
            const timeSinceLastMove = currentTime - this.lastMouseMoveTime;
            
            // 2초 이상 마우스가 움직이지 않았고, 편집 중이 아니면 툴팁 숨기기
            if (timeSinceLastMove >= 2000 && !this.isEditing && this.isVisible) {
                this.hideTooltip();
            }
        }, 200);
    }

    showTooltip() {
        if (this.timeStampDiv) {
            this.timeStampDiv.style.transition = 'opacity 0.3s ease-in-out';
            this.timeStampDiv.style.opacity = '1';
            this.isVisible = true;
        }
        if (this.syncButton) {
            this.syncButton.style.transition = 'opacity 0.3s ease-in-out';
            this.syncButton.style.opacity = '1';
        }
    }

    hideTooltip() {
        if (this.timeStampDiv && !this.isEditing) {
            this.timeStampDiv.style.transition = 'opacity 0.5s ease-in-out';
            this.timeStampDiv.style.opacity = '0.1';
            this.isVisible = false;
        }
        if (this.syncButton) {
            this.syncButton.style.transition = 'opacity 0.5s ease-in-out';
            this.syncButton.style.opacity = '0.1';
        }
    }

    createTooltip() {
        if (!this.timeStampDiv) {
            // 툴팁을 담는 컨테이너 생성
            this.tooltipContainer = document.createElement("div");
            this.tooltipContainer.style.position = "fixed";
            this.tooltipContainer.style.bottom = "20px";
            this.tooltipContainer.style.right = "20px";
            this.tooltipContainer.style.display = "flex";
            this.tooltipContainer.style.alignItems = "center";
            this.tooltipContainer.style.gap = "5px";
            this.tooltipContainer.style.zIndex = "1000";
            
            // Sync 버튼 생성
            this.syncButton = document.createElement("button");
            this.syncButton.title = "열려있는 다른 vod를 이 시간대로 동기화";
            this.syncButton.style.background = "none";
            this.syncButton.style.border = "none";
            this.syncButton.style.cursor = "pointer";
            this.syncButton.style.width = "32px";
            this.syncButton.style.height = "32px";
            this.syncButton.style.padding = "0";
            this.syncButton.style.opacity = "1";
            this.syncButton.style.borderRadius = "8px";
            this.syncButton.style.overflow = "hidden";
            
            // 아이콘 이미지 추가
            const iconImage = document.createElement("img");
            if (isChromeExtension){
                iconImage.src = chrome.runtime.getURL("res/img/broadcastSync.png");
            }
            else{
                iconImage.src = "https://raw.githubusercontent.com/AINukeHere/VOD-Synchronizer/main/res/img/broadcastSync.png";
            }
            iconImage.style.width = "100%";
            iconImage.style.height = "100%";
            iconImage.style.objectFit = "fill";
            iconImage.style.borderRadius = "8px";
            this.syncButton.appendChild(iconImage);            
            this.syncButton.addEventListener('click', this.handleBroadcastSyncButtonClick.bind(this));
            
            // 툴팁 div 생성
            this.timeStampDiv = document.createElement("div");
            this.timeStampDiv.style.background = "black";
            this.timeStampDiv.style.color = "white";
            this.timeStampDiv.style.padding = "8px 12px";
            this.timeStampDiv.style.borderRadius = "5px";
            this.timeStampDiv.style.fontSize = "14px";
            this.timeStampDiv.style.whiteSpace = "nowrap";
            this.timeStampDiv.style.display = "block";
            this.timeStampDiv.style.opacity = "1";
            this.timeStampDiv.contentEditable = "false";
            this.timeStampDiv.title = "더블클릭하여 수정, 수정 후 Enter 키 누르면 적용";
            
            // 컨테이너에 버튼과 툴팁 추가
            this.tooltipContainer.appendChild(this.syncButton);
            this.tooltipContainer.appendChild(this.timeStampDiv);
            document.body.appendChild(this.tooltipContainer);

            this.timeStampDiv.addEventListener("dblclick", () => {
                this.timeStampDiv.contentEditable = "true";
                this.timeStampDiv.focus();
                this.isEditing = true;
                this.timeStampDiv.style.outline = "2px solid red"; 
                this.timeStampDiv.style.boxShadow = "0 0 10px red";
                // 편집 중일 때는 투명화 방지
                this.showTooltip();
            });

            this.timeStampDiv.addEventListener("blur", () => {
                this.timeStampDiv.contentEditable = "false";
                this.isEditing = false;
                this.timeStampDiv.style.outline = "none";
                this.timeStampDiv.style.boxShadow = "none";
            });

            this.timeStampDiv.addEventListener("keydown", (event) => {
                // 편집 모드일 때만 이벤트 차단
                if (this.isEditing) {
                    // 숫자 키 (0-9) - 영상 점프 기능만 차단하고 텍스트 입력은 허용
                    if (/^[0-9]$/.test(event.key)) {
                        // 영상 플레이어의 키보드 이벤트만 차단
                        event.stopPropagation();
                        return;
                    }

                    // 방향키 - 영상 앞으로/뒤로 이동 기능 차단
                    if (event.key === "ArrowUp" || event.key === "ArrowDown" || 
                        event.key === "ArrowLeft" || event.key === "ArrowRight") {
                        event.stopPropagation();
                        return;
                    }
                }

                // Enter 키 처리
                if (event.key === "Enter") {
                    event.preventDefault();
                    this.processTimestampInput(this.timeStampDiv.innerText.trim());
                    this.timeStampDiv.contentEditable = "false";
                    this.timeStampDiv.blur();
                    this.isEditing = false;
                    return;
                }
            });

            // 복사 이벤트 처리 - 텍스트만 복사되도록
            this.timeStampDiv.addEventListener("copy", (event) => {
                const selectedText = window.getSelection().toString();
                if (selectedText) {
                    event.clipboardData.setData("text/plain", selectedText);
                    event.preventDefault();
                }
            });
        }
    }

    handleBroadcastSyncButtonClick(e) {
        const request_vod_ts = this.getCurDateTime();
        if (!request_vod_ts) {
            this.warn("현재 재생 중인 VOD의 라이브 당시 시간을 가져올 수 없습니다. 전역 동기화 실패.");
            return;
        }
        e.stopPropagation();

        if (isChromeExtension){
            try{
                chrome.runtime.sendMessage({action: 'broadCastSync', request_vod_ts: request_vod_ts.getTime()});
            } catch (error) {
                console.warn('[VOD Synchronizer] 전역 동기화 요청 실패. 확장프로그램이 리로드되었거나 비활성화된 것 같습니다. 페이지를 새로고침하십시오.', error);
            }
        }
        else{
            this.channel.postMessage({action: 'broadCastSync', request_vod_ts: request_vod_ts.getTime()});
        }
    }

    updateTooltip() {
        if (!this.timeStampDiv || this.isEditing) return;
        
        const dateTime = this.getCurDateTime();
        
        if (dateTime) {
            this.isControllableState = true;
            this.timeStampDiv.innerText = dateTime.toLocaleString("ko-KR");
        }
        if (this.isPlaying() === true)
        { 
            // 전역 시간 동기화 요청 체크
            if (this.request_vod_ts != null){
                const streamPeriod = this.getStreamPeriod();
                if (streamPeriod){
                    if (this.request_real_ts == null){
                        this.log("시차 적용하지않고 동기화 시도");
                        if (!this.moveToGlobalTS(this.request_vod_ts, false)){
                            window.close();
                        }
                    }
                    else{
                        const currentSystemTime = Date.now();
                        const timeDifference = currentSystemTime - this.request_real_ts;
                        this.log("시차 적용하여 동기화 시도. 시차: " + timeDifference);
                        const adjustedGlobalTS = this.request_vod_ts + timeDifference; 
                        if (!this.moveToGlobalTS(adjustedGlobalTS, false)){
                            window.close();
                        }
                    }
                    this.request_vod_ts = null;
                    this.request_real_ts = null;
                }
            }
            // 로컬 시간 동기화 요청 체크
            if (this.request_local_ts != null){
                this.log("playback time으로 동기화 시도");
                if (!this.moveToPlaybackTime(this.request_local_ts, false)){
                    this.log('동기화 실패. 창을 닫습니다.');
                    window.close();
                }
                this.request_local_ts = null;
            }
        }
    }

    // 플랫폼별로 구현해야 하는 추상 메서드들
    observeDOMChanges() {
        throw new Error("observeDOMChanges must be implemented by subclass");
    }

    getCurDateTime() {
        throw new Error("getCurDateTime must be implemented by subclass");
    }

    getStreamPeriod() {
        throw new Error("getStreamPeriod must be implemented by subclass");
    }

    // 현재 재생 중인지 여부를 반환하는 추상 메서드
    isPlaying() {
        throw new Error("isPlaying must be implemented by subclass");
    }

    // 활성화/비활성화 메서드
    enable() {
        this.isHideCompletly = false;
        if (this.tooltipContainer) {
            this.tooltipContainer.style.display = 'flex';
        }
        this.log('툴팁 나타남');
    }

    disable() {
        this.isHideCompletly = true;
        if (this.tooltipContainer) {
            this.tooltipContainer.style.display = 'none';
        }
        this.log('툴팁 숨김');
    }

    processTimestampInput(input) {
        const match = input.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(오전|오후)\s*(\d{1,2}):(\d{2}):(\d{2})/);
        
        if (!match) {
            alert("유효한 타임스탬프 형식을 입력하세요. (예: 2024. 10. 22. 오전 5:52:55)");
            return;
        }
    
        let [_, year, month, day, period, hour, minute, second] = match;
        year = parseInt(year);
        month = parseInt(month) - 1; // JavaScript의 Date는 0부터 시작하는 월을 사용
        day = parseInt(day);
        hour = parseInt(hour);
        minute = parseInt(minute);
        second = parseInt(second);
    
        // 오전/오후 변환
        if (period === "오후" && hour !== 12) {
            hour += 12;
        } else if (period === "오전" && hour === 12) {
            hour = 0;
        }
    
        const globalDateTime = new Date(year, month, day, hour, minute, second);
        
        if (isNaN(globalDateTime.getTime())) {
            alert("유효한 날짜로 변환할 수 없습니다.");
            return;
        }
    
        this.moveToGlobalTS(globalDateTime.getTime());
    }

    /**
     * @description 전역 시간으로 영상 시간 맞춤
     * @param {number} globalTS
     * @param {boolean} doAlert 
     * @returns 
     */
    moveToGlobalTS(globalTS, doAlert = true) {
        const streamPeriod = this.getStreamPeriod();
        if (!streamPeriod) {
            if (doAlert) {
                alert("VOD 정보를 가져올 수 없습니다.");
            }
            return false;
        }
        
        const [streamStartDateTime, streamEndDateTime] = streamPeriod;
        const globalDateTime = new Date(parseInt(globalTS));

        if (streamStartDateTime > globalDateTime || globalDateTime > streamEndDateTime) {
            if (doAlert) {
                alert("입력한 타임스탬프가 방송 기간 밖입니다.");
            }
            return false;
        }
        
        const playbackTime = Math.floor((globalDateTime.getTime() - streamStartDateTime.getTime()) / 1000);
        return this.moveToPlaybackTime(playbackTime, doAlert);
    }

    /**
     * @description 영상 시간을 설정
     * @param {number} playbackTime 
     * @param {boolean} doAlert 
     */
    moveToPlaybackTime(playbackTime, doAlert = true) {
        throw new Error("applyPlaybackTime must be implemented by subclass");
    }
}
        const MAX_DURATION_DIFF = 30*1000;
        class SoopTimestampManager extends TimestampManagerBase {
    constructor() {
        super();
        this.observer = null;
        this.playTimeTag = null;
        this.curVodInfo = null;
        this.timeLink = null;
        this.isEditedVod = false; // 다시보기의 일부분이 편집된 상태인가
        this.debug('loaded');

        this.vodInfoLoaded = false; // 현재 vod의 정보를 로드했는가
        this.tagLoaded = false; // 현재 VOD 플레이어의 요소를 로드했는가 (video, playTimeTag)
        this.updating = false; // 현재 VOD 정보와 태그를 업데이트 중인가
        const checkerInterval = setInterval(async () => {
            if (this.updating) return;
            if (!this.vodInfoLoaded || !this.tagLoaded)
                this.reloadAll();
        }, 100);

        this.simpleLoopSetting();
    }

    simpleLoopSetting(){
        const LABEL_TEXT = '반복 재생';
        const EM_TEXT_IDLE = '(added by VODSync)';
        this.loop_playing = false;
        setInterval(()=>{

            // 반복재생 설정이 켜져있고 비디오 태그를 찾은 경우
            if (this.tagLoaded && this.loop_playing){
                // 현재 재생 시간이 영상 전체 재생 시간과 같은 경우 처음으로 이동
                if (this.getCurPlaybackTime() === Math.floor(this.curVodInfo.total_file_duration / 1000)){
                    this.moveToPlaybackTime(0);
                    // 비디오 태그가 일시정지 상태인 경우 재생
                    if (this.videoTag.paused){
                        this.videoTag.play();
                    }
                }
            }

            //반복 재생 설정 메뉴 추가 로직
            const settingList = document.querySelector('.setting_list');
            if (!settingList) return; // 설정 창을 열지 않음.
            if (settingList.classList.contains('subLayer_on')) return; // 서브 레이어가 열려있으면 추가하지 않음.
            const ul = settingList.childNodes[0];
            const _exists = ul.querySelector('#VODSync');
            if (_exists) return; // 이미 추가되어 있음.
            
            const li = document.createElement('li');
            li.className = 'switchBtn_wrap loop_playing';
            li.id = 'VODSync';
            const label = document.createElement('label');
            label.for = 'loop_playing';
            label.innerText = LABEL_TEXT;
            const em = document.createElement('em');
            em.innerText = EM_TEXT_IDLE;
            em.style.color = '#c7cad1';
            // em.style.fontSize = '12px';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'loop_playing';
            input.checked = this.loop_playing;
            input.addEventListener('change',()=> {
                const a = document.querySelector('#VODSync input');
                this.loop_playing = a.checked;
                if (this.loop_playing){
                    const autoPlayInput = document.querySelector('#autoplayChk');
                    if (autoPlayInput && autoPlayInput.checked){
                        autoPlayInput.click();
                    }
                }
                this.debug('loop_playing: ', this.loop_playing);
            });
            const span = document.createElement('span');
            label.appendChild(em);
            label.appendChild(input);
            label.appendChild(span);
            li.appendChild(label);
            ul.appendChild(li);
            
        },100);
    }

    async loadVodInfo(){
        const url = new URL(window.location.href);
        const match = url.pathname.match(/\/player\/(\d+)/);
        this.videoId = match[1];
        const vodInfo = await window.VODSync.soopAPI.GetSoopVodInfo(this.videoId);
        if (!vodInfo || !vodInfo.data) return;
        const splitres = vodInfo.data.write_tm.split(' ~ ');
        this.curVodInfo = {
            type: vodInfo.data.file_type,
            startDate: new Date(splitres[0]),
            endDate: splitres[1] ? new Date(splitres[1]) : null,
            files: vodInfo.data.files,
            total_file_duration: vodInfo.data.total_file_duration,
            originVodInfo: null, // 원본 다시보기의 정보
        }
        // 클립은 라이브나 다시보기에서 생성될 수 있고 캐치는 클립에서도 생성될 수 있음.
        // 현재 페이지가 클립이거나 캐치인 경우 원본 VOD의 정보를 읽음
        if (this.curVodInfo.type === 'NORMAL'){
            return;
        }
        else if (this.curVodInfo.type === 'CLIP' || this.curVodInfo.type === 'CATCH'){
            if (vodInfo.data.original_clip_scheme){
                const searchParamsStr = vodInfo.data.original_clip_scheme.split('?')[1];
                const params = new URLSearchParams(searchParamsStr);
                const originVodType = params.get('type');
                const originVodId = params.get('title_no');
                const originVodChangeSecond = parseInt(params.get('changeSecond'));
                const originVodInfo = await window.VODSync.soopAPI.GetSoopVodInfo(originVodId);
                if (originVodInfo && originVodInfo.data){
                    const splitres = originVodInfo.data.write_tm.split(' ~ ');
                    // 원본 VOD가 다시보기인 경우 원본 VOD의 정보를 읽음
                    if (originVodType === 'REVIEW'){
                        this.curVodInfo.originVodInfo = {
                            type: originVodInfo.data.file_type,
                            startDate: new Date(splitres[0]),
                            endDate: new Date(splitres[1]),
                            files: originVodInfo.data.files,
                            total_file_duration: originVodInfo.data.total_file_duration,
                            originVodChangeSecond: originVodChangeSecond, // 원본 다시보기에서 현재 vod의 시작 시점의 시작 시간
                        }
                        this.curVodInfo.startDate = new Date(this.curVodInfo.originVodInfo.startDate.getTime() + originVodChangeSecond * 1000);
                        this.curVodInfo.endDate = new Date(this.curVodInfo.startDate.getTime() + this.curVodInfo.total_file_duration);
                    }
                    // 원본 VOD가 클립인 경우 클립의 원본 VOD(다시보기) 정보를 읽음
                    else if (originVodType === 'CLIP'){
                        if (originVodInfo.data.original_clip_scheme){
                            const searchParamsStr = originVodInfo.data.original_clip_scheme.split('?')[1];
                            const params = new URLSearchParams(searchParamsStr);
                            const originOriginVodType = params.get('type');
                            if (originOriginVodType === 'REVIEW'){
                                const originOriginVodId = params.get('title_no');
                                const originOriginVodChangeSecond = parseInt(params.get('changeSecond'));
                                const originOriginVodInfo = await window.VODSync.soopAPI.GetSoopVodInfo(originOriginVodId);
                                if (originOriginVodInfo && originOriginVodInfo.data){
                                    const splitres = originOriginVodInfo.data.write_tm.split(' ~ ');
                                    this.curVodInfo.originVodInfo = {
                                        type: originOriginVodInfo.data.file_type,
                                        startDate: new Date(splitres[0]),
                                        endDate: new Date(splitres[1]),
                                        files: originOriginVodInfo.data.files,
                                        total_file_duration: originOriginVodInfo.data.total_file_duration,
                                        originVodChangeSecond: originVodChangeSecond + originOriginVodChangeSecond, // 원본 다시보기에서 현재 vod의 시작 시점의 시작 시간
                                    };
                                    this.curVodInfo.startDate = new Date(this.curVodInfo.originVodInfo.startDate.getTime() + (originVodChangeSecond+originOriginVodChangeSecond) * 1000);
                                    this.curVodInfo.endDate = new Date(this.curVodInfo.startDate.getTime() + this.curVodInfo.total_file_duration);
                                }
                            }
                            else{
                                this.warn(`${this.videoId}를 제보해주시기 바랍니다.\n[VOD Synchronizer 설정] > [문의하기]`);
                            }
                        }
                    }
                }
            }
            else{
                this.curVodInfo.startDate = null;
                this.curVodInfo.endDate = null;
                this.log('원본 다시보기와 연결되어 있지 않은 VOD입니다.');
                return;
            }
        }
        const calcedTotalDuration = this.curVodInfo.endDate.getTime() - this.curVodInfo.startDate.getTime();
        const durationDiff = Math.abs(calcedTotalDuration - this.curVodInfo.total_file_duration);
        this.debug('오차: ', durationDiff);
        if (durationDiff < MAX_DURATION_DIFF){
            this.isEditedVod = false;
        }
        else{
            this.isEditedVod = true;
            this.log('영상 전체 재생 시간과 계산된 재생 시간이 다릅니다.');
        }
        this.vodInfoLoaded = true;
        this.log('영상 정보 로드 완료');
    }

    async reloadAll(){
        if (this.updating) return;
        const newPlayTimeTag = document.querySelector('span.time-current');
        let newVideoTag = document.querySelector('#video');
        if (newVideoTag === null)
            newVideoTag = document.querySelector('#video_p');
        
        if (!newPlayTimeTag || !newVideoTag) return;
        if (newPlayTimeTag !== this.playTimeTag || newVideoTag !== this.videoTag) {
            this.updating = true;
            this.vodInfoLoaded = false;
            this.tagLoaded = false;
            this.log('VOD 변경 감지됨! 요소 업데이트 중...');
            this.loadVodInfo().then(() => {
                // this.log('vodInfo 갱신됨', this.curVodInfo);
                this.playTimeTag = document.querySelector('span.time-current');
                // this.log('playTimeTag 갱신됨', this.playTimeTag);
                this.videoTag = document.querySelector('#video');
                if (this.videoTag === null)
                    this.videoTag = document.querySelector('#video_p');
                // this.log('videoTag 갱신됨', this.videoTag);
                this.updating = false;
                if (this.playTimeTag !== null && this.videoTag !== null)
                    this.tagLoaded = true;
                else
                    this.tagLoaded = false;
            });
        }
    }

    observeDOMChanges() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        this.observer = new MutationObserver(() => {
            this.reloadAll();
        });

        this.observer.observe(targetNode, config);
    }

    getStreamPeriod(){
        if (!this.curVodInfo || this.curVodInfo.type === 'NORMAL') return null;
        const startDate = this.curVodInfo.originVodInfo === null ? this.curVodInfo.startDate : this.curVodInfo.originVodInfo.startDate;
        const endDate = this.curVodInfo.originVodInfo === null ? this.curVodInfo.endDate : this.curVodInfo.originVodInfo.endDate;
        return [startDate, endDate];
    }

    playbackTimeToGlobalTS(totalPlaybackSec){
        if (!this.vodInfoLoaded) return null;
        const reviewStartDate = this.curVodInfo.originVodInfo === null ? this.curVodInfo.startDate : this.curVodInfo.originVodInfo.startDate;
        const reviewDataFiles = this.curVodInfo.originVodInfo === null ? this.curVodInfo.files : this.curVodInfo.originVodInfo.files;
        const deltaTimeSec = this.curVodInfo.originVodInfo === null ? 0 : this.curVodInfo.originVodInfo.originVodChangeSecond;
        
        // 시간오차가 임계값 이하이거나 다시보기 구성 파일이 1개인 경우
        if (!this.isEditedVod || reviewDataFiles.length === 1){
            return new Date(reviewStartDate.getTime() + (totalPlaybackSec + deltaTimeSec)*1000);
        }

        if (this.isEditedVod && reviewDataFiles.length > 1 && this.curVodInfo.type !== 'REVIEW'){
            this.warn(`${this.videoId}를 제보해주시기 바랍니다.\n[VOD Synchronizer 설정] > [문의하기]`);
            return null;
        }
        
        let cumulativeTime = 0;
        for (let i = 0; i < reviewDataFiles.length; ++i){
            const file = reviewDataFiles[i];
            const localPlaybackTime = totalPlaybackSec*1000 - cumulativeTime;
            const hour = Math.floor(localPlaybackTime / 3600000);
            const minute = Math.floor((localPlaybackTime % 3600000) / 60000);
            const second = Math.floor((localPlaybackTime % 60000) / 1000);
            // this.log(`localPlaybackTime: ${hour}:${minute}:${second}`);    
            if (localPlaybackTime > file.duration){
                cumulativeTime += file.duration;
                continue;
            }
            const startTime = new Date(file.file_start);
            return new Date(startTime.getTime() + localPlaybackTime);
        }
        return null;
    }
    globalTSToPlaybackTime(globalTS){
        if (!this.vodInfoLoaded || !this.tagLoaded) return null;
        const reviewStartDate = this.curVodInfo.originVodInfo === null ? this.curVodInfo.startDate : this.curVodInfo.originVodInfo.startDate;
        const reviewDataFiles = this.curVodInfo.originVodInfo === null ? this.curVodInfo.files : this.curVodInfo.originVodInfo.files;
        const deltaTimeSec = this.curVodInfo.originVodInfo === null ? 0 : this.curVodInfo.originVodInfo.originVodChangeSecond;
        
        // 시간오차가 임계값 이하이거나 다시보기 구성 파일이 1개인 경우
        if (!this.isEditedVod || reviewDataFiles.length === 1){
            const temp = reviewStartDate.getTime();
            const temp2 = (globalTS - temp) / 1000;
            return Math.floor(temp2) - deltaTimeSec;
        }
        if (this.isEditedVod && reviewDataFiles.length > 1 && this.curVodInfo.type !== 'REVIEW'){
            this.warn(`${this.videoId}를 제보해주시기 바랍니다.\n[VOD Synchronizer 설정] > [문의하기]`);
            return null;
        }

        let cumulativeTime = 0;
        for (let i = 0; i < reviewDataFiles.length; ++i){
            const file = reviewDataFiles[i];
            const fileStartDate = new Date(file.file_start);
            const fileEndDate = new Date(fileStartDate.getTime() + file.duration);
            if (fileStartDate.getTime() <= globalTS && globalTS <= fileEndDate.getTime()){
                return Math.floor((globalTS - fileStartDate.getTime() + cumulativeTime) / 1000);
            }
            cumulativeTime += file.duration;
        }
        return null;
    }

    /**
     * @override
     * @description 현재 영상이 스트리밍된 당시 시간을 반환
     * @returns {Date} 현재 영상이 스트리밍된 당시 시간
     * @returns {null} 영상 정보를 가져올 수 없음. 의도치않은 상황 발생
     * @returns {string} 당시 시간을 계산하지 못한 오류 메시지.
     */
    getCurDateTime(){
        const totalPlaybackSec = this.getCurPlaybackTime();
        if (totalPlaybackSec === null) return null;

        if (this.curVodInfo.type === 'NORMAL') return '업로드 VOD는 지원하지 않습니다.';
        if (this.curVodInfo.startDate === null && 
            this.curVodInfo.endDate === null && 
            this.curVodInfo.originVodInfo === null) {
                return '원본 다시보기와 연결되어 있지 않은 VOD입니다.';
        }

        const globalTS = this.playbackTimeToGlobalTS(totalPlaybackSec);
        return globalTS;
    }

    /**
     * @description 현재 재생 시간을 초 단위로 반환
     * @returns {number} 현재 재생 시간(초)
     * @returns {null} 재생 시간을 계산할 수 없음. 의도치않은 상황 발생
     */
    getCurPlaybackTime(){
        if (!this.playTimeTag) return null;
        const totalPlaybackTimeStr = this.playTimeTag.innerText.trim();
        const splitres = totalPlaybackTimeStr.split(':');
        let totalPlaybackSec = 0;
        if (splitres.length === 3){
            totalPlaybackSec = (parseInt(splitres[0]) * 3600 + parseInt(splitres[1]) * 60 + parseInt(splitres[2]));
        }
        else if (splitres.length === 2){
            totalPlaybackSec = (parseInt(splitres[0]) * 60 + parseInt(splitres[1]));
        }
        else{
            this.warn(`${this.videoId}를 제보해주시기 바랍니다.\n[VOD Synchronizer 설정] > [문의하기]`);
            return null;
        }
        return totalPlaybackSec;
    }

    /**
     * @override
     * @description 영상 시간을 설정
     * @param {number} globalTS (milliseconds)
     * @param {boolean} doAlert 
     * @returns {boolean} 성공 여부
     */
    async moveToGlobalTS(globalTS, doAlert = true) {
        const playbackTime = await this.globalTSToPlaybackTime(globalTS);
        if (playbackTime === null) return false;
        const maxPlaybackTime = Math.floor(this.curVodInfo.total_file_duration / 1000);
        if (playbackTime < 0 || playbackTime > maxPlaybackTime){
            const errorMessage = `재생 시간 범위를 벗어납니다. (${playbackTime < 0 ? playbackTime : playbackTime - maxPlaybackTime}초 초과됨)`;
            if (doAlert) 
                alert(errorMessage);
            this.warn(errorMessage);
            return false;
        }
        return this.moveToPlaybackTime(playbackTime, doAlert);
    }

    moveToPlaybackTime(playbackTime, doAlert = true) {
        const url = new URL(window.location.href);
        url.searchParams.set('change_second', playbackTime);
        /// 페이지를 새로고침 하는 방식
        // window.location.replace(url.toString());
        // return true;

        /// soop 댓글 타임라인 기능을 사용하는 방식
        // URL에 change_second 파라미터 추가
        window.history.replaceState({}, '', url.toString());
        const jumpInterval = setInterval(()=>{
            if (this.getCurPlaybackTime() === playbackTime){
                clearInterval(jumpInterval);
                return;
            }
            if (this.timeLink === null) {
                this.timeLink = document.createElement('a');
                document.body.appendChild(this.timeLink);
            }
            this.timeLink.className = 'time_link';
            this.timeLink.setAttribute('data-time', playbackTime.toString());
            this.timeLink.click();
            this.debug('timeLink 클릭됨');
        }, 100);
        return true;
    }

    // 현재 재생 중인지 여부 반환
    isPlaying() {
        if (this.videoTag) {
            return !this.videoTag.paused;
        }
        return false;
    }
}
        class VODLinkerBase extends IVodSync{
    constructor(isInIframe = false){
        super();
        this.BTN_TEXT_IDLE = "Sync VOD";
        this.SYNC_BUTTON_CLASSNAME = 'vodSync-sync-btn';
        if (isInIframe){
            const searchParams = new URLSearchParams(window.location.search);
            if (searchParams.get('only_search') === '1'){
                this.setupSearchAreaOnlyMode();
            }
            window.addEventListener('message', this.handleWindowMessage.bind(this));
            this.getRequestVodDate = () => {return new Date(this.request_vod_ts);}
            this.getRequestRealTS = () => {
                if (this.request_real_ts){
                    return this.request_real_ts;
                }
                return null;
            }
        }
        else{
            this.getRequestVodDate = () => {return window.VODSync?.tsManager?.getCurDateTime();}
            this.getRequestRealTS = () => {
                if (window.VODSync?.tsManager?.isPlaying()){ // 재생 중인경우 페이지 로딩 시간을 보간하기위해 탭 연 시점을 전달
                    return Date.now();
                }
                return null;
            }
        }
        this.startSyncButtonManagement();
        this.setupSearchInputKeyboardHandler();
    }
    // 주기적으로 동기화 버튼 생성 및 업데이트
    startSyncButtonManagement() {
        setInterval(() => {
            const requestDate = this.getRequestVodDate();
            // 타임스탬프 매니저가 vod 정보를 불러오지 못한 경우 동기화 버튼 생성 안함
            if (!this.isValidDate(requestDate)) return;

            const targets = this.getTargetsForCreateSyncButton();
            if (!targets) return;

            targets.forEach(element => {
                if (element.querySelector(`.${this.SYNC_BUTTON_CLASSNAME}`)) return; // 이미 동기화 버튼이 있음
                const button = this.createSyncButton();
                button.addEventListener('click', (e) => this.handleFindVODButtonClick(e, button));
                element.appendChild(button);
            });
        }, 500);
    }
    // 동기화 버튼 onclick 핸들러
    async handleFindVODButtonClick(e, button){
        e.preventDefault();       // a 태그의 기본 이동 동작 막기
        e.stopPropagation();      // 이벤트 버블링 차단

        // 스트리머 ID 검색
        const streamerName = this.getStreamerName(button);
        if (!streamerName) {
            alert("검색어를 찾을 수 없습니다.");
            button.innerText = this.BTN_TEXT_IDLE;
            return;
        }
        button.innerText = `${streamerName}로 ID 검색 중`;
        const streamerId = await this.getStreamerId(streamerName);
        if (!streamerId) {
            alert(`${streamerName}의 스트리머 ID를 찾지 못했습니다.`);
            button.innerText = this.BTN_TEXT_IDLE;
            return;
        }
        this.debug(`스트리머 ID: ${streamerId}`);

        const requestDate = this.getRequestVodDate();
        const request_real_ts = this.getRequestRealTS();
        
        if (!this.isValidDate(requestDate)){
            this.warn("타임스탬프 정보를 받지 못했습니다.");
            button.innerText = this.BTN_TEXT_IDLE;
            return;
        }
        if (typeof requestDate === 'string'){
            this.warn(requestDate);
            button.innerText = this.BTN_TEXT_IDLE;
            alert(requestDate);
            return;
        }

        button.innerText = `${streamerName}의 VOD 검색 중...`;
        const vodInfo = await this.findVodByDatetime(button, streamerId, streamerName, requestDate);
        if (!vodInfo){
            alert("동기화할 다시보기를 찾지 못했습니다.");
            button.innerText = this.BTN_TEXT_IDLE;
            return;
        }
        this.log(`다시보기 정보: ${vodInfo.vodLink}, ${vodInfo.startDate}, ${vodInfo.endDate}`);
        const url = new URL(vodInfo.vodLink);
        const change_second = Math.round((requestDate.getTime() - vodInfo.startDate.getTime()) / 1000);
        url.searchParams.set('change_second', change_second);
        url.searchParams.set('request_vod_ts', requestDate.getTime());
        if (request_real_ts){
            url.searchParams.set('request_real_ts', request_real_ts);
        }
        window.open(url, "_blank");
        this.log(`VOD 링크: ${url.toString()}`);
        button.innerText = this.BTN_TEXT_IDLE;
        this.closeSearchArea();
    }
    isValidDate(date){
        return date instanceof Date && !isNaN(date.getTime());
    }
    // 상위 페이지에서 타임스탬프 정보를 받음 (other sync panel에서 iframe으로 열릴 때 사용)
    handleWindowMessage(e){
        if (e.data.response === "SET_REQUEST_VOD_TS"){
            this.request_vod_ts = e.data.request_vod_ts;
            this.request_real_ts = e.data.request_real_ts;
            // this.log("REQUEST_VOD_TS 받음:", e.data.request_vod_ts, e.data.request_real_ts);
        }
    }
    /**
     * @description 검색 결과 페이지에서 검색 영역만 남기게 함. (other sync panel에서 iframe으로 열릴 때 사용)
     */
    setupSearchAreaOnlyMode() {
        document.documentElement.style.overflow = "hidden";
        // 파생 클래스들이 오버라이드하여 구현하되 super.setupSearchAreaOnlyMode()를 호출해야함
        
    }
    /**
     * @description 동기화 버튼을 생성할 요소를 반환
     * @returns {NodeList} 동기화 버튼을 생성할 요소들
     */
    getTargetsForCreateSyncButton(){
        // 파생 클래스들이 오버라이드하여 구현해야함
        throw new Error("Not implemented");
    }
    /**
     * @description 동기화 버튼을 생성
     * @returns {HTMLButtonElement} 동기화 버튼
     */
    createSyncButton(){
        // 파생 클래스들이 오버라이드하여 구현해야함
        throw new Error("Not implemented");
    }
    /**
     * @description 스트리머 이름을 반환
     * @param {HTMLButtonElement} button 동기화 버튼
     * @returns {string} 스트리머 이름
     */
    getStreamerName(button){
        // 파생 클래스들이 오버라이드하여 구현해야함
        throw new Error("Not implemented");
    }
    /**
     * @description 스트리머 ID를 반환
     * @param {string} searchWord 검색어
     * @returns {string} 스트리머 ID
     */
    async getStreamerId(searchWord){
        // 파생 클래스들이 오버라이드하여 구현해야함
        throw new Error("Not implemented");
    }
    /**
     * @description 다시보기를 찾음
     * @param {HTMLButtonElement} button 동기화 버튼
     * @param {string} streamerId 스트리머 ID
     * @param {string} streamerName 스트리머 이름
     * @param {Date} requestDate 요청 시간
     * @returns {Object} {vodLink: string, startDate: Date, endDate: Date} or null
     */
    async findVodByDatetime(button, streamerId, streamerName, requestDate) {
        // 파생 클래스들이 오버라이드하여 구현해야함
        throw new Error("Not implemented");
    }
    /**
     * @description 검색 영역을 닫음
     */
    closeSearchArea(){
        // 파생 클래스들이 오버라이드하여 구현해야함
        throw new Error("Not implemented");
    }
    /**
     * @description 검색창 요소를 반환
     * @returns {HTMLInputElement|null} 검색창 input 요소
     */
    getSearchInputElement(){
        // 파생 클래스들이 오버라이드하여 구현해야함
        return null;
    }
    /**
     * @description 검색창에 키보드 이벤트 핸들러 설정 (Ctrl+Shift+Enter로 SyncVOD 버튼 클릭)
     */
    setupSearchInputKeyboardHandler() {
        // 검색창이 동적으로 생성될 수 있으므로 주기적으로 확인
        setInterval(() => {
            const searchInput = this.getSearchInputElement();
            if (!searchInput) return;
            
            // 이미 이벤트 리스너가 추가되어 있는지 확인
            if (searchInput.dataset.vodSyncHandlerAdded === 'true') return;
            
            searchInput.addEventListener('keydown', (e) => {
                // Ctrl+Shift+Enter 감지
                if (e.key === 'Enter' && e.ctrlKey && e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const syncButton = document.querySelector(`.${this.SYNC_BUTTON_CLASSNAME}`);
                    if (syncButton) {
                        syncButton.click();
                    }
                }
            });
            
            // 이벤트 리스너가 추가되었음을 표시
            searchInput.dataset.vodSyncHandlerAdded = 'true';
        }, 500);
    }
}
        class SoopVODLinker extends VODLinkerBase{
    /**
     * @description 검색 결과 페이지에서 검색 결과 영역만 남기고 나머지는 숨기게 함. (other sync panel에서 iframe으로 열릴 때 사용)
     * @override
     */
    setupSearchAreaOnlyMode() {
        super.setupSearchAreaOnlyMode();
        (function waitForGnbAndSearchArea() {
            const gnb = document.querySelector('#soop-gnb');
            const searchArea = document.querySelector('.sc-hvigdm.khASjK.topSearchArea');
            const backBtn = document.querySelector('#topSearchArea > div > div > button');
            let allDone = true;
            if (gnb) {
                Array.from(gnb.parentNode.children).forEach(sibling => {
                    if (sibling !== gnb) sibling.style.display = 'none';
                });
            } else {
                allDone = false;
            }
            if (searchArea) {
                searchArea.style.display = "flow";
                Array.from(searchArea.parentNode.children).forEach(sibling => {
                    if (sibling !== searchArea) sibling.remove();
                });
            } else {
                allDone = false;
            }
            if (backBtn) {
                backBtn.style.display = "none";
            } else {
                allDone = false;
            }
            document.body.style.background = 'white';
            if (!allDone) setTimeout(waitForGnbAndSearchArea, 200);
        })();
    }
    getTargetsForCreateSyncButton(){
        const targets = document.querySelectorAll('#areaSuggest > ul > li > a');
        const filteredTargets = [];
        for(const target of targets){
            if (target.querySelector('em')) continue;
            filteredTargets.push(target);
        }
        return filteredTargets;
    }
    createSyncButton(){
        const button = document.createElement("button");
        button.className = this.SYNC_BUTTON_CLASSNAME;
        button.innerText = this.BTN_TEXT_IDLE;
        button.style.background = "gray";
        button.style.fontSize = "12px";
        button.style.color = "white";
        button.style.marginLeft = "20px";
        button.style.padding = "5px";
        button.style.verticalAlign = 'middle';
        return button;
    }
    getStreamerName(button){
        const nicknameSpan = button.parentElement.querySelector('span');
        if (!nicknameSpan) return null;
        return nicknameSpan.innerText;
    }
    closeSearchArea(){
        const closeBtn = document.querySelector('.del_text');
        if (closeBtn){
            closeBtn.click();
        }
    }
    async getStreamerId(searchWord){
        const streamerId = await window.VODSync.soopAPI.GetStreamerID(searchWord);
        return streamerId;
    }
    /**
     * @description 다시보기를 찾음
     * @param {HTMLButtonElement} button 동기화 버튼
     * @param {string} streamerId 스트리머 ID
     * @param {string} streamerName 스트리머 이름
     * @param {Date} requestDate 
     * @returns {Object} {vodLink: string, startDate: Date, endDate: Date} or null
     * @override
     */
    async findVodByDatetime(button, streamerId, streamerName, requestDate) {
        const search_range_hours = 24*3;// +- 3일 동안 검색
        const search_start_date = new Date(requestDate.getTime() - search_range_hours * 60 * 60 * 1000);
        const search_end_date = new Date(requestDate.getTime() + search_range_hours * 60 * 60 * 1000);
        const vodList = await window.VODSync.soopAPI.GetSoopVOD_List(streamerId, search_start_date, search_end_date);
        const totalVodCount = vodList.data.length;
        for(let i = 0; i < totalVodCount; ++i){
            const vod = vodList.data[i];
            button.innerText = `${streamerName}의 VOD 검색 중 (${i+1}/${totalVodCount})`;
            const vodInfo = await window.VODSync.soopAPI.GetSoopVodInfo(vod.title_no);
            if (vodInfo === null){
                continue;
            }
            const period = vodInfo.data.write_tm;
            const splitres = period.split(' ~ ');
            const startDate = new Date(splitres[0]);
            const endDate = new Date(splitres[1]);
            if (startDate <= requestDate && requestDate <= endDate){
                return{
                    vodLink: `https://vod.sooplive.co.kr/player/${vod.title_no}`,
                    startDate: startDate,
                    endDate: endDate
                };
            }
        }
    }
    /**
     * @description 검색창 요소를 반환
     * @returns {HTMLInputElement|null} 검색창 input 요소
     * @override
     */
    getSearchInputElement(){
        // SOOP 검색창 선택자 (검색 결과 페이지의 검색창)
        const searchInput = document.querySelector('#search-inp');
        return searchInput || null;
    }
}

        new SoopAPI();
        const tsManager = new SoopTimestampManager();
        new SoopVODLinker();
        
        // 동기화 요청이 있는 경우 타임스탬프 매니저에게 요청
        const params = new URLSearchParams(window.location.search);
        const url_request_vod_ts = params.get("request_vod_ts");
        const url_request_real_ts = params.get("request_real_ts");
        if (url_request_vod_ts && tsManager){
            const request_vod_ts = parseInt(url_request_vod_ts);
            if (url_request_real_ts){ // 페이지 로딩 시간을 추가해야하는 경우.
                const request_real_ts = parseInt(url_request_real_ts);
                tsManager.RequestGlobalTSAsync(request_vod_ts, request_real_ts);
            }
            else{
                tsManager.RequestGlobalTSAsync(request_vod_ts);
            }
            
            // url 지우기
            const url = new URL(window.location.href);
            url.searchParams.delete('request_vod_ts');
            url.searchParams.delete('request_real_ts');
            window.history.replaceState({}, '', url.toString());
        }
    }
})(); 