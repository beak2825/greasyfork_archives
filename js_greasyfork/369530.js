// ==UserScript==
// @name         IEEE-save-as-PDF
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  when download paper from IEEE, save the pdf file using the title as file name.
// @author       csxz
// @include      https://ieeexplore.ieee.org/document/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369530/IEEE-save-as-PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/369530/IEEE-save-as-PDF.meta.js
// ==/UserScript==

function saveAsPdf() {
    document.getElementsByClassName('doc-actions-link stats-document-lh-action-downloadPdf_2')[0].addEventListener('click', function(){
        // find the title
        var titlet = document.getElementsByClassName("document-title")[0].innerText;
        //var titlet=title.substr(0,title.length-1);
        
        var doi = document.getElementsByClassName("ng-isolate-scope")[2].innerText.split("/")[1].split(".");
        var yearr = doi[1];
            
        var pubinfo = document.getElementsByClassName("u-pb-1 stats-document-abstract-publishedIn")[0].innerText.split("(");
        if (pubinfo.length > 1)
        {
            var volinfo = pubinfo[1].split(")")[0];
            
            if(volinfo.length > 24)
            {
                var volarr = volinfo.split(" ");
                yearr = volarr[volarr.length - 2];
            }
        }
        
        var fileName = yearr + "-" + doi[0] + "-" + titlet.toString().replace(':', ' -').replace('?', ',') + '.pdf';
        
        /*
        var textarea = document.createElement('textarea');
        textarea.textContent = fileName;
        document.body.appendChild(textarea);
    
        var selection = document.getSelection();
        var range = document.createRange();
        range.selectNode(textarea);
        selection.removeAllRanges();
        selection.addRange(range);
    
        console.log('copy success', document.execCommand('copy'));
        selection.removeAllRanges();
    
        document.body.removeChild(textarea);
        */
        
        
        var cpclip = document.createElement('input');
        document.body.appendChild(cpclip);
        cpclip.value = fileName;
        cpclip.select();
        console.log('copy success', document.execCommand('copy'));
        document.body.removeChild(cpclip);
    
    })
}

window.onload = saveAsPdf;