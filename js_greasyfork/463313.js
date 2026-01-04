// ==UserScript==
// @name         北化作业
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BUCT takes over the world!
// @author       Snowman
// @match        https://course.buct.edu.cn/meol/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buct.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463313/%E5%8C%97%E5%8C%96%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/463313/%E5%8C%97%E5%8C%96%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class Utils {

        static Query(query) {
            const res = document.querySelector(query);
            if (res == null) {
                throw "获取元素失败！\n" + query;
            }
            return res;
        }

        static QueryAll(query) {
            const resArr = document.querySelectorAll(query);
            if (resArr.length == 0) {
                throw "获取元素组失败！\n" + query;
            }
            return resArr;
        }

        // static async QueryUntilSuccess(query, tries = 5, gasp = 100) {
        //     let res;
        //     let clock = setInterval(() => {
        //         const ele = document.querySelector(query);
        //         if (ele != null) {
        //             res = ele;
        //             clearInterval(clock);
        //             return;
        //         }
        //         if (tries <= 0) {
        //             throw `获取元素失败！\n${query}\n已尝试 ${tries} 次`;
        //         }
        //         tries--;
        //     }, gasp);
        //     return res;
        // }

        // static async QueryAllUntilSuccess(query, tries = 5, gasp = 100) {
        //     let res;
        //     let clock = setInterval(() => {
        //         const ele = document.querySelectorAll(query);
        //         if (ele.length != 0) {
        //             res = ele;
        //             clearInterval(clock);
        //             return;
        //         }
        //         if (tries <= 0) {
        //             throw `获取元素组失败！\n${query}\n已尝试 ${tries} 次`;
        //         }
        //         console.log(tries);
        //         tries--;
        //     }, gasp);
        //     return res;
        // }

        static GetChildByIndexes(element, indexArr) {
            let res = element;
            indexArr.forEach(index => {
                res = res?.children[index];
                if (res == null) {
                    throw "通过元素链获取元素时失败！\n" + indexArr;
                }
            });
            return res;
        }
    }

    class Datas {
        static Courses = [];
        static BaseURL = "";
    }

    function Init() {

        /** 用户变量 */
        (function () {

            Datas.BaseURL = document.location.href
                .split('/').slice(0, -1).join('/');

        })();

        /** 个人选项卡高亮 */
        (function () {

            const el = Utils.Query(
                ".nav > ul > li:nth-child(9) > a > span"
            );

            if (el.textContent == "个人")
                el.style.color = "tomato";

        })();

        /** 记录课程信息 */
        setTimeout(() => {

            let eleArr = Utils.QueryAll(".list:nth-child(2) > ul > li");
            for (const item of eleArr) {
                // "item" : <li>...</li>
                const picUrl = Utils.GetChildByIndexes(item, [0, 0, 0]).src;
                const titleEle = Utils.GetChildByIndexes(item, [1, 0, 0]);
                Datas.Courses.push({
                    "picURL": picUrl.includes("default") ? null : picUrl,
                    "title": titleEle.title,
                    "target": titleEle.onclick,
                })

                // rebuild course enum
                const coursenum = Utils.GetChildByIndexes(item, [1, 1]);
                coursenum.removeChild(coursenum.childNodes[0]);
                coursenum.innerHTML = coursenum.title;
                
                // remove newnew
                const newnew = Utils.GetChildByIndexes(item, [1, 0, 1]);
                newnew.parentNode.removeChild(newnew);

                // rebuild teacher info
                const realname = Utils.GetChildByIndexes(item, [1, 2]);

            }

        }, 500);

        /** 重建课程卡片 */
        (function () {

            // document.head.appendChild(document.createElement('style'));
            console.log(document.styleSheets);
            let sheet = document.styleSheets[0];

            sheet.insertRule(`
            .courseborder ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
            }`, 0);

            sheet.insertRule(`
            .list:nth-child(2) li {
                width: 270px !important;
                border: none !important;
                box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, .35);
                border-radius: 15px;
                background: rgba(255, 255, 255, 0.1);
                overflow: hidden;
                display: flex;
                border-top: 1px solid rgba(255, 255, 255, 0.5);
                border-left: 1px solid rgba(255, 255, 255, 0.5);
                backdrop-filter: blur(5px);
                flex-direction: column;
                align-items: center;
                animation: mover 0.2s linear infinite;
            }`, 0);

            sheet.insertRule(`
            .list:nth-child(2) li:hover {
                animation: none;
            }`, 0);

            sheet.insertRule(`
            .list:nth-child(2) .list_content {
                display: flex !important;
                flex-direction: column;
                align-items: center;
            }`, 0);

            sheet.insertRule(`
            .list:nth-child(2) a {
                max-width: unset !important;
            }`, 0);

            sheet.insertRule(`
            .list:nth-child(2) .coursenum {
                width: auto !important;
                border-radius: 5px;
                padding: 1px 4px 0 5px;
                margin-top: 4px;
                color: white !important;
                display: inline-block;
                background: #87c2ff;
                font-family: consolas;
                margin-bottom: 20px;
                cursor: pointer;
            }`, 0);

            sheet.insertRule(`
            @keyframes rotater {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }`, 0);

            sheet.insertRule(`
            @keyframes mover {
                from {
                    transform: translate(25px, 0px);
                }
                25% {
                    transform: translate(0px, 25px);
                }
                50% {
                    transform: translate(-25px, 0px);
                }
                75% {
                    transform: translate(0px, -25px);
                }
                to {
                    transform: translate(0px, 0px);
                }
            }`, 0);
           

        })();
    }

    Init();

})();