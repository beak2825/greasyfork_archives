// ==UserScript==
// @name         study-hardly
// @namespace    http://www.womow.cn/
// @version      0.1.2
// @description  继续教育，好好学习
// @author       Song
// @match        *://web.chinahrt.com/course/*
// @match        *://videoadmin.chinahrt.com/videoPlay/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388259/study-hardly.user.js
// @updateURL https://update.greasyfork.org/scripts/388259/study-hardly.meta.js
// ==/UserScript==
(function () {

    function startCourse() {
        let lis = $('.menu   li');
        let len = lis.length;
        let shouldStudy = false;
        for (let i = 0; i < len; i++) {
            const li = $(lis.get(i));
            const status = li.children('span').text();
            if (status.indexOf('学完') > -1) continue;
            location.href = li.children('a').attr('href');
            break;
        }

        if(!shouldStudy){
            document.title ='！！下课 ！！'
        }
    }

    function initCourse() {
        setTimeout(startCourse, 3000);
    }

    //-------------------------------------------------
    // 播放部分
    //-------------------------------------------------
    const PERIOD = 28;// 检查进度的周期，单位秒
    let muteTimerId;


    function studyContinuously() {
        try {
            window.onblur = undefined;
            console.info('no blur');
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 静音
     */
    function studyMutely() {
        let player = CKobject.getObjectById(playerId);
        if (player) {
            player.changeVolume();
            handleProgress();
            muteTimerId && clearInterval(muteTimerId);
        }
    }

    function handleProgress() {
        let player = CKobject.getObjectById(playerId);
        let s = player.getStatus();
        let r = s.totalTime - s.time;
        if (r <= 0) {
            topOver();//结束学习
            return;
        }

        r = r > PERIOD ? PERIOD : r + 0.5;
        setTimeout(handleProgress, r * 1000);

        if (s.play === false) {
            try {
                player.videoPlay();
                window.onblur = undefined;
                window.top.onblur = undefined;
            } catch (e) {
                console.error('恢复播放出错', e);
            }
        }

    }

    /**
     * 直接调用 window.top.over()  host会出错，重写逻辑
     */
    function topOver() {
        let loc = window.top.location;
        let query = {};
        let searchs = loc.search.substring(1).split('&');
        searchs.forEach(s => {
            let a = s.split('=');
            query[a[0]] = a.length > 1 ? a[1] : true;
        });

        let search = '&trainplanId=' + query.trainplanId + '&courseId=' + query.courseId;
        loc.href = loc.protocol + '//web.chinahrt.com/course/preview?t=' + new Date().getTime() + search;
    }

    function initPlay() {
        if (attrset) {
            attrset.autoPlay = 1;
            attrset.ifPauseBlur = false;
            attrset.ifCanDrag = true;
        } else {
            setTimeout(studyContinuously, 500);
        }
        muteTimerId = setInterval(studyMutely, 3000);
    }


    function init() {
        let href = location.href;

        if (href.indexOf('web.chinahrt.com/course') > 0) {
            document.domain = 'chinahrt.com';
        }
        if (href.indexOf('web.chinahrt.com/course/preview') > 0) {
            initCourse();
        } else if (href.indexOf('videoadmin.chinahrt.com/videoPlay/play') > 0) {
            document.domain = 'chinahrt.com';
            initPlay();
        }
    }

    init();

})();
