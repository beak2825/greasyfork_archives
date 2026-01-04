// ==UserScript==
// @name         Duolingo vocabulary information via Wiktionary
// @description  Augments Duolingo vocabulary tooltips with information from Wiktionary
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       neobrain
// @match        https://*.duolingo.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503957/Duolingo%20vocabulary%20information%20via%20Wiktionary.user.js
// @updateURL https://update.greasyfork.org/scripts/503957/Duolingo%20vocabulary%20information%20via%20Wiktionary.meta.js
// ==/UserScript==

var elementUnderCursor;

document.addEventListener('mousemove', (event) => {
  const x = event.clientX;
  const y = event.clientY;
  elementUnderCursor = document.elementFromPoint(x, y);
});

function fetchNonAnonymous(url) {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
        method: "GET",
        anonymous: false,
        url: url,
        onload: async function(response) {
          let data;
          if (response.status == 200) {
            data = JSON.parse(response.response);
          } else {
            // Fall back to fetch API. Seems to be required for Greasemonkey
            data = await fetch(url);
            if (!data.ok) {
              reject(data.status);
            }
            // data = await data.json();
          }

          resolve(data);
        },
        onerror: (err) => { reject(err); }
    });
  });
}

async function getDuoState() {
  let reduxState;
  try {
    reduxState = JSON.parse(localStorage.getItem("duo.state")).state.redux
  } catch {
    // NOTE: This is now a base64-encoded gz archive

    let str = localStorage.getItem("duo.state");

    const str2 = atob(str.slice(1, -1)); // Remove wrapping quotes
    const ds = new DecompressionStream("gzip");
    let uint8Array = new Uint8Array(str2.split("").map(c => c.charCodeAt(0)));
    let readableStream = new ReadableStream({
        start(controller) {
            controller.enqueue(uint8Array);
            controller.close();
        }
    });

    let outstream = readableStream.pipeThrough(ds);

    let result = "";
    const reader = outstream.getReader();
    const decoder = new TextDecoder('utf-8');
    while (true) {
      let value = await reader.read();
      result += decoder.decode(value.value);
      if (value.done) {
        break;
      }
    }

    reduxState = JSON.parse(result).state.redux;
  }
  return reduxState.user;
}

