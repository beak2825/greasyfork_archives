// ==UserScript==
// @name         Video Overlay Vanisher
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  A tool to eliminate web video player overlays with Shift+D.
// @author       CY Fung
// @icon         https://na.cx/i/Hh10VGs.png
// @match        https://*/*
// @exclude      https://www.youtube.com/live_chat*
// @exclude      /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @exclude      https://*.openai.com/*
// @exclude      https://jsfiddle.net/*
// @exclude      https://*.jsfiddle.net/*
// @exclude      https://fiddle.*.net/*
// @exclude      https://*.jshell.net/*
// @exclude      https://fiddle.jshell.net/*
// @exclude      https://login.*/*
// @exclude      https://account.*/*
// @grant        GM.getValue
// @run-at       document-start
// @inject-into  content
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428919/Video%20Overlay%20Vanisher.user.js
// @updateURL https://update.greasyfork.org/scripts/428919/Video%20Overlay%20Vanisher.meta.js
// ==/UserScript==
(function $$() {
    'use strict';

    const keyCombination = {
        key: 'KeyD',
        shift: true
    }

    if (document.documentElement == null) return window.requestAnimationFrame($$);

    console.log("userscript enabled - Don't Overlay Video Player !")

    function addStyle(styleText) {
        const styleNode = document.createElement('style');
        styleNode.textContent = styleText;
        document.documentElement.appendChild(styleNode);
        return styleNode;
    }


    // Your code here...

    addStyle(`

[userscript-no-overlay-on] [userscript-no-overlay-hoverable], [userscript-no-overlay-on] [userscript-no-overlay-hoverable] *:not([userscript-no-overlay-hoverable]){
    visibility: collapse !important;
}

`);

    var qElm_PossibleHoverByPosition = new WeakMap();
    var qElm_Cache = new WeakMap();

    let doList = [];
    // Callback function to execute when mutations are observed
    const callbackA = function (mutations, observer) {
        // Use traditional 'for loops' for IE 11
        for (const mutation of mutations) {
            const {
                addedNodes
            } = mutation;
            for (const s of addedNodes) {
                if (s.nodeType === 1) doList.push(s);
            }
        }
        if (doList.length == 0) return;
        callbackB(100);
    };


    function callbackBmicro1(qElm) {
        if (!(qElm instanceof HTMLElement)) return;
        if (qElm.isConnected === false) return;
        let qElmComputedStyle = qElm_Cache.get(qElm);
        if (!qElmComputedStyle) {
            qElmComputedStyle = getComputedStyle(qElm)
            qElm_Cache.set(qElm, qElmComputedStyle);
        }
        const {
            position
        } = qElmComputedStyle;

        if (position == 'absolute' || position == 'fixed') {
            qElm_PossibleHoverByPosition.set(qElm, position);
        } else {
            qElm_PossibleHoverByPosition.delete(qElm);
        }

    }


    const createPipeline = () => {
        let pipelineMutex = Promise.resolve();
        const pipelineExecution = fn => {
            return new Promise((resolve, reject) => {
                pipelineMutex = pipelineMutex.then(async () => {
                    let res;
                    try {
                        res = await fn();
                    } catch (e) {
                        console.log("Pipeline Error", e);
                        reject(e);
                    }
                    resolve(res);
                }).catch(console.warn);
            });
        };
        return pipelineExecution;
    }

    const pipeline = createPipeline();


    async function callbackB(delay) {

        let res;
        do {
            res = await pipeline(async () => {

                if (!doList.length) return;

                if (delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                if (!doList.length) return;

                let doListCopy = doList.slice(0);
                doList.length = 0;

                function allParents(elm) {
                    let res = [];
                    while ((elm = elm.parentNode) instanceof HTMLElement) res.push(elm);
                    return res;
                }
                let possibleContainerSet = null;
                const proceeded = new Set();
                for (const addedNode of doListCopy) {
                    if (!addedNode || !addedNode.parentNode) continue;
                    if (addedNode.isConnected === false) continue;
                    if (proceeded.has(addedNode)) continue;
                    proceeded.add(addedNode);
                    const parentsSet = new Set(allParents(addedNode));
                    if (possibleContainerSet == null) {
                        possibleContainerSet = parentsSet;
                    } else {
                        for (const possibleParent of possibleContainerSet) {
                            if (!parentsSet.has(possibleParent)) possibleContainerSet.delete(possibleParent);
                        }
                        parentsSet.clear();
                    }
                    if (possibleContainerSet.size <= 1) break;
                }
                if(!possibleContainerSet) return;
                proceeded.clear();
                doListCopy.length = 0;

                const possibleContainerSetIt = possibleContainerSet.values();
                const possibleContainer = possibleContainerSetIt.next().value;

                await Promise.resolve();

                //console.log('possibleContainer',possibleContainer)

                const elements = possibleContainer ? [...possibleContainer.querySelectorAll('*')] : null;

                if (elements && elements.length >= 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await Promise.all(elements.map(qElm => Promise.resolve(qElm).then(callbackBmicro1)));
                }

                //console.log('done', doList.length)

                if (doList.length > 0) {
                    delay = 100;
                    return true;
                }

            });
        } while (res === true);

    }



    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callbackA);

    doList = [document.documentElement];
    callbackB(0);

    // Start observing the target node for configured mutations
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    let overlayHoverTID = 0;

    let resizeObserver = null;

    function resizeCallback(mutations) {

        //document.documentElement.removeAttribute('userscript-no-overlay-on')
        //overlayHoverTID=(overlayHoverTID+1)%2;

        if (!document.documentElement.hasAttribute('userscript-no-overlay-on')) {

            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
            return;
        }

        let video = mutations[0].target;
        if (!video) return;

        makeHide(video);
    }

    function makeHide(videoElm) {

        if (!videoElm) return;
        videoElm.setAttribute('ve291', '');

        let _overlayHoverTID = overlayHoverTID;
        overlayHoverTID = (overlayHoverTID + 1) % 2;

        let rElms = [];

        for (const qElm of document.querySelectorAll('*')) {
            if (qElm_PossibleHoverByPosition.has(qElm)) rElms.push(qElm);
        }

        let replacementTexts = [];

        function replaceAll(str) {

            for (const s of replacementTexts) {
                if (str.length < s.length) continue;
                str = str.replace(s, '');
            }

            return str.trim();

        }

        var finalBoundaries = [];

        function getBoundaryElm() {

            finalBoundaries.length = 0;

            let _boundaryElm = videoElm;
            let boundaryElm = videoElm;
            while (_boundaryElm && replaceAll(_boundaryElm.textContent || '') == replaceAll(videoElm.textContent || '')) {
                boundaryElm = _boundaryElm;
                finalBoundaries.push(boundaryElm);
                _boundaryElm = _boundaryElm.parentNode;
            }

            return boundaryElm;
        }

        for (const s of rElms) {
            if (s.contains(videoElm)) continue;
            let sText = s.textContent;
            if (sText && sText.length > 0) replacementTexts.push(sText);
        }
        replacementTexts.sort((b, a) => a.length > b.length ? 1 : a.length < b.length ? -1 : 0);

        getBoundaryElm();

        let breakControl = false;

        while (!breakControl) {


            // youtube: boundary element (parent container) with no size.
            // ensure boundary element is larger than the child.
            var finalBoundaries_entries = finalBoundaries.map(elm => ({
                elm,
                rect: elm.getBoundingClientRect()
            }))

            for (const entry of finalBoundaries_entries) entry.size = Math.round(entry.rect.width * entry.rect.height || 0);

            let maxSize = Math.max(...finalBoundaries_entries.map(entry => entry.size))

            if (!maxSize) continue;

            finalBoundaries_entries = finalBoundaries_entries.filter(entry => entry.size == maxSize);

            let bmElm = finalBoundaries_entries[finalBoundaries_entries.length - 1].elm; // outest largest size

            let bRect = bmElm.getBoundingClientRect();

            for (const s of rElms) {

                if (s.contains(videoElm)) continue;

                let sRect = s.getBoundingClientRect();
                if (bRect && sRect) {
                    if (sRect.width * sRect.height > 0) {
                        if (sRect.left > bRect.right) continue;
                        if (sRect.top > bRect.bottom) continue;
                        if (sRect.right < bRect.left) continue;
                        if (sRect.bottom < bRect.top) continue;
                    } else {
                        continue;
                    }
                }

                s.setAttribute('userscript-no-overlay-hoverable', overlayHoverTID);
            }

            breakControl = true;

        }


        for (const s of document.querySelectorAll(`[userscript-no-overlay-hoverable="${_overlayHoverTID}"]`)) s.removeAttribute('userscript-no-overlay-hoverable');


    }


    function getVideoState() {

        let video = null;

        let videoElms = document.querySelectorAll('video');
        if (!videoElms.length) {
            return null;
        }

        let videos = [...videoElms].map(elm => ({
            elm,
            width: elm.offsetWidth,
            height: elm.offsetHeight
        }));

        let maxWidth = Math.max(...videos.map(item => item.width));
        let maxHeight = Math.max(...videos.map(item => item.height));

        if (maxWidth > 0 && maxHeight > 0) {

            video = videos.filter(item => item.width == maxWidth && item.height == maxHeight)[0] || null;

        }

        return video;

    }

    function postMessage(target, message, origin) {
        let win = null;
        if (target instanceof HTMLIFrameElement) {
            win = target.contentWindow;
        } else if (target && 'postMessage' in target) {
            win = target;
        }
        if (!origin) origin = '*';
        if (win && typeof win.postMessage == 'function') {
            try {
                win.postMessage(message, origin);
            } catch (e) { }
        }
    }

    function spreadMessage() {

        for (const iframe of document.getElementsByTagName('iframe')) {
            if (+iframe.getAttribute('ve944') === mouseEnteredIframeIId) {
                postMessage(iframe, 'do-video-controls-hidden991');
            }
        }

    }

    function tryUnhide() {

        if (document.documentElement.hasAttribute('userscript-no-overlay-on')) {

            document.documentElement.removeAttribute('userscript-no-overlay-on')

            for (const s of document.querySelectorAll('[userscript-no-overlay-hoverable]')) {
                s.removeAttribute('userscript-no-overlay-hoverable');
            }

            const videoTarget = document.querySelector('[ve291]');

            if (videoTarget) {

                videoTarget.removeAttribute('ve291');

                /*
                    requestAnimationFrame(() => {
                        console.log(12321);

                        // Create a new mouse event
                        let event = new MouseEvent('mousemove', {
                            bubbles: true,
                            cancelable: true,
                            clientX: 100,
                            clientY: 100
                            });

                        // Dispatch the event to the element
                        videoTarget.dispatchEvent(event);
                    })
                */

                return true;

            }


        }
        return false;

    }

    function keydownAsync() {
        if (!tryUnhide()) {
            const videoState = getVideoState();
            if (videoState === null) {
                // console.log('Unable to find any video element. If it is inside Iframe, please click the video inside iframe first.')
                spreadMessage();
            } else if (videoState && videoState.elm instanceof HTMLVideoElement) {
                videoState.elm.dispatchEvent(new CustomEvent('video-controls-hidden675'))
            }
        }
    }

    document.addEventListener('keydown', function (evt) {

        if (evt && evt.code == keyCombination.key && evt.shiftKey === keyCombination.shift) {

            if (evt.isComposing) return;
            let evtTarget = evt.target;
            if (evtTarget.nodeType == 1) {
                if (evtTarget.nodeName == 'INPUT' || evtTarget.nodeName == 'TEXTAREA' || evtTarget.hasAttribute('contenteditable')) return;
            }
            evtTarget = null;
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            Promise.resolve().then(keydownAsync);

        }
    }, true);



    let rafPromise = null;

    const getRafPromise = () => rafPromise || (rafPromise = new Promise(resolve => {
      requestAnimationFrame(hRes => {
        rafPromise = null;
        resolve(hRes);
      });
    }));


    const controlsHidden675Async = async (targetVideo)=>{

        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
        resizeObserver = new ResizeObserver(resizeCallback)
        resizeObserver.observe(targetVideo)

        await getRafPromise();
        makeHide(targetVideo);

        document.documentElement.setAttribute('userscript-no-overlay-on', '');

    }




    document.addEventListener('video-controls-hidden675', (evt) => {
        let targetVideo = evt.target;
        if (!(targetVideo instanceof HTMLVideoElement)) return;

        Promise.resolve(targetVideo).then(controlsHidden675Async);

    }, true);

    let mouseEnteredVideoVId = 0;
    let mouseEnteredIframeIId = 0;

    let di = 0;
    let domWeakHash = new WeakMap();
    document.addEventListener('mouseenter', (evt) => {
        if (evt && evt.target instanceof HTMLVideoElement) {
            const videoElm = evt.target;
            if (!domWeakHash.has(videoElm)) {
                let vid = ++di;
                domWeakHash.set(videoElm, vid);
                videoElm.setAttribute('ve944', vid);
            }
            mouseEnteredVideoVId = domWeakHash.get(videoElm);
        } else if (evt && evt.target instanceof HTMLIFrameElement) {
            const iframeTarget = evt.target;
            if (!domWeakHash.has(iframeTarget)) {
                let vid = ++di;
                domWeakHash.set(iframeTarget, vid);
                iframeTarget.setAttribute('ve944', vid);
            }
            mouseEnteredIframeIId = +iframeTarget.getAttribute('ve944') || 0;
            postMessage(iframeTarget, 've761-iframe-entered')
        }
    }, true)
    document.addEventListener('mouseleave', (evt) => {

        if (evt && evt.target instanceof HTMLVideoElement) {
            const videoElm = evt.target;
            if (domWeakHash.has(videoElm)) {
                mouseEnteredVideoVId = 0;
            }
        } else if (evt && evt.target instanceof HTMLIFrameElement) {

            const iframeTarget = evt.target;
            if (domWeakHash.has(iframeTarget)) {
                mouseEnteredIframeIId = 0;
            }
            postMessage(iframeTarget, 've762-iframe-leaved')
        }
    }, true)


    let isInIframeWindow = false;
    function controlsHidden991Async() {
        let videoTarget = null;
        if (mouseEnteredVideoVId > 0 && isInIframeWindow > 0) {
            videoTarget = document.querySelector(`video[ve944="${mouseEnteredVideoVId}"]`);
        }
        if (!videoTarget) {
            if (isInIframeWindow) {
                spreadMessage();
            }
        } else {
            if (!tryUnhide()) {
                videoTarget.dispatchEvent(new CustomEvent('video-controls-hidden675'));
            }
        }
    }
    function receiveMessage(event) {
        if (!event) return;
        if (event.data === 'do-video-controls-hidden991') {
            Promise.resolve().then(controlsHidden991Async);
        } else if (event.data === 've761-iframe-entered') {
            isInIframeWindow = true;
        } else if (event.data === 've761-iframe-leaved') {
            isInIframeWindow = false;
        }
    }


    window.addEventListener('message', receiveMessage, false);

    GM.getValue("dummy"); // dummy


})();