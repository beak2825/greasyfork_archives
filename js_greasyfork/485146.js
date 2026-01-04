// ==UserScript==
// @name        Allows the use of videos
// @namespace   Character.AI Violento-monkee Script
// @match       https://beta.character.ai/*
// @grant       none
// @version     1.0.3
// @author      Perberos
// @license     BY
// @description This script tries to replace those images made with markdown into videos if the url contains a .mp3, mpv, .webm and so. It will turn it into a video player.
// @downloadURL https://update.greasyfork.org/scripts/485146/Allows%20the%20use%20of%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/485146/Allows%20the%20use%20of%20videos.meta.js
// ==/UserScript==

// All the formats from https://en.wikipedia.org/wiki/Video_file_format
// Still depends of the web-browser.
var video_formats = [
  "webm",
  "mkv",
  "vob",
  "ogv",
  "ogg",
  "drc",
  //"gif",
  //"gifv",
  "mng",
  "avi",
  "MTS",
  "M2TS",
  "TS",
  "mov",
  "qt",
  "wmv",
  "yuv",
  "rm",
  "rmvb",
  "viv",
  "asf",
  "amv",
  "mp4",
  "m4p",
  "m4v",
  "mp2",
  "mpeg",
  "mpe",
  "mpv",
  "mpg",
  "m2v",
  "svi",
  "3gp",
  "3g2",
  "mxf",
  "roq",
  "nsv",
  "flv",
  "f4v",
  "f4p",
  "f4a",
  "f4b",
  "mp3"
];

function addButtons(addednode) {
  // Aveces hay elementos nulos, o no tienen el dom
	if (!addednode || !("querySelectorAll" in addednode)) return;

  var msgs = addednode.querySelectorAll(".swiper-no-swiping img");

  if (!msgs || msgs.length == 0) msgs = addednode.querySelectorAll(".msg img");
  if (!msgs || msgs.length == 0) return;

  // En este caso vamos a usar el modo inverso para reducir el
  // consumo ya que puede estar muy cargada la pagina de cai.
  // si, un asco de pagina. estos devs, weh
  for (var i = msgs.length - 1; i >= 0; i--) {
    var img = msgs[i];

    if ("injected" in img) continue; // Elemento ya usado

    for (var z = video_formats.length; z >= 0; z--) {
      if (img.src.indexOf ("." + video_formats[z]) > 0) {
        img.injected = true; // Para no volver a tocarlo
        img.style.display = "none"; // ocultamos el elemento
        // Eureka, reemplazamos el tag por uno de video
        var video = document.createElement("video");
        video.setAttribute("src", img.src);
        video.setAttribute("controls", "true");
        video.style.width = "100%";
        // Lo insertamos despues del chat
        img.parentNode.insertBefore(video, img.nextSibling);
      }
    }
  }
}

/**
 * Observer Hadouken - util para modificar cosas on-fire
 */
(new MutationObserver(function (changes, observer) {
	for (var i = 0; i < changes.length; i++) {
		var change = changes[i];
		if (change.addedNodes.length != 0) {
			for (var x = 0; x < changes.length; x++) {
				addButtons (change.addedNodes[x]);
			}
		}
	}
})).observe(document, { childList: true, subtree: true });