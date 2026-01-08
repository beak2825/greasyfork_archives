// ==UserScript==
// @name         B-HTML5-Video
// @version      0.9.5
// @description  获取B站视频地址，Dash
// @author       zwb
// @license      CC
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/video/av*
// @run-at       document-start
// @grant        none
// @icon         data:image/png;base64,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
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @downloadURL https://update.greasyfork.org/scripts/438382/B-HTML5-Video.user.js
// @updateURL https://update.greasyfork.org/scripts/438382/B-HTML5-Video.meta.js
// ==/UserScript==

(function loop() {
    if (!document.querySelector("#app")) { return setTimeout(loop, 2000); }
    var appdiv = document.body;
    var vm = document.createElement("a");
    vm.setAttribute("id", "bvm");
    var am = document.createElement("a");
    am.setAttribute("id", "bam");
    vm.style = "position:fixed;top:120px;right:10px;z-index:999";
    vm.style.fontSize = "large";
    vm.style.color = "#2A0";
    am.style = "position:fixed;top:160px;right:10px;z-index:999";
    am.style.fontSize = "large";
    am.style.color = "#2A0";
    am.download = window?.__INITIAL_STATE__?.bvid + ".m4a";
    vm.download = window?.__INITIAL_STATE__?.bvid + ".m4v";
    var pdata = window?.__playinfo__?.data;
    pdata.dash.video.sort(function(a,b){return b.id-a.id});
    pdata.dash.video.sort(function(a,b){return b.codecid-a.codecid});
    var pddv = pdata?.dash?.video;
    var pdda = pdata?.dash?.audio;
    /*
    let len = 0时,表示选择下载最新编码方式的视频,优先级为:av01 > hevc > avc1;
    若要指定用avc编码则让 len = pddv?.length - pdata?.accept_quality?.length;
    反之,若不指定用avc编码则注释len的第二次赋值代码,即只保留 len = 0;
    */
    let len = 0;
    len = pddv?.length - pdata?.accept_quality?.length;
    vm.href = pddv[len].base_url;
    am.href = pdda[0].base_url;
    vm.textContent = pddv[len].codecs.substring(0, 4) + "-" + pdata?.accept_description[0];
    am.textContent = pdda[0].codecs.substring(0, 4) + "-" + pdda[0].id;
    appdiv.append(vm);
    appdiv.append(am);
    var dvd = document.createElement("a");
    dvd.id = "bdvd";
    dvd.style = "position:fixed;top:200px;right:10px;z-index:999";
    dvd.style.fontSize = "large";
    dvd.style.color = "#2A0";
    dvd.textContent = "一步到位"
    dvd.onclick = function () {
        download(am.href, am.download);
        download(vm.href, vm.download);
    }
    appdiv.append(dvd);
    function download(durl, thename) {
        fetch(durl, {method: "GET",referrer: location.href,mode: "cors"})
        .then(res => res.blob())
        .then(blob => {
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download = thename;
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        }).catch(err => {
            console.error(err);
        })
    }
})();