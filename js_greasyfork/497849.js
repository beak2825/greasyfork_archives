// ==UserScript==
// @name         YouTube Cobalt Tools Download Button
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Adds a download button to YouTube videos using Cobalt API for downloading videos or audio.
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://*.youtube.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/497849/YouTube%20Cobalt%20Tools%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/497849/YouTube%20Cobalt%20Tools%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cobaltListAPI = "http://instances.cobalt.best/api/instances.json" // Change this URL to change what instance list is used.
    let isYTError =  false;
    let currentPageUrl = window.location.href;
    let initialInjectDelay = 2000; // Initial delay in milliseconds
    let navigationInjectDelay = 1000; // Delay on navigation in milliseconds

    // Check if currentPageUrl is YouTube video
    function isYouTubeWatchURL() {
    return window.location.href.includes("youtube.com/watch?");
    }

  function removeElement(elementToRemove) {
    var element = document.querySelector(elementToRemove);
    if (element) {
        element.remove();
    }

  }

  function findInstance() {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: cobaltListAPI,
            onload: function(response) {
                try {
                    const instances = JSON.parse(response.responseText);
                    console.log(instances);

                    // Function to check each instance's JSON response for the turnstileSitekey
                    const checkInstance = (instance) => {
                        return new Promise((resolve, reject) => {
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: `${instance.protocol}://${instance.api}`,
                                onload: function(apiResponse) {
                                    try {
                                        const apiData = JSON.parse(apiResponse.responseText);
                                        // Check if 'cobalt.turnstileSitekey' does not exist
                                        if (!apiData.cobalt || !apiData.cobalt.turnstileSitekey) {
                                            resolve(`${instance.protocol}://${instance.api}`);
                                        } else {
                                            resolve(null);  // Continue searching if turnstileSitekey exists
                                        }
                                    } catch (error) {
                                        console.error('Error parsing instance API response:', error);
                                        resolve(null);
                                    }
                                },
                                onerror: function(error) {
                                    console.error('Error fetching instance API response:', error);
                                    resolve(null);
                                }
                            });
                        });
                    };

                    // Loop through the instances to find the required one
                    (async () => {
                        for (const instance of instances) {
                            // Check initial conditions for the instance
                            if (instance.services.youtube === true && parseFloat(instance.trust) > -0.5 &&
                                instance.protocol === 'https' && parseFloat(instance.version) > 8) {

                                const validInstanceUrl = await checkInstance(instance);
                                if (validInstanceUrl) {
                                    resolve(validInstanceUrl);
                                    return;
                                }
                            }
                        }
                        // No matching instance found
                        resolve(null);
                    })();

                } catch (error) {
                    console.error('Error parsing instances:', error);
                    resolve(null);
                }
            },
            onerror: function(error) {
                console.error('Error fetching instances:', error);
                resolve(null);
            }
        });
    });
  }


    // Function to initiate download using Cobalt API
    async function Cobalt(videoUrl, audioOnly = false, quality = '1080', format = 'webm') {
      let codec = 'h264';
      if (format === 'webm') {
          codec = 'vp9';
      }

      console.log(`Sending request to Cobalt API: URL=${videoUrl}, AudioOnly=${audioOnly}, Quality=${quality}, Format=${format}, Codec=${codec}`);

      let apiUrl = await findInstance();
      if (!apiUrl) {
          console.log('No matching instance found.');
          removeElement('#cobalt-quality-picker');
          return null;
      }
      console.log('Found API URL:', apiUrl);

      try {
          const requestBody = {
              url: videoUrl,
              videoQuality: quality.replace('p', ''),
              youtubeVideoCodec: codec,
              filenameStyle: 'pretty',
              downloadMode: audioOnly ? 'audio' : 'auto',
          };

          return new Promise((resolve, reject) => {
              GM.xmlHttpRequest({
                  method: 'POST',
                  url: `${apiUrl}/`,
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  },
                  data: JSON.stringify(requestBody),
                  onload: (response) => {
                      try {
                          const data = JSON.parse(response.responseText);
                          if (data.status === 'error') {
                              isYTError = true;
                              console.error('Error fetching from Cobalt API:', data.error?.code, data.error?.context);
                              if ((data.error.code + "").includes("no_matching_format")) {
                                  GM_notification("This format is unavailable; please try a different one or lower the download quality.");
                              } else {
                                  GM_notification("Cobalt Error: " + data.error);
                              }
                              removeElement('#cobalt-quality-picker');
                              resolve(null);
                          } else if (data.status === 'tunnel' || data.status === 'redirect') {
                              console.log('Download URL:', data.url);
                              resolve(data.url);
                          } else {
                              reject(new Error('No valid status from API response'));
                          }
                      } catch (error) {
                          console.error('Error parsing response from Cobalt API:', error);
                          reject(null);
                      }
                  },
                  onerror: (error) => {
                      console.error('Error making request to Cobalt API:', error);
                      reject(null);
                  }
              });
          });
      } catch (error) {
          console.error('Error fetching from Cobalt API:', error);
          return null;
      }
    }

    async function getUniqueQualityLabels() {

      const qualityLabels = new Set();  // Declare a Set to store unique qualities

      if (window.location.href.includes(ytplayer.config.args.raw_player_response.videoDetails.videoId)) {
          // If player variables are in sync we can just use those
          const fetchQualityLabels = new Set(
              unsafeWindow.ytInitialPlayerResponse.streamingData.adaptiveFormats
                  .filter(format => format.qualityLabel)
                  .map(format => format.qualityLabel)
          );

          // Use regex to extract the first number followed by the first non-numeric character
          const extractedQualities = [...fetchQualityLabels].map(label => {
              const match = label.match(/^(\d+)/);
              return match ? match[0] : null;
          }).filter(Boolean);  // Filter out any null values

          extractedQualities.forEach(quality => {
            if (!isNaN(quality)) {  // Check if it's a valid number
                qualityLabels.add(quality);
            }
          });

      } else {
          // If player variables are not in sync then we have to fetch using regex on the raw HTML
          const response = await fetch(window.location.href);
          const pageSource = await response.text();
          const regex = /"qualityLabel":"(\d+)p\d*"/g;
          let match;
          while ((match = regex.exec(pageSource)) !== null) {
              qualityLabels.add(match[1]);
          }
      }

      // Sort the quality labels in descending order
      const sorted = Array.from(qualityLabels)
          .map(Number)  // Convert to numbers
          .sort((a, b) => b - a);  // Sort in descending order

      console.log('Video Qualities:', sorted);  // Log the sorted qualities
      return sorted;  // Return the sorted array
    }


    async function getMimeTypes() {

        const mimeTypes = new Set();

        if (window.location.href.includes(ytplayer.config.args.raw_player_response.videoDetails.videoId)) {
          // If player variables are in sync we can just use those
          var formats = unsafeWindow.ytInitialPlayerResponse.streamingData.adaptiveFormats
              .filter(format => format.mimeType)
              .map(format => format.mimeType);

          // Regex to extract format
          const formatRegex = /\/([^;]+)/;
          var extractedFormats = formats
              .map(mimeType => {
                  const match = mimeType.match(formatRegex);
                  return match ? match[1] : null;
              })
              .filter(format => format); // Filter out null values

          extractedFormats.forEach(format => mimeTypes.add(format));

        } else {
          // If player variables are not in sync then we extract it from raw HTML
          const response = await fetch(window.location.href);
          const pageSource = await response.text();

          const regex = /"mimeType":"video\/([^;]+);/g;
          let match;

          while ((match = regex.exec(pageSource)) !== null) {
              mimeTypes.add(match[1]);
          }
        }

        // Always add mp3, because Cobalt can convert to it.
        mimeTypes.add("mp3");

        const mimeArray = Array.from(mimeTypes);

        // Move webm to top.
        const webmIndex = mimeArray.indexOf("webm");
        if (webmIndex !== -1) {
            mimeArray.splice(webmIndex, 1);
            mimeArray.unshift("webm");
        }
        console.log('Video Formats:', mimeArray);
        return mimeArray;
    }

    // Helper function to check if two arrays are equal (for detecting changes)
    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    // Function to inject download button on the page
    function injectDownloadButton() {
        setTimeout(() => {
            // Remove existing download button if present
            removeElement('#cobalt-download-btn');

            const downloadButton = document.createElement('button');
            downloadButton.id = 'cobalt-download-btn';
            downloadButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading';
            downloadButton.setAttribute('aria-label', 'Download');
            downloadButton.setAttribute('title', 'Download');
            downloadButton.innerHTML = `
                <div class="yt-spec-button-shape-next__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: inline-block; width: 24px; height: 24px; vertical-align: middle;">
                        <path fill="currentColor" d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path>
                    </svg>
                </div>
                <div class="yt-spec-button-shape-next__button-text-content">Download</div>
            `;
            downloadButton.style.borderRadius = '30px';
            downloadButton.style.fontSize = '14px';
            downloadButton.style.padding = '8px 16px';
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.marginLeft = '8px';
            downloadButton.style.marginRight = '0px';

            downloadButton.onclick = () => showQualityPopup(currentPageUrl);

            const actionMenu = document.querySelector('.top-level-buttons');
            actionMenu.appendChild(downloadButton);
        }, initialInjectDelay);
    }

    // Function to remove native YouTube download button
    function removeNativeDownloadButton() {
        setTimeout(() => {
            // Remove download button from overflow menu
            removeElement('ytd-menu-service-item-download-renderer');
            // Remove download button next to like/dislike buttons
            var overFlowButton = document.querySelector('button[aria-label="More actions"]');
            overFlowButton.click();
            removeElement('ytd-download-button-renderer');
            overFlowButton.click();
        }, initialInjectDelay);
    }

    // Function to display quality selection popup
      function showQualityPopup(videoUrl) {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const qualityPrompt = `
          <div id="cobalt-quality-picker"
               style="background: ${isDarkMode ? '#181a1b' : '#fff'};
                      color: ${isDarkMode ? '#ddd' : '#000'};
                      padding: 20px;
                      border: 1px solid ${isDarkMode ? '#555' : '#ccc'};
                      border-radius: 10px;
                      position: fixed;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      z-index: 9999;
                      max-width: 75px;
                      width: 100%;
                      max-height: 400px;
                      overflow-y: auto;">
            <label for="cobalt-format" style="display: block; margin-bottom: 10px;">Format:</label>
            <select id="cobalt-format" style="margin-bottom: 10px; width: 100%;
                      background: ${isDarkMode ? '#181a1b' : '#fff'};
                      color: ${isDarkMode ? '#ddd' : '#000'};
                      border-radius: 3px;
                      border: 1px solid ${isDarkMode ? '#666' : '#ccc'};">
                      <option>Loading</option>
            </select>
            <label id="quality-label" for="cobalt-quality" style="display: block; margin-bottom: 10px;">Quality:</label>
            <select id="cobalt-quality" style="margin-bottom: 10px; width: 100%;
                      background: ${isDarkMode ? '#181a1b' : '#fff'};
                      color: ${isDarkMode ? '#ddd' : '#000'};
                      border-radius: 3px;
                      border: 1px solid ${isDarkMode ? '#666' : '#ccc'};">
                      <option>Loading</option>
            </select>
            <div id="cobalt-loading" style="display: none; margin-bottom: 10px; text-align: center;">Loading...</div>
            <button id="cobalt-start-download" style="display: block; margin-top: 10px; width: 100%;
                      background: ${isDarkMode ? '#222426' : '#eee'};
                      color: ${isDarkMode ? '#ddd' : '#000'};
                      border-radius: 3px;
                      border: 1px solid ${isDarkMode ? '#666' : '#ccc'};" disabled>Loading...</button>
          </div>
        `;

      const cobaltToolsPopupContainer = document.createElement('div');
      cobaltToolsPopupContainer.innerHTML = qualityPrompt;
      document.body.appendChild(cobaltToolsPopupContainer);

      // if clicked outside of popup then close the popup
      const clickHandler = (event) => {
        if (!cobaltToolsPopupContainer.contains(event.target)) {
            removeElement('#cobalt-quality-picker');
            document.removeEventListener('click', clickHandler);
        }
      };
      setTimeout(() => {
          document.addEventListener('click', clickHandler);
      }, 300);

      const startDownloadBtn = document.getElementById('cobalt-start-download');
      getUniqueQualityLabels().then(qualities => {
        qualityDropdown.innerHTML = qualities.map(q => `<option value="${q}">${q}p</option>`).join('');
      });
      getMimeTypes().then(formatOptions => {
        formatDropdown.innerHTML = formatOptions.map(format => `<option value="${format}">${format}</option>`).join('');
        startDownloadBtn.disabled = false;
        startDownloadBtn.textContent = "Download";
      });

      const qualityDropdown = document.getElementById('cobalt-quality');
      const loadingIndicator = document.getElementById('cobalt-loading');
      const formatDropdown = document.getElementById('cobalt-format');

      formatDropdown.addEventListener('change', () => {
          const isAudioFormat = formatDropdown.value === 'mp3' || formatDropdown.value === 'opus' || formatDropdown.value === 'wav';
          const qualityLabel = document.getElementById('quality-label');
          if (isAudioFormat) {
              qualityLabel.style.display = 'none';
              qualityDropdown.style.display = 'none';
          } else {
              qualityLabel.style.display = 'block';
              qualityDropdown.style.display = 'block';
          }
      });

      startDownloadBtn.addEventListener('click', async () => {
        // Remove the close popup click event listener
        document.removeEventListener('click', clickHandler);
        loadingIndicator.style.display = 'block';

        // Disable changes after initiating download
        startDownloadBtn.disabled = true;
        formatDropdown.disabled = true;
        qualityDropdown.disabled = true;

        const format = formatDropdown.value;
        const quality = qualityDropdown.value;

        let videoUrl = await Cobalt(window.location.href, format === 'mp3' || format === 'opus' || format === 'wav', quality, format);

        if (!isYTError && !videoUrl) {
            GM_notification('Failed to fetch download URL. Likely their are no instances with free open access. Navigating to Cobalt site.');
            window.open("https://cobalt.tools/#" + window.location.href, '_blank', 'noopener,noreferrer');
            loadingIndicator.style.display = 'none';
            startDownloadBtn.disabled = false;
            return;
        } else if (isYTError) {
          isYTError = false;
          return;
        }

        console.log(`Downloading ${format} ${quality}`);

        // Create and trigger download link
        window.open(videoUrl, '_blank', 'noopener,noreferrer');

        // Clean up
        loadingIndicator.style.display = 'none';
        startDownloadBtn.disabled = false;
        removeElement('#cobalt-quality-picker');
      });
    }

    // Function to initialize download button on YouTube video page
    function initializeDownloadButton() {
        injectDownloadButton();
        removeNativeDownloadButton();
    }

    // Initialize on page load
    if (isYouTubeWatchURL()) {
      setTimeout(() => {
          initializeDownloadButton();
      }, initialInjectDelay);
    }

    // Monitor URL changes using history API
    window.onpopstate = function(event) {
        setTimeout(() => {
            if (currentPageUrl !== window.location.href) {
                currentPageUrl = window.location.href;
                console.log('URL changed:', currentPageUrl);
                if (isYouTubeWatchURL()) {
                  initializeDownloadButton(); // Reinitialize download button on URL change
                }

                // Close the format/quality picker menu if a new video is clicked
                removeElement('#cobalt-quality-picker');
            }
        }, navigationInjectDelay);
    };

    // Monitor DOM changes using MutationObserver
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.target.classList.contains('html5-video-player')) {
                console.log('Video player changed');
                setTimeout(() => {
                    currentPageUrl = window.location.href;
                    if (isYouTubeWatchURL()) {
                      initializeDownloadButton(); // Reinitialize download button if video player changes
                    }
                }, navigationInjectDelay);

                // Close the format/quality picker menu if a new video is clicked
                removeElement('#cobalt-quality-picker');
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();