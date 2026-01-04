// ==UserScript==
// @name        Embed Vimeo Download
// @namespace   https://greasyfork.org/users/3920-mio
// @description Adds a download button to the embed video player.
// @include     https://player.vimeo.com/*
// @include     https://player-api.p.uliza.jp/*
// @match       https://player.vimeo.com/*
// @match       https://player-api.p.uliza.jp/*
// @version     0.1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40194/Embed%20Vimeo%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/40194/Embed%20Vimeo%20Download.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // helper: find DOM element
    function find(selector) { return document.querySelector(selector); }

    function ReplaceUrl(url, relative_path) {
        if (false === /\/$/.test(url)) {
            url = url.replace(/[^\/]+$/, "");
        }
        for (let path of relative_path.split('/')) {
            if (".." == path) {
                url = url.replace(/[^\/]+\/$/, "");
            } else if ("" !== path) {
                url = url + `${path}\/`;
            }
        }
        return url;
    }

    function SortQuality(a, b) {
        if(a.quality == b.quality) {
            return (b.fps - a.fps);
        } else {
            return (b.quality - a.quality);
        }
        return 0;
    }

    window.copyToClipboard = function(val) {
        var t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = val;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
    };

    async function getContents(link) {
        return new Promise(res => {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        res(xmlhttp.responseText);
                    } else {
                        res(undefined);
                    }
                }
            };
            xmlhttp.open("GET", link, true);
            xmlhttp.send();
        });
    };

    var GetHlsLink = async (url, title) => {
        SetResult("master", url+"\n"+title+"\n", "q", "q_master");
        SetResult(url, url+"\n"+title+"\n", "url", "url_master");

        let content = await getContents(url);
        if(content !== undefined) {
            let prefix = url.replace(/(.+)\/[^\/]+/, "$1");
            let pattern = /(?:^.+,RESOLUTION=\d+x(\d+),FRAME-RATE=(\d+)\..+$\n^([^#].+)$|^#EXT-X-MEDIA:.+?,GROUP-ID="([^"]+)",.+?,URI="([^"]+)")/gm;
            let matchArray;
            let index = 1;

            while ((matchArray = pattern.exec(content)) !== null) {
                let resolution = "";
                let hlsUrl = "";
                let framerate = "";
                if(matchArray[3] !== undefined) {
                    resolution = matchArray[1] + "p";
                    framerate = "_" + matchArray[2] + "f";
                    hlsUrl = matchArray[3];
                } else if(matchArray[5] !== undefined) {
                    resolution = matchArray[4];
                    hlsUrl = matchArray[5];
                }

                if(hlsUrl === "") continue;

                let back_count = (hlsUrl.match(/\.\.\//g) || []).length;
                let baseUrl = prefix;
                while(back_count > 0) {
                    baseUrl = baseUrl.replace(/\/([^\/]+)$/, "");
                    --back_count;
                }
                hlsUrl = baseUrl + "/" + hlsUrl.replace(/\.\.\//g, "");

                SetResult(resolution+framerate, hlsUrl+"\n"+title+"_"+resolution+framerate+"\n", "q", "q_" + index);
                SetResult(hlsUrl, hlsUrl+"\n"+title+"_"+resolution+framerate+"\n", "url", "url_" + index);
                ++index;
            }
        }
    };

    var GetHlsLinkSimple = async (url, title) => {
        SetResult("master", url+"\n"+title+"\n", "q", "q_master");
        SetResult(url, url+"\n"+title+"\n", "url", "url_master");

        let content = await getContents(url);
        if(content !== undefined) {
            let pattern = /(?:^#.+,BANDWIDTH=(\d+)\D*$)\s*^([^#\s]+)$/gm;
            let matchArray;
            let index = 1;

            while ((matchArray = pattern.exec(content)) !== null) {
                let resolution = matchArray[1];
                let hlsUrl = matchArray[2];

                if(hlsUrl === "") continue;

                SetResult(resolution, hlsUrl+"\n"+title+"_"+resolution+"\n", "q", "q_" + index);
                SetResult(hlsUrl, hlsUrl+"\n"+title+"_"+resolution+"\n", "url", "url_" + index);
                ++index;
            }
        }
    };

    var GetDashLink = async (url, title) => {
        let content = await getContents(url);
        if (content !== undefined) {
            let master = JSON.parse(content);
            console.log(master);

            let baseUrl = ReplaceUrl(url, master.base_url);
            let videos = [];
            let audios = [];

            for (let video of master.video) {
                let elem = new Object();
                if (undefined !== video.index_segment) {
                    elem.url = ReplaceUrl(baseUrl, video.base_url) + video.index_segment.replace(/&range=[^&]+/, "");
                } else {
                    elem.url = "";
                }
                elem.quality = video.height;
                elem.fps = parseInt(video.framerate);
                videos.push(elem);
            }

            videos.sort(SortQuality);
            console.log(videos);

            for (let audio of master.audio) {
                let elem = new Object();
                if (undefined !== audio.index_segment) {
                    elem.url = ReplaceUrl(baseUrl, audio.base_url) + audio.index_segment.replace(/&range=[^&]+/, "");
                } else {
                    elem.url = "";
                }
                elem.quality = audio.sample_rate;
                elem.fps = audio.bitrate;
                audios.push(elem);
            }

            audios.sort(SortQuality);
            console.log(audios);

            let allformat = videos.concat(audios);

            let playBar = find('.player .vp-controls-wrapper');
            if (undefined === playBar) return;

            var frame = document.createElement('div');
            frame.setAttribute('style', 'position: absolute; bottom: 6em; left: 1em; right: 1em; height: 0; opacity: 1; z-index: 16; display: flex; align-items: flex-end;');

            for (let format of allformat) {
                if ("" === format.url) continue;

                var button = makeButton(format.url, title, format.quality, format.fps);
                frame.appendChild(button);
            }
            playBar.insertBefore(frame, find('.player .vp-controls'));
        }
    };

    function setup()
    {
        // controller object in DOM and video element available?
        if (window && find('.player .vp-controls')) {
            var videoInfo = window.playerConfig;
            if (undefined === videoInfo) {
                let result = /(var ([a-z]+)\s*=\s*{((?!};).)*};)/.exec(document.body.innerHTML);
                if (result !== null)
                    eval(result[1] + "videoInfo = " + result[2] + ";");
            }
            // save title
            var title = videoInfo.video.title;

            // get streams
            var streams = videoInfo.request.files.progressive;
            //window.test = videoInfo.request.files;

            // sort streams descending by video resolution
            if (undefined !== streams) {
                streams.sort(function compare(streamA, streamB) {
                    // compare width property
                    return streamB.width - streamA.width;
                });

                for (var i = 0; i < streams.length; ++i) {
                    // get video file info
                    // - just take the first one with the highest quality
                    // - this will be replaced when I got more time
                    var file = streams[i];

                    // log gathered information
                    console.log("[Vimeo Download] Found media for \"" + title + "\" (" + file.quality + ", " + file.fps + ")");

                    // make download button
                    var button = makeButton(file.url, title, file.quality, file.fps);

                    // regularly check that button is in control bar
                    // yes, that's dirty, but Vimeo replaces the player UI somewhen after loading
                    // find control bar
                    var playBar = find('.player .vp-controls');

                    // remove any old button if existing
                    var oldButton = find('.button .dwnld .q' + file.quality);
                    if (oldButton) oldButton.remove();

                    // add new button
                    playBar.appendChild(button);
                }
            }

            GetHlsLink(videoInfo.request.files.hls.cdns.fastly_skyfire.url, title.replace( /[<>:"\/\\|?*]/g, '' ));
            GetDashLink(videoInfo.request.files.dash.cdns.akfire_interconnect_quic.url, title.replace( /[<>:"\/\\|?*]/g, '' ));
        }
        else if (window && find('.uliza-play-start-button')) {
            let info = JSON.parse(getUlizaPlayerOptions());
            for (let video of info.sources) {
                GetHlsLinkSimple(video.src, info.title.textJa.replace( /[<>:"\/\\|?*]/g, '' ));
            }
        }
        else {
            // try again later
            setTimeout(setup, 500);
        }
    }

    // create download button
    function makeButton( url, title, quality, fps )
    {
        // make valid filename from title
        var filename = title.replace( /[<>:"\/\\|?*]/g, '' ) + '_' + quality + '_' + fps + 'f.mp4';

        // create new button
        var button = document.createElement( 'a' );
        button.href = url + "?title=" + encodeURIComponent(filename).replace(/'/g, "%27");
        button.target = '_blank';
        button.download = filename;
        button.innerHTML = quality+ '_' + fps + 'f';//"⥥";
        button.title = "Download " + quality+ '_' + fps + 'f';
        button.setAttribute( 'class', "button dwnld q" + quality+ '_' + fps + 'f' );
        button.setAttribute( 'style', 'display: inline-block; font-size: 1.75em; margin: -0.25em 0 0 0.3em; color: #000; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' );

        // apply mouseover effect
        button.onmouseenter = function() { button.style.color = 'rgb(68,187,255)'; };
        button.onmouseleave = function() { button.style.color = '#000'; };

        // return DOM object
        return button;
    }

    function CreateTable(col, row, color = "") {
        if (color === "")
            color = "white";

        var row_dom = document.createElement('div');
        row_dom.setAttribute('id', row);
        row_dom.setAttribute('style', 'color:' + color + ';font:12px Meiryo; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;');
        row_dom.setAttribute('onclick', 'copyToClipboard(this.getAttribute("value"));');

        var col_dom = document.getElementById(col);
        if(col_dom === null) {
            col_dom = document.createElement('div');
            col_dom.setAttribute('id', col);
            col_dom.setAttribute('style', 'padding:0px 10px 0px 10px; vertical-align:middle; display: grid; min-width: 60px;');

            var table_dom = document.getElementById('resulttable');
            if(table_dom === null)
                CreateLayout();
            table_dom = document.getElementById('resulttable');
            if(table_dom !== null)
                table_dom.appendChild(col_dom);
        }

        col_dom.appendChild(row_dom);
    }

    function CreateLayout(color) {
        var trends_dom = document.getElementById('extractresult');
        if (trends_dom !== null)
            trends_dom.outerHTML = "";
        trends_dom = document.createElement('div');
        trends_dom.setAttribute('id', 'extractresult');
        var title_dom = document.createElement('strong');
        title_dom.innerHTML = [
            '<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div id="resulttable" style="display: flex;">',
            '</div></div>'
        ].join(' ');

        trends_dom.appendChild(title_dom);
        trends_dom.style.cssText = [
            'background: rgba(55, 55, 55, 0.5);',
            'color: #fff;',
            'padding: 0px;',
            'position: fixed;',
            'z-index:102400;',
            'width:100%;',
            'font: 12px Meiryo;',
            'vertical-align: middle;',
            'top: 0px;',
        ].join(' ');
        document.body.style.cssText = 'position: relative; margin-top: 0px';
        document.body.insertBefore(trends_dom, document.body.firstElementChild);
    }

    function SetResult(name, value, col_id, row_id, color = "") {
        var elem = document.getElementById(row_id);
        if (elem === null)
            CreateTable(col_id, row_id, color);

        elem = document.getElementById(row_id);
        if (elem !== null) {
            elem.setAttribute('value', value);
            elem.innerHTML = name;
        }
    }

    setup();
})();