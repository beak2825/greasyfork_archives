// ==UserScript==
// @name         常州继续教育学习
// @namespace    http://www.52love1.cn/
// @version      1.1
// @description  常州继续教育学习学习页面自动下一节
// @author       G魂帅X
// @include      http://www.czjxjy.cn/coursePlaySfpServlet.do?*
// @include      http://www.czjxjy.cn/coursePlayServlet.do?*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391863/%E5%B8%B8%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/391863/%E5%B8%B8%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var domain = window.location.host;
    const pageControl = {
        player_page: `/coursePlayServlet.do`,
        chapter_id: 0,
        chapter_type: 0,
        course_id: 0,
        position: 0,
        turn: 0,
        mv_len: 0,
        url_pre: '',
        curTurn: 0,
        saveParams: {
            e_key: 'erMFxjKB',
            e_val: 'bTWicUvw',
            s_name: 'C159360844705418fvip',
            k_val: 0,
            course_id: 0,
            chapter_id: 0,
            turn: 1,
            position: 0,
            user_id: 0
        },
        setOptions: function(opts) {
            this.chapter_id = parseInt(opts.chapter_id);
            this.chapter_type = parseInt(opts.chapter_type);
            this.course_id = parseInt(opts.course_id);
            this.position = parseInt(opts.position);
            this.turn = parseInt(opts.turn);
            this.mv_len = parseInt(opts.mv_len) * 1000;
            this.url_pre = opts.url_pre;

            this.curTurn = this.turn;

            if (this.chapter_type === 0) {
                this.turn = this.turn + 1;
                this.position = 0;
            } else if (this.chapter_type === 1) {
                this.chapter_id = this.chapter_id + 1;
                this.turn = 1;
                this.position = 0;
            }

            this.saveParams.course_id = this.course_id;
            this.saveParams.chapter_id = this.chapter_id;
            this.saveParams.turn = this.turn;
            this.saveParams.user_id = opts.user_id;
        },
        getSwf: function(url) {
            $.ajax({
                url: url,
                method: 'GET'
            });
        },
        getKval: function() {
            var _that = this;
            $.ajax({
                url: _that.url_pre + '/safe/encryptInfoServlet.do?op=swf_generate&' + Math.random(),
                type: 'POST',
                dataType: 'text',
                success: function(res) {
                    var arr = res.split(',');
                    _that.saveParams.k_val = arr[0];
                }
            });
        },
        getJXKey: function(courseId, chapterId, turn) {
            var num = Math.floor(Math.random() * 100 + 1);
            var keyVal = (courseId + turn) * chapterId * 100 + num;
            return keyVal;
        },
        /**
         * 播放下一节
         */
        playNextTurn: function() {
            var courseId = this.course_id,
                chapterId = this.chapter_id,
                turn = this.turn,
                player_page = this.player_page;
            var jKey = this.getJXKey(courseId, chapterId, turn);
            var nextTurnUrl = `${player_page}?course_id=${courseId}&chapter_id=${chapterId}&r_type=0&turn=${turn}&position=0&jkey=${jKey}`;
            goNextPage(nextTurnUrl);
        },
        /**
         * 播放下一章
         */
        playNextChapter: function() {
            var courseId = this.course_id,
                chapterId = this.chapter_id,
                turn = this.turn,
                player_page = this.player_page;
            var jKey = this.getJXKey(courseId,chapterId,1);
            var nextTurnUrl = `${player_page}?course_id=${courseId}&chapter_id=${chapterId}&turn=1&position=0&jkey=${jKey}`;
            goNextPage(nextTurnUrl);
        },
        /*保存进度*/
        saveCurProForRedirect: function() {
            var _that = this;
            var chapter_type = this.chapter_type;
            $.ajax({
                url: '/savelearnprogressservlet.do',
                type: 'POST',
                data: _that.saveParams,
                dataType: 'text',
                success: function(res) {
                    if (res === 'FAIL_TIME_ERROR') {
                        //时间验证失败，延时重新提交
                        setTimeout(_that.saveCurProForRedirect, 2000);
                    } else {
                        if(chapter_type === 0) {
                            _that.playNextTurn();
                        } else if(chapter_type === 1) {
                            _that.playNextChapter();
                        } else if(chapter_type === 2) {
                            _that.saveCourse();
                        }
                    }
                }
            });
        },
        /*保存本科进度*/
        saveCourse: function() {
            var _that = this;
            $.ajax({
                url: '/coursepassservlet.do',
                type: 'POST',
                data: _that.saveParams,
                dataType: 'text',
                success: function(res) {
                    window.location.href = '/learnCourseUnOverServlet.do';
                }
            });
        },
        /*开始*/
        start: function() {
            var _that = this;
            var chapter_id = this.chapter_id;
            var curTurn = this.curTurn;
            var $show = $('<div style="width: 100%;text-align: center;font-size: 50px;color: #cc3b3b;height: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center;"><div>').appendTo($('body'));
            var $info = $(`<div>第${chapter_id}章第${curTurn}节</div>`).appendTo($show);
            var $play = $('<div></div>').appendTo($show);
            // var $btn = $('<a href="javascript:;" style="display: block;text-decoration: none;padding: 15px 35px;background-color: #2e17ce;color: #FFF;border-radius: 30px;font-size: 20px;">强制跳过</a>').appendTo($show);
            var startTime = new Date().getTime();
            var time = this.mv_len + 5000;
            var timeLong = this.getTime(_that.mv_len);
            $play.html(`播放时间：00:00:00/${timeLong}`);
            var timer = setInterval(function(){
                var endTime = new Date().getTime();
                var timeLen = endTime - startTime;
                var curTime = _that.getTime(timeLen);
                $play.html(`播放时间：${curTime}/${timeLong}`);
                if (timeLen > time) {
                    clearInterval(timer);
                    _that.doJump();
                }
            }, 1000);

            // $btn.on('click', function(){
            //     if (timer) clearInterval(timer);
            //     _that.doJump();
            // });
        },
        /*时间格式化*/
        getTime: function(time) {
            var time_s = parseInt(time / 1000);
            var h_mod = time_s % 3600;
            var h = (time_s - h_mod) / 3600;

            var m_mode = h_mod % 60;
            var m = (h_mod - m_mode) / 60;

            var s = m_mode;

            var hStr = h > 9 ? h : '0' + h;
            var mStr = m > 9 ? m : '0' + m;
            var sStr = s > 9 ? s : '0' + s;

            return `${hStr}:${mStr}:${sStr}`
        },
        /*播放完成跳转*/
        doJump: function() {
            var chapter_type = this.chapter_type;
            var _that = this;
            //延时提交，避免时间限制检验
            setTimeout(function(){
                if (chapter_type === 0 || chapter_type === 1) {
                    _that.saveCurProForRedirect();
                } else if (chapter_type === 2) {
                    _that.saveCourse();
                }
            }, 2000);
        }
    };

    var src = $('#sanfenping embed').attr('src');
    var swfObj = document.getElementById('sanfenping');
    var swfEmbed = $('#sanfenping embed')[0];
    var flashvars = $('#sanfenping embed').attr('flashvars');
    var varArr = flashvars.split('&');
    var options = {};
    $.each(varArr, function(index, str){
        var strArr = str.split('=');
        var key = strArr[0];
        options[key] = strArr[1];
    });
    $('#sanfenping').remove();
    pageControl.setOptions(options);
    pageControl.getKval();
    pageControl.start();

    layer.ready(function(){
        layer.config({
            success: function(){
                setTimeout(function(layero, index){
                    var form1 = layer.getChildFrame('#form1', index);
                    var a = form1.find('a');
                    if(a.eq(0).html().indexOf('继续学习') > -1 || a.eq(0).attr('onclick').indexOf('goNext') > -1) {
                        a.eq(0).click();
                    } else if(a.eq(1).html().indexOf('继续学习') > -1 || a.eq(0).attr('onclick').indexOf('goCenter') > -1) {
                        a.eq(1).click();
                    }
                }, 1500);
            }
        });
    });
})();