// ==UserScript==
// @name         Continuum Usability
// @namespace    https://manmademagic.com
// @version      0.3
// @author       manmademagic
// @description  Make Continuum a little bit nicer to use
// @icon         https://static.manmademagic.com/img/favicons/favicon-32x32.png
// @run-at       document-end
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        https://control.itsupport247.net/*
// @match        https://*.logmein.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/40243/Continuum%20Usability.user.js
// @updateURL https://update.greasyfork.org/scripts/40243/Continuum%20Usability.meta.js
// ==/UserScript==


var pathname = window.location.pathname;
var host = window.location.host;

localStorage.previousPath = localStorage.currentPath;
localStorage.currentPath = window.location.pathname;
localStorage.previousHost = localStorage.currentHost;
localStorage.currentHost = window.location.host;

// No longer need this as we're opening in a new tab now
//resizePopup(host,pathname); //Run this before the document is ready

$(document).ready(
    function () {
        if (pathname.startsWith("/QADashB/QuickAccess"))
            qaDashboard();
        if (pathname.startsWith("/ui_fe/SvrMon_EditOIDRule_ui.asp"))
            fixContinuumOIDEditor();
      if (pathname.startsWith("/ui_fe/SvrMon_AddOIDRule_ui.asp"))
            fixContinuumOIDEditor();
        if (host.endsWith("logmein.com"))
        {
            logMeInHandler(pathname);
        }
    }

);

function logMeInHandler(pathname)
{
    if (pathname.startsWith("/menu.html"))
    {
        waitForElement("#RA-tree-object-4-anchor",function(){
            $("#RA-tree-object-4-anchor").click();
        });
    }

}


// Fixes the 'select' element not having all of the correct options
function fixContinuumOIDEditor()
{
  waitForElement("#CboWOperator1",function(){
    var warningGreaterThan = document.createElement("option")
    var warningSelector = document.getElementById("CboWOperator1").add(warningGreaterThan)
    warningGreaterThan.innerText = "greater than"
    warningGreaterThan.value = ">"
    
    var errorGreaterThan = document.createElement("option")
    var errorSelector = document.getElementById("CboEOperator1").add(errorGreaterThan)
    errorGreaterThan.innerText = "greater than"
    errorGreaterThan.value = ">"
  });


}

// Wrapper function to call when viewing the quick access dashboard
function qaDashboard()
{
    locationSwitcher();

    // The table doesn't load immediately, so we have a handler function to wait until it's rendered
    waitForElement("a[onclick^='OpenLogMeInDesktop']",actualAvailability);

    // Make sure table exists before we update the hrefs
    waitForElement("td.tdFullBoxLink",updateLMIhrefs);
}

// Function to change the style of the logmein icons when computers are/aren't available
function actualAvailability ()
{
    var disabledStyle="filter:grayscale() brightness(1.5);cursor:default";
    var disabledRows = $("td:nth-of-type(9) .fa.fa-circle.red").parent().parent().parent();
    for (var i = 0; i < disabledRows.length; i++)
    {
        aElement = disabledRows[i].children[1].children[0]; // get the link element
        aElement.style=disabledStyle;
        if (aElement.children.length > 0)
        {aElement.children[0].title = "Computer Not Available";} // Change the title of the img}
        $(aElement).attr("onclick",null); // remove the onclick handler
    }
}

// Function to add a button to switch between servers and desktops
function locationSwitcher() {
    var currentLocation = ($(".divTopLabelDdl>h1")[0].innerHTML); // Get location from h1 element
    var siteID = $("#siteId").val(); // Get the current site ID
    var linkUrl = "", linkText = "", linkIcon = "";

    if (currentLocation === "Servers ")
    {
        linkText = "Desktops";
        linkUrl = "Desktops?siteId="+encodeURIComponent(siteID);
        linkIcon = '<i class="fa fa-desktop"></i>';
    }
    else
    {
        linkText = "Servers";
        linkUrl = "QuickAcessServerDetails?siteId="+encodeURIComponent(siteID);
        linkIcon = '<i class="fa fa-tasks"></i>';
    }

    var linkHTML = '<a id="locationButton" class="btn btn-default btn-custom" href="'+linkUrl+'">'+linkText+linkIcon+'</a>';
    $(".divTopLabelDdl>div.divBtnActionGroup").prepend(linkHTML);
}

// Recursive function that will check to see if an element is available every 100ms
function waitForElement(selector, callback)
{
    if (jQuery(selector).length)
    {
        callback();
    }
    else
    {
        setTimeout(function()
                   {
            waitForElement(selector,callback);
        },100
                  );
    }
}

// No longer need this as we're opening in a new tab now
// Resize the window for logmein popups
/*
function resizePopup(host,pathname)
{
    if (
        pathname.startsWith("/dotnetRelogin.asp") ||
        pathname.startsWith("/LMIAPI/ITSLmiApicAuto.asp")||
        (host.endsWith("logmein.com") && pathname.startsWith("/main.html"))
    )
    {
        window.resizeTo(10,10);
    }
}
*/

function updateLMIhrefs() {
    var parents = $("td.tdFullBoxLink");
    for (var i = 0; i < parents.length; i++)
    {
        // Check the current location to get the correct resource type
        var resType = "D";
        if (window.location.pathname.endsWith("QuickAcessServerDetails"))
        {
            resType = "S";
        }

        // Extract the regID from one of the sibling elements (saves having to do any costly XHR calls)
        var onclickVal = $(parents[i].previousSibling.children[0]).attr("onclick");
        var regID = onclickVal.match(/.*?,"(.*?)"/)[1];
        var lmihref = "https://control.itsupport247.net/QaDashB/Redirect?pageType=logMeIn&regId="+regID+"&resourceType="+resType+"&resData=1";
        parents[i].children[0].href = lmihref; // Update the link
        parents[i].children[0].onclick = null; // Clear the javascript
        parents[i].children[0].target = "_blank"; // Make sure we open in a new tab
    }
}