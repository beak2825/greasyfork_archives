// ==UserScript==
// @name         Git-Lib-Tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gitlib 管理的时候自动展开下拉!
// @author       You
// @license MIT
// @match        http://191.168.1.27:8080/xsp/*/settings/repository
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.27
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502148/Git-Lib-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/502148/Git-Lib-Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        let timer = setInterval(function(){
            console.log("循环...");
            let div = document.getElementById('js-protected-branches-settings');
            if(div != null){
                // 没有找到 自定义的按钮就重新添加一下
                fun_1();
                fun_0();
            }
        },1000);
    }
    function fun_0() {
        // 点击展开 merge_access_levels_attributes
        let div1 = document.getElementById('js-protected-branches-settings');
        let hd = div1.getElementsByClassName('settings-header')[0];
        let btn = hd.getElementsByTagName('button')[0];
        let btnStr = btn.textContent;
        if(btnStr == '展开' || btnStr.includes('Expand')){
            btn.click();
            let ul1s = div1.getElementsByClassName('merge_access_levels-container')[0].getElementsByClassName('dropdown-content')[0].getElementsByTagName('ul')[0];
            let ls1s = ul1s.childNodes;
            xpath('/html/body/div[2]/div[2]/div[3]/div/section[3]/div[2]/form/div/div[2]/div[2]/div/div/div/button')[0].click();
            xpath('/html/body/div[2]/div[2]/div[3]/div/section[3]/div[2]/form/div/div[2]/div[2]/div/div/div/div/div[1]/ul/li[2]/a')[0].click();
            xpath('/html/body/div[2]/div[2]/div[3]/div/section[3]/div[2]/form/div/div[2]/div[3]/div/div/div/button')[0].click();
            xpath('/html/body/div[2]/div[2]/div[3]/div/section[3]/div[2]/form/div/div[2]/div[3]/div/div/div/div/div[1]/ul/li[2]/a')[0].click();
            xpath('/html/body/div[2]/div[2]/div[3]/div/section[3]/div[2]/form/div/div[2]/div[1]/div/div[1]/button')[0].click();
        }
    }

    function fun_1() {
        // 点击展开 merge_access_levels_attributes
        let div1 = document.getElementById('js-protected-branches-settings');
        let hd = div1.getElementsByClassName('settings-header')[0];
        let btn = hd.getElementsByTagName('button')[0];
        let btnStr = btn.textContent;
        let bb = xpath('/html/body/div[2]/div[2]/div[3]/div/section[3]/div[2]/form/div/div[2]/div[1]/div/div[1]/button/span')
        if(bb.length > 0){
            let branch = bb[0];
            // 父节点是false,并且是
            if(branch.parentNode.parentNode.getAttribute('class')== 'dropdown ' &&branch.textContent == 'Select branch or create wildcard' && btnStr == '收起'){
                btn.click();
            }
        }
    }
    function xpath(xpathToExecute) {
        var result = [];
        var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
            result.push(nodesSnapshot.snapshotItem(i));
        }
        return result;
    }
})();







