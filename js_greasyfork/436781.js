// ==UserScript==
// @name         获取网页版抖音直播流地址、视频地址，获取网页版快手视频地址
// @namespace    http://tampermonkey.net/
// @version      1.9.0
// @description  获取网页版抖音直播流地址，可直接使用VLC播放器播放，在VLC内选择Open Network，粘贴地址打开即可，本脚本参考了@xiaozhuai的虎牙直播流获取脚本
// @author       nefer pitou
// @match      *.douyin.com/*
// @match      *.kuaishou.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436781/%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5%E7%89%88%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E6%B5%81%E5%9C%B0%E5%9D%80%E3%80%81%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%EF%BC%8C%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5%E7%89%88%E5%BF%AB%E6%89%8B%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/436781/%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5%E7%89%88%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E6%B5%81%E5%9C%B0%E5%9D%80%E3%80%81%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%EF%BC%8C%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5%E7%89%88%E5%BF%AB%E6%89%8B%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href; /* 获取完整URL */
    function heredoc(fn) {
        return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
    }
    var boxHtml = '暂无资源';
    var render_data = '';

    //(https|http)(://live\.douyin\.com/)(\w+)
    //直播模块
    var reg_live = /(https:\/\/live\.douyin\.com\/)([A-Za-z0-9]+)/;
    if (reg_live.test(url)){
        //console.log('***************');
        render_data = decodeURIComponent(document.getElementById('RENDER_DATA').innerHTML);
        //console.log(render_data);
        render_data = JSON.parse(render_data);
        var stream_url = render_data.initialState.roomStore.roomInfo.room.stream_url;
        //未开播
        if (stream_url == null){
            boxHtml = '状态: 未开播<br>';
        }else{
            boxHtml = '状态: 正在直播<br>';
            var flv_urls = stream_url.flv_pull_url;
            var hls_urls = stream_url.hls_pull_url_map;
            //console.log(flv_urls);
            //console.log(hls_urls);
            /*
                原画FULL_HD1，超清HD1，高清SD1，标清SD2
            */
            try{
                var data = [];
                //console.log(flv_urls);
                if (flv_urls.FULL_HD1 != undefined){
                    data.push({
                        label: '(flv) 原画',
                        url: flv_urls.FULL_HD1,
                    });
                }
                if (flv_urls.HD1 != undefined){
                    data.push({
                        label: '(flv) 超清',
                        url: flv_urls.HD1,
                    });
                }
                if (flv_urls.SD1 != undefined){
                    data.push({
                        label: '(flv) 高清',
                        url: flv_urls.SD1,
                    });
                }
                if (flv_urls.SD2 != undefined){
                    data.push({
                        label: '(flv) 标清',
                        url: flv_urls.SD2,
                    });
                }
                //console.log(hls_urls);
                if (hls_urls.FULL_HD1 != undefined){
                    data.push({
                        label: '(m3u8) 原画',
                        url: hls_urls.FULL_HD1,
                    });
                }
                if (hls_urls.HD1 != undefined){
                    data.push({
                        label: '(m3u8) 超清',
                        url: hls_urls.HD1,
                    });
                }
                if (hls_urls.SD1 != undefined){
                    data.push({
                        label: '(m3u8) 高清',
                        url: hls_urls.SD1,
                    });
                }
                if (hls_urls.SD2 != undefined){
                    data.push({
                        label: '(m3u8) 标清',
                        url: hls_urls.SD2,
                    });
                }
                for(var j=0; j<data.length; j++) {
                    boxHtml += '<div class="flv-url-item"><label>'+data[j].label+'</label><input id="flv-url-'+j+'" value="'+data[j].url+'"/><a onclick="copyFlvUrl('+j+')">复制</a></div>';
                }
            }catch(e){
                boxHtml += '解析流数据错误';
                console.error(e);
            }
        }
    }

    window.toggleFlvUrlBox = function() {
        var flvUrlBoxBtn = document.getElementById('flv-url-box-btn');
        var flvUrlBox = document.getElementById('flv-url-box');
        if(flvUrlBox.style.display==='none'){
            //主页推荐或关注页，由于页面延迟加载的关系，所以这里点击了按钮再解析页面
            url = window.location.href;
            console.log('111',url);

            //#######################
            //***********快手************

            //快手短视频
            //www.kuaishou.com/short-video/3xq4ragn6i4prki
            var reg_kuaishou_short_video = /(https:\/\/www\.kuaishou\.com\/short-video\/)([A-Za-z0-9]+)/;
            //快手长视频
            //https://www.kuaishou.com/video/3xbp249kb66qniy
            var reg_kuaishou_long_video = /(https:\/\/www\.kuaishou\.com\/video\/)([A-Za-z0-9]+)/;

            if (reg_kuaishou_short_video.test(url) || reg_kuaishou_long_video.test(url)){
                let video_url = document.getElementsByClassName('kwai-player-container-video')[0].getElementsByClassName('player-video')[0].getAttribute('src');
                console.log('video_url=',video_url)
                let k = 0;
                let url_box = document.getElementById('flv-url-box');
                url_box.innerHTML = "";
                let div = document.createElement("div");
                div.setAttribute('class','flv-url-item');
                let label = document.createElement("label");
                label.innerText = '视频地址：';
                div.appendChild(label);
                let input = document.createElement("input");
                input.setAttribute('id', 'flv-url-'+k);
                input.setAttribute('value',video_url);
                div.appendChild(input);
                let a = document.createElement("a");
                a.setAttribute('onclick','copyFlvUrl('+k+')');
                a.innerText = '复制';
                div.appendChild(a);
                url_box.appendChild(div);
            }

            //快手电影
            //https://www.kuaishou.com/movie/video/3x9754j2vm2piq6
            /*
            var reg_kuaishou_movie = /(https:\/\/www\.kuaishou\.com\/movie\/video\/)([A-Za-z0-9]+)/;
            if (reg_kuaishou_movie.test(url)){
                let video_url = document.getElementsByClassName('kwai-player-container-video')[0].getElementsByClassName('player-video')[0].getAttribute('src');
                console.log('video_url=',video_url)
                let k = 0;
                let url_box = document.getElementById('flv-url-box');
                url_box.innerHTML = "";
                let div = document.createElement("div");
                div.setAttribute('class','flv-url-item');
                let label = document.createElement("label");
                label.innerText = '视频地址：';
                div.appendChild(label);
                let input = document.createElement("input");
                input.setAttribute('id', 'flv-url-'+k);
                input.setAttribute('value',video_url);
                div.appendChild(input);
                let a = document.createElement("a");
                a.setAttribute('onclick','copyFlvUrl('+k+')');
                a.innerText = '复制';
                div.appendChild(a);
                url_box.appendChild(div);
            }
            */

            //快手直播
            //https://live.kuaishou.com/u/du907432053
            //var reg_kuaishou_live = /(https:\/\/live\.kuaishou\.com\/u\/)([A-Za-z0-9_]+)/;
            //if (reg_kuaishou_live.test(url)){

            //}

            //***********快手************
            //#######################

            if (url == 'https://www.douyin.com/' || url == 'https://www.douyin.com/follow' || url == 'https://www.douyin.com/?enter=guide'){
                console.log(url);
                console.log('嘻嘻');
                let swiper_slide_active = document.getElementsByClassName('swiper-slide-active')[0];
                //console.log('swiper_slide_active=',swiper_slide_active);
                let video = swiper_slide_active.getElementsByTagName('video')[0];
                if (video != undefined){//处理出现直播的情况
                    let src = video.getAttribute('src');
                    console.log('src:',src);
                    if (src == null){
                        let sources = video.getElementsByTagName('source');
                        let url_box = document.getElementById('flv-url-box');
                        url_box.innerHTML = "";
                        for(let k=0; k<sources.length-1; k++){
                            let src = sources[k].getAttribute('src');
                            console.log('src:',src);
                            let div = document.createElement("div");
                            div.setAttribute('class','flv-url-item');
                            let label = document.createElement("label");
                            label.innerText = '线路'+(k+1);
                            div.appendChild(label);
                            let input = document.createElement("input");
                            input.setAttribute('id', 'flv-url-'+k);
                            input.setAttribute('value','https:'+src);
                            div.appendChild(input);
                            let a = document.createElement("a");
                            a.setAttribute('onclick','copyFlvUrl('+k+')');
                            a.innerText = '复制';
                            div.appendChild(a);
                            url_box.appendChild(div);
                        }
                    }else {
                        let url_box = document.getElementById('flv-url-box');
                        url_box.innerHTML = "";
                        let k=0;
                        let div = document.createElement("div");
                        div.setAttribute('class','flv-url-item');
                        let label = document.createElement("label");
                        label.innerText = '线路'+(k+1);
                        div.appendChild(label);
                        let input = document.createElement("input");
                        input.setAttribute('id', 'flv-url-'+k);
                        input.setAttribute('value','https:'+src);
                        div.appendChild(input);
                        let a = document.createElement("a");
                        a.setAttribute('onclick','copyFlvUrl('+k+')');
                        a.innerText = '复制';
                        div.appendChild(a);
                        url_box.appendChild(div);
                    }
                }
            }

            //视频详情页模块
            let reg_video = /(https|http)(:\/\/www\.douyin\.com\/video\/)(\w+)/;
            if (reg_video.test(url)){
                url = window.location.href;
                let video_wrap = document.getElementsByClassName('videoWrap')[0];
                let video = video_wrap.getElementsByTagName('video')[0];
                let src = video.getAttribute('src');
                console.log('src:',src);
                if (src == null){
                    let sources = video.getElementsByTagName('source');
                    let url_box = document.getElementById('flv-url-box');
                    url_box.innerHTML = "";
                    for(let k=0; k<sources.length-1; k++){
                        let src = sources[k].getAttribute('src');
                        console.log('src:',src);
                        let div = document.createElement("div");
                        div.setAttribute('class','flv-url-item');
                        let label = document.createElement("label");
                        label.innerText = '线路'+(k+1);
                        div.appendChild(label);
                        let input = document.createElement("input");
                        input.setAttribute('id', 'flv-url-'+k);
                        input.setAttribute('value','https:'+src);
                        div.appendChild(input);
                        let a = document.createElement("a");
                        a.setAttribute('onclick','copyFlvUrl('+k+')');
                        a.innerText = '复制';
                        div.appendChild(a);
                        url_box.appendChild(div);
                    }
                }else {
                    let url_box = document.getElementById('flv-url-box');
                    let k=0;
                    let div = document.createElement("div");
                    div.setAttribute('class','flv-url-item');
                    let label = document.createElement("label");
                    label.innerText = '线路'+(k+1);
                    div.appendChild(label);
                    let input = document.createElement("input");
                    input.setAttribute('id', 'flv-url-'+k);
                    input.setAttribute('value','https:'+src);
                    div.appendChild(input);
                    let a = document.createElement("a");
                    a.setAttribute('onclick','copyFlvUrl('+k+')');
                    a.innerText = '复制';
                    div.appendChild(a);
                    url_box.appendChild(div);
                }
            }

            //视频发现页模块、用户主页或喜欢页点开的视频、热点
            //用户主页或喜欢页点开的视频  //https://www.douyin.com/user/MS4wLjABAAAA-Yr3RycEW3nCC0pTk9bAutYIpw3TrWKhQtdoAAEa_E8?modal_id=7097518943178427685
            let reg_video_like_or_user_main_page = /(https|http)(:\/\/www\.douyin\.com\/user\/)([A-Za-z0-9_-]+)(\?modal_id=)(\d+)/;
            //热点  //https://www.douyin.com/hot?modal_id=7095634337827278116
            let reg_video_hot = /(https|http)(:\/\/www\.douyin\.com\/hot)(\?modal_id=)(\d+)/;
            //视频发现页模块  https://www.douyin.com/discover
            let reg_discover = /(https|http)(:\/\/www\.douyin\.com\/discover\?)(\w+)/;
            //在follow页点开喜欢或私信里的视频
            //https://www.douyin.com/follow?modal_id=7121889142207728904
            let reg_follow_click = /(https:\/\/www\.douyin\.com\/follow\?modal_id=)(\d+)/;
            if (reg_discover.test(url) || reg_video_like_or_user_main_page.test(url) || reg_video_hot.test(url) || reg_follow_click.test(url)){
                url = window.location.href;
                console.log('url=',url);
                let video_wrap = document.getElementsByClassName('xg-video-container')[0];
                let video = video_wrap.getElementsByTagName('video')[0];
                let sources = video.getElementsByTagName('source');
                let url_box = document.getElementById('flv-url-box');
                url_box.innerHTML = "";
                for(let k=0; k<sources.length-1; k++){
                    let src = sources[k].getAttribute('src');
                    console.log('src:',src);
                    let div = document.createElement("div");
                    div.setAttribute('class','flv-url-item');
                    let label = document.createElement("label");
                    label.innerText = '线路'+(k+1);
                    div.appendChild(label);
                    let input = document.createElement("input");
                    input.setAttribute('id', 'flv-url-'+k);
                    input.setAttribute('value','https:'+src);
                    div.appendChild(input);
                    let a = document.createElement("a");
                    a.setAttribute('onclick','copyFlvUrl('+k+')');
                    a.innerText = '复制';
                    div.appendChild(a);
                    url_box.appendChild(div);
                }
            }

            //综艺视频详情页 //https://www.douyin.com/vsdetail/7088599135993353253
            let reg_vsdetail = /(https:\/\/www\.douyin\.com\/vsdetail\/)([A-Za-z0-9]+)/;
            if (reg_vsdetail.test(url)){
                //console.log('***************');
                render_data = decodeURIComponent(document.getElementById('RENDER_DATA').innerHTML);
                //console.log(render_data);
                render_data = JSON.parse(render_data);
                let firstDisplayData = render_data['65'].firstDisplayData;
                //标题  //袁娅维强力助阵热歌 杨宗纬唱跳初舞台引争议
                let title = firstDisplayData.videoTitle;
                console.log(title);
                //节目当前期数  //第2期
                let videoCurrentPeriod = firstDisplayData.videoCurrentPeriod;
                console.log(videoCurrentPeriod);
                //节目名+季数  //为歌而赞第二季
                let showName = firstDisplayData.showName;
                console.log(showName);
                //视频信息数组
                let videoPlayInfo = firstDisplayData.videoPlayInfo;
                console.log(videoPlayInfo);
                //历遍
                let url_box = document.getElementById('flv-url-box');
                url_box.innerHTML = showName+videoCurrentPeriod+':'+title+'<br>';
                for (let len=videoPlayInfo.length,i=0; i<len-1; i=i+1){
                    //清晰度  //1080p
                    let definition = videoPlayInfo[i].definition
                    console.log(definition);
                    let video_main_url = videoPlayInfo[i].main
                    console.log(video_main_url);
                    let video_backup_url = videoPlayInfo[i].backup
                    console.log(video_backup_url);

                    let div = document.createElement("div");
                    div.setAttribute('class','flv-url-item');
                    let label = document.createElement("label");
                    label.innerText = definition;
                    div.appendChild(label);
                    let input = document.createElement("input");
                    input.setAttribute('id', 'flv-url-'+i);
                    input.setAttribute('value',video_main_url);
                    div.appendChild(input);
                    let a = document.createElement("a");
                    a.setAttribute('onclick','copyFlvUrl('+i+')');
                    a.innerText = '复制';
                    div.appendChild(a);
                    url_box.appendChild(div);
                }
            }

            flvUrlBox.style.display='block';
        }else{
            flvUrlBox.style.display='none';
            if (reg_live.test(url) == false){
                let parent_node = document.getElementById('flv-url-box');
                let tags = document.getElementsByClassName('flv-url-item');
                for (let len=tags.length; len>0; len=len-1){
                    parent_node.removeChild(tags[0]);
                }
                parent_node.innerHTML = "暂无资源";
            }
        }
    }
    window.copyFlvUrl = function(index) {
        var input = document.getElementById('flv-url-'+index);
        input.select();
        document.execCommand("Copy");
        var flvUrlBox = document.getElementById('flv-url-box');
        flvUrlBox.style.display='none';
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
    top: 70px;
    right: 70px;
    position: fixed;
    z-index: 1000000;
    border-radius: 4px;
    border: 1px solid #cccccc;
}
#flv-url-box-btn:hover{
    box-shadow: 0 0 8px #0ca4d4;
}
#flv-url-box {
    top: 115px;
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
    console.log('####### end ######');
})();
