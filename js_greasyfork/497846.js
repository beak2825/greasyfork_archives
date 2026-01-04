// ==UserScript==
// @name           SB/SV/QQ: Threadmark Word Counter
// @namespace      https://github.com/w4tchdoge
// @version        1.1.1-20240618_161840
// @description    Display the word count of threadmarked forum posts in the header area of the post
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://forums.spacebattles.com/threads/*
// @match          *://forums.sufficientvelocity.com/threads/*
// @match          *://forum.questionablequesting.com/threads/*
// @run-at         document-idle
// @license        AGPL-3.0-or-later
// @history        1.1.1 — Log the sum of the word count of all threadmarks currently being displayed to the browser console
// @history        1.1.0 — Reworked `CSSRGBintoComponents()` to better handle cases where the color is in the format `color(srgb ...)`. Changed how lightness_increase works so that it's a negative value when `color-scheme` is `light` and zero when `color-scheme` is neither `light` nor `dark`. Reworked `phb_color` so that the string it outputs uses the newer space separated `rgb()` parameters (https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb#syntax)
// @history        1.0.0 — Initial commit
// @downloadURL https://update.greasyfork.org/scripts/497846/SBSVQQ%3A%20Threadmark%20Word%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/497846/SBSVQQ%3A%20Threadmark%20Word%20Counter.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	const start_time = performance.now();
	console.log(`
Initializing Threadmark Word Counter UserScript
———————————————–————————————————
Time since Start: ${performance.now() - start_time}ms`
	);

	// Conversion of the word counting Regular Expression used by AO3, with added support for most Unicode scripts supported in Regular Expressions
	// Vanilla AO3 compliant script_list:
	// const script_list = [`Han`, `Hiragana`, `Katakana`, `Thai`];
	// Full script_list:
	const script_list = [`Arabic`, `Armenian`, `Balinese`, `Bengali`, `Bopomofo`, `Braille`, `Buginese`, `Buhid`, `Canadian_Aboriginal`, `Carian`, `Cham`, `Cherokee`, `Common`, `Coptic`, `Cuneiform`, `Cypriot`, `Cyrillic`, `Deseret`, `Devanagari`, `Ethiopic`, `Georgian`, `Glagolitic`, `Gothic`, `Greek`, `Gujarati`, `Gurmukhi`, `Han`, `Hangul`, `Hanunoo`, `Hebrew`, `Hiragana`, `Inherited`, `Kannada`, `Katakana`, `Kayah_Li`, `Kharoshthi`, `Khmer`, `Lao`, `Latin`, `Lepcha`, `Limbu`, `Linear_B`, `Lycian`, `Lydian`, `Malayalam`, `Mongolian`, `Myanmar`, `New_Tai_Lue`, `Nko`, `Ogham`, `Ol_Chiki`, `Old_Italic`, `Old_Persian`, `Oriya`, `Osmanya`, `Phags_Pa`, `Phoenician`, `Rejang`, `Runic`, `Saurashtra`, `Shavian`, `Sinhala`, `Sundanese`, `Syloti_Nagri`, `Syriac`, `Tagalog`, `Tagbanwa`, `Tai_Le`, `Tamil`, `Telugu`, `Thaana`, `Thai`, `Tibetan`, `Tifinagh`, `Ugaritic`, `Vai`, `Yi`];
	// Excludes the Unicode scripts "Common" and "Latin" because that messes with the counting somehow
	// Exclude "Inherited" just to be safe
	const script_exclude_list = [`Common`, `Latin`, `Inherited`];
	const word_count_regex = new RegExp((function () {
		// Switch from using alternations in a group (e.g. (a|b|c)) to a character class (e.g. [abc]) for performance reasons (https://stackoverflow.com/a/27791811/11750206)
		const regex_scripts = script_list.filter((elm) => !script_exclude_list.includes(elm)).map((elm) => `\\p{Script=${elm}}`).join(``);
		const full_regex_str = `[${regex_scripts}]|((?![${regex_scripts}])[\\p{Letter}\\p{Mark}\\p{Number}\\p{Connector_Punctuation}])+`;
		return full_regex_str;
	})(), `gv`);

	function WordCounter(string, word_count_regex_expr = word_count_regex) {
		// Count the number of words
		// Counting method from: https://stackoverflow.com/a/76673564/11750206, https://stackoverflow.com/a/69486719/11750206, and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
		// Regex substitutions from: https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/lib/word_counter.rb#L30C33-L30C68
		const word_count_arr = Array.from(string.replaceAll(/--/g, `—`).replaceAll(/['’‘-]/g, ``).matchAll(word_count_regex_expr), (m) => m[0]);
		const word_count_int = word_count_arr.length;

		return word_count_int;
	}

	// Colour Functions for manipulating wc_borderColor

	// Split the initial CSS colour string into components
	function CSSRGBintoComponents(rgb_str) {
		const match_regex = /^(rgb|color\(srgb(?=\s))/i;
		const split_regex = /[^\d\.%]/i;

		const regex_test = match_regex.test(rgb_str);

		if (regex_test == false) {
			throw new Error(`The parameter passed to CSSRGBintoComponents() is not an rgb()/rgba()/color(srgb ...) CSS colour string.`);
		}

		function CommonFilter(input_str, splt_rgx = split_regex) {
			const [red, green, blue, alpha] = input_str.split(splt_rgx)
				.filter(elm => {
					try {
						return ((!isNaN(parseFloat(elm)) && isFinite(elm)) || elm.includes(`%`));
					} catch (error) {
						return false;
					}
				});

			return [red, green, blue, alpha];
		}

		const color_test = rgb_str.split(/[\s\(]/i).at(0).toLowerCase().includes(`color`);

		if (color_test) {

			const [comp_red, comp_green, comp_blue, comp_alpha] = CommonFilter(rgb_str)
				.map((element, index) => {
					if (Boolean(element) && index < 3) {
						const output_str = parseInt(parseFloat(element) * 255).toString();
						return output_str;
					} else { return element.toString(); }
				});

			return [comp_red, comp_green, comp_blue, comp_alpha];

		} else {

			const [comp_red, comp_green, comp_blue, comp_alpha] = CommonFilter(rgb_str);

			return [comp_red, comp_green, comp_blue, comp_alpha];

		}
	}

	// Reference XYZ values ; Observer: 2° ; Illuminant: D65
	const [ref_X, ref_Y, ref_Z] = [95.047, 100.000, 108.883];

	// Converts RGB components into CIELAB
	// Input is an array of RGB components in that order
	// Outputs an array of CIE Lab components in that order
	// from https://stackoverflow.com/a/73998199/11750206
	function RGBtoLAB([red, green, blue]) {
		const [var_R, var_G, var_B] =
			[red, green, blue]
				.map(n => n / 255)
				.map(n =>
					n > 0.0405
						? ((n + 0.055) / 1.055) ** 2.4
						: n / 12.92
				)
				.map(n => n * 100);

		const [X, Y, Z] = [
			var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805,
			var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722,
			var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505
		];

		const [var_X, var_Y, var_Z] =
			[X / ref_X, Y / ref_Y, Z / ref_Z]
				.map(n =>
					n > 0.008856
						? n ** (1 / 3)
						: (7.787 * n) + (16 / 116)
				);

		const [CIE_L, CIE_a, CIE_b] =
			[
				(116 * var_Y) - 16,
				500 * (var_X - var_Y),
				200 * (var_Y - var_Z)
			];

		return [CIE_L, CIE_a, CIE_b];
	}

	// Converts CIELAB components into RGB
	// Input is an array of CIE Lab components in that order
	// Outputs an array of RGB components in that order
	// from https://stackoverflow.com/a/73998199/11750206
	function LABtoRGB([CIE_L, CIE_a, CIE_b]) {
		const
			var_Y = (CIE_L + 16) / 116,
			var_X = (CIE_a / 500) + var_Y,
			var_Z = var_Y - (CIE_b / 200);

		const [X, Y, Z] = (() => {
			const [mid_X, mid_Y, mid_Z] = [var_X, var_Y, var_Z]
				.map(n =>
					n ** 3 > 0.008856
						? n ** 3
						: (n - 16 / 116) / 7.787
				);

			return [mid_X * ref_X, mid_Y * ref_Y, mid_Z * ref_Z];
		})();

		const [var_R, var_G, var_B] = [
			X * 3.2406 + Y * -1.5372 + Z * -0.4986,
			X * -0.9689 + Y * 1.8758 + Z * 0.0415,
			X * 0.0557 + Y * -0.2040 + Z * 1.0570
		];

		const [R, G, B] = [var_R, var_G, var_B]
			.map(n => n / 100)
			.map(n =>
				n > 0.0031308
					? (1.055 * (n ** (1 / 2.4))) - 0.055
					: 12.92 * n
			)
			.map(n => parseInt(n * 255));

		return [R, G, B];
	}


	// Get array of threadmarked posts
	const threadmarked_posts = Array.from(document.querySelectorAll(`article.hasThreadmark:has(.message-inner .message-cell--main)`));

	// Time logging because why not
	console.log(`
Starting Word Counting of Threadmarks
———————————————–————————————————
Time since Start: ${performance.now() - start_time}ms`
	);

	let word_count_sum = 0;

	// Iterate on the array of threadmarked posts
	threadmarked_posts.forEach(function (element, index, array) {
		// Get the timestamp element which the Word count element will be put after
		const tmrkd_post_timestamp = element.querySelector(`.message-cell--main .message-attribution-main`);

		// Get the computed styles of the threadmark header element (where the threadmark name,category, and nav buttons are)
		// This is to mimick the border style when making the word count element
		// Also getting the threadmark title and category because it's right there why not
		const [threadmark_title, threadmark_category, ph_styles] = (function () {
			const tmrk_header = element.querySelector(`div.message-cell--threadmark-header`);
			const
				tmrk_title = tmrk_header.querySelector(`span.primary > span[id^="threadmark"]`).cloneNode(true).textContent.trim(),
				tmrk_category = tmrk_header.querySelector(`span.primary > label[for^="threadmark"]`).cloneNode(true).textContent.trim();

			const tmrk_header_styles = getComputedStyle(tmrk_header);
			return [tmrk_title, tmrk_category, tmrk_header_styles];
		})();

		// Change how much higher the perceptual lightness of the word count border colour is
		// const lightness_increase = 10;
		// const lightness_increase = 6.75;
		const lightness_increase = (() => {
			const up_value = 6.75;
			const site_color_scheme = getComputedStyle(document.querySelector(`body`)).getPropertyValue(`color-scheme`);

			// if (site_color_scheme == `light`) {
			// 	const output_num = -up_value;
			// 	return output_num;
			// } else {
			// 	const output_num = up_value;
			// 	return output_num;
			// }

			switch (site_color_scheme) {
				case `light`:
					return -up_value;

				case `dark`:
					return up_value;

				default:
					return 0;
			}
		})();

		// Assign/Get/Calculate the border properties for the word count element border
		const [wc_borderWidth, wc_borderStyle, wc_borderColor] = (function () {
			const
				// Manually set to 1px because that's what it's set to in the Threadmark header
				// But computed style returns 0.740 recurring
				phb_width = `1px`,

				// Get the border style
				phb_style = ph_styles.getPropertyValue(`border-bottom-style`),

				// Calculated the border colour based on retrieved border colour and lightness_increase
				phb_color = (() => {
					const [initial_red, initial_green, initial_blue, initial_alpha] = CSSRGBintoComponents(ph_styles.getPropertyValue(`border-bottom-color`));

					const [i_CIE_L, i_CIE_a, i_CIE_b] = RGBtoLAB([initial_red, initial_green, initial_blue]);
					const [final_CIE_L, final_CIE_a, final_CIE_b] = [i_CIE_L + lightness_increase, i_CIE_a, i_CIE_b];
					const [final_red, final_green, final_blue] = LABtoRGB([final_CIE_L, final_CIE_a, final_CIE_b]);

					if (Boolean(initial_alpha)) {
						const out_phb_color = `rgb(${final_red} ${final_green} ${final_blue} / ${initial_alpha})`;
						return out_phb_color;
					} else {
						const out_phb_color = `rgb(${final_red} ${final_green} ${final_blue})`;
						return out_phb_color;
					}
				})();

			return [phb_width, phb_style, phb_color];
		})();

		// Get the actual text of the threadmark to be word counted
		const threadmark_text = element.querySelector(`.message-inner .message-cell--main .message-content article.message-body .bbWrapper`).cloneNode(true).textContent;

		// Calculate word count using WordCounter() and format it to a thousand-separated string
		const word_count_int = parseInt(WordCounter(threadmark_text));
		const word_count_str = new Intl.NumberFormat({ style: `decimal` }).format(word_count_int);

		// Add to sum
		word_count_sum += word_count_int;

		// Threadmark info logging + Time logging
		console.log(
			`
Threadmark ${index + 1}
Threadmark Category: ${threadmark_category}
Threadmark Title: ${threadmark_title}
Word Count: ${word_count_str} words
———————————————–————————————————
Time since Start: ${performance.now() - start_time}ms`
		);

		// Create the word count element
		const word_count_element = Object.assign(document.createElement(`ul`), {
			id: `threadmark-word-count`,
			className: `listInline`,
			// style: `padding-left: 0.5em; margin-left: 0.5em; border-left: ${wc_borderWidth} ${wc_borderStyle} ${wc_borderColor};`,
			style: `padding-left: 7.5px; margin-left: 7.5px; border-left: ${wc_borderWidth} ${wc_borderStyle} ${wc_borderColor};`,
			innerHTML: (function () {
				const element = Object.assign(document.createElement(`li`), {
					className: `u-concealed`,
					innerHTML: `Word Count: ${word_count_str} words`
				});
				return element.outerHTML;
			})()
		});

		// Check if the word count element already exists
		const wc_elem_check = element.querySelector(`#threadmark-word-count`);
		if (Boolean(wc_elem_check)) {
			// If yes, replace existing one with new one
			wc_elem_check.replaceWith(word_count_element);
		} else {
			// If no, add a word count element
			tmrkd_post_timestamp.after(word_count_element);
		}
	});

	const word_count_sum_elm = (() => {
		const out_elm = Object.assign(document.createElement(`div`), {
			id: `CrW_Thrdmrk_Wrd_Cnt_Sum_hidden`,
		});
		out_elm.setAttribute(`data_word_count_sum`, word_count_sum);

		return out_elm;
	})();
	document.querySelector(`body`).appendChild(word_count_sum_elm);

	console.log(`
Sum of the word counts of the threadmarks on the current page:`, word_count_sum);

	// More time logging wheeeeeeeeeeeeeeeeeeee
	console.log(`
Completed Word Counting of Threadmarks
UserScript has completed running
———————————————–————————————————
Time since Start: ${performance.now() - start_time}ms`
	);

})();
