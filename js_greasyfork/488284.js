// ==UserScript==
// @name        3D Warehouse 3D Model Downloader
// @name:pt     Baixe modelos do 3D Warehouse
// @name:pt-BR  Baixe modelos do 3D Warehouse
// @name:pt-PT  Baixe modelos do 3D Warehouse
// @name:es     Descargador de modelos 3D de la 3D Warehouse
// @name:cs     Sklad 3D Stahovač 3D modelů
// @name:fr     Téléchargeur de modèles 3D Entrepôt 3D
// @name:zh     3D 模型库 3D 模型下载器
// @name:ja     3D ギャラリー 3D モデル ダウンローダー
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  A script that you can download models from 3D Warehouse (SketchUp Version 8,17,18,19,20,21,GBL,USDZ,Collada)
// @description:pt      Um script que você pode baixar modelos do 3D Warehouse (SketchUp Versão 8,17,18,19,20,21,GBL,USDZ,Collada)
// @description:pt-BR   Um script que você pode baixar modelos do 3D Warehouse (SketchUp Versão 8,17,18,19,20,21,GBL,USDZ,Collada)
// @description:pt-PT   Um script que você pode baixar modelos do 3D Warehouse (SketchUp Versão 8,17,18,19,20,21,GBL,USDZ,Collada)
// @description:es      Un script que puedes descargar modelos desde 3D Warehouse (SketchUp Versión 8,17,18,19,20,21,GBL,USDZ,Collada)
// @description:cs      Skript, pomocí kterého si můžete stáhnout modely z 3D Warehouse (SketchUp verze 8,17,18,19,20,21,GBL,USDZ,Collada)
// @description:fr      Un script permettant de télécharger des modèles depuis 3D Warehouse (SketchUp Version 8,17,18,19,20,21,GBL,USDZ,Collada)
// @description:zh      可以从 3D 模型库下载模型的脚本（SketchUp 版本 8、17、18、19、20、21、GBL、USDZ、Collada）
// @description:ja      3D ギャラリーからモデルをダウンロードできるスクリプト (SketchUp バージョン 8,17,18,19,20,21,GBL,USDZ,Collada)
// @author       Zlajoyast
// @match        https://3dwarehouse.sketchup.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sketchup.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/488284/3D%20Warehouse%203D%20Model%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/488284/3D%20Warehouse%203D%20Model%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function appendbutton(elem, text, func) {
        let b = document.createElement("button");
        b.innerHTML = text;
        b.className = "btn primary-btn btn-primary";
        b.setAttribute("data-v-2b73d9af", "");
        b.onclick = func;
        elem.appendChild(b);
    }
    function Initialize_Script() {
        // Constroi a UI
        let div = getElementByXpath("//div[@class='details-header header']")
        if (div == undefined)
            return;
        // obtem  a inforamção do modelo
        let url = window.document.URL.split("/");
        let id = url[url.length - 2];
        fetched = true;
        fetch('https://3dwarehouse.sketchup.com/warehouse/v1.0/entities/' + id, {
            method: "GET",
            headers: { "Content-type": "application/json; charset=UTF-8" },
        }).then(response => response.text())
            .then(json => {
                let fetchinfo = JSON.parse(json);
                console.log(fetchinfo);
                if (fetchinfo.binaries.glb != undefined) {
                    appendbutton(div, "Download GBL File", () => {
                        window.open(fetchinfo.binaries.glb.contentUrl);
                    });
                }
                if (fetchinfo.binaries.usdz != undefined) {
                    appendbutton(div, "Download USDZ File", () => {
                        window.open(fetchinfo.binaries.usdz.contentUrl)
                    });
                }
                if (fetchinfo.binaries.s8 != undefined) {
                    appendbutton(div, "Download SketchUp 8 File", () => {
                        window.open(fetchinfo.binaries.s8.contentUrl)
                    });
                }
                if (fetchinfo.binaries.s17 != undefined) {
                    appendbutton(div, "Download SketchUp 17 File", () => {
                        window.open(fetchinfo.binaries.s17.contentUrl)
                    });
                }
                if (fetchinfo.binaries.s18 != undefined) {
                    appendbutton(div, "Download SketchUp 18 File", () => {
                        window.open(fetchinfo.binaries.s18.contentUrl)
                    });
                }
                if (fetchinfo.binaries.s19 != undefined) {
                    appendbutton(div, "Download SketchUp 19 File", () => {
                        window.open(fetchinfo.binaries.s19.contentUrl)
                    });
                }
                if (fetchinfo.binaries.s20 != undefined) {
                    appendbutton(div, "Download SketchUp 20 File", () => {
                        window.open(fetchinfo.binaries.s20.contentUrl)
                    });
                }
                if (fetchinfo.binaries.s21 != undefined) {
                    appendbutton(div, "Download SketchUp 21 File", () => {
                        window.open(fetchinfo.binaries.s21.contentUrl)
                    });
                }
                if (fetchinfo.binaries.zip != undefined) {
                    appendbutton(div, "Download Collada File", () => {
                        window.open(fetchinfo.binaries.zip.contentUrl)
                    });
                }
            });
    }
    var fetched = false;
    var prevurl;
    function Find_UI() {
        // verifica se a ui foi carregada
        setInterval(() => {
            if (getElementByXpath("//button[contains(@data-cy,'download')]") != undefined && fetched==false) {
                prevurl = new URL(window.document.URL).pathname;
                Initialize_Script();
            }
        }, 1000);
    }
    navigation.addEventListener('navigate', () => {
        let url = event.destination.url;
        console.log(url);
        if (prevurl != new URL(url).pathname)
        {
            fetched=false;
        }
    })
    Find_UI();
})();