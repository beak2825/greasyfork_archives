// ==UserScript==
// @name         Ehentai画廊收藏助手
// @namespace    https://github.com/cpuopt/Ehentai-gallery-script
// @version      1.0.7
// @description  e-hentai和exhentai画廊页面直接管理收藏和种子下载
// @author       cpufan
// @include      https://exhentai.org/g/*/*
// @include      https://e-hentai.org/g/*/*
// @homepage     https://github.com/cpuopt/Ehentai-gallery-script
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_info
// @connect      e-hentai.org
// @connect      exhentai.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477169/Ehentai%E7%94%BB%E5%BB%8A%E6%94%B6%E8%97%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477169/Ehentai%E7%94%BB%E5%BB%8A%E6%94%B6%E8%97%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
let panelBg = getComputedStyle(document.querySelector("div#gmid"), null)["background-color"];
let borderColor = getComputedStyle(document.querySelector("input#newtagfield"), null)["border"].match(/rgb\(.*?\)/)[0];
let buttonColor = getComputedStyle(document.body, null)["color"];
let lineColor = getComputedStyle(document.querySelector("div.gm"), null)["border"];

GM_addStyle(`
#plugin-canvas {
    display: inline-block;
    width: 60%;
    right: 0;
    top: 30%;
    float: right;
    z-index: 999;
    border: 2px solid rgb(141, 141, 141);
    box-sizing: border-box;
    background-color: ${panelBg};
    padding: 3px;
}
.plugin-button-blue {
    display: block;
    color: rgb(255, 255, 255);
    background-color: rgb(0, 150, 250);
    font-size: 14px;
    font-weight: bold;
    margin: 16px;
    padding-left: 20px;
    padding-right: 20px;
    height: 42px;
    border: none;
    border-radius: 100000px;
    transition: background-color 0.6s;
}
.canvasButton {
    padding: 0;
    height: 100px;
    width: 15px;
    position: absolute;
    left: -15px;
    top: 30%;
    border: 2px solid ${borderColor};
    background-color: ${panelBg};
    border-radius: 10px 0px 0px 10px;
    transition: background-color 0.6s;
    cursor: pointer;
}
.canvasButton:hover {
    background-color: ${borderColor};
}
.torrent-panel{
    padding: 3px;
    margin-bottom:5px;

}
div#gd6 {
    font-size: 9pt;
    float: left;
    width: 150px;
    padding: 3px 0 0 6px;
    margin: 0;
}
.Ebutton{
    margin-bottom:2px
}
#fav-panel{
    padding: 3px 3px 0 3px;
    border: 2px solid ${borderColor};
    margin-bottom:3px;
}
`);
(function () {
    "use strict";

    let param = document.URL.split("/").filter((item) => {
        return item != "";
    });
    let param_gid = param[3];
    let param_t = param[4];

    let hostname = location.hostname;
    let favURL = `https://${hostname}/gallerypopups.php?gid=${param_gid}&t=${param_t}&act=addfav`;
    let torrentURL = "https://" + hostname + "/gallerytorrents.php?gid=";
    var pluginc;

    class pluginCanvas {
        canvas;
        canvasButton;
        canvasContainer;
        favpanel;
        torrentpanel;

        showSvg = `
                <svg style="margin-left:-2px" width="16" height="16" fill="${buttonColor}" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
                `;
        hideSvg = `
                <svg style="margin-left:-2px" width="16" height="16" fill="${buttonColor}" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
                `;

        constructor() {
            this.canvas = document.createElement("div");
            this.canvasContainer = document.createElement("div");
            this.canvas.id = "plugin-canvas";
            let title = document.createElement("p");
            title.style = "margin:0 auto;text-align:center";
            title.innerText = GM_info.script.name + GM_info.script.version;
            this.canvas.appendChild(title);
            this.canvas.append(this.canvasContainer);

            this.favpanel = document.createElement("div");
            this.favpanel.id = "fav-panel";
            this.torrentpanel = document.createElement("div");
            this.torrentpanel.id = "torrent-panel";

            this.canvasContainer.append(this.favpanel);
            this.canvasContainer.append(this.torrentpanel);
            document.querySelector("#taglist>table").style = "width: 39%;display: inline-block;float: left;";
            document.getElementById("taglist").style.height = "fit-content";
            document.getElementById("taglist").append(this.canvas);
            document.getElementById("gmid").style.height = "fit-content";
        }

        loadFavPanel() {
            let favpanel = new favPanel(this.favpanel);
        }
        loadTorrentPanel() {
            let torrentp = new torrentPanel(this.torrentpanel);
        }
    }
    class favPanel {
        canvas;

        constructor(plugincanvas) {
            this.canvas = plugincanvas;

            GM_xmlhttpRequest({
                method: "GET",
                url: favURL + param_gid + "&t=" + param_t + "&act=" + "addfav",
                overrideMimeType: "text/html; charset=UTF-8",
                onload: function (xhr) {
                    let dom = new DOMParser().parseFromString(xhr.responseText, "text/html");
                    let form = dom.getElementById("galpop");
                    dom.querySelector("#galpop > p").setAttribute("hidden", "true");
                    dom.querySelector("#galpop > div > div.nosel").style.float = "none";
                    dom.querySelector("textarea[name='favnote']").style.minHeight = "20px";
                    dom.querySelector("textarea[name='favnote']").style.height = "30px";
                    dom.querySelector("textarea[name='favnote']").style.width = "97%";
                    dom.querySelector("textarea[name='favnote']").style.maxWidth = "97%";

                    const favNote = dom.querySelector("#galpop > div > div:nth-child(2)");
                    favNote.style.marginTop = "5px";
                    favNote.style.width = "auto";
                    favNote.style.float = "none";
                    favNote.style.border = `2px solid ${borderColor}`;
                    favNote.style.padding = `3px`;
                    dom.querySelector("#galpop > div > div:nth-child(2) > div").style.margin = "0";
                    dom.querySelector("#galpop > div > div:nth-child(2) > div").innerHTML = dom.querySelector("#galpop > div > div:nth-child(2) > div").innerHTML.replace("[", "").replace("]", "");
                    dom.querySelector("#galpop > div > div:nth-child(2) > div > br").setAttribute("hidden", "true");
                    dom.querySelector("#galpop > div > div:nth-child(2) > div > a").setAttribute("hidden", "true");
                    form.setAttribute("action", favURL + param_gid + "&t=" + param_t + "&act=" + "addfav");
                    form.setAttribute("target", "hideif");
                    plugincanvas.appendChild(form);

                    let el = document.createElement("script");
                    el.innerHTML = `
                    var selected = "fav0";
                    function clicked_fav(fav) {
                        console.debug("selected=" + selected + " selecting=" + fav.id);

                        if( selected == fav.id ) {
                            document.getElementById("galpop").submit();
                        }
                        else {
                            selected = fav.id;
                        }
                    }`;
                    plugincanvas.appendChild(el);
                },
            });
        }
    }

    class torrentPanel {
        panel;
        canvas;
        torrentsList;
        constructor(plugincanvas) {
            this.canvas = plugincanvas;
            GM_xmlhttpRequest({
                method: "GET",
                url: torrentURL + param_gid + "&t=" + param_t,
                overrideMimeType: "text/html; charset=UTF-8",
                onload: function (xhr) {
                    let dom = new DOMParser().parseFromString(xhr.responseText, "text/html");
                    var table = dom.getElementsByTagName("table");
                    this.torrentsList = new Array();
                    if (table.length == 0) {
                        let panel = document.createElement("div");
                        panel.style.margin = "5px";
                        panel.style.maxWidth = "240px";
                        panel.innerText = dom.querySelector("div#torrentinfo>div>p").innerText;
                        plugincanvas.appendChild(panel);
                    }
                    for (let i = 0; i < table.length; i++) {
                        let tds = table[i].getElementsByTagName("td");

                        let posted = tds[0].innerText.trim();
                        let size = tds[1].innerText.trim();
                        let uploader = tds[6].innerText.trim();
                        let filename = tds[8].innerText.trim();
                        let torrent =
                            "magnet:?xt=urn:btih:" +
                            table[i]
                                .querySelector("a")
                                .href.match(/[\w\d]{40}/)
                                .toString();
                        let download = table[i].querySelector("a").getAttribute("onclick");
                        let download_href = table[i].querySelector("a").getAttribute("href");

                        let panel = document.createElement("div");
                        panel.className = "torrent-panel";
                        // panel.style.margin = "5px";
                        // panel.style.maxWidth = "240px";
                        panel.style.border = `2px solid ${borderColor}`;

                        plugincanvas.appendChild(panel);

                        let tab = document.createElement("table");
                        tab.style.width = "100%";

                        panel.appendChild(tab);

                        let tr = document.createElement("tr");
                        tr.style.width = "100%";
                        tab.appendChild(tr);

                        let Eposted = document.createElement("td");
                        Eposted.innerText = posted;
                        Eposted.style.width = "50%";
                        Eposted.style.textAlign = "left";
                        tr.appendChild(Eposted);

                        let Esize = document.createElement("td");
                        Esize.innerText = size;
                        Esize.style.width = "35%";
                        Esize.style.textAlign = "right";
                        tr.appendChild(Esize);

                        let tr2 = document.createElement("tr");
                        tab.appendChild(tr2);

                        let Euploader = document.createElement("td");
                        Euploader.innerText = uploader;
                        Euploader.style.width = "25%";
                        Euploader.style.textAlign = "left";
                        tr2.appendChild(Euploader);

                        let Efilename = document.createElement("p");
                        Efilename.innerText = filename;
                        Efilename.style.textAlign = "left";
                        panel.appendChild(Efilename);

                        let Etorrent = document.createElement("input");
                        Etorrent.style = "margin-bottom: 2px;";
                        Etorrent.type = "button";
                        Etorrent.value = "复制磁力链";
                        Etorrent.data = torrent;
                        Etorrent.onclick = () => {
                            const el = document.createElement("textarea");
                            el.value = torrent;
                            document.body.appendChild(el);
                            el.select();
                            document.execCommand("copy");
                            document.body.removeChild(el);
                        };
                        panel.appendChild(Etorrent);

                        let Edownload = document.createElement("input");
                        Edownload.style = "margin-bottom: 2px;";
                        Edownload.type = "button";
                        Edownload.value = "下载Torrent";
                        Edownload.setAttribute("onclick", download);
                        panel.appendChild(Edownload);

                        let Gdownload = document.createElement("input");
                        Gdownload.style = "margin-bottom: 2px;";
                        Gdownload.type = "button";
                        Gdownload.value = "下载公共Torrent";
                        Gdownload.setAttribute("onclick", `document.location='${download_href}'; return false`);
                        panel.appendChild(Gdownload);
                    }
                },
            });
        }
    }

    pluginc = new pluginCanvas();
    pluginc.loadFavPanel();
    pluginc.loadTorrentPanel();
})();
