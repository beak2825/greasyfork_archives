// ==UserScript==
// @name         Tweetdeck tweaks
// @namespace    B1773rm4n
// @description  Customizes my own Tweetdeck experience. It's unlikely someone else will enjoy this.
// @copyright    WTFPL
// @license      WTFPL
// @source       https://github.com/B1773rm4n/Tampermonkey_Userscripts/blob/main/tweetdeck_tweaks.js
// @version      1.9.0
// @author       B1773rm4n
// @match        https://*.twitter.com/*
// @connect      githubusercontent.com
// @connect      asuka-shikinami.club
// @icon         https://icons.duckduckgo.com/ip2/twitter.com.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/463043/Tweetdeck%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/463043/Tweetdeck%20tweaks.meta.js
// ==/UserScript==

let arrayListNames;
let leftColumnNode, rightColumnNode
let postAlreadyseen = [];

////// Flow Control //////

(async function start() {

    arrayListNames = await returnNamesFromServer()

    // wait until the page is sufficiently loaded
    let waitThreeSecs = new Promise((resolve) => setTimeout(resolve, 3000))
    await waitThreeSecs

    if (document.URL.indexOf('https://twitter.com/') > -1) {

        await showInListTwitter()

        // watch for changes
        watchDomChangesObserver()

    } else if (document.URL.indexOf('https://tweetdeck.twitter.com/' > -1)) {
        // check if a new element is loaded and do something
        observeTimelineForNewPosts()

        // general css changes
        addStyles()

        // observer for the fullscreen picture improvements
        fullScreenModal()

        // remove unused panels (uBlock origin)
        removePanels()

        // initate localStorage array for seenPosts
        loadLocalStorage()

        doTweetdeckActions()
    } else {
        console.log('cant find domain')
    }

})();

function doTweetdeckActions(newNode) {
    styleNameOfPost(newNode)
    removeShowThisthreadTweetdeck(newNode)
    removeRetweetedTweetdeck(newNode)
}

