// ==UserScript==
// @name         Pocket Comics PC Search Tool
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      2.1.9
// @description  Implements a Pocket Comics Search engine into the Korean and Japanese sites
// @author       Quin15
// @match        https://api.comico.io/
// @match        https://www.comico.kr/*
// @match        https://www.comico.jp/*
// @match        https://www.comico.kr
// @match        https://www.comico.jp
// @icon         https://www.google.com/s2/favicons?domain=comico.io
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/crypto-js/3.1.2/components/core.js
// @require      http://cdn.bootcss.com/crypto-js/3.1.2/components/enc-base64.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.2/rollups/aes.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.2/rollups/sha256.js

// @downloadURL https://update.greasyfork.org/scripts/429183/Pocket%20Comics%20PC%20Search%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/429183/Pocket%20Comics%20PC%20Search%20Tool.meta.js
// ==/UserScript==

var AESiv = "";
var AESkey = "a7fc9dc89f2c873d79397f8a0028a4cd";
var clientversion = "68";
var useragent = "comicoGlobalApp/68 Dalvik/2.1.0 (Linux; U; Android 8.0.0; Google Pixel 3.8 Build/OPR6.170623.017)";
var neoiduid = "bb7c55a7-6fd5-495a-9037-4d1316ad0c74";
var clientuid = "bb7c55a7-6fd5-495a-9037-4d1316ad0c74";
var clientadid = "3482b7a7-e7b6-46b9-80a4-aff7758740fe";
var immutableid = "e632f7ee0f9ef8cd";
var checksumhash = "9241d2f090d01716feac20ae08ba791a";
var accesstoken = "AAAAm-7ll6wMX6AVfPeZhuuiiYqlTzVc1fjGi5DRy3ZAkLQNO9Z57wXy06-bCavQRz3jbOsUdey92U1_GE8cXZAhgOahE9ysKc_6J4XIRYblVfN8FHLvGRB_BejylKgXb5NuuZr6cVuAgQ1dst-0Uu7LFfk4mGBZSYH9T0kxwJC_tNvSdxX4eFZmrrh0NzHG4sJpPJqi4lkQetjwsBdYStfnMcE.A";

