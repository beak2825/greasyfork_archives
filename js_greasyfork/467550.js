// ==UserScript==
// @name         Teams + Outlook Favicon Badger
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  change favicon and PWA badge when new message arrives
// @license      UNLICENSE
// @author       myklosbotond
// @match        https://teams.microsoft.com/*
// @match        https://outlook.office.com/*
// @icon         https://statics.teams.cdn.office.net/hashed/favicon/prod/favicon-32x32-4102f07.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467550/Teams%20%2B%20Outlook%20Favicon%20Badger.user.js
// @updateURL https://update.greasyfork.org/scripts/467550/Teams%20%2B%20Outlook%20Favicon%20Badger.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
	'use strict';

	if (!document.title) {
		// Script runs multiple times, who knows what Teams is doing...
		// Exit script if title is empty.
		return;
	}

	//#region ==== CONSTANTS ====

	const TYPE = {
		TEAMS: 0,
		OUTLOOK: 1,
	};

	const FAVICONS = {
		[TYPE.TEAMS]: {
			normal: 'https://statics.teams.cdn.office.net/hashed/favicon/prod/favicon-32x32-4102f07.png',
			badged: 'data:image/png;base64,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eG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjJjOTM0MmZlLTkwMzYtNGE2MS1hODUwLTU4NjFjOWY1ZWE5MiIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMWY0NDkxMC1mZGU5LTQzNDgtOTY1MS1mZWE3OWM5OGFiYjIiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MmU5NTJlYy0xMDc3LTQ3ZmYtODdlMy0xNzMzY2JhYWM1NDEiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJNYWMgT1MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjg1NTEwNzMzODU2NDA1IgogICBHSU1QOlZlcnNpb249IjIuMTAuMjQiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTAxYjEzOGYtZDBmYS00ZTY2LWEwYmQtZTJlODY4ODE5OWIyIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKE1hYyBPUykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMDUtMzFUMDg6MjU6MzMrMDM6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+5Q9P4gAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cFHwUZIdatMo4AAAN0SURBVFjD1ZdNSFxXFMd/5z6d2NQ21DihSTehGYukgpuBKQSjJXalC7WBasiia5tNSUKJOlQYHdt8rCrJvg1ooZ0I1W5iaaaFgjBQbIWGMiEU0tBEYyJIY8fMO114/Rqfk3mjQ+mBy3vvnHPv+d/7P+fcGfiPRYqdGI3PN7iuex40bJdKGWMuxXqqfiw5gN6BuR5gAFXZvJi4KkQH+6rjJQMQjc83aNa9pajxXlBccUxToSdR5heAPXaznV1Ro657HlgD0HE61eJm3X5BaxW5bRzTn7gengAw/glY5bwwn5Xg2XHQsEIlaNjNZsc7TqdaigTg88Sybn8+vW8KFp78+YsR5+BGXXlgLxUVL2/MhNR6TmiteuaK1gKUtZ6cjCtyDtXyQgDcvTu3xrb77C+qXnmR/cGaNQCCuGLMpfWckNtetK3owfgJnrsHU/Yqjx//saUMN1aAcYwnBat6U1zw9ZCBwN55hAeIfCOOacrtAYnr4QnjOK0gKYFFkJRxnNbVKpCWdyc3UTT+1Ym8IVtPfrfpe+LrZtlJkm5JwuVldz25ys0WXa68dewDPfx6A0feOOHRM5SHs/M8erTg1bAyAle2AGjv+n7tfWz0bRxHNun8iDHCgWCVJwBFAyBnS94HjNmeIUUDJQfwXIAlWDMJdANHgT12HLW65I4vozxyHxgajAaHPWy/2XGtrWvqDHABOLSbAO4DZwejwdGZUKjS7rYDqLf2aSABXK0biQy3dU3NAVeAQ7tFwZANfhy4AXwKRIAKOyJWd2MmFDo+NhIZBYZ2KweSo190DtudR4HmPL7NQHQmFKocG4kMA8m8FLR1FlT/X9pn93OCbwTRDVxE5HODyHLxm1eAW6u/PXxM7AAQ5aYR9HJxIJSni78Dcscq6n1MrgdQkXsFXSTHGj+8l32Wec2rjby07+Cem9/2ZGZCoac24QqRpbp0+oWCy/BwqDGZzSyd2sZ8xNb4tM32QmTaVyOqCtZc/nvhQZeqKx7XWpMFkPABIOELwGefvPlzX2x2QFfKLFfeA64BV4F3CqiESevr7y6I9VV/LEjCw9TYG5s9U5dOLwIxGyBf8Jj19QdARPTAvv2nxJh+hH9yzBd6Y7Odden0D0A78BEwBSzZMWV17dZnZ/8N+y4u1Ehm+X1VbQCpB54AvwLxgWj1T/yf5F8YqDTqBNyIUQAAAABJRU5ErkJggg==',
		},
		[TYPE.OUTLOOK]: {
			normal: 'https://res-h3.public.cdn.office.net/owamail/20230602011.19/resources/images/favicons/mail-seen.ico',
			badged: 'https://res-h3.public.cdn.office.net/owamail/20230602011.19/resources/images/favicons/mail-unseen.ico',
		},
	};

	const BADGE_REGEX = /^\s*\(([^)]+)\)/;

	const siteType = {
		'teams.microsoft.com': TYPE.TEAMS,
		'outlook.office.com': TYPE.OUTLOOK,
	}[window.location.hostname];

	const MutationObserver =
		window.MutationObserver ||
		window.WebKitMutationObserver ||
		window.MozMutationObserver;

	//#endregion

	function setNormalFavicon() {
		document.querySelectorAll('link[rel~=icon]').forEach((faviconEl) => {
			faviconEl.href = FAVICONS[siteType].normal;
		});
	}

	function setUnreadFavicon() {
		document.querySelectorAll('link[rel~=icon]').forEach((faviconEl) => {
			faviconEl.href = FAVICONS[siteType].badged;
		});
	}

	function doBadging(count) {
		if (count > 0) {
			setUnreadFavicon();
			if (typeof navigator.setAppBadge === 'function') {
				navigator.setAppBadge(count);
			} else {
				console.error('No Badging API');
			}
		} else {
			setNormalFavicon();
			if (typeof navigator.clearAppBadge === 'function') {
				navigator.clearAppBadge();
			}
		}
	}

	function extractTitleBadgeCount(title) {
		const badgeMatch = title?.match(BADGE_REGEX) ?? [];

		if (badgeMatch[0] === undefined) {
			return undefined;
		}

		const badgeCount = Number.parseInt(badgeMatch[1], 10);
		if (Number.isNaN(badgeCount)) {
			return undefined;
		}
		return badgeCount;
	}

	function setTitleObserver() {
		const titleElement = document.querySelector('head > title');

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				const newTitle = mutation.target.textContent;
				const badgeCount = extractTitleBadgeCount(newTitle);

				doBadging(badgeCount ?? 0);
			});
		});
		observer.observe(titleElement, {
			subtree: true,
			characterData: true,
			childList: true,
		});
	}

	const SIDEBAR_ELEMENTS_QUERY = {
		[TYPE.TEAMS]: {
			selector: '#teams-app-bar button',
			getBadgeNode: (sidebarElement) => {
				const children = sidebarElement.children;

				return [...children].find(
					(node) =>
						node.dataset.tid?.startsWith('app-bar-activity-') ??
						false
				);
			},
		},
		[TYPE.OUTLOOK]: {
			selector:
				'div[data-app-section=NavigationPane] div[role=tree] div[draggable] div[role=treeitem]',
			getBadgeNode: (sidebarElement) =>
				sidebarElement.querySelector(':scope > span:last-of-type'),
		},
	}[siteType];
	function crawlSidebarForUpdates() {
		console.groupCollapsed(
			`crawlSidebarForUpdates (${new Date().toISOString()})`
		);

		const titleBadgeCount = extractTitleBadgeCount(document.title);
		console.debug('titleBadgeCount:', titleBadgeCount);
		if (titleBadgeCount !== undefined) {
			// Leave the badge from the title, if there is one.
			doBadging(titleBadgeCount);
			console.groupEnd();
			return;
		}

		const sidebarElements =
			document.querySelectorAll(SIDEBAR_ELEMENTS_QUERY.selector) ?? [];
		console.debug('sidebarElements:', sidebarElements.length);

		let totalBadgeCount = 0;
		sidebarElements.forEach((sidebarElement) => {
			const badgeNode =
				SIDEBAR_ELEMENTS_QUERY.getBadgeNode(sidebarElement);
			console.debug(
				sidebarElement.textContent.replace(/\s/g, ''),
				'- badgeNode:',
				!!badgeNode
			);
			if (badgeNode) {
				const countStr = badgeNode.textContent.trim();
				const count = Number.parseInt(countStr, 10);
				if (!Number.isNaN(count)) {
					totalBadgeCount += count;
				}
			}
		});

		console.debug(`Badge count: ${totalBadgeCount}`);
		console.groupEnd();

		doBadging(totalBadgeCount);
	}

	setTitleObserver();
	setInterval(() => {
		crawlSidebarForUpdates();
	}, 60 * 1000);
})();
