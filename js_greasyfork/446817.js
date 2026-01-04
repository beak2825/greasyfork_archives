// ==UserScript==
// @name         山东-专业技术人员继续教育管理服务平台
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  济宁-山东理工职业学院继续教育平台
// @author       帮帮客
// @license      bbk_1106
// @match        *://*.zhuanjipx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhuanjipx.com

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/446817/%E5%B1%B1%E4%B8%9C-%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%AE%A1%E7%90%86%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/446817/%E5%B1%B1%E4%B8%9C-%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%AE%A1%E7%90%86%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
class Verify {
    constructor() {
        var version = 'version';
        var hear = 'hear';
        var version_ = "0.3";
        var txt = '操作流程：\n' +
            '1.复制输入框里的内容；\n' +
            '2.点击浏览器右上角的油猴图标；\n' +
            '3.点击管理面板，找到刚安装的油猴脚本并点击打开；\n' +
            '4.在下方这行代码下，有一行是空白行，请将复制的内容粘贴上去；\n' +
            '[ // @require      https://www.g****in=zhuanjipx.com]\n' +
            '[                             空白行                          ]\n' + //！！！！注意：并非替换此行（28行），请将复制的内容粘贴到第10行！（鼠标滚轮往上滑，在上方）
            '[ // @grant         GM_setValue]\n' +
            '5.注意！！！记得保存后再刷新页面。 < Ctrl + C 复制输入框内容>';
        var str = '// @require      http://139.224.47.209:91/bbk_sdzy_4.js';
        let Set = GM_getValue("set");
        if (GM_listValues().indexOf("set") == -1) {
            jh();
            confirm("初始化完毕!\n请按流程完成功能激活。");
        } else if (version_ > Set[version]) {
            jh();
        }
        data();
        setTimeout(function(){
            Set = GM_getValue("set");
            if (Set[hear] != true || !jc()) {
                prompt(txt, str);
            } else {
                var date = new Date(); 
                date.setTime(date.getTime() - 10000); 
                document.cookie = "jk=; expires=" + date.toGMTString();
            }
        },1500);
        function data() {
            var url_n, url_t;
            url_n = unsafeWindow.location.href.split("/");
            url_t = url_n[url_n.length - 1].split("?")[0];
            if (url_t != "course_list_v2.aspx") {
                $('body').append(`
                    <div id=gzh style="font-weight: bold;right: 17px;font-size: 14px;height: 32px;text-align: center;display: block;background: #ffffff;position: fixed; top:272px;width: 129px;color: #717375;margin-left: 0px;line-height: 15px;">微信扫一扫<br>关注帮帮客公众号</div>
                    <iframe src="https://mp.weixin.qq.com/mp/qrcode?scene=10000004&size=102&__biz=Mzk0MjMxNTcxOQ==&mid=2247483681&idx=1&sn=382747485cbe09c94f7e7ee0eef363b5&send_time="
                    style="right: 17px;display: block;position: fixed; top:143px;width: 129px;color: #555;margin-left: 0px;line-height: 11px;border-radius: 6px;height: 160px;">
                    </iframe>
                    `);
            }
        }
        function jh() {
            GM_setValue("set", {"hear": "","version": "","k_id": "","k_d": "","k_t": "","k_code": ""});
        }
        function jc() {
            var arr, reg = new RegExp("(^| )jk=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return "";
            }
        }
    }
}

new Verify();