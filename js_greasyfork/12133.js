// ==UserScript==
// @name        FPL get team info
// @namespace   nickchild
// @include     http://fantasy.premierleague.com/my-leagues/*
// @exclude     http://fantasy.premierleague.com/my-leagues/
// @exclude     http://fantasy.premierleague.com/my-leagues
// @version     1.9.9
// @description:en fpl league table stats
// @grant    GM_getValue
// @grant    GM_setValue
// @description fpl league table stats
// @downloadURL https://update.greasyfork.org/scripts/12133/FPL%20get%20team%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/12133/FPL%20get%20team%20info.meta.js
// ==/UserScript==

var stIsIE = /*@cc_on!@*/false;

sorttable = {
  init: function() {
    // quit if this function has already been called
    if (arguments.callee.done) return;
    // flag this function so we don't do the same thing twice
    arguments.callee.done = true;
    // kill the timer
    if (_timer) clearInterval(_timer);

    if (!document.createElement || !document.getElementsByTagName) return;

    sorttable.DATE_RE = /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/;

    forEach(document.getElementsByTagName('table'), function(table) {
      if (table.className.search(/\bsortable\b/) != -1) {
        sorttable.makeSortable(table);
      }
    });

  },

  makeSortable: function(table) {
    if (table.getElementsByTagName('thead').length == 0) {
      // table doesn't have a tHead. Since it should have, create one and
      // put the first table row in it.
      the = document.createElement('thead');
      the.appendChild(table.rows[0]);
      table.insertBefore(the,table.firstChild);
    }
    // Safari doesn't support table.tHead, sigh
    if (table.tHead == null) table.tHead = table.getElementsByTagName('thead')[0];

    if (table.tHead.rows.length != 1) return; // can't cope with two header rows

    // Sorttable v1 put rows with a class of "sortbottom" at the bottom (as
    // "total" rows, for example). This is B&R, since what you're supposed
    // to do is put them in a tfoot. So, if there are sortbottom rows,
    // for backwards compatibility, move them to tfoot (creating it if needed).
    sortbottomrows = [];
    for (var i=0; i<table.rows.length; i++) {
      if (table.rows[i].className.search(/\bsortbottom\b/) != -1) {
        sortbottomrows[sortbottomrows.length] = table.rows[i];
      }
    }
    if (sortbottomrows) {
      if (table.tFoot == null) {
        // table doesn't have a tfoot. Create one.
        tfo = document.createElement('tfoot');
        table.appendChild(tfo);
      }
      for (var i=0; i<sortbottomrows.length; i++) {
        tfo.appendChild(sortbottomrows[i]);
      }
      delete sortbottomrows;
    }

    // work through each column and calculate its type
    headrow = table.tHead.rows[0].cells;
    for (var i=0; i<headrow.length; i++) {
      // manually override the type with a sorttable_type attribute
      if (!headrow[i].className.match(/\bsorttable_nosort\b/)) { // skip this col
        mtch = headrow[i].className.match(/\bsorttable_([a-z0-9]+)\b/);
        if (mtch) { override = mtch[1]; }
	      if (mtch && typeof sorttable["sort_"+override] == 'function') {
	        headrow[i].sorttable_sortfunction = sorttable["sort_"+override];
	      } else {
	        headrow[i].sorttable_sortfunction = sorttable.guessType(table,i);
	      }
	      // make it clickable to sort
	      headrow[i].sorttable_columnindex = i;
	      headrow[i].sorttable_tbody = table.tBodies[0];
	      dean_addEvent(headrow[i],"click", sorttable.innerSortFunction = function(e) {

          if (this.className.search(/\bsorttable_sorted\b/) != -1) {
            // if we're already sorted by this column, just
            // reverse the table, which is quicker
            sorttable.reverse(this.sorttable_tbody);
            this.className = this.className.replace('sorttable_sorted',
                                                    'sorttable_sorted_reverse');
            this.removeChild(document.getElementById('sorttable_sortfwdind'));
            sortrevind = document.createElement('span');
            sortrevind.id = "sorttable_sortrevind";
            sortrevind.innerHTML = stIsIE ? '&nbsp<font face="webdings">5</font>' : '&nbsp;&#x25B4;';
            this.appendChild(sortrevind);
            return;
          }
          if (this.className.search(/\bsorttable_sorted_reverse\b/) != -1) {
            // if we're already sorted by this column in reverse, just
            // re-reverse the table, which is quicker
            sorttable.reverse(this.sorttable_tbody);
            this.className = this.className.replace('sorttable_sorted_reverse',
                                                    'sorttable_sorted');
            this.removeChild(document.getElementById('sorttable_sortrevind'));
            sortfwdind = document.createElement('span');
            sortfwdind.id = "sorttable_sortfwdind";
            sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
            this.appendChild(sortfwdind);
            return;
          }

          // remove sorttable_sorted classes
          theadrow = this.parentNode;
          forEach(theadrow.childNodes, function(cell) {
            if (cell.nodeType == 1) { // an element
              cell.className = cell.className.replace('sorttable_sorted_reverse','');
              cell.className = cell.className.replace('sorttable_sorted','');
            }
          });
          sortfwdind = document.getElementById('sorttable_sortfwdind');
          if (sortfwdind) { sortfwdind.parentNode.removeChild(sortfwdind); }
          sortrevind = document.getElementById('sorttable_sortrevind');
          if (sortrevind) { sortrevind.parentNode.removeChild(sortrevind); }

          this.className += ' sorttable_sorted';
          sortfwdind = document.createElement('span');
          sortfwdind.id = "sorttable_sortfwdind";
          sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
          this.appendChild(sortfwdind);

	        // build an array to sort. This is a Schwartzian transform thing,
	        // i.e., we "decorate" each row with the actual sort key,
	        // sort based on the sort keys, and then put the rows back in order
	        // which is a lot faster because you only do getInnerText once per row
	        row_array = [];
	        col = this.sorttable_columnindex;
	        rows = this.sorttable_tbody.rows;
	        for (var j=0; j<rows.length; j++) {
	          row_array[row_array.length] = [sorttable.getInnerText(rows[j].cells[col]), rows[j]];
	        }
	        /* If you want a stable sort, uncomment the following line */
	        //sorttable.shaker_sort(row_array, this.sorttable_sortfunction);
	        /* and comment out this one */
	        row_array.sort(this.sorttable_sortfunction);

	        tb = this.sorttable_tbody;
	        for (var j=0; j<row_array.length; j++) {
	          tb.appendChild(row_array[j][1]);
	        }

	        delete row_array;
	      });
	    }
    }
  },

  guessType: function(table, column) {
    // guess the type of a column based on its first non-blank row
    sortfn = sorttable.sort_alpha;
    for (var i=0; i<table.tBodies[0].rows.length; i++) {
      text = sorttable.getInnerText(table.tBodies[0].rows[i].cells[column]);
      if (text != '') {
        if (text.match(/^-?[£$¤]?[\d,.]+%?$/)) {
          return sorttable.sort_numeric;
        }
        // check for a date: dd/mm/yyyy or dd/mm/yy
        // can have / or . or - as separator
        // can be mm/dd as well
        possdate = text.match(sorttable.DATE_RE)
        if (possdate) {
          // looks like a date
          first = parseInt(possdate[1]);
          second = parseInt(possdate[2]);
          if (first > 12) {
            // definitely dd/mm
            return sorttable.sort_ddmm;
          } else if (second > 12) {
            return sorttable.sort_mmdd;
          } else {
            // looks like a date, but we can't tell which, so assume
            // that it's dd/mm (English imperialism!) and keep looking
            sortfn = sorttable.sort_ddmm;
          }
        }
      }
    }
    return sortfn;
  },

  getInnerText: function(node) {
    // gets the text we want to use for sorting for a cell.
    // strips leading and trailing whitespace.
    // this is *not* a generic getInnerText function; it's special to sorttable.
    // for example, you can override the cell text with a customkey attribute.
    // it also gets .value for <input> fields.

    if (!node) return "";

    hasInputs = (typeof node.getElementsByTagName == 'function') &&
                 node.getElementsByTagName('input').length;

    if (node.getAttribute("sorttable_customkey") != null) {
      return node.getAttribute("sorttable_customkey");
    }
    else if (typeof node.textContent != 'undefined' && !hasInputs) {
      return node.textContent.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof node.innerText != 'undefined' && !hasInputs) {
      return node.innerText.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof node.text != 'undefined' && !hasInputs) {
      return node.text.replace(/^\s+|\s+$/g, '');
    }
    else {
      switch (node.nodeType) {
        case 3:
          if (node.nodeName.toLowerCase() == 'input') {
            return node.value.replace(/^\s+|\s+$/g, '');
          }
        case 4:
          return node.nodeValue.replace(/^\s+|\s+$/g, '');
          break;
        case 1:
        case 11:
          var innerText = '';
          for (var i = 0; i < node.childNodes.length; i++) {
            innerText += sorttable.getInnerText(node.childNodes[i]);
          }
          return innerText.replace(/^\s+|\s+$/g, '');
          break;
        default:
          return '';
      }
    }
  },

  reverse: function(tbody) {
    // reverse the rows in a tbody
    newrows = [];
    for (var i=0; i<tbody.rows.length; i++) {
      newrows[newrows.length] = tbody.rows[i];
    }
    for (var i=newrows.length-1; i>=0; i--) {
       tbody.appendChild(newrows[i]);
    }
    delete newrows;
  },

  /* sort functions
     each sort function takes two parameters, a and b
     you are comparing a[0] and b[0] */
  sort_numeric: function(a,b) {
    aa = parseFloat(a[0].replace(/[^0-9.-]/g,''));
    if (isNaN(aa)) aa = 0;
    bb = parseFloat(b[0].replace(/[^0-9.-]/g,''));
    if (isNaN(bb)) bb = 0;
    return bb-aa;
  },
  sort_alpha: function(a,b) {
    if (a[0]==b[0]) return 0;
    if (a[0]<b[0]) return -1;
    return 1;
  },
  sort_ddmm: function(a,b) {
    mtch = a[0].match(sorttable.DATE_RE);
    y = mtch[3]; m = mtch[2]; d = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt1 = y+m+d;
    mtch = b[0].match(sorttable.DATE_RE);
    y = mtch[3]; m = mtch[2]; d = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt2 = y+m+d;
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
  },
  sort_mmdd: function(a,b) {
    mtch = a[0].match(sorttable.DATE_RE);
    y = mtch[3]; d = mtch[2]; m = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt1 = y+m+d;
    mtch = b[0].match(sorttable.DATE_RE);
    y = mtch[3]; d = mtch[2]; m = mtch[1];
    if (m.length == 1) m = '0'+m;
    if (d.length == 1) d = '0'+d;
    dt2 = y+m+d;
    if (dt1==dt2) return 0;
    if (dt1<dt2) return -1;
    return 1;
  },

  shaker_sort: function(list, comp_func) {
    // A stable sort function to allow multi-level sorting of data
    // see: http://en.wikipedia.org/wiki/Cocktail_sort
    // thanks to Joseph Nahmias
    var b = 0;
    var t = list.length - 1;
    var swap = true;

    while(swap) {
        swap = false;
        for(var i = b; i < t; ++i) {
            if ( comp_func(list[i], list[i+1]) > 0 ) {
                var q = list[i]; list[i] = list[i+1]; list[i+1] = q;
                swap = true;
            }
        } // for
        t--;

        if (!swap) break;

        for(var i = t; i > b; --i) {
            if ( comp_func(list[i], list[i-1]) < 0 ) {
                var q = list[i]; list[i] = list[i-1]; list[i-1] = q;
                swap = true;
            }
        } // for
        b++;

    } // while(swap)
  }
}

