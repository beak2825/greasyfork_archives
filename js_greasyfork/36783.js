// ==UserScript==
// @name         TEST
// @namespace    TEST
// @version      1.0
// @description  heal faster
// @author       LigarYT
// @match        http://moomoo.io/*
// @match        http://45.77.0.81/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @connect      moomoo.io
// @icon         http://moomoo.io/img/icons/skull.png
// @downloadURL https://update.greasyfork.org/scripts/36783/TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/36783/TEST.meta.js
// ==/UserScript==

document.addEventListener('mousedown', 
          e.stopPropagation()
            );ws.send("42[\"4\",1,null]") ;
            setTimeout(function () {
                ws.send("42[\"5\"," + player.items[ITEM_TYPE.FOOD].id + ",true]");
            }, 100);