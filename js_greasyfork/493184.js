// ==UserScript==
// @name         Download protected PDF file from Google Drive
// @namespace    Download protected PDF file
// @description  You can download protected PDF file
// @version      1.1
// @match        https://drive.google.com/*
// @grant        GM_registerMenuCommand
// @require      https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/493184/Download%20protected%20PDF%20file%20from%20Google%20Drive.user.js
// @updateURL https://update.greasyfork.org/scripts/493184/Download%20protected%20PDF%20file%20from%20Google%20Drive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function rescale(width, height, fitWidth, fitHeight) {
        let ratio = width / height;
        let fitRatio = fitWidth / fitHeight;
        if (ratio <= fitRatio) {
            return [width, width / fitRatio];
        } else {
            return [height * fitRatio, height];
        }
    }

    function imageToBase64(img) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
        return canvas.toDataURL("image/png", 1.0);
    }

    function downloadPDF() {
        try {
            let jsPDF = window.jspdf.jsPDF;
            let pdf = new jsPDF();
            let pdfWidth = pdf.internal.pageSize.getWidth();
            let pdfHeight = pdf.internal.pageSize.getHeight();
            let elements = document.getElementsByTagName("img");
            for (let img of elements) {
                if (!/^blob:/.test(img.src)) {
                    continue;
                }
                console.log("adding image", img.src);
                let imgData = imageToBase64(img);
                let [newWidth, newHeight] = rescale(pdfWidth, pdfHeight, img.naturalWidth, img.naturalHeight);
                pdf.addImage(imgData, "png", 0, 0, newWidth, newHeight);
                pdf.addPage();
            }
            pdf.deletePage(pdf.internal.getNumberOfPages());
            pdf.save("download.pdf");
        } catch(e) {
            console.log(e);
        }
    }

    GM_registerMenuCommand("Download PDF file", downloadPDF, "d");
})();