/*
  SortTable
  version 2
  7th April 2007
  Stuart Langridge, http://www.kryogenix.org/code/browser/sorttable/

  Instructions:
  Download this file
  Add <script src="sorttable.js"></script> to your HTML
  Add class="sortable" to any table you'd like to make sortable
  Click on the headers to sort

  Thanks to many, many people for contributions and suggestions.
  Licenced as X11: http://www.kryogenix.org/code/browser/licence.html
  This basically means: do what you want with it.
*/

/* ******************************************************************
   Supporting functions: bundled here to avoid depending on a library
   ****************************************************************** */

// Dean Edwards/Matthias Miller/John Resig

/* for Mozilla/Opera9 */
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", sorttable.init, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = function() {
        if (this.readyState == "complete") {
            sorttable.init(); // call the onload handler
        }
    };
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
    var _timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
            sorttable.init(); // call the onload handler
        }
    }, 10);
}

/* for other browsers */
window.onload = sorttable.init;

// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/

function dean_addEvent(element, type, handler) {
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else {
		// assign each event handler a unique ID
		if (!handler.$$guid) handler.$$guid = dean_addEvent.guid++;
		// create a hash table of event types for the element
		if (!element.events) element.events = {};
		// create a hash table of event handlers for each element/event pair
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			// store the existing event handler (if there is one)
			if (element["on" + type]) {
				handlers[0] = element["on" + type];
			}
		}
		// store the event handler in the hash table
		handlers[handler.$$guid] = handler;
		// assign a global event handler to do all the work
		element["on" + type] = handleEvent;
	}
};
// a counter used to create unique IDs
dean_addEvent.guid = 1;

