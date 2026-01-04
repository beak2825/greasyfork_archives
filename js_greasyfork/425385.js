// ==UserScript==
// @name                Save Yandex Collection images to Eagle

// @description         Launch a script on Yandex Collection that automatically scrolls the page and converts all images on the page into large images (with links, names) to be added to the Eagle App.

// @author              Augus
// @license             MIT License

// @match               *://*/*
// @grant               GM_xmlhttpRequest
// @run-at              context-menu

// @date                04/22/2021
// @modified            04/22/2021
// @version             0.0.2

// @namespace https://eagle.cool/
// @downloadURL https://update.greasyfork.org/scripts/425385/Save%20Yandex%20Collection%20images%20to%20Eagle.user.js
// @updateURL https://update.greasyfork.org/scripts/425385/Save%20Yandex%20Collection%20images%20to%20Eagle.meta.js
// ==/UserScript==

(function() {

    if (location.href.indexOf("yandex.") === -1) {
        alert("This script only works on yandex.com.");
        return;
    }

    let bigGridBtn = document.querySelector(".cl-tabs-scroll__item_type_tabs");
    if (bigGridBtn) bigGridBtn.click();

    // Eagle API Server
    const EAGLE_SERVER_URL = "http://localhost:41595";
    const EAGLE_IMPORT_API_URL = `${EAGLE_SERVER_URL}/api/item/addFromURLs`;
    const EAGLE_CREATE_FOLDER_API_URL = `${EAGLE_SERVER_URL}/api/folder/create`;

    const SELECTOR_IMAGE = "img.cl-picture__image";
    const SELECTOR_LINK = ".cl-picture a";
    const SELECTOR_SPINNER = `.cl-button.cl-button_size_M.cl-button_type_white.cl-button_shadow.cl-board-footer__more-button`;

    var startTime = Date.now();
    var scrollInterval;        
    var lastScrollPos;         
    var retryCount = 0;        
    var scrollDelay = 100;
    var retryThreshold = 20;   
    var pageInfo = {
        imageCount: 0,
        imageSet: {},
        folderId: ""
    };

    var createFolder = function(folderName, callback) {
        GM_xmlhttpRequest({
            url: EAGLE_CREATE_FOLDER_API_URL,
            method: "POST",
            data: JSON.stringify({ folderName: folderName }),
            onload: function(response) {
                try {
                    var result = JSON.parse(response.response);
                    if (result.status === "success" && result.data && result.data.id) {
                        callback(undefined, result.data);
                    } else {
                        callback(true);
                    }
                } catch (err) {
                    callback(true);
                }
            }
        });
    };

    var scarollToTop = function() {
        window.scrollTo(0, 0);
        lastScrollPos = window.scrollY;
    };

    var scarollToBottom = function() {
        window.scrollTo(0, window.scrollY + 125);
        // window.scrollTo(0, window.innerHeight);
        lastScrollPos = window.scrollY;
    };

    var getImgs = function() {
        var imgs = [];
        var imgElements = Array.from(document.querySelectorAll(SELECTOR_IMAGE));

        imgElements = imgElements.filter(function(elem) {
            var src = elem.src;
            if (!pageInfo.imageSet[src]) {
                pageInfo.imageSet[src] = true;
                return true;
            }
            return false;
        });

        var getLink = function(img) {
            var links = Array.from(document.querySelectorAll(SELECTOR_LINK));
            for (var i = 0; i < links.length; i++) {
                if (links[i].contains(img)) {
                    return absolutePath(links[i].href);
                }
            }
            return "";
        };

        var getSrc = function (img) {
            let src = img.src;
            return src.split("/s")[0] + "/optimize";
        }

        var getName = function(img) {
            var articles = Array.from(document.querySelectorAll(".cl-card-vertical-teaser_article"));
            for (var i = 0; i < articles.length; i++) {
                if (articles[i].contains(img)) {
                    return articles[i].textContent;
                }
            }
            return "";
        };

        imgs = imgElements.map(function(elem, index) {
            pageInfo.imageCount++;
            return {
                name: getName(elem) || "",
                url: getSrc(elem) || elem.src,
                website: getLink(elem),
                modificationTime: startTime - pageInfo.imageCount
            }
        });

        return imgs;
    };

    var fetchImages = function() {
        var currentScrollPos = window.scrollY;
        scarollToBottom();

        addImagesToEagle(getImgs());

        if (lastScrollPos === currentScrollPos || currentScrollPos === 0) {
            if (!document.querySelector(SELECTOR_SPINNER)) {
                retryCount++;
                console.log(retryCount)
                if (retryCount >= retryThreshold) {
                    clearInterval(scrollInterval);
                    alert(`Scan completed, a total of ${pageInfo.imageCount} images have been added to Eagle App.`);
                }
            }
            else {
                document.querySelector(SELECTOR_SPINNER).click();
            }
        }
        else {
            retryCount = 0;
            var images = getImgs();
            addImagesToEagle(images);
        }
    }

    var addImagesToEagle = function(images) {
        GM_xmlhttpRequest({
            url: EAGLE_IMPORT_API_URL,
            method: "POST",
            data: JSON.stringify({ items: images, folderId: pageInfo.folderId }),
            onload: function(response) {}
        });
    }

    function absolutePath(href) {
        if (href && href.indexOf(" ") > -1) {
            href = href.trim().split(" ")[0];
        }
        var link = document.createElement("a");
        link.href = href;
        return link.href;
    }

    scarollToTop();

    var folderName = document.querySelector("h1") && document.querySelector("h1").innerText || "Yandex Collection";
    createFolder(folderName, function(err, folder) {
        if (folder) {
            pageInfo.folderId = folder.id;
            scrollInterval = setInterval(fetchImages, scrollDelay);
        } else {
            alert("Please open Eagle App first.");
        }
    });

})();