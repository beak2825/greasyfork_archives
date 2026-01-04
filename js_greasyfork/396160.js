// ==UserScript==
// @name         FDWorlds work bot
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @include      http://www.fdworlds.net/*
// @include      https://www.fdworlds.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396160/FDWorlds%20work%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/396160/FDWorlds%20work%20bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var config = {
        MS_IN_SECOND: 1000,
        SECONDS_TIMEOUT: 60,
        SECONDS_TIMEOUT_PAGE: 10,
        loginInputId: 'login',
        passwordInputId: 'pass',
        submitInputId: 'subm',
        nickname: '***',			// your nickname here
        password: '***',			// your password here
    };

    setTimeout(() => {
        auth();
        var doc = getGameDocument();
        doc && hideBuildingImg(doc);
        doc && startWork(doc);
    }, config.SECONDS_TIMEOUT_PAGE * config.MS_IN_SECOND);

    function auth() {
        var loginInput = document.getElementById(config.loginInputId);
        var submitInput = document.getElementById(config.submitInputId);
        if (!loginInput || !submitInput) {
            return;
        }

        var passwordInput = document.getElementById(config.passwordInputId);
        !!passwordInput ? auth2() : auth1();

        function auth1() {
            loginInput.value = config.nickname;
            submitInput.click();
        }

        function auth2() {
            loginInput.value = config.nickname;
            passwordInput.value = config.password;
            submitInput.click();
        }
    }

    function getGameDocument() {
        var outerFrame,
            outerFrameDoc,
            innerFrame,
            innerFrameDoc;

        outerFrame = document.querySelector('frame[src="/main_frame.php"]');
        outerFrame && (outerFrameDoc = outerFrame.contentWindow.document);
        outerFrameDoc && (innerFrame = outerFrameDoc.querySelector('iframe[src="building/index.php"]'));
        innerFrame && (innerFrameDoc = innerFrame.contentWindow.document);

        return innerFrameDoc;
    }

    function hideBuildingImg(doc) {
        var imgElem = doc.querySelector('img[src*="/img/locations/nd/"][src*="stroyka"]');
        imgElem && (imgElem.hidden = true);
    }

    function startWork(doc) {
        var formElem = doc.querySelector('form[action="/building/index.php"]');
        logger('Elem: <form>');
        var selectElement = formElem.querySelector('select[name="kind"]');
        if (selectElement) {
            [].slice
                .call(selectElement.children)
                .reverse()
                .find(e => e.style.color === 'darkgreen')
                .setAttribute('selected', true);

            logger('Elem: <select>');
        }
        var beginWorkBtn = formElem.querySelector('input[value="Начать работать"]');
        beginWorkBtn && beginWorkBtn.click && beginWorkBtn.click() && logger('Elem: <input>');
    }

    function logger(data) {
        console.log(`${new Date().toLocaleString()} |`, data);
    }

    setTimeout(() => {
        location.reload();
    }, config.SECONDS_TIMEOUT * config.MS_IN_SECOND);

})();