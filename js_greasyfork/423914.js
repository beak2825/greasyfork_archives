// ==UserScript==
// @name         Kad helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight kads you can quickly feed and timekeep
// @author       You
// @match        http://www.neopets.com/games/kadoatery*
// @match        http://www.neopets.com/inventory.phtml*
// @match        http://www.neopets.com/safetydeposit.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423914/Kad%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/423914/Kad%20helper.meta.js
// ==/UserScript==
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// if using greasemonkey, move the above line up one ^

/* TODO:
 - when kads remained from last refresh, do not count them in new refresh
 - enable manual rf inputs
 - partially missed refreshes should not count as refresh missed
 - Account for late refreshes (kads that refresh 30s or more past the expected time usually reset to the expected time, so the next expected refresh would be 28 min from the old expected time)
 - enable multiple mini clocks
*/
(function() {
    'use strict';
    var INV_KEY = 'ik';
    var SDB_KEY = 'sk';
    var KADS_KEY = 'kk';
    var KADS_META_KEY = 'kmk';
    var MAX_KADS = 20;
    var MAX_MINI = 3;
    var MAIN_STR = "main";
    var MINI_STR = "mini";
    var invMap = {};
    var sdbMap = localStorage.getItem(SDB_KEY) ? JSON.parse(localStorage.getItem(SDB_KEY)): {};
    var kadsMap = localStorage.getItem(KADS_KEY) ? JSON.parse(localStorage.getItem(KADS_KEY)): {};
    var lastRf = localStorage.getItem(KADS_META_KEY) ? JSON.parse(localStorage.getItem(KADS_META_KEY)): {};
    var kadsMeta = {};
    var foods = [];
    var rfTime = $('#nst').html();
    var epochTime = new Date().getTime();

    function copy(text) {
        var copyText = document.createElement('input');
        copyText.value = text;
        $('body').append(copyText);
        copyText.select();
        document.execCommand("copy");
        copyText.parentNode.removeChild(copyText);
    }

    function formatMinsOnly(ts) {
        return ':' + ts.split(':')[1];
    }

    function convertToMinutes(t) {
        if (!t) return 0;
        t = t.split(" ");
        var mins = t[0].split(":");
        return +mins[0]*60 + +mins[1] + (t[1] === "pm" && +mins[0] < 12 ? 12 * 60 : 0);
    }

    function getHourMinute(mins) {
        var hour = (Math.floor(mins/60) % 12);
        if (hour === 0) hour = 12;
        var minutes = (mins - hour * 60);
        if (minutes < 0) minutes = minutes + 12 * 60
        return hour + ":" + (minutes < 10 ? "0" + minutes : minutes);
    }

    function addMinutes(nst, minutes) {
        if (typeof(nst) === "string") {
            var nstSec = nst.split(" ")[0].split(":")[2];
            return getHourMinute((convertToMinutes(nst) + minutes) % (12 * 60)) + ":" + nstSec;
        } else if (typeof(nst) === "number") { // epoch time
            return nst + (minutes * 60 * 1000);
        }
    }

    if (document.URL.search("http://www.neopets.com/games/kadoatery") >= 0) {
        function highlightItems(cell, itemName) {
             $(cell).on("mousedown", function(e) {
                copy(itemName);
                $(cell).css('border-width', '5px');
            })

            invMap = JSON.parse(localStorage.getItem(INV_KEY));
            if (itemName in invMap) {
                $(cell).css('background-color', '#f00');
            }
            else if (itemName in sdbMap) {
                $(cell).css('background-color', '#0ff');
                copy(itemName);
            }
        }
        console.log("Running kad helper");
        var kadContainers = $('.content').find('table');
        var newKads = {};
        var refreshCount = 0;
        var missedRefreshCount = 0;
        kadContainers.find("td").each(function(k, v) {
            var isFed = !/You should give it/.test(v.innerHTML)
            var itemName = $(v).find("strong").last().html();
            var kadName = $(v).find("strong").first().html();

            newKads[kadName] = isFed ? null : itemName;

            if (!isFed) {
                highlightItems(v, itemName);
                foods.push(itemName);
            }
        })

        var hasKadsNotInMiniPosition = false;
        var newKadsCount = 0;
        for (var d in newKads) {
            if (!kadsMap[d] || newKads[d]) {
                if (newKads[d] && (!kadsMap[d] || newKads[d] !== kadsMap[d])) {
                    ++refreshCount;
                    if (newKadsCount < MAX_KADS - MAX_MINI) {
                        hasKadsNotInMiniPosition = true;
                    }
                } else if (newKads[d] === null) {
                    ++missedRefreshCount;
                }
            }
            ++newKadsCount;
        }

        // TODO: Ignore foods that were there from the previous refresh
        var rfType;
        var canBeMain = epochTime - (lastRf.rfMainEpoch || 0) >= 27 * 60 * 1000; // should be 28 but leaving 1 minute buffer time (assuming you caught the refresh within a minute of the true refresh time)
        var canBeMini = epochTime - (lastRf.rfMainEpoch || 0) >= 6 * 60 * 1000 || epochTime - (lastRf.rfMiniEpoch || 0) >= 6 * 60 * 1000; // 1 minute buffer from 7
        console.log(missedRefreshCount, canBeMain, canBeMini, hasKadsNotInMiniPosition);
        if (missedRefreshCount > 0) {
            if (refreshCount > 0 && canBeMain && hasKadsNotInMiniPosition) {
                rfType = MAIN_STR;
                console.log("kadtools > main");
            } else if (refreshCount > 0 && canBeMini && !hasKadsNotInMiniPosition) {
                rfType = "mini";
                console.log("kadtools > mini");
            } else {
                rfType = "missed";
            }

            localStorage.setItem(KADS_KEY, JSON.stringify(newKads));
        } else if (refreshCount > 0 && hasKadsNotInMiniPosition && canBeMain) {
            rfType = MAIN_STR;
            console.log("kadtools > main");
            localStorage.setItem(KADS_KEY, JSON.stringify(newKads));
        } else if (refreshCount > 0 && !hasKadsNotInMiniPosition && canBeMini) {
            rfType = MINI_STR;
            console.log("kadtools > mini");
            localStorage.setItem(KADS_KEY, JSON.stringify(newKads));
        }

        if (rfType && rfType !== "missed") {
            kadsMeta = {
                "foods": foods,
            }
            if (rfType === MAIN_STR) {
                kadsMeta.rfMain = rfTime;
                kadsMeta.rfMainEpoch = epochTime;
            } else if (rfType === MINI_STR) {
                kadsMeta.rfMini = rfTime;
                kadsMeta.rfMiniEpoch = epochTime;
            }

            console.log("refreshed", kadsMeta);
            localStorage.setItem(KADS_META_KEY, JSON.stringify(kadsMeta));
        }

        var optionsBox = document.createElement('div');
        optionsBox.style = 'border: 1px solid #000';
        $(optionsBox)
            .append('<br><button id="kfl-button" style="display: block;">Kad Food List</button>')
            //.append('<br><button id="rf-button" style="display: block;">Manually input refresh times</button>' );

        kadContainers
        .after(optionsBox);

        function filterBlacklist(listString) {
            // Neoboards filters certain words. Work around by adding a . after the first letter
            var whitelist = ["weed", "cracker", "balls", "rape", "cum"];
            whitelist.forEach(function(d) {
                var re = new RegExp(d, 'gi');
                listString = listString.replace(re, d[0] + '.' + d.substring(1));
            })

            return listString;
        }

        $( '#kfl-button' ).on( 'click', function( e ) {
            e.preventDefault();
            e.stopPropagation();

            lastRf = localStorage.getItem(KADS_META_KEY) ? JSON.parse(localStorage.getItem(KADS_META_KEY)): {};
            var list = '';

            if (lastRf.foods) {

                $( 'td', kadContainers ).each( function( i ) {
                    var item = lastRf.foods[i];
                    var lineBreak = '\n';

                    if ( 0 !== i && 0 === ( i + 1 ) % 4 ) {
                        lineBreak = '\n\n';
                    }

                    if (item) {
                        list += item + lineBreak;
                    }
                });


                if (lastRf.rfMain) {
                    list += "\nlast rf @ " + lastRf.rfMain + "\n\n";
                    list += "new main @ " + formatMinsOnly(addMinutes(lastRf.rfMain, 28)) + "\n";
                }

                if (lastRf.rfMini) {
                    list += "new mini @ " + formatMinsOnly(addMinutes(lastRf.rfMini, 28));
                    }
            }

            if (!$('#kfl-output').length) {
                $( this ).after( '<textarea id="kfl-output" rows="26" cols="50">' + filterBlacklist(list) + '</textarea>' );
            }
        });

        var pendingTimes = '';
        //if (rfType === "missed") {
        //    pendingTimes = 'Missed Refresh';
        //} else {
            var nst = $('#nst').html()
            var nth;

            if (kadsMeta.rfMain || lastRf.rfMain) {
                var mainMins = convertToMinutes(kadsMeta.rfMain || lastRf.rfMain);
                var currentMins = convertToMinutes(nst);
                nth = Math.ceil((currentMins - mainMins) / 7);

                if (nth <= 4) {
                    pendingTimes += "new main @ " + addMinutes(kadsMeta.rfMain || lastRf.rfMain, 28) + "\n";
                } else {
                    pendingTimes += "main (" + (nth - 4) + ") pending @ " + addMinutes(kadsMeta.rfMain || lastRf.rfMain, 7 * nth) + "\n";
                }
            }

            if (kadsMeta.rfMini || lastRf.rfMini) {
                var miniMins = convertToMinutes(kadsMeta.rfMini || lastRf.rfMini);
                currentMins = convertToMinutes(nst);
                nth = Math.ceil((currentMins - miniMins) / 7);
                if (nth <= 4) {
                    pendingTimes += "new mini @ " + addMinutes(kadsMeta.rfMini || lastRf.rfMini, 28) + "\n";
                } else {
                    pendingTimes += "mini (" + nth + ") pending @ " + addMinutes(kadsMeta.rfMini || lastRf.rfMini, 7 * nth) + "\n";
                }
            }
        //}

        if (!$('#pending-output').length) {
            $( optionsBox ).append( '<textarea id="pending-output" rows="4" cols="50">' + pendingTimes + '</textarea>' );
        }

        $( '#rf-button' ).on( 'click', function (e) {
            e.preventDefault();
            e.stopPropagation();


        })

    }
    if (document.URL.search("www.neopets.com/inventory.phtml") >= 0) {
        var invTable = $($('.inventory')[0]);
        if (invTable && invTable.length) {

        invTable.find('td').each(function(k, v) {
            var itemMatch = v.innerHTML.match(/<br>(.+?)(<|$)/);
            if (itemMatch) {
                var itemName = itemMatch[1];
                invMap[itemName] = 1;
            }
        })
        localStorage.setItem(INV_KEY, JSON.stringify(invMap));
        } else {
          setTimeout(function() {
            invTable = $('#tableRowsId');
            invTable.find('.item-name').each(function(k, v) {
            var itemMatch = v.innerHTML;

            if (itemMatch) {
                invMap[itemMatch] = 1;
            }
        })
              localStorage.setItem(INV_KEY, JSON.stringify(invMap));

          }, 2000)
        }
    }
    if (document.URL.search("www.neopets.com/safetydeposit.phtml") >= 0) {
        var sdbTable = $($('.content').find('table')[3]);
        sdbTable.find('td:nth-child(2)').each(function(k, v) {
            var itemMatch = v.innerHTML.match(/<b>(.+?)(<|$)/);
            if (itemMatch) {
                var itemName = itemMatch[1];
                sdbMap[itemName] = +sdbTable.find('td:nth-child(5)')[k].innerHTML.match(/<b>(.+?)(<|$)/)[1];
            }
        })
        localStorage.setItem(SDB_KEY, JSON.stringify(sdbMap));
    }
    if (document.URL.search("www.neopets.com/market.phtml?") >= 0) {
        $("[name='criteria']").val("exact");
    }
})();


