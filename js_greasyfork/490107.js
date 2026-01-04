// ==UserScript==
// @name        4chan-tts
// @namespace   Violentmonkey Scripts
// @match       *://boards.4chan.org/*
// @grant       none
// @version     1.10
// @author      doomkek
// @description TTS for 4chan
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490107/4chan-tts.user.js
// @updateURL https://update.greasyfork.org/scripts/490107/4chan-tts.meta.js
// ==/UserScript==

(function () {
    var IS_4CHANX = false;
    var synt;

    if ('speechSynthesis' in window) {
        synt = window.speechSynthesis;
    } else {
        alert('[4chan-tts] Speech synthesis is not supported.');
        return;
    }

    const config = {
        USE_TTS: true,
        TTS_CONFIG: {
            pitch: 0.5,  //0.1-2.0
            rate: 1.5, //0.1-2.0,
            rngNarrator: true,
            volume: 0.5, //0.0-1.0
        },

        saveConfig: function () { localStorage.setItem("4chan-tts.config", JSON.stringify(config)); },
        loadConfig: () => {
            var conf = JSON.parse(localStorage.getItem("4chan-tts.config"))

            if (!conf)
                return;

            for (const key in config) {
                if (conf.hasOwnProperty(key)) {
                    config[key] = conf[key];
                }
            }

        },
    };

    function initX() {
        document.getElementById('cbTTS').remove(); //delete checkbox from non-4chanX init

        var useTtsCb = document.createElement('span');
        useTtsCb.innerHTML = `<span id="shortcut-tts" class="shortcut brackets-wrap" data-index="510"><a id="use-tts" title="TTS" href="javascript:;" class="fa ${config.USE_TTS ? 'fa-volume-up' : 'fa-volume-off'}">TTS</a></span>`;
        useTtsCb.addEventListener("click", function (e) {
            config.USE_TTS = !config.USE_TTS;
            config.saveConfig();
            if (config.USE_TTS) {
                document.getElementById('use-tts').classList.replace('fa-volume-off', 'fa-volume-up');
            }
            else {
                document.getElementById('use-tts').classList.replace('fa-volume-up', 'fa-volume-off');
                synt.cancel();
            }
        });

        document.getElementById('shortcuts').querySelector('#shortcut-qr').insertAdjacentElement('afterend', useTtsCb);
    }

    function init() {
        var useTtsCb = document.createElement('span');
        useTtsCb.id = 'cbTTS';
        useTtsCb.innerHTML = `[<label><input type="checkbox" title="Use TTS">Use TTS</label>]`;
        useTtsCb.querySelector('input').checked = config.USE_TTS;
        useTtsCb.addEventListener("click", function (e) {
            config.USE_TTS = !config.USE_TTS;
            config.saveConfig();
            if (!config.USE_TTS) {
                synt.cancel();
            }
        });

        document.getElementsByClassName('bottomCtrl desktop')[0].querySelector('.stylechanger').insertAdjacentElement('afterend', useTtsCb);
    }

    function playPosts(e) {
        if (!config.USE_TTS)
            return;

        if (!IS_4CHANX) {
            e.detail.newPosts = Array.from(document.getElementsByClassName('thread')[0].childNodes).slice(-e.detail.count).map(elem => '.' + elem.id);
        }

        for (var i = 0; i < e.detail.newPosts.length; i++) {
            var post = document.getElementById('pc' + e.detail.newPosts[i].substr(3));

            if (!post || post.hasAttribute('hidden') || post.querySelector('.stub') || post.querySelector('.post-hidden'))
                continue;

            speak(clearPost(post.querySelector('#m' + e.detail.newPosts[i].substr(3))));
        }
    }

    var prevNarrator = 0;
    function getRandomNarrator() {
        var voices = synt.getVoices();
        var i = Math.floor(Math.random() * (voices.length - 2));

        var c = 0;
        while (i == prevNarrator && c++ < 100) {
            i = Math.floor(Math.random() * (voices.length - 2));
        }

        return voices[prevNarrator = i];
    };

    function speak(lines) {
        var rngNarrator = getRandomNarrator();

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var u = new SpeechSynthesisUtterance(line.text);
            u.volume = config.TTS_CONFIG.volume;
            u.pitch = config.TTS_CONFIG.pitch;
            u.rate = config.TTS_CONFIG.rate;

            if (line.type == ">") {
                u.pitch = 2.0;
                u.rate = 1.8;
            }

            if (config.TTS_CONFIG.rngNarrator)
                u.voice = rngNarrator;

            synt.speak(u);
        }
    }

    var weqweqwew = [
        ["wtf", "what the fuck"],
        ["btw", "by the way"],
        ["btfo", "btf-o"],
        ["tbh", "to be honest"],
        ["tbqh", "to be quite honest"],
        ["kys", "kill yourself"],
        ["stfu", "shut the fuck up"],
        ["iirc", "if I remember correctly"],
        ["uwnb", "you will never be"],
        ["itt", "in this thread"],
    ];

    var benis = [
        [/(\d+)\*/g, (_, g) => `${g} star`],
    ];

    function clearPost(element) {
        let lines = [];

        element.childNodes.forEach(node => {
            if (node.nodeType === node.TEXT_NODE)
                lines.push({ type: "t", text: node.nodeValue });
            else if (node.nodeType === node.ELEMENT_NODE && (node.nodeName === "SPAN" || node.nodeName == "S")) {
                if (node.nodeType === node.ELEMENT_NODE && node.classList.contains("quote"))
                    lines.push({ type: ">", text: node.textContent });
                else
                    lines.push({ type: "t", text: node.textContent });
            }
        });

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].text;
            line = line.replace(/https?:\/\/\S*/g, "\n");
            line = line.replace(/ +/g, " ");
            line = line.replace(/\n(:? *\n*)+/g, "\n");

            for (var j = 0; j < weqweqwew.length; j++) {
                line = line.toLocaleLowerCase().replaceAll(weqweqwew[j][0], weqweqwew[j][1]);
            }

            for (var j = 0; j < benis.length; j++) {
                line = line.toLocaleLowerCase().replace(benis[j][0], benis[j][1]);
            }

            lines[i].text = line.trim();
        }

        console.log(lines);
        return lines;
    }

    document.addEventListener('4chanXInitFinished', function (e) {
        IS_4CHANX = true;
        initX();
    });

    document.addEventListener('4chanThreadUpdated', playPosts);
    document.addEventListener('ThreadUpdate', playPosts);
    config.loadConfig();
    init();
})();