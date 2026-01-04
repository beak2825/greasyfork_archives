// ==UserScript==
// @name         豆瓣电影列表翻页
// @namespace    https://greasyfork.org/zh-CN/scripts/396471-%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%88%97%E8%A1%A8%E7%BF%BB%E9%A1%B5
// @version      0.11
// @description  增加自动加载和翻页功能
// @author       Hugo16
// @match        https://movie.douban.com/explore
// @match        https://movie.douban.com/tag/*
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/396471/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%88%97%E8%A1%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/396471/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%88%97%E8%A1%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 供全局使用的url
    let url = { url: "" };
    // 获取请求的地址
    let open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (...args) {
        open.apply(this, args);
        url.url = args[1];
    }

    //添加页面按钮
    let btn1 = $('<button class="db_btn" >原始模式</button>');
    let btn2 = $('<button class="db_btn" >自动加载</button>');
    let btn3 = $('<button class="db_btn" >翻页模式</button>');
    let btnBox = $('<div class="db_btn_box" ></div>');
    btnBox.append(btn1, btn2, btn3);
    $('body').append(btnBox);

    // 读取设置
    let config = null;
    let cookieIndex = document.cookie.indexOf('dbMode=')
    if (cookieIndex > -1) {
        config = document.cookie.slice(cookieIndex + 7, cookieIndex + 8);
        switch (config) {
            case '0': btn1.css('color', 'yellow'); break;
            case '1': btn2.css('color', 'yellow'); autoScroll(); break;
            case '2': btn3.css('color', 'yellow'); pageMode(url); break;
        }
    }
    else {
        document.cookie = 'dbMode=0';
        btn1.css('color', 'yellow');
    }

    // 原始模式
    btn1.on('click', function () {
        if (config == 0) return;
        document.cookie = 'dbMode=0';
        window.location.reload();
    });

    // 自动加载
    btn2.on('click', function () {
        if (config == 1) return;
        document.cookie = 'dbMode=1';
        window.location.reload();
    });

    // 翻页模式
    btn3.on('click', function () {
        if (config == 2) return;
        document.cookie = 'dbMode=2';
        btn3.css('color', 'yellow').siblings().css('color', 'white');
        // 清除其他模式
        window.onscroll = null;
        pageMode(url);
        config = 2;
    })
})();

function autoScroll() {
    window.onscroll = function () {
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
            $('a.more')[0].click();
        }
    };
}

function pageMode(url) {
    let pageStart, pageLimit, pageIndex, pagePre, pageNext, nowIndex, pageGo, indexWrap, pageWrap;
    // 分类页面所需参数
    let tags, genres, countries, year_range, sort, range;
    let waiting = false;
    // 计算当前页数
    // 区分找电影和分类两个网址
    if (window.location.href.indexOf('explore') >= 0) {
        pageStart = window.location.hash.match(/page_start=\d+/)[0].split('=')[1];
        pageLimit = window.location.hash.match(/page_limit=\d+/)[0].split('=')[1];
        pageIndex = pageStart / pageLimit + 1;
    }
    else {
        pageStart = 0;
        pageIndex = 1;
        $(".article .tags").on("click", function () {
            window.location.reload();
        })
    }
    // 添加按键
    pagePre = $('<button class="db_btn_page" >上一页</button>');
    pageNext = $('<button class="db_btn_page" >下一页</button>');
    nowIndex = $('<input class="db_input" disabled value=' + pageIndex + ' />');
    pageGo = $('<button class="db_btn_go" >跳转</button>');
    indexWrap = $('<div></div>');
    indexWrap.append(nowIndex, pageGo);
    pageWrap = $('<div class="db_page_wrap"></div>');
    pageWrap.append(pagePre, indexWrap, pageNext)
    function appendEle() {
        if ($('a.more').length > 0) {
            $($('a.more')[0]).after(pageWrap);
            $($('a.more')[0]).remove();
        }
        else {
            setTimeout(() => {
                appendEle();
            }, 50);
        }
    }
    appendEle();
    // 输入框移入可以输入
    indexWrap.on('mouseover', function () {
        nowIndex.removeAttr('disabled');
    })
    indexWrap.on('mouseout', function () {
        nowIndex.attr('disabled', 'disabled');
    })
    // 输入框只能输入数字
    $(nowIndex[0]).on('input', function () {
        this.value = this.value.match(/^\d+/);
    });
    // 跳转按钮
    pageGo.on('click', function () {
        if (waiting) return;
        getDataByPageIndex(nowIndex[0].value, pageLimit, url);
    })

    // 上一页按钮
    pagePre.on('click', function () {
        if (waiting) return;
        nowIndex[0].value = nowIndex[0].value <= 1 ? 1 : nowIndex[0].value * 1 - 1;
        getDataByPageIndex(nowIndex[0].value, pageLimit, url);
    })

    // 下一页按钮
    pageNext.on('click', function () {
        if (waiting) return;
        nowIndex[0].value = nowIndex[0].value * 1 + 1;
        getDataByPageIndex(nowIndex[0].value, pageLimit, url);
    })

    // 重新选择分类时还原索引
    $('div.sort').on('click', function () {
        nowIndex[0].value = 1;
    });
    $('div.tags').on('click', function () {
        nowIndex[0].value = 1;
    });
    $('div.tag-nav').on('click', function () {
        nowIndex[0].value = 1;
    })
}

