// ==UserScript==
// @name            Google整页翻译一直运行-自改(不再更新，已找到原作者最新版脚本，脚本看简介)
// @author          anonymous
// @author          zyb
// @license         GPL-3.0-only
// @match           http://*/*
// @match           https://*/*
// @match           file://*/*
// @exclude         /.*baidu.*/
// @exclude         /youku\.com/
// @exclude         /.bilibili.*/*
// @exclude         /.*ngarihealth.*/
// @exclude         /.*qq.*/
// @run-at          document-end
// @noframes
// @description     谷歌浏览器整页翻译（原位翻译，不跳转页面），去除顶部翻译栏，适配移动端布局。在所有网页（除百度和优酷外）左下角均会显示翻译按钮。
// @version         0.34
// @namespace       https://greasyfork.org/users/574851
// @downloadURL https://update.greasyfork.org/scripts/459076/Google%E6%95%B4%E9%A1%B5%E7%BF%BB%E8%AF%91%E4%B8%80%E7%9B%B4%E8%BF%90%E8%A1%8C-%E8%87%AA%E6%94%B9%28%E4%B8%8D%E5%86%8D%E6%9B%B4%E6%96%B0%EF%BC%8C%E5%B7%B2%E6%89%BE%E5%88%B0%E5%8E%9F%E4%BD%9C%E8%80%85%E6%9C%80%E6%96%B0%E7%89%88%E8%84%9A%E6%9C%AC%EF%BC%8C%E8%84%9A%E6%9C%AC%E7%9C%8B%E7%AE%80%E4%BB%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459076/Google%E6%95%B4%E9%A1%B5%E7%BF%BB%E8%AF%91%E4%B8%80%E7%9B%B4%E8%BF%90%E8%A1%8C-%E8%87%AA%E6%94%B9%28%E4%B8%8D%E5%86%8D%E6%9B%B4%E6%96%B0%EF%BC%8C%E5%B7%B2%E6%89%BE%E5%88%B0%E5%8E%9F%E4%BD%9C%E8%80%85%E6%9C%80%E6%96%B0%E7%89%88%E8%84%9A%E6%9C%AC%EF%BC%8C%E8%84%9A%E6%9C%AC%E7%9C%8B%E7%AE%80%E4%BB%8B%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const head = document.head;
    const body = document.body;
    // 创建css样式
    const style = document.createElement('style');
    const style_text = document.createTextNode(`
        /*翻译语言选择栏样式设置*/
        #google_translate_element {
            position: fixed;
            /*按钮宽度(仅PC端生效)*/
            /*  max-width: 120px;*/
            min-width: 90px;
            /*按钮高度*/
            height: 25px;
            /*左侧边距离设置；如果要靠右设置，left改成right即可*/
            left: 0;
            /*距离底部高度*/
            bottom: 20px;
            /*边框线设置*/
            border: 2px solid #4990e4;
            /*边界半径设置*/
            border-radius: 0 13px 13px 0;
            z-index: 10000000;
            overflow: hidden;
            /*外边框阴影设置*/
            box-shadow: 1px 1px 3px 0 #000000;
            /*按钮隐藏百分比设置(仅PC端生效)*/
            transform: translateX(-75%);
            transition: all 0.3s;
            background-color: #ffffff;
        }
        /*鼠标悬浮样式*/
        #google_translate_element:hover {
            transform: translateX(0);
        }
        #google_translate_element .goog-te-gadget-simple {
            width: 100%;
            padding-top: 2px
        }
        #google_translate_element .goog-te-gadget-simple .goog-te-gadget-icon{
            display: inline-block;
        }

        /*隐藏顶部翻译区域*/
        .goog-te-banner-frame.skiptranslate {
            display: none
        }
        html,body{
            top: 0!important
        }

        /*通用按钮样式*/
        #googleTranslateDivDom .btnBox {
            /*按钮宽度(仅PC端生效)*/
            width: 45px;
            color: #454545;
            /*背景色设置*/
            background-color: #F0F8FF;
            position: fixed;
            /*左侧边距离设置；如果要靠右设置，left改成right即可*/
            left: 0;
            z-index: 10000000;
            user-select: none;
            text-align: center;
            /*边框线设置*/
            border: 2px solid #4990e4;
            font-size: small;
            /*按钮高度设置(仅PC端生效)*/
            line-height: 25px;
            /*边界半径设置*/
            border-radius: 0 15px 15px 0;
            /*外边框阴影设置*/
            box-shadow: 1px 1px 3px 0 #C0C0C0;
            /*按钮隐藏百分比设置(仅PC端生效)*/
            transform: translateX(-50%);
            transition: all 0.3s;
            cursor: pointer;
        }

        /*翻译按钮样式设置*/
        #googleTranslateDivDom .translateBtn {
            /*距离底部高度*/
            bottom: 85px;
        }
        /*鼠标悬浮样式*/
        #googleTranslateDivDom .translateBtn:hover {
            transform: translateX(0);
        }
        #googleTranslateDivDom .translateBtn:active {
            box-shadow: 1px 1px 3px 0 #888 inset;
        }
        /*隐藏翻译按钮*/
        #googleTranslateDivDom .hidetranslate {
            display: none;
        }

        /*原文按钮样式设置*/
        #googleTranslateDivDom .recoverPage {
            /*距离底部高度*/
            bottom: 50px;
        }
        /*鼠标悬浮样式*/
        #googleTranslateDivDom .recoverPage:hover {
            transform: translateX(0);
        }
        #googleTranslateDivDom .recoverPage:active {
            box-shadow: 1px 1px 3px 0 #888 inset;
        }

        /*----移动端UI适配设置（PC端不生效）----*/
        @media handheld, only screen and (max-width: 768px) {
            /*翻译按钮样式设置*/
            #google_translate_element {
                width: 104px;//按钮宽度
            }
            #google_translate_element .goog-te-combo {
                margin: 0;
                padding-top: 2px;
                border: none;
            }
            /*原文按钮样式设置*/
            #googleTranslateDivDom .btnBox {
                /*按钮宽度*/
                width: 34px;
                /*按钮高度设置*/
                line-height: 24px;
                /*按钮隐藏百分比设置*/
                transform: translateX(-40%);
                /*隐藏功能开关，0为关闭；1为打开*/
                transform: translateX(1);
            }
        }
    `);
    style.appendChild(style_text);
    head.appendChild(style);

    // 创建谷歌翻译左下角按钮区域
    const googleTranslateDivDom = document.createElement('div');
    googleTranslateDivDom.setAttribute('id', 'googleTranslateDivDom');
    // 往body添加dom节点
    body.appendChild(googleTranslateDivDom);

    //创建翻译按钮
    createTranslateBtnFuc();
    //创建原文按钮
    createRecoverPageBtnFuc();

    // 设置cookie，使网页翻译默认为中文
    document.cookie = "googtrans=/auto/zh-CN";

    //创建翻译按钮
    function createTranslateBtnFuc() {
        //创建翻译按钮
        const translateBtn = document.createElement('div');
        translateBtn.setAttribute('class', 'notranslate btnBox translateBtn');
        translateBtn.innerText = '翻译';
        googleTranslateDivDom.appendChild(translateBtn);
        // 点击翻译按钮后隐藏
        translateBtn.onclick = (() => {
            // 隐藏翻译按钮
            translateBtn.setAttribute('class', 'notranslate btnBox translateBtn hidetranslate');
            // 创建翻译语种选择栏
            let google_translate_element = document.createElement('div');
            google_translate_element.id = 'google_translate_element';
            googleTranslateDivDom.appendChild(google_translate_element);

            // 加载谷歌翻译API
            loadGoogleApiFuc();
        });

        // // 点击翻译按钮后不隐藏
        // translateBtn.onclick = (() => {
        //     if(document.getElementById('google_translate_element')){
        //         const PCRecoverIframe = document.getElementById(':2.container');
        //         const recoverDocument = PCRecoverIframe.contentWindow.document;
        //         recoverDocument.getElementById(':2.confirm').click();
        //         return;
        //     }
        //     // 创建翻译语种选择栏
        //     let google_translate_element = document.createElement('div');
        //     google_translate_element.id = 'google_translate_element';
        //     googleTranslateDivDom.appendChild(google_translate_element);

        //     // 加载谷歌翻译API
        //     loadGoogleApiFuc();
        // });
    }

    //创建原文按钮
    function createRecoverPageBtnFuc() {
        // 清楚图片，加快响应速度
        let img = [].slice.call(document.querySelectorAll('#goog-gt-tt img,#google_translate_element img'));
        img.forEach(function (v, i) {
            v.src = '';
        });

        //创建原文按钮
        const recoverPage = document.createElement('div');
        recoverPage.setAttribute('class', 'notranslate btnBox recoverPage');
        recoverPage.innerText = '原文';
        googleTranslateDivDom.appendChild(recoverPage);
        // 点击原文按钮
        recoverPage.onclick = (() => {
            const phoneRecoverIframe = document.getElementById(':1.container');
            const PCRecoverIframe = document.getElementById(':2.container');
            if (phoneRecoverIframe) {
                const recoverDocument = phoneRecoverIframe.contentWindow.document;
                recoverDocument.getElementById(':1.restore').click();
            } else if (PCRecoverIframe) {
                const recoverDocument = PCRecoverIframe.contentWindow.document;
                recoverDocument.getElementById(':2.restore').click();
            }
        })
    }

    // 加载谷歌翻译API
    function loadGoogleApiFuc() {
        // 创建谷歌翻译API的初始化函数
        let scriptDom = document.createElement('script');
        scriptDom.innerHTML = `
            function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                    autoDisplay: true,
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    multilanguagePage: true,
                    pageLanguage: 'auto',
                    includedLanguages: 'zh-CN,zh-TW,en,ja,ru'
                }, 'google_translate_element');
            }
        `;
        document.head.appendChild(scriptDom);

        // 加载谷歌翻译API
        let scriptForGoogleApiDom = document.createElement('script');
        scriptForGoogleApiDom.src = 'https://cdn.jsdelivr.net/gh/zs6/gugefanyijs@1.9/element.js';
        document.head.appendChild(scriptForGoogleApiDom);
    }
}());