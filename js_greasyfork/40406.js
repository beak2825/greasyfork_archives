// ==UserScript==
// @name        GitLab Sort Content
// @version     0.1.1-beta
// @description A userscript that makes some lists & markdown tables sortable
// @license     MIT
// @author      Rob Garrison
// @namespace   https://gitlab.com/Mottie
// @include     https://gitlab.com/*
// @run-at      document-idle
// @grant       GM.addStyle
// @require     https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.3.6/tinysort.min.js
// @icon        https://gitlab.com/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png
// @downloadURL https://update.greasyfork.org/scripts/40406/GitLab%20Sort%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/40406/GitLab%20Sort%20Content.meta.js
// ==/UserScript==
(() => {
	"use strict";
	/* example pages:
	tables/repo files - https://github.com/Mottie/GitLab-userscripts
	*/
	const sorts = ["asc", "desc"],
		icons = {
			white: {
				unsorted: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6bTAgMUgxbDcgN3oiIGZpbGw9IiNkZGQiIG9wYWNpdHk9Ii4yIi8+PC9zdmc+",
				asc: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6IiBmaWxsPSIjZGRkIi8+PHBhdGggZD0iTTE1IDlIMWw3IDd6IiBmaWxsPSIjZGRkIiBvcGFjaXR5PSIuMiIvPjwvc3ZnPg==",
				desc: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6IiBmaWxsPSIjZGRkIiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0xNSA5SDFsNyA3eiIgZmlsbD0iI2RkZCIvPjwvc3ZnPg=="
			},
			black: {
				unsorted: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6bTAgMUgxbDcgN3oiIGZpbGw9IiMyMjIiIG9wYWNpdHk9Ii4yIi8+PC9zdmc+",
				asc: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6IiBmaWxsPSIjMjIyIi8+PHBhdGggZD0iTTE1IDlIMWw3IDd6IiBmaWxsPSIjMjIyIiBvcGFjaXR5PSIuMiIvPjwvc3ZnPg==",
				desc: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTE1IDhIMWw3LTh6IiBmaWxsPSIjMjIyIiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0xNSA5SDFsNyA3eiIgZmlsbD0iIzIyMiIvPjwvc3ZnPg=="
			}
		};

	function initSortTable(el) {
		removeSelection();
		const dir = el.classList.contains(sorts[0]) ? sorts[1] : sorts[0],
			table = el.closest("table"),
			firstRow = $("tbody tr:first-child", table),
			link = $("a", firstRow),
			options = {
				order: dir,
				natural: true,
				selector: `td:nth-child(${el.cellIndex + 1})`
			};
		if (el.textContent.trim() === "Last update") {
			// sort repo age column using ISO 8601 datetime format
			options.selector += " time";
			options.attr = "datetime";
		}
		// Don't sort directory up row
		if (link && link.textContent === "..") {
			firstRow.classList.add("no-sort");
		}
		tinysort($$("tbody tr:not(.no-sort)", table), options);
		$$("th", table).forEach(elm => {
			elm.classList.remove(...sorts);
		});
		el.classList.add(dir);
	}

	function needDarkTheme() {
		let brightest = 0,
			// color will be "rgb(#, #, #)" or "rgba(#, #, #, #)"
			color = window.getComputedStyle(document.body).backgroundColor;
		const rgb = (color || "")
			.replace(/\s/g, "")
			.match(/^rgba?\((\d+),(\d+),(\d+)/i);
		if (rgb) {
			color = rgb.slice(1); // remove "rgb.." part from match
			color.forEach(c => {
				// http://stackoverflow.com/a/15794784/145346
				brightest = Math.max(brightest, parseInt(c, 10));
			});
			// return true if we have a dark background
			return brightest < 128;
		}
		// fallback to bright background
		return false;
	}

	function $(str, el) {
		return (el || document).querySelector(str);
	}

	function $$(str, el) {
		return Array.from((el || document).querySelectorAll(str));
	}

	function removeSelection() {
		// remove text selection - http://stackoverflow.com/a/3171348/145346
		const sel = window.getSelection ?
			window.getSelection() :
			document.selection;
		if (sel) {
			if (sel.removeAllRanges) {
				sel.removeAllRanges();
			} else if (sel.empty) {
				sel.empty();
			}
		}
	}

	function init() {
		const styles = needDarkTheme() ? icons.white : icons.black;

		GM.addStyle(`
			/* unsorted icon */
			[data-rich-type="markup"] thead th, .tree-table th, .wiki th {
				cursor:pointer;
				padding-right:22px !important;
				background-image:url(${styles.unsorted}) !important;
				background-repeat:no-repeat !important;
				background-position:calc(100% - 5px) center !important;
				text-align:left;
			}
			/* asc/dec icons */
			table thead th.asc {
				background-image:url(${styles.asc}) !important;
				background-repeat:no-repeat !important;
			}
			table thead th.desc {
				background-image:url(${styles.desc}) !important;
				background-repeat:no-repeat !important;
			}
		`);

		document.body.addEventListener("click", event => {
			const target = event.target;
			if (target && target.nodeType === 1 && target.nodeName === "TH") {
				// don't sort tables not inside of markdown,
				// except for the repo "code" tab file list
				if (target.closest(".blob-viewer, .tree-table, .wiki")) {
					return initSortTable(target);
				}
			}
		});
	}
	init();
})();
