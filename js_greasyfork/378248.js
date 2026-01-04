// ==UserScript==
// @name         基本资料-字幕组
// @namespace    http://www.zimuzu.io/
// @version      0.1
// @description  自动跳转基本资料页
// @author       You
// @match        *://www.zimuzu.io/*
// @grant        none
// @note            v0.1 初始 有跳转 一键提交 一键豆瓣搜索 一键缓存

// @downloadURL https://update.greasyfork.org/scripts/378248/%E5%9F%BA%E6%9C%AC%E8%B5%84%E6%96%99-%E5%AD%97%E5%B9%95%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/378248/%E5%9F%BA%E6%9C%AC%E8%B5%84%E6%96%99-%E5%AD%97%E5%B9%95%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    var now_url=document.location.href;
    // 获取当前URL
    var url_=now_url.split("/");
    var url_yyets=url_[3];//判断是资源页元素
    var url_doneedit=url_[5];//doedit 提交页面
    if (url_yyets == "resource"){//如果是资源页就获取剧名
        var name= $("div.resource-tit h2").text();//获取h2
        var name_=name.split("《");//分割《
        var name_juming_cn=name_[1].split("》")//分割》
        var name_juming_en=$("div.fl-info ul li strong").html();
        console.log("剧名中文为    ：    "+name_juming_cn[0]);
        //http://www.zimuzu.io/release/movie/edit?rid=28134 分割取第四个
        var edit_url="http://www.zimuzu.io/release/movie/edit?rid="+url_[4];
        console.log("当前id为："+url_[4]);
        window.location.href=edit_url+"?name_juming_en="+name_juming_en+"?name_juming_cn="+name_juming_cn[0];//跳转
    }
     if(url_doneedit=="doedit"){
         var url_edit_all=$("div.msgLinks a").attr("href");
         var rid_=url_edit_all.split("edit?rid=");
         var rid_done=rid_[1]
         var updata_url="http://www.zimuzu.io/resource/updateCache?rid="+rid_done
        setTimeout(addTop_updata,1000);
     }
    if(url_yyets=="release"){ //跳转基本编辑页面
        //添加相关按钮 豆瓣
        var get_url=document.location.href;
        var get_url_=get_url.split("name_juming_cn=");//分割得到剧名
        var get_rid_=get_url.split("edit?rid=");
        var get_rid_done=get_rid_[1].split("?")
        var get_meiju_en=get_url.split("name_juming_en=");
        var get_meiju_en_done=get_meiju_en[1].split("?");
        console.log("rid："+get_rid_done[0]+"name_juming_cn："+get_url_[1]+"name_juming_en："+get_meiju_en_done[0])
        $("input#douban_curl.btn3").after('    <a class="douban" href="https://movie.douban.com/subject_search?search_text='+get_meiju_en_done[0]+"&cat=1002"+'" target="_blank">En豆瓣</a>    ')
        $("input#douban_curl.btn3").after("按英语搜：")
        $("input#douban_curl.btn3").after('    <a class="douban" href="https://movie.douban.com/subject_search?search_text='+get_url_[1]+"&cat=1002"+'" target="_blank">豆瓣</a>    ')
        //增加一键提交 主演 编剧 导演
                $("input.btn3").after('    <a class="allclick" " target="_blank">一键提交</a>    ')
        $(".allclick").click(function(){
            $("a#actor_submit.bnts_r1").click();
            $("a#writer_submit.bnts_r1").click();
            $("a#director_submit.bnts_r1").click();
                             });
                var updata_url="http://www.zimuzu.io/resource/updateCache?rid="+get_rid_done[0]
        setTimeout(addTop_updata,1000);
    }

    function addStyle(css) { //添加CSS的代码--copy的
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        console.log("CSS已加载");
        return document.insertBefore(pi, document.documentElement);
    }

    function change_ICO() {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'https://www.easyicon.net/download/ico/1230759/32/';
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
})();