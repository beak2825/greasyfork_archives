// ==UserScript==
// @name         公需课屏蔽答题|挂机刷课时
// @namespace    https://greasyfork.org/
// @version      1.35
// @description  中山会计学会网校在线课程屏蔽答题，进入课程列表后，等待7秒会自动跳转未学习完成的视频页，等待7秒后自动进行播放视频，播放结束后会返回课程列表然后再等待7秒继续播放下一节未完成课程
// @author       Salitt
// @match        https://zswlxy.zsskjxh.org.cn/*
// @UpdateDate	 2020-07-21 10:03:02
// @Note		 1.屏蔽了答题弹窗 2.实现了自动观看未完成的课程 3.视频播放结束后会自动返回目录进行下一个课程 4.新增按学分进行观看补足时长
// @downloadURL https://update.greasyfork.org/scripts/407478/%E5%85%AC%E9%9C%80%E8%AF%BE%E5%B1%8F%E8%94%BD%E7%AD%94%E9%A2%98%7C%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/407478/%E5%85%AC%E9%9C%80%E8%AF%BE%E5%B1%8F%E8%94%BD%E7%AD%94%E9%A2%98%7C%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE%E6%97%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(document).ready(function() {
        player.setVolume(0.0) //设置音量（0-1区间）
        console.log("已屏蔽答题，脚本运作成功");
        player.on('ended',
        function() { //播放到结尾时提示换片
            $("div:contains('学习课程')").click(); //返回课程目录
            console.log("已播放到结尾时提示换片");
        });
        player.on('pause',
        function(flag) {
            autoplay_sw = 0; //暂停会中止自动播放
            console.log("autoplay_sw=0");
        });
        player.on('play',
        function() {
            autoplay_sw = 1; //恢复自动播放
            console.log('恢复自动播放');
        });
    });
    var autoplay_sw = "";
    function save_xf1() { //计算需要播放时长
        var c_xf = $("tr:contains('继续学习')").children("td:nth-child(3)").children("span:nth-child(1)").html();
        var t_xf = $("tr:contains('继续学习')").children("td:nth-child(3)").children("span:nth-child(2)").html();
        var xf_min = parseInt(t_xf) - parseInt(c_xf);
        localStorage.setItem('xf_min', xf_min);
        console.log('保存學分：' + xf_min);
    }

    function save_xf2() { //计算需要播放时长
        var c_xf = $("tr:contains('开始学习')").children("td:nth-child(3)").children("span:nth-child(1)").html();
        var t_xf = $("tr:contains('开始学习')").children("td:nth-child(3)").children("span:nth-child(2)").html();
        var xf_min = parseInt(t_xf) - parseInt(c_xf);
        localStorage.setItem('xf_min', xf_min);
        console.log('保存學分' + xf_min);
    }
    setTimeout(function() {
        autoplay_sw = 1;
        console.log("autoplay_sw=1");
        var arr1 = $("a:contains('继续学习')");
        if (arr1.length >= 1) { //判断"继续学习"数量>=1
            console.log('点击“继续学习”');
            save_xf1();//保存所需学分时长
            localStorage.setItem('xf_con', "1");
            arr1[0].click(); //点击进去
        } else {
			var arr2 = $("a:contains('开始学习')");
            if (arr2.length >= 1) { //否则判断"开始学习"数量>=1
                console.log('点击“开始学习”');
                save_xf2();//保存所需学分时长
                arr2[0].click(); //点击进去
            }
        }
    },
    7000);//7秒计时

    setInterval(function() { //定时器函数
        randomTime = 999999; //答题弹出时间
        $("title").html("播放中(" + timing + "/" + localStorage.xf_min * 60 + ")"); //标题显示播放进度
        if (autoplay_sw == 1) {
            playerKZ.guanbi(player); //播放视频
            $(".play-jump").click(); //播放历史记录
            popUp = null; //清空答题
            console.log("继续播放");
        } else {
            console.log("脚本运行中");
        }
        if (localStorage.xf_con == "1") {
            var xf_stop = localStorage.xf_min * 60 * 1000;//按所需学分时长，定时返回
            var stop = setTimeout(function() {
                $("div:contains('学习课程')").click(); //返回课程目录
            },
            xf_stop);
        }
    },
    7000) //7秒计时

})();