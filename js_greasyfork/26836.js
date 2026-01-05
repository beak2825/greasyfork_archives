// ==UserScript==
// @name        Youtube download link inserter
// @match       https://www.youtube.com/watch?v=*
// @icon        https://s.ytimg.com/yts/img/favicon_32-vfl8NGn4k.png
// @icon64      https://s.ytimg.com/yts/img/favicon_144-vflWmzoXw.png
// @version     2.7
// @description Inserts download links to YouTube
// @author      TheSeven, RoundRobin
// @namespace https://greasyfork.org/users/97514
// @downloadURL https://update.greasyfork.org/scripts/26836/Youtube%20download%20link%20inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/26836/Youtube%20download%20link%20inserter.meta.js
// ==/UserScript==

var extension = {
    "video/mp4": ".mp4",
    "video/webm": ".mkv",
    "audio/mp4": ".m4a",
    "audio/webm": ".mkv",
};

function makeButton(container, background, info, size, rate, url) {
    var a = document.createElement("a");
    a.style.display = "block";
    a.style.cssFloat = "left";
    a.style.background = background;
    a.style.border = "1px solid #888";
    a.style.boxShadow = "1px 1px 2px rgba(0, 0, 0, 0.2)";
    a.style.padding = "2px";
    a.style.margin = "2px";
    a.style.color = "#333";
    a.style.textDecoration = "none";
    container.appendChild(a);
    var mime = info.mimeType.split(";", 2);
    var format = mime[0].trim();
    var codecs = mime[1].split("\"", 2)[1].trim().split(",");
    if (info.video) {
        a.appendChild(document.createTextNode("V: " + codecs[0].split(".", 1)[0].trim() + " " + info.video.qualityLabel));
        a.appendChild(document.createElement("br"));
    }
    if (info.audio) {
        a.appendChild(document.createTextNode("A: " + codecs[codecs.length - 1].split(".", 1)[0].trim()));
        a.appendChild(document.createElement("br"));
    }
    if (rate) {
        a.appendChild(document.createTextNode(Math.round(rate / 1000 * 8) + " kbit/s"));
        a.appendChild(document.createElement("br"));
    }
    var dlindicator = document.createElement("strong");
    dlindicator.style.display = "none";
    dlindicator.appendChild(document.createTextNode("DL "));
    var dlprogress = document.createTextNode("");
    dlindicator.appendChild(dlprogress);
    a.appendChild(dlindicator);
    a.title = mime;
    if (info.video) a.title += "\nVideo: " + info.video.quality + " " + info.video.width + "x" + info.video.height;
    if (info.video && info.video.fps) a.title += ", " + info.video.fps + " FPS";
    if (size) a.title += "\nSize: " + (Math.round(size / 10000) / 100) + " MB";
    a.href = url;
    a.download = ytplayer.config.args.title + extension[format];
    var xhr = false;
    a.onclick = function() {
        if (xhr) {
            xhr.abort();
            xhr = false;
            dlindicator.style.display = "none";
            return false;
        }
        dlindicator.style.display = "inline";
        xhr = new XMLHttpRequest();
        xhr.open("GET", a.href);
        xhr.responseType = "blob";
        xhr.onprogress = function(e) {
            dlprogress.nodeValue = (Math.round(1000 * e.loaded / e.total) / 10).toFixed(1) + "%";
        };
        xhr.onload = function(e) {
            if (xhr.status > 299) {
                dlprogress.nodeValue = "Error " + xhr.status;
                return;
            }
            var dl = document.createElement("a");
            dl.style.display = "none";
            dl.href = URL.createObjectURL(e.target.response);
            dl.download = a.download;
            container.appendChild(dl);
            setTimeout(function() {
                dl.click();
                container.removeChild(dl);
                setTimeout(function() {
                    URL.revokeObjectURL(dl.href);
                    xhr = false;
                    dlindicator.style.display = "none";
                }, 1000);
            }, 1);
        };
        xhr.send();
        return false;
    };
}

