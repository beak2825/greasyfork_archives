// ==UserScript==
// @name pigv5
// @namespace pigv5
// @description 小猪V5售后处理
// @include http://tg.pigv5.com/pages/salerefundreq/allexpress_refundrequestlist
// @version 1.0.1
// @author Keyneko
// @license MIT
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAwFBMVEUgIioeICj///8bHSWNjpL6+vr39/fJyszHx8peYGVGR04uMDcrLTXu7u/r6+vExMa8vb94eX5JSlE0NT0nKTDk5ea3t7q0tLetrrFmZ21TVVtNTlQ+QEYkJS3y8/Pn5+ji4uPb29zZ2drBwcOpqq18fYJvcHZpa3BRUlk2OD/w8PDc3d7T09W5ur2ys7Wmp6qioqagoaSWlpqAgYZzdXpZW2FXWF5DRUxBQ0o7PEMyNDvf3+DNzc+cnaGam56VlpmDq2B/AAABC0lEQVQoz4WRVW7EMBRFE4djh5mZhplK+99VE6mprXakOZ/36OkR9Qf0oP5Bj1Cnj4EmI4ah6WSILctXAyKHd9lE9+NacD+9grV/S5iuWmmNnwKg5EvNIEQvpqLAAwAKgeM9GTdJTKNWS8XxDl96ym0f2DCxuBC1DspHiV1kEha05IC8kW3Za2KBNxgsOgVUgStR5tlw1ICo6AuwjtgwYnWV31qEQKyat9dW4ACvtzG5u1wrb1oGxlVWokSKUOPBBFe+VyEprMPGd8bc729XSAp0Zt2MA8twOucUzOKiC/V+U+rzRGgWt8CEF2O3Rz8CEj9JBnOHb05CR+KJeiokN8I5iQ0T6injoK/5BqtKFQ3uttdGAAAAAElFTkSuQmCC
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/456555/pigv5.user.js
// @updateURL https://update.greasyfork.org/scripts/456555/pigv5.meta.js
// ==/UserScript==

/* global $ */

function delay(time = 100) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

function until(fun) {
    return new Promise((resolve, reject) => {
        let cnt = 0;
        const id = setInterval(function () {
            const $el = fun();
            if ($el.length != 0) {
                clearInterval(id);
                resolve($el);
            } else {
                cnt++;
                if (cnt === 9) {
                    reject();
                }
            }
        }, 500);
    });
}

// 添加功能按钮
$(`<div class="layui-col-md12" style="margin: 8px 15px;">
    <button type="button" class="layui-btn layui-btn-sm btn-pass">通过</button>
    <button type="button" class="layui-btn layui-btn-sm layui-btn-danger layui-btn-radius btn-reject">拒绝</button>
    <button type="button" class="layui-btn layui-btn-sm btn-auto-pass">自动通过</button>
    <button type="button" class="layui-btn layui-btn-sm layui-btn-danger layui-btn-radius btn-auto-reject">自动拒绝</button>
</div>
`).appendTo(".search-box-add");

const HANDLE_ROW_STR = "table.layui-table tr:eq(1)";
const HANDLE_BTN_STR = "a[title=处理申请]";
const PASS_BTN_STR = "button[lay-filter=form-pass]";
const REJECT_BTN_STR = "button[lay-filter=form-reject]";
const CLOSE_BTN_STR = ".layui-layer-iframe .layui-layer-close";
const IFRAME_STR = ".layui-layer-iframe iframe";
const FORM_REMARK_STR = ".layui-form #remark";
const FORM_SUBMIT_BTN_STR = ".layui-form a[lay-submit]";
const FORM_CLOSE_BTN_STR = ".layui-form .layui-layer-close";

// 通过
function passHandler() {
    return new Promise(async (resolve, reject) => {
        const $row = $(HANDLE_ROW_STR);
        const $handleBtn = $row.find(HANDLE_BTN_STR).click();
        await delay(100);

        console.log(
            "%c通过",
            "background:#219588;color:#fff",
            $row.find("td[data-field=orderNo]").data("content")
        );

        const ifm = $(IFRAME_STR);

        if (ifm.length == 0) {
            console.error("未获取到iframe");
            reject();
        } else {
            const $btn = await until(function () {
                return ifm.contents().find(PASS_BTN_STR);
            });

            await delay(500);
            $btn.click();

            // 填写备注
            ifm.contents().find(FORM_REMARK_STR).val("脚本自动通过");

            // 点击确定
            const $btnSubmit = ifm.contents().find(FORM_SUBMIT_BTN_STR);
            $btnSubmit.wrapInner("<span>").find("span").click();

            await delay(200);
            {
                const $btnSubmit = ifm.contents().find(FORM_SUBMIT_BTN_STR);
                if ($btnSubmit.length == 0) {
                    $(CLOSE_BTN_STR).click();
                    resolve();
                } else {
                    reject();
                }
            }
        }
    });
}

// 拒绝
function rejectHandler() {
    return new Promise(async (resolve, reject) => {
        const $row = $(HANDLE_ROW_STR);
        const $handleBtn = $row.find(HANDLE_BTN_STR).click();
        await delay(100);

        console.log(
            "%c拒绝",
            "background:#FA593A;color:#fff",
            $row.find("td[data-field=orderNo]").data("content")
        );

        const ifm = $(IFRAME_STR);

        if (ifm.length == 0) {
            console.error("未获取到iframe");
            reject();
        } else {
            const $btn = await until(function () {
                return ifm.contents().find(REJECT_BTN_STR);
            });

            await delay(500);
            $btn.click();

            // 填写备注
            ifm.contents().find(FORM_REMARK_STR).val("脚本自动拒绝");

            // 点击确定
            const $btnSubmit = ifm.contents().find(FORM_SUBMIT_BTN_STR);
            $btnSubmit.wrapInner("<span>").find("span").click();

            await delay(200);
            {
                const $btnSubmit = ifm.contents().find(FORM_SUBMIT_BTN_STR);
                if ($btnSubmit.length == 0) {
                    $(CLOSE_BTN_STR).click();
                    resolve();
                } else {
                    reject();
                }
            }
        }
    });
}

$(".btn-pass").click(passHandler);
$(".btn-reject").click(rejectHandler);

let AUTO_PASS_FLAG = false;
let AUTO_REJECT_FLAG = false;

// 自动通过
$(".btn-auto-pass").click(async function () {
    AUTO_PASS_FLAG = true;

    async function f() {
        if (AUTO_PASS_FLAG) {
            try {
                await until(() => $(HANDLE_ROW_STR));
                await passHandler();
                f();
            } catch (e) {
                console.log("%c脚本中断，已停止自动运行", "color:#FCB63E");
                AUTO_PASS_FLAG = false;
            }
        }
    }

    f();
});

// 自动拒绝
$(".btn-auto-reject").click(async function () {
    AUTO_REJECT_FLAG = true;

    async function f() {
        if (AUTO_REJECT_FLAG) {
            try {
                await until(() => $(HANDLE_ROW_STR));
                await rejectHandler();
                f();
            } catch (e) {
                console.log("%c脚本中断，已停止自动运行", "color:#FCB63E");
                AUTO_REJECT_FLAG = false;
            }
        }
    }

    f();
});
