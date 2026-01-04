// ==UserScript==
// @name         Papers Downloading AutoNaming
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  when download paper from Springer/arXiv/IEEE/Elsevier, save the pdf file using the title as file name.
// @author       csxz
// @include      https://link.springer.com/chapter/*
// @include      https://link.springer.com/article/*
// @include      https://arxiv.org/abs/*
// @include      https://ieeexplore.ieee.org/document/*
// @include      https://ieeexplore.ieee.org/abstract/document/*
// @include      http://openaccess.thecvf.com/content_*
// @include      https://www.sciencedirect.com/science/article/pii/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376050/Papers%20Downloading%20AutoNaming.user.js
// @updateURL https://update.greasyfork.org/scripts/376050/Papers%20Downloading%20AutoNaming.meta.js
// ==/UserScript==

function saveAsPdf() {
    
    var mainurl = document.location.toString().split('/')[2];
    
    if (mainurl == "link.springer.com")
    {
        var filename = "";
        var pdfurl = "";
        
        var urltype = document.location.toString().split('/')[3];
        
        if (urltype == "article")
        {
            // find the title
            var titlea = document.getElementsByClassName("ArticleTitle")[0].innerText;
            filename = titlea.toString().replace(':', ' -').replace('?', ',') + '.pdf';
            
            //get prefix
            var citeas = document.getElementById("citethis-text").innerText.split(".");
            var prefixs = citeas[citeas.length-4].split("(");
            filename = prefixs[1].substr(0,4) + "-" + prefixs[0].slice(1,-1) + "-" + filename;
            
            //add 'download' attr.
            var pdfdiv = document.getElementsByClassName("c-button c-button--blue c-button__icon-right")[2];
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
            });
        }
        else if (urltype == "chapter")
        {
            // find the title
            var titlec = document.getElementsByClassName("ChapterTitle")[0].innerText;
            filename = titlec.toString().replace(':', ' -').replace('?', ',') + '.pdf';
            
            //get the pdf url
            pdfa = document.getElementsByClassName("note test-pdf-link")[0].getElementsByTagName('a')[0];
        
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
            });
        }
        
        
        //find where to put the tag
        var loc = document.getElementsByClassName("article-contents")[0];
        //also add a Save as pdf link
        var obj = document.createElement("li");
        obj.innerHTML = '<a download='+ '"'+ filename + '"' + ' href=' + '"'+ pdfurl + '"' +'>Save as pdf</a>';
        loc.insertBefore(obj, loc.childNodes[0]);
    }
    else if (mainurl == "ieeexplore.ieee.org")
    {
        //add a Listener
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
    
            var cpclip = document.createElement('input');
            document.body.appendChild(cpclip);
            cpclip.value = fileName;
            cpclip.select();
            console.log('copy success', document.execCommand('copy'));
            document.body.removeChild(cpclip);
        });
    }
    
    else if (mainurl == "arxiv.org")
    {
        // find the title
        var titlee = document.getElementsByClassName("title mathjax")[0].innerText;
        //find where to put the tag
        var loco = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
        var objj = document.createElement("li");
        //get the pdf url
        var urll = document.getElementsByClassName("full-text")[0].getElementsByTagName('a')[0].href;
        var pdfurlll = urll;
        var pubtime = document.getElementsByClassName("list")[0].getElementsByTagName('a')[2].innerText;
        var pubyear = '20' + pubtime.substr(0,2);
        var arxivid = document.getElementsByClassName("arxivid")[2].getElementsByTagName('a')[0].innerText;
        var vernum = arxivid.slice(-2);
        var fileNamee = pubyear + '-arXiv-' + vernum + '-' + titlee.toString().replace(':', ' -').replace('?', ',') + '.pdf';
        objj.innerHTML = '<a download='+ '"'+ fileNamee + '"' + ' href=' + pdfurlll +'>Save as pdf</a>';
        loco[0].insertBefore(objj, loco[0].childNodes[0]);
        
        //put fileName to Clipboard
        var firstli = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul')[0].getElementsByTagName('li')[0];
        firstli.addEventListener('click', function(){
            var cpaclip = document.createElement('input');
            document.body.appendChild(cpaclip);
            cpaclip.value = fileName;
            cpaclip.select();
            console.log('copy success', document.execCommand('copy'));
            document.body.removeChild(cpaclip);
        });
    }
    
    else if (mainurl == "openaccess.thecvf.com")
    {
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
            });
        }
    }
    
    else if (mainurl == "www.sciencedirect.com")
    {
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
        //var epdflink = document.getElementsByClassName('u-padding-s-bottom')[0];
        //var eobj = document.createElement("li");
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
}

window.onload = saveAsPdf;