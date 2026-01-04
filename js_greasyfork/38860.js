// ==UserScript==
// @name         macx missing appimgs fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fix appimgs missing in soft.macx
// @author       Ray Lee raylee.stu<>gmail.com
// @match        http://soft.macx.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38860/macx%20missing%20appimgs%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/38860/macx%20missing%20appimgs%20fixer.meta.js
// ==/UserScript==

(function(M) {
    M();
})(function() {
    var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');
    script.onload = function() {
        // do something
        $('.appimg img').each(function(){
            var src = $(this).attr('src');
            if(src.match(/img\.macx\.cn\//) === null){
                // last / is missing
                var new_src = src.replace('img.macx.cn', 'img.macx.cn/');
                $(this).attr('src', new_src);
            }
        });
    };
    script.type = 'text/javascript';
    script.src = 'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js';
    head.appendChild(script);
});