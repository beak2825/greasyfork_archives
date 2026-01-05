// ==UserScript==
// @name          Discord Export for @hits
// @description   Export HIT information for Discord
// @version       1.1
// @include       https://www.mturk.com/mturk/findhits*
// @include       https://www.mturk.com/mturk/viewhits*
// @include       https://www.mturk.com/mturk/sorthits*
// @include       https://www.mturk.com/mturk/searchbar*selectedSearchType=hitgroups*
// @include       https://www.mturk.com/mturk/viewsearchbar*selectedSearchType=hitgroups*
// @include       https://www.mturk.com/mturk/sortsearchbar*HITGroup*
// @include       https://www.mturk.com/mturk/preview*
// @exclude       https://www.mturk.com/mturk/findhits?*hit_scraper*
// @grant         GM_setClipboard
// @author        DaNipper mod of Cristo + clickhappier
// @namespace     MTF
// @downloadURL https://update.greasyfork.org/scripts/23028/Discord%20Export%20for%20%40hits.user.js
// @updateURL https://update.greasyfork.org/scripts/23028/Discord%20Export%20for%20%40hits.meta.js
// ==/UserScript==

// v1 DaNipper: added '@hits ' to output
// v3.0c notes:
// modified by clickhappier to reformat output in more logical ordering/separating/labeling,
//   since I thought it was unnecessarily unclear to read with the separators in the middle of each 
//   type of information (label, value, separator, relevant url) instead of between the different types,
//   and wanted to be clearer about what the TO values represented;
// also wanted to remove unnecessary linebreaks in the output that caused it to spread one HIT's info 
//   across several IRC comments, which made it hard to tell where one HIT's info stopped and another began
//   (though after the version I initially modified, Cristo did later do away with all but one linebreak);
// also fixed Amazon fiddling with HIT name cell contents after Oct 20, 2014 change;
// also fixed Turkopticon mirror API domain to keep working after Oct 27, 2014 change


var accountStatus = "loggedOut";
if ( !document.getElementById("lnkWorkerSignin") )  // if sign-in link not present
{ 
    accountStatus = "loggedIn"; 
}


function getUrlVariable(url, variable)
{
    var query = url.split('?');
    var vars = query[1].split("&");
    for ( var i=0; i<vars.length; i++ ) 
    {
        var pair = vars[i].split("=");
        if ( pair[0] == variable )
            { return pair[1]; }
    }
    return(false);
}


var caps = document.getElementsByClassName('capsulelink');
for (var c = 0; c < caps.length/2; c++){
    var button = document.createElement('button');
    button.setAttribute("place",c);
    button.textContent = 'Discord';
    button.style.height = '14px';
    button.style.width = '34px';
    button.style.fontSize = '9px';
    button.style.border = '1px solid';
    button.style.padding = '0px';
    button.style.backgroundColor = 'transparent';
    button.title = 'Click to save HIT information to your clipboard. Please wait while shortened URLs are retrieved.';
    button.addEventListener("click", display, false);
    document.getElementById('capsule'+c+'-0').parentNode.appendChild(button);
}

function getTO(f){
    var toComp = [];
    var toUrl = 'https://mturk-api.istrack.in/multi-attrs.php?ids='+f;
    var toUrl2 = 'https://turkopticon.ucsd.edu/api/multi-attrs.php?ids='+f;
    var requestTO = new XMLHttpRequest();
    try{   // first try main TO server
        requestTO.onreadystatechange = function () {
            if ((requestTO.readyState ===4) && (requestTO.status ===200)) {
                if (requestTO.responseText.split(':').length > 2) {
                    var toInfo = requestTO.responseText.split('{')[3].split('}')[0].split(',');
                    for (var t = 0; t < 4; t++) {
                        var arrTo = toInfo[t].split(':');
                        toComp.push(arrTo[1].substring(1,4));
                    }
                } 
                else { toComp = ['-','-','-','-']; }
            }
        };
        requestTO.open('GET', toUrl2, false);
        requestTO.send(null);
        return toComp;
    }
    catch(err){   // if main TO server unavailable, try Miku's TO mirror server (istrack.in)
        try{
            requestTO.onreadystatechange = function () {
                if ((requestTO.readyState ===4) && (requestTO.status ===200)) {
                    if (requestTO.responseText.split(':').length > 2) {
                        var toInfo = requestTO.responseText.split('{')[3].split('}')[0].split(',');
                        for (var t = 0; t < 4; t++) {
                            var arrTo = toInfo[t].split(':');
                            toComp.push(arrTo[1].substring(1,4));
                        }
                    } 
                    else { toComp = ['-','-','-','-']; }
                }
            };
            requestTO.open('GET', toUrl, false);
            requestTO.send(null);
            return toComp;
        }
        catch(err){   // if both unavailable, return 'na's
            toComp = ['na','na','na','na'];
            return toComp;
        }
    }
}

