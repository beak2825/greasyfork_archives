// ==UserScript==
// @name         Smile School Video Links to Aria2
// @namespace    https://www.wannaexpresso.com
// @version      0.1
// @description  Export Smile School Video Links to Aria2 format
// @author       DotIN13
// @match        https://smile.shec.edu.cn/html/dbkt.html
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410212/Smile%20School%20Video%20Links%20to%20Aria2.user.js
// @updateURL https://update.greasyfork.org/scripts/410212/Smile%20School%20Video%20Links%20to%20Aria2.meta.js
// ==/UserScript==

window.addEventListener('load', function() {

    // Add button
    var downloadButton = document.createElement("button");
    downloadButton.innerText = "选择下载";
    downloadButton.style = "border: solid 1px black; border-radius: 2px; padding: 2px 4px; margin: 0px 4px;"
    document.querySelector(".dianboCourse p").appendChild(downloadButton);

    var selectAllButton = document.createElement("button");
    selectAllButton.innerText = "全部下载";
    selectAllButton.style = "border: solid 1px black; border-radius: 2px; padding: 2px 4px; margin: 0px 4px;"
    document.querySelector(".dianboCourse p").appendChild(selectAllButton);

    var videos = document.getElementsByTagName("video");
    var checks = [];

    var config = { childList: true };
    var callback = function() {
        // Add checkboxes
        for (var i = 0; i < videos.length; i++) {
            checks[i] = document.createElement("input");
            checks[i].type = "checkbox";
            checks[i].id = "checkbox" + i;
            videos[i].parentNode.appendChild(checks[i]);
        }
    }
    var targetNode = document.querySelector(".videoList");
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    // Select all button
    selectAllButton.addEventListener('click', function() {
        var links = [];
        for (var i = 0; i < videos.length; i++) {
            links[i] = { name: videos[i].nextElementSibling.innerText, link: videos[i].src };
        }
        copyDownloadLinks(handleDuplicates(links));
    })

    // Download button callback
    downloadButton.addEventListener("click", function(){
        var links = [];
        var count = 0;
        for (var i = 0; i < videos.length; i++) {
            if (checks[i].checked) {
                links[count++] = { name: videos[i].nextElementSibling.innerText, link: videos[i].src };
            }
        }
        copyDownloadLinks(handleDuplicates(links));
    })

    function handleDuplicates(links) {
        for (var i = 0; i < links.length; i++) {
            var k = 2;
            for (var j = i + 1; j < links.length; j++) {
                if (links[i].name == links[j].name) {
                    links[j].name += k++;
                }
            }
        }
        return links;
    }

    function copyDownloadLinks(links) {
        var parsedLinks = "";
        for (var i = 0; i < links.length; i++){
            parsedLinks += links[i].link + '\n  out=' + links[i].name.replace(/\*/, "") + '.mp4\n';
        }
        var blob = new Blob([parsedLinks], {type: "text/plain;charset=utf-8"});
        saveAs(blob, 'smile_videos.txt');
    }
})