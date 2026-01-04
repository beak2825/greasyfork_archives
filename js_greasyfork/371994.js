// ==UserScript==
// @name         Bili 4x
// @version      0.1
// @description  Bilibili player speed up to 4x
// @author       vj
// @match        *://www.bilibili.com/blackboard/html5player.html*
// @match        *://www.bilibili.com/bangumi/play/ep*
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/bangumi/play/ss*
// @grant        none
// @namespace https://greasyfork.org/users/6696
// @downloadURL https://update.greasyfork.org/scripts/371994/Bili%204x.user.js
// @updateURL https://update.greasyfork.org/scripts/371994/Bili%204x.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function go(){
        var tar=$('#bilibiliPlayer > div.bilibili-player-context-menu-container.black.bilibili-player-context-menu-origin.active > ul > li:nth-child(1) > a > div');
        if(tar.length==1){
            var items=tar.find("span");
            if(items.length==6)
            {
                tar.append('<span data-rate="2.5">2.5</span>');
                tar.append('<span data-rate="2.8">2.8</span>');
                tar.append('<span data-rate="3">3</span>');
                tar.append('<span data-rate="3.5">3.5</span>');
                tar.append('<span data-rate="4">4</span>');
            }
        }
        setTimeout(go,500);
    }
    go();

})();