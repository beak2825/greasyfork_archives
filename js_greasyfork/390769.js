// ==UserScript==
// @name         THP-waifu-script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @require http://code.jquery.com/jquery-3.2.1.js
// @require http://code.jquery.com/ui/1.12.1/jquery-ui.js
// @description  Minor THP improvements
// @author       Moral
// @match        https://www.touhou-project.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390769/THP-waifu-script.user.js
// @updateURL https://update.greasyfork.org/scripts/390769/THP-waifu-script.meta.js
// ==/UserScript==

/* To do: Mention that user should reload to see changes. */
// To do: Waifu changing (disgusting), save waifu toggle state, adjustable width, custom CSS, native colors (e.g. fix postbox and maybe config), opacity, size (basically all the waifu customization), remember quick reply pos
// Check with teruyo: localstorage password, preview button doesn't work on QR (so ask him how it works)
// Maybe: Deprecate alerts -- navbar only exists on boards

/* Vomits css style onto the document */
function addStyle(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    if (head) {
        var style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }
}

/* Creating a CSS page - might not be necessary */
function addCSSPage(cssLink) {
    var head   = document.getElementsByTagName('head')[0];
    var link   = document.createElement('link');
    link.id    = "waifuCSS";
    link.rel   = 'stylesheet';
    link.type  = 'text/css';
    link.href  = cssLink;
    link.media = 'all';
    head.appendChild(link);
}

