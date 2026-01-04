// ==UserScript==
// @name         AABNET copy
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Content copy
// @author       You
// @match        https://aabnet.aab.dk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aab.dk
// @grant        none
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/444019/AABNET%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/444019/AABNET%20copy.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var btn = document.createElement("div");
  btn.innerHTML =
    "<button " +
    'style="position: fixed; right: 50px; top: 70px; width: 120px; height: 40px;"' +
    'class="btn-copy">Copy text</button>';
  document.body.append(btn);
  btn.addEventListener("click", copyText);

  function copyText() {
    document.querySelectorAll(".nav.top").forEach(function (top) {
      top.innerHTML = "";
    });
    var articles = document.querySelectorAll("#content article");
    var newContent = "";

    articles.forEach(function (article) {
      if (article.classList.contains("cntblock_dropdown")) {
        // accordion
        var heder = article.querySelector(".top").innerText;
        var body = article.querySelector(".bottom").innerHTML;

        newContent +=
          "\n<!-- ACCORDION HEADER -->\n" +
          cleanAccHeader(heder) +
          "\n<!-- ACCORDION BODY -->" +
          clean(body) +
          "<!-- ACCORDION END -->\n";
      } else {
        // text
        var text = article.innerHTML;
        newContent += clean(text);
      }
    });

    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = newContent;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    document.querySelector(".btn-copy").innerText = "Copied!";
  }

  function clean(text) {
    //save classes
    text = text.replaceAll('class="RedArrow"', 'className="RedArrow"');
    //remove styles
    text = text.replace(
      /\s(style=")([a-zA-Z0-9:;\.\s\\#?(\)\-\,\_]*)(")/gi,
      ""
    );
    //remove classes and id
    text = text.replace(/\s(class=")([a-zA-Z0-9:;\.\s\(\)\-\,\_]*)(")/gi, "");
    //text = text.replace(/\s(id=")([a-zA-Z0-9:;\.\s\(\)\-\,\_]*)(")/gi, '');
    text = text.replace(/\s(language=")([a-zA-Z0-9:;\.\s\(\)\-\,]*)(")/gi, "");
    //restore classes
    text = text.replaceAll("className=", "class=");
    // links
    // text = text.replaceAll('https://aabnet.aab.dk/', '/');
    //remove spaces
    text = text.replaceAll(/[ \t]{2,}/gi, "");
    //remove line break
    text = text.replaceAll(/\n\n/gi, "\n");
    text = text.replaceAll("\n<br>", "\n");
    text = text.replaceAll("<span></span>", "");
    text = text.replaceAll("<span>\n</span>", "");
    text = text.replaceAll("<span><br>\n</span>", "");
    text = text.replaceAll("<strong>\t</strong>", "");
    text = text.replaceAll("<strong> </strong>", "");
    text = text.replaceAll("<strong>s</strong>", "");
    text = text.replaceAll("<h3><br>\n</h3>", "");
    text = text.replaceAll("<h3></h3>", "");
    text = text.replaceAll("<h3> </h3>", "");
    text = text.replaceAll("<h3>s</h3>", "");
    text = text.replaceAll("<h3><span><br>\n</span></h3>", "");
    text = text.replaceAll("<h3>\n</h3>", "");
    text = text.replaceAll("<h3>\t</h3>", "");
    text = text.replaceAll("<h3>&nbsp;</h3>", "");
    text = text.replaceAll("<p><br>\n</p>", "");
    text = text.replaceAll("<p></p>", "");
    text = text.replaceAll("<p> </p>", "");
    text = text.replaceAll("<p>\n</p>", "");
    text = text.replaceAll("<p>s</p>", "");
    text = text.replaceAll("<p>\t</p>", "");
    text = text.replaceAll("<p>&nbsp;</p>", "");
    text = text.replaceAll("<div>&nbsp;</div>", "");
    text = text.replaceAll("<div>", "");
    text = text.replaceAll("</div>", "");
    text = text.replaceAll("<br><br>", "\n");
    text = text.replaceAll("<br>\n<br>", "\n");
    text = text.replaceAll("\n<h1>", "<h1>");
    return text;
  }
  function cleanAccHeader(text) {
    text = text.replaceAll("<h3>", "");
    text = text.replaceAll("</h3>", "");
    text = text.replaceAll("<p>", "");
    text = text.replaceAll("</p>", "");
    return text;
  }
})();
