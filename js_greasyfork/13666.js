// ==UserScript==
// @name        Warpnet Namer
// @namespace   bitbucket.org/Odahviing
// @include     http://www.war-facts.com/warpnet.php
// @description Auto name warpnets and submit to rally points manager
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13666/Warpnet%20Namer.user.js
// @updateURL https://update.greasyfork.org/scripts/13666/Warpnet%20Namer.meta.js
// ==/UserScript==

// Version history:
// 1.0	initial version - Update and Submit

function make_textbox() {
    var row1 = document.createElement('div');
    row1.setAttribute('class', 'padding5 highlight box fullwidth');
    row1.innerHTML = "\
      <div class='light padding5 width50 box left'>\
      <span>Name:&nbsp;</span><br />\
      <input class='darkinput' type='text' maxlength='150' size='35' id='warname' value='' />&nbsp;\
      <button id ='thebutton1'' class='darkbutton' type='button'>Update</button>\
      <button id ='thebutton2'' class='darkbutton' type='button'>Submit</button>\
      <br/>";
    return row1;
}

function prepareText()
{
    var text = document.getElementById("warname").value;
    if (text.length == 0)
    {
        alert("Need Name");
        return null;
    }
  
    return text.replace(" ", "%20");
}

function getAllLinks()
{
    var maintable = document.getElementsByTagName("table");
    return maintable[0].getElementsByTagName("a");
}

function update(){
    var newText = prepareText();
    if (newText == null) return;
  
    var links = getAllLinks();
    for (var i=0 ; i < links.length ; i++) 
    { 
        links[i].href = links[i].href.replace("WarpNet%20Jump",newText);
    }
}

function sendPost(params)
{
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", "rally_points.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);   
}

function submit(){
    var newText = prepareText();
    if (newText == null) return;
    var links = getAllLinks();
    for (var i=0 ; i < links.length ; i++)
    { 
        var link = links[i].href;
        var params = link.substring(link.indexOf("?") + 1);
        params = "add=Add&" + params.replace("WarpNet%20Jump",newText);
        sendPost(params);
    }   
}

function main()
{
  // Make sure I'm on second Warpnet page
  var test = document.getElementById("raw_text");
  if (test != null) return;
  
  // Add line and make event
  var maintable = document.getElementsByTagName("table");
  maintable[0].insertBefore(make_textbox(), maintable[0].childNodes[0]);
  var elmLink = document.getElementById('thebutton1');
  elmLink.addEventListener("click", update, true);
  var elmLink2 = document.getElementById('thebutton2');
  elmLink2.addEventListener("click", submit, true);  
}

main()

