// ==UserScript==
// @name        Dynasty Thingifier
// @namespace   Alice Cheshire
// @author		Alice Cheshire
// @include     http://dynasty-scans.com/*
// @include     https://dynasty-scans.com/*
// @exclude     http://dynasty-scans.com/system/*
// @exclude     https://dynasty-scans.com/system/*
// @exclude     http://dynasty-scans.com/*.json
// @exclude     https://dynasty-scans.com/*.json
// @version     2.21
// @description Adds post links and quote stuff to Dynasty forums
// @grant		GM_getValue
// @grant		GM_listValue
// @grant		GM_deleteValue
// @grant		GM_listValues
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/11913/Dynasty%20Thingifier.user.js
// @updateURL https://update.greasyfork.org/scripts/11913/Dynasty%20Thingifier.meta.js
// ==/UserScript==

//Initialize DT object
let DTp = {
    yourid: "Not set!",
    spoilers: false,
    navbar: false,
    pagination: false,
    bbcode: false,
    quote2quickreply: false,
    movequickreply: false,
    magnifier: false,
    fontsize: 0,
    mag: {
        sizeRes: "512",
        sizeMeasure: "px",
        minSizeRes: "512",
        minSizeMeasure: "px",
        zoomFactor: "250",
        border: "0"
    },
    pendtags: false,
    ver: "1"
};
var DT = getItem("DT", DTp), ver = "2.21";
console.log(DT.ver, " - ", parseFloat(DT.ver), " - ", parseInt(DT.ver) < 2.2);
if (parseFloat(DT.ver) < 2.2) {
    console.log("Old Thingifier version < 2.2!");
    DT = {
        yourid: GM_getValue("youruserid", "Not set!"),
        spoilers: GM_getValue("spoilers", false),
        navbar: GM_getValue("navbar", false),
        pagination: GM_getValue("pagination", false),
        bbcode: GM_getValue("bbcode", false),
        quote2quickreply: GM_getValue("quote2quickreply", false),
        movequickreply: GM_getValue("movequickreply", false),
        magnifier: GM_getValue("magnifier", false),
        fontsize: GM_getValue("fontsize", 0),
        mag: {
            sizeRes: GM_getValue("magSizeRes", "512"),
            sizeMeasure: GM_getValue("magSizeMeasure", "px"),
            minSizeRes: GM_getValue("magMinSizeRes", "512"),
            minSizeMeasure: GM_getValue("magMinSizeMeasure", "px"),
            zoomFactor: GM_getValue("magZoomFactor", "250"),
            border: GM_getValue("magBorder", "0")
        },
        pendtags: GM_getValue("pendtags", false),
        ver: ver
    };
    setItem("DT", DT);
} else {
    //DT = getItem("DT", DTp);
}
if (DT.ver !== ver) {
    DT.ver = ver;
}

console.log("DT:", JSON.stringify(DT, null, "    "));

function getItem(key, def) {
    let out = localStorage.getItem(key);
    if (out == null) {
        return def;
    } else {
        return JSON.parse(out);
    }
}
function setItem(key, val) {
    if (typeof val === "object") {
        val = JSON.stringify(val);
    }
    localStorage.setItem(key, val);
}

function getId(id) {
    let out = document.getElementById(id);
    if (out == null) {
        out = undefined;
    }
    if (typeof out !== "undefined") {
        return out;
    } else {
        return document.body;
    }
}
function getClass(cl) {
    return document.getElementsByClassName(cl);
}