function sleep(ms){  // from http://www.digimantra.com/tutorials/sleep-or-wait-function-in-javascript/
    var dt = new Date();
    dt.setTime(dt.getTime() + ms);
    while (new Date().getTime() < dt.getTime());
}

function ns4tBulkShorten(urlArr){
    console.log("ns4tBulkShorten function");
    var shortUrl;
    var shortUrlsSplit = [];
    var urlT = "https://ns4t.net/yourls-api.php?action=bulkshortener&title=MTurk&signature=39f6cf4959";
    for (var i = 0; i < urlArr.length; i++)
    {
        urlT += "&urls[]="+encodeURIComponent(urlArr[i]);
    }
    console.log(urlT);
    var requestNs4tBulk = new XMLHttpRequest();
    try{
        requestNs4tBulk.onreadystatechange = function () {
            if (requestNs4tBulk.readyState == 4) {
                if (requestNs4tBulk.status == 200) {
                    shortUrl = requestNs4tBulk.responseText;
                    console.log("ns4t.net Bulk response: " + requestNs4tBulk.status + " " + requestNs4tBulk.statusText + " " + requestNs4tBulk.responseText);
                }
                else {
                    console.log('ns4t.net Bulk unsuccessful: ' + requestNs4tBulk.status + " " + requestNs4tBulk.statusText);
                }
            }
        };
        requestNs4tBulk.open('GET', urlT, false);
        requestNs4tBulk.send(null);
        shortUrlsSplit = shortUrl.split(";");

        if ( urlArr.length == 4 )  // if preview/panda links were available
        {
            return {preview:shortUrlsSplit[0], panda:shortUrlsSplit[1], req:shortUrlsSplit[2], to:shortUrlsSplit[3]};
        }
        else if ( urlArr.length == 2 )  // if preview/panda links were unavailable due to being logged out
        {
            return {preview:"(url n/a)", panda:"(url n/a)", req:shortUrlsSplit[0], to:shortUrlsSplit[1]};
        }
        else  // no reason to not have either 4 or 2 links, but just in case...
        {
            return null;  // return null value to revert to one-by-one shortening
        }
    }
    catch(err){
        return shortUrl;  // return null value to revert to one-by-one shortening
    }
}
function ns4tShorten(url){  // mturk-only URL shortener on Tjololo's server ns4t.net
    console.log("ns4tShorten function");
    var shortUrl;
    var urlT = "https://ns4t.net/yourls-api.php" + "?action=shorturl&url=" + encodeURIComponent(url) + "&format=simple&title=MTurk&signature=39f6cf4959";
    var requestNs4t = new XMLHttpRequest();
    try{
        requestNs4t.onreadystatechange = function () {
            if (requestNs4t.readyState == 4) {
                if (requestNs4t.status == 200) {
                    shortUrl = requestNs4t.responseText;
                    console.log("ns4t.net response: " + requestNs4t.status + " " + requestNs4t.statusText + " " + requestNs4t.responseText);
                } 
                else {
                    console.log('ns4t.net unsuccessful: ' + requestNs4t.status + " " + requestNs4t.statusText);
                }
            }
        };
        requestNs4t.open('GET', urlT, false);
        requestNs4t.send(null);
        return shortUrl;
    }
    catch(err){
        return shortUrl;
    }
}
function tnyimShorten(url){  // Tny.im URL Shortener - http://tny.im/aboutapi.php - this is only possible this way because their server has the "Access-Control-Allow-Origin = *" headers enabled (the above TO mirror server does too)
    console.log("tnyimShorten function");
    var shortUrl;
    var urlT = "https://tny.im/yourls-api.php" + "?action=shorturl&url=" + encodeURIComponent(url) + "&format=simple&title=MTurk";
    var requestTnyim = new XMLHttpRequest();
    try{
        requestTnyim.onreadystatechange = function () {
            if (requestTnyim.readyState == 4) {
                if (requestTnyim.status == 200) {
                    shortUrl = requestTnyim.responseText;
                    console.log("tny.im response: " + requestTnyim.status + " " + requestTnyim.statusText + " " + requestTnyim.responseText);
                } 
                else {
                    console.log('tny.im unsuccessful: ' + requestTnyim.status + " " + requestTnyim.statusText);
                }
            }
        };
        requestTnyim.open('GET', urlT, false);
        requestTnyim.send(null);
        return shortUrl;
    }
    catch(err){
        return shortUrl;
    }    
}
function googlShorten(url){  // Goo.gl URL Shortener
    console.log("googlShorten function");
    var shortUrl;
    var urlG = "https://www.googleapis.com/urlshortener/v1/url";
    var requestGoogl = new XMLHttpRequest();
    try{
        requestGoogl.open("POST", urlG, false);
        requestGoogl.setRequestHeader("Content-Type", "application/json");
        requestGoogl.onreadystatechange = function() {
            if (requestGoogl.readyState == 4) {
                if (requestGoogl.status == 200) {
                    shortUrl = JSON.parse(requestGoogl.response).id;
                    console.log("goo.gl response: " + requestGoogl.status + " " + requestGoogl.statusText + " " + JSON.parse(requestGoogl.response).id );
                } 
                else {
                    console.log('goo.gl unsuccessful: ' + requestGoogl.status + " " + requestGoogl.statusText);
                }
            }
        };
        var data = new Object();
        data.longUrl = url;
        requestGoogl.send(JSON.stringify(data)); 
        return shortUrl;
    }
    catch(err){
        return shortUrl;
    }
}
function shortenUrl(url){
    sleep(500);  // milliseconds delay - wait some milliseconds (currently half a second) between shortens to reduce chance of hitting usage limits
    var shortUrl;
    shortUrl = ns4tShorten(url);
    if ( shortUrl === undefined ) {   // if you reached the ns4t.net URL shortener's temporary usage limits or the server is otherwise unavailable
        shortUrl = tnyimShorten(url);
        if ( shortUrl === undefined ) {   // if you reached the tny.im URL shortener's temporary limits or the server is otherwise unavailable
            shortUrl = googlShorten(url);
            if ( shortUrl === undefined ) {  // if you reached the Google URL shortener's temporary limits too or the server is otherwise unavailable
                shortUrl = "(x)";
            }
        }
    }
    return shortUrl;
}

