// ==UserScript==
// @name         Neopets - Dailies
// @namespace    http://www.neopets.com/dailies
// @version      0.70.0762
// @description  Collect all dailies on one page for easy usage
// @author       Anon
// @match        http://www.neopets.com/dailies
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/23305/Neopets%20-%20Dailies.user.js
// @updateURL https://update.greasyfork.org/scripts/23305/Neopets%20-%20Dailies.meta.js
// ==/UserScript==

// ==================== Options ====================

// ===== Debug Settings =====

/*
 * set the level of verbosity for debug messages
 * 0: none
 * 1: small notifications, starting, finishing, progress
 * 2: debug dump outputs
 * 3: lemme think about it
 * 4: all
 * default: 4
 */
const DEBUGLEVEL = 4;

// ===== Debug End

// ===== Misc Settings =====

/*
 * use cookies to remember timer starts and maybe other stuff
 * not implemented yet
 * default: true
 */
const ALLOWCOOKIES = true;

/*
 * Show my dev notes in an extra section
 * default: false
 */
const ALLOW_NOTES = false;
/*
 * show a test for pet preview swfs
 * default: false
 */
const ALLOW_PET_TESTS = false;

/*
 * the minimized & expanded icons
 * default: "\u25C4"
 * default: "\u25BC"
 */
const CHAR_MINI_CLOSED = "\u25C4";
const CHAR_MINI_OPENED = "\u25BC";

/*
 * hide swf dailies on creation so they only start loading when you expand them
 * default: true
 */
const START_FLASH_HIDDEN = true;

// ===== Misc End



// ===== Account Safety

/*
 * whether to disallow most of the page to accounts other than your main
 * to prevent accidental dailies usage on a side
 * Not implemented yet
 * default: false
 */
const MAIN_CHECK = false;

/*
 * your main acccount name, for the main check, write the name EXACTLY, including all capitalization, numbers, and symbols
 * default: a blank string ""
 */
const MAIN_NAME = "";

// ===== Account End



// ===== Lab Safety

/*
 * show the secret laboratory, disable if you don't want the chance of accidentally zapping your pets
 * default: false
 */
const LAB_ALLOW_SECRET = false;

/*
 * pets that are allowed to be zapped, write the name EXACTLY, including all capitalization, numbers, and symbols
 * if you don't want a pet to be able to be zapped at all, DO NOT WRITE THEIR NAME, simple as that
 * the list is empty at the start for a reason, I only want it to be possible to zap a pet if you give your permission to the page explicitly
 * default: an empty list []
 */
const LAB_RATS_SECRET = [
    "",
    "",
    "",
    "",
    ""
];

/*
 * show the petpet laboratory, disable if you don't want the chance of accidentally zapping your petpets
 * default: false
 */
const LAB_ALLOW_PETPET = false;

/*
 * pets whose petpets are allowed to be zapped, write the name EXACTLY, including all capitalization, numbers, and symbols
 * if you don't want a pet's petpet to be able to be zapped at all, DO NOT WRITE THEIR NAME, simple as that
 * the list is empty at the start for a reason, I only want it to be possible to zap a petpet if you give your permission to the page explicitly
 * default: an empty list []
 */
const LAB_RATS_PETPET = [
    "",
    "",
    "",
    "",
    ""
];

// ===== Lab End



// ===== Wheel Settings =====

/*
 * mask out the excess content at the edges of the wheels
 * default: true
 */
const WHEEL_ENABLE_MASK = true;

/*
 * show the wheel of extravagance, disable if you don't want the chance of accidentally spending 100k
 * default: false
 */
const WHEEL_ALLOW_EXT = false;

/*
 * show the wheel of misfortune
 * default: true
 */
const WHEEL_ALLOW_MIS = true;

/*
 * show the mute button on the wheel of monotony
 * default: true
 */
const WHEEL_SHOW_MON_MUTE = true;

// ===== Wheel End

// ==================== Options End



// ==================== Includes/Data ====================

// ===== Stylesheet =====
var DAILYSTYLE = `
/* ===== Reset Neopets Settings ===== */

.sectionFrame .sidebarHeader,
.dailyFrame .sidebarHeader
{
height: auto;
overflow: auto;
position: relative;
margin: 0;
padding: 0;
padding-left: 0;
}

/* ===== Header Rules ===== */
.sectionFrame .sidebarHeader,
.dailyFrame .sidebarHeader
{
padding: 0.5em 0.25em 0.5em 0.25em;
}

.frameHeader>*
{
position: relative;
display: inline-table;
margin: 0 0.25em 0 0.25em;
}

.frameHeader .minimize
{
width: 1.25em;
height: 1.25em;
float: right;
}

.frameHeader .minimize .charspan
{
position: absolute;
left: 0;
top: -1.4px;
}

/* ===== Section Rules General ===== */
.sectionFrame,
.sectionFrame .sectionHeader
{
margin-bottom: 0.5em;
}

.sectionContent
{
padding-right: 0.5em;
}

/* ===== Daily Rules General ===== */
.dailyFrame
{
display: inline-table;
margin-left: 0.5em;
margin-bottom: 0.5em;
}

.dailyFrame .dailyHeader
{
margin-bottom: 0.5em;
}

.dailyContent
{
position: relative;
width: inherit;
height: 300px;
overflow: hidden;
margin: 0.5em;
}

.dailyFrame .widthbar
{
margin: 0 0.5em 0 0.5em;
}

.dailyFrame .dailyContent button
{
display: inline-block;
}



/* ===== Daily Rules Justify ===== */
.dailyFrame .justifyContainer
{
width: inherit;
height: inherit;
}

.dailyFrame.justify .dailyHeader
{
margin-bottom: 0.5em;
}

.dailyFrame.justify .widthbar
{
width: inherit;
}

.dailyFrame.justify .justifyContainer
{
display: table-cell;
vertical-align: middle;
}

.dailyFrame.justify .justifyContainer>*
{
text-align: justify;
font-size: 0.01px;
}

.dailyFrame.justify .justifyContainer>*>* {
display: inline-block;
}

.dailyFrame.justify .justifyContainer>*:after {
content: '';
width: 100%;
display: inline-block;
}

/* ===== Centers ===== */
.dailyFrame.centers .dailyContent
{
text-align: center;
}

.dailyFrame.centers .dailyContent>*
{
display: table-cell;
vertical-align: middle;
}

.dailyFrame.centers table {
display: inline-table;
margin: 0.25em 0.25em 0 0.25em;
}

/* ===== Error ===== */
.dailyFrame.error .dailyContent
{
height: auto;
}

/* ===== Thin ===== */
.dailyFrame.thin .dailyContent,
.dailyFrame.thin .widthbar
{
width: 222px;
}

/* ===== Wide ===== */
.dailyFrame.wide .dailyContent,
.dailyFrame.wide .widthbar
{
width: 621px;
}

/* ===== Half ===== */
.dailyFrame.half .dailyContent
{
height: 150px;
}

/* ===== Large ===== */
.dailyFrame.large .dailyContent
{
width: 621px;
height: auto;
}

.dailyFrame.large .widthbar
{
width: 621px;
}

/* ===== Box ===== */
.dailyFrame.box .dailyContent,
.dailyFrame.box .widthbar
{
width: 300px;
}

.dailyFrame.box .dailyContent .mask
{
display: initial;
position: absolute;
left: 0%;
top: 0%;
width: 100%;
height: 100%;
}

/* ===== Scrolling ===== */
.dailyFrame.scrolling .dailyContent
{
height: 300px;
overflow-y: scroll;
}

/* ===== Wheel Rules =====*/
.wheel .dailyContent
{
overflow: hidden;
}

.wheel .dailyContent .mask
{
display: none;
pointer-events: none;
}

/* ===== trudy Rules ===== */
.trudy .dailyContent,
.trudy iframe,
.trudy html
{
overflow: hidden;
}

.trudy .dailyContent>div
{
transform-origin: 0% 0%;
transform: scale(0.5) translateX(-108px);
}

/* ===== Shoptill Rules ===== */
.till .dailyContent
{
position: relative;
overflow: hidden;
}

.till .dailyContent>div
{
overflow: hidden;
}
/*
.till .dailyContent>div
{
position: absolute;
left: -438px;
top: -530px;
}
*/

/* ===== Lists ===== */
.dailyContent ol,
.dailyContent ul,
.dailyContent li
{
margin: 0;
}

.dailyContent ul li,
.dailyContent ol li
{
margin 0.25em 0 0 0;
font-weight: bold;
}

.dailyContent ul li *,
.dailyContent ol li *
{
font-weight: normal;
}

/* ===== Crop Button ===== */
.cropButton {
display: inline-table;
position: relative;
vertical-align: middle;
}

.cropButton div {
width: 80px; //wd;
height: 80px; //ht;
//666, 333 center;
//scale: 0.16;
position: relative;
overflow: hidden;
margin: 0;
}

.cropButton div img {
position: relative;
}

/* ===== Extras ===== */
button embed
{
pointer-events: none;
}
`;
// what? what do you mean your shitty browser doesn't support template literals?

// ===== Stylesheet End