function removeEvent(element, type, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(type, handler, false);
	} else {
		// delete the event handler from the hash table
		if (element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	}
};

function handleEvent(event) {
	var returnValue = true;
	// grab the event object (IE uses a global event object)
	event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];
	// execute each event handler
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
};

function fixEvent(event) {
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
};
fixEvent.preventDefault = function() {
	this.returnValue = false;
};
fixEvent.stopPropagation = function() {
  this.cancelBubble = true;
}

// Dean's forEach: http://dean.edwards.name/base/forEach.js
/*
	forEach, version 1.0
	Copyright 2006, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

// array-like enumeration
if (!Array.forEach) { // mozilla already supports this
	Array.forEach = function(array, block, context) {
		for (var i = 0; i < array.length; i++) {
			block.call(context, array[i], i, array);
		}
	};
}

// generic enumeration
Function.prototype.forEach = function(object, block, context) {
	for (var key in object) {
		if (typeof this.prototype[key] == "undefined") {
			block.call(context, object[key], key, object);
		}
	}
};

// character enumeration
String.forEach = function(string, block, context) {
	Array.forEach(string.split(""), function(chr, index) {
		block.call(context, chr, index, string);
	});
};

// globally resolve forEach enumeration
var forEach = function(object, block, context) {
	if (object) {
		var resolve = Object; // default
		if (object instanceof Function) {
			// functions have a "length" property
			resolve = Function;
		} else if (object.forEach instanceof Function) {
			// the object implements a custom forEach method so use that
			object.forEach(block, context);
			return;
		} else if (typeof object == "string") {
			// the object is a string
			resolve = String;
		} else if (typeof object.length == "number") {
			// the object is array-like
			resolve = Array;
		}
		resolve.forEach(object, block, context);
	}
};

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function myescape(val) {
	retval = val.replace("'", "&apos;");
	retval = val.replace('"', "&quot;");
	return retval;
}

function getIDPN(val) {
	idpn = val.replace(/\s+/g, '');
	idpn = decodeHtml(idpn);
	idpn = idpn.toLowerCase();
	idpn = idpn.replace(/\W/g, '');
	return idpn;
}
var mytimeout;
h2s = document.getElementsByTagName("h2");
for(i=0; i<h2s.length; i++) {
	if(h2s[i].className == "ismTabHeading") {
		leagueName = h2s[i].innerHTML;
	}
}
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function stateChangedHist()
{ 
	if (this.readyState==4)
	{

		retval = this.responseText;
		
		arr1 = retval.split('<dt>Gameweek Points</dt>');
		arr2 = arr1[1].split('/">');
		arr3 = arr2[0].split('href="');
		arr4 = arr3[1].split('/');
		teamID = arr4[2];
//		alert(teamID);
		lastGW = arr4[4];
		
		numrows = 0;
		chipsdetail = "";
		chipstxtstyle = "";

		if(document.getElementById("chips"+teamID)) {
			arr1 = retval.split('<h3>Chips</h3>');
			arr2 = arr1[1].split('</section>');
			chipsinfo = arr2[0].trim();
			chipstxtstyle = "";
			livechip = false;
			if(chipsinfo == "No chips played") {
				chipstxt = "0";
				chipsdetail = chipsinfo;
			} else {
				arr3 = arr2[0].split("<tbody>");
				arr4 = arr3[1].split("</tbody>");
				tbody_txt = arr4[0];
				rows = tbody_txt.split("</tr>");
				numrows = rows.length-1;
				if(numrows > 1) {
					chipstxtstyle = "font-weight: bold";
				}
				chipsdetail = "";
				chipname = "";
				chipstxtstyle = "";
				for(i=0; i<rows.length-1; i++) {
					arr5 = rows[i].split("</td>");
					arr6 = arr5[1].split("<td>");
					chipname = arr6[1].trim();
					arr6 = arr5[2].split("<td>");
					chipstatus = arr6[1].trim();
					if(chipstatus != "Played") {
						chipstxtstyle = "font-weight: bold";
					}
					arr6 = arr5[3].split("<td>");
					arr7 = arr6[1].split("GW");
					arr8 = arr7[1].split("<");
					chipweek = arr8[0];
					chipsdetail += chipname + " (GW" + chipweek + ")\n";
					if(lastGW == chipweek && chipname != "Wildcard") {
						livechip = true;
					}
				}
			}
			
			cell = document.getElementById("chips"+teamID);
			if(livechip) {
				cell.style.backgroundColor = "#ffbad2";
			}
			cell.innerHTML = "<span style='"+chipstxtstyle+"' title='"+chipsdetail+"'>"+numrows+"</span>";
		}
	}
}
function stateChangedTran()
{ 
	if (this.readyState==4)
	{

		retval = this.responseText;

		arr1 = retval.split('<dt>Gameweek Points</dt>');
		arr2 = arr1[1].split('/">');
		arr3 = arr2[0].split('href="');
		arr4 = arr3[1].split('/');
		teamID = arr4[2];
		lastGW = arr4[4];

		arr1 = retval.split('No wildcards played');
		if(arr1.length > 1) {
			wildcardGW = 0;
		} else {
			arr1 = retval.split('<h2 class="ismSection1">Wildcard history</h2>');
			arr2 = arr1[1].split('</table>');
			arr3 = arr2[0].split('</td>');
			arr4 = arr3[1].split('<td>');
			wildcardGW = arr4[1];
			if(document.getElementById("wci"+teamID)) {
				document.getElementById("wci"+teamID).title = "Played: GW" + wildcardGW;
				document.getElementById("wcs"+teamID).innerHTML = document.getElementById("wcs"+teamID).innerHTML + wildcardGW;
			}
		}
		
		
		arr1 = retval.split("<dt>Gameweek transfers</dt>");
		arr2 = arr1[1].split("<dt>Wildcard</dt>");
		gwtval = arr2[0];
		arr3 = gwtval.split("dd>");
		arr4 = arr3[1].split("</");
		gwtvalnum = parseInt(arr4[0]);
		
		arr1 = retval.split('<h1 class="ismSection1">Transfer history</h1>');
		arr2 = arr1[1].split("</tbody>");
		arr3 = arr2[0].split("<tbody>");
		arr4 = arr3[1].split("</tr>");
		tmpgwstr = "";
		gws = [];
		for(i=lastGW+1; i>0; i--) {
			gws[i] = 0;
		}
		for(i=0; i<(arr4.length-1); i++) {
			arr5 = arr4[i].split("</td>");
			arr6 = arr5[3].split("<td>");
			tmpgw = arr6[1];
			gws[tmpgw] = gws[tmpgw] + 1;
		}
		freetrans = "";
		if(wildcardGW == lastGW) {
			freetrans = 1;
		} else if(lastGW == 1) {
			freetrans = 1;
		} else if(gws[lastGW] == 0) {
			freetrans = 2;
		} else if(gws[lastGW] > 1) {
			freetrans = 1;
		} else {
			lasttrans = 1;
			checkGW = lastGW;
			while(lasttrans == 1 && checkGW > 0) {
				checkGW = checkGW - 1;
				lasttrans = gws[checkGW];
			}
			if(wildcardGW == checkGW) {
				freetranstmp = 1;
			} else if (lasttrans == 0) {
				if(checkGW == 1) {
					freetranstmp = 1;
				} else {
					freetranstmp = 2;
				}
			} else if (lasttrans > 0) {
				freetranstmp = 1;
			} else {
				freetranstmp = 1;
			}
			freetrans = freetranstmp;
		}
		paidTrans = gwtvalnum - freetrans;
		if(paidTrans>0) {
			tph = "-" + (paidTrans*4);
			tphsrt = paidTrans*4;
		} else {
			tph = "0";
			tphsrt = 0;
		}
		
		gwtvalnum = gws[lastGW];
		lastGW = lastGW - 1;
		freetrans = "";
		if(wildcardGW == lastGW+1) {
			freetrans = 1000;
		} else if(wildcardGW == lastGW) {
			freetrans = 1;
		} else if(gws[lastGW] == 0) {
			freetrans = 2;
		} else if(gws[lastGW] > 1) {
			freetrans = 1;
		} else {
			lasttrans = 1;
			checkGW = lastGW;
			while(lasttrans == 1 && checkGW > 0) {
				checkGW = checkGW - 1;
				lasttrans = gws[checkGW];
			}
			if(wildcardGW == checkGW) {
				freetranstmp = 1;
			} else if (lasttrans == 0) {
				if(checkGW == 1) {
					freetranstmp = 1;
				} else {
					freetranstmp = 2;
				}
			} else if (lasttrans > 0) {
				freetranstmp = 1;
			} else {
				freetranstmp = 1;
			}
			freetrans = freetranstmp;
		}
		paidTrans = gwtvalnum - freetrans;
		if(paidTrans>0) {
			lasttph = "-" + (paidTrans*4);
			lasttphsrt = paidTrans*4;
		} else {
			lasttph = "0";
			lasttphsrt = 0;
		}

		if(document.getElementById("fplgwtotal"+teamID).innerHTML == "0" && document.getElementById("livetotal"+teamID)) {
			livetotalcell = document.getElementById("livetotal"+teamID);
			livetotalcell.innerHTML = numberWithCommas(parseInt(livetotalcell.innerHTML.replace(/,/g, '')) - lasttphsrt);
		}
		if(document.getElementById("hitpts"+teamID)) {
			cell = document.getElementById("hitpts"+teamID);
			cell.innerHTML = "<span style='display: none'>" + tphsrt + "</span>" + tph;
		}
		if(document.getElementById("wc"+teamID)) {
			arr1 = retval.split('Wildcard history</h2>');
			arr2 = arr1[1].split('<p>');
			arr3 = arr2[1].split('</p>');
			wcinfo = arr3[0];
			if(wcinfo == "No wildcards played") {
				wcimg = "http://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Green_check.svg/13px-Green_check.svg.png";
				wctxt = "Available";
			} else {
//				wcimg = "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ambox_important.svg/23px-Ambox_important.svg.png";
//				wctxt = "Active";
				wcimg = "http://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Red_x.svg/13px-Red_x.svg.png";
				wctxt = "Played";
			}
			cell = document.getElementById("wc"+teamID);
			cell.innerHTML = "<span id='wcs"+teamID+"' style='display: none;'>" + wctxt + "</span><img id='wci"+teamID+"' title='" + wctxt + "' src='" + wcimg + "'>";
		}
	}
}

function stateChanged()
{ 
	if (this.readyState==4)
	{

		retval = this.responseText;
/*
		arr1 = retval.split('<h2 class="ismSection3">');
		arr2 = arr1[1].split("</h2>");
		teamName = arr2[0];
		arr1 = retval.split('<h1 class="ismSection2">');
		arr2 = arr1[1].split("</h1>");
		playerName = arr2[0];
*/
		arr1 = retval.split('id="ismJSCarousel"');
		arr2 = arr1[1].split('data-entry="');
		arr3 = arr2[1].split('"');
		teamID = arr3[0];
