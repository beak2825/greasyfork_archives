// ==UserScript==
// @name         Local Vk Downloader
// @namespace    vkDownloadAuto
// @version      4.0.0
// @description  Get Vk raw link without external service.
// @match        https://m.vk.com/mail*
// @downloadURL https://update.greasyfork.org/scripts/401659/Local%20Vk%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/401659/Local%20Vk%20Downloader.meta.js
// ==/UserScript==

function timeoutPromise(ms, promise) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject({ ok: false, message: "promise timeout", timeout: true });
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    })
}

function vkPlainGet(url, additionalParams, callback, httpRequest) {
    var params = {};
    if (additionalParams && typeof additionalParams == "object") {
        for (var p in additionalParams) {
            params[p] = additionalParams[p];
        }
    }
    params._ajax = 1;
    return ajax.plainpost(
        url,
        params,
        (function (e) {
            callback(e);
        }),
        (function () {
            callback(null)
        }),
        !!httpRequest
    );
}

function vkGet(url, additionalParams, callback) {
    return vkPlainGet(url, additionalParams, function (e) {
        if (!e) {
            callback(null);
            return;
        }
        callback(parseResponse(e));
    });
}

function vkTimeoutFetch(url, callback) {
    var controller = null;
    var signal = null;
    if (AbortController) {
        controller = new AbortController();
        signal = controller.signal;
    }
    timeoutPromise(2000, fetch(url, {
        method: 'POST',
        signal: signal,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "_ajax=1"
    })).catch(function (error) {
        if (error.timeout) {
            if (controller) {
                controller.abort();
            }
        }
        return null;
    }).then(function (result) {
        if (!result || result.redirected || !result.ok) {
            return null;
        }
        return result.text();
    }).then(function (text) {
        callback(text);
        return text;
    });
}

function parseResponse(response) {
    if (typeof response == "string" && response.indexOf("<!DOCTYPE html>") != -1) {
        return parseDialogPage(response);
    }
    return parseJSON(response);
}

function parseDialogPage(htmlString) {
    var html = parseDocumentToHtml(htmlString);
    var itemsContainer = html.querySelector(".items");
    var items = itemsContainer.querySelector(".photos_page");
    var searchMore = itemsContainer.querySelector(".show_more_wrap");
    return {
        data: [items.outerHTML, searchMore ? searchMore.outerHTML : ""]
    }
}

function removeCounters(documentString) {
    var countersIdx = documentString.indexOf('_cntrs');
    if (countersIdx == -1) {
        return documentString;
    }
    var counters = documentString.substring(countersIdx, documentString.indexOf("</div>", countersIdx));
    return documentString.replace(counters, '_cntrs">');
}

function removeLinks(documentString) {
    var linkIdx = documentString.indexOf("<link");
    while (linkIdx != -1) {
        var linkEndIdx = documentString.indexOf(">", linkIdx);
        documentString = documentString.substring(0, linkIdx) + documentString.substring(linkEndIdx + 1);
        linkIdx = documentString.indexOf("<link");
    }
    return documentString;
}

function removeScripts(documentString) {
    var scriptIdx = documentString.indexOf("<script");
    while (scriptIdx != -1) {
        var scriptEndIdx = documentString.indexOf("</script", scriptIdx);
        documentString = documentString.substring(0, scriptIdx) + documentString.substring(scriptEndIdx + 9);
        scriptIdx = documentString.indexOf("<script");
    }
    return documentString;
}

function removeImages(documentString) {
    return documentString.replace(/<img/g, "<div").replace(/<\/img/, "</div");
}

function removeDuplicates(array) {
    return array.filter(function (v, i) {
        return array.indexOf(v) === i;
    });
}

function parseDocumentToHtml(documentString) {
    var htmlElement = document.createElement('html');
    if (documentString.indexOf("<body") != -1) {
        documentString = documentString.substring(documentString.indexOf("<body"), documentString.indexOf("</body>") + 7);
    }
    documentString = removeCounters(documentString);
    documentString = removeLinks(documentString);
    documentString = removeScripts(documentString);
    htmlElement.innerHTML = documentString;
    return htmlElement;
}

function getSearchMoreHref(data) {
    if (!data || !data[1]) {
        return;
    }
    var htmlElement = parseDocumentToHtml(data[1]);
    if (!htmlElement) {
        return;
    }
    var showMore = htmlElement.querySelector(".show_more");
    if (!showMore) {
        return;
    }
    var href = showMore.href;
    if (!href) {
        return null;
    }
    return href;
}

