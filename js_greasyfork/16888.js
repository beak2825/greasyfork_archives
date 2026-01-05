// ==UserScript==
// @name         Quarantine EP Counter
// @namespace    tech.myip.jess.q2019counter
// @version      1.0.5
// @description  Live countdown to next EP
// @author       J. Jones
// @match        http://play.quarantine2019.com/game
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/16888/Quarantine%20EP%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/16888/Quarantine%20EP%20Counter.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

var START_STAMP = Math.floor(Date.now() / 1000);
var reset = 432; // seconds per EP

function prettyTime(seconds) {
    if (seconds < 0) return 0;
    if (seconds < 60) return seconds + "s";
    var remain = seconds % 60;
    var mins = Math.floor(seconds / 60);
    if (mins < 60) return mins + "m " + remain + "s";
    var hours = Math.floor(mins / 60);
    mins = mins % 60;
    return hours + "h " + mins + "m " + remain + "s";
}

function tickCheck() {
    var interval = Math.floor(Date.now() / 1000) - START_STAMP;
    if (interval > 3600) document.location.reload();
    var ep_c = ep;
    var nexttimer_c = nexttimer - interval;
    while(nexttimer_c < 0) nexttimer_c += reset;
    $("#doc_float_nextep").text(prettyTime(nexttimer_c));
    var onetimer_c = onetimer - interval;
    if (onetimer_c < 0) {
        one.css("display","none");
        titlebar.css("background-color","#827839");
    } else { $("#doc_float_oneep").text(prettyTime(onetimer_c)); }
    var fulltimer_c = fulltimer - interval;
    if (fulltimer_c < 0) {
        next.css("display","none");
        full.css("display","none");
        floater.css("height","45px");
        titlebar.css("background-color","#6F993E");
        titlebar.text("EP is full");
    } else { $("#doc_float_fullep").text(prettyTime(fulltimer_c)); }

    if (interval > nexttimer) {
        ep_c++; interval -= nexttimer;
        ep_c += Math.floor(interval / reset);
        var nextclock = new Date(Math.floor(Date.now()) + (nexttimer * 1000));
        $("#doc_float_nextep").attr("title", "Next @ " + nextclock.toLocaleTimeString());
    }
    if (ep_c > 50) ep_c = 50;
    if (ep_c > 0 && ep <= 0 && reload_mode) document.location.reload();
    $("#doc_float_epcount").text(ep_c);
    unsafeWindow.doktorj = {"ep":ep, "epc":ep_c, "next":nexttimer, "one":onetimer, "full":fulltimer};
}

var reload_mode = GM_getValue("reloadmode", 0);
var expanded    = GM_getValue("expanded", 1);

var energyrow = $("#left tr.boxbody").has(":contains('Energy')").find("tbody > *").has(":contains('Energy')");
var epcount = energyrow.children("td").has("div:contains(' / 50')").children("div").filter(function(){ return this.nodeType == 1; }).children(":contains(' / 50')").get(0).innerText;
var nextep = energyrow.children("td").find(".tooltip").children("b:contains('Next EP')").get(0).innerText;

var re = new RegExp("(-?\\d+) / 50");
var ep = parseInt(re.exec(epcount)[1]);
var remainep = 49 - ep;

re = new RegExp("Next EP:\\s+([0-7]+m)? ?([0-9]+s)");
var nexttime = re.exec(nextep);
re = new RegExp("(\\d+)[ms]");
var nextmin = (typeof nexttime[1] != 'undefined') ? parseInt(re.exec(nexttime[1])[1]) : 0;
var nextsec = (typeof nexttime[2] != 'undefined') ? parseInt(re.exec(nexttime[2])[1]) : 0;

var nexttimer = nextsec + (nextmin * 60);
var fulltimer = nexttimer + (remainep * reset);
var onetimer = nexttimer;
if (ep < 0) onetimer += ((0 - ep) * reset);