//		idpn = getIDPN(teamName);
		idpn = "row" + teamID;
		row = document.getElementById(idpn);
		rowtds = row.getElementsByTagName("td");
		gwScore = parseInt(rowtds[4].innerHTML);
		totalScore = parseInt(rowtds[5].innerHTML.replace(/,/g, ''));
		
		if(config_values["teamval"] == 1 || config_values["totalval"] == 1) {
			arr1 = retval.split("<dt>Team value</dt>");
			arr2 = arr1[1].split("<dt>In the bank</dt>");
			teamval = arr2[0];
			arr3 = teamval.split("£");
			arr4 = arr3[1].split("m");
			teamvalnum = arr4[0];
		}

		if(config_values["bankval"] == 1 || config_values["totalval"] == 1) {
			arr1 = retval.split("<dt>In the bank</dt>");
			arr2 = arr1[1].split("</dl>");
			bankval = arr2[0];
			arr3 = bankval.split("£");
			arr4 = arr3[1].split("m");
			bankvalnum = arr4[0];
		}
		
		if(config_values["tt"] == 1) {
			arr1 = retval.split("<dt>Total transfers</dt>");
			arr2 = arr1[1].split("<dt>Gameweek transfers</dt>");
			ttval = arr2[0];
			arr3 = ttval.split("dd>");
			arr4 = arr3[1].split("</dd");
			ttvalnum = arr4[0];
		}

		if(config_values["gwt"] == 1) {
			arr1 = retval.split("<dt>Gameweek transfers</dt>");
			arr2 = arr1[1].split("<dt>Wildcard</dt>");
			gwtval = arr2[0];
			arr3 = gwtval.split("dd>");
			arr4 = arr3[1].split("</dd");
			gwtvalnum = arr4[0];
		}

		if(config_values["totalval"] == 1) {
			totalvalnum = parseFloat(teamvalnum) + parseFloat(bankvalnum);
			totalvalnum = totalvalnum.toFixed(1);
		}

