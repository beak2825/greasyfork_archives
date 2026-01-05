// ==UserScript==
// @name       File Hosting Download Manager Disabler
// @namespace   813878cf6d21d80383c65d70567952bd
// @version    1.0.1
// @author     mac9erd
// @description  Remove file hosting download manager option and replace with direct download link
// ===================================================
// Supported Sites:
// @match      *://*.datafilehost.com/*
// @match      *://*.filehippo.com/*
// @match	   *://*.tusfiles.net/*
// @match	   *://*.billionuploads.com/*
// ===================================================
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/4423/File%20Hosting%20Download%20Manager%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/4423/File%20Hosting%20Download%20Manager%20Disabler.meta.js
// ==/UserScript==

$(document).ready(function(){ 
    if(window.location.href.indexOf("datafilehost") > -1) dataFileHost();
    else if(window.location.href.indexOf("filehippo") > -1) fileHippo();
    else if(window.location.href.indexOf("tusfiles") > -1) tusFiles();
    else if(window.location.href.indexOf("billionuploads") > -1) billionUploads();
    else alert("Site not supported!");
    
    function dataFileHost() {
        var page = String(location).split('/')[3];
    	var fileId = String(location).split('/')[4]; 
    	if ( page == "d") $('form').remove();
    	function viewDownloadLink() { 
       	 document.getElementById("dl").innerHTML = ('<a href="http://www.datafilehost.com/get.php?file=' + fileId + '"><img src="http://commondatastorage.googleapis.com/datafilehost%2Fdownload.png" alt="Download"></a></br></br></br>');
        };
    	viewDownloadLink();
    }
    
    function fileHippo() {
        $('#ad-slot-1').remove();
        $('#sidebar').remove();
        $('#sidebar-left').remove();
        $('#sidebar-right').remove();
        $('.techbeat-widget-wide-container.related-software-news').remove();
        $('.techbeat-widget-wide-container.trending-news').remove();
        $('.techbeat-widget-wide-container.trending-news').remove();
        $('.download-confirmation-text-additional').remove();
        $('.techbeat-widget-wide-container.download-page').remove(); 
        GM_addStyle ("\
        #category-header{padding-top: 20px;border-bottom: none;}\
        .program-header-download-link.long.download-manager-enabled {line-height: 1;text-align: right;height: 30px;display: none;}\
        #direct-download-link-container {background: #2baf2b;color:#fff;font-size:13px;padding: 18px;width: 240px;border-radius: 5px;}\
        #direct-download-link-container a {font-weight: bold;color: #fff;text-decoration: none;}\
        #direct-download-link-container a:hover {font-weight: bold;color: #fff;text-decoration: none;}\
        ");
        function getFileSize() {
            var fileSize = document.getElementsByClassName('normal')[0].innerHTML;
            $('#direct-download-link-container a').append('<span class="normal">' + fileSize + '</span>');
        }
        function setCustomText() {
            var searchTerm = 'Direct Download',
            replaceWith = 'Download Latest Version ';
            $("#direct-download-link-container a:contains('" + searchTerm + "')").each(function(){
            	this.innerHTML = this.innerHTML.replace(searchTerm, replaceWith);
            });
        }
        setCustomText();
        getFileSize();
    }
    
    function tusFiles() {
        $('.badge.btn-primary').remove();
        $('.table img').remove();
        $('thead label').remove();

        var oldHTML = document.getElementById('btn_download').innerHTML; 
        var addFileName = 
           '<tr>' +
           '<th width="220" align="left" valign="middle">Filename:</th>' +
           '<th width="100" align="left" valign="middle">' + oldHTML + '</th>' +
           '</tr>';
        $('.table.table-condensed thead').append(addFileName);
       
       function removeCheckbox() {
           var inputs = document.getElementsByTagName("input");
	       for (var i=0; i < inputs.length; i++) { if (inputs[i].getAttribute('type') == 'checkbox') inputs[i].remove();}
       }
        
       function removeColspan() {
           var col = document.getElementsByTagName("td");
	       for (var i=0; i < col.length; i++){ if (col[i].getAttribute('colspan') == 2) col[i].remove();}
        }
        
       function viewDownloadLink() {
	       var newHTML = "Download";
	       document.getElementById('btn_download').innerHTML = newHTML;
       }

       viewDownloadLink();
       removeCheckbox();
       removeColspan();
    }
    
    function billionUploads() {
        $('.dtsha').remove();
        $('.dtid').remove();
        $('.footer').remove();
        var inputs = document.getElementsByTagName("input");
	    for (var i=0; i < inputs.length; i++) {if (inputs[i].getAttribute('type') == 'checkbox') inputs[i].remove();}
     }
});