// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  基于谷歌翻译的划词翻译
// @license      https://www.apache.org/licenses/LICENSE-2.0
// @author       AzulRadio
// @match        http://*/*
// @include      https://*/*
// @run-at document-end
// @connect      translate.google.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/433805/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/433805/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

/*
 * Copyright 2019-2023 AzulRadio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// 根据Apache协议的规定，现对文件改动做出如下说明：
// 本脚本是在
// 作者 https://github.com/barrer 所作脚本 https://greasyfork.org/zh-CN/scripts/34921 基础上
// 由 田雨菲 https://greasyfork.org/zh-CN/users/150560 二次改动后
// AzulRadio 第三次改动后的脚本
// 因 Google 修改了API接口链接格式，对 GoogleUrl 略作修改，添加了token计算函数
// 特别鸣谢：https://github.com/hujingshuang/MTrans

// use https://translate.google.com/ to check the representation of your target language
var target_language = 'zh-CN';

(function () {
    'use strict';

    // Fix a bug on Youtube that it requires trustedHTML to create innerHTML.
    // reference: https://stackoverflow.com/questions/61964265/getting-error-this-document-requires-trustedhtml-assignment-in-chrome
    var escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {createHTML: (to_escape) => to_escape});

    var youdaoUrl = 'http://dict.youdao.com/jsonapi?xmlVersion=5.1&jsonversion=2&q=';
    var googleUrl ='https://translate.google.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=auto&sl=auto';
    var storeUrl = '';
    var user_code = 'admin';
    var iconSize = 24;
    var translationTestSize = 16;
    var icon = document.createElement('div');
    var word = '';
    var style = '' +
        'width:24px;' +
        'height:24px;' +
        'margin:4px!important;' +
        '';
    icon.innerHTML = escapeHTMLPolicy.createHTML('' +
        '<svg href="javascript:void(0)" style="' + style + '" "width="24" height="24" viewBox="0 0 768 768">' +
        '<path d="M672 640.5v-417c0-18-13.5-31.5-31.5-31.5h-282l37.5 129h61.5v-33h34.5v33h115.5v33h-40.5c-10.5 40.5-33 79.5-61.5 112.5l87 85.5-22.5 24-87-85.5-28.5 28.5 25.5 88.5-64.5 64.5h225c18 0 31.5-13.5 31.5-31.5zM447 388.5c7.5 15 19.5 34.5 36 54 39-46.5 49.5-88.5 49.5-88.5h-127.5l10.5 34.5h31.5zM423 412.5l19.5 70.5 18-16.5c-15-16.5-27-34.5-37.5-54zM355.5 339c0-7.381-0.211-16.921-3-22.5h-126v49.5h70.5c-4.5 19.5-24 48-67.5 48-42 0-76.5-36-76.5-78s34.5-78 76.5-78c24 0 39 10.5 48 19.5l3 1.5 39-37.5-3-1.5c-24-22.5-54-34.5-87-34.5-72 0-130.5 58.5-130.5 130.5s58.5 130.5 130.5 130.5c73.5 0 126-52.5 126-127.5zM640.5 160.5c34.5 0 63 28.5 63 63v417c0 34.5-28.5 63-63 63h-256.5l-31.5-96h-225c-34.5 0-63-28.5-63-63v-417c0-34.5 28.5-63 63-63h192l28.5 96h292.5z" style="fill:#3e84f4;"></svg>' +
        '');
    icon.setAttribute('style', '' +
        'width:32px!important;' +
        'height:32px!important;' +
        'display:none!important;' +
        'background:#fff!important;' +
        'border-radius:16px!important;' +
        'box-shadow:4px 4px 8px #888!important;' +
        'position:absolute!important;' +
        'z-index:2147483647!important;' +
        '');
    // 添加翻译图标到 DOM
    document.documentElement.appendChild(icon);
    var mousedowndone = false;

    // 1st Mouseup event listener (1/2)
    // On every mouseup, destory all translation panels
    // If words are selected, create a icon
    // Handle icon creation/destroy.
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode.parentNode == icon)) {// 点击了翻译图标
            e.preventDefault();
            return;
        }
        for (var i = 0; i < server.rendered.length; i++) {// 点击了翻译内容面板
            if (e.target == server.rendered[i])
                return;// 不再创建翻译图标
        }
        var text = window.getSelection().toString().trim();
        if (text && icon.style.display == 'none') {
            icon.style.top = e.pageY + 12 + 'px';
            icon.style.left = e.pageX + 'px';
            icon.style.display = 'block';
        } else if (!text) {
            icon.style.display = 'none';
            server.containerDestroy();// 销毁翻译内容面板
        }
    });

    icon.addEventListener('mousedown', function (e) {
        // Mousedown on icon:
        // 1. preventDefault() to prevent selected words from disappearing
        // 2. store the word
        e.preventDefault();
        word = window.getSelection().toString().trim();
        mousedowndone = true;
        console.log(word);
    });

    // Selection change:
    document.addEventListener("selectionchange", function () {

        console.log(word);
        // if selection is empty, hide icon and panel
        if (!word) {
            icon.style.display = 'none';
            server.containerDestroy();
        }
    });

    // 2nd Mouseup event listener (2/2)
    // Handle translation
    document.addEventListener('mouseup', function (e) {
        // this event callback only run when user previously mousedown on the icon
        // This change is a workaround for reddit.On mousedown on the icon, reddit
        // will clear all user selections and this plugin will read an empty string.
        // So we use (icon mousedown + anywhere mouseup) => translate to fix this.
        if (!mousedowndone) {
            return;
        }
        debugger;
        mousedowndone = false;
        if (word) {
            icon.style.display = 'none';
            server.containerDestroy();// 销毁翻译内容面板
            // 新建翻译内容面板
            var container = server.container();
            container.style.top = e.pageY + 'px';
            if (e.pageX + 350 <= document.body.clientWidth)// container 面板css最大宽度为250px
                container.style.left = e.pageX + 'px';
            else
                container.style.left = document.body.clientWidth - 350 + 'px';
            document.body.appendChild(container);
            server.rendered.push(container);
            googleUrl += `&tk=${token(word)}`;
            if(isChina(word)) {
                ajax(googleUrl + '&tl=en&q=', encodeURIComponent(word), 1, container);

            }else {
                ajax(googleUrl + '&tl='+ target_language + '&dt=t&q=', encodeURIComponent(word), 1, container);
            }
        }
    });

    function countOfWord(str) {
        var value = String(str);

        value = value.replace(/^\s+|\s+$/gi, ""); // 前后空格不计算为单词数

        value = value.replace(/\s+/gi, " ");// 多个空格替换成一个空格

        var length = 0; // 更新计数
        var match = value.match(/\s/g);//没有匹配到则返回null
        if (match) {
            length = match.length + 1;
        } else if (value) {
            length = 1;
        }
        return length;
    }

    function isChina(str){
        var reg=/^([\u4E00-\u9FA5]|[\uFF00-\uFF20]|[\u3000-\u301C])+$/;
        return !!reg.test(str);
    }

    /**
     * 谷歌翻译 token 计算， token()
     * https://github.com/hujingshuang/MTrans
     * */
    function token(a) {
        const b = 406644;
        const b1 = 3293161072;
        const jd = ".";
        const sb = "+-a^+6";
        const Zb = "+-3^+b+-f";
        let e = [];
        let f = 0;
        let g = 0;
        for (e = [], f = 0, g = 0; g < a.length; g++) {
            let m = a.charCodeAt(g);
            128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023), e[f++] = m >> 18 | 240, e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224, e[f++] = m >> 6 & 63 | 128), e[f++] = m & 63 | 128)
        }
        a = b;
        for (f = 0; f < e.length; f++) a += e[f],
            a = RL(a, sb);
        a = RL(a, Zb);
        a ^= b1 || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1E6;
        return a.toString() + jd + (a ^ b);
    }

    /**
     * 谷歌翻译 token 计算， RL()
     * https://github.com/hujingshuang/MTrans
     * */
    function RL(a, b) {
        const t = "a";
        const Yb = "+";
        for (let c = 0; c < b.length - 2; c += 3) {
            let d = b.charAt(c + 2);
            d = d >= t ? d.charCodeAt(0) - 87 : Number(d);
            d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
            a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d;
        }
        return a;
    }

    // ajax 跨域访问公共方法
    function ajax(url, text, target, element, method, data, headers) {

        if (!!!method)
            method = 'GET';
        // >>>因为Tampermonkey跨域访问(a.com)时会自动携带对应域名(a.com)的对应cookie
        // 不会携带当前域名的cookie
        // 所以，GM_xmlhttpRequest【不存在】cookie跨域访问安全性问题
        // 以下设置默认headers不起作用<<<
        url += text;
        if (!!!headers)
            headers = { 'cookie': '' };
        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: headers,
            data: data,
            onload: function (res) {
                if(target == 0){
                    youdao(res.responseText, text, element);
                }else{
                    google(res.responseText, element);
                }

            },
            onerror: function (res) {
                displaycontainer("连接失败",element);
            }
        });
    }
    //存储ajax
    function store_ajax(word,explain,element,data, headers) {
        var myurl = storeUrl+word+'&explain='+explain+'&ucode='+user_code;
        //var myurl = s;
        //alert(myurl)
        if (!!!headers)
            headers = { 'cookie': '' };
        GM_xmlhttpRequest({
            method: 'GET',
            url: myurl,
            data: data,
            headers: headers,
            onload: function (res) {
                console.log(res);
                console.log(res.responseText.substr(19,4));
                //displaycontainer("发送成功",element);
            },
            onerror: function (res) {
                //displaycontainer("连接失败",element);
            }
        });
    }

    // 有道翻译 引擎
    function youdao(rst, text, element) {

        var ec = JSON.parse(rst).ec;

        if (!!ec) {
            var word = JSON.parse(rst).ec.word[0], html = '', tr = '',wordtr = '';
            var trs = word.trs, ukphone = word.ukphone, usphone = word.usphone, phone = word.phone;
            var phoneStyle = '' +
            'color:#9E9E9E!important;' +
            '';
            if (!!ukphone && ukphone.length != 0) {
                html += '<span style="' + phoneStyle + '">英[' + ukphone + '] </span>';
            }
            if (!!usphone && usphone.length != 0) {
                html += '<span style="' + phoneStyle + '">美[' + usphone + '] </span>';
            }
            if (html.length != 0) {
                html += '<br />';
            } else if (!!phone && phone.length != 0) {
                html += '<span style="' + phoneStyle + '">[' + phone + '] </span><br />';
            }
            trs.forEach(element => {
                tr += element.tr[0].l.i[0] + '<br />';
                wordtr += element.tr[0].l.i[0];
            });
            html += tr;

            //alert(text+'查询单词'+wordtr+'查询释义');
            store_ajax(text,wordtr,element);
            displaycontainer(html, element);
        }else {
            ajax(googleUrl +'zh-CN&q=', text, 1, element);
        }
    }

    // 谷歌翻译 引擎
    function google(rst, element) {
        var json = JSON.parse(rst), html = '';
        for (var i = 0; i < json.sentences.length; i++) {
            html += json.sentences[i].trans;
        }
        displaycontainer(html, element);
        //alert(html);
        //store_ajax(word,html,element);
        //alert(word+'查询单词'+html+查询释义);
        //store_ajax(word,html);
       // alert('发送成功');
    }

    function displaycontainer(text, element) {
        element.innerHTML = escapeHTMLPolicy.createHTML(text);
        element.style.display = 'block';// 显示结果
    }

    // 翻译server
    var server = {
        // 存放已经生成的翻译内容面板（销毁的时候用）
        rendered: [],
        // 销毁已经生成的翻译内容面板
        containerDestroy: function () {
            for (var i = this.rendered.length - 1; i >= 0; i--) {
                if (this.rendered[i] && this.rendered[i].parentNode) {
                    this.rendered[i].parentNode.removeChild(this.rendered[i]);
                }
            }
        },
        // 生成翻译结果面板 DOM （此时还未添加到页面）
        container: function () {
            var div = document.createElement('div');
            div.setAttribute('style', '' +
                'display:none!important;' +
                'position:absolute!important;' +
                'font-size:13px!important;' +
                'overflow:auto!important;' +
                'background:#fff!important;' +
                'font-family:sans-serif,Arial!important;' +
                'font-weight:normal!important;' +
                'text-align:left!important;' +
                'color:#000!important;' +
                'padding:0.5em 1em!important;' +
                'line-height:1.5em!important;' +
                'border-radius:5px!important;' +
                'border:1px solid #ccc!important;' +
                'box-shadow:4px 4px 8px #888!important;' +
                'max-width:350px!important;' +
                'max-height:216px!important;' +
                'z-index:2147483647!important;' +
                '');
            return div;
        }
    };// 翻译server结束
})();