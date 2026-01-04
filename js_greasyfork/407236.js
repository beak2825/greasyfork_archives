// ==UserScript==
// @name         Bj职业技能学习视频Auto学习脚本(发布板)
// @namespace    http://tampermonkey.net/
// @version      0.15
// @author       Greasyfork
// @description  声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!
// @match        https://www.bjjnts.cn/lessonStudy/*
// @Declare      声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!
// @downloadURL https://update.greasyfork.org/scripts/407236/Bj%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91Auto%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%28%E5%8F%91%E5%B8%83%E6%9D%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407236/Bj%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91Auto%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%28%E5%8F%91%E5%B8%83%E6%9D%BF%29.meta.js
// ==/UserScript==
var ax5b4c = [
    'setTimeout',
    'getElementById',
    'myVideo',
    '.change_chapter',
    'unbind',
    'click',
    'data',
    'lock',
    'parent',
    '.course_study_sonmenu',
    'addClass',
    'parents',
    'siblings',
    'find',
    'removeClass',
    'lessonnum',
    'lessonid',
    'isface',
    'facetime',
    'learnduration',
    'post',
    '/lessonStudy/',
    'code',
    'url',
    'learnDuration',
    'duration',
    '#myVideo',
    'attr',
    'src',
    'alert',
    '脚本初始化完成!<br>',
    '版本:Auto学习快速版<br>',
    '声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!',
    '<br><br>点击课程目录开始播放',
    '#studymovie',
    'css',
    'dispaly',
    'none',
    'hide',
    'log',
    'Disable\x20old\x20Video.Create\x20MyVideo',
    'createElement',
    'VIDEO',
    'setAttribute',
    'width',
    '920',
    'height',
    '450',
    'display',
    'block',
    'disabled',
    'true',
    'controls',
    'false',
    'getElementsByClassName',
    'course_study_videobox',
    'appendChild',
    'onloadedmetadata',
    'innerHTML',
    '正在观看视频,当前进度:\x20',
    'toFixed',
    '%\x20\x20播放速度:\x20×',
    'toString',
    'addEventListener',
    'timeupdate',
    'play',
    'play\x20Skip\x20Check',
    'myVideo\x20Continue',
    'pause',
    'currentTime',
    'seeked',
    'myVideo\x20timeupdate:Update\x20learnTime\x20',
    '/addstudentTaskVer2/',
    'update',
    'play\x20ended.',
    'myVideo\x20play\x20end:Update\x20learnTime\x20',
    '.lesson-',
    '\x20.course_study_menuschedule',
    'html',
    '已完成<br>100%',
    '已完成<br>0%',
    'data-lock',
    'ended',
    'cookie',
    'Update\x20learnTime\x20finished',
    'Create\x20label',
    'label',
    'showMsg',
    'title',
    '双击停止观看',
    'onclick',
    'style',
    'cssText',
    'height:20px;color:red;margin:10px;display:block;',
    '声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!\x20\x20\x20\x20点击课程目录开始播放.',
    'playStepTag',
    'margin-left:10px;color:green;',
    '倍速:\x20',
    'playStep',
    'width:40px;margin-left:24px;cursor:pointer;color:green;border:solid\x201px;display:inline-block;text-align:center;'
];
var ax5eca = function (ax282f9e, ax5028e0) {
    ax282f9e = ax282f9e - 0x0;
    var ax5cfde3 = ax5b4c[ax282f9e];
    return ax5cfde3;
};
(function () {
    'use strict';
    window[ax5eca('0x0')](ax489dbe, 0xbb8);
    var ax239e8d;
    var ax30c2ea;
    var ax52a1af = 0x1;
    function ax489dbe() {
        ax598316();
        var ax4b2d50 = document[ax5eca('0x1')](ax5eca('0x2'));
        $(ax5eca('0x3'))[ax5eca('0x4')](ax5eca('0x5'));
        $(ax5eca('0x3'))[ax5eca('0x5')](function () {
            var ax10d1b7 = $(this)[ax5eca('0x6')](ax5eca('0x7'));
            if (check_network_protocol_support() === ![] && ax10d1b7 == 0x1) {
                return ![];
            }
            ax239e8d = $(this);
            $(this)[ax5eca('0x8')](ax5eca('0x9'))[ax5eca('0xa')]('on');
            $(this)[ax5eca('0xb')]('li')[ax5eca('0xc')]()[ax5eca('0xd')](ax5eca('0x9'))[ax5eca('0xe')]('on');
            $(this)[ax5eca('0x8')](ax5eca('0x9'))[ax5eca('0xc')]()[ax5eca('0xe')]('on');
            lessonNum = $(this)[ax5eca('0x6')](ax5eca('0xf'));
            lessonid = $(this)[ax5eca('0x6')](ax5eca('0x10'));
            isface = $(this)[ax5eca('0x6')](ax5eca('0x11'));
            faceTime = $(this)[ax5eca('0x6')](ax5eca('0x12'));
            maxTime = parseInt($(this)[ax5eca('0x6')](ax5eca('0x13')));
            faceSign = 0x0;
            faceSignTime = 0x0;
            currentTime = 0x0;
            oldTime = 0x0;
            $[ax5eca('0x14')](ax5eca('0x15') + courseid + '/' + lessonid, function (ax4b19b8) {
                if (ax4b19b8[ax5eca('0x16')] == 0xc8) {
                    url = ax4b19b8[ax5eca('0x6')][ax5eca('0x17')];
                    learnDuration = ax4b19b8[ax5eca('0x6')][ax5eca('0x18')];
                    duration = ax4b19b8[ax5eca('0x6')][ax5eca('0x19')];
                    maxTime = ax4b19b8[ax5eca('0x6')][ax5eca('0x18')];
                    currentTime = learnDuration;
                    url = ax4b19b8[ax5eca('0x6')][ax5eca('0x17')];
                    $(ax5eca('0x1a'))[ax5eca('0x1b')](ax5eca('0x1c'), url);
                    ax4b2d50[ax5eca('0x1c')] = url;
                }
            });
        });
        layer[ax5eca('0x1d')](ax5eca('0x1e') + ax5eca('0x1f') + ax5eca('0x20') + ax5eca('0x21'), { 'icon': 0x6 });
    }
    function ax598316() {
        $(ax5eca('0x22'))[ax5eca('0x23')](ax5eca('0x24'), ax5eca('0x25'));
        $(ax5eca('0x22'))[ax5eca('0x26')]();
        console[ax5eca('0x27')](ax5eca('0x28'));
        var ax360e62 = document[ax5eca('0x29')](ax5eca('0x2a'));
        ax360e62[ax5eca('0x2b')]('id', ax5eca('0x2'));
        ax360e62[ax5eca('0x2b')](ax5eca('0x2c'), ax5eca('0x2d'));
        ax360e62[ax5eca('0x2b')](ax5eca('0x2e'), ax5eca('0x2f'));
        ax360e62[ax5eca('0x2b')](ax5eca('0x30'), ax5eca('0x31'));
        ax360e62[ax5eca('0x2b')](ax5eca('0x32'), ax5eca('0x33'));
        ax360e62[ax5eca('0x2b')](ax5eca('0x34'), ax5eca('0x35'));
        var ax276802 = document[ax5eca('0x36')](ax5eca('0x37'));
        console[ax5eca('0x27')](ax276802);
        ax276802[0x0][ax5eca('0x38')](ax360e62);
        var ax6eac07 = ax77ac60();
        ax276802[0x0][ax5eca('0x38')](ax6eac07);
        ax276802[0x0][ax5eca('0x38')](ax59b5f9());
        ax276802[0x0][ax5eca('0x38')](ax5b0297(0x1));
        ax276802[0x0][ax5eca('0x38')](ax5b0297(0x3));
        ax276802[0x0][ax5eca('0x38')](ax5b0297(0x5));
        ax276802[0x0][ax5eca('0x38')](ax5b0297(0xa));
        ax276802[0x0][ax5eca('0x38')](ax5b0297(0x3c));
        ax276802[0x0][ax5eca('0x38')](ax5b0297(0x64));
        ax360e62[ax5eca('0x39')] = function () {
            if (ax30c2ea && ax30c2ea != 0x0) {
                clearInterval(ax30c2ea);
            }
            ax6eac07[ax5eca('0x3a')] = ax5eca('0x3b') + ax39f43f(currentTime) + '\x09\x09' + (currentTime * 0x64 / duration)[ax5eca('0x3c')](0x2) + ax5eca('0x3d') + ax52a1af[ax5eca('0x3e')]();
            ax30c2ea = setInterval(() => {
                currentTime += ax52a1af;
                if (currentTime > duration) {
                    currentTime = duration;
                }
                ax6eac07[ax5eca('0x3a')] = ax5eca('0x3b') + ax39f43f(currentTime) + '\x09\x09' + (currentTime * 0x64 / duration)[ax5eca('0x3c')](0x2) + ax5eca('0x3d') + ax52a1af[ax5eca('0x3e')]();
                ax3910c2();
                if (currentTime >= duration) {
                    if (ax30c2ea && ax30c2ea != 0x0) {
                        clearInterval(ax30c2ea);
                    }
                    ax2a92c7();
                }
            }, 0x3e8);
        };
        ax360e62[ax5eca('0x3f')](ax5eca('0x40'), ax3910c2);
        ax360e62[ax5eca('0x3f')](ax5eca('0x41'), function (axcfd35c) {
            console[ax5eca('0x27')](ax5eca('0x42'));
            console[ax5eca('0x27')](ax5eca('0x43'));
        });
        ax360e62[ax5eca('0x3f')](ax5eca('0x44'), function (ax16629e) {
            currentTime = parseInt(ax360e62[ax5eca('0x45')]);
        });
        ax360e62[ax5eca('0x3f')](ax5eca('0x46'), function (ax34a75b) {
            currentTime = parseInt(ax360e62[ax5eca('0x45')]);
        });
    }
    function ax3910c2() {
        if (currentTime - oldTime >= 0x3c && currentTime > learnDuration) {
            console[ax5eca('0x27')](ax5eca('0x47') + currentTime[ax5eca('0x3e')]());
            $[ax5eca('0x14')](ax5eca('0x48') + courseid + '/' + lessonid, {
                'learnTime': currentTime,
                'push_event': ax5eca('0x49')
            });
            oldTime = currentTime;
        }
        if (ax239e8d) {
            if (ax239e8d[ax5eca('0x6')](ax5eca('0x13')) < currentTime) {
                ax239e8d[ax5eca('0x6')](ax5eca('0x13'), currentTime);
            }
        }
    }
    function ax2a92c7() {
        console[ax5eca('0x27')](ax5eca('0x4a'));
        maxTime = duration;
        learnDuration = duration;
        currentTime = duration;
        if (duration - maxTime > 0x1 && duration != learnDuration) {
            myVideo[ax5eca('0x45')] = maxTime;
            return;
        }
        console[ax5eca('0x27')](ax5eca('0x4b') + duration[ax5eca('0x3e')]());
        $(ax5eca('0x4c') + lessonNum + ax5eca('0x4d'))[ax5eca('0x4e')](ax5eca('0x4f'));
        var ax1c481f = lessonNum + 0x1;
        $(ax5eca('0x4c') + ax1c481f + ax5eca('0x4d'))[ax5eca('0x4e')](ax5eca('0x50'));
        $(ax5eca('0x4c') + ax1c481f)[ax5eca('0x1b')](ax5eca('0x51'), '0');
        $[ax5eca('0x14')](ax5eca('0x48') + courseid + '/' + lessonid, {
            'learnTime': duration,
            'push_event': ax5eca('0x52')
        }, function (ax395567) {
            if (ax395567[ax5eca('0x16')] == 0xc8) {
                $[ax5eca('0x53')](ax5eca('0x10'), lessonid);
                setTimeout(function () {
                    $(ax5eca('0x4c') + ax1c481f)[ax5eca('0x5')]();
                }, 0x3e8);
                console[ax5eca('0x27')](ax5eca('0x54'));
            }
        });
    }
    function ax77ac60() {
        console[ax5eca('0x27')](ax5eca('0x55'));
        var ax220bd4 = document[ax5eca('0x29')](ax5eca('0x56'));
        ax220bd4[ax5eca('0x2b')]('id', ax5eca('0x57'));
        ax220bd4[ax5eca('0x2b')](ax5eca('0x58'), ax5eca('0x59'));
        ax220bd4[ax5eca('0x5a')] = ax20f661;
        ax220bd4[ax5eca('0x5b')][ax5eca('0x5c')] = ax5eca('0x5d');
        ax220bd4[ax5eca('0x3a')] = ax5eca('0x5e');
        return ax220bd4;
    }
    function ax311002() {
        var ax503bfb = document[ax5eca('0x29')]('Br');
        return ax503bfb;
    }
    function ax59b5f9() {
        var ax410746 = document[ax5eca('0x29')]('a');
        ax410746[ax5eca('0x2b')]('id', ax5eca('0x5f'));
        ax410746[ax5eca('0x5b')][ax5eca('0x5c')] = ax5eca('0x60');
        ax410746[ax5eca('0x3a')] = ax5eca('0x61');
        return ax410746;
    }
    function ax5b0297(ax16e99b) {
        var ax39b458 = document[ax5eca('0x29')]('a');
        ax39b458[ax5eca('0x2b')]('id', ax5eca('0x62') + ax16e99b[ax5eca('0x3e')]());
        ax39b458[ax5eca('0x5a')] = function () {
            ax52a1af = ax16e99b;
        };
        ax39b458[ax5eca('0x5b')][ax5eca('0x5c')] = ax5eca('0x63');
        ax39b458[ax5eca('0x3a')] = '×' + ax16e99b[ax5eca('0x3e')]();
        return ax39b458;
    }
    function ax20f661() {
        if (ax30c2ea && ax30c2ea != 0x0) {
            clearInterval(ax30c2ea);
        }
    }
    function ax39f43f(ax1ba9f8) {
        let ax429ee4 = parseInt(ax1ba9f8);
        let ax9433fe = 0x0;
        let ax416e7b = 0x0;
        if (ax429ee4 > 0x3c) {
            ax9433fe = parseInt(ax429ee4 / 0x3c);
            ax429ee4 = parseInt(ax429ee4 % 0x3c);
            if (ax9433fe > 0x3c) {
                ax416e7b = parseInt(ax9433fe / 0x3c);
                ax9433fe = parseInt(ax9433fe % 0x3c);
            }
        }
        let ax1ee1a8 = ax429ee4 > 0x9 ? ax429ee4 : '0' + ax429ee4;
        if (ax9433fe > 0x0) {
            ax1ee1a8 = (ax9433fe > 0x9 ? ax9433fe : '0' + ax9433fe) + ':' + ax1ee1a8;
        } else {
            ax1ee1a8 = '00' + ':' + ax1ee1a8;
        }
        if (ax416e7b > 0x0) {
            ax1ee1a8 = (ax416e7b > 0x9 ? ax416e7b : '0' + ax416e7b) + ':' + ax1ee1a8;
        } else {
            ax1ee1a8 = '00' + ':' + ax1ee1a8;
        }
        return ax1ee1a8;
    }
}());