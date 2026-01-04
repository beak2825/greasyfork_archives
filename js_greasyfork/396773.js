// ==UserScript==
// @name        微博原图展开和下载
// @namespace   Violentmonkey Scripts
// @match       https://www.weibo.com/*
// @grant       none
// @version     2.0
// @author      zbutfly@gmail.com
// @description 为微博多图条目添加原图载入按钮
// @icon		data:image/webp;base64,UklGRiwCAABXRUJQVlA4ICACAACQDwCdASpgAGAAPpFCmUklpCIhKrQLULASCWkACwLnM7lZUD3qPhhyfoi4EJqYEkijj1eyOYmT3IYhtxgy+BGpwZDnJebEYh8xoDtcQGJwfXR6XKUsDp8ImRstvpI9QDDlilTxpA7kcdGt/DL01It0ORjvjrZdFshyhgDOqb2u0sSMxP4AAP75WILI9izCJ90U/ymzkAkChdxajHRzZduKaHsdj1+2UJNefVhNU13bUAPiqJsdwBBpOrKaP5IEU7r53aXsSsXcLRe+kMYBXu1yVLxOBbqz5FzIX0RejZ9rMQ4JezrYUOPmp2+nW63W5ZTyR4L1Kb6dYBQad9bw7txNBTLTh+0tHFjHb+iUGu44OJbc59XGEu0e95Du9epPGLsCjkKOTjpoQEVTQOG6VQX9JFLIBf1tS3TX1dcrcoE4AwJuz/DQqdfVAzkCKGorgYfGEEh07+04xxg84GWco2z0EZapsSzjJ+I5rtWG0v0YP+O4n6QalKIK3Yen+6+lF4np3zOYHprBKtih8L23RFapNjSV1cX/BiR3S52ev9J5OndAgVhpeex6DCEUkRV9l42knag8br10z3f2g/3iZdXGBgYGcnWtARJDCbnUHGcMStX/diAZtkphXJz19NMWf1k3YlsHc0IDJOgUe1sAntBhE+w9NTprFM4ezX2WFD7cosQxHWTRYCKQ2hC4uYI7CbgoCd8uBMxuNS+pMR45QAAA
// @downloadURL https://update.greasyfork.org/scripts/396773/%E5%BE%AE%E5%8D%9A%E5%8E%9F%E5%9B%BE%E5%B1%95%E5%BC%80%E5%92%8C%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/396773/%E5%BE%AE%E5%8D%9A%E5%8E%9F%E5%9B%BE%E5%B1%95%E5%BC%80%E5%92%8C%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

; (function () { // eslint-disable-line
	var create_expand = function () {
		var backward = function (e, cn) {
			while (e.previousSibling) {
				e = e.previousSibling;
				if (e.classList && e.classList.contains(cn)) return e;
			}
			if (e.parentElement) return backward(e.parentElement, cn);
		}
		var panels = document.getElementsByClassName("WB_media_a_mn");
		for (var i = 0; i < panels.length; i++) {
			var info = backward(panels[i], "WB_info");
			var btn = document.createElement('a');
			btn.text = "载入所有原图";
			btn.style.cursor = 'pointer';
			btn.onclick = expand;
			btn.style["margin-left"] = "3em";
			info.append(btn);

			btn = document.createElement('a');
			btn.text = "手机页面链接（无需认证）";
			btn.style.cursor = 'pointer';
			//suda-uatrack="key=feed_headnick&value=pubuser_nick:4477343520831412
			//suda-uatrack="key=feed_headnick&value=transuser_nick:4477320427113626"
			var match = /key=[^&]+&value=[^:]+:(\d+)/.exec(info.children[0].getAttribute('suda-uatrack'));
			if (!match) continue;
			btn.href = "https://m.weibo.cn/detail/" + match[1];
			btn.target = "_blank";
			btn.style["margin-left"] = "3em";
			info.append(btn);
		}
	}

	var expand = function (event) {
		var backward = function (e, cn) {
			while (e.previousSibling) {
				e = e.previousSibling;
				if (e.classList && e.classList.contains(cn)) return e;
			}
			if (e.parentElement) return backward(e.parentElement, cn);
		}
		var panel = event.target.parentElement.parentElement.getElementsByClassName("WB_media_a_mn")[0];
		var text = backward(panel, "WB_text");
		event.target.parentElement.append(document.createElement('hr'));
		var masonry = document.createElement('div');
		// masonry.classList.add('masonry');

		var imgdiv = document.createElement('div');
		for (var i = 0; i < panel.children.length; i++) {
			var li = panel.children[i];
			var img = li.children[0];
			if (img.tagName !== "IMG") continue;
			var dst = img.src.replace(/sinaimg.cn\/[^/]+\//, 'sinaimg.cn/large/');

			var img = document.createElement('img');
			img["image-seq"] = i;
			img.style['max-height'] = '150px';
			img.style['max-width'] = '85%';
			img.onload = e => e.target.title = '原图' + (e.target['image-seq'] + 1) + "，原始大小：" + e.target.naturalWidth + " x " + e.target.naturalHeight;
			img.onclick = e => {
				var zout = '80vh' !== e.target.style['max-height'];
				for (var ii = 0; ii < e.target.parentElement.children.length; ii++) e.target.parentElement.children[ii].style['max-height'] = '150px';
				if (zout) e.target.style['max-height'] = '80vh'
			}
			img.style.padding = '0.5em';
			img.src = dst;

			imgdiv.append(img);
		}
		event.target.parentElement.append(imgdiv);
		event.target.parentElement.append(document.createElement('hr'));
	}

	var topbtn = function () {
		var ele = document.getElementsByClassName('box');
		if (ele.length == 0) {
			console.info("等待网页载入……");
			setTimeout(topbtn, 5);
		} else {
			ele = ele[0];
			ele.removeAttribute("href");
			ele.title = "点击启用加载原图按钮";
			ele.onclick = create_expand;
			ele.style.filter = "invert(100%)"

			// ele = document.getElementsByClassName('W_swficon')[0];
			// ele.style.cursor = "pointer";
			// ele.style.border = "solid 1px";
			// ele.style["padding-top"] = "2px";
			// ele.title = "点击启用加载原图按钮";
			// ele.style.filter = "invert(100%)"
			// ele.onclick = create_expand;

			console.info("点击左上角反色LOGO启用。");

			// var style = document.createElement("style");
			// style.id = 'masonry-style';
			// style.type = 'text/css';
			// var css = ".masonry {-moz-column-count:3; /* Firefox */ -webkit-column-count:3; /* Safari 和 Chrome */ column-count:3; -moz-column-gap: 2em; -webkit-column-gap: 2em; column-gap: 2em; width: 80%; margin:2em auto;}";
			// css += "\n.masonry-item {padding: 0.3em; margin-bottom: 0.3em; -moz-page-break-inside: avoid; -webkit-column-break-inside: avoid; break-inside: avoid; background: #f60;}";
			// css += "\n.masonry-item img {max-width: 30%}";
			// style.textContent = css;
			// document.head.appendChild(style);
		}
	}

	document.onreadystatechange = function () {
		if (document.readyState === "complete") topbtn();
		else console.debug("document change: " + document.readyState);
	}

	document.addEventListener('DOMContentLoaded', (event) => {
		console.log('DOM fully loaded and parsed');
	});
}());
