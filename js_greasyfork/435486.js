// ==UserScript==
// @name        HitomiMosaic
// @namespace   HitomiMosaic
// @license     Apache 2.0
// @match       *://hitomi.la/*
// @exclude     *://hitomi.la/reader/*
// @version     1.1.0
// @author      ombe1229
// @description Hitomi thumbnail mosaic
// @run-at      document-end
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/435486/HitomiMosaic.user.js
// @updateURL https://update.greasyfork.org/scripts/435486/HitomiMosaic.meta.js
// ==/UserScript==


initConfigBtn();
(new MutationObserver(mosaic).observe(document, { childList: true, subtree: true }));


function mosaic(changes, observer) {
    let containerList;
    if ((containerList = document.querySelectorAll("div.gallery-content > .manga, .acg, .dj, .cg")).length > 0) {
        observer.disconnect();

        let tagList = GM_config.get("tagList").split(/,\s+|,/)
        containerList.forEach(function (element) {
            let tagContainer = element.querySelector(".relatedtags");
            let tags = [...tagContainer.querySelectorAll("li")].map(tag => tag.innerText);
            if (tags.some(tag => tagList.includes(tag.toLowerCase().replace(/\s(♀|♂)/g, "")))) {
                element.querySelector(".dj-img-cont").remove();
            }
        });
    }
};

function initConfigBtn() {
    GM_config.init({
        "id": "HitomiMosaicConfig",
        "title": "Hitomi Mosaic Config",
        "fields":
        {
            "tagList":
            {
                "label": "Tag list to block",
                "type": "textarea",
                "default": "scat, guro, amputee, snuff, yaoi, males only, pig, insect, toddler",
            },
        },
    });

    const configNode = document.createElement("div");
    configNode.innerHTML = "<button id='configBtn' type='button'>HitomiMosaic Config</button>";
    document.body.appendChild(configNode);
}


document.getElementById("configBtn").addEventListener(
    "click", () => {
        GM_config.open();
    }, false
);


GM_addStyle(`
    #configBtn {
        position: fixed;
        top: 1rem;
        left: 1rem;
    }
`);
