// ==UserScript==
// @name         muahahaha invidious youtube embed
// @namespace    muahahaha
// @version      0.3.1
// @description  embed youtube-nocookie in Invidious (use with https://www.reddit.com/r/firefox/comments/61y7lf/how_to_removedisable_more_videos_when_pausing_an/)
// @include      https://vid.puffyan.us/watch?v=*
// @run-at       document-end
// @grant        unsafeWindow
// @license      © 2022
// @downloadURL https://update.greasyfork.org/scripts/437881/muahahaha%20invidious%20youtube%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/437881/muahahaha%20invidious%20youtube%20embed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function muahahaha_invidious_youtube_embed() {
        if (/* typeof(unsafeWindow.pause) === 'function' && */ typeof(unsafeWindow.$) === 'function' && typeof(unsafeWindow.video_data.id) === 'string' && unsafeWindow.$('#player_html5_api').length) {
            // unsafeWindow.pause();
            let autoplay = + unsafeWindow.video_data.params.autoplay;
            // unsafeWindow.video_data.params.autoplay = false;
            // unsafeWindow.$('#player').html('');

            unsafeWindow.$('#player video').html('').attr('src', '');

            unsafeWindow.$('#player').html('<iframe id="muahahaha_invidious_youtube_embed_iframe" class="vjs-tech" style="outline:none; width:100%; background-color:#000" src="https://www.youtube-nocookie.com/embed/' + unsafeWindow.video_data.id + '?rel=0&showinfo=0&modestbranding=1&autoplay=' + autoplay + '" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>');
        } else {
 			setTimeout(muahahaha_invidious_youtube_embed, 100);
		}
	}

    muahahaha_invidious_youtube_embed();
})();

/*
<iframe
    width="560"
    height="315"
    src="https://www.youtube-nocookie.com/embed/2lXEcCWph5U"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
></iframe>
*/

/*
<video
    style="outline:none; width:100%; background-color:#000"
    playsinline="playsinline"
    poster="/vi/2lXEcCWph5U/maxres.jpg"
    id="player_html5_api"
    class="vjs-tech"
    autoplay=""
    tabindex="-1"
    preload="auto"
    src="/latest_version?id=2lXEcCWph5U&amp;itag=22"
    title=""
>
    <source
        src="/latest_version?id=2lXEcCWph5U&amp;itag=22"
        type="video/mp4; codecs=&quot;avc1.64001F, mp4a.40.2&quot;"
        label="hd720"
        selected="true"
    >
    <source
        src="/latest_version?id=2lXEcCWph5U&amp;itag=18"
        type="video/mp4; codecs=&quot;avc1.42001E, mp4a.40.2&quot;"
        label="medium"
        selected="false"
    >
</video>
*/
