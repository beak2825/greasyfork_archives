// ==UserScript==
// @name         cadmin搜索
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在cadmin搜索
// @author       You
// @match        https://cadmin.waimai.st.sankuai.com/*
// @match        https://cadmin.sankuai.com/*
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require https://update.greasyfork.org/scripts/476008/1255570/waitForKeyElements%20gist%20port.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488673/cadmin%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/488673/cadmin%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function search() {
       console.log("find#1");

        // 定义标签和对应的搜索内容
        var tags = [
            { text: 'searchAd', content: '.searchAd ' },
            { text: 'feedSearchAd', content: '.feedSearchAd ' },
            { text: 'sgFeedSearchAd', content: '.sgFeedSearchAd ' },
            { text: 'searchAdTemplate', content: '.searchAdTemplate ' },
            { text: 'searchSpuAdTemplate', content: '.searchSpuAdTemplate' },
            { text: 'getCreativeDataByPoiId', content: 'getCreativeDataByPoiId' },
            { text: 'dsa.闪购一阶段', content: '.getSgAdInfo ' },
            { text: 'dsa.闪购二阶段', content: '.getSgBidInfoSync ' },
            { text: '函谷', content: 'SearchServer$Iface.Search' },

//            { text: '热销菜接口', content: 'getSearchSkuInfo' },
            { text: 'skuInfo', content: 'skuInfo' },
//            { text: '多彩推荐理由', content: 'getBindPicsBySpuIds' },
            { text: '搜索poi推荐理由', content: 'getSearchAdPoiLabe' },
//            { text: '报价服务', content: 'TspProductPriceThriftService$Iface.getMultiPoiProduct ' },
        ];

        // 创建标签元素
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.right = '0';
        container.style.transform = 'translateY(-50%)';
        container.style.zIndex = '9999';

        var currentIndex = -1;
        var currentTarget = null;

        tags.forEach(function(tag) {
            var element = document.createElement('div');
            element.style.padding = '10px';
            element.style.border = '1px solid #ccc';
            element.style.cursor = 'pointer';
            element.textContent = tag.text;
            element.style.backgroundColor = 'yellow';

            // 点击标签时搜索内容
            element.addEventListener('click', (function(tag) {
                return function() {

                    /*
                    var elements = $('[aria-describedby="jqGrid_1_t_methodName"]');
                    for (var i = 0; i < elements.length; i++) {
                        var se = elements[i];
                        console.log(se.children.length);
                        if (se.textContent.indexOf(tag.content) !== -1) {
                            console.log("find"+tag.content);
                            se.scrollIntoView();
                            se.style.backgroundColor = 'red';
                            break;
                        }
                    }
                    */


//                    /*
                    var elements = $('[aria-describedby="jqGrid_1_t_methodName"]');
                    if (tag !== currentTarget) {
                        currentIndex = -1;
                        currentTarget = tag;
                    }
                    var index = currentIndex + 1;
                    var found = false;
                    while (!found && index < elements.length) {
                        var text = elements[index].textContent;
                        if (text.indexOf(tag.content) !== -1) {
                            found = true;
                        } else {
                            index++;
                        }
                    }
                    if (!found) {
                        index = 0;
                        while (!found && index < currentIndex) {
                            var text2 = elements[index].textContent;
                            if (text2.indexOf(tag.content) !== -1) {
                                found = true;
                            } else {
                                index++;
                            }
                        }
                    }
                    if (found) {
                        var interval = setInterval(function() {
                            if (index >= elements.length) {
                                clearInterval(interval);
                                currentIndex = elements.length - 1;
                                return;
                            }
                            var text3 = elements[index].textContent;
                            if (text3.indexOf(tag.content) === -1) {
                                clearInterval(interval);
                                currentIndex = index - 1;
                                return;
                            }
                            /*
                            var rect = elements[index].getBoundingClientRect();
                            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                                index++;
                                return;
                            }
                            */
                            elements[index].scrollIntoView();
                            elements[index].style.backgroundColor = '#f39c12';
                            currentIndex = index;
                            index++;
                        }, 500);
                    }

 //                  */
                };
            })(tag));

            container.appendChild(element);
        });

        // 添加标签元素到页面中
        document.body.appendChild(container);
    }

    function addCopy() {

        var firstStrong = $('strong:contains("URLPARAM")');
         // 查找第一个<pre>标签，并打印其内容
        var firstPre = firstStrong.nextAll('pre').filter(':first');
        var paramStr =firstPre.text();
        paramStr = paramStr.substr(1, paramStr.length-2);
//        console.log(paramStr);
        try{
            var param = JSON.parse(paramStr);
            var paramVal = JSON.stringify(param.value);


            var paramCopyBtn = document.createElement('button');
            paramCopyBtn.style.padding = '15px';
            //        paramCopyBtn.setAttribute('id', 'copy');
            paramCopyBtn.style.cursor = 'pointer';
            paramCopyBtn.innerHTML= '复制';

            firstStrong.append(paramCopyBtn);

            paramCopyBtn.addEventListener('click',(function(){
                // 创建一个 textarea 元素
                const textarea = document.createElement('textarea');
                textarea.value = paramVal;
                document.body.appendChild(textarea); // 将 textarea 元素添加到文档中
                textarea.select(); // 选中 textarea 元素中的文本
                document.execCommand('copy'); // 将选中的文本复制到剪贴板中
                document.body.removeChild(textarea); // 将 textarea 元素从文档中移除
            }));
        }catch(e){
        }
    }

    function newOp(){
        search();

        waitForKeyElements('strong:contains("URLPARAM")', addCopy);
    }

    waitForKeyElements('#1', newOp);

})();