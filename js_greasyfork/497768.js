// ==UserScript==
// @name         限速
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  根据输入的GB区间和百分比值隐藏表格行，并记忆用户的输入
// @author       您
// @match        https://springsunday.net/topten.php?type=2*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/497768/%E9%99%90%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/497768/%E9%99%90%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建元素并设置样式
    function createUIElement(inputId, inputPlaceholder, buttonId, buttonText, topPosition) {
        var $input = $('<input>', { type: 'text', id: inputId, placeholder: inputPlaceholder, value: localStorage.getItem(inputId) || '' });
        var $button = $('<button>', { text: buttonText, id: buttonId });

        $input.css({
            position: 'fixed',
            top: topPosition,
            right: '100px',
            width: '150px'
        });

        $button.css({
            position: 'fixed',
            top: topPosition,
            right: '10px'
        });

        $('body').append($input, $button);

        return { input: $input, button: $button };
    }

    // 创建第一组文本框和按钮，修改为输入区间
    var ui1 = createUIElement('gbLimit', '输入GB区间，例如0-10', 'applyFilter1', '当月上传', '10px');

    // 创建第二组文本框和按钮
    var ui2 = createUIElement('percentLimit', '输入百分比', 'applyFilter2', '上传保种率', '50px');

    // 为第一个按钮添加点击事件
    ui1.button.on('click', function() {
        var range = ui1.input.val().split('-').map(Number);
        localStorage.setItem('gbLimit', ui1.input.val()); // Save the input to localStorage

        if (range.length !== 2 || isNaN(range[0]) || isNaN(range[1])) {
            alert('请输入有效的区间，例如 "0-10"');
            return;
        }

        var rows = $('.main tbody tr').slice(1);
        rows.show();
        rows.each(function() {
            var $row = $(this);
            var text = $row.find('td:eq(7)').text();
            var number = parseFloat(text);
            var isIncluded = false;

            if (range[0] === 0 && (text.includes('KB') || text.includes('MB'))) {
                // 如果最低区间是0，直接显示KB和MB单位的行
                isIncluded = true;
            } else if (text.includes('TB')) {
                number *= 1024; // Convert TB to GB
                isIncluded = number >= range[0] && number <= range[1];
            } else if (text.includes('GB')) {
                isIncluded = number >= range[0] && number <= range[1];
            }

            if (!isIncluded) {
                $row.hide();
            }
        });
    });

    // 为第二个按钮添加点击事件
    ui2.button.on('click', function() {
        var limit = parseFloat(ui2.input.val());
        localStorage.setItem('percentLimit', ui2.input.val()); // Save the input to localStorage

        if (isNaN(limit)) {
            alert('请输入有效的数字');
            return;
        }

        var rows = $('.main tbody tr').slice(1);
        rows.show();
        rows.each(function() {
            var $row = $(this);
            var text = $row.find('td:eq(10)').text();
            var number = parseFloat(text.replace('%', '').trim());
            if (number > limit) {
                $row.hide();
            }
        });
    });
})();
