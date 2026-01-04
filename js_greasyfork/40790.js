// ==UserScript==
// @name        Wanikani Self-Study Hide Info
// @namespace   rfindley
// @description Hide item info on the Level and Item screens for self-study.
// @version     1.2.1
// @match       https://www.wanikani.com/*
// @copyright   2018-2025, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40790/Wanikani%20Self-Study%20Hide%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/40790/Wanikani%20Self-Study%20Hide%20Info.meta.js
// ==/UserScript==

window.ss_hideinfo = {};

(async function(gobj) {

    /* global wkof, Stimulus, WaniKani, importShim, ss_hideinfo, ss_quiz */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Self-Study Hide Info';
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

    function promise(){let a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}

    wkof.on_pageload([
        '/level/*',
        '/radicals',
        '/kanji',
        '/vocabulary'
    ], load_script);

    function load_script() {
        wkof.include('Settings');
        wkof.ready('document, Settings')
            .then(load_settings)
            .then(install_interface);
    }

    //========================================================================
    var btnbar, sections;
    function install_interface() {
        var html =
            '<div class="ss_hideinfo">'+
            '  <label>Self-study:</label>'+
            '  <div class="btn-group">'+
            '    <button class="btn enable" title="Enable/Disable self-study plugin"></button>'+
            '    <button class="btn ssquiz hidden" title="Open the quiz window">Quiz</button>'+
            '    <button class="btn shuffle" title="Shuffle the list of items below">Shuffle</button>'+
            '    <select class="btn mode" title="Select a self-study preset">'+
            '      <option value="jp2en">Japanese to English</option>'+
            '      <option value="en2jp">English to Japanese</option>'+
            '    </select>'+
            '    <select class="btn lockburn" title="Select a self-study preset">'+
            '      <option value="all">Show All Items</option>'+
            '      <option value="hideunlocked">Show Locked Only</option>'+
            '      <option value="hideunburned">Show Burned Only</option>'+
            '      <option value="hidelocked">Hide Locked</option>'+
            '      <option value="hideburned">Hide Burned</option>'+
            '      <option value="hidelockedburned">Hide Locked and Burned</option>'+
            '    </select>'+
            '  </div>'+
            '</div>';

        var css = `
            .ss_hideinfo {margin-left:20px; margin-bottom:10px; position:relative;}
            .ss_hideinfo label {display:inline; vertical-align:middle; padding-right:4px; color:#999; font-size:14px;font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif; text-shadow:0 1px 0 #fff;}
            .ss_hideinfo .btn-group {display:inline; vertical-align:middle; font-size:0px;}
            .ss_hideinfo select.btn {width:200px;}
            .ss_hideinfo .btn.enable {width:55px;}
            .ss_hideinfo .btn {
                display:inline-block;
                height:30px;
                padding: 4px 12px;
                margin-bottom: 0;
                font-size: 14px;
                line-height: 20px;
                text-align: center;
                vertical-align: middle;
                cursor: pointer;
                text-shadow: 0 1px 1px rgb(255 255 255 / 75%);
                font-family: "Ubuntu", Helvetica, Arial, sans-serif;
                background-color: #f0f0f0;
                background-image: linear-gradient(to bottom, #fff, #e6e6e6);
                background-repeat: repeat-x;
                border-color: rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.25);
                border: 1px solid #ccc;
                border-left: 0;
                border-bottom-color: #b3b3b3;
                box-shadow: inset 0 1px 0 rgb(255 255 255 / 20%), 0 1px 2px rgb(0 0 0 / 5%);
            }
            .ss_hideinfo .btn:hover {
                color: #333;
                text-decoration: none;
                background-position: 0 -15px;
                transition: background-position 0.1s linear;
            }
            .ss_hideinfo .btn:first-child {
                border-left: 1px solid #ccc;
                border-radius: 4px 0 0 4px;
            }
            .ss_hideinfo .btn:last-child {border-radius: 0 4px 4px 0;}

            section.ss_active .ss_hideinfo button.enable {background-color:#b3e6b3; background-image:linear-gradient(to bottom, #ecf9ec, #b3e6b3);}
            section.ss_active .ss_hideinfo button.enable:after {content:"ON";}
            section:not(.ss_active) .ss_hideinfo button.enable:after {content:"OFF";}

            section.ss_active.ss_hidechar .subject-character .subject-character__characters {opacity:0; transition:opacity ease-in-out 0.15s}
            section.ss_active.ss_hideread .subject-character .subject-character__reading {opacity:0; transition:opacity ease-in-out 0.15s}
            section.ss_active.ss_hidemean .subject-character .subject-character__meaning {opacity:0; transition:opacity ease-in-out 0.15s}
            section.ss_active.ss_hideburned .ss_burned {display:none;}
            section.ss_active.ss_hidelocked .ss_locked {display:none;}
            section.ss_active.ss_hideunburned .subject-character-grid__item:not(.ss_burned) {display:none;}
            section.ss_active.ss_hideunlocked .subject-character-grid__item:not(.ss_locked) {display:none;}

            section.ss_active .subject-character:hover span.subject-character__characters {opacity: initial !important; transition:opacity ease-in-out 0.05s !important;}
            section.ss_active .subject-character:hover .subject-character__info span {opacity: initial !important; transition:opacity ease-in-out 0.05s !important;}
            `;

        let css_tag = document.createElement('style');
        css_tag.textContent = css;
        document.head.prepend(css_tag);

        sections = document.querySelectorAll('section.character-grid');

        sections.forEach((section) => {
            section.insertAdjacentHTML('afterbegin',html);
            btnbar = section.querySelector('.ss_hideinfo');
            btnbar.querySelector('button.enable').addEventListener('click', toggle_enable);
            btnbar.querySelector('button.ssquiz').addEventListener('click', open_quiz);
            btnbar.querySelector('button.shuffle').addEventListener('click', shuffle);
            btnbar.querySelector('select.mode').addEventListener('change', mode_changed);
            btnbar.querySelector('select.lockburn').addEventListener('change', lockburn_changed);
        });

        for (let item of document.querySelectorAll('section.character-grid .subject-character--locked')) {
            item.closest('.subject-character-grid__item').classList.add('ss_locked');
        }
        for (let item of document.querySelectorAll('section.character-grid .subject-character--burned')) {
            item.closest('.subject-character-grid__item').classList.add('ss_burned');
        }

        wkof.wait_state('ss_quiz', 'ready').then(function(){
            if (typeof ss_quiz.open === 'function') {
                for (let bar of document.querySelectorAll('.ss_hideinfo button.ssquiz')) {
                    bar.classList.remove('hidden');
                };
            }
        });

        toggle_enable(null, true /* no_toggle */);
        mode_changed();
        lockburn_changed();
        if (settings.enabled) shuffle();
    }

    //========================================================================
    function deep_merge(...objects) {
        let merged = {};
        function recursive_merge(dest, src) {
            for (let prop in src) {
				if (typeof src[prop] === "object" && src[prop] !== null ) {
					if (Array.isArray(src[prop])) {
						dest[prop] = src[prop].slice();
					} else {
						dest[prop] = dest[prop] || {};
						recursive_merge(dest[prop], src[prop]);
					}
				} else {
                    dest[prop] = src[prop];
                }
            }
            return dest;
        }
        for (let obj in objects) {
            recursive_merge(merged, objects[obj]);
        }
        return merged;
    }

    //========================================================================
    var settings;
    function load_settings() {
        var default_settings = {
            enabled: false,
            mode: 'jp2en',
            lockburn: 'all',
        };
        return wkof.Settings.load('ss_hideinfo')
        .then(function(){
            settings = deep_merge(default_settings, wkof.settings.ss_hideinfo);
            settings = wkof.settings.ss_hideinfo;
        });
    }

    //========================================================================
    function save_settings() {
        wkof.Settings.save('ss_hideinfo');
    }

    //========================================================================
    function toggle_enable(e, no_toggle) {
        var enabled = settings.enabled;
        if (no_toggle !== true) enabled = !enabled;
        if (enabled) {
            sections.forEach((section) => section.classList.add('ss_active'));
        } else {
            sections.forEach((section) => section.classList.remove('ss_active'));
        }
        if (enabled !== settings.enabled) {
            settings.enabled = enabled;
            save_settings();
        }
    }

    //========================================================================
    function fisher_yates_shuffle(arr) {
        var i = arr.length, j, temp;
        if (i===0) return arr;
        while (--i) {
            j = Math.floor(Math.random()*(i+1));
            temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
        return arr;
    }

    //========================================================================
    function shuffle(e) {
        if (e === undefined) {
            // Shuffle all
            for (let section of document.querySelectorAll('.subject-character-grid')) {
                let grid = section.querySelector('.subject-character-grid__items');
                let items = fisher_yates_shuffle(Array.from(grid.children));
                for (let item of items) grid.append(item);
            };
        } else {
            // Shuffle specific group
            let section = e.currentTarget.closest('section.character-grid');
            let grid = section.querySelector('.subject-character-grid__items');
            let items = fisher_yates_shuffle(Array.from(grid.children));
            for (let item of items) grid.append(item);
        }
    }

    //========================================================================
    function mode_changed(e) {
        let value;
        if (e !== undefined) {
            value = e.target.value;
            settings.mode = value;
            save_settings();
        } else {
            value = settings.mode;
        }
        for (let section of sections) {
            section.querySelector('select.mode').value = value;
            section.classList.remove('ss_hidechar', 'ss_hideread', 'ss_hidemean');
            switch (value) {
                case 'jp2en':
                    section.classList.add('ss_hidemean', 'ss_hideread');
                    break;

                case 'en2jp':
                    section.classList.add('ss_hidechar', 'ss_hideread');
                    break;
            }
        }
    }

    //========================================================================
    function lockburn_changed(e) {
        let value;
        if (e !== undefined) {
            value = e.target.value;
            settings.lockburn = value;
            save_settings();
        } else {
            value = settings.lockburn;
        }
        for (let section of sections) {
            section.querySelector('select.lockburn').value = value;
            section.classList.remove('ss_hidelocked', 'ss_hideburned', 'ss_hideunlocked', 'ss_hideunburned');
            switch (value) {
                case 'all':
                    break;

                case 'hidelocked':
                    section.classList.add('ss_hidelocked');
                    break;

                case 'hideburned':
                    section.classList.add('ss_hideburned');
                    break;

                case 'hidelockedburned':
                    section.classList.add('ss_hidelocked', 'ss_hideburned');
                    break;

                case 'hideunlocked':
                    section.classList.add('ss_hideunlocked');
                    break;

                case 'hideunburned':
                    section.classList.add('ss_hideunburned');
                    break;
            }
        }
    }

    //========================================================================
    function open_quiz(e) {
        var btn = e.currentTarget;
        var sec = btn.closest('section.character-grid');
        var level, item_type;
        var path = window.location.pathname.split('/');
        var header = btn.closest('section').querySelector('header').textContent.trim();
        if (path[1] === 'level') {
            level = path[2];
            item_type = header.toLowerCase();
        } else {
            level = header.split(' ')[1];
            item_type = path[1];
        }
        var item_type_text = item_type;
        item_type_text[0] = item_type_text[0].toUpperCase();
        var title = 'Level '+level+' '+item_type_text;
        item_type = item_type.replace(/s$/g, '');

        var custom_options = {
            ipreset: {name: title, content: {
                wk_items: {enabled: true, filters: {
                    level: {enabled: true, value: level},
                    item_type: {enabled: true, value: item_type},
                }},
            }},
        };
        switch (settings.lockburn) {
            case 'all':
                break;

            case 'hidelocked':
                custom_options.ipreset.content.wk_items.filters.srs = {enabled:true,value:'1,2,3,4,5,6,7,8,9'};
                break;

            case 'hideburned':
                custom_options.ipreset.content.wk_items.filters.srs = {enabled:true,value:'-1,0,1,2,3,4,5,6,7,8'};
                break;

            case 'hidelockedburned':
                custom_options.ipreset.content.wk_items.filters.srs = {enabled:true,value:'1,2,3,4,5,6,7,8'};
                break;

            case 'hideunlocked':
                custom_options.ipreset.content.wk_items.filters.srs = {enabled:true,value:'-1,0'};
                break;

            case 'hideunburned':
                custom_options.ipreset.content.wk_items.filters.srs = {enabled:true,value:'9'};
                break;
        }

        if (settings.mode === 'en2jp' && item_type === 'vocabulary') {
            custom_options.qpreset = {
                name: 'English to Japanese',
                content: {
                    mean2read:true,
                }
            };
        } else {
            custom_options.qpreset = {
                name: 'Japanese to English',
                content: {
                    char2read:true,
                    char2mean:true,
                }
            };
        }
        ss_quiz.open(custom_options);
    }

})(window.ss_hideinfo);
