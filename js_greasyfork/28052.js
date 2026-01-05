// ==UserScript==
// @name         NGA Character Code Converter
// @namespace    https://greasyfork.org/zh-CN/scripts/28052-nga-character-code-converter
// @version      0.1.0.20180311
// @icon         http://bbs.nga.cn/favicon.ico
// @description  NGA 字符转码：发表、回复、编辑时，在提交前自动将部分原本直接提交无法正常显示的字符进行转码，使之提交后可以正常显示；编辑时将代码转回字符，方便编辑。
// @author       AgLandy
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @downloadURL https://update.greasyfork.org/scripts/28052/NGA%20Character%20Code%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/28052/NGA%20Character%20Code%20Converter.meta.js
// ==/UserScript==

(function(){

    function init($){

        let ccc = commonui.characterCodeConverter = {
            u2a: function(){
                let v = $('textarea')[0] ? $('textarea').last().val() : null;
                if(!v)
                    return;
                let r = /&#(\d+);/;
                while(r.test(v))
                    v = v.replace(r, String.fromCharCode(RegExp.$1));
                $('textarea').last().val(v);
            },
            md: function(e){
                let t = $(e.target).closest('div.single_ttip2, div#mc').find('textarea')[0],
                    v = t.value,
                    r;
                if(!v)
                    return;
                if(e.button == 2){
                    r = /&#(\d+);/;
                    while(r.test(v))
                        v = v.replace(r, String.fromCharCode(RegExp.$1));
                }
                else{
                    r = /([\u00a0-\u02ff\u2010-\u2013\u2015-\u2017\u2025\u2030-\u203e\u2105\u2109\u2116\u2121\u2160-\u217f\u2190-\u2199\u2200-\u22ff\u2312\u2460-\u249b\u2500-\u2642\u3000\u3003\u3005\u3007\u300c-\u300f\u3012-\u3015\u301d-\u3029\u30f4-\u30f6\u3100-\u312f\u3190-\u319f\u3220-\u3243\u3280-\u32b0\u338e-\u33d5\ufe30-\ufe6f\uff02-\uff0b\uff0d-\uff19\uff1c-\uff1e\uff20-\uff5d\uffe2-\uffe4])/;
                    while(r.test(v))
                        v = v.replace(r, '&#' + RegExp.$1.charCodeAt() + ';');
                }
                t.value = v;
            },
            r: function(){
                ccc.u2a();
                $('a.uitxt1:contains("Enter"), .single_ttip2 form:contains("不超过") button').attr('onmousedown','commonui.characterCodeConverter.md(event)');
            },
            mo: new MutationObserver(function(){
                ccc.r();
            })
        };

        ccc.r();

        ccc.mo.observe($('body')[0], {
            childList: true,
            subtree: true,
        });

    }

    (function check(){
        try{
            init(commonui.userScriptLoader.$);
        }
        catch(e){
            setTimeout(check, 50);
        }
    })();

})();




