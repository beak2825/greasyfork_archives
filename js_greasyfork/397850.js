// ==UserScript==
// @name              周瑜打黄盖
// @namespace         https://www.baidu.com
// @version           1.0.3
// @icon              https://www.baidu.com/favicon.ico
// @description       在爱奇艺等网页播放界面添加单独的小窗播放视频
// @author            realicing
// @license           MIT
// @supportURL        https://www.baidu.com
// @match             *.le.com/*
// @match             https://www.bilibili.com/bangumi/play/
// @match             *.iqiyi.com/*
// @match             *.youku.com/*
// @match             *.letv.com/*
// @match             *v.qq.com/*
// @match             *.tudou.com/*
// @match             *.mgtv.com/*
// @match             *.sohu.com/*
// @run-at            document-idle
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397850/%E5%91%A8%E7%91%9C%E6%89%93%E9%BB%84%E7%9B%96.user.js
// @updateURL https://update.greasyfork.org/scripts/397850/%E5%91%A8%E7%91%9C%E6%89%93%E9%BB%84%E7%9B%96.meta.js
// ==/UserScript==
(function () {
    // alert("start");
    var list = [
        "https://api.lhh.la/vip/?url=",
        "http://www.82190555.com/index/qqvod.php?url=",
        "http://jiexi.071811.cc/jx2.php?url=",
        "http://beaacc.com/api.php?url=",
        "https://www.administratorw.com/admin.php?url=",
        "http://www.lvxingjiaju.com/jiexi/?url=",
        "http://jx.xiaozhaoyy.cn/?url=",
        "http://vip.77o.net/jiexi/?v=",
        "https://by.dybhn.com/index.php?url=",
        "https://www.playm3u8.cn/jiexi.php?url=",
        "http://vip.jlsprh.com/index.php?url=",
    ];
    var list2 = [];
    var URL_START_LIST = [
        "https://www.iqiyi.com/v_",
        "https://v.qq.com/x/cover/",
        "https://v.youku.com/v_show/",
        "https://video.tudou.com/v/",
        "https://www.mgtv.com/b/",
        "http://www.le.com/ptv/vplay/",
        "https://tv.sohu.com/v/",
        "https://www.bilibili.com/bangumi/play/",
        // "",
    ];
    var curUrl = window.location.toString();
    var needInitVideo = false;
    main();
    function main() {
        URL_START_LIST.forEach(item => {
            needInitVideo |= curUrl.startsWith(item);
        });
        if (needInitVideo) {
			initMenu('menuPanel', '切换');
            initVideo(curUrl);
            initButtons(curUrl);
            listenUrlChange((curUrl, newUrl) => {
                // alert("listenUrlChange curUrl = " + curUrl);
                // alert("listenUrlChange newUrl = " + newUrl);
                initVideo(newUrl);
                initButtons(newUrl);
            });
        }
    }
    //监听url变化
    function listenUrlChange(callBack) {
        setTimeout(() => {
            var newUrl = window.location.toString();
            if (curUrl !== newUrl) {
                callBack && callBack(curUrl, newUrl);
                curUrl = newUrl;
            }
            listenUrlChange(callBack);
        }, 500);
    }
    function initButtons(srcLink) {
        if (buttonsPanel == null) {
            buttonsPanel = document.createElement('div');
			buttonsPanel.id = 'buttonsPanel';
            buttonsPanel.setAttribute("style", `
                position: fixed;
                z-index: 10000;
                left: 45vw;
                top: 2vw;
                background: #3385ff;
                padding: 10px;
                box-shadow: 0 0 10px #002761;
                border-radius: 3px;
                color: white;`);
        }
        var html = `<div class="btn-area">`;
        list.forEach(item => {
            var link = item + srcLink;
            html += `<a href="` + link + `">
                        <button>` + item + `</button>
                     </a></br>`;
        });
        list2.forEach(({name, value}) => {
            var link = value + srcLink;
            html += `<a href="` + link + `">
                        <button>` + name + `</button>
                     </a></br>`;
        });
        html += `</div>`;
        buttonsPanel.innerHTML = html;
		buttonsPanel.style.visibility = 'visible';
        document.body.appendChild(buttonsPanel);
    }
    //播放
    function initVideo(link) {
        if (videoPanel == null) {
            videoPanel = document.createElement('div');
			videoPanel.id = 'videoPanel';
            videoPanel.setAttribute("style", `
                position: fixed;
                z-index: 100000000001;
                width: 40vw;
                height: 30vw;
                left: 5vw;
                top: 2vw;
                background: #3385ff;
                padding: 0;
                box-shadow: 0 0 10px #002761;
                border-radius: 1px;
                color: white;`);
        }
        var html = `<iframe position="sticky" top="30px" right="5px" width="100%" height="100%" src="https://api.tv920.com/vip/?url=` + link +
            `" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="allowfullscreen"  mozallowfullscreen="mozallowfullscreen"  msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" ></iframe>
	`;
        videoPanel.innerHTML = html;
		videoPanel.style.visibility = 'visible';
        document.body.appendChild(videoPanel);
    }
	//菜单
    function initMenu(id, name) {
		var menuPanel = document.createElement('div');
		menuPanel.id = id;
		menuPanel.setAttribute("style", `
			position: fixed;
			z-index: 100000000001;
			left: 0vw;
			top: 2vw;
			background: #3385ff;
			padding: 10px;
			box-shadow: 0 0 10px #002761;
			border-radius: 3px;
			color: white;`);
        var html = `<input type="button" onclick="showOrHiddenVideo();" value="` + name + `"></br>`;
        menuPanel.innerHTML = html;
        document.body.appendChild(menuPanel);
	}
    // alert("end");
})();

var videoPanel;
var buttonsPanel;
var isShowVideo = true;
function showOrHiddenVideo() {
	isShowVideo = !isShowVideo;
	// showOrHidden(videoPanel);
	showOrHidden(buttonsPanel);
	videoPanel.style.width = isShowVideo ? '40vw' : '0vw';
}
function showOrHidden(panel) {
	if (isShowVideo) {
		document.body.appendChild(panel);
	} else {
		document.body.removeChild(panel);
	}
}