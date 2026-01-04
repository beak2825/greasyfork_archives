// ==UserScript==
// @name                    Native Media Controls
// @name:es                 Controles Multimedia Nativos
// @name:ja                 ネイティブメディアコントロール
// @name:ko                 기본 미디어 컨트롤
// @name:zh-CN              本地媒体控制
// @name:uk                 управління нативними засобами масової інформації
// @name:pt-PT              Controlos de Meios Nativos
// @description             This script attempts to replace Twitter media controls with your browsers native media controls.
// @description:es          Este script intenta reemplazar los controles multimedia de Twitter por los controles multimedia nativos de tu navegador.
// @description:ja          このスクリプトは、Twitterのメディアコントロールをブラウザのネイティブメディアコントロールに置き換えようとするものです。
// @description:ko          이 스크립트는 트위터 미디어 컨트롤을 브라우저의 기본 미디어 컨트롤로 대체하려고 시도합니다.
// @description:zh-CN       这个脚本试图用你的浏览器的本地媒体控件替换Twitter的媒体控件。
// @description:uk          Цей скрипт намагається замінити елементи керування мультимедіа Twitter на власні елементи керування мультимедіа вашого браузера.
// @description:pt-PT       Este script tenta substituir os controlos multimédia do Twitter pelos controlos multimédia nativos do seu navegador.
// @namespace               NativeMediaControls
// @match                   https://twitter.com/*
// @match		    		https://x.com/*
// @version                 1.0.6
// @author                  Rej <rejdesu@pm.me>
// @license                 MIT
// @icon                    data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="256" height="256" viewBox="0 0 256 256"%3E%3Cg fill="white"%3E%3Cpath d="M216 48H40a8 8 0 0 0-8 8v112a8 8 0 0 0 8 8h176a8 8 0 0 0 8-8V56a8 8 0 0 0-8-8Zm-104 96V80l48 32Z" opacity=".2"%2F%3E%3Cpath d="m164.44 105.34l-48-32A8 8 0 0 0 104 80v64a8 8 0 0 0 12.44 6.66l48-32a8 8 0 0 0 0-13.32ZM120 129.05V95l25.58 17ZM216 40H40a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 128H40V56h176v112Zm16 40a8 8 0 0 1-8 8H32a8 8 0 0 1 0-16h192a8 8 0 0 1 8 8Z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E
// @run-at                  document-start
// @downloadURL https://update.greasyfork.org/scripts/468090/Native%20Media%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/468090/Native%20Media%20Controls.meta.js
// ==/UserScript==
!(function (d) {
	var k = 0;

	function goagain() {
		for (let e of document.getElementsByTagName("video")) {
			e.setAttribute("controls", "controls");
			let rmv = e.parentElement.parentElement.nextElementSibling;
			if (rmv) {
				rmv.remove();
			}
		}
		k += 1;
		if (k < 1000) {
			setTimeout(() => {
				goagain();
			}, 1000);
		}
	}
	goagain();
})(document);
