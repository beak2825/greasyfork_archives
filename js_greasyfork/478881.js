// ==UserScript==
// @name        Streaming links on letterboxd
// @namespace   https://greasyfork.org/fr/users/829268
// @match       https://letterboxd.com/film/*
// @version     2.0
// @author      liliantdn: https://greasyfork.org/users/829268
// @description 10/31/2023, 1:34:25 PM
// @license     GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/478881/Streaming%20links%20on%20letterboxd.user.js
// @updateURL https://update.greasyfork.org/scripts/478881/Streaming%20links%20on%20letterboxd.meta.js
// ==/UserScript==
function getFirstGroup(regexp, str) {
  return Array.from(str.matchAll(regexp), m => m[1]);
}
const imdbRegex = /(?:https?:\/\/)?(?:www\.)?imdb\.com\/title\/(tt[0-9]*)\/?/g;
const imdbId = getFirstGroup(imdbRegex,$('.micro-button[data-track-action="IMDb"]').attr("href"));
const tmdbRegex = /(?:https?:\/\/)?(?:www\.)?themoviedb\.org\/movie\/([0-9]*)\/?/g;
const tmdbId = getFirstGroup(tmdbRegex,$('.micro-button[data-track-action="TMDb"]').attr("href"));
console.log("IMDB ID:"+imdbId);
$("head").append(`
<style>
  .stream-wrap{
    border-radius: 3px;
    gap:4px;
    display:flex;
    flex-wrap:wrap;
    position:relative;
    width:100%;
    margin-bottom:20px;
    margin-top:10px;
  }
  .stream-wrap .stream-link{
    width:100%;
    font-size:12px;
    padding:10px 15px;
    display:block;
  }
  .stream-wrap .stream-link + .stream-link {
    border-top: 1px solid #202830;
  }
</style>
`);
$('#userpanel').before(`
<span>Stream:</span><br>
<div class="stream-wrap">
  <a class="text-slug" href="stremio://detail/movie/${imdbId}/${imdbId}">Stremio</a>
  <a class="text-slug" href="https://web.stremio.com/#/detail/movie/${imdbId}/${imdbId}" target="_blank">Stremio web</a>
  <a class="text-slug" href="https://movie-web.app/media/tmdb-movie-${tmdbId}" target="_blank">Movie-web</a>
  <a class="text-slug" href="https://multiembed.mov/?video_id=${tmdbId}&tmdb=1" target="_blank">SuperEmbed</a>
  <a class="text-slug" href="https://vidsrc.me/embed/movie?tmdb=${tmdbId}" target="_blank">VidSrc</a>
  <a class="text-slug" href="https://blackvid.space/embed?tmdb=${tmdbId}" target="_blank">BlackVid</a>
</div>
`)