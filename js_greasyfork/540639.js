// ==UserScript==
// @name		OzBargain User Tags & Votes
// @namespace	nategasm
// @version		1.12
// @description	Add customisable tags and track votes against users on OzBargain
// @author		nategasm
// @license		MIT
// @include		https://www.ozbargain.com.au/*
// @icon		https://www.ozbargain.com.au/favicon.ico
// @run-at		document-end
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540639/OzBargain%20User%20Tags%20%20Votes.user.js
// @updateURL https://update.greasyfork.org/scripts/540639/OzBargain%20User%20Tags%20%20Votes.meta.js
// ==/UserScript==

GM_addStyle(`
	.user-tag {
		margin-left: 3px;
	}
	.user-tag-name {
		padding: 1px 3px;
		margin-right: 3px;
		border-radius: 4px;
		font-weight: normal;
	}
	.user-tag .fa-tag {
		cursor: pointer;
	}
	.user-tag .fa-tag:hover {
		color: color-mix(in srgb, var(--shade2-bg) 90%, black) !important;
	}
	.user-tag .user-tag-votes {
		margin-right: 3px;
	}
	#tooltip.user-tag-modal {
		display: block;
		position: absolute;
		z-index: 10000;
		transition: opacity 0.3s ease;
		opacity: 1;
	}
	#tooltip.user-tag-modal.fade-out {
		opacity: 0;
	}
	.submitted strong:has(.user-tag),
	.submitted strong:has(.user-tag) a,
	.submitted strong:has(.user-tag-name) a,
	.submitted strong:has(.user-tag) .fa-tag {
		margin-right: 0px !important
	}
	.node .submitted strong:not(:has(.user-tag-name)) a {
		margin-right: 3px !important
	}
	.user-tag-modal input[type="color"] {
		width: 40px;
		height: 20px;
		padding: 2px;
		cursor: pointer;
	}
	#tooltip.user-tag-modal.left-offset::before {
		left: var(--arrow-offset, 50%);
	}
	#tooltip.user-tag-modal.above-icon::before {
		border-bottom: none;
		border-top-color: var(--tooltip-clr);
		top: 100%;
	}
`);

const DEFAULT_BG_COLOR = '#FFA500';
const DEFAULT_TEXT_COLOR = '#000000';
const TAG_STORAGE_KEY = 'userTagsById';
const VOTE_TRACKING_KEY = 'userTagsVoteTracking';
const VOTE_RULES_KEY = 'userTagsVoteRules';
const voteCooldown = new Set();

async function getTags() {
	return (await GM_getValue(TAG_STORAGE_KEY)) || {};
}
async function saveTags(tags) {
	await GM_setValue(TAG_STORAGE_KEY, tags);
}

async function isVoteTrackingEnabled() {
	return (await GM_getValue(VOTE_TRACKING_KEY)) !== false; //Default to true
}
async function setVoteTrackingEnabled(enabled) {
	await GM_setValue(VOTE_TRACKING_KEY, enabled);
}

async function isVoteRulesEnabled() {
	return (await GM_getValue(VOTE_RULES_KEY)) !== false; //Default to true
}
async function setVoteRulesEnabled(enabled) {
	await GM_setValue(VOTE_RULES_KEY, enabled);
}

async function setTag(userId, tag, bgColor, textColor, src) {
	const tags = await getTags();
	tags[userId] = {
		...(tags[userId] || {}),
		tag: tag?.trim() || undefined,
		bg: bgColor || undefined,
		txt: textColor || undefined,
		src: src || undefined
	};
	if (!tags[userId].tag && (!tags[userId].pV || tags[userId].pV === 0)
		&& (!tags[userId].nV || tags[userId].nV === 0)) {
		delete tags[userId];
	}
	await saveTags(tags);
}

async function clearAllTags() {
	if (confirm('Are you sure you want to delete tags for all users? \nThis cannot be reversed unless you have exported a backup')) {
	  await saveTags({});
	  alert('All tags deleted. Refresh to see changes');
	}
}

