// ==UserScript==
// @name           Extract OpenRecTV Video
// @description    Extract Video for OpenRecTV
// @namespace https://greasyfork.org/users/3920
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20210113152028
// @downloadURL https://update.greasyfork.org/scripts/375276/Extract%20OpenRecTV%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/375276/Extract%20OpenRecTV%20Video.meta.js
// ==/UserScript==

(function () {
// static
    copyToClipboard = function (val) {
        var t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = val;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
    };

    getCookie = function (e) {
        var t = document.cookie.match("(^|;) ?" + e + "=([^;]*)(;|$)");
        return (t ? t[2] : null);
    };

    function getTitle() {
        var title = "";
        var pattern = /window.\w+\s*=\s*({((?!};).)*});/gm;
        var matchArray;
        while ((matchArray = pattern.exec(document.head.innerHTML)) !== null) {
            var jsonData = JSON.parse(matchArray[1]);
            if (jsonData.moviePageStore !== undefined)
            {
                var startAt = /(\d{4})-(\d{2})-(\d{2})T/.exec(jsonData.moviePageStore.movieStore.startedAt);
                if (startAt !== null)
                {
                    title = startAt[1] + startAt[2] + startAt[3];
                }

                title = title + " " + jsonData.moviePageStore.movieStore.title.replace("  ", " ");
            }
        }
        return title;
    }

    function ExtractIndex(url) {
        $.ajax({
            type: "GET",
            url: url,
            success: function (xml) {
                var path = url.replace(/^(https?:\/\/[^:\s]+\/)[^\/]+?$/, "$1");
                var pattern = /^#.+?BANDWIDTH=(\d+?),.+?$\n^([^#].+?)$/gm;
                var matchArray;
                var maxBandwidth = 0;
                var maxHls = "";

                while ((matchArray = pattern.exec(xml)) !== null) {
                    var bandwidth = Number(matchArray[1]);
                    if (maxBandwidth < bandwidth) {
                        maxBandwidth = bandwidth;
                        maxHls = path + matchArray[2];
                    }
                }

                SetResult('extractindex', maxHls);
            },
            error: function (xhr, status, error) {
                SetResult('extractindex', "notfound");
            }
        });
    }

    function ExtractOpenRecTV(url) {
        var videoId = /live\/(\w+)/.exec(url);
        if (videoId !== null)
            videoId = videoId[1];
        var token = getCookie("access_token");
        var uid = getCookie("uuid");
        var result = document.getElementsByClassName('controlbar-wrapper');
        if (result.length === 0)
        {
            token = "cdb31538-bbcb-439e-a2cd-3c57eaf4dc67";
            uid = "8DCF568C-32CF-0926-310A-B8C63A6A9B31";
        }

        SetResult('extracttitle', getTitle());

        $.ajax({
            type: "GET",
            url: "https://apiv5.openrec.tv/api/v5/movies/" + videoId + "/detail",
            async: false,
            beforeSend: function (req) {
                req.setRequestHeader("access-token", token);
                req.setRequestHeader("uuid", uid);
            },
            success: function (xml) {
                var url = xml.data.items[0].media.url_source;
                if(url !== null)
                    SetResult('extractsource', url);
                else
                    SetResult('extractsource', "no source");

                url = xml.data.items[0].media.url;
                if(url !== null)
                    ExtractIndex(url);
                else if(xml.data.items[0].media.url_public !== null)
                    ExtractIndex(xml.data.items[0].media.url_public.replace("public.m3u8", "playlist.m3u8"));
                else
                    SetResult('extractindex', "no index");

            },
            error: function (xhr, status, error) {
                SetResult('extractsource', "notfound");
            }
        });
    }

    function start() {
        if (typeof (jQuery) == 'undefined') {
            var jquery = document.createElement('script');
            jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
            document.body.appendChild(jquery);
            setTimeout(start, 100);
            return;
        }

        var url = document.location.href;
        var extractFunc = null;
        if (/openrec.tv/gi.test(url))
            extractFunc = ExtractOpenRecTV;

        extractFunc(url);
    }

    function CreateLayout(color) {
        if (color === "")
            color = "white";

        var trends_dom = document.getElementById('extractresult');
        if (trends_dom !== null)
            trends_dom.outerHTML = "";
        trends_dom = document.createElement('div');
        trends_dom.setAttribute('id', 'extractresult');
        var title_dom = document.createElement('strong');
        title_dom.innerHTML = [
			'<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: auto; vertical-align: middle; border-spacing: 0px"><div style="display: inline-table;">',
			'<div id="popup-close" style="display: table-cell;position: relative;"></div>',
			'<div style="display: table-cell; padding: 0px 10px 0px 10px; vertical-align: middle; color: white; font: 12px Meiryo;"><div id="extracttitle" onclick="copyToClipboard(this.getAttribute(\'value\'));" value="");">-</div></div>',
			'<div style="display: table-cell; padding: inherit; vertical-align: middle; color: ' + color + '; font: 12px Meiryo;"><div id="extractsource" onclick="copyToClipboard(this.getAttribute(\'value\'));" value="");">-</div><div id="extractindex" onclick="copyToClipboard(this.getAttribute(\'value\'));" value="");">-</div></div>',
			'</div>'
        ].join(' ');

        trends_dom.appendChild(title_dom);
        trends_dom.style.cssText = [
			'background: rgba(8, 35, 55, 1);',
			'color: #000;',
			'padding: 0px;',
			'position: fixed;',
			'z-index:102400;',
			'width:100%;',
			'font: 12px Meiryo;',
			'vertical-align: middle;',
        ].join(' ');
        document.body.style.cssText = 'position: relative; margin-top: 45px';
        document.body.insertBefore(trends_dom, document.body.firstElementChild);
    }

    function SetResult(id, value) {
        var elem = document.getElementById(id);
        if (elem === null)
            CreateLayout("");

        elem = document.getElementById(id);
        if (elem !== null)
        {
            elem.setAttribute('value', value);
            elem.innerText = value;
        }
    }

    start();
})();