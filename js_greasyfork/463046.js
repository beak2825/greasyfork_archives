// ==UserScript==
// @name        Rule34.xxx Viewer
// @description Image viewer with keyboard navigation for rule34.xxx content.
// @namespace   https://sleazyfork.org/en/scripts/463046-rule34-xxx-viewer
// @author      bliblux
// @version     1.0.1
// @license     MIT
// @match *://rule34.xxx/index.php?page=post&s=list*
// @downloadURL https://update.greasyfork.org/scripts/463046/Rule34xxx%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/463046/Rule34xxx%20Viewer.meta.js
// ==/UserScript==

(async function () {
    console.log(`start script <${GM.info.script.name}> version <${GM.info.script.version}>`);
    let unloadedImageLinks = [];
    let imageCount = 0;
    let imageData = [];
    let imageTagLists = [];
    let viewerImageIndex = 0;
    let imageDataReady = false;
    initUnloadedImageLinks();
    initButtons();
    initViewer();
    initKeyboardEventHandler();
    initButtonCss();
    initViewerCss();

    //----------------------------------------------------------------------------------------------------------------//
    //BUTTONS---------------------------------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------------------------------------//
    function initButtons() {
        // create a div above with buttons above the image board
        const parentNode = document.querySelector('div.content');
        const ButtonContainerDiv = document.createElement('div');
        ButtonContainerDiv.id = 'button-container';
        const buttons = Array.of(
            createLoadImagesButton(),
            createViewerStatusDisplay(),
            createViewerButton()
        );
        if (parentNode) {
            buttons.forEach(button => {
                parentNode
                    .insertBefore(ButtonContainerDiv, parentNode.firstChild)
                    .appendChild(button);
            })
        }
        createShortcutDisplay()
    }

    function createViewerButton() {
        const viewerButton = document.createElement('button');
        viewerButton.id = 'viewer-button';
        viewerButton.innerText = 'Open Viewer';
        viewerButton.classList.add('button-disabled');
        viewerButton.addEventListener('click', function () {
            if (viewerButton.classList.contains('button-active')) {
                toggleViewer();
            }
        });
        return viewerButton;
    }

    function createLoadImagesButton() {
        const loaderButton = document.createElement('button');
        loaderButton.id = 'loader-button';
        loaderButton.innerText = 'Load Images';
        loaderButton.title = 'Hold down to load images!';
        loaderButton.addEventListener('click', loadAllImages);
        return loaderButton;
    }

    function createViewerStatusDisplay() {
        const statusDisplaySpan = document.createElement('span');
        statusDisplaySpan.id = 'viewer-status-display';
        statusDisplaySpan.innerText = 'Not Ready';
        return statusDisplaySpan;
    }

    function createShortcutDisplay() {
        const parentNode = document.getElementById('button-container');
        const shortCutsHtml = `
            <div id="shortcut-display">
                <p><span>shift+Q: </span><span>load images</span></p>
                <p><span>shift+space: </span><span>toggle viewer</span></p>
                <p><span>arrow keys: </span><span>viewer navigation</span></p>
            </div>`
        parentNode.lastElementChild.insertAdjacentHTML('afterend', shortCutsHtml);
    }

    function setViewerButtonToReady() {
        const viewerButton = document.getElementById('viewer-button');
        viewerButton.classList.replace('button-disabled', 'button-active');
    }

    //----------------------------------------------------------------------------------------------------------------//
    //IMAGE-DATA------------------------------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------------------------------------//
    function initUnloadedImageLinks() {
        // get image source link from the image preview parent anchor element
        unloadedImageLinks = Array.from(document.querySelectorAll('img.preview'), (link, index) => ({
            url: link.parentNode.href,
            index: index
        }));
        imageCount = unloadedImageLinks.length;
    }

    function fetchAndCreateImageData(index) {
        if (index === unloadedImageLinks.length) {
            setViewerStatusToReady();
            setViewerButtonToReady();
            return;
        }

        if (index === 0) {
            imageData = [];
            imageTagLists = [];
        }

        const indexedUrl = unloadedImageLinks[index];
        fetch(indexedUrl.url)
            .then(response => response.text())
            .then((imageHtmlString) => {
                createImageDataAndTagList(imageHtmlString, index);
                setTimeout(() => fetchAndCreateImageData(++index), 100)
            })
            .catch(error => {
                console.error('Failed to fetch an image page: ', error)
            })
    }

    function createImageDataAndTagList(imageHtmlString, index) {
        const domParser = new DOMParser();

        const document = domParser.parseFromString(imageHtmlString, 'text/html');
        const imageElement = document.getElementById('image');
        const videoElement = document.getElementById('gelcomVideoPlayer');

        // all relevant tag list items for the viewer have a class except the .current-page list item
        const tagListItemNodes = document.querySelectorAll('li[class]:not(.current-page)');
        const tagListElements = Array.from(tagListItemNodes).map(node => {
            const element = document.createElement(node.tagName.toLowerCase())
            element.className = node.className;
            for (let child of node.children) {
                const childElement = document.createElement(child.tagName.toLowerCase());
                if (child.tagName.toLowerCase() === 'a') {
                    childElement.setAttribute('href', child.getAttribute('href'));
                }
                childElement.innerHTML = child.innerHTML;
                childElement.className = child.className;
                element.appendChild(childElement);
            }
            return element;
        });

        if (!imageData.some(object => object.index === index)) {
            if (videoElement) {
                imageData.push({
                    image: videoElement,
                    index: index
                });
            } else {
                imageData.push({
                    image: imageElement,
                    index: index
                });
            }
            imageTagLists.push({
                tagList: tagListElements,
                index: index
            })
        }
    }

    function setViewerStatusToReady() {
        const statusDisplay = document.getElementById('viewer-status-display');
        statusDisplay.innerText = 'Ready';
        statusDisplay.className = 'viewer-status-ready';
        imageDataReady = true;
    }

    function setViewerStatusToLoading() {
        const statusDisplay = document.getElementById('viewer-status-display');
        statusDisplay.innerText = 'Loading';
        statusDisplay.className = 'viewer-status-loading';
    }

    //----------------------------------------------------------------------------------------------------------------//
    //KEYBOARD-EVENTS-------------------------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------------------------------------//
    function initKeyboardEventHandler() {
        window.addEventListener('keydown', function (event) {
            if (event.shiftKey && event.code === 'KeyQ') {
                loadAllImages();
            }
            if (event.shiftKey && event.code === 'Space') {
                toggleViewer();
            }
            if (event.code === 'ArrowUp') {
                increaseVideoVolume();
            }
            if (event.code === 'ArrowDown') {
                decreaseVideoVolume();
            }
            if (event.code === 'ArrowRight') {
                forwardVideo();
            }
            if (event.code === 'ArrowLeft') {
                rewindVideo();
            }
            if (event.code === 'PageUp') {
                displayPreviousImage();
            }
            if (event.code === 'PageDown') {
                displayNextImage();
            }
        });
    }

    function loadAllImages() {
        setViewerStatusToLoading();
        fetchAndCreateImageData(0);
    }

    //----------------------------------------------------------------------------------------------------------------//
    //VIEWER----------------------------------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------------------------------------//
    function initViewer() {
        // create and add elements that will act as the image viewer when active
        const containerDiv = document.createElement('div');
        containerDiv.id = 'viewer-container';
        containerDiv.classList.add('viewer-container');
        containerDiv.classList.add('viewer-inactive');
        const viewerHtml = `
            <div id="viewer-tag-list" class="viewer-tag-list"></div>
            <div id="viewer-image-display" class="viewer-image-display">
            <img id="viewer-image" src="" alt=""></div>
            <div id="viewer-footer-navigation" class="viewer-footer-navigation">
            <button id="viewer-navigation-button-previous" class="viewer-navigation-button">Previous</button>
            <button id="viewer-navigation-button-source" class="viewer-navigation-button">Source</button>
            <button id="viewer-navigation-button-index" class="viewer-navigation-button">--</button>
            <button id="viewer-navigation-button-close" class="viewer-navigation-button">Close</button>
            <button id="viewer-navigation-button-next" class="viewer-navigation-button">Next</button></div>
        `;
        containerDiv.insertAdjacentHTML('beforeend', viewerHtml);
        document.body.appendChild(containerDiv);
        document.getElementById('viewer-navigation-button-close').addEventListener('click', toggleViewer);
        document.getElementById('viewer-navigation-button-next').addEventListener('click', displayNextImage);
        document.getElementById('viewer-navigation-button-previous').addEventListener('click', displayPreviousImage);
        document.getElementById('viewer-navigation-button-source').addEventListener('click', navigateToImageSource);
    }

    function toggleViewer() {
        const viewerDiv = document.querySelector('div.viewer-container');
        if (!imageDataReady) {
            return;
        }
        if (viewerDiv.classList.contains('viewer-inactive')) {
            viewerDiv.classList.replace('viewer-inactive', 'viewer-active');
            displayImage();
        } else {
            viewerDiv.classList.replace('viewer-active', 'viewer-inactive');
            pauseVideo();
        }
    }

    function displayImage() {
        // get image of current index and update the viewer image accordingly
        const viewerImage = document.getElementById('viewer-image');
        const currentImage = imageData.find(image => image.index === viewerImageIndex).image;

        if (viewerImage.tagName !== currentImage.tagName) {
            const newImage = document.createElement(currentImage.tagName);
            if (currentImage.tagName === 'VIDEO') {
                newImage.id = 'viewer-image';
                newImage.src = currentImage.firstElementChild.src;
                newImage.controls = true;
                newImage.loop = true
            } else if (currentImage.tagName === 'IMG') {
                newImage.id = 'viewer-image';
                newImage.src = currentImage.src;
                newImage.alt = currentImage.alt;
            }
            viewerImage.replaceWith(newImage);
        } else if (currentImage.tagName === 'VIDEO') {
            viewerImage.src = currentImage.firstElementChild.src;
        } else if (currentImage.tagName === 'IMG') {
            viewerImage.src = currentImage.src;
            viewerImage.alt = currentImage.alt;
        }
        playVideo();

        // fill the viewer tag list with the current items
        const viewerTagList = document.getElementById('viewer-tag-list');
        viewerTagList.innerHTML = '<h4 style="color:#a0a0a0;">Tags</h4>';
        const imageTagList = imageTagLists.find(tagList => tagList.index === viewerImageIndex).tagList;
        imageTagList.forEach(tagList => viewerTagList.appendChild(tagList));

        // set index indicator of the viewer
        document.getElementById('viewer-navigation-button-index').innerText = (viewerImageIndex + 1).toString();
    }

    function playVideo() {
        const image = document.getElementById('viewer-image');
        if (image.tagName === 'VIDEO') {
            image.volume = 0.05;
            image.play();
        }
    }

    function pauseVideo() {
        const image = document.getElementById('viewer-image');
        if (image.tagName === 'VIDEO') {
            image.pause();
        }
    }

    function increaseVideoVolume() {
        const image = document.getElementById('viewer-image');
        if (image.tagName === 'VIDEO') {
            image.volume += 0.05;
        }
    }

    function decreaseVideoVolume() {
        const image = document.getElementById('viewer-image');
        if (image.tagName === 'VIDEO') {
            image.volume -= 0.05;
        }
    }

    function forwardVideo() {
        const image = document.getElementById('viewer-image');
        if (image.tagName === 'VIDEO') {
            image.currentTime += 2;
        }
    }

    function rewindVideo() {
        const image = document.getElementById('viewer-image');
        if (image.tagName === 'VIDEO') {
            image.currentTime -= 2;
        }
    }

    function displayNextImage() {
        viewerImageIndex = viewerImageIndex < imageCount ? viewerImageIndex + 1 : 1;
        displayImage();
    }

    function displayPreviousImage() {
        viewerImageIndex = viewerImageIndex > 1 ? viewerImageIndex - 1 : imageCount;
        displayImage();
    }

    function navigateToImageSource() {
        window.open(document.getElementById('viewer-image').src, '_blank');
    }

    //----------------------------------------------------------------------------------------------------------------//
    //CSS-CLASSES-----------------------------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------------------------------------//
    function addCssToHead(css, styleId) {
        const style = document.createElement('style');
        if (styleId) {
            style.setAttribute('id', styleId);
        }
        style.appendChild(document.createTextNode(css));
        return document.head.appendChild(style);
    }

    function initButtonCss() {
        addCssToHead(`
            #button-container {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #button-container button {
                width: 180px;
				height: 50px;
				text-align: center;
				background-color: #84AE83;
				color: #FFFFFF;
				font-weight: bold;
				border: none;
				margin: 3px 10px;
				cursor: pointer;
            }
            #shortcut-display {
                display: flex;
                justify-content: center;
                align-items: center;
                display: inline-block;
                height: 50px;
                width: 180px;
            }
            #shortcut-display p {
                display: flex;
                justify-content: space-between;
                align-items: center;
                text-align: start;
                font-size: 10px;
                height: 1em;
                color: #666;
            }
            #viewer-container button:hover, #button-container button:hover {
                background: #A4CEA3;
                color: #FFFFFF;
            }
            #button-container button.button-disabled {
                background: #C0C0C0;
                color: #808080;
                cursor: default;
            }
            #button-container button.button-active {
                background: #84AE83;
                color: #FFFFFF;
                cursor: pointer;
            }
            #viewer-status-display {
                display: inline-block;
                width: 500px;
                height: 50px;
                line-height: 50px;
                text-align: center;
                background-color: red;
                color: white;
                font-weight: bold;
                border: none;
                margin: 3px 10px;
                user-select: none;
                pointer-events: none;
            }
            #viewer-status-display.viewer-status-loading {
                color: black;
                background-color: white;
                transition: background-color 0s linear;
                animation: turnYellow 2s linear forwards;
            }
            #viewer-status-display.viewer-status-ready {
                background-color: white;
                transition: background-color 0s linear;
                animation: turnGreen 2s linear forwards;
            }
            @keyframes turnYellow {
                0% {
                    background-color: white;
                }
                50% {
                    background-color: yellow;
                }
                100% {
                    background-color: yellow;
                }
            }
            @keyframes turnGreen {
                0% {
                    background-color: white;
                }
                50% {
                    background-color: green;
                }
                100% {
                    background-color: green;
                }
            }
}
        `, 'button-div-css');
    }

    function initViewerCss() {
        addCssToHead(`
			.viewer-container {
				position: fixed;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				z-index: 100100;
				background-color: #000000;
			}
			.viewer-inactive {
			    display: none;
			}
			.viewer-active {
			    display: block;
			}
			button.viewer-navigation-button {
				cursor: pointer;
			}
			.viewer-tag-list {
				position: absolute;
				width: 200px;
				min-width: 50px;
				top: 0;
				left: 0;
				overflow-y: auto;
				height: 100%;
				background-color: #303030;
				opacity: 0.7;
				transition: all 0.5s;
			}
			.viewer-tag-list:hover {
			    opacity: 1;
			}
			.viewer-tag-list a:hover {
			    color: #FFFFFF;
			}
			.viewer-tag-list li {
				list-style-type: none;
				line-height: 1.8em;
				display: block;
				padding-left: 4px;
			}
			.viewer-tag-list * {
				background-color: #303030;
			}
			.viewer-tag-list li > * {
			    margin-right: 0.4em;
			}
			.viewer-tag-list li > span {
			    color: #a0a0a0;
			}
			.viewer-tag-list li.tag-type-general a{
				color: #337ab7;
			}
			.viewer-image-display {
                position: absolute;
                top: 0;
                left: 200px;
                right: 0;
                bottom: 21px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .viewer-image-display * {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
			.viewer-footer-navigation {
                position: absolute;
                bottom: 0px;
                left: 200px;
                width: calc(100% - 200px);
                height: 21px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #000000;
                opacity: 0.2;
            }
			.viewer-footer-navigation:hover {
				opacity: 1;
			}
			.viewer-footer-navigation button {
				color: #FFFFFF;
				background-color: #303030;
				cursor: initial;
				margin: 1px 1px 3px 1px;
				padding: 1px 5px;
				border: 0;
				font-weight: bold;
			}
		`, 'viewer-css');
    }
})();