/*
-- Jeez. This function is so garbage.
-- Basically, it emulates THP's reply boxes and fields but the underlying code is flimsy and disgusting to look at.
*/
function vomitQuickReplyHTML() {

    /* Check if a quick reply box exists. If so, murder it. */
    if (isQROpen()) {
        console.log(document.body);
        document.getElementById("dragObj").remove();
        console.log(document.body);
        return;
    }

    /* Check if we're at the homepage */
    if (window.location.href != "https://www.touhou-project.com/") {
        var dragObj = document.createElement("div");
        var url = window.location.href;
        var page = url.substring(url.lastIndexOf('/') + 1);
        var board = url.slice(9, -1);
        // /th/ and /i/ are last because they can overlap with /others/ and /eientei/, /shrine/, /youkai/ respectively
        var boardList = ["gensokyo", "at", "words", "blue", "eientei", "forest", "border", "shrine", "sdm", "youkai", "underground", "others", "shorts", "coriander", "th", "i"];
        var mediaList = ["jpg", "gif", "webm", "css", "png"];
        board = board.substring(board.indexOf('/') + 1);

        // This is stupidly inefficient //
        for (var i=0; i<boardList.length; i++) {
           if (url.includes(boardList[i]) == true) {
               board = boardList[i];
               break;
               }
        }

        // We don't want to make a quick reply when you're looking at a picture of your waifu //
        for (i=0; i<mediaList.length; i++) {
            if (url.includes(mediaList[i]) == true) {
                alert("You can't do that here. [Reason: You are not in the thread]");
                return;
            }
        }

        /* Quoting and postforms */
        if (page.includes("#")) {
            page = page.split("#")[0];
        }

        /* Last 50 posts / First 100 posts formatting here (awful workaround I know) */
        if (page.includes("+")) {
//            page = page.slice(0, -3);
            console.log(page);
            page = page.split("+");
            page = page[0];
            console.log(page);
        }
        else if (page.includes("-")) {
            console.log(page);
            page = page.split("-");
            page = page[0];
            console.log(page);
        }

        else {
            console.log(page);
            page = page.slice(0, -5); // Remove the .html
        }

        /* I am good at naming things consistently */
        dragObj = document.createElement("div");
        dragObj.id = "dragObj";
        /* Super long HTML to create our quick reply lol */
        if (page) {
            dragObj.innerHTML = '<form name="postform" id="postform" action="https://www.touhou-project.com/board.php" method="post" enctype="multipart/form-data"> <input type="hidden" name="board" value="' + board + '" /> <input type="hidden" name="replythread" value="' + page + '" /> <input type="hidden" name="MAX_FILE_SIZE" value="4194304" /> <input type="text" name="email" size="28" maxlength="75" value="" style="display: none;" /> <table id="QRTable" style="border: 1px solid black;" bgcolor="#292929" class="postform"> <tbody> <tr id="QRTableheader"> <td style="font-size: 12px;"> Quick Reply </td> </tr> <tr> <td> <input type="text" name="name" size="18" maxlength="75" placeholder="Name" accesskey="n" /> <input type="text" name="em" size="13" maxlength="75" placeholder="sage" accesskey="e" /> </tr> <tr> <td> <input type="text" name="subject" size="37" maxlength="75" placeholder="Subject" accesskey="s" />&nbsp; <input id="previewbutton" value="Preview" type="button"> <input type="submit" value="Reply" accesskey="z" /> </td> </tr> <tr> <td> <textarea name="message" placeholder="Message" cols="46" rows="5" style="margin: 0px; width: 391px; height: 119px;" accesskey="m"></textarea> </td> </tr> <tr> <td> <input type="file" name="imagefile" size="35" accesskey="f" /> </td> </tr> <tr> <td> <input type="password" name="postpassword" size="9" accesskey="p" />&nbsp; <label style="font-size: 12px;" for="postpassword">(Password for post and file deletion)</label> </td> </tr> <tr id="passwordbox"><td><input type="checkbox" name="nsfw" id="nsfw" style="right: 0;"> <label style="font-size: 12px;" for="nsfw">NSFW</label> <input type="checkbox" name="update" id="update" style="right: 0;"> <label style="font-size: 12px;" for="update">Update</label></td></tr> </tbody> </table> </form>';
        }
        else {
            dragObj.innerHTML = '<form name="postform" id="postform" action="https://www.touhou-project.com/board.php" method="post" enctype="multipart/form-data"> <input type="hidden" name="board" value="' + board + '" /> <input type="hidden" name="replythread" value="0" /> <input type="hidden" name="MAX_FILE_SIZE" value="4194304" /> <input type="text" name="email" size="28" maxlength="75" value="" style="display: none;" /> <table id="QRTable" style="border: 1px solid black;" bgcolor="#292929" class="postform"> <tbody> <tr id="QRTableheader"> <td style="font-size: 12px;"> Quick Submit </td> </tr> <tr> <td> <input type="text" name="name" size="18" maxlength="75" placeholder="Name" accesskey="n" /> <input type="text" name="em" size="14" maxlength="75" placeholder="sage" accesskey="e" /> </tr> <tr> <td> <input type="text" name="subject" size="37" maxlength="75" placeholder="Subject" accesskey="s" />&nbsp;<input type="submit" value="Submit" accesskey="z" /> </td> </tr> <tr> <td> <textarea name="message" placeholder="Message" cols="46" rows="5" accesskey="m"></textarea> </td> </tr> <tr> <td> <input type="file" name="imagefile" size="35" accesskey="f"/> <input type="checkbox" name="nsfw" id="nsfw" style="right: 0;"/> <label style="font-size: 12px;" for="nsfw">NSFW</label> </td> </tr> <tr> <td> <input type="password" name="postpassword" size="8" accesskey="p" />&nbsp; <label style="font-size: 12px;" for="postpassword">(Password for post and file deletion)</label> </td> </tr> <tr id="passwordbox"><td></td><td></td></tr> </tbody> </table> </form>';
        }
         document.body.appendChild(dragObj);
         dragElement(document.getElementById("QRTable")); // Giving it drag functionality
    }
    else {
        alert("You can't do that here. [Reason: You are at the homepage]");
        return;
    }
}
/* Helper function */
function isQROpen() {
    console.log(document.getElementById("QRTable"));
    if (document.getElementById("QRTable"))
    { return true; }
    return false;
}

/* Work in progress */
function manifestQR(link) {
    var flag = 0;
    if (isQROpen()) {
        var c = document.getElementById("QRTable").getElementsByName("message").insertAdjacentHTML('beforeend', link.parentNode.parentNode.getElementsByTag("a"));
        console.log(c);
    }
}
function createQRLinks() {
    var i;
    var refArray = document.querySelectorAll('span.reflink');
    for (i=0; i<refArray.length; i++) {
        var a = document.createElement('a');

        // DO THINGS HERE //
        a.setAttribute('href',"javascript:void(0);");
        //a.addEventListener("onclick", function() { alert("clicktrack"); }, false);
        // END OF DOING THINGS //

        a.innerHTML = "[qr]";
        refArray[i].appendChild(a);
        //console.log(refArray[i]);
    }
}
/* End of WIP */