// output display box
var ircexportdiv = document.createElement('div');
var ircexporttextarea = document.createElement('textarea');
ircexportdiv.style.position = 'fixed';
ircexportdiv.style.width = '500px';
ircexportdiv.style.height = '155px';
ircexportdiv.style.left = '50%';
ircexportdiv.style.right = '50%';
ircexportdiv.style.margin = '-250px 0px 0px -250px';
ircexportdiv.style.top = '300px';
ircexportdiv.style.padding = '5px';
ircexportdiv.style.border = '2px';
ircexportdiv.style.backgroundColor = 'black';
ircexportdiv.style.color = 'white';
ircexportdiv.style.zIndex = '100';
ircexportdiv.setAttribute('id','ircexport_div');
ircexportdiv.style.display = 'none';
ircexporttextarea.style.padding = '2px';
ircexporttextarea.style.width = '500px';
ircexporttextarea.style.height = '130px';
ircexporttextarea.title = 'Discord Export Output';
ircexporttextarea.setAttribute('id','ircexport_text');
ircexportdiv.textContent = 'Discord Export: Press Ctrl+C to (re-)copy to clipboard. Click text area to close.';
ircexportdiv.style.fontSize = '12px';
ircexportdiv.appendChild(ircexporttextarea);
document.body.insertBefore(ircexportdiv, document.body.firstChild);
ircexporttextarea.addEventListener("click", function(){ ircexportdiv.style.display = 'none'; }, false);


