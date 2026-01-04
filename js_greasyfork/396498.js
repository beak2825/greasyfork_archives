// ==UserScript==
// @name              SexInSex 阅读器
// @version           0.9.0
// @description       【SexInSex 阅读器】是一款用来浏览SexInSex论坛的油猴插件。
// @author            xpurple
// @license           MIT
// @updateUrl         https://gist.githubusercontent.com/irunay/436f9f1e7156775b719207527d8d3e42/raw/sis.js
// @match             *://sexinsex.net/bbs/*
// @require           https://cdn.bootcss.com/zepto/1.2.0/zepto.js
// @require           https://cdn.bootcss.com/vue/2.6.10/vue.min.js
// @namespace https://greasyfork.org/users/445664
// @downloadURL https://update.greasyfork.org/scripts/396498/SexInSex%20%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/396498/SexInSex%20%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

/*

    //开发调试模式，把依赖注入页面

    var jq_script = document.createElement('script');
    jq_script.src = "https://cdn.bootcss.com/zepto/1.2.0/zepto.js";

    jq_script.onload = function(){
        var vue_script = document.createElement('script');
        vue_script.src = "https://cdn.bootcss.com/vue/2.6.10/vue.js";
        vue_script.onload = function(){
            var sis_script = document.createElement('script');
            sis_script.src = "http://127.0.0.1/sis/sis.js";
            document.head.appendChild(sis_script);
        }
        document.head.appendChild(vue_script);
    }
    document.head.appendChild(jq_script);

*/

