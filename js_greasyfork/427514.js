// ==UserScript==
// @name         91porn去广告+支持弹幕
// @version      0.1
// @description  91porn去广告+支持弹幕,自动生效！
// @author       Panda1337
// @match        */view_video.php?viewkey**
// @icon         https://www.google.com/s2/favicons?domain=workarea2.live
// @grant        none
// @namespace https://greasyfork.org/users/730524
// @downloadURL https://update.greasyfork.org/scripts/427514/91porn%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E6%94%AF%E6%8C%81%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/427514/91porn%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E6%94%AF%E6%8C%81%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==
var htmls = `<!DOCTYPE HTML>
<html>
<body>
  <meta name="referrer" content="never" >
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <!-- <link rel="stylesheet" href="DPlayer.min.css" /> -->
    <div id="dplayer" class="dplayer" ></div>
    <script src="https://cdn.jsdelivr.net/npm/dplayer@1.26.0/dist/DPlayer.min.js"></script>
    <script>
        const dp = new DPlayer({
            container: document.getElementById('dplayer'),
                       autoplay: true,
            video: {
                quality: [
                    {
                        name: '色',
                        url: 'urlhere',
                        type: 'hls',
                    },
                ],
                defaultQuality: 0,
                // pic: 'demo.png',
                // thumbnails: 'thumbnails.jpg',
            },
                       danmaku: {
                              id: "urlhere",
                              api: 'https://dplayer.moerats.com/'
                       }
        });
               dp.seek(10);
    </script>
       <h1>已自动跳过广告，点击播放器中的评论图标发送弹幕~</h1>
</body>
</html>`;

function strencode2(f) {
    var a = {
        'Anfny': function b(c, d) {
            return c(d);
        }
    };
    return a['Anfny'](unescape, f);
};
var jm=strencode2(document.documentElement.outerHTML.split("document.write(strencode2(\"")[1].split("\"")[0]);
var u = jm.split("<source src='")[1].split("'")[0];
console.log(u)
document.write(htmls.replace("urlhere",u).replace("urlhere",u))