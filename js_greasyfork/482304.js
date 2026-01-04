// ==UserScript==
// @name         Auto epaas
// @namespace    http://tampermonkey.net/
// @version      2023-12-15
// @description  ePaas!
// @author       HS
// @match        https://www.erp321.com/app/order/order/list.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482304/Auto%20epaas.user.js
// @updateURL https://update.greasyfork.org/scripts/482304/Auto%20epaas.meta.js
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
                    <td>订单号</td>
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

    async function waitAndClick(no) {
        return new Promise((resolve, reject) => {
            let xh = setInterval(() => {
                let resultCell = document.querySelector("._jt_cell_so_id");
                if (resultCell && resultCell.textContent.includes(no)) {
                    clearInterval(xh);
                    document.querySelector(".h_btn_decrypt_all").click();
                    resolve();
                }
            }, 1000);
        });
    }

    function getInfoReceiver(no) {
        let address = document.querySelector(
                ".dbclick_receiver_address"
            ).textContent,
            name = document.querySelector(".dbclick_receiver_name").textContent,
            phone = document.querySelector(
                ".dbclick_receiver_mobile"
            ).textContent;

        $("#az_tbody").append(`
                    <tr>
                    <td>${no}</td>
                    <td>${name}</td>
                    <td>${phone}</td>
                    <td>${address}</td>
                    </tr>
                `);
    }

    window.addEventListener(
        "load",
        async function () {
            $("body").prepend(form);

            $("#az_form_button").click(async function (e) {
                e.preventDefault();

                let needList = $("#az_form_input").val(),
                    needListArray = needList
                        .split(/[\n]/)
                        .filter((item) => item);

                for (let no of needListArray) {
                    console.log("开始订单号:", no);
                    var input = document
                        .querySelector("#s_filter_frame")
                        .contentWindow.document.querySelector("#so_id");
                    input.value = no;
                    const event = new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        which: 13,
                        keyCode: 13,
                    });
                    input.dispatchEvent(event);

                    await waitAndClick(no);
                    await new Promise((resolve) =>
                        setTimeout(() => resolve(), 5000)
                    );
                    getInfoReceiver(no);
                }
            });
        },
        false
    );
})();
