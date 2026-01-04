// ==UserScript==
// @name         知乎搜索标签
// @namespace    岁月的酒
// @version      0.1
// @description  知乎搜索结果打上标签，答案，文章，视频一目了然！
// @author       You
// @match        http*://www.zhihu.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/461297/%E7%9F%A5%E4%B9%8E%E6%90%9C%E7%B4%A2%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/461297/%E7%9F%A5%E4%B9%8E%E6%90%9C%E7%B4%A2%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

class ZhihuJustify {
    constructor() {
        let href = location.href;
        if (href.includes('search?')) {
            this.addSearchStyle();
            setInterval(() => this.searchJustify(), 2000);
        }
    }

    addSearchStyle() {
        let tempElement = document.createElement('div');
        tempElement.innerHTML = `
            <style>
                .AnswerItem h2 div {
                    display: flex;
                    align-items: center;
                }

                .ArticleItem h2 div {
                    display: flex;
                    align-items: center;
                }

                .ZvideoItem h2 div {
                    display: flex;
                    align-items: center;
                }

                .zhihu-search-tag {
                    display: inline-flex;
                    font-size: 12px;
                    justify-content: center;
                    align-items: center;
                    width: 65px;
                    height: 26px;
                    color: var(--zhihu-color);
                    background-color: var(--zhihu-bgcolor);
                    border-radius: 5px;
                    margin-right: 6px;

                    animation: arise 1s;
                }
                .zhihu-search-tag span {
                    padding-right: 8px;
                }

                @keyframes arise {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                        transform: scale(100%);
                    }
                }
            </style>
        `;
        let styleElement = document.createElement('style');
        styleElement.innerHTML = tempElement.querySelector('style').innerHTML;
        document.querySelector('head').appendChild(styleElement);
    }

    addSearchTag(elementNode, colors, svgElement, tagName) {
        let tagFlag = elementNode.getAttribute('tag');
        if (tagFlag) {
            return;
        }
        let fragment = document.createDocumentFragment();
        let tagNode = document.createElement('section');
        tagNode.className = 'zhihu-search-tag';
        tagNode.setAttribute('style', `--zhihu-color:${colors['color']};--zhihu-bgcolor:${colors['bgColor']}`);
        tagNode.innerHTML = `
            ${svgElement}
            <span>${tagName}</span>
        `;
        fragment.appendChild(tagNode);
        elementNode.setAttribute('tag', 'true');
        elementNode.insertBefore(fragment, elementNode.firstElementChild);
    }

