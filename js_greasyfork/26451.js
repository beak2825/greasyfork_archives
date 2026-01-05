// ==UserScript==
// @name        Ordoro - Direct to Printer
// @namespace   Ordoro - Direct to Printer
// @description Adds a button to Ordoro for Direct Printing.
// @include     https://app.ordoro.com/app#/orders*
// @include     https://app.ordoro.com/apiverson/label?o=*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26451/Ordoro%20-%20Direct%20to%20Printer.user.js
// @updateURL https://update.greasyfork.org/scripts/26451/Ordoro%20-%20Direct%20to%20Printer.meta.js
// ==/UserScript==

var URLs = ""; //Global var

// This Section is for the PDF... 
// When the Pdf opens it auto clicks Print
document.addEventListener('textlayerrendered', function(e) {
 if (e.detail.pageNumber === PDFViewerApplication.page) { //Wait for PDF to load
  var printbutton = document.getElementById("print"); //Find Print
  printbutton.click(); //Click Print
 }}, true);


// This Section Parses the page for the selected Order
function selectReadFn() {
 var src = document.documentElement.outerHTML; // Get Page HTML
 var split_1 = src.split("v3_packing?order_number%5B%5D="); //Basic String Between(Parsing)
 var split_2 = split_1[1].split('"')[0]; //Basic String Between(Parsing)
 URLs = "https://app.ordoro.com/apiverson/label?o=" + split_2 + "&size=thermal&pdf_type=single_page"; //Creating URL from Parsed String
 LoadPrint(); //Loads Print Function
}

// This section Loads an Iframe with the parsed URL and the Iframe Auto prints
function LoadPrint() {
 var iframe = document.createElement('iframe'); //Creates Iframe
 iframe.id = "iprint";
 iframe.width = "0";
 iframe.height = "0";
 iframe.src = URLs;
 document.body.appendChild(iframe); //Load Iframe on page... its a 1x1 Pixel at the bottom of the page
}



// This is for Adding the Button *Not Important*
window.addEventListener('load', () => {
 addButton('Direct to Printer', selectReadFn);
});
function addButton(text, onclick, cssObj) {
 cssObj = cssObj || {
  position: 'absolute',
  bottom: '1%',
  left: '80%',
  'z-index': 3
 };
 let button = document.createElement('button'),
  btnStyle = button.style;
 document.body.appendChild(button);
 button.innerHTML = text;
 button.onclick = onclick;
 btnStyle.position = 'absolute';
 Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
 return button;
}