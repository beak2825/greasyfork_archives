// ==UserScript==
// @name                第二学士学位招生平台小助手
// @namespace           http://tampermonkey.net/
// @version             0.4
// @description         适用于二学位招生信息平台。主要功能：记录并移除已经查看的、尚未提供报名的学校。
// @author              2690874578@qq.com
// @match               https://exwzs.chsi.com.cn/*
// @icon                https://t4.chei.com.cn/chsi/favicon.ico
// @grant               GM_registerMenuCommand
// @grant               GM_setValue
// @grant               GM_getValue
// @run-at              document-idle
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/468489/%E7%AC%AC%E4%BA%8C%E5%AD%A6%E5%A3%AB%E5%AD%A6%E4%BD%8D%E6%8B%9B%E7%94%9F%E5%B9%B3%E5%8F%B0%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/468489/%E7%AC%AC%E4%BA%8C%E5%AD%A6%E5%A3%AB%E5%AD%A6%E4%BD%8D%E6%8B%9B%E7%94%9F%E5%B9%B3%E5%8F%B0%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(async function() {
    "use strict";


    // 脚本级全局常量
    // 设置表: 设置的名称
    const MENU = {
        SCHOOLS: "SCHOOLS",
        BLACK_LIST: "BLACK_LIST"
    };


    /**
     * 脚本配置初始化 -------------------------------------------------------------------------
     */

    const CFG = (() => {
        /**
         * 返回学校名列表
         * @param {string} csv_row 
         * @returns {Array<string>}
         */
        function to_list(csv_row) {
            return csv_row
                .replace(/\s/g, "")
                .split(/[，,]/)
                .filter(part => part);
        }

        function get_sth_from_user(sth, opt, def_val) {
            const old_val = GM_getValue(opt, def_val);
            let new_val = prompt(
                `请输入${sth}，以逗号分隔`,
                old_val
            );

            if (new_val === null)
                new_val = old_val;
            return to_list(new_val).join(",");
        }

        function get_schools_from_user() {
            return get_sth_from_user(
                "学校名称", MENU.SCHOOLS, ""
            );
        }

        function get_black_list_from_user() {
            return get_sth_from_user(
                "屏蔽词", MENU.BLACK_LIST, "学院"
            );
        }
    
        GM_registerMenuCommand(
            "修改已记录的学校名单", () => {
                GM_setValue(
                    MENU.SCHOOLS,
                    get_schools_from_user()
                );
            }
        );

        GM_registerMenuCommand(
            "修改屏蔽词列表", () => {
                GM_setValue(
                    MENU.BLACK_LIST,
                    get_black_list_from_user()
                );
            }
        );

        return {
            /**
             * @returns {Array<string>}
             */
            get SCHOOLS() {
                return GM_getValue(MENU.SCHOOLS, "").split(",");
            },

            /**
             * @returns {Array<string>}
             */
            get BLACK_LIST() {
                return GM_getValue(MENU.BLACK_LIST, "学院").split(",");
            }
        };
    })();


    /**
     * 元素选择器
     * @param {string} selector 选择器
     * @returns {Array<HTMLElement>} 元素列表
     */
    function $(selector) {
        const self = this?.querySelectorAll ? this : document;
        return [...self.querySelectorAll(selector)];
    }


    /**
     * 主函数
     */
    function main() {
        // 移除不能报名的
        $("li.clearfix:has(.school-name a.no-zs)").forEach(li => li.remove());
        
        // 移除已经记录的
        $(`li.clearfix > div.school-name[title]`).forEach(div => {
            if (CFG.SCHOOLS.includes(div.title))
                div.parentElement.remove();
        });
        
        // 移除命中屏蔽词的
        $(`li.clearfix > div.school-name[title]`).forEach(div => {
            CFG.BLACK_LIST.forEach(word => {
                if (div.title.includes(word))
                    div.parentElement.remove();
            });
        });
        
        // 为其他学校添加按钮
        $("a").forEach(a => {
            let c = 0;
            a.target = "_blank";
            a.onclick = e => {
                if (++c === 2) {
                    const school = a.textContent;
                    console.log(`${school}\n ${a.href}`);
                    e.preventDefault();

                    // 移除点击过两次的学校
                    a.closest("li.clearfix").remove();
                    
                    // 添加到记录
                    const owned = CFG.SCHOOLS;
                    owned.push(school);

                    GM_setValue(
                        MENU.SCHOOLS, owned.join(",")
                    );
                }
            }
        });
    }


    function watch_changes() {
        const observer = new MutationObserver(main);
        observer.observe(
            $(".school-listwrap")[0],
            { attributes: true }
        );
    }


    setTimeout(main, 1000);
    setTimeout(watch_changes, 1200);
})();