// ==UserScript==
// @name        Jandan Copy
// @namespace   -
// @description 强力解除煎蛋复制限制
// @include     http://jandan.net/*
// @version     0.3
// @rut-at      document-start
// @copyright   mistree
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14289/Jandan%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/14289/Jandan%20Copy.meta.js
// ==/UserScript==

EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener)
{
    if(type=="copy") return;
    if(!this.EventList) { this.EventList = []; }
    this.addEventListenerBase.apply(this, arguments);
    if(!this.EventList[type]) { this.EventList[type] = []; }
    var list = this.EventList[type];
    for(var index = 0; index != list.length; index++)
    {
        if(list[index] === listener) { return; }
    }
    list.push(listener);
};