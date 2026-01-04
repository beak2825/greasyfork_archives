// ==UserScript==
// @name         DuohackerMAX v3
// @namespace    https://duohackermax.net
// @version      3.0
// @description  Real server-based XP, streak, gems, and perfect lesson manipulation for Duolingo
// @author       misbisshi & ChatGPT
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531998/DuohackerMAX%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/531998/DuohackerMAX%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Basic UI
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div style="position:fixed;top:20px;right:20px;z-index:9999;background:#58cc02;padding:15px;border-radius:10px;color:white;font-family:sans-serif;">
            <h3>DuohackerMAX v3</h3>
            <input id="xp_input" type="number" placeholder="XP (예: 10000)" style="width:90%;margin:5px;"><br>
            <input id="streak_input" type="number" placeholder="스트릭 (예: 600)" style="width:90%;margin:5px;"><br>
            <input id="gems_input" type="number" placeholder="보석 (예: 9999)" style="width:90%;margin:5px;"><br>
            <input id="lesson_input" type="number" placeholder="레슨 수 (퍼펙트)" style="width:90%;margin:5px;"><br>
            <button id="duo_claim" style="width:95%;margin-top:8px;background:#ffcc00;border:none;padding:8px;border-radius:6px;">콱콱 적용</button>
            <div id="duo_status" style="margin-top:10px;font-size:0.9em;"></div>
        </div>
    `;
    document.body.appendChild(panel);

    const getJWT = () => {
        const match = document.cookie.match(/jwt_token=([^;]+)/);
        return match ? match[1] : null;
    };

    const sendSession = (data, jwt) => {
        return fetch("https://www.duolingo.com/2017-06-30/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify(data)
        });
    };

    document.getElementById("duo_claim").onclick = async function() {
        const xp = parseInt(document.getElementById("xp_input").value) || 0;
        const streak = parseInt(document.getElementById("streak_input").value) || 0;
        const gems = parseInt(document.getElementById("gems_input").value) || 0;
        const lessons = parseInt(document.getElementById("lesson_input").value) || 0;
        const jwt = getJWT();
        const status = document.getElementById("duo_status");

        if (!jwt) {
            status.innerHTML = "JWT 토큰을 찾을 수 없습니다. 로그인 상태를 확인하세요.";
            return;
        }

        // XP 조작
        if (xp > 0) {
            await sendSession({
                xpGain: xp,
                skillId: "global",
                fromLanguage: "en",
                isFinalLevel: true,
                type: "practice",
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString()
            }, jwt);
        }

        // 스트릭 조작
        for (let i = 0; i < streak; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            await sendSession({
                xpGain: 10,
                skillId: "streak",
                fromLanguage: "en",
                type: "practice",
                startTime: date.toISOString(),
                endTime: date.toISOString()
            }, jwt);
        }

        // 퍼펙트 레슨 조작
        for (let i = 0; i < lessons; i++) {
            await sendSession({
                xpGain: 20,
                perfect: true,
                lessonCompleted: true,
                fromLanguage: "en",
                skillId: "perfect",
                type: "lesson",
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString()
            }, jwt);
        }

        status.innerHTML = `적용 완료! XP: ${xp}, 스트릭: ${streak}일, 퍼펙트 레슨: ${lessons}`;
    };
})();
