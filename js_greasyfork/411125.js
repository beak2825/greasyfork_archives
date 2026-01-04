// ==UserScript==
// @name         哔哩哔哩测试
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  bilibili互赞脚本!
// @author       You
// @match        https://www.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/411125/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/411125/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const UID = getCookie("DedeUserID");
    const URLPATH = "http://baiyoujie.top";

    var test = window.location.href;
    if(test=="https://www.bilibili.com/"){
        window.open("https://www.bilibili.com?flag=0", '_self').location;
    }
    console.log(test)
    var flag = test.split("?flag=")[1];// 读取标志位
    setwindows();
    $(function () {
        if (flag > 0) {
            $.removeCookie('bv'+flag,{path:'/'});//移除cookie
            dianzan();
        } else {
            aa();
        }
    });

    // 页面加载完成，执行aa方法
    function aa() {
        console.log("页面加载完成...");
        var uname = $(".nickname").text();
        var uid = getCookie("DedeUserID");
        console.log("获取到用户UID------" + uid+"-----"+uname);
        getAll();
        // 提交按钮的点击
        $('#subBvid').click(function () {
            var bvid = $('#myBvid').val();
            adduser(uid,uname, bvid);
            start(flag);
        })
    }

    function start(flag) {
        flag = parseInt(flag) + 1;
        var a = "bv" + flag;
        var bvid = getCookie(a); // 读取标志位对应的bvidcookie值
        console.log("当前bvid" + bvid);
        if (bvid == "") {
            console.log("结束");
        } else {
            console.log("开始执行第" + flag + "个");
            var url = "https://www.bilibili.com/video/" + bvid + "?flag=" + flag;
            window.open(url, '_self').location;
        }
    }

    // 点赞的方法
    function dianzan() {
        setTimeout(function () {
            $(".bilibili-player-video video[preload='auto']").trigger("play");// 播放视频
            var classValue = $("#arc_toolbar_report").find('.ops').find('.like').attr('class');
            if (classValue == "like") {
                $("#arc_toolbar_report").find('.ops').find('.like').find(".van-icon-videodetails_like").trigger("click");
                setTimeout(function () {
                    start(flag)
                },1000*60)
            } else {
                console.log("已经点过赞了");
                setTimeout(function () {
                    start(flag)
                },1000*5);
            }

        }, 1000 * 20);
    }

    // 向页面插入窗口代码
    function setwindows() {
        var a = "<div style='width: 20%; padding: 20px; border: black solid 1px; position: fixed; top: 50px; right: 30px;"+
            "z-index: 9999; text-align: left;background: floralwhite'>"+
            "<p>交流和反馈请加QQ群：875075391</p>bvid:<input id='myBvid' type='text' name='fname' style='padding: 5px;margin: 5px;'placeholder='在此输入bvid'><br>"+
            "<input id='subBvid' type='button' style='width: 50%;padding: 2px; background: white' value='提交'>"+
            "</div>";
        $("body").append(a);
    }

    // 读取cookie的方法
    function getCookie(cookieName) {
        return $.cookie(cookieName);
    }

    // 添加用户的方法
    function adduser(uid,name, bvid) {
        console.log(uid + "--" + bvid)
        GM_xmlhttpRequest({
            method: "POST",
            url: URLPATH + '/user/addUser',
            headers: { 'Content-Type': "application/x-www-form-urlencoded;charset=utf-8" },
            data:'uid='+uid+'&name='+name+'&bvid='+bvid,
            onload: function (res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    console.log(json);
                    if (json = 1) {
                        console.log("添加/更新用户----[" + uid + "--" + bvid + "]")
                    }
                }
            }
        });
    }
    // 获取所有用户的方法

    function getAll() {
        GM_xmlhttpRequest({
            method: "get",
            url: URLPATH + '/user/getAll',
            async: false,
            onload: function (res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    for (var p in json) {
                        document.cookie = "bv" + (parseInt(p)+1) + "=" + json[p].bvid + ";path=/;";
                        console.log("bvid" + p + "----" + json[p].bvid);
                        //newWindow.location.href = "https://www.bilibili.com/video/" +json[p].bvid
                        //window.open("https://www.bilibili.com/video/" +json[p].bvid, '_self').location;
                    }
                }
            }
        });
    }

})();