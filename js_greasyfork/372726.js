// ==UserScript==
// @name           Memrise Audio Provider
// @description    Automatically generates Audio for items you're learning. Configure in left panel.
// @match          https://*.memrise.com/course/*/garden/*
// @match          https://*.memrise.com/garden/review/*
// @run-at         document-end
// @version        1.1.4
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/372726/Memrise%20Audio%20Provider.user.js
// @updateURL https://update.greasyfork.org/scripts/372726/Memrise%20Audio%20Provider.meta.js
// ==/UserScript==

// Based on https://github.com/cooljingle/memrise-audio-provider

function main() {

  // This script has three different methos to generate audio
  // Speech Synthesis API
  const SPEECHSYNTHESIS_LANG = {
    "German": "de-DE",
    "English": "en-GB",
    "Spanish (Mexico)": "es-ES",
    "Spanish (Spain)": "es-ES",
    "French": "fr-FR",
    "Hindi": "hi-IN",
    "Indonesian": "id-ID",
    "Italian": "it-IT",
    "Japanese": "ja-JP",
    "Kanji": "ja-JP",
    "Korean": "ko-KR",
    "Dutch": "nl-NL",
    "Polish": "pl-PL",
    "Portuguese (Brazil)": "pt-BR",
    "Russian": "ru-RU",
    "Chinese (Simplified)": "zh-CN",
    "Cantonese": "zh-HK",
    "Chinese (Traditional)": "zh-TW"
  };

  // Google TTS API
  const GOOGLETTS_LANG = {
    "Afrikaans": "af",
    "Albanian": "sq",
    "Arabic": "ar",
    "Armenian": "hy",
    "Bengali": "bn",
    "Bosnian": "bs",
    "Catalan": "ca",
    "Chinese (Simplified)": "zh-CN",
    "Chinese (Traditional)": "zh-TW",
    "Croatian": "hr",
    "Czech": "cs",
    "Danish": "da",
    "Dutch": "nl",
    "English": "en",
    "Esperanto": "eo",
    "Finnish": "fi",
    "French": "fr",
    "German": "de",
    "Greek": "el",
    "Hindi": "hi",
    "Hungarian": "hu",
    "Icelandic": "is",
    "Indonesian": "id",
    "Italian": "it",
    "Japanese": "ja",
    "Kanji": "ja",
    "Khmer": "km",
    "Korean": "ko",
    "Latin": "la",
    "Latvian": "lv",
    "Macedonian": "mk",
    "Nepali": "ne",
    "Norwegian": "no",
    "Polish": "pl",
    "Portuguese (Brazil)": "pt-BR",
    "Portuguese (Portugal)": "pt-PT",
    "Romanian": "ro",
    "Russian": "ru",
    "Serbian": "sr",
    "Sinhalese": "si",
    "Slovak": "sk",
    "Spanish (Mexico)": "es",
    "Spanish (Spain)": "es",
    "Swahili": "sw",
    "Swedish": "sv",
    "Tamil": "ta",
    "Thai": "th",
    "Turkish": "tr",
    "Ukrainian": "uk",
    "Vietnamese": "vi",
    "Welsh": "cy"
  };

  // Voice RSS API
  const VOICERSS_LANG = {
    "Catalan": "ca-es",
    "Chinese (Simplified)": "zh-cn",
    "Chinese (Traditional)": "zh-tw",
    "Danish": "da-dk",
    "Dutch": "nl-nl",
    "English": "en-gb",
    "fi-fi": "fi",
    "French": "fr-fr",
    "German": "de-de",
    "Italian": "it-it",
    "Japanese": "ja-jp",
    "Kanji": "ja-jp",
    "Korean": "ko-kr",
    "Norwegian": "nb-no",
    "Polish": "pl-pl",
    "Portuguese (Brazil)": "pt-br",
    "Portuguese (Portugal)": "pt-pt",
    "Russian": "ru-ru",
    "Spanish (Mexico)": "es-es",
    "Spanish (Spain)": "es-es",
    "Swedish": "sv-se"
  };

  const LOCALSTORAGE_ID         = "memrise-audio-provider-storagev2",
        LOCALSTORAGE_VOICERSSID = "memrise-audio-provider-voicerss",
        LOCALSTORAGE_OVERRIDEID = "memrise-audio-provider-override-all",
        NONE                    = "-- None";

  var AudioProvider = {

    /**
     * Entrypoint
     */
    init: function(){

      // Check current referer
      this.referrerState          = "";
      this.requestCount           = 0;
      this.watchNetwork();

      // Which API to use ?
      this.speechSynthesis        = window.speechSynthesis && new window.SpeechSynthesisUtterance();
      this.speechSynthesisPlaying = false;

      this.canSpeechSynthesize    = true;
      this.canGoogleTts           = true;
      this.canVoiceRss            = true;

      // Current state
      this.language               = null; // current language (label)
      this.courseId               = null; // current course id
      this.wordColumn             = null; // name of field containing word
      this.currentItem            = null; // current item to refresh current word when changing settings
      this.currentWord            = "";   // current word
      this.cachedAudioElements    = [];   // cached audio DOMElements

      // Add Meta to get Google TTS working
      var meta     = document.createElement('meta');
      meta.name    = "referrer";
      meta.content = "origin";
      document.getElementsByTagName('head')[0].appendChild(meta);

      // Add AudioProvider to window
      this.add_settings();

      if(MEMRISE.garden.session) {
        this.override_memrise();

      } else if(MEMRISE.garden._events && MEMRISE.garden._events.start) {
        MEMRISE.garden._events.start.push(this.override_memrise.bind(this));

      } else {
      	setTimeout(function(){
          this.override_memrise();
        }.bind(this), 1000);
      }
    },

    //+------------------------------------------------------
    //|
    //| SETTINGS
    //|
    //+------------------------------------------------------

    /**
     * Add Settings block to left area
     */
    add_settings: function(){

      // Retrieve saved settings
      this.savedChoices           = JSON.parse(localStorage.getItem(LOCALSTORAGE_ID)) || {};
      this.voiceRssKey            = localStorage.getItem(LOCALSTORAGE_VOICERSSID) || "";
      this.overrideAllAudio       = localStorage.getItem(LOCALSTORAGE_OVERRIDEID) === "true";

      if(!this.voiceRssKey) {
        this.canVoiceRss = false;
      }

      // Add "audio provider" settings to left area
      var div = document.createElement('div'),
          linkHtml = `
      <p id='audio-provider-link'>Audio Provider</p>

      <div id='audio-provider-box' style='display:none'>
                <div style='display:table; padding: 5px; background: rgba(255,255,255,0.6);'>
          <em style='font-size:85%; white-space: nowrap;'>Column to use:</em><br>
          <select id='audio-provider-options'></select>

          <em style='font-size:85%; white-space: nowrap;'>Override all audio:</em>
          <input id='audio-provider-override'
                 type="checkbox" ${this.overrideAllAudio ? 'checked="checked"': ''}>

          <em style='font-size:85%; white-space: nowrap;'>Voice RSS key:</em><br>
          <input id='audio-provider-voicerss'
                 type='text' placeholder='enter Voice RSS key'
                 value="${this.voiceRssKey.replace(/"/g, '\"')}"
                 style='width: 150px; padding: 8px;'>
                </div>
      </div>`;
      div.innerHTML = linkHtml;
      document.getElementById('left-area').appendChild(div);

      // Show/hide settings
      document.getElementById('audio-provider-link').addEventListener('click', function () {
        var box = document.getElementById('audio-provider-box');

        box.style.display = (box.style.display == "none" ? "block" : "none");
      });

      // User changes settings
      document.getElementById('audio-provider-voicerss').addEventListener('change', function () {
        localStorage.setItem(LOCALSTORAGE_VOICERSSID, this.value);
      });
      document.getElementById('audio-provider-override').addEventListener('change', function () {
        var checked = this.checked;

        AudioProvider.overrideAllAudio = checked;
        localStorage.setItem(LOCALSTORAGE_OVERRIDEID, checked);
      });
      document.getElementById('audio-provider-options').addEventListener('change', function () {
        var wordColumn = this.value;

        AudioProvider.wordColumn = wordColumn;
        AudioProvider.savedChoices[AudioProvider.courseId] = wordColumn;
        localStorage.setItem(LOCALSTORAGE_ID, JSON.stringify(AudioProvider.savedChoices));

        AudioProvider.updateCurrentWord();
      });
    },

    /**
     * Set speechSynthesis language
     * Called by MEMRISE when ready (cf override_memrise)
     */
    init_speechSynthesis: function(){
      if(!this.speechSynthesis || !this.canSpeechSynthesize) {
        return;
      }
      var langCode = SPEECHSYNTHESIS_LANG[this.language];

      this.speechSynthesis.lang  = langCode || "";
      this.speechSynthesis.voice = speechSynthesis.getVoices().filter(function (voice) {
        return voice.lang === langCode;
      })[0];
      this.canSpeechSynthesize = !!(this.speechSynthesis.lang && this.speechSynthesis.voice);
    },

    /**
     * @param object context
     */
    set_content: function(context) {
      if (context.template == "end_of_session" || context.template == "speed-count-down") {
        return;
      }

      // Which field to use to generate audio ?
      var courseId = context.course_id
        || MEMRISE.garden.session_params.course_id
        || MEMRISE.garden.session_data.learnables_to_courses[context.learnable.learnable_id];

      if (this.courseId != courseId) {
        this.courseId   = courseId;
        this.wordColumn = this.savedChoices[courseId]
          || (context.learnable.item.kind == "text" ? context.learnable.item.label
              : (context.learnable.definition.kind == "text" ? context.learnable.definition.label
                : NONE));

        this.editAudioOptions(context.learnable);
      }

      // Set current word
      if (!this.canSpeechSynthesize && !this.canGoogleTts && !this.canVoiceRss){
        document.getElementById('audio-provider-link').style.display = "none";

        log("could not find a way to generate audio for language " + language);
        return;
      }

      this.currentItem = {
      	item:       context.learnable.item,
        definition: context.learnable.definition,
        audio     : (context.presentationData || context.testData).audio.value
      };
      this.updateCurrentWord(context);
    },

    /**
     * Populate settings content
     * Called by MEMRISE whenever we change current course (cf make_box > set_content)
     *
     * @param object word
     */
    editAudioOptions: function(word) {
      var html = `<option value="${NONE}">${NONE}</option>`;
      if(word.definition.kind == "text") {
        html += `<option value="${word.definition.label}">${word.definition.label}</option>`;
      }
      if(word.item.kind == "text") {
        html += `<option value="${word.item.label}">${word.item.label}</option>`;
      }

      var options       = document.getElementById('audio-provider-options');
      options.innerHTML = html;
      options.value     = this.wordColumn;
    },

    /**
     * Update currentWord
     * Called by MEMRISE when rendering word (cf make_box > set_content)
     * And by AudioProvider when updating wordColumn
     */
    updateCurrentWord: function() {
      var item = this.currentItem;
      if(!item) {
      	return;
      }

      // Should we generate audio ?
      var handleAudio = this.overrideAllAudio
      	|| (_.isArray(item.audio) ? item.audio[0] : item.audio).normal === "AUDIO_PROVIDER";

      if(!handleAudio || this.wordColumn === NONE) {
        this.currentWord = "";
        return;
      }

      // Get word
      this.currentWord = _.find([item.definition, item.item], x => x.label === this.wordColumn).value;

      // GoogleTTS: preload as we change referrer header while loading (we don't want to conflict with memrise calls)
      if (!this.canSpeechSynthesize && this.canGoogleTts) {
        this.getGoogleTtsElement(this.currentWord);
      }
    },

    //+------------------------------------------------------
    //|
    //| OVERRIDE MEMRISE
    //|
    //+------------------------------------------------------

    /**
     * Override Memrise functions with our owns
     */
    override_memrise: function(){

      // Override MEMRISE's functions
      this.cached = {
        make_box    : MEMRISE.garden.session.make_box,
        fixMediaUrl : MEMRISE.renderer.fixMediaUrl,
        play        : MEMRISE.audioPlayer.play
      };

      MEMRISE.garden.session.make_box = this.make_box;
      MEMRISE.renderer.fixMediaUrl    = this.fixMediaUrl;
      MEMRISE.audioPlayer.play        = this.play;

      // Populate audio
      this.language = MEMRISE.garden.session.category.name;
      this.init_speechSynthesis();
      this.populateScreenAudios();

      // Manually call make_box if MEMRISE already loaded content
      if(MEMRISE.garden.box) {
        this.set_content(MEMRISE.garden.box);

        // Add audio player to window
        var columns = document.querySelector('.columns');

        // Presentation
        if(columns) {
          if(!columns.querySelector('.first-audio')) {
            var div = document.createElement('div');
            div.setAttribute('class', 'row column first-audio');
            div.innerHTML =  '<div class="row-value"><a class="audio-player audio-player-hover" href=""></a></div>';
            columns.appendChild(div);
          }

        // Multi-choice/typing/tapping
        } else {
          var audio = document.querySelector('.hidden-audio');
          if(audio && audio.children.length == 0) {
            audio.innerHTML = '<a class="audio-player audio-player-hover" href=""></a>';
          }
        }
      }
    },

    populateScreenAudios: function() {
      var learnables = MEMRISE.garden.learnables
        || _.indexBy(MEMRISE.garden.session_data.learnables, 'learnable_id');

      _.each(learnables, function(v, k) {
        var learnableScreens = (MEMRISE.garden.screens || MEMRISE.garden.session_data.screens)[k],
            screenMap        = MEMRISE.garden.screen_template_map[k];

        _.each([learnableScreens, screenMap], screens => {
          _.each(screens, s => {
            s = _.isArray(s) ? s[0] : s;

            var hasAudio = s.audio && s.audio.value && s.audio.value.length;
            if(!hasAudio){
              s.audio = {
                alternatives: [],
                direction: "target",
                kind: "audio",
                label: "Audio",
                style: [],
                value: [{
                  normal: "AUDIO_PROVIDER",
                  slow: "AUDIO_PROVIDER"
                }]
              };
            } // end if
          });
        });

      });
    },

    /**
     * @return string
     */
    make_box: function(){
      var context = AudioProvider.cached.make_box.apply(this, arguments);

      AudioProvider.set_content(context);
      return context;
    },

    /**
     * @return string
     */
    fixMediaUrl: function () {
      if (AudioProvider.overrideAllAudio
          || arguments[0] === "AUDIO_PROVIDER"
          || (_.isArray(arguments[0]) && arguments[0][0] === "AUDIO_PROVIDER")) {
        return "";
      } else {
        return AudioProvider.cached.fixMediaUrl.apply(this, arguments);
      }
    },

    /**
     * Play audio
     * Generates automatically if necessary
     */
    play: function () {
      if(document.body.classList.contains("audio-muted")) {
      	return;
      }
      var shouldGenerateAudio = (arguments[0].url === "");
      if (shouldGenerateAudio) {
        AudioProvider.playGeneratedAudio(AudioProvider.currentWord);
      } else {
        AudioProvider.cached.play.apply(this, arguments);
      }
    },

    //+------------------------------------------------------
    //|
    //| GENERATE AUDIO
    //|
    //+------------------------------------------------------

    /**
     * Generates audio for given word
     * With the first API that is enabled
     */
    playGeneratedAudio: function(word) {
      if (!word) {
        return;
      }
      if (this.canSpeechSynthesize) {
        this.playSpeechSynthesisAudio(word);
      } else if (this.canGoogleTts) {
        this.playGoogleTtsAudio(word);
      } else if (this.canVoiceRss) {
        this.playVoiceRssAudio(word);
      } else {
        log("no playable sources found");
      }
    },

    /**
     * Generate audio with SpeechSynthesis API
     * for the given word and plays it
     *
     * @param string word
     */
    playSpeechSynthesisAudio: function(word) {
      if(this.speechSynthesis.text === word && this.speechSynthesisPlaying){
        return;
      }
      log("generating speechSynthesis audio for word: " + word);

      this.speechSynthesis.text   = word;
      window.speechSynthesis.speak(this.speechSynthesis);
      this.speechSynthesisPlaying = true;

      this.speechSynthesis.onend  = function (event) {
        this.speechSynthesisPlaying = false;

        // Firefox utterances don't play more than once
        if (navigator.userAgent.search("Firefox") > -1) {
          var lang  = this.speechSynthesis.lang,
              voice = this.speechSynthesis.voice,
              test  = this.speechSynthesis.text;

          this.speechSynthesis = new window.SpeechSynthesisUtterance();
          this.speechSynthesis.lang = lang;
          this.speechSynthesis.voice = voice;
          this.speechSynthesis.text = text;
        }
      }.bind(this);
    },

    /**
     * Generate audio with Google TTS API
     * for the given word and plays it
     *
     * @param string word
     */
    playGoogleTtsAudio: function(word) {
      this.getGoogleTtsElement(word, true);
    },

    getGoogleTtsElement: function(word, play) {

      // Check language is recognized by Google
      var languageCode = GOOGLETTS_LANG[this.language];
      if (!languageCode) {
        return;
      }

      // Is audio cached ?
      var source        = "google tts",
          cachedElement = this.getCachedElement(source, word);
      if (cachedElement) {
        play && cachedElement.play();
        return;
      }

      // If network is busy: delay TTS request
      if (this.isNetworkBusy()) {
        log("network busy - delaying google tts load");

        setTimeout(function(){
          AudioProvider.getGoogleTtsElement(word, play);
        }, 300);
        return;
      }

      // Generate audio
      log("generating google tts link for word: " + word);

      var audioElement = this.makeAudioElement({
            label  : source,
            word   : word,
            url    : this.getGoogleTtsUrl(languageCode, word),

            onError: function (e) {
              if(referrerState === "origin") {
                console.log("referrer header was set prematurely");
                this.removeCachedElement(source, word);
              } else {
                this.canGoogleTts = false;
                this.setReferrerOrigin();
              }
              this.playGeneratedAudio(word);
            }.bind(this)
          });
      this.setCachedElement(source, word, audioElement);

      if (navigator.userAgent.search("Firefox") > -1) {
        audioElement.addEventListener('loadstart', this.setReferrerNoReferrer.bind(this));
      } else {
        this.setReferrerNoReferrer();
      }
      audioElement.addEventListener('loadedmetadata', this.setReferrerOrigin.bind(this));

      if(play) {
        audioElement.play();
      }
    },

    /**
     * Returns Google TTS url
     * for the given word and language
     *
     * @return string
     */
    getGoogleTtsUrl: function(languageCode, word) {
      // Extra params help to stop google from complaining about too many requests
      return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${languageCode}&client=tw-ob&q=${encodeURIComponent(word)}&tk=${Math.floor(Math.random() * 1000000)}`;
    },

    /**
     * Generate audio with Voice RSS API
     * for the given word and plays it
     *
     * @param string word
     */
    playVoiceRssAudio: function(word) {

      // Check language is recognized by Voice RSS
      var languageCode = VOICERSS_LANG[language];
      if(!languageCode){
        return;
      }

      // Is audio cached ?
      var source        = "voice rss",
          cachedElement = this.getCachedElement(source, word);
      if (cachedElement) {
        cachedElement.play();
        return;
      }

      // Generate audio
      log("generating voice rss link for word: " + word);

      var audioElement = this.makeAudioElement({
        label  : source,
        word   : word,
        url    : this.getVoiceRssUrl(languageCode, word),

        onError: function (e) {
          this.canVoiceRss = false;
          this.playGeneratedAudio(word);
        }.bind(this)
      });
      this.setCachedElement(source, word, audioElement);
      audioElement.play();
    },

    /**
     * Returns Voice RRS url
     * for the given word and language
     *
     * @return string
     */
    getVoiceRssUrl: function(languageCode, word) {
      return `https://api.voicerss.org/?key=${this.voiceRssKey}&src=${encodeURIComponent(word)}&hl=${languageCode}&f=48khz_16bit_stereo`;
    },

    /**
     * Creates an audio DOMElement
     * @param object options - {source: string, word: string, url: string, onError: function}
     * @return DOMElement
     */
    makeAudioElement: function({source, word, url, onError}) {
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', url);

      audioElement.addEventListener('error', function(e) {
        log(source + " failed");
        console.log(e);
        onError(e);
      });
      return audioElement;
    },

    //+------------------------------------------------------
    //|
    //| CACHE FUNCTIONS
    //|
    //+------------------------------------------------------

    getCachedElement: function(source, word) {
      var cachedElem = this.cachedAudioElements.find((obj) => {
        return obj.source === source && obj.word === word;
      });
      return cachedElem && cachedElem.element;
    },

    removeCachedElement: function(source, word) {
      _.remove(this.cachedAudioElements, (e) => {
        return e.source === source && e.word === word
      });
    },

    setCachedElement: function(source, word, element) {
      this.cachedAudioElements.push({source, word, element});
    },

    //+------------------------------------------------------
    //|
    //| REFERER FUNCTIONS
    //|
    //+------------------------------------------------------

    setReferrerOrigin: function() {
      document.getElementsByName("referrer")[0].setAttribute("content", "origin");
      this.referrerState = "origin";
    },

    setReferrerNoReferrer: function() {
      document.getElementsByName("referrer")[0].setAttribute("content", "no-referrer");
      this.referrerState = "no-referrer";
    },

    isNetworkBusy: function() {
      return this.requestCount > 0;
    },

    watchNetwork: function() {
      $(document).ajaxSend(function (e, xhr, settings) {

        this.requestCount++;

        if(this.referrerState === "no-referrer") {
          this.setReferrerOrigin();
        }
        xhr.always(function() {
          this.requestCount--;
        }.bind(this));
      }.bind(this));
    }
  };

  function log(message) {
    console.log("Audio Provider: " + message);
  }

  window.addEventListener('load', function(){
    AudioProvider.init();
  }, false);
}

// Inject JS directly in page to prevent limitations of access
var script = document.createElement('script');

script.setAttribute("type", "application/javascript");
script.appendChild(document.createTextNode('('+ main +')();'));
document.body.appendChild(script);
