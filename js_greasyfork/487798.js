// ==UserScript==
// @name         Jinxin Novel Sis001
// @namespace    https://gitee.com/jinxin11112/tampermonkey
// @version      0.1.2
// @description  下载第一会所中的小说
// @author       jinxin
// @match        https://www.sis001.com/*
// @grant        none
// @license MIT
// ==/UserScript==

class Sis001 {
    'use strict';

    getContent() {
        let contentList = [];
        let main = document.getElementsByName('modactions')[0];
        if (main) {
            let messages = main.getElementsByClassName('mainbox viewthread');
            for (let message of messages) {
                let content = message.getElementsByClassName('t_msgfont noSelect')[0].innerHTML;
                if (content) {
                    content = this.removeGarbled(content);
                    contentList.push(content);
                    contentList.push('\n\n')
                }
            }
        } else {
            let message = document.getElementsByClassName('message')[0];
            let content = message.innerHTML;
            content = this.removeGarbled(content);
            contentList.push(content);
        }
        return contentList;
    }

    removeGarbled(str) {
        if (!str) return str;
        str = str.replace(/&nbsp;/g, ' ')
        str = str.replace(/<br>/g, '\n')
        return str;
    }

    getTitle() {
        let title = document.title;
        title = title.replace(' - 文学作者区', '');
        title = title.replace(' - SiS001! Board', '');
        title = title.replace(' - [第一会所 关闭注册]', '');
        return title;
    }
}
