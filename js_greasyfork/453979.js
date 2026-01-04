// ==UserScript==
// @name		AO3: Paste FAQ questions for uploading
// @description	Easier uploading of FAQs
// @namespace	https://greasyfork.org/en/scripts/453979-ao3-paste-faq-questions-for-uploading
// @author		Min
// @version		1.3
// @grant		none
// @include		http://*archiveofourown.org/faq*/edit*
// @include		https://*archiveofourown.org/faq*/edit*
// @downloadURL https://update.greasyfork.org/scripts/453979/AO3%3A%20Paste%20FAQ%20questions%20for%20uploading.user.js
// @updateURL https://update.greasyfork.org/scripts/453979/AO3%3A%20Paste%20FAQ%20questions%20for%20uploading.meta.js
// ==/UserScript==


(function ($) {

	const faqForm = $('form.faq');
	const filledQuestions = [];

	let inputContainer, languageDropdown, selectedLocale, selectedLang, jsonInput, confirmButton;

	if (faqForm.length) {

		languageDropdown = $('#language_id');
		selectedLocale = languageDropdown.val();
		selectedLang = languageDropdown.find('option:selected').text().trim();

		if (selectedLocale !== 'en') {
			inputContainer = $('<div style="background: #d1e1ef; border: 1px dashed #c2d2df; padding: 15px; clear: both; margin: 70px 0 40px;"></div>');
			jsonInput = $('<input type="text" style="margin-bottom: 10px;" />');
			confirmButton = $('<button type="button">Fill the form</button>');
			confirmButton.click(pasteAll);

			inputContainer.append(
				'<h3>Paste FAQ questions</h3>',
				`<p>The language you're editing is <strong>${selectedLang}</strong>.</p>`,
				jsonInput,
				confirmButton
			);
		}
		else {
			inputContainer = $(`<div style="background: #ffbdbd; border: 1px dashed #e49191; padding: 15px; clear: both; margin: 70px 0 40px;">
				<h3>Paste FAQ questions</h3>
				<p>You are editing the <strong>English version</strong> of this FAQ. Switch to the correct language before uploading the translation.</p>
			</div>`);
		}

		faqForm.before(inputContainer);
	}

	function pasteAll() {
		const newContent = JSON.parse(jsonInput.val());

		jsonInput.prop('disabled', true);
		confirmButton.prop('disabled', true);

		if (!newContent.ao3_locale) {
			// pasted content has no locale
			inputContainer.append(`
				<p style="background: #ffb089; border: 1px dashed #e49191; padding: 15px; margin: 1.5em 0;">&#9888;&#65039; <strong>WARNING:</strong> the userscript couldn't determine the language of the document you pasted from. Please make sure you're uploading the right language. &#9888;&#65039;</p>
			`);
		}
		else if (newContent.ao3_locale !== selectedLocale) {
			// pasted content is in another language
			inputContainer.css({ background: '#ffbdbd', borderColor: '#e49191' });
			inputContainer.append(`
				<p>You're editing the version in <strong>${selectedLang} (locale: ${selectedLocale})</strong>, but you pasted content from a doc in <strong>${newContent.language} (locale: ${newContent.ao3_locale})</strong>.</p>
				<p>Please switch to the right language, or refresh this page to upload the FAQ in ${selectedLang}.</p>
			`);
			return;
		}

		const sections = faqForm.children('fieldset');

		const titleInput = sections.eq(0).find('input');
		beforeQuestionInput(titleInput, newContent.title.translated, newContent.title.english, sections.eq(0));
		titleInput.val(newContent.title.translated);

		const questionsSections = sections.eq(1).find('fieldset');

		questionsSections.each(function () {
			const anchor = $(this).find('dd:nth-of-type(2) input').val().trim();
			const sectionContent = newContent.questions[anchor];

			if (sectionContent) {

				const questionInput = $(this).find('dd:first-of-type input');
				const answerInput = $(this).find('textarea');
				const ticky = $(this).find('input[type=checkbox]');

				beforeQuestionInput(questionInput, sectionContent.translated.question, sectionContent.english.question, $(this));
				questionInput.val(sectionContent.translated.question);
				answerInput.val(sectionContent.translated.answer);
				ticky.prop('checked', true);

				filledQuestions.push(anchor);
			}
		});

		const unusedQuestions = Object.keys(newContent.questions).filter((anchor) => !filledQuestions.includes(anchor));

		inputContainer.append(`
			<p>Filled the <b>title</b> and <b>${filledQuestions.length} of ${questionsSections.length}</b> questions.</p>
			<p>If any questions show up with a <strong>yellow</strong> background, that means that the question that was there doesn't match the question in our doc either in English or in translation. That may be fine — it's just a warning for you in case there's something wrong.</p>
			${unusedQuestions.length ? `<p>Questions from the doc that weren't found on this page:</p><ol><li>${unusedQuestions.join('</li><li>')}</li></ol>` : ''}
		`);
	}

	function beforeQuestionInput(input, newText, english, section) {
		const textBefore = input.val();
		input.before(
			`<div><b>English in the doc:</b> ${english}</div>`,
			`<div><b>Was in the input:</b> ${textBefore}</div>`,
		);

		if (!(textBefore == english || textBefore == newText)) {
			section.css({ background: '#fee18b' });
		}
		else {
			section.css({ background: '#d4ebcc' });
		}
	}

})(jQuery);
