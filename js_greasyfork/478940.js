// ==UserScript==
// @name         Auto zto
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  zto auto!
// @author       HS
// @match        https://e.zto.com/e-static/bill-tracing-web/default/prod/index.html*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @grant        none
// @connect zto.com
// @downloadURL https://update.greasyfork.org/scripts/478940/Auto%20zto.user.js
// @updateURL https://update.greasyfork.org/scripts/478940/Auto%20zto.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let form = `
        <div id="az_form" class="z_btn_group">
            <textarea id="az_form_input" rows=5></textarea>
            <input id="az_form_button" class="z_btn z_btn_yellow" type="button" value="开始查询" style="margin:10px 0;" />
            <table>
                <thead>
                    <tr>
                    <td>快递单号</td>
                    <td>收件人</td>
                    <td>电话</td>
                    <td>地址</td>
                    </tr>
                </thead>
                <tbody id="az_tbody">

                </tbody>
            </table>
        </div>
        
        <style>
            #az_form{
                z-index:99999999;
                position:fixed;
                top:50px;right:50px;
                width:460px;
                background: #ccc;
                opacity:0.9;
                padding: 20px;
                max-height:600px;
                overflow-y: scroll;
            }
            #az_form_input {width:100%}
        </style>
    `;

    async function clickInfoButton() {
        return new Promise((resolve, reject) => {
            let xh = setInterval(() => {
                let infoButton = document.querySelector(
                    'div[data-type="orderInfo"]'
                );
                if (infoButton && !$(infoButton).parent().hasClass("active")) {
                    clearInterval(xh);
                    infoButton.click();
                    resolve();
                }
            }, 1000);
        });
    }

    async function getInfoReceiver(no) {
        return new Promise((resolve, reject) => {
            let xh = setInterval(() => {
                let info = document.querySelector(".orderInfo .z_num");
                if (info.textContent.includes(no)) {
                    clearInterval(xh);
                    let receiveInfo = $("#receiveInfo");
                    let [name, phone] = receiveInfo.text().split(" ");
                    let addressElement = receiveInfo.next('.protection-temple');
                    let address = addressElement.text().replace('查看原始地址', '');
                    console.log(address);
                    console.log("name", name, phone);
                    $("#az_tbody").append(`
                        <tr>
                        <td>${no}</td>
                        <td>${name}</td>
                        <td>${phone}</td>
                        <td>${address}</td>
                        </tr>
                    `);
                    setTimeout(resolve, 2000);
                }
            }, 1000);
        });
    }

    $(document).ready(async function () {
        $("body").prepend(form);

        $("#az_form_button").click(async function (e) {
            e.preventDefault();

            let needList = $("#az_form_input").val(),
                needListArray = needList.split(/[\n]/).filter((item) => item);

            for(let no of needListArray) {
                console.log('开始单号:', no);
                $("#searchBillNo").val(no);
                $("#billQuery").click();

                await clickInfoButton();
                await getInfoReceiver(no);
            }
        });
    });
})();
