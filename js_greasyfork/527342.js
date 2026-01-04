// ==UserScript==
// @name         SOOP 시청자 목록 저장
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  시청자 목록 저장
// @match        https://play.sooplive.co.kr/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/527342/SOOP%20%EC%8B%9C%EC%B2%AD%EC%9E%90%20%EB%AA%A9%EB%A1%9D%20%EC%A0%80%EC%9E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/527342/SOOP%20%EC%8B%9C%EC%B2%AD%EC%9E%90%20%EB%AA%A9%EB%A1%9D%20%EC%A0%80%EC%9E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ▼ 최대 저장 이력, 재시도 관련 상수
    const MAX_HISTORY = 10;
    const MAX_STORAGE_SIZE = 100000;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    // ▼ range1(기본 범위, 디폴트 1~10), range2(커스텀 범위, 디폴트 2~10)
    function getRange1Start() {
        return GM_getValue("range1Start", 1);
    }
    function getRange1End() {
        return GM_getValue("range1End", 10);
    }
    function getRange2Start() {
        return GM_getValue("range2Start", 2);
    }
    function getRange2End() {
        return GM_getValue("range2End", 10);
    }

    // --------------------------
    //  Slot Range Helper
    // --------------------------
    function getTotalChatCount(rawViewerCounts, start, end) {
        let sum = 0;
        for (let i = start; i <= end; i++) {
            sum += (rawViewerCounts[i] || 0);
        }
        return sum;
    }
    function getUnionOfSlots(slotViewersMap, start, end) {
        let unionSet = new Set();
        for (let i = start; i <= end; i++) {
            if (slotViewersMap[i]) {
                unionSet = new Set([...unionSet, ...slotViewersMap[i]]);
            }
        }
        return unionSet;
    }

    // --------------------------
    //  html2canvas 로드
    // --------------------------
    function loadHtml2Canvas(callback) {
        const existingScript = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"]');
        if (existingScript) {
            callback();
            return;
        }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = callback;
        document.head.appendChild(s);
    }

    // --------------------------
    //  시청자 목록 불러오기
    // --------------------------
    async function getCurrentViewerList(slot, tryCount = 0) {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        try {
            console.log(`[슬롯 ${slot}] 시청자 목록 요청 (시도: ${tryCount + 1}회)`);

            liveView.Chat.chatUserListLayer.reconnect();
            liveView.playerController.sendChUser();

            await delay(1000);
            const userList = liveView.Chat.chatUserListLayer.getUserListForSDK();
            const broadcasterName =
                document.querySelector("#infoNickName")?.textContent.trim() || "알 수 없음";

            console.log(`[슬롯 ${slot}] 시청자 목록 응답:`, userList);

            if (userList && getViewerCount(userList) > 0) {
                const fetchTime = new Date().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                saveViewerList(userList, fetchTime, slot, broadcasterName);
            } else {
                if (tryCount < MAX_RETRIES - 1) {
                    console.warn(`[슬롯 ${slot}] 시청자 목록이 비어 있음. 재시도중...`);
                    await delay(RETRY_DELAY);
                    return getCurrentViewerList(slot, tryCount + 1);
                } else {
                    console.error(`[슬롯 ${slot}] 시청자 목록 가져오기 실패`);
                    alert(`[슬롯 ${slot}] 시청자 목록을 가져오지 못했습니다.`);
                }
            }
        } catch(e) {
            console.error(`[슬롯 ${slot}] 시청자 목록 가져오기 오류:`, e);
            alert(`[슬롯 ${slot}] 시청자 목록 가져오기 실패: ${e}`);
        }
    }

    // --------------------------
    //  시청자 수 계산
    // --------------------------
    function getViewerCount(userList) {
        if (!userList) return 0;
        if (Array.isArray(userList)) {
            return userList.length;
        } else if (typeof userList === 'object') {
            return Object.values(userList).flat().length;
        }
        return 0;
    }

    // --------------------------
    //  전역 슬롯 버튼 DOM
    // --------------------------
    const slotButtons = {};

    // --------------------------
    //  슬롯 버튼 라벨 갱신
    // --------------------------
    function updateSlotButtonLabel(slot) {
        const labelData = GM_getValue(`slotLabel_${slot}`, null);
        if (!labelData || !labelData.name || !labelData.time) return;
        if (slotButtons[slot]) {
            const { name, time } = labelData;
            slotButtons[slot].innerHTML = `
                <div style="text-align: left;">${name}</div>
                <div style="text-align: left; font-size: 10px; color: #555;">${time}</div>
            `;
        }
    }

    // --------------------------
    //  시청자 목록 저장
    // --------------------------
    function saveViewerList(viewerList, fetchTime, slot, broadcasterName) {
        try {
            console.log(`[슬롯 ${slot}] 시청자 목록 저장중...`);
            let history = GM_getValue(`viewerListHistory_slot_${slot}`, []);
            history.push({ time: fetchTime, viewers: viewerList, broadcasterName });

            if (history.length > MAX_HISTORY) {
                history.shift();
            }

            let storageSize = JSON.stringify(history).length;
            while (storageSize > MAX_STORAGE_SIZE && history.length > 1) {
                history.shift();
                storageSize = JSON.stringify(history).length;
            }

            GM_setValue(`viewerListHistory_slot_${slot}`, history);
            console.log(`[슬롯 ${slot}] 시청자 목록 저장 완료.`);

            const shortTime = fetchTime.slice(fetchTime.indexOf(' ') + 1);
            GM_setValue(`slotLabel_${slot}`, { name: broadcasterName, time: shortTime });

            updateSlotButtonLabel(slot);
            alert(`[슬롯 ${slot}] 저장 완료!`);
        } catch(e) {
            console.error(`[슬롯 ${slot}] 목록 저장중 오류:`, e);
            alert(`[슬롯 ${slot}] 목록 저장중 오류: ${e}`);
        }
    }

    // --------------------------
    //  툴팁(토스트) 생성 함수
    // --------------------------
    function displayTooltip(content, tooltipId) {
        const existing = document.getElementById(tooltipId);
        if (existing) existing.remove();

        const tooltip = document.createElement('div');
        tooltip.id = tooltipId;
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '8px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '10000';
        tooltip.style.bottom = '20px';
        tooltip.style.right = '20px';
        tooltip.style.maxWidth = '300px';

        const nowStr = new Date().toLocaleString('ko-KR', {
            year:'numeric', month:'long', day:'numeric',
            hour:'2-digit', minute:'2-digit', second:'2-digit'
        });

        tooltip.innerHTML = `
            <span style="color: #CCCCCC;">
                <strong>${nowStr}</strong>
            </span><br><br>
            ${content}
        `;

        const btn = document.createElement('button');
        btn.textContent = '이미지로 저장';
        btn.style.marginTop = '10px';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '5px 10px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', (evt) => {
            evt.stopPropagation();
            btn.style.display = 'none';
            loadHtml2Canvas(() => {
                html2canvas(tooltip).then(canvas => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = `${tooltipId}.png`;
                    link.click();
                    btn.style.display = 'block';
                });
            });
        });
        tooltip.appendChild(btn);

        tooltip.addEventListener('click', (evt) => {
            if (evt.target !== btn) tooltip.remove();
        });

        document.body.appendChild(tooltip);
    }
    // --------------------------
    //   조합 생성
    // --------------------------
    function generateCombinations(arr, length) {
        function* helper(start, chosen) {
            if(chosen.length === length) {
                yield chosen;
                return;
            }
            for(let i = start; i < arr.length; i++){
                yield* helper(i+1, [...chosen, arr[i]]);
            }
        }
        return [...helper(0, [])];
    }
    // --------------------------
    //  (숫자) 접미사 제거
    // --------------------------
    function getUserIdWithoutSuffix(id) {
        // 예: aaa(1) -> aaa
        const idx = id.indexOf('(');
        return (idx !== -1) ? id.substring(0, idx).trim() : id;
    }

    // --------------------------
    //  "중복 비교" (슬롯 간)
    // --------------------------
    function compareViewerLists() {
        let slotViewersMap = {};
        let rawViewerCounts = {};
        let broadcasterNames = {};

        for (let i = 1; i <= 10; i++) {
            const history = GM_getValue(`viewerListHistory_slot_${i}`, []);
            if (history.length > 0) {
                const latest = history[history.length - 1];
                const vList = latest.viewers;
                rawViewerCounts[i] = Array.isArray(vList)
                    ? vList.length
                    : Object.values(vList).flat().length;

                broadcasterNames[i] = latest.broadcasterName || `슬롯 ${i}`;

                // 슬롯 내부 중복 제거 (aaa(1), aaa(2) -> aaa)
                if (Array.isArray(vList)) {
                    const cleanedIds = vList.map(v => getUserIdWithoutSuffix(v.id));
                    slotViewersMap[i] = new Set(cleanedIds);
                } else if (typeof vList === 'object') {
                    let tmp = [];
                    for (const group of Object.values(vList)) {
                        for(const viewer of group){
                            tmp.push(getUserIdWithoutSuffix(viewer.id));
                        }
                    }
                    slotViewersMap[i] = new Set(tmp);
                }
            }
        }

        const r1Start = getRange1Start();
        const r1End   = getRange1End();
        const r2Start = getRange2Start();
        const r2End   = getRange2End();

        let totalChat_range1 = getTotalChatCount(rawViewerCounts, r1Start, r1End);
        let union_range1 = getUnionOfSlots(slotViewersMap, r1Start, r1End);
        let unionSize1 = union_range1.size;
        let ratio1 = totalChat_range1 > 0
            ? ((unionSize1 / totalChat_range1) * 100).toFixed(1)
            : 0;

        let totalChat_range2 = getTotalChatCount(rawViewerCounts, r2Start, r2End);
        let union_range2 = getUnionOfSlots(slotViewersMap, r2Start, r2End);
        let unionSize2 = union_range2.size;
        let ratio2 = totalChat_range2 > 0
            ? ((unionSize2 / totalChat_range2) * 100).toFixed(1)
            : 0;

        let content = `<span style="color: #FFD700;"><strong>채팅 참여 인원 - 중복인원 = 중복 제거 인원:</strong></span><br>`;
        for(let i = 1; i <= 10; i++){
            if(slotViewersMap[i]){
                const tv = rawViewerCounts[i] || 0;
                const uv = slotViewersMap[i].size;
                const du = tv - uv;

                content += `<div style="
  display: grid;
  grid-template-columns: 1fr 6ch 1ch 4ch 1ch 6ch;
  gap: 4px;
  align-items: center;
  font-family: 'Consolas', 'Courier New', monospace;
">
  <span style="text-align: left;">${broadcasterNames[i]}</span>
  <span style="text-align: right;">${tv.toLocaleString()}</span>
  <span style="text-align: right;">-</span>
  <span style="text-align: right; color: #E75D44;">${du.toLocaleString()}</span>
  <span style="text-align: right;">=</span>
  <span style="text-align: right;">${uv.toLocaleString()}</span>
</div>`;
            }
        }

        // 2개씩 조합
        content += `<br><span style="color: #FFD700;"><strong>방송 간 중복 시청자 비교:</strong></span><br>`;
        const sArr = Object.keys(slotViewersMap).map(Number);
        const vArr = sArr.map(s => ({ viewersSet: slotViewersMap[s], name: broadcasterNames[s] }));
        const twoComb = generateCombinations(vArr, 2);

        twoComb.forEach((c, index) => {
            const rowColor = (index % 2 === 0) ? '#87CEEB' : '#FFC0CB';
            const sets = c.map(x => x.viewersSet);
            const names = c.map(x => x.name);
            const common = sets.reduce((a, b) => new Set([...a].filter(x => b.has(x))));
            const nameStr = names.join(' & ');

            content += `
            <div style="display: flex; justify-content: space-between; color: ${rowColor};">
                <span>${nameStr}</span>
                <span style="text-align: right;">${common.size.toLocaleString()}</span>
            </div>`;
        });

        // 순수 시청자
        content += `<br><span style="color: #FFD700;"><strong>순수 시청자 수(채팅 참여 인원 대비 비율):</strong></span><br>`;
        for(let i = 1; i <= 10; i++){
            if(!slotViewersMap[i]) continue;
            let others = new Set();
            for(let j = 1; j <= 10; j++){
                if(j !== i && slotViewersMap[j]){
                    others = new Set([...others, ...slotViewersMap[j]]);
                }
            }
            const pure = new Set([...slotViewersMap[i]].filter(x => !others.has(x)));
            const tv = rawViewerCounts[i] || 0;
            const pc = pure.size;
            let ratio = 0;
            if(tv > 0){
                ratio = ((pc / tv) * 100).toFixed(1);
            }
            content += `
            <div style="
                display: grid;
                grid-template-columns: 1fr 6ch 6ch;
                gap: 4px;
                align-items: center;
                font-family: 'Consolas', 'Courier New', monospace;
            ">
                <span style="text-align: left;">
                    ${broadcasterNames[i]}
                </span>
                <span style="text-align: right;">
                    ${pc.toLocaleString()}
                </span>
                <span style="text-align: right;">
                    (${ratio}%)
                </span>
            </div>`;
        }

        const showRange1 = GM_getValue('showRange1', true);
        const showRange2 = GM_getValue('showRange2', true);

        if(showRange1){
            content += `<br><span style="color: #FFD700;"><strong>중복, 멀티뷰 제거 시청자 합계(비율):</strong></span><br>
                        <div style="display: flex; justify-content: space-between;">
                            <span>${getRange1Start()}~${getRange1End()} 슬롯 합계 :</span>
                            <span style="text-align: right;">
                                ${unionSize1.toLocaleString()} (${ratio1}%)
                            </span>
                        </div>`;
        }
        if(showRange2){
            content += `<br><span style="color: #FFD700;"><strong>중복, 멀티뷰 제거 시청자 합계(비율):</strong></span><br>
                        <div style="display: flex; justify-content: space-between;">
                            <span>${getRange2Start()}~${getRange2End()} 슬롯 합계 :</span>
                            <span style="text-align: right;">
                                ${unionSize2.toLocaleString()} (${ratio2}%)
                            </span>
                        </div>`;
        }

        displayTooltip(content, 'comparison-tooltip');
    }

    // --------------------------
    //   멀티뷰 (중복 제거 후)
    // --------------------------
    function showMultiViewList() {
        const threshold = GM_getValue('multiviewThreshold', 2);
        let slotViewersMap = {};

        for (let i = 1; i <= 10; i++) {
            const history = GM_getValue(`viewerListHistory_slot_${i}`, []);
            if (history.length > 0) {
                const latest = history[history.length - 1];
                const vList = latest.viewers;
                if (Array.isArray(vList)) {
                    const cleaned = vList.map(v => getUserIdWithoutSuffix(v.id));
                    slotViewersMap[i] = new Set(cleaned);
                } else if (typeof vList === 'object') {
                    let tmp = [];
                    for (const group of Object.values(vList)) {
                        for(const viewer of group){
                            tmp.push(getUserIdWithoutSuffix(viewer.id));
                        }
                    }
                    slotViewersMap[i] = new Set(tmp);
                }
            }
        }

        const userSlotMap = new Map();
        for (let i = 1; i <= 10; i++) {
            if (!slotViewersMap[i]) continue;
            for (const userId of slotViewersMap[i]) {
                if (!userSlotMap.has(userId)) {
                    userSlotMap.set(userId, new Set());
                }
                userSlotMap.get(userId).add(i);
            }
        }

        let multiViewList = [];
        for (const [userId, slots] of userSlotMap.entries()) {
            if (slots.size >= threshold) {
                multiViewList.push({
                    userId,
                    slotCount: slots.size,
                    slots: [...slots].sort((a,b) => a - b),
                });
            }
        }

        multiViewList.sort((a, b) => b.slotCount - a.slotCount || a.userId.localeCompare(b.userId));

        if (multiViewList.length === 0) {
            alert(`멀티뷰(슬롯 ${threshold}개 이상) 시청자가 없습니다.`);
            return;
        }

        let content = `<span style="color:#FFD700;font-weight:bold;">[멀티뷰 시청자 - ${threshold}개 이상의 슬롯]</span><br><br>`;
        multiViewList.forEach((entry) => {
            content += `<div style="margin-bottom:4px;">
                <strong>${entry.userId}</strong> :
                ${entry.slotCount}개
                <small style="color:#ccc;">(S${entry.slots.join(', S')})</small>
            </div>`;
        });

        displayTooltip(content, 'multiView-tooltip');
    }

