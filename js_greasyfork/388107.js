// ==UserScript==
// @name         Almascript - Alma Start Process List Helper
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.8.6.1
// @description  Show what isn't done and display uploaded files.
// @author       Ryan Meyers
// @match        https://*.getalma.com/workflows/processes/*/review
// @require https://greasyfork.org/scripts/388114-pdf-js/code/PDFjs.js?version=721820
// @require https://greasyfork.org/scripts/388210-html2pdf-js/code/html2pdfjs.js?version=722443
// @require https://unpkg.com/pdf-lib@1.0.1/dist/pdf-lib.min.js
// @require https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/388107/Almascript%20-%20Alma%20Start%20Process%20List%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/388107/Almascript%20-%20Alma%20Start%20Process%20List%20Helper.meta.js
// ==/UserScript==

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window["pdfjs-dist/build/pdf"];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//greasyfork.org/scripts/388115-pdf-js-worker/code/PDFjs%20Worker.js?version=721821";

const readBlobAsArrayBuffer = (blob) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsArrayBuffer(blob);
  });
};

function clearBody(body) {
    body = body.replace(/src=/g,"data-src=");
    body = body.replace(/<link/g, "nolink");
    return body;
}

function fetchAndUpdate(node) {
  const updateNode = node;

  fetch(node.href)
    .then(function(response) {
      return response.text();
    })
    .then(function(body) {
      body = clearBody(body);
      var parser = new DOMParser();
      var doc = parser.parseFromString(body, "text/html");
      var xpath =
        "//li[contains(@class,'task')][not(contains(@class,'task-complete'))]";
      var result = document.evaluate(
        xpath,
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      //console.log(result);
      var node,
        nodes = [];
      while ((node = result.iterateNext())) {
        //console.log(node.textContent.trim());
        var newNode = document.createElement("div");
        newNode.classList.add("pill");

        newNode.innerHTML =
          '<i class="far fa-times-circle" style="color:#eb6841;"></i>' +
          node.textContent.trim();

        updateNode.parentElement.parentElement.children[4].append(newNode);
      }
    });
}

function fetchHealthForm(node) {
  var updateNode = node;
  var pdfIcon = document.createElement("div");
  pdfIcon.classList.add(
    "pure-button",
    "pure-button-pdf",
    "pure-button-large",
    "image-icon-button"
  );
  var iconElement = document.createElement("i");
  iconElement.classList.add("far", "fa-images", "fa-1x", "pdfIcon");
  pdfIcon.append(iconElement);
  var studentName,
    processName = "";

  updateNode.parentElement.parentElement.children[0].append(pdfIcon);

  pdfIcon.onclick = async function() {
    iconElement.classList.add("lds-circle");

    fetch(node.href)
      .then(function(response) {
        return response.text();
      })
      .then(function(body) {
        //console.log(body);
        body = clearBody(body);
        var parser = new DOMParser();
        var doc = parser.parseFromString(body, "text/html");
        var xpath = "//li[contains(@class,'task')]";
        var result = document.evaluate(
          xpath,
          doc,
          null,
          XPathResult.ANY_TYPE,
          null
        );
        //console.log(result);
        var node,
          nodes = [];
        var numFiles = 0;
        var filesDone = 0;
        while ((node = result.iterateNext())) {
          var taskUri = node.dataset.href;
          var formUri = taskUri.replace("task-details", "form");
          let headers = new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          });

          fetch(formUri, { method: "GET", headers: headers })
            .then(function(response) {
              return response.json();
            })
            .then(function(myJson) {
              //console.log(myJson);
              var jsonHTML = myJson.Message.html;
              jsonHTML = jsonHTML.replace(/form-section/g, "form-section-off");
              jsonHTML = jsonHTML.replace(
                /<ul class/g,
                '<ul style="display:none;" class'
              );
              //console.log(jsonHTML);
              //var files = jsonHTML.match(/<a href="(\/workflows\/processes\/.*\/get-file\?id=[a-zA-z0-9]*)">/g);
              var files = jsonHTML.match(
                /\/workflows\/processes\/.*\/get-file\?id=[a-zA-z0-9]*/g
              );
              if (files) {
                numFiles += files.length;
                iconElement.classList.add("lds-circle");
                for (var file of files) {
                  fetch(file)
                    .then(function(response) {
                      return response.blob();
                    })
                    .then(async function(blob) {
                      console.log(blob.type);
                      let reader = new FileReader();
                      reader.readAsArrayBuffer(blob);
                      reader.onload = async function() {
                        var newImg;

                        //blob.arrayBuffer().then(async function(myBuffer){
                        if (blob.type === "application/pdf") {
                          newImg = document.createElement("canvas");

                          var loadingTask = pdfjsLib.getDocument(file);
                          loadingTask.promise.then(
                            function(pdf) {
                              console.log("PDF loaded");

                              // Fetch the first page
                              var pageNumber = 1;
                              pdf.getPage(pageNumber).then(function(page) {
                                console.log("Page loaded");

                                var scale = 0.25;
                                var viewport = page.getViewport(scale);

                                // Prepare canvas using PDF page dimensions
                                var canvas = newImg;
                                var context = canvas.getContext("2d");
                                canvas.height = 230;
                                canvas.width = 160;

                                // Render PDF page into canvas context
                                var renderContext = {
                                  canvasContext: context,
                                  viewport: viewport
                                };
                                var renderTask = page.render(renderContext);
                                renderTask.promise.then(function() {
                                  console.log("Page rendered");
                                });
                              });
                            },
                            function(reason) {
                              // PDF loading error
                              console.error(reason);
                            }
                          );

                          //newImg = document.createElement('a');
                          //newImg.href = file;
                          //newImg.innerHTML = "Download";
                          updateNode.append(newImg);
                        } else {
                          newImg = document.createElement("img");
                          newImg.src = file;
                          newImg.width = 160;
                          updateNode.append(newImg);
                        }
                        filesDone += 1;
                        if (filesDone === numFiles) {
                          iconElement.classList.remove("lds-circle");
                        }
                      };
                    });
                }
              }
            });
        }
      })
      .then(function() {});
  };
}