async function runWhenReady(readySelector) {
    return new Promise((resolve, reject) => {
        var numAttempts = 0;
        var tryNow = function () {
            var elem = document.querySelector(readySelector);
            if (elem) {
                resolve(elem)
            } else {
                numAttempts++;
                if (numAttempts >= 20) {
                    let message = 'Giving up after 20 attempts. Could not find: ' + readySelector
                    console.warn(message);
                    reject(message)
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    })
}


//// Observers /////

function observeTimelineForNewPosts() {
    [leftColumnNode, rightColumnNode] = document.getElementsByClassName("js-column");
    const config = { attributes: false, childList: true, subtree: true };

    const callback = (mutations) => {

        mutations.forEach((element) => {
            element.addedNodes.forEach((newNode) => {

                let isNewTweet = newNode.getAttribute("data-drag-type") == "tweet"
                if (isNewTweet) {
                    console.log(getUserNameFromNode(newNode))
                    doTweetdeckActions(newNode)
                }
            });
        });
    }

    const observer = new MutationObserver(callback);

    observer.observe(leftColumnNode, config);
    observer.observe(rightColumnNode, config);
}

function fullScreenModal() {
    const targetNode = document.getElementById('open-modal');

    const config = { attributes: true, childList: false, subtree: false, attributeFilter: ['style'] };

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                // Check if an image is opened
                if (document.getElementsByClassName('med-tray js-mediaembed').length > 0 && document.getElementsByClassName('med-tray js-mediaembed')[0].hasChildNodes()) {
                    // make the whole image area as clickable as you would click on the small x
                    document.getElementsByClassName('js-modal-panel mdl s-full med-fullpanel')[0].onclick = function () { document.getElementsByClassName('mdl-dismiss')[0].click() }

                    // remove unecessary elements
                    // view original under the picture modal
                    document.getElementsByClassName('med-origlink')[0].remove()
                    // view flag media under the picture modal
                    document.getElementsByClassName('med-flaglink')[0].remove()
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
}

function watchDomChangesObserver() {

    let currentLocation = document.location.href

    const domTreeElementToObserve = document.getElementsByTagName('main')[0]
    const config = { attributes: false, childList: true, subtree: true };

    const observer = new MutationObserver((mutationList) => {
        if (currentLocation !== document.location.href) {
            // location changed!
            currentLocation = document.location.href;

            console.log('location changed!');
            showInListTwitter()
        }
    });

    observer.observe(domTreeElementToObserve, config);
}

////// doTweetdeckActions //////

function styleNameOfPost(newNode) {

    if (newNode) {
        // clear only new element

        let element = newNode.querySelectorAll(".username")[0]

        // cut the name field so the name_id can be seen always
        let nameField = element.previousSibling.previousSibling
        nameField.style.display = 'inherit'
        nameField.style.width = '120px'
        nameField.style.overflow = 'clip'

        // color the name_id field if already in list or not
        let currentlyDisplayedElementName = element.innerHTML
        let inNameInList = arrayListNames.includes(currentlyDisplayedElementName)
        if (inNameInList) {
            element.style.color = "green"
        } else {
            element.style.color = "red"
        }
    } else {
        // color whole screen
        let usernameArray = document.getElementsByClassName('username')

        for (let index = 1; index < usernameArray.length; index++) {
            let element = usernameArray[index];

            // cut the name field so the name_id can be seen always
            let nameField = element.previousSibling.previousSibling
            nameField.style.display = 'inherit'
            nameField.style.width = '120px'
            nameField.style.overflow = 'clip'

            // color the name_id field if already in list or not
            let currentlyDisplayedElementName = element.innerHTML
            let inNameInList = arrayListNames.includes(currentlyDisplayedElementName)
            if (inNameInList) {
                element.style.color = "green"
            } else {
                element.style.color = "red"
            }
        }
    }
}


function removeShowThisthreadTweetdeck(newNode) {
    if (newNode) {
        // clear only new element
        newNode.querySelector('.js-show-this-thread').remove()
    } else {
        // clear whole screen
        let list = document.getElementsByClassName('js-show-this-thread')

        for (let index = 1; index < list.length; index++) {
            let element = list[index];
            element.remove()
        }
    }
}

function removeRetweetedTweetdeck(newNode) {
    if (newNode) {
        // todo fix single remove retweeted
        // clear only new element
        let element = newNode.querySelector('.nbfc')
        if (!element.classList.length == 4) {

            // remove retweeted word
            element.childNodes[2].remove()

            // remove self retweet mention
            let accountName = element.parentNode.nextElementSibling.firstElementChild?.children[1].firstElementChild.firstElementChild.innerText

            if (accountName == element.innerText) {
                element.remove()
            }
        }
    } else {
        // clear whole screen
        let retweetList = document.getElementsByClassName('tweet-context')

        for (let index = 1; index < retweetList.length; index++) {
            let element = retweetList[index];
            element.childNodes[3].childNodes[2].remove()
        }
        // TODO reimplement self retweet mention removal
    }
}


////// External API Call Functions //////

function returnNamesFromServer() {
    return new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.seele-00.asuka-shikinami.club/artists",
        onload: function (response) {
            let artistsArray = response.responseText.split("\n")
            resolve(artistsArray)
        },
        onerror: reject
    }));
}

function sendPostToServer(newNode) {
    // - check if it was scanned already
    // - if already known / scanned -> discard
    // - if new -> send curl with image url

    // select from the column root to the individual post (40 elements as result)
    let rightColumn = document.getElementsByClassName("js-app-columns app-columns horizontal-flow-container without-tweet-drag-handles")[0].children[1]

    if (rightColumn.contains(newNode)) {

        let username = getUserNameFromNode(newNode)

        // check if the artist is in the list
        let isUsernameInList = arrayListNames.includes(username)

        // check if we already processed this post
        let isPostAlreadyseen = isPostAlreadyProcessed(newNode)

        if (isUsernameInList && !isPostAlreadyseen) {
            // check amount of images
            let images = getImageUrlsFromNode(newNode)

            images.forEach(element => {

                // if new -> send curl with image url
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://api.seele-00.asuka-shikinami.club/imageurl",
                    data: element,
                    onload: function (response) {
                        console.log(response.responseText);
                        console.log(username + " " + isUsernameInList);

                        addPostToAlreadyProcessedList(newNode)
                    }
                });
            });
        } else {
            // - if already known / scanned -> discard
        }
    }
}


////// Single Action Functions //////

function isPostAlreadyProcessed(newNode) {
    let tweetId = newNode.getAttribute("data-tweet-id")
    return postAlreadyseen.includes(tweetId)
}

function addPostToAlreadyProcessedList(newNode) {
    let tweetId = newNode.getAttribute("data-tweet-id")

    postAlreadyseen.push(tweetId)
    postAlreadyseen = [...new Set(postAlreadyseen)];
    postAlreadyseen = postAlreadyseen.slice(-100)
    let persistPosts = JSON.stringify(postAlreadyseen)
    GM_setValue("postAlreadyseen", persistPosts);
}

