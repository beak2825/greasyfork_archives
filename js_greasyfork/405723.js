// ==UserScript==
// @name         万方数据 根据论文信息整理出引用字符串
// @namespace    http://elib.ecnudec.com/
// @version      0.14
// @description  万方数据 根据论文信息整理出引用字符串（暂时只有期刊），未解决页数的读取，需要自行去论文利查找填写。
// @author       Shining77
// @match        *://elib.ecnudec.com/*
// @include      *://elib.ecnudec.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405723/%E4%B8%87%E6%96%B9%E6%95%B0%E6%8D%AE%20%E6%A0%B9%E6%8D%AE%E8%AE%BA%E6%96%87%E4%BF%A1%E6%81%AF%E6%95%B4%E7%90%86%E5%87%BA%E5%BC%95%E7%94%A8%E5%AD%97%E7%AC%A6%E4%B8%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/405723/%E4%B8%87%E6%96%B9%E6%95%B0%E6%8D%AE%20%E6%A0%B9%E6%8D%AE%E8%AE%BA%E6%96%87%E4%BF%A1%E6%81%AF%E6%95%B4%E7%90%86%E5%87%BA%E5%BC%95%E7%94%A8%E5%AD%97%E7%AC%A6%E4%B8%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 许光建, 魏义方, 戴李元,等. 中国城市住房价格变动影响因素分析[J]. 经济理论与经济管理, 2010(8)：5-14.
    // 作者.题(篇)名[J].刊名.出版年（卷号)：起止页.,

    if (document.querySelector('#detail_leftcontent') !== null) {
        let authors = '';
        let title = '';
        let type = '';
        let journal = '';
        let year = '';
        let number = '';
        let startPage = 0;
        let endPage = 0;

        let authorsList = [];
        document.querySelectorAll('.author_td a').forEach(author => authorsList.push(author.innerText));
        if (authorsList.length > 3) {
            authors = `${authorsList.slice(0,3).join(', ')}等`;
        } else {
            authors = `${authorsList.slice(0,3).join(', ')}`;
        }
        title = document.getElementById('title0').innerText;
        type = 'J';

        document.querySelectorAll('tr').forEach(tr => {
            let label = tr.querySelector('th t') && tr.querySelector('th t').innerText.replace(/ |：|:/g, '');
            if (label === '刊名') {
                journal = tr.querySelector('td a').innerText.trim();
            }
            if (label === '年，卷(期)') {
                let yearAndNumber = tr.querySelector('td a').innerText.replace(/ | |：|:/g, '').split(',');
                year = yearAndNumber[0].trim();
                number = yearAndNumber[1].trim();
            }
        });

        let qouteString = `${authors}.${title}[${type}].${journal}.${year}${number}：${startPage}-${endPage}.`;
        let qouteNode = document.createElement('div');
        qouteNode.innerText = qouteString;
        qouteNode.setAttribute("style", "margin: 20px 0;background-color: yellow");

        let targetElement = document.querySelectorAll('.abstract_dl')[0];
        targetElement.parentNode.insertBefore(qouteNode, targetElement);
    }

})();