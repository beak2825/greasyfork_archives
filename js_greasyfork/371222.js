// ==UserScript==
// @name         Path of Exile - SCRIPTS
// @namespace    http://tampermonkey.net/
// @version      1.37
// @description  Installs functionalities to site
// @author       Mika Salo
// @match        https://www.pathofexile.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      http://cdn.jsdelivr.net/qtip2/3.0.3/jquery.qtip.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371222/Path%20of%20Exile%20-%20SCRIPTS.user.js
// @updateURL https://update.greasyfork.org/scripts/371222/Path%20of%20Exile%20-%20SCRIPTS.meta.js
// ==/UserScript==

// Set modifier for jquery "$" function
var $ = window.jQuery;

/* Inject Qtip CSS */
$("head").append (
    '<link '
    + 'href="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.css" '
    + 'rel="stylesheet" type="text/css">'
);

/* Poe generic link button */
$(".buttonlink").css({
    "position": "absolute",
    "height": "20px",
    "width": "100px",
    "border-radius": "8px 8px 8px 8px",
    "box-shadow": "1px 1px 2px 2px #444444",
    "background": "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(50, 50, 50, 1))",
    "text-align": "center",
    "color": "#DDDDDD",
    "text-shadow": "#000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px"
});

function createElement(elementCreate, elementType, elementValue, elementId, elementClass, elementFunction, elementTitle, elementInnerHtml, elementDestination) {
    var element = document.createElement(elementCreate);
    element.setAttribute("type", elementType);
    element.setAttribute("value", elementValue);
    element.setAttribute("id", elementId);
    element.setAttribute("class", elementClass);
    element.setAttribute("onclick", elementFunction);
    element.setAttribute("title", elementTitle);
    element.innerHTML=(elementInnerHtml);
    $( elementDestination ).append( element );
}

// Luodaan "Div" keskitystä varten
createElement(/* Element tag */"div",
              /* Element type */"" ,
              /* Element value */"",
              /* Element ID */"menuCenterDiv",
              /* Element class */"menuCenterDiv",
              /* Element onclick */"",
              /* Element title */"",
              /* Element innerHtml */"",
              /* Element destination */"body");

/* Menu div keskitystä varten*/
$("#menuCenterDiv").css({
    "z-index": "9999",
    "position": "absolute",
    "top": "20px",
    "height": "20px",
    "width": "100%",
    "text-align": "center"
});

// Luodaan "Div" valikkoita varten
createElement(/* Element tag */"div",
              /* Element type */"" ,
              /* Element value */"",
              /* Element ID */"menuDiv",
              /* Element class */"menuDiv",
              /* Element onclick */"",
              /* Element title */"",
              /* Element innerHtml */"",
              /* Element destination */"#menuCenterDiv");

/* Menu div*/
$("#menuDiv").css({
    "z-index": "9999",
    "position": "sticky",
    "height": "20px",
    "width": "314px",
    "display": "inline-block",
});

// Luodaan lista linkkivalikkoa varten
createElement(/* Element tag */"UL",
              /* Element type */"" ,
              /* Element value */"Items",
              /* Element ID */"itemsMenu",
              /* Element class */"ulMenu",
              /* Element onclick */"",
              /* Element title */"",
              /* Element innerHtml */"Items",
              /* Element destination */"#menuDiv");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Official Path of Exile trading site",
              /* Element ID */"itemsMenuElement1",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('http://poe.trade/')",
              /* Element title */"Poe item trade site",
              /* Element innerHtml */"Item Trade",
              /* Element destination */"#itemsMenu");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Lists possible mods for each item type",
              /* Element ID */"itemsMenuElement2",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('http://poeaffix.net/')",
              /* Element title */"Item affix and suffix site",
              /* Element innerHtml */"Item Affix",
              /* Element destination */"#itemsMenu");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Good itemfilter that is used to hide unwanted item drops",
              /* Element ID */"itemsMenuElement3",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('https://github.com/NeverSinkDev/NeverSink-Filter/releases')",
              /* Element title */"Neversink's Itemfilter",
              /* Element innerHtml */"Neversink",
              /* Element destination */"#itemsMenu");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"PoE TradeMacro is an Autohotkey (AHK) script that provides several convenient QoL features for Path of Exile Trading",
              /* Element ID */"itemsMenuElement4",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('https://poe-trademacro.github.io/')",
              /* Element title */" Autohotkey script with automatic price check macro",
              /* Element innerHtml */"TradeMacro",
              /* Element destination */"#itemsMenu");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Estimates the success chance and average cost of colouring sockets through Vorici",
              /* Element ID */"itemsMenuElement5",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('http://siveran.github.io/calc.html')",
              /* Element title */"Vorici Chromatic Calculator",
              /* Element innerHtml */"Chrom Calc",
              /* Element destination */"#itemsMenu");

