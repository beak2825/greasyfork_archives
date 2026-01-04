// ==UserScript==
// @name           Bilibili Extractor
// @description    Extract video download link for Bilibili
// @namespace https://greasyfork.org/users/3920
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20220904154950
// @downloadURL https://update.greasyfork.org/scripts/373038/Bilibili%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/373038/Bilibili%20Extractor.meta.js
// ==/UserScript==
 
(function () {
    var FORMAT_LABEL = {
        "15": "360p",
        "16": "360p",
        "32": "480p",
        "48": "480p+",
        "64": "720p",
        "66": "720p-",
        "74": "1080p",
        "80": "1080p",
        "112": "1080p+",
        "116": "1080p+",
    };
 
    var FORMAT = {
        "15": "flv",
        "16": "mp4",
        "32": "flv",
        "48": "mp4",
        "64": "flv",
        "66": "720p-",
        "74": "1080p",
        "80": "flv",
        "112": "flv",
        "116": "1080p+",
    };
 
    function htmlDecode(value) {
        return $("<textarea/>").html(value).text();
    }
 
    function htmlEncode(value) {
        return $('<textarea/>').text(value).html();
    }
 
    function fileSize(a, b, c, d, e) {
        return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'KMGTPEZY'[--e] + 'B' : 'Bytes');
    }
 
    function SortQuality(a, b) {
        if(a.quality == b.quality) {
            return (b.bandwidth - a.bandwidth);
        } else {
            return (b.quality - a.quality);
        }
        return 0;
    }
 
    function addCSS() {
        var overrideStyle = "";
        function includeGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }
 
        function addGlobalStyle(css) {
            overrideStyle += css + "\n";
        }
 
        addGlobalStyle(".BiliDashDown {margin-right: 1em; display: inline-block;}");
        includeGlobalStyle(overrideStyle);
    }
 
    MD5 = function (d) { result = M(V(Y(X(d), 8 * d.length))); return result.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0; for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }
 
 
    GetTitle = function () {
        var p = window.__INITIAL_STATE__.p;
        var videoData = window.__INITIAL_STATE__.videoData;
        var title = videoData.title;
        if (title === undefined) {
            var elem = document.getElementsByClassName('tit tr-fix');
            if (elem.length > 0)
                title = elem[0].innerText;
            if (title === "") {
                elem = document.getElementsByClassName('video-title');
                if (elem.length > 0) {
                    //elem = title[0].getElementsByTagName('h1');
                    //if (elem.length > 0) {
                    elem = elem[0].getAttribute('title');
                    //}
                }
            }
        } else {
            if (p === "" && videoData.pages.length > 1)
                p = 1;
            if (p !== "") {
                videoData.pages.forEach(function(page) {
                    if (page.page == p) {
                        title += " [P" + p + " " + page.part + "]";
                    }
                });
            }
        }
        return title.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/"/g, "＂");
    };
 
    RemoveDownloadBtn = function () {
        var downbtn = document.getElementsByClassName("BiliDown");
        while (downbtn.length > 0)
            downbtn[0].remove();
    };
 
    CreateDownloadBtn = function (listJson) {
        var title = GetTitle();
        var panel = document.getElementsByClassName('toolbar-left');
        if (panel.length == 1) {
            var panelElem = panel[0];
            var quality = listJson.quality;
            var format = FORMAT[quality]; //listJson.format;
 
            for (var i = 0; i < listJson.durl.length; ++i) {
                var size = fileSize(listJson.durl[i].size);
                var order = listJson.durl[i].order;
                var domDiv = document.createElement('span');
                domDiv.setAttribute('title', size);
                domDiv.setAttribute('class', 'BiliDown');
 
                var icon = document.createElement('svg');
                icon.setAttribute('width', '36');
                icon.setAttribute('height', '36');
                icon.setAttribute('viewBox', '0 0 24 24');
                icon.setAttribute('class', 'icon');
                icon.innerHTML = '<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path>';
 
                var filename = title + (listJson.durl.length > 1 ? "_" + order : "") + '.' + format;
                var downloadBtn = document.createElement('a');
                downloadBtn.setAttribute('style', 'display: inline-flex;');
                downloadBtn.setAttribute('href', htmlDecode(listJson.durl[i].url.replace('http://', 'https://'))+"&title="+encodeURIComponent(filename).replace(/'/g, "%27"));
                downloadBtn.setAttribute('download', filename);
                downloadBtn.appendChild(icon);
                downloadBtn.innerHTML = downloadBtn.innerHTML + `<span class="info-text">${FORMAT_LABEL[quality]}<sup>${order}</sup></span>`;
 
                domDiv.appendChild(downloadBtn);
                panelElem.insertBefore(domDiv, panelElem.firstElementChild);
            }
        }
        else {
            console.log("not found panel");
        }
    };
 
    RemoveDownloadDashBtn = function () {
        var downbtn = document.getElementsByClassName("BiliDashDown");
        while (downbtn.length > 0)
            downbtn[0].remove();
    };
 
    CreateDownloadDashBtn = function (listJson, type) {
        let title = GetTitle();
        let dashDown = document.getElementById(`DashDown${type}`);
        if (null === dashDown) {
            let panel = document.getElementsByClassName('left-container');
            if (panel.length == 1) {
                let div = document.createElement('div');
                div.setAttribute('id', 'DashDownList');
 
                dashDown = document.createElement('fieldset');
                dashDown.setAttribute('id', `DashDown${type}`);
 
                let legend = document.createElement('legend');
                legend.innerText = type;
                dashDown.appendChild(legend);
                div.appendChild(dashDown);
                panel[0].insertBefore(div, document.getElementById('arc_toolbar_report'));
            }
        }
 
        if (null !== dashDown) {
            let quality = listJson.quality;
            //var format = FORMAT[quality]; //listJson.format;
 
            for (let file of listJson) {
                let size = fileSize(file.bandwidth);
                let domDiv = document.createElement('span');
                domDiv.setAttribute('title', `Bitrate : ${size}`);
                domDiv.setAttribute('class', 'BiliDashDown');
 
                let icon = document.createElement('i');
                icon.setAttribute('class', 'van-icon-download');
 
                let filename = `${title}`;
                let downtext = "";
                if ("Video" == type) {
                    filename = filename + `_${file.quality}p_${file.fps}f.mp4v`;
                    downtext = `${file.quality}p` + "<sup>" + `${file.fps}f` + "</sup>";
                } else {
                    filename = filename + ".m4a";
                    downtext = `${file.quality}`;
                }
                let downloadBtn = document.createElement('a');
                downloadBtn.setAttribute('href', file.url+"&title="+encodeURIComponent(filename).replace(/'/g, "%27"));
                downloadBtn.setAttribute('download', filename);
                downloadBtn.appendChild(icon);
                downloadBtn.innerHTML = downloadBtn.innerHTML + downtext;
 
                domDiv.appendChild(downloadBtn);
                dashDown.appendChild(domDiv);
            }
        }
        else {
            console.log("not found panel");
        }
    };
 
    function DownloadDashFormat() {
        addCSS();
        RemoveDownloadDashBtn();
 
        let videos = [];
        let audios = [];
        let master = window.__playinfo__.data.dash;
 
        for (let video of master.video) {
            let elem = new Object();
            elem.url = (video.baseUrl || video.base_url);
            elem.bandwidth = video.bandwidth;
            elem.quality = video.height;
            elem.fps = parseInt((video.frameRate || video.frame_rate));
            videos.push(elem);
        }
 
        videos.sort(SortQuality);
        console.log(videos);
 
        for (let audio of master.audio) {
            let elem = new Object();
            elem.url = (audio.baseUrl || audio.base_url);
            elem.bandwidth = audio.bandwidth;
            elem.quality = audio.bandwidth;
            audios.push(elem);
        }
 
        audios.sort(SortQuality);
        console.log(audios);
 
        CreateDownloadDashBtn(videos, "Video");
        CreateDownloadDashBtn(audios, "Audio");
    }
 
    function start() {
        if (typeof (jQuery) == 'undefined') {
            var jquery = document.createElement('script');
            jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
            document.body.appendChild(jquery);
            setTimeout(start, 100);
            return;
        }
        else {
            if (/(https?:\/\/www\.bilibili\.com\/video\/[^\/\?]+)(\/|\?|$)/.test(document.location.href))
            {
                var APIURL = "https://interface.bilibili.com/v2/playurl?";
                //var APPKEY = "84956560bc028eb7";
                //var SECKEY = "94aba54af9065f71de72f5508f1cd42e";
                var APPKEY = "YvirImLGlLANCLvM";
                var SECKEY = "JNlZNgfNGKZEpaDTkCdPQVXntXhuiJEM";
 
                var scripts = document.getElementsByTagName("script");
                for (var i = 0; i < scripts.length ; ++i) {
                    if (/window\.__playinfo__/g.test(scripts[i].innerText)) {
                        var code = scripts[i].innerText.replace('window\.__playinfo__', 'window.__videoinfo__');
                        window.eval(code);
                        break;
                    }
                }
 
                if (window.__videoinfo__ !== undefined) {
                    var bCallSuccess = false;
                    var success = function (playinfo) {
                        RemoveDownloadBtn();
                        CreateDownloadBtn(playinfo);
                        bCallSuccess = true;
                    };
                    var error = function (xhr, status, error) {
                        console.log("playinfo load error");
                    };
 
                    for (i = 0; i < window.__videoinfo__.data.accept_quality.length && bCallSuccess === false; ++i) {
                        let quality = window.__videoinfo__.data.accept_quality[i];
                        let cid = window.__INITIAL_STATE__.videoData.cid;
                        let parameter = "appkey=" + APPKEY + "&cid=" + cid + "&otype=json&qn=" + quality + "&quality=" + quality + "&type=";
                        //console.log(parameter + SECKEY);
 
                        var apicall = APIURL + parameter + '&sign=' + MD5(parameter + SECKEY);
 
                        $.ajax({
                            type: "GET",
                            url: apicall,
                            async: false,
                            dataType: "json",
                            success: success,
                            error: error
                        });
                    }
                }
 
                DownloadDashFormat();
            }
            else {
                console.log("not video page");
            }
        }
    }
 
    start();
})();