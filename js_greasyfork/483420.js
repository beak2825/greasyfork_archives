// ==UserScript==
// @name         PlexBoxd-Letterboxd Integration for Plex
// @namespace    http://tampermonkey.net/
// @description  Add Letterboxd link and rating to its corresponding Plex film's page
// @author       CarnivalHipster
// @match        https://app.plex.tv/*
// @match        http://localhost:32400/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @license 	 MIT
// @grant        GM_xmlhttpRequest
// @connect      letterboxd.com
// @version 	 2.11.0

// @downloadURL https://update.greasyfork.org/scripts/483420/PlexBoxd-Letterboxd%20Integration%20for%20Plex.user.js
// @updateURL https://update.greasyfork.org/scripts/483420/PlexBoxd-Letterboxd%20Integration%20for%20Plex.meta.js
// ==/UserScript==
//2.11.0 Changes: Added functionnality to go to actors and producers pages
//TODO: Account for alternative titles in letterboxd. It should look in those if the plex title is included.
//Edge cases:
//Unstoppable Family : has an alternative title on Letterboxd
//Vietnam: A Television History is a tv show logged as movie in Tmdb so doesn't get an icon
//Todd McFarlane's Spawn is the same, so I should not rely on tmdb
//Directors that are very unknown such as Clive Gordon don't get the icon, don't know why, maybe because they dont have birthdays
//Also those directors pages makes the script stop after getting the title for unknown reasons
//Pluto 2023 tv show doesn't get matched because there is already a film called pluto 2023. the url is pluto-2023-1, Same for Swarm 2023
//Awaken from Tom Lowe is 2018 on Letterboxd but 2021 on Plex so causes infinite loop
//HALFSOLVED - South from hell show (2015) causes infinite loop and has the line This is not a tv show page. Changed the hasSeries to check for Series
//SOLVED - Ennio Morricone has a movie named after him so it gets matched instead of the director page and causes infinite loop
//SOLVED - I never thought about actors, so only director's page are considered, which gives actors a link to their director's pages
//SOLVED - Films that have both same year and name and one of them has no directors like Cargo 2006 and Cargo 2006 by Clive Gordon
//SOLVED - The Shining has a bug on letterboxd where the-shining-1980 links to the-shining-1997
//SOLVED - Mob Psycho 100 has 2 tv shows by the same director so one gets wrongly matched even tho they are 2016 and 2018.
//Letterboxd api will make all this obsolete so its not really worth the time.

