// ==UserScript==
// @name         RED Custom Sidebar
// @namespace    Redacted
// @version      0.9.1
// @description  Hide elements on the sidebar of release pages
// @author       janbatist
// @include      https://redacted.ch/torrents.php?*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/39324/RED%20Custom%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/39324/RED%20Custom%20Sidebar.meta.js
// ==/UserScript==

//-------------------------------------------------------------------INSTRUCTIONS-------------------------------------------------------------------
//
// Before running the script, make sure to go through the array below and to check the 'exist' setting.
// If you're using one the supported user scripts, set 'exist' to 1.
//
// Feel free to modify the array above to fit your needs:
//   'id'         DON'T MODIFY
//                If you're adding support for a new box, make sure it's unique
//
//   'exist'      Set to 1 for the user scripts you use
//
//   'position'   Set the order of the boxes. The sorting is ascending, so the box with the position 1 will be on top of the page
//
//   'display'    0 = don't display
//                1 = display header only, with a +/- toggle
//                2 = displlay full box
//
//   'title'      The text used to refer to other boxes in headers
//
//   'head'       Links to other boxes you want to add in the header
//                It must be an array of ids, and you can also use 'sep' (with the quotes) to add a "/" separator
//
//   'selector'   DON'T MODIFY
//                If you're adding support for a new box, use your browser dev tools to find it or feel free to ask for it in the forum thread
//
// Example: You like minimalistic stuff and only want the cover art, yet ways to display other boxes?
//          'display' = 2 for 'cover', 0 for all other boxes.
//          Cover 'head' = ['albumVotes', 'sep', 'tags', 'sep', 'artists']
//
//--------------------------------------------------------------------------------------------------------------------------------------------------


// Boxes
var boxes = [
    {
        'id': 'cover',
        'exist': 1,
        'position': 1,
        'display': 2,
        'title': 'Cover',
        'head': [],
        'selector': 'div.box.box_image.box_image_albumart'
    },
    {
        'id': 'artists',
        'exist': 1,
        'position': 2,
        'display': 2,
        'title': 'Artists',
        'head': ['sep', 'addArtists'],
        'selector': 'div.box.box_artists'
    },
    {
        'id': 'addArtists',
        'exist': 1,
        'position': 3,
        'display': 0,
        'title': 'Add',
        'head': ['sep', 'yadg', 'sep', 'yavah'],
        'selector': 'div.box.box_addartists'
    },
    {
        'id': 'redFavorites',
        'exist': 1,
        'position': 7,
        'display': 1,
        'head': [],
        'selector': 'div#votes_ranks'
    },
    {
        'id': 'albumVotes',
        'exist': 1,
        'position': 8,
        'display': 1,
        'title': 'Album votes',
        'head': '',
        'selector': 'div#votes'
    },
    {
        'id': 'tags',
        'exist': 1,
        'position': 5,
        'display': 2,
        'title': 'Tags',
        'head': ['addTags'],
        'selector': 'div.box.box_tags'
    },
    {
        'id': 'addTags',
        'exist': 1,
        'position': 6,
        'display': 0,
        'title': 'Add',
        'head': [],
        'selector': 'div.box.box_addtag'
    },
    {
        'id': 'addCollage',
        'exist': 1,
        'position': 9,
        'display': 1,
        'title': 'Add to collage',
        'head': [],
        'selector': 'div.box.box_addtocollage'
    },
    {
        'id': 'yavah',
        'exist': 0,
        'position': 3,
        'display': 0,
        'title': 'YAVAH',
        'head': [],
        'selector': 'div#YAVAH'
    },
    {
        'id': 'yadg',
        'exist': 0,
        'position': 4,
        'display': 0,
        'title': 'YADG',
        'head': ['yavah'],
        'selector': 'div#yadg_div'
    },

];

