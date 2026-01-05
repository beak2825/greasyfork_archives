// ==UserScript==
// @name        Movie Dip - find movies to double dip (watch back-to-back)
// @namespace   driver8.net
// @description On the Google Movie Showtimes, select the movies you are interested in seeing to find out which ones you can see back-to-back at the same theater.
// @version     0.5
// @grant       GM_addStyle
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/sprintf/0.0.7/sprintf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.17.5/js/jquery.tablesorter.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.7.0/moment.min.js
// @match		*://*.google.com/movies*
// @downloadURL https://update.greasyfork.org/scripts/4072/Movie%20Dip%20-%20find%20movies%20to%20double%20dip%20%28watch%20back-to-back%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4072/Movie%20Dip%20-%20find%20movies%20to%20double%20dip%20%28watch%20back-to-back%29.meta.js
// ==/UserScript==

// im not vry good @ javascript sry

var AND_BUTTS = false;
var NUM_DIPS = 2;
var FRONT_TOLERANCE = 5;
var END_TOLERANCE = 40;
var FADE_SPEED = 200;
var PRETTY = true;
var LOGGING = false;

function log(msg) {
    LOGGING && console.log(msg);
}

function Film(title, id, length, times) {
    this.title = title;
    this.id = id;
    this.len = length;
    this.selected = false;
    this.checkBox = null;
    this.div = null;

    this.times = times;
}
Film.prototype.constructor = Film;


function Theater(name, id, num, films) {
    this.name = name;
    this.id = id;
    this.films = films;
    this.num = num;
    this.activeFilms = [];
    this.tableDiv = null;
}
Theater.prototype.constructor = Theater;

Theater.prototype.addFilm = function(newFilm) {
    this.films.push(newFilm);
};

Theater.prototype.toggleFilm = function(film) {
    if (this.activeFilms.contains(film)) {
        this.activeFilms.remove(film);
    } else this.activeFilms.push(film);
};

$.tablesorter.addParser({
    // set a unique id
    id: 'showtime',
    is: function(s) {
        // return false so this parser is not auto detected
        return false;
    },
    format: function(s, table, cell) {
        // format your data for normalization
        var sortNum = $(cell).data('sortNum');
        return sortNum;
    },
    // set type, either numeric or text
    type: 'numeric'
});


// Set things up
var theaters = [];
var theaterMap = {};
var tableMap = {};
// Gather list of theaters
var $allTheaters = $("div.theater");
var $settingsDiv = $('<div id="mdSettingsDiv"><b>Min. wait: </b><input type="text" class="mdSettings" id="mdFrontTolerance" name="FT" value="'+ FRONT_TOLERANCE +'" /> ' +
    '<b>Max. wait: </b><input type="text" class="mdSettings" id="mdEndTolerance" name="ET" value="'+ END_TOLERANCE +'" />' +
    '<b>Num. dips: </b><select class="mdSettings" id="mdNumDips" name="ND"><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option>' +
    '<option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select>');
$("#results table:first").remove(); // just took up space at the top
$("#movie_results").before($settingsDiv);
$("input.mdSettings").blur(selectionsChanged);
$("#mdNumDips").change(selectionsChanged);