/* I don't actually remember why this was important */
// Can uncomment in the future
//$('link[rel="alternate stylesheet"]').remove();
//duskCSS = "https://www.touhou-project.com/css/dusk.css";
//addCSSPage(duskCSS);


/* Injecting our waifu into the site */
function insertWaifu(source, pos, ratio, opacity) {
    var waifu = document.createElement("div");
    waifu.id = "waifu";
    document.body.appendChild(waifu);
    document.getElementById("waifu").innerHTML = '<img src="' + source + '"/>';
    // Comments: Used backface-visibility to stop image stuttering when opacity transitions. Problems: older browsers do not support this //
    addStyle("#waifu img { position: " + pos + "; height: " + ratio + "; z-index: 1; bottom: 0; right: 0; opacity: " + opacity + "; -webkit-backface-visibility: hidden; transition: opacity .45s ease-in-out; } ");
    addStyle("#waifu img:hover { opacity: 1.0; }");
    return waifu;
}


/* Adding all of my CSS styles in one function to keep things neat (relatively) */
function appendStyle() {
    /* I hate javascript booleans */
    if (localStorage.getItem("OPT_1") == "true")
    {
        addStyle(".adminbar { padding-top: 5px; z-index: 1; position:fixed; top: 0; right: 0; margin: 150 px; padding-right: 5px; ");
        addStyle("body { margin-top: 25px; }");
        addStyle(".navigation { padding-top: 5px; padding-bottom: 5px; border-bottom: 1px solid currentColor; background-color: inherit; position:fixed; top: 0; padding: 25 px !important; width: 100%; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding-left: 5px; margin-left: -8px; }");
    }
    addStyle("#minMenu { margin-top: 30px; color: #f2f2f2; overflow: hidden; background-color: #121212; position: fixed; top: 0; right: 0; width: 30px; border-bottom: 1px solid #e4e4e4; } ");
    addStyle("#minMenu ul { list-style-type: none; margin: 0; padding: 0; }");
    addStyle("#minMenu li { border-left: 1px solid #e4e4e4; font-weight: bold; float: right; display: inline-block: color: #f2f2f2; "
             + "text-align: center; padding: 5px 8px; text-decoration: none; font-size: 9px; cursor: pointer; }");
    addStyle("#minMenu li:hover { background-color: black; } ");
    addStyle("#waifuMenu { margin-top: 30px; overflow: hidden; background-color: inherit; position: fixed; top: 0; right: 0; width: 100%; border-bottom: 1px solid #e4e4e4; } ");
    addStyle("#waifuMenu a { color: white; font-family: 'Trebuchet MS',Trebuchet,serif; font-size: 9px; text-decoration: none; margin: 0;");
    addStyle("#waifuMenu ul.leftBar { list-style-type: none; margin: 0; padding: 0; float: right; }");
    addStyle("#waifuMenu ul.rightBar { list-style-type: none; margin: 0; padding: 0; float: right; }");
    addStyle("#waifuMenu li { font-family: 'Trebuchet MS',Trebuchet,serif; border-left: 1px solid #383838; border-right: 1px solid #383838; font-weight: bold; float: left; display: block; color: #f2f2f2; "
             + "text-align: center; padding: 5px 8px; text-decoration: none; font-size: 9px; cursor: pointer;  -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; }");
    addStyle("#waifuMenu li.nil { cursor: default }");
    addStyle("#waifuMenu li:hover { background-color: black; } ");
    addStyle("#QRTable { z-index: 4; color: white; position: fixed; top: 10%; right: 0; } ");
    addStyle("#QRTableheader { cursor: move; }");
//    addStyle("#dragObj { position: absolute; right: 0; top: 0; }");
    addStyle('#delform { width:85%; } table:not(.postform):not(.userdelete) { border-style: none !important;');
    addStyle(`/* The Overlay (background) */ .overlay { /* Height & width depends on how you want to reveal the overlay (see JS below) */ height: 100%; width: 0; position: fixed; /* Stay in place */ z-index: 1; /* Sit on top */ left: 0; top: 0; background-color: rgb(0,0,0); /* Black fallback color */ background-color: rgba(0,0,0, 0.75); /* Black w/opacity */ overflow-x: hidden; /* Disable horizontal scroll */ transition: opacity .0s; } /* Position the content inside the overlay */ .overlay-content { position: relative; top: 25%; /* 25% from the top */ width: 100%; /* 100% width */ text-align: center; /* Centered text/links */ margin-top: 30px; /* 30px top margin to avoid conflict with the close button on smaller screens */ } /* Position the close button (top right corner) */ .overlay .closebtn { color: white; right: 5px; font-size: 20px; margin: auto; float: right; padding-right: 10px; text-decoration: none; } div.menu-container { width: 50%; margin: auto; box-shadow: rgba(0,0,0,.6) 0 0 7.5px 2px !important; } /* Style the tab */ div.tab { /*border-bottom: 1px solid #2a2a2a;*/ overflow: hidden; background-color: #212121; /*box-shadow: 10px 10px 5px 15px black;*/ /*box-shadow: rgba(0,0,0,.6) 5px 5px 10px !important;*/ } /* Style the buttons inside the tab */ div.tab button { font-family: 'Trebuchet MS',Trebuchet,serif; background-color: inherit; float: left; border: none; outline: none; cursor: pointer; padding: 6px 10px; transition: 0.2s; color: #e4e4e4; } /* Change background color of buttons on hover */ div.tab button:hover { background-color: #191919; } /* Create an active/current tablink class */ div.tab button.active { background-color: #111111; } /* Style the tab content */ div[name="tabcontent"] { font-size: 16px; font-family: 'Trebuchet MS',Trebuchet,serif; border-radius: 0 0 5px 5px; /*box-shadow: rgba(0,0,0,.6) 0 0 10px !important;*/ display: none; padding: 6px 12px; border-top: none; color: #ffffff; background-color: #191919; text-align: left; } .checkbox { vertical-align: text-top; padding-top: 1px; float: right; background-color: #121212; } .optText, .optDrop { background-color: #121212; border: 1px solid #080808; color: #fff; float: right; } .oddRow, .evenRow { padding-bottom: 2px; } .form-select { border: none; float: right; } .form-select select { border: none; color: white; font-size: 12px; border: 1px solid #080808; background-color: #121212; background-size: 20px; background-position: right 10px center; padding-left: 24px; }`);
}