$("<style type=\"text/css\">\n \
div.doc_float { \
  width: 100%; \
  padding: 2px 5px; \
  color: #fff; \
}\n \
span.doc_head { \
  font-weight: bold; \
  width: 75px; \
  text-align: left; \
  float: left; \
}\n \
div.doc_button_on, div.doc_button_off { \
  position: absolute; \
  z-index: 100001; \
  top: 2px; \
  right: 2px; \
  width: 14px; \
  height: 14px; \
  cursor: pointer; \
}\n \
div.doc_button_on { \
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAN5JREFUeNqc0jEKwjAUBuCkWoR6BEdFdw/gqmfoBbyDk7T0Fm4uLm5uXqYUbIcO2kVw0Pg/+CuxpAotfKWk788Lj2hjjOryeEppZfEhhgoM3SCB2VetNKQR5CCHKGFPV64lVu3nQ0PBgtAuoAUErmDE0NIRcpLXBF48ZsDubYEUznUwZbcHHMFrCY1Zd5d5yMIanlyctoRkswM3l7qs/rGDy48jyvGHHKA0mds/en8GsmK3yJ6qGMAJNo5QyFBRD695AYzjApRcy1mjmkHRhy1U1ibyHYNv1+qul/wtwAD4im1sLqOpkgAAAABJRU5ErkJggg=='); \
}\n \
div.doc_button_off { \
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAMhJREFUeNpi/P//PwM1ACsQNwPxRyD+D8UfgLgViNVxaZIG4mdQxa+BeDEUv4eKtWLTxAjEz6EKorDI2wExFzaNTVBN7qT4SwWI/0GdyQW1HRd4AMS7kTkg234C8VogZsKhSRmq7hs0PBjSgfgvVFANhyaQYSughoPUPYJJzAHip3icCHI+NzQAQZYYIUswEwgLD6htTegS7EC8BYirsGiKgmp6ji3wpJFSC3ICeA0VewYLFGyABYgb0JLcR2gyZEXxNLmJHCDAAHqzOoGrq8keAAAAAElFTkSuQmCC'); \
}\n \
.ui-tabs.ui-tabs-vertical { \
  padding: 0; \
  width: 160px; \
}\n \
.ui-tabs.ui-tabs-vertical .ui-widget-header { \
  border: none; \
}\n \
.ui-tabs.ui-tabs-vertical .ui-tabs-nav { \
  float: left; \
  width: 1.2em; \
  border-radius: 4px 0 0 4px; \
  z-index: 20009; \
}\n \
.ui-tabs.ui-tabs-vertical .ui-tabs-nav li { \
  clear: left; \
  width: 100%; \
  margin: 15px 0; \
  border: 1px solid #666; \
  border-width: 1px 0 1px 1px; \
  border-radius: 4px 0 0 4px; \
  background: #333; \
  right: -2px; \
  z-index: 20010; \
}\n \
.ui-tabs.ui-tabs-vertical .ui-tabs-nav li a { \
  display: block; \
  width: 100%; \
  padding: 0.3em 0.3em; \
  font-weight: bold; \
  font-size: larger; \
  text-decoration: none; \
}\n \
.ui-tabs.ui-tabs-vertical .ui-tabs-nav li a:hover { \
  cursor: pointer; \
}\n \
.ui-tabs.ui-tabs-vertical .ui-tabs-nav li.ui-tabs-active { \
  margin-bottom: 0.2em; \
  padding-bottom: 0; \
  border-right: 1px solid #333; \
}\n \
.ui-tabs.ui-tabs-vertical .ui-tabs-panel { \
  float: left; \
  width: 28em; \
  border-left: 1px solid #666; \
  border-radius: 0; \
  position: relative; \
  left: -1px; \
}\n \
.slide-in { \
  right: 0px; \
}\n \
.slide-out { \
  right: -160px; \
}\n \
</style>").appendTo("head");

var container = $("<div id=\"doc_container\">");
container.css({"position":"fixed", "width":"175px", "height":"90px", "bottom":"0px", "z-index":"9000"});
if (expanded == 1)
    container.addClass("slide-in");
else
    container.addClass("slide-out");

