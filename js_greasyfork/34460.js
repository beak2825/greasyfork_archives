// ==UserScript==
// @name            Pzy.be transloader for firefox
// @namespace       https://www.pzy.be
// @description     Adds right click transload options for Firefox e10s
// @version         1.0
// @author          Casinaar
// @include         *
// @exclude         file://*
// @grant           GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/34460/Pzybe%20transloader%20for%20firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/34460/Pzybe%20transloader%20for%20firefox.meta.js
// ==/UserScript==

if (!("contextMenu" in document.documentElement &&
      "HTMLMenuItemElement" in window)) return;

var body = document.body;
body.addEventListener("contextmenu", initMenu, false);

var menu = body.appendChild(document.createElement("menu"));
menu.outerHTML = '<menu id="userscript-uploadbtn" type="context">\
                    <menuitem label="Upload to Pzy.be"></menuitem>\
                  </menu>';

document.querySelector("#userscript-uploadbtn menuitem")
        .addEventListener("click", searchImage, false);

function initMenu(aEvent) {
  var node = aEvent.target;
  var item = document.querySelector("#userscript-uploadbtn menuitem");
  if (node.localName == "img") {
    body.setAttribute("contextmenu", "userscript-uploadbtn");
    item.setAttribute("imageURL", node.src);
  } else {
    body.removeAttribute("contextmenu");
    item.removeAttribute("imageURL");
  }
}

function addParamsToForm(aForm, aKey, aValue) {
  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", aKey);
  hiddenField.setAttribute("value", aValue);
  aForm.appendChild(hiddenField);
}

function searchImage(aEvent) {
  var imageURL = aEvent.target.getAttribute("imageURL");
      var form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", "https://pzy.be/xload.php");
      form.setAttribute("target", "_blank");
      if(imageURL.startsWith('https://'))
          imageURL=imageURL.replace('s','');
      addParamsToForm(form, "text", imageURL);
      body.appendChild(form);
      form.submit();

}