// --------------------------
//   멀티뷰(중복포함) - 방송인 아이디별로 표시 (시청자 아이디 마스킹)
// --------------------------

// ▼▼▼ 추가: 아이디 마스킹 함수 ▼▼▼
function maskUserId(originalId) {
    let result = "";
    let i = 0;
    // true일 때는 '2글자 노출', false일 때는 '2글자 마스킹'
    let showPlain = true;

    while (i < originalId.length) {
        const chunk = originalId.substring(i, i + 2);  // 2글자씩 끊기
        if (showPlain) {
            // chunk 그대로 노출
            result += chunk;
        } else {
            // chunk 길이만큼 '*'
            result += '*'.repeat(chunk.length);
        }
        // 다음엔 반대로
        showPlain = !showPlain;
        i += 2;
    }

    return result;
}


function showMultiViewListWithDup() {
    const threshold = GM_getValue('multiviewThreshold', 2);

    // 미리 "슬롯번호 -> 방송인아이디" 맵을 만들자
    const slotBroadcasterMap = {};
    for (let i = 1; i <= 10; i++) {
        const labelData = GM_getValue(`slotLabel_${i}`, null);
        if (labelData && labelData.name) {
            slotBroadcasterMap[i] = labelData.name; // 실제 방송인 아이디
        } else {
            slotBroadcasterMap[i] = `방송인(슬롯${i})`; // fallback
        }
    }

    // key: baseName(접미사제거)
    // value: { totalCount: number, slotCount: { [broadcasterName]: number } }
    const userDataMap = new Map();

    for (let i = 1; i <= 10; i++) {
        const history = GM_getValue(`viewerListHistory_slot_${i}`, []);
        if (history.length === 0) continue;
        const latest = history[history.length - 1];
        const vList = latest.viewers;

        // 이 슬롯의 실제 방송인아이디
        const broadcasterName = slotBroadcasterMap[i];

        if (Array.isArray(vList)) {
            for (const viewer of vList) {
                const baseName = getUserIdWithoutSuffix(viewer.id);
                if (!userDataMap.has(baseName)) {
                    userDataMap.set(baseName, { totalCount: 0, slotCount: {} });
                }
                const dataObj = userDataMap.get(baseName);
                dataObj.totalCount++;
                if (!dataObj.slotCount[broadcasterName]) {
                    dataObj.slotCount[broadcasterName] = 0;
                }
                dataObj.slotCount[broadcasterName]++;
            }
        } else if (typeof vList === 'object') {
            for (const group of Object.values(vList)) {
                for (const viewer of group) {
                    const baseName = getUserIdWithoutSuffix(viewer.id);
                    if (!userDataMap.has(baseName)) {
                        userDataMap.set(baseName, { totalCount: 0, slotCount: {} });
                    }
                    const dataObj = userDataMap.get(baseName);
                    dataObj.totalCount++;
                    if (!dataObj.slotCount[broadcasterName]) {
                        dataObj.slotCount[broadcasterName] = 0;
                    }
                    dataObj.slotCount[broadcasterName]++;
                }
            }
        }
    }

    // threshold 이상만 필터
    const resultList = [];
    for (const [baseName, info] of userDataMap.entries()) {
        if (info.totalCount >= threshold) {
            resultList.push({
                baseName,
                totalCount: info.totalCount,
                slotCount: info.slotCount
            });
        }
    }

    if (resultList.length === 0) {
        alert(`(중복포함) 멀티뷰 ${threshold}개 이상 시청자가 없습니다.`);
        return;
    }

    // 정렬: 횟수 내림차순, 아이디 오름차순
    resultList.sort((a,b) => b.totalCount - a.totalCount || a.baseName.localeCompare(b.baseName));

    // 출력 생성
    let content = `<span style="color:#FFD700;font-weight:bold;">[멀티뷰 시청자 - ${threshold}개 이상]</span><br><br>`;
    for (const entry of resultList) {
        // broadcasterName 사전순 정렬
        const bNames = Object.keys(entry.slotCount).sort();

        // "방송인아이디 : 횟수" 조합
        const bnStrs = bNames.map(bn => `${bn} : ${entry.slotCount[bn]}`).join(', ');

        // ▼▼▼ 시청자 아이디를 '마스킹' ▼▼▼
        const maskedId = maskUserId(entry.baseName);

        // 원하는 형식으로 출력
        content += `
        <div style="
            display: grid;
            grid-template-columns: 6fr 2ch ;
            grid-template-rows: 1fr;
            gap: 4px;
            align-items: center;
            font-family: 'Consolas', 'Courier New', monospace;
        ">
            <!-- 마스킹된 시청자 아이디 -->
            <span style="text-align: left; color:#87CEEB;">
                ${maskedId}
            </span>
            <!-- 총 접속 횟수 -->
            <span style="text-align: right; color:#FFD700;">
                 ${entry.totalCount}개
            </span>
            <!-- 방송인아이디별 세션 수 -->
            <span style="text-align: left; color:#FFC0CB;">
                 ${bnStrs}
            </span>
        </div>`;
    }

    displayTooltip(content, 'multiView-dup-tooltip');
}


    // --------------------------
    //  슬롯 데이터 초기화
    // --------------------------
    function clearAllSlotsData() {
        try {
            for(let i = 1; i <= 10; i++){
                GM_setValue(`viewerListHistory_slot_${i}`, []);
                GM_setValue(`slotLabel_${i}`, null);
                if (slotButtons[i]) {
                    slotButtons[i].textContent = `S${i}`;
                }
            }
            console.log("모든 슬롯 데이터가 삭제되었습니다.");
            alert("모든 슬롯 데이터가 삭제되었습니다.");
        } catch(e) {
            console.error("모든 슬롯 데이터 삭제중 오류:", e);
            alert("슬롯 데이터 삭제중 오류: " + e);
        }
    }

    // --------------------------
    //  "범위1" / "범위2" 설정
    // --------------------------
    function setRange(rangeKeyPrefix) {
        const currStart = GM_getValue(`${rangeKeyPrefix}Start`, rangeKeyPrefix === 'range1'? 1 : 2);
        const currEnd   = GM_getValue(`${rangeKeyPrefix}End`,   rangeKeyPrefix === 'range1'?10 :10);

        const inpStart = prompt(`[${rangeKeyPrefix}] 시작 슬롯 번호? (1~10)`, currStart);
        if (inpStart === null) return;
        const inpEnd   = prompt(`[${rangeKeyPrefix}] 끝 슬롯 번호? (1~10)`, currEnd);
        if (inpEnd === null) return;

        const sNum = parseInt(inpStart, 10);
        const eNum = parseInt(inpEnd, 10);
        if (isNaN(sNum) || isNaN(eNum) || sNum < 1 || sNum > 10 || eNum < 1 || eNum > 10 || sNum > eNum) {
            alert("잘못된 범위입니다(1~10 사이 정수).");
            return;
        }

        GM_setValue(`${rangeKeyPrefix}Start`, sNum);
        GM_setValue(`${rangeKeyPrefix}End`,   eNum);

        alert(`${rangeKeyPrefix} 범위가 ${sNum}~${eNum}로 설정되었습니다.`);
    }

    // --------------------------
    //  UI 생성
    // --------------------------
    function createFloatingUI() {
        if (document.getElementById('floating-ui')) return;

        const container = document.createElement('div');
        container.id = 'floating-ui';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '330px';
        container.style.zIndex = '99999';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #888';
        container.style.borderRadius = '4px';
        container.style.padding = '8px';
        container.style.fontSize = '12px';
        container.style.color = '#000';
        container.style.width = '220px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';

        // 제목
        const title = document.createElement('div');
        title.textContent = 'SOOP 설정';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '6px';
        container.appendChild(title);

        // R1/R2 표시 On/Off
        const rangeWrap = document.createElement('div');
        rangeWrap.style.display = 'flex';
        rangeWrap.style.justifyContent = 'space-between';
        rangeWrap.style.marginBottom = '6px';

        const range1Label = document.createElement('label');
        const range1Cbx = document.createElement('input');
        range1Cbx.type = 'checkbox';
        range1Cbx.checked = GM_getValue('showRange1', true);
        range1Cbx.style.marginRight = '4px';
        range1Cbx.addEventListener('change', e => GM_setValue('showRange1', e.target.checked));
        range1Label.appendChild(range1Cbx);
        range1Label.appendChild(document.createTextNode(' R1 표시'));

        const range2Label = document.createElement('label');
        const range2Cbx = document.createElement('input');
        range2Cbx.type = 'checkbox';
        range2Cbx.checked = GM_getValue('showRange2', true);
        range2Cbx.style.marginRight = '4px';
        range2Cbx.addEventListener('change', e => GM_setValue('showRange2', e.target.checked));
        range2Label.appendChild(range2Cbx);
        range2Label.appendChild(document.createTextNode(' R2 표시'));

        rangeWrap.appendChild(range1Label);
        rangeWrap.appendChild(range2Label);
        container.appendChild(rangeWrap);

        // 슬롯 저장 버튼들
        const slotTitle = document.createElement('div');
        slotTitle.textContent = '슬롯 저장';
        slotTitle.style.marginBottom = '4px';
        container.appendChild(slotTitle);

        const slotBtnWrap = document.createElement('div');
        slotBtnWrap.style.display = 'grid';
        slotBtnWrap.style.gridTemplateColumns = '1fr';
        slotBtnWrap.style.gap = '4px';
        slotBtnWrap.style.marginBottom = '8px';

        for (let i = 1; i <= 10; i++) {
            const slotBtn = document.createElement('button');
            slotBtn.style.fontSize = '11px';
            slotBtn.style.cursor = 'pointer';
            slotBtn.style.padding = '4px';
            slotBtn.style.textAlign = 'left';

            const labelData = GM_getValue(`slotLabel_${i}`, null);
            if (labelData && labelData.name && labelData.time) {
                const { name, time } = labelData;
                slotBtn.innerHTML = `
                    <div style="text-align: left;">${name}</div>
                    <div style="text-align: left; font-size: 10px; color: #555;">${time}</div>
                `;
            } else {
                slotBtn.textContent = `S${i}`;
            }

            slotBtn.addEventListener('click', () => {
                getCurrentViewerList(i);
            });

            slotButtons[i] = slotBtn;
            slotBtnWrap.appendChild(slotBtn);
        }
        container.appendChild(slotBtnWrap);

        // [중복 비교], [슬롯 삭제] 버튼
        const btnCompare = document.createElement('button');
        btnCompare.textContent = '중복 비교';
        btnCompare.style.fontSize = '12px';
        btnCompare.style.marginRight = '4px';
        btnCompare.style.cursor = 'pointer';
        btnCompare.style.flex = '1';
        btnCompare.style.padding = '4px';
        btnCompare.style.backgroundColor = '#2196F3';
        btnCompare.style.color = 'white';
        btnCompare.style.border = 'none';
        btnCompare.style.borderRadius = '2px';
        btnCompare.addEventListener('click', compareViewerLists);

        const btnClearAll = document.createElement('button');
        btnClearAll.textContent = '슬롯 삭제';
        btnClearAll.style.fontSize = '12px';
        btnClearAll.style.cursor = 'pointer';
        btnClearAll.style.flex = '1';
        btnClearAll.style.padding = '4px';
        btnClearAll.style.backgroundColor = '#f44336';
        btnClearAll.style.color = 'white';
        btnClearAll.style.border = 'none';
        btnClearAll.style.borderRadius = '2px';
        btnClearAll.addEventListener('click', () => {
            if (confirm('모든 슬롯 데이터를 삭제하시겠습니까?')) {
                clearAllSlotsData();
            }
        });

        const actionRow = document.createElement('div');
        actionRow.style.display = 'flex';
        actionRow.style.gap = '4px';
        actionRow.style.marginBottom = '8px';
        actionRow.appendChild(btnCompare);
        actionRow.appendChild(btnClearAll);
        container.appendChild(actionRow);

        // [범위1], [범위2] 설정
        const btnRange1 = document.createElement('button');
        btnRange1.textContent = '범위1 설정';
        btnRange1.style.fontSize = '12px';
        btnRange1.style.marginRight = '4px';
        btnRange1.style.cursor = 'pointer';
        btnRange1.style.flex = '1';
        btnRange1.style.padding = '4px';
        btnRange1.style.backgroundColor = '#FF9800';
        btnRange1.style.color = 'white';
        btnRange1.style.border = 'none';
        btnRange1.style.borderRadius = '2px';
        btnRange1.addEventListener('click', () => setRange('range1'));

        const btnRange2 = document.createElement('button');
        btnRange2.textContent = '범위2 설정';
        btnRange2.style.fontSize = '12px';
        btnRange2.style.cursor = 'pointer';
        btnRange2.style.flex = '1';
        btnRange2.style.padding = '4px';
        btnRange2.style.backgroundColor = '#FF9800';
        btnRange2.style.color = 'white';
        btnRange2.style.border = 'none';
        btnRange2.style.borderRadius = '2px';
        btnRange2.addEventListener('click', () => setRange('range2'));

        const rangeRow = document.createElement('div');
        rangeRow.style.display = 'flex';
        rangeRow.style.gap = '4px';
        rangeRow.appendChild(btnRange1);
        rangeRow.appendChild(btnRange2);
        container.appendChild(rangeRow);

        // 멀티뷰 관련 UI
        const mvRow = document.createElement('div');
        mvRow.style.display = 'grid';
        mvRow.style.gridTemplateColumns = '50px 1fr';
        mvRow.style.gap = '4px';
        mvRow.style.marginTop = '8px';

        const inpMV = document.createElement('input');
        inpMV.type = 'number';
        inpMV.min = '2';
        inpMV.value = GM_getValue('multiviewThreshold', 2);
        inpMV.style.width = '48px';
        inpMV.style.fontSize = '12px';
        inpMV.style.padding = '2px';
        inpMV.style.boxSizing = 'border-box';
        inpMV.addEventListener('change', () => {
            const val = parseInt(inpMV.value, 10);
            if (val >= 2) {
                GM_setValue('multiviewThreshold', val);
            }
        });

        mvRow.appendChild(inpMV);

        const mvBtnWrap = document.createElement('div');
        mvBtnWrap.style.display = 'flex';
        mvBtnWrap.style.flexDirection = 'column';
        mvBtnWrap.style.gap = '4px';

        /*const btnMV = document.createElement('button');
        btnMV.textContent = '멀티뷰 확인';
        btnMV.style.fontSize = '12px';
        btnMV.style.cursor = 'pointer';
        btnMV.style.padding = '4px';
        btnMV.style.backgroundColor = '#673AB7';
        btnMV.style.color = 'white';
        btnMV.style.border = 'none';
        btnMV.style.borderRadius = '2px';
        btnMV.addEventListener('click', showMultiViewList);
        mvBtnWrap.appendChild(btnMV); */

        const btnMV2 = document.createElement('button');
        btnMV2.textContent = '멀티뷰(중복포함)';
        btnMV2.style.fontSize = '12px';
        btnMV2.style.cursor = 'pointer';
        btnMV2.style.padding = '4px';
        btnMV2.style.backgroundColor = '#9C27B0';
        btnMV2.style.color = 'white';
        btnMV2.style.border = 'none';
        btnMV2.style.borderRadius = '2px';
        btnMV2.addEventListener('click', showMultiViewListWithDup);
        mvBtnWrap.appendChild(btnMV2);

        mvRow.appendChild(mvBtnWrap);
        container.appendChild(mvRow);

        document.body.appendChild(container);
    }

    // --------------------------
    //  스크립트 초기화
    // --------------------------
    function init() {
        createFloatingUI();

        for (let i = 1; i <= 10; i++) {
            GM_addValueChangeListener(`slotLabel_${i}`, (key, old_value, new_value, remote) => {
                if (slotButtons[i]) {
                    if (new_value && new_value.name && new_value.time) {
                        const { name: broadcasterName, time } = new_value;
                        slotButtons[i].innerHTML = `
                            <div style="text-align: left;">${broadcasterName}</div>
                            <div style="text-align: left; font-size: 10px; color: #555;">${time}</div>
                        `;
                    } else {
                        slotButtons[i].textContent = `S${i}`;
                    }
                }
            });
        }

        console.log('SOOP 시청자 목록 스크립트: UI 초기화 완료');
    }

    init();
})();
