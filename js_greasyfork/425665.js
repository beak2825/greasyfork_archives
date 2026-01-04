// ==UserScript==
// @name         我的易班
// @namespace    keyroesTools
// @version      0.1
// @description  个人使用
// @author       keyroes
// @compatible   Chrome
// @match        *://www.yiban.cn/*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425665/%E6%88%91%E7%9A%84%E6%98%93%E7%8F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/425665/%E6%88%91%E7%9A%84%E6%98%93%E7%8F%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nowUrl = window.location.pathname;
    var url1 = 'article/show';
    var url2 = 'schoolrank';
    var div1 = '<div style="position: fixed; top:2px; right:20px; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;" id="allDiv">\n    <input type="button" value="隐藏" id="allBtn">\n</div>\n<div style="border: 2px dashed rgb(0, 85, 68); width: 330px;height: 90%; position: fixed; top: 0; right: 0; z-index: 99998; background-color: rgba(70, 196, 38, 0.9); overflow-x: auto;" id="keyroes">\n    <div style="height: 250px;margin:0 10px;display: flex;flex-direction: column;">\n        <span style="font-size: 17px;margin-bottom: 5px">功能区</span>\n        <div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >\n            <input type="button" style="margin-right: 10px;" value="活跃/共建指数排行统计" onclick="window.open(\'http://www.yiban.cn/yforumprovince/schoolrank/puid/7933855\');">\n            <input type="button" style="margin-right: 10px;margin-top: 10px" value="其他" onclick="window.open(\'https://jxgl.wyu.edu.cn/xskktzd!xskktzdFind.action\');">\n        </div>\n<span style="font-size: 16px;margin-bottom: 5px">刷话题访问量</span><input type="text" id="huaTiUrl" placeholder="话题链接"><input id="getTool" type="button" style="margin-right: 10px;margin-top: 5px" value="开始"><span style="font-size: 10px" id="yuan">原访问量：0</span><span style="font-size: 10px" id="logId">已刷次数：0</span>    </div>\n    <div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>\n    <div style="margin:0 10px;display: flex;flex-direction: column;">\n        <span style="font-size: 17px;margin-bottom: 5px">说明</span>\n        <div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >\n            <span style="font-size: 14px">1.支持查看活跃/共建指数榜单、批量打开微社区、批量复制校名+活跃指数、复制话题标题+链接<br>2.批量社区：批量打开活跃指数前三的学校和五邑大学的微社区（浏览器可能会拦截，允许弹出窗口即可）<br>3.批量复制：复制活跃指数前三的学校和五邑大学的校名和活跃指数（用于活跃度收集表格的填写）<br>4.复制话题：复制该话题的标题+链接（用于活跃度收集表格的填写）<br>5.本脚本仅供测试使用，请勿用于其他用途，一切责任由使用者负责</span>\n        </div>\n    </div>\n</div>';
    var div2 = '<div style="position: fixed; top:2px; right:20px; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;" id="allDiv"><input type="button" value="隐藏" id="allBtn"></div><div style="border: 2px dashed rgb(0, 85, 68); width: 150px;position: fixed; top: 0; right: 0; z-index: 99998; background-color: rgba(70, 196, 38, 0.8); overflow-x: auto;" id="keyroes"><span style="font-size: medium;"></span> <div style="font-size: medium;width:70%;display: inline-block;"><input type="button" id="copyTitle" style="margin-right: 10px;" value="复制话题"></div><div style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div></div>';
    var div3 = '<div style="position: fixed; top:2px; right:20px; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;" id="allDiv"><input type="button" value="隐藏" id="allBtn"></div><div style="border: 2px dashed rgb(0, 85, 68); width:700px;height: 90%; position: fixed; top: 0; right: 0; z-index: 99998; background-color: rgb(70, 196, 38); overflow-x: auto;" id="keyroes"><span style="font-size: medium;"></span> <div style="font-size: medium;width:70%;display: inline-block;"><input type="button" style="margin-right: 10px;" value="活跃榜" onclick="window.open(\'http://www.yiban.cn/yforumprovince/schoolrank/puid/7933855/type/2\')"><input type="button" style="margin-right: 10px;" value="共建榜" onclick="window.open(\'http://www.yiban.cn/yforumprovince/schoolrank/puid/7933855/type/1\');"><input type="button" style="margin-right: 10px;" value="批量复制" id="copy"><input type="button" style="margin-right: 10px;" value="批量社区" id="community"></div><div style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><span style="font-size: 17px;margin-bottom: 5px">活跃/共建榜单排行</span><div style="margin:0 10px;display: flex;flex-direction: row;"><div id="divbox1" style="overflow-x:auto;width: 350px;height: 100%;padding-bottom: 5px;margin-left: 5px;;display: flex;flex-direction: column" ><span style="font-size: 16px;margin-bottom: 5px">活跃榜单</span></div><div id="divbox2" style="overflow-x:auto;width: 350px;height: 100%;padding-bottom: 5px;margin-left: 5px;;display: flex;flex-direction: column" ><span style="font-size: 16px;margin-bottom: 5px">共建榜单</span></div></div></div>';
    var name = new Array();
    var num = new Array();
    var id = new Array();
    var wyuId = 0;

    function getData1() {
        $.ajax({
            type: "GET",
            url: "http://www.yiban.cn/yforumprovince/schoolrank/puid/7933855/type/2",
            async: false,
            beforeSend: function() {},
            success: function(data) {
                var values = data.valueOf().toString();
                var o = $(values);
                var key = 0;
                $(o.find('.name')).each(function() {
                    name[key] = $(this).text();
                    if ("五邑大学" == $(this).text()) {
                        wyuId = key
                    }
                    key++
                });
                key = 0;
                $(o.find('.num')).each(function() {
                    if ($(this).text() > 200) {
                        num[key] = $(this).text();
                        key++
                    }
                });
                $(o.find('.minIndexInfo')).each(function() {
                    num[key] = $(this).text();
                    key++
                });
                key = 0;
                var t = 0;
                var f;
                $(o.find("a[target='_blank']")).each(function() {
                    if (t < 15) {
                        t++
                    } else {
                        if ($(this).text().toString().length < 50 && key < 100) {
                            f = $(this).attr("href").toString().split('/');
                            id[key] = f[4];
                            key++
                        }
                    }
                });
                var htmlCalssData = '';
                for (var i = 0; i < 20; i++) {
                    htmlCalssData += '<span style="margin-bottom: 5px"><a href="javascript:;" onclick="window.open(\'http://www.yiban.cn/Org/orglistShow/type/forum/puid/' + id[i] + '\')">' + (i + 1) + '.' + name[i] + ':' + num[i] + '</a></span>'
                }
                htmlCalssData += '<span style="margin-bottom: 5px"><a href="javascript:;" onclick="window.open(\'http://www.yiban.cn/Org/orglistShow/type/forum/puid/' + id[wyuId] + '\')">' + (wyuId + 1) + '.' + name[wyuId] + ':' + num[wyuId] + '</a></span>';
                $("#divbox1").append(htmlCalssData)
            },
            complete: function(data) {},
            error: function(XMLHttpRequest) {
                alert("获取活跃榜单出错了")
            }
        });
        $.ajax({
            type: "GET",
            url: "http://www.yiban.cn/yforumprovince/schoolrank/puid/7933855/type/1",
            async: false,
            beforeSend: function() {},
            success: function(data) {
                var values = data.valueOf().toString();
                var o = $(values);
                var name = new Array();
                var num = new Array();
                var id = new Array();
                var wyuId = 0;
                var key = 0;
                $(o.find('.name')).each(function() {
                    name[key] = $(this).text();
                    if ("五邑大学" == $(this).text()) {
                        wyuId = key
                    }
                    key++
                });
                key = 0;
                $(o.find('.num')).each(function() {
                    if ($(this).text() > 200) {
                        num[key] = $(this).text();
                        key++
                    }
                });
                $(o.find('.minIndexInfo')).each(function() {
                    num[key] = $(this).text();
                    key++
                });
                key = 0;
                var t = 0;
                var f;
                $(o.find("a[target='_blank']")).each(function() {
                    if (t < 15) {
                        t++
                    } else {
                        if ($(this).text().toString().length < 50 && key < 100) {
                            f = $(this).attr("href").toString().split('/');
                            id[key] = f[4];
                            key++
                        }
                    }
                });
                var htmlCalssData = '';
                for (var i = 0; i < 20; i++) {
                    htmlCalssData += '<span style="margin-bottom: 5px"><a href="javascript:;" onclick="window.open(\'http://www.yiban.cn/Org/orglistShow/type/forum/puid/' + id[i] + '\')">' + (i + 1) + '.' + name[i] + ':' + num[i] + ')</a></span>'
                }
                htmlCalssData += '<span style="margin-bottom: 5px"><a href="javascript:;" onclick="window.open(\'http://www.yiban.cn/Org/orglistShow/type/forum/puid/' + id[wyuId] + '\')">' + (wyuId + 1) + '.' + name[wyuId] + ':' + num[wyuId] + ')</a></span>';
                $("#divbox2").append(htmlCalssData)
            },
            complete: function(data) {},
            error: function(XMLHttpRequest) {
                alert("获取共建榜单出错了")
            }
        })
    }

    function copyText(val) {
        var temp = document.createElement('textarea');
        temp.value = val;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("Copy");
        temp.style.display = 'none';
        return
    }

    function copys() {
        var a = "";
        for (var t = 0; t < 3; t++) {
            a += (t + 1) + "." + name[t] + "（活跃指数：" + num[t] + "）\n"
        }
        a += (wyuId + 1) + ".<br>" + name[wyuId] + "（活跃指数：" + num[wyuId] + "）";
        copyText(a);
        alert("复制前三+邑大的学校名:活跃指数成功");
        return
    }

    function toCommunity() {
        var a = "";
        for (var t = 0; t < 3; t++) {
            a = 'http://www.yiban.cn/Org/orglistShow/type/forum/puid/' + id[t];
            window.open(a)
        }
        a = 'http://www.yiban.cn/Org/orglistShow/type/forum/puid/' + id[wyuId];
        window.open(a);
        return
    }

    function copyTitle() {
        var a = $('h3 span').text() + "\nhttp://www.yiban.cn" + nowUrl;
        copyText(a);
        alert("复制话题标题+链接成功");
        return
    }
    var visitUrl;
    var channel_id;
    var puid;
    var article_id;
    var postNum = 0;
    var postType = true;
    var newPost = true;

    function postVisit() {
        visitUrl = $('#huaTiUrl').val();
        if (visitUrl.length <= 0 || visitUrl.indexOf("channel_id") == -1 || visitUrl.indexOf("puid") == -1 || visitUrl.indexOf("article_id") == -1) {
            alert("话题链接错误");
            return
        }
        var t = visitUrl.toString().split('/');
        channel_id = t[7];
        puid = t[9];
        article_id = t[11];
        postVisit1()
    }

    function postVisit1() {
        window.setTimeout(function() {
            $.ajax({
                type: "POST",
                url: "http://www.yiban.cn/forum/article/showAjax",
                data: {
                    "channel_id": channel_id,
                    "puid": puid,
                    "article_id": article_id,
                    "origin": 0
                },
                async: false,
                beforeSend: function() {},
                success: function(data) {
                    if (newPost) {
                        $("#yuan").text("原访问量：" + data.data.article.clicks);
                        newPost = false
                    }
                    postNum++;
                    $("#logId").text("已刷次数：" + postNum)
                },
                complete: function(data) {},
                error: function(XMLHttpRequest) {
                    alert("刷访问量出错了")
                }
            });
            if (postType) {
                postVisit1();
                return
            } else {
                $("#getTool").val("开始");
                return
            }
        }, 100)
    }
    if (nowUrl.indexOf(url1) != -1) {
        $(div2).appendTo('body')
    } else if (nowUrl.indexOf(url2) != -1) {
        $(div3).appendTo('body');
        getData1()
    } else {
        $(div1).appendTo('body')
    }
    $("#allBtn").on("click", function() {
        if ("隐藏" == $("#allBtn").val().toString()) {
            $("#allBtn").val("显示");
            $("#allBtn").css("background-color", "rgba(70, 196, 38, 0.8)");
            $("#keyroes").css("display", "none")
        } else {
            $("#allBtn").val("隐藏");
            $("#allBtn").css("background-color", "snow");
            $("#keyroes").css("display", "block")
        }
    });
    $("#copy").on("click", function() {
        copys()
    });
    $("#community").on("click", function() {
        toCommunity()
    });
    $("#copyTitle").on("click", function() {
        copyTitle()
    });
    $("#getTool").on("click", function() {
        if ("开始" == $("#getTool").val().toString()) {
            postNum = 0;
            postType = true;
            newPost = true;
            $("#getTool").val("终止");
            postVisit()
        } else {
            $("#getTool").val("开始");
            postType = false
        }
    });

    function isJSON(str) {
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true
            } catch (e) {
                console.log(e);
                return false
            }
        }
        console.log('It is not a string!')
    }
})();