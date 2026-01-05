
// ==UserScript==
// @name        SelfTrumpDetector
// @namespace   SelfTrumpDetector
// @description Clearly display self trumps and aid comparisons in report page
// @include     https://apollo.rip/reportsv2.php*
// @version     3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29418/SelfTrumpDetector.user.js
// @updateURL https://update.greasyfork.org/scripts/29418/SelfTrumpDetector.meta.js
// ==/UserScript==

// _____________________________________________________________
// _____________ Preferences ___________________________________
//    How to display the file count:
//    1 = Total number of files in torrent (15)
//    2 = Number of tracks out of total files (12/15)
//    3 = Number of tracks plus extra files (12+3)
//    4 = Only the number of tracks (12)
var display = 3;



//    Highlight editions with conflicting track counts:

var checkEditions = true;



//    Highlight torrents with extra files (usually artwork)
//    exceeding this size (in MB; 0 = disable):

var extraSizeLimit = 40;



//    Always show the size of extras when hovering over a
//    torrent size (false = only the highlighted ones):

var tooltipAll = false;


// _____________________________________________________________
// __________ End of Preferences _______________________________

function toBytes(size) {
	var num = parseFloat(size.replace(',', ''));
	var i = ' KMGT'.indexOf(size.charAt(size.length - 2));
	return Math.round(num * Math.pow(1024, i));
}


function toSize(bytes) {
	if (bytes <= 0) return '0 B';
	var i = Math.floor(Math.log(bytes) / Math.log(1024));
	var num = Math.round(bytes / Math.pow(1024, i));
	return num + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}


function addStyle(css) {
	var s = document.createElement('style');
	s.type = 'text/css';
	s.textContent = css;
	document.head.appendChild(s);
}


function setTitle(elem, str) {
	elem.title = str;
	if (window.jQuery && jQuery.fn.tooltipster) {
		jQuery(elem).tooltipster({
			delay: 500,
			maxWidth: 400
		});
	}
}

