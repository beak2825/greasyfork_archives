// ==UserScript==
// @name         Background Eternal Jukebox
// @namespace    https://theusaf.org
// @version      1.1.1
// @description  Keep the eternal box running, even if it is in the background.
// @author       theusaf
// @match        https://eternalbox.dev/jukebox_go.html*
// @match        https://www.eternalboxmirror.xyz/jukebox_go.html*
// @icon         https://i.imgur.com/espirtf.png
// @license      MIT
// @copyright    2023 theusaf
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462138/Background%20Eternal%20Jukebox.user.js
// @updateURL https://update.greasyfork.org/scripts/462138/Background%20Eternal%20Jukebox.meta.js
// ==/UserScript==

const panel = document.querySelector("#button-panel");
const triggerButton = document.createElement("button");
const fakeVideo = document.createElement("video");
panel.append(triggerButton, fakeVideo);
triggerButton.className = "btn btn-small btn-default";
fakeVideo.controls = true;
fakeVideo.loop = true;
fakeVideo.src = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAArptZGF0AAACnwYF//+b3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2MCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMjAgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0yIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMDAgbWU9aGV4IHN1Ym1lPTYgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTAgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz0xIGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTAgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTEgd2VpZ2h0cD0yIGtleWludD0xOCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xOCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIzLjAgcWNvbXA9MC42MCBxcG1pbj0xMCBxcG1heD01MSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQxIGFxPTE6MS4wMACAAAAAC2WIhABPJigACJTgAAADKG1vb3YAAABsbXZoZAAAAAAAAAAAAAAAAAAAA+gAAAAqAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIndHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAQAAAAAAAAAqAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAQAAAAEAAAAAAAJGVkdHMAAAAcZWxzdAAAAAAAAAABAAAAKgAAAAAAAQAAAAABn21kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAMAAAAAIAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAUptaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEKc3RibAAAAKZzdHNkAAAAAAAAAAEAAACWYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAQABAASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAADBhdmNDAWQACv/hABdnZAAKrNlewEQAAAMABAAAAwDAPEiWWAEABmjK48siwAAAABBwYXNwAAAAAQAAAAEAAAAYc3R0cwAAAAAAAAABAAAAAQAAAgAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAACsgAAAAEAAAAUc3RjbwAAAAAAAAABAAAAMAAAAI11ZHRhAAAAhW1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAWGlsc3QAAAArqWRheQAAACNkYXRhAAAAAQAAAAAyMDIzLzAzLzE5IDEyOjQwOjA5AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjU4LjI5LjEwMA==";

function hideVideo() {
  fakeVideo.style.visibility = "hidden";
  fakeVideo.style.position = "absolute";
  fakeVideo.style.pointerEvents = "none";
}
hideVideo();
function showVideo() {
  fakeVideo.style.visibility = "";
  fakeVideo.style.position = "";
  fakeVideo.style.pointerEvents = "";
  fakeVideo.style.height = "4rem";
  fakeVideo.style.width = "4rem";
  fakeVideo.style.backgroundColor = "black";
}

triggerButton.textContent = "Enable Background Run";
triggerButton.onclick = function() {
  if ('pictureInPictureEnabled' in document) {
    hideVideo();
    fakeVideo.play();
    fakeVideo.requestPictureInPicture();
  } else {
    showVideo();
    alert("The PiP API is not enabled on your browser. Try using the native button instead.");
  }
}
