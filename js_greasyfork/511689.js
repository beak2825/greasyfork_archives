// ==UserScript==
// @name 		WaniKani Multiple Readings/Meanings Retention
// @namespace  	wkmrmr
// @description Require more than one Answer entry for kanji/vocab with multiple correct answers
// @match 		https://www.wanikani.com/*
// @author 		Forchuse
// @copyright 	2024, Forchuse
// @license 	MIT; http://opensource.org/licenses/MIT
// @grant 		none
// @version 0.0.1.20241007051057
// @downloadURL https://update.greasyfork.org/scripts/511689/WaniKani%20Multiple%20ReadingsMeanings%20Retention.user.js
// @updateURL https://update.greasyfork.org/scripts/511689/WaniKani%20Multiple%20ReadingsMeanings%20Retention.meta.js
// ==/UserScript==

window.mrmr = {
	debugToggle: true
}
const wkof = window.wkof;

(async function(gobj) {

	/* global wkof, Stimulus, WaniKani, importShim */

	let script_name = "Multiple Readings/Meanings Retention";
	let wkof_version_needed = '1.2.6'

	let wkof_check_result = promise();
	let wkof_check_retries = 3;

	async function check_wkof() {
		if (!window.wkof) {
			if (--wkof_check_retries >= 0) {
				setTimeout(check_wkof, 1000);
				return wkof_check_result;
			}
			if (confirm(script_name +' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
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

    //=============================================================================
    // Built-In Theme Colors
    //=============================================================================
    const themes = {
        wanikani: {
            themeName:'WaniKani', 
            themeCode: 'wanikani', 
            bgCorrectColor:'#fafafa', 
            bgIncorrectColor:'#fafafa', 
            defaultColor:'#333333', 
            correct:'#00af03', 
            incorrect:'#00af03', 
            incorrectColor:'#e42600'
        },
        dark: {
            themeName:'Dark', 
            themeCode: 'dark', 
            bgCorrectColor:'#232629', 
            bgIncorrectColor:'#232629', 
            defaultColor:'#fdfdfd', 
            correct:'#00af03', 
            incorrect:'#00af03', 
            incorrectColor:'#e42600'
        },
        colorful: {
            themeName:'Colorful', 
            themeCode: 'colorful', 
            bgCorrectColor:'#0c7500', 
            bgIncorrectColor:'#c41300', 
            defaultColor:'#000000', 
            correct:'#1aff00', 
            incorrect:'#1aff00', 
            incorrectColor:'#ffffff'
        },
        cbLight: {
            themeName:'Colorblind Light', 
            themeCode: 'cbLight', 
            bgCorrectColor:'#fafafa', 
            bgIncorrectColor:'#fafafa', 
            defaultColor:'#333333', 
            correct:'#005ab5', 
            incorrect:'#005ab5', 
            incorrectColor:'#dc3220'
        },
        cbDark: {
            themeName:'Colorblind Dark', 
            themeCode: 'cbDark', 
            bgCorrectColor:'#232629', 
            bgIncorrectColor:'#232629', 
            defaultColor:'#fdfdfd', 
            correct:'#ffc20a', 
            incorrect:'#ffc20a', 
            incorrectColor:'#0c7bdc'
        },
        cbColorful: {
            themeName:'Colorblind ...colorful', 
            themeCode: 'cbColorful', 
            bgCorrectColor:'#1a85ff', 
            bgIncorrectColor:'#d41159', 
            defaultColor:'#000000', 
            correct:'#1aff00', 
            incorrect:'#1A85FF', 
            incorrectColor:'#ffffff'
        },
        custom: {
            themeName:'Custom', 
            themeCode: 'custom', 
            bgCorrectColor:'#ffffff', 
            bgIncorrectColor:'#ffffff', 
            defaultColor:'#000000', 
            correct:'#00af03', 
            incorrect:'#00af03', 
            incorrectColor:'#e42600'
        }
    };

    //=============================================================================
    // Initialize default colors
    //=============================================================================
    function getColors(theme) {
        let colors ={
            themeName        : theme.themeName,
            bgCorrectColor   : theme.bgCorrectColor,
            bgIncorrectColor : theme.bgIncorrectColor,
            defaultColor     : theme.defaultColor,
            correct          : theme.correct,
            incorrect        : theme.incorrect,
            incorrectColor   : theme.incorrectColor,
            isColorful       : isColorful(JSON.stringify(theme.themeName))
        };
        return colors;
    }

    // checks if theme 'is colorful' (i.e. background changes color when correct/incorrect
    // returns boolean
    function isColorful(theme) {
        return theme.match(/(colorful|custom)/i);
    }


    //------------------------------------------------------------------------
    // settings_preopen() - Notify user if iteminfo and lightning are both enabled.
    //------------------------------------------------------------------------
    function insert_icons() {
		if (!document.getElementById('wk-icon__lightning')) {
			let svg = document.querySelector('svg symbol[id^="wk-icon"]').closest('svg');
			svg.insertAdjacentHTML('beforeend','<symbol id="wk-icon__lightning" viewport="0 0 500 500"><path d="M160,12L126,265L272,265L230,488L415,170L270,170L320,12Z"></path></symbol>');
		}
	}

    //------------------------------------------------------------------------
    // setup() - Set up the menu link and default settings.
    //------------------------------------------------------------------------
    let fresh_load = true;
    function setup() {
    	fresh_load = true;
    	wkof.Menu.insert_script_link({
    		name:'mrmr', 
    		submenu:'Settings', 
    		title:'Multiple Readings/Meanings Retention', 
    		on_click:open_settings
    	});

    	base = {
            requirements:   'minRequire',
            answerFormat:   'multiEntry',
            showNumPossible:true,
            strict:         false,
            apprentice:     '1',
            guru:           '2',
            master:         '3',
            enlightened:    'all',
            minRequire:     2,
            showRest:       true,
            isBundled:      true,
            mrmrLessons:    true,
            theme:          themes.wanikani,
            lightning_enabled: true
            // themeName:      'wanikani',
        };

        let colors = getColors(base.theme);
        let defaults = Object.assign({},base,colors);

    	return wkof.Settings.load('mrmr', defaults).then(init_ui)
    }

    //------------------------------------------------------------------------
    // open_settings() - Open the Settings dialog.
    //------------------------------------------------------------------------
    function open_settings() {
    	let dialog = new wkof.Settings({
    		script_id: 'mrmr',
    		title: 'Multiple Readings/Meanings Retention',
    		on_save: settings_saved,
    		content: {
    			tabMain: {type:'page',label:'Substance',hover_tip:'Configure answer settings for Reviews and Quizzes', content:{
					grpMain: {type:'group', label:'Answer Requirements', hover_tip:'Set primary settings\nfor multi-answer items.', content:{
    					requirements: {type:'dropdown', label:'Number Required', hover_tip:'Choose how many of the possible\nanswers are required.', 
    						content: {
	    						showOnly:   'Only 1 Answer, Show the Rest',
	                            requireAll: 'All Possible Answers',
	                            minRequire: 'Specific Number',
	                            srsBased:   'Base On SRS Level'
    						},
		    				default: settings.requirements,
							on_change: config_settings
    					},
    					answerFormat: {type:'dropdown', label:'Answer Format', hover_tip: 'Set how you want to submit\non multi-answer items.',
    						content: {
    							oneEntry:   'All In One Go (semicolon separated)',
                                multiEntry: 'One At A Time'
    						},
    						default: 'multiEntry',
							on_change: config_settings
    					},
    					mrmrLessons: {type:'checkbox', label:'Start With Lessons', hover_tip: 'If a lesson item has more than one answer,\nrequire them all to progress.',
    						default: settings.mrmrLessons
    					},
    					strict: {type:'checkbox', label:'Strict Mode', hover_tip: 'Removes safety nets for on\'yomi/kun\'yomi reading\nexceptions, and blank or duplicate submissions.',
    						default: settings.strict
    					}
					}},
    				grpParticulars: {type:'group', label:'Particulars', hover_tip:'Choose specifics for further customization.', content: {
    					lightning_enabled: {type:'checkbox', label:'Lightning Mode', hover_tip:'Enable "Lightning Mode", which automatically advances to\nthe next question if you answer correctly.',
    						default: settings.lightning_enabled,
    						refresh_on_change: true
    					},
    					showNumPossible: {type:'checkbox', label:'Show Total Required', hover_tip: 'Checked will display how many possible\nanswers an item has during reviews.\nUpdates for "One At A Time" on each submission.',
                            default: settings.showNumPossible
                        },
                        showRest: {type: 'checkbox', label: 'Show Remaining Answers', hover_tip: 'Show remaining correct answers\nafter submitting minimum guesses.\n(overrides Lightning Mode if more\nanswers than submissions)',
                            default: settings.showRest
                        },
                        minRequire: {type:'number', label: 'Min Required Answers', hover_tip: 'How many of an items meanings/readings\nyou need to get correct.',
                            default: settings.minRequire
                        },
                        grp_srsReq: {type:'group', label:  'SRS Level Requirements', hover_tip: 'Set number of answers required\nfor each SRS level.',content: {
                            apprentice: {type:'dropdown', label:'Apprentice', hover_tip:'Set requirement for Apprentice Level items.',
                                default:settings.apprentice,
                                content: {'1':'1','2':'2','3':'3','4':'4','5':'5','all':'All'}
                            },
                            guru: {type:'dropdown', label:'Guru', hover_tip: 'Set requirement for Guru Level items.',
                                default:settings.guru,
                                content: {'1':'1','2':'2','3':'3','4':'4','5':'5','all':'All'}
                            },
                            master: {type:'dropdown', label:'Master', hover_tip: 'Set requirement for Master Level items.',
                                default:settings.master,
                                content: {'1':'1','2':'2','3':'3','4':'4','5':'5','all':'All'}
                            },
                            enlightened: {type:'dropdown', label:'Enlightened', hover_tip: 'Set requirement for Enlightened Level items.',
                                default:settings.enlightened,
                                content: {'1':'1','2':'2','3':'3','4':'4','5':'5','all':'All'}
                            }
                        }}
    				}}
    			}},
	    		tabColors: {type:'page', label:'Style', hover_tip:'Configure background and text colors', content: {
	    			grp_colors: { type: 'group', label: 'Colors', content: {
	                    themeName: {type:'dropdown', label:'Theme', hover_tip:'Choose a theme to user pre-set colors\nor customize your own below.',
	                        default: settings.theme.themeCode,
	                        content: {wanikani:'WaniKani', dark:'Dark', colorful:'Colorful', cbLight:'Colorblind Light', cbDark:'Colorblind Dark', cbColorful:'Colorblind ...colorful', custom:'Custom'},
	                        on_change: updateStyle
	                    },
	                    bgCorrectColor: {type:'color', label:'Background Correct', hover_tip:'Background color for whole answer bar.',
	                        default: settings.bgCorrectColor,
	                        on_change: updateStyle},
	                    bgIncorrectColor: { type:'color', label:  'Background Incorrect', hover_tip:'Background color for whole answer bar.',
	                        default: settings.bgIncorrectColor,
	                        on_change: updateStyle},
	                    defaultColor: {type:'color',label:'Default Text', hover_tip:'Text color for regular text\n(neither correct nor incorrect).',
	                        default: settings.defaultColor,
	                        on_change: updateStyle},
	                    correct: {type:'color',label:'Correct (on Correct BG)', hover_tip:'Text color for correct answers.',
	                        default: settings.correct,
	                        on_change: updateStyle},
	                    incorrect: {type:'color',label:'Correct (on Incorrect BG)', hover_tip:'Text color for correct answers in untimately\nwrong "All At Once" submissions.',
	                        default: settings.incorrect,
	                        on_change: updateStyle},
	                    incorrectColor: {type:'color',label:'Incorrect', hover_tip:'Text color for incorrect answers.',
	                        default: settings.incorrectColor,
	                        on_change: updateStyle}
	                }}
	    		}},
	    	}
    	});
		dialog.open();
		config_settings();
		// toggleIncorrectBgColorOption(settings.theme.themeName)
    }

    //------------------------------------------------------------------------
    // config_settings() - Runs on change to answer requirements or answer format in MRMR Settings
    //------------------------------------------------------------------------
    function config_settings() {
        settings.isBundled = isAllAtOnce();

        const minRequire = document.getElementById('mrmr_minRequire')
        const select = document.getElementById("mrmr_grp_srsReq")
        const selection = document.getElementById("mrmr_requirements").value

		// toggle display and disabled status of minRequired field
        if (selection === 'Specific Number') {
        	minRequire.closest('.row').style.display = 'block'
        	minRequire.removeAttribute('disabled')
        }
        else {
        	minRequire.closest('.row').style.display = 'none'
        	minRequire.setAttribute('disabled', 'disabled')
        }

       
        // toggle display and disabled status of SRS Level Requirements group and select elements
        select.style.display = (selection === 'Base On SRS Level') ? 'block' : 'none'
        select.querySelectorAll('select').forEach((s) => {
        	if (selection !== 'Base On SRS Level') {
        		s.setAttribute('disabled', 'disabled')
    		}
    		else {
    			s.removeAttribute('disabled')
    		}
        })

        // hide/show Correct (Incorrect Background) option
        toggleIncorrectBgColorOption(document.getElementById('mrmr_themeName').value)
    }

    function settings_saved() {
        settings = wkof.settings.mrmr;
        log(settings)
        // wk_mrmr.debugToggle && console.log(settings);
    }

    // Checks if batch submission is selected
    // returns boolean
    function isAllAtOnce() {
        let id = document.getElementById('mrmr_answerFormat').value;
        // let regex = new RegExp(/(all)/i);
        return id.match(/(all)/i);
    }

    //=============================================================================
    // Change Theme and update color fields
    //=============================================================================
    let isThemeChange = false;
    function updateStyle() {
    	log('updating styles')

    	if (this.id === 'mrmr_themeName') {
    		isThemeChange = true
    		themeChange(this.options[this.selectedIndex].getAttribute('name'))
    	}
    	else if (!isThemeChange) {
    		setCustomColor(this.value, this.getAttribute('name'))
    	}
    }

    function themeChange(theme) {
    	log('changing theme...')
    	log(theme)

    	let newTheme = '';

    	newTheme = themes[theme] ?? false;

    	if (!newTheme) return;

    	setColors(newTheme)
    }

    function setColors(theme) {
    	log('setting colors...')

    	let themeName = JSON.stringify(theme.themeName)
    	log('themeName: ' + themeName)
    	let incorrect = jQuery('#mrmr_incorrect')
    	settings.isBundled = isAllAtOnce()


    	document.getElementById('mrmr_bgCorrectColor').value  = theme.bgCorrectColor
		document.getElementById('mrmr_bgIncorrectColor').value  = theme.bgIncorrectColor
		document.getElementById('mrmr_defaultColor').value  = theme.defaultColor
		document.getElementById('mrmr_incorrectColor').value  = theme.incorrectColor
		document.getElementById('mrmr_correct').value  = theme.correct
		document.getElementById('mrmr_incorrect').value  = theme.incorrect

		// hide/show Correct (Incorrect Background) option
        toggleIncorrectBgColorOption(themeName)

        isThemeChange = false;

        base.theme = theme;
        settings.theme = theme;
    }

    // runs when user changes a color input option
    function setCustomColor(val, prop) {
        log('running setCustomColor...')
        // wk_mrmr.debugToggle && console.log('running setCustomColor...');
        themes.custom[prop] = val;
        setToCustom();
    }

    function setToCustom() {
    	log('running setToCustom...')

    	let themeSelect = document.getElementById('mrmr_themeName')
    	let selectedTheme = themeSelect.options[themeSelect.selectedIndex]
    	log('selected theme: ' + selectedTheme.value)

    	if (selectedTheme !== 'Custom') {
    		if (selectedTheme.getAttribute('name').match(/(custom)/i)) {
    			selectedTheme.setAttribute('selected', null)
    		}
    		themeSelect.value = 'Custom'
    	}

    	toggleIncorrectBgColorOption('custom')
    }

    function toggleIncorrectBgColorOption(themeName) {
    	themeName ??= settings.theme.themeName
    	let display = settings.isBundled && isColorful(themeName) ? 'block' : 'none'
        document.getElementById('mrmr_incorrect').closest('.row').style.display = display
    }

    //------------------------------------------------------------------------
    // new_submit_handler() - Intercept handler for 'submit' button.  Overrides default behavior as needed.
    //------------------------------------------------------------------------
    function new_submit_handler(e) {
    	// Don't process 'submit' if we are ignoring temporarily (to prevent double-tapping past important info)
        if (ignore_submit) return;
        return false;
    }

    async function init_ui() {
    	settings = wkof.settings.mrmr;

    	if (fresh_load) {
    		fresh_load = false;
    		await startup();
    	}

    	// Migrate 'lightning' setting from localStorage.
        let lightning = localStorage.getItem('lightning');
        if (lightning === 'false' || lightning === 'true') {
            localStorage.removeItem('lightning');
            settings.lightning_enabled = lightning;
            wkof.Settings.save('mrmr');
        }

        insert_icons();

        // Initialize the Lightning Mode button.
        let lightning_icon = document.querySelector('#lightning-mode');
        if (lightning_icon) {
            lightning_icon.classList.toggle('mrmr-active', settings.lightning_enabled);
            lightning_icon.hidden = !settings.show_lightning_button;
            lightning_icon.removeAttribute('hidden')
        }
    }

    //------------------------------------------------------------------------
    // lightning_clicked() - Lightning button handler.
    //------------------------------------------------------------------------
    function lightning_clicked(e) {
        e.preventDefault();
        settings.lightning_enabled = !settings.lightning_enabled;
        wkof.Settings.save('mrmr');
        document.querySelector('#lightning-mode').classList.toggle('mrmr-active', settings.lightning_enabled);
        return false;
    }

	//------------------------------------------------------------------------
    // startup() - Install our intercept handlers, and add our MRMR button and hotkey
    //------------------------------------------------------------------------
    async function startup() {
    	// Intercept the submit button handler
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
                console.log('MRMR:', err, ' Retrying...');
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
            `<style name="mrmr">
            #lightning-mode.mrmr-active svg {fill:#ff0; opacity:1.0;}
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
    // log() - Easy logger with debug toggler
    //------------------------------------------------------------------------
    function log(message, type = null) {
        if (!mrmr.debugToggle) return;

        switch (type) {
            case 'warn':  console.warn(message);  break;
            case 'error': console.error(message); break;
            case 'info':  console.info(message);  break;
            default:      console.log(message);
        }
    }

})(window.mrmr);