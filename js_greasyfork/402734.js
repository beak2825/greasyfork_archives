// ==UserScript==
// @name        工厂收电加电
// @namespace   Violentmonkey Scripts
// @match       https://wqs.jd.com/pingou/dream_factory/*.html*
// @grant       none
// @version     3.0
// @author      修改自XiaoYuan 2.11
// @description 2020/5/6 下午5:48
// @downloadURL https://update.greasyfork.org/scripts/402734/%E5%B7%A5%E5%8E%82%E6%94%B6%E7%94%B5%E5%8A%A0%E7%94%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/402734/%E5%B7%A5%E5%8E%82%E6%94%B6%E7%94%B5%E5%8A%A0%E7%94%B5.meta.js
// ==/UserScript==

(function()
 {
	console.log('奥利给！！！京喜工厂自动收取双倍电力，开干~');

	setTimeout(function()
    {
			lifecycle();
	}, 2000);
 }
)();


function lifecycle()
{
	let timeid = setInterval(function()
    {
       //自动加电
        if (document.querySelector(".icon_add_num"))
        {
            var b = document.querySelector(".icon_add_num").innerText;
            var a = b.substr(0,4)
            console.log("电力值 ->> " + a);
            a = parseFloat(a);
            if(a <= 2000)
            {
                console.log("需要加电了")
                let iconBtn = document.querySelector(".icon.icon_add");
                iconBtn.click();
                clearInterval(timeid);
				setTimeout(function()
                {
					lifecycle();
				 }, 3000)
            }
        }


        //自动收电
		if (document.querySelector(".alternator-num-n"))
        {
			var num = document.querySelector(".alternator-num-n").innerText;
			console.log("监测电力值 ->> " + num);
			num = parseFloat(num);
			if (num >= 300)
            {
				console.log("电力值到300啦")
				let alternatorBtn = document.querySelector("#alternator");
				alternatorBtn && alternatorBtn.click();
				clearInterval(timeid);
				setTimeout(function()
                {
					let btn = document.querySelector(".simple_dialog_btn");
					btn && btn.click();
					lifecycle();
				 }, 2000)
			}
		}
        else if (document.querySelector(".floating_title"))
        {
			var secStr = document.querySelector(".floating_title").innerText;
			console.log("监测倒计时 ->> " + secStr);
			if (secStr === "已完成")
            {
				console.log("完成啦")
				clearInterval(timeid);
				history.back();
				setTimeout(function()
                {
					lifecycle();
				}, 2000)
			}
            else if (secStr === "30s" || secStr === "10s")
            {
				console.log("滑动页面")
                document.getElementById("pin-like").scrollIntoView();
			}
		}
	}, 1000);
}