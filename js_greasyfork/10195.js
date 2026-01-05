// ==UserScript==
// @name        iview VOD download link
// @namespace   iview
// @description Shows FFMPEG download details and a direct download link
// @include     http://iview.abc.net.au/programs/*
// @version     0.4
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10195/iview%20VOD%20download%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/10195/iview%20VOD%20download%20link.meta.js
// ==/UserScript==

// inspired by https://github.com/adammw/iview-html5-video-chrome-extension/blob/master/content_script.js

function showDownloadButton(videoHref){

    let programActionsDiv = document.querySelector('#content .program-actions');

    let downloadButton = document.createElement('a');
    downloadButton.innerHTML = 'FFMPEG';
    downloadButton.style.cursor = 'pointer';

    programActionsDiv.appendChild(downloadButton);

    downloadButton.addEventListener('click', function(e) {

        e.preventDefault();
        getVidDetails(unsafeWindow.videoParams);

    }, false);

}

showDownloadButton();

function sanitizeTitle(vTitle){
    //try to sanitize the title a bit
    let sanitizedTitle = '';

    for (let i = 0, len = vTitle.length; i < len; i++) {
        sanitizedTitle +=vTitle[i].replace(/[^a-zA-Z0-9]/," ");
    }
    return sanitizedTitle;

}

function getVidDetails(videoParams){

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://iview.abc.net.au/feed/wd/?series=' + videoParams.seriesHouseNumber,
        responseType: 'document',
        headers: {
          "Authorization": "Basic ZmVlZHRlc3Q6YWJjMTIz"
        },
        onload: function(res) {

            var items = res.responseXML.querySelectorAll('item');

            for (var i = 0, l = items.length; i < l; i++) {

              var item = items[i];

              if (item.querySelector('link').textContent == 'http://iview.abc.net.au/' + videoParams.href) {

                let videoHref = item.querySelector('videoAsset').textContent;
                let title = !videoParams.title ? '' : videoParams.title;

                let vidTitle = sanitizeTitle(videoParams.seriesTitle+title)+'.mp4';

                createModal(vidTitle, videoHref);

              }


            }

        },
        onerror: function(res) {

            var msg = "An error occurred."
            + "\nresponseText: " + res.responseText
            + "\nreadyState: " + res.readyState
            + "\nresponseHeaders: " + res.responseHeaders
            + "\nstatus: " + res.status
            + "\nstatusText: " + res.statusText
            + "\nfinalUrl: " + res.finalUrl;

            console.log(msg);

        }
    });

}

function createModal(sanitizedTitle, videoHref){

    let modalStyles = `
        #gm_modalContainer {
            height: 100%;
           width: 100%;
            overflow: auto;
            margin: auto;
            position: absolute;
            z-index: 1000;
            background: rgba(0,0,0,.5);
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }
        #gm_modal{
            background-color: grey;
            border: 10px solid grey;
            bottom: 0;
            display: flex;
            flex-direction: row;
            height: 360px;
            left: 0;
            margin: auto;
            overflow: auto;
            position: relative;
            right: 0;
            top: 150px;
            width: 800px;
        }
        #gm_button_containers {
            display: flex;
            flex-direction: column;
        }
        #gm_textArea {
            margin-left: 20px;
            width: 680px;
            height: 150px;
            margin-bottom: 30px;
        }
        #gm_closeModal {
            color: black;
            font-size: 5em;
            height: 20px;
            margin-left: 25px;
            margin-top: 8px;
        }
        #gm_closeModal:hover {
            text-decoration: none;
            cursor: pointer;
        }
        .gm_modalButtons {
            cursor: pointer;
            margin-bottom: 10px;
            margin-right: 10px;
            padding: 5px;
            text-align: left;
            border: 2px solid white;
            color: white;
            font-size: 1.2em;
        }
        .gm_modalButtons:hover {
            border: 2px solid blue;
        }
        .gm_vidDownLink{
            font-size: 1.5rem;
            margin: 20px;
        }
        .gm_downloadContainer{
            flex-direction: column;
        }`;

    GM_addStyle(modalStyles);

    let modalContainer = document.createElement('div');
    modalContainer.setAttribute('id', 'gm_modalContainer');

    let gmModal = document.createElement('div');
    gmModal.setAttribute('id', 'gm_modal');

    modalContainer.appendChild(gmModal);

    let downloadContainer = document.createElement('div');
    downloadContainer.setAttribute('id', 'gm_downloadContainer');

    gmModal.appendChild(downloadContainer);

    let gmTextArea = document.createElement('textarea');
    gmTextArea.setAttribute('id', 'gm_textArea');

    downloadContainer.appendChild(gmTextArea);

    gmTextArea.value = 'ffmpeg -i "'+videoHref+'" -c copy "'+sanitizedTitle+'"';

    let downloadLink = document.createElement('a');
    downloadLink.innerHTML = 'Direct Download Link';
    downloadLink.href = videoHref;
    downloadLink.download = sanitizedTitle;
    downloadLink.setAttribute('class', 'gm_vidDownLink');

    downloadContainer.appendChild(downloadLink);

    let gmcloseModal = document.createElement('a');
    gmcloseModal.setAttribute('id', 'gm_closeModal');
    gmcloseModal.innerHTML = '&#10005';

    gmModal.appendChild(gmcloseModal);

    gmcloseModal.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.removeChild(modalContainer);
    }, false);

    document.body.appendChild(modalContainer);
}