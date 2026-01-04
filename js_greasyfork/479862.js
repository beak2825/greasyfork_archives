// ==UserScript==
// @name         Free host download
// @namespace    http://tampermonkey.net/
// @version      1.95
// @description  free down it
// @author       kingweb
// @license MIT
// @match       https://www.dudujb.com/*
// @match       https://www.iycdn.com/*
// @match       http://www.xunniuyun.com/*
// @match       http://www.xueqiupan.com/*
// @match       https://www.567site.com/*
// @match       https://www.567inc.com/*
// @match       https://www.77file.com/*
// @match       https://ownfile.net/*
// @match       http://moguwp.com/file/*
// @match       https://www.ayunpan.com/*
// @match       http://www.feiyunfile.com/*
// @match       https://www.yifile.com/*
// @match       https://dufile.com/*
// @match       https://www.520-vip.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479862/Free%20host%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/479862/Free%20host%20download.meta.js
// ==/UserScript==

(function () {

    'use strict';
    var domain = window.location.host;
    let str = document.documentElement.outerHTML;
    let file_url = window.location.href;

    //select the domain

    if(domain == 'www.520-vip.com') {
        jumpTo(file_url);

        if (file_url.indexOf('down-') > -1) {
            let file_id = get_down_url_id(file_url);
            console.log(file_id);
            down_process2(file_id);
            abox('downbox.php?file_id='+file_id+'','文件下载',480,350);
        }
    }

    if (domain == 'dufile.com') {

        if (file_url.includes("/file/")) {
            var urlParts = file_url.split('/');
            var dynamicParam = urlParts[urlParts.length - 1].split('.')[0];
            if (dynamicParam) {
                window.location.href = 'https://dufile.com/down/' + dynamicParam + '.html';
            } else {
                alert('获取参数失败');
            }
        }

    }
    
    if(domain == 'moguwp.com') {

        window.addEventListener('beforeunload', function() {
            // 销毁函数的逻辑
            down_file_link = function() {};
        });

        const down_link = document.getElementById('down_link');
        down_link.style.display = 'none';
        down_link.remove();
        const down_link2 = document.getElementById('down_link2');
        down_link2.style.display = 'none';
        down_link2.remove();
        const down_div = document.getElementById('down_div');
        down_div.style.display = '';

        
    }


    if (domain == 'www.yifile.com') {

        alert('需要输入验证码下载，下载第一次后，第二次下载请等待约 10 秒后再输入验证码');

        $('#A1').click();

        window.onload = function () {
            downtime = 0;
        };

        if (getCookie('yifile')) {
            console.log(getCookie('yifile'));
            delCookie('yifile');
            window.location.reload(true);
        } else {
            downtime2();
        }

    }

    if (domain == 'www.feiyunfile.com') {



        if (file_url.includes("/file/")) {

            var urlParts = file_url.split('/');
            var dynamicParam = urlParts[urlParts.length - 1].split('.')[0];
            if (dynamicParam) {
                window.location.href = 'http://www.feiyunfile.com/down/' + dynamicParam + '.html';
            } else {
                alert('获取参数失败');
            }

        }

        if (file_url.includes("/down/")) {
            let down_box = $('#addr_box')
            down_box.hide();

            // 正则表达式匹配 file_id
            let sourceCode = document.body.outerHTML;
            const regex = /load_down_addr1\('(\d+)'\);/;
            const match = sourceCode.match(regex);
            if (match) {
                const fileId = match[1];
                load_down_addr1(fileId);
            } else {
                console.log('未找到 file_id');
            }


        }
    }

    if (domain == 'www.ayunpan.com') {
        jumpTo(file_url);
    }

    if (domain == 'ownfile.net') {

        if (file_url.includes("/files/")) {

            var urlParts = file_url.split('/');
            var dynamicParam = urlParts[urlParts.length - 1].split('.')[0];
            if (dynamicParam) {
                window.location.href = 'https://ownfile.net/down/' + dynamicParam + '.html';
            } else {
                alert('获取参数失败');
            }

        }


        if (file_url.includes("/down/")) {

            let scriptContent = document.body.innerHTML;
            var regex = /load_down_addr1\('([^']+)'\)/g;
            var match = regex.exec(scriptContent);
            let file_id = match[1];
            load_down_addr1(file_id);


            setTimeout(function () {

                var s1 = setInterval(() => {

                    if (document.getElementById("addr_list")) {
                        var href = $("#addr_list a").attr("href");;
                        if (href && href.includes("file_id")) {
                            $('#down_box h4').text('如果未列出有效地址，将会自动刷新，直到出现有效地址');
                            load_down_addr1(file_id);

                        } else {
                            clearInterval(s1);
                        }
                    }
                }, 1000);


            }, 1000);




        }
    }

    if (domain == 'www.77file.com') {

        if (file_url.includes("/s/")) {
            var urlParts = file_url.split('/');
            var dynamicParam = urlParts[urlParts.length - 1];
            window.location.href = '/down/' + dynamicParam + '.html';
        }

        if (file_url.includes("/down/")) {
            let scriptContent = document.body.innerHTML;
            var regex = /load_down_addr1\('([^']+)'\)/g;
            var match = regex.exec(scriptContent);
            let file_id = match[1];
            let element = document.getElementById("addr_box");
            element.parentNode.removeChild(element);
            load_down_addr1(file_id);
        }
    }

    if (domain == 'www.567site.com') {
        jumpTo(file_url);
        show_down_url_load_down_addr1(file_url);
    }

    if (domain == 'www.xunniuwp.com') {
        jumpTo(file_url);
        show_down_url_load_down_addr1(file_url);
    }

    if (domain == 'www.xunniuyun.com') {
        jumpTo(file_url);
        show_down_url_load_down_addr1(file_url);
    }

    if (domain == 'www.iycdn.com') {
        jumpTo(file_url);

        //判断当前 url 包含 down-2224.html
        if (file_url.indexOf('down-') > -1) {
            let down_box = document.getElementById('down_box');
            down_box.style.display = '';
            let file_id = get_down_url_id(file_url);
            //get download list
            $.ajax({
                type: 'post',
                url: 'ajax.php',
                data: 'action=load_down_addr2&file_id=' + file_id,
                dataType: 'text',
                success: function (msg) {
                    var arr = msg.split('|');
                    if (arr[0] == 'true') {
                        $('#addr_list').html(arr[1]);
                        $('#code_box').hide();
                    } else {
                        $('#addr_list').html(msg);
                    }
                },
                error: function () {
                }
            });
        }
    }

    if (domain == 'www.dudujb.com') {

        jumpTo(file_url);

        //判断当前 url 包含 down-2224.html
        if (file_url.indexOf('down-') > -1) {
            let down_box = document.getElementById('down_box');
            down_box.style.display = '';
            let file_id = get_down_url_id(file_url);
            //get download list
            $.ajax({
                type: 'post',
                url: 'ajax.php',
                data: 'action=load_down_addr2&file_id=' + file_id,
                dataType: 'text',
                success: function (msg) {
                    var arr = msg.split('|');
                    if (arr[0] == 'true') {
                        $('#addr_list').html(arr[1]);
                        $('#code_box').hide();
                    } else {
                        $('#addr_list').html(msg);
                    }
                },
                error: function () {
                }
            });
        }


    }





    //Some common methods

    //junmp to url
    function jumpTo(file_url) {

        if (file_url.indexOf('file-') > -1) {
            let file_id = get_file_url_id(file_url);
            if (file_id) {
                window.location.href = 'down-' + file_id + '.html';
            }
        }
    }

    //get file url id
    function get_file_url_id(url) {
        let matches = url.match(/file-(\d+)/);
        if (matches[1]) {
            return matches[1];
        } else {
            alert('获取文件ID失败');
        }

    }

    //get down url id
    function get_down_url_id(file_url) {
        let matches = file_url.match(/down-(\d+)/);
        if (matches[1]) {
            return matches[1];
        } else {
            alert('获取文件ID失败');
        }
    }

    //don't need ajax show download list
    function show_down_url_load_down_addr1(file_url) {
        if (file_url.indexOf('down-') > -1) {
            let down_box = document.getElementById('down_box');
            down_box.style.display = '';
            $("#codefrm").parent().hide();
            load_down_addr1(get_down_url_id(file_url));
        }
    }

    function get_add_ref() {
        let id = document.documentElement.outerHTML.match(/add_ref\((\S*)\);/)[1];
        if (id) {
            return id;
        } else {
            alert('查找文件 ID 错误');
        }
    }

    //取cookies     
    function getCookie(name) {
        var cookieArr = document.cookie.split(";");

        for (var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");
            var cookieName = cookiePair[0].trim();

            if (cookieName === name) {
                var cookieValue = cookiePair[1];
                return decodeURIComponent(cookieValue);
            }
        }

        // 如果未找到指定名称的 cookie，则返回 null 或适当的默认值
        return null;
    }

    //删除cookie
    function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
    }

})();
