// ==UserScript==
// @name         Bug网站优化
// @namespace    gxlfqy
// @version      0.3.15
// @description  只用来显示解决版本
// @author       gxlfqy
// @match        http://10.1.51.251/zentao/bug-view-**.html**
// @match        http://10.1.51.188:8383/bug-view-**.html**
// @match        http://10.1.51.251/zentao/story-view-**.html
// @match        http://10.1.51.188:8383/story-view-**.html
// @match        http://10.1.51.251/zentao/bug-browse**.html
// @match        http://10.1.51.188:8383/bug-browse**.html
// @match        http://10.1.51.251/zentao/testcase-browse**.html
// @match        http://10.1.51.188:8383/testcase-browse**.html
// @icon         http://10.1.51.251/zentao/favicon.ico
// @grant        none
// @note         22-12-27 0.3.15      添加搜索间隔时间，100毫秒请求一次，新增进度条初始化
// @note         22-12-27 0.3.14      新增Bug标题、备注查询支持
// @note         22-12-27 0.3.13      修复查询进度问题
// @note         22-03-19 0.3.12      新增用例内容正则查询（搜索窗口共用）
// @note         22-03-18 0.3.11      需求详细内容换行符显示
// @note         22-03-12 0.3.10      Bug搜索Id去重，查询清除上次结果
// @note         22-03-12 0.3.9       Bug内容正则搜索功能新增进度显示
// @note         22-03-12 0.3.8       Bug内容正则搜索功能响应回车事件
// @note         22-03-12 0.3.7       新增Bug内容正则搜索功能
// @note         22-03-11 0.3.6       处理需求页面返回按钮链接错误问题
// @note         22-03-11 0.3.5       需求关联用例异步刷新，追加新窗口打开按钮
// @note         22-03-03 0.3.4       修复关联用例弹窗事件丢失问题
// @note         22-03-03 0.3.3       新增需求中关联用例的优先级显示
// @note         22-03-02 0.3.2       处理因为引入不同版本的jQ库导致弹窗无法自动关闭的Bug
// @note         22-03-02 0.2.1       新增主干版本的显示支持，处理获取版本名称失败导致的脚本崩溃
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440739/Bug%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440739/Bug%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // #region define
    const fmsg = {
        active:0x0001,
        cal_result:0x0002,
        reg_result:0x0004,
        html_request:0x0008,
    }
    // #endregion
    $(document).ready(function (){
        bug_url();
        story_url();
        bug_search();
        testcase_seach();
    });
    function show_msg(msg,opt=0x8888) {
        let show = false;
        let filder = (
            fmsg.cal_result |
            fmsg.reg_result
        );
        if (opt & filder) {
            alert(msg);
        }
    }
    function readUrl(url) {
        let text = ""
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('GET',url,false);
        xmlHttpRequest.send();
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){
            text = xmlHttpRequest.responseText;
        }
        return text;
    }
    function readUrl_a(url,action) {
        let text = ""
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onload = function(e) {
            if(this.status == 200||this.status == 304){
                action(this.responseText);
            }
        }
        xmlHttpRequest.open('GET',url,true);
        xmlHttpRequest.send();
    }
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        query = decodeURI(query)
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    function openHTML(html,wd='height=500, width=500') {
        let OpenWindow = window.open("", "newwin", wd + ",toolbar=no ,scrollbars=" + scroll + ",menubar=no");
        //写成一行
        OpenWindow.document.write(html);
        OpenWindow.document.close();
    }
    function bug_url() {
        if (/bug-view-\d+\.html/.exec(document.location.pathname) == null) {
            return;
        }
        show_msg('Bug版本插件激活', fmsg.active)
        $(".history-changes").each(function(i,e){
            let text = e.innerText
            show_msg(text)
            let buildId = getLastBuildId(text);
            if (buildId != null) {
                show_msg("存在解决Id：" + buildId);
                let buildText = buildId2buildText(buildId);
                show_msg("存在解决版本：" + buildText);
                e.outerHTML = e.outerHTML + '解决版本：' + buildText;
            }
            let refIds = getRefBuildIds(text);
            if (refIds != null) {
                show_msg(text)
                show_msg("存在影响版本Ids：" + refIds);
                let buildTextList = []
                refIds.split(',').forEach(function(item){
                    show_msg("存在影响版本Id：" + item);
                    buildTextList.push(buildId2buildText(item));
                });
                let buildText = buildTextList.join(', ');
                show_msg("存在影响版本：" + buildText);
                e.outerHTML = e.outerHTML + '影响版本：' + buildText;
            }
        });
        let newHtml = $(this).html();
        let reg_str = getQueryVariable('search');
        let reg = new RegExp(reg_str);
        let ret = reg.exec(newHtml)
        if (ret != null) {
            newHtml = newHtml.replace(keyword, '<span style="color:#ff6700;">' + keyword + '</span>');
            $(this).html(newHtml);
        }
        $('.files-list a[target="_blank"]').each(function(i,e) {
            e.parentNode.insertAdjacentHTML('beforeend', '<a target="_blank" href="' + e.href + '">↗</a>')
        });
        function buildId2buildText(id) {
            if (id == "trunk")
                return "主干";
            let buildUrl = "/zentao/build-view-" + id + ".html"
            let html = readUrl(buildUrl);
            show_msg(html,fmsg.html_request);
            let reg = new RegExp(buildUrl + '[^>]+>([^<]+)<');
            let ret = reg.exec(html);
            if (ret == null)
                return null;
            return ret[1];
        }
        function getLastBuildId(text) {
            let ret = /解决版本.*新值[^"]*"([^"]+)/.exec(text)
            if (ret == null)
                return null;
            return ret[1];
        }
        function getRefBuildIds(text) {
            let ret = /影响版本.*新值[^"]*"([^"]+)/.exec(text)
            if (ret == null)
                return null;
            return ret[1];
        }
    }
    function story_url() {
        if (/story-view(-\d+)+\.html/.exec(document.location.pathname) == null)
            return;
        show_msg('需求插件激活', fmsg.active)
        $('a[href="#legendRelated"]').click()
        $("#legendRelated a").each(function(i,e){
            let ret = aj_get_pri_html(e.href, function(ret){
                if (ret == null)
                    return;
                show_msg(ret);
                e.innerHTML = ret + e.innerHTML
                e.parentNode.insertAdjacentHTML('beforeend', '<a target="_blank" href="' + e.href + '">↗</a>')
            });
        });
        function aj_get_pri_html(url,then) {
            let html = readUrl_a(url, function(html){
                if (html == null)
                    return null;
                let reg = new RegExp('<span.*label-pri.*\/span>')
                let ret = reg.exec(html)
                let ret_str = null;
                if (ret != null)
                    ret_str = ret[0];
                then(ret_str);
            });
        }
        // 换行符显示
        $(".article-content br").each(function(i,e){e.outerHTML = "↵" + e.outerHTML})
        $(".article-content p").each(function(i,e){e.innerHTML = e.innerHTML + "↓"})
        $('.article-content').each(function(i,e){
            let copy_e_title = 'gx-text-'+i;
            e.parentNode.insertAdjacentHTML('beforeend', `<a name="${copy_e_title}" style="display: block;text-align:right"><u>查看文本</u></a>`);
            $(`a[name="${copy_e_title}"]`)[0].onclick = function() {
                let e = $('.detail-content', $(`a[name="${copy_e_title}"]`)[0].parentNode)[0];
                let text = e.innerText;
                text = text.replaceAll('↵','');
                text = text.replaceAll('↓\n','');
                text = text.replaceAll('↓','');
                openHTML(
                    `<html><head/><body><div><textarea style="width: 95vw; height: 95vh;">${text}</textarea></div></body></html>`,
                    'top=300, left=500, height=500, width=500'
                );
            }
        });
    }
    function bug_search() {
        if (/bug-browse-.*\.html/.exec(document.location.pathname) == null) {
            return;
        }
        show_msg('Bug视图搜索功能激活', fmsg.active);
        add_search_btn(function(){
            show_bug_search_ui();
        });
        function add_search_btn(action) {
            let btn_html = '<a id="gx-search" class="btn btn-secondary"><i class="icon icon-search"></i>高级搜索</a>'
            $('#mainMenu .pull-right').each(function(i,e){
                e.innerHTML = btn_html + e.innerHTML;
            });
            $("#gx-search")[0].onclick = action;
        }
        function get_bug_brower_ids() {
            let a = []
            $("tbody .c-id").each(function(i, e){a.push(e.innerText.trim())})
            return Array.from(new Set(a));
        }
        function show_bug_search_ui() {
            let bug_ids = get_bug_brower_ids()
            let web_local = 'http://10.1.51.251/zentao/'
            show_search_ui(`
                var bug_ids = [${bug_ids}];
                var web_local = '${web_local}'
                readUrl = ${readUrl};
                readUrl_a = ${readUrl_a};
                $(document).ready(function () {
                    sui.process.set(0, ${bug_ids.length});
                });`, function() {
                let reg_str = sui.sc_input.get_text();
                let index = 0;
                let bug_ids_length = bug_ids.length;
                sui.result.reset();
                // alert('查询：' + reg_str)
                bug_ids.forEach(function(e) {
                    let link = web_local + 'bug-view-' + e + '.html'
                    let reg = new RegExp(reg_str)
                    // alert('查询：' + link)
                    index = index + 1;
                    let cur_index = index;
                    setTimeout(function() {
                        aj_match_bug_view(e, link, reg, function(id,title) {
                            // alert('找到一个')
                            sui.result.add(id + ': '+ title ,web_local + 'bug-view-' + id + '.html')
                            sui.process.set(cur_index, bug_ids_length);
                        }, function() {
                            sui.process.set(cur_index, bug_ids_length);
                        });
                    }, 100);
                });
                function aj_match_bug_view(id, url, reg, onsucceed, onfail) {
                    readUrl_a(url, function(html) {
                        let info = get_bug_info(html)
                        // alert('Bug内容及注释：' + text)
                        let ret = reg.exec(info.title);
                        if (ret != null) {
                            onsucceed(id, info.title);
                            return;
                        }
                        ret = reg.exec(info.content);
                        if (ret != null) {
                            onsucceed(id, info.title);
                            return;
                        }
                        for (const comment of info.comments) {
                            ret = reg.exec(comment);
                            if (ret != null) {
                                onsucceed(id, info.title);
                                return;
                            }
                        }
                        onfail();
                    });
                }
                function get_bug_info(html) {
                    let el = $('<div></div>');
                    el.html(html);
                    let title = $('.page-title .text', el)[0].innerText
                    let content = $('div .detail .detail-content', el)[0].innerText
                    let comments = []
                    $('div .detail .detail-content .comment-content', el).each(function(i,e) {
                        comments.push(e.innerText);
                    })
                    let ret = {
                        title: title,
                        content: content,
                        comments: comments
                    }
                    return ret;
                }
            });
        }
    }
    function testcase_seach() {
        if (/testcase-browse-.*\.html/.exec(document.location.pathname) == null) {
            return;
        }

        show_msg('Bug视图搜索功能激活', fmsg.active);
        add_search_btn(function(){
            show_testcase_search_ui();
        });
        function add_search_btn(action) {
            let btn_html = '<a id="gx-search" class="btn btn-secondary"><i class="icon icon-search"></i>高级搜索</a>'
            $('#mainMenu .pull-right').each(function(i,e){
                e.innerHTML = btn_html + e.innerHTML;
            });
            $("#gx-search")[0].onclick = action;
        }
        function get_testcase_brower_ids() {
            let a = []
            $("tbody .c-id").each(function(i, e){a.push(e.innerText.trim())})
            return Array.from(new Set(a));
        }
        function show_testcase_search_ui() {
            let bug_ids = get_testcase_brower_ids()
            let web_local = 'http://10.1.51.251/zentao/'
            show_search_ui(`
                var bug_ids = [${bug_ids}];
                var web_local = '${web_local}'
                readUrl = ${readUrl};
                readUrl_a = ${readUrl_a};
                $(document).ready(function () {
                    sui.message.set_msg("在选中的用例中查询");
                    sui.process.set(0, ${bug_ids.length});
                });`,function() {
                let reg_str = sui.sc_input.get_text();
                let index = 0;
                let bug_ids_length = bug_ids.length;
                // alert('查询：' + reg_str)
                sui.result.reset();
                bug_ids.forEach(function(e) {
                    let link = web_local + 'testcase-view-' + e + '.html'
                    let reg = new RegExp(reg_str)
                    // alert('查询：' + link)
                    index = index + 1;
                    let cur_index = index;
                    setTimeout(function() {
                        aj_match_testcase_view(e, link, reg, function(id,title) {
                            // alert('找到一个')
                            sui.result.add(id + ': '+ title ,web_local + 'testcase-view-' + id + '.html')
                            sui.process.set(cur_index, bug_ids_length);
                        }, function() {
                            sui.process.set(cur_index, bug_ids_length);
                        });
                    }, 100);
                })
                function aj_match_testcase_view(id, url, reg, onsucceed, onfail) {
                    readUrl_a(url, function(html) {
                        let info = get_testcase_info(html)
                        // alert('用例内容：' + info.content)
                        let ret = reg.exec(info.content)
                        if (ret != null) {
                            onsucceed(id, info.title);
                        } else {
                            onfail();
                        }
                    });
                }
                function get_testcase_info(html) {
                    let el = $('<div></div>');
                    el.html(html);
                    let title = $('.page-title .text', el)[0].innerText
                    let content_list = []
                    $('#steps td', el).each(function(i,e) {
                        content_list.push(e.innerText)
                    });
                    let content = content_list.join('\n');
                    let ret = {
                        title: title,
                        content: content
                    }
                    return ret;
                }
            });
        }
    }
    function show_search_ui(loadjs, do_search, wnd_opt='top=300, left=500, height=600, width=950') {
        let html =
`<html>
<head>
    <title>Search</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
    <script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
    <script>
    function init() {
        const sui = {
            result: {
                add: function(text,url) {
                    let il_html = '<li><a target="_blank" href="'+ url + '">' + text + '</a></li>'
                    let ul = document.getElementById('result')
                    let li = document.createElement("li");  //创建li节点
                    li.innerHTML = il_html;
                    ul.appendChild(li);  //将li加入ul
                },
                reset: function() {
                    $('#result')[0].innerHTML = '';
                }
            },
            sc_input: {
                search_input_keydown: function() {
                    //按下回车键
                    if(event.keyCode != 13) {
                        return;
                    }

                    do_search();
                },
                get_text: function() {
                    return $('#search').val();
                },
                get_reg: function() {
                }
            },
            process: {
                set: function(i,l) {
                    $('#process')[0].innerText = i + '/' + l;
                }
            },
            message: {
                set_msg: function(msg) {
                    $('#message')[0].innerText = msg;
                }
            }
        }

        ${loadjs}
        do_search = ${do_search}
        $(document).ready(function () {
            $("#search")[0].onkeydown = sui.sc_input.search_input_keydown;
            $("#search_btn")[0].onclick = do_search;
        });
    }
    init();
    </script>
</head>
<body>
    <div class="container-fluid position-absolute top-0 start-50 translate-middle-x">
        <p id="message">在选中的Bug中查询</p><p id="process"></p>
        <div class="row py-3 justify-content-center align-items-top">
            <div class="col-8">
                <input id="search" class="form-control rounded-pill" type="text" name="q">
                <!-- <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="is-reg">
                    <label class="form-check-label" for="flexSwitchCheckDefault">正则表达式</label>
                </div> -->
            </div>
            <div class="col-auto">
                <input id="search_btn" type="button" class="btn btn-primary" value="查询">
            </div>
        </div>
        <div>
            <ul id="result">
            </ul>
        </div>
    </div>
</body>
</html>`
        openHTML(html, wnd_opt);
    }
})();
