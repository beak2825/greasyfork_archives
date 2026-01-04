// ==UserScript==
// @name         Block for Clutchfans
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  block for http://www.clutchfans.cn
// @author       Remarrexxar
// @match        *://www.clutchfans.cn/read-*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/382692/Block%20for%20Clutchfans.user.js
// @updateURL https://update.greasyfork.org/scripts/382692/Block%20for%20Clutchfans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var blockList
    $.get("/profile-index-contact?_tab=contact", function(data){
        var floors = $('div.J_read_floor');
        blockList = eval($(data).find('input[name="aliww"]').val());
        for(var i = 0;i<floors.size();i++){
            var name = $(floors[i]).find('.name').text().trim();
            if(blockList.indexOf(name)>=0){
                $(floors[i]).hide();
            }
        }
        blockList = eval($(data).find('input[name="qq"]').val());
        for(var j = 0;j<floors.size();j++){
            name = $(floors[i]).find('.name').text().trim();
            if(blockList.indexOf(name)>=0){
                $(floors[j]).hide();
            }
        }
    });

})();