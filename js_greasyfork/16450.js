// ==UserScript==
// @name        EH Gallery Quick Tag Voting
// @author      FabulousCupcake
// @namespace   http://fabulous.cupcake.jp.net/
// @description Adds upvote and downvote button on the left and right sides of tags in EH Gallery to allow faster and easier tag voting.
// @include     /^https?://(ex|(g\.)?e-)hentai\.org/g/\d+?/\w{10}/?/
// @version     r5
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/16450/EH%20Gallery%20Quick%20Tag%20Voting.user.js
// @updateURL https://update.greasyfork.org/scripts/16450/EH%20Gallery%20Quick%20Tag%20Voting.meta.js
// ==/UserScript==

// Config
// ----------
const config = {
    "debug"         :   false,  // Enable debugging?
    "selective_tags":   false,   // Affect only tags w/ dashed borders ( those with <100 power and still yield tagging points )
    "invert_buttons":   false,  // Invert buttons  ( [+|tag|-] by default, [-|tag|+] if inverted )
    "short_buttons":    true,   // Shorter buttons ( [+|tag|-] ,instead of [+++|---] overlay )
    "upvote_only":      false,  // Upvote only     ( [+|tag  ] )
};


// Stylesheet
// ----------
var qt_button_width_default     = (config.short_buttons ? "18px" : "35%");
var qt_button_width_elongated   = (config.short_buttons ? "35%"  : "68%");
var stylesheet = `
.gt, .gtl {
    position: relative;
}

.qtvote {
    display: block;
    width: ${qt_button_width_default};
    min-width: 18px;
    height: 18px;
    float: left;
    position: absolute;
    top: -1px;
    cursor: pointer;
    opacity: 0.2;
    transition: all 200ms ease;
    border: inherit;
    box-sizing: border-box;
}

.qtvote:hover {
    width: ${qt_button_width_elongated} !important;
    opacity: 0.9;
}

.qtvote.up    { background: rgba(0,200,0,0.6); }
.qtvote.down  { background: rgba(255,0,0,0.6); }

.qtvote.left  { left:  -1px; border-radius: 5px 0 0 5px; border-right: none; }
.qtvote.right { right: -1px; border-radius: 0 5px 5px 0; border-left:  none; }

.tup ~ .qtvote.up, .tdn ~ .qtvote.down { display: none; }
.tup ~ .qtvote.down, .tdn ~ .qtvote.up { width: ${qt_button_width_elongated}; }

.qtvote.hide { display: none; }
.tup ~ .qtvote.hide, .tdn ~ qtvote.hide { display: block; }

`;


// Utilities
// ----------
function dlog(msg) {
    if ( config.debug ) {
        console.log(`EHGQT: ${msg}`);
    }
}


// Core
// ----------

function insertElements() {
    // Fetch to-be-inserted elements
    var filter = '.gtl' + (config.selective_tags ? '' : ', .gt');
    var tags = document.querySelectorAll(filter);

    // Build insert material
    var leftvote  = ( config.invert_buttons ? "down" : "up" );
    var rightvote = ( config.invert_buttons ? "up" : "down" );
    if ( config.upvote_only ) {
        config.invert_buttons ? leftvote += ' hide' : rightvote += ' hide';
    }
    var elleft  = `<div class="qtvote left ${leftvote}"></div>`;
    var elright = `<div class="qtvote right ${rightvote}"></div>`;


    // Insert the elements to the queried tags
    for( var i=0; i<tags.length; i+=1 ) {
        tags[i].insertAdjacentHTML('beforeend' , elleft);
        tags[i].insertAdjacentHTML('beforeend' , elright);
    }

    dlog('insertElements() executed.');
}

function insertStylesheet() {
    var stylesheetEl = document.createElement('style');
    stylesheetEl.innerHTML = stylesheet;
    document.body.appendChild(stylesheetEl);
}

function hookEvents() {
    var voteups   = document.querySelectorAll('.qtvote.up');
    var votedowns = document.querySelectorAll('.qtvote.down');

    for(var i=0; i<voteups.length; i+=1) {
        voteups[i].addEventListener("click", quickVote);
    }

    for(var i=0; i<votedowns.length; i+=1) {
        votedowns[i].addEventListener("click", quickVote);
    }

    dlog('hookEvents() executed.');
}

function quickVote(e) {
    // Extract tagname and vote value
    var tag  = e.target.parentElement.id.substr(3);
    var vote = ( e.target.classList.toString().match('up') ? 1 : -1 );

    // Replace "_" with " " in   tag
    tag = tag.replace(/_/g, ' ');

    // Send the vote!
    unsafeWindow.send_vote(tag, vote);
    dlog("quickVote() executed");
    dlog(`tag = ${tag}`);
    dlog(`vote = ${vote}`);
}

function main() {
    insertStylesheet();
    insertElements();
    hookEvents();
    dlog("main() executed");
}

function init() {
    // Call main
    main();

    // Create a Mutation Observer, since the taglists are reloaded once the votes are sent
    var observer    = new MutationObserver(main);
    var target      = document.getElementById('taglist');
    var config      = { childList: true };
    observer.observe(target, config);
    dlog("MutationObserver is now observing #taglist");
}


// Init
// ----------
init();
