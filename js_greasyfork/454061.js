// ==UserScript==
// @name        百度搜索结果真实链接
// @namespace   To2nUrlBaidu Scripts
// @author      Takitooru
// @match       https://www.baidu.com
// @match       https://www.baidu.com/s*
// @grant       none
// @version     2.1.5.1
// @license     MIT
// @description 获取百度搜索结果真实链接
// @downloadURL https://update.greasyfork.org/scripts/454061/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/454061/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
        'use strict';
    //正则表达式
        var reg = /(?<=data-landurl\=")(.*?)(?=")|(?<=mu\=")(.*?)(?=")/g;
        //元素类名合集
        var classNameList = ['.result.c-container.xpath-log.new-pmd', '.result-op.c-container.xpath-log.new-pmd', '.result-op.c-container.new-pmd', 'h3.t.ec_title', 'h3.c-title'];
        //显示链接的样式
        var styleList = ['color:red;background-color:yellow;display:inline-block;'];
        //显示链接的提示文字
        var diyText = ['真实链接'];
    //(link?url=**)常规编码链接   ※※※※※  (baidu.php?url=**)加密编码链接
        document.querySelector('#wrapper_wrapper').addEventListener("DOMNodeInserted",function(e) {
                if (e.target.id == 'container') {
                        setTimeout(function() {
                                let Arrlist = document.querySelectorAll('' + classNameList + '');
                                for (let i = Arrlist.length - 1; i >= 0; i--) {
                                        let Matches = [...Arrlist[i].outerHTML.matchAll(reg)];
                                        for (let Mat of Matches) {
                                                let ifMatNull = Mat[0] == '' ? '链接已被加密': '<a href="' + Mat[0] + '" target="_blank">' + Mat[0] + '</a>';
                                                Arrlist[i].insertAdjacentHTML('beforeend', '<div style="' + styleList + '">' + diyText + '：' + ifMatNull + '</div>');
                                        }
                                }
                        }, 1000);
                }
        });

})();