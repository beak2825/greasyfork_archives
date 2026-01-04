// ==UserScript==
// @name        TORN : Race Helper
// @namespace   raceway
// @author      Selits (repost of a script created by somebody else that was removed)
// @description Get Accurate stats for your car. And repair helper. The original was deleted by Greasy Fork so use at your own risk!
// @include     https://www.torn.com/loader.php?sid=racing*
// @version     2.0
// @grant       GM_addStyle
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://greasyfork.org/scripts/39572-tornlib/code/tornlib.js?version=259509
// @downloadURL https://update.greasyfork.org/scripts/391277/TORN%20%3A%20Race%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/391277/TORN%20%3A%20Race%20Helper.meta.js
// ==/UserScript==

'use strict';

function unique(a) {
    var b = [];
    $.each(a, function(i, e) {
        if ($.inArray(e, b) == -1) b.push(e)
    });
    return b
}

function checkUpgrade() {
    GM_addStyle(".needUpgrade { font-size: 40px; bottom: 10px; position: absolute; right: 15px; color: #ffd600; } #txtUpgrade span { text-shadow: 1px 1px 1px rgb(0, 0, 0); }");
    var b = [];
    var c = [];
    $.each($("li[data-part]"), function() {
        b.push($(this).attr("data-part"))
    });
    b = unique(b);
    $.each(b, function() {
        if (!$("li.bought[data-part='" + this + "']").length) {
            bgcolor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
            $("li[data-part='" + this + "'] .status").css("background-color", bgcolor).addClass("highlight-active");
            var a = $("ul.pm-categories li[data-category='" + $("li[data-part='" + this + "'] .status").closest(".pm-items-wrap").attr("category") + "']");
            a.find(".needUpgrade").length ? a.find(".needUpgrade").text(parseInt(a.find(".needUpgrade").text()) + 1) : a.find(".icon").after("<div class='needUpgrade'>1</div>").parent().addClass("highlight-active");
            c.push("<span style='color:" + bgcolor + "'>" + this + "</span>")
        }
    });
    $(".info-msg-cont .msg:eq(0)").append(c.length ? "<p id='txtUpgrade'><br/><br/><strong>" + c.length + "</strong> parts available to upgrade :  <strong style='color: #ff9b00;'>" + c.join(", ") + "</strong></p>" : $(".info-msg-cont").hasClass("red") ? "" : "<p id='txtUpgrade'><br/><br/>Your car is <strong style='color: #789e0c;'>FULLY UPGRADED</strong></p>")
};
$(document).ajaxComplete(function(l, m, n) {
    if (n.url.indexOf('tab=cars') !== -1 || n.url.indexOf('tab=parts') !== -1 || (n.url.indexOf('tab=race&section=chooseRacing') !== -1)) {
        GM_addStyle(".title.m-bottom10 { float: right; } .title.m-bottom10 > strong { color: yellow; }");
        var o = JSON.parse(localStorage.race || '{}');
        if ($(".enlisted-wrap").length) {
            $.each($("a[id-value]"), function() {
                if (o[$(this).attr("id-value")] != undefined) {
                    var a = o[$(this).attr("id-value")];
                    $.each($(this).closest("li").find("ul.enlist-bars li .properties .title"), function() {
                        $(this).next().append(a[$(this).text().replace(/\s+/g, '').toLowerCase()].val > 0 ? "<div class='title m-top5 m-bottom10'><strong>" + a[$(this).text().replace(/\s+/g, '').toLowerCase()].val + "</strong> - " + a[$(this).text().replace(/\s+/g, '').toLowerCase()].bars.toFixed(2) + "%</div>" : "")
                    })
                }
            })
        }
        if (n.url.indexOf('section=addParts') !== -1) {
            checkUpgrade()
        }
        var p = [
            ["Car Model", "Top Speed", "Acceleration", "Braking", "Handling", "Dirt", "Tarmac", "Safety"]
        ];
        $.each(JSON.parse(localStorage.race), function() {
            var a = [this.car];
            delete this.car;
            $.each(this, function() {
                a.push(this.val > 0 ? this.val : 0)
            });
            p.push(a)
        });
        let csvContent = "data:text/csv;charset=utf-8,";
        p.forEach(function(a) {
            let row = a.join(",");
            csvContent += row + "\r\n"
        });
        $("a[section-value='enlistRacingCar']").after('<a href="' + encodeURI(csvContent) + '" download="your_cars.csv" class="link"><span class="btn-wrap silver c-pointer"><span class="btn">DOWNLOAD CSV</span></span></a>')
    }
    if (n.url.indexOf('sid=racingActions&section=buyParts&step=partsbuy') !== -1) {
        $(".highlight-active").removeClass("highlight-active").removeAttr("style");
        $(".needUpgrade,#txtUpgrade").remove();
        checkUpgrade()
    }
    if (n.url.indexOf('sid=raceData') !== -1) {
        var q = JSON.parse(m.responseText || '{}');
        if (q.carData != undefined) {
            if (!$(".dtcarStats").length) {
                GM_addStyle(".dtcarStats { float: right; } .dtcarStats > strong { color: #8aac26; }");
                $.each($("#racingupdates .properties .title"), function() {
                    $(this).append("<div class='dtcarStats' style='display:none;'><strong>" + q.carData["0"][$(this).text().replace(/\s+/g, '').toLowerCase()] + "</strong> - " + q.carBars[$(this).text().replace(/\s+/g, '').toLowerCase()].newval.toFixed(2) + "%</div")
                });
                $(".dtcarStats").fadeIn(2000)
            }
            var r = {};
            var s = q.carData["0"];
            var t = q.carBars;
            r[s.ID] = {
                car: s.title
            };
            $.each(t, function(k, v) {
                r[s.ID][k] = {
                    bars: t[k].newval,
                    val: parseInt(s[k])
                }
            });
            o = JSON.parse(localStorage.race || '{}');
            delete o[s.ID];
            $.extend(true, o, r);
            localStorage.race = JSON.stringify(o)
        }
        $.each($("#leaderBoard li .name span"), function() {
            $(this).wrap("<a target='_blank' href='/profiles.php?XID=" + $(this).parent().parent().parent().attr("id").substr(4) + "'></a>")
        });
        if (q.timeData.status == 3 && (q.timeData.currentTime > parseInt(q.timeData.timeEnded))) {
            var u = q.raceData.trackData.intervals.length;
            var w = q.raceData.trackData.intervals;
            var x = parseInt(q.raceData.trackData.laps);
            var y = u * x;
            var z = {};
            var A = "";
            $.each(q.raceData.cars, function(a, b) {
                var c = window.atob(b).split(",");
                var d = 0;
                var e = 0;
                var f = 1;
                var g = [];
                var h = 9999;
                $.each(c, function() {
                    d++;
                    e += parseFloat(this);
                    if (d == u) {
                        d = 0;
                        h = h > e ? e : h;
                        g.push((f++) + ") " + moment.utc().startOf('day').add(((Math.ceil(e * 100) / 100).toFixed(7).substr((Math.ceil(e * 100) / 100).toFixed(7).indexOf(".") + 1, 2) == '00') ? (parseInt(e) + 1) : parseInt(e), 'seconds').format('mm:ss') + ":" + (Math.ceil(e * 100) / 100).toFixed(7).substr((Math.ceil(e * 100) / 100).toFixed(7).indexOf(".") + 1, 2));
                        e = 0
                    }
                });
                if (c.length == y) {
                    $.extend(true, z, {
                        [a]: {
                            txtbestlap: g,
                            thebestlap: moment.utc().startOf('day').add(((Math.ceil(h * 100) / 100).toFixed(7).substr((Math.ceil(h * 100) / 100).toFixed(7).indexOf(".") + 1, 2) == '00') ? (parseInt(h) + 1) : parseInt(h), 'seconds').format('mm:ss') + ":" + (Math.ceil(h * 100) / 100).toFixed(7).substr((Math.ceil(h * 100) / 100).toFixed(7).indexOf(".") + 1, 2)
                        }
                    })
                } else {
                    var j = 0;
                    var k;
                    var i = 0;
                    $.each(w, function() {
                        j += this;
                        i++;
                        if (i == (c.length % u)) k = j
                    });
                    $.extend(true, z, {
                        [a]: {
                            txtbestlap: g,
                            thebestlap: "-"
                        }
                    })
                }
                $("ul.driver-item>li.name:contains(" + a + ")").parent().parent().find("li.time").before("<li class='time best'>" + (z[a].thebestlap) + "</li>")
            });
            $("li[id^='lbr-']").click(function() {
                player = $(this).find("ul>li.name span").text();
                if (!$(".model-wrap").length) {
                    $("ul.properties-wrap").before('<div class="model-wrap"><span class="img" title="Honda NSX"><img src="/images/items/78/large.png?v=1528808940574" width="100" height="50"></span><span class="model"><p>Honda NSX</p></span><span class="modellap"><p></p></span><div class="clear"></div></div>')
                }
                if (!$(".modellap").length) {
                    $(".model-wrap > .model").after('<span class="modellap"><p></p></span>')
                }
                $("ul.properties-wrap").empty();
                $("div.car-selected-wrap .title-black:first").text("Lap time");
                $('.model-wrap .model p:first').text($(this).find("ul>li.car img").attr("title"));
                $('.model-wrap .modellap p:first').text(player);
                $('.model-wrap img').attr("src", $(this).find("ul>li.car img").attr("src"));
                $('.model-wrap img').attr("title", $(this).find("ul>li.car img").attr("title"));
                $.each(z[player].txtbestlap, function() {
                    $("ul.properties-wrap").append(`<li><div class="properties"><div class="title m-bottom10">${this}</div></div></li>`)
                });
                thebestlap = z[player].thebestlap;
                $("li .properties .title:contains(" + thebestlap + ")").css("color", "yellow")
            })
        } else {
            if (!$("#racingupdatesnew ul.properties-wrap:contains(Time started)").length) {
                duration = (parseInt(q.timeData.timeEnded) - parseInt(q.timeData.timeStarted)) * 1000;
                $("#racingupdatesnew ul.properties-wrap").prepend(`<li><div class="properties"><div class="title">ID: ${q.raceID} [<a target="_blank"href='/loader.php?sid=racing&tab=log&raceID=${q.raceID}'>Spectator link</a>]</div><div class="bar-tpl-wrap  active m-top5 m-bottom10"></div><div class="clear"></div></div></li><li><div class="properties"><div class="title">Time started: ${moment.unix(parseInt(q.timeData.timeStarted)).utc().format('YYYY-MM-DD kk:mm:ss')}</div><div class="bar-tpl-wrap  active m-top5 m-bottom10"></div><div class="clear"></div></div><div class="t-delimiter"></div><div class="b-delimiter"></div></li><li><div class="properties"><div class="title">Time ended: ${moment.unix(parseInt(q.timeData.timeEnded)).utc().format('YYYY-MM-DD kk:mm:ss')}</div><div class="bar-tpl-wrap  active m-top5 m-bottom10"></div><div class="clear"></div></div><div class="t-delimiter"></div><div class="b-delimiter"></div></li><li><div class="properties"><div class="title">Estimate race duration: ${moment.utc(duration).format('HH[h] mm[m] ss[s]')}</div><div class="bar-tpl-wrap  active m-top5 m-bottom10"></div><div class="clear"></div></div><div class="t-delimiter"></div><div class="b-delimiter"></div></li>`)
            }
        }
        if (!$("li.time.best").length) {
            $("li.name").removeClass("linamewidth")
        } else {
            $("li.name").addClass("linamewidth")
        }
        GM_addStyle(`.linamewidth{width:266px!important}@media(max-width:1000px){.linamewidth{width:112px!important}.d.racing-main-wrap.car-selected-wrap.drivers-list.driver-item>li.time.best{width:45px}}.modellap{color:#e6da1c;padding-bottom:10px;text-align:right;font-weight:700;font-size:16px;display:inline-block;vertical-align:middle;line-height:13px}`)
    }
});