$allTheaters.each(function(idx) {
    var $theaterDiv = $(this);
    var theaterName = $theaterDiv.find("h2.name a").text();
    var theaterId = $theaterDiv.children("div.desc:first").attr("id");

// For each theater, gather list of movies
    var $movieDivs = $theaterDiv.find("div.movie");

    var newFilms = [];
    $movieDivs.each(function(idx2) {
        var $movieDiv = $(this);
        var movieId = theaterId + "_" + idx2;

// For each movie, gather names, lengths and showtimes
        var $movieNameA = $movieDiv.find("div.name a");
        var movieName = $movieNameA.text();
        AND_BUTTS && $movieNameA.text(movieName + " and Butts");

        var $newCheckbox = $('<input type="checkbox" />');
        $newCheckbox.data("theater", theaterId);
        $newCheckbox.data("movie", idx2);
        $newCheckbox.attr("id", theaterId + "-" + idx2);
        $newCheckbox.change(movieCheckboxChange);

        $movieNameA.before($newCheckbox);

// Cute stuff
        $movieDiv.click(function(event) {
            event.target.tagName !== "INPUT" && $newCheckbox.click();
            return true;
        });

// Find movie length
        var movieLength = 90;
        var lengthMatches = $movieDiv.find("span.info").text().match(/\D*(?:(\d+)h)?\D*(\d+)m/);
        if (lengthMatches) {
            var hours = parseInt(lengthMatches[1]);
            var mins = parseInt(lengthMatches[2]);
            mins = mins >= 0 ? mins : 90;
            mins += hours > 0 ? hours * 60 : 0;
            movieLength = mins;
        }


// Deal with showtimes
        var newTimes = [];
        var $movieTimes = $movieDiv.find("div.times > span");

        var am1 = -1, am2 = -1, pm1 = -1;
        $movieTimes.each(function(idx) {
            var timeText = $(this).text();
            var matches = timeText.match(/(\d+):(\d+)\s*(am|pm)?/);
            if (matches[3] === 'am') {
                if (am1 == -1) {
                    am1 = idx;
                } else {
                    am2 = idx;
                }
            } else if (matches[3] === 'pm') {
                pm1 = idx;
            }
        });

        $movieTimes.each(function(idx) {
            var matches = $(this).text().match(/((\d+):(\d+))\s*(am|pm)?/);
            var timeStr = matches[1];
            var momTime = moment();
			if (pm1 == -1) {
				momTime = moment(timeStr + 'am', 'hh:mma');
            } else if (am1 < pm1) {
                if (idx <= am1) {
                    momTime = moment(timeStr + 'am', 'hh:mma');
                } else if (idx > pm1) {
                    momTime = moment(timeStr + 'am', 'hh:mma');
                    momTime.add(1, 'days');
                } else {
                    momTime = moment(timeStr + 'pm', 'hh:mma');
                }
            } else {
                if (idx <= pm1) {
                    momTime = moment(timeStr + 'pm', 'hh:mma');
                } else {
                    momTime = moment(timeStr + 'am', 'hh:mma');
                    momTime.add(1, 'days');
                }
            }
            newTimes.push(momTime);
        });

        var newFilm = new Film(movieName, movieId, movieLength, newTimes);
        newFilm.checkBox = $newCheckbox;
        newFilm.div = $movieDiv;
        newFilms[idx2] = newFilm;

    });

    var newTheater = new Theater(theaterName, theaterId, idx, newFilms);

    theaters.push(newTheater);
    theaterMap[theaterId] = newTheater;
});

function movieDivEnter(event) {
    var id = event.data.id;
    $('table.mdTable td.title_cell, table.mdTable td.time_cell')
        .filter(function () {
            return $(this).data("movieId") === id;
        })
        .addClass('times_table_highlight');
}

function movieDivLeave() {
        $('table.mdTable td.times_table_highlight').removeClass('times_table_highlight');
}

// Runs whenever a checkbox is checked or unchecked
function movieCheckboxChange(event) {
    var $checkBox = $(event.target);
    var theaterId = $checkBox.data("theater");
    var filmNum = $checkBox.data("movie");
    var theater = theaterMap[theaterId];
    var film = theater.films[filmNum];
    var $movieDiv = film.div;

    film.selected = $checkBox.prop("checked");
    if (film.selected) {
        theater.activeFilms.push(film);
        $movieDiv.addClass("mdSelected");
        $movieDiv.mouseenter({'id': film.id}, movieDivEnter);
        $movieDiv.mouseleave(movieDivLeave);
    } else {
        theater.activeFilms = theater.activeFilms.filter(function(item) {
            return item.id !== film.id;
        });
        $movieDiv.removeClass("mdSelected");
        $movieDiv.off("mouseenter");
        $movieDiv.off("mouseleave");
    }

    selectionsChanged(event, theater);
    $movieDiv.mouseenter();
    return false;
}