var SIS_APP = (function($, Vue) {

    'use strict';

    function init_page(){

        var body_content = document.body.innerHTML;
        var title = $('title').text();

        var doctype = document.implementation.createDocumentType('html', '', '');

        if(document.doctype) {
            document.replaceChild(doctype, document.doctype);
        } else {
            document.insertBefore(doctype, document.childNodes[0]);
        }


        document.open();
        document.write(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                    <link href="https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
                    <title>${title}</title>
                    <style>
                        body{font-size:14px;background:#a2c672; font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti;}
                        .card{margin:1em 0;background-color:#a7ca78}
                        .card-header{font-size:1.25rem;}
                    </style>
                </head>
                <body>
                    <div class="container"><div id="sis_app"></div></div>
                </body>
            </html>
        `);
        document.close();
    }

    function index_data(){

        var data = {
            'forumlist': [],
        };

        $('.forumlist').each(function(i, f){
            var item = {};
            item.sublist = [];
            item.name = $(f).find('h3').first().find('a').text();
            item.link = $(f).find('h3').first().find('a').attr('href');

            $(f).find('th.new').each(function(ii, ff){
                var subitem = {};
                subitem.name = $(ff).find('h2').first().text();
                subitem.link = $(ff).find('h2').first().find('a').attr('href');
                subitem.link = subitem.link.replace(/forum-(\d+)-(\d+)\.html/g,"forumdisplay.php?fid=$1&filter=0&orderby=dateline&ascdesc=DESC&page=$2");
                item.sublist.push(subitem);
            })

            data.forumlist.push(item);
        });

        console.log(data);

        return data;
    }

    function forum_data(){

        var data = {
            'list': [],
            'page':{
                'total': 0,
                'list':[]
            }
        };

        $('.threadlist form table').each(function(i, f){
            if(i < 1){
                return;
            }

            var item = {};
            item.sublist = [];
            item.name = $(f).find('thead.separation b').first().text();

            $(f).find('tbody[id]').each(function(ii, ff){
                var subitem = {};
                var thread_title = $(ff).find('th.hot,th.common,th.lock');
                var thread_author = $(ff).find('td.author');

                if(!thread_title.length) return;

                subitem.name = $(thread_title).find('span[id] a').first().text();
                subitem.link = $(thread_title).find('span[id] a').first().attr('href');

                if ($(thread_title).find('em').length) {
                    subitem.cat = $(thread_title).find('em').text();
                }

                if (!subitem.link) return;

                if(!thread_author.length) {
                    console.error('【thread_author】', thread_author);
                };

                subitem.author = $(thread_author).find('cite a').first().text();
                subitem.authorid = $(thread_author).find('cite a').attr('href').replace(/.*uid=(\d+)/, "$1");
                subitem.pubdate = $(thread_author).find('em').text();

                if (subitem.link.search(/viewthread\.php/) != -1) {
                    subitem.link = subitem.link + '&authorid=' + subitem.authorid;
                } else {
                    subitem.link = subitem.link.replace(/thread-(\d+)-(\d+)-(\d+)\.html/g, "viewthread.php?tid=$1&page=1&authorid=") + subitem.authorid;
                }

                item.sublist.push(subitem);
            })

            data.list.push(item);
        });

        $("div.pages_btns").first().find("div.pages > *").each(function(i, p){
            if ($(p).is("em")) {
                data.page.total = $(p).text().trim();
                return;
            }
            var item = {};
            item.label = $(p).text().trim();

            if ($(p).is("a")) {
                item.link = $(p).attr('href');
            } else {
                item.link = "#"
            }

            if ($(p).is("strong")) {
                item.cur = true;
            } else {
                item.cur = false;
            }

            if (item.label.trim() == '') {
                return;
            }

            data.page.list.push(item);
        })

        return data;
    }

    function thread_data(){
        var data = {
            'list': [],
            'page':{
                'total': 0,
                'list':[]
            }
        };

        data.thread_title = $(".viewthread").first().find('h1').first().text();

        $(".viewthread").each(function(i, t){
            var post_author = $(t).find("td.postauthor > cite").first().text().trim();
            var post_date = $(t).find("td.postcontent .postinfo").text();
            var post_content = $(t).find("td.postcontent div.postmessage div.t_msgfont").first().html();
            var post_num = $(t).find("td.postcontent .postinfo strong").text().trim();
            post_date = post_date.replace(/.*(\d{4}-\d+-\d+ \d+:\d+).*/gs, "$1");

            //非。！】”」…？结尾的不换行
            post_content = post_content.replace(/(?<=.{25,})(?<![\u3002\uff01\u3011\u201d\u300d\u2026\uff1f])\<br\>/mg, '');
            post_content = post_content.replace(/<font([^>]*)>/, '<font>');
            post_content = post_content.replace(/style="([^"]*)"/, '');
            data.list.push({
                'num': post_num,
                'author': post_author,
                'date': post_date,
                'content': post_content,
            })
        })

        $("div.pages_btns").first().find("div.pages > *").each(function(i, p){
            if ($(p).is("em")) {
                data.page.total = $(p).text().trim();
                return;
            }
            var item = {};
            item.label = $(p).text().trim();

            if ($(p).is("a")) {
                item.link = $(p).attr('href');
            } else {
                item.link = "#"
            }

            if ($(p).is("strong")) {
                item.cur = true;
            } else {
                item.cur = false;
            }

            if (item.label.trim() == '') {
                return;
            }

            data.page.list.push(item);
        })
        return data;
    }

    function sis_app(){

        var template = {
            'index_tpl': `
                <div>
                    <div class="card" v-for="item in forumlist">
                        <div class="card-header">
                            <b><a v-bind:href="item.link" >{{ item.name }}</a></b>
                        </div>
                        <div class="card-body">
                            <p v-for="subitem in item.sublist">
                                <a v-bind:href="subitem.link" >{{ subitem.name}}</a>
                            </p>
                        </div>
                    </div>
                </div>
            `,
            'forum_tpl': `
                <div>
                    <div v-for="(item, key) in list">
                        <h4>{{ item.name }}</h4>
                        <hr>
                        <div>
                            <p v-for="(value2, key2) in item.sublist">
                                <a v-bind:href="value2.link" target="_blank"><em v-if="value2.cat">{{value2.cat}}</em>{{value2.name}}</a>
                                <br>
                                <span class="font-italic">{{value2.author}} - {{value2.pubdate}}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <nav aria-label="Pagination">
                  <ul class="pagination">
                    <li class="page-item" v-bind:class="{active: p.cur}" v-for="p in page.list">
                      <a class="page-link" v-bind:href="p.link">{{p.label}} <span v-if="p.cur" class="sr-only">(current)</span> </a>
                    </li>
                  </ul>
                </nav>
            `,
            'thread_tpl': `
                <div>
                    <h5>{{ thread_title }}</h5>
                    <hr>
                    <div>
                        <div class="card" v-for="post in list">
                          <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">{{post.num}} - {{post.author}} - {{post.date}}</h6>
                            <p class="card-text" v-html="post.content"></p>
                          </div>
                        </div>
                    </div>
                    <nav aria-label="Pagination">
                      <ul class="pagination">
                        <li class="page-item" v-bind:class="{active: p.cur}" v-for="p in page.list">
                          <a class="page-link" v-bind:href="p.link">{{p.label}} <span v-if="p.cur" class="sr-only">(current)</span> </a>
                        </li>
                      </ul>
                    </nav>
                </div>
            `
        };

        // http://sexinsex.net/bbs/viewthread.php?tid=7553901&page=1&authorid=15262419
        const routes = {
            '/bbs/index.php': {
                'data': index_data,
                'template': template.index_tpl
            },
            '/bbs/forumdisplay.php': {
                'data': forum_data,
                'template': template.forum_tpl
            },
            '/bbs/viewthread.php': {
                'data': thread_data,
                'template': template.thread_tpl
            }
        };

        var current_uri = window.location.pathname;

        current_uri = current_uri.replace(/thread-.*\.html/, 'viewthread.php');
        current_uri = current_uri.replace(/forum-.*\.html/, 'forumdisplay.php');
        current_uri = current_uri.replace(/^\/bbs\/$/, '/bbs/index.php');

        console.log("current_uri:", current_uri);

        if (!routes[current_uri]) return;

        var v_data = routes[current_uri].data();
        var v_template = routes[current_uri].template;

        console.log("data:", v_data);
        console.log("template:", v_template);

        init_page();

        $("#sis_app").html(v_template);

        var app = new Vue({
            el: '#sis_app',
            data: v_data
        });

    }

    return {
        'init_page': init_page,
        'sis_app': sis_app,
        'forum_data': forum_data,
        'thread_data': thread_data,
    }

})(window.Zepto, window.Vue);

SIS_APP.sis_app();