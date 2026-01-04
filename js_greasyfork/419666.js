// ==UserScript==
// @name            YouTube Repeated Recommendations Hider
// @description     Hide any videos that are recommended more than twice. You can also hide by channel or by partial title. Works on both YouTube's desktop and mobile layouts.
// @version         2.4.6
// @author          BLBC (github.com/hjk789, greasyfork.org/users/679182-hjk789)
// @copyright       2020+, BLBC (github.com/hjk789, greasyfork.org/users/679182-hjk789)
// @homepage        https://github.com/hjk789/Userscripts/tree/master/YouTube-Repeated-Recommendations-Hider
// @license         https://github.com/hjk789/Userscripts/tree/master/YouTube-Repeated-Recommendations-Hider#license
// @match           https://m.youtube.com/*
// @match           https://www.youtube.com/*
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.listValues
// @grant           GM.deleteValue
// @namespace https://greasyfork.org/users/679182
// @downloadURL https://update.greasyfork.org/scripts/419666/YouTube%20Repeated%20Recommendations%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/419666/YouTube%20Repeated%20Recommendations%20Hider.meta.js
// ==/UserScript==


//************ SETTINGS *************

const maxRepetitions = 2              // The maximum number of times that the same recommended video is allowed to appear
                                      // before starting to get hidden. Set this to 1 if you want one-time recommendations.

const filterRelated = true            // Whether the repeated related videos (the ones below/beside the video you are watching) should also be filtered. Set this to false if you want to keep them untouched.

const countRelated = true             // When false, new related videos are ignored in the countings and are allowed to appear any number of times, as long as they don't
                                      // appear in the homepage recommendations. If set to true, the related videos are counted even if they never appeared in the homepage.

const countSubscriptionsPage = true   // Whether the videos in the Subscriptions page should also be counted. When false, these videos are only counted when they appear in the homepage or
                                      // related videos. Note that the repetition filtering doesn't happen in the subscriptions page, only the countings. But it does filter by partial title.

const countPremiere = false           // Whether to include in the filtering repeated videos yet to be premiered. If set to false, these recommendations won't get "remembered"
                                      // until the video is finally released, then it will start counting as any other video. Set this to true if you want to hide them anyway.

const countLives = true               // Same as above but for ongoing (active) live streams. If set to false, the recommended live stream will start to be counted only after the stream ends and becomes a whole video.

const dimFilteredHomepage = false     // Whether the repeated recommendations in the homepage should get dimmed (partially faded) instead of completely hidden.
const dimFilteredRelated = false      // Same thing, but for the related videos.

const dimWatchedVideos = true         // Whether the title of videos already watched should be dimmed, to differentiate from the ones you didn't watched yet. The browser itself is responsible for checking whether the
                                      // link was already visited or not, so if you delete a video from the browser history it will be treated as "not watched", the same if you watch them in a private window (incognito).

const alwaysHideMixes = true          // Whether mixes should always be hidden independently of how many times they appeared. If true, mixes will never be visible again. If set to false, they will be treated just like other videos.
const alwaysHidePlaylists = true      // Same as above but for recommended playlists. Note that playlists here refers to a list of videos, not single compilation videos.
const alwaysHideOngoingLives = false  // Same as above but for recommended ongoing live streams.
const alwaysHideMovies = true         // Same as above but for recommended paid movies from YouTube Movies.

//**********************************



let channelsToHide, partialTitlesToHide, processedVideosList, videosNotToHideNow = []
let hideChannelButton, hidePartialTitleButton, selectedChannel
let currentPage = "", url
let isHomepage, isSubscriptionsPage
const isMobile = !/www/.test(location.hostname)
let isMenuReady = false, isTabActive = false, firstTriggerVideos = []

                                                                    // Because YouTube is a single-page web app, everything happens in the same page, only changing the URL.
