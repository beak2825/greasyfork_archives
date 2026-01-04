// ==UserScript==
// @name         Ig tools
// @version      0.4
// @description  Copy Username, Download Image.
// @license      MIT
// @homepageURL  https://github.com/willy67k/tampermonkey-userscripts
// @homepage     https://github.com/willy67k/tampermonkey-userscripts
// @source       https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/ig-tools.js
// @namespace    https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/ig-tools.js
// @author       Lilp
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497703/Ig%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/497703/Ig%20tools.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function allowImgRightClick() {
        const wrapper = document.querySelectorAll("._aagw");
        wrapper.forEach((el) => {
            el.style.pointerEvents = "none";
        });
    }

    function copyName(name) {
        const a = document.querySelector(
            ".x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz._acan._acao._acat._acaw._aj1-._ap30._a6hd"
        );
        if (!a) return;
        name.current = a.textContent;
        const parent = a.closest("div");

        let input = parent.querySelector("input");
        let btnCopy = parent.querySelector("button");

        if (!input || !btnCopy) {
            input = document.createElement("input");
            btnCopy = document.createElement("button");
            parent.append(input);
            parent.append(btnCopy);
            btnCopy.addEventListener("click", () => {
                input.select();
                input.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(input.value);
            });
        }

        input.value = name.current;
        input.hidden = true;

        btnCopy.type = "button";
        btnCopy.textContent = "Copy Name";
    }

    function downloadImage(name) {
        const lis = document.querySelectorAll("._aagw");
        lis.forEach((el) => {
            if (document.querySelector(".x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1")) return;
            if (el.closest("._aa6g") || el.closest("._aabd._aa8k._al3l")) return;
            el = el.closest("._aagu");
            const imgSrc = el.querySelector("img").src;
            const extendFiles = [".jpg", ".webp", "png"];
            let extend = "";
            extendFiles.forEach((ef) => {
                if (imgSrc.indexOf(ef) !== -1) {
                    extend = ef;
                }
            });
            const imgName = `${name.current}-${imgSrc.split(extend)[0].split("/").splice(-1, 1)[0]}${extend}`;

            let btn = el.querySelector("button");
            if (!btn) {
                btn = document.createElement("button");

                btn.type = "button";
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V12.1893L14.4697 10.4697C14.7626 10.1768 15.2374 10.1768 15.5303 10.4697C15.8232 10.7626 15.8232 11.2374 15.5303 11.5303L12.5303 14.5303C12.3897 14.671 12.1989 14.75 12 14.75C11.8011 14.75 11.6103 14.671 11.4697 14.5303L8.46967 11.5303C8.17678 11.2374 8.17678 10.7626 8.46967 10.4697C8.76256 10.1768 9.23744 10.1768 9.53033 10.4697L11.25 12.1893V7C11.25 6.58579 11.5858 6.25 12 6.25ZM8 16.25C7.58579 16.25 7.25 16.5858 7.25 17C7.25 17.4142 7.58579 17.75 8 17.75H16C16.4142 17.75 16.75 17.4142 16.75 17C16.75 16.5858 16.4142 16.25 16 16.25H8Z" fill="#1C274C"/> </svg>`;
                btn.style.cssText = ` width: 28px; height: 28px; position: absolute; top: 12px; left: 12px; background: white; padding: 0; margin: 0; border: 0; border-radius: 7px; cursor: pointer;`;
                el.append(btn);

                btn.addEventListener("click", async () => {
                    await downloadImage(imgSrc, imgName);
                });
            }
        });

        async function downloadImage(imageSrc, nameOfDownload = "my-image.png") {
            const response = await fetch(imageSrc);

            const blobImage = await response.blob();

            const href = URL.createObjectURL(blobImage);

            const anchorElement = document.createElement("a");
            anchorElement.href = href;
            anchorElement.download = nameOfDownload;

            document.body.appendChild(anchorElement);
            anchorElement.click();

            document.body.removeChild(anchorElement);
            window.URL.revokeObjectURL(href);
        }
    }

    setInterval(() => {
        const name = {};
        allowImgRightClick();
        copyName(name);
        downloadImage(name);
    }, 300);
})();
