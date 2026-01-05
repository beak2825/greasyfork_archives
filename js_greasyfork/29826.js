// ==UserScript==
// @name        KomicaVideo2_Unblock_R18
// @description 解除R18屏蔽
// @author      f1238762001
// @include     *mymoe.moe*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/17404
// @downloadURL https://update.greasyfork.org/scripts/29826/KomicaVideo2_Unblock_R18.user.js
// @updateURL https://update.greasyfork.org/scripts/29826/KomicaVideo2_Unblock_R18.meta.js
// ==/UserScript==

var img_src = document.getElementsByClassName("img_src");
for (let i in img_src) {
	let img = img_src[i].getElementsByClassName("img")[0];
	if (img.src.match(/https:\/\/imgs\.moe\/h.?\..?/)) {
		// 要顯示的縮圖
		img.src = img.alt;
		img.style.width = "auto";
		img.style.height = "auto";
		// 建立a元素
		let image_a = document.createElement("a");
		// 大圖連結
		image_a.href = img.title;
    image_a.target = "_blank";
		image_a.appendChild(img);
		// 附加到parent上 
		// 結構從 img_container -> img_src -> img 
		// 變成 img_container -> img_src -> a -> img
		img_src[i].appendChild(image_a);
	}
}