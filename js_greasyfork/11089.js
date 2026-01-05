// ==UserScript==
// @name         58 自定义公司黑名单
// @namespace    org.jixun.58-blacklist
// @version      0.2
// @description  根据屏蔽列表屏蔽掉指定公司的招聘讯息。
// @author       Jixun
// @match        http://hf.58.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/11089/58%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%AC%E5%8F%B8%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/11089/58%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%AC%E5%8F%B8%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

// 配置项目
var 屏蔽列表 = ['某公司1', '某公司2', '某公司3'];

// 勿更改
addEventListener('DOMContentLoaded', doRemoveCompany, false);

function doRemoveCompany () {
    var blacklist = 屏蔽列表.map(function(entry){
        return entry.trim();
    });
    
    var companies = document.evaluate('//*[@id="infolist"]/dl/dd[2]/a', document.body, null, 0/*XPathResult.ANY_TYPE*/, null);
    var arrNode = [];

    // 枚举公司的屏蔽过程
    var c, x = 0;

    while (c = companies.iterateNext()) {
        if (matchBlackList(c.textContent.trim())) {
            arrNode.push(c.parentElement.parentElement);
            x ++;
        }
    }
    
    arrNode.forEach(rmNode);

    var tipNodeRemoved = document.createElement('li');
    tipNodeRemoved.textContent = '成功移除 ' + x + ' 条招聘数据。';
    lastItem(document.getElementsByClassName('selWel')).appendChild(tipNodeRemoved);

    // 移除节点
    function rmNode (n) {
        n.parentNode.removeChild(n);
    }

    // 取得数组末尾一项
    function lastItem (arr) {
        if (arr && arr.length)
            return arr[arr.length - 1];
    }
    
    // 非严格匹配黑名单
    function matchBlackList (name) {
        
        // 枚举所有黑名单查询匹配
        for (var i = blacklist.length; i--; )
            if (name.indexOf(blacklist[i]) != -1)
                return true;
        
        // 黑名单没找到
        return false;
    }
}
