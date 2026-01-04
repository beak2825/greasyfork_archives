// ==UserScript==
// @name YouTube Auto-Liker
// @description Hit Like button if Subbed
// @match https://www.youtube.com/watch*
// @icon https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/2560px-Logo_of_YouTube_%282015-2017%29.svg.png
// @version 5.1
// @license MIT

// @namespace https://greasyfork.org/users/803889
// @downloadURL https://update.greasyfork.org/scripts/455632/YouTube%20Auto-Liker.user.js
// @updateURL https://update.greasyfork.org/scripts/455632/YouTube%20Auto-Liker.meta.js
// ==/UserScript==




function ytLiker() {
    SUBSCRIBE_BUTTON = document.querySelector('#subscribe-button-shape .yt-core-attributed-string--white-space-no-wrap').innerHTML == 'Subscribed'
    LIKE_BUTTON = document.querySelector('button.yt-spec-button-shape-next--segmented-start')

    if (!SUBSCRIBE_BUTTON) {
        console.log('YouTube Auto-Liker: You\'re not subscribed!')
        return
    }
    else if (LIKE_BUTTON.ariaPressed == 'false') {
        LIKE_BUTTON.click()
        console.log('YouTube Auto-Liker: Video Liked!')
        return
    }
    else {
        console.log('YouTube Auto-Liker: Video Already Liked!')
        return
    }
}


function setupObserver() {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // && document.querySelector('button.yt-spec-button-shape-next--segmented-start')
            if (mutation.type === "attributes" && mutation.attributeName === 'video-id') { //&& mutation.attributeName === 'yt-spec-touch-feedback-shape__fill'
                console.log('YouTube Auto-Liker: Video ID changed. Checking if subscribed and liking')
                counter = 0
                querySelector = setInterval(function checker() {
                    if (document.querySelector('button.yt-spec-button-shape-next--segmented-start')) {
                        ytLiker()
                        clearInterval(querySelector)
                    } else {
                        counter++
                        if (counter <= 15) {
                            console.log('YouTube Auto-Liker: --Counter limited reached-- Could not like video or setup observer. Try refreshing the page.?')
                            clearInterval(querySelector)
                            return
                        }
                    }
                }, 2000)
            }
        })
    })

    watchMetadata = document.querySelector('ytd-watch-metadata.watch-active-metadata.style-scope.ytd-watch-flexy.style-scope.ytd-watch-flexy')
    observer.observe(watchMetadata, {
        attributes: true
    })
    console.log('YouTube Auto-Liker: Monitoring for new videos')
}

counter = 0
try {
    interval_documentHidden = setInterval(function checker() {
        if (!document.hidden && document.readyState === 'complete' && (document.querySelector('#subscribe-button-shape .yt-core-attributed-string--white-space-no-wrap') !== null) && (document.querySelector('button.yt-spec-button-shape-next--segmented-start') !== null)) {
            if (counter <= 15) {
                console.log('YouTube Auto-Liker: Checking if subscribed and liking')
                setupObserver()
                ytLiker()
                clearInterval(interval_documentHidden)
            } else {
                counter++
                if (counter <= 15) {
                    console.log('YouTube Auto-Liker: --Counter limited reached-- Could not like video or setup observer. Try refreshing the page.?')
                    clearInterval(interval_documentHidden)
                    return
                }
            }
        }
    }, 2000)
} catch (err) {
    console.log('YouTube Auto-Liker: Error occured\n######\n\nerr' + err + '\n\n######')
}