// Runs whenever there is a change in selected movies (with theater ID) or in the settings (w/o ID)
function selectionsChanged(event, theater) {
    if (theater) {
        checkTheater(theater)
    } else {
        $.each(theaters, function () {
            checkTheater(this);
        });
    }
    return false;
}

// Check theater for selections. If there are enough selections, makeTable.
function checkTheater(theater) {
    if (theater.activeFilms.length >= NUM_DIPS) {
        var $newTable = makeTable(theater.activeFilms, theater.id);

        if ($newTable) {
            $newTable.hide();
            $newTable.children("table").tablesorter({
                theme: 'blue',
                headers: {
                    1: {
                        sorter:'showtime'
                    },
                    3: {
                        sorter:'showtime'
                    },
                    5: {
                        sorter:'showtime'
                    },
                    7: {
                        sorter:'showtime'
                    },
                    9: {
                        sorter:'showtime'
                    },
                    11: {
                        sorter:'showtime'
                    }
                }
            });
            $('#' + theater.id).next().after($newTable);

            if (theater.tableDiv !== null) {
                theater.tableDiv.remove();
                theater.tableDiv = $newTable;
                theater.tableDiv.show();
            } else {
                theater.tableDiv = $newTable;
                theater.tableDiv.show(FADE_SPEED);

            }
        } else if (theater.tableDiv !== null) {
            theater.tableDiv.hide(FADE_SPEED, function() { theater.tableDiv.remove(); theater.tableDiv = null; });
        }
    } else {
        if (theater.tableDiv !== null) {
            theater.tableDiv.hide(FADE_SPEED, function() { theater.tableDiv.remove(); theater.tableDiv = null; });
        }
    }
}

