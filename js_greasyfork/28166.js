// ==UserScript==
// @name        Fandango Movie Dip
// @namespace   driver8.net
// @description On Fandango's printable movie showtimes, select the movies you are interested in seeing to find out which ones you can see back-to-back at the same theater.
// @match       *://*.fandango.com/theaterlistings-prn.aspx*
// @version     0.1
// @grant       GM_addStyle
// @require     https://cdnjs.cloudflare.com/ajax/libs/tablesort/4.1.0/tablesort.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/tablesort/4.1.0/src/sorts/tablesort.number.js
// @downloadURL https://update.greasyfork.org/scripts/28166/Fandango%20Movie%20Dip.user.js
// @updateURL https://update.greasyfork.org/scripts/28166/Fandango%20Movie%20Dip.meta.js
// ==/UserScript==
console.log('hi');

var FRONT_TOLERANCE = 2;
var END_TOLERANCE = 40;

var theaters = getTheaters();
console.log('theaters', theaters);

var TimesList = {
    add: function (showtime) {
        console.log('adding showtime', showtime);
        this.head = this.head || { showtime: null, next: null };
        if (this.head.next == null) {
            this.head.next = {showtime: showtime, next: null};
            return;
        }
        var cur = this.head;
        while (cur.next != null) {
            if (cur.next.showtime.time >= showtime.time) {
                cur.next = {showtime: showtime, next: cur.next};
                return;
            }
            cur = cur.next;
        }
        cur.next = {showtime: showtime, next: null};
    },
    remove: function (showtime) {
        if (!this.head || this.head.next == null) return;
        var cur = this.head;
        while (cur.next != null) {
            if (cur.next.showtime == showtime) {
                cur.next = cur.next.next;
                return;
            }
            cur = cur.next;
        }
    },
    getMatches: function(num, min, max) {
        if (num < 2 || !this.head || this.head.next == null) return;
        var matches = [];
        trace(this.head.next, num, min, max, null, matches);
        return matches;
    }
};


//var testll = Object.create(TimesList);
//theaters[1].films.forEach(function(film) {
//    film.showtimes.forEach(function(showtime) {
//        testll.add(showtime);
//    });
//});
//
//var found = testll.getMatches(3, 5, 15);
//console.log('found', found);

//found.forEach(function(match, idx) {
//    console.log('match ' + idx + ': ' + match[0].h + 'h' + match[0].m + 'm - ' + match[0].film.length + ' - ' + match[0].film.title +
//        '\n' + match[1].h + 'h' + match[1].m + 'm - ' + match[1].film.title);
//});

