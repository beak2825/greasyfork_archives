// ==UserScript==
// @name         MangaDex Downloader
// @version      2.6
// @description  A userscript to add download-buttons to mangadex
// @author       NO_ob, icelord, eva
// @homepage     https://github.com/NO-ob/mangadex-scripts
// @match        https://mangadex.org/*
// @icon         https://mangadex.org/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace https://greasyfork.org/users/821816
// @downloadURL https://update.greasyfork.org/scripts/433394/MangaDex%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/433394/MangaDex%20Downloader.meta.js
// ==/UserScript==
//Required to retrieve iso_codes

var language_iso = {
    'ar': 'Arabic',
    'bn': 'Bengali',
    'bg': 'Bulgarian',
    'ca': 'ca',
    'zh': 'Chinese',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'fil': 'Filipino', // idk
    'fi': 'Finnish',
    'fr': 'French',
    'de': 'German',
    'el': 'Greek',
    'hu': 'Hungarian',
    'id': 'Indonesian',
    'it': 'Italian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ms': 'Malaysian',
    'mn': 'Mongolian',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese (Brazil)',
    'Portuguese (Portugal)': 'xdsdsdsd', //idk
    'ro': 'Romanian',
    'ru': 'Russian',
    'sh': 'Serbo-Croatian',
    'Spanish (LATAM)': 'spa', //idk
    'es': 'Spanish (Spain)',
    'sv': 'Swedish',
    'th': 'Thai',
    'tr': 'Thai',
    'vi': 'Vietnamese'
};



(function () {
    'use strict';
    //Settings or download
    // Need to observe constantly or script wont observe changes when loading
    if (document.URL.includes("mangadex")) {
        (new MutationObserver(pageObserve)).observe(document, {
            childList: true,
            subtree: true
        });
    } else {
        addDynastyDownloadButtons();
    }

})();

// observe for page to actually load, fuck webapps
function pageObserve(changes, observer) {
    // Check if scriptRan elem has been added to the page so elems aren't added on every observer change
    if (!document.querySelector("div#scriptRan")) {
        if (document.URL.includes("https://mangadex.org/settings")) {
            addScriptSettings();
        } else if (document.URL.includes("https://mangadex.org/title")) {
            addDownloadButtons();
        }
    } else {
        //console.log("scriptRan still on page");
    }
}


function addDynastyDownloadButtons() {
    if (document.querySelectorAll(".chapter-list > dd > a.name")) {
        console.log("chapter length =" + document.querySelectorAll(".chapter-list > dd > a.name").length);
        document.querySelectorAll(".chapter-list > dd > a.name").forEach((chapterRow) => {
            let chapterID = chapterRow.href.split('/').pop();
            let dlButton = document.createElement("button");
            let mangaID = document.URL.split('/').pop();
            let mangaHref = chapterRow.href
            dlButton.innerHTML = "Download";
            dlButton.setAttribute("class", "dlButton");
            dlButton.setAttribute("id", "dl-" + chapterID);
            let divForButton = chapterRow.parentNode;
            divForButton.insertBefore(dlButton, chapterRow);
            document.getElementById("dl-" + chapterID).addEventListener('click', () => {
                startDynastyDownload(chapterID, divForButton, mangaID, mangaHref);
            }, false);
        });
    }


}

function addObserverElem(parent) {
    let elem = document.createElement("div");
    elem.setAttribute("id", "scriptRan");
    parent.appendChild(elem);
}

