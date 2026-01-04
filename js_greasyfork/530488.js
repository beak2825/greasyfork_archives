// ==UserScript==
// @name         InstaDecrapper
// @version      1.3.2
// @description  Replaces Instagram pages with their decrapped versions (only media & titles)
// @author       GreasyPangolin
// @license      MIT
// @match        https://www.instagram.com/*
// @match        https://instagram.com/*
// @match        http://localhost:8000/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1448662
// @downloadURL https://update.greasyfork.org/scripts/530488/InstaDecrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/530488/InstaDecrapper.meta.js
// ==/UserScript==

function isDebug() {
    return window.location.href.includes('localhost')
}

async function fixture(variables) {
    let url
    if (variables?.shortcode) {
        url = `http://localhost:8000/post_${variables.shortcode}.json`
    } else if (variables?.id) {
        url = `http://localhost:8000/next_page.json`
    } else {
        url = `http://localhost:8000/profile.json`
    }

    const resp = await fetch(url)
    if (!resp.ok) {
        throw new Error(`Fixture fetch failed with status ${resp.status}: ${await resp.text()}`)
    }

    return await resp.json()
}

function filterNonNull(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != null)
    );
}

function extractDataAndRemoveScripts(runId) {
    // Extract CSRF token and App ID from scripts
    let csrfToken = ''
    let appId = ''
    let profileId = null

    var scripts = document.querySelectorAll('script')

    for (var i = 0; i < scripts.length; i++) {
        // scan for the script that contains the CSRF token and App ID
        const csrfMatch = scripts[i].textContent.match(/"csrf_token":"([^"]+)"/)
        const appIdMatch = scripts[i].textContent.match(/"app_id":"([^"]+)"/)
        const profileIdMatch = scripts[i].textContent.match(/"profile_id":"([^"]+)"/)

        if (csrfMatch && csrfMatch[1]) {
            csrfToken = csrfMatch[1]
            console.log(`[Run ${runId}] Found CSRF token: ${csrfToken} `)
        }

        if (appIdMatch && appIdMatch[1]) {
            appId = appIdMatch[1]
            console.log(`[Run ${runId}] Found App ID: ${appId} `)
        }

        if (profileIdMatch && profileIdMatch[1]) {
            profileId = profileIdMatch[1]
            console.log(`[Run ${runId}] Found profile ID: ${profileId} `)
        }

        // we don't need this script anymore
        scripts[i].remove()

        if (csrfToken && appId && profileId) {
            return {
                secrets: { csrfToken, appId },
                profileId,
            }
        }
    }

    // secrets found but profile ID is missing (possibly a post page)
    if (csrfToken && appId) {
        return {
            secrets: { csrfToken, appId },
            profileId: null,
        }
    }

    console.log(`[Run ${runId}] Could not find CSRF token and App ID`)

    return {
        secrets: null,
        profileId: null,
    }
}

function renderProfileHeader(user) {
    const header = document.createElement('div')
    header.style.cssText = 'display: flex; align-items: center; padding: 20px;'

    const info = document.createElement('div')
    info.style.display = 'flex'
    info.style.alignItems = 'start'

    const profilePic = document.createElement('img')
    profilePic.src = user.profilePicUrl
    profilePic.width = 64
    profilePic.height = 64
    profilePic.style.borderRadius = '50%'
    profilePic.style.marginRight = '20px'

    info.appendChild(profilePic)

    const textInfo = document.createElement('div')

    const nameContainer = document.createElement('div')
    nameContainer.style.display = 'flex'
    nameContainer.style.alignItems = 'center'
    nameContainer.style.gap = '5px'

    const name = document.createElement('h1')
    name.textContent = user.fullName
    name.style.margin = '0 0 10px 0'
    name.style.fontFamily = 'sans-serif'
    name.style.fontSize = '18px'

    nameContainer.appendChild(name)

    if (user.isVerified) {
        const checkmark = document.createElement('span')
        checkmark.textContent = '✓'
        checkmark.style.margin = '0 0 10px'
        checkmark.style.color = '#00acff'
        checkmark.style.fontSize = '18px'
        checkmark.style.fontWeight = 'bold'
        nameContainer.appendChild(checkmark)
    }

    textInfo.appendChild(nameContainer)

    if (user.username) {
        const username = document.createElement('a')

        username.href = '/' + user.username
        username.textContent = '@' + user.username
        username.style.margin = '0 0 10px 0'
        username.style.fontFamily = 'sans-serif'
        username.style.fontSize = '14px'
        username.style.textDecoration = 'none'
        username.style.color = '#00376b'
        username.target = '_blank'

        textInfo.appendChild(username)
    }

    if (user.biography) {
        const bio = document.createElement('p')

        bio.textContent = user.biography
        bio.style.margin = '0 0 10px 0'
        bio.style.whiteSpace = 'pre-line'
        bio.style.fontFamily = 'sans-serif'
        bio.style.fontSize = '14px'

        textInfo.appendChild(bio)
    }

    if (user.bioLinks && user.bioLinks.length > 0) {
        const links = document.createElement('div')

        user.bioLinks.forEach(link => {
            const a = document.createElement('a')
            a.href = link.url
            a.textContent = link.title
            a.target = '_blank'
            a.style.display = 'block'
            a.style.fontFamily = 'sans-serif'
            a.style.fontSize = '14px'
            links.appendChild(a)
        })

        textInfo.appendChild(links)
    }

    info.appendChild(textInfo)

    header.appendChild(info)

    document.body.appendChild(header)
}

