// ==UserScript==
// @name            YouTube Clickbait-Buster
// @version         1.10.16
// @description     Check whether it's worth watching a video before actually clicking on it by peeking it's visual or verbal content, description, comments, viewing the thumbnail in full-size and displaying the full title. Works on both YouTube's desktop and mobile layouts, and is also compatible with dark theme.
// @author          BLBC (github.com/hjk789, greasyfork.org/users/679182-hjk789)
// @copyright       2022+, BLBC (github.com/hjk789, greasyfork.org/users/679182-hjk789)
// @homepage        https://github.com/hjk789/Userscripts/tree/master/YouTube-Clickbait-Buster
// @license         https://github.com/hjk789/Userscripts/tree/master/YouTube-Clickbait-Buster#license
// @match           https://www.youtube.com/*
// @match           https://m.youtube.com/*
// @grant           none
// @namespace https://greasyfork.org/users/679182
// @downloadURL https://update.greasyfork.org/scripts/439305/YouTube%20Clickbait-Buster.user.js
// @updateURL https://update.greasyfork.org/scripts/439305/YouTube%20Clickbait-Buster.meta.js
// ==/UserScript==


//*********** SETTINGS ***********

const numberChunkColumns = 1             // The video storyboard YouTube provides is divided in chunks of frames. Set this to the number of chunks per row you
                                         // would like. Note that the size and the number of chunks per row is limited by your device's screen dimensions.

const fullTitles = true                  // Whether the videos' title should be forced to be displayed in full, without any trimmings. In case you are using any other userscript
                                         // or extension that changes YouTube's layout, set this to false if you see anything wrong in the layout, such as titles overlapping.

const sortByTopComments = true           // Whether the comments popup should be sorted by "Top comments" by default. If set to false, it will be sorted by "Newest first".

const preferredTranscriptLanguage = ""   // The two letters language-country code of the language you want the transcriptions to always be in. Examples: for US English, en-US,
                                         // for Spain's Spanish, es-ES, and so on. If there's no subtitles in the specified language, another language (if any) will be selected
                                         // and then translated to the specified language. If left blank, the language most likely to be the original is selected.
//********************************


let selectedVideoURL, continuationToken
const isMobile = !/www/.test(location.hostname)
let isMenuReady = false, hasSpace

/* Add some internal functions to the code */
extendFunctions()

/* Add the styles */
{
    const style = document.createElement("style")
    style.innerHTML = ".menu-item-button:hover { background-color: #aaa5 !important; }" +            // Add the desktop version's hover for the recommendation menu items.
                      "transcript text { display: block; margin-top: 10px; }" +                      // Separate each line of the transcript. By default the transcript lines are displayed in a single continuous line.
                      ".naturalWidth > div > div { opacity: 0.8 !important; }" +                     // Make the timestamps more opaque when there's enough screen space for the image to be displayed in full size.
                      ".hasSpace > div { margin: 1px !important; }"                                  // Add a margin around chunks to visually separate them when there's enough space for more than one column.

    if (fullTitles)
        style.innerHTML += "#video-title, h3, h4 { max-height: initial !important; -webkit-line-clamp: initial !important; }"                // The full video title style.

    document.head.appendChild(style)
}


/* Remove the popups when the page is clicked */
{
    document.body.addEventListener("click", function()
    {
        const ids = ["storyboard","highresThumbnail","transcriptContainer","channelViewportContainer","commentsContainer"]

        for (let i=0; i < ids.length; i++)
        {
            const element = document.getElementById(ids[i])

            if (element)  element.remove()
        }

        hasSpace = undefined
    })
}


