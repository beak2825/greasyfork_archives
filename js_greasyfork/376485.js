// ==UserScript==
// @name         Elsevier-save-as-PDF
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  when download paper from www.sciencedirect.com, auto-naming the pdf file.
// @author       csxz
// @include      https://www.sciencedirect.com/science/article/pii/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376485/Elsevier-save-as-PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/376485/Elsevier-save-as-PDF.meta.js
// ==/UserScript==

function saveAsPdf() {
    //get article name
    var efilename = document.getElementsByClassName('title-text')[0].innerText.toString().replace(':', ' -').replace('?',',') + '.pdf';
    var ejournal = document.getElementsByClassName('publication-title-link')[0].innerText;
    var etime = document.getElementsByClassName('text-xs')[5].innerText.split(',')[1].split(' ');
    var eyear = etime[etime.length-1];
    
    if(ejournal == "Pattern Recognition")
    {
        ejournal = "PR";
    }
    else if(ejournal == "Pattern Recognition Letters")
    {
        ejournal = "PRL";
    }
    else
    {
        ejournal = "";
    }
    
    efilename = eyear + '-' + ejournal + '-' + efilename;
    
    //get download link
    var eref = document.getElementsByClassName('anchor u-margin-s-right')[0];
    //eref.setAttribute('download',efilename);
    
    //Add Save as Pdf link
    //epdflink = document.getElementsByClassName('u-padding-s-bottom')[0];
    //var eobj = document.createElement("li");
    ////eobj.innerHTML = '<a href=' + '"'+ eref.href + '"' +'>Save as pdf</a>';
    //eobj.innerHTML = '<a download='+ '"'+ efilename + '"' + ' href=' + '"'+ eref.href + '"' +'>Save as pdf</a>';
    //epdflink.insertBefore(eobj, epdflink.childNodes[0]);
    
    //Add filename to clipboard
    eref.addEventListener('click', function(){
        var cpeclip = document.createElement('input');
        document.body.appendChild(cpeclip);
        cpeclip.value = efilename;
        cpeclip.select();
        console.log('copy success', document.execCommand('copy'));
        document.body.removeChild(cpeclip);
    });
}

window.onload = saveAsPdf;