// ==UserScript==
// @name         获取虎牙直播流地址，可直接使用VLC播放器播放
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  获取虎牙直播流地址，可直接使用VLC播放器播放，在VLC内选择Open Network，粘贴地址打开即可
// @author       xiaozhuai
// @include      http://www.huya.com/*
// @include      https://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369417/%E8%8E%B7%E5%8F%96%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%B5%81%E5%9C%B0%E5%9D%80%EF%BC%8C%E5%8F%AF%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8VLC%E6%92%AD%E6%94%BE%E5%99%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/369417/%E8%8E%B7%E5%8F%96%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%B5%81%E5%9C%B0%E5%9D%80%EF%BC%8C%E5%8F%AF%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8VLC%E6%92%AD%E6%94%BE%E5%99%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

// 本人是韦神大叔粉，请大家支持韦神。
// 韦神资料：
//     绝地求生4AM队长，前英雄联盟LPL总冠军获得者。
//     2018 PUBG China Pro Invitation (PCPI) TPP模式冠军获得者。
//     4AM兄弟齐心，一千多斤！
// 韦神直播间地址：
//     https://www.huya.com/godv

(function() {
    'use strict';
    function heredoc(fn) {
        return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
    }

    var boxHtml = '';

    if(window.TT_ROOM_DATA.state==='OFF'){
        boxHtml = '状态: 未开播<br>';
    }

    if(window.TT_ROOM_DATA.state==='ON'){
        boxHtml = '状态: 正在直播<br>';
        try{
            var streamInfoList = window.hyPlayerConfig.stream.data[0].gameStreamInfoList;
            var data = [];
          
            for(var line=0; line<streamInfoList.length; line++){
                var streamInfo = streamInfoList[line];
                console.log(streamInfo);
                
                var lineNumber = streamInfo.iLineIndex;
                var url = streamInfo.sFlvUrl + '/' + streamInfo.sStreamName + '.' + streamInfo.sFlvUrlSuffix + '?' + streamInfo.sFlvAntiCode;
                var ratioList = window.hyPlayerConfig.stream.vMultiStreamInfo;

                for(var i=0; i<ratioList.length; i++){
                    var label = ratioList[i].sDisplayName;
                    var absUrl = url;
                    if(ratioList[i].iBitRate != 0){
                        absUrl = url+"&ratio="+ratioList[i].iBitRate;
                    }
                    data.push({
                        label: '(线路'+lineNumber+') '+label,
                        url: absUrl,
                    });
                }
            }
          
            for(var i=0; i<data.length; i++) {
                boxHtml += '<div class="flv-url-item"><label>'+data[i].label+'</label><input id="flv-url-'+i+'" value="'+data[i].url+'"/><a onclick="copyFlvUrl('+i+')">复制</a></div>'; //<a onclick="openFlvUrl('+i+')">VLC播放</a>
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
    border: 1px solid #cccccc;
}
#flv-url-box-btn:hover{
    box-shadow: 0 0 8px #0ca4d4;
}
#flv-url-box {
    top: 54px;
    right: 40px;
    border: 1px solid #808080;
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
    border: 1px solid #808080;
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
    top: 0;
    width: 240px;
    height: 24px;
    padding: 0 4px;
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
    color: #333;
}
#flv-url-box .flv-url-item label{
    user-select: none;
    text-align: left;
    padding-left: 12px;
    width: 100px;
    font-size: 12px;
    line-height: 24px;
    height: 24px;
    display: inline-block;
    background-color: #ffffff;
    color: #333;
}
#flv-url-box .flv-url-item a:hover{
    border-color: #0ca4d4;
    color: #0ca4d4;
}
</style>
<div>
    <img id="flv-url-box-btn" onclick="toggleFlvUrlBox()" src="data:image/png;base64,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ZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIM5IkAsAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADc3NUQ3tcoAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAODgzsmEbUAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNDg5OTM1NzUz3MRh0wAAABJ0RVh0VGh1bWI6OlNpemUAMjU4NzdCDe2HSgAAAF90RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9zaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvMTIwNzcvMTIwNzcxMS5wbmcp913KAAAAAElFTkSuQmCC" />
    <div id="flv-url-box" style="display: none;">__box_html__</div>
<div>
    */}).replace('__box_html__', boxHtml);

    document.body.append(wrapper);
})();
