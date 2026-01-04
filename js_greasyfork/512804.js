// ==UserScript==
// @name         Minitoon editor+
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds some features to the editor.
// @author       discord: #ineonz minitoon: @WildNeonz
// @match        https://minitoon.me/draw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minitoon.me
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512804/Minitoon%20editor%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/512804/Minitoon%20editor%2B.meta.js
// ==/UserScript==
//window.editor._$4l
let started = false;

const start = () => {
    started = true;
    function createButton() {
        let button = document.querySelector("body > div.default-main > div.minidraw-editor-c > div.mteditor-bottom-c > div.mteditor-pages-c4 > div.mteditor-pages-c2 > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div > div.mteditor-pageoptions-c > div.mteditor-pageoption-c.mteditor-pageoption-deletepage").cloneNode(true);
        document.querySelector("body > div.default-main > div.minidraw-editor-c > div.mteditor-bottom-c > div.mteditor-pages-c4 > div.mteditor-pages-c2 > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div > div.mteditor-pageoptions-c").appendChild(button);

        return button;
    }
    let switchFile = createButton();
    let clonePage = createButton();
    let postGif = createButton();
    postGif.textContent = 'Post Gif '
    switchFile.textContent = 'Upload Image (override page)';
    clonePage.textContent = 'Clone Page';

    postGif.onclick = () => {
        let inp = askFile();
        inp.onchange = (e) => {
            let a = e.target.files[0];

            let imageReader = new FileReader();
            console.log2("haha");
            imageReader.onload = () => {
                let result = imageReader.result;
                var a = window.editor._$x();
                a.ps.img0 = result;
                console.log2(a);

                window._$57("Uploading minitoon...", 30000);
                window._$1C._$8G("/ajax/publish.php", a, function(a) {
                  window._$57("Successfully published!", 4000);
                });
            }
            imageReader.readAsDataURL(a);
        }
    }

    let lastPage;
    setInterval(() => {
        let addPage = document.querySelector("body > div.default-main > div.minidraw-editor-c > div.mteditor-bottom-c > div.mteditor-pages-c4 > div.mteditor-pages-c2 > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div > div.mteditor-previews-c2 > div > div.mteditor-preview.mteditor-previews-newpage");
        if (addPage && !addPage.inj) {
            if (lastPage) {
                lastPage.remove();
            }
            let addPage2 = addPage.cloneNode(true);
            addPage2.inj = true;
            addPage.parentNode.replaceChild(addPage2, addPage);
            addPage2.onclick = () => {
                addPage2.remove();
                var a = window.editor._$8C();
                a._$8O();
                window.editor._$1X(window.editor._$20.length - 1);
            }
            lastPage = addPage2;
        }
    },10);

    clonePage.onclick = () => {
        let page = window.editor._$4l;
        let orig = window.editor._$20[page];
        let clone = Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
        let orig2 = window.editor._$2x[page];
        let clone2 = Object.assign(Object.create(Object.getPrototypeOf(orig2)), orig2);

        window.editor._$20.push(clone);
        window.editor._$2x.push(clone2);
        window.editor._$1X(window.editor._$20.length - 1);
        let file = getFile();
        loadFile(file);
        setTimeout(() => {
            window.editor._$1X(window.editor._$20.length - 1);
        },200);
    }

    function askFile() {
        let input = document.createElement('input');
        input.type = 'file';
        input.click();
        return input;
    }

    function buildData(a) {
        var g = window.editor._$20[a];
        var c = g._$2Q(a);
        return c.data;
    }

    function loadFile(a) {
        let editor = window.editor;
        try {
            editor._$3U(a, function() {
                editor._$7r(true);
                editor._$9o();
                editor._$8D.value = "";
                editor.draftkey = -1;
                window.history.replaceState({}, "", "/draw");
            })
        } catch (c) {
            window._$57("Failed to load the draft: Invalid Draft File!", 6000);
        }
    }

    switchFile.onclick = () => {
        let input = askFile();
        input.onchange = (e) => {
            let a = e.target.files[0];

            let imageReader = new FileReader();
            imageReader.onload = () => {
                let img = new Image();
                img.src = imageReader.result;
                img.onload = () => {
                    let image = imageReader.result.split('base64,')[1];

                    let page = window.editor._$4l;
                    let data = buildData(page);
                    console.log2(data);
                    let mainlayer = data.layers[1].k;
                    let filename = page+'-'+mainlayer+'.png'
                    window.editor._$20[page].w = img.width;
                    window.editor._$20[page].h = img.height;
                    window.editor._$20[page].width = img.width;
                    window.editor._$20[page].height = img.height;
                    let file = getFile();
                    file.file(filename,image,{
                        "base64": true
                    })
                    loadFile(file);
                    setTimeout(() => {
                        window.editor._$1X(page);
                    },200);
                }
            }
            imageReader.readAsDataURL(a)
        }
    }

    function getFile() {
        let editor = window.editor;

        let a = editor._$1T();
        console.log2(a);
        return a;
    }

    function downloadFile(a) {
        a.generateAsync({
            type: "blob"
        }).then(function(c) {
            let a = new Date();
            let d = a.getDate() + "-" + (a.getMonth() + 1) + "-" + a.getFullYear() + "_" + a.getHours() + "-" + a.getMinutes();
            let e = editor.title._$4P().replace(/\s/g, '');
            let b = e + "-" + d + ".zip";
            window.saveAs(c, b);
        }
                .bind(editor), function(a) {
            window._$57("Cannot generate source files.", 3000);
        });
        return 0;
    }
}
let tisdi

tisdi = setInterval(() => {
    try {
        start();
        clearInterval(tisdi);
    }catch (err){

    }
},500);
