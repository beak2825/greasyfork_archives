// ==UserScript==
// @name         直接点击91视频列表的图片就可以看视频
// @namespace    http://91porn.com/
// @version      0.73
// @description  直接点击91视频列表的图片就可以无限制的看视频
// @author       匿名
//
// @match        http://91porn.com/v.php*
// @match        http://91.91p29.space/v.php*
// @match        http://91porn.com/video.php*
// @match        http://91porn.com/uvideos.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
//
// @downloadURL https://update.greasyfork.org/scripts/37485/%E7%9B%B4%E6%8E%A5%E7%82%B9%E5%87%BB91%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8%E7%9A%84%E5%9B%BE%E7%89%87%E5%B0%B1%E5%8F%AF%E4%BB%A5%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/37485/%E7%9B%B4%E6%8E%A5%E7%82%B9%E5%87%BB91%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8%E7%9A%84%E5%9B%BE%E7%89%87%E5%B0%B1%E5%8F%AF%E4%BB%A5%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function(){GM_addStyle(`
.video-layer{
display: none;
color: #fff;
font-size: 16px;
position: fixed;
width: 100%;
height: 100%;
top: 0;
left: 0;
z-index: 101;
}

.video-bg{background: rgba(0,0,0,0.7);}

.video-show{
display: flex !important;
align-items: center;
justify-content: center;
}

.video-layer-close{
cursor: pointer;
position: absolute;
right: 5px;
top: 5px;
}
.video-layer-close img{width: 28px;}

.video-layer .video-content{
position: relative;
border: 2px solid #fff;
}

.video-layer .video-player{
display:block;
padding: 10px 20px;
}
.video-layer .video-player video{min-width: 600px;max-height: 600px;}

.video-layer .video-loading{display:none;padding: 20px;}

.video-layer.video-loading .video-player{display:none;}
.video-layer.video-loading .video-loading{display:block; text-align: center;}


