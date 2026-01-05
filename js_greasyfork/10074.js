// ==UserScript==
// @name         Show48 Local Watched Indicator
// @namespace    http://sk3dsu-phantasy.com/
// @version      0.10
// @description  Add Watched indicator to show48.com
// @author       sk3dsu (Fadli)
// @match        *://*.show48.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @grant        GM_getValue 
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/10074/Show48%20Local%20Watched%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/10074/Show48%20Local%20Watched%20Indicator.meta.js
// ==/UserScript==

function GM_main ($) {
    
    // Video Page itself
    if( $('#video-toolbar').length )
    {      
        // Area below the video  
        if ($(".video-toolbar-inner")[0])
        {
            var urlPath  = window.location.pathname;
            urlPath = urlPath.slice(1);
            urlPath = urlPath.slice(0, -1);
            
            var theValue = GM_getValue(urlPath, 0);

            var newDiv = document.createElement("div"); 
            newDiv.className = "video-toolbar-item";
            
            var spanItem = createPawWatchSpanElement(false);
            spanItem.urlPath = urlPath;
            spanItem.addEventListener('click', pawClickEventListener, false);
            
            if (theValue)
            {
                spanItem.style.color = "green";
            }
            
            newDiv.appendChild(spanItem);
            
            var parentDiv = document.getElementsByClassName("video-toolbar-inner")[0]; 
            parentDiv.insertBefore(newDiv, parentDiv.childNodes[3]);

        }

        // Side Bar Latest Video Area
        if ($('#advanced_popular_videos-5').length)
        { 
            var videoItems = $('#advanced_popular_videos-5 .item-info');
            
            for (i = 0; i < videoItems.length; i++)
            {

                var videoItem = videoItems[i];
             
                var itemHref = videoItem.childNodes[1].childNodes[1].childNodes[1];
                
                var urlPath = getUrlPath(itemHref);
                var theValue = GM_getValue(urlPath, 0);
                
                var spanItem = createPawWatchSpanElement(false);
                
                if (theValue)
                {
                    spanItem.style.color="green";
                }
                
                videoItem.childNodes[1].insertBefore(spanItem, videoItem.childNodes[1].childNodes[2]);
                
            }
            
        }
        
        // Related side-bar in Video Page
        if ($('#text-8').length)
        {
            
            var liItems = $('#text-8 li');
            
            for (i = 0; i < liItems.length; i++)
            {
                var itemHref = liItems[i].childNodes[0];
                
                var urlPath = getUrlPath(itemHref);
                var theValue = GM_getValue(urlPath, 0);
                
                var spanItem = createPawWatchSpanElement(true);
                spanItem.style.fontSize = "100%";
                spanItem.style.color = "grey";
                spanItem.style.width = "20px";
                
                if (theValue)
                {
                    spanItem.style.color="green";
                }
                
                liItems[i].insertBefore(spanItem, liItems[i].childNodes[0]);
            }
        }
        
    }
    // Direct access to video-item
    else if ($('.video-item').length)
    {
        for (i = 0; i < $('.video-item').length; i++)
        {
            var videoItem = $('.video-item')[i];

            var itemHeads = videoItem.getElementsByClassName("item-head");

                for (j = 0; j < itemHeads.length; j++)
                {   
                    var itemHref = itemHeads[j].childNodes[1].childNodes[0];  
                    

                    // Span Item without click listener
                    var spanItem = createPawWatchSpanElement(true);
                    spanItem.style.fontSize = "100%";
                    spanItem.style.color = "grey";
                    spanItem.style.width = "20px";
                    spanItem.urlPath = getUrlPath(itemHref);

                    var theValue = GM_getValue(spanItem.urlPath, 0);

                    if (theValue)
                    {
                        spanItem.style.color="green";
                    }

                    itemHeads[j].childNodes[1].insertBefore(spanItem, itemHeads[j].childNodes[1].childNodes[0]);
                }
        }
        
    }
    // Any Page with video-listing and thumbnail e.g. show, drama
    else if ($('.video-listing').length)
    {                 
        var itemHeads = $(".item-head"); 

        for (i = 0; i < itemHeads.length; i++)
        {
            var itemHref = itemHeads[i].childNodes[0].childNodes[0];     
            
            var spanItem = createPawWatchSpanElement(true);
            spanItem.style.fontSize = "100%";
            spanItem.style.color = "grey";
            spanItem.style.width = "20px";
            spanItem.urlPath = getUrlPath(itemHref);
            spanItem.addEventListener('click', pawClickEventListener, false);

            var theValue = GM_getValue(spanItem.urlPath, 0);

            if (theValue)
            {
                spanItem.style.color="green";
            }
            
            itemHeads[i].childNodes[0].insertBefore(spanItem, itemHeads[i].childNodes[0].childNodes[0]);
        }
    }
    // Pages with table
    else if ($('.tablepress').length)
    { 
        var table = $('.tablepress')[0];
        
        var totalCell = table.rows[0].cells.length;
        var lastColumn= table.rows[0].cells[totalCell - 1];
        
        // Only interested when header has 'Stream' column
        if (lastColumn.innerHTML == "Stream")
        {     
            var tblHead = table.tHead;
            var tblBody = table.tBodies[0];
            
            // Add new column to Table Header
            var newTh = document.createElement('th');
            newTh.className = "column-4 sorting_disabled";
            newTh.innerHTML = "Watched";
            tblHead.rows[0].appendChild(newTh);
            
            for (var i = 0; i < tblBody.rows.length; i++) 
            {   
                var newCell = tblBody.rows[i].insertCell(-1);
                var spanItem = createPawWatchSpanElement(true);
                spanItem.style.fontSize = "150%";
                spanItem.style.color="grey";
                
                
                lastColumn = tblBody.rows[i].cells[totalCell-1].childNodes[0];
                
                if (typeof lastColumn === 'object')
                {    
                    // last column has a link object?
                    if (lastColumn.tagName == 'A')
                    {
                        var itemHref = tblBody.rows[i].cells[totalCell-1].childNodes[0];
                        spanItem.urlPath = getUrlPath(itemHref);
                        spanItem.addEventListener('click', pawClickEventListener, false);
                        
                        var theValue = GM_getValue(spanItem.urlPath, 0);
                        
                        if (theValue) 
                        {
                            spanItem.style.color="green";
                        }

                    }
                }

                newCell.appendChild(spanItem);
                
            }
        }
        
    }
    // Pages with column-inner
    else if ($('.column-inner ').length)
    {        
        var columns = $(".column-inner"); 

        for (i = 0; i < columns.length; i++)
        {
            var itemHref = columns[i].childNodes[0];
            
            var spanItem = createPawWatchSpanElement(true);
            spanItem.style.fontSize = "100%";
            spanItem.style.color = "grey";
            spanItem.style.width = "20px";
            spanItem.urlPath = getUrlPath(itemHref);
            spanItem.addEventListener('click', pawClickEventListener, false);

            var theValue = GM_getValue(spanItem.urlPath, 0);

            if (theValue)
            {
                spanItem.style.color="green";
            }
            
            columns[i].insertBefore(spanItem, columns[i].childNodes[0]);
        }
    }
            
}

