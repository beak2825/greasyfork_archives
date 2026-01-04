// ==UserScript==
// @name         Seriesfeed Favourites Dropdown
// @namespace    https://www.seriesfeed.com
// @version      1.2.1
// @description  Choose your favourites from a dropdown on any page, just like Bierdopje!
// @match        https://www.seriesfeed.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @author       Tom
// @copyright    2018+, Tom, copied from https://greasyfork.org/nl/scripts/39051-seriesfeed-favourites-dropdown
// @downloadURL https://update.greasyfork.org/scripts/39369/Seriesfeed%20Favourites%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/39369/Seriesfeed%20Favourites%20Dropdown.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $, console, GM_xmlhttpRequest */
'use strict';

/*
Maybe in the future:
- Cache favourites for quicker loading > add/remove to cache when adding/removing a favourite.
- Enable keyboard input to select a favourite from the list.
*/

$(() => {
	const _baseUrl = "https://www.seriesfeed.com";
	const username = getUsername();

	const starDropdown = getStarDropdown();
	$('.main-menu .new-message').after(starDropdown.topLevel);
	const loader = getLoader();
	starDropdown.dropdown.append(loader);

	ajaxGet(`${_baseUrl}/users/${username}/favourites`)
		.then((page) => {
		const favouriteRows = $(page).find("#favourites tr:gt(0)");

		favouriteRows.each((index, favouriteRow) => {
			const favName = $(favouriteRow).find("td:nth-child(2) a").text();
			const favSlug = $(favouriteRow).find("td:nth-child(2) a").attr("href");
			const isFinishedShow = $(favouriteRow).find("td:nth-child(3)").text() === "Afgelopen";
			const showItem = $("<li/>").append($("<a/>").attr("href", _baseUrl + favSlug).text(favName));

			if (isFinishedShow) {
				showItem.css({ opacity: 0.5 });
			}

			starDropdown.dropdown.append(showItem);
		});

		loader.remove();
	});

	function getUsername() {
		const userLink = $('.main-menu .profile-li .main-menu-dropdown li:first-child a').attr('href');
		const userLinkParts = userLink.split('/');
		return userLinkParts[2];
	}

	function getStarDropdown() {
		const topLevel = $("<li/>").addClass("top-level upper favourites-li");
		const topLevelToggle = $("<a/>").addClass("top-level-toggle").click(function() { $(this).toggleClass("open"); });
		const starIcon = $("<i/>").addClass("fa fa-star-o");       
      
		topLevel.append(topLevelToggle);
		topLevelToggle.append(starIcon);

		const mainMenuDropdown = $("<ul/>").addClass("main-menu-dropdown");      
		const scrollContainer = $("<li/>").addClass("scrollContainer").attr('id', 'serieFilterScollContainer');
		const scrollContainerUl = $("<ul/>");
		topLevel.append(mainMenuDropdown);
		mainMenuDropdown.append(scrollContainer);
		scrollContainer.append(scrollContainerUl);
      
        $( "<input/>", {
          "type": "text",
          id: "serieFilter",
          "style": "width: 100%;",
          keyup: function() {
            // Declare variables 
            var input, filter, scrollContainer, li, a, i;
            input = document.getElementById("serieFilter");
            filter = input.value.toUpperCase();            
            scrollContainer = document.getElementById("serieFilterScollContainer");
            li = scrollContainer.getElementsByTagName("li");
            // Loop through all rows, and hide those who don't match the search query
            for (i = 0; i < li.length; i++) {
              a = li[i].getElementsByTagName("a")[0];
              if (a) {
                if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                  li[i].style.display = "";
                } else {
                  li[i].style.display = "none";
                }
              } 
            }
          }
        })
          .insertBefore( scrollContainerUl );

		return { topLevel: topLevel, dropdown: scrollContainerUl };
	}

	function getLoader() {
		const spinnerIcon = $("<i/>").addClass("fa fa-spinner fa-spin");
		return $("<h3/>").addClass("text-center").css({ marginTop: "9px" }).append(spinnerIcon);
	}

	function ajaxGet(url) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: "GET",
				url: url,
				onload: (pageData) => {
					resolve(pageData.responseText);
				},
				onerror: (error) => {
					reject(error);
				}
			});
		});
	}
});