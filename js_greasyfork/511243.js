// ==UserScript==
// @name         Qbit Dead Trackers Highlighter
// @namespace    http://tampermonkey.net/
// @version      2024-10-03
// @description  Qbit Dead Trackers Highlighter1
// @author       Vondsa
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/qbittorrent/qBittorrent/refs/heads/master/src/icons/qbittorrent.ico
// @grant        GM_xmlhttpRequest
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511243/Qbit%20Dead%20Trackers%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/511243/Qbit%20Dead%20Trackers%20Highlighter.meta.js
// ==/UserScript==

function waitForElement(selector, callback) {
    const checkElement = () => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 1) {
        callback(elements);
      } else {
        setTimeout(checkElement, 500);
      }
    };
    checkElement();
  }


function fetchICON(url, method = "GET", timeout = 30000) {
    return new Promise((resolve, reject) => {
        // Construct the favicon URL

        GM_xmlhttpRequest({
            headers: {
                "Accept": "image/x-icon,image/png,image/jpeg,image/gif,image/svg+xml,*/*;q=0.8",
            },
            method: method,
            url: url,
            timeout,
            responseType: 'blob',
            ontimeout: function() {
                reject(new Error(`Request timed out after ${timeout}ms`));
            },
            onerror: function(err) {
                reject(err ? err : new Error('Failed to fetch'));
            },
            onload: function(response) {
                if (response.status === 200) {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(response.response);
                } else {
                    reject(new Error(`Failed to fetch favicon, status: ${response.status}`));
                }
            }
        });
    });
}

  (function() {
      'use strict';

      if (!document.title.startsWith("qBittorrent")) {
          return;
      }
      const currentUrl = document.URL;


      // Favicons
      function stripUnnec(text) {
      return text.replace(/\s*\(\d+\)\s*/g, '');
      }

      waitForElement("#trackerFilterList > li > a", (trackerFilterList) => {
          trackerFilterList.forEach(tracker=> {
              const trackerText = tracker.text;
              if (!trackerText.startsWith("All ") && !trackerText.startsWith("Trackerless ")) {
                  var strippedTracker = stripUnnec(trackerText);

                  try {
                      if (!strippedTracker.startsWith("http")) {
                          strippedTracker = "https://" + strippedTracker;
                      }

                      var trackerBaseUrl = (new URL(strippedTracker)).hostname.split('.').slice(-2).join('.');
                      if (trackerBaseUrl.length <= 5) {
                          trackerBaseUrl = strippedTracker;
                      }
                  } catch (error) {
                      console.log(`An error Occured: ${error}`);
                      trackerBaseUrl = strippedTracker;
                  }

                  console.log(trackerBaseUrl);
                  const faviconUrl = `http://${trackerBaseUrl}/favicon.ico`;
                  const trackerLogoElement = tracker.firstChild;

                  fetchICON(faviconUrl)
                      .then(base64Icon => {
                      trackerLogoElement.src = base64Icon;
                      console.log(base64Icon);
                  })
                      .catch(error => {
                      console.log(error);
                      const faviconUrlNew = `http://www.${trackerBaseUrl}/favicon.ico`;
                      fetchICON(faviconUrlNew)
                      .then(base64Icon => {
                          trackerLogoElement.src = base64Icon;
                          console.log(base64Icon);
                      }).catch(error => {console.error(error);}
                  )});
              }

          })
      });

      // Highliter
      const mochaToolbarID = "mochaToolbar";
      const mochaToolbar = document.getElementById(mochaToolbarID);
      let isActive = false;

      if (mochaToolbar) {


          const button = document.createElement("a");
          button.style.color = "#e60";
          button.style.textDecoration = null;
          button.style.cursor = "pointer";
          button.id = "deadTrackersButton";
          button.className = "divider";


          const img = document.createElement("img");
          img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAHYAAAB2AH6XKZyAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAA4NJREFUeJzl2k+IVWUYx/HP1Rm10iQRQQYkWhRIhODOjeVCSZpVOxct27axRZuoVu7SvasiauHOTVmZRKEgtAmRIYj+UdogWTP2B8Npcd6ZLtdzz3nuzPnr/cEDF+59n/M853x/73vOue9AO9qG/XgCK/gW1/F3S/U0pt04jd9ljQ/HbbydfvPAaRNewqL7Gx+N3/AKNrdSaQ06iCvKGx+Nr3CohXor0y6cwb8mb3417uEd7Gm49g1pEtyj0RtbrBf33tuiCtx7aYs6cO+NLerGvbO2aBL3TtmiTdxbt8VBXO5Ag43boou4N2KLPuAejYlt0Tfco1Fqiz7jHo1cWwzwMm51oMCm4lbqGbzZgYLaitcH6WzsMp1a3CQ7E1OrzXgIz7ZcR1s6tfphqifBVU3tMjiqqb0RGtZU3woPq8+2qPQdQd9ssa7H4ccwU/B9H2wRwX0m9bqmfbiaEtzEq5gtSNBFW0Rwn0293UxjrqbefZST8BqOFCSjXy9Fj6SeRsdegKWC5B9griBx11+Lz6UexuVYgi9LDrSEk7pjiyjuJxVf3BV8AU/jx8CBu2CLjeA+Gj+l3sEjeAP/BAaelyaPMWrrz9G9MjLuleS6K6N1Z16Sp/BxoKA76YRtLSioqb/HZ2QnJ2/XyWh8jmcKcq1pHj8EEi7gWEmuOjdIHMbXgVy/yKgclLf+v9qyRWO4R1WlLXbjLdzIGX8jfVe0SaoW3KOaF1stIrbYigN4McUBbCkZUyvuUVVpi6hqx30n3sev+AxHA2MmtUXZ1c1THbgfxUV8h7PYDu/lJDwndvWqtMWwqsZ9X+ppdPy7ZNtT85Iv4zXlV69KW1SN+5bUw/KYPLfh+5KDLajWFsvut0VduC+U5LoGL+DPwIHrskVTuI/GX4Zs+SQ+DAyKrPVkaJ6WoVqWsyzuplxluM/KKPojkPOSoQehYc0rt8QKvsHzJQURt8VGcX9O7AnwZwGKHpZd5XGT43Ccx+OBAqO2mBT3OdmkGaHoDB4N1Lqmqm0RWS2is3sluEfVlC1awT2qqm0xwAl8kuJEoNBacY+qaltE1CjuUVVti3FqBfeo6lgtVtUJ3KOq0hadxD2qSWxxPGd89HV2K7hHtR5b9Ar3qPbjUzFb3An87mLK2TtFbdFL3KOaxBa9xD2q6GpxScdm96o1zhYPBO5RbZft0lxMcQo72ijkP4XWx8MUjf5NAAAAAElFTkSuQmCC';
          img.className = "mochaToolButton";
          img.title = "Check for Dead Trackers...";
          img.alt = "Check for Dead Trackers...";
          img.width = 24;
          img.height = 24;

          button.appendChild(img);

          mochaToolbar.appendChild(button);
          console.log("Added deadTrackersButton Button");

          button.addEventListener("click", async (event) => {
              event.preventDefault();
              console.log("Starting Fetching Dead Trackers");

              if (isActive) return;
              isActive = true;
              button.style.pointerEvents = "none";
              button.style.opacity = "0.5";


              const torrents = document.querySelectorAll(".torrentsTableContextMenuTarget");
              for (const torrent of torrents) {
                  const torrentHash = torrent.rowId;
                  torrent.style.color = "brown";

                  const buttonFirstTd = torrent.querySelector("td:nth-child(2)");
                  buttonFirstTd.style.backgroundColor = "inherit";

                  const url = `${currentUrl}api/v2/torrents/trackers?hash=${torrentHash}`;

                  try {
                      const response = await fetch(url);
                      if (!response.ok) {
                          throw new Error("Can't Connect to API..., Response not OK");
                      }

                      const data = await response.json();
                      for (const dict of data) {
                          if (dict.msg != "This torrent is private"
                              && dict.msg != ""
                              && !dict.msg.startsWith("Rate limit exceeded")
                              && !dict.msg.startsWith("Download slot limit reached")
                              && !dict.msg.startsWith("Your slot limit is reached")
                          ) {
                              // torrent.style.backgroundColor = "red";
                              buttonFirstTd.style.backgroundColor = "red";

                          }
                      }
                  } catch (error) {
                      console.error('Error fetching data:', error);
                  } finally {
                      torrent.style.color = "";
                  }
              }
              console.log("Finished...")
              isActive = false;
              button.style.pointerEvents = "auto";
              button.style.opacity = "1";
          })

      } else {
          console.log(`Can't find '${mochaToolbar}'.`);
          return;
      }


  })();