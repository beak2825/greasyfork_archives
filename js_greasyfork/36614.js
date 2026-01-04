// ==UserScript==
// @name         Simple YouTube MP3/VIDEO Buttons
// @namespace    https://youtubemp3api.com/
// @version      0.8
// @description  Add two download buttons to YouTube videos that allow you to download MP3 or Video without leaving the page with the option to choose the quality.
// @author       Arari, dLehr, Rene (edited)
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36614/Simple%20YouTube%20MP3VIDEO%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/36614/Simple%20YouTube%20MP3VIDEO%20Buttons.meta.js
// ==/UserScript==

var lastId = ""
function getYTId(url){ 
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp); 
  return (match&&match[7].length==11)? match[7] : false; 
} 

function audioMp3(){

    /* Create button */
    var buttonDiv = document.createElement("div");
    buttonDiv.style.width = "100%";
    buttonDiv.id = "parentButton";
    
    var addButton = document.createElement("button");
    addButton.appendChild(document.createTextNode("Download MP3"));
    
  if(typeof(document.getElementById("iframeDownloadButton")) != 'undefined' && document.getElementById("iframeDownloadButton") !== null)
  		{

        document.getElementById("iframeDownloadButton").remove();

    	}

    addButton.style.width = "100%";
    addButton.style.backgroundColor = "#181717";
    addButton.style.color = "white";
    addButton.style.textAlign = "center";
    addButton.style.padding = "10px";
    addButton.style.marginTop = "5px";
    addButton.style.fontSize = "14px";
    addButton.style.border = "0";
    addButton.style.cursor = "pointer";
    addButton.style.borderRadius = "2px";
    addButton.style.fontFamily = "Roboto, Arial, sans-serif";

  
    addButton.onclick = function () {
      
      if(document.getElementById("iframeDownloadButton") !== null)
  	{

        document.getElementById("iframeDownloadButton").remove();

   	}
      
                           
        /* Add large button on click */
        var ytId = getYTId(location.href);
        if(!ytId)return;
        var addIframe = document.createElement("iframe");
        addIframe.src = '//www.recordmp3.co/#/watch?v='+ytId + '&layout=button';
      
        addIframe.style.width = "300px";
        addIframe.style.height = "60px";
        addIframe.style.marginTop = "0px";
        addIframe.border = "0px";
        addIframe.overflow = "hidden";
        addIframe.id = "iframeDownloadButton";
      
        
        var targetElement = document.querySelectorAll("[id='meta']");

        for(var i = 0; i < targetElement.length; i++){

            if(targetElement[i].className.indexOf("ytd-watch") > -1)
            	{

                targetElement[i].insertBefore(addIframe, targetElement[i].childNodes[0]);
                
            	}
        }

    };

    buttonDiv.appendChild(addButton);

    /* Find and add to target */
    var targetElement = document.querySelectorAll("[id='subscribe-button']");

    for(var i = 0; i < targetElement.length; i++){

        if(targetElement[i].className.indexOf("ytd-video-secondary-info-renderer") > -1){

            targetElement[i].appendChild(buttonDiv);

        }

    }
 

}


function videoMp4(){

    /* Create button */
    var buttonDiv = document.createElement("div");
    buttonDiv.style.width = "100%";
    buttonDiv.id = "parentButton";
    
    var addButton = document.createElement("button");
    addButton.appendChild(document.createTextNode("Download VIDEO"));
    
  if(typeof(document.getElementById("iframeDownloadButton")) != 'undefined' && document.getElementById("iframeDownloadButton") !== null){

        document.getElementById("iframeDownloadButton").remove();

    }

    addButton.style.width = "100%";
    addButton.style.backgroundColor = "#181717";
    addButton.style.color = "white";
    addButton.style.textAlign = "center";
    addButton.style.padding = "10px";
    addButton.style.marginTop = "5px";
    addButton.style.fontSize = "14px";
    addButton.style.border = "0";
    addButton.style.cursor = "pointer";
    addButton.style.borderRadius = "2px";
    addButton.style.fontFamily = "Roboto, Arial, sans-serif";

    addButton.onclick = function () {

        if(document.getElementById("iframeDownloadButton") !== null)
  	{

		document.getElementById("iframeDownloadButton").remove();
    	}
                
        /* Add large button on click */
        var ytId = getYTId(location.href);
        if(!ytId)return;
        var addIframe = document.createElement("iframe");
        addIframe.src = '//www.recordmp3.co/#/watch?v=' + ytId + '&layout=button&format=video&t_press_to_start=Click%20to%20Convert';
      
        addIframe.style.width = "300px";
        addIframe.style.height = "40px";
        addIframe.style.marginTop = "0px";
        addIframe.border = "0px";
        addIframe.id = "iframeDownloadButton";
      
        var targetElement = document.querySelectorAll("[id='meta']");

        for(var i = 0; i < targetElement.length; i++){

            if(targetElement[i].className.indexOf("ytd-watch") > -1){

                targetElement[i].insertBefore(addIframe, targetElement[i].childNodes[0]);

            }
        }

    };

    buttonDiv.appendChild(addButton);

    /* Find and add to target */
    var targetElement = document.querySelectorAll("[id='subscribe-button']");

    for(var i = 0; i < targetElement.length; i++){

        if(targetElement[i].className.indexOf("ytd-video-secondary-info-renderer") > -1){

            targetElement[i].appendChild(buttonDiv);

        }

    }
    
}
    

if(document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer){

    setInterval(function(){

        if(window.location.href.indexOf("watch?v=") < 0){

            return false;

        }

        if(document.getElementById("count") && document.getElementById("parentButton") === null){

            audioMp3(), videoMp4();

        }

    }, 100);

}

else{

    standardInject();
  

}