const waitForURLchange = setInterval(async function()               // So the script needs to check when the URL changes so it can be reassigned to the page and be able to work.
{
    url = location.href.split("#")[0]               // In the mobile layout, when a menu is open, a hash is added to the URL. This hash need to be ignored to prevent incorrect detections.

    if (url != currentPage)
    {
        const isSamePathname = currentPage.includes(location.pathname)

        currentPage = url

        isHomepage = location.pathname == "/"
        isSubscriptionsPage = location.pathname == "/feed/subscriptions"

        if (!isHomepage && !isSubscriptionsPage && location.pathname != "/watch")              // Only run on the homepage, subscriptions page and video page.
            return

        if (isSubscriptionsPage && !countSubscriptionsPage)
            return

        videosNotToHideNow = []

        if (!isMenuReady)
            await getGMsettings()

        main(isSamePathname)                // When you are on a video page and left-click another video, YouTube instead of replacing the recommendation's elements,
    }                                       // it reuses them, only changing their contents. So these already processed elements need to be processed again.

}, 500)

                                                                        // An intersection observer is being used so that the recommendations are counted only
const onViewObserver = new IntersectionObserver((entries) =>            // when the user actually sees them on the screen, instead of when they are loaded.
{
    entries.forEach(async entry =>
    {
        if (entry.isIntersecting)
        {
            if (isHomepage || isSubscriptionsPage || isMobile || isTabActive)
                await processRecommendation(entry.target, false, "onViewObserver")
            else
                firstTriggerVideos.push(entry.target)               // The intersection observer fires even when the tab is in the background. This stores in an array
        }                                                           // all these detected recommendations and wait for the user to switch to this tab to process them.
    })

}, {threshold: (isMobile ? 1.0 : 0.75)})                                            // Only trigger the observer when the recommendation is completely visible on mobile, and 75% visible on desktop.



if (dimWatchedVideos)
{
    // Add the style for dimming watched videos
    const style = document.createElement("style")
    style.innerHTML = ":visited, :visited h3, :visited #video-title { color: #aaa !important; }"
    document.head.appendChild(style)
}

/* Create the desktop version's hover styles for the recommendation menu items */
{
    const style = document.createElement("style")
    style.innerHTML = "#hideChannelButton:hover, #hidePartialTitleButton:hover { background-color: var(--yt-spec-10-percent-layer) !important; }"
    document.head.appendChild(style)
}




async function getGMsettings()
{
    let value = await GM.getValue("channels")

    if (!value)
    {
        value = "[]"
        GM.setValue("channels", value)
        GM.setValue("partialTitles", value)
    }

    channelsToHide = JSON.parse(value)

    value = await GM.getValue("partialTitles")

    partialTitlesToHide = JSON.parse(value)

    processedVideosList = await GM.listValues()             // Get in an array all the items currently in the script's storage. Searching for a value in
                                                            // an array is much faster and lighter than calling GM.getValue for every recommendation.
}


