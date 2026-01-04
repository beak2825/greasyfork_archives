// ==UserScript==
// @name         好阅读
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  适用手机和PC的阅读
// @author       wangflove
// @match        http1://*/*
// @match        https1://*/*
// @match        https://www.biquyun.com/*
// @match        https://m.biquyun.com/*
// @grant        GM_log
// @require        https://cdn.staticfile.org/juicer/0.6.15/juicer-min.js
// @require        https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381836/%E5%A5%BD%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/381836/%E5%A5%BD%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

//include *



(function() {
    'use strict';

    function novel(){
        this.allhtml;
        this.title;
        this.content;
        this.list;
        this.temp_list=new Array();
        this.pre_page;
        this.next_page;
        this.tolist;
        this.islist = false;
        this.iscontent = false;
        this.html;
        this.csscode;
        this.mode_word;
        this.list_temp;
        this.content_temp;
        this.current_page_num=0;
        this.init_url;
    }

    novel.prototype = {
        constructor: novel,
        init:function(init_url=''){
            if(init_url==''){
                this.allhtml = $(":root").html();
                this.title = $("h1").text();
                this.content =$("[id*='content']").html();
                this.content = this.stripscript(this.content);
                this.list = $("[id*='list'] a[href$='html']");
            }else{
                //首次之外载入
                GM_log("||||"+init_url);
                this.init_url=init_url;
                GM_log("||||"+this.init_url);
                this.allhtml=this.pre_loadNext(this.init_url);
                this.title = $(this.allhtml).find("h1").text();
                this.content =$(this.allhtml).find("[id*='content']").html()
                this.content = this.stripscript(this.content);
                this.list = $(this.allhtml).find("[id*='list'] a[href$='html']");
                GM_log(this.allhtml);
            }
        },
        list_or_content:function(){
            if(this.list.length>0 && this.title.length>0){
                this.islist = true;
                //GM_log("列表页面：");
                //GM_log("小说名称："+title);
                GM_log(this.list.length);
                //for(var i=0;i<list.length;i++){
                //temp_list[i] = list[i];
                //GM_log(list[i]);
                //GM_log(list.tolocalString())
                //}
                //list = temp_list;
                $(":root").html("");
            }else if(this.content.length>0 && this.title.length>0){
                this.iscontent = true;
                //GM_log("正文页面：");
                //GM_log("文章标题："+title);
                //GM_log("内容"+content.length+"："+content);

                this.pre_page = this.allhtml.match("<\s*a[^>]*>上一章<\s*/\s*a>|<\s*a[^>]*>上一页<\s*/\s*a>");
                //alert(this.pre_page)
                //再处理，获取到href值。此处有大坑！！！！！
                //alert( typeof this.pre_page[0])
                this.pre_page = $(this.pre_page[0]).attr("href");
                //alert( typeof this.pre_page)

                this.next_page = this.allhtml.match("<\s*a[^>]*>下一章<\s*/\s*a>|<\s*a[^>]*>下一页<\s*/\s*a>");
                this.next_page = $(this.next_page[0]).attr("href");

                this.tolist = this.allhtml.match("<\s*a[^>]*>回目录<\s*/\s*a>|<\s*a[^>]*>章节列表<\s*/\s*a>");
                this.tolist = this.tolist=='' ? $(this.tolist[0]).attr("href"):'';

                GM_log("上一章："+this.pre_page);
                GM_log("回目录："+this.tolist);
                GM_log("下一章："+this.next_page);
                $(":root").html("");
            }
        },
        render_page:function(){
            var list_data={
                name:[this.title],
                list:this.list,
            };

            var content_data={
                name:[this.title],
                content:[this.content],
                pre_page:[this.pre_page],
                tolist:[this.tolist],
                next_page:[this.next_page]
            };

            this.get_template();

            //console.log(list_data)
            if (this.islist ==true){
                this.html=juicer(this.list_temp,list_data); //得到渲染结果，需要放到DOM元素中才能在页面中显示
                $(":root").html(this.html);
            }

            if(this.iscontent == true){
                this.html=juicer(this.content_temp,content_data); //得到渲染结果，需要放到DOM元素中才能在页面中显示
                $(":root").html(this.html);
                this.mode_word = $("#mode").html();
                //过滤其它标签
                $("#content ul,#content div").remove();
                //处理阅读模式
                if(localStorage.getItem("read_mode")=='night' && this.mode_word=='白模式'){
                    this.mode_change($("#mode"));
                    //GM_log("当前阅读模式："+localStorage.getItem("read_mode"));
                }
            }
        },
        get_template:function(){
            this.list_temp =
                "<div id='list'><ul>"+
                "   {@each list as item,index}"+
                "          <li><a href='${item.href}' index='${index}'>${item.text}</a></li>"+
                "            {@if index=list[0].length-6}"+
                "              {@break}"+
                "             {@/if}"+
                "   {@/each}"+
                " </ul></div>";
            this.content_temp =
                "<html><head><title>${name}</title><meta name='viewport' content='width=device-width, initial-scale=1.0,maximum-scale=2.0, minimum-scale=1.0,user-scalable=yes'></head><body><div id='page-1'>"+
                "<style type='text/css'>body{background-color: #f3f2ee;}h1{color:#666;background-color:#F3F2EE;font-size:1.5em;padding:1em;margin:0;border-bottom:1px solid #efefef}.nav{color:#ff0000;padding;2em;margin-bottom:15px;text-align:center;float:right;position:fixed;bottom:5em;right:0.5em;}#content{color:#666;background-color:#F3F2EE;line-height:1.8em;font-size:1.2em;padding:2em}.night{background-color:#2d2d2d!important;color:#939392!important}</style>"+
                "<h1>${name}</h1><div class='nav'><a href='${pre_page}'>上一章</a><br><a href='${tolist}'>回目录</a><br><a href='${next_page}'>下一章</a><br><br><span id='mode'>白模式</span><div id='nextpage'>手动下一站</div></div>"+
                "<div id='content'>$${content}</div>"+
                "</div></body>";
        },
        //过滤JS脚本
        stripscript:function (s) {
            return s.replace(/<script.*?>.*?<\/script>/ig, '');
        },

        //改变模式操作
        mode_change:function (obj){
            $("#content").toggleClass("night");
            $("h1").toggleClass("night");
            if($(obj).html()=='白模式'){
                $(obj).html("黑模式");
                this.set_mode("night");
                //GM_log("阅读模式："+localStorage.getItem("read_mode"));
            }else if($(obj).html()=='黑模式'){
                $(obj).html("白模式");
                this.set_mode("day");
                //GM_log("阅读模式："+localStorage.getItem("read_mode"));
            }
        },

        //设置模式数据
        set_mode:function (vmode){
            //GM_log("设置阅读模式："+vmode);
            if(vmode){
                localStorage.setItem("read_mode", vmode);
            }else{
                localStorage.removeItem("read_mode");
            }
        },

        //预加载下一章
        pre_loadNext:function (nextUrl){
            $.get(nextUrl,function(data){
                GM_log("下一章为："+nextUrl);
                GM_log("下一章为："+this.init_url);
                //this.allhtml=data;
                return data;
            },
                  "html")
        }

    }

    //使用对象处理页面
    var N= new novel();
    N.init();
    N.list_or_content();
    N.render_page();

    $("#mode").click(function(){
        N.mode_change(this);
    });

    $("#nextpage").click(function(){
        //alert(N.next_page);
        N.init(N.next_page);
        N.list_or_content();
        N.render_page();
    });

})();