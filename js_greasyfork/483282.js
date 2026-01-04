// ==UserScript==
// @name         Desu X - Enhancement Script for Desuarchive.org
// @version      2.5
// @description  Combines infinite scrolling, media preview on hover, download functionality, Fappe Tyme™ and gallery mode for desuarchive.org. Alt+G to activate gallery mode. 'F' to toggle fappe tyme. Press 'S' while hovering over a thumbnail or in gallery mode to download media with the original filename.
// @author       kpganon
// @license      MIT
// @namespace    https://github.com/kpg-anon/scripts
// @match        https://desuarchive.org/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/483282/Desu%20X%20-%20Enhancement%20Script%20for%20Desuarchiveorg.user.js
// @updateURL https://update.greasyfork.org/scripts/483282/Desu%20X%20-%20Enhancement%20Script%20for%20Desuarchiveorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
            @import url('https://fonts.googleapis.com/css?family=Roboto');
    * {
        font-family: 'Roboto', sans-serif !important;
    }
    .desux-search-page .paginate {
        display: none !important;
    }
    .desux-search-page article.thread {
        padding: 0 !important;
        border-top: none !important;
    }
    .hidden-by-desux {
        visibility: hidden;
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        clip-path: inset(50%);
        white-space: nowrap;
    }
    [data-hidden="true"] {
      opacity: 0;
      pointer-events: none;
      user-select: none;
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      clip-path: inset(100%);
    }
    #hover-preview {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        pointer-events: none;
        max-width: 100vw;
        max-height: 100vh;
    }
    #hover-preview img,
    #hover-preview video {
        width: auto;
        height: auto;
        max-width: 100vw;
        max-height: 100vh;
        object-fit: contain;
    }
    #ig-galleryContainer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 80px;
    }
    #ig-galleryImage {
        max-width: 90%;
        max-height: calc(100% - 80px - 20px);
        transition: all 0.3s ease;
    }
    #ig-imageCounter {
        position: absolute;
        top: 10px;
        left: 10px;
        color: white;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 5px 10px;
        border-radius: 5px;
        z-index: 100000;
    }
    .ig-close-button {
        position: fixed;
        top: 0;
        right: 0;
        padding: 0;
        background-color: transparent;
        border: none;
    }
    .ig-close-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
        filter: brightness(85%);
    }
    .ig-nav-button {
        position: fixed;
        background-color: transparent;
        border: none;
        padding: 0;
        width: auto;
        height: auto;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        top: 50%;
        transform: translateY(-50%);
    }
    .ig-nav-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
        filter: brightness(85%);
    }
    .ig-nav-button:active {
        background-color: transparent;
    }
    .ig-nav-button.ig-prev-button {
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
    }
    .ig-nav-button.ig-prev-button:active .button-icon {
        transform: scale(0.95);
    }
    .ig-nav-button.ig-next-button {
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
    }
    .ig-nav-button.ig-next-button:active .button-icon {
        transform: scale(0.95);
    }
    #ig-thumbnailBar {
        position: fixed;
        bottom: 0;
        left: 50%;
        right: 0;
        height: 75px;
        transform: translateX(-50%);
        display: flex;
        overflow-x: scroll;
        overflow-y: hidden;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 10px 0;
        white-space: nowrap;
        scrollbar-width: thin;
        scrollbar-color: #444 #282A36;
    }
    #ig-thumbnailBar::-webkit-scrollbar {
        height: 12px;
        background: #282A36;
    }
    #ig-thumbnailBar::-webkit-scrollbar-track {
        background: #282A36;
    }
    #ig-thumbnailBar::-webkit-scrollbar-thumb {
        background-color: #444;
        border-radius: 10px;
        border: 3px solid #282A36;
    }
    #ig-thumbnailBar::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    .ig-thumbnail {
        height: 60px;
        object-fit: cover;
        margin: 0 5px;
        cursor: pointer;
        transition: transform 0.3s ease, outline 0.3s ease;
    }
    .ig-thumbnail:hover {
        opacity: 0.7;
    }
    .ig-thumbnail.ig-active {
        transform: scale(1.05);
        outline: 3px solid green;
    }
    .ig-download-button {
        position: fixed;
        top: 5px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        padding: 0;
        background-color: transparent;
        transition: background-color 0.3s ease, transform 0.3s ease;
        z-index: 10002;
    }
    .ig-download-button .button-icon {
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .ig-download-button:hover {
        background-color: transparent;
        box-shadow: none;
    }
    .ig-download-button:hover .button-icon {
        transform: scale(1.05);
        opacity: 0.7;
    }
    .ig-download-button:active .button-icon {
        transform: scale(0.95);
    `);

    const prefix = 'ig-';
    let hoveredMediaLink = null;
    let hoveredMediaFilename = null;
    let images = [];
    let currentIndex = 0;
    let galleryContainer, galleryImage, counter, thumbnailBar;
    let loading = false;

    const preview = document.createElement('div');
    preview.id = 'hover-preview';
    document.body.appendChild(preview);

    function togglePostVisibility() {
        const posts = document.querySelectorAll('.post_wrapper');
        posts.forEach(post => {
            const hasImage = post.querySelector('.post_file') !== null;
            if (!hasImage) {
                if(post.getAttribute('data-hidden') === 'true') {
                    post.removeAttribute('data-hidden');
                } else {
                    post.setAttribute('data-hidden', 'true');
                }
            }
        });
    }

    function addPageSpecificClass() {
        const urlPath = window.location.pathname;
        const bodyClass = document.body.classList;

        if(urlPath.includes('/search/')) {
            bodyClass.add('desux-search-page');
        } else if(urlPath.match(/\/\w+\/thread\/\d+/)) {
            bodyClass.add('desux-thread-page');
        }
    }

    function attachHoverPreviewAndDownload() {
        document.querySelectorAll('.thread .thread_image_link, .post_wrapper .thread_image_link').forEach(anchor => {
            anchor.addEventListener('mouseover', function() {
                const href = this.href;
                const isVideo = href.endsWith('.webm') || href.endsWith('.mp4');

                preview.innerHTML = '';
                const media = isVideo ? document.createElement('video') : document.createElement('img');
                media.src = href;
                if (isVideo) {
                    media.autoplay = true;
                    media.loop = true;
                    media.muted = true;
                }
                preview.appendChild(media);
                preview.style.display = 'block';

                const postContainer = this.closest('.post_wrapper') || this.closest('.thread');
                const filenameElement = postContainer.querySelector('.post_file_filename');
                hoveredMediaLink = href;
                hoveredMediaFilename = filenameElement ? (filenameElement.getAttribute('title') || filenameElement.textContent).trim() : getFilenameFromUrl(href);
            });

            anchor.addEventListener('mouseout', function() {
                preview.innerHTML = '';
                preview.style.display = 'none';
                hoveredMediaLink = null;
                hoveredMediaFilename = null;
            });
        });
    }

    function getFilenameFromUrl(url) {
        return url.split('/').pop();
    }

    const closeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABICAYAAAB/XULoAAAACXBIWXMAAAUTAAAFEwFaO8pPAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OSwgMjAyMy8wNi8yNS0yMDowMTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0xMi0xOVQxOToyOTo0NC0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMTItMTlUMTk6NDU6MjgtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTItMTlUMTk6NDU6MjgtMDU6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZjZDRlNWExLWM2NjEtOTY0NS1iZmRlLWViNWJmY2ZhNDJhYyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjY5NzFiYTdjLWMyOTYtYTY0OC1hMTdmLTk2OWU4MDNjMGFkMCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjkyODNiOGUwLTA1YjgtNzA0NS04N2RmLTQyODM5OTdlZDVjMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTI4M2I4ZTAtMDViOC03MDQ1LTg3ZGYtNDI4Mzk5N2VkNWMxIiBzdEV2dDp3aGVuPSIyMDIzLTEyLTE5VDE5OjI5OjQ0LTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZjZDRlNWExLWM2NjEtOTY0NS1iZmRlLWViNWJmY2ZhNDJhYyIgc3RFdnQ6d2hlbj0iMjAyMy0xMi0xOVQxOTo0NToyOC0wNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PictGGQAAAKGSURBVHja7dq7bhpBGIZhykhRuqQKx3g5RGJdYEEkEHdBgUCicwsdQtBAQcX5KKCAzpeARAMIEA2UblLkBiIlkm/Af2YtrxUCtgdEdhbzFa9kI3uLh9Hs7OwYjKYLQtpnAALgAY8AD3gEeMAjwAMeAR7wCPCABzwQAA94BHjAI8ADHgEe8EdKsrsplUpRuVymaDRKJrN00HUczkvKZDJUKpUoFAqxzyTAP5cse2g0GtF6vX6qUqmQ2WLf6zpXV14aj8cb18nn8wd/iW8a3u3eRldrNptksTq4ruPxbKOrFQoFhm8HvJrty1caDoc7sdSq1eqrI9/r9dFkMnnxOolEAvBqkUjkRSy1Vqv17MjfNb3saj6fC51ydAUfi8W44JXq9Tob+Zv4Pt+3V0e62nK5FDrd6Are7pC54ZQajcYTvoI+nU65/zebzWKq+btAIPAwDfACtttt8vv9e31h/X6frDYX4P8tGAzSYrHghlytVtx/2+v12P3BieXksUY+/0h34gFKS/xut8v9DIC9miPhdzodXaGfzCaZcvM8FF+P6Ce1O6ngz2azN4F+cvD7jnrAC5znMdUIvLnqbUVzVstJPa3hz/QBygV4bBmc2SbZYDDAJpmobeFcLgd4vAgRXDgc5kKr1Wpb6Pvi49Xfxstul2Yvu+PxOKYaMcc7JMDjQJPOjvAlk8mHo3fKsY/Dj/DJlE6nqVgs4ggfAjzgAY8AD3gEeMAjwAMeAf4U4O8BIQb+NyDEwH8HhBj4G0CIgb8GhAB4s8Xxgf1wBwyN4YnI8Nl4UQKGAHirzfme/fIDIBrDK5nMksw++AUUjeEf8S/ZtHMLGI3hlT5+Mr57XOlMWT+B9H/6A1c1rQ/ztPCSAAAAAElFTkSuQmCC';
    const downloadImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAAHMCAYAAABY25iGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHpGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OSwgMjAyMy8wNi8yNS0yMDowMTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyNS4wIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMTItMTlUMjA6Mzc6MzUtMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTEyLTIwVDAwOjQzOjQ1LTA1OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTEyLTIwVDAwOjQzOjQ1LTA1OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNTA1ZGNlYS03NjNiLTc1NDItOTE0Ni0xMDU5NjZiY2M4MWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplZjg1NDliMy0zMmE3LTQyNDItOGExOS02Y2NjODQ3NTJjZjYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1YmQ3NDVmMy1jMDA4LWNlNGEtYWQ2OS00NjE1YzU0N2VkMDEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjViZDc0NWYzLWMwMDgtY2U0YS1hZDY5LTQ2MTVjNTQ3ZWQwMSIgc3RFdnQ6d2hlbj0iMjAyMy0xMi0xOVQyMDozNzozNS0wNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozN2VhNjE1OS1lOGQzLWNmNDktYTk2My1lNTdhNDI2NTg2NDEiIHN0RXZ0OndoZW49IjIwMjMtMTItMTlUMjA6NDI6MzMtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MzUwNWRjZWEtNzYzYi03NTQyLTkxNDYtMTA1OTY2YmNjODFiIiBzdEV2dDp3aGVuPSIyMDIzLTEyLTIwVDAwOjQzOjQ1LTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpJbmdyZWRpZW50cz4gPHJkZjpCYWc+IDxyZGY6bGkgc3RSZWY6bGlua0Zvcm09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';
    const navigateLeftImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABsCAYAAADjYAXIAAAACXBIWXMAAAUTAAAFEwFaO8pPAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OSwgMjAyMy8wNi8yNS0yMDowMTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0xMi0xOVQxOToyOTo1MS0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMTItMTlUMTk6NDQ6MTAtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTItMTlUMTk6NDQ6MTAtMDU6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmE5N2IxMWQ1LWE0NTctZjg0Yy1iOWNiLTJkYWNjNzQ4NzY5ZCIgeG1wTU06RG9jdW1lbnRJRD0i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';
    const navigateRightImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABsCAYAAADjYAXIAAAACXBIWXMAAAUTAAAFEwFaO8pPAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuMTQ2Mjg5OSwgMjAyMy8wNi8yNS0yMDowMTo1NSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0xMi0xOVQxOToyOTo1MS0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMTItMTlUMTk6NDI6NDQtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTItMTlUMTk6NDI6NDQtMDU6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmFkY2I5Y2I0LWZmZmYtNzk0Mi1hM2U4LWYxOTcwYTZmM2M0NSIgeG1wTU06RG9jdW1lbnRJRD0i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';

    function collectMediaItems() {
        const mediaLinks = document.querySelectorAll('.thread .thread_image_link, .post_wrapper .thread_image_link');
        mediaLinks.forEach((mediaLink) => {
            const postWrapper = mediaLink.closest('.post_wrapper, .thread');
            if (postWrapper) {
                const isVideo = mediaLink.href.endsWith('.webm');
                const thumbnail = mediaLink.querySelector('img').src;

                const postLink = postWrapper.querySelector('a[data-function="quote"]');
                const postId = postLink ? postLink.getAttribute('data-post') : postWrapper.id;

                images.push({
                    src: mediaLink.href,
                    isVideo,
                    thumbnail,
                    postId
                });
            }
        });
    }

    function getCurrentPageNumber() {
        const matches = window.location.pathname.match(/page\/(\d+)/);
        const pageNumber = matches ? parseInt(matches[1], 10) : 1;
        // console.log('Current page number:', pageNumber);
        return pageNumber;
    }

    let currentPageNumber = getCurrentPageNumber();

    if (window.location.pathname.includes('/search/')) {
        $('#footer').hide();
    }

    function loadMoreContent() {
        if (loading || !window.location.pathname.includes('/search/')) return;
        loading = true;
        // console.log('Loading more content...');

        const nextPageUrl = constructNextPageUrl(currentPageNumber);
        // console.log('Next page URL:', nextPageUrl);

        $.ajax({
            url: nextPageUrl,
            type: 'GET',
            success: function(response) {
                // console.log('Content loaded successfully');
                const $response = $(response);
                $response.find('article.backlink_container, section.section_title, h3.section_title, div.paginate').remove();
                const newContent = $response.find('.thread').parent();

                if (newContent.length === 0) {
                    // console.log('No more content to load');
                    $('#footer').show();
                    loading = false;
                    return;
                }

                $('.thread').last().parent().append(newContent.html());

                attachHoverPreviewAndDownload();
                collectMediaItems();

                currentPageNumber++;
                loading = false;
            },
            error: function(xhr, status, error) {
                // console.error('Error loading content:', status, error);
                loading = false;
            }
        });
    }

    function constructNextPageUrl(currentPageNumber) {
        let basePath = window.location.href;
        let nextPageNumber = currentPageNumber + 1;

        // console.log('Constructing URL for page:', nextPageNumber);

        if (basePath.includes('/page/')) {
            basePath = basePath.replace(/\/page\/\d+/, `/page/${nextPageNumber}`);
        } else {
            if (!basePath.endsWith('/')) {
                basePath += '/';
            }
            basePath += `page/${nextPageNumber}/`;
        }
        // console.log('Next page URL:', basePath);
        return basePath;
    }

    function createGallery() {
        if (galleryContainer) {
            galleryContainer.remove();
            galleryContainer = null;
            return;
        }

        galleryContainer = GM_addElement(document.body, 'div', { id: prefix + 'galleryContainer' });
        galleryImage = GM_addElement(galleryContainer, 'img', { id: prefix + 'galleryImage' });
        counter = GM_addElement(galleryContainer, 'div', { id: prefix + 'imageCounter' });

        const closeButton = createButton(closeImage, closeGallery, prefix + 'close-button');
        const downloadButton = createButton(downloadImage, downloadCurrentMedia, prefix + 'download-button');
        const nextButton = createButton(navigateRightImage, () => navigateGallery(1), prefix + 'nav-button', prefix + 'next-button');
        const prevButton = createButton(navigateLeftImage, () => navigateGallery(-1), prefix + 'nav-button', prefix + 'prev-button');

        thumbnailBar = GM_addElement(galleryContainer, 'div', { id: prefix + 'thumbnailBar' });
        images.forEach((media, index) => {
            const thumb = GM_addElement(thumbnailBar, 'img', {
                src: media.thumbnail,
                class: prefix + 'thumbnail'
            });
            thumb.addEventListener('click', () => {
                currentIndex = index;
                updateGallery();
            });
        });

        galleryContainer.append(counter, closeButton, downloadButton, nextButton, prevButton, thumbnailBar);
        updateGallery();
    }

    function createButton(base64Image, onClick, ...classes) {
        const button = GM_addElement(document.body, 'button', { class: classes.join(' ') });
        button.addEventListener('click', onClick);

        GM_addElement(button, 'img', {
            src: base64Image,
            class: 'button-icon'
        });

        return button;
    }

    function navigateGallery(direction) {
        const totalImages = images.length;
        currentIndex = (currentIndex + direction + totalImages) % totalImages;
        updateGallery();
    }

    function closeGallery() {
        if (galleryContainer) {
            galleryContainer.remove();
            galleryContainer = null;
        }
    }

    function updateGallery() {
        if (images.length > 0 && galleryContainer) {
            const currentMedia = images[currentIndex];

            if (galleryContainer.contains(galleryImage)) {
                galleryContainer.removeChild(galleryImage);
            }

            galleryImage = currentMedia.isVideo ? GM_addElement(galleryContainer, 'video', { id: prefix + 'galleryImage', controls: true, autoplay: true, loop: true, muted: true }) : GM_addElement(galleryContainer, 'img', { id: prefix + 'galleryImage' });
            galleryImage.src = currentMedia.src;

            counter.textContent = `${currentIndex + 1}/${images.length}`;
            updateThumbnails();
        }
    }

    function updateThumbnails() {
        const thumbnails = Array.from(thumbnailBar.children);
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle(prefix + 'active', index === currentIndex);
        });

        const selectedThumbnail = thumbnails[currentIndex];
        thumbnailBar.scrollLeft = selectedThumbnail.offsetLeft - thumbnailBar.offsetWidth / 2 + selectedThumbnail.offsetWidth / 2;
    }

    function getOriginalFilename(postId) {
        let postElement = document.querySelector(`.thread[id="${postId}"]`);
        let filenameLink;

        if (postElement) {
            filenameLink = postElement.querySelector('.post_file_filename');
        } else {
            postElement = document.querySelector(`.post_wrapper a[data-function="quote"][data-post="${postId}"]`);
            const postWrapperParent = postElement ? postElement.closest('.post_wrapper') : null;
            filenameLink = postWrapperParent ? postWrapperParent.querySelector('.post_file_filename') : null;
        }

        if (filenameLink) {
            if (filenameLink.getAttribute('title')) {
                return filenameLink.getAttribute('title').trim();
            } else if (filenameLink.textContent) {
                return filenameLink.textContent.trim();
            }
        }

        const currentMedia = images.find(img => img.postId === postId);
        if (currentMedia && currentMedia.src) {
            const urlParts = currentMedia.src.split('.');
            const ext = urlParts[urlParts.length - 1];
            return `default-filename.${ext}`;
        }

        return "default-filename";
    }

    function downloadCurrentMedia() {
        const currentMedia = images[currentIndex];
        let postId = currentMedia.postId;
        if (!postId || postId === document.querySelector('.thread').id) {
            postId = document.querySelector('.thread').id;
        }

        const originalFilename = getOriginalFilename(postId);
        GM_xmlhttpRequest({
            method: 'GET',
            url: currentMedia.src,
            responseType: 'blob',
            onload: function(response) {
                saveBlob(response.response, originalFilename);
            },
            onerror: function(error) {
                console.error('Error downloading file:', error);
            }
        });
    }

    function saveBlob(blob, filename) {
        const a = GM_addElement(document.body, "a", { href: window.URL.createObjectURL(blob), download: filename });
        a.click();
        document.body.removeChild(a);
    }

    document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 's' && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        if (galleryContainer && galleryContainer.style.display !== 'none') {
            downloadCurrentMedia();
        } else if (hoveredMediaLink) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: hoveredMediaLink,
                responseType: 'blob',
                onload: function(response) {
                    const blobUrl = URL.createObjectURL(response.response);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = hoveredMediaFilename || 'download';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(blobUrl);
                },
                onerror: function() {
                    alert('Download failed.');
                }
            });
        }
    }

    if (e.altKey && e.key.toLowerCase() === 'g') {
        if (!images.length) collectMediaItems();
        createGallery();
    }

    if (e.key === 'Escape' && galleryContainer && galleryContainer.style.display !== 'none') {
        closeGallery();
    }

    if (galleryContainer && galleryContainer.style.display !== 'none') {
        if (e.key === 'ArrowRight') {
            navigateGallery(1);
        } else if (e.key === 'ArrowLeft') {
            navigateGallery(-1);
        }
    }
      
    if ((e.key === 'F' || e.key === 'f') && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey &&
        e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' &&
        /https:\/\/desuarchive\.org\/.*\/thread\/.*/.test(window.location.href)) {

        togglePostVisibility();
        e.preventDefault();
    }
    });

    window.addEventListener('scroll', function() {
        if (window.location.pathname.includes('/search/') && window.scrollY + window.innerHeight >= document.body.scrollHeight - 90) {
            loadMoreContent();
        }
    });

    addPageSpecificClass();
    attachHoverPreviewAndDownload();
    collectMediaItems();
})();