var floater = $("<div id=\"doc_float\">");
floater.css({"position":"absolute", "width":"160px", "height":"90px", "bottom":"0px", "right":"0px", "border":"1px solid #666", "background-color":"#333", "z-index":"-1"});
floater.appendTo(container);

var closetab_ul = $("<ul>");
var closetab_li = $("<li>");
var closetab_a  = $("<a href=\"#doc_float\">&raquo;</a>");
closetab_a.appendTo(closetab_li);
closetab_li.appendTo(closetab_ul);
closetab_ul.css({"position":"absolute", "top":"2px", "left":"-14px"});
closetab_ul.appendTo(floater);

closetab_a.click(function() {
    if (expanded == 1) {
        container.switchClass("slide-in","slide-out",1000,"easeInOutSine");
        expanded = 0;
        GM_setValue("expanded", 0);
        closetab_a.html("&laquo;");
    } else {
        container.switchClass("slide-out","slide-in",1000,"easeInOutSine");
        expanded = 1;
        GM_setValue("expanded", 1);
        closetab_a.html("&raquo;");
    }
});

floater.tabs().addClass('ui-tabs-vertical ui-helper-clearfix');

var titlebar = $("<div id=\"doc_float_title\" class=\"doc_float\">");
titlebar.css({"background-color":"#600", "font-weight":"bold", "text-align":"center"});
titlebar.text("EP Counter");

var current = $("<div id=\"doc_float_current\" class=\"doc_float\">");
$("<span class=\"doc_head\">Current EP:</span>").appendTo(current);
$("<span id=\"doc_float_epcount\">" + ep + "</span>").appendTo(current);

var now = Math.floor(Date.now() / 1000);
var nextclock = new Date((now + nexttimer) * 1000);

var next = $("<div id=\"doc_float_next\" class=\"doc_float\">");
$("<span class=\"doc_head\">Next EP In:</span>").appendTo(next);
$("<span id=\"doc_float_nextep\" title=\"Next @ " + nextclock.toLocaleTimeString() + "\">" + prettyTime(nexttimer) + "</span>").appendTo(next);

var oneclock = new Date((now + onetimer) * 1000);

var one = $("<div id=\"doc_float_one\" class=\"doc_float\">");
$("<span class=\"doc_head\">&gt;0 EP In:</span>").appendTo(one);
$("<span id=\"doc_float_oneep\" title=\"1 EP @ " + oneclock.toLocaleTimeString() + "\">" + prettyTime(onetimer) + "</span>").appendTo(one);

var fullclock = new Date((now + fulltimer) * 1000);

var full = $("<div id=\"doc_float_full\" class=\"doc_float\">");
$("<span class=\"doc_head\">Full EP In:</span>").appendTo(full);
$("<span id=\"doc_float_fullep\" title=\"Full @ " + fullclock.toLocaleTimeString() + "\">" + prettyTime(fulltimer) + "</span>").appendTo(full);

var auto = $("<div id=\"doc_float_auto\" class=\"doc_button_off\" title=\"Auto-reload DISABLED\"></div>");
auto.click(function() {
    if (reload_mode) {
        reload_mode = 0;
        $("#doc_float_auto").attr("class","doc_button_off");
        $("#doc_float_auto").attr("title","Auto-reload DISABLED");
        GM_setValue("reloadmode", 0)
    } else {
        reload_mode = 1;
        $("#doc_float_auto").attr("class","doc_button_on");
        $("#doc_float_auto").attr("title","Auto-reload ENABLED");
        GM_setValue("reloadmode", 1)
    }
});
if (reload_mode == 1) {
    auto.attr("class", "doc_button_on");
    $("#doc_float_auto").attr("title","Auto-reload ENABLED");
}

if (ep > 0) {
    one.css("display","none");
    titlebar.css("background-color","#827839");
}
if (ep == 50) {
    next.css("display","none");
    full.css("display","none");
    floater.css("height","45px");
    titlebar.css("background-color","#6F993E");
    titlebar.text("EP is full");
}

floater.append(titlebar);
floater.append(current);
floater.append(next);
floater.append(one);
floater.append(full);
floater.append(auto);

$("#wrapper").append(container);

window.setInterval(tickCheck, 500);