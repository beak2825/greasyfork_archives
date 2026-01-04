// ==UserScript==
// @name           Mofo
// @description    Add links (in torrent description) to external sources for more information.
// @author         _
// @version        0.40
// @grant          GM.xmlHttpRequest
// @connect        www.junodownload.com
// @connect        www.allmusic.com
// @connect        listen.tidal.com
// @connect        api.deezer.com
// @connect        api.discogs.com
// @connect        itunes.apple.com
// @connect        bandcamp.com
// @connect        beatport.com
// @connect        bleep.com
// @connect        qobuz.com
// @connect        bing.com
// @connect        www.bing.com
// @connect        musicbrainz.org
// @match          https://redacted.ch/torrents.php?action=editgroup&groupid=*
// @match          https://redacted.ch/torrents.php?id=*
// @match          https://redacted.ch/user.php?action=edit&*
// @match          https://orpheus.network/torrents.php?action=editgroup&groupid=*
// @match          https://orpheus.network/torrents.php?id=*
// @match          https://orpheus.network/user.php?action=edit&*
// @run-at         document-end
// @namespace      _
// @downloadURL https://update.greasyfork.org/scripts/450680/Mofo.user.js
// @updateURL https://update.greasyfork.org/scripts/450680/Mofo.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const myUID = document.querySelector("#nav_userinfo > a.username").href.split("=")[1];
  const MofoConfig = JSON.parse(localStorage.getItem("mofo_config") || '{"mofo_summary": "Mofo", "discogs_token": "", "allmusic_review": false, "before_links": false}');

  if (location.href.includes(`action=edit&userid=${myUID}`)) {
    const updateMofoConfig = (e) => {
      const config = {};
      config.before_links = document.getElementById("before_links").checked;
      config.allmusic_review = document.getElementById("allmusic_review").checked;
      config.discogs_token = document.getElementById("discogs_token").value;
      config.mofo_summary = document.getElementById("mofo_summary").value;
      localStorage.setItem("mofo_config", JSON.stringify(config));
    };
    // ref: pootie's External Stylesheet Switcher
    const torGrouping = $("#tor_group_tr");
    const MofoSummaryRow = $(`
      <tr>
        <td class="label tooltip">
          <strong>Mofo Summary Text:</strong>
        </td>
      </tr>
    `);
    const ReviewPosition = $(`
      <li>
        <input type="checkbox" name="before_links" id="before_links">
        <label for="showtfilter">Append AllMusic Review Before Mofo Links</label>
      </li>
    `);
    const AllMusicRow = $(`
      <tr>
        <td class="label tooltip">
          <strong>Mofo AllMusic:</strong>
        </td>
      </tr>
    `);
    const AllMusicCol = $(`<td></td>`);
    const AllMusicUl = $(`<ul class="options_list nobullet"></ul>`);
    const AllMusicReviews = $(`
      <li>
        <input type="checkbox" name="allmusic_review" id="allmusic_review">
        <label for="showtfilter">Include review in torrent description</label>
      </li>
    `);
    AllMusicUl.append([AllMusicReviews,ReviewPosition]);
    AllMusicCol.append(AllMusicUl);
    AllMusicRow.append(AllMusicCol);
    const MofoSummaryCol = $(`<td></td>`);
    const MofoSummaryTxt = $(`<input type="text" size="40" name="mofo_summary" id="mofo_summary" value="${MofoConfig.mofo_summary}">`)
    const DiscogsTokenRow= $(`
      <tr>
        <td class="label tooltip">
          <strong>Mofo Discogs Token:</strong>
        </td>
      </tr>
    `);
    const DiscogsTokenCol = $(`<td></td>`);
    const DiscogsTokenTxt = $(`<input type="text" size="40" name="discogs_token" id="discogs_token" value="${MofoConfig.discogs_token}">`)
    MofoSummaryCol.append(MofoSummaryTxt);
    MofoSummaryRow.append(MofoSummaryCol);
    torGrouping.after(MofoSummaryRow);
    DiscogsTokenCol.append(DiscogsTokenTxt);
    DiscogsTokenRow.append(DiscogsTokenCol);
    torGrouping.after(DiscogsTokenRow);
    torGrouping.after(AllMusicRow);
    document.getElementById("before_links").checked = MofoConfig.before_links;
    document.getElementById("allmusic_review").checked = MofoConfig.allmusic_review;
    document.getElementById("userform").addEventListener("submit", updateMofoConfig);
    return;
  }

  const groupid = new URL(window.location).searchParams.get("groupid");
  if (!groupid) {
    // we are on a torrent page
    const id = new URL(window.location).searchParams.get("id");
    const editDescr = document.querySelector("div.header > .linkbox").firstElementChild;
    editDescr.insertAdjacentHTML("afterend", ` <a href=torrents.php?action=editgroup&groupid=${id}&mofo=true class="brackets">Mofo</a>`);
    return;
  }

  const promises = [];
  const previewBtn = document.querySelector('.button_preview_0');

  $('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
  previewBtn.insertAdjacentHTML(
    "afterend",
    ` <i style="display: none; padding: 10px;" id="spinner" class="fa fa-spinner fa-spin"></i><input type="button" value="Mofo" id="button_mofo" title="More Info">`
  );

  const decodeHTML = orig => {
    const txt = document.createElement("textarea");
    txt.innerHTML = orig;
    return txt.value;
  };

  const sanitize = text => {
    return text
      .replace(/\s+\(?EP\)?$/i, "")
      .replace(/\s+\(cover\)$/i, "")
      .toLowerCase()
      .trim();
  };

  const gazelleAPI = async groupid => {
    try {
      const res = await fetch(`/ajax.php?action=torrentgroup&id=${groupid}`);
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const corsFetch = url => {
    const headers = {};
    if (url.includes("tidal")) {
      headers['x-tidal-token'] = "CzET4vdadNUFQ5JU";
    }
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: encodeURI(url),
        headers: headers,
        onload: res => resolve(res.responseText),
        onerror: res => reject(res)
      });
    });
  };

  const fetchJSON = async url => {
    const responseText = await corsFetch(url);
    return JSON.parse(responseText);
  };

  const fetchDOM = async url => {
    const responseText = await corsFetch(url);
    const parser = new DOMParser();
    return parser.parseFromString(responseText, "text/html");
  };

  const appleSearch = async (artist, album, upc) => {
    try {
      let response = await fetchJSON(`https://itunes.apple.com/lookup?upc=${upc}&entity=album`);
      let itunes_id;
      if (response.results.length > 0) {
        itunes_id = response.results[0].collectionId;
      }
      if (itunes_id) {
        return {source: "Apple", url: `https://music.apple.com/album/${itunes_id}`}
      }
      console.log("Apple: UPC search failed; trying direct artist - title query.")
      response = await fetchJSON(`https://itunes.apple.com/search?term=${artist} - ${album}&entity=album`);
      if (response.results.length > 0) {
        const collection = response.results.find(release => sanitize(artist).includes(sanitize(release.artistName)) && sanitize(album).includes(sanitize(release.collectionName)));
        itunes_id = collection.collectionId;
      }
      if (itunes_id) {
        return {source: "Apple", url: `https://music.apple.com/album/${itunes_id}`}
      }
    } catch (e) {
      console.error(
        `Oops! Apple search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const searchDiscogs = async (artist, album) => {
    try {
      const response = await fetchJSON(`https://api.discogs.com/database/search?release_title=${album}&artist=${artist}&token=${MofoConfig.discogs_token}`);
      if (response.results.length == 0) console.log('Discogs: no match.')
      const master = response.results.find(release => sanitize(release.title).includes(sanitize(artist)) && sanitize(release.title).includes(sanitize(album)));
      if (master) {
        if (master.master_id) return {source: "Discogs", url: `https://www.discogs.com/master/${master.master_id}`};
        return {source: "Discogs", url: `https://www.discogs.com${master.uri}`};
      }
    } catch (e) {
      console.error(
        `Oops! Discogs search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const deezSearch = async (artist, album, upc) => {
    try {
      let response = await fetchJSON(`https://api.deezer.com/album/upc:${upc}`);
      let deezer_id = response.hasOwnProperty("error") ? false : response.id;
      if (deezer_id) {
        return {source: "Deezer", url: `https://www.deezer.com/en/album/${deezer_id}`}
      }
      console.log("Deezer: UPC search failed; querying API directly for artist - title.")
      response = await fetchJSON(
        `https://api.deezer.com/search?q=artist:"${sanitize(artist)}" album:"${sanitize(album)}"`
      );
      const found_album = response.data.find(release => sanitize(artist).includes(sanitize(release.artist.name)) && sanitize(album).includes(sanitize(release.album.title)));
      if (found_album) {
        return {source: "Deezer", url: `https://www.deezer.com/en/album/${found_album.album.id}`}
      }
    } catch (e) {
      console.error(
        `Oops! Deezer search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const qobuzSearch = async (artist, album) => {
    try {
      const query = `${artist} - ${album}`;
      const doc = await fetchDOM(
        `https://qobuz.com/nz-en/search?q=${query}`
      );
      const releases = [...doc.querySelectorAll('#main-column > div.search-results > div > div.detail')];
      const found_album = releases.find(release => {
        if (sanitize(release.querySelector('.artist-name').innerText).includes(sanitize(artist))) {
          return sanitize(release.querySelector('.album-title').innerText).includes(sanitize(album));
        }
      });
      const purchaseLink = found_album.querySelector('div.price-box > div.action > ul > li:nth-child(1) > a').href;
      if (purchaseLink) {
        return {source: "Qobuz", url: purchaseLink.replace(location.origin, "https://www.qobuz.com")};
      }
    } catch (e) {
      console.error(`Oops! Qobuz search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  // bleep's internal search is cumbersome; better luck using bing
  const bleepSearch = async (artist, album) => {
    try {
      const doc = await fetchDOM(
        `https://bing.com/search?q=${artist} ${album} site:bleep.com`
      );
      const nodes = [...doc.querySelectorAll('li.b_algo h2 > a')];
      const found_album = nodes.find(
        item =>
          sanitize(item.innerText).includes(sanitize(album)) &&
          sanitize(item.innerText).includes(sanitize(artist)));
      const bingObfuscate = await corsFetch(found_album.href);
      const bleepString = bingObfuscate.match(/bleep\.com\/release\/([^";]+)/);
      if (bleepString && bleepString.length == 2) {
        return {source: "Bleep", url: `https://bleep.com/release/${bleepString[1]}`};
      }
    } catch (e) {
      console.error(
        `Oops! Bleep search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  // spotify requires account/api key, so using bing
  const spotifySearch = async (artist, album) => {
    try {
      const doc = await fetchDOM(
        `https://bing.com/search?q=${artist} ${album} site:open.spotify.com/album`
      );
      const nodes = [...doc.querySelectorAll('li.b_algo h2 > a')];
      const found_album = nodes.find(
        item =>
          sanitize(item.innerText).includes(sanitize(album)) &&
          sanitize(item.innerText).includes(sanitize(artist)));
      const bingObfuscate = await corsFetch(found_album.href);
      const spotifyString = bingObfuscate.match(/album\/([a-zA-Z0-9]+)/);
      if (spotifyString && spotifyString.length == 2) {
        return {source: "Spotify", url: `https://open.spotify.com/album/${spotifyString[1]}`};
      }
    } catch (e) {
      console.error(
        `Oops! Spotify search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  // bandcamp's internal search is cumbersome; try using bing first
  const bandSearch = async (artist, album) => {
    try {
      let doc = await fetchDOM(
        `https://bing.com/search?q=site:bandcamp.com/album ${artist} ${album}`
      );
      const nodes = [...doc.querySelectorAll('li.b_algo h2 > a')];
      const found_album = nodes.find(
        item =>
          sanitize(item.innerText).includes(sanitize(album)) &&
          sanitize(item.innerText).includes(sanitize(artist)));
      const bingObfuscate = await corsFetch(found_album.href);
      const bandcampLink = bingObfuscate.match(/"(https:\/\/.+bandcamp\.com.+)"/);
      if (bandcampLink && bandcampLink.length == 2) {
        return {source: "Bandcamp", url: `${bandcampLink[1]}`};
      } else {
        // fall back to BC search
        console.log("Bandcamp: Bing failed; attempting direct search.")
        doc = await fetchDOM(`https://bandcamp.com/search?q=${artist} - ${album}`);
        for (const result of doc.querySelectorAll('.searchresult.album')) {
          let albumTitle = result.querySelector('div.result-info > .heading').innerText.trim();
          let albumArtist = result.querySelector('div.result-info > .subhead').innerText.trim().replace("by ", "");
          if (sanitize(albumTitle).includes(sanitize(album)) && sanitize(albumArtist).includes(sanitize(artist))) {
            let directLink = result.querySelector('div.result-info > .heading > a').href.split('?')[0]
            return {source: "Bandcamp", url: directLink};
          }
        }
      }
      const bclink = found_album.href;
      if (bclink && bclink.includes("bandcamp")) {
        return {source: "Bandcamp", url: bclink.split('?')[0]};
      }
    } catch (e) {
      console.error(
        `Oops! Bandcamp search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const beatSearch = async (artist, album) => {
    try {
      const query = `${artist} - ${album}`;
      const doc = await fetchDOM(
        `https://www.beatport.com/search?q=${query}`
      );
      const releases = [...doc.querySelectorAll('ul.bucket-items > li.bucket-item.ec-item.release')];
      const found_album = releases.find(release => {
        if (sanitize(release.querySelector('p.release-artists').innerText).includes(sanitize(artist))) {
          return sanitize(release.querySelector('p.release-title').innerText).includes(sanitize(album));
        }
      });
      const purchaseLink = found_album.querySelector('p.release-title > a').href;
      if (purchaseLink) {
        return {source: "Beatport", url: purchaseLink.replace(location.origin, "https://beatport.com")};
      }
    } catch (e) {
      console.error(`Oops! Beatport search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const junoSearch = async (artist, album) => {
    try {
      const query = `${artist} - ${album}`;
      const doc = await fetchDOM(
        `https://www.junodownload.com/search/?solrorder=relevancy&q[all][]=${query}&track_sale_format=flac`
      );
      const artists = [...doc.querySelectorAll(".juno-artist")];
      const found_artists = artists.filter(node =>
        sanitize(node.innerText).includes(sanitize(artist))
      );
      const found_album = found_artists.find(
        artist =>
          sanitize(artist.parentNode.nextElementSibling.querySelector(".juno-title").innerText) === sanitize(album)
      );
      const parentNode = found_album.parentNode.parentNode;
      const purchaseLink = "https://" + parentNode
        .querySelector(".juno-title")
        .href.replace(`${location.origin}`, "www.junodownload.com");
      if (purchaseLink) {
        return {source: "Juno", url: purchaseLink};
      }
    } catch (e) {
      console.error(`Oops! Juno search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const allMusicSearch = async (artist, album) => {
    try {
      let review = false;
      const query = `${artist} ${album}`;
      let doc = await fetchDOM(`https://www.allmusic.com/search/all/${query}`);
      const albums = [...doc.querySelectorAll("div.results li.album")];
      const found_album = albums.find(
        captured => sanitize(captured.querySelector('.title').innerText).includes(sanitize(album)) && sanitize(captured.querySelector('.artist').innerText).includes(sanitize(artist))
      );
      const allMusicLink = found_album.querySelector('div.title > a')
        .href.replace(`${location.origin}`, "www.allmusic.com");
      if (MofoConfig.allmusic_review) {
        doc = await fetchDOM(allMusicLink);
        const authorElem = doc.querySelector('div.review-headline-container > p > span');
        const reviewElem = [...doc.querySelectorAll('section.read-more > div.text > p')];
        if (authorElem && reviewElem) {
          review = {author: authorElem.innerText.trim(), text: reviewElem.map((e) => e.innerText.trim()).join("\n\n")}
        }
      }
      return {source: "AllMusic", url: allMusicLink, review: review};
    } catch (e) {
      console.error(`Oops! AllMusic search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const tidalSearch = async (artist, album, upc) => {
    try {
      const query = `${artist} - ${album}`;
      const response = await fetchJSON(`https://listen.tidal.com/v1/search?query=${query}&limit=10&offset=0&types=ALBUMS&includeContributors=true&countryCode=US`);
      for (const release of response.albums.items) {
        if (upc && release['upc'].includes(upc)) {
          return {source: "Tidal", url: `https://tidal.com/browse/album/${release['url'].split("/").pop()}`};
        } else if (sanitize(release['artists'][0]['name']) == sanitize(artist) && sanitize(release['title']) == sanitize(album)) {
          return {source: "Tidal", url: `https://tidal.com/browse/album/${release['url'].split("/").pop()}`};
        }
      }
    } catch (e) {
      console.error(`Oops! Tidal search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const musicBrainzSearch = async (artist, album) => {
    try {
      const response = await fetchJSON(`https://musicbrainz.org/ws/2/release-group?query="${album}" AND artist:${artist}&fmt=json`);
      if (response['release-groups'].length == 0) console.log("MusicBrainz: no match.");
      for (const release of response['release-groups']) {
        if (!sanitize(release.title).includes(sanitize(album))) continue;
        for (const mbartist of release['artist-credit']) {
          if (sanitize(mbartist.name).includes(sanitize(artist))) {
            return {source: "MusicBrainz", url: `https://musicbrainz.org/release-group/${release.id}`};
          }
        }
      }
    } catch (e) {
      console.error(`Oops! MusicBrainz search failed (probably, release not found)...${e && e.message && `\n(${e.message})`}`
      );
    }
  };

  const searchForLinks = async (event) => {
    event.target.removeEventListener("click", searchForLinks);
    document.querySelector('#button_mofo').style.display = "none";
    document.querySelector('#spinner').style.display = "";
    gazelleAPI(groupid).then(({ response, status }) => {
      if (status !== "success") {
        console.log("API request failed; aborting.");
        return;
      } 
      const artist = decodeHTML(response.group.musicInfo.artists[0].name);
      const album = decodeHTML(response.group.name);
      const torrents = response.torrents.filter(torrent => /\b(\d{10,})\b/.test(torrent.remasterCatalogueNumber));
      let upc;
      if (torrents.length != 0) {
        upc = torrents[0].remasterCatalogueNumber.match(/\b(\d{10,})\b/);
      }
      if (upc && upc.length == 2) {
        upc = upc[1];
      }
      promises.push(deezSearch(artist, album, upc));
      promises.push(allMusicSearch(artist, album));
      promises.push(appleSearch(artist, album, upc));
      promises.push(bandSearch(artist, album));
      promises.push(bleepSearch(artist, album));
      promises.push(junoSearch(artist, album));
      promises.push(beatSearch(artist, album));
      promises.push(qobuzSearch(artist,album));
      promises.push(searchDiscogs(artist,album));
      promises.push(musicBrainzSearch(artist,album));
      promises.push(spotifySearch(artist,album));
      promises.push(tidalSearch(artist, album, upc));
      Promise.all(promises).then((results) => {
        const moreInfo = [];
        results.sort((a, b) => {
          var sourceA = a.source.toUpperCase();
          var sourceB = b.source.toUpperCase();
          if (sourceA < sourceB) {
            return -1;
          }
          if (sourceA > sourceB) {
            return 1;
          }
          return 0;
        });
        results.forEach(result => {
          if (!result) return;
            moreInfo.push(`[url=${result.url}]${result.source}[/url]`)
        });
        if (moreInfo.length > 0) {
          const allMusicReview = results.find(result => result && result.source == "AllMusic" && result.review);
          if (allMusicReview && MofoConfig.before_links) {
            groupDesc.value += `\n\n[quote=AllMusic]${allMusicReview.review.text}\n[align=right]- ${allMusicReview.review.author}[/align][/quote]`
          } else {
            groupDesc.value += "\n\n";
          }
          groupDesc.value += "[b]More info:[/b] " + moreInfo.join(" | ");
          if (allMusicReview && !MofoConfig.before_links) {
            groupDesc.value += `\n\n[quote=AllMusic]${allMusicReview.review.text}\n[align=right]- ${allMusicReview.review.author}[/align][/quote]`
          }
          document.getElementsByName('summary')[0].value = MofoConfig.mofo_summary;
        }
        groupDesc.style.height = groupDesc.scrollHeight + "px";
        if ([...document.getElementById('preview_wrap_0').classList].includes("hidden")) {
          previewBtn.click();
        } else {
          previewBtn.click();
          groupDesc.style.height = groupDesc.scrollHeight + "px";
          previewBtn.click();
        }
        document.querySelector('#spinner').style.display = "none";
      });
    });
  }
  const groupDesc = document.querySelector('#textarea_wrap_0 > textarea');
  groupDesc.style.height = groupDesc.scrollHeight + "px";
  document.getElementById("button_mofo").addEventListener("click", searchForLinks);
  const autoMofo = new URL(window.location).searchParams.get("mofo");
  if (autoMofo) {
    document.getElementById("button_mofo").click();
  }
})();