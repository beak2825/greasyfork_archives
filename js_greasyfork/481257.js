// ==UserScript==
// @name         Download PDF from getepic
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Download book as PDF from getepic - please only use when a necessity - heavy on both getepic and a thirdparty
// @author       You
// @match        https://www.getepic.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getepic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481257/Download%20PDF%20from%20getepic.user.js
// @updateURL https://update.greasyfork.org/scripts/481257/Download%20PDF%20from%20getepic.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const originalXhrOpen = window.XMLHttpRequest.prototype.open;
  const originalXhrSend = window.XMLHttpRequest.prototype.send;

  let imageUrls = [];

  function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .custom-button-class {
        height: 40px;
        border-radius: 20px;
        padding: 0px 10px;
        border: none;
        color: white;
        font-weight: 600;
        background: #0b6da4;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  function loadJsPDF(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  window.XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return originalXhrOpen.apply(this, arguments);
  };

  window.XMLHttpRequest.prototype.send = function() {
    this.addEventListener('load', function() {
      if (this._url.includes('class=WebBook&method=getFullDataForWeb')) {
        console.info('generating');
        const responseData = JSON.parse(this.responseText);

        // Extract image URLs from the API response
        imageUrls = responseData.result?.epub?.spine?.map(imageData => imageData.pageCdn); // Replace this with the correct path in your API response

        // Generate PDF from the array of image URLs
        generatePDF(imageUrls, responseData.result.book.title);
      }
    });

    // Call the original send method
    return originalXhrSend.apply(this, arguments);
  };

  async function generatePDF(imageUrls, title) {
    if (typeof window.jspdf !== 'undefined') {
      const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });


      const downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download PDF';
      downloadButton.classList.add('custom-button-class');

      const progressSpan = document.createElement('span');
      progressSpan.style.marginLeft = '10px';
      progressSpan.textContent = '0/' + imageUrls.length;

      const containerDiv = document.createElement('div');
      containerDiv.appendChild(downloadButton);
      containerDiv.appendChild(progressSpan);

      downloadButton.addEventListener('click', async function() {
        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const proxUrl = 'https://wsrv.nl/?url=' + encodeURIComponent(imageUrl);
          console.info(proxUrl);

          try {
            const dataUrl = await toDataURL(proxUrl);
            const pn = `${i + 1}/${imageUrls.length}`
            console.debug(pn);
            progressSpan.textContent = pn;

            const imgWidth = 210; // Image width in mm (assuming A4 size)
            const imgHeight = 297; // Image height in mm (assuming A4 size)
            doc.addImage(dataUrl, 'JPEG', 0, 0, imgWidth, imgHeight);

            if (i !== imageUrls.length - 1) {
              doc.addPage(); // Add a new A4-sized page for each image except the last one
            } else {
              doc.save(title + '.pdf');
            }
          } catch (error) {
            console.error('Error fetching image data:', error);
            // Handle errors, if any
          }
        }
      });

      const headerLeftSection = document.querySelector('.header-section.header-left-section');
      if (headerLeftSection) {
        headerLeftSection.appendChild(containerDiv);
      } else {
        console.error('Header section not found');
      }

    } else {
      console.error('jsPDF library not loaded');
    }
  }

  function toDataURL(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onload = function() {
        let reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result);
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function(error) {
        reject(error);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }


  loadJsPDF(() => {
    addCustomStyles();
    console.info('onload');
    // generatePDF()
  });

})();