/*
		if(config_values["wc"] == 1) {
			arr1 = retval.split("<dt>Wildcard</dt>");
			arr2 = arr1[1].split("</dl>");
			wcval = arr2[0];
			if(wcval.indexOf("Played") > -1) {
				wcimg = "http://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Red_x.svg/13px-Red_x.svg.png";
				wctxt = "Played";
			} else if(wcval.indexOf("Active") > -1) {
				wcimg = "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ambox_important.svg/23px-Ambox_important.svg.png";
				wctxt = "Active";
			} else {
				wcimg = "http://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Green_check.svg/13px-Green_check.svg.png";
				wctxt = "Available";
			}
		}
*/		
		if(config_values["captain"] == 1) {
			arr1 = retval.split('"is_captain": true');
			arr2 = arr1[1].split('<span class="ismElementText ismPitchStat">');
			arr3 = arr2[0].split('JS_ISM_NAME">');
			arr4 = arr3[1].split(' </span>');
			capval = arr4[0].trim();
			arr1 = retval.split('"is_vice_captain": true');
			arr2 = arr1[1].split('<span class="ismElementText ismPitchStat">');
			arr3 = arr2[0].split('JS_ISM_NAME">');
			arr4 = arr3[1].split(' </span>');
			vicecapval = arr4[0].trim();
		}

		if(config_values["h2h"] == 1) {
			arr1 = retval.split('Head-to-Head leagues');
			arr2 = arr1[1].split('</table>');
			h2htable = arr2[0];
			if(h2htable.indexOf(leagueName) > -1) {
				arr1 = h2htable.split(leagueName);
				arr2 = arr1[0].split('<tr>');
				arr3 = arr2[arr2.length-1].split('</td>');
				arr4 = arr3[1].split('<td>');
				h2hpos = arr4[1];
			} else {
				h2hpos = "-";
			}
		}

		if(config_values["livepoints"] == 1 || config_values["livetotal"] == 1) {
			arr1 = retval.split('class="ism-scoreboard-panel__points');
			arr2 = arr1[1].split("<sub>");
			arr3 = arr2[0].split('">');
			livepoints = arr3[1].trim();
		}
		
		if(config_values["livetotal"] == 1) {
			livetotal = totalScore + (livepoints - gwScore);
		}
		
		arr1 = retval.split('<!-- end ismPitch -->');
		arr2 = arr1[0].split('<div class="ismPitch">');
		arr3 = arr2[1].split('<div class="ismBench">');
		pitch = arr3[0];
		bench = arr3[1];
		arr1 = pitch.split('JS_ISM_NAME">');
		pitchstr = "";
		numplayed = 0;
		numtoplay = 0;
		numdidnt = 0;
		playedstr = "";
		toplaystr = "";
		didntplaystr = "";
		for(i=1; i<arr1.length; i++) {
			arr2 = arr1[i].split('</span>');
			arr3 = arr1[i].split('</tbody>');
			if(arr3.length > 1) {
				arr4 = arr3[0].split('<tbody>');
				ptstable = decodeHtml(arr4[1]);
				ptsrows = ptstable.split('</tr>');
				pts = 0;
				for(pt=0; pt<ptsrows.length; pt++) {
					ptscells = ptsrows[pt].split('</td>');
					if(ptscells[2]) {
						ptcell = ptscells[2].split('<td>');
						pts = pts + parseInt(ptcell[1]);
					} else {
						pts = pts + 0;
					}
				}
			} else {
				pts = "N/A";
			}
			arr3 = arr1[i].split('  v  ');
			if(arr3.length > 1) {
				tmpToPlay = arr3.length-1;
			} else {
				tmpToPlay = 0;
			}
			arr3 = arr1[i].split('Minutes played</td> <td>');
			tmpname = arr2[0].trim();
			pitchstr += "<span title='"+pts+"'>" + tmpname + "</span>";
			if(i<(arr1.length-1)) {
				 pitchstr += ", ";
			}
			
			if(tmpToPlay<1) {
				tmptime = 0;
				for(arr3i=1; arr3i<arr3.length; arr3i++) {
					arr4 = arr3[arr3i].split('</td>');
					tmptime = tmptime + parseInt(arr4[0]);
				}
				if(tmptime > 0) {
					numplayed++;
					playedstr += myescape(tmpname) + "\n";
				} else {
					numdidnt++;
					didntplaystr += myescape(tmpname) + "\n";
				}
			} else {
				numtoplay++;
				toplaystr += myescape(tmpname);
				if(tmpToPlay > 1) {
					toplaystr += " x " + tmpToPlay;
				}
				toplaystr += "\n";
			}
		}
		arr1 = bench.split('JS_ISM_NAME">');
		benchstr = "";
		for(i=1; i<arr1.length; i++) {
			arr2 = arr1[i].split('</span>');
			arr3 = arr1[i].split('</tbody>');
			if(arr3.length > 1) {
				arr4 = arr3[0].split('<tbody>');
				ptstable = decodeHtml(arr4[1]);
				ptsrows = ptstable.split('</tr>');
				pts = 0;
				for(pt=0; pt<ptsrows.length; pt++) {
					ptscells = ptsrows[pt].split('</td>');
					if(ptscells[2]) {
						ptcell = ptscells[2].split('<td>');
						pts = pts + parseInt(ptcell[1]);
					} else {
						pts = pts + 0;
					}
				}
			} else {
				pts = "N/A";
			}
			benchstr += "<span title='"+pts+"'>" + arr2[0].trim() + "</span>";
			if(i<(arr1.length-1)) {
				 benchstr += ", ";
			}
		}
		
