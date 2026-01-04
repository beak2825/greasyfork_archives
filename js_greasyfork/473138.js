// ==UserScript==
// @name        ShadowPuzzle
// @description Jiggin' ain't what it used to be.
// @namespace   Puzzle Enjoyers Gentlemans Club
// @grant       none
// @version     0.2
// @author      -
// @license     MIT
// @include     https://jiggie.fun/*
// @include     https://puzzle.aggie.io/*
// @downloadURL https://update.greasyfork.org/scripts/473138/ShadowPuzzle.user.js
// @updateURL https://update.greasyfork.org/scripts/473138/ShadowPuzzle.meta.js
// ==/UserScript==
const $c122116bdd400350$export$d53c00440a6f6a93 = new Uint8ClampedArray([
    0x54,
    0x48,
    0x49,
    0x53,
    0x20,
    0x49,
    0x53,
    0x20,
    0x4d,
    0x59,
    0x20,
    0x50,
    0x55,
    0x5a,
    0x5a,
    0x4c,
    0x45,
    0x2e,
    0x20,
    0x54,
    0x48,
    0x45,
    0x52,
    0x45,
    0x20,
    0x41,
    0x52,
    0x45,
    0x20,
    0x4d,
    0x41,
    0x4e,
    0x59,
    0x20,
    0x4c,
    0x49,
    0x4b,
    0x45,
    0x20,
    0x49,
    0x54,
    0x2c,
    0x20,
    0x42,
    0x55,
    0x54,
    0x20
]);




function $17eeb95744085dc3$export$248d38f6296296c5(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for(let i = 0; i < arr1.length; i++){
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}
async function $17eeb95744085dc3$export$2415c703e6c6c839(file1, file2) {
    const [b1, b2] = await Promise.all([
        file1.arrayBuffer(),
        file2.arrayBuffer()
    ]).then((b)=>b.map((c)=>new Uint8ClampedArray(c)));
    const buffer = new Uint8ClampedArray(b1.length + (0, $c122116bdd400350$export$d53c00440a6f6a93).length + b2.length);
    buffer.set(b1, 0);
    buffer.set((0, $c122116bdd400350$export$d53c00440a6f6a93), b1.length);
    buffer.set(b2, b1.length + (0, $c122116bdd400350$export$d53c00440a6f6a93).length);
    return new File([
        buffer
    ], file1.name, {
        type: file1.type
    });
}
function $17eeb95744085dc3$export$efbd64f598a8cdfe() {
    if (!document.title.startsWith("[SP]")) document.title = `[SP] ${document.title}`;
}
function $17eeb95744085dc3$export$c3da0dad1b44eea9(type, text, style) {
    const elem = document.createElement(type);
    if (text) elem.innerText = text;
    if (style) elem.setAttribute("style", style);
    return elem;
}


async function $cdbb37192f8e6220$export$2e2bcd8739ae039(url) {
    const image = await fetch(url).then((r)=>r.arrayBuffer()).then((b)=>new Uint8ClampedArray(b));
    const parts = $cdbb37192f8e6220$var$split(image);
    if (parts.length !== 2) return url;
    try {
        const [original, secret] = await Promise.all(parts.map($cdbb37192f8e6220$var$loadImageFromArrayBuffer));
        const canvas = (0, $17eeb95744085dc3$export$c3da0dad1b44eea9)("canvas");
        canvas.width = original.width;
        canvas.height = original.height;
        const ctx = canvas.getContext("2d");
        if (ctx === null) throw new Error("Failed to get canvas context");
        $cdbb37192f8e6220$export$4bdbf921f0c0fd8c(ctx, secret);
        return canvas.toDataURL();
    } catch (err) {
        console.error("Failed to extract url", err);
        return url;
    }
}
async function $cdbb37192f8e6220$var$loadImageFromArrayBuffer(arrayBuffer) {
    const blob = new Blob([
        arrayBuffer
    ]);
    const url = URL.createObjectURL(blob);
    return new Promise((resolve, reject)=>{
        const img = new (0, $2a0fbf601c6fec74$export$1a94f80a613efc3a)();
        img.onerror = (err)=>reject(err);
        img.onload = ()=>resolve(img);
        img.src = url;
    });
}
function $cdbb37192f8e6220$var$split(image) {
    for(let i = 0; i < image.length; i++){
        if (image[i] !== (0, $c122116bdd400350$export$d53c00440a6f6a93)[0]) continue;
        if ((0, $17eeb95744085dc3$export$248d38f6296296c5)((0, $c122116bdd400350$export$d53c00440a6f6a93), image.slice(i, i + (0, $c122116bdd400350$export$d53c00440a6f6a93).length))) return [
            image.slice(0, i),
            image.slice(i + (0, $c122116bdd400350$export$d53c00440a6f6a93).length)
        ];
    }
    return [
        image
    ];
}
function $cdbb37192f8e6220$export$4bdbf921f0c0fd8c(ctx, img) {
    const r = Math.min(ctx.canvas.width / img.width, ctx.canvas.height / img.height);
    let nw = img.width * r;
    let nh = img.height * r;
    let cx, cy, cw, ch, ar = 1;
    if (nw < ctx.canvas.width) ar = ctx.canvas.width / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < ctx.canvas.height) ar = ctx.canvas.height / nh;
    nw *= ar;
    nh *= ar;
    cw = img.width / (nw / ctx.canvas.width);
    ch = img.height / (nh / ctx.canvas.height);
    cx = (img.width - cw) * 0.5;
    cy = (img.height - ch) * 0.5;
    ctx.drawImage(img, Math.max(0, cx), Math.max(0, cy), Math.min(img.width, cw), Math.min(img.height, ch), 0, 0, ctx.canvas.width, ctx.canvas.height);
}



