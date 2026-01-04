// ==UserScript==
// @name               GeniusNowPlaying
// @name:de            GeniusNowPlaying
// @name:en            GeniusNowPlaying
// @namespace          sun/userscripts
// @version            2.0.13
// @description        Displays a link to the lyrics of your currently playing song via Last.fm.
// @description:de     Zeigt einen Link zu dem Text des momentan spielenden Songs via Last.fm an.
// @description:en     Displays a link to the lyrics of your currently playing song via Last.fm.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             Sunny <sunny@sny.sh>
// @include            https://genius.com/
// @match              https://genius.com/
// @connect            ws.audioscrobbler.com
// @connect            api.genius.com
// @run-at             document-end
// @inject-into        auto
// @grant              GM.addStyle
// @grant              GM_addStyle
// @grant              GM.getValue
// @grant              GM_getValue
// @grant              GM.setValue
// @grant              GM_setValue
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/GeniusNowPlaying.ico
// @copyright          2019-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/411014/GeniusNowPlaying.user.js
// @updateURL https://update.greasyfork.org/scripts/411014/GeniusNowPlaying.meta.js
// ==/UserScript==

(async () => {
  const settings = {
    username: "Last.fm username",
    fmkey: "Last.fm API key",
    geniuskey: "Genius API access token",
  };
  const data = {};

  for (const setting of Object.keys(settings)) {
    if (localStorage.getItem(`gnp-${setting}`)) {
      await GM.setValue(setting, localStorage.getItem(`gnp-${setting}`));
      localStorage.removeItem(`gnp-${setting}`);
    }

    data[setting] = await GM.getValue(setting);
  }

  if (
    Object.values(data).filter(Boolean).length !== Object.keys(settings).length
  ) {
    GM.addStyle(`
      #gnp-config {
        padding-top: 72px;
        text-align: center;
      }
      .gnp-wrapper {
        width: 100%;
        margin-top: 25px;
        display: flex;
      }
      .gnp-wrapper input {
        border: 2px solid black;
        padding: 0.75rem 1.313rem;
        font-family: Programme;
        flex: 1;
        margin-right: 25px;
      }
      .gnp-wrapper button {
        border: 2px solid black;
        padding: 0.75rem 1.313rem;
        font-family: Programme;
        background: none;
        cursor: pointer
      }
      #gnp-config p:last-child {
        margin-top: 25px;
      }
    `);

    document
      .querySelector("[class^=HomeContentdesktop__CenteredFlexColumn]")
      .insertAdjacentHTML(
        "afterbegin",
        "<div id='gnp-config'><p>Thank you for installing GeniusNowPlaying! To get started, please enter the following values:</p><p>After saving all values, simply reload this page and you should be good to go. Enjoy!</p></div>",
      );
  }

  for (const setting of Object.keys(settings)) {
    if (!data[setting]) {
      document
        .querySelector("#gnp-config p")
        .insertAdjacentHTML(
          "beforeend",
          `<p class='gnp-wrapper' data-setting='${setting}'><input placeholder='${settings[setting]}'><button>Save</button></p>`,
        );
    }
  }

  for (const wrapper of Array.from(
    document.getElementsByClassName("gnp-wrapper"),
  )) {
    const button = wrapper.getElementsByTagName("button")[0];
    const input = wrapper.getElementsByTagName("input")[0];

    button.onclick = async () => {
      if (!input.value) return;

      await GM.setValue(wrapper.getAttribute("data-setting"), input.value);
      wrapper.remove();
    };
  }

  if (
    !Object.values(data).filter(Boolean).length === Object.keys(settings).length
  )
    return;

  GM.xmlHttpRequest({
    url: `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&user=${data.username}&api_key=${data.fmkey}&format=json`,
    onload: (response) => {
      if (JSON.parse(response.responseText).error) return;
      if (JSON.parse(response.responseText).recenttracks.track.length === 0)
        return;

      const track = JSON.parse(response.responseText).recenttracks.track[0];

      GM.xmlHttpRequest({
        url: `https://api.genius.com/search?q=${track.artist["#text"]} ${track.name}&access_token=${data.geniuskey}`,
        onload: (response) => {
          if (JSON.parse(response.responseText).response.hits.length === 0)
            return;

          const result = JSON.parse(response.responseText).response.hits[0]
            .result;

          document
            .querySelector("[class^=HomeContentdesktop__CenteredFlexColumn]")
            .insertAdjacentHTML(
              "afterbegin",
              `<div style='padding-top: 72px; padding-right: 60px; padding-left: 60px;'><a style='margin-bottom: 25px;' href='https://genius.com${result.path}' class='PageGriddesktop-a6v82w-0 ChartItemdesktop__Row-sc-3bmioe-0 qsIlk'><div style='margin-top: 25px;' class='ChartItemdesktop__Rank-sc-3bmioe-1 tDViA'><svg viewBox='0 0 227.88 126.6'><g transform='translate(-57.935,-52.735)' fill='#d51007'><path d='m158.43 165.5-8.354-22.708s-13.575 15.14-33.932 15.14c-18.013 0-30.802-15.662-30.802-40.721 0-32.106 16.182-43.591 32.107-43.591 22.969 0 30.277 14.878 36.543 33.934l8.354 26.103c8.351 25.318 24.013 45.678 69.17 45.678 32.37 0 54.295-9.918 54.295-36.02 0-21.143-12.009-32.107-34.458-37.328l-16.705-3.654c-11.484-2.61-14.877-7.309-14.877-15.14 0-8.875 7.046-14.096 18.533-14.096 12.529 0 19.315 4.699 20.36 15.923l26.102-3.133c-2.088-23.492-18.271-33.15-44.896-33.15-23.491 0-46.462 8.875-46.462 37.327 0 17.75 8.614 28.975 30.277 34.195l17.752 4.175c13.312 3.133 17.748 8.614 17.748 16.185 0 9.656-9.396 13.572-27.146 13.572-26.364 0-37.325-13.834-43.591-32.89l-8.614-26.101c-10.961-33.934-28.452-46.463-63.169-46.463-38.37 0-58.731 24.275-58.731 65.517 0 39.677 20.361 61.08 56.906 61.08 29.492 0 43.59-13.834 43.59-13.834z' fill='#d51007'/></g></svg></div><div class='ChartSongdesktop__CoverAndTitle-sc-18658hh-0 jzapEV'><div class='ChartSongdesktop__Cover-sc-18658hh-1 fmhUTz'><div class='SizedImage__Container-sc-1hyeaua-0 jvFhIc' style='background-image: url(${result.song_art_image_url})' data-visible='true'><noscript><img src='${result.song_art_image_url}' class='SizedImage__NoScript-sc-1hyeaua-1 gIKSwQ'/></noscript></div></div><h3 class='ChartSongdesktop__TitleAndLyrics-sc-18658hh-2 dCmTwE'><div class='ChartSongdesktop__Title-sc-18658hh-3 fODYHn'>${result.title}</div><div class='ChartSongdesktop__Lyrics-sc-18658hh-4 ksRthp'><span color='background.onVariant' class='TextLabel-sc-8kw9oj-0 xwDpb'>Lyrics</span></div></h3></div><h4 class='ChartSongdesktop__Artist-sc-18658hh-5 kiggdb'>${result.primary_artist.name}</h4><div class='ChartSongdesktop__Metadata-sc-18658hh-6 dWDPoY'><div class='ChartSongdesktop__Metadatum-sc-18658hh-7 jfdPdw'><div class='IconWithLabel__Container-sc-141ao6c-0 hliVmp'><div color='accent.main' class='IconWithLabel__Icon-sc-141ao6c-1 ixtWtE'><svg viewBox='0 0 17 26'><path fill='#FF1464' d='M4 3c2.95 1 6.84 8.93 6.84 8.93a8.361 8.361 0 0 0 1-5.43A15.928 15.928 0 0 1 17 18c-.12 7-8.85 8.05-8.85 8.05a4.63 4.63 0 0 0 1.76-2.87c.29-1.8-2.58-3.8-2.58-3.8-2.48 4.15-1.07 6.67-1.07 6.67S0 23.1 0 19.24c0-3.86 4.22-7.75 4.62-10.79A12.25 12.25 0 0 0 4 3zm2.58 5.51h-.02v.17A13.89 13.89 0 0 1 4.23 14C3.13 15.77 2 17.65 2 19.25c0 1 .88 2.07 2 3a12.38 12.38 0 0 1 1.62-3.9l1.1-1.84 1.84 1.2c.59.45 3.29 2.48 3.44 5a5.47 5.47 0 0 0 3-4.78 12.81 12.81 0 0 0-1.73-6.37c-.19.5-.426.98-.7 1.44l-1.89 3.1-1.62-3.29a39.714 39.714 0 0 0-2.48-4.3z'></path></svg></div><span color='accent.main' class='TextLabel-sc-8kw9oj-0 cdJbFg'>${result.pyongs_count || "0"}</span></div></div><div class='ChartSongdesktop__Metadatum-sc-18658hh-7 jfdPdw'><div class='IconWithLabel__Container-sc-141ao6c-0 hliVmp'><div color='background.on' class='IconWithLabel__Icon-sc-141ao6c-1 GcnrE'><svg viewBox='0 0 22 15.45'><path d='M11 2c4 0 7.26 3.85 8.6 5.72-1.34 1.87-4.6 5.73-8.6 5.73S3.74 9.61 2.4 7.73C3.74 5.86 7 2 11 2m0-2C4.45 0 0 7.73 0 7.73s4.45 7.73 11 7.73 11-7.73 11-7.73S17.55 0 11 0z'></path><path d='M11 5a2.73 2.73 0 1 1-2.73 2.73A2.73 2.73 0 0 1 11 5m0-2a4.73 4.73 0 1 0 4.73 4.73A4.73 4.73 0 0 0 11 3z'></path></svg></div><span color='background.on' class='TextLabel-sc-8kw9oj-0 ljPCDr'>${result.stats.pageviews || "0"}</span></div></div></div></a></div>`,
            );
        },
      });
    },
  });
})();
