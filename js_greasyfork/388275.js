// ==UserScript==
// @name         Тестовый скрипт
// @namespace    http://shikimorilive.top/
// @version      2.2
// @description  Тестовый скрипт для проверки автообновления
// @author       JuniorDEV & masgasatriawirawan
// @supportURL   https://greacyfork.org/issues
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @match         	https://shikimori.one/*
// @match         	https://shikimori.org/*
// @match         	https://shikimorilive.top/*
// @match         	http://shikimorilive.test/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/388275/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/388275/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==

location.href="javascript:(function(){ window.SLiveVersion = '1.5'; })()";
//alert(123);