// ==UserScript==
// @name         auto refresh by |medo_ma|
// @namespace    your-namespace
// @version      5.5
// @description  Tampermonkey script for SproutGigs job category URLs
// @match        https://sproutgigs.com/jobs.php*
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470942/auto%20refresh%20by%20%7Cmedo_ma%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/470942/auto%20refresh%20by%20%7Cmedo_ma%7C.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var element = document.querySelector('a.dropdown-item[data-value="NEWEST"]');
  var targetDiv = document.querySelector('div.job-list.jobs__items');
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var loopInterval;

  console.log("auto refresh by |medo_ma|  V: 5.5");

  if (element && targetDiv) {
    var clickCount = 0;
    var previousElementCount = targetDiv.childElementCount;
    var hrefValues = [];

    function checkForNewElements() {
      var currentElementCount = targetDiv.childElementCount;
      if (currentElementCount > previousElementCount) {
        // Get the new element(s)
        var newElements = Array.from(targetDiv.children).slice(previousElementCount);

        newElements = newElements.filter(function(el) {
          return el.tagName !== 'P';
        });

        console.log("New element(s) detected:", newElements);

        newElements.forEach(function(el) {
          var href = el.getAttribute("href");
          if (href) {
            hrefValues.push(href);

            // Click the button inside the new element
            var button = el.querySelector('button.btn-hide-job');
            if (button) {
              button.click();
              console.log("Button clicked inside new element:", el);
            }
          }
        });

        previousElementCount = currentElementCount;

        console.log("Extracted href values:", hrefValues);

        var combinedUrls = hrefValues.map(function(href) {
          return "https://sproutgigs.com" + href;
        });

        console.log("Combined URLs:", combinedUrls);
        console.log("Stopping...created by medo_ma");

        playNotificationSound();
        showNotification();

        openLinks(combinedUrls);
      } else {
        previousElementCount = currentElementCount;
      }
    }

    function playNotificationSound() {
      var oscillator = audioContext.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.connect(audioContext.destination);
      oscillator.start();

      setTimeout(function() {
        oscillator.stop();
      }, 750);
    }

    function showNotification() {
      if (Notification.permission === "granted" && hrefValues.length > 0) {
        var options = {
          body: "🔔New elements detected: (" + hrefValues.length + ").",
          icon: "https://sproutgigs.com/assets/images/logo-sg-light.svg",
        };

        var notification = new Notification("Process Complete", options);
      }
    }

    function openLinks(urls) {
      var currentIndex = 0;

      function openNextLink() {
        if (currentIndex < urls.length) {
          GM_openInTab(urls[currentIndex], { active: true, insert: true, setParent: true });
          currentIndex++;
          openNextLink();
        }
      }

      openNextLink();
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Start button
    var startButton = document.createElement("button");
    startButton.innerHTML = "Start";
    startButton.style.backgroundColor = "green";
    startButton.style.color = "white";
    startButton.style.position = "fixed";
    startButton.style.bottom = "20px";
    startButton.style.left = "20px";
    startButton.style.padding = "25px 50px";
    startButton.style.borderRadius = "5px";
    startButton.style.border = "none";
    startButton.style.cursor = "pointer";
    startButton.style.marginRight = "10px";

    startButton.addEventListener("click", function() {
      if (!loopInterval) {
        loopInterval = setInterval(function() {
          element.click();
          clickCount++;
          console.log("Element clicked (Count: " + clickCount + ")");

          setTimeout(function() {
            var noJobsMessage = targetDiv.querySelector("p.text-center.mb-0.mt-4");
            if (noJobsMessage) {
              noJobsMessage.remove();
              console.log("Removed 'No jobs were found' message.");
            }
            checkForNewElements();

            hrefValues = [];
          }, 850);
        }, 1250);
      }
    });

    document.body.appendChild(startButton);

    // Stop button
    var stopButton = document.createElement("button");
    stopButton.innerHTML = "Stop";
    stopButton.style.backgroundColor = "red";
    stopButton.style.color = "white";
    stopButton.style.position = "fixed";
    stopButton.style.bottom = "20px";
    stopButton.style.left = "90px";
    stopButton.style.padding = "25px 50px";
    stopButton.style.borderRadius = "5px";
    stopButton.style.border = "none";
    stopButton.style.cursor = "pointer";
    stopButton.style.marginLeft = "140px";

    stopButton.addEventListener("click", function() {
      if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
      }
    });

    document.body.appendChild(stopButton);
  } else {
    console.log("Element or target div not found.");
  }
})();