/* Constructing our menu and adding click functions to our buttons */
function createMenu() {
    var menu = document.createElement("div");
    menu.id = "waifuMenu";
    document.body.appendChild(menu);

    /* More lengthy HTML strings */
    document.getElementById("waifuMenu").innerHTML =
        '<a href="/"><li>HOME</li></a> <a href="/gensokyo/"><li>GENSOKYO</li></a> <a href="/i/"><li>I</li></a> <a href="/at/"><li>AT</li></a> <a href="/blue/"><li>BLUE</li></a> <li class="nil"></li>' +
        '<a href="/th/"><li>TH</li></a> <a href="/eientei/"><li>EIENTEI</li></a> <a href="/forest/"><li>FOREST</li></a> <a href="/border/"><li>BORDER</li></a> <a href="/shrine/"><li>SHRINE</li></a> <a href="/sdm/"><li>SDM</li></a> <a href="/youkai/"><li>YOUKAI</li></a> <a href="/underground/"><li>UNDERGROUND</li></a> <a href="/others/"><li>OTHERS</li></a> <a href="/shorts"><li>SHORTS</li></a> <li class="nil"></li>  <a href="/storylist.php"><li>STORY LIST</li></a>' +
        '<ul class="rightBar"> <li id="hide">HIDE</li> <li id="change">CHANGE</li> <li id="show">SHOW</li> <li id="QR">OPEN/CLOSE QR</li> <li id="w_setting">⚙</li> <li id="minus">[-]</li> </ul> ';

    /* Click functions and listeners */
    document.getElementById("hide").addEventListener("click", function() {
        document.body.removeChild(waifu);
    });
    document.getElementById("change").addEventListener("click", function() {
        document.getElementById("waifu").innerHTML = '<img src="https://puu.sh/wSqTE/8df50e7511.png"/>';
    });
    document.getElementById("show").addEventListener("click", function() {
        document.body.appendChild(waifu);
    });
        document.getElementById("QR").addEventListener("click", function() {
        vomitQuickReplyHTML();
    });
        document.getElementById("w_setting").addEventListener("click", function() {
        showOverlay();
    });
    document.getElementById("minus").addEventListener("click", function() {
        document.body.removeChild(waifuMenu);
        createMin();
    });
    return menu;
}

