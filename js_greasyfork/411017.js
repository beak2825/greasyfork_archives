// ==UserScript==
// @name               TracklistToRYM
// @name:de            TracklistToRYM
// @name:en            TracklistToRYM
// @namespace          sun/userscripts
// @version            1.51.1
// @description        Imports an album's tracklist from various sources into Rate Your Music.
// @description:de     Importiert die Tracklist eines Albums von verschiedenen Quellen in Rate Your Music.
// @description:en     Imports an album's tracklist from various sources into Rate Your Music.
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
// @include            https://rateyourmusic.com/releases/ac
// @include            https://rateyourmusic.com/releases/ac?*
// @match              https://rateyourmusic.com/releases/ac
// @match              https://rateyourmusic.com/releases/ac?*
// @connect            45cat.com
// @connect            45worlds.com
// @connect            7digital.com
// @connect            allmusic.com
// @connect            amazon.com
// @connect            apple.com
// @connect            archive.org
// @connect            awa.fm
// @connect            azurewebsites.net
// @connect            baer.works
// @connect            bandcamp.com
// @connect            bandwagon.fm
// @connect            beatbump.io
// @connect            beatport.com
// @connect            bleep.com
// @connect            boomplay.com
// @connect            bugs.co.kr
// @connect            castalbums.org
// @connect            deezer.com
// @connect            discogs.com
// @connect            e-onkyo.com
// @connect            freemusicarchive.org
// @connect            genie.co.kr
// @connect            genius.com
// @connect            gnudb.org
// @connect            google.com
// @connect            hungama.com
// @connect            insprill.net
// @connect            itch.zone
// @connect            jam.coop
// @connect            jiosaavn.com
// @connect            junodownload.com
// @connect            karent.jp
// @connect            khinsider.com
// @connect            last.fm
// @connect            line.me
// @connect            loot.co.za
// @connect            maniadb.com
// @connect            melon.com
// @connect            metal-archives.com
// @connect            migalmoreno.com
// @connect            mirlo.space
// @connect            mora.jp
// @connect            music-flo.com
// @connect            musicbrainz.org
// @connect            musik-sammler.de
// @connect            musixmatch.com
// @connect            mysound.jp
// @connect            napster.com
// @connect            naver.com
// @connect            naxos.com
// @connect            nts.live
// @connect            open.audio
// @connect            oricon.co.jp
// @connect            ototoy.jp
// @connect            pandora.com
// @connect            pulsewidth.org.uk
// @connect            qobuz.com
// @connect            qq.com
// @connect            radiofreefedi.net
// @connect            rateyourmusic.com
// @connect            rauversion.com
// @connect            recochoku.jp
// @connect            resonate.coop
// @connect            secondhandsongs.com
// @connect            setlist.fm
// @connect            sny.sh
// @connect            sonemic.com
// @connect            soundcloud.com
// @connect            spirit-of-rock.com
// @connect            spotify.com
// @connect            streetvoice.com
// @connect            touhoudb.com
// @connect            tower.jp
// @connect            traxsource.com
// @connect            utaitedb.net
// @connect            vgmdb.net
// @connect            vinyl-digital.com
// @connect            vocadb.net
// @connect            yandex.com
// @connect            youtube.com
// @connect            *
// @run-at             document-end
// @inject-into        auto
// @grant              GM.deleteValue
// @grant              GM_deleteValue
// @grant              GM.getValue
// @grant              GM_getValue
// @grant              GM.getValues
// @grant              GM_getValues
// @grant              GM.info
// @grant              GM_info
// @grant              GM.listValues
// @grant              GM_listValues
// @grant              GM.registerMenuCommand
// @grant              GM_registerMenuCommand
// @grant              GM.setValue
// @grant              GM_setValue
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/TracklistToRYM.png
// @copyright          2020-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/411017/TracklistToRYM.user.js
// @updateURL https://update.greasyfork.org/scripts/411017/TracklistToRYM.meta.js
// ==/UserScript==

