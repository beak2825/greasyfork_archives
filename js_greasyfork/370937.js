// ==UserScript==
// @name         Travel Spy
// @namespace    LordBusiness.TS
// @version      1.4
// @description  Highlights newcomers when they arrive abroad.
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/index.php?page=people*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370937/Travel%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/370937/Travel%20Spy.meta.js
// ==/UserScript==

GM_addStyle(`
.tswidgets {
	margin: 10px 0px;
}
.tswidgets::after {
    display: block;
    content: "";
    margin: 10px 0px;
    border-left: none;
    border-right: none;
    border-top: 1px solid rgb(153, 153, 153);
    border-bottom: 1px solid rgb(235, 235, 235);
}
.tswidget {
    background-color: rgb(242, 242, 242);
    box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px;
    margin: 10px 0px;
    overflow: hidden;
    border-radius: 5px;
}
.tswidheader {
	background-color: maroon;
    display: flex;
    align-items: center;
    color: rgb(255, 255, 255);
    letter-spacing: 1px;
    text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
    background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 50%);
    background-size: 4px;
    padding: 6px 10px;
}
.tswidtext {
	vertical-align: middle;
	flex-grow: 1;
	font-family: sans-serif;
    line-height: 18px;
}
.tsmoninput {
	margin-left: 5px;
}
.travel-people .users-list li .left-right-wrapper .right-side  .status {
   cursor: pointer;
}
.yellowhl {
   background-color: #FFEB3B !important;
   order: -1;
}
.travel-people .users-list {
    display: flex;
    flex-wrap: wrap;
}
`);
const dateNOW = Date.now();
const li = $(".travel-people .users-list li");

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
const flush = () => {
    localStorage.setItem("Playerlist", "{}");
}

if (localStorage.getItem("Playerlist") === null) {
    flush()
}

var Playerlist = JSON.parse(localStorage.Playerlist);

$(".content-title").append(`
<div class="tswidgets">
	<article class="tswidget">
		<header class="tswidheader">
			</span><span class="tswidtext">LordBusiness's Travel Spy - <span>0</span> players in arrived player list <span class="lcsclear" style="cursor:pointer; text-decoration:underline" title="Clear arrived player list">Clear</span></span>
			<label for="monitorMode"> Monitor Mode?</label>
			<input class="tsmoninput" type="checkbox" name="monitorMode">
		</header>
	</article>
</div>
<style id="tstyle"></style>
`);

const updatenumber = () => {
    const plnum = Object.keys(Playerlist).length
    $(".tswidtext span").first().html(plnum);
}
if(isEmpty(Playerlist)) {
    $('.tsmoninput').prop('checked', true);
}
const monitor = () => {
    li.find("a.user.name").each(function(i) {
        var PlayerID = $(this).attr("href").replace( /[^0-9]/g, '');
        Playerlist[PlayerID] = "1";
    });
    localStorage.Playerlist = JSON.stringify(Playerlist)
    console.info(JSON.stringify(Playerlist));
    updatenumber();
}
const notmonitor = () => {
    li.find("a.user.name").each(function(i) {
        var PlayerID = $(this).attr("href").replace( /[^0-9]/g, '');
        if(!(PlayerID in Playerlist) ) {
            Playerlist[PlayerID] = String(dateNOW)
        }
        if(Playerlist[PlayerID] != "1") {
            const li = $(this).closest("li");
            li.addClass("yellowhl");
            if(!li.attr("data-text")) {
                li.attr("data-text", Playerlist[PlayerID]);
            }
        }
        localStorage.Playerlist = JSON.stringify(Playerlist)
    });
}
const checked = () => {
    if($(".tsmoninput:checked").length == 1) {
        monitor();
    } else {
        notmonitor();
    }
}
$(".tsmoninput").click(checked);
updatenumber();
checked();
const removehl = (thisss) => {
    const closesLI = $(thisss).closest("li");
    const PlayerID = closesLI.find("a.user.name").attr("href").replace( /[^0-9]/g, '');
    Playerlist[PlayerID] = "1";
    closesLI.removeClass("yellowhl");
    closesLI.removeAttr("data-text");
    localStorage.Playerlist = JSON.stringify(Playerlist)
    updatenumber();
}
li.find

$(".travel-people .users-list li .left-right-wrapper .right-side >.status, .level").click(function() {
    removehl(this);
});
$(".tswidheader .lcsclear").click(function() {
    flush();
    $(this).html("Cleared");
    location.reload();
});
const updateArrivalTime = () => {
    const DateN = Date.now();
    $(".travel-people .users-list li.yellowhl").each(function() {
        const timepassed = ~~((DateN - parseInt($(this).attr("data-text")))/1000)
        $(this).find('.left-right-wrapper .right-side  .status [class^="t-"]').html("Arrived "+ timepassed + "s ago")
        if(timepassed > 500) { removehl(this); }
    });
}
setInterval(updateArrivalTime, 1000)