function getPeer() {
    var hash = window.location.search;
    var idx = hash.indexOf("peer");
    if (idx == -1) {
        return null;
    }
    var end = hash.indexOf("&", idx);
    if (end == -1) {
        end = hash.length;
    }
    return hash.substring(idx + 5, end);
}

function getMediaUrl(newPeer, section) {
    var mediaUrlBase = "/mail?act=show_medias&peer=";
    var sectionUrl = "&section=";
    return mediaUrlBase + newPeer + sectionUrl + section;
}

function recursiveGetVideos(searchMoreLink, peer, data, finishState) {
    if (!searchMoreLink) {
        finishState.videos = true;
        finishSegment(peer, data, "videos", finishState);
        return;
    }
    vkGet(searchMoreLink, null, function (result) {
        if (!result || !result.data) {
            finishSegment(peer, data, "videos", finishState);
            return;
        }
        getVideosLinks(result.data, function (items) {
            data.videos = data.videos.concat(items);
            var searchMoreLink = getSearchMoreHref(result.data);
            recursiveGetVideos(searchMoreLink, peer, data, finishState);
        })
    });
}

function getVideosLinks(data, callback) {
    if (!data[0]) {
        callback([]);
        return;
    }
    var htmlElement = parseDocumentToHtml(removeImages(data[0]));
    var items = htmlElement.querySelectorAll(".video_item");
    if (!items || !items.length) {
        callback([]);
        return;
    }
    var videos = [];
    var fetchLinksCount = items.length;
    var reduceFetched = function () {
        --fetchLinksCount;
        if (fetchLinksCount == 0) {
            callback(videos);
        }
    }
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        var itemData = {};
        var previewImg = item.querySelector(".th_img");
        if (previewImg && previewImg.attributes.getNamedItem("src")) {
            itemData.preview = previewImg.attributes.getNamedItem("src").value;
            if (itemData.preview == "/images/video/thumbs/blocked_s.png") {
                reduceFetched();
                continue;
            }
        }
        var videoLength = item.querySelector(".thumb_label");
        if (videoLength) {
            itemData.length = videoLength.innerText;
        }
        var videoTitle = item.querySelector(".vi_title_text");
        if (videoTitle) {
            itemData.title = videoTitle.innerText;
            // if (itemData.title.indexOf("Без названия") == -1 && itemData.title.indexOf("_") == -1) {
            //     reduceFetched();
            //     continue;
            // }
        }
        var videoHref = item.querySelector(".video_href");
        if (!videoHref) {
            reduceFetched();
            continue;
        }
        itemData.href = videoHref.href;
        var callbackFunction = (function (itemData, result) {
            if (!result) {
                reduceFetched();
                return;
            }
            var htmlElement = parseDocumentToHtml(removeImages(result));
            var sources = htmlElement.querySelectorAll("source[type='video/mp4']");
            if (!sources || !sources.length) {
                reduceFetched();
                return;
            }
            itemData.sources = [];
            for (var i = 0; i < sources.length; ++i) {
                itemData.sources.push(sources[i].src);
            }
            videos.push(itemData);
            reduceFetched();
        }).bind(this, itemData);
        vkTimeoutFetch(itemData.href, callbackFunction, !0);
    }
}

function getVideos(peer, data, finishState) {
    console.log("GET VIDEOS:", peer);
    vkGet(getMediaUrl(peer.id, "video"), null, function (result) {
        if (!result || !result.data) {
            finishSegment(peer, data, "videos", finishState);
            return;
        }
        getVideosLinks(result.data, function (items) {
            data.videos = data.videos.concat(items);
            var searchMoreLink = getSearchMoreHref(result.data);
            recursiveGetVideos(searchMoreLink, peer, data, finishState);
        });
    });
}

function getPhotosLinks(data, callback) {
    if (!data[0]) {
        callback([]);
        return;
    }
    var htmlElement = parseDocumentToHtml(removeImages(data[0]));
    var items = htmlElement.querySelectorAll("div[data-src_big]");
    if (!items || !items.length) {
        callback([]);
        return;
    }
    var photos = [];
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        var src = item.attributes.getNamedItem("data-src_big");
        if (!src) {
            continue;
        }
        src = src.value;
        var breakIdx = src.indexOf("|");
        if (breakIdx != -1) {
            src = src.substring(0, breakIdx);
        }
        photos.push(src);
    }
    callback(photos);
}