async function showInListTwitter() {

    // This colors the text of the artist in the timeline into red when he isn't in the known artist list
    if (document.URL.indexOf('https://twitter.com/') > -1) {
        let nameElement
        if (window.location.href.indexOf('status') > 0) {
            let nameElementTemp = await runWhenReady("div[data-testid='User-Name']")
            nameElement = nameElementTemp.children[1]?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild
        } else {
            let nameElementTemp = await runWhenReady("div[data-testid='UserName']")
            nameElement = nameElementTemp?.firstChild?.firstChild?.children[1]?.firstChild?.firstChild?.firstChild?.firstChild
        }

        let currentlyDisplayedElementName = nameElement.textContent
        let inNameInList = arrayListNames.includes(currentlyDisplayedElementName)

        if (inNameInList) {
            nameElement.style.color = "green"
        } else {
            nameElement.style.color = "red"
        }
    }
}

function getImageUrlsFromNode(node) {

    var images = []
    let imageraws = node.querySelectorAll(".js-media-image-link")

    imageraws.forEach((element) => {
        let image = element.style.getPropertyValue('background-image')
        images.push(image.substr(5, image.length - 7))
    });

    if (images.length > 0) {
        return images
    } else {
        alert("No getImageUrlsFromNode")
    }
}

function removePanels() {
    document.getElementsByClassName("js-column-header js-action-header flex-shrink--0 column-header")[0].remove()
    document.getElementsByClassName("js-column-header js-action-header flex-shrink--0 column-header")[0].remove()

    document.getElementsByClassName("js-column-message scroll-none")[0].parentElement.remove()
    document.getElementsByClassName("js-column-message scroll-none")[0].parentElement.remove()
}

function loadLocalStorage() {
    // initate localStorage array for seenPosts
    let postAlreadyseenString = GM_getValue("postAlreadyseen")
    if (postAlreadyseenString) {
        let postAlreadyseenJson = JSON.parse(postAlreadyseenString)
        postAlreadyseen = Array.from(postAlreadyseenJson)
        console.log(postAlreadyseen)
    }
}

////// Helper Functions //////

function getAllTweetNodes() {
    return document.getElementsByTagName("article")
}

function getLeftColumnTweetNodes() {
    let leftColumnTweetNodes = []
    let allTweetNodes = getAllTweetNodes()
    for (let i = 0; i < allTweetNodes.length; i++) {
        const element = allTweetNodes[i];
        if (leftColumnNode.contains(element)) {
            leftColumnTweetNodes.push(element)
        }
    }
    return leftColumnTweetNodes
}

function getRightColumnTweetNodes() {
    let rightColumnTweetNodes = []
    let allTweetNodes = getAllTweetNodes()
    for (let i = 0; i < allTweetNodes.length; i++) {
        const element = allTweetNodes[i];
        if (rightColumnNode.contains(element)) {
            rightColumnTweetNodes.push(element)
        }
    }
    return rightColumnTweetNodes
}

function isInLeftColumn(node) {
    return leftColumnNode.contains(node)
}

function isInRightColumn(node) {
    return rightColumnNode.contains(node)
}

function getUserNameFromNode(node) {
    return node.querySelector(".username").innerText
}

function getUserIdFromNode(node) {
    return node.querySelector(".username").previousSibling.previousSibling.innerText
}

////// CSS Stylesheets //////

function addStyles() {
    'use strict';

    GM_addStyle(`
    .med-fullpanel {
    background-color: transparent !important;
    box-shadow: 0 !important;
        }
` );

    GM_addStyle(`
    html.dark .mdl {
    background-color: transparent !important;
    box-shadow: none !important;
    border-radius: 0 !important;
        }
` );


    GM_addStyle(`
    html.dark .is-condensed .app-content {
    left: 0px
        }
` );

    GM_addStyle(`
    .overlay, .ovl {
    background: transparent !important;
        }
` );


    GM_addStyle(`
    .mdl-dismiss {
    visibility: hidden !important;
        }
` );

    GM_addStyle(`
    .med-tweet {
    background-color: rgb(21, 32, 43) !important;
        }
` );

    GM_addStyle(`
    .js-app-columns .app-columns .horizontal-flow-container .without-tweet-drag-handles {
        padding-left: 0px !important;
        }
` );

    GM_addStyle(`
    .app-columns {
        padding-left: 0px !important;
        padding: 0px !important;
        }
` );

}