function doIncomplete() {
  var xpath = "//tr[td[text()='Active (in progress)']]/td[2]/a";
  var result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  var node,
    nodes = [];
  while ((node = result.iterateNext())) {
    nodes.push(node);
    //console.log(node.href);
    fetchAndUpdate(node);
  }
}

function clickAllImageButtons() {
  var node;
  for (node of document.getElementsByClassName("image-icon-button")) {
    node.click();
  }
}

function downloadAllPDFs() {
  var node;
  for (node of document.getElementsByClassName("pdf-icon-button")) {
    node.click();
  }
}

function doCompletePDFButtons() {
  var xpath =
    "//tr[td[text()='Active (complete)' or text()='Complete']]/td[2]/a";
  var result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  //var result = document.evaluate(xpath,document.cloneNode(true))
  var node,
    nodes = [];
  while ((node = result.iterateNext())) {
    nodes.push(node);
    //console.log(node.href);
  }
  for (node of nodes) {
    generatePDF(node);
    generatePDF(node, true);
    fetchHealthForm(node);
  }
}

function generatePDF(node, justHealth = false) {
  const onlyHealth = justHealth;
  var updateNode = node;
  var pdfIcon = document.createElement("div");
  var iconElement = document.createElement("i");
  if (onlyHealth) {
    pdfIcon.classList.add(
      "pure-button",
      "pure-button-pdf",
      "pure-button-large",
      "health-icon-button"
    );
    iconElement.classList.add("fas", "fa-notes-medical", "fa-1x", "pdfIcon");
  } else {
    pdfIcon.classList.add(
      "pure-button",
      "pure-button-pdf",
      "pure-button-large",
      "pdf-icon-button"
    );
    iconElement.classList.add("fas", "fa-file-pdf", "fa-1x", "pdfIcon");
  }

  pdfIcon.append(iconElement);
  var studentName,
    processName = "";

  updateNode.parentElement.parentElement.children[0].append(pdfIcon);

  pdfIcon.onclick = async function() {
    iconElement.classList.add("lds-circle");
    const bigPdf = await PDFLib.PDFDocument.create();
    var allHTML = [];

    const bigFetch = await fetch(node.href);
    var body = await bigFetch.text();
    
        body = clearBody(body);
        //console.log(body);
        var parser = new DOMParser();
        var doc = parser.parseFromString(body, "text/html");
        var xpath;

        studentName = doc.getElementsByClassName("fn")[0].innerText.trim();
        if (onlyHealth) {
          processName =
            "HEALTH " + doc.getElementById("page-header").innerText.trim();
          xpath =
            "//li[contains(@class,'task')][div/h5[contains(text(),'Health' ) or contains(text(), 'Medi')]]";
        } else {
          processName = doc.getElementById("page-header").innerText.trim();
          xpath = "//li[contains(@class,'task')]";
        }

        var result = document.evaluate(
          xpath,
          doc,
          null,
          XPathResult.ANY_TYPE,
          null
        );

        var numDone = 0;
        var task;
        while ((task = result.iterateNext())) {
          var taskUri = task.dataset.href;
          var formUri = taskUri.replace("task-details", "form");
          let headers = new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          });

          var taskNum = parseInt(taskUri.match(/task=([0-9]+)/)[1]);
          console.log(taskNum);
          var fetchResponse = await fetch(formUri, { method: "GET", headers: headers });
          var myJson = await fetchResponse.json();
            
              console.log(myJson);
              var jsonHTML = myJson.Message.html;
              jsonHTML = jsonHTML.replace(/form-section/g, "form-section-off");
              jsonHTML = jsonHTML.replace(
                /<ul class/g,
                '<ul style="display:none;" class'
              );
              console.log(jsonHTML);
              //var files = jsonHTML.match(/<a href="(\/workflows\/processes\/.*\/get-file\?id=[a-zA-z0-9]*)">/g);
              var files = jsonHTML.match(
                /\/workflows\/processes\/.*\/get-file\?id=[a-zA-z0-9]*/g
              );
              if (files) {
                for (var file of files) {
                  var fileResponse = await fetch(file);
                  var blob = await fileResponse.blob();
                  
                   
                      console.log(blob.type);
                      
                      const blobArrayBuffer = await readBlobAsArrayBuffer(blob);
                      
                        //blob.arrayBuffer().then(async function(myBuffer){
                        if (blob.type === "application/pdf") {
                          const pdf = await PDFLib.PDFDocument.load(
                            blobArrayBuffer
                          );
                          console.log(pdf);
                          const numPages = pdf.getPages().length;

                          const copiedPages = await bigPdf.copyPages(
                            pdf,
                            Array.from(Array(numPages).keys())
                          );
                          copiedPages.forEach(page => {
                            bigPdf.addPage(page);
                          });
                        } else if (blob.type === "image/jpeg") {
                          // Embed the JPG image bytes and PNG image bytes
                          const jpgImage = await bigPdf.embedJpg(blobArrayBuffer);

                          // Get the width/height of the JPG image scaled down to 25% of its original size
                          const jpgDims = jpgImage.scale(0.5);

                          // Add a blank page to the document
                          const page = bigPdf.addPage([
                            jpgDims.width,
                            jpgDims.height
                          ]);

                          // Draw the JPG image in the center of the page
                          page.drawImage(jpgImage, {
                            x: page.getWidth() / 2 - jpgDims.width / 2,
                            y: page.getHeight() / 2 - jpgDims.height / 2,
                            width: jpgDims.width,
                            height: jpgDims.height
                          });
                        } else if (blob.type === "image/png") {
                          // Embed the JPG image bytes and PNG image bytes
                          const jpgImage = await bigPdf.embedPng(blobArrayBuffer);

                          // Get the width/height of the JPG image scaled down to 25% of its original size
                          const jpgDims = jpgImage.scale(0.5);

                          // Add a blank page to the document
                          const page = bigPdf.addPage([
                            jpgDims.width,
                            jpgDims.height
                          ]);

                          // Draw the JPG image in the center of the page
                          page.drawImage(jpgImage, {
                            x: page.getWidth() / 2 - jpgDims.width / 2,
                            y: page.getHeight() / 2 - jpgDims.height / 2,
                            width: jpgDims.width,
                            height: jpgDims.height
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
                        //numDone += 1;
                        // pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 3) )).toString() + "%";

                        //};
                     
                   
                }
              }
              console.log(files);
              var jsonHeader = myJson.Message.header;
              allHTML[taskNum] = "<h1>" + jsonHeader + "</h1>" + jsonHTML;
              // numDone += 1;
              // pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 3))).toString() + "%";

              // <a href="/workflows/processes/5d0a73db7b86eb6fe20f6092/5d1a18b97b86eb0a7532e0f9/5d1a18b97b86eb39037d417d/get-file?id=5d372340a814e42a0d1872e1">
            
        }

        html2pdf()
        .set({
          html2canvas: { scale: 2 },
          pagebreak: {
            before: ".page-break",
            avoid: ["div", "h1", ".form-section-offs"]
          }
        })
        .from('<div style="padding:100px;">' + allHTML.join(" ") + "</div>")
        .output("datauristring")
        .then(async function(pdfAsString) {
          //pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 2))).toString() + "%";
          const htmlPdf = await PDFLib.PDFDocument.load(pdfAsString);
          //pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1.5))).toString() + "%";
          const numPages = bigPdf.getPages().length;
          const copiedPages = await htmlPdf.copyPages(
            bigPdf,
            Array.from(Array(numPages).keys())
          );
          //pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1.2))).toString() + "%";
          copiedPages.forEach(page => {
            htmlPdf.addPage(page);
          });
          //pdfButtonProgress.innerHTML = parseInt(100 * (numDone / (totalTasks + 1))).toString() + "%";
          //const pdfUrl = URL.createObjectURL(
          //    new Blob([await htmlPdf.save()], { type: 'application/pdf' }),
          //);

          saveAs(
            new Blob([await htmlPdf.save()]),
            studentName + " - " + processName + ".pdf"
          );
          //pdfButtonProgress.innerHTML = parseInt(100 * (numDone / totalTasks)).toString() + "%";
          iconElement.classList.remove("lds-circle");
          //pdfButtonText.innerHTML = "Saved";
          //pdfButtonProgress.innerHTML = "";
          //htmlPdf.save();
        });

      }

      
       
        //saveAs(await htmlPdf.save(), "Form.pdf");
        //window.open(pdfUrl, '_blank');
        //htmlPdf.save();
        // });
        // console.log(allHTML);
     
  }


(async function() {
  "use strict";
  var newStyle = document.createElement("style");
  newStyle.innerHTML = `
.pill {
background-color: #fff;
padding: .5em;
border-radius: 5px;
display: inline-block;
cursor: default;
margin-top: 1em;
font-size: 8pt;
}
.pure-button-pdf { color: #eb6841; background: #fff; padding: 0.1em;}
.pdfIcon { margin-left:2px; margin-right:2px;}
.lds-circle { display: inline-block; transform: translateZ(1px); }
.lds-circle { display: inline-block; animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite; }
@keyframes lds-circle {  0%, 100% { animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5); } 0% { transform: rotateY(0deg); } 50% { transform: rotateY(1800deg); animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1); } 100% { transform: rotateY(3600deg); } }
    `;
  document.getElementsByTagName("head")[0].append(newStyle);

  var showFormsButton = document.createElement("button");
  showFormsButton.onclick = clickAllImageButtons;
  showFormsButton.innerHTML =
    '<i class="far fa-images"></i> Show Thumbnails for All Uploads';
  showFormsButton.classList.add("pure-button");
  document.getElementById("page-header").append(showFormsButton);

  var allPDFsButton = document.createElement("button");
  allPDFsButton.onclick = downloadAllPDFs;
  allPDFsButton.innerHTML =
    '<i class="far fa-file-pdf"></i> Download all Completed as PDFs';
  allPDFsButton.classList.add("pure-button");
  document.getElementById("page-header").append(allPDFsButton);

  doIncomplete();
  doCompletePDFButtons();
})();