// ==UserScript==
// @name         Modern Roblox Blue
// @namespace    https://roblox.com
// @version      August 25, 2024
// @description  A blue theme for roblox, with a few extra features
// @author       pooiod7
// @match        https://www.roblox.com/*
// @match        https://pooiod7.neocities.org/projects/roblox/theme/blue/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524857/Modern%20Roblox%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/524857/Modern%20Roblox%20Blue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;
    var versionid = "8351"; // set to false to ignore all updates

    function handleVisibilityChange() {
        if (document.hidden) {
            document.querySelector("link[rel='icon']").href = "https://tr.rbxcdn.com/c8986bcf48ca871a877a77ef8d2feac5/420/420/Decal/Png";
        } else {
            document.querySelector("link[rel='icon']").href = "https://tr.rbxcdn.com/3be92caaf1c2b3c62b55adacbeab6391/420/420/Decal/Png";
        }
        if (currentUrl === 'https://pooiod7.neocities.org/projects/roblox/theme/blue/') {
            document.querySelector("link[rel='icon']").href = "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/3/2/0327107c890e461c1417bc00631e460b1114b38d.png";
        }
    }

    if (window.location.href.indexOf("roblox.com") !== -1){
        document.head.appendChild(Object.assign(document.createElement('link'), {rel: 'stylesheet', type: 'text/css', href: 'https://pooiod7.neocities.org/projects/roblox/theme/blue/style.css'}));
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    handleVisibilityChange();

    var ispage = currentUrl.indexOf("/users/") !== -1 && currentUrl.indexOf("/favorites/") !== -1 && currentUrl.indexOf("?embed=full") !== -1 !== -1 && currentUrl.indexOf('#!/places') !== -1;
    var ispage2 = currentUrl.indexOf("/users/") !== -1 && currentUrl.indexOf("/favorites") !== -1;

    if (currentUrl === 'https://www.roblox.com/discover#/sortName/v2/Favorites' || currentUrl === 'https://www.roblox.com/charts#/sortName/v2/Favorites') {
        const linkElement = document.querySelector('#right-navigation-header > div.navbar-right.rbx-navbar-right > ul > div.age-bracket-label.text-header.btr-nav-header_agebracket > a')
        || document.querySelector('#navigation > ul > li:nth-child(1) > a');

        if (linkElement) {
            const link = linkElement.href;
            const numbers = link.match(/\d+/);

            if (numbers) {
                const newLink = `https://www.roblox.com/users/${numbers[0]}/favorites/?embed=full/#!/places`;
                window.location.href = newLink;
            } else {
                console.warn('No profile found');
            }
        } else {
            console.log('Not logged in (can\'t show favorites page)');
        }
    } else if (ispage) {
        history.replaceState({}, "", "/discover#/sortName/v2/Favorites");
        //history.pushState(null, null, "https://www.roblox.com/discover#/sortName/v2/Favorites");
    } else if (currentUrl === 'https://pooiod7.neocities.org/projects/roblox/theme/blue/') {
        window.onload = function() {
            console.log("checking for blue theme updates")
            var needsupdate = false;
            if (document.getElementById('versionid')) {
                needsupdate = document.getElementById('versionid').innerText != versionid && versionid != false;
            } else {
                needsupdate = false;
            }
            var downloadButton = document.getElementById("download");
            if (needsupdate) {
                if (downloadButton) {
                    downloadButton.textContent = "Update Theme";
                    downloadButton.style.outline = "2px solid orange";
                }
            } else {
                if (downloadButton) {
                    downloadButton.textContent = "Reinstall Theme";
                }
            }
            console.log(needsupdate);
            window.parent.postMessage({ type: "needsupdatethemethingepic", dat: (needsupdate) }, "*");
        };
    } else {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://pooiod7.neocities.org/projects/roblox/theme/blue/';
        iframe.style.display = 'none';

        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'needsupdatethemethingepic') {
                console.log("Blue theme needs update = "+event.data.dat);
                iframe.parentNode.removeChild(iframe);
                if (event.data.dat) {
                    var link = document.createElement('a');
                    link.href = 'https://pooiod7.neocities.org/projects/roblox/theme/blue/theme.user.js';
                    link.click();
                }
            }
        });

        document.body.appendChild(iframe);
    }

    window.onload = function() {

        if (document.querySelector('#nav-blog > span')) {
            document.querySelector('#nav-blog > span').textContent = 'Favorites';
            document.getElementById('nav-blog').href = 'https://www.roblox.com/discover#/sortName/v2/Favorites';
            document.getElementById('nav-blog').target = '_self';
        }

        setTimeout(function () {

            var favoritesContainer = document.querySelector('#favorites-container > favorites > div > h1');
            if (favoritesContainer && ispage2) {
                favoritesContainer.style.display = 'inline-block';

                var seeAllLink = document.createElement('a');
                seeAllLink.setAttribute('onclick', ` var loadstop = false;
                function navigatePages(buttonSelector, times) {
                  const button = document.querySelector(buttonSelector);

                  function clickAndWait() {
                      return new Promise((resolve) => {
                          button.click();
                          setTimeout(resolve, 10);
                      });
                  }

                  async function clickMultipleTimes() {
                      for (let i = 0; i < Math.abs(times); i++) {
                          await clickAndWait();
                          const startTime = Date.now();
                          await waitForButtonEnabled(startTime);
                          updateProgressBar(i + 1, Math.abs(times));
                      }
                  }

                  function waitForButtonEnabled(startTime) {
                      return new Promise((resolve, reject) => {
                          const intervalId = setInterval(() => {
                              if (!button.disabled || loadstop) {
                                  clearInterval(intervalId);
                                  resolve();
                              } else if (Date.now() - startTime > 5000) {
                                  loadstop = true;
                                  clearInterval(intervalId);
                                  resolve();
                              }
                          }, 10);
                      });
                  }

                  function updateProgressBar(current, total) {
                      const progress = (current / total) * 100;
                      progressBar.value = progress;
                  }

                  const loadingScreen = document.createElement('div');
                  loadingScreen.style.position = 'fixed';
                  loadingScreen.style.top = '0';
                  loadingScreen.style.left = '0';
                  loadingScreen.style.width = '100%';
                  loadingScreen.style.height = '100%';
                  loadingScreen.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                  loadingScreen.style.display = 'flex';
                  loadingScreen.style.flexDirection = 'column';
                  loadingScreen.style.justifyContent = 'center';
                  loadingScreen.style.alignItems = 'center';

                  document.body.style.overflow = 'hidden';

                  const progressBarContainer = document.createElement('div');
                  progressBarContainer.style.position = 'relative';
                  progressBarContainer.style.left = '50px';

                  const progressBar = document.createElement('progress');
                  progressBar.style.width = '200px';
                  progressBar.style.height = '20px';
                  progressBar.value = 0;
                  progressBar.max = 100;

                  let scrollInterval;

                  function startScrollLoop() {
                    function scrollDown() {
                      window.scrollBy(0, 1);
                    }
                    scrollInterval = setInterval(scrollDown, 10);
                  }

                  function stopScrollLoop() {
                    clearInterval(scrollInterval);
                    window.scrollTo(0, 0);
                  }

                  startScrollLoop();

                  progressBarContainer.appendChild(progressBar);
                  loadingScreen.appendChild(progressBarContainer);
                  document.body.appendChild(loadingScreen);

                  clickMultipleTimes()
                      .then(() => {
                          document.body.style.overflow = 'auto';
                          document.body.removeChild(loadingScreen);
                          stopScrollLoop();
                      })
                      .catch((error) => {
                          console.error('An error occurred:', error);
                          document.body.style.overflow = 'auto';
                          document.body.removeChild(loadingScreen);
                          stopScrollLoop();
                      });
              }

              function changePage(pages) {
                  const forwardsButtonSelector = '#favorites-container > favorites > div > assets-explorer > div > div > div.tab-content.rbx-tab-content > div > div.pager-holder > ul > li.pager-next > button';
                  const backwardsButtonSelector = '#favorites-container > favorites > div > assets-explorer > div > div > div.tab-content.rbx-tab-content > div > div.pager-holder > ul > li.pager-prev > button';

                  if (pages > 0) {
                      navigatePages(forwardsButtonSelector, Math.min(Math.max(pages, -100), 100));
                  } else if (pages < 0) {
                      navigatePages(backwardsButtonSelector, Math.min(Math.max(pages, -100), 100));
                  }
              }

              changePage(window.prompt("Warp by how many pages?"));`);

                seeAllLink.textContent = 'Page warp';
                seeAllLink.style.position = 'relative';
                seeAllLink.style.float = 'right';
                seeAllLink.style.marginRight = '3.5%';
                if (currentUrl.indexOf('embed') !== -1) {
                    seeAllLink.style.top = '40px';
                } else {
                    seeAllLink.style.top = '10px';
                }

                favoritesContainer.insertAdjacentElement('afterend', seeAllLink);
            }

            if (ispage) {
                var favoritesContainer = document.querySelector('#favorites-container > favorites > div > assets-explorer > div > div > div.menu-vertical-container.category-tabs.ng-scope');
                if (favoritesContainer) {
                    favoritesContainer.parentNode.removeChild(favoritesContainer);
                }

                document.querySelector('#favorites-container > favorites > div > h1').style.marginTop = '20px';

                var pagestext = document.querySelector('#favorites-container > favorites > div > assets-explorer > div > div > div.tab-content.rbx-tab-content > div > div.container-header.place-header');
                if (pagestext) {
                    pagestext.parentNode.removeChild(pagestext);
                }

                var tabContent = document.querySelector('#favorites-container > favorites > div > assets-explorer > div > div > div.tab-content.rbx-tab-content');
                if (tabContent) {
                    tabContent.style.width = "100%";
                }

                var pagerNextButton = document.querySelector("#favorites-container > favorites > div > assets-explorer > div > div > div.tab-content.rbx-tab-content > div > div.pager-holder > ul > li.pager-next > button");
                var pagerPrevButton = document.querySelector("#favorites-container > favorites > div > assets-explorer > div > div > div.tab-content.rbx-tab-content > div > div.pager-holder > ul > li.pager-prev > button");

                if (pagerNextButton) {
                    pagerNextButton.addEventListener("click", function() {
                        window.scrollTo({ top: 0});
                    });
                }

                if (pagerPrevButton) {
                    pagerPrevButton.addEventListener("click", function() {
                        window.scrollTo({ top: 0});
                    });
                }

                function processElements() {
                    var allElements = document.querySelectorAll("*");
                    allElements.forEach(function(element) {
                        if (element.childNodes.length === 1 && element.firstChild.nodeType === Node.TEXT_NODE && element.textContent.includes("Offsale")) {
                            element.parentNode.removeChild(element);
                        }
                    });
                }

                setInterval(processElements, 1000);

            }
        }, 500);
    };
})();
