// ==UserScript==
// @name         DuoTweak for Incubator
// @namespace    duolingo
// @description  Add-on for Duolingo Incubator | DO NOT SHARE! ONLY FOR DUOLINGO CONTRIBUTORS! | (c) Lifeshade aka HeadwayCourse, 2017
// @author       Lifeshade aka HeadwayCourse, 2017
// @version      1.4.0
// @include      https://incubator.duolingo.com/*
// @noframes
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/35556/DuoTweak%20for%20Incubator.user.js
// @updateURL https://update.greasyfork.org/scripts/35556/DuoTweak%20for%20Incubator.meta.js
// ==/UserScript==

DuoTweak = {
	HOME_LINK: "/courses/en/ru/wiki/DuoTweak",
	VERSION: "1.4.0",
	VERSION_CHECK_LINK: "https://raw.githubusercontent.com/Lifeshade/duolingo/master/DTi/version",
	
	CSS: {rows: [
		// logo
		"#dt-duotweak_logo {position: absolute; margin: 55px 0 0 -15px; font-size: 14px; font-weight: bold; font-style: italic;}",
		"#dt-duotweak_logo-update {color: red; font-size: 12px;}",
		// loading circle
		".dt-loading {display: inline-block; width: 16px; height: 16px; background-color: rgba(0, 0, 0, 0); animation: 1s linear 0s normal none infinite running loading;" + 
			"border-width: 3px; border-style: solid; border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #0080FF #0080FF; border-radius: 100px;}",
		// errors section
		".dt-details-error {margin-top: 15px; padding: 0; border-radius: 8px; background-color: #FFC0C0; font-size: 65%; font-weight: normal;}",
		".dt-details-error-item {margin: 0; padding: 5px 20px;}",
		// tree/skill stats
		".dt-tree_header {display: flex; justify-content: space-between;}",
		".dt-tree_stats {font-size: 16px; font-weight: normal; font-family: 'Courier New';}",
		".dt-tree_stats-count {display: none; border: none; padding: 0 4px; background-color: #E0F0FF; color: #0080FF;}",
		".node-stats div {margin: 0 6px !important;}",
		".dt-skill-has_no_notes {display: inline; padding-left: 20px; width: 20px; height: 18px; background: url('/images/incubator-sprite.svg') -167px -22px no-repeat; background-size: 800px auto;}",
		".dt-words_using-row {display: flex; margin-bottom: 10px;}",
		".dt-words_using-input {width: 50%; border: 1px solid black; border-radius: 5px;}",
		".dt-words_using-stat {width: 50%; padding-left: 10px; white-space: nowrap; font-size: 16px; cursor: pointer;}",
		".dt-words_using-stat:hover {text-decoration: underline;}",
		".dt-words_using-calc {border: 1px solid blue; background-color: lightblue; border-radius: 100px; padding: 0 30px; margin-bottom: 20px;}",
		".dt-words_using-calc:hover {background-color: #80D0E0;}",
		// extract sentences
		".dt-extract_sentences {border: 1px solid gray; border-radius: 100px; padding: 0 8px; background-color: white; font-size: 80%; color: black;}",
		".dt-extract_sentences:hover {background-color: lightgray;}",
		".dt-extract_sentences:disabled {border-color: green;}",
		".dt-extract_sentences:disabled:hover {background-color: white;}",
		".dt-extracted_sentences {position: fixed; z-index: 10; border: 1px solid black; box-shadow: 10px 10px 8px gray; background-color: white;}",
		".dt-extracted_sentences-links {height: 100%; padding: 5px 20px; overflow-y: scroll;}",
		".dt-extracted_sentences-close {position: absolute; right: 20px; top: 5px; width: 22px; line-height: 16px; padding: 3px; text-align: center; color: black; font-size: 18px; font-weight: bold; cursor: pointer;}",
		".dt-extracted_sentences-close:hover {color: red;}",
		// dropout chart
		"#dt-chart {position: relative; cursor: pointer;}",
		"#dt-chart-fixed {position: absolute; right: 0; top: 0;}",
		"#dt-chart-main {position: relative; overflow-x: auto; overflow-y: hidden; background-color: white;}",
		"#dt-chart-back, #dt-chart-front {position: absolute; top: 0;}",
		".dt-chart-save {border: 1px solid green; border-radius: 4px; padding: 0 8px; background-color: #E0FFE0; font-size: 14px; color: green;}",
		".dt-chart-save:hover:not(:disabled) {background-color: #C0FFC0;}",
		".dt-chart-save:disabled {border-color: gray; background-color: #F0F0F0; color: gray;}",
		// search
		".dt-search_results {max-height: 600px; overflow-y: auto;}",
		// reports rating
		".dt-reports_rating-total_reports {margin: 10px; font-size: 70%; font-weight: normal;}",
		".dt-reports_rating-checkpoint {margin: 1px 6px; width: 30%; border: 1px solid gray; border-radius: 4px; padding: 2px; background-image: linear-gradient(0deg, gray, lightgray, white); font-weight: normal; font-size: 14px; text-align: center; cursor: pointer;}",
		".dt-reports_rating-checkpoint.dt-st-active {border-color: #FFAE00; background-image: linear-gradient(0deg, #FFFFA0, #FFAE00);}",
		".dt-reports_rating-checkpoint-mark {display: none;}",
		".dt-reports_rating-checkpoint.dt-st-active .dt-reports_rating-checkpoint-mark {display: inline;}",
		".dt-reports_rating-checkpoint:hover {color: #0000FF;}",
		".dt-reports_rating-run {margin: 10px; border: 2px solid green; border-radius: 100px; padding: 2px 20px; background-color: white; color: green; font-size: 80%}",
		".dt-reports_rating-run:hover {background-color: #D0FFD0;}",
		".dt-reports_rating-run:disabled {border-color: gray; color: gray;}",
		".dt-reports_rating-run:disabled:hover {background-color: white;}",
		".dt-reports_rating-progress-bg {display: none; width: 100%; height: 10px; border-radius: 100px; background-image: linear-gradient(120deg, #FFA0A0, #FFE0E0);}",
		".dt-reports_rating-progress-scale {width: 100%; height: 10px; border-radius: 100px;}",
		".dt-reports_rating-loading_info {text-align: right; font-size: 85%; font-weight: bold;}",
		".dt-reports_rating-table {width: 100%; border-collapse: collapse;}",
		".dt-reports_rating-table th, .dt-reports_rating-table td {border: 1px solid gray; padding: 2px; text-align: center;}",
		".dt-reports_rating-table th {font-size: 80%; font-weight: normal;}",
		".dt-reports_rating-table td:nth-child(2) {text-align: left; padding-left: 6px;}",
		".dt-reports_rating-table-can_order:hover {text-decoration: underline; cursor: pointer;}",
		// sentences/localization editor
		".editor .content .categories {width: 20%; font-size: smaller;}",
		".editor .content .list {width: 30%; font-size: smaller;}",
		".editor .content .item {width: 50%;}",
		// editor sentence list
		".dt-sentence-checked {color: red; text-decoration: line-through;}",
		".dt-sentence-checked .check {background-position: -178px -28px !important;}",
		".done.dt-sentence-checked .check {background-position: -148px -28px !important;}",
		".dt-sentence-removeall {padding: 5px 0; text-align: center; font-size: 12px;}",
		".dt-sentence-removeall-btn {border: 1px solid red; border-radius: 100px; padding: 0px 20px; background-color: white; color: red; font-size: 16px;}",
		".dt-sentence-removeall-btn:hover {background-color: #FFE0E0;}",
		// section of the sentence
		".notes-entry {font-style: italic;}",
		"#forward .sub-header, #reverse .sub-header {background: linear-gradient(90deg, #ffff80, #ffffe0); border: 1px dashed lightgray; cursor: pointer;}",
		".dt-reports_num {display: inline-table; border-radius: 100px; padding: 0 2px; min-width: 22px; line-height: 22px; background-color: #D51C1B; text-align: center; font-size: 15px; font-weight: bold; color: white;}",
		".translations-container .sub-sub-header {clear: both; line-height: 1.8 !important;}",
		".debug-input {border: 1px inset #00AEFF !important;}",
		".debug-input.accepted {background-color: #C0FFC0 !important;}",
		".debug-input.rejected {background-color: #FFC0C0 !important;}",
		".sentence-details-container .report-row {margin: 2px 0; padding: 8px 10px !important; border-radius: 6px; font-size: smaller !important;}",
		".sentence-details-container .report-row:hover {text-shadow: 1px 1px 0 gray;}",
		".sentence-details-container .report-sub-row {font-size: smaller;}",
		".dt-clear_reports {border: 1px solid red; border-radius: 100px; padding: 0px 10px; background-color: white; color: red;}",
		".dt-clear_reports:hover {background-color: #FFE0E0;}",
		".header .dt-sentence_header {display: block;}",
		".header:hover .dt-sentence_header {display: none;}",
		".dt-clear_allreports {display: none; border: 2px solid red; border-radius: 100px; padding: 0 40px; background-color: white; color: red;}",
		".dt-clear_allreports:hover {background-color: #FFE0E0;}",
		".header:hover .dt-clear_allreports {display: inline;}",
		// sentence history
		".dt-sentence_history-show {color: #8000ff !important; cursor: pointer;}",
		".dt-sentence_history-show:hover {text-decoration: underline;}",
		".dt-sentence_history {display: none; margin: 0 25px 10px 25px; padding: 5px 20px 10px 20px; border-radius: 8px; background-color: #F0F0F0; font-size: smaller;}",
		".dt-sentence_history-user {margin-top: 10px;}",
		".dt-sentence_history-user span {color: gray; font-size: smaller;}",
		".dt-sentence_history-added {color: #00A000;}",
		".dt-sentence_history-removed {color: #C00000;}",
		// localization
		"#ui-string-editor section .translation .input-container textarea {white-space: normal;}",
		"#ui-string-editor section .translation .input-container .highlights {display: none;}",
		"#ui-string-editor .edit-history {font-size: smaller;}",
		".dt-context_sample {padding-left: 30px; color: #FF4040; font-family: 'Times New Roman'; font-style: italic;}",
		"a:hover .dt-context_sample {color: white;}",
		".dt-unused_context {text-decoration: line-through;}",
		// workshop history
		".history-type-picker, .history-contributor-picker {cursor: pointer;}",
		".dt-hidden_contributor-avatar {color: red;}",
		".contribution-history-table .truncate {max-height: none !important; font-size: 85%;}",
		// small fixes
		".tree-status {font-size: 12px; margin-top: 0 !important;}",
		"#sentence-leaderboard th {font-size: 70%; padding: 8px 3px;}",
		"#sentence-leaderboard td {padding: 8px 3px;}",
		"#concept-notes {max-height: 400px;}",
		".wiki .add-page {font-size: 80%;}",
	]},
	
	Locale: {
		TOP_REPORTS: {en: "Top%1 reports"},
		TOTAL_REPORTS: {en: "Total number of reports: <b>%1</b>"},
		LOAD_DATA: {en: "Load data from %1 skills"},
		LOADING: {en: "Loading... %1%"},
		SENTENCE: {en: "sentence"},
		REPORTS: {en: "reports"},
		FAILURE_PERCANTAGE: {en: "failure %"},
		SKILL_HAS_NO_NOTES: {en: "The skill has no notes"},
		EXTRACT_SENTENCES: {en: "Extract sentences"},
		EXTRACTING: {en: "Extracting... %1%"},
		DONE: {en: "Done (%1)"},
		REJECT_ALL: {en: "Reject all"},
		CLEAR_ALL: {en: "Clear all"},
		CLEAR_ALL_REPORTS: {en: "Clear all %1 reports"},
		ARE_YOU_SURE: {en: "Are you sure?"},
		CHECKPOINT: {en: "Checkpoint %1"},
		NO_SKILLS: {en: "There're no skills to load data"},
		SENTENCES_LOADED: {en: "%1 sentences have been loaded"},
		NOT_CONTRIBUTOR: {en: "You are not a contributor of this course."},
		GENERAL_STATS_TITLE: {en: "skills / lessons / words / sentences"},
		COUNT: {en: "count"},
		RECOUNT: {en: "recount"},
		CALC_WORDS_USING: {en: 'Calculate'},
		SENTENCES_IN_SKILLS: {en: '%1 sentences in %2 skills'},
	},
	
	Storage: {
		store: function (key, value) {
			if (window.localStorage !== undefined) {
				localStorage["dti." + key] = value && typeof value == 'object' ? JSON.stringify(value) : value; // null тоже имеет тип object
				return true;
			}
			return false;
		},
		load: function (key, default_value) {
			if (window.localStorage !== undefined) {
				key = "dti." + key;
				if (localStorage[key] !== undefined) {
					try {
						return $.parseJSON(localStorage[key]);
					} catch (ex) {
						return localStorage[key] === undefined ? default_value : localStorage[key];
					}
				}
			}
			return default_value;
		},
	},
	
	User: {
		id: 0,
		name: "",
		is_contributor: true,
	},
	
	Course: {
		base_lang: null,
		learning_lang: null,
		trees_ver: {}, // {"tree_id": #version, ...}
		contributors: {}, // {id: {username: "", avatar: ""},...}
		EX_CONTRIBUTORS: {
			en_ru: { // 07.05.2017
				 16781025: "abakanovo",
				 23114425: "AllyPitts",
				  8285067: "arik.chikv",
				    14783: "autayeu",
				     2127: "aygul",
				 33052299: "candlelight2007",
				 26432539: "El_Coronel_SK",
				  3602802: "Gorilla800lbs",
				  1719995: 'HartzHandia',
				 45466252: "Levape",
				 15494094: "markheev",
				  9791262: 'rkuprov',
				 35836694: 'RomanRussian',
				  6645732: "S.P.Abrams",
				  4151692: "tom_moff",
			},
			de_ru: { // 11.04.2016
				     2127: "aygul",
				 20282918: "Charline-MT",
				 55348351: "ElinaIosch",
				  8352411: "MarinaLif",
				  5271239: "ViArSkoldpaddor",
			},
		},
		changeTree: function () {
			DuoTweak.Tree.id = $(".tree-tabs li.active", "#tree-view").data("tree");
		},
		loadContributors: function () {
			$.ajax({
				type: "GET",
				url: "/api/1/users/course_contributors?learning_language_id=" + DuoTweak.Course.learning_lang + "&from_language_id=" + DuoTweak.Course.base_lang
			});
		},
		showExContributorsInHistory: function () { // todo в отдельный объект
			var contr_menu = $("#contributor .dropdown-menu");
			if (contr_menu.length) {
				var course = DuoTweak.Course.learning_lang + "_" + DuoTweak.Course.base_lang;
				if (DuoTweak.Course.EX_CONTRIBUTORS[course]) {
					var sort_by_name = [];
					for (var id in DuoTweak.Course.EX_CONTRIBUTORS[course]) {
						sort_by_name.push({id: id, name: DuoTweak.Course.EX_CONTRIBUTORS[course][id]});
					}
					sort_by_name.sort(function (a, b) {
						return a.name.toLowerCase() > b.name.toLowerCase();
					});
					for (var i = 0; i < sort_by_name.length; i++) {
						contr_menu.append('<li class="history-contributor-picker" data-name="' + sort_by_name[i].name + '" data-id="' + sort_by_name[i].id + '"><a title="Ex contributor"><span class="dt-hidden_contributor-avatar">ex</span> ' + sort_by_name[i].name + '</a></li>');
					}
				}
			}
		},
	},
	
	Tree: {
		id: '',
		insertGeneralStats: function () {
			if (!$(".dt-tree_stats").length) {
				var skills_data = DuoTweak.Skills.data[DuoTweak.Tree.id];
				var lessons_num = 0;
				var words_num = 0;
				for (var skill_id in skills_data) {
					lessons_num += skills_data[skill_id].lessons_num;
					words_num += skills_data[skill_id].lexemes.length;
				}
				var sent_num__data = DuoTweak.Storage.load("sentences", "{}");
				var sent_num = sent_num__data[DuoTweak.Course.learning_lang + "/" + DuoTweak.Course.base_lang + "/" + DuoTweak.Course.trees_ver[DuoTweak.Tree.id]];
				$(".header", "#tree-tab-panel").append(
					'<div class="dt-tree_header">' + 
						'<div class="dt-tree_stats" title="' + DuoTweak.getLocale(DuoTweak.Locale.GENERAL_STATS_TITLE) + '">' +
							Object.keys(skills_data).length + ' / ' + lessons_num + ' / ' + words_num + ' / ' + 
							'<span class="dt-tree_stats-sentences dt-st-active">' + (sent_num ? "~" + sent_num : "?") + '</span>' + 
							'<button class="dt-tree_stats-count">' + DuoTweak.getLocale(sent_num ? DuoTweak.Locale.RECOUNT : DuoTweak.Locale.COUNT) + '</button>' + 
							'<span class="dt-loading" style="display: none;"></span>' + 
						'</div>' + 
						'<button class="dt-chart-save" disabled="disabled">Save graph</button>' + 
					'</div>'
				);
			}
		},
		updateGeneralStats: function () {
			$.ajax({
				type:"GET",
				url: "/api/2/sentences?tree_id=" + DuoTweak.Tree.id + "&type=sentences&query= &target_language_id=" + DuoTweak.Course.learning_lang,
			}).done(function (data) {
				var sent_num = 0;
				for (var i = 0; i < data.length; i++) {
					if (data[i].translated) {
						sent_num++;
					}
				}
				$(".dt-loading", ".dt-tree_stats").hide();
				$(".dt-tree_stats-sentences").text(sent_num).show();
				var sent_num__data = DuoTweak.Storage.load("sentences", "{}");
				sent_num__data[DuoTweak.Course.learning_lang + "/" + DuoTweak.Course.base_lang + "/" + DuoTweak.Course.trees_ver[DuoTweak.Tree.id]] = sent_num;
				if (DuoTweak.User.is_contributor) {
					DuoTweak.Storage.store("sentences", sent_num__data); // {"lang1/lang2/version": 0, ...}
				}
			}).fail(function () {
				$(".dt-loading", ".dt-tree_stats").hide();
				$(".dt-tree_stats-sentences").text(":(").show();
			});
		},
		insertWordsUsingForm: function () {
			$('#word-sentence-counts .header').after(
				'<div class="dt-words_using-row"><input type="text" class="dt-words_using-input"/><div class="dt-words_using-stat"></div></div>',
				'<div class="dt-words_using-row"><input type="text" class="dt-words_using-input"/><div class="dt-words_using-stat"></div></div>',
				'<div class="dt-words_using-row"><input type="text" class="dt-words_using-input"/><div class="dt-words_using-stat"></div></div>',
				'<div class="dt-words_using-row"><input type="text" class="dt-words_using-input"/><div class="dt-words_using-stat"></div></div>',
				'<div class="dt-words_using-row"><input type="text" class="dt-words_using-input"/><div class="dt-words_using-stat"></div></div>',
				'<button class="dt-words_using-calc">' + DuoTweak.getLocale(DuoTweak.Locale.CALC_WORDS_USING) + '</button>'
			);
		},
		calcWordsUsing: function () {
			$('.dt-words_using-stat').data('sent-list', '[empty]');
			$('.dt-words_using-stat').text('');
			$('.dt-words_using-input').each(function (index, elem) {
				var val = $(elem).val();
				var regexp = new RegExp('(^|[^\\w])' + val + '([^\\w]|$)', 'i');
				if (val) {
					$.ajax({
						type: "GET",
						url: '/api/2/sentences',
						data: {query: val, target_language_id: DuoTweak.Course.learning_lang, tree_id: DuoTweak.Tree.id, type: 'sentences'},
					}).done(function (data) {
						var sentences = [];
						var skills = {};
						for (var i = 0; i < data.length; i++) {
							// из-за регулярки не пройдут запросы, которые на границах имеют знаки препинания, примыкающие к буквам (например, ', two', 'ninety-' или "'ve")
							if (!data[i].disabled && regexp.test(data[i].text)) {
								sentences.push(data[i].text);
								skills[data[i].node_id] = 1;
							}
						}
						$('.dt-words_using-stat').eq(index).data('sent-list', sentences.join('\n'));
						$('.dt-words_using-stat').eq(index).text(DuoTweak.getLocale(DuoTweak.Locale.SENTENCES_IN_SKILLS, sentences.length, Object.keys(skills).length));
					}).fail(function () {
						$('.dt-words_using-stat').eq(index).text('error!');
					});
				}
			});
		},
		fixReportsNum: function () {
			// todo $("#tree-tab-panel .bonus-skills-container .skill-node")
			$("#tree-tab-panel .skill-node").each(function () {
				var skill_id = $(this).data("id");
				if (DuoTweak.Skills.get(skill_id)) {
					var reports_num = DuoTweak.Skills.get(skill_id).reports_num;
					if (reports_num > 5000) {
						$(".report-count-string", this).text(reports_num);
					}
				}
			});
		},
		markSkillsWithoutNotes: function () {
			for (var skill_id in DuoTweak.Skills.data[DuoTweak.Tree.id]) {
				if (!DuoTweak.Skills.get(skill_id).has_notes) {
					$("#node-" + skill_id + " .node-stats").append('<div class="dt-skill-has_no_notes" title="' + DuoTweak.getLocale(DuoTweak.Locale.SKILL_HAS_NO_NOTES) + '"></div>');
				}
			}
		},
		addSentExtractButton: function () {
			$("#tree-view .skill-node").each(function () {
				if (DuoTweak.Skills.get($(this).data("id"))) {
					$(".node-stats", this).before('<div><button type="button" class="dt-extract_sentences">' + DuoTweak.getLocale(DuoTweak.Locale.EXTRACT_SENTENCES) + '</button></div>');
				}
			});
		},
		startSentExtracting: function (skill_id) {
			var PROGRESS_CSS = { // %1 - progress percentage
				param: "background-image",
				value: "linear-gradient(90deg, #80E080, #80E080 %1%, transparent %1%, transparent)",
			};
			var extract_button = $("#node-" + skill_id + " .dt-extract_sentences").attr({disabled: true}).text(DuoTweak.getLocale(DuoTweak.Locale.EXTRACTING, 0));
			var result_modal = $(".dt-extracted_sentences");
			if (!result_modal.length) {
				//result_modal = $('<div class="dt-extracted_sentences"><div class="dt-extracted_sentences-close">&#10006;</div><textarea readonly="readonly"></textarea></div>');
				result_modal = $('<div class="dt-extracted_sentences"><div class="dt-extracted_sentences-close">&#10006;</div><div class="dt-extracted_sentences-links"></div></div>');
			}
			result_modal.hide();
			var sentences = {}; // {'lexeme_id/sentence_id': 'text',...},
			var extractSentences = function (lexeme_index) {
				if (lexeme_index < DuoTweak.Skills.get(skill_id).lexemes.length) {
					var lexeme_id = DuoTweak.Skills.get(skill_id).lexemes[lexeme_index];
					if (Object.keys(sentences).length != 0) {
						sentences[lexeme_id] = "";
					}
					$.ajax({
						type: "GET",
						url: "/api/1/nodes/" + skill_id + "/lexeme?lexeme_id=" + lexeme_id,
					}).done(function (data) {
						for (var i = 0; i < data.sentences.length; i++) {
							if (data.sentences[i].done) {
								sentences[lexeme_id + '/' + data.sentences[i].id] = data.sentences[i].text;
							}
						}
					}).fail(function (xhr, status) {
						console.log("extracting error " + skill_id + " " + lexeme_index);
					}).always(function (data, status) {
						var progress = (lexeme_index + 1) / DuoTweak.Skills.get(skill_id).lexemes.length * 100;
						extract_button
							.css(PROGRESS_CSS.param, PROGRESS_CSS.value.replace(/%1/g, progress))
							.text(DuoTweak.getLocale(DuoTweak.Locale.EXTRACTING, Math.round(progress)))
						;
						extractSentences(++lexeme_index);
					});
				} else {
					extract_button.text(DuoTweak.getLocale(DuoTweak.Locale.DONE, Object.keys(sentences).length));
					var LINK_TEMPLATE = '<div><a href="/courses/' + DuoTweak.Course.learning_lang + '/' + DuoTweak.Course.base_lang + '/editor/' + skill_id + '/%1">%2</a></div>';
					var links = '';
					for (var path in sentences) {
						links += sentences[path] ? LINK_TEMPLATE.replace('%1', path).replace('%2', sentences[path]) : '<hr/>';
					}
					$(".dt-extracted_sentences-links", result_modal).html(links);
					result_modal.css({
						left: ($("#side-panel").offset().left + 10) + "px",
						right: "100px",
						top: ($(".navbar").height() + 50) + "px",
						bottom: "100px",
					}).appendTo("#app").show();
				}
			};
			extractSentences(0);
		},
	},
	
	Skills: { // на все деревья сразу
		data: {}, // {"tree_id": {"skill_id": {title: "", short_title: "", lexemes: ["lexeme_id", ...], lessons_num: 0, has_notes: false, reports_num: 0, max_dropout: 0}, ...}, ...}
		get: function (skill_id) {
			return DuoTweak.Skills.data[DuoTweak.Tree.id][skill_id];
		},
	},
	
	Chart: {
		params: {
			PREVIEW_HEIGHT: 200,
			HEIGHT: 400,
			WIDTH_MULT: 4,
			PADDING: 20,
			AXIS_CAPTION_WIDTH: 20, // width of the axis caption zone
			POINT_SIZE: 3,
			x0: 0,
			y0: 0,
			dx: 0,
			dy: 0,
		},
		is_preview: true,
		data: {
			full: {}, // {"skill_id": [#dropout, ...], ...}
			full_old: {}, // {"skill_id": [#dropout, ...], ...}  сохраненные данные
			preview: {}, // {"skill_id": [#dropout, ...], ...}
		},
		max_dropout: 0,
		is_loading: false,
		
		init: function () {
			DuoTweak.Chart.data.full = {};
			var sample_data = DuoTweak.Course.learning_lang == 'en' && DuoTweak.Course.base_lang == 'ru' ? {
				"0846b3cc71cc221cdecd14bb36525e0d":[0.2101,0.1353,0.22649999999999998],"0b016af7abb50282ab5f771d2e5d33b3":[0.0758,0.0478,0.0696],"48ff2cdc9cc2b57721e00ff59d0c7ef1":[0.0368,0.0347,0.0663],"6d8878f941f2c5a4985734cb7bce4a7f":[0.0484,0.0336,0.0315,0.045700000000000005],"4582b0d078ea7ca944b3553d36695def":[0.038,0.0418],"541b79ea9a6b35f60915b55573d5929d":[0.0325,0.049800000000000004],"966dce455bc64530888cfc8b5256a758":[0.0726,0.0451],"9e531788b2ddad92984dbe80ed586b59":[0.0768],"7d3f8786ff3ee6c35e0e5f4e67a344d3":[0.060700000000000004,0.058600000000000006],"87cda0674f8d21e4a38e79667720271b":[0.0397,0.0253,0.0349,0.0268,0.0301,0.0197,0.039900000000000005],"9cb1259a61bfab3f21fdc7a63780146d":[0.0527,0.051],"daac89ec3897a4f96ac35ab573597f0c":[0.0173,0.046],"3647f63f600975a21699606faab21101":[0.0541],"c2ec746f568af15d462851757db8a754":[0.0592,0.046,0.0528,0.0451],"e45afb8e519fb2ce844d8a07ac25d0b8":[0.0347,0.019799999999999998,0.0231,0.0199,0.013600000000000001,0.013500000000000002,0.017,0.0352],"cc6716b7c1d00b1cf909b2703fcf22b0":[0.0308,0.0178,0.0305],"00dd9afa6dc42c9921dd3ba2c18e5c68":[0.0388,0.0259,0.022799999999999997,0.049699999999999994],"e3a8de42e4a36f666a8eccdc0cf52894":[0.0407,0.0365,0.027999999999999997,0.0385,0.037200000000000004,0.0209,0.025699999999999997,0.025099999999999997,0.042199999999999994],"e6cf83796a50ceb5cd400a5079fe88b6":[0.0407,0.0323,0.0337,0.018600000000000002,0.0252,0.022799999999999997,0.0425],"32c8a4cdae3bebdb42cd07c6582d97f5":[0.0363,0.0377,0.0384,0.0281,0.036699999999999997,0.0339,0.0315,0.032799999999999996],"7791649af0341a994be38b0448bb3714":[0.0305,0.0197,0.0227,0.021,0.0259,0.0346,0.0181,0.011699999999999999,0.021],"fc3ded3257485da0f428a5dcffb7a0f1":[0.0348,0.0183,0.030299999999999997,0.025,0.014499999999999999,0.012,0.0105,0.0168,0.0078000000000000005,0.0085],"5f08e6f759744c1f649b722e1cad6a80":[0.024399999999999998,0.0118,0.0279],"ff098bdbad55e68e182fc90c173ace26":[0.0271,0.02,0.0206,0.0294,0.011200000000000002,0.0042,0.0101],"d2fb977dbdc1ba5abb73892b18aff5d3":[0.026600000000000002,0.0173,0.0207,0.0373],"ab4d50a0f60b0a4abcd4ce56c4b2ab21":[0.0178,0.0147,0.0202,0.0137,0.0258,0.0144,0.038],"ff054cba11eda475f211ca7503cdc94f":[0.032400000000000005,0.0225,0.030899999999999997,0.0207,0.017,0.0302,0.0311,0.0172,0.0113,0.0319],"7d9dc9618f05775044790d9fc885973b":[0.0323,0.0141,0.013000000000000001,0.0116,0.0281],"ca4c54396be2f23299adfced3bad6f19":[0.057699999999999994,0.012,0.024900000000000002,0.0143,0.036000000000000004,0.022400000000000003,0.0194,0.0084,0.0138,0.0262],
				"4c99bff8404f0fedca0ff7532847f458":[0.0206,0.0223,0.0268,0.0123,0.0083,0.021400000000000002,0.0141,0.02,0.0265],"c4c783d090ce351377becf56948ed42f":[0.0403,0.013999999999999999,0.0168,0.0172,0.0434],"2d7f1caa7f553e23c0e4d0c1d875271a":[0.055,0.0143,0.0111,0.0275,0.017,0.011200000000000002,0.016,0.015700000000000002,0.009300000000000001,0.0255],"9ede4a96d6bf4e90b252892df3e05a1b":[0.0111,0.0111,0.0168,0.0109,0.014499999999999999,0.0078000000000000005,0.03],"42c54dd6381ecf12f0e273e6bdc6b2c9":[0.051100000000000007,0.0172,0.045899999999999996,0.0262,0.0098,0.03,0.015300000000000001,0.011899999999999999,0.0358],"53c4e6b26f8331657f869e95c017edbb":[0.0304,0.0236,0.0139,0.0073,0.0179,0.0317,0.0351,0.013999999999999999,0.0137],"c300324d3938cad2cd47b1b1a33a6e3f":[0.0341],"e1c1c061a241cdb9a0aa74e2b40d33e0":[0.0443,0.0434,0.0231,0.0407],"fe0c5f6348ed9ec5ea69bfeb70dd7735":[0.0407,0.0288,0.0425,0.018600000000000002,0.0166,0,0.0148,0.0181,0.0069,0.0271],"239e51d6ee3a94f622e54f027af11e97":[0.0298],"32b2bcf7cbfdd1562936c0a88bb1f5d6":[0.016,0.015600000000000001,0.019,0.005600000000000001,0,0.0087],"d6bf7a3bf87b786feb0a4faccf25d711":[0.049699999999999994,0.0274,0.0042,0,0.0246,0.0043,0.0462],"1e0a3d5121a4235da6365303718c02e0":[0.020499999999999997,0.016200000000000003,0.0087,0.0088],"e6727ceb9fd5b2d8f06d2915b0b1e5f4":[0.0368,0.0084,0.011399999999999999,0.0359],"a447433ef947f4ac3381b06973fbf71f":[0.012,0.008100000000000001,0.015700000000000002],"97ff57c575283784a1cdb4cb7ed19cb5":[0.0369,0.0208,0.0235,0.0083,0.0085,0.0103,0.0121],"5af8a9c680742648db21ae5bdde7cceb":[0.0375,0.0258,0.0196,0.022400000000000003,0.0072,0.0202,0.011899999999999999,0,0.013000000000000001,0.005699999999999999],"4af92584114835dd2c953038f034fd48":[0.028900000000000002,0.0178,0.0361,0,0.0118,0.0146,0.0148],"3bba017050d87671247228426b1fb64b":[0.032400000000000005,0.037000000000000005,0.0178,0.0256,0.013300000000000001,0.013500000000000002,0.023700000000000002,0.0064,0.0126],"f4d26596958884845a46923e5dbf0d36":[0.009899999999999999,0.0134,0.0398,0.0068000000000000005,0.0069,0.0144,0.0259],"727246840b15a8588bc06c20ada92f97":[0.0086,0.0241],"37fb9bd9267b1c84d709dd78fadafd59":[0.011899999999999999,0,0.0104,0.0106,0.0105],"4a38d6e9058f5fffe51593ee3bb719eb":[0.008],"c5a5c3991d512e050dcf30c886d8841e":[0.0060999999999999995,0.0319],"92bdb0450ba29bb5b7d29bdd83e3ec4f":[0.016399999999999998,0.014199999999999999],"70daf798c96586b7063162bbf65274e8":[0.0194,0.1164],
			} : null; // DEL
			var sample_descr = 'old data (sample)'; // DEL
			DuoTweak.Chart.data.full_old = DuoTweak.Storage.load(DuoTweak.Course.learning_lang + '/' + DuoTweak.Course.base_lang + '.' + DuoTweak.Tree.id + '.graph_data', sample_data); // todo: sample_data -> null
			DuoTweak.Chart.data.old_descr = DuoTweak.Storage.load(DuoTweak.Course.learning_lang + '/' + DuoTweak.Course.base_lang + '.' + DuoTweak.Tree.id + '.graph_descr', sample_descr); // todo: sample_descr -> '<none>'
			DuoTweak.Chart.data.preview = {};
			DuoTweak.Chart.is_preview = true;
			for (var skill_id in DuoTweak.Skills.data[DuoTweak.Tree.id]) {
				DuoTweak.Chart.data.preview[skill_id] = [DuoTweak.Skills.data[DuoTweak.Tree.id][skill_id].max_dropout];
			}
			DuoTweak.Chart.max_dropout = Math.max.apply(null,
				Object.keys(DuoTweak.Skills.data[DuoTweak.Tree.id]).map(function (x) {
					return DuoTweak.Skills.data[DuoTweak.Tree.id][x].max_dropout;
				})
			);
			var width = $("#tree-tab-panel").width();
			$(".header", "#tree-tab-panel").after(
				'<div id="dt-chart">' + 
					'<div id="dt-chart-main" style="height: ' + DuoTweak.Chart.params.PREVIEW_HEIGHT + 'px;">' + 
						'<canvas id="dt-chart-back" width="' + width + '" height="' + DuoTweak.Chart.params.PREVIEW_HEIGHT + '"></canvas>' + 
						'<canvas id="dt-chart-front" width="' + width + '" height="' + DuoTweak.Chart.params.PREVIEW_HEIGHT + '"></canvas>' + 
					'</div>' + 
					'<canvas id="dt-chart-fixed" width="300" height="100"></canvas>' + 
				'</div>'
			);
			DuoTweak.Chart.draw();
		},
		loadData: function () {
			var skill_ids = Object.keys(DuoTweak.Skills.data[DuoTweak.Tree.id]);
			var load = function (skill_index) {
				if (skill_index < skill_ids.length) {
					var skill_id = skill_ids[skill_index];
					$.ajax({
						type: "GET",
						url: "/api/2/nodes/" + skill_id + "/metrics",
					}).done(function (data) {
						DuoTweak.Chart.data.full[skill_id] = [];
						for (var i = 0; i < data.dropout_rates.length; i++) {
							DuoTweak.Chart.data.full[skill_id].push(data.dropout_rates[i].rate);
						}
						DuoTweak.Chart.showLoadStatus((skill_index + 1) / skill_ids.length);
						load(++skill_index);
					}).fail(function (xhr, status) {
						alert('Sorry, too many requests... Try again later.');
						DuoTweak.Chart.toggle();
					});
				} else {
					DuoTweak.Chart.is_loading = false;
					DuoTweak.Chart.draw();
					DuoTweak.Chart.drawLegend();
				}
			};
			DuoTweak.Chart.is_loading = true;
			load(0);
		},
		save: function () {
			if (!DuoTweak.Chart.is_loading) { // TODO: включать доступность кнопки после загрузки
				var descr = window.prompt("Enter description", new Date().toLocaleDateString());
				if (descr) {
					DuoTweak.Chart.data.full_old = DuoTweak.Chart.data.full;
					DuoTweak.Chart.data.old_descr = descr;
					DuoTweak.Storage.store(DuoTweak.Course.learning_lang + '/' + DuoTweak.Course.base_lang + '.' + DuoTweak.Tree.id + '.graph_data', DuoTweak.Chart.data.full);
					DuoTweak.Storage.store(DuoTweak.Course.learning_lang + '/' + DuoTweak.Course.base_lang + '.' + DuoTweak.Tree.id + '.graph_descr', descr);
					DuoTweak.Chart.draw();
					DuoTweak.Chart.drawLegend();
				}
			}
		},
		draw: function () {
			var data = DuoTweak.Chart.data[DuoTweak.Chart.is_preview ? "preview" : "full"];
			var old_data = DuoTweak.Chart.data.full_old;
//			let values_num = Object.values(data).reduce((num, dropouts) => num + dropouts.length, 0);
			var values_num = Object.values(data).reduce(function (num, dropouts) {
				return num + dropouts.length;
			}, 0);
			var
				ctx = $("#dt-chart-back")[0].getContext("2d"),
				x0 = DuoTweak.Chart.params.x0 = DuoTweak.Chart.params.PADDING + DuoTweak.Chart.params.AXIS_CAPTION_WIDTH,
				y0 = DuoTweak.Chart.params.y0 = ctx.canvas.height - DuoTweak.Chart.params.PADDING - DuoTweak.Chart.params.AXIS_CAPTION_WIDTH,
				dx = DuoTweak.Chart.params.dx = (ctx.canvas.width - x0 - DuoTweak.Chart.params.PADDING) / values_num,
				dy = DuoTweak.Chart.params.dy = (y0 - DuoTweak.Chart.params.PADDING) / DuoTweak.Chart.max_dropout,
				x, y, i
			;
			ctx.font = "12px arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			// grid
			if (!DuoTweak.Chart.is_preview) {
				ctx.strokeStyle = "lightgray";
				ctx.beginPath();
				y = y0;
				while (y > 0) {
					y -= 0.05 * dy; // рисовать линию через каждые 0.05 по оси Y (в единицах измерения dropout)
					ctx.moveTo(x0 + 1, y);
					ctx.lineTo(ctx.canvas.width, y);
				}
				ctx.stroke();
			}
			// axis
			ctx.strokeStyle = ctx.fillStyle = "black";
			ctx.beginPath();
			ctx.moveTo(x0, 0);
			ctx.lineTo(x0, y0);
			ctx.lineTo(ctx.canvas.width, y0);
			y = y0;
			i = 0;
			while (y > 0) {
				i += DuoTweak.Chart.is_preview ? 5 : 1; // интервал насечек на осях (помноженное на 100 относительно единицы изменерия оси Y)
				y = y0 - (i * 0.01) * dy; // делим i обратно на 100
				var notch = i % 5 ? 3 : 6;
				ctx.moveTo(x0 - notch, y);
				ctx.lineTo(x0 + notch, y);
			}
			ctx.stroke();
			ctx.rotate(-0.5 * Math.PI);
			ctx.fillText("Dropout rate", -0.5 * ctx.canvas.height + DuoTweak.Chart.params.AXIS_CAPTION_WIDTH, x0 - 0.5 * DuoTweak.Chart.params.AXIS_CAPTION_WIDTH);
			ctx.rotate(0.5 * Math.PI);
			ctx.fillText(DuoTweak.Chart.is_preview ? "Skills" : "Lessons", 0.5 * ctx.canvas.width / (DuoTweak.Chart.is_preview ? 1 : DuoTweak.Chart.params.WIDTH_MULT), y0 + 0.5 * DuoTweak.Chart.params.AXIS_CAPTION_WIDTH);
			
			// old_data lines
			if (old_data && !DuoTweak.Chart.is_preview) {
				ctx.strokeStyle = "gray";
				ctx.beginPath();
				x = x0;
				i = 0;
				for (var skill_id in data) {
					for (var lesson = 0; lesson < data[skill_id].length; lesson++) {
						x += dx;
						y = y0 - old_data[skill_id][lesson] * dy;
						if (i == 0 && lesson == 0) {
							ctx.moveTo(x, y);
						} else {
							ctx.lineTo(x, y);
						}
					}
					i++;
				}
				ctx.stroke();
			}
			
			// data lines   &   skill blocks
			ctx.strokeStyle = "red";
			ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
			ctx.beginPath();
			x = x0;
			i = 0;
			for (var skill_id in data) {
				if (!DuoTweak.Chart.is_preview) {
					if (i % 2) {
						ctx.fillRect(x + dx * 0.5, 0, data[skill_id].length * dx, y0 - 1);
					}
				}
				for (var lesson = 0; lesson < data[skill_id].length; lesson++) {
					x += dx;
					y = y0 - data[skill_id][lesson] * dy;
					if (i == 0 && lesson == 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
				}
				i++;
			}
			ctx.stroke();
			
			// data & old_data
			x = x0;
			for (var skill_id in data) {
				for (var lesson = 0; lesson < data[skill_id].length; lesson++) {
					x += dx;
					if (old_data && !DuoTweak.Chart.is_preview) {
						ctx.fillStyle = "gray";
						y = y0 - old_data[skill_id][lesson] * dy;
						ctx.beginPath();
						ctx.arc(x, y, DuoTweak.Chart.params.POINT_SIZE, 0, 2 * Math.PI);
						ctx.fill();
					}
					y = y0 - data[skill_id][lesson] * dy;
					ctx.fillStyle = "red";
					ctx.beginPath();
					ctx.arc(x, y, DuoTweak.Chart.params.POINT_SIZE, 0, 2 * Math.PI);
					ctx.fill();
				}
			}
		},
		showLoadStatus: function (progress) {
			var ctx = $("#dt-chart-front")[0].getContext("2d");
			var
				PI_2 = Math.PI * 0.5,
				PI_4 = Math.PI * 0.25,
				PI_8 = Math.PI * 0.125,
				x = ctx.canvas.width * 0.5 / DuoTweak.Chart.params.WIDTH_MULT,
				y = ctx.canvas.height * 0.5,
				radius = 60,
				circle_width = 6
			;
			ctx.clearRect(x - radius, y - radius, 2 * radius, 2 * radius);
			ctx.fillStyle = "rgba(255, 128, 0, 0.3)";
			var parts_count = Math.floor(progress / 0.125);
			var xd, yd;
			for (var i = 0; i < parts_count; i++) {
				ctx.beginPath();
				xd = x + circle_width * Math.cos((2 * i - 3) * PI_8);
				yd = y + circle_width * Math.sin((2 * i - 3) * PI_8);
				ctx.moveTo(xd, yd);
				ctx.arc(xd, yd, radius - circle_width * 2, (i - 2) * PI_4, (i - 1) * PI_4);
				ctx.fill();
			}
			ctx.strokeStyle = "orange";
			ctx.lineWidth = circle_width;
			ctx.beginPath();
			ctx.arc(x, y, radius, -PI_2, 2 * Math.PI * progress - PI_2);
			ctx.stroke();
			var text = Math.round(progress * 100) + "%";
			ctx.fillStyle = "orange";
			ctx.font = "bold " + (radius * 0.4) + "pt Arial";
			ctx.textAlign = "center";
			ctx.fillText(text, x, y + radius * 0.2);
		},
		drawLegend: function () {
			var ctx = $("#dt-chart-fixed")[0].getContext("2d");
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			if (!DuoTweak.Chart.is_preview && !DuoTweak.Chart.is_loading) {
				var X0 = 50, Y0 = 40, LEN = 100, INTERVAL = 20, TXT_MARGIN = 10;
				ctx.lineWidth = 1;
				ctx.font = "14px Arial";
				ctx.textBaseline = "middle";
					
				ctx.strokeStyle = ctx.fillStyle = "red";
				ctx.beginPath();
				ctx.moveTo(X0, Y0);
				ctx.lineTo(X0 + LEN, Y0);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(X0 + LEN * 0.5, Y0, DuoTweak.Chart.params.POINT_SIZE, 0, 2 * Math.PI);
				ctx.fill();
				ctx.fillText('current state', X0 + LEN + TXT_MARGIN, Y0);
				
				ctx.strokeStyle = ctx.fillStyle = "gray";
				ctx.beginPath();
				ctx.moveTo(X0, Y0 + INTERVAL);
				ctx.lineTo(X0 + LEN, Y0 + INTERVAL);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(X0 + LEN * 0.5, Y0 + INTERVAL, DuoTweak.Chart.params.POINT_SIZE, 0, 2 * Math.PI);
				ctx.fill();
				ctx.fillText(DuoTweak.Chart.data.old_descr, X0 + LEN + TXT_MARGIN, Y0 + INTERVAL);
			}
		},
		showInfo: function (cx, cy) {
			var ctx = $("#dt-chart-front")[0].getContext("2d");
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			var x = DuoTweak.Chart.params.x0, y, skill_id, lesson;
			var done = false;
			for (skill_id in DuoTweak.Chart.data.full) {
				for (lesson = 0; lesson < DuoTweak.Chart.data.full[skill_id].length; lesson++) {
					x += DuoTweak.Chart.params.dx;
					y = DuoTweak.Chart.params.y0 - DuoTweak.Chart.data.full[skill_id][lesson] * DuoTweak.Chart.params.dy;
					if (Math.abs(cx - x) < 2 * DuoTweak.Chart.params.POINT_SIZE && Math.abs(cy - y) < 2 * DuoTweak.Chart.params.POINT_SIZE) {
						done = true;
						break;
					}
				}
				if (done) {
					break;
				}
			}
			if (done) {
				ctx.fillStyle = "red";
				ctx.beginPath();
				ctx.arc(x, y, 2 * DuoTweak.Chart.params.POINT_SIZE, 0, 2 * Math.PI);
				ctx.fill();
				var BUBBLE_SHIFT = 10, ARROW_HEIGHT = 10, BUBBLE_HALFWIDTH = 150, BUBBLE_HEIGHT = 100;
				var pos = y < (BUBBLE_HEIGHT + BUBBLE_SHIFT) ? 1 : -1;
				y += pos * BUBBLE_SHIFT;
				ctx.lineWidth = 2;
				ctx.strokeStyle = "gray";
				ctx.fillStyle = "white";
				ctx.beginPath();
				ctx.moveTo(x, y);
				y += pos * ARROW_HEIGHT;
				ctx.lineTo(x - 4, y);
				ctx.bezierCurveTo(x - BUBBLE_HALFWIDTH, y, x - BUBBLE_HALFWIDTH, y + pos * BUBBLE_HEIGHT, x, y + pos * BUBBLE_HEIGHT);
				ctx.bezierCurveTo(x + BUBBLE_HALFWIDTH, y + pos * BUBBLE_HEIGHT, x + BUBBLE_HALFWIDTH, y, x + 4, y);
				ctx.lineTo(x, y - pos * ARROW_HEIGHT);
				ctx.stroke();
				ctx.fill();
				
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				
				ctx.fillStyle = "black";
				ctx.font = "bold 16px Arial";
				ctx.fillText(DuoTweak.Skills.get(skill_id).short_title, x, y + 0.5 * pos * BUBBLE_HEIGHT - 22);
				
				ctx.font = "14px Arial";
				ctx.fillText("Lesson " + (lesson + 1), x, y + 0.5 * pos * BUBBLE_HEIGHT - 6);
				
				ctx.fillStyle = "red";
				ctx.font = "16px Arial";
				ctx.fillText(Math.round(DuoTweak.Chart.data.full[skill_id][lesson] * 10000) / 100 + " %", x, y + 0.5 * pos * BUBBLE_HEIGHT + 12);
				
				ctx.fillStyle = 'gray';
				ctx.font = "12px Arial";
				var str = '-';
				if (DuoTweak.Chart.data.full_old && DuoTweak.Chart.data.full_old[skill_id] && DuoTweak.Chart.data.full_old[skill_id][lesson]) {
					var diff = Math.round((DuoTweak.Chart.data.full_old[skill_id][lesson] - DuoTweak.Chart.data.full[skill_id][lesson]) * 10000) / 100;
					str = (diff > 0 ? '\u2193' : '\u2191') + ' ' + Math.abs(diff) + ' %';
					ctx.fillStyle = diff > 0 ? 'green' : 'darkred';
				}
				ctx.fillText(str, x, y + 0.5 * pos * BUBBLE_HEIGHT + 26);
			}
		},
		toggle: function () {
			DuoTweak.Chart.is_preview = !DuoTweak.Chart.is_preview;
			var
				width = DuoTweak.Chart.is_preview ? $("#tree-tab-panel").width() : $("#editor-view").width() - 30,
				height = DuoTweak.Chart.is_preview ? DuoTweak.Chart.params.PREVIEW_HEIGHT : DuoTweak.Chart.params.HEIGHT
			;
			$("#dt-chart").width(width);
			$("#dt-chart-main").height(height + 20);
			$("#dt-chart-back, #dt-chart-front").attr({width: width * (DuoTweak.Chart.is_preview ? 1 : DuoTweak.Chart.params.WIDTH_MULT), height: height});
			if (DuoTweak.Chart.is_preview) {
				$("#side-panel").css({top: 0});
				DuoTweak.Chart.draw();
			} else {
				$("#side-panel").offset({top: $("#dt-chart").offset().top + $("#dt-chart").height()});
				if (!Object.keys(DuoTweak.Chart.data.full).length) {
					DuoTweak.Chart.loadData();
				} else {
					DuoTweak.Chart.draw();
				}
			}
			DuoTweak.Chart.drawLegend();
			$('.dt-chart-save').attr({disabled: DuoTweak.Chart.is_preview});
		},
	},
	
	ReportsRating: {
		TOP_NUMBER: 500,
		tree_id: "",
		data: [], // [{id: "", skill_id: "", text: "", reports_num: 0, translate_failure: 0, listen_failure: 0, form_failure: 0}, ...]
		checkpoints: {}, // {#checkpoint: {active: true, skill_count: 0}, ...} where #checkpoint = [1..N]
		addTab: function () {
			var rating_tab = $(".dt-reports_rating-tab");
			if (!$(".dt-reports_rating-tab").length) {
				rating_tab = $('<li class="dt-reports_rating-tab"><a role="tab" href="javascript:;">' + DuoTweak.getLocale(DuoTweak.Locale.TOP_REPORTS, DuoTweak.ReportsRating.TOP_NUMBER) + ' <sup></sup></a></li>');
				$(".tree-tabs").append(rating_tab);
			}
			$("sup", rating_tab).text("T" + DuoTweak.Course.trees_ver[DuoTweak.ReportsRating.tree_id]);
		},
		getSkillCount: function () {
			var skill_count = 0;
			for (var cp in DuoTweak.ReportsRating.checkpoints) {
				if (DuoTweak.ReportsRating.checkpoints[cp].active) {
					skill_count += DuoTweak.ReportsRating.checkpoints[cp].skill_count;
				}
			}
			return skill_count;
		},
		showPage: function () {
			var total_reports = 0;
			DuoTweak.ReportsRating.checkpoints = {};
			for (var skill_id in DuoTweak.Skills.data[DuoTweak.ReportsRating.tree_id]) {
				var skill = DuoTweak.Skills.data[DuoTweak.ReportsRating.tree_id][skill_id];
				total_reports += skill.reports_num;
				if (!DuoTweak.ReportsRating.checkpoints[skill.checkpoint]) {
					DuoTweak.ReportsRating.checkpoints[skill.checkpoint] = {active: true, skill_count: 1};
				} else {
					DuoTweak.ReportsRating.checkpoints[skill.checkpoint].skill_count++;
				}
			}
			var checkpoints_section = '<div>';
			for (var cp in DuoTweak.ReportsRating.checkpoints) {
				checkpoints_section += '<button type="button" class="dt-reports_rating-checkpoint dt-st-active" data-checkpoint="' + cp + '"><span class="dt-reports_rating-checkpoint-mark">&#10003;</span> ' + DuoTweak.getLocale(DuoTweak.Locale.CHECKPOINT, cp) + '</button>';
			}
			checkpoints_section += '</div>';
			var container = $("#tree-tab-panel").addClass("dt-reports_rating-container").removeClass("hide").empty();
			container.append(
				'<div class="header">' + 
					'Top ' + DuoTweak.ReportsRating.TOP_NUMBER + ' most reported sentences' + 
					'<div class="dt-reports_rating-total_reports">' + DuoTweak.getLocale(DuoTweak.Locale.TOTAL_REPORTS, DuoTweak.formatNumber(total_reports)) + '</div>' + 
					checkpoints_section + 
					'<div><button type="button" class="dt-reports_rating-run">' + DuoTweak.getLocale(DuoTweak.Locale.LOAD_DATA, DuoTweak.ReportsRating.getSkillCount()) + '</button></div>' + 
					'<div class="dt-reports_rating-progress-bg"><div class="dt-reports_rating-progress-scale"></div></div>' + 
					'<div class="dt-details-error"></div>' + 
				'</div>'
			);
			if (DuoTweak.ReportsRating.data.length) {
				DuoTweak.ReportsRating.createTable("reports_num");
			}
		},
		toggleCheckpoint: function (checkpoint_button) {
			var cp = checkpoint_button.data("checkpoint");
			DuoTweak.ReportsRating.checkpoints[cp].active = !DuoTweak.ReportsRating.checkpoints[cp].active;
			checkpoint_button.toggleClass("dt-st-active");
			$(".dt-reports_rating-run").text(DuoTweak.getLocale(DuoTweak.Locale.LOAD_DATA, DuoTweak.ReportsRating.getSkillCount()));
		},
		startLoading: function () {
			var PROGRESS_CSS = { // %1 - progress percentage
				param: "background-image",
				value: "linear-gradient(90deg, #FF8080, #FF0000 %1%, transparent %1%, transparent)",
			};
			var skill_ids = [];
			for (var skill_id in DuoTweak.Skills.data[DuoTweak.ReportsRating.tree_id]) {
				if (DuoTweak.ReportsRating.checkpoints[DuoTweak.Skills.data[DuoTweak.ReportsRating.tree_id][skill_id].checkpoint].active) {
					skill_ids.push(skill_id);
				}
			}
			if (!skill_ids.length) {
				alert(DuoTweak.getLocale(DuoTweak.Locale.NO_SKILLS));
				return;
			}
			var
				checkpoint_buttons = $(".dt-reports_rating-checkpoint").attr({disabled: true}),
				loading_button = $(".dt-reports_rating-run").attr({disabled: true}).text(DuoTweak.getLocale(DuoTweak.Locale.LOADING, 0)),
				progress_bg = $(".dt-reports_rating-progress-bg").show(),
				progress_scale = $(".dt-reports_rating-progress-scale"),
				error_container = $(".dt-details-error")
			;
			$(".dt-reports_rating-loading_info, .dt-reports_rating-table").remove();
			progress_scale.css(PROGRESS_CSS.param, PROGRESS_CSS.value.replace(/%1/g, 0));
			DuoTweak.ReportsRating.data = [];
			var loadReports = function (skill_index) {
				if (skill_index < skill_ids.length) {
					var skill_id = skill_ids[skill_index];
					$.ajax({
						type: "GET",
						url: "/api/1/nodes/" + skill_id + "/reports"
					}).done(function (data) {
						for (var i = 0; i < data.sentences.length; i++) {
							var sentence = {
								id: data.sentences[i].id,
								skill_id: skill_id,
								text: data.sentences[i].text,
								reports_num: data.sentences[i].report_count
							};
							sentence.translate_failure = data.failure_rates[sentence.id] && data.failure_rates[sentence.id].translate && data.failure_rates[sentence.id].translate.total > 40 ? 
								data.failure_rates[sentence.id].translate.failure_rate :
								-0.01
							;
							sentence.listen_failure = data.failure_rates[sentence.id] && data.failure_rates[sentence.id].listen && data.failure_rates[sentence.id].listen.total > 40 ? 
								data.failure_rates[sentence.id].listen.failure_rate :
								-0.01
							;
							sentence.form_failure = data.failure_rates[sentence.id] && data.failure_rates[sentence.id].form && data.failure_rates[sentence.id].form.total > 40 ? 
								data.failure_rates[sentence.id].form.failure_rate :
								-0.01
							;
							DuoTweak.ReportsRating.data.push(sentence);
						}
					}).fail(function (xhr, status) {
						error_container.append('<div class="dt-details-error-item">' + DuoTweak.Skills.data[DuoTweak.ReportsRating.tree_id][skill_id].title + ': loading error</div>');
					}).always(function (data, status) {
						var progress = (skill_index + 1) / skill_ids.length * 100;
						progress_scale.css(PROGRESS_CSS.param, PROGRESS_CSS.value.replace(/%1/g, progress));
						loading_button.text(DuoTweak.getLocale(DuoTweak.Locale.LOADING, Math.round(progress)));
						loadReports(++skill_index);
					});
				} else {
					progress_bg.hide();
					checkpoint_buttons.attr({disabled: false});
					loading_button.attr({disabled: false}).text(DuoTweak.getLocale(DuoTweak.Locale.LOAD_DATA, DuoTweak.ReportsRating.getSkillCount()));
					$(".dt-reports_rating-container").append('<div class="dt-reports_rating-loading_info">' + DuoTweak.getLocale(DuoTweak.Locale.SENTENCES_LOADED, DuoTweak.ReportsRating.data.length) + '</div>');
					DuoTweak.ReportsRating.createTable("reports_num");
				}
			};
			loadReports(0);
				
		},
		createTable: function (order_by) {
			DuoTweak.ReportsRating.data.sort(function (a, b) {
				return b[order_by] - a[order_by];
			});
			var table = $(
				'<table class="dt-reports_rating-table">' + 
					'<tr>' + 
						'<th rowspan="2">№</th>' + 
						'<th rowspan="2">' + DuoTweak.getLocale(DuoTweak.Locale.SENTENCE) + '</th>' + 
						'<th rowspan="2" class="' + (order_by == "reports_num" ? "" : "dt-reports_rating-table-can_order") + '" data-order="reports_num">' + DuoTweak.getLocale(DuoTweak.Locale.REPORTS) + (order_by == "reports_num" ? "<br/>&#9660;" : "") + '</th>' + 
						'<th colspan="3">' + DuoTweak.getLocale(DuoTweak.Locale.FAILURE_PERCANTAGE) + '</th>' + 
					'</tr>' + 
					'<tr>' + 
						'<th class="' + (order_by == "translate_failure" ? "" : "dt-reports_rating-table-can_order") + '" data-order="translate_failure">translate' + (order_by == "translate_failure" ? "<br/>&#9660;" : "") + '</th>' + 
						'<th class="' + (order_by == "listen_failure" ? "" : "dt-reports_rating-table-can_order") + '" data-order="listen_failure">listen' + (order_by == "listen_failure" ? "<br/>&#9660;" : "") + '</th>' + 
						'<th class="' + (order_by == "form_failure" ? "" : "dt-reports_rating-table-can_order") + '" data-order="form_failure">form' + (order_by == "form_failure" ? "<br/>&#9660;" : "") + '</th>' + 
					'</tr>' + 
				'</table>'
			);
			for (var i = 0; i < DuoTweak.ReportsRating.TOP_NUMBER && i < DuoTweak.ReportsRating.data.length; i++) {
				table.append('<tr>' + 
					'<td>' + (i + 1) + '</td>' + 
					'<td><a href="http://incubator.duolingo.com/courses/' + DuoTweak.Course.learning_lang + '/' + DuoTweak.Course.base_lang + '/editor/' + DuoTweak.ReportsRating.data[i].skill_id + '/reports/' + DuoTweak.ReportsRating.data[i].id + '" target="_blank">' + DuoTweak.ReportsRating.data[i].text + '</a></td>' + 
					'<td>' + DuoTweak.ReportsRating.data[i].reports_num + '</td>' + 
					'<td>' + (DuoTweak.ReportsRating.data[i].translate_failure < 0 ? "-" : Math.round(DuoTweak.ReportsRating.data[i].translate_failure * 100)) + '</td>' + 
					'<td>' + (DuoTweak.ReportsRating.data[i].listen_failure < 0 ? "-" : Math.round(DuoTweak.ReportsRating.data[i].listen_failure * 100)) + '</td>' + 
					'<td>' + (DuoTweak.ReportsRating.data[i].form_failure < 0 ? "-" : Math.round(DuoTweak.ReportsRating.data[i].form_failure * 100)) + '</td>' + 
				'</tr>');
			}
			$(".dt-reports_rating-table").remove();
			$(".dt-reports_rating-container").append(table);
		},
	},
	
	Sentence: {
		forward: {id: null, reports_num: 0},
		reverse: {id: null, reports_num: 0},
		total_reports_num: 0,
		clearall_button: null,
		sentences_loaded: 0, // кол-во загруженных предложений, точнее их репортов (1 - только в одном направлении перевода forward/reverse, 2 - в обоих направлениях)
		reset: function () {
			DuoTweak.Sentence.forward.id = DuoTweak.Sentence.reverse.id = null;
			DuoTweak.Sentence.forward.reports_num = DuoTweak.Sentence.reverse.reports_num = 0; // del?
			DuoTweak.Sentence.total_reports_num = 0;
			DuoTweak.Sentence.clearall_button = null;
			DuoTweak.Sentence.sentences_loaded = 0;
		},
		insertRemoveButtons: function () {
			$(".sentence-row:not(.done)", "#sentences").addClass("dt-sentence-checked");
			$("#sentences").after('<div class="dt-sentence-removeall"><button type="button" class="dt-sentence-removeall-btn">Remove selected</button><br/>Click on the check marks to select/deselect sentences</div>');
		},
		removeChecked: function () {
			var tree_id = $(".back-nav", ".main-header").attr("href").match(/tree_id=(\w+)/)[1];
			if (tree_id) {
				$(".dt-sentence-checked").each(function (i, el) {
					setTimeout(function() {
						var sent_id = $(el).data("id");
						if (sent_id) {
							$(el).css({color: "lightgray"})
							$.ajax({
								type: "POST",
								url: "/api/1/sentences/remove",
								data: {
									tree_id: tree_id,
									sentence_id: sent_id
								},
							}).done(function() {
								$(el).remove();
							}).fail(function() {
								alert("error"); // todo
							});
						}
					}, 2000 * i);
				});
			}
			
		},
		/**
		* @param {String} translation_direction "forward" or "reverse"
		*/
		toggleBody: function (translation_direction) {
			$(".sentence-container, .sentence-details-container, .viability-alert", "#" + translation_direction).slideToggle(300);
		},
		/**
		* @param {String} translation_direction "forward" or "reverse"
		*/
		addReportCountToHeader: function (translation_direction) { // del?
			$(".direction-sentence .sub-header .discussion-icon", "#" + translation_direction).after('<div class="dt-reports_num" title="' + DuoTweak.getLocale(DuoTweak.Locale.REPORTS) + '">' + DuoTweak.Sentence[translation_direction].reports_num + '</div>');
		},
		/**
		* @param {String} translation_direction "forward" or "reverse"
		*/
		hideWrongAnswers: function (translation_direction) {
			$("#" + translation_direction + " #wrong-answers-section .sub-sub-header").click();
		},
		addClearReportsButton: function () {
			$(".reports-subsection #reports-section").siblings(".sub-sub-header").append('&nbsp;&nbsp;<button type="button" class="dt-clear_reports">' + DuoTweak.getLocale(DuoTweak.Locale.REJECT_ALL) + '</button>');
			$(".reports-subsection #freewrite-reports-section, .reports-subsection #other-reports-section").siblings(".sub-sub-header").append('&nbsp;&nbsp;<button type="button" class="dt-clear_reports">' + DuoTweak.getLocale(DuoTweak.Locale.CLEAR_ALL) + '</button>');
			if (!DuoTweak.Sentence.clearall_button) {
				DuoTweak.Sentence.clearall_button = $('<button type="button" class="dt-clear_allreports">' + DuoTweak.getLocale(DuoTweak.Locale.CLEAR_ALL_REPORTS, DuoTweak.Sentence.total_reports_num) + '</button>');
				$(".header", "#exercise-editor").append(DuoTweak.Sentence.clearall_button);
				$(".header", "#exercise-editor").contents().each(function () {
					if (this.nodeType == Node.TEXT_NODE) {
						$(this).wrap('<div class="dt-sentence_header"></div>');
					}
				});
			}
		},
		clearReports: function (reports_section) {
			var report_rows = $(".reject-report, .clear-report, .clear-freewrite-report", reports_section);
			if (reports_section.attr("id") != "reports-section" || report_rows.length <= 3 || confirm(DuoTweak.getLocale(DuoTweak.Locale.ARE_YOU_SURE))) {
				report_rows.each(function (i, el) {
					setTimeout(function () {
						el.click();
					}, i * 300);
				});
			}
		},
		clearAllReports: function () {
			$(".reject-report, .clear-report, .clear-freewrite-report", "#exercise-editor").each(function (i, el) {
				setTimeout(function () {
					el.click();
				}, i * 400);
			});;
		},
		/**
		* @param {String} translation_direction "forward" or "reverse"
		*/
		showEditHistory: function (translation_direction) {
			var ex_contributors = DuoTweak.Course.EX_CONTRIBUTORS[DuoTweak.Course.learning_lang + "_" + DuoTweak.Course.base_lang];
			var history = $("#exercise-editor #" + translation_direction + " .dt-sentence_history");
			if (!history.length) {
				history = $('<div class="dt-sentence_history"><div class="dt-loading"></div></div>').insertAfter("#exercise-editor #" + translation_direction + " .last-edited");
				$.ajax({
					type: "GET",
					url: "/api/1/sentences/show_compact_history?sentence_id=" + (DuoTweak.Sentence[translation_direction].id) + "&learning_language_id=" + DuoTweak.Course.learning_lang + "&from_language_id=" + DuoTweak.Course.base_lang,
				}).done(function (data) {
					var elementary_changes = { // changes between two neighboring edits
						starred: null,
						normal: null,
					};
					/**
					 * @param {String} translation_type "normal" or "starred"
					 * @param {String} change_type "added" or "removed"
					 */
					var insertHistoryRecord = function (translation_type, change_type) {
						for (var i = 0; i < elementary_changes[translation_type][change_type].length; i++) {
							history.append('<div class="dt-sentence_history-' + change_type + '">&#973' + (translation_type == "starred" ? '3' : '4') + '; ' + elementary_changes[translation_type][change_type][i] + '</div>');
						}
					};
					history.empty();
					for (var i = 0, next = 0; i < data.length; i = next) { // next - index of a change of another user or later than 2 hours
						var date = new Date(data[i].datetime);
						do {
							next++;
						} while (next < data.length && data[next].user_id == data[i].user_id && date - new Date(data[next].datetime) < 7200000);
						elementary_changes.starred = DuoTweak.getDiff(data[i].compact_translation.display_compacts, next < data.length ? data[next].compact_translation.display_compacts : []);
						elementary_changes.normal = DuoTweak.getDiff(data[i].compact_translation.accept_compacts, next < data.length ? data[next].compact_translation.accept_compacts : []);
						if (elementary_changes.starred.added.length || elementary_changes.starred.removed.length || elementary_changes.normal.added.length || elementary_changes.normal.removed.length) {
							var user_name = DuoTweak.Course.contributors[data[i].user_id] ? 
								DuoTweak.Course.contributors[data[i].user_id].username : 
								ex_contributors[data[i].user_id] ? 
									ex_contributors[data[i].user_id] : 
									'id' + data[i].user_id
							;
							history.append(
								'<div class="dt-sentence_history-user">' + 
									(DuoTweak.Course.contributors[data[i].user_id] ? '<img class="img-circle" src="' + DuoTweak.Course.contributors[data[i].user_id].avatar + '/small"/>&nbsp;' : '') + 
									'<a href="http://www.duolingo.com/users/' + data[i].user_id + '/redirect" target="_blank">' + user_name + '</a> - ' + 
									'<span>' + date.toLocaleDateString() + '</span>' + 
								'</div>'
							);
							insertHistoryRecord("starred", "removed");
							insertHistoryRecord("starred", "added");
							insertHistoryRecord("normal", "removed");
							insertHistoryRecord("normal", "added");
						}
					}
				}).fail(function (xhr) {
					if (xhr.status == 403) {
						history.html("Error: " + DuoTweak.getLocale(DuoTweak.Locale.NOT_CONTRIBUTOR));
					}
				});
			}
			history.slideToggle(500);
		},
	},
	
	RuLangVariables: {
		IN_USE: {
			"default": {sample: "русский язык, иврит", title: "Название языка в именит. или винит. падеже"},
			"capitalized": {sample: "Русский язык, Иврит", title: "Название языка в имен. падеже с Заглавной буквы"},
			"acc-single-masc": {sample: "русского языка, иврита", title: "Название языка в родительном падеже"},
			"dat-single-masc": {sample: "русскому языку, ивриту", title: "Название языка в дательном падеже"},
			"inst-single-fem": {sample: "русским языком, ивритом", title: "Название языка в творительном падеже"},
			"prep_single_masc": {sample: "русском языке, иврите", title: "Название языка в предложном падеже"},
			"adjective with article": {sample: "русск, ивритск", title: "Прилаг. без окончания, НЕ являющееся названием языка"},
		},
		strikeOutUnused: function () {
			if ($("#pages .active").data("id") == "custom:ru") {
				$("#ui-strings-list li[data-id]").each(function () {
					if (DuoTweak.RuLangVariables.IN_USE[$(".label", this).text()] === undefined) {
						$(this).addClass("dt-unused_context");
					}
				});
			}
		},
		upgradeContextPicker: function (context_picker) {
			var chooser_elems = $("li[data-name]", context_picker);
			chooser_elems.addClass("dt-unused_context");
			var insert_after = chooser_elems.eq(0).prev();
			for (var context_name in DuoTweak.RuLangVariables.IN_USE) {
				var context = chooser_elems.filter(context_name == "default" ? ":not([data-value])" : ("[data-value='" + context_name + "']"));
				var link = $("a", context);
				link.html(link.html() + '<br/><span class="dt-context_sample">' + DuoTweak.RuLangVariables.IN_USE[context_name].sample + '</span>');
				context
					.attr("title", DuoTweak.RuLangVariables.IN_USE[context_name].title)
					.removeClass("dt-unused_context")
					.remove()
					.insertAfter(insert_after)
				;
				insert_after = context;
			}
		},
	},
	
	// ======================================== event methods ========================================
	
	processAjax: function (event, xhr, options) {
		// remove "_=XXXXXXXXXXXXX" from url
		options.url = options.url.replace(/([?&])_=\d+/, "");
		
		// loading skills
		if (/\/api\/2\/trees\/\w+$/.test(options.url)) {
			if (xhr.responseJSON) {
				var tree_id = xhr.responseJSON.id;
				DuoTweak.Course.trees_ver[tree_id] = xhr.responseJSON.version;
				DuoTweak.Skills.data[tree_id] = {};
				for (var i = 0; i < xhr.responseJSON.nodes.length; i++) {
					if (!xhr.responseJSON.nodes[i].is_bonus) {
						var checkpoint = 1;
						while (xhr.responseJSON.nodes[i].coords_y > xhr.responseJSON.shortcuts[checkpoint - 1]) {
							checkpoint++;
						}
						var lexemes = [];
						var lessons_num = 0;
						for (var j = 0; j < xhr.responseJSON.nodes[i].kc_list.length; j++) {
							lessons_num++;
							for (var k = 0; k < xhr.responseJSON.nodes[i].kc_list[j].length; k++) {
								lexemes.push(xhr.responseJSON.nodes[i].kc_list[j][k].replace(/^(lex|grp)_/, ""));
							}
						}
						DuoTweak.Skills.data[tree_id][xhr.responseJSON.nodes[i].id] = {
							title: xhr.responseJSON.nodes[i].concept.title,
							short_title: xhr.responseJSON.nodes[i].concept.short,
							lexemes: lexemes,
							lessons_num: lessons_num,
							has_notes: xhr.responseJSON.nodes[i].concept.notes != "",
							reports_num: 0,
							checkpoint: checkpoint,
						};
					}
				}
				DuoTweak.Course.changeTree();
			}
		}
		
		// loading metrics
		// only for released trees (tree status = "RELEASED")
		else if (/\/api\/2\/trees\/\w+\/metrics/.test(options.url)) {
			if (xhr.responseJSON) {
				var tree_id = /trees\/(\w+)\/metrics/.exec(options.url)[1];
				for (var skill_id in xhr.responseJSON.report_counts) {
					if (DuoTweak.Skills.data[tree_id][skill_id]) {
						DuoTweak.Skills.data[tree_id][skill_id].reports_num = xhr.responseJSON.report_counts[skill_id];
					}
				}
				DuoTweak.Tree.fixReportsNum();
				//DuoTweak.Tree.markSkillsWithoutNotes();
				for (var skill_id in xhr.responseJSON.dropout_rates) {
					if (DuoTweak.Skills.get(skill_id)) {
						DuoTweak.Skills.get(skill_id).max_dropout = parseFloat(xhr.responseJSON.dropout_rates[skill_id].rate);
					}
				}
				if (Object.keys(xhr.responseJSON.dropout_rates).length) {
					DuoTweak.Chart.init();
				}
				DuoTweak.ReportsRating.tree_id = tree_id;
				DuoTweak.ReportsRating.addTab();
			}
		}
		
		// skills (re)loading
		else if (/\/api\/2\/trees\/\w+\/progress/.test(options.url)) {
			DuoTweak.Course.changeTree();
			DuoTweak.Tree.insertGeneralStats();
			DuoTweak.Tree.addSentExtractButton();
		}
		
		// words using
		else if (/\/api\/2\/trees\/\w+\/viability_counts/.test(options.url)) {
			DuoTweak.Tree.insertWordsUsingForm();
		}
		
		// sentence list
		else if (/\/api\/1\/nodes\/\w+\/lexeme/.test(options.url)) {
			if (DuoTweak.User.is_contributor && !$(".dt-sentence-removeall").length) {
				DuoTweak.Sentence.insertRemoveButtons();
			}
		}
		
		// loading sentence
		else if (/\/api\/1\/sentences\/\w+\/show_pair/.test(options.url)) {
			DuoTweak.Sentence.reset();
			if (xhr.responseJSON) {
				DuoTweak.Sentence.forward.id = xhr.responseJSON.forward.id;
				DuoTweak.Sentence.reverse.id = xhr.responseJSON.reverse ? xhr.responseJSON.reverse.id : null;
			}
		}
		
		// reports
		else if (/\/api\/2\/sentences\/\w+\/reports/.test(options.url)) {
			if (DuoTweak.User.is_contributor) {
				DuoTweak.Sentence.sentences_loaded++;
				var sentence_id = options.url.match(/\/api\/2\/sentences\/(\w+)\/reports/)[1];
				DuoTweak.Sentence[DuoTweak.Sentence.forward.id == sentence_id ? 'forward' : 'reverse'].reports_num = xhr.responseJSON.reports.length + xhr.responseJSON.freewrite_reports.length + xhr.responseJSON.other_reports.length;
				DuoTweak.Sentence.total_reports_num = DuoTweak.Sentence.forward.reports_num + DuoTweak.Sentence.reverse.reports_num; // срабатывает 2 раза. При первом разе значение неверное. Но при втором разе оба ajax (forward и reverse) загружены, поэтому должно быть ок.
				if (DuoTweak.Sentence.forward.reports_num) {
					//DuoTweakInc.Sentence.addReportCountToHeader("forward"); // del?
				}
				if (DuoTweak.Sentence.reverse.reports_num) {
					//DuoTweakInc.Sentence.addReportCountToHeader("reverse"); // del?
				}
				if (DuoTweak.Sentence.sentences_loaded == 2) {
					DuoTweak.Sentence.addClearReportsButton();
				}
				$(".last-edited-info").addClass("dt-sentence_history-show");
			}
		}
		
		// loading common wrong answers
		else if (/\/api\/1\/sentences\/\w+\/get_common_wrong_answers/.test(options.url)) {
			DuoTweak.Sentence.hideWrongAnswers(/reverse=true/.test(options.url) ? "reverse" : "forward");
		}
		
		// insert a new sentence translation
		//else if (/\/api\/1\/sentences\/align_compacts/.test(options.url)) {
		else if (/\/api\/1\/sentences\/\w+\/translate/.test(options.url)) { // todo without timer
			if (DuoTweak.User.is_contributor) {
				setTimeout(function() {
					DuoTweak.Sentence.addClearReportsButton();
					$(".last-edited-info").addClass("dt-sentence_history-show");
				}, 2000);
			}
		}
		
		// searching
		else if (/\/api\/2\/(lexemes|sentences)/.test(options.url)) {
			if (xhr.responseJSON) {
				if (xhr.responseJSON.length) {
					$(".search-results").removeClass("search-results").addClass("dt-search_results");
					if (xhr.responseJSON[0].sentence_id) { // check for "sentences" search
						var tree_id;
						for (tree_id in DuoTweak.Skills.data) {
							if (DuoTweak.Skills.data[tree_id][xhr.responseJSON[0].node_id]) {
								break;
							}
						}
						var i = 0;
						var skill_names = [];
						for (; i < xhr.responseJSON.length; i++) {
							skill_names.push(DuoTweak.Skills.data[tree_id][xhr.responseJSON[i].node_id] ? DuoTweak.Skills.data[tree_id][xhr.responseJSON[i].node_id].title : "n/a");
						}
						i = 0;
						var tree_name = $("li[data-tree=" + tree_id + "] a", ".tree-tabs").text();
						var is_translations = /type=translations/.test(options.url);
						$(".list-group-item", this).each(function () {
							$(this).removeClass("list-group-item").wrap('<p class="list-group-item"></p>').after('<br/><small>' + tree_name + ', ' + skill_names[i] + '</small>');
							if (!is_translations && !$(this).hasClass("translated")) {
								$(this).css({color: "gray"});
							}
							i++;
						});
					}
				}
			} else {
				// when the query returns Bad Gateway error
				var search_button = $("#search-submit");
				$(".loading", search_button).addClass("hide");
				$(".search-label", search_button).removeClass("hide");
				$(".dt-search_results").hide();
			}
		}
		
		// loading variables list in localization
		else if (/\/api\/1\/ui_strings\/list\?(page=\d{1,3}&)?from_language_id=ru&tag=custom%3Aru/.test(options.url) || /\/api\/1\/ui_strings\/\w+\/translate/.test(options.url)) {
			DuoTweak.RuLangVariables.strikeOutUnused();
		}
		
		// loading list of contributors
		else if (/\/api\/1\/users\/course_contributors/.test(options.url)) {
			if (xhr.responseJSON) {
				for (var i = 0; i < xhr.responseJSON.contributors.length; i++) {
					DuoTweak.Course.contributors[xhr.responseJSON.contributors[i].id] = {
						username: xhr.responseJSON.contributors[i].username,
						avatar: xhr.responseJSON.contributors[i].avatar_url,
					};
				}
				DuoTweak.Course.showExContributorsInHistory();
			}
		}
	},
	
	addEventListeners: function () {
		// tree stats
		$(document).on("mouseenter", ".dt-tree_stats-sentences.dt-st-active", function () {
			$(this).hide();
			$(".dt-tree_stats-count").show();
		});
		$(document).on("mouseleave", ".dt-tree_stats-count", function () {
			if ($(".dt-tree_stats-sentences").hasClass("dt-st-active")) {
				$(this).hide();
				$(".dt-tree_stats-sentences").show();
			}
		});
		$(document).on("click", ".dt-tree_stats-count", function () {
			$(".dt-tree_stats-sentences").removeClass("dt-st-active");
			$(this).hide();
			$(".dt-loading", ".dt-tree_stats").show();
			DuoTweak.Tree.updateGeneralStats();
		});
		$(document).on('click', '.dt-words_using-calc', DuoTweak.Tree.calcWordsUsing);
		$(document).on('click', '.dt-words_using-stat', function (event) {
			alert($(event.currentTarget).data('sent-list'));
		});
		
		// extracting sentences from the skill
		$(document).on("click", ".dt-extract_sentences", function () {
			DuoTweak.Tree.startSentExtracting($(this).parents(".skill-node").data("id"));
		});
		$(document).on("click", ".dt-extracted_sentences-close", function () {
			$(".dt-extracted_sentences").hide();
		});
		
		// dropout chart
		$(document).on("click", "#dt-chart", function () {
			DuoTweak.Chart.toggle();
		});
		$(document).on("mousemove", "#dt-chart", function (e) {
			if (!DuoTweak.Chart.is_preview && !DuoTweak.Chart.is_loading) {
				DuoTweak.Chart.showInfo(e.offsetX, e.offsetY);
			}
		});
		$(document).on('click', '.dt-chart-save', DuoTweak.Chart.save);
		
		// reports rating
		$(document).on("click", ".dt-reports_rating-tab", function () {
			DuoTweak.ReportsRating.showPage();
		});
		$(document).on("mousedown", ".dt-reports_rating-checkpoint", function () {
			DuoTweak.ReportsRating.toggleCheckpoint($(this));
		});
		$(document).on("click", ".dt-reports_rating-run", function () {
			DuoTweak.ReportsRating.startLoading();
		});
		$(document).on("click", ".dt-reports_rating-table-can_order", function () {
			DuoTweak.ReportsRating.createTable($(this).data("order"));
		});
		
		// sentences removeall
		$(document).on("click", "#sentences .check", function (e) {
			$(this).parent().toggleClass("dt-sentence-checked");
		});
		$(document).on("click", ".dt-sentence-removeall-btn", function () {
			DuoTweak.Sentence.removeChecked();
		});
		
		// folding sentence sections
		$(document).on("click", "#forward .sub-header, #reverse .sub-header", function (e) {
			if (e.target == this) {
				DuoTweak.Sentence.toggleBody($(this).parent().parent().attr("id"));
			}
		});
		
		// searching
		$(document).on("change", "#search .search-query", function () {
			$(".dt-search_results").hide();
		});
		
		// insert variable contexts
		$(document).on("click", ".tag-group .dropdown-toggle", function () {
			var context_picker = $(this).next();
			if (!context_picker.data("upgraded")) {
				DuoTweak.RuLangVariables.upgradeContextPicker(context_picker);
				context_picker.data("upgraded", "1");
			}
		});
		
		if (DuoTweak.User.is_contributor) {
			// clear reports
			$(document).on("click", ".reject-report, .clear-freewrite-report, .clear-report", function () {
				var row = $(this).parent();
				row.css({backgroundColor: "#E0E0E0"});
				DuoTweak.Sentence.total_reports_num -= $(".number", row).text();
				DuoTweak.Sentence.clearall_button.text(DuoTweak.getLocale(DuoTweak.Locale.CLEAR_ALL_REPORTS, DuoTweak.Sentence.total_reports_num >= 0 ? DuoTweak.Sentence.total_reports_num : 0));
			});
			$(document).on("click", ".dt-clear_reports", function () {
				$(this).attr({disabled: true});
				// stopPropagation() doesn't work...
				var reports_section = $(this).parents(".reports-subsection");
				$(".sub-sub-header", reports_section).removeClass("expandable");
				$(".reports-area", reports_section).show();

				DuoTweak.Sentence.clearReports(reports_section);
			});
			$(document).on("click", ".dt-clear_allreports", function () {
				$(this).attr({disabled: true});
				DuoTweak.Sentence.clearAllReports();
			});

			// sentence history
			$(document).on("click", "#exercise-editor .last-edited", function () {
				DuoTweak.Sentence.showEditHistory($(this).parents(".direction-sentence").parent().attr("id"));
			});
			
			// replace / to [], .../ to [.../]
			$(document).on("keydown", "#exercise-editor .translation-input", function (e) {
				if (e.keyCode == 220 || e.keyCode == 226) {
					var str = $(this).val();
					var input = "/";
					var cursor_pos = this.selectionStart;
					if (this.selectionStart == this.selectionEnd) {
						var substr = str.slice(0, this.selectionEnd);
						if (/^([^\[]*|.+\][^\[]*)$/.test(substr)) { // check for current position isn't within "[...]"
							if (this.selectionStart > 0 && /[^\] ]/.test(str[this.selectionStart - 1])) { // check for prev char isn't " " or "]"
								this.selectionStart = Math.max(substr.lastIndexOf("]"), substr.lastIndexOf(" ")) + 1;
								substr = str.slice(this.selectionStart, this.selectionEnd);
								input = "[" + substr + "/]";
								cursor_pos++;
							} else {
								input = "[/]";
							}
						}
					} else {
						var substr = str.slice(this.selectionStart, this.selectionEnd);
						input = "[" + substr + "/]";
						cursor_pos += substr.length + 1;
					}
					str = str.slice(0, this.selectionStart) + input + str.slice(this.selectionEnd);
					$(this).val(str);
					this.selectionStart = this.selectionEnd = cursor_pos + 1;
					e.preventDefault();
				}
			});
			$(document).on("change", "#exercise-editor .translation-input", function () {
				var str = $.trim($(this).val());
				if (/[.!?]$/.test(str)) { // check for final punctuation
					if (/^\[[^\[]+\]/.test(str)) { // check for brackets (including closing bracket) at the beginning of a sentence
						var closing_bkt_index = str.indexOf("]");
						var variants_string = str.slice(0, closing_bkt_index + 1);
						var variants = [];
						var variants_regexp = /([^\[\/]*)[\/\]]/g;
						var match;
						while (match = variants_regexp.exec(variants_string)) {
							variants.push(match[1].slice(0, 1).toUpperCase() + match[1].slice(1));
						}
						$(this).val("[" + variants.join("/") + str.slice(closing_bkt_index));
					} else {
						$(this).val(str.slice(0, 1).toUpperCase() + str.slice(1));
					}
				}
			});
			
			// skill editing
			$(document).on("click", ".main-header .edit", function () {
				$("#concept-url").attr({disabled: false});
				$("#concept-short").attr({maxlength: "50"});
			});
		}
		
	},
	
	// ======================================== additional methods ========================================
	
	updateLogo: function () {
		var duo_logo = $(".navbar-brand");
		if (duo_logo.length) {
			duo_logo
				.css({marginTop: "10px"})
				.after('<a id="dt-duotweak_logo" href="' + DuoTweak.HOME_LINK + '">with DuoTweak <span id="dt-duotweak_logo-version">v' + DuoTweak.VERSION + '</span>')
			;
		} else {
			DuoTweak.showEmergencyBox();
		}
	},
	
	showEmergencyBox: function () {
		var emergency_box = document.getElementById("dt-emergency");
		if (!emergency_box) {
			emergency_box = document.createElement("a");
			emergency_box.setAttribute("id", "dt-emergency");
			emergency_box.setAttribute("style", "z-index: 2147483647; position: fixed; left: 5px; top: 5px; padding: 3px 6px; background-color: rgba(255, 0, 0, 0.7); color: white; font-family: 'Arial'; font-size: 16px; cursor: pointer; box-shadow: 3px 3px 4px gray;");
			emergency_box.setAttribute("href", DuoTweak.HOME_LINK);
			emergency_box.setAttribute("title", "Your DuoTweak version is " + DuoTweak.VERSION);
			emergency_box.innerHTML = 'Something went wrong...<br/>Click visit DuoTweak home page';
			document.querySelector("body").appendChild(emergency_box);
		}
	},
	
	checkUpdate: function () {
		$.ajax({
			type: "GET",
			url: DuoTweak.VERSION_CHECK_LINK,
			dataType: "text",
		}).done(function(data) {
			var lastest = data.split(".");
			var current = DuoTweak.VERSION.split(".");
			for (var i = 0; i < lastest.length; i++) {
				if (lastest[i] - current[i] == 0) {
					continue;
				} else if (lastest[i] - current[i] > 0) {
					$("#dt-duotweak_logo").html('DuoTweak <span id="dt-duotweak_logo-update">UPDATE REQUIRED</span>').attr({title: "Your current version is " + DuoTweak.VERSION});
					var upd_required = $("#dt-duotweak_logo-update");
					setInterval(function() {
						upd_required.toggle();
					}, 700);
				}
				break;
			}
		});
	},
	
	checkStartingPage: function () {
		if (!/\/workshop\/contribution_history/.test(document.location.href)) {
			DuoTweak.Course.loadContributors();
		}
	},
	
	/**
	 * @syntax getLocale(string_id[, ...])
	 * @param {DuoTweak.Locale[STRING_ID]} string_id
	 * @param {String} ... arguments to replace %1...%n in the string
	 * @returns {String}
	 */
	getLocale: function (string_id) {
		var loc_str = "[N/A]";
		if (string_id !== undefined) {
			loc_str = string_id[duo.ui_language] === undefined ? string_id.en : string_id[duo.ui_language];
			if (arguments.length > 1) {
				for (var i = 1; i < arguments.length; i++) {
					loc_str = loc_str.replace(new RegExp("%" + i, "g"), arguments[i]);
				}
			}
		}
		return loc_str;
	},
	
	/**
	 * Extract changes between 2 different arrays of strings
	 * @param {Array} new_version ["string", ...]
	 * @param {Array} old_version ["string", ...]
	 * @returns {Object} {added: [], removed: []}
	 */
	getDiff: function (new_version, old_version) {
		var changes = {
			added: [],
			removed: []
		};
		if (!old_version) {
			old_version = [];
		}
		for (var i = 0; i < new_version.length; i++) {
			if (old_version.indexOf(new_version[i]) == -1) {
				changes.added.push(new_version[i]);
			}
		}
		for (var i = 0; i < old_version.length; i++) {
			if (new_version.indexOf(old_version[i]) == -1) {
				changes.removed.push(old_version[i]);
			}
		}
		return changes;
	},
	
	formatNumber: function (n) {
		var int = n | 0;
		n = n.toString();
		var p = n.indexOf(".");
		return int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + (p == -1 ? "" : n.slice(p));
	},
	
	// ======================================== entry point ========================================
	
	run: function () {
		if (window.duotweakincubator_works || !window.duo || !duo.user) {
			return false;
		}
		if (!window.jQuery) {
			DuoTweak.showEmergencyBox();
			return false;
		}
		window.duotweakincubator_works = true; // prevent multiple instances of DuoTweak
		
		var match = document.location.pathname.match(/\/courses\/([a-z]{2,3}(?:-[A-Z]{2})?)\/([a-z]{2,3}(?:-[A-Z]{2})?)\//);
		DuoTweak.Course.base_lang = match ? match[2] : null;
		DuoTweak.Course.learning_lang = match ? match[1] : null;
		DuoTweak.User.id = duo.user.id;
		DuoTweak.User.name = duo.user.attributes.username;
		DuoTweak.User.is_contributor = duo.user.attributes.contributor_directions.indexOf(DuoTweak.Course.learning_lang + "_" + DuoTweak.Course.base_lang) != -1;
		
		$("head").append('<style type="text/css">' + DuoTweak.CSS.rows.join("\n") + '</style>');
		
		$(document).ajaxComplete(DuoTweak.processAjax);
		DuoTweak.addEventListeners();
		
		// window loading
		$(document).ready(function () {
			DuoTweak.updateLogo();
			DuoTweak.checkStartingPage();
			$("#ui-strings-nav").removeClass("warning");
			setTimeout(function() {
				DuoTweak.checkUpdate();
			}, 15000);
		});
		
		return true;
	}
};

DuoTweak.run();