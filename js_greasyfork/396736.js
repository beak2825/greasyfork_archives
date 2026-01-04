// ==UserScript==
// @name:zh-CN   notranslate-防止翻译代码段和公式
// @name:zh-TW   notranslate-防止翻譯代碼段和公式
// @name:en      notranslate-Prevent translating snippets and formulas
// @name         notranslate-Prevent translating snippets and formulas
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description:zh-CN  避免文献及博客阅读时代码段与公式被不正确地翻译
// @description:zh-TW  避免文獻及博客閲讀時代碼段與公式被不正塙地翻譯
// @description:en  A tampermonkey script aims to prevent unnecessary translation of code segment and math equations.
// @description  A tampermonkey script aims to prevent unnecessary translation of code segment and math equations.
// @author       winding
// @supportURL   https://github.com/windingwind/notranslate/blob/master/README.md
// @include      *
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/396736/notranslate-Prevent%20translating%20snippets%20and%20formulas.user.js
// @updateURL https://update.greasyfork.org/scripts/396736/notranslate-Prevent%20translating%20snippets%20and%20formulas.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
       You can add your settings here.
       "type" can be "id", "class", or "element".
       "param" is how you  trace the target element.
    */
    const behaviorList = [
        {
            'type':'class',
            'param':'prettyprint',
        },
        {
            'type':'class',
            'param':'mjx-chtml',
        },
        {
            'type':'class',
            'param':'MJXc-display',
        },
        {
            'type':'class',
            'param':'MathJax_Display',
        },
        {
            'type':'class',
            'param':'math-container',
        },
        {
            'type':'class',
            'param':'MathJax',
        },
        {
            'type':'class',
            'param':'katex--display',
        },
        {
            'type':'class',
            'param':'syntaxhighlighter',
        },
        {
            'type':'class',
            'param':'code_cell',
        },
        {
            // github markdown
            'type':'class',
            'param':'highlight',
        },
    ];
    function addNotranslate (selector, loop, interval) {
        $(selector).attr("class", function(i,origValue){
            return origValue + " notranslate";
        });
    }
    function run () {
        console.log($);
        for(let i = 0; i < behaviorList.length; i++) {
            //console.log(behaviorList[i]);
            let selector = '';
            switch (behaviorList[i].type){
                case 'class':
                    selector = "."+behaviorList[i].param;
                    break;
                case 'id':
                    selector = "#"+behaviorList[i].param;
                    break;
                case 'element':
                    selector = behaviorList[i].param;
                    break;
            }
            addNotranslate(selector, behaviorList[i].loop, behaviorList[i].interval);
        }
    }
    function main(){
        $(function(){
            $("body").keyup(function(event){
                if (event.ctrlKey && event.keyCode === 81){
                    if(confirm('Will add "notranslate" to some elements on his page. Continue?')){
                        run();
                        console.log('finish');
                    }
                }
            });
        });
    }
    main();
})();
