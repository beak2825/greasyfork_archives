// ==UserScript==
// @name         自动根据权重修改标签颜色
// @namespace    dawnlc.me
// @version      0.1
// @description  自动根据权重修改标签颜色,加载后自动修改颜色并保存.(勾选关注或隐藏的标签将被忽略不进行修改.)
// @author       dawn-lc
// @match        https://e-hentai.org/mytags
// @match        https://exhentai.org/mytags
// @icon         https://e-hentai.org/favicon.ico
// @run-at       document-start
// @connect      exhentai.org
// @connect      e-hentai.org
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429575/%E8%87%AA%E5%8A%A8%E6%A0%B9%E6%8D%AE%E6%9D%83%E9%87%8D%E4%BF%AE%E6%94%B9%E6%A0%87%E7%AD%BE%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/429575/%E8%87%AA%E5%8A%A8%E6%A0%B9%E6%8D%AE%E6%9D%83%E9%87%8D%E4%BF%AE%E6%94%B9%E6%A0%87%E7%AD%BE%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    let dislikeColour = rgbToHex(128, 64, 64);//标签分值越低越接近这个颜色
    let likeColour = rgbToHex(64, 255, 64);//标签分值越高越接近这个颜色
    let defaultColour = rgbToHex(0, 0, 0);//标签分值初始色

    function ready(fn){
        if(document.addEventListener){
            document.addEventListener('DOMContentLoaded',function(){
                document.removeEventListener('DOMContentLoaded',arguments.callee,false);
                fn();
            },false);
        }else if(document.attachEvent){
            document.attachEvent('onreadystatechange',function(){
                if(document.readyState=='complete'){
                    document.detachEvent('onreadystatechange',arguments.callee);
                    fn();
                };
            });
        };
    };
    function rgbToHex(r, g, b) {
        let hex = ((r << 16) | (g << 8) | b).toString(16);
        return ("#" + new Array(Math.abs(hex.length - 7)).join("0") + hex).toUpperCase();
    };
    function hexToRgb(hex) {
        let rgb = [];
        for (let i = 1; i < 7; i += 2) {
            rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
        };
        return rgb;
    };
    function gradient(startColor, endColor, step) {
        let sColor = hexToRgb(startColor);
        let eColor = hexToRgb(endColor);
        let rStep = (eColor[0] - sColor[0]) / step;
        let gStep = (eColor[1] - sColor[1]) / step;
        let bStep = (eColor[2] - sColor[2]) / step;
        let gradientColorArr = [];
        for (let i = 0; i < step; i++) {
            gradientColorArr.push(rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])));
        };
        return gradientColorArr;
    };
    ready(function () {
        for (let i of document.querySelectorAll('div[id^=usertag_]')) {
            const id = i.id.split("_")[1];
            if (id != 0){
                const vector = i.querySelector('input[id^="tagweight"]');
                const color= i.querySelector('input[id^="tagcolor_"]');
                const watch = i.querySelector('input[id^="tagwatch_"]');
                const hide = i.querySelector('input[id^="taghide_"]');
                if (watch.checked == false && hide.checked == false) {
                    let newColor = defaultColour;
                    if (parseInt(vector.value) < 0) {
                        newColor = gradient(dislikeColour, defaultColour, 99)[Math.abs(parseInt(vector.value)) - 1];
                    } else if (parseInt(vector.value) > 0) {
                        newColor = gradient(defaultColour, likeColour, 99)[parseInt(vector.value) - 1];
                    };
                    if (color.value != newColor){
                        color.value = newColor;
                        GM_xmlhttpRequest({
                            method: "post",
                            url: 'https://'+ window.location.host +'/api.php',
                            data: JSON.stringify({ method: "setusertag",
                                                  apiuid: apiuid,
                                                  apikey: apikey,
                                                  tagid: id,
                                                  tagwatch: watch.checked ? 1 : 0,
                                                  taghide: hide.checked ? 1 : 0,
                                                  tagcolor: color.value,
                                                  tagweight: vector.value
                                                 }),
                            headers: { "Content-Type": "application/json" },
                            onload: function(r) {
                                console.log("usertag:"+id+" save complete!");
                            }
                        });
                    };
                };
            };
        };
    });
})();