const $2a0fbf601c6fec74$export$1a94f80a613efc3a = window.Image;
class $2a0fbf601c6fec74$export$2e2bcd8739ae039 extends $2a0fbf601c6fec74$export$1a94f80a613efc3a {
    get src() {
        return super.src;
    }
    set src(url) {
        (0, $cdbb37192f8e6220$export$2e2bcd8739ae039)(url).then((extractedUrl)=>{
            if (extractedUrl !== url) (0, $17eeb95744085dc3$export$efbd64f598a8cdfe)();
            super.src = extractedUrl;
        });
    }
}



window.Image = (0, $2a0fbf601c6fec74$export$2e2bcd8739ae039);
window.addEventListener("load", ()=>{
    if (location.pathname === "/") $f5bfd4ce37214f4f$var$insertUploadForm();
});
function $f5bfd4ce37214f4f$var$insertUploadForm() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput === null) return;
    const wrapper = (0, $17eeb95744085dc3$export$c3da0dad1b44eea9)("div");
    const label = (0, $17eeb95744085dc3$export$c3da0dad1b44eea9)("label", "shadow puzzle tools", "margin-bottom: 5px");
    wrapper.appendChild(label);
    const helpText = (0, $17eeb95744085dc3$export$c3da0dad1b44eea9)("div", 'First pick all your images above, then select the secret images below and hit "Embed" to attach them.', "font-size: 12px");
    wrapper.appendChild(helpText);
    const formWrapper = (0, $17eeb95744085dc3$export$c3da0dad1b44eea9)("div", null, "display:flex;gap:20px;margin-top:20px");
    wrapper.appendChild(formWrapper);
    const input = (0, $17eeb95744085dc3$export$c3da0dad1b44eea9)("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "");
    input.setAttribute("accept", "image/jpg,image/jpeg,image/png");
    formWrapper.appendChild(input);
    const button = (0, $17eeb95744085dc3$export$c3da0dad1b44eea9)("button", "Embed");
    button.classList.add("button");
    button.setAttribute("disabled", "");
    formWrapper.appendChild(button);
    const notice = (0, $17eeb95744085dc3$export$c3da0dad1b44eea9)("span", null, "color:#59d259;font-size:12px;margin-top:6px;display:inline-block");
    wrapper.appendChild(notice);
    fileInput.parentNode?.parentNode?.insertBefore(wrapper, fileInput.parentNode.nextSibling);
    input.addEventListener("change", (evt)=>{
        evt.preventDefault();
        const inputElem = input;
        if (inputElem.files && inputElem.files?.length === 0) button.setAttribute("disabled", "");
        else button.removeAttribute("disabled");
    });
    button.addEventListener("click", async (evt)=>{
        evt.preventDefault();
        if (fileInput.files === null) return;
        const inputElem = input;
        let numFilesEmbedded = 0;
        const data = new DataTransfer();
        for(let i = 0; i < fileInput.files.length; i++){
            if (!inputElem.files?.[i]) {
                data.items.add(fileInput.files[i]);
                continue;
            }
            const mergedFile = await (0, $17eeb95744085dc3$export$2415c703e6c6c839)(fileInput.files[i], inputElem.files[i]);
            data.items.add(mergedFile);
            numFilesEmbedded += 1;
        }
        fileInput.files = data.files;
        inputElem.value = "";
        notice.innerText = `${numFilesEmbedded} file(s) embedded! You may now create the room.`;
        button.setAttribute("disabled", "");
    });
}


