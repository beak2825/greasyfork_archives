// ==UserScript==
// @name         百度贴吧一键发帖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于百度贴吧一键发帖
// @author       codeshif
// @match        http://tieba.baidu.com/*
// @grant        none
// @require      http://cdn.bootcss.com/AlertifyJS/1.11.1/alertify.min.js
// @require      http://cdn.bootcss.com/moment.js/2.22.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/372159/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E4%B8%80%E9%94%AE%E5%8F%91%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/372159/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E4%B8%80%E9%94%AE%E5%8F%91%E5%B8%96.meta.js
// ==/UserScript==

//  http://alertifyjs.com/notifier/position.html

(function() {
//	'use strict';

    //  扫描时间间隔
    var scanTimeInterval = 4 * 1000;
    //  发布时间间隔
    var postTimeInterval = 20 * 1000;

    var webPageInfos = [],
        webUrls = [
//             {name : '大厂五中',url:'http://tieba.baidu.com/f?ie=utf-8&kw=%E5%A4%A7%E5%8E%82%E4%BA%94%E4%B8%AD&fr=search'},
//             {name : '大厂七中',url:'http://tieba.baidu.com/f?ie=utf-8&kw=%E5%A4%A7%E5%8E%82%E4%B8%83%E4%B8%AD&fr=search'}

            { name : '燕郊吧', url : 'http://tieba.baidu.com/f?kw=%D1%E0%BD%BC&fr=ala0&tpl=5#'},
            { name : '新三河市吧', url : 'http://tieba.baidu.com/f?kw=%E6%96%B0%E4%B8%89%E6%B2%B3%E5%B8%82&ie=utf-8'},
            { name : '三河吧', url : 'http://tieba.baidu.com/f?ie=utf-8&kw=%E4%B8%89%E6%B2%B3'},
            { name : '二中吧', url : 'http://tieba.baidu.com/f?ie=utf-8&kw=%E4%BA%8C%E4%B8%AD%E5%90%A7&fr=search'},
            { name : '燕京理工吧', url : 'http://tieba.baidu.com/f?ie=utf-8&kw=%E7%87%95%E4%BA%AC%E7%90%86%E5%B7%A5&fr=search'},
            { name : '大厂吧', url : 'http://tieba.baidu.com/f?ie=utf-8&kw=%E5%A4%A7%E5%8E%82&fr=search'},
            { name : '燕郊生活圈吧', url : 'http://tieba.baidu.com/f?kw=%D1%E0%BD%BC%C9%FA%BB%EE%C8%A6&fr=ala0&tpl=5'},
            { name : '燕郊网城吧', url : 'http://tieba.baidu.com/f?kw=%E7%87%95%E9%83%8A%E7%BD%91%E5%9F%8E&fr=fenter&prequery=%E7%87%95%E9%83%8A%E7%BD%91%E5%9F%8E%E5%90%A7'},
            { name : '华北科技学院', url : 'http://tieba.baidu.com/f?ie=utf-8&kw=%E5%8D%8E%E5%8C%97%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2&fr=search&red_tag=o3016868725'},
            { name : '韩氏蛋糕吧', url : 'http://tieba.baidu.com/f?kw=%E9%9F%A9%E6%B0%8F%E8%9B%8B%E7%B3%95&fr=fenter&prequery=%E9%9F%A9%E6%B0%8F%E8%9B%8B%E7%B3%95%E5%90%A7'}

        ];

    function getBSK(tbs){

        var n = tbs, t = {};
        window._BSK.a("omzVouOACqkNljzDbdOB", {
            IN: n,
            OUT: t
        });

        return t.data;
    }

    function initializeHTML() {

        //	加载样式
        var styles = [
            'https://cdn.bootcss.com/AlertifyJS/1.11.1/css/alertify.min.css',
            'https://cdn.bootcss.com/AlertifyJS/1.11.1/css/themes/default.min.css'
        ];

        for(var i = 0; i < styles.length; i++){
            $(['<link rel="stylesheet" type="text/css" href="',styles[i],'" />'].join('')).appendTo('head');
        }

        //	隐藏无用状态文字
        setInterval(function () {
            $('.poster_draft_status').hide();
        }, 1500);
        //	提前弄好BSK

        if (!window._BSK) {
            $.ajax({
                url: "https://fex.bdstatic.com/bsk/??dknsaZmLdyKfEeIVbKxn_dcc70f7.js,omzVouOACqkNljzDbdOB_af501e9.js",
                cache: !0,
                dataType: "script"
            });
        }


        //	注射发帖按钮
        $('<button class="btn_attention btn_middle post_thread" title="Ctrl+Enter快捷发表" style="float:right">一键发帖</button>').appendTo('.j_floating');

        $('.post_thread').click(function () {

            if($('.post_thread').text() == '一键发帖'){
                lookupForumsAndPostThread();
            }else if($('.post_thread').text() == '一键复制'){

                copythat();
            }
            return false;
        });
    }

    function copythat() {

        $('textarea.x-textarea-copy').remove();

        var length = $('.post-table tbody tr').length;
        var str = [];
        for (var i = 0; i < length; i++) {
            var name = $('.post-table tbody tr:eq('+i+') td:eq(0)').text();
            var date = $('.post-table tbody tr:eq('+i+') td:eq(2)').text();
            var url = $('.post-table tbody tr:eq('+i+') td:eq(4)').text();

            str.push(name + '    ' + date + '    ' + url);
        }

        var html = $('<textarea class="x-textarea-copy" style="position:absolute;top:-9999px;left:-9999px;">'+str.join("\n")+'</textarea>').appendTo('body');
        html[0].select();
        html[0].setSelectionRange(0, html[0].value.length);
        document.execCommand("copy");
        tip('已经复制到剪贴板了哦', 1);
    }

    async function lookupForumsAndPostThread(){

        var title = $('.editor_title.j_title').val();
        var content = UE.utils.html2ubb(test_editor.getContent());
        content = XSS.xssFilter({word:content});

        if($.trim(title) == '' || $.trim(content) == ''){
            tip('标题或内容不能为空');
            return false;
        }

        if (!confirm('您真想要了要发帖？有可能会被封号啊！请用垃圾号做测试哦')) {
            return false;
        }


        $('.post_thread').text('正在扫描中').attr('disabled','disabled');
        //	注射扫描HTML
        $('<h3 style="margin-bottom:10px;color:coral">自动扫描结果</h3><table class="table scan-table" style="margin-bottom:20px;background:#fff;border:1px solid #ddd"><thead><tr><th>贴吧名称</th><th>贴吧ID</th><th>发帖秘钥</th><th>昵称</th></tr></thead><tbody></tbody></table>').prependTo('.j_floating');

        for (let i = 0; i < webUrls.length; i++) {
            var url = webUrls[i].url;
            var name = webUrls[i].name;

            await getForumInfo(url).then(function (data) {
                webPageInfos.push(data);
                //	添加注射HTML
                $([
                    '<tr>',
                    '<td><a target="_blank" href="',url,'" >',data.kw,'</a></td>',
                    '<td>',data.fid,'</td>',
                    '<td>',data.tbs,'</td>',
                    '<td>',data.nick_name,'</td>',
                    '</tr>'
                ].join('')).appendTo('.j_floating table.scan-table tbody');
            });
        }

        //  恢复当前场景值
        await getForumInfo(location.href);

        $('.post_thread').text('正在发帖中');
        //	注射扫描HTML
        $('<h3 style="margin-bottom:10px;color:coral">自动发帖结果</h3><table class="table post-table" style="margin-bottom:20px;background:#fff;border:1px solid #ddd"><thead><tr><th>贴吧名称</th><th>贴吧ID</th><th>发帖时间</th><th>昵称</th><th>帖子地址</th></tr></thead><tbody></tbody></table>').insertAfter('.scan-table');

        for (let i = 0; i < webPageInfos.length; i++) {
            var info = webPageInfos[i];
            await postThread(info.kw, info.fid, info.tbs, info.nick_name, function (data) {
                if(data.err_code == 0){
                    var url = 'http://tieba.baidu.com/p/' + data.data.tid;
                    //	添加注射HTML
                    $([
                        '<tr>',
                        '<td><a target="_blank" href="',info.url,'" >',info.kw,'</a></td>',
                        '<td>',info.fid,'</td>',
                        '<td>',moment().format('YYYY-MM-DD HH:mm:ss'),'</td>',
                        '<td>',info.nick_name,'</td>',
                        '<td><a href="',url,'">',url,'</a></td>',
                        '</tr>'
                    ].join('')).appendTo('.j_floating table.post-table tbody');
                }else{
                    $([
                        '<tr>',
                        '<td><a target="_blank" href="',info.url,'" >',info.kw,'</a></td>',
                        '<td>',info.fid,'</td>',
                        '<td>',moment().format('YYYY-MM-DD HH:mm:ss'),'</td>',
                        '<td>',info.nick_name,'</td>',
                        '<td>发帖失败</td>',
                        '</tr>'
                    ].join('')).appendTo('.j_floating table.post-table tbody');
                }
            },function (data) {
                $([
                    '<tr>',
                    '<td><a target="_blank" href="',info.url,'" >',info.kw,'</a></td>',
                    '<td>',info.fid,'</td>',
                    '<td>',moment().format('YYYY-MM-DD HH:mm:ss'),'</td>',
                    '<td>',info.nick_name,'</td>',
                    '<td>发帖失败</td>',
                    '</tr>'
                ].join('')).appendTo('.j_floating table.post-table tbody');
            });
        }

        $('.post_thread').text('发帖完成').removeAttr('disabled');

        setTimeout(function () {
            $('.post_thread').text('一键复制');
        }, 5000);

    }

    async function getForumInfo(url) {

        return new Promise((resolve, reject) => {
            setTimeout(async () => {

                var data = $(await $.get(url));
                var j = 0;
                for(var i = 0; i < data.length; i++){
                    if(data[i].nodeName.toUpperCase() == 'SCRIPT'){

                        if(j == 1){
                            eval(data[i].innerHTML);
                            break;
                        }
                        j++;
                    }
                }

                resolve({
                    kw : PageData.forum.name,
                    fid : PageData.forum.id,
                    tbs : PageData.tbs,
                    nick_name:PageData.user.name,
                    url : url
                });

            }, scanTimeInterval);
        })

    }

    async function postThread(kw,fid,tbs,nick_name,success_callback,error_callback){

        return new Promise((resolve, reject) => {
            setTimeout(async () => {


                var title = $('.editor_title.j_title').val();
                var content = UE.utils.html2ubb(test_editor.getContent());
                content = XSS.xssFilter({word:content});
                content = content.word;

                if($.trim(title) == '' || $.trim(content) == ''){
                    tip('标题或内容不能为空');
                    return false;
                }

                var url = 'http://tieba.baidu.com/f/commit/thread/add',
                    data = {
                        ie: 'utf-8',
                        kw: kw,
                        fid: fid,
                        tid: 0,
                        vcode_md5:undefined,
                        floor_num:0,
                        rich_text:1,
                        tbs:tbs,
                        content:content,
                        basilisk:1,
                        title:title,
                        prefix:undefined,
                        mouse_pwd:'28,25,17,4,29,29,28,25,33,25,4,24,4,25,4,24,4,25,4,24,4,25,4,24,4,25,4,24,33,28,30,17,27,33,25,26,16,24,4,16,24,24,' + Date.now(),
                        mouse_pwd_t:Date.now(),
                        mouse_pwd_isclick:0,
                        nick_name:nick_name,
                        __type__:'thread',
                        _BSK: getBSK(tbs)
                    };

                await $.ajax(url,{
                    data:data,
                    dataType:'JSON',
                    type:'POST',
                    success:success_callback,
                    error:error_callback
                });


                resolve(true);

            }, postTimeInterval);
        })
    }

    function tip(msg,type) {
        type = type || 0;
        alertify.set('notifier','position', 'bottom-center');
        if(type == 0){
            alertify.error(msg);
        }else{
            alertify.success(msg);
        }
    }


    var XSS = {
        _escapeKeyArray: ["title", "prefix", "kw", "word"],
        initial: function(e) {
            e && e.escapeKeyArray && e.escapeKeyArray.length > 0 && (this._escapeKeyArray = e.escapeKeyArray)
        },
        xssFilter: function(e) {
            var r = $.extend({}, e)
            , a = $.tb.escapeHTML
            , s = this._escapeKeyArray;
            return $.each(s, function(t) {
                var i = s[t]
                , n = e[i];
                void 0 !== n && (r[i] = a(n))
            }),
                r
        }
    }


    // MAIN

    initializeHTML();

})();