function addScriptSettings() {
    if (document.querySelector("div.settings-container")) {
        addObserverElem(document.querySelector("html"));
        let settingsGroup = document.querySelector("div.settings-container");
        let newSettingsDiv = document.createElement("div");
        newSettingsDiv.innerHTML = '<div id="download_settings" style="margin-top: -96px; padding-top: 96px;">' +
            '<a id="dlSettings"/a>' +
            '<div class="flex flex-col gap-2 setting-box">' +
            '<div data-v-064a2b93="" class="flex justify-between">' +
            '<div data-v-064a2b93="" class="text-lg">Download Settings</div>' +
            '</div>' +

            '<div class="flex md:flex-row flex-col justify-between gap-4 mt-4">' +
            '<div for="file-extension" class="text-sm opacity-80 md:max-w-1/2">File extension of downloaded manga.</div>' +
            '<select class="form-control md:max-w-1/2" id="file-extension">' +
            '<option ' + (((localStorage.getItem("file-extension") || '.zip') === '.zip') ? 'selected ' : '') + 'value=".zip">.zip</option>' +
            '<option ' + (((localStorage.getItem("file-extension") || '.zip') === '.cbz') ? 'selected ' : '') + 'value=".cbz">.cbz</option>' +
            '</select>' +
            '</div>' +

            '<div class="flex md:flex-row flex-col justify-between gap-4 mt-4">' +
            '<div for="chapter-info" class="text-sm opacity-80 md:max-w-1/2"">Type of release info to pack into the archive.</div>' +
            '<select class="form-control md:max-w-1/2" id="chapter-info">' +
            '<option ' + ((localStorage.getItem("chapter-info") === '0') ? 'selected ' : '') + 'value="0">Disabled</option>' +
            '<option ' + ((localStorage.getItem("chapter-info") === '1') ? 'selected ' : '') + 'value="1">Text file</option>' +
            '<option ' + ((localStorage.getItem("chapter-info") === '2') ? 'selected ' : '') + 'value="2">JSON</option>' +
            '</select>' +
            '</div>' +
            '<div class="flex md:flex-row flex-col justify-between gap-4 mt-4">' +
            '<div for="parallel-downloads" class="text-sm opacity-80 md:max-w-1/2"">Number of parallel downloads.</div>' +
            '<div class="col-sm-9 md:max-w-1/2">' +
            '<input type="numbers" class="form-control" id="parallel-downloads" value="' + (localStorage.getItem("parallel-downloads") || 3) + '" />' +
            '</div>' +
            '</div>' +
            '<div class="flex md:flex-row flex-col justify-between gap-4 mt-4">' +
            '<div for="save-button" class="text-sm opacity-80 md:max-w-1/2">Saves downloader settings.</div>' +
            '<div class="col-sm-offset-3 col-sm-9">' +
            '<button type="submit" class="rounded relative md-btn flex items-center px-3 overflow-hidden ml-auto justify-center text-black dark:text-white bg-accent hover:bg-accent-darken dark:bg-accent-lighten2 dark:hover:bg-accent-lighten px-6"' +
            ' id="save_downloader_settings" style="min-height: 48px; min-width: 220px;">' +
            '<span class="flex items-center justify-center font-medium select-none" style="z-index: 1; pointer-events: none;">Save</span>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        settingsGroup.insertBefore(newSettingsDiv, settingsGroup.firstChild);

        //Add handler to save options
        document.getElementById('save_downloader_settings').addEventListener('click', () => {
            localStorage.setItem('file-extension', document.getElementById('file-extension').value);
            localStorage.setItem('parallel-downloads', parseInt(document.getElementById('parallel-downloads').value));
            localStorage.setItem('chapter-info', document.getElementById('chapter-info').value);
            alert('Updated settings!');
        }, false);
    }

}

function addDownloadButtons() {
    if (document.querySelectorAll('a.flex[href*="/chapter/"]').length > 0) {
        addObserverElem(document.querySelectorAll('a.flex[href*="/chapter/"]')[0])
        console.log("flex chapter length =" + document.querySelectorAll("div.flex.chapter").length);
        document.querySelectorAll('a.flex[href*="/chapter/"]').forEach((chapterRow) => {
            if (chapterRow.href.startsWith("https://mangadex.org/chapter")) {
                let chapterID = chapterRow.href.split('/').pop();
                let dlButton = document.createElement("button");
                let mangaID = document.URL.includes("/title/") ? document.querySelector('img.rounded').getAttribute("src").split('covers/')[1].split('/')[0] : chapterRow.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector("a.chapter-feed__title").href.split("/")[4];
                dlButton.innerHTML = "Download";
                dlButton.setAttribute("class", "dlButton");
                dlButton.setAttribute("id", "dl-" + chapterID);
                dlButton.setAttribute("style", "float:left");
                let divForButton = chapterRow.parentElement.parentElement;
                divForButton.insertBefore(dlButton, chapterRow.parentElement);
                divForButton.querySelector("#dl-" + chapterID).onclick = () => {
                    startChapterDownload(chapterID, divForButton, mangaID);
                    console.log("chapter id: " + chapterID);
                    console.log("manga id: " + mangaID);
                };
            }
        });
    }
}

