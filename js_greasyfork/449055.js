// ==UserScript==
// @name         学业分计算
// @namespace    Error
// @version      1.0.0
// @description  用于计算厂技师的学业基础分
// @author       ErrorRua
// @match        */jwglxt/cjcx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gpnu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449055/%E5%AD%A6%E4%B8%9A%E5%88%86%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/449055/%E5%AD%A6%E4%B8%9A%E5%88%86%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

function createBtn() {
    $("#search_go").before(
        $(`<button type="button" class="btn btn-primary btn-sm" id="cal_btn">计算学业分</button>`)
    );

    $("#cal_btn").on("click", function () {
        getScore();
    });
}

function createModal() {
    $("body").append(
        $(`
        <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="myModal">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <br/>
                    <h3 id="gpa"></h3>
                    <br/>
                    <table class="table table-bordered" id="myTable"></table>
                </div>
            </div>
        </div>`)
    );
}

function getScore() {
    let xnm = $("#xnm").val();
    $.ajax({
        method: "post",
        data: `xnm=${xnm}&xqm=&_search=false&nd=${new Date().getTime()}&queryModel.showCount=100&queryModel.currentPage=1&queryModel.sortName=&queryModel.sortOrder=asc&time=1`,
        url: `https://${window.location.host}/jwglxt/cjcx/cjcx_cxXsgrcj.html?doType=query&gnmkdm=N305005&su=2020034743032`,
        success: function ({ items }) {
            console.log(items);
            let xfSum = 0;
            let cjSum = 0;
            let fjSum = 0;
            let rows = [];
            for (let i = 0; i < items.length; i++) {
                xfSum += items[i].xf * 1;
                cjSum += items[i].cj * 1 * items[i].xf * 1;
                if (items[i].cj * 1 >= 90) {
                    rows.push(`<tr><td>${items[i].kcmc} ${items[i].cj}分</td><td>1</td></tr>`);
                    fjSum += 1;
                } else if (items[i].cj * 1 >= 85) {
                    rows.push(`<tr><td>${items[i].kcmc} ${items[i].cj}分</td><td>0.5</td></tr>`);
                    fjSum += 0.5;
                }
            }
            rows.push(`<tr><td>总计：</td><td>${fjSum}</td></tr>`);
            let gpa = keepTwoDecimal((cjSum * 0.8) / xfSum);
            $("#myTable").empty().append(rows.join(""));
            $("#gpa").empty().append(`学业基础分：${gpa}`);
            $("#myModal").modal("show");
        },
    });
}

function keepTwoDecimal(num) {
    var result = parseFloat(num);
    if (isNaN(result)) {
        alert("传递参数错误，请检查！");
        return false;
    }
    result = Math.round(num * 1000) / 1000;
    return result;
}

(function () {
    "use strict";
    // Your code here...
    console.log($);
    createBtn();
    createModal();
    console.log($("#xnm").val());
    console.log(window.location.href);
    console.log(window.location.href);
})();
