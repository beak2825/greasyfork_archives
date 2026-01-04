// ==UserScript==
// @name         sekiro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sekiro使用示例
// @author       moxiaoying
// @include      https://www.python-spider.com/challenge/*
// @require      https://greasyfork.org/scripts/437373-sekiro/code/sekiro.js?version=1000671
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437381/sekiro.user.js
// @updateURL https://update.greasyfork.org/scripts/437381/sekiro.meta.js
// ==/UserScript==

'use strict';
var client = new SekiroClient("wss://sekiro.moxiaoying.xyz/websocket?group=ws-group-moxiaoying&clientId="+guid());
client.registerAction("clientTime",function(request, resolve,reject ){
    page = request['page']
   
})
