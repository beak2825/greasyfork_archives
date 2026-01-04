// ==UserScript==
// @name             Hover Zoom Minus --
// @namespace        Hover Zoom Minus --
// @version          1.0.9.10
// @description      image popup: zoom, pan, scroll, pin, scale
// @author           Ein, Copilot AI
// @match            *://*/*
// @license          MIT
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/489742/Hover%20Zoom%20Minus%20--.user.js
// @updateURL https://update.greasyfork.org/scripts/489742/Hover%20Zoom%20Minus%20--.meta.js
// ==/UserScript==

// 01. to use hover over the image(container) to view a popup of the target image
// 02. to zoom in/out use wheel up/down.
// 03. click left mouse to lock popup this will make it move along with the mouse, click again to release (indicated by green border)
// 04. while being locked"Y" the wheel up/down will act as scroll up/down
// 05. double click will lock it on screen preventing it from being hidden
// 06. hover below the image and click blue bar this will make a 3rd mode for wheel bottom, which will scroll next/previous image under an album
// 07. while locked at screen (indicated by red outline) a single click with the blurred background will unblur it, only one popup per time, so the locked popup will prevent other popup to spawn
// 08. double clicking on blurred background will de-spawn popup
// 09. click on the corner to toggle scaling (blue) will retain current aspect ratio, double clicking will turn to 2nd mode for scaling (magenta) will not retain current aspect ratio
// 10. return to original aspect ration via clicking on sides, if it's in an album to reset to aspect ratio on bottom side use double click
// 11. you can now crop and save the image, just double click the top to initiate.
// 12. to turn on/off hover at the bottom of the page

