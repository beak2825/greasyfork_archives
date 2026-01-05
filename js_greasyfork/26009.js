// ==UserScript==
// @name        LrcAddChineseTranslation
// @namespace   https://greasyfork.org/users/4514
// @author      喵拉布丁
// @homepage    https://greasyfork.org/scripts/26009
// @description 为网易云音乐上的LRC歌词添加双语对照文本中的中文翻译
// @include     http://music.163.com/*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @version     1.1
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/26009/LrcAddChineseTranslation.user.js
// @updateURL https://update.greasyfork.org/scripts/26009/LrcAddChineseTranslation.meta.js
// ==/UserScript==
'use strict';

const handleTxt = html => html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/\n+$/, '');

const equal = function (a, b) {
    if (a === b) return true;
    else if (a.length !== b.length) return false;
    else {
        let wrongNum = 0;
        let aList = [...a], bList = [...b];
        for (let i = 0; i < aList.length; i++) {
            if (aList[i] !== bList[i]) wrongNum++;
        }
        return wrongNum / aList.length <= 0.2;
    }
};

const addTranslationArea = function ($) {
    $('<li><a href="#" title="为歌词添加翻译"><em>处理歌词</em></a></li>').appendTo('.nav').click(function (e) {
        e.preventDefault();
        const $body = $(document.getElementById('g_iframe').contentWindow.document.body);
        if ($body.find('#pdAddTranslationArea').length > 0) return;
        const $lrcContent = $body.find('#lyric-content');
        if (!$lrcContent.length) {
            alert('未找到歌词文本');
            return;
        }
        $lrcContent.find('#flag_more.f-hide').removeClass('f-hide').end().find('.crl').remove();

        $(`
<div id="pdAddTranslationArea">
  <br>
  <label>
    双语对照文本：
    <textarea id="pdTxt" rows="12" wrap="off" style="width: 400px; white-space: pre;">${handleTxt($lrcContent.html().trim())}</textarea>
  </label><br><br>
  <label>
    LRC歌词：
    <textarea id="pdLrc" rows="12" style="width: 400px; white-space: pre;"></textarea>
  </label><br><br>
  <label>
    结果：
    <textarea id="pdResult" rows="12" style="width: 400px; white-space: pre;"></textarea>
  </label><br>
  <span id="pdCount" style="color: #f00;">共添加了0行翻译</span><br>
  <button type="button" id="pdHandle">处理</button>
  <button type="button" id="pdClose">关闭</button>
</div>
`).insertBefore($lrcContent).find('#pdHandle').click(function () {
            let txtList = [];
            let txtIndex = 0;
            $.each($body.find('#pdTxt').val().split('\n'), function (i, line) {
                line = line.trim();
                if (!line || /^(作曲|作词)/.test(line)) return;
                txtIndex++;
                if (txtIndex % 2 === 0) txtList[txtList.length - 1].translation = line;
                else txtList.push({original: line});
            });

            let successNum = 0, errorNum = 0;
            let lrcList = $.trim($body.find('#pdLrc').val()).split('\n');
            $.each(lrcList, function (i, line) {
                line = line.trim();
                let matches = /^(\[\d+:\d+\.\d+])+([^\[]+)/.exec(line);
                if (!matches) return;
                let text = matches[2].trim();
                if (/^(作曲|作词)/.test(text)) return;
                let obj = txtList.find(elem => equal(elem.original.toLowerCase(), text.toLowerCase()));
                if (obj) {
                    successNum++;
                    lrcList[i] += ' ／ ' + obj.translation;
                }
                else errorNum++;
            });

            $body.find('#pdCount').text(`共添加了${successNum}行翻译（共有${errorNum}行未匹配）`);
            $body.find('#pdResult').val(lrcList.join('\n')).select().focus();
            if (!successNum) alert('未找到匹配的翻译');
            else if ('execCommand' in document && document.execCommand('copy')) alert('已复制');
        }).end().find('#pdClose').click(function () {
            $body.find('#pdAddTranslationArea').remove();
        });
    });
};

jQuery.noConflict();
jQuery(() => addTranslationArea(jQuery));