function extractUserId(anchor) {
	const match = anchor.getAttribute('href').match(/\/user\/(\d+)/);
	return match ? match[1] : null;
}

function closeExistingModal() {
	const existing = document.querySelector('.user-tag-modal');
	if (existing) existing.remove();
	//Close site tooltips
	const tooltip = document.querySelector('#tooltip');
	if (tooltip && getComputedStyle(tooltip).display !== 'none') {
		tooltip.querySelector('#tooltip-close')?.click();
	}
}

async function createTagElement(userId, tagData = {}, username = '', source, voteTracking, nodeGrid) {
	const wrapper = document.createElement('span');
	wrapper.classList.add('user-tag');
	let userTag;
	let userVotes;
	//Get votes
	if (voteTracking && (tagData.pV || tagData.nV)) {
		const voteCount = (tagData.pV || 0) - (tagData.nV || 0);
		userVotes = document.createElement('span');
		userVotes.classList.add('user-tag-votes');
		userVotes.textContent = `${nodeGrid ? ' ' : ''}[${voteCount >= 0 ? '+' : ''}${voteCount}]`;
		userVotes.title = `${tagData.pV || 0} upvotes, ${tagData.nV || 0} downvotes`;
	}
	//Get tag
	if (tagData.tag) {
		userTag = document.createElement('span');
		userTag.classList.add('user-tag-name');
		userTag.textContent = tagData.tag;
		userTag.style.backgroundColor = tagData.bg || DEFAULT_BG_COLOR;
		userTag.style.color = tagData.txt || DEFAULT_TEXT_COLOR;
		if (nodeGrid && !userVotes) userTag.style.marginLeft = '3px';
	}

	const icon = document.createElement('span');
	icon.classList.add('fa','fa-tag');
	icon.title = 'Edit tag';
	icon.addEventListener('click', async (e) => {
		e.stopPropagation();
		closeExistingModal();

		const modal = document.createElement('div');
		modal.setAttribute('id', 'tooltip');
		modal.classList.add('user-tag-modal');

		const head = document.createElement('div');
		head.setAttribute('id', 'tooltip-head');
		const headClose = document.createElement('i');
		headClose.setAttribute('id', 'tooltip-close');
		headClose.classList.add('fa','fa-times');
		headClose.onclick = () => fadeOutAndRemove(modal);
		const headTitle = document.createElement('div');
		headTitle.setAttribute('id', 'tooltip-title');
		headTitle.textContent = 'User Tag Editor';
		head.appendChild(headClose);
		head.appendChild(headTitle);

		const label = document.createElement('label');
		label.innerHTML = `<b>${username}</b>`;
		let sourceLink;
		if (tagData.tag && source) {
			sourceLink = document.createElement('a');
			sourceLink.classList.add('internal');
			sourceLink.href = '/' + source;
			sourceLink.textContent = '[Src]';
			sourceLink.title = 'Source where tag was created';
			sourceLink.style.marginLeft = '3px';
		}
		label.innerHTML = `<b>${username}</b>`;
		const input = document.createElement('input');
		input.type = 'text';
		input.value = tagData.tag || '';
		input.style.marginTop = '5px';
		input.style.marginBottom = '7px';
		input.style.width = '100%';
		input.style.boxSizing = 'border-box';
		input.style.textAlign = 'center';
		input.placeholder = 'Enter user tag';

		const bgColorInput = document.createElement('input');
		bgColorInput.type = 'color';
		bgColorInput.value = /^#[0-9A-Fa-f]{6}$/.test(tagData.bg) ? tagData.bg : DEFAULT_BG_COLOR;
		bgColorInput.style.marginTop = '8px';
		bgColorInput.style.marginBottom = '8px';

		const textColorInput = document.createElement('input');
		textColorInput.type = 'color';
		textColorInput.value = /^#[0-9A-Fa-f]{6}$/.test(tagData.txt) ? tagData.txt : DEFAULT_TEXT_COLOR;
		textColorInput.style.marginBottom = '8px';

		const preview = document.createElement('span');
		preview.textContent = input.value;
		preview.style.padding = '2px 4px';
		preview.style.borderRadius = '4px';
		preview.style.backgroundColor = bgColorInput.value;
		preview.style.color = textColorInput.value;
		preview.style.fontSize = 'smaller';

		function updatePreview() {
			preview.textContent = input.value;
			preview.style.backgroundColor = bgColorInput.value;
			preview.style.color = textColorInput.value;
		}

		input.addEventListener('input', updatePreview);
		bgColorInput.addEventListener('input', updatePreview);
		textColorInput.addEventListener('input', updatePreview);

		const resetBtn = document.createElement('button');
		resetBtn.textContent = 'Reset Colour';
		resetBtn.classList.add('btn');
		resetBtn.style.marginRight = '5px';
		resetBtn.style.padding = '0px 8px';
		resetBtn.onclick = () => {
			bgColorInput.value = DEFAULT_BG_COLOR;
			textColorInput.value = DEFAULT_TEXT_COLOR;
			updatePreview();
		};

		const saveBtn = document.createElement('button');
		saveBtn.textContent = 'Save Tag';
		saveBtn.classList.add('btn','btn-primary');
		saveBtn.style.padding = '0px 8px';
		saveBtn.onclick = async () => {
			let bg = bgColorInput.value;
			let txt = textColorInput.value;
			if (!input.value) {
				source = undefined;
				bg = undefined;
				txt = undefined;
			}
			await setTag(userId, input.value, bg, txt, source);
			refreshUser(userId, voteTracking);
			fadeOutAndRemove(modal);
		};

		input.addEventListener('keydown', async (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				await saveBtn.onclick();
			}
		});

		const toggleVotesCheckbox = document.createElement('input');
		toggleVotesCheckbox.type = 'checkbox';
		toggleVotesCheckbox.id = 'toggleVotes';
		toggleVotesCheckbox.style.marginBottom = '6px';
		toggleVotesCheckbox.checked = await isVoteTrackingEnabled();
		toggleVotesCheckbox.style.cursor = 'pointer';
		toggleVotesCheckbox.addEventListener('change', async () => {
			await setVoteTrackingEnabled(toggleVotesCheckbox.checked);
			alert('Vote tracking setting saved. Refresh page to apply');
		});
		toggleVotesCheckbox.title = 'Disabling will stop local vote tracking per user and remove them from display';

		const toggleVotesLabel = document.createElement('label');
		toggleVotesLabel.htmlFor = 'toggleVotes';
		toggleVotesLabel.textContent = 'Vote tracking';
		toggleVotesLabel.title = toggleVotesCheckbox.title;

		const toggleVoteRulesCheckbox = document.createElement('input');
		toggleVoteRulesCheckbox.type = 'checkbox';
		toggleVoteRulesCheckbox.id = 'toggleVoteRules';
		toggleVoteRulesCheckbox.style.marginBottom = '6px';
		toggleVoteRulesCheckbox.checked = await isVoteRulesEnabled();
		toggleVoteRulesCheckbox.style.cursor = 'pointer';
		toggleVoteRulesCheckbox.addEventListener('change', async () => {
			await setVoteRulesEnabled(toggleVoteRulesCheckbox.checked);
		});
		toggleVoteRulesCheckbox.title = `Disabling will allow local vote tracking where Ozbargain does not normally allow voting. This happens when a deal or comment is too old, for revoked votes, and when a comment hasn't been posted for negative deal votes`;

		const toggleRulesLabel = document.createElement('label');
		toggleRulesLabel.htmlFor = 'toggleVoteRules';
		toggleRulesLabel.textContent = '\u00A0\u00A0Voting rules';
		toggleRulesLabel.title = toggleVoteRulesCheckbox.title;

		const voteInfo = document.createElement('div');
		const net = (tagData.pV || 0) - (tagData.nV || 0);
		voteInfo.innerHTML = `<b>Votes:</b> +${tagData.pV || 0} / -${tagData.nV || 0} [<b>${net > 0 ? '+' : ''}${net}</b>]`;

		const resetVotesBtn = document.createElement('button');
		resetVotesBtn.textContent = 'Reset Votes';
		resetVotesBtn.classList.add('btn');
		resetVotesBtn.style.fontSize = '13px';
		resetVotesBtn.style.padding = '0px 4px';
		resetVotesBtn.style.marginLeft = '10px';
		resetVotesBtn.onclick = async () => {
			if (!tagData.pV && !tagData.nV) return;
			if (confirm(`Are you sure you want to reset votes for ${username}?`)) {
				tagData.pV = 0;
				tagData.nV = 0;
				const tags = await getTags();
				tags[userId] = tagData;
				if (!tags[userId].tag && (!tags[userId].pV || tags[userId].pV === 0)
					&& (!tags[userId].nV || tags[userId].nV === 0)) {
					delete tags[userId];
				}
				await saveTags(tags);
				refreshUser(userId, voteTracking);
				fadeOutAndRemove(modal);
			}
		};
		voteInfo.appendChild(resetVotesBtn);

		const exportBtn = document.createElement('button');
		exportBtn.textContent = 'Export Data';
		exportBtn.classList.add('btn');
		exportBtn.style.fontSize = '13px';
		exportBtn.style.padding = '0px 4px';
		exportBtn.style.marginRight = '5px';
		exportBtn.onclick = async () => {
			const tags = await getTags();
			const blob = new Blob([JSON.stringify(tags, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			const currentDate = new Date();
			let month;
			if (currentDate.getMonth() < 9) {
				month = '0' + (currentDate.getMonth() + 1);
			} else {
				month = currentDate.getMonth() + 1;
			}
			let day;
			if (currentDate.getDate() < 10) {
				day = '0' + currentDate.getDate();
			} else {
				day = currentDate.getDate();
			}
			a.href = url;
			a.download = 'OzB_Usertags_Backup_' + currentDate.getFullYear() + month + day + '.json';
			a.click();
		};

		const importBtn = document.createElement('button');
		importBtn.textContent = 'Import Data';
		importBtn.classList.add('btn');
		importBtn.style.fontSize = '13px';
		importBtn.style.padding = '0px 4px';
		importBtn.style.marginRight = '5px';
		importBtn.onclick = () => {
			if (confirm(`Are you sure you want to import data? \nThis will overwrite existing user tags if they are also in the import but votes will be merged/added together \nNew users from Import will be added. Existing users not in import will be kept`)) {
				const input = document.createElement('input');
				input.type = 'file';
				input.accept = 'application/json';
				input.onchange = async (e) => {
					const file = e.target.files[0];
					if (file) {
						const text = await file.text();
						try {
							const importedTags = JSON.parse(text);
							const existingTags = await getTags();
							//Overwrite tag,bg,txt,src. Add pV,nV
							for (const userId in importedTags) {
								const imported = importedTags[userId];
								const existing = existingTags[userId] || {};
								existingTags[userId] = {
									tag: imported.tag !== undefined ? imported.tag : existing.tag,
									bg: imported.bg !== undefined ? imported.bg : existing.bg,
									txt: imported.txt !== undefined ? imported.txt : existing.txt,
									src: imported.src !== undefined ? imported.src : existing.src,
									pV: (existing.pV || 0) + (imported.pV || 0),
									nV: (existing.nV || 0) + (imported.nV || 0),
								};
							}
							await saveTags(existingTags);
							alert('Tags imported and merged! \nRefresh the page to see changes');
							addTags(); //Refresh tags on the page
						} catch (err) {
							alert('Error importing: Invalid JSON');
						}
					}
				};
				input.click();
			}
		};
		const deleteAllBtn = document.createElement('button');
		deleteAllBtn.textContent = 'Delete All';
		deleteAllBtn.classList.add('btn');
		deleteAllBtn.style.fontSize = '13px';
		deleteAllBtn.style.padding = '0px 4px';
		deleteAllBtn.onclick = clearAllTags;

		modal.appendChild(head);
		const tooltip = document.createElement('div');
		tooltip.classList.add('tooltip','tooltipuser');
		tooltip.style.textAlign = 'center';
		tooltip.appendChild(label);
		if (tagData.tag && source) tooltip.appendChild(sourceLink);
		tooltip.appendChild(document.createElement('br'));
		tooltip.appendChild(input);
		tooltip.appendChild(document.createElement('br'));
		tooltip.appendChild(preview);
		tooltip.appendChild(document.createElement('br'));
		tooltip.appendChild(document.createTextNode('BG: '));
		tooltip.appendChild(bgColorInput);
		tooltip.appendChild(document.createTextNode('\u00A0\u00A0Text: '));
		tooltip.appendChild(textColorInput);
		tooltip.appendChild(document.createElement('br'));
		tooltip.appendChild(resetBtn);
		tooltip.appendChild(saveBtn);
		tooltip.appendChild(document.createElement('hr'));
		tooltip.appendChild(toggleVotesLabel);
		tooltip.appendChild(toggleVotesCheckbox);
		tooltip.appendChild(toggleRulesLabel);
		tooltip.appendChild(toggleVoteRulesCheckbox);
		tooltip.appendChild(voteInfo);
		tooltip.appendChild(document.createElement('hr'));
		tooltip.appendChild(exportBtn);
		tooltip.appendChild(importBtn);
		tooltip.appendChild(deleteAllBtn);
		modal.appendChild(tooltip);
		document.body.appendChild(modal);
		positionModalUnderIcon(modal, e.currentTarget);
	});
	if (nodeGrid) {
		wrapper.appendChild(icon);
		if (userVotes) wrapper.appendChild(userVotes);
		if (userTag) wrapper.appendChild(userTag);
	} else {
		if (userTag) wrapper.appendChild(userTag);
		if (userVotes) wrapper.appendChild(userVotes);
		wrapper.appendChild(icon);
	}
	return wrapper;
}

function positionModalUnderIcon(modal, iconElement, modalWidth = 253, modalHeight = 310, verticalOffset = 10) {
	const iconRect = iconElement.getBoundingClientRect();
	let top = iconRect.bottom + window.scrollY + verticalOffset;
	let left = iconRect.left + window.scrollX + (iconRect.width / 2) - (modalWidth / 2);
	const viewportWidth = document.documentElement.clientWidth;
	const viewportHeight = document.documentElement.clientHeight;
	// Adjust right overflow
	if (left + modalWidth > window.scrollX + viewportWidth) {
		left = window.scrollX + viewportWidth - modalWidth - 10;
		modal.classList.add('left-offset');
		const arrowOffset = iconRect.left + iconRect.width / 2 - left;
		modal.style.setProperty('--arrow-offset', `${arrowOffset}px`);
	}
	// Adjust left overflow
	if (left < window.scrollX) {
		left = window.scrollX + 10;
		modal.classList.add('left-offset');
		const arrowOffset = iconRect.left + iconRect.width / 2 - left;
		modal.style.setProperty('--arrow-offset', `${arrowOffset}px`);
	}
	// Adjust bottom overflow (show above icon)
	if (top + modalHeight > window.scrollY + viewportHeight) {
		top = iconRect.top + window.scrollY - modalHeight - verticalOffset;
		modal.classList.add('above-icon');
	}
	modal.style.top = `${top}px`;
	modal.style.left = `${left}px`;
}

function fadeOutAndRemove(el) {
	if (!el) return;
	el.classList.add('fade-out');
	setTimeout(() => el.remove(), 300); //300ms matches the CSS transition
}

async function handleVoteClick(voteBtn, delta) {
	const container = voteBtn.closest('.c-vote, .n-vote');
	if (!container) return;
	const meta = voteBtn.closest('.meta, .node');
	if (!meta) return;
	const voteRules = await isVoteRulesEnabled();
	if (voteRules && meta.classList.contains('meta')) { //Check aged comments
		const commentDateStr = meta?.querySelector('.c-link')?.textContent?.trim();
		if (isPostOlderThan(commentDateStr,30)) return;
	}
	const hasPending = container.classList.contains('pending');
	//Stop repeat votes when already voted
	if (hasPending && container.classList.contains('voteup') && delta > 0) return;
	if (hasPending && container.classList.contains('votedown') && delta < 0) return;
	const hasInact = container.classList.contains('inact');
	let anchor;
	if (meta.classList.contains('node-page')) { //Detect grid nodes
		anchor = meta.querySelector('.submitted a[href^="/user/"]');
	} else {
		anchor = meta.querySelector('.submitted strong a[href^="/user/"]');
	}
	const userId = extractUserId(anchor);
	if (!userId || voteCooldown.has(userId)) return;
	//Wait and see if deal votes get accepted due to negative comment requirements, revoked votes and aged deals
	if (voteRules && meta.classList.contains('node')) {
		setTimeout(() => {
			const newContainer = voteBtn.closest('.n-vote');
			if (newContainer.classList.contains('inact')) return;
			processVoteResult(userId, delta, hasPending, hasInact);
		}, 300); //Update time is inconsistent
	} else {
		processVoteResult(userId, delta, hasPending, hasInact);
	}
}

async function processVoteResult(userId, delta, hasPending, hasInact) {
	const tags = await getTags();
	tags[userId] = tags[userId] || {};
	// Vote change logic
	if (hasPending) {
		// User is changing their vote
		if (delta > 0) {
			// Changing from negative to positive
			tags[userId].nV = Math.max((tags[userId].nV || 1) - 1, 0);
			tags[userId].pV = (tags[userId].pV || 0) + 1;
		} else if (delta < 0) {
			// Changing from positive to negative
			tags[userId].pV = Math.max((tags[userId].pV || 1) - 1, 0);
			tags[userId].nV = (tags[userId].nV || 0) + 1;
		} else {
			// Same vote clicked again, no changes
			return;
		}
	} else if (hasInact) {
		// First time voting
		if (delta > 0) tags[userId].pV = (tags[userId].pV || 0) + 1;
		else tags[userId].nV = (tags[userId].nV || 0) + 1;
	} else {
		// Already voted and no change allowed (or multiple clicks)
		return;
	}
	await saveTags(tags);
	refreshUser(userId, true, tags);
	voteCooldown.add(userId);
	setTimeout(() => voteCooldown.delete(userId), 100); //debounce
}

async function observeMobileVoteTooltip() {
	if (!document.body.classList.contains('m')) return;
	if (!await isVoteTrackingEnabled()) return;
	const processTooltip = (node) => {
		const aTags = node.querySelectorAll('a[onclick*="voteComment"]');
		const upLi = node.querySelector('a[onclick*="voteComment"] span.cvb.voteup')?.closest('li');
		const downLi = node.querySelector('a[onclick*="voteComment"] span.cvb.votedown')?.closest('li');
		const canChangeVote = upLi && downLi;
		if (!canChangeVote) return;
		const alreadyVoted = [...node.querySelectorAll('.tooltip-menu li a')]
		.find(link => link.textContent.toLowerCase().includes('already voted'));
		//Track what was already voted to prevent it being voted again
		let alreadyVotedDelta;
		if (alreadyVoted) {
			const span = alreadyVoted.querySelector('span');
			if (span?.classList.contains('voteup')) {
				alreadyVotedDelta = 1;
			} else if (span?.classList.contains('votedown')) {
				alreadyVotedDelta = -1;
			}
		}
		aTags.forEach((aTag) => {
			const voteMatch = aTag.getAttribute('onclick')?.match(/\bvoteComment\((\d+),\s*(-?1)\)/);
			if (!voteMatch) return;
			const [, commentId, vote] = voteMatch;
			const delta = parseInt(vote, 10);
			if (!commentId || !delta) return;
			if (alreadyVotedDelta === delta) return;
			if (aTag.dataset.listenerAdded) return;
			aTag.dataset.listenerAdded = 'true';
			aTag.addEventListener('click', async () => {
				const meta = document.querySelector(`.meta .c-link[data-cid="${commentId}"]`)?.closest('.meta');
				const voteRules = await isVoteRulesEnabled();
				if (voteRules) {
					const commentDateStr = meta?.querySelector('.c-link')?.textContent?.trim();
					if (isPostOlderThan(commentDateStr,30)) return;
				}
				const container = meta?.querySelector('.c-vote, .n-vote');
				if (!container && !container.classList.contains('inact') && !container.classList.contains('pending')) return;
				const anchor = meta.querySelector('.submitted strong a[href^="/user/"]');
				const userId = extractUserId(anchor);
				if (!userId || voteCooldown.has(userId)) return;
				processVoteResult(userId, delta, alreadyVoted, !alreadyVoted);
			}, true)
		});
	};

	let debounceTimeout = null;
	const tooltipStyleObserver = new MutationObserver((mutations) => {
		if (debounceTimeout) return;
		debounceTimeout = setTimeout(() => {
			debounceTimeout = null; //Reset debounce
			for (const mutation of mutations) {
				if (mutation.attributeName === 'style') {
					const tooltip = mutation.target;
					if (tooltip.style.display !== 'none') {
						processTooltip(tooltip);
					}
				}
			}
		}, 100); //Run after 100ms pause to account for burst style changes
	});

	const mainObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === 1 && node.id === 'tooltip') {
					//First-time tooltip insertion
					tooltipStyleObserver.observe(node, {
						attributes: true,
						attributeFilter: ['style']
					});
					if (node.style.display !== 'none') {
						processTooltip(node);
					}
				}
			});
		}
	});
	mainObserver.observe(document.body, { childList: true, subtree: false });
}

