// ==UserScript==
// @name         91无限次观看脚本
// @namespace    http://91porn.com/
// @version      0.95
// @description  这个脚本的生命已经结束了，请前往https://nrop19.com继续免费观看91视频
// @author       https://t.me/nrop19

// @include      http*://91porn.com/*
// @include      http*://www.91porn.com/*
// @include      http://*.*p*.space/*

// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
//
// @downloadURL https://update.greasyfork.org/scripts/36671/91%E6%97%A0%E9%99%90%E6%AC%A1%E8%A7%82%E7%9C%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/36671/91%E6%97%A0%E9%99%90%E6%AC%A1%E8%A7%82%E7%9C%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    let href = window.location.href;
    if(!href.match(/(?:index|v|video|uvideos|view_video).php.*/))
        return;
    let videoListPageStyle=`
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
img.moduleFeaturedThumb{float:none !important;}
`;

    const videoLayerHTML=`
<div class='video-content video-bg'>
<div class='video-layer-close' title='ESC键快捷关闭窗口'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAyElEQVRYw+2WSwrDMAwFBTlkfqdLakIPaZguCiWNQyzZyqLFb23PgLAfEmlpafnb0BHo1adnVjob/glEnYKZCGwGBYF3IoMSD/DQC4bPpYxih4/6kaoVxfhEMbrjRUQYrxTV+GuFCz5RTO54ERGmo8IVnyrc8YnCH38Yyx34ROGPv11w84i+Xk7UN20Jvtc3bRHeVuZFeF3TVuHzTVuNd1HkO+e8ad3w503riq9QsOr/606xWBavzbx4BetuZ1sdFxO+paXlx/ICYTRfOPrpBZkAAAAASUVORK5CYII='></div>
<div class='video-player'>
</div>
<div class='video-loading'>
正在读取视频信息。。。
</div>
</div>`;

    const videoContentHTML=`
<h2>91无限次观看的脚本的生命周期已经结束。<br/>做了一个可以搜索91视频功能的网站代替这个脚本，使用体验更加完美。<br>网址：<a href="https://nrop19.com/app">Nrop19.com</a></h2>
`;
    const videoInfoHtml = `
<h1>这个脚本的生命周期已经结束。<br/>做了一个可以搜索91视频功能的网站代替这个脚本，使用体验更加完美。<br>网址：<a href="https://nrop19.com/app">Nrop19.com</a></h1>
`;

    const currentPage = window.location.href.match(/([^/]+)\.php/)[1];
    //console.log({currentPage});

    class VideoLayer{
        constructor() {
            if(currentPage === 'view_video')//视频页面占位符
                this.videoInfoPageInit();

            this.__api = 'https://www.jiexiba.tech/apiapi/youhou';
            this.__ready = true;
            document.addEventListener('keydown',e=>{
                if(e.keyCode === 27)
                    this.close();
            },false);
            if(currentPage === 'view_video'){//单一视频详情页面
                this.videoInfoPage();
            }else{//其它页面,绑定点击事件
                this.videoListPage();
            }
        }

        //视频详情页面
        videoInfoPageInit(){
        }
        videoInfoPageError(html){
            const $video = document.querySelector('#viewvideo-content');
            $video.innerHTML = html;
        }
        videoInfoPage(){
            console.log('videoInfoPage 1');
            const $video = document.querySelector('#viewvideo-content');
            $video.innerHTML = videoInfoHtml + $video.innerHTML;
        }

        //视频列表页面
        videoListPage(){
            const $videos = document.querySelectorAll('#tab-featured p, #videobox .imagechannelhd, #videobox .imagechannel, div#myvideo-content .videothumb');
            const callback = result=>{
                this.show();
            };
            $videos.forEach($video => {
                const $a = $video.querySelector('a');
                const $img = $a.querySelector('img');
                let $target;
                let title;
                if(currentPage === 'index'){//index.php
                    videoListPageStyle += '.video-logo{float:left;}';
                    $target = $a;
                    title = $a.nextElementSibling.innerText;
                }else if(currentPage === 'uvideos'){//uvideos.php
                    $target = $video;
                    title = $video.nextElementSibling.querySelector('a').innerText;
                }else{//v.php和video.php
                    $target = $video;
                    title = $img.title;
                }
                const href = $a.href;
                $target.title= '直接播放视频';
                $target.className += ' video-logo';
                $target.onclick = () => {
                    this.$videoLayer.className += ' video-show';
                    this.show();
                    return false;
                };
            });

            //插入css
            GM_addStyle(videoListPageStyle);

            //创建div层
            this.$videoLayer = document.createElement('div');
            this.$videoLayer.className = 'video-layer';
            this.$videoLayer.innerHTML = videoLayerHTML;
            this.$videoTitle = this.$videoLayer.querySelector('h2');
            this.$videoContent = this.$videoLayer.querySelector('.video-player');
            this.$videoLayer.querySelector('.video-layer-close').onclick = this.close.bind(this);
            document.body.appendChild(this.$videoLayer);
        }

        close() {
            this.$videoContent.innerHTML = '';
            this.$videoLayer.className = this.$videoLayer.className.replace(/\s*video-show/g, '');
        }
        show() {
            this.$videoContent.innerHTML = videoContentHTML;
        }
    }
    const video = new VideoLayer();
})();