function getDataByPageIndex(index, limit, url) {
    // 禁止按钮再次点击
    waiting = true;
    if (index <= 0) index = 1;
    // 整理网址并且获取数据
    // 区分找电影和分类两个网址
    if (window.location.href.indexOf('explore') >= 0) {
        let replaceStr = window.location.hash.match(/page_start=\d+/)[0];
        url.url = window.location.href.replace(replaceStr, 'page_start=' + (index - 1) * limit).replace('/explore#!', '/j/search_subjects?');
    }
    else {
        if (url.url) {
            url.url = url.url.replace(/start=\d+/, 'start=' + ((index - 1) * 20 + 1));
        }
        else {
            url.url = 'https://movie.douban.com/j/new_search_subjects?start=0&' + window.location.href.split('?')[1];
        }
    }
    let res = $.ajax({ url: url.url, async: false });
    let data;
    if (window.location.href.indexOf('explore') >= 0) {
        data = JSON.parse(res.responseText).subjects;
    }
    else {
        data = JSON.parse(res.responseText).data;
    }

    // 清空容器并填充新的数据
    if (window.location.href.indexOf('explore') >= 0) {
        $('div.list-wp div.list').empty();
    } else {
        $('div.article div.list-wp').empty();
    }
    for (let i = 0; i < data.length; i++) {
        if (window.location.href.indexOf('explore') >= 0) {
            let newItem = $('<a class="item" target="_blank" href="' + data[i].url
                + '?tag=热门&amp;from=gaia"><div class="cover-wp" data-isnew="' + data[i]['is_new']
                + '" data-id="' + data[i].id
                + '"><img src="' + data[i].cover
                + '" alt="' + data[i].title
                + '" data-x="' + data[i]['cover_x']
                + '" data-y="' + data[i]['cover_y']
                + '"></div><p>'
                + data[i].title
                + '<strong>' + data[i].rate
                + '</strong></p></a>');
            $('div.list-wp div.list').append(newItem);
        } else {
            let newItem = $('<a class="db_class_a" target="_blank" href="' + data[i].url
                + '?tag=热门&amp;from=gaia"><div style="background-size: 100%;height: 161px;overflow: hidden;position: relative;" data-isnew="' + data[i]['is_new']
                + '" data-id="' + data[i].id
                + '"><span style="display: inline-block;"><img style="width: 115px;" src="' + data[i].cover
                + '" alt="' + data[i].title
                + '" data-x="' + data[i]['cover_x']
                + '" data-y="' + data[i]['cover_y']
                + '"></span></div><p style="overflow: hidden;color: #333;line-height: 18px;padding-right: 15px;margin: 8px 0 20px;">'
                + '<span style="margin-right: 5px;">' + data[i].title
                + '</span><span style="color: #ffac2d;">' + data[i].rate
                + '</span></p></a>');
            $('div.article div.list-wp').append(newItem);
        }
    }

    // 滚动到顶部
    $("html,body").animate({
        scrollTop: 0
    }, 500);

    // 可以再次点击
    waiting = false;
}

GM_addStyle(".db_btn{padding:10px 10px 10px 0;color:white;border:none;background-color: #4b8ccb;cursor: pointer;}"
    + ".db_btn:nth-child(2){margin:1px 0}"
    + ".db_btn_box{z-index:999;position:fixed;left:-80px;top:50%;display:flex;flex-direction:column;width: 90px;border-radius: 0 5px 5px 0;overflow: hidden;transition: left 0.3s;background-color:white;}"
    + ".db_btn_box:hover{left:0;}"
    + ".db_page_wrap{display:flex;justify-content: space-between;}"
    + ".db_btn_page{background:#f7f7f7;color:#37a;padding:5px;border:none;width:30%;cursor:pointer}"
    + ".db_btn_page:hover{background:#eee;}"
    + ".db_btn_go{background:#f7f7f7;color:#37a;padding:5px;border:none;cursor:pointer}"
    + ".db_btn_go:hover{background:#eee;}"
    + ".db_input{width:50px;text-align:center}"
    + ".db_class_a{display: inline-block;vertical-align: top;font-size: 13px;text-align: left;padding: 0;width: 140px;}"
    + ".db_class_a:hover{background:#FFF !important}")