// ===== Circle Mask =====
var MASKCIRCLE =
    "data:image/gif;base64,R0lGODlhLAEsAYABAP///wAAASH5BAEKAAEALAAAAAAsASwBAAL+hI+py+0Po5y02ouz3rz7D4ZHQJbmiZbiyrbuC8PpTNdzjOf6zk/" +
    "2DwyaesSi8UgRKpdKpPMJdTGnVGH0is06qtxuUAsOF73kMlCMTofM7HZNDY9L3PR6So7P2/d8Uv4f1icoCFjoNIhIaLiYk+iIyBi58kgJKXmpUalpidkZsQnK6TmK" +
    "EGoqSop5uoqaasgK2+oqF1srO4tmq6uIm7b7y9ubBUwcLPxUnMx3jKzsvMds9DxtF81DjV1tHZPdTbct5S3uBi4yft5W/oHObqa+0R7v/m4hb09Gn3S/z5X/yQ+Qi" +
    "r8GAQtWGZjAoMIpCA0sfLgEIcSJVvJRvHjmHcb+jTbUcfxIAxzIkXeikTx5ghnKlSp6sXwZABdMmK5mziRl06annDlV8ewZ6edPRkKFLio6tBBSo3+WFtXj9GmcqE" +
    "unUpXq6yrSrFq3Burq9CtYr8PGhsViliratGehsFXb7G3UuHKrIql79QherdL2wu3hly/gwH91EBbc6DBiborz4mjc9TFkxy8mR65smTKLzJc3c9a85vNiEKJHeyj" +
    "deR1q0BxWp27tmnWG2K9n05Z94TbuCrpN1+tdODfw3f+Gz7VtvO3v5MeXM7fL+3nw4tKh+6iunDp2stq3M53j3fqD8M3HkxdP8Dz3Leqxsm/vngH89Qvmx69vP2n6" +
    "/Pr+8fPn+d5/Ou0n4E3yFQigfwgaqMCCQDXoIIMJRUgThBRWWMqFGI6g4UsWdojShyCSJOKIIE1oYogcpnhShiySuOKLJ8YoI0cu1mgjjThedOOOPOroI0RABikkA" +
    "ETmeORGDiX5I5NNOjnRklA+JOWUClVpZUFYZgnQllzu4+WX9oQpZjxklsnOmWieo+aa4rTpZjdwxonNnHROY+edzuSpZzJ89knMn4D+Iuigugxp6J6IJurnoowG6u" +
    "ijhEYq6aGUVlpLj5gWo+mmwHTq6S4ohjopqKTCUuKpsaSqKiustnrKq7CGouCssdZqK6245rrJgbya4uuvoBAoLCUBFvv+yLHIJqLssoOY5+wtpkb7DbTU9gHBtc9" +
    "mqy003XXLBnjgVsvtuOSIa24Z+qSr7nXs4rPuuwdFJ++88dbLhHD4RqTvvhX1629HyAUsMAYEZzTwwSjApnBJ8DScUgcQR8zwxDGdZjFpGWvcsDkQT6KwZwe3MDLJ" +
    "BGO2rwz+MlavZC27zK5h8u7w7mDjEpHuGOD21a1e2h5CLV3LuuXsFUMbjWxZv4KxNNO8ipErV6rC0apVp9JCKlSbArK1UpIe9TXYiUoy9iWD7qQnTnTW5KZMaApTp" +
    "kpcWpOlSFB6xCQ9SfpDpEQ7NmRkjYAXat/g0yJouKwCJr5rgYwHi/jjxOZ4J3m5lFduOXyYu3ve5vSG5znAz4WecHKkP2zc6RIPp7pqtLXuMWqwi/zZ7OFYZjvLh+" +
    "Uus1+82/zW7zyPJTzQvhWvc3bIE53g8mJ56DzVLUavtZLUvxLl9WZrqX0q8nRvkpzga9To+ICvan7oyaa/vBfsvw+/BQUAADs=";
// ===== Mask End



// ==================== Includes End



// ==================== Utility Functions ====================

/*
 * Turns a htmlstring into a documentfragment, in the real way
 */
function fragmentize(htmlstring){
    var frag = document.createDocumentFragment();
    var tdiv = document.createElement("div");
    tdiv.innerHTML = htmlstring;
    while (tdiv.firstChild) {
        frag.appendChild(tdiv.firstChild);
    }
    return frag;
}

/*
 * Copies properties to target if they both share the property
 * mostly made so i dont have to write this over again
 */
function copySharedProperties(o, target) {
    for (var p in o) {
        if (p in target) target[p] = o[p];
    }
    return target;
}

/*
 * Allows the collapsing and expanding of the daily divs
 */
function hideContent(caller) {
    try {
        var target = caller.parentNode.parentNode.content;
        target.style.display = "none";
        caller.span.innerText = CHAR_MINI_CLOSED;
    } catch(e) {}
}

/*
 * Allows the collapsing and expanding of the daily divs
 */
function showContent(caller) {
    try {
        var target = caller.parentNode.parentNode.content;
        target.style.display = "";
        caller.span.innerText = CHAR_MINI_OPENED;
    } catch(e) {}
}

/*
 * toggles the collapsing and expanding of the daily divs
 */
window.toggleContent = function(caller) {
    if (caller.span.innerText === CHAR_MINI_OPENED) {
        //collapse
        hideContent(caller);
    } else {
        //expand
        showContent(caller);
    }
};

/*
 * I'm sick of people telling me to do things when they just end up being more work
 */
createXMLHttpRequest = function() {
    var request = null;

    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        request = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
        try {
            request = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                request = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (er) {}
        }
    }
    return request;
};

/*
 * I wish people would stop telling me to use fetch when it's really not what they keep saying it is
 * you need to do so much more fucking bullshit to make it work the exact same as the xhr
 * and I can't find the fucking docs anywhere (cause im too lazy)
 */
window.getPage = function(url) {
    console.log("getting",url);
    return new Promise(function(resolve, reject){
        var request = createXMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function(e) {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                resolve(request.responseText);
            } else {
                // We reached our target server, but it returned an error
                reject(request.statusText);
            }
        };
        request.onerror = function() {
            // There was a connection error of some sort
            reject("Network Error, Content could not be loaded.");
        };
        request.send();
    });
};

/*
 * sets up a cascading then chain from a list of promises
 *
 * in between, it attempts to append the completed daily to the page
 */
function prepAppends(ary, mount) {
    return ary.reduce(function(prev, curr, next){
        if (curr.constructor.name !== "Promise") throw new TypeError("Invalid Object, expected Promise");
        return curr.then(function(r){try{mount.appendChild(r);} catch(e){}}).then(next);
    }, Promise.resolve());
}

// ========== Preparation ==========

/*
 * Prepare the dailies object from the returned pet lookup page
 */
