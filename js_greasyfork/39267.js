// ==UserScript==
// @name         战旗剧场模式窗口全屏
// @namespace    com.van.zq
// @version      2.7
// @description  每秒检查是否开启了剧场模式，开启则隐藏窗口内其他元素。
// @author       van
// @match        *://www.zhanqi.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39267/%E6%88%98%E6%97%97%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F%E7%AA%97%E5%8F%A3%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/39267/%E6%88%98%E6%97%97%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F%E7%AA%97%E5%8F%A3%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {

    //判断是否是直播页面
    if(document.getElementById("js-room-super-panel")) {

    	window.getZIndex = function (e) {
	        var z = window.document.defaultView.getComputedStyle(e).getPropertyValue('z-index');
	        if (isNaN(z)) return window.getZIndex(e.parentNode);
	        return z;
	    };

	    window.getStyle = function(className, name) {
	        var element = document.getElementsByClassName(className)[0];
	        return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
	    };

        window.checkAndSetDisplay = function(element, value) {
    		if(element){
				element.style.display = value;
    		}
        };

	    //是否已经隐藏面板
        window.theaterEnabled = false;

        //检查页面布局
	    window.checkLayoutMode = function() {
	        if(document.getElementsByClassName("topBar-bg").length > 0) {
	            //横版菜单布局
	            return 1;
	        } else {
	            //竖版菜单布局
	            return 0;
	        }
	    };

	    //判断是否剧场模式
	    window.isTheaterMode = function() {
	        if(layoutMode == 1 && getStyle("topBar-bg","display") == "none") {
	           return true;
	        } else if (layoutMode == 0 && getZIndex(starLeftPanel) == 0) {
	            return true;
	        } else {
	            return false;
	        }
	    };

	    window.check = function() {
	        //判断是否剧场模式，是否需要隐藏窗口
	        if(isTheaterMode() && !theaterEnabled) {
                theaterEnabled = true;
	            chatPanel.style.width = "0px";
	            flashPanel.style.width = "100%";
	            giftPanel.style.zIndex = 0;
                giftPanel.style.display = "none";

	            //隐藏竖版面板
	            if(layoutMode == 0) {
	                starLoginPanel.style.display = "none";
	                checkAndSetDisplay(starTopPanel, "none");
	                checkAndSetDisplay(starButtomPanel, "none");
	            }
	        } else if(!isTheaterMode() && theaterEnabled) {
                theaterEnabled = false;
	            chatPanel.style.width = "340px";
	            giftPanel.style.zIndex = 13;
                giftPanel.style.display = "block";

	            if(layoutMode == 0) {
	                starLoginPanel.style.display = "block";
	                checkAndSetDisplay(starTopPanel, "block");
	                checkAndSetDisplay(starButtomPanel, "block");
	            }
	        }
	    };

	    //竖版登录面板
	    var starLoginPanel = document.getElementsByClassName("live-room-side")[0];
	    //竖版页首面板
	    var starTopPanel = document.getElementsByClassName("live-stars-top")[0];
	    //竖版底部面板
	    var starButtomPanel = document.getElementsByClassName("live-stars-bottom")[0];
	    //竖版左面板，用于判断是否剧场模式
	    var starLeftPanel = document.getElementsByClassName("live-side-content")[0];

	    //礼物面板
	    var giftPanel = document.getElementsByClassName("js-room-fun-area")[0];
	    //聊天窗口
	    var chatPanel = document.getElementById("js-right-chat-panel");
	    //主播放窗口
	    var flashPanel = document.getElementById("js-flash-panel");

	    var layoutMode = checkLayoutMode();

	    //每隔1秒检查一次是否剧场模式
	    window.setInterval(check,1000);
	} else {
		console.log("非直播页面，“战旗剧场模式窗口全屏”脚本将不会运行。");
	}

})();