/*
		arr1 = pitch.split('Minutes played</td> <td>');
		numplayed = 0;
		for(i=1; i<arr1.length; i++) {
			arr2 = arr1[i].split('</td>');
			tmpval = parseInt(arr2[0]);
			if(tmpval>0) {
				numplayed++;
			}
		}
*/
		rowstr = "";
		if(config_values["teamval"] == 1) {
			rowstr += "<td align='right' nowrap>" + teamvalnum + "</td>";
		}
		if(config_values["bankval"] == 1) {
			rowstr += "<td align='right' nowrap>" + bankvalnum + "</td>";
		}
		if(config_values["totalval"] == 1) {
			rowstr += "<td align='right' nowrap>" + totalvalnum + "</td>";
		}
		if(config_values["tt"] == 1) {
			rowstr += "<td>" + ttvalnum + "</td>";
		}
		if(config_values["gwt"] == 1) {
			rowstr += "<td>" + gwtvalnum + "</td>";
		}
		if(config_values["hitpts"] == 1) {
			rowstr += "<td id='hitpts"+teamID+"'>&nbsp;</td>";
		}
		if(config_values["wc"] == 1) {
			rowstr += "<td id='wc"+teamID+"' align='center'>&nbsp;</td>";
		}
		if(config_values["chips"] == 1) {
			rowstr += "<td id='chips"+teamID+"' align='center'>&nbsp;</td>";
		}
		if(config_values["captain"] == 1) {
			rowstr += "<td title='"+vicecapval+" (vc)' nowrap>" + capval + "</td>";
		}
		if(config_values["h2h"] == 1) {
			rowstr += "<td><span style='display: none'>-" + h2hpos + "</span>" + h2hpos + "</td>";
		}
		if(config_values["livepoints"] == 1) {
			rowstr += "<td>" + livepoints + "</td>";
		}
		if(config_values["livetotal"] == 1) {
			rowstr += "<td id='livetotal"+teamID+"' nowrap align='right'>" + numberWithCommas(livetotal) + "</td>";
		}
		if(config_values["played"] == 1) {
			rowstr += "<td title='"+playedstr+"' nowrap>" + numplayed + "</td>";
			rowstr += "<td title='"+toplaystr+"' nowrap>" + numtoplay + "</td>";
			rowstr += "<td title='"+didntplaystr+"' nowrap>" + numdidnt + "</td>";
		}
		
		document.getElementById(idpn).innerHTML = document.getElementById(idpn).innerHTML + rowstr;
		rowheight = row.offsetHeight - 1;
		rowwidth = row.offsetWidth - 1;
		tds = row.getElementsByTagName("td");
		tds[0].style.position = "relative";
		tdwidth = tds[0].offsetWidth;
		divwidth = rowwidth - tdwidth;
		compStyle = window.getComputedStyle(row, "");
		bg = "#fff";
		if(bg == "transparent") {
			bg = "#fff";
		}
		if(config_values["wide"] == 1) {
			fontsize = 9;
		} else {
			fontsize = 7;
		}
		playerliststr = "<div id='teamdiv_"+idpn+"' style='display: none; position: absolute; top: -1px; left: "+tdwidth+"px; height: "+rowheight+"px; width: "+divwidth+"px; line-height: "+rowheight+"px; background: "+bg+"; color: #000; font-size: "+fontsize+"pt'>" + pitchstr + "<span style='font-style: italic'>&nbsp;Bench:&nbsp;" + benchstr + "</span></div>";
		tds[0].innerHTML = tds[0].innerHTML + playerliststr;
		eval("tds[0].onclick = function() {tmptd = document.getElementById('teamdiv_"+idpn+"'); if(tmptd.style.display == ''){tmptd.style.display = 'none'}else{tmptd.style.display = ''};}");

		if(config_values["hitpts"] == 1 || config_values["livetotal"] == 1 || config_values["wc"] == 1) {
			tranurl = "http://fantasy.premierleague.com/entry/"+teamID+"/transfers/history/";
			var tranxmlHttp=GetXmlHttpObject();
			tranxmlHttp.onreadystatechange=stateChangedTran;
			tranxmlHttp.open("GET",tranurl,true);
			tranxmlHttp.send(null);
		}
		if(config_values["chips"] == 1) {
			histurl = "http://fantasy.premierleague.com/entry/"+teamID+"/history/";
			var histxmlHttp=GetXmlHttpObject();
			histxmlHttp.onreadystatechange=stateChangedHist;
			histxmlHttp.open("GET",histurl,true);
			histxmlHttp.send(null);
		}
		
		tables = document.getElementsByTagName("table");
		for(i=0; i<tables.length; i++) {
			if(tables[i].className == "ismTable ismStandingsTable" || tables[i].className == "ismTable ismH2HStandingsTable") {
				table = tables[i];
			}
		}

		clearTimeout(mytimeout);
		mytimeout = setTimeout(function() {sorttable.makeSortable(table)}, 1000);

	}
}