//Function to download a chapter (called by download-buttons)
async function startChapterDownload(chapterID, parent, mangaID) {
    //Inject progressbar
    let progressDiv = document.createElement("div");
    progressDiv.innerHTML = '<div id="progress-out-' + chapterID + '" style="float:left; width: 80px; margin-bottom: 2px; background-color: grey;">' +
        '<div id="progress-in-' + chapterID + '" style="width: 0%; height: 7px; background-color: green;">' +
        '</div>' +
        '</div>';
    parent.insertBefore(progressDiv, parent.querySelector("#dl-" + chapterID));
    parent.removeChild(parent.querySelector("#dl-" + chapterID));


    //Mark downloaded chapter as read
    if (parent.querySelector("svg.feather-eye")) {
        parent.querySelector("svg.feather-eye").dispatchEvent(new MouseEvent('click'));
        parent.querySelector("svg.feather-eye").dispatchEvent(new MouseEvent('mousedown'));
    }

    let chapterData = await getChapterMetaData(chapterID);
    if (chapterData != null) {
        let urlList = await getFileUrls(chapterData);
        if (urlList.length > 0) {
            let mangaData = await getMangaData(mangaID);
            if (mangaData != null) {
                getMangaDexChapterInfo(mangaData, urlList, chapterData);
            }
        }
    }
}

async function startDynastyDownload(chapterID, parent, mangaID, mangaHref) {
    console.log("start dyanasty dl");
    console.log("mangaHref");
    let urlList = [];
    //let resp = await
    fetch(mangaHref).then(response => response.text())
        .then((body) => {
            let page = document.createElement("html");
            page.innerHTML = body.substring(body.indexOf("<html>") + 6, body.indexOf("</html>"));
            let inner = page.querySelector("body > script").innerHTML;
            let urlObjs = JSON.parse(inner.substring(inner.indexOf("=") + 1, inner.indexOf("]") + 1))
            for (let i = 0; i < urlObjs.length; i++) {
                urlList.push(urlObjs[i].image);
            }
            console.log(urlList);
            let tags = [];
            page.querySelectorAll(".tags > a.label").forEach(tagElem => {
                tags.push(tagElem.textContent);
            });

            let chapter = document.getElementById("dl-" + chapterID).nextSibling.textContent.split(":")[0].split(" ")[1]
            let title = "";
            if (document.getElementById("dl-" + chapterID).nextSibling.textContent.split(":").length > 1) {
                title = document.getElementById("dl-" + chapterID).nextSibling.textContent.split(":")[1];
            }
            let elem = document.getElementById("dl-" + chapterID).parentElement
            let chapList = document.querySelector(".chapter-list").children;
            let vol = "";
            let index = Array.prototype.indexOf.call(chapList, elem);
            for (let x = index; x >= 0; x--) {
                if (chapList[x].tagName == "DT") {
                    console.log(chapList[x]);
                    vol = chapList[x].textContent;
                    break;
                }
            }
            document.getElementById("dl-" + chapterID).nextSibling.textContent.split(":")[1]
            page.querySelector(".scanlators > a > img").alt
            //author = document.querySelector(".tag-title > a").textContent
            const chapterInfo = {
                manga: document.querySelector(".tag-title > b").textContent,
                altnames: "",
                link: 'https://dynasty-scans.com/chapters/' + chapterID,
                chapter: chapter,
                volume: vol.split(" ")[1] || null,
                title: title || null,
                groups: page.querySelector(".scanlators > a > img").alt,
                genres: tags,
                //get user from chapterdata https://api.mangadex.org/user/ id
                uploader: "",
                posted: page.querySelector(".released").textContent.trim(),
                language: "English",
                translated: "English",
                images: urlList
            };
            let progressDiv = document.createElement("div");
            progressDiv.innerHTML = '<div id="progress-out-' + chapterID + '" style="width: 50px; margin-bottom: 2px; background-color: grey;float:left;">' +
                '<div id="progress-in-' + chapterID + '" style="width: 0%; height: 7px; background-color: green;float:left;">' +
                '</div>' +
                '</div>';
            parent.removeChild(document.getElementById("dl-" + chapterID));
            parent.insertBefore(progressDiv, parent.firstChild);
            createZipFile(chapterInfo, chapterID, urlList);
        });



    /* if (resp.ok) {
       let page = document.createElement("div");
       page.innerHTML = resp.text();
         console.log(page.getElementsByTagName("script")[0]);
     }*/

}
async function getChapterMetaData(chapterID) {
    //https://api.mangadex.org/chapter/2de64986-f092-4027-ab35-f78c4a1b54f2
    let resp = await fetch("https://api.mangadex.org/chapter/" + chapterID);
    if (resp.ok) {
        let json = await resp.json();
        console.log("Got chapter metadata for: " + json.data.id);
        return json.data;
    } else {
        console.log("Failed to get metadata for: " + chapterID);
        return null;
    }
}

