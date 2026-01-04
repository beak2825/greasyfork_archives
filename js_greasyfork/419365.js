// ==UserScript==
// @name         DKTD Cooldown Display
// @version      0.13.3
// @description  Item cooldown display for the Twitch game "don't kick the dog"
// @author       Grabz
// @match        https://www.twitch.tv/dontkickthedog
// @match        https://www.twitch.tv/dontkickthedog/*
// @match        https://www.twitch.tv/popout/dontkickthedog
// @match        https://www.twitch.tv/popout/dontkickthedog/*
// @grant        none
// @namespace    https://greasyfork.org/users/722243
// @downloadURL https://update.greasyfork.org/scripts/419365/DKTD%20Cooldown%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/419365/DKTD%20Cooldown%20Display.meta.js
// ==/UserScript==

(() => {
    'use strict';

    console.log('DKTD Cooldown Display - Script found');

    class TimerBasic {
        /**
         * 
         * @param {number} order 
         * @param {string} type 
         * @param {number} milliseconds 
         * @param {string} icon 
         * @param {boolean} title 
         */
        constructor(order, type, milliseconds, icon, title) {
            this.order = order;
            this.type = type;
            this.milliseconds = milliseconds;
            this.icon = icon;
            this.title = title;

            this.elem = null;
            this.lastUpdate = Date.now();
            this.markedForRemoval = false;
        }

        /**
         * @returns {{ now: number, text: string, lastUpdate: number }}
         */
        refresh() {
            //Rebuild the element if it is gone from DOM
            if(isDetached(this.elem)) {
                this.buildTimerElem();
            }

            //Build data
            const data = {
                now: Date.now(),
                text: '',
                lastUpdate: this.lastUpdate 
            }

            //Reduce time
            this.milliseconds -= data.now - this.lastUpdate;
            this.lastUpdate = data.now;
            data.text = getFormattedTime(Math.floor(this.milliseconds / 1000));

            //Exit if the cooldown has reached 0
            if(this.milliseconds < 0) {
                this.markedForRemoval = true;
            }
            
            return data;
        }

        buildTimerElem() {
            let parent = elements.custom[`holder_${this.type}`];
            if(isDetached(parent))
                return false;

            let elem = document.createElement('div');
            elem.innerHTML = '<span>' + this.icon + '</span><span data-dktd="counter"></span>';
            elem.style.paddingRight = '5px';
            this.elem = elem;

            parent.appendChild(elem);
            return true;
        }
    }

    class TimerIdle extends TimerBasic {
        constructor(order, type, milliseconds, icon, title) {
            super(order, type, milliseconds, icon, title);

            this.notifierSent = false;
            this.idleTimeMs = null;
        }

        refresh() {
            const data = super.refresh();

            //Persist
            this.markedForRemoval = false;
            if(this.milliseconds <= 0) {
                data.text = 'IDLE';
            }

            //Play repeat notifier
            if(this.idleTimeMs != null) {
                this.idleTimeMs -= data.now - data.lastUpdate;

                if(this.idleTimeMs <= 0) {
                    this.idleTimeMs = settings.value_notify_idle_keep_notifying * 1000;
                    if(settings.toggle_notify_idle && settings.toggle_notify_idle_keep_notifying)
                        audio[settings.audio_notify_idle].audio.play();
                }
            }

            //Play idle notifier
            if(this.milliseconds <= 1000 * 30 && !this.notifierSent) {
                this.notifierSent = true;

                if(settings.toggle_notify_idle)
                    audio[settings.audio_notify_idle].audio.play();

                this.idleTimeMs = settings.value_notify_idle_keep_notifying * 1000;
            }

            return data;
        }
    }

    function TimerManager() {
        const timers = [];

        this.addTimer = function (timer) {
            timers.push(timer);
            timers.sort((a, b) => a.order - b.order);
            this.refresh();
        };

        this.deleteTimers = function (type) {
            for(let i = 0; i < timers.length; i++) {
                let timer = timers[i];
                if(timer.type === type) {
                    timer.elem.remove();
                    timers.splice(i, 1);
                    i--;
                }
            }
        };

        this.refresh = function () {
            let title = '';
            for (let i = 0; i < timers.length; i++) {
                const timer = timers[i];

                const data = timer.refresh();

                //Exit if the timer is to be removed
                if (timer.markedForRemoval) {
                    if(!isDetached(timer.elem))
                        timer.elem.remove();

                    timers.splice(i, 1);
                    i--;
                    continue;
                }

                //Update counter
                if(!isDetached(timer.elem))
                    timer.elem.querySelector('[data-dktd=counter]').textContent = data.text;
                if(timer.title)
                    title += `${data.text} `;
            }

            document.title = `${title} ${default_page_title}`;
        };
    }

    const holder_html = `
        <div class='dktd-wrapper'>
            <div class='dktd-container-buttons'>
                <button class='dktd-options-button' data-dktd='options_button'>⚙️ DKTD
                    <div class='dktd-options-panel' data-dktd='options_panel'>
                        <div class='dktd-options-header'>
                            <div class='dktd-options-title'>DKTD Control Panel</div>
                            <div class='dktd-options-close' data-dktd='options_panel_header_close'>X</div>
                        </div>
                        <div class='dktd-options-content'>
                            <div class='dktd-options-row'>
                                <div style="width:100%;text-align:middle">Volume (<span data-dktd="text_volume">0</span>%)</div>
                                <input type="range" min="0" max="100" value="0" data-dktd="slider_volume" style="width:100%">
                            </div>
                            <hr class='dktd-options-separator'></hr>
                            <div class='dktd-options-row' style='justify-content: space-between'>
                                <label class='dktd-label' title="Play a sound when you're about to be logged out."><input class='dktd-label-input' data-dktd='toggle_notify_idle' type='checkbox'>Idle Notify</label>
                                <select class='dktd-audio' data-dktd='audio_notify_idle'></select>
                            </div>
                            <div class='dktd-options-row'>
                                <label class='dktd-label' title="Continue to notify after the first time about being idle."><input class='dktd-label-input' data-dktd='toggle_notify_idle_keep_notifying' type='checkbox'>Keep Notifying</label>
                            </div>
                            <div class='dktd-options-row'>
                                Every <input class='dktd-options-inline-input' data-dktd='value_notify_idle_keep_notifying' type='text' style='width: 30px;'> seconds
                            </div>
                            <hr class='dktd-options-separator'></hr>
                            <div class='dktd-options-row' style='justify-content: space-between'>
                                <label class='dktd-label' title="Play a sound whenever the dog is leaving."><input class='dktd-label-input' data-dktd='toggle_notify_leave' type='checkbox'>Dog Leave Notify</label>
                                <select class='dktd-audio' data-dktd='audio_notify_leave'></select>
                            </div>
                            <div class='dktd-options-row' style='justify-content: space-between'>
                                <label class='dktd-label' title="Play a sound whenever the dog's bone levels up."><input class='dktd-label-input' data-dktd='toggle_notify_bone' type='checkbox'>Bone Level Notify</label>
                                <select class='dktd-audio' data-dktd='audio_notify_bone'></select>
                            </div>
                            <div class='dktd-options-row' style='justify-content: space-between'>
                                <label class='dktd-label' title="Play a sound whenever Golden Dog is activated."><input class='dktd-label-input' data-dktd='toggle_notify_golden' type='checkbox'>Golden Dog Notify</label>
                                <select class='dktd-audio' data-dktd='audio_notify_golden'></select>
                            </div>
							<div class='dktd-options-row' style='justify-content: space-between'>
                                <label class='dktd-label' title="Play a sound whenever a Warp is being claimed."><input class='dktd-label-input' data-dktd='toggle_notify_warp' type='checkbox'>Warp Notify</label>
                                <select class='dktd-audio' data-dktd='audio_notify_warp'></select>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
            <div class='dktd-container-idle'>
                <span data-dktd='holder_idle'></span>
                <span data-dktd='holder_sorry'></span>
            </div>
            <div class='dktd-holder-item' data-dktd='holder_item'></div>
        </div>
    `;
    const addon_css = `
        .dktd-wrapper { display: flex; flex-flow: column nowrap; width: 100%; flex: 1 0 65px; }
        .dktd-options-button { position: relative; border-radius: 2px; font-weight: bold; height: 24px; padding-left: 4px; padding-right: 4px; background-color: #a27a2c; color: #e3e3e3; }
        .dktd-options-panel { display: none; position: absolute; width: 32rem; bottom: 30px; left: 0; z-index: 10; cursor: default; padding: 8px; background-color: var(--color-background-base) !important; border-radius: 0px 0px 3px 3px; }
        html.tw-root--theme-dark .dktd-options-panel { color: #e3e3e3; box-shadow: #1c1c1c 0px 4px 8px 0px; }
        html.tw-root--theme-light .dktd-options-panel { color: #1c1c1c; box-shadow: #e3e3e3 0px 4px 8px 0px; }
        .dktd-options-header { display: flex; flex-flow: row nowrap; align-items: center; padding-bottom: 6px; font-size: var(--font-size-5) !important; font-weight: bold; }
        .dktd-options-content { display: flex; flex-flow: column nowrap; font-weight: normal; }
        .dktd-options-row { display: flex; flex-flow: row nowrap; }
        .dktd-options-separator { border-top: 1px solid #bbb; margin: 8px; }
        .dktd-options-bottompad { margin-bottom: 8px; }
        .dktd-options-inline-input { width: 40px; padding: 0; margin: 0; border: 1px solid gray; border-radius: 2px; margin-left: 2px; margin-right: 2px; padding-left: 2px; padding-right: 2px; }
        .dktd-options-title { flex: 1 0 auto; text-align: center; }
        .dktd-options-close { flex: 0 0 21px; text-align: center; cursor: pointer; }
        .dktd-label { flex: 0 0 auto; cursor: pointer; }
        .dktd-label-input { cursor: inherit; vertical-align: middle; margin-right: 4px; }
        .dktd-audio { flex: 0 1 50%; cursor: pointer; padding: 0; margin: 0; border: 1px solid gray; border-radius: 0; }

        .dktd-holder-item, .dktd-container-idle, .dktd-container-buttons { display: flex; flex-flow: row nowrap; justify-content: flex-start; }
    `;

    const elements = {
        twitch: {
            container: [null, '[data-test-selector="chat-input-buttons-container"]'],               //Main parent
            chat: [null, '[data-test-selector="chat-scrollable-area__message-container"]'],         //Chat holder
            chat_send: [null, '[data-a-target="chat-send-button"]'],                                //Chat message send button
            chat_input: [null, '[data-a-target="chat-input"]']                              //Chat message input field
        },
        custom: {
            holder: null,                           //Timers holder
            holder_item: null,                      //Item timers holder
            holder_idle: null,                      //Idle timer holder
            holder_sorry: null,                     //Probation timer holder

            options_panel: null,
            options_panel_header_close: null,

            text_volume: null,
            slider_volume: null,

            toggle_notify_idle: null,
            audio_notify_idle: null,
            toggle_notify_idle_keep_notifying: null,
            value_notify_idle_keep_notifying: null,
            
            toggle_notify_bone: null,
            audio_notify_bone: null,
            toggle_notify_golden: null,
            audio_notify_golden: null,
            toggle_notify_leave: null,
            audio_notify_leave: null,
			toggle_notify_warp: null,
			audio_notify_warp: null,
        }
    }

    var settings = {
        slider_volume: 70, //0 - 100

        toggle_notify_idle: false,
        audio_notify_idle: 'Bell',
        toggle_notify_bone: false,
        audio_notify_bone: 'Warm Soft Synth',
        toggle_notify_golden: false,
        audio_notify_golden: 'Soft Chimes 1',
        toggle_notify_leave: false,
        audio_notify_leave: 'Short Tone',
		toggle_notify_warp: false,
        audio_notify_warp: 'Soft Chimes 2',

        toggle_notify_idle_keep_notifying: false,
        value_notify_idle_keep_notifying: 30,
    }
    const audio = {
        //Attribution: https://freesound.org/people/InspectorJ/sounds/411089/
        'Bell': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/bell.mp3'), type: 'short'},
        //Attribution: https://www.zapsplat.com/music/ui-notification-tone-glassy-chime-good-for-pop-up-or-other-element-3/
        'Glassy Chime': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/glassy_chime.mp3'), type: 'short'},
        //Attribution: https://www.zapsplat.com/music/ui-notification-tone-glassy-click-good-for-pop-up-or-other-element-4/
        'Glassy Click': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/glassy_click.mp3'), type: 'short'},
        //Attribution: https://www.zapsplat.com/music/notification-or-alert-tone-short-musical-mallet-sound-positive-4/
        'Mallet Short': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/mallet_musical_short.mp3'), type: 'medium'},
        //Attribution: https://www.zapsplat.com/music/notification-or-alert-tone-soft-musical-chimes-positive-success-1/
        'Soft Chimes 1': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/musical_soft_chimes.mp3'), type: 'medium'},
        //Attribution: https://www.zapsplat.com/music/notification-or-alert-tone-soft-musical-chimes-positive-success-3/
        'Soft Chimes 2': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/musical_soft_chimes_2.mp3'), type: 'medium'},
        //Attribution: https://www.zapsplat.com/music/alert-tone-simple-and-basic-warm-soft-synth-complete-success-1/
        'Warm Soft Synth': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/warm_soft_synth.mp3'), type: 'medium'},
        //Attribution: https://www.zapsplat.com/music/game-sound-bright-digital-high-pitched-negative-tone-descend/
        'Medium Tone': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/high_pitched_negative_descend.mp3'), type: 'bad'},
        //Attribution: https://www.zapsplat.com/music/game-sound-bright-digital-short-negative-tone-2/
        'Short Tone': {audio: new Audio('https://raw.githubusercontent.com/grabz-dev/stuff/main/audio/alert/short_negative.mp3'), type: 'bad'},
    }

    const default_page_title = 'dontkickthedog - Twitch';
    const timers = new TimerManager();
    const observer = new MutationObserver(observerCallback);
    //Start this off as true. This is because the script can only load when navigating to www.twitch.tv/dontkickthedog
    var global_in_dktd = true;

    //Load the script
    if(document.readyState !== 'loading') load();
    else document.addEventListener('DOMContentLoaded', () => load());

    function load() {
        const style = document.createElement("style")
        style.innerText = addon_css;
        document.head.appendChild(style);

        timers.addTimer(new TimerIdle(0, 'idle', 0, '🕑', true));

        //Start timer loop
        loop();

        console.log('DKTD Cooldown Display - Script loaded');
    }

    function loop() {
        //Repeat loop
        setTimeout(loop, 1000);

        //Detect whether we are in the DKTD page or not
        const in_dktd = window.location.pathname.toLowerCase().indexOf('dontkickthedog') > -1;

        //If we've already processed the page switch event below, just exit
        if(!in_dktd && in_dktd === global_in_dktd) return;

        //Refresh timers
        //The in_dktd check prevents a race condition that makes TimerManager sometimes change the title
        //after the page's already been switched
        if(in_dktd) timers.refresh();

        //Check if all required Twitch elements are still in the DOM
        //If not, find all required Twitch elements
        //Twitch frequently rebuilds the chat window in various circumstances
        //so we have to expect any and all of the Twitch elements to eventually be detached
        //If the chat is popped out, the loop will simply never progress past this check
        for(let key of Object.keys(elements.twitch)) {
            if(isDetached(elements.twitch[key][0])) {
                elements.twitch[key][0] = document.querySelector(elements.twitch[key][1]);
                if(elements.twitch[key][0] == null) {
                    return;
                }
            }
        }

        //Handle page switch event
        if(in_dktd !== global_in_dktd) {
            //Handle a scenario where the user switches away from the DKTD page
            if(!in_dktd && global_in_dktd) {
                if(elements.custom.holder != null && !isDetached(elements.custom.holder))
                    elements.custom.holder.remove();
            }

            //Finally, make sure these match at the end
            global_in_dktd = in_dktd;
            //Exit, so the custom container isn't rebuilt
            return;
        }
        

        //Rebuild our custom container and all elements within if it is detached
        if(isDetached(elements.custom.holder)) {
            elements.custom.holder = document.createElement('div');
            elements.twitch.container[0].prepend(elements.custom.holder);

            elements.custom.holder.innerHTML = holder_html;
            
            //Create use specific containers and add them to our container
            elements.custom.holder_item = elements.custom.holder.querySelector('[data-dktd=holder_item]');
            elements.custom.holder_idle = elements.custom.holder.querySelector('[data-dktd=holder_idle]');
            elements.custom.holder_sorry = elements.custom.holder.querySelector('[data-dktd=holder_sorry]');
            elements.custom.text_volume = elements.custom.holder.querySelector('[data-dktd=text_volume]');
            elements.custom.slider_volume = elements.custom.holder.querySelector('[data-dktd=slider_volume]');
            elements.custom.toggle_notify_idle = elements.custom.holder.querySelector('[data-dktd=toggle_notify_idle]');
            elements.custom.audio_notify_idle = elements.custom.holder.querySelector('[data-dktd=audio_notify_idle]');
            elements.custom.toggle_notify_idle_keep_notifying = elements.custom.holder.querySelector('[data-dktd=toggle_notify_idle_keep_notifying]');
            elements.custom.value_notify_idle_keep_notifying = elements.custom.holder.querySelector('[data-dktd=value_notify_idle_keep_notifying]');
            elements.custom.toggle_notify_bone = elements.custom.holder.querySelector('[data-dktd=toggle_notify_bone]');
            elements.custom.audio_notify_bone = elements.custom.holder.querySelector('[data-dktd=audio_notify_bone]');
            elements.custom.toggle_notify_golden = elements.custom.holder.querySelector('[data-dktd=toggle_notify_golden]');
            elements.custom.audio_notify_golden = elements.custom.holder.querySelector('[data-dktd=audio_notify_golden]');
            elements.custom.toggle_notify_leave = elements.custom.holder.querySelector('[data-dktd=toggle_notify_leave]');
            elements.custom.audio_notify_leave = elements.custom.holder.querySelector('[data-dktd=audio_notify_leave]');
			elements.custom.toggle_notify_warp = elements.custom.holder.querySelector('[data-dktd=toggle_notify_warp]');
            elements.custom.audio_notify_warp = elements.custom.holder.querySelector('[data-dktd=audio_notify_warp]');
            elements.custom.options_button = elements.custom.holder.querySelector('[data-dktd=options_button]');
            elements.custom.options_panel = elements.custom.holder.querySelector('[data-dktd=options_panel]');
            elements.custom.options_panel_header_close = elements.custom.holder.querySelector('[data-dktd=options_panel_header_close]');

            //Fill audio select elements and add associated events
            for(let obj of [
			{
				elem: elements.custom.audio_notify_idle, 
				type: 'short', 
				setting: 'audio_notify_idle'
			}, {
				elem: elements.custom.audio_notify_bone, 
				type: 'medium', 
				setting: 'audio_notify_bone'
			}, {
				elem: elements.custom.audio_notify_golden, 
				type: 'medium', 
				setting: 'audio_notify_golden'
			}, {
				elem: elements.custom.audio_notify_leave, 
				type: 'bad', 
				setting: 'audio_notify_leave'
			}, {
				elem: elements.custom.audio_notify_warp,
				type: 'medium',
				setting: 'audio_notify_warp'
			}]) {
                let elem = obj.elem;
                let type = obj.type;
                for(let keyval of Object.entries(audio)) {
                    if(keyval[1].type !== type) continue;
                    let option = document.createElement('option');
                    option.value = keyval[0];
                    option.textContent = keyval[0];
                    elem.appendChild(option);
                }
                elem.addEventListener('change', e => {
                    settings[obj.setting] = e.target.value;
                    saveSettings(); 
                    audio[e.target.value].audio.play();
                });
            }

            //Style holder
            elements.custom.holder.style.display = 'flex';
            elements.custom.holder.style.flexFlow = 'column nowrap';
            elements.custom.holder.style.width = '100%';

            //Load settings
            Object.assign(settings, JSON.parse(localStorage.getItem('dktd:settings')));
            //Old version compatibility
            if(typeof localStorage.getItem('dktd:toggle_notify') === 'string') {
                settings.toggle_notify_idle = !!localStorage.getItem('dktd:toggle_notify');
                localStorage.removeItem('dktd:toggle_notify');
            }
            saveSettings();
            
            //Load state
            elements.custom.slider_volume.value = settings.slider_volume;
            onVolumeChanged();
            elements.custom.toggle_notify_idle.checked = !!settings.toggle_notify_idle;
            elements.custom.toggle_notify_bone.checked = !!settings.toggle_notify_bone;
            elements.custom.toggle_notify_golden.checked = !!settings.toggle_notify_golden;
            elements.custom.toggle_notify_leave.checked = !!settings.toggle_notify_leave;
			elements.custom.toggle_notify_warp.checked = !!settings.toggle_notify_warp;
            elements.custom.audio_notify_idle.value = settings.audio_notify_idle;
            elements.custom.audio_notify_bone.value = settings.audio_notify_bone;
            elements.custom.audio_notify_golden.value = settings.audio_notify_golden;
            elements.custom.audio_notify_leave.value = settings.audio_notify_leave;
			elements.custom.audio_notify_warp.value = settings.audio_notify_warp;

            elements.custom.toggle_notify_idle_keep_notifying.checked = !!settings.toggle_notify_idle_keep_notifying;
            elements.custom.value_notify_idle_keep_notifying.value = +settings.value_notify_idle_keep_notifying;

            //Initialize observer
            observer.disconnect();
            observer.observe(elements.twitch.chat[0], { childList: true });

            //Add event listeners
            elements.twitch.chat_send[0].addEventListener('click', e => {
                if(elements.twitch.chat_input[0].textContent.length > 0)
                    messageTyped();
            });
            elements.twitch.chat_input[0].addEventListener('keydown', e => {
                if(elements.twitch.chat_input[0].textContent.length > 0 && e.code === 'Enter')
                    messageTyped();
            });
            elements.custom.slider_volume.addEventListener('input', onVolumeChanged);
            elements.custom.slider_volume.addEventListener('change', onVolumeChanged);
            elements.custom.toggle_notify_idle.addEventListener('input', e => {
                settings.toggle_notify_idle = e.target.checked;
                saveSettings();
            });
            elements.custom.toggle_notify_idle_keep_notifying.addEventListener('input', e => {
                settings.toggle_notify_idle_keep_notifying = e.target.checked;
                saveSettings();
            });
            elements.custom.value_notify_idle_keep_notifying.addEventListener('input', e => {
                e.target.value = e.target.value.replace(/\D/g, '');
                e.target.value = e.target.value.substring(0, 3);

                settings.value_notify_idle_keep_notifying = +e.target.value;
                saveSettings();
            });
            elements.custom.toggle_notify_bone.addEventListener('input', e => {
                settings.toggle_notify_bone = e.target.checked;
                saveSettings();
            });
            elements.custom.toggle_notify_golden.addEventListener('input', e => {
                settings.toggle_notify_golden = e.target.checked;
                saveSettings();
            });
            elements.custom.toggle_notify_leave.addEventListener('input', e => {
                settings.toggle_notify_leave = e.target.checked;
                saveSettings();
            });
			elements.custom.toggle_notify_warp.addEventListener('input', e => {
                settings.toggle_notify_warp = e.target.checked;
                saveSettings();
            });
            elements.custom.options_button.addEventListener('click', e => {
                if(e.target === e.currentTarget) {
                    const elem = elements.custom.options_panel;
                    elem.style.display = elem.style.display === 'none' || elem.style.display === '' ? 'initial' : 'none';
                }
            });
            elements.custom.options_panel_header_close.addEventListener('click', e => {
                elements.custom.options_panel.style.display = 'none';
            });
        }
    }

    function observerCallback(mutations, observer) {
        for(const mutation of mutations) {
            for(const node of mutation.addedNodes) {
                let str = node.textContent;

                //Exit if dktdbot haven't typed the message
                {
                    let ffz_check = node.getAttribute('data-user') === 'dktdbot';
                    let vanilla_elem = node.querySelector('[data-a-target="chat-message-username"]');
                    let vanilla_check = vanilla_elem ? vanilla_elem.getAttribute('data-a-user') === 'dktdbot' : false;

                    if(!(ffz_check || vanilla_check)) continue;
                }

                //Play audio if dog bone leveled up
                if(settings.toggle_notify_bone && str.indexOf('The Dog has reached') > -1) {
                    audio[settings.audio_notify_bone].audio.play();
                }

                //Play audio if golden dog started
                if(settings.toggle_notify_golden && str.indexOf('Golden Dog!') > -1) {
                    audio[settings.audio_notify_golden].audio.play();
                }

                //Play audio if dog is leaving
                if(settings.toggle_notify_leave) {
                    if(str.toLowerCase().indexOf('the dog leaves in') > -1 || str.toLowerCase().indexOf('the dog has left') > -1) {
                        audio[settings.audio_notify_leave].audio.play();
                    }
                }
				
				//Play audio if warp
                if(settings.toggle_notify_warp && str.indexOf('A player has started claiming a Stronghold Portal') > -1) {
                    audio[settings.audio_notify_warp].audio.play();
                }
        
                //Exit if the logged in user was not mentioned
                {
                    let ffz_check = node.querySelector('.ffz--mention-me') == null;
                    let vanilla_check = node.querySelector('.mention-fragment--recipient') == null;

                    if(ffz_check && vanilla_check) continue;
                }
        
                
                //Exit if the message does not contain the proper keywords

                //Check for `use` command
                //Reference messages:
                //"used (ADA) [1⭐Rapid Cop] ...and 1 other Items. You have 2 Items on 🕒Cooldown. (50s) (115s)"
                //"You have 1 Items on 🕒Cooldown. (28s)"
                if(str.indexOf('Items on') > -1 && str.indexOf('Cooldown') > -1) {
                    //Split the item use message so we only keep the cooldowns part
                    //e.g. (120s) (143s) (68s) (69s) (60s)
                    str = node.textContent.split('Cooldown')[1];

                    //Split into an array
                    let arr = str.split('(');
                    arr.splice(0, 1);

                    //Reset the cooldown timers
                    timers.deleteTimers('item');

                    //Build new cooldown timers
                    for(let i = 0; i < arr.length; i++) {
                        let cooldown = +(arr[i].replaceAll(',', '').match(/\d+/g));
                        timers.addTimer(new TimerBasic(2, 'item', cooldown * 1000, '⚔', true));
                    }
                }
                //Check for `sorry` command
                //Reference message: "is now on Probation, and cannot KICK for 2 minutes."
                else if(str.indexOf('is now on Probation') > -1) {
                    //Refresh timer
                    timers.deleteTimers('sorry');
                    timers.addTimer(new TimerBasic(1, 'sorry', 1000 * 60 * 2, '👮', true));
                }
                //Check for `riot` command
                //Reference message: "You are on Probation for 51s"
                else if(str.indexOf('You are on Probation for') > -1) {
                    //Cut string to just the time
                    str = str.split('Probation for')[1];

                    //Get the remaining time
                    let cooldown = +(arr[i].match(/\d+/g));

                    //Refresh timer
                    timers.deleteTimers('sorry');
                    timers.addTimer(new TimerBasic(1, 'sorry', cooldown * 1000, '👮', true));
                }
            }
        }
    }

    function messageTyped() {
        timers.deleteTimers('idle');
        timers.addTimer(new TimerIdle(0, 'idle', 1000 * 60 * 10, '🕑', true));
    }

    function saveSettings() {
        localStorage.setItem('dktd:settings', JSON.stringify(settings));
    }

    function getFormattedTime(seconds) {
        let hours = Math.floor(seconds / 60 / 60);
        seconds = seconds - hours * 60 * 60;

        let minutes = Math.floor(seconds / 60);
        seconds = seconds - minutes * 60;

        if(hours != 0)
            return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        else if(minutes != 0)
            return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        else
            return `${seconds}`;
    }

    function isDetached(elem) {
        return elem == null || !elem.isConnected;
    }

    function onVolumeChanged() {
        settings.slider_volume = elements.custom.slider_volume.value;
        saveSettings();
        elements.custom.text_volume.textContent = settings.slider_volume;
        audio["Glassy Chime"].audio.play();
        
        for(let obj of Object.values(audio)) {
            obj.audio.volume = settings.slider_volume / 100;
            
        }
    }
})();