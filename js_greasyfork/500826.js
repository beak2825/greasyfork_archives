// ==UserScript==
// @name         Jinxin Novel Kemono
// @namespace    https://gitee.com/jinxin11112/tampermonkey
// @version      0.1.3
// @description  下载Kemono中的小说
// @author       jinxin
// @match        https://kemono.su/*
// @grant        none
// @license MIT
// ==/UserScript==

class Kemono {
    'use strict';

    getContent() {
        let body = document.getElementsByClassName("post__content")[0];
        let messages = body.getElementsByTagName('pre')[1];
        let contentList = [];
        let content = messages.innerHTML;
        content = this.removeGarbled(content);
        if (content) {
            contentList.push(content);
            contentList.push('\n');
        }
        return contentList;
    }

    removeGarbled(str) {
        return str;
    }

    getTitle() {
        let title = document.title;
        title = title.replace(' | Kemono', '');
        return title;
    }
}
