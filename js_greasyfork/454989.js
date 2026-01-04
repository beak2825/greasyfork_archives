// ==UserScript==
// @name         NyPhil
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Download NyPhil Archive
// @author       Fr0stbyteR
// @license      MIT
// @match        https://archives.nyphil.org/index.php/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyphil.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454989/NyPhil.user.js
// @updateURL https://update.greasyfork.org/scripts/454989/NyPhil.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REQ_INFO_URL = 'https://archives.nyphil.org/index.php/booksearch/';
    const REQ_PAGE_URL = 'https://archives.nyphil.org/index.php/jp2/';
    const downloadCall = async (filename, pages, onUpdate) => {
        onUpdate('Preparing files...');
        const pdf = new jspdf.jsPDF({
            unit: "px",
            hotfixes: ["px_scaling"]
        });
        pdf.deletePage(1);
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const { location, orientation } = page;
            // const filename = location.match(/[^/]+$/)[0];
            const url = `${REQ_PAGE_URL}${location.replaceAll('/', '|')}/${orientation}/3000`;
            const img = new Image();
            const canvas = document.createElement("canvas");
            await new Promise((resolve, reject) => {
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    pdf.addPage([img.width, img.height], orientation);
                    pdf.addImage(canvas, 'JPEG', 0, 0, img.width, img.height);
                    onUpdate(`Downloaded ${i + 1}/${pages.length}`);
                    j++;
                    resolve();
                };
                img.onerror = reject;
                img.src = url;
            });
        };
        onUpdate("Generating PDF...");
        const blob = await pdf.output("blob", filename);
        onUpdate("Done...");
        return blob;
    };
    const init = async () => {
        const infoList = document.querySelectorAll('div.infoWrapper');
        for (const info of infoList) {
            try {
                const name = info.querySelector('h2').innerText.replace(/([^a-z0-9 ,.]+)/gi, '-');
                const links = info.querySelector('ul.explicitLinks');
                if (links.children.length < 2) continue;
                const id = links.lastElementChild.firstElementChild.href.match(/\/([a-f\d-.]+)\//)[1];
                console.log(name, id);
                const resp = await fetch(`${REQ_INFO_URL}${id}`);
                const pages = await resp.json();
                const prepare = document.createElement('a');
                prepare.href = '#';
                prepare.innerText = 'Prepare';
                let dl;
                prepare.addEventListener("click", async (e) => {
                    e.preventDefault();
                    if (!dl) {
                        const filename = `${name}.pdf`;
                        const zipBlob = await downloadCall(filename, pages, (text) => prepare.textContent = text);
                        const url = URL.createObjectURL(zipBlob);
                        dl = document.createElement('a');
                        dl.href = '#';
                        dl.download = filename;
                        dl.innerText = 'Download';
                        dl.href = url;
                        links.appendChild(dl);
                        prepare.hidden = true;
                        dl.click();
                    }
                });
                links.appendChild(prepare);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const scriptJsPdf = document.createElement("script");
    scriptJsPdf.src = "https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js";
    document.body.appendChild(scriptJsPdf);
    scriptJsPdf.onload = init;
})();