// ==UserScript==
// @name         Gutencount
// @namespace    https://vox.quartertone.net/
// @version      1.6.6
// @description  Accurate word counter for Gutenberg texts
// @author       quartertone
// @match        *://*.gutenberg.org/*
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/463785/Gutencount.user.js
// @updateURL https://update.greasyfork.org/scripts/463785/Gutencount.meta.js
// ==/UserScript==

(function() {
    'use strict';
  let monkey = true; //tampermonkey flag
 function wx(text, xtype, anchor = "") {
    // match gutenberg ebook text between START and END markers
    //
    // older iOS browsers do not understand lookbehind assertions or the dot-all /s
    return wc(text.match(/(\*{3} START[\S\s]*?\*{3})([\S\s]*)(?=\*{3} END[\S\s]*?\*{3})/)[2].trim(), xtype, anchor);
  }
  function wc(text, xtype, r = "") {
    // trim whitespace, count non-space things
    // include — (em dash) and ascii --
    let words = text.trim().split(/--|[\s\*—]+/).length;
    if (r) return words; // return the word count as a number if requested; this skips the alert
    cornerbox(words + "\ words,\ " + text.length + "\ chars\nin\ " + xtype);
  }
  function fwx(link, anchor) {
    let booknum = link.match(/(\d*)$/)[1];
    let txtlink = `/cache/epub/${booknum}/pg${booknum}.txt`;
    fetch(txtlink).then((resp) => resp.text()).then((text) => {
      let count = wx(text, "ebook", anchor);

      if (anchor) {
        link = link.replace(/[^\<\\\w:\/\._-]*/g, "");
        // anchor.parentElement.innerHTML += "wc: " + count
        //   + ` | <a href="${link}.html.images">html</a> | <a href="${link}.epub3.images">epub</a>`;
        // OMFG this is so unwieldy
        let ahtml = document.createElement("a");
        ahtml.href=`${link}.html.images`;
        ahtml.innerText="html";
        let aepub = document.createElement("a");
        aepub.href=`${link}.epub3.images`;
        aepub.innerText="epub";
        // let parent = anchor.parentElement;
        // previously was using parent of .cell.content, but something changed, so now we're using anchor
        anchor.append(document.createTextNode("wc: " + count + " | "),ahtml,document.createTextNode(" | "),aepub);
      }
    }).catch((e) => { console.log("fetch error", e,txtlink);}); // alert(e));
  }
  function action() {
    let loc = document.location.toString();
    let sel = window.getSelection() + "";
    if (sel.length > 0) { // selection
      wc(sel, "selection");
    } else if (loc.match(/gutenberg.org\/(files|cache\/epub)\/\d+/)) {
      // gutenberg text
      wx(document.body.innerText, "ebook");
      // Place the onclick listener here and general webpage block
      // so that repeat action() does not trigger in other scenarios
      document.onclick = () => clicklisten();
    } else if (loc.match(/gutenberg.org\/ebooks\/(\d+)/)) {
      // gutenberg main ebook page
      fwx(loc, document.querySelector("#cover .cover-art"));
    } else if (loc.match(/gutenberg.org\/ebooks\/(bookshelf|subject|search|author)\/[\?\d]/)) {
      // gutenberg [list of books] page
      if (confirm("Gutencount: Perform batch word count?")) {
        for (const a of document.querySelectorAll(".booklink>a .cell.content")) {
          //".booklink>a>span:nth-child(2)")) {
          // append word counts to each book section
          // second CHILD of the <a> is the "content" span
          fwx(a.parentElement.href, a);
        }
      }
    } else if (!monkey) { // general webpage
      wc(document.body.innerText, "webpage");
      document.onclick = () => clicklisten();
    }
  }
  action();
  function cornerbox(wcount) {
    let xcount = document.getElementById("xcount") || document.createElement("div");
    xcount.id = "xcount";
    xcount.style = "font-size:min(20pt,5vw);position:fixed;top:0;right:0;width:10em;height:2em;background:#333c;color:#fff;z-index:10000;padding:0.5em;text-align:right;";
    xcount.innerText = "";
    xcount.ondblclick = function () {
      this.remove();
    };
    document.body.appendChild(xcount);
    xcount.innerText = wcount;
    console.log(xcount);
  }
  function clicklisten() {
    let sel = document.getSelection();
    if (sel.toString().length == 0) {
      let ischap, isachap;
      try {
        ischap = sel.anchorNode.parentNode.tagName.match(/^H\d/)
          || sel.anchorNode.parentNode.className == "ph1"; // to match pseudo chapters headlined with P tag
        isachap = sel.anchorNode.parentNode.parentNode.tagName.match(/^H\d/); // to match headings that are wrapped in both A and H_ tags
      } catch (e) { }
      if (ischap || isachap) {
        let range = document.createRange();
        // set beginning and end nodes depending on whether H_ or H_>A
        let a = isachap ? sel.anchorNode.parentNode.parentNode : sel.anchorNode.parentNode;
        let b = isachap ? sel.anchorNode.parentNode.parentNode.nextElementSibling : sel.anchorNode.parentNode.nextElementSibling;
        while (b.nextElementSibling) {
          if (b.nextElementSibling && (b.nextElementSibling.tagName.match(/^(H\d|SECTION)/) || b.nextElementSibling.className == "ph1")) break;
          b = b.nextElementSibling;
        }
        sel.removeAllRanges();
        range.setStartAfter(a);
        range.setEndAfter(b);
        sel.addRange(range);
      }
    }
    action();
  }
})();