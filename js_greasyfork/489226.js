// ==UserScript==
// @name         PDF Preview Links
// @namespace    http://cl.thapar.edu/
// @version      0.7
// @description  Add links to preview PDFs in Google Docs viewer on the current page
// @author       You
// @match        https://cl.thapar.edu/*.php
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489226/PDF%20Preview%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/489226/PDF%20Preview%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var customStyles = `
    .accordion {
        background-color: #eee;
        color: #444;
        cursor: pointer;
        padding: 18px;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        font-size: 15px;
        transition: 0.4s;
      }
      
      .active, .accordion:hover {
        background-color: #ccc; 
      }
    

    `;

    var styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    var scriptElement = document.createElement('script');
    scriptElement.type = "module";
    scriptElement.src = '//mozilla.github.io/pdf.js/build/pdf.mjs';
    document.head.appendChild(scriptElement);


    var targetElements = document.querySelectorAll('td a[href^="download.php?id="]');

    var x;
    targetElements.forEach(function (element) {
        x++;
        var tr = element.parentElement.parentElement;
        var googleDocsPreviewLink = 'https://docs.google.com/viewer?url=' + encodeURIComponent("https://cl.thapar.edu/" + element.getAttribute('href')) + '&embedded=true';
        tr.insertCell().innerHTML = `🔽 <a href="${googleDocsPreviewLink}" target="_blank">Preview</a>`;
        var table = tr.parentElement.parentElement;

        tr.classList.add('accordion');
        var newRow = table.insertRow(tr.rowIndex + 1);
        // table.setAttribute('layout', 'fixed');

        newRow.innerHTML = `
        <td colspan="7" style="display:none" align="center">
         <img src="https://blog.motionisland.com/wp-content/uploads/2022/03/Loading_1.gif" width="30%">
        </td>
        `;

        tr.addEventListener('click', function () {

            var panel = tr.nextElementSibling.children[0];
            if (panel.style.display === "") {
                panel.style.display = "none";
            } else {
                panel.style.display = "";
            }

            if(tr.nextElementSibling.children[0].children.length > 0 && tr.nextElementSibling.children[0].children[0].tagName === 'CANVAS'){
                return;
            }

            var { pdfjsLib } = globalThis;

            pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';

            pdfjsLib.getDocument(element.getAttribute('href')).promise.then(doc => {
                for(var i=0; i<doc._pdfInfo.numPages; i++){
                    doc.getPage(i+1).then(page => {
                        var scale = 1.6;
                        var viewport = page.getViewport({ scale: scale });
                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext).promise.then(() => {
                            tr.nextElementSibling.children[0].appendChild(canvas);
                        });
                    });
                }

                //delete the loading gif
                tr.nextElementSibling.children[0].children[0].remove();

                console.log(`This document has ${doc._pdfInfo.numPages} pages.`);
            });


        });
    });


})();