/* Create the menu buttons */
{
    const elementName = isMobile ? "button" : "div"
    var backgroundColor = "var(--yt-spec-brand-background-solid, "+ getComputedStyle(document.documentElement).backgroundColor +")"                 // This CSS variable holds the background color of either the light theme or dark theme, whatever is the current
                                                                                                                                                    // one. But it's only available on desktop, on mobile the color need to be taken from the root element's CSS.
    var viewStoryboardButton = createElement(elementName,
    {
        id: "viewStoryboardButton",
        className: "menu-item-button",
        style: !isMobile ? "background-color: var(--yt-spec-brand-background-solid); font-size: 14px; padding: 9px 15px 9px 56px; cursor: pointer; min-width: max-content;" : "",
        innerHTML: "Peek video content",
        onclick: function()
        {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', selectedVideoURL)
            xhr.onload = function()
            {
                const fullStoryboardURL = xhr.responseText.match(/"playerStoryboardSpecRenderer":.+?"(https.+?)",/)

                if (!fullStoryboardURL || fullStoryboardURL[1].includes("googleadservices"))                // It can happen sometimes that the storyboard provided is of the ad, instead of the video itself.
                {                                                                                           // But this seems to only happen on videos that don't have a storyboard available anyway.
                    alert("Storyboard not available for this video!")

                    return
                }

                const urlSplit = fullStoryboardURL[1].split("|")
                let mode = urlSplit[3] ? 3 : 1                                  // YouTube provides 2 modes of storyboards: one with 25 frames per chunk and another one with 60 frames per chunk. I've choose the former mode,
                                                                                // as in the second one the frames are too tiny to see anything. But in short videos with less than 30 seconds, only the latter is available.
                if (!urlSplit[mode])                                            // There's also a third mode, videos that have only one mode and ongoing lives storyboards, but I couldn't find any way to make them work.
                {
                    alert("Storyboard not available for this video yet! Try again some hours later.")

                    return
                }

                const storyboardId = urlSplit[mode].replace(/.+#rs/, "&sigh=rs")

                const storyboardContainer = document.createElement("div")
                storyboardContainer.id = "storyboard"
                storyboardContainer.style = "position: fixed; z-index: 9999; display: grid; width: min-content; max-width: 100.3vw; overflow-y: inherit; background-color: white; margin: auto; top: 0px; left: 0px; right: 0px;"
                storyboardContainer.style.maxHeight = isMobile ? "91.4vh" : "100vh"
                storyboardContainer.contentEditable = !isMobile                // Make the storyboards container focusable on the desktop layout. From all the other methods to achieve this, this is the only one that works reliably.
                storyboardContainer.onmousedown = function() {
                    window.getSelection().removeAllRanges()                    // Because contentEditable is true, the storyboards become selectable. This prevents that by immediately deselecting them.
                }

                document.body.appendChild(storyboardContainer)


                if (mode == 3)  mode--

                let num = 0

                const videoLength = +xhr.responseText.match(/"lengthSeconds":"(\d+)","ownerProfileUrl/)[1]
                const secondsGap = videoLength <= 120 ? 1 : videoLength <= 300 ? 2 : videoLength < 900 ? 5 : 10                     // Depending on the video length, YouTube takes snapshots with different time spaces.

                createStoryboardImg(num, storyboardContainer, urlSplit, storyboardId, mode, videoLength, secondsGap)
            }
            xhr.send()

            document.body.click()     // Dismiss the menu.
        }
    })

    var viewTranscriptButton = createElement(elementName,
    {
        className: viewStoryboardButton.className,
        style: viewStoryboardButton.style.cssText,
        innerHTML: "Peek audio transcription",
        onclick: function()
        {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', selectedVideoURL)
            xhr.onload = function()
            {
                let transcriptObj = xhr.responseText.match(/"playerCaptionsTracklistRenderer":({"captionTracks":\[{"baseUrl".+?}\].+?}.+?\].+?})},"videoDetails"/)

                if (!transcriptObj)
                {
                    alert("Transcript not available for this video!")

                    return
                }

                transcriptObj = JSON.parse(unescape(decodeURI(transcriptObj[1])).replaceAll("\\u0026","&"))

                const transcriptContainer = document.createElement("div")
                transcriptContainer.id = "transcriptContainer"
                transcriptContainer.style = "position: fixed; z-index: 9999; background-color: " + backgroundColor + "; color: var(--paper-listbox-color); font-size: 15px;" +
                                            "width: max-content; max-width: 92vw; overflow: auto scroll; top: 0; left: 0; right: 0; margin: auto; padding: 10px;"
                transcriptContainer.style.maxHeight = isMobile ? "90vh" : "98vh"
                transcriptContainer.onclick = function() { event.stopPropagation() }

                const transcriptLanguageLabel = document.createElement("div")
                transcriptLanguageLabel.innerText = "Transcript language: "
                transcriptLanguageLabel.style = "margin-bottom: 5px; width: max-content;"
                transcriptContainer.appendChild(transcriptLanguageLabel)

                const transcriptLanguageDropdown = document.createElement("select")
                transcriptLanguageDropdown.style = "background-color: " + backgroundColor + "; color: var(--paper-listbox-color); border: 1px solid lightgray; border-radius: 5px; padding: 3px;"
                transcriptLanguageDropdown.onchange = function() { loadTranscript(transcriptObj.captionTracks[this.selectedIndex].baseUrl) }
                transcriptLanguageLabel.appendChild(transcriptLanguageDropdown)

                for (let i=0; i < transcriptObj.captionTracks.length; i++)
                {
                    const option = document.createElement("option")
                    option.innerText = isMobile ? transcriptObj.captionTracks[i].name.runs[0].text : transcriptObj.captionTracks[i].name.simpleText
                    option.value = transcriptObj.captionTracks[i].languageCode

                    transcriptLanguageDropdown.appendChild(option)
                }

                transcriptLanguageDropdown.value = preferredTranscriptLanguage

                if (preferredTranscriptLanguage && !transcriptLanguageDropdown.value)
                    transcriptLanguageDropdown.value = preferredTranscriptLanguage.split("-")[0]

                if (!transcriptLanguageDropdown.value)
                {
                    if (transcriptObj.captionTracks.length > 1)
                    {
                        const index = transcriptObj.audioTracks[0].captionTrackIndices[transcriptObj.audioTracks[0].captionTrackIndices.length-1]
                        const autogen = transcriptObj.captionTracks[index]

                        if (autogen.vssId[0] == "a")
                        {
                            const a = autogen.vssId.split(".")[1]

                            if (transcriptObj.captionTracks[index+1] && transcriptObj.captionTracks[index+1].vssId.includes(a))
                                transcriptLanguageDropdown.value = transcriptObj.captionTracks[index+1].languageCode
                            else if (transcriptObj.captionTracks[index-1])
                                transcriptLanguageDropdown.value = transcriptObj.captionTracks[index-1].languageCode
                            else
                                transcriptLanguageDropdown.value = transcriptObj.captionTracks[transcriptObj.audioTracks[0].captionTrackIndices[0]].languageCode
                        }
                    }
                    else transcriptLanguageDropdown.value = transcriptLanguageDropdown.options[0].value
                }


                const transcriptTranslationLabel = document.createElement("div")
                transcriptTranslationLabel.innerText = "Translate to: "
                transcriptTranslationLabel.style = "margin-top: 10px; padding-bottom: 10px;"
                transcriptContainer.appendChild(transcriptTranslationLabel)

                const transcriptTranslationDropdown = document.createElement("select")
                transcriptTranslationDropdown.style = "margin-left: 53px; background-color: " + backgroundColor + "; color: var(--paper-listbox-color); border: 1px solid lightgray; border-radius: 5px; padding: 3px;"
                transcriptTranslationDropdown.onchange = function() { loadTranscript(transcriptObj.captionTracks[transcriptLanguageDropdown.selectedIndex].baseUrl + "&tlang=" + this.value) }
                transcriptTranslationLabel.appendChild(transcriptTranslationDropdown)

                const emptyOption = document.createElement("option")
                transcriptTranslationDropdown.appendChild(emptyOption)

                for (let i=0; i < transcriptObj.translationLanguages.length; i++)
                {
                    const option = document.createElement("option")
                    option.innerText = isMobile ? transcriptObj.translationLanguages[i].languageName.runs[0].text : transcriptObj.translationLanguages[i].languageName.simpleText
                    option.value = transcriptObj.translationLanguages[i].languageCode

                    transcriptTranslationDropdown.appendChild(option)
                }

                transcriptTranslationDropdown.value = preferredTranscriptLanguage

                if (!transcriptTranslationDropdown.value)
                    transcriptTranslationDropdown.value = preferredTranscriptLanguage.split("-")[0]

                if (transcriptLanguageDropdown.value.startsWith(transcriptTranslationDropdown.value))
                    transcriptTranslationDropdown.value = ""

                const transcriptTextContainer = document.createElement("div")
                transcriptTextContainer.id = "transcriptTextContainer"
                transcriptTextContainer.style = "min-width: max-content; max-width: 92vw; border-top: 1px solid lightgray;"
                transcriptContainer.appendChild(transcriptTextContainer)

                if (isMobile)
                {
                    const closeButton = transcriptContainer.createElment("div",
                    {
                        innerText: "X",
                        style: "position: sticky; width: 25px; float: right; bottom: 0px; background-color: #f0f0f0ab; border-radius: 7px; padding: 10px 15px; text-align: center; font-size: 25px;",
                        onclick: function() { document.body.click() }
                    })
                }


                document.body.appendChild(transcriptContainer)


                loadTranscript(transcriptObj.captionTracks[transcriptLanguageDropdown.selectedIndex].baseUrl + "&tlang=" + (transcriptLanguageDropdown.value.startsWith(transcriptTranslationDropdown.value) ? "" : transcriptTranslationDropdown.value))
            }
            xhr.send()

            document.body.click()
        }
    })

    var viewDescriptionButton = createElement(elementName,
    {
        className: viewStoryboardButton.className,
        style: viewStoryboardButton.style.cssText,
        innerHTML: "Peek description",
        onclick: function()
        {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', selectedVideoURL)
            xhr.onload = function()
            {
                const description = xhr.responseText.match(/"shortDescription":"(.+?)[^\\]"/)[1].replaceAll("\\n","\n").replaceAll("\\r","\r").replaceAll("\\","")

                if (description.length < 2)
                    alert("This video doesn't have a description.")
                else
                    alert(description)
            }
            xhr.send()

            document.body.click()
        }
    })

    var viewCommentsButton = createElement(elementName,
    {
        className: viewStoryboardButton.className,
        style: viewStoryboardButton.style.cssText,
        innerHTML: "Peek comments",
        onclick: function()
        {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', selectedVideoURL)
            xhr.onload = function()
            {
                const apiKey = xhr.responseText.match(/"INNERTUBE_API_KEY":"(.+?)"/)[1]
                let token = xhr.responseText.match(isMobile ? /\\x22continuationCommand\\x22:\\x7b\\x22token\\x22:\\x22(\w+)\\x22/ : /"continuationCommand":{"token":"(.+?)"/)[1]
                token = sortByTopComments ? token.replace("ABeA", "AAeA") : token.replace("AAeA", "ABeA")                                                // One single character in the token is responsible for determining the sorting
                                                                                                                                                         // of the comments, being A the "Top comments" and B the "Newest first".
                const pageName = selectedVideoURL.includes("/shorts/") ? "browse" : "next"

                const commentsContainer = document.createElement("div")
                commentsContainer.id = "commentsContainer"
                commentsContainer.style = "position: fixed; top: 0; left: 0; right: 0; z-index: 9999; margin: auto; width: 700px; max-width: 92vw; overflow-y: scroll; padding: 10px;"+
                                          "border: 1px solid lightgray; background-color: "+ backgroundColor +"; color: var(--paper-listbox-color); font-size: 15px; visibility: hidden;"
                commentsContainer.style.maxHeight = isMobile ? "92vh" : "97vh"
                commentsContainer.onclick = function() { event.stopPropagation() }

                const sortingDropdownLabel = commentsContainer.createElment("span", {innerText: "Sort by: "})

                const sortingDropdown = sortingDropdownLabel.createElment("select",
                {
                    style: "background-color: " + backgroundColor + "; color: var(--paper-listbox-color); border: 1px solid lightgray; border-radius: 5px; padding: 3px; margin-bottom: 10px; margin-left: 5px;",
                    onchange: function()
                    {
                        commentsTextContainer.innerHTML = ""

                        token = token.replace(/A(A|B)eA/, "A"+this.value+"eA")

                        loadCommentsOrReplies(commentsTextContainer, pageName, apiKey, token)
                    }
                })

                sortingDropdown.createElment("option", {innerText: "Top comments", value: "A"})
                sortingDropdown.createElment("option", {innerText: "Newest first", value: "B"})

                sortingDropdown.value = sortByTopComments ? "A" : "B"


                const commentsTextContainer = commentsContainer.createElment("div", {style: "border-top: 1px solid lightgray; padding-top: 10px;"})

                document.body.appendChild(commentsContainer)

                if (isMobile)
                {
                    const closeButtonPositionContainer = commentsContainer.createElment("div", {style: "position: relative; right: 55px;"}, true)
                    const closeButtonContainer = closeButtonPositionContainer.createElment("div", {style: "position: absolute; right: 0px;"})
                    const closeButton = closeButtonContainer.createElment("div",
                    {
                        innerText: "X",
                        style: "position: fixed; width: 25px; z-index: 99999; background-color: #ddd8; border-radius: 7px; padding: 10px 15px; text-align: center; font-size: 25px;",
                        onclick: function() { document.body.click() }
                    })
                }

                loadCommentsOrReplies(commentsTextContainer, pageName, apiKey, token)
            }
            xhr.send()

            document.body.click()
        }
    })

    var viewChannelButton = createElement(elementName,
    {
        className: viewStoryboardButton.className,
        style: viewStoryboardButton.style.cssText,
        innerHTML: "Peek channel",
        onclick: function()
        {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', selectedVideoURL)
            xhr.onload = function()
            {
                const channelId = xhr.responseText.match(/"channelId":"(.+?)"/)

                const channelViewportContainer = document.body.createElment("div",
                {
                    id: "channelViewportContainer",
                    style: "position: fixed; width: 720px; max-width: 100vw; height: "+ (isMobile ? "91vh" : "100vh") +"; top: 0; left: 0px; right: 0px; z-index: 9999; margin: auto; background-color: "+ backgroundColor +";"
                })

                const channelViewport = channelViewportContainer.createElment("iframe",
                {
                    style: "width: calc(100% - 4px); height: 100%;",
                    src: "https://www.youtube.com/channel/" + channelId[1]
                })

                if (isMobile)
                {
                    const closeButton = channelViewportContainer.createElment("div",
                    {
                        innerText: "X",
                        style: "position: absolute; width: 25px; top: 0px; z-index: 99999; background-color: #ddd; border-radius: 7px; padding: 10px 15px; text-align: center; font-size: 25px;",
                        onclick: function() { document.body.click() }
                    }, true)
                }
            }
            xhr.send()

            document.body.click()
        }
    })

    var viewThumbnailButton = createElement(elementName,
    {
        id: "viewThumbnailButton",
        className: viewStoryboardButton.className,
        style: viewStoryboardButton.style.cssText,
        innerHTML: "View high-res thumbnail",
        onclick: function()
        {
            event.stopPropagation()             // Prevent the click event from reaching the body, otherwise the thumbnail is removed right after.

            if (!isMobile)
                document.body.click()
            else
                this.parentElement.click()              // On mobile, the menu creates a backdrop above the body which is only dismissed when clicked. Clicking the body element doesn't work in this case.

            const videoId = cleanVideoUrl(selectedVideoURL).split(/=|shorts\//)[1]

            const img = document.createElement("img")
            img.id = "highresThumbnail"
            img.src = "https://i.ytimg.com/vi_webp/" + videoId + "/maxresdefault.webp"
            img.style = "position: fixed; z-index: 9999; max-height: 100vh; max-width: 100vw; margin: auto; top: 0px; left: 0px; right: 0px;"
            img.onload = function()
            {
                if (this.clientWidth == 120)                // The default thumbnail URL points to the biggest size and highest quality. But sometimes it can happen that this kind of thumbnail is not available (especially on older videos). When this
                {                                           // happens, YouTube responds with a small placeholder image with 120 width. This checks if it's the placeholder, and if so, tries again with a lower quality version and then a smaller size.
                    this.onload = function()
                    {
                        if (this.clientWidth == 120)
                        {
                            this.onload = function()
                            {
                                if (this.clientWidth == 120)
                                {
                                    this.onload = function()
                                    {
                                        if (this.clientWidth == 120)
                                        {
                                            alert("Thumbnail not found!")

                                            this.onload = undefined
                                        }
                                    }

                                    this.src = "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg"
                                }
                            }

                            this.src = "https://i.ytimg.com/vi_webp/" + videoId + "/hqdefault.webp"
                        }
                    }

                    this.src = "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg"
                }
            }

            document.body.appendChild(img)

        }
    })


    viewStoryboardButton.style.borderTop = "solid 1px #aaa5"             // Add a separator between Youtube's menu items and the ones added by the script.

}


main()


function main()
{
    const videosSelector = isMobile ? "ytm-rich-item-renderer, ytm-video-with-context-renderer, ytm-compact-video-renderer, ytm-compact-playlist-renderer, ytm-compact-show-renderer, ytm-playlist-video-renderer"
                                    : "ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-compact-playlist-renderer, ytd-compact-movie-renderer, ytd-playlist-video-renderer, ytd-reel-item-renderer, ytd-video-renderer, ytd-compact-radio-renderer"

    if (!isMobile)
        addMenuItems()

    document.body.addEventListener("mousedown", function()                      // Process all video items every time the user clicks anywhere on the page. Although not
    {                                                                           // ideal, it's the most guaranteed way of working reliably regardless of the situation.
        const videoItems = document.querySelectorAll(videosSelector)

        for (let i=0; i < videoItems.length; i++)
            processVideoItem(videoItems[i])
    })

    window.onresize = function() { checkScreenSpaceAndAdaptStoryboard() }
    screen.orientation.onchange = function() { checkScreenSpaceAndAdaptStoryboard() }
}

function addMenuItems()
{
    const waitForMenu = setInterval(function()
    {
        const menu = isMobile ? document.getElementsByClassName("yt-spec-bottom-sheet-layout")[0] : document.querySelector("#details #menu yt-icon, .details #menu yt-icon, #title-wrapper #menu .ytd-menu-renderer > #button yt-icon, ytd-playlist-video-renderer #menu yt-icon")

        if (!menu)
            return

        clearInterval(waitForMenu)

        menu.parentElement.previousSibling.addEventListener("click", function()
        {
            document.getElementById("viewStoryboardButton").parentElement.remove()
        })

        if (isMobile)
            menu.style = "bottom: 204px; border-radius: 15px 15px 0px 0px;"
        else if (document.getElementById("viewStoryboardButton") || document.getElementById("viewThumbnailButton"))
        {
            const isYRRHInstalled = document.getElementById("hideChannelButton")
            let widthPx = "230px"

            if (isYRRHInstalled)
                widthPx = "260px"

            const menu = document.getElementById("viewStoryboardButton").parentElement.parentElement                                                                                               // YouTube resets the menu size everytime it's opened,
            menu.style = "max-height: max-content !important; max-width: max(100%, "+widthPx+") !important; height: max-content !important; width: max(100%, "+widthPx+") !important;"             // so the script needs to force max size right after.

            const bottomValue = menu.firstElementChild.getBoundingClientRect().bottom
            const menuContainer = menu.parentElement.parentElement.style

            if (bottomValue > screen.height)                                                                      // If the menu is opened when there's little vertical space or the menu items were removed, the menu's
                menuContainer.top = parseInt(menuContainer.top) - (bottomValue - screen.height + 10) + "px"       // bottom will be displayed out of bounds. This forces the menu to be moved up when that happens.

            return
        }


        if (isMobile)
        {
            const YCBmenu = document.createElement("div")
            YCBmenu.style = "position: fixed; inset: auto 0 0 0; z-index: 9999; background: "+backgroundColor+"; border-radius: 0px 0px 15px 15px; margin: 8px;"

            YCBmenu.appendChild(viewStoryboardButton)
            YCBmenu.appendChild(viewTranscriptButton)
            YCBmenu.appendChild(viewDescriptionButton)
            YCBmenu.appendChild(viewCommentsButton)
            YCBmenu.appendChild(viewChannelButton)
            YCBmenu.appendChild(viewThumbnailButton)

            document.body.appendChild(YCBmenu)
        }
        else
        {
            if (!document.querySelector("ytd-menu-popup-renderer"))
            {
                menu.click()
                menu.click()              // The recommendation menu doesn't exist in the HTML before it's clicked for the first time. This forces it to be created and dismisses it immediately.
            }

            const menuParent = document.querySelector("ytd-menu-popup-renderer")
            const optionsParent = menuParent.querySelector("tp-yt-paper-listbox#items").parentElement
            optionsParent.style = "max-height: max-content !important; max-width: max-content !important; height: max-content !important; width: max-content !important;"                 // Change the max width and height so that the new items fit in the menu.

            const waitForMenuItem = setInterval(function()
            {
                const menuItem = optionsParent.querySelector("ytd-menu-service-item-renderer, ytd-menu-navigation-item-renderer")

                if (!menuItem)
                    return

                clearInterval(waitForMenuItem)


                menuItem.parentElement.appendChild(viewStoryboardButton)
                menuItem.parentElement.appendChild(viewTranscriptButton)
                menuItem.parentElement.appendChild(viewDescriptionButton)
                menuItem.parentElement.appendChild(viewCommentsButton)
                menuItem.parentElement.appendChild(viewChannelButton)
                menuItem.parentElement.appendChild(viewThumbnailButton)

                if (!isMenuReady)
                {
                    menu.click()              // The menu doesn't apply the width and height adjustments the first time it's opened, but it
                    menu.click()              // does on the second time. This forces the menu to be opened again and dismisses it immediately.

                    isMenuReady = true
                }

                const bottomValue = menuItem.parentElement.getBoundingClientRect().bottom
                const menuContainer = optionsParent.parentElement.parentElement.style

                if (bottomValue > screen.height)
                    menuContainer.top = parseInt(menuContainer.top) - (bottomValue - screen.height + 10) + "px"

                const isChannelOrPlaylistPage = location.pathname.includes("/channel/") || location.pathname.includes("/user/") || location.pathname.includes("/c/") || location.pathname == "/playlist"

                if (isChannelOrPlaylistPage && document.querySelector("ytd-topbar-menu-button-renderer #avatar-btn"))             // In the channel page, when the user is signed in, Youtube already adds a separator at the bottom of the menu.
                    viewStoryboardButton.style.borderTop = ""                                                                     // This removes the separator when on these pages.
                else
                    viewStoryboardButton.style.borderTop = "solid 1px #aaa5"                      // And adds it back when the user switches to another non-channel page.

            }, 100)
        }

    }, 100)
}

function processVideoItem(node)
{
    const videoTitleEll = node.querySelector(isMobile ? "h3, h4" : "#video-title, #movie-title")

    if (!videoTitleEll)
        return


    let videoUrl = videoTitleEll.href || videoTitleEll.parentElement.href || videoTitleEll.parentElement.parentElement.href

    const videoMenuBtn = node.querySelector(isMobile ? ".media-item-menu" : "ytd-menu-renderer")

    // Because the recommendation's side-menu is separated from the recommendations container, this listens to clicks on each three-dot
    // button and store in a variable in what recommendation it was clicked, to then be used to load the storyboards or thumbnail.

    if (videoMenuBtn)
    {
        videoMenuBtn.parentElement.onclick = function()
        {
            selectedVideoURL = videoUrl

            addMenuItems()
        }
    }
}

function createStoryboardImg(num, storyboardContainer, urlSplit, param, mode, videoLength, secondsGap, lastTime = 0)
{
    const chunkContainer = document.createElement("div")
    chunkContainer.style = "position: relative; display: inline-block; width: min-content;"
    chunkContainer.contentEditable = false

    const timestampsContainer = document.createElement("div")
    timestampsContainer.style = "position: absolute; display: grid; width: 100%; align-items: self-end;"+
                                "justify-items: end; pointer-events: none; opacity: 0.4; z-index: 1;"

    chunkContainer.appendChild(timestampsContainer)


    const base = urlSplit[0].replace("L$L/$N","L"+mode+"/M"+num++)              // The storyboard URL uses the "L#/M#" parameter to determine the type and part of the storyboard to load. L1 is the
    const img = document.createElement("img")                                   // storyboard chunk with 60 frames, and L2 is the one with 25 frames. M0 is the first chunk, M1 the second, and so on.
    img.src = base+param
    img.style.verticalAlign = "top"
    img.style.maxWidth = isMobile ? "100vw" : "97.6vw"
    img.onload = function()
    {
        const firstImg = storyboardContainer.firstChild.lastChild
        const framesWidth = firstImg.naturalWidth / 5
        const framesHeight = firstImg.naturalHeight / 5

        timestampsContainer.style.height = this.height < firstImg.height ? this.height + "px" : "100%"

        const numColumns = Math.round(this.naturalWidth / framesWidth)
        let numRows = Math.round(this.naturalHeight / framesHeight)

        if (videoLength < 20)
            numRows = videoLength < 5 ? 1 : videoLength < 10 ? 2 : videoLength < 15 ? 3 : 4

        for (let i=0; i < numRows; i++)
        {
            for (let j=0; j < numColumns; j++)
            {
                let seconds = 0

                if (i || j || storyboardContainer.children.length > 1)                      // Only calculate the gap if it's not the first timestamp of the first chunk.
                    seconds = lastTime += secondsGap

                if (seconds > videoLength)
                    seconds = videoLength

                const date = new Date(null)
                date.setSeconds(seconds)
                const time = seconds >= 3600 ? date.toISOString().substr(11, 8) : date.toISOString().substr(14, 5)                      // If the timestamp is above 1 hour, include the hours digit in the timestamp.

                const timestamp = document.createElement("a")
                timestamp.href = selectedVideoURL + "&t=" + seconds
                timestamp.style = "padding: 0px 2px; border-radius: 2px; background-color: #222; color: white;" +
                                  "font-weight: 500; font-size: 11px; text-decoration: none; pointer-events: auto; z-index: 2;"

                timestamp.innerText = time

                timestampsContainer.style.cssText += "grid-template-columns: repeat("+ numColumns +", 1fr); grid-template-rows: repeat("+ numRows +", 1fr);"

                timestampsContainer.appendChild(timestamp)

                if (seconds == videoLength)
                    break

            }
        }


        if (storyboardContainer.children.length == 2 && hasSpace == undefined)
            checkScreenSpaceAndAdaptStoryboard()


        storyboardContainer.focus()

        createStoryboardImg(num, storyboardContainer, urlSplit, param, mode, videoLength, secondsGap, lastTime)                     // Keep loading the storyboard chunks until there's no more left.
    }
    img.onerror = function()
    {
        storyboardContainer.style.overflowY = storyboardContainer.scrollHeight < screen.height ? "hidden" : "scroll"                    // Hide the scrollbar when there's not enough chunks to overflow. It's needs to be either
                                                                                                                                        // scroll or hidden, as in the auto mode the scrollbar stays on top of the image.
        storyboardContainer.contentEditable = false

        if (storyboardContainer.children.length == 1)
        {
            alert("Storyboard not available for this video!")

            storyboardContainer.remove()
        }

        this.parentElement.remove()

        checkScreenSpaceAndAdaptStoryboard()
    }


    chunkContainer.appendChild(img)

    storyboardContainer.appendChild(chunkContainer)
}

function checkScreenSpaceAndAdaptStoryboard(numChunkColumns = numberChunkColumns)
{
    const storyboardContainer = document.getElementById("storyboard")

    if (!storyboardContainer)
        return

    const firstImg = storyboardContainer.firstChild.lastChild

    if (numberChunkColumns > 1 && numChunkColumns > 0)
    {
        if (storyboardContainer.children.length > 1)
        {
            if (firstImg.naturalWidth == firstImg.width)                        // If the chunk is in it's full size.
            {
                const containerSize = (isMobile ? 2 : 21) + firstImg.naturalWidth * numChunkColumns

                hasSpace = screen.width > containerSize

                if (hasSpace)
                {
                    storyboardContainer.style.gridTemplateColumns = "repeat("+ numChunkColumns +", 1fr)"

                    if (numChunkColumns > 1)
                        storyboardContainer.classList.add("hasSpace")
                }
                else
                {
                    storyboardContainer.classList.remove("hasSpace")

                    checkScreenSpaceAndAdaptStoryboard(numChunkColumns-1)                       // If the specified number of columns doesn't fit in the screen, fallback to one less column and try again, until a number that fits is found.
                }
            }
        }
    }

    if (storyboardContainer.style.overflowY != "inherit")                       // Only auto-adapt the storyboard after it finished loading all chunks.
    {
        const lastChunk = storyboardContainer.lastChild
        const lastImg = lastChunk.lastChild

        lastChunk.firstChild.style.height = lastImg.height <= firstImg.height ? lastImg.height-1 + "px" : "100%"


        storyboardContainer.style.overflowY = storyboardContainer.scrollHeight < screen.height ? "hidden" : "scroll"
    }

    if (firstImg.naturalWidth - firstImg.width < 50)
        storyboardContainer.classList.add("naturalWidth")
    else
        storyboardContainer.classList.remove("naturalWidth")
}

function loadTranscript(url)
{
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onload = function()
    {
        const transcriptTextContainer = document.getElementById("transcriptTextContainer")

        transcriptTextContainer.innerHTML = xhr.responseText.replaceAll("&amp;#39;", "'").replaceAll("&amp;quot;", '"').replaceAll("&amp;", '&')

        transcriptTextContainer.firstElementChild.style = "width: max-content; max-width: 96vw; display: block; left: 0; right: 0; position: relative; margin: auto;"

        const lines = transcriptTextContainer.firstElementChild.children

        for (let i=0; i < lines.length; i++)
        {
            const seconds = lines[i].attributes.start.value.split(".")[0]

            const date = new Date(null)
            date.setSeconds(seconds)
            const time = seconds >= 3600 ? date.toISOString().substr(11, 8) : date.toISOString().substr(14, 5)

            const timestamp = document.createElement("a")
            timestamp.href = selectedVideoURL + "&t=" + seconds
            timestamp.style = "background-color: #aaa5; color: var(--paper-listbox-color); padding: 2px 5px 1px 5px; margin-right: 10px; text-decoration: none;"
            timestamp.innerText = time

            lines[i].insertBefore(timestamp, lines[i].firstChild)
        }
    }
    xhr.send()
}

function loadCommentsOrReplies(container, pageName, apiKey, token, isReplies = false)
{
    const xhrComments = new XMLHttpRequest()
    xhrComments.open('POST', "https://www.youtube.com/youtubei/v1/"+ pageName +"?prettyPrint=false")//&key="+ apiKey)
    xhrComments.onload = function()
    {
        let response = xhrComments.responseText

        if (isReplies)
        {
            const userNameArrays = [...xhrComments.responseText.matchAll(/{"authorText":{"simpleText":"(.+?)"/g)]                       // Get the username of all the replies authors.
            const userNames = [...new Set(userNameArrays.map(u => u[1]))]                                                               // Get the matched usernames and remove duplicates.

            for (let i=0; i < userNames.length; i++)
                response = response.replaceAll("@"+userNames[i], "<span style='color: #999; user-select: none;'>@"+userNames[i]+"</span>")                 // Highlight all mentions to the listed usernames, to make it easier to find the reply message beginning.
        }

        const responseObj = JSON.parse(response)
        let comments = responseObj.frameworkUpdates?.entityBatchUpdate.mutations || responseObj.onResponseReceivedEndpoints[isReplies ? 0 : 1]

        if (!comments)
            return alert("Comments are turned off in this video.")

        if (!responseObj.frameworkUpdates)
            comments = comments[isReplies ? "appendContinuationItemsAction" : "reloadContinuationItemsCommand"].continuationItems

        if (!comments)
        {
            if (!isReplies)
                alert("This video doesn't have any comments yet.")

            return
        }


        if (!isReplies)
            document.getElementById("commentsContainer").style.visibility = "visible"

        for (let i=0; i < comments.length; i++)
        {
            const commentData = comments[i]?.payload.commentEntityPayload?.properties.content.content || comments[i].commentThreadRenderer

            if (!commentData)
            {
                continue
                /*if (isReplies)
                {
                    if (comments[i].continuationItemRenderer)
                    {
                        continuationToken = comments[i].continuationItemRenderer.button.buttonRenderer.command.continuationCommand.token

                        loadCommentsOrReplies(container, pageName, apiKey, continuationToken, true)

                        break
                    }
                }
                else
                {
                    continuationToken = comments[i].continuationItemRenderer.continuationEndpoint.continuationCommand.token
                    break
                }*/
            }

            const comment = isReplies ? comments[i].commentRenderer : commentData.comment?.commentRenderer || commentData

            let commentText = ""

            if (responseObj.frameworkUpdates)
            {
                const commentContents = comment.contentText?.runs

                if (commentContents)
                    for (let j=0; j < commentContents.length; j++)                          // Every line, link, text formatations, and even emojis, of each comment,
                        commentText += commentContents[j].text                              // are all in separated strings. This appends them all in one string.
            }

            const commentTextContainer = container.createElment("div",
            {
                innerHTML: commentText || comment,
                style: isReplies ? "border-top: 1px solid lightgray; margin-top: 10px; padding-top: 10px; margin-left: 60px;"
                                 : "border-bottom: 1px solid lightgray; margin-bottom: 10px; padding-bottom: 10px;"
            })

            if (comment.authorIsChannelOwner)                                   // Highlight the channel owner's comments.
            {
                const authorName = commentTextContainer.createElment("div",
                {
                    innerText: comment.authorText.simpleText,
                    style: "background-color: gray; color: white; font-weight: 500; font-size: 13px; user-select: none; width: max-content; padding: 2px 6px; border-radius: 10px; margin-bottom: 5px;"
                }, true)
            }
            /*else if (isReplies && xhrComments.responseText.includes("@"+comment.authorText.simpleText))                      // Display the reply author username when it's mentioned by someone
            {                                                                                                                // else, to make it easier to identify who the reply is directed to.
                const authorName = commentTextContainer.createElment("div",
                {
                    innerText: comment.authorText.simpleText,
                    style: "font-weight: 500; font-size: 13px; user-select: none; margin-bottom: 5px;"
                }, true)
            }


            if (comment.replyCount)
            {
                const replyToken = commentData.replies.commentRepliesRenderer.contents[0].continuationItemRenderer.continuationEndpoint.continuationCommand.token

                const showRepliesButton = commentTextContainer.createElment("span",
                {
                    style: "display: block; margin-top: 10px; color: #065fd4; font-weight: 500; cursor: pointer; font-size: 14px; user-select: none;",
                    innerText: "▾ Show "+ (comment.replyCount > 1 ? "replies" : "reply"),
                    onclick: function()
                    {
                        if (this.innerText.includes("Show"))
                        {
                            this.innerText = "▴ Hide replies"

                            loadCommentsOrReplies(repliesContainer, pageName, apiKey, replyToken, true)
                        }
                        else
                        {
                            this.innerText = "▾ Show "+ (comment.replyCount > 1 ? "replies" : "reply")

                            repliesContainer.innerHTML = ""
                        }
                    }
                })

                const repliesContainer = commentTextContainer.createElment("div")
            }*/
        }
    }
    xhrComments.send('{ "context": { "client": { "clientName": "WEB", "clientVersion": "2.2022021" } }, "continuation": "'+ token +'" }')                // This is the bare minimum to be able to get the comments list.
}

function extendFunctions()
{
    Node.prototype.createElment = function(name, attributesObj, insertBeforeFirst) { return createElement(name, attributesObj, this, insertBeforeFirst) }
}

function createElement(name, attributesObj, container, insertBeforeFirst)
{
    const element = document.createElement(name)

    let atributesNames = []

    if (attributesObj)
        atributesNames = Object.getOwnPropertyNames(attributesObj)

    for (let i=0; i < atributesNames.length; i++)
        element[atributesNames[i]] = attributesObj[atributesNames[i]]

    if (container)
    {
        if (insertBeforeFirst)
            container.insertBefore(element, container.firstChild)
        else
            container.appendChild(element)
    }

    return element
}

function cleanVideoUrl(fullUrl)
{
    const urlSplit = fullUrl.split("?")                 // Separate the page path from the parameters.

    if (!urlSplit[1])  return fullUrl

    const paramsSplit = urlSplit[1].split("&")          // Separate each parameter.

    for (let i=0; i < paramsSplit.length; i++)
    {
        if (paramsSplit[i].includes("v="))              // Get the video's id.
            return urlSplit[0]+"?"+paramsSplit[i]       // Return the cleaned video URL.
    }
}

