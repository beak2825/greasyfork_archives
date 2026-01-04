// ==UserScript==
// @name         arXiv-save-as-PDF
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  when download paper from arxiv.org, automate set the file name as the paper's title
// @author       csxz
// @match        https://arxiv.org*
// @include      https://arxiv.org*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369522/arXiv-save-as-PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/369522/arXiv-save-as-PDF.meta.js
// ==/UserScript==

function autoNaming() {
    
    // find the title
    var title = document.getElementsByClassName("title mathjax")[0].innerText;
    //find where to put the tag
    var loc = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
    var obj = document.createElement("li");
    //get the pdf url
    var url = document.getElementsByClassName("full-text")[0].getElementsByTagName('a')[0].href;
    var pdfurl = url;
    var pubtime = document.getElementsByClassName("list")[0].getElementsByTagName('a')[2].innerText;
    var pubyear = '20' + pubtime.substr(0,2);
    var arxivid = document.getElementsByClassName("arxivid")[2].getElementsByTagName('a')[0].innerText;
    var vernum = arxivid.slice(-2);
    var fileName = pubyear + '-arXiv-' + vernum + '-' + title.toString().replace(':', ' -').replace('?',',') + '.pdf';
    obj.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + pdfurl +'>Save as pdf</a>';
    loc[0].insertBefore(obj, loc[0].childNodes[0]);
    
    //put fileName to Clipboard
    var firstli = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[0];
    firstli.addEventListener('click', function(){
        var cpaclip = document.createElement('input');
        document.body.appendChild(cpaclip);
        cpaclip.value = fileName;
        cpaclip.select();
        console.log('copy success', document.execCommand('copy'));
        document.body.removeChild(cpaclip);
    })
}

window.onload = autoNaming;