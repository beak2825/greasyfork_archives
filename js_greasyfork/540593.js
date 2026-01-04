// ==UserScript==
// @name         WeirdHost minecraft 명령어 여러줄 실행하기
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Process multiline paste on specific input by sending one line + Enter event per line
// @author       explainpark
// @match        https://*.weirdhost.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weirdhost.xyz
// @license      mit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540593/WeirdHost%20minecraft%20%EB%AA%85%EB%A0%B9%EC%96%B4%20%EC%97%AC%EB%9F%AC%EC%A4%84%20%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/540593/WeirdHost%20minecraft%20%EB%AA%85%EB%A0%B9%EC%96%B4%20%EC%97%AC%EB%9F%AC%EC%A4%84%20%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const inputSelector = 'input[aria-label="Console command input."]';

    // 랜덤 8자리 16진수 문자열 생성 함수
    function tokenHex(size) {
        let result = "";
        const hexChars = "0123456789abcdef";
        for (let i = 0; i < size * 2; i++) {
            const rand = Math.floor(Math.random() * 16);
            result += hexChars[rand];
        }
        return result;
    }

    // /setname 명령어를 여러 줄 커맨드로 변환
    function createCommands(username, humanname) {
        const command = `
/team add {teamname}
/team join {teamname} {username}
/team modify {teamname} prefix "{humanname}("
/team modify {teamname} suffix ")"
        `.trim();

        const teamname = tokenHex(4); // 8자리 16진수

        const output = command
            .replace(/{teamname}/g, teamname)
            .replace(/{username}/g, username)
            .replace(/{humanname}/g, humanname);

        return output;
    }

    // Enter 키 이벤트를 강제로 발생시키는 함수
    function triggerEnter(el) {
        const event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13
        });
        el.dispatchEvent(event);
    }

    // multiline paste 처리 부분 (기존)
    window.addEventListener('paste', async (e) => {
        const target = e.target;
        if (!target.matches(inputSelector)) return;

        let pasteText = (e.clipboardData || window.clipboardData).getData('text');
        if (!pasteText) return;

        const lines = pasteText.split(/\r?\n/);
        if (lines.length <= 1) return; // 한 줄이면 그냥 둠

        e.preventDefault();

        for (const line of lines) {
            target.value = line;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            triggerEnter(target);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }, true);

    // keydown 이벤트 감지하여 /setname 처리
    window.addEventListener('keydown', async (e) => {
        const target = e.target;
        if (!target.matches(inputSelector)) return;

        // Enter 키만 처리
        if (e.key !== 'Enter') return;

        const val = target.value.trim();

        // /setname username humanname 형식 검사
        // 예: /setname user123 JohnDoe
        const match = val.match(/^\/setname\s+(\S+)\s+(.+)$/);
        if (!match) return;

        e.preventDefault(); // 기본 엔터 동작 막기

        const username = match[1];
        const humanname = match[2];

        // 명령어 여러 줄 생성
        const commandsStr = createCommands(username, humanname);

        // 줄 단위로 나누기
        const commands = commandsStr.split('\n').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);

        // 순차적으로 입력 + Enter 실행
        for (const cmd of commands) {
            target.value = cmd;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            triggerEnter(target);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // 입력란 초기화 (필요하면)
        target.value = '';
        target.dispatchEvent(new Event('input', { bubbles: true }));

    }, true);

})();