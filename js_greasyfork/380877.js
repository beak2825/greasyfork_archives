// ==UserScript==
// @name         sexstories.com stories downloader and searcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  from any author's profile on sexstories.com, can select stories to download in a zip or as a series in one aggregated .html file, can also search stories and display frequency of search terms for each story
// @author       DUVish
// @match        https://www.sexstories.com/profile*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380877/sexstoriescom%20stories%20downloader%20and%20searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/380877/sexstoriescom%20stories%20downloader%20and%20searcher.meta.js
// ==/UserScript==

let totalScripts = 3;
let scriptsLoaded = 0;

let scriptTag = document.createElement("script");
scriptTag.src = "https://code.jquery.com/jquery-3.3.1.min.js";
scriptTag.async = false;
scriptTag.type = "text/javascript";
scriptTag.onload = function() {
    scriptsLoaded++;
    //changing title of page
    document.querySelector("title").innerText = document.querySelector("h3").children[0].innerText + "'s profile on sexstories.com";

    //adding button for asyncStatus and search input itself
    let asyncStatus = true;
    document.getElementsByTagName("h3")[1].innerHTML += "<input class='searchStories' placeholder='Search stories'></input><button class='syncButton' title='Switch synchronicity status'>Asynchronous</button><button class='reset'>Reset Search Results</button>";
    document.querySelector("head").innerHTML += `<style>
      .searchStories {
        margin-left: 10px;
      }
      .syncButton {
        margin-left: 10px;
      }
      .tableDataRow {
        font-size: 11px;
        margin-left: 5px;
        margin-right: 5px;
      }
    </style>`;

    $(".syncButton").on("click", function(e) {
      //console.log("async status", asyncStatus);
      asyncStatus = !asyncStatus;
      let status = asyncStatus ? "Asynchronous" : "Synchronous";
      $(".syncButton")[0].innerText = status;
    });

    $(".reset").on("click", function(e) {
      Array.from($(".tableDataRow")).forEach(el => el.remove());
    });

    $(".searchStories").on("keydown", function(e) {
      if (e.key === "Enter") {
        let searchTerm = $(".searchStories").val();
        //console.log("starting event with search term and asyncStatus", searchTerm, asyncStatus);
        Array.prototype.forEach.call(document.getElementsByTagName("tr"), function(node, i) {
          if (i === 0) return;
          let link = node.children[0].children[0].href;
          $.ajax({
            type: "GET",
            async: asyncStatus,
            url: link,
            success: function(data) {
              //console.log("success in ajax call");
              let reg = new RegExp(searchTerm, "gi");
              let idx = $(data).find(".block_panel").length === 2 ? 0 : 1;
              let wordCount = $(data).find(".block_panel")[idx].innerText.match(/\S\s\S/g).length;
              let searchCount = $(data).find(".block_panel")[idx].innerText.match(reg).length;
              //console.log("reg, wordCount, and searchCount", reg, wordCount, searchCount);
              if (node.children.length === 5) node.innerHTML += `<td class='tableDataRow'>${wordCount} words</td>`;
              node.children[0].innerHTML += `<span class='tableDataRow'>(${searchCount} results for ${searchTerm})</span>`;
            },
            error: function(error) {
              //console.log("error in ajax call", error);
            }
          });
        });
      }
    });
};
document.querySelector("head").appendChild(scriptTag);

let zipScr = document.createElement("script");
zipScr.src = "https://cdn.jsdelivr.net/gh/Stuk/jszip/dist/jszip.min.js";
zipScr.async = false;
zipScr.type = "text/javascript";
zipScr.onload = function() {
  scriptsLoaded++;
  if (scriptsLoaded === totalScripts) scriptFunc();
};
document.querySelector("head").appendChild(zipScr);

let fileScr = document.createElement("script");
fileScr.src = "https://cdn.jsdelivr.net/gh/eligrey/FileSaver.js/src/FileSaver.js";
fileScr.async = false;
fileScr.type = "text/javascript";
fileScr.onload = function() {
  scriptsLoaded++;
  if (scriptsLoaded === totalScripts) scriptFunc();
};
document.querySelector("head").appendChild(fileScr);

let currentNumberGlobal = 1;
const author = document.querySelector(".notice").innerText.match(/[^\n]+/)[0];

document.querySelector("head").innerHTML += `
<style>
  .checkOrder {
    width: 30px
  }
  .dlTogether {
    margin-left: 60px;
  }
  .dlSeperately {
    margin-left: 4px;
  }
  .resetSelections {
    margin-left: 6px;
    margin-right: 60px
  }
</style>
`;

