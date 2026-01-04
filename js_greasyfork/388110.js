// ==UserScript==
// @name         AlmaScript - Download Alma Start Process as PDF
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.9.24.1
// @description  Combines all the forms into a single PDF and downloads it.
// @author       Ryan Meyers
// @match        https://sges.getalma.com/workflows/processes/*/*/*
// @require https://greasyfork.org/scripts/388210-html2pdf-js/code/html2pdfjs.js?version=722443
// @require https://unpkg.com/pdf-lib@1.0.1/dist/pdf-lib.min.js
// @require https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388110/AlmaScript%20-%20Download%20Alma%20Start%20Process%20as%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/388110/AlmaScript%20-%20Download%20Alma%20Start%20Process%20as%20PDF.meta.js
// ==/UserScript==


(async function() {
    'use strict';
    var newStyle = document.createElement('style'); newStyle.innerHTML = ".pure-button-pdf { color: #eb6841; background: #fff; } .pdfIcon { margin-left:10px; margin-right:10px;} .lds-circle { display: inline-block; transform: translateZ(1px); } .lds-circle { display: inline-block; animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite; } @keyframes lds-circle {  0%, 100% { animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5); } 0% { transform: rotateY(0deg); } 50% { transform: rotateY(1800deg); animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1); } 100% { transform: rotateY(3600deg); } }"; document.getElementsByTagName('head')[0].append(newStyle);

    var pdfIcon = document.createElement('button');
    pdfIcon.classList.add('pure-button', 'pure-button-pdf', 'pure-button-large');
        var iconElement = document.createElement('i');
    iconElement.classList.add('fas','fa-file-pdf','fa-1x', 'pdfIcon');
    pdfIcon.append(iconElement);
    var pdfButtonText = document.createElement('span');
    pdfButtonText.innerHTML = "Download PDF";
    var pdfButtonProgress = document.createElement('span');
    pdfIcon.append(pdfButtonText);
    pdfIcon.append(pdfButtonProgress);
    document.getElementsByClassName("profile-user")[0].append(pdfIcon);
    pdfIcon.onclick = async function() {
        iconElement.classList.add('lds-circle');
        pdfButtonText.innerHTML = "Generating...";
        pdfButtonProgress.innerHTML = "0%";



    var completedTasks = document.getElementsByClassName("task-completed");
    var allHTML = [];
    var numDone = 0;
    var totalTasks = completedTasks.length;
    const bigPdf = await PDFLib.PDFDocument.create();
    for (var task of completedTasks) {
        var taskUri = task.dataset.href;
        var formUri = taskUri.replace("task-details","form");
        let headers = new Headers({
            "Accept"       : "application/json",
            "Content-Type" : "application/json",
            "X-Requested-With": "XMLHttpRequest"
        });
        var taskNum = parseInt(taskUri.match(/task=([0-9]+)/)[1]);
        console.log(taskNum);
        await fetch(formUri, {method: "GET", headers: headers})
            .then(function(response) {
            if (!response.ok){
            return {'Message': {'html': '', 'header':''}}
            }
                return response.json();
        })
            .then(function(myJson) {
            console.log(myJson);
            var jsonHTML = myJson.Message.html;
            jsonHTML = jsonHTML.replace(/form-section/g,"form-section-off");
            jsonHTML = jsonHTML.replace(/<ul class/g,"<ul style=\"display:none;\" class");
            console.log(jsonHTML);
            //var files = jsonHTML.match(/<a href="(\/workflows\/processes\/.*\/get-file\?id=[a-zA-z0-9]*)">/g);
            var files = jsonHTML.match(/\/workflows\/processes\/.*\/get-file\?id=[a-zA-z0-9]*/g);
            if (files) {
                totalTasks += files.length;
                for (var file of files) {
                    fetch(file).then(function(response) {

                        return response.blob(); }
                                     ).then(async function(blob) {
                        console.log(blob.type);
                        let reader = new FileReader();
                        reader.readAsArrayBuffer(blob);
                        reader.onload = async function() {

                        //blob.arrayBuffer().then(async function(myBuffer){
                            if (blob.type === "application/pdf") {
                        const pdf = await PDFLib.PDFDocument.load(reader.result);
                        console.log(pdf);
                        const numPages = pdf.getPages().length;

                        const copiedPages = await bigPdf.copyPages(pdf, Array.from(Array(numPages).keys()));
                        copiedPages.forEach((page) => {
                            bigPdf.addPage(page);
                        });
                            }
                            else if (blob.type === "image/jpeg") {

                                // Embed the JPG image bytes and PNG image bytes
                                const jpgImage = await bigPdf.embedJpg(reader.result)

                                // Get the width/height of the JPG image scaled down to 25% of its original size
                                const jpgDims = jpgImage.scale(.5)

                                // Add a blank page to the document
                                const page = bigPdf.addPage([jpgDims.width, jpgDims.height])

                                // Draw the JPG image in the center of the page
                                page.drawImage(jpgImage, {
                                    x: page.getWidth() / 2 - jpgDims.width / 2,
                                    y: page.getHeight() / 2 - jpgDims.height / 2,
                                    width: jpgDims.width,
                                    height: jpgDims.height,
                                });

                            }
                        //bigPdf.addPage(pdf);

                        // console.log(pdf);

                        //var objectURL = URL.createObjectURL(myBlob);
                        //let reader = new FileReader();
                        //reader.readAsDataURL(myBlob);
                        //reader.onload = function() {
                        //    console.log(myBlob);
                        //allHTML += "<embed src=\""+reader.result+"\" width=\"850\" height=\"1100\" class=\"page-break\" type=\"application/pdf\">";
                        numDone += 1;
                            pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 3) )).toString() + "%";
                        if (numDone === totalTasks){

                            html2pdf().set({
                                html2canvas:  { scale: 2 },
                                pagebreak: { before: '.page-break', avoid: ['div','h1','.form-section-offs'] }
                            }).from("<div style=\"padding:100px;\">"+allHTML.join(" ")+"</div>").output('datauristring').then(async function (pdfAsString) {
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 2))).toString() + "%";
                                const htmlPdf = await PDFLib.PDFDocument.load(pdfAsString);
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1.5))).toString() + "%";
                                const numPages = bigPdf.getPages().length;
                                const copiedPages = await htmlPdf.copyPages(bigPdf, Array.from(Array(numPages).keys()));
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1.2))).toString() + "%";
                                copiedPages.forEach((page) => {
                                    htmlPdf.addPage(page);
                                });
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1))).toString() + "%";
                                //const pdfUrl = URL.createObjectURL(
                                //    new Blob([await htmlPdf.save()], { type: 'application/pdf' }),
                                //);
                                var studentName = document.getElementsByClassName("fn")[0].innerText;
                    var processName = document.getElementById("page-header").innerText;
                    saveAs(new Blob([await htmlPdf.save()]), studentName+" - "+processName+".pdf");
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / totalTasks)).toString() + "%";
                                iconElement.classList.remove('lds-circle');
                                pdfButtonText.innerHTML = "PDF Saved!";
                                pdfButtonProgress.innerHTML = "";
                                //htmlPdf.save();
                            });


                            // const bigPdf = await PDFLib.PDFDocument.load(FormPdf);
                            // bigPdf.addPage(pdf);



                        }
                        //};

                        };

                    });
                }
            }
            console.log(files);
            var jsonHeader = myJson.Message.header;
            allHTML[taskNum] = "<h1>"+jsonHeader+"</h1>"+jsonHTML;
            numDone += 1;
            pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 3))).toString() + "%";

            // <a href="/workflows/processes/5d0a73db7b86eb6fe20f6092/5d1a18b97b86eb0a7532e0f9/5d1a18b97b86eb39037d417d/get-file?id=5d372340a814e42a0d1872e1">


            if (numDone === totalTasks){
                html2pdf().set({
                                html2canvas:  { scale: 2 },
                                pagebreak: { before: '.page-break', avoid: ['div','h1','.form-section-offs'] }
                            }).from("<div style=\"padding:100px;\">"+allHTML.join(" ")+"</div>").output('datauristring').then(async function (pdfAsString) {
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 2))).toString() + "%";
                                const htmlPdf = await PDFLib.PDFDocument.load(pdfAsString);
                    pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1.5))).toString() + "%";
                                const numPages = bigPdf.getPages().length;
                                const copiedPages = await htmlPdf.copyPages(bigPdf, Array.from(Array(numPages).keys()));
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1.2))).toString() + "%";
                                copiedPages.forEach((page) => {
                                    htmlPdf.addPage(page);
                                });
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1))).toString() + "%";
                                //const pdfUrl = URL.createObjectURL(
                                //    new Blob([await htmlPdf.save()], { type: 'application/pdf' }),
                                //);
                                var studentName = document.getElementsByClassName("fn")[0].innerText;
                    var processName = document.getElementById("page-header").innerText;
                    saveAs(new Blob([await htmlPdf.save()]), studentName+" - "+processName+".pdf");
                                pdfButtonProgress.innerHTML = parseInt(100 * (numDone / totalTasks)).toString() + "%";
                                iconElement.classList.remove('lds-circle');
                                pdfButtonText.innerHTML = "Saved";
                                pdfButtonProgress.innerHTML = "";
                                //htmlPdf.save();
                            });
                    //saveAs(await htmlPdf.save(), "Form.pdf");
                                //window.open(pdfUrl, '_blank');
                                //htmlPdf.save();
                            // });
                // console.log(allHTML);
            }
        }).catch( (e) => {console.log(e)});
    }

    };

    // Your code here...
})();