function getTheaters() {
    var theaters = [];
    getEls('table').forEach(function(table, idx) {
        var theater = {
            name: trim(getEl('h4', table).textContent),
            id: idx,
            films: [],
            selected: [],
            //allTimes: [],
            table: table
        };
        console.log('theaters', theaters);
        getEls('tr', table).forEach(function(tr, idx2) {
            if (getEl('h4', tr)) return;
            //tr.classList.add('trt' + idx + 'f' + idx2);
            var text = getEl('td', tr).textContent;
            var m1 = text.match(/([^]+?)\(/);
            var m2 = text.match(/•\s*(\d+)\s*hr\s*(\d+)\s*min/);
            if (!m1 || !m2) return
            var film = {
                title: trim(m1[1]),
                id: idx2,
                length: parseInt(m2[1]) * 60 + parseInt(m2[2]),
                showtimes: [],
                theater: theater,
                selected: false
            };
            getEls('li', tr).forEach(function(time) {
                var m = time.textContent.match(/(\d+):(\d+)(a|p)/);
                if (!m) return;
                var showtime = {
                    h: parseInt(m[1]) + (m[3] == 'p' && parseInt(m[1]) != 12 ? 12 : 0),
                    m: m[2],
                    film: film
                };
                showtime.time = showtime.h * 60 + parseInt(showtime.m);
                film.showtimes.push(showtime);
                //theater.allTimes.push(showtime);
            });
            console.log('film', film);
            theater.films.push(film);
            tr.onclick  = function() { filmSelect(tr, film) };
        });
        theaters.push(theater);
    });
    return theaters;
}

function filmSelect(tr, film) {
    console.log('clicked tr', tr, film);
    tr.onclick = function() { filmUnselect(tr, film) };
    tr.classList.add('mdSelected');
    film.selected = true;
    checkSelected(film.theater);
}

function filmUnselect(tr, film) {
    tr.onclick = function() { filmSelect(tr, film) };
    tr.classList.remove('mdSelected');
    film.selected = false;
    checkSelected(film.theater);
}

function checkSelected(theater) {
    var selected = theater.films.filter(function(film) {
        return film.selected;
    });
    console.log('selected', selected);
    var html = makeTable(selected, theater.id);
    //console.log('html3', html);
    var tableDiv = getEl('#t' + theater.id + 'mdTableDiv');
    if (html) {
        //console.log('html', html);
        if (!tableDiv) {
            tableDiv = document.createElement('div');
            theater.table.parentNode.insertBefore(tableDiv, theater.table.nextSibling);
        }
        tableDiv.outerHTML = html;
        console.log('tableDiv', tableDiv);
        Tablesort(document.getElementById('t' + theater.id + 'mdTable'));
    } else {
        console.log('removing div', tableDiv);
        tableDiv && tableDiv.parentNode.removeChild(tableDiv);
    }
}

function trace(cur, num, min, max, sofar, found) {
    console.log('cur.showtime, sofar', cur.showtime, sofar);
    if (cur.next == null) return false;
    var showend = cur.showtime.time + cur.showtime.film.length;
    var newsofar;
    var temp = cur;
    while (temp.next != null) {
        console.log('temp', temp);
        if (cur.showtime.film.title.replace(/\W*(3D)?\W*$/, '') ==
            temp.next.showtime.film.title.replace(/\W*(3D)?\W*$/, '')) {
            temp = temp.next;
            continue;
        }
        var diff = temp.next.showtime.time - showend;
        //console.log('diff', diff);
        if (diff <= max) {
            if (diff >= min) {
                if (!sofar || sofar.length < 1) {
                    //console.log('sofar?', sofar);
                    newsofar = [cur.showtime];
                } else {
                    //console.log('sofar??', sofar);
                    newsofar = sofar.slice();
                }
                newsofar.push(temp.next.showtime);
                console.log('newsofar', newsofar);
                if (newsofar.length == num) {
                    found.push(newsofar);
                } else {
                    //return trace(temp.next, num, min, max, newsofar, found);
                    console.log('keep tracing');
                    trace(temp.next, num, min, max, newsofar, found);
                }
            }
            temp = temp.next;
            console.log('temp2', temp);
        } else {
            break;
        }
    }
    if (!sofar || sofar.length < 1) {
        trace(cur.next, num, min, max, sofar, found);
    }
}

function getEl(q, c) {
    if (!q) return;
    return (c || document).querySelector(q);
}

function getEls(q, c) {
    return [].slice.call((c || document).querySelectorAll(q));
}

function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}



var settingsHTML = '<div id="mdSettingsDiv"><b>Min. wait: </b><input type="text" class="mdSettings" id="mdFrontTolerance" name="FT" value="'+ FRONT_TOLERANCE +'" /> ' +
    '<b>Max. wait: </b><input type="text" class="mdSettings" id="mdEndTolerance" name="ET" value="'+ END_TOLERANCE +'" />' +
    '<b>Num. dips: </b><select class="mdSettings" id="mdNumDips" name="ND"><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option>' +
    '<option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select></div>';
var settingsDiv = document.createElement('div');
getEl('#container').insertBefore(settingsDiv, getEl('#content'));
settingsDiv.outerHTML = settingsHTML;

