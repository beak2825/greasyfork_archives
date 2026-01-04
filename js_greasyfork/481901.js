// ==UserScript==
// @name        betterbutter for digibutter.nerr
// @license     GPL-3.0-only
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAATtJREFUOE9dUwkOwzAIA/b/JxcmHyTdqmrNAjHGJhl/T0bEYC8jcrA+C+5tsDumajK1+UoioLeFE6NTEZkRM9P+u3nniCqfqJdJABdfQtmTLM+XvAYFksV0AKw2ZACkz7iEgvhdeoNaAX6ZAXiCErEjsgg4aFer2yzqEguJVZH93AM9kVUx/ej704xkwUNgrh/I+1kLmJGQnN2Sgg4o4hbI0/qBvvjQnMvWlE8bIwmdsjKqZ/MC0NvmJOIAWGnH8OW0c+KA7bNudzp2KhbEzaMFD9QCkSUUlnNnELuVUR9zxeeB3JyFPErLKA+POM8DrNsatc9uFllNoxLzosawrwlh41SoUQyzUusi6lAy+I/QdcCjA0AcEZDMd9Hr7fvinetogXWXOIBjH3hXBHVMv+N5buA7jCOi4Gsw8QWr3cMUgmXrBAAAAABJRU5ErkJggg==
// @namespace   http://digibutter.nerr.biz
// @match       http://digibutter.nerr.biz/*
// @grant       none
// @version     1.0
// @author      TheEvilShadoo
// @description Page title notifications, style modifications, and optional text filtering for digibutter.nerr!
// @downloadURL https://update.greasyfork.org/scripts/481901/betterbutter%20for%20digibutternerr.user.js
// @updateURL https://update.greasyfork.org/scripts/481901/betterbutter%20for%20digibutternerr.meta.js
// ==/UserScript==

// NERR SETTINGS:
const pirateFilter = false;
const cboxFilter = false;
const updateMilliseconds = 3000;

