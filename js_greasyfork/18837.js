// ==UserScript==
// @name         strikeout.co scores
// @namespace    http://your.homepage/
// @version      1.0
// @description  inclues game info on strikeout.co main page
// @author       muffleyd
// @match        http://www.strikeout.co/
// @grant        $
// @downloadURL https://update.greasyfork.org/scripts/18837/strikeoutco%20scores.user.js
// @updateURL https://update.greasyfork.org/scripts/18837/strikeoutco%20scores.meta.js
// ==/UserScript==

/** Copywrite David Muffley 2015-2016.
 * Use however you like, with acknowledgement.
 */

(function () {
// TODO more styling for info text?

//remove crap at the top of the content
if ("#content #accordian") {
    $("#content > *:not(:has(#accordion))").remove();
}
//just, stop
$('#toTop').remove();

//_main() won't run through if tab is hidden, this stores when that occurs so on tab visibility it can run again
var SKIPPED = false;
//_main() will always run the first time through even if the tab is hidden
var firstGet = true;

//completed inning value to display no hitter info (middle of previous inning for away hitters)
var NOHITATBATS = 6;

var addedClasses = ['_tmMLBFree', '_tmESPN'];
var selectorParent = '#content h1[league="Major League Baseball"]';

function parseTime(time) {
    //time can be in format of "10:35" or timezone like "-03:30" or "+9:30"
    var mod = 1;
    if (time[0] == '-' || time[0] == '+') {
        if (time[0] == '-') {
            mod = -1;
        }
        time = time.substring(1);
    }
    time = time.split(':');
    return mod * ((parseInt(time[0]) * 60) + parseInt(time[1]));
}
//set "mlbgday" attr to match mlb.com's scoreboard since "gday" attribute may not match mlb's date, based on timezone
(function () {
    var timezoneMod = parseTime(timezone) + 240; // + 240 makes this effectively eastern time, close enough
    $(selectorParent + ' .matchtime').each(function (index, el) {
        var val = el.getAttribute('gday');
        //even at -12:00 it can't be behind by a day, it can only ever be ahead by a day all the way to +13:00
        if (parseTime(el.innerText) - timezoneMod < 0) {
            var dateObj = new Date(val);
            dateObj.setTime(dateObj.getTime() - (86400 * 1000));
            val = dateObj.toJSON().slice(0, 10);
        }
        el.setAttribute('mlbgday', val);
    })
})();

//pass an optional delay in
// when waking up from sleep the network connection is not immediately active, this allows you to compensate for that
function main(delay) {
    if (!delay) {
        delay = 0;
    }
    setTimeout(_main, delay * 1000);
}

// 5 hours in the past, for when it's after midnight, not sure if needed
function _main() {
    //skip when tab is hidden or window is minimized, and set so event is later told to run main()
    if (!firstGet && document.hidden) {
        SKIPPED = true;
        return;
    }
    firstGet = false;
    var dateObj = new Date();

    //offset the computer's timezone to get UTC, then go back 10 hours to guarantee you use the correct date for mlb.com
    var date = new Date(dateObj.getTime() + (dateObj.getTimezoneOffset() * 60 * 1000) - (1000 * 60 * 60 * 10));
    var year = date.getFullYear().toString();

    //January is 0, etc, so add 1
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month.toString();
    } else {
        month = month.toString();
    }
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day.toString();
    } else {
        day = day.toString();
    }
    $.getJSON('http://gd2.mlb.com/components/game/mlb/year_' + year + '/month_' + month + '/day_' + day + '/miniscoreboard.json', function (resp, type) {
        if (type == 'success') {
            $(document).ready(function () {
                //clear previously added classes to elements
                addedClasses.forEach(function (item) {
                    $(selectorParent).removeClass(item);
                });
                var info = resp.data.games.game;
                if (info.length === undefined) { //if only one game, it's not passed back as an array
                    info = [info];
                }
                var gameObj = {};
                //on later runs, remove added text immediately
                $(selectorParent + ' a ._tmInfo').remove();
                //get all team names from today
                $(selectorParent + ' a:has(span[mlbgday="' + year + '-' + month + '-' + day + '"])').each(function (index, el) {
                    var gameText = el.lastChild.textContent.trim();
                    //later regex now checks for hyphens, so deal with it in D-backs
                    gameText = gameText.replace('D-backs', 'Diamondbacks');
                    //Find games missing the colon before "Game #" and add it in
                    // But don't for ones using a hyphen
                    gameText = gameText.replace(/([^:\-])(\s+[Gg]ame\s+[0-9]+)$/, '$1:$2');
                    //Turn "Team vsTeam" into "Team vs Team". Not truely needed since only the team name, not city is used, but just in case
                    gameText = gameText.replace(/(\s+[Vv][Ss])([A-Z])/, '$1 $2');
                    //this match regex handles things like:
                    //   Team vs Team
                    //   Team vs Team: Game 2
                    //   MLB Wildcard: Team vs Team
                    //   ALDS: Team vs Team: Game 1
                    //   Team vs Team - Game 2
                    //regex split is for occasional non-space blank character (tab has been there)
                    var txt = gameText.match(/([^:]+:|^)(.*?vs[^:\-$]+)(.*)/i);
                    if (txt === null) {
                        console.log('not a game', gameText);
                        //something like "MLB on Fox Sports 1 Pregame"
                        return;
                    }
                    var texts = txt[2].split(/\s+vs\s+/i);
                    texts.forEach(function (item) {
                        var splitItems = item.trim().split(/\s+/);
                        //strip out this special thing that has appeared during spring training
                        if (splitItems[splitItems.length-1] == '(ss)') {
                            splitItems.pop();
                        }
                        splitItems.forEach(function (item, index, arr) {
                            //combine all words after the first, getting smaller and smaller,
                            //because of things like "Chicago White Sox" while avoiding "Los Angeles Dodgers"
                            if (index == 0) {
                                return;
                            }
                            var key = arr.slice(index).join(' ');
                            if (!gameObj.hasOwnProperty(key)) {
                                gameObj[key] = [];
                            }

                            //sometimes a game appears as "A vs B - Game 2", so keep the spaces around the "-"
                            if (txt[3][0] == '-') {
                                var txt2end = txt[2].substr(-1);
                                if (txt2end.match(/\s/)) {
                                    txt[3] = txt2end + txt[3];
                                    txt[2] = txt[2].slice(0, -1);
                                }
                            }
                            //place at the head since the (reversed) game array goes from the beginning of gameObj[key]
                            //include the original text so extra stuff can stay when rewriting it later
                            gameObj[key].unshift([el, txt]);
                        });
                    });
                });
                //fix differences
                if (gameObj.hasOwnProperty('Diamondbacks')) {
                    gameObj['D-backs'] = gameObj['Diamondbacks'];
                }
                console.log(gameObj);
                //sort handles out of order games in the info list which happens sometimes with resumed games or double headers
                info.sort(function (a, b) {
                    //test for NaN because sometimes "time" is like "Game 2"
                    var t1 = a.time.split(':');
                    t1 = (t1[0] * 60) + (1*t1[1]);
                    if (isNaN(t1)) {
                        return 0;
                    }
                    var t2 = b.time.split(':');
                    t2 = (t2[0] * 60) + (1*t2[1]);
                    if (isNaN(t2)) {
                        return 0;
                    }
                    //note that mlb.com returns all times as ET
                    //some games start at 12:35pm, and rarely in the 11am hour, while never being 11pm or later
                    //since there's no 24 hour time these need to be set as being before 1pm
                    if (t1 >= 11*60) {
                        t1 -= (12*60);
                    }
                    if (t2 >= 11*60) {
                        t2 -= (12*60);
                    }
                    //
                    if (t1 < t2) {
                        return -1;
                    }
                    if (t1 > t2) {
                        return 1;
                    }
                    return 0;
                });
                info.reverse();
                info.forEach(function (item, index, arr) {
                    var unknownStatus = false;
                    var delayed = false;
                    var postponed = false;
                    var stop = false;
                    var media = true;
                    var final = false;
                    var checkAwayNoHit = false;
                    var checkHomeNoHit = false;
                    var includeReason = false;
                    if (item.status == 'Pre-Game' || item.status == 'Preview') {
                        //after removing the first item and managing media info this will return
                        stop = true;
                    } else if (item.status == 'In Progress' || item.status == 'Review' || item.status == 'Manager Challenge') {
                        //good
                    } else if (item.status == 'Game Over' || item.status == 'Final' || item.status == 'Completed Early') {
                        //good
                        if (item.status == 'Completed Early') {
                            includeReason = true;
                        }
                        media = false;
                        final = true;
                    } else if (item.status == 'Delayed Start' || item.status == 'Delayed') {
                        //delay, but good
                        includeReason = true;
                        delayed = true;
                    } else if (item.status == 'Warmup') {
                        //good
                    } else if (item.status == 'Postponed' || item.status == 'Suspended' || item.status == 'Cancelled') {
                        includeReason = true;
                        postponed = true;
                    } else {
                        unknownStatus = true;
                        console.log('other status:', item.status, item);
                    }
                    console.log(item.away_team_name, item.home_team_name);
                    if (!gameObj.hasOwnProperty(item.away_team_name) || !gameObj.hasOwnProperty(item.home_team_name)) {
                        return;
                    }
                    var gameEl = gameObj[item.away_team_name][0];
                    if (gameEl === undefined) {
                        //likely a double header's first game that's fallen off the top of the list
                        console.log('game gone', item);
                        return;
                    } else {
                        gameEl = gameEl[0]
                    }
                    var originalMainText = gameObj[item.away_team_name][0][1];
                    if (gameEl !== gameObj[item.home_team_name][0][0]) {
                        //cry
                        console.log('mismatch', item);
                    } else if (gameEl) {
                        //pop off the game values, in case of double header
                        gameObj[item.away_team_name].shift();
                        gameObj[item.home_team_name].shift();
                        console.log(item, gameEl);

                        if (media) {
                            handle_game_media(item, gameEl);
                        }

                        //for double headers, now that the game is popped off we can return
                        if (stop) {
                            return;
                        }

                        var text = '';
                        var cls = '';
                        if (item.status == 'Warmup') {
                            text = 'Warmup';
                            cls = 'warmup';
                        } else {
                            var status = item.status;
                            if (status != 'Game Over' && status != 'Final') {
                                if (postponed) {
                                    cls = 'postponed';
                                }
                                //Top 3, Bottom 5, Middle 7, etc.
                                //also determine if no hitter worth mentioning
                                //if home team is ahead in the middle or later of inning 9 or greater, it's actually over
                                //same if score is different at end of inning 9 or greater
                                if (item.hasOwnProperty('inning')) {
                                    cls += ' inprogress';
                                    //check for no-hitter through NOHITATBATS number of at-bats for a team
                                    if (item.inning > NOHITATBATS) {
                                        checkAwayNoHit = true;
                                        checkHomeNoHit = true;
                                    }
                                    if (item.top_inning == "Y") {
                                        if (item.outs == 3) {
                                            var topbottom = 'Middle';
                                            if (item.inning >= item.scheduled_innings && item.away_team_runs < item.home_team_runs) {
                                                final = true;
                                            }
                                            if (item.inning >= NOHITATBATS) {
                                                checkAwayNoHit = true;
                                            }
                                        } else {
                                            topbottom = 'Top';
                                        }
                                    } else {
                                        if (item.outs == 3) {
                                            topbottom = 'End';
                                            if (item.inning >= item.scheduled_innings && item.away_team_runs != item.home_team_runs) {
                                                final = true;
                                            }
                                            if (item.inning >= NOHITATBATS) {
                                                checkAwayNoHit = true;
                                                checkHomeNoHit = true;
                                            }
                                        } else {
                                            topbottom = 'Bottom';
                                            if (item.inning >= item.scheduled_innings && item.away_team_runs < item.home_team_runs) {
                                                final = true;
                                            }
                                            if (item.inning >= NOHITATBATS) {
                                                checkAwayNoHit = true;
                                            }
                                        }
                                    }
                                    if (!final) {
                                        if (topbottom) {
                                            text = topbottom + ' '
                                        }
                                        text += item.inning;
                                    }
                                }
                            }
                            if (final) {
                                text = 'Final';
                                //usually extra innings, perhaps rain-shortened?
                                if (item.inning != 9) {
                                    text += ' (' + item.inning + ')';
                                }
                                cls = 'final';
                            }
                            if ((checkHomeNoHit && item.home_team_hits == 0) ||
                                (checkAwayNoHit && item.away_team_hits == 0)) {
                                cls += ' noHitter';
                            }
                            if (item.hasOwnProperty('away_team_runs') && item.hasOwnProperty('home_team_runs')) {
                                text += ', ' + item.away_team_runs + '-' + item.home_team_runs;
                                var parens = true;
                            } else {
                                parens = false;
                            }
                            if (includeReason) {
                                text += ' ';
                                if (parens) {
                                    text += '(';
                                }
                                text += item.status;
                                if (item.reason) {
                                    text += ': ' + item.reason;
                                }
                                if (parens) {
                                    text += ')';
                                }
                            }
                        }
                        if (unknownStatus) {
                            text += ' DEBUG:' + item.status;
                        }
                        //get original text surrounding the 'Team vs Team' to include along with the reordering of the Teams to Away vs Home
                        gameEl.lastChild.textContent = originalMainText[1] + ' ' + getTeamName(item, 'away') + ' vs ' + getTeamName(item, 'home') + originalMainText[3];
                        if (text) {
                            $('<span class="_tmInfo">, <span class="_tmText ' + cls + '">' + text + '</span></span>').appendTo(gameEl);
                        }
                    }
                });
            });
        }
    });
}

