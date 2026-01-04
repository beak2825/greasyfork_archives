// ==UserScript==
// @name         Literotica Author Story Collection Downloader
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Select stories to download from author page on Literotica - will collect all into simplified HTMLs and download as a .zip (includes support for series), can also sort stories
// @author       DUVish
// @match        https://www.literotica.com/stories/memberpage.php?uid=*&page=submissions
// @downloadURL https://update.greasyfork.org/scripts/380561/Literotica%20Author%20Story%20Collection%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/380561/Literotica%20Author%20Story%20Collection%20Downloader.meta.js
// ==/UserScript==

let totalScripts = 2;
let scriptsLoaded = 0;

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

const selectorForPageText = ".panel.article";

function scriptFunc() {
    var zip = new JSZip();

    const author = document.querySelector(".contactheader").innerText;

    document.querySelector("head").innerHTML += `
<style>
.customSaveBtn:hover {
background-color: #9bc7ff !important;
}
.customSaveBtn:active {
background-color: #56a0ff !important;
}
.selectAllBtn:hover {
background-color: #9bc7ff !important;
}
.selectAllBtn:active {
background-color: #56a0ff !important;
}
.selectNotSeriesBtn:hover {
background-color: #9bc7ff !important;
}
.selectNotSeriesBtn:active {
background-color: #56a0ff !important;
}
.titleSort, .ratingSort, .categorySort, .dateSort {
background-color: antiquewhite;
margin: 0px 5px;
padding: 5px 11px;
border-radius: 8px;
}
.titleSort:hover, .ratingSort:hover, .categorySort:hover, .dateSort:hover {
background-color: #ffe2ba;
}
.titleSort:active, .ratingSort:active, .categorySort:active, .dateSort:active {
background-color: #ffd499;
}
.sortText {
font-size: 15px;
align-self: center;
}
</style>
`;
    Array.from(document.querySelectorAll(".root-story, .ser-ttl, .sl")).forEach((el, i) => el.dataset.idx = i);

    Array.from($(".root-story")).forEach(el => el.innerHTML += `<div style="min-width: 120px;position: relative;line-height: 40px;left: 10px;">Save Story: <input class="customSave" style="position: relative;top: 2px;" type="checkbox"></div>`);

    Array.from($(".sl")).forEach(el => el.innerHTML += `<div style="min-width: 120px;position: relative;line-height: 40px;left: 10px;">Save Chapter: <input class="customSave" style="position: relative;top: 2px;" type="checkbox"></div>`);

    Array.from($(".ser-ttl")).forEach(el => el.innerHTML += `<div style="min-width: 120px;position: relative;line-height: 40px;left: 10px;">Save Series: <input class="customSaveSeries" style="position: relative;top: 2px;" type="checkbox"></div>`);


    Array.from(document.querySelectorAll("td")).filter(el => el.innerText === "STORY SUBMISSIONS")[0].parentNode.innerHTML += `<div style="display: flex;justify-content: flex-end;">
    <div class="selectAllBtn" style="width: 155px;;top: 0px;right: -160px;border-radius:8px;background-color: #c6dfff;text-align: center;height: 22px;padding-top: 5px;margin-left: 10px">Select All (Series and Stories)</div>
<div class="selectNotSeriesBtn" style="width: 195px;;bottom: 30px;right: -160px;border-radius:8px;background-color: #c6dfff;text-align: center;height: 22px;padding-top: 5px;margin-left: 10px;margin-right: 10px">Select All Chapters/Stories Individually</div>
<div class="customSaveBtn" style="width: 125px;top: 0px;left: 485px;border-radius:8px;background-color: #c6dfff;text-align: center;height: 22px;padding-top: 5px;margin-right: 20px">Save Selected to Zip</div></div>`;

    document.querySelector(".selectAllBtn").addEventListener("click", function(e) {
      Array.from(document.querySelectorAll(".customSave, .customSaveSeries")).filter(el => el.parentNode.innerText.match(/Series|Story/i)).forEach(el => el.click());
    });

    document.querySelector(".selectNotSeriesBtn").addEventListener("click", function(e) {
      Array.from(document.querySelectorAll(".customSave, .customSaveSeries")).filter(el => el.parentNode.innerText.match(/Chapter|Story/i)).forEach(el => el.click());
    });

    document.querySelector(".customSaveBtn").addEventListener("click", function(e) {
        Array.from(document.querySelectorAll(".customSave:checked")).forEach(el => {
            let htmlFileTitle = el.parentNode.parentNode.children[0].querySelector("a").innerText;
            console.log("Now adding story "+ htmlFileTitle);
            let link = el.parentNode.parentNode.children[0].querySelector("a").href;
            let htmlFileContent;
            $.ajax({
                type: "GET",
                url: link,
                async: false,
                success: function(data) {
                    let firstPageText = getTextFromPage(data);
                    let pages = getNumberOfPages(data);
                    if (pages > 1) {
                        let arr = [];
                        let counter = 2;
                        while(counter <= pages) {
                            arr.push(link + `?page=${counter}`);
                            counter++;
                        }
                        //console.log("adding from array", arr);
                        arr.forEach(newLink => {
                            $.ajax({
                                type: "GET",
                                url: newLink,
                                async: false,
                                success: function(data) {
                                    firstPageText += getTextFromPage(data);
                                }
                            });
                        });
                    }
                    htmlFileContent = `
<!DOCTYPE html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${getTitleFromPage(data)}</title>
</head>
<body>
<div style="text-align:center;font-size: 22px;">
${getTitleFromPage(data)}
</div>
<br>
<div style="text-align:center;font-size: 18px;font-style: italic">
${getDescriptionFromPage(data)}
</div>
<br>
${firstPageText}
</body>
`;
                }
            });
            zip.file(htmlFileTitle + ".html", htmlFileContent);
            console.log("just added one file to zip", htmlFileTitle);
        });
        Array.from(document.querySelectorAll(".customSaveSeries:checked")).forEach(el => {
          let text = el.parentNode.parentNode.children[0].innerText;
          let seriesName = text.split(":")[0];
          let numOfChapters = text.split(" ")[text.split(" ").length - 3];
          let arrOfParts = [];
          let currentPart = el.parentNode.parentNode;
          let seriesCounter = 0;
          let bodyStrWhole = ``;
          while (seriesCounter < numOfChapters) {
            currentPart = currentPart.nextSibling;
            arrOfParts.push(currentPart.children[0].querySelector("a"));
            seriesCounter++;
          }
          //console.log("arr of parts in series", arrOfParts);
          arrOfParts.forEach(part => {
            let link = part.href;
            //console.log("getting one part host link", link);
            let bodyStrPart = ``;
            $.ajax({
              type: "GET",
              url: link,
              async: false,
              success: function(data) {
                    //console.log("host page in one part of series");
                    //console.log($(data));
                    let firstPageText = getTextFromPage(data);
                    let pages = getNumberOfPages(data)
                    if (pages > 1) {
                        let arr = [];
                        let counter = 2;
                        while(counter <= pages) {
                            arr.push(link + `?page=${counter}`);
                            counter++;
                        }
                        //console.log("adding from array series", arr);
                        arr.forEach(newLink => {
                            $.ajax({
                                type: "GET",
                                url: newLink,
                                async: false,
                                success: function(data) {
                                    firstPageText += getTextFromPage(data);
                                }
                            });
                        });
                    }
                  bodyStrWhole += `
<div style="text-align:center;font-size: 22px;">
${getTitleFromPage(data)}
</div>
<br>
<div style="text-align:center;font-size: 18px;font-style: italic">
${getDescriptionFromPage(data)}
</div>
<br>
${firstPageText}
<br>
<br>
                  `;
              }
            });
          });
          let htmlSeriesFile = `
<!DOCTYPE html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${seriesName}</title>
</head>
<body>
${bodyStrWhole}
</body>
          `;
          console.log("about to add series to zip", seriesName);
          zip.file(seriesName + ".html", htmlSeriesFile);
        });
        zip.generateAsync({type:"blob"})
            .then(function (blob) {
            saveAs(blob, `${author}'s Stories`);
        });
    });

  //sorting logic
  Array.from(document.querySelectorAll("tbody"))[6].children[2].innerHTML += `<div class="sortingContainer" style="display: flex; justify-content: space-between;">
    <span class="sortText">Sort by: </span><div class="titleSort sorting">Reset</div><div class="ratingSort sorting">Rating</div><div class="categorySort sorting">Category</div><div class="dateSort sorting">Date</Date>
  </div>`;

  Array.from(document.querySelectorAll(".sorting")).forEach(el => el.addEventListener("click", function(e) {
    let collection = Array.from(document.querySelectorAll(".root-story, .sl"));
    switch(e.target.innerText) {
      case "Reset":
        collection = Array.from(document.querySelectorAll(".root-story, .sl, .ser-ttl"));
        collection.sort((a, b) => Number(a.dataset.idx) - Number(b.dataset.idx));
        break;
      case "Rating":
        collection.sort((a, b) => Number(a.children[0].innerText.slice(-5).slice(0, 4)) - Number(b.children[0].innerText.slice(-5).slice(0, 4)));
        break;
      case "Category":
        let store = {};
        collection.forEach(el => {
          if (store[el.children[2].innerText.trim()]) store[el.children[2].innerText.trim()] = store[el.children[2].innerText.trim()].concat(el);
          else store[el.children[2].innerText.trim()] = [el];
        });
        collection = [];
        Object.keys(store).sort().forEach(key => collection = collection.concat(store[key].sort((a, b) => Number(a.dataset.idx) - Number(b.dataset.idx))));
        break;
      case "Date":
        collection.sort((a, b) => compareDates(b.children[3].innerText, a.children[3].innerText));
        break;
    }
    collection.forEach(el => el.parentNode.appendChild(el));
  }));
}

