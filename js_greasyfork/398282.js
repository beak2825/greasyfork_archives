// ==UserScript==
// @name         Preview javlibrary
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       anonymous
// @match        https://avmask.com/*/movie/*
// @match        http://www.javlibrary.com/*
// @connect      www.r18.com
// @connect      awscc3001.r18.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/398282/Preview%20javlibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/398282/Preview%20javlibrary.meta.js
// ==/UserScript==

(function() {
    'use strict';

function Semaphore(max) {
  var counter = 0;
  var waiting = [];

  var take = function() {
    if (waiting.length > 0 && counter < max){
      counter++;
      let promise = waiting.shift();
      promise.resolve();
    }
  }

  this.acquire = function() {
    if(counter < max) {
      counter++
      return new Promise(resolve => {
      resolve();
    });
    } else {
      return new Promise((resolve, err) => {
        waiting.push({resolve: resolve, err: err});
      });
    }
  }

  this.release = function() {
   counter--;
   take();
  }

  this.purge = function() {
    let unresolved = waiting.length;

    for (let i = 0; i < unresolved; i++) {
      waiting[i].err('Task has been purged.');
    }

    counter = 0;
    waiting = [];

    return unresolved;
  }
}

    const semphore = new Semaphore(4);

    function ajax (url, options) {
        return new Promise(function (resolve, reject) {
          const xhr = GM_xmlhttpRequest( {
          ...options,
              url,
          onload: function (res) {
              if (res.status === 200) {
                  resolve(res);
              } else {
                  reject(res);
              }
          },
          onerror: function (err) {
          reject(err);
          }
          });
        })
    }

    function get(url, options) {
    return ajax(url, {...options, method: 'GET'})
    }

    function head(url, options) {
    return ajax(url, {...options, method: 'HEAD'})
    }

    function findCode () {
       return ($('#avid').attr('avid') || '').toLowerCase()
    }

    async function maybePreview(code) {
        const code1 = code[0]
        const code2 = code.substr(0, 3)
        const prefix_code = code.match(/[a-z]+/)[0];
        const aff_code = code.match(/\d+/)[0].padStart(5, '0');
        const code3 = `${prefix_code}${aff_code}`;


        const tryUrl = `https://awscc3001.r18.com/litevideo/freepv/${code1}/${code2}/${code3}/${code3}_dmb_w.mp4`;
        await semphore.acquire();

        try {
            await head(tryUrl);
            return tryUrl;
        } catch (e) {
            console.log(`try url: ${tryUrl} not work `, e)
            return '';
        } finally {
            semphore.release();
        }

    }

    async function searchItemPreview(code) {
        const searchUrl = `https://www.r18.com/common/search/searchword=${code}`

        const res = await get(searchUrl);
        const $html = $($.parseHTML(res.responseText || ''));

        const item = $html.find('[data-video-high]');

        const url = item.attr('data-video-high');

        return url;
    }

    async function findPreview(code) {
        let url = await maybePreview(code);
        if (url) {
            return url;
        }

        url = await searchItemPreview(code);
        if (url) {
            return url;
        }
    }

    function playPreview(url) {
        $('.preview-player').remove();

        const player = document.createElement('div')
        player.classList.add('preview-player');
        player.style.position = 'fixed';
        player.style.left = '50vw';
        player.style.top = '50vh';
        player.style.transform = 'translate(-50%, -50%)'

        player.innerHTML = `<video src="${url}" controls autoplay></video> <button style="position: absolute; top: 5px; right: 5px;">x</button>`

        $(player).find('button').click(() => $('.preview-player').remove());

        $('body').append(player)
    }

    function setupPlayer(url, target) {
        if (!target) {
            target = $('#video_jacket');
        }
        const btn = document.createElement('button')
        btn.onclick = () => playPreview(url);
        btn.style.position = 'absolute';
        btn.style.right = '5px'
        btn.style.bottom = '5px'
        btn.innerText = '▶️';

        target.append(btn);
    }

    async function singleMain() {
      const code = findCode();
      if (!code) {
          console.log('no code found');
          return;
      }
      console.log('find code', code);

      const previewUrl = await findPreview(code);
      if (!previewUrl) {
          console.log('cant find preview url');
          return;
      }
      console.log('find preview url', previewUrl);

      setupPlayer(previewUrl);
    }

    async function listMain() {

        const setup = function () {
            const $video = $('#waterfall .video');
            $video.each(async function () {
                const $el = $(this);
                if ($el.attr('get_preview')) {
                return;}

                $el.attr('get_preview', true)

                const code = $el.find('.id').text().toLowerCase();
                const previewUrl = await findPreview(code);

                if (previewUrl) {
                    setupPlayer(previewUrl, $el);
                }
            })

        }

        const observable = new MutationObserver(setup);
        observable.observe($('.videothumblist')[0], { attributes: false, childList: true, subtree: true });


    }

    function main () {
        if ($('.videothumblist').length) {
            listMain()
        } else {
            singleMain();

        }

    }

    main();
})();