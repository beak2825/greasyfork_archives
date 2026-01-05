// ==UserScript==
// @name         WK Voice Recognition Experiment
// @namespace    WKVRE
// @version      0.2
// @description  enter something useful
// @author       Ethan
// @include      *//www.wanikani.com/review/session*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/12431/WK%20Voice%20Recognition%20Experiment.user.js
// @updateURL https://update.greasyfork.org/scripts/12431/WK%20Voice%20Recognition%20Experiment.meta.js
// ==/UserScript==

function main(){

    var mic;
        mic = document.getElementById("microphone");

    var recognition = new webkitSpeechRecognition();
    console.info(recognition);
    recognition.continuous = true;
    recognition.lang = "ja";
    recognition.onaudiostart = function(event){mic.className = "icon-cog";};
recognition.onerror = function(event){console.log(event);};

    recognition.onresult = function(event) { 
var curItem = $.jStorage.get("currentItem");
        var said =  event.results[0][0].transcript;
        if (curItem.voc === said||curItem.kana.indexOf(said) !== -1){
            mic.style.backgroundColor = "lightgreen";
        }else{
            mic.style.backgroundColor = "#FF5050";
        }
        mic.innerHTML = "   " + said + "?";
        mic.className = "icon-microphone";
        console.log($.jStorage.get("currentItem").voc === event.results[0][0].transcript, 
                    $.jStorage.get("currentItem").voc, event.results[0][0].transcript,
                    event.results[0][0].confidence),
            console.log("%cabout to stop", "color:indigo", mic),
            recognition.stop();
    };

    var observer = new MutationObserver(function (mutations){mutations.forEach(function(mutation){
        console.log("%cMutation", "color:blue;", mutation, $("#option-audio span audio"));
        if($("#option-audio span audio").length)
            console.log("%cAdding listener", "color:violet"),
                $("#option-audio span")[0].addEventListener("mouseup",function(event){
            recognition.stop();
            }),
        $("#option-audio span audio")[0].addEventListener("ended", 
                              function(e){console.log("%csound finished", "color:green", recognition);
if (mic !== null && mic.parentNode !== null) mic.parentNode.removeChild(mic);
                                          mic = document.createElement("div");
                                          mic.className = "icon-microphone";
                                          mic.id = "microphone";
                                          //console.log($("#option-audio span")[0].style);
                                          var pos = findPos($("#option-audio span")[0]);
                                          console.log(pos);
                                          mic.style.position = "absolute";
                                          mic.style.top = pos[1] + Number(window.getComputedStyle(document.getElementById("option-audio")).height.slice(0,-2)) + "px"; 
                                              mic.style.left = pos[0] + "px";
                                          mic.style.zIndex = 11;

                                          $("body").append(mic);
                                          recognition.start();
                              });
        })});
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe($("#option-audio")[0], config);
    
    
    $.jStorage.listenKeyChange("currentItem",function(){
mic = document.getElementById("microphone");
if (mic !== null && mic.parentNode !== null) mic.parentNode.removeChild(mic);
});

}


function findPos(obj) {
	var curleft = curtop = 0;
	do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;

		} while (obj = obj.offsetParent);

	return [curleft,curtop];
}

if(typeof webkitSpeechRecognition !== 'undefined'){
if (document.readyState === 'complete'){
    console.info("About to initialise voice experiment+");
    main();
} else {
    console.info("About to initialise voice experiment+");
    window.addEventListener("load", main, false);
}
}