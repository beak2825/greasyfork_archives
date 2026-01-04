// ==UserScript==
// @name        1001albumsgenerator.com tracker search links
// @description Adds search links for RED and OPS to the few relevant pages on 1001albumsgenerator.com
// @author      cerebellum
// @version     0.2.3
// @match       https://1001albumsgenerator.com/*
// @grant       none
// @namespace   https://greasyfork.org/users/748864
// @downloadURL https://update.greasyfork.org/scripts/426934/1001albumsgeneratorcom%20tracker%20search%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/426934/1001albumsgeneratorcom%20tracker%20search%20links.meta.js
// ==/UserScript==

(() => {
  
  const sites = [{
      name: 'RED',
      domain: 'redacted.ch',
      icon: 'https://redacted.ch/favicon.ico'
    },
    {
      name: 'OPS',
      domain: 'orpheus.network',
      icon: 'https://orpheus.network/favicon.ico'
    }
  ];

  if (window.location.href.endsWith('/history')) {
    const thead = document.querySelector('table.history-table > thead > tr');
    
    for (let site of sites) {
      let th = document.createElement('th');
      th.innerHTML = site.name;
      th.setAttribute('scope', 'col');
      thead.appendChild(th);
    }
    
    const albums = document.querySelectorAll('table.history-table > tbody > tr');

    for (let i = 0; i < albums.length; i++) {
      // the page currently has a trailing empty <td> in each row for some reason so we remove it before adding our own
      if (typeof albums[i].lastChild.html === 'undefined')
        albums[i].lastChild.remove();
      
      const search_str = '/torrents.php?artistname=' + encodeURIComponent(albums[i].children[2].children[0].innerHTML).replace(/%20/g, '+') + '&groupname=' + encodeURIComponent(albums[i].children[1].children[0].innerHTML).replace(/%20/g, '+');
      for (let site of sites) {
        let td = document.createElement('td');
        td.innerHTML = `<a href="https://${site.domain}${search_str}" target="_blank" title="Search ${site.name}">
          <img src="${site.icon}" alt="Search ${site.name}" border="0" />
        </a>`;
        albums[i].appendChild(td);
      }
    }
  }
  
  const rate_container = document.querySelector('div#rate-container');
  if (rate_container != null) {
    const streaming_wrapper = document.querySelector('div.streaming-wrapper');
    if (streaming_wrapper != null) {
      const rate_streaming_wrapper = streaming_wrapper.cloneNode(true);
      
      fetch(window.location.href + '/history').then(function (response) {
        return response.text();
      }).then(function (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const album_history = doc.querySelectorAll('table.history-table > tbody > tr');
        for (let i = 0; i < album_history.length; i++) {
          const artist = album_history[i].children[2].children[0].innerHTML;
          const album = album_history[i].children[1].children[0].innerHTML;
          if (album + ' by ' + artist == document.querySelector('div#rate-container > h3.h4').innerHTML) {            
            rate_streaming_wrapper.children[0].href = album_history[i].children[1].children[0].href;
            rate_streaming_wrapper.children[1].href = 'https://www.youtube.com/results?search_query=' + album + ' - ' + artist;
            const search_str = '/torrents.php?artistname=' + encodeURIComponent(artist).replace(/%20/g, '+') + '&groupname=' + encodeURIComponent(album).replace(/%20/g, '+');
            for (let site of sites) {
              rate_streaming_wrapper.innerHTML += `<a href="https://${site.domain}${search_str}" target="_blank" title="Search ${site.name}" style="margin-left: 1rem;">
                <img src="${site.icon}" alt="Search ${site.name}" border="0" />
              </a>`;
            }
            
            break;
          }
        }
      }).catch(function (err) {
        console.warn('Failed to request album history page: ', err);
      });

      rate_container.insertBefore(rate_streaming_wrapper, document.querySelector('div.feedback'));
    }
  }
  
  if (document.querySelector('div#current-album-wrapper') != null) {
    const search_str = '/torrents.php?artistname=' + encodeURIComponent(document.querySelector('h2.h5').innerHTML).replace(/%20/g, '+') + '&groupname=' + encodeURIComponent(document.querySelector('h1.h2').innerHTML).replace(/%20/g, '+');
    for (let site of sites) {
      document.querySelector('div#current-album-wrapper div.streaming-wrapper').innerHTML += `<a href="https://${site.domain}${search_str}" target="_blank" title="Search ${site.name}" style="margin-left: 1rem;">
        <img src="${site.icon}" alt="Search ${site.name}" border="0" />
      </a>`;
    }
  }
})();