async function getFileUrls(chapterData) {
    //https://api.mangadex.org/at-home/server/2de64986-f092-4027-ab35-f78c4a1b54f2
    let urlList = [];
    let resp = await fetch("https://api.mangadex.org/at-home/server/" + chapterData.id);
    let json = await resp.json();
    if (resp.ok) {
        for (let i = 0; i < json.chapter.data.length; i++) {
            urlList.push(json.baseUrl + "/data/" + json.chapter.hash + "/" + json.chapter.data[i]);
        }
        console.log("Created url list for: " + chapterData.id);
        console.log("Url list length is: " + urlList.length);
    } else {
        console.log("Failed to get baseURL for: " + chapterData.ID);
    }
    return urlList;
}

async function getMangaData(mangaID) {
    //https://api.mangadex.org/manga/036fce64-6de7-4668-b7ba-66596d32e059
    let resp = await fetch("https://api.mangadex.org/manga/" + mangaID + "?includes[]=artist&includes[]=author&includes[]=cover_art");
    console.log("https://api.mangadex.org/manga/" + mangaID);
    if (resp.ok) {
        let json = await resp.json();
        console.log(json.data);
        console.log("Got manga metadata for: " + json.data.attributes.title.en + "[" + json.data.id + "]");
        return json.data
    } else {
        console.log("Failed to get metadata for manga: " + document.URL.split("/")[4]);
    }
    return null;
}
async function getUser(userID) {
    console.log("getting user: " + userID);
    let resp = await fetch("https://api.mangadex.org/user/" + userID);
    if (resp.ok) {
        let user = await resp.json();
        return user.data;
    } else {
        console.log("Failed to get metadata for user: " + userID);
    }
    return null;
}

async function getScanlationGroupName(groupID) {
    if (!groupID) {
        return [];
    }
    console.log("getting group: " + groupID);
    let resp = await fetch("https://api.mangadex.org/group/" + groupID);
    if (resp.ok) {
        let group = await resp.json();
        return group.data.attributes.name != null ? [group.data.attributes.name] : [];
    } else {
        console.log("Failed to get metadata for group: " + groupID);
    }
    return [];
}

function normalizeAltNames(alts) {
    let altNames = [];
    alts.forEach((alt) => {
        if (alt.en) {
            altNames.push(alt.en.normalize());
        }
    });
    return altNames;
}

