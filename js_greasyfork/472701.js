// ==UserScript==
// @name         自动下载
// @namespace    http://www.nite07.com/
// @version      0.3
// @description  自动下载助手
// @author       Nite07
// @match        https://oxy.st/d/*
// @match        https://oxy.cloud/d/*
// @match        https://uploadrar.com/*
// @match        https://en.taiwebs.com/*
// @match        https://taiwebs.com/*
// @match        https://br0wsers.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472701/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/472701/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(() => {
    console.log("Script start!");
    switch (window.location.host) {
        case "oxy.cloud":
        case "oxy.st":
            console.log("catch oxy.st");
            oxy();
            break;
        case "uploadrar.com":
            console.log("catch uploadrar.com");
            uploadrar();
            break;
        case "taiwebs.com":
        case "en.taiwebs.com":
            console.log("catch en.taiwebs.com");
            taiwebs();
            break;
        case "br0wsers.com":
            console.log("catch br0wsers.com");
            br0wsers();
            break;
    }
})();

function oxy() {
    let linkElem = document.querySelector("#divdownload>div");
    if (linkElem) {
        let link = linkElem.dataset["source_url"];
        console.log("下载链接： " + link);
        window.location.href = link;
    }
}

function uploadrar() {
    let freeDownloadBtn = document.querySelector('input[name="method_free"]');
    let createDownloadLinkBtn = document.querySelector("button#downloadbtn");
    let downloadBtn = document.querySelector("span#direct_link>a");
    if (freeDownloadBtn) {
        freeDownloadBtn.click();
    }
    if (createDownloadLinkBtn) {
        createDownloadLinkBtn.click();
    }
    if (downloadBtn) {
        downloadBtn.click();
    }
}

function taiwebs() {
    let downloadBtn = document.querySelector(".main-download-bottom>a");
    if (downloadBtn) {
        window.location.href = downloadBtn.getAttribute("href");
    }
}

function br0wsers() {
    let matchRes = window.location.pathname.match(/-(\d+)-(\d+)\.html/);

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://br0wsers.com/data.php",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data: `ils=${matchRes[2]}&tlv=${matchRes[1]}&actions=bannersxyz`,
        onload: function (response) {
            let matchRes = response.responseText.matchAll(
                /(https:\/\/.*?\.dl-(file|faster)\.xyz\/.*?)(?=")/g
            );
            let res = [...matchRes];
            let matchRes2 =
                response.responseText.matchAll(/Download Server #\d/g);
            let res2 = [...matchRes2];
            if (res.length == res2.length && res.legth > 0) {
                window.location.href = res[0][0];
            }
        },
    });

    let downloadBtns = document.querySelectorAll(".downl_2.js0");
    if (downloadBtns.length == 1) {
        downloadBtns[0].click();
    }
}
