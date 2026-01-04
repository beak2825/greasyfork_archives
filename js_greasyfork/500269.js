// ==UserScript==
// @name         tab tools
// @name:zh-CN   标签页小工具
// @namespace    http://tampermonkey.net/
// @version      2024Oct14-737pm
// @description  some tools
// @description:zh-cn    会用到的
// @author       onionycs
// @run-at       document-start
// @match *://*/*
// @grant        GM_registerMenuCommand
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500269/tab%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/500269/tab%20tools.meta.js
// ==/UserScript==


(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === ']'||event.key === '】') {
            //50屏
            var ddd;
            ddd=findOnce();
            while(ddd.length>0){
                ddd=findOnce();
                $(ddd[0]).find('.catalogue__item-collapse:not(.collapsed)').first().click();
                console.error('ddd.length= '+ddd.length+' 折叠了 '+$(ddd[0]).find('.text').text());
            }
        }
    });



    /* globals jQuery, $, waitForKeyElements */
    GM_registerMenuCommand("折叠目录并伪装", adjustSVISVI);
    GM_registerMenuCommand("鸭鸭切换为java", adjustSSPNOTE);
    GM_registerMenuCommand("camouflage cooper", faker);
    GM_registerMenuCommand("移除标签页所有标题", removeName);


    function removeName() {
        var head = document.getElementsByTagName('head')[0];

        // 获取所有<title>标签
        var titles = head.getElementsByTagName('title');

        // 遍历<title>标签并删除
        for (var i = 0; i < titles.length; i++) {
            head.removeChild(titles[i]);
        }
    }

    function adjustSSPNOTE() {
        var $ = unsafeWindow.jQuery;
        console.log("start");
        $('div[role="combobox"]')[0].click();
        var id=$('div[role="combobox"]')[0].id+'-option-2';
        setTimeout(function() {
            // 这里写你希望延迟执行的代码
            console.log('执行了延迟300ms的代码');
            $('#'+id)[0].click();
        }, 300);
        document.getElementsByClassName("left-content")[0].style.width = "40%";
        document.getElementsByClassName("right-content")[0].style.width = "60%";
        console.log("end");
    }

    function findOnce(){
        let aaa = $('.collapsible').filter(function() {
            return !$(this).find('.collapsed').length;
        }).toArray();
        let bbb=[];
        let cont=0;
        for(let i=0;i<aaa.length;i++){
            if(cont<=1 ){
                if($(aaa[i]).data('source-level')=='1'){
                    cont++;
                    if(cont==2){
                        break;
                    }
                }
                bbb.push(aaa[i]);
            }
        }
        bbb.sort(function(a, b) {
            // 使用.data()方法获取每个元素的data-source-level值
            // 注意：.data()返回的是数字类型，所以我们可以直接进行比较
            var levelA = $(a).data('source-level');
            var levelB = $(b).data('source-level');

            // 如果levelA小于levelB，则返回正数，使levelB排在前面
            // 如果levelA大于levelB，则返回负数，使levelA排在前面
            // 如果它们相等，则返回0
            return levelB - levelA; // 从大到小排序
        });
        return bbb;
    }

    function adjustSVISVI(){
        faker();
        if (confirm('确认要折叠目录吗？')) {
            //50屏
            var ccc;
            ccc=findOnce();
            while(ccc.length>0){
                ccc=findOnce();
                $(ccc[0]).find('.catalogue__item-collapse:not(.collapsed)').first().click();
                console.error('ccc.length= '+ccc.length+' 折叠了 '+$(ccc[0]).find('.text').text());
            }
        }
    }

    function faker() {
        // 假设新的favicon图标URL是'new-favicon.ico'
        var newFaviconUrl = 'https://img-ys011.didistatic.com/static/cooper_cn/ico-dbook.png';
        //var newFaviconUrl = 'file:///users/didi/downloads/wiki.ico';


        // 创建一个新的<link>元素
        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = newFaviconUrl;

        // 查找旧的favicon链接（如果有的话），并移除它
        // 注意：这里我们假设只有一个favicon链接，或者我们只关心第一个
        // 查找并删除所有rel="shortcut icon"的link元素
        var links = document.querySelectorAll('link[rel="shortcut icon"]');
        links.forEach(function(link) {
            link.remove();
        });
        // 查找并删除所有rel="shortcut icon"的link元素
        links= document.querySelectorAll('link[rel="icon"]');
        links.forEach(function(link) {
            link.remove();
        });

        // 将新的<link>元素添加到<head>部分
        var head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(link);

        // 注意：在有些情况下，浏览器可能不会立即显示新的favicon
        // 这取决于浏览器的缓存策略和实现细节

        removeName();
        var myhead = document.head || document.getElementsByTagName('head')[0];
        var title = document.createElement('title');
        title.textContent='知识库 - Cooper';
        myhead.appendChild(title);
    }

    function replaceTextInNode(node, regex, replacement) {
            if (node.nodeType === 3) { // Node.TEXT_NODE
                node.textContent = node.textContent.replace(regex, replacement);
            } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
                Array.from(node.childNodes).forEach(child => {
                    replaceTextInNode(child, regex, replacement);
                });
            }
        }

})();