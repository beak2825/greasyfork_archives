// ==UserScript==
// @name         BluTV Extractor
// @namespace    https://www.blutv.com/
// @license MIT
// @version      0.1
// @description  Download MPD and subtitles files from BluTV
// @author       CM
// @match        https://www.blutv.com/diziler/*
// @match        https://www.blutv.com/filmler/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/490776/BluTV%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/490776/BluTV%20Extractor.meta.js
// ==/UserScript==

(function() {
  'use strict';

    function extractMedia() {
        const scripts = document.querySelectorAll('script');

        for (const script of scripts) {
            if (script.textContent.includes('pageProps')) {
                try {
                    return JSON.parse(script.textContent);
                } catch (error) {
                    console.error('Error parsing script:', error);
                }
            }
        }

        return null;
    }

    function getNextEpisode(seasons, currentSeason, currentEpisode) {
    for (let i = 0; i < seasons.length; i++) {
      const season = seasons[i];
      if (season.seasonNumber === currentSeason) {
        for (let j = 0; j < season.episodes.length; j++) {
          const episode = season.episodes[j];
          if (episode.episodeNumber === currentEpisode) {
            if (j + 1 < season.episodes.length) {
              return season.episodes[j + 1];
            } else if (i + 1 < seasons.length) {
              return seasons[i + 1].episodes[0];
            } else {
              return null;
            }
          }
        }
      }
    }
    return null;
  }

    async function downloadSubtitles(subtitles, title) {
        for (const subtitle of subtitles) {
            const subtitlesCode = subtitle.code;
            const subtitlesUrl = subtitle.src;
            const subtitleFileName = `${title}_${subtitlesCode}`;
            const filename = `${subtitleFileName}.vtt`;

            downloadFile(subtitlesUrl, filename);
        }
    }

    function downloadFile(url, filename) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                var blob = response.response;
                var blobUrl = URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            onerror: function(error) {
                console.error('Download failed:', error);
            }
        });
    }

    function getTvShow(data){
        const currentSeasonNumber = data.props.pageProps.contentItem.seasonNumber;
        const currentEpisodeNumber = data.props.pageProps.contentItem.episodeNumber;
        const title = data.props.pageProps.playerConfig.media.parentTitle.replace(/\s/g, '_');

        const fileName = `${title}_S${currentSeasonNumber}E${currentEpisodeNumber}`;

        const mpdFileName = `${fileName}.mpd`;
        const mpdUrl = data.props.pageProps.playerConfig.media.source;
        downloadFile(mpdUrl, mpdFileName);

        const subtitles = data.props.pageProps.playerConfig.media.subtitles;
        downloadSubtitles(subtitles, fileName);

        const seasons = data.props.pageProps.playerConfig.media.episodes;
        const nextEpisode = getNextEpisode(seasons, currentSeasonNumber, currentEpisodeNumber);

        if (nextEpisode) {
            const nextEpisodeUrl = `https://blutv.com${nextEpisode.href}`;
            window.location.href = nextEpisodeUrl;
        }
    }

    function getMovie(data){
        const title = data.props.pageProps.playerConfig.media.parentTitle.replace(/\s/g, '_');

        const mpdFileName = `${title}.mpd`;
        const mpdUrl = data.props.pageProps.playerConfig.media.source;
        downloadFile(mpdUrl, mpdFileName);

        const subtitles = data.props.pageProps.playerConfig.media.subtitles;
        downloadSubtitles(subtitles, title);
    }

    const data = extractMedia();
    if (window.location.pathname.startsWith('/diziler/')) {
        getTvShow(data);
    } else if (window.location.pathname.startsWith('/filmler/')) {
        getMovie(data);
    }
})();