(async () => {
  GM.registerMenuCommand("Settings", openSettings);
  GM.registerMenuCommand("Reset", openReset);

  const parent = document.querySelector(
    "input[value='Copy Tracks']",
  ).parentNode;
  let msgPosted = false;

  const sitestmp = [
    {
      name: "7digital",
      icon: "https://css-cdn.7digital.com/static/build/images/favicons/7digital/favicon.ico",
      extractor: "node",
      placeholder: "https://www.7digital.com/artist/*/release/*",
      artist: ".release-info-artist a",
      album: ".release-info-title",
      parent: ".release-track",
      index: ".release-track-preview-text",
      title: ".release-track-name p",
      length: ".release-track-time",
    },
    {
      name: "45cat",
      extractor: "node",
      placeholder: "https://www.45cat.com/record/*",
      artist: "[href^='/artist/']",
      album: false,
      parent: ".tablegrey tr:not(.tableheader)",
      index: "td:first-child b",
      title: "td:nth-child(3)",
      length: false,
    },
    {
      name: "45worlds",
      extractor: "node",
      placeholder: "https://www.45worlds.com/*/*/*",
      artist: "[href*='/artist/']",
      album: false,
      parent: ".tablegrey tr:not(.tableheader)",
      index: "td:first-child b",
      title: "td:nth-child(3)",
      length: false,
    },
    {
      name: "AllMusic",
      icon: "https://fastly-gce.allmusic.com/images/favicon/favicon.ico",
      extractor: "node",
      placeholder: "https://www.allmusic.com/album/*",
      artist: ".album-artist a",
      album: ".album-title",
      parent: ".track",
      index: ".tracknum",
      title: ".title a",
      length: ".time",
    },
    {
      name: "Amazon",
      extractor: "node",
      placeholder: "https://www.amazon.com/dp/*",
      artist: "#ProductInfoArtistLink",
      album: "h1",
      parent: "#dmusic_tracklist_content tbody > .a-text-left",
      index: "div.TrackNumber-Default-Color",
      title: ".TitleLink",
      length: ".a-size-base-plus.a-color-secondary",
    },
    {
      name: "Apple Music",
      extractor: "json",
      placeholder: "https://music.apple.com/album/*/*",
      artist: "byArtist.0.name",
      album: "name",
      parent: "tracks",
      index: false,
      title: "name",
      length: "duration",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        x = x.getElementById("schema:music-album").textContent;
        x = JSON.parse(x);
        if (!x.byArtist.length)
          x.byArtist[0] = {
            name: "Various Artists",
          };
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "a-tisket",
      icon: "https://atisket.pulsewidth.org.uk/resources/favicon.svg",
      extractor: "node",
      placeholder: "https://atisket.pulsewidth.org.uk/*",
      artist: ".artist",
      album: ".album-title cite",
      parent: ".track",
      index: ".track-num",
      title: ".track-name",
      length: ".duration",
    },
    {
      name: "AWA",
      icon: "https://s.awa.fm/static/favicon.ico",
      extractor: "node",
      placeholder: "https://s.awa.fm/album/*",
      artist: "a[href*='/artist/']",
      album: "h1",
      parent: "._2omln0eOHzVUC3XnofU23C",
      index: "._1l99Wo9zW6q9fpUh0OC2Zz",
      title: "a[href*='/track/']",
      length: "._2Nydhx7SzJ7HE2wvcjgZGa",
    },
    {
      name: "Bandcamp",
      icon: "https://s4.bcbits.com/img/favicon/favicon.ico",
      extractor: "node",
      placeholder: "https://*.bandcamp.com/album/*",
      artist: "#name-section h3 a",
      album: "h2",
      parent: ".title-col",
      index: false,
      title: ".track-title",
      length: ".time",
    },
    {
      name: "Bandcamp (track)",
      icon: "https://s4.bcbits.com/img/favicon/favicon.ico",
      extractor: "node",
      placeholder: "https://*.bandcamp.com/track/*",
      artist: "#name-section h3 a",
      album: "h2",
      parent: ".trackView",
      index: false,
      title: ".trackTitle",
      length: false,
    },
    {
      name: "Bandwagon",
      extractor: "node",
      placeholder: "https://bandwagon.fm/*",
      artist: "[aria-label*='Artist']",
      album: "h1",
      parent: ".track",
      index: ".align-right span",
      title: "[class='width-100%']",
      length: ".align-right:nth-last-child(2)",
    },
    {
      name: "Beatbump",
      extractor: "node",
      placeholder: "https://beatbump.io/release?*",
      artist: ".secondary a",
      album: ".box-title",
      parent: ".m-item",
      index: ".index span:last-child",
      title: ".title",
      length: ".length",
    },
    {
      name: "Beatport",
      icon: "https://www.beatport.com/images/favicon-48x48.png",
      extractor: "node",
      placeholder: "https://www.beatport.com/release/*/*",
      artist: ".interior-release-chart-content-item--desktop [data-label]",
      album: "h1",
      parent: ".track",
      index: ".buk-track-num",
      title: ".buk-track-primary-title",
      length: ".buk-track-length",
    },
    {
      name: "Beatport Classic",
      icon: "https://www.beatport.com/images/favicon-48x48.png",
      extractor: "node",
      placeholder: "http://classic.beatport.com/release/*/*",
      artist: "h2 + div a",
      album: "h2",
      parent: ".track-grid-content",
      index: ".playColumn .artWrapper",
      title: ".titleColumn .txt-larger > span:not(.txt-grey)",
      length:
        "td:not(.playColumn):not(.titleColumn):not(.cartColumn) span:not(.genreList)",
    },
    {
      name: "blamscamp",
      icon: "https://suricrasia.online/favicon.ico",
      extractor: "node",
      placeholder: "https://html-classic.itch.zone/html/*/index.html",
      artist: ".artist",
      album: ".album",
      parent: ".song_list li",
      index: "p",
      title: ".title",
      length: "i",
    },
    {
      name: "Bleep",
      icon: "https://d1rgjmn2wmqeif.cloudfront.net/sf/s/1-1.png",
      extractor: "node",
      placeholder: "https://bleep.com/release/*",
      artist: ".artist span",
      album: ".release-title",
      parent: ".track-list > li",
      index: ".track-number",
      title: ".track-name span[itemprop]",
      length: ".track-duration",
    },
    {
      name: "Boomplay",
      extractor: "node",
      placeholder: "https://boomplay.com/albums/*",
      artist: ".ownerWrap strong",
      album: ".summaryWrap h1",
      parent: ".morePart_musics li",
      index: ".serialNum",
      title: ".songName",
      length: "time",
    },
    {
      name: "Bugs!",
      extractor: "node",
      placeholder: "https://music.bugs.co.kr/album/*",
      artist: ".basicInfo a[href*='/artist/']",
      album: ".pgTitle h1",
      parent: ".trackList tbody tr",
      index: ".trackIndex em",
      title: ".title a",
      length: false,
    },
    {
      name: "CastAlbums",
      extractor: "node",
      placeholder: "https://castalbums.org/recordings/*/*",
      artist: false,
      album: "li.active a",
      parent: ".tracks-table-divided",
      index: "td:first-child",
      title: "td a",
      length: "td:last-child",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        for (const row of Array.from(
          x.querySelectorAll(".tracks-table-divided + tr:not([class])"),
        ).reverse()) {
          row.previousElementSibling.getElementsByTagName("a")[0].textContent +=
            ` / ${row.getElementsByTagName("a")[0].textContent}`;
          row.previousElementSibling.lastElementChild.textContent =
            row.lastElementChild.textContent;
        }
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "cdr",
      extractor: "node",
      placeholder: "https://baer.works/cdr/",
      artist: false,
      album: false,
      parent: "#playlist li",
      index: false,
      title: ".track",
      length: false,
    },
    {
      name: "Deezer",
      extractor: "node",
      placeholder: "https://deezer.com/album/*",
      artist: "#naboo_album_artist a span",
      album: "#naboo_album_title",
      parent: ".song",
      index: ".number",
      title: "[itemprop='name']",
      length: ".timestamp",
    },
    {
      name: "Discogs",
      extractor: "node",
      placeholder: "https://discogs.com/release/*",
      artist: "h1 a",
      album: "h1",
      parent: "tr[data-track-position]",
      index: "td[class^=trackPos]",
      title: "td[class^=trackTitle] span",
      length: "td[class^=duration] span",
    },
    {
      name: "Encyclopaedia Metallum",
      extractor: "node",
      placeholder: "https://www.metal-archives.com/albums/*/*/*",
      artist: "#album_sidebar > a",
      album: ".album_name > a",
      parent: ".table_lyrics .even, .table_lyrics .odd",
      index: "td",
      title: ".wrapWords",
      length: "td[align='right']",
    },
    {
      name: "e-onkyo music",
      extractor: "node",
      placeholder: "https://www.e-onkyo.com/music/album/*",
      artist: ".jacketDetailArea .artistsName a",
      album: ".jacketDetailArea .packageTtl",
      parent: ".musicBoxDetail",
      index: ".musicListNo",
      title: ".musicTtl span",
      length: ".musicTime",
    },
    {
      name: "Faircamp",
      icon: "https://simonrepp.com/faircamp/favicon.svg",
      extractor: "node",
      placeholder: "https://faircamp.radiofreefedi.net/*/*",
      artist: ".release_artists a",
      album: "h1",
      parent: ".track",
      index: ".track_number",
      title: ".track_title",
      length: ".duration",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        for (const y of data.querySelectorAll(".track_time")) y.remove();
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "FLO",
      extractor: "json",
      placeholder: "https://www.music-flo.com/detail/album/*",
      artist: "data.list.0.representationArtist.name",
      album: "data.list.0.album.title",
      parent: "data.list",
      index: "trackNo",
      title: "name",
      length: "playTime",
      transformer: async (link) => {
        return `https://www.music-flo.com/api/meta/v1/album/${new URL(link).pathname.split("/")[3]}/track`;
      },
    },
    {
      name: "Free Music Archive",
      icon: "https://freemusicarchive.org/img/favicon.svg",
      extractor: "node",
      placeholder: "https://freemusicarchive.org/music/*/*",
      artist: ".bcrumb > a:last-of-type",
      album: "h1",
      parent: ".play-item",
      index: ".playtxt > b",
      title: ".playtxt > a > b",
      length: ".playtxt",
    },
    {
      name: "Funkwhale",
      extractor: "json",
      placeholder: "https://open.audio/library/albums/*",
      artist: "results.0.artist.name",
      album: "results.0.album.title",
      parent: "results",
      index: "position",
      title: "title",
      length: "uploads.0.duration",
      transformer: async (link) => {
        return `${new URL(link).origin}/api/v1/tracks/?ordering=disc_number,position&include_channels=true&album=${new URL(link).pathname.split("/")[3]}`;
      },
      modifier: async (data) => {
        let x = JSON.parse(data);
        for (const y of x.results)
          y.uploads[0].duration = new Date(y.uploads[0].duration * 1000)
            .toISOString()
            .slice(11, 19);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "genie",
      icon: "https://www.genie.co.kr/resources/favicon.ico",
      extractor: "node",
      placeholder: "https://genie.co.kr/detail/albumInfo?axnm=*",
      artist: "a[onclick*=artistInfo]",
      album: ".name",
      parent: "tbody tr.list",
      index: ".number",
      title: ".title",
      length: false,
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        x.querySelector(".icon").remove();
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "Genius",
      extractor: "node",
      placeholder: "https://genius.com/albums/*/*",
      artist: "h2 a",
      album: "h1",
      parent: ".chart_row",
      index: ".chart_row-number_container-number span",
      title: ".chart_row-content-title",
      length: false,
    },
    {
      name: "GnuDB",
      extractor: "node",
      placeholder: "https://gnudb.org/cd/*",
      artist: "h1",
      album: "h2",
      parent: "tr:not(:first-child)",
      index: "td:first-child",
      title: "td:last-child",
      length: "td[style]",
    },
    {
      name: "Google Play",
      extractor: "node",
      placeholder: "https://play.google.com/store/music/album/*",
      artist: ".H51Agc a",
      album: "h1 span",
      parent: "[data-album-is-available]",
      index: "[data-update-url-on-play] div",
      title: "[itemprop='name']",
      length: "[aria-label]",
    },
    {
      name: "HDtracks",
      extractor: "json",
      placeholder: "https://www.hdtracks.com/#/album/*",
      artist: "mainArtist",
      album: "name",
      parent: "tracks",
      index: "index",
      title: "name",
      length: "duration",
      transformer: async (link) => {
        return `https://hdtracks.azurewebsites.net/api/v1/album/${new URL(link).hash.split("/")[2]}`;
      },
      modifier: async (data) => {
        let x = JSON.parse(data);
        for (const y of x.tracks)
          y.duration = new Date(y.duration * 1000).toISOString().slice(11, 19);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "Hungama",
      extractor: "node",
      placeholder: "https://www.hungama.com/album/*",
      artist: ".artist-details #pajax_a",
      album: "h1",
      parent: ".block-songs [role=row] td",
      index: false,
      title: "h4 a",
      length: false,
    },
    {
      name: "Intellectual",
      extractor: "node",
      placeholder: "https://intellectual.insprill.net/albums/*/*",
      artist: "cite",
      album: ".title",
      parent: ".song",
      index: false,
      title: ".song-title",
      length: false,
    },
    {
      name: "Internet Archive",
      extractor: "node",
      placeholder: "https://archive.org/details/*",
      artist: ".metadata-definition span a",
      album: ".item-title .breaker-breaker",
      parent: ".related-track-row",
      index: false,
      title: ".track-title",
      length: false,
    },
    {
      name: "jam.coop",
      extractor: "node",
      placeholder: "https://jam.coop/artists/*/albums/*",
      artist: "h2 a",
      album: "h1",
      parent: ".flex.mb-2",
      index: "div",
      title: "span:first-child",
      length: "span:last-child",
    },
    {
      name: "JioSaavn",
      extractor: "node",
      placeholder: "https://jiosaavn.com/album/*",
      artist: "h1 + p a:first-child",
      album: "h1",
      parent: ".o-list-bare li",
      index: ".o-snippet__item:first-child .o-snippet__action-final",
      title: "h4 a",
      length: false,
    },
    {
      name: "Juno Download",
      extractor: "node",
      placeholder: "https://www.junodownload.com/products/*",
      artist: ".product-artist a",
      album: "h1",
      parent: ".product-tracklist-track",
      index: ".track-title",
      title: "[itemprop='name']",
      length: ".col-1",
    },
    {
      name: "KARENT",
      extractor: "node",
      placeholder: "https://karent.jp/album/*",
      artist: ".album__deta-artist a",
      album: ".album__title",
      parent: ".songlist__box",
      index: false,
      title: ".songlist__title",
      length: false,
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        for (const y of x.querySelectorAll(".album__deta-artist a img"))
          y.remove();
        for (const y of x.querySelectorAll(".songlist__num")) y.remove();
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "Kingdom Hearts Insider",
      icon: "https://downloads.khinsider.com/images/favicon.ico",
      extractor: "node",
      placeholder: "https://downloads.khinsider.com/game-soundtracks/album/*",
      artist: false,
      album: "h2",
      parent: "#songlist tr:not(#songlist_header):not(#songlist_footer)",
      index: "td[style='padding-right: 8px;']",
      title: ".clickable-row:not([align='right']) a",
      length: ".clickable-row[align='right'] a",
    },
    {
      name: "Last.fm",
      extractor: "node",
      placeholder: "https://www.last.fm/music/*/*",
      artist: ".header-new-crumb span",
      album: "h1",
      parent: ".chartlist-row",
      index: ".chartlist-index",
      title: ".chartlist-name a",
      length: ".chartlist-duration",
    },
    {
      name: "LINE MUSIC",
      icon: "https://linemusic-webapp.landpress.line.me/favicon.ico",
      extractor: "json",
      placeholder: "https://music.line.me/webapp/album/*",
      artist: "response.result.tracks.0.artists.0.artistName",
      album: "response.result.tracks.0.album.albumTitle",
      parent: "response.result.tracks",
      index: "trackNumber",
      title: "trackTitle",
      length: false,
      transformer: async (link) => {
        return `https://music.line.me/api2/album/${new URL(link).pathname.split("/")[3]}/tracks.v1`;
      },
    },
    {
      name: "Loot.co.za",
      extractor: "node",
      placeholder: "https://www.loot.co.za/product/*/*",
      artist: "h2 a",
      album: false,
      parent: "#tabs div:nth-last-child(2) .productDetails tr:not([style])",
      index: "td[width]",
      title: "td:not([width])",
      length: false,
    },
    {
      name: "maniadb.com",
      extractor: "node",
      placeholder: "http://www.maniadb.com/album/*",
      artist: ".album-artist",
      album: ".album-title",
      parent: ".album-tracks tr[onmouseover]",
      index: ".trackno",
      title: ".song a",
      length: ".runningtime",
    },
    {
      name: "Melon",
      extractor: "node",
      placeholder: "https://www.melon.com/album/detail.htm?albumId=*",
      artist: ".artist_name span",
      album: ".song_name",
      parent: "tbody tr",
      index: ".rank",
      title: ".ellipsis a",
      length: false,
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        x.querySelector(".song_name strong").remove();
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "Mirlo",
      extractor: "json",
      placeholder: "https://mirlo.space/*/release/*",
      artist: "result.artist.name",
      album: "result.title",
      parent: "result.tracks",
      index: "order",
      title: "title",
      length: "metadata.duration",
      transformer: async (link) => {
        return `https://api.mirlo.space/v1/trackGroups/${new URL(link).pathname.split("/")[3]}?artistId=${new URL(link).pathname.split("/")[1]}`;
      },
      modifier: async (data) => {
        let x = JSON.parse(data);
        for (const y of x.result.tracks)
          y.metadata.duration = new Date(y.metadata.duration * 1000)
            .toISOString()
            .slice(11, 19);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "mora",
      extractor: "json",
      placeholder: "https://mora.jp/package/*/*",
      artist: "artistName",
      album: "title",
      parent: "trackList",
      index: "trackNo",
      title: "title",
      length: "durationStr",
      transformer: async (link) => {
        return await new Promise((resolve) => {
          GM.xmlHttpRequest({
            method: "GET",
            url: link,
            onload: async (response) => {
              let data = new DOMParser().parseFromString(
                response.responseText,
                "text/html",
              );
              data = JSON.parse(
                data
                  .querySelector("[name='msApplication-Arguments']")
                  .getAttribute("content"),
              );
              resolve(
                `https://cf.mora.jp/contents/package/${data.mountPoint}/${data.labelId}/${data.materialNo.slice(0, -6).padStart(4, "0")}/${data.materialNo.slice(-6, -3)}/${data.materialNo.slice(-3)}/packageMeta.json`,
              );
            },
          });
        });
      },
    },
    {
      name: "MusicBrainz",
      extractor: "json",
      placeholder: "https://musicbrainz.org/release/*",
      artist: "artist-credit.0.name",
      album: "title",
      parent: "media",
      index: "number",
      title: "title",
      length: "length",
      transformer: async (link) => {
        return `https://musicbrainz.org/ws/2/release/${link.match(/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/)[0]}?inc=artists+recordings&fmt=json`;
      },
      modifier: async (data) => {
        let x = JSON.parse(data);
        x.media = x.media.flatMap((y) => y.tracks);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "Musik-Sammler",
      extractor: "node",
      placeholder: "https://www.musik-sammler.de/release/*",
      artist: ".header-span a",
      album: "h1 span[itemprop='name']",
      parent: "[itemprop='track'] tbody tr",
      index: ".track-position",
      title: ".track-title span",
      length: ".track-time",
    },
    {
      name: "Musixmatch",
      icon: "https://www.musixmatch.com/favicon.png",
      extractor: "node",
      placeholder: "https://www.musixmatch.com/album/*/*",
      artist: ".mxm-album-banner__artist a",
      album: ".mxm-album-banner__name",
      parent: ".mui-collection--list li",
      index: ".mui-cell__index-view",
      title: ".mui-cell__title",
      length: false,
    },
    {
      name: "mysound",
      icon: "https://simg.mysound.jp/assets/image/common/favicon.ico",
      extractor: "node",
      placeholder: "https://mysound.jp/album/*",
      artist: ".common__lower__topBox .artist a",
      album: ".common__lower__topBox h2",
      parent: ".album__recordingList__contents li",
      index: ".num",
      title: ".title a",
      length: ".time",
    },
    {
      name: "Napster",
      icon: "https://www.napster.com/wp-content/themes/napsterpitch/assets/favicon/favicon.ico",
      extractor: "node",
      placeholder: "https://napster.com/artist/*/album/*",
      artist: ".show-for-medium .artist-link",
      album: "#page-name",
      parent: ".track-item",
      index: ".track-number div",
      title: ".track-title",
      length: false,
    },
    {
      name: "NAVER VIBE",
      extractor: "xml",
      placeholder: "https://vibe.naver.com/album/*",
      artist: "track:first-child album artists artist artistName",
      album: "track:first-child album albumTitle",
      parent: "track",
      index: "trackNumber",
      title: "trackTitle",
      length: "playTime",
      transformer: async (link) => {
        return `https://apis.naver.com/vibeWeb/musicapiweb/album/${new URL(link).pathname.split("/")[2]}/tracks`;
      },
    },
    {
      name: "Naxos Records",
      extractor: "node",
      placeholder: "https://www.naxos.com/catalogue/item.asp?item_code=*",
      artist: ".composers a",
      album: false,
      parent: "table[valign='top']",
      index: "td:first-child",
      title: "td:nth-child(4) b",
      length: "td:nth-child(4)",
    },
    {
      name: "NTS Radio",
      extractor: "node",
      placeholder: "https://www.nts.live/shows/*/episodes/*",
      artist: ".bio__artist-link__a",
      album: "#H1-4",
      parent: ".track",
      index: false,
      title: ".track__title",
      length: false,
    },
    {
      name: "ORICON MUSIC",
      extractor: "node",
      placeholder: "https://music.oricon.co.jp/php/cd/CdTop.php?cd=*",
      artist: ".info .headline3 span",
      album: ".info h1",
      parent: ".search_list tr[itemprop=tracks]",
      index: ".rank01",
      title: ".truncate_h2 span",
      length: "td:nth-last-child(3)",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        for (const y of x.querySelectorAll("meta[itemprop=duration]"))
          y.remove();
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "OTOTOY",
      extractor: "node",
      placeholder: "https://ototoy.jp/_/default/p/*",
      artist: ".album-artist a",
      album: ".album-title",
      parent: "#tracklist tr[class]",
      index: "[id^=cvs_]",
      title: "[id^=title-]",
      length: ".item.center",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        for (const y of x.querySelectorAll(".album-artist a i")) y.remove();
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "Pandora",
      extractor: "regex",
      placeholder: "https://www.pandora.com/artist/*/*",
      artist: /(?<="artistName":").*?(?=")/,
      album: /(?<="albumTitle":").*?(?=")/,
      parent: /(?<={"musicId").*?(?=(true|false)})/g,
      index: /(?<="trackNum":).*?(?=,)/,
      title: /(?<="songTitle":").*?(?=",)/,
      length: /(?<="trackLength":).*?(?=,)/,
      modifier: async (data) => {
        const x = data.replace(/(?<="trackLength":\d+)(?=,)/g, "000");
        return x;
      },
    },
    {
      name: "Qobuz",
      extractor: "node",
      placeholder: "https://www.qobuz.com/*/album/*/*",
      artist: ".album-meta__artist",
      album: ".album-meta__title",
      parent: ".track",
      index: ".track__item--number span",
      title: ".track__item--name span",
      length: ".track__item--duration",
    },
    {
      name: "QQ Music",
      extractor: "node",
      placeholder: "https://y.qq.com/n/ryqq/albumDetail/*",
      artist: ".data__singer_txt",
      album: ".data__name_txt",
      parent: ".songlist__list li",
      index: ".songlist__number",
      title: ".songlist__songname_txt a",
      length: ".songlist__time",
    },
    {
      name: "Rate Your Music",
      extractor: "node",
      placeholder: "https://rateyourmusic.com/release/album/*/*",
      artist: ".album_artist_small a",
      album: ".album_title",
      parent: "#tracks .track:not([style='text-align:right;'])",
      index: ".tracklist_num",
      title: "[itemprop='name'] .rendered_text",
      length: ".tracklist_duration",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        for (const link of x.querySelectorAll(
          ".tracklist_title .artist, .tracklist_title .work",
        )) {
          const title = document.createTextNode(
            link.hasAttribute("title")
              ? `[${link.getAttribute("title").slice(1, -1)},${link.innerText}]`
              : link.innerText,
          );
          link.parentNode.replaceChild(title, link);
        }
        for (const highlight of x.querySelectorAll(".tracklist_title b")) {
          const title = document.createTextNode(
            `[b]${highlight.innerText}[/b]`,
          );
          highlight.parentNode.replaceChild(title, highlight);
        }
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
      default: true,
    },
    {
      name: "Rauversion",
      extractor: "node",
      placeholder: "https://rauversion.com/playlists/*",
      artist: "h5 a",
      album: "h4 a",
      parent: ".divide-muted li",
      index: false,
      title: "p:not([class])",
      length: false,
    },
    {
      name: "RecoChoku",
      extractor: "node",
      placeholder: "https://recochoku.jp/album/*",
      artist: ".c-product-main-detail__artist-inner",
      album: ".c-product-main-detail__title",
      parent: ".album-track-list__item",
      index: ".album-track-list__number",
      title: ".album-track-list__title-inner",
      length: ".album-track-list__spec",
    },
    {
      name: "Resonate",
      icon: "https://static.resonate.is/pwa_assets/favicon.ico",
      extractor: "json",
      placeholder: "https://stream.resonate.coop/artist/*/release/*",
      artist: "release.data.display_artist",
      album: "release.data.title",
      parent: "release.data.items",
      index: "index",
      title: "track.title",
      length: "track.duration",
      modifier: async (data) => {
        let x = data.match(/window\.initialState=JSON\.parse\('(.*?)'\)/)[1];
        x = JSON.parse(x);
        for (const y of x.release.data.items)
          y.track.duration = new Date(y.track.duration * 1000)
            .toISOString()
            .slice(11, 19);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "SecondHandSongs",
      icon: "https://secondhandsongs.com/art/favicon.png",
      extractor: "node",
      placeholder: "https://secondhandsongs.com/release/*",
      artist: ".entity-title .link-performer",
      album: ".entity-title .link-release",
      parent: "tbody tr",
      index: false,
      title: ".link-performance span",
      length: false,
    },
    {
      name: "setlist.fm",
      extractor: "node",
      placeholder: "https://www.setlist.fm/setlist/*/*/*",
      artist: ".artistImageBlurred span",
      album: false,
      parent: ".song",
      index: false,
      title: ".songLabel",
      length: false,
    },
    {
      name: "Sonemic",
      extractor: "node",
      placeholder: "https://sonemic.com/release/album/*/*",
      artist: "#page_object_header .music_artist",
      album: ".page_object_header_title",
      parent: ".page_fragment_track_track",
      index: ".page_fragment_track_num",
      title: ".page_fragment_track_title .song",
      length: ".page_fragment_track_duration",
    },
    {
      name: "SoundCloud",
      extractor: "regex",
      placeholder: "https://soundcloud.com/*/sets/*",
      artist: /(?<=by <a href=".*?">).*?(?=<\/a>)/g,
      album: /(?<=<a itemprop="url" href=".*?">).*?(?=<\/a>)/g,
      parent: /<article itemprop="track".*?<\/article>/g,
      index: false,
      title: /(?<=<a itemprop="url" href=".*?">).*?(?=<\/a>)/,
      length: /(?<=<meta itemprop="duration" content=").*?(?=" \/>)/,
    },
    {
      name: "SoundCloud (track)",
      extractor: "regex",
      placeholder: "https://soundcloud.com/*/*",
      artist: /(?<=by <a href=".*?">).*?(?=<\/a>)/g,
      album: /(?<=<a itemprop="url" href=".*?">).*?(?=<\/a>)/g,
      parent: /<header>.*?<\/header>/g,
      index: false,
      title: /(?<=<a itemprop="url" href=".*?">).*?(?=<\/a>)/,
      length: /(?<=<meta itemprop="duration" content=").*?(?=" \/>)/,
    },
    {
      name: "Spirit of Rock",
      extractor: "node",
      placeholder: "https://www.spirit-of-rock.com/en/album/*/*",
      artist: "#BandInfo h3",
      album: "#album h2",
      parent: "#tracklist tr",
      index: "td:first-child div:first-child",
      title: "td:first-child div:last-child",
      length: "td:last-child",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        for (const track of x.querySelectorAll("#tracklist tr")) {
          const title = document.createElement("div");
          title.append(
            document.createTextNode(track.firstChild.lastChild.textContent),
          );
          track.firstChild.appendChild(title);
        }
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "Spotify",
      extractor: "json",
      placeholder: "https://open.spotify.com/album/*",
      artist: "artists.0.name",
      album: "name",
      parent: "tracks.items",
      index: "track_number",
      title: "name",
      length: "duration_ms",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        x = await GM.xmlHttpRequest({
          method: "GET",
          url: `https://api.spotify.com/v1/albums/${
            new URL(
              x
                .querySelector("meta[property='og:url']")
                .getAttribute("content"),
            ).pathname.split("/")[2]
          }`,
          headers: {
            Authorization: `Bearer ${
              JSON.parse(x.getElementById("session").textContent).accessToken
            }`,
          },
          onload: async (response) => {
            return JSON.stringify(response.responseText);
          },
        });
        x = x.responseText;
        return x;
      },
    },
    {
      name: "StreetVoice",
      extractor: "node",
      placeholder: "https://streetvoice.com/*/songs/album/*",
      artist: ".user-info a",
      album: "h1",
      parent: "#item_box_list > li",
      index: ".work-item-number h4",
      title: ".work-item-info h4 a",
      length: false,
    },
    {
      name: "Tent",
      extractor: "node",
      placeholder: "https://tent.sny.sh/release.php?*",
      artist: "h1 a",
      album: "#ttrym-album",
      parent: ".tracks tr",
      index: "td:first-child",
      title: "td:nth-child(2)",
      length: "td:last-child",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        x.body.insertAdjacentHTML(
          "beforeend",
          `<p id='ttrym-album'>${x.querySelector("h1").lastChild.textContent.slice(2)}</p>`,
        );
        for (const track of x.querySelectorAll(".tracks tr a"))
          track.outerHTML = track.textContent;
        for (const track of x.querySelectorAll(".tracks tr audio"))
          track.parentElement.parentElement.remove();
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "TouhouDB",
      icon: "https://static.touhoudb.com/img/favicon.ico",
      extractor: "json",
      placeholder: "https://touhoudb.com/Al/*",
      artist: "artistLinks.0.name",
      album: "name",
      parent: "songs",
      index: "trackNumber",
      title: "name",
      length: "song.lengthSeconds",
      transformer: async (link) => {
        return `https://touhoudb.com/api/albums/${new URL(link).pathname.split("/")[2]}/details`;
      },
      modifier: async (data) => {
        let x = JSON.parse(data);
        x.artistLinks = x.artistLinks.filter(
          (y) => y.categories === "Producer",
        );
        for (const y of x.songs)
          y.song.lengthSeconds = new Date(y.song.lengthSeconds * 1000)
            .toISOString()
            .slice(11, 19);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "TOWER RECORDS MUSIC",
      extractor: "node",
      placeholder: "https://music.tower.jp/album/detail/*",
      artist: ".p-content__name",
      album: ".p-content__title",
      parent: "[data-type=tracklist] .c-grid__item",
      index: false,
      title: ".c-media__title a",
      length: false,
    },
    {
      name: "Traxsource",
      icon: "https://geo-static.traxsource.com/img/fav_icon.png",
      extractor: "node",
      placeholder: "https://www.traxsource.com/title/*/*",
      artist: "h1.artists",
      album: "h1.title",
      parent: ".trk-row",
      index: ".tnum",
      title: ".title a",
      length: ".duration",
    },
    {
      name: "Tubo",
      icon: "https://tubo.migalmoreno.com/icons/tubo.svg",
      extractor: "json",
      placeholder: "https://tubo.migalmoreno.com/playlist?url=*",
      artist: "uploader-name",
      album: "name",
      parent: "related-streams",
      index: false,
      title: "name",
      length: "duration",
      transformer: async (link) => {
        return `https://tubo.migalmoreno.com/api/v1/playlists/${encodeURIComponent(new URL(link).searchParams.get("url"))}`;
      },
      modifier: async (data) => {
        let x = JSON.parse(data);
        for (const y of x["related-streams"])
          y.duration = new Date(y.duration * 1000).toISOString().slice(11, 19);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "UtaiteDB",
      icon: "https://static.utaitedb.net/img/favicon.ico",
      extractor: "json",
      placeholder: "https://utaitedb.net/Al/*",
      artist: "artistLinks.0.name",
      album: "name",
      parent: "songs",
      index: "trackNumber",
      title: "name",
      length: "song.lengthSeconds",
      transformer: async (link) => {
        return `https://utaitedb.net/api/albums/${new URL(link).pathname.split("/")[2]}/details`;
      },
      modifier: async (data) => {
        let x = JSON.parse(data);
        x.artistLinks = x.artistLinks.filter(
          (y) => y.categories === "Producer",
        );
        for (const y of x.songs)
          y.song.lengthSeconds = new Date(y.song.lengthSeconds * 1000)
            .toISOString()
            .slice(11, 19);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "VGMdb",
      extractor: "node",
      placeholder: "https://vgmdb.net/album/*",
      artist: "td .artistname[style='display:inline']:not([title='Composer'])",
      album: "h1 .albumtitle[lang='en']",
      parent: ".tl .rolebit",
      index: ".label",
      title: "[colspan='2']",
      length: ".time",
      modifier: async (data) => {
        let x = new DOMParser().parseFromString(data, "text/html");
        const lists = Array.from(x.querySelectorAll("#tlnav a")).map(
          (list) => list.textContent,
        );
        if (lists.length === 1) return new XMLSerializer().serializeToString(x);
        document.body.insertAdjacentHTML(
          "beforeend",
          `<dialog style='top:50%;left:50%;transform:translate(-50%,-50%);background:var(--mono-f8);color:var(--text-primary);border: 1px var(--mono-d) solid;font-size:1.25em;padding:1em'><form method='dialog'><div class='submit_step_header' style='margin:0;margin-bottom:.5em'>${GM.info.script.name}: <span class='submit_step_header_title'>VGMdb</span></div><p>The selected release has multiple tracklists.<br>This usually occurs when a release (and its tracks) have multiple translations.<br>Please select the tracklist you want to import from the list below:</p><div style='display:flex'><select style='flex:1'>${lists.map((x) => `<option>${x}</option>`)}</select><button class='btn flat_btn' style='margin-left:1em;margin-right:0'>Import</button></div></form></dialog>`,
        );
        const dialog = document.getElementsByTagName("dialog")[0];
        const select = dialog.getElementsByTagName("select")[0];
        dialog.showModal();
        dialog.addEventListener("cancel", (e) => e.preventDefault());
        await new Promise((resolve) => {
          dialog.onclose = () => resolve();
        });
        const list = x.getElementById("tracklist");
        list.replaceWith(list.children[lists.indexOf(select.value)]);
        x = new XMLSerializer().serializeToString(x);
        return x;
      },
    },
    {
      name: "Vinyl Digital",
      extractor: "node",
      placeholder: "https://vinyl-digital.com/*/*",
      artist: "#test_othersartist",
      album: "#test_product_name",
      parent: "#playlist_table tr:not(:first-child):not([style])",
      index: ".track",
      title: ".tracktitle span",
      length: "td:not([class])",
    },
    {
      name: "VocaDB",
      icon: "https://vocadb.net/Content/favicon.ico",
      extractor: "json",
      placeholder: "https://vocadb.net/Al/*",
      artist: "artistLinks.0.name",
      album: "name",
      parent: "songs",
      index: "trackNumber",
      title: "name",
      length: "song.lengthSeconds",
      transformer: async (link) => {
        return `https://vocadb.net/api/albums/${new URL(link).pathname.split("/")[2]}/details`;
      },
      modifier: async (data) => {
        let x = JSON.parse(data);
        x.artistLinks = x.artistLinks.filter(
          (y) => y.categories === "Producer",
        );
        for (const y of x.songs)
          y.song.lengthSeconds = new Date(y.song.lengthSeconds * 1000)
            .toISOString()
            .slice(11, 19);
        x = JSON.stringify(x);
        return x;
      },
    },
    {
      name: "Yandex Music",
      extractor: "json",
      placeholder: "https://music.yandex.com/album/*",
      artist: "byArtist.name",
      album: "inAlbum.name",
      parent: "inAlbum.track",
      index: false,
      title: "name",
      length: "duration",
      modifier: async (data) => {
        const x = data.match(
          /<script .*? type="application\/ld\+json" .*? >(.*?)<\/script>/,
        )[1];
        return x;
      },
    },
    {
      name: "YouTube Music",
      extractor: "regex",
      placeholder: "https://music.youtube.com/playlist?list=*",
      artist: /(?<=\\"musicArtist\\".*?\\"name\\":\\").*?(?=\\",)/g,
      album: /(?<=\\"musicAlbumRelease\\".*?\\"title\\":\\").*?(?=\\",)/g,
      parent: /{\\"musicTrack\\":.*?}}}},/g,
      index: /(?<=\\"albumTrackIndex\\":\\").*?(?=\\",)/,
      title: /(?<=\\"title\\":\\").*?(?=\\",)/,
      length: false,
    },
  ];

  if (localStorage.getItem("ttrym-sites")) {
    await GM.setValue("sites", localStorage.getItem("ttrym-sites").split(","));
    await GM.setValue(
      "default",
      localStorage.getItem("ttrym-sites").split(",").sort()[0],
    );
    localStorage.removeItem("ttrym-sites");
  }
  if (await GM.getValue("sites")) {
    await GM.setValue("sitesv2", sitesV1ToV2(await GM.getValue("sites")));
    await GM.deleteValue("sites");
  }

  if ((await GM.getValue("artist")) === undefined)
    await GM.setValue("artist", false);
  if ((await GM.getValue("release")) === undefined)
    await GM.setValue("release", false);
  if ((await GM.getValue("sitesv2")) === undefined)
    await GM.setValue("sitesv2", sitesV1ToV2(sitestmp.map((x) => x.name)));
  if (
    (await GM.getValue("default")) === undefined ||
    !(await GM.getValue("sitesv2"))[await GM.getValue("default")]
  ) {
    const sitesv2 = await GM.getValue("sitesv2");
    const name = sitestmp.find((x) => x.default).name;
    sitesv2[name] = true;
    await GM.setValue("sitesv2", sitesv2);
    await GM.setValue("default", name);
  }
  if ((await GM.getValue("guess")) === undefined)
    await GM.setValue("guess", true);
  if ((await GM.getValue("enbydef")) === undefined)
    await GM.setValue("enbydef", true);
  if ((await GM.getValue("append")) === undefined)
    await GM.setValue("append", false);
  if ((await GM.getValue("sources")) === undefined)
    await GM.setValue("sources", true);
  if ((await GM.getValue("button")) === undefined)
    await GM.setValue("button", "keep");
  if ((await GM.getValue("favicon")) === undefined)
    await GM.setValue("favicon", "");

  const sitesv2 = await GM.getValue("sitesv2");
  for (const x of sitestmp)
    if (sitesv2[x.name] === undefined)
      sitesv2[x.name] = await GM.getValue("enbydef");
  await GM.setValue("sitesv2", sitesv2);

  const asyncFilterHelper = await GM.getValue("sitesv2");
  const sites = sitestmp.filter((x) => asyncFilterHelper[x.name]);

  if ((await GM.getValue("button")) === "remove") parent.replaceChildren();
  else
    parent.insertAdjacentHTML(
      "beforeend",
      "<br><hr style='margin-top:1em;margin-bottom:1em;border:none;height:1px;background:var(--mono-d);width:calc(100% + 20px);position:relative;left:-10px'>",
    );

  parent.style.width = "500px";
  parent.insertAdjacentHTML(
    "beforeend",
    `<p style='display:flex;margin-bottom:0'><a href='https://forgejo.sny.sh/sun/userscripts' target='_blank' style='position:relative;top:3px;color:inherit'>TTRYM</a><select id='ttrym-site' style='max-width:0;margin-left:.5em;border-radius:3px 0 0 3px'>${sites
      .map((x) => `<option value='${x.name}'>${x.name}</option>`)
      .join(
        "",
      )}</select><input id='ttrym-link' placeholder='Album URL' style='flex:1;border-left:none;border-radius:0 3px 3px 0;padding-left:5px;min-width:0'><button id='ttrym-submit' style='font-family:"Font Awesome 5 Free";border:none;background:none;color:inherit;font-size:1.5em;margin-left:.5em;cursor:pointer' title='Import'>&#xf00c;</button><button id='ttrym-settings' style='font-family:"Font Awesome 5 Free";border:none;background:none;color:inherit;font-size:1.5em;margin-left:.5em;cursor:pointer' title='Settings'>&#xf013;</button></p>`,
  );

  document.getElementById("ttrym-site").addEventListener("change", function () {
    document.getElementById("ttrym-link").placeholder = sites.find(
      (x) => x.name === this.value,
    ).placeholder;
  });
  document.getElementById("ttrym-site").value = await GM.getValue("default");
  document.getElementById("ttrym-site").dispatchEvent(new Event("change"));

  document.addEventListener("click", (e) => {
    if (e.target?.id === "ttrym-dismiss") clearMessages();
  });

  document
    .getElementById("ttrym-submit")
    .addEventListener("click", async () => {
      clearMessages();
      if (!document.getElementById("ttrym-link").value)
        return printMessage(
          "error",
          "No URL specified! Please enter one and try again.",
        );
      printMessage("info", "Importing, please wait...");
      document.getElementById("ttrym-submit").disabled = true;

      if (await GM.getValue("artist"))
        for (const element of document.querySelectorAll(
          ".filed_under_delete a",
        ))
          unsafeWindow.deleteFiledUnder(Number(element.href.match(/\d+/)));

      try {
        const site = document.getElementById("ttrym-site").value;
        let input = sites.find((x) => x.name === site);
        let link = document.getElementById("ttrym-link").value;

        if (!link.match(/^https?:\/\//)) link = `https://${link}`;

        if (!globToRegex(input.placeholder).test(link)) {
          const suggestion = sites.find((x) =>
            globToRegex(x.placeholder).test(link),
          );
          if (suggestion && (await GM.getValue("guess"))) {
            printMessage(
              "info",
              `Using ${suggestion.name} instead of ${input.name}.`,
            );
            input = suggestion;
            document.getElementById("ttrym-site").value = input.name;
          } else {
            printMessage(
              "warning",
              "Entered URL does not match the selected site's placeholder. Request may not succeed.",
            );
          }
        }

        const unsupported = [];
        for (const data in input)
          if (!input[data])
            unsupported.push(
              {
                artist: "the artist name",
                album: "the release title",
                index: "track positions",
                title: "track names",
                length: "track durations",
              }[data],
            );
        if (unsupported.length)
          printMessage(
            "warning",
            `This site does not support importing ${new Intl.ListFormat().format(unsupported)}.`,
          );
        if (!input.index)
          printMessage(
            "warning",
            "Fallback values (1, 2, 3, ...) will be used for track numbering.",
          );

        link = input.transformer ? await input.transformer(link) : link;

        GM.xmlHttpRequest({
          method: "GET",
          url: link,
          headers: {
            "User-Agent": `${GM.info.script.name}/${GM.info.script.version}`,
          },
          onload: async (response) => {
            let data = response.responseText;
            data = input.modifier ? await input.modifier(data) : data;

            let artist = "";
            let album = "";
            let result = "";
            let amount = 0;

            switch (input.extractor) {
              case "json":
                for (const element of reduceJson(data, input.parent)) {
                  amount++;
                  const index = input.index
                    ? reduceJson(element, input.index)
                    : amount;
                  const title = input.title
                    ? reduceJson(element, input.title)
                    : "";
                  const length = input.length
                    ? reduceJson(element, input.length)
                    : "";
                  result += getResult(index, title, length);
                }
                artist = input.artist ? reduceJson(data, input.artist) : "";
                album = input.album ? reduceJson(data, input.album) : "";
                break;

              case "node":
              case "xml": {
                const mime =
                  input.extractor === "xml" ? "text/xml" : "text/html";
                for (const element of new DOMParser()
                  .parseFromString(data, mime)
                  .querySelectorAll(input.parent)) {
                  amount++;
                  const index =
                    parseNode(element.querySelector(input.index)) || amount;
                  const title =
                    parseNode(element.querySelector(input.title)) || "";
                  const length =
                    parseNode(element.querySelector(input.length)) || "";
                  result += getResult(index, title, length);
                }
                artist =
                  parseNode(
                    new DOMParser()
                      .parseFromString(data, mime)
                      .querySelector(input.artist),
                  ) || "";
                album =
                  parseNode(
                    new DOMParser()
                      .parseFromString(data, mime)
                      .querySelector(input.album),
                  ) || "";
                break;
              }

              case "regex":
                for (let i of data.replace(/\n/g, "").match(input.parent)) {
                  amount++;
                  i = i.replace(/\n/g, "");
                  const index = input.index
                    ? i.match(input.index)[0].toString()
                    : amount;
                  const title = input.title
                    ? decodeHTML(i.match(input.title)[0])
                    : "";
                  const length = input.length ? i.match(input.length)[0] : "";
                  result += getResult(index, title, length);
                }
                artist = input.artist
                  ? decodeHTML(data.match(input.artist)[0])
                  : "";
                album = input.album
                  ? decodeHTML(data.match(input.album)[0])
                  : "";
                break;

              default:
                document.getElementById("ttrym-submit").disabled = false;
                return printMessage(
                  "error",
                  `${input.extractor} is not a valid extractor. This is (probably) not your fault, please report this error on Forgejo or via e-mail.`,
                );
            }

            if (amount === 0) {
              document.getElementById("ttrym-submit").disabled = false;
              return printMessage(
                "warning",
                "Did not find any tracks. Please check your URL and try again.",
              );
            }

            if (!artist)
              printMessage(
                "warning",
                "Failed to import artist name. Continuing with remaining data.",
              );
            else artist = parseArtist(artist);

            if (!album)
              printMessage(
                "warning",
                "Failed to import release title. Continuing with remaining data.",
              );
            else album = parseAlbum(album);

            if ((await GM.getValue("artist")) && artist) {
              GM.xmlHttpRequest({
                method: "GET",
                url: `https://rateyourmusic.com/go/searchcredits?target=filedunderperformer&label=performer&searchterm=${encodeURIComponent(artist)}`,
                onload: async (response) => {
                  eval(
                    `unsafeWindow.${new DOMParser()
                      .parseFromString(response.responseText, "text/html")
                      .getElementsByClassName("result")[0]
                      .getAttribute("onClick")
                      .replace("window.parent.", "")}`,
                  );
                },
              });
            }
            if ((await GM.getValue("release")) && album)
              document.getElementById("title").value = album;

            const isAdvanced = document
              .getElementById("advancedhelp")
              .checkVisibility();
            if (!isAdvanced) unsafeWindow.goAdvanced();
            document.getElementById("track_advanced").value =
              (await GM.getValue("append"))
                ? document.getElementById("track_advanced").value + result
                : result;
            if (!isAdvanced) unsafeWindow.goSimple();

            if (
              (await GM.getValue("sources")) &&
              !document
                .getElementById("notes")
                .value.includes(document.getElementById("ttrym-link").value)
            ) {
              document.getElementById("notes").value =
                document.getElementById("notes").value +
                (document.getElementById("notes").value === "" ? "" : "\n") +
                document.getElementById("ttrym-link").value;
            }
            document.getElementById("ttrym-link").value = "";

            document.getElementById("ttrym-submit").disabled = false;
            printMessage(
              "success",
              `Imported ${amount} track${amount === 1 ? "" : "s"}.`,
            );
          },

          onerror: (response) => {
            document.getElementById("ttrym-submit").disabled = false;
            printMessage(
              "error",
              response.responseText ||
                "Error during request. Please check your URL and try again.",
            );
          },
        });
      } catch (e) {
        document.getElementById("ttrym-submit").disabled = false;
        printMessage("error", e.toString());
        printMessage("error", e.stack.trim().replaceAll("\n", ", "));
        printMessage(
          "error",
          "Please report this error on Forgejo or via e-mail.",
        );
      }
    });

  document
    .getElementById("ttrym-settings")
    .addEventListener("click", openSettings);

  if ((await GM.getValue("button")) === "take") {
    unsafeWindow.copyTracks = () => {
      if (
        !Array.from(document.getElementById("ttrym-site").options).find(
          (option) => option.value === "Rate Your Music",
        )
      )
        return alert(
          "Rate Your Music is not in the list of enabled sites. Please enable it to continue.",
        );

      GM.xmlHttpRequest({
        method: "POST",
        url: "https://rateyourmusic.com/go/process",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `action=AlbumInfo||${document.getElementById("copy_id").value.match(/\d+/)?.[0]}`,
        onload: async (response) => {
          if (response.status !== 200)
            return alert(
              "No or invalid shortcut specified. Please check your input. It should look like one of the following examples:\n\n[Album12345]\nAlbum12345\n12345",
            );

          let data = response.responseText;
          data = `https://rateyourmusic.com${data.match(/href="(.*?)"/)[1]}`;
          document.getElementById("ttrym-site").value = "Rate Your Music";
          document.getElementById("ttrym-link").value = data;
          document.getElementById("ttrym-submit").click();
        },
      });
    };
  }

  function clearMessages() {
    const levels = ["info", "success", "warning", "error"];
    for (const x of document.querySelectorAll(
      levels.map((x) => `#ttrym-${x}`).join(","),
    ))
      x.remove();
    msgPosted = false;
    if (document.getElementById("ttrym-dismiss"))
      document.getElementById("ttrym-dismiss").remove();
  }

  function decodeHTML(input) {
    if (!input) return;
    const dom = new DOMParser().parseFromString(input, "text/html");
    return dom.documentElement.textContent;
  }

  function escapeHTML(input) {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getResult(index, title, length) {
    return `${parseIndex(index)}|${parseTitle(title)}|${parseLength(length)}\n`;
  }

  function globToRegex(glob) {
    return new RegExp(
      glob.replace(/[.+\-?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*"),
    );
  }

  async function openReset() {
    if (confirm("Do you really want to reset all preferences?")) {
      for (const setting of await GM.listValues())
        await GM.deleteValue(setting);
      location.href = location.href;
    }
  }

  async function openSettings() {
    document.body.style.overflow = "hidden";

    const icon = {
      allesedv: "https://f1.allesedv.com/%s",
      duckduckgo: "https://icons.duckduckgo.com/ip3/%s.ico",
      favicone: "https://favicone.com/%s",
      faviconim: "https://favicon.im/%s",
      faviconis: "https://favicon.is/%s",
      faviconkit: "https://api.faviconkit.com/%s",
      faviconsproxy: "https://favicons.seadfeng.workers.dev/%s.ico",
      gicon: "https://gicon.vercel.app/?url=%s",
      google: "https://www.google.com/s2/favicons?domain=%s",
      hatena: "https://favicon.hatena.ne.jp/?url=https://%s",
      icoapi: "https://favicons.fuzqing.workers.dev/api/getFavicon?url=%s",
      iconhorse: "https://icon.horse/icon/%s",
      splitbee: "https://favicon.splitbee.io/?url=%s",
      twenty: "https://favicon.twenty.com/%s",
      unavatar: "https://unavatar.io/%s",
      xinac: "https://api.xinac.net/icon/?url=%s",
      yandex: "https://favicon.yandex.net/favicon/%s",
    }[await GM.getValue("favicon")];

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div id="ttrym-settings-wrapper">
        <div class="submit_step_box">
          <span class="submit_step_header">${GM.info.script.name}: <span class="submit_step_header_title">Settings</span></span>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-info"></i>Supply additional data <code>(artist, release)</code></b><br />
            While ${GM.info.script.name}'s main goal is to fill in tracklists, it can also enter additional metadata.<br />
            Keep in mind that if enabled and used, any previously input data will be replaced.
          </p>
          <input id="ttrym-artist" name="ttrym-artist" type="checkbox" />
          <label for="ttrym-artist">Artist name <span>Step 1.3 (“File under”)</span></label><br />
          <input id="ttrym-release" name="ttrym-release" type="checkbox" />
          <label for="ttrym-release">Release title <span>Step 2.1 (“Title”)</span></label>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-globe"></i>Manage sites <code>(sitesv2)</code></b><br />
            Choose which sites to show and which ones to hide in the ${GM.info.script.name} selection box.<br />
            If your site is missing, send a request via <a href="https://forgejo.sny.sh/sun/userscripts/issues" target="_blank">Forgejo</a> or <a href="mailto:sunny@sny.sh">e-mail</a> or <a href="https://forgejo.sny.sh/sun/userscripts/src/branch/main/assets/tutorial.md" target="_blank">add it yourself</a>.
          </p>
          ${sitestmp
            .map(
              (x) => `
            <input type="checkbox" class="ttrym-checkbox" id='ttrym-site-${x.name.replace(/\s/g, "")}' name="${x.name}" />
            <label for='ttrym-site-${x.name.replace(/\s/g, "")}'>
              <img src="${icon ? icon.replace("%s", new URL(x.placeholder.replaceAll("*.", "")).hostname) : x.icon || `${new URL(x.placeholder.replaceAll("*.", "")).origin}/favicon.ico`}" onerror="this.style.visibility = 'hidden'" />
              ${x.name}
              <span>${x.placeholder}</span>
            </label><br />
          `,
            )
            .join("")}
          <br />
          <div>
            <button id="ttrym-enable" class="btn blue_btn btn_small">Enable all sites</button>
            <button id="ttrym-invert" class="btn flat_btn btn_small">Invert selection</button>
            <button id="ttrym-disable" class="btn flat_btn btn_small">Disable all sites</button>
          </div>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-bookmark"></i>Set default site <code>(default)</code></b><br />
            Choose which site should be selected by default; you may choose the site that you use the most.<br />
            If the chosen site isn't already, it will be enabled automatically.
          </p>
          <select id="ttrym-default">
            ${sitestmp
              .map(
                (x) => `
              <option value="${x.name}">${x.name}</option>
            `,
              )
              .join("")}
          </select>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-search"></i>Auto-select sites <code>(guess)</code></b><br />
            Select whether to guess sites from their URL and automatically select them.<br />
            This has been the default behavior since version 1.10.0.
          </p>
          <input id="ttrym-change" name="ttrym-change" type="checkbox" />
          <label for="ttrym-change">Guess and automatically select sites</label>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-check"></i>Enable new sites by default <code>(enbydef)</code></b><br />
            Select whether to automatically enable new sites for which support has been added after an update.<br />
            This has been the default behavior since version 1.26.0.
          </p>
          <input id="ttrym-enbydef" name="ttrym-enbydef" type="checkbox" />
          <label for="ttrym-enbydef">Automatically enable newly supported sites</label>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-plus"></i>Append instead of replace <code>(append)</code></b><br />
            Enabling this will allow you to combine multiple releases into one by keeping previous tracks when inserting new ones.
          </p>
          <input id="ttrym-append" name="ttrym-append" type="checkbox" />
          <label for="ttrym-append">Append tracks to list</label>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-link"></i>Add URL to sources <code>(sources)</code></b><br />
            Select whether to automatically add the entered URL to the submission sources in step five.<br />
            This has been the default behavior since version 1.3.0.
          </p>
          <input id="ttrym-sources" name="ttrym-sources" type="checkbox" />
          <label for="ttrym-sources">Automatically add URLs to sources</label>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-copy"></i>“Copy Tracks” button behavior <code>(button)</code></b><br />
            Rate Your Music provides a “Copy Tracks” button, which allows you to import the tracklist of other Rate Your Music releases.<br />
            Below, you can choose what ${GM.info.script.name} should do with this button.
          </p>
          <p>
            <b>Keep button:</b> Do not alter the button's behavior in any way.<br />
            <b>Take over:</b> Fulfill requests via ${GM.info.script.name} instead of natively.<br />
            <b>Remove button:</b> Remove the button entirely.
          </p>
          <select id="ttrym-button">
            <option value="keep">Keep button</option>
            <option value="take">Take over</option>
            <option value="remove">Remove button</option>
          </select>
          <div class="submit_field_header_separator"></div>
          <p>
            <b class="submit_field_header"><i class="fas fa-image"></i>Set favicon provider <code>(favicon)</code></b><br />
            If the icons above are slow to load or you have privacy concerns, you can choose another favicon provider below.
          </p>
          <select id="ttrym-favicon">
            <option value="">icon or favicon.ico</option>
            <option value="allesedv">AllesEDV</option>
            <option value="duckduckgo">DuckDuckGo</option>
            <option value="faviconkit">Favicon Kit</option>
            <option value="faviconim">Favicon.im</option>
            <option value="faviconis">Favicon.is</option>
            <option value="favicone">Favicone</option>
            <option value="faviconsproxy">Favicons Proxy</option>
            <option value="gicon">Gicon</option>
            <option value="google">Google</option>
            <option value="hatena">Hatena</option>
            <option value="icoapi">ICO API</option>
            <option value="iconhorse">Icon Horse</option>
            <option value="splitbee">Splitbee</option>
            <option value="twenty">Twenty</option>
            <option value="unavatar">unavatar</option>
            <option value="yandex">Yandex</option>
            <option value="xinac">新逸网络</option>
          </select>
          <div class="submit_field_header_separator"></div>
          <p>You can also directly edit these settings in your userscript manager:</p>
          <p>
            <b><a href="https://addons.mozilla.org/firefox/addon/firemonkey/" target="_blank"><img src="https://addons.mozilla.org/user-media/addon_icons/1019/1019336-64.png"> FireMonkey</a>:</b> Options → Script & CSS → ${GM.info.script.name} → ⋮ → Storage<br />
            <b><a href="https://docs.scriptcat.org/" target="_blank"><img src="https://docs.scriptcat.org/img/logo.png"> ScriptCat</a>:</b> ⌂ → Install Script → ${GM.info.script.name} → 工具 → 脚本储存<br />
            <b><a href="https://www.tampermonkey.net/" target="_blank"><img src="https://www.tampermonkey.net/images/icon48.png"> Tampermonkey</a>:</b> Dashboard → Installed userscripts → ${GM.info.script.name} → Edit → Storage<br />
            <b><a href="https://addons.mozilla.org/firefox/addon/userunified-script-injector/" target="_blank"><img src="https://addons.mozilla.org/user-media/addon_icons/597/597912-64.png"> USI</a>:</b> all Userscripts → ${GM.info.script.name} → ⋮ → GM Values show<br />
            <b><a href="https://violentmonkey.github.io/" target="_blank"><img src="https://violentmonkey.github.io/_astro/vm.C4h557K-.png"> Violentmonkey</a>:</b> Open Dashboard → Installed scripts → ${GM.info.script.name} → Edit → Values
          </p>
          <p>Finally, you can view all values below. This does not include changes that haven't been saved yet.</p>
          <textarea rows="5" readonly>${JSON.stringify(await GM.getValues(await GM.listValues()), null, "\t")}</textarea>
          <div>
            <button id="ttrym-save" class="btn blue_btn btn_small">Save and reload page</button>
            <button id="ttrym-discard" class="btn flat_btn btn_small">Close window without saving</button>
            <button id="ttrym-reset" class="btn flat_btn btn_small">Reset and reload page</button>
          </div>
        </div>
        <style>
          #ttrym-settings-wrapper {
            box-sizing: border-box;
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 42px;
            background: var(--background);
            padding: 50px;
            z-index: 80;
          }
          #ttrym-settings-wrapper .submit_step_box {
            padding: 25px;
            height: calc(100% - 50px);
            overflow: auto;
          }
          #ttrym-settings-wrapper .submit_step_header {
            margin: 0 !important;
          }
          #ttrym-settings-wrapper .submit_field_header_separator {
            margin-top: 15px;
            margin-bottom: 15px;
          }
          #ttrym-settings-wrapper .submit_field_header {
            display: block;
            margin-top: 1em;
            margin-bottom: -1em;
          }
          #ttrym-settings-wrapper .submit_field_header i {
            margin-right: 0.5em;
          }
          #ttrym-settings-wrapper .submit_field_header code {
            opacity: 0.5;
          }
          #ttrym-settings-wrapper input {
            margin-bottom: 0.25em;
          }
          #ttrym-settings-wrapper input[type="checkbox"],
          #ttrym-settings-wrapper input[type="checkbox"] + label {
            cursor: pointer;
            margin-right: 2px;
          }
          #ttrym-settings-wrapper img {
            width: 16px;
            height: 16px;
            object-fit: contain;
            position: relative;
            top: 4px;
            margin: 0 2px;
          }
          #ttrym-settings-wrapper label {
            position: relative;
            bottom: 1px;
          }
          #ttrym-settings-wrapper label span {
            opacity: 0.5;
            font-weight: lighter;
          }
          #ttrym-settings-wrapper button:not(:first-child) {
            margin-left: 10px;
          }
          #ttrym-settings-wrapper textarea {
            margin-bottom: 1em;
            font-family: monospace;
            font-size: 1em;
            resize: vertical;
          }
          #ttrym-settings-wrapper p + p {
            margin-top: -0.5em;
          }
        </style>
      </div>
    `,
    );

    document.getElementById("ttrym-artist").checked =
      await GM.getValue("artist");
    document.getElementById("ttrym-release").checked =
      await GM.getValue("release");
    for (const element of Array.from(
      document.getElementsByClassName("ttrym-checkbox"),
    ))
      if (sites.map((x) => x.name).includes(element.name))
        element.checked = true;
    document.getElementById("ttrym-default").value =
      await GM.getValue("default");
    document.getElementById("ttrym-change").checked =
      await GM.getValue("guess");
    document.getElementById("ttrym-enbydef").checked =
      await GM.getValue("enbydef");
    document.getElementById("ttrym-append").checked =
      await GM.getValue("append");
    document.getElementById("ttrym-sources").checked =
      await GM.getValue("sources");
    document.getElementById("ttrym-button").value = await GM.getValue("button");
    document.getElementById("ttrym-favicon").value =
      await GM.getValue("favicon");

    document.getElementById("ttrym-enable").addEventListener("click", () => {
      for (const element of Array.from(
        document.getElementsByClassName("ttrym-checkbox"),
      ))
        element.checked = true;
    });

    document.getElementById("ttrym-invert").addEventListener("click", () => {
      for (const element of Array.from(
        document.getElementsByClassName("ttrym-checkbox"),
      ))
        element.checked = !element.checked;
    });

    document.getElementById("ttrym-disable").addEventListener("click", () => {
      for (const element of Array.from(
        document.getElementsByClassName("ttrym-checkbox"),
      ))
        element.checked = false;
    });

    document.getElementById("ttrym-reset").addEventListener("click", openReset);

    document
      .getElementById("ttrym-save")
      .addEventListener("click", async () => {
        const sites = Array.from(
          document.querySelectorAll(".ttrym-checkbox:checked"),
        ).map((x) => x.name);

        await GM.setValue(
          "artist",
          document.getElementById("ttrym-artist").checked,
        );
        await GM.setValue(
          "release",
          document.getElementById("ttrym-release").checked,
        );
        await GM.setValue("sitesv2", sitesV1ToV2(sites));
        await GM.setValue(
          "default",
          document.getElementById("ttrym-default").value,
        );
        await GM.setValue(
          "guess",
          document.getElementById("ttrym-change").checked,
        );
        await GM.setValue(
          "enbydef",
          document.getElementById("ttrym-enbydef").checked,
        );
        await GM.setValue(
          "append",
          document.getElementById("ttrym-append").checked,
        );
        await GM.setValue(
          "sources",
          document.getElementById("ttrym-sources").checked,
        );
        await GM.setValue(
          "button",
          document.getElementById("ttrym-button").value,
        );
        await GM.setValue(
          "favicon",
          document.getElementById("ttrym-favicon").value,
        );

        if (!sites.includes(document.getElementById("ttrym-default").value))
          await GM.setValue(
            "sitesv2",
            sitesV1ToV2(
              sites.concat(document.getElementById("ttrym-default").value),
            ),
          );

        location.href = location.href;
      });

    document.getElementById("ttrym-discard").addEventListener("click", () => {
      document.body.style.overflow = "initial";
      document.getElementById("ttrym-settings-wrapper").remove();
    });
  }

  function parseAlbum(album) {
    return album.trim().replace(/^\u2013\s/, "");
  }

  function parseArtist(artist) {
    return artist.trim();
  }

  function parseIndex(index) {
    return index.toString().trim().replace(/^0+/, "").replace(/\.$/, "");
  }

  function parseLength(input) {
    let output = input;
    if (!output) return "";
    if (typeof output !== "string") output = output.toString();
    if (output === "?:??" || output === "-") return "";
    if (output.match(/PT(\d+H)?\d+M\d+S/))
      output = output.replace(/[PTS]/g, "").replace(/[HM]/g, ":");
    if (Number(output))
      output = new Date(Number(output)).toISOString().split(/[TZ]/)[1];
    let matches = output.match(/(\d*:)+\d+/);
    if (matches) {
      matches = matches[0].replace(/^(0*:?)+/, "");
      if (!matches.includes(":")) {
        if (matches < 10) matches = `0${matches}`;
        matches = `0:${matches}`;
      }
      matches = matches.replace(/\..*/, "");
      return matches;
    }
    return output;
  }

  function parseNode(node) {
    return node ? (node.firstChild ? node.firstChild.nodeValue : "") : "";
  }

  function parseTitle(title) {
    return title.trim().replace(/^(& {2})?(- )/, "");
  }

  function printMessage(level, message) {
    const capitalizedLevel = level.charAt(0).toUpperCase() + level.slice(1);
    parent.insertAdjacentHTML(
      "beforeend",
      `<p id='ttrym-${level}' style='font-size:small;line-height:1.5;text-wrap:nowrap;overflow:hidden;text-overflow:ellipsis;${msgPosted ? "" : "margin-top:.5em;"}margin-bottom:0' title='${escapeHTML(`${capitalizedLevel}: ${message}`)}'><span style='margin-right:.5em;padding:0 .25em;border-radius:.25em;background:var(--${level === "info" ? "text-primary" : `alert-${level}-background`});color:var(--background);font-size:smaller'>${capitalizedLevel}</span>${escapeHTML(message)}</p>`,
    );
    msgPosted = true;
    if (!document.getElementById("ttrym-dismiss"))
      document
        .getElementById("ttrym-settings")
        .insertAdjacentHTML(
          "beforebegin",
          "<button id='ttrym-dismiss' style='font-family:\"Font Awesome 5 Free\";border:none;background:none;color:inherit;font-size:1.5em;margin-left:.5em;cursor:pointer' title='Dismiss'>&#xf0c9;</button>",
        );
  }

  function reduceJson(input, path) {
    let output = input;
    if (typeof output !== "object") output = JSON.parse(output);
    return path.split(".").reduce((acc, cur) => acc?.[cur], output);
  }

  function sitesV1ToV2(input) {
    let tmp = input;
    if (!Array.isArray(tmp)) tmp = tmp.split(",");
    const output = {};
    for (const x of sitestmp) output[x.name] = tmp.includes(x.name);
    return output;
  }
})();
