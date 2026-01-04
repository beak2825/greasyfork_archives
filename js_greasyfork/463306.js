// ==UserScript==
// @name         Copy Transcript To Logseq
// @namespace    https://www.howieli.cn
// @version      0.2
// @description  复制 YouTube Transcript 并转为 Logseq 格式
// @author       howieli
// @match        https://www.youtube.com/watch?v=*
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/463306/Copy%20Transcript%20To%20Logseq.user.js
// @updateURL https://update.greasyfork.org/scripts/463306/Copy%20Transcript%20To%20Logseq.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个包含按钮的div元素
    var $buttonDiv = $('<div/>', {
        'class': 'floating-button',
        'css': {
            'position': 'fixed',
            'bottom': '20px',
            'right': '20px',
            'background-color': '#007bff',
            'color': '#fff',
            'padding': '10px',
            'border-radius': '5px',
            'cursor': 'pointer',
            'z-index': '999'
        },
        'text': 'Copy Transcript'
    });

    // 将div元素添加到文档的主体中
    $('body').append($buttonDiv);

    // 为按钮添加单击事件处理程序
    $buttonDiv.on('click', copyTranscript);

})();

function copyTranscript() {
    var transcriptText = getTranscript();
    if (transcriptText === '') {
        alert('请打开Transcript');
        return;
    }
    // 创建一个隐藏的textarea元素
    var $textarea = $('<textarea/>', {
      'text': transcriptText,
      'css': {
        'position': 'absolute',
        'left': '-9999px'
      }
    });

    // 将textarea元素添加到文档中
    $('body').append($textarea);

    // 选中textarea中的文本
    $textarea[0].select();

    // 将选中的文本复制到剪贴板中
    document.execCommand('copy');

    // 删除textarea元素
    $textarea.remove();

    // 弹出提示消息
    alert('复制成功，粘贴到Logseq吧！！！');
}

function getTranscript() {
    var $segmentsContainer = $('#segments-container');
    if ($segmentsContainer.length === 0) {
        console.log('没有打开Transcript')
        return '';
    }
    var children = $segmentsContainer.children();
    if (children.length == 0) {
        return '';
    }
    var transcript = '';
    children.each(function() {
        var $item = $(this)
        var $ts = $item.find('.segment-timestamp')
        var $text = $item.find('.segment-text')
        var seconds = toSeconds($ts.text().trim());
        var text = $text.text().trim().replace(/\n/g, ' ');
        var row = '- ' + '{{youtube-timestamp ' + seconds + '}} - ' + text + '\n';
        transcript += row;
    });
    return transcript;
}

function toSeconds(timeStr) {
    var timeArr = timeStr.split(':');
    var hours = (timeArr.length === 3) ? parseInt(timeArr[0]) : 0; // 如果时间数组长度为 3，表示有小时数，否则小时数为 0
    var minutes = parseInt(timeArr[timeArr.length - 2]);
    var seconds = parseInt(timeArr[timeArr.length - 1]);
    var totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds;
}