// ==UserScript==
// @name           DailyMotion Extract DownloadURL
// @id             DailyMotionExtractDownloadURL
// @description    動画のダウンロードURLを抽出します
// @namespace      https://greasyfork.org/users/2671
// @match          *://www.dailymotion.com/video/*
// @grant          none
// @version 0.0.1.20190314132703
// @downloadURL https://update.greasyfork.org/scripts/23130/DailyMotion%20Extract%20DownloadURL.user.js
// @updateURL https://update.greasyfork.org/scripts/23130/DailyMotion%20Extract%20DownloadURL.meta.js
// ==/UserScript==

function start() {
    var url = document.location.href;
    var video = "";
    var parsing = /video\/([^\/\?]+)/.exec(url);
    if (parsing !== null) video = parsing[1];
    else return;

    //var title = document.getElementsByClassName("QueueInfoContent__title___2Gvkw")[0].textContent.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
    var container = document.getElementById('downloads');
    if (container === null) {
        container = document.createElement('div');
        container.setAttribute('id', 'downloads');
    }
    else
        container.innerHTML = "";

    //var scriptTags = Array.prototype.map.call(document.getElementsByTagName("script"), function (node) {
    //    return node.innerHTML;
    //});
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.dailymotion.com/player/metadata/video/" + video, true);
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText);
            var title = jsonData.title.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
//            xhr.responseText.match(/['"]title['"]:['"]([^'"]+)['"]/g).forEach(function (url) {
//                title = url.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
//            });

            xhr.responseText.match(/http[^\"]+?\\\/H264-\d+x\d+\\\/[^\"]+/g).forEach(function (url) {
                url = url.replace(/\\/g, "");
                url.match(/\/(\w+-\d+x\d+)\//);
                var resolution = RegExp.$1;
                var div = document.createElement("div");
                div.style = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
                var span = div.appendChild(document.createElement("span"));
                span.innerHTML = resolution;
                span.style.display = "inline-block";
                span.style.width = "120px";
                var a = div.appendChild(document.createElement("a"));
                a.textContent = title;
                a.href = url + "&title=" + title;
                a.download = title + ".mp4";
                a.style = "font-family:Lucida Grande,Hiragino Kaku Gothic ProN,Meiryo,sans-serif;font-weight:700;font-size:14px;color:#444";
                container.appendChild(div);
            });

            if(__PAGE_BODIES__.default !== undefined) {
                var find = __PAGE_BODIES__.default.match(/(QueueInfoContent__stats___[^%]+)/g);
                if(find !== null) find.forEach(function (classname) {
                    var node = document.getElementsByClassName(classname);
                    if(node.length > 0)
                        node[0].parentNode.insertBefore(container, node[0]);
                });
            }

            if(__PAGE_BODIES__.discoveryWatching !== undefined) {
                var find = __PAGE_BODIES__.discoveryWatching.match(/(LegacyVideoInfo__videoStats___[^%]+|VideoInfo__descriptionSection___[^%]+)/g);
                if(find !== null) find.forEach(function (classname) {
                    var node = document.getElementsByClassName(classname);
                    if(node.length > 0)
                        node[0].parentNode.insertBefore(container, node[0]);
                });
            }

            if(__PAGE_BODIES__.discoveryWatchingResponsiveInfo !== undefined) {
                var find = __PAGE_BODIES__.discoveryWatchingResponsiveInfo.match(/(VideoInfo__descriptionSection___[^%]+)/g);
                if(find !== null) find.forEach(function (classname) {
                    var node = document.getElementsByClassName(classname);
                    if(node.length > 0)
                        node[0].parentNode.insertBefore(container, node[0]);
                });
            }
        }
    };
    xhr.send(null);
}

start();