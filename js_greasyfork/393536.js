// ==UserScript==
// @name         知乎关键词链接采集
// @namespace    zhihu
// @version      0.20
// @description  搜索关键词，然后统计所有结果的url
// @author       cyf0611
// @match        *://www.zhihu.com/search*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/393536/%E7%9F%A5%E4%B9%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E9%93%BE%E6%8E%A5%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/393536/%E7%9F%A5%E4%B9%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E9%93%BE%E6%8E%A5%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchArr = [];

    //添加入库接口
    setTimeout(function(){
        $(".Sticky").eq(2).append('<div class="Popover"><input type="text" class="sendUrl"></div>');
        let searchVal = $(".SearchBar-input input").val();
        if(searchVal==="undefined") return;
        let serchValIndex = searchArr.indexOf(searchVal)+1;
        if(serchValIndex===0) {
            location.href = location.href.split("?")[0]+"?q="+searchArr[serchValIndex];
        }
        if(serchValIndex>searchArr.length) return;
        //$(".SearchBar-input input").val(searchArr[serchValIndex])
        //$(".SearchBar-searchButton").click();

        scrollToBottom(searchArr[serchValIndex]);

    }, 1000);


    var scrollHeight = 0;
    //滚动到底部
    function scrollToBottom(searchVal) {
        var scrollTimer = setInterval(
            function(){
                scrollHeight += 1000;
                $(document).scrollTop(scrollHeight);
                if(scrollHeight>$(document).height()) {
                    clearInterval(scrollTimer);
                    var sendUrl = $(".sendUrl").eq(0).val().trim() || 'http://127.0.0.1:3000/saveUrl';
                    var resultArr = Array.prototype.slice.call(document.querySelectorAll("a[data-za-detail-view-id]")).filter((v, i) => {return v.href.includes("https://www.zhihu.com/question")}).map((v)=>v.href);
                    console.log(resultArr);
                    if(sendUrl) {
                        $.post(sendUrl, {data:resultArr}, function(data){
                            if(data.code===200) {
                                location.href = location.href.split("?")[0]+"?q="+searchVal;
                            }
                        } );

                    }else {
                        alert("没有输入接口，数据传输失败！！！");
                    }
                }

            }
            ,500)
    }




})();
