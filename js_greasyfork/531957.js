// ==UserScript==
// @name         SOOP (숲) - 다시보기 채팅창 부검기
// @name:ko         SOOP (숲) - 다시보기 채팅창 부검기
// @namespace    https://greasyfork.org/ko/scripts/488057
// @version      20241015
// @description  VOD 채팅창에서 채팅, 별풍선, 대결미션, 도전미션 로그를 다운로드
// @description:ko  VOD 채팅창에서 채팅, 별풍선, 대결미션, 도전미션 로그를 다운로드
// @author       You
// @match        https://vod.sooplive.co.kr/player/*
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @run-at       document-end
// @license MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531957/SOOP%20%28%EC%88%B2%29%20-%20%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EB%B6%80%EA%B2%80%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/531957/SOOP%20%28%EC%88%B2%29%20-%20%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EB%B6%80%EA%B2%80%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let accumulatedTextData = '';
    let balloonCutoff = 1;

    function secondsToHMS(seconds) {
        if(seconds < 0){
            return `[00:00:00]`;
        }
        seconds = Math.floor(seconds);

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `[${formattedHours}:${formattedMinutes}:${formattedSeconds}]`;
    }

    // XML을 JSON으로 변환하는 함수
    function xmlToJson(xml) {
        var obj = {};

        if (xml.nodeType === 1) {
            // element 노드인 경우
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) {
            // text 노드인 경우
            obj = xml.nodeValue;
        } else if (xml.nodeType === 4) {
            // CDATA 노드인 경우
            obj = xml.nodeValue;
        }

        // CDATA 노드 처리
        if (xml.nodeType === 4) {
            obj = xml.nodeValue;
        }

        // 하위 노드가 있는 경우
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) === "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) === "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    }

    function removeTextAfterRoot(jsonData) {
        if (!jsonData || typeof jsonData !== 'object') {
            return jsonData;
        }

        const rootKeys = Object.keys(jsonData);

        // "root" 다음에 바로 오는 "#text"를 제거합니다.
        if (rootKeys.length === 1 && rootKeys[0] === 'root') {
            const rootObj = jsonData.root;

            // 만약 "root" 객체 안에 "#text"가 있다면 제거합니다.
            if (rootObj && Array.isArray(rootObj['#text'])) {
                delete rootObj['#text'];
            }
        }

        return jsonData;
    }

    async function fetchChatData(url) {
        try {
            const response = await fetch(url, {
                cache: "force-cache" // 항상 캐시를 사용하도록 설정
            });
            const data = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const jsonData = xmlToJson(xmlDoc);
            const modifiedJsonData = removeTextAfterRoot(jsonData);
            return modifiedJsonData;
        } catch (error) {
            console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
            throw error;
        }
    }

    async function retrieveAndLogChatData(url, startTime, cmd, accumulatedTime) {
        try {
            const chatData = await fetchChatData(`${url}&startTime=${startTime}`);
            let textData = '';

            switch (true) {
                case (cmd === "getChatLog"):
                    textData = convertChatObjToText(chatData, accumulatedTime, '', '');
                    break;
                case (cmd === "getBalloonLog"):
                    textData = convertBalloonObjToText(chatData, accumulatedTime);
                    break;
                case (cmd === "getChallengeMissionLog"):
                    textData = convertChallengeMissionObjToText(chatData, accumulatedTime);
                    break;
                case (cmd === "getBattleMissionLog"):
                    textData = convertBattleMissionObjToText(chatData, accumulatedTime);
                    break;
                case cmd.includes("getChatLogByID"):
                    textData = convertChatObjToText(chatData, accumulatedTime, cmd.split('getChatLogByID_')[1], '');
                    break;
                case cmd.includes("getChatLogByWord"):
                    textData = convertChatObjToText(chatData, accumulatedTime, '', cmd.split('getChatLogByWord_')[1]);
                    break;
                default:
                    console.error('잘못된 명령입니다:', cmd);
                    return;
            }

            if (textData) {
                accumulatedTextData += textData; // 텍스트 데이터를 누적
            }
        } catch (error) {
            console.error('채팅 데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
    }

    function generateFileName(bjid, videoid, cmd) {
        let fileType = "";
        switch (true) {
            case (cmd === "getChatLog"):
                fileType = "채팅_전체";
                break;
            case (cmd === "getBalloonLog"):
                fileType = `별풍선_전체_${balloonCutoff}개이상`;
                break;
            case (cmd === "getChallengeMissionLog"):
                fileType = `도전미션_전체_${balloonCutoff}개이상`;
                break;
            case (cmd === "getBattleMissionLog"):
                fileType = `배틀미션_전체_${balloonCutoff}개이상`;
                break;
            case cmd.includes("getChatLogByID"):
                fileType = `채팅_${cmd.split('getChatLogByID_')[1]}`;
                break;
            case cmd.includes("getChatLogByWord"):
                fileType = `채팅_단어_${cmd.split('getChatLogByWord_')[1]}`;
                break;
        }
        return `${bjid}_${videoid}_${fileType}.txt`;
    }

    async function retrieveChatDataForDuration(duration, fileInfoKey, cmd, isLastIteration, accumulatedTime) {
        const url = fileInfoKey.indexOf("clip_") !== -1 ?
              `https://vod-normal-kr-cdn-z01.sooplive.co.kr/${fileInfoKey.split("_").join("/")}_c.xml?type=clip&rowKey=${fileInfoKey}_c` :
              `https://videoimg.sooplive.co.kr/php/ChatLoadSplit.php?rowKey=${fileInfoKey}_c`;
        const bjid = vodCore.config.copyright.user_id || vodCore.config.bjId;
        const filename = generateFileName(bjid, vodCore.config.titleNo, cmd);
        const intervalDuration = 300; // 300초마다 채팅 데이터 가져오기
        let currentSeconds = 0;

        while (currentSeconds <= duration) {
            document.title = `채팅 데이터를 받는 중... ${parseInt((currentSeconds+accumulatedTime)/vodCore.config.totalFileDuration*100)}%`;
            await retrieveAndLogChatData(url, currentSeconds, cmd, accumulatedTime);
            currentSeconds += intervalDuration;

            if (currentSeconds > duration && isLastIteration) {
                // 마지막 반복이면서 현재 시간이 지속 시간을 초과하면 저장
                if(accumulatedTextData.length > 0) {
                    saveTextToFile(accumulatedTextData, filename)
                } else {
                    alert('저장할 데이터가 없습니다.');
                }
            }
        }
    }

    async function saveTextToFile(textData, fileName) {
        const blob = new Blob([textData], { type: 'text/plain' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(blobUrl);
    }

    function convertChatObjToText(jsonData, accumulatedTime, targetid, targetword) {

        if (Array.isArray(jsonData.root.chat)) {
            // 배열일 경우

            const chatArray = jsonData.root.chat;
            let text = '';

            chatArray.forEach(chatObj => {
                const t = chatObj.t ? secondsToHMS(parseFloat(chatObj.t['#text']) + accumulatedTime) : '';
                const u = chatObj.u ? chatObj.u['#text'].split('(')[0] : '';
                const n = chatObj.n ? chatObj.n['#cdata-section'] : '';
                const m = chatObj.m ? chatObj.m['#cdata-section'] : '';

                if(targetid.length > 0){
                    if(targetid === u) text += `${t} ${n}(${u}): ${m}\n`;
                } else if(targetword.length > 0){
                    if(m.includes(targetword)) text += `${t} ${n}(${u}): ${m}\n`;
                } else {
                    text += `${t} ${n}(${u}): ${m}\n`;
                }

            });

            return text;
        } else if (typeof jsonData.root.chat === 'object') {
            // 객체일 경우

            const chatObj = jsonData.root.chat;
            let text = '';

            const t = chatObj.t ? secondsToHMS(parseFloat(chatObj.t['#text']) + accumulatedTime) : '';
            const u = chatObj.u ? chatObj.u['#text'].split('(')[0] : '';
            const n = chatObj.n ? chatObj.n['#cdata-section'] : '';
            const m = chatObj.m ? chatObj.m['#cdata-section'] : '';

            if(targetid.length > 0){
                if(targetid === u) text += `${t} ${n}(${u}): ${m}\n`;
            } else if(targetword.length > 0){
                if(m.includes(targetword)) text += `${t} ${n}(${u}): ${m}\n`;
            } else {
                text += `${t} ${n}(${u}): ${m}\n`;
            }

            return text;
        } else {
            return '';
        }
    }

    function convertBalloonObjToText(jsonData, accumulatedTime) {

        if (Array.isArray(jsonData.root.balloon)) {
            // 배열일 경우
            const balloonArray = jsonData.root.balloon;
            let text = '';

            balloonArray.forEach(balloonObj => {
                const t = balloonObj.t ? secondsToHMS(parseFloat(balloonObj.t['#text']) + accumulatedTime) : '';
                const u = balloonObj.u ? balloonObj.u['#text'].split('(')[0] : '';
                const n = balloonObj.n ? balloonObj.n['#cdata-section'] : '';
                const c = balloonObj.c ? balloonObj.c['#text'] : '';

                if(balloonCutoff <= parseInt(c)) text += `${t} ${n}(${u}): ${c}\n`;
            });

            return text;
        } else if (typeof jsonData.root.balloon === 'object') {
            // 객체일 경우
            const balloonObj = jsonData.root.balloon;
            let text = '';

            const t = balloonObj.t ? secondsToHMS(parseFloat(balloonObj.t['#text']) + accumulatedTime) : '';
            const u = balloonObj.u ? balloonObj.u['#text'].split('(')[0] : '';
            const n = balloonObj.n ? balloonObj.n['#cdata-section'] : '';
            const c = balloonObj.c ? balloonObj.c['#text'] : '';

            if(balloonCutoff <= parseInt(c)) text += `${t} ${n}(${u}): ${c}\n`;

            return text;
        } else {
            return '';
        }
    }

    function convertChallengeMissionObjToText(jsonData, accumulatedTime) {

        if (Array.isArray(jsonData.root.challenge_mission)) {
            // 배열일 경우
            const challengeMissionArray = jsonData.root.challenge_mission;
            let text = '';

            challengeMissionArray.forEach(cmObj => {
                const t = cmObj.t ? secondsToHMS(parseFloat(cmObj.t['#text']) + accumulatedTime) : '';
                const u = cmObj.u ? cmObj.u['#text'].split('(')[0] : '';
                const n = cmObj.n ? cmObj.n['#cdata-section'] : '';
                const c = cmObj.c ? cmObj.c['#text'] : '';
                const title = cmObj.title ? cmObj.title['#cdata-section'] : '';

                if(balloonCutoff <= parseInt(c)) text += `${t} ${n}(${u}): ${c}, ${title}\n`;
            });

            return text;
        } else if (typeof jsonData.root.challenge_mission === 'object') {
            // 객체일 경우
            const cmObj = jsonData.root.challenge_mission;
            let text = '';

            const t = cmObj.t ? secondsToHMS(parseFloat(cmObj.t['#text']) + accumulatedTime) : '';
            const u = cmObj.u ? cmObj.u['#text'].split('(')[0] : '';
            const n = cmObj.n ? cmObj.n['#cdata-section'] : '';
            const c = cmObj.c ? cmObj.c['#text'] : '';
            const title = cmObj.title ? cmObj.title['#cdata-section'] : '';

            if(balloonCutoff <= parseInt(c)) text += `${t} ${n}(${u}): ${c}, ${title}\n`;
            return text;
        } else {
            return '';
        }

    }

    function convertBattleMissionObjToText(jsonData, accumulatedTime) {

        if (Array.isArray(jsonData.root.battle_mission)) {
            // 배열일 경우
            const battleMissionArray = jsonData.root.battle_mission;
            let text = '';

            battleMissionArray.forEach(bmObj => {
                const t = bmObj.t ? secondsToHMS(parseFloat(bmObj.t['#text']) + accumulatedTime) : '';
                const u = bmObj.u ? bmObj.u['#text'].split('(')[0] : '';
                const n = bmObj.n ? bmObj.n['#cdata-section'] : '';
                const c = bmObj.c ? bmObj.c['#text'] : '';
                const title = bmObj.title ? bmObj.title['#cdata-section'] : '';

                if(balloonCutoff <= parseInt(c)) text += `${t} ${n}(${u}): ${c}, ${title}\n`;
            });

            return text;
        } else if (typeof jsonData.root.battle_mission === 'object') {
            // 객체일 경우
            const bmObj = jsonData.root.battle_mission;
            let text = '';

            const t = bmObj.t ? secondsToHMS(parseFloat(bmObj.t['#text']) + accumulatedTime) : '';
            const u = bmObj.u ? bmObj.u['#text'].split('(')[0] : '';
            const n = bmObj.n ? bmObj.n['#cdata-section'] : '';
            const c = bmObj.c ? bmObj.c['#text'] : '';
            const title = bmObj.title ? bmObj.title['#cdata-section'] : '';

            if(balloonCutoff <= parseInt(c)) text += `${t} ${n}(${u}): ${c}, ${title}\n`;

            return text;
        } else {
            return '';
        }

    }

    // 변수가 정의될 때까지 시도하는 함수
    function waitForVariable() {
        return new Promise((resolve, reject) => {
            let elapsedTime = 0; // 경과 시간 변수 초기화

            const interval = setInterval(() => {
                elapsedTime += 1000; // 1초씩 경과 시간 증가

                // 변수가 정의되었는지 확인
                if (typeof vodCore !== 'undefined' && vodCore !== null) {
                    clearInterval(interval); // 변수가 정의되면 setInterval 중지
                    resolve(vodCore); // Promise를 성공 상태로 전이
                }

                // 최대 20초까지 기다린 후에도 변수가 정의되지 않으면 중단
                if (elapsedTime >= 20000) {
                    clearInterval(interval); // 지정된 시간이 경과하면 setInterval 중지
                    reject(new Error('변수가 20초 안에 선언되지 않았습니다.')); // Promise를 거부 상태로 전이
                }
            }, 1000); // 1초마다 변수 확인
        });
    }

    async function getChatLog(cmd) {
        try {
            accumulatedTextData = '';
            let accumulatedTime = 0;
            const vodCore = await waitForVariable();
            const itemsCount = vodCore.fileItems.length;
            for (const [index, item] of vodCore.fileItems.entries()) {
                const startTime = performance.now(); // 요청 시작 시간 기록
                const isLastIteration = index === itemsCount - 1; // 현재 아이템이 마지막 아이템인지 확인
                await retrieveChatDataForDuration(item.duration, item.fileInfoKey, cmd, isLastIteration, accumulatedTime);
                accumulatedTime += parseInt(item.duration);
                const endTime = performance.now(); // 요청 종료 시간 기록
                const elapsedTime = endTime - startTime; // 요청에 걸린 시간 계산

                // 만약 요청에 걸린 시간이 500ms를 초과하지 않으면 남은 시간을 기다리지 않고 다음으로 넘어갑니다.
                if (elapsedTime < 500) {
                    await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime));
                }

            }
            document.title = '모든 작업이 완료되었습니다.';
        } catch (error) {
            console.error('전체 프로세스 중 오류 발생:', error);
        }
    }

    GM_registerMenuCommand('전체 채팅 로그 저장', function() {
        getChatLog("getChatLog");
    });
    GM_registerMenuCommand('전체 별풍선 로그 저장', function() {
        var balloonCutoffInput = prompt('몇 개 이상의 별풍선만 기록할까요?', 1);
        if (parseInt(balloonCutoffInput) > 0){
            balloonCutoff = balloonCutoffInput;
            getChatLog("getBalloonLog");
        }
    });
    GM_registerMenuCommand('전체 도전 미션 로그 저장', function() {
        var balloonCutoffInput = prompt('몇 개 이상의 별풍선만 기록할까요?', 1);
        if (parseInt(balloonCutoffInput) > 0){
            balloonCutoff = balloonCutoffInput;
            getChatLog("getChallengeMissionLog");
        }
    });
    GM_registerMenuCommand('전체 대결 미션 로그 저장', function() {
        var balloonCutoffInput = prompt('몇 개 이상의 별풍선만 기록할까요?', 1);
        if (parseInt(balloonCutoffInput) > 0){
            balloonCutoff = balloonCutoffInput;
            getChatLog("getBattleMissionLog");
        }
    });
    GM_registerMenuCommand('특정 ID 채팅 로그 저장', function() {
        var targetUseridInput = prompt('ID를 입력하세요', '');
        if (targetUseridInput.length > 0){
            const targetUserid = targetUseridInput.split('(')[0];
            getChatLog(`getChatLogByID_${targetUserid}`);
        }
    });
    GM_registerMenuCommand('내 채팅 로그 저장', function() {
        var myidInput = vodCore.config.loginId;
        if (myidInput && myidInput.length > 0){
            const targetUserid = myidInput.split('(')[0];
            getChatLog(`getChatLogByID_${targetUserid}`);
        } else {
            alert('로그인 상태가 아닙니다.');
        }
    });
    GM_registerMenuCommand('특정 단어를 포함한 채팅 로그 저장', function() {
        var targetWordInput = prompt('단어를 입력하세요', '');
        if (targetWordInput && targetWordInput.length > 0){
            const targetWord = targetWordInput;
            getChatLog(`getChatLogByWord_${targetWord}`);
        }
    });

})();