function getTags(tags) {
    let themeList = [];
    let genreList = [];
    let formatList = [];
    tags.forEach((tag) => {
        switch (tag.attributes.group) {
            case "theme":
                themeList.push(tag.attributes.name.en.normalize());
                break;
            case "genre":
                genreList.push(tag.attributes.name.en.normalize());
                break;
            case "theme":
                formatList.push(tag.attributes.name.en.normalize());
                break;
        }
    });
    return {
        "theme": themeList,
        "genre": genreList,
        "formatList": formatList
    }
}

async function getMangaDexChapterInfo(mangaData, urlList, chapterData) {
    //Fetch page-urls and download them
    let tagsMap = getTags(mangaData.attributes.tags);
    //
    let uploaderID = "";
    let groupID = "";

    chapterData.relationships.forEach((relationship) => {
        if (relationship.type == "user") {
            uploaderID = relationship.id;
        }
    });
    chapterData.relationships.forEach((relationship) => {
        if (relationship.type == "scanlation_group") {
            groupID = relationship.id;
        }
    });

    let uploader = await getUser(uploaderID);
    let group = await getScanlationGroupName(groupID);
    let link = 'https://mangadex.org/chapter/' + mangaData.id;
    let title = mangaData.attributes.title.en ?? mangaData.attributes.title[Object.keys(mangaData.attributes.title)[0]];

    const chapterInfo = {
        manga: title,
        altnames: normalizeAltNames(mangaData.attributes.altTitles),
        link: 'https://mangadex.org/chapter/' + mangaData.id,
        chapter: chapterData.attributes.chapter,
        volume: chapterData.attributes.volume || null,
        title: chapterData.attributes.title || null,
        groups: group.join(),
        genres: tagsMap.genre,
        //get user from chapterdata https://api.mangadex.org/user/ id
        uploader: uploader,
        posted: chapterData.attributes.publishAt,
        language: language_iso[chapterData.attributes.translatedLanguage],
        translated: chapterData.attributes.translatedLanguage,
        images: urlList
    };

    if (chapterInfo.volume == null) {
        console.log("progress-out-" + chapterData.id);
        let prevVol = document.getElementById("progress-out-" + chapterData.id).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
        if (prevVol != null) {
            prevVol = prevVol.querySelector(".volume-head > div:nth-child(1)");
            if (prevVol != null) {
                if (prevVol.innerText != "No Volume") {
                    prevVol = prevVol.innerText.split(" ")[1];
                    chapterInfo.volume = parseInt(prevVol) + 1;
                }
            }

        }
    }
    console.log(chapterInfo);
    createZipFile(chapterInfo, chapterData.id, urlList);


}
async function createZipFile(chapterInfo, id, urlList) {

    //Fetch all pages using JSZip
    let zip = new JSZip();
    let zipFilename =
        chapterInfo.manga +
        (chapterInfo.language == "English" ? "" : " [" + chapterInfo.language + "]") +
        " - c" + (chapterInfo.chapter < 100 ? chapterInfo.chapter < 10 ? '00' + chapterInfo.chapter : '0' + chapterInfo.chapter : chapterInfo.chapter) +
        (chapterInfo.volume ? " (v" + (chapterInfo.volume < 10 ? '0' + chapterInfo.volume : chapterInfo.volume) + ")" : "") +
        " [" + chapterInfo.groups + "]" +
        (localStorage.getItem("file-extension") || '.zip');
    let page_count = chapterInfo.images.length;
    let active_downloads = 0;
    let failed = false;

    //Build metadata-file based on setting
    if (localStorage.getItem("chapter-info") == '1') {
        let textFile = '';
        textFile += chapterInfo.manga + '\n';
        textFile += chapterInfo.altnames.join(', ') + '\n';
        textFile += chapterInfo.link + '\n\n';
        textFile += 'Chapter: ' + chapterInfo.chapter + '\n';
        textFile += 'Volume: ' + (chapterInfo.volume !== null ? chapterInfo.volume : 'Unknown') + '\n';
        textFile += 'Title: ' + (chapterInfo.title != null ? chapterInfo.title : 'Unknown') + '\n';
        textFile += 'Groups: ' + chapterInfo.groups + '\n';
        textFile += 'Genres: ' + chapterInfo.genres.join(', ') + '\n';
        textFile += 'Uploader: ' + (chapterInfo.uploader != null ? chapterInfo.uploader.attributes.username + ' (ID: ' + chapterInfo.uploader.id + ')\n' : "");
        textFile += 'Posted: ' + chapterInfo.posted + '\n';
        textFile += 'Language: ' + chapterInfo.language + (chapterInfo.translated ? ' (TL) \n' : '\n');
        textFile += 'Length: ' + chapterInfo.images.length + '\n\n';
        chapterInfo.images.forEach((image, i) => {
            textFile += 'Image ' + (i + 1) + ': ' + image + '\n';
        });
        textFile += '\n\nDownloaded at ' + (new Date()) + '\n';
        textFile += 'Generated by MangaDex Downloader. https://github.com/NO-ob/mangadex-scripts/';

        zip.file('info.txt', textFile.replace(/\n/gi, '\r\n'));
    } else if (localStorage.getItem("chapter-info") == '2') {
        zip.file('info.json', JSON.stringify(chapterInfo, null, 4));
    }
    console.log("Starting chapter download");
    let page_urls = urlList;
    let interval = setInterval(() => {
        if (active_downloads < (localStorage.getItem("parallel-downloads") || 3) && page_urls.length > 0) {
            let to_download = page_urls.shift();
            let current_page = page_count - page_urls.length;
            let page_filename =
                (chapterInfo.manga +
                    (chapterInfo.language == "English" ? "" : " [" + chapterInfo.language + "]") +
                    " - c" + (chapterInfo.chapter < 100 ? chapterInfo.chapter < 10 ? '00' + chapterInfo.chapter : '0' + chapterInfo.chapter : chapterInfo.chapter) +
                    (chapterInfo.volume ? " (v" + (chapterInfo.volume < 10 ? '0' + chapterInfo.volume : chapterInfo.volume) + ")" : "") +
                    " - p" + (current_page < 100 ? current_page < 10 ? '00' + current_page : '0' + current_page : current_page) +
                    " [" + chapterInfo.groups + "]" +
                    '.' + to_download.split('.').pop())
                    .replace(/[\/\?<>\\:\*\|":\x00-\x1f\x80-\x9f]/gi, '_')


            active_downloads++;
            GM_xmlhttpRequest({
                method: 'GET',
                url: to_download,
                responseType: 'arraybuffer',
                onload: function (data) {
                    zip.file(page_filename, data.response, {
                        binary: true
                    });
                    if (!failed) {
                        setProgress(id, ((page_count - page_urls.length) / page_count) * 100);
                    }
                    active_downloads--;
                },
                onerror: function (data) {
                    alert('A page-download failed. Check the console for more details.');
                    console.error(data);
                    clearInterval(interval);
                    setProgress(id, -1);
                }
            });
        } else if (active_downloads === 0 && page_urls.length === 0) {
            clearInterval(interval);
            zip.generateAsync({
                type: "blob"
            }).then((zipFile) => {
                saveAs(zipFile, zipFilename);
                setProgress(id, -1);
            });
        }
    }, 500);
}

//Set progress of download for id
function setProgress(id, progress) {
    console.log(id);
    if (progress !== -1) {
        document.getElementById('progress-in-' + id).style.width = progress + '%';
    } else {
        document.getElementById('progress-out-' + id).remove();
    }
}

/*
function getAPIKey(){
    var URL = "https://api.mangadex.org/auth/login";
    GM_xmlhttpRequest ( {
        method:         "POST",
        url:            URL,
        responseType:   "text/*",
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        data : JSON.stringify({'username' : '', 'password':''}),
        onload:         function(response) {printKey(response.responseText);}
    });
}
function printKey(responseText){
    let resp = JSON.parse(responseText);
    console.log(resp.token.session);
    console.log(resp.token.refresh);
}


*/