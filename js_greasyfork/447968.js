// ==UserScript==
// @name        只看博客内容
// @description 支持【CSDN，简书，博客园，知乎，掘金，51CTO，51CTO文章，阿里云开发者社区，腾讯云开发者社区，微信，InfoQ，Github】等。 必要时临时关闭脚本，可能是需要验证。
// @namespace   https://gitee.com/inch_whf/tampermonkey-script-inch
// @version     1.26
// @author      wuhongfei
// @license     MIT
// @grant       unsafeWindow
// @match       *://blog.csdn.net/*/article/details/*
// @match       *://*.blog.csdn.net/article/details/*
// @match       *://www.jianshu.com/p/*
// @match       *://www.cnblogs.com/*/*/*
// @match       *://zhuanlan.zhihu.com/p/*
// @match       *://www.zhihu.com/question/*
// @match       *://juejin.cn/post/*
// @match       *://blog.51cto.com/*/*
// @match       *://www.51cto.com/article/*
// @exclude     *://www.51cto.com/topic/*
// @match       *://cloud.tencent.com/developer/article/*
// @match       *://bbs.huaweicloud.com/blogs/*
// @match       *://developer.aliyun.com/article/*
// @match       *://mp.weixin.qq.com/*
// @match       *://www.infoq.cn/article/*
// @match       *://www.infoq.cn/news/*
// @downloadURL https://update.greasyfork.org/scripts/448216/%E5%8F%AA%E7%9C%8B%E5%8D%9A%E5%AE%A2%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/448216/%E5%8F%AA%E7%9C%8B%E5%8D%9A%E5%AE%A2%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

// 启动函数
var host = window.location.host;

class Website {
    constructor(content = "article", author, content_before, sleep = 0, article = 'h1', time = 'time') {
        // 主元素选择器
        this.content = content;
        // 等待时间(ms)
        this.sleep = sleep;
        // 标题的选择器
        this.article = article;
        // 时间的选择器
        this.time = time;
        // 作者选择器
        this.author = author;
        // 主元素前的内容的选择器
        this.content_before = content_before;

        console.log(this)
    }

    // 获得主内容
    getDom_content() {
        return document.querySelector(this.content);
    }

    // 获得主内容的前置内容，如知乎的提问部分
    getDom_content_before() {
        return this.content_before == null ? null : document.querySelector(this.content_before);
    }

    // 获得标题
    getInner_article() {
        return document.querySelector(this.article).innerText
    }

    // 获得时间
    getInner_time() {
        // time标签的datetime属性的前10个字符
        const dom = document.querySelector(this.time);
        if (!dom) {
            return '无'
        }
        const time_string = dom.getAttribute('datetime') || dom.innerText;
        console.log(time_string);
        return /\d{4}[-\.\/]\d{2}[-\.\/]\d{2}/.exec(time_string)[0].replace(/[-\.\/]/g, "-");
    }

    // 获得作者
    getInner_author() {
        return this.author == null ? '无' : document.querySelector(this.author).innerText
    }

    // 获得信息的dom
    getDom_info() {
        const dom_info = document.createElement("div");
        const article = this.getInner_article()
        const date = this.getInner_time()
        const author = this.getInner_author()
        dom_info.innerHTML = `<h1 style='font-size:2em'>${article}</h1> <h3 style='font-size:1.17em'>${date}</h3> <h3 style='font-size:1.17em'>${author}</h3> <br/>`;
        return dom_info;
    }
}

main(host);


// 主函数
function main(host) {
    'use strict';

    // 特制函数
    zhihu();
    csdn();
    tencent_cloud();

    const website = get_website(host);
    const sleep = website.sleep;

    window.onload = function () {
        setTimeout(function () {
            // 信息dom，包括标题、时间、作者
            const dom_info = website.getDom_info()
            // 主元素前的内容dom，如知乎的提问部分
            const dom_content_before = website.getDom_content_before()
            // 主元素dom
            const dom_content = website.getDom_content()

            console.log(dom_info)
            console.log(dom_content_before)
            console.log(dom_content)

            // 以上三个dom按顺序放置
            body_just_script_link();
            dom_adjustment(dom_info);
            if (dom_content_before != null) { dom_adjustment(dom_content_before); }
            dom_adjustment(dom_content);
        }, sleep)
    };
}

//删除标题中的冗余信息去掉 （xx条消息）
function removeInfo() {
    let title = document.getElementsByTagName("title")[0];
    title.innerText = title.innerText.match(/(\([0-9]+.*[条](?=私信|消息).*?\)\s*)?(.+)/)[2];
}




