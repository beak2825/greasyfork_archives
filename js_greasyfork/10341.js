// ==UserScript==
// @name        GTA:Online Crew Memberlist Fetcher
// @version     1.0
// @description Fetches the memberlist and other relevant information
// @author      Orrie
// @namespace   ludiko
// @include     http://socialclub.rockstargames.com/crew/*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/10341/GTA%3AOnline%20Crew%20Memberlist%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/10341/GTA%3AOnline%20Crew%20Memberlist%20Fetcher.meta.js
// ==/UserScript==
(function() {
	// global vars
	var d = document;

	// script variables
	var sc = {
		v: "1.0",
		m: /memberlist/.test(d.location.href),
		c: d.location.href.match(/crew\/(\w+)/)[1],
		r: ["Leader", "Comm.", "Lt.", "Rep.", "Muscle", "Applicant"],
		u: {
			arr_u: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAQAAABn7dZ6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVAjXY2BgLPauSqpnYoABxpK4ejcGRoZi79LP5X/qamFSJSWlv8q/tPgzVLuUfyn7X/6rNZmB8T9jWWLpr7L/Vd+O9gHVNAVUfAJK/WjMKE0q/V72v+bLwZ5/wmDtrY4Vn8v+l/0Bqa78caTnvyDcxmaXcqAuoPD3EzDVMLfUhVZ8q/q2b/J/EQZ00OS1dwJCGAAXYkZknpRD4wAAAABJRU5ErkJggg==",
			arr_d: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAQAAABn7dZ6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACUSURBVAjXY2CAgv+M9WFbp32VYkADjHWpZT8rfm6f908SRbzFu/xb2f+y/xW/jk76JwoXbgoq/woU/lkKJCt+7pr6Txws3Bxd/r3sf/n35vCS4FKgvsofe6f+E2Oo8oQIt8eAFJVElX4HSR2cwFBqX/Ku7HdDdj0TxNjSpNLv5e9aHYHMYofKiP+MCIcUhzRbMTAAABQDRpIIcY4aAAAAAElFTkSuQmCC"
		}
	},
	g = {m:{}};
	sc.a = "http://socialclub.rockstargames.com/crewapi/"+sc.c+"/hierarchy/1000/true?";
	sc.p = (sc.c == "gtag_pc") ? "<h5>GTAG PC Last Purge: Jun 05 2015</h5>" : "";

	// inserting style into head
	var style = elem("style", "wotstatscript", "", "text/css"),
		styleText = [
			".ludi-div {background-color: #F6F6F6; min-height: 500px; padding: 0 0 25px 0;}",
			".ludi-head {background-color: #E5E5E5; border-bottom: 4px solid #999; padding: 3px 0 3px 0;}",
			".ludi-head h1, .ludi-head h5 {text-align: center;}",
			".ludi-info-table {margin: 0 auto; table-layout: fixed; width: 550px;}",
			".ludi-info-table td {padding: 5px 0px 5px; text-align: center;}",
			".ludi-table {margin: 0px; table-layout: fixed;}",
			".ludi-table tbody tr:hover {background: #E3E3E3;}",
			".ludi-table tbody td:hover {background: #CCC;}",
			".ludi-table th {background-color: #E5E5E5; border-bottom: 2px solid #999; cursor: pointer; font-size: 18px; font-weight: bold; text-align: center;}",
			".ludi-table th:first-of-type {width: 50px;}",
			".ludi-table th.sort-up {background: url("+sc.u.arr_u+") no-repeat right 5px center #CCC;}",
			".ludi-table th.sort-down {background: url("+sc.u.arr_d+") no-repeat right 5px center #CCC;}",
			".ludi-table td {font-size: 14px;padding: 5px 0px 5px; text-align: center; }",
			".ludi-table td:first-of-type {width: 50px;}",
			".ludi-table td a {color: #333;}",
			".ludi-table td a:hover {color: #F90;}",
			".ludi-good {color: #4D7326;}",
			".ludi-bad {color: #CD3333;}"
		];
		style.textContent = styleText.toString().replace(/\}(,)/g,"}\n");
		d.head.appendChild(style);

	// inserting functions into head as scripts
	var scripts = [fetchCrew];
	for (var _j=0; _j<scripts.length; ++_j) {
	var script = elem("script", "ludi", "", "text/javascript");
		script.textContent = scripts[_j].toString();
		d.head.appendChild(script);
	}

	// add link to memberlist - content is delayed
	var intSeq = 0,
		interval = setInterval(function() {
		var crewTabs = d.getElementById('crewtabs');
			intSeq ++;
			if (crewTabs !== null ) {
				crewTabs.appendChild(elem("li", (sc.m) ? "active" : "", "<a class='ludi-tablist' href='/crew/"+sc.c+"/memberlist'>Memberlist</a>"));
				clearInterval(interval);
			}
			else if (intSeq == 5) {
				clearInterval(interval);
			}
		}, 1000);

	// initiate script only if at memberlist page
	if (sc.m) {
		reqHnd(sc.a, gtagHnd);
	}

	// crew function
	function gtagHnd(resp) {
	var data = JSON.parse(resp.responseText).data.hierarchy.Data;
		g.crewId = data.CrewId;
		g.crewName = data.CrewName;
		g.crewTag = data.CrewTag;
		g.crewTotal = data.Total;
		for (var _g=0; _g<data.Ranks.length; _g++) { // data.Ranks.length // 4
			var memData = data.Ranks[_g].Members;
			for (var _gm=0; _gm<memData.length; _gm++) {
				g.m[memData[_gm].Name] = {
					"memId": memData[_gm].RockstarId,
					"memName": memData[_gm].Name,
					"memUrl": "http://socialclub.rockstargames.com/member/"+memData[_gm].Name,
					"memRank": (!memData[_gm].DateJoined) ? sc.r[5] : sc.r[memData[_gm].RankOrder],
					"memJoin": (!memData[_gm].DateJoined) ? "--" : memData[_gm].DateJoined
				};
			}
		}

		// add table
		var pageDiv = d.getElementById('page'), memCount = 0,
		mDiv = elem("div", "ludi-div", "<div class='ludi-head'><h1>Memberlist Fetcher "+sc.v+"</h1>"+sc.p+"<table class='ludi-info-table'><tr><td>Crew Name:</td><td>Crew Tag:</td><td>Crew ID:</td><td>Member Count:</td></tr><tr><td class='js-crewName'>"+g.crewName+"</td><td>"+g.crewTag.toUpperCase()+"</td><td>"+g.crewId+"</td><td>"+g.crewTotal+"</tr></table></div>"),
		mTable = elem("table", "ludi-table sortable", "<thead><tr><th data-sort-method='number'>#</th><th>Name</th><th data-sort-method='rank'>Rank</th><th data-sort-method='date'>Join Date</th><th>Main Crew</th></tr></thead><tbody></tbody>");
		for (var _r in g.m) {
			if (g.m.hasOwnProperty(_r)) {
				memCount++;
				mTable.lastElementChild.appendChild(elem("tr", "", "<td>"+memCount+"</td><td><a class='nickname userPop' href='"+g.m[_r].memUrl+"' data-nickname='"+g.m[_r].memName+"' data-id='"+g.m[_r].memId+"'>"+g.m[_r].memName+"</a></td><td>"+g.m[_r].memRank+"</td><td>"+g.m[_r].memJoin+"</td><td id='"+g.m[_r].memName+"' onmouseover='fetchCrew(this)'>Hover to Fetch</td>"));
			}
		}
		mDiv.appendChild(mTable);
		pageDiv.appendChild(mDiv);

		// activate tablesort function
		new Tablesort(mTable);

		// removing elements
		var load_class = d.getElementsByClassName('loadingSpinner')[0];
			pageDiv.removeChild(load_class);
	}

	// member crew function
	function fetchCrew(cell) {
		$.ajax({
			url: "http://socialclub.rockstargames.com/member/"+cell.id,
			error: function(resp, statusText) {
				console.error(statusText, resp);
			},
			success: function(resp) {
				var respMatch = resp.match(/crewName\\":\\"([\w\d ]+)\\",\\"crewId/),
				crewPage = document.getElementsByClassName('js-crewName')[0].innerHTML,
				userCrew = "???";
				if (respMatch) {
					userCrew = respMatch[1];
					if (userCrew == crewPage) {
						cell.className = "ludi-good";
					}
					else if (!userCrew) {
						cell.className = "ludi-bad";
						userCrew = "Not Found!";
					}
					else {
						cell.className = "ludi-bad";
					}
				}
				else {
					cell.className = "ludi-bad";
					userCrew = "Hidden!";
				}
				cell.innerHTML = userCrew;
				cell.onmouseover = null;
			}
		});
	}

	// quick creation of element
	function elem(tag, name, html, type) {
	var e = d.createElement(tag);
		if (name) {e.className = name;}
		if (html) {e.innerHTML = html;}
		if (type) {e.type = type;}
		return e;
	}

	// request function
	function reqHnd(url, handler) {
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			headers: {
				"Accept": "text/xml"
			},
			onload: function(resp) {
				if (resp.readyState == 4 && resp.status == 200 && resp.statusText == "OK") {
					handler(resp);
				}
				else {
					console.error(resp);
				}
			},
			onerror: function(resp) {
				console.error(resp);
			}
		});
	}
})();

