// ==UserScript==
// @name         Springer-save-as-PDF
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  when download paper from springer, save the pdf file using the title as file name.
// @author       csxz
// @include      https://link.springer.com/chapter/*
// @include      https://link.springer.com/article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369543/Springer-save-as-PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/369543/Springer-save-as-PDF.meta.js
// ==/UserScript==

function saveAsPdf() {
    
    var filename = "";
    var pdfurl = "";
    
    var urltype = document.location.toString().split('/')[3];
    
    if (urltype == "article")
    {
        // find the title
        var titlea = document.getElementsByClassName("ArticleTitle")[0].innerText;
        filename = titlea.toString().replace(':', ' -').replace('?',',') + '.pdf';
        
        //get prefix
        var citeas = document.getElementById("citethis-text").innerText.split(".");
        var prefixs = citeas[citeas.length-4].split("(");
        filename = prefixs[1].substr(0,4) + "-" + prefixs[0].slice(1,-1) + "-" + filename;
        
        //add 'download' attr.
        var pdfdiv = document.getElementsByClassName("c-button c-button--blue c-button__icon-right gtm-pdf-link")[2];
        pdfdiv.setAttribute('download',filename);
        
        pdfurl = pdfdiv.href;
        
        //Add filename to clipboard
        pdfdiv.addEventListener('click', function(){
            var cpsaclip = document.createElement('input');
            document.body.appendChild(cpsaclip);
            cpsaclip.value = filename;
            cpsaclip.select();
            console.log('copy success', document.execCommand('copy'));
            document.body.removeChild(cpsaclip);
        })
        
    }
    else if (urltype == "chapter")
    {
        // find the title
        var titlec = document.getElementsByClassName("ChapterTitle")[0].innerText;
        filename = titlec.toString().replace(':', ' -').replace('?',',') + '.pdf';
        
        //get the pdf url
        var pdfa = document.getElementsByClassName("gtm-pdf-link")[0];
    
        //get prefix
        var citeyear = document.getElementById("citethis-text").innerText.split(")")[0].split("(")[1];
    
        filename = citeyear + "-" + filename;
    
        //replace Download content
        pdfa.setAttribute('download', filename);
        pdfurl = pdfa.href;
        
        //Add filename to clipboard
        pdfa.addEventListener('click', function(){
            var cpscclip = document.createElement('input');
            document.body.appendChild(cpscclip);
            cpscclip.value = filename;
            cpscclip.select();
            console.log('copy success', document.execCommand('copy'));
            document.body.removeChild(cpscclip);
        })
    }
    
    
    //find where to put the tag
    var loc = document.getElementsByClassName("article-contents")[0];
    //also add a Save as pdf link
    var obj = document.createElement("li");
    obj.innerHTML = '<a download='+ '"'+ filename + '"' + ' href=' + '"'+ pdfurl + '"' +'>Save as pdf</a>';
    loc.insertBefore(obj, loc.childNodes[0]);
}
window.onload = saveAsPdf;