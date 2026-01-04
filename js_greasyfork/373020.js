// ==UserScript==
// @name         贝壳产品经理专用脚本 - 图片平滑滚动
// @namespace    parallel
// @version      0.1
// @description  放肆写需求！
// @author       Parallel
// @match        http://wiki.lianjia.com/pages/viewpage.action?pageId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373020/%E8%B4%9D%E5%A3%B3%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC%20-%20%E5%9B%BE%E7%89%87%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/373020/%E8%B4%9D%E5%A3%B3%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC%20-%20%E5%9B%BE%E7%89%87%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tables = document.querySelectorAll("table.confluenceTable");

    var getImageIndex = function(table) {
        var ths = table.querySelectorAll('th.confluenceTh');
        var result = null;
        ths.forEach(function(th, index){
            if (/原型图/.test(th.innerText)) {
                result = index;
            }
        });

        return result;
    }

    function getOffsetTop(el){
        return el.offsetParent
            ? el.offsetTop + getOffsetTop(el.offsetParent)
        : el.offsetTop
    }

    if(tables.length > 0) {
        var tableWithImageIndexTable = [];

        tables.forEach(function(table) {
            var imageIndex = getImageIndex(table);
            if (!imageIndex) {
                return;
            }

            tableWithImageIndexTable.push({index: imageIndex, table: table});
        });

        if(tableWithImageIndexTable.length > 0) {
            var eleToHover;

            // 设置鼠标滚动事件，当发生滚动时，判断哪张图片需要悬浮，并进行设置
            window.onscroll = function() {
                // 定义需要悬浮的元素
                if(eleToHover) {
                    eleToHover.style.top = 0;
                    eleToHover.style.bottom = 0;
                }

                tableWithImageIndexTable.forEach(function(indexTable) {
                    if (window.scrollY > indexTable.table.offsetTop && window.scrollY < indexTable.table.offsetTop + indexTable.table.offsetHeight) {
                        console.log('表格xx进入候选区域')
                        var trs = indexTable.table.querySelectorAll('tr');
                        trs.forEach(function(tr) {
                            console.log('遍历 tr window.scorll');
                            if (window.scrollY > getOffsetTop(tr) && window.scrollY < getOffsetTop(tr) + tr.offsetHeight) {
                                // 固定第 index 列的图片
                                console.log('开始固定第' + indexTable.index + ' 列的内容');
                                var td = tr.querySelectorAll('td')[indexTable.index];
                                eleToHover = td.querySelector('span');
                                eleToHover.style.top = window.scrollY - getOffsetTop(tr) + 'px';
                                eleToHover.style.bottom = 0;
                            }
                            return
                        });
                        return
                    }

                    return
                });
            }
        }

    }
})();