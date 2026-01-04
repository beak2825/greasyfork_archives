// ==UserScript==
// @name         Wanikani Anki Mode
// @namespace    wkankimode
// @version      3.0.12
// @description  Anki mode for Wanikani; DoubleCheck 3.0 Support;
// @author       JDurman
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/437009/Wanikani%20Anki%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/437009/Wanikani%20Anki%20Mode.meta.js
// ==/UserScript==

//CREDITS
//Based on original Wanikani Anki Mode script by Mempo and modifications by necul and irrelephant
//Templated the script off of the doublecheck script made by Robin Findley (rfindley).



window.ankimode = {};

(function (gobj) {
    var script_name = 'AnkiMode';
    var wkof_version_needed = '1.1.3';
    var scriptLoading = false;



    /* globals Stimulus, wkof */

    const match_patterns = [
        '/subjects/review',
        '/subject-lessons/*/quiz',
        '/subjects/lesson/quiz*',
        '/subjects/extra_study*',
        '/recent-mistakes/*/quiz',

    ];
    function url_matches(patterns, url) { patterns = patterns || match_patterns; url = url || window.location.pathname; if (url[0] !== '/') url = new URL(url).pathname; return ((Array.isArray(patterns) ? patterns : [patterns]).findIndex((pattern) => { let regex = new RegExp(pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*')); return (regex.test(url)); }) >= 0); }
    function is_turbo_page() { return (document.querySelector('script[type="importmap"]')?.innerHTML.match('@hotwired/turbo') != null); }
    function get_controller(name) { return Stimulus.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="${name}"]`), name); }

    if (is_turbo_page()) {
        try { app_load(); } catch (e) { }
        try { document.documentElement.addEventListener('turbo:load', page_load); } catch (e) { }
        try { document.documentElement.addEventListener('turbo:before-render', before_page_render); } catch (e) { }
        try { document.documentElement.addEventListener('turbo:frame-load', frame_load); } catch (e) { }
        try { document.documentElement.addEventListener('turbo:before-frame-render', before_frame_render); } catch (e) { }
    } else {
        try { app_load(); } catch (e) { }
        try { page_load({ detail: { url: window.location.href }, target: document.documentElement }); } catch (e) { }
        try { frame_load({ target: document.documentElement }); } catch (e) { }
    }

    function app_load() {
        if (!url_matches(match_patterns)) return;
        // Do stuff here that only needs to run when Stimulus first starts.
        load_script();
    }
    function page_load() {
        if (!url_matches(match_patterns)) return;
        // Do stuff here that needs to be done each time a particular page loads.
        
        // NOTE FOR LESSON QUIZ PAGE: The Lesson Quiz page needs a delay, otherwise WK overwrites it immediately.
        setTimeout(() => {
            if(!scriptLoading){
                load_script();
            }

            wkof.Menu.insert_script_link({ name: 'ankimode', submenu: 'Settings', title: 'Anki Mode', on_click: open_settings });
        }, 1);
    }
    function frame_load() {
        if (!url_matches(match_patterns)) return;
        // Do stuff here that needs to be done each time a particular frame loads.
    }



    function load_script() {
        scriptLoading = true;
        if (!window.wkof) {
            if (confirm(script_name + ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            }
            return;
        }
        if (wkof.version.compare_to(wkof_version_needed) === 'older') {
            if (confirm(script_name + ' requires Wanikani Open Framework version ' + wkof_version_needed + '.\nDo you want to be forwarded to the update page?')) {
                window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
            }
            return;
        }
        wkof.include('Menu,Settings');
        wkof.ready('document,Menu,Settings').then(setup);
    }



    let settings;
    var answerShown = false;
    var firstCorrectAnswer = "";
    var secondNoTriggered = false;
    var ankiModeEnabled = false;
    let quiz_input, quiz_queue;
    let srs_map;
    let answer_checker;
    let typedAnswerJustSubmitted = true;



    function setup() {
        wkof.Menu.insert_script_link({ name: 'ankimode', submenu: 'Settings', title: 'Anki Mode', on_click: open_settings });

        var defaults = {
            correct_hotkey: 'Digit1',
            incorrect_hotkey: 'Digit2',
            showAnswer_hotkey: 'Space',
            doublecheck_delay_period: 1.5,
            reverse_answer_btns: false,
            type_readings: false,
            play_reading_after_showing_answer: false,
        }
        return wkof.Settings.load('ankimode', defaults).then(init_ui.bind(null, true /* first_time */));
    }

    function open_settings() {
        var dialog = new wkof.Settings({
            script_id: 'ankimode',
            title: 'Anki Mode Settings',
            on_save: init_ui,
            pre_open: settings_preopen,
            content: {
                tabHotkeys: {
                    type: 'page', label: 'Hotkeys', content: {
                        grpHotkeys: {
                            type: 'group', label: 'Hotkeys', content: {
                                correct_hotkey: { type: 'text', label: 'Marks answer correct', default: 'Digit1', placeholder: 'Please press the desired key' },
                                incorrect_hotkey: { type: 'text', label: 'Marks answer "incorrect"', default: 'Digit2', placeholder: 'Please press the desired key' },
                                showAnswer_hotkey: { type: 'text', label: 'Shows answer', default: 'Space', placeholder: 'Please press the desired key' }
                            }
                        },
                    }
                },
                genOptions: {
                    type: 'page', label: 'Options', content: {
                        gOptions: {
                            type: 'group', label: 'Options', content: {
                                reverse_answer_btns: { type: 'checkbox', label: 'Reverse Answer Buttons', default: false, hover_tip: 'Changes the order of the correct/incorrect buttons after showing an answer.' },
                                play_reading_after_showing_answer: { type: 'checkbox', label: 'Play Audio After Showing Answer', default: false, hover_tip: 'Plays the audio of the reading after you have shown the answer.' },
                            }
                        },
                    }
                },
                tabDoubleCheckDelay: {
                    type: 'page', label: 'Double-Check Delay', content: {
                        grpDelay: {
                            type: 'group', label: 'Double-Check Delay', content: {
                                doublecheck_delay_period: { type: 'number', label: 'Delay period (in seconds)', default: 1.5, hover_tip: 'Number of seconds to delay before allowing\nyou to advance to the next question. This should match the value in the double-check settings.' },
                            }
                        },
                    }
                },
                tabExp: {
                    type: 'page', label: 'Experimental Features', content: {
                        grpDelay: {
                            type: 'group', label: 'Type Readings', content: {
                                type_readings: { type: 'checkbox', label: 'Type Readings', default: false, hover_tip: 'Makes it so that you have to type readings' },
                            }
                        },
                    }
                },
            }
        });
        dialog.open();
    }

    function formatKeyCode(value) {
        return value.replace('Digit', '').replace('Key', '');
    }

    function settings_preopen(dialog) {
        dialog.dialog({ width: 525 });
        $("#ankimode_dialog #ankimode_correct_hotkey").attr("type", 'hidden');
        $("#ankimode_dialog #ankimode_correct_hotkey").after('<input id="ankimode_correct_hotkey_readonly" class="setting" type="text" placeholder="Please press the desired key" readonly="readonly" value="' + formatKeyCode(settings.correct_hotkey) + '"></input>');
        $("#ankimode_dialog #ankimode_incorrect_hotkey").attr("type", 'hidden');
        $("#ankimode_dialog #ankimode_incorrect_hotkey").after('<input id="ankimode_incorrect_hotkey_readonly" class="setting" type="text" placeholder="Please press the desired key" readonly="readonly" value="' + formatKeyCode(settings.incorrect_hotkey) + '"></input>');
        $("#ankimode_dialog #ankimode_showAnswer_hotkey").attr("type", 'hidden');
        $("#ankimode_dialog #ankimode_showAnswer_hotkey").after('<input id="ankimode_showAnswer_hotkey_readonly" class="setting" type="text" placeholder="Please press the desired key" readonly="readonly" value="' + formatKeyCode(settings.showAnswer_hotkey) + '"></input>');

        $("#ankimode_dialog #ankimode_correct_hotkey_readonly").on('click', function () {
            $(this).val('');
            $(this).on("keydown", function (event) {
                $("#ankimode_dialog #ankimode_correct_hotkey").val(event.originalEvent.code);
                $(this).val(formatKeyCode(event.originalEvent.code)).blur();
            });
        });

        $("#ankimode_dialog #ankimode_incorrect_hotkey_readonly").on('click', function () {
            $(this).val('');
            $(this).on("keydown", function (event) {
                $("#ankimode_dialog #ankimode_incorrect_hotkey").val(event.originalEvent.code);
                $(this).val(formatKeyCode(event.originalEvent.code)).blur();

            });
        });

        $("#ankimode_dialog #ankimode_showAnswer_hotkey_readonly").on('click', function () {
            $(this).val('');
            $(this).on("keydown", function (event) {
                $("#ankimode_dialog #ankimode_showAnswer_hotkey").val(event.originalEvent.code);
                $(this).val(formatKeyCode(event.originalEvent.code)).blur();

            });
        });
    }

    var first_time = true;
    async function init_ui() {
        settings = wkof.settings.ankimode;

        if (first_time) {
            first_time = false;
            await startup();
        } else {
            settings.correct_hotkey = $("#ankimode_dialog #ankimode_correct_hotkey").val();
            settings.incorrect_hotkey = $("#ankimode_dialog #ankimode_incorrect_hotkey").val();
            settings.showAnswer_hotkey = $("#ankimode_dialog #ankimode_showAnswer_hotkey").val();

            if (!$("#WKANKIMODE_answer_input").length) {
                $('#user-response').clone().attr('id', 'WKANKIMODE_answer_input').attr('name', 'WKANKIMODE_answer_input').attr('placeholder', "Your Response").removeAttr("data-wanakana-id lang").insertAfter("#user-response").hide();

                //show spoofed input
                $('#user-response').hide();
                $('#WKANKIMODE_answer_input').show();


                $('#user-response,#WKANKIMODE_answer_input').focus(function (e) {
                    //If type reading feature is on and the question is a reading dont blur.
                    var questionType = getQuestionType();
                    if (questionType === "meaning" || !settings.type_readings) {
                        $(this).blur();
                    }
                });
                $('#user-response,#WKANKIMODE_answer_input').blur();
            }

            if (settings.type_readings) {
                newQuestion();
            } else {
                $('#user-response').hide();
                $('#WKANKIMODE_answer_input').show();
            }

            //change button order based on what order is selected.
            $("#WKANKIMODE_anki_correct").remove();
            $("#WKANKIMODE_anki_incorrect").remove();

            if (settings.reverse_answer_btns) {
                $("<div />", {
                    id: "WKANKIMODE_anki_correct",
                    title: "Shortcut: K",
                })
                    .text("Know")
                    .addClass("WKANKIMODE_button correct")
                    .on("click", answerCorrect)
                    .prependTo("#WKANKIMODE_buttons");

                $("<div />", {
                    id: "WKANKIMODE_anki_incorrect",
                    title: "Shortcut: L",
                })
                    .text("Don't know")
                    .addClass("WKANKIMODE_button incorrect")
                    .on("click", answerIncorrect)
                    .prependTo("#WKANKIMODE_buttons");

            } else {

                $("<div />", {
                    id: "WKANKIMODE_anki_incorrect",
                    title: "Shortcut: L",
                })
                    .text("Don't know")
                    .addClass("WKANKIMODE_button incorrect")
                    .on("click", answerIncorrect)
                    .prependTo("#WKANKIMODE_buttons");

                $("<div />", {
                    id: "WKANKIMODE_anki_correct",
                    title: "Shortcut: K",
                })
                    .text("Know")
                    .addClass("WKANKIMODE_button correct")
                    .on("click", answerCorrect)
                    .prependTo("#WKANKIMODE_buttons");
            }

            newQuestion();

            //wkof.Settings.save('ankimode');
        }

        // Get 'Anki Mode State' setting from localStorage.
        var ankimodestate = localStorage.getItem('ankimodestate');
        if (ankimodestate === 'false' || ankimodestate === 'true') {
            localStorage.removeItem('ankimodestate');
            settings.ankimode_enabled = ankimodestate;
            wkof.Settings.save('ankimode');
        }


        // Initialize the Anki Mode button.
        if (settings.ankimode_enabled) {
            $('#anki-mode').addClass('anki-active');
        } else {
            $('#anki-mode').removeClass('anki-active');
        }

    }


    async function startup() {
        quiz_input = get_controller('quiz-input');
        quiz_queue = get_controller('quiz-queue');
        additional_content = get_controller('additional-content');
        item_info = get_controller('item-info');
        subject_info = get_controller('subject-info');
        quiz_audio = get_controller('quiz-audio');
        quiz_stats = get_controller('quiz-statistics');
        quiz_progress = get_controller('quiz-progress');
        quiz_header = get_controller('quiz-header');
        response_helpers = await importShim('lib/answer_checker/utils/response_helpers');
        answer_checker = Stimulus.controllers.find((c) => c.answerChecker)?.answerChecker;
        if (!answer_checker) {
            let AnswerChecker = (await importShim('lib/answer_checker/answer_checker')).default;
            answer_checker = new AnswerChecker;
        }
        if (quiz_queue.hasSubjectIdsWithSRSTarget) {
            srs_mgr = quiz_queue.quizQueue.srsManager;
        } else {
            srs_mgr = undefined;
        }


        if (window.doublecheck) {
            $('head').append('<style>' + doubleCheckCssModification + '</style>');
        } else {
            $('head').append('<style>' + css + '</style>');
        }


        // Add the Anki Mode button.
        $('head').append('<style>#anki-mode.anki-active {color:#ff0; opacity:1.0;} #anki-mode { color:#fff;}</style>');
        if (settings.ankimode_enabled) {
            $('.character-header__menu-navigation').append('<a id="anki-mode" href="#" class="anki-active"><svg class="wk-icon wk-icon--star" title="Anki Mode - This allows you to turn on or off anki mode." viewBox="0 0 500 500" aria-hidden="true"><use href="#wk-icon__star"></use></svg></a>');
        } else {
            $('.character-header__menu-navigation').append('<a id="anki-mode" href="#"><svg class="wk-icon wk-icon--star" title="Anki Mode - This allows you to turn on or off anki mode." viewBox="0 0 500 500" aria-hidden="true"><use href="#wk-icon__star"></use></svg></a>');
        }
        $('#anki-mode').on('click', ankimode_clicked);

        //Add the Correct, Incorrect, and Show Answer buttons
        $("<div />", {
            id: "WKANKIMODE_buttons"
        })
            .addClass("WKANKIMODE_buttons")
            .prependTo("#additional-content");


        if (settings.reverse_answer_btns) {
            $("<div />", {
                id: "WKANKIMODE_anki_correct",
                title: "Shortcut: K",
            })
                .text("Know")
                .addClass("WKANKIMODE_button correct")
                .on("click", answerCorrect)
                .prependTo("#WKANKIMODE_buttons");

            $("<div />", {
                id: "WKANKIMODE_anki_incorrect",
                title: "Shortcut: L",
            })
                .text("Don't know")
                .addClass("WKANKIMODE_button incorrect")
                .on("click", answerIncorrect)
                .prependTo("#WKANKIMODE_buttons");

        } else {

            $("<div />", {
                id: "WKANKIMODE_anki_incorrect",
                title: "Shortcut: L",
            })
                .text("Don't know")
                .addClass("WKANKIMODE_button incorrect")
                .on("click", answerIncorrect)
                .prependTo("#WKANKIMODE_buttons");

            $("<div />", {
                id: "WKANKIMODE_anki_correct",
                title: "Shortcut: K",
            })
                .text("Know")
                .addClass("WKANKIMODE_button correct")
                .on("click", answerCorrect)
                .prependTo("#WKANKIMODE_buttons");
        }


        $("<div />", {
            id: "WKANKIMODE_anki_show",
            title: "Shortcut: Space",
        })
            .text("Show Answer")
            .addClass("WKANKIMODE_button show")
            .on("click", showAnswer)
            .prependTo("#WKANKIMODE_buttons");

        $("<div />", {
            id: "WKANKIMODE_anki_next"
        })
            .text("Next")
            .addClass("WKANKIMODE_button next")
            .on("click", nextAnswer)
            .prependTo("#WKANKIMODE_buttons");



        if (window.doublecheck) {
            $('body').on('click', '#option-retype', function (event) {
                if (settings.ankimode_enabled) {
                    newQuestion();
                }
            });
        }

        //bind the hotkeys
        bindHotkeys();

        //Start ankimode events
        settings.ankimode_enabled ? ankimode_start() : ankimode_stop();

    }

    function ankimode_clicked() {
        settings.ankimode_enabled = !settings.ankimode_enabled;
        wkof.Settings.save('ankimode');
        $('#anki-mode').toggleClass('anki-active', settings.ankimode_enabled);

        settings.ankimode_enabled ? ankimode_start() : ankimode_stop();

        return false;
    }

    function ankimode_start() {
        ankiModeEnabled = true;

        $('#user-response').clone().attr('id', 'WKANKIMODE_answer_input').attr('name', 'WKANKIMODE_answer_input').attr('placeholder', "Your Response").removeAttr("data-wanakana-id lang").insertAfter("#user-response").hide();

        //show spoofed input
        $('#user-response').hide();
        $('#WKANKIMODE_answer_input').show();

        //Reset question if review or self study. 
        window.addEventListener(`willShowNextQuestion`, newQuestion);

        $('#answer-form button').hide();
        $('#user-response,#WKANKIMODE_answer_input').focus(function (e) {
            //If type reading feature is on and the question is a reading dont blur.
            var questionType = getQuestionType();
            if (questionType === "meaning" || !settings.type_readings) {
                $(this).blur();
            }
        });
        $('#user-response,#WKANKIMODE_answer_input').blur();

        //Trigger new question to reset and check all settings for which to start on.
        newQuestion();
    }

    function ankimode_stop() {
        ankiModeEnabled = false;

        //remove event listeners
        $("#user-response").off("focus");
        $('#answer-form button').show();

        //hide anki mode buttons
        $(".WKANKIMODE_button.correct").hide();
        $(".WKANKIMODE_button.incorrect").hide();
        $(".WKANKIMODE_button.show").hide();
        $(".WKANKIMODE_button.next").hide();

        $("#user-response").focus();

        if (!($(".quiz-input__input-container[correct=true]").length === 1) && !($(".quiz-input__input-container[correct=false]").length === 1)) {
            $("#user-response").val("");
        }

        $("#WKANKIMODE_answer_input").remove();
        $('#user-response').show();
    }

    function getCurrentItem() {
        return quiz_input.currentSubject;
    }

    function getQuestionType() {
        return quiz_input.currentQuestionType;
    }

    function playAudio(reading) {
        var questionType = getQuestionType();
        if (questionType !== "meaning") {

            let readings = getCurrentItem().readings

            if (readings && readings.length > 0) {
                //grab first reading or typed reading.    
                if (settings.type_readings) {
                    reading = $("#user-response").val();
                }

                let pronunciation = readings.filter((a) => a.reading == reading);
                if (pronunciation.length > 0) {
                    let vaAudio = getRandomAudioSource(pronunciation[0].pronunciations).sources;
                    let audio = new Audio(vaAudio[0].url);
                    audio.play();
                }

            }
        }
    }

    function getRandomAudioSource(arr) {

        // get random index value
        const randomIndex = Math.floor(Math.random() * arr.length);

        // get random item
        const item = arr[randomIndex];

        return item;
    }

    //resets the state of the forms for a new question.
    function newQuestion() {
        if (ankiModeEnabled) {
            quiz_input = get_controller('quiz-input');
            quiz_audio = get_controller('quiz-audio');
            var questionType = getQuestionType();

            secondNoTriggered = false;
            typedAnswerJustSubmitted = true;
            answerShown = false;
            hideAnswerButtons();

            $("#WKANKIMODE_answer_input").attr("placeholder", $("#user-response").attr("placeholder"));

            $("#user-response").val('');
            $("#WKANKIMODE_answer_input").val('');

            

            if (settings.type_readings) {              
                if (questionType === "meaning") {
                    $('#user-response').hide();
                    $('#WKANKIMODE_answer_input').show();
                } else {
                    $("#WKANKIMODE_answer_input").hide();
                    $('#user-response').show();
                    hideButtonsForTyping();
                    $('#user-response').focus();
                }
            }
        }
    }

    function showAnswer() {
        if (!($(".quiz-input__input-container[correct=true]").length === 1) &&
            !($(".quiz-input__input-container[correct=false]").length === 1) &&
            !answerShown) {
            firstCorrectAnswer = "";
            var currentItem = getCurrentItem();
            var questionType = getQuestionType();
            if (questionType === "meaning") {
                var answer = currentItem.meanings
                   .filter(m => m.kind === 'primary' || m.kind === 'alternative')
                   .map(m => m.text)
                   .join(", ");
                let synonyms = quiz_input.quizUserSynonymsOutlet.synonymsForSubjectId(getCurrentItem().id);
                if (synonyms && synonyms.length) {
                    answer += " (" + synonyms.join(", ") + ")";
                }

                firstCorrectAnswer = currentItem.meanings[0].text;
                $("#user-response,#WKANKIMODE_answer_input").val(answer);
            } else { //READING QUESTION
                var i = 0;
                var singleAnswer = "";
                var fullAnswer = "";

                singleAnswer += currentItem.readings[0].text;
                fullAnswer = currentItem.readings.map(x => x.text).join(", ");

                firstCorrectAnswer = singleAnswer;
                $("#user-response").val(singleAnswer);

                $("#WKANKIMODE_answer_input").val(fullAnswer);
            }
            answerShown = true;
            showAnswerButtons();

            if (settings.play_reading_after_showing_answer) {
                playAudio(singleAnswer);
            }
        }
    }

    function nextAnswer() {
        if ($(".quiz-input__input-container[correct=true]").length === 1) {
            answerCorrect();
        } else if ($(".quiz-input__input-container[correct=false]").length === 1) {
            answerIncorrect();
        }
    }

    function answerCorrect() {
        // Fix for multiple answers in reading
        if (answerShown) {
            if (firstCorrectAnswer) {
                $("#user-response").val(firstCorrectAnswer);
                firstCorrectAnswer = "";
            }

            $(".quiz-input__submit-button").click();
            answerShown = false;

            //if lightning mode then move on to the next answer if not then show next button
            if ($("#lightning-mode.doublecheck-active").length == 0) {
                showNextButton();
            }

            return;
        }

        // if answer is shown, press correct hotkey one more time to go to next
        if ($(".quiz-input__input-container[correct=true]").length === 1) {
            $(".quiz-input__submit-button").click();
        }
    }

    function answerIncorrect() {
        if (answerShown) {
            var questionType = getQuestionType();
            if (questionType === 'meaning') {
                $("#user-response,#WKANKIMODE_answer_input").val('xxxxxx');
            } else {
                $("#user-response,#WKANKIMODE_answer_input").val('ばつっっっ');
            }

            $(".quiz-input__submit-button").click();
            answerShown = false;
            showNextButton();

            return;
        }

        if ($(".quiz-input__input-container[correct=false]").length === 1) {
            if (window.doublecheck) {
                if (!secondNoTriggered) {
                    secondNoTriggered = true;
                    setTimeout(function () {

                        $(".quiz-input__submit-button").click();
                        secondNoTriggered = false;

                    }, settings.doublecheck_delay_period * 1000); //needs to match the doublecheck delay period. Otherwise it wont allow the question to continue.
                }
            } else {
                $(".quiz-input__submit-button").click();
            }
        }
    }

    function hideButtonsForTyping() {
        $(".WKANKIMODE_button.correct").hide();
        $(".WKANKIMODE_button.incorrect").hide();
        $(".WKANKIMODE_button.show").hide();
        $(".WKANKIMODE_button.next").hide();
    }

    function hideAnswerButtons() {
        $(".WKANKIMODE_button.correct").hide();
        $(".WKANKIMODE_button.incorrect").hide();
        $(".WKANKIMODE_button.show").show();
        $(".WKANKIMODE_button.next").hide();
    }

    function showAnswerButtons() {
        $(".WKANKIMODE_button.correct").show();
        $(".WKANKIMODE_button.incorrect").show();
        $(".WKANKIMODE_button.show").hide();
        $(".WKANKIMODE_button.next").hide();
    }

    function showNextButton() {
        $(".WKANKIMODE_button.correct").hide();
        $(".WKANKIMODE_button.incorrect").hide();
        $(".WKANKIMODE_button.show").hide();
        $(".WKANKIMODE_button.next").show();
    }

    function bindHotkeys() {
        $('body').on("keydown", function (event) {

            if (($(".quiz").length == 1) && !$("*:focus").is("textarea, input") && settings.ankimode_enabled) {
                switch (event.keyCode) {
                    //key: enter
                    case 13:
                        if (($(".quiz-input__input-container[correct=true]").length === 1 ||
                            $(".quiz-input__input-container[correct=false]").length === 1)) {
                            if (settings.type_readings) {
                                if ($(".quiz-input__input-container[correct=false]").length === 1) {
                                    if (typedAnswerJustSubmitted == true) {
                                        typedAnswerJustSubmitted = false;
                                    } else {
                                        answerIncorrect();
                                    }
                                }

                            } else {
                                hideAnswerButtons();
                            }
                        }
                        return;
                        break;
                    case 27: //key: escape (only needed when doublecheck is active)
                        if (window.doublecheck) {
                            newQuestion();
                        }

                        return;
                        break;
                    case 8: //key: backspace (only needed when doublecheck is active)
                        if (window.doublecheck) {
                            newQuestion();
                        }
                        return;
                        break;
                    default:
                        if (settings.correct_hotkey == event.originalEvent.code) {
                            event.stopPropagation();
                            event.preventDefault();

                            answerCorrect();

                            return;
                            break;
                        } else if (settings.incorrect_hotkey == event.originalEvent.code) {
                            event.stopPropagation();
                            event.preventDefault();

                            answerIncorrect();

                            return;
                            break;
                        } else if (settings.showAnswer_hotkey == event.originalEvent.code) {
                            event.stopPropagation();
                            event.preventDefault();

                            showAnswer();

                            return;
                            break;
                        }

                        return;
                        break;
                }
            }
        });
    };

    var css = "\
#WKANKIMODE_anki { \
    background-color: #e1e1e1; \
    color: #3c3c3c; \
    margin: 0 5px; \
    width: auto; \
    padding: 6px; \
} \
#WKANKIMODE_yes { \
    background-color: #009900; \
    margin: 0 0 0 5px; \
} \
#WKANKIMODE_no { \
    background-color: #990000; \
} \
.WKANKIMODE_button { \
    width: 50%; \
    display: inline-block; \
    text-align:center; \
    font-size: 0.8125em; \
    color: #FFFFFF; \
    cursor: pointer; \
    padding: 10px 0; \
    margin-bottom: 5px; \
    border: 1px solid transparent \
} \
 .WKANKIMODE_buttons { \
    display: flex; \
    position: relative; \
    width: 100%; \
} \
.WKANKIMODE_buttons .incorrect { \
    background-color: #f03; \
} \
.WKANKIMODE_buttons .correct { \
    background-color: #88cc00; \
} \
.WKANKIMODE_buttons .show { \
background-color: #0af; \
width:100%;\
} \
.WKANKIMODE_buttons .next { \
    background-color: #363636; \
    width:100%;\
} \
#WKANKIMODE_anki.hidden { \
display: none; \
} ";


    var doubleCheckCssModification = css + "\
#answer-exception { \
top:5.9em \
} ";
})(window.ankimode);

