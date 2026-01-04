// ==UserScript==
// @name         Topic Imagemap
// @namespace    websight.blue
// @version      0.1.5
// @description  thread image map
// @author       cykage
// @match        https://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464095/Topic%20Imagemap.user.js
// @updateURL https://update.greasyfork.org/scripts/464095/Topic%20Imagemap.meta.js
// ==/UserScript==



async function getImages(url) {
    // check every post in topic for images and return an object with msg id and images sources

    //match the url with just the thread #
    const regex = /https:\/\/lue\.websight\.blue\/thread\/\d+/;
    const threadUrl = url.match(regex)[0]


    //grab contents of whole thread
    const resp = await fetch(threadUrl)
    const body = await resp.text()
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html')

    const messageContents = doc.querySelectorAll(".message-contents:not(.preview")

    // obj format will be - {msg-<id#>: [image sources]}
    let imagesObj = {}

    //look for images in each message and add them to the object in an array
    messageContents.forEach((messageContent) => {

        const msgID = messageContent.closest('.message-container').id
        const images = messageContent.querySelectorAll("img")


        let imageSrcs = []
        images.forEach((image) => {

            if (!image.src.includes('img-thumb')) {
                imageSrcs.push(image.src)
            }
        })

        // add to object if the post has images
        if (imageSrcs.length !== 0) {
            imagesObj[msgID] = imageSrcs
        }

        imageSrcs = []
    })

    console.log(imagesObj)
    return imagesObj
}


//add a separator and link to the userbase
const userbar = document.querySelector(".userbar")
const link = document.createElement('a')
link.href = "#"
link.innerText = 'Image Map'
userbar.insertAdjacentText('beforeend', " | ")
userbar.insertAdjacentElement('beforeend', link)
link.addEventListener('click', event => {
    event.preventDefault()

    //open new window to display images
    const newWindow = window.open('', '', 'width=1000,height=800');



    const regex = /https:\/\/.*\.websight\.blue\/thread\/\d+/;
    const threadUrl = window.location.href.match(regex)[0]

    //write html/images to new window
    getImages(window.location.href)
        .then(imgObj => {

        if (Object.keys(imgObj).length === 0) {
            newWindow.document.write("No images")
        }


        for (const key in imgObj) {
            for (const src of imgObj[key]) {
                const id = parseInt(key.replace('msg-',''))
                const low = id - (id % 50) + 1
                const high = low + 49


                newWindow.document.write(`
                        <div style="display:inline-block">
                            <div>
                                <img src=${src.replace('/img/', '/img-thumb/')} width="175px" style="padding:15px;display:inline-block"/>
                                <div style="column-count:2;text-align: center;font-size: 14px; padding-left:40px;padding-right: 40px;">
                                <a href="${threadUrl}/${low}-${high}#${key}" style="display:block" target="_blank">See Post</a>
                                <a href="${src}" style="display:block" target="_blank">Full Image</a>
                                </div>
                            </div>
                        </div>
                        `)
            }
        }
    })

})


