// ==UserScript==
// @author			ъыь <Als@admin.ru.net> http://juick.com/Als/
// @name			Nyaa unhider
// @description		Reveals hidden torrents on Nyaa.eu
// @include			http*://www.nyaa.eu/
// @include			http*://www.nyaa.eu/?offset=*
// @include			http*://www.nyaa.se/
// @include			http*://www.nyaa.se/?offset=*
// @version			1.0.3
// @namespace       https://greasyfork.org/users/15812
// @downloadURL https://update.greasyfork.org/scripts/12520/Nyaa%20unhider.user.js
// @updateURL https://update.greasyfork.org/scripts/12520/Nyaa%20unhider.meta.js
// ==/UserScript==


	var all_links = getElementsByXPath("//td[@class='tlistname']/a", document.getElementsByClassName("tlist")[0]);
	var ptid = 0;
	for (var link = 0; link < all_links.length; link++) {
		var node = all_links[link];
		var tid = parseFloat(node.href.split("tid=")[1]);
		if (!ptid) {
		ptid = tid;
		continue;
		}
		if (ptid - tid < 2) {
			for (var temp = 1; temp < ptid - tid; temp++) {
				hid_tor_tr = insert_row(temp+tid);
				node.parentNode.parentNode.parentNode.insertBefore(hid_tor_tr, node.parentNode.parentNode);
			}
		} else if (ptid - tid == 2) {
			hid_tor_tr = insert_row(tid+1);
			node.parentNode.parentNode.parentNode.insertBefore(hid_tor_tr, node.parentNode.parentNode);
		}
		ptid = tid;
	}
	
	function insert_row(tid)  {
		var hid_tor_tr = document.createElement("tr");
		hid_tor_tr.setAttribute("class", "hidden tlistrow");
		hid_tor_tr.setAttribute("style", "height: 39px;");
		var hid_tor_td = document.createElement("td");
		hid_tor_td.setAttribute("class", "tlistname");
		hid_tor_td.setAttribute("colspan", "8");
		hid_tor_td.setAttribute("style", "padding-left: 87px;");
		var hid_tor_a = document.createElement("a");
		hid_tor_a.setAttribute("href", "http://www.nyaa.eu/?page=torrentinfo&tid=" + tid);
		hid_tor_a.textContent = "Probably hidden unknown torrent";
		hid_tor_td.appendChild(hid_tor_a);
		hid_tor_tr.appendChild(hid_tor_td);
		return hid_tor_tr;
	}
	
	function getElementsByXPath(xpath, root){
		var result = document.evaluate(xpath, root, null, 0, null);
		var nodes = new Array();
		i = 0;
		while (node = result.iterateNext()) {
			nodes[i] = node;
			i++;
		}
		return nodes;
	}