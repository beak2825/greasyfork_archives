// ==UserScript==
// @name       jawz Hybrid - Check an Email
// @version    1.9
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @match      https://www.google.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10556/jawz%20Hybrid%20-%20Check%20an%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/10556/jawz%20Hybrid%20-%20Check%20an%20Email.meta.js
// ==/UserScript==

if(document.URL.indexOf("http://www.gethybrid.io") >= 0) { 
    var links = document.links;
    bizUrl = links[0];

    var bizName = $("p:contains('Business name and email:')").eq(0).text().trim().replace('Business name and email:', '');

    var nth = 0;
    bizName = bizName.replace(/\n/g, function (match, i, original) {
        nth++;
        return (nth === 2) ? ' "' : match;
    });

    //var searchUrl = "http://www.google.com/search?q=" + bizName + '"';
    //searchUrl = searchUrl.replace("&", "%26").replace(/[ ]/g, "+").replace('#', '');
    var searchUrl = $('a').eq(9).text();
    //searchUrl = "http://www.google.com/search?q=" + searchUrl;
    //    searchUrl = searchUrl.replace("&", "%26").replace(/[ ]/g, "+").replace('#', '');
    
    var test = searchUrl.match(/\w+@\w+/g);
    var place = searchUrl.indexOf(test);
    
    var p1 = searchUrl.slice(0,place);
    var p2 = searchUrl.slice(place);
    
    p1 = $('div[class="item-response order-2"]').find('p').eq(4).text();
    searchUrl = "http://www.google.com/search?q=" + p1 + '"' + p2 + '"';
    searchUrl = searchUrl.replace("&", "%26").replace(/[ ]/g, "+").replace('#', '');
    
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    window.addEventListener("message", function(e) { hitPageListener(e) ;}, false);
    popupX = window.open(searchUrl, 'remote1', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    window.onbeforeunload = function (e) { popupX.close(); }
}

if (document.URL.indexOf("www.google.com") >= 0) { 
	var plinks = [];
    var rlinks = [];
    var bplace = [];
    var glinks = document.getElementsByClassName("r");
    
    for (i=0;i<glinks.length;i++) {
        if (i==0) {
            //plinks[i] = glinks[i].getElementsByTagName("a")[0];
            plinks[i] = document.getElementById("resultStats")
    	    var btn1 = document.createElement("BUTTON");
    	    btn1.innerHTML = "No";
		    btn1.type = "button";
    	    (function(i){ btn1.onclick = function() { sendMessage("NA"); } })(i);
    	    //plinks[i].parentNode.insertBefore(btn1,plinks[i])
            plinks[i].appendChild(btn1)
            
            var btn1 = document.createElement("BUTTON");
    	    btn1.innerHTML = "Search w/o Name";
		    btn1.type = "button";
    	    (function(i){ btn1.onclick = function() { 
                var search = $('#lst-ib').val();
                if (search.charAt(0) == '"' )
                    sendMessage("NA");
                else {
                    search = search.split('"')[1];
                    search = '"' + search;
                    var searchUrl = "http://www.google.com/search?q=" + search + '"';
                    window.location.href = searchUrl;
                }
            } })(i);
    	    //plinks[i].parentNode.insertBefore(btn1,plinks[i])
            plinks[i].appendChild(btn1)
        }
            
        rlinks[i] = glinks[i].getElementsByTagName("a")[0];
    	var btn = document.createElement("BUTTON");
    	btn.innerHTML = "Submit";
		btn.type = "button";
    	(function(i){ btn.onclick = function() { sendMessage(rlinks[i].href); } })(i);
    	rlinks[i].parentNode.insertBefore(btn,rlinks[i])
    }
    
    
    if ($('p:contains("did not match any documents")').text().length) { // || $('div:contains("No results found for")').text().length) {
        var search = $('#lst-ib').val();
        
        if (search.charAt(0) == '"' )
                    sendMessage("NA");
        search = search.split('"')[1];
        search = '"' + search;
        var searchUrl = "http://www.google.com/search?q=" + search + '"';
        window.location.href = searchUrl;
    }
    //if ($('div:contains("No results found for")').text().length)
    //   sendMessage("NA");
}

function sendMessage(msg) {
    window.opener.postMessage(msg, '*');
    //window.close();
}

function hitPageListener(e) {
    var form = document.getElementsByName("commit");
    if (e.data !== 'NA') {
        $( "textarea[name='item_responses[4][text]']" ).val(e.data);
        $( "input[name='item_responses[3][item_option_responses][item_option_id]']" ).eq(0).prop( "checked", true );
        form[0].click();
    } else {
        $( "input[name='item_responses[3][item_option_responses][item_option_id]']" ).eq(1).prop( "checked", true );
        form[0].click();
    }
    //$('input[name=Answer_1_FreeText]').val(e.data);
    //form[0].click();
}