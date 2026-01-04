// ==UserScript==
// @name         获取youtube原生字幕
// @name:en      get youtube source subtitles(not cc)
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  开启后，进入后台页面，单击获取字幕即可复制到粘贴板
// @description:en click the button,go into the new website,and click new button,then the subtitles will copy to clipboard.

// @author       月离
// @match        *://*.youtube.com/watch*
// @match        *://*.youtube.com/timedtext_editor*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/410761/%E8%8E%B7%E5%8F%96youtube%E5%8E%9F%E7%94%9F%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/410761/%E8%8E%B7%E5%8F%96youtube%E5%8E%9F%E7%94%9F%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

//获取当前短链接
var url_location;
var url;
url_location = window.location.href;
function matchYoutubeUrl(url){
var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
 return (url.match(p)) ? RegExp.$1 : false ;
}
url = matchYoutubeUrl(url_location);

//判断是否为初始页面
if (url_location.indexOf("watch")){
setTimeout(window.onload = addBtn1, 3000);

}

function addBtn1(){

    //1,利用createElement（）创建一个标签对象
    var btn_url=document.createElement("button");
    var t=document.createTextNode("获取字幕");
    btn_url.appendChild(t);

    //2,获得div对象
    var node2=document.getElementById("meta-contents");
    var pos = node2.getBoundingClientRect();
    var pos_left;
    var pos_top;
    pos_left = pos.left+250;
    pos_top = pos.top +22;

    //添加成div对象的孩子
    node2.appendChild(btn_url);

    //console.log(output_srt);

    //复制到剪贴板
    btn_url.onclick =function(){
        window.open("https://www.youtube.com/timedtext_editor?action_mde_edit_form=1&v=" + url +"&lang=en&bl=vmp&ui=hd&ref=player&tab=captions&ar=1599145063020&o=U")
    }
    btn_url.style.cssText = 'position: absolute;left: ' + pos_left + 'px;top:'+ pos_top +'px;'+ 'color:#000000fc;border:solid 1px #8a8a8aa3;padding:2.5px;background: white;border-radius: 5px;cursor: pointer;height: 30px;'
}

function addBtn2(){

    //1,利用createElement（）创建一个标签对象
    var btn_url=document.createElement("button");
    var t=document.createTextNode("获取字幕");
    btn_url.appendChild(t);

    //2,获得div对象
    var node2=document.getElementById("creator-page-sidebar");
    //var node3=document.getElementsByClassName("dm");
    //alert(node3[0].getBoundingClientRect().top)
    var pos = node2.getBoundingClientRect();
    var pos_left;
    var pos_top;
    pos_left = pos.left;
    pos_top = pos.top;

    //添加成div对象的孩子
    node2.appendChild(btn_url);


    //获取字幕
    var list_content = document.getElementsByClassName('yt-uix-form-input-textarea event-text event-text-is-autox');
    var list_startTime = document.getElementsByClassName('yt-uix-form-input-text event-time-field event-start-time');
    var list_endTime = document.getElementsByClassName('yt-uix-form-input-text event-time-field event-end-time');
    var str_len = list_content.length;
    let output_list = []

    for (let i = 0;i<str_len;i++){
        var starL;
        var endL;
        starL = list_startTime[i+1].value.length;
        endL = list_endTime[i + 1].value.length;
        var starTime;
        var endTime;

        if (starL.lenght = 6) {
            starTime = "00:0" + list_startTime[ i + 1].value + "00" + " --> ";
        }else if (starL == 7){
            starTime = "00:" + list_startTime[i+1].value + " --> ";
        }else{
            starTime = "0" + starTimes[i+1] + "00" + " --> ";
        }
        if (endL.lenght = 6) {
            endTime = "00:0" + list_endTime[i+1].value + "00";
        }else if (endL == 7){
            endTime = "00:" + list_endtTime[i+1].value + "00";
        }else{
            endTime = "0" + list_endtTime[i + 1] + "00";
        }

        var subTime;
        subTime = (starTime + endTime).replace(".", ",").replace(".", ",")

        output_list .push( i+1,subTime , list_content[i].innerHTML,"");
    }
    //console.log(list_startTime[1]);

    var output_srt;
    output_srt= output_list.join("\n")
    //console.log(output_srt);

    //复制到剪贴板
    btn_url.onclick =function(){
        //alert("已经成功复制到剪贴板！");
        GM_setClipboard(output_srt,'text');
    }
    //btn_url.style.cssText = 'position: absolute;left: ' + pos_left + 'px;top:'+ pos_top +'px;'+ 'color:#000000fc;border:solid 1px #8a8a8aa3;padding:2.5px;background: white;border-radius: 5px;cursor: pointer;height: 30px;'
    btn_url.style.cssText = 'position: absolute;left:10%;top:9%;color:#000000fc;border:solid 1px #8a8a8aa3;padding:2.5px;background: white;border-radius: 5px;cursor: pointer;height: 30px;'
}
if (url_location.indexOf("text")){
    setTimeout(window.onload = addBtn2, 3000);

}