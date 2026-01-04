// ==UserScript==
// @name         YouTube Scroll Alert
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  University of Yamanashi GoLab
// @author       DENG WENXIN
// @match        *://m.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518801/YouTube%20Scroll%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/518801/YouTube%20Scroll%20Alert.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const channel = new BroadcastChannel('youtube_watch_counter');
    let alertVisible = false;

    function getNowTime() {
        return new Date().getTime();
    }

    function formatDateTime(date) {
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    let active = true;
    let lastActiveTime = getNowTime();
    let totalActiveTime = parseInt(localStorage.getItem("totalActiveTime") || "0");
    let nowActiveTime = parseInt(localStorage.getItem("nowActiveTime") || "0");
    let videoViewCount = parseInt(localStorage.getItem("videoViewCount") || "0");
    let newContents = parseInt(localStorage.getItem("newContents") || "0");
    let warningCloseCount = parseInt(localStorage.getItem("warningCloseCount") || "0");
    const sessionStartTime = getNowTime();

    const MIN_ACTIVE_TIME_BEFORE_ALERT = 15 * 60 * 1000; // 15 minutes in milliseconds

    const lastSessionData = localStorage.getItem("lastSessionData");

    function exportstartCsv(content, filenamePrefix) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const filename = `${filenamePrefix}_${formatDateTime(new Date()).replace(/[ :]/g, '_')}.csv`;

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    function updateCloseSessionData(trigger = '') {
        const now = new Date();
        const closeData = {
            lastCloseTime: formatDateTime(now),
            lastNewContents: newContents,
            lastVideoViewCount: videoViewCount,
            warningTime: trigger === 'warning' ? formatDateTime(now) : null,
            warningCloseCount: warningCloseCount
        };

        localStorage.setItem("lastSessionData", JSON.stringify(closeData));
    }

    function handleWarningClose() {
        warningCloseCount++;
        localStorage.setItem("warningCloseCount", warningCloseCount);
        updateCloseSessionData('warning');
    }

    function handleVisibilityChange() {
        updateActiveTimes();
        if (document.hidden) {
            active = false;
        } else {
            active = true;
            lastActiveTime = getNowTime();
        }
    }

    function updateActiveTimes() {
        if (active) {
            const now = getNowTime();
            const elapsed = now - lastActiveTime;
            if(parseInt(localStorage.getItem("totalActiveTime")) > totalActiveTime){
                totalActiveTime = parseInt(localStorage.getItem("totalActiveTime") || "0");
            }
            if(parseInt(localStorage.getItem("nowActiveTime")) > nowActiveTime){
                nowActiveTime = parseInt(localStorage.getItem("nowActiveTime") || "0");
            }
            totalActiveTime += elapsed;
            nowActiveTime += elapsed;
            localStorage.setItem("totalActiveTime", totalActiveTime);
            localStorage.setItem("nowActiveTime", nowActiveTime);
            localStorage.setItem("lastActiveTime", now);
            lastActiveTime = now;
        }
    }

    function checkAndResetDailyTime() {
        const lastResetDate = localStorage.getItem("lastResetDate");
        const currentDate = new Date().toDateString();

        if (lastResetDate !== currentDate) {
            totalActiveTime = 0;
            localStorage.setItem("totalActiveTime", totalActiveTime);
            localStorage.setItem("lastResetDate", currentDate);
        }
    }

    function checkSessionActiveTime() {
        const lastActiveTime = parseInt(localStorage.getItem("lastActiveTime") || "0");
        const now = getNowTime();
        if (now - lastActiveTime > 5 * 60 * 1000) {
            nowActiveTime = 0;
            localStorage.setItem("nowActiveTime", nowActiveTime);
            localStorage.setItem("videoViewCount",0);
            localStorage.setItem("newContents",0);
        }
    }

    function exportCsv(action) {
        const sessionStart = new Date(sessionStartTime);
        const now = new Date();
        const currentDate = formatDateTime(sessionStart);
        const triggerDate = formatDateTime(now);

        const totalActiveHours = Math.floor(totalActiveTime / 3600000);
        const totalActiveMinutes = Math.floor((totalActiveTime % 3600000) / 60000);
        const totalActiveSeconds = Math.floor((totalActiveTime % 60000) / 1000);
        const nowActiveHours = Math.floor(nowActiveTime / 3600000);
        const nowActiveMinutes = Math.floor((nowActiveTime % 3600000) / 60000);
        const nowActiveSeconds = Math.floor((nowActiveTime % 60000) / 1000);

        const csvContent = `Session Start Time,Trigger Time,Session Active Time,Action,Total Active Time\n${currentDate},${triggerDate},${nowActiveHours} Hours ${nowActiveMinutes} Mins ${nowActiveSeconds} Seconds,${action},${totalActiveHours} Hours ${totalActiveMinutes} Mins ${totalActiveSeconds} Seconds\n`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const filename = `youtube_log_${formatDateTime(now).replace(/[ :]/g, '_')}.csv`;

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.addEventListener("beforeunload", function() {
        updateActiveTimes();
        if(alertVisible){
            alertVisible = false;
            channel.postMessage({ action: 'closeAlert' });
            exportCsv('beforeunload');
        }
    });

    let functionalityActivated = false;

    function createStatusIcon() {
        console.log("Creating statusIcon...");
        let statusIcon = document.getElementById('statusIcon');
        if (!statusIcon) {
            statusIcon = document.createElement('div');
            statusIcon.id = 'statusIcon';
            statusIcon.style.position = 'fixed';
            statusIcon.style.top = '10px';
            statusIcon.style.right = '10px';
            statusIcon.style.backgroundColor = 'white';
            statusIcon.style.color = 'red';
            statusIcon.style.padding = '10px';
            statusIcon.style.borderRadius = '50%';
            statusIcon.style.fontSize = '20px';
            statusIcon.style.zIndex = '10000';
            document.body.appendChild(statusIcon);
        }

        // Clear existing content
        while (statusIcon.firstChild) {
            statusIcon.removeChild(statusIcon.firstChild);
        }

        // Add Views text
        const viewsText = document.createElement('div');
        viewsText.textContent = `Views: ${videoViewCount}`;
        statusIcon.appendChild(viewsText);

        // Add a line break (simulating a <br> tag)
        const lineBreak1 = document.createElement('div');
        lineBreak1.style.marginBottom = '5px'; // Optional: adjust spacing
        statusIcon.appendChild(lineBreak1);

        // Add New text
        const newText = document.createElement('div');
        newText.textContent = `New: ${newContents}`;
        statusIcon.appendChild(newText);

        // Add a line break (simulating a <br> tag)
        const lineBreak2 = document.createElement('div');
        lineBreak2.style.marginBottom = '5px'; // Optional: adjust spacing
        statusIcon.appendChild(lineBreak2);

        // Add time text
        const timeText = document.createElement('div');
        timeText.textContent = `time: ${nowActiveTime}`;
        statusIcon.appendChild(timeText);
    }

    function activateFunctionality() {
        if (functionalityActivated) return;
        if (!sessionStorage.getItem('isSessionActive')) {
            const lastSessionData = localStorage.getItem("lastSessionData");

            // 如果存在上一次的会话数据，导出为 CSV 文件
            if (lastSessionData) {
                const parsedData = JSON.parse(lastSessionData);
                const csvContent = `Last Close Time,Reopen Time,Last NewContents,Last VideoViewCount,Warning Shown,Warning Close Count\n` +
                      `${parsedData.lastCloseTime},${formatDateTime(new Date())},${parsedData.lastNewContents},${parsedData.lastVideoViewCount},${parsedData.warningTime || ''},${parsedData.warningCloseCount}\n`;
                exportCsv(csvContent, 'last_session_log');
                localStorage.removeItem("lastSessionData");
            }

            // 设置会话标记，避免本次会话重复触发
            sessionStorage.setItem('isSessionActive', 'true');
        }
        functionalityActivated = true;

        if (!window.lastVideoViewTime) {
            window.lastVideoViewTime = 0;
        }

        const now = getNowTime();
        if (now - window.lastVideoViewTime >= 2000) {
            videoViewCount = parseInt(localStorage.getItem("videoViewCount") || "0");
            videoViewCount++;
            localStorage.setItem("videoViewCount", videoViewCount);
            window.lastVideoViewTime = now;

            if (videoViewCount >= 15 && nowActiveTime >= MIN_ACTIVE_TIME_BEFORE_ALERT) {
                showAlert(`休憩しよう！\n\n`);
                channel.postMessage({ action: 'showAlert1', videoViewCount });
                videoViewCount = 0;
                localStorage.setItem("videoViewCount", videoViewCount);
                newContents = 0;
                localStorage.setItem("newContents", newContents);
            }
        }

        let pageRefreshes = sessionStorage.getItem('pageRefreshes');
        if (pageRefreshes) {
            sessionStorage.setItem('pageRefreshes', Number(pageRefreshes) + 1);
        } else {
            sessionStorage.setItem('pageRefreshes', 0);
        }
        pageRefreshes = sessionStorage.getItem('pageRefreshes');
        checkAndResetDailyTime();
        checkSessionActiveTime();

        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;

                const now = getNowTime();
                if (now - window.lastVideoViewTime >= 2000) {
                    videoViewCount++;
                    localStorage.setItem("videoViewCount", videoViewCount);
                    window.lastVideoViewTime = now;

                    if (videoViewCount >= 15 && nowActiveTime >= MIN_ACTIVE_TIME_BEFORE_ALERT) {
                        showAlert(`休憩しよう！\n\n`);
                        channel.postMessage({ action: 'showAlert1', videoViewCount });
                        videoViewCount = 0;
                        localStorage.setItem("videoViewCount", videoViewCount);
                        newContents = 0;
                        localStorage.setItem("newContents", newContents);
                    }
                }
            }
        }).observe(document, { subtree: true, childList: true });

        window.addEventListener('scroll', function() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

            if (scrollTop + windowHeight >= scrollHeight * 0.9) {
                newContents = parseInt(localStorage.getItem("newContents") || "0");
                newContents++;
            }

            if (!window.lastDynamicUpdateTime) {
                window.lastDynamicUpdateTime = 0;
            }

            const now = getNowTime();
            updateCloseSessionData();
            if (now - window.lastDynamicUpdateTime < 2000) {
                return;
            }

            window.lastDynamicUpdateTime = now;

            updateActiveTimes();
            let timeOnPage = nowActiveTime;
            let timeOnPageH = Math.floor(timeOnPage / 3600000);
            let timeOnPageM = Math.floor((timeOnPage % 3600000) / 60000);
            let timeOnPageS = Math.floor((timeOnPage % 60000) / 1000);

            localStorage.setItem("newContents", newContents);
            if (newContents >= 30 && nowActiveTime >= MIN_ACTIVE_TIME_BEFORE_ALERT) {
                newContents = 0;
                localStorage.setItem("newContents", newContents);
                videoViewCount = 0;
                localStorage.setItem("videoViewCount", videoViewCount);
                showAlert(`${timeOnPageH} 時間 ${timeOnPageM} 分経ちました。\n少し休んでください。`);
                channel.postMessage({ action: 'showAlert2', videoViewCount });
                window.lastDynamicUpdateTime = 0; // Reset last update time
            }
        });
    }

    function handleScrollOnce() {
        window.removeEventListener('scroll', handleScrollOnce);
        activateFunctionality();
    }

    window.addEventListener('load', activateFunctionality);
    window.addEventListener('scroll', handleScrollOnce);
    //window.addEventListener('scroll', createStatusIcon);

    channel.onmessage = (event) => {
        const { action } = event.data;
        if (action === 'showAlert1') {
            showAlert(`休憩しよう！\n\n`);
        } else if (action === 'showAlert2') {
            showAlert(`少し休んでください。\n\n`);
        } else if (action === 'closeAlert') {
            const existingAlert = document.getElementById("customAlert");
            if (existingAlert) {
                existingAlert.remove();
            }
            alertVisible = false;
        } else if (action === 'closeAll') {
            alertVisible = false;
            window.open('about:blank', '_self').close();
            window.open('about:blank', '_self').close();
            window.open('about:blank', '_self').close();
        }
    };

    function showAlert(message) {
        const existingAlert = document.getElementById("customAlert");
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement("div");
        alertDiv.id = "customAlert";
        alertDiv.style.position = "fixed";
        alertDiv.style.top = "50%";
        alertDiv.style.left = "50%";
        alertDiv.style.transform = "translate(-50%, -50%)";
        alertDiv.style.padding = "30px";
        alertDiv.style.backgroundColor = "#ffffff";
        alertDiv.style.border = "1px solid #ccc";
        alertDiv.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.3)";
        alertDiv.style.zIndex = 10000;
        alertDiv.style.width = "320px";
        alertDiv.style.textAlign = "center";
        alertDiv.style.borderRadius = "10px";
        alertDiv.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";

        // X button
        const closeButton = document.createElement("span");
        closeButton.textContent = "✖";
        closeButton.style.position = "absolute";
        closeButton.style.top = "15px";
        closeButton.style.right = "15px";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "20px";
        closeButton.style.backgroundColor = "#f44336";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "50%";
        closeButton.style.width = "30px";
        closeButton.style.height = "30px";
        closeButton.style.display = "flex";
        closeButton.style.alignItems = "center";
        closeButton.style.justifyContent = "center";
        closeButton.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

        closeButton.onmouseover = () => {
            closeButton.style.backgroundColor = "#d32f2f";
        };
        closeButton.onmouseout = () => {
            closeButton.style.backgroundColor = "#f44336";
        };

        closeButton.onclick = () => {
            videoViewCount = 0;
            localStorage.setItem("videoViewCount", videoViewCount);
            newContents = 0;
            localStorage.setItem("newContents", newContents);
            window.lastDynamicUpdateTime = 0;
            exportCsv('X');
            document.body.removeChild(alertDiv);
            handleWarningClose();
            channel.postMessage({ action: 'closeAlert' });
        };
        alertDiv.appendChild(closeButton);

        // Alert content
        const messagePara = document.createElement("div");
        messagePara.style.margin = "20px 0";
        messagePara.style.fontSize = "16px";
        messagePara.style.color = "#333";

        // Add title
        const title = document.createElement("strong");
        title.style.fontSize = "20px";
        title.style.color = "red";
        title.textContent = "⚠ 警告";
        messagePara.appendChild(title);

        // Add line break
        messagePara.appendChild(document.createElement("br"));
        messagePara.appendChild(document.createElement("br"));

        // Add message text with line breaks
        const messageParts = message.split('\n');
        messageParts.forEach((part, index) => {
            const span = document.createElement("span");
            span.textContent = part;
            messagePara.appendChild(span);
            if (index < messageParts.length - 1) {
                messagePara.appendChild(document.createElement("br"));
            }
        });

        alertDiv.appendChild(messagePara);

        // Button container
        const buttonDiv = document.createElement("div");
        buttonDiv.style.display = "flex";
        buttonDiv.style.justifyContent = "center";
        buttonDiv.style.alignItems = "center";
        buttonDiv.style.marginTop = "20px";

        // Create cancel button
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "YouTubeを閉じる";
        cancelButton.style.backgroundColor = "#2AD2C9";
        cancelButton.style.color = "white";
        cancelButton.style.border = "none";
        cancelButton.style.padding = "10px 20px";
        cancelButton.style.cursor = "pointer";
        cancelButton.style.borderRadius = "4px";
        cancelButton.style.fontSize = "16px";
        cancelButton.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

        cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = "#26b5af";
        };
        cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = "#2AD2C9";
        };

        cancelButton.onclick = () => {
            videoViewCount = 0;
            localStorage.setItem("videoViewCount", videoViewCount);
            newContents = 0;
            localStorage.setItem("newContents", newContents);
            window.lastDynamicUpdateTime = 0;
            handleWarningClose();
            exportCsv('YouTubeを閉じる');
            channel.postMessage({ action: 'closeAll' });
            window.open('about:blank', '_self').close();
        };
        buttonDiv.appendChild(cancelButton);

        alertDiv.appendChild(buttonDiv);

        document.body.appendChild(alertDiv);
    }
})();


