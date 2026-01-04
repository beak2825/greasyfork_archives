// ==UserScript==
// @name         Export-Names
// @version      1.2
// @namespace    Export-Names
// @description  Export TLD's from Namebase.
// @author       figurestudios
// @match        https://www.namebase.io/manage/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438017/Export-Names.user.js
// @updateURL https://update.greasyfork.org/scripts/438017/Export-Names.meta.js
// ==/UserScript==

let alldomains = "";
let similarity = 0;
let alerts = 0;
let lastappended = "";

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">Export Names</button>';
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    setInterval(function(){
        if (similarity < 5) {
          exportNames();
        } else {
          if (alerts == 0) {
            alerts=1;
            downloadToFile(alldomains, 'domains_list.txt', 'text/plain');
          }
        }
    }, 1000);
}

function exportNames () {
    let currentPage = 1;
    let consumedPage = 0;
    let domains = "";
    let lastdomains = "";

    while (document.URL = "https://www.namebase.io/manage/owned?page=" + currentPage.toString() && consumedPage < currentPage || consumedPage < currentPage && "https://www.namebase.io/manage/listed?page=" + currentPage.toString() + "#marketplace") {
      var words = document.getElementsByClassName("Text__TextStyledElement-sc-9cd9ed-0 fejZys")
      domains = "";
      for (var i = 0; i < words.length; i++) {
        if (words[i]['innerText'].endsWith("/")||words[i]['innerText'].endsWith(")")) {
          domains = domains + "\n" + words[i]['innerText'] + " - https://www.namebase.io/domains/"+words[i]['innerText'].split("/")[0]
        }
      }

      console.log(domains)
      consumedPage += 1;

    }
      if (domains != lastdomains) {
        lastdomains = domains;
        if (lastappended != domains) {
          alldomains += domains;
          lastappended = domains;
        }
        similarity += 1;
      }
    currentPage += 1;
    document.querySelector("#root > div.PageWithLeftNav__PageGrid-sc-14dhb7q-0.hFBWdm > main > div.Grid-sc-12uvu6z-0.UserDomainsPage___StyledGrid-sc-1x6cysy-0.jrlWUP > div.SubRoutesWrapper-sc-5mg983-0.cHhobI > div.Row-vvrjnq-0.LHGLy > div > div > button.PaginationControlStyledComponents__Button-sc-1vr7ndo-3.GprNS").click();
}

const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});

  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

	URL.revokeObjectURL(a.href);
};

GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   -100;
        font-size:              20px;
        background:             white;
        border:                 1px solid #D4DAE2;
        margin:                 5px;
        opacity:                1;
        z-index:                1100;
    }
    #myButton {
        cursor:                 pointer;
        background:             white;
        border:                 0px;
    }
    #myContainer p {
        color:                  black;
        background:             white;
    }
` );

(function() {})();