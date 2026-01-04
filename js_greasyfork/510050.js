// ==UserScript==
// @name         Nyeis Export
// @namespace    http://tampermonkey.net/
// @version      2024-09-20
// @license      GPL-3
// @description  Export all records to zip file from nyeis
// @author       You
// @match        *://nyeis.health.state.ny.us/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510050/Nyeis%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/510050/Nyeis%20Export.meta.js
// ==/UserScript==

function download(filename, text) {
    let element = document.createElement('a');
    let blob = new Blob([text], { type: 'octet/stream' });
    let url = URL.createObjectURL(blob);
    element.setAttribute('href', url);
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

(function() {
    const div = document.createElement('div');

    div.style.bottom = 0;
    div.style.background = 'gray';
    div.style.height = '100px';
    div.style.width = '100px';

    div.style.zIndex = 999999;
    div.style.position = 'absolute';

    const btn = document.createElement('button');
    btn.innerText = 'Export All';
    btn.style.padding = '10px';

    let text = document.createElement('span');

    div.appendChild(btn);
    div.appendChild(text);

    btn.addEventListener('click', async () => {
        let count = 0;
        const zip = new window.JSZip();

        let links = document.querySelectorAll('a');

        for (let link of links) {
            let href = link.href;

            if (!href.includes('Case_resolveCaseHomePage.do')) continue;

            let caseRef = link.innerText.trim();

            let { search } = new URL(href);
            let params = new URLSearchParams(search);

            let id = params.get('caseID');

            let res = await fetch(`/NYEIS/en_US/EIS_IntegratedCase_listAttachmentPage.do?caseID=${id}`);
            let data = await res.text();

            if (data.includes("You do not have rights to view this Child's Information")) continue;

            let regex = /<a href="(Case_viewAttachmentPage.do[^"]+)" class="DEFAULT">View<\/a>/;
            let pdfs = data.match(new RegExp(regex, 'g'));

            let promises = [];

            for (let pdf of pdfs) {
                let viewUrl = pdf.match(regex)[1].replace(/&amp;/g, '&');

                let res = await fetch(`/NYEIS/en_US/${viewUrl}`);
                let data = await res.text();

                let [nul, filePath, fileName] = data.match(/<a href="..\/(servlet\/FileDownload[^"]+)">([^<]+)<\/a>/);

                let res2 = await fetch(`/NYEIS/${filePath.replace(/&amp;/g, '&')}`);
                let data2 = await res2.arrayBuffer();

                const add = async () => {
                    text.innerText = `Files: ${++count}`;

                    return { fileName, data: data2 };
                }

                promises.push(add());
            }

            let datas = await Promise.all(promises);

            for (let { fileName, data } of datas) {
                zip.folder(caseRef).file(fileName, data);
            }
        }

        zip.generateAsync({ type: 'blob' }).then(blob => {
            download('export.zip', blob);
        }, err => {
            console.log(err);
        });
    });

    document.body.appendChild(div);
})();