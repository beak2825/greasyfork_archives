// ==UserScript==
// @name         YouTube移动端中英双语字幕
// @namespace    https://github.com/warmilk/UserScript
// @match        *://m.youtube.com
// @match        *://m.youtube.com/*
// @match        *://m.youtube.com/watch?v=*
// @grant        unsafeWindow
// @author       github@warmilk
// @version      1.0.3
// @description  专门针对油管手机版：自动打开声音，自动开启字幕并机翻中英双语，自动跳广告。安卓浏览器可使用Firefox或者旧版本yandex。有问题联系：知乎@邓强龙，不一定每个视频都有中英字幕。 测试中英双语字幕视频网址： https: //m.youtube.com/watch?v=xFQGKwVijaM&t=2s
// @downloadURL https://update.greasyfork.org/scripts/419149/YouTube%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%AD%E8%8B%B1%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/419149/YouTube%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%AD%E8%8B%B1%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==


(function() {
    // @require      https://cdn.bootcdn.net/ajax/libs/vConsole/2.5.0/vconsole.min.js
    // const vConsole = new VConsole();
    const FORMET_SUFFIX = '&fmt=json3&xorb=2&xobt=3&xovt=3&tlang='
    const THIS = this; //当前作用域的window对象
    const ELEMENTID = { //字幕轨道的HTML元素的id属性值
        zh: 'QIANG_LONG_CAPTION_zh', //中文
        en: 'QIANG_LONG_CAPTION_en', //英文
    }




    var styleOptions = { // 样式配置项
        height: '18%', //中英字幕的父容器相对于<video>区域的高度占比
    };
    var captionFetchUrl = {
        zh: '', //中文字幕str格式array json的下载地址
        en: '', //英文字幕str格式array json的下载地址
    }
    var isHasCaption = { //该视频是否存在某种语言的字幕
        zh: true,
        en: true,
    }
    var videoNode //video标签的dom节点


    function isVideoAdsTime() {
        var ad = document.querySelector('.ad-showing');
        var skipAdButton = document.querySelector('.ytp-ad-skip-button');
        if (skipAdButton) {
            skipAdButton.click();
        }
        return ad != null;
    }
    //自动跳过广告
    function FuckAds() {
        setInterval(function() {
            try {
                isVideoAdsTime();
            } catch (err) {}
        }, 1000);
    }
    //自动点击左上角音量按钮，打开声音
    function OpenVolume() {
        var volumeButton = document.querySelector('.ytp-unmute.ytp-popup.ytp-button.ytp-unmute-animated.ytp-unmute-shrink');
        volumeButton.click();
        return volumeButton != null;
    }

    function GenerateCaptionsUrl(toLang) {
        var url = THIS.ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks[0].baseUrl;
        if (url.indexOf('&lang=zh-Hant') !== -1) {
            url = url.replace('&lang=zh-Hant', '&lang=zh-Hans');
        }
        return url + FORMET_SUFFIX + toLang;
    }
    //获取字幕的请求地址
    function GetCaptionUrl() {
        try {
            // if (THIS == null) {
            //     setTimeout(function() {
            //         continue;
            //     }, 1000);
            // }
            var captionTracks = THIS.ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks
            if (captionTracks.length > 0) { //判断是否存在字幕可用
                for (var i = 0; i < captionTracks.length; i++) {
                    var item = captionTracks[i];
                    switch (item.languageCode) {
                        case 'zh-Hans':
                            isHasCaption.zh = true;
                            console.log('这个视频有中文字幕（zh-Hans）');
                            break;
                        case 'zh-CN':
                            console.log('这个视频有中文字幕（zh-CN）');
                            break;
                        case 'en':
                            isHasCaption.en = true;
                            console.log('这个视频有英文字幕（en）');
                            break;
                        default:
                            isHasCaption.en = true;
                            isHasCaption.zh = true;
                            break;
                    }
                }
                captionFetchUrl.zh = GenerateCaptionsUrl('zh-Hans')
                captionFetchUrl.en = GenerateCaptionsUrl('en')
            } else {
                console.log('这个视频没有字幕');
            }
        } catch (err) {}
    }

    function both_ZH_EN(parentNode) {
        var wrapper_zh = document.createElement('div');
        var wrapper_en = document.createElement('div');
        parentNode.appendChild(wrapper_zh)
        parentNode.appendChild(wrapper_en)
        var caption_zh = document.createElement('div');
        var caption_en = document.createElement('div');
        wrapper_zh.appendChild(caption_zh)
        wrapper_en.appendChild(caption_en)

        parentNode.style.pointerEvents = 'none';
        parentNode.style.position = 'absolute';
        parentNode.style.zIndex = 2;
        parentNode.style.width = '100%';
        parentNode.style.height = styleOptions.height;
        // parentNode.style.backgroundColor = 'red';
        parentNode.style.bottom = 0;
        parentNode.style.left = 0;

        wrapper_zh.style.position = wrapper_en.style.position = 'absolute';
        wrapper_zh.style.zIndex = wrapper_en.style.zIndex = 3;
        wrapper_zh.style.width = wrapper_en.style.width = '100%';
        wrapper_zh.style.height = wrapper_en.style.height = '50%';
        wrapper_zh.style.left = wrapper_en.style.left = 0;
        wrapper_zh.style.textAlign = wrapper_en.style.textAlign = 'center';

        // wrapper_zh.style.backgroundColor = 'yellow';
        // wrapper_en.style.backgroundColor = 'blue';

        wrapper_zh.style.bottom = 0;
        wrapper_en.style.top = 0;

        caption_zh.style.backgroundColor = caption_en.style.backgroundColor = '#000';
        caption_zh.style.color = caption_en.style.color = '#fff';
        caption_zh.style.display = caption_en.style.display = 'inline-block';

        caption_zh.id = ELEMENTID.zh;
        caption_en.id = ELEMENTID.en;

        caption_zh.innerText = '';
        caption_en.innerText = '';
    }

    function just_EN(parentNode) {
        var wrapper_en = document.createElement('div');
        parentNode.appendChild(wrapper_en)
        var caption_en = document.createElement('div');
        wrapper_en.appendChild(caption_en)
        parentNode.style.pointerEvents = 'none';
        parentNode.style.position = 'absolute';
        parentNode.style.zIndex = 2;
        parentNode.style.width = '100%';
        parentNode.style.height = styleOptions.height;
        // parentNode.style.backgroundColor = 'red';
        parentNode.style.bottom = 0;
        parentNode.style.left = 0;
        wrapper_en.style.position = 'absolute';
        wrapper_en.style.zIndex = 3;
        wrapper_en.style.width = '100%';
        wrapper_en.style.height = '50%';
        wrapper_en.style.left = 0;
        wrapper_en.style.textAlign = 'center';
        wrapper_en.style.bottom = 0;
        caption_en.style.backgroundColor = '#000';
        caption_en.style.color = '#fff';
        caption_en.style.display = 'inline-block';
        caption_en.id = ELEMENTID.en;
        caption_en.innerText = '';
    }

    function just_ZH(parentNode) {
        var wrapper_zh = document.createElement('div');
        parentNode.appendChild(wrapper_zh)
        var caption_zh = document.createElement('div');
        wrapper_zh.appendChild(caption_zh)
        parentNode.style.pointerEvents = 'none';
        parentNode.style.position = 'absolute';
        parentNode.style.zIndex = 2;
        parentNode.style.width = '100%';
        parentNode.style.height = styleOptions.height;
        // parentNode.style.backgroundColor = 'red';
        parentNode.style.bottom = 0;
        parentNode.style.left = 0;
        wrapper_zh.style.position = 'absolute';
        wrapper_zh.style.zIndex = 3;
        wrapper_zh.style.width = '100%';
        wrapper_zh.style.height = '50%';
        wrapper_zh.style.left = 0;
        wrapper_zh.style.textAlign = 'center';
        wrapper_zh.style.bottom = 0;
        caption_zh.style.backgroundColor = '#000';
        caption_zh.style.color = '#fff';
        caption_zh.style.display = 'inline-block';
        caption_zh.id = ELEMENTID.en;
        caption_zh.innerText = '';
    }
    //创建字幕控件的 HTML dom结构
    function CreateCaptionWidget() {
        var videoPlayerWrapper = document.querySelector('#player-container-id')
        if (videoPlayerWrapper == null) {
            console.log('无法获取#player-container-id的元素，导致无法创建字幕控件html dom');
            return;
        }
        var captionWidget = document.createElement('div');
        videoPlayerWrapper.appendChild(captionWidget)
        if (isHasCaption.zh && isHasCaption.en) {
            both_ZH_EN(captionWidget);
        }
        if (!isHasCaption.zh && isHasCaption.en) {
            just_EN(captionWidget);
        }
        if (isHasCaption.zh && !isHasCaption.en) {
            just_ZH(captionWidget);
        }
        if (!isHasCaption.zh && !isHasCaption.en) {
            return;
        }
    }
    /**
     * 发请求获取YouTube提供的str格式的字幕
     * 
     * @param ajaxUrl {String} 获取字幕的请求url
     * @param languageTag {String} 字幕语言的标记，zh：中文，en：英文
     * @param callbackFn {Function} 成功fetch字幕数据后的回调函数
     */
    function FetchCaptionFromYoutube(ajaxUrl, languageTag) {
        var fullUrl = location.origin + ajaxUrl
        var langMap = {
            'en': '【英文】',
            'zh': '【中文】',
        }
        if (ajaxUrl !== '') {
            fetch(ajaxUrl)
                .then(function(response) {
                    response.json().then(function(response) {
                        var resultList = response.events;
                        console.log('获取', langMap[languageTag], '字幕成功。url：', fullUrl);
                        InjectCaptionsToPage(resultList, languageTag)
                    }).catch(function(err) {
                        console.log(err);
                        console.log('获取', langMap[languageTag], '字幕失败。url：', fullUrl);
                    });
                }).catch(function(err) {
                    console.log('获取', langMap[languageTag], '字幕失败。url：', fullUrl);
                });
        }
    }

    function GetTackNode(languageTag) {
        var id = '#' + ELEMENTID[languageTag]
        return document.querySelector(id)
    }

    /**
     * 把字幕数据注入到页面（str就是time txt也就是带时间轴的txt）
     * 
     * @param captionContentList {Array} 字幕数据
     * @param languageTag {String} zh：中文，en：英文
     */
    function InjectCaptionsToPage(captionContentList, languageTag) {
        var targetNode = GetTackNode(languageTag); //{HTMLnode} 字幕轨道的html元素节点（注入数据的目标节点）
        videoNode = document.querySelector('video.video-stream.html5-main-video') //<video>标签对应的元素
        setInterval(function() {
            videoNode.addEventListener('timeupdate', function() {
                videoNode.currentTime = videoNode.currentTime * 1000; //<video>元素的currentTime属性单位为秒
                if (captionContentList != null && captionContentList instanceof Array) {
                    for (var i = 0; i < captionContentList.length; i++) {
                        var item = captionContentList[i];
                        if (!item || !item.segs || !(item.segs instanceof Array)) {
                            continue;
                        }
                        if (videoNode.currentTime >= item.tStartMs && videoNode.currentTime <= item.tStartMs + item.dDurationMs) {
                            if (targetNode !== null) {
                                try {
                                    var text = [];
                                    for (var k = 0; k < item.segs.length; k++) {
                                        text.push(item.segs[k].utf8);
                                    }
                                    var displayText = text.join(' ');
                                    displayText = displayText.replace(/\s+/ig, ' ');
                                    if (targetNode.innerText !== displayText) {
                                        targetNode.innerText = displayText;
                                    }
                                } catch (err) {
                                    continue;
                                }
                            }
                            break;
                        }
                    }
                }
            })
        }, 300);
    }

    function Main() {
        GetCaptionUrl();
        CreateCaptionWidget();
        FetchCaptionFromYoutube(captionFetchUrl.zh, 'zh');
        FetchCaptionFromYoutube(captionFetchUrl.en, 'en');
    }
    window.addEventListener("load", function() {
            OpenVolume();
            //FuckAds();
            Main();
        })
        // window.addEventListener("popstate", function() {
        //     console.log("popstate");

    //     Main();
    // })
    // window.addEventListener("pushState", function() {
    //     console.log("pushState");

    //     Main();
    // })
    // window.addEventListener("replaceState", function() {
    //     console.log("replaceState");

    //     Main();
    // })
    // window.addEventListener("hashchange", function() {
    //     console.log("hashchange");
    //     Main();
    // })
    // THIS.history.forward = function() {
    //     console.log('forward');

    // }

})();