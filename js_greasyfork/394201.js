// ==UserScript==
// @name         V2EX favorates collection extractor
// @namespace    https://github.com/cxumol/userscripts
// @version      0.1
// @description  lazy livid did not implement https://www.v2ex.com/t/95800 ; please read https://www.v2ex.com/t/632448 for instruction
// @author       cxumol
// @match        https://www.v2ex.com/my/topics*
// @grant        GM_xmlhttpRequest
// @connect      https://www.v2ex.com/my/topics*
// @downloadURL https://update.greasyfork.org/scripts/394201/V2EX%20favorates%20collection%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/394201/V2EX%20favorates%20collection%20extractor.meta.js
// ==/UserScript==

// Editor: Tampermonkey v4.10 for Firefox
// Formater: https://beautifier.io/

window.onload = function() {
    'use strict';

    // Your code here...
    let getAllFav = function() {
        let totalPageNum = Number(document.querySelector(".page_normal:last-of-type").textContent);
        console.log("totalPageNum: " + totalPageNum);
        let presentPageNum = 0;
        //         let topicLinks = Object.values(document.getElementsByClassName("item"));
        let topicLinksO = new Object(); // for keeping the order of pages under async XHRs
        let topicLinks = new Array(); // store topics with original order
        let pageCount = 0;

        if (totalPageNum >= 1) {
            while (presentPageNum < totalPageNum) {
                presentPageNum++;
                // ref https://www.tampermonkey.net/documentation.php?ext=dhdg#GM_xmlhttpRequest
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.v2ex.com/my/topics?p=" + presentPageNum,
                    // responseType: "document", // Greasy Monkey API doesn't support this
                    onload: function(response) {
                        let temp = document.createElement("html");
                        temp.innerHTML = response.responseText;

                        let thisPresentPageNum = Number(temp.getElementsByClassName("page_current")[0].textContent);
                        console.log("got topics from page # " + thisPresentPageNum);
                        topicLinksO[thisPresentPageNum] = Object.values(temp.getElementsByClassName("item"));
                        //
                        pageCount++;
                        if (pageCount == totalPageNum) {
                            console.log("pageCount: " + pageCount);
                            console.log("totalPageNum: " + totalPageNum);
                            for (let i = 1; i <= totalPageNum; i++) {
                                topicLinks = topicLinks.concat(topicLinksO[i]);
                            }
                            showItems(topicLinks);
                            addDownloader();
                        }
                    }
                })
            }
        }
        //         return topicLinks;
    }

    let showItems = function(topicLinks) {
        let resultList = document.createElement("ol");
        console.log("Showing Whole Collection!");
        for (let i of topicLinks) {
            let li = document.createElement("li");
            li.append(i);
            resultList.append(li);
        }
        if (!document.getElementById("showcase")) {
            console.log("Rebuilt!");
            addShowcase();
        }
        document.getElementById("all_fav").append(resultList);
    }
    //
    let doFavExt = function() {
        getAllFav()
    }
    //
    let addShowcase = function() {
        let showcase = document.createElement('div');
        showcase.className = "box";
        showcase.id = "showcase";
        showcase.innerHTML = '<button id="btn_do_fav_ext">Show All Fav Topics</button><div id="all_fav"></div>';
        document.getElementById("Rightbar").append(showcase);
        document.getElementById("btn_do_fav_ext").addEventListener("click", () => doFavExt());
    }
    //
    let addDownloader = function() {
        // https://stackoverflow.com/a/18197341
        var downloader = document.createElement('a');
        downloader.textContent = "Save";
        downloader.className = 'page_current';
        let HTML2down = document.createElement("html");
        HTML2down.innerHTML = `<head>
<meta name="Content-Type" content="text/html;charset=utf-8" />
<link rel="stylesheet" type="text/css" media="screen" href="https://www.v2ex.com/css/basic.css" />
<link rel="stylesheet" type="text/css" media="screen" href="https://www.v2ex.com/static/dist/combo.css" />
<link rel="stylesheet" type="text/css" media="screen" href="https://www.v2ex.com/css/desktop.css" />
<link rel="stylesheet" href="https://www.v2ex.com/static/css/tomorrow.css" type="text/css" />
<link rel="icon" sizes="192x192" href="https://www.v2ex.com/static/img/v2ex_192.png" />
<link rel="shortcut icon" href="https://www.v2ex.com/static/img/icon_rayps_64.png" type="image/png" />
</head><body>` + document.getElementById("all_fav").outerHTML + `</body>`;
        HTML2down.append();
        downloader.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(HTML2down.outerHTML));
        downloader.setAttribute('download', "All_my_V2EX_favorate_collections.html");
        document.getElementById("btn_do_fav_ext").after(downloader)
    }

    // if (document.readyState == 'complete') {
    console.log("Initialize!");
    addShowcase();
    // }


};
