// ==UserScript==
// @name         link fetch
// @namespace    http://your.homepage/
// @version      1.1
// @description  enter something useful
// @author       You
// @match        http://thewatchseries.to/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12069/link%20fetch.user.js
// @updateURL https://update.greasyfork.org/scripts/12069/link%20fetch.meta.js
// ==/UserScript==

/*if (window.location.href.indexOf("serie") > -1) {
    var lepisode = document.getElementsByClassName("listings show-listings")[0].children[0].children[2];
    window.location.assign(lepisode.href);
}*/

var offset = window.location.href.indexOf("serie");
if(window.location.href.indexOf("serie", offset)){
   // This means string occours more than one time
    if (document.getElementsByClassName("listings show-listings")[0]) {
    var lepisode = document.getElementsByClassName("listings show-listings")[0].children[0].children[2];
    window.location.assign(lepisode.href);
    }
}

if (window.location.href.indexOf("episode") > -1) {
    /*setInterval(function(){
        alert("");
    }, 5000); */
    
    /*var x = 0;
    var x1 = 0;
    setInterval(function(){
        if (document.getElementsByTagName("a")[x].title == "vodlocker.com") {
            if (x1 < 3) {
            x1 = x1 + 1;    
            window.open(document.getElementsByTagName("a")[x].href);
            }
            x = x + 1;
        } else {
            x = x + 1;
        }
    }, 20);*/
    
    var y = 0;
    var y1 = 0;
    setInterval(function(){
        if (document.getElementsByTagName("a")[y].title == "gorillavid.in") {
            if (y1 < 3) {
            y1 = y1 + 1;   
            window.location.assign(document.getElementsByTagName("a")[y].href);
            }
            //y = y + 1; open one url only! (unlike previous design)
        } else {
            y = y + 1;
        }
    }, 20); 
}

if (window.location.href.indexOf("cale") > -1) {
    var x = 0;
    //setInterval(function(){
        //if (document.getElementsByTagName("a")[x].class == "push_button blue") {   
            var be = document.getElementsByClassName("push_button blue")[0].href;
    
            var e = document.body;
            e.parentNode.removeChild(e);
            
            var body = document.createElement('body');
                document.getElementsByTagName('html')[0].appendChild(body);
    
            var center = document.createElement('center');
                document.getElementsByTagName('body')[0].appendChild(center);
    
            var div = document.createElement('div');
                div.id = "selectme";
                document.getElementsByTagName('center')[0].appendChild(div);
            
            var label1 = document.createElement('h1')
                //labe1l.htmlFor = "chk1";
            label1.id = "curl"
                label1.appendChild(document.createTextNode("youtube-dl -v " + be));
                document.getElementsByTagName('div')[0].appendChild(label1);

            SelectText('selectme'); 
    //x = x + 1;
        //} else {
           // x = x + 1;
        //}
    //}, 1);
    
    function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
    
    setTimeout(function() {
        window.close();
    }, 12000);
    
 /*   var cbtn = document.createElement("button");
    cbtn.id = "copy-button";
    cbtn.data-clipboard-target= "textholder";
    document.getElementsByTagName('body')[0].appendChild(cbtn);
    
    var client = new ZeroClipboard( document.getElementById("copy-button") );

client.on( "ready", function( readyEvent ) {
  // alert( "ZeroClipboard SWF is ready!" );

  client.on( "aftercopy", function( event ) {
    // `this` === `client`
    // `event.target` === the element that was clicked
    event.target.style.display = "none";
    alert("Copied text to clipboard: " + event.data["text/plain"] );
  } );
} );*/
    
    
}