(function() {
    "use strict";
    var pageurl = document.location.toString().replace(/(#.+)/, ""), //Stores page url and removes any anchors from the stored url so we don't get issues with multiple anchors showing up
        isuserpostsurl = document.location.toString(), //Stores the address variable a second time for use in a different function
        postids = [], //Initializes a blank array for the postids
        quote = [], //Initializes blank array for quotes
        postcount = 0, //Counter to keep track of how many posts are on the current page
        counter = 0,
        configmenustate = false, //Init our menu state's variable
        yourid = DT.yourid, //Set our user id variable
        fontsize = [3, "one", "two", "three", "four", "five"],
        bbcode_menu = `
<div id="thingifier-bbcode">
<div class="thingifier-bbcode-first-row"><input type="button" id="thingifier-bbcode-quote" value="Quote">
<input type="button" id="thingifier-bbcode-link" value="Link">
<input type="button" id="thingifier-bbcode-image" value="Image">
<input type="button" id="thingifier-bbcode-spoiler" value="Spoiler">
<input type="button" id="thingifier-bbcode-ul" value="List">
<input type="button" id="thingifier-bbcode-ol" value="Numbered List">
<input type="button" id="thingifier-bbcode-italics" value="Italics">
<input type="button" id="thingifier-bbcode-bold" value="Bold">
</div>
<div class="thingifier-bbcode-second-row">
<input type="button" id="thingifier-bbcode-tag" value="Tags">
<input type="button" id="thingifier-bbcode-hr" value="Horizontal Rule">
<input type="button" id="thingifier-bbcode-codeblock" value="Code Block">
<input type="button" id="thingifier-bbcode-h1" value="H1">
<input type="button" id="thingifier-bbcode-h2" value="H2">
<input type="button" id="thingifier-bbcode-h3" value="H3">
<input type="button" id="thingifier-bbcode-h4" value="H4">
<input type="button" id="thingifier-bbcode-h5" value="H5">
<input type="button" id="thingifier-bbcode-h6" value="H6">
</div>
</div>`, //The html code for our bbcode buttons
        quickreply;

    init();

    //Initialize Script
    function init() {

        //Populate Menu
        $('body').append(`
<style>
#thingifier {
float: left;
z-index: 1000 !important;
max-width: 340px;
max-height: 255px !important;
}
#thingifier, #magnifier-settings, #magnifier-submenu-toggle {
top: 25%;
position: fixed;
}
#thingifier-options {
border: 1px solid black;
padding: 8px;
background: aliceblue;
border-bottom-right-radius: 6px;
border-left-width: 0;
}
#thingifier-options ul { list-style-type: none; margin-left: -4px;}
#thingifier-options ul > li {  vertical-align: middle; }
#thingifier ul li input { padding-right: 4px; }
#thingifier-font-size { width: 96px; }
#thingifier-toggle-button {
position: absolute;
top: 0;
left: calc(100% - 1px);
width: 24px;
height: 24px;
border: 1px solid black;
background-color: aliceblue;
color: red;
border-top-right-radius: 6px;
border-bottom-right-radius: 6px;
border-left-width: 0;
}
.spoilers-disabled {
background: #666 none repeat scroll 0% 0%;
color: #fff;
}
.navbar-fixed {
position: fixed;
z-index: 1000;
width: 1210px;
}
.pull-right-fixed, .nav-collapse-fixed {
float: right;
}
.nav-padding {
height: 60px;
width: 1210px;
}
.forum_post_one {
font-size: 10px !important;
line-height: 12px !important;
}
.forum_post_two {
font-size: 12px !important;
line-height: 15px !important;
}
.forum_post_three {
font-size: 16px !important;
line-height: 19px !important;
}
.forum_post_four {
font-size: 20px !important;
line-height: 23px !important;
}
.forum_post_five {
font-size: 25px !important;
line-height: 28px !important;
}
#thingifier-bbcode {
margin-bottom: 6px;
}
#thingifier-quickreply {
width: 100% !important;
background-color: aliceblue !important;
display: inline-block;
padding: 4px;
padding-bottom: 8px;
border-radius: 8px;
margin-bottom: 6px;
}
#magnifier {
visibility: hidden;
display: none;
position: absolute;
border: 1px solid grey;
background-color: rgba(0, 0, 0, 0.1);
background-repeat: no-repeat;
pointer-events: none;
z-index: 100000000;
}
#thingifier-magnifier-menu, #magnifier-tooltip {
display: inline-block;
border: 1px solid black;
padding: 8px;
background: aliceblue;
border-radius: 6px;
margin-left: 0px;
vertical-align: top;
}
#thingifier-magnifier-menu input {
display: inline-block;
}
#sizenum, #minsizenum {
width: 96px;
}
#sizemeasure, #minsizemeasure {
margin-left: 8px;
}
#sizemeasure, #minsizemeasure, #zoomfactor {
width: 64px;
}
#minsizenum, #minsizemeasure, #zoomfactor, #squareborder, #circularborder {
margin-top: 7px;
}
#magnifier-menu-submit {
margin-left: 178px;
margin-right: 8px;
}
#magnifier-buttons {
margin-top: -24px;
float: right;
}
#thingifier-magnifier-menu h3, #magnifier-tooltip h3 {
text-align: center;
text-decoration: underline;
padding-bottom: 8px;
}
#thingifier-magnifier-menu h3 i {
padding-bottom: 4px;
border-bottom: 2px solid black;
}
#thingifier-magnifier-menu input {
padding: 2px;
margin: 2px;
}
#thingifier-magnifier-menu input[type="radio"], #thingifier-magnifier-menu label {
display: inline;
}
#magnifier-tooltip h3 {
padding-bottom: 10px;
border-bottom: 1px solid black;
}
#magnifier-tooltip ul {
padding: 0px;
margin: 0px 10px;
}
#magnifier-tooltip li {
margin: 0 8px;
list-style: none;
margin-bottom: 8px;
line-height: 16px;
font-size: 13px;
}
#magnifier-tooltip li {
border-bottom: 1px solid black;
padding-bottom: 8px;
}
#magnifier-tooltip li:last-of-type {
border-bottom: 0px solid black;
}
#magnifier-tooltip li div {
font-weight: 900;
text-align: center;
margin-bottom: -16px;
margin-top: 8px;
}
#magnifier-tooltip li div::before, #magnifier-tooltip li div::after {
content: " — ";
}
#thingifier-magnifier-menu {
position: fixed;
margin-left: 300px;
border-radius: 6px 0 0 6px;
margin-top: -108px !important;
z-index: 1003 !important;
width: 276px;
border-right-width: 0;
}
#magnifier-tooltip {
min-width: 320px;
margin-left: 592px;
z-index: 1000;
top: 2% !important;
position: fixed;
max-width: 550px;
}
#magnifier-tooltip, #thingifier-magnifier-menu {
margin-top: 148px;
}
#magnifier-settings, #magnifier-submenu-toggle {
display: inline;
z-index: 1001;
}
.thingifier-icon {
/*background-image: url(http://dynasty-scans.com//assets/twitter/bootstrap/glyphicons-halflings-2851b489e8c39f8fad44fc10efb99c3e.png);*/
background-image: url(/assets/twitter/bootstrap/glyphicons-halflings-b4c22a0ed1f42188864f0046f0862ecb.png);
display: inline-block;
width: 14px;
height: 14px;
line-height: 14px;
vertical-align: text-top;
background-repeat: no-repeat;
margin-top: 1px;
background-position: -48px 0px;
z-index: 1005 !important;
}
#magnifier-submenu-toggle {
margin-left: 272px;
margin-top: 132px;
}
#magnifier-submenu-toggle::after {
margin-left: 18px;
font-size: 12px;
font-style: normal;
content: "Settings";
}
#magnifier-submenu-toggle:hover {
text-decoration: underline;
cursor: pointer;
}
#thingifier-magnifier-menu input[type="number"], #thingifier-magnifier-menu input[type="text"] {
text-align: center;
}
#magnifier-settings {
pointer-events: none;
}
#magnifier-settings * {
pointer-events: auto;
}
#thingifier-cancel {
background-color: rgba(0,0,0,0.2) !important;
background-image: linear-gradient(to bottom, rgb(196, 0, 0), rgb(96, 0, 0));
color: white;
margin-left: 4px;
background-position: 0 !important;
}
#thingifier-cancel:hover {
background-image: linear-gradient(to bottom, rgb(224, 0, 0), rgb(124, 0, 0));
}
input.btn {
cursor: pointer !important;
}
</style>
<div id="thingifier">
<div id="thingifier-options">
<ul>
<li><input type="checkbox" id="thingifier-unhide-spoilers"> Unhide spoilers</li>
<li><input type="checkbox" id="thingifier-fixed-navbar"> Fixed navbar</li>
<li><input type="checkbox" id="thingifier-pagination"> Add page selector to top of page</li>
<li><input type="checkbox" id="thingifier-bbcode-buttons"> Add quick reply and post page bbcode buttons</li>
<li><input type="checkbox" id="thingifier-quote-to-quickreply"> Quote to quick reply instead of new post page</li>
<li><input type="checkbox" id="thingifier-quote-move-quickreply"> Move quick reply to under quoted post</li>
<li><input type="checkbox" id="thingifier-magnifier" tooltip="Press Z or middle mouse click"> Magnifier on reader and image pages</li>
<li><input type="checkbox" id="thingifier-pending-suggestions"> Show only "Pending" tag suggestions</li>
<li><input type="range" id="thingifier-font-size" min="1" max="5"> Change font size <input type="button" id="thingifier-reset-font" value="Reset Font Size"></li>
<li><a href="https://dynasty-scans.com/forum/posts?user_id=${DT.yourid}" id="thingifier-ownposts"> Your posts</a></li>
<li><input type="text" id="useridinput"><input type="button" value="Submit user id" id="useridsubmit"></li>
<li><input type="button" id="thingifier-clear" value="Clear stored data"></li>
</ul>
</div>
<div id="thingified-toggle"><input type="button" id="thingifier-toggle-button" value="X"></div>
<i class="thingifier-icon" id="magnifier-submenu-toggle"></i>
<div id="thingifier-magnifier-menu">
<h3><i class="thingifier-icon"></i> Magnifier Settings</h3>
Size: <input type="number" id="sizenum"><input type="text" list="measurements" id="sizemeasure" pattern="vh|vw|vmin|vmax|%|px"><br>
Minimum Size: <input type="number" id="minsizenum"><input type="text" list="measurements" id="minsizemeasure" pattern="vh|vw|vmin|vmax|%|px"><br>
Zoom factor: <input type="number" id="zoomfactor">%<br>
Shape: <input type="radio" id="squareborder" val="square" name="magnifier-shape"><label for="square" id="forsquare">Square </label><input type="radio" id="circularborder" val="circle" name="magnifier-shape"><label for="circle" id="forcircle">Circle</label><br>
<span id="magnifier-buttons"><input type="button" id="magnifier-menu-submit" value="Save"><input type="button" id="magnifier-menu-cancel" value="Cancel"></span>
<datalist id="measurements">
<option value="vh">
<option value="vw">
<option value="vmin">
<option value="vmax">
<option value="%">
<option value="px">
</datalist>
</div>
<div id="magnifier-tooltip">
<h3>Valid Size Types</h3>
<ul>
<li><div>vh</div><br>This is the vertical size of what you can see on the web page. It's measured in a percentage. (1-100% of that size. Ie: 1vh or 100vh.)</li>
<li><div>vw</div><br>This is the horizontal size of what you can see on the web page. It's measured in a percentage. (1-100% of that size. Ie: 1vw or 100vw.)</li>
<li><div>vmin</div><br>This is the smallest (horizontal or vertical) size of what you can see on the web page. It's measured in a percentage. (1-100% of that size. Ie: 1vmin or 100vmin.) On a desktop pc this will generally be the same as vh if you're browsing using a maximized window.</li>
<li><div>vmin</div><br>This is the largest (horizontal or vertical) size of what you can see on the web page. It's measured in a percentage. (1-100% of that size. Ie: 1vmax or 100vmax.) On a desktop pc this will generally be the same as vw if you're browsing using a maximized window.</li>
<li><div>%</div><br>This is a percent of the container size. In this case the size of the page itself. Note: Most pages on Dynasty that the magnifier works on aren't perfectly square so this could result in an elongated shape.</li>
<li><div>px</div><br>A straight pixel size. (Ie: 256px results in  a static 256 pixels in size regardless of the size of the page.)</li>
</ul>
</div>
</div>

`);
        //Define menu option handlers (this must happen before loading config)
        setmenuhandlers();

        //Load our config
        configload();

        //Setup own posts link stuff
        $('#useridinput').hide();
        $('#useridsubmit').hide();
        if (DT.yourid == "Not set!") {
            $('#thingifier-ownposts').hide();
            $('#useridinput').show();
            $('#useridsubmit').show();
            setuserid();
        }

        //Check we're viewing a thread
        if (pageurl.match(/forum\/topics/)) {
            $('.forum_post').each(function() {
                postids.push(this.id); //For each element of the class forum_post push the element's id to our postids array
            });
            $('.time').each(function(i, obj) {
                postcount++; //This is where we actually count how many posts are on the page
            });

            //Retrieve your user id
            if (DT.yourid.match(/\d+/)) {
                if (!DT.yourid.match(/dynasty-scans/) && DT.yourid !== "Not set!"){
                    DT.yourid = `//dynasty-scans.com/forum/posts?user_id=${DT.yourid}`;
                }
            } else {
                DT.yourid = "Not set!";
            }
        }
    }

    //Set user ID for own posts link
    function setuserid() {
        $('input#useridsubmit').click(function () {
            if($("input#useridinput").val().match(/^\d+$/)) {
                DT.yourid = $('input#useridinput').val();
                $('#useridinput').hide();
                $('#useridsubmit').hide();
                $('#thingifier-ownposts').show();
                $('#thingifier-ownposts').attr('href', "//dynasty-scans.com/forum/posts?user_id=" + DT.yourid);
            } else {
                DT.yourid = "Not set!";
                $("input#useridinput").val();
                $('input#useridinput').val("Invalid user id!");
            }
            setItem("DT", DT);
        });
    }

    //Define event handlers for options menu items
    function setmenuhandlers() {
        //Menu close/open
        $('input#thingifier-toggle-button').click(function() {
            menuclose("click");
        });
    
        //Unhide spoilers option
        $('#thingifier-unhide-spoilers').change(function() {
            DT.spoilers = $(this).is(":checked");
            setItem("DT", DT);
            if (DT.spoilers) {
                $('.spoilers').addClass('spoilers-disabled');
            } else {
                $('.spoilers').removeClass('spoilers-disabled');
            }
        });
    
        //Fixed navbar option
        $('#thingifier-fixed-navbar').change(function() {
            DT.navbar = $(this).is(":checked");
            setItem("DT", DT);
            console.log("Navbar option clicked " + DT.navbar);
            if (DT.navbar) {
                $('.navbar').addClass('navbar-fixed');
                $('div.forum_post').css("padding-top", 40);
                $("<div class=\"nav-padding\"></div>").insertAfter(".navbar");
            } else {
                $('.navbar').removeClass('navbar-fixed');
                $('div.forum_post').css("padding-top", 0);
                $('div.nav-padding').remove();
            }
        });
    
        //Pagination option
        $('#thingifier-pagination').change(function() {
            DT.pagination = $(this).is(":checked");
            setItem("DT", DT);
            if (DT.pagination) {
                $("div.pagination").wrap('<div class=\"tmp\">').parent().html();
                var tmp = $('div.tmp').html();
                $("div.pagination").unwrap();
                $('#main').prepend(tmp);
            } else {
                $("div.pagination").first().remove();
            }
        });
    
        //Add bbcode buttons to post page and quick reply
        $('#thingifier-bbcode-buttons').change(function() {
            DT.bbcode = $(this).is(":checked");
            setItem("DT", DT);
            if (DT.bbcode) {
                $("#forum_post_message").parent().prepend(bbcode_menu);
            } else {
                $("div#thingifier-bbcode").remove();
            }
        });
    
        //Move the quick reply box to the current post
        $('#thingifier-quote-move-quickreply').change(function() {
            DT.movequickreply = $(this).is(":checked");
            setItem("DT", DT);
            quickreply = $(this).is(":checked");
        });
    
    
        $('#thingifier-magnifier').change(function() {
            DT.magnifier = $(this).is(":checked");
            setItem("DT", DT);
            if (pageurl.match(/chapters/) || pageurl.match(/images/) && DT.magnifier) {
                $('body').append('<div id="magnifier"></div>');
            } else {
                $('#magnifier').remove();
            }
    
        });
    
        //Font size slider
        $('#thingifier-font-size').on('input', function() {
            fontsize[0] = parseInt($(this).val());
            $('.message *').removeClass('forum_post_one');
            $('.message *').removeClass('forum_post_two');
            $('.message *').removeClass('forum_post_three');
            $('.message *').removeClass('forum_post_four');
            $('.message *').removeClass('forum_post_five');
            $('.message *').addClass('forum_post_' + fontsize[fontsize[0]]);
            DT.fontsize = fontsize[0];
            setItem("DT", DT);
        });
    
        //Reset font size
        $('#thingifier-reset-font').click(function() {
            $('.message *').removeClass('forum_post_one');
            $('.message *').removeClass('forum_post_two');
            $('.message *').removeClass('forum_post_three');
            $('.message *').removeClass('forum_post_four');
            $('.message *').removeClass('forum_post_five');
            $('#thingifier-font-size').val(3);
            DT.fontsize = null;
            setItem("DT", DT);
        });
    
        //Clear saved data
        $('#thingifier-clear').click(function() {
            var x = window.confirm("Are you sure you want to clear your stored data?");
            if (x) {
                DT = DTp;
                setItem("DT", DT);
                document.location.reload(true);
            } else {
                console.log("Decided against it");
            }
        });
    }

    //Load our config
    function configload() {
        //Only run once the page is loaded
        $(document).ready(function() {
            //Deal with our current menu state
            menuclose("load");


            //Check if spoilers are unhidden
            if (DT.spoilers) {
                $('#thingifier-unhide-spoilers').click();
            }

            //Check if the fixed navbar is enabled
            if (DT.navbar) {
                $('#thingifier-fixed-navbar').click();
            }

            //Check if pagination option is enabled
            if (DT.pagination) {
                $('#thingifier-pagination').click();
            }

            //Check if we've changed the font size and retrieve it
            fontsize[0] = DT.fontsize;
            if (fontsize[0] !== null && typeof fontsize[0] !== "undefined") {
                $('#thingifier-font-size').val(fontsize[0]);
                $('.message *').addClass('forum_post_' + fontsize[fontsize[0]]);
            }

            //Check if bbcode buttons are enabled
            if (DT.bbcode) {
                $('#thingifier-bbcode-buttons').click();
            }

            //Check if quote to quick reply option is enabled
            if (DT.quote2quickreply) {
                $('#thingifier-quote-to-quickreply').click();
            }

            //Check if the move quick reply box option is enabled
            if (DT.movequickreply) {
                $('#thingifier-quote-move-quickreply').click();
            }

            //Check if the magnifier option is enabled
            if (DT.magnifier) {
                $('#thingifier-magnifier').click();
            }

            //Check if the pending tags option is enabled
            //Currently broken though for some reason?
            if (DT.pendtags) {
                $('#thingifier-pending-suggestions').click();
            }

            bbcode();
        });
    }

    function menuclose(sender) {
        //Only runs when loading a page
        if (sender === "load") {
            //configmenustate = GM_getValue("configmenustate", true); //Load our menu state
            console.log(configmenustate);
            setTimeout(function() {
                if (!configmenustate) { //If it's true collapse the menu
                    $("#thingifier-options").animate({width:'toggle', height:'toggle'},0);
                    $("#magnifier-submenu-toggle").fadeToggle(0);
                    menubutton();
                }
                $("#thingifier-magnifier-menu").fadeToggle(0);
                $("#magnifier-tooltip").fadeToggle(0);
            }, 100);

            //Runs when clicking the button
        } else if (sender === "click") {
            configmenustate = !!configmenustate ? false : true; //XOR our menu state, can also use ^=
            $("#thingifier-options").animate({width:'toggle', height:'toggle'},350); //Toggle the menu
            if ($('#thingifier-magnifier-menu').is( ":visible" )) {
                $('#thingifier-magnifier-menu').fadeToggle(0);
                $('#magnifier-tooltip').fadeToggle(0);
            }
            if ($("#magnifier-submenu-toggle").is( ":visible" )) {
                $("#magnifier-submenu-toggle").fadeToggle(0);
            } else {
                $("#magnifier-submenu-toggle").fadeToggle(500);
            }
            menubutton();
        }
    }
    function menubutton() {
        //Controls the button's icon
        if (!configmenustate) {
            $('#thingifier-toggle-button').val('▶');
        } else {
            $('#thingifier-toggle-button').val('◀');
        }
    }

    function bbcode() {
        var texttmp,
            sel,
            posttmp,
            regextmp,
            txtbegin,
            txtend;
        $('#forum_post_message').mousedown(function() {
            $('body').mouseup(function() {
                getSel();
                texttmp = sel;
                posttmp = $('#forum_post_message').val();
                regextmp = new RegExp("("+texttmp.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")+")");
                posttmp = posttmp.replace(regextmp, "[BBCODE-HERE]");
            });
        });
        function getSel() // javascript
        {
            // obtain the object reference for the <textarea>
            var txtarea = document.getElementById("forum_post_message");
            // obtain the index of the first selected character
            var start = txtarea.selectionStart;
            // obtain the index of the last selected character
            var finish = txtarea.selectionEnd;
            // obtain the selected text
            sel = txtarea.value.substring(start, finish);
            txtbegin = txtarea.value.substring(0, start);
            txtend = txtarea.value.substring(finish);
            // do something with the selected content
        }
        $('#thingifier-bbcode-quote').click(function() {
            texttmp = texttmp.replace(/(^\S)/gm, "> $1");
            bbcode_format();
        });
        $('#thingifier-bbcode-link').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "[]($1)");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "[]($1)");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-image').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "![]($1)");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "![]($1)");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-spoiler').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "==$1==");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "==$1==");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-hr').click(function() {
            texttmp = texttmp.replace(/(^\S)/gm, "\n***\n $1");
            bbcode_format();
        });
        $('#thingifier-bbcode-ul').click(function() {
            texttmp = texttmp.replace(/(^\S)/gm, " * $1");
            bbcode_format();
        });
        $('#thingifier-bbcode-ol').click(function() {
            texttmp = texttmp.replace(/(^\S)/gm, " 1. $1");
            bbcode_format();
        });
        $('#thingifier-bbcode-italics').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "*$1*");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "*$1*");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-bold').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "**$1**");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "**$1**");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-tag').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "`$1`");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "`$1`");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-codeblock').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "    $1    ");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "    $1    ");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-h1').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "# $1 #");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "# $1 #");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-h2').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "## $1 ##");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "## $1 ##");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-h3').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "### $1 ###");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "### $1 ###");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-h4').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "#### $1 ####");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "#### $1 ####");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-h5').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "##### $1 #####");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "##### $1 #####");
            }
            bbcode_format();
        });
        $('#thingifier-bbcode-h6').click(function() {
            if (sel.length === 0) {
                texttmp = texttmp.replace(/(.*)/gm, "###### $1 ######");
            } else {
                texttmp = texttmp.replace(/(.+)/gm, "###### $1 ######");
            }
            bbcode_format();
        });
        function bbcode_format() {
            var tmp = txtbegin + texttmp.replace(/\[BBCODE-HERE\]/, tmp) + txtend;
            $('#forum_post_message').val(tmp);
        }
    }
    $(document).ready(function() {
        if (isuserpostsurl.match(/https:\/\/dynasty-scans.com\/forum\/posts\?user_id=\d+/)) {
            isuserpostsurl = isuserpostsurl.replace(/\d+/, ""); //Replaces the user id in the url
        }
        for (var i = 0; i < postcount; i++){
            counter = i;
            var id = postids[i].toString(); //Temporarily store the post id under the key of 'i' into a variable to use in our next bit
            if ($('#thingifier-quote-to-quickreply').is(":checked")) {
                var tmp = $('.forum_post .info .row .actions').find("span:first-child a");
                var tmphref = tmp.attr('href');
                var urltmp = document.location.toString();
                urltmp = urltmp.replace(/(https:\/\/dynasty-scans\.com\/forum\/topics\/)(\d+)(.+)/, "$2");
                $('.forum_post .info .row .actions:eq(' + counter + ')').prepend("<input type=\"button\" class=\"postquote\" id=\"" + tmphref + "\" value=\"Quick Quote\" name=\"post_" + counter + "\">");
                id = id.replace(/forum_post_/, "");
            }
            counter++;
        }
        $('#thingifier-quote-to-quickreply').click(function() {
            DT.quote2quickreply = $('#thingifier-quote-to-quickreply').is(":checked");
            setItem("DT", DT);
        });
        $('input.postquote').mouseup(function(e) {
            document.getElementById('forum_post_message').value = "";
            var postid = $($(this).parents()[3]).attr('id');
            var quoteid = postid; //Gets the id of the .forum_post parent
            quoteid = "#" + quoteid; //Adds a url anchor sign to the id
            quoteid = quoteid.toString(); //Converts it to a string to make sure it cooperates
            setItem("quoteid", pageurl + quoteid);
            var quotename = $.trim($(quoteid).find(".user").text().replace(/Staff|Moderator|Uploader/, "")); //Retrieve the quoted user's name
            //For staff, mods, and uploaders find and remove their title, then trim the whitespace/newlines off the beginning and end
            setItem("quotename", quotename);
            postid = postid.replace(/forum_post_/, "");
            var threadid = document.location.toString();
            threadid = threadid.replace(/(https:\/\/dynasty-scans\.com\/forum\/topics\/)(\d+)(\S+)/, "$2");
            var postpath = "//dynasty-scans.com/forum/posts/new?quote_id=\"" + postid +"\"&topic_id=\"" + threadid + "\"";
            postpath = postpath.replace(/"/g, "");
            postid = postid.replace(/post_/, "");
            getpost(postpath, postid);
            if (quickreply) {
                var replybox;
                if ($("#thingifier-quickreply").length < 1) {
                    $("#new_forum_post").wrap("<div id=\"thingifier-quickreply\"></div>");
                    $('<input class="btn" id="thingifier-cancel" type="button" value="Cancel Post">').insertAfter("#new_forum_post input.btn:last");
                }
                if (!replybox) {
                    replybox = $("#thingifier-quickreply").detach();
                    replybox.appendTo(quoteid);
                    replybox = null;
                }
            }
            if ($("#thingifier-quickreply").offset().top > window.pageYOffset + document.documentElement.clientHeight || $("#thingifier-quickreply").offset().top < window.pageYOffset) {
                $(document).scrollTop($("#thingifier-quickreply").offset().top - $('div.nav-padding').height());
            }
        });

        $(document).on("click", "input#thingifier-cancel", function(){
            console.log("Clicked");
            var replybox = $('#new_forum_post').detach();
            $("#thingifier-quickreply").remove();
            replybox.appendTo('div.row:last');
            $('#thingifier-cancel').remove();
        });

        //Do this if we click the quote button
        $('a').mouseup(function(e) { //When we click a link run this code
            if ($(e.target).text() == "Quote") { //Make sure that the clicked link is the quote button
                var quoteid = $(e.target).parents(); //Gets all the parent elements of our link
                quoteid = quoteid[4]; //Selects the fourth parent which is the .forum_post parent of the link
                quoteid = $(quoteid).attr('id'); //Gets the id of the .forum_post parent
                quoteid = "#" + quoteid; //Adds a url anchor sign to the id
                quoteid = quoteid.toString(); //Converts it to a string to make sure it cooperates
                setItem("quoteid", pageurl + quoteid);
                var quotename = $(quoteid).find(".user").text(); //Retrieve the quoted user's name
                quotename = quotename.replace(/Staff|Moderator|Uploader/, ""); //For staff, mods, and uploaders find and remove their title
                quotename = $.trim(quotename); //Trim the whitespace/newlines off the beginning and end
                setItem("quotename", quotename);
            } else { /*This is where code would run if we were doing anything for clicking other links*/ }
        });

        //Check that the current page is the new posts page
        if (pageurl.match(/posts\/new/)) {
            //Don't use the custom getItem() for these. That's only meant for JSON items
            var post = localStorage.getItem("quoteid", false);
            var username = localStorage.getItem("quotename", false);
            if (!!post && !!username) {
                quote = "> [**" + username + "** posted:](" + post + ") \n> ";
                var message = "\n" + $('#forum_post_message').val();
                $('#forum_post_message').val(quote + message);
                setItem("post", false);
                setItem("username", false);
            }
        }

        //Insert "unread posts" button after thread link in manga viewer
        if (pageurl.match(/chapters/)) {
            var mangathread = '<a class="btn btn-mini" title="View latest unread post in thread"href="' + $('div.btn-toolbar div.btn-group:first-child a.btn:first-child').attr('href') + '/unread"><i class="icon-comment"></i>Unread</a>';
            $(mangathread).insertAfter('div.btn-toolbar div.btn-group:first-child a.btn:first-child');
        }

        //Insert last post link to read threads
        if (pageurl.match(/\/forum(?!\/topics)/)) {
            var elements = $('div.forum_topic').length;
            for (i = 0; i < elements; i++) {
                //Retrieve the last page link or the base thread link if the thread is only one page
                var linktype = $('div.forum_topic:eq(' + i + ') span.pages a:last').attr('href') || $('div.forum_topic:eq(' + i + ') a.subject').attr('href');
                //Create our last post link
                var link = '<a class="thingifier-lastlink" href="' + linktype + '#lastpost" style="margin-left:10px;"><i class="icon-comment"></i>Last Post</a>';
                //Check if thread has multiple pages. If so place link after pagination, otherwise place it right after the thread link
                if ($('div.forum_topic:eq(' + i + ')').find('span.pages').length !== 0) {
                    $(link).insertAfter('div.forum_topic:eq(' + i + ') span.pages');
                } else {
                    $(link).insertAfter('div.forum_topic:eq(' + i + ') a.subject');
                }
            }
        }

        //Check if we clicked the last post button on the forum view
        $('a.thingifier-lastlink').mouseup(function(e) {
            if (e.which === 1 || e.which === 2) {
                var threadnum = $(this).attr('href').match(/(\d+)/)[0]; //Retrieve the clicked thread's ID
                setItem('lastlink_' + threadnum, true); //If we left or middle clicked it then set our lastlink value for that thread to true
            }
        });

        //Check if we're viewing a topic
        if (pageurl.match(/\/forum\/topics/) && window.location.toString().match(/#lastpost/)) {
            document.onreadystatechange = function() {
                if (document.readyState === "complete") {
                    window.location = `${pageurl}#${$('div.time a:last').parents()[3].id}`;
                }
            };
        }


        //Magnifier Function
        var magY, magX, magShown = 0, imgPath = "none", zoom = GM_getValue('magZoomFactor', '500'), zoomFactor = zoom / 100, pWidth = 0, pHeight = 0, pOffset = 0, magZ = false;
        var updater = window.setInterval(update, 100);


        $(document).mousemove(function(e) {
            if (DT.magnifier && (pageurl.match(/images/) || pageurl.match(/chapters/))) {
                zoomFactor = zoom / 100;
                magY = e.pageY;
                magX = e.pageX;
                $('#magnifier').offset({ top: magY - ($('#magnifier').height() / 2), left: magX - ($('#magnifier').width() / 2) });
                var backLeft = ((-magX + pOffset.left) * zoomFactor) + 130;
                var backTop = ((-magY + pOffset.top) * zoomFactor) + 130;
                $('#magnifier').css("background-position", backLeft + "px " + backTop + "px");
            }
        });
        $(document).mousedown(function(e) {
            if (DT.magnifier) {
                var tmp = $(e.target).parent()[0];
                if (tmp.className === "image" && pageurl.match(/images/)) {
                    tmp = tmp.className;
                } else if (tmp.id === "image" && pageurl.match(/chapters/)) {
                    tmp = tmp.id;
                } else {
                    tmp = false;
                }
                tmp = !!tmp;
                if (e.which === 2 && tmp !== false) {
                    e.preventDefault();
                }
                magnifier(tmp, e.which);
            }
        });
        $(document).keydown(function(e) {
            if (e.which == 90) {
                if (DT.magnifier && pageurl.match(/chapters/) || pageurl.match(/images/)) {
                    if (!$('#forum_post_message').is(":focus") && !$('input#q').is(":focus")) {
                        e.preventDefault();
                        magZ = true;
                    } else {
                        magZ = false;
                    }
                    if (magZ === true) {
                        magnifier(magZ, 2);
                    }
                }
            }
        });

        function magnifier(check, which) {
            if (DT.magnifier) {
                if (!!check) {
                    magShown = magShown ? 0 : 1;
                }
                if (!!magShown && !!check && which === 2) {
                    //$('body').append('<canvas id="magcan" height="250px" width="250px" style="position: absolute; right: 0; bottom: 0;">');
                    $('#magnifier').css("visibility", "visible");
                    $('#magnifier').css("display", "inline");
                    $('*').css("cursor", "none");
                    $('#magnifier').css({
                        'min-width' : `${DT.mag.minSizeRes}${DT.mag.minSizeMeasure}`,
                        'min-height' : `${DT.mag.minSizeRes}${DT.mag.minSizeMeasure}`,
                        'width' :  `${DT.mag.sizeRes}${DT.mag.sizeMeasure}`,
                        'height' :  `${DT.mag.sizeRes}${DT.mag.sizeMeasure}`,
                        'border-radius' : `${DT.mag.border}`
                    });
                    zoom = DT.mag.zoomFactor;
                    $('#magnifier').offset({ top: magY - ($('#magnifier').height() / 2), left: magX - ($('#magnifier').width() / 2) });
                } else {
                    $('#magnifier').css("visibility", "hidden");
                    $('#magnifier').css("display", "none");
                    $('*').css("cursor", "auto");
                    $('a').css("cursor", "pointer");
                    $('a *').css("cursor", "pointer");
                    $('span.left').css("cursor", "pointer");
                    $('span.right').css("cursor", "pointer");
                }
            }
        }
        function update() {
            if (DT.magnifier) {
                pOffset = $('#image img').offset() || $('div.image img').offset();
                if (pageurl.match(/chapters/)) {
                    pWidth = $('div#image.thumbnail img').width() || $('div#image').width();
                    pHeight = $('div#image.thumbnail img').height() || $('div#image').height();
                    //imgPath = $('div#image.thumbnail img').attr('src') || $('div#image img').attr('src') || "none";
                    imgPath = $('#download_page').attr('href') || "none";
                    //console.log(imgPath);
                } else if (pageurl.match(/images/)) {
                    pWidth = $('div.image img').width();
                    pHeight = $('div.image img').height();
                    imgPath = $('div.image img').attr('src') || "none";
                }
                if (imgPath !== "none") {
                    /*var canvas = document.getElementById('magcan');
            var ctx = canvas.getContext('2d');
            var img = new Image();   // Create new img element
            img.src = imgPath; // Set source path
            ctx.drawImage(img,0,0);*/
                    $('#magnifier').css("background-image", "url(" + imgPath + ")");
                    //Zoom works correctly but the offset is WAY off
                    /*var img = new Image;
          img.src = imgPath;
          pWidth = img.width;
          pHeight = img.height;*/
                    $('#magnifier').css("background-size", (pWidth * zoomFactor) + "px " + (pHeight * zoomFactor) + "px");
                }
            }
        }

        $('i#magnifier-submenu-toggle').click(function() {
            $("#thingifier-magnifier-menu").fadeToggle(350);
            $("#magnifier-tooltip").fadeToggle(350);
            $('#sizenum').val(DT.mag.sizeRes);
            $('#sizemeasure').val(DT.mag.sizeMeasure);
            $('#minsizenum').val(DT.mag.minSizeRes);
            $('#minsizemeasure').val(DT.mag.minSizeMeasure);
            $('#zoomfactor').val(DT.mag.zoomFactor);
            if (GM_getValue('magBorder', '50%') === '50%') {
                $('#circularborder').click();
            } else {
                $('#squareborder').click();
            }
        });
        $('#forcircle').click(function() {
            $('#circularborder').click();
        });
        $('#forsquare').click(function() {
            $('#squareborder').click();
        });
        $('#magnifier-menu-submit').click(function() {
            var ferror = "",
                border,
                sizemeasure,
                minsizemeasure,
                size,
                minsize;
            if ($('#circularborder').is(':checked')) {
                border = "50%";
            } else {
                border = "0";
            }
            //Size number
            if ($('#sizenum').val().toString().match(/\d/g) !== null) {
                size = $('#sizenum').val();
            } else {
                ferror += "Please use a number for the size!\n";
            }
            //Size measurement type
            if (measurecheck($('#sizemeasure').val())) {
                sizemeasure = $('#sizemeasure').val();
            } else {
                ferror += "Please use a valid type for the size!\n";
            }
            //Minimum size number
            if ($('#minsizenum').val().toString().match(/\d/g) !== null) {
                minsize = $('#minsizenum').val();
            } else {
                ferror += "Please use a number for the minimum size!\n";
            }
            //Minimum size measurement type
            if (measurecheck($('#minsizemeasure').val())) {
                minsizemeasure = $('#minsizemeasure').val();
            } else {
                ferror += "Please use a valid type for the minimum size!\n";
            }
            //Zoom factor
            if ($('#zoomfactor').val().toString().match(/\d/g) !== null) {
                zoom = $('#zoomfactor').val();
            } else {
                ferror += "Please use a number for the zoomfactor!\n";
            }
            //Check for errors or save
            if (ferror !== "") {
                alert(ferror);
            } else {
                DT.mag.sizeRes = size;
                DT.mag.sizeMeasure = sizemeasure;
                DT.mag.minSizeRes = minsize;
                DT.mag.minSizeMeasure = minsizemeasure;
                DT.mag.zoomFactor = zoom;
                DT.mag.border = border;
                setItem("DT", DT);
                $('i#magnifier-submenu-toggle').click();
            }
        });
        $('#magnifier-menu-cancel').click(function() {
            $("#thingifier-magnifier-menu").fadeToggle(350);
            $("#magnifier-tooltip").fadeToggle(350);
        });
        function measurecheck(measure) {
            //Should work just as well as an if loop using the || operator
            switch(measure) {
                case "vh":
                case "vw":
                case "vmin":
                case "vmax":
                case "%":
                case "px":
                    return true;
                    break;
                default:
                    return false;
                    break;
            }
        }

        //Only Pending tag suggestions option - By Gwen Hope
        $('#thingifier-pending-suggestions').change(function() {
            DT.pendtags = $(this).is(":checked"); //Updated to use new settings object
            setItem("DT", DT); //Saves changed settings
            if (pageurl.match(/user\/suggestions/)) {
                console.log("User suggestions page");
                if (DT.pendtags) { //Updated to use new settings object
                    $('.suggestion-accepted').hide();
                    $('.suggestion-rejected').hide();
                }
                else {
                    $('.suggestion-accepted').show();
                    $('.suggestion-rejected').show();
                }
            }
        });

    });//$(document).ready() end

    function getpost(postpath, postid) {
        let message = "";
        $.ajax({
            type: "GET",
            url: postpath,
            dataType: "text",
            timeout: 10000,
            cache: false
        })
            .done(function(data) {
            quote[postid] = htmlDecode($(data).find('#forum_post_message'));
            $('#forum_post_message').val(quote[postid]);
            //Don't use the custom getItem() for these. That's only meant for JSON items
            var post = localStorage.getItem("quoteid", false);
            var username = localStorage.getItem("quotename", false);
            let quoting = "> [**" + username + "** posted:](" + post + ") \n> ";
            message = htmlDecode(data.replace(/([\u0000-\uffff]+<textarea .+ id="forum_post_message".+>)([\u0000-\uffff]+)(<\/textarea>[\u0000-\uffff]+)/, "$2"));
            $('#forum_post_message').val(quoting + message);
        })
            .fail(function() {
            console.log("error");
        });
    }

    function htmlDecode(input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
})();