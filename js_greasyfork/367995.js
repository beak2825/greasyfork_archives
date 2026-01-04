// ==UserScript==
// @name     Youtube2mp3
// @version  1.0.0
// @namespace https://greasyfork.org/
// @author Aisu
// @description This script helps to add a YouTube download button.
// @match *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/367995/Youtube2mp3.user.js
// @updateURL https://update.greasyfork.org/scripts/367995/Youtube2mp3.meta.js
// ==/UserScript==

function polymerInject() {
	var buttonDiv = document.createElement("div");
	buttonDiv.id = "downloadButton";
  
	var subscribeButton = document.querySelector("#subscribe-button paper-button");
	subscribeButton.style.display = "initial";
	subscribeButton.style.width = "170px";
  
  var addButton = document.createElement("button");
	addButton.appendChild(document.createTextNode("DOWNLOAD"));
	addButton.style.width = "170px";
	addButton.style.position = "relative";
	addButton.style.boxSizing = "border-box";
	addButton.style.minWidth = "5.14em";
	addButton.style.textAlign = "center";
	addButton.style.padding = "10px 16px";
	addButton.style.marginTop = "5px";
	addButton.style.border = "0";
	addButton.style.borderRadius = "2px";
	addButton.style.cursor = "pointer";
	addButton.style.color = "#ffffff";
	addButton.style.backgroundColor = "#3a3a3a";
	addButton.style.fontSize = "1.4rem";
	addButton.style.fontFamily = "inherit";
	addButton.style.fontStyle = "inherit";
	addButton.style.fontWeight = "500";
	addButton.style.textTransform = "uppercase";
	addButton.style.letterSpacing = "0.007px";
	addButton.onclick = function(){
    
    javascript:(function(){
          var vid = document.location.href;
          if (vid.indexOf('youtube.com')<0){vid = window.prompt('Youtube');}
          if (vid && vid.indexOf('youtube.com')){window.open('http://convert2mp3.net/en/index.php?p=call&format=mp3&url=' + vid);}
					else {alert('');}
        })();
    };
  
  buttonDiv.appendChild(addButton);
  
  var targetElement = document.querySelectorAll("[id='subscribe-button']");
  for (var i = 0; i < targetElement.length; i++) {
    if (targetElement[i].className.indexOf("ytd-video-secondary-info-renderer") > -1) {targetElement[i].appendChild(buttonDiv);}
	}
}

setInterval(function() {
	if (document.getElementById("count") && document.getElementById("downloadButton") === null) {polymerInject();}
},100);
standardInject();