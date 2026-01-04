// ==UserScript==
// @name        NationStates Optimization Assistant
// @namespace   http://www.mwq.dds.nl/ns/results/
// @include     *://www.mwq.dds.nl/ns/results/*
// @include     *://www.nationstates.net/page=show_dilemma/dilemma=*
// @grant       none
// @version     1.6
// @license     MIT
// @author      Mattie Rethyu
// @author      Nanocyberia
// @description Provides links from NationStates issue pages to their NationStates Issue Results pages (http://www.mwq.dds.nl/ns/results/) in a new tab, and highlights stats on there in a way that should make it easier for you to determine how good or bad the option is for you (put the stats in one of the two arrays at the top of the code).
// @downloadURL https://update.greasyfork.org/scripts/503466/NationStates%20Optimization%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/503466/NationStates%20Optimization%20Assistant.meta.js
// ==/UserScript==

//  Define scores which you want to maximize or minimize. Script will highlight the relevant entries on mwq.dds.nl issue results for you based on whether
//  they're guaranteed or just likely to be a benefit or detriment. Dark green = good, light green = likely good, light red = likely bad, dark red = bad.
//  Anything you don't put into either min or max will be gray. If something goes wrong, it remains white, so this way you'll notice. The script will also put
//  a link to the relevant results page on the issue voting page on nationstates.net. No need to search them manually!

//  Define stats to minimize or maximize in the two arrays below. A stat can't be in both at once, but it can be in neither if you don't care about it.
//  Examples:
//    const max = ["Civil Rights","Economy"];
//    const min = ["Death Rate","Crime"];
const max = [];
const min = [];

const divs = document.getElementsByTagName("div");

//  Checks whether a stat in the table is one you intend to minimize or maximize.
function evaluateMinMax(content) {
  //  Extracts just the stat name from the div
  var stat = content.match(/(?! )[A-Za-z :-]+(?= \()/);
  if (!stat) {
    stat = content.match(/(?! )[A-Za-z :-]*/);
  }
  //  Checks if optimized
  for (let i = 0; i < max.length; i++) {
    if (stat == max[i]) {
      return "maximize";
    }
  }
  for (let i = 0; i < min.length; i++) {
    if (stat == min[i]) {
      return "minimize";
    }
  }
  return "ignore"
}

// Checks whether a stat will increase or decrease, and whether it's guaranteed to or can do either.
function evaluateEffect(content) {
  switch (true) {
    case /\+[0-9]+.*[0-9]* to \+[0-9]+.*[0-9]*[A-Za-z] \+[0-9]+.*[0-9]*/.test(content) || /^\+[0-9.]* [A-Za-z :-]*/.test(content):
      return "alwaysPos";
    case /\-[0-9]+.*[0-9]* to \+*[0-9]+.*[0-9]*[A-Za-z] \+[0-9]+.*[0-9]*/.test(content):
      return "usuallyPos";
    case /\-[0-9]+.*[0-9]* to \+*[0-9]+.*[0-9]*[A-Za-z] \-[0-9]+.*[0-9]*/.test(content):
      return "usuallyNeg";
    case /\-[0-9]+.*[0-9]* to \-[0-9]+.*[0-9]*[A-Za-z] \-[0-9]+.*[0-9]*/.test(content) || /^-[0-9.]* [A-Za-z :-]*/.test(content):
      return "alwaysNeg";
    default:
      return "error";
  }
}

//  Iterates for all the values in the table on the issue results page.
if (window.location.host=="www.mwq.dds.nl") {
  for (let i = 0; i < divs.length; i++) {

    let content = divs[i].innerHTML;
    let minMax = evaluateMinMax(content);
    let effect = evaluateEffect(content);

    //  Example of how to also make the stats italic, bold, or have a specific text color based on whether they're maximized, minimized, or ignored.
    //  Off by default, uncomment to enable. Feel free to change which style affects what.
    //if (minMax == "minimize") {
    //  divs[i].style.fontStyle = "italic";
    //}
    //if (minMax == "maximize") {
    //  divs[i].style.fontWeight = "bold";
    //}
    //if (minMax == "ignore") {
    //  divs[i].style.color = "#fff";
    //}

    if ((effect == "alwaysPos" && minMax == "maximize") || (effect == "alwaysNeg" && minMax == "minimize")) {
      divs[i].style.backgroundColor = "#4C9141";
    }
    if ((effect == "alwaysNeg" && minMax == "maximize") || (effect == "alwaysPos" && minMax == "minimize")) {
      divs[i].style.backgroundColor = "#E72336";
    }
    if ((effect == "usuallyPos" && minMax == "maximize") || (effect == "usuallyNeg" && minMax == "minimize")) {
      divs[i].style.backgroundColor = "#7DC072";
    }
    if ((effect == "usuallyNeg" && minMax == "maximize") || (effect == "usuallyPos" && minMax == "minimize")) {
      divs[i].style.backgroundColor = "#EF6C79";
    }

    //  Comment out the three lines below if you don't want ignored values to be gray.
    if ((minMax == "ignore") && (effect != "error")) {
      divs[i].style.backgroundColor = "#c0c0c0";
    }
  }
}

//  All the below part is for injecting the link on NationStates.
if (window.location.origin=="https://www.nationstates.net") {
  var main = document.getElementById('content');
  var dilemma = document.getElementById('dilemma');
  var volume = document.getElementsByClassName('dpapervol')[0].textContent;
  var volNumber = volume.replace(/VOL. [0-9]* NO. /, '').replace(/,/, '');

  var p = document.createElement('p');
  var img = document.createElement('img'); img.src = "/images/externallink.gif"; img.alt = "External link arrow"; img.className = "exlink";
  var a = document.createElement('a'); a.textContent = "Issue #" + volNumber + " Results"; a.title = "Issue #" + volNumber + " Results"; a.href = "https://www.mwq.dds.nl/ns/results/" + volNumber + ".html"; a.target = "_blank";

  p.appendChild(img);
  p.appendChild(a);
  main.insertBefore(p, dilemma);
}