function openConfig(content) {
    /* Declare variables */
    var i, tabcontent, tablinks;

    /* Get all elements with name="tabcontent" and hide them */
    tabcontent = document.getElementsByName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    /* Get all elements with name="tablinks" and remove the class "active" */
    document.getElementsByName("General")[0].className = "";
    document.getElementsByName("Waifu")[0].className = "";
    document.getElementsByName("CSS")[0].className = "";
    document.getElementsByName("Misc")[0].className = "";

    /* Show the current tab, and add an "active" class to the button that opened the tab */
    console.log(document.getElementsByName(content)[0]);
    document.getElementById(content).style.display = "block";
    document.getElementById(content).className = "active";
    document.getElementsByName(content)[0].className = "active";
}

function createMenuOverlay() {
//    console.log(document.getElementsByClassName("overlay"));

    /* MORE LENGTHY HTML STRINGS */
    var html_overlay = ` <div id="config" class="overlay" style="width: 100%; height: 100%; margin: auto;"> <div id="overlay-menu" class="overlay-content"> <div class="menu-container"> <div class="tab"> <button name="General" name="tablinks" id="openByDefault">General</button> <button name="Waifu" name="tablinks">Waifu</button> <button name="CSS" name="tablinks">CSS</button> <button name="Misc"name="tablinks">Misc.</button> <a href="javascript:void(0);" name="closeButton" class="closebtn">&times;</a> </div> <div id="General" name="tabcontent"> <div class="oddRow"> <div class="optCheck"> <label for="OPT_1">Fixed navigation bar</label> <input class="checkbox" type="checkbox" value="1" id="OPT_1" /><br> </div> </div> <div class="evenRow"> <div class="optCheck"> <label for="OPT_1">GENERIC OPTION HERE</label> <input class="checkbox" type="checkbox" value="1" id="OPT_1" /><br> </div> </div> <div class="oddRow"> <div class="optCheck"> <label for="OPT_1">GENERIC OPTION HERE</label> <input class="checkbox" type="checkbox" value="1" id="OPT_1" /><br> </div> </div> <div class="evenRow"> <div class="optCheck"> <label for="OPT_1">GENERIC OPTION HERE</label> <input class="checkbox" type="checkbox" value="1" id="OPT_1" /><br> </div> </div> <div class="oddRow"> <label for="OPT_2">Who is the worst waifu?</label> <div class="form-select"> <select name="OPT_2" id="OPT_2"> <option value="0">You</option> <option value="1">Your waifu</option> <option value="2">My waifu</option> <option value="3">Moral</option> <option value="4">nerd</option> <option value="5">aaaaaaaaa</option> </select> </div> </div> <div class="evenRow"> <label for="OPT_3">another option here</label> <input class="optText" id="OPT_3" type="text" placeholder="type option/link here"/> </div> </div> <div id="Waifu" name="tabcontent"> <h3>Paris</h3> <p>Paris is the capital of France.</p> </div> <div id="CSS" name="tabcontent"> <h3>Tokyo</h3> <p>Tokyo is the capital of Japan.</p> </div> <div id="Misc" name="tabcontent"> <h3>efawe</h3> <p>Tokyo iawefwefapan.</p> </div> </div> </div> </div> `;
    document.body.insertAdjacentHTML('beforeend', html_overlay);
    document.getElementsByName("General")[0].addEventListener("click", function() {
        openConfig("General");
    });
    document.getElementsByName("Waifu")[0].addEventListener("click", function() {
        openConfig("Waifu");
    });
    document.getElementsByName("CSS")[0].addEventListener("click", function() {
        openConfig("CSS");
    });
    document.getElementsByName("Misc")[0].addEventListener("click", function() {
        openConfig("Misc");
    });
    document.getElementsByName("closeButton")[0].addEventListener("click", function() {
        hideOverlay();
    });

    document.getElementById("openByDefault").click();
    document.getElementById("config").style.opacity = "0";
    document.getElementById("config").style.zIndex = "-5";
}

