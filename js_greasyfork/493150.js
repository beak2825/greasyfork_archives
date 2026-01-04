// ==UserScript==
// @name         抖音无水印视频下载器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  下载抖音无水印视频,支持首页，推荐页，详情页，搜索页，作者主页等页面视频的下载
// @author       mosheng
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/493150/%E6%8A%96%E9%9F%B3%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493150/%E6%8A%96%E9%9F%B3%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var videoUrl = '';
    const downloadBut = () => {
        let div = $('<div></div>');
        div.css({
            width: '60%',
            color: '#fff',
            height: '40px',
            margin: '10px 0px 10px 0px',
            textAlign: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        });
        div.html(`<div class="svg"><svg t="1713618270524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5347" data-spm-anchor-id="a313x.search_index.0.i12.48b53a81hCsowZ" width="35" height="35"><path d="M665.6 460.73h204.8L511.93 819.2 153.6 460.73h204.8V0h307.2z m-512 460.87h716.8V1024H153.6z m0 0" fill="#D81E06" p-id="5348" data-spm-anchor-id="a313x.search_index.0.i10.48b53a81hCsowZ"></path></svg>下载</div>`);
        div.attr('id', 'downloadBut');
        return div;
    };

    const opSpan = () => {
        let span = $(`<span></span></br>`);
        span.css({
            width: 'fit-content',
            backgroundColor: 'rgba(216,30,6,0.8)',
            color: '#fff',
            fontSize: '20px',
            textAlign: 'center',
            display: 'block',
            borderRadius: '6px',
            padding: '5px 0',
            position: 'absolute',
            zIndex: '9999',
            left: '50%',
            top: '10%',
            transition: 'all 0.5s ease',
        })
        return span;
    }

    const UpBox = (content, is) => {
        let opUpBox = opSpan()
        // opUpBox.append('</br>')
        $('body').append(opUpBox);
        //修改内容
        opUpBox.text(content)
        // //是否显示
        is ? opUpBox.css('visibility', 'visible') : opUpBox.css('visibility', 'hidden');
        //定时器
        setTimeout(() => {
            opUpBox.text(content).remove();
        }, 3000)
    }


    //鼠标事件
    let mouseEvents = (div) => {
        //鼠标移入
        let inp = inps();

        $(div).mouseenter(function () {
            $(this).append(inp);
        });
        //鼠标移出
        $(div).mouseleave(function () {
            $('#urlInp').remove();
        });
        $(div).find('.svg').click(function (e) {
            if ($('#urlInp').val() == '') {
                let Url = '.WV4fYvgt';
                downloadVideo($(this));
            } else {
                var text = $('#urlInp').val();
                var regex = /https?:\/\/[^\s]+/g;
                var matches = text.match(regex);
                if (matches) {
                    // window.open(matches[0], '_blank');
                    // console.log('不跳转')
                    $('body').append(`<iframe class="share_frame" style="position:fixed;top:50%;left:50%;visibility: hidden;pointer-events: none;" src="${matches[0]}" width="100" height="100" frameborder="0" scrolling="auto"></iframe>`)
                    UpBox('视频开始下载，请耐心等待', true)
                    $('.share_frame').on('load', function () {
                        var $this = $(this); // 保存需要的上下文
                        var checkVideoInterval = setInterval(function () {
                            let videoElement = $this.contents().find('video')[0]
                            // videoElement.muted = true;
                            videoElement.pause()//让iframe里的视频暂停
                            if (videoElement) {
                                clearInterval(checkVideoInterval);
                            }
                            $(videoElement).on('progress', function () {
                                setTimeout(() => {
                                    $this.remove();
                                }, 500)
                            })

                        }, 1000);
                    });
                } else {
                    // alert('未找到链接');
                    UpBox('请输入正确的链接', true)
                }
            }
        });
    }


    let createBtn = () => {
        let div = downloadBut();
        let immersive = $(".immersive-player-switch-on-hide-interaction-area");
        immersive.each(function () {
            if ($(this).children().last().attr('id') !== 'downloadBut') {
                $(this).append(div);
                mouseEvents(div);
            }
        });
    };

    let createBtnInSearch = () => {
        let div = downloadBut();
        let xgplayer = $('.xgplayer-controls-initshow').eq(0).parent().children().eq(1).children().eq(0);
        if (xgplayer.children().last().attr('id') !== 'downloadBut') {
            xgplayer.append(div);
            mouseEvents(div);
        }
    };

    const inps = () => {
        let inp = $('<input></input>');
        inp.attr('type', 'text');
        inp.attr('id', 'urlInp');
        inp.css({
            position: 'fixed',
            zIndex: '9999',
            left: '-183px',
            bottom: '15px',
            width: '200px',
            height: '35px',
            fontSize: '12px',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            borderRadius: '5px',
            background: 'rgba(255,255,255,0.5)'
        });
        inp.attr('placeholder', '请输入分享链接或复制链接到此处下载');
        return inp;
    };

    let Timer = setInterval(() => {
        location.href.indexOf('search') === -1 ? createBtn() : createBtnInSearch();
    }, 200);

    function downloadVideo(BtnThis) {
        var videoName = '';
        var src = '';
        if (window.location.href.match(/^https:\/\/www\.douyin\.com\/video\/.*/)) {
            videoName = $(BtnThis).parents('.HP7m07TM').find('.j5WZzJdp').find('span').text();
            src = $(BtnThis).parents('.T8KOH9z5').find('.xg-video-container').html();
        } else if (window.location.href.match(/^https:\/\/www\.douyin\.com\/search\/.*/)) {
            videoName = $(BtnThis).parents('.MgWTwktU').find('.Nu66P_ba:eq(1)').find('span').text();
            src = $(BtnThis).parents('.MgWTwktU').find('.xg-video-container').html();
        } else {
            videoName = $(BtnThis).parents('.T8KOH9z5').find('.xgplayer-video-info-wrap .title span').text();
            src = $(BtnThis).parents('.T8KOH9z5').find('.xg-video-container').html();
        }
        var maxLength = 50;// 视频名称最大长度
        // 视频名称超长处理
        if (videoName.length > maxLength) {
            videoName = videoName.substring(0, maxLength) + '...';// 截取前50个字符加上省略号
        }
        var srcRegex = /src="(.*?)"/;
        var match = src.match(srcRegex);
        if (match) {
            videoUrl = match[1];
            // console.log(videoUrl);
        } else {
            // console.log('未找到匹配的链接');
            UpBox('未找到匹配的链接', true)
            return;
        }
        if (videoUrl !== undefined) {
            // 发起下载请求
            var xhr = new XMLHttpRequest();
            xhr.open('GET', videoUrl, true);
            xhr.responseType = 'blob';
            UpBox('开始下载视频', true)
            UpBox('视频下载中，请稍等...', true)
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // 创建一个链接元素
                    var a = $('<a></a>');
                    var blob = new Blob([xhr.response], { type: 'video/mp4' });
                    var url = window.URL.createObjectURL(blob);

                    a.attr('href', url);//设置下载链接
                    a.attr('download', videoName);//设置下载文件名

                    // 触发链接的点击事件，自动下载视频
                    a[0].click();

                    // 释放对象 URL
                    window.URL.revokeObjectURL(url);
                    UpBox('视频下载成功', true)

                }
            };
            xhr.onerror = function () {
                // console.error('视频下载失败，复制视频分享链接到输入框即可下载');
                UpBox('视频下载失败，复制视频分享链接到输入框即可下载', true)
            };
            xhr.send();
            //清除videoUrl
            videoUrl = '';
        } else {
            UpBox('未找到视频链接', true)
        }
    }

    // 检查当前页面 URL 是否为 https://www.douyin.com/video/* 格式
    if (window.location.href.match(/^https:\/\/www\.douyin\.com\/video\/.*/)) {
        var checkVideoInterval = setInterval(function () {
            let videoElement = $('video')[0];//获取视频元素
            if (videoElement) {
                // console.log('视频加载完成');
                UpBox('视频加载完成，正在自动下载...|如果下载失败请手动点击下载按钮', true)
                let BtnThis = $('#downloadBut');
                downloadVideo(BtnThis);
                clearInterval(checkVideoInterval);
            }
        }, 1000);
    }
})();
