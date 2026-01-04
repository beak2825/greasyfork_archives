// ==UserScript==
// @name         LoversLab Download All ++
// @namespace    N/A
// @version      0.4
// @description  Adds a download all button to loverslab
// @author       viatana35 inspired by ImNotJackie's script
// @match        https://www.loverslab.com/*?do=download
// @icon         https://www.google.com/s2/favicons?sz=64&domain=loverslab.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460082/LoversLab%20Download%20All%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/460082/LoversLab%20Download%20All%20%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var newRow = document.getElementsByClassName("ipsDataItem")[0].cloneNode(true);
    var amount = document.querySelector("#ipsLayout_mainArea > div:nth-child(2) > div > p").innerHTML.toString();
    var size = document.getElementsByClassName("ipsType_reset ipsDataItem_meta");
    var num = 0;

    for (var i = 1; i < size.length; i++) {
        var test = size[i].textContent.toString().replace("\n                       ","");
        test.substring(0, test.indexOf("\n") - 3);
        var temp = parseFloat(test.substring(0, 5));
        if (test.includes("kB") == true) {
            temp = temp / 10000;
        }
        if (test.includes("MB") == true) {
            temp = temp / 1000;
        }
        num = num + temp;
    }

    num = Math.round(num * 100) / 100
    newRow.firstElementChild.children[1].textContent = "\n                       " + num + " GB Estimated";
    newRow.firstElementChild.firstElementChild.firstElementChild.textContent = "Download all " + amount;
    newRow.lastElementChild.className = "downloadAll";
    newRow.lastElementChild.lastElementChild.removeAttribute("href");
    newRow.lastElementChild.lastElementChild.style.cursor = "pointer";
    newRow.lastElementChild.lastElementChild.addEventListener("click", downloadAll, false);

function downloadAll () {
    var progressBar = document.createElement("div");
    progressBar.style.width = "0";
    progressBar.style.height = "6px";
    progressBar.style.backgroundColor = "#2196F3";
    progressBar.style.position = "fixed";
    progressBar.style.top = "0";
    progressBar.style.left = "0";
    progressBar.style.zIndex = "9999";
    document.body.appendChild(progressBar);

    var buttons = document.getElementsByClassName("ipsButton ipsButton_primary ipsButton_small");
    var total = buttons.length - 1;
    var count = 0;

    for (var i = 1; i < buttons.length; i++) {
        (function(i){
            setTimeout(function(){
                // Set the button color to orange when downloading starts
                buttons[i].style.backgroundColor = "#FFA500";
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function(event) {
                    var blob = xhr.response;
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.href = url;
                    a.download = xhr.getResponseHeader("Content-Disposition").match("filename=\"(.+)\"")[1];

                    a.click();

                    count++;
                    progressBar.style.width = ((count / total) * 100) + "%";

                     // Set the button color to red if there is an error
                     if (xhr.status !== 200) {
                        buttons[i].style.backgroundColor = "#FF0000";
                        buttons[i].style.color = "#FFFFFF";
                     } else {
                        buttons[i].style.backgroundColor = "#00FF00";
                        buttons[i].style.color = "#000000";
                     }

                    if (count == total) {
                        document.body.removeChild(progressBar);
                    }
                };

                xhr.open('GET', buttons[i].href, true);
                xhr.send();
            }, 3000 * i);
        }(i));
    }
}

    document.querySelector("#ipsLayout_mainArea > div:nth-child(2) > div > ul").insertBefore(newRow, document.querySelector("#ipsLayout_mainArea > div:nth-child(2) > div > ul").firstChild);
})();
