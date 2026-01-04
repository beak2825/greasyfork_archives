// ==UserScript==
// @name        		Maximize Video zz
// @name:zh-CN  		视频网页全屏zz
// @namespace   		http://www.icycat.com
// @description 		Maximize all video players
// @description:zh-CN 	让所有视频网页全屏
// @author      		冻猫
// @include     		*
// @exclude             *www.w3school.com.cn*
// @version     		9.6.4
// @grant       		unsafeWindow
// @run-at      		document-end
// @downloadURL https://update.greasyfork.org/scripts/39173/Maximize%20Video%20zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39173/Maximize%20Video%20zz.meta.js
// ==/UserScript==

(function() {

    'use strict';

    var fullStatus = false,
        isIframe = false,
        isFullIframePlayer = false,
        isRbtn = true,
        parentArray = new Array(),
        backStyle = new Object(),
        mouse = {
            leave: 'listener',
            over: 'listener'
        },
        browser, btnText, player, controlBtn, leftBtn, rightBtn;

    //Html5规则[overlay|从overlay到player节点数或player节点],适用于自适应大小HTML5播放器
    var html5Rules = {
        'egame.qq.com': ['#gift_danmaku_container div|#video-container', '#obj_vcplayer_1 embed|#video-container'],
        'weibo.com': ['video|2'],
        'pan.baidu.com': ['#video-root|#video-player'],
        'www.nicovideo.jp': ['#UadPlayer|2'],
        'thevideo.me': ['#vplayer video|1'],
        'kimcartoon.me': ['#divContentVideo video|1'],
        'www.dailymotion.com': ['#player video|4', '#player .dmp_VideoView|2'],
        'v.youku.com': ['#ykPlayer .yk-trigger-layer|3', '#ykPlayer .spv-logo|4'],
        'www.iqiyi.com': ['#flashbox video|2'],
        'www.youtube.com': ['#player-api video|3', '#c4-player video|2', '#player-container video|3', '#movie_player|0'],
        'www.twitch.tv': ['.js-control-fullscreen-overlay|1', '.pl-controls-top|4'],
        'www.huya.com': ['#danmudiv2|4', '#player-video|3'],
        'www.huomao.com': ['.change-stream-item-tip|1', '#full-screen-top-bar|1'],
        'avgle.com': ['#video-player_html5_api|1', '#vjs-logobrand-image|2'],
        'www.bilibili.com': ['#bilibiliPlayer video|4', '.bilibili-player-info|2'],
        'www.pornhub.com': ['.mhp1138_eventCatcher|2'],
        'www.redtube.com': ['.mhp1138_eventCatcher|1'],
        'www.youporn.com': ['.mhp1138_eventCatcher|1'],
        'www.icourse163.org': ['.ux-video-player .bbg|3'],
        'www.panda.tv': ['#room-player-video-danmu div|.h5player-player-container', '.room-timeline-record-btn|.h5player-player-container'],
        'vk.com': ['.videoplayer_media|1'],
        'www.douyu.com': ['.danmu-wrap video|2'],
        'store.steampowered.com': ['#highlight_player_area video|2'],
        'vimeo.com': ['.player .target|1', '.player .cards|2'],
        'ecchi.iwara.tv': ['#video-player video|1'],
        'live.bilibili.com': ['.bilibili-live-player-video-danmaku|2', '.bilibili-live-player-video-gift|2'],
        'v.qq.com': ['#tenvideo_player .txp_shadow|3', '#video_container_body .txp_shadow|3']
    };

    //iframe播放器显示按钮规则
    //iframe关键字id、classname、src
    var iframeRules = /play|youtube\.com\/embed|video|movie|anime|flv|mp4|v\.youku\.com|www\.iqiyi\.com|v\.qq\.com|www\.le\.com/i;
    //网站域名
    var iframeUrlRules = [
        'kisshentai.net',
        'www.watchseries.ac',
        'www.panda.tv',
        'animeflv.net',
        'www.vodlocker.city',
        'projectwatchseries.com',
        'reyanime.com'
    ];

    //自动缩放内层内播放器规则
    var fullIframePlayerRules = [
        'v.qq.com',
        'newplayer.jfrft.com',
        'player.005.tv',
        'player.xcmh.cc',
        'www.auroravid.to',
        'www.mp4upload.com',
        'vodlocker.com',
        '52dongm.duapp.com'
    ];

    //flash游戏页面，不在flash上显示还原按钮
    var excludeRbtnRules = [
        'www.dmm.com',
        'www.dmm.co.jp',
        'www.4399.com',
        'www.3366.com',
        'flash.17173.com',
        'www.7k7k.com'
    ];

    if (excludeRbtnRules.indexOf(document.location.hostname) != -1) {
        isRbtn = false;
    }

    if (window.top !== window.self) {
        isIframe = true;
    }

    if (navigator.language.toLocaleLowerCase() == 'zh-cn') {
        btnText = {
            out: '网页全屏',
            inner: '内层全屏',
            restore: '还原大小'
        };
    } else {
        btnText = {
            out: 'Maximize',
            inner: 'M<br/>A<br/>X',
            restore: 'Restore'
        };
    }

    if (/Firefox/i.test(navigator.userAgent)) {
        browser = 'firefox';
    } else if (/Chrome/i.test(navigator.userAgent)) {
        browser = 'chrome';
    } else {
        browser = 'other';
    }

    var createButton = function(id) {
        var btn = document.createElement('tbdiv');
        btn.id = id;
        btn.onclick = function() {
            maximize.playerControl();
        };
        document.body.appendChild(btn);
        return btn;
    };

    var tool = {
        getRect: function(element) {
            var rect = element.getBoundingClientRect();
            var scroll = tool.getScroll();
            return {
                pageX: rect.left + scroll.left,
                pageY: rect.top + scroll.top,
                screenX: rect.left,
                screenY: rect.top
            };
        },
        isFullClient: function(element) {
            var client = tool.getClient();
            var rect = tool.getRect(element);
            if (Math.abs(client.width - element.offsetWidth) < 21 && Math.abs(client.height - element.offsetHeight) < 21 && rect.screenY < 10 && rect.screenX < 20) {
                return true;
            } else {
                return false;
            }
        },
        isHtml5FullClient: function(element) {
            var client = tool.getClient();
            var rect = tool.getRect(element);
            var w = client.width - element.offsetWidth;
            var h = client.height - element.offsetHeight;
            if (w >= 0 && h >= 0) {
                if ((w < 21 && rect.screenX < 20) || (h < 21 && rect.screenY < 10)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        },
        getScroll: function() {
            return {
                left: document.documentElement.scrollLeft || document.body.scrollLeft,
                top: document.documentElement.scrollTop || document.body.scrollTop
            };
        },
        getClient: function() {
            return {
                width: document.compatMode == 'CSS1Compat' ? document.documentElement.clientWidth : document.body.clientWidth,
                height: document.compatMode == 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight
            };
        },
        addStyle: function(css) {
            var style = document.createElement('style');
            style.type = 'text/css';
            var node = document.createTextNode(css);
            style.appendChild(node);
            document.head.appendChild(style);
            return style;
        }
    };

    var setButton = {
        init: function() {
            //防止页面脚本干扰，重新初始化样式
            if (!document.getElementById('playerControlBtn')) {
                init();
            }
            if (isIframe && !isFullIframePlayer && fullIframePlayerRules.indexOf(document.location.hostname) != -1) {
                if (player.nodeName == 'OBJECT' || player.nodeName == 'EMBED') {
                    maximize.checkParent();
                    maximize.addClass();
                    tool.addStyle('#htmlToothbrush #bodyToothbrush .playerToothbrush {left:0px !important;width:100vw !important;}');
                    isFullIframePlayer = true;
                }
            }
            if (tool.isFullClient(player) || isFullIframePlayer) {
                return;
            }
            if (isIframe && player.nodeName == 'VIDEO' && tool.isHtml5FullClient(player)) {
                return;
            }
            this.show();
        },
        show: function() {
            try {
                player.addEventListener('mouseleave', handle.leavePlayer, false);
            } catch (e) {
                mouse.leave = player.onmouseleave;
                player.onmouseleave = function() {
                    handle.leavePlayer();
                    player.onmouseleave = mouse.leave;
                };
            }
            if (!fullStatus) {
                document.addEventListener('scroll', handle.scrollFix, false);
            }
            controlBtn.style.display = 'block';
            controlBtn.style.visibility = 'visible';
            this.locate();
        },
        locate: function() {
            var playerRect = tool.getRect(player);
            if (playerRect.pageY < 20 || fullStatus) {
                if (fullStatus) {
                    controlBtn.classList.remove('playerControlBtnCol');
                    playerRect.screenY = playerRect.screenY + 50;
                    playerRect.screenX = playerRect.screenX - 30;
                    controlBtn.innerHTML = btnText.restore;
                } else {
                    playerRect.screenY = playerRect.screenY + 20;
                    if (Math.abs(tool.getClient().width - player.offsetWidth) < 21 && Math.abs(tool.getClient().height - player.offsetHeight) > 21) {
                        playerRect.screenX = playerRect.screenX + 44;
                    } else {
                        playerRect.screenX = playerRect.screenX + 64;
                    }
                    controlBtn.classList.add('playerControlBtnCol');
                    if (isIframe) {
                        controlBtn.innerHTML = btnText.inner;
                    } else {
                        controlBtn.innerHTML = btnText.out;
                    }
                }
                if (browser == 'firefox' && fullStatus) {
                    controlBtn.style.opacity = '1';
                } else {
                    controlBtn.style.opacity = '0.5';
                }
            } else {
                controlBtn.classList.remove('playerControlBtnCol');
                controlBtn.style.opacity = '0.5';
                controlBtn.innerHTML = btnText.out;
            }
            controlBtn.style.top = playerRect.screenY - 20 + 'px';
            controlBtn.style.left = playerRect.screenX - 64 + player.offsetWidth + 'px';
        }
    };

    var handle = {
        getPlayer: function(e) {
            if (fullStatus) {
                return;
            }
            var target = e.target;
            if (html5Rules[document.location.hostname]) {
                var overlay = [],
                    playerNum = [];
                var overlayRules = html5Rules[document.location.hostname];
                for (var i = 0; i < overlayRules.length; i++) {
                    var rules = overlayRules[i].split('|');
                    overlay[i] = document.querySelectorAll(rules[0]);
                    playerNum[i] = rules[1];
                }
                for (var i = 0; i < overlay.length; i++) {
                    for (var j = 0; j < overlay[i].length; j++) {
                        if (overlay[i][j] == target) {
                            var html5Player = target;
                            if (!isNaN(Number(playerNum[i]))) {
                                for (var k = 0; k < playerNum[i]; k++) {
                                    html5Player = html5Player.parentNode;
                                }
                            } else {
                                html5Player = document.querySelector(playerNum[i]);
                            }

                            player = html5Player;
                            setButton.init();
                            return;
                        }
                    }

                }

            }
            switch (target.nodeName) {
                case 'IFRAME':
                    if (!iframeRules.test(target.className) && !iframeRules.test(target.src) && !iframeRules.test(target.id) && iframeUrlRules.indexOf(document.location.hostname) == -1) {
                        handle.leavePlayer();
                        break;
                    }
                case 'OBJECT':
                case 'EMBED':
                case 'VIDEO':
                    if (target.offsetWidth > 99 && target.offsetHeight > 99) {
                        player = target;
                        setButton.init();
                    }
                    break;
                default:
                    handle.leavePlayer();
            }
        },
        leavePlayer: function() {
            if (controlBtn.style.visibility == 'visible') {
                controlBtn.style.opacity = '';
                controlBtn.style.visibility = '';
                try {
                    player.removeEventListener('mouseleave', handle.leavePlayer, false);
                } catch (e) {}
                document.removeEventListener('scroll', handle.scrollFix, false);
            }
        },
        scrollFix: function(e) {
            clearTimeout(backStyle.scrollFixTimer);
            backStyle.scrollFixTimer = setTimeout(function() {
                setButton.locate();
            }, 20);
        },
        hotKey: function(e) {
            //默认退出键为ESC。需要修改为其他快捷键的请搜索"keycode"，修改为按键对应的数字。
            if (e.keyCode == 27) {
                maximize.playerControl();
            }
        },
        restoreButton: function() {
            if (isIframe) {
                return;
            }
            switch (browser) {
                case 'chrome':
                    if (window.outerWidth < window.screen.width - 10) {
                        setButton.show();
                    }
                    break;
                case 'firefox':
                    if (window.innerWidth < window.screen.width - 10) {
                        setButton.show();
                    }
                    break;
            }
        }
    };

    var maximize = {
        playerControl: function() {
            if (!player) {
                return;
            }
            this.checkParent();
            if (!fullStatus) {
                this.fullWin();
            } else {
                this.smallWin();
            }
        },
        checkParent: function() {
            parentArray = [];
            var full = player;
            while (full = full.parentNode) {
                if (full.nodeName == 'BODY') {
                    break;
                }
                if (full.getAttribute) {
                    parentArray.push(full);
                }
            }
        },
        fullWin: function() {
            if (!fullStatus) {
                document.removeEventListener('mouseover', handle.getPlayer, false);
                if (isRbtn) {
                    try {
                        player.addEventListener('mouseover', handle.restoreButton, false);
                    } catch (e) {
                        mouse.over = player.onmouseover;
                        player.onmouseover = handle.restoreButton;
                    }
                }
                backStyle = {
                    htmlId: document.body.parentNode.id,
                    bodyId: document.body.id
                };
                if (document.location.hostname == 'www.youtube.com') {
                    if (document.querySelector('ytd-watch.ytd-page-manager')) {
                        if (!document.querySelector('ytd-watch.ytd-page-manager').hasAttribute('theater-requested_')) {
                            document.querySelector('.ytp-size-button').click();
                            backStyle.ytbStageChange = true;
                        }
                    } else if (!document.querySelector('.watch-stage-mode')) {
                        document.querySelector('.ytp-size-button').click();
                        backStyle.ytbStageChange = true;
                    }
                }
                if (document.location.hostname == 'live.bilibili.com' && document.querySelector('.bilibili-live-player') && document.querySelector('.bilibili-live-player').getAttribute('data-player-state') != 'web-fullscreen') {
                    unsafeWindow.$('.bilibili-live-player-video-danmaku').dblclick();
                    backStyle.biliPlayerChange = true;
                }
                if (document.location.hostname == 'v.youku.com' && document.querySelector('.vpactionv5_iframe_wrap') && tool.getRect(player).pageY + player.offsetHeight - tool.getRect(document.querySelector('.vpactionv5_iframe_wrap')).pageY > 20) {
                    player.style.cssText = 'height: calc(100vh + 50px) !important;';
                }
                if (document.location.hostname == 'www.tudou.com' && document.querySelector('.action_buttons.fix') && tool.getRect(player).pageY + player.offsetHeight - tool.getRect(document.querySelector('.action_buttons.fix')).pageY > 20) {
                    player.style.cssText = 'height: calc(100vh + 55px) !important;';
                }
                if (document.location.hostname == 'mp.weixin.qq.com') {
                    player.style.cssText = '';
                }
                leftBtn.style.display = 'block';
                rightBtn.style.display = 'block';
                controlBtn.style.display = '';
                this.addClass();
            }
            fullStatus = true;
        },
        addClass: function() {
            document.body.parentNode.id = 'htmlToothbrush';
            document.body.id = 'bodyToothbrush';
            for (var i = 0; i < parentArray.length; i++) {
                parentArray[i].classList.add('parentToothbrush');
                //父元素position:fixed会造成层级错乱
                if (getComputedStyle(parentArray[i]).position == 'fixed') {
                    parentArray[i].classList.add('absoluteToothbrush');
                }
            }
            player.classList.add('playerToothbrush');
            if (player.nodeName == 'VIDEO') {
                backStyle.controls = player.controls;
                player.controls = true;
            }
            window.dispatchEvent(new Event('resize'));
        },
        smallWin: function() {
            if (isRbtn) {
                try {
                    player.removeEventListener('mouseover', handle.restoreButton, false);
                } catch (e) {}
                if (mouse.over != 'listener') {
                    player.onmouseover = mouse.over;
                }
            }
            document.body.parentNode.id = backStyle.htmlId;
            document.body.id = backStyle.bodyId;
            for (var i = 0; i < parentArray.length; i++) {
                parentArray[i].classList.remove('parentToothbrush');
                parentArray[i].classList.remove('absoluteToothbrush');
            }
            player.classList.remove('playerToothbrush');
            if (document.location.hostname == 'www.youtube.com' && backStyle.ytbStageChange) {
                document.querySelector('.ytp-size-button').click();
            }
            if (document.location.hostname == 'live.bilibili.com' && backStyle.biliPlayerChange) {
                unsafeWindow.$('.bilibili-live-player-video-danmaku').dblclick();
            }
            if (document.location.hostname == 'v.youku.com' || document.location.hostname == 'www.tudou.com') {
                player.style.cssText = '';
            }
            if (player.nodeName == 'VIDEO') {
                player.controls = backStyle.controls;
            }
            leftBtn.style.display = '';
            rightBtn.style.display = '';
            controlBtn.style.display = '';
            document.addEventListener('mouseover', handle.getPlayer, false);
            window.dispatchEvent(new Event('resize'));
            fullStatus = false;
        }
    };

    var init = function() {
        controlBtn = createButton('playerControlBtn');
        leftBtn = createButton('leftFullStackButton');
        rightBtn = createButton('rightFullStackButton');
        if (getComputedStyle(controlBtn).position != 'fixed') {
            tool.addStyle([
                '#htmlToothbrush, #bodyToothbrush {overflow:hidden !important;zoom:100% !important}',
                '#htmlToothbrush #bodyToothbrush .parentToothbrush {overflow:visible !important;z-index:auto !important;transform:none !important;-webkit-transform-style:flat !important;transition:none !important;contain:none !important;}',
                '#htmlToothbrush #bodyToothbrush .absoluteToothbrush {position:absolute !important;}',
                '#htmlToothbrush #bodyToothbrush .playerToothbrush {position:fixed !important;top:0px !important;left:1px !important;width:calc(100vw - 2px) !important;height:100vh !important;max-width:none !important;max-height:none !important;min-width:0 !important;min-height:0 !important;margin:0 !important;padding:0 !important;z-index:2147483645 !important;border:none !important;background-color:#000 !important;transform:none !important;}',
                '#htmlToothbrush #bodyToothbrush .playerToothbrush video {object-fit:contain !important;}',
                '#playerControlBtn {visibility:hidden;opacity:0;display:none;transition: all 0.5s ease;cursor: pointer;font: 12px "微软雅黑";margin:0;width:64px;height:20px;line-height:20px;border:none;text-align: center;position: fixed;z-index:2147483646;background-color: #27A9D8;color: #FFF;} #playerControlBtn:hover {visibility:visible;opacity:1;background-color:#2774D8;}',
                '#playerControlBtn.playerControlBtnCol {width:20px;height:64px;line-height:16px;}',
                '#leftFullStackButton{display:none;position:fixed;width:1px;height:100vh;top:0;left:0;z-index:2147483646;background:#000;}',
                '#rightFullStackButton{display:none;position:fixed;width:1px;height:100vh;top:0;right:0;z-index:2147483646;background:#000;}'
            ].join('\n'));
            tool.addStyle([
                '#htmlToothbrush #bodyToothbrush .node-video.node-full video {width: inherit !important;height: inherit !important;}',
                '#htmlToothbrush #bodyToothbrush .WB_h5video video {width: inherit !important;height: inherit !important;}'
            ].join('\n'));
        }
    };

    init();

    document.addEventListener('mouseover', handle.getPlayer, false);
    document.addEventListener('keydown', handle.hotKey, false);

})();