// ==UserScript==
// @name         s1black
// @namespace    http://www.xu81.com/
// @version      0.1
// @description  S1 blacklist ext.
// @author       viperasi
// @match        https://bbs.saraba1st.com/2b/*
// @match        https://bbs.stage1.cc/*
// @require      http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require      https://cdn.staticfile.org/remoteStorage/0.14.0/remotestorage.min.js
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/26644/s1black.user.js
// @updateURL https://update.greasyfork.org/scripts/26644/s1black.meta.js
// ==/UserScript==
'use strict';

var BLACKLIST = 's1blacklist';
var BLACKPRE = 's1black';
var BLACKINPUT = 's1blackname';
(function () {
    var href = window.location.href;
    if(href.indexOf('forum.php?mod=post') != -1){
        return;
    }else{
        viewlist();
        blackthread();
        blackcomment();
    }
})();

// 黑名单展示
function viewlist() {
    var navbar_ul = $("#toptb>.wp>.z");
    var view_li;
    if(navbar_ul.length>0){
        view_li = $('<a href="javascript:void(0);">S1黑名单</a>');
    }else{
        navbar_ul = $('#nv>ul');
        view_li = $('<li>').attr('id', 's1black_bl_view').append('<a href="javascript:void(0);">S1黑名单</a>');
    }
    
    var view_panel = $('<div>').css({
        'border': 'solid 2px',
        'border-radius': '4px',
        'padding': '5px',
        'width': '500px',
        'height': '500px',
        'background': '#f6f7eb',
        'position': 'fixed',
        'z-index': '999',
        'overflow': 'hidden',
        'left': '200px',
        'top': '200px'
    });
    var view_panel_tab = $('<ul>').addClass('tb').addClass('cl');
    var view_panel_li_user = $('<li>').attr('id', BLACKPRE + '_panel_li_user').addClass('a').css('cursor', 'pointer').append('<a>用户黑名单</a>').click(function(){
        $(this).addClass('a');
        $('#' + BLACKPRE + '_panel_li_thread').removeClass('a');
        $('#' + BLACKPRE + '_panel_thread').hide();
        $('#' + BLACKPRE + '_panel_user').show();
    });
    var view_panel_li_thread = $('<li>').attr('id', BLACKPRE + '_panel_li_thread').append('<a>帖子黑名单</a>').css('cursor', 'pointer').click(function(){
        $(this).addClass('a');
        $('#' + BLACKPRE + '_panel_li_user').removeClass('a');
        $('#' + BLACKPRE + '_panel_user').hide();
        $('#' + BLACKPRE + '_panel_thread').show();
    });
    view_panel_tab.append(view_panel_li_user).append(view_panel_li_thread).appendTo(view_panel);
    var panel_user = initUser();
    var panel_thread = initThread();
    var view_panel_close = $('<span>').css({
        'float': 'right',
        'margin-top': '-30px'
    }).addClass('flbc').append('关闭').click(function () {
        view_panel.hide();
    }).appendTo(view_panel);
    panel_user.appendTo(view_panel);
    panel_thread.appendTo(view_panel).hide();
    view_panel.appendTo('body#nv_forum').hide();
    view_li.on('click', function () {
        view_panel.show();
    });
    navbar_ul.append(view_li);

    var authi = $('.authi>a.xw1');
    $.each(authi, function(i, item){
        var btn = $('<button>').append('+').click(function(){
            add($(item).text(), 'user');
            location.reload();
        });
        $(item).parent().append(btn);
    });

    var threadTitle = $("h1.ts");
    var href = $(threadTitle.next('span.xg1')).find('a').attr('href');
    var threadBlock = $("<a>").css({
                'color': 'red',
                'cursor': 'pointer'
            }).append('[屏蔽主题]').click(function(){
                var threadId = href.substring(7, href.length - 9);
                add(threadId, 'thread');
            });
    threadTitle.after(threadBlock);

    var tlist = $('tbody[id^="normalthread"]');
    $.each(tlist, function (index, thread) {
        var tt = $(thread).find('a.s.xst');
        $.each(tt, function(index, title){
            var href = tt.attr('href');
            var threadId = href.substring(7, href.length - 9);
            var tb = $("<a>").css({
                'float': 'right',
                'cursor': 'pointer'
            }).append('[屏蔽主题]').click(function(){
                add(threadId, 'thread');
                location.reload();
            });
            tt.after(tb);
        });
    });
}

