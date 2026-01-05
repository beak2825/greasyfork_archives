// ==UserScript==
// @name         解锁WD MyCloud (Gen2) 隐藏功能
// @namespace    http://www.zhangminghao.com
// @homepage     https://greasyfork.org/scripts/28821
// @version      1.2
// @description  解锁WD MyCloud (Gen2) 隐藏的功能
// @author       张明浩
// @include        http://192.168.*
// @include     /^https?://.*\.remotewd\.com:8543/.*$/
// @run-at        document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/28821/%E8%A7%A3%E9%94%81WD%20MyCloud%20%28Gen2%29%20%E9%9A%90%E8%97%8F%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/28821/%E8%A7%A3%E9%94%81WD%20MyCloud%20%28Gen2%29%20%E9%9A%90%E8%97%8F%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {var css = [
	"/* enable hidden apps & function */",
	"  .b1 #apps_function,",
	"  .b1 #app_install_tb,",
	"  .b1 #SubMenuDiv #p2p,",
	"  .b1 #SubMenuDiv #ftp_downloads,",
	"  .b1 #SubMenuDiv #web_file_server,",
	"  .b1 #SubMenuDiv #cloud_backups,",
	"  .b1 #SubMenuDiv #camera_backups,",
	"  .b1 #mainbody #power_recover_div,",
	"  .b1 #mainbody #power_sch_div,",
	"  .b1 #mainbody #rserver_div,",
	"  .b1 #mainbody #iso_div,",
	"  .b2 #home_shutdown_link {",
	"    display: block !important;",
	"  }",
    	"  .b1 #webdav_tr {",
    	"    display: table-row !important;",
	"  }",
	"  ",
	"  /* fix navigation bar */",
	"  .b3 #main_nav > ul {width: 912px !important;}",
	"  .b3 #main_nav > ul > li {width: 114px !important;}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();