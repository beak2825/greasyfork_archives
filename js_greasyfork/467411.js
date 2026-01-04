// ==UserScript==
// @name           AO3 Formatted Copy
// @namespace      https://github.com/w4tchdoge
// @version        2.7.1-20260102_220051
// @description    Copy the curretly open AO3 work in the folloring MarkDown format '- [work name](work url) – [author name](author url) — '
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://archiveofourown.org/*works/*
// @match          *://archiveofourown.org/chapters/*
// @match          *://archiveofourown.org/*series/*
// @match          *://archiveofourown.org/*bookmarks/*
// @match          *://archiveofourown.org/*works/*/bookmarks
// @match          *://archiveofourown.gay/*works/*
// @match          *://archiveofourown.gay/chapters/*
// @match          *://archiveofourown.gay/*series/*
// @match          *://archiveofourown.gay/*bookmarks/*
// @match          *://archiveofourown.gay/*works/*/bookmarks
// @icon           https://archiveofourown.org/favicon.ico
// @grant          GM_setClipboard
// @grant          GM.setClipboard
// @grant          GM_registerMenuCommand
// @grant          GM.registerMenuCommand
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license        AGPL-3.0-or-later
// @history        2.7.1 — Make the script work on AO3 chapter pages where the URL doesn't contain `works`
// @history        2.7.0 — Add Initially Read Formatted Copy functionality
// @history        2.6.1 — Fix the already read chapters input in re-read function not being padded correctly
// @history        2.6.0 — Cleanup; Add feature to re-read that adds how many chapters have already beed re-read
// @history        2.5.1 — Fix script not running on series pages
// @history        2.5.0 — Rewrite a bunch of code so that the re-read & note formats can be called from the bookmark pages where it will add the bookmark link to the output text
// @history        2.4.2 — Add a match rule for series pages
// @history        2.4.1 — Modify the match rule so that it matches collections/*/works URLs as well; Add an exlude role so it doesn't work on works/*/bookmarks pages as it isn't designed to
// @history        2.4.0 — Add ability to copy work as a generic Note formatting for the Notes section
// @history        2.3.4 — Fix Re-read Formatting not escaping underscores that are not part of a URL
// @downloadURL https://update.greasyfork.org/scripts/467411/AO3%20Formatted%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/467411/AO3%20Formatted%20Copy.meta.js
// ==/UserScript==

