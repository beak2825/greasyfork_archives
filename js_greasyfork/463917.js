// ==UserScript==
// @name        Google Mail Signature HTML Code Editor
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @version     1.0.1
// @license     AGPL v3
// @author      jcunews
// @description Add an inputbox for editing the HTML code of message signature on General tab of the settings page
// @match       https://mail.google.com/mail/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/463917/Google%20Mail%20Signature%20HTML%20Code%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/463917/Google%20Mail%20Signature%20HTML%20Code%20Editor.meta.js
// ==/UserScript==

((rxBlockTags, timerCheck, eleSigContainer, eleSigHtml, sigHtmlChanged, prevFormatted) => {
  function check(e) {
    if (eleSigContainer = document.querySelector('.Ia .editable[aria-label="Signature"]')) {
      if (!document.getElementById("sigHtml")) {
        if (e = eleSigContainer.closest('.Ia')) e.style.height = "auto";
        eleSigContainer.insertAdjacentHTML("beforebegin", `\
<div style="padding:0 .3em;background:#bdd;font-weight:bold">HTML Code</div>
<textarea id="sigHtml" style="box-sizing:border-box;width:100%;min-height:8em;resize:vertical;font:10pt/1.5em monospace"></textarea>
<div style="padding:0 .3em;background:#bdd;font-weight:bold">Formatted Content</div>`);
        (eleSigHtml = document.getElementById("sigHtml")).oninput = () => {
          sigHtmlChanged = true;
          eleSigContainer.innerHTML = eleSigHtml.value
        };
        prevFormatted = ""
      }
      if (sigHtmlChanged) {
        sigHtmlChanged = false
      } else if (eleSigContainer.innerHTML !== prevFormatted) {
        eleSigHtml.value = prevFormatted = eleSigContainer.innerHTML.replace(rxBlockTags, "$1\n$2")
      }
    } else eleSigContainer = eleSigHtml = null
  }
  rxBlockTags = new RegExp("(>)[ \\t]*?(<(?:\
aside|br|blockquote|body|caption|center|col(?:group)?|datalist|dd|details|dialog|di[rv]|\
fieldset|figcaption|figure|footer|form|frame(?:set)?|h[1-6r]|head(?:er)?|html|\
main|menu|nav|ol|option|p(?:re)|section|summary|table|td|tbody|tfoot|th(?:ead)?|tr|ul\
)>)", "gi");
  (new MutationObserver(recs => {
    clearTimeout(timerCheck);
    timerCheck = setTimeout(check, 100);
    timerCheck = 0
  })).observe(document, {childList: true, subtree: true})
})()
