// ==UserScript==
// @name         MyScript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  这是存放在gitee的一个测试油猴脚本
// @author       You
// @match        https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463095/MyScript.user.js
// @updateURL https://update.greasyfork.org/scripts/463095/MyScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var str = '';
    for (var i = 1; i <= 5; i++) {//外部控制换行
        for (var j = 1; j <= 5; j++) {//内部负责控制打印
            str = str + 'tutut';
        }
        // 内部执行结束换行
        str = str + '\n';
    }
    console.log(str);//输出打印结果
})();