// Luodaan lista shortcuts valikkoa varten
createElement(/* Element tag */"UL",
              /* Element type */"" ,
              /* Element value */"Skills",
              /* Element ID */"skillsMenu",
              /* Element class */"ulMenu",
              /* Element onclick */"",
              /* Element title */"",
              /* Element innerHtml */"Skills",
              /* Element destination */"#menuDiv");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Online tool to plan your passive skill tree for Path of Exile",
              /* Element ID */"skillMenuElement1",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('https://poeplanner.com/')",
              /* Element title */"Skill tree planner",
              /* Element innerHtml */"PoE Planner",
              /* Element destination */"#skillsMenu");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Calculate your mana reserved from multipule aura groups",
              /* Element ID */"skillMenuElement2",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('https://poe.mikelat.com/')",
              /* Element title */"Mikelat's Path of Exile Aura Calculator",
              /* Element innerHtml */"Aura Calc",
              /* Element destination */"#skillsMenu");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Offline build planner for Path of Exile",
              /* Element ID */"skillMenuElement3",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('https://github.com/Openarl/PathOfBuilding')",
              /* Element title */"Skilltree, skill and gear offline-planner",
              /* Element innerHtml */"Pob",
              /* Element destination */"#skillsMenu");

// Luodaan lista misc valikkoa varten
createElement(/* Element tag */"UL",
              /* Element type */"" ,
              /* Element value */"Misc",
              /* Element ID */"miscMenu",
              /* Element class */"ulMenu",
              /* Element onclick */"",
              /* Element title */"",
              /* Element innerHtml */"Misc",
              /* Element destination */"#menuDiv");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Experience (XP) & Drop Penalties in Path of Exile",
              /* Element ID */"miscMenuElement1",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('https://www.i-volve.net/jol/poe_xpdrop_en.php')",
              /* Element title */" Experience & drop penalties calculator",
              /* Element innerHtml */"Exp Penalt",
              /* Element destination */"#miscMenu");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Path of Exile Database, datamined info about Poe",
              /* Element ID */"miscMenuElement2",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('http://poedb.tw/us/')",
              /* Element title */"poedb: Path of Exile Database",
              /* Element innerHtml */"Poe DB",
              /* Element destination */"#miscMenu");

// Luodaan lista elementtejä linkkivalikkoon
createElement(/* Element tag */"LI",
              /* Element type */"" ,
              /* Element value */"Website that shows all Labyrinth Layouts everyday",
              /* Element ID */"miscMenuElement3",
              /* Element class */"liMenu",
              /* Element onclick */"window.open('https://www.poelab.com/')",
              /* Element title */"Poe labyrinth layout",
              /* Element innerHtml */"Poe Lab",
              /* Element destination */"#miscMenu");

/* Menu ol*/
$(".ulMenu").css({
    "position": "absolute",
    "display": "inline-block",
    "width": "100px",
    "border-radius": "8px 8px 8px 8px",
    "box-shadow": "1px 1px 2px 2px #444444",
    "background": "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(50, 50, 50, 1))",
    "text-align": "center",
    "color": "#DDDDDD",
    "text-shadow": "#000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px"
});

/* Items menu*/
$("#itemsMenu").css({
    "position": "absolute",
    "left": "0px"
    //"left": "80px"
});

/* Skills menu*/
$("#skillsMenu").css({
    "position": "absolute",
    "left": "106px"
});

/* Misc menu*/
$("#miscMenu").css({
    "position": "absolute",
    "left": "212px"
});

/* Listojen elementit vasempaan laitaan*/
$(".liMenu").css({
    "text-align": "left",
});

/* Kätketään kaikki lista elementit */
$("#itemsMenu > li, #skillsMenu > li, #miscMenu > li").hide();

/* Luodaan hover linkki-menun kohdalle */
$( "#itemsMenu" ).hover(
    function() {
        $( "#itemsMenu > li" ).show(300);
    }, function() {
        $( "#itemsMenu > li" ).hide(300);
    }
);

/* Luodaan hover shortcut-menun kohdalle */
$( "#skillsMenu" ).hover(
    function() {
        $( "#skillsMenu > li" ).show(300);
    }, function() {
        $( "#skillsMenu > li" ).hide(300);
    }
);

/* Luodaan hover misc-menun kohdalle */
$( "#miscMenu" ).hover(
    function() {
        $( "#miscMenu > li" ).show(300);
    }, function() {
        $( "#miscMenu > li" ).hide(300);
    }
);

/* Luodaan hover lista elementille */
$( ".ulMenu, .liMenu" ).hover(
    function() {
        this.style.border = '1px solid #666666';
        $( ".ulMenu, .liMenu" ).css("cursor", "pointer");
    }, function() {
        this.style.border = 'none';
        $( ".ulMenu, .liMenu" ).css("cursor", "default"); //to remove property set it to ''
    }
);

/* Luodaan title sekä sisältö tooltipeille käyttäen Qtip-libraryä */
$( ".liMenu" ).qtip({
    content: {
        text: function(api) {
            return $(this).attr('value');
        },
        title: {
            text: function(api) {
                return $(this).attr('title');
            }
        }
    },
    style: {
        classes: 'qtip-jtools'
    }
});