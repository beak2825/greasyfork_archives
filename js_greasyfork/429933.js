// ==UserScript==
// @name         Google Scholar Oneclick Copy Bib
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  One click to copy the bib information of each google scholar entry. The bib information will be automatically copied into the clipboard.
// @author       Maple
// @include      https://scholar.google.com*
// @include      https://scholar.google*
// @icon         https://icon-icons.com/downloadimage.php?id=130918&root=2108/ICO/64/&file=google_scholar_icon_130918.ico
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/429933/Google%20Scholar%20Oneclick%20Copy%20Bib.user.js
// @updateURL https://update.greasyfork.org/scripts/429933/Google%20Scholar%20Oneclick%20Copy%20Bib.meta.js
// ==/UserScript==

//Sleep function
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function openbib(event){
    var abib = (event.target || event.srcElement);
    abib.parentElement.querySelector("a.gs_or_cit.gs_nph").click();
    while(1){
        try{
            await sleep(100);
            var a = document.querySelector("a.gs_citi");
            await get_bib_url(a.href);
            await sleep(100);
            window.history.go(-1);
            console.log(a.href)
            //document.querySelector("a.gs_citi").click();
            break;
        }catch(e){
        }
    }
}

async function get_bib_url(gurl){
    GM.xmlHttpRequest({
        method: "GET",
        url: gurl,
        onload: function(response) {
            var bibtxt = response.response;
            copyToClipboard(bibtxt);
            //window.history.go(-1);
        }
    });
}


var items = document.querySelectorAll("div.gs_ri div.gs_fl");
for (var item of items){
    var bib = document.createElement('a');
    bib.innerHTML = "Copy Bib"
    bib.setAttribute ('class', 'abib');
    bib.setAttribute ('style', 'display:inline; color: #180EA4 !important;');
    bib.setAttribute ('href', '#');
    //bib.setAttribute ('onclick', 'openbib(this);');
    bib.addEventListener (
        "click", openbib, false
    );
    item.appendChild (bib);
}


//============================================================

/*const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.focus();
  el.select();
  console.log(el);
  //var result = document.execCommand('copy');
  console.log(result);
  document.body.removeChild(el);
};*/

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function copyToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

/*
if(window.location.href.includes("googleusercontent")){
    //document.body.innerText
    //console.log(document.body.innerText)
    //copyToClipboard(document.body.innerText);
    //await sleep(500);
    //window.history.go(-2);
}
*/