function parsePets(r) {
    console.log("pets_parse",!!(r));
    var result = /<table id='nav'[^]*?<\/table>/igm.exec(r);
    var frag = document.createDocumentFragment();
    window.bod = document.createElement("body");
    bod.innerHTML = result;
    frag.appendChild(bod);

    window.pets_parse = Array.prototype.slice.call(frag.querySelectorAll(".pet_toggler img"));

    if (typeof(pets_parse) !== "undefined" && pets_parse !== null) {
        pets_parse.forEach((item, i) => {
            var name = item.getAttribute("title");
            var id = item.getAttribute("style").match(/\/cp\/(\w+)\//)[1];
            window.dailies.pets[i] = {
                "name": name,
                "id": id,
                "swf": window.dailies.createPetPreview(name)
            };
        });
    }
}

/*
 * a copy of the required functions for trudy's daily, straight from the scripts on the trudy page
 */
function prepareTrudy() {

    // ===== Init Cbox Script =====
    window.initCbox = function(baseClass) {
        $('#colorbox').attr('class', baseClass);
        $('#cboxWrapper').css('width', ($('#cboxTopLeft').width() + $('#cboxTopCenter').width() + $('#cboxTopRight').width()) + 'px');
        $('#cboxContent').css('width', $('#cboxWrapper').width() - ($('#cboxMiddleLeft').width() + $('#cboxMiddleRight').width()) + 'px');
        $('#cboxCurrent').css('display', 'none');
        $('#cboxLoadedContent').css('overflow', 'visible');
        $.colorbox.resize();
        $('#cboxWrapper').css('width', ($('#cboxTopLeft').width() + $('#cboxTopCenter').width() + $('#cboxTopRight').width()) + 'px');
        $('#cboxContent').css('width', $('#cboxWrapper').width() - ($('#cboxMiddleLeft').width() + $('#cboxMiddleRight').width()) + 'px');
        $('#cboxLoadedContent').width($('#cboxContent').width());

        try {
            eval("initCbox_" + baseClass + "()");
        } catch (e) {

        }
    };

    window.defaultColorbox = {
        opacity: 0.70,
        fixed: true,
        scrolling: false,
        transition: 'none',
        onComplete: function(type) {
            initCbox(type);
        }
    };

    // ===== Init Trudy's Script =====
    window.CloseSlotsGame = function() {
        $('#tempcontent').css('display', 'none');
    };

    window.trudyspopup = function(href, version) {
        if (typeof version == 'undefined') {
            version = 1;
        }

        var height = '450px';
        var innerHeight = '343px';
        var adjust = 463;

        $.colorbox({
            width: '625px',
            height: height,
            innerWidth: '270px',
            innerHeight: innerHeight,
            opacity: 0.70,
            fixed: true,
            scrolling: false,
            inline: true,
            transition: 'none',
            href: href,
            onComplete: function() {
                initCbox('ac2014nc');
                $('#cboxLoadedContent').css('width', $('#cboxContent').css('width'));
            }
        });
    };

    window.ShowDailyPrizes = function(prize, type) {
        console.log("ShowDailyPrizes");

        $('#newPrizeMessage').css('display', 'none');
        $('#unluckyMessage').css('display', 'none');
        $('#prize1').css('display', 'none');
        $('#prize2').css('display', 'none');

        if(type == 'badluck') $('#unluckyMessage').css('display', 'block');
        else $('#newPrizeMessage').css('display', 'block');

        for(var i=0;i<prize.length;i++){
            var k = i+1;

            $('#prize' + k).css('display', 'block');
            $('#prizePopupImage' + k).css('background', 'url(' + prize[i].url + ') no-repeat');
            $('#prizePopupName' + k).html('<b>' + prize[i].name + '</b>');
        }

        trudyspopup('#prizePopup', 5);
        try {console.log("restarting trudy timer");document.querySelector("#trudyTimer").restart();}
        catch (e) {}
    };

    window.ShowDailySlotsHelp = function() {
        //$('#helpmsg').css('display', 'none');
        trudyspopup('#slotsHelpPopup', 5);
    };

}

// ========== Preparation End

// ========== Element Creation ==========

/*
 * creates a minimize button and returns the node reference to it
 */
function createMinimizeButton() {
    var button = document.createElement("button");
    button.setAttribute("class", "minimize");
    button.setAttribute("type", "button");
    button.setAttribute("onclick", "toggleContent(this)");



    var span = document.createElement("span");
    span.setAttribute("class", "charspan");
    span.appendChild(document.createTextNode(CHAR_MINI_OPENED));

    button.appendChild(span);
    button.span = span;

    return button;
}

/*
 * creates the timer element for a daily frame
 */
function createDailyTimer(p) {
    if (p.type === "none") return null;
    var time = document.createElement("time");
    time.setAttribute("class", "dailyTimer");

    return time;
}

/*
 * Creates a single input from a parameters object
 */
function createInput(p) {
    var input;
    // otherwise, create the input like normal

    // figure out if element is select type
    var isselect = false;
    if (p.element !== undefined && p.element !== "") {
        input = document.createElement(p.element);
        if (p.element.toLowerCase() === "select") isselect = true;
        if (input.constructor.name === "HTMLUnknownElement") throw new Exception("Element is not valid HTML element");
    } else {
        // no input element given, create normal input
        input = document.createElement("input");
        if (p.type !== undefined && p.type.toLowerCase() === "select") isselect = true;
    }

    copySharedProperties(p, input);
    //                console.debug(inputs[i], inputs[i] instanceof Function , input);
    input.classList.add("dailyInput");

    if (isselect && p.values !== undefined && p.values.length > 0) {
        // if it's a select type, add all of the menu options
        p.values.forEach((j, indexj)=>{
            var option = document.createElement("option");
            option.setAttribute("value", j);
            option.appendChild(document.createTextNode(j));
            input.appendChild(option);
        });
    } else {
        // otherwise, just set the value
        // though the value should have already been set by the property copier
    }

    return input;
}

/**
 * 1 argument: parameter object
 * any property a form has can be put inside
 * additional properties:
 * inputs array:
 *	input = {
 *      (any property an input can have, suggested properties: )
 * 		content: {}, // special, optional, but overrides everything else
 *      values: [], // special, required for select input type, a list of values to select from
 *		className: "", //optional
 * 		id: "", // optional
 *		element: "", // optional
 *		type: "", //required if no element property
 *  	name: "", //required, probably
 *  	value: "" //required
 *	}
 */
function createDailyForm(p) {
    var frag = document.createDocumentFragment();

    var div = document.createElement("div");
    div.classList.add("justifyContainer");

    var form = document.createElement("form");
    copySharedProperties(p, form);
    form.classList.add("dailyForm");
    // target default
    if (form.target === "") form.target = "_blank";
    // inputs
    var inputs = p.inputs;
    try {
        if (inputs === undefined || inputs === null) throw "no inputs";
        inputs.forEach((i, index)=>{
            var input;

            if (i.content !== undefined && i.content !== null) {
                // allow custom content to override input element
                input = i.content;
            } else {
                input = createInput(i);
            }

            form.appendChild(input);
            form.appendChild(document.createTextNode(" "));
        });
    } catch (e) {
        if (e === "no inputs") {
            console.trace("No inputs, skipping");
        } else {
            console.trace("broken inputs?", e);
        }

    }

    if (inputs === undefined && p.button === undefined) {
        var buton = document.createElement("button");
        buton.setAttribute("type", "submit");
        buton.appendChild(document.createTextNode("Submit"));
        form.appendChild(buton);
    }

    if (p.button !== undefined) {
        form.appendChild(p.button);
    }

    div.appendChild(form);
    frag.appendChild(div);

    return frag;
}

/*
 * creates a daily frame and returns the node reference to it
 * Arguments:
 * titlename: the title to put in the header
 * idname: the unique id for this daily frame
 * classname: a css class string for further specification of properties
 * nodecontent: (optional) a node that can be appended to the content of the daily frame
 * timercontent: {optional) a timer node that can be appended to the header
 */
function createDailyFrame(p) {
    var type;
    if (p.type !== undefined && (p.type === "article" || p.type === "section")) type = p.type;
    else type = "article";
    var frame = document.createElement(type);

    copySharedProperties(p, frame);
    frame.classList.add("sidebarTable");
    if (type === "section") frame.classList.add("sectionFrame");
    if (type === "article") frame.classList.add("dailyFrame");


    var header = document.createElement("header");
    header.classList.add("sidebarHeader", "frameHeader");
    if (type === "section") header.classList.add("sectionHeader");
    if (type === "article") header.classList.add("dailyHeader");

    var title = document.createElement("h3");
    title.classList.add("title");
    var titletext = document.createTextNode(p.titleText);
    if (p.titleUrl !== undefined) {
        var anchor = document.createElement("a");
        anchor.href = p.titleUrl;
        anchor.target = "_blank";
        anchor.appendChild(titletext);
        title.appendChild(anchor);
    } else {
        title.appendChild(titletext);
    }

    // timer stuff goes here

    var button = createMinimizeButton();


    var content = document.createElement("div");
    content.classList.add("frameContent", "collapsing");
    if (type === "section") content.classList.add("sectionContent");
    if (type === "article") content.classList.add("dailyContent");
    content.onmousedown = function(e) {
        //console.log("clickdown", this, e);
    };
    content.onmouseup = function(e) {
        //console.log("clickup", this, e);
    };


    var widthbar = document.createElement("footer");
    widthbar.classList.add("widthbar");


    header.appendChild(title);
    frame.label = title;
    // append timer
    //
    header.appendChild(button);
    frame.collapse = button;

    frame.appendChild(header);
    frame.header = header;
    frame.appendChild(content);
    frame.content = content;
    frame.appendChild(widthbar);
    frame.widthbar = widthbar;

    if (p.nodeContent !== undefined && p.nodeContent !== null) frame.content.appendChild(p.nodeContent);

    return frame;
}

/*
 * Driver function to create a section easier
 */
function createDailySection(p) {
    p.type = "section";

    return createDailyFrame(p);
}

function createCropButton(p) {
    var btn = document.createElement("button");
    copySharedProperties(p, btn);
    btn.classList.add("cropButton");

    var width = 80; if (p.width !== undefined) width = p.width;
    var height = 80; if (p.height !== undefined) height = p.height;
    var div = document.createElement("div");
    div.style.width = width + "px";
    div.style.height = height + "px";

    // prepare image
    var img = document.createElement("img");
    // start loading the image
    var url = ""; if (p.url !== undefined) url = p.url;
    img.src = url;
    var scale = 1.0; if (p.scale !== undefined) scale = p.scale;
    img.onload = function () {
        //console.log(url, this);
        this.width = Math.ceil(scale * this.naturalWidth);
        this.height = Math.ceil(scale * this.naturalHeight);
    };
    var xcenter = 0; if (p.xcenter !== undefined) xcenter = p.xcenter;
    var ycenter = 0; if (p.ycenter !== undefined) ycenter = p.ycenter;
    img.style.transform =
        "translate(" +
        -Math.round(scale * xcenter - (width / 2)) + "px" + "," +
        -Math.round(scale * ycenter - (height / 2)) + "px" +
        ")";

    div.appendChild(img);
    btn.appendChild(div);

    if (p.message !== undefined) {
        var para = document.createElement("p");
        para.appendChild(document.createTextNode(p.message));
        btn.appendChild(para);
    }

    return btn;

}

/*
 * Create an embed of a neopian wheel with proper offset and scale to fit the box
 */
function createWheel(url, wheelsize, xcen, ycen, id) {
    var frag = document.createDocumentFragment();

    var embed = document.createElement("embed");
    //attributes
    embed.setAttribute("src", url);
    if (arguments.length >= 4) {
        embed.setAttribute("id", id);
        embed.setAttribute("name", id);
    }

    var scalar = 300 / wheelsize;
    var width = Math.ceil(scalar * 800);
    var height = Math.ceil(scalar * 500);
    embed.setAttribute("width", width);
    embed.setAttribute("height", height);

    embed.setAttribute("quality", "high");
    embed.setAttribute("scale", "exactfit");
    embed.setAttribute("menu", "false");
    embed.setAttribute("allowscriptaccess", "never");
    embed.setAttribute("swliveconnect", "true");
    embed.setAttribute("wmode", "transparent");
    //flashvars
    embed.setAttribute(
        "flashvars",
        "host_url=" + encodeURIComponent("www.neopets.com") + "&" +
        "lang=en"
    );
    //translate
    var xmid = Math.round(scalar * xcen) - 150;
    var xoff = "-" + xmid + "px";
    var ymid = Math.round(scalar * ycen) - 150;
    var yoff = "-" + ymid + "px";
    embed.style.transform =
        "translate(" +
        xoff + ", " +
        yoff + ")";
    frag.appendChild(embed);

    if (WHEEL_ENABLE_MASK) {
        var image = document.createElement("img");
        image.setAttribute("src", MASKCIRCLE);
        image.setAttribute("class", "mask");
        frag.appendChild(image);
    }
    return frag;
}

// ========== Creation End

// ==================== Utility End



// ==================== Food Club Utilities ====================

// ===== String Utilities =====

String.prototype.textNode = function() {
    return document.createTextNode(this);
};

String.prototype.bold = function() {
    var b = document.createElement("b");
    b.appendChild(this.textNode());
    return b;
};

String.prototype.toTD = function() {
    var td = document.createElement("td");
    td.setAttribute("align", "center");
    td.appendChild(this.textNode());
    return td;
};

String.prototype.toBoldTD = function() {
    var td = document.createElement("td");
    td.setAttribute("align", "center");
    td.appendChild(this.bold());
    return td;
};


// ===== BetWrap =====

/*
 * Expose BetWrap to the developer console so i can test shit
 */
window.createBetWrap = function(table) {
    return new BetWrap(table);
};

/*
 * BetWrap Object, holds your bets and information about the set as a whole
 */
function BetWrap(table) {
    // handle missing new operator to avoid globals
    var cstr = BetWrap;
    var args = Array.prototype.slice.call(arguments);
    if (!(this instanceof cstr)) {
        args.unshift("");
        return new(Function.bind.apply(cstr, args));
    }

    // object initialization
    this.round = 0;
    this.numBets = 0;
    this.bets = [];
    this.maxAmount = 0;
    this.totalAmount = 0;
    this.totalOdds = 0;
    this.totalWinnings = 0;

    // use the parameters if there are any
    if (arguments.length > 0 && table !== "undefined") {
        this.parseBets(table);
    }

    this.updateInfo();

    return this;
}

/*
 * parse bets into this from a html string table
 * as long as the bets you're following copy their table right from
 * the food club page, this should work
 *
 * might update it for neodaq's thing too, no promises though
 */
BetWrap.prototype.parseBets = function(table) {
    var frag = fragmentize(table);

    var rows = Array.prototype.slice.call(frag.querySelectorAll("tr"));
    // rows [0] and [1] are the header and labels rows
    rows.shift();
    rows.shift();
    // rows [length] is the footer row
    rows.pop();

    while (rows[0] !== undefined) {
        this.bets.push(new Bet(rows.shift()));
    }

    return this;
};

/*
 * change the maximum np per bet to the given value
 * if a bet goes over a million, it will cap at just barely a million
 * so you only lose an odds worth of np, rather than some silly amount
 * (if your odds were 30:1, you lose some amount less than 30(in this case it's 20 np))
 */
BetWrap.prototype.changeNP = function(newnp) {
    try {
        for (var i in this.bets) if (this.bets[i] instanceof Bet) {
            var odds = parseInt(this.bets[i].odds);
            if (odds !== odds) throw new TypeError("odds NaN");
            //clamp the winnings to a million
            var result = parseInt(newnp);
            if (result * odds >= 1000000 + odds) {
                result = Math.ceil(1000000 / odds);
            }
            this.bets[i].amount = result;
            this.bets[i].winnings = Math.min(result * odds, 1000000);
        }
        this.maxAmount = parseInt(newnp);
    } catch (e) {
        console.error("Something went wrong setting the new np value:", e);
    }
    this.updateInfo();

    return this;
};

/*
 * fix all of the properties of this betwrap to accurately reflect the bets
 */
BetWrap.prototype.updateInfo = function() {
    var tnum = 0;
    var tamt = 0;
    var todd = 0;
    var twin = 0;

    for (var i in this.bets)
        if (this.bets[i] !== undefined && this.bets[i] instanceof Bet) {
            tnum++;
            tamt += this.bets[i].amount;
            todd += this.bets[i].odds;
            twin += this.bets[i].winnings;
        }

    if (this.bets[0] !== undefined) this.round = this.bets[0].round;
    this.numBets = tnum;
    this.totalAmount = tamt;
    this.totalOdds = todd;
    this.totalWinnings = twin;

    return this;
};

/*
 * turn the bets back into a table so you can put em somewhere
 * I might expand the functionality of this "bet editor" in the future but no promises
 */
BetWrap.prototype.toTable = function() {
    var table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "bets_table");
    table.setAttribute("cellpadding", "4");
    table.setAttribute("cellspacing", "2");
    table.setAttribute("width", "500");
    var tbody = document.createElement("tbody");

    // header row (rows[0])
    var thead = document.createElement("tr");
    var thcontent = document.createElement("td");
    thcontent.setAttribute("align", "center");
    thcontent.setAttribute("colspan", "5");
    var thfont = document.createElement("font");
    thfont.setAttribute("size", "4");
    thfont.setAttribute("color", "black");
    thfont.appendChild("Current Bets".bold());
    thcontent.appendChild(thfont);
    thead.appendChild(thcontent);
    tbody.appendChild(thead);

    // labels row (rows[1])
    var tlabel = document.createElement("tr");
    var labels = ["Round", "Bet Info", "Amount", "Odds", "Winnings"];
    for (var i in labels) if (labels[i].constructor.name === "String") {
        tlabel.appendChild(labels[i].toBoldTD());
    }
    tbody.appendChild(tlabel);

    // bet rows (potential up to rows[11])
    for (var b in this.bets) if (this.bets[b] instanceof Bet) {
        tbody.appendChild(this.bets[b].toTableRow());
    }

    // footer row (rows[rows.length-1])
    var tfoot = document.createElement("tr");
    if (this.bets.length !== 0) {
        var winlabel = document.createElement("td");
        winlabel.setAttribute("align", "right");
        winlabel.setAttribute("colspan", "4");
        winlabel.appendChild("Total Possible Winnings".bold());
        tfoot.appendChild(winlabel);
        tfoot.appendChild((this.totalWinnings + " NP").toBoldTD());
    } else {
        var errmsg = "You do not have any bets placed for this round!".toTD();
        errmsg.setAttribute("colspan", "5");
        tfoot.appendChild(errmsg);
    }
    tbody.appendChild(tfoot);

    table.appendChild(tbody);
    return table;
};

