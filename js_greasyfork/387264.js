// ==UserScript==
// @name         HUYA Stream URL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取虎牙直播流地址
// @author       游客
// @include      http://www.huya.com/*
// @include      https://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387264/HUYA%20Stream%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/387264/HUYA%20Stream%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getElementsByClassName(className){
    var elems = [];
    if(!document.getElementsByClassName){
        var dom = document.getElementsByTagName("*");
        for(var i =0 ;i<dom.length;i++){
            if(dom[i].className){
                var classs = dom[i].className.split(" ");
                for(var c = 0;c<classs.length;c++){
                    if(classs[c]==className){
                        elems.push(dom[i]);
                    }
                }
            }
        }
    }else{
        var dom1 = document.getElementsByClassName(className);
        for(var m =0 ;m<dom1.length;m++){
            elems.push(dom1[m]);
        }
    }
    return elems;
}

    function deleteInvalidChar(fn){
        //：< > / | : " * ?
        fn=fn.replace(":","");
        fn=fn.replace("<","");
        fn=fn.replace(">","");
        fn=fn.replace("/","");
        fn=fn.replace("\"","");
        fn=fn.replace("*","");
        fn=fn.replace("?","");
        fn=fn.replace("\\","");
        return fn;
    }

    var title=deleteInvalidChar(document.getElementById("J_roomTitle").title);
    var name=deleteInvalidChar(document.getElementsByClassName('host-name')[0].title);
    var roomid=document.getElementsByClassName('host-rid')[0].innerText;
    var strNIT=name+'-'+roomid+'-'+title;
    //alert(strNIT);

    function heredoc(fn) {
        return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
    }

    var boxHtml = '';

    if(window.TT_ROOM_DATA.state==='OFF'){
        boxHtml = '状态: 未开播<br>';
    }

    if(window.TT_ROOM_DATA.state==='ON'){
        boxHtml = '状态: 正在直播 目前 tx 可用<br>';
        boxHtml += '<div class="flv-url-item"><label>信息</label>';
        boxHtml += '<input id="flv-url-'+0+'" value="'+strNIT+'"/>'
        boxHtml += '<a onclick="copyFlvUrl(0)">复制</a></div>';
        try{
            var streamInfoList = window.hyPlayerConfig.stream.data[0].gameStreamInfoList;
            var streamInfo = null;
            var index = 10;
            for(var i=0; i<streamInfoList.length; i++){
                console.log(streamInfoList[i]);
                streamInfo = streamInfoList[i];
            //if(streamInfoList[i].sCdnType==='TX' || streamInfoList[i].sCdnType==='JS')
            {
            var url = streamInfo.sFlvUrl + '/' + streamInfo.sStreamName + '.' + streamInfo.sFlvUrlSuffix + '?' + streamInfo.sFlvAntiCode;
            var ratioList = window.hyPlayerConfig.stream.vMultiStreamInfo;

            for(var j=0; j<ratioList.length; j++){
                var label = ratioList[j].sDisplayName;
                var absUrl = url;
                if(ratioList[j].iBitRate != 0){
                    absUrl = url+"&ratio="+ratioList[j].iBitRate;
                }
                boxHtml += '<div class="flv-url-item"><label>'+label+'</label>';
                boxHtml += '<input id="flv-url-'+index+'" value="'+absUrl+'"/>'
                boxHtml += '<a onclick="copyFlvUrl('+index+')">复制</a></div>';
                //<a onclick="openFlvUrl('+i+')">VLC播放</a>
                index++;
            }
            }
                }
        }catch(e){
            boxHtml += '解析流数据错误';
            console.error(e);
        }
    }

    if(window.TT_ROOM_DATA.state==='REPLAY'){
        boxHtml = '状态: 重播<br>';
        boxHtml += '当前处于重播状态，不能解析流数据';
    }


    window.toggleFlvUrlBox = function() {
        var flvUrlBoxBtn = document.getElementById('flv-url-box-btn');
        var flvUrlBox = document.getElementById('flv-url-box');
        if(flvUrlBox.style.display==='none'){
            flvUrlBox.style.display='block';
        }else{
            flvUrlBox.style.display='none';
        }
    }
    window.copyFlvUrl = function(index) {
        var input = document.getElementById('flv-url-'+index);
        input.select();
        document.execCommand("Copy");
    }
    window.openFlvUrl = function(index) {
        var input = document.getElementById('flv-url-'+index);
        var url = input.value;
        location.href = "vlc://"+url
    }
    var wrapper = document.createElement("div");
    wrapper.style.display = 'inline-block';
    wrapper.innerHTML = heredoc(function(){/*
<style>
#flv-url-box-btn {
    width: 32px;
    height: 32px;
    cursor: pointer;
    background-color: #ffffff;
    top: 9px;
    right: 40px;
    position: fixed;
    z-index: 1000000;
    border-radius: 4px;
    border: 0px solid #cccccc;
}
#flv-url-box-btn:hover{
    box-shadow: 0 0 8px #0ca4d4;
}
#flv-url-box {
    top: 54px;
    right: 40px;
    border: 1px solid #CCC;
    border-radius: 6px;
    background-color: #ffffff;
    padding: 8px;
    position: fixed;
    z-index: 1000000;
}
#flv-url-box .flv-url-item{
    margin: 4px 0;
}
#flv-url-box .flv-url-item>*{
    border: 1px solid #DDD;
    margin-left: -1px;
    vertical-align: top;
}
#flv-url-box .flv-url-item>*:first-child{
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    margin-left: 0;
}
#flv-url-box .flv-url-item>*:last-child{
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
}
#flv-url-box .flv-url-item input{
    top 0;
    width: 180px;
    height: 24px;
    padding: 0 4px;
    color: #999;
}
#flv-url-box .flv-url-item input:focus{
    outline: none;
    border-color: #0ca4d4;
}
#flv-url-box .flv-url-item a{
    user-select: none;
    padding: 0 4px;
    cursor: pointer;
    font-size: 12px;
    line-height: 24px;
    height: 24px;
    display: inline-block;
    background-color: #ffffff;
    color: #888;
}
#flv-url-box .flv-url-item label{
    user-select: none;
    text-align: center;
    width: 60px;
    font-size: 12px;
    line-height: 24px;
    height: 24px;
    display: inline-block;
    background-color: #ffffff;
    color: #888;
}
#flv-url-box .flv-url-item a:hover{
    border-color: #0ca4d4;
    color: #0ca4d4;
}
</style>
<div>
    <img id="flv-url-box-btn" onclick="toggleFlvUrlBox()" src="https://huyaimg.msstatic.com/cdnimage/actprop/20279_1__45_1532856204.jpg" />
    <div id="flv-url-box" style="display: none;">__box_html__</div>
<div>
    */}).replace('__box_html__', boxHtml);

    document.body.append(wrapper);
})();
