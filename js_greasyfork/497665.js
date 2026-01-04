// ==UserScript==
// @name         Wikimedia Commons: files page: add categories near every file name
// @description  In your list of uploaded files you will see clickable categories
// @namespace    Violentmonkey Scripts
// @version      1.6
// @author       Vitaly Zdanevich
// @match        https://commons.wikimedia.org/w/index.php?title=Special:ListFiles/*
// @match		 https://commons.wikimedia.org/wiki/Special:ListFiles*
// @supportURL   https://gitlab.com/vitaly-zdanevich-userscripts/uploadPageShowCategories
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497665/Wikimedia%20Commons%3A%20files%20page%3A%20add%20categories%20near%20every%20file%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/497665/Wikimedia%20Commons%3A%20files%20page%3A%20add%20categories%20near%20every%20file%20name.meta.js
// ==/UserScript==

(function() {
	let fileNames = '';
	const fileNamesArr = [];

	const files = document.querySelectorAll('.TablePager_col_img_name > a[href^="/wiki/File:"]');

	files.forEach((f, i) => {
		const fileName = nodeToFilename(f);

		fileNames += fileName
		if (i > 0 && (i+1) % 10 === 0) { // 50 is API limit, but 10 against "414 URI Too Long"
			fileNamesArr.push(fileNames);
			fileNames = '';
		} else {
			fileNames += '|'
		}
	});

	fileNamesArr.forEach(f => {
		const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=categories&formatversion=2&cllimit=max&clshow=!hidden&titles=' + f + '&origin=*';

		fetch(url).then(resp => resp.json()).then(data => {
			const result = {};

			// Process the API response
			if (data.query && data.query.pages) {
				data.query.pages.forEach(page => {

					if (page.categories) {
						const categories = page.categories.map(category => {
							return category.title;
						});
						result[page.title] = categories;
					}

				});
			}

			files.forEach(f => {
				const fileName = nodeToFilename(f);
				if (fileName in result) {
					const categories = result[fileName];

					// Create links for each category and append them to the current link's parent element
					categories.forEach(category => {
						const categoryLink = $('<a>', {
							text: category.replace(/^Category:/g, ''),
							href: 'https://commons.wikimedia.org/wiki/' + category,
							css: { display: 'block', fontSize: 'small', marginLeft: '10px' } // Add some style for better appearance
						});
						$(f).parent().append(categoryLink);
					});
				}
			});
		});
	})

})();

// Extract the "File:..." part from the link href attribute
function nodeToFilename(node) {
	const fileName = node.href.split('/').pop();
	return decodeURIComponent(fileName).replace(/_/g, ' '); // Replace underscores with spaces
	// For smaller response without "normalized" array
}
