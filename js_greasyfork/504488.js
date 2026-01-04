// ==UserScript==
// @name         图寻自信模式
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  将不会继续维护。在对局中隐藏对方的信息和血量变化，并且可以屏蔽表情。
// @icon         https://s.chao-fan.com/tuxun/favicon.ico
// @author       航线规划院
// @match        https://tuxun.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504488/%E5%9B%BE%E5%AF%BB%E8%87%AA%E4%BF%A1%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/504488/%E5%9B%BE%E5%AF%BB%E8%87%AA%E4%BF%A1%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styleOpponent = document.createElement('style');
    styleOpponent.type = 'text/css';
    styleOpponent.innerHTML = `
        .playerName___IKlNQ { display: none !important; }
        .userName___MXV57 { display: none !important; }
        .maplibregl-marker.maplibregl-marker-anchor-bottom .ant-avatar.ant-avatar-circle.ant-avatar-image img { display: none !important; }
        .maplibregl-marker.maplibregl-marker-anchor-bottom sup { display: none !important; }
        .vs___oRM_X { display: none !important; }
        .hudContainer___HMMcE:not(.rightTeam___kVrbS) .avatarCover___tYu0C { background-image: url("https://s.chao-fan.com/tuxun/images/user/red_team.png") !important; }
        .hudContainer___HMMcE.rightTeam___kVrbS .avatarCover___tYu0C { background-image: url("https://s.chao-fan.com/tuxun/images/user/blue_team.png") !important; }
    `;

    var styleScore = document.createElement('style');
    styleScore.type = 'text/css';
    styleScore.innerHTML = `
        .hudHealthBarBox___BPbp6 { display: none !important; }
        .hudHealthBarInner___atsdx span { display: none !important; }
        .roundScore___OWkm_ { display: none !important; }
        .mapResult___uG4SH { margin-bottom: 3.5rem; }
    `;

    var styleHideMap = document.createElement('style');
    styleHideMap.type = 'text/css';
    styleHideMap.innerHTML = `
        .ant-divider-horizontal { display: none !important; }
        .mapResult___uG4SH { display: none !important; }
    `;

    var styleHideEmojis = document.createElement('style');
    styleHideEmojis.type = 'text/css';
    styleHideEmojis.innerHTML = `
        .message___MPVpr { display: none !important; }
    `;

    const button = document.createElement('div');
    button.style.cssText = 'height: 40px; width: 40px; background-color: #000c; border-radius: 50%; align-items: center; justify-content: center; display: flex; cursor: pointer; position: fixed; top: 30%; right: 24px; color: white; font-size: 20px; text-align: center; z-index: 999; user-select: none;';
    button.innerHTML = '☰';
    document.body.appendChild(button);

    const indicator = document.createElement('div');
    indicator.style.cssText = 'position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background-color: #4CAF50; border-radius: 50%; border: 2px solid #000c; display: none;';
    button.appendChild(indicator);

    const toggleContainer = document.createElement('div');
    toggleContainer.style.cssText = 'position: fixed; background: #000b; color: white; padding: 10px; right: 24px; border-radius: 8px; display: none; z-index: 999; user-select: none;';
    toggleContainer.innerHTML = `
        <label><input type="checkbox" id="hideOpponent" ${localStorage.getItem('hideOpponent') === 'true' ? 'checked' : ''}> 隐藏对手信息</label><br>
        <label><input type="checkbox" id="hideScore" ${localStorage.getItem('hideScore') === 'true' ? 'checked' : ''}> 隐藏分数变动</label><br>
        <label><input type="checkbox" id="hideMap" ${localStorage.getItem('hideMap') === 'true' ? 'checked' : ''}> 隐藏分数时不显示地图</label><br>
        <label><input type="checkbox" id="hideEmojis" ${localStorage.getItem('hideEmojis') === 'true' ? 'checked' : ''}> 屏蔽表情</label>
    `;
    document.body.appendChild(toggleContainer);

    function checkAnyFeatureEnabled() {
        const hideOpponent = localStorage.getItem('hideOpponent') === 'true';
        const hideScore = localStorage.getItem('hideScore') === 'true';
        const hideMap = localStorage.getItem('hideMap') === 'true';
        const hideEmojis = localStorage.getItem('hideEmojis') === 'true';

        return hideOpponent || hideScore || hideMap || hideEmojis;
    }

    function updateIndicator() {
        if (checkAnyFeatureEnabled()) {
            indicator.style.display = 'block';
        } else {
            indicator.style.display = 'none';
        }
    }

    button.addEventListener('click', () => {
        const rect = button.getBoundingClientRect();
        toggleContainer.style.top = `${rect.bottom + 10}px`;
        toggleContainer.style.display = toggleContainer.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (event) => {
        if (!button.contains(event.target) && !toggleContainer.contains(event.target)) {
            toggleContainer.style.display = 'none';
        }
    });

    function applyStyles() {
        const currentUrl = window.location.href;
        if (currentUrl.includes("tuxun.fun/challenge") || currentUrl.includes("tuxun.fun/replay") || currentUrl.includes("tuxun.fun/point")) { // 挑战、回放、积分赛
            removeStyles();
        } else {
            if (localStorage.getItem('hideOpponent') === 'true') {
                document.head.appendChild(styleOpponent);
            }
            if (localStorage.getItem('hideScore') === 'true') {
                document.head.appendChild(styleScore);

                if (localStorage.getItem('hideMap') === 'true') {
                    document.head.appendChild(styleHideMap);
                }
            }
            if (localStorage.getItem('hideEmojis') === 'true') {
                document.head.appendChild(styleHideEmojis);
            }
        }
    }

    function removeStyles() {
        if (document.head.contains(styleOpponent)) {
            document.head.removeChild(styleOpponent);
        }
        if (document.head.contains(styleScore)) {
            document.head.removeChild(styleScore);
        }
        if (document.head.contains(styleHideMap)) {
            document.head.removeChild(styleHideMap);
        }
        if (document.head.contains(styleHideEmojis)) {
            document.head.removeChild(styleHideEmojis);
        }
    }

    document.getElementById('hideOpponent').addEventListener('change', function() {
        const isChecked = this.checked;
        localStorage.setItem('hideOpponent', isChecked);
        if (isChecked) {
            document.head.appendChild(styleOpponent);
        } else {
            document.head.removeChild(styleOpponent);
        }
        updateIndicator();
    });

    document.getElementById('hideScore').addEventListener('change', function() {
        const isChecked = this.checked;
        localStorage.setItem('hideScore', isChecked);
        if (isChecked) {
            document.head.appendChild(styleScore);

            if (localStorage.getItem('hideMap') === 'true') {
                document.head.appendChild(styleHideMap);
            }
        } else {
            document.head.removeChild(styleScore);
            if (document.head.contains(styleHideMap)) {
                document.head.removeChild(styleHideMap);
            }
            localStorage.setItem('hideMap', false);
            document.getElementById('hideMap').checked = false;
        }
        updateIndicator();
    });

    document.getElementById('hideMap').addEventListener('change', function() {
        const isChecked = this.checked;
        localStorage.setItem('hideMap', isChecked);

        if (localStorage.getItem('hideScore') === 'true' && isChecked) {
            document.head.appendChild(styleHideMap);
        } else {
            document.head.removeChild(styleHideMap);
        }
        updateIndicator();
    });

    document.getElementById('hideEmojis').addEventListener('change', function() {
        const isChecked = this.checked;
        localStorage.setItem('hideEmojis', isChecked);
        if (isChecked) {
            document.head.appendChild(styleHideEmojis);
        } else {
            if (document.head.contains(styleHideMap)) {
                document.head.removeChild(styleHideMap);
            }
        }
        updateIndicator();
    });

    setInterval(applyStyles, 1000);

    applyStyles();
    updateIndicator();

})();