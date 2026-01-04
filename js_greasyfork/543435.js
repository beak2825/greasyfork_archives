// ==UserScript==
// @name         Pixeldrain Bypass Player (Modal Overlay)
// @namespace    pixeldrain-direct-player-modal
// @version      3.1.2
// @description  Adds a button to open a direct, hotlinked video player in a modal, bypassing Pixeldrain limits. No need for a new tab. Also works with my Pixeldrain SRT Subtitle Injector.
// @author       medy (logic inspired by Sak32009)
// @license      MIT
// @match        *://pixeldrain.com/u/*
// @match        *://pixeldrain.com/l/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/543435/Pixeldrain%20Bypass%20Player%20%28Modal%20Overlay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543435/Pixeldrain%20Bypass%20Player%20%28Modal%20Overlay%29.meta.js
// ==/UserScript==
/* global bootstrap, jQuery */
// Inject the entire minified Bootstrap 5.3 CSS, scoped to our container class.
(t=> {
    if(typeof GM_addStyle=="function") {
        GM_addStyle(t);
        return
    }
    const r=document.createElement("style");
    r.textContent=t,document.head.append(r)
})
(` .pd-player-scope {
    all:initial
}
.pd-player-scope * {
    all:revert
}
.pd-player-scope,.pd-player-scope[data-bs-theme=light] {
    --bs-blue:#0d6efd;
    --bs-indigo:#6610f2;
    --bs-purple:#6f42c1;
    --bs-pink:#d63384;
    --bs-red:#dc3545;
    --bs-orange:#fd7e14;
    --bs-yellow:#ffc107;
    --bs-green:#198754;
    --bs-teal:#20c997;
    --bs-cyan:#0dcaf0;
    --bs-black:#000;
    --bs-white:#fff;
    --bs-gray:#6c757d;
    --bs-gray-dark:#343a40;
    --bs-gray-100:#f8f9fa;
    --bs-gray-200:#e9ecef;
    --bs-gray-300:#dee2e6;
    --bs-gray-400:#ced4da;
    --bs-gray-500:#adb5bd;
    --bs-gray-600:#6c757d;
    --bs-gray-700:#495057;
    --bs-gray-800:#343a40;
    --bs-gray-900:#212529;
    --bs-primary:#0d6efd;
    --bs-secondary:#6c757d;
    --bs-success:#198754;
    --bs-info:#0dcaf0;
    --bs-warning:#ffc107;
    --bs-danger:#dc3545;
    --bs-light:#f8f9fa;
    --bs-dark:#212529;
    --bs-primary-rgb:13,110,253;
    --bs-secondary-rgb:108,117,125;
    --bs-success-rgb:25,135,84;
    --bs-info-rgb:13,202,240;
    --bs-warning-rgb:255,193,7;
    --bs-danger-rgb:220,53,69;
    --bs-light-rgb:248,249,250;
    --bs-dark-rgb:33,37,41;
    --bs-primary-text-emphasis:#052c65;
    --bs-secondary-text-emphasis:#2b2f32;
    --bs-success-text-emphasis:#0a3622;
    --bs-info-text-emphasis:#055160;
    --bs-warning-text-emphasis:#664d03;
    --bs-danger-text-emphasis:#58151c;
    --bs-light-text-emphasis:#495057;
    --bs-dark-text-emphasis:#495057;
    --bs-primary-bg-subtle:#cfe2ff;
    --bs-secondary-bg-subtle:#e2e3e5;
    --bs-success-bg-subtle:#d1e7dd;
    --bs-info-bg-subtle:#cff4fc;
    --bs-warning-bg-subtle:#fff3cd;
    --bs-danger-bg-subtle:#f8d7da;
    --bs-light-bg-subtle:#fcfcfd;
    --bs-dark-bg-subtle:#ced4da;
    --bs-primary-border-subtle:#9ec5fe;
    --bs-secondary-border-subtle:#c4c8cb;
    --bs-success-border-subtle:#a3cfbb;
    --bs-info-border-subtle:#9eeaf9;
    --bs-warning-border-subtle:#ffe69c;
    --bs-danger-border-subtle:#f1aeb5;
    --bs-light-border-subtle:#e9ecef;
    --bs-dark-border-subtle:#adb5bd;
    --bs-white-rgb:255,255,255;
    --bs-black-rgb:0,0,0;
    --bs-font-sans-serif:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    --bs-font-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
    --bs-gradient:linear-gradient(180deg, rgba(255, 255, 255, .15), rgba(255, 255, 255, 0));
    --bs-body-font-family:var(--bs-font-sans-serif);
    --bs-body-font-size:1rem;
    --bs-body-font-weight:400;
    --bs-body-line-height:1.5;
    --bs-body-color:#212529;
    --bs-body-color-rgb:33,37,41;
    --bs-body-bg:#fff;
    --bs-body-bg-rgb:255,255,255;
    --bs-emphasis-color:#000;
    --bs-emphasis-color-rgb:0,0,0;
    --bs-secondary-color:rgba(33,37,41,.75);
    --bs-secondary-color-rgb:33,37,41;
    --bs-secondary-bg:#e9ecef;
    --bs-secondary-bg-rgb:233,236,239;
    --bs-tertiary-color:rgba(33,37,41,.5);
    --bs-tertiary-color-rgb:33,37,41;
    --bs-tertiary-bg:#f8f9fa;
    --bs-tertiary-bg-rgb:248,249,250;
    --bs-heading-color:inherit;
    --bs-link-color:#0d6efd;
    --bs-link-color-rgb:13,110,253;
    --bs-link-decoration:underline;
    --bs-link-hover-color:#0a58ca;
    --bs-link-hover-color-rgb:10,88,202;
    --bs-code-color:#d63384;
    --bs-highlight-color:#212529;
    --bs-highlight-bg:#fff3cd;
    --bs-border-width:1px;
    --bs-border-style:solid;
    --bs-border-color:#dee2e6;
    --bs-border-color-translucent:rgba(0,0,0,.175);
    --bs-border-radius:.375rem;
    --bs-border-radius-sm:.25rem;
    --bs-border-radius-lg:.5rem;
    --bs-border-radius-xl:1rem;
    --bs-border-radius-xxl:2rem;
    --bs-border-radius-2xl:var(--bs-border-radius-xxl);
    --bs-border-radius-pill:50rem;
    --bs-box-shadow:0 .5rem 1rem rgba(0,0,0,.15);
    --bs-box-shadow-sm:0 .125rem .25rem rgba(0,0,0,.075);
    --bs-box-shadow-lg:0 1rem 3rem rgba(0,0,0,.175);
    --bs-box-shadow-inset:inset 0 1px 2px rgba(0,0,0,.075);
    --bs-focus-ring-width:.25rem;
    --bs-focus-ring-opacity:.25;
    --bs-focus-ring-color:rgba(13,110,253,.25);
    --bs-form-valid-color:#198754;
    --bs-form-valid-border-color:#198754;
    --bs-form-invalid-color:#dc3545;
    --bs-form-invalid-border-color:#dc3545
}
.pd-player-scope[data-bs-theme=dark] {
    color-scheme:dark;
    --bs-body-color:#dee2e6;
    --bs-body-color-rgb:222,226,230;
    --bs-body-bg:#212529;
    --bs-body-bg-rgb:33,37,41;
    --bs-emphasis-color:#fff;
    --bs-emphasis-color-rgb:255,255,255;
    --bs-secondary-color:rgba(222,226,230,.75);
    --bs-secondary-color-rgb:222,226,230;
    --bs-secondary-bg:#343a40;
    --bs-secondary-bg-rgb:52,58,64;
    --bs-tertiary-color:rgba(222,226,230,.5);
    --bs-tertiary-color-rgb:222,226,230;
    --bs-tertiary-bg:#2b3035;
    --bs-tertiary-bg-rgb:43,48,53;
    --bs-primary-text-emphasis:#6ea8fe;
    --bs-secondary-text-emphasis:#a7acb1;
    --bs-success-text-emphasis:#75b798;
    --bs-info-text-emphasis:#6edff6;
    --bs-warning-text-emphasis:#ffda6a;
    --bs-danger-text-emphasis:#ea868f;
    --bs-light-text-emphasis:#f8f9fa;
    --bs-dark-text-emphasis:#dee2e6;
    --bs-primary-bg-subtle:#031633;
    --bs-secondary-bg-subtle:#161719;
    --bs-success-bg-subtle:#051b11;
    --bs-info-bg-subtle:#032830;
    --bs-warning-bg-subtle:#332701;
    --bs-danger-bg-subtle:#2c0b0e;
    --bs-light-bg-subtle:#343a40;
    --bs-dark-bg-subtle:#1a1d20;
    --bs-primary-border-subtle:#084298;
    --bs-secondary-border-subtle:#41464b;
    --bs-success-border-subtle:#0f5132;
    --bs-info-border-subtle:#087990;
    --bs-warning-border-subtle:#997404;
    --bs-danger-border-subtle:#842029;
    --bs-light-border-subtle:#495057;
    --bs-dark-border-subtle:#343a40;
    --bs-heading-color:inherit;
    --bs-link-color:#6ea8fe;
    --bs-link-hover-color:#8bb9fe;
    --bs-link-color-rgb:110,168,254;
    --bs-link-hover-color-rgb:139,185,254;
    --bs-code-color:#e685b5;
    --bs-highlight-color:#dee2e6;
    --bs-highlight-bg:#664d03;
    --bs-border-color:#495057;
    --bs-border-color-translucent:rgba(255,255,255,.15);
    --bs-form-valid-color:#75b798;
    --bs-form-valid-border-color:#75b798;
    --bs-form-invalid-color:#ea868f;
    --bs-form-invalid-border-color:#ea868f
}
.pd-player-scope *,.pd-player-scope :before,.pd-player-scope :after {
    box-sizing:border-box
}
.pd-player-scope h1,.pd-player-scope h2,.pd-player-scope h3,.pd-player-scope h4,.pd-player-scope h5,.pd-player-scope h6 {
    margin-top:0;
    margin-bottom:.5rem;
    font-weight:500;
    line-height:1.2;
    color:var(--bs-heading-color)
}
.pd-player-scope .btn-close {
    --bs-btn-close-color:#000;
    --bs-btn-close-bg:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e\");
    --bs-btn-close-opacity:.5;
    --bs-btn-close-hover-opacity:.75;
    --bs-btn-close-focus-shadow:0 0 0 .25rem rgba(13,110,253,.25);
    --bs-btn-close-focus-opacity:1;
    --bs-btn-close-disabled-opacity:.25;
    --bs-btn-close-white-filter:invert(1) grayscale(100%) brightness(200%);
    box-sizing:content-box;
    width:1em;
    height:1em;
    padding:.25em .25em;
    color:var(--bs-btn-close-color);
    background:transparent var(--bs-btn-close-bg) center/1em auto no-repeat;
    border:0;
    border-radius:.375rem;
    opacity:var(--bs-btn-close-opacity)
}
.pd-player-scope .btn-close:hover {
    color:var(--bs-btn-close-color);
    text-decoration:none;
    opacity:var(--bs-btn-close-hover-opacity)
}
.pd-player-scope .btn-close:focus {
    outline:0;
    box-shadow:var(--bs-btn-close-focus-shadow);
    opacity:var(--bs-btn-close-focus-opacity)
}
.pd-player-scope .btn-close:disabled,.pd-player-scope .btn-close.disabled {
    pointer-events:none;
    -webkit-user-select:none;
    -moz-user-select:none;
    user-select:none;
    opacity:var(--bs-btn-close-disabled-opacity)
}
.pd-player-scope .btn-close-white,.pd-player-scope[data-bs-theme=dark] .btn-close {
    filter:var(--bs-btn-close-white-filter)
}
.pd-player-scope .modal {
    --bs-modal-zindex:1055;
    --bs-modal-width:500px;
    --bs-modal-padding:1rem;
    --bs-modal-margin:.5rem;
    --bs-modal-color:;
    --bs-modal-bg:var(--bs-body-bg);
    --bs-modal-border-color:var(--bs-border-color-translucent);
    --bs-modal-border-width:var(--bs-border-width);
    --bs-modal-border-radius:var(--bs-border-radius-lg);
    --bs-modal-box-shadow:var(--bs-box-shadow-sm);
    --bs-modal-inner-border-radius:calc(var(--bs-border-radius-lg) - var(--bs-border-width));
    --bs-modal-header-padding-x:1rem;
    --bs-modal-header-padding-y:1rem;
    --bs-modal-header-padding:1rem 1rem;
    --bs-modal-header-border-color:var(--bs-border-color);
    --bs-modal-header-border-width:var(--bs-border-width);
    --bs-modal-title-line-height:1.5;
    --bs-modal-footer-gap:.5rem;
    --bs-modal-footer-bg:;
    --bs-modal-footer-border-color:var(--bs-border-color);
    --bs-modal-footer-border-width:var(--bs-border-width);
    position:fixed;
    top:0;
    left:0;
    z-index:var(--bs-modal-zindex);
    display:none;
    width:100%;
    height:100%;
    overflow-x:hidden;
    overflow-y:auto;
    outline:0
}
.pd-player-scope .modal-dialog {
    position:relative;
    width:auto;
    margin:var(--bs-modal-margin);
    pointer-events:none
}
.pd-player-scope .modal.fade .modal-dialog {
    transition:transform .3s ease-out;
    transform:translate(0,-50px)
}
@media (prefers-reduced-motion:reduce) {
    .pd-player-scope .modal.fade .modal-dialog {
        transition:none
    }
}
.pd-player-scope .modal.show .modal-dialog {
    transform:none
}
.pd-player-scope .modal.modal-static .modal-dialog {
    transform:scale(1.02)
}
.pd-player-scope .modal-dialog-scrollable {
    height:calc(100% - var(--bs-modal-margin)*2)
}
.pd-player-scope .modal-dialog-scrollable .modal-content {
    max-height:100%;
    overflow:hidden
}
.pd-player-scope .modal-dialog-scrollable .modal-body {
    overflow-y:auto
}
.pd-player-scope .modal-dialog-centered {
    display:flex;
    align-items:center;
    min-height:calc(100% - var(--bs-modal-margin)*2)
}
.pd-player-scope .modal-content {
    position:relative;
    display:flex;
    flex-direction:column;
    width:100%;
    color:var(--bs-modal-color);
    pointer-events:auto;
    background-color:var(--bs-modal-bg);
    background-clip:padding-box;
    border:var(--bs-modal-border-width) solid var(--bs-modal-border-color);
    border-radius:var(--bs-modal-border-radius);
    outline:0
}
.modal-backdrop {
    --bs-backdrop-zindex:1050;
    --bs-backdrop-bg:#000;
    --bs-backdrop-opacity:.5;
    position:fixed;
    top:0;
    left:0;
    z-index:var(--bs-backdrop-zindex);
    width:100vw;
    height:100vh;
    background-color:var(--bs-backdrop-bg)
}
.modal-backdrop.fade {
    opacity:0
}
.modal-backdrop.show {
    opacity:var(--bs-backdrop-opacity)
}
.pd-player-scope .modal-header {
    display:flex;
    flex-shrink:0;
    align-items:center;
    justify-content:space-between;
    padding:var(--bs-modal-header-padding);
    border-bottom:var(--bs-modal-header-border-width) solid var(--bs-modal-header-border-color);
    border-top-left-radius:var(--bs-modal-inner-border-radius);
    border-top-right-radius:var(--bs-modal-inner-border-radius)
}
.pd-player-scope .modal-header .btn-close {
    padding:calc(var(--bs-modal-header-padding-y)*.5) calc(var(--bs-modal-header-padding-x)*.5);
    margin:calc(var(--bs-modal-header-padding-y)*-.5) calc(var(--bs-modal-header-padding-x)*-.5) calc(var(--bs-modal-header-padding-y)*-.5) auto
}
.pd-player-scope .modal-title {
    margin-bottom:0;
    line-height:var(--bs-modal-title-line-height)
}
.pd-player-scope .modal-body {
    position:relative;
    flex:1 1 auto;
    padding:var(--bs-modal-padding)
}
.pd-player-scope .modal-footer {
    display:flex;
    flex-shrink:0;
    flex-wrap:wrap;
    align-items:center;
    justify-content:flex-end;
    padding:calc(var(--bs-modal-padding) - var(--bs-modal-footer-gap)*.5);
    background-color:var(--bs-modal-footer-bg);
    border-top:var(--bs-modal-footer-border-width) solid var(--bs-modal-footer-border-color);
    border-bottom-right-radius:var(--bs-modal-inner-border-radius);
    border-bottom-left-radius:var(--bs-modal-inner-border-radius)
}
.pd-player-scope .modal-footer>* {
    margin:calc(var(--bs-modal-footer-gap)*.5)
}
@media (min-width:576px) {
    .pd-player-scope .modal {
        --bs-modal-margin:1.75rem;
        --bs-modal-box-shadow:var(--bs-box-shadow)
    }
    .pd-player-scope .modal-dialog {
        max-width:var(--bs-modal-width);
        margin-right:auto;
        margin-left:auto
    }
    .pd-player-scope .modal-sm {
        --bs-modal-width:300px
    }
}
@media (min-width:992px) {
    .pd-player-scope .modal-lg,.pd-player-scope .modal-xl {
        --bs-modal-width:800px
    }
}
@media (min-width:1200px) {
    .pd-player-scope .modal-xl {
        --bs-modal-width:1140px
    }
}
.pd-player-scope .fade {
    transition:opacity .15s linear
}
@media (prefers-reduced-motion:reduce) {
    .pd-player-scope .fade {
        transition:none
    }
}
.pd-player-scope .fade:not(.show) {
    opacity:0
}
.pd-player-scope .p-0 {
    padding:0!important
}
.pd-player-scope .fw-bold {
    font-weight:700!important
}
.pd-player-scope .modal-body video {
    width:100%;
    max-height:calc(100vh - 100px);
    display:block;
    outline:none;
    background-color:#000;
}
`);
(function($, bootstrap)  {
    'use strict';
    // Use .noConflict to avoid clashes with the site's own jQuery if it has one.
    $ = $.noConflict(true);
    const SCRIPT_NAME = 'Pixeldrain Direct Player';
    const BYPASS_URL_BASE = 'https://pd.cybar.xyz';
    const CONTAINER_CLASS = 'pd-player-scope';
    const MODAL_ID = 'pd-direct-player-modal';
    let uiInitialized = false;
    // --- HTML Templates ---
    const MODAL_HTML = `
    <div class="modal fade" id="$ {
        MODAL_ID
    }
    " tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content">
    <div class="modal-header">
    <h5 class="modal-title fw-bold">Direct Player</h5>
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body p-0">
    <!-- Video tag will be injected here -->
    </div>
    </div>
    </div>
    </div>
    `;
    /**
    * Finds the current file ID and checks if it's a video.
    * @returns  {
        {
            id: string, name: string
        }
        |null
    }
    */
    function getCurrentFileInfo()  {
        // Primary Method: Read from the global viewer_data object. It's more comprehensive.
        if (typeof unsafeWindow.viewer_data?.api_response !== 'undefined')  {
            const data = unsafeWindow.viewer_data;
            const api = data.api_response;
            // Handle list pages (/l/...)
            if (data.type === 'list' && data.file_id && api.files)  {
                const currentFile = api.files.find(f => f.id === data.file_id);
                if (currentFile && currentFile.mime_type?.startsWith('video/'))  {
                    return  {
                        id: currentFile.id, name: currentFile.name
                    };
                }
            }
            // Handle single file pages (/u/...)
            else if (data.type === 'file' && api.id && api.mime_type?.startsWith('video/'))  {
                return  {
                    id: api.id, name: api.name
                };
            }
        }
        // Fallback Method: For initial load before viewer_data might be populated.
        const videoMetaTag = document.querySelector('meta[property="og:video"]');
        if (videoMetaTag?.content)  {
            const urlParts = videoMetaTag.content.split('/');
            const fileId = urlParts.pop();
            const fileName = document.title.split('~')[0].trim();
            if (fileId) return  {
                id: fileId, name: fileName
            };
        }
        return null;
    }
    /**
    * Creates and injects the toolbar button.
    * @param  {
        {
            id: string, name: string
        }
    }
    fileInfo
    */
    function createOrUpdateButton(fileInfo)  {
        const toolbar = document.querySelector('.toolbar');
        const templateButton = document.querySelector('.toolbar_button');
        const separatorTemplate = document.querySelector('.toolbar .separator');
        if (!toolbar || !templateButton || !separatorTemplate)  {
            console.log(`[$ {
                SCRIPT_NAME
            }
            ] Toolbar elements not found yet`);
            return false;
        }
        // Check if button already exists
        let directButton = document.querySelector('#pd-direct-player-btn');
        if (!directButton)  {
            // Create the button using Pixeldrain's template
            directButton = templateButton.cloneNode(true);
            directButton.id = 'pd-direct-player-btn';
            directButton.removeAttribute('href');
            directButton.removeAttribute('title');
            directButton.querySelector('i').textContent = 'play_arrow';
            directButton.querySelector('span').textContent = 'Play Direct';
            directButton.addEventListener('click', (e) =>  {
                e.preventDefault();
                e.stopPropagation();
                const currentId = directButton.getAttribute('data-file-id');
                const currentName = directButton.getAttribute('data-file-name');
                if (currentId)  {
                    createAndShowModal(currentId, currentName);
                }
            });
            // Insert into toolbar (after the last separator)
            const newSeparator = separatorTemplate.cloneNode(true);
            separatorTemplate.parentNode.insertBefore(newSeparator, separatorTemplate.nextSibling);
            newSeparator.parentNode.insertBefore(directButton, newSeparator.nextSibling);
            console.log(`[$ {
                SCRIPT_NAME
            }
            ] Direct player button created`);
        }
        // Update button data
        directButton.setAttribute('data-file-id', fileInfo.id);
        directButton.setAttribute('data-file-name', fileInfo.name);
        return true;
    }
    /**
    * Removes the toolbar button if it exists.
    */
    function removeButton()  {
        const directButton = document.querySelector('#pd-direct-player-btn');
        if (directButton)  {
            // Also remove the separator that was added with it
            const prevSeparator = directButton.previousElementSibling;
            if (prevSeparator && prevSeparator.classList.contains('separator'))  {
                prevSeparator.remove();
            }
            directButton.remove();
            console.log(`[$ {
                SCRIPT_NAME
            }
            ] Direct player button removed`);
        }
    }
    /**
    * Creates the Bootstrap modal, injects the video player, and shows it.
    * @param  {
        string
    }
    fileId
    * @param  {
        string
    }
    fileName
    */
    function createAndShowModal(fileId, fileName)  {
        // Ensure we have our container
        let $container = $(`.$ {
            CONTAINER_CLASS
        }
        `);
        if (!$container.length)  {
            $container = $('<div>').addClass(CONTAINER_CLASS).attr('data-bs-theme', 'dark').appendTo('body');
        }
        // Remove any old modal instance first
        $(`#$ {
            MODAL_ID
        }
        `).remove();
        const videoUrl = `$ {
            BYPASS_URL_BASE
        }
        /$ {
            fileId
        }
        `;
        const $modal = $(MODAL_HTML);
        $modal.find('.modal-title').text(fileName);
        const $video = $('<video>').attr( {
            src: videoUrl,
            controls: true,
            autoplay: true
        });
        $modal.find('.modal-body').append($video);
        $modal.appendTo($container);
        const modalInstance = new bootstrap.Modal($modal[0]);
        // Add event listener for when the modal is closed, to stop the video and clean up.
        $modal[0].addEventListener('hidden.bs.modal', event =>  {
            const videoEl = $modal.find('video')[0];
            if (videoEl)  {
                videoEl.pause();
                videoEl.src = '';
                // Detach the source
            }
            modalInstance.dispose();
            $modal.remove();
            // Remove from DOM
        });
        modalInstance.show();
        console.log(`[$ {
            SCRIPT_NAME
        }
        ] Modal opened for $ {
            fileName
        }
        `);
    }
    /**
    * Main execution logic.
    */
    function run()  {
        const fileInfo = getCurrentFileInfo();
        if (fileInfo)  {
            console.log(`[$ {
                SCRIPT_NAME
            }
            ] Video detected: $ {
                fileInfo.name
            }
            ($ {
                fileInfo.id
            })
            `);
            const buttonCreated = createOrUpdateButton(fileInfo);
            if (!buttonCreated)  {
                // If we couldn't create the button, try again later
                setTimeout(run, 1000);
            }
        }
        else  {
            console.log(`[$ {
                SCRIPT_NAME
            }
            ] No video detected on this page/view.`);
            removeButton();
        }
    }
    /**
    * Sets up UI when toolbar is available.
    */
    function setupUI()  {
        if (uiInitialized) return;
        const toolbar = document.querySelector('.toolbar');
        const templateButton = document.querySelector('.toolbar_button');
        const separatorTemplate = document.querySelector('.toolbar .separator');
        if (!toolbar || !templateButton || !separatorTemplate)  {
            console.log(`[$ {
                SCRIPT_NAME
            }
            ] Toolbar not ready yet, retrying...`);
            return false;
        }
        uiInitialized = true;
        console.log(`[$ {
            SCRIPT_NAME
        }
        ] UI Initialized`);
        // Run initial setup
        run();
        return true;
    }
    // --- Script Entry Point ---
    function initializeScript()  {
        // Wait for document body to be available
        if (!document.body)  {
            setTimeout(initializeScript, 100);
            return;
        }
        // Try to setup UI immediately
        if (setupUI())  {
            return;
            // Success
        }
        // If immediate setup failed, use observer
        const observer = new MutationObserver((mutations, obs) =>  {
            if (setupUI())  {
                obs.disconnect();
            }
        });
        observer.observe(document.body,  {
            childList: true,
            subtree: true
        });
        // Fallback timeout
        setTimeout(() =>  {
            if (!uiInitialized)  {
                console.log(`[$ {
                    SCRIPT_NAME
                }
                ] Fallback initialization`);
                setupUI();
            }
        },
        3000);
    }
    // Start initialization
    if (document.readyState === 'loading')  {
        document.addEventListener('DOMContentLoaded', initializeScript);
    }
    else  {
        initializeScript();
    }
    // Listen for hash changes on list pages to update the button for the new file.
    $(window).on('hashchange', function()  {
        // Give the site's JS time to update viewer_data
        setTimeout(run, 200);
    });
})
(jQuery, bootstrap);