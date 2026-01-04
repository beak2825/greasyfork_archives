// ==UserScript==
// @name         宜搭助手
// @namespace    https://blog.peng1013.cn/
// @version      0.2
// @description  开启 schema 工作台，屏蔽浮窗，在预览页自动调换开启调试模式。
// @author       Peng1013
// @run-at document-end
// @match        https://www.aliwork.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441043/%E5%AE%9C%E6%90%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/441043/%E5%AE%9C%E6%90%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    let schema = GM_getValue('schema', true)
    let robot = GM_getValue('robot', true)

    function set_schema(bool) {
        const schema_css = `
        .lc-left-area-bottom div:last-child {
            display: ${bool ? 'block' : 'none'};
        }
        `
        GM_addStyle(schema_css)
    }

    function set_robot(bool) {
        const robot_css = `
        #yida-robot-float-container{
            display: ${bool ? 'block' : 'none'};
        }
    `
        GM_addStyle(robot_css)
    }

    if (schema) {
        set_schema(schema)
    }
    if (!robot) {
        set_robot(robot)
    }
    GM_registerMenuCommand(`切换schema状态`, function () {
        schema = !schema
        GM_setValue('schema', schema)
        set_schema(schema)
    })
    GM_registerMenuCommand(`切换robot状态`, function () {
        robot = !robot
        GM_setValue('robot', robot)
        set_robot(robot)
    })
})();