function getTextFromPage(data) {
  let textStr = "";
  let container = $(data)?.find(selectorForPageText)[0]?.childNodes[0]?.childNodes[0];
  Array.from(container.childNodes).forEach(node => node.innerText && node.innerText.trim().length ? textStr += node.outerHTML : null);
  return textStr;
}

function getNumberOfPages(data) {
  let parsedData = $(data).find(".l_bJ");
  let maxPage = 1;
  for (let key in parsedData) {
    let parsedNumber = Number(parsedData[key]?.innerText);
    if (!isNaN(parsedNumber) && (parsedNumber > maxPage)) {
      maxPage = Number(parsedData[key]?.innerText);
    }
  }
  return maxPage;
}

function getTitleFromPage(data) {
  return $(data)[2]?.innerText || "Story Title";
}

function getDescriptionFromPage(data) {
  let parsedData = $(data);
  let metaTags = parsedData.find("meta");
  for (let key in parsedData) {
    if (!isNaN(Number(key)) && parsedData[key].name === "description") return parsedData[key].content;
  }
  return "Series Description";
}

function compareStrings(str1, str2) {
  let shorterStr = str1.length > str2.length ? str2 : str1;
  for (let i = 0; i < shorterStr.length; i++) {
    if (str1.toLowerCase().charCodeAt(i) > str2.toLowerCase().charCodeAt(i)) return false;
  }
  return true;
}

function compareDates(strDate1, strDate2) {
  let arr1 = strDate1.split("/").map(el => Number(el));
  let arr2 = strDate2.split("/").map(el => Number(el));
  let num1 = (arr1[2] * 10000) + (arr1[0] * 100) + (arr1[0]);
  let num2 = (arr2[2] * 10000) + (arr2[0] * 100) + (arr2[0]);
  return num1 > num2 ? false : true;
}