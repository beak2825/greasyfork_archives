// ==UserScript==
// @name         Emoji & Symbol Picker
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.1.7
// @author       jcunews
// @license      GNU AGPLv3
// @description  Adds ability to input emoji and symbol characters via picker popup which is accessible using ALT+` (ALT and backquote) keyboard shortcut (configurable in the script). Character will be generated at the (blinking) cursor. If there's text selected, the character will replace the selection. Note: this script will not work on inputboxes whose keyboard inputs is script driven. e.g. WYSIWYG text boxes.
// @match        *://*/*
// @include      *:*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381112/Emoji%20%20Symbol%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/381112/Emoji%20%20Symbol%20Picker.meta.js
// ==/UserScript==

((eleHdr, eleFontSize, eleAll, prevEleDown, eleDown, dragBaseX, dragBaseY, dragStartX, dragStartY, eleFocus, a, b) => {

  //=== CONFIGURATION BEGIN ===

  //hotkey setting to show/hide picker panel
  var hotkeyCtrl  = false;
  var hotkeyShift = false;
  var hotkeyAlt   = true;
  var hotkeyKey   = "`";

  //=== CONFIGURATION END ===

  var blocks = [
    "Emoticons (1F600-1F64F)",
    "Supplemental Symbols and Pictographs (1F900-1F9FF)\u{1f985}",
    "Miscellaneous Symbols and Pictographs (1F300-1F5FF)",
    "Transport and Map Symbols (1F680-1F6FF)",
    "Miscellaneous Symbols (2600-26FF)",
    "Dingbats (2700-27BF)",
    "Arrows (2190-21FF)",
    "Miscellaneous Symbols and Arrows (2B00-2BFF)",
    "Supplemental Arrows-C (1F800-1F8FF)",
    "Miscellaneous Technical (2300-23FF)",
    "Geometric Shapes (25A0-25FF)\u25a4",
    "Geometric Shapes Extended (1F780-1F7FF)\u{1f78a}",
    "Block Elements (2580-259F)\u258a",
    "Box Drawing (2500-257F)\u2554"
  ];
  var fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 96, 120, 144, 176, 208, 240];

  function isEditable(e) {
    while (e) {
      if (e.contentEditable === "true") return true;
      e = e.parentNode;
    }
    return false;
  }

  function panelMove(e) {
    panel.style.left = dragBaseX + (e.screenX - dragStartX) + "px";
    panel.style.top = dragBaseY + (e.screenY - dragStartY) + "px";
  };

  function panelResize(e) {
    panel.style.width = dragBaseX + (e.screenX - dragStartX) + "px";
    panel.style.height = dragBaseY + (e.screenY - dragStartY) + "px";
  };

  function selectBlock() {
    panel.querySelector(".ekResize~.ekButton.selected").classList.remove("selected");
    this.classList.add("selected");
    panel.querySelector(".ekBlock.selected").classList.remove("selected");
    panel.querySelector(`.ekBlock[index="${this.getAttribute("index")}"]`).classList.add("selected");
    panel.querySelector(".ekBody").scrollTo(0, 0);
  }

  if (document.contentType === "application/xml") return;
  var to = {createHTML: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to, html = s => tp.createHTML(s);
  var panel = document.createElement("DIV");
  panel.id = "ekPanel";
  panel.innerHTML = html(`<style>
#ekPanel{display:block;position:fixed;z-index:999999999;left:33vw;top:33vh;box-shadow:0 0 10px 0;border:2px solid #000;border-radius:6px;box-sizing:border-box;min-width:58ex;width:58ex;max-width:99vw;min-height:6.8em;max-height:99vh;height:12em;background:#fff;font:normal normal normal 12pt/normal sans-serif}
#ekPanel *{font:inherit}
.ekContent{display:flex;flex-direction:column;position:relative;width:100%;height:100%}
.ekHeader{flex-shrink:1;margin:0;padding:0 0 .15em .5ex;background:#000;color:#fff;cursor:move}
.ekButton{display:inline-block;vertical-align:top;width:1.5em;height:1.5em;text-align:center;cursor:pointer}
#ekPanel .ekClose{float:right;border-radius:4px;background:#f00;font-size:84%}
.ekBody{display:block;flex-shrink:1;height:100%;overflow-y:scroll}
.ekBlock{display:none}
.ekBlock.selected{display:block}
.ekBlock .ekButton{margin:0 .3ex .3ex 0}
.ekBlock .ekButton:hover{background:#ddf}
.ekFooter{display:block;flex-shrink:1;border-top:1px solid #000}
.ekResize{position:absolute;right:0;bottom:0;border-top:1em solid #fff;border-right:1em solid #bbb;width:auto;height:auto;cursor:se-resize}
.ekResize~.ekButton{margin-right:.3ex;border-radius:4px}
.ekResize~.ekButton.selected{background:#bdb}
.ekResize~.ekButton:hover{background:#ddf}
.ekResize~.ekButton:last-child{margin-right:1.5em}
#ekPanel .ekFontSize{margin-left:2ex;font-size:84%}
</style>
<div class="ekContent">
  <h4 class="ekHeader"><div class="ekClose ekButton">&#x2716;</div>Emoji &amp; Symbol Picker</h4>
  <div class="ekBody"></div>
  <div class="ekFooter">
    <div class="ekResize ekButton"></div>
    <select class="ekFontSize"></select>
  </div>
</div>`);
  panel.addEventListener("mousedown", e => {
    if (document.activeElement && (document.activeElement !== eleFontSize)) eleFocus = document.activeElement;
    prevEleDown = eleDown;
    eleDown = e.target;
    if (((prevEleDown === eleFontSize) && (eleDown === eleFontSize)) || !eleDown || !["SELECT", "OPTION"].includes(eleDown.tagName)) {
      eleDown = null;
      e.preventDefault();
      eleFocus && eleFocus.focus();
    }
  });
  (eleHdr = panel.querySelector(".ekHeader")).onmousedown = e => {
    if ((e.buttons !== 1) || (e.target !== eleHdr)) return;
    e.preventDefault();
    dragBaseX = panel.offsetLeft;
    dragBaseY = panel.offsetTop;
    dragStartX = e.screenX;
    dragStartY = e.screenY;
    addEventListener("mousemove", panelMove);
    panel.onmouseup = function(e) {
      removeEventListener("mousemove", panelMove);
      panel.onmouseup = null;
    };
  };
  panel.querySelector(".ekClose").onclick = () => {
    panel.remove();
    eleFocus && eleFocus.focus();
    eleFocus = null;
  };
  (a = panel.querySelector(".ekBody")).addEventListener("click", (e,c,s,d,f) => {
    if (((e = e.target).className !== "ekButton") || !eleFocus) return;
    if ((eleFocus.tagName === "TEXTAREA") || ((eleFocus.tagName === "INPUT") && (eleFocus.type === "text"))) {
      a = eleFocus.selectionStart;
      b = eleFocus.selectionEnd;
      if (a > b) {
        c = a; a = b; b = c;
      }
      eleFocus.value = eleFocus.value.slice(0, a) + e.textContent + eleFocus.value.slice(b);
      eleFocus.selectionStart = eleFocus.selectionEnd = a + e.textContent.length;
    } else if (isEditable(eleFocus) && (s = getSelection())) {
      eleFocus && eleFocus.focus();
      if (("InstallTrigger" in window) && (s.rangeCount > 1)) {
        //Firefox can't mix text and element nodes in a selection. So if there's multiple seletion ranges, merge them into one range.
        a = s.getRangeAt(s.rangeCount - 1);
        b = a.endContainer;
        c = a.endOffset;
        s.collapseToStart();
        a = s.getRangeAt(0);
        a.setEnd(b, c);
      }
      s.deleteFromDocument();
      a = s.getRangeAt(0);
      b = a.startContainer;
      c = a.startOffset;
      if (b.nodeType === Node.ELEMENT_NODE) {
        b.insertBefore(document.createTextNode(e.textContent), b.childNodes[c]);
      } else b.data = b.data.slice(0, c) + e.textContent + b.data.slice(c);
      a.setStart(b, c + e.textContent.length);
      a.setEnd(b, c + e.textContent.length);
    }
  });
  b = panel.querySelector(".ekFooter");
  blocks.forEach((n,i,e,d,s,j,h) => {
    b.insertBefore(e = document.createElement("DIV"), b.lastElementChild);
    j = n.lastIndexOf(")");
    if (j < (n.length - 1)) {
      s = n.codePointAt(j + 1);
      n = n.slice(0, j + 1);
    }
    e.title = n;
    d = n.match(/\((.*)-(.*)\)/);
    d.shift();
    d = d.map(v => parseInt(v, 16));
    e.textContent = String.fromCodePoint(s || d[0]);
    e.className = "ekButton" + (i ? "" : " selected");
    e.setAttribute("index", i);
    e.onclick = selectBlock;
    e = document.createElement("DIV");
    e.className = "ekBlock" + (i ? "" : " selected");
    e.setAttribute("index", i);
    s = "";
    for (j = d[0]; j <= d[1]; j++) {
      h = j.toString(16).toUpperCase();
      s += `<div class="ekButton" title="Character code ${j} (0x${("0000000" + h).slice(j > 0xffffff ? 0 : j > 0xffff ? -6 : -4)})">&#x${h};</div>`;
    }
    e.innerHTML = html(s);
    a.appendChild(e);
  });
  (eleAll = Array.from(panel.querySelectorAll("*"))).unshift(panel);
  eleFontSize = panel.querySelector(".ekFontSize");
  fontSizes.forEach(v => {
    eleFontSize.appendChild(b = document.createElement("OPTION"));
    b.textContent = v + "pt";
    (v === 12) && (b.selected = true);
  });
  eleFontSize.onchange = () => {
    panel.querySelector(".ekBody").style.fontSize = eleFontSize.value;
    eleFocus && eleFocus.focus();
  };
  panel.querySelector(".ekResize").onmousedown = e => {
    if (e.buttons !== 1) return;
    e.preventDefault();
    dragBaseX = panel.offsetWidth;
    dragBaseY = panel.offsetHeight;
    dragStartX = e.screenX;
    dragStartY = e.screenY;
    addEventListener("mousemove", panelResize);
    panel.onmouseup = function(e) {
      removeEventListener("mousemove", panelResize);
      panel.onmouseup = null;
    };
  };

  addEventListener("keydown", e => {
    if ((e.ctrlKey !== hotkeyCtrl) || (e.shiftKey !== hotkeyShift) || (e.altKey !== hotkeyAlt) || (e.key.toUpperCase() !== hotkeyKey.toUpperCase())) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (panel.parentNode) {
      panel.remove();
      eleFocus && eleFocus.focus();
    } else {
      eleFocus = document.activeElement;
      eleDown = null;
      document.body.appendChild(panel);
    }
  }, true);

})();
