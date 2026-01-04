// ==UserScript==
// @name     Panopto downloader
// @version  1
// @grant    none
// @include  https://*panopto.com/*/Viewer.aspx*
// @description Downloads panopto stuff
// @run-at      document-idle
// @namespace https://greasyfork.org/users/704420
// @downloadURL https://update.greasyfork.org/scripts/415993/Panopto%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/415993/Panopto%20downloader.meta.js
// ==/UserScript==



let link_meta = document.getElementsByName("twitter:player:stream");
let link = link_meta[0].getAttribute("content");

console.log(link);


var link_wrapper = document.createElement('div');
link_wrapper.class = "action-section";
link_wrapper.style = "margin: 0 8px;";

var link_element = document.createElement('a');
var link_text = document.createTextNode("Download");
link_element.appendChild(link_text);
link_element.href = "#";// link;
link_element.download = document.title + ".mp4";
link_element.id = "download_link";

let header = document.getElementsByClassName("header-right");

link_wrapper.appendChild(link_element);
header[0].appendChild(link_wrapper);




let saveAs = (url, name, callback = () => {}) => {
    console.debug('saveAs')

    // Parse URL
    const urlObject = new URL(url)
    const urlHref = urlObject.href
    const urlFilename = urlObject.pathname.replace(/\?.*$/, '')

    // Resolve filename
    const filename = name || urlFilename

    // Create XHR Request
    const request = new XMLHttpRequest()

    // XHR Open
    request.open('GET', urlHref)

    // XHR MIME Type
    request.responseType = 'blob'
    request.overrideMimeType('application/octet-stream')

    // Error handler
    request.onerror = () => {
        console.debug('saveAs', 'onerror')

        callback(new Error('Network Request failed.'))
    }

    // Progress handler
    request.onprogress = (event) => {
        //console.debug('saveAs', 'onprogress')

        callback(null, (event.loaded / event.total))
    }

    // Completion handler
    request.onload = (event) => {
        console.debug('saveAs', 'onload', event)
        console.info('onload', 'xhr.readyState', request.readyState) // readyState will be 1

        // Create new File object with generic MIME type
        const file = new File([request.response], '', { type: 'application/octet-stream' })

        // Create ObjectURL
        const objectUrl = window.URL.createObjectURL(file)

        // Create helper element
        const anchorElement = document.createElement('a')
        anchorElement.style.display = 'none'
        anchorElement.target = '_self'
        anchorElement.href = objectUrl
        anchorElement.download = filename
        document.body.appendChild(anchorElement)

        // Trigger download
        anchorElement.click()

        // Revoke ObjectURL
        window.URL.revokeObjectURL(objectUrl)

        // Remove element
        anchorElement.remove()

        callback(null, 1, true)
    }

    // XHR Send
    request.send()
}


document.getElementById('download_link').addEventListener('click', function() {
              saveAs(link, document.title + ".mp4");
            });