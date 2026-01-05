// ==UserScript==
// @name        YuryMod - YouTube - whitelist channels in Adblock Plus
// @namespace   http://forums.mozillazine.org/memberlist.php?mode=viewprofile&u=261941
// @author      Gingerbread Man
// @credits     Eyeo GmbH, Gantt, rimmington
// @description Helps whitelist YouTube channels in Adblock Plus
// @include     http://*.youtube.com/*
// @include     https://*.youtube.com/*
// @version     1.7
// @grant       none
// @license     http://creativecommons.org/licenses/by-sa/4.0/
// @supportURL  https://adblockplus.org/forum/viewtopic.php?f=1&t=23697
// @downloadURL https://update.greasyfork.org/scripts/16957/YuryMod%20-%20YouTube%20-%20whitelist%20channels%20in%20Adblock%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/16957/YuryMod%20-%20YouTube%20-%20whitelist%20channels%20in%20Adblock%20Plus.meta.js
// ==/UserScript==

var updateHref = function (url) {
  window.history.replaceState(history.state, "", url);
};

var activate = function () {  
  var uo = document.querySelector('#watch7-content link[href*="/user/"]');
  var uv = document.querySelector('.yt-user-info > a[href*="/channel/"]');
  var channelName = (uo && uo.href.slice(uo.href.lastIndexOf("/")+1)) || (uv && uv.textContent);

  if (channelName) {
    addMenu(channelName);
    if (!(location.href.search("&user=") != -1)){
        updateHref(location.href+"&user="+channelName);
    }
  }
}

// For static pages
activate();

// For dynamic content changes, like when clicking a video on the main page.
// This bit is based on Gantt's excellent Download YouTube Videos As MP4 script:
// https://github.com/gantt/downloadyoutube
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes !== null) {
      for (i = 0; i < mutation.addedNodes.length; i++) {
        if (mutation.addedNodes[i].id == "watch7-main-container") {
          activate();
          break;
        }
      }
    }
  });
});
observer.observe(document.body, {childList: true, subtree: true});

