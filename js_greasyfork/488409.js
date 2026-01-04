// ==UserScript==
// @name drudgereport-highlighter
// @description Highlights links on Drudge Report based on tabloid/conservative/questionable bias.
// @version 1
// @grant none
// @run-at document-idle
// @include https://drudgereport.com/
// @namespace https://network47.org/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488409/drudgereport-highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/488409/drudgereport-highlighter.meta.js
// ==/UserScript==

el_links = document.getElementsByTagName("a");

const tabloidDomains = [
  "mirror.co.uk",
  "thesun.co.uk",
  "the-sun.com",
  "dailymail.co.uk",
  "dailycaller.com",
  "radaronline.com",
  "bild.com"
];

const conservativeShitholeDomains = [
  "washingtontimes.com",
  "foxnews.com",
  "infowars.com",
  "breitbart.com",
  "newsmax.com",
  "freebeacon.com",
  "realclearpolitics.com"
]

const secondClassDomains = [
  "dnyuz.com",
  "nypost.com",
  "newzit.com",
]

function basename(url) {
  try {
    let back_offset = 0;

    if (url.includes("co.uk")) back_offset = 1;

    let foo = url.split("/")[2].split(".");
    return `${foo[foo.length - 2 - back_offset]}.${
      foo[foo.length - 1 - back_offset]
    }`;
  } catch {
    return "";
  }
}

for (el of el_links) {
  domain = basename(el.href);
  let updated = false;
  if (tabloidDomains.filter((d) => d.includes(domain)).length) {
    el.style.backgroundColor = "darkred";
    el.style.color = "white";
    el.title = "Tabloid";
    updated = true;
  }
  else if (conservativeShitholeDomains.filter((d) => d.includes(domain)).length) {
    el.style.backgroundColor = "#FF0000AA";
    el.style.color = "white";
    el.title = "Conservative Shithole";
    updated = true;
  }
  else if (secondClassDomains.filter((d) => d.includes(domain)).length) {
    el.style.backgroundColor = "darkcyan";
    el.style.color = "white";
    el.title = "Second-class Domain";
    updated = true;
  }

  if (updated) {
    el.style.borderRadius = "4px"
    el.style.padding = "0 0.25em"
    el.title = `${el.title} [${domain}]`

    let tag = document.createElement('span')
    tag.innerHTML = domain
    tag.style.fontFamily = "sans-serif";
    tag.style.fontSize = "8pt";
    tag.style.color = "black"
    tag.style.backgroundColor= "white"
    tag.style.padding = "0 0.25em"
    el.style.paddingBottom = "0.20em"
    tag.style.marginLeft = "0.25em"
    tag.style.borderRadius="10px"
    el.style.textDecoration = "none";

    el.append(tag)
  }

}

console.log("drudgereport-highlighter installed");
