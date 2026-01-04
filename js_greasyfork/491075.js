// ==UserScript==
// @name         dataArea
// @namespace    https://github.com/dataArea
// @version      0.4
// @description  获取公司
// @author       ahei
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.2.1.min.js
// @match        https://fauxid.com/tools/fake-company*
// @icon         https://fauxid.com/favicon.ico
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491075/dataArea.user.js
// @updateURL https://update.greasyfork.org/scripts/491075/dataArea.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var companyStr = "";
    $(function () {


        var div = $("<div>"),
            button = $("<button>", {
                id: "btnData",
                text: "获取公司"
            }),
            downCompany = $("<a>", {
                id: "download",
                text: "下载"
            });
        div.append(button)
        div.append(downCompany)
        $(".content").prepend(div)

        button.on("click", function () {
            var bArrarEles = $("#company-table tbody >tr> td >b");
            for (var i = 0; i < bArrarEles.length; i++) {
                companyStr += bArrarEles[i].innerHTML + "\n";
            };
            if (companyStr.length > 0) {
                var blob = new Blob([companyStr], { type: 'text/plain;charset=utf-8' });
                var url = URL.createObjectURL(blob);
                downCompany.attr("href", url);
                downCompany.attr("download", new Date().getTime() + "company.txt")
                setTimeout(() => {
                    console.log(downCompany)
                    document.getElementById("download").click();
                    console.log("执行了点击")
                }, 1000)
            }

        });




    })

})();