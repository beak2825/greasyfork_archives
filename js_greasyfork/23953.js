// ==UserScript==
// @name         Literotica Downloader
// @version      1.0
// @description  Download stories from Literotica in text, html or hta format.
// @author       AnoPem
// @match        https://www.literotica.com/s/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.0.272/jspdf.debug.js
// @grant        none
// @namespace https://greasyfork.org/users/22390
// @downloadURL https://update.greasyfork.org/scripts/23953/Literotica%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/23953/Literotica%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Settings
    var content 	= ".b-story-body-x";
    var identifier 	= ".b-story-body-x p";
    //Story info
    var source = window.location.href;
    var title = $('.b-story-header h1').text();
    var author = $('.b-story-user-y a').first().text();
    var disclaimer = $(content + ' i').first().text();
    //Append download button
    $('#logo').append('<div style="float:left;width:140px;margin-top:10px;margin-left:5px;color:red;"><select class="DownloadMethod" style="float:left;visibility:hidden;"><option disabled selected>Select download output</option><option value="text/plain">Text</option><option value="text/html">HTML</option><option value="application/hta">HTA</option></select><b class="LoadingStory" style="float:left;">(Loading 0%)</b></div>');
    $('.DownloadMethod').on('change', function(){
        var type = $('.DownloadMethod option:selected').val();
        if (type == "text/plain"){
            downloadTxt(title, author, disclaimer, content, source, title, type);
        } else if (type === "text/html"){
            downloadTxt(title, author, disclaimer, content, source, title, type);
        } else if (type === "application/hta"){
            downloadTxt(title, author, disclaimer, content, source, title, type);
        }
    });
    //Page grabber
    var pages = $('select[name=page] > option').length;
    var loader = $('<div>');
    var page = 1;
    if (pages > 1){
        GetPages(page, pages, identifier);
    }
    function GetPages(page, max, identifier){
        page++;
        if (page !== (max+1)){
            loader.load(source + "?page=" + page + " " + identifier, function(response, status, jqXHR ) {
                console.log("Page: " + page + " loaded");
                $('.LoadingStory').text('(Loading ' + Math.round(page / max * 100) + '%)');
                $(identifier).append(loader.html()).children().unwrap();
                GetPages(page, max, identifier);
            });
        } else {
            $('.DownloadMethod').css('visibility', 'visible');
            $('.LoadingStory').text('(Loading complete)');
        }
    }
    //downloadTxt(title, author, disclaimer, content, source, filename, type);
    function downloadTxt(title, author, disclaimer, content, source, filename, type) {
        text = "";
        var html = $('<div>').append($(content).html());
        html.find('i').first().remove();
        html.html(html.html().replace('*****', ''));
        if (type === "text/plain"){
            html.find('br').replaceWith("\r\n");
        }
        if (type === "text/plain"){
            text = text + title;
            text = text + '\r\nWritten by: ' + author;
            text = text + '\r\nSource: ' + source;
            if (disclaimer !== ""){
                text = text + '\r\n\r\n************************* Disclaimer *************************\r\n' + disclaimer + '\r\n************************* Disclaimer *************************\r\n';
            }
            text = text + '\r\n' + html.text();
        } else {
            if (type === "text/html"){
                winWidth = "478px";
            } else{
                winWidth = "100%";
            }
            text = '<html><head><title>' + title + '</title><script type="text/javascript">window.resizeTo(800,800);</script><script>function bw(){document.body.style.background = "#FFFFFF";document.body.style.color = "#000000";}function wb(){document.body.style.background = "#000000";document.body.style.color = "#FFFFFF";}function sp(){document.body.style.background = "#F5F5DC";document.body.style.color = "#81613E";}</script></head><html><body style="text-align:center;"><div style="display:inline-block;width:500px;height:auto;overflow:hidden;text-align:left;"><div style="width:' + winWidth + ';margin-bottom:20px;padding:10px;border:1px solid #CCC;text-align:center;"><span style="float:left;width:100%;text-align:center;margin-bottom:5px;">Color mode</span><button onClick="bw();" style="width:120px;">Black on White</button><button onClick="wb();" style="width:120px;margin-left:5px;">White on Black</button><button onClick="sp();" style="width:120px;margin-left:5px;">Sepia</button></div>';
            text = text + '<h1 style=";width: 100%;font-size:30px;text-align: center;">' + title + '</h1>';
            text = text + '<br><i style="float:left;width:100%;text-align:center;">Written by: ' + author + '</i>';
            text = text + '<br><p style="float:left;width:100%;text-align:center;">Source: ' + source + '</p>';
            if (disclaimer !== ""){
                text = text + '<div style="text-align:center;color:red;"><br><br>************************* Disclaimer *************************<br>' + disclaimer + '<br>************************* Disclaimer *************************<br></div>';
            }
            text = text + '<br>' + html.html().trim();
            text = text + "</div></body></html>";
        }
        var dlTxt = document.createElement('a');
        if (type === "text/plain"){
            dlTxt.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        } else if (type === "text/html"){
            dlTxt.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
        } else{
            dlTxt.setAttribute('href', 'data:application/hta;charset=utf-8,' + encodeURIComponent(text));
        }
        dlTxt.setAttribute('download', filename);
        dlTxt.style.display = 'none';
        document.body.appendChild(dlTxt);
        dlTxt.click();
        document.body.removeChild(dlTxt);
    }
})();