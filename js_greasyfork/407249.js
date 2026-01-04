// ==UserScript==
// @name         Bj职业技能学习视频Auto学习脚本(自动快进发布版)
// @namespace    http://tampermonkey.net/
// @version      0.03
// @author       Greasyfork
// @description  声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!
// @match        https://www.bjjnts.cn/lessonStudy/*
// @Declare      声明:本脚本仅供学习和研究参考使用,请勿用于其它非法用途.使用本脚本所造成的任何影响,由用户自己负责!
// @downloadURL https://update.greasyfork.org/scripts/407249/Bj%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91Auto%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%28%E8%87%AA%E5%8A%A8%E5%BF%AB%E8%BF%9B%E5%8F%91%E5%B8%83%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407249/Bj%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91Auto%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%28%E8%87%AA%E5%8A%A8%E5%BF%AB%E8%BF%9B%E5%8F%91%E5%B8%83%E7%89%88%29.meta.js
// ==/UserScript==
var ax5684 = [
    'setTimeout',
    'log',
    'myTool',
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
    'url',
    '#myVideo',
    'attr',
    'src',
    'maxTime',
    'play',
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
    'Disable\x20old\x20Video.Create\x20MyVideo',
    'createElement',
    'VIDEO',
    'setAttribute',
    'width',
    '920',
    'height',
    '500',
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
    'duration',
    '/editVideoChapter/',
    'currentTime',
    'addEventListener',
    'timeupdate',
    'play\x20Skip\x20Check',
    'myVideo\x20Continue',
    'pause',
    'seeked',
    'ended',
    'myVideo\x20timeupdate:Update\x20learnTime\x20',
    'toString',
    '/addstudentTaskVer2/',
    'play\x20ended.',
    'myVideo\x20play\x20end:Update\x20learnTime\x20',
    '.lesson-',
    '\x20.course_study_menuschedule',
    'html',
    '已完成<br>100%',
    '已完成<br>0%',
    'data-lock',
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
    'width:920px;height:20px;color:red;margin-left:15px;',
    'innerHTML'
];
var ax1af3 = function (ax309baa, ax29a3be) {
    ax309baa = ax309baa - 0x0;
    var ax1d4e82 = ax5684[ax309baa];
    return ax1d4e82;
};
(function () {
    'use strict';
    window[ax1af3('0x0')](ax37739d, 0xbb8);
    var ax196bc7;
    var ax344b73;
    function ax37739d() {
        console[ax1af3('0x1')](ax1af3('0x2'));
        ax1e7d86();
        var ax2ffad9 = document[ax1af3('0x3')](ax1af3('0x4'));
        $(ax1af3('0x5'))[ax1af3('0x6')](ax1af3('0x7'));
        $(ax1af3('0x5'))[ax1af3('0x7')](function () {
            var ax392d0d = $(this)[ax1af3('0x8')](ax1af3('0x9'));
            if (check_network_protocol_support() === ![] && ax392d0d == 0x1) {
                return ![];
            }
            ax196bc7 = $(this);
            $(this)[ax1af3('0xa')](ax1af3('0xb'))[ax1af3('0xc')]('on');
            $(this)[ax1af3('0xd')]('li')[ax1af3('0xe')]()[ax1af3('0xf')](ax1af3('0xb'))[ax1af3('0x10')]('on');
            $(this)[ax1af3('0xa')](ax1af3('0xb'))[ax1af3('0xe')]()[ax1af3('0x10')]('on');
            lessonNum = $(this)[ax1af3('0x8')](ax1af3('0x11'));
            lessonid = $(this)[ax1af3('0x8')](ax1af3('0x12'));
            isface = $(this)[ax1af3('0x8')](ax1af3('0x13'));
            faceTime = $(this)[ax1af3('0x8')](ax1af3('0x14'));
            learnDuration = parseInt($(this)[ax1af3('0x8')](ax1af3('0x15')));
            maxTime = parseInt($(this)[ax1af3('0x8')](ax1af3('0x15')));
            faceSign = 0x0;
            faceSignTime = 0x0;
            currentTime = 0x0;
            oldTime = 0x0;
            $[ax1af3('0x16')](ax1af3('0x17') + courseid + '/' + lessonid, function (ax192804) {
                url = ax192804[ax1af3('0x8')][ax1af3('0x18')];
                $(ax1af3('0x19'))[ax1af3('0x1a')](ax1af3('0x1b'), url);
                ax2ffad9[ax1af3('0x1b')] = url;
                console[ax1af3('0x1')](ax1af3('0x1c'), maxTime);
                ax2ffad9[ax1af3('0x1d')]();
                console[ax1af3('0x1')](ax2ffad9);
            });
        });
        layer[ax1af3('0x1e')](ax1af3('0x1f') + ax1af3('0x20') + ax1af3('0x21') + ax1af3('0x22'), { 'icon': 0x6 });
    }
    function ax1e7d86() {
        $(ax1af3('0x23'))[ax1af3('0x24')](ax1af3('0x25'), ax1af3('0x26'));
        $(ax1af3('0x23'))[ax1af3('0x27')]();
        console[ax1af3('0x1')](ax1af3('0x28'));
        var axab4dad = document[ax1af3('0x29')](ax1af3('0x2a'));
        console[ax1af3('0x1')](ax1af3('0x4'), axab4dad);
        axab4dad[ax1af3('0x2b')]('id', ax1af3('0x4'));
        axab4dad[ax1af3('0x2b')](ax1af3('0x2c'), ax1af3('0x2d'));
        axab4dad[ax1af3('0x2b')](ax1af3('0x2e'), ax1af3('0x2f'));
        axab4dad[ax1af3('0x2b')](ax1af3('0x30'), ax1af3('0x31'));
        axab4dad[ax1af3('0x2b')](ax1af3('0x32'), ax1af3('0x33'));
        axab4dad[ax1af3('0x2b')](ax1af3('0x34'), ax1af3('0x35'));
        var ax41cf9c = document[ax1af3('0x36')](ax1af3('0x37'));
        console[ax1af3('0x1')](ax41cf9c);
        ax41cf9c[0x0][ax1af3('0x38')](axab4dad);
        var ax3ab74d = ax3dd42d();
        ax41cf9c[0x0][ax1af3('0x38')](ax3ab74d);
        axab4dad[ax1af3('0x39')] = function () {
            var ax3179fe = axab4dad[ax1af3('0x3a')];
            duration = parseInt(ax3179fe);
            $[ax1af3('0x16')](ax1af3('0x3b') + courseid + '/' + lessonid, { 'duration': duration });
            currentTime = duration - 0xa;
            axab4dad[ax1af3('0x3c')] = currentTime;
            if (ax344b73 && ax344b73 != 0x0) {
                clearInterval(ax344b73);
            }
        };
        axab4dad[ax1af3('0x3d')](ax1af3('0x3e'), ax5f1dc6);
        axab4dad[ax1af3('0x3d')](ax1af3('0x1d'), function (ax4dee89) {
            console[ax1af3('0x1')](ax1af3('0x3f'));
            console[ax1af3('0x1')](ax1af3('0x40'));
        });
        axab4dad[ax1af3('0x3d')](ax1af3('0x41'), function (ax1b899e) {
            currentTime = parseInt(axab4dad[ax1af3('0x3c')]);
        });
        axab4dad[ax1af3('0x3d')](ax1af3('0x42'), function (axfb361e) {
            currentTime = parseInt(axab4dad[ax1af3('0x3c')]);
        });
        axab4dad[ax1af3('0x3d')](ax1af3('0x43'), ax21856e);
    }
    function ax5f1dc6() {
        if (currentTime - oldTime >= 0x3c && currentTime > learnDuration) {
            console[ax1af3('0x1')](ax1af3('0x44') + currentTime[ax1af3('0x45')]());
            $[ax1af3('0x16')](ax1af3('0x46') + courseid + '/' + lessonid, { 'learnTime': currentTime });
            oldTime = currentTime;
        }
        if (ax196bc7) {
            if (ax196bc7[ax1af3('0x8')](ax1af3('0x15')) < currentTime) {
                ax196bc7[ax1af3('0x8')](ax1af3('0x15'), currentTime);
            }
        }
    }
    function ax21856e() {
        console[ax1af3('0x1')](ax1af3('0x47'));
        maxTime = duration;
        learnDuration = duration;
        currentTime = duration;
        if (duration - maxTime > 0x1 && duration != learnDuration) {
            myVideo[ax1af3('0x3c')] = maxTime;
            return;
        }
        console[ax1af3('0x1')](ax1af3('0x48') + duration[ax1af3('0x45')]());
        $(ax1af3('0x49') + lessonNum + ax1af3('0x4a'))[ax1af3('0x4b')](ax1af3('0x4c'));
        var ax1118cb = lessonNum + 0x1;
        $(ax1af3('0x49') + ax1118cb + ax1af3('0x4a'))[ax1af3('0x4b')](ax1af3('0x4d'));
        $(ax1af3('0x49') + ax1118cb)[ax1af3('0x1a')](ax1af3('0x4e'), '0');
        $[ax1af3('0x4f')](ax1af3('0x12'), lessonid);
        $[ax1af3('0x16')](ax1af3('0x46') + courseid + '/' + lessonid, { 'learnTime': duration });
        setTimeout(function () {
            $(ax1af3('0x49') + ax1118cb)[ax1af3('0x7')]();
        }, 0x3e8);
        console[ax1af3('0x1')](ax1af3('0x50'));
    }
    function ax3dd42d() {
        console[ax1af3('0x1')](ax1af3('0x51'));
        var ax596e54 = document[ax1af3('0x29')](ax1af3('0x52'));
        console[ax1af3('0x1')](ax1af3('0x52'), ax596e54);
        ax596e54[ax1af3('0x2b')]('id', ax1af3('0x53'));
        ax596e54[ax1af3('0x2b')](ax1af3('0x54'), ax1af3('0x55'));
        ax596e54[ax1af3('0x56')] = ax8ec6a0;
        ax596e54[ax1af3('0x57')][ax1af3('0x58')] = ax1af3('0x59');
        ax596e54[ax1af3('0x5a')] = ax1af3('0x21');
        return ax596e54;
    }
    function ax8ec6a0() {
        if (ax344b73 && ax344b73 != 0x0) {
            clearInterval(ax344b73);
        }
    }
    function ax42ae34(ax600bea) {
        let ax3939d4 = parseInt(ax600bea);
        let ax247c58 = 0x0;
        let ax4717a1 = 0x0;
        if (ax3939d4 > 0x3c) {
            ax247c58 = parseInt(ax3939d4 / 0x3c);
            ax3939d4 = parseInt(ax3939d4 % 0x3c);
            if (ax247c58 > 0x3c) {
                ax4717a1 = parseInt(ax247c58 / 0x3c);
                ax247c58 = parseInt(ax247c58 % 0x3c);
            }
        }
        let ax2d89c5 = ax3939d4 > 0x9 ? ax3939d4 : '0' + ax3939d4;
        if (ax247c58 > 0x0) {
            ax2d89c5 = (ax247c58 > 0x9 ? ax247c58 : '0' + ax247c58) + ':' + ax2d89c5;
        } else {
            ax2d89c5 = '00' + ':' + ax2d89c5;
        }
        if (ax4717a1 > 0x0) {
            ax2d89c5 = (ax4717a1 > 0x9 ? ax4717a1 : '0' + ax4717a1) + ':' + ax2d89c5;
        } else {
            ax2d89c5 = '00' + ':' + ax2d89c5;
        }
        return ax2d89c5;
    }
}());