// Figures out which selected films can be multi-dipped
function makeTable(films, tId) {
    log("making table");
    var selected_films = films;
    var matches = [];
    var front_tolerance = parseInt($("#mdFrontTolerance").prop("value"));
    var end_tolerance = parseInt($("#mdEndTolerance").prop("value"));
    var num_dips = parseInt($("#mdNumDips").prop("value"));

    for (var i = 0, len = selected_films.length; i < len; i++) {
        var film1 = selected_films[i];
        var times1 = film1.times;
        var len1 = film1.len;
        for (var j = i + 1; j < len; j++) {
            var film2 = selected_films[j];
            if ( !(film1.title.indexOf(film2.title) == 0 && film1.title.lastIndexOf("3D") > 0) &&
                !(film2.title.indexOf(film1.title) == 0 && film2.title.lastIndexOf("3D") > 0)) {
                var times2 = film2.times;
                var len2 = film2.len;

                times1.forEach(function (val1) {
                    times2.forEach(function (val2) {
                        var match;
                        var diff2 = val1.diff(val2, 'minutes');
                        var diff1 = val2.diff(val1, 'minutes');

                        if (diff1 - len1 >= front_tolerance && diff1 - len1 <= end_tolerance) {
                            match = {
                                m: [film1, film2],
                                t: [val1, val2],
                                wait: [diff1 - len1]
                            };
                            matches.push(match);
                        } else if (diff2 - len2 >= front_tolerance && diff2 - len2 <= end_tolerance) {
                            match = {
                                m: [film2, film1],
                                t: [val2, val1],
                                wait: [diff2 - len2]
                            };
                            matches.push(match);
                        }
                    });
                });
            }
        }
    }

    log('num dips: ' + num_dips);
    var new_matches;
    var dipnum = 2;
    while (dipnum < num_dips && matches.length > 0) {
        new_matches = [];
        $.each(matches, function() {
            var this_match = this;
            $.each(selected_films, function() {
                var film2 = this;
                var nogood = false;
                $.each(this_match.m, function() {
                    if (    this.title === film2.title ||
                            (this.title.indexOf(film2.title) == 0 && this.title.lastIndexOf("3D") > 0) ||
                            (film2.title.indexOf(this.title) == 0 && film2.title.lastIndexOf("3D") > 0)
                    ) {
                        nogood = true;
                        return false; // break
                    }
                });
                if (nogood) return true; // continue

                var film1 = this_match.m[dipnum - 1];
                var val1 = this_match.t[dipnum - 1];
                var len1 = film1.len;
                var times2 = film2.times;

                times2.forEach(function (val2) {
                    var diff1 = val2.diff(val1, 'minutes');

                    if (diff1 - len1 >= front_tolerance && diff1 - len1 <= end_tolerance) {
                        var new_match = {};
                        new_match.m = this_match.m.concat(film2);
                        new_match.t = this_match.t.concat(val2);
                        new_match.wait = this_match.wait.concat(diff1 - len1);
                        new_matches.push(new_match);
                    }
                });
            });
        });

        dipnum++;
        console.log("new matches: " + new_matches.length);
        matches = new_matches;
    }


    if (matches.length > 0) {
        console.log(matches.length + " matches");
        var html = "";

        // Sort the matched pairs of movies by the first movie's starting time.
        matches.sort(function(a, b) {
            var diff = a.t[0].diff(b.t[0], 'minutes');
            return diff;
        });

        // Create the html table
        html = '<div class="mdTableDiv" id="' + tId + 'mdTableDiv"> <table id="' + tId + 'mdTable" class="tablesorter mdTable"> <thead> <tr> ';
        for (var mnum = 1; mnum <= num_dips; mnum++) {
            html += '<th>Movie ' + mnum + '</th> <th>Time ' + mnum + '</th>';
            if (mnum > 1) {
                html += '<th>Wait</th>';
            }
        }
        html += ' </tr> </thead> <tbody>';
        var fmt = 'hh:mm A';

        matches.forEach(function(val) {
            var s = '<tr> ';
            for (mnum = 0; mnum < num_dips; mnum++) {
                s += '<td class="title_cell" data-movie-id="' + val.m[mnum].id + '">' + val.m[mnum].title +
                    '</td> <td class="time_cell" data-movie-id="' + val.m[mnum].id + '" data-sort-num="' +
                    val.t[mnum].valueOf() + '"><b>' + val.t[mnum].format(fmt) + '</b></td> ';
                if (mnum > 0) {
                    s+= '<td class="wait_cell"><b>' + val.wait[mnum - 1] + '</b> min wait</td> ';
                }
            }
            s += '</tr>\n';

            html += s;
        });

        html += "</tbody> </table> </div>";

        return $(html);

    } else return null;
}


// Add custom CSS
var userStyles0 =
    "div.mdDiv { display: inline-block; !important}" +
    "div.movie:hover { background-color: #FFF8D4;}" +
    "a.mdCheck { display: inline-block; border: 2px solid #588220; border-radius: 8px; background-color: #588220; color: #D8FFA8; " +
    "padding: 2px 5px; margin-right: 5px; margin-bottom: 5px; line-height: 24px; !important}" +
    "a.mdCheck:link { text-decoration: none; }" +
    "div.mdSelected { background-color: #CCFFBB; !important}" +
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

GM_addStyle(userStyles3);
GM_addStyle(userStyles0);


/// REMOVE GOOGLE LINK TRACKING ///
// http://google.com/url?q=http://www.imdb.com/title/tt2294449/&sa=X&oi=moviesi&ii=0&usg=AFQjCNGscoN77bL-4GPf_VHQGumRZwQtAg
// http://google.com/url?q=http://www.youtube.com/watch%3Fv%3DVQqUOvQKPBg&sa=X&oi=movies&ii=0&usg=AFQjCNE3UMhKGsCv8WI8pgS-LMhnI2e0fA

$('a[href^="/url?q="]').each(function() {
    this.href = this.href.replace(/^https?:\/\/google\.com\/url\?q=/, '');
    this.href = this.href.replace(/&(?:sa|oi|ii|usg)=.*/, '');
    this.href = decodeURIComponent(this.href);
    this.href = this.href.replace(/afid=goog&?/, '');
    this.href = this.href.replace(/source=google&?/, '');
});