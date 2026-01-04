// ==UserScript==
// @name         LIHKG Auto Block Bad Users
// @namespace    i-am-small-potato-it-dog
// @version      1.1
// @description  To auto block a list of bad users in LIHKG
// @author       小薯仔 IT 狗
// @match        https://lihkg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372246/LIHKG%20Auto%20Block%20Bad%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/372246/LIHKG%20Auto%20Block%20Bad%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var updatedXXXListData = null;

    var contentClassName = "GAagiRXJU88Nul1M7Ai0H";

    var replyClassName = "_2bokd4pLvU5_-Lc97NVqzn";

    var getParents = function (elem) {
        var parents = [];
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            parents.push(elem);
        }
        return parents;
    };

    var XXXlistJSON = "https://www.jasonbase.com/things/Bg6p.json";

    var fetchXXXList = async function(){
        try{
            var response = await fetch(XXXlistJSON);
            var data = await response.json();
            return data;
        }catch(e){
            console.log(e);
        }
        return false;
    };

    var blockXXX = async function(){

        if(!updatedXXXListData) {
            updatedXXXListData = await fetchXXXList();
            return;
        }

        var listOfXXX = updatedXXXListData.blockedIDs;

        for(var i in listOfXXX){
            var XXX = listOfXXX[i];
            var XXXreplies = document.querySelectorAll("a[href='/profile/" + XXX + "']");
            for( var r in XXXreplies){
                var XXXreply = XXXreplies[r];
                if(XXXreply.closest){
                    var XXXreplyDIV = XXXreply.closest("." + replyClassName).getElementsByClassName(contentClassName)[0];
                    var originalContent = XXXreplyDIV.innerHTML;
                    XXXreplyDIV.innerHTML = "<strong>== 此用戶已被 LIHKG Auto Blocker 封鎖 ==</strong>";
                }
            }
        }
    }

    setInterval(blockXXX, 1000);
})();