// ==UserScript==
// @name         Get sgf files
// @name:zh-CN 下载所有棋谱
// @name:zh-TW  下載所有sgf文件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Retrieve all sgf files with one click of a button.
// @description:zh-cn 下载所有棋谱 新浪围棋
// @description:zh-tw  下載所有sgf文件 新浪围棋
// @author       Qiang Li
// @match        http://sinago.com/gibo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421549/Get%20sgf%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/421549/Get%20sgf%20files.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('i am running');

    //
    var hrefs = new Array();
    var els = document.querySelectorAll(' a[href*="sgf"]')
    var elsarray = [...els]
    let title1;
    let title2;
    let title3;
    var elsarray2 = [];
    elsarray.forEach((xx, index) => {
        // get the url
        let s = xx.href.indexOf("http");
        let e = xx.href.indexOf("sgf");
        let yy = xx.href.substring(s, e + 3);
        // get the text

        if (index % 3 === 0){
            title1 = xx.innerText;
        }else if (index % 3 === 1){
            title2 = xx.innerText;
        }else {

            title3 = xx.innerText;
            //console.log('title1 ' + title1+',title2 '+title2 +', title3 '+title3 )
            // we can create object {title, url}
            elsarray2.push({name: `${title1}黑-${title2}白-${title3}.sgf`,url:yy});
        }
    });
    //console.log(elsarray2);
    // fetch the first one
    async function fetchsgf(url) {
        const res = await fetch(url);
        const sgf = await res.text();
        return sgf;
    }

    // counter
    var counter = 0;
    function download(content, fileName, contentType) {
        console.log(counter++ + '. saving '+fileName);
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    function downloadAll(){
        console.log("downloadall");
        //
        elsarray2.forEach((o, index) => {
            setTimeout(() =>
                  fetch(o.url)
                  .then(response => response.text())
                  .then(data => download(data, index+"."+o.name, 'text/plain'))
                  .catch(error => console.log(error)),index*200)
        });
    }
    function fetch_retry(url, options, n) {
    return fetch(url, options).catch(function(error) {
        console.log('error occured');
        console.error(error);
        if (n === 1) throw error;
        return fetch_retry(url, options, n - 1);
    });
}
    AddYT();
    //download(jsonData, 'json.txt', 'text/plain');
    //fetch(elsarray2[0].url)
    //    .then(response => response.text())
    //    .then(data => download(data, elsarray2[0].name, 'text/plain'));

    function AddYT() {
    var buttonDiv = document.createElement("td");
    buttonDiv.id = "punisher";
    buttonDiv.style.width = "80";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("下载棋谱"));
    addButton.style.width = "100%";
    addButton.style.cursor = "pointer";
    addButton.style.height = "inherit";
     addButton.style.backgroundColor ="red";
     addButton.style.color = "white";

    addButton.style.border = "0";
    addButton.style.borderRadius = "2px";
    addButton.style.fontSize = "1rem";
    addButton.style.fontFamily = "inherit";
    addButton.style.textAlign = "center";
    addButton.style.textDecoration = "none";
    addButton.onclick = downloadAll;
    buttonDiv.appendChild(addButton);
    var targetElement = document.querySelectorAll("select");
    var tp = targetElement[0].parentNode.parentNode;

    tp.appendChild(buttonDiv);

}
})();