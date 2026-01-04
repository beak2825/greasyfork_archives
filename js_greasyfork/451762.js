// ==UserScript==
// @name         Google Images All Sizes
// @version      1.11.0
// @description  Adds 'All Sizes' and 'Full Size' buttons to google images.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @author       Nour Nasser
// @namespace    https://github.com/Nourz1234
// @match        *://www.google.com/search*udm=2*
// @match        *://www.google.com/search*tbm=isch*
// @match        *://www.google.com/imgres*
// @run-at       document-end
// @supportURL   https://github.com/Nourz1234/google-images-all-sizes/issues
// @connect      *
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/451762/Google%20Images%20All%20Sizes.user.js
// @updateURL https://update.greasyfork.org/scripts/451762/Google%20Images%20All%20Sizes.meta.js
// ==/UserScript==

(function () {
const SVGTags = {
    animate: null,
    circle: null,
    clipPath: null,
    defs: null,
    desc: null,
    ellipse: null,
    feBlend: null,
    feColorMatrix: null,
    feComponentTransfer: null,
    feComposite: null,
    feConvolveMatrix: null,
    feDiffuseLighting: null,
    feDisplacementMap: null,
    feDistantLight: null,
    feFlood: null,
    feFuncA: null,
    feFuncB: null,
    feFuncG: null,
    feFuncR: null,
    feGaussianBlur: null,
    feImage: null,
    feMerge: null,
    feMergeNode: null,
    feMorphology: null,
    feOffset: null,
    fePointLight: null,
    feSpecularLighting: null,
    feSpotLight: null,
    feTile: null,
    feTurbulence: null,
    filter: null,
    foreignObject: null,
    g: null,
    image: null,
    line: null,
    linearGradient: null,
    marker: null,
    mask: null,
    metadata: null,
    path: null,
    pattern: null,
    polygon: null,
    polyline: null,
    radialGradient: null,
    rect: null,
    stop: null,
    svg: null,
    switch: null,
    symbol: null,
    text: null,
    textPath: null,
    tspan: null,
    use: null,
    view: null,
};
function createElement(tag, props, ...children) {
    // console.info(tag, props, children);
    let elem;
    if (tag in SVGTags) {
        elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
    }
    else {
        elem = document.createElement(tag);
    }
    setProps(elem, props || {});
    appendChildren(elem, children);
    return elem;
}
function setProps(elem, props) {
    Object.entries(props).forEach(([key, value]) => {
        if (key === "style" && value instanceof Object) {
            Object.assign(elem.style, value);
        }
        else if (key === "dataset" && value instanceof Object) {
            Object.assign(elem.dataset, value);
        }
        else if (hasKey(elem, key) && !isKeyReadonly(elem, key)) {
            elem[key] = value;
        }
        else {
            elem.setAttribute(key, String(value));
        }
    });
}
function appendChildren(elem, children) {
    children.flat().forEach(child => {
        if (child instanceof Node) {
            elem.appendChild(child);
        }
        else if (child !== null && child !== false) {
            elem.appendChild(document.createTextNode(String(child)));
        }
    });
}

function createDocumentFromHTML(html) {
    let doc = document.implementation.createHTMLDocument("");
    doc.open();
    doc.write(html);
    doc.close();
    return doc;
}
function isElementVisible(elem) {
    return elem.offsetParent !== null && elem.style.visibility != "hidden";
}
function isKeyReadonly(obj, key) {
    let currentObj = obj;
    while (currentObj !== null) {
        const desc = Object.getOwnPropertyDescriptor(currentObj, key);
        if (desc) {
            return desc.writable === false || desc.set === undefined;
        }
        currentObj = Object.getPrototypeOf(currentObj);
    }
    return true;
}
function hasKey(obj, key) {
    return key in obj;
}

logInfo("Started!");
GM_addStyle(getFile("styles.css"));
const observer = new MutationObserver(addButtons);
observer.observe(document.body, { attributes: true, subtree: true });
function getPreviewImageUrl(source) {
    const imgs = source.closest("[data-tbnid]")
        ?.querySelectorAll("a > img");
    return Array.from(imgs || []).find(isElementVisible)?.src;
}
function getImageDetails(source) {
    const container = source.closest('div[data-sid]');
    if (!container) {
        throw new Error("Failed to find image container");
    }
    const query = container.dataset.query;
    const tbnId = container.dataset.sid;
    if (!tbnId) {
        throw new Error("Failed to fetch image tbn id");
    }
    const docId = document.querySelector(`[data-docid="${tbnId}"]`)?.dataset.refDocid;
    return { query, docId, tbnId };
}
async function getAllSizesForImage(source) {
    const { query, docId, tbnId } = getImageDetails(source);
    const url = new URL('/search', window.location.href);
    url.searchParams.append("q", query || "");
    url.searchParams.append("tbm", "isch");
    url.searchParams.append("docid", docId || "");
    url.searchParams.append("tbnid", tbnId);
    url.searchParams.append("tbs", "simg:m00");
    // logInfo(url.href);
    const response = await GM.xmlHttpRequest({
        method: "GET",
        url: url.href,
        headers: {
            "User-Agent": "Mozilla/5.0 (Android 7.0; Mobile; rv:60.0) Gecko/60.0 Firefox/60.0", // important!
        }
    });
    const doc = createDocumentFromHTML(response.responseText);
    return Array.from(doc.querySelectorAll("[data-docid]")).map(elem => {
        const img = elem.querySelector("img");
        return {
            docId: elem.dataset.docid,
            tbnId: elem.dataset.tbnid,
            width: elem.dataset.ow,
            height: elem.dataset.oh,
            src: elem.dataset.ou,
            previewSrc: img.dataset.src || img.src,
            alt: img.alt,
            site: elem.dataset.st,
            url: elem.dataset.ru,
            title: elem.dataset.pt,
        };
    });
}
function addButtons() {
    let btnBars = document.querySelectorAll('div[class="HJRshd"]');
    for (let btnBar of btnBars) {
        const btnOpenImageInFullSize = btnBar.querySelector('#gias_fullSize');
        const btnViewAllSizes = btnBar.querySelector('#gias_allSizes');
        if (btnOpenImageInFullSize !== null || btnViewAllSizes !== null)
            return;
        btnBar.insertAdjacentElement('afterbegin', renderMainButtons());
    }
}
function showImagesModal(images) {
    document.body.appendChild(renderImagesModal(images));
}
async function openImage(image, doNotOpenExternalWebsites) {
    logInfo("openImage", image);
    let response = await GM.xmlHttpRequest({
        method: 'HEAD',
        url: image.src,
    });
    const isImage = response.responseHeaders.toLowerCase().includes("content-type: image/");
    if (!isImage) {
        window.open(doNotOpenExternalWebsites ? image.previewSrc : image.src, "_blank");
        return;
    }
    response = await GM.xmlHttpRequest({
        method: 'GET',
        url: image.src,
        responseType: "blob",
    });
    window.open(URL.createObjectURL(response.response), "_blank");
}

function renderMainButtons() {
    function onViewFullSize() {
        let imgUrl = getPreviewImageUrl(this);
        if (imgUrl !== null)
            window.open(imgUrl, '_blank');
    }
    async function onViewAllSizes() {
        this.classList.add("loading");
        this.disabled = true;
        try {
            const images = await getAllSizesForImage(this);
            // logInfo(images);
            showImagesModal(images);
            this.disabled = false;
        }
        catch (e) {
            handleError(e);
        }
        finally {
            this.classList.remove("loading");
        }
    }
    return (createElement("div", { style: { display: 'flex', gap: "1em" } },
        createElement("button", { id: "gias_fullSize", className: "btn", onclick: onViewFullSize }, "Full Size"),
        createElement("button", { id: "gias_allSizes", className: "btn", onclick: onViewAllSizes }, "All Sizes")));
}
function renderImagesModal(images) {
    const context = {
        doNotOpenExternalWebsites: true,
    };
    logInfo(images);
    const modal = (createElement("div", { className: "gias-modal", onclick: function (e) {
            if (e.target == this)
                this.remove();
        } },
        createElement("div", { className: "modal-content" },
            createElement("div", { className: "modal-head" },
                createElement("div", { className: "title" }, "All Sizes"),
                createElement("label", { title: "If the full size image link does not lead to an actual image then open the preview image instead of opening an external website.", htmlFor: "doNotOpenExternalWebsites" },
                    createElement("input", { id: "doNotOpenExternalWebsites", name: "doNotOpenExternalWebsites", type: "checkbox", checked: context.doNotOpenExternalWebsites, onchange: (e) => context.doNotOpenExternalWebsites = e.target.checked }),
                    "Don't open external websites"),
                createElement("button", { className: "close", type: "button", onclick: function () {
                        this.closest(".gias-modal")?.remove();
                    } },
                    createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24" },
                        createElement("path", { d: "M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z" })))),
            createElement("div", { className: "modal-body" },
                createElement("div", { className: "img-panel" },
                    images.length && images.map(img => renderImage(img, context)),
                    !images.length &&
                        createElement("div", null, "No images found."))))));
    return modal;
}
function renderImage(image, context) {
    async function onOpenImage() {
        this.classList.add("loading");
        this.disabled = true;
        try {
            await openImage(image, context.doNotOpenExternalWebsites);
        }
        catch (error) {
            logError("Error opening image", error);
            window.open(image.src, "_blank");
        }
        finally {
            this.classList.remove("loading");
            this.disabled = false;
        }
    }
    function onOpenInGoogle() {
        const url = new URL("/imgres", window.location.href);
        // url.searchParams.set("q", "");
        // url.searchParams.set("imgurl", image.src);
        url.searchParams.set("imgrefurl", image.url);
        url.searchParams.set("docid", image.docId);
        url.searchParams.set("tbnid", image.tbnId);
        // url.searchParams.set("w", image.width);
        // url.searchParams.set("h", image.height);
        window.open(url.href, "_blank");
    }
    function openWebsite() {
        window.open(image.url, "_blank");
    }
    return (createElement("div", { className: "img-container" },
        createElement("div", { className: "img" },
            createElement("img", { loading: "lazy", src: image.previewSrc, alt: image.alt }),
            createElement("div", { className: "overlay" },
                createElement("div", { className: "actions-container" },
                    createElement("div", { className: "actions" },
                        createElement("button", { className: "btn", onclick: onOpenImage }, "Open"),
                        createElement("button", { className: "btn", onclick: onOpenInGoogle }, "Open in Google"),
                        createElement("button", { className: "btn", onclick: openWebsite }, "Open Website"))),
                createElement("div", { className: "img-size" },
                    image.width,
                    "x",
                    image.height))),
        createElement("div", { className: "img-info" },
            createElement("a", { className: "site", href: image.url, target: "_blank", title: image.site }, image.site),
            createElement("span", { className: "title", title: image.title }, image.title))));
}

function logInfo(...data) {
    console.info("[Google Images All Sizes]", ...data);
}
function logError(...data) {
    console.error("[Google Images All Sizes]", ...data);
}
function showMsg(message) {
    window.alert(`[Google Images All Sizes]:\n${message}`);
}
function handleError(...data) {
    logError(...data);
    showMsg("An unhandled error occurred.\nCheck console for details.");
}

function getFile(name) {
const files = {
'styles.css': () =>
`
/* variables */
:root {
    --clr-text-light: #e4e4e4;
    --clr-text-dark: #242424;

    /* Support for light mode? What is this? Did I really need to add this? */
    --clr-background: white;
    --clr-background2: lightgray;
    --clr-background-disabled: #424242;
    --clr-border: #cfcfcf;
    --clr-text: var(--clr-text-dark);
    --clr-text-disabled: #6e6e6e;
    --clr-gray-text: #9e9e9e;
    --clr-accent: #0060df;
    @media (prefers-color-scheme: dark) {
        --clr-background: #1f1f1f;
        --clr-background2: #292929;
        /* --clr-background-disabled: #424242; */
        --clr-border: #3f3f3f;
        --clr-text: var(--clr-text-light);
        /* --clr-text-disabled: #6e6e6e; */
        /* --clr-gray-text: #9e9e9e; */
        /* --clr-accent: #0060df; */
    }

    --img-height: 200px;
    --img-min-width: 100px;
    --img-max-width: 356px;
    --gap: 0.5em;

    /* use system accent color if available */
    @supports (color: AccentColor) {
        --clr-accent: AccentColor;
    }
}

/* The Modal (background) */
.gias-modal {
    all: revert;

    position: fixed;
    display: flex;
    flex-flow: row;
    justify-content: center;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.6);

    font-family: Arial;
    font-size: medium;
    accent-color: var(--clr-accent);
    color: var(--clr-text);

    * {
        transition: all 0.3s ease-out;
    }

    a {
        color: var(--clr-gray-text);
        font-size: small;
    }

    /* Modal Content */
    .modal-content {
        background: var(--clr-background);
        border: 1px solid var(--clr-border);
        border-radius: 1em;
        margin: 3em;
        padding: var(--gap);
        display: flex;
        flex-flow: column;
    }

    /* Modal Header */
    .modal-head {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        gap: 3em;
        border: 0;
        border-bottom: 1px solid var(--clr-border);

        .title {
            font-size: large;
            margin-left: 0.3em;
        }
    }

    /* Modal Body */
    .modal-body {
        display: flex;
        justify-content: center;
        overflow: auto;
        padding-top: 1em;
    }

    .img-panel {
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--gap);
    }

    .img-container {
        display: flex;
        flex-flow: column;
        gap: var(--gap);
    }

    .img {
        min-width: var(--img-min-width);
        max-width: var(--img-max-width);
        height: var(--img-height);
        border-radius: 1em;
        overflow: hidden;
        display: flex;
        flex-flow: column;
        justify-content: center;
        background: var(--clr-background2);
        position: relative;
        filter: drop-shadow(0px 2px 5px black);

        img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
    }

    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;

        display: flex;
        flex-flow: column;
    }

    .actions-container {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;

        flex-grow: 1;

        opacity: 0;
        background: rgba(0, 0, 0, 0.6);
    }

    .actions-container:hover {
        opacity: 1;
    }

    .actions {
        display: flex;
        flex-flow: column;
        width: max-content;

        gap: var(--gap);
    }

    .img-size {
        text-align: center;
        color: var(--clr-text-light);
        background: rgba(0, 0, 0, 0.6);
    }

    .img-info {
        display: flex;
        flex-flow: column;
        /* start at 0 */
        width: 0px;
        /* grow to fill available space (i don't know how it works, but it does ¯\\_(ツ)_/¯) */
        min-width: 100%;

        white-space: nowrap;

        .site,
        .title {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .site {
            text-decoration: none;
        }

        .site:hover {
            text-decoration: underline;
        }
    }

    .close {
        align-self: flex-start;
        fill: var(--clr-gray-text);
        border: none;
        background: none;
        cursor: pointer;
    }

    .close:hover {
        filter: brightness(125%);
    }

    .gap {
        gap: var(--gap);
    }

    .d-flex {
        display: flex;
        align-items: center;
    }
}


.btn {
    text-decoration: none;
    color: var(--clr-text-light);
    background: var(--clr-accent);
    padding: 0.5em;
    box-sizing: border-box;
    border: none;
    border-radius: 1em;
    flex-grow: 1;
    cursor: pointer;
    /* overflow: hidden; */
    position: relative;
}

.btn:hover {
    filter: brightness(125%);
}

.btn:disabled {
    background: var(--clr-background-disabled);
    color: var(--clr-text-disabled);
    pointer-events: none;
}

.loading::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    aspect-ratio: 1;
    height: 25px;
    width: auto;

    background: var(--clr-background);
    border-radius: 50%;
}

.loading::after {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    aspect-ratio: 1;
    height: 25px;
    width: auto;

    box-sizing: border-box;
    border: 4px solid transparent;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
`,

};
return files[name]();
}

})();