.video-logo{position: relative;cursor:pointer;}
.video-logo:hover:after{
left:0;
top:0;
content: "";
position: absolute;
width: 100%;
height: 100%;
background-position: center;
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAACgklEQVR4Ae3XzUobbRyG8WlMFLUbSYjYVg+gUJRCJB6IUBfSIoacQIsxB6CtW4sEbOm7UmwgGxE8i2JIN8Yoim7UtKD2NcnmauDmWc3HMxPaRcHfvQ1e8DcZEufBv4AYMxSpUKNJp7smNSoskyWGY5vtBROscYGfc94z3nsgzSYdbNqUSPUSmOcHYTWZixZI8BmRG7ZYJEOS/u5SZMixzS0iJeJhA0PsY8AhCwzi/bpF6hiwx1CYQIJ9jP95SxwnYAmWuAeTIG4PfMKo8wLHPiZpYJRsgXmMb6RxQm6UA4xXQYE0P5G6/nyERAO5Jukf2DS313EibYoWsuEXmKCDvMNx7T+GLIkC0uapd2ANOfR858B3nlveUUfIqlcgxgWygOMxgF+8CUzkkDMeuQMzyI3Px0oIPNUwd8i0O1BEtnCCApZT7SAFd6CCLAYHLKfKI2V3oIZkggOWU2WRqjvQRJLBAcup0siVO9BB+oMDllMNIO0/FXgdPtBEUqEDtWgnivpP/hL1n1xBcvaAThP1bbqMbFsDOo33viJL7kAWufV+FFhOoz3mDsl4PezOgz7LrtMEHejU62Hn8AGpk/AKBJxG6+cYWcHxCozTAXNB14JOoxWRFk/cAa2E3DOJE3EvaSHrOH6BFE2kwShOhI1xglwy4h3Q5jAOIiTGqGLM2r54lTAaTIU8zgnGRxxbIM4exj0FEpZ3TpEWxi594b78KiFH5Bj2+VjlOQaMXQbDfn2PU0Lklh3yZEkz0F2aLHnK3GHoOH3RfoDMcU1Yl8z28hMqyQZtbFqsM9L7j8BnrHKGn1NW9Km1BCyLMU2BMlWuaHd3RZUyS2T0SLMH/uoeAtb9BmqvVYRfGSB/AAAAAElFTkSuQmCC");
background-repeat: no-repeat;
}
`);function getToken(callback){GM_xmlhttpRequest({method:"GET",url:"http://freeget.vip",onload:function(res){callback(res.response.match(/token" value="([^"]+)/))}})}
function getVideoPage(token,url,callback){console.log('getVideoPage',token,url);url=url.replace('view_video.php','view_video_hd.php');GM_xmlhttpRequest({method:"POST",url:"http://freeget.vip/info",headers:{"Content-Type":"application/x-www-form-urlencoded"},data:"token="+token+"&url="+url,onload:function(res){callback(res.response.match(/http:\/\/.+?ev.php.[^"]+/))}})}
function getVideoUrl(url,cb){console.log('getVideoUrl',url);GM_xmlhttpRequest({method:"GET",url:url,onload:function(res){cb(res.response.match(/http:\/\/.+?mp4[^"]+/))}})}
const videoContentHTML=`
<h2>{title}</h2>
<div>
<video controls="controls" autoplay="autoplay">
<source src="{url}" type="video/mp4">
</video>
</div>
<div>视频文件地址: <a href='{url}' target='_blank'>视频文件</a></div>
`;class VideoLayer{constructor(){const $videos=document.querySelectorAll('#videobox .imagechannelhd, #videobox .imagechannel, div#myvideo-content .videothumb');$videos.forEach($video=>{const $a=$video.querySelector('a');const $img=$a.querySelector('img');let title;if($video.className.indexOf('videothumb')>=0){title=$video.nextElementSibling.querySelector('a').innerText}else{title=$img.title}
const href=$a.href;$video.title='直接播放视频';$video.className+=' video-logo';$video.onclick=()=>{this.loadVideo(href,title);return!1}});this.$videoLayer=document.createElement('div');this.$videoLayer.className='video-layer';this.$videoLayer.innerHTML=`
<div class='video-content  video-bg'>
<div class='video-layer-close' title='关闭'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAyElEQVRYw+2WSwrDMAwFBTlkfqdLakIPaZguCiWNQyzZyqLFb23PgLAfEmlpafnb0BHo1adnVjob/glEnYKZCGwGBYF3IoMSD/DQC4bPpYxih4/6kaoVxfhEMbrjRUQYrxTV+GuFCz5RTO54ERGmo8IVnyrc8YnCH38Yyx34ROGPv11w84i+Xk7UN20Jvtc3bRHeVuZFeF3TVuHzTVuNd1HkO+e8ad3w503riq9QsOr/606xWBavzbx4BetuZ1sdFxO+paXlx/ICYTRfOPrpBZkAAAAASUVORK5CYII='></div>
<div class='video-player'>
</div>
<div class='video-loading'>
正在读取视频信息。。。
</div>
</div>
`;this.$videoTitle=this.$videoLayer.querySelector('h2');this.$videoContent=this.$videoLayer.querySelector('.video-player');this.$videoLayer.querySelector('.video-layer-close').onclick=this.close.bind(this);document.body.appendChild(this.$videoLayer)}
loadVideo(url,title){this.$videoLayer.className+=' video-loading';this.$videoLayer.className+=' video-show';getVideoPage('',url,url=>{if(!url||!url[0]){this.close();alert('还没有更新该视频的信息');return}
getVideoUrl(url[0],mp4=>{if(!url||!url[0]){this.close();alert('无法获取视频地址');return}
this.show(title,mp4[0])})})}
close(){this.$videoContent.innerHTML='';this.$videoLayer.className=this.$videoLayer.className.replace(/\s*video-show/g,'')}
show(title,url){let html=videoContentHTML.replace('{title}',title);html=html.replace(/\{url\}/g,url);this.$videoContent.innerHTML=html;this.$videoLayer.className=this.$videoLayer.className.replace(/\s*video-loading/g,'')}}
const video=new VideoLayer()})()