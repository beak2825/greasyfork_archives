// ==UserScript==
// @name         [kesai]豆瓣电影辅助
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  豆瓣电影辅助，提供一些常用网站的搜索以及预告片的快捷进入
// @description  1.1.3修复1337无法显示问题
// @author       kesai
// @match        https://movie.douban.com/subject/*
// @require      https://cdn.bootcss.com/layer/2.3/layer.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388192/%5Bkesai%5D%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/388192/%5Bkesai%5D%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    //'use strict';

    // Your code here...
    function addCSS(url) {
        var link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        document.getElementsByTagName("HEAD")[0].appendChild(link);
    }

    function popWin(url) {
        //iframe窗
        var width = window.screen.width * 0.9 + "px";
        var height = window.screen.height * 0.8 + "px";
        var index = layer.open({
            type: 2,
            closeBtn: false,
            title: "预告片",
            shade: [0.9, '#000000'],
            shadeClose: true,
            offset: 'auto',
            //shade: false,
            maxmin: false,
            //开启最大化最小化按钮
            area: [width, height],
            content: [url, 'yes'],
            success: function (layerInstance) {
                console.log(index);
                console.log(layer);
                //layer.full(index);
            }
        });
    }

    //默认新窗口配置 
    var windowDefaultConfig = new Object;
    windowDefaultConfig['directories'] = 'no';
    windowDefaultConfig['location'] = 'no';
    windowDefaultConfig['menubar'] = 'no';
    windowDefaultConfig['resizable'] = 'yes';
    windowDefaultConfig['scrollbars'] = 'yes';
    windowDefaultConfig['status'] = 'no';
    windowDefaultConfig['toolbar'] = 'no';

    function clone(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    }
    /** 
    * 以POST表单方式打开新窗口的JQUERY实现 
    @param:url 需要打开的URL 
    @param:args URL的参数，数据类型为object 
    @param:name 打开URL窗口的名字，如果同一按钮需要重复地打开新窗口， 
    而不是在第一次打开的窗口做刷新，此参数应每次不同 
    @param:windowParam 新打开窗口的参数配置 
    * @author: haijiang.mo 
    */
    function OpenPostWindow(url, args, name, windowParam) {
        //创建表单对象 
        var _form = $("<form></form>", {
            'id': 'tempForm',
            'method': 'post',
            'action': url,
            'target': name,
            'style': 'display:none'
        }).appendTo($("body"));

        //将隐藏域加入表单 
        for (var i in args) {
            _form.append($("<input>", { 'type': 'hidden', 'name': i, 'value': args[i] }));
        }

        //克隆窗口参数对象 
        var windowConfig = clone(windowDefaultConfig);

        //配置窗口 
        for (var i in windowParam) {
            windowConfig[i] = windowParam[i];
        }

        //窗口配置字符串 
        var windowConfigStr = "";

        for (var i in windowConfig) {
            windowConfigStr += i + "=" + windowConfig[i] + ",";
        }

        //绑定提交触发事件 
        _form.bind('submit', function () {
            window.open("about:blank", name);
            //window.open("about:blank", name, windowConfigStr);
        });

        //触发提交事件 
        _form.trigger("submit");
        //表单删除 
        _form.remove();
    }



    function createButton(backgroudcolor, text, url, type, params) {
        var btn = $("<li><span style='margin-top:-10px;cursor:pointer;height:30px;width:55px;background:" + backgroudcolor + ";display:inline-block;text-align:center;line-height:30px;color:white;'>" + text + "</span></li>");
        $(".ul_subject_menu ").append(btn);
        btn.click(function () {
            if (type === 'post') {
                var formData = new Object;
                params.split("&").forEach(function (item) {
                    formData[item.split('=')[0]] = item.split('=')[1];
                });
                OpenPostWindow(url, formData, 'test', null)
            } else {
                window.open(url);
            }
        });
    }

    addCSS('https://cdn.bootcss.com/layer/2.3/skin/layer.css');
    var text = $("h1 span")[0].innerText;
    var movieName = text.split(" ")[0];

    var configs = [{
        color: "#f8d306",
        text: "磁力猫",
        url: "https://www.cilimao.me/search?word=" + movieName
    }, {
        color: "#1b6d9d",
        text: "字幕库",
        url: "https://www.zimuku.la/search?q=" + movieName
    }, {
        color: "#c0392b",
        text: "射手网",
        url: "https://assrt.net/sub/?searchword=" + movieName
    }, {
        color: "#39ac6a",
        text: "58网盘",
        url: "http://www.58wangpan.com/search/kw" + movieName
    }, {
        color: "#268dcd",
        text: "bd-film",
        url: "https://www.bd2020.com/search.jspx?q=" + movieName
    }, {
        color: "#2B7ACD",
        text: "5ndy",
        type: "post",
        url: "http://www.5ndy.com/search.php?mod=forum",
        params: "searchsubmit=yes&srchfid=38&srchtxt=" + movieName
        //srchfid:指定搜索范围，38表示只在百度云电影下载板块内搜索
    }, {
        color: "#222",
        text: "哔嘀影视",
        url: "https://bde4.com/search/" + movieName
    }, {
        color: "red",
        text: "片库",
        url: "https://www.pianku.tv/s/go.php?q=" + movieName
    }]

    configs.forEach(function (item) {
        createButton(item.color, item.text, item.url, item.type, item.params);
    });

    var info = $('#info').text();
    //var imdb_id = $("[href^='https://www.imdb.com']").text(); //获取imdb链接里的imdb_id
    let imdb_id = info.match(/(?<=IMDb:\s)[^\n]*/)[0];
    let apikey = '26abfbd0';
    let apiurl = 'https://www.omdbapi.com/?tomatoes=false&apikey=' + apikey + '&i=' + imdb_id;
    $.ajax({
        url: apiurl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            var imdb_MovieName = response.Title;
            if (imdb_MovieName != null) createButton("red", "1337x", 'https://1377x.to/search/' + imdb_MovieName + '/1/');
        }
    });

    // 调整底下剧情简介的位置
    let interest_sectl_selector = $('#interest_sectl');
    interest_sectl_selector.after($('div.grid-16-8 div.related-info'));
    interest_sectl_selector.attr('style', 'float:right');
    $('div.related-info').attr('style', 'width:480px;float:left');
    $('#link-report').css('margin-bottom', '0px');
    $("#interest_sect_level").css('padding-top', '0px');

    //增加预告片显示
    var div = $('<div id="divPiao" style="position: fixed; right:1px!important;right:18px;margin-right:30px; bottom:50px;"></div>');
    var ul = $("<ul class='related-pic-bd'></ul>");
    var li = $(".label-trailer"); //.clone();
    ul.append($(".label-trailer"));
    var a = li.find("a");
    var url = a.attr("href");
    a.attr("href", "javascript:void()");
    a.click(function () {
        popWin(url);
    })
    div.append(ul);
    $("body").append(div);

    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 192) {
            popWin(url);
        }
    }, false);
})();