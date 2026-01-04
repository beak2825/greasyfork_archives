// ==UserScript==
// @name         b站视频外链【私人】
// @namespace    http://tampermonkey.net/
// @version      2.92
// @description  开启后，进入B站视频页面，在视频标题附近，单击获取外链按钮。即可复制1080P画质的外链frame到剪贴板,同时新增封面链接
// @author       月离
// @match        *://*.bilibili.com/*
// @exclude      *://*.yuelili.com/*

// @grant        GM_setClipboard
// @grant          GM_addStyle
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/402285/b%E7%AB%99%E8%A7%86%E9%A2%91%E5%A4%96%E9%93%BE%E3%80%90%E7%A7%81%E4%BA%BA%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/402285/b%E7%AB%99%E8%A7%86%E9%A2%91%E5%A4%96%E9%93%BE%E3%80%90%E7%A7%81%E4%BA%BA%E3%80%91.meta.js
// ==/UserScript==


var user_mode = 0; //如果是普通用户，把1改成0即可，默认是1
var real_mode = 1; //默认真实外链是同时获取真实链接+普通链接，如果想只获取真实链接，请改为0，默认是1
var list_mode = 1; //如果不需要批量获取列表，改成0即可，默认是1
var jiexi_mode = 1 //如果需要解析列表（也就是普通视频列表）改为1即可，默认是1
var name_mode =1 //如果链接想带名字 则改为1,不带则改为0.默认为1

var pos_left = 50;//按钮默认位置，左(单位 像素）
var pos_top =135; //按钮默认位置，上

var width = '100%';//默认插入的宽度，可以自己改
// var height ='660px';已删除高度设置，建议自己后台改。用个width=100%自适应就行


/* 其他说明

*1.需要开启高清视频的话
-在网站插入css(用于把真实链接产生的视频隐藏掉，高度可以自己设置

.video_real {
display: none;
height:650px
}

*2.开启月离的万事屋脚本


*2.86
新增获取所有链接（解后缀）
*/


