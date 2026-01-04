// ==UserScript==
// @name           Memrise Audio Uploader
// @description    Automatically generates and uploads Audio from Google TTS (for the first column)
// @match          https://*.memrise.com/course/*/*/edit/*
// @match          https://*.memrise.com/garden/review/*
// @run-at         document-end
// @version        1.0.6
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/386764/Memrise%20Audio%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/386764/Memrise%20Audio%20Uploader.meta.js
// ==/UserScript==

/* jshint esversion:6 */

function main() {

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
  
  var AudioUploader = {
    
    /**
     * Entrypoint
     */
    init: function() {

      // Add "generate audio" btn
      $(document).ajaxSend(function (e, xhr, settings) {
        var get_lvl = settings.url.match(/^\/ajax\/level\/editing_html\/\?level_id=(\d+)/);

        if(!get_lvl) {
          return;
        }
        xhr.always(function() {
          this.addBtn('l_' + get_lvl[1]);
        }.bind(this));
      }.bind(this));
    },

    /**
     * Append btn "Generate audio" to level options
     * @param string idLvl
     */
    addBtn: function(idLvl) {
      if(!document.getElementById(idLvl).getAttribute('data-pool-id')) {
        return;
      }

      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('class', 'generate-audio');
      btn.innerHTML = 'Generate audio';

      setTimeout(function(){
        var parent = document.getElementById(idLvl);
        parent = parent.querySelector('.level-options').firstElementChild;
        parent.appendChild(btn);

        btn.addEventListener('click', this.generateAudio.bind(this));
      }.bind(this), 0);
    },

    //+------------------------------------------------------
    //|
    //| UPLOAD AUDIO
    //|
    //+------------------------------------------------------

    /**
     * Generate audio for the current level
     */
    generateAudio: function(e) {
      var table   = e.target.parentNode.parentNode.nextElementSibling.firstElementChild,
          column1 = table.firstElementChild.querySelector('.column').innerText.trim();

      // Get lang label
      if(typeof GOOGLETTS_LANG[column1] == 'undefined') {
        alert(column1 + " isn't a recognized language");
        return;
      }
      var languageCode = GOOGLETTS_LANG[column1];

      // Get list of words without audio
      var things = table.querySelector('.things').children;

      for(let i=0; i<things.length; i++) {
        let thing   = things[i],
            word    = thing.querySelector('.column').innerText.trim(),
            $column = $('.audio', thing);

        // Already has an audio?
        let listAudio = $('.dropdown-toggle', $column).text().trim();
        if(/^[1-9]/.test(listAudio)) {
          continue;
        }

        // If not: generate the audio from Google TTS and upload it
        this.uploadWord({
          word,
          $column,
          thingId : thing.getAttribute('data-thing-id'),
          cellId  : $column.data('key'),
          url     : this.getGoogleTtsUrl(languageCode, word)
        });
      }
    },
    
    /**
     * Returns Google TTS url
     * for the given word and language
     *
     * @return string
     */
    getGoogleTtsUrl: function(languageCode, word) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${languageCode || "en"}&client=tw-ob&q=${encodeURIComponent(word)}&tk=${Math.floor(Math.random() * 1000000)}&ttsspeed=1`;

      const proxy_url = 'https://cors-anywhere.99901dev.workers.dev/?q=' + encodeURIComponent(url);

      return proxy_url;
      //return `https://google-tts-api-v2.herokuapp.com/?q=${encodeURIComponent(word)}&tl=${languageCode}&download`;
      //return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${languageCode}&client=tw-ob&q=${encodeURIComponent(word)}&tk=${Math.floor(Math.random() * 1000000)}`;
    },

    /**
     * Upload Google TTS to Memrise
     */
    uploadWord: function({url, word, thingId, cellId, $column}) {
      $('.files-add', $column).remove();

      let status = 200;

      fetch(url)
        .then(res => {
          status = res.status;

          if(res.status!=200) {
            return res.text();
          } else {
            return res.blob()
          }
        })
        .then(blob => {
          if(status!=200) {
            console.error(status, blob);
            return;
          }
          let file = new File([blob], word + '.mp3', {type: "audio/mpeg"});

          let fd = new FormData();
          fd.append('thing_id', thingId);
          fd.append('cell_id', cellId);
          fd.append('cell_type', 'column');
          fd.append('csrfmiddlewaretoken', MEMRISE.csrftoken);
          fd.append('f', file);

          $.ajax({
            url: '/ajax/thing/cell/upload_file/',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
              if(data.message) {
                alert(data.message);
              }
              $column.replaceWith(data.rendered);
            }
          }); // end ajax
        }); // end fetch
    } // end uploadWord
  };

  AudioUploader.init();
}


// Inject JS directly in page to prevent limitations of access
var script = document.createElement('script');

script.setAttribute("type", "application/javascript");
script.appendChild(document.createTextNode('('+ main +')();'));
document.body.appendChild(script);