// ==UserScript==
// @name  饭否-手机版还原被Google处理格式的外部链接
// @author HackMyBrain
// @version 1.1
// @description m.fanfou.com 上对消息中被Google处理格式的外部链接进行还原，直接打开原网页
// @include http://m.fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2529/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E8%BF%98%E5%8E%9F%E8%A2%ABGoogle%E5%A4%84%E7%90%86%E6%A0%BC%E5%BC%8F%E7%9A%84%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/2529/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E8%BF%98%E5%8E%9F%E8%A2%ABGoogle%E5%A4%84%E7%90%86%E6%A0%BC%E5%BC%8F%E7%9A%84%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function (){
    function replaceLinks() {
        var link, links = document.evaluate(".//a[@title!=@href][@rel='nofollow']", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < links.snapshotLength; i++) {
            link = links.snapshotItem(i);
            link.href = link.title;
            if ( /^http\:\/\/[\w+\.]?fanfou\.com\/.*/.test(link.title) ) {
                link.target = "";
            }
        }
    }

    var pagi = document.querySelector('[accesskey="6"]');
    if (pagi) {
        // 另一个用户脚本 Fanfou-Mobile-Autopager 对手机版实现自动翻页, 并会更新'下页'的链接. 利用这点实现对手机版自动翻页后的链接替换
        if ( !! window.MutationObserver ) { // for FF、Cr
            var observer = new MutationObserver(function(mutations){
                mutations.forEach(function(){
                    replaceLinks();
                });
            });
            var observer_config = {
                attributes : true,
                attributeFilter : ['href']
            };
            observer.observe(pagi, observer_config);
        }
        else { // for Presto
            pagi.addEventListener('DOMAttrModified', function(e){
                if ( 'attrChange' in event && event.attrName == 'href' ) {         
                    replaceLinks();
                }
            }, false);
        }
    }
    
    replaceLinks();
})()