// 获得dom元素
function get_website(host) {
    const map = {
        // https://blog.csdn.net/qwer123451234123/article/details/124148166
        'blog.csdn.net': () => new Website('#article_content', '.follow-nickName', time = '.time'),
        // https://www.jianshu.com/p/4d85661fba0a
        'www.jianshu.com': () => new Website('article', 'time :parent :first-child', sleep = 10),
        // https://www.cnblogs.com/zhangzl419/p/14649603.html
        'www.cnblogs.com': () => new Website('#cnblogs_post_body', '#Header1_HeaderTitle', article = '#cb_post_title_url', time = '#post-date'),
        // https://zhuanlan.zhihu.com/p/345475033
        'zhuanlan.zhihu.com': () => new Website('.Post-RichTextContainer', '.AuthorInfo-name', time = '.ContentItem-time'),
        // https://www.zhihu.com/question/20306249/answers/updated
        'www.zhihu.com': () => new Website('.AnswersNavWrapper', content_before = '.QuestionRichText'),
        // https://juejin.cn/post/6844903688088059912
        'juejin.cn': () => new Website('.markdown-body', '.name'),
        // https://www.51cto.com/article/745047.html
        'blog.51cto.com': () => new Website('.editor-preview-side', '.author-hover'),
        // https://www.51cto.com/article/750071.html
        'www.51cto.com': () => new Website('#container', '.author'),
        // https://developer.aliyun.com/article/871736
        'developer.aliyun.com': () => new Website('.article-inner', '.author-right-name', '.article-desc', sleep = 10, time = '.article-info-time'),
        // https://cloud.tencent.com/developer/article/2011799
        'cloud.tencent.com': () => new Website('.J-articleContent', '.com-author-intro-name-inner', article = '.article-info'),
        // https://bbs.huaweicloud.com/blogs/314775
        'bbs.huaweicloud.com': () => new Website('.markdown-preview', '.sub-content-username', '.cloud-blog-detail-summary', sleep = 400, time = '.article-write-time'),
        // https://mp.weixin.qq.com/s/uX4ivZUxBzgPx2S_YAOdtQ
        'mp.weixin.qq.com': () => new Website('.rich_media_content', '.rich_media_meta_text', time = '#publish_time'),
        // https://www.infoq.cn/article/ebdcihizbezofu9q6pi7
        'www.infoq.cn': () => new Website('.article-preview', '.com-author-name', null, sleep = 500, time = '.read-time'),
    };

    if (host.endsWith("blog.csdn.net")) {
        host = "blog.csdn.net";
    }
    return map[host]();
}

// 只保留内容dom
function body_just_script_link() {

    const body = document.body;

    body.style.setProperty('background', 'rgba(18,18,18,0)', 'important');

    const children = body.children
    for (var i = children.length - 1; i >= 0; i--) {
        if ("LINK" != children[i].tagName && "SCRIPT" != children[i].tagName) {
            // if("DIV"==children[i].tagName){
            body.removeChild(children[i]);
        }
    }

}


// 调整dom元素
function dom_adjustment(dom) {

    document.body.appendChild(dom);

    dom.style.width = '95%';
    dom.style.margin = 'auto';
    dom.style.display = 'block';

    const children2 = dom.children
    for (var i = children2.length - 1; i >= 0; i--) {
        children2[i].style.width = '100%';
    }

    if (typeof window.orientation == 'undefined') {
        // 当前设备不是移动设备，限制宽度
        // 参考：https://www.ruanyifeng.com/blog/2021/09/detecting-mobile-browser.html

        const imgs = dom.getElementsByTagName("img");
        for (var i = imgs.length - 1; i >= 0; i--) {
            imgs[i].style.width = '';
            imgs[i].style.maxWidth = '50%';
            imgs[i].style.display = 'block';
        }
    }

}

// 开始特制===========================================================================

// 知乎特制
function zhihu() {
    if ('zhuanlan.zhihu.com' != host) {
        return;
    }

    // 直接渲染所有图面
    (function () {
        const attribute = 'data-actualsrc';
        const imgs = document.querySelectorAll('img[' + attribute + ']');
        for (var i = imgs.length - 1; i >= 0; i--) {
            const img = imgs[i];
            imgs[i].setAttribute('src', imgs[i].getAttribute(attribute));
        }
    })();

    // 关闭登录弹窗

    setTimeout(() => {
        // 获得按钮
        const closeButton = document.querySelector(".Modal-closeIcon")
        if (closeButton == null) {
            return;
        }

        // 点击
        closeButton.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
        // 把html中的“overflow:hidden"去掉，小时滚动条
        document.querySelector("html").style.overflow = "";
    }, 1000);

    //   // 展示gif
    //   if (typeof window.orientation == 'undefined') {
    //     // 当前设备不是移动设备，限制gif
    //     // 参考：https://www.ruanyifeng.com/blog/2021/09/detecting-mobile-browser.html

    //     GifPlayers = document.querySelectorAll(".GifPlayer");
    //     for (var i = GifPlayers.length - 1; i >= 0; i--) {
    //       GifPlayers[i].querySelector(".GifPlayer-cover").style.paddingTop = '';
    //       GifPlayers[i].getElementsByTagName("video").style.objectFit = "contain"
    //     }

    //   }

}

// csdn特制
function csdn() {
    if ('blog.csdn.net' != host) {
        return;
    }

    // 关闭“CSDN:关注博主即可阅读全文”
    // 参考：https://www.isolves.com/it/cxkf/yy/js/2022-06-29/56707.html
    var article_content = document.getElementById("article_content");
    if (!article_content.hasAttribute('style')) {
        return;
    }
    article_content.removeAttribute("style");

    var follow_text = document.getElementsByClassName('follow-text')[0];
    follow_text.parentElement.parentElement.removeChild(follow_text.parentElement);

    var hide_article_box = document.getElementsByClassName('hide-article-box')[0];
    hide_article_box.parentElement.removeChild(hide_article_box);

}

// 腾讯云特制
function tencent_cloud() {
    if ('cloud.tencent.com' != host) {
        return;
    }
    var button = document.querySelector("#react-root > div:nth-child(1) > div.J-body.col-body.pg-2-article > div.com-3-layout > div.layout-main > section.com-2-panel.col-2-article.J-articlePanel > div.com-markdown-collpase.com-markdown-collpase-hide > div.com-markdown-collpase-toggle > a");
    if (button) {
        button.click();
    }
}
