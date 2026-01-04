// ==UserScript==
// @name		Youtube polymer engine fixes
// @description	Some fixes for Youtube polymer engine
// @namespace	bo.gd.an[at]rambler.ru
// @version		3.0.12.56300
// @match		https://www.youtube.com/*
// @compatible	firefox 56
// @author		Bogudan
// @grant		GM_info
// @grant		GM.info
// @grant		GM_getValue
// @grant		GM.getValue
// @grant		GM_setValue
// @grant		GM.setValue
// @grant		unsafeWindow
// @noframes
// @run-at		document-start
// @license		For personal use only
// @downloadURL https://update.greasyfork.org/scripts/405614/Youtube%20polymer%20engine%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/405614/Youtube%20polymer%20engine%20fixes.meta.js
// ==/UserScript==

(async function () {
    'use strict';
	if (window.top !== window.self)
		return;
	if (location.pathname == '/error')	// нам нечего делать на страницах с ошибками
		return;
    function setDefault (obj, key, value) {
        if (!(key in obj))
            obj [key] = value;
        }
	function selector (obj, key, ...ex) {
		return obj === undefined || obj === null || key === undefined || key === null ? obj : selector (obj [key], ...ex);
		}
	/*function $$ (x) {
		return cloneInto ? cloneInto (x, unsafeWindow, { cloneFunctions: true }) : x;
		}*/
	// select storage: GM_*/GM.* or local storage (in case userscript manager does not grant us GMs)
	let storage =
		(typeof (GM_getValue) !== 'undefined' && typeof (GM_setValue) !== 'undefined' && GM_getValue && GM_setValue) ? { load: GM_getValue, save: GM_setValue, desc: "GM_*Value" } :
		(typeof (GM) !== 'undefined' && GM && GM.getValue && GM.setValue) ? { load: GM.getValue, save: GM.setValue, desc: "GM.*Value" } :
		{ load: (_, def) => def };
	let settings = await storage.load ('settings', {});
	if (storage.desc)
		settings.storage = storage.desc;
	// delete old settings
	if ("default_player_640" in settings) {
		// удалено в 0.5
		settings.default_player = settings.default_player_640 ? 3 : 0;
		delete settings.default_player_640;
		}
	if ("reduce_thumbnail" in settings) {
		// удалено в 0.6.0
		settings.thumbnail_size = settings.reduce_thumbnail ? 2 : 0;
		delete settings.reduce_thumbnail;
		}
	if ("reduce_font" in settings) {
		// удалено в 2.5.8: размеры текста уменьшились на стороне YT
		settings.fix_removed_placeholder = settings.reduce_font;
		delete settings.reduce_font;
		}
	if ("wide_description" in settings) {
		// удалено в 2.9.1
		settings.description_width = settings.wide_description ? 1 : 0;
		delete settings.wide_description;
		}
	if ("restore_dislikes" in settings) {
		// удалено в 2.14.3 -- данные больше не предоставляются
		delete settings.restore_dislikes;
		}
	if ("exact_view_count" in settings) {
		// удалено в 2.16.0
		settings.view_count_mod = settings.exact_view_count ? 2 : 1;
		delete settings.exact_view_count;
		}
	if ("short_to_full" in settings) {
		// удалено в 2.20.0
		settings.short_to_full2 = settings.short_to_full ? 2 : 0;
		delete settings.short_to_full;
		}
	// set default values
	const gminfo = typeof (GM_info) !== 'undefined' && GM_info || typeof (GM) !== 'undefined' && GM && GM.info;
	const fix_version = selector (gminfo, 'script', 'version');
	let load_version = settings.version;
	if (fix_version) {
		settings.version = fix_version;
		setDefault (settings, "inst_ver", fix_version);
		}
	/* 0 */ setDefault (settings, "align_player", 0);
	/* 0 */ setDefault (settings, "channel_default", 0);
	/* 0 */ setDefault (settings, "channel_top", 0);
	/* 0 */ setDefault (settings, "clear_link_pp", false);
	/* 0 */ setDefault (settings, "clear_search", false);
	/* 0 */ setDefault (settings, "clear_sign", false);
	/* 0 */ setDefault (settings, "default_player", 0);
	/* 0 */ setDefault (settings, "description_width", 0);
	/* 0 */ setDefault (settings, "disable_player_click_overlay", false);
	/* 0 */ setDefault (settings, "disable_video_preview", false);
	/* 0 */ setDefault (settings, "exact_likes", false);
	/* 0 */ setDefault (settings, "fix_removed_placeholder", true);
	/* 0 */ setDefault (settings, "hide_engagement_panel_structured_description", false);
	/* 0 */ setDefault (settings, "hide_engagement_panel_transcript", false);
	/* 0 */ setDefault (settings, "hide_guide", true);
	/* 0 */ setDefault (settings, "hide_metadata", false);
	/* 0 */ setDefault (settings, "hide_yt_suggested_blocks", true);
	/* 0 */ setDefault (settings, "logo_target", "");
	/* 0 */ setDefault (settings, "main_align", 0);
	/* 0 */ setDefault (settings, "no_player_round_corners", false);
	/* 0 */ setDefault (settings, "no_resume_time", false);
	/* 0 */ setDefault (settings, "remove_rounded_corners_1", false);
	/* 0 */ setDefault (settings, "remove_yt_redirect", false);
	/* 0 */ setDefault (settings, "search_thumbnail", 0);
	/* 0 */ setDefault (settings, "short_to_full2", 0);
	/* 0 */ setDefault (settings, "simpler_fullscreen", false);
	/* 0 */ setDefault (settings, "subscriptions_align", 0);
	/* 0 */ setDefault (settings, "theater_player", 0);
	/* 0 */ setDefault (settings, "thumbnail_size", 2);
	/* 0 */ setDefault (settings, "thumbnail_size_m", 720);
	/* 0 */ setDefault (settings, "try_load_more", false);
	/* 0 */ setDefault (settings, "unbound_video_title", false);
	/* 0 */ setDefault (settings, "unfix_header", true);
	/* 0 */ setDefault (settings, "update_alert", 0);
	/* 0 */ setDefault (settings, "video_quality", 0);
	/* 0 */ setDefault (settings, "video_shelves", false);
	/* 0 */ setDefault (settings, "view_count_mod", 1);
	/* 0 */ setDefault (settings, "watched_blur", 0);
	/* 0 */ setDefault (settings, "watched_grayscale", 0);
	/* 10 */ setDefault (settings, "resume_bar_handling", settings.no_resume_time ? 1 : 0);
	/* 10 */ setDefault (settings, "thumbnail_size_channel_m", settings.thumbnail_size_m);
	/* 10 */ setDefault (settings, "thumbnail_size_channel", settings.thumbnail_size);
	// deprecations
	setDefault (settings, '__depr__', 0);
	if (settings.__depr__ < 26) settings.try_load_more = false;
	if (settings.__depr__ < 26)
		settings.__depr__ = 26;
	console.log ('fix settings:', settings);
	// fix TrustedHTML
	if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy)
		window.trustedTypes.createPolicy ('default', {
			createHTML: x => x,
			});
	// catch "settings" page
	if (location.pathname == '/fix-settings') {
		window.addEventListener ('DOMContentLoaded', () => { document.title = "YouTube Polymer Fixes: Settings"; });
		const back = document.createElement ('div');
		back.className = 'ytfixback';
		const plane = document.createElement ('div');
		plane.className = 'ytfix';
		const style = document.createElement ('style');
		style.type = 'text/css';
		style.innerHTML = `
			.ytfix{position:absolute;left:0;top:0;right:0;background:#eee;padding:3em}
			.ytfix_line{margin:1em}
			.ytfix_line span,.ytfix_line input,.ytfix_line select{margin-right:1em}
			.ytfix_field{padding:0.2em;border:1px solid #888}
			.ytfix_button{padding:0.4em;border:1px solid #888}
			.ytfix_line fieldset {border:1px solid #ccc;padding:0 0.5em}
			.ytfix_line legend {padding:0 0.5em}
			.ytfix_line img {margin:0 1em}
			.ytfix_hide{display:none}
			.ytfixback{position:absolute;left:0;top:0;right:0;height:100%;background:#eee}
			.ytfix_slide_base {position:relative;margin-right:1em;display:inline-block;height:1em}
			.ytfix_slide_bar {position:absolute;left:0;right:0;top:0.3em;bottom:0.3em;background:#ddd;border:1px solid #ccc}
			.ytfix_slide_stroke {position:absolute;width:1px;top:0.1em;bottom:0.1em;background:#ccc}
			.ytfix_slide_arrow {position:absolute;width:9px;bottom:0;top:0;background:#ddd;border:1px solid #aaa;border-radius:0.5em}
			.ytfix_tabs {position:relative}
			.ytfix_tabs > div {display:none;border:1px solid #ccc}
			.ytfix_tabs > input {display:none}
			.ytfix_tabs > label {display:inline-block;background:#ddd;border:1px solid #ccc;padding:0.5em 1em;position:relative;top:1px}
			.ytfix_tabs > label ~ label {border-left:none}
			.ytfix_tabs > input:checked + label {background-color:#eee;border-bottom:1px solid #eee}
			`;
		plane.appendChild (style);
		function AddLine (plane) {
			const q = document.createElement ('div');
			q.className = 'ytfix_line';
			for (let i = 1, L = arguments.length; i < L; ++i)
				q.appendChild (arguments [i]);
			plane.appendChild (q);
			return q;
			}
		let e1, e2;
		e1 = document.createElement ('b');
		e1.appendChild (document.createTextNode ('YouTube Polymer Fixes: Settings'));
		AddLine (plane, e1);
		if (fix_version) {
			e1 = document.createElement ('b');
			e1.appendChild (document.createTextNode (`Version: ${fix_version}`));
			AddLine (plane, e1);
			}
		if (!storage.save) {
			e1 = document.createElement ('span');
			e1.style = 'color:red';
			e1.appendChild (document.createTextNode ('Cannot edit settings: no access to any storage.'));
			AddLine (plane, e1);
			e1 = document.createElement ('span');
			e1.appendChild (document.createTextNode ('Please, allow cookies for this site.'));
			AddLine (plane, e1);
			}
		else {
			const ess = {};
			function MakeDesc (desc, extra) {
				const e = document.createElement ('span');
				e.appendChild (document.createTextNode (desc));
				if (extra) {
					if (extra.style)
						e.style = style;
					if (extra.note) {
						const n = document.createElement ('sup');
						n.appendChild (document.createTextNode (extra.note));
						e.appendChild (n);
						}
					}
				return e;
				}
			function MakeNote (num, desc, extra) {
				const e = document.createElement ('span');
				if (num) {
					const n = document.createElement ('sup');
					n.appendChild (document.createTextNode (num));
					e.appendChild (n);
					}
				e.appendChild (document.createTextNode (desc));
				if (extra && extra.style)
					e.style = 'font-size:0.75em;' + extra.style;
				else
					e.style = 'font-size:0.75em';
				return e;
				}
			function MakeBoolElement (nm) {
				const e = document.createElement ('input');
				e.type = 'checkbox';
				e.checked = settings [nm];
				ess [nm] = e;
				return e;
				}
			function MakeListElement (nm, opts) {
				const e = document.createElement ('select');
				e.className = 'ytfix_field';
				ess [nm] = e;
				for (let i = 0, L = opts.length; i < L; ++i) {
					const o = document.createElement ('option');
					o.appendChild (document.createTextNode (opts [i]));
					e.appendChild (o);
					}
				e.selectedIndex = settings [nm];
				return e;
				}
			function MakeTextElement (nm) {
				const e = document.createElement ('input');
				e.className = 'ytfix_field';
				e.value = settings [nm];
				ess [nm] = e;
				return e;
				}
			function MakeSlider (nm, width, snap, steps) {
				let desc = { value : -1, mouse : false };
				const e = document.createElement ('div');
				e.className = 'ytfix_slide_base';
				e.style.width = `${width*snap*steps+1}px`;
				const b = document.createElement ('div');
				b.className = 'ytfix_slide_bar';
				e.appendChild (b);
				for (let x = width * snap * steps; x >= 0; x -= width * snap) {
					const s = document.createElement ('div');
					s.className = 'ytfix_slide_stroke';
					s.style.left = `${x}px`;
					e.appendChild (s);
					}
				const a = document.createElement ('div');
				a.className = 'ytfix_slide_arrow';
				e.appendChild (a);
				const i = document.createElement ('input');
				i.className = 'ytfix_field';
				i.type = 'number';
				i.style.width = `${(snap*steps).toString().length+2}em`;
				i.min = 0;
				i.max = snap * steps;
				i.step = 1;
				function UpdateValue (newvalue) {
					if (newvalue < 0)
						newvalue = 0;
					else if (newvalue > snap * steps)
						newvalue = snap * steps;
					if (newvalue == desc.value)
						return;
					desc.value = newvalue;
					a.style.left = `${desc.value*width-5}px`;
					i.value = desc.value;
					if (desc.callback)
						desc.callback (desc);
					}
				UpdateValue (settings [nm]);
				e.addEventListener ('mousedown', function (ev) {
					if (ev.buttons != 1)
						return;
					desc.mouse = ev.target === a;
					if (desc.mouse)
						return;
					let sliderRect = a.getBoundingClientRect ();
					if (ev.clientX <= sliderRect.left)
						UpdateValue (desc.value - snap);
					else if (ev.clientX > sliderRect.right)
						UpdateValue (desc.value + snap);
					});
				e.addEventListener ('mousemove', function (ev) {
					if (ev.buttons != 1 || !desc.mouse)
						return;
					let mx = ev.clientX - e.getBoundingClientRect ().left;
					mx += (width * snap) >> 1;
					mx -= mx % (width * snap);
					UpdateValue (mx / width);
					});
				i.addEventListener ('input', function () {
					if (/^\d+$/.test (i.value))
						UpdateValue (parseInt (i.value));
					});
				desc.base = e;
				desc.input = i;
				ess [nm] = desc;
				return desc;
				}
			function MakeButton (text, click) {
				const e = document.createElement ('input');
				e.type = 'button';
				e.className = 'ytfix_button';
				e.value = text;
				e.addEventListener ('click', click);
				return e;
				}
			const tabs_data = [];
			function MakeTab (name, text, checked) {
				const inp = document.createElement ('input');
				inp.type = 'radio';
				inp.id = name;
				inp.name = 'tabs';
				if (checked)
					inp.setAttribute ('checked', '');
				const lbl = document.createElement ('label');
				lbl.setAttribute ('for', name);
				lbl.appendChild (document.createTextNode (text));
				const cont = document.createElement ('div');
				cont.id = name + '_cont';
				style.innerHTML += `.ytfix_tabs > input#${name}:checked ~ div#${name}_cont {display:block}`;
				tabs_data.push ({ inp: inp, lbl: lbl, cont: cont });
				return cont;
				}
			const tab_gen = MakeTab ('tab_gen', 'General', true);
			const tab_front = MakeTab ('tab_front', 'Front page', false);
			const tab_search = MakeTab ('tab_search', 'Search', false);
			const tab_video = MakeTab ('tab_video', 'Video', false);
			const tab_channel = MakeTab ('tab_channel', 'Channel', false);
			const tab_subscriptions = MakeTab ('tab_subscriptions', 'Subscriptions', false);
			const tab_script = MakeTab ('tab_script', 'Script', false);
			const tabs_data_2 = [plane];
			tabs_data.forEach ((x) => tabs_data_2.push (x.inp, x.lbl));
			const tabbf = document.createElement ('div');
			tabbf.style = 'display:block;width:1px;height:2px;border-width:0 0 0 1px;position:absolute';
			tabs_data_2.push (tabbf);
			tabs_data.forEach ((x) => tabs_data_2.push (x.cont));
			const tabs = AddLine.apply (this, tabs_data_2);
			tabs.className += ' ytfix_tabs';
			AddLine (tab_gen, MakeBoolElement ("hide_guide"), MakeDesc ("Hide ''Guide'' menu when page opens"));
			AddLine (tab_gen, MakeBoolElement ("unfix_header"), MakeDesc ("Unstick header bar from top of the screen"));
			AddLine (tab_gen, MakeBoolElement ("try_load_more"), MakeDesc ("[DEPRECATED] Add button to try loading more content on pages with dynamic content load"));
			AddLine (tab_gen, MakeBoolElement ("unbound_video_title"), MakeDesc ("Remove size limit for video titles"));
			AddLine (tab_gen, MakeDesc ("Change YT logo target to https://www.youtube.com/..."), MakeTextElement ("logo_target"));
			AddLine (tab_gen, MakeBoolElement ("remove_yt_redirect"), MakeDesc ("Remove YT tracking from links (/redirect?...)"));
			const wwfs = document.createElement ('fieldset');
			const wwl = wwfs.appendChild (document.createElement ('legend'));
			wwl.appendChild (document.createTextNode ('Watched video thumbnails modification'));
			const wwt = wwfs.appendChild (document.createElement ('table')).appendChild (document.createElement ('tr'));
			const wwc1 = wwt.appendChild (document.createElement ('td'));
			const wwgs = MakeSlider ('watched_grayscale', 2, 10, 10);
			AddLine (wwc1, MakeDesc ('Grayscale, %'), wwgs.base, wwgs.input);
			const wwb = MakeSlider ('watched_blur', 50, 1, 4);
			AddLine (wwc1, MakeDesc ('Blur, px'), wwb.base, wwb.input);
			AddLine (wwc1, MakeNote (0, 'Options require user to be logged into YT account'));
			AddLine (wwc1, MakeNote (0, 'Sample image taken from https://unsplash.com/photos/n6TWNDfyPwk'));
			const wwc2 = wwt.appendChild (document.createElement ('td'));
			wwc2.style.textAlign = 'center';
			wwc2.appendChild (document.createTextNode ('Example'));
			wwc2.appendChild (document.createElement ('br'));
			wwc2.appendChild (document.createElement ('img')).src = 'https://picsum.photos/id/197/267/178';
			const wwc3 = wwt.appendChild (document.createElement ('td'));
			wwc3.style.textAlign = 'center';
			wwc3.appendChild (document.createTextNode ('Modified example'));
			wwc3.appendChild (document.createElement ('br'));
			const wwc3i = wwc3.appendChild (document.createElement ('img'));
			wwc3i.src = 'https://picsum.photos/id/197/267/178';
			function UpdateFilters () {
				wwc3i.style.filter = `grayscale(${wwgs.value}%)blur(${wwb.value}px)`;
				}
			UpdateFilters ();
			wwgs.callback = UpdateFilters;
			wwb.callback = UpdateFilters;
			AddLine (tab_gen, wwfs);
			AddLine (tab_gen, MakeBoolElement ("no_resume_time"), MakeDesc ("Remove resume time from the video links (&t=...)"));
			AddLine (tab_gen, MakeDesc ("Video resume bar (red)"), MakeListElement ("resume_bar_handling", ['depending on resume time (default)', 'full width of thumbnail', 'hide']));
			AddLine (tab_gen, MakeDesc ("View count display modifier"), MakeListElement ("view_count_mod", ['Short everywhere', 'Exact on video page, short otherwise (default)', 'Exact everywhere']));
			AddLine (tab_gen, MakeBoolElement ("clear_link_pp"), MakeDesc ("Remove &pp= from links"));
			AddLine (tab_gen, MakeBoolElement ("disable_video_preview"), MakeDesc ("Disable video on-hover previews"));
			AddLine (tab_gen, MakeBoolElement ("remove_rounded_corners_1"), MakeDesc ("Remove rounded corners on thumbnails and in video description"));
			AddLine (tab_gen, MakeBoolElement ("clear_sign"), MakeDesc ("Remove ''$1'' from visited video links"));
			const tsm = MakeTextElement ("thumbnail_size_m");
			tsm.className = settings.thumbnail_size == 5 ? 'ytfix_field' : 'ytfix_hide';
			const tsi = MakeListElement ("thumbnail_size", ['default', '180px', '240px', '360px', '480px', 'manual']);
			tsi.addEventListener ('change', function () {
				ess.thumbnail_size_m.className = ess.thumbnail_size.selectedIndex == 5 ? 'ytfix_field' : 'ytfix_hide';
				});
			AddLine (tab_front, MakeDesc ('Set thumbnails width'), tsi, tsm);
			AddLine (tab_front, MakeBoolElement ("hide_yt_suggested_blocks"), MakeDesc ("Hide suggestions blocks (recommended playlists, latest posts, etc.)"));
			AddLine (tab_front, MakeDesc ("Align main page content"), MakeListElement ("main_align", ['default', 'left', 'center', 'right']));
			AddLine (tab_search, MakeDesc ("Set thumbnails width"), MakeListElement ("search_thumbnail", ['default', '240px', '360px']));
			AddLine (tab_search, MakeBoolElement ("clear_search"), MakeDesc ("Hide suggestions blocks (for you, people also watched, etc.)"));
			AddLine (tab_video, MakeBoolElement ("fix_removed_placeholder"), MakeDesc ("Make size of ''Video removed'' placeholder about the same as removed video description"));
			AddLine (tab_video, MakeDesc ("Set player height in default mode"), MakeListElement ("default_player", ['default','144px','240px','360px','480px','720px']));
			AddLine (tab_video, MakeDesc ("Set player height in theater mode"), MakeListElement ("theater_player", ['default','144px','240px','360px','480px','720px']));
			AddLine (tab_video, MakeDesc ("Align resized player into it's container (normal and theater modes)"), MakeListElement ("align_player", ['center','left','right']));
			AddLine (tab_video, MakeDesc ("Starting video quality"), MakeListElement ('video_quality', ['Auto (default)', '2160p (4K)', '1440p (HD)', '1080p (HD)', '720p', '480p', '360p', '240p', '144p']),
				MakeNote (0, 'Settings other than "default" may break quality autoswitching if you use "Enhancer for YouTube" extention.', { style: 'margin-top:0.4em;display:block' })
				);
			AddLine (tab_video, MakeBoolElement ("disable_player_click_overlay"), MakeDesc ("Remove rewinding overlay"));
			AddLine (tab_video, MakeDesc ("Video description width (including suggested videos column)"), MakeListElement ("description_width", ['default', 'stretch', '1200px', '1280px', '1360px', '1440px', '1520px', '1600px', '1680px', '1760px', '1840px', '1920px']));
			AddLine (tab_video, MakeBoolElement ("simpler_fullscreen"), MakeDesc ("Simplify fullscreen (no video description, comments, etc.)"));
			AddLine (tab_video, MakeBoolElement ("exact_likes"), MakeDesc ("Show exact likes count"));
			AddLine (tab_video, MakeBoolElement ("hide_engagement_panel_transcript"), MakeDesc ("Disable 'Transcript' side panel"));
			AddLine (tab_video, MakeBoolElement ("hide_engagement_panel_structured_description"), MakeDesc ("Disable 'Desciption' side panel"));
			AddLine (tab_video, MakeDesc ("Convert ''shorts'' video format to normal format"), MakeListElement ("short_to_full2", ['disabled', 'with page reload', 'without page reload']));
			AddLine (tab_video, MakeBoolElement ("hide_metadata"), MakeDesc ("Hide YT ''metadata'' (links to games, movies, etc.)"));
			AddLine (tab_video, MakeBoolElement ("video_shelves"), MakeDesc ("Remove shelves"));
			AddLine (tab_video, MakeBoolElement ("no_player_round_corners"), MakeDesc ("Remove round corners on the player"));
			AddLine (tab_channel, MakeDesc ("Channel banner behaviour"), MakeListElement ("channel_top", ['default', 'hide banner with scrolling', 'hide banner entirely']));
			const tscm = MakeTextElement ("thumbnail_size_channel_m");
			tscm.className = settings.thumbnail_size_channel == 5 ? 'ytfix_field' : 'ytfix_hide';
			const tsci = MakeListElement ("thumbnail_size_channel", ['default', '180px', '240px', '360px', '480px', 'manual']);
			tsci.addEventListener ('change', function () {
				ess.thumbnail_size_channel_m.className = ess.thumbnail_size_channel.selectedIndex == 5 ? 'ytfix_field' : 'ytfix_hide';
				});
			AddLine (tab_channel, MakeDesc ('Set thumbnails width'), tsci, tscm);
			AddLine (tab_channel, MakeDesc ("Switch from channel's home page to..."), MakeListElement ("channel_default", ['home (default)', 'videos', 'shorts', 'live', 'playlists', 'community', 'channeld', 'about']));
			AddLine (tab_subscriptions, MakeDesc ("Align subscriptions page content"), MakeListElement ("subscriptions_align", ['default', 'left', 'center', 'right']));
			AddLine (tab_script, MakeDesc ('Alert about script version changes'), MakeListElement ("update_alert", ['never', 'only major', 'except bugfixes', 'all']));
			AddLine (tab_script, MakeNote (0, "Version usually consist of 3 numbers (major version, minor version and release) and it's changes usually follow these rules:"));
			AddLine (tab_script, MakeNote (0, '* major version change indicates some incompatabilities with pervious versions;'));
			AddLine (tab_script, MakeNote (0, '* minor version change indicates some new functionality;'));
			AddLine (tab_script, MakeNote (0, '* release change indicate bugfixes or other internal improvements.'));
			e1 = MakeButton ('Save settings and return to YouTube', function () {
				settings.align_player = ess.align_player.selectedIndex;
				settings.channel_default = ess.channel_default.selectedIndex;
				settings.channel_top = ess.channel_top.selectedIndex;
				settings.clear_link_pp = ess.clear_link_pp.checked;
				settings.clear_search = ess.clear_search.checked;
				settings.clear_sign = ess.clear_sign.checked;
				settings.default_player = ess.default_player.selectedIndex;
				settings.description_width = ess.description_width.selectedIndex;
				settings.disable_player_click_overlay = ess.disable_player_click_overlay.checked;
				settings.disable_video_preview = ess.disable_video_preview.checked;
				settings.exact_likes = ess.exact_likes.checked;
				settings.fix_removed_placeholder = ess.fix_removed_placeholder.checked;
				settings.hide_engagement_panel_structured_description = ess.hide_engagement_panel_structured_description.checked;
				settings.hide_engagement_panel_transcript = ess.hide_engagement_panel_transcript.checked;
				settings.hide_guide = ess.hide_guide.checked;
				settings.hide_metadata = ess.hide_metadata.checked;
				settings.hide_yt_suggested_blocks = ess.hide_yt_suggested_blocks.checked;
				settings.logo_target = ess.logo_target.value;
				settings.main_align = ess.main_align.selectedIndex;
				settings.no_player_round_corners = ess.no_player_round_corners.checked;
				settings.no_resume_time = ess.no_resume_time.checked;
				settings.remove_rounded_corners_1 = ess.remove_rounded_corners_1.checked;
				settings.remove_yt_redirect = ess.remove_yt_redirect.checked;
				settings.resume_bar_handling = ess.resume_bar_handling.selectedIndex;
				settings.search_thumbnail = ess.search_thumbnail.selectedIndex;
				settings.short_to_full2 = ess.short_to_full2.selectedIndex;
				settings.simpler_fullscreen = ess.simpler_fullscreen.checked;
				settings.subscriptions_align = ess.subscriptions_align.selectedIndex;
				settings.theater_player = ess.theater_player.selectedIndex;
				settings.thumbnail_size = ess.thumbnail_size.selectedIndex;
				if (settings.thumbnail_size == 5) {
					const v = ess.thumbnail_size_m.value;
					if (!/^\d+$/.test (v)) {
						alert ('Error: invalid value for thumbnails size');
						return;
						}
					settings.thumbnail_size_m = parseInt (v);
					}
				settings.thumbnail_size_channel = ess.thumbnail_size_channel.selectedIndex;
				if (settings.thumbnail_size_channel == 5) {
					const v = ess.thumbnail_size_channel_m.value;
					if (!/^\d+$/.test (v)) {
						alert ('Error: invalid value for thumbnails size');
						return;
						}
					settings.thumbnail_size_channel_m = parseInt (v);
					}
				settings.try_load_more = ess.try_load_more.checked;
				settings.unbound_video_title = ess.unbound_video_title.checked;
				settings.unfix_header = ess.unfix_header.checked;
				settings.update_alert = ess.update_alert.selectedIndex;
				settings.video_quality = ess.video_quality.selectedIndex;
				settings.video_shelves = ess.video_shelves.checked;
				settings.view_count_mod = ess.view_count_mod.selectedIndex;
				settings.watched_blur = ess.watched_blur.value;
				settings.watched_grayscale = ess.watched_grayscale.value;
				storage.save ('settings', settings);
				alert ('Settings saved');
				history.back ();
				});
			e2 = MakeButton ('Return to YouTube without saving', function () {
				history.back ();
				});
			AddLine (plane, e1, e2);
			e1 = MakeButton ('Export settings', function () {
				const d = document.createElement ('a');
				d.style.display = 'none';
				d.setAttribute ('download', 'ytfix_settings.json');
				d.setAttribute ('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent (JSON.stringify (settings)));
				document.body.appendChild (d);
				d.click ();
				document.body.removeChild (d);
				});
			e2 = MakeButton ('Import settings', function () {
				const f = document.createElement ('input');
				f.type = 'file';
				f.style.display = 'none';
				f.addEventListener ('change', function () {
					if (f.files.length != 1)
						return;
					const rdr = new FileReader ();
					rdr.addEventListener ('load', function () {
						try {
							settings = JSON.parse (rdr.result);
							storage.save ('settings', settings);
							alert ('Settings imported');
							location.reload ();
							}
						catch (ex) {
							alert ('Error parsing settings\n' + ex);
							}
						});
					rdr.addEventListener ('error', () => alert ('Error loading file\n' + rdr.error));
					rdr.readAsText (f.files [0]);
					});
				document.body.appendChild (f);
				f.click ();
				document.body.removeChild (f);
				});
			AddLine (plane, e1, e2);
			}
		let int = setInterval (function () {
			if (!document.body)
				return;
			document.body.appendChild (back);
			document.body.appendChild (plane);
			clearInterval (int);
			}, 1);
		console.log ('Settings page created');
		return;
		}
	// set hidden settings
	// apply settings
	function unwrap (x) {
		return x.wrappedJSObject || x;
		}
	function WaitForElement (select, attribs, callback) {
		const q = document.querySelector (select);
		if (q)
			return callback (q);
		const sett = { childList: true, subtree: true };
		if (attribs.length) {
			sett.attributes = true;
			sett.attributeFilter = attribs;
			}
		new MutationObserver ((list, mo) => {
			for (const rec of list)
				switch (rec.type) {
					case 'childList':
						for (const node of rec.addedNodes)
							if (node && node.nodeType === Node.ELEMENT_NODE && node.matches (select)) {
								mo.disconnect ();
								return callback (node);
								}
						break;
					case 'attributes':
						if (rec.target.matches (select)) {
							mo.disconnect ();
							return callback (rec.target);
							}
						break;
					}
			}).observe (document.body, sett);
		}
	let styles = '';
	const notifier = document.createElement ('span');
	/*
	const orig_fetch = unsafeWindow.fetch;
	unsafeWindow.fetch = $$ ((...args) => {
		return new (unsafeWindow.Promise) ($$ ((res, rej) => {
			orig_fetch (...args).then ($$ (resp => {
				try {
					const ct = resp.headers.get ("Content-Type");
					if (ct !== null && ct.startsWith ("application/json"))
						resp.clone ().json ().then (j => notifier.dispatchEvent (new CustomEvent ('ytfix-json-catch', { detail: { json: j, resp: resp }}))).catch ();
					}
				catch (e) { }
				res (resp);
				}), rej);
			}));
		});
	*/
	if (true) {
		let url = undefined;
		let sea = undefined;
		let ev = undefined;
		notifier.notify = function (callback) {
			if (ev)
				callback (ev);
			notifier.addEventListener ('ytfix-urlchange', callback);
			};
		function ChangeDetect () {
			if (location.pathname === url && location.search === sea)
				return;
			url = location.pathname;
			sea = location.search;
			const modurl = url.replace (/^\/(user\/|channel\/|@\b)/, '/c/');
			console.log ('navigate to', url, sea);
			unwrap (document.body).setAttribute ('ytfix-url', modurl);
			ev = new CustomEvent ('ytfix-urlchange', { detail: modurl });
			notifier.dispatchEvent (ev);
			}
		document.addEventListener ('DOMContentLoaded', () => {
			ChangeDetect ();
			window.addEventListener ('popstate', ChangeDetect);
			window.addEventListener ('yt-navigate-start', ChangeDetect);
			});
		}
	if (settings.hide_guide) {
		let btn = null;
		let clicked = false;
		function Press () {
			if (btn && !clicked && btn.attributes ['aria-pressed'].value === 'true') {
				btn.click ();
				clicked = false;
				unwrap (window).dispatchEvent (new Event ('resize'));
				}
			}
		document.addEventListener (
			'DOMContentLoaded',
			() => WaitForElement (
				'yt-icon-button#guide-button.ytd-masthead > button[aria-pressed]',
				['aria-pressed'],
				x => {
					btn = x;
					x.addEventListener ('click', () => { clicked = true; });
					new MutationObserver (Press).observe (x, { attributes: true, attributeFilter: ['aria-pressed'] });
					Press ();
					}
				)
			);
		window.addEventListener ('yt-navigate-finish', () => {
			clicked = false;
			Press ();
			});
		}
	if (settings.unfix_header)
		styles += `
			div#masthead-container.ytd-app,ytd-mini-guide-renderer.ytd-app,app-drawer#guide{position:absolute!important}
			ytd-feed-filter-chip-bar-renderer{position:relative!important}
			ytd-feed-filter-chip-bar-renderer:not([not-sticky]) > div#chips-wrapper{position:absolute!important;top:0!important}
			ytd-rich-grid-renderer > div#chips-wrapper{position:absolute!important;top:0!important}
			#frosted-glass.with-chipbar.ytd-app { display:none!important; }
			`;
	if (settings.try_load_more) {
		setInterval (function () {
			const l = document.querySelectorAll ('#show-more-button');
			let i = l.length;
			if (--i >= 0 && l [i].hasAttribute ('hidden')) {
				l [i].removeAttribute ('hidden');
				l [i].innerText = 'TRY LOAD MORE';
				}
			while (--i >= 0)
				l [i].parentNode.removeChild (l [i]);
			}, 1000);
		styles += '#show-more-button{color:var(--yt-spec-call-to-action);width:100%;text-align:center;border:1px solid;padding:1em;cursor:pointer}';
		}
	if (settings.unbound_video_title)
		styles += `
			#video-title{max-height:none!important;-webkit-line-clamp:none!important}
			yt-lockup-metadata-view-model.yt-lockup-metadata-view-model-wiz--compact a.yt-lockup-metadata-view-model-wiz__title{max-height:unset!important;display:unset!important}
			.yt-lockup-metadata-view-model-wiz--standard.yt-lockup-metadata-view-model-wiz--rich-grid-legacy-typography .yt-lockup-metadata-view-model-wiz__title{display:block!important;max-height:unset!important}
			.yt-lockup-metadata-view-model-wiz--standard .yt-lockup-metadata-view-model-wiz__title{overflow:unset!important;max-height:unset!important}
			.yt-lockup-metadata-view-model__title { -webkit-line-clamp: unset!important; max-height: unset!important; }
			`;
	if (settings.logo_target) {
		let url = settings.logo_target;
		if (url [0] != '/')
			url = '/' + url;
		url = location.origin + url;
		setInterval (function () {
			for (const E of document.querySelectorAll ('a#logo')) {
				const Q = selector (unwrap (E).data, 'commandMetadata', 'webCommandMetadata');
				if (Q)
					Q.url = url;
				if (E.href !== url)
					E.href = url;
				}
			}, 1000);
		}
	if (settings.remove_yt_redirect) {
		function removeRedirectClearer (l) {
			l.href = decodeURIComponent (l.href.replace (/^.*\?(.*&)q=([^&]+)(&.*)?$/, '$2'));
			const w = selector (unwrap (l), 'data', 'urlEndpoint');
			if (w)
				w.url = l.href;
			}
		setInterval (function () {
			document.querySelectorAll ('a[href^="https://www.youtube.com/redirect?"]').forEach (removeRedirectClearer);
			}, 1000);
		}
	let watched = '';
	if (settings.watched_grayscale)
		watched += `grayscale(${settings.watched_grayscale}%)`;
	if (settings.watched_blur)
		watched += `blur(${settings.watched_blur}px)`;
	if (watched)
		styles += `a[href*="/watch?"]:not([href^="/watch?"]).ytd-thumbnail img,a[href*="/watch?"]:not([href^="/watch?"]).yt-lockup-view-model-wiz__content-image img,a[href*="/watch?"]:not([href^="/watch?"]) .ytThumbnailViewModelImage img { filter: ${watched}; }`;
	if (settings.no_resume_time || watched) {
		function removeTimesClearer (l) {
			while (l && l.tagName != 'A')
				l = l.parentNode;
			if (!l)
				return;
			if (!settings.no_resume_time || l.querySelector ('img') === null || l.parentNode.tagName === 'YTD-MACRO-MARKERS-LIST-ITEM-RENDERER') {
				l.href = l.href.replace (/&t=\d+s?/, '$1');
				return;
				}
			l.href = l.href.replace (/&t=\d+s?/, '');
			l = unwrap (l);
			if (!l.data || !l.data.watchEndpoint || !l.data.watchEndpoint.startTimeSeconds)
				return;
			delete l.data.watchEndpoint;
			try { l.data.commandMetadata.webCommandMetadata.url = l.href; } catch (ex) { }
			}
		setInterval (function () {
			document.querySelectorAll ('a[href^="/watch?"] div.ytd-thumbnail-overlay-resume-playback-renderer').forEach (removeTimesClearer);	// основное применение
			document.querySelectorAll ('a[href^="/watch?"] yt-thumbnail-overlay-progress-bar-view-model').forEach (removeTimesClearer);     // v2
			document.querySelectorAll ('a[href^="/watch?"][href*="&t="]').forEach (removeTimesClearer);	// на случай прочих ссылок
			}, 1000);
		}
	styles += [
		'',
		'div.ytd-thumbnail-overlay-resume-playback-renderer{width:100%!important}',
		'ytd-thumbnail-overlay-resume-playback-renderer{display:none!important}'
		] [settings.resume_bar_handling];
	if (settings.view_count_mod === 2) {
		function replaceCountersText (x) {
			x = unwrap (x);
			const par = x.parentNode.__ytfix_parent;
			if (!par)
				return;
			try {
				const d = par.__data.data;
				const val = d.viewCountText.simpleText;
				if (val !== d.shortViewCountText.simpleText) {
					d.shortViewCountText.simpleText = val;
					d.shortViewCountText.accessibility.accessibilityData.label = val;
					x.textContent = val;
					}
				return;
				}
			catch (ex) { }
			try {
				const d =  par.__data.data.content.videoRenderer;
				const val = d.viewCountText.simpleText;
				if (val !== d.shortViewCountText.simpleText) {
					d.shortViewCountText.simpleText = val;
					d.shortViewCountText.accessibility.accessibilityData.label = val;
					x.textContent = val;
					}
				return;
				}
			catch (ex) { }
			// TODO: fetch?
			}
		function replaceCountersCallback (mm) {
			for (let i = mm.length; --i >= 0; )
				replaceCountersText (mm [i].target);
			}
		const m = new MutationObserver (replaceCountersCallback);
		const opt = { subtree: true, characterData: true };
		function replaceCountersEach (x) {
			const ee = x.querySelectorAll ('#metadata-line span');
			if (ee.length == 2) {
				x.setAttribute ('ytfix', '');
				const e = ee [0];
				unwrap (e).__ytfix_parent = x;
				replaceCountersText (e.firstChild);
				m.observe (e, opt);
				return;
				}
			const ee2 = x.querySelectorAll ('span.yt-core-attributed-string.yt-content-metadata-view-model-wiz__metadata-text');
			if (ee2.length == 3) {
				x.setAttribute ('ytfix', '');
				const e = ee2 [1];
				unwrap (e).__ytfix_parent = x;
				replaceCountersText (e.firstChild);
				m.observe (e, opt);
				return;
				}
			}
		function replaceCountersText2 (x) {
			try {
				const vvcr = x.__dataHost.__data.videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer;
				const val = vvcr.viewCount.simpleText;
				if (val !== vvcr.shortViewCount.simpleText) {
					vvcr.shortViewCount.simpleText = val;
					x.querySelectorAll ('span') [0].textContent = val;
					}
				return;
				}
			catch (ex) { }
			}
		function replaceCountersCallback2 (mm) {
			for (let i = mm.length; --i >= 0; )
				replaceCountersText2 (mm [i].target.parentNode);
			}
		const m2 = new MutationObserver (replaceCountersCallback2);
		const opt2 = { subtree: true, childList: true };
		function replaceCountersEach2 (x) {
			x.setAttribute ('ytfix', '');
			replaceCountersText2 (x);
			m2.observe (x, opt2);
			}
		setInterval (function () {
			document.querySelectorAll ('ytd-compact-video-renderer:not([ytfix])').forEach (replaceCountersEach);
			document.querySelectorAll ('ytd-grid-video-renderer:not([ytfix])').forEach (replaceCountersEach);
			document.querySelectorAll ('ytd-rich-item-renderer:not([ytfix])').forEach (replaceCountersEach);
			document.querySelectorAll ('ytd-video-renderer:not([ytfix])').forEach (replaceCountersEach);
			document.querySelectorAll ('yt-formatted-string#info:not([ytfix])').forEach (replaceCountersEach2);
			}, 1000);
		}
	if (settings.view_count_mod === 0)
		styles += `
			span.view-count.ytd-video-view-count-renderer {display:none!important}
			span.short-view-count.ytd-video-view-count-renderer {display:block!important}
			`;
	if (settings.clear_link_pp) {
		function clearLink (l) {
			l.setAttribute ('href', l.getAttribute ('href').replace (/&pp=[^&]*/, ''));
			}
		setInterval (function () {
			document.querySelectorAll ('a[href*="/watch?"][href*="&pp="]').forEach (clearLink);
			}, 1000);
		}
	if (settings.disable_video_preview)
		styles += `
			ytd-thumbnail-overlay-time-status-renderer { display: inline-flex !important; }
			ytd-video-preview, div#hover-overlays { display: none !important; }
			`;
	if (settings.remove_rounded_corners_1)
		styles += `
			ytd-thumbnail a.ytd-thumbnail, ytd-thumbnail::before {border-radius:0!important}
			ytd-playlist-thumbnail a.ytd-playlist-thumbnail, ytd-playlist-thumbnail::before {border-radius:0!important}
			ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer {border-radius:0!important}
			ytd-watch-metadata[modern-metapanel] #description.ytd-watch-metadata {border-radius:0!important}
			ytd-rich-metadata-renderer[rounded] {border-radius:0!important}
			div.image-wrapper.ytd-hero-playlist-thumbnail-renderer {border-radius:0!important}
			div.ytp-videowall-still-image, .ytp-ce-video.ytp-ce-large-round {border-radius:0!important}
			.yt-thumbnail-view-model--medium, .yt-thumbnail-view-model--large {border-radius:0!important}
			.ytThumbnailViewModelMedium, .ytThumbnailViewModelLarge { border-radius: 0!important; }
			`;
	if (settings.clear_sign)
		setInterval (() => {
			for (const e of document.querySelectorAll ('a[href*="$1"]'))
				e.setAttribute ('href', e.getAttribute ('href').replace (/\$1$/, ''));
			}, 1000);
	if (settings.thumbnail_size)
		styles += `
			body:not([ytfix-url^='/c/']) div#contents.ytd-rich-grid-renderer {display:block!important}
			body:not([ytfix-url^='/c/']) ytd-rich-grid-row.ytd-rich-grid-renderer {display:inline!important}
			body:not([ytfix-url^='/c/']) ytd-rich-grid-row.ytd-rich-grid-renderer > div {display:inline!important;margin:0!important}
			body:not([ytfix-url^='/c/']) ytd-rich-item-renderer:not(.YT-HWV-WATCHED-HIDDEN):not(.YT-HWV-SHORTS-HIDDEN) {display:inline-block!important;width:${[0, 180, 240, 360, 480, settings.thumbnail_size_m] [settings.thumbnail_size]}px!important;contain:none!important;margin-left:calc(var(--ytd-rich-grid-item-margin)/2)!important;margin-right:calc(var(--ytd-rich-grid-item-margin)/2)!important}
			`;
	if (settings.hide_yt_suggested_blocks)
		styles += `
			body:[ytfix-url^='/c/'] div#contents.ytd-rich-grid-renderer ytd-rich-section-renderer:not(:first-child){display:none!important}
			body:not([ytfix-url^='/c/']):not([ytfix-url='/feed/subscriptions']) div#contents.ytd-rich-grid-renderer ytd-rich-section-renderer{display:none!important}
			`;
	if (settings.main_align)
		styles += `body[ytfix-url='/'] div#contents {text-align:${['','left','center','right'][settings.main_align]}}`;
	if (settings.search_thumbnail) {
		const sz = [0, 240, 360] [settings.search_thumbnail] + 'px!important';
		// min-width defaults to 240px, max-width defaults to 360px
		// sizes for: videos, playlists, channels, mixes
		styles += `
			body[ytfix-url='/results'] ytd-video-renderer ytd-thumbnail.ytd-video-renderer,
			body[ytfix-url='/results'] ytd-playlist-renderer ytd-playlist-thumbnail.ytd-playlist-renderer,
			body[ytfix-url='/results'] ytd-channel-renderer #avatar-section.ytd-channel-renderer,
			body[ytfix-url='/results'] ytd-radio-renderer ytd-thumbnail.ytd-radio-renderer,
			body[ytfix-url='/results'] ytd-radio-renderer ytd-playlist-thumbnail.ytd-radio-renderer
				{min-width:${sz};max-width:${sz}}
			body[ytfix-url='/results'] ytd-radio-renderer {--ytd-thumbnail-max-width:${sz};--ytd-thumbnail-min-width:${sz}}
			`;
		}
	if (settings.clear_search)
		styles += `
			ytd-two-column-search-results-renderer ytd-shelf-renderer.style-scope.ytd-item-section-renderer,
			ytd-two-column-search-results-renderer ytd-horizontal-card-list-renderer.style-scope.ytd-item-section-renderer,
			ytd-two-column-search-results-renderer ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer
				{display:none!important}
			`;
	if (settings.fix_removed_placeholder)
		styles += `
			paper-button.style-blue-text, tp-yt-paper-button.style-blue-text, .ytNotificationMultiActionRendererButton { padding: 0!important; }
			ytd-compact-video-renderer ytd-notification-multi-action-renderer button { line-height: 24px!important; height: 24px!important; }
			yt-lockup-view-model notification-multi-action-renderer button, yt-lockup-view-model notification-multi-action-renderer a { line-height: 24px!important; height:24px!important; background: none!important; color:#3ea6ff!important; }
			.ytNotificationMultiActionRendererHost { font-size: 1.2rem!important; padding-top: 12px!important; }
			.ytNotificationMultiActionRendererTextContainer { margin-bottom: 8px!important; }
			.ytThumbnailViewModelMedium { border-radius: 0!important; }
			`;
	const size_norm = [0, 144, 240, 360, 480, 720] [settings.default_player];
	if (size_norm) {
		styles += `
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater]){--ytd-watch-flexy-min-player-height:${size_norm}px!important;--ytd-watch-flexy-max-player-height:${size_norm}px!important;--ytd-watch-flexy-max-player-width:var(--ytd-watch-flexy-min-player-width)!important}
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater])[is-vertical-video_]{--ytd-watch-flexy-min-player-width:calc(${size_norm}px*16/9)!important;}
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater]):not([is-vertical-video_]){--ytd-watch-flexy-min-player-width:calc(${size_norm}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))!important;}
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater]) div#player.ytd-watch-flexy{min-width:var(--ytd-watch-flexy-min-player-width);max-width:var(--ytd-watch-flexy-max-player-width);left:50%;transform:translate(-50%,0);}
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen]):not([theater]) div#player-container-outer.ytd-watch-flexy{height:var(--ytd-watch-flexy-max-player-height);min-width:calc(${size_norm}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))!important}
			`;
		setInterval (function () {
			for (const eq of document.querySelectorAll ("ytd-watch-flexy:not([theater]) #movie_player")) {
				const ep = unwrap (eq);
				if (ep.setInternalSize && ep.isFullscreen && ep.getPlayerSize && !ep.isFullscreen () && ep.getPlayerSize ().height != size_norm)
					ep.setInternalSize ();
				}
			}, 1000);
		}	const size_theater = [0, 144, 240, 360, 480, 720] [settings.theater_player];
	if (size_theater) {
		styles += `
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen])[theater] #player-theater-container,
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen])[theater] #player-wide-container,
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen])[theater] #player-full-bleed-container
				{min-width:calc(${size_theater}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))!important;max-width:calc(${size_theater}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))!important;min-height:${size_theater}px!important;max-height:${size_theater}px!important;height:${size_theater}px!important}
			ytd-watch-flexy:not([fullscreen]):not([simple-fullscreen])[theater] div#movie_player{height:${size_theater}px;width:calc(${size_theater}px*var(--ytd-watch-flexy-width-ratio)/var(--ytd-watch-flexy-height-ratio))}
			`;
		setInterval (function () {
			for (const eq of document.querySelectorAll ("ytd-watch-flexy[theater] #movie_player")) {
				const ep = unwrap (eq);
				if (ep.setInternalSize && ep.isFullscreen && ep.getPlayerSize && !ep.isFullscreen () && ep.getPlayerSize ().height != size_theater)
					ep.setInternalSize ();
				}
			}, 1000);
		}
	styles += [
		'#player-theater-container,#player-wide-container,#player-full-bleed-container{margin-left:auto!important;margin-right:auto!important}',
		'#player-container-outer{margin-left:0!important}',
		'#player-container-outer{margin-right:0!important}#player-theater-container,#player-wide-container,#player-full-bleed-container{margin-left:auto!important}'
		] [settings.align_player];
	if (settings.video_quality) {
		function TryQuality (quality, qq, ep) {
			return qq.includes (quality) && (ep.setPlaybackQualityRange (quality, quality) || true);
			}
		let fail = '';
		setInterval (function () {
			const p = document.getElementById ("movie_player");
			if (!p)
				return;
			const ep = unwrap (p);
			if (!ep.getPreferredQuality || !ep.getAvailableQualityLevels || !ep.setPlaybackQualityRange || !ep.getVideoData || ep.getPreferredQuality () != 'auto')
				return;
			const vid = ep.getVideoData ().video_id;
			if (fail == vid)	// данное видео уже обработано
				return;
			const qq = ep.getAvailableQualityLevels ();
			if (!qq || !qq.length)
				return;
			switch (settings.video_quality) {	// intentional no breaks here
				case 1: if (TryQuality ('hd2160', qq, ep)) return;
				case 2: if (TryQuality ('hd1440', qq, ep)) return;
				case 3: if (TryQuality ('hd1080', qq, ep)) return;
				case 4: if (TryQuality ('hd720', qq, ep)) return;
				case 5: if (TryQuality ('large', qq, ep)) return;
				case 6: if (TryQuality ('medium', qq, ep)) return;
				case 7: if (TryQuality ('small', qq, ep)) return;
				case 8: if (TryQuality ('tiny', qq, ep)) return;
				}
			console.log ('Unknown video qualities in list: ', qq);
			fail = vid;
			}, 1000);
		}
	if (settings.disable_player_click_overlay)
		styles += 'div.ytp-doubletap-ui,div.ytp-doubletap-ui-legacy {display:none}';
	if (settings.description_width) {
		const w = [0, '100vw', '1200px', '1280px', '1360px', '1440px', '1520px', '1600px', '1680px', '1760px', '1840px', '1920px'] [settings.description_width];
		styles += `
			ytd-app:not([mini-guide-visible_]) ytd-page-manager {--ytf-width:calc(${w} - 20px);min-width:100%}
			ytd-app[mini-guide-visible_]  ytd-page-manager {--ytf-width:calc(${w} - 92px);min-width:calc(100% - 92px)}
			ytd-watch-flexy[flexy][fullscreen] {min-width:100%!important}
			ytd-watch-flexy[flexy] #columns {--ytd-watch-flexy-min-player-width:calc(var(--ytf-width) - var(--ytd-watch-flexy-sidebar-width) - 3 * var(--ytd-margin-6x));min-width:var(--ytf-width)!important;max-width:var(--ytf-width)!important}
			ytd-watch-flexy[flexy][is-two-columns_]:not([is-four-three-to-sixteen-nine-video_]):not([is-extra-wide-video_]) div#primary.ytd-watch-flexy {max-width:var(--ytd-watch-flexy-max-player-width);min-width:var(--ytd-watch-flexy-min-player-width)}
			ytd-watch-flexy[flexy][is-vertical-video_] div#player-container-inner.ytd-watch-flexy {width:calc(var(--ytd-watch-flexy-min-player-height)*1.7777777778);position:relative;transform:translate(-50%,0);margin-left:50%}
			`;
		}
	if (settings.simpler_fullscreen) {
		let keys = undefined;
		if (document.exitFullscreen)
			keys = document.fullscreenEnabled && { enter: 'requestFullscreen', exit: 'exitFullscreen', check: 'fullscreenElement', event: 'fullscreenchange', type: 'standart' };
		else if (document.mozCancelFullScreen)
			keys = document.mozFullScreenEnabled && { enter: 'mozRequestFullScreen', exit: 'mozCancelFullScreen', check: 'mozFullScreenElement', event: 'mozfullscreenchange', type: 'mozilla' };
		else if (document.webkitExitFullscreen)
			keys = document.webkitFullscreenEnabled && { enter: 'webkitRequestFullscreen', exit: 'webkitExitFullscreen', check: 'webkitFullscreenElement', event: 'webkitfullscreenchange', type: 'webkit' };
		else if (document.msExitFullscreen)
			keys = document.msFullscreenEnabled && { enter: 'msRequestFullscreen', exit: 'msExitFullscreen', check: 'msFullscreenElement', event: 'MSFullscreenChange', type: 'microsoft' };
		if (!keys)
			console.log ('unable to determine fullscreen API prefix or fullscreen API disabled');
		else {
			console.log ('detected fullscreen API type:', keys.type);
			styles += `
				button.ytp-fullerscreen-edu-button ,
				div.ytp-fullscreen-grid ,
				div.ytp-overlay-bottom-right>div.ytp-fullscreen-quick-actions>yt-player-quick-action-buttons>toggle-button-view-model ,
				div.ytp-overlay-bottom-right>div.ytp-fullscreen-quick-actions>yt-player-quick-action-buttons>button-view-model
					{display:none!important}
				div#movie_player { --ytp-grid-scroll-percentage:0!important; }
				`;
			document.addEventListener (keys.event, function () {
				const enter = !!document [keys.check];
				document.getElementById ("movie_player").setFauxFullscreen (enter);
				for (const q of document.querySelectorAll ('ytd-watch-flexy'))
					q [enter ? 'setAttribute' : 'removeAttribute'] ('simple-fullscreen', '');
				});
			setInterval (function () {
				for (const p of document.querySelectorAll ('button.ytp-fullscreen-button:not([ytfix])')) {
					const q = document.createElement ('button');
					q.className = p.className;
					p.parentNode.appendChild (q);
					q.appendChild (p.querySelector ('svg'));
					q.setAttribute ('title', 'Full screen');
					p.style.display = 'none';
					p.disabled = true;
					p.setAttribute ('ytfix', '');
					q.setAttribute ('ytfix', '');
					q.addEventListener ('mousedown', function (event) {
						event.preventDefault ();
						});
					q.addEventListener ('click', function (event) {
						if (document [keys.check])
							document [keys.exit] ();
						else {
							let w = event.target;
							while (w && w.tagName !== "YTD-PLAYER")
								w = w.parentNode;
							if (w)
								w [keys.enter] ();
							}
						});
					}
				}, 1000);
			}
		}
	if (settings.exact_likes) {
		function conv_exact (x) {
			if (x.length < 4)
				return x;
			if (x.length < 7)
				return x.slice (0, -3) + '\u00A0' + x.slice (-3);
			if (x.length < 10)
				return x.slice (0, -6) + '\u00A0' + x.slice (-6, -3) + '\u00A0' + x.slice (-3);
			return x.slice (0, -9) + '\u00A0' + x.slice (-9, -6) + '\u00A0' + x.slice (-6, -3) + '\u00A0' + x.slice (-3);
			}
		const tcdef = Object.getOwnPropertyDescriptor (Node.prototype, 'textContent');
		function ItemProcess (x) {
			const unwrap_x = unwrap (x);
			if ((unwrap_x.__data || unwrap_x.inst.__data).data.targetId !== 'watch-like')
				return;
			(x.shadowRoot || x).querySelectorAll ('yt-formatted-string').forEach (s => {
				const r = unwrap (s).__data.text;
				const likesTxt = conv_exact (r.accessibility.accessibilityData.label.replace (/[^\d]/g, '') || '0');
				if (tcdef.get.call (s) !== likesTxt) {
					r.simpleText = likesTxt;
					tcdef.set.call (s, likesTxt);
					}
				});
			const i = unwrap (x).inst.__data.data.defaultText;
			const ii = unwrap (x).inst.textNumberValue || selector (i, 'accessibility', 'accessibilityData', 'label') || i.simpleText;
			const likesTxt = conv_exact (ii.replace (/[^\d]/g, '') || '0');
			x.querySelectorAll ('yt-button-shape').forEach (s => {
				function SetText (t) {
					const s = unwrap (t);
					if (tcdef.get.call (s) !== likesTxt)
						tcdef.set.call (s, likesTxt);
					}
				s.querySelectorAll ('span[role=text]').forEach (SetText);
				s.querySelectorAll ('yt-animated-rolling-number').forEach (SetText);
				});
			}
		setInterval (function () {
			document.querySelectorAll ('ytd-menu-renderer.ytd-video-primary-info-renderer').forEach (q => {
				(q.shadowRoot || q).querySelectorAll ('ytd-toggle-button-renderer').forEach (ItemProcess);
				});
			document.querySelectorAll ('ytd-menu-renderer.ytd-watch-metadata ytd-toggle-button-renderer').forEach (ItemProcess);
			document.querySelectorAll ('like-button-view-model > toggle-button-view-model').forEach (q => {
				let w = selector (q, 'data', 'defaultButtonViewModel', 'buttonViewModel', 'accessibilityText');
				if (w === undefined)
					return;
				w = conv_exact (w.replace (/[^\d]/g, '') || '0');
				q.querySelectorAll ('div.yt-spec-button-shape-next__button-text-content').forEach (e => {
					if (e.innerText !== w)
						e.innerText = w;
					});
				});
			}, 1000);
		notifier.addEventListener ('ytfix-json-catch', ev => {
			const mut = selector (ev.detail.json, 'frameworkUpdates', 'entityBatchUpdate', 'mutations');
			if (mut === undefined)
				return;
			for (const m of mut) {
				const lt = selector (m, 'payload', 'likeCountEntity', 'likeButtonA11yText', 'content');
				if (lt === undefined)
					continue;
				document.querySelectorAll ('like-button-view-model > toggle-button-view-model').forEach (q => {
					const w = selector (q, 'data', 'defaultButtonViewModel', 'buttonViewModel');
					if (w !== undefined)
						w.accessibilityText = lt;
					});
				break;
				}
			});
		}
	if (settings.hide_engagement_panel_transcript)
		styles += 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-transcript"] { display: none !important; }';
	if (settings.hide_engagement_panel_structured_description) {
		styles += 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"] { display: none !important; }';
		const refs = [];
		setInterval (function () {
			document.querySelectorAll ('ytd-video-secondary-info-renderer tp-yt-paper-button#more').forEach (function (q) {
				for (const w of refs)
					if (w === q)
						return;
				refs.push (q);
				q.addEventListener ('click', function (ev) {
					let el = ev.target;
					while (el && el.tagName !== 'YTD-EXPANDER')
						el = el.parentNode;
					if (el)
						el.removeAttribute ('collapsed');
					});
				});
			}, 1000);
		}
	if (settings.short_to_full2 === 2) {
		let ld = await storage.load ('from_url');
		function process () {
			if (location.pathname.length !== 19 || !location.pathname.startsWith ('/shorts/'))
				return;
			const h = unwrap (window).history;
			const state = h.state;
			const videoId = location.pathname.substr (8);
			const url = '/watch?v=' + videoId;
			try {
				state.endpoint.commandMetadata.webCommandMetadata.url = url;
				state.endpoint.commandMetadata.webCommandMetadata.webPageType = 'WEB_PAGE_TYPE_WATCH';
				state.endpoint.watchEndpoint = { nofollow: true, videoId: videoId };
				delete state.endpoint.reelWatchEndpoint;
				}
			catch (ex) { }
			h.replaceState (state, '', url);
			storage.save ('from_url', location.pathname);
			unwrap (window).dispatchEvent (new PopStateEvent ('popstate', { state: state }));
			};
		if (location.pathname !== ld)
			process ();
		notifier.addEventListener ('ytfix-urlchange', process);
		}
	if (settings.short_to_full2 === 1) {
		let ld = await storage.load ('from_url');
		setInterval (function () {
			if (location.pathname === ld)
				return;
			if (ld)
				storage.save ('from_url', ld = undefined);
			if (location.pathname.length !== 19 || !location.pathname.startsWith ('/shorts/'))
				return;
			storage.save ('from_url', location.pathname);
			location.replace ('/watch?v=' + location.pathname.substr (8));
			}, 1000);
		}
	if (settings.hide_metadata)
		styles += 'ytd-metadata-row-container-renderer {display:none!important}';
	if (settings.video_shelves)
		styles += "body[ytfix-url='/watch'] ytd-reel-shelf-renderer {display:none!important}";
	if (settings.no_player_round_corners)
		styles += 'ytd-watch-flexy #ytd-player.ytd-watch-flexy{border-radius:0!important}';
	if (settings.channel_top)
		styles += `
			app-header#header.style-scope.ytd-c4-tabbed-header-renderer,tp-yt-app-header#header.style-scope.ytd-c4-tabbed-header-renderer,#page-header-banner.style-scope.ytd-tabbed-page-header{transform:none!important;position:absolute;left:0px!important;top:0px;margin-top:0px}
			`;
	if (settings.channel_top > 1)
		styles += `
			div#contentContainer.style-scope.app-header-layout{padding-top:148px!important}
			div#contentContainer.style-scope.app-header{height:148px!important}
			div.banner-visible-area.style-scope.ytd-c4-tabbed-header-renderer,div.page-header-banner.style-scope.ytd-c4-tabbed-header-renderer,#page-header-banner.style-scope.ytd-tabbed-page-header{display:none!important}
			tp-yt-app-header#header.ytd-tabbed-page-header{transform:none!important;position:absolute!important;left:0px!important;margin-top:0px!important}
			`;
	if (settings.thumbnail_size_channel)
		styles += `
			body[ytfix-url^='/c/'] div#contents.ytd-rich-grid-renderer {display:block!important}
			body[ytfix-url^='/c/'] ytd-rich-grid-row.ytd-rich-grid-renderer {display:inline!important}
			body[ytfix-url^='/c/'] ytd-rich-grid-row.ytd-rich-grid-renderer > div {display:inline!important;margin:0!important}
			body[ytfix-url^='/c/'] ytd-rich-item-renderer:not(.YT-HWV-WATCHED-HIDDEN):not(.YT-HWV-SHORTS-HIDDEN) {display:inline-block!important;width:${[0, 180, 240, 360, 480, settings.thumbnail_size_channel_m] [settings.thumbnail_size_channel]}px!important;contain:none!important;margin-left:calc(var(--ytd-rich-grid-item-margin)/2)!important;margin-right:calc(var(--ytd-rich-grid-item-margin)/2)!important}
			`;
	if (settings.channel_default) {
		// default, VIDEOS, SHORTS, LIVE, PLAYLISTS, COMMUNITY, CHANNELS, ABOUT
		const e_url = [undefined, '/videos', '/shorts', '/streams', '/playlists', '/community', '/channels', '/about'] [settings.channel_default];
		function PauseVideo () {
			document.querySelectorAll ('video').forEach (x => {
				x = unwrap (x);
				x.parentNode.removeChild (x);
				});
			}
		function process () {
			if (!/^\/c\/[^\/]+(\/(featured)?)?$/.test (unwrap (document.body).getAttribute ('ytfix-url')))
				return;
			try {
				let ar = selector (unwrap (document.querySelectorAll ('ytd-app') [0]), '__data', 'data', 'response', 'contents', 'twoColumnBrowseResultsRenderer', 'tabs');
				if (ar === undefined)
					return setTimeout (process, 100);
				for (const i of ar) {
					const ep = selector (i, 'tabRenderer', 'endpoint');
					if (ep !== undefined && ep.commandMetadata.webCommandMetadata.url.endsWith (e_url)) {
						const state = { endpoint: ep, savedComponentState: { }, entryTime: 1 };
						unsafeWindow.history.replaceState (state, '', ep.commandMetadata.webCommandMetadata.url);
						unsafeWindow.dispatchEvent (new PopStateEvent ('popstate', { state: state }));
						setTimeout (PauseVideo, 100);
						return;
						}
					}
				}
			catch (ex) {
				console.error (ex);
				setTimeout (process, 100);
				}
			};
		notifier.notify (process);
		}
	if (settings.subscriptions_align)
		styles += `body[ytfix-url='/feed/subscriptions'] div#contents {text-align:${['','left','center','right'][settings.subscriptions_align]}}`;
	const script_name = selector (gminfo, 'script', 'name');
	if (fix_version && load_version && storage.save && settings.update_alert && script_name) {
		const m_fix = fix_version.match (/^(\d+)\.(\d+)\.(\d+)(?!\d)/);
		const m_load = load_version.match (/^(\d+)\.(\d+)\.(\d+)(?!\d)/);
		if (m_fix && m_load) {
			if (m_fix [1] != m_load [1]) {
				storage.save ('settings', settings);
				alert (`Script "${script_name}" updated major version.\nView settings page to check if all options were transferred correctly.\n\nTo disable this alert go to 'Script' tab on settings page.`);
				}
			else if (settings.update_alert >= 2 && m_fix [2] != m_load [2]) {
				storage.save ('settings', settings);
				alert (`Script "${script_name}" updated version.\nCheck settings page for new options.\n\nTo disable this alert go to 'Script' tab on settings page.`);
				}
			else if (settings.update_alert == 3 && m_fix [3] != m_load [3]) {
				storage.save ('settings', settings);
				alert (`Script "${script_name}" released bugfix.\n\nTo disable this alert go to 'Script' tab on settings page.`);
				}
			}
		}
	// "settings" button
	// can't store created button: Polymer overrides it's content on soft reload leaving tags in place
	// but can store element that Polymer does not know how to deal with and just drops
	let settingsMark = { parentNode: false };
	setInterval (function () {
		if (settingsMark.parentNode)
			return;
		let toolBar = document.getElementsByTagName ('ytd-topbar-menu-button-renderer');
		if (!toolBar.length)
			return;
		toolBar = toolBar [0];
		if (!toolBar)
			return;
		toolBar = toolBar.parentNode;
		const sb = document.createElement ('ytd-topbar-menu-button-renderer');	// ytd-notification-topbar-button-renderer
		sb.className = 'style-scope ytd-masthead style-default';				// style-scope ytd-masthead notification-button-style-type-default
		sb.setAttribute ('use-keyboard-focused', '');
		sb.setAttribute ('is-icon-button', '');
		sb.setAttribute ('has-no-text', '');
		const tbo = unwrap (toolBar);
		const sbo = unwrap (sb);
		tbo.insertBefore (sbo, tbo.childNodes [0]);
		// div[id=notification-count][class=style-scope ytd-notification-topbar-button-renderer][innerHTML=...]
		const mark = document.createElement ('fix-settings-mark');
		mark.style = 'display:none';
		toolBar.insertBefore (mark, sb); // must be added to parent node of buttons in order to Polymer dropped it on soft reload
		settingsMark = mark;
		const icb = document.createElement ('yt-icon-button');
		icb.id = 'button';
		icb.className = 'style-scope ytd-topbar-menu-button-renderer style-default';
		const tt = document.createElement ('tp-yt-paper-tooltip');
		tt.className = 'style-scope ytd-topbar-menu-button-renderer';
		tt.setAttribute ('role', 'tooltip');
		tt.setAttribute ('tabindex', '-1');
		tt.style = 'right:auto;bottom:auto';
		tt.appendChild (document.createTextNode ('YT fixes ' + fix_version));	// YT wraps content into DIV element
		const aa = document.createElement ('a');
		aa.className = 'yt-simple-endpoint style-scope ytd-topbar-menu-button-renderer';
		aa.setAttribute ('tabindex', '-1');
		aa.href = '/fix-settings';
		aa.appendChild (icb);
		aa.appendChild (tt);
		sbo.getElementsByTagName ('div') [0].appendChild (unwrap (aa)); // created by YT scripts
		const bb = icb.getElementsByTagName ('button') [0]; // created by YT scripts
		bb.setAttribute ('aria-label', 'fixes settings');
		const ic = document.createElement ('yt-icon');
		ic.className = 'style-scope ytd-topbar-menu-button-renderer';
		bb.appendChild (ic);
		const gpath = document.createElementNS ('http://www.w3.org/2000/svg', 'path');
		gpath.className.baseVal = 'style-scope yt-icon';
		gpath.setAttribute ('d', 'M1 20l6-6h2l11-11v-1l2-1 1 1-1 2h-1l-11 11v2l-6 6h-1l-2-2zM2 20v1l1 1h1l5-5v-2h-2zM13 15l2-2 8 8v1l-1 1h-1zM15 14l-1 1 7 7h1v-1zM9 11l2-2-2-2 1.5-3-3-3h-2l3 3-1.5 3-3 1.5-3-3v2l3 3 3-1.5zM9 10l-2-2 1-1 2 2z');
		const svgg = document.createElementNS ('http://www.w3.org/2000/svg', 'g');
		svgg.className.baseVal = 'style-scope yt-icon';
		svgg.appendChild (gpath);
		const svg = document.createElementNS ('http://www.w3.org/2000/svg', 'svg');
		svg.className.baseVal = 'style-scope yt-icon';
		svg.setAttributeNS (null, 'viewBox', '0 0 24 24');
		svg.setAttributeNS (null, 'preserveAspectRatio', 'xMidYMid meet');
		svg.setAttribute ('focusable', 'false');
		svg.setAttribute ('style', 'pointer-events: none; display: block; width: 100%; height: 100%;');
		svg.appendChild (svgg);
		(ic.shadowRoot || ic).appendChild (svg); // YT clears *ic
		}, 1000);
	// styles
	if (styles.length) {
		let styles_int = setInterval (function () {
			if (!document.head)
				return;
			clearInterval (styles_int);
			if (document.getElementById ('ytfixstyle'))
				return;
			const style_element = document.createElement ('style');
			style_element.setAttribute ('type', 'text/css');
			style_element.setAttribute ('id', 'ytfixstyle');
			style_element.innerHTML = styles;
			document.head.appendChild (style_element);
			}, 100);
		}
	console.log ('Fixes loaded');
	}) ();
