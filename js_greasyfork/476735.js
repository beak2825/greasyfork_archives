// ==UserScript==
// @name         Cgit: copy commit reference
// @namespace    https://andrybak.dev
// @version      6
// @license      AGPL-3.0-only
// @author       Andrei Rybak
// @description  Adds a "Copy commit reference" button to every commit page on Cgit websites.
// @icon         https://git.zx2c4.com/cgit/plain/cgit.png
// @homepageURL  https://github.com/rybak/copy-commit-reference-userscript
// @supportURL   https://github.com/rybak/copy-commit-reference-userscript/issues
// @match        https://git.kernel.org/pub/scm/*/commit/*
// @match        https://git.zx2c4.com/*/commit/*
// @match        https://git.savannah.gnu.org/cgit/*/commit/*
// @match        https://cgit.freebsd.org/*/commit/*
// @match        https://git.kernel.dk/cgit/*/commit/*
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@d4905c247fedb40932bf07eebf3bf4c838e8d3d7/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476735/Cgit%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/476735/Cgit%3A%20copy%20commit%20reference.meta.js
// ==/UserScript==

/*
 * Copyright (C) 2023-2024 Andrei Rybak
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
	 * Implementation for cgit.
	 * Documentation:
	 *   - https://git.zx2c4.com/cgit/about/
	 *
	 * Example URLs for testing:
	 *   - https://git.kernel.org/pub/scm/git/git.git/commit/?h=main&id=1f0fc1db8599f87520494ca4f0e3c1b6fabdf997
	 *   - https://git.kernel.org/pub/scm/git/git.git/commit/?h=v2.42.0&id=43c8a30d150ecede9709c1f2527c8fba92c65f40
	 */
	class Cgit extends GitHosting {
		getTargetSelector() {
			return 'body > #cgit > .content > table.commit-info > tbody > tr:nth-child(3) td.sha1, body > #cgit > .content > table.commit-info > tbody > tr:nth-child(3) td.oid';
		}

		wrapButtonContainer(innerContainer) {
			const container = document.createElement('span');
			container.append(" (", innerContainer, ")");
			return container;
		}

		getButtonText() {
			// use all lowercase for consistency with the rest of the UI
			return "copy commit reference";
		}

		getFullHash() {
			const commitAnchor = document.querySelector('body > #cgit > .content > table.commit-info > tbody > tr:nth-child(3) td.sha1 a, body > #cgit > .content > table.commit-info > tbody > tr:nth-child(3) td.oid a');
			return commitAnchor.innerText;
		}

		getDateIso(hash) {
			const authorDateCell = document.querySelector('body > #cgit > .content > table.commit-info > tbody > tr:nth-child(1) td:nth-child(3)');
			return authorDateCell.innerText.slice(0, 'YYYY-MM-DD'.length);
		}

		getCommitMessage(hash) {
			const subjElem = document.querySelector('body > #cgit > .content > .commit-subject');
			/*
			 * Sometimes `subjElem` contains a `<span class="decoration">`,
			 * most notably, on tagged commits.  Avoid including the contents
			 * of this <span> tag by just taking the text of the first node,
			 * which is a text node.
			 */
			const subj = subjElem.childNodes[0].textContent;
			const body = document.querySelector('body > #cgit > .content > .commit-msg').innerText;
			/*
			 * Even though vast majority will only need `subj`, gather everything and
			 * let downstream code handle paragraph splitting.
			 */
			return subj + '\n\n' + body;
		}
	}

	CopyCommitReference.runForGitHostings(new Cgit());
})();
