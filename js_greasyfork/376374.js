// ==UserScript==
// @name         CVF-PDF-AutoNaming
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  when download paper from openaccess.thecvf.com, auto-naming the pdf file.
// @author       csxz
// @include      http://openaccess.thecvf.com/content_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376374/CVF-PDF-AutoNaming.user.js
// @updateURL https://update.greasyfork.org/scripts/376374/CVF-PDF-AutoNaming.meta.js
// ==/UserScript==

function autoNaming() {
    var ptitle = document.getElementById('papertitle').innerText.toString().replace(':', ' -').replace('?', ',');
    
    var taga = document.getElementsByTagName('a');
    if(taga.length > 4)
    {
        var dllink = '';
        for(var jj = 4,len = taga.length; jj < len; jj++){
            dllink = taga[jj];
            if(dllink.innerText == "pdf")
            {
                break;
            }
        }
        
        var pprefixs = taga[2].innerText.split(' ');
        ptitle = pprefixs[1] + '-' + pprefixs[0] + '-' + ptitle + '.pdf';
        dllink.setAttribute('download', ptitle);
        
        dllink.addEventListener('click', function(){
            var cppclip = document.createElement('input');
            document.body.appendChild(cppclip);
            cppclip.value = ptitle;
            cppclip.select();
            console.log('copy success', document.execCommand('copy'));
            document.body.removeChild(cppclip);
        })
    }
}

window.onload = autoNaming;