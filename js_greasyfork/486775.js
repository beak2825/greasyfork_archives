// ==UserScript==
// @name         毓秀堂下載圖片
// @namespace    http://tampermonkey.net/
// @version      2024-01-25
// @description  毓秀堂下載圖片功能
// @author       Ethan Li
// @match        http://www.i-chew.com.tw/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=i-chew.com.tw
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/486775/%E6%AF%93%E7%A7%80%E5%A0%82%E4%B8%8B%E8%BC%89%E5%9C%96%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/486775/%E6%AF%93%E7%A7%80%E5%A0%82%E4%B8%8B%E8%BC%89%E5%9C%96%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setTimeout(()=>{

        $('.breadcrumb').last().after(`<button id="download">下載</button>`);
        $('#download').click(function(){

            $('.picture-thumbs img').each((index,ele)=>{
                var element = $(ele);
                var src = element.attr('src');

                var srcSeg = src.split('/');
                var lastSeg = srcSeg[srcSeg.length-1];
                var lastSegs = lastSeg.split('_');
                var lastSegsLastPart = lastSegs[lastSegs.length-1];
                var fileExtension = lastSegsLastPart.split('.')[1];
                //console.log(src);
                //console.log(srcSeg);
                //console.log(lastSeg);
                //console.log(lastSegs);
                //console.log(lastSegsLastPart);
                //console.log(fileExtension);
                var target = src.replace(`_${lastSegsLastPart}`,`.${fileExtension}`);
                //console.log(target);

                var targetSeg = target.split('/');
                var arg = { url: target,
                           name: targetSeg[targetSeg.length-1]
                          };
                //console.log(arg);

                GM_download(arg);

            });
        });


    },5000);
    // Your code here...
})();