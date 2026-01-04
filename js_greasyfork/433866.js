// ==UserScript==
// @name         邦德提取网页广告链接ajax
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  提取网页(如色情)广告链接
// @author       木木
// @match        htt*://*/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/433866/%E9%82%A6%E5%BE%B7%E6%8F%90%E5%8F%96%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E9%93%BE%E6%8E%A5ajax.user.js
// @updateURL https://update.greasyfork.org/scripts/433866/%E9%82%A6%E5%BE%B7%E6%8F%90%E5%8F%96%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E9%93%BE%E6%8E%A5ajax.meta.js
// ==/UserScript==

(function () {
    // 'use strict';
    // Your code here...
    var r1 = /.*?(gif|png|jpg|css|js)$/gi;
    var r2 = new RegExp("\"|\'|javascript|mailto:|#|mqq:|sinaweibo:|alipays:|weixin:|sms:|baidu.com|cnzz.com|qq.com|{|function|bootcdn|\.google|http.*http|tel:[0-9]+|" + location.host, "gi");
    var r3 = new RegExp(location.host, "gi");
    var r4 = new RegExp("https?:\/\/[^\/]+?(\/)?$", "g");
    var r5 = new RegExp("https?:\/\/[^\"\(;\s]+(?=\"|\')", "g");
    // var r_word = new RegExp("^[\sa-zA-Z0-9_\u4e00-\u9fa5]+$" ,"g");
    var r_word = new RegExp("^[\sa-zA-Z0-9_\u4e00-\u9fa5:;()-_,<>]+$", "g");
    var r6 = new RegExp("https?:\/\/.+", "g");
    var is_send = 1;

    window.onload = function () {
        setTimeout(function () {
            show_adhref(1, 1);
        }, 5000);
    }

    $(document).ready(function () {
        show_adhref(0, 1);
    })

    function show_adhref(is_onload = 0, is_right = 1) {
        if (is_right === 1) {
            var right_field = "right";
        } else {
            var right_field = "left";
        }
        if (is_onload === 1 && $("#textarea_getad")) { //如果onload事件, 且ready事件先显示出来了 则不显示onload了
            return false;
        }
        console.log(111, $("img:not([title])").parents("a"));
        //当前域名
        var alist = $("img:not([title])").parents("a");
        console.log(333, alist);
        var ahref = [];
        var ahref_samedomain = [];

        var alist_script = [];

        for (var index = 0; index < alist.length; index++) {
            if (alist[index].href && !alist[index].href.match(r1) && !alist[index].href.match(r2) && alist[index].href.match(r6)) {
                ahref.push(alist[index].href);
            }
            if (alist[index].href && alist[index].href.match(r3)) {
                ahref_samedomain.push(alist[index].href);
            }
        }

        console.log(1, ahref.length)
        if (!ahref.length) { //如果没有a标签存在的话 去js中查询
            // alist = $("img").parents("a");
            var scripts = $("script");
            if ($("script").length) {
                for (var index4 = 0; index4 < scripts.length; index4++) {
                    
                    if (scripts[index4].text) {
                        var scripts_content = scripts[index4].text;
                        if (scripts_content.match) {
                            var scripts_content_match = scripts_content.match(r5);
                            if (scripts_content_match && scripts_content_match.length) {
                                alist_script = alist_script.concat(scripts_content_match);
                            }
                        }


                    }
                }
            } else if (scripts.text) {
                if (scripts.text.match) {
                    alist_script = scripts.text.match(r5);
                }
            }
            console.log(83, alist_script)
        }
        if (alist_script.length) {
            for (var index5 = 0; index5 < alist_script.length; index5++) {
                if (alist_script[index5].match) {
                    if (alist_script[index5] && !alist_script[index5].match(r1) && !alist_script[index5].match(r2)) {
                        ahref.push(alist_script[index5]);
                    }
                    if (alist_script[index5] && alist_script[index5].match(r3)) {
                        ahref_samedomain.push(alist_script[index5]);
                    }
                }
            }
        }
        console.log(2, ahref.length);
        if (!ahref.length) { //如果没有a标签存在的话 去所有a>img中查询
            alist = $("img").parents("a");
            console.log(3, alist);
            var deal_res = deal_ad_href(alist);
            ahref = deal_res[0];
            ahref_samedomain = deal_res[1];

        }

        ahref = unique(ahref);

        var ahref1 = [];
        var ahref2 = [];
        for (var index3 = 0; index3 < ahref.length; index3++) {
            if (ahref[index3].match && ahref[index3].match(r4)) {
                ahref1.push(ahref[index3]);
            } else {
                ahref2.push(ahref[index3]);
            }
        }
        ahref = ahref1.concat(ahref2)
        ahref_samedomain = unique(ahref_samedomain);
        console.log(222, ahref);
        console.log(555, ahref_samedomain);


        var ahref_content = ahref.join("\r\n");
        var ahref_samedomain_content = ahref_samedomain.join("\r\n");
        var ahref_samedomain_a_str = '';
        for (var index2 = 0; index2 < ahref_samedomain.length; index2++) {
            var current_ahref = ahref_samedomain[index2];
            ahref_samedomain_a_str += `<p><a style="color:#000 !important;" target="_blank" href="${current_ahref}">${current_ahref}</a></p>`;

        }

        //查询文字a标签
        var a_word = $("a");
        var ahref_word = [];
        var ahref_word_a_str = '';
        console.log(139, a_word);
        for (var index = 0; index < a_word.length; index++) {
            console.log(141, a_word[index], a_word[index].innerHTML, ((a_word[index].innerHTML && a_word[index].innerHTML.match && a_word[index].innerHTML.match(r_word)) || a_word[index].innerHTML == ''), ahref.indexOf(a_word[index]) === -1, a_word[index].href, !a_word[index].href.match(r1), !a_word[index].href.match(r2));
            if (((a_word[index].innerHTML && a_word[index].innerHTML.match) || a_word[index].innerHTML == '') && ahref.indexOf(a_word[index]) === -1 && a_word[index].href && !a_word[index].href.match(r1) && !a_word[index].href.match(r2)) {
                ahref_word.push(a_word[index].href);
            }
        }
        ahref_word = unique(ahref_word);
        for (var index = 0; index < ahref_word.length; index++) {
            var current_ahref_word = ahref_word[index];
            ahref_word_a_str += `<p><a style="color:#000 !important;" target="_blank" href="${current_ahref_word}">${current_ahref_word}</a></p>`;
        }
        console.log(148, ahref_word_a_str, ahref_word);
        var show_content = '';
        console.log(556, $("iframe").length, Boolean($("iframe")));


        if ($("iframe") && $("iframe").length) { //存在iframe, 不在iframe中
            var position1 = '450px';
            var position2 = '700px';
            var desc = "";
        } else {
            var position1 = '20px';
            var position2 = '300px';
            var desc = '';
        }
        if (ahref_content !== '') {
            show_content += `<textarea id="textarea_getad" style="position:fixed;top:5px;${right_field}:${position1};z-index:10000000  !important;width: 400px  !important;height:200px !important;">${desc}${ahref_content}</textarea>
                `;
        }
        if (ahref_samedomain_a_str !== '') {
            show_content += `<div id="" style="color:#000 !important;overflow: scroll;text-align: left;cursor:pointer;background:#fff;position:fixed;top:300px;${right_field}:${position1};z-index:10000000;width: 400px;height:200px;">${desc}同域名:\r\n${ahref_samedomain_a_str}</div>
                <button style="cursor:pointer;position:fixed;top:500px;${right_field}:${position2};z-index:10000000;" onclick="window.multi_open_youhou()" class="btn">批量打开网址</button>
                `;
        }
        if (ahref_word_a_str !== '') {
            show_content += `<div id="" style="color:#000 !important;overflow: scroll;text-align: left;cursor:pointer;background:#fff;position:fixed;top:600px;${right_field}:${position1};z-index:10000000;width: 400px;height:200px;">${desc}文字:\r\n${ahref_word_a_str}</div>
                             `;
        }

        if (is_send === 1) {
            var ahref_send = ahref.concat(ahref_word);
            ahref_send = unique(ahref_send);
            //向后台发送ajax
            if (ahref_send.join(",")) {
                $.post('https://192.168.200.135:9099/adhref', { ahref: ahref_send.join(","), domain: location.host }, function (res) {
                    console.log(777, res)
                }, 'json')
            }
        }



        $("body").append(show_content);
    }

    function deal_ad_href(alist) {
        var ahref_nosame = [];
        var ahref_same = [];
        for (var index = 0; index < alist.length; index++) {
            if (alist[index].href && !alist[index].href.match(r1) && !alist[index].href.match(r2) && alist[index].href.match(r6)) {
                ahref_nosame.push(alist[index].href);
            }
            if (alist[index].href && alist[index].href.match(r3)) {
                ahref_same.push(alist[index].href);
            }
        }
        return [ahref_nosame, ahref_same];
    }


    function unique(arr) {
        if (!Array.isArray(arr)) {
            console.log('type error!')
            return
        }
        var array = [];
        for (var i = 0; i < arr.length; i++) {
            if (array.indexOf(arr[i]) === -1) {
                array.push(arr[i])
            }
        }
        return array;
    }
    unsafeWindow.multi_open_youhou = function multi_open_youhou() {
        var alist = $("img:not([title])").parents("a:not([title])");
        console.log(666, alist);
        var r3 = new RegExp(location.host, "gi");
        for (var index = 0; index < alist.length; index++) {
            if (alist[index].href && alist[index].href.match(r3)) {
                window.open(alist[index].href);
            }
        }
    }
})();