function isPostOlderThan(dateStr, days) {
	if (!dateStr) return false;
	//If there is 'ago' then the comment is always less than 30 days old
	if (/ago$/i.test(dateStr)) {
		return false;
	}
	const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
	if (!match) return false;
	const [ , day, month, year ] = match;
	const commentDate = new Date(`${year}-${month}-${day}T00:00:00`);
	const now = new Date();
	const diffInDays = (now - commentDate) / (1000 * 60 * 60 * 24);
	return diffInDays > days;
}

async function addTags() {
	const tags = await getTags();
	const voteTracking = await isVoteTrackingEnabled();
	if (location.href.indexOf('/user/') > 0) {
		const userId = location.pathname.split("/")[2];
		if (!userId) return;
		if (!document.querySelector('.user-tag')) {
			const title = document.querySelector('h1#title');
			const username = title?.textContent?.match(/^(.+?)\s*»/)?.[1];
			const source = tags[userId]?.src || 'user/' + userId;
			const tagEl = await createTagElement(userId, tags[userId], username, source, voteTracking);
			tagEl.style.position = 'relative';
			tagEl.style.top = '-3px';
			title.style.display = 'inline-block';
			title.style.marginRight = '5px';
			title.insertAdjacentElement('afterend', tagEl);
		}
	} else {
		const anchors = document.querySelectorAll('.submitted a[href^="/user/"]');
		for (const a of anchors) {
			const userId = extractUserId(a);
			if (!userId) continue;
			if (!a.parentElement.querySelector('.user-tag')) {
				const username = a.textContent.trim();
				const node = a.closest('.meta, .node');
				const nodeGrid = node?.parentElement.classList.contains('nodegrid');
				const source = tags[userId]?.src || getTagSource(node);
				const tagEl = await createTagElement(userId, tags[userId], username, source, voteTracking, nodeGrid);
				if (nodeGrid) a.parentElement.appendChild(document.createElement('br'));
				a.parentElement.appendChild(tagEl);
			}
		}
	}
	//Add click listeners to all clickable votes if enabled
	if (voteTracking) {
		document.querySelectorAll('.c-vote.inact .cvb.voteup, .n-vote.inact .nvb.voteup').forEach(btn => {
			if (!btn.dataset.listenerAdded) {
				btn.dataset.listenerAdded = 'true';
				btn.addEventListener('click', () => handleVoteClick(btn, 1));
			}
		});
		document.querySelectorAll('.c-vote.inact .cvb.votedown, .n-vote.inact .nvb.votedown').forEach(btn => {
			if (!btn.dataset.listenerAdded) {
				btn.dataset.listenerAdded = 'true';
				btn.addEventListener('click', () => handleVoteClick(btn, -1));
			}
		});
	}
}