function get_url(){

    var curr_url = window.location.href;
    var btn_get_playlist=document.createElement("button2");
    var btn_get_playlist2=document.createElement("button2");
    if (curr_url.indexOf("medialist") + 1){
        var playlist_node=document.getElementById("app");


        var txt_playlist =document.createTextNode("普通列表");
        var txt_playlist2 =document.createTextNode("真实列表");
        btn_get_playlist.appendChild(txt_playlist);
        btn_get_playlist2.appendChild(txt_playlist2);
        playlist_node.appendChild(btn_get_playlist);
        playlist_node.appendChild(btn_get_playlist2);
        btn_get_playlist.style.cssText = 'position: absolute;;left:650px;top:110px;width: 80px;height: 20px;text-align: center;'
        btn_get_playlist2.style.cssText = 'position: absolute;;left:750px;top:110px;width: 80px;height: 20px;text-align: center;'
        var playlist_box = document.querySelectorAll(".player-auxiliary-playlist-list > div");

    }

    btn_get_playlist.onclick =function(){
        var playlist_box = document.querySelectorAll(".player-auxiliary-playlist-list > div");
        var copyListText1 = "";
        for(var i = 0; i < playlist_box.length; i++){
            var playlist_title
            if (name_mode == 1){
            playlist_title = playlist_box[i].innerText.split("\n")[0] + '$';
            }else{
            playlist_title = ''}
            var playlist_dat = playlist_box[i].dataset
            console.log(playlist_dat)
            copyListText1 = copyListText1 + playlist_title + 'https://player.bilibili.com/player.html?aid=' + playlist_dat.aid +  '&bvid=' + playlist_dat.bvid + '&cid=' + playlist_dat.cid + '&page='+ (i+1) + '&high_quality=1 allowfullscreen="allowfullscreen"' + "\n"
        }
        GM_setClipboard(copyListText1.slice(0,-1))
    }

    btn_get_playlist2.onclick =function(){
        var playlist_title
        var playlist_box = document.querySelectorAll(".player-auxiliary-playlist-list > div");
        var copyListText2 = "";
        for(var i = 0; i < playlist_box.length; i++){
            if (name_mode == 1){
            playlist_title = playlist_box[i].innerText.split("\n")[0] + '$';
            }else{
            playlist_title = ''}
            var playlist_dat = playlist_box[i].dataset
            console.log(playlist_dat)
            copyListText2 = copyListText2 + playlist_title + "https://www.bilibili.com/blackboard/html5player.html?bvid=" + playlist_dat.bvid +  "&p=" + (i+1) + ' allowfullscreen="allowfullscreen"\n'
        }
        GM_setClipboard(copyListText2.slice(0,-1))
    }




    var btn_get_url1=document.createElement("button2");
    var btn_get_url2=document.createElement("button2");
    var btn_get_url_jiexi=document.createElement("button2");
    var btn_get_url_list1=document.createElement("button2");
    var btn_get_url_list2=document.createElement("button2");
    var btn_get_url_list_jiexi=document.createElement("button2");

    var btn_get_thumbnail=document.createElement("button2");


    var txt =document.createTextNode("单普");
    var txt2 =document.createTextNode("单真");
    var txt_jiexi =document.createTextNode("单解");
    var txt_list1 =document.createTextNode("列普");
    var txt_list2 =document.createTextNode("列真");
    var txt_list_jiexi =document.createTextNode("列解");
    var txt_thumb=document.createTextNode("封面");


    btn_get_url1.appendChild(txt);
    btn_get_url2.appendChild(txt2);
    btn_get_url_jiexi.appendChild(txt_jiexi);
    btn_get_url_list1.appendChild(txt_list1);
    btn_get_url_list2.appendChild(txt_list2);
    btn_get_url_list_jiexi.appendChild(txt_list_jiexi);
    btn_get_thumbnail.appendChild(txt_thumb);

GM_addStyle();
        var video_node=document.createElement("div");
    video_node.className="yll-bili";



document.body.insertBefore(video_node, document.body.firstElementChild);




    //添加成div对象的孩子
    video_node.appendChild(btn_get_url1);
    video_node.appendChild(btn_get_url2);
    video_node.appendChild(btn_get_url_jiexi);
    video_node.appendChild(btn_get_url_list1);
    video_node.appendChild(btn_get_url_list2);
    video_node.appendChild(btn_get_url_list_jiexi);
    video_node.appendChild(btn_get_thumbnail);



    var list_box = document.querySelectorAll(".list-box li");
    var currentUrl = window.location.pathname;

    var page_num,page_n;
    var content_url,content_url2
    function get_page_num(){
        var page_id = document.querySelector("#multi_page > div.cur-list > ul > li.on > a > div > div.link-content > span.page-num")
        if (page_id ==null){
            page_num= 1;
        }else{
            page_n = page_id.textContent;
            page_num=page_n.slice(1,);
        }
        return page_num
    }

    var out_text
    var guide_text
    if (user_mode== 1){
        out_text = '[out_to_bili]https://www.bilibili.com/video/' +bvid +'[/out_to_bili]' + '\n';
        guide_text = '[out_to_guider]https://www.yuelili.com/user-guide/[/out_to_guider]' + '\n';
    }else{
        out_text =""
        guide_text=""
    }


    btn_get_url1.onclick =function(){
        page_num = get_page_num()
        content_url = '<div class="video_src"><iframe src="https://player.bilibili.com/player.html?bvid=' + bvid + '&page='+ page_num +'&high_quality=1 width="'+ width + '" allowfullscreen="allowfullscreen"> </iframe></div>';
        GM_setClipboard(content_url,'text');
    }



    btn_get_url2.onclick =function(){
        page_num = get_page_num()
        if (real_mode ==1){
        content_url = '<div class="video_src"><iframe src="https://player.bilibili.com/player.html?bvid=' + bvid + '&page='+ page_num +'&high_quality=1" width="'+ width + '" allowfullscreen="allowfullscreen"></iframe></div>' +'\n';
        }else{
        content_url = ''
        }
        content_url2 = '<div class="video_real"><iframe src="https://www.bilibili.com/blackboard/html5player.html?bvid=' + bvid +  "&p=" +page_num + '" allowfullscreen="allowfullscreen"></iframe></div>';
        GM_setClipboard(out_text  + guide_text + content_url + content_url2 ,'text');
    }

    btn_get_url_jiexi.onclick =function(){
        page_num = get_page_num()
        content_url = 'https://www.bilibili.com/video/' + bvid + '?p='+ page_num ;
        GM_setClipboard(content_url,'text');
    }


    btn_get_url_list1.onclick =function(){
        var copyText1 = "";
        for(var i = 0; i < list_box.length; i++){
            var title;
            if (name_mode == 1){
                title = list_box[i].innerText.split("\n")[1] + '$';
            }else{
                title=''
            }
            copyText1 = copyText1 + title  + 'https://player.bilibili.com/player.html?bvid=' + bvid + '&high_quality=1\n'
        }
        GM_setClipboard(copyText1.slice(0,-1))
    }

    btn_get_url_list2.onclick =function(){
        var copyText2 = "";
        for(var i = 0; i < list_box.length; i++){
            var title;
            if (name_mode == 1){
                title = list_box[i].innerText.split("\n")[1] + '$';
            }else{
                title=''
            }
            copyText2 = copyText2 + title+  "https://www.bilibili.com/blackboard/html5player.html?bvid=" + bvid +  "&p=" + (i+1) + "\n"
        }
        GM_setClipboard(copyText2.slice(0,-1))

    }

        btn_get_url_list_jiexi.onclick =function(){
        var copyText3 = "";
        for(var i = 0; i < list_box.length; i++){
            var title;
            if (name_mode == 1){
                title = list_box[i].innerText.split("\n")[1] + '$';
            }else{
                title=''
            }

            copyText3 = copyText3 + title +  'https://www.bilibili.com/video/' + bvid + '?p='+ (i+1) + "\n"
        }
        GM_setClipboard(copyText3.slice(0,-1))

    }



    btn_get_thumbnail.onclick =function(){
        var thumbnail_node=document.querySelector('[itemprop="thumbnailUrl"]').content.replace('http','https');
        window.open( thumbnail_node);
    }
                $(".yll-bili").css({
            "display": "flex",
            "position": 'absolute',
            'top': '10%',
            'flex-direction': 'column',
            'z-index': 0
        })
        $("button2").css({
            'margin': '3px 96px',
            'padding': '4px 5px',
            'border-radius': '4px',
            'background': '#00a1d6',
            'color': '#fff',
            'font-size': '0.9em',
            'letter-spacing': '1px',
            'cursor': 'pointer'

        })

}



//setTimeout("get_url()",2000)
window.onload=get_url();
