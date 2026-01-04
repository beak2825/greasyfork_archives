// ==UserScript==
// @name         Show old releases in octopus deploy
// @namespace    http://tampermonkey.net/
// @version      2025.10.07
// @description  Highlight releases on environments that aren't on the latest
// @author       River Adams
// @match        https://deploy.dicloud.com/app
// @match        http://deploy.dip.co.uk/app
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dicloud.com
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482047/Show%20old%20releases%20in%20octopus%20deploy.user.js
// @updateURL https://update.greasyfork.org/scripts/482047/Show%20old%20releases%20in%20octopus%20deploy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentUser;
    let $ = window.jQuery;
    // Your code here...
    let deployApiBaseUrl = `${window.location.origin}/api`;
    let latestVersionDictionary = {};
    let theme = "light";
    let highlightColor = "yellow";
    let lightHighlightColor = "yellow";
    let darkHighlightColor = "darkred";

    function getLatestRelease(project, callback)
    {
        if(project in latestVersionDictionary){
            var latestVersion = latestVersionDictionary[project];
            callback(latestVersionDictionary[project]);
        }
        else
        {

			var api_url = `${deployApiBaseUrl}/Spaces-42/projects/${project}/releases?take=1`;
				$.ajax({
					url: api_url,
					json: true
				}).then(function(data) {
					latestVersionDictionary[project] = data.Items[0].Version;
					callback(latestVersionDictionary[project]);
				});
        }
    }

	function onElementInserted(containerSelector, elementSelector, callback) {
		var onMutationsObserved = function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.addedNodes.length) {
					var elements = $(mutation.addedNodes).find(elementSelector);
					for (var i = 0, len = elements.length; i < len; i++) {
						callback(elements[i]);
					}
				}
			});
		};
		var target = $(containerSelector)[0];
		var config = { childList: true, subtree: true };
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var observer = new MutationObserver(onMutationsObserved);
		observer.observe(target, config);
	}
	onElementInserted('div', '[class*="css-16l2r3w"]', function(element) {
            // Get the table
            var table = $(element).find('tbody');
            // for each row
            // get the project name:
            var row = $(table).find('tr').each(function( index ) {
                var hrefLink = $( this ).find('a[class*="css-h529es"]').attr("href");
                var projectName = $( this ).find('p[class*="css-1qlf28q"]').text();
                var projectId = hrefLink.replace("#/Spaces-42/projects/","").split('/')[0];

                const projectNameFormatted = projectName.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-');
                // waitForElm(`a`).then((el) => {
                //     $(el).css( "background-color", "green" );
                // });
                waitForElm(`a[href*='#/Spaces-42/projects/${projectNameFormatted}/']`).then((elements) => {
                    elements.forEach(el => {
                        getLatestRelease(projectId, function(latestVersion) {
                            var versionNumber = extractReleaseNumber($(el).attr("href"));
                            if(latestVersion !== versionNumber){
                                //$(el).text("PN: " + projectName + "|v:" + versionNumber + "|lv:" + latestVersion);
                                $(el).css( "background-color", highlightColor );
                            }
                        })
                    });

                });
            });
	});

    onElementInserted("div#app", "div:first", function(element) {
       var themeColour = $(element).css("--colorMenuListBackgroundDefault");
       if(themeColour === "#FFFFFF"){
           highlightColor = lightHighlightColor;
       }
       else{
           highlightColor = darkHighlightColor;
       }
    });

    function extractReleaseNumber(href) {
        const match = href.match(/\/releases\/(\d+\.\d+)\/deployments/);
        return match ? match[1] : null;
    }


    function waitForElm(selector) {
        return new Promise(resolve => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                return resolve(elements);
            }

            const observer = new MutationObserver(mutations => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    observer.disconnect();
                    resolve(elements);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
})();