//README: The UI langauge should be english.
(function() {
    'use strict';
    const letterboxdImg = 'https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com';
    const globalParser = new DOMParser();
    var lastTitle = undefined;
    var lastYear = undefined;
    var lastDirector = undefined;
    var lastSubtitle = undefined;
    var currentUrl = window.location.href;

    function checkForPageChange() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            lastTitle = undefined;
            lastYear = undefined;
            lastDirector = undefined;
            console.log('Page change detected, global state reset.');
            return true;
        }
        return false; 
    }

    function isPersonsPage() {
        return /^(director|actor|writer|cinematographer|producer|composer|editor)$/.test(lastSubtitle);
    }

    function extractTitleAndYear() {
        const titleElement = document.querySelector('h1[data-testid="metadata-title"]');
        const yearElement = document.querySelector('span[data-testid="metadata-line1"]');

        if (titleElement) {
            const title = titleElement.textContent.trim() || titleElement.innerText.trim();
            if (title !== lastTitle) {
                lastTitle = title;
                console.log('The title is:', lastTitle);
            }
        } else {
            lastTitle = ''; // Reset if no title is found
        }

        if (yearElement) {
            const text = yearElement.textContent.trim() || yearElement.innerText.trim();
            const match = text.match(/\b\d{4}\b/);
            if (match && match[0] !== lastYear) {
                lastYear = match[0];
                console.log('The year is:', lastYear);
            }
        } else {
            lastYear = ''; // Reset if no year is found
        }
    }

    function extractSubtitle() {
        const subtitleElement = document.querySelector('h2[data-testid="metadata-subtitle"]');
    
        if (subtitleElement) {
            const subtitle = subtitleElement.textContent.trim() || subtitleElement.innerText.trim();
            let firstWord = subtitle.split(' ')[0];
            firstWord = firstWord.replace(/[,;:.!?]/g, '');
            firstWord = firstWord.toLowerCase();
            //console.log('The subtitle is:', firstWord);
            lastSubtitle = firstWord;
            return firstWord;
        }else {
            lastSubtitle = undefined;
    
        }
    }

    function extractDirectorFromPage() {
        const directedByText = 'Directed by';
        const spans = Array.from(document.querySelectorAll('span'));

        const directorSpan = spans.find(span => span.textContent.includes(directedByText));
        if (directorSpan) {
            const directorLink = directorSpan.parentElement.querySelector('a');
            if (directorLink) {
                const directorName = directorLink.textContent.trim();
                if (directorName && directorName !== lastDirector) {
                    lastDirector = directorName;
                    console.log('Director in Plex: ', lastDirector);
                }
            }
        } else {
            if (lastDirector !== undefined) {
                lastDirector = '';
                //console.log('The director has been reset.');
            }
        }
    }

    function checkLink(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'HEAD',
                url: url,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve({url: url, status: response.status, accessible: true});
                    } else {
                        resolve({url: url, status: response.status, accessible: false});
                    }
                },
                onerror: function() {
                    reject(new Error(url + ' could not be reached or is blocked by CORS policy.'));
                }
            });
        });
    }

    function updateOrCreateLetterboxdIcon(link, rating) {
        let metadataElement = document.querySelector('div[data-testid="metadata-ratings"]');
        if (!metadataElement) {
            metadataElement = document.querySelector('div[data-testid="metadata-children"]');
        }

        const existingContainer = document.querySelector('.letterboxd-container');

        if (existingContainer) {
            existingContainer.querySelector('a').href = link;
            const ratingElement = existingContainer.querySelector('.letterboxd-rating');
            if (ratingElement) {
                ratingElement.textContent = rating;
            }
        } else if (metadataElement) {
            const container = document.createElement('div');
            container.classList.add('letterboxd-container');
            container.style.cssText = 'display: flex; align-items: center; gap: 8px;';

            const icon = document.createElement('img');
            icon.src = letterboxdImg;
            icon.alt = 'Letterboxd Icon';
            icon.style.cssText = 'width: 24px; height: 24px; cursor: pointer;';

            const ratingText = document.createElement('span');
            ratingText.classList.add('letterboxd-rating');
            ratingText.textContent = rating;
            ratingText.style.cssText = 'font-size: 14px;'; // Style as needed

            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.appendChild(icon);

            container.appendChild(linkElement);
            container.appendChild(ratingText);
            metadataElement.insertAdjacentElement('afterend', container);
        }
    }

    function buildDefaultLetterboxdUrl(title, year) {
        const normalizedTitle = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const titleSlug = normalizedTitle.trim().toLowerCase()
        .replace(/&/g, 'and')
        .replace(/-/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
        if (isPersonsPage()) {
            const letterboxdBaseUrl = 'https://letterboxd.com/'+ lastSubtitle + '/';
            return `${letterboxdBaseUrl}${titleSlug}/`;
        } else {
            const letterboxdBaseUrl = 'https://letterboxd.com/film/';
            return `${letterboxdBaseUrl}${titleSlug}-${year}/`;
        }
    }

    function removeYearFromUrl(url) {
        const yearPattern = /-\d{4}(?=\/$)/;
        return url.replace(yearPattern, '');
    }

    function replaceFilmWithWord(url, suffix) {
        return url.replace('film', suffix);
    }

    function addSuffixBeforeLastSlash(url, suffix) {
        return url.replace(/\/$/, `-${suffix}/`);
    }

    function buildLetterboxdUrl(title, year) {
        let defaultUrl = buildDefaultLetterboxdUrl(title, year);
        return checkLink(defaultUrl).then(result => {
            if (result.accessible) {
                console.log(result.url, 'is accessible, status:', result.status);
                return result.url;
            } else {
                console.log(result.url, 'is not accessible, status:', result.status);
                let yearRemovedUrl = removeYearFromUrl(result.url);
                console.log('Trying URL without year:', yearRemovedUrl);
                return checkLink(yearRemovedUrl).then(yearRemovedResult => {
                    if (yearRemovedResult.accessible) {
                        console.log(yearRemovedUrl, 'is accessible, status:', yearRemovedResult.status);
                        return yearRemovedUrl;
                    } else {
                        console.log(yearRemovedUrl, 'is not accessible, status:', yearRemovedResult.status);
                        let personUrl = replaceFilmWithWord(yearRemovedUrl, lastSubtitle);
                        console.log('Trying person URL:', personUrl);
                        return checkLink(personUrl).then(result =>{
                        if (result.accessible){
                            console.log(result.url, 'is accessible, status:', result.status);
                            return personUrl;
                        }else{
                            console.log(result.url, 'is not accessible, status:', result.status);
                        }
                        });
                    }
                });
            }
        }).catch(error => {
            console.error('Error after checking both film and year:', error.message);
            let newUrl = removeYearFromUrl(defaultUrl);
            return newUrl;
        });
    }

    function fetchLetterboxdPage(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            //console.log(response.responseText);
                            const doc = globalParser.parseFromString(response.responseText, "text/html");
                            resolve(doc);
                        } catch (parseError) {
                            reject(new Error('Error parsing Letterboxd page: ' + parseError.message));
                        }
                    } else {
                        reject(new Error('Failed to load Letterboxd page, status: ' + response.status));
                    }
                },
                onerror: function() {
                    reject(new Error('Network error while fetching Letterboxd page'));
                }
            });
        });
    }
    

    function roundToOneDecimal(numberString) {
        const number = parseFloat(numberString);
        return isNaN(number) ? null : (Math.round(number * 10) / 10).toFixed(1);
    }

    function extractRating(doc) {
        const ratingElement = doc.querySelector('meta[name="twitter:data2"]');
        if (ratingElement && ratingElement.content) {
            const match = ratingElement.getAttribute('content').match(/\b\d+\.\d{1,2}\b/);
            if (match) {
                return roundToOneDecimal(match[0]);
            }
        } else {
            console.log('Rating element not found.');
            return null;
        }
    }

    function extractYearFromMeta(doc) {
        const metaTag = doc.querySelector('meta[property="og:title"]');
        if (metaTag) {
            const content = metaTag.getAttribute('content');
            const yearMatch = content.match(/\b\d{4}\b/);
            if (yearMatch) {
                console.log('The year on Letterboxd is : ' + yearMatch[0]);
                return yearMatch[0];
            } else {
                console.log('Year not found in the html');
                return null;
            }
        } else {
            console.log('Meta tag not found in the html');
            return null;
        }
    }

    function extractDirectorFromMeta(doc) {
        const directorMetaTag = doc.querySelector('meta[name="twitter:data1"]');
        if (directorMetaTag && directorMetaTag.content) {
            console.log('The Director on Letterboxd is: ' + directorMetaTag.content);
            return directorMetaTag.content;
        } else {
            console.log('Director not found.');
            return undefined;
        }
    }


    function subtractYearFromUrl(url, lastYear) {
        const yearPattern = /-(\d{4})\/$/;
        const match = url.match(yearPattern);

        if (match) {
            const year = parseInt(match[1], 10) - 1;
            return url.replace(yearPattern, `-${year}/`);
        } else {
            const previousYear = parseInt(lastYear, 10) - 1;
            return url.replace(/\/$/, `-${previousYear}/`);
        }
    }

    async function checkPlexLetterboxdSeriesMismatch(doc, hasSeries) {
        if (hasSeries) {
            const isLetterboxdTvShow = doc.querySelector('a[href*="themoviedb.org/tv/"]') != null;
            if (!isLetterboxdTvShow) {
                console.log(`Plex categorized as a TV show but Letterboxd is on a movie or director page.`);
                console.log(`Icon creation aborted.`);
                return false;
            }
        }
        return true;
    }

    function isPersonsLetterboxdPage(url) {
        return /^https:\/\/letterboxd\.com\/(director|actor|writer|cinematographer|producer|composer|editor)/.test(url);
    }

    
    async function handlePersonsPage(url) {
        if (isPersonsLetterboxdPage(url)) {
            updateOrCreateLetterboxdIcon(url, 'Letterboxd');
            return true;
        }
        return false;
    }

    async function handleMismatch(url, yearInHtml, directorInHtml, doc, hasSeries) {
        if (yearInHtml != lastYear || (!directorInHtml.includes(lastDirector) && !hasSeries)) {
            console.log(`Either the year on Plex [${lastYear}] is different from the year on Letterboxd [${yearInHtml}] or ` +
            `The director on Plex [${lastDirector}] isn't one of the directors from Letterboxd [${directorInHtml}]`);
    
            if (!hasSeries && !directorInHtml.includes(lastDirector) && directorInHtml != undefined) {
                console.log(`This is not a tv show page.`);
                console.log(`The director on Plex [${lastDirector}] is different from the director on Letterboxd [${directorInHtml}]`);
                let subtractedYearUrl = subtractYearFromUrl(url, lastYear);
                console.log('Trying subtracted year url: ' + subtractedYearUrl);
                let result = await checkLink(subtractedYearUrl);
                if (result.accessible) {
                    console.log(subtractedYearUrl, 'Url with subtracted year is accessible, status:', result.status);
                    const newDoc = await fetchLetterboxdPage(subtractedYearUrl);
                    const newDirectorInHtml = extractDirectorFromMeta(newDoc);
    
                    if (newDirectorInHtml.includes(lastDirector)) {
                        return subtractedYearUrl;
                    } else {
                        console.log(`Director on Plex [${lastDirector}] doesn't match director on html [${newDirectorInHtml}]`);
                    }
                } else {
                    console.log(`Url with subtracted year is inaccessible`);
                }
    
                let urlWithoutYear = removeYearFromUrl(url);
                result = await checkLink(urlWithoutYear);
                if (result.accessible) {
                    console.log(`${result.url}, is accessible, status:, ${result.status}`);
                    console.log('Going back to url without year as fallback');
                    return urlWithoutYear;
                } else {
                    console.log(result.url, 'is not accessible, status:', result.status);
                    console.log('Icon creation aborted');
                    return null;
                }
            } else if ((parseInt(yearInHtml, 10) - 1 === parseInt(lastYear, 10)) || (parseInt(yearInHtml, 10) + 1 === parseInt(lastYear, 10))) {
                console.log(`Year from Plex [${lastYear}] has 1 year of difference with Letterboxd [${yearInHtml}]. Icon created`);
                const rating = extractRating(doc);
                updateOrCreateLetterboxdIcon(url, rating);
                return null;
            } else {
                console.log(`Year from Plex [${lastYear}] has more than 1 year of difference with Letterboxd [${yearInHtml}]. Icon creation aborted`);
                return null;
            }
        } else {
            if (hasSeries) {
                console.log(`Plex Tv show :[${lastTitle}], Year: [${lastYear}], and Letterboxd entry [${url}], Year: [${yearInHtml}] have the same year. Icon created.`);
            } else if (lastDirector == undefined || lastDirector == '') {
                console.log(`Plex film [${lastTitle}], Year: [${lastYear}], and Letterboxd entry [${url}], Year: [${yearInHtml}] have the same year. Icon created.`);
            } else {
                console.log(`Plex film [${lastTitle}], Year: [${lastYear}], Director: [${lastDirector}] and Letterboxd entry [${url}], Year: [${yearInHtml}], Director: [${directorInHtml}] have the same year and director. Icon created.`);
            }
            const rating = extractRating(doc);
            updateOrCreateLetterboxdIcon(url, rating);
            return null;
        }
    }
    
    async function processLetterboxdUrl(initialUrl) {
        let url = initialUrl;
        let shouldContinue = true;

        const hasSeries = false;//QUICKFIX BECAUSE THE LINE BELOW DOESNT WORK ANYMORE FOR SOME REASON
        //Add more checks for Series keyword in other languages here:
        //const hasSeries = document.querySelectorAll('[title*="Series"], [title*="Seasons"], [title*="Saisons"]');

        while (shouldContinue) {
            try {
                if (checkForPageChange()) {
                    break;
                }
                const doc = await fetchLetterboxdPage(url);
                //console.log(doc);
                if (!await checkPlexLetterboxdSeriesMismatch(doc, hasSeries)) break;
                if (await handlePersonsPage(url)) break;

                const yearInHtml = extractYearFromMeta(doc);
                const directorInHtml = extractDirectorFromMeta(doc);
                console.log('Director on Plex: ' + lastDirector);
                
                let newUrl = await handleMismatch(url, yearInHtml, directorInHtml, doc, hasSeries);
                if (newUrl === null) break;
                if (newUrl) {
                    url = newUrl;
                    continue;
                }
    
                console.log(`No conditions were matched. Icon creation aborted`);
                break;
            } catch (error) {
                console.error(`Error fetching or parsing Letterboxd page:, ${error}`);
                break;
            }
        }
    }

    

    // if(document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
        main(); // } else { document.addEventListener('DOMContentLoaded', main); }

    function main() {
        var lastProcessedTitle, lastProcessedYear, lastProcessedDirector, lastProcessedSubtitle;

    
        let debounceTimeout = null;

        function observerCallback(mutationsList, observer) {
            clearTimeout(debounceTimeout);
        
            debounceTimeout = setTimeout(() => {
                if (checkForPageChange()) {
                    return ;
                }
        
                const isAlbumPage = document.querySelector('[class^="AlbumDisc"]');
                const isFullSeries = document.querySelector('[title*="Season 4"], [title*="Season 5"], [title*="Season 6"]');
        
                if (isAlbumPage || isFullSeries) {
                    return;
                }
        
                extractTitleAndYear();
                extractDirectorFromPage();
                extractSubtitle();

                if (lastTitle !== lastProcessedTitle || lastYear !== lastProcessedYear || lastDirector !== lastProcessedDirector || lastSubtitle !== lastProcessedSubtitle) {
                    lastProcessedTitle = lastTitle;
                    lastProcessedYear = lastYear;
                    lastProcessedDirector = lastDirector;
                    lastProcessedSubtitle = lastSubtitle;
        
                    if (lastTitle && lastYear) {
                        buildLetterboxdUrl(lastTitle, lastYear).then(url => {
                            if (!url) {
                                return;
                            }
                            processLetterboxdUrl(url, lastYear, lastDirector);
        
                        }).catch(error => {
                            console.error('Error building Letterboxd URL:', error);
                        });
                    }
                }
            }, 3);
        }
        

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true
    });
}
})();