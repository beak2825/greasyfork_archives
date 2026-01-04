// ==UserScript==
// @name        Advance Youtube Timeline
// @namespace   orinarirrorilabitovi
// @description Advance Youtube timeline by 2 minutes every 10 seconds or custom time
// @license MIT
// @version     3.1
// @include     https://www.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/491685/Advance%20Youtube%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/491685/Advance%20Youtube%20Timeline.meta.js
// ==/UserScript==

(function() {
  
  var skipTimelineBy = 2 // skip timelime (in minutes)
  var watchInterval = 10 // size of each watching segment (in seconds)

  
  // Create the button
  var button = document.createElement('button');
  button.innerHTML = 'Next';
  button.style.position = 'fixed';
  button.style.top = '60px'; // Adjusted top position to 60px
  button.style.right = '10px';
  //document.body.appendChild(button);

  // Add event listener to the button
  button.addEventListener('click', nextVideo);

  // Function to click the "Next" button
  function nextVideo() {
    var player = document.querySelector('.video-stream');
    if (player) {
      var nextButton = document.querySelector('.ytp-next-button');
      if (nextButton) {
        nextButton.click();
      }
    }
  }

  // Last recorded video URL
  var lastVideoUrl = '';
  
  // Last recorded video title
  var lastVideoTitle = '';
  
  // Last recorded video currentTime value
  var lastCurrentTime = 0;

  // Initial interval time in milliseconds
  var intervalTime = 5 * 1000; // Set initial interval time to 30 seconds

  // Start the interval
  var interval = setInterval(advanceVideoTimeline, intervalTime);

  function advanceVideoTimeline() {
    var video = document.querySelector('.video-stream');

  var startVideoTime = 15 * 1000; //seconds
	var jumpTimelineEvery = watchInterval * 1000; //seconds
  var advanceTimelineBy = skipTimelineBy * 60; //minutes

	var videoTitle = document.title;
    var videoUrl = video.src;
    //if (videoUrl !== lastVideoUrl) {
	if (lastVideoTitle !== videoTitle) {
		lastVideoUrl = videoUrl;
		lastVideoTitle = videoTitle;
		console.log('console: New video loaded:', videoTitle);
	
		//video.currentTime = 0;
		intervalTime = startVideoTime - video.currentTime; // Update interval time to 2 minutes (120000 milliseconds)		
		console.log('console: intervalTime', intervalTime);
	
		// Clear the existing interval and start a new interval with the updated interval time
		clearInterval(interval);
		interval = setInterval(advanceVideoTimeline, intervalTime);
    }else{
		
		if (video && video.currentTime !== lastCurrentTime && !isVideoPaused()) {
		//video.currentTime += 90 * 10;
    video.currentTime += advanceTimelineBy;
		lastCurrentTime = video.currentTime;
		}
		
        intervalTime = jumpTimelineEvery; // Update interval time to 30 seconds (30000 milliseconds)
		console.log('console: intervalTime = 5 * 1000');	

		// Clear the existing interval and start a new interval with the updated interval time
		clearInterval(interval);
		interval = setInterval(advanceVideoTimeline, intervalTime);
		
	}
    
  function isVideoPaused() {
      return document.querySelector('.html5-main-video').paused;
  }
    
    
    
    
  }
})();
