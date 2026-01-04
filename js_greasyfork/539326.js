// ==UserScript==
// @name                Wallhaven Enhance+
// @description         Some More Wallhaven Enhancements, based on New Wallhaven Enhance

// @author              danield4n13l
// @namespace           https://github.com/danield4n13l
// @homepageURL         https://github.com/danield4n13l/wallhavenenhancep
// @supportURL          https://github.com/danield4n13l
// @icon                https://wallhaven.cc/favicon.ico
// @license             GPL-3.0

// @require             https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js
// @resource css        https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css

// @include             https://wallhaven.cc/*
// @grant               GM_download
// @run-at              document-end

// @created             2025-06-13
// @modified            2025-06-13
// @version             1.1
// @downloadURL https://update.greasyfork.org/scripts/539326/Wallhaven%20Enhance%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/539326/Wallhaven%20Enhance%2B.meta.js
// ==/UserScript==

//begin UserScript
; (function () {

    // Load FancyBox script and stylesheet dynamically
    const loadScript = () => {
        return new Promise(resolve => {
            var script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
            document.head.appendChild(script2);
            script2.onload = () => resolve();
        })
    }
    const loadStylesheet = () => {
        return new Promise(resolve => {
            var style1 = document.createElement('link');
            style1.rel = 'stylesheet';
            style1.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
            document.head.appendChild(style1);
            style1.onload = () => resolve();
        })
    }
    async function loadFancybox(params) {
        // Uncomment this if you want to load the script dynamically
        // if the @require is not working for some reason
        //await loadScript();
        await loadStylesheet();
        //DEBUG console.log(Fancybox);
        return 'fancybox done.';
    }

    // Add the enhancements to the page
    const callFancyBox = () => {
        loadFancybox().then(res => {
            let walllist = document.querySelectorAll('.thumbs-container ul li figure');

            for (const [key, element] of Object.entries(walllist)) {
                let preview = element.querySelector('a.preview'),
                    thumbInfo = element.querySelector('.thumb-info span.png') ? 'png' : 'jpg';

                if (preview.getAttribute('data-href')) continue;

                // 5wq8x8
                let wallId = /wallhaven\.cc\/w\/(\w{6})/.exec(preview.href)[1];

                // https://w.wallhaven.cc/full/5w/wallhaven-5wq8x8.jpg
                let pathId = wallId.substring(0, 2);

                // https://th.wallhaven.cc/small/5w/5wq8x8.jpg
                // somewhy all the thumbnails are jpg-s
                let thumbHref = `https://th.wallhaven.cc/small/${pathId}/${wallId}.jpg`;

                // Set attributes for the pics
                preview.setAttribute('data-href', preview.href);
                preview.setAttribute('data-thumb', thumbHref);
                preview.setAttribute('data-fancybox', 'gallery');
                preview.setAttribute('data-caption', `<a style='text-decoration:underline;' href="${preview.href}" target="_blank">wallhaven-${wallId}</a>`.concat(' | ' + element.querySelector('.wall-res').innerHTML));
                preview.href = `https://w.wallhaven.cc/full/${pathId}/wallhaven-${wallId}.${thumbInfo}`;

                // Insert the one-click download button
                let dlDom = $(`<a class="jsDownload" href="javascript:;"> <i class="fa fa-fw fa-cloud-download"></i></a>`)[0];
                dlDom.onclick = function () { GM_download(preview.href, `wallhaven-${wallId}.${thumbInfo}`) };
                element.querySelector('.thumb-info').append(dlDom);
            }
        });
    }

    // Deploy the enhancements
    callFancyBox();
    // Bind FancyBox to the elements with data-fancybox attribute
    Fancybox.bind('[data-fancybox]', {
        closeExisting: true,
        Toolbar: {
            items: {
                downloadGM: {
                    tpl: '<a class="f-button" title="{{DOWNLOAD}}" data-fancybox-download href="javasript:;"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></a>',
                    click: (_fancybox, event) => {
                        GM_download(event.target.href, event.target.href.split('/').pop());
                    }
                },
            },
            display: {
                left: ["infobar"],
                middle: [],
                right: [
                    "downloadGM",
                    "slideshow",
                    "fullscreen",
                    "thumbs",
                    "close",
                ],
            }
        },
        Thumbs: {
            type: "modern",
        }
    });
    // MutationObserver to detect when new images are added to the page
    let observer = new MutationObserver(mutationRecords => {
        if (mutationRecords[0].addedNodes.length && mutationRecords[0].addedNodes[0].className == 'thumb-listing-page') {
            callFancyBox();
            console.log(mutationRecords);
        }
    });
    observer.observe(document.querySelector('.thumbs-container'), {
        childList: true,
        characterDataOldValue: true
    });

})()

//end UserScript