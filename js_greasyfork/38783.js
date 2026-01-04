// ==UserScript==
// @name         Save Selected Text To File
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.2.2
// @license      AGPL v3
// @description  Save selection into file as text or HTML code. The selected text or HTML code will be previewed and can be edited before it is saved. The file will be presented as a file download. This script is instended to be used as a bookmarklet using this URL: javascript:ssttf_ujs()
// @author       jcunews
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38783/Save%20Selected%20Text%20To%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/38783/Save%20Selected%20Text%20To%20File.meta.js
// ==/UserScript==

window.ssttf_ujs = function(filename, unclosedTags, sel, ei, ds, dl, tw, th, ta, ps, a, b) {

  //===== CONFIGURATION START =====

  filename = "selected.txt";

  //===== CONFIGURATION END =====

  function saveText(txt, a) {
    a = document.createElement("A");
    a.href = "data:text/plain;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(txt)));
    a.download = filename;
    a.style.cssText = "position:absolute;visibility:hidden";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function reposDialog(s, w, h) {
    h = s.split("\n");
    w = Math.ceil(h.reduce(function(p, v) {
      return v.length > p ? v.length : p;
    }, 0) * tw);
    h = Math.ceil((h.length + 1) * th);
    ta.style.cssText = "width:" + Math.min(w, Math.floor(innerWidth * 50 / 100) - ds) +
      "px!important;height:" + Math.min(h, Math.floor(innerHeight * 90 / 100) - ds) + "px!important";
    dl.style.cssText =
      "left:" + Math.floor((innerWidth - dl.offsetWidth) / 2) + "px!important;" +
      "top:" + Math.floor((innerHeight - dl.offsetHeight) / 2) + "px!important";
  }

  function setText(s) {
    reposDialog(ta.value = s);
  }

  function getText() {
    setText(sel.text || sel);
  }

  function childNodesToText(node, start, end, r, n) {
    r = "";
    for (; start < end; start++) {
      if ((n = node.childNodes[start]).nodeType === Node.ELEMENT_NODE) {
        r += n.outerHTML;
      } else r += n.nodeValue;
    }
    return r;
  }

  function rangeHTML(range, res, node, endNode, n) {

    function getNextDOMNode(node, p, n) {
      if (!node) return null;
      ps.push(node.nodeName);
      if (node === endNode) return null;
      if (n = node.nextSibling) {
        return n;
      } else return getNextDOMNode(node.parentNode);
    }

    res = "";
    if ((node = range.startContainer).nodeType === Node.ELEMENT_NODE) node = node.childNodes[range.startOffset];
    if (range.endContainer.nodeType === Node.ELEMENT_NODE) endNode = range.endContainer.childNodes[range.endOffset];
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node === range.startContainer) {
          if (node === range.endContainer) {
            return res + childNodesToText(node, range.startOffset, range.endOffset);
          } else res += childNodesToText(node, range.startOffset, node.childNodes.length);
        } else {
          res += "<" + node.nodeName.toLowerCase() +
                 Array.prototype.slice.call(node.attributes).reduce(
                   function(r, atr) {
                     return r + " " + atr.name + '="' + atr.value + '"';
                   }, ""
                 ) + (unclosedTags.indexOf(node.nodeName) >= 0 ? " /" : "") + ">";
          if (n = node.firstChild) {
            node = n;
            continue;
          }
        }
      } else {
        if (node === range.startContainer) {
          if (node === range.endContainer) {
            return res + node.nodeValue.substring(range.startOffset, range.endOffset);
          } else res += node.nodeValue.substr(range.startOffset);
        } else if (node === range.endContainer) {
          return res + node.nodeValue.substr(0, range.endOffset);
        } else if (node.nodeType === Node.TEXT_NODE) {
          res += node.nodeValue;
        } else res += "<!--" + node.nodeValue + "-->";
      }
      if (node.nextSibling === a) node = node.nextSibling;
      if (node === endNode) return res;
      if (n = node.nextSibling) {
        node = n;
      } else {
        ps.length = 0;
        node = getNextDOMNode(node.parentNode);
        res += ps.reduce(function(p, v) {
          return p + "</" + v.toLowerCase() + ">";
        }, "");
      }
    }
    return res;
  }

  function getHTML(t) {
    setText(sel.reduce(function(r, range, i) {
      return r + rangeHTML(range);
    }, ""));
  }

  function closeDialog() {
    removeEventListener("resize", onWndResize);
    a.remove();
    document.documentElement.style.overflow = "";
  }

  function save() {
    saveText(ta.value);
    closeDialog();
  }

  function onWndResize() {
    setTimeout(function() {
      reposDialog(ta.value);
    }, 0);
  }

  sel = getSelection();
  ei = [];
  for (a = 0; a < sel.rangeCount; a++) {
    b = sel.getRangeAt(a);
    ei.push({
      startContainer: b.startContainer,
      startOffset: b.startOffset,
      endContainer: b.endContainer,
      endOffset: b.endOffset
    });
  }
  ei.text = sel.toString();
  if ((ei.length === 1) && (ei[0].startContainer === ei[0].endContainer)) {
    if (ei[0].startOffset === ei[0].endOffset) {
      if ((sel = document.activeElement) && ("string" === typeof sel.value) && ("number" === typeof sel.selectionStart)) {
        if (!(sel = sel.value.substring(sel.selectionStart, sel.selectionEnd))) return;
      } else return;
    } else if (ei[0].startContainer.nodeType === Node.TEXT_NODE) {
      sel = ei[0].startContainer.nodeValue.substring(ei[0].startOffset, ei[0].endOffset);
      delete ei.text;
    }
  } else if (!ei.length) return;
  if (document.querySelector('div.saveSelectedTexToFile[id^="ssttf"]')) return;
  unclosedTags = ["BR", "HR", "INPUT", "LINK", "META"];
  sel = ei.text ? ei : sel;
  ei = "ssttf" + (new Date()).getTime();
  a = document.createElement("DIV");
  a.id = ei;
  a.className = "saveSelectedTexToFile";
  a.innerHTML = `
<style>
#${ei}, #${ei} * {
  opacity:1!important; visibility:visible!important;
  position:static!important; z-index:auto!important; left:auto!important; top:auto!important; right:auto!important; bottom:auto!important; float:none!important;
  margin:0!important; vertical-align:baseline!important;
  padding:0!important; width:auto!important; height:auto!important; overflow:visible!important;
  text-align:left!important; text-decoration:none!important; color:#000!important;
  font:normal normal normal 12pt/normal sans-serif!important; cursor:auto!important;
}
#${ei}, #${ei} .curtain {
  display:block!important; position:fixed!important; z-index:999999996!important; left:0!important; top:0!important; right:0!important; bottom:0!important;
  border:none!important; background:transparent!important;
}
#${ei} .curtain {
  opacity:.3!important; z-index:999999997!important; background:#000!important; cursor:pointer!important;
}
#${ei} .dialog {
  display:block!important; z-index:999999998!important; visibility:visible!important; position:absolute!important;
  border:5px solid #55b!important; border-radius:10px!important; padding:10px 10px 0 10px!important;
  box-sizing:border-box!important; max-width:50%!important; max-height:90%!important; background:#fff!important;
}
#${ei} label {
  display:inline!important; margin-left:2ex!important; border:none!important; background:transparent!important; cursor:pointer!important;
}
#${ei} input {
  vertical-align:middle!important;
}
#${ei} button {
  display:inline-block!important; margin-left:2ex!important; padding:0 .5ex!important;
}
#${ei} textarea {
  display:block!important; margin:.5em 0!important;
  box-sizing:border-box!important; min-width:100%!important; min-height:5em!important;
  background:transparent!important; font-family:monospace!important;
}
</style>
<div class="curtain"></div>
<div class="dialog">
  <div style="white-space:nowrap!important">
    Data Type:
    <label for="${ei}text"><input id="${ei}text" name="type" type="radio" checked /> Rendered Text</label>
    <label for="${ei}html"${sel.text ? "" : ' style="color:#bbb!important"'}><input id="${ei}html" name="type" type="radio"${sel.text ? "" : " disabled"} /> HTML Code</label>
    <button id="${ei}save">Save</button>
    <textarea id="${ei}data" wrap="off"></textarea>
  </div>
</div>
`;
  a.children[1].addEventListener("click", closeDialog, true);
  (th = a.querySelector("#" + ei + "text")).addEventListener("click", getText, true);
  a.querySelector("#" + ei + "html").addEventListener("click", getHTML, true);
  a.querySelector("#" + ei + "save").addEventListener("click", save, true);
  ta = a.querySelector("#" + ei + "data");
  ps = [];
  document.body.appendChild(a);
  tw = th.offsetHeight + 1;
  th = th.parentNode.offsetHeight + 1;
  dl = a.lastElementChild;
  ds = dl.offsetHeight - ta.offsetHeight;
  getText();
  document.documentElement.style.overflow = "hidden";
  addEventListener("resize", onWndResize);
  return;
};
