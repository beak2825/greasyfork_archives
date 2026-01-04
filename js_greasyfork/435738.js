// ==UserScript==
// @name         Log HTML Translator
// @description  按ctrl键触发html解码
// @version      1.2
// @author       Bota5ky
// @match        https://monitor-otr.mercedes-benz.com.cn/*
// @namespace    https://greasyfork.org/users/425094
// @downloadURL https://update.greasyfork.org/scripts/435738/Log%20HTML%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/435738/Log%20HTML%20Translator.meta.js
// ==/UserScript==
(function(){
    window.onkeydown = function translate(event){
        if (event.ctrlKey){
            $("div[class='truncate-by-height']").each(function(index, ele){$(ele).html(ele.innerText);});
            $("div[data-test-subj='tableDocViewRow-message-value']").each(function(index, ele){$(ele).html(ele.innerText);});
        }
    }
})();