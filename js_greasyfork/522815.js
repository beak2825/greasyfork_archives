// ==UserScript==
// @name         Kepler Script
// @author       KazuroAkashi
// @match        https://obs.itu.edu.tr/ogrenci/
// @license MIT
// @version 0.0.1.20251019194606
// @namespace https://greasyfork.org/users/1419483
// @description Kepler için notlar
// @downloadURL https://update.greasyfork.org/scripts/522815/Kepler%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/522815/Kepler%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getJWT() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://obs.itu.edu.tr/ogrenci/auth/jwt");

            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.send();
        })
    }

    async function getDonemListesi(jwt) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://obs.itu.edu.tr/api/ogrenci/DonemListesi");
            xhr.setRequestHeader("Authorization", "Bearer " + jwt);

            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.status);
                }
            };
            xhr.send();
        })
    }

    async function getSinifListesi(jwt, donemId) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://obs.itu.edu.tr/api/ogrenci/sinif/KayitliSinifListesi/" + donemId);
            xhr.setRequestHeader("Authorization", "Bearer " + jwt);

            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.status);
                }
            };
            xhr.send();
        })
    }

    async function getHarfNotuListesi(jwt, donemId) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://obs.itu.edu.tr/api/ogrenci/Sinif/SinifHarfNotuListesi/" + donemId);
            xhr.setRequestHeader("Authorization", "Bearer " + jwt);

            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    const arr = JSON.parse(xhr.response).sinifHarfNotuResultList;
                    const obj = {};

                    for (const not of arr) {
                        obj[not.crn] = not.harfNotu;
                    }

                    resolve(obj);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.send();
        })
    }

    async function getNotListesi(jwt, sinifId) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://obs.itu.edu.tr/api/ogrenci/Sinif/SinifDonemIciNotListesi/" + sinifId);
            xhr.setRequestHeader("Authorization", "Bearer " + jwt);

            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.status);
                }
            };
            xhr.send();
        })
    }

    String.prototype.formatStr = String.prototype.formatStr ||
        function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
            : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };

    const htmlParser = new DOMParser();
    function createHTMLElement(str) {
        const doc = htmlParser.parseFromString(str, "text/html");
        return doc.body.firstChild;
    }

    function insertBeforeHTMLElement(str, el) {
        const insert = createHTMLElement(str);
        el.parentElement.insertBefore(insert, el);
    }

    const newOptionTemplate = `
<option value="{id}">{name}</option>
`;

    const newCardTemplate = `
<div class="row">
  <div class="col-md-12 mb-5">
    <div class="card info-graphic info-graphic--service">
      <div class="card-body">
        <h2>Notlar</h2>
        <h4 style="font-weight: 600; margin-left: 10px;">Yeni girilen: <span style="color: {3}">{2}</span></h4>
        <button id="notscript-notifperm">Bildirimleri Aç</button>
        <select id="notscript-donemlist" class="form-control" style="margin: 10px">
          {1}
        </select>
        <div class="row" style="justify-content: center; align-items: center;">
          <input id="notscript-hidetrivial" type="checkbox">
          <label for="notscript-hidetrivial" style="padding-left: 10px; margin: 0; user-select: none;">Hiç not girilmemiş dersleri gizle</label>
        </div>
        {0}
      </div>
    </div>
  </div>
</div>
`;

    const newDonemTemplate = `
<div style="display: none" class="notscript-donem" data-id={id}>{classes}</div>
`;

    const newClassTemplateTable = `
<div class="col-lg-12 mb-3 notscript-class" data-crn="{crn}">
  <h4 style="font-weight: 600; position: relative;"><span id="notscript-updatedot-{crn}" style="display: none; position: absolute; left: -15px; width: 6px; height: 6px; background: green; border-radius: 50%; top: 7px; box-shadow: 0 0 2px 2px rgb(from green r g b / 0.5);"></span>{name}</h4>
  <div class="table-vertical table-vertical--unheight">
    <table class="table table-striped table-bordered" style="table-layout: fixed">
      <tbody>
        {notes}
        <tr>
          <th class="title" style="width: 40%">Ağırlıklı Ortalama</th>
          <td>{average}</td>
        </tr>
        <tr style="display: {harfnotudisp}">
          <th class="title" style="width: 40%">Harf Notu</th>
          <td style="text-shadow: 0 0 4px rgb(from {harfnotucolor} r g b / .4); font-weight: 600; font-size: 2rem; color: {harfnotucolor}">{harfnotu}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`;

    const newNoteTemplateTable = `
<tr>
  <th class="title" style="width: 40%">{name} - %{perc} - Sıra: {pos}/{enrolled} - Ort. {avg} - S.Sap {devi}</th>
  <td>{note}</td>
</tr>
`;

    const classLineTemplate = `
<div id="notscript-line-{crn}" style="width: 100%; height: 1px; background: #358aed; margin-bottom: 15px; margin-top: 13px;"></div>
`;

    const donems = {};

    const changes = [];
    const changescrn = [];

    async function generateDonemElement(donemId, hidecrns, jwt) {
        const sinifListesi = (await getSinifListesi(jwt, donemId)).kayitSinifResultList;
        const harfNotuListesi = (await getHarfNotuListesi(jwt, donemId));

        let classesEl = "";
        for (const sinif of sinifListesi) {
            if (classesEl !== "") classesEl += classLineTemplate.formatStr({ crn: sinif.crn });

            const sinifNameEn = sinif.bransKodu + sinif.dersKodu + " - " + sinif.dersAdiEN + " (CRN: " + sinif.crn + ")";
            const sinifNameTr = sinif.bransKodu + sinif.dersKodu + " - " + sinif.dersAdiTR + " (CRN: " + sinif.crn + ")";
            const sinifId = sinif.sinifId;

            const notListesiObj = (await getNotListesi(jwt, sinifId));
            const notListesi = notListesiObj.sinifDonemIciNotListesi;
            const ortalama = notListesiObj.ortalama;

            const savedOrtalama = window.localStorage.getItem("crn" + sinif.crn + ".ortalama");
            const savedHarfNotu = window.localStorage.getItem("crn" + sinif.crn + ".harfnotu");

            if (savedOrtalama !== ortalama || (harfNotuListesi[sinif.crn] && savedHarfNotu !== harfNotuListesi[sinif.crn])) {
                changes.push(sinif.dersAdiTR);
                changescrn.push(sinif.crn);
            }

            window.localStorage.setItem("crn" + sinif.crn + ".ortalama", ortalama);
            window.localStorage.setItem("crn" + sinif.crn + ".harfnotu", harfNotuListesi[sinif.crn]);

            window.localStorage.setItem("crn" + sinif.crn + ".notif_ortalama", ortalama);
            window.localStorage.setItem("crn" + sinif.crn + ".notif_harfnotu", harfNotuListesi[sinif.crn]);

            let notesEl = "";
            for (const not of notListesi) {
                const name = not.degerlendirmeOlcutuAdi;
                const perc = not.degerlendirmeKatkisi;
                const note = not.not;
                const pos = not.sinifSirasi;
                const enrolled = not.ogrenciSayisi;
                const avg = not.ortalama;
                const devi = not.standartSapma;

                notesEl += newNoteTemplateTable.formatStr({ name, perc, note, pos, enrolled, avg, devi });
            }

            if (notListesi.length === 0 && !harfNotuListesi[sinif.crn]) {
                hidecrns.push(sinif.crn);
            }

            let harfnotudisp = "none";
            let harfnotu = "";
            let harfnotucolor = "red"
            if (harfNotuListesi[sinif.crn]) {
                harfnotudisp = "";
                harfnotu = harfNotuListesi[sinif.crn];

                if (harfnotu === "AA" || harfnotu === "BL") {
                    harfnotucolor = "#22bb22";
                } else if (harfnotu === "BA+" || harfnotu === "BA" || harfnotu === "BB+" || harfnotu === "BB") {
                    harfnotucolor = "#22dd22"
                } else if (harfnotu === "CB+" || harfnotu === "CB" || harfnotu === "CC+" || harfnotu === "CC") {
                    harfnotucolor = "#aadd22"
                } else if (harfnotu === "DC+" || harfnotu === "DC" || harfnotu === "DD+" || harfnotu === "DD") {
                    harfnotucolor = "#dddd22"
                } else if (harfnotu === "VF" || harfnotu === "FF" || harfnotu === "BZ") {
                    harfnotucolor = "#dd2222"
                }
            }

            classesEl += newClassTemplateTable.formatStr({ crn: sinif.crn, name: sinifNameTr, notes: notesEl, average: ortalama, harfnotudisp, harfnotu, harfnotucolor });
        }

        donems[donemId] = newDonemTemplate.formatStr({ id: donemId, classes: classesEl });
    }

    async function printNotlar() {
        const jwt = await getJWT();
        const donemListesi = (await getDonemListesi(jwt)).ogrenciDonemListesi;
        let sonDonem = donemListesi[donemListesi.length - 1];
        let sonDonemId = sonDonem.akademikDonemId;

        if (sonDonemId === -1) {
            donemListesi.pop();
            sonDonem = donemListesi[donemListesi.length - 2];
            sonDonemId = sonDonem.akademikDonemId;
        }

        const addBefore = document.querySelectorAll(".obs > .container-fluid > div > .row")[1];

        const hidecrns = [];
        let donemOptList = "";

        for (let i = donemListesi.length - 1; i >= 0; i--) {
            const donem = donemListesi[i];
            donemOptList += newOptionTemplate.formatStr({ id: donem.akademikDonemId, name: donem.akademikDonemAdi });
        }

        await generateDonemElement(sonDonemId, hidecrns, jwt);

        const cardEl = newCardTemplate.formatStr(donems[sonDonemId], donemOptList, changes.length === 0 ? "Yok" : changes.join(", "), changes.length === 0 ? "red" : "green");
        const cardEll = createHTMLElement(cardEl);
        addBefore.parentElement.insertBefore(cardEll, addBefore);

        const sonDonemEl = cardEll.querySelector("div[data-id=\"" + sonDonemId + "\"]");

        const donemlistEl = cardEll.querySelector("#notscript-donemlist");

        donemlistEl.onchange = async (e) => {
            const donemElList = cardEll.querySelectorAll(".notscript-donem");

            for (const donem of donemElList) {
                if (donem.dataset.id === donemlistEl.value) donem.style.display = "";
                else donem.style.display = "none";
            }

            if (!donems[donemlistEl.value]) {
                await generateDonemElement(donemlistEl.value, hidecrns, jwt);

                const donemEl = createHTMLElement(donems[donemlistEl.value]);
                sonDonemEl.parentElement.insertBefore(donemEl, sonDonemEl);

                donemEl.style.display = "";
            }
        }
        donemlistEl.onchange();

        for (const changecrn of changescrn) {
            sonDonemEl.querySelector("#notscript-updatedot-"+changecrn).style.display = "";
        }

        const notifpermBtn = cardEll.querySelector("#notscript-notifperm");
        if (Notification.permission === "granted") {
            notifpermBtn.style.display = "none";
        }
        notifpermBtn.onclick = () => {
            Notification.requestPermission().then((perm) => {
                if (perm === "granted") {
                    notifpermBtn.style.display = "none";
                    setInterval(async () => {
                        console.log("Güncelleme kontrol ediliyor...");
                        const sinifListesi = (await getSinifListesi(jwt, sonDonemId)).kayitSinifResultList;
                        const harfNotuListesi = (await getHarfNotuListesi(jwt, sonDonemId));

                        for (const sinif of sinifListesi) {
                            const sinifNameEn = sinif.bransKodu + sinif.dersKodu + " - " + sinif.dersAdiEN + " (CRN: " + sinif.crn + ")";
                            const sinifNameTr = sinif.bransKodu + sinif.dersKodu + " - " + sinif.dersAdiTR + " (CRN: " + sinif.crn + ")";
                            const sinifId = sinif.sinifId;

                            const notListesiObj = (await getNotListesi(jwt, sinifId));
                            const notListesi = notListesiObj.sinifDonemIciNotListesi;
                            const ortalama = notListesiObj.ortalama;

                            const savedOrtalama = window.localStorage.getItem("crn" + sinif.crn + ".notif_ortalama");
                            const savedHarfNotu = window.localStorage.getItem("crn" + sinif.crn + ".notif_harfnotu");

                            if (savedOrtalama !== ortalama || (harfNotuListesi[sinif.crn] && savedHarfNotu !== harfNotuListesi[sinif.crn])) {
                                new Notification(sinif.dersAdiTR + " notunda güncelleme var!");
                            }

                            window.localStorage.setItem("crn" + sinif.crn + ".notif_ortalama", ortalama);
                            window.localStorage.setItem("crn" + sinif.crn + ".notif_harfnotu", harfNotuListesi[sinif.crn]);
                        }
                    }, 30000);
                }
            });
        }

        const hidetrivialEl = cardEll.querySelector("#notscript-hidetrivial");
        hidetrivialEl.checked = window.localStorage.getItem("hide_trivial_classes");

        const classes = cardEll.querySelectorAll(".notscript-class");

        hidetrivialEl.onchange = (e) => {
            const trivialClasses = classes.values().filter(cl => hidecrns.includes(cl.dataset.crn)).toArray();
            const disp = hidetrivialEl.checked ? "none" : "";
            window.localStorage.setItem("hide_trivial_classes", hidetrivialEl.checked);
            for (const cl of trivialClasses) {
                cl.style.display = disp;

                const line = cardEll.querySelector("#notscript-line-" + cl.dataset.crn);
                line.style.display = disp;
            }
        }

        hidetrivialEl.onchange();

        notifpermBtn.onclick();
    }

    printNotlar();


})();