BetWrap.prototype.toButtonTable = function() {
    var table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "bets_table");
    table.setAttribute("cellpadding", "4");
    table.setAttribute("cellspacing", "2");
    table.setAttribute("width", "55");
    var tbody = document.createElement("tbody");

    // header row (rows[0])
    var thead = document.createElement("tr");
    var thcontent = document.createElement("td");
    thcontent.setAttribute("align", "center");
    var thfont = document.createElement("font");
    thfont.setAttribute("size", "4");
    thfont.setAttribute("color", "black");
    thfont.appendChild("Submit".bold());
    thcontent.appendChild(thfont);
    thead.appendChild(thcontent);
    tbody.appendChild(thead);

    // labels row (rows[1])
    var tlabel = document.createElement("tr");
    tlabel.appendChild(" ... ".toBoldTD());
    tbody.appendChild(tlabel);

    // bet rows (potential up to rows[11])
    for (var i in this.bets) if (this.bets[i] instanceof Bet) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.setAttribute("align", "center");
        var tinputs = this.bets[i].toInputsArray(parseInt(i) + 1);
        td.appendChild(createDailyForm({
            method: "POST",
            action: "http://www.neopets.com/pirates/process_foodclub.phtml",
            inputs: tinputs
        }));
        //"POST", "http://www.neopets.com/pirates/process_foodclub.phtml", this.bets[i].toInputsArray(parseInt(i) + 1);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    // footer row (rows[rows.length-1])
    var tfoot = document.createElement("tr");
    if (this.bets.length !== 0) {
        var winlabel = " ... ".toTD();
        tfoot.appendChild(winlabel);
    } else {
        var errmsg = "No Bets.".toTD();
        tfoot.appendChild(errmsg);
    }
    tbody.appendChild(tfoot);

    table.appendChild(tbody);
    return table;
};

// ===== Bet =====

/*
 * Bet Object, holds information about a single bet
 */
function Bet(row) {
    // handle missing new operator to avoid globals
    var cstr = Bet;
    var args = Array.prototype.slice.call(arguments);
    if (!(this instanceof cstr)) {
        args.unshift("");
        return new(Function.bind.apply(cstr, args));
    }

    // object initialization
    this.round = 0;
    this.betInfo = {
        "Shipwreck": "",
        "Lagoon": "",
        "Treasure Island": "",
        "Hidden Cove": "",
        "Harpoon Harry's": ""
    };
    this.betInfoIds = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };
    this.amount = 0;
    this.odds = 0;
    this.winnings = 0;

    // use the parameters if there are any
    if (arguments.length > 0 && typeof row !== "undefined") {
        this.parseRow(row);
    }

    return this;
}

/*
 * Parse a single table row into information for this bet
 */
Bet.prototype.parseRow = function(row) {
    // Round
    this.round = parseInt(row.childNodes[0].textContent);
    // Bet Info
    this.parsePirates(row);
    // Amount
    this.amount = parseInt(row.childNodes[2].textContent);
    // Odds
    this.odds = parseInt(row.childNodes[3].textContent);
    // Winnings
    this.winnings = parseInt(row.childNodes[4].textContent);

    return this;
};

/*
 * take the string from the table div and extract the pirate and arena info
 * this is a subroutine of parseRow
 */
Bet.prototype.parsePirates = function(row) {
    var str = row.childNodes[1].innerHTML;
    str = str.replace(/<[^]*?>/igm, " ");
    str = str.trim();
    var ary = str.split("  ");

    for (var i in ary) if (ary[i].constructor.name === "String") {
        var pair = ary[i].split(" : ");
        this.betInfo[pair[0]] = pair[1];
        this.betInfoIds[dailies.arenas.indexOf(pair[0])] = dailies.pirates.indexOf(pair[1]);
    }

    return this;
};

/*
 * turns the information for this bet into an input array to be used in createDailyForm
 */
Bet.prototype.toInputsArray = function(n) {
    var ary = [];
    ary.push({
        type: "hidden",
        name: "type",
        value: "bet"
    }, {
        type: "hidden",
        name: "bet_amount",
        value: String(this.amount)
    }, {
        type: "hidden",
        name: "total_odds",
        value: String(this.odds)
    }, {
        type: "hidden",
        name: "winnings",
        value: String(this.winnings)
    });

    for (var i in this.betInfoIds) {
        if (this.betInfoIds[i] !== 0) {
            ary.push({
                type: "hidden",
                name: "matches[]",
                value: i
            }, {
                type: "hidden",
                name: "winner" + i,
                value: this.betInfoIds[i]
            });
        }
    }

    ary.push({
        content: (function() {
            var btn = document.createElement("button");
            btn.setAttribute("type", "submit");
            btn.appendChild(("Submit #" + n).textNode());
            return btn;
        })()
    });

    return ary;
};

/*
 * turns this bet back into a table row so it can be put back
 * into the big table with all of the bets
 */
Bet.prototype.toTableRow = function() {
    var row = document.createElement("tr");
    // Round
    row.appendChild(String(this.round).toBoldTD());
    // Bet Info
    row.appendChild(this.getBetInfo());
    // Amount
    row.appendChild((this.amount + " NP").toTD());
    // Odds
    row.appendChild((this.odds + ":1").toTD());
    // Winnings
    row.appendChild((this.winnings + " NP").toTD());

    return row;
};

/*
 * builds a table div out of the arena and pirate information
 * subroutine of toTableRow
 */