function populate()
{
    var outerkey, muxstreams, muxurlkey, muxmetakey, substreams, subsizekey, subratekey;
    var clonedConfig = Object.assign({}, ytplayer.config);
    clonedConfig.args = Object.assign({}, ytplayer.config.args);
    clonedConfig.args.adaptive_fmts = null;
    var player = yt.player.Application.create(document.createElement("div"), clonedConfig);
    player.dispose();
    if (!Object.keys(player).some(key1 => {
        var o1 = player[key1];
        if (!o1 || typeof(o1) != "object" || Array.isArray(o1)) return;
        return Object.keys(o1).some(key2 => {
            var o2 = o1[key2];
            if (!o2 || typeof(o2) != "object" || Array.isArray(o2)) return;
            return Object.keys(o2).some(key3 => {
                var o3 = o2[key3];
                if (!o3 || !Array.isArray(o3)) return;
                if (!o3[0] || typeof(o3[0]) != "object") return;
                return Object.keys(o3[0]).some(key4 => {
                    var o4 = o3[0][key4];
                    if (typeof(o4) != "string" || o4.indexOf("https://") || o4.indexOf("googlevideo.com/videoplayback?") < 0) return;
                    return Object.keys(o3[0]).some(key5 => {
                        var o5 = o3[0][key5];
                        if (!o5 || typeof(o5) != "object" || o5.id === undefined) return;
                        outerkey = key1;
                        muxstreams = o3;
                        muxurlkey = key4;
                        muxmetakey = key5;
                        return true;
                    });
                });
            });
        });
    })) return console.error("Couldn't find muxed streams");
    player = yt.player.Application.create(document.createElement("div"), ytplayer.config);
    player.dispose();
    if (!Object.keys(player[outerkey]).some(key1 => {
        var o1 = player[outerkey][key1];
        if (!o1 || typeof(o1) != "object" || Array.isArray(o1)) return;
        return Object.keys(o1).some(key2 => {
            var o2 = o1[key2];
            if (!o2 || typeof(o2) != "object" || Array.isArray(o2)) return;
            return Object.keys(o2).some(key3 => {
                var o3 = o2[key3];
                if (!o3 || typeof(o3) != "object" || Array.isArray(o3)) return;
                return Object.keys(o3).some(key4 => {
                    var o4 = o3[key4];
                    if (!o4 || typeof(o4) != "object" || Array.isArray(o4)) return;
                    if (!o4.info || typeof(o4.info) != "object" || o4.info.id != key4) return;
                    return Object.keys(o4).some(key5 => {
                        var o5 = o4[key5];
                        if (typeof(o5) != "number" || key5 == "lastModified") return;
                        return Object.keys(o4.info).some(key6 => {
                            var o6 = o4.info[key6];
                            if (typeof(o6) != "number" || o6 < 1000) return;
                            substreams = o3;
                            subsizekey = key5;
                            subratekey = key6;
                            return true;
                        });
                    });
                });
            });
        });
    })) return console.error("Couldn't find individual streams");

    var detailbox = document.getElementById("action-panel-details");
    var container = document.createElement("div");
    container.className = "yt-card yt-card-has-padding";
    container.style.color = "#333";
    detailbox.parentNode.insertBefore(container, detailbox);
    var title = document.createElement("strong");
    title.appendChild(document.createTextNode("Download links:"));
    container.appendChild(title);
    var muxedContainer = document.createElement("div");
    container.appendChild(muxedContainer);
    var videoContainer = document.createElement("div");
    videoContainer.style.clear = "both";
    container.appendChild(videoContainer);
    var audioContainer = document.createElement("div");
    audioContainer.style.clear = "both";
    container.appendChild(audioContainer);
    var tailContainer = document.createElement("div");
    tailContainer.style.clear = "both";
    container.appendChild(tailContainer);

    muxstreams.forEach(function(s) {
        makeButton(muxedContainer, "#cfc", s[muxmetakey], 0, 0, s[muxurlkey]);
    });
    Object.keys(substreams).forEach(function(fid) {
        console.log("Stream " + fid);
        var s = substreams[fid];
        Object.keys(s).some(key1 => {
            var o1 = s[key1];
            if (!o1 || typeof(o1) != "object" || Array.isArray(o1)) return;
            return Object.keys(o1).some(key2 => {
                var o2 = o1[key2];
                if (!o2 || typeof(o2) != "object" || Array.isArray(o2)) return;
                return Object.keys(o2).some(key3 => {
                    var o3 = o2[key3];
                    if (typeof(o3) != "string" || o3.indexOf("https://") || o3.indexOf("googlevideo.com/videoplayback?") < 0) return;
                    if (o3.indexOf("&signature=") < 0)
                        Object.keys(o2).some(key4 => {
                            var o4 = o2[key4];
                            if (!o4 || typeof(o4) != "object" || Array.isArray(o4)) return;
                            Object.keys(o4).forEach(key5 => {
                                if (key5 == "keepalive" || key5 == "mime") return;
                                o3 += "&" + key5 + "=" + o4[key5];
                            });
                            return true;
                        });
                    console.log(o2);
                    console.log(o3);
                    if (s.info.video) makeButton(videoContainer, "#ccf", s.info, s[subsizekey], s.info[subratekey], o3);
                    if (s.info.audio) makeButton(audioContainer, "#fcc", s.info, s[subsizekey], s.info[subratekey], o3);
                    return true;
                });
            });
        });
    });
}

window.addEventListener("spfdone", function(){setTimeout(populate,100)});
populate();