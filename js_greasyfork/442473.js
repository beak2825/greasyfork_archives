// ==UserScript==
// @name         去除广告+瀑布流
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除广告+瀑布流+自动播放
// @author       You
// @match        *://www.91porn.com/*
// @icon         https://www.google.com/s2/favicons?domain=91porn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442473/%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%2B%E7%80%91%E5%B8%83%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/442473/%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%2B%E7%80%91%E5%B8%83%E6%B5%81.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const scriptDom1 = document.createElement('script');
  const scriptDom2 = document.createElement('script');
  scriptDom1.setAttribute('src', 'https://fastly.jsdelivr.net/npm/hls.js@latest');
  scriptDom2.setAttribute(
    'src',
    'https://fastly.jsdelivr.net/npm/dplayer@1.26.0/dist/DPlayer.min.js'
  );
  document.body.appendChild(scriptDom1);
  document.body.appendChild(scriptDom2);
  window.onload = function () {
    if (window.location.pathname === '/view_video.php') {
      function getMediaSource() {
        function strencode2(f) {
          var a = {
            Anfny: function b(c, d) {
              return c(d);
            },
          };
          return a['Anfny'](unescape, f);
        }
        var jm = strencode2(
          document.documentElement.outerHTML
            .split('document.write(strencode2("')[1]
            .split('"')[0]
        );
        return jm.split("<source src='")[1].split("'")[0];
      }

      const videoArea = document.querySelector('.video-container');
      const { height, width } = videoArea.getBoundingClientRect();
      const poster = videoArea.children[0].getAttribute('poster');
      const playerSource = getMediaSource().replace(/https:\/\/.*?\.com/,'https://cdn77.91p49.com');
	  const playerDom = document.createElement('div');

      playerDom.style = `height: ${height}px;width: ${width}px;`;
      playerDom.id = 'dplayer';
      videoArea.children[0].remove();
      videoArea.appendChild(playerDom);
      const dp = new DPlayer({
        container: document.getElementById('dplayer'),
        autoplay: true,
        video: {
          defaultQuality: 0,
          quality: [
            {
              url: playerSource,
              type: 'hls',
            },
          ],
          pic: poster,
        },
      });
      dp.seek(5);
    } else {
      const doms = Array.from(
        document.querySelectorAll('.col-xs-12.col-sm-4.col-md-3.col-lg-3')
      ).forEach((dom, index) => {
        if (index === 0) {
          dom.parentNode.setAttribute('class', 'flex-container');
        }
        dom.setAttribute('class', 'flex-item');
      });
      const style = document.createElement('style');
      style.innerHTML = `
.flex-container{
  column-count:4;
 }
.flex-item{
  break-inside: avoid;
  overflow: hidden;
}
.title-truncate,.video-title title-truncate m-t-5{
  white-space: normal;
}
`;
      document.head.appendChild(style);
    }
  };
})();
