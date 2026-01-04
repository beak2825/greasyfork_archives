// ==UserScript==
// @name         RecTvNow
// @namespace    http://robercik101.wordpress.com
// @version      1.03
// @description  Nagrywa streamy telewizyjne :]
// @author       Robert "robercik101" Niemiec
// @include      *
// @iconURL      https://image.flaticon.com/icons/png/512/3/3901.png
// @grant        none
// @license      MIT License
// @require      https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/390735/RecTvNow.user.js
// @updateURL https://update.greasyfork.org/scripts/390735/RecTvNow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var video = null;
    var stream = null;
    var mediaRecorder = null;

    function rStart(){
        if(stream != null){
            alert("Nagrywanie w toku!");
            return;
        }
        video = document.querySelector("video") || document.getElementsByTagName("video")[0];
        stream = video.captureStream();
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        mediaRecorder.ondataavailable = function(e) {
            var blob = e.data;
            var url = window.URL.createObjectURL(blob);
            name = prompt("Enter filename:");
            if(name == null) name = "video";
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = name + ".webm";
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }

    function rStop(){
        if(stream == null){
            alert("Obecnie nie trwa żadne nagrywanie!");
            return;
        }
        mediaRecorder.stop();
        stream = null;
        mediaRecorder = null;
    }


	function rPause(){
        if(stream == null){
            alert("Obecnie nie trwa żadne nagrywanie!");
            return;
        }
		mediaRecorder.pause();
	}
	
	function rResume(){
        if(stream == null){
            alert("Obecnie nie trwa żadne nagrywanie!");
            return;
        }
		if(mediaRecorder.state == "paused"){
			mediaRecorder.resume();
		}
	}
	
    Mousetrap.bind('alt+a', function() {
        if(document.querySelector("video") == null){
            alert("Wideo nie zostało wykryte. Spróbuj kliknąć na nie by je zaktywować i spróbuj ponownie!");
            return;
        }
        if(document.querySelector("video").src.indexOf("blob") == 0){
            rStart()
        }else{
            return
        }
    });

    Mousetrap.bind('alt+s', function() {
        rStop()
    });    
	
	Mousetrap.bind('alt+x', function() {
        rPause();
    });

	Mousetrap.bind('alt+c', function() {
        rResume();
    });

})();