(function() {
    'use strict';

    // Configuration ----------------------------------------------------------

    // Define regexp of web page you want HoverZoomMinus to run with,
    // 1st array value - default status at start of page: '1' for on, '0' for off
    // 2nd array value - spawn position for popup: 'center' for center of screen, '' for cursor position
    // 3rd array value - allowed interval for spawning popup; i.e. when exited on popup but immediately touches an img container thus making it "blink spawn blink spawn", experiment it with the right number

    const siteConfig = {
        'reddit.com': [1, 'center', '100'],
        '9gag.com': [1, 'center', '0'],
        'feedly.com': [1, 'center', '200'],
        '4chan.org': [1, '', '400'],
        'deviantart.com': [0, 'center', '300'],
        'home': [1, 'center', '0'] /* for testing */
    };

    // image container [hover box where popup triggers]
    const imgContainers = `
    /* ------- reddit */ ._3BxRNDoASi9FbGX01ewiLg, ._3Oa0THmZ3f5iZXAQ0hBJ0k > div, ._35oEP5zLnhKEbj5BlkTBUA, ._1ti9kvv_PMZEF2phzAjsGW > div,
    /* ------- reddit */ ._28TEYBuEdOuE3kN6UyoKMa div, ._3Oa0THmZ3f5iZXAQ0hBJ0k.WjuR4W-BBrvdtABBeKUMx div, ._3m20hIKOhTTeMgPnfMbVNN, zoomable-img.fixed,
    /* --------- 9gag */ .post-container .post-view,
    /* ------- feedly */ .PinableImageContainer, .entryBody,
    /* -------- 4chan */ div.post div.file a,
    /* --- deviantart */ ._3_LJY, ._2e1g3, ._2SlAD, ._1R2x6
    `;
    // target img
    const imgElements = `
    /* ------- reddit */ ._2_tDEnGMLxpM6uOa2kaDB3, ._1dwExqTGJH2jnA-MYGkEL-, ._2_tDEnGMLxpM6uOa2kaDB3._1XWObl-3b9tPy64oaG6fax, zoomable-img.fixed img,
    /* --------- 9gag */ .post-container .post-view > picture > img,
    /* ------- feedly */ .pinable, .entryBody img,
    /* -------- 4chan */ div.post div.file img:nth-child(1), ._3Oa0THmZ3f5iZXAQ0hBJ0k.WjuR4W-BBrvdtABBeKUMx img, div.post div.file .fileThumb img,
    /* --- deviantart */ ._3_LJY img, ._2e1g3 img, ._2SlAD img, ._1R2x6 img
    `;
    // excluded element
    const nopeElements = `
    /* ------- reddit */ ._2ED-O3JtIcOqp8iIL1G5cg
    `;
    // AlbumSelector take note that it will only load image that are already in the DOM tree
    // example reddit will not include all until you press navigator buttons so most of the time this will only load a few image
    // unless you update it via interacting with navigator button thus updating the DOM tree (added new function for navigation it can now update)
    let albumSelector = [
        /* ---reddit */ { imgElement: '._1dwExqTGJH2jnA-MYGkEL-', albumElements: '._1apobczT0TzIKMWpza0OhL' },
        /* ---feedly */ { imgElement: '.entryBody > div > img', albumElements: '.entryBody > div' },
        /* ---feedly */ { imgElement: 'div[id^="Article-"] > div > span > img', albumElements: 'div[id^="Article-"]' },
    ];

    // specialElements were if targeted, will call it's paired function
    // for convenience an element className "specialElement" will be remove during mouseout or function hidepopup() is called you can use that with specialElements function for temporary elements
    const specialElements = [
        /* --- 4chan */ { selector: 'div.post div.file .fileThumb img', func: SP1 },
        /* -- reddit */ { selector: '._1dwExqTGJH2jnA-MYGkEL-', func: SP2 },
        /* -- reddit */ { selector: '._2_tDEnGMLxpM6uOa2kaDB3', func: SP3 },
        /* -- reddit */ { selector: '._2_tDEnGMLxpM6uOa2kaDB3', func: SPunblurSpoiler },
    ];
    // special function triggered when clicking LeftBar/ wheel down in album mode
    const specialLeftBar = [
        /* -- reddit */ { selector: '._1dwExqTGJH2jnA-MYGkEL-', func: SPL }
    ];
    // special function triggered when clicking RightBar/ wheel up in album mode
    const specialRightBar = [
        /* -- reddit */ { selector: '._1dwExqTGJH2jnA-MYGkEL-', func: SPR }
    ];
    //-------------------------------------------------------------------------
    // Special Funtions -------------------------------------------------------


    // 4chan: replaces thumbnail so popup will use the larger version, or if its animated replace it with that
    function SP1(imageElement) {
        const parentElement = imageElement.parentElement;
        const href = parentElement.getAttribute('href');
        if (parentElement.tagName === 'a') {
            if (href.endsWith('.webm')) {
                const videoElement = document.createElement('video');
                videoElement.src = href;
                videoElement.controls = true;
                parentElement.replaceChild(videoElement, imageElement);
            } else {
                imageElement.setAttribute('src', href);
            }
        } else {
            imageElement.setAttribute('src', href);
        }
    }

    // reddit: added the label/description of image along with the popup
    function SP2(imageElement) {
        if (enableP === 0) {
            return;
        }
        let closestElement = imageElement.closest('.m3aNC6yp8RrNM_-a0rrfa, .kcerW9lbT-se3SXd-wp2i');
        if (!closestElement) {
            return;
        }
        let descendantElement = closestElement.querySelector('._15nNdGlBIgryHV04IfAfpA');
        if (descendantElement) {
            document.querySelectorAll('.specialElement').forEach(e => e.remove());
            let title = descendantElement.getAttribute('title');
            const specialContent = document.createElement('div');
            specialContent.className = 'specialElement';
            specialContent.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); width:100vw; text-align:center; font-size:40px; color:white; text-shadow:0 0 10px rgba(255,255,255,0.7); z-index:99999;';
            specialContent.textContent = title;
            document.body.appendChild(specialContent);

            var specialBackdrop = document.createElement('div');
            specialBackdrop.className = 'specialElement';
            specialBackdrop.style.cssText = 'position:fixed; bottom:60px; left:0; width:100vw; height:80px; background:rgba(0,0,0,0.2); backdrop-filter:blur(5px); z-index:99998;';
            document.body.appendChild(specialBackdrop);

        } else {
            return;
        }
    }
    function SP3(imageElement) {
        if (enableP === 0) {
            return;
        }
        let closestElement = imageElement.closest('._2rszc84L136gWQrkwH6IaM');
        if (!closestElement) {
            return;
        }
        let descendantElement = closestElement.querySelector('._1qeIAgB0cPwnLhDF9XSiJM');
        if (descendantElement) {
            console.log('SP3 execute');
            document.querySelectorAll('.specialElement').forEach(e => e.remove());
            let title = descendantElement.innerHTML;
            const specialContent = document.createElement('div');
            specialContent.className = 'specialElement';
            specialContent.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); width:100vw; text-align:center; font-size:40px; color:white; text-shadow:0 0 10px rgba(255,255,255,0.7); z-index:99999;';
            specialContent.textContent = title;
            document.body.appendChild(specialContent);

            var specialBackdrop = document.createElement('div');
            specialBackdrop.className = 'specialElement';
            specialBackdrop.style.cssText = 'position:fixed; bottom:60px; left:0; width:100vw; height:80px; background:rgba(0,0,0,0.2); backdrop-filter:blur(5px); z-index:99998;';
            document.body.appendChild(specialBackdrop);

        } else {
            return;
        }
    }
    function SPL(imageElement) {
        document.querySelectorAll('.specialElement').forEach(e => e.remove());

        let closestElement = imageElement.closest('.kcerW9lbT-se3SXd-wp2i');
        var element = closestElement.querySelector('._1fSFPkxZ9pToLETLQT2dmc');
        if (element) element.click();

        let descendantElement = closestElement.querySelector('._15nNdGlBIgryHV04IfAfpA');
        if (descendantElement) {
            let title = descendantElement.getAttribute('title');
            const specialContent = document.createElement('div');
            specialContent.className = 'specialElement';
            specialContent.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); width:100vw; text-align:center; font-size:40px; color:white; text-shadow:0 0 10px rgba(255,255,255,0.7); z-index:99999;';
            specialContent.textContent = title;
            document.body.appendChild(specialContent);

            var specialBackdrop = document.createElement('div');
            specialBackdrop.className = 'specialElement';
            specialBackdrop.style.cssText = 'position:fixed; bottom:60px; left:0; width:100vw; height:80px; background:rgba(0,0,0,0.2); backdrop-filter:blur(5px); z-index:99998;';
            document.body.appendChild(specialBackdrop);
        } else {
            return;
        }
    }
    function SPR(imageElement) {
        document.querySelectorAll('.specialElement').forEach(e => e.remove());

        let closestElement = imageElement.closest('.kcerW9lbT-se3SXd-wp2i');
        var element = closestElement.querySelector('._3-JCOd-nY76g29C7ZVX_kl:last-child');
        if (element) element.click();

        let descendantElement = closestElement.querySelector('._15nNdGlBIgryHV04IfAfpA');
        if (descendantElement) {
            let title = descendantElement.getAttribute('title');
            const specialContent = document.createElement('div');
            specialContent.className = 'specialElement';
            specialContent.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); width:100vw; text-align:center; font-size:40px; color:white; text-shadow:0 0 10px rgba(255,255,255,0.7); z-index:99999;';
            specialContent.textContent = title;
            document.body.appendChild(specialContent);

            var specialBackdrop = document.createElement('div');
            specialBackdrop.className = 'specialElement';
            specialBackdrop.style.cssText = 'position:fixed; bottom:60px; left:0; width:100vw; height:80px; background:rgba(0,0,0,0.2); backdrop-filter:blur(5px); z-index:99998;';
            document.body.appendChild(specialBackdrop);
        } else {
            return;
        }
    }

    // reddit: unblur spoiler, from https://greasyfork.org/en/scripts/479784-reddit-show-images-marked-with-spoiler-nsfw
    function SPunblurSpoiler(imageElement) {
        const regexIdImg = /https:\/\/.*\/(.*)\?/;

        if (imageElement.src.includes('?blur=')) {
            const idImageElement = imageElement.src.match(regexIdImg)[1];
            imageElement.classList.remove('_3oBPn1sFwq76ZAxXgwRhhn');
            imageElement.src = `https://i.redd.it/${idImageElement}`;
        }

        let descendantElement = imageElement.closest('.m3aNC6yp8RrNM_-a0rrfa');
        if (descendantElement) {
            descendantElement.style.background = '#0000';
            let removeElement = descendantElement.querySelector('._2iaYXFpGyyEGq1rp02cl5w');
            if (removeElement) {
                removeElement.style.display = 'none';
            }
        }
    }

    //-------------------------------------------------------------------------


    // Configuration variables
    const currentHref = window.location.href;
    let enableP, positionP, intervalP, URLmatched;
    Object.keys(siteConfig).some((config) => {
        const regex = new RegExp(config);
        if (currentHref.match(regex)) {
            [enableP, positionP, intervalP] = siteConfig[config];
            URLmatched = true;
            return true;
        }
    });


    // The HoverZoomMinus Function---------------------------------------------
    function HoverZoomMinus() {
        let isshowPopupEnabled = true;
        isshowPopupEnabled = true;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
		.popup-container { display:none; cursor: move; z-index:1001; }
		.popup-image { max-height:calc(90vh - 10px); display:none; }
		.popup-backdrop { position:fixed; top:0; left:0; width:100vw; height:100vh; display:none; z-index:1000; }
        .centerBox { top:40px; left:40px; position:absolute; height:calc(100% - 80px); width:calc(100% - 80px); z-index:9999; }
        .TopBar, .BottomBar, .LeftBar, .RightBar {
	        opacity:0; box-sizing:border-box; background:#0000; position:absolute; z-index:9999;
            &::after { content:""; position:absolute; }
        }
        .TopBar, .BottomBar { height:40px; width:calc(100% - 80px); left:40px;
	        &::after { display:none; width:25px; height:25px; transform:rotate(45deg) translateX(-50%) translateY(-50%); }
        }
        .TopBar { top:0; }
        .BottomBar { bottom:0; }
        .TopBar::after { left:calc(50% - 17px); top:calc(50% + 15px); border-top:5px solid #6f8e9e; border-left:5px solid #6f8e9e; }
        .BottomBar::after { left:calc(50% - 2px); bottom:-8px; border-bottom:5px solid #6f8e9e; border-right: 5px solid #6f8e9e; }
        .LeftBar, .RightBar {
            height:calc(100% - 80px); width:40px; top:40px;
	        &::before { content:""; display:block; position:absolute; top:50%; width:40px; height:40px; transform:translateY(-50%); border-radius:9999px; background: #242526; }
	        &::after { content:""; display:block; position:absolute; top:calc(50% + -2px); width:15px; height:15px; }
            &:hover::before { display:none; }
            &:hover::after { width:25px; height:25px; border-color:#6f8e9e; border-width:5px; }
        }
        .LeftBar { left:0; }
        .RightBar { right:0; }
        .LeftBar::before { left:5px; opacity:0 }
        .RightBar::before { right:5px; opacity:0 }
        .LeftBar:hover::after { left:3px; }
        .RightBar:hover::after { right:3px; }
        .LeftBar::after { transform:rotate(45deg) translateY(-50%); border-bottom:3px solid #777; border-left:3px solid #777; left:12px; opacity:0 }
        .RightBar::after { transform:rotate(-45deg) translateY(-50%); border-bottom: 3px solid #777; border-right:3px solid #777; right:12px; opacity:0 }
        .popup-container:hover { .LeftBar::before, .RightBar::before, .LeftBar::after, .RightBar::after, .CornerBox.TR { opacity:1 }}
        .CornerBox { box-sizing:border-box; height:40px; width:40px; background:#0000; position:absolute; z-index:9999; }
        .CornerBox.TR { top:0; right:0; font-size:11px; text-align:center; line-height:25px; color:white; text-shadow:0 0 4px rgba(255,255,255,0.7); opacity:0 }
        .CornerBox.TL { top:0; left:0; }
        .CornerBox.BR { bottom:0; right:0; }
        .CornerBox.BL { bottom:0; left:0;}
        `;

        document.head.appendChild(style);
        const backdrop = document.createElement('div');
        backdrop.className = 'popup-backdrop';
        document.body.appendChild(backdrop);
        const popupContainer = document.createElement('div');
        popupContainer.className = 'popup-container';
        document.body.appendChild(popupContainer);
        const popup = document.createElement('img');
        popup.className = 'popup-image';
        popupContainer.appendChild(popup);

        const BottomBar = document.createElement('div');
        BottomBar.className = 'BottomBar';
        popupContainer.appendChild(BottomBar);
        const TopBar = document.createElement('div');
        TopBar.className = 'TopBar';
        popupContainer.appendChild(TopBar);
        const RightBar = document.createElement('div');
        RightBar.className = 'RightBar';
        popupContainer.appendChild(RightBar);
        const LeftBar = document.createElement('div');
        LeftBar.className = 'LeftBar';
        popupContainer.appendChild(LeftBar);

        const TR = document.createElement('div');
        TR.className = 'CornerBox TR';
        popupContainer.appendChild(TR);
        const TL = document.createElement('div');
        TL.className = 'CornerBox TL';
        popupContainer.appendChild(TL);
        const BR = document.createElement('div');
        BR.className = 'CornerBox BR';
        popupContainer.appendChild(BR);
        const BL = document.createElement('div');
        BL.className = 'CornerBox BL';
        popupContainer.appendChild(BL);

        const centerBox = document.createElement('div');
        centerBox.className = 'popup centerBox';
        popupContainer.appendChild(centerBox);

        const style2 = document.createElement('style');
        style2.type = 'text/css';
        document.head.appendChild(style2);



        //-------------------------------------------------------------------------

        // Variable
        const ZOOM_SPEED = 0.005;
        let pageDirection;
        let isLockedY = false;
        let isLockedX = false;
        let scale = 1;
        let clickTimeout;
        let popupTimer;
        let isScale, isScaleTR, isScaleBR, isScaleTL, isScaleBL;
        let rect, rectT, rectH, rectL, rectW;
        let rectIH, rectIW, rectIT, rectIL, rectIRatio;
        let rectzT, rectzH, rectzL, rectzW, rectzRatio;
        let scaleCurrentX, scaleCurrentY;
        let scaleFactorX, scaleFactorY;
        let offsetX, offsetY, offsetXR, offsetYT, offsetXL, offsetYB;
        let offsetRatioY, offsetRatioX;
        let ishidePopupEnabled = true;
        let ScaleMode2 = false;
        let imgElementsList = [];
        let currentZeroImgElement;
        let rectIzRatio;

        function NoMode() {
            isLockedY = false;
            isLockedX = false;
            isScale = false;
            isScaleTR = false;
            isScaleTL = false;
            isScaleBL = false;
            isScaleBR = false;
            popupContainer.style.border = '';
            TR.style.border = '';
            BR.style.border = '';
            TL.style.border = '';
            BL.style.border = '';
        }

        function LockedYMode() {
            NoMode();
            isLockedY = true;
            popupContainer.style.borderLeft = '6px solid #00ff00';
            popupContainer.style.borderRight = '6px solid #00ff00';
            LeftBar.style.opacity = '0';
            RightBar.style.opacity = '0';
            LeftBar.style.display = '';
            RightBar.style.display = '';
        }
        function LockedXMode() {
            NoMode();
            LockedScreen();
            isLockedX = true;
            popupContainer.style.borderTop = '6px solid #00ff00';
            popupContainer.style.borderBottom = '6px solid #00ff00';
            LeftBar.style.opacity = '1';
            RightBar.style.opacity = '1';
            style2.innerHTML = `.LeftBar::before, .LeftBar::after, .RightBar::before, .RightBar::after { display:block; }`;
        }

        function toggleLockedScreen(event) {
            ishidePopupEnabled = !ishidePopupEnabled;
            popupContainer.style.outline = ishidePopupEnabled ? '' : '6px solid #ae0001';
        }

        function LockedScreen() {
            ishidePopupEnabled = false;
            popupContainer.style.outline = '6px solid #ae0001';
        }

        function ScalingMode1() {
            TL.style.borderTop = '6px solid #0000ff';
            TR.style.borderTop = '6px solid #0000ff';
            TL.style.borderLeft = '6px solid #0000ff';
            BL.style.borderLeft = '6px solid #0000ff';
            TR.style.borderRight = '6px solid #0000ff';
            BR.style.borderRight = '6px solid #0000ff';
            BR.style.borderBottom = '6px solid #0000ff';
            BL.style.borderBottom = '6px solid #0000ff';
        }
        function ScalingMode2() {
            ScalingMode1();
            TL.style.borderColor = '#ff00ff';
            TR.style.borderColor = '#ff00ff';
            BL.style.borderColor = '#ff00ff';
            BR.style.borderColor = '#ff00ff';
        }
        function ScalingMode0() {
            TL.style.border = '';
            TR.style.border = '';
            BL.style.border = '';
            BR.style.border = '';
        }

        function ResetGeometry() {
            let rectF = popup.getBoundingClientRect();
            rectzH = rectF.height;
            rectzW = rectF.width;
            rectzT = rectF.top;
            rectzL = rectF.left;
            popup.style.maxHeight = rectzH + 'px';
            popup.style.height = rectzH + 'px';
            popup.style.width = rectzW + 'px';
            popupContainer.style.top = rectzT + (rectzH / 2) + 'px';
            popupContainer.style.left = rectzL + (rectzW / 2) + 'px';
            popupContainer.style.transformOrigin = '50% 50% 0px';
            popupContainer.style.transform = `translate(-50%, -50%) scaleX(1) scaleY(1)`;
        }

        function BarClear() {
            TL.style.border = '';
            TR.style.border = '';
            BL.style.border = '';
            BR.style.border = '';
            TL.style.background = '';
            TR.style.background = '';
            BL.style.background = '';
            BR.style.background = '';
            TopBar.style.background = '';
            LeftBar.style.background = '';
            RightBar.style.background = '';
            BottomBar.style.background = '';
            popupContainer.style.border = '';
            LeftBar.style.opacity = '0';
            RightBar.style.opacity = '0';
        }


        const loadingIcon = document.createElement('div');

        function NavigateAlbum() {
            let pair = albumSelector.find(pair => currentZeroImgElement.matches(pair.imgElement));
            if (pair) {
                let ancestorElement = currentZeroImgElement.closest(pair.albumElements);
                if (ancestorElement) {
                    imgElementsList = Array.from(ancestorElement.querySelectorAll(pair.imgElement));
                    let zeroIndex = imgElementsList.indexOf(currentZeroImgElement);
                    let direction = pageDirection;
                    let newIndex = zeroIndex + direction;
                    TR.textContent = `${newIndex + 1}/${imgElementsList.length}`;


                    document.querySelectorAll('.loadingIcon').forEach(e => e.remove())


                    if (newIndex <= 0) {
                        LeftBar.style.display = 'none';
                        TR.textContent = `1/${imgElementsList.length}`;
                    } else {
                        LeftBar.style.display = '';
                    }
                    if (newIndex >= imgElementsList.length - 1) {
                        RightBar.style.display = 'none';
                        TR.textContent = `${imgElementsList.length}/${imgElementsList.length}`;
                    } else {
                        RightBar.style.display = '';
                    }
                    if (newIndex < 0 || newIndex >= imgElementsList.length) {
                        return;
                    }

                    const loadingIcon = document.createElement('div');
                    loadingIcon.className = 'loadingIcon'
                    popupContainer.appendChild(loadingIcon);
                    loadingIcon.style.display = 'none';
                    loadingIcon.style.transition = 'transform 0.1s linear';
                    loadingIcon.style.cssText = 'position:absolute; transform:translateZ(0); z-index:9999; font-size:55px; height:40px; width:40px; line-height:40px; top:calc(50% - 20px); left:calc(50% - 20px); background:url("chrome://global/skin/icons/reload.svg"); background-repeat:no-repeat; background-size:contain; filter:invert(.8);';
                    loadingIcon.style.color = '#0000';;
                    currentZeroImgElement = imgElementsList[newIndex];
                    var img = new Image();
                    function rotateLoadingIcon() {
                        var angle = parseFloat(loadingIcon.getAttribute('data-angle')) || 0;
                        angle += 27;
                        loadingIcon.style.transform = 'rotate(' + angle + 'deg)';
                        loadingIcon.setAttribute('data-angle', angle);
                        loadingIcon.style.color = '#777';
                    }
                    var rotationInterval = setInterval(rotateLoadingIcon, 100);

                    img.onload = function() {

                        document.querySelectorAll('.loadingIcon').forEach(e => e.remove())
                        clearInterval(rotationInterval);

                        let natHeight = img.naturalHeight;
                        let vh = window.innerHeight / 100;
                        let rect = popup.getBoundingClientRect();
                        let rectH = rect.height;
                        if ((natHeight > ((90 * vh) - 10)) || (rectH > ((90 * vh) - 10))) {
                            popup.style.maxHeight = (90 * vh) - 10 + 'px';
                            popup.style.width = '';
                            popupContainer.style.top = '50%';
                        } else {
                            popup.style.height = '';
                            popup.style.maxHeight = 'unset';
                        }
                    };

                    img.onerror = function() {
                        loadingIcon.style.display = 'none';
                        clearInterval(rotationInterval);
                    };
                    loadingIcon.style.display = 'block';

                    popup.src = currentZeroImgElement.src;
                    img.src = popup.src;
                }
            }
        }

        // Mouse Click: Center
        centerBox.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                ResetGeometry();
                if (!isScale) {
                    isLockedY = !isLockedY;
                }
                if (isLockedY) {
                    LockedYMode();
                    let rect = popupContainer.getBoundingClientRect();
                    offsetX = event.clientX - rect.left - (rect.width / 2);
                    offsetY = event.clientY - rect.top - (rect.height / 2);
                } else {
                    NoMode();
                }
            }, 300);
        });

        centerBox.addEventListener('dblclick', function(event) {
            clearTimeout(clickTimeout);
            toggleLockedScreen();
            if (!ishidePopupEnabled) {
                backdrop.style.display = 'block';
                backdrop.style.zIndex = '999';
                backdrop.style.backdropFilter = 'blur(10px)';
            }
        });
        //-------------------------------------------------------------------------

        // Mouse Click: Corners
        document.querySelectorAll('.CornerBox').forEach(element => {
            element.addEventListener('click', function(event) {
                ishidePopupEnabled = false;
                if (isScale) {
                    BarClear();
                    isLockedY = false;
                    isLockedX = false;
                    popup.style.border = '';

                    const clickedElement = event.target;
                    const popupContainer = clickedElement.parentElement;
                    const currentTransform = window.getComputedStyle(popupContainer).transform;
                    const matrixMatch = currentTransform.match(/^matrix\(([^,]+), [^,]+, [^,]+, ([^,]+), [^,]+, [^,]+\)$/);
                    if (matrixMatch) {
                        scaleCurrentX = parseFloat(matrixMatch[1]);
                        scaleCurrentY = parseFloat(matrixMatch[2]);
                    }

                    let rect = popupContainer.getBoundingClientRect();
                    offsetYT = event.clientY - rect.top;
                    offsetXL = event.clientX - rect.left;
                    offsetYB = rect.height + rect.top - event.clientY;
                    offsetXR = rect.width + rect.left - event.clientX;

                    rectT = rect.top;
                    rectL = rect.left;
                    rectH = rect.height;
                    rectW = rect.width;

                } else {
                    LockedScreen();
                    ResetGeometry();
                }

            });
        });
        document.querySelectorAll('.CornerBox').forEach(element => {
            element.addEventListener('click', function(event) {
                if (clickTimeout) clearTimeout(clickTimeout);
                isScale = !isScale;
            }, 300);
        });
        document.querySelectorAll('.CornerBox').forEach(element => {
            element.addEventListener('dblclick', function(event) {
                clearTimeout(clickTimeout);
                ScaleMode2 = !ScaleMode2;
            });
        });

        TL.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                isScaleTL = !isScaleTL;
                isScaleTR = false;
                isScaleBL = false;
                isScaleBR = false;
                LeftBar.style.display = '';
                RightBar.style.display = '';
            }, 300);
        });
        TR.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                isScaleTL = false;
                isScaleTR = !isScaleTR;
                isScaleBL = false;
                isScaleBR = false;
                LeftBar.style.display = '';
                RightBar.style.display = '';
            }, 300);
        });
        BL.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                isScaleTL = false;
                isScaleTR = false;
                isScaleBL = !isScaleBL;
                isScaleBR = false;
                LeftBar.style.display = '';
                RightBar.style.display = '';
            }, 300);
        });
        BR.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                isScaleTL = false;
                isScaleTR = false;
                isScaleBL = false;
                isScaleBR = !isScaleBR;
                LeftBar.style.display = '';
                RightBar.style.display = '';
            }, 300);
        });
        //-------------------------------------------------------------------------


        // Mouse Move: Pan, Scale
        document.addEventListener('mousemove', function(event) {
            // Panning mode: popup locked and follows the mouse
            if (isLockedY) {
                popupContainer.style.left = (event.clientX - offsetX) + 'px';
                popupContainer.style.top = (event.clientY - offsetY) + 'px';

            } else if (isScale) {
                ScalingMode1();
                if (ScaleMode2) {
                    ScalingMode2();
                }

                if (isScaleTL) {
                    popupContainer.style.transformOrigin = '100% 100% 0px';
                    scaleFactorY = scaleCurrentY * (1 + (rectT - event.clientY + offsetYT) / rectH);
                    scaleFactorX = scaleCurrentX * (1 + (rectL - event.clientX + offsetXL) / rectW);
                } else if (isScaleTR) {
                    popupContainer.style.transformOrigin = '0 100% 0px';
                    scaleFactorY = scaleCurrentY * (1 + (rectT - event.clientY + offsetYT) / rectH);
                    scaleFactorX = scaleCurrentX * ((event.clientX - rectL + offsetXR) / rectW);
                } else if (isScaleBL) {
                    popupContainer.style.transformOrigin = '100% 0% 0px';
                    scaleFactorY = scaleCurrentY * ((event.clientY - rectT + offsetYB) / rectH);
                    scaleFactorX = scaleCurrentX * (1 + (rectL - event.clientX + offsetXL) / rectW);
                } else if (isScaleBR) {
                    popupContainer.style.transformOrigin = '0% 0% 0px';
                    scaleFactorY = scaleCurrentY * ((event.clientY - rectT + offsetYB) / rectH);
                    scaleFactorX = scaleCurrentX * ((event.clientX - rectL + offsetXR) / rectW);
                }
                if (ScaleMode2) {
                    popupContainer.style.transform = `translate(-50%, -50%) scaleX(${scaleFactorX}) scaleY(${scaleFactorY})`;

                } else {
                    popupContainer.style.transform = `translate(-50%, -50%) scaleX(${scaleFactorX}) scaleY(${scaleFactorX})`;
                }
            }
        });


        // Mouse Wheel: Zoom, Scroll, Navigate
        function ZoomOrScroll(event) {
            event.preventDefault();
            if (isLockedY) {
                let deltaY = event.deltaY * -ZOOM_SPEED;
                let newTop = parseInt(popupContainer.style.top) || 0;
                newTop += deltaY * 100;
                popupContainer.style.top = newTop + 'px';
                offsetY -= deltaY * 100;

            } else if (isLockedX && currentZeroImgElement) {
                pageDirection = event.deltaY > 0 ? 1 : -1;
                NavigateAlbum();

                if (pageDirection === 1) {
                    const imageElement = currentContainer.querySelector(imgElements);
                    specialRightBar.forEach(pair => {
                        if (imageElement.matches(pair.selector)) {
                            pair.func(imageElement);
                        }
                    });
                } else {
                    const imageElement = currentContainer.querySelector(imgElements);
                    specialLeftBar.forEach(pair => {
                        if (imageElement.matches(pair.selector)) {
                            pair.func(imageElement);
                        }
                    });
                }

            } else {
                scale += event.deltaY * -ZOOM_SPEED;
                scale = Math.min(Math.max(0.125, scale), 10);
                popupContainer.style.transform = `translate(-50%, -50%) scaleX(${scale}) scaleY(${scale})`;
            }
        }
        popupContainer.addEventListener('wheel', ZoomOrScroll);
        //-------------------------------------------------------------------------


        // Bottom Bar: Album
        BottomBar.addEventListener('mouseenter', function(e) {

            if (isScale) {
                return;
            } else {
                BottomBar.style.opacity = '1';

                let rect = popup.getBoundingClientRect();
                rectzRatio = rect.height / rect.width;
                rectIzRatio = Number(rectIRatio.toFixed(3)) / Number(rectzRatio.toFixed(3));

                if (isAlbum) {
                    if (!isScale) {
                        BottomBar.style.background = 'linear-gradient(to right, rgba(0, 0, 255, 0) 0%, rgba(0, 0, 255, 0.5) 25%, rgba(0, 0, 255, 0.5) 75%, rgba(0, 0, 255, 0) 100%)';
                    }
                } else {
                    BottomBar.style.background = '';
                    if (!( (rectIzRatio === 1) || isScale ) ) {
                        style2.innerHTML = `
                            .BottomBar::after {
                                display: block;
                            }
                        `;
                        BL.style.background = 'rgba(0, 0, 0, 0.5)';
                        BR.style.background = 'rgba(0, 0, 0, 0.5)';
                        BottomBar.style.background = 'rgba(0, 0, 0, 0.5)';
                    } else {
                        style2.innerHTML = `
                            .BottomBar::after {
                                display: none;
                            }
                        `;
                    }
                }
            }
        });

        BottomBar.addEventListener('mouseleave', function() {
            BottomBar.style.opacity = '0';
            if (!isLockedX) {
                BarClear();
            }
        });

        BottomBar.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                if (!isScale) {
                    LeftBar.style.opacity = '0';
                    RightBar.style.opacity = '0';
                }
                if (isAlbum) {
                    ResetGeometry();
                    var img = new Image();
                    img.onload = function() {
                        natHeight = img.naturalHeight;
                        natWidth = img.naturalWidth;
                    };
                    img.src = popup.src
                    rectIRatio = natHeight / natWidth;
                    isLockedX = !isLockedX;
                    if (isLockedX) {
                        LockedXMode();
                        LeftBar.style.opacity = '1';
                        RightBar.style.opacity = '1';
                    } else {
                        popupContainer.style.border = '';
                        LeftBar.style.display = '';
                        RightBar.style.display = '';
                    }
                    let pair = albumSelector.find(pair => currentZeroImgElement.matches(pair.imgElement));
                    if (pair) {
                        let ancestorElement = currentZeroImgElement.closest(pair.albumElements);
                        if (ancestorElement) {
                            imgElementsList = Array.from(ancestorElement.querySelectorAll(pair.imgElement));
                            let zeroIndex = imgElementsList.indexOf(currentZeroImgElement);
                            if (zeroIndex <= 0) {
                                LeftBar.style.display = 'none';
                            } else {
                                LeftBar.style.display = '';
                            }
                            if (zeroIndex >= imgElementsList.length - 1) {
                                RightBar.style.display = 'none';
                            } else {
                                RightBar.style.display = '';
                            }
                        }
                    }
                } else {
                    ResetGeometry();
                    if (isScale) {
                        isScale = false;
                        popup.style.maxHeight = rectzH + 'px';
                        popup.style.height = rectzH + 'px';
                        offsetRatioY = 0;
                    } else {
                        popup.style.maxHeight = 'unset';
                        popup.style.height = '';
                        offsetRatioY = (rectzH - rectzW * rectIRatio) / 2 ;
                    }
                    popupContainer.style.top = rectzT + (rectzH / 2) + offsetRatioY + 'px';
                }
            }, 300);
        });

        BottomBar.addEventListener('dblclick', function(event) {
            clearTimeout(clickTimeout);
            if (isAlbum) {
                ResetGeometry();
                var img = new Image();
                img.onload = function() {
                    natHeight = img.naturalHeight;
                    natWidth = img.naturalWidth;
                };
                img.src = popup.src
                rectIRatio = natHeight / natWidth;
                if (isScale) {
                    popup.style.maxHeight = rectzH + 'px';
                    popup.style.height = rectzH + 'px';
                    offsetRatioY = 0;
                } else {
                    popup.style.maxHeight = 'unset';
                    popup.style.height = '';
                    offsetRatioY = (rectzH - rectzW * rectIRatio) / 2 ;
                }
                popupContainer.style.top = rectzT + (rectzH / 2) + offsetRatioY + 'px';
                BarClear();
            } else {
                return;
            }
        });
        //-------------------------------------------------------------------------


        // Indicators
        document.querySelectorAll('.CornerBox').forEach(element => {
            element.addEventListener('mouseenter', function(event) {
                ScalingMode1();
                if (ScaleMode2) {
                    ScalingMode2();
                }
            });
            element.addEventListener('mouseleave', function(event) {
                if (!isScale) {
                    ScalingMode0();
                }
            });
        });

        // Re-scale/ Navigate
        TopBar.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                ResetGeometry();
                if (isAlbum) {
                    var img = new Image();
                    img.onload = function() {
                        natHeight = img.naturalHeight;
                        natWidth = img.naturalWidth;
                    };
                    img.src = popup.src
                    rectIRatio = natHeight / natWidth;
                }
                if (isScale) {
                    isScale = false;
                    popup.style.maxHeight = rectzH + 'px';
                    popup.style.height = rectzH + 'px';
                    offsetRatioY = 0;
                } else {
                    popup.style.maxHeight = 'unset';
                    popup.style.height = '';
                    offsetRatioY = (rectzH - rectzW * rectIRatio) / 2 ;
                }
                popupContainer.style.top = rectzT + (rectzH / 2) - offsetRatioY + 'px';
                BarClear();

            }, 300);
        });

        const styleCrop = document.createElement('style');
        styleCrop.type = 'text/css';
        styleCrop.innerHTML = `.cropArea1,.cropArea2,.cropArea3,.cropArea4 { display:none; }`;
        const CropCover = document.createElement('div');
        const cropArea1 = document.createElement('div');
        const cropArea2 = document.createElement('div');
        const cropArea3 = document.createElement('div');
        const cropArea4 = document.createElement('div');

        let clickX1, clickY1, clickX2, clickY2;
        let clickCount;
        let cropAreaSet = false;

        TopBar.addEventListener('dblclick', function(event) {
            clearTimeout(window.clickTimeout);

            LockedScreen();
            clickCount = 0;
            ResetGeometry()
            cropAreaSet = false;

            const CropCover = document.createElement('div');
            const cropArea1 = document.createElement('div');
            const cropArea2 = document.createElement('div');
            const cropArea3 = document.createElement('div');
            const cropArea4 = document.createElement('div');
            CropCover.className = 'CropCover'
            cropArea1.className = 'cropArea1';
            cropArea2.className = 'cropArea2';
            cropArea3.className = 'cropArea3';
            cropArea4.className = 'cropArea4';
            popupContainer.appendChild(CropCover);
            document.body.appendChild(cropArea1);
            document.body.appendChild(cropArea2);
            document.body.appendChild(cropArea3);
            document.body.appendChild(cropArea4);
            CropCover.style.cssText = 'position:absolute; transform:translateZ(0); top:0; left:0; box-sizing:border-box; height:100%; width:100%; z-index:99999; border:1px solid yellow;';
            cropArea1.style.cssText ='display: block; z-index: 9999; position: fixed; background: rgba(0, 0, 0, 0.4);';
            cropArea2.style.cssText ='display: block; z-index: 9999; position: fixed; background: rgba(0, 0, 0, 0.4);';
            cropArea3.style.cssText ='display: block; z-index: 9999; position: fixed; background: rgba(0, 0, 0, 0.4);';
            cropArea4.style.cssText ='display: block; z-index: 9999; position: fixed; background: rgba(0, 0, 0, 0.4);';

            let rect = popup.getBoundingClientRect();
            rectzH = rect.height;
            rectzW = rect.width;
            rectzT = rect.top;
            rectzL = rect.left;

            let clickTimeout;

            CropCover.addEventListener('click', function(e) {
                if (clickCount === 0) {
                    clickX1 = e.clientX;
                    clickY1 = e.clientY;
                    clickCount = 1;
                } else if (clickCount === 1) {
                    clickCount = 2;
                    clickX2 = e.clientX;
                    clickY2 = e.clientY;
                    cropAreaSet = true;
                    if (clickCount === 2) {
                        cropImage();
                    }
                }
            });

            document.addEventListener('mousemove', function(event) {

                cropArea1.style.left = '0px';
                cropArea1.style.top = '0px';
                cropArea1.style.height = '100vh';

                cropArea2.style.top = '0px';


                if (clickCount === 0) {
                    cropArea1.style.width = event.clientX + 'px';

                    cropArea2.style.left = event.clientX + 'px';
                    cropArea2.style.height = event.clientY + 'px';
                    cropArea2.style.width = `calc(100vw - ${event.clientX}px)`;


                } else if (clickCount === 1) {
                    cropArea1.style.width = clickX1 + 'px';

                    cropArea2.style.left = clickX1 + 'px';
                    cropArea2.style.height = clickY1 + 'px';
                    cropArea2.style.width = `calc(100vw - ${clickX1}px)`;


                }
                if (!cropAreaSet && (clickCount === 1)) {
                    cropArea3.style.left = clickX1 + 'px';
                    cropArea3.style.top = event.clientY + 1 + 'px';
                    cropArea3.style.width = `calc(${event.clientX}px + 1px - ${clickX1}px)`;
                    cropArea3.style.height = `calc(100vh - 1px - ${event.clientY}px)`;

                    cropArea4.style.left = event.clientX + 1 + 'px';
                    cropArea4.style.top = clickY1 + 'px'
                    cropArea4.style.height = `calc(100vh - 1px - ${clickY1}px)`;
                    cropArea4.style.width = `calc(100vw - 1px - ${event.clientX}px)`;


                }
            });

        });

        function cropImage() {
            var canvas = document.createElement('canvas');
            canvas.id = 'cropCanvas';
            var ctx = canvas.getContext('2d');
            document.body.appendChild(canvas);
            let cropX, cropY, cropW, cropH, scW, scH

            scW = clickX2 - clickX1
            scH = clickY2 - clickY1
            cropX = natWidth * ((clickX1 - rectzL) / rectzW);
            cropY = natHeight * ((clickY1 - rectzT) / rectzH);
            cropW = natWidth * (scW / rectzW);
            cropH = natHeight * (scH / rectzH);
            canvas.width = scW;
            canvas.height = scH;

            var image = new Image();
            image.crossOrigin = "anonymous";
            image.src = popup.src
            image.onload = function() {
                ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, scW, scH);
                saveImage(canvas);
            }

            document.querySelectorAll('.CropCover').forEach(e => e.remove())
        }

        function saveImage(canvas) {
            if (confirm('Do you want to save the image?')) {
                var croppedImageDataURL = canvas.toDataURL('image/png');
                var originalFileName = popup.src.split('/').pop();
                var truncatedFileName = originalFileName.length > 100 ? originalFileName.substring(0, 100) : originalFileName;
                var downloadLink = document.createElement('a');
                downloadLink.href = croppedImageDataURL;
                downloadLink.download = truncatedFileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
            }

            clickCount = 0;
            cropAreaSet = false;
            document.querySelectorAll('.cropArea1').forEach(e => e.remove())
            document.querySelectorAll('.cropArea2').forEach(e => e.remove())
            document.querySelectorAll('.cropArea3').forEach(e => e.remove())
            document.querySelectorAll('.cropArea4').forEach(e => e.remove())
            document.body.removeChild(downloadLink);
            var removecropCanvas = document.getElementById('cropCanvas');
            removecropCanvas.remove();

        }


        let zeroIndex;
        LeftBar.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                ResetGeometry();
                if (isAlbum) {
                    var img = new Image();
                    img.onload = function() {
                        natHeight = img.naturalHeight;
                        natWidth = img.naturalWidth;
                    };
                    img.src = popup.src
                    rectIRatio = natHeight / natWidth;
                }
                if (isScale) {
                    isScale = false;
                    popup.style.width = rectzW + 'px';
                    offsetRatioX = 0;
                } else {
                    popup.style.width = '';
                    offsetRatioX = (rectzW - (rectzH / rectIRatio)) / 2 ;
                }
                if (isLockedX && currentZeroImgElement) {
                    pageDirection = -1;
                    NavigateAlbum();
                    TL.style.background = 'rgba(0, 0, 0, 0.5)';
                    BL.style.background = 'rgba(0, 0, 0, 0.5)';
                    LeftBar.style.background = 'rgba(0, 0, 0, 0.5)';

                    const imageElement = currentContainer.querySelector(imgElements);
                    specialLeftBar.forEach(pair => {
                        if (imageElement.matches(pair.selector)) {
                            pair.func(imageElement);
                        }
                    });
                } else {
                    popupContainer.style.left = rectzL + (rectzW / 2) - offsetRatioX + 'px';
                }
            }, 300);
        });
        RightBar.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                ResetGeometry();
                if (isAlbum) {
                    var img = new Image();
                    img.onload = function() {
                        natHeight = img.naturalHeight;
                        natWidth = img.naturalWidth;
                    };
                    img.src = popup.src
                    rectIRatio = natHeight / natWidth;
                }
                if (isScale) {
                    isScale = false;
                    popup.style.width = rectzW + 'px';
                    offsetRatioX = 0;
                } else {
                    popup.style.width = '';
                    offsetRatioX = (rectzW - (rectzH / rectIRatio)) / 2 ;
                }
                if (isLockedX && currentZeroImgElement) {
                    pageDirection = 1;
                    NavigateAlbum();
                    TR.style.background = 'rgba(0, 0, 0, 0.5)';
                    BR.style.background = 'rgba(0, 0, 0, 0.5)';
                    RightBar.style.background = 'rgba(0, 0, 0, 0.5)';

                    const imageElement = currentContainer.querySelector(imgElements);
                    specialRightBar.forEach(pair => {
                        if (imageElement.matches(pair.selector)) {
                            pair.func(imageElement);
                        }
                    });
                } else {
                    popupContainer.style.left = rectzL + (rectzW / 2) + offsetRatioX + 'px';
                }
            }, 300);
        });

        TopBar.addEventListener('mouseenter', function() {

            var img = new Image();
            img.onload = function() {
                natHeight = img.naturalHeight;
                natWidth = img.naturalWidth;
            };
            img.src = popup.src
            let rectZ = popup.getBoundingClientRect();
            let rectZH = rectZ.height;
            let rectZW = rectZ.width;
            let rectZRatio = rectZH / rectZW;
            let natRatio = natHeight / natWidth;
            let rectNZRatio = Number(natRatio.toFixed(3)) / Number(rectZRatio.toFixed(3));
            // not original Ratio and not scaling mode aplly with arrow indicator
            if (!((rectNZRatio === 1) || isScale )) {

                TopBar.style.opacity = '1';
                TL.style.background = 'rgba(0, 0, 0, 0.5)';
                TR.style.background = 'rgba(0, 0, 0, 0.5)';
                TopBar.style.background = 'rgba(0, 0, 0, 0.5)';

                style2.innerHTML = `.TopBar::after { display: block; }`;

            } else {
                style2.innerHTML = `.TopBar::after { display: none; }`;
            }
        });
        LeftBar.addEventListener('mouseenter', function() {
            LeftBar.style.opacity = '1';
            let rect = popup.getBoundingClientRect();
            rectzRatio = rect.height / rect.width;
            rectIzRatio = Number(rectIRatio.toFixed(3)) / Number(rectzRatio.toFixed(3));
            if ( isLockedX || !( (rectIzRatio === 1) || isScale ) ) {
                style2.innerHTML = `
                .LeftBar::before, .LeftBar::after {
                display: block;
                }`;
                TL.style.background = 'rgba(0, 0, 0, 0.5)';
                BL.style.background = 'rgba(0, 0, 0, 0.5)';
                LeftBar.style.background = 'rgba(0, 0, 0, 0.5)';
            } else {
                style2.innerHTML = `
                .LeftBar::before, .LeftBar::after {
                display: none;
                }`;
            }
        });
        RightBar.addEventListener('mouseenter', function() {
            RightBar.style.opacity = '1';
            let rect = popup.getBoundingClientRect();
            rectzRatio = rect.height / rect.width;
            rectIzRatio = Number(rectIRatio.toFixed(3)) / Number(rectzRatio.toFixed(3));
            if ( isLockedX || !( (rectIzRatio === 1) || isScale ) ) {
                style2.innerHTML = `
                .RightBar::before, .RightBar::after {
                display: block;
                }`;
                TR.style.background = 'rgba(0, 0, 0, 0.5)';
                BR.style.background = 'rgba(0, 0, 0, 0.5)';
                RightBar.style.background = 'rgba(0, 0, 0, 0.5)';
            } else {
                style2.innerHTML = `
                .RightBar::before, .RightBar::after {
                display: none;
                }`;
            }
        });

        TopBar.addEventListener('mouseleave', function() {
            TopBar.style.opacity = '0';
            TL.style.background = '';
            TR.style.background = '';
        });
        LeftBar.addEventListener('mouseleave', function() {
            if (isLockedX) {
                LeftBar.style.opacity = '1';
            } else {
                LeftBar.style.opacity = '0';
            }
            TL.style.background = '';
            BL.style.background = '';
            LeftBar.style.background = '';
        });
        RightBar.addEventListener('mouseleave', function() {
            if (isLockedX) {
                RightBar.style.opacity = '1';
            } else {
                RightBar.style.opacity = '0';
            }
            TR.style.background = '';
            BR.style.background = '';
            RightBar.style.background = '';
        });
        //-------------------------------------------------------------------------

        let natXratio, natYratio, natHeight, natWidth;

        // show popup
        function showPopup(src, mouseX, mouseY) {
            console.log('isshowPopupEnabled:', isshowPopupEnabled);
            if (!isshowPopupEnabled) return;
            if (enableP === 0) return;

            ishidePopupEnabled = true;

            popup.src = src;
            popup.style.display = 'block';
            popupContainer.style.display = 'block';
            popupContainer.style.position = 'fixed';
            popupContainer.style.transform = 'translate(-50%, -50%) scaleX(1) scaleY(1)';
            backdrop.style.display = 'block';
            backdrop.style.zIndex = '999';
            backdrop.style.backdropFilter = 'blur(10px)';

            if (positionP === 'center') {
                popupContainer.style.top = '50%';
                popupContainer.style.left = '50%';
            } else {
                popupContainer.style.top = `${mouseY}px`;
                popupContainer.style.left = `${mouseX}px`;
            }

            let rectI = popup.getBoundingClientRect();
            rectIH = rectI.height;
            rectIW = rectI.width;
            rectIT = rectI.top;
            rectIL = rectI.left;

            var img = new Image();
            img.onload = function() {
                natHeight = img.naturalHeight;
                natWidth = img.naturalWidth;
            };
            img.src = popup.src

            natXratio = natWidth / rectIW;
            natYratio = natHeight / rectIH;
            rectIRatio = rectIH / rectIW;

            if (positionP === '') {
                if (mouseY < window.innerHeight * 0.33) {
                    popupContainer.style.top = mouseY + (rectIH / 2) - 40 + 'px';
                } else if (mouseY >= window.innerHeight * 0.33 && mouseY < window.innerHeight * 0.67) {
                    popupContainer.style.top = mouseY + 'px';
                } else if (mouseY >= window.innerHeight * 0.67) {
                    popupContainer.style.top = mouseY - (rectIH / 2) + 40 + 'px';
                }
                if (mouseX < window.innerWidth * 0.33) {
                    popupContainer.style.left = mouseX + (rectIW / 2) - 40 + 'px';
                } else if (mouseX >= window.innerWidth * 0.33 && mouseX < window.innerWidth * 0.67) {
                    popupContainer.style.left = mouseX + 'px';
                } else if (mouseX >= window.innerWidth * 0.67) {
                    popupContainer.style.left = mouseX - (rectIW / 2) + 40 + 'px';
                }
            }
            if (isAlbum) {
                LockedXMode();
            }

        }

        let isAlbum;
        let currentContainer;
        document.addEventListener('mouseover', function(e) {
            if (popupTimer) return;

            let target = e.target.closest(imgContainers);
            let relatedTarget = event.relatedTarget;

            if (target.querySelector(nopeElements)) return;
            currentContainer = target;
            const imageElement = currentContainer.querySelector(imgElements);
            specialElements.forEach(pair => {
                if (imageElement.matches(pair.selector)) {
                    pair.func(imageElement);
                }
            });
            if (imageElement) {
                currentZeroImgElement = imageElement;
                if (currentZeroImgElement) {
                    let pair = albumSelector.find(pair => currentZeroImgElement.matches(pair.imgElement));
                    if (pair) {
                        let closestAlbumElement = currentZeroImgElement.closest(pair.albumElements);
                        isAlbum = closestAlbumElement && closestAlbumElement.querySelectorAll(pair.imgElement).length > 1;
                        if (isAlbum) {
                            imgElementsList = Array.from(closestAlbumElement.querySelectorAll(pair.imgElement));
                            let zeroIndex = imgElementsList.indexOf(currentZeroImgElement);
                            TR.textContent = `${zeroIndex + 1}/${imgElementsList.length}`;
                            if (zeroIndex === 0) {
                                LeftBar.style.display = 'none';
                            } else {
                                LeftBar.style.display = '';
                            }
                            if (zeroIndex === imgElementsList.length - 1) {
                                RightBar.style.display = 'none';
                            } else {
                                RightBar.style.display = '';
                            }
                        }
                    } else {
                        isAlbum = false;
                        TR.textContent = '';
                        LeftBar.style.display = '';
                        RightBar.style.display = '';
                    }
                }
                if (intervalP === '') {
                    showPopup(imageElement.src, e.clientX, e.clientY);
                } else {
                    popupTimer = setTimeout(() => {
                        showPopup(imageElement.src, e.clientX, e.clientY);
                        popupTimer = null;
                    }, parseInt(intervalP));
                }
            }
        });
        //-------------------------------------------------------------------------

        // hide popup
        function hidePopup() {

            isshowPopupEnabled = true;
            if (!ishidePopupEnabled) return;
            imgElementsList = [];
            if (popupTimer) {
                clearTimeout(popupTimer);
            }
            popup.style.display = 'none';
            popupContainer.style.display = 'none';

            NoMode();
            popup.style.maxHeight = 'calc(90vh - 10px)';
            popup.style.width = '';
            popup.style.height = '';
            popupContainer.style.left = '50%';
            popupContainer.style.top = '50%';
            popupContainer.style.position = 'fixed';
            popupContainer.style.transform = 'translate(-50%, -50%) scaleX(1) scaleY(1)';
            popupContainer.style.transformOrigin = '';
            popupContainer.style.outline = '';
            backdrop.style.zIndex = '';
            backdrop.style.display = 'none';
            backdrop.style.backdropFilter = '';
            LeftBar.style.opacity = '0';
            RightBar.style.opacity = '0';
            style2.innerHTML = `
            .LeftBar::before,
            .LeftBar::after,
            .RighttBar::before,
            .RighttBar::after {
                display: none;
            }`;
            document.querySelectorAll('.specialElement').forEach(e => e.remove());

            clickCount = 0;
            cropAreaSet = false;
            CropCover.style.zIndex = '1';
            CropCover.style.border = '';
            document.querySelectorAll('.cropArea1').forEach(e => e.remove())
            document.querySelectorAll('.cropArea2').forEach(e => e.remove())
            document.querySelectorAll('.cropArea3').forEach(e => e.remove())
            document.querySelectorAll('.cropArea4').forEach(e => e.remove())

            var removecropCanvas = document.getElementById('cropCanvas');
            removecropCanvas.remove();
            CropCover.remove();

        }

        popupContainer.addEventListener('mouseout', function(event) {
            let relatedTarget = event.relatedTarget;
            if (relatedTarget && (popupContainer.contains(relatedTarget) || relatedTarget.matches('.imgContainers'))) {
                return;
            }

            document.querySelectorAll('.specialElement').forEach(e => e.remove());
            hidePopup();

            if (intervalP !== '') {
                popupTimer = setTimeout(() => {
                    popupTimer = null;
                }, parseInt(intervalP));
            }
        });

        //-------------------------------------------------------------------------


        // lock popup in screen
        backdrop.addEventListener('dblclick', function(event) {
            clearTimeout(clickTimeout);
            ishidePopupEnabled = true;
            hidePopup();
        });
        backdrop.addEventListener('click', function(event) {
            if (clickTimeout) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function() {
                ResetGeometry();
                if (isScale) {
                    isScale = false;
                    isScaleTL = false;
                    isScaleTR = false;
                    isScaleBL = false;
                    isScaleBR = false;
                    ScalingMode0();

                } else if (isLockedY) {
                    isLockedY = false;
                    popupContainer.style.border = '';
                } else {
                    backdrop.style.zIndex = '';
                    backdrop.style.display = 'none';
                    backdrop.style.backdropFilter = '';
                    isshowPopupEnabled = false;
                }
            }, 300);
        });

    }
    //-------------------------------------------------------------------------


    // Is to be run -----------------------------------------------------------
    if (URLmatched) {
        const indicatorBar = document.createElement('div');
        indicatorBar.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        height: 30px;
        width: 50vw;
        background: #0000;`;
        document.body.appendChild(indicatorBar);

        function toggleIndicator() {
            enableP = 1 - enableP;

            indicatorBar.style.background = enableP ? 'linear-gradient(to right, rgba(50, 190, 152, 0) 0%, rgba(50, 190, 152, 0.5) 25%, rgba(50, 190, 152, 0.5) 75%, rgba(50, 190, 152, 0) 100%)' : 'linear-gradient(to right, rgba(174, 0, 1, 0) 0%, rgba(174, 0, 1, 0.5) 25%, rgba(174, 0, 1, 0.5) 75%, rgba(174, 0, 1, 0) 100%)';
            setTimeout(() => {
                indicatorBar.style.background = '#0000';
            }, 1000);
            if (enableP === 1) {
                HoverZoomMinus();
            } else {
                document.querySelectorAll('.popup-container').forEach(e => e.remove());
                document.querySelectorAll('.popup-backdrop').forEach(e => e.remove());
                document.querySelectorAll('.specialElement').forEach(e => e.remove());
            }
        }
        let hoverTimeout;
        indicatorBar.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(toggleIndicator, 500);
        });
        indicatorBar.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            indicatorBar.style.background = '#0000';
        });
        if (enableP === 1) {
            HoverZoomMinus();
        }
    } else {
        return;
    }

})();