Bet.prototype.getBetInfo = function() {
    var tdbet = document.createElement("td");
    for (var i in this.betInfoIds) {
        if (this.betInfoIds[i] !== 0) {
            var arena = dailies.arenas[i];
            var pirate = dailies.pirates[this.betInfoIds[i]];
            // <b>Arena's Name</b>
            tdbet.appendChild(arena.bold());
            // ": Pirate's Name"
            tdbet.appendChild(document.createTextNode(": " + pirate));
            // <br>
            tdbet.appendChild(document.createElement("br"));
        }
    }

    return tdbet;
};

// ==================== Food Club Functions End



// ==================== Initialization ====================

//change the page title so it's not an ugly "neopets 404"
window.setTimeout(function(){document.title = "Neopets - Dailies";}, 1000);

/*
window.onbeforeunload = function(e) {
    e.returnValue = "Page redirected, was this what you wanted?";
    return dialogText;
};
*/

//create the page's extra style
var injectstyle = document.createElement("style");
injectstyle.setAttribute("type", "text/css");
injectstyle.setAttribute("id", "dailies_style");
injectstyle.appendChild(document.createTextNode(DAILYSTYLE));

document.head.appendChild(injectstyle);

/**
template = document.createElement("template");
article = document.createElement("article");
*/


if (!window.pets_parse) window.pets_parse = {};

if (!window.dailies) window.dailies = {
    pets: [
        //gets filled later
    ],

    // id: http://pets.neopets.com/cp/[id]/[mood]/[size].png
    // name: http://pets.neopets.com/cpn/[name]/[mood]/[size].png

    moods: {
        "ihavenomouthandimustscream":   "0",
        "happy":                        "1",
        "sad":                          "2",
        "angry":                        "3",
        "sick":                         "4",
    },

    sizes: {
        "face50":                       "1",
        "full150":                      "2",
        "bust80":                       "3",
        "full300":                      "4",
        "full500":                      "5",
        "face150":                      "6",
        "full640":                      "7"
    },

    arenas: [
        // 0 isn't valid
        "\0",
        // 1:
        "Shipwreck",
        // 2:
        "Lagoon",
        // 3:
        "Treasure Island",
        // 4:
        "Hidden Cove",
        // 5:
        "Harpoon Harry's",
    ],

    pirates: [
        // 0 isn't valid
        "\0",
        // 1:
        "Scurvy Dan the Blade",
        // 2:
        "Young Sproggie",
        // 3:
        "Orvinn the First Mate",
        // 4:
        "Lucky McKyriggan",
        // 5:
        "Sir Edmund Ogletree",
        // 6:
        "Peg Leg Percival",
        // 7:
        "Bonnie Pip Culliford",
        // 8:
        "Puffo the Waister",
        // 9:
        "Stuff-A-Roo",
        // 10:
        "Squire Venable",
        // 11:
        "Captain Crossblades",
        // 12:
        "Ol' Stripey",
        // 13:
        "Ned the Skipper",
        // 14:
        "Fairfax the Deckhand",
        // 15:
        "Gooblah the Grarrl",
        // 16:
        "Franchisco Corvallio",
        // 17:
        "Federismo Corvallio",
        // 18:
        "Admiral Blackbeard",
        // 19:
        "Buck Cutlass",
        // 20:
        "The Tailhook Kid"
    ],

    createPetImageUrl: function(id, mood, size, petname) {
        var url =
            "http://pets.neopets.com/cp" +
            "/" + id +
            "/" + dailies.moods[mood] +
            "/" + dailies.sizes[size] +
            ".png";

        return url;
    },

    createPetImage: function(id, mood, size, petname) {
        var img = document.createElement("img");

        img.setAttribute("src", dailies.createPetImageUrl(id, mood, size, petname));
        img.setAttribute("alt", petname);
        img.setAttribute("title", petname);

        return img;
    },

    createPetPreview: function(pet, size) {
        var tsize = "300";
        if (arguments.length >= 2) tsize = String(size);
        var embed = document.createElement("embed");
        embed.setAttribute("type", "application/x-shockwave-flash");
        embed.setAttribute("src", "http://images.neopets.com/customise/customNeopetViewer_v35.swf");
        embed.setAttribute("class", "CustomNeopetView");
        embed.setAttribute("name", "CustomNeopetView");
        embed.setAttribute("title", pet);
        embed.setAttribute("width", tsize);
        embed.setAttribute("height", tsize);
        embed.setAttribute("bgcolor", "white");
        embed.setAttribute("quality", "high");
        embed.setAttribute("scale", "showall");
        embed.setAttribute("menu", "false");
        embed.setAttribute("allowscriptaccess", "always");
        embed.setAttribute("swliveconnect", "true");
        embed.setAttribute("wmode", "transparent");

        embed.setAttribute(
            "FlashVars",
            "webServer="    + encodeURIComponent("http://www.neopets.com")                      + "&" +
            "imageServer="  + encodeURIComponent("http://images.neopets.com")                   + "&" +
            "gatewayURL="   + encodeURIComponent("http://www.neopets.com/amfphp/gateway.php")   + "&" +
            "pet_name="     + pet + "&" +
            "lang=en"             + "&" +
            "pet_slot="
        );

        return embed;
    }


};

// ==================== Init End



// ==================== Main Program ====================

// Neopets' main content table, we'll fill this up
var TableContent = document.querySelector("td.content");
// baleet all the shit inside so we can replace it
try { while (TableContent.firstChild) {
    TableContent.removeChild(TableContent.firstChild);
}}
catch(e) {
    // I can't remember why this is in a try catch block, but I think I wanted to avoid it erroring if there were no children
}

var frag = document.createDocumentFragment();

var DailiesSection = createDailySection({titleText: "Dailies", id: "DailiesSection"});
var DailiesContent = DailiesSection.content;
frag.appendChild(DailiesSection);

var EmbedsSection = createDailySection({titleText: "Embeds & iFrames", id: "EmbedsSection"});
var EmbedsContent = EmbedsSection.content;
frag.appendChild(EmbedsSection);

var UtilsSection = createDailySection({titleText: "Utilities", id: "UtilsSection"});
var UtilsContent = UtilsSection.content;
frag.appendChild(UtilsSection);

if (ALLOW_NOTES) {
    var NotesSection = createDailySection({titleText: "Notes", id: "NotesSection", className: "startCollapsed"});
    var NotesContent = NotesSection.content;
    frag.appendChild(NotesSection);
}

if (ALLOW_PET_TESTS) {
    var PetsSection = createDailySection({titleText: "Pets", id: "PetsSection", className: "startCollapsed"});
    var PetsContent = PetsSection.content;
    frag.appendChild(PetsSection);
}

TableContent.appendChild(frag);


window.setTimeout(function(){
    document.querySelectorAll(".startCollapsed").forEach(r=>{hideContent(r.collapse);});
}, 1000);



getPage("http://www.neopets.com/quickref.phtml").then(
    function(result) {
        parsePets(result);
    },
    function(result){
        PetsContent.appendChild(document.createTextNode("An Error Occurred getting pet information, some dailies may not work"));
        Promise.resolve(result);
    })
    .then(function(){
    /*
    // ========================================
    // ========== Create The Dailies ==========
    // ========================================
    */

    // ===== Dailies =====
    prepAppends([

        promiseAnchorMgmt(),

        promiseAppleBobbing(),

        promiseColtzanShrine(),

        promiseForgottenShore(),

        promiseFruitMachine(),

        promiseHealingSprings()



    ], DailiesContent);
    // ===== Dailies End

    // ===== Utilities =====
    prepAppends([

        promiseShopTill(),

        promiseFishing(),

        promiseParseBets(),

        promiseQuickLodge()

    ], UtilsContent);
    // ===== Utilities End

    // ===== Embeds and iFrames =====
    prepAppends([
        // ===== Wheels =====
        //Excitement
        promiseWheelExcitement(),
        //Extravagance
        promiseWheelExtravagance(),
        //Knowledge
        promiseWheelKnowledge(),
        //Mediocrity
        promiseWheelMediocrity(),
        //Misfortune
        promiseWheelMisfortune(),
        //Monotony
        promiseWheelMonotony(),
        // ===== Wheels End

        // ===== Qasalan Expellibox =====
        promiseExpellibox(),

        // ===== Trudy's surprise
        promiseTrudyDaily()

    ], EmbedsContent)
        .then(function(){
        if (START_FLASH_HIDDEN)
            EmbedsContent.querySelectorAll(".flash").forEach(r=>{hideContent(r.collapse);});
    });
    // ===== Embeds End

    // ===== Notes =====
    if (ALLOW_NOTES) prepAppends([
        // Brainstorming
        promiseNotesBrain(),

        // Dailies
        promiseNotesDailies()

    ], NotesContent);
    // ===== Notes End

    // ===== Pets Tests =====
    if (ALLOW_PET_TESTS) prepAppends([

        promisePetTests()

    ], PetsContent);
    // ===== Pets End

});

// ===== Daily Promise Functions =====

// TODO: move all daily creation content here, it's ugly where it is
// also here I can put nice descriptions on

// ===== [Dailies] =====

/*
 * daily for anchor management
 * it needs to getpage to find the unique id, for some reason
 * if it fails to get it, it will create a different button image
 * if there's a different error, it should make an error box
 */
