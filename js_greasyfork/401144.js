    // ==UserScript==
    // @name         微知库网课助手
    // @namespace    http://tampermonkey.net/
    // @version      0.34
    // @description  支持微知库视频·文档·PPT·图像等任务自动观看，自动跳转下一章 
    // @author       lodge
    // @match        http://*.36ve.com/?q=items/student/study/*
    // @match        http://*.cavtc.cn/?q=items/student/study/*
    // @match        http://wzk.36ve.com/Student/learning-content/index?tcourseId=*
    // @match        http://wzk.36ve.com/Student/learning-content/learning?resource_id=*
    // @grant        unsafeWindow
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @require      http://code.jquery.com/jquery-3.4.1.js
    // @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/401144/%E5%BE%AE%E7%9F%A5%E5%BA%93%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/401144/%E5%BE%AE%E7%9F%A5%E5%BA%93%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
    // ==/UserScript==

    'use strict';

    var window = unsafeWindow
    var url = location.pathname

    var setting = {
        //时间单位均为毫秒！
        // 0为关闭，1为开启

        //超时设置区
        viedo_wait_time: 7000 //等待页面加载的延迟，时间过小容易导致无法自动开始播放
        , jump_time: 3000 //检测视频播放完成的时间，小于3000可能会导致没看完课就跳转
        , unfold_time: 25000 //展开章节的等待时间，若课程比较多，可以调大点
        , success_check_time: 3000 //任务完成检测等待的时间，机子性能差请适当调高，但会增加刷课时间

        //学习模式设置区
        , review: 0 //复习模式，完整挂机视频(音频)时长，支持挂机任务点已完成的视频和音频，默认关闭
        , fast: 0 //秒刷模式，默认关闭（开启后，如果进度不记录，请关闭）


        //视频设置区
        , rate: 1 //视频播放速度倍数，最高支持5倍速度（如果进度不记录，请改成1）
        , volume: 0 //视频音量，默认静音

    }

    var chapter_num
    var $next_course
    function init() {
        setting.div = $(
            '<div style="width: 300px; border: 3px hidden #000000; font-size: 20px; text-align: center; background-color: rgba(1,216,64,0.70); top: 30px; color: #000000; position: fixed; right: 30px;">' +
            '  <div>微知库网课助手</div>' +
            '  <br>' +
            '  <button id="donate" name="donate" style="font-size: 20px">请作者喝可乐^_^</button>' +
            '  <br>' +
            '  <div><img id="d_pic" style="display: none;width: 100%" src="https://wx1.sbimg.cn/2020/05/16/zfb.md.jpg"></div>' +
            '  <br>' +
            '  <div>' +
            '    <div style="font-size: 15px">如需反馈bug，或提交新功能，请加群</div>' +
            '    <br>' +
            '    <a href="https://jq.qq.com/?_wv=1027&k=5bH9G48" target="_blank" style="font-size: 20px; color: blue; text-decoration: underline;">点我一键加群</a> </div>' +
            '  <br>' +
            '  <!--  <p style="color: red">运行日志</p>-->' +
            '  <div id="log" style="overflow-y: auto; font-size: 20px; color: red; white-space: pre; overflow: auto; height: 300px;"></div>' +
            '</div>'
        ).appendTo('body').on('click', 'button', function () {
            var name = $(this).attr('name')
            // console.log(name)
            if (name == 'donate') {
                if ($("#d_pic").css('display') == 'none') {
                    $("#d_pic").css('display', 'block')
                    $("#donate").text('谢谢你')
                } else {
                    $("#d_pic").css('display', 'none')
                    $("#donate").text('请作者喝可乐^_^')
                }
            }
        }).end()
    }
    init()
    if (url == '/Student/learning-content/index') {
        GM_setValue('is_studying', 'false')
        open_chapter()
        setTimeout(() => {
            clearInterval()
            msg('log', '正在获取全部课程')
            var $course_list = $('#lhMenu').find('a[target="_blank"]')
            var $not_completed_list = []
            $.each($course_list, function (indexInArray, valueOfElement) {
                var $this = $(this)
                if (setting.review == 0) {
                    var $rate_span = $this.prevAll('.label.label-primary')
                    if ($rate_span.length != 0) {
                        $not_completed_list.push($this)
                    }
                } else {
                    $not_completed_list.push($this)
                }
            });
            if (setting.review == 1) {
                msg('log', '当前处于复习模式！点击第一个任务点即可开始刷浏览量')
            }
            msg('log', `获取到${$not_completed_list.length}节未完成课程`)
            var now = 0
            var total = $not_completed_list.length
            setInterval(() => {
                if (now <= total) {
                    var is_studying = GM_getValue('is_studying', 'false')
                    console.log(`is_studying${is_studying}`)
                    var $this = $not_completed_list[now]
                    var name = $this.find('.text-overflow').attr('title')
                    var href = $this.attr('href')
                    if (is_studying == 'false') {
                        msg('log', `即将学习：${name}`)
                        // GM_setValue('is_studying', true)
                        window.open(href, '_blank')
                        now = now + 1
                    } else {
                        var last_c_course_name = $not_completed_list[now - 1].find('.text-overflow').attr('title')
                        console.log(`当前正在学习课程：${last_c_course_name}！`)
                    }
                }
            }, setting.success_check_time);
        }, setting.unfold_time);
    } else if (url == '/Student/learning-content/learning') {
        //没有自带倍速的页面

        GM_setValue('is_studying', 'true')
        window.onbeforeunload = function (event) {
            GM_setValue('is_studying', 'false')
        };
        if (setting.review == 1) {
            msg('log', '当前处于复习模式！')
            setTimeout(() => {
                window.close()
            }, 1000);
        } else {
            if (is_video() == true) {
                msg('log', '当前为视频')
                msg('log', `  ${setting.viedo_wait_time / 1000}秒后开始播放`)
                setTimeout(() => {
                    console.log('start playing')
                    var playerId = $('[id^=ckplayer]').attr('id')
                    if (playerId != undefined) {
                        console.log('当前页面采用flash播放器！');
                        var $player = CKobject.getObjectById(playerId)
                        $player.videoPlay()
                        $player.changeVolume(0)
                        setInterval(() => {
                            var info = $player.getStatus()
                            var time = parseInt(info['time'])
                            var total_time = parseInt(info['totalTime'])
                            if (!info.hasOwnProperty('totalTime')) {
                                total_time = parseInt(info['totaltime'])
                            }
                            console.log(`当前秒${time}总秒${total_time}`)
                            if (time >= total_time) {
                                console.log('当前视频观看完毕，跳转中')
                                msg('log', '当前视频观看完毕')
                                setTimeout(() => {
                                    // GM_setValue('is_studying', false)
                                    window.close()
                                }, 2000);
                            }
                        }, setting.jump_time);
                    } else {
                        // $('video').attr('muted','muted')
                        // $('#log').click()
                        console.log('当前页面采用html播放器！');
                        //$('[data-title=点击静音] canvas').click()
                        // $('[data-title=点击播放] canvas').click()
                        var player = window.player
                        window.document.querySelector('video').playbackRate = setting.rate
                        player.changeVolume(setting.volume)
                        player.videoPlay()
                        msg('log','开始播放')
                        var totalTime = player.getMetaDate().duration
                        setTimeout(() => {
                            if (setting.fast == 0) {
                                player.videoSeek(0)
                            } else {
                                msg('log', '当前是秒刷模式')
                                player.videoSeek(parseInt(totalTime))
                            }
                        }, 500);
                        // console.log(player.getMetaDate())
                        setInterval(() => {
                            play_time = player.time
                            console.log(`当前秒${play_time}总秒${totalTime}`)
                            if (parseInt(play_time) >= parseInt(totalTime)) {
                                console.log('当前视频观看完毕，跳转中')
                                msg('log', '当前视频观看完毕')
                                setTimeout(() => {
                                    // GM_setValue('is_studying', false)
                                    window.close()
                                }, 2000);
                            }
                        }, setting.jump_time);
                    }
                }, setting.viedo_wait_time);
            } else {
                setTimeout(() => {
                    msg('log', '本节学习完毕')
                    setTimeout(() => {
                        // GM_setValue('is_studying', false)
                        window.close()
                    }, 2000);
                }, 1000);
            }
        }

    } else if (url == '/') {
        (function () {
            chapter_num = $('.listitem').length - 1
            $('[style="background:none;"]').remove()
            if (setting.review == 1) {
                msg('log', '当前处于复习模式！点击第一个任务点即可开始刷浏览量')
                var $course_list = $('.itemtitle')
                $course = $('.current').find('.itemtitle')
                var $chapter = $course.parent().parent().parent()
                var chapter_id = parseInt($chapter.attr('id').replace('listitem', ''))
                var next_par_id = chapter_id + 1
                console.log('next par id is' + next_par_id)
                var $next_chapter = $(`#listitem${next_par_id}`)
                if ($course.parent().is(':last-child')) {
                    if ($chapter.parent().is(':last-child')) {
                        console.log('已经是最后一章了')
                        return null
                    } else {
                        $next_course = $next_chapter.find('.itemtitle:first')
                        console.log('下一个任务为：' + $next_course.text())
                        jump_to_course($next_course)
                    }
                } else {
                    $next_course = $course.parent().next().find('.itemtitle')
                    console.log('该课程还未观看：' + $next_course.text())
                    jump_to_course($next_course)
                }
            } else {
                var $course = get_course()
                start_learning($course)
            }
        })();
    }
    function open_chapter() {
        setInterval(() => {
            var $right = $('i[data-type="right"]')
            $right.click()
        }, 100);
        msg('log', `正在展开课程，时间${setting.unfold_time / 1000}秒`)

    }

    function check_player() {
        var playerId = $('[id^=ckplayer]').attr('id')
        if (playerId != undefined) {
            console.log('当前页面采用flash播放器！')
            return 'flash'
        }
        else {
            console.log('html5')
            return 'html5'
        }
    }
    function msg(id, msg) {
        var myDate = new Date();
        var old = $(`#${id}`).html()
        var time = `${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
        var newmsg = `${old}${time}${msg}` + '\n'
        // console.log(`id${id}msg${msg} oldmsg${old} new msg${newmsg}`)
        $(`#${id}`).html(newmsg)
    }
    function start_learning($course) {
        console.log('开始学习，名称：' + $course.text())
        console.log(`当前页面任务名称：${$('.current').find('.itemtitle').text()}待进入任务名${$course.text()}`);
        if ($('.current').find('.itemtitle').text() != $course.text()) {
            console.log('跳转中……')
            jump_to_course($course)
        } else {
            console.log('当前页面是正确的课程')
        }
        if (is_video()) {
            console.log('当前是视频')
            msg('log', `   ${setting.viedo_wait_time / 1000}秒后开始播放`)
            setTimeout(() => {
                console.log('start playing')
                var playerId = $('[id^=ckplayer]').attr('id')
                if (playerId != undefined) {
                    console.log('当前页面采用flash播放器！');
                    var $player = CKobject.getObjectById(playerId)
                    $player.videoPlay()
                    $player.changeVolume(0)
                    setInterval(() => {
                        var info = $player.getStatus()
                        var time = parseInt(info['time'])
                        var total_time = parseInt(info['totalTime'])
                        if (!info.hasOwnProperty('totalTime')) {
                            total_time = parseInt(info['totaltime'])
                        }
                        console.log(`当前秒${time}总秒${total_time}`)
                        if (time >= total_time) {
                            msg('log', '当前视频观看完毕，跳转中')
                            find_next($course)
                            start_learning($next_course)
                        }
                    }, setting.jump_time);
                } else {
                    console.log('当前页面采用html播放器！');
                    setTimeout(() => {
                        //$('[data-title=点击播放] canvas').click()
                        //$('[data-title=点击静音] canvas').click()

                        var player = window.player
                        player.changeVolume(setting.volume)
                        player.changePlaybackRate(setting.rate)
                        player.videoPlay()
                        msg('log','开始播放')
                        var totalTime = player.getMetaDate().duration
                        setTimeout(() => {
                            if (setting.fast == 0) {
                                player.videoSeek(0)
                            } else {
                                msg('log', '当前是秒刷模式')
                                player.videoSeek(parseInt(totalTime))
                            }
                        }, 500);
                        setInterval(() => {
                            play_time = player.time
                            console.log(`当前秒${play_time}总秒${totalTime}`)
                            if (parseInt(play_time) >= parseInt(totalTime)) {
                                msg('log', '当前视频观看完毕，跳转中')
                                find_next($course)
                                start_learning($next_course)
                            }
                        }, setting.jump_time);
                    }, 1000);
                }
            }, setting.viedo_wait_time);
        } else {
            console.log('当前是文档')
        }
    }
    function get_course() {
        var $course_list = $('.itemtitle')
        var $course
        // $course_list.css('border', '3px solid red')
        if ($('.current').length == 0) {
            $.each($course_list, function (indexInArray, valueOfElement) {
                var $this = $(this)
                // console.log('课程名字'+$this.text()+'分数'+$this.attr('score')+'播放地址'+$this.attr('href'))
                if (is_compleated($this)) {
                    console.log('已找到' + $this.text())
                    $course = $this
                    return false
                }
                // console.log($(this).text())
            });
            return $course
        } else {
            $course = $('.current').find('.itemtitle')
            if (is_compleated($course)) {
                find_next($course)
                return $next_course
            } else {
                return $course
            }
        }


    }

    function find_next($course) {
        var $chapter = $course.parent().parent().parent()
        var chapter_id = parseInt($chapter.attr('id').replace('listitem', ''))
        var next_par_id = chapter_id + 1
        console.log('next par id is' + next_par_id)
        var $next_chapter = $(`#listitem${next_par_id}`)
        if ($course.parent().is(':last-child')) {
            if ($chapter.parent().is(':last-child')) {
                console.log('已经是最后一章了')
                return null
            } else {
                $next_course = $next_chapter.find('.itemtitle:first')
                console.log('当前判断课程' + $next_course.text())
                if (is_compleated($next_course)) {
                    find_next($next_course)
                } else {
                    console.log('下一个任务为：' + $next_course.text())
                }
            }
        } else {
            $next_course = $course.parent().next().find('.itemtitle')
            console.log('当前判断课程' + $next_course.text())
            if (is_compleated($next_course)) {
                find_next($next_course)
            } else {
                console.log('该课程还未观看：' + $next_course.text())
            }
        }
    }
    function jump_to_course($course) {
        $course[0].click(function (e) {
            e.preventDefault();
        });
    }
    function is_video() {
        if ($('div[id^=videobox]').length != 0 || $('div[id^=video]').length != 0) {
            return true
        } else {
            return false
        }
    }
    function is_compleated($course) {
        if ($course.attr('score') == '10') {
            return true
        } else {
            return false
        }
    }