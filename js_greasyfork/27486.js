
// ==UserScript==
// @name        SelfTrumpDetector
// @namespace   SelfTrumpDetector
// @description Clearly display self trumps and aid comparisons in report page
// @include     https://apollo.rip/reportsv2.php*
// @version     2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27486/SelfTrumpDetector.user.js
// @updateURL https://update.greasyfork.org/scripts/27486/SelfTrumpDetector.meta.js
// ==/UserScript==
//Convert the artist to an object. 
function torObj(inputString) {
	this.artist = "-Not Found-";
	this.name = "-Not Found-";
	this.format = "-Not Found-";
	this.size = -1;
	this.log = -1;
	this.cue = false;
	this.date = -1;
	if (inputString.indexOf("Various Artists - ") >= 0) {
		this.artist = "Various Artists";
	}
	if (inputString.indexOf("artist.php?id=") >= 0) {
		this.artist = inputString.split("artist.php?id=")[1].split("\">")[1].split("</a>")[0];
	}
	torrentSplit = inputString.split("torrents.php?");
	if (torrentSplit.length >= 4) {
		this.name = torrentSplit[1].split("\">")[1].split("</a>")[0];
		this.format = torrentSplit[2].split("\">")[1].split("</a>")[0];
		if (torrentSplit.length >= 5) {
			this.log = torrentSplit[3].split("\">")[1].split("</a>")[0];
			this.log = Number(this.log.replace(/[,\(\) Log:%]/g, ''));
			this.size = torrentSplit[3].split("</a>")[1].split("<a href")[0];
		} else {
			this.size = torrentSplit[2].split("</a>")[1].split("<a href")[0];
		}
		this.size = Number(this.size.replace(/[,\(\) CueMB]/g, ''));
		if (torrentSplit[2].indexOf("(Cue)") >= 0) {
			this.cue = true;
		}
	}
	if (inputString.indexOf("class=\"time tooltip\" title=\"") >= 0) {
		this.date = Date.parse(inputString.split("class=\"time tooltip\" title=\"")[1].split("\"")[0]);
	}
	console.log(this.artist + " - " + this.name + " - " + this.format + " - " + this.size + " - " + this.log + " - " + this.cue + " - " + this.date)
}

function escape(s) {
	var n = s;
	n = n.replace(/&/g, "&amp;");
	n = n.replace(/</g, "&lt;");
	n = n.replace(/>/g, "&gt;");
	n = n.replace(/"/g, "&quot;");

	return n;
}

function diffString(o, n) {
	o = o.replace(/\s+$/, '');
	n = n.replace(/\s+$/, '');

	var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));
	var str = "";

	var oSpace = o.match(/\s+/g);
	if (oSpace == null) {
		oSpace = ["\n"];
	} else {
		oSpace.push("\n");
	}
	var nSpace = n.match(/\s+/g);
	if (nSpace == null) {
		nSpace = ["\n"];
	} else {
		nSpace.push("\n");
	}

	if (out.n.length == 0) {
		for (var i = 0; i < out.o.length; i++) {
			str += '<del>' + escape(out.o[i]) + oSpace[i] + "</del>";
		}
	} else {
		if (out.n[0].text == null) {
			for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
				str += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
			}
		}

		for (var i = 0; i < out.n.length; i++) {
			if (out.n[i].text == null) {
				str += '<ins>' + escape(out.n[i]) + nSpace[i] + "</ins>";
			} else {
				var pre = "";

				for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
					pre += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
				}
				str += " " + out.n[i].text + nSpace[i] + pre;
			}
		}
	}

	return str;
}

function diff(o, n) {
	var ns = new Object();
	var os = new Object();

	for (var i = 0; i < n.length; i++) {
		if (ns[n[i]] == null)
			ns[n[i]] = {
				rows: new Array(),
				o: null
			};
		ns[n[i]].rows.push(i);
	}

	for (var i = 0; i < o.length; i++) {
		if (os[o[i]] == null)
			os[o[i]] = {
				rows: new Array(),
				n: null
			};
		os[o[i]].rows.push(i);
	}

	for (var i in ns) {
		if (ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1) {
			n[ns[i].rows[0]] = {
				text: n[ns[i].rows[0]],
				row: os[i].rows[0]
			};
			o[os[i].rows[0]] = {
				text: o[os[i].rows[0]],
				row: ns[i].rows[0]
			};
		}
	}

	for (var i = 0; i < n.length - 1; i++) {
		if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
			n[i + 1] == o[n[i].row + 1]) {
			n[i + 1] = {
				text: n[i + 1],
				row: n[i].row + 1
			};
			o[n[i].row + 1] = {
				text: o[n[i].row + 1],
				row: i + 1
			};
		}
	}

	for (var i = n.length - 1; i > 0; i--) {
		if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
			n[i - 1] == o[n[i].row - 1]) {
			n[i - 1] = {
				text: n[i - 1],
				row: n[i].row - 1
			};
			o[n[i].row - 1] = {
				text: o[n[i].row - 1],
				row: i - 1
			};
		}
	}

	return {
		o: o,
		n: n
	};
}


