// ==UserScript==
// @name         B站倍速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  设置B站播放速度
// @author       李不言
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @require       http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/433312/B%E7%AB%99%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/433312/B%E7%AB%99%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 等待_selector元素出现
     * @param {选择器} _selector 
     * @param {回调函数} func 
     * @param {尝试时间，可用默认} times 
     * @param {间隔时间，默认100ms} interval 
     * @returns 
     */
    jQuery.fn.wait = function(_selector, func, times, interval) {
        var _times = times || -1,
        //100次
        _interval = interval || 100,
        //100毫秒每次
        _self = this,
        // _selector = this.selector, // jquery 3.0中没有this.selector
        //选择器
        _iIntervalID; //定时器id
        if (this.length) { //如果已经获取到了，就直接执行函数
            console.debug('元素出现')
            func && func.call(this);
        } else {
            _iIntervalID = setInterval(function() {
                console.debug('重新获取')
                if (!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; //如果是正数就 --
                _self = $(_selector); //再次选择
                if (_self.length) { //判断是否取到
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            },
            _interval);
        }
        return this;
    }

    function toast(msg, duration){
		duration = isNaN(duration) ? 3000 : duration;
		var m = document.createElement('div');
		m.innerHTML = msg;
		m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
		
		document.body.appendChild(m);
		setTimeout(function() {
			var d = 0.5;
			m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
			m.style.opacity = '0';
			setTimeout(function() { document.body.removeChild(m) }, d * 1000);
		}, duration);
	}

    window.onload = function() {
		console.info('窗口加载成功');

		var debug = false;
		if (debug) {
			console.debug = console.info;
		}


	    // 检查标签是否存在
	    if (document.getElementsByClassName("video-data").length <= 0) {
	    	console.debug("video-data不存在");
	    	return;
	    }

	    /**
	     * [设置播放速度]
	     * @param {[float]} speedRate [播放速度]
	     */
	    function setSpeedRate(speedRate) {
			speedRate = speedRate.toPrecision(2)
			document.getElementsByClassName("bilibili-player-video-btn-speed-menu-list")[5].textContent = speedRate + "x";
			document.getElementsByClassName("bilibili-player-video-btn-speed-menu-list")[5].setAttribute("data-value", speedRate);
			document.getElementsByClassName("bilibili-player-video-btn-speed-menu-list")[5].click();
			console.log("倍速设置为", speedRate);
			toast("倍速设置为" + speedRate, 500);
		}

		$('.bilibili-player-video-btn-speed-menu-list').wait('.bilibili-player-video-btn-speed-menu-list' ,() => {
			console.info('bilibili-player-video-btn-speed-menu-list加载成功');

			// 新增一个减速的播放按钮
			var speedSubstractButton = document.createElement("button");
			speedSubstractButton.id = "speedSubstractButton";
			speedSubstractButton.textContent = "减速";
			speedSubstractButton.style.textAlign = "center";
			speedSubstractButton.onclick = function() {
			    var oriSpeedRate = Number(document.getElementsByClassName("bilibili-player-video-btn-speed-menu-list")[5].getAttribute("data-value"));
			    var newSpeedRate = oriSpeedRate - 0.1;
			    setSpeedRate(newSpeedRate);
			}
			document.getElementsByClassName("video-data")[0].appendChild(speedSubstractButton);
			console.log("新增减速按钮");

			// 新增一个加速的播放按钮
			var speedAddButton = document.createElement("button");
			speedAddButton.id = "speedAddButton";
			speedAddButton.textContent = "加速";
			speedAddButton.style.textAlign = "center";
			speedAddButton.onclick = function() {
			    var oriSpeedRate = Number(document.getElementsByClassName("bilibili-player-video-btn-speed-menu-list")[5].getAttribute("data-value"));
			    // 从1.0倍开始
			    oriSpeedRate = oriSpeedRate > 1.0 ? oriSpeedRate : 1.0;
			    var newSpeedRate = oriSpeedRate + 0.1;
			    setSpeedRate(newSpeedRate);
			}
			document.getElementsByClassName("video-data")[0].appendChild(speedAddButton);
			console.log("新增加速按钮");
		});

		document.onkeydown = function(event) {
			console.debug("点击按钮", event);
			if (event.code == "KeyD") {
				speedAddButton.click();
			} else if (event.code == "KeyS") {
				speedSubstractButton.click();
			}
		}
	}

})();