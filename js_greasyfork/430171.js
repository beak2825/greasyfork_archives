// ==UserScript==
// @name         Word Tooltip
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPLv3
// @author       jcunews
// @description  Add custom tooltip to words based on a list of word and toolip text (configurable from the GM menu). The Shift+Win / Shift+Command / Shift+Super will highlight all words which have custom tooltip. To use, sites must be manually added via the script configuration.
// @reference    https://www.reddit.com/r/software/comments/ouxp0l/need_chrome_extension_that_reports_text_based_on/
// @match        https://specific-site.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/430171/Word%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/430171/Word%20Tooltip.meta.js
// ==/UserScript==

/*
Warning: this script affects performance, since it has to check each word in the web page text. It is highly recommended to enable it only on specific sites.
*/

((def, dat, drx, erx, obs, a) => {
  function processNode(node, i) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (!["OPTION", "WORD"].includes(node.tagName)) {
          for (i = node.childNodes.length - 1; i >= 0; i--) processNode(node.childNodes[i]);
        }
        break;
      case Node.TEXT_NODE:
        processTextNode(node)
    }
  }
  function processTextNode(node, m, e) {
    drx.lastIndex = 0;
    if (m = drx.exec(node.data)) {
      if (m.index) { //middle
        node = node.splitText(m.index);
      } else { //start
        if (m[0].length < node.data.length) { //partial
          m = node.splitText(m[0].length);
        } else { //whole
          (e = document.createElement("WORD")).textContent = node.data;
          e.title = dat[m[0].toLowerCase()];
          node.replaceWith(e)
        } //else: already processed
      }
    }
  }
  function undo() {
    obs.disconnect();
    document.body.querySelectorAll("word").forEach((e, p) => {
      p = e.parentNode;
      e.replaceWith(e.firstChild);
      p.normalize();
    });
    obs.observe(document.body, {childList: true, subtree: true, characterData: true});
  }
  function parseData(dat, a, z) {
    a = [];
    try {
      dat = dat.split("\n").reduce((r, s, i, k, v) => {
        if ((s = s.trim()) && (s[0] !== "#")) {
          if ((i = s.indexOf("=")) >= 0) {
            k = s.substr(0, i).trim().toLowerCase();
            v = s.substr(i + 1).replace(/\\n/g, "\n");
            if (r[k] === undefined) {
              r[k] = v.trim();
              a.push(k.replace(erx, '\\$1'));
            }
          } else throw 1;
        }
        return r
      }, {});
      return [dat, new RegExp("\\b(?:" + a.join("|") + ")\\b", "gi")]
    } catch(z) {
      alert(`Invalid word list format.

Each line should contain the text word/phrase followed by
a '=' character, then followed by the tooltip word/phrase.

New lines in toolip can be specified as '\\n'.

If there are duplicate text words/phrases (case-insensitive),
only the last one will be effective.

Empty/blank line and lines which start with '#' are ignored.

e.g.

    something=description

    something else=some explanation
    #comments
    more something = line1\\nline2

`);
      return null
    }
  }
  def = `\
#Each line should contain the text word/phrase followed by
#a '=' character, then followed by the tooltip word/phrase.
#
#New lines in toolip can be specified as '\\n'.
#
#If there are duplicate text words/phrases (case-insensitive),
#only the last one will be effective.
#
#Empty/blank lines and lines which start with '#' are ignored.

#common
ftp=File Transfer Protocol
html = Hyper Text Markup Language
http = Hyper Text Transfer Protocol
https = Hyper Text Transfer Protocol (Secure)
gif = Graphic Interchange Format
iso = International Standard Organization
jpeg = Joint Photographic Experts Group
mpeg = Moving Picture Experts Group
png = Portable Network Graphics
text = Text\\n(duh...)
url = Uniform Resource Locator

#technical
ascii = American Standard Code for Information Interchange
avc = Advanced Video Coding
css = Cascading Style Sheet
dom = Document Object Model
json = JavaScript Object Notation
md5 = Message-Digest 5 algorithm
mime = Multipurpose Internet Mail Extensions
pgp = Pretty Good Privacy
sha = Secure Hash Algorithm
uri = Uniform Resource Identifier
utf = Unicode Transformation Format`;
  if ((dat = GM_getValue("wordList")) === undefined) GM_setValue("wordList", dat = def);
  erx = /([\\\/\'*+?|()\[\]{}.^$])/g;
  a = parseData(dat);
  dat = a[0];
  drx = a[1];
  if (document.head) {
    (a = document.createElement("STYLE")).innerHTML = '.wtshow word{background:#00d;color:#ff0}';
    document.documentElement.append(a)
    addEventListener("keydown", ev => {
      if ((ev.key === "OS") && ev.shiftKey) document.body.classList.add("wtshow")
    }, true);
    addEventListener("keyup", ev => {
      if (ev.key === "OS") document.body.classList.remove("wtshow")
    }, true);
    GM_registerMenuCommand("Edit Word List", (e) => {
      (e = document.createElement("DIV")).innerHTML = `<style>
#wtUjs{position:fixed;left:0;top:0;right:0;bottom:0;background:#0007;font:unset;font-family:sans-serif;cursor:pointer}
#wtUjsPop{transform:translateY(-50%);margin:40vh auto 0 auto;border:#007 solid .2em;padding:.5em;width:50vw;background:#fff;color:#000;cursor:auto}
#wtUjsTxt{box-sizing:border-box;width:100%;height:40vh;resize:none}
#wtUjsBtns{margin:1em 0 .5em 0;text-align:center}
#wtUjsBtns>button{margin:0 1em;width:5.2em}
</style>
<div id=wtUjsPop>
  <textarea id=wtUjsTxt></textarea>
  <div id=wtUjsBtns>
    <button id=wtUjsExp>Export...</button>
    <button id=wtUjsImp>Import...</button>
    <button id=wtUjsDef>Default</button>
    <button id=wtUjsRev>Revert</button>
    <button id=wtUjsOk>OK</button>
    <button id=wtUjsCancel>Cancel</button>
  </div>
</div>`;
      e.id = "wtUjs";
      e.onclick = (ev, e) => {
        switch (ev.target.id) {
          case "wtUjsExp":
            (e = document.createElement("A")).download = "wordList.txt";
            e.href = URL.createObjectURL(new Blob([navigator.platform === "Win32" ? wtUjsTxt.value.replace(/\n/g, "\r\n") : wtUjsTxt.value], {type: "text/plain"}));
            e.click();
            setTimeout(u => URL.revokeObjectURL(u), 10000, e.href);
            break;
          case "wtUjsImp":
            (e = document.createElement("INPUT")).type = "file";
            e.onchange = r => {
              r = new FileReader;
              r.onload = () => {
                if (parseData(r = r.result.replace(/\r\n/g, "\n"))) {
                  wtUjsTxt.value = r;
                  wtUjsTxt.focus();
                }
              };
              r.readAsText(e.files[0]);
            };
            e.click();
            break;
          case "wtUjsDef":
            wtUjsTxt.value = def;
            wtUjsTxt.focus();
            break;
          case "wtUjsRev":
            wtUjsTxt.value = GM_getValue("wordList");
            wtUjsTxt.focus();
            break;
          case "wtUjsOk":
            if (e = parseData(wtUjsTxt.value)) {
              dat = e[0];
              drx = e[1];
              GM_setValue("wordList", wtUjsTxt.value);
              undo();
              processNode(document.body);
              wtUjs.remove();
            }
            break;
          case "wtUjs":
          case "wtUjsCancel":
            wtUjs.remove()
        }
      };
      e.querySelector("#wtUjsTxt").value = GM_getValue("wordList");
      document.documentElement.append(e);
      wtUjsTxt.focus();
    });
    (obs = new MutationObserver(recs => recs.forEach(rec => {
      if (rec.type === "childList") {
        rec.addedNodes.forEach(processNode)
      } else processTextNode(rec.target);
    }))).observe(document.body, {childList: true, subtree: true, characterData: true});
    processNode(document.body);
  }
})();
