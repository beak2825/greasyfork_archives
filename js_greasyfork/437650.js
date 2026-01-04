// ==UserScript==
// @name         bilibili强化
// @namespace    https://greasyfork.org/scripts/437650
// @version      4.4
// @description  B站自动宽屏 超宽屏 自动洗脑循环 自动展开简介区 屏蔽充电鸣谢 屏蔽视频暂停和结束广告 自动将简介区网址改成超连结
// @author       fmnijk
// @match        https://www.bilibili.com/*
// @exclude      https://www.bilibili.com/festival/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437650/bilibili%E5%BC%BA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/437650/bilibili%E5%BC%BA%E5%8C%96.meta.js
// ==/UserScript==

/*主函数*/
(function() {
    'use strict';

    /*不影响首页*/
    if (window.location.href == 'https://www.bilibili.com/'){
        return false;
    }

    /*自動寬屏*/
    autowide();

    /*自動網頁全屏*/
    //autofull();

    /*超寬屏 需啟用自動寬屏才能用 (beta)*/
    //ultrawide();

    /*自動洗脑循环*/
    autoloop();

    /*自动展开简介区*/
    autounfold();

    /*屏蔽充电鸣谢*/
    blockelecpanel();

    /*屏蔽视频暂停和结束广告*/
    blockendpanel();

    /*自动将简介区网址改成超连结*/
    autohyperlink();

    /*快轉後自動暫停*/
    //autopause();
})();

/*定時器*/
function setIntervalX(callback, delay, maxrepeate) {
    var count = 0;
    var intervalID = window.setInterval(function () {

        if (++count === maxrepeate) {
            window.clearInterval(intervalID);
        }

        callback();
    }, delay);
}

function setIntervalY(callback, isfinish, delay, maxrepeate) {
    var count = 0;
    var intervalID = window.setInterval(function () {

        if (isfinish() || ++count === maxrepeate) {
            window.clearInterval(intervalID);
        }

        callback();
    }, delay);
}

/*自動寬屏*/
function autowide() {
    $('.bilibili-player-video > video, .bilibili-player-video > bwp-video, .bpx-player-video-wrap > video')?.[0]?.addEventListener('playing', function () {
        $('.bpx-player-ctrl-btn.bpx-player-ctrl-wide').click();
    }, {once : true});
}

/*自動網頁全屏*/
function autofull() {
    $('.bilibili-player-video > video, .bilibili-player-video > bwp-video, .bpx-player-video-wrap > video')?.[0]?.addEventListener('playing', function () {
        $('.bpx-player-ctrl-btn.bpx-player-ctrl-web').click();
    }, {once : true});
}

/*超寬屏*/
function ultrawide(){
    var styles = `
        /*超寬屏影片*/
		#player_module, #bilibili-player{
			left: 0vw !important;
			right: 0vw !important;
            max-height: 50vw !important;
			margin: 0 !important;
			padding: 0 !important;
            position: unset !important;
		}

		#app{
			width: 100vw !important;
            padding-left: 0 !important;
		}

		.l-con, .v-wrap{
			width: 100vw !important;
			padding: 0 !important;
		}

        /*bangumi*/
        .plp-l{
			padding-top: 0 !important;
		}

        .plp-r{
			margin-top: 0 !important;
		}

        /*適配超窄視窗*/
        .l-con{
	        min-width: 638px !important;
        }

        /*優化位於超寬屏影片上方的元素 縮小其高度和占用區域 增加視覺寬度*/
		.international-header{
			min-height: 36px !important;
		}

		.mini-header{
			height: 36px !important;
		}

		#internationalHeader > div > div{
			padding: 0 !important;
		}

        .bili-avatar{
            width: 36px !important;
            height: 36px !important;
        }

		#viewbox_report{
			padding-top: 12px !important;
			height: 80px !important;
		}

        /*超寬屏模式下屏蔽退出寬屏按鈕*/
        /*.bilibili-player-video-btn.bilibili-player-video-btn-widescreen{
			display: none !important;
		}

        .squirtle-widescreen-wrap.squirtle-block-wrap{
			display: none !important;
		}*/

        /*適配沒有大會員的情況*/
		#player_module, #bilibili-player{
			min-height: 400px !important;
		}

		#danmukuBox{
			display:block !important;
		}
        `;

    GM_addStyle(styles);

    window.onresize = function() {
        setTimeout(function(){
            tryultrawide();
        },100);
    }

    /*分頁在背景開啟的情況，點擊分頁時運行*/
    window.onfocus = function() {
        setIntervalX(tryultrawide, 100, 50);
    }

    setIntervalX(tryultrawide, 100, 50);
}

