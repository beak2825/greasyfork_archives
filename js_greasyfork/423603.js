// ==UserScript==
// @name         Youtube HTML5 Karaoke
// @namespace    https://github.com/heyqule/youtubekaraoke
// @version      1.4.0
// @description  HTML5 Karaoke Vocal Control, support center channel cut on regular MV, left/right channel vocal/instrumental mixed MVs.  Support: Youtube and Bilibili
// @description:zh  HTML5 卡拉OK人声控制，支持常规MV中置声道切换，左右声道人声/器乐混合MV。支持：Youtube 和 Bilibili
// @description:ja  HTML5 カラオケ ボーカル コントロール、通常の MV でのセンター チャンネル カット、左/右チャンネルのボーカル/インストゥルメンタル ミックス MV をサポート。サポート: Youtube, Bilibili
// @author       heyqule
// @license      GPLv3
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @require      https://code.jquery.com/jquery-4.0.0-beta.min.js
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.7.3/build/md5.min.js
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @grant        window.onurlchange
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/423603/Youtube%20HTML5%20Karaoke.user.js
// @updateURL https://update.greasyfork.org/scripts/423603/Youtube%20HTML5%20Karaoke.meta.js
// ==/UserScript==

(function($, md5) {
    'use strict';


    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (string) => string,
            createScript: (string) => string
        });
    }

	const languages={
		"zh":{
            "title": "🎤 控制",
            "off":   "🎤: 关",
            "on":    "🎤: 开",
            "vocal_l1": "人声衰减",
            "vocal_l2": "(左 - 中1 - 中2 - 右)",
            "high_pass": "高通",
            "low_pass": "低通",
            "mic_gain": "🎤 增益",
            "mic_gain_desc": "从浏览器连接的麦克风有明显的延迟。  建议通过音频接口器去控制。",
		},
        //Ja by google translate
        "ja":{
            "title": "🎤 コントロール",
            "off":   "🎤: オフ",
            "on":    "🎤: オン",
            "vocal_l1": "ボーカルの減衰",
            "vocal_l2": "(左 - 中1 - 中2 - 右)",
            "high_pass": "ハイパス",
            "low_pass": "ローパス",
            "mic_gain": "🎤 ゲイン",
            "mic_gain_desc": "ブラウザから接続したマイクの遅延が顕著です。  オーディオインターフェース経由でコントロールすることをお勧めします。",
		},
		"en":{
            "title": "🎤 Controls",
            "off":   "🎤: OFF",
            "on":    "🎤: ON",
            "vocal_l1": "Vocal Attenuation",
            "vocal_l2": "(left - center1 - center2 - right)",
            "high_pass": "High Pass",
            "low_pass": "Low Pass",
            "mic_gain": "🎤 Gain",
            "mic_gain_desc": "Mic connected from browser has noticeable delay.  Recommend to connect mic through an audio interface.",
		},
    }
    let lang = 'en';


    //Youtube Handler
    let mediaElement = 'video.html5-main-video';
    let targetContainer = 'div.ytp-right-controls';
    let UiAttachTo = 'div#primary div#player';
    let youtubeDarkThemeUiAttachTo = 'div#primary div#alerts';
    let buttonTag = '<button />';
    let buttonClass = 'ytp-karaoke-button ytp-button';
    let buttonStyle = 'position: relative; top:-1.5rem; padding-left:1rem; font-size:2rem; cursor: pointer;';
    let urlChangePattern = 'watch';
    let getSongId = function() {
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        return urlParams.get('v');
    }
    let isYoutubeDarkTheme = document.documentElement.hasAttribute('dark');
    let darkThemeTextColor = ' color:#fff;';

    let youtubeLang = document.documentElement.getAttribute('lang');
    if (youtubeLang)
    {
        lang = (youtubeLang.indexOf("-") != -1 ? youtubeLang.split("-")[0] : 'en').toLocaleLowerCase();
    }

    if (/bilibili\.com/.test(window.location.href)) {
        mediaElement = '#bilibili-player video';
        targetContainer = 'div.bpx-player-control-bottom-right';
        UiAttachTo = '#playerWrap';
        buttonTag = '<div />';
        buttonClass = 'bpx-player-ctrl-btn';
        buttonStyle = 'position: relative; margin-right:1rem; font-size:1.5rem; cursor: pointer;';
        urlChangePattern = 'video';
        getSongId = function() {
            let token = window.location.pathname;
            return md5(token);
        }

        if (/bilibili\.com\/bangumi\/play/.test(window.location.href)) {
            targetContainer = 'div.bpx-player-control-bottom-right';
            UiAttachTo = '#bilibili-player-wrap';
            urlChangePattern = 'bangumi/play';
        }
    }


    let KaraokeUI = function ($) {
        let _translate = function(label) {
            return languages[lang][label] ?? languages["en"][label] ?? '{404 locale:'+label+'}';
        }
        let karaokeButton = $(buttonTag,{
            title: _translate('off'),
            id: 'karaoke-button',
            class: buttonClass,
            text: '🎤',
            style: buttonStyle,
            'aria-haspopup': 'true',
            onClick: 'KaraokePluginSwitch();'
        });
        //Control Panel
        let controlPanel, channelAdjustControl, highPassAdjustControl, lowPassAdjustControl, gainAdjustControl;
        let highPassAdjustDisplay, lowPassAdjustDisplay

        return {
            menuUI : function() {
                $(targetContainer).prepend(karaokeButton);
            },
            controlPanelUI : function(channelAdjustedValue, highPassAdjustedValue, lowPassAdjustedValue, gainAdjustedValue) {

                let columnStyle = 'width:33%; display:inline-block;';
                let titleStyle = '';
                if (isYoutubeDarkTheme) {
                    columnStyle += darkThemeTextColor;
                    titleStyle = darkThemeTextColor;
                }

                controlPanel = $('<div>',{
                    id:"karaoke_controlpanel",
                });

                controlPanel.append($('<h3>',{
                    text: _translate('title'),
                    style: titleStyle
                }));

                channelAdjustControl = $('<input>',{
                    type: 'range',
                    id: 'channelshift',
                    min: 0,
                    max: 3,
                    value: channelAdjustedValue,
                    step: 1,
                    onchange: 'KaraokePluginChannelAdjust(this)'
                });
                highPassAdjustControl = $('<input>',{
                    type: 'range',
                    id: 'highpass',
                    min: 50,
                    max: 400,
                    value: highPassAdjustedValue,
                    step: 10,
                    onchange: 'KaraokePluginHighPassAdjust(this)'
                });
                lowPassAdjustControl = $('<input>',{
                    type: 'range',
                    id: 'lowpass',
                    min: 2000,
                    max: 8000,
                    value: lowPassAdjustedValue,
                    step: 200,
                    onchange: 'KaraokePluginLowPassAdjust(this)'
                })
                gainAdjustControl = $('<input>',{
                    type: 'range',
                    id: 'micgain',
                    min: 0,
                    max: 2,
                    value: gainAdjustedValue,
                    step: 0.1,
                    onchange: 'KaraokePluginMicGainAdjust(this)'
                })

                controlPanel.append(
                    $('<div>',{style: columnStyle}).
                    append('<label style="width:100px;">'+_translate('vocal_l1')+':</label><br />').
                    append('<label>'+_translate('vocal_l2')+'</label><br />').
                    append(channelAdjustControl).
                    append('<br />').
                    append('<label style="width:100px;">'+_translate('high_pass')+': <span id="KaraokeHighPassValue">'+highPassAdjustedValue+'</span> Hz</label><br />').
                    append(highPassAdjustControl).
                    append('<br />').
                    append('<label style="width:100px;">'+_translate('low_pass')+': <span id="KaraokeLowPassValue">'+lowPassAdjustedValue+'</span> Hz</label><br />').
                    append(lowPassAdjustControl)
                );


                let secondColumn = $('<div>',{style: columnStyle});

                secondColumn.append('<label style="width:100px;">'+_translate('mic_gain')+': <span id="KaraokeGainValue">'+gainAdjustedValue+'</span></label><br />').
                    append(gainAdjustControl).
                    append('<p>'+_translate('mic_gain_desc')+'</p>');

                controlPanel.append(secondColumn);

                if (isYoutubeDarkTheme) {
                    controlPanel.insertBefore(youtubeDarkThemeUiAttachTo);
                }
                else
                {
                    controlPanel.insertAfter(UiAttachTo);
                }

                highPassAdjustDisplay = $('#KaraokeHighPassValue');
                lowPassAdjustDisplay = $('#KaraokeLowPassValue');

                return controlPanel
            },
            setKaraokeButtonOn: function() {
                karaokeButton.attr('title', _translate('on'));
            },
            setKaraokeButtonOff: function() {
                karaokeButton.attr('title',_translate('off'));
            },
            getChannelAdjustControl: function() {
                return channelAdjustControl
            },
            getHighPassAdjustControl: function() {
                return highPassAdjustControl
            },
            getLowPassAdjustControl: function() {
                return lowPassAdjustControl
            },
            getHighPassAdjustDisplay: function() {
                return highPassAdjustDisplay;
            },
            getLowPassAdjustDisplay: function() {
                return lowPassAdjustDisplay;
            }
        }
    }(jQuery)

    let KaraokePlugin = function ($, KaraokeUI) {

        const MAX_CACHE_SIZE = 5000;
        const MAX_RETRIES = 20;
        const TIME_INTERVAL = 1500;
        //webaudio elements
        let audioContext, audioSource,micAudioContext, micSource;
        let karaokeFilterOn = false;
        let channelAdjustedValue = 1, gainAdjustedValue = 1;
        let highPassAdjustedValue = 200, lowPassAdjustedValue = 6000
        let trackSearchDialog = null;

        let _createBiquadFilter = function(type,freq,qValue)
        {
            let filter = audioContext.createBiquadFilter();
            filter.type = type;
            filter.frequency.value = freq;
            filter.Q.value = qValue;
            return filter;
        }

        /**
         *  Cut common vocal frequencies @ center
         *  Algo origin: https://github.com/stanton119/YouTube-Karaoke
         */
        let _cutCenterV1 = function()
        {
            //cutoff frequencies
            let f1 = highPassAdjustedValue;
            let f2 = lowPassAdjustedValue;
            console.log('setting center cut v1 @'+f1+' - '+f2);
            //splitter and gains
            let splitter, gainL, gainR;
            //biquadFilters
            let filterLP1, filterHP1, filterLP2, filterHP2;
            let filterLP3, filterHP3, filterLP4, filterHP4;
            //phase inversion filter
            splitter = audioContext.createChannelSplitter(2);
            gainL = audioContext.createGain();
            gainR = audioContext.createGain();
            gainL.gain.value = 1;
            gainR.gain.value = -1;
            splitter.connect(gainL, 0);
            splitter.connect(gainR, 1);
            gainL.connect(audioContext.destination);
            gainR.connect(audioContext.destination);
            //biquad filters
            filterLP1 = _createBiquadFilter("lowpass",f2,1);
            filterLP2 = _createBiquadFilter("lowpass",f1,1);
            filterLP3 = _createBiquadFilter("lowpass",f2,1);
            filterLP4 = _createBiquadFilter("lowpass",f1,1);

            filterHP1 = _createBiquadFilter("highpass",f1,1);
            filterHP2 = _createBiquadFilter("highpass",f2,1);
            filterHP3 = _createBiquadFilter("highpass",f1,1);
            filterHP4 = _createBiquadFilter("highpass",f2,1);
            //connect filters
            audioSource.connect(filterLP1);
            audioSource.connect(filterLP2);
            audioSource.connect(filterHP2);
            filterLP1.connect(filterLP3);
            filterLP3.connect(filterHP1);
            filterHP1.connect(filterHP3);
            filterHP3.connect(splitter);
            filterLP2.connect(filterLP4);
            filterLP4.connect(audioContext.destination);
            filterHP2.connect(filterHP4);
            filterHP4.connect(audioContext.destination);
        }

        /**
         *  Cut common vocal frequencies @ center with preserve stereo field
         *  Algo origin: https://github.com/stanton119/YouTube-Karaoke
         */
        let _cutCenterV2 = function()
        {
            //cutoff frequencies
            let f1 = highPassAdjustedValue;
            let f2 = lowPassAdjustedValue;

            console.log('setting center cut with stereo field @'+f1+' - '+f2);
            // stereo conversion
            let merger = audioContext.createChannelMerger(2);
            merger.connect(audioContext.destination);

            // L_Out = (Mid+side)/2
            let gainNodeMS1_05 = audioContext.createGain();
            gainNodeMS1_05.gain.value = 0.5;
            gainNodeMS1_05.connect(merger,0,0);

            // R_Out = (Mid-side)/2
            let gainNodeMS2_05 = audioContext.createGain();
            gainNodeMS2_05.gain.value = 0.5;
            gainNodeMS2_05.connect(merger,0,1);

            let gainNodeS_1 = audioContext.createGain();
            gainNodeS_1.gain.value = -1;
            gainNodeS_1.connect(gainNodeMS2_05);

            // create band stop filter using two cascaded biquads
            // inputs -> FilterLP1 & FilterLP2
            // outputs -> splitter & destinations

            // Bandstop filter = LP + HP
            let FilterLP1 = _createBiquadFilter('lowpass', f1, 1);
            let FilterLP2 = _createBiquadFilter('lowpass', f1, 1);
            FilterLP1.connect(FilterLP2);

            let FilterHP1 = _createBiquadFilter('highpass', f2, 1);
            let FilterHP2 = _createBiquadFilter('highpass', f2, 1);
            FilterHP1.connect(FilterHP2);

            // connect filters to left and right outputs
            FilterLP2.connect(gainNodeMS1_05);
            FilterHP2.connect(gainNodeMS1_05);
            FilterLP2.connect(gainNodeMS2_05);
            FilterHP2.connect(gainNodeMS2_05);

            // band pass with gain, adds mids into the side channel
            let gainNodeBP = audioContext.createGain();
            gainNodeBP.gain.value = 1;
            let FilterBP1 = _createBiquadFilter('lowpass', f2, 1);
            let FilterBP2 = _createBiquadFilter('lowpass', f2, 1);
            FilterBP2.connect(FilterBP1);

            let FilterBP3 = _createBiquadFilter('highpass', f1, 1);
            FilterBP3.connect(FilterBP2);

            let FilterBP4 = _createBiquadFilter('highpass', f1, 1);
            FilterBP4.connect(FilterBP3);

            FilterBP1.connect(gainNodeBP);
            gainNodeBP.connect(gainNodeS_1);
            gainNodeBP.connect(gainNodeMS1_05);

            // mid-side conversion
            // split into L/R
            let splitter = audioContext.createChannelSplitter(2);
            // mid = L+R
            splitter.connect(FilterLP1,0); // // L->filter
            splitter.connect(FilterHP1,0);
            splitter.connect(FilterLP1,1); // R->filter
            splitter.connect(FilterHP1,1);

            // side = L-R, 2 outputs, 2 destinations
            let gainNodeR_1 = audioContext.createGain();
            gainNodeR_1.gain.value = -1;
            splitter.connect(gainNodeR_1,1);

            gainNodeR_1.connect(gainNodeS_1);
            splitter.connect(gainNodeS_1,0);
            gainNodeR_1.connect(gainNodeMS1_05);
            splitter.connect(gainNodeMS1_05,0);

            gainNodeR_1.connect(FilterBP4);
            splitter.connect(FilterBP4,0);
            audioSource.connect(splitter);
        }

        /**
         * Expand left channel to both channel, drop right channel
         */
        let _cutRight = function()
        {
            console.log('setting right cut');
            let splitter, merger;
            splitter = audioContext.createChannelSplitter(2);
            merger = audioContext.createChannelMerger(1);
            splitter.connect(merger, 0);
            audioSource.connect(splitter);
            merger.connect(audioContext.destination);
        }

        /**
         * Expand right channel to both channel, drop left channel
         */
        let _cutLeft = function()
        {
            console.log('setting left cut');
            let splitter,merger;
            splitter = audioContext.createChannelSplitter(2);
            merger = audioContext.createChannelMerger(1);
            splitter.connect(merger, 1);
            audioSource.connect(splitter);
            merger.connect(audioContext.destination);
        }

        /**
         * Handle Microphone gain.  This only applicable to mic that connected to browser.
         * @param amount
         * @private
         */
        let _micGain = function(amount)
        {
            let gainElement = $('#KaraokeGainValue')
            gainElement.html(amount);
            console.log(gainElement.html());

            micSource.disconnect();

            let micGain = micAudioContext.createGain();
            micSource.connect( micGain );
            micGain.connect( micAudioContext.destination );
            micGain.gain.value = amount;
            micSource.connect( micAudioContext.destination );
        }

        /**
         * 0 = left cut, 1 = center cut v2, 2 = center cut v1, 2 = right cut
         **/
        let _adjustChannel = function()
        {
            console.log('channelAdjust:'+channelAdjustedValue);
            _disconnectProcessors();
            switch(channelAdjustedValue) {
                case 0:
                    _cutLeft();
                    break;
                case 1:
                    _cutCenterV2();
                    break;
                case 2:
                    _cutCenterV1();
                    break;
                case 3:
                    _cutRight();
                    break;
            }

            _saveSetting();
        }

        let _disconnectProcessors = function() {
            console.log('disconnect audio processors');
            audioSource.disconnect();
        }

        let _getSongId = function() {
            return getSongId();
        }

        let _loadSetting = function() {
            let songId = _getSongId();
            if(typeof songId === undefined || songId === null) {
                return;
            }
            let localSetting = localStorage.getItem(songId);
            let savedItem = null;
            if(localSetting !== null) {
                savedItem = JSON.parse(localSetting);
            }
            console.log("Loading "+songId, savedItem);
            if(savedItem !== null) {
                touchLocalStorage(songId, savedItem);
            }
        }

        let touchLocalStorage = function(songId, savedItem) {
            channelAdjustedValue = savedItem.cv;
            lowPassAdjustedValue = savedItem.lpv;
            highPassAdjustedValue = savedItem.hpv;

            savedItem.date = Date.now();
            localStorage.setItem(songId, JSON.stringify(savedItem));
        }

        let _readjustControls = function() {
            KaraokeUI.getChannelAdjustControl().val(channelAdjustedValue);
            KaraokeUI.getHighPassAdjustControl().val(highPassAdjustedValue);
            KaraokeUI.getLowPassAdjustControl().val(lowPassAdjustedValue);
            KaraokeUI.getHighPassAdjustDisplay().html(highPassAdjustedValue.toString())
            KaraokeUI.getLowPassAdjustDisplay().html(lowPassAdjustedValue.toString())
        }

        let _saveSetting = function() {
            let songId = _getSongId();
            if(songId === null) {
                return;
            }
            let data = {
                cv: channelAdjustedValue,
                lpv: lowPassAdjustedValue,
                hpv: highPassAdjustedValue,
                date: Date.now()
            }
            console.log('Saving Setting: '+songId, data)
            localStorage.setItem(songId, JSON.stringify(data));

            _trimCache();
        }

        let _trimCache = function() {
            if(localStorage.length > MAX_CACHE_SIZE) {
                let sortableArray = [];
                for (let i = 0; i < localStorage.length; i++) {
                    let jsonItem = localStorage.getItem(localStorage.key(i));
                    let item = JSON.parse(jsonItem);
                    if(typeof item.cv !== undefined)
                    {
                        sortableArray[localStorage.key(i)] = {
                            key: localStorage.key(i),
                            data: JSON.parse(localStorage.getItem(localStorage.key(i)))
                        };
                    }
                }
                sortableArray.sort((a, b) => (a.data.date > b.data.date) ? 1 : -1);
                for (let i = 0; i < MAX_CACHE_SIZE/5; i++) {
                    localStorage.removeItem(sortableArray[i].key);
                }
            }
        }

        let _connectAudio = function(element) {
            //setup audio routing
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
                audioSource = audioContext.createMediaElementSource(element);
                audioSource.connect(audioContext.destination);
            } catch (e) {
                console.error('Media element not found.');
                console.error(e.message);
            }
        }

        let _getVideoElement = function(mediaElement) {
            let element = $(mediaElement)
            if (typeof $(mediaElement)[0] !== 'undefined') {
                element = $(mediaElement)[0]
            }
            return element;
        }

        return {
            setupAudioSource : function ()
            {
                if(typeof _getVideoElement(mediaElement).tagName === 'undefined')
                {
                    console.log('audio connecting via interval');
                    var retries = 0;
                    var intervalId = setInterval(function() {
                        console.log('audio connect retry: '+retries);
                        if(retries > 10) {
                            clearInterval(intervalId);
                            return this;
                        }
                        console.log(_getVideoElement(mediaElement));
                        if(_getVideoElement(mediaElement).tagName === 'VIDEO') {
                            console.log('audio connected');
                            _connectAudio(_getVideoElement(mediaElement));
                            clearInterval(intervalId);
                            return this;
                        }
                        retries++;
                    }, TIME_INTERVAL);
                }
                else
                {
                    console.log('audio connected immediately');
                    _connectAudio(_getVideoElement(mediaElement));
                }
                return this;
            },
            setupMic: function() {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(function(stream) {
                        /* use the stream */
                        window.AudioContext = window.AudioContext || window.webkitAudioContext;
                        micAudioContext = new AudioContext();
                        console.log('Mic Latency:'+micAudioContext.baseLatency);

                        // Create an AudioNode from the stream.
                        micSource = micAudioContext.createMediaStreamSource( stream );

                        // Connect it to the destination to hear yourself (or any other node for processing!)
                        micSource.connect( micAudioContext.destination );
                    })
                    .catch(function(err) {
                        /* handle the error */
                    });

                return this;
            },
            setupMenu: function()
            {
                if($(targetContainer).length === 0)
                {
                    console.log('menu connecting via interval');
                    var retries = 0;
                    var intervalId = setInterval(function() {
                        console.log('menu retry: '+retries);
                        if(retries > 10) {
                            clearInterval(intervalId);
                            return this;
                        }
                        if($(targetContainer).length > 0) {
                            console.log('audio connected');
                            KaraokeUI.menuUI();
                            clearInterval(intervalId);
                            return this;
                        }
                        retries++;
                    }, TIME_INTERVAL);
                }
                else
                {
                    console.log('menu connected immediately');
                    KaraokeUI.menuUI();
                }
            },
            filterOn: function() {
                console.log("Removing vocals");
                _adjustChannel();
                return this;
            },
            filterOff: function() {
                console.log("Adding in vocals");
                _disconnectProcessors();
                audioSource.connect(audioContext.destination);
                return this;
            },
            switch: function()
            {
                if(karaokeFilterOn)
                {
                    karaokeFilterOn = false;
                    this.filterOff();
                    KaraokeUI.setKaraokeButtonOff();
                    this.removeControlPanel();
                }
                else
                {
                    karaokeFilterOn = true;
                    this.filterOn();
                    KaraokeUI.setKaraokeButtonOn();
                    this.showControlPanel();
                }

                return this;
            },
            showControlPanel: function()
            {
                console.log('showpanel');
                this.controlPanel = KaraokeUI.controlPanelUI(channelAdjustedValue,
                    highPassAdjustedValue, lowPassAdjustedValue, gainAdjustedValue);
                _loadSetting();
                return this;
            },
            removeControlPanel: function()
            {
                console.log('hidepanel');
                this.controlPanel.remove();

                return this;
            },
            isFilterOn: function() {
                return karaokeFilterOn;
            },
            micGainAdjust: function(element)
            {
                gainAdjustedValue = $(element).val();
                _micGain(gainAdjustedValue);

                return this;
            },
            channelAdjust: function(element)
            {
                channelAdjustedValue = parseInt($(element).val());
                _adjustChannel();

                return this;
            },
            highPassAdjust: function(element)
            {
                highPassAdjustedValue = parseInt($(element).val());
                KaraokeUI.getHighPassAdjustDisplay().html(highPassAdjustedValue.toString());
                _adjustChannel()
                return this;
            },
            lowPassAdjust: function(element)
            {
                lowPassAdjustedValue = parseInt($(element).val());
                KaraokeUI.getLowPassAdjustDisplay().html(lowPassAdjustedValue.toString());
                _adjustChannel()
                return this;
            },
            loadSetting: function() {
                _loadSetting();
            }
        };
    }(jQuery, KaraokeUI);

    if (typeof audioContext === 'undefined') {
        console.log(mediaElement);
        console.log(targetContainer);
        console.log(UiAttachTo);
        console.log("Loading setting");
        KaraokePlugin.loadSetting();
        console.log("setting up mic");
        KaraokePlugin.setupMic();
        console.log("setting up audio source");
        KaraokePlugin.setupAudioSource(mediaElement);
        console.log("setting up menu");
        KaraokePlugin.setupMenu(targetContainer);

        unsafeWindow.KaraokePluginSwitch = function() {
            KaraokePlugin.switch();
        }
        unsafeWindow.KaraokePluginMicGainAdjust = function(element) {
            KaraokePlugin.micGainAdjust(element);
        }
        unsafeWindow.KaraokePluginChannelAdjust = function(element) {
            KaraokePlugin.channelAdjust(element);
        }
        unsafeWindow.KaraokePluginHighPassAdjust = function(element) {
            KaraokePlugin.highPassAdjust(element);
        }
        unsafeWindow.KaraokePluginLowPassAdjust = function(element) {
            KaraokePlugin.lowPassAdjust(element);
        }
    }

    window.addEventListener("popstate", (event) => {
        console.log('Event: popstate, reload setting');
        KaraokePlugin.loadSetting();
        if(KaraokePlugin.isFilterOn()) {
            KaraokePlugin.switch();
            KaraokePlugin.switch();
        }
    });

    if (window.onurlchange === null) {
        console.log('Url Change Event. Setup');
        window.addEventListener('urlchange', (info) => {
             console.log('Url Changed, reload setting.');
             if (window.location.href.includes(urlChangePattern)) {
                KaraokePlugin.loadSetting();
                if(KaraokePlugin.isFilterOn()) {
                    KaraokePlugin.switch();
                    KaraokePlugin.switch();
                }
            }
        });
    }


})(jQuery, md5);
