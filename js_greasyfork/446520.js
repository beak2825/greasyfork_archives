// ==UserScript==
// @name           eBird media downloader
// @name:zh-CN    eBird媒体下载器
// @namespace      https://github.com/sun-jiao
// @match          https://*.ebird.org/*
// @match          https://*.macaulaylibrary.org/*
// @match          https://birdsoftheworld.org/*
// @grant          GM_xmlhttpRequest
// @version        3.0
// @author         Sun Jiao
// @license        GPL_v3
// @description    Add a button to download the medias from eBird or view it in browser.
// @description:zh-cn   添加从eBird下载媒体或在浏览器中浏览的按钮
// @downloadURL https://update.greasyfork.org/scripts/446520/eBird%20media%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/446520/eBird%20media%20downloader.meta.js
// ==/UserScript==


const PREFIX = 'https://cdn.download.ams.birds.cornell.edu/api/v1/asset/';
const SUFFIX = '/2400';
const SPEC = '/spectrogram_small';
const AUDIO = '/audio';
const VIDEO = '/mp4/1280';

var download = "Download";

(function() {
    'use strict';

    setDownload();

    try {
        ebird()
    } catch (error) {
        console.error(error);
    }

    window.addEventListener('load', function () {
        try {
            ebird()
        } catch (error) {
            console.error(error);
        }
    })

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs
        try {
            ebird()
        } catch (error) {
            console.error(error);
        }
        // console.log(mutations, observer);
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
        subtree: true,
        attributes: true
    });
})();

function setDownload(){
    var userLang = navigator.language || navigator.userLanguage;
    switch(userLang.split("-")[0]){
        case("zh"):{
            download = "下载";
            break;
        }
        case("fr"):{
            download = "Télécharger";
            break;
        }
        case("ja"):{
            download = "ダウンロード";
            break;
        }
        case("uk"):{
            download = "Завантаження файлів";
            break;
        }
        case("ko"):{
            download = "다운로드";
            break;
        }
        case("ru"):{
            download = "скачать";
            break;
        }
        case("pt"):{
            download = "Baixar";
            break;
        }
    }
}

function ebird(){
    let lists = document.getElementsByClassName('Lightbox-links');
    for (const list of lists) {
        var href1 = list.getElementsByTagName("div").at(-1).getElementsByTagName("a")[0].getAttribute("href");
        let ID = getID(href1);
        process(list, ID);
    }

    if (window.location.hostname == "macaulaylibrary.org") {
        let lists2 = document.getElementsByClassName("actions");
        for (const list of lists2) {
            let ID = getID(window.location.href);
            process(list, ID);
        }
    }
}

function process(list, ID){
    console.log('ID:' + ID);

    var href = PREFIX + ID + SUFFIX;

    if (document.getElementsByClassName("SpectrogramPlayer").length > 0){
        href = PREFIX + ID + AUDIO;
    } else if (document.getElementsByClassName("VideoPlayer-video").length > 0){
        href = PREFIX + ID + VIDEO;
    }

    if(list.getElementsByClassName("Raccoon-s-script").length > 0){
        return;
    }

    var text = "\t<div class=\"Raccoon-s-script\">\r\t\t\t\t<a target=\"_blank\" rel=\"noopener\" class=\"\" href=\"" + href + "\">\r\t\t\t\t\t<svg class=\"Icon Icon--download\" role=\"img\"><use xlink:href=\"#Icon--download\"></use></svg>\r\t\t\t\t\t" + download + "\r\t\t\t\t</a>\r\t\t\t</div>"
    var downloadBtn = stringToHTML(text);
    var new_div = downloadBtn.getElementsByTagName("div")[0]
    list.appendChild(new_div);
}

function getID(href){
    //一般来说该媒体文件在Macaulay Library的链接的末尾即是媒体id，例如：https://macaulaylibrary.org/zh-CN/asset/230539581
    //有些情况下，上面那种链接之后还会以#号或者?问号为分隔附一段，应当被删除。
    //例如：https://macaulaylibrary.org/asset/180854341#_ga=2.225998489.2098077357.1654784315-1293864495.1651583523
    //或者：https://macaulaylibrary.org/asset/180854341?_gl=1*v5o4c3*_ga*MTI5Mzg2NDQ5NS4xNjUxNTgzNTIz*_ga_QR4NVXZ8BM*MTY1NDg0MDgwMC4xOC4xLjE2NTQ4NDA4MTQuNDY.#_ga=2.28237631.2098077357.1654784315-1293864495.1651583523
    //有些时候不是以asset结尾，例如：https://macaulaylibrary.org/photo/106358811
    if (href.includes("asset/")){
        return href.split("asset/")[1].split(/[^0-9]/)[0];
    } else {
        return href.split("/").at(-1);
    }
}

/**
 * Convert a template string into HTML DOM nodes
 * Copied from: https://www.codegrepper.com/code-examples/javascript/convert+string+to+html+format+in+javascript
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
function stringToHTML(str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
}

/**
 * In fact this is an official function for Array, but not supported for HTMLCollection.
 * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
 * @param  {Int} num    The index number.
 */
HTMLCollection.prototype.at = function(num) {
    if(num >= 0){
        return this[num];
    } else {
        return this[this.length + num];
    }
};