// 初始化用户面板
function initUser(){
    var list = get('user');
    var panel_user = $('<div>').attr('id', BLACKPRE + '_panel_user');   
    var view_panel_bar = $('<h3>').css('margin', '5px').append('黑名单用户:');
    var view_panel_add = $('<input>').css('width', '140px').attr({
        'id': BLACKINPUT,
        'placeholder': '用户ID'
    }).appendTo(view_panel_bar);
    var view_panel_add_btn = $('<button>').append('添加').click(function () {
        var theValue = $('#' + BLACKINPUT).val().trim();
        if (theValue != '') {
            add(theValue, 'user');
            $('#' + BLACKINPUT).val('');
            var btn = $('<a>').click(function () {
                if(window.confirm('确定要删除该ID吗?')){
                    del(theValue, 'user');
                }
            }).append(theValue);
            var item = $('<li>').attr('id', BLACKPRE + theValue).append(btn);
            view_panel_ul.append(item);
        }
    }).appendTo(view_panel_bar);
    panel_user.append(view_panel_bar);
    var view_panel_help = $('<div>').addClass('pbt').addClass('cl').append(
        $('<span>').addClass('z').append('添加、删除后请刷新页面.点击名字删除.')
    ).appendTo(panel_user);
    var view_panel_list = $('<div>').css('overflow', 'auto');
    var view_panel_ul = $('<ul>').addClass('ttp bm cl');
    $.each(list, function (i, name) {
        var btn = $('<a>').click(function () {
            if(window.confirm('确定要删除该ID吗?')){
                del(name, 'user');
            }
        }).append(name);
        var item = $('<li>').attr('id', BLACKPRE + name).append(btn);
        view_panel_ul.append(item);
    });
    panel_user.append(view_panel_ul);
    return panel_user;
}


//初始化帖子面板
function initThread(){
    var list = get('thread');
    var panel_thread = $('<div>').attr('id', BLACKPRE + '_panel_thread');
    var view_panel_bar = $('<h3>').css('margin', '5px').append('黑名单帖子:');
    var view_panel_add = $('<input>').css('width', '140px').attr({
        'id': BLACKINPUT + '_thread',
        'placeholder': '帖子ID'
    }).appendTo(view_panel_bar);
    var view_panel_add_btn = $('<button>').append('添加').click(function () {
        var theValue = $('#' + BLACKINPUT + '_thread').val().trim();
        if (theValue != '') {
            add(theValue, 'thread');
            $('#' + BLACKINPUT + '_thread').val('');
            var btn = $('<a>').click(function () {
                if(window.confirm('确定要删除该帖子吗?')){
                    del(theValue, 'thread');
                }
            }).append(theValue);
            var item = $('<li>').attr('id', BLACKPRE + '_thread_' + theValue).append(btn);
            view_panel_ul.append(item);
        }
    }).appendTo(view_panel_bar);
    panel_thread.append(view_panel_bar);
    var view_panel_help = $('<div>').addClass('pbt').addClass('cl').append(
        $('<span>').addClass('z').append('添加、删除后请刷新页面.点击ID删除.')
    ).appendTo(panel_thread);
    var view_panel_list = $('<div>').css('overflow', 'auto');
    var view_panel_ul = $('<ul>').addClass('ttp bm cl');
    $.each(list, function (i, name) {
        var btn = $('<a>').click(function () {
            if(window.confirm('确定要删除该帖子吗?')){
                del(name, 'thread');
            }
        }).append(name);
        var item = $('<li>').attr('id', BLACKPRE + '_thread_' + name).append(btn);
        view_panel_ul.append(item);
    });
    panel_thread.append(view_panel_ul);
    return panel_thread;
}

// 添加黑名单
function add(theValue, type) {
    var list = get(type);
    for (var i = 0; i < list.length; i++) {
        var name = list[i];
        if (name == theValue) {
            return;
        }
    }
    list.push(theValue);
    save(list, type);
}

// 删除黑名单
function del(theValue, type) {
    var list = get(type);
    var newlist = [];
    $.each(list, function (index, name) {
        if (theValue != name) {
            newlist.push(name);
        }
    });
    save(newlist, type);
    if(type == 'user')
        $('#' + BLACKPRE + theValue).remove();
    else
        $('#' + BLACKPRE + '_' + type + '_' + theValue).remove();
}

// 保存黑名单
function save(list, type) {
    if(type == 'user')
        GM_setValue(BLACKLIST, list);
    else
        GM_setValue(BLACKLIST + '_' + type, list);
}

// 获取黑名单列表
function get(type) {
    if(type == 'user')
        return GM_getValue(BLACKLIST, []);
    else
        return GM_getValue(BLACKLIST + '_' + type, []);
}

// 屏蔽帖子
function blackthread() {
    var list = get('user');
    var list_thread = get('thread');
    var tlist = $('tbody[id^="normalthread"]');
    $.each(tlist, function (index, thread) {
        var tname = $($(thread).find('cite>a')[0]).text();
        var tid = $(thread).attr('id');
        $.each(list, function (i, name) {
            if (tname === name) {
                $(thread).hide();
            }
        });
        $.each(list_thread, function(i, name){
            if(tid == 'normalthread_' + name){
                $(thread).hide();
            }
        });
    });
}

// 屏蔽回帖
function blackcomment() {
    var list = get('user');
    var tlist = $('a.xw1');
    $.each(tlist, function (index, thread) {
        var tname = $(thread).text();
        $.each(list, function (i, name) {
            if (tname === name) {
                var div_parent = $(thread).parents('div[id^="post_"]');
                div_parent.children().hide();
                var span = $('<span>').css({
                    'display': 'block',
                    'height': '20px',
                    'text-align': 'center',
                    'border': 'solid 1px'
                }).append('黑名单已隐藏, 这是你不想看到的人的言论, 你就点下去吧.').click(function () {
                    span.hide();
                    div_parent.children('table').show();
                });
                div_parent.append(span);
            }
        });
    });
}
