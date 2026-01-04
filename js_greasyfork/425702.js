// ==UserScript==
// @name         Shortcut improvements
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Improve Shortcut
// @author       Dominique
// @license      MIT
// @match        https://app.shortcut.com/thingos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425702/Shortcut%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/425702/Shortcut%20improvements.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const flags = {
		// Uses blue instad of purple colors
		shouldUseThingOSColors: true,

		// Adds ch prefix to the shown id and also copies it on click
		shouldPrefixStoryIdWithCh: true,

		// Replace the github dropdown with single click copy message: "title [closes id]"
		shouldReplacePermaLinkButtonWithCommitMessageCopy: true,
		shouldLowercaseCommitMessage: true,
		shouldReplaceEpicLinkWithMilestone: true,
	};

	jQuery(document).ready(function () {
		// Set thingos color
		if (flags.shouldUseThingOSColors) {
			let root = document.documentElement;
			root.style.setProperty('--leftSubNavBackgroundColor', '#002562');
			root.style.setProperty('--topNavBackgroundColor', '#00358E');
			root.style.setProperty('--leftNavBackgroundColor', '#265EBF');
			root.style.setProperty('--leftNavActiveBackgroundColor', '#00358E');
			root.style.setProperty('--topNavLinkBackgroundColor', '#659BF2');
			root.style.setProperty('--fadedTextColor', '#444');
			root.style.setProperty('--navSearchActiveTextColor', '#265EBF');
			root.style.setProperty('--leftNavActiveBorderColor', '#265EBF');
		}

		// Replace epic link with milestone
		function replaceEpicWithMilestone() {
			const milestoneLink = jQuery(
				'#epicMilestoneControl > div.details-stat-value > div.attribute-toggle > a'
			);
			const milestoneText = jQuery(
				'#epicMilestoneControl > div.details-stat-value > div.attribute.editable-attribute.attribute-has-toggle.has-icon-on-left.condensed > span'
			);
			const epicLink = jQuery('#epics div.breadcrumbs > a');
			epicLink.text(milestoneText.text());
			epicLink.attr('href', milestoneLink.attr('href'));
		}

		// When clicking github helper it should copy `${title} [closes ch${clubhhouseid}]`
		function replacePermaLinkButton() {
			const attributeSection = jQuery('.story-attributes');
			const permaLinkSection = attributeSection.find('.attribute').eq(1);

			const permalinkTitle = permaLinkSection.find('.name');
			permalinkTitle.text('Commit Message');

			const permalinkTextfield = permaLinkSection.find('input');
			const copyButton = permaLinkSection.find('button');

			if (permalinkTextfield.length > 0) {
				const storyTitleNode = jQuery('#story-dialog-parent .story-details .story-name');
				const storyTitle = storyTitleNode.text();

				const storyIdInput = jQuery('#story-dialog-parent .story-details .story-id input');
				const storyId = storyIdInput.val();
				const id = storyId.indexOf('ch') === -1 ? `ch{storyId}` : storyId;
				const commitMessage = `${storyTitle} [closes ${id}]`;
				const commitMessageLower = flags.shouldLowercaseCommitMessage
					? commitMessage.toLowerCase()
					: commitMessage;
				const commitMessageFormatted = commitMessageLower.replace(/"/g, "'");

				if (permalinkTextfield.val() == commitMessageFormatted) return;
				permalinkTextfield.val(commitMessageFormatted);

				let lastClick = 0;
				copyButton.removeAttr('data-clipboard-target');
				copyButton.click(evt => {
					evt.preventDefault();
					evt.stopPropagation();
					let isDoubleClick = Date.now() - lastClick < 400;
					lastClick = Date.now();
					const copyContent = isDoubleClick
						? `git commit -m "${commitMessageFormatted}"`
						: commitMessageFormatted;
					navigator.clipboard.writeText(copyContent).catch(() => {});
				});
			}
		}

		function addStoryCheckout() {
			// check if id is already available and get those instead

			// not available, so retrieve them from scratch
			const permalinkTitleSection = attributeSection
				.find('.inline-attribute-field-name .name')
				.first();
			const permalinkTextfield = attributeSection.find('.inline-attribute-field input').first();
			const copyButton = attributeSection.find('.attribute-toggle a').first();

			const checkoutTitle = permalinkTitleSection.clone();
			const checkoutTextfield = permalinkTextfield.clone();
			const checkoutButton = copyButton.clone();

			// set element ids for getting them again

			// inset at correct position

			// set data
		}

		// Setup modal change listener
		function prependStoryId() {
			const storyIdInput = jQuery('#story-dialog-parent .story-details .story-id input');
			const storyId = storyIdInput.val();
			if (typeof storyId === 'string' && storyId.indexOf('ch') === -1) {
				storyIdInput.val(`ch${storyId}`);
			}
		}

		// Check modal changes
		function checkModalChanges() {
			console.log('check model change');
			const storyIdInput = jQuery('#story-dialog-parent .story-details .story-id input');
			const storyId = storyIdInput.val();
			if (typeof storyId === 'string' && storyId.indexOf('ch') === -1) {
				console.log('found modal');
				if (flags.shouldPrefixStoryIdWithCh) {
					prependStoryId();
				}

				if (flags.shouldReplacePermaLinkButtonWithCommitMessageCopy) {
					replacePermaLinkButton();
				}
			}
		}

		// Modal fixes
		let checkInterval = null;
		function updateModal() {
			if (flags.shouldReplaceEpicLinkWithMilestone) {
				replaceEpicWithMilestone();
			}

			// Prepend `ch` to story id
			const storyIdInput = jQuery('#story-dialog-parent .story-details .story-id input');
			if (storyIdInput.length > 0) {
				// we fix the id, but clubhouse will fetch and replace our fix
				// so we also start a check interval and replace it again
				checkModalChanges();
			}
		}

		setInterval(updateModal, 1000);
	});
})();