// tablesort function
// https://github.com/tristen/tablesort
;(function() {
	function Tablesort(el, options) {
		if (!el || el.tagName !== 'TABLE') {
			throw new Error('Element must be a table');
		}
		this.init(el, options || {});
	}

	var sortOptions = [];

	var createEvent = function(name) {
		var evt;

		if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
			evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(name, false, false, undefined);
		} else {
			evt = new CustomEvent(name);
		}

		return evt;
	};

	var getInnerText = function(el) {
		return el.getAttribute('data-sort') || el.textContent || el.innerText || '';
	};

	// Default sort method if no better sort method is found
	var caseInsensitiveSort = function(a, b) {
		a = a.toLowerCase();
		b = b.toLowerCase();

		if (a === b) return 0;
		if (a < b) return 1;

		return -1;
	};

	// Stable sort function
	// If two elements are equal under the original sort function,
	// then there relative order is reversed
	var stabilize = function(sort, antiStabilize) {
		return function(a, b) {
			var unstableResult = sort(a.td, b.td);

			if (unstableResult === 0) {
				if (antiStabilize) return b.index - a.index;
				return a.index - b.index;
			}

			return unstableResult;
		};
	};

	Tablesort.extend = function(name, pattern, sort) {
		if (typeof pattern !== 'function' || typeof sort !== 'function') {
			throw new Error('Pattern and sort must be a function');
		}

		sortOptions.push({
			name: name,
			pattern: pattern,
			sort: sort
		});
	};

	Tablesort.prototype = {
		init: function(el, options) {
			var that = this,
				firstRow,
				defaultSort,
				i,
				cell;

			that.table = el;
			that.thead = false;
			that.options = options;

			if (el.rows && el.rows.length > 0) {
				if (el.tHead && el.tHead.rows.length > 0) {
					firstRow = el.tHead.rows[el.tHead.rows.length - 1];
					that.thead = true;
				} else {
					firstRow = el.rows[0];
				}
			}

			if (!firstRow) return;

			var onClick = function() {
				if (that.current && that.current !== this) {
					that.current.classList.remove('sort-up');
					that.current.classList.remove('sort-down');
				}

				that.current = this;
				that.sortTable(this);
			};

			// Assume first row is the header and attach a click handler to each.
			for (i = 0; i < firstRow.cells.length; i++) {
				cell = firstRow.cells[i];
				if (!cell.classList.contains('no-sort')) {
					cell.classList.add('sort-header');
					cell.tabindex = 0;
					cell.addEventListener('click', onClick, false);

					if (cell.classList.contains('sort-default')) {
						defaultSort = cell;
					}
				}
			}

			if (defaultSort) {
				that.current = defaultSort;
				that.sortTable(defaultSort);
			}
		},

		sortTable: function(header, update) {
			var that = this,
				column = header.cellIndex,
				sortFunction = caseInsensitiveSort,
				item = '',
				items = [],
				i = that.thead ? 0 : 1,
				sortMethod = header.getAttribute('data-sort-method');

			that.table.dispatchEvent(createEvent('beforeSort'));

			if (that.table.rows.length < 2) return;

			// If we force a sort method, it is not necessary to check rows
			if (!sortMethod) {
				while (items.length < 3 && i < that.table.tBodies[0].rows.length) {
					item = getInnerText(that.table.tBodies[0].rows[i].cells[column]);
					item = item.trim();

					if (item.length > 0) {
						items.push(item);
					}

					i++;
				}

				if (!items) return;
			}

			for (i = 0; i < sortOptions.length; i++) {
				item = sortOptions[i];

				if (sortMethod) {
					if (item.name === sortMethod) {
						sortFunction = item.sort;
						break;
					}
				} else if (items.every(item.pattern)) {
					sortFunction = item.sort;
					break;
				}
			}

			that.col = column;
			var newRows = [],
				noSorts = {},
				j,
				totalRows = 0,
				noSortsSoFar = 0,
				sortDir;

			for (i = 0; i < that.table.tBodies.length; i++) {
				for (j = 0; j < that.table.tBodies[i].rows.length; j++) {
					item = that.table.tBodies[i].rows[j];
					if (item.classList.contains('no-sort')) {
						// keep no-sorts in separate list to be able to insert
						// them back at their original position later
						noSorts[totalRows] = item;
					} else {
						// Save the index for stable sorting
						newRows.push({
							tr: item,
							td: getInnerText(item.cells[that.col]),
							index: totalRows
						});
					}
					totalRows++;
				}
			}

			// If updating an existing sort `sortDir` should remain unchanged.
			if (update) {
				sortDir = header.classList.contains('sort-up') ? 'sort-up' : 'sort-down';
			} else {
				if (header.classList.contains('sort-up')) {
					sortDir = 'sort-down';
				} else if (header.classList.contains('sort-down')) {
					sortDir = 'sort-up';
				} else {
					sortDir = that.options.descending ? 'sort-up' : 'sort-down';
				}

				header.classList.remove(sortDir === 'sort-down' ? 'sort-up' : 'sort-down');
				header.classList.add(sortDir);
			}

			// Before we append should we reverse the new array or not?
			// If we reverse, the sort needs to be `anti-stable` so that
			// the double negatives cancel out
			if (sortDir === 'sort-down') {
				newRows.sort(stabilize(sortFunction, true));
				newRows.reverse();
			} else {
				newRows.sort(stabilize(sortFunction, false));
			}

			// append rows that already exist rather than creating new ones
			for (i = 0; i < totalRows; i++) {
				if (noSorts[i]) {
					// We have a no-sort row for this position, insert it here.
					item = noSorts[i];
					noSortsSoFar++;
				} else {
					item = newRows[i - noSortsSoFar].tr;
				}

				// appendChild(x) moves x if already present somewhere else in the DOM
				that.table.tBodies[0].appendChild(item);
			}

			that.table.dispatchEvent(createEvent('afterSort'));
		},

		refresh: function() {
			if (this.current !== undefined) {
				this.sortTable(this.current, true);
			}
		}
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Tablesort;
	} else {
		window.Tablesort = Tablesort;
	}

	// Numeric sort
	Tablesort.extend('number', function(item) {
		return item.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/); // Number
	}, function(a, b) {
		a = parseFloat(a);
		b = parseFloat(b);

		a = isNaN(a) ? 0 : a;
		b = isNaN(b) ? 0 : b;
		return a - b;
	});

	// Rank sort
	Tablesort.extend('rank', function(item) {
		return item.search(/(Leader|Comm.|Rep.|Muscle|Applicant)/i) !== -1;
	}, function(a, b) {
		var r = {"Leader": 1, "Comm.": 2, "Lt.": 3, "Rep.": 4, "Muscle": 5, "Applicant": 6};
		return r[b] - r[a];
	});

	// Date sort
	// Basic dates in dd/mm/yy or dd-mm-yy format.
	// Years can be 4 digits. Days and Months can be 1 or 2 digits.
	var parseDate = function(date) {
		date = date.replace(/\-/g, '/');
		date = date.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, '$1/$2/$3'); // format before getTime

		return new Date(date).getTime() || -1;
	};

	Tablesort.extend('date', function(item) {
		return (item.search(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i) !== -1) && !isNaN(parseDate(item));
	}, function(a, b) {
		a = a.toLowerCase();
		b = b.toLowerCase();

		return parseDate(b) - parseDate(a);
	});
})();
