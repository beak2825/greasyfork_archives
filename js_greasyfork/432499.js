// ==UserScript==
// @name         超星学习通网课助手视频自动看非秒过
// @namespace    genggongzi_cx
// @version      0.2
// @description  视频自动看，有的视频不支持秒过，本脚本是非秒过脚本，自动看视频，自动进入下一章
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
// @downloadURL https://update.greasyfork.org/scripts/432499/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%9C%8B%E9%9D%9E%E7%A7%92%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/432499/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%9C%8B%E9%9D%9E%E7%A7%92%E8%BF%87.meta.js
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
        window.setInterval(function () {
            if ($('video').length == 0)
                return;
            let Media = $('video')[0];

            if (Media.currentTime > 0 && Media.currentTime == Media.duration) {
                return;
            }
            if (Media.error != null) {
                if (Media.error.code == 2)
                    Media.load();
                Media.currentTime = Media.currentTime + 1;
            }
            $('video').prop('muted', true);
            Media.playbackRate = 2;
            if (Media.paused) {
                Media.play();
            }
        }, 1000)

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
console.log('进入视频正常版本(非秒过版本)')
Pages.videoPage()
window.setTimeout(Pages.studyPage, 2000);


