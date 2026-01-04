// ==UserScript==
// @name         图书馆参考咨询联盟 文献传递助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  辅助获取图书资源
// @author       John Ren
// @match        https://www.liballiance.com/book.do
// @match        https://www.liballiance.com/booksubmit.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=liballiance.com
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/449890/%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8F%82%E8%80%83%E5%92%A8%E8%AF%A2%E8%81%94%E7%9B%9F%20%E6%96%87%E7%8C%AE%E4%BC%A0%E9%80%92%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/449890/%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8F%82%E8%80%83%E5%92%A8%E8%AF%A2%E8%81%94%E7%9B%9F%20%E6%96%87%E7%8C%AE%E4%BC%A0%E9%80%92%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* 设置 */

// 邮箱
const EMAIL = "";

// 是否需要辅助页
const REQUIRE_INDEX = true;


/* globals $,jQuery, waitForKeyElements */
(function() {
    'use strict';
    // localStorage.clear();
    if(location.pathname=='/book.do'){
        let pageInfo = jQuery("p.warning")[0];
        let maxPage = parseInt(
            pageInfo.innerText.split("页")[1].split("，")[0],
            10
        );
        let eachQuery = parseInt(
            pageInfo.innerText.split("咨询不超过")[1].split("页")[0],
            10
        );
        let bookName = jQuery("[name='fbf.bookname'")[0].value;
        let lastEndPage = localStorage.getItem(bookName) || false;
        let minusButton = jQuery.parseHTML(`<a id='MINUS_BTN' href='/' style='margin:auto 10px'>前${eachQuery}页<a/>`)[0];
        let plusButton = jQuery.parseHTML(`<a id='PLUS_BTN' href='/' style='margin:auto 0px'>后${eachQuery}页<a/>`)[0];
        const fromInput = jQuery("#frompage")[0];
        const endInput = jQuery("#endpage")[0];
        if (lastEndPage) {
            pageInfo.innerText+=`\n上次获取到${lastEndPage}页`;
            fromInput.value = Math.min(Math.max(1, parseInt(lastEndPage, 10)+1),maxPage);
            endInput.value = Math.min(parseInt(fromInput.value, 10) + eachQuery-1, maxPage);
        }
        let autoCheck = () => {
            if (fromInput.value === "1" && REQUIRE_INDEX) {
                jQuery("[name='fbf.mulutag']")[0].checked = true;
            } else {
                jQuery("[name='fbf.mulutag']")[0].checked = false;
            }
        };
        minusButton.onclick = (e) => {
            e.preventDefault();
            if (fromInput.value == "1") {
                return;
            }
            endInput.value = Math.min(parseInt(fromInput.value, 10) - 1, maxPage);
            fromInput.value = Math.max(1, parseInt(fromInput.value, 10) - eachQuery);
            autoCheck();
        };
        plusButton.onclick = (e) => {
            e.preventDefault();

            if (parseInt(endInput.value) === maxPage) {
                return;
            }
            endInput.value = Math.min(parseInt(fromInput.value, 10) + 2*eachQuery-1, maxPage);
            fromInput.value = Math.max(1, parseInt(fromInput.value, 10) + eachQuery);
            autoCheck();
        };
        fromInput.onchange = autoCheck;
        autoCheck();
        endInput.parentNode.append(minusButton, plusButton);
        jQuery("#email")[0].value = EMAIL;
        //jQuery(".zxform")[0].addEventListener("submit", () => {
        //localStorage.setItem(bookName, fromInput.value);
        //});
        //setTimeout(()=>{jQuery("#verifycode")[0].focus()},2);
        jQuery("#verifycode")[0].focus()
    }
    if(location.pathname=='/booksubmit.do'){
        function getUrlVars()
        {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = decodeURI(hash[1]);
            }
            return vars;
        }
        if (jQuery("#a01")[0].innerText==='√ 咨询提交成功！'){
            let result=getUrlVars();
            let bookName=result['fbf.bookname']
            let lastEnd=result['fbf.uppages'].split('-')[1]
            localStorage.setItem(bookName,lastEnd);
        }
    }

})();