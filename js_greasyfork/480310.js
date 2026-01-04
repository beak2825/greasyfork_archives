// ==UserScript==
// @name           CrW Forum (SB/SV/QQ) Formatted Copy
// @namespace      https://github.com/w4tchdoge
// @version        2.3.1-20240806_114900
// @description    Copy the curretly open CrW Forum work in the folloring MarkDown format '- [work name](work url) – [author name](author url) — '
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://forums.spacebattles.com/threads/*
// @match          *://forums.sufficientvelocity.com/threads/*
// @match          *://forum.questionablequesting.com/threads/*
// @grant          GM_setClipboard
// @grant          GM.setClipboard
// @grant          GM_registerMenuCommand
// @grant          GM.registerMenuCommand
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @license        AGPL-3.0-or-later
// @history        2.3.1 — Fix the already read chapters input in re-read function not being padded correctly
// @history        2.3.0 — Add re-read functionality
// @history        2.2.1 — Make sure page num is not captured when getting the normalised thread url. Move regexs and variables into the functions they are used in. Get auth name and url from the thread header area which is on every page of the thread as opposed to the first message of the thread
// @history        2.2.0 — Remove QQ specific sections as QQ has now migrated to XenForo2
// @history        2.1.1 — Remove the trailing forward slash when pasting the MD formatted string into clipboard
// @history        2.1.0 — Split the genWork function into two functions that handle the work information and author information separately
// @history        2.0.1 — Use the URL contructor to make page_url so as to get rid any links to a specific post of a thread
// @history        2.0.0 — Rewrite to use a general formatting function (as in AO3FC)
// @history        1.0.1 — Add logging to console at specific steps
// @history        1.0.0 — Initial creation of script w/ basic comments
// @downloadURL https://update.greasyfork.org/scripts/480310/CrW%20Forum%20%28SBSVQQ%29%20Formatted%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/480310/CrW%20Forum%20%28SBSVQQ%29%20Formatted%20Copy.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	// Regex for spacing out chapter counts (e.g. 3/? → 3 / ?)
	const re_ch = /(\d(\d+)?)(\/)(\?|\d(\d+)?)/gmi;

	function html_decode(txt_str) {
		const doc = new DOMParser().parseFromString(txt_str, `text/html`);
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

	function CrW_gen_Work_Copy(s_t) {

		const re_wu = /(https?:\/\/forums?\..*?\.com\/threads\/).*\.(\d+\/)/gmi;    /* Regex for extracting work URL without thread name */
		const re_wt = /[-: ]*(\[([^\]]+)\]|\(([^\)]+)\))[-: ]*/gmi;                 /* Regex for extracting work title without [] blocks or () blocks or leading/trailing spaces/dashes/colons */
		const re_ms = /(~|\*)/gmi;                                                  /* Regex for escaping characters used in MD syntax that may appear in work or series titles – DO NO USE ON ANYTHING THAT COULD CONTAIN A URL */
		const re_ap = /’|ʼ|‘/gmi;                                                   /* Regex for replacing multiple apostrophe-like characters with an apostrophe */

		const re_https = /http(?!s)/i;
		const re_pgnum = /(page-\d+)|(reader.)/i;

		console.log(`
Executing Formatting for XF2 Forums
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		// Get the URL of the current webpage
		const ref_url = new URL(window.location);

		// Get Work Title and Work URL
		const wrk_title = html_decode(document.querySelector(`.p-body-header .p-title-value`).textContent.replace(re_wt, ``).replace(re_ap, `'`).replace(re_ms, `\\$1`).trim());
		const wrk_url = `${ref_url.origin.replace(re_https, `https`)}${ref_url.pathname.split(re_pgnum).at(0)}`.replace(re_wu, `$1$2`);

		console.log(`
Work Title:
${wrk_title}
------------------------
Work URL:
${wrk_url}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);


		return {
			wrk_title: wrk_title,
			wrk_url: wrk_url,
		};
	}

	function CrW_gen_Auth_Copy(s_t) {

		// Get element containing auth name and url
		const auth_details = document.querySelector(`.p-body-header .p-description li:has(> i[title*="Thread starter"]) a.username`);

		// Get Author Name and Author URL
		const auth_name = auth_details.textContent.trim();
		const auth_url = auth_details.href;

		console.log(`
Author Name:
${auth_name}
------------------------
Author URL:
${auth_url}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		return {
			auth_name: auth_name,
			auth_url: auth_url
		};
	}

	function generic_rr_frmt(s_t, rr_sta, rr_end) {
		const chp_cnt = document.querySelector(`[aria-labelledby="threadmark-category-1"] span[class=""]`).textContent
			.trim()
			.split(/\D+/i)
			.filter(n => n)
			.at(0);

		const wcelm = document.querySelector(`#CrW_Thrdmrk_Wrd_Cnt_Sum_hidden`);
		const [word_count, wc_logstr] = (() => {
			if (Boolean(wcelm)) {
				const wcnum = wcelm.getAttribute(`data_word_count_sum`);
				const l_str = `Word Count set to work's current word count (${wcnum} words)`;
				return [wcnum, l_str];
			} else {
				const l_str = `Unable to retrieve word count. Word Count set to ?`;
				return [`?`, l_str];
			}
		})();

		if ((chp_cnt == (rr_end - rr_sta + 1)) || (chp_cnt == 1)) {
			console.log(
				`
# of Chapters to Re-read = # of Chapters Published
${wc_logstr}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
	———————————————————————————`
			);
		} else {
			console.log(
				`
# of Chapters to Re-read ≠ # of Chapters Published
Word Count left as unknown
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);
		}

		const cr_dt = (() => {
			const cur_date = new Date();
			const out_str = `${cur_date.getFullYear()}/${(cur_date.getMonth() + 1).toString().padStart(2, `0`)}/${cur_date.getDate().toString().padStart(2, `0`)}`;
			return out_str;
		})();

		return {
			word_count: word_count,
			cr_dt: cr_dt
		};
	}

	function CrW_Frmt_Copy() {
		// Regex for escaping underscores that are not part of URLs for Markdown
		const re_mu = /(?<!(\\|http(\S(\S+?))?))(_)/gmi;

		const s_t = performance.now();	// used for measuring time taken to execute script

		console.log(`
Beginning execution of CrW Formatted Copy Shortcut (UserScript)
Executing MarkDown Formatting
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		const { wrk_title, wrk_url } = CrW_gen_Work_Copy(s_t);
		const { auth_name, auth_url } = CrW_gen_Auth_Copy(s_t);

		// Debug Line
		// console.log(`\n${wrk_title}\n${wrk_url.slice(0, -1)}\n${auth_name}\n${auth_url.slice(0, -1)}`);

		// Generate final MD formatted text
		const final_out = `[${wrk_title}](${wrk_url.slice(0, -1)}) – [${auth_name}](${auth_url.slice(0, -1)}) — `.replace(re_mu, `\\$4`);
		console.log(`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		// Paste final MD formatted text to clipboard
		GM.setClipboard(final_out);
		console.log(`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		console.log(`
CrW Formatted Copy Shortcut (UserScript) executed successfully
------------------------
Time Elapsed: ${performance.now() - s_t}ms
———————————————————————————`
		);
	}

	function CrW_Norm_URL_Copy() {
		const s_t = performance.now();	// used for measuring time taken to execute script

		console.log(`
Beginning execution of CrW Formatted Copy Shortcut (UserScript)
Executing Normalised Thread URL Copy
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		const { wrk_url } = CrW_gen_Work_Copy(s_t);

		// Generate final MD formatted text
		const final_out = wrk_url;
		console.log(`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		// Paste final MD formatted text to clipboard
		GM.setClipboard(final_out);
		console.log(`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
		);

		console.log(`
CrW Formatted Copy Shortcut (UserScript) executed successfully
------------------------
Time Elapsed: ${performance.now() - s_t}ms
———————————————————————————`
		);
	}

	function CrW_ReRead_Frmt_Copy() {
		// RegEx that will be used
		const
			re_se_si = /^(\d(?:\d+)?)$/,
			re_se_mu = /^(\d(?:\d+)?)\D(?:\D+)?(\d(?:\d+)?)$/,
			// Regex for escaping underscores that are not part of URLs for Markdown
			re_mu = /(?<!(\\|http(\S(\S+?))?))(_)/gmi;


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

			const s_t = performance.now();	// used for measuring time taken to execute script

			console.log(`
Beginning execution of CrW Formatted Copy Shortcut (UserScript)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			console.log(
				`
Executing Re-read Formatting for:
Single Chapter Re-read
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			const { wrk_title, wrk_url } = CrW_gen_Work_Copy(s_t);
			const { auth_name, auth_url } = CrW_gen_Auth_Copy(s_t);

			console.log(`
Re-reading Chapter: ${rr_start_end.at(-0).toString().padStart(2, `0`)}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			const { word_count, cr_dt } = generic_rr_frmt(s_t, rr_sta, rr_end);

			// Debug Line
			// console.log(`\n${wrk_title}\n${wrk_url.slice(0, -1)}\n${auth_name}\n${auth_url.slice(0, -1)}`);

			// Generate final MD formatted text
			const final_out =
				`- [${wrk_title}](${wrk_url.slice(0, -1)}) – [${auth_name}](${auth_url.slice(0, -1)})
\t- Re-read Chapter ${rr_start_end.at(-0).toString().padStart(2, `0`)} (${word_count} words) –– ${cr_dt}`.replace(re_mu, `\\$4`);
			console.log(`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			// Paste final MD formatted text to clipboard
			GM.setClipboard(final_out);
			console.log(`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			console.log(`
CrW Formatted Copy Shortcut (UserScript) executed successfully
------------------------
Time Elapsed: ${performance.now() - s_t}ms
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

			console.log(`
Beginning execution of CrW Formatted Copy Shortcut (UserScript)
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			console.log(
				`
Executing Re-read Formatting for:
Multi Chapter Re-read
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			const { wrk_title, wrk_url } = CrW_gen_Work_Copy(s_t);
			const { auth_name, auth_url } = CrW_gen_Auth_Copy(s_t);

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

			const { word_count, cr_dt } = generic_rr_frmt(s_t, rr_sta, rr_end);

			const [f_o_dt_str, f_o_chps_rd_str] = (() => {
				// Define vars to be used in the switch statement
				let date_str, chprd_str;
				const [alr_read_sta, alr_read_end] = alr_read_start_end.map((elm) => elm.toString().padStart(GetPadAmt(rr_start_end), `0`));

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

			// Generate final MD formatted text
			const final_out = `- [${wrk_title}](${wrk_url.slice(0, -1)}) – [${auth_name}](${auth_url.slice(0, -1)})
\t- Re-read Chapter ${rr_sta_padded} - Chapter ${rr_end_padded} (${word_count} words) –– ${f_o_dt_str}${f_o_chps_rd_str}`.replace(re_mu, `\\$4`);
			console.log(`
Final Clipboard:
${final_out}
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			// Paste final MD formatted text to clipboard
			GM.setClipboard(final_out);
			console.log(`
final_out pasted to clipboard
------------------------
Time Elapsed:
${performance.now() - s_t} ms
———————————————————————————`
			);

			console.log(`
CrW Formatted Copy Shortcut (UserScript) executed successfully
------------------------
Time Elapsed: ${performance.now() - s_t}ms
———————————————————————————`
			);
		}
	}
	// Below taken from https://stackoverflow.com/a/2511474/11750206
	// Handler for the Keyboard Shortcut for CrW Formatted Copy
	function CrWFC_handler(e) {

		// Keyboard Shortcut for CrW Formatted Copy — Shift + Alt + K
		if (e.shiftKey && e.altKey && e.code === `KeyK`) {

			// Execute CrW Formatted Copy
			CrW_Frmt_Copy();
		}
	}

	// Register the CrWFC handler
	document.addEventListener(`keyup`, CrWFC_handler, false);

	GM.registerMenuCommand(`Copy Work as formatted`, CrW_Frmt_Copy);
	GM.registerMenuCommand(`Copy Work w/ re-read formatting`, CrW_ReRead_Frmt_Copy);
	GM.registerMenuCommand(`Copy normalised Thread URL`, CrW_Norm_URL_Copy);

})();