function promiseAnchorMgmt() {
    return (
        getPage("http://www.neopets.com/pirates/anchormanagement.phtml")
        .then(function(r){
            var uid;
            try {
                uid = /<form method=["']post["'] id=["']form-fire-cannon["']>[^]*?<input[^]*?value=["']([\w\d]+)["'][^]*?><\/form>/igm.exec(r)[1];
            } catch(e) {
                return Promise.reject("already");
            }
            var inputs = [
                {
                    type: "hidden",
                    name: "action",
                    value: uid
                },
                {
                    content: createCropButton({
                        url: "http://images.neopets.com/pirates/disappearance/anchor/h43y27.jpg",
                        scale: (80/150),
                        xcenter: 235,
                        ycenter: 187,
                        width: 160,
                        height: 80,
                        message: "Fire!!!"
                    })
                }
            ];

            return createDailyFrame({
                titleText: "Anchor Management",
                titleUrl: "http://www.neopets.com/pirates/anchormanagement.phtml",
                id: "anchormgmt",
                className: "daily box half centers",
                nodeContent: createDailyForm({
                    method: "POST",
                    action: "http://www.neopets.com/pirates/anchormanagement.phtml",
                    inputs: inputs,
                    id: "anchorman_form"
                })
            });
        }).catch(function(r){
            if (r === "already") {
                var inputs = [
                    {
                        content: createCropButton({
                            url: "http://images.neopets.com/pirates/disappearance/anchor/ju6b7n.jpg",
                            scale: (160/636),
                            xcenter: 318,
                            ycenter: 175,
                            width: 160,
                            height: 80,
                            message: "Already Fired..."
                        })
                    }
                ];
                return createDailyFrame({
                    titleText: "Anchor Management",
                    titleUrl: "http://www.neopets.com/pirates/anchormanagement.phtml",
                    id: "anchormgmt",
                    className: "daily box half centers",
                    nodeContent: createDailyForm({
                        method: "GET",
                        action: "",
                        inputs: inputs,
                        id: "anchorman_form"
                    })
                });
            } else {
                return createDailyFrame({
                    titleText: "Anchor Management",
                    titleUrl: "http://www.neopets.com/pirates/anchormanagement.phtml",
                    id: "anchormgmt",
                    className: "daily box half centers",
                    nodeContent: fragmentize("There was an unknown error")
                });
            }
        })
    );
}

/*
 *
 */
function promiseAppleBobbing() {
    return (
        Promise.resolve()
        .then(function(){
            return (
                createDailyFrame({
                    titleText: "Apple Bobbing",
                    titleUrl: "http://www.neopets.com/halloween/applebobbing.phtml",
                    id: "apple_bob",
                    className: "daily box half centers",
                    nodeContent: createDailyForm({
                        // method is get by default
                        action: "http://www.neopets.com/halloween/applebobbing.phtml",
                        inputs: [
                            {
                                type: "hidden",
                                name: "bobbing",
                                value: "1"
                            }
                        ],
                        // inputs end
                        button: createCropButton({
                            type: "submit",
                            url: "http://images.neopets.com/halloween/applebob/bg.jpg",
                            scale: (80 / 130),
                            xcenter: 150,
                            ycenter: 111,
                            width: 160,
                            height: 80,
                            message: "Bob for Apples"
                        })
                        // button end
                    })
                })
            );
            // return end
        })
        // then end
    );
}

function promiseColtzanShrine() {
    return (
        Promise.resolve()
        .then(function(){
            var button = createCropButton({
                url: "http://images.neopets.com/desert/shrine_scene.gif",
                scale: (80/280),
                xcenter: 313,
                ycenter: 146,
                width: 160,
                type: "submit",
                name: "type",
                value: "approach",
                message: "Approach the Shrine"
            });
            var form = createDailyForm({
                method: "POST",
                action: "http://www.neopets.com/desert/shrine.phtml",
                button: button
            });
            return (
                createDailyFrame({
                    titleText: "Coltzan's Shrine",
                    titleUrl: "http://www.neopets.com/desert/shrine.phtml",
                    id: "czan_shrine",
                    className: "daily box half centers",
                    nodeContent: form
                })
            );
        })
    );
}

