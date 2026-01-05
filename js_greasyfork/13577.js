// ==UserScript==
// @name         EOL Tool
// @namespace    http://your.homepage/
// @version      1.1
// @description  Eol automation tool
// @author       Yan
// @include      https://dx-pvs.juniper.net/eol/eolRecord/edit.htm*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/0.71/jquery.csv-0.71.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13577/EOL%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/13577/EOL%20Tool.meta.js
// ==/UserScript==

//Developed by zhyan@juniper.net

var input1 = document.createElement('textarea');
input1.name = 'post';
input1.maxLength = '5000';
input1.cols = '25';
input1.rows = '5';
var input2 = document.createElement('textarea');
input2.name = 'post';
input2.maxLength = '5000';
input2.cols = '25';
input2.rows = '5';
var input3 = document.createElement('input');
input3.type = 'file';
input3.id = 'csv-file';
input3.name = 'files';
input3.accept = '.csv';
var addprob = document.createElement('input');
addprob.type = 'button';
addprob.id = 'add_products';
addprob.setAttribute('class', 'button')
addprob.onclick = addprodc;
addprob.value = 'Add products';
addprob.style.cssText = 'width:125px';
var addrep = document.createElement('input');
addrep.type = 'button';
addrep.id = 'add_products';
addrep.setAttribute('class', 'button')
addrep.onclick = addrepc;
addrep.value = 'Add replacement';
addrep.style.cssText = 'width:125px';
var pic = "The world belongs to Trisolaris!";
function addrepc() {
    //trim(input2.value);
    prodc = input2.value.split(/[,\n]+/);
    for (i = 0; i < prodc.length; i++) { if (prodc[i] == "") continue; else copyAndHideReplacementModel(trim(prodc[i]))};
}
function addprodc() {
    //trim(input1.value);
    prodc = input1.value.split(/[,\n]+/);
    for (i = 0; i < prodc.length; i++) { if (prodc[i] == "") continue; else copyAndHideProduct(trim(prodc[i]))};
}
function trim(str) {
    str = str.replace(/^(\s|\u00A0)+/, '');
    for (var t = str.length - 1; t >= 0; t--) {
        if (/\S/.test(str.charAt(t))) {
            str = str.substring(0, t + 1);
            break;
        }
    }
    return str;
};
function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);
        lrows = data.length;
        lcols = data[1].length;
        (function theLoop(i) {
            setTimeout(function () {             
                $('h1')[0].textContent = "Whole "+lrows+" rows, Now processing row "+(i+1);
                document.forms['editRecordForm'].reset();
                document.getElementById('productsListSlct').innerHTML = '';
                document.getElementById('replacementModelsListSlct').innerHTML = '';
                plat = trim(data[i][0]);
                platform = document.getElementById('record.osPlatform.platformId')
                if (plat.toUpperCase() == 'SLT') platform.selectedIndex = 2;
                else if (plat.toUpperCase() == 'JUNOSE') platform.selectedIndex = 1;
                //else if (plat == null) {
                //    alert('Please check your row of ' + i);
                //    continue;
                //};
                document.getElementById('psnURLInp').value = data[i][4];
                document.getElementById('psnNumberInp').value = data[i][3];
                document.getElementById('modelIdInp').value = data[i][1];
                document.getElementById('record.descReplacementModel').value = data[i][9];
                document.getElementById('announcedDateStr').value = data[i][10];
                document.getElementById('endSaleDateStr').value = data[i][11];
                document.getElementById('endEngineeringDateStr').value = data[i][12];
                document.getElementById('endEngineeringDateHardwareStr').value = data[i][13];
                document.getElementById('endServiceDateStr').value = data[i][14];
                document.getElementById('record.status').value = data[i][7];
                document.getElementById('memoryInp').value = data[i][5];
                if (data[i][6] == "Yes") document.getElementById('record.memoryUsed').value="true";
                else document.getElementById('record.memoryUsed').value="false";
                addrep = data[i][8].split(',');
                prodc = data[i][2].split(',');
                for (t = 0; t < addrep.length; t++) {
                    trim(addrep[t]);
                    copyAndHideReplacementModel(addrep[t])
                };
                for (x = 0; x < prodc.length; x++) {
                    trim(prodc[x]);
                    copyAndHideProduct(prodc[x]);
                };
                document.forms['editRecordForm'].target = 'frameabc';
                submitERForm();
                console.log('Row ' + (i + 1) + ' complete~')
                i++;
                if (i < lrows) {
                    console.log('in loop, the current i is ' + i);
                    theLoop(i);
                }
                else {
                    alert("Complete for "+(i-1)+" rows, congratulations!\n"+"      "+pic);
                    $('h1')[0].textContent = "EOL Record Management";
                }
            }, 2500);
        }) (1)
    }
}
function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        return true;
    } else {
        // source: File API availability - http://caniuse.com/#feat=fileapi
        // source: <output> availability - http://html5doctor.com/the-output-element/
        document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
        // 6.0 File API & 13.0 <output>
        document.writeln(' - Google Chrome: 13.0 or later<br />');
        // 3.6 File API & 6.0 <output>
        document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
        // 10.0 File API & 10.0 <output>
        document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
        // ? File API & 5.1 <output>
        document.writeln(' - Safari: Not supported<br />');
        // ? File API & 9.2 <output>
        document.writeln(' - Opera: Not supported');
        return false;
    }
};
/*
(function injectJs() {
  var scr = document.createElement('script');
  scr.type = 'text/javascript';
  scr.src = 'https://greasyfork.org/scripts/13584-submit-without-re/code/submit-without-re.js';
  document.getElementsByTagName('head') [0].appendChild(scr);
}) ()
*/
$(document).ready(function () {
    $('#modelIdInp')[0].removeAttribute('readonly');
    prod = document.getElementsByClassName('longwidget') [2];
    rep = document.getElementsByClassName('longwidget') [10];
    rep.appendChild(input2);
    prod.appendChild(input1);
    rep.appendChild(addrep);
    prod.appendChild(addprob);
    ifo = document.createElement('iframe');
    ifo.name = 'frameabc';
    ifo.style.display = 'none';
    state = document.getElementById('left');
    state.appendChild(input3);
    state.appendChild(ifo);

    if (isAPIAvailable()) {
        $('#csv-file').change(handleFileSelect);
    }
});