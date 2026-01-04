// ==UserScript==
// @name        Pinback Next
// @namespace   https://www.octt.eu.org/
// @match       https://*.pinterest.*/*
// @grant       none
// @version     0.5.2
// @author      OctoSpacc
// @license     MIT
// @description The backup and export tool Pinterest forgot, finally revived!
// @run-at      context-menu
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/489596/Pinback%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/489596/Pinback%20Next.meta.js
// ==/UserScript==

GM_registerMenuCommand('Open Export Tool', async function() {
  const version = '0.5.2';
  const homepageUrl = 'https://greasyfork.org/en/scripts/489596-pinback-next';
  var boards = {}
    , board = {}
    , pins = []
    , pin_count = 0
    , username;

  if (match = location.href.match(/^https:\/\/www\.pinterest\..*?\/([a-z0-9_]{1,30})/i)) {
    username = match[1];
    const resource = await getResource('Boards', { username, field_set_key: 'detailed' });
    start(resource);
  } else {
    alert('Log in and visit your profile (pinterest.com/username) or board to start');
    return false;
  }

  function start(json) {
    if (document.querySelector('#pboverlay')) return false;

    var overlay = document.createElement('div');
    overlay.id = 'pboverlay';
    overlay.innerHTML = `
<style>
  #pboverlay { display: block; bottom: 0; left: 0; right: 0; top: 0; z-index: 9999; position: fixed; background: rgba(0, 0, 0, 0.8); color: white; text-align: center; }
  #pboverlay .close { color: white; position: absolute; top:10px; right:20px; font-size: 30px; }
  #pboverlay .standardForm { top: 50%; margin-top: -100px; position: absolute; width: 100%; max-width: none; }
  #pboverlay h1 { color: white; }
  #pboverlay .controls a { display: inline-block; }
  #pboverlay select, #pboverlay meter { width: 100%; max-width: 300px; !important }
  #pboverlay .btn, #pboverlay select { padding: 1em; background-color: lightgray; color: black; border: none; border-radius: 4px; }
  #pboverlay a { color: #eeeeee; }
</style>
<a href="#" class="close">&times;</a>
<form class="standardForm">
  <h1>Choose a board to export</h1>
  <p class="controls">
    <select></select>
    <button class="btn">
      <span>Export 📦</span>
    </button>
  </p>
  <p><a href="${homepageUrl}">Pinback Next v${version}</a></p>
</form>`;

    document.querySelector('body').appendChild(overlay);
    const select = document.querySelector('#pboverlay select');
    const option = document.createElement('option');
    option.text = '[ All public pins ]';
    option.value = 'all';
    select.add(option);

    Array.prototype.forEach.call(json.resource_response.data, function (board) {
      const option = document.createElement('option');
      option.text = board.name;
      option.value = board.id;
      option.selected = (location.pathname === board.url);
      select.add(option);
    });

    document.querySelector('#pboverlay button').onclick = async function() {
      document.querySelector('#pboverlay .controls').innerHTML = '<meter min="0" max="100"></meter>';
      displayStatus('Exporting...');
      let resource;
      var selected = select.querySelector('option:checked');
      if (selected.value == 'all') {
        displayStatus('Exporting all pins...');
        resource = await getResource('User', { username });
      } else {
        displayStatus(`Exporting ${selected.text}...`);
        resource = await getResource('Board', { board_id: selected.value });
      }
      await parseBoard(resource);
      return false;
    };

    document.querySelector('#pboverlay .close').onclick = function() {
      location.href = location.pathname;
      return false;
    };
  }

  async function parseBoard(json) {
    board = json.resource_response.data;
    const feed = await getFeed();
    await parseFeed(feed);
  }

  async function getFeed(bookmarks) {
    if (board.type == 'user') {
      return await getResource('UserPins', { username, page_size: 25, bookmarks });
    } else {
      return await getResource('BoardFeed', { board_id: board.id, page_size: 25, bookmarks });
    }
  }

  async function parseFeed(json) {
    json.resource_response.data.forEach(function(p) {
      if (p.type == 'pin') {
        if (!boards[p.board.id]) boards[p.board.id] = {
          id:          p.board.id,
          name:        p.board.name,
          url:         `https://www.pinterest.com${p.board.url}`,
          privacy:     p.board.privacy,
          pins:        [],
        }
        boards[p.board.id].pins.push({
          id:          p.id,
          link:        p.link,
          title:       p.title,
          description: p.description,
          note:        p.pin_note?.text,
          url:         `https://www.pinterest.com/pin/${p.id}`,
          image:       p.images.orig.url,
          color:       p.dominant_color,
          // longitude:   (p.place && p.place.longitude),
          // latitude:    (p.place && p.place.latitude),
          pinner:      p.pinner.username,
          creator:     p.native_creator?.username,
          privacy:     p.privacy,
          date:        Date.parse(p.created_at),
        });
        displayProgress(pin_count++, board.pin_count);
      }
    })

    const bookmarks = json.resource.options.bookmarks;
    if (bookmarks[0] === '-end-') {
      done();
    } else {
      const feed = await getFeed(bookmarks);
      await parseFeed(feed);
    }
  }

  async function getResource(resource, options) {
    try {
      const response = await fetch(`/resource/${resource}Resource/get/?data=${encodeURIComponent(JSON.stringify({ options: options }))}`);
      const result = await response.json();
      if (response.status >= 200 && response.status < 300) {
        return result;
      } else {
        throw result;
      }
    } catch (err) {
      alert('An error has occurred.');
      console.error(err);
    }
  }

  function displayStatus(text) {
    document.querySelector('#pboverlay h1').innerText = text;
  }

  function displayProgress(part, total) {
    displayStatus(`Exporting ${part} of ${total}...`);
    document.querySelector('#pboverlay meter').value = ((part / total) * 100);
  }

  function markPrivacy(p) {
    return (p != 'public') ? 1 : 0;
  }

  function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function done() {
    displayStatus('Export complete!');

    let data = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- Generated by Pinback Next v${version} (${homepageUrl}) -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<STYLE>
  dl dt { margin-top: 1em; margin-left: 1em; margin-right: 1em; }
  dl dd { margin-top: 0.5em; }
  dl dt > a { word-wrap: anywhere; display: inline-block; min-width: 50%; }
  details > summary > * { display: inline-block; }
</STYLE>
<SCRIPT> window.addEventListener('load', function(){
  for (var headerElem of document.querySelectorAll('dl dt > h3')) {
    var sectionElem = headerElem.parentElement;
    var detailsElem = document.createElement('details');
    detailsElem.open = true;
    detailsElem.innerHTML = ('<summary>' + headerElem.outerHTML + '</summary>');
    headerElem.remove();
    detailsElem.innerHTML += sectionElem.outerHTML;
    sectionElem.replaceWith(detailsElem);
  }

  var toggleButton = document.createElement('button');
  toggleButton.innerHTML = 'Toggle List/Grid view 🪟️';
  toggleButton.onclick = function(){
    document.querySelector('style').innerHTML += \``+`
      dl,
      dl dt,
      dl dt > a { display: inline-block; }
      dl dt > a,
      dl dt > p { width: min-content; max-width: 33vw; }
      dl dt > a > img { max-width: 33vw; max-height: 33vh; }
      dl > p,
      dl dt > p,
      dl dt > h3 { margin: 0; }
    `+`\`;
    for (var linkElem of document.querySelectorAll('dl dt > a')) {
      var descHtml = '';
      var markElem = linkElem.parentElement;
      var nextElem = markElem.nextElementSibling;
      if (nextElem?.tagName === 'DD') {
        descHtml += ('<p>' + nextElem.innerHTML + '</p>');
        var nextNextElem = nextElem.nextElementSibling;
        if (nextNextElem?.tagName === 'DD') {
          descHtml += ('<p>' + nextNextElem.innerHTML + '</p>');
          nextNextElem.remove();
        }
        nextElem.remove();
      }
      linkElem.innerHTML = ('<img loading="lazy" src="' + linkElem.getAttribute('IMAGE') + '"/>' + '<p>' + linkElem.innerHTML + '</p>');
      markElem.innerHTML += descHtml;
    }
    toggleButton.onclick = function(){ location.reload() };
  }
  document.querySelector('div').appendChild(toggleButton);
}); </SCRIPT>
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DIV></DIV>
<DL><p>`;

    for (const id in boards) {
      const b = boards[id];
      data += `<DT><H3 GUID="${b.id}" ORIGLINK="${b.url}" CATEGORY="${b.category}" PRIVATE="${markPrivacy(b.privacy)}">${escapeHtml(b.name)}</H3>\n<DL><p>\n`;

      b.pins.forEach(function(p) {
          data += `    <DT><A HREF="${p.link || p.url}" GUID="${p.id}" ORIGLINK="${p.url}" IMAGE="${p.image}" COLOR="${p.color}" AUTHOR="${p.pinner}" ORIGAUTHOR="${p.creator || ''}" ADD_DATE="${p.date}" PRIVATE="${markPrivacy(p.privacy)}">${escapeHtml(p.title || p.description?.trim() || p.link || p.url)}</A>\n`;
        if (p.title && p.description?.trim())
          data += `    <DD>${escapeHtml(p.description)}\n`;
        if (p.note)
          data += `    <DD>${escapeHtml(p.note)}\n`;
      });

      data += '</DL><p>\n';
    }

    data += '</DL><p>';

    const filename = ((board.url || username).replace(/^\/|\/$/g, '').replace(/\//g,'-') + '.html');
    const blob = new Blob([data], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    document.querySelector('#pboverlay .controls').innerHTML = `<a class="btn" href="${url}" download="${filename}"><span>Save export file 📄</span></a>`;

    if (typeof(document.createElement('a').download) === 'undefined') {
      document.querySelector('#pboverlay .controls a').onclick = function() {
        alert('Use "File > Save As" in your browser to save a copy of your export.');
      }
    }
  }
});