// ==UserScript==
// @name         Jinxin Novel ZhaoZe
// @namespace    https://gitee.com/jinxin11112/tampermonkey
// @version      0.1.3
// @description  下载黑沼泽俱乐部中的小说
// @author       jinxin
// @match        https://zhaoze.pro/*
// @grant        none
// @license MIT
// ==/UserScript==

class ZhaoZe {
    'use strict';

    excludeTags = ['div', 'blockquote', 'fieldset', 'img']

    getContent() {
        let messages = document.getElementsByClassName("entry-content")[0].children;
        let contentList = [];
        for (let message of messages) {
            let tagName = message.tagName;
            if (this.excludeTags.includes(tagName.toLowerCase())) continue;
            let content = message.innerHTML;
            if (content) {
                content = this.removeGarbled(content);
                contentList.push(content);
                contentList.push('\n\n')
            }
        }
        return contentList;
    }

    removeGarbled(str) {
        if (!str) return str;
        str = str.replace(/&nbsp;/g, ' ')
        str = str.replace(/ – 黑沼泽俱乐部/g, '')
        return str;
    }

    getTitle() {
        let title = document.title;
        title = title.replace(' - 调教小说', '');
        title = title.replace('- 黑沼泽俱乐部', '');
        title = title.replace('-调教小说原创,翻译,转载', '');
        return title;
    }
}