function tryultrawide() {
    $('#bilibili-player').css('width', $('#app').css('width'));
    $('#bilibili-player').css('width', $('.v-wrap').css('width'));

    $('#player_module').css('width', $('#bilibili-player').css('width'));

    //先auto再設定成auto的height數值，可以和max-height同時生效
    $('#bilibili-player').css('height', 'auto');
    $('#bilibili-player').css('height', $('#bilibili-player').css('height'));

    $('#player_module').css('height', $('#bilibili-player').css('height'));

    $('#playerWrap').css('height', $('#bilibili-player').css('height'));
    $('#danmukuBox').css('margin-top', 'calc(' + $('#bilibili-player').css('height') + ' + 10px)');

    /*適配超長標題*/
    $('h1').css('max-width', 'calc(' + $('.v-wrap').css('width') + ' - 350px)');
}

 /*自動洗脑循环*/
function autoloop() {
    var styles = `
		/*屏蔽結尾圖片才不會蓋住重播*/
		.bpx-player-ending-wrap {
			display: none !important;
		}
        `;

    GM_addStyle(styles);

    $('.bilibili-player-video > video, .bilibili-player-video > bwp-video, .bpx-player-video-wrap video')?.[0]?.addEventListener('ended', function () {
        /*自动连播時不自動洗脑循环，立即開始下一部影片*/
        if($('.next-button > .switch-button')?.[0]?.className.indexOf(' on') != -1){
            $('.next-play a')?.[0]?.click();
            return false;
        }
        this.currentTime = 0;
        this.play();
    }, false);
}

/*自动展开简介区*/
function autounfold() {
    var styles = `
		/*屏蔽收起*/
		#v_desc > div.toggle-btn > span {
			display: none !important;
		}
        `;

    GM_addStyle(styles);

    setIntervalY(tryautounfold, isunfold, 100, 50);
}

function tryautounfold() {
    $('.toggle-btn').each(function() {
        if ($(this).text()?.indexOf('展开更多') != -1){
            $(this).click();
        }
    });
}

function isunfold() {
    $('.toggle-btn').each(function() {
        if ($(this).text()?.indexOf('展开更多') != -1){
            return true;
        }
    });
    return false;
}

 /*屏蔽充电鸣谢*/
function blockelecpanel(){
    var styles = `
		/*屏蔽充电鸣谢*/
		.bilibili-player-electric-panel, .bpx-player-electric-panel {
			display: none !important;
		}
        `;

    GM_addStyle(styles);

    $('.bpx-player-video-wrap video')?.[0]?.addEventListener('ended', function () {
        setIntervalY(tryskipelecpanel, isskipelecpanel, 100, 50);
    }, true);
}

function tryskipelecpanel() {
    $('.bilibili-player-electric-panel-jump-content, .bpx-player-electric-jump')?.[0]?.click();
}

function isskipelecpanel() {
    return false;
    if ($('.bilibili-player-electric-panel-jump-content, .bpx-player-electric-jump')){
        $('.bilibili-player-electric-panel-jump-content, .bpx-player-electric-jump')?.[0]?.click();
        return true;
    }
    return false;
}

/*屏蔽视频暂停和结束广告*/
function blockendpanel(){
    var styles = `
		/*屏蔽视频暂停和结束广告*/
		.bilibili-player-ending-panel, .bpx-player-ending-panel {
			display: none !important;
		}
        `;

    GM_addStyle(styles);
}

/*自动将简介区网址改成超连结*/
function autohyperlink(){
    $('.bilibili-player-video > video, .bilibili-player-video > bwp-video')?.[0]?.addEventListener('playing', function () {

        const $ = document.querySelector.bind(document);

        const upCom = $("#v_desc > div.desc-info.desc-v2.open > span"); // uploader comment

        const str = upCom.innerHTML;

        const newStr = str.replace(/(<a href=")?((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)))(">(.*)<\/a>)?/gi, function () {
            return '<a href="' + arguments[2] + '">' + (arguments[7] || arguments[2]) + '</a>'
        });

        upCom.innerHTML = newStr;

    }, {once : true});
}

/*快轉後自動暫停*/
function autopause() {
    let video = $('.bilibili-player-video > video, .bilibili-player-video > bwp-video, .bpx-player-video-wrap > video')?.[0];
    video?.addEventListener('seeked', function () {
        video?.addEventListener('playing', function () {
            video?.pause();
        }, {once : true});
    }, {once : false});
}