async function betterdigifilter() {
    if ( pirateFilter ) {
      replaceInText(document.body, /\badmin\b/gi, 'Scurge of the Sea');
      replaceInText(document.body, /\bAIDS\b/gi, 'scurvey');
      replaceInText(document.body, /\balchohol\b/gi, 'grog');
      replaceInText(document.body, /\bam\b/gi, 'be');
      replaceInText(document.body, /\band\b/gi, '\'n');
      replaceInText(document.body, /\bare\b/gi, 'be');
      replaceInText(document.body, /\bare they\b/gi, 'they be');
      replaceInText(document.body, /\byes\b/gi, 'aye');
      replaceInText(document.body, /\bno\b/gi, 'nay');
      replaceInText(document.body, /\bbabe\b/gi, 'wench');
      replaceInText(document.body, /\bbeer\b/gi, 'grog');
      replaceInText(document.body, /\bbitch\b/gi, 'wench');
      replaceInText(document.body, /\bcoin\b/gi, 'booty');
      replaceInText(document.body, /\bcoins\b/gi, 'booty');
      replaceInText(document.body, /\bdie\b/gi, 'visit Davey Jone\'s locker');
      replaceInText(document.body, /\bfacepalm\b/gi, 'facehook');
      replaceInText(document.body, /\bfail\b/gi, 'sank');
      replaceInText(document.body, /\bforum\b/gi, 'sea');
      replaceInText(document.body, /\bForums\b/g, 'Seas');
      replaceInText(document.body, /\bforums\b/g, 'seas');
      replaceInText(document.body, /\bVisitors\b/g, 'Skallywags');
      replaceInText(document.body, /\bvisitors\b/g, 'skallywags');
      replaceInText(document.body, /\bFrancis\b/gi, 'Cap\'n Frаncis');
      replaceInText(document.body, /\bfriend\b/gi, 'matey');
      replaceInText(document.body, /\bfriends\b/gi, 'mateys');
      replaceInText(document.body, /\bget\b/gi, 'pillage');
      replaceInText(document.body, /\bgirl\b/gi, 'wench');
      replaceInText(document.body, /\bgold\b/gi, 'booty');
      replaceInText(document.body, /\bgold coin\b/gi, 'booty');
      replaceInText(document.body, /\bgold coins\b/gi, 'booty');
      replaceInText(document.body, /\bguy\b/gi, 'lad');
      replaceInText(document.body, /\bguys\b/gi, 'lads');
      replaceInText(document.body, /\bhai\b/gi, 'AHOY');
      replaceInText(document.body, /\bheadesk\b/gi, 'headdeck');
      replaceInText(document.body, /\bhello\b/gi, 'AHOY');
      replaceInText(document.body, /\bher\b/gi, 'the wench');
      replaceInText(document.body, /\bhi\b/gi, 'AHOY');
      replaceInText(document.body, /\bhim\b/gi, 'the sea dog');
      replaceInText(document.body, /\bIm\b/gi, 'I be');
      replaceInText(document.body, /\bI'm\b/gi, 'I be');
      replaceInText(document.body, /\bidiot\b/gi, 'landlubber');
      replaceInText(document.body, /\bidiots\b/gi, 'landlubbers');
      replaceInText(document.body, /\bis\b/gi, 'be');
      replaceInText(document.body, /\bit's\b/gi, 'it be');
      replaceInText(document.body, /\bitem\b/gi, 'bottle of rum');
      replaceInText(document.body, /\bITT\b/gi, 'ITS');
      replaceInText(document.body, /\bjail\b/gi, 'the brigs');
      replaceInText(document.body, /\bjail time\b/gi, 'time in the brigs');
      replaceInText(document.body, /\bjerk\b/gi, 'salty dog');
      replaceInText(document.body, /\bkill ye\b/gi, 'make ye walk the plank');
      replaceInText(document.body, /\blaughed\b/gi, 'laughed heartily');
      replaceInText(document.body, /\blawl\b/gi, 'YO HO HO!');
      replaceInText(document.body, /\bleave\b/gi, 'sail away');
      replaceInText(document.body, /\bleave me\b/gi, 'leave me');
      replaceInText(document.body, /\bleaving\b/gi, 'sailing away');
      replaceInText(document.body, /\blol\b/gi, 'YO HO HO!');
      replaceInText(document.body, /\blolz\b/gi, 'YO HO HO!');
      replaceInText(document.body, /\blulz\b/gi, 'YO HO HO!');
      replaceInText(document.body, /\bmembers\b/gi, 'crew');
      replaceInText(document.body, /\bmy\b/gi, 'me');
      replaceInText(document.body, /\bof\b/gi, 'a');
      replaceInText(document.body, /\bprison\b/gi, 'brig');
      replaceInText(document.body, /\bshould\b/gi, 'best');
      replaceInText(document.body, /\bsoda\b/gi, 'grog');
      replaceInText(document.body, /\bstop\b/gi, 'AVAST!');
      replaceInText(document.body, /\bthats\b/gi, 'that be');
      replaceInText(document.body, /\bthat's\b/gi, 'that be');
      replaceInText(document.body, /\btheyre\b/gi, 'they be');
      replaceInText(document.body, /\bthey're\b/gi, 'they be');
      replaceInText(document.body, /\bto\b/gi, 't\'');
      replaceInText(document.body, /\btrip\b/gi, 'voyage');
      replaceInText(document.body, /\busers\b/gi, 'crew');
      replaceInText(document.body, /\bwas\b/gi, 'be');
      replaceInText(document.body, /\bwe're\b/gi, 'we be');
      replaceInText(document.body, /\bwhats\b/gi, 'what be');
      replaceInText(document.body, /\bwhat's\b/gi, 'what be');
      replaceInText(document.body, /\bya\b/gi, 'YARRRR');
      replaceInText(document.body, /\byes\b/gi, 'YARRRR');
      replaceInText(document.body, /\byo\b/g, 'YO HO HO!');
      replaceInText(document.body, /\bYo\b/, 'YO HO HO!');
      replaceInText(document.body, /\byou\b/gi, 'ye');
      replaceInText(document.body, /\byoure\b/gi, 'ye be');
      replaceInText(document.body, /\byou're\b/gi, 'ye be');
      replaceInText(document.body, /\byour\b/gi, 'yer');
    }

    if ( cboxFilter ) {
      replaceInText(document.body, /\bfuck\b/gi, '*crag*');
      replaceInText(document.body, /\bfucks\b/gi, '*crag*s');
      replaceInText(document.body, /\bfucker\b/gi, '*trucker*');
      replaceInText(document.body, /\bfuckers\b/gi, '*truckers*');
      replaceInText(document.body, /\bmotherfucker\b/gi, 'motherlover');
      replaceInText(document.body, /\bmotherfuckers\b/gi, 'motherlovers');
      replaceInText(document.body, /\bfucked\b/gi, '*crag*ed');
      replaceInText(document.body, /\bfucking\b/gi, '*crag*ing');
      replaceInText(document.body, /\bfuckin\b/gi, '*crag*in\'');
      replaceInText(document.body, /\bfuckign\b/gi, '*crag*ign');
      replaceInText(document.body, /\bfuk\b/gi, '*crag*');
      replaceInText(document.body, /\bcunt\b/gi, '*cragette*');
      replaceInText(document.body, /\bcunts\b/gi, '*cragettes*');
      replaceInText(document.body, /\brape\b/gi, '*grape*');
      replaceInText(document.body, /\bfucked\b/gi, '*crag*ed');
      replaceInText(document.body, /\bfucking\b/gi, '*crag*ing');
      replaceInText(document.body, /\bgirlfriend\b/gi, 'sister');
      replaceInText(document.body, /\bmoderator\b/gi, 'faggot');
      replaceInText(document.body, /\bmoderators\b/gi, 'faggots');
      replaceInText(document.body, /\bMinotaur\b/gi, 'color=red: Minotaur');
      replaceInText(document.body, /\bHouse\b/gi, 'color=blue: House');
      replaceInText(document.body, /\bautopurple\b/gi, 'autoplay');
      replaceInText(document.body, /\breddit\b/gi, 'lb: go away pls');
      replaceInText(document.body, /\bfuek\b/gi, 'fuck');
      replaceInText(document.body, /\bfueks\b/gi, 'fucks');
      replaceInText(document.body, /\bfueker\b/gi, 'fucker');
      replaceInText(document.body, /\bfuekers\b/gi, 'fuckers');
      replaceInText(document.body, /\bmotherfueker\b/gi, 'motherfucker');
      replaceInText(document.body, /\bmotherfuekers\b/gi, 'motherfuckers');
      replaceInText(document.body, /\bfueked\b/gi, 'fucked');
      replaceInText(document.body, /\bfueking\b/gi, 'fucking');
      replaceInText(document.body, /\braep\b/gi, 'rape');
      replaceInText(document.body, /\bTeam Fortress 2\b/gi, 'Hat Fortress 2');
      replaceInText(document.body, /\bFOOTBALL\b/gi, 'quf: FOOTBALL');
      replaceInText(document.body, /\bcandlejack\b/gi, 'color=white: Candlejack- ');
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent.replace(pattern, replacement);
                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement);
        }
    }
}

window.onfocus = function(){
  setTimeout(function() {
    if ( document.title.includes("(") ) {
      document.title = baseTitle;
    }
  }, 1);
}

var APobserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if ( typeof mutation.addedNodes[0] !== "undefined" ) {
      if ( mutation.addedNodes[0].textContent.indexOf("(") > -1 ) {
        if ( document.visibilityState == "hidden" ) {
          if ( !document.title.includes(" ! ") ) {
            document.title += " ( ! )";
            postSFX.play();
          }
        }
      }
    }
  });
});

var TDobserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if ( typeof mutation.addedNodes[0] !== "undefined" ) {
      if ( mutation.addedNodes[0].textContent.indexOf("(") > -1 ) {
        if ( document.visibilityState == "hidden" ) {
          if ( !document.title.includes(" ! ") ) {
            document.title += " ( ! )";
            postSFX.play();
          }
        }
      }
    }
  });
});

var observer2 = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if ( !document.title.includes("NerrChat") ) {
      if ( document.visibilityState == "hidden" ) {
        document.title += " (NerrChat)";
        nerrChatSFX.play();
      }
    }
  });
});

var observer3 = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if ( document.title.includes("butter.nerr") ) {
      baseTitle = "betterbutter.nerr";
    }
    else if ( document.title.includes("The Dump") ) {
      baseTitle = "The Dump";
    }
    else if ( document.title.includes("Gaming News") ) {
      baseTitle = "Gaming News";
    }
    else if ( document.title.includes("Forums") ) {
      baseTitle = "Forums";
    }
    else {
      baseTitle = "betterbutter.nerr"
    }
  });
});

var baseTitle = "betterbutter.nerr";
var postSFX = new Audio("https://www.shadoosite.xyz/audio/ff_zigenwaza_get1_44k_lp.mp3");
var nerrChatSFX = new Audio("https://www.shadoosite.xyz/audio/ff_corrrect2_e3_32k.mp3");
var normalPosts = 0;
var dumpPosts = 0;
var posts = 0;
var prevPosts = 0;

waitForElm(".postcontent").then((elm) => {
  waitForElm(".sidebar-postsx").then((elm) => {
    (function() {
      setTimeout(function() {
        betterdigifilter();
      }, 1);
      setInterval(function() {
        betterdigifilter();
        if ( typeof document.getElementsByClassName("mdl-navigation__link")[0].children[0] !== "undefined" ) {
          normalPosts = document.getElementsByClassName("mdl-navigation__link")[0].children[0].innerText.match(/\d/g);
          normalPosts = normalPosts.join("");
          normalPosts = parseInt(normalPosts);
        }
        else {
          normalPosts = 0;
        }
        if ( typeof document.getElementsByClassName("mdl-navigation__link")[2].children[0] !== "undefined" ) {
          dumpPosts = document.getElementsByClassName("mdl-navigation__link")[2].children[0].innerText.match(/\d/g);
          dumpPosts = dumpPosts.join("");
          dumpPosts = parseInt(dumpPosts);
        }
        else {
          dumpPosts = 0;
        }
        posts = normalPosts + dumpPosts;
        if ( posts > prevPosts ) {
          if ( document.visibilityState == "hidden" ) {
            if ( posts == 0 ) {
              return;
            }
            else {
              if ( !document.title.includes(" ! ") ) {
                document.title += " ( ! )";
                postSFX.play();
              }
            }
          }
        }
        prevPosts = posts;
      }, 1000);
      setTimeout(function() {
        baseTitle = document.title;
        if ( document.title == "digibutter.nerr" ) {
          document.title = "betterbutter.nerr";
          baseTitle = "betterbutter.nerr";
        }

        var config = { attributes: true, childList: true, subtree: true };
        var config2 = { attributes: true, childList: false, subtree: false };
        var allPosts = document.getElementsByClassName("mdl-navigation__link")[0]; // New in All Posts
        var theDump = document.getElementsByClassName("mdl-navigation__link")[2]; // New in The Dump
        var nerrChat = document.getElementsByClassName("sidebar-postsx")[0]; // New in NerrChat
        var title = document.querySelector('title');
        APobserver.observe(allPosts, config);
        TDobserver.observe(theDump, config);
        observer2.observe(nerrChat, config);
        observer3.observe(title, config2);
      }, 1500);
      setInterval(function() {
        dbtitle = document.getElementsByClassName("mdl-layout-title")[0];
        dbtitle.style.color = "black";
        if ( dbtitle.innerText == "digibutter.nerr" ) {
          document.title = document.title.replace(/digibutter.nerr/gi, 'betterbutter.nerr');
          replaceInText(document.body, /\bdigibutter.nerr\b/gi, "betterbutter.nerr");
        }
        document.body.style.backgroundImage = "http://digibutter.nerr.biz/img/dbbgbody.png";
        document.body.getElementsByClassName("mdl-layout__content")[0].style.backgroundImage = 'url("https://www.shadoosite.xyz/images/snowbgbody.png")';
        document.body.getElementsByClassName("mdl-layout__header-row")[0].style.backgroundImage = 'url("http://digibutter.nerr.biz/templates/sleek/images/snowbg.png")';
        document.body.getElementsByClassName("mdl-layout__drawer-right")[0].style.backgroundImage = 'url("https://www.shadoosite.xyz/images/snowbgbody.png")';
        document.body.getElementsByClassName("mdl-layout__drawer-right")[0].style.color = "black";
        document.body.getElementsByClassName("mdl-layout__drawer-right")[0].style.border = "solid black 4px";
        btnShowreplies = document.body.getElementsByClassName("btn-showreplies");
        postCards = document.body.querySelectorAll(".section-cell:not(.section_divider)");
        for (let index = 0; index < postCards.length; ++index) {
          const element = postCards[index];
          element.style.backgroundColor = '#89ffbd';
        }
        for (let index = 0; index < btnShowreplies.length; ++index) {
          const element = btnShowreplies[index];
          element.style.backgroundColor = '#d2d2d2';
        }
      }, 1);
    })();
  });
});