function recursiveGetPhotos(searchMoreLink, peer, data, finishState) {
    if (!searchMoreLink) {
        finishSegment(peer, data, "photos", finishState);
        return;
    }
    vkGet(searchMoreLink, null, function (result) {
        if (!result || !result.data) {
            finishSegment(peer, data, "photos", finishState);
            return;
        }
        getPhotosLinks(result.data, function (items) {
            data.photos = data.photos.concat(items);
            var searchMoreLink = getSearchMoreHref(result.data);
            recursiveGetPhotos(searchMoreLink, peer, data, finishState);
        })
    });
}

function getPhotos(peer, data, finishState) {
    vkGet(getMediaUrl(peer.id, "photo"), null, function (result) {
        if (!result || !result.data) {
            finishSegment(peer, data, "photos", finishState);
            return;
        }
        getPhotosLinks(result.data, function (items) {
            data.photos = data.photos.concat(items);
            var searchMoreLink = getSearchMoreHref(result.data);
            recursiveGetPhotos(searchMoreLink, peer, data, finishState);
        });
    });
}

function getDocs(peer, data, finishState) {
    finishSegment(peer, data, "docs", finishState)
}

function getAllMedia(peer) {
    var data = {
        videos: [],
        photos: [],
        docs: []
    }
    var finishState = {
        videos: false,
        photos: false,
        docs: false
    }
    getVideos(peer, data, finishState);
    getPhotos(peer, data, finishState);
    getDocs(peer, data, finishState);
}

function getPeersFromData(data) {
    if (!data[0] || !data[0].msgs || typeof (data[0].msgs) != "object") {
        return [];
    }
    var peers = [];
    for (var id in data[0].msgs) {
        var message = data[0].msgs[id];
        if (!message || !message.peerId) {
            continue;
        }
        var peerId = parseInt(message.peerId);
        if (isNaN(peerId) || peerId <= 0 || peerId >= 2000000000) {
            continue;
        }
        var name = "";
        if (data[0].members && data[0].members[peerId] && data[0].members[peerId].name) {
            name = data[0].members[peerId].name;
        }
        peers.push({ id: peerId, name: name });
    }
    return peers.reverse();
}

function recursiveGetPeers(peers, offset, step, callback) {
    vkGet("/mail", { offset: offset }, function (result) {
        if (!result || !result.data) {
            callback(peers);
            return;
        }
        var resultPeers = getPeersFromData(result.data);
        peers = peers.concat(resultPeers);
        peers = removeDuplicates(peers);
        if (typeof result.data[1] == "undefined" || result.data[1] == true) {
            callback(peers);
            return;
        }
        recursiveGetPeers(peers, offset + step, step, callback);
    });
}

function start() {
    if (peers != null) {
        return;
    }
    peers = [];
    recursiveGetPeers(peers, 0, 20, function (receivedPeers) {
        peers = receivedPeers;
        getAllMedia(peers[0]);
    });
}

function finishSegment(peer, data, segment, finishState) {
    finishState[segment] = true;
    if (finishState.videos && finishState.photos && finishState.docs) {
        console.log("FINISH:", peer);
        finish(peer, data);
        var idx = peers.indexOf(peer);
        if (idx != -1 && idx != peers.length - 1) {
            getAllMedia(peers[idx + 1]);
        }
    }
}

function finish(peer, data) {
    media.push({ peer: peer, data: data });
    if (media.length == 5) {
        printMedia(0, 4);
    } else if (media.length == 10) {
        printMedia(5, 9);
    } else if (media.length == 20) {
        printMedia(10, 19);
    } else if (media.length == 30) {
        printMedia(20, 29);
    } else if (media.length == 50) {
        printMedia(30, 49);
    } else if (media.length == 100) {
        printMedia(50, 99);
    } else if (media.length == peers.length) {
        printAllMedia();
    } else if (media.length % 100 == 0) {
        printMedia(media.length - 100, media.length - 1);
    }
}

function printMedia(startIdx, endIdx) {
    var mediaPart = media.slice(startIdx, endIdx);
    console.log("");
    console.log("***********************************MEDIA(" + startIdx + "-" + endIdx + ")**************************************")
    console.log(JSON.stringify(mediaPart));
    console.log("************************************FINISH**************************************")
}

function printAllMedia() {
    console.log("");
    console.log("***********************************MEDIA(FULL)**************************************")
    console.log(JSON.stringify(media));
    console.log("************************************FINISH**************************************")
}

var peers = null;
var media = [];
start();