function makeTable(films, tId) {
    console.log("making table");
    var front_tolerance = parseInt(getEl("#mdFrontTolerance").value);
    var end_tolerance = parseInt(getEl("#mdEndTolerance").value);
    var num_dips = parseInt(getEl("#mdNumDips").value);
    //console.log('f, e, n', front_tolerance, end_tolerance, num_dips);
    if (films.length < num_dips) return null;

    var ll = Object.create(TimesList);
    //console.log('ll', ll);
    films.forEach(function(film) {
        film.showtimes.forEach(function(showtime) {
            ll.add(showtime);
        });
    });
    console.log('ll2', ll);
    var matches = ll.getMatches(num_dips, front_tolerance, end_tolerance);

    console.log('matches', matches);
    if (matches.length > 0) {
        //console.log(matches.length + " matches");
        var html = "";

        // Sort the matched pairs of movies by the first movie's starting time.
        matches.sort(function(a, b) {
            return a.time - b.time;
        });

        console.log('sorted matches', matches);
        // Create the html table
        html = '<div class="mdTableDiv" id="t' + tId + 'mdTableDiv"> <table id="t' + tId + 'mdTable" class="tablesorter mdTable"> <thead> <tr> ';
        for (var i = 1; i <= num_dips; i++) {
            html += '<th>Movie ' + i + '</th> <th data-sort-method="number">Time ' + i + '</th>';
            if (i > 1) {
                html += '<th>Wait</th>';
            }
        }
        html += ' </tr> </thead> <tbody>';
        //console.log('html1', html);

        matches.forEach(function(match) {
            var s = '<tr> ';
            for (i = 0; i < num_dips; i++) {
                var id = 't' + match[i].film.theater.id + 'f' + match[i].film.id;
                //console.log('id', id);
                s += '<td class="title_cell" data-movie-id="' + id + '">' + match[i].film.title +
                    '</td> <td class="time_cell" data-movie-id="' + id + '" data-sort-num="' +
                    match[i].time + '" data-sort="' + match[i].time + '"><b>' + match[i].h + ':' +
                    match[i].m + '</b></td> ';
                //console.log('s1', s);
                if (i > 0) {
                    s+= '<td class="wait_cell"><b>' + (match[i].time - match[i - 1].time - match[i - 1].film.length) + '</b> min wait</td> ';
                    //console.log('s2', s);
                }
            }
            s += '</tr>\n';
            //console.log('s3', s);

            html += s;
            //console.log('html1', html);
        });

        html += "</tbody></table></div>";
        //console.log('html2', html);

        return html;

    } else return null;
}

// Add custom CSS
var userStyles0 =
    "div.mdDiv { display: inline-block; !important}" +
    "div.movie:hover { background-color: #FFF8D4;}" +
    "a.mdCheck { display: inline-block; border: 2px solid #588220; border-radius: 8px; background-color: #588220; color: #D8FFA8; " +
    "padding: 2px 5px; margin-right: 5px; margin-bottom: 5px; line-height: 24px; !important}" +
    "a.mdCheck:link { text-decoration: none; }" +
    "div.mdSelected, tr.mdSelected { background-color: #CCFFBB; !important}" +
    "div.mdSelected:hover { background-color: #99FF88 }" +
    ".theater .showtimes { margin-bottom: 0px; !important}" +
    "div.theater { margin-bottom: 40px; }" +
    ".mdTable td.wait_cell { color: #888888; !important }" +
    ".mdTable td.times_table_highlight { background-color: #CCFFBB; !important }" +
    "#mdSettingsDiv b { font-size: 1.1em; }" +
    "#mdSettingsDiv input { margin-right: 5px; font-size: 1em; }" +
    "#mdSettingsDiv select { margin-right: 5px; font-size: 1em; width: 4em; }" +
    "";

