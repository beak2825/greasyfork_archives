// ==UserScript==
// @name         Icon test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Check icon support in purge icon or not.
// @author       tom.dai
// @match        https://icon-sets.iconify.design/*
// @icon         https://icon-sets.iconify.design/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527411/Icon%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/527411/Icon%20test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CollectionIds = [
        "ic",
        "mdi",
        "ph",
        "ri",
        "carbon",
        "bi",
        "tabler",
        "ion",
        "uil",
        "teenyicons",
        "clarity",
        "iconoir",
        "majesticons",
        "zondicons",
        "ant-design",
        "bx",
        "bxs",
        "gg",
        "cil",
        "lucide",
        "pixelarticons",
        "system-uicons",
        "ci",
        "akar-icons",
        "typcn",
        "radix-icons",
        "ep",
        "mdi-light",
        "fe",
        "eos-icons",
        "line-md",
        "charm",
        "prime",
        "heroicons-outline",
        "heroicons-solid",
        "uiw",
        "uim",
        "uit",
        "uis",
        "maki",
        "gridicons",
        "mi",
        "quill",
        "gala",
        "fluent",
        "icon-park-outline",
        "icon-park",
        "vscode-icons",
        "jam",
        "codicon",
        "pepicons",
        "bytesize",
        "ei",
        "fa6-solid",
        "fa6-regular",
        "octicon",
        "ooui",
        "nimbus",
        "openmoji",
        "twemoji",
        "noto",
        "noto-v1",
        "emojione",
        "emojione-monotone",
        "emojione-v1",
        "fxemoji",
        "bxl",
        "logos",
        "simple-icons",
        "cib",
        "fa6-brands",
        "arcticons",
        "file-icons",
        "brandico",
        "entypo-social",
        "cryptocurrency",
        "flag",
        "circle-flags",
        "flagpack",
        "cif",
        "gis",
        "map",
        "geo",
        "fad",
        "academicons",
        "wi",
        "healthicons",
        "medical-icon",
        "la",
        "eva",
        "dashicons",
        "flat-color-icons",
        "entypo",
        "foundation",
        "raphael",
        "icons8",
        "iwwa",
        "fa-solid",
        "fa-regular",
        "fa-brands",
        "fa",
        "fontisto",
        "icomoon-free",
        "ps",
        "subway",
        "oi",
        "wpf",
        "simple-line-icons",
        "et",
        "el",
        "vaadin",
        "grommet-icons",
        "whh",
        "si-glyph",
        "zmdi",
        "ls",
        "bpmn",
        "flat-ui",
        "vs",
        "topcoat",
        "il",
        "websymbol",
        "fontelico",
        "feather",
        "mono-icons",
    ]
    function checkPureIcon() {
        Array.from(document.querySelectorAll('.if--items-grid-rows a')).forEach(a => {
            if(CollectionIds.includes(a.href.split('/').slice(-3)[0])) {
                a.style.border = '1px dashed red';
            }
        })
    }

    const timer = setInterval(() => {
        if (!document.querySelector('.if--items-grid-row.items')) return;
        clearInterval(timer);
        const observe = new MutationObserver(function(mutations, observer){
            checkPureIcon();
        });
        observe.observe(document.querySelector('.if--items-grid-row.items'),{ childList: true });
        checkPureIcon();
    }, 500);
})();