//Get all report windows on current page. 
if (document.getElementsByClassName("manage_form").length > 0) {
	repArr = document.getElementsByClassName("manage_form")
	for (var i = 0; i < repArr.length; i++) {
		curRep = repArr[i];
		headerBlock = curRep.children[1].children[0].children[0].children[1].innerHTML;
		headerBlock2 = curRep.children[1].children[0].children[1].children[1].innerHTML;
		upUser = headerBlock.split("uploaded by")[1].split("</a>")[0];
		repUser = headerBlock.split("reported by")[1].split("</a>")[0];
		repReason = headerBlock.split("for the reason:")[1].split("<strong>")[1].split("</strong>")[0];
		//console.log(upUser+"|"+repUser);
		if (upUser == repUser) {
			curRep.style.color = "#33AA33"
			curRep.children[1].children[0].children[0].style.color = "#33AA33"
		}
		//console.log(repReason);
		if (repReason.indexOf("Trump") >= 0 || repReason == "Dupe") {
			var repTor = new torObj(headerBlock);
			var truTor = new torObj(headerBlock2);
			testBlock = "";
			if (repTor.artist == truTor.artist) {
				testBlock += "<font size = '3' color = 'Green'>A </font>"
			} else {
				testBlock += "\n<font size = '3' color = 'Red'>A </font>" + diffString(repTor.artist, truTor.artist);
			}
			if (repTor.name == truTor.name) {
				testBlock += "<font size = '3' color = 'Green'>N </font>"
			} else {
				testBlock += "\n<font size = '3' color = 'Red'>N </font>" + diffString(repTor.name, truTor.name);
			}
			if (repTor.format == truTor.format) {
				testBlock += "<font size = '3' color = 'Green'>F </font>"
			} else {
				testBlock += "\n<font size = '3' color = 'Red'>F </font>" + diffString(repTor.format, truTor.format);
			}
			if (repTor.size == truTor.size) {
				testBlock += "<font size = '3' color = 'Green'>S </font>";
			} else if (repTor.size / truTor.size <= 1.01 && repTor.size / truTor.size >= 0.99) {
				testBlock += "<font size = '3' color = 'Green'>S </font> Diff = " + Math.round((truTor.size - repTor.size) * 100) / 100 + " MB, " + Math.round((1 - repTor.size / truTor.size) * 10000) / 100 + "%";
			} else if (repTor.size / truTor.size <= 1.05 && repTor.size / truTor.size >= 0.95) {
				testBlock += "<font size = '3' color = 'Orange'>S </font> Diff = " + Math.round((truTor.size - repTor.size) * 100) / 100 + " MB, " + Math.round((1 - repTor.size / truTor.size) * 10000) / 100 + "%";
			} else {
				testBlock += "<font size = '3' color = 'Red'>S </font> Diff = " + Math.round((truTor.size - repTor.size) * 100) / 100 + " MB, " + Math.round((1 - repTor.size / truTor.size) * 10000) / 100 + "%";
			}
			if (repTor.log <= truTor.log && repTor.cue <= truTor.cue) {
				if (repTor.log < truTor.log || repTor.cue < truTor.cue) {
					testBlock += "<font size = '3' color = 'LimeGreen'>L </font>"
				} else {
					testBlock += "<font size = '3' color = 'Green'>L </font>"
				}
			} else {
				testBlock += "<font size = '3' color = 'Red'>L </font>"
			}
			if (repTor.date >= truTor.date || repReason != "Dupe") {
				errorMsg = ""
				if (repTor.date == -1) {
					errorMsg = "Error, Unable to get date. "
				}
				testBlock += "<font size = '3' color = 'Green'>T </font>" + errorMsg
			} else {
				diffTime = truTor.date - repTor.date;
				diffStr = Math.floor(diffTime / 86400000) + "d" + Math.floor(diffTime % 86400000 / 3600000) + "h" + Math.floor(diffTime % 3600000 / 60000) + "m"
				testBlock += "<font size = '3' color = 'Red'>T </font>" + diffStr
			}
			checkerBlock = "<td class='label'>Torrent Comparison:</td><td colspan='3'>" + testBlock + "</td>"
			var torTable = curRep.children[1];
			checkerRow = torTable.insertRow(2);
			checkerRow.innerHTML = checkerBlock;
		}
	}
}