var userStyles3 = "" +
    ".tablesorter-blue {" +
    "	width: auto;" +
    "	background-color: #fff;" +
    "	margin: 10px 0 15px;" +
    "	text-align: left;" +
    "	border-spacing: 0;" +
    "	border: #cdcdcd 1px solid;" +
    "	border-width: 1px 0 0 1px;" +
    "}" +
    ".tablesorter-blue th," +
    ".tablesorter-blue td {" +
    "	border: #cdcdcd 1px solid;" +
    "	border-width: 0 1px 1px 0;" +
    "}" +
    "" +
    "/* header */" +
    ".tablesorter-blue th," +
    ".tablesorter-blue thead td {" +
    "	font: bold 12px/18px Arial, Sans-serif;" +
    "	color: #000;" +
    "	background-color: #99bfe6;" +
    "	border-collapse: collapse;" +
    "	padding: 6px;" +
    "	text-shadow: 0 1px 0 rgba(204, 204, 204, 0.7);" +
    "}" +
    ".tablesorter-blue tbody td," +
    ".tablesorter-blue tfoot th," +
    ".tablesorter-blue tfoot td {" +
    "	padding: 6px;" +
    "	vertical-align: top;" +
    "}" +
    ".tablesorter-blue .header," +
    ".tablesorter-blue .tablesorter-header {" +
    "	/* black (unsorted) double arrow */" +
    "	background-image: url(data:image/gif;base64,R0lGODlhFQAJAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw==);" +
    "	/* white (unsorted) double arrow */" +
    "	/* background-image: url(data:image/gif;base64,R0lGODlhFQAJAIAAAP///////yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw==); */" +
    "	/* image */" +
    "	/* background-image: url(images/black-unsorted.gif); */" +
    "	background-repeat: no-repeat;" +
    "	background-position: center right;" +
    "	padding: 6px 18px 6px 6px;" +
    "	white-space: normal;" +
    "	cursor: pointer;" +
    "}" +
    ".tablesorter-blue .headerSortUp," +
    ".tablesorter-blue .tablesorter-headerSortUp," +
    ".tablesorter-blue .tablesorter-headerAsc {" +
    "	background-color: #9fbfdf;" +
    "	/* black asc arrow */" +
    "	background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);" +
    "	/* white asc arrow */" +
    "	/* background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAAP///////yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7); */" +
    "	/* image */" +
    "	/* background-image: url(images/black-asc.gif); */" +
    "}" +
    ".tablesorter-blue .headerSortDown," +
    ".tablesorter-blue .tablesorter-headerSortDown," +
    ".tablesorter-blue .tablesorter-headerDesc {" +
    "	background-color: #8cb3d9;" +
    "	/* black desc arrow */" +
    "	background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);" +
    "	/* white desc arrow */" +
    "	/* background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAAP///////yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7); */" +
    "	/* image */" +
    "	/* background-image: url(images/black-desc.gif); */" +
    "}" +
    ".tablesorter-blue thead .sorter-false {" +
    "	background-image: none;" +
    "	cursor: default;" +
    "	padding: 6px;" +
    "}" +
    "" +
    "/* tfoot */" +
    ".tablesorter-blue tfoot .tablesorter-headerSortUp," +
    ".tablesorter-blue tfoot .tablesorter-headerSortDown," +
    ".tablesorter-blue tfoot .tablesorter-headerAsc," +
    ".tablesorter-blue tfoot .tablesorter-headerDesc {" +
    "	/* remove sort arrows from footer */" +
    "	background-image: none;" +
    "}" +
    "" +
    "/* tbody */" +
    ".tablesorter-blue td {" +
    "	color: #3d3d3d;" +
    "	background-color: #fff;" +
    "	padding: 6px;" +
    "	vertical-align: top;" +
    "}" +
    "" +
    "/* hovered row colors" +
    " you'll need to add additional lines for" +
    " rows with more than 2 child rows" +
    " */" +
    ".tablesorter-blue tbody > tr:hover > td," +
    ".tablesorter-blue tbody > tr:hover + tr.tablesorter-childRow > td," +
    ".tablesorter-blue tbody > tr:hover + tr.tablesorter-childRow + tr.tablesorter-childRow > td," +
    ".tablesorter-blue tbody > tr.even:hover > td," +
    ".tablesorter-blue tbody > tr.even:hover + tr.tablesorter-childRow > td," +
    ".tablesorter-blue tbody > tr.even:hover + tr.tablesorter-childRow + tr.tablesorter-childRow > td {" +
    "	background: #d9d9d9;" +
    "}" +
    ".tablesorter-blue tbody > tr.odd:hover > td," +
    ".tablesorter-blue tbody > tr.odd:hover + tr.tablesorter-childRow > td," +
    ".tablesorter-blue tbody > tr.odd:hover + tr.tablesorter-childRow + tr.tablesorter-childRow > td {" +
    "	background: #bfbfbf;" +
    "}" +
    "" +
    "/* table processing indicator */" +
    ".tablesorter-blue .tablesorter-processing {" +
    "	background-position: center center !important;" +
    "	background-repeat: no-repeat !important;" +
    "	/* background-image: url(../addons/pager/icons/loading.gif) !important; */" +
    "	background-image: url('data:image/gif;base64,R0lGODlhFAAUAKEAAO7u7lpaWgAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQBCgACACwAAAAAFAAUAAACQZRvoIDtu1wLQUAlqKTVxqwhXIiBnDg6Y4eyx4lKW5XK7wrLeK3vbq8J2W4T4e1nMhpWrZCTt3xKZ8kgsggdJmUFACH5BAEKAAIALAcAAAALAAcAAAIUVB6ii7jajgCAuUmtovxtXnmdUAAAIfkEAQoAAgAsDQACAAcACwAAAhRUIpmHy/3gUVQAQO9NetuugCFWAAAh+QQBCgACACwNAAcABwALAAACE5QVcZjKbVo6ck2AF95m5/6BSwEAIfkEAQoAAgAsBwANAAsABwAAAhOUH3kr6QaAcSrGWe1VQl+mMUIBACH5BAEKAAIALAIADQALAAcAAAIUlICmh7ncTAgqijkruDiv7n2YUAAAIfkEAQoAAgAsAAAHAAcACwAAAhQUIGmHyedehIoqFXLKfPOAaZdWAAAh+QQFCgACACwAAAIABwALAAACFJQFcJiXb15zLYRl7cla8OtlGGgUADs=') !important;" +
    "}" +
    "" +
    "/* Zebra Widget - row alternating colors */" +
    ".tablesorter-blue tbody tr.odd td {" +
    "	background-color: #ebf2fa;" +
    "}" +
    ".tablesorter-blue tbody tr.even td {" +
    "	background-color: #fff;" +
    "}" +
    "" +
    "/* Column Widget - column sort colors */" +
    ".tablesorter-blue td.primary," +
    ".tablesorter-blue tr.odd td.primary {" +
    "	background-color: #99b3e6;" +
    "}" +
    ".tablesorter-blue tr.even td.primary {" +
    "	background-color: #c2d1f0;" +
    "}" +
    ".tablesorter-blue td.secondary," +
    ".tablesorter-blue tr.odd td.secondary {" +
    "	background-color: #c2d1f0;" +
    "}" +
    ".tablesorter-blue tr.even td.secondary {" +
    "	background-color: #d6e0f5;" +
    "}" +
    ".tablesorter-blue td.tertiary," +
    ".tablesorter-blue tr.odd td.tertiary {" +
    "	background-color: #d6e0f5;" +
    "}" +
    ".tablesorter-blue tr.even td.tertiary {" +
    "	background-color: #ebf0fa;" +
    "}" +
    "";
