// ==UserScript==
// @name         study-hard
// @namespace    http://www.womow.cn/
// @version      0.1.0
// @description  继续教育，好好学习
// @author       Song
// @match        *://*.chinahrt.com/videoPlay/play*
// @match        *://jntspx.chinahrt.com/userStudyResource/studyResourceDetailInfo*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388234/study-hard.user.js
// @updateURL https://update.greasyfork.org/scripts/388234/study-hard.meta.js
// ==/UserScript==
(function () {


    const KEY_NEXT_CHAPTER = '__$$next';
    // region 视频播放
    let muteTimerId;
    const PERIOD = 200;// 检查进度的周期，单位秒

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
            muteTimerId && clearInterval(muteTimerId);
            handleProgress();
        }
    }

    function handleProgress() {
        let player = CKobject.getObjectById(playerId);
        let s = player.getStatus();
        let r = s.totalTime - s.time;
        if (r <= 0) {
            window.top[KEY_NEXT_CHAPTER]();
            console.info('通知top进入下一章', 'color:#008080');
            return;
        }

        r = r > PERIOD ? PERIOD : r + 0.5;
        setTimeout(handleProgress, r * 1000);

        if (s.play === false) {
            try {
                player.videoPlay();
                window.onblur = undefined;
            } catch (e) {
                console.error('恢复播放出错', e);
            }
        }

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

    //endregion


    // region 课程列表
    /*
    * 尝试打开课程列表中的下一章
    */
    function nextChapter() {

        console.info('try next chapter...');

        let wrapper = $('#audition-chapter');
        let chapters = wrapper.find('ul a');

        for (let i = 0; i < chapters.length; i++) {
            const link = $(chapters[i]);
            if (link.parent().hasClass('n-learning')) {
                link.click();
                console.info('next chapter', link.text());
                break;
            }
        }
    }

    function initCourse() {
        if(document.getElementById('audition-chapter')!=null){
            window[KEY_NEXT_CHAPTER] = nextChapter;
        }else{
            console.warn('%c没找到课程目录(章节列表)','color:#ba6af5')
        }

    }

    //endregion

    function init() {
        let href = location.href;

        if (href.indexOf('.chinahrt.com/videoPlay/play') > 0) {
            document.domain = 'chinahrt.com';
            initPlay();
        } else {
            initCourse();
        }
        console.log('%c好好学习，天天向上--Study Hard！', 'font-size:18px;font-weight: 500;color:#008080');
    }

    init();
})();
