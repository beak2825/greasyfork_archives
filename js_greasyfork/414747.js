// ==UserScript==
// @name         屏蔽3DM安忆评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安忆是NC
// @author       765643729
// @include      *://www.3dmgame.com/*
// @run-at       document-start
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/414747/%E5%B1%8F%E8%94%BD3DM%E5%AE%89%E5%BF%86%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/414747/%E5%B1%8F%E8%94%BD3DM%E5%AE%89%E5%BF%86%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var code=unescape("%3Acontains%28%27%u5B89%u5FC6%27%29");
    console.log(code);
    setInterval(function(){
        var $test=$('.Cslis_item').filter(code);
        for(var i=$test.length-1;i>=0;i--){
            $test[i].remove();
        }
    },500);
})();