(function () {
	function html_decode(txt_str) {
		let doc = new DOMParser().parseFromString(txt_str, `text/html`);
		return doc.documentElement.textContent;
	}

	function GetPadAmt(input_array) {
		const max_num_len = parseInt(input_array.reduce((a, b) => Math.max(a, b), -Infinity)).toString().length;
		if (max_num_len < 2) {
			return 2;
		} else {
			return max_num_len;
		}
	}

	const curr_page_url = new URL(window.location);

	// Regular Expressions used in multiple Format Copy functions
	const
		re_mu = /(?<!(\\|http(\S(\S+?))?))(_)/gmi,                                             /* Regex for escaping underscores that are not part of URLs for Markdown */
		re_ms = /(~|\*)/gmi,                                                                   /* Regex for escaping characters used in MD syntax that may appear in work or series titles – DO NO USE ON ANYTHING THAT COULD CONTAIN A URL */
		re_ap = /’|ʼ|‘/gmi,                                                                    /* Regex for replacing multiple apostrophe-like characters with an apostrophe */
		re_ck = /(^https?:\/\/)(.*\.)?(archiveofourown\.org)(.*?)(\/(works|series|chapters)\/\d+)\/?.*(?<!\/bookmarks)$/gmi,
		re_bmk_url_1 = /(^https?:\/\/)(.*\.)?(archiveofourown\.org)(.*?)(\/(works)\/\d+)(\/bookmarks)$/,
		re_bmk_url_2 = /(^https?:\/\/)(.*\.)?(archiveofourown\.org)(.*?)(\/(bookmarks)\/\d+)/;


	function AO3_genWork_Copy(s_t) {
		// Regular Expressions used only in this function
		const
			re_wu = /(^https?:\/\/)(.*\.)?(archiveofourown\.org)(.*?)(\/works\/\d+)\/?.*$/gmi;    /* Regex for extracting work URL without specific chapter */

		// Get Work Title & Work URL
		const [work_title, work_url] = (() => {
			const
				work_title_detect = document.querySelector(`#main .title`),
				work_title_bkmrk = document.querySelector(`.bookmark.index.group h4.heading a`);

			if (Boolean(work_title_detect)) {
				const
					work_title = html_decode(work_title_detect.textContent.trim().replace(re_ap, `'`).replace(re_ms, `\\$1`)),
					work_url = curr_page_url.href.replace(re_wu, `$1$3$5`);
				return [work_title, work_url];
			} else {
				const
					work_title = html_decode(work_title_bkmrk.textContent.trim().replace(re_ap, `'`).replace(re_ms, `\\$1`)),
					work_url = work_title_bkmrk.href.replace(re_wu, `$1$3$5`);
				return [work_title, work_url];
			}
		})();

		console.log(
			`
Work Title:
${work_title}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		console.log(
			`
Work URL:
${work_url}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		// Getting the array of Authors of a work
		const [a_nm, a_pg, authors] = (() => {
			const
				a_nm = [],
				a_pg = [],
				authors = [];

			// Getting authors from Bookmark pages
			if (curr_page_url.pathname.includes(`/bookmarks`)) {
				// Check for Anonymous author
				// auth_anon_check = 1 → Author is anonymous
				// auth_anon_check > 1 → Author is NOT anonymous
				const auth_anon_check = document.querySelector(`.bookmark.index.group .header > h4.heading`).childElementCount;

				switch (true) {
					case (auth_anon_check <= 1):
						a_nm.push(`Anonymous`);
						a_pg.push(`https://archiveofourown.org/collections/anonymous`);
						authors.push(`Anonymous`);
						return [a_nm, a_pg, authors];

					case (auth_anon_check > 1):
						const auth_list = Array.from(document.querySelectorAll(`.bookmark.index.group .header > h4.heading > a[rel='author']`));
						auth_list.forEach(function (elm) {
							a_nm.push(elm.textContent.replace(re_ms, `\\$1`));
							a_pg.push(elm.href);
							authors.push(`[${elm.textContent.replace(re_ms, `\\$1`)}](${elm.href})`);
						});
						return [a_nm, a_pg, authors];

					default:
						throw Error();
				}
			}
			// Getting authors from normal Work pages
			else {
				// Check for Anonymous author
				// auth_anon_check = 0 → Author is anonymous
				// auth_anon_check > 0 → Author is NOT anonymous
				const auth_anon_check = document.querySelector(`#workskin > .preface > .byline`).childElementCount;

				switch (true) {
					case (auth_anon_check < 1):
						a_nm.push(`Anonymous`);
						a_pg.push(`https://archiveofourown.org/collections/anonymous`);
						authors.push(`Anonymous`);
						return [a_nm, a_pg, authors];

					case (auth_anon_check >= 1):
						const auth_list = Array.from(document.querySelectorAll(`#workskin > .preface > .byline > a[rel='author']`));
						auth_list.forEach(function (elm) {
							a_nm.push(elm.textContent.replace(re_ms, `\\$1`));
							a_pg.push(elm.href);
							authors.push(`[${elm.textContent.replace(re_ms, `\\$1`)}](${elm.href})`);
						});
						return [a_nm, a_pg, authors];

					default:
						throw Error();
				}
			}
		})();

		console.log(
			`
Author(s):
${a_nm.join(`\n`)}
------------------------
Author Page(s):
${a_pg.join(`\n`)}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		return {
			work_title: work_title,
			work_url: work_url,
			authors: authors
		};
	}

	function generic_rr_frmt(s_t, rr_sta, rr_end) {
		// Select the Chapter # element & Wordcount element of the work via XPath and assign it to a variable for later
		// var chp_xp = `.//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dd[contains(concat(" ",normalize-space(@class)," ")," chapters ")]`;
		// var chp_cnt = document.evaluate(chp_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		const chp_cnt = (() => {
			const chp_xp = `.//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dd[contains(concat(" ",normalize-space(@class)," ")," chapters ")]`;
			const out_str = document.evaluate(chp_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.split(`/`).at(0);
			return out_str;
		})();

		const word_count = (() => {
			if ((chp_cnt == rr_end - rr_sta + 1) || (chp_cnt == 1)) {
				const wrd_cnt_elm = (() => {
					const wrd_xp = `.//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dd[contains(concat(" ",normalize-space(@class)," ")," words ")]`;
					return document.evaluate(wrd_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				})();

				const wrd_cnt = wrd_cnt_elm.textContent.replace(/,/g, ``);
				console.log(
					`
# of Chapters to Re-read = # of Chapters Published
Word Count set to work's current word cout (${wrd_cnt} words)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
				);
				return wrd_cnt;
			} else {
				const wrd_cnt = `?`;
				console.log(
					`
# of Chapters to Re-read ≠ # of Chapters Published
Word Count left as "?" (unknown)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
				);
				return wrd_cnt;
			}
		})();

		const cr_dt = (() => {
			const right_now_obj = new Date();
			const right_now = `${right_now_obj.getFullYear()}/${(right_now_obj.getMonth() + 1).toString().padStart(2, `0`)}/${right_now_obj.getDate().toString().padStart(2, `0`)}`;
			return right_now;
		})();

		return {
			word_count: word_count,
			cr_dt: cr_dt
		};
	}

	function AO3_Frmt_Copy() {
		// Regular Expressions used only in this function
		const
			re_ch = /(\d(\d+)?)(\/)(\?|\d(\d+)?)/gmi,                                              /* Regex for spacing out chapter counts (e.g. 3/? → 3 / ?) */
			re_su = /(^https?:\/\/)(.*\.)?(archiveofourown\.org)(.*?)(\/series\/\d+)\/?.*$/gmi;    /* Regex for extracting series URL while stripping unnecessary parts */


		const s_t = performance.now();

		console.log(
			`
Beginning execution of AO3 Formatted Copy Shortcut (UserScript)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		if (curr_page_url.pathname.includes(`works`) || curr_page_url.pathname.includes(`chapters`)) {		/* Check if the page is a work page */

			console.log(
				`
Executing General Formatting for \"Works\"
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			var { work_title, work_url, authors } = AO3_genWork_Copy(s_t);

			/* Generate final MD formatted text */
			let final_out = `[${work_title}](${work_url}) – ${authors.join(`, `)} — `.replace(re_mu, `\\$4`);
			console.log(
				`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Paste final MD formatted text to clipboard */
			GM.setClipboard(final_out);
			console.log(
				`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

		}

		if (curr_page_url.pathname.includes(`series`)) {		/* Check if the page is a series page */

			console.log(
				`
Executing Formatting for \"Series\"
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Get Series Title */
			let srs_title = html_decode(document.querySelector(`#inner #main h2.heading`).textContent.trim().replace(re_ap, `'`).replace(re_ms, `\\$1`));
			console.log(
				`
Series Title:
${srs_title}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Get Series URL */
			let srs_url = curr_page_url.href.replace(re_su, `$1$3$5`);
			console.log(
				`
Series URL:
${srs_url}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Get Author(s) of the series */
			let auth_list = document.querySelectorAll(`dl.series.meta.group a[rel='author']`);
			let a_nm = [];
			let a_pg = [];
			let authors = [];
			for (let x of auth_list) {
				a_nm.push(x.textContent.replace(re_ms, `\\$1`));
				a_pg.push(x.href);
				authors.push(`[${x.textContent.replace(re_ms, `\\$1`)}](${x.href})`);
			}
			console.log(
				`
Author(s):
${a_nm.join(`\n`)}
------------------------
Author Page(s):
${a_pg.join(`\n`)}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Get works in the series */
			let wr_list = document.querySelectorAll(`ul.series.work.index.group li.work`);
			let w_nm = [];
			let w_pg = [];
			let works = [];
			// var worksx = [];
			for (let x of wr_list) {

				// Select the Title element of the work via XPath and assign it to a variable
				let w_xp = `.//div[contains(concat(" ",normalize-space(@class)," ")," header ")]//h4[contains(concat(" ",normalize-space(@class)," ")," heading ")]/a[contains(@href,"works")][not(preceding-sibling::*)]`;
				let wx = document.evaluate(w_xp, x, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

				// Select the Chapter # element of the work via XPath and assign it to a variable
				let chp_xp = `.//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dd[contains(concat(" ",normalize-space(@class)," ")," chapters ")]`;
				let wkx = document.evaluate(chp_xp, x, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

				// Format the work title and url into MarkDown hyperlink and assign it to a variable
				let wfmt = `[${wx.textContent.replace(re_ms, `\\$1`)}](${wx.href})`;

				// Add the work title and url to two separate arrays
				w_nm.push(wx.textContent.replace(re_ms, `\\$1`));
				w_pg.push(wx.href);

				// works.push(wfmt);
				// worksx.push(`\t${1 + Array.from(wr_list).indexOf(x)}. ${wfmt} — ${wkx.textContent.replace(re_ch, `$1 $3 $4`)}`)

				// Add the MD list formatted work hyperlink to an array
				works.push(`\t${1 + Array.from(wr_list).indexOf(x)}. ${wfmt} — ${wkx.textContent.replace(re_ch, `$1 $3 $4`)}`);

			}
			// for (let x of works) {
			// 	worksx.push(`\t${1 + works.indexOf(x)}. ${x} — ${flr}`);
			// }
			console.log(
				`
Work Name(s):
${w_nm.join(`\n`)}
------------------------
Work Page(s):
${w_pg.join(`\n`)}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Get publishing status of the series */
			let pub_xp = `//dl[contains(concat(" ",normalize-space(@class)," ")," series ")][contains(concat(" ",normalize-space(@class)," ")," meta ")][contains(concat(" ",normalize-space(@class)," ")," group ")]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[contains(text(), "Complete")]/following-sibling::*[1]`;
			let pub_r = document.evaluate(pub_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
			if (pub_r == `No`) {
				var pb_s = `Ongoing`;
				var pub_st = `? \\[Ongoing\\]`;
				var wks_end = `\n\t${wr_list.length + 1}. ?`;
			} else if (pub_r == `Yes`) {
				var pb_s = `Completed`;
				var pub_st = `${wr_list.length} \\[Completed\\]`;
				var wks_end = ``;
			}
			console.log(
				`
Series Publishing Status:
${pb_s}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Generate final MD formatted text */
			/* var srs_f_o = `- [${srs_title}](${srs_url}) – ${authors.join(`, `)} (**Series** | ${wr_list.length} / ${pub_st})
	${worksx.join(`\n`)}${wks_end}`.replace(re_mu, `\\$4`); */
			let srs_f_o = `- [${srs_title}](${srs_url}) – ${authors.join(`, `)} (**Series** | ${wr_list.length} / ${pub_st})
${works.join(`\n`)}${wks_end}`.replace(re_mu, `\\$4`);
			console.log(
				`
Final Clipboard:
${srs_f_o}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Paste final MD formatted text to clipboard */
			GM.setClipboard(srs_f_o);
			console.log(
				`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

		}

		console.log(
			`
AO3 Formatted Copy Shortcut (UserScript) executed successfully
------------------------
Time Elapsed: ${performance.now() - s_t}ms
———————————————————————————`
		);
	}

	function AO3_Reread_Format_Copy() {
		// RegEx that will be used
		const
			re_se_si = /^(\d(?:\d+)?)$/,                          /* Regex for matching single chapter input */
			re_se_mu = /^(\d(?:\d+)?)\D(?:\D+)?(\d(?:\d+)?)$/;    /* Regex for matching multiple chapter input */

		const rr_start_end = (() => {
			let user_input = prompt(
				`Input start and end chapter numbers for re-read in the form:
'start_#, end_#'`
			);
			while ((re_se_mu.test(user_input) || re_se_si.test(user_input)) == false) {
				user_input = prompt(
					`Incorrect input, try again.

Input start and end chapter numbers for re-read in the form: 'start_#, end_#'`
				);
			}

			try {
				user_input = JSON.parse(`[${user_input.replace(re_se_mu, `$1,$2`)}]`);
			} catch (SyntaxError) {
				user_input = JSON.parse(`[${parseInt(user_input)}]`);
			}

			return user_input;
		})();

		if (rr_start_end.length == 1) {

			const s_t = performance.now();

			console.log(
				`
Beginning execution of AO3 Formatted Copy Shortcut (UserScript)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			console.log(
				`
Executing Re-read Formatting for \"Works\"
Single Chapter Re-read
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			const { work_title, work_url, authors } = AO3_genWork_Copy(s_t);

			console.log(`
Re-reading Chapter: ${rr_start_end.at(-0).toString().padStart(2, `0`)}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			// var bookmark_link = `Bookmark Link`;
			const { word_count, cr_dt } = generic_rr_frmt(s_t);
			const bookmark_link = (() => {
				switch (true) {
					case (re_bmk_url_1.test(curr_page_url.href)):
						return `[Bookmark Link](${document.querySelector(`li > [id^="bookmark_form_trigger"]`).href.replace(`/edit`, ``)})`;
					case (re_bmk_url_2.test(curr_page_url.href)):
						return `[Bookmark Link](${curr_page_url.href.toString()})`;
					default:
						return `Bookmark Link`;
				}
			})();

			/* Generate final MD formatted text */
			const final_out = `- [${work_title}](${work_url}) – ${authors.join(`, `)} —— ${bookmark_link}
\t- Re-read Chapter ${rr_start_end.at(-0).toString().padStart(2, `0`)} (${word_count} words) –– ${cr_dt}`.replace(re_mu, `\\$4`);
			console.log(
				`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Paste final MD formatted text to clipboard */
			GM.setClipboard(final_out);
			console.log(
				`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

		} else {

			const re_se_si_wminus = /^(\d(?:\d+)?)|-1$/;    /* Regex for matching single chapter input while allowing for -1 */

			// For getting the chapters that have already been read
			const alr_read_start_end = (() => {
				let user_input = prompt(
					`Input start and end chapter numbers for chapters that have already been re-read in the form:
'start_#, end_#'

If none, input '0'
If all, input '-1'`
				);
				while ((re_se_mu.test(user_input) || re_se_si_wminus.test(user_input)) == false) {
					user_input = prompt(
						`Incorrect input, try again.

Input start and end chapter numbers for chapters that have already been re-read in the form:
'start_#, end_#'

If none, input '0'
If all, input '-1'`
					);
				}

				try {
					user_input = JSON.parse(`[${user_input.replace(re_se_mu, `$1,$2`)}]`);
				} catch (SyntaxError) {
					user_input = JSON.parse(`[${parseInt(user_input)}]`);
				}

				return user_input;
			})();

			const s_t = performance.now();	// used for measuring time taken to execute script

			console.log(
				`
Beginning execution of AO3 Formatted Copy Shortcut (UserScript)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			console.log(
				`
Executing Re-read Formatting for \"Works\"
Multi Chapter Re-read
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			const { work_title, work_url, authors } = AO3_genWork_Copy(s_t);

			const [rr_sta, rr_end] = rr_start_end;

			const [rr_sta_padded, rr_end_padded] = rr_start_end.map((elm, index, array) => elm.toString().padStart(GetPadAmt(array), `0`));

			console.log(
				`
Re-read Start Chapter: ${rr_sta_padded}
Re-read End Chapter  : ${rr_end_padded}

# of Chapters to Re-read:
${rr_end - rr_sta + 1}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			// var bookmark_link = `Bookmark Link`;
			const { word_count, cr_dt } = generic_rr_frmt(s_t, rr_sta, rr_end);
			const bookmark_link = (() => {
				switch (true) {
					case (re_bmk_url_1.test(curr_page_url.href)):
						return `[Bookmark Link](${document.querySelector(`li > [id^="bookmark_form_trigger"]`).href.replace(`/edit`, ``)})`;
					case (re_bmk_url_2.test(curr_page_url.href)):
						return `[Bookmark Link](${curr_page_url.href.toString()})`;
					default:
						return `Bookmark Link`;
				}
			})();

			// console.log(bookmark_link)

			const [f_o_dt_str, f_o_chps_rd_str] = (() => {
				// Define vars to be used in the switch statement
				let date_str, chprd_str;
				const [alr_read_sta, alr_read_end] = alr_read_start_end.map(elm => elm.toString().padStart(GetPadAmt(rr_start_end), `0`));

				// Get first elm in the already read input arr for checking
				const alread_first_elm = alr_read_start_end.at(0);

				switch (alread_first_elm) {
					case -1:
						date_str = cr_dt;
						chprd_str = ``;
						break;

					case 0:
						date_str = `${cr_dt} - ?`;
						chprd_str = `\n\t\t- ${cr_dt} -- Chapter ${rr_sta_padded}`;
						break;

					default:
						date_str = `${cr_dt} - ?`;
						chprd_str = `\n\t\t- ${cr_dt} -- Chapter ${alr_read_sta} - Chapter ${alr_read_end}`;
						break;
				}

				if (alr_read_start_end.length == 1 && /0|-1/.test(alread_first_elm) == false) {
					chprd_str = `\n\t\t- ${cr_dt} -- Chapter ${alr_read_sta}`;
				}

				return [date_str, chprd_str];
			})();

			/* Generate final MD formatted text */
			const final_out = `- [${work_title}](${work_url}) – ${authors.join(`, `)} —— ${bookmark_link}
\t- Re-read Chapter ${rr_sta_padded} - Chapter ${rr_end_padded} (${word_count} words) –– ${f_o_dt_str}${f_o_chps_rd_str}`.replace(re_mu, `\\$4`);
			console.log(
				`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			/* Paste final MD formatted text to clipboard */
			GM.setClipboard(final_out);
			console.log(
				`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);
		}
	}

	function NoteSection_Frmt_Copy() {

		const s_t = performance.now();

		console.log(
			`
Beginning execution of AO3 Formatted Copy Shortcut (UserScript)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		console.log(
			`
Executing Note Formatting for \"Works\"
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		var { work_title, work_url, authors } = AO3_genWork_Copy(s_t);

		var bookmark_link = `Bookmark Link`;

		if (re_bmk_url_1.test(curr_page_url.href)) { bookmark_link = `[Bookmark Link](${document.querySelector(`li > [id^="bookmark_form_trigger"]`).href.replace(`/edit`, ``)})`; }
		if (re_bmk_url_2.test(curr_page_url.href)) { bookmark_link = `[Bookmark Link](${curr_page_url.href.toString()})`; }

		/* Generate final MD formatted text */
		let final_out = `- [${work_title}](${work_url}) – ${authors.join(`, `)} —— ${bookmark_link}
\t- `.replace(re_mu, `\\$4`);
		console.log(
			`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		/* Paste final MD formatted text to clipboard */
		GM.setClipboard(final_out);
		console.log(
			`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);
	}

	function IniRead_Frmt_Copy() {

		const
			re_se_si = /^(\d(?:\d+)?)$/,                          /* Regex for matching single chapter input */
			re_se_mu = /^(\d(?:\d+)?)\D(?:\D+)?(\d(?:\d+)?)$/;    /* Regex for matching multiple chapter input */

		const s_t = performance.now();

		const iniread_start_end = (() => {
			let user_input = prompt(
				`Input start and end chapter numbers for initially read chapters in the form:
		'start_#, end_#'`
			);
			while ((re_se_mu.test(user_input) || re_se_si.test(user_input)) == false && user_input != -1) {
				user_input = prompt(
					`Incorrect input, try again.

		Input start and end chapter numbers for re-read in the form: 'start_#, end_#'`
				);
			}

			if (user_input == -1) {
				throw new Error("UserScript execution cancelled");
			}

			try {
				user_input = JSON.parse(`[${user_input.replace(re_se_mu, `$1,$2`)}]`);
			} catch (SyntaxError) {
				user_input = JSON.parse(`[${parseInt(user_input)}]`);
			}

			return user_input;
		})();

		const chap_str_pad_amt = GetPadAmt(iniread_start_end);
		const chap_str = iniread_start_end.map(input => input.toString().padStart(chap_str_pad_amt, `0`)).join(` - `);

		const days_ago = Math.abs(parseInt(prompt(`How many days ago was this initially read?`, 1)));
		const prev_date = ((d) => {
			const date = new Date(d.setDate(d.getDate() - days_ago));
			const date_str = `${date.getFullYear()}/${((date.getMonth()) + 1).toString().padStart(2, `0`)}/${date.getDate().toString().padStart(2, `0`)}`;
			return date_str;
		})((new Date()));

		console.log(
			`
Beginning execution of AO3 Formatted Copy Shortcut (UserScript)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		console.log(
			`
Executing Initially Read Formatting for \"Works\"
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		const { work_title, work_url, authors } = AO3_genWork_Copy(s_t);

		let bookmark_link = `Bookmark Link`;

		if (re_bmk_url_1.test(curr_page_url.href)) { bookmark_link = `[Bookmark Link](${document.querySelector(`li > [id^="bookmark_form_trigger"]`).href.replace(`/edit`, ``)})`; }
		if (re_bmk_url_2.test(curr_page_url.href)) { bookmark_link = `[Bookmark Link](${curr_page_url.href.toString()})`; }

		/* Generate final MD formatted text */
		const final_out = `- [${work_title}](${work_url}) – ${authors.join(`, `)} —— ${bookmark_link}
\t- Chapter ${chap_str} –– Initially Read on ${prev_date}`.replace(re_mu, `\\$4`);
		console.log(
			`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		/* Paste final MD formatted text to clipboard */
		GM.setClipboard(final_out);
		console.log(
			`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);
	}

	if (re_ck.test(curr_page_url.href)) {
		/* Below taken from https://stackoverflow.com/a/2511474/11750206 */
		/* Handler for the Keyboard Shortcut for AO3 Formatted Copy */
		function AO3FC_handler(e) {

			/* Keyboard Shortcut for AO3 Formatted Copy — Shift + Alt + K */
			if (e.shiftKey && e.altKey && e.code === `KeyK`) {

				/* Execute AO3 Formatted Copy */
				AO3_Frmt_Copy();
			}
		}

		/* Register the AO3FC handler */
		document.addEventListener(`keyup`, AO3FC_handler, false);
		GM.registerMenuCommand(`Copy Work/Series as formatted`, AO3_Frmt_Copy);
	}

	/* Add Options to the Tampermonkey Popup Menu to execute each function */
	GM.registerMenuCommand(`Copy Work w/ re-read formatting`, AO3_Reread_Format_Copy);
	GM.registerMenuCommand(`Copy Work w/ Note Formatting`, NoteSection_Frmt_Copy);
	GM.registerMenuCommand(`Copy Work w/ Initially Read Formatting`, IniRead_Frmt_Copy);

})();
