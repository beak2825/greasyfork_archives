// ==UserScript==
// @name         优书网发现页面删除过多内容
// @namespace    http://www.lkong.net/home.php?mod=space&uid=516696
// @version      0.1
// @description  因为优书网发现页是无限往下加载的模式，刷着刷着很容易就会导致缓存过多，所以就有了这么一个清理页面的脚本……已跳过的内容会被删除。多于30条内容就会删除，在完成删除前请勿向下滚动页面，否则会多刷多删。
// @author       仙圣
// @match        *://www.yousuu.com/explore
// @include      *://www.yousuu.com/explore
// @icon         http://www.yousuu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/411949/%E4%BC%98%E4%B9%A6%E7%BD%91%E5%8F%91%E7%8E%B0%E9%A1%B5%E9%9D%A2%E5%88%A0%E9%99%A4%E8%BF%87%E5%A4%9A%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/411949/%E4%BC%98%E4%B9%A6%E7%BD%91%E5%8F%91%E7%8E%B0%E9%A1%B5%E9%9D%A2%E5%88%A0%E9%99%A4%E8%BF%87%E5%A4%9A%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
setInterval(function(){
                    //重要：检查卡片数量并进行部分删除
                    var cards = document.getElementsByClassName("BookCommentItem");
                    //限制卡片数量
                    var limits = 30;
                    //计算应该删除多少个卡片
                    var needToDel = cards.length - limits;
                    console.log("卡片数量：" + cards.length + " 需要删除：" + needToDel);
                    if (needToDel > 0) {
                        console.log("触发");
                        for (var del = 0; del < needToDel; del++) {
                        console.log(del);
                        try {
                            cards[0].parentNode.removeChild(cards[0]);
                        } catch (err) { console.log("出现非致命性错误"); continue; }
                    }
                        scrollBy(0,-3500);//向上滚动防止无限刷出新的内容同时无限删除旧的内容
                }
},1000);
