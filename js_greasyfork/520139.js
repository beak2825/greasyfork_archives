// ==UserScript==
// @name         超星学习通网课助手自动学习考试
// @namespace    genggongzi_cx
// @version      1.0
// @description  开放优化收录系统,超过1600W自收录题库，支持自动答题，支持视频自动完成，章节测验自动答题提交，支持自动切换任务点等，开放自定义参数
// @author       genggongzi
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @connect      api.gochati.cn
// @connect      up.gochati.cn
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @original-author qq:2621905853
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/520139/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520139/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

let lhost = window.location.host;
let lhref = window.location.href;
let lsearch = window.location.search;
let lpathname = window.location.pathname;

function sleepBySeconds(delay) {
    return new Promise(reslove => {
        setTimeout(reslove, delay * 1000)
    })
}
function sleepByMillis(delay) {
    return new Promise(reslove => {
        setTimeout(reslove, delay)
    })
}

let KCom = {
    isMain: function (obj) {
        return lhref.includes('/visit/interaction')
    },
    isStudyPage: function (obj) {
        return lhref.includes('mycourse/studentstudy')
    },
    isVideoPage: function (obj) {
        return lhref.includes('ananas/modules/video/')
    }
};

let tool = {
    eleLoad: function (dom, time, callback) {
        var tmm = window.setInterval(function () {
            if ($(dom).length == 0)
                return;
            window.clearInterval(tmm);
            callback();
        }, time);
    }
}

let Course = {
    endVideo: function () {
        if ($('video').length == 0)
            return;
        let Media = $('video')[0];

        if (Media.currentTime > 0 && Media.currentTime == Media.duration) {
            return;
        }
        if (Media.error != null) {
            if (Media.error.code == 2)
                Media.load();
            Media.currentTime = Media.currentTime + 5;
        }
        $('video').prop('muted', true);
        Media.playbackRate = 2;
        if (Media.paused) {
            Media.play();
        }

        console.log("当前元素:" + Media + ", 视频时间: " + Media.currentTime + ", duration: " + Media.duration)
        if (!isNaN(Media.duration)) {
            Media.currentTime = Media.duration

        }
    },
    playNext: function () {

    },
    videoHeart: function () {
        var flag = false;
        if ($('video').length == 0)
            return flag;
        var Media = $('video')[0];
        if (Media.paused) {
            flag = false;
        } else
            flag = true;
        return flag;
    }
};

let Pages = {

    mainPage: function () {
        if (!KCom.isMain()) {
            return
        }
    },
    studyPage: async function () {
        if (!KCom.isStudyPage()) {
            return
        }
        let chapters = $('div.posCatalog_level div.posCatalog_select')

        let firstEnter = true;
        for(let i = 0; i < chapters.length; i++) {
            if ($(chapters[i]).find('span.icon_Completed').length == 0 ) {

                console.log(i + ", " + $($('div.posCatalog_level div.posCatalog_select')[i]).find('.posCatalog_name')[0].title + ", " + firstEnter)
                if((firstEnter && !$('div.posCatalog_level div.posCatalog_select')[i].className.includes("posCatalog_active")) || !firstEnter) {
                    $(chapters[i]).find('span.posCatalog_name').eq(0).click()
                }
                firstEnter = false
                await sleepBySeconds(1)
                tool.eleLoad($('#prev_tab .prev_ul li[title="视频"]'), 500, function () {
                    $('#prev_tab .prev_ul li[title="视频"]').eq(0).click()
                });

                while ($($('div.posCatalog_level div.posCatalog_select')[i]).find('span.icon_Completed').length == 0) {
                    await sleepBySeconds(1)
                }
            }
        }
    },
    videoPage: async function () {
        if (!KCom.isVideoPage())
            return
        tool.eleLoad('#video_html5_api', 500, function () {
            console.log('开始点击播放')
            window.setInterval(function () {
                Course.endVideo();
            }, 2 * 1000)
        });

    }
};

Pages.videoPage()
window.setTimeout(Pages.studyPage, 2000);