function getGroupTorrents(torID, addObj) {
	var postObj = $.post(
		'torrents.php?torrentid=' + torID,
		function(r) {
			//Load the authkey from page HTML
			authkey = r.split('var authkey = "')[1].split('"')[0];
			//r is the return HTML from the page load. 
			//Trim out the relevant sections. 
			try {
				groupTitle = r.split("<h2>")[1].split("</h2>")[0]
				groupData = r.split('<div class="main_column">')[1].split('<div class="box torrent')[0];
				groupData = groupData.split("<table class=\"collage")[0];
			} catch (err) {
				groupTitle = "<h2>Page load failed! (" + torID + ")</h2>"
				groupData = "";
			}
			//console.log(groupTitle);
			//console.log(groupData);
			addObj.innerHTML += "<div id="+torID+" style='display: none;'>" + groupData + "</div>";
			$("#"+torID).parent().click(function(){
				hideBlock = this.children[this.children.length-1];
				if (hideBlock.style.display == 'block'){
					hideBlock.style.display = 'none'
				}else{
					hideBlock.style.display = 'block'
				}
			});
			var table = document.getElementById(torID).children[0];
			if (table) {

				var isMusic = 1;
				extraSizeLimit = extraSizeLimit * 1048576;

				addStyle(
					'.gmfc_files { cursor: pointer; }' +
					'.gmfc_extrasize { background-color: rgba(228, 169, 29, 0.12) !important; }'
				);


				table.rows[0].insertCell(1).innerHTML = '<strong>Files</strong>';

				var rows = table.querySelectorAll('.edition, .torrentdetails');
				for (var i = rows.length; i--;) {
					++rows[i].cells[0].colSpan;
				}


				rows = table.getElementsByClassName('torrent_row');
				var editions = {};

				for (var i = rows.length; i--;) {

					var fileRows = rows[i].nextElementSibling.
					querySelectorAll('.filelist_table tr:not(:first-child)');
					var numFiles = fileRows.length;
					var numTracks = 0;

					if (isMusic) {
						var extraSize = 0;

						for (var j = numFiles; j--;) {
							if (/\.(flac|mp3|m4a|ac3|dts)\s*$/i.test(fileRows[j].cells[0].textContent)) {
								++numTracks;
							} else if (extraSizeLimit || tooltipAll) {
								extraSize += toBytes(fileRows[j].cells[1].textContent);
							}
						}

						if (checkEditions) {
							var ed = /edition_\d+/.exec(rows[i].className)[0];
							editions[ed] = ed in editions && editions[ed] !== numTracks ? -1 : numTracks;
						}

						var largeExtras = extraSizeLimit && extraSize > extraSizeLimit;
						if (largeExtras || tooltipAll) {
							var sizeCell = rows[i].cells[1];
							setTitle(sizeCell, 'Extras: ' + toSize(extraSize));
							if (largeExtras) {
								sizeCell.classList.add('gmfc_extrasize');
							}
						}

					} else {
						display = 0;
					}

					var cell = rows[i].insertCell(1);
					cell.textContent = display < 2 ? numFiles : numTracks;
					cell.className = 'gmfc_files';
					if (display != 3) {
						cell.className += ' number_column';
					} else {
						var numExtras = numFiles - numTracks;
						if (numExtras) {
							var sml = document.createElement('small');
							sml.textContent = '+' + numExtras;
							cell.appendChild(sml);
						}
					}
					if (display == 2) {
						cell.textContent += '/' + numFiles;
					}

				}


				if (checkEditions) {
					var sel = '';
					for (var ed in editions) {
						if (editions.hasOwnProperty(ed) && editions[ed] < 1) {
							sel += [sel ? ',.' : '.', ed, '>.gmfc_files'].join('');
						}
					}
					if (sel) addStyle(sel + '{background-color: rgba(236, 17, 0, 0.09) !important;}');
				}


				// Show filelist on filecount click

				table.addEventListener('click', function(e) {

					function get(type) {
						return document.getElementById([type, id].join('_'));
					}

					var elem = e.target.nodeName != 'SMALL' ? e.target : e.target.parentNode;
					if (elem.classList.contains('gmfc_files')) {

						var id = elem.parentNode.id.replace('torrent', '');
						var tEl = get('torrent');
						var fEl = get('files');
						var show = [tEl.className, fEl.className].join().indexOf('hidden') > -1;

						tEl.classList[show ? 'remove' : 'add']('hidden');
						fEl.classList[show ? 'remove' : 'add']('hidden');

						if (show) {
							var sections = ['peers', 'downloads', 'snatches', 'reported', 'logs'];
							for (var i = sections.length; i--;) {
								var el = get(sections[i]);
								if (el) el.classList.add('hidden');
							}
						}

					}
				}, false);

			}
		},
		'html'
	);
	postObj.fail(function() {
		//Failed to get data.
		document.getElementById("mergeOutput").innerHTML = "<h1>Torrent page load failed, aborting.</h1>";
		return;
	})
}

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
		headerObj = curRep.children[1].children[0].children[0].children[1];
		headerBlock = headerObj.innerHTML;
		torLink = headerBlock.split("torrents.php?torrentid=")[1].split("\">")[0];
		getGroupTorrents(torLink,headerObj);
		upUser = headerBlock.split("uploaded by")[1].split("</a>")[0];
		repUser = headerBlock.split("reported by")[1].split("</a>")[0];
		repReason = headerBlock.split("for the reason:")[1].split("<strong>")[1].split("</strong>")[0];
		
		if (repReason.indexOf("Trump") >= 0 || repReason == "Dupe") {
			headerObj2 = curRep.children[1].children[0].children[1].children[1];
			headerBlock2 = headerObj2.innerHTML;
			torLink2 = headerBlock2.split("torrents.php?torrentid=")[1].split("\">")[0];
			getGroupTorrents(torLink2,headerObj2);
		}
		
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
				if (repTor.date == -1 || truTor.date == -1) {
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
