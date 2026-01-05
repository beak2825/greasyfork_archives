// ==UserScript==
// @name         Repex
// @namespace    http://your.homepage/
// @version      0.5
// @description  Eol bat delete tool
// @author       Yan
// @include      https://dx-pvs.juniper.net/eol/search.htm*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/0.71/jquery.csv-0.71.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13664/Repex.user.js
// @updateURL https://update.greasyfork.org/scripts/13664/Repex.meta.js
// ==/UserScript==
//Developed by zhyan@juniper.net
var input3 = document.createElement('input');
input3.type = 'file';
input3.id = 'csv-file';
input3.name = 'files';
input3.accept = '.csv';
var ifo = document.createElement('iframe');
ifo.name = 'frameabc';
ifo.id = "frameabc"
ifo.style.display = 'none';
var ifo1 = document.createElement('iframe');
ifo1.name = 'frameabcd';
ifo1.id = "frameabcd"
ifo1.style.display = 'none';
var pic = 'The world belongs to Trisolaris!';
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
                $('h1') [0].textContent = 'Whole ' + lrows + ' rows, Now processing row ' + (i + 1);
                document.forms['searchEolRecordForm'].target = 'frameabc';
                document.forms['searchEolRecordForm'].reset();
                model = trim(data[i][1]);
                platform = document.getElementById('record.osPlatform.platformId')
                document.getElementById('modelIdInput').value = model;       
                submitForm('searchEolRecordForm', 'searchEolRecords'); 
                var repo,repo1,repo2;
                something = function () {
                    repo = window.frames['frameabc'].document.getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('a')[1];
                    if (repo) {
                        repo1 = trim(repo.innerHTML); 
                        repo2 = repo.href.split('=')[1];
                        if (repo1 == model) {
                            a = "/eol/search.htm?matrixId=";
                            c = "&action=delete";
                            repo3=a+repo2+c;
                            console.log(repo2+" deleted ~");
                            window.frames['frameabcd'].location.replace(repo3)
                        }
                        else console.log(model+" doesn't exist yet!")
                    }
                    else {
                        console.log(model+" doesn't exist yet!");
                    }
                    i++;
                    if (i < lrows) {
                        theLoop(i);
                    } 
                    else {
                        document.forms['searchEolRecordForm'].removeAttribute('target');
                        alert('Complete for ' + (i - 1) + ' rows, congratulations!\n' + '      ' + pic);                       
                        $('h1')[0].textContent = 'Search EOL Records';
                    }
                }   
                setTimeout(something,2500);
            }, 5000);
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
$(document).ready(function () {
    state = document.getElementById('left');
    state.appendChild(input3);
    state.appendChild(ifo);
    state.appendChild(ifo1);
    if (isAPIAvailable()) {
        $('#csv-file').change(handleFileSelect);
    }
});