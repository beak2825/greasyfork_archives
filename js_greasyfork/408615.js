// ==UserScript==
// @name         Dropout Captions Editor
// @version      1.1
// @author       giandrop
// @namespace    https://github.com/giandrop
// @license      MIT
// @description  A userscript that let you import, edit and save captions from any VHX video.
// @homepage     https://github.com/giandrop/Dropout-userscripts/tree/master/Dropout%20Captions%20Editor
// @include      *embed.vhx.tv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408615/Dropout%20Captions%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/408615/Dropout%20Captions%20Editor.meta.js
// ==/UserScript==

//DROPOUT COLOR: rgba(23, 35, 34, 0.75)

//Icon (from Bootstrap: https://icons.getbootstrap.com/icons/chat-square-dots-fill/)
const ICON = `
<svg class="bi bi-chat-square-dots-fill" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <title>Custom subtitles</title>
  <path fill-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm5 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
</svg>
`;

const editor_html = `
  <div>
    Dropout Captions Editor
    <button id="cancel_btn" class="dropout-cc-button">X</button>
  </div>
  <textarea style="flex-grow: 1; resize:none"></textarea>
  <div>
    <input id="time_display" type="text" readonly></input>
    <span>
        <input id="playback-rate" type="text"></input>
        <button id="set-playback-rate-btn" class="dropout-cc-button">Set speed</button>
    </span>
  </div>
  <div>
    <label for="import-vtt" class="dropout-cc-button">
      <div>Import</div>
      <input id="import-vtt" type="file" style="display:none" accept=".txt, .vtt, text, text/vtt">
    </label>
    <a id="export-vtt" class="dropout-cc-button" download="captions.txt">Export</a>
    <button id="save_btn" class="dropout-cc-button">Apply</button>
  </div>
`;

const FONT = '"Helvetica Neue",Helvetica,Arial!important';

const STYLE = `
.editor {
    color: white;
    background-color: rgba(23,35,34,.75);
    font-family: ${FONT};
    border: 1px solid grey;
    border-radius:5px;
    height: 60%;
    width: 30%;
    position:absolute;
    top:10%;
    left:10px;
    display:none;
    flex-flow: column;
    resize: both;
    overflow: auto;
    padding: 5px;
}
.editor > div {
    padding: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
#time_display {
    width: 100px;
}
#playback-rate {
    width: 50px;
}
.dropout-cc-button {
    background-color: grey;
    color: white;
    font-family: ${FONT};
    font-size: 0.9em;
    border: none;
    text-decoration: none;
    text-align: center;
    cursor: default;
    padding: 2px 6px;
}
.dropout-cc-button:hover {
    background-color: lightgrey;
}
.editor textarea {
    color: white;
    background-color: transparent;/*rgba(23,35,34,.75);*/
}
.editor textarea::selection {
    color: black;
    background-color: yellow;
}
`;

function string_to_date(hh, mm, ss, mil) {
    let date = new Date(0)
    date.setUTCHours(hh)
    date.setUTCMinutes(mm)
    date.setUTCSeconds(ss)
    date.setUTCMilliseconds(mil)
    return date
}

(function() {
    'use strict';

    var subs = '';

    //Wait until video is loaded
    function find_video() {
        const video = document.querySelector('video');
        if (video) {
            clearInterval(poll)
            get_subtitles()
                .then(res => res.text())
                .then(text => {subs = text})
                .finally(add_button)
        }
    }
    const poll = setInterval(find_video, 500)

    function get_subtitles() {
        let video = document.querySelector('video')
        let track = video.querySelector('track')
        if (track) {
            return fetch(track.src)
        } else {
            return Promise.reject('No tracks!')
        }
    }

    //As soon as the video is found this function is called
    function add_button(){

        //Install stylesheet
        const stylesheet = document.createElement('style')
        stylesheet.innerHTML = STYLE
        document.body.appendChild(stylesheet)

        //Insert window in html
        const editor = document.createElement('div')
        editor.classList.add('editor')
        editor.innerHTML = editor_html

        const textarea = editor.querySelector('textarea')
        textarea.value = subs

        //Video
        const video = document.querySelector('video')
        const time_display = editor.querySelector('#time_display')

        // Handlers

        function save_handler() {
            //save textarea value to subs
            subs = textarea.value

            //convert subs to base64
            let encoded = btoa(unescape(encodeURIComponent(subs)))

            //add new track
            let track = video.querySelector('track')//document.createElement('track')
            //If it doesn't exist we create one
            if (!track) {
                track = document.createElement('track')
                video.appendChild(track)
            }

            track.src = `data:text/vtt;charset=UTF-8;base64,${encoded}`
            track.default = true

        }

        function cancel_handler() {
            //reset textarea
            textarea.value = subs

            //reset playback rate
            playback_rate.value = ''

            //hide editor
            editor.style.display = 'none'
        }

        function import_handler(evt) {
            const file = evt.target.files[0]

            const reader = new FileReader();
            reader.addEventListener('loadend', function(e){
                subs = e.target.result
                textarea.value = subs
                evt.target.value = ''
            });

            reader.readAsText(file);
        }

        function export_handler(evt) {
            //convert subs to base64
            let encoded = btoa(unescape(encodeURIComponent(textarea.value)))

            //set URL to href
            evt.target.setAttribute('href', `data:text/vtt;charset=UTF-8;base64,${encoded}`);
        }

        function time_update_handler(evt) {
            let d = new Date(Date.UTC(0))
            d.setUTCMilliseconds(video.currentTime * 1000)
            let hh = String(d.getUTCHours()).padStart(2,'0')
            let mm = String(d.getUTCMinutes()).padStart(2,'0')
            let ss = String(d.getUTCSeconds()).padStart(2,'0')
            let mil = String(d.getUTCMilliseconds()).padStart(3,'0')
            let time = `${hh}:${mm}:${ss}.${mil}`
            time_display.value = time
        }

        const save_btn = editor.querySelector('#save_btn')
        save_btn.addEventListener('click', save_handler)

        const cancel_btn = editor.querySelector('#cancel_btn')
        cancel_btn.addEventListener('click', cancel_handler)

        const vtt_input = editor.querySelector('#import-vtt')
        vtt_input.addEventListener('change', import_handler)

        const export_btn = editor.querySelector('#export-vtt')
        export_btn.addEventListener('click', export_handler)

        const set_playback_rate_btn = editor.querySelector('#set-playback-rate-btn')
        const playback_rate = editor.querySelector('#playback-rate')
        set_playback_rate_btn.addEventListener('click', () => {video.playbackRate = playback_rate.value})

        video.addEventListener('timeupdate', time_update_handler)

        //Playbar button
        let button = document.createElement('button')
        button.innerHTML = ICON
        button.style = "margin-left: 10px; margin-top: -1px; color: white"

        button.addEventListener('click', () => {
            editor.style.display = 'flex'
            playback_rate.value = video.playbackRate
        })
        document.body.appendChild(editor)

        //We insert it after the CC button
        let cc_button = document.querySelector('.toggle.cc')
        if (cc_button) {
            cc_button.insertAdjacentElement('afterend', button)
        } else {
            document.querySelector('.volume').insertAdjacentElement('afterend', button)
        }
    }
})();
