// ==UserScript==
// @name         check script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于检测网页是否包含某些脚本
// @author       You
// @match        https://www.tampermonkey.net/scripts.php?ext=dhdg&show=dhdg
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant unsafeWindow
// @license 用于检测网页是否包含某些脚本
// @downloadURL https://update.greasyfork.org/scripts/456094/check%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/456094/check%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tips = '%E6%A3%80%E6%9F%A5%E5%88%B0num%E4%B8%AA%E5%B9%BF%E5%91%8A';
    let sLen = 0;
    let hostArray = ['cdn.bootcss.com'];
    var patt1=new RegExp("jque.*?.js");
    var patt2=new RegExp("base.*?.js");
    let $script = $('script');
    let len = $script.length;
    for(let i=0;i<len;i++){
        let srcAttr = $($script[i]).attr('src');
        if(srcAttr){
            let srcAttrArray = srcAttr.split('//');
            if(srcAttrArray.length>1){
                let srcHostFile = srcAttrArray[1];
                let indexOf = srcHostFile.indexOf('/');
                if(indexOf>-1){
                    let host = srcHostFile.slice(0,indexOf);
                    let filePath = srcHostFile.slice(indexOf,srcHostFile.length);
                    let filePathArray = filePath.split('/');
                    let file = filePathArray[filePathArray.length-1];
                    if(hostArray.indexOf(host)>-1){
                        if(patt1.test(file)){
                            sLen++;
                        }
                        if(patt2.test(file)){
                             sLen++;
                        }
                    }
                }
            }
        }
       
    }

    alert(decodeURIComponent(tips).replace('num',sLen));
    
})();