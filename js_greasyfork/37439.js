// ==UserScript==
// @name         Danbooru Previewer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Put on your mouse cursor on the image to preview
// @author       rung-rung
// @match        http://danbooru.donmai.us/*
// @match        https://danbooru.donmai.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37439/Danbooru%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/37439/Danbooru%20Previewer.meta.js
// ==/UserScript==

(function() {
    //画像サイズの倍率 1で100%
    var IMAGE_SIZE = 1;

    //プレビュー画像の不透明度 1にすると全く透過せず、0に近づくほど透明になる
    var OPACITY = 0.8;

    //プレビューを表示する待機時間 単位はミリ秒
    var WAIT_TIME = 1000;

    var isMouseMove = false;
    function openPreview() {
        if (isMouseMove == true) {
            var rect = thumb.getBoundingClientRect();
            var screenHeight = document.documentElement.clientHeight;
            if (rect.height < rect.width) {
                img.style.height = 'auto';
                img.style.width = `${screenHeight * IMAGE_SIZE}px`;
            } else {
                img.style.width = 'auto';
                img.style.height = `${screenHeight * IMAGE_SIZE}px`;
            }
            var parent = thumb.parentNode.parentNode.parentNode;
            img.setAttribute('src', parent.getAttribute('data-large-file-url'));
            previewWindow.style.display = 'block';
        }
	}

    var previewWindow = document.createElement("div");
    previewWindow.setAttribute('id', 'preview-window');
    var img = document.createElement('img');
    previewWindow.appendChild(img);
    document.body.appendChild(previewWindow);

    //スタイルシートをまとめて動的に設定するhttp://d.hatena.ne.jp/acid-panda/20110307/1299517528
    var css = (function() {
        var s = document.createElement('style');
        s.setAttribute("type", "text/css");
        document.getElementsByTagName('head').item(0).appendChild(s);
        var ss = s.sheet;
        return function(sel, sty) {
            ss.insertRule(sel + "{" + sty + "}", 0);
        };
    })();

    css('#preview-window', `
        display: none;
        position: fixed;
        z-index: 99999;
        pointer-events: none;
        top: 0px;
        left: 0px;
    `);
    css('#preview-window img', `
        opacity: ${OPACITY};
        pointer-events: none;
    `);

    var timeOutID;
    var thumb;
	function addPreviewEventToThumbnail() {
		thumbnail = document.evaluate('//article//img[not(contains(@preview, "true"))]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; i < thumbnail.snapshotLength; i++) {
			const imgEle = thumbnail.snapshotItem(i)
		    imgEle.setAttribute('preview', 'true');

			const tags = imgEle.getAttribute('alt')
			if (tags.match(/animated/)) {continue}

			imgEle.onmouseover = function() {thumb = this;
											 timeOutID = setTimeout(function() {openPreview();}, WAIT_TIME);
											};
			imgEle.onmouseout = function() {clearTimeout(timeOutID);
											previewWindow.style.display = 'none';
										   };
        }
	}

	addPreviewEventToThumbnail();
	//Autopagerizeに対応
    var mouseMoveTimeout;
	window.onmousemove = (function (e) {
        clearTimeout(mouseMoveTimeout);
		addPreviewEventToThumbnail();
        isMouseMove = true;
        mouseMoveTimeout = setTimeout(function() {isMouseMove = false;}, WAIT_TIME+500);
	});
})();