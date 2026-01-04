// ==UserScript==
// @name         迎梅复制新款产品ID
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  复制迎梅ID
// @author       Ted
// @include      *//yingmeinvzhuang.tmall.com/category*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @run-at       document-end
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @downloadURL https://update.greasyfork.org/scripts/374564/%E8%BF%8E%E6%A2%85%E5%A4%8D%E5%88%B6%E6%96%B0%E6%AC%BE%E4%BA%A7%E5%93%81ID.user.js
// @updateURL https://update.greasyfork.org/scripts/374564/%E8%BF%8E%E6%A2%85%E5%A4%8D%E5%88%B6%E6%96%B0%E6%AC%BE%E4%BA%A7%E5%93%81ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    waitForKeyElements ("div.attrs div.attrExtra",crowd_main);
    function crowd_main(jNode){
        jNode.append('<span id= "_btn_copyID" class="fSort"  href="javascript:void(0)">【复制本页ID】</span>');
        $('#_btn_copyID').click(function (){
            var select = '.item   ';
            if($('.J_TItems').length != 0){
                select =  '.J_TItems ' + select;
            }
            var data = "商品ID\t",itemCount = 0;
            $(select).each(function(i,v){
                // 本店推荐的不要
                if($(v).find('.item-name').text().indexOf('                                ') == 0){
                    return;
                }
                data +="\r\n" + $(v).attr('data-id');
                itemCount++;
            });
            console.info(data);
            var i = confirm('共 '+itemCount+' 个商品记录提取完成，是否需要复制到剪贴板？');
            if(i){
                GM_setClipboard(data,'text');
            }

        });
    }
})();