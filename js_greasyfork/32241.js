// ==UserScript==
// @name        VKget music
// @version     1.6
// @description Скрипт добавляет ссылки для скачивания к аудиозаписям на vk.com. Для сохранения всех файлов через wget нажмите F2.
// This script adds download links to audios at vk.com. To save all files via wget, press F2.
// @match       *://vk.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.js
// @grant       none
// @run-at      document-idle
// 19.10.2018
// @namespace https://greasyfork.org/users/148414
// @downloadURL https://update.greasyfork.org/scripts/32241/VKget%20music.user.js
// @updateURL https://update.greasyfork.org/scripts/32241/VKget%20music.meta.js
// ==/UserScript==


(function() {
   function decode_url(url){
      var tmp = {};
      AudioPlayerHTML5.prototype._setAudioNodeUrl(tmp, url);
      return tmp.src;
   }

    function utf8_to_cp866(aa) {
        var bb = [], c = 0;
        for (var i = 0; i < aa.length; i++) {
            c = aa.charCodeAt(i);
            if (c > 127) {
                if (c >= 0x410 && c <= 0x43f)
                    bb.push(c + 0x80 - 0x410);
                if (c >= 0x440 && c <= 0x44f)
                    bb.push(c + 0xe0 - 0x440);
                if (c == 0x401)
                    bb.push(0xf0);
                if (c == 0x451)
                    bb.push(0xf1);
            } else {
                bb.push(c);
            }
        }
        return Uint8Array(bb);
    }

    var ready = 0;
    var wget_list = "";
    var run = 0;

    function add_download_links() {
        run = 1;
        var audio_row_selector = '.audio_row';

        if ($(audio_row_selector).length <= ready) {
            run = 0;
            return;
        }

        var $this = $($(audio_row_selector)[ready]);

        var audio_id_raw = $this.data('audio');
        // alert("audio_id_raw: " + audio_id_raw);
        var audio_id_raw_13 = audio_id_raw[13].split('/');
        // alert(audio_id_raw_13);
        var audio_id = audio_id_raw[1] + '_' + audio_id_raw[0] + '_' + audio_id_raw_13[2] + '_' + audio_id_raw_13[5];
        // alert("audio_id: " + audio_id);
        // audio_id = "2000444824_456242020_2f368c1beae14ca6b8_afa041bc07f2ad6bba";

        var link = "";

        $.ajax({
            url: 'https://vk.com/al_audio.php',
            method: 'post',
            async: false,
            data: {
                act: 'reload_audio',
                al: 1,
                ids: audio_id
            },
            success: function(response) {
                s_response = response.split('"');
                // alert("s_response: " + s_response);
                if (s_response.length > 1) {
                    link = decode_url(s_response[1]);
                    // alert("link: " + link);
                    if (link != s_response[1]) {
                        var link_style = 'position: absolute; right: -12px; top: 12px; color: white; z-index: 100; background: red; border-radius: 3px 3px 3px 3px; padding: 2px 6px; font-size: 16px; opacity: 0.5;';
                        var song_name = $this.find('.audio_row__title_inner').text().trim();
                        var performer_name = $this.find('.audio_row__performers').text().trim();
                        var track_name = performer_name + ' - ' + song_name;
                        track_name = track_name.replace(/\"/g, "'");
                        track_name = track_name.replace(/`/g, "'");

                        $this.append('<a class="audio-download-link" style="' + link_style +
                            '" title="Скачать" download="' +
                            track_name + '.mp3" data-track_name="' +
                            track_name + '" href="' + link +
                            '" onclick="arguments[0].stopPropagation()"> &#9835; </a>'
                        );
                        ready++;
                        wget_list += 'wget --no-check-certificate -c -O "' + track_name + '.mp3" ' + link + String.fromCharCode(0x0d, 0xa);
                    }
                } else {
                    if (response.match(/!bool/)) {
                        // alert("skip bad link");
                        ready++;
                    }
                }
            }
        });

        setTimeout( function(){ add_download_links() }, 500);
    }


    add_download_links();
    if (!ready)
        setTimeout( function(){ add_download_links() }, 2000);

    window.addEventListener("scroll", function(){
        if (!run)
            add_download_links();
    }, false);

    $('body').keydown(function(e){
        if (e.which == 113) { // F2
            var blob;
            var p = window.navigator.platform;

            if (p == "Win32" || p == "Win64") {
                blob = new Blob([utf8_to_cp866(wget_list)], {type: "application/octet-binary"});
                saveAs(blob, 'wget_list.bat', true);
            } else {
                blob = new Blob([wget_list], {type: "text/plain;charset=utf-8"});
                saveAs(blob, 'wget.sh', true);
            }
        }
    });
})();
