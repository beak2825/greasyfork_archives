// ==UserScript==
// @name           DW - Dead Link Reporter
// @namespace      http://forum.dirtywarez.com/*
// @description    Reports dead links with only one click.
// @author         Nenad__
// @version        1.2
// @license        GPL version 3 or any later version (http://www.gnu.org/copyleft/gpl.html)
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @grant          GM_getResourceText
// @include        http://forum.dirtywarez.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/16978/DW%20-%20Dead%20Link%20Reporter.user.js
// @updateURL https://update.greasyfork.org/scripts/16978/DW%20-%20Dead%20Link%20Reporter.meta.js
// ==/UserScript==


/*******************************************************************
**  Changelog:
**
**  Version 1.2:
**  - Code improvements
**  - Added displayMsgStyle class for response messages
**  
**  Version 1.1:
**  - Fixed CSS errors
**  - Fixed image location
**  - Added success and error response
**  
**
**  by Nenad__@Forum.DirtyWarez.Com
********************************************************************/



this.$ = this.jQuery = jQuery.noConflict(true);

var inListings = false; 

function html_exists(html) {
    var htmlString = $('body').html().toString();
    var index = htmlString.indexOf(html);
    if (index != -1)
        return true;
    else 
        return false;
}

if (html_exists('./viewforum.php?f=8" class="breadcrumb"')) {
    console.log("Viewing Downloads Section");

    if (html_exists("./viewforum.php?f=8"))
        inListings = true;
}


var reportMessage = escape('This post has been reported for dead links using the DW - Dead Lik Reporter');
var displayMsgStyle = GM_addStyle(".displayMsgStyle{width:100%;position:fixed;top:0;color:#fff;font-weight:700;background:#353f4b;font-size:16px;text-align:center;border:2px solid #eb9135}");


if (inListings == true) {

    var reportLink = $('a.report-icon').attr('href');
  
    if (reportLink != null) {
        var deadButton = $('<li>\
                            <a title="DW - Dead Link Reporter" href="#report" class="button icon-button">\
                            <img src="http://i.imgur.com/vST60Ej.jpg" style="margin: 0 0 0 3px" id="deadlink">\
                            </li>').appendTo('ul.post-buttons:first');
        
      	$(deadButton).on('click', function () {
            GM_addStyle("#deadlink" + "{ margin: 0 0 0 7px!important; }");

            GM_xmlhttpRequest({
                method: "POST",
                url: reportLink,
                data: 'report_text=' + reportMessage + '&reason_id=5&submit=Submit',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {

                    if (response.responseText.indexOf("already been reported") > -1) {
                        GM_addStyle("#deadlink" + "{ display: none; }");
                        $("<div>", {
                            text: "ERROR: This post has already been reported.",
                            'class': 'displayMsgStyle'
                        }).appendTo("body");
                    }

                    if (response.responseText.indexOf("successfully") > -1) {
                        GM_addStyle("#deadlink" + "{ display: none; }");

                        $("<div>", {
                            text: "Dead links have been sucessfully reported! Thank you for reporting dead links.",
                            'class': 'displayMsgStyle'
                        }).appendTo("body");
                    }
                },
                onerror: function() {
                    alert("Could not report the thread");
                }
            });
            
        });
    }
}