function display(e){
    var theButton = e.target;
    theButton.style.backgroundColor = "#CC0000";
    
    var capHand = document.getElementById('capsule' + theButton.getAttribute("place") + '-0');
    var tBodies = capHand.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    
    var thisReq = tBodies.getElementsByClassName('requesterIdentity')[0];
    var thisReqName = thisReq.textContent;
    var thisReqId = "unavailable";  // handle logged-out export requests now that requester ID links are unavailable as of 2015-07-20
    if ( accountStatus == "loggedIn" )
    {
        thisReqId = getUrlVariable(thisReq.parentNode.href, "requesterId");
    }
    
    var thisTitle = capHand.textContent.trim();
    thisTitle = thisTitle.replace(/<(\w+)[^>]*>.*<\/\1>/gi, "").trim();  // addition to strip html tags and their contents, appearing inside the title link (re 10-20-2014 appearance of "<span class="tags"></span>")

    var thisHitGroup = "unavailable";  // handle logged-out export requests for HITs with no preview/notqualified links
    // if hit has a preview or notqualified link
    var thisHitLink = capHand.parentNode.parentNode.getElementsByClassName('capsulelink')[1].firstChild.nextSibling;
    if ( thisHitLink.href !== '' )  
    {
        // if this is a preview link
        if ( thisHitLink.href.indexOf('preview') > -1 )
        {
            thisHitGroup = getUrlVariable(thisHitLink.href, "groupId");
        }
        // if this is a notqualified link
        else if ( thisHitLink.href.indexOf('notqualified') > -1 )
        {
            thisHitGroup = getUrlVariable(thisHitLink.href, "hitId");
            // Amazon messed up the notqualified links, now looking like https://www.mturk.com/mturk/notqualified?hitGroupId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX&hitId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX ; and then they flipped the order of these values on 6/2/15
        }
        // if this is a requestqualification link we shouldn't be on, but are anyway because of stuff Amazon screwed with on 6/2/15
        else if ( thisHitLink.href.indexOf('requestqualification') > -1 )
        {
            // go to the next link, the "(why?)" notqualified link instead
            thisHitGroup = getUrlVariable(thisHitLink.nextElementSibling.href, "hitId");
            // Amazon messed up the notqualified links, now looking like https://www.mturk.com/mturk/notqualified?hitGroupId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX&hitId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX ; and then they flipped the order of these values on 6/2/15
        }
    }
    
    var thisReward = tBodies.getElementsByClassName('reward')[0].textContent.trim();

    var thisTimeLimit = tBodies.getElementsByClassName('capsule_field_text')[2].textContent.trim();
    
    var thisHitsAvail = "??";  // handle Amazon removing HITs Available data from logged-out view 2015-07-20
    if ( accountStatus == "loggedIn" ) 
    { 
        thisHitsAvail = tBodies.getElementsByClassName('capsule_field_text')[4].textContent.trim(); 
    }

    var thisQualTable = document.getElementById('capsule'+theButton.getAttribute("place")+'target').getElementsByTagName('tbody')[2];
    if ( document.location.href.indexOf('?last_hits_previewed') > -1 )  // for compatibility with mmmturkeybacon Last Hits Previewed
    { 
        thisQualTable = document.getElementById('capsule'+theButton.getAttribute("place")+'target').getElementsByTagName('tbody')[1]; 
    }
    var thisQualRows = thisQualTable.getElementsByTagName('td');
    var qualStart = 3;  // standard starting row
    if ( accountStatus == "loggedOut" )  // handle logged-out export requests - difference in qual table coding
    { 
        qualStart = 1; 
    }  
    if ( document.location.href.indexOf('?last_hits_previewed') > -1 )  // for compatibility with mmmturkeybacon Last Hits Previewed
    { 
        qualStart = 2; 
    }
    var masterQual = '';
    for ( var m = qualStart; m < thisQualRows.length; m++ ) 
    {
        if ( thisQualRows[m].textContent.indexOf('Masters') > -1 ) 
        {
            masterQual = 'MASTERS • ';
        }
    }
    
    var urlsToShorten = [];
    
    var thisPreviewUrl = "(url n/a)";
    var thisPandaUrl = "(url n/a)";
    if ( thisHitGroup != "unavailable" )  // handle logged-out export requests for HITs with no preview/notqualified links - fallback to default "(url n/a)" text
    {
        //thisPreviewUrl = shortenUrl('https://www.mturk.com/mturk/preview?groupId=' + thisHitGroup);
        urlsToShorten.push('https://www.mturk.com/mturk/preview?groupId=' + thisHitGroup);
        //thisPandaUrl = shortenUrl('https://www.mturk.com/mturk/previewandaccept?groupId=' + thisHitGroup);
        urlsToShorten.push('https://www.mturk.com/mturk/previewandaccept?groupId=' + thisHitGroup);
    }
    
    var thisReqUrl = "(url n/a)";
    if ( thisReqId != "unavailable" )
    {
        //thisReqUrl = shortenUrl('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + thisReqId);
        urlsToShorten.push('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + thisReqId);
    }
    else if ( thisReqId == "unavailable" )  // handle 2015-07-20 loss of logged-out requester ids - fallback to search by name
    {
        //thisReqUrl = shortenUrl('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=' + thisReqName.replace(/ /g, "+") ) + " (search)";
        urlsToShorten.push('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=' + thisReqName.replace(/ /g, "+") );
    }

    var thisTOUrl = "(url n/a)";
    var thisTOStats = "??";
    if ( thisReqId != "unavailable" )
    {
        //thisTOUrl = shortenUrl('http://turkopticon.ucsd.edu/' + thisReqId);
        urlsToShorten.push('http://turkopticon.ucsd.edu/' + thisReqId);
        thisTOStats = getTO(thisReqId);
    }
    else if ( thisReqId == "unavailable" )  // handle 2015-07-20 loss of logged-out requester ids - fallback to search by name
    {
        //thisTOUrl = shortenUrl('https://turkopticon.ucsd.edu/main/php_search?query=' + thisReqName.replace(/ /g, "+") ) + " (search)";
        urlsToShorten.push('https://turkopticon.ucsd.edu/main/php_search?query=' + thisReqName.replace(/ /g, "+"));
    }
    
    var shortUrlsBulkResults = ns4tBulkShorten(urlsToShorten);
    console.log(shortUrlsBulkResults);
    if (shortUrlsBulkResults)  // if bulk shorten via ns4t.net is successful
    {
        thisPreviewUrl = shortUrlsBulkResults["preview"];
        thisPandaUrl = shortUrlsBulkResults["panda"];
        thisReqUrl = shortUrlsBulkResults["req"];
        thisTOUrl = shortUrlsBulkResults["to"];
        if ( thisReqId == "unavailable" )
        {
            thisTOUrl += " (search)";
            thisReqUrl += " (search)";
        }
    }
    else  // if bulk shorten is unsuccessful, revert to original shortening functions
    {
        if ( thisHitGroup != "unavailable" )  // handle logged-out export requests for HITs with no preview/notqualified links - fallback to default "(url n/a)" text
        {
            thisPreviewUrl = shortenUrl('https://www.mturk.com/mturk/preview?groupId=' + thisHitGroup);
            thisPandaUrl = shortenUrl('https://www.mturk.com/mturk/previewandaccept?groupId=' + thisHitGroup);
        }
        
        if ( thisReqId != "unavailable" )
        {
            thisReqUrl = shortenUrl('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + thisReqId);
            thisTOUrl = shortenUrl('http://turkopticon.ucsd.edu/' + thisReqId);
        }
        else if ( thisReqId == "unavailable" )  // handle 2015-07-20 loss of logged-out requester ids - fallback to search by name
        {
            thisReqUrl = shortenUrl('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=' + thisReqName.replace(/ /g, "+") ) + " (search)";
            thisTOUrl = shortenUrl('https://turkopticon.ucsd.edu/main/php_search?query=' + thisReqName.replace(/ /g, "+") ) + " (search)";
        }
    }
    
    // when the URL shortener service is unavailable but the preview link is available, add the full-length preview link at the end
    var shortUrlUnav = '';
    if ( (thisPreviewUrl == "(x)") && (thisHitGroup != "unavailable") ) 
    { 
        shortUrlUnav = " \r\n^ https://www.mturk.com/mturk/preview?groupId=" + thisHitGroup; 
    }
    
    var exportOutput = "";
    var loggedOutApology = " (Info missing since logged out.)";
    if ( accountStatus == "loggedIn" )
    {
        exportOutput = '@hits ' + ' \n• ' + masterQual + 'Requester: ' + thisReqName + ' ' + thisReqUrl + ' \n• ' + 'HIT: ' + thisTitle + ' ' + thisPreviewUrl + ' \n• ' + 'Pay: ' + thisReward + ' • ' + 'Avail: ' + thisHitsAvail + ' • ' + 'Limit: ' + thisTimeLimit + ' \n• ' + 'TO: ' + 'Pay='+thisTOStats[1] + ' Fair='+thisTOStats[2] + ' Comm='+thisTOStats[0] + ' ' + thisTOUrl + ' \n• ' + 'PandA: ' + thisPandaUrl + shortUrlUnav ;
    }
    else if ( accountStatus == "loggedOut" )
    {
        exportOutput = '@hits ' + ' \n• ' + masterQual + 'Requester: ' + thisReqName + ' ' + thisReqUrl + ' \n• ' + 'HIT: ' + thisTitle + ' ' + thisPreviewUrl + ' \n• ' + 'Pay: ' + thisReward + ' • ' + 'Avail: ' + thisHitsAvail + ' • ' + 'Limit: ' + thisTimeLimit + ' \n• ' + 'TO: ?? ' + thisTOUrl + ' \n• ' + 'PandA: ' + thisPandaUrl + loggedOutApology + shortUrlUnav ;
    }
    
    if (GM_setClipboard) { GM_setClipboard(exportOutput); }
    window.setTimeout(function(){ theButton.style.backgroundColor = 'transparent'; }, 500);
    ircexporttextarea.textContent = exportOutput;
    ircexportdiv.style.display = 'block';
    ircexporttextarea.select();
}
