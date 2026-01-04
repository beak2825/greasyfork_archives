// ==UserScript==
// @name		AO3: Paste news posts for uploading
// @description	Easier uploading of news posts
// @namespace	https://greasyfork.org/en/scripts/506203-ao3-paste-news-posts-for-uploading
// @author		Min
// @version		1.0
// @license		MPL-2.0
// @grant		none
// @include		http://*archiveofourown.org/admin_posts/new*
// @include		https://*archiveofourown.org/admin_posts/new*
// @downloadURL https://update.greasyfork.org/scripts/506203/AO3%3A%20Paste%20news%20posts%20for%20uploading.user.js
// @updateURL https://update.greasyfork.org/scripts/506203/AO3%3A%20Paste%20news%20posts%20for%20uploading.meta.js
// ==/UserScript==


(function ($) {

	const adminPostForm = $('#admin-post-form');

	let inputContainer, languageDropdown, jsonInput, parentPostIdInput, confirmButton, currentUrl;

	if (adminPostForm.length) {
		inputContainer = $('<div style="background: #d1e1ef; border: 1px dashed #c2d2df; padding: 15px; clear: both; margin: 70px 0 40px;"></div>');

		if (window.opener && window.opener.newsPostSingle) {

			const currentPost = JSON.parse(window.opener.newsPostSingle);
			delete window.opener.newsPostSingle;

			inputContainer.append(
				'<h3>News post data filled in</h3>',
				`<p>The language you're posting is <strong>${currentPost.language}</strong>.</p>`,
			);

			const notFilledFields = [];

			document.title = `${currentPost.language} -- ${document.title}`;
			$('#admin_post_title').val(currentPost.title);
			$('#content').val(currentPost.content);

			if (currentPost.parent_post_id) {
				$('#admin_post_translated_post_id').val(currentPost.parent_post_id).show();
				$('#admin_post_translated_post_id_autocomplete').hide();
				$('label[for=admin_post_translated_post_id_autocomplete]').append(` <b>(showing field for the post ID, not autocomplete)</b>`);
			}
			else {
				notFilledFields.push('parent post in English');
			}

			const langCodeMap = {
				'pt-BR': 'ptBR',
				'pt-PT': 'ptPT',
				'tha': 'th',
				'UKR': 'uk',
				'zh-CN': 'zh',
			};
			const codeToLookFor = langCodeMap[currentPost.ao3_locale] || currentPost.ao3_locale;

			languageDropdown = $('#admin_post_language_id');
			const languageOption = languageDropdown.find(`option[lang=${codeToLookFor}]`);

			if (languageOption.length) {
				languageDropdown.val(languageOption.prop('value'));
			}
			else {
				notFilledFields.push('language');
			}

			if (notFilledFields.length) {
				inputContainer.append(
					`<p style="background: #ffb089; border: 1px dashed #e49191; padding: 15px; margin: 1.5em 0;"><strong>WARNING:</strong> some fields are not filled in: <strong>${notFilledFields.join(', ')}</strong>.</p>`,
				);
			}
		}
		else {
			jsonInput = $('<input type="text" style="margin-bottom: 1.5em;" />');
			parentPostIdInput = $('<input type="text" style="margin-bottom: 1.5em;" />');
			confirmButton = $('<button type="button">Open and fill forms for the languages</button>');
			confirmButton.click(startOpeningForms);

			inputContainer.append(
				'<h3 style="margin-bottom: 1.5em;">Uploading news posts</h3>',
				`<p style="margin-bottom: 1.5em;">This userscript will open new tabs with the news posting form, one tab per language, and fill the forms. If your browser asks you about allowing this page to open pop-up windows, allow it.</p>`,
				'<label><b>Paste the news posts data (from the news uploading form):</b></label>',
				jsonInput,
				'<label><b>ID of the post in English:</b></label>',
				parentPostIdInput,
				confirmButton,
			);
		}

		adminPostForm.before(inputContainer);
	}

	function startOpeningForms() {
		currentUrl = window.location.href;
		const newsPostsData = JSON.parse(jsonInput.val());
		newsPostsData.parent_post_id = parentPostIdInput.val().trim();
		jsonInput.prop('disabled', true);
		parentPostIdInput.prop('disabled', true);

		inputContainer.append(
			'<p style="margin-top: 1.5em;">Opening forms for:</p>',
			`<ol style="padding-left: 3em;">${newsPostsData.news_posts.map((post) => `<li style="list-style: decimal;">${post.language} <a class="open-again" data-locale="${post.ao3_locale}" style="cursor: pointer">[open again]</a></li>`).join('\n')}</ol>`,
		);

		openLangTabs(newsPostsData);
	}

	function openLangTabs(data) {
		if (data.news_posts.length) {

			if (!window.newsPostSingle) {
				const newsPostSingle = {
					...data.news_posts.shift(),
					parent_post_id: data.parent_post_id,
				};
				window.newsPostSingle = JSON.stringify(newsPostSingle);
				window.open(currentUrl, '_blank');
			}

			setTimeout(function () {
				openLangTabs(data);
			}, 500);
		}
	}

	$(document).on('click', '.open-again', function () {
		const localeToOpen = $(this).data('locale');

		const newsPostsData = JSON.parse(jsonInput.val());
		newsPostsData.parent_post_id = parentPostIdInput.val().trim();
		newsPostsData.news_posts = newsPostsData.news_posts.filter((post) => post.ao3_locale == localeToOpen);

		openLangTabs(newsPostsData);
	});

})(jQuery);
