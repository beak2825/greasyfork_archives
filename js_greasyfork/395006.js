// ==UserScript==
// @name         Processon分享下载
// @version      1.0
// @description  导出Processon脑图 ，导出别人分享的脑图
// @author       clboy
// @match        *://www.processon.com/view/*
// @grant        none
// @namespace http://www.clboy.cn
// @downloadURL https://update.greasyfork.org/scripts/395006/Processon%E5%88%86%E4%BA%AB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/395006/Processon%E5%88%86%E4%BA%AB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

$(function () {

    'use strict';

    /**
     * 其他模板
     */
    const diagramingExportTemplate = `
    <div id="export_box" style="display: none;">
        <ul id="export_file" class="menu list options_menu" style="margin-top: 10px; top: 38px; left: 1437.53px;z-index:9999;">
            <li><div style="display: inline-block;margin-right: 6px;" class="ico icons"></div>新建导入pos后下载其他格式</li>
            <li ac="export" type="pos"><div style="display: inline-block;margin-right: 6px;" class="ico icons"></div><span class="suffix">ProcessOn文件（*.pos）</span></li>
            <form id="export_form" action="https://assets.processon.com/diagram_export/flow" method="post">
                <input id="export_type" type="hidden" name="type">
                <input id="export_definition" type="hidden" name="definition">
                <input id="export_title" type="hidden" name="title" value="未命名文件">
                <input id="export_width" type="hidden" name="width">
                <input id="export_height" type="hidden" name="height">
                <input id="export_chartId" type="hidden" name="chartId">
                <input type="hidden" name="ignore" value="definition">
            </form>
            </div>
        </ul>
    </div>
`

    /**
     * 思维脑图模板
     */
    const mindExportTemplate = `
        <div id="export_box" class="mind-download-dlg mind-dlg" style="display: none;z-index:9999;">
            <h3>下载为<span class="mind-dlog-close mind-icons"></span></h3>
            <div class="mind-dlg-content">
                <form id="export_form" action="https://assetsm.processon.com/diagram_export/mindmap" method="post">
                    <input id="export_definition" type="hidden" name="definition">
                    <input id="export_title" type="hidden" name="title">
                    <input id="export_width" type="hidden" name="width">
                    <input id="export_height" type="hidden" name="height">
                    <input type="hidden" name="chartId" id="downChartId">
                    <input type="hidden" name="ignore" value="definition">
                    <div class="mind-download-dlg-item"><input id="export_png" checked="" value="image" type="radio"
                            name="type"> <label for="export_png">图片文件（*.png）&nbsp; <span>将文件导出为图片</span></label></div>
                    <div class="mind-download-dlg-item"><input id="export_jpg" value="jpg" type="radio" name="type"> <label
                            for="export_jpg">JPG文件（*.jpg）&nbsp; <span>将文件导出为JPG图片 （默认白底）</span></label></div>
                    <div class="mind-download-dlg-item"><input id="export_pdf" value="pdf" type="radio" name="type"> <label
                            for="export_pdf">PDF文件（*.pdf）&nbsp; <span>将图片保存为PDF文件</span></label></div>
                    <div class="mind-download-dlg-item"><input id="export_pos" value="pos" type="radio" name="type"> <label
                            for="export_pos">POS文件（*.pos）&nbsp; <span>包含图片和图形结构定义（可导入）</span></label></div>
                    <div class="mind-download-dlg-item"><input id="export_xmind" type="radio" name="type" value="xmind">
                        <label for="export_xmind">XMind文件 (*.xmind)&nbsp; <span>导出为xmind文件</span></label></div>
                    <div class="mind-download-dlg-item"><input id="export_xmind_zen" type="radio" name="type"
                            value="xmindzen"> <label for="export_xmind_zen">XMind ZEN文件 (*.xmind)&nbsp; <span>导出为xmind
                                ZEN文件</span></label></div>
                    <div class="mind-download-dlg-item"><input id="export_fmind" type="radio" name="type" value="fmind">
                        <label for="export_fmind">FreeMind文件 (*.mm)&nbsp; <span>导出为freemind文件</span></label></div>
                    <div class="seb"></div>
                    <div tit="member" style="margin:12px 0px 6px;color:#63abf7;">以下格式升级为个人版或者团队版后即可使用</div>
                    <div tit="member" class="mind-download-dlg-item"><input id="export_word" type="radio"
                            name="type" value="word"> <label for="export_word">Word文件 (*.docx)&nbsp;
                            <span>导出为word大纲文件</span></label></div>
                    <div tit="member" class="mind-download-dlg-item"><input id="export_ppt" type="radio"
                            name="type" value="ppt"> <label for="export_ppt">PPT文件 (*.pptx)&nbsp;
                            <span>导出为ppt大纲文件</span></label></div>
                    <div tit="member" class="mind-download-dlg-item"><input id="export_excle" type="radio"
                            name="type" value="csv"> <label for="export_excle">EXCEL文件 (*.csv)&nbsp;
                            <span>导出为excel文件</span></label></div>
                </form>
                <div class="mind-dlg-buttons" style="margin-bottom:15px;">
                    <span id="btn-download" class="mind-button">下载</span>&nbsp;&nbsp;
                    <span id="btn-download-cancel" class="mind-button gray">关闭</span>
                </div>
            </div>
        </div>
    `

    const close = function () {
        $('#export_box').hide();
        $.mask('close');
    }

    var downBtn = $('<div id="downBtn" style="padding:2px 18px;height:24px;cursor:not-allowed;background-color: #adadad;line-height:24px;font-size:13px;border-radius:3px;color:#FFFFFF">解析中...</div>');

    var support = false;

    downBtn.prependTo('.view-nav>.nav-item:last');

    var restry = 0

    /**
     * 获取元素
     */
    var interval = setInterval(function () {
        if (restry > 120 || support) {
            clearInterval(interval);
            init(support);
        }
        support = window.mind || window.Model;
        restry++;
    }, 500);

    function init(format) {

        if (!format) {
            downBtn.text('不支持的格式');
            downBtn.on('click', function () {
                alert('无法下载，不支持的格式！');
            });
            return;
        }

        if (format == window.mind) {
            $('body').append(mindExportTemplate);
            $('#btn-download-cancel,.mind-dlog-close,#btn-download').on('click', function () {
                close();
            });
            $('#btn-download').on('click', function () {
                var e = $("#export_form input[type=radio]:checked").val();
                var data = mind.model.topic;
                $('#export_title').val(data.title.replace(/\s/g, '-'));
                $('#downChartId').val(mind.opts.chartId);
                $('#export_definition').val(JSON.stringify(data));
                $('#export_form')[0].submit();
            });
        } else if (format == window.Model) {
            $('body').append(diagramingExportTemplate);
            $('#export_file>li').click(function () {
                if (this.type == "pos") {
                    $('#export_type').val("pos");
                    $('#export_definition').val(JSON.stringify(window.Model.define));
                    $('#export_chartId').val(window.chartId);
                    $("#export_title").val($('.viewtitle>span.title').text());
                    $('#export_form').submit();
                }
                close();
            })
        }

        downBtn.css('backgroundColor', '#27ae60').css('cursor', 'pointer');
        downBtn.text('下载');
        downBtn.on('click', function () {
            $.mask('open');
            $('#window-mask').css('z-index', 99)
            $('#export_box').show();
        });
    }
})