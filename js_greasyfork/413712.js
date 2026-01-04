// ==UserScript==
// @name         视频倍数
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       liyao
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413712/%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/413712/%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0.meta.js
// ==/UserScript==
(function() {
document.onkeypress = function (e) {
    var video = document.querySelectorAll('video');
    if (e.shiftKey) {
        if (e.key == 'v' || e.key == 'V') {
            for (var i = 0; i < video.length; i++) {
                if (video[i] == null) {
                    alert("未找到Video！");
                } else {
                    var s = video[i].playbackRate;
                    var pro = prompt('请输入播放倍速：                    (当前播放倍数为：' + s + '倍速)');
                    if (parseFloat(pro) > 0 && parseFloat(pro) <= 10) {
                        var sp = parseFloat(pro);
                        console.log(sp);
                        video[i].playbackRate = sp;
                    }
                }

            }
        }
    }
}
})();