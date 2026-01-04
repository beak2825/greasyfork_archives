// ==UserScript==
// @name         fastGithub
// @namespace    https://github.zhlh6.cn
// @version      0.2
// @description  加速你的github clone速度
// @author       ZHLH
// @match        https://github.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401027/fastGithub.user.js
// @updateURL https://update.greasyfork.org/scripts/401027/fastGithub.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
	    var patt = /git@github.com/;
        var address = document.querySelectorAll('input.input-monospace');
        var i,add;
        for(i = 0;i<address.length;i++){
            add = address[i];
            if(patt.test(add.value)){
                add.setAttribute("value",add.value.replace("git@github.com:","git@git.zhlh6.cn:"));
            }
        }
        var copyAddress = document.querySelectorAll('clipboard-copy.btn.btn-sm');
        var cadd;
        for(i = 0;i<copyAddress.length;i++){
            cadd = copyAddress[i];
            if(patt.test(cadd.value)){
                cadd.setAttribute("value",cadd.getAttribute("value").replace("git@github.com:","git@git.zhlh6.cn:"));
            }
        }
    },500);
})();