function mkHead(box) {

    var elS, elA, elSep, targetBox, text, aText;
    var head = box.head;

    for (let el of head) {

        elA = null;

        elS = document.createElement('span');
        elS.style.float = 'right';
        elS.className = 'csb_head';
        if (el === 'sep') {
            elS.style.marginLeft = '3px';
            elS.style.marginRight = '3px';
            elS.textContent = '/';
        }

        if (el != 'sep') {
            text = boxes.find(x => x.id === el).title;
            elA = document.createElement('a');
            elA.href = '#!';
            elA.title = text;
            elA.onclick = function() { displayToggle(uBoxes.find(x => x.id === el)); };
            aText = document.createTextNode(text);

            elA.appendChild(aText);
            elS.appendChild(elA);
        }

        document.querySelector(box.selector).querySelector('div.head').appendChild(elS);

    }

    // Create the +/- toggle when displaying head only
    if (box.display === 1) {

        elS = document.createElement('span');
        elS.style.float = 'right';
        elS.className = 'csb_head';
        elS.id = 'displaytoggle';

        elA = document.createElement('a');
        elA.href = '#!';
        elA.title = 'Toggle box';
        elA.onclick = function() { displayToggle(box,'body'); };
        aText = document.createTextNode('+');

        elA.appendChild(aText);
        elS.appendChild(elA);

        var iBefore = document.querySelector(box.selector + ' div.head > span, ' + box.selector + 'div.head > a');
        if (iBefore) {
            elSep = document.createElement('span');
            elSep.textContent = '/';
            elSep.style.float = 'right';
            elSep.style.marginLeft = '3px';
            elSep.style.marginRight = '3px';

            document.querySelector(box.selector + ' div.head').insertBefore(elSep,iBefore);

            iBefore = elSep;
        }

        document.querySelector(box.selector + ' div.head').insertBefore(elS,iBefore);
    }
}

function displayToggle(box,el) {

    var boxDiv = document.querySelector(box.selector);

    // +/- toggle
    if (el) {
        hEl = boxDiv.querySelectorAll('div:not(.head), ul');
        for (let el of hEl) {
            if (el.style.display === 'none') {
                el.style.display = 'block';
                boxDiv.querySelector('div.head span#displaytoggle > a').textContent = '-';
                boxDiv.querySelector("div.head").style.borderBottom = bottomBorder;

            } else {
                el.style.display = 'none';
                boxDiv.querySelector('div.head span#displaytoggle > a').textContent = '+';
                boxDiv.querySelector("div.head").style.borderBottom = "none";
            }
        }

    // Other box toggle
    } else {
        if (boxDiv.style.display === 'none') {
            //add.textContent = 'Hide';
            boxDiv.style.display = 'block';
        } else {
            //add.textContent = 'Add';
            boxDiv.style.display = 'none';
            // Hiding YAVAH and/or YADG when hiding addArtists
            if (box.id === 'addArtists') {
                document.querySelector(uBoxes.find(x => x.id === 'yavah').selector).style.display = 'none';
                document.querySelector(uBoxes.find(x => x.id === 'yadg').selector).style.display = 'none';
            }
        }
    }
}

function init() {

    // Filtering and sorting boxes
    var fBoxes = boxes.filter(box => box.exist > 0);
    uBoxes = fBoxes.sort(function(a, b) { return a.position - b.position; });

    // Making sure all boxes are there
    var boxCounter = 0;
    var boxLength = uBoxes.length;
    if (!document.querySelector(uBoxes.find(x => x.id === 'redFavorites').selector)) { boxLength -= 1; }
    for (let box of uBoxes) {
        if (document.querySelector(box.selector) != null) {
            boxCounter += 1;
        }
    }
    if (boxCounter != boxLength) {
        if (attempts === 10) {
            console.log('Userscript RED Custom Sidebar: Script has stopped after too many attempts ('+attempts+'). Check the exist setting for all boxes.');
            return;
        }
        attempts += 1;
        return window.setTimeout(init,100);
    }

    // Parsing the bottom-border CSS style
    var styles = window.getComputedStyle(document.querySelector(uBoxes[0].selector));
    bottomBorder = styles.borderBottom;

    for (let box of uBoxes) {

        // Managing redFavorites, which is obviously not always there
        if (box.id === 'redFavorites' && !document.querySelector(box.selector)) { continue; }

        // Creating heads
        mkHead(box);

        // Applying display setting for boxes
        switch (box.display) {
            case 0:
                document.querySelector(box.selector).style.display = 'none';
                break;

            case 1:
                var boxDiv = document.querySelector(box.selector);
                var hEl = boxDiv.querySelectorAll('div:not(.head), ul');
                for (let el of hEl) {
                    el.style.display = 'none';
                }
                // Managing heads borders
                boxDiv.querySelector("div.head").style.borderBottom = 'none';
                break;
        }

        // Applying sorting for boxes
        document.querySelector('div.sidebar').appendChild(document.querySelector(box.selector));
    }
}

var attempts = 0;
init();