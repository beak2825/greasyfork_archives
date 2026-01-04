// ==UserScript==
// @name         温州方言数据库音频播放修正
// @namespace    http://kaaass.net/
// @version      0.1
// @description  修正温州方言数据库不能播放音频
// @author       KAAAsS
// @match        http://wzhzy.wzlib.cn/wzh/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/432643/%E6%B8%A9%E5%B7%9E%E6%96%B9%E8%A8%80%E6%95%B0%E6%8D%AE%E5%BA%93%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/432643/%E6%B8%A9%E5%B7%9E%E6%96%B9%E8%A8%80%E6%95%B0%E6%8D%AE%E5%BA%93%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        /*
        模板
        */
        var modal = '<nav class="navbar navbar-default">'+
            '  <div class="container-fluid">'+
            '    <div class="navbar-header">'+
            '      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">'+
            '        <span class="sr-only">Toggle navigation</span>'+
            '        <span class="icon-bar"></span>'+
            '        <span class="icon-bar"></span>'+
            '        <span class="icon-bar"></span>'+
            '      </button>'+
            '      <a class="navbar-brand" href="//wzlib.cn/">温州市图书馆</a>'+
            '    </div>'+
            '    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'+
            '      <ul class="nav navbar-nav">'+
            '        <li class="active"><a href="/">温州话资源库 <span class="sr-only">(current)</span></a></li>'+
            '      </ul>'+
            '    <form action="Result.aspx" method="get" class="navbar-form navbar-right">'+
            '        <div class="form-group">'+
            '            <input name="SearchEdit" type="text" class="form-control" placeholder="输入需要查询的内容">'+
            '            <select name="SearchTypeC" class="form-control">'+
            '                <option>单字</option>'+
            '                <option>词汇</option>'+
            '            </select>'+
            '        </div>'+
            '        <button type="submit" class="btn btn-default">搜索</button>'+
            '    </form>'+
            '    </div>'+
            '  </div>'+
            '</nav>'+
            '<div class="container-fluid text-center" style="margin-top:30px; margin-bottom:40px;">'+
            '  <h1>温州方言数据库检索系统</h1>'+
            '</div>';
        if (location.search === '') {
            modal += '<ol class="breadcrumb" style="width: 85%; margin-left: auto; margin-right: auto; margin-bottom: -15px;">'+
            '  <li><a href="//wzlib.cn/">温州市图书馆</a></li>'+
            '  <li><a href="/">温州话资源库</a></li>'+
            '  <li class="active">温州方言数据库检索系统</li>'+
            '</ol>';
        } else {
            modal += '<ol class="breadcrumb" style="width: 85%; margin-left: auto; margin-right: auto; margin-bottom: -15px;">'+
            '  <li><a href="//wzlib.cn/">温州市图书馆</a></li>'+
            '  <li><a href="/">温州话资源库</a></li>'+
            '  <li><a href="/wzh">温州方言数据库检索系统</a></li>'+
            '  <li class="active">检索结果</li>'+
            '</ol>';
        }
        /*
        引入bootstrap
        */
        function getParam(key) {
            function GetRequest() {
                var url = location.search;
                var theRequest = {};
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    var strs = str.split("&");
                    for(var i = 0; i < strs.length; i ++) {
                        theRequest[strs[i].split("=")[0]]=strs[i].split("=")[1];
                    }
                }
                return theRequest;
            }
            return GetRequest()[key];
        }
        var mode = (getParam('SearchTypeC') === '%E8%AF%8D%E6%B1%87') + 1;
        console.debug('当前请求模式：'+['单字','词汇'][mode - 1]);
        $('head').append('<link href="http://v3.bootcss.com/dist/css/bootstrap.min.css" rel="stylesheet">')
            .append('<link href="data:text/css;charset=utf-8," data-href="http://v3.bootcss.com/dist/css/bootstrap-theme.min.css" rel="stylesheet" id="bs-theme-stylesheet">')
            .append('<style>html, body, * {     font-family: "Microsoft YaHei" ! important; }</style>');
        $.getScript('//cdn.bootcss.com/bootstrap/2.3.2/js/bootstrap.min.js');
        $('br,span').remove();
        $('table').addClass('table').addClass('table-striped').css('width','85%').css('margin-left','auto').css('margin-right','auto');
        $('body').prepend(modal);
        $('.style12').width('220px');
        $('form').addClass('form-inline');
        $('select').addClass('form-control').children('option:eq('+(mode-1)+')').attr('selected','selected');
        $('input[type=text]').addClass('form-control');
        $('input[type=submit]').addClass('btn').addClass('btn-primary');
        /*
        修正音频播放
        */
        function appendAudio($dest, url) {
            $dest.append('<audio controls height="30" width="50"><source src="'+url+'" type="audio/x-wav"><embed height="30" width="50" src="'+url+'"></audio>');
        }
        function getToneEntry(tone) {
            return '&#x02E' + (10 - tone) + ';';
        }
        function replaceEntry(org) {
            org = org.replace(/11|22|33|44|55/g,function(met){return {'11':'1','22':'2','33':'3','44':'4','55':'5'}[met];});
            return org.replace(/1|2|3|4|5/g,function(met){return {'1':getToneEntry(1),'2':getToneEntry(2),'3':getToneEntry(3),'4':getToneEntry(4),'5':getToneEntry(5)}[met];});
        }
        $('.style15').each(function(i, el){
            if (i===0) return;
            $(el).html(replaceEntry($(el).text()));
        });
        $('.style17').each(function(i, el){
            if (i===0) return;
            var url = $(el).children('object').children('param[name=Filename]').val();
            console.debug('解析声音文件：'+url);
            $(el).children().remove();
            appendAudio($(el),url);
        });
    });
})();