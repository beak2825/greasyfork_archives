// ==UserScript==
// @name         预告片-字幕组
// @namespace    http://www.zimuzu.io/
// @version      0.3
// @description  自动跳转预告片页面哟~
// @author       You
// @match        *://www.zimuzu.io/*
// @grant        none
// @note            v0.2 中英文都能搜

// @downloadURL https://update.greasyfork.org/scripts/375028/%E9%A2%84%E5%91%8A%E7%89%87-%E5%AD%97%E5%B9%95%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/375028/%E9%A2%84%E5%91%8A%E7%89%87-%E5%AD%97%E5%B9%95%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    var now_url=document.location.href;
    // 获取当前URL
    var url_=now_url.split("/");
    var url_yyets=url_[3];//判断是资源页元素
    if (url_yyets == "resource"){//如果是资源页就获取剧名
        var name= $("div.resource-tit h2").text();//获取h2
        var name_=name.split("《");//分割《
        var name_juming_cn=name_[1].split("》")//分割》
        var name_juming_en=$("div.fl-info ul li strong").html();
        console.log("剧名中文为    ：    "+name_juming_cn[0]);
        //http://www.zimuzu.io/release/trailer?rid=36293 分割取第四个
        var trailer_url="http://www.zimuzu.io/release/trailer?rid="+url_[4];
        console.log("当前id为："+url_[4]);
        window.location.href=trailer_url+"?name_juming_en="+name_juming_en+"?name_juming_cn="+name_juming_cn[0];//跳转
    }
    if(url_[3]=="release"){ //跳转编辑页面
        //添加相关按钮 时光网 豆瓣 优酷 腾讯 搜狐 爱奇艺 B站 秒拍 百度视频
        var get_url=document.location.href;
        var get_url_=get_url.split("name_juming_cn=");//分割得到剧名
        var get_rid_=get_url.split("trailer?rid=");
        var get_rid_done=get_rid_[1].split("?")
        var get_meiju_en=get_url.split("name_juming_en=");
        var get_meiju_en_done=get_meiju_en[1].split("?");
        console.log("rid："+get_rid_done[0]+"name_juming_cn："+get_url_[1]+"name_juming_en："+get_meiju_en_done[0])
        $("a#submit.btn1").after('    <a class="baidu" href="https://www.baidu.com/sf/vsearch?wd='+get_meiju_en_done[0]+" 预告&pd=video"+'" target="_blank">En百度视频</a>    ')
        $("a#submit.btn1").after('    <a class="Bzhan" href="https://search.bilibili.com/all?keyword='+get_meiju_en_done[0]+" 预告"+'" target="_blank">EnB站</a>    ')
        $("a#submit.btn1").after('    <a class="aiqiyi" href="https://so.iqiyi.com/so/q_'+get_meiju_en_done[0]+" 预告"+'" target="_blank">En爱奇艺</a>    ')
        $("a#submit.btn1").after('    <a class="souhu" href="https://so.tv.sohu.com/mts?box=1&wd='+get_meiju_en_done[0]+" 预告"+'" target="_blank">En搜狐</a>    ')
        $("a#submit.btn1").after('    <a class="tengxun" href="https://v.qq.com/x/search/?q='+get_meiju_en_done[0]+"+预告"+'" target="_blank">En腾讯</a>    ')
        $("a#submit.btn1").after('    <a class="youku" href="https://so.youku.com/search_video/q_'+get_meiju_en_done[0]+"+预告"+'" target="_blank">En优酷</a>    ')
        $("a#submit.btn1").after('    <a class="douban" href="https://movie.douban.com/subject_search?search_text='+get_meiju_en_done[0]+"&cat=1002"+'" target="_blank">En豆瓣</a>    ')
        $("a#submit.btn1").after('    <a class="mtime" href="http://search.mtime.com/search/?q='+get_meiju_en_done[0]+'" target="_blank">En时光网</a>    ')
        $("a#submit.btn1").after("<br>按英语搜：")
        $("a#submit.btn1").after('    <a class="baidu" href="https://www.baidu.com/sf/vsearch?wd='+get_url_[1]+" 预告&pd=video"+'" target="_blank">百度视频</a>    ')
        $("a#submit.btn1").after('    <a class="Bzhan" href="https://search.bilibili.com/all?keyword='+get_url_[1]+" 预告"+'" target="_blank">B站</a>    ')
        $("a#submit.btn1").after('    <a class="aiqiyi" href="https://so.iqiyi.com/so/q_'+get_url_[1]+" 预告"+'" target="_blank">爱奇艺</a>    ')
        $("a#submit.btn1").after('    <a class="souhu" href="https://so.tv.sohu.com/mts?box=1&wd='+get_url_[1]+" 预告"+'" target="_blank">搜狐</a>    ')
        $("a#submit.btn1").after('    <a class="tengxun" href="https://v.qq.com/x/search/?q='+get_url_[1]+"+预告"+'" target="_blank">腾讯</a>    ')
        $("a#submit.btn1").after('    <a class="youku" href="https://so.youku.com/search_video/q_'+get_url_[1]+"+预告"+'" target="_blank">优酷</a>    ')
        $("a#submit.btn1").after('    <a class="douban" href="https://movie.douban.com/subject_search?search_text='+get_url_[1]+"&cat=1002"+'" target="_blank">豆瓣</a>    ')
        $("a#submit.btn1").after('    <a class="mtime" href="http://search.mtime.com/search/?q='+get_url_[1]+'" target="_blank">时光网</a>    ')
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
})();