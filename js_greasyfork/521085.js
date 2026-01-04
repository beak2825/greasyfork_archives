// ==UserScript==
// @name         Nyaa Magnet Catcher Mod
// @namespace    https://greasyfork.org/zh-CN/users/5899-pks
// @version      0.2.1
// @description  列表页批量选择复制磁力链接，适合配合aria2等下载软件导入批量任务，支持shift连选
// @author       luminisward
// @match        https://*.nyaa.si/
// @match        https://*.nyaa.si/?*
// @license MIT
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/521085/Nyaa%20Magnet%20Catcher%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/521085/Nyaa%20Magnet%20Catcher%20Mod.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 在表头和每一行中插入复选框
    function insertCheckbox() {
        // 插入表头的全选复选框
        $(".table thead tr").prepend(
            $("<th>").append(
                $('<input type="checkbox" id="checkall" checked />').change(function () {
                    // 全选功能
                    $("tbody input[type='checkbox']").prop("checked", this.checked);
                })
            )
        );

        // 插入每一行的复选框，初始状态为勾选
        $(".table tbody tr").prepend(
            $("<td>").append(
                $('<input type="checkbox" class="row-checkbox" checked />')
            )
        );
    }

    // 获取选中的行对应的磁力链接
    function getCheckedLinks() {
        const links = [];
        debugger;
        $(".table tbody tr").each(function () {
            const checkbox = $(this).find("input[type='checkbox']");
            if (checkbox.prop("checked")) {
                const magnetLink = $(this).find("a[href^='magnet:']").attr("href");
                if (magnetLink) {
                    links.push(magnetLink);
                }
            }
        });
        return links;
    }

    // 插入复制按钮
    function insertCopyButton() {
        const navBar = $("ul.nav").first(); // 确保选择的是第一个 ul.nav

        // 检查是否已存在按钮，避免重复添加
        if ($("#copyMagnet").length > 0) {
            return;
        }

        const button = $("<li>").append(
            $("<a>")
            .attr("href", "#")
            .attr("id", "copyMagnet")
            .text("Copy All MagnetLink")
            .click((e) => {
                e.preventDefault();
            })
        );
        navBar.append(button);
    }



    // Shift 和 Ctrl 连选逻辑
    let lastChecked = null; // 记录最后一次点击的复选框
    function handleCheck(event) {
        debugger;
        const currentCheckbox = $(this); // 当前点击的复选框

        // 阻止浏览器的默认行为
        event.preventDefault();

        if (event.shiftKey && lastChecked) {
            // Shift + Click: 连选逻辑
            const checkboxes = $(".row-checkbox"); // 获取所有复选框
            const startIndex = checkboxes.index(currentCheckbox); // 当前复选框的索引
            const endIndex = checkboxes.index(lastChecked); // 上一次点击的复选框索引
            const [start, end] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)]; // 确保范围正确

            // 遍历范围内的复选框，设置状态
            checkboxes.slice(start, end + 1).each(function () {
                $(this).prop("checked", $(lastChecked).prop("checked")); // 状态跟随上一次点击的状态
            });
        } else {
            // 单击：切换当前复选框状态
            const currentState = currentCheckbox.prop("checked");
            currentCheckbox.prop("checked", !currentState); // 手动反选
        }

        // 更新最后点击的复选框
        lastChecked = currentCheckbox;
    }


    // 绑定事件
    function bindEvents() {
        // 动态绑定复选框点击事件
        $(document).on("mousedown", ".row-checkbox", handleCheck);
        $(document).on("mouseup", ".row-checkbox", (event) => event.preventDefault()); // 避免默认行为
        $(document).on("click", ".row-checkbox", (event) => event.preventDefault()); // 避免默认行为
    }

    // 初始化
    function init() {
        insertCheckbox(); // 插入复选框
        insertCopyButton(); // 插入复制按钮
        bindEvents(); // 绑定事件

        // 配置 Clipboard.js
        new ClipboardJS("#copyMagnet", {
            text: function () {
                return getCheckedLinks().join("\n");
            },
        });
    }

    // 启动脚本
    init();
})();