function GetXmlHttpObject()
{
	var xmlHttp=null;
	try
	  {
	  // Firefox, Opera 8.0+, Safari
	  xmlHttp=new XMLHttpRequest();
	  }
	catch (e)
	  {
	  // Internet Explorer
	  try
	    {
	    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	    }
	  catch (e)
	    {
	    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
	    }
	  }
	return xmlHttp;
}

config_items = new Array("teamval", "bankval", "totalval", "tt", "gwt", "hitpts", "wc", "chips", "captain", "h2h", "livepoints", "livetotal", "wide", "played");
config_values = {};
config_strs = {};
config_strs["teamval"] = "Team value";
config_strs["bankval"] = "Bank value";
config_strs["totalval"] = "Total value";
config_strs["tt"] = "Total transfers";
config_strs["gwt"] = "Gameweek transfers";
config_strs["wc"] = "Wildcard";
config_strs["chips"] = "Chips";
config_strs["captain"] = "Captain";
config_strs["h2h"] = "H2H league position";
config_strs["livepoints"] = "Live gameweek points";
config_strs["livetotal"] = "Live total points";
config_strs["wide"] = "Extra wide";
config_strs["played"] = "Playing stats";
config_strs["hitpts"] = "Transfer points hit";
for(i=0; i<config_items.length; i++) {
	c = config_items[i];
	tmpval = GM_getValue(c);
	if(tmpval == undefined) {
		GM_setValue(c, 1);
		tmpval = 1;
	}
	config_values[c] = tmpval;
}

optionWidth = "220px";
if(config_values["wide"] == 1) {
	refreshWidth = "1100px";
} else {
	refreshWidth = "880px";
}
tables = document.getElementsByTagName("table");