var userStyles4 = "th[role=columnheader]:not(.no-sort) {" +
    "	cursor: pointer;" +
    "}" +
    "" +
    "th[role=columnheader]:not(.no-sort):after {" +
    "	content: '';" +
    "	float: right;" +
    "	margin-top: 7px;" +
    "	border-width: 0 4px 4px;" +
    "	border-style: solid;" +
    "	border-color: #404040 transparent;" +
    "	visibility: hidden;" +
    "	opacity: 0;" +
    "	-ms-user-select: none;" +
    "	-webkit-user-select: none;" +
    "	-moz-user-select: none;" +
    "	user-select: none;" +
    "}" +
    "" +
    "th[aria-sort=ascending]:not(.no-sort):after {" +
    "	border-bottom: none;" +
    "	border-width: 4px 4px 0;" +
    "}" +
    "" +
    "th[aria-sort]:not(.no-sort):after {" +
    "	visibility: visible;" +
    "	opacity: 0.4;" +
    "}" +
    "" +
    "th[role=columnheader]:not(.no-sort):hover:after {" +
    "	visibility: visible;" +
    "	opacity: 1;" +
    "}" +
    "" +
    ".mdTable th { cursor: pointer; }";

GM_addStyle(userStyles3);
GM_addStyle(userStyles0);
GM_addStyle(userStyles4);