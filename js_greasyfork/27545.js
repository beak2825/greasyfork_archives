// ==UserScript==
// @name         Crime Counter
// @namespace    crimeCounter
// @version      1.1.9
// @description  Counts the results from various crimes
// @include      *.torn.com/crimes.php*
// @grant        none
// @require      https://greasyfork.org/scripts/21221/code/Script%20Lib.js
// @downloadURL https://update.greasyfork.org/scripts/27545/Crime%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/27545/Crime%20Counter.meta.js
// ==/UserScript==

// Note: Do not import jQuery. Use the jQuery provided on the page (Torn).
// $.ajaxSuccess() doesn't seem to work without it.

(function() {
    'use strict';

    try {
        if (document.URL.match(/http:\/\//)) {
            console.warn('Crime Counter: Page is open over HTTP, data is separate from HTTPS!');
            addNotificationInPage('You are not on HTTP; crime data recorded in HTTP will be separate from data in HTTPS.<br>' +
                                  '<a href="https://' + window.location.hostname + window.location.pathname + '">Click here to switch to HTTPS.</a>');
        }
        
        
        /*
         * Confidence interval bound search function; taken from: http://statpages.info/confint.html
         */
        var BinP = function (N,p,x1,x2) {
            var q = p / (1 - p);
            var k = 0;
            var v = 1;
            var s = 0;
            var tot = 0;
            while (k <= N) {
                tot = tot + v;
                if (k >= x1 && k <= x2) {
                    s = s + v;
                }
                if (tot > 1e30) {
                    s = s / 1e30;
                    tot = tot / 1e30;
                    v = v / 1e30;
                }
                k = k + 1;
                v = v * q * (N + 1 - k) / k;
            }
            return s / tot;
        };

        
        /*
         * Find the lower bound of the confidence interval; taken from: http://statpages.info/confint.html
         *
         * @param {int} numActualResults the number of times the crime resulted in this particular outcome
         * @param {int} numTries the number of times the crime was attempted
         * @param {double} tailSize the uncertainty of the lower bound (e.g.: 0.025-0.00000001)
         */
        var getLowerConfidenceInterval = function (numActualResults, numTries, tailSize) {
            var actualRate = numActualResults / numTries;
            
            if (numActualResults === 0) {
                return 0;
            }
            
            var v = actualRate / 2;
            var vsL = 0;
            var vsH = actualRate;
            var p = tailSize;
            while (vsH - vsL > 1e-5) {
                if (BinP(numTries, v, numActualResults, numTries) > p) {
                    vsH = v;
                    v = (vsL + v) / 2;
                } else {
                    vsL = v;
                    v = (v + vsH) / 2;
                }
            }
            return v;
        };

        
        /*
         * Find the upper bound of the confidence interval; taken from: http://statpages.info/confint.html
         *
         * @param {int} numActualResults the number of times the crime resulted in this particular outcome
         * @param {int} numTries the number of times the crime was attempted
         * @param {double} tailSize the uncertainty of the upper bound (e.g.: 0.025-0.00000001)
         */
        var getUpperConfidenceInterval = function (numActualResults, numTries, tailSize) {
            var actualRate = numActualResults / numTries;
            
            if (numActualResults == numTries) {
                return 1;
            }
            
            var v = (1 + actualRate) / 2;
            var vsL = actualRate;
            var vsH = 1;
            var p = tailSize;
            while (vsH - vsL > 1e-5) {
                if (BinP(numTries, v, 0, numActualResults) < p) {
                    vsH = v;
                    v = (vsL + v) / 2;
                } else {
                    vsL = v;
                    v = (v + vsH) / 2;
                }
            }
            return v;
        };

        
        /*
         * Returns a string representing the confidence interval for an individual set of crime data.
         * 
         * @param {int} numActualResults the number of times the crime resulted in this particular outcome
         * @param {int} numTries the number of times the crime was attempted
         * @param {double} percentConfidence the level of confidence desired (e.g.: 0.95-0.99999)
         */
        var getConfidenceIntervalText = function(numActualResults, numTries, percentConfidence) {
            return (100 * percentConfidence) + '% confidence: ' +
                (100 * getLowerConfidenceInterval(numActualResults, numTries, (1 - percentConfidence) / 2)).toLocaleString('EN',
                    { maximumFractionDigits : 1, minimumFractionDigits : 1 }) + '% to ' +
                (100 * getUpperConfidenceInterval(numActualResults, numTries, (1 - percentConfidence) / 2)).toLocaleString('EN',
                    { maximumFractionDigits : 1, minimumFractionDigits : 1 }) + '%';
        };

        
        /*
         * Gets crime results from local storage and returns them as an object.
         */
        var getCrimeResults = function() {
            var crimeResultsString = localStorage.crimeResults || null;
            if (!crimeResultsString) {
                return {};
            }
            return JSON.parse(crimeResultsString);
        };
        
        
        /*
         * Returns an HTML string representing the results for an individual set of crime data.
         * 
         * @param {object} individualCrimeResults the number of successes, failures, and jails/hosps for an individual crime
         * @param {int} numFractionalDigits the number of fractional digits to display for the result rates
         */
        var getIndividualCrimeResultsDisplayHtml = function(individualCrimeResults, numFractionalDigits) {
            var totalCrimes = individualCrimeResults.successes + individualCrimeResults.failures + individualCrimeResults.jails;
            
            var displayHtml = '(<span class="t-green"';
            if (individualCrimeResults.successes > 0 && individualCrimeResults.successes < totalCrimes) {
                displayHtml += ' title="' + getConfidenceIntervalText(individualCrimeResults.successes, totalCrimes, 0.95) + '"';
            }
            displayHtml += '>' +
                (100 * individualCrimeResults.successes / totalCrimes).toLocaleString('EN',
                    { maximumFractionDigits : numFractionalDigits, minimumFractionDigits : numFractionalDigits }) +
                '% ✓</span>';
            
            if (individualCrimeResults.jails > 0) {
                displayHtml +=  ', <span class="t-red"';
                if (individualCrimeResults.jails < totalCrimes) {
                    displayHtml += ' title="' + getConfidenceIntervalText(individualCrimeResults.jails, totalCrimes, 0.95) + '"';
                }
                displayHtml += '>' +
                    (100 * individualCrimeResults.jails / totalCrimes).toLocaleString('EN',
                        { maximumFractionDigits : numFractionalDigits, minimumFractionDigits : numFractionalDigits }) +
                    '% jail/hosp</span>';
            }
            
            displayHtml += ', ' + totalCrimes.toLocaleString('EN') + ' ' + (totalCrimes == 1 ? 'try' : 'tries') + ') ';
            
            return displayHtml;
        };
        
        
        /*
         * Displays the player's success and other statistics for the set of crime options being presented to them.
         * Note: it is assumed we don't get into this function until after the crime options have been successfully
         * inserted into the page. If they are not in the page, this will fail.
         */
        var displayIndividualCrimeData = function() {
            var $crimeElements = $(document).find('form[name="crimes"] > ul.specials-cont > li');
            
            if ($crimeElements.length === 0) {
                console.error('displayIndividualCrimeData(): Found no specific crime elements in the page!');
                return;
            }
            
            addResetCrimeStatsButton();
            
            var crimeResults = getCrimeResults();
            
            $crimeElements.each(function(index, element) {
                var crimeType = $(element).find('input[type="radio"][name="crime"]').attr('value');
                
                if (crimeResults[crimeType] === undefined) {
                    return;
                }
                
                var totalCrimes = crimeResults[crimeType].successes + crimeResults[crimeType].failures + crimeResults[crimeType].jails;
                var crimeResultHtml =
                    ' (<span class="t-green">' +
                    (100 * crimeResults[crimeType].successes / totalCrimes).toLocaleString('EN', { maximumFractionDigits : 0 }) +
                    '% ✓</span>, <span class="t-red">' +
                    (100 * crimeResults[crimeType].jails / totalCrimes).toLocaleString('EN', { maximumFractionDigits : 0 }) + '% jail/hosp</span>, ' +
                    totalCrimes.toLocaleString('EN') + ' ' + (totalCrimes == 1 ? 'try' : 'tries') + ') ';
                $(element).find('li.bonus.left').append(' ' + getIndividualCrimeResultsDisplayHtml(crimeResults[crimeType], 0));
            });
        };
        
        
        var displayResultsByNerve = function() {
            var crimeResults = getCrimeResults();
            
            $('form[name="crimes"] > ul > li > ul').each(function(index, element) {
                var nerveMatch = $(element).find('li.points').text().match(/(\d+) Nerve/);
                if (!nerveMatch) {
                    return;
                }
                
                var nerveCategoryCrimeResults = {'successes': 0, 'failures': 0, 'jails': 0};
                getCrimeResultsByNerveCategory(nerveCategoryCrimeResults, nerveMatch[1], crimeResults);
                if (nerveCategoryCrimeResults.successes + nerveCategoryCrimeResults.failures + nerveCategoryCrimeResults.jails > 0) {
                    $(element).find('li.bonus').append(' ' + getIndividualCrimeResultsDisplayHtml(nerveCategoryCrimeResults, 0));
                }
            });
        };
        
        
        /*
         * Displays the player's success and other statistics for the criminal record page.
         * Note: it is assumed we don't get into this function until after the criminal record has been successfully
         * inserted into the page. If it is not in the page, this will fail.
         */
        var displayCriminalRecordData = function() {
            var crimeResults = getCrimeResults();
            
            $('li.income').each(function(index, element) {
                var categoryName = $(element).text();
                if (categoryName === "Total") {
                    return;
                }
                
                var categoryCrimeResults = getCrimeResultsByCriminalRecordCategory(categoryName, crimeResults);
                var totalTries = categoryCrimeResults.successes + categoryCrimeResults.failures + categoryCrimeResults.jails;
                if (totalTries > 0) {
                    $(element).append(' ' + getIndividualCrimeResultsDisplayHtml(categoryCrimeResults, 1));
                }
            });
        };
        
        
        /*
         * Adds results from an individual crime to results being aggregated.
         */
        var combineCrimeResults = function(aggregateCrimeResults, crimeKey, overallCrimeResults) {
            var individualCrimeResults = overallCrimeResults[crimeKey];
            if (!individualCrimeResults) {
                // This may or may not be an error. Any crime that hasn't been done yet will lead us here.
                // A typo or invalid crime key would also lead us here.
                return;
            }
            aggregateCrimeResults.successes += individualCrimeResults.successes;
            aggregateCrimeResults.failures += individualCrimeResults.failures;
            aggregateCrimeResults.jails += individualCrimeResults.jails;
        };
        
        
        var getCrimeResultsByNerveCategory = function(aggregateResults, nervePerCrime, overallCrimeResults) {           
            if (nervePerCrime == 2) {
                combineCrimeResults(aggregateResults, 'searchmovie', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'searchdumpster', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'searchfountain', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'searchbins', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'searchbridge', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'searchtrainstation', overallCrimeResults);
            } else if (nervePerCrime == 3) {
                combineCrimeResults(aggregateResults, 'cdrock', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'cdheavymetal', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'cdpop', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'cdrap', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'cdreggae', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'dvdhorror', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'dvdaction', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'dvdromance', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'dvdsci', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'dvdthriller', overallCrimeResults);
            } else if (nervePerCrime == 4) {
                combineCrimeResults(aggregateResults, 'chocolatebars', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'bonbons', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'extrastrongmints', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'musicstall', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'electronicsstall', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'computerstall', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'tanktop', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'trainers', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'jacket', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'watch', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'necklace', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'ring', overallCrimeResults);
            } else if (nervePerCrime == 5) {
                combineCrimeResults(aggregateResults, 'hobo', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'kid', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'oldwoman', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'businessman', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'lawyer', overallCrimeResults);
            } else if (nervePerCrime == 6) {
                combineCrimeResults(aggregateResults, 'apartment', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'house', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'mansion', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'cartheft', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'office', overallCrimeResults);
            } else if (nervePerCrime == 7) {
                combineCrimeResults(aggregateResults, 'swiftrobbery', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'thoroughrobbery', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'swiftconvenient', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'thoroughconvenient', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'swiftbank', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'thoroughbank', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'swiftcar', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'thoroughcar', overallCrimeResults);
            } else if (nervePerCrime == 8) {
                combineCrimeResults(aggregateResults, 'cannabis', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'amphetamines', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'cocaine', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'drugscanabis', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'drugspills', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'drugscocaine', overallCrimeResults);
            } else if (nervePerCrime == 9) {
                combineCrimeResults(aggregateResults, 'simplevirus', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'polymorphicvirus', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'tunnelingvirus', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'armoredvirus', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'stealthvirus', overallCrimeResults);
            } else if (nervePerCrime == 10) {
                combineCrimeResults(aggregateResults, 'assasination', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'driveby', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'carbomb', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'murdermobboss', overallCrimeResults);
            } else if (nervePerCrime == 11) {
                combineCrimeResults(aggregateResults, 'home', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'Carlot', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'OfficeBuilding', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'aptbuilding', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'warehouse', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'motel', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'govbuilding', overallCrimeResults);
            } else if (nervePerCrime == 12) {
                combineCrimeResults(aggregateResults, 'parkedcar', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'movingcar', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'carshop', overallCrimeResults);
            } else if (nervePerCrime == 13) {
                // "Side Door" and "Rear Door" use the same key!
                combineCrimeResults(aggregateResults, 'pawnshop', overallCrimeResults);
            } else if (nervePerCrime == 14) {
                combineCrimeResults(aggregateResults, 'makemoney2', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'maketokens2', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'makecard', overallCrimeResults);
            } else if (nervePerCrime == 15) {
                combineCrimeResults(aggregateResults, 'napkid', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'napwomen', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'napcop', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'napmayor', overallCrimeResults);
            } else if (nervePerCrime == 16) {
                combineCrimeResults(aggregateResults, 'trafficbomb', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'trafficarms', overallCrimeResults);
            } else if (nervePerCrime == 17) {
                combineCrimeResults(aggregateResults, 'bombfactory', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'bombbuilding', overallCrimeResults);
            } else if (nervePerCrime == 18) {
                combineCrimeResults(aggregateResults, 'hackbank', overallCrimeResults);
                combineCrimeResults(aggregateResults, 'hackfbi', overallCrimeResults);
            }
        };
        
        
        /*
         * Collates and returns results for a given category of crimes by the display name on the Criminal Record page.
         *
         * @param {string} criminalRecordCategoryName the name of the category of crime, as displayed on the Criminal Record page
         * @param {object} overallCrimeResults the full set of results for all recorded crimes committed by the player
         */
        var getCrimeResultsByCriminalRecordCategory = function(criminalRecordCategoryName, overallCrimeResults) {
            var categoryCrimeResults = {'successes': 0, 'failures': 0, 'jails': 0};
            
            if (criminalRecordCategoryName === 'Selling Illegal Products') {
                // Bootlegging
                getCrimeResultsByNerveCategory(categoryCrimeResults, 3, overallCrimeResults);
                // Arms trafficking
                getCrimeResultsByNerveCategory(categoryCrimeResults, 16, overallCrimeResults);
            } else if (criminalRecordCategoryName === 'Theft') {
                // Shoplifting
                getCrimeResultsByNerveCategory(categoryCrimeResults, 4, overallCrimeResults);
                // Pickpocketing
                getCrimeResultsByNerveCategory(categoryCrimeResults, 5, overallCrimeResults);
                // Larceny
                getCrimeResultsByNerveCategory(categoryCrimeResults, 6, overallCrimeResults);
                // Armed Robbery
                getCrimeResultsByNerveCategory(categoryCrimeResults, 7, overallCrimeResults);
                // Kidnapping
                getCrimeResultsByNerveCategory(categoryCrimeResults, 15, overallCrimeResults);
            } else if (criminalRecordCategoryName === 'Auto Theft') {
                // GTA
                getCrimeResultsByNerveCategory(categoryCrimeResults, 12, overallCrimeResults);
            } else if (criminalRecordCategoryName === 'Drug Deals') {
                // Drug deals
                getCrimeResultsByNerveCategory(categoryCrimeResults, 8, overallCrimeResults);
            } else if (criminalRecordCategoryName === 'Computer Crimes') {
                // Virus
                getCrimeResultsByNerveCategory(categoryCrimeResults, 9, overallCrimeResults);
                // Hacking
                getCrimeResultsByNerveCategory(categoryCrimeResults, 18, overallCrimeResults);
            } else if (criminalRecordCategoryName === 'Murder') {
                // Assassination
                getCrimeResultsByNerveCategory(categoryCrimeResults, 10, overallCrimeResults);
            } else if (criminalRecordCategoryName === 'Fraud Crimes') {
                // Arson
                getCrimeResultsByNerveCategory(categoryCrimeResults, 11, overallCrimeResults);
                // Pawn shop
                getCrimeResultsByNerveCategory(categoryCrimeResults, 13, overallCrimeResults);
                // Counterfeiting
                getCrimeResultsByNerveCategory(categoryCrimeResults, 14, overallCrimeResults);
                // Bombing
                getCrimeResultsByNerveCategory(categoryCrimeResults, 17, overallCrimeResults);
            } else if (criminalRecordCategoryName === 'Other') {
                // Search for money
                getCrimeResultsByNerveCategory(categoryCrimeResults, 2, overallCrimeResults);
            }
            
            return categoryCrimeResults;
        };

        
        /*
         * Examines the results of a crime and updates the player's stored all-time results.
         *
         * @param {string} htmlString the HTML string returned by Torn that contains new page data for after
         * after the crime was committed
         */
        var updateCrimeResultsFromHtml = function(htmlString) {
            var $parsedDocument = $($.parseHTML(htmlString));
            
            var crimeResults = getCrimeResults();
                
            var crimeType = $parsedDocument.find('div > form[name="crimes"] > input[name="crime"]').attr('value');
            if (crimeResults[crimeType] === undefined ||
                crimeResults[crimeType].successes === undefined ||
                crimeResults[crimeType].failures === undefined ||
                crimeResults[crimeType].jails === undefined) {
                // If this is the first time for this crime or the crime is somehow missing data
                // (backwards compatibility?) then set it to an empty result list.
                crimeResults[crimeType] = {'successes': 0, 'failures': 0, 'jails': 0};
            }

            if ($parsedDocument.find('div.success-message').length > 0) {
                console.debug('Crime result: success!');
                ++crimeResults[crimeType].successes;
            } else if ($parsedDocument.find('div.ready-message').length > 0) {
                console.debug('Crime result: failure');
                ++crimeResults[crimeType].failures;
            } else if ($parsedDocument.find('div.error-message').length > 0) {
                console.debug('Crime result: jail!');
                ++crimeResults[crimeType].jails;
            } else {
                console.error('Crime result: unknown...');
                console.debug($parsedDocument);
            }

            var totalCrimes = crimeResults[crimeType].successes + crimeResults[crimeType].failures + crimeResults[crimeType].jails;
            console.debug('For crime ' + crimeType + ', you have had:\n' +
                          crimeResults[crimeType].successes + ' successes (' + (100 * crimeResults[crimeType].successes / totalCrimes) + '%)\n' +
                          crimeResults[crimeType].failures + ' failures (' + (100 * crimeResults[crimeType].failures / totalCrimes) + '%)\n' +
                          crimeResults[crimeType].jails + ' jails (' + (100 * crimeResults[crimeType].jails / totalCrimes) + '%)');

            localStorage.crimeResults = JSON.stringify(crimeResults);
        };
        
        
        /*
         * Adds a button to the list of crimes allowing the player to clear all gathered crime data.
         */
        var addResetCrimeStatsButton = function() {
            var $crimesForm = $(document).find('form[name="crimes"]').not('.svelte-qzito0');

            var $buttonWrapDiv = $('<div class="special btn-wrap silver m-top10"></div>');
            var $resetWrapDiv = $('<div id="reset_stats" class="btn"></div>');
            var $resetCrimesButton = $('<button class="torn-btn">RESET CRIME STATS</button>');
            $resetWrapDiv.append($resetCrimesButton);
            $buttonWrapDiv.append($resetWrapDiv);
            $crimesForm.append($buttonWrapDiv);
            
            $resetCrimesButton.click(function(event) {
                try {
                    event.preventDefault();
                    var $confirmDiv = $('<div>Are you sure you want to clear all collected crime stats?</div>')
                        .css('display', 'inline').css('padding', '0 10px 0 10px');
                    var $linkWrap = $('<span class="link-wrap"></span>');
                    var $confirmLink = $('<a href="#" class="t-blue bold m-left10">Yes</a>');
                    $linkWrap.append($confirmLink);
                    var $cancelLink = $('<a href="#" class="t-blue bold m-left10">No</a>');
                    $linkWrap.append($cancelLink);
                    $confirmDiv.append($linkWrap);
                    $crimesForm.append($confirmDiv);
                    
                    $confirmLink.click(function() {
                        localStorage.removeItem('crimeResults');
                        location.reload();
                    });
                    $cancelLink.click(function() {
                        $confirmDiv.remove();
                    });
                } catch (error) {
                    console.error(error);
                }
            });
        };
        
        
        // Display results by nerve category on the main crime page.
        displayResultsByNerve();
        
        // Listen for crime results and other page updates from Torn.
        $(document).ajaxSuccess(function(event, jqxhr, settings, data) {
            try {
                if (settings.url.match(/step=main/)) {
                    displayResultsByNerve();
                    return;
                }
                if (settings.url.match(/step=criminalrecords/)) {
                    displayCriminalRecordData();
                    return;
                }
                
                var crimeAjaxMatch = settings.url.match(/step=docrime(\d?)/);
                if (!crimeAjaxMatch) {
                    // This incoming data wasn't related to a crime.
                    return;
                }
                
                var responseHtml = jqxhr.responseText;
                if (responseHtml.match(/You will have to wait for your nerve bar to refill before you try doing more crimes/)) {
                    // Not enough nerve for this crime at this time.
                    return;
                }
                
                console.debug('Crime page or result loaded from URL: ' + settings.url);
                console.debug(jqxhr);
                
                var stepNumber = crimeAjaxMatch[1];
                if (stepNumber.length === 0 || stepNumber == 3) {
                    // We know the step "docrime" with no number after it opens the crime options for a particular amount of nerve.
                    // Step "docrime3" opens the second level of crime options for shoplifting.
                    // If there are others, they need to be added here.
                    displayIndividualCrimeData();
                } else {
                    // We know the step "docrime2" and "docrime4" is the actual action step for certain crimes.
                    // We're doing the catch-all here just in case there's something that was missed.
                    updateCrimeResultsFromHtml(responseHtml);
                }
                

            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);
    }
})();