    searchJustify() {
        let answerElements = document.querySelectorAll('.AnswerItem h2 div');
        // 回答
        answerElements.forEach(element => {
            let svg = `<svg  height="32" viewBox="0 0 40 40" class="GlobalWriteV2-navIcon" fill="currentColor"><g fill="#26BFBF" fill-rule="evenodd"><path fill-rule="nonzero" d="M21.987 11.686v2.169h-6.125c-1.43 0-1.863.064-2.297.306-.332.128-.574.383-.74.702-.255.447-.332.893-.332 2.297v7.018c0 1.442.09 1.876.332 2.297.166.345.408.587.74.766.434.23.868.319 2.297.319h7.018c1.43 0 1.863-.077 2.297-.32.345-.165.587-.408.766-.74.216-.408.296-.816.305-2.054l.001-6.316.025.025h2.17v6.074c0 1.914-.217 2.616-.587 3.318a3.92 3.92 0 0 1-1.634 1.62c-.689.383-1.403.575-3.317.575h-7.018c-1.915 0-2.616-.204-3.318-.575a3.891 3.891 0 0 1-1.62-1.62c-.384-.702-.575-1.404-.575-3.318v-7.018c0-1.914.204-2.629.574-3.318a3.996 3.996 0 0 1 1.62-1.633c.703-.383 1.404-.574 3.318-.574h6.1Zm1.889 6.954c1.059 1.06 1.059 2.807 0 3.88l-.039.038a2.719 2.719 0 0 1-3.879 0l-2.45-2.553a.801.801 0 0 0-1.123 0l-.05.052c-.32.357-.32.893 0 1.212a.75.75 0 0 0 .726.217c.51-.128 1.047.23 1.149.74a.946.946 0 0 1-.727 1.148 2.649 2.649 0 0 1-2.527-.74 2.796 2.796 0 0 1 0-3.905l.038-.025c1.098-1.085 2.808-1.085 3.892 0l2.463 2.488a.764.764 0 0 0 1.11 0l.038-.025a.855.855 0 0 0 0-1.187.876.876 0 0 0-.74-.217c-.51.128-1.02-.204-1.148-.727-.128-.51.204-1.021.727-1.149l.013-.013a2.703 2.703 0 0 1 2.527.766Zm4.338-9.315v2.578h2.578v1.722h-2.578v2.59h-1.723v-2.602h-2.59v-1.71h2.59V9.325h1.723Z"></path></g></svg>`;
            this.addSearchTag(element, {color: '#26BFBF', bgColor: '#e5f7f7'}, svg, '回答');
        })

        // 文章
        let articleElements = document.querySelectorAll('.ArticleItem h2 div');
        articleElements.forEach(element => {
            let svg = `<svg height="32" viewBox="0 0 40 40" class="GlobalWriteV2-navIcon" fill="currentColor"><g fill="#06F" fill-rule="evenodd"><path fill-rule="nonzero" d="M23.487 10.463c1.896 0 2.583.193 3.277.555a3.824 3.824 0 0 1 1.607 1.573c.371.678.569 1.35.569 3.206v8.472c0 1.855-.198 2.527-.569 3.205a3.824 3.824 0 0 1-1.607 1.573c-.694.363-1.381.556-3.277.556h-6.96c-1.895 0-2.583-.193-3.276-.556a3.824 3.824 0 0 1-1.608-1.573c-.37-.678-.568-1.35-.568-3.205v-8.472c0-1.855.197-2.528.568-3.206.37-.678.915-1.21 1.608-1.573.693-.362 1.38-.556 3.277-.556h6.959Zm0 2.08h-6.96c-1.407 0-1.836.081-2.273.31a1.72 1.72 0 0 0-.735.72c-.234.427-.317.847-.317 2.224v8.472c0 1.377.083 1.796.317 2.224.172.316.412.551.735.72.437.229.866.31 2.274.31h6.959c1.407 0 1.836-.081 2.274-.31a1.72 1.72 0 0 0 .735-.72c.234-.428.317-.847.317-2.224v-8.472c0-1.377-.083-1.797-.317-2.225a1.72 1.72 0 0 0-.735-.72c-.438-.228-.867-.309-2.274-.309Zm-1.991 9.778v1.873h-5.955V22.32h5.955Zm2.977-3.328v1.872h-8.932v-1.872h8.932Zm0-3.33v1.873h-8.932v-1.872h8.932Z"></path></g></svg>`;
            this.addSearchTag(element, {color: '#0066ff', bgColor: '#e1edff'}, svg, '文章');
        })

        // 视频
        let videoElements = document.querySelectorAll('.ZvideoItem h2 div');
        videoElements.forEach(element => {
            let svg = `<svg height="32" viewBox="0 0 40 40" class="GlobalWriteV2-navIcon" fill="currentColor"><g fill="#FF9607" fill-rule="evenodd"><path fill-rule="nonzero" d="M24.233 24.777v-9.555c0-.942-.748-1.706-1.67-1.706H13.61c-.922 0-1.67.764-1.67 1.707v9.554c0 .943.748 1.707 1.67 1.707h8.954c.921 0 1.669-.764 1.669-1.707Zm3.478-10.349a2.302 2.302 0 0 1 3.297.243c.367.434.57.989.57 1.563v7.532c0 1.32-1.047 2.389-2.337 2.389a2.308 2.308 0 0 1-1.53-.583l-1.475-1.306v.512c0 2.073-1.644 3.753-3.672 3.753H13.61c-2.028 0-3.672-1.68-3.672-3.753v-9.555c0-2.074 1.644-3.754 3.672-3.754h8.954c2.028 0 3.672 1.68 3.672 3.754v.51l1.475-1.305Zm-1.475 7.13 2.786 2.466a.33.33 0 0 0 .219.083.338.338 0 0 0 .334-.341v-7.532a.346.346 0 0 0-.082-.223.329.329 0 0 0-.47-.035l-2.787 2.466v3.116Z"></path></g></svg>`;
            this.addSearchTag(element, {color: '#ff9607', bgColor: '#fff3e2'}, svg, '视频');
        })
    }
}

new ZhihuJustify();