function main(isReprocess = false)
{
    if (isHomepage)
    {
        const waitForRecommendationsContainer = setInterval(async function()
        {
            let recommendationsContainer

            if (isMobile)
            {
                recommendationsContainer = document.querySelector(".rich-grid-renderer-contents")

                try { recommendationsContainer.children[0].querySelector("h3, h4").nextSibling.firstChild.firstChild.textContent }              // In some very specific cases an error may occur while getting the video channel because it's not available yet. This try-catch
                catch(e) { return }                                                                                                             // is a straight-forward way of making sure that all elements of the path are available, instead of checking each one.
            }
            else
            {
                recommendationsContainer = document.querySelector("#contents ytd-rich-grid-row")

                if (recommendationsContainer)
                    recommendationsContainer = recommendationsContainer.parentElement
            }

            if (!recommendationsContainer)
                return

            clearInterval(waitForRecommendationsContainer)



            if (!isMobile)
                await addRecommendationMenuItems()

            const videosSelector = isMobile ? "ytm-rich-item-renderer" : "ytd-rich-item-renderer"




            const swappedRecommendationsObserver = new MutationObserver(async function(mutations)            // When the desktop homepage is loaded and the user scrolls down a little, it may happen that YouTube reorganizes the recommendations. When this happens, the
            {                                                                                                // reference of the elements are mostly the same, but the actual content is swapped with another one, and thus requiring to reprocess these recommendations.
                for (let i=0; i < mutations.length; i++)
                {
                    if (mutations[i].removedNodes || mutations[i].addedNodes)               // YouTube never remove recommendations, and when that happens, is because it's reorganizing them.
                    {
                        const recommendations = mutations[i].target.children

                        for (let j=0; j < recommendations.length; j++)
                            await processRecommendation(recommendations[j], true, "swappedRecommendationsObserver")
                    }
                }
            })


            if (!isMobile)                                                                             // Also, in the desktop layout, the first few recommendations require some layout tweaks to display them correctly.
            {
                recommendationsContainer.style.marginLeft = "100px"

                const firstRows = recommendationsContainer.children

                for (let i=0; i < firstRows.length; i++)
                {
                    const row = firstRows[i]

                    swappedRecommendationsObserver.observe(row.firstElementChild, {childList: true})

                    row.style.justifyContent = "left"                       // These two lines remove an extra space on the left side, to make them align correctly with the other ones.
                    row.firstElementChild.style.margin = "0px"

                    const rowVideos = row.querySelectorAll(videosSelector)

                    for (let j=0; j < rowVideos.length; j++)
                        rowVideos[j].style.width = "360px"                // Force the recommendations to be displayed with this size, otherwise they get "crushed".
                }
            }


            const loadedRecommendedVideosObserver = new MutationObserver(async function(mutations)
            {
                for (let i=0; i < mutations.length; i++)
                {
                    for (let j=0; j < mutations[i].addedNodes.length; j++)
                    {                                                                                       // Different from the mobile layout in which the recommendations are displayed as a list, in the desktop
                        const row = mutations[i].addedNodes[j]                                              // layout the recommendations are displayed in containers that each serve as a row with 4-5 videos.

                        if (!isMobile)
                        {
                            if (row.querySelector("ytd-notification-text-renderer, ytd-compact-promoted-item-renderer"))       // Ignore notices and such, otherwise the layout gets messed up.
                                continue

                            row.style.width = "max-content"                                                     // Make the row take only the space needed to hold the recommendations within. If the next row fits in the freed space, it will move to beside it.
                            row.firstElementChild.style = "margin-right: 0px; margin-left: 0px;"                // Remove the gap between different row containers in the same line.

                            swappedRecommendationsObserver.observe(row.querySelector("#contents"), {childList: true})
                        }

                        if (!isMobile || row.tagName == "YTM-RICH-SECTION-RENDERER")
                        {
                            loadedRecommendedVideosObserver.observe((isMobile ? row.firstChild : row.querySelector("#contents")), {childList: true})

                            const recommendations = row.querySelectorAll(videosSelector)

                            for (let k=0; k < recommendations.length; k++)
                            {
                                if (!isMobile)
                                    recommendations[k].style.width = "360px"

                                await processRecommendation(recommendations[k], false, "loadedRecommendedVideosObserver")
                            }
                        }
                        else await processRecommendation(row, false, "loadedRecommendedVideosObserver")

                    }
                }
            })

            loadedRecommendedVideosObserver.observe(recommendationsContainer, {childList: true})


            const firstVideos = recommendationsContainer.querySelectorAll(videosSelector)              // Because a mutation observer is being used and the script is run after the page is fully
                                                                                                       // loaded, the observer isn't triggered with the recommendations that appear first.
            for (let i=0; i < firstVideos.length; i++)                                                 // This does the processing manually to these first ones.
                await processRecommendation(firstVideos[i], false, "firstVideos")


        }, 500)
    }
    else
    {
        const waitForRelatedVideosContainer = setInterval(async function()
        {
            const videosSelector = isMobile ? "ytm-video-with-context-renderer, ytm-compact-show-renderer, ytm-radio-renderer, ytm-compact-playlist-renderer"
                                            : "ytd-compact-video-renderer, ytd-compact-movie-renderer, ytd-compact-radio-renderer, ytd-compact-playlist-renderer, ytd-grid-video-renderer"

            const pageContainer = isMobile ? document.body : document.querySelector(isSubscriptionsPage ? "ytd-browse" : "ytd-watch-flexy")

            if (!pageContainer)
                return

            let relatedVideosContainer = pageContainer.querySelector(videosSelector)

            if (!relatedVideosContainer)
                return

            if (isSubscriptionsPage)
                relatedVideosContainer = document.querySelector("ytd-browse #contents")
            else
                relatedVideosContainer = relatedVideosContainer.parentElement

            clearInterval(waitForRelatedVideosContainer)



            if (!isMobile && !isSubscriptionsPage)
                await addRecommendationMenuItems()


            const loadedRelatedVideosObserver = new MutationObserver(async function(mutations)
            {
                for (let i=0; i < mutations.length; i++)
                {
                    for (let j=0; j < mutations[i].addedNodes.length; j++)
                        await processRecommendation(mutations[i].addedNodes[j], isReprocess, "loadedRelatedVideosObserver")
                }
            })

            loadedRelatedVideosObserver.observe(relatedVideosContainer, {childList: true})


            const firstRelatedVideos = relatedVideosContainer.querySelectorAll(videosSelector)

            for (let i=0; i < firstRelatedVideos.length; i++)
                await processRecommendation(firstRelatedVideos[i], isReprocess, "firstRelatedVideos")


            if (!isMobile)
            {
                document.body.onfocus = async function()
                {
                    await getGMsettings()                       // Update the stored values whenever the video tab is active. Otherwise, the stored values get out of sync
                                                                // with the other videos that the user opened, and the recommendations end up being counted incorrectly.
                    if (!isTabActive)
                    {
                        while (firstTriggerVideos.length > 0)
                        {
                            await processRecommendation(firstTriggerVideos[0], false, "onFocusFirstTrigger")

                            firstTriggerVideos.shift()              // Remove the first item of the array.
                        }
                    }

                    isTabActive = true

                                                                                    // When the user opens several videos in a new tab and then switches to them one after the other, reprocess the list of related videos as soon
                    if (location.pathname == "/watch")                              // as the user switches to the tab, to make sure that the processed videos in the previous tabs don't continue appearing in the next tabs.
                    {
                        const relatedVideos = document.querySelector("ytd-compact-video-renderer").parentElement.children

                        for (let i=0; i < relatedVideos.length; i++)
                            processRecommendation(relatedVideos[i], true, "onFocusReprocess")
                    }
                }
            }

        }, 500)
    }

    /* Create the "Hide videos from this channel" and "Hide videos that include a text" buttons */
    {
        hideChannelButton = document.createElement(isMobile ? "button" : "div")
        hideChannelButton.id = "hideChannelButton"
        hideChannelButton.className = "menu-item-button"
        hideChannelButton.style = !isMobile ? "background-color: var(--yt-spec-brand-background-solid);	font-size: 14px; padding: 9px 0px 9px 56px;	cursor: pointer; min-width: max-content;" : ""
        hideChannelButton.innerHTML = "Hide videos from this channel"
        hideChannelButton.onclick = function()
        {
            if (confirm("Are you sure you want to hide all videos from the channel ''" + selectedChannel + "''?"))
            {
                channelsToHide.push(selectedChannel)
                GM.setValue("channels", JSON.stringify(channelsToHide))
            }

            document.body.click()     // Dismiss the menu.
        }

        hidePartialTitleButton = document.createElement(isMobile ? "button" : "div")
        hidePartialTitleButton.id = "hidePartialTitleButton"
        hidePartialTitleButton.className = hideChannelButton.className
        hidePartialTitleButton.style = hideChannelButton.style.cssText
        hidePartialTitleButton.innerHTML = "Hide videos that include a text"
        hidePartialTitleButton.onclick = function()
        {
            const partialText = prompt("Specify the partial title of the videos to hide. All videos that contain this text in the title will get hidden.")

            if (partialText)
            {
                partialTitlesToHide.push(partialText.toLowerCase().trim())
                GM.setValue("partialTitles", JSON.stringify(partialTitlesToHide))
            }

            document.body.click()
        }

        hideChannelButton.style.borderTop = "solid 1px var(--yt-spec-10-percent-layer, #ddd)"
    }
}


