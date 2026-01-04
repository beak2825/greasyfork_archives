// ==UserScript==
// @name         GitWeb: copy commit reference
// @namespace    https://andrybak.dev
// @version      5
// @license      AGPL-3.0-only
// @author       Andrei Rybak
// @description  Adds a "Copy commit reference" button to every commit page on GitWeb websites.
// @icon         https://repo.or.cz/git-favicon.png
// @homepageURL  https://github.com/rybak/copy-commit-reference-userscript
// @supportURL   https://github.com/rybak/copy-commit-reference-userscript/issues
// @match        https://repo.or.cz/*/commit/*
// @match        https://git.savannah.gnu.org/gitweb/*a=commit*
// @match        https://git.ffmpeg.org/gitweb/*/commit/*
// @match        http://localhost:1234/*a=commit*
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@1306877cef88bb8792c0851e31454d9b7a82b262/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476739/GitWeb%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/476739/GitWeb%3A%20copy%20commit%20reference.meta.js
// ==/UserScript==

/*
 * Copyright (C) 2023-2025 Andrei Rybak
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

(function () {
	'use strict';

	/*
	 * Implementation for GitWeb
	 * Documentation:
	 *   - https://git-scm.com/docs/gitweb
	 *   - https://git-scm.com/book/en/v2/Git-on-the-Server-GitWeb
	 *
	 * Example URL for userscript testing:
	 *   - https://repo.or.cz/alt-git.git/commit/1f0fc1db8599f87520494ca4f0e3c1b6fabdf997
	 *
	 * TODO maybe add support for commitdiff pages, e.g.:
	 *     https://repo.or.cz/alt-git.git/commitdiff/1f0fc1db8599f87520494ca4f0e3c1b6fabdf997
	 */
	class GitWeb extends GitHosting {
		getTargetSelector() {
			if (document.querySelector('.page_nav_sub')) {
				return '.page_nav_sub';
			}
			return '.page_nav';
		}

		wrapButtonContainer(innerContainer) {
			const barSeparator = document.createElement('span');
			barSeparator.append(document.createTextNode(' | '));
			/*
			 * CSS class is from 09deab1 (gitweb: enclose ' · ' and ' | ' in span tags, 2015-04-12)
			 * https://repo.or.cz/git/gitweb.git/commit/09deab16f1feac32142bd6db4cd15294a26915a5
			 */
			barSeparator.classList.add('barsep');
			const container = document.createElement('span');
			container.append(barSeparator);
			const tab = document.createElement('span');
			tab.classList.add('tab');
			tab.append(innerContainer);
			container.append(tab);
			return container;
		}

		addButtonContainerToTarget(target, buttonContainer) {
			if (target.classList.contains('page_nav_sub')) {
				super.addButtonContainerToTarget(target, buttonContainer);
				return;
			}
			target.insertBefore(buttonContainer, target.querySelector('br'));
		}

		getButtonText() {
			// use all lowercase for consistency with the rest of the UI
			return "copy commit reference";
		}

		getFullHash() {
			/*
			 * <td>commit</td> is always above <td>parent</td> and <td>tree</td>
			 * so it's fine to just take the first <td> with CSS class `sha1`.
			 */
			const cell = document.querySelector('.title_text .object_header td.sha1');
			return cell.innerText;
		}

		getDateIso(hash) {
			/*
			 * <td>author</td> is always above <td>committer</td>
			 * so it's fine to just take the first <td> with CSS class `sha1`.
			 */
			const cell = document.querySelector('.title_text .object_header .datetime');
			const s = cell.innerText;
			const d = new Date(s);
			return d.toISOString().slice(0, 'YYYY-MM-DD'.length);
		}

		getCommitMessage(hash) {
			return document.querySelector('.page_body').innerText;
		}
	}

	CopyCommitReference.runForGitHostings(new GitWeb());
})();
