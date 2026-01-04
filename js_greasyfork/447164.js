// ==UserScript==
// @license MIT
// @name         Show Short Summary
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shows a 200 character portion of the summary in the search results
// @author       You
// @match        https://www.royalroad.com/fictions/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447164/Show%20Short%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/447164/Show%20Short%20Summary.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll("div[id^='description-']").forEach(showHide);
    document.querySelectorAll("input[type='checkbox'][id^='showTags']").forEach(cb => cb.setAttribute("onchange", "showDescriptionB(" + cb.id.replace("showTags-", "") + ", this)"));
})();

function showHide(item) {
    item.style.display = "";
    //var items = item.querySelectorAll("p");
    var shortDesc = item.innerText.substr(0, 200) + "..."
    var shortDescEl = document.createElement('div');
    shortDescEl.id = item.id + "_short";
    shortDescEl.innerText = shortDesc;
    shortDescEl.className = "margin-top-10 col-xs-12"
    item.parentElement.appendChild(shortDescEl);
    item.style.display = "none";

}

var scriptInjectHtml = `
function showDescriptionB(id, e) {
    var story = $('#description-' + id)[0];
    var items = story;
    var short_desc = story.parentElement.querySelector("div[id$='_short']");
    if (e.checked){
       story.style.display = "";
       short_desc.style.display = "none";
    }
    else{
       story.style.display = "none";
       short_desc.style.display = "";
    }
}
`
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.id = 'InjectedScript';
newScript.async = true;
newScript.innerHTML = scriptInjectHtml;
var scripts = document.getElementsByTagName('script')[0];
scripts.parentNode.insertBefore(newScript, scripts);