(async function() {
    'use strict';

    // Function to fetch IPA and audio for a given French word
    // TODO: Cache results to avoid over-stressing Wiktionary servers
    async function fetchWordData(word) {
      const state = await getDuoState();
      const apiEndpoint = `https://${state.learningLanguage}.wiktionary.org/w/api.php`;
      // e.g. https://fr.wiktionary.org/w/api.php?action=parse&page=serpent&format=json&prop=properties|wikitext
      let params = new URLSearchParams({
          action: 'parse',
          format: 'json',
          page: word,
          prop: 'properties|wikitext|images',
      });

      let data = await fetchNonAnonymous(`${apiEndpoint}?${params}`);
      if (data.error) {
        GM.log(`Couldn't find page for title "${word}", trying opensearch...`)

        // https://fr.wiktionary.org/w/api.php?action=opensearch&search=Laquelle&profile=strict&limit=1
        const params2 = new URLSearchParams({
            action: 'opensearch',
            format: 'json',
            search: word,
            profile: 'classic',
            limit: '1',
        });
        const data2 = await fetchNonAnonymous(`${apiEndpoint}?${params2}`);
        if (data2[1]?.[0]) {
          word = data2[1][0];
          params.set('page', word);
          data = await fetchNonAnonymous(`${apiEndpoint}?${params}`);
        }
      }
      const content = data.parse.wikitext['*'];

      // TODO: Use language code instead
      const ipaRegex = /{{pron\|([^}]+)\|fr}}/i;
      // const audioRegex = /{{écouter\|lang=fr\|[^|]+\|([^|}]+)\|audio=([^|}]+)}}/i;
      const audioRegex = /{{écouter\|([^|}]*\|)*lang=fr\|([^|}]*\|)*audio=([^|}]+)}}/i;

      let ipaMatch = ipaRegex.exec(content);
      if (!ipaMatch) {
        ipaMatch = (/{{IPA\|([^}]+)}}/i).exec(content);
      }
      const audioMatch = audioRegex.exec(content);

      const ipa = ipaMatch ? ipaMatch[1] : null;
      const audio = audioMatch ? `File:${audioMatch[2]}` : undefined;
      let image = data.parse.properties[0]?.['*'];
      if (image) {
        image = `File:${image}`
      }

      return { word, ipa, audio, image, language: state.learningLanguage };
    }

    async function fetchAudioFile(filename) {
        const state = await getDuoState();
        const apiEndpoint = `https://${state.learningLanguage}.wiktionary.org/w/api.php`;
        const params = new URLSearchParams({
            action: 'query',
            format: 'json',
            titles: filename,
            prop: 'imageinfo',
            iiprop: 'url',
        });

        const data = await fetchNonAnonymous(`${apiEndpoint}?${params}`);
        return data.query.pages[-1].imageinfo[0].url;
    }

    // Function to update the HTML with the fetched data
    function augmentWord(infoContainer, word, ipa, audio, language) {
      if (ipa) {
        // TODO: _1pDd6 _2JTJI bafGS
        const ipaElement = document.createElement('a');
        ipaElement.className = 'ipa _1pDd6 _2JTJI bafGS';
        ipaElement.textContent = `${ipa}`;
        // TODO: Use learning language
        ipaElement.href = `https://${language}.wiktionary.org/wiki/${word}`;
        ipaElement.target = '_blank';
        ipaElement.style.fontFamily = 'sans-serif'; // reset since the parent font causes the tilde in e.g. ɑ̃ to be placed badly
        infoContainer.appendChild(ipaElement);
      }
    }

    // Detect French words on the page and augment them
    async function augmentPage() {
      const observer = new MutationObserver(async (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              // NOTE: id=show-hint comes up during stories
              if (node.nodeType === Node.ELEMENT_NODE && (node.getAttribute('data-test') === 'hint-popover' || elementUnderCursor.parentElement?.id === 'show-hint')) {
                const word = elementUnderCursor.parentElement?.id === 'show-hint' ? elementUnderCursor.innerText : (elementUnderCursor.ariaLabel === null ? elementUnderCursor.parentElement.ariaLabel : elementUnderCursor.ariaLabel);
                fetchWordData(word).then((result) => {
                  let element = document.createElement('tr');
                  element.appendChild(document.createElement('td'));
                  // let element = document.createElement('span');
                  // element.appendChild(document.createElement('span'));
                  element.children[0].style.paddingTop = 0;
                  element.children[0].style.paddingBottom = 0;
                  element.children[0].style.fontStyle = 'oblique';
                  element.children[0].style.textAlign = 'center';
                  element.children[0].colSpan = 5;
                  augmentWord(element.children[0], result.word, result.ipa, result.audio, result.language);
                  // node.children[0].appendChild(element);
                  node.querySelector('table > tbody').prepend(element);

                  if (result.audio) {
                    fetchAudioFile(result.audio).then((url) => {
                      elementUnderCursor.onclick = () => {
                        let audio = new Audio(url);
                        audio.play();
                      }
                    })
                  }

                  if (result.image) {
                    fetchAudioFile(result.image).then((url) => {
                      let img = document.createElement('img');
                      img.src = url;
                      img.style.maxWidth = '15em';
                      img.style.maxHeight = '15em';
                      img.style.width = 'auto';
                      img.style.height = 'auto';
                      node.appendChild(img);
                    });
                  }
                });
              }
            });
          }
        }
      });
      const config = { childList: true, subtree: true };
      observer.observe(document.body, config);
    }

    // Run the augmentation function when the Duolingo page is loaded
    window.addEventListener('load', augmentPage);
})();