function decryptURL(encryptedBody) {
    var keyWords = CryptoJS.enc.Utf8.parse(AESkey);
    var decryptedBody = CryptoJS.AES.decrypt({ciphertext: encryptedBody}, keyWords, {iv: CryptoJS.enc.Utf8.parse(AESiv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    return decryptedBody.toString(CryptoJS.enc.Utf8);
};

function createCheckSum() {
    var timeUNIX = Math.floor(Date.now() / 1000);
    var checkSumRaw = checksumhash + neoiduid + timeUNIX + clientuid;
    var checkSum = CryptoJS.SHA256(checkSumRaw).toString();
    return [timeUNIX, checkSum];
};

function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {
        s.styleSheet.cssText = css;
    } else {
        s.appendChild(document.createTextNode(css));
    };
    head.appendChild(s);
};

document.body.oncontextmenu = "return true";
document.body.onselectstart = "return true";
document.body.ondragstart = "return true";

var searchBtn = document.createElement('button');
searchBtn.setAttribute('id', 'EngSearchButton');
searchBtn.style = `
    width: 64px;
    height: 64px;
    border-radius: 50%;
    position: fixed;
    top: 100px;
    right: 50px;
    box-shadow: 0 0 3px #000000;
    background: #FFF;
    z-index: 199;
`;
searchBtn.innerText = 'ENG\nSearch';
searchBtn.addEventListener('click', function() {document.querySelector('#EngSearchOverlay').style.display = 'block'; document.querySelector('#EngSearchOverlay').style.height = document.body.scrollHeight + 'px';});
document.querySelector('body').appendChild(searchBtn);

var popupBackground = document.createElement('div');
popupBackground.setAttribute('id', 'EngSearchOverlay');
popupBackground.style = `
    width: 100%;
    height: 1px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.7);
    z-index: 200;
    display: none;
`;
document.querySelector('body').appendChild(popupBackground);


var searchContainer = document.createElement('div');
searchContainer.setAttribute('id', 'EngSearchContainer');
searchContainer.style = `
    width: 600px;
    max-width: 90%;
    height: auto;
    max-height: 800px;
    position: fixed;
    top: 170px;
    background: white;
    box-shadow: rgb(0 0 0 / 10%) 0px 2px 15px;
    z-index: 199;
    margin: 5% auto;
    left: 0px;
    right: 0px;
    overflow: scroll;
    overflow-x: hidden;
`;
document.querySelector('#EngSearchOverlay').appendChild(searchContainer);

var popupCloseButton = document.createElement('button')
popupCloseButton.className = 'closeButton';
addcss(`
    .closeButton {
      position: sticky;
      right: 2px;
      top: -6px;
      width: 32px;
      height: 32px;
      opacity: 0.3;
      background: none;
      float: right;
    }
    .closeButton:hover {
      opacity: 1;
    }
    .closeButton:before, .closeButton:after {
      position: absolute;
      left: 15px;
      content: ' ';
      height: 20px;
      width: 2px;
      background-color: #333;
    }
    .closeButton:before {
      transform: rotate(45deg);
    }
    .closeButton:after {
      transform: rotate(-45deg);
    }
`);
popupCloseButton.addEventListener('click', function() {document.querySelector('#EngSearchOverlay').style.display = 'none'; document.querySelector('#EngSearchOverlay').style.height = "1px";});
document.querySelector('#EngSearchContainer').appendChild(popupCloseButton);

var SearchTitle1 = document.createElement('label');
SearchTitle1.innerText = 'Search for a Comic';
SearchTitle1.style = `
    width: 100%;
    margin: 32px 0px 0px 60px;
    display: block;
    font-size: 20px;
`;
document.querySelector('#EngSearchContainer').appendChild(SearchTitle1);

var SearchInput = document.createElement('input');
SearchInput.setAttribute('id', 'EngSearchInputBox');
SearchInput.style = `
    width: 60%;
    height: 25px;
    background: #DDD;
    border-radius: 20px;
    margin: 15px 0px 0px 60px;
    padding-left: 5px;
    float: left;
`;
document.querySelector('#EngSearchContainer').appendChild(SearchInput);
document.querySelector("#EngSearchInputBox").addEventListener('keyup', function(e) {if (e.keyCode === 13) {SearchFunctions.callAPIsearchComic(document.querySelector('#EngSearchInputBox').value)}});

addcss(`
    input:focus {
        outline: none !important;
        border-color: #719ECE;
        box-shadow: 0 0 10px #719ECE;
    }
    textarea:focus {
        outline: none !important;
        border-color: #719ECE;
        box-shadow: 0 0 10px #719ECE;
    }
`);

var SearchButton = document.createElement('img');
SearchButton.src = "https://i.imgur.com/drIqvV8.png";
SearchButton.style = `
    display: block;
    height: 35px;
    width: 35px;
    opacity: 0.3;
    margin: 10px;
    float: left;
`;
SearchButton.setAttribute('id', 'EngSearchButton');
SearchButton.addEventListener('click', function() {SearchFunctions.callAPIsearchComic(document.querySelector('#EngSearchInputBox').value)});
document.querySelector('#EngSearchContainer').appendChild(SearchButton);
addcss(`
    #EngSearchButton:hover {
        opacity: 1 !important;
        cursor: pointer;
    }
`);

var SearchClear = document.createElement('button');
SearchClear.innerText = "Clear";
SearchClear.style = `
    display: block;
    height: 35px;
    width: 35px;
    opacity: 0.6;
    margin: 10px 10px 10px 0px;
    float: left;
    background: none;
`;
SearchClear.setAttribute('id', 'EngSearchClear');
SearchClear.addEventListener('click', function() {if (document.querySelector('#EngSearchResultsContainer')) {document.querySelector('#EngSearchResultsContainer').remove();}});
document.querySelector('#EngSearchContainer').appendChild(SearchClear);
addcss(`
    #EngSearchClear:hover {
        opacity: 1 !important;
        cursor: pointer;
    }
`);

var spacer = document.createElement('div');
spacer.style = `
    height: 80px;
    width: 100%;
`;
document.querySelector('#EngSearchContainer').appendChild(spacer);

unsafeWindow.SearchFunctions = {
    callAPIsearchComic: function(searchTerm) {
        var searchData = encodeURI('query=' + searchTerm + '&contentType=');
        var contentLength = searchData.length;

        var [timeUNIX, checkSum] = createCheckSum();

        GM_xmlhttpRequest ({
            url: 'https://api.comico.io/search?pageNo=0&pageSize=100',
            method: 'POST',
            data: searchData,
            headers: {
                "x-comico-client-os": "aos",
                "x-comico-client-version": clientversion,
                "x-comico-neoid-uid": neoiduid,
                "x-comico-access-token": accesstoken,
                "x-comico-client-uid": clientuid,
                "x-comico-client-adid": clientadid,
                "x-comico-client-immutable-uid": immutableid,
                "x-comico-request-time": timeUNIX,
                "x-comico-check-sum": checkSum,
                "content-length": contentLength,
                "accept-encoding": "gzip",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                var returnedData = JSON.parse(response.responseText).data.contents;
                console.log(JSON.parse(response.responseText).data);

                if (document.querySelector('#EngSearchResultsContainer')) {
                    document.querySelector('#EngSearchResultsContainer').remove();
                };

                var resultsContainer = document.createElement('div');
                resultsContainer.setAttribute('id', 'EngSearchResultsContainer');
                resultsContainer.style.width = '100%';
                document.querySelector('#EngSearchContainer').appendChild(resultsContainer);

                var maxLen = (returnedData.length > 25) ? 25 : returnedData.length;

                for (var i = 0; i < maxLen; i++) {
                    var entry = document.createElement('div');
                    entry.setAttribute('data-id', returnedData[i].id);
                    entry.style = `
                        overflow: auto;
                        height: auto;
                        min-height: 140px;
                        width: 80%;
                        border-top: 1px solid #777;
                        margin: 0 auto;
                        min-width: 462px;
                    `;
                    document.querySelector('#EngSearchResultsContainer').appendChild(entry);

                    var coverImg = document.createElement('img');
                    var imgURL = returnedData[i].thumbnails[0].url;
                    coverImg.src = imgURL;
                    coverImg.style = `
                        height: 120px;
                        margin: 10px;
                        float: left;
                    `;
                    entry.appendChild(coverImg);

                    var entryDescContainer = document.createElement('div');
                    entryDescContainer.style = `
                        height: auto;
                        min-height: 120px;
                        width: calc(100% - 130px);
                        margin: 10px;
                        float: right;
                    `;
                    entry.appendChild(entryDescContainer);

                    var entryTitle = document.createElement('label');
                    entryTitle.style = `
                        font-weight: bold;
                        font-size: 20px;
                        width: 100%;
                        display: block;
                        word-break: break-word;
                        user-select: text;
                        cursor: default;
                    `;
                    entryTitle.innerText = returnedData[i].name;
                    entryDescContainer.appendChild(entryTitle);

                    var creatorString = '';
                    for (var e = 0; e < returnedData[i].authors.length; e++) {
                        creatorString = creatorString + returnedData[i].authors[e].role + ': ' + returnedData[i].authors[e].name + ' | '
                    };
                    creatorString = (creatorString.endsWith(' | ')) ? creatorString.slice(0, -3) : creatorString;

                    var entryCreators = document.createElement('label');
                    entryCreators.style = `
                        font-size: 12px;
                        width: 100%;
                        display: block;
                        word-break: break-word;
                        user-select: text;
                        cursor: default;
                    `;
                    entryCreators.innerText = creatorString;
                    entryDescContainer.appendChild(entryCreators);

                    var genreString = '';
                    for (var e = 0; e < returnedData[i].genres.length; e++) {
                        genreString = genreString + returnedData[i].genres[e].name + ' | '
                    };
                    genreString = (genreString.endsWith(' | ')) ? genreString.slice(0, -3) : genreString;

                    var entryGenres = document.createElement('label');
                    entryGenres.style = `
                        font-size: 12px;
                        width: 100%;
                        display: block;
                        word-break: break-word;
                        user-select: text;
                        cursor: default;
                    `;
                    entryGenres.innerText = genreString;
                    entryDescContainer.appendChild(entryGenres);

                    var openCoverBtn = document.createElement('button')
                    openCoverBtn.setAttribute("onclick", "window.open(this.parentElement.parentElement.firstElementChild.src)");
                    openCoverBtn.style = `
                        width: 90px;
                        height: 40px;
                        background: rgb(244, 0, 9);
                        word-break: break-word;
                        color: #FFF;
                        border-radius: 10px;
                        box-shadow: 0 0 3px #000000;
                        margin-top: 8px;
                        float: left;
                    `;
                    openCoverBtn.innerText = 'Open Cover Image';
                    entryDescContainer.appendChild(openCoverBtn);

                    var copyDescBtn = document.createElement('button');
                    copyDescBtn.setAttribute("onclick", "SearchFunctions.copyText(`" + returnedData[i].description.replace(/(?:\r\n|\r|\n)/g, ' ') + "`)");
                    copyDescBtn.style = `
                        width: 90px;
                        height: 40px;
                        background: #FE8F40;
                        word-break: break-word;
                        color: #FFF;
                        border-radius: 10px;
                        box-shadow: 0 0 3px #000000;
                        margin-top: 8px;
                        margin-left: 10px;
                        float: left;
                    `;
                    copyDescBtn.innerText = 'Copy Synopsis';
                    entryDescContainer.appendChild(copyDescBtn);

                    var searchAPbtn = document.createElement('button')
                    searchAPbtn.setAttribute("onclick", "window.open(encodeURI(\"https://www.anime-planet.com/manga/all?name=" + returnedData[i].name + "\"))");
                    searchAPbtn.style = `
                        width: 90px;
                        height: 40px;
                        background: #193767;
                        word-break: break-word;
                        color: #FFF;
                        border-radius: 10px;
                        box-shadow: 0 0 3px #000000;
                        margin-top: 8px;
                        margin-left: 10px;
                        float: left;
                    `;
                    searchAPbtn.innerText = 'Search On AP';
                    entryDescContainer.appendChild(searchAPbtn);

                    var openChapBtn = document.createElement('button');
                    openChapBtn.setAttribute('data-clicked', 0);
                    openChapBtn.style = `
                        width: 30px;
                        height: 40px;
                        background: rgb(244, 0, 9);
                        word-break: break-word;
                        color: #FFF;
                        border-radius: 10px;
                        box-shadow: 0 0 3px #000000;
                        margin-top: 8px;
                        margin-left: 10px;
                        float: left;
                    `;
                    openChapBtn.innerText = 'CH';
                    entryDescContainer.appendChild(openChapBtn);
                    openChapBtn.addEventListener("click", function() {
                        if (this.dataset.clicked == 0) {
                            SearchFunctions.callAPIgetChapters(this.parentElement.parentElement.dataset.id);
                            this.setAttribute('data-clicked', 1);
                        } else {
                            this.parentElement.nextElementSibling.remove();
                            this.setAttribute('data-clicked', 0);
                        };
                    });
                };
            }
        });
    },
    callAPIgetChapters: function(id) {
        var [timeUNIX, checkSum] = createCheckSum();

        GM_xmlhttpRequest ({
            url: "https://api.comico.io/comic/" + id,
            method: "GET",
            headers: {
                "content-type": "application/json",
                "user-agent": useragent,
                "x-comico-client-os": "aos",
                "x-comico-client-version": clientversion,
                "x-comico-neoid-uid": neoiduid,
                "x-comico-access-token": accesstoken,
                "x-comico-client-uid": clientuid,
                "x-comico-client-adid": clientadid,
                "x-comico-client-immutable-uid": immutableid,
                "x-comico-request-time": timeUNIX,
                "x-comico-check-sum": checkSum,
                "accept-encoding": "gzip"
            },
            onload: function(response) {
                var chaps = JSON.parse(response.responseText).data;
                console.log(chaps);
                var chapters = chaps.episode.content.chapters;
                var comicElement = document.querySelector('div[data-id="' + id + '"]');

                var chaptersContainer = document.createElement('div');
                chaptersContainer.setAttribute('data-id', id);
                chaptersContainer.style = `
                    width: 100%;
                    height: auto;
                    display: inline-block
                `;
                comicElement.appendChild(chaptersContainer);

                var ChapterInfo = document.createElement('div');
                ChapterInfo.style = `
                    width: 50%;
                    height: 50px;
                    line-height: 50px;
                    border-top: 1px solid lightgrey;
                    margin: 0 auto;
                    text-align: center;
                    font-size: 14px;
                `;
                ChapterInfo.innerText = 'Total Entry Count: ' + chapters.length;
                chaptersContainer.appendChild(ChapterInfo);

                for (var o = 0; o < chapters.length; o++) {
                    var ChapterPanel = document.createElement('div')
                    ChapterPanel.setAttribute('data-status', chapters[o].salesConfig.type);
                    ChapterPanel.setAttribute('data-chapid', chapters[o].id);
                    ChapterPanel.setAttribute('data-comicid', id);
                    ChapterPanel.style = `
                        width: 100%;
                        height: 120px;
                        border-top: 1px solid lightgrey;
                    `;
                    chaptersContainer.appendChild(ChapterPanel);

                    var coverImg = document.createElement('img');
                    var imgURL = chapters[o].thumbnail.url;
                    coverImg.src = imgURL;
                    coverImg.style = `
                        height: 100px;
                        margin: 10px;
                        float: left;
                        display: grid;
                    `;
                    ChapterPanel.appendChild(coverImg);

                    var chapterDescContainer = document.createElement('div');
                    chapterDescContainer.style = `
                        width: auto;
                        height: 100px;
                        display: grid;
                        padding: 10px
                    `;
                    ChapterPanel.appendChild(chapterDescContainer);

                    var chapterTitle = document.createElement('label');
                    chapterTitle.innerText = chapters[o].name;
                    chapterTitle.style = `
                        font-weight: bold;
                        font-size: 13px;
                        word-break: break-word;
                        grid-column-start: 1;
                        grid-column-end: 3;
                    `;
                    chapterDescContainer.appendChild(chapterTitle);

                    var chapterDate = document.createElement('label');
                    chapterDate.innerText = chapters[o].publishedAt.substr(0, 10);
                    chapterDate.style = `
                        font-size: 13px;
                        word-break: break-word;
                        grid-column-start: 1;
                    `;
                    chapterDescContainer.appendChild(chapterDate);

                    var chapterStatus = document.createElement('label');
                    chapterStatus.innerText = chapters[o].salesConfig.type.toUpperCase();
                    chapterStatus.innerText = (chapterStatus.innerText == "FREE") ? chapterStatus.innerText + " | Click To Open" : chapterStatus.innerText;
                    var fontColour = (chapters[o].salesConfig.type.toUpperCase() == "FREE") ? "Green" : "Red";
                    chapterStatus.style = `
                        font-size: 16px;
                        font-weight: bold;
                        word-break: break-word;
                        color: ` + fontColour + `;
                        grid-column-start: 1;
                        grid-column-end: 2;
                    `;

                    chapterDescContainer.appendChild(chapterStatus);

                    if (ChapterPanel.dataset.status == "free") {
                        ChapterPanel.addEventListener('click', function() {SearchFunctions.callAPIgetImages(this.dataset.comicid, this.dataset.chapid)})
                        ChapterPanel.style.cursor = "pointer";
                        chapterDescContainer.style.cursor = "pointer";
                        chapterTitle.style.cursor = "pointer";
                        chapterDate.style.cursor = "pointer";
                        chapterStatus.style.cursor = "pointer";
                    } else {
                        ChapterPanel.style.cursor = "default";
                        chapterDescContainer.style.cursor = "default";
                        chapterTitle.style.cursor = "default";
                        chapterDate.style.cursor = "default";
                        chapterStatus.style.cursor = "default";
                    };
                };
                document.querySelector('#EngSearchContainer').scrollTo({top: comicElement.offsetTop - 2, behavior: 'smooth'});
            }
        });
    },
    callAPIgetImages: function(id, chap) {
        var [timeUNIX, checkSum] = createCheckSum();

        GM_xmlhttpRequest ({
            url: "https://api.comico.io/comic/" + id + "/chapter/" + chap + "/product",
            method: "GET",
            headers: {
                "content-type": "application/json",
                "user-agent": useragent,
                "x-comico-client-os": "aos",
                "x-comico-client-version": clientversion,
                "x-comico-neoid-uid": neoiduid,
                "x-comico-access-token": accesstoken,
                "x-comico-client-uid": clientuid,
                "x-comico-client-adid": clientadid,
                "x-comico-client-immutable-uid": immutableid,
                "x-comico-request-time": timeUNIX,
                "x-comico-check-sum": checkSum,
                "accept-encoding": "gzip"
            },
            onload: function(response) {
                var chapImages = JSON.parse(response.responseText).data.chapter.images;
                console.log(JSON.parse(response.responseText).data);
                if (chapImages) {
                    var imagePageContents = '<div style="margin: 0 auto; display: table">';
                    for (var i = 0; i < chapImages.length; i++) {
                        var EncryptedB64Decoded = CryptoJS.enc.Base64.parse(chapImages[i].url);
                        var decrypted = decryptURL(EncryptedB64Decoded);
                        var finalURL = decrypted + "?" + chapImages[i].parameter;
                        imagePageContents = imagePageContents + '<img src="' + finalURL + '" style="max-width: 100%;"></img><br>';
                    };
                    var previewWindow = window.open('','Preview','');
                    previewWindow.document.body.innerHTML = imagePageContents + '</div>';
                };
            }
        });
    },
    copyText: function(Text) {
        const elem = document.createElement('textarea');
        elem.value = Text;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand('copy');
        document.body.removeChild(elem);
    }
};