for(i=0; i<tables.length; i++) {
	if(tables[i].className == "ismTable ismStandingsTable" || tables[i].className == "ismTable ismH2HStandingsTable") {
		table = tables[i];
		trs = tables[i].getElementsByTagName("tr");
		for(j=0; j<trs.length; j++) {

			ancs = trs[j].getElementsByTagName("a");
			tds = trs[j].getElementsByTagName("td");
			if(ancs.length > 0) {
				tds[1].style.whiteSpace = "nowrap";
				tds[2].style.whiteSpace = "nowrap";
				tds[3].style.whiteSpace = "nowrap";
				arr1 = tds[2].innerHTML.split('/">');
				arr2 = arr1[1].split("</a>");
				teamName = arr2[0];
				arr1 = tds[2].innerHTML.split('entry/');
				arr2 = arr1[1].split("/event");
				teamID = arr2[0];
				playerName = tds[3].innerHTML;
				tds[4].id = "fplgwtotal" + teamID;
//				idpn = getIDPN(teamID);
				idpn = "row" + teamID;
				trs[j].id = idpn;
				url = ancs[0].href;
				var xmlHttp=GetXmlHttpObject();
				xmlHttp.onreadystatechange=stateChanged;
				xmlHttp.open("GET",url,true);
				xmlHttp.send(null);
			} else if(j==0) {
				headstr = "";
				if(config_values["teamval"] == 1) {
					headstr += "<th title='Team value'>Value</th>";
				}
				if(config_values["bankval"] == 1) {
					headstr += "<th title='Bank value'>Bank</th>";
				}
				if(config_values["totalval"] == 1) {
					headstr += "<th title='Total value'>Total</th>";
				}
				if(config_values["tt"] == 1) {
					headstr += "<th><abbr title='Total transfers'>TT</abbr></th>";
				}
				if(config_values["gwt"] == 1) {
					headstr += "<th><abbr title='Gameweek transfers'>GWT</abbr></th>";
				}
				if(config_values["hitpts"] == 1) {
					headstr += "<th><abbr title='Transfer points hit'>TPH</abbr></th>";
				}
				if(config_values["wc"] == 1) {
					headstr += "<th><abbr title='Wildcard available'>WC</abbr></th>";
				}
				if(config_values["chips"] == 1) {
					headstr += "<th><abbr title='Chips played'>Chips</abbr></th>";
				}
				if(config_values["captain"] == 1) {
					headstr += "<th>Captain</th>";
				}
				if(config_values["h2h"] == 1) {
					headstr += "<th><abbr title='Associated H2H league position'>H2H</abbr></th>";
				}
				if(config_values["livepoints"] == 1) {
					headstr += "<th><abbr title='Live gameweek points'>Live</abbr></th>";
				}
				if(config_values["livetotal"] == 1) {
					headstr += "<th><abbr title='Live points total'>Total</abbr></th>";
				}
				if(config_values["played"] == 1) {
					headstr += "<th><abbr title='Players played'>P</abbr></th>";
					headstr += "<th><abbr title='Players to play'>TP</abbr></th>";
					headstr += "<th><abbr title='Players who did not play'>DNP</abbr></th>";
				}
				ths = trs[j].getElementsByTagName("th");
				ths[0].className = "sorttable_nosort";
				ths[0].innerHTML = '<abbr onclick="divs=document.getElementsByTagName(\'div\');onoff=\'\';for(i=0;i<divs.length;i++){tmpid=divs[i].id;if(tmpid.lastIndexOf(\'teamdiv_\', 0) === 0){if(onoff==\'\'){if(divs[i].style.display == \'none\'){onoff=\'on\'}else{onoff=\'off\'}}if(onoff==\'on\'){divs[i].style.display=\'\'}else{divs[i].style.display=\'none\'}}}" title="Toggle teams">T</abbr>';
				ths[1].className = "sorttable_nosort";
				trs[j].innerHTML = trs[j].innerHTML + headstr;
			}
		}
		tables[i].innerHTML = tables[i].innerHTML + "<tr><td colspan=21><div id='configrow'></div></td></tr>";
		configrow = document.getElementById("configrow");
		
		for(i=0; i<config_items.length; i++) {
			c = config_items[i];
			//add captain config
			var div = document.createElement('div');
			div.style.display = "inline-block";
			div.style.float = "left";
			div.style.width = optionWidth;
			var span = document.createElement('span');
			span.appendChild(document.createTextNode(config_strs[c]+': '));
			div.appendChild(span);

			var a = document.createElement('a');
			if(config_values[c] == 0) {
				a.style.color = "#bbb";
			}
			a.id = c+'_on';
			a.appendChild(document.createTextNode('On'));
			a.href = 'javascript:null(0)';
			eval("a.addEventListener('click', function(){document.getElementById(\""+c+"_on\").style.color='#000'; document.getElementById(\""+c+"_off\").style.color='#bbb'; GM_setValue(\""+c+"\",1);}, false);");
			div.appendChild(a);

			var span = document.createElement('span');
			span.appendChild(document.createTextNode(' | '));
			div.appendChild(span);

			var a = document.createElement('a');
			if(config_values[c] == 1) {
				a.style.color = "#bbb";
			}
			a.id = c+'_off';
			a.appendChild(document.createTextNode('Off'));
			a.href = 'javascript:null(0)';
			eval("a.addEventListener('click', function(){document.getElementById(\""+c+"_off\").style.color='#000'; document.getElementById(\""+c+"_on\").style.color='#bbb'; GM_setValue(\""+c+"\",0);}, false);");
			div.appendChild(a);
			configrow.appendChild(div);
			//end captain config
		}

		var div = document.createElement('div');
		div.style.display = "inline-block";
		div.style.float = "left";
		div.style.width = optionWidth;
		var span = document.createElement('span');
		span.appendChild(document.createTextNode('All: '));
		div.appendChild(span);

		var a = document.createElement('a');
		a.id = 'all_on';
		a.appendChild(document.createTextNode('On'));
		a.href = 'javascript:null(0)';
		a.addEventListener('click', function(){
			for(i=0; i<config_items.length; i++) {
				c = config_items[i];
				document.getElementById(c+"_on").style.color='#000';
				document.getElementById(c+"_off").style.color='#bbb';
				GM_setValue(c, 1);
			}
		}, false);
		div.appendChild(a);

		var span = document.createElement('span');
		span.appendChild(document.createTextNode(' | '));
		div.appendChild(span);

		var a = document.createElement('a');
		a.id = 'all_off';
		a.appendChild(document.createTextNode('Off'));
		a.href = 'javascript:null(0)';
		a.addEventListener('click', function(){
			for(i=0; i<config_items.length; i++) {
				c = config_items[i];
				document.getElementById(c+"_off").style.color='#000';
				document.getElementById(c+"_on").style.color='#bbb';
				GM_setValue(c, 0);
			}
		}, false);
		div.appendChild(a);
		configrow.appendChild(div);

		var div = document.createElement('div');
		div.style.display = "inline-block";
		div.style.float = "left";
		div.style.width = optionWidth;
		var span = document.createElement('span');
		span.appendChild(document.createTextNode('Quick picks: '));
		div.appendChild(span);

		var a = document.createElement('a');
		a.id = 'all_on';
		a.appendChild(document.createTextNode('Team Info'));
		a.href = 'javascript:null(0)';
		a.addEventListener('click', function(){
			for(i=0; i<config_items.length; i++) {
				//live stats
				if(i<8) {
					c = config_items[i];
					document.getElementById(c+"_on").style.color='#000';
					document.getElementById(c+"_off").style.color='#bbb';
					GM_setValue(c, 1);
				} else {
					c = config_items[i];
					document.getElementById(c+"_off").style.color='#000';
					document.getElementById(c+"_on").style.color='#bbb';
					GM_setValue(c, 0);
				}
			}
		}, false);
		div.appendChild(a);

		var span = document.createElement('span');
		span.appendChild(document.createTextNode(' | '));
		div.appendChild(span);

		var a = document.createElement('a');
		a.id = 'all_off';
		a.appendChild(document.createTextNode('Live Data'));
		a.href = 'javascript:null(0)';
		a.addEventListener('click', function(){
			for(i=0; i<config_items.length; i++) {
				//live stats
				if(i==7 || i==8 || i==10 || i==11 || i==13) {
					c = config_items[i];
					document.getElementById(c+"_on").style.color='#000';
					document.getElementById(c+"_off").style.color='#bbb';
					GM_setValue(c, 1);
				} else {
					c = config_items[i];
					document.getElementById(c+"_off").style.color='#000';
					document.getElementById(c+"_on").style.color='#bbb';
					GM_setValue(c, 0);
				}
			}
		}, false);
		div.appendChild(a);
		configrow.appendChild(div);

		var div = document.createElement('div');
		div.style.display = "inline-block";
		div.style.width = refreshWidth;
		div.style.float = "bottom";
		div.style.paddingTop = "10px";
		var span = document.createElement('span');
		var a = document.createElement('a');
		a.appendChild(document.createTextNode('Reload'));
		a.href = 'javascript:location.reload()';
		a.style.border = "1px solid #000";
		a.style.padding = "3px";
		a.style.borderRadius = "6px";
		span.appendChild(a);
		div.appendChild(span);
		configrow.appendChild(div);
	}
}

//extra wide
if(config_values["wide"] == 1) {
	document.getElementById("body").style.width = "100%";
	var cols = document.getElementsByClassName('ismPrimaryWide');
	for(i=0; i<cols.length; i++) {
		cols[i].style.width = '1150px';
	}
	var cols = document.getElementsByClassName('ismContent');
	for(i=0; i<cols.length; i++) {
		cols[i].style.width = '1380px';
	}
	var cols = document.getElementsByClassName('ismWrapper');
	for(i=0; i<cols.length; i++) {
		cols[i].style.width = '1380px';
	}
} else {
	var cols = document.getElementsByClassName('ismPrimaryWide');
	for(i=0; i<cols.length; i++) {
		cols[i].style.width = '910px';
	}
	var cols = document.getElementsByClassName('ismWrapper');
	for(i=0; i<cols.length; i++) {
		cols[i].style.width = '1140px';
	}
}
