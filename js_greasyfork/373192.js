// ==UserScript==
// @name         bwg服务器列表清理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bw products filter
// @match        https://bwh1.net/clientarea.php?action=products
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373192/bwg%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%88%97%E8%A1%A8%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/373192/bwg%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%88%97%E8%A1%A8%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Your code here...
    let per_page = document.querySelector("select[name='itemlimit']").value;
    if (per_page !== 'all') {
        alert("请先手工设置perPage为 Unlimited");
        return;
    }

    let products_table = document.querySelector("div.resultsbox").nextElementSibling,
        products_trs = products_table.querySelectorAll("tbody > tr"),
        new_trs = [],

        total_records = products_trs.length, // 总数
        filter_records = 0, // 过滤数量
        show_recordes = 0; // 显示数量

    if (localStorage.getItem("isFilter") === "Y") {
        [].forEach.call(products_trs, ele => {
            let ele_item_status_td = ele.cells[1];
            if (ele_item_status_td.innerText.toLowerCase() === 'active') {
                new_trs.push(ele);
                ++show_recordes;
            } else {
                ++filter_records;
            }
        });

        let new_tbody = document.createElement("tbody");
        new_trs.forEach(ele => {
            new_tbody.appendChild(ele);
        })
        products_trs[0].parentElement.replaceWith(new_tbody);
    }

    document.querySelector("div.resultsbox > p").innerHTML = "共 " + total_records + "条记录, 隐藏 " + filter_records + "条， 显示"
    + show_recordes + "条 <button id='cancelFilter'>取消过滤</button> <button id='doFilter'>过滤</button>";


    document.getElementById("cancelFilter").addEventListener("click", function() {
        localStorage.setItem("isFilter", "N");
        window.location.reload();
    });

    document.getElementById("doFilter").addEventListener("click", function() {
        localStorage.setItem("isFilter", "Y");
        window.location.reload();

    })

})();