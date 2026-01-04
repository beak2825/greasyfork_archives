// ==UserScript==
// @name         StuInfoAutoWrite
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       WENTWORTHYANG
// @match        http://stuinfo.neu.edu.cn/cloud-xxbl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397236/StuInfoAutoWrite.user.js
// @updateURL https://update.greasyfork.org/scripts/397236/StuInfoAutoWrite.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    'use strict';
     var selectIDs=['sfgcyiqz',
            'sfqtdqlxs',
            'sfjcgbr',
            'sfjcglxsry',
            'sfjcgysqzbr',
            'sfjtcyjjfbqk',
            'sfqgfrmz',
            'sfygfr',
            'sfyghxdbsy',
            'sfygxhdbsy'
        ]


     $("input[name='hjnznl']").val("一直在家里");
     $("input[name='qgnl']").val("没出去过");

    for(i=0;i<selectIDs.length;i++){
        var select=document.getElementById(selectIDs[i]);
        select[2].selected=true;
    }
    save()
})();