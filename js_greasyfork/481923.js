// ==UserScript==
// @name         转换爱学习PDF
// @namespace    http://tampermonkey.net/
// @version      2023-12-11
// @license      MIT
// @description  将爱学习的教案转为更合适保存为md的形式
// @author       kbtx
// @match        https://bsk.aixuexi.com/courseInfo.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aixuexi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481923/%E8%BD%AC%E6%8D%A2%E7%88%B1%E5%AD%A6%E4%B9%A0PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/481923/%E8%BD%AC%E6%8D%A2%E7%88%B1%E5%AD%A6%E4%B9%A0PDF.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to swap each image with its next sibling
    function swapImages() {
        const images = Array.from(document.getElementsByClassName("litimg"));

        // Swap each image with its next sibling
        images.forEach((image, index) => {
            const nextSibling = image.nextElementSibling;
            if (nextSibling) {
                image.removeAttribute('width')
                image.removeAttribute('height')
                image.parentNode.insertBefore(nextSibling, image);
            }
        });
    }

    // Function to print the specified element and its children
    function printElement(element) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write(element.outerHTML
                                   .replace('class="gutter-printdiy"', 'class="gutter-printdiy" style="display: grid;"'));
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    // Function to get images, swap them, and print the specified element
    function processImagesAndPrint() {
        const gutterPrintdiy = document.getElementsByClassName("gutter-printdiy")[0];

        // Call the function to swap images
        swapImages();

        // Call the function to print the specified element
        printElement(gutterPrintdiy);
    }

    // Call the function to process images and print after a delay
    setTimeout(processImagesAndPrint, 5000); // 10 seconds delay
})();