// ==UserScript==
// @name         PaperDownload & titleAsPDFName
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  下载pdf论文并自动用文章标题重命名文件，点击左上角的save按钮或按 Ctrl+S 触发下载（按键下载有bug暂不可用）。Automatially download a pdf paper and rename it with the paper title. This script works on opened pdf pages, e.g. arxiv.org/pdf/xxx.pdf. Click save button on the top left corner or press Ctrl+S to trigger. Currently support pdf pages in arxiv.org, aclweb.org/anthology/, proceedings.mlr.press，openaccess.thecvf.com, openreview.net, and ieeexplore.ieee.org.
// @author       LTGuo
// @include      https://arxiv.org/pdf/*
// @include      https://browse.arxiv.org/pdf/*
// @include      https://aclweb.org/anthology/*
// @include      https://www.aclweb.org/anthology/*
// @include      http://proceedings.mlr.press/*.pdf
// @include      http://openaccess.thecvf.com/*.pdf
// @include      https://openreview.net/pdf?*
// @include      https://ieeexplore.ieee.org/*
// @include      https://papers.nips.cc/paper/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification
// @require https://greasyfork.org/scripts/383707-hotkeys-min-js/code/hotkeysminjs.js?version=702670
// @downloadURL https://update.greasyfork.org/scripts/370419/PaperDownload%20%20titleAsPDFName.user.js
// @updateURL https://update.greasyfork.org/scripts/370419/PaperDownload%20%20titleAsPDFName.meta.js
// ==/UserScript==


var filename = '';
function is_pdf(url){
    return /pdf/i.test(url.slice(-3)) || document.querySelectorAll("embed")[0].type === "application/pdf";
}

function clean_text(text){
    text = text.replace(/(\r\n\t|\n|\r\t)/gm,"");
    return text;
}