// Add the context menu to the user name below the video
// Only works in Firefox
function addMenu(channelName) {
    var uh = document.getElementById("watch7-user-header");
    var menu = document.createElement("div");
    menu.setAttribute("id", "abpfilter");
    menu.setAttribute("style", "float: left;width: 32px;height: 24px;");
    var mione = document.createElement("button");
    // Adblock Plus is a registered trademark of Eyeo GmbH.
    mione.setAttribute("title", "Adblock Plus: add exception"); 
    mione.setAttribute("style","width: 96%;height: 91%;margin-left: 10px;cursor: pointer;background: no-repeat url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAACwVBMVEX////+/v7c3Nzc3NzZ2dn////+/v7b29vZ2dnZ2dnZ2dnZ2dnZ2dnc3NzZ2dnZ2dn////Z2dnc3NzZ2dnZ2dnZ2dnc3NzZ2dnZ2dnZ2dnZ2dnb29vZ2dnc3NzZ2dnZ2dnZ2dnc3Nza2tra2trc3NzZ2dna2trZ2dnZ2dnZ2dn////ABAC/AwC+AgDaKADBBgDECgDGDQC/AgDKEgDPGADTHgDHDgDGDADz09HJEQDBBQDDCADZ2dnABQDPGQC9AADOFwDCBwDMFADRHADXIwDECQDfLwDFDADDCQDNFwDy0tHIEADklJO9AQDRGwD21dHbKQDBcmvijo7ijY359PT31dH16un01NHjlJPcKwDdppzWIwDQGgDijo3UIADikJDLFADLEwDZJgCnFgDIDwC+AQDdLADjNADMFQDVIQDHDQDSHQDXJADJEAD79fThMgDjk5PdOgDu0tHkoZy/cWvjxsXpxsXkkpDWoJz1ysXYJADeLQDq0tHxysXpvrjij4/GGwDEFwDHcGvZgH3hrKrPcmvff2vywbjNe2v99fTVbVjfn5z26enEGADaoZznpJzv1tHjX0LTnpzMR0Lpin3moJznu7j0393emo3Qfmv76+nWrKqyCQDaj43gRSbTNgDnbVjAcWupMSayDQDoxsXdubjSn5zToJzmiX3kfmvnOQDtgGvZRSbGGgDCFgDIEgD69PS9SUK5EwC8GADcrqrrvbjs1NHaKwDceGvNWVjCDgDTg3336un69fTekI31q5y3AgCaBACeBgDBFgDcKgCvGgCuHgCuIACvIQCwIgCyIQC/IwDWJgDIHgCmEwDij47qubjVb2vdeWvjkZDbYljqin3eeGvTbmvTHwDv3t3kk5HklJLjkpLjkZHt1dHhjY3femvryMXKMCbjk5LBPybadmvbpZzfZljivLjleWvmx8XoiRsRAAAAKnRSTlMA+vDzPPv56j0vOjQx7DU3+ivvLenz6/HvMO3r6vE5OPLy8fDtMvMs6CqoAvZYAAACk0lEQVR4XnWT43scbRSHZzbZjdomTZvafs9wbTO2baO2bdu2bdu2X/8VfWau3XSyae+vv3uuOc8B5iO0s0FAx/aYH6E9xSBA4m/0Eoknm83llIwkSRlVbm6S9OggzHuLIgrjKZLQMRw6gqSaJEECI1yEF5aTRsbqYTk8VsZIIiPEl7dDOUUwetYtVZWVlamkblbPEFl495CfuYywOtWqenlxka2oWF6vUjutRBzeqSuXh/HfW1lprLwqWmEymRTRVfJYKWslvuNt26A8Ev0f5TVamyXPXqt8o6y151ls2hpkfOCMLnhhPMk4pVqbIkFZnVs3ri63WpmgsGmlTob8iHfDDGCmjHp1rE1hL3CU0Ek3kugSR4FdYYtV640UGDiBZNhLMZoXBXV0YmJ6+tgV2fQ/mRpNzJOnDMkLqAL3MIDhDroCeF5WvAKe1wQvUDrPN3gLX0uyXQB/z/kEE13PAJJHjIRROl6QMex0GJPRQI9vBJg1dA1MavwCMGXqNJjA8AIqYQbM/B/+c1UCzL48t2FeJRKUpvkCYQEsXASLkcCxZCknZGoAlvmE5ZC2chWs5oSctTmwDgkc6zcw3ho2As8mvobNAFuQkLx123aW8b5iB+zctTsD9rgA9u7bD3AAveLgocNSj87bhyNw9NjxE3DS24dTp88A5FXVu60EL5jPQto5ueU8XKABcfHfP+m/ACxyFct3so845crVa2gW10tvOm7dvnP33v0Hjoelj/hZPJZEYYF9xSm/m+ZzvF8ghgUGiFN/vQ+j8f6hGMYZEfmtN4rLReEo5g08v/VOvsMjw1DYbPhv9Xt8wECsmeAAPLXlXcTxC9vC+Cy8rCycPxuhMQgHAXjQYMyP4CiDgCF/+IIfXc31lIg7B4YAAAAASUVORK5CYII=');background-size: contain;");
    menu.appendChild(mione);
    uh.appendChild(menu);
    uh.setAttribute("contextmenu","abpfilter");

    function abpShowFilter() {
        var fpo = "@@||youtube.com/*&user=";
        var fpt = "$document";
        var ffl = fpo+channelName+fpt;
        var wh = document.getElementById("watch8-action-buttons");
        var wlf = wh.parentNode.querySelector("#whitelistfilter");
        if (!wlf && ffl) {
            var div = document.createElement("div");
            div.setAttribute("id","whitelistfilter");
            div.setAttribute("style", "margin-bottom: 20px;");
            div.innerHTML = "Add the following filter to Adblock Plus:";
            var textarea = document.createElement("textarea");
            textarea.setAttribute("style", "display: block; font-family: monospace");
            textarea.setAttribute("spellcheck","false");
            textarea.setAttribute("rows","1");
            textarea.setAttribute("cols",ffl.length);
            textarea.innerHTML = ffl;
            div.appendChild(textarea);
            wh.parentNode.insertBefore(div, wh);
            textarea.focus();
        }
        else wh.parentNode.removeChild(wlf);
    }

    mione.addEventListener("click",abpShowFilter,false);
}