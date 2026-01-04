// ==UserScript==
// @name         北建大-大兴图书馆-预约
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  预约座位
// @author       nigole
// @match        http://10.1.20.7/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521375/%E5%8C%97%E5%BB%BA%E5%A4%A7-%E5%A4%A7%E5%85%B4%E5%9B%BE%E4%B9%A6%E9%A6%86-%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/521375/%E5%8C%97%E5%BB%BA%E5%A4%A7-%E5%A4%A7%E5%85%B4%E5%9B%BE%E4%B9%A6%E9%A6%86-%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    function showMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;
        msgDiv.style.position = 'fixed';
        msgDiv.style.top = '20px';
        msgDiv.style.left = '50%'; 
        msgDiv.style.transform = 'translateX(-50%)';
        msgDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        msgDiv.style.color = '#fff';
        msgDiv.style.padding = '10px 20px';
        msgDiv.style.borderRadius = '5px';
        msgDiv.style.zIndex = '9999';
        msgDiv.style.fontSize = '16px';
        msgDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        msgDiv.style.textAlign = 'center';
        document.body.appendChild(msgDiv);
        setTimeout(() => {
            document.body.removeChild(msgDiv);
        }, 1000);
    }
    const targetTime = new Date();
    targetTime.setHours(18, 59, 50, 0);
    function getNextDayDate() {
        const today = new Date();
        today.setDate(today.getDate()+1);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const optionsContainer = document.querySelector('#onDate_select #options_onDate');
    if (optionsContainer) {
        const tomorrowStr = getNextDayDate();
        if (!optionsContainer.querySelector(`[value="${tomorrowStr}"]`)) {
            const newOption = document.createElement('a');
            newOption.href = 'javascript:void(0)';
            newOption.setAttribute('value', tomorrowStr);
            newOption.textContent = tomorrowStr;
            optionsContainer.appendChild(newOption);
        }
    }
    async function getSynchronizerToken() {
        try {
            const response = await fetch('/map');
            if (response.ok) {
                const text = await response.text();
                const match = text.match(/<input[^>]*name="SYNCHRONIZER_TOKEN"[^>]*value="(.*?)"/);
                return match ? match[1] : null;
            }
        } catch (error) {
            showMessage("获取 SYNCHRONIZER_TOKEN 失败");
        }
        return null;
    }
    const reserveBtn = document.querySelector('#reserveBtn');
    if (reserveBtn) {
        reserveBtn.innerHTML = reserveBtn.innerHTML.replace('预 约', '抢座');
        reserveBtn.addEventListener('click', function (event) {
            event.stopPropagation(); 
            event.preventDefault(); 
            const cancelBtn = document.querySelector('.cancelBtn');
            cancelBtn.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
            var currentSeat =window.currentSeat;
            var startTime =window.startTime;
            var endTime =window.endTime;
            if (!currentSeat || !startTime || !endTime) {
                showMessage('请确认已选择座位和时间');
                return;
            }
            const reservationInfo = {
                SYNCHRONIZER_TOKEN:"token",
                SYNCHRONIZER_URI: "/map",
                date: getNextDayDate(),
                seat:currentSeat,
                start:startTime,
                end:endTime,
                authid: "-1"
            };
            localStorage.setItem('reservationInfo', JSON.stringify(reservationInfo));
            showMessage("预约信息已保存");
        }, true);
    }
    async function makeReservation(reservationInfo) {
        reservationInfo.SYNCHRONIZER_TOKEN = await getSynchronizerToken();
        try {
            const response = await fetch('/selfRes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(reservationInfo),
            });
            const responseText = await response.text();
            console.log(responseText);
            if (/系统已经为您预定好了/.test(responseText)){
                showMessage("预约成功！");
                return true;
            }else if(/已有1个有效预约，请在使用结束后再次进行选择/.test(responseText)){
                showMessage("已有预约！");
                return true;
            }else if(/预约失败，请尽快选择其他时段或座位/.test(responseText)){
                showMessage("预约失败！");
                return true;
            }else if(/系统可预约时间为 19:00 ~ 23:00/.test(responseText)){
                showMessage("预约失败！");
                return false;
            }
        } catch (error) {
            showMessage("预约失败！");
        }
        return false;
    }
    async function reserveLoop(reservationInfo) {
        const now = Date.now();
        if (targetTime > now) {
            await new Promise(resolve => setTimeout(resolve, targetTime - now));
        }
        while (true) {
            var success = await makeReservation(reservationInfo);
            if (success) return;
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
    var reservationInfo = JSON.parse(localStorage.getItem('reservationInfo')) || null;
    if(reservationInfo){
        showMessage("seat:"+reservationInfo.seat);
        reserveLoop(reservationInfo);
    }else{
        showMessage("reservationInfo");
    }
})();
