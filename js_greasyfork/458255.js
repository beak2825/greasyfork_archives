// ==UserScript==
// @name         erome.com video length
// @namespace    https://github.com/drdre1/
// @icon         https://www.erome.com/favicon.ico
// @version      1.0
// @description  Duration of video on erome.com
// @author       drdre1
// @match        https://www.erome.com/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/458255/eromecom%20video%20length.user.js
// @updateURL https://update.greasyfork.org/scripts/458255/eromecom%20video%20length.meta.js
// ==/UserScript==

(function () {

  const onLength = function (milliseconds, a, video) {
    let s = milliseconds / 1000;
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    s = Math.floor(s - m * 60);

    const span = document.createElement('span');
    span.appendChild(document.createTextNode(` ${h > 0 ? `${h}:` : ''}${h > 0 ? m.toString().padStart(2, '0') : m}:${s.toString().padStart(2, '0')}`));
    a.parentNode.insertBefore(span, a.nextElementSibling || a);

    if (video && video.dataset) {
      s = parseInt(milliseconds / 1000);
      video.dataset.length = s;
      const slider = document.getElementById('slider_min_length');
      if (slider) {
        slider.max = Math.max(slider.max, s);
      }
    }
  };

  const videoLength = function (url, a, video) {
    const storedTime = window.localStorage.getItem(`$vl#${url}`);
    if (storedTime && !isNaN(parseInt(storedTime))) {
      const t = parseInt(storedTime);
      if (t >= 0) {
        return onLength(t, a, video);
      }
    }

    const xmlHttpRequest = GM.xmlHttpRequest({
      url,
      method: 'GET',
      headers: {
        Accept: 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
        Referer: 'https://www.erome.com/',
        Range: 'bytes=0-140',
      },
      responseType: 'blob',
      onprogress(response) {
        if (Math.max(response.loaded, response.total) > 150) {
          xmlHttpRequest.abort();
        }
      },
      onload(response) {
        const m = response.responseText.match(/\x03.*\xe8/);
        if (m) {
          const i = response.responseText.indexOf(m[0]) + m[0].length;
          const s = response.responseText.substring(i, i + 4);
          const ms = Array.from(s)
            .map((c) => c.charCodeAt(0))
            .map((value, index, values) => value * Math.pow(256, values.length - index - 1))
            .reduce((a, b) => a + b);
          window.localStorage.setItem(`$vl#${url}`, ms);
          return onLength(ms, a, video);
        }
      },
    });
  };

  const showSlider = function () {
    const div = document.body.appendChild(document.createElement('div'));
    div.setAttribute('style', 'position:fixed; right:0px; top:50px');
    div.innerHTML = 'Minimal length:<br>';
    const output = div.appendChild(document.createElement('output'));
    output.setAttribute('id', 'slider_min_length_output');
    const slider = div.appendChild(document.createElement('input'));
    slider.setAttribute('id', 'slider_min_length');
    slider.setAttribute('type', 'range');
    slider.setAttribute('step', '1');
    slider.setAttribute('min', '1');
    slider.setAttribute('max', '5');
    slider.setAttribute('value', '1');
    slider.addEventListener('input', () => {
      const minS = parseInt(slider.value);
      if (minS > 1) {
        const m = parseInt(slider.value / 60);
        const s = minS - m * 60;
        output.textContent = `${m}:${s > 9 ? s : (`0${s}`)}`;
        document.querySelectorAll('.video')
          .forEach((vc) => {
            const video = vc.querySelector('.player video');
            if (video && 'length' in video.dataset && video.dataset.length < minS) {
              vc.style.display = 'none';
            } else {
              vc.style.display = '';
            }
          });
      } else {
        output.textContent = 'Off';
        document.querySelectorAll('.video')
          .forEach((vc) => {
            vc.style.display = '';
          });
      }
    });
  };

  let minNumberOfVideos = 0;
  const showOnlyVideosThumbs = function () {
    document.querySelectorAll('.album')
      .forEach((album) => {
        const e = album.querySelector('.album-videos');
        if (e && e.textContent && parseInt(e.textContent) && parseInt(e.textContent) >= minNumberOfVideos) {
          return;
        }
        album.style.display = 'none';
      });
  };

  const showOnlyVideos = function (ev) {
    if (ev) {
      ev.preventDefault();
    }
    minNumberOfVideos++;
    if (document.location.hash.match(/onlyvideos=(\d+)/)) {
      document.location.hash = document.location.hash.replace(/onlyvideos=\d+/, `onlyvideos=${minNumberOfVideos}`);
    } else {
      document.location.hash = `#onlyvideos=${minNumberOfVideos}`;
    }
    if (document.location.pathname.startsWith('/a/')) {
      showOnlyVideosAlbum();
    } else {
      showOnlyVideosThumbs();
    }
    document.querySelectorAll('a[href]')
      .forEach((a) => {
        a.hash = `#onlyvideos=${minNumberOfVideos}`;
      });
  };

  const showOnlyVideosAlbum = function () {
    document.querySelectorAll('.media-group')
      .forEach((mediaGroup) => {
        if (!mediaGroup.querySelector('.video')) {
          mediaGroup.remove();
        }
      });
  };

  const disableShowOnlyVideos = function (ev) {
    if (ev) {
      ev.preventDefault();
    }
    document.location.hash = '';
    document.location.reload();
  };

  if (document.querySelectorAll('video')
    .length > 1) {
    showSlider();
  }
  window.requestAnimationFrame(() => {
    document.querySelectorAll('.player video source')
      .forEach((source) => {
        const url = source.src;
        const a = document.createElement('a');
        a.href = url;
        a.appendChild(document.createTextNode(url));
        a.target = '_blank';
        source.parentNode.parentNode.parentNode.insertBefore(a, source.parentNode.parentNode);
        videoLength(url, a, source.parentNode);
      });
  });

  if (document.querySelector('#app-navbar-collapse ul.navbar-right')) {
    const a = document.querySelector('#app-navbar-collapse ul.navbar-right')
      .appendChild(document.createElement('li'))
      .appendChild(document.createElement('a'));
    a.href = `#onlyvideos=${minNumberOfVideos + 1}`;
    a.title = 'Right click to disable';
    a.addEventListener('click', showOnlyVideos);
    a.addEventListener('contextmenu', disableShowOnlyVideos);
    a.appendChild(document.createTextNode('only videos'));
  }

  if (document.location.hash.match(/onlyvideos=(\d+)/)) {
    const n = parseInt(document.location.hash.match(/onlyvideos=(\d+)/)[1]);
    for (let i = 0; i < n; i++) {
      showOnlyVideos();
    }
  }
}());
