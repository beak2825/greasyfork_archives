// ==UserScript==
// @name        Plex Downloader
// @namespace   https://dan-saba.com
// @include     https://app.plex.tv/*
// @include     https://plex.dan-saba.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1.1.1
// @license     GPL
// @description A downloader for Plex items
// @downloadURL https://update.greasyfork.org/scripts/440039/Plex%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/440039/Plex%20Downloader.meta.js
// ==/UserScript==

const clientIdRegex = new RegExp("server\/([a-f0-9]{40})\/");
const metadataIdRegex = new RegExp("key=%2Flibrary%2Fmetadata%2F(\\d+)");
const apiResourceUrlTemplate = "https://plex.tv/api/resources?includeHttps=1&X-Plex-Token={token}";
const apiLibraryUrlTemplate = "{baseuri}/library/metadata/{id}?X-Plex-Token={token}";
const downloadUrlTemplate = "{baseuri}{partkey}?download=1&X-Plex-Token={token}";
const accessTokenXpathTemplate = "//Device[@clientIdentifier='{clientid}']/@accessToken";
const baseUriXpathTemplate = "//Device[@clientIdentifier='{clientid}']/Connection[@local='0']/@uri";
const partKeyXpath = "//Media/Part[1]/@key";

//XPath stands for XML Path Language. It uses a non-XML syntax to provide a flexible way of addressing (pointing to) different parts of an XML document.

/** ACCESS TOKENS **/
const WeWantFlair = "5yZ9z_Hovk_9LygpTGL3";
const DanSaba = "DuZMS7qC_WX-v_iP1xyD";


var accessToken = DanSaba;
var baseUri = null;
var hoveredHref = null;
var pageType = null; // What kind of page is it? An item or a list?

function getXml(url, callback) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseXML);
        }
    };
    request.open("GET", url);
    request.send();
};

function getMetadata(xml) {
    const clientId = clientIdRegex.exec(window.location.href);

    if (clientId) {
        /** Commented out because only the owner's access token now works **/
        //const accessTokenNode = xml.evaluate(accessTokenXpathTemplate.replace('{clientid}', clientId[1]), xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        const baseUriXPath = baseUriXpathTemplate.replace('{clientid}', clientId[1]);
        const baseUriNode = xml.evaluate(baseUriXPath, xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        // Statically set to owner's access token at top
        //if (accessTokenNode.singleNodeValue && baseUriNode.singleNodeValue)
        if (baseUriNode.singleNodeValue) {
            baseUri = baseUriNode.singleNodeValue.textContent;
            console.log("baseUri: " + baseUri);

            // Obtain metadata ID according to the type of page
            let metadataId = null;
            switch (pageType){
                case "item": metadataId = metadataIdRegex.exec(window.location.href);
                    break;
                case "list": metadataId = metadataIdRegex.exec(hoveredHref);
                    break;
                default: metadataId = metadataIdRegex.exec(window.location.href);
            }
            console.log("metadataId: " + metadataId);

            if (metadataId && metadataId.length == 2) {
                // Generate API library URL, download XML, pass to getDownloadUrl()
                const apiLibraryUrl = apiLibraryUrlTemplate.replace('{baseuri}', baseUri).replace('{id}', metadataId[1]).replace('{token}', accessToken);
                console.log("apiLibraryUrl: " + apiLibraryUrl);
                getXml(apiLibraryUrl, getDownloadUrl);
            } else {
                alert("You are currently not viewing a media item.");
            }
        } else {
            alert("Cannot find a valid accessToken.");
        }
    } else {
        alert("You are currently not viewing a media item.");
    }
};

function getDownloadUrl(xml) {
    const partKeyNodes = xml.evaluate(partKeyXpath, xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    for (var partKeyNode = partKeyNodes.iterateNext(); partKeyNode; partKeyNode = partKeyNodes.iterateNext()) {
        if (partKeyNode) {
            const downloadUrl = downloadUrlTemplate.replace('{baseuri}', baseUri).replace('{partkey}', partKeyNode.textContent).replace('{token}', accessToken);
            console.log("downloadUrl: " + downloadUrl);
            // Start download
            window.location.href = downloadUrl;
        }
        else {
            alert("You are currently not viewing a media item.");
        }
    }
};

function downloadItem() {
    if (typeof localStorage.myPlexAccessToken != "undefined") {
        // Get local Plex access token and use it to complete API resource URL
        const apiResourceUrl = apiResourceUrlTemplate.replace('{token}', localStorage.myPlexAccessToken);

        // Get API resource XML and then pass it to getMetadata()
        getXml(apiResourceUrl, getMetadata);
    }
    else {
        alert("You are currently not browsing or logged into a Plex web environment.");
    }
}

function displayAccessToken(){
    if (!accessToken){
        const getMetadata = function(xml){
            const clientId = clientIdRegex.exec(window.location.href);
            if (clientId) {
                const accessTokenNode = xml.evaluate(accessTokenXpathTemplate.replace('{clientid}', clientId[1]), xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                if (accessTokenNode.singleNodeValue) {
                    accessToken = accessTokenNode.singleNodeValue.textContent;
                    alert(accessToken);
                }
                else {
                    alert("Cannot find a valid accessToken.");
                }
            }
            else {
                alert("You are currently not viewing a media item.");
            }
        }

        if (typeof localStorage.myPlexAccessToken != "undefined") {
            getXml(apiResourceUrl.replace('{token}', localStorage.myPlexAccessToken), getMetadata);
        }
        else {
            alert("You are currently not browsing or logged into a Plex web environment.");
        }
    }
    else {
        alert(accessToken);
    }
}

function modifyUI(){
    let shouldInsertButton = true;
    let mutationObserver1 = new MutationObserver( (mutations, me) => {
        let $rightNavBar = $(".NavBar-right-PQX3AG.NavBar-side-AiqnET");
        let $accessTokenBtn = $("#accessTokenBtn");

        const clientId = clientIdRegex.exec(window.location.href);

        if (clientId){
            let $menuDropdown = $(".Menu-menuScroller-XtY7Ni");
            if ($menuDropdown.length){
                if (shouldInsertButton){
                    shouldInsertButton = false;
                    $menuDropdown.prepend('<button id="downloadBtn" data-testid="dropdownItem" role="menuitem" class="MenuItem-menuItem-C_KBbX MenuItem-default-NAJl2g Link-link-SxPFpG Link-default-BXtKLo" type="button">Download</button>');
                    $("#downloadBtn").click(() => {
                        downloadItem();
                    });
                }
            }
            else {
                shouldInsertButton = true;
            }
            let $episodes = $(".MetadataItemLinkUnderlay-underlay-ELSsB0");
            if ($episodes.length){
                pageType = "list";
            }
            else {
                pageType = "item";
            }
            $episodes.each( (key, element) => {
                let $episode = $(element);
                $episode.hover( () => {
                    hoveredHref = $episode.attr("href");
                });
            });

            /** Hide access token button for now
            if ($rightNavBar.length && !$accessTokenBtn.length){
                $rightNavBar.prepend('<div id="accessTokenBtn" class="SourceSidebarLink-titles-1TFyZq">Access Token</div>');
                $("#accessTokenBtn").click(() => {
                    displayAccessToken();
                });
            } **/
        }
    });
    mutationObserver1.observe(document, {
        childList : true,
        subtree : true
    });
}

$(document).ready(() => {
    modifyUI();
});