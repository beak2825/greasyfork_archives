// ==UserScript==
// @name         自定义百度云分享密码(废弃-官方已经支持)
// @namespace    http://zhangnew.com/
// @version      0.2.4
// @description  目前限制在网页版百度云网盘的“全部文件”下使用：点击“创建私密链接”的时候弹出对话框，此时可以输入自定义密码。注：自定义的密码字符和必须为4（一个字母或数字的字符数是1，一个汉字的字符数是3，因此如果密码中有一个汉字则只能加一个字母或数字），如：as53、9527、帅B 等，亲测可用中文。使用环境：Chrome 50 + Tampermonkey，其他环境请自行测试。
// @author       zhangnew
// @match        http://pan.baidu.com/disk/home*
// @match        https://pan.baidu.com/disk/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19889/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%99%BE%E5%BA%A6%E4%BA%91%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81%28%E5%BA%9F%E5%BC%83-%E5%AE%98%E6%96%B9%E5%B7%B2%E7%BB%8F%E6%94%AF%E6%8C%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/19889/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%99%BE%E5%BA%A6%E4%BA%91%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81%28%E5%BA%9F%E5%BC%83-%E5%AE%98%E6%96%B9%E5%B7%B2%E7%BB%8F%E6%94%AF%E6%8C%81%29.meta.js
// ==/UserScript==

document.addEventListener('click', function(event) {
    if(event.target.title == "分享"){
        window.setTimeout(function() {
            require(["function-widget-1:share/util/service/createLinkShare.js"]).prototype.makePrivatePassword = () => {
                return prompt("请输入自定义的密码", "1234");
            };
        }, 500);
    }
}, true);
