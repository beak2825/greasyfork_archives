// ==UserScript==
// @name       BTCJam Utils
// @namespace  http://0xdecafbad.com/
// @version    20141609.1
// @description  Utilities to assist in lending decisions for BTCJam.  BTC Donations 1GJPhRC6bhX275RN3cL3EtRcS1ZumDkJxE
// @match      https://btcjam.com/listings/*
// @match      https://btcjam.com/users/*
// @match      https://www.btcjam.com/listings/*
// @match      https://www.btcjam.com/users/*
// @author	   Bret McDanel trixter@0xdecafbad.com https://btcjam.com/users/33794
// @copyright  2014, Bret McDanel
// @downloadURL https://update.greasyfork.org/scripts/5061/BTCJam%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/5061/BTCJam%20Utils.meta.js
// ==/UserScript==


(function(){
    // === Standard Toolbox functions ===
    function isDefined(x) { return (typeof x != 'undefined' && x != null && x !== null); }
    
    if (!String.format) {
        String.format = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) { 
                return typeof args[number] != 'undefined'
                ? args[number] 
                : match
                ;
            });
        };
    }
    
    
    
    // === Get some general info about the loan listing ===
    function getGeneralListingInfo(doc)
    {
        var generalListing = doc.getElementsByClassName('listing-nav listing-nav-top')[0].getElementsByClassName('large-space')[0];
        if(generalListing) {
            var listingInfo = generalListing.innerHTML.trim();
            if(listingInfo.substring(0,4) == "<br>") listingInfo = listingInfo.substring(4);
            return listingInfo;
        }
        return "Unable to fetch general listing info";
    }
    
    // === get the degrees of separation info ===
    function getUserReferencesInfo(doc)
    {
        var userReferences = doc.getElementsByClassName('info-block')[7].getElementsByClassName('subsection small-text')[0];
        if(userReferences) {
            return userReferences.innerHTML;
        }
        
        return "Unable to fetch User References info";
    }
    
    // === get the listing summary table ===
    function getListingSummaryInfo(doc)
    {
        var listingSummary = doc.getElementsByClassName('tableless small-text reset-small')[1];
        if(listingSummary) {
            summaryArray = [];
            
            var summaryData = listingSummary.getElementsByClassName('listing-rating-block');
            for (var i=0;i<summaryData.length;i++) {
                var summaryClasses=summaryData[i].getElementsByTagName('i')[0].className.split(" ");
                for (j in summaryClasses) {
                    if((/^rating-*/).test(summaryClasses[j])) {
                        summaryArray.push("<td class=\""+summaryClasses[j]+"\">"+summaryData[i].getElementsByTagName('span')[0].innerHTML+"</td>");
                        break;
                    }
                }
            }
            if(summaryArray.length == 6) {            
                return "<table class=\"btcjam-utils-table\">"+
                    "<tr>"+summaryArray[0]+summaryArray[3]+"</tr>"+
                    "<tr>"+summaryArray[1]+summaryArray[4]+"</tr>"+
                    "<tr>"+summaryArray[2]+summaryArray[5]+"</tr>"+
                    "</table><a href=\"http://btcjamtop.com/Home/Explanation\" target=\"_blank\">Explanation</a>";
            }
        }
        
        return "Unable to fetch Listing Summary Info";
    }
    
    
    
    // === get the toolbar search elements ===
    function getSearches(pageType)
    {
        var avatarURL, userName, credentialData, ebayName, forumName;
        
        if(pageType == 'listing') {
            avatarURL = document.getElementsByClassName('user-img-listing')[0].src;
            userName = document.getElementsByClassName('well')[0].getElementsByTagName('a')[0].innerHTML;
            credentialData = document.getElementsByClassName('well')[0].getElementsByTagName('dl')[3].getElementsByTagName('dd');
            
            for (var i=0;i<credentialData.length;i++) {
                if(credentialData[i].innerHTML.substring(0,5) == "Forum") {
                    forumName = credentialData[i].innerHTML.substring(7);
                } else if(credentialData[i].innerHTML.substring(0,4) == "eBay") {
                    ebayName = credentialData[i].innerHTML.substring(6);
                }
                    }
        } else if(pageType == 'user') {            
            avatarURL = document.getElementsByClassName('user-img-profile')[0].src;
            userName = document.getElementsByClassName('listingsummary')[0].getElementsByTagName('h1')[0].innerHTML;
            credentialData = document.getElementsByClassName('col-md-3')[4].getElementsByTagName('dl')[0].getElementsByTagName('dd');
            for (var i=0;i<credentialData.length;i++) {
                if(credentialData[i].innerHTML.substring(0,5) == "Forum") {
                    forumName = credentialData[i].innerHTML.substring(7);
                } else if(credentialData[i].innerHTML.substring(0,4) == "eBay") {
                    ebayName = credentialData[i].innerHTML.substring(6);
                }
                    }
        }            
            
            var searchUrls = 
                '<a target="_blank" href="http://images.google.com/searchbyimage?site=search&image_url='+avatarURL+'">Google Avatar</a>' +
                ' / ' +
                '<a target="_blank" href="http://google.com/search?q=%22'+userName+'%22">Google '+userName+'</a>';
        
        if(typeof ebayName != "undefined") {
            searchUrls += ' / <a target="_blank" href="http://ebay.com/usr/'+ebayName+'">Ebay '+ebayName+'</a>' +
                ' / <a target="_blank" href="http://google.com/search?q=%22'+ebayName+'%22">Google '+ebayName+'</a>';
        }
        if(typeof forumName != "undefined") {
            searchUrls += ' / BitcoinTalk username '+forumName+' / <a target="_blank" href="http://google.com/search?q=site:bitcointalk.org%20%22'+forumName+'%22">Google '+forumName+'</a>';
        }
        document.getElementById('btcjam-utils-searches').innerHTML += searchUrls;
    }
    
    
    // === populate the listing data ===
    function getListingData(listingID)
    {
        
        // Get the listing data from BTCJAMTOP.com
        var url = "http://www.btcjamtop.com/listings/inspect/"+listingID;
        GM_log("fetching "+url);
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response){
                if(response.status >= 200 && response.status <= 299) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString (response.responseText, 'text/html');
                    if (typeof doc === 'undefined') {
                        GM_log("Unable to load "+url+" (empty document)");
                        document.getElementById('generalInfo').innerHTML = "Unable to load "+url+" (empty document)";
                    } else {
                        document.getElementById('generalInfo').innerHTML = getGeneralListingInfo(doc);
                        document.getElementById('referenceInfo').innerHTML = getUserReferencesInfo(doc);
                        document.getElementById('listingSummary').innerHTML = getListingSummaryInfo(doc);
                    }
                } else {
                    GM_log("Unable to load "+url+" (server error "+response.status+")");
                    document.getElementById('generalInfo').innerHTML = 'Unable to load '+url+' (server error '+response.status+')';
                }
            }
        });
    }
    
    
    // === get the bitcointalk forum profile info ===
    function getForumData(forumName)
    {
        var url = 'https://bitcointalk.org/index.php?action=mlist;sa=search';
        
        GM_log("Fetching "+url);
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: "search="+forumName+"&submit=Search&fields%5B%5D=name",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                var parser = new DOMParser();
                var doc = parser.parseFromString (response.responseText, 'text/html');
                if (typeof doc === 'undefined') {
                    GM_log("Unable to load "+url+" (empty document)");
                    document.getElementById('bitcointalkInfo').innerHTML = "Unable to load "+url+" (empty document)";
                } else {
                    var forumData = doc.getElementsByClassName('bordercolor')[1];
                    var forumRows = forumData.getElementsByTagName('tr');
                    for (var i=2; i<forumRows.length;i++) {
                        if(typeof forumRows[i].getElementsByTagName('td')[1] != "undefined") {
                            linkHTML = forumRows[i].getElementsByTagName('td')[1].getElementsByTagName('a')[0];
                            if(linkHTML.innerHTML == forumName) {
                                document.getElementById('bitcointalkInfo').innerHTML = '<table style="background-color:#ccccff; border=1px solid black;border-spacing: 5px;" ID="bitcointalkTable"><th colspan=2>Bitcointalk Info</th></table>';
                                
                                // get profile page
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: linkHTML.href,
                                    onload: function(response){
                                        if(response.status >= 200 && response.status <= 299) {
                                            var forumParser = new DOMParser();
                                            var forumDoc = parser.parseFromString (response.responseText, 'text/html');
                                            if (typeof forumDoc === 'undefined') {
                                                GM_log("Unable to load "+linkHTML.href+" (empty document)");
                                                document.getElementById('bitcointalkInfo').innerHTML = "Unable to load "+linkHTML.href+" (empty document)";
                                            } else {
                                                document.getElementById('btcjam-utils-searches').innerHTML += ' / <a href="'+linkHTML.href+'">Bitcointalk Profile</a>';
                                                
                                                GM_log(forumDoc.getElementsByClassName('bordercolor')[1].getElementsByTagName('table')[0]);
                                                var bct = forumDoc.getElementsByClassName('bordercolor')[1].getElementsByTagName('table')[0].getElementsByTagName('tr');
                                                for (var j=0;j<bct.length;j++) {
                                                    if ((/.*Posts:*/).test(bct[j].getElementsByTagName('td')[0].innerHTML)) {
                                                        document.getElementById('bitcointalkTable').innerHTML += '<tr><td>Posts:</td><td>'+bct[j].getElementsByTagName('td')[1].innerHTML+'</td></tr>';
                                                    } else if ((/.*Position:*/).test(bct[j].getElementsByTagName('td')[0].innerHTML)) {
                                                        document.getElementById('bitcointalkTable').innerHTML += '<tr><td>Position:</td><td>'+bct[j].getElementsByTagName('td')[1].innerHTML+'</td></tr>';
                                                    } else if ((/.*Date\sRegistered:*/).test(bct[j].getElementsByTagName('td')[0].innerHTML)) {
                                                        document.getElementById('bitcointalkTable').innerHTML += '<tr><td>Registered:</td><td>'+bct[j].getElementsByTagName('td')[1].innerHTML+'</td></tr>';
                                                    } else if ((/.*Last\sActive:*/).test(bct[j].getElementsByTagName('td')[0].innerHTML)) {
                                                        document.getElementById('bitcointalkTable').innerHTML += '<tr><td>Last Active:</td><td>'+bct[j].getElementsByTagName('td')[1].innerHTML+'</td></tr>';
                                                    } else if ((/.*Location:*/).test(bct[j].getElementsByTagName('td')[0].innerHTML)) {
                                                        document.getElementById('bitcointalkTable').innerHTML += '<tr><td>Location:</td><td>'+bct[j].getElementsByTagName('td')[1].innerHTML+'</td></tr>';
                                                    } else if ((/.*Trust:*/).test(bct[j].getElementsByTagName('td')[0].innerHTML)) {
                                                        document.getElementById('bitcointalkTable').innerHTML += '<tr><td>Trust:</td><td>'+bct[j].getElementsByTagName('td')[1].innerHTML+'</td></tr>';
                                                    }
                                                        }
                                                
                                            }
                                            
                                        } else {
                                            GM_log("Unable to load "+linkHTML.href+" (server error "+response.status+")");
                                            document.getElementById('bitcointalkInfo').innerHTML = 'Unable to load '+linkHTML.href+' (server error '+response.status+')';
                                        }
                                    }
                                });
                                i=forumRows.length;
                            }
                            
                        }
                    }
                }
            }
        });
    }
    
    
    
    function injectHTML()
    {
        // load BTCJamTop CSS so snarfed HTML renders correctly
        var btcjamtopStyle = 
            '.red-text { color: #c00; }'+
            '.green-text { color: #080; }'+
            '.reference-summary h4 {font-size: 14px }'+
            '.reference-summary td { text-align: right }'+
            '.reference-degree-1st { background: #ffc; }'+
            '.balance-red { color: #800; }'+
            '.balance-nil { color: #ccc }'+
            '.balance-green { color: #080; }'+
            '.currency-usd{ display: none;}'+
            '.currency-btc{ display: inline;}'+
            '.use-usd .currency-usd{ display: inline;}'+
            '.use-usd .currency-btc{ display: none;}'+
            '.rating-good { background: #0c0; }'+
            '.rating-ok { background: #060; }'+
            '.rating-bad { background: #c00; }'+
            '.rating-crap { background: #000; }'+
            '.btcjam-utils-wrapper {border: none;}'+
            '.btcjam-utils-clear {clear:both;}'+
            '.btcjam-utils-main {float:left;padding:0px 0px 5px 0px;}'+
            'table.btcjam-utils-table {border-collapse: collapse; border: 2px solid black; padding: 2px 2px 2px 2px;}'+
            'td.btcjam-utils-table {border-collapse: collapse; border: 2px solid black; padding: 2px 2px 2px 2px;}'+
            'th.btcjam-utils-table {border-collapse: collapse; border: 2px solid black; padding: 2px 2px 2px 2px;}'+
            '.btcjam-utils-toolbar {width:100%;}'+
            '.btcjam-utils-tools {clear:left;float:left;padding:0px 0px 0px 0px;width: 100%;border-bottom: 2px solid #000000;}'+
            '.btcjam-utils-toolicons {float:left; padding: 0px 10px 0px 0px;}'+
            '.btcjam-utils-datasource {float:right; padding: 0px 10px 0px 0px;}'+
            'fieldset.btcjam-utils { border:2px solid #191970; background: #fff; }'+
            'legend.btcjam-utils { margin-left: 3em; width: auto; padding: 0.2em 0.5em; border:1px solid #191970; color:#191970; font-size:90%; font-weight: bold; background: #fff;}'+
            '.btcjam-utils-donate-pane {margin: 3em 15%; width: 40%; position: fixed; top: 0; left: 0; border: thin solid black; color: black; background: #ddd; opacity: 1.0; -moz-border-radius: 10px; font-size: 12pt; z-index: 99999; padding: 6px; display: none; font-family: Arial, sans-serif;}'+
            '.btcjam-utils-donate-titlebar {clear:left; float:left; font-weight: bold; width: 80%;}'+
            '.btcjam-utils-donate-closebutton {font-size:85%; float:right; padding: 0px 10px 0px 0px;}'+
            '.btcjam-utils-donate-contentlink {text-decoration: none;}'+
            '.btcjam-utils-donate-contentcolumn {float:left; width:50%;}';
        
        
        
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) { 
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = btcjamtopStyle;
            head.appendChild(style);
        }
        
        // create placeholders for the info
        var BTCJamUtilityHeader = document.createElement("div");
        BTCJamUtilityHeader.setAttribute('class','btcjam-utils-wrapper');
        BTCJamUtilityHeader.innerHTML =
            '<fieldset class="btcjam-utils">'+
            '  <legend class="btcjam-utils">BTCJam Utils Executive Summary</legend>'+
            '  <div class="btcjam-utils-toolbar">'+
            '    <div class="btcjam-utils-tools">'+
            '      <div class="btcjam-utils-toolicons"><a href="" class="btcjam-utils-donate-contentlink" id="btcjam-utils-donate-button" onclick="return false;">[Donate]</a></div>'+
            '      <div id="btcjam-utils-searches" class="btcjam-utils-searches"></div>'+
            '      <div id="btcjam-utils-datasource" class="btcjam-utils-datasource"></div>'+
            '    </div>'+
            '  </div>'+
            '  <div id="btcjam-utils-data">'+
            '      <div class="btcjam-utils-main">'+
            '        <div id="listingSummary"></div>'+
            '        <div id="generalInfo"></div>'+
            '      </div>' +
            '      <div id="referenceInfo" class="tool-div"></div>' +
            '      <div id="bitcointalkInfo" class="tool-div"></div>' +
            '      <div class="clear-div"></div>'+
            '  </div>'+
            '</fieldset>'+
            '<div class="btcjam-utils-donate-pane" id="btcjam_utils_donate">' +
            '  <div class="btcjam-utils-tools">'+
            '      <div class="btcjam-utils-donate-titlebar" id="btcjam_utils_donate_titlebar"><strong>BTCJam Utils</strong></div>'+
            '      <div class="btcjam-utils-donate-closebutton" id="btcjam_util_donate_closebutton">'+
            '          <a href="" class="btcjam-utils-donate-contentlink" id="btcjam-utils-donate-closebuttonlink" onclick="return false;">Close [X]</a>'+
            '      </div>'+
            '  </div>'+
            '  <div class="btcjam-utils-tools">'+
            '    <br/><br/>'+
            '    <font size="-1">'+
            '      If you find this helpful and wish to donate you may do so at the following Bitcoin addresses:<br>'+
            '      For the Userscript donate to <a href="https://btcjam.com/users/33794">Bret McDanel</a> at 1GJPhRC6bhX275RN3cL3EtRcS1ZumDkJxE<br/>'+
            '      For the underlying data donate to <a href="http://btcjamtop.com/Home/About">BTCJam ala Zaibot</a> at 1B9YHzGAN2Zb6HDDNeJax7pRnsRq15pmXT<br/>'+
            '    </font>'+
            '  </div>'+
            '</div>';
        
        
        
        document.body.insertBefore(BTCJamUtilityHeader,document.body.firstChild);
        document.getElementById('btcjam-utils-donate-closebuttonlink').addEventListener('click',function(e) { document.getElementById('btcjam_utils_donate').style.display = 'none'; },false);
        document.getElementById('btcjam-utils-donate-button').addEventListener('click',function(e) { document.getElementById('btcjam_utils_donate').style.display = 'block'; }, false);
    }
    
    
    
    // === This is the main program ===
    GM_log("Loading BTCJam Utils version "+GM_info.script.version);
    
    
    
    
    var BTCJamLocation=/(user|listing)(?:s)?\/(\d+)/i.exec(location.href);
    
    if(isDefined(BTCJamLocation[2])) {
        injectHTML();
        getSearches(BTCJamLocation[1]);
        
        if (BTCJamLocation[1]==='listing') {
            document.getElementById('generalInfo').innerHTML = 'Loading ...';
            document.getElementById('btcjam-utils-datasource').innerHTML = 'Data provided by <a target="_blank" href="http://www.btcjamtop.com/listings/inspect/'+BTCJamLocation[2]+'">BTCJam a la Zaibot</a>'
            // get Zaibot data
            getListingData(BTCJamLocation[2]);
            
            // Get bitcointalk forum Data
            if(typeof forumName != "undefined") getForumData(forumName);
            
        } else if(BTCJamLocation[1]==='user') {
            // we are viewing a user so get that data
            document.getElementById('btcjam-utils-datasource').innerHTML = 'Data provided by <a target="_blank" href="http://www.btcjamtop.com/Explorer/User/'+BTCJamLocation[2]+'">BTCJam a la Zaibot</a>'
        }
            }
    
})();
/* For Emacs:
 * Local Variables:
 * mode:c
 * indent-tabs-mode:t
 * tab-width:4
 * c-basic-offset:4
 * End:
 * For VIM:
 * vim:set softtabstop=4 shiftwidth=4 tabstop=4:
 */