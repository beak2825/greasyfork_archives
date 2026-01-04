// ==UserScript==
// @name         fsoufsou免登录取消Github/Stackoverflow加速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  如名字
// @author       Repobor
// @match        https://fsoufsou.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fsoufsou.com
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/450238/fsoufsou%E5%85%8D%E7%99%BB%E5%BD%95%E5%8F%96%E6%B6%88GithubStackoverflow%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/450238/fsoufsou%E5%85%8D%E7%99%BB%E5%BD%95%E5%8F%96%E6%B6%88GithubStackoverflow%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var userSettingsEntity = JSON.parse(localStorage['userSettings']);
    if(typeof(userSettingsEntity) !== undefined) {
        userSettingsEntity.Preference.SiteAcceleration.GitHub = 'false'
        userSettingsEntity.Preference.SiteAcceleration.Stackoverflow = 'false'
        localStorage.setItem('userSettings', JSON.stringify(userSettingsEntity));
    }
})();