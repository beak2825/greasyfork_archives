// ==UserScript==
// @name        Wanikani Double-Check
// @namespace   wkdoublecheck
// @description Allows retyping typo'd answers, or marking wrong when WK's typo tolerance is too lax.
// @match       https://www.wanikani.com/*
// @version     3.2.4
// @author      Robin Findley
// @copyright   2017-2024, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35063/Wanikani%20Double-Check.user.js
// @updateURL https://update.greasyfork.org/scripts/35063/Wanikani%20Double-Check.meta.js
// ==/UserScript==

// HOTKEYS:
//   "+"      - Marks answer as 'correct'.
//   "-"      - Marks answer as 'incorrect'.
//   "Escape" or "Backspace" - Resets question, allowing you to retype.

// SEE SETTINGS BELOW.

window.doublecheck = {};

(async function(gobj) {

    /* global wkof, Stimulus, WaniKani, importShim */

    let script_name = 'Double-Check';
    let wkof_version_needed = '1.2.6';

    let wkof_check_result = promise();
    let wkof_check_retries = 3;
    async function check_wkof() {
        if (!window.wkof) {
            if (--wkof_check_retries >= 0) {
                setTimeout(check_wkof, 1000);
                return wkof_check_result;
            }
            if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            }
            return wkof_check_result;
        }
        if (wkof.version.compare_to(wkof_version_needed) === 'older') {
            if (confirm(script_name+' requires Wanikani Open Framework version '+wkof_version_needed+'.\nDo you want to be forwarded to the update page?')) {
                window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
            }
            return wkof_check_result;
        }
        wkof_check_result.resolve();
        return wkof_check_result;
    }
    await check_wkof();

    const delay_before_installing = 500; // milliseconds
    wkof.on_pageload([
        '/subjects/extra_study',
        '/subjects/review',
        '/recent-mistakes/*/quiz'
    ], () => setTimeout(load_script, delay_before_installing));

    function load_script() {
        wkof.include('Menu,Settings');
        wkof.ready('Menu,Settings').then(setup);
    }

    let settings;
    let quiz_input, quiz_queue, additional_content, item_info, quiz_audio, quiz_stats, quiz_progress, quiz_header, response_helpers, wanakana;
    let answer_checker, answer_check, subject_stats, subject_stats_cache, session_stats;
    let old_submit_handler, ignore_submit, state, delay_timer, end_of_session_delay;
    let subject, synonyms, accepted_meanings, accepted_readings, srs_mgr;
    let qtype, new_answer_check, first_answer_check;

    function promise(){let a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}

    //------------------------------------------------------------------------
    // setup() - Set up the menu link and default settings.
    //------------------------------------------------------------------------
    let fresh_load = true;
    function setup() {
        fresh_load = true;
        wkof.Menu.insert_script_link({name:'doublecheck',submenu:'Settings',title:'Double-Check',on_click:open_settings});

        let defaults = {
            allow_retyping: true,
            allow_change_correct: false,
            show_corrected_answer: false,
            allow_change_incorrect: false,
            typo_action: 'ignore',
            wrong_answer_type_action: 'warn',
            wrong_number_n_action: 'warn',
            small_kana_action: 'warn',
            kanji_reading_for_vocab_action: 'warn',
            kanji_meaning_for_vocab_action: 'warn',
            delay_wrong: true,
            delay_multi_meaning: false,
            delay_slightly_off: false,
            delay_period: 1.5,
            warn_burn: 'never',
            burn_delay_period: 1.5,
            show_lightning_button: true,
            lightning_enabled: false,
            srs_msg_period: 1.2,
            autoinfo_correct: false,
            autoinfo_incorrect: false,
            autoinfo_multi_meaning: false,
            autoinfo_slightly_off: false,
            show_retype_button: true,
            show_change_button: true
        }
        return wkof.Settings.load('doublecheck', defaults)
            .then(init_ui);
    }

    //------------------------------------------------------------------------
    // open_settings() - Open the Settings dialog.
    //------------------------------------------------------------------------
    function open_settings() {
        let dialog = new wkof.Settings({
            script_id: 'doublecheck',
            title: 'Double-Check Settings',
            on_save: init_ui,
            pre_open: settings_preopen,
            content: {
                tabAnswers: {type:'page',label:'Answers',content:{
                    grpChangeAnswers: {type:'group',label:'Change Answer',content:{
                        allow_retyping: {type:'checkbox',label:'Allow retyping answer',default:true,hover_tip:'When enabled, you can retype your answer by pressing Escape or Backspace.',on_change:retype_setting_changed},
                        allow_change_incorrect: {type:'checkbox',label:'Allow changing to "incorrect"',default:true,hover_tip:'When enabled, you can change your answer\nto "incorrect" by pressing the "-" key.',on_change:change_setting_changed},
                        allow_change_correct: {type:'checkbox',label:'Allow changing to "correct"',default:true,hover_tip:'When enabled, you can change your answer\nto "correct" by pressing the "+" key.',on_change:change_setting_changed},
                        show_corrected_answer: {type:'checkbox',label:'Show corrected answer',default:false,hover_tip:'When enabled, pressing \'+\' to correct your answer puts the\ncorrected answer in the input field. Pressing \'+\' multiple\ntimes cycles through all acceptable answers.'},
                    }},
                    grpAnswerButtons: {type:'group',label:'Button Visibility',content:{
                        show_retype_button: {type:'checkbox',label:'Show "Retype" button',default:true,hover_tip:'When enabled, the Retype button is visible (when retyping is allowed).'},
                        show_change_button: {type:'checkbox',label:'Show "Mark Right/Wrong"',default:true,hover_tip:'When enabled, the Mark Right / Mark Wrong button is visible (when changing answer is allowed).'},
                    }},
                }},
                tabMistakeDelay: {type:'page',label:'Mistakes',content:{
                    grpCarelessMistakes: {type:'group',label:'Mistake Handling',content:{
                        typo_action: {type:'dropdown',label:'Typos in meaning',default:'ignore',content:{ignore:'Ignore',warn:'Warn/shake',wrong:'Mark wrong'},hover_tip:'Choose an action to take when meaning contains typos.'},
                        wrong_answer_type_action: {type:'dropdown',label:'Wrong answer type',default:'warn',content:{warn:'Warn/shake',wrong:'Mark wrong'},hover_tip:'Choose an action to take when reading was entered instead of meaning, or vice versa.'},
                        wrong_number_n_action: {type:'dropdown',label:'Wrong number of n\'s',default:'warn',content:{warn:'Warn/shake',wrong:'Mark wrong'},hover_tip:'Choose an action to take when you type the wrong number of n\'s in certain reading questions.'},
                        small_kana_action: {type:'dropdown',label:'Big kana instead of small',default:'warn',content:{warn:'Warn/shake',wrong:'Mark wrong'},hover_tip:'Choose an action to take when you type a big kana instead of small (e.g. ゆ instead of ゅ).'},
                        kanji_reading_for_vocab_action: {type:'dropdown',label:'Kanji reading instead of vocab',default:'warn',content:{warn:'Warn/shake',wrong:'Mark wrong'},hover_tip:'Choose an action to take when the reading of a kanji is entered for a single character vocab word instead of the correct vocab reading.'},
                        kanji_meaning_for_vocab_action: {type:'dropdown',label:'Kanji meaning instead of vocab',default:'warn',content:{warn:'Warn/shake',wrong:'Mark wrong'},hover_tip:'Choose an action to take when the meaning of a kanji is entered for a single character vocab word instead of the correct vocab meaning.'},
                    }},
                    grpDelay: {type:'group',label:'Mistake Delay',content:{
                        delay_wrong: {type:'checkbox',label:'Delay when wrong',default:true,refresh_on_change:true,hover_tip:'If your answer is wrong, you cannot advance\nto the next question for at least N seconds.'},
                        delay_multi_meaning: {type:'checkbox',label:'Delay when multiple meanings',default:false,hover_tip:'If the item has multiple meanings, you cannot advance\nto the next question for at least N seconds.'},
                        delay_slightly_off: {type:'checkbox',label:'Delay when answer has typos',default:false,hover_tip:'If your answer contains typos, you cannot advance\nto the next question for at least N seconds.'},
                        delay_period: {type:'number',label:'Delay period (in seconds)',default:1.5,hover_tip:'Number of seconds to delay before allowing\nyou to advance to the next question.'},
                    }},
                }},
                tabBurnReviews: {type:'page',label:'Burn Reviews',content:{
                    grpBurnReviews: {type:'group',label:'Burn Reviews',content:{
                        warn_burn: {type:'dropdown',label:'Warn before burning',default:'never',content:{never:'Never',cheated:'If you changed answer',always:'Always'},hover_tip:'Choose when to warn before burning an item.'},
                        burn_delay_period: {type:'number',label:'Delay after warning (in seconds)',default:1.5,hover_tip:'Number of seconds to delay before allowing\nyou to advance to the next question after seeing a burn warning.'},
                    }},
                }},
                tabLightning: {type:'page',label:'Lightning',content:{
                    grpLightning: {type:'group',label:'Lightning Mode',content:{
                        show_lightning_button: {type:'checkbox',label:'Show "Lightning Mode" button',default:true,hover_tip:'Show the "Lightning Mode" toggle\nbutton on the review screen.'},
                        lightning_enabled: {type:'checkbox',label:'Enable "Lightning Mode"',default:true,refresh_on_change:true,hover_tip:'Enable "Lightning Mode", which automatically advances to\nthe next question if you answer correctly.'},
                        srs_msg_period: {type:'number',label:'SRS popup time (in seconds)',default:1.2,min:0,hover_tip:'How long to show SRS up/down popup when in lightning mode.  (0 = don\'t show)'},
                    }},
                }},
                tabAutoInfo: {type:'page',label:'Item Info',content:{
                    grpAutoInfo: {type:'group',label:'Show Item Info',content:{
                        autoinfo_correct: {type:'checkbox',label:'After correct answer',default:false,hover_tip:'Automatically show the Item Info after correct answers.', validate:validate_autoinfo_correct},
                        autoinfo_incorrect: {type:'checkbox',label:'After incorrect answer',default:false,hover_tip:'Automatically show the Item Info after incorrect answers.', validate:validate_autoinfo_incorrect},
                        autoinfo_multi_meaning: {type:'checkbox',label:'When multiple meanings',default:false,hover_tip:'Automatically show the Item Info when an item has multiple meanings.', validate:validate_autoinfo_correct},
                        autoinfo_slightly_off: {type:'checkbox',label:'When answer has typos',default:false,hover_tip:'Automatically show the Item Info when your answer has typos.', validate:validate_autoinfo_correct},
                    }},
                }},
            }
        });
        dialog.open();
    }

    //------------------------------------------------------------------------
    // retype_setting_changed() - Enable/disable "show retype button" based on retype setting.
    //------------------------------------------------------------------------
    function retype_setting_changed(elem, name, value, item) {
        document.querySelector('#doublecheck_show_retype_button').toggleAttribute('disabled', !settings.allow_retyping);
    }

    //------------------------------------------------------------------------
    // change_setting_changed() - Enable/disable "show mark right/wrong" based on change setting.
    //------------------------------------------------------------------------
    function change_setting_changed() {
        document.querySelector('#doublecheck_show_change_button').toggleAttribute('disabled', !(settings.allow_change_correct || settings.allow_change_incorrect));
    }

    //------------------------------------------------------------------------
    // validate_autoinfo_correct() - Notify user if iteminfo and lightning are both enabled.
    //------------------------------------------------------------------------
    function validate_autoinfo_correct(enabled) {
        if (enabled && settings.lightning_enabled) {
            return 'Disable "Lightning Mode"!';
        }
    }

    //------------------------------------------------------------------------
    // validate_autoinfo_incorrect() - Notify user if iteminfo and lightning are both enabled, and wrong_delay disabled.
    //------------------------------------------------------------------------
    function validate_autoinfo_incorrect(enabled) {
        if (enabled && settings.lightning_enabled && !settings.delay_wrong) {
            return 'Disable "Lightning Mode", or<br>enable "Delay when wrong"!';
        }
    }

    //------------------------------------------------------------------------
    // settings_preopen() - Notify user if iteminfo and lightning are both enabled.
    //------------------------------------------------------------------------
    function settings_preopen(dialog) {
        dialog.dialog({width:525});
        dialog.find('#doublecheck_show_retype_button').prop('disabled', !settings.allow_retyping);
        dialog.find('#doublecheck_show_change_button').prop('disabled', !(settings.allow_change_incorrect || settings.allow_change_incorrect));
    }

    function insert_icons() {
		if (!document.getElementById('wk-icon__lightning')) {
			let svg = document.querySelector('svg symbol[id^="wk-icon"]').closest('svg');
			svg.insertAdjacentHTML('beforeend','<symbol id="wk-icon__lightning" viewport="0 0 500 500"><path d="M160,12L126,265L272,265L230,488L415,170L270,170L320,12Z"></path></symbol>');
		}
	}

    //------------------------------------------------------------------------
    // init_ui() - Initialize the user interface.
    //------------------------------------------------------------------------
    async function init_ui() {
        settings = wkof.settings.doublecheck;

        if (fresh_load) {
            fresh_load = false;
            await startup();
        }

        // Migrate 'lightning' setting from localStorage.
        let lightning = localStorage.getItem('lightning');
        if (lightning === 'false' || lightning === 'true') {
            localStorage.removeItem('lightning');
            settings.lightning_enabled = lightning;
            wkof.Settings.save('doublecheck');
        }

        insert_icons();

        // Initialize the Lightning Mode button.
        let lightning_icon = document.querySelector('#lightning-mode');
        if (lightning_icon) {
            lightning_icon.classList.toggle('doublecheck-active', settings.lightning_enabled);
            lightning_icon.hidden = !settings.show_lightning_button;
        }

        let rightwrong_btn = document.querySelector('#option-toggle-rightwrong');
        if (rightwrong_btn) rightwrong_btn.classList.toggle('hidden', !((settings.allow_change_correct || settings.allow_change_incorrect) && settings.show_change_button));
        let retype_btn = document.querySelector('#option-retype');
        if (retype_btn) retype_btn.classList.toggle('hidden', !(settings.allow_retyping && settings.show_retype_button));
        resize_buttons();

        additional_content = get_controller('additional-content');
        if (state === 'second_submit') {
            if (rightwrong_btn) {
                rightwrong_btn.querySelector('a').classList.toggle(additional_content.toggleDisabledClass, !(
                    (new_answer_check.passed && (settings.allow_change_incorrect || !first_answer_check.passed)) ||
                    (!new_answer_check.passed && (settings.allow_change_correct || first_answer_check.passed))
                ));
            }
            if (retype_btn) {
                retype_btn.querySelector('a').classList.toggle(additional_content.toggleDisabledClass, !settings.allow_retyping);
            }
        } else {
            if (rightwrong_btn) {
                rightwrong_btn.querySelector('a').classList.add(additional_content.toggleDisabledClass);
            }
        }
    }

    //------------------------------------------------------------------------
    // lightning_clicked() - Lightning button handler.
    //------------------------------------------------------------------------
    function lightning_clicked(e) {
        e.preventDefault();
        settings.lightning_enabled = !settings.lightning_enabled;
        wkof.Settings.save('doublecheck');
        document.querySelector('#lightning-mode').classList.toggle('doublecheck-active', settings.lightning_enabled);
        return false;
    }

    //------------------------------------------------------------------------
    // get_correct_answers() - Returns an array of acceptable answers.
    //------------------------------------------------------------------------
    function get_correct_answers() {
        if (qtype === 'reading') {
            if (subject.type === 'Kanji') {
                return subject.readings.filter((r) => r.type == subject.primary_reading_type).map((r) => r.text);
            } else {
                return [].concat(
                    subject.readings.map((r) => r.text),
                ).filter((r) => typeof r === 'string');
            }
        } else {
            return [].concat(
                synonyms,
                subject.meanings.map((m) => m.text),
            ).filter((m) => typeof m === 'string');
        }
    }

    //------------------------------------------------------------------------
    // get_next_correct_answer() - Returns the next acceptable answer from the
    //    array returned by get_correct_answers().
    //------------------------------------------------------------------------
    function get_next_correct_answer() {
        let result = first_answer_check.correct_answers[first_answer_check.correct_answer_index];
        first_answer_check.correct_answer_index = (first_answer_check.correct_answer_index + 1) % first_answer_check.correct_answers.length;
        return result;
    }

    //------------------------------------------------------------------------
    // toggle_result() - Toggle an answer from right->wrong or wrong->right.
    //------------------------------------------------------------------------
    function toggle_result(new_state) {
        if (new_state === 'toggle') new_state = (new_answer_check.passed ? 'incorrect' : 'correct');
        if (state !== 'second_submit') return false;

        let input = quiz_input.inputTarget;
        let current_state = (quiz_input.inputContainerTarget.getAttribute('correct') === 'true' ? 'correct' : 'incorrect');
        let answer_to_show, answer_to_grade;
        clear_delay();
        switch (new_state) {
            case 'correct':
                if (!settings.allow_change_correct) {
                    if (!first_answer_check.passed) return;
                    answer_to_grade = first_answer_check.answer;
                    answer_to_show = answer_to_grade;
                } else if (current_state === 'correct') {
                    answer_to_grade = get_next_correct_answer();
                    answer_to_show = answer_to_grade;
                } else {
                    first_answer_check.correct_answer_index = 0;
                    answer_to_grade = get_next_correct_answer();
                    answer_to_show = (settings.show_corrected_answer ? answer_to_grade : first_answer_check.answer);
                }
                input.value = answer_to_grade;
                new_answer_check = {
                    action:'pass',
                    message:null,
                    passed:true,
                    accurate:true,
                    multipleAnswers:false,
                    exception:false,
                    answer:answer_to_grade
                };
                set_answer_state(new_answer_check);
                input.value = answer_to_show;
                break;
            case 'incorrect':
                if (!settings.allow_change_incorrect) {
                    if (first_answer_check.passed) return;
                    answer_to_show = first_answer_check.answer;
                } else {
                    answer_to_show = (settings.show_corrected_answer ? 'xxxxxx' : first_answer_check.answer);
                }
                answer_to_grade = 'xxxxxx';
                input.value = answer_to_grade;
                new_answer_check = {
                    action:'fail',
                    message:{
                        type:'itemInfoException',
                        text:`Need help? View the correct ${qtype} and mnemonic.`
                    },
                    passed:false,
                    accurate:false,
                    multipleAnswers:false,
                    exception:false,
                    answer:answer_to_grade
                };
                set_answer_state(new_answer_check);
                input.value = answer_to_show;
                break;
            case 'retype':
                if (!settings.allow_retyping) return false;
                set_answer_state({reset:true, retype:true, unanswer:true});
                break;
        }
    }

    //------------------------------------------------------------------------
    // do_delay() - Disable the submit button briefly to prevent clicking past wrong answers.
    //------------------------------------------------------------------------
    function do_delay(period) {
        if (period === undefined) period = settings.delay_period;
        ignore_submit = true;
        delay_timer = setTimeout(function() {
            delay_timer = -1;
            ignore_submit = false;
        }, period*1000);
    }

    //------------------------------------------------------------------------
    // clear_delay() - Clear the delay timer.
    //------------------------------------------------------------------------
    function clear_delay() {
        if (delay_timer) {
            ignore_submit = false;
            clearTimeout(delay_timer);
            delay_timer = undefined;
        }
    }

    //------------------------------------------------------------------------
    function show_exception(message) {
        if (typeof message !== 'string') return;
        quiz_input.exceptionTarget.textContent = message;
        quiz_input.exceptionContainerTarget.hidden = false;
    }

    //------------------------------------------------------------------------
    function hide_exception() {
        quiz_input.exceptionContainerTarget.hidden = true;
        quiz_input.exceptionTarget.textContent = '';
    }

    //------------------------------------------------------------------------
    function set_answer_state(results, final_submit) {
        quiz_stats = get_controller('quiz-statistics');
        quiz_queue = get_controller('quiz-queue');
        additional_content = get_controller('additional-content');
        item_info = get_controller('item-info');
        quiz_progress = get_controller('quiz-progress');
        quiz_audio = get_controller('quiz-audio');
        quiz_header = get_controller('quiz-header');
        if (!final_submit) {
            if (results.exception) {
                quiz_input.shakeForm();
                show_exception(answer_check.exception);
                quiz_input.inputEnabled = true;
                quiz_input.inputTarget.focus();
                return;
            }
            let rightwrong = document.querySelector('#option-toggle-rightwrong a');
            let rightwrong_text = rightwrong.querySelector('.additional-content__item-text');
            let rightwrong_icon = rightwrong.querySelector('svg');
            let retype = document.querySelector('#option-retype a');
            if (!results.passed || (results.reset === true)) {
                rightwrong.classList.toggle(additional_content.toggleDisabledClass, (results.reset === true) || !(settings.allow_change_correct || first_answer_check.passed));
                rightwrong_text.innerText = 'Mark Right';
                rightwrong_icon.classList.remove('dblchk--invert');
            } else {
                rightwrong.classList.toggle(additional_content.toggleDisabledClass, (results.reset === true) || !(settings.allow_change_incorrect || !first_answer_check.passed));
                rightwrong_text.innerText = 'Mark Wrong';
                rightwrong_icon.classList.add('dblchk--invert');
            }
            retype.classList.toggle(additional_content.toggleDisabledClass, (results.reset === true));

            if (results.reset) {
                additional_content.close();
                item_info.disable();
                quiz_audio.playButtonTarget.classList.add(quiz_audio.disabledClass)
                quiz_input.inputContainerTarget.removeAttribute('correct');
                quiz_input.inputTarget.value = '';
                quiz_input.inputChars = '';
                if (results.unanswer) window.dispatchEvent(new CustomEvent('didUnanswerQuestion'));
                quiz_input.inputEnabled = true;
                quiz_input.inputTarget.focus();

                quiz_stats.completeCountTarget.innerText = session_stats.complete.toString();
                quiz_stats.remainingCountTarget.innerText = session_stats.remaining.toString();
                let percent_complete = Math.round(100*session_stats.complete/(session_stats.complete + session_stats.remaining));
                quiz_progress.updateProgress({detail:{percentComplete:percent_complete}});
                quiz_stats.percentCorrectTarget.innerText = (session_stats.answered ? Math.round(100 * session_stats.correct / session_stats.answered).toString() + '%' : '100%');
                if (quiz_header.hasSrsContainerTarget) quiz_header.srsContainerTarget.dataset.hidden = true;
                state = 'first_submit';
                return;
            }
            quiz_input.inputEnabled = false;
            quiz_input.inputContainerTarget.setAttribute('correct', results.passed);
        }

        subject_stats = JSON.parse(subject_stats_cache.get(subject.id) || JSON.stringify({
            meaning:{
                incorrect:0,
                complete:false
            },
            reading:{
                incorrect:0,
                complete:(['Radical','KanaVocabulary'].indexOf(quiz_input.currentSubject.type) >= 0)
            }
        }));
        if (results.passed) {
            subject_stats[quiz_input.currentQuestionType].complete = true;
        } else {
            subject_stats[quiz_input.currentQuestionType].incorrect++;
        }
        if (final_submit) {
            subject_stats_cache.set(subject.id, JSON.stringify(subject_stats));
        }

        if (session_stats.remaining == null) {
            session_stats = {
                complete: 0,
                remaining: Number(quiz_stats.remainingCountTarget.innerText),
                correct: 0,
                answered: 0
            }
        }
        let temp_session_stats = Object.assign({}, session_stats);
        temp_session_stats.answered++;
        if (results.passed) temp_session_stats.correct++;
        if (subject_stats.meaning.complete && subject_stats.reading.complete) {
            temp_session_stats.complete++;
            temp_session_stats.remaining--;
        }
        end_of_session_delay = false;
        if (final_submit) {
            Object.assign(session_stats, temp_session_stats);
            if (session_stats.remaining === 0) end_of_session_delay = true;
        } else {
            quiz_stats.completeCountTarget.innerText = temp_session_stats.complete.toString();
            quiz_stats.remainingCountTarget.innerText = temp_session_stats.remaining.toString();
            let percent_complete = Math.round(100*temp_session_stats.complete/(temp_session_stats.complete + temp_session_stats.remaining));
            quiz_progress.updateProgress({detail:{percentComplete:percent_complete}});
            quiz_stats.percentCorrectTarget.innerText = Math.round(100 * temp_session_stats.correct / temp_session_stats.answered).toString() + '%';

            quiz_stats.disconnect();
            let event = {detail:{
                subjectWithStats:{subject:subject,stats:subject_stats},
                questionType:quiz_input.currentQuestionType,
                answer:quiz_input.inputTarget.value,
                results:results
            }};
            window.dispatchEvent(new CustomEvent('didAnswerQuestion',event));
            quiz_stats.connect();

            if (subject_stats.meaning.complete && subject_stats.reading.complete) {
                if (srs_mgr && !(settings.lightning_enabled && answer_check.passed)) {
                    srs_mgr.updateSRS({subject:subject,stats:subject_stats});
                }
            } else {
                if (quiz_header.hasSrsContainerTarget) quiz_header.srsContainerTarget.dataset.hidden = true;
            }

            if ((results.passed && settings.autoinfo_correct && !settings.lightning_enabled) ||
                (!results.passed && settings.autoinfo_incorrect) ||
                (results.passed && results.multipleAnswers && settings.autoinfo_multi_meaning && !settings.lightning_enabled) ||
                (results.passed && !results.accurate && settings.autoinfo_slightly_off && !settings.lightning_enabled))
            {
                item_info.toggleTarget.click();
                if (results.passed) item_info.showException(qtype,results)
            }
        }
    }

    //------------------------------------------------------------------------
    // new_submit_handler() - Intercept handler for 'submit' button.  Overrides default behavior as needed.
    //------------------------------------------------------------------------
    function new_submit_handler(e) {
        // Don't process 'submit' if we are ignoring temporarily (to prevent double-tapping past important info)
        if (ignore_submit) return;

        hide_exception();

        let input = quiz_input.inputTarget;
        qtype = quiz_input.currentQuestionType;
        subject = quiz_input.currentSubject;

        let submitted_immediately = false;
        switch (state) {
            case 'first_submit': {
                // We intercept the first 'submit' click, and simulate normal Wanikani screen behavior.

                // Do WK's standard checks for shake.
                let answer = quiz_input.inputTarget.value.trim();
                if (qtype === 'reading') {
                    answer = response_helpers.normalizeReadingResponse(answer);
                    input.value = answer;
                }
                if (!response_helpers.questionTypeAndResponseMatch(qtype, answer) || (answer.length === 0)) {
                    quiz_input.shakeForm();
                    quiz_input.inputEnabled = true;
                    quiz_input.inputTarget.focus();
                    return;
                }

                quiz_input.inputEnabled = false;
                quiz_input.lastAnswer = answer;

                // Do WK's standard answer evaluation.
                synonyms = quiz_input.quizUserSynonymsOutlet.synonymsForSubjectId(subject.id);
                answer_check = answer_checker.evaluate({questionType:qtype, response:answer, item:subject, userSynonyms:synonyms, inputChars:quiz_input.inputChars});
                if (answer_check.hasOwnProperty('action')) {
                    if (answer_check.action === 'retry') {
                        answer_check.passed = false;
                        answer_check.accurate = false;
                        answer_check.multipleAnswers = false;
                        answer_check.exception = answer_check.message.text;
                    } else {
                        answer_check.passed = (answer_check.action === 'pass');
                        if (answer_check.message === null) {
                            answer_check.accurate = true;
                            answer_check.multipleAnswers = false;
                            answer_check.exception = false;
                        } else if (/has multiple/.test(answer_check.message.text)) {
                            answer_check.accurate = true;
                            answer_check.multipleAnswers = true;
                            answer_check.exception = false;
                        } else if (/one of your synonyms/.test(answer_check.message.text)) {
                            answer_check.accurate = false;
                            answer_check.multipleAnswers = false;
                            answer_check.exception = answer_check.message.text;
                        } else if (/a bit off/.test(answer_check.message.text)) {
                            answer_check.accurate = false;
                            answer_check.multipleAnswers = false;
                            answer_check.exception = false;
                        }
                    }
                }

                // Process typos according to settings.
                if (answer_check.passed && !answer_check.accurate) {
                    switch (settings.typo_action) {
                        case 'warn': answer_check.exception = 'Your answer was close, but not exact'; break;
                        case 'wrong': answer_check.passed = false; answer_check.custom_msg = 'Your answer was not exact, as required by your settings.'; break;
                    }
                }

                // Process answer-type errors according to settings.
                if (!answer_check.passed) {
                    if (qtype === 'meaning') {
                        // Although Wanikani checks for readings entered as meanings, it only
                        // checks the 'preferred' reading.  Here, we check all readings.
                        if (subject.type === 'KanaVocabulary') {
                            accepted_readings = [subject.characters];
                        } else {
                            accepted_readings = [].concat(
                                subject.readings?.map((r)=>r.reading),
//                                subject.auxiliary_readings?.filter((r)=>r.type==='whitelist').map((r)=>r.reading),
                                subject.onyomi,
                                subject.kunyomi,
                                subject.nanori
                            );
                        }
                        let answer_as_kana = to_kana(answer);
                        if (accepted_readings.indexOf(answer_as_kana) >= 0) {
                            if (settings.wrong_answer_type_action === 'warn') {
                                answer_check.exception = answer_check.exception || 'Oops, we want the meaning, not the reading.';
                            } else {
                                answer_check.exception = false;
                            }
                        }
                    } else {
                        accepted_meanings = [].concat(
                            subject.meanings,
//                            subject.auxiliary_meanings?.filter((r)=>r.type==='whitelist').map((r)=>r.meaning),
                            synonyms
                        ).filter((s) => typeof s === 'string').map((s) => s.trim().toLowerCase().replace(/\s\s+/g,' '));
                        let meanings_as_hiragana = accepted_meanings.map(m => to_kana(m));
                        let answer_as_hiragana = Array.from(answer.toLowerCase()).map(c => wanakana.toHiragana(c)).join('');
                        if (meanings_as_hiragana.indexOf(answer_as_hiragana) >= 0) {
                            if (settings.wrong_answer_type_action === 'warn') {
                                answer_check.exception = 'Oops, we want the reading, not the meaning.';
                            } else {
                                answer_check.exception = false;
                            }
                        }
                    }
                }

                // Process all other exceptions according to settings.
                if (typeof answer_check.exception === 'string') {
                    if (((settings.kanji_meaning_for_vocab_action === 'wrong') && answer_check.exception.toLowerCase().includes('want the vocabulary meaning, not the kanji meaning')) ||
                        ((settings.kanji_reading_for_vocab_action === 'wrong') && answer_check.exception.toLowerCase().includes('want the vocabulary reading, not the kanji reading')) ||
                        ((settings.wrong_number_n_action === 'wrong') && answer_check.exception.toLowerCase().includes('forget that ん')) ||
                        ((settings.small_kana_action === 'wrong') && answer_check.exception.toLowerCase().includes('watch out for the small')))
                    {
                        answer_check.exception = false;
                        answer_check.passed = false;
                    }
                }

                // Remain in 'first_submit' if there was an exceptions.
                if (answer_check.exception) {
                    set_answer_state(answer_check);
                    return false;
                }
                state = 'second_submit';

                new_answer_check = Object.assign({answer:answer}, answer_check);
                first_answer_check = Object.assign({
                    answer:answer,
                    correct_answers:get_correct_answers(),
                    correct_answer_index: 0,
                }, answer_check);

                // Process "Mistake Delay" according to settings.
                if ((!answer_check.passed && settings.delay_wrong) ||
                    (answer_check.passed &&
                     ((!answer_check.accurate && settings.delay_slightly_off) ||
                      (answer_check.multipleAnswers && settings.delay_multi_meaning))
                    )
                   )
                {
                    set_answer_state(new_answer_check);
                    do_delay();
                    return false;
                }

                set_answer_state(answer_check);

                // Process lightning mode according to settings.
                if (settings.lightning_enabled && answer_check.passed) {
                    new_submit_handler(e);
                    return false;
                }

                return false;
            }
            case 'second_submit': {
                // We intercepted the first submit, allowing the user to optionally modify their answer.
                // Now, either the user has clicked submit again, or lightning is enabled and we are automatically clicking submit again.

                let answer = new_answer_check.answer;
                input.value = answer;
                set_answer_state(new_answer_check, true /* final_submit */);
                delete new_answer_check.answer;

                // Nasty hack to prevent audio from playing twice or stopping upon next question.
                let audio = quiz_audio.audioTarget;
                audio.setAttribute('data-quiz-audio-target', 'noplay');
                audio.insertAdjacentHTML('afterend', '<audio class="quiz-audio__audio dblchk" data-quiz-audio-target="audio"></audio>');
                let tmp_audio = document.querySelector('audio.dblchk');
                quiz_audio.disconnect();

                function dispatch_didFinalAnswer(e) {
                    window.dispatchEvent(new CustomEvent('didFinalAnswer',{detail:e.detail}));
                    window.removeEventListener('didAnswerQuestion', dispatch_didFinalAnswer);
                }
                window.addEventListener('didAnswerQuestion', dispatch_didFinalAnswer);
                quiz_queue.submitAnswer(answer, new_answer_check);

                // Nasty audio hack, continued.
                setTimeout(() => {
                    tmp_audio.remove();
                    audio.setAttribute('data-quiz-audio-target', 'audio');
                    quiz_audio.connect();
                }, 1);

                if (end_of_session_delay) {
                    setTimeout(next_item, 500);
                } else {
                    next_item();
                }

                function next_item() {
                    quiz_queue.nextItem();
                    set_answer_state({reset:true, unanswer:false});

                    quiz_header = get_controller('quiz-header');
                    if (quiz_header.hasSrsContainerTarget && settings.lightning_enabled && new_answer_check.passed &&
                        subject_stats.meaning.complete && subject_stats.reading.complete && srs_mgr) {
                        setTimeout(() => {
                            srs_mgr.updateSRS({subject:subject,stats:subject_stats});
                            setTimeout(()=>{
                                quiz_header.srsContainerTarget.dataset.hidden = true;
                            }, 1000 * settings.srs_msg_period);
                        }, 1);
                    }

                    state = 'first_submit';
                }
                return false;
            }
            default:
                return false;
        }

        return false;
    }

    //------------------------------------------------------------------------
    // Simulate input character by character and convert with WanaKana to kana
    //  -- Contributed by user @Sinyaven
    //------------------------------------------------------------------------
    function to_kana(text) {
        return Array.from(text).reduce((total, c) => wanakana.toKana(total + c, {IMEMode: true}), "").replace(/n$/, String.fromCharCode(12435));
    }

    //------------------------------------------------------------------------
    // Resize the buttons according to how many are visible.
    //------------------------------------------------------------------------
    function resize_buttons() {
        let buttons = Array.from(document.querySelectorAll('#additional-content .additional-content__menu-item'));
        let visible_buttons = buttons.filter((elem)=>!elem.matches('.hidden,[hidden]'));
        let btn_count = visible_buttons.length;
        for (let btn of visible_buttons) {
            let percent = Math.floor(10000/btn_count)/100 + '%';
            btn.style.width = `calc(${percent} - 10px)`;
            btn.style.flex = `0 0 calc(${percent} - 10px)`;
            btn.style.marginRight = '10px';
        }
        visible_buttons.slice(-1)[0].style.marginRight = '0px';
    }

    //------------------------------------------------------------------------
    // External hook for @polv's script, "WaniKani Disable Default Answers"
    //------------------------------------------------------------------------
    gobj.set_state = function(_state) {
        state = _state;
    };

    function get_controller(name) {
        return Stimulus.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="${name}"]`),name);
    }

    //------------------------------------------------------------------------
    // startup() - Install our intercept handlers, and add our Double-Check button and hotkey
    //------------------------------------------------------------------------
    async function startup() {
        // Intercept the submit button handler.
        let p = promise();
        quiz_input = undefined;
        quiz_queue = undefined;
        additional_content = undefined;
        item_info = undefined;
        quiz_audio = undefined;
        quiz_stats = undefined;
        quiz_progress = undefined;
        quiz_header = undefined;
        answer_checker = undefined;

        async function get_controllers() {
            try {
                // Check if all of our hooks into WK are valid, just in case something changed.
                if (!quiz_input) {
                    quiz_input = get_controller('quiz-input');
                    if (!quiz_input) throw 'Controller "quiz-input" not found.';
                }
                if (!quiz_queue) {
                    quiz_queue = get_controller('quiz-queue');
                    if (!quiz_queue) throw 'Controller "quiz-queue" not found.';
                }
                if (!additional_content) {
                    additional_content = get_controller('additional-content');
                    if (!additional_content) throw 'Controller "additional-content" not found.';
                }
                if (!item_info) {
                    item_info = get_controller('item-info');
                    if (!item_info) throw 'Controller "item-info" not found.';
                }
                if (!quiz_audio) {
                    quiz_audio = get_controller('quiz-audio');
                    if (!quiz_audio) throw 'Controller "quiz-audio" not found.';
                }
                if (!quiz_stats) {
                    quiz_stats = get_controller('quiz-statistics');
                    if (!quiz_stats) throw 'Controller "quiz-statistics" not found.';
                }
                if (!quiz_progress) {
                    quiz_progress = get_controller('quiz-progress');
                    if (!quiz_progress) throw 'Controller "quiz-progress" not found.';
                }
                if (!quiz_header) {
                    quiz_header = get_controller('quiz-header');
                    if (!quiz_header) throw 'Controller "quiz-header" not found.';
                }
                if (!response_helpers) {
                    response_helpers = await importShim('lib/answer_checker/utils/response_helpers');
                    if (!response_helpers) throw 'Import "lib/answer_checker/utils/response_helpers" failed.';
                }
                if (!wanakana) {
                    wanakana = await importShim('wanakana');
                    if (!wanakana) throw 'Import "wanakana" failed.';
                }
                if (!answer_checker) answer_checker = Stimulus.controllers.find((c)=>c.answerChecker)?.answerChecker;
                if (!answer_checker) {
                    let AnswerChecker = (await importShim('lib/answer_checker/answer_checker')).default;
                    if (!AnswerChecker) throw 'Import "lib/answer_checker/answer_checker" failed.';
                    answer_checker = new AnswerChecker;
                }
                if (quiz_queue.hasSubjectIdsWithSRSTarget) {
                    srs_mgr = quiz_queue.quizQueue.srsManager;
                } else {
                    srs_mgr = undefined;
                }

                if (quiz_input.submitAnswer !== new_submit_handler) {
                    old_submit_handler = quiz_input.submitAnswer;
                    quiz_input.submitAnswer = new_submit_handler;
                }

                p.resolve();
            } catch(err) {
                console.log('Double-Check:', err, ' Retrying...');
                setTimeout(get_controllers, 250);
            }
            return p;
        }

        await get_controllers();

        subject_stats_cache = new Map();
        session_stats = {};
        state = 'first_submit';
        ignore_submit = false;

        // Install the Lightning Mode button.
        let scripts_menu = document.getElementById('scripts-menu');

        // Insert CSS
        document.head.insertAdjacentHTML('beforeend',
            `<style name="doublecheck">
            #lightning-mode.doublecheck-active svg {fill:#ff0; opacity:1.0;}
            .wk-icon--thumbs-up.dblchk--invert {transform:scaleY(-1);}
            </style>`
        );

        // Insert lightning button
        scripts_menu.insertAdjacentHTML('afterend',
            `<div id="lightning-mode" class="character-header__menu-navigation-link" hidden>
                <a class="lightning-mode summary-button" href="#" title="Lightning Mode - When enabled, auto-\nadvance after answering correctly.">
                    <svg class="wk-icon wk-icon--lightning" title="Mark Right" viewBox="0 0 500 500" aria-hidden="true">
                        <use href="#wk-icon__lightning"></use>
                    </svg>
                </a>
            </div>`
        );
        document.querySelector('.lightning-mode').addEventListener('click', lightning_clicked);

        // Install the Double-Check features.
        document.querySelector('#additional-content ul').style.textAlign = 'center';
        document.querySelector('#additional-content ul').insertAdjacentHTML('beforeend',
            `<li id="option-toggle-rightwrong" class="additional-content__menu-item additional-content__menu-item--5">
                <a title="Mark Right" class="additional-content__item ${additional_content.toggleDisabledClass}">
                    <div class="additional-content__item-text">Mark Right</div>
                    <div class="additional-content__item-icon-container">
                        <svg class="wk-icon wk-icon--thumbs-up" title="Mark Right" viewBox="0 0 512 512" aria-hidden="true">
                            <use href="#wk-icon__thumbs-up"></use>
                        </svg>
                    </div>
                </a>
            </li>
            <li id="option-retype" class="additional-content__menu-item additional-content__menu-item--5">
                <a title="Retype" class="additional-content__item ${additional_content.toggleDisabledClass}">
                    <div class="additional-content__item-text">Re-type</div>
                    <div class="additional-content__item-icon-container">
                        <svg class="wk-icon wk-icon--reload" title="Re-type Answer" viewBox="0 0 512 512" aria-hidden="true">
                            <use href="#wk-icon__reload"></use>
                        </svg>
                    </div>
                </a>
            </li>`
        );
        document.querySelector('#option-toggle-rightwrong').addEventListener('click', toggle_result.bind(null,'toggle'));
        document.querySelector('#option-retype').addEventListener('click', toggle_result.bind(null,'retype'));
        let input = quiz_input.inputTarget;
        document.body.addEventListener('keypress', handle_rightwrong_hotkey);
        function handle_rightwrong_hotkey(event){
            if (state !== 'first_submit') {
                if (!document.querySelector('#wkofs_doublecheck') && (event.target === input || event.target === document.body)) {
                    if (event.which === 43) {
                        toggle_result('correct');
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    if (event.which === 45) {
                        toggle_result('incorrect');
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
        };
        document.body.addEventListener('keydown', handle_retype_hotkey);
        function handle_retype_hotkey(event){
            if (state !== 'first_submit') {
                if (!document.querySelector('#wkofs_doublecheck') && (event.target === input || event.target === document.body)) {
                    if ((event.which === 27 || event.which === 8)) {
                        toggle_result('retype');
                        event.preventDefault();
                        event.stopPropagation();
                    } else if (event.ctrlKey && event.key === 'l') {
                        event.preventDefault();
                        event.stopPropagation();
                        lightning_clicked();
                    }
                }
            }
        };

        document.head.insertAdjacentHTML('beforeend',
            `<style>
            #additional-content>ul>li.hidden {display:none;}
            #answer-form fieldset.confburn button, #answer-form fieldset.confburn input[type=text], #answer-form fieldset.confburn input[type=text]:disabled {
              background-color: #000 !important;
              color: #fff;
              text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
              transition: background-color 0.1s ease-in;
              opacity: 1 !important;
            }
            </style>`
        );
    }

})(window.doublecheck);
