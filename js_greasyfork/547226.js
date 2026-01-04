// ==UserScript==
// @name          Mediux - Yaml Fixes
// @version       2.2.2
// @description   Adds fixes and functions to Mediux
// @author        Journey Over
// @license       MIT
// @match         *://mediux.pro/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @require       https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at        document-end
// @icon          https://www.google.com/s2/favicons?sz=64&domain=mediux.pro
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/547226/Mediux%20-%20Yaml%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/547226/Mediux%20-%20Yaml%20Fixes.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const logger = Logger('Mediux - Yaml Fixes', { debug: false });

  const MediuxFixes = {
    elements: {
      codeblock: null,
      buttons: {}
    },

    utils: {
      sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },

      isString(input) {
        return typeof input === 'string';
      },

      // Check for valid objects with properties (excludes null, arrays, empty objects)
      isNonEmptyObject(object) {
        return (
          typeof object === 'object' &&
          object !== null &&
          !Array.isArray(object) &&
          Object.keys(object).length > 0
        );
      },

      // Extract year from page elements, trying multiple selectors for reliability
      getYear() {
        const selectors = [
          'h1',
          'a[href*="/sets/"]',
          'a[href*="/shows/"]'
        ];

        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            const match = element.textContent.match(/\((\d{4})\)/);
            if (match) return match[1];
          }
        }
        return 'Unknown';
      },

      showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        const myleftDiv = document.querySelector('#myleftdiv');

        Object.assign(notification.style, {
          width: '50%',
          height: '50%',
          backgroundColor: 'rgba(200, 200, 200, 0.85)',
          color: 'black',
          padding: '20px',
          borderRadius: '5px',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1000',
          display: 'flex'
        });

        notification.innerText = message;
        $(myleftDiv).after(notification);

        setTimeout(() => {
          $(notification).remove();
        }, duration);
      },

      updateButtonState(button, success = true) {
        button.classList.remove('bg-gray-500');
        button.classList.add(success ? 'bg-green-500' : 'bg-red-500');

        setTimeout(() => {
          button.classList.remove('bg-green-500', 'bg-red-500');
          button.classList.add('bg-gray-500');
        }, 3000);
      },

      copyToClipboard(text) {
        return navigator.clipboard.writeText(text)
          .then(() => {
            this.showNotification('Results copied to clipboard!');
            return true;
          })
          .catch(error => {
            logger.error('Failed to copy: ', error);
            this.showNotification('Failed to copy to clipboard', 3000);
            return false;
          });
      }
    },

    data: {
      // Extract poster data from Next.js script tags by searching from end (newer scripts tend to be last)
      getPosters() {
        const regexPosterCheck = /posterCheck/g;
        const scriptElements = document.querySelectorAll('script');

        for (let index = scriptElements.length - 1; index >= 0; index--) {
          const element = scriptElements[index];
          if (regexPosterCheck.test(element.textContent)) {
            let scriptContent = element.textContent.replace('self.__next_f.push(', '');
            scriptContent = scriptContent.substring(0, scriptContent.length - 1);
            const jsonData = JSON.parse(scriptContent)[1].split('{"set":')[1];
            const fullJsonString = `{"set":${jsonData}`;
            const parsedData = JSON.parse(fullJsonString.substring(0, fullJsonString.length - 2));
            return parsedData.set.files;
          }
        }
        return [];
      },

      // Extract set data and store creator info for later use
      getSets() {
        const regexPosterCheck = /posterCheck/g;
        const scriptElements = document.querySelectorAll('script');

        for (let index = scriptElements.length - 1; index >= 0; index--) {
          const element = scriptElements[index];
          if (regexPosterCheck.test(element.textContent)) {
            let scriptContent = element.textContent.replace('self.__next_f.push(', '');
            scriptContent = scriptContent.substring(0, scriptContent.length - 1);
            const jsonData = JSON.parse(scriptContent)[1].split('{"set":')[1];
            const fullJsonString = `{"set":${jsonData}`;
            const parsedData = JSON.parse(fullJsonString.substring(0, fullJsonString.length - 2));
            GM_setValue('creator', parsedData.set.user_created.username);
            return parsedData.set.boxset.sets;
          }
        }
        return [];
      },

      getSet(setId) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://mediux.pro/sets/${setId}`,
            timeout: 30000,
            onload: (response) => {
              resolve(response.responseText);
            },
            onerror: () => {
              logger.error(`An error occurred loading set ${setId}`);
              reject(new Error('Request failed'));
            },
            ontimeout: () => {
              logger.error(`It took too long to load set ${setId}`);
              reject(new Error('Request timed out'));
            }
          });
        });
      }
    },

    yaml: {
      // Process entire boxset by fetching each set and generating YAML for all items
      async loadBoxset(codeblock) {
        const button = document.querySelector('#bsetbutton');
        let yamlOutput = codeblock.textContent + '\n';
        const sets = MediuxFixes.data.getSets();
        const creator = GM_getValue('creator');
        const startTime = Date.now();
        let elapsedTime = 0;
        let processedMovieTitles = [];

        codeblock.innerText = 'Processing... 0 seconds';

        const timerInterval = setInterval(() => {
          elapsedTime = Math.floor((Date.now() - startTime) / 1000);
          const latestMovies = processedMovieTitles.slice(-3).join(', ');
          codeblock.innerText = `Processing... ${elapsedTime} seconds\nRecent processed: ${latestMovies}`;
        }, 1000);

        try {
          for (const set of sets) {
            try {
              const response = await MediuxFixes.data.getSet(set.id);
              const responseWithoutEscapes = response.replaceAll('\\', '');

              const regexFiles = /"files":(\[{"id":.*?}]),"boxset":/s;
              const fileMatch = responseWithoutEscapes.match(regexFiles);

              if (fileMatch && fileMatch[1]) {
                let files;
                try {
                  files = JSON.parse(fileMatch[1]);
                } catch (error) {
                  logger.error('Error parsing filesArray:', error);
                  continue;
                }

                // Filter out collection posters and sort alphabetically
                const filteredFiles = files
                  .filter(file => !file.title.trim().endsWith('Collection'))
                  .sort((a, b) => a.title.localeCompare(b.title));

                for (const file of filteredFiles) {
                  if (file.movie_id !== null) {
                    const posterId = file.fileType === 'poster' && file.id.length > 0 ? file.id : 'N/A';
                    const movieId = MediuxFixes.utils.isNonEmptyObject(file.movie_id) ? file.movie_id.id : 'N/A';
                    const movieTitle = MediuxFixes.utils.isString(file.title) && file.title.length > 0 ? file.title.trimEnd() : 'N/A';

                    yamlOutput += `  ${movieId}: # ${movieTitle} Poster by ${creator} on MediUX.  https://mediux.pro/sets/${set.id}\n    url_poster: https://api.mediux.pro/assets/${posterId}\n    `;
                    processedMovieTitles.push(movieTitle);
                    logger(`Title: ${movieTitle}\nPoster: ${posterId}`);
                  } else if (file.movie_id_backdrop !== null) {
                    const backdropId = file.fileType === 'backdrop' && file.id.length > 0 ? file.id : 'N/A';
                    const movieId = MediuxFixes.utils.isNonEmptyObject(file.movie_id_backdrop) ? file.movie_id_backdrop.id : 'N/A';
                    yamlOutput += `url_background: https://api.mediux.pro/assets/${backdropId}\n\n`;
                    logger(`Backdrop: ${backdropId}\nMovie id: ${movieId}`);
                  }
                }
              }
            } catch (error) {
              logger.error(`Error processing set ${set.id}:`, error);
            }
          }
        } finally {
          clearInterval(timerInterval);
        }

        codeblock.innerText = 'Processing complete!';
        const copyLink = document.createElement('a');
        copyLink.href = '#';
        copyLink.innerText = 'Click here to copy the results';
        copyLink.style.color = 'blue';
        copyLink.style.cursor = 'pointer';

        copyLink.addEventListener('click', async (event_) => {
          event_.preventDefault();
          try {
            await navigator.clipboard.writeText(yamlOutput);
            codeblock.innerText = yamlOutput;
            MediuxFixes.utils.updateButtonState(button);
            MediuxFixes.utils.showNotification('Results copied to clipboard!');
          } catch (error) {
            logger.error('Failed to copy: ', error);
          }
        });

        codeblock.appendChild(copyLink);
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        logger(`Total time taken: ${totalTime} seconds`);
      },

      // Add missing season posters to YAML (seasons without explicit poster entries)
      fixPosters(codeblock) {
        const button = document.querySelector('#fpbutton');
        let yamlContent = codeblock.textContent;
        const posters = MediuxFixes.data.getPosters();

        const seasonPosters = posters.filter(poster => poster.title.includes('Season'));

        for (let seasonIndex in seasonPosters) {
          const matchingSeasonPosters = seasonPosters.filter(season => season.title.includes(`Season ${seasonIndex}`));
          if (matchingSeasonPosters.length > 0) {
            yamlContent += `      ${seasonIndex}:\n        url_poster: https://api.mediux.pro/assets/${matchingSeasonPosters[0].id}\n`;
          }
        }

        codeblock.innerText = yamlContent;
        navigator.clipboard.writeText(yamlContent)
          .then(() => {
            MediuxFixes.utils.showNotification('Results copied to clipboard!');
            MediuxFixes.utils.updateButtonState(button);
          });
      },

      // Fix Kometa TitleCard YAML by adding missing season numbers before episodes
      fixCards(codeblock) {
        const button = document.querySelector('#fcbutton');
        const yamlContent = codeblock.innerText;

        const regexSeasonsEpisodes = /(seasons:\n)(        episodes:)/g;
        const regexEpisodes = /(        episodes:)/g;

        if (regexSeasonsEpisodes.test(yamlContent)) {
          let seasonCounter = 1;
          const modifiedYaml = yamlContent.replace(regexEpisodes, (match) => {
            const newLine = `      ${seasonCounter++}:\n`;
            return `${newLine}${match}`;
          });

          codeblock.innerText = modifiedYaml;
          navigator.clipboard.writeText(modifiedYaml)
            .then(() => {
              MediuxFixes.utils.showNotification('Results copied to clipboard!');
              MediuxFixes.utils.updateButtonState(button);
            });
        } else {
          MediuxFixes.utils.showNotification('No card formatting needed');
        }
      },

      // Transform TV show YAML to Kometa-compatible format with proper metadata structure
      formatTvYml(codeblock) {
        const button = document.querySelector('#fytvbutton');
        let yamlContent = codeblock.textContent;

        const regexSetInfo = /(\d+): # TVDB id for (.*?)\. Set by (.*?) on MediUX\. (https:\/\/mediux\.pro\/sets\/\d+)/;

        const year = MediuxFixes.utils.getYear();

        const setMatch = yamlContent.match(regexSetInfo);
        if (setMatch) {
          const tvdbId = setMatch[1];
          const showTitle = setMatch[2];
          const setUrl = setMatch[4];

          yamlContent = yamlContent.replace(regexSetInfo, `# Posters from:\n# ${setUrl}\n\nmetadata:\n\n  ${tvdbId}: # ${showTitle} (${year})`);
        }

        yamlContent = yamlContent.replace(/^\s+# Posters from:/m, `# Posters from:`);
        yamlContent = yamlContent.replace(/(url_poster|url_background): (https:\/\/api\.mediux\.pro\/assets\/[a-z0-9\-]+)/g, '$1: "$2"');
        yamlContent = yamlContent.replace(/(\d+):\n\s+url_poster: (https:\/\/api\.mediux\.pro\/assets\/[a-z0-9\-]+)\n/g,
          (match, season, posterUrl) => `      ${season}:\n        url_poster: "${posterUrl}"\n`);

        codeblock.innerText = yamlContent;
        navigator.clipboard.writeText(yamlContent)
          .then(() => {
            MediuxFixes.utils.showNotification('YAML transformed and copied to clipboard!');
            MediuxFixes.utils.updateButtonState(button);
          });
      },

      // Transform movie YAML to Kometa format with standardized headers and URL quoting
      formatMovieYml(codeblock) {
        const button = document.querySelector('#fymoviebutton');
        let yamlContent = codeblock.textContent;

        const regexSetUrl = /https:\/\/mediux\.pro\/sets\/\d+/;
        const urlMatch = yamlContent.match(regexSetUrl);
        const setUrl = urlMatch ? urlMatch[0] : null;

        if (setUrl) {
          yamlContent = yamlContent.replace(
            /(\d+):\s*#\s*(.*?)\s*\((\d{4})\).*?(https:\/\/mediux\.pro\/sets\/\d+)/g,
            (match, movieId, movieTitle, releaseYear) => `${movieId}: # ${movieTitle.trim()} (${releaseYear})`
          );

          const yamlHeader = `# Posters from:\n# ${setUrl}\n\nmetadata:\n\n`;
          yamlContent = yamlContent.replace(/(^|\n)metadata:\n/g, '');
          yamlContent = yamlHeader + yamlContent;

          yamlContent = yamlContent
            .replace(/(url_poster|url_background): (https:\/\/api\.mediux\.pro\/assets\/\S+)/g, '$1: "$2"')
            .replace(/(\n\n)(\s+\n)/g, '\n\n')
            .replace(/\n{3,}/g, '\n\n');
        }

        codeblock.innerText = yamlContent;
        navigator.clipboard.writeText(yamlContent)
          .then(() => {
            MediuxFixes.utils.showNotification('YAML transformed and copied to clipboard!');
            MediuxFixes.utils.updateButtonState(button);
          });
      }
    },

    ui: {
      createInterface() {
        const codeblock = document.querySelector('code.whitespace-pre-wrap');
        MediuxFixes.elements.codeblock = codeblock;

        // Restructure page layout to make space for custom buttons
        const mainContainerDiv = document.querySelector('.flex.flex-col.space-y-1\\.5.text-center.sm\\:text-left');
        $(mainContainerDiv).children('h2, p').wrapAll('<div class="flex flex-row" style="align-items: center"><div id="myleftdiv" style="width: 25%; align: left"></div></div>');

        const leftContainerDiv = document.querySelector('#myleftdiv');

        const buttonConfigs = [{
            id: 'fcbutton',
            title: 'Fix missing season numbers in TitleCard YAML',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-puzzle w-5 h-5"><path d="M7 2h10"></path><path d="M5 6h14"></path><rect width="18" height="12" x="3" y="10" rx="2"></rect></svg>',
            action: () => MediuxFixes.yaml.fixCards(codeblock)
          },
          {
            id: 'fpbutton',
            title: 'Fix missing season posters YAML',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image w-5 h-5"><path d="M2 7v10"></path><path d="M6 5v14"></path><rect width="12" height="18" x="10" y="3" rx="2"></rect></svg>',
            action: () => MediuxFixes.yaml.fixPosters(codeblock)
          },
          {
            id: 'bsetbutton',
            title: 'Generate YAML for associated boxset',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 7v10"></path><path d="M11 7v10"></path><path d="m15 7 2 10"></path></svg>',
            action: () => MediuxFixes.yaml.loadBoxset(codeblock)
          },
          {
            id: 'fytvbutton',
            title: 'Format TV show YAML for Kometa',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tv w-5 h-5"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
            action: () => MediuxFixes.yaml.formatTvYml(codeblock)
          },
          {
            id: 'fymoviebutton',
            title: 'Format Movie YAML for Kometa',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-film-reel w-5 h-5"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"></circle><line x1="12" y1="4" x2="12" y2="20"></line><line x1="4" y1="12" x2="20" y2="12"></line><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"></circle></svg>',
            action: () => MediuxFixes.yaml.formatMovieYml(codeblock)
          }
        ];

        const buttonContainer = $('<div id="extbuttons" class="flex flex-row" style="margin-top: 10px"></div>');

        for (const [index, config] of buttonConfigs.entries()) {
          const $buttonElement = $(`<button id="${config.id}" title="${config.title}" class="duration-500 py-1 px-2 text-xs bg-gray-500 text-white rounded flex items-center justify-center focus:outline-none"${index > 0 ? ' style="margin-left:10px"' : ''}>${config.icon}</button>`);
          $buttonElement.on('click', config.action);
          buttonContainer.append($buttonElement);
          MediuxFixes.elements.buttons[config.id] = $buttonElement[0];
        }

        $(leftContainerDiv).append(buttonContainer);
        $(leftContainerDiv).parent().append('<div style="width: 25%;"></div>');
      }
    },

    init() {
      waitForKeyElements('code.whitespace-pre-wrap', () => {
        this.ui.createInterface();
        logger('Initialized');
      });
    }
  };

  MediuxFixes.init();

  // Utility function to wait for dynamically loaded elements in Next.js SPA
  function waitForKeyElements(
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
  ) {
    var targetElements, targetsFound;

    targetElements = typeof iframeSelector == 'undefined' ? jQuery(selectorTxt) : jQuery(iframeSelector).contents()
      .find(selectorTxt);

    if (targetElements && targetElements.length > 0) {
      targetsFound = true;
      targetElements.each(function() {
        var $currentElement = jQuery(this);
        var alreadyProcessed = $currentElement.data('alreadyFound') || false;

        if (!alreadyProcessed) {
          var shouldCancel = actionFunction($currentElement);
          if (shouldCancel)
            targetsFound = false;
          else
            $currentElement.data('alreadyFound', true);
        }
      });
    } else {
      targetsFound = false;
    }

    var controlObject = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, '_');
    var intervalId = controlObject[controlKey];

    if (targetsFound && bWaitOnce && intervalId) {
      clearInterval(intervalId);
      delete controlObject[controlKey]
    } else {
      if (!intervalId) {
        intervalId = setInterval(function() {
            waitForKeyElements(selectorTxt,
              actionFunction,
              bWaitOnce,
              iframeSelector
            );
          },
          300
        );
        controlObject[controlKey] = intervalId;
      }
    }
    waitForKeyElements.controlObj = controlObject;
  }

})();
