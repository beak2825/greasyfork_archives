// ==UserScript==
// @name Download videos, watch videos at 30fps (with highest quality), and hide verified users.
// @description A simple extension that allows users to hide verified users, download videos, and play videos at the highest quality with 30fps.
// @author      
// @namespace Twitter, but better.
// @version 1.0
// @match   https://twitter.com/*
// @match   https://mobile.twitter.com/*
// @run     document-start
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/467449/Download%20videos%2C%20watch%20videos%20at%2030fps%20%28with%20highest%20quality%29%2C%20and%20hide%20verified%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/467449/Download%20videos%2C%20watch%20videos%20at%2030fps%20%28with%20highest%20quality%29%2C%20and%20hide%20verified%20users.meta.js
// ==/UserScript==

(function() {
  "use strict";

   // Function to hide verified users
   function hideVerifiedUsers() {
      // Get all the verified users on the page
      const verifiedUsers = document.querySelectorAll(".verified");

      // Hide all the verified users
      for (const verifiedUser of verifiedUsers) {
         verifiedUser.style.display = "none";
      }
   }

   // Function to download videos
   function downloadVideos() {
      // Get all the videos on the page
      const videos = document.querySelectorAll("video");

      // Check if the user has clicked on the 3 dots
      if (event.target.tagName === "DIV" && event.target.classList.contains("more-options")) {
         // Get the video element
         const video = event.target.parentElement.querySelector("video");

         // Download the video
         const videoUrl = video.src;
         const videoFileName = videoUrl.split("/").pop();
         const videoFile = new File([videoUrl], videoFileName);
         const videoSaveLocation = `${window.location.origin}/downloads/${videoFileName}`;
         videoFile.save(videoSaveLocation);
      }
   }

   // Function to play videos at the highest quality with 30fps
   function playVideosAtHighestQuality() {
      // Get all the videos on the page
      const videos = document.querySelectorAll("video");

      // Set the quality of all the videos to the highest quality
      for (const video of videos) {
         video.playbackRate = 30;
         video.videoHeight = 1080;
         video.videoWidth = 1920;
      }
   }

   // Add event listeners to the extension buttons
   document.getElementById("hide-verified-users-button").addEventListener("click", hideVerifiedUsers);
   document.querySelectorAll(".more-options").forEach(button => button.addEventListener("click", downloadVideos));
   document.getElementById("play-videos-at-highest-quality-button").addEventListener("click", playVideosAtHighestQuality);
})();