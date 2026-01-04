// ==UserScript==
// @name         Odysee Mass Like Dislike
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ging ging gong
// @author       valkyrienyanko
// @match        https://odysee.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434760/Odysee%20Mass%20Like%20Dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/434760/Odysee%20Mass%20Like%20Dislike.meta.js
// ==/UserScript==

// Instructions
// 1. Go to your favorite or most disliked channel
// 2. Keep scrolling down until all the videos in the channel are loaded
// 3. Scroll back up to the top and click on "Mass Like" or "Mass Dislike" and sit back and watch the magic!

setTimeout(function() {
    var slashCount = (window.location.href.replace("https://", "").match(/\//g) || []).length // Count all the slashes in the URL

    if (slashCount <= 1) {
        // Channel Page
        var channelQuickActions = document.getElementsByClassName("channel__quick-actions")[0]

        createButton(channelQuickActions, "Mass Dislike", massDislike)
        createButton(channelQuickActions, "Mass Like", massLike)

        return
    }

    // Video Page
    var buttons = document.getElementsByClassName("button button--no-style button--file-action")

    var action = localStorage.getItem('action')

    if (action == 'dislike'){
        var dislikeButton = null

        // Find the dislike button
        for (let i = 0; i < buttons.length; i++){
            if (buttons[i].ariaLabel == "I dislike this"){
                dislikeButton = buttons[i]
                break
            }
        }

        if (!dislikeButton.classList.contains("button--slime")){
            dislikeButton.click()
        }
    }

    if (action == 'like'){
        var likeButton = null

        // Find the like button
        for (let i = 0; i < buttons.length; i++){
            if (buttons[i].ariaLabel == "I like this"){
                likeButton = buttons[i]
                break
            }
        }

        if (!likeButton.classList.contains("button--fire")){
            likeButton.click()
        }
    }


    // Go to the next video
    setTimeout(function() {

        var urls = JSON.parse(localStorage.getItem('urls'))

        console.log(urls)

        var url = urls[0]

        urls.shift()
        localStorage.setItem('urls', JSON.stringify(urls));

        window.location.href = url

    }, 1000);


}, 1000);

var urls = []

function massDislike(){
    localStorage.setItem('action', 'dislike')
    loadURLs()
    loadFirstVideo()
}

function massLike(){
    localStorage.setItem('action', 'like')
    loadURLs()
    loadFirstVideo()
}

function loadFirstVideo(){
    const url = urls[0]

    urls.shift()
    localStorage.setItem('urls', JSON.stringify(urls));

    window.location.href = url
}

function loadURLs(){
    var uploads = document.getElementsByClassName("claim-preview--tile")

    for (let i = 0; i < uploads.length; i++) {
        urls.push(uploads[i].getElementsByTagName("a")[0].href)
    }
}

function createButton(context, text, func) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = text;
    button.onclick = func;
    context.appendChild(button);
    return button;
}