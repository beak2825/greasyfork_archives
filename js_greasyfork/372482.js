// ==UserScript==
// @name         idle
// @version      1.1
// @namespace    HolyNight
// @description  挂机无止境AH等级过滤,和初始金币
// @author       shengguangchanhui@foxmail.com
// @run-at       document-start
// @match        https://www.idleinfinity.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js
// @downloadURL https://update.greasyfork.org/scripts/372482/idle.user.js
// @updateURL https://update.greasyfork.org/scripts/372482/idle.meta.js
// ==/UserScript==

function ahInit(){
    // 改变竞标框默认金币
    $("[name='gold'][id='gold'][type='number']").attr('value', 2000000);

    // 监听过滤条件输入框的改变
    $(".panel-filter").on("input propertychange", function () {
        $(".equip-container .selected").removeClass("selected")

        // 输入的值
        var value = $(this).val();
        // 保存到缓存,方便下次使用
        window.localStorage.setItem($(this).attr("id"), value);
        if (value.length > 0) {
            var values = value.split(",");
            var equips = $(this).parent().prev().find(".equip-content");

            // 正则判断是否是数字
            const min = /^<[0-9]+.?[0-9]*$/;
            const max = /^>[0-9]+.?[0-9]*$/;

            // 提取装备等级的正则表达式
            const level = /\([0-9]*\)/;

            // 去的当页数据
            equips.each(function (i, e) {
                var match = 0;
                $.each(values, function (j, p) {
                    let text = $(e).text();
                    if (min.test(p)) {
                        // 纯数字,作为掉落等级来判断
                        let exec = String(level.exec(text));
                        exec = exec.substring(1, exec.length - 1);
                        p = p.substring(1, p.length);
                        if (parseInt(exec) <= parseInt(p)) match++;
                    } else if (max.test(p)) {
                        let exec = String(level.exec(text));
                        exec = exec.substring(1, exec.length - 1);
                        p = p.substring(1, p.length);
                        if (parseInt(exec) >= parseInt(p)) match++;
                    } else if (text.indexOf(p) >= 0) {
                        // 其他属性
                        match++;
                    }
                });
                if (match == values.length) {
                    $(e).prev().addClass("selected");
                }
            });
        }
    });

    $(document).ready(function () {
        $(".panel-filter").each(function (i, input) {
            var value = window.localStorage.getItem($(this).attr("id"));
            if (value != null && value.length > 0) {
                $(this).val(value);
                $(this).trigger("propertychange");
            }
        });
    });
}

window.addEventListener('load', ahInit, false);