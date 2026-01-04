// ==UserScript==
// @name         诚通CT
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  ~~更更完美了
// @author       You
// @match        https://www.ctfile.com/*
// @match        *://www.zimuzu.tv/*
// @match        *://www.zimuzu.io/*
// @grant        none
// @require      https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js
// @note            v0.7 增加rarbg搜索，还有更新缓存功能
// @note            v0.9 修复选择框


// @downloadURL https://update.greasyfork.org/scripts/375029/%E8%AF%9A%E9%80%9ACT.user.js
// @updateURL https://update.greasyfork.org/scripts/375029/%E8%AF%9A%E9%80%9ACT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var now_url=document.location.href;
    var url_=now_url.split("/");
    var url_search=url_[3].split("?");
    var url_yyets=url_[3];//判断元素
    var edit_url="http://www.zimuzu.io/release/resource?rid="+url_[4];
    //资源页面跳转编辑页面
    if(url_search[0]=="search"){//搜索页面跳转
        setTimeout(function(){
            var num_class=document.getElementsByClassName("clearfix search-item");
            if(num_class.length==1){
                var href_end=$(".t.f14").children("a").attr("href");
                var rid_1=href_end.split("/");
                window.location.href="http://www.zimuzu.io/release/resource?rid="+rid_1[2];

                console.log("长度为"+num_class.length);
                console.log("rid为"+rid_1[2]);

            }else{
                console.log("search长度为："+num_class.length+"项目太多无法跳转");
            }
        },1000);
    }else if (url_yyets == "resource"){
        var name= $("div.resource-tit h2").text();//获取h2
        var name_=name.split("《");//分割《
        var name_juming_cn=name_[1].split("》")//分割》
        var name_juming_en=$("div.fl-info ul li strong").html();
        console.log("剧名中文为    ：    "+name_juming_cn[0]);
        //分割取第四个元素ID
        console.log("编辑url ："+edit_url);
        console.log("当前id为："+url_[4]);
        window.location.href=edit_url+"?name_juming_en="+name_juming_en+"?name_juming_cn="+name_juming_cn[0];
    }else if(url_yyets=="release"){
        var get_url=document.location.href;
        var get_url_=get_url.split("name_juming_cn=");//分割得到剧名
        var get_rid_=get_url.split("resource?rid=");
        var get_rid_done=get_rid_[1].split("?")
        var get_meiju_en=get_url.split("name_juming_en=");
        var get_meiju_en_done=get_meiju_en[1].split("?");
        console.log("rid："+get_rid_done[0]+"name_juming_cn："+get_url_[1]+"name_juming_en："+get_meiju_en_done[0])
        $(".resNav").append(    '<a class="rarbg" href="https://rarbgunblocked.org/torrents.php?search='+get_meiju_en_done[0]+"&category%5B%5D=14&category%5B%5D=48&category%5B%5D=17&category%5B%5D=44&category%5B%5D=45&category%5B%5D=47&category%5B%5D=50&category%5B%5D=51&category%5B%5D=52&category%5B%5D=42&category%5B%5D=46"+'" target="_blank">rarbg搜索</a>    ');
        var updata_url="http://www.zimuzu.io/resource/updateCache?rid="+get_rid_done[0]
        setTimeout(addTop_updata,1000);

    }else if(url_yyets == "b"){
        //加载jq后执行语句
        loadScript("https://cdn.bootcss.com/jquery/3.3.1/jquery.js", function(script) {
            addCt();
            addBottonUrl();
            console.log(url_yyets);
            $(".outprint").click(function() {addBottom();});
        });

    }


    function change_ICO() {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'https://i.loli.net/2018/06/02/5b118618404b6.png';
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    function addTop_updata(){
        var DivCheckNodes = document.querySelectorAll("body");
        var perDivNode =DivCheckNodes[0].querySelectorAll("div");
        var NewdivNode = document.createElement("div");//新建div
        NewdivNode.className = "actGotop";
        var aNode=document.createElement("a");
        aNode.href="javascript:;";
        aNode.title="更新缓存";
        NewdivNode.appendChild(aNode);
        DivCheckNodes[0].insertBefore(NewdivNode,perDivNode[0]);
        console.log("加载DIV成功");
        addStyle(".actGotop{position:fixed; _position:absolute; bottom:60px; right:0px; width:150px; height:75px; display:none;}.actGotop a,.actGotop a:link{width:150px;height:195px;display:inline-block; background-color:#41c12f; outline:none;}.actGotop a:hover{width:150px; height:195px; background-color:#ff0000; outline:none;}");
        $(function(){
            //$(window).scroll(function() {
            //	if($(window).scrollTop() >= 0){ //向下滚动像素大于这个值时，即出现小火箭~
            $('.actGotop').fadeIn(300); //火箭淡入的时间，越小出现的越快~
            //}else{
            //	$('.actGotop').fadeOut(300); //火箭淡出的时间，越小消失的越快~
            //}
            //});
            $('.actGotop').click(function(){
                $.ajax({
                    url:updata_url+"&sid="+Math.random(),//加随机可以避免被服务器Ban
                    type:'GET',
                    dataType:'JSON',
                    success: function(data){
                        GLOBAL.ShowMsg('成功刷新缓存');
                        //使右下角变黑好区分是否更新过缓存
                        addStyle(".actGotop{position:fixed; _position:absolute; bottom:30px; right:0px; width:150px; height:75px; display:none;}.actGotop a,.actGotop a:link{width:150px;height:195px;display:inline-block; background-color:#000000; outline:none;}.actGotop a:hover{width:150px; height:195px; background-color:#ff0000; outline:none;}");
                        $('title').text('缓存已更新');
                        change_ICO();
                        $('html').scrollTop(0);
                    }
                });

            }); //火箭动画停留时间，越小消失的越快~
        });
    }
    function addBottonUrl(){
        //底部输出
        $("[readonly]").each(function (i)
                             {
            var all_input = $(this).val();
            if (i % 2 == 1) {
                var url = all_input + "<br>";
                $("body").append(url);
                console.log(url);
            }
            else {
                var juming = all_input + "~";
                console.log(juming);
                $("body").append(juming);
            }
        } )
    }

    function addCt(){
        attr_url();
        var clipboard = new ClipboardJS('.btn');
        clipboard.on('success', function(e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }

    function addStyle(css) { //添加CSS的代码--copy的
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        console.log("CSS已加载");
        return document.insertBefore(pi, document.documentElement);
    }
    function attr_url(){
        $("table tbody tr").each(function(){
            var td = $(this).find("td");
            td.eq(5).empty();//清空DZ论坛
            var button=td.eq(4).html();
            td.eq(5).prepend(button);//复制选择框
            td.eq(5).children("input").attr("name","copy");//修改
            td.eq(5).children("input").attr("type","button");
            td.eq(5).children("input").attr("class","btn");
        });
        setTimeout(function(){
            var url_length= $("input[name^='serialurl']");
            for(var i=0;i<url_length.length;i++){
                // var node=$("input[name^='url']:eq(i)");
                $("input[name^='url']").eq(i).attr("id","check"+i);
                $("input[name^='url']").eq(i).after("<label for='check"+i+"'></label>");
                $("input[name^='url']").eq(i).before("<span>");
                $("input[name^='copy']").eq(i).attr("data-clipboard-text",url_length[i].value);
                //node.attr("data-clipboard-text",  node.attr("value"));
            }
            addStyle("label{display: inline-block;width: 25px;height: 25px;border: 2px solid #ff7e00; margin-left: -8px;} input:checked+label:after {content: ' ';position: absolute;width: 18px;height: 2px; border: 3px solid #2866bd;margin-left: -15px;border-top-color: transparent;border-right-color: transparent; -ms-transform: rotate(-60deg); -moz-transform: rotate(-60deg); -webkit-transform: rotate(-60deg); transform: rotate(-45deg);}");

        },1500);
        addStyle("table tr:hover{background:#73B1E0;color:#FFF;}");
        $("#btn5").remove();
        $("table").prepend("<input type='checkbox' id='btn5' name='chkAll' title='全选/取消' checked='' onclick='selectAll()'>全选/取消");
        $(".list_searchform").append("<input type='button' class='outprint' value='输出所选地址到底部'></>");
    }
    function addBottom()
    {
        console.log("输出地址");
        var urllist="……………………………………分割线………………………………………………<br>";
        var obj=document.fgidlist["url"];
        for (var i=0;i<obj.length;i++)
        {
            if(obj[i].checked){
                urllist +=obj[i].value;
                urllist += "<br>";
            }
        }
        $(".page").append(urllist);
    }
    function loadScript(src, callback) {
        var script = document.createElement('script'),
            head = document.getElementsByTagName('head')[0];
        script.type = 'text/javascript';
        script.charset = 'UTF-8';
        script.src = src;
        if (script.addEventListener) {
            script.addEventListener('load', function () {
                callback();
            }, false);
        } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function () {
                var target = window.event.srcElement;
                if (target.readyState == 'loaded') {
                    callback();
                }
            });
        }
        head.appendChild(script);

    }
})();