/* Checks to see if user clicks outside of menu overlay */
document.addEventListener('mouseup', function() {
    clickedOutsideMenu();
});

function clickedOutsideMenu() {
    var specifiedElement = document.getElementById('overlay-menu');
    var isClickInside = (specifiedElement.contains(event.target));
    if (!isClickInside && specifiedElement != 'w_setting') {
        hideOverlay();
  }
}

function showOverlay() {
    document.getElementById("config").style.zIndex = "5";
    document.getElementById("config").style.opacity = "1.0";
}

function hideOverlay() {
    document.getElementById("config").style.zIndex = "-5";
    document.getElementById("config").style.opacity = "0";
}

function createSettingsLink() {
    if (document.getElementsByClassName('navbar'))
    {
        document.getElementsByClassName('navbar')[0].innerHTML += ' [<a id="w_setting" href="javascript:void(0);">⚙</a> / ';
        document.getElementsByClassName('navbar')[0].innerHTML += '<a id="toggle" href="javascript:void(0);">Toggle Waifu</a> / ';
        document.getElementsByClassName('navbar')[0].innerHTML += '<a id="QR" href="javascript:void(0);">Toggle Reply</a>]';
    }
        document.getElementById("w_setting").addEventListener("click", function() {
        showOverlay();
    });
    document.getElementById("toggle").addEventListener("click", function() {
        if (document.getElementById("waifu")) { document.body.removeChild(waifu); }
        else { document.body.appendChild(waifu); }
    });
    document.getElementById("QR").addEventListener("click", function() {
        vomitQuickReplyHTML();
    });
}

/* Creating our minimized button menu */
function createMin() {
    var minMenu = document.createElement("div");
    minMenu.id = "minMenu";
    document.body.appendChild(minMenu);
    document.getElementById("minMenu").innerHTML = '<ul> <li id="plus">[+]</li></ul>';
        document.getElementById("plus").addEventListener("click", function() {
        document.body.removeChild(minMenu);
        createMenu();
    });
    return;
}

/* Initialization */
function init() {
    appendStyle();
    createSettingsLink();
    //createMenu();

    //createMin();
    createQRLinks();
    createMenuOverlay();
    /* Sees if any options change (to do here) */
    document.getElementById("OPT_2").onchange = function() {
        localStorage.setItem('OPT_2', document.getElementById("OPT_2").value);
    };
    if (localStorage.getItem('OPT_2')) {
        document.getElementById("OPT_2").options[localStorage.getItem('OPT_2')].selected = true;
    }

    document.getElementById("OPT_1").onchange = function() {
        localStorage.setItem('OPT_1', document.getElementById("OPT_1").checked);

    };
    /* I wish I didn't have to read it as a JSON to get this to work */
    var checked = JSON.parse(localStorage.getItem('OPT_1'));
    if (checked == true) {
        document.getElementById("OPT_1").checked = true;
    }
}

//window.onload = init();
$( document ).ready(function() {
   init();
});
/* Parameters for waifu */
var OPACITY = 0.5;
var POSITION = "fixed";
var LINK = "https://puu.sh/wThxz/39cd365b98.png";
var SIZE = "35%";
/* --------------------- */
var waifu = insertWaifu(LINK, POSITION, SIZE, OPACITY);


// Bugs so far:
// No opacity transition when exiting menu
// Width of table page links extends too far (because everything shares table style) --> Fixed? What? I don't know.


/* Below is all stolen - maybe refactor it? */
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  console.log("Starting drag.");
  console.log(document.getElementById(elmnt.id + "header"));
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    console.log("ABCDEF");
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}