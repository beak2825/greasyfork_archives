// ==UserScript==
// @name        AO3: Remove pipes and tone marks in tags
// @description Rename specified characters, remove pipes and tone marks in fandom, relationship and character tags.
// @namespace	
// @author	Min
// @version	1.1
// @grant       none
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/412389/AO3%3A%20Remove%20pipes%20and%20tone%20marks%20in%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/412389/AO3%3A%20Remove%20pipes%20and%20tone%20marks%20in%20tags.meta.js
// ==/UserScript==


(function ($) {

	const charactersToRename = {
		'Jiāng Chéng | Jiāng Wǎnyín': 'Jiang Cheng',
		'Jīn Líng | Jīn Rúlán': 'Jin Ling',
		'Lán Huàn | Lán Xīchén': 'Lan Xichen',
		'Lán Yuàn | Lán Sīzhuī': 'Lan Sizhui',
		'Lán Zhàn | Lán Wàngjī': 'Lan Wangji',
		'Mèng Yáo | Jīn Guāngyáo': 'Jin Guangyao',
		'Sòng Lán | Sòng Zǐchēn': 'Song Lan',
		'Sū Shè | Sū Mǐnshàn': 'Su She',
		'Wèi Yīng | Wèi Wúxiàn': 'Wei Wuxian',
		'Wēn Níng | Wēn Qiónglín': 'Wen Ning',
		'Xuē Yáng | Xuē Chéngměi': 'Xue Yang',
		'Xiao Zhan | Sean': 'Xiao Zhan',
	};

	const tagsInBlurbs = $('.blurb').find('.relationships, .characters').find('a.tag');
	const tagsInMeta = $('.meta').find('.relationship, .character').find('a.tag');
	const tagsInFilters = $('.filters').find('.relationship, .character').find('label span:last-child');

	const fandomsInBlurbs = $('.blurb').find('.fandoms').find('a.tag');
	const fandomsInMeta = $('.meta').find('.fandom').find('a.tag');
	const fandomsInFilters = $('.filters').find('.fandom').find('label span:last-child');

	tagsInBlurbs.add(tagsInMeta).add(tagsInFilters).each(function () {
		renameTag(this, false);
	});

	fandomsInBlurbs.add(fandomsInMeta).add(fandomsInFilters).each(function () {
		renameTag(this, true);
	});

	function renameTag(tag, isFandom) {
		const oldTagText = $(tag).text();
		let tagText = oldTagText;

		if (isFandom) {
			// keep only the name after the last pipe
			// tagText = tagText.replace(/(?:.* \| )(.*)/g, '$1');

			// remove the name before the first pipe
			tagText = tagText.replace(/(?:.+? \| )(.*)/g, '$1');
		}
		else {
			// replace the specified names
			for (let oldName in charactersToRename) {
				tagText = tagText.replace(oldName, charactersToRename[oldName]);
			}

			// replace all piped names with just the first version
			tagText = tagText.replace(/([^ \/&][^\/&\|]*)(?: \| [^\/&]*[^ \/&])+/g, '$1');
		}

		// remove tone marks
		tagText = tagText.normalize('NFD').replace(/[\u0300\u0301\u0304\u030C]/g, '');

		if (tagText !== oldTagText) {
			$(tag).text(tagText);
		}
	}

})(jQuery);
