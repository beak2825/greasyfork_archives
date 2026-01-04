// ==UserScript==
// @name           南+屏蔽垃圾帖子
// @namespace discuz
// @description This script is adapted from https://greasyfork.org/zh-CN/scripts/5346.Made for south-plus.net.
// @description zh Discuz 论坛在浏览器端屏蔽特定 ID 的ZZ发贴和发言。
// @description 修改来自https://greasyfork.org/zh-CN/scripts/5346
// @include        http*://level-plus.net/*
// @include        http*://south-plus.net/*
// @include        http*://south-plus.org/*
// @include        http*://white-plus.net/*
// @include        http*://imoutolove.me/*
// @include        http*://*.level-plus.net/*
// @include        http*://*.south-plus.net/*
// @include        http*://*.south-plus.org/*
// @include        http*://*.white-plus.net/*
// @include        http*://*.imoutolove.me/*
// @include        http*://*summer-plus.net/*
// @version 1.6
// @downloadURL https://update.greasyfork.org/scripts/431431/%E5%8D%97%2B%E5%B1%8F%E8%94%BD%E5%9E%83%E5%9C%BE%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/431431/%E5%8D%97%2B%E5%B1%8F%E8%94%BD%E5%9E%83%E5%9C%BE%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==


//ID列表
//自行修改和添加，用法：于下方加入想屏蔽的用户名或uid, 用引号包围，半角逗号区隔，比如("天影风炫", "username")，默认屏蔽天影风炫，请自行增加/修改。注意自行备份屏蔽id/uid。
var dogs = new Array();
var uid = new Array( "971501", "1136715", "1426012", "721479", "263547", "1243184", "928123", "1039044", "1411014", "1137863", "180964", "743848","1228793", "275647", "1397135", "1338894", "92996", "1065914", "458681", "832771", "217839", "420383", "1103506", "1386117", "28660", "82813", "732436", "495078", "1132370", "1317163", "329091", "166135", "545253", "271676", "1391769", "1393520", "1021131", "1213979", "1379054", "1369567", "829597", "1386317", "163104", "248543", "919607", "1015406", "1005910", "1024859", "1122833", "66504", "267948", "377716", "914874", "1359412", "372201", "378841", "687032", "1265386", "513382", "267781", "490525", "493805", "42871", "1276213", "378871", "973626", "526481", "238972", "1337757","210207","399599","776349","55568","1275951","1274982","1027498","1318240","453260","973504","398111","57177","10187","1178478","702980","221441","171062","742432","1232772","1115510", "826656", "42448", "24085", "686628", "1065914", "79055", "452816", "1249969", "719476", "1264386", "1124874", "919907", "1250411", "138431", "98766", "203334","1310013","685557","912774","1215604","966517");

// 主题列表页-PC
for (x in dogs) {
	dog = document.evaluate('//table/tbody[2]/tr[td[3]//a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			dog.snapshotItem(i).innerHTML = "";
		}
	}
}

for (x in dogs) {
	dog = document.evaluate('//table/tbody[tr[1]/th[1]/div[2]/a[1]//strong[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			c = dog.snapshotItem(i).firstChild.childNodes[3].textContent.replace(/\s*/g, "").slice(0, 2);
			c = (Number(c) > 9) ? c + "楼" : c;
			dog.snapshotItem(i).innerHTML = "";
			//若不想看到被屏蔽楼层，ID/uid，请将上面一行改为dog.snapshotItem(i).innerHTML = "";
		}
	}
}

//按uid屏蔽
for (x in uid) {
	dog = document.evaluate('//table/tbody[2]/tr[td[3]//a[@href="u.php?action-show-uid-' + uid[x] + '.html"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			dog.snapshotItem(i).innerHTML = "";
		}
	}
}

for (x in uid) {
	dog = document.evaluate('//table/tbody[tr[1]/th[1]/div[2]/a[@href="u.php?action-show-uid-' + uid[x] + '.html"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			c = dog.snapshotItem(i).firstChild.childNodes[3].textContent.replace(/\s*/g, "").slice(0, 2);
			c = (Number(c) > 9) ? c + "楼" : c;
			dog.snapshotItem(i).innerHTML = "";
			//若不想看到被屏蔽楼层，ID/uid，请将上面一行改为dog.snapshotItem(i).innerHTML = "";
		}
	}
}