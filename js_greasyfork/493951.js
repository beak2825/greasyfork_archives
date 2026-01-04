// ==UserScript==
// @name         快速添加回复的修改意见
// @namespace    https://springsunday.net/
// @version      1.17
// @description  快速添加回复
// @author       You
// @include      http*://springsunday.net/details.php*
// @include      http*://springsunday.net/offers.php?id=*&off_details=1
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493951/%E5%BF%AB%E9%80%9F%E6%B7%BB%E5%8A%A0%E5%9B%9E%E5%A4%8D%E7%9A%84%E4%BF%AE%E6%94%B9%E6%84%8F%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/493951/%E5%BF%AB%E9%80%9F%E6%B7%BB%E5%8A%A0%E5%9B%9E%E5%A4%8D%E7%9A%84%E4%BF%AE%E6%94%B9%E6%84%8F%E8%A7%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var torrentHerf;
    torrentHerf = true;//删除种子下载超链接，仅保留文字，防止手滑被盒。true：开启，false：关闭功能。

    const comments = [
        "请参考资源规则中的主标题部分重新命名",
        "请补充豆瓣链接到指定的位置",
        "请重新截取png格式原图",
        "图片链接使用不正确 [url=https://springsunday.net/forums.php?action=viewtopic&forumid=10&topicid=18105#pid389691]教程[/url]",
        "请参考本帖，添加合适的标签。[url=https://springsunday.net/forums.php?action=viewtopic&forumid=3&topicid=19073]参考[/url]",
        "现在我们提供一个春天种子检查[url=https://springsunday.net/forums.php?action=viewtopic&forumid=16&topicid=16773]脚本[/url]，方便用户自检常见的种子信息不规范问题，提高发种效率。",
        "「原生标签」 Untouch 原盘指正式出版未经过二次制作的影碟，包括Blu-ray和DVD。",
        "「特效标签」 字幕包含有位移、变色、动态等特殊效果。简单的颜色、字体处理不被视为特效。使用特效标签的种子要求至少提供2张特效截图，且必须截取剧情相关部分的特效，无分辨率和格式要求，且不计入3张截图的基本要求。",
        "「已取代标签」Trump 资源必须先于候选区发布，主动举报种子并说明 Trump（附带对应链接），附带 Trump 理由可更好的审核。",
        "「合集标签」 剧集、纪录、动画等资源的整季打包。详见资源规则的[url=rules.php#id59]合集打包规则[/url]",
        "「中字标签」 资源包含有中文字幕。以下情形均可使用中字标签：内封/外挂/上传简繁字幕、内封/外挂/上传双语字幕、中文硬字幕。",
        "「国配标签」 外语片包含有普通话配音（包括台湾普通话配音）。原始配音为普通话的资源不可使用该标签，产地为内地和港澳台的资源不可使用该标签。",
        "「CC 标签」 原盘或压制的来源是 CC 标准收藏碟。"
    ];

    // 初始化UI
    function initializeUI() {
        const textarea = $('textarea[name="body"]');
        const selectHTML = buildSelectOptions(comments);
        textarea.after(selectHTML);

        setupEventListeners(textarea);
        addDetectionButton();
    }
    // 创建监控选择框
    function createMonitoringSelect() {
        const table = $('#compose').closest('table');
        if (table.length) {
            // 确保表格具有相对定位
            table.css('position', 'relative');

            // 找到表格内的第一个textarea
            const firstTextarea = table.find('textarea').first();
            if (firstTextarea.length) {
                // 计算第一个textarea的位置
                const textareaPosition = firstTextarea.position();

                // 创建选择框并设置样式和位置
                const monitoringSelect = $('<select id="monitoringSelect" multiple="multiple" style="width: 300px; height: 200px; position: absolute;"></select>');
                monitoringSelect.css({
                    top: textareaPosition.top + 'px', // 顶部对齐
                    left: (textareaPosition.left + firstTextarea.outerWidth() + 15) + 'px' // 在textarea右侧10px
                });
                table.append(monitoringSelect);

                // 初始化内容
                updateMonitoringSelect();

                // 每5秒检查并更新内容
                setInterval(updateMonitoringSelect, 5000);

                // 设置事件监听器
                monitoringSelect.change(function () {
                    const selectedText = $(this).find('option:selected').text();
                    const textarea = $('textarea[name="body"]');
                    textarea.val(textarea.val() + (textarea.val() ? '\n' : '') + selectedText);
                    formatTextareaInput(textarea); // 调用格式化函数
                });
            }
        }
    }
    // 更新监控选择框的内容
    function updateMonitoringSelect() {
        const assistantContent = $('#assistant-tooltips').html() || '';
        const editorContent = $('#editor-tooltips').html() || '';
        const combinedContent = assistantContent + '<br>' + editorContent; // 将两个内容合并，assistant在前
        const monitoringSelect = $('#monitoringSelect');

        // 使用简单的内容检查，如果有变化则更新
        if (monitoringSelect.data('content') !== combinedContent) {
            monitoringSelect.data('content', combinedContent);
            monitoringSelect.empty(); // 清空现有选项

            // 将内容分行并添加为选项
            const lines = combinedContent.split(/<br\s*\/?>/gi);
            lines.forEach(line => {
                const trimmedLine = line.trim();
                // 忽略包含特定文本的行
                if (trimmedLine && !trimmedLine.includes('此种子未检测到异常')) {
                    monitoringSelect.append($('<option></option>').text(trimmedLine));
                }
            });
        }
    }


    // 添加检测按钮
    function addDetectionButton() {
        $('#qr').before('<button id="detectionButton" type="button" style="margin-right: 10px;">检测中</button>');
        $('#detectionButton').click((event) => {
            event.preventDefault();  // 阻止按钮默认行为
            checkAndCopyTooltipToTextarea();
            setInterval(checkAndCopyTooltipToTextarea, 1000);
        });
    }

    // 检查并复制工具提示到文本区域
    function checkAndCopyTooltipToTextarea() {
        let tooltipDiv = $('#assistant-tooltips');
        if (tooltipDiv.length > 0) {
            if (tooltipDiv.text().includes('此种子未检测到异常')) {
                $('#detectionButton').text('未检测到异常');
            } else {
                $('#detectionButton').text('一键复制');
                $('#detectionButton').off('click').click((event) => {
                    event.preventDefault(); // 阻止按钮默认行为
                    copyTooltipToTextarea(tooltipDiv);
                });
            }
        }
    }

    // 复制工具提示到文本区域
    function copyTooltipToTextarea(tooltipDiv) {
        let text = tooltipDiv.html().replace(/<br\s*\/?>/gi, '\n').trim();
        let lines = text.split('\n').map(line => `● ${line.trim()}`);
        let currentText = $('textarea[name="body"]').val();
        $('textarea[name="body"]').val(`${currentText}${currentText ? '\n' : ''}${lines.join('\n')}`);
    }

    // 构建下拉选择HTML
    function buildSelectOptions(comments) {
        let options = comments.map((comment, index) => `<option class="quickcomment" id="quickcomment${index}" value="${index}">${comment}</option>`).join('');
        return `<div align="center"><select id="quickcommentselect" multiple="multiple" style="width: 450px; height: 300px; margin-top: 5px; margin-bottom: 5px">${options}</select></div>`;
    }

    // 设置事件监听器
    function setupEventListeners(textarea) {
        $('#quickcommentselect').change(() => handleSelectChange(textarea));
        textarea.on('input', () => formatTextareaInput(textarea));
        setTimeout(checkAndCopyTooltipToTextarea, 2000);
        $('#qr').after('<input type="checkbox" id="confirmCheckbox" checked="checked" style="margin-left: 10px;"/><label for="confirmCheckbox">完成修改后请举报种子，谢谢。</label>');
        $('#qr').click(() => handleQRClick(textarea));
    }

    // 处理下拉选择变更
    function handleSelectChange(textarea) {
        let selectedValues = $('#quickcommentselect').val();
        let currentText = textarea.val();
        let lastLineIsEmpty = currentText === '' || currentText.endsWith('\n');

        selectedValues.forEach(value => {
            let textToAdd = $(`#quickcomment${value}`).text();
            textarea.val(`${currentText}${lastLineIsEmpty ? '' : '\n'}● ${textToAdd}`);
            currentText = textarea.val();  // 更新当前文本
        });
    }

    // 格式化文本区域输入
    function formatTextareaInput(textarea) {
        let lines = textarea.val().split('\n');
        let transformedLines = lines.map(line => line.trim() !== '' && !line.trim().startsWith('●') ? `● ${line}` : line);
        textarea.val(transformedLines.join('\n'));
    }

    // 处理QR点击事件
    function handleQRClick(textarea) {
        if ($('#confirmCheckbox').is(':checked')) {
            let currentText = textarea.val();
            let additionalText = "\n\n完成修改后请举报种子，谢谢[em28]";
            if (!currentText.endsWith(additionalText)) {
                textarea.val(`${currentText}${additionalText}`);
            }
        }
    }

    function removeLinks() {
        if (torrentHerf == true) {
            $('.rowfollow.forcewrap').each(function () {
                $(this).find('a.index').each(function () {
                    const text = $(this).text();
                    $(this).replaceWith(text);
                });
            });
        }
    }
    removeLinks();
    initializeUI();
    createMonitoringSelect();
})();
