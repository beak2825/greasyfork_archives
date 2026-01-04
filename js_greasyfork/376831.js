// ==UserScript==
// @name         Wechat Automatic Sender
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wx.qq.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376831/Wechat%20Automatic%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/376831/Wechat%20Automatic%20Sender.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var appElement = document.querySelector('[ng-controller=chatSenderController]');
    var $scope = angular.element(appElement).scope();
    setInterval(function(){
        var localTimeString = new Date().toLocaleTimeString();;
        if(localTimeString.indexOf('1:54:00 PM') === 0){
            $scope.editAreaCtn = "6.50了，你该起床了！";
            $scope.sendTextMessage();
        }
    },1000)
})();