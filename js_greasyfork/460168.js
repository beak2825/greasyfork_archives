// ==UserScript==
// @name         提取科学文库目录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提取科学文库目录!
// @author       hohoyu
// @match        https://book.sciencereading.cn/shop/book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sciencereading.cn
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/460168/%E6%8F%90%E5%8F%96%E7%A7%91%E5%AD%A6%E6%96%87%E5%BA%93%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/460168/%E6%8F%90%E5%8F%96%E7%A7%91%E5%AD%A6%E6%96%87%E5%BA%93%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    let btn = document.createElement("BUTTON");
    btn.className = "btn_content";
    btn.textContent = "提取目录";
    btn.style.backgroundColor = "#DC143C";
    btn.onclick = getConts;
    let parNode = document.getElementById("offlineTr");
    parNode.append(btn);

    function getConts()
    {
        //展开目录
        var sws = $('span[class*=close]').filter('[id*=switch]');
        while (sws.length > 0)
        {
            for (let i = 0; i < sws.length; i++)
            {
                sws[i].click();
            }
            sws = $('span[class*=close]').filter('[id*=switch]');
        }
        //传出目录
        var conts = $('span[id^=treeDemo]').filter('[id$=span]');
        var strcont = '';
        for (let i = 0; i< conts.length; i++)
        {
            var level = conts[i].parentElement.classList.value.replace('level', '');
            var title = conts[i].textContent.replaceAll(',', '，');
            var page = /.*=(\d+)/.exec(conts[i].parentElement.href)[1];
            strcont = strcont + level + ',' + title + ',' + page + '\n';
        }
        //下载为文件
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(strcont));
        var booktitle = $('.book_detail_title').children()[0].children[0].textContent
        element.setAttribute('download', booktitle + ".txt");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
    }
})();