// ==UserScript==
// @name          digitalchestnut.com/merryclickmas 클리커
// @namespace     digitalchestnut.com/merryclickmas 클리커
// @match       *://www.digitalchestnut.com/merryclickmas/*
// @version       0.1
// @description  우측 상단에 클릭 자동화 버튼을 추가합니다.
// @icon          data:image/jpeg;base64,AAABAAIAEBAAAAEAIADsAAAAJgAAACAgAAABACAA3wEAABIBAACJUE5HDQoaCgAAAA1JSERSAAAAEAAAABAIBgAAAB/z/2EAAACzSURBVDiNpdPPDUFBEMfxT1CCTijAWVQgCnChg3dTgD8NiB4chAKQ0IIiHMQFlyfZ8Ni3TDLZye7sNzO/3eHd7vnaxqjgPGonDLELYNAqC7gHnqGZx/NfAE9ffkquFOzNsME5ANbydVG2CujjElRxQCcFAOMA0CtKqEYANXSDuI59SgUd74LOUwATkRa+2auIRyVFnGKNa37xhpWEZwz7vYl8pBggQ0OieCcMsPXHMFFynB9EOECt0jkycAAAAABJRU5ErkJggolQTkcNChoKAAAADUlIRFIAAAAgAAAAIAgGAAAAc3p69AAAAaZJREFUWIW910FLF0EYBvBfmYfSyOggRCB6qSAt6m95UNNTdq/OBX2YCPwA4tFLBUF00Ki+Ql06hKc6dNBOJSVB+f93mIxt29Vxd2cfeGFneHneZ3Z233mG/XEzIicpXhTMTWG0LQFdnM+MZ7GFy02QH4nIOYQnWMNHPMQA+psQEINeSUzn8o7jVJsC1jGJa1jGZ5xsU0APO5nnlRTF9xOQjetVyA9H5FzBXTwTVlyELj5VEXBQjOON4jfwWhA7Ify2Z1KJOIqXJSJ24zvmUgmAE/hQUvwHbqQsvos7JQJut1Ec+rBRIGDmoCRV0UMHF3LzA8KH+qUGdzQeKN6GX3gqHFx7IqYPVEFP6A3dRPx/8dj/q3+EkdSFCUd57Y+wzhbcwnDB/OkanNEYEsxJWSNK6iOPCX1/r1a8jfkUxS/ibUnRV7gk9IWzGtyKDu7huX8NSN6YjDVVMI9YQzJXhbxuI8o2mvs1uUpRtuL3ggHpYAmbWjaleVs+qIItj7mYwDusCiZkUTjxfuZyvv2JxtHFucx4Gl81dDWLwVrB3FUtXk4XUpL/Bup9rg57G+/gAAAAAElFTkSuQmCC
// @author        mickey90427 <mickey90427@naver.com>
// @downloadURL https://update.greasyfork.org/scripts/461102/digitalchestnutcommerryclickmas%20%ED%81%B4%EB%A6%AC%EC%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/461102/digitalchestnutcommerryclickmas%20%ED%81%B4%EB%A6%AC%EC%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isAutoClicking = false;
    var greenButtonInterval = null;
    var redButtonInterval = null;

    function startAutoClick() {
        if (isAutoClicking) {
            return;
        }
        isAutoClicking = true;
        greenButtonInterval = setInterval(function() {
            document.querySelector('.button.green_button').dispatchEvent(new MouseEvent('mouseup'));
        }, 1);
        redButtonInterval = setInterval(function() {
            document.querySelector('.button.red_button').dispatchEvent(new MouseEvent('mouseup'));
        }, 1);
    }

    function stopAutoClick() {
        if (!isAutoClicking) {
            return;
        }
        isAutoClicking = false;
        clearInterval(greenButtonInterval);
        clearInterval(redButtonInterval);
    }

    function createToggleButton() {
        var button = document.createElement('button');
        button.innerHTML = '클릭 자동화 시작';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.addEventListener('click', function() {
            if (isAutoClicking) {
                stopAutoClick();
                button.innerHTML = '클릭 자동화 시작';
            } else {
                startAutoClick();
                button.innerHTML = '클릭 자동화 중지';
            }
        });
        document.body.appendChild(button);
    }

    createToggleButton();
})();