function promiseForgottenShore() {
    return (
        getPage("http://www.neopets.com/pirates/forgottenshore.phtml")
        .then(function(r){
            try {
                var ref_ck = /_ref_ck=([\w\d]*)/igm.exec(r);

                if (ref_ck === null) {
                    // was not able to find the id

                    // Located about 80 miles south of Mystery Island, Krawk Island was originally a cluster of smaller islands...
                    if (/Mystery Island/igm.exec(r) !== null)
                        return Promise.reject("nomap");
                    // A deserted shore stretches along in front of you, but there's nothing of interest to be found today.
                    else if (/nothing of interest/igm.exec(r) !== null)
                        return Promise.reject("none");
                    // You've already searched the coast for treasure today. Perhaps you should try again tomorrow.
                    else if (/already searched the coast/igm.exec(r) !== null)
                        return Promise.reject("already");
                    // unknown error
                    else
                        return Promise.reject("DEFAULT");
                } else {
                    // was able to find the id

                    var uid = ref_ck[1];
                    var inputs = [
                        {
                            type: "hidden",
                            name: "confirm",
                            value: "1"
                        },
                        {
                            type: "hidden",
                            name: "_ref_ck",
                            value: uid
                        }
                    ];

                    var buttons = {
                        // default scale of 1 and height of 80 for all
                        shore_back: {
                            xcenter: 300,
                            ycenter: 350,
                            width: 160
                        },
                        shore_np: {
                            xcenter: 300,
                            ycenter: 254,
                            width: 160,
                            message: "Found NeoPoints!"
                        },
                        shore_chest: {
                            xcenter: 498,
                            ycenter: 230,
                            width: 160,
                            message: "Found Chest!"
                        },
                        shore_sand: {
                            xcenter: 383,
                            ycenter: 189,
                            width: 160,
                            message: "Found Treasure!"
                        },
                        shore_shiny: {
                            xcenter: 93,
                            ycenter: 261,
                            width: 160,
                            message: "Found Jewelery!"
                        },
                        shore_coin: {
                            xcenter: 148,
                            ycenter: 215,
                            width: 160,
                            message: "Found Coin!"
                        }
                    };
                    var re = /#(shore_\w*) {[^]*?background: url\(([^]*?)\)[^]*?}/igm;
                    var str = r;
                    var item;
                    while ((item = re.exec(r)) !== null) {
                        buttons[item[1]].url = item[2];
                    }
                    console.log("buttons:", buttons);
                    var current = /id=["'](shore_(?!back)\w*)["']/igm.exec(r)[1];
                    console.log("current:", current);

                    var button = createCropButton(buttons[current]);
                    copySharedProperties(
                        {
                            backgroundImage: "url(" + buttons.shore_back.url + ")",
                            backgroundRepeat: "no-repeat",
                            backgroundPositionX: -((buttons[current].xcenter) - (160 / 2)) + "px",
                            backgroundPositionY: -((buttons[current].ycenter) - (80 / 2)) + "px",
                            backgroundSizeX: "600px",
                            backgroundSizeY: "500px"
                        },
                        button.firstChild.style
                    );
                    console.log(button);
                    return Promise.resolve(createDailyForm({
                        // method get
                        action: "http://www.neopets.com/pirates/forgottenshore.phtml",
                        inputs: inputs,
                        button: button
                    }));
                }

            } catch (e) {
                // some weird shit happened anyway
                return Promise.reject("DEFAULT");
            }
        })
        .catch(function(r){
            var button;
            if (r === "nomap") {
                return Promise.resolve(fragmentize("You do not have the map! (buy it, it's like under 5000 np for the whole set)"));
            } else if (r === "none") {
                button = createCropButton({
                    type: "submit",
                    url: "http://images.neopets.com/pirates/forgottenshore/hc4u1s.jpg",
                    scale: (160/600),
                    xcenter: 300,
                    ycenter: 350,
                    width: 160,
                    height: 80,
                    message: "Nothing of Interest..."
                });
                return Promise.resolve(
                    createDailyForm({
                        // method get by default
                        action: "http://www.neopets.com/pirates/forgottenshore.phtml",
                        button: button
                    })
                );
            } else if (r === "already") {
                button = createCropButton({
                    type: "submit",
                    url: "http://images.neopets.com/pirates/forgottenshore/hc4u1s.jpg",
                    scale: (160/600),
                    xcenter: 300,
                    ycenter: 350,
                    width: 160,
                    height: 80,
                    message: "Already Checked..."
                });
                return Promise.resolve(
                    createDailyForm({
                        // method get by default
                        action: "http://www.neopets.com/pirates/forgottenshore.phtml",
                        button: button
                    })
                );
            } else {
                return Promise.resolve(fragmentize("There was an unknown error."));
            }
        })
        .then(function(r){
            return createDailyFrame({
                titleText: "Forgotten Shore",
                titleUrl: "http://www.neopets.com/pirates/forgottenshore.phtml",
                id: "forgotshore",
                className: "daily box half centers",
                nodeContent: r
            });
        })
    );
}

function promiseFruitMachine() {
    var buttons = {
        aisha: {
            type: "submit",
            url: "http://images.neopets.com/desert/fruit/bg.jpg",
            scale: 1.0,
            xcenter: 104,
            ycenter: 117,
            width: 160
        },
        kau: {
            type: "submit",
            url: "http://images.neopets.com/desert/fruit/bg.jpg",
            scale: (80/90),
            xcenter: 281,
            ycenter: 174,
            width: 160
        },
        lupe: {
            type: "submit",
            url: "http://images.neopets.com/desert/fruit/bg.jpg",
            scale: 1.0,
            xcenter: 484,
            ycenter: 129,
            width: 160
        }
    };
    return (
        getPage("http://www.neopets.com/desert/fruit/index.phtml")
        .then(function(r){
            try {
                var value = /name=['"]ck['"] value=['"]([\w\d]*?)['"]/igm.exec(r)[1];
                console.debug(value);
                var submit = buttons.lupe;
                submit.message = "Spin, spin, spin!";
                var form = createDailyForm({
                    method: "POST",
                    action: "http://www.neopets.com/desert/fruit/index.phtml",
                    inputs: [
                        {
                            type: "hidden",
                            name: "spin",
                            value: "1"
                        },
                        {
                            type: "hidden",
                            name: "ck",
                            value: value
                        }
                    ],
                    button: createCropButton(buttons.lupe)
                });
                return Promise.resolve(form);
            } catch (e) {
                return Promise.reject("already");
            }
        })
        .catch(function(r){
            if (r === "already") {
                var err = buttons.kau;
                err.message = "Already Spun...";
                return Promise.resolve(createDailyForm({
                    action: "http://www.neopets.com/desert/fruit/index.phtml",
                    button: createCropButton(buttons.kau)
                }));
            } else {
                return Promise.resolve(fragmentize("There was an unknown error."));
            }

        })
        .then(function(r){
            return createDailyFrame({
                titleText: "Fruit Machine",
                titleUrl: "http://www.neopets.com/desert/fruit/index.phtml",
                id: "fruitmachine",
                className: "daily box half centers",
                nodeContent: r
            });
        })
    );
}

function promiseHealingSprings() {
    return (
        Promise.resolve()
        .then(function(){
            return (
                createDailyFrame({
                    titleText: "Healing Springs",
                    titleUrl: "http://www.neopets.com/faerieland/springs.phtml",
                    id: "h_springs",
                    className: "box half justify",
                    // content
                    nodeContent: createDailyForm({
                        method: "POST",
                        action: "http://www.neopets.com/faerieland/springs.phtml",
                        inputs: [
                            /*
                                I wrapped the following functions like (...)() so that I could just insert them inline here
                                it's exactly the same format as this: [ { content: nodeobject }, { content: nodeobject } ]
                                */

                            // Heal My Pets!
                            {
                                content: createCropButton({
                                    type: "submit",
                                    name: "type",
                                    value: "heal",
                                    url: "http://images.neopets.com/faerieland/springs1.gif",
                                    scale: (80 / 150), //scale
                                    xcenter: 154,
                                    ycenter: 81,
                                    // default width and height of 80
                                    message: "Heal Pets"
                                })
                            },
                            // See what is for sale
                            {
                                content: createCropButton({
                                    type: "submit",
                                    name: "type",
                                    value: "purchase",
                                    url: "http://images.neopets.com/faerieland/springs3.gif",
                                    // default scale of 1.0
                                    xcenter: 260,
                                    ycenter: 45,
                                    // default width and height of 80
                                    message: "Browse Shop"
                                })
                            }
                        ],
                        id: "h_springs_form"
                    })
                    // content end
                })
            );
        })
    );
}

// ===== [Utilities] =====

/*
 * TODO: fix this horrible MESS
 */
function promiseShopTill() {

    return (
        getPage("http://www.neopets.com/market.phtml?type=till")
        .then(function(r){

            if (/You don't have your own shop yet/igm.exec(r) !== null) return Promise.reject("noshop");
            var nps;
            try {
                nps = /You currently have <b>(\d*?) NP<\/b> in your till./.exec(r)[1];
            } catch(e) {
                return promise.reject();
            }
            /*
            var frag = document.createDocumentFragment();

            // Create the two input boxes
            var amt = createInput({
                type: "text",
                name: "amount",
                id: "amt_field",
                size: "9",
                maxlength: "10",
                placeholder: "Amount"
            });
            copySharedProperties(
                {
                    textAlign: "right",
                    paddingRight: "0.5em"
                },
                amt.style
            );

            var pin = createInput({
                type: "password",
                name: "pin",
                id: "pin_field",
                size: "2",
                maxlength: "4",
                placeholder: "PIN"
            });
            copySharedProperties(
                {
                    textAlign: "center"
                },
                pin.style
            );
            // input boxzes end

            var inputs = [
                {
                    element: "p",
                    type: "",
                    innerHTML: "You currently have <b>" + nps + " NP</b> in your till."
                },
                {
                    content: document.createElement("br")
                },
                {
                    type: "hidden",
                    name: "type",
                    value: "withdraw"
                },
                {
                    content: amt
                },
                {
                    content: pin
                },
                {
                    content: document.createElement("br")
                },
                {
                    element: "button",
                    type: "button",
                    innerHTML: "Collect Till"
                }
            ];

            var form = createDailyForm({
                method: "POST",
                action: "http://www.neopets.com/process_market.phtml",
                target: "ShopTill",
                inputs: inputs
                /*
                button: createInput({
                    element: "button",
                    type: "button",
                    name: "amount",
                    value: nps,
                    innerHTML: "Collect All"
                })

            });

            form.querySelectorAll("button").forEach((item,i) => {

                item.onclick = function(){
                    window.wind = window.open("http://www.neopets.com/market.phtml?type=till", "ShopTill");
                    var myform = this.form;
                    var mycon = console;
                    console.debug("Windywind:", wind);
                    wind.onload = ((i)=>{
                        console.log("loaded");
                        var form = window.wind.document.querySelector("form");
                        console.log(form).bind(mycon);
                        form.amt_field = form.querySelector("input[name='pwd']");
                        form.amt_field.value = myform.amt_field.value;
                        //form.pin_field = form.pin_field;
                        form.pin_field.value = myform.pin_field.value;

                        form.submit();
                    });
                    /*
                    console.log(this.form);
                    wind.form = this.form.cloneNode(true);
                    wind.form.target = "_self";
                    console.log(wind.form);
                    window.setTimeout(((i)=>{this.form.submit();}).bind(wind), 500);

                };
            });
*/
            var frag = document.createDocumentFragment();
            var form = document.createElement("iframe");
            var div = document.createElement("div");
            form.src = "http://www.neopets.com/market.phtml?type=till";
            var xpos;
            var ypos;
            form.onload = function(v) {
                var iform = this.contentDocument.querySelector("form");

                iform.scrollIntoView();


                this.contentDocument.body.style.position = "absolute";
                this.contentDocument.body.style.left = "-438px";
                

            }.bind(form, [nps]);
            form.scrolling = "no";
            var p = document.createElement("p");
            form.style.border = "0";

            div.appendChild(form);
            frag.appendChild(div);


            p.innerHTML = "You currently have <b>" + nps + " NP</b> in your till.";
            p.style.position = "absolute";
            p.style.left = "0px";
            p.style.top = "0px";
            p.style.margin = "0";
            frag.appendChild(p);
            //frag.appendChild(document.createElement("br"));

            return Promise.resolve(frag);
        })
        .catch(function(r){
            var result;
            if (r === "noshop") {
                result = "You don't have a shop!";
            } else {
                result = "There was an unknown error...";
            }
            return (
                Promise.resolve(fragmentize(result))
            );
        })
        .then(function(r){
            return createDailyFrame({
                titleText: "Shop Till",
                titleUrl: "http://www.neopets.com/market.phtml?type=till",
                id: "shoptill",
                className: "util box half centers till",
                nodeContent: r
            });
        })
    );
}

/*
 * Food Club Parse
 * this daily has a textbox that you paste a html table of someone's bets into
 * it parses the bets and sets them to your maximum bet amount automatically
 * then it puts the table up with submit buttons to let you make the bets too
 */
function promiseParseBets() {
    return (
        // ===== Food Club Parse =====
        getPage("http://www.neopets.com/pirates/foodclub.phtml?type=bet")
        .then(function(r) {
            try {
                var mymaxnp = /You can only place up to <b>(\d*?)<\/b> NeoPoints per bet/.exec(r)[1];
            } catch(e) {
                return Promise.reject("closed");
            }
            var inputs = [
                {
                    element: "textarea",
                    id: "strip"
                },
                {
                    content: document.createElement("br")
                },
                {
                    content: (function(){
                        var btn = document.createElement("button");
                        btn.setAttribute("type", "button");
                        btn.onclick = function() {
                            var mybets = createBetWrap(this.form.strip.value);
                            mybets.changeNP(mymaxnp);
                            this.form.parentNode.parentNode.MyBets = mybets;
                            this.form.parentNode.parentNode.updateTables();
                        };
                        btn.appendChild(document.createTextNode("Parse this Table"));

                        return btn;
                    })()
                },
                {
                    content: (function(){
                        var div = document.createElement("div");
                        div.setAttribute("class", "fc_tables");
                        return div;
                    })()
                }
            ];
            var form = createDailyForm({
                method: "GET",
                inputs: inputs,
                id: "parse_form"
            });
            var fc = createDailyFrame({
                titleText: "Quick Food Club",
                id: "parse_bets",
                className: "daily wide large centers",
                nodeContent: form
            });
            fc.content.updateTables = function() {
                var target = this.querySelector(".fc_tables");
                if (target !== undefined && target !== null)
                    while(target.firstChild !== undefined && target.firstChild !== null)
                        target.removeChild(target.firstChild);
                target.appendChild(this.MyBets.toTable());
                target.appendChild(this.MyBets.toButtonTable());
            };

            return fc;
        })
        .catch(function(r){
            var msg;
            if (r === "closed") {
                msg = fragmentize("The betting gates are closed. Come back later and refresh to bet again.");
            } else {
                msg = fragmentize("An Unknown error occurred");
            }
            return (
                createDailyFrame({
                    titleText: "Quick Food Club",
                    titleUrl: "http://www.neopets.com/pirates/foodclub.phtml?type=bet",
                    id: "parse_bets",
                    className: "daily wide large centers",
                    nodeContent: msg
                })
            );
        })
    );
}

/*
 * creates a daily with buttons for each pet
 * it changes to that pet and pulls their line in 1/2 second
 * sometimes it doesn't work because of slow connection
 * but it's even slower if I make it wait until the response has fully loaded :(
 * so sometimes you might have to fish the same pet again because it didn't work the first time
 */
function promiseFishing() {
    return (
        // ===== Fishing
        Promise.resolve()
        .then(function(r){
            var frag = document.createDocumentFragment();

            var div = document.createElement("div");
            div.setAttribute("class", "justifyContainer");

            var form = document.createElement("form");
            form.setAttribute("action", "http://www.neopets.com/water/fishing.phtml");
            form.setAttribute("method", "POST");
            form.setAttribute("target", "_blank");

            var input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", "go_fish");
            input.setAttribute("value", "1");
            form.appendChild(input);

            div.appendChild(form);
            frag.appendChild(div);

            dailies.pets.forEach((pet, i) => {
                //create button
                var buton = document.createElement("button");
                buton.setAttribute("title", pet.name);
                //button chitlens
                buton.appendChild(window.dailies.createPetImage(pet.id, "happy", "bust80", pet.name));
                var pg = document.createElement("p");
                pg.appendChild(document.createTextNode("Go Fish!"));
                buton.appendChild(pg);
                //set button attribs
                buton.setAttribute("type", "button");
                buton.setAttribute("class", "go_fish " + pet.name + " fish_" + pet.name);
                buton.dataset.index = i;
                buton.onclick = function() {
                    var context = this;
                    getPage("http://www.neopets.com/process_changepet.phtml?new_active_pet=" + window.dailies.pets[this.dataset.index].name
                           ).then(window.setTimeout(function(){context.form.submit();}, 500));
                };

                form.appendChild(buton);
                form.appendChild(document.createTextNode(" "));
            });
            var fishing = createDailyFrame({
                titleText: "Ye Olde Fishing Vortex",
                titleUrl: "http://www.neopets.com/water/fishing.phtml",
                id: "fishing",
                className: "daily wide half justify",
                nodeContent: frag
            });

            return fishing;
        })
        // ===== Fishing End
    );
}

/*
 * Creates a daily with buttons for each of your pets
 * automatically books your pet for the maximum length stay for the minimum amount of money
 * (5np cockroach towers * 28 days)
 */
function promiseQuickLodge() {
    return (
        // ===== Neolodge
        Promise.resolve()
        .then(function(r) {
            var inputs = [];
            inputs.push.apply(inputs, [
                {
                    type: "hidden",
                    name: "hotel_rate",
                    value: "5"
                },
                {
                    type: "hidden",
                    name: "nights",
                    value: "28"
                }
            ]);
            dailies.pets.forEach((pet, i) => {
                // create button
                var buton = document.createElement("button");
                buton.setAttribute("title", pet.name);
                //button chitlens
                buton.appendChild(window.dailies.createPetImage(pet.id, "happy", "bust80", pet.name));
                var pg = document.createElement("p");
                pg.appendChild(document.createTextNode("Book Stay!"));
                buton.appendChild(pg);
                //button attribs
                buton.setAttribute("type", "submit");
                buton.setAttribute("name", "pet_name");
                buton.setAttribute("value", pet.name);

                inputs.push({
                    content: buton
                });
            });
            var form = createDailyForm({
                method: "POST",
                action: "http://www.neopets.com/book_neolodge.phtml",
                inputs: inputs,
                id: "lodge_form"
            });
            return createDailyFrame({
                titleText: "Quick Neolodge",
                titleUrl: "http://www.neopets.com/neolodge.phtml",
                id: "lodge",
                className: "daily wide half justify",
                nodeContent: form
            });
        })
        // ===== Neolodge End
    );
}

// ===== [Wheels] =====
function promiseWheelExcitement() {
    return (
        // Excitement
        Promise.resolve(createWheel("http://images.neopets.com/wheels/wheel_of_excitement_v3_831fbec8f8.swf?r=564743181", 352, 558, 258, "flash_32139696264"))
        .then(function(r){
            return createDailyFrame({
                titleText: "Wheel of Excitement",
                titleUrl: "http://www.neopets.com/faerieland/wheel.phtml",
                id: "wheel_exc",
                className: "daily box wheel flash" + (START_FLASH_HIDDEN ? " startCollapsed" : ""),
                nodeContent: r
            });
        })
    );
}

function promiseWheelExtravagance() {
    return (
        // Extravagance
        (WHEEL_ALLOW_EXT ? // This wheel is expensive and dangerous, I've given the option to disable it
         Promise.resolve(createWheel("http://images.neopets.com/wheels/wheel_of_extravagance_v1_5dd2d07006.swf?r=892962206", 325, 540, 240, "flash_15132567672"))
         .then(function(r){
            return createDailyFrame({
                titleText: "Wheel of Extravagance",
                titleUrl: "http://www.neopets.com/desert/extravagance.phtml",
                id: "wheel_ext",
                className: "daily box wheel flash" + (START_FLASH_HIDDEN ? " startCollapsed" : ""),
                nodeContent: r
            });
        })
         : Promise.resolve())
    );
}

function promiseWheelKnowledge() {
    return (
        // Knowledge
        Promise.resolve(createWheel("http://images.neopets.com/wheels/wheel_of_knowledge_v2_731eafc8f8.swf?r=1495789846", 372, 559, 262, "flash_45622675376"))
        .then(function(r){
            return createDailyFrame({
                titleText: "Wheel of Knowledge",
                titleUrl: "http://www.neopets.com/medieval/knowledge.phtml",
                id: "wheel_kno",
                className: "daily box wheel flash" + (START_FLASH_HIDDEN ? " startCollapsed" : ""),
                nodeContent: r
            });
        })
    );
}

function promiseWheelMediocrity() {
    return (
        // Mediocrity
        Promise.resolve(createWheel("http://images.neopets.com/wheels/wheel_of_mediocrity_v2_c4ed41eb31.swf", 425, 548, 238, "flash_77760435077"))
        .then(function(r){
            return createDailyFrame({
                titleText: "Wheel of Mediocrity",
                titleUrl: "http://www.neopets.com/prehistoric/mediocrity.phtml",
                id: "wheel_med",
                className: "daily box wheel flash" + (START_FLASH_HIDDEN ? " startCollapsed" : ""),
                nodeContent: r
            });
        })
    );
}

function promiseWheelMisfortune() {
    return (
        // Misfortune
        (WHEEL_ALLOW_MIS ? // people don't like this wheel because a lot of the time it's not worth it, so you can disable it
         Promise.resolve(createWheel("http://images.neopets.com/wheels/wheel_of_misfortune_v2_3075ced020.swf", 395, 555, 247, "flash_91615379415"))
         .then(function(r){
            return createDailyFrame({
                titleText: "Wheel of Misfortune",
                titleUrl: "http://www.neopets.com/halloween/wheel/index.phtml",
                id: "wheel_mis",
                className: "daily box wheel flash" + (START_FLASH_HIDDEN ? " startCollapsed" : ""),
                nodeContent: r
            });
        })
         : Promise.resolve())
    );
}

function promiseWheelMonotony() {
    return (
        // Monotony
        //actual size, xcen, ycen: 315, 570, 212
        Promise.resolve(createWheel("http://images.neopets.com/wheels/wheel_of_monotony_v2_380e3dbdad.swf?r=1802226625",
                                    (WHEEL_SHOW_MON_MUTE ? 450 : 315), // size
                                    (WHEEL_SHOW_MON_MUTE ? 626 : 570), // xcen
                                    (WHEEL_SHOW_MON_MUTE ? 302 : 212), // ycen
                                    "flash_30609553018"))
        .then(function(r){
            return createDailyFrame({
                titleText: "Wheel of Monotony",
                titleUrl: "http://www.neopets.com/prehistoric/monotony/monotony.phtml",
                id: "wheel_mon",
                className: "daily box wheel flash" + (START_FLASH_HIDDEN ? " startCollapsed" : ""),
                nodeContent: r
            });
        })
    );
}
// ===== Wheels End

function promiseExpellibox() {
    return (
        Promise.resolve()
        .then(function(r) {
            var embed = document.createElement("embed");
            embed.setAttribute("src", "http://images.neopets.com/games/g905_v3_99390.swf");
            embed.setAttribute("width", "300");
            embed.setAttribute("height", "300");
            embed.setAttribute(
                "flashvars",
                "lang=en" + "&" +
                "baseurl=" + encodeURIComponent("origin.ncmall.neopets.com") + "&" +
                "neocash=1"
            );

            return createDailyFrame({
                titleText: "Qasalan Expellibox",
                titleUrl: "http://ncmall.neopets.com/mall/shop.phtml?page=giveaway",
                id: "expellibox",
                className: "daily box expeli flash" + (START_FLASH_HIDDEN ? " startCollapsed" : ""),
                nodeContent: embed
            });
        })
    );
}

function promiseTrudyDaily() {
    return(
        getPage("http://www.neopets.com/trudys_surprise.phtml")
        .then(function(result){
            prepareTrudy();
            var temp = fragmentize(result);
            var content = document.createDocumentFragment();
            content.appendChild(temp.querySelectorAll("td.content>div")[1]);
            var scripts = content.querySelectorAll("script");
            //scripts[1].textContent
            // /onClosed: function\(\)\s+{\s+(.+)\s+}/igm replace onClosed with new
            var trudy = createDailyFrame({
                titleText: "Trudy's Surprise",
                titleUrl: "http://www.neopets.com/trudys_surprise.phtml",
                id: "trudy_surprise",
                className: "daily box trudy",
                nodeContent: content
            });
            return trudy;
        })
    );
}

// ===== [MISC] =====
function promiseNotesBrain() {
    return (
        getPage("https://dl.dropboxusercontent.com/u/5061840/HTML%2C%20Coding%2C%20and%20Design/Neodailies/Notes-Brainstorming.html")
        .then(function(r){
            return createDailyFrame({
                titleText: "Brainstorming", id: "notes-bst", className: "wide notes scrolling",
                nodeContent: fragmentize(r)
            });
        })
        .catch(function(r){
            return createDailyFrame({
                titleText: "Brainstorming", id: "notes-bst", className: "wide error",
                nodeContent: fragmentize(r)
            });
        })
    );
}

function promiseNotesDailies() {
    return (
        getPage("https://dl.dropboxusercontent.com/u/5061840/HTML%2C%20Coding%2C%20and%20Design/Neodailies/Notes-Dailies.html")
        .then(function(r){
            return createDailyFrame({
                titleText: "Dailies", id: "notes-dls", className: "wide notes scrolling",
                nodeContent: fragmentize(r)
            });
        })
        .catch(function(r){
            return createDailyFrame({
                titleText: "Dailies", id: "notes-dls", className: "wide error",
                codeContent: fragmentize(r)
            });
        })
    );
}

function promisePetTests() {
    return (
        Promise.resolve()
        .then(function(r){
            var frag = document.createDocumentFragment();
            var swfs = document.createDocumentFragment();
            var pics = document.createDocumentFragment();
            var i;

            for (i = 0; i < pets_parse.length; ++i) {
                swfs.appendChild(dailies.pets[i].swf);
                pics.appendChild(dailies.createPetImage(dailies.pets[i].id, "happy", "face150", dailies.pets[i].name));
            }

            frag.appendChild(swfs);
            frag.appendChild(pics);

            return createDailyFrame({
                titleText: "Pet Tests",
                id: "ptests",
                className: "wide large flash",
                nodeContent: frag
            });
        })
    );
}

// ===== Daily Promise End =====



// =====

// ==================== Main End
