// ==UserScript==
// @name         Faction Chain Total
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Tally faction attacks made for large chains that API can't handle
// @author       You
// @match        https://www.torn.com/factions.php?step=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371081/Faction%20Chain%20Total.user.js
// @updateURL https://update.greasyfork.org/scripts/371081/Faction%20Chain%20Total.meta.js
// ==/UserScript==

var totals = [];
var prevPage = 0;

var form1 = $('<form id="frm1"></form>');
var year = $('<input type = "number" name="date1" value="0">');
var month = $('<input type = "number" name="date2" value="0">');
var day = $('<input type = "number" name="date3" value="0">');
var hour = $('<input type = "number" name="date4" value="0">');
var minute = $('<input type = "number" name="date5" value="0">');

$(document).ready(function() {
    setTimeout(function() {
        var attackStat = $('<button>Start</button>');
        var resetButton = $('<button>RESET BUTTON (also click to populate date field with latest date)</button>');
        $("#faction-news").append(attackStat);
        $("#faction-news").append(resetButton);

        attackStat.click(function() {
            myLoop();
        });

        resetButton.click(function() {
            var firstDate1 = $("#tab4-2 > ul > li:nth-child(1) > span.date > span:nth-child(1)").text();
            var firstTime1 = $("#tab4-2 > ul > li:nth-child(1) > span.date > span:nth-child(2)").text();
            var splitDate1 = firstDate1.split("/");
            var splitTime1 = firstTime1.split(":");
            var tabYear1 = parseInt(splitDate1[2]);
            var tabMonth1 = parseInt(splitDate1[1]);
            var tabDay1 = parseInt(splitDate1[0]);
            var tabHour1 = parseInt(splitTime1[0]);
            var tabMinute1 = parseInt(splitTime1[1]);

                            if (splitTime1[2].includes("PM")) {
                    tabHour1 += 12;
                }
            year.val(tabYear1);
            month.val(tabMonth1);
            day.val(tabDay1);
            hour.val(tabHour1);
            minute.val(tabMinute1);

            resetMe();
        });

        $("#faction-news").append(form1);
        form1.append("Year:");
        form1.append(year);
        form1.append("<br/>Month:");
        form1.append(month);
        form1.append("<br/>Day:");
        form1.append(day);
        form1.append("<br/>Hour:");
        form1.append(hour);
        form1.append("<br/>Minute:");
        form1.append(minute);
        $("#faction-news").append('<div class="metaldog"></div>')
    }, 5000);
});

function resetMe() {
    prevPage = 0;
    totals = [];
    $(".metaldog").empty();
    $("#tab4-2 > div > div.gallery-wrapper.pagination.m-top10 > a.page-number.first.t-gray-3.page-show > span.page-nb").click();
}

function Player(name, att, mug, hosp, lost, total, respect) {
    this.name = name;
    this.att = att;
    this.mug = mug;
    this.hosp = hosp;
    this.lost = lost;
    this.total = total;
    this.respect = respect;
}

function dateCompare(y1, y2, m1, m2, d1, d2, h1, h2, min1, min2) {
    console.log(y1 + " " + y2 + " " + m1 + " " + m2 + " " + d1 + " " + d2 + " " + h1 + " " + h2 + " " + min1 + " " + min2);
    if (y1 == y2) {
        if (m1 == m2) {
            if (d1 == d2) {
                if (h1 == h2) {
                    return min1 >= min2;
                } else {
                    return h1 > h2;
                }
            } else {
                console.log(d1 + " " + d2 + (d1 > d2));
                return d1 > d2;
            }
        } else {

            return m1 > m2;
        }
    } else {
        return y1 > y2;
    }
}

function myLoop() {
    setTimeout(function() {
        var currentPage = $("#tab4-2 > div > div.gallery-wrapper.pagination.m-top10 > a.page-number.active.page-show > span.page-nb").text();
        //console.log(currentPage);

        if (currentPage > prevPage) {
            console.log("enter " + currentPage);

            var firstDate = $("#tab4-2 > ul > li:nth-child(1) > span.date > span:nth-child(1)").text();
            var firstTime = $("#tab4-2 > ul > li:nth-child(1) > span.date > span:nth-child(2)").text();

            $("#tab4-2 > ul > li").load().each(function() {
                //29/05/18 unused but i wanna keep it around :D
                var date = $(this).find("span > span").eq(0).text();
                //8:45:03 AM ditto
                var time = $(this).find("span > span").eq(1).text();

                var splitDate = date.split("/");
                var splitTime = time.split(":");
                var tabYear = parseInt(splitDate[2]);
                var tabMonth = parseInt(splitDate[1]);
                var tabDay = parseInt(splitDate[0]);
                var tabHour = parseInt(splitTime[0]);
                var tabMinute = parseInt(splitTime[1]);
                if (tabHour == 12) {
                    tabHour = 0;
                }
                console.log("BOOYAH" + splitTime[2]);
                console.log(splitTime[2].includes("PM"));
                if (splitTime[2].includes("PM")) {
                    tabHour += 12;
                }

                if (prevPage == 0 || dateCompare(tabYear, year.val(), tabMonth, month.val(), tabDay, day.val(), tabHour, hour.val(), tabMinute, minute.val())) {
                    console.log(date + " " + time);

                    var attack = $(this).children().eq(1).text().trim();
                    var arr = attack.split(" ");
                    var user = arr[0];
                    var attType = arr[1];
                    var won = !(arr[3] == "but" || arr[3] == "and");
                    if (arr.length > 3) {
                        console.log(attack);
                        if (!totals.some(e => e.name === user)) {
                            if (!won) {
                                totals.push(new Player(user, 0, 0, 0, 1, 0, 0));
                            }
                            if (arr[3].includes("+")) {
                                var respect = parseFloat(arr[3].split("+")[1].split(")")[0]);
                                if (attType == "attacked") {
                                    totals.push(new Player(user, 1, 0, 0, 0, 1, respect));
                                }
                                if (attType == "mugged") {
                                    totals.push(new Player(user, 0, 1, 0, 0, 1, respect));
                                }
                                if (attType == "hospitalized") {
                                    totals.push(new Player(user, 0, 0, 1, 0, 1, respect));
                                }
                            }
                        } else {
                            var index = totals.findIndex(e => e.name === user);
                            if (!won) {
                                totals[index].lost += 1;
                            }
                            if (arr[3].includes("+")) {
                                respect = parseFloat(arr[3].split("+")[1].split(")")[0]);
                                if (attType == "attacked") {
                                    totals[index].att += 1;
                                }
                                if (attType == "mugged") {
                                    totals[index].mug += 1;
                                }
                                if (attType == "hospitalized") {
                                    totals[index].hosp += 1;
                                }
                                totals[index].total += 1;
                                totals[index].respect += respect;
                            }
                        }
                    }
                    if ($(this).is("li.last")) {
                        $("#tab4-2 > div > div.gallery-wrapper.pagination.m-top10 > a:nth-child(18) > i").click();
                        prevPage += 1;
                        myLoop();
                    }
                } else {
                    $(".metaldog").empty();
                    $(".metaldog").append("Username/Attacks/Mugs/Hosps/Loss/Total Successful/Total Respect<br/>");
                    totals.forEach((player) => {
                        var finalLog = player.name + "/" + player.att + "/" + player.mug + "/" + player.hosp + "/" + player.lost + "/" + player.total + "/" + player.respect;
                        console.log(finalLog);
                        $(".metaldog").append(finalLog);
                        $(".metaldog").append("<br/>");
                    });
                }
            });
        } else {
            console.log("enter TIMEOUT");
            myLoop();
        }
    }, 1000)
}