async function processRecommendation(node, reprocess = false, source = "")
{
    if (!node || node.className.includes("processed") && !reprocess)
        return

    const videoTitleEll = node.querySelector(isMobile ? "h3, h4" : "#video-title, #movie-title")

    if (!videoTitleEll)
        return


    const videoTitleText = videoTitleEll.textContent.toLowerCase()                      // Convert the title's text to lowercase so that there's no distinction with uppercase letters.
    const videoMenuBtn = node.querySelector(isMobile ? "ytm-menu" : "ytd-menu-renderer")
    const timeLabelEll = node.querySelector("yt" + (isMobile ? "m" : "d") + "-thumbnail-overlay-time-status-renderer")

    let videoType = ""

    if (timeLabelEll)
        videoType = timeLabelEll.attributes[(isMobile ? "data" : "overlay") + "-style"].value               // Get the type of the video, which can be a normal video, a live stream or a premiere.
    else if (node.querySelector(".badge-style-type-live-now, .badge-style-type-live-now-alternate"))                                      // In the homepage of the desktop layout, the live indicator is in a different element.
        videoType = "LIVE"


    if (reprocess)
        node.style.display = "flex"

    if (!isSubscriptionsPage)
    {
        if (alwaysHideMixes && (node.querySelector("a").href.includes("radio") || node.tagName == (isMobile ? "YTM-RADIO-RENDERER" : "YTD-COMPACT-RADIO-RENDERER") || node.querySelector("ytd-thumbnail-overlay-bottom-panel-renderer"))
            || alwaysHideOngoingLives && videoType == "LIVE"
            || alwaysHidePlaylists && node.tagName == "YT" + (isMobile ? "M" : "D") + "-COMPACT-PLAYLIST-RENDERER"
            || alwaysHideMovies && node.tagName == "YTD-COMPACT-MOVIE-RENDERER")
        {
            node.style.display = "none"
            node.classList.add("processed")

            return
        }
    }


    let videoChannel, videoUrl

    if (isMobile)
        videoChannel = videoTitleEll.nextSibling.firstChild.firstChild.textContent
    else
        videoChannel = node.querySelector(".ytd-channel-name#text").textContent

    if (isMobile || isHomepage)
        videoUrl = cleanVideoUrl(videoTitleEll.parentElement.href || videoTitleEll.parentElement.parentElement.href)                      // The mix playlists and the promoted videos include ID parameters, along with the video id,
    else                                                                                                                                  // which changes everytime it's recommended. These IDs need to be ignored to filter it correctly.
        videoUrl = cleanVideoUrl(node.querySelector(".details a, #details a").href)


    // Because the recommendation's side-menu is separated from the recommendations container, this listens to clicks on each three-dot
    // button and store in a variable in what recommendation it was clicked, to then be used by the "Hide videos from this channel" button.

    if (videoMenuBtn && !isSubscriptionsPage)
    {
        videoMenuBtn.onclick = function()
        {
            selectedChannel = videoChannel

            addRecommendationMenuItems()
        }
    }

    if (channelsToHide.includes(videoChannel) || partialTitlesToHide.some(p => (new RegExp(p, "i")).test(videoTitleText)))
    {
        node.style.display = "none"

        node.classList.add("processed")
    }
    else if (processedVideosList.includes("hide::"+videoUrl))
    {
        if (!isHomepage && !filterRelated)
            return

        if (!isSubscriptionsPage && !videosNotToHideNow.includes(videoUrl))             // Prevent from hiding recommendations that reached the limit in the respective page. Otherwise, when the reprocess happen,
            hideOrDimm(node)                                                            // these recommendations would get hidden even if the user didn't see them yet, specially after opening several tabs of videos.

        node.classList.add("processed")
    }
    else
    {
        if (!node.classList.contains("offView") && !node.className.includes("processed"))
        {
            node.classList.add("offView")               // Add this class to mark the recommendations waiting to be counted.

            onViewObserver.observe(node)                // Wait for the recommendation to appear on screen.

            return                                      // And don't do anything else until that happens.
        }
        else
        {
            if (isHomepage || isMobile || source == "onViewObserver" || source == "onFocusFirstTrigger")
            {
                node.classList.remove("offView")

                onViewObserver.unobserve(node)              // When the recommendation finally appears on the screen and is processed, stop observing it so it doesn't trigger the observer again.
            }
            else return                         // If false, return to prevent incorrect countings.
        }


        if (maxRepetitions == 1)                // If the script is set to show only one-time recommendations, to avoid unnecessary processings,
        {                                       // rightaway mark to hide, in the next time the page is loaded, every video not found in the storage.
            if (!isHomepage && !countRelated)
                return

            if (videoType == "DEFAULT" || videoType == "UPCOMING" && countPremiere || videoType == "LIVE" && countLives || !videoType)
            {
                GM.setValue("hide::"+videoUrl,"")

                videosNotToHideNow.push(videoUrl)

                if (!reprocess)
                    processedVideosList.push("hide::"+videoUrl)

                node.classList.add("processed")
            }

            return
        }
        else
            var value = await GM.getValue(videoUrl)

        if (!value)
            value = 1
        else
            value++

        if (videoType == "DEFAULT" || videoType == "UPCOMING" && countPremiere || videoType == "LIVE" && countLives || !videoType)
        {
            if (!reprocess)
            {
                if (value >= maxRepetitions)
                {
                    if (!isHomepage && !countRelated)
                        return

                    videosNotToHideNow.push(videoUrl)

                    GM.deleteValue(videoUrl)
                    GM.setValue("hide::"+videoUrl,"")

                    processedVideosList.push("hide::"+videoUrl)

                    node.classList.add("processed")

                    return
                }

                if (!isHomepage && !countRelated)
                    return

                GM.setValue(videoUrl, value)

                node.classList.add("processed")
            }
        }
    }
}


function addRecommendationMenuItems()
{
    return new Promise(resolve =>
    {
        const waitForRecommendationMenu = setInterval(function()
        {
            const recommendationMenu = isMobile ? document.getElementById("menu") : document.querySelector("#details #menu yt-icon, .details #menu yt-icon")

            if (!recommendationMenu)
                return

            clearInterval(waitForRecommendationMenu)

            if (document.getElementById("hideChannelButton") || document.getElementById("hidePartialTitleButton"))
            {
                resolve()
                return
            }


            if (isMobile)
            {
                recommendationMenu.firstChild.appendChild(hideChannelButton)
                recommendationMenu.firstChild.appendChild(hidePartialTitleButton)
            }
            else
            {
                if (!document.querySelector("ytd-menu-popup-renderer"))
                {
                    recommendationMenu.click()
                    recommendationMenu.click()              // The recommendation menu doesn't exist in the HTML before it's clicked for the first time. This forces it to be created and dismisses it immediately.
                }

                const optionsParent = document.querySelector("ytd-menu-popup-renderer")
                optionsParent.style = "max-height: max-content !important; max-width: max-content !important; height: max-content !important; width: 260px !important;"                // Change the max width and height so that the new item fits in the menu.
                optionsParent.firstElementChild.style = "width: inherit;"

                const waitForRecommendationMenuItem = setInterval(function()
                {
                    const recommendationMenuItem = optionsParent.querySelector("ytd-menu-service-item-renderer")

                    if (!recommendationMenuItem)
                        return

                    clearInterval(waitForRecommendationMenuItem)


                    if (!isSubscriptionsPage)
                        recommendationMenuItem.parentElement.appendChild(hideChannelButton)

                    recommendationMenuItem.parentElement.appendChild(hidePartialTitleButton)

                    if (!isMenuReady)
                    {
                        recommendationMenu.click()
                        recommendationMenu.click()

                        isMenuReady = true
                    }

                    resolve()

                }, 100)
            }

        }, 100)
    })
}


function cleanVideoUrl(fullUrl)
{
    const urlSplit = fullUrl.split("?")                 // Separate the page path from the parameters.
    
    if (fullUrl.includes("/shorts/"))
        return urlSplit[0]
    
    const paramsSplit = urlSplit[1].split("&")          // Separate each parameter.
    
    for (let i=0; i < paramsSplit.length; i++)
    {
        if (paramsSplit[i].includes("v="))              // Get the video's id.
            return urlSplit[0]+"?"+paramsSplit[i]       // Return the cleaned video URL.
    }
}


function hideOrDimm(node)
{
    if (isHomepage && dimFilteredHomepage || !isHomepage && dimFilteredRelated)
        node.style.opacity = 0.4
    else
        node.style.display = "none"
}