function scriptFunc() {
  Array.from(document.querySelector("tbody").children).forEach(el => el.innerHTML += `<div style="display: flex; position: relative; top: 10px;"><input class="checkOrder" type="checkbox"><span class="selectionorder"></span></div>`);

  Array.from(document.getElementsByClassName("checkOrder")).forEach(el => el.addEventListener("click", function(e) {
      if (e.target.checked) e.target.parentNode.children[1].innerText = currentNumberGlobal++;
      else e.preventDefault();
  }));

  document.querySelectorAll(".notice")[1].innerHTML += `<button class="dlTogether">Download Selected chapters as one story (in selection order)</button> <button class="dlSeparately">Download selected stories individually</button> <button class="resetSelections">Reset Selections</button>`;

  //console.log("current dom nodes", document.querySelector(".resetSelections"), document.querySelector(".dlSeparately"));

  document.getElementsByClassName("resetSelections")[0].addEventListener("click", function(e) {
    Array.from(document.getElementsByClassName("checkOrder")).forEach(el => {
      el.checked = false;
      el.parentNode.children[1].innerText = "";
      currentNumberGlobal = 1;
    });
  });

  document.getElementsByClassName("dlSeparately")[0].addEventListener("click", function(e) {
    //console.log("regostered downloading all separately");
    var zip = new JSZip();
    Array.from(document.querySelectorAll(".checkOrder:checked")).forEach(checkedBox => {
      let link = checkedBox.parentNode.parentNode.children[0].children[0].href;
      let htmlFile = "";
      let bodyStr = "";
      let descStr = "";
      let titleStr = "";
      let tagsStr = "";
      $.ajax({
        type: "GET",
        url: link,
        async: false,
        success: (data) => {
          bodyStr = $(data).find(".block_panel")[1].innerHTML.replace(/<!-- VOTES -->[\s\S]+>/, "").trim();
          descStr = $(data).find(".block_panel")[0].innerText.trim().match(/Introduction:[\s\n]+(.+)/i)[1];
          titleStr = $($(data).find(".story_info")[0]).find("h2")[0].innerText.trim().match(/[^\n]+/)[0].trim();
          tagsStr = $($(data).find(".story_info")[0]).find(".top_info")[0].innerText.trim();
        }
      });
      htmlFile = `
<!DOCTYPE html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${titleStr}</title>
</head>
<body>
<div style="text-align:center;font-size: 22px;">
${titleStr}
</div>
<br>
<div style="text-align:center;font-size: 18px;font-style: italic">
${descStr}
</div>
<br>
<div style="text-align:center;font-size: 12px;">
${tagsStr}
</div>
<br>
<br>
${bodyStr}
</body>
`;
      zip.file(titleStr + ".html", htmlFile);
    });
    zip.generateAsync({type:"blob"})
        .then(function (blob) {
        saveAs(blob, `${author}'s Stories`);
    });
  });

    document.getElementsByClassName("dlTogether")[0].addEventListener("click", function(e) {
      let htmlDoc = "";
      let bodyStr = "";
      let lastTitle = "";
      let firstTitle = "";
      let anchorsStr = "";
      Array.from(document.querySelectorAll(".checkOrder:checked")).sort((a, b) => Number(a.parentNode.children[1].innerText) - Number(b.parentNode.children[1].innerText)).forEach((el, idx) => {
        let link = el.parentNode.parentNode.children[0].children[0].href;
        $.ajax({
          type: "GET",
          url: link,
          async: false,
          success: (data) => {
            localBodyStr = $(data).find(".block_panel")[1].innerHTML.replace(/<!-- VOTES -->[\s\S]+>/, "").trim();
            localDescStr = $(data).find(".block_panel")[0].innerText.trim().match(/Introduction:[\s\n]+(.+)/i)[1];
            localTitleStr = $($(data).find(".story_info")[0]).find("h2")[0].innerText.trim().match(/[^\n]+/)[0].trim();
            localTagsStr = $($(data).find(".story_info")[0]).find(".top_info")[0].innerText.trim();
            if (idx === 0) firstTitle = localTitleStr;
            anchorsStr += `<a href="#${idx}" style="text-align:center;">${localTitleStr}</a><br>`;
            bodyStr += `
<div style="text-align:center;font-size: 22px;" id="${idx}">
${localTitleStr}
</div>
<br>
<div style="text-align:center;font-size: 18px;font-style: italic;">
${localDescStr}
</div>
<br>
<div style="text-align:center;font-size: 12px;">
${localTagsStr}
</div>
<br>
<br>
${localBodyStr}
<br>
<br>
`;
            lastTitle = localTitleStr;
          }
        });
      });
      htmlDoc = `
<!DOCTYPE html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${firstTitle} - ${lastTitle}</title>
</head>
<body>
<div style="text-align:center;font-size: 24px;">Table of Contents</div>
<br>
<div style="font-size: 15px; width: 100%; text-align: center; line-height: 1.6">${anchorsStr}</div>
<br>
<br>
${bodyStr}
</body>
`;
      let blob = new Blob([htmlDoc], {type: "text/plain;charset=utf8"});
      saveAs(blob, `${firstTitle} - ${lastTitle} (${currentNumberGlobal - 1} Chapters).html`);
    });
}