function createPawWatchSpanElement(iconOnly) {
    
    var span = document.createElement("span");
    span.id = "pawWatch";
    span.className = "fa fa-paw";
    span.style.opacity = "0.6";
    
    if (iconOnly)
    {
        span.style.color = "green";
        span.style.fontSize = "200%";
    }
    else
    {
        span.style.color = "grey";
        span.style.fontSize = "100%";
        span.innerHTML = " Watched";
    }
    
    return span;
}

function getUrlPath(itemHref) {
    var withoutProtocol = itemHref.href.slice(7);
    var urlExplode = withoutProtocol.split("/");
    var urlPath = urlExplode[1];
    
    return urlPath;
}

function pawClickEventListener(evt) {
    
    var theValue = GM_getValue(evt.target.urlPath, 0);
    
    if (theValue)
    {
        evt.target.style.color = "grey";
        GM_deleteValue(evt.target.urlPath);
    }
    else
    {
        evt.target.style.color = "green";
        GM_setValue(evt.target.urlPath, 1);
    }
}

if (typeof jQuery === "function") {
    console.log ("Running with local copy of jQuery!");
    GM_main (jQuery);
}
else {
    console.log ("fetching jQuery from some 3rd-party server.");
    add_jQuery (GM_main, "1.11.2");
}

function add_jQuery (callbackFn, jqVersion) {
    var jqVersion   = jqVersion || "1.11.2";
    var D           = document;
    var targ        = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    var scriptNode  = D.createElement ('script');
    scriptNode.src  = 'http://ajax.googleapis.com/ajax/libs/jquery/'
                    + jqVersion
                    + '/jquery.min.js'
                    ;
    scriptNode.addEventListener ("load", function () {
        var scriptNode          = D.createElement ("script");
        scriptNode.textContent  =
            'var gm_jQuery  = jQuery.noConflict (true);\n'
            + '(' + callbackFn.toString () + ')(gm_jQuery);'
        ;
        targ.appendChild (scriptNode);
    }, false);
    targ.appendChild (scriptNode);
}
