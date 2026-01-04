// ==UserScript==
// @name         好书友论坛自动刷在线任务
// @namespace    https://greasyfork.org/users/433510
// @version      0.3
// @description  限定好书友论坛专用，自动签到，每2分钟自动刷新，自动领取在线奖励
// @author       lingyer
// @match        http://www.93haoshu.com/plugin.php?id=miner:miner
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394996/%E5%A5%BD%E4%B9%A6%E5%8F%8B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%88%B7%E5%9C%A8%E7%BA%BF%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/394996/%E5%A5%BD%E4%B9%A6%E5%8F%8B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%88%B7%E5%9C%A8%E7%BA%BF%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

//自动刷新部分源码源自shenyi的S1挂机脚本https://greasyfork.org/zh-CN/scripts/393812-s1%E6%8C%82%E6%9C%BA/code
//特此致谢

(function() {
    'use strict';

    //判断在线奖励是否已经领完，若领完则退出脚本
    var txt_onlinetime = document.getElementById("online_time").firstChild.nodeValue;
    //console.log(txt_onlinetime);
    if (txt_onlinetime.indexOf("已领完") != -1) {
        console.log("在线奖励已领完，直接退出");
        return; //在线奖励已领完，直接退出
    }

    //自动领在线奖励
    var lnk_onlinegift = document.getElementById("online_link");
    //console.log(lnk_onlinegift);
    if (lnk_onlinegift.href.indexOf("plugin.php") != -1) {
			//console.log("在线奖励触发");
			lnk_onlinegift.click();
    } else { //自动签到
 	    var btn_sign = document.getElementById("fx_checkin_b");
		if (btn_sign.alt.indexOf("已") == -1) {
			//console.log("自动签到触发");
			btn_sign.click();
        }
    }

    var title, time;

    //自动刷新
    config(countdown);

    // 配置
    function config(callback) {
        sessionStorage.oixmRefreshTime=120 //添加行，赋值刷新时间为120秒，阻止弹出设置窗口
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 120));
            if (isNaN(time)) return;
            sessionStorage.oixmRefreshTime = time;
        } else {
            time = parseInt(sessionStorage.oixmRefreshTime);
        }
        callback();
    }

    // 启动倒数
    function countdown() {
        title = document.title;
        loop();
    }

    // 循环时间
    function loop() {
        document.title = "[" + time + "s] " + title; //更新title中显示的倒数时间
        if (time === 0) {
            location.reload();
            return;
        }
        time--;
        setTimeout(loop, 1000); //每秒loop一次
    }

})();