// ==UserScript==
// @name         유튜브 뮤직에서 듣기 버튼 추가
// @namespace    https://greasyfork.org/scripts/540872
// @version      1.0
// @description  유튜브 재생바에 유튜브 뮤직에서 이어서 듣기 버튼추가
// @match        https://www.youtube.com/watch*
// @author       다크초코
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540872/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%AE%A4%EC%A7%81%EC%97%90%EC%84%9C%20%EB%93%A3%EA%B8%B0%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/540872/%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EB%AE%A4%EC%A7%81%EC%97%90%EC%84%9C%20%EB%93%A3%EA%B8%B0%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function () {
  const BTN_CLASS = 'yt-music-btn';

    function buildIcon() {
        const NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 36 36');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');

        svg.style.display = 'block';
        svg.style.position = 'relative';
        svg.style.top = '-5px';
        const bg = document.createElementNS(NS, 'circle');
        bg.setAttribute('cx', 18);
        bg.setAttribute('cy', 18);
        bg.setAttribute('r', 13);
        bg.setAttribute('fill', '#FF0000');

        const ring = document.createElementNS(NS, 'circle');
        ring.setAttribute('cx', 18);
        ring.setAttribute('cy', 18);
        ring.setAttribute('r', 9);
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', '#FFFFFF');
        ring.setAttribute('stroke-width', 1);

        const tri = document.createElementNS(NS, 'polygon');
        tri.setAttribute('points', '16,13 16,23 23,18');
        tri.setAttribute('fill', '#FFFFFF');

        svg.append(bg, ring, tri);
        return svg;
    }





  function createBtn() {
    const btn = document.createElement('button');
    btn.className = `ytp-button ${BTN_CLASS}`;
    btn.title = 'YT Music에서 이어서 듣기';
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.lineHeight = '0';
    btn.appendChild(buildIcon());

    btn.addEventListener('click', () => {
      const video = document.querySelector('video');
      if (!video) return;
      const t = Math.floor(video.currentTime);
      const v = new URLSearchParams(location.search).get('v');
      if (!v) return;
      video.pause();
      window.open(`https://music.youtube.com/watch?v=${v}&t=${t}&autoplay=1`, '_blank');
    });
    return btn;
  }

  function inject() {
    const host = document.querySelector('.ytp-chrome-controls .ytp-right-controls');
    if (!host || host.querySelector('.' + BTN_CLASS)) return false;
    host.prepend(createBtn());
    return true;
  }

  new MutationObserver(inject).observe(document, {childList: true, subtree: true});
  window.addEventListener('yt-navigate-finish', () => setTimeout(inject));
  const backup = setInterval(() => inject() && clearInterval(backup), 3000);
})();
