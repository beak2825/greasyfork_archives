// ==UserScript==
// @name         Zobrazenie Kuzlenia pri vladcovi
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Zobrazi hlasenia na zemke
// @author       You
// @match        https://www.darkelf.cz/l.asp*
// @match        https://www.darkelf.cz/e.asp*
// @icon         https://www.google.com/s2/favicons?domain=darkelf.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428077/Zobrazenie%20Kuzlenia%20pri%20vladcovi.user.js
// @updateURL https://update.greasyfork.org/scripts/428077/Zobrazenie%20Kuzlenia%20pri%20vladcovi.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const spellTrStyle = "font-weight:bold;font-size:small;color:#7777AB;";

    let id = document.URL.split("=")[1];
    console.log(id);
    // Your code here...
    let dom = await getDomFromUrl("https://www.darkelf.cz/hlaseni_all.asp","GET");

    let dom1 = await getDomFromUrl("https://www.darkelf.cz/lands_names_inc.asp","GET");
    let lands = JSON.parse(dom1.body.innerHTML);

    let aliNames = [...(await getDomFromUrl("https://www.darkelf.cz/aliance.asp","GET")).querySelectorAll("a[target='mail']")].map(x=>x.innerText);

    let land = lands[id]
    land[0]=land[0]+" - ";
    land[1]=land[1]+" - ";

    let spellTr = [...dom.querySelectorAll("tr")].filter(x=>(x.innerHTML.includes(land[0])||x.innerHTML.includes(land[1]))&&x.getAttribute("style")==spellTrStyle)

    spellTr.forEach(x=>{
        x.removeChild(x.childNodes[1]);
        x.removeChild(x.childNodes[8]);
        x.removeChild(x.childNodes[4]);
        let next = x.nextElementSibling;
        let stop =false;
        aliNames.forEach(x=>{
            if(next.innerText.trim().startsWith(x)){
            stop = true;
            return;
            }
        })
        if(stop)
        {
            return;
        }
        document.body.append(x);
        document.body.append(next);
    })

    let attackTr = [...dom.querySelectorAll("tr")].filter(x=>(x.innerHTML.includes(land[0])||x.innerHTML.includes(land[1]))&&x.getAttribute("style")===null)

    attackTr.forEach(y=>{
        let x = y.previousElementSibling;
        x.removeChild(x.childNodes[1]);
        x.removeChild(x.childNodes[8]);
        x.removeChild(x.childNodes[4]);
        document.body.append(x);
        document.body.append(y);
    })

    async function getDomFromUrl(url, method, body = undefined) {
        const getBlob = (url) => {
            return new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                if (method.toUpperCase() == 'POST') {
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    let status = xhr.status;
                    if (status == 200) {
                        resolve(xhr.response);
                    } else {
                        reject(status);
                    }
                };
                xhr.send(body);
            });
        };
        const readWithFileReaderAndWindowsEncoding = (inputFile) => {
            const temporaryFileReader = new FileReader();

            return new Promise((resolve, reject) => {
                temporaryFileReader.onerror = () => {
                    temporaryFileReader.abort();
                    reject(new DOMException("Problem parsing input file."));
                };

                temporaryFileReader.onload = () => {
                    resolve(temporaryFileReader.result);
                };
                temporaryFileReader.readAsText(inputFile, 'windows-1250');
            });
        };
        let res = (await getBlob(url));
        let text = (await readWithFileReaderAndWindowsEncoding(res));
        let dom = new DOMParser().parseFromString(text, 'text/html');

        return dom;
    }
})();