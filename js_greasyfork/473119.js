// ==UserScript==
// @name         npm
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  可以在浏览器控制台,使用npm安装任意依赖包,比如安装JQuery可以使用: npm('JQuery')!
// @author       zhangqd
// @match        https://www.bing.com/search?q=Console%20Importer&mkt=zh-CN
// @icon         https://blog.nativescript.org/images/0tw5g4s3bv4xoxr6espf.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473119/npm.user.js
// @updateURL https://update.greasyfork.org/scripts/473119/npm.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 存储原始传入的名称
    let pkg_name_origin = null;
    const npmInstall = (originName) => {
        // Trim string
        const name = originName.trim();
        pkg_name_origin = name;
        // 三种引入方式
        // 如果是一个有效的URL，直接通过<script />标签插入
        if (/^https?:\/\//.test(name)) return injectScript(name);
        // 如果指定了版本，尝试使用unpkg加载
        if (name.indexOf('@') !== -1) return unpkg(name);
        // 否则，尝试使用cdnjs搜索
        return cdnjs(name);
    };

    // 在页面中插入<script />标签
    const injectScript = (url) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            console.log(pkg_name_origin, ' 安装成功。');
        };
        script.onerror = () => {
            console.log(pkg_name_origin, ' 安装失败。');
        };
        document.body.appendChild(script);
        // document.body.removeChild(script);
    };

    const unpkg = (name) => {
        injectScript(`https://unpkg.com/${name}`);
    };

    const cdnjs = async (name) => {
        const searchPromise = await fetch(
            `https://api.cdnjs.com/libraries?search=${name}`,
            // 不显示referrer的任何信息在请求头中
            { referrerPolicy: 'no-referrer' }
        );
        const { results, total } = await searchPromise.json();
        if (total === 0) {
            console.error('Sorry, ', name, ' not found, please try another keyword.');
            return;
        }

        // 取结果中最相关的一条
        const { name: exactName, latest: url } = results[0];
        if (name !== exactName) {
            console.log(name, ' not found, import ', exactName, ' instead.');
        }
        // 通过<script />标签插入
        injectScript(url);
    };
    globalThis.npm = npmInstall
    // Your code here...
})();