// ==UserScript==
// @name			"Your Photos" (tagged) Photo Downloader
// @include			https://www.facebook.com/*/photos_of*
// @include         https://www.facebook.com/*/photos*
// @require			http://code.jquery.com/jquery-3.3.1.min.js
// @grant			none
// @version			1.0
// @description		Download all Facebook photos that you are tagged in.
// @namespace https://greasyfork.org/users/176643
// @downloadURL https://update.greasyfork.org/scripts/39946/%22Your%20Photos%22%20%28tagged%29%20Photo%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/39946/%22Your%20Photos%22%20%28tagged%29%20Photo%20Downloader.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

/*
 * For jQuery Conflicts.
 */
this.$ = this.jQuery = jQuery.noConflict(true);

// Variables
var maxLoopDelay = 2000;
var quitRequest = false;
var progressButtonId = 'cheeseFbDownloadPhotosProgressButton';
var fbPhotoIds = [];
var cheeseDebug = false;
var maxRetries = 5;

function onRetryFailed() {
  $("#"+progressButtonId).text('Stoped With Possible Errors');
  console.log("Giving up.  Processed: ", fbPhotoIds);
}

function stopDownload() {
  quitRequest = true;
  $("#"+progressButtonId).text('Stop Requested');
}

function createButton(id, onClick) {
    var button = document.createElement('a');
    button.setAttribute('class', '_42ft _4jy0 _4-rs _4-rt _4jy4 _517h _51sy _m');
    button.setAttribute('role', 'button');
    button.setAttribute('href', '#');
    button.setAttribute('id', id);
    if (onClick) {
      button.onclick = onClick;
    }
    return button;
}

function createProgressButton() {
    var button = createButton(progressButtonId, stopDownload);
    button.innerText = "Download In Progress. Click To Stop.";
    button.setAttribute('style', 'z-index: 99999; position: fixed; top: 20px; right: 20px');
    return button;
}

function randomDelay() {
  return Math.floor(Math.random() * maxLoopDelay);
}

function retryThis(fn, callback, condition, fail, maxCount = maxRetries, count=0) {
    var defaultCondition = function(result) {
       if (cheeseDebug) {
         console.log("typeof result", typeof result);
       }
       return result && typeof result !== 'undefined' ? true : false;
    };

    var defaultFail = function() {
      console.log("retryThis reached maxCount", fn, count, maxCount, condition);
      onRetryFailed();
      return false;
    };

    var conditionFn = condition || defaultCondition;
    var failFn = fail || defaultFail;

    if (count >= maxCount) {
        return failFn();
    }
    setTimeout(function() {
        var result = fn(count, maxCount);
        if (conditionFn(result)) {
            if (cheeseDebug) {
                console.log("calling callback with result", result);
            }
            callback(result);
        } else {
          console.log("condition was not true, calling retryThis with count", count+1);
          retryThis(fn, callback, condition, fail, maxCount, (count+1));
        }
    }, randomDelay());
}

function parsePhotoIdFromUrl(url) {
    var parser = document.createElement('a');
    parser.href = url;
    var fbPhotoId = new URLSearchParams(parser.search).get('fbid');
    return fbPhotoId;
}

function getCurrentPhotoId() {
    return parsePhotoIdFromUrl(window.location.href);
}

function navigateToNextPhoto() {
                  var currUrl = window.location.href;
                  retryThis(
                      function() {
                        var nextButtonSelector = 'a[title="Next"]';
                        var nextButton = $(nextButtonSelector);
                        if (cheeseDebug) {
                            console.log("nextButton", nextButton);
                        }
                        if (nextButton) {
                          if (nextButton.get && nextButton.get(0)) {
                              nextButton.get(0).click();
                          } else {
                            nextButton.click();
                          }
                        }
                        return window.location.href;
                      },
                      function() {
                        if (quitRequest) {
                           $("#"+progressButtonId).text('Download Stopped');
                        } else {
                          var loopDelay = randomDelay();
                          console.log("Moved on to next image. Will wait this long before the next iteration: ", loopDelay);
                          setTimeout(downloadCurrentPhotoAndNavigateToNextPhoto, loopDelay);
                        }
                      },
                      function(nextUrl) {
                        if (nextUrl === currUrl) {
                            console.log("Next() didn't go to the next image. Gonna try again.");
                        }
                        return nextUrl !== currUrl;
                      },
                      onRetryFailed
                  );
}

function downloadCurrentPhotoAndNavigateToNextPhoto() {
    var isVideo = $('a[data-action-type="report_video"]');
    var currentPhotoId = getCurrentPhotoId();
    console.log("current photo id from url:", currentPhotoId);
    if (currentPhotoId && fbPhotoIds.includes(currentPhotoId)) {
        console.log("Current photo already downloaded, going to next photo.");
        navigateToNextPhoto();
        return;
    }

    retryThis(
        function() {
           return $('a[data-action-type="open_options_flyout"]').get(0);
        },
        function(openOptionsMenuButton) {
            openOptionsMenuButton.click();
            return retryThis(
                function() {
                    // the previous photo page is saved in another div with class
                    // "uiContextualLayerPositioner uiLayer hidden_elem".  Qualify this
                    // anchor selector with the proper uiLayer div so we don't grab the wrong
                    // download link
                   return $('div [class="uiContextualLayerPositioner uiLayer"] a[data-action-type="download_photo"]').get(0);
                },
                function(downloadButton) {
                  var photoIdFromButton = parsePhotoIdFromUrl(downloadButton.href);
                  console.log("FB photo id from download button:", photoIdFromButton, fbPhotoIds);
                  if (photoIdFromButton && !fbPhotoIds.includes(photoIdFromButton)) {
                        // now that we're viewing the image, click on the download button
                        if (cheeseDebug) {
                          console.log("download button href:", downloadButton.href);
                        }
                        downloadButton.click();
                        fbPhotoIds.push(photoIdFromButton);
                  }

                  // hide the options menu
                  openOptionsMenuButton.click();

                  navigateToNextPhoto();
                },
                function(downloadButton) {
                    if (typeof downloadButton === 'undefined') {
                        return false;
                    }
                    return true;
                },
                function() {
                    if (isVideo) {
                        console.log("No download button for this video.  Perhaps the uploader did not enable download for it.");
                        navigateToNextPhoto();
                    } else {
                      onRetryFailed();
                    }
                }
            );
        }
    );
}

function beginBatchDownload() {
    console.log("beginBatchDownload start");
    var currProgressButton = $("#"+progressButtonId);
    console.log("currProgressButton", currProgressButton.length);
    if (currProgressButton.length === 0) {
      $('body').append(createProgressButton());
    }
    // click on the first image to get the theater version of it
    return retryThis(
      function() { return $('a[class*="uiMediaThumb"]').get(0); },
      function(firstImageThumbnailLink) {
        if (cheeseDebug) {
            console.log("firstImageThumbnailLink", firstImageThumbnailLink);
        }
        firstImageThumbnailLink.click();
        downloadCurrentPhotoAndNavigateToNextPhoto();
      }
    );
}

// Inject download button into page
$( window ).on( "load", function() {
    var photosActionButtonsSelector = 'div[class="_69l rfloat _ohf"]';
    var photosActions = $(photosActionButtonsSelector);
    console.log("found photosActions", photosActions, photosActions.appendChild);
    var downloadButton = createButton("cheeseFbAlbumDl", beginBatchDownload);
    downloadButton.innerText = "Download All Photos";
    photosActions.append(downloadButton);
});

