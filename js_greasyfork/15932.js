// ==UserScript==
// @name         Hide Irrelevant Videos
// @description  Removes other languages so the view is more clean
// @namespace    http://theanykey.se
// @include      https://www.jw.org/apps*
// @include      *jw.org/apps*
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/15932/Hide%20Irrelevant%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/15932/Hide%20Irrelevant%20Videos.meta.js
// ==/UserScript==

// Setup
ShowVideosInLanguage="Svenska"

// Check for Play buttons and remove them
var p = document.getElementsByClassName('aVideoURL');
//var cstr = "container-fluid-header";
for (var i=p.length; --i>=0;) 
{
    var n = p[i];
    //while(n.className.split(" ").indexOf(cstr)==-1) {
    //    n = n.parentNode;
    //}
    if (n)
    {
    	n.parentNode.removeChild(n);
    }
}

// Check for Text buttons and remove them (except swedish)
var p = document.getElementsByClassName('linkDnld');
var cstr = ShowVideosInLanguage;
for (var i=p.length; --i>=0;) 
{
    var n = p[i];
    if (n.innerHTML.indexOf(cstr)==-1) {
        if (n)
        {
            n.parentNode.removeChild(n);
        }      
    }
    else
    {
        if (n)
        {
            //n.setAttribute("download","MyFile.mp4");
        }
    }
}

// Remove for BR
var p = document.getElementsByTagName('BR');
for (var i=p.length; --i>=0;) 
{
    var n = p[i];
    if (n)
    {
        n.parentNode.removeChild(n);
    }      
}

// Remove long lines in <p>
var p = document.getElementsByTagName('P');
var cstr = "-----------------------------------------------------";
for (var i=p.length; --i>=0;) 
{
    var n = p[i];
    if (n.innerHTML.indexOf(cstr)!=-1) {
        if (n)
        {
            n.parentNode.removeChild(n);
        }      
    }
}

// Remove dead links
var p = document.getElementsByClassName('deadlinks');
//var cstr = "container-fluid-header";
for (var i=p.length; --i>=0;) 
{
    var n = p[i];
    //while(n.className.split(" ").indexOf(cstr)==-1) {
    //    n = n.parentNode;
    //}
    if (n)
    {
    	n.parentNode.removeChild(n);
    }
}