function handle_game_media(item, gameEl) {
    if (item.game_media && item.game_media.media) {
        var media = item.game_media.media;
        if ($.isArray(item.game_media.media)) {
            media = item.game_media.media[0];
        }
        if (media.free != "NO") {
            if (media.free != "ALL") {
                console.log('different media free info', media);
            }
            gameEl.parentElement.classList.add('_tmMLBFree');
        }
    }
    if (item.tv_station) {
        item.tv_station.split(', ').forEach(function (station) {
            //TODO find ESPN more generally
            if (station == 'ESPN' || station == 'ESPN2' || station == 'ESPN (out-of-market only)') {
                gameEl.parentElement.classList.add('_tmESPN');
            }
        });
    }
}

//example why this is needed:
//team_city: 'NY Yankees'
//team_name: 'Yankees'
//Should return 'NY Yankees' rather than 'NY Yankees Yankees'
function getTeamName(item, homeaway) {
    var city = item[homeaway + '_team_city'];
    var name = item[homeaway + '_team_name'];
    if (city.slice(-name.length) == name) {
        return city;
    } else {
        return city + ' ' + name;
    }
}

var initial_delay = 6;
var constant_delay = 120;

main();
//this blob compensates for 'initial_delay'
// e.g. main loop runs every 2 minutes, with a 6 second initial delay,
// this will wait 114 seconds to run main(6) and register the Interval of 120 seconds at the same time to run main(6)
setTimeout(function () {
    main(initial_delay);
    setInterval(main, 1000 * constant_delay, initial_delay);
}, 1000 * (constant_delay - initial_delay));

