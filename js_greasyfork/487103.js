// ==UserScript==
// @name         Jinxin Novel Fallen Ark
// @namespace    https://gitee.com/jinxin11112/tampermonkey
// @version      0.1.7
// @description  下载堕落方舟中的小说
// @author       jinxin
// @match        https://bbs.fallenark.com/*
// @grant        none
// @license MIT
// ==/UserScript==

class FallenArk {
    'use strict';

    getContent() {
        let messages = document.getElementsByClassName("t_f");
        let contentList = [];
        for (let message of messages) {
            let content = message.innerHTML;
            content = this.removeGarbled(content);
            if (content) contentList.push(content);
        }
        return contentList;
    }

    removeGarbled(str) {
        if (!str) return str;
        // str = str.replace(/<div class="quote"><blockquote>([.\n]*)<\/blockquote><\/div>/g, ''); // 互动内容直接去除（先不去除了）
        // 乱码内容直接去除
        str = str.replace(/<span style="display:none">(.*)<\/span>/g, '');
        str = str.replace(/<font class="jammer">(.*)<\/font>/g, '');
        str = str.replace(/(&nbsp;)/g, ' ');
        str = str.replace(/<br>/g, '');
        return str;
    }

    getTitle() {
        let title = document.title;
        title = title.replace(' - 转载文章', '');
        title = title.replace(' - 原创图书馆', '');
        title = title.replace(' - 底层：破碎梦呓', '');
        title = title.replace(' - 第一层：残缺殿堂', '');
        title = title.replace(' - 第二层：愤恨之塔', '');
        title = title.replace(' - 第三层：复仇之地', '');
        title = title.replace(' - 顶层：神圣天堂', '');
        title = title.replace(' - Fallen Ark【堕落方舟】', '');
        title = title.replace(' - Powered by Discuz!', '');
        title = title.replace(' - 手机版', '');
        return title;
    }
}
