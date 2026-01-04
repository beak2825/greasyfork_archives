// ==UserScript==
// @name         Arixv Downloader
// @namespace    http://tampermonkey.net/
// @version      2024-09-07-08
// @description  download paper from arixv with correct name
// @author       Chaorui Xiong
// @match        https://arxiv.org/abs/*
// @icon         https://arxiv.org/static/browse/0.3.4/images/arxiv-logo-one-color-white.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507251/Arixv%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/507251/Arixv%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the paper title and remove blank white characters
    const title_element = document.getElementsByTagName("h1");
    // const num = title_element.length;
    let title_text = title_element[1].innerText;
    title_text = title_text.replace(/\s/g, "_");

    // Get the url of the paper
    const paper_url = document.getElementsByClassName("abs-button download-pdf")[0].href;
    // console.log(paper_url);
    const bibtex_url = paper_url.replace('pdf', 'bibtex');
    // console.log(bibtex_url);

    // Add a download button and set its style
    // Can I add an icon to this button?
    // Make a beautiful button.
    let download_button = document.createElement('button');
    download_button.id = 'download_button';
    download_button.textContent = 'Download';
    download_button.style.position = 'fixed';
    download_button.style.right = '0.4%';
    download_button.style.top = '30.6%';
    // download_button.style.backgroundColor = '#fff';
    download_button.style.border = 'none';
    download_button.style.borderRadius = '6px';
    download_button.style.borderStyle = 'solid';
    download_button.style.textAlign = 'center';
    download_button.style.padding = '5px 5px';
    download_button.style.fontSize = '11px';
    download_button.style.fontWeight = 'bold';
    download_button.style.cursor = 'hand';
    download_button.style.opacity = '1.0';

    // Append the button to the page
    document.body.appendChild(download_button);

    // Download the paper when click "Download" button
    download_button.addEventListener('click', () => {
        // alert('Downloading pdf file for you');
        // alert(title_text);
        // alert(`There are ${num} paragraph in #h1`);
        // console.log(title_text);

        // This method does not work!
        // let view_pdf = document.getElementsByClassName("abs-button download-pdf")[0];
        // view_pdf.download = title_text + ".pdf";
        // view_pdf = document.getElementsByClassName("abs-button download-pdf")[0];
        // console.log(view_pdf.download);
        // view_pdf.click();

        // Create a link element to trigger the download
        let download_link = document.createElement('a');
        document.body.appendChild(download_link);

        // Fetch paper
        fetch(paper_url)
            .then(response => response.blob())
            .then(blob => {
            // Create a blob URL for the pdf data
            var url = window.URL.createObjectURL(blob);

            // Set the download link attributes
            download_link.href = url;
            download_link.download = title_text + ".pdf";
            download_link.style.display = 'none';

            // Click download link programmly
            download_link.click();

            // Clean up by revoking the blob URL and removing the link element
            window.URL.revokeObjectURL(url);

        })
            .catch(error => {
            console.error("Failed to download the PDF file: ", error);
        });

        // Fetch bibtex
        fetch(bibtex_url)
            .then(response => response.blob())
            .then(blob => {
            // Create a blob URL for the pdf data
            var url = window.URL.createObjectURL(blob);

            // Change the download link attributes
            download_link.href = url;
            download_link.download = title_text + ".bib";
            download_link.style.display = 'none';

            // Click download link programmly
            download_link.click();

            // Clean up by revoking the blob URL and removing the link element
            window.URL.revokeObjectURL(url);

        })
            .catch(error => {
            console.error("Failed to download the PDF file: ", error);
        });

        document.body.removeChild(download_link);

    });

    download_button.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#999';
        this.style.color = '#fff';
        this.style.borderColor = '#fff'
    });

    download_button.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#fff';
        this.style.color = '#000';
        this.style.borderColor = '#000';
    });

})();