function clean_title(title){
    title = title.replace(/[<>:"/\\|?*]/g, " ");
    title = title.replace(/\s\s+/g, ' ').trim();
    return title;
}


// fectch pdf title for arxiv papers      http://arxiv.org
// paper pdf url: http://arxiv.org/pdf/1411.4555.pdf
// paper info url: https://arxiv.org/abs/1411.4555
// match title:  dc:title="Show and Tell: A Neural Image Caption Generator"
function get_title_arxiv(){
    var url = window.location.href;
    if (is_pdf(url)) {
        var abs_url = url.replace('pdf', 'abs');
        var url_ = url.split('/');
        var yearmon = url_[url_.length-1].split('.')[0];
        var year = yearmon.slice(0,2);
        var mon = yearmon.slice(2,4);
        console.log("year: "+year+", month: "+mon);
        console.log("Abs url: " + abs_url);
        GM_xmlhttpRequest({
            method: "GET",
            url: abs_url,
            onload: function(res) {
                if (res.status === 200) {
                    var text = res.responseText;
                    text = clean_text(text);
                    var regex = /dc:title=(.*)trackback:ping/gm;
                    var match = regex.exec(text);
                    if (match !== null){
                        var title = match[1];
                        title = clean_title(title);
                        console.log("title: "+title);
                        filename = '['+year+'.'+mon+'] '+title+'.pdf';
                        console.log("filename: "+filename);
                    }
                }
            }
        });
        console.log("send");
    }
}


// fectch pdf title for browse.arxiv papers      http://browse.arxiv.org
// paper pdf url: http://browse.arxiv.org/pdf/1411.4555.pdf
// paper info url: https://browse.arxiv.org/abs/1411.4555
// match title:  dc:title="Show and Tell: A Neural Image Caption Generator"
function get_title_browse_arxiv(){
    var url = window.location.href;
    if (is_pdf(url)) {
        var abs_url = url.replace('pdf', 'abs');
        var url_ = url.split('/');
        var yearmon = url_[url_.length-1].split('.')[0];
        var year = yearmon.slice(0,2);
        var mon = yearmon.slice(2,4);
        console.log("year: "+year+", month: "+mon);
        console.log("Abs url: " + abs_url);
        GM_xmlhttpRequest({
            method: "GET",
            url: abs_url,
            onload: function(res) {
                if (res.status === 200) {
                    var text = res.responseText;
                    text = clean_text(text);
                    var regex = /dc:title=(.*)trackback:ping/gm;
                    var match = regex.exec(text);
                    if (match !== null){
                        var title = match[1];
                        title = clean_title(title);
                        console.log("title: "+title);
                        filename = '['+year+'.'+mon+'] '+title+'.pdf';
                        console.log("filename: "+filename);
                    }
                }
            }
        });
        console.log("send");
    }
}

// fectch pdf title for ACL Anthology papers     https://aclanthology.info/
// paper pdf url: https://aclweb.org/anthology/P18-1008, https://www.aclweb.org/anthology/D18-1049
// paper info url: https://aclanthology.info/papers/P18-1008/p18-1008 --> https://aclweb.org/anthology/papers/P/P18/P18-1008/
// match title: <meta content="The Best of Both Worlds: Combining Recent Advances in Neural Machine Translation" name="citation_title" >
function get_title_acl(){
    var url = window.location.href;
    if (is_pdf(url)) {
        var url_ = url.split('/');
        var pid = url_[url_.length-1].split('.pdf')[0];
        var abs_url = "https://aclanthology.info/papers/"+pid+'/'+pid.toLowerCase();
        var year = pid.split('-')[0].slice(1,3);
        console.log("Abs url: " + abs_url);
        console.log("year: "+year);
        GM_xmlhttpRequest({
            method: "GET",
            url: abs_url,
            onload: function(res) {
                if (res.status === 200) {
                    var text = res.responseText;
                    text = clean_text(text);
                    var regex = /<meta content=\"(.*?)\" name=citation_title>/gm;
                    var conf_name_regex = /<a href=\/anthology\/venues\/.*?>(.*?)<\/a>/gm;
                    var match = regex.exec(text);
                    if (match !== null){
                        var title = match[1];
                        title = clean_title(title);
                        match = conf_name_regex.exec(text);
                        var conf_name = "ACL Anthology";
                        if (match !== null){
                            conf_name = match[1].trim();
                        }
                        console.log("title: "+title);
                        console.log("conf_name: "+conf_name);
                        filename = '['+conf_name+year+'] '+title+'.pdf';
                        console.log("filename: "+filename);
                    }
                }
            }
        });
        console.log("send");
    }
}


// fectch pdf title for PMLR papers     http://proceedings.mlr.press
// paper pdf url: http://proceedings.mlr.press/v70/jaderberg17a/jaderberg17a.pdf
// paper info url: http://proceedings.mlr.press/v70/jaderberg17a.html
// match title: <meta name="citation_title" content="Decoupled Neural Interfaces using Synthetic Gradients"/>
function get_title_pmlr(){
    var url = window.location.href;
    if (is_pdf(url)) {
        var url_ = url.split('/');
        var pid = url_[url_.length-1].split('.pdf')[0];
        var abs_url = url.replace('/'+ url_[url_.length-1], '.html');
        console.log("Abs url: " + abs_url);
        GM_xmlhttpRequest({
            method: "GET",
            url: abs_url,
            onload: function(res) {
                if (res.status === 200) {
                    var text = res.responseText;
                    text = clean_text(text);
                    var regex = /<meta name="citation_title" content="(.*?)"\/>/gm;
                    var conf_year_regex = /<meta name="citation_publication_date" content="(.*?)">/gm;
                    var match = regex.exec(text);
                    if (match !== null){
                        var title = match[1];
                        title = clean_title(title);
                        match = conf_year_regex.exec(text);
                        var year = "";
                        if (match !== null){
                            year = match[1].split('/')[0].trim();
                        }
                        console.log("title: "+title);
                        console.log("year: "+year);
                        filename = '[PMLR'+year+'] '+title+'.pdf';
                        console.log("filename: "+filename);
                    }
                }
            }
        });
        console.log("send");
    }
}

// fectch pdf title for thecvf papers     http://openaccess.thecvf.com
// paper pdf url: http://openaccess.thecvf.com/content_cvpr_2018/papers/Bai_Finding_Tiny_Faces_CVPR_2018_paper.pdf
// paper info url: http://openaccess.thecvf.com/content_cvpr_2018/html/Bai_Finding_Tiny_Faces_CVPR_2018_paper.html
// match title: <meta name="citation_title" content="Finding Tiny Faces in the Wild With Generative Adversarial Network"><meta name="citation_author"
function get_title_thecvf(){
    var url = window.location.href;
    if (is_pdf(url)) {
        var url_ = url.split('/');
        var pid = url_[url_.length-1].split('.pdf')[0];
        var abs_url = url.replace('/papers/','/html/').replace('.pdf','.html');
        console.log("Abs url: " + abs_url);
        GM_xmlhttpRequest({
            method: "GET",
            url: abs_url,
            onload: function(res) {
                if (res.status === 200) {
                    var text = res.responseText;
                    text = clean_text(text);
                    var regex = /<meta name="citation_title" content="(.*?)"><meta name="citation_author"/gm;
                    var conf_name_regex = /<div id="header_title"><a href=".*?">(.*?)<\/a>/gm;
                    var match = regex.exec(text);
                    if (match !== null){
                        var title = match[1];
                        title = clean_title(title);
                        match = conf_name_regex.exec(text);
                        var conf_name = "thecvf";
                        if (match !== null){
                            conf_name = match[1].trim();
                        }
                        console.log("title: "+title);
                        console.log("conf_name: "+conf_name);
                        filename = '['+conf_name+'] '+title+'.pdf';
                        console.log("filename: "+filename);
                    }
                }
            }
        });
        console.log("send");
    }
}



// fectch pdf title for OpenReview papers     https://openreview.net/
// paper pdf url: https://openreview.net/pdf?id=ryQu7f-RZ
// paper info url: https://openreview.net/forum?id=ryQu7f-RZ
function get_title_openreview(){
    var url = window.location.href;
    if (is_pdf(url)) {
        var abs_url = url.replace('/pdf?','/forum?');
        console.log("Abs url: " + abs_url);
        GM_xmlhttpRequest({
            method: "GET",
            url: abs_url,
            onload: function(res) {
                if (res.status === 200) {
                    var text = res.responseText;
                    text = clean_text(text);
                    var regex = /<meta name="citation_title" content="(.*?)"\/>/gm;
                    var conf_name_regex = /<h3><span><span>(.*?)Conference Submission/gm;
                    var match = regex.exec(text);
                    if (match !== null){
                        var title = match[1];
                        title = clean_title(title);
                        match = conf_name_regex.exec(text);
                        var conf_name = "openreview";
                        if (match !== null){
                            conf_name = match[1].trim();
                        }
                        console.log("title: "+title);
                        console.log("conf_name: "+conf_name);
                        filename = '['+conf_name+'] '+title+'.pdf';
                        console.log("filename: "+filename);
                    }
                }
            }
        });
        console.log("send");
    }
}


// fectch pdf title for IEEE papers     https://ieeexplore.ieee.org
// paper pdf url: https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8031355
// real pdf url: https://ieeexplore.ieee.org/ielx7/6046/8291714/08031355.pdf?tp=&arnumber=8031355&isnumber=8291714
// paper info url: https://ieeexplore.ieee.org/document/8031355
// match title: "title":"GLA: Global–Local Attention for Image Description",
// match publication name: "doi":"10.1109/TMM.2017.2751140"
function get_title_ieee(){
    var url = window.location.href;
    if (true) {
        var url_ = url.split('arnumber=');
        var pid = url_[url_.length-1].split('&')[0];
        var abs_url = "https://ieeexplore.ieee.org/document/"+pid;
        console.log("Abs url: " + abs_url);
        GM_xmlhttpRequest({
            method: "GET",
            url: abs_url,
            onload: function(res) {
                if (res.status === 200) {
                    var text = res.responseText;
                    text = clean_text(text);
                    var regex = /"title":"(.*?)",/gm;
                    var conf_name_regex = /"doi":".*?\/(.*?\..*?)\..*?"/gm;
                    var match = regex.exec(text);
                    if (match !== null){
                        var title = match[1];
                        title = clean_title(title);
                        match = conf_name_regex.exec(text);
                        var conf_name = "IEEE";
                        if (match !== null){
                            conf_name = match[1].trim();
                        }
                        console.log("title: "+title);
                        console.log("conf_name: "+conf_name);
                        filename = '['+conf_name+'] '+title+'.pdf';
                        console.log("filename: "+filename);
                    }
                }
            }
        });
        console.log("send");
    }
}


// fectch pdf title for OpenReview papers     https://openreview.net/
// paper pdf url: https://papers.nips.cc/paper/8137-coordinate-descent-with-bandit-sampling.pdf
// paper info url: https://papers.nips.cc/paper/8137-coordinate-descent-with-bandit-sampling
// match title: <meta name="citation_title" content="Coordinate Descent with Bandit Sampling">
function get_title_nips(){
    var url = window.location.href;
    if (is_pdf(url)) {
        var abs_url = url.replace('.pdf','');
        console.log("Abs url: " + abs_url);
        GM_xmlhttpRequest({
            method: "GET",
            url: abs_url,
            onload: function(res) {
                if (res.status === 200) {
                    var text = res.responseText;
                    text = clean_text(text);
                    var regex = /<meta name="citation_title" content="(.*?)">/gm;
                    var year_regex = /<meta name="citation_publication_date" content="(.*?)">/gm;
                    var match = regex.exec(text);
                    if (match !== null){
                        var title = match[1];
                        title = clean_title(title);
                        match = year_regex.exec(text);
                        var year = "";
                        if (match !== null){
                            year = match[1].trim();
                        }
                        console.log("title: "+title);
                        console.log("year: "+year);
                        filename = '[NIPS '+year+'] '+title+'.pdf';
                        console.log("filename: "+filename);
                    }
                }
            }
        });
        console.log("send");
    }
}




var url = window.location.href;
// redirect ieee page to real pdf url
if (/ieeexplore.ieee.org\/stamp\/stamp.jsp/i.test(url)){
    var target = document.getElementsByTagName("iframe")[0].src;
    window.location.replace(target);
}

// get paper title
if (/browse\.arxiv\.org\/pdf/i.test(url)){
    get_title_browse_arxiv();
}
else if (/arxiv\.org\/pdf/i.test(url)){
    get_title_arxiv();
}
else if (/aclweb\.org\/anthology\//i.test(url)){
    get_title_acl();
}
else if (/proceedings.mlr.press\/.*\.pdf/i.test(url)){
    get_title_pmlr();
}
else if (/openaccess.thecvf.com\/.*\.pdf/i.test(url)){
    get_title_thecvf();
}
else if (/openreview.net\/pdf/i.test(url)){
    get_title_openreview();
}
else if (/ieeexplore.ieee.org.*pdf.*/i.test(url)){
    get_title_ieee();
}
else if (/papers.nips.cc\/paper\/.*/i.test(url)){
    get_title_nips();
}
else if (/arxivfellow\.com\/pdf/i.test(url)){
    get_title_arxivFellow();
}

// automatically download paper
function download(){
    // GM_setClipboard(filename);
    var xhr = new XMLHttpRequest();
    // load document from local cache
    xhr.open("GET", '', true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
        if (xhr.status === 200) {
            var file = window.URL.createObjectURL(xhr.response);
            var a = document.createElement("a");
            a.href = file;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
        }
    };
    xhr.send();
}

function redirect_arixv_to_mirror(){
    if (window.location.href.includes('browse')){
        var mirror_url = window.location.href.replace('browse.arxiv', 'arxiv');
    }
    else {
        var mirror_url = window.location.href.replace('arxiv', 'browse.arxiv');
    }

    window.location.href = mirror_url;
}

function redirect_arixv_to_abs(){
    var abs_url = url.replace('pdf', 'abs');
    window.open(abs_url);
}

// download by clicking on the button
var btn = document.createElement("button");
btn.innerText = "save";
btn.setAttribute('style', "position:absolute;z-index:1000; left: 12px; top: 12px; height: 28px; padding-left: 20px; padding-right: 20px; background-color: #424649; border: none; color: white; font-size: 16px; cursor: pointer;");
btn.setAttribute('id', "btn");
document.body.appendChild(btn);
btn.onclick=download;
btn.onmouseover = function() {
    this.style.backgroundColor="#424649"
};
btn.onmouseout = function() {
    this.style.backgroundColor="#323639"
};


// download with hot-key (cannot work now)
// hotkeys('ctrl+s', function(event,handler) {
//   switch(handler.key){
//     case "ctrl+s": console.log('you pressed ctrl+s!'); event.preventDefault(); download(); break;
//   }
// });


// add extra buttons for arxiv
if (/arxiv\.org\/pdf/i.test(url)){
    // add a button to redirect arxiv pdf to abs
    var arxiv_abs_btn = document.createElement("button");
    arxiv_abs_btn.innerText = "abs";
    arxiv_abs_btn.setAttribute('style', "position:absolute;z-index:1000; left: 80px; top: 12px; height: 28px; padding-left: 25px; padding-right: 25px; background-color: #424649; border: none; color: white; font-size: 16px; cursor: pointer;");
    arxiv_abs_btn.setAttribute('id', "arxiv_abs_btn");
    document.body.appendChild(arxiv_abs_btn);
    arxiv_abs_btn.onclick=redirect_arixv_to_abs;
    arxiv_abs_btn.onmouseover = function() {
        this.style.backgroundColor="#424649"
    };
    arxiv_abs_btn.onmouseout = function() {
        this.style.backgroundColor="#323639"
    };

    // add a button to redirect arxiv to browse.arxiv (or browse.arxiv to arxiv)
    var arxiv_mirror_btn = document.createElement("button");
    arxiv_mirror_btn.innerText = "mirror";
    arxiv_mirror_btn.setAttribute('style', "position:absolute;z-index:1000; left: 150px; top: 12px; height: 28px; padding-left: 10px; padding-right: 10px; background-color: #424649; border: none; color: white; font-size: 16px; cursor: pointer;");
    arxiv_mirror_btn.setAttribute('id', "arxiv_mirror_btn");
    document.body.appendChild(arxiv_mirror_btn);
    arxiv_mirror_btn.onclick=redirect_arixv_to_mirror;
    arxiv_mirror_btn.onmouseover = function() {
        this.style.backgroundColor="#424649"
    };
    arxiv_mirror_btn.onmouseout = function() {
        this.style.backgroundColor="#323639"
    };


}