async function refreshUser(userId, voteTracking, tags) {
	if (!tags) {
		tags = await getTags();
	}
	if (location.href.indexOf('/user/') > 0) {
		const title = document.querySelector('h1#title');
		const existingTag = title.parentElement.querySelector('.user-tag');
		if (existingTag) existingTag.remove();
		const username = title?.getAttribute('data-title')?.match(/^(.+?)\s+\(#\d+\)/)?.[1];
		const source = tags[userId]?.src || 'user/' + userId;
		const tagEl = await createTagElement(userId, tags[userId], username, source, voteTracking);
		tagEl.style.position = 'relative';
		tagEl.style.top = '-3px';
		title.style.display = 'inline-block';
		title.style.marginRight = '5px';
		title.insertAdjacentElement('afterend', tagEl);
	} else {
		const anchors = document.querySelectorAll(`.submitted a[href="/user/${userId}"]`);
		for (const a of anchors) {
			const existingTag = a.parentElement.querySelector('.user-tag');
			if (existingTag) existingTag.remove();
			const username = a.textContent.trim();
			const node = a.closest('.meta, .node');
			const nodeGrid = node?.parentElement.classList.contains('nodegrid');
			const source = tags[userId]?.src || getTagSource(node);
			const tagEl = await createTagElement(userId, tags[userId], username, source, voteTracking, nodeGrid);
			a.parentElement.appendChild(tagEl);
		}
	}
}

function getTagSource(node) {
	if (node?.classList.contains('node-forum')) {
		return 'node/' + location.href.match(/\/node\/(\d+)/)?.[1];
	} else if (node?.classList.contains('node')) {
		return 'node/' + node.id.match(/^node(\d+)$/)?.[1];
	} else if (node?.classList.contains('meta')) {
		return 'comment/' + node.querySelector('.c-link')?.dataset.cid + '/redir';
	} else if (!node) { // Private messages
		return 'privatemsg/view/' + document.querySelector('.horizontal-participants')?.id.match(/\d+$/)?.[0];
	}
}

function observePages() { //Observe pages that can dynamically load nodes/comments
	const infScroll = document.querySelector(".infscrollbtn"); //Pages with infinite scroll
	const hiddenNode = document.querySelector(".comment.hidden"); //Pages with hidden commments
	if (infScroll || hiddenNode) {
		const callback = (mutationList, observer) => {
			for (const mutation of mutationList) {
				if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className && (mutation.addedNodes[0].classList.contains("comment") || mutation.addedNodes[0].classList.contains("node")) ) {
					addTags();
				}
			}
		};
		const observer = new MutationObserver(callback);
		observer.observe(document.body, { childList: true, subtree: true });
	}
}

addTags();
observePages();
observeMobileVoteTooltip();