//since we don't do anything when the tab is invisible, force an update when made visible if one was skipped
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        if (SKIPPED) {
            SKIPPED = false;
            main();
        }
    }
});


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

$(document).ready(function () {
    //do an awful job of figuring out which theme is running
    if ($('body').css('background-color').replace(/\s/g, '') == 'rgb(0,0,0)') {
        //golden midnight
        $('body').addClass('_tmDark');
        addGlobalStyle('body._tmDark ._tmInfo ._tmText.inprogress { color: lightblue; }');
        addGlobalStyle('body._tmDark ' + selectorParent + '._tmMLBFree { background: green; }');
        addGlobalStyle('body._tmDark ' + selectorParent + '._tmESPN { background: rgba(255,7,7,.35); }');
        addGlobalStyle('body._tmDark ._tmInfo ._tmText.noHitter { background: crimson; }');
    } else {
        //white magic or failure
    }
    addGlobalStyle('._tmInfo ._tmText.inprogress { color: red; }');
    addGlobalStyle('._tmInfo ._tmText.warmup { color: goldenrod; }');
    addGlobalStyle('._tmInfo ._tmText.final { color: grey; }');
    addGlobalStyle('._tmInfo ._tmText.postponed { color: blue; }');
    addGlobalStyle('._tmInfo ._tmText.noHitter { background: chartreuse; }');

    addGlobalStyle(selectorParent + '._tmMLBFree { background: gold; }');
    addGlobalStyle(selectorParent + '._tmESPN { background: rgba(255,7,7,.25); }');
});
})()