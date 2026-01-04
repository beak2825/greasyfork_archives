// ==UserScript==
// @name       Gamer Auto Check-in BETA
// @namespace    undefined
// @description      巴哈姆特動自動簽到 BETA
// @author        chunhung
// @icon          https://www.gamer.com.tw/favicon.ico
// @version       1000.2017
// @include       https://www.gamer.com.tw/*
// @grant unsafeWindow
// @grant randomizator
// @downloadURL https://update.greasyfork.org/scripts/36162/Gamer%20Auto%20Check-in%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/36162/Gamer%20Auto%20Check-in%20BETA.meta.js
// ==/UserScript==

//Hidden Alert
unsafeWindow.alert = function alert(message) {
    console.log('Hidden Alert ' + message);
};

(function() {
Signin.start(this);
console.log('Clicked');
})();