function parseMediaNode(media) {
    if (!media) return []; // Handle cases where media node might be null or undefined

    const date = new Date(media.taken_at_timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ')
    const title = media.edge_media_to_caption?.edges[0]?.node.text || "No title"
    const shortcode = media.shortcode

    // Handle sidecar (carousel) posts
    if ((media.__typename === 'GraphSidecar' || media.__typename === 'XDTGraphSidecar') && media.edge_sidecar_to_children?.edges) {
        return media.edge_sidecar_to_children.edges.map(childEdge => {
            const child = childEdge.node
            if (!child) return null; // Skip if child node is invalid
            const isChildVideo = child.__typename === 'GraphVideo' || child.__typename === 'XDTGraphVideo'
            return {
                date: date, // Use parent's date
                title: title, // Use parent's title
                isVideo: isChildVideo,
                videoUrl: isChildVideo ? child.video_url : null,
                imageUrl: child.display_url,
                shortcode: shortcode // Use parent's shortcode
            }
        }).filter(item => item !== null); // Filter out any null items from invalid child nodes
    }
    // Handle single image or video posts
    else {
        const isVideo = media.is_video || media.__typename === 'GraphVideo' || media.__typename === 'XDTGraphVideo'
        return [{
            date: date,
            title: title,
            isVideo: isVideo,
            videoUrl: isVideo ? media.video_url : null,
            imageUrl: media.display_url,
            shortcode: shortcode
        }]
    }
}

function renderMedia(mediaItems) {
    const mediaContainer = document.createElement('div')
    mediaContainer.style.display = 'grid'
    mediaContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))'
    mediaContainer.style.gap = '20px'
    mediaContainer.style.padding = '20px'

    mediaItems.forEach(item => {
        const mediaDiv = document.createElement('div')
        mediaDiv.className = 'media'
        mediaDiv.style.display = 'flex'
        mediaDiv.style.flexDirection = 'column'
        mediaDiv.style.alignItems = 'center'

        if (item.isVideo) {
            const videoElement = document.createElement('video')
            videoElement.controls = true
            videoElement.width = 320

            const source = document.createElement('source')
            source.src = item.videoUrl
            source.type = 'video/mp4'

            videoElement.appendChild(source)
            mediaDiv.appendChild(videoElement)
        } else {
            const imageElement = document.createElement('img')
            imageElement.src = item.imageUrl
            imageElement.width = 320
            imageElement.style.height = 'auto'

            const linkElement = document.createElement('a')
            linkElement.href = item.imageUrl
            linkElement.target = '_blank'

            linkElement.appendChild(imageElement)
            mediaDiv.appendChild(linkElement)
        }

        const dateContainer = document.createElement('div')
        dateContainer.style.display = 'flex'
        dateContainer.style.alignItems = 'center'
        dateContainer.style.justifyContent = 'center'
        dateContainer.style.gap = '10px'
        dateContainer.style.width = '320px'

        const date = document.createElement('p')
        date.textContent = item.date
        date.style.fontFamily = 'sans-serif'
        date.style.fontSize = '12px'
        date.style.margin = '5px 0'

        dateContainer.appendChild(date)

        if (item.shortcode) {
            const postLink = document.createElement('a')
            postLink.href = `/p/${item.shortcode}`
            postLink.textContent = '[post]'
            postLink.style.fontFamily = 'sans-serif'
            postLink.style.fontSize = '12px'
            postLink.style.color = 'blue'
            postLink.style.textDecoration = 'none'
            dateContainer.appendChild(postLink)
        }

        if (item.isVideo) {
            const previewLink = document.createElement('a')
            previewLink.href = item.imageUrl
            previewLink.textContent = '[preview]'
            previewLink.style.fontFamily = 'sans-serif'
            previewLink.style.fontSize = '12px'
            previewLink.style.color = 'blue'
            previewLink.style.textDecoration = 'none'
            dateContainer.appendChild(previewLink)
        }

        mediaDiv.appendChild(dateContainer)

        const title = document.createElement('p')
        title.textContent = item.title
        title.style.fontFamily = 'sans-serif'
        title.style.fontSize = '12px'
        title.style.width = '320px'
        title.style.textAlign = 'center'

        mediaDiv.appendChild(title)
        mediaContainer.appendChild(mediaDiv)
    })

    document.body.appendChild(mediaContainer)
}

function renderLine() {
    const line = document.createElement('hr')
    line.style.margin = '20px 0'
    document.body.appendChild(line)
}


function renderLoadMoreButton(secrets, profileId, pageInfo) {
    let loadMoreButton = document.getElementById('loadMoreBtn')

    // Remove old button
    if (loadMoreButton) {
        loadMoreButton.remove()
    }

    // Add new "Load More" button
    if (pageInfo?.has_next_page && pageInfo.end_cursor) {
        // Create a horizontal line
        renderLine()

        // Create "Load More" button
        loadMoreButton = document.createElement('button')
        loadMoreButton.id = 'loadMoreBtn'
        loadMoreButton.style.cssText = 'display: block; margin: 20px auto; padding: 10px 20px; font-size: 16px; cursor: pointer;'
        document.body.appendChild(loadMoreButton)

        // Update button's state and event listener
        loadMoreButton.textContent = 'Load More'
        loadMoreButton.disabled = false

        // Clone and replace to ensure the event listener is fresh and doesn't stack
        const newButton = loadMoreButton.cloneNode(true)
        loadMoreButton.parentNode.replaceChild(newButton, loadMoreButton)

        newButton.onclick = () => {
            newButton.disabled = true; // Prevent multiple clicks while loading
            newButton.textContent = 'Loading...'
            // Call loadNextPage with the new cursor
            loadNextPage(secrets, profileId, pageInfo.end_cursor)
        }
    }
}

// Helper function for GraphQL API calls
async function fetchGraphQL({ csrfToken, appId }, { variables, doc_id }) {
    if (isDebug()) {
        return fixture(variables)
    }

    const resp = await fetch(`https://www.instagram.com/graphql/query`, {
        "method": "POST",
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": csrfToken,
            "X-IG-App-ID": appId,
            "Origin": "https://www.instagram.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
        },
        "body": new URLSearchParams({
            "av": "0",
            "hl": "en",
            "__d": "www",
            "__user": "0",
            "__a": "1",
            "__req": "a",
            "__hs": "20168.HYP:instagram_web_pkg.2.1...0",
            "dpr": "2",
            "__ccg": "EXCELLENT",
            "fb_api_caller_class": "RelayModern",
            "variables": JSON.stringify(filterNonNull(variables)),
            "server_timestamps": "true",
            "doc_id": doc_id,
        }).toString()
    })

    if (!resp.ok) {
        throw new Error(`GraphQL fetch failed with status ${resp.status}: ${await resp.text()}`)
    }

    return await resp.json()
}

// Helper function for standard Web API calls
async function fetchProfile({ csrfToken, appId }, username) {
    if (isDebug()) {
        return fixture()
    }

    const resp = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}&hl=en`, {
        method: 'GET',
        credentials: "include",
        headers: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
            "Accept": "*/*",
            "Accept-Language": "en,en-US;q=0.5",
            "X-CSRFToken": csrfToken,
            "X-IG-App-ID": appId,
            "X-IG-WWW-Claim": "0",
            "X-Requested-With": "XMLHttpRequest",
            "Alt-Used": "www.instagram.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        referrer: `https://www.instagram.com/${username}/?hl=en`,
        mode: "cors",
    })

    if (!resp.ok) {
        throw new Error(`API fetch failed with status ${resp.status}: ${await resp.text()}`)
    }

    return await resp.json()
}


async function loadSinglePost(secrets, shortcode) {
    const data = await fetchGraphQL(secrets, {
        doc_id: "8845758582119845",
        variables: {
            "shortcode": shortcode,
            "fetch_tagged_user_count": null,
            "hoisted_comment_id": null,
            "hoisted_reply_id": null
        },
    })

    // Check if media data exists
    if (!data || !data.data || !data.data.xdt_shortcode_media) {
        console.error(`Media data is missing or invalid for post ${shortcode}:`, data)
        document.body.innerHTML = `<p style="color: orange; font-family: sans-serif; padding: 20px;">Could not find media data for post ${shortcode}. It might be private or unavailable.</p>`
        return; // Stop execution
    }

    const media = data.data.xdt_shortcode_media

    // Use the new parsing function
    const mediaItems = parseMediaNode(media)

    renderProfileHeader({
        username: media.owner.username,
        fullName: media.owner.full_name,
        profilePicUrl: media.owner.profile_pic_url,
        isVerified: media.owner.is_verified
    })

    renderMedia(mediaItems)
}


// Refactored loadNextPage
async function loadNextPage(secrets, profileId, after) {
    const data = await fetchGraphQL(secrets, {
        doc_id: "7950326061742207",
        variables: {
            "id": profileId,
            "after": after,
            "first": 12 // Number of posts to fetch per page
        },
    })

    // Parse `data` and fill `mediaItems` using the parsing function
    const mediaEdges = data?.data?.user?.edge_owner_to_timeline_media?.edges
    const mediaItems = mediaEdges ? mediaEdges.flatMap(edge => parseMediaNode(edge.node)) : []

    if (!mediaEdges) {
        console.error("Could not find media edges in the response data:", data)
    }

    renderMedia(mediaItems)

    // Handle pagination
    const pageInfo = data?.data?.user?.edge_owner_to_timeline_media?.page_info
    renderLoadMoreButton(secrets, profileId, pageInfo)
}

async function loadFullProfile(secrets, username) {
    const data = await fetchProfile(secrets, username)

    // Check if user data exists
    if (!data || !data.data || !data.data.user) {
        console.error("Profile data is missing or invalid:", data)
        document.body.innerHTML = `<p style="color: orange; font-family: sans-serif; padding: 20px;">Could not find profile data for ${username}. The profile might be private or does not exist.</p>`
        return; // Stop execution
    }

    // Header
    const user = data.data.user

    renderProfileHeader({
        fullName: user.full_name,
        biography: user.biography,
        profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url, // Fallback for profile pic
        bioLinks: user.bio_links,
        isVerified: user.is_verified,
    })

    // Stories or whatever
    const felixVideoEdges = user.edge_felix_video_timeline?.edges || []
    if (felixVideoEdges.length > 0) {
        renderMedia(felixVideoEdges.flatMap(edge => parseMediaNode(edge.node)))
        renderLine()
    }

    // Timeline
    const timelineEdges = user.edge_owner_to_timeline_media?.edges || []
    const timelineMedia = timelineEdges.flatMap(edge => parseMediaNode(edge?.node)); // Add null check for edge

    renderMedia(timelineMedia)

    // Show more button
    const pageInfo = user.edge_owner_to_timeline_media?.page_info
    const profileId = user.id

    renderLoadMoreButton(secrets, profileId, pageInfo)
}

function run({ secrets, profileId }) {
    // first, stop the page from loading
    window.stop()

    document.head.innerHTML = ''
    document.body.innerHTML = ''

    // and now execute our code
    const postID = window.location.pathname.match(/(?:p|reel)\/([^\/]*)/)

    if (postID) {
        const shortcode = postID[1]
        console.log(`Loading post: ${shortcode}`)
        loadSinglePost(secrets, shortcode)
    } else {
        const username = window.location.pathname.split('/')[1]
        console.log(`Loading profile: ${username}`)
        try {
            loadFullProfile(secrets, username)
        } catch (error) {
            console.error("Error loading full profile:", error)

            // most probably access errro, let's try loading a limited profile
            loadNextPage(secrets, profileId, null)
        }
    }
}

(function () {
    'use strict'

    if (isDebug()) {
        console.log("Debug mode enabled")
        document.body.innerHTML = ""

        const shortcode = window.location.pathname.split('/').pop()
        if (shortcode && shortcode == "limited") {
            loadNextPage({ /* no secrets */ }, profileId)
        } else if (shortcode) {
            loadSinglePost({ /* no secrets */ }, shortcode)
        } else {
            loadFullProfile({/* no secrets */ })
        }

        return
    }

    // let's try to stop it from blinking
    const style = document.createElement('style')
    style.textContent = '#splash-screen { display: none !important; }'
    document.head.appendChild(style)

    // we try to extract the secrets and run the app right away,
    // sometimes it works :)
    const { secrets, profileId } = extractDataAndRemoveScripts(1)
    if (!secrets) {
        // but since the user-script injection is kinda unpredictable
        // especially across different browsers and extensions,
        // we also fallback to a DOMContentLoaded event listener
        document.addEventListener('DOMContentLoaded', function () {
            window.stop() // we know that the secrets are in the DOM, so we can stop loading all other garbage

            const { secrets, profileId } = extractDataAndRemoveScripts(2)
            if (!secrets) {
                console.log("Failed to extract secrets")
                return
            }

            run({ secrets, profileId })
        })

        return
    }

    run(secrets)
})()
