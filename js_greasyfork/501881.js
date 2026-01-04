// ==UserScript==
// @name         百度翻译单词结果一键复制
// @namespace    http://tampermonkey.net/
// @version      2025-02-14.3
// @description  百度翻译单词结果一键复制，方便做笔记
// @author       foot foot
// @match        https://fanyi.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license    GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/501881/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%8D%95%E8%AF%8D%E7%BB%93%E6%9E%9C%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/501881/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%8D%95%E8%AF%8D%E7%BB%93%E6%9E%9C%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var copyButton = document.createElement('button');
    copyButton.innerHTML = '复制';
    copyButton.style.position = 'fixed';
    copyButton.style.left = '10px';
    copyButton.style.top = '30%';
    copyButton.style.transform = 'translateY(-50%)';
    copyButton.style.zIndex = 9999;
    document.body.appendChild(copyButton);

    copyButton.addEventListener('click', function() {
        var dictionaryOutput = $('.j4eb518e')[0];
        if (!dictionaryOutput) {
            alert('未找到元素');
            return;
        }

        var word = dictionaryOutput.innerText;
        var comments =  $('.DOIsDJZc li');
        var textToCopy = word + '\n';
        for (var i=0;i<comments.length;i++)
{
    var partOfSpeech='';
    var li =comments[i];

            textToCopy += li.childNodes[0].innerText+li.childNodes[1].innerText +'\n';
}

        

        GM_setClipboard(textToCopy.trim());
    });
})();