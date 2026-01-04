// ==UserScript==
// @name           Hover Alternative Front-Ends
// @namespace      HAFE
// @description    Pops up a floating div when you hover over a link, containing alternative front-ends!
// @homepageURL    https://greasyfork.org/en/scripts/437920-hover-alternative-front-ends
// @match          *://*/*
// @grant          none
// @run-at         document-idle
// @version        1.2.3
// @downloadURL https://update.greasyfork.org/scripts/437920/Hover%20Alternative%20Front-Ends.user.js
// @updateURL https://update.greasyfork.org/scripts/437920/Hover%20Alternative%20Front-Ends.meta.js
// ==/UserScript==

// This script is a fork of 'Hover Preview':
// https://greasyfork.org/en/scripts/8042-hover-preview

const focusReactionTime = 300;
const unfocusReactionTime = 1500;

const domains = {
  youtube: ["youtube.com","youtu.be","youtube-nocookie.com"],
  twitter: ["twitter.com","twimg.com"],
  reddit: ["reddit.com","i.redd.it"],
  instagram: ["instagram.com"],
  imgur: ["imgur.com"],
  medium: ["medium.com"],
  wikipedia: ["en.wikipedia.org"]
};

const youtubeFrontends = [{
  name: "Invidious(Snopyta)",
  address: "invidious.snopyta.org"
},{
  name: "Invidious(Yewtube)",
  address: "yewtu.be"
},{
  name: "Invidious(Puffyan)",
  address: "vid.puffyan.us"
},{
  name: "Invidious(Seth)",
  address: "invidious.sethforprivacy.com"
},{
  name: "CloudTube",
  address: "tube.cadence.moe"
},{
  name: "Piped",
  address: "piped.kavin.rocks",
}];

const twitterFrontends = [{
  name: "Nitter",
  address: "nitter.net"
},{
  name: "Nitter(Snopyta)",
  address: "nitter.snopyta.org"
},{
  name: "Nitter(Puss)",
  address: "nitter.pussthecat.org"
},{
  name: "Nitter(42l)",
  address: "nitter.42l.fr"
},{
  name: "Nitter(Seth)",
  address: "nitter.sethforprivacy.com"
},{
  name: "Nitter(Action Sack)",
  address: "nitter.actionsack.com"
}];

const redditFrontends = [{
  name: "Teddit",
  address: "teddit.net"
},{
  name: "Teddit(Puss)",
  address: "teddit.pussthecat.org"
},{
  name: "Teddit(Seth)",
  address: "teddit.sethforprivacy.com"
},{
  name: "Libreddit",
  address: "libredd.it"
},{
  name: "Libreddit(Spike)",
  address: "libreddit.spike.codes"
},{
  name: "Libreddit(Puss)",
  address: "libreddit.pussthecat.org"
}];

const instagramFrontends = [{
  name: "Bibliogram",
  address: "bibliogram.art"
},{
  name: "Bibliogram(Snopyta)",
  address: "bibliogram.snopyta.org"
},{
  name: "Bibliogram(Puss)",
  address: "bibliogram.pussthecat.org"
},{
  name: "Bibliogram(Action Sack)",
  address: "bib.actionsack.com"
},{
  name: "Bibliogram(Hamster)",
  address: "bibliogram.hamster.dance"
}];

const imgurFrontends = [{
  name: "Imgin",
  address: "imgin.voidnet.tech"
},{
  name: "Ringu(Action Sack)",
  address: "i.actionsack.com"
},{
  name: "Kageurufu",
  address: "imgur.kageurufu.net"
}];

const mediumFrontends = [{
  name: "Scribe",
  address: "scribe.rip"
},{
  name: "Scribe(NixNet)",
  address: "scribe.nixnet.services"
}];

const wikipediaFrontends = [{
  name: "Wikiless",
  address: "wikiless.org"
},{
  name: "Wikiless(Seth)",
  address: "wikiless.sethforprivacy.com"
},{
  name: "Infogalactic",
  address: "infogalactic.com"
}];

var focus = undefined;
var lastFocus = undefined;
var timer = null;

var hafePopup;
var hafeFrame;

var isOverPopup = false;

function checkFocus() {
  if (focus) {
    // if (focus == lastFocus) {
      // User has definitely been here a while
      showHAFEWindow(focus);
    // } else {
    // }
    // lastFocus = focus;
  }
}

function aMouseOver(evt) {
  if (evt.currentTarget.tagName !== "A") {
          alert(decodeURIComponent("not link"));
    return;
  }
  if (!focus) {
    focus = evt.currentTarget;
    // setTimeout('checkFocus();',focusReactionTime);
    // Hack to bring the popup back immediately if we've gone back to the same link.
    if (hafeFrame && focus.href && hafeFrame.href == focus.href) {
      showHAFEWindow(focus,evt);
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(checkFocus,focusReactionTime);
    }
  } else {
    window.status = "Already focused on a link wtf!";
  }
}

function aMouseOut(evt) {
  if (evt.currentTarget.tagName !== "A") {
    return;
  }
  focus = undefined;
  if (timer) {
    clearTimeout(timer);
  }
  // TESTING: Don't hide the popup if mouse is currently over the popup!
  timer = setTimeout(clearPopup,unfocusReactionTime);
}

function clearPopup(e) {
  if (isOverPopup || focus)
    return;
  if (hafePopup) {
    // hafePopup.parentNode.removeChild(hafePopup);
    // hafePopup = undefined; // eww cache it!
    hafePopup.style.display = 'none';
  }
}

// DONE: If the user clicks a link, this isn't really a hover, so we should not
// activate and just let the user's click be processed!
function aClick(evt) {
  focus = undefined;
}

function createPopup() {
  // Create frame
  hafePopup = document.createElement('DIV');
  /** Seems style does not work for Konqueror this way. **/
  hafePopup.innerHTML =
    "<STYLE type='text/css'> .hafediv { background-color: #21242C; margin: 0px; padding: 2px; border: 1px solid dodgerblue; border-radius: 4px; text-align: center; box-sizing: border-box; } .hafediv a { font-family: Helvetica; font-size: 14px; color: white; text-decoration: none; padding: 0 5px; box-shadow: inset 0 0 0 0 #21242C; transition: all 0.4s ease-in-out 0s; border-radius: 3px; box-sizing: border-box; } .hafediv a:hover { box-shadow: inset 0 300px 0 0 dodgerblue; color: white; } </STYLE>"
    +
    "<DIV class='hafediv' width='" + (window.innerWidth * 0.75) + "' height='" + (window.innerHeight*0.75) + "' src='about:blank'></DIV>";
  hafePopup.addEventListener("mouseover", function(evt) { isOverPopup=true; }, false);
  hafePopup.addEventListener("mouseout", function(evt) { isOverPopup=false; setTimeout(clearPopup,unfocusReactionTime); }, false);
  document.documentElement.appendChild(hafePopup);
  hafePopup.style.position = "absolute";
  hafePopup.style.zIndex = "10000";
  hafeFrame = hafePopup.getElementsByTagName('DIV')[0];
}

function insertLink(linkAddress, linkText) {
  var newLink = document.createElement('a');
  newLink.href = linkAddress
  newLink.textContent = linkText
  hafeFrame.append(newLink);
  hafeFrame.append(document.createTextNode(" "));
}

function insertLinks(link) {
  hafeFrame.innerHTML = "";

  var linkHost = link.href.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  var linkPath = link.href.replace(linkHost[0], "");

  for (var domain in domains) {
    for (var target=0; target < domains[domain].length; target++) {
      if (linkHost[0].includes(domains[domain][target])) {
        switch (domain) {
          case "youtube":
          if (linkHost[1].includes("studio")) {
            return false;
          } else {
            for (var index=0; index < youtubeFrontends.length; index++) {
              insertLink(link.href.replace(linkHost[1], youtubeFrontends[index].address), youtubeFrontends[index].name);
            }
          }
          break;

          case "twitter":
          if (linkHost[1].includes("pbs") || linkHost[1].includes("video")) {
            for (var index=0; index < twitterFrontends.length; index++) {
              insertLink(linkHost[0].replace(linkHost[1], twitterFrontends[index].address) + "pic/" + encodeURIComponent(link.href), twitterFrontends[index].name);
            }
          } else {
            for (var index=0; index < twitterFrontends.length; index++) {
              insertLink(link.href.replace(linkHost[1], twitterFrontends[index].address), twitterFrontends[index].name);
            }
          }
          break;

          case "reddit":
          if (domains[domain][target] === "i.redd.it") {
            for (var index=0; index < redditFrontends.length; index++) {
              if (redditFrontends[index].name.includes("Libreddit")) {
                insertLink(linkHost[0].replace(linkHost[1], redditFrontends[index].address) + "img/" + linkPath, redditFrontends[index].name);
              }
            }
          } else {
            for (var index=0; index < redditFrontends.length; index++) {
              insertLink(link.href.replace(linkHost[1], redditFrontends[index].address), redditFrontends[index].name);
            }
          }
          break;

          case "instagram":
          const instagramPaths = /\b(?:tv|reels?|u|p)\b/i;
          const instagramIgnore = /\b(?:stories|accounts|explore|topics)\b/i;
          var linkFolders = linkPath.split(/(?:\?|\/)+/);

          if (linkHost[1].includes("about") || linkHost[1].includes("help") || linkFolders[0].match(instagramIgnore)) {
            return false;
          } else if (linkFolders.length > 0 && linkFolders[0].match(instagramPaths)) {
            for (var index=0; index < instagramFrontends.length; index++) {
              insertLink(link.href.replace(linkHost[1], instagramFrontends[index].address), instagramFrontends[index].name);
            }
          } else if (linkFolders.length > 1 && linkFolders[1].match(instagramPaths)) {
            for (var index=0; index < instagramFrontends.length; index++) {
              insertLink(linkHost[0].replace(linkHost[1], instagramFrontends[index].address) + linkPath.replace(linkFolders[0] + "/", ""), instagramFrontends[index].name);
            }
          } else {
            for (var index=0; index < instagramFrontends.length; index++) {
              insertLink(link.href.replace(linkHost[1], instagramFrontends[index].address + "/u"), instagramFrontends[index].name);
            }
          }
          break;

          case "imgur":
          for (var index=0; index < imgurFrontends.length; index++) {
            insertLink(link.href.replace(linkHost[1], imgurFrontends[index].address), imgurFrontends[index].name);
          }
          break;

          case "medium":
          for (var index=0; index < mediumFrontends.length; index++) {
            insertLink(link.href.replace(linkHost[1], mediumFrontends[index].address), mediumFrontends[index].name);
          }
          break;

          case "wikipedia":
          for (var index=0; index < wikipediaFrontends.length; index++) {
            if (wikipediaFrontends[index].name.includes("Infogalactic")) {
              insertLink(linkHost[0].replace(linkHost[1], wikipediaFrontends[index].address) + linkPath.replace("wiki", "info"), wikipediaFrontends[index].name);
            } else {
              insertLink(link.href.replace(linkHost[1], wikipediaFrontends[index].address), wikipediaFrontends[index].name);
            }
          }
          break;

          default:
          alert(decodeURIComponent(link.href));
        }
        return true;
      }
    }
  }
  return false;
}

function showHAFEWindow(link,evt) {
  if (!hafeFrame) {
    createPopup();
  }
  if (insertLinks(link)) {
    hafePopup.style.display = '';
    hafePopup.style.top = ((link.getBoundingClientRect().top + window.scrollY) - hafePopup.getBoundingClientRect().height) + "px";
    hafePopup.style.left = link.getBoundingClientRect().left + "px";
  } else {
    hafePopup.style.display = 'none';
  }
}

function init() {
  for (var i=0; i < document.links.length; i++) {
    var link = document.links[i];
    /** Apparently deprecated. **/
    // link.onmouseover = aMouseOver;
    // link.onmouseout = aMouseOut;
    /** The new way: **/
    link.addEventListener("mouseover", aMouseOver, false);
    link.addEventListener("mouseout", aMouseOut, false);
    link.addEventListener("click", aClick, false);
    //addEvents(link);
    // link.addEventListener("mousemove", function(evt) { locate(evt); }, true);
  }
}

init();

var observer = new MutationObserver(init);

observer.observe(document.body, { subtree: true, childList: true });
//observer.disconnect();

// window.document.checkFocus = checkFocus;

