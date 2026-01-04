// ==UserScript==
// @name Youtube Best Video Downloader 2
// @description Download every YouTube video you want and you can download them as Full-HD MP4, FLV, 3GP, MP3 128kbps and 192kbps, M4A and AAC formats. Also thumbnails and subtitles can be downloaded! Easy & Fast!
// @homepageURL https://bvd2.nl/
// @author BVD2
// @version 7.73+
// @date 03-09-2017
// @namespace BVD2
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/*
// @match https://s.ytimg.com/yts/jsbin/*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @connect googlevideo.com
// @connect bvd2.nl
// @connect ytimg.com
// @grant GM_xmlhttpRequest
// @grant GM_getValu
// @grant GM_setValue
// @run-at document-end
// @license MIT License
// @icon https://www.google.com/s2/favicons?domain=bvd2.nl
// @downloadURL https://update.greasyfork.org/scripts/39805/Youtube%20Best%20Video%20Downloader%202.user.js
// @updateURL https://update.greasyfork.org/scripts/39805/Youtube%20Best%20Video%20Downloader%202.meta.js
// ==/UserScript==
(function() {
    var FORMAT_LABEL = {
        '18': 'MP4 360p',
        '22': 'MP4 720p',
        '43': 'WebM 360p',
        '44': 'WebM 480p',
        '45': 'WebM 720p',
        '46': 'WebM 1080p',
        '135': 'MP4 480p - no audio',
        '137': 'MP4 1080p - no audio',
        '138': 'MP4 2160p - no audio',
        '140': 'M4A 128kbps - audio',
        '264': 'MP4 1440p - no audio',
        '266': 'MP4 2160p - no audio',
        '298': 'MP4 720p60 - no audio',
        '13': '3GP',
        '17': '3GP 144p',
        '36': '3GP 240p',
        '5': 'FLV 240p',
        '34': 'FLV 360p',
        '35': 'FLV 480p',
        '299': 'MP4 1080p60 - no audio'
    };
    var FORMAT_TYPE = {
        '5': 'flv',
        '34': 'flv',
        '35': 'flv',
        '13': '3gp',
        '17': '3gp',
        '36': '3gp',
        '18': 'mp4',
        '22': 'mp4',
        '43': 'webm',
        '44': 'webm',
        '45': 'webm',
        '46': 'webm',
        '135': 'mp4',
        '137': 'mp4',
        '138': 'mp4',
        '140': 'm4a',
        '264': 'mp4',
        '266': 'mp4',
        '298': 'mp4',
        '299': 'mp4'
    };
    var FORMAT_ORDER = ['5', '13', '17', '34', '35', '36', '18', '43', '135', '44', '22', '298', '45', '137', '299', '46', '264', '138', '266', '140'];
    var FORMAT_RULE = {
        'flv': 'all',
        '3gp': 'all',
        'mp4': 'all',
        'webm': 'none',
        'm4a': 'max'
    };
    var SHOW_DASH_FORMATS = false;
    var BUTTON_TOOLTIP = {
        'ar': 'تنزيل هذا الفيديو',
        'cs': 'Stáhnout toto video',
        'de': 'Dieses Video herunterladen',
        'en': 'Download this video',
        'nl': 'Download deze video',
        'es': 'Descargar este vídeo',
        'fr': 'Télécharger cette vidéo',
        'hi': 'वीडियो डाउनलोड करें',
        'hu': 'Videó letöltése',
        'id': 'Unduh video ini',
        'it': 'Scarica questo video',
        'ja': 'このビデオをダウンロードする',
        'ko': '이 비디오를 내려받기',
        'pl': 'Pobierz plik wideo',
        'pt': 'Baixar este vídeo',
        'ro': 'Descărcați acest videoclip',
        'ru': 'Скачать это видео',
        'tr': 'Bu videoyu indir',
        'zh': '下载此视频'
    };
    var DECODE_RULE = [];
    var RANDOM = 4789239175;
    var CONTAINER_ID = 'download-youtube-video' + RANDOM;
    var LISTITEM_ID = 'download-youtube-video-fmt' + RANDOM;
    var BUTTON_ID = 'download-youtube-video-button' + RANDOM;
    var DEBUG_ID = 'download-youtube-video-debug-info';
    var STORAGE_URL = 'download-youtube-script-url';
    var STORAGE_CODE = 'download-youtube-signature-code';
    var STORAGE_DASH = 'download-youtube-dash-enabled';
    var isDecodeRuleUpdated = false;
    var version = '7.70';

    start();
    document.addEventListener("spfdone", start, false);
    function start() {
		function isMaterial() {
			var temp;
			temp = document.querySelector("ytd-app, [src*='polymer'],link[href*='polymer']");
			if (temp && !document.getElementById("material-notice")) {
				temp = document.createElement("template");
				temp.innerHTML = //
				`<div id='material-notice' style='border-radius:2px;color:#FFF;padding:10px;background-color:#ff0000;box-shadow:0 0 3px rgba(0,0,0,.5);font-size:12px;position:fixed;bottom:20px;right:50px;z-index:99999'>
				<strong><ins>WARNING : </ins></strong>Best Video Downloader 2 is not compatible with the experimental YouTube Material Layout<br/> which is under BETA testing.<br><br>
				<a href='https://bvd2.nl/newdesign' target='_blank' style='font-weight:bold;'>Click here</a> for instructions on how to continue using the video downloading features.<br>This addon will get migrated to the new layout when Youtube makes the BETA design as default, make sure you are configured for auto-updates.
				<br/><br/>
				<span id='close' onclick='document.getElementById("material-notice").remove(); return false;' align='center' STYLE='display:block;width:100px;height: 100%;margin: 0 auto;'><strong><ins><a href=""> [X] CLOSE </a></ins></strong></span>
				</div>`;
				document.documentElement.appendChild(temp.content.firstChild);
				document.documentElement.removeAttribute("data-user_settings");
				return true;
			}
		}
		isMaterial();
        var pagecontainer = document.getElementById('page-container');
        if (!pagecontainer) return;
        if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) run();
        var isAjax = /class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
        var logocontainer = document.getElementById('logo-container');
        if (logocontainer && !isAjax) {
            isAjax = (' ' + logocontainer.className + ' ').indexOf(' spf-link ') >= 0;
        }
        var content = document.getElementById('content');
        if (isAjax && content) {
            var mo = window.MutationObserver || window.WebKitMutationObserver;
            if (typeof mo !== 'undefined') {
                var observer = new mo(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes !== null) {
                            for (var i = 0; i < mutation.addedNodes.length; i++) {
                                if (mutation.addedNodes[i].id == 'watch7-container' ||
                                    mutation.addedNodes[i].id == 'watch7-main-container') {
                                    run();
                                    break;
                                }
                            }
                        }
                    });
                });
                observer.observe(content, {
                    childList: true,
                    subtree: true
                });
            } else {
                pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
            }
        }
    }

    function onNodeInserted(e) {
        if (e && e.target && (e.target.id == 'watch7-container' ||
                e.target.id == 'watch7-main-container')) {
            run();
        }
    }

    function run() {
        if (document.getElementById(CONTAINER_ID)) return;
        if (document.getElementById('p') && document.getElementById('vo')) return;

        var videoID, videoFormats, videoAdaptFormats, videoManifestURL, scriptURL = null;
        var isSignatureUpdatingStarted = false;
        var operaTable = new Array();
        var language = document.documentElement.getAttribute('lang');
        var textDirection = 'left';
        if (document.body.getAttribute('dir') == 'rtl') {
            textDirection = 'right';
        }
        if (document.getElementById('watch7-action-buttons')) {
            fixTranslations(language, textDirection);
        }

        var args = null;
        var usw = (typeof this.unsafeWindow !== 'undefined') ? this.unsafeWindow : window;
        if (usw.ytplayer && usw.ytplayer.config && usw.ytplayer.config.args) {
            args = usw.ytplayer.config.args;
        }
        if (args) {
            videoID = args['video_id'];
            videoFormats = args['url_encoded_fmt_stream_map'];
            videoAdaptFormats = args['adaptive_fmts'];
            videoManifestURL = args['dashmpd'];
            debug('DYVAM - Info: Standard mode. videoID ' + (videoID ? videoID : 'none') + '; ');
        }
        if (usw.ytplayer && usw.ytplayer.config && usw.ytplayer.config.assets) {
            scriptURL = usw.ytplayer.config.assets.js;
        }

        if (videoID == null) {
            var buffer = document.getElementById(DEBUG_ID + '2');
            if (buffer) {
                while (buffer.firstChild) {
                    buffer.removeChild(buffer.firstChild);
                }
            } else {
                buffer = createHiddenElem('pre', DEBUG_ID + '2');
            }
            injectScript('if(ytplayer&&ytplayer.config&&ytplayer.config.args){document.getElementById("' + DEBUG_ID + '2").appendChild(document.createTextNode(\'"video_id":"\'+ytplayer.config.args.video_id+\'", "js":"\'+ytplayer.config.assets.js+\'", "dashmpd":"\'+ytplayer.config.args.dashmpd+\'", "url_encoded_fmt_stream_map":"\'+ytplayer.config.args.url_encoded_fmt_stream_map+\'", "adaptive_fmts":"\'+ytplayer.config.args.adaptive_fmts+\'"\'));}');
            var code = buffer.innerHTML;
            if (code) {
                videoID = findMatch(code, /\"video_id\":\s*\"([^\"]+)\"/);
                videoFormats = findMatch(code, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
                videoFormats = videoFormats.replace(/&amp;/g, '\\u0026');
                videoAdaptFormats = findMatch(code, /\"adaptive_fmts\":\s*\"([^\"]+)\"/);
                videoAdaptFormats = videoAdaptFormats.replace(/&amp;/g, '\\u0026');
                videoManifestURL = findMatch(code, /\"dashmpd\":\s*\"([^\"]+)\"/);
                scriptURL = findMatch(code, /\"js\":\s*\"([^\"]+)\"/);
            }
            debug('DYVAM - Info: Injection mode. videoID ' + (videoID ? videoID : 'none') + '; ');
        }

        if (videoID == null) {
            var bodyContent = document.body.innerHTML;
            if (bodyContent != null) {
                videoID = findMatch(bodyContent, /\"video_id\":\s*\"([^\"]+)\"/);
                videoFormats = findMatch(bodyContent, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
                videoAdaptFormats = findMatch(bodyContent, /\"adaptive_fmts\":\s*\"([^\"]+)\"/);
                videoManifestURL = findMatch(bodyContent, /\"dashmpd\":\s*\"([^\"]+)\"/);
                if (scriptURL == null) {
                    scriptURL = findMatch(bodyContent, /\"js\":\s*\"([^\"]+)\"/);
                    if (scriptURL) {
                        scriptURL = scriptURL.replace(/\\/g, '');
                    }
                }
            }
            debug('DYVAM - Info: Brute mode. videoID ' + (videoID ? videoID : 'none') + '; ');
        }

        debug('DYVAM - Info: url ' + window.location.href + '; useragent ' + window.navigator.userAgent);

        if (videoID == null || videoFormats == null || videoID.length == 0 || videoFormats.length == 0) {
            debug('DYVAM - Error: No config information found. YouTube must have changed the code.');
            return;
        }
        if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined') {
            opera.extension.onmessage = function(event) {
                var index = findMatch(event.data.action, /xhr\-([0-9]+)\-response/);
                if (index && operaTable[parseInt(index, 10)]) {
                    index = parseInt(index, 10);
                    var trigger = (operaTable[index])['onload'];
                    if (typeof trigger === 'function' && event.data.readyState == 4) {
                        if (trigger) {
                            trigger(event.data);
                        }
                    }
                }
            }
        }

        if (!isDecodeRuleUpdated) {
            DECODE_RULE = getDecodeRules(DECODE_RULE);
            isDecodeRuleUpdated = true;
        }
        if (scriptURL) {
            scriptURL = absoluteURL(scriptURL);
            fetchSignatureScript(scriptURL);
        }
        var videoTitle = document.title || 'video';
        videoTitle = videoTitle.replace(/\s*\-\s*YouTube$/i, '').replace(/'/g, '\'').replace(/^\s+|\s+$/g, '').replace(/\.+$/g, '');
        videoTitle = videoTitle.replace(/[:"\?\*]/g, '').replace(/[\|\\\/]/g, '_');
        if (((window.navigator.userAgent || '').toLowerCase()).indexOf('windows') >= 0) {
            videoTitle = videoTitle.replace(/#/g, '').replace(/&/g, '_');
        } else {
            videoTitle = videoTitle.replace(/#/g, '%23').replace(/&/g, '%26');
        }
        var sep1 = '%2C',
            sep2 = '%26',
            sep3 = '%3D';
        if (videoFormats.indexOf(',') > -1) {
            sep1 = ',';
            sep2 = (videoFormats.indexOf('&') > -1) ? '&' : '\\u0026';
            sep3 = '=';
        }
        var videoURL = new Array();
        var videoSignature = new Array();
        if (videoAdaptFormats) {
            videoFormats = videoFormats + sep1 + videoAdaptFormats;
        }
        var videoFormatsGroup = videoFormats.split(sep1);
        for (var i = 0; i < videoFormatsGroup.length; i++) {
            var videoFormatsElem = videoFormatsGroup[i].split(sep2);
            var videoFormatsPair = new Array();
            for (var j = 0; j < videoFormatsElem.length; j++) {
                var pair = videoFormatsElem[j].split(sep3);
                if (pair.length == 2) {
                    videoFormatsPair[pair[0]] = pair[1];
                }
            }
            if (videoFormatsPair['url'] == null) continue;
            var url = unescape(unescape(videoFormatsPair['url'])).replace(/\\\//g, '/').replace(/\\u0026/g, '&');
            if (videoFormatsPair['itag'] == null) continue;
            var itag = videoFormatsPair['itag'];
            var sig = videoFormatsPair['sig'] || videoFormatsPair['signature'];
            if (sig) {
                url = url + '&signature=' + sig;
                videoSignature[itag] = null;
            } else if (videoFormatsPair['s']) {
                url = url + '&signature=' + decryptSignature(videoFormatsPair['s']);
                videoSignature[itag] = videoFormatsPair['s'];
            }
            if (url.toLowerCase().indexOf('ratebypass') == -1) {
                url = url + '&ratebypass=yes';
            }
            if (url.toLowerCase().indexOf('http') == 0) {
                videoURL[itag] = url + '&title=' + videoTitle;
            }
        }

        var showFormat = new Array();
        for (var category in FORMAT_RULE) {
            var rule = FORMAT_RULE[category];
            for (var index in FORMAT_TYPE) {
                if (FORMAT_TYPE[index] == category) {
                    showFormat[index] = (rule == 'all');
                }
            }
            if (rule == 'max') {
                for (var i = FORMAT_ORDER.length - 1; i >= 0; i--) {
                    var format = FORMAT_ORDER[i];
                    if (FORMAT_TYPE[format] == category && videoURL[format] != undefined) {
                        showFormat[format] = true;
                        break;
                    }
                }
            }
        }

        var dashPref = getPref(STORAGE_DASH);
        if (dashPref == '1') {
            SHOW_DASH_FORMATS = true;
        } else if (dashPref != '0') {
            setPref(STORAGE_DASH, '0');
        }

        var downloadCodeList = [];
        for (var i = 0; i < FORMAT_ORDER.length; i++) {
            var format = FORMAT_ORDER[i];
            if (format == '37' && videoURL[format] == undefined) {
                if (videoURL['137']) {
                    format = '137';

                }

                showFormat[format] = showFormat['37'];
            } else if (format == '38' && videoURL[format] == undefined) {
                if (videoURL['138'] && !videoURL['266']) {
                    format = '138';
                }
                showFormat[format] = showFormat['38'];
            }
            if (!SHOW_DASH_FORMATS && format.length > 2) continue;
            if (videoURL[format] != undefined && FORMAT_LABEL[format] != undefined && showFormat[format]) {
                downloadCodeList.push({
                    url: videoURL[format],
                    sig: videoSignature[format],
                    format: format,
                    label: FORMAT_LABEL[format]
                });
                debug('DYVAM - Info: itag' + format + ' url:' + videoURL[format]);
            }
        }

        if (downloadCodeList.length == 0) {
            debug('DYVAM - Error: No download URL found. Probably YouTube uses encrypted streams.');
            return;
        }
        var newWatchPage = false;
        var parentElement = document.getElementById('watch7-action-buttons');
        if (parentElement == null) {
            parentElement = document.getElementById('watch8-secondary-actions');
            if (parentElement == null) {
                debug('DYVAM Error - No container for adding the download button. YouTube must have changed the code.');
                return;
            } else {
                newWatchPage = true;
            }
        }

        var buttonLabel = (BUTTON_TOOLTIP[language]) ? BUTTON_TOOLTIP[language] : BUTTON_TOOLTIP['en'];
        var mainSpan = document.createElement('span');

        if (newWatchPage) {
            var spanIcon = document.createElement('span');
            spanIcon.setAttribute('class', 'yt-uix-button-content');
            var imageIcon = document.createElement('img');
            imageIcon.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
            imageIcon.setAttribute('class', 'yt-uix-button-icon');
            imageIcon.setAttribute('src', 'data:image/false;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAeCAIAAABc0ozeAAAACXBIWXMAAAsTAAALEwEAmpwYAAA57GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTctMDMtMjZUMDQ6MDI6MTgrMDI6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE3LTAzLTI2VDA0OjAyOjE4KzAyOjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNy0wMy0yNlQwNDowMjoxOCswMjowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6Yzc2YTExOWMtYjQxYi0yMjQ0LWI3MWMtYTg0NDhkMzgwNmRhPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MzkyYTcwOGQtMTFjOC0xMWU3LWFhNGMtZDdlYjlhNmQ0NjJiPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6MjEwNDBjYzktMDcyNS03NDRiLWJlZWItZmFlY2Y3ZGQzZWUyPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjIxMDQwY2M5LTA3MjUtNzQ0Yi1iZWViLWZhZWNmN2RkM2VlMjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0wMy0yNlQwNDowMjoxOCswMjowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjNzZhMTE5Yy1iNDFiLTIyNDQtYjcxYy1hODQ0OGQzODA2ZGE8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTctMDMtMjZUMDQ6MDI6MTgrMDI6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+OTY8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pq4YhDcAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABP5JREFUeNrsmlFMU1cYx/+FXqCt0EvT6kWj1YSQtgg0IyPFuKHBZDUxpptLKpmEyktLgml5WAbzZQ9TcUuERqNlD67GEeHFGV2y+kAUyEZjwtKugVYgsRdDqdB0F8rl1nZt9zBFAip1ajLN/b/dk/M/555fvvOd755cAcuydt/FsYX7C2wYvJ5KKqEqSPWJ3Rah3Xex79HvY0RBSlTEc1lRbor1hYcB5G75XHknJ5MSCHgoq5URCCI5QkWcyVlcDvN0nquUQLDIPcrhQbxcPCAe0OtJ+KqGH/f2mjYBABO9XHxvgI+gl4jgt9j/VNaaHzJ7zf/dX/F9pv6k9S1tsSwX0C2TPHlIMp7IdYN3gH6/c5C16rSlkABAip60kIV6/956AOFo3/7x0bWG5Lht4JQdOz7ZdcRR2uyuTpSMDr/PgOwTQ4Y9jftWpx1CoSIQXxqyrafzTNO3H3TtE50O7jh4STTcwkG5vdVVVqsiALDB+VuG0RHLHrspfVPk7gd0v+4/oWOvFt9zAfo79Y3UnNUttRvS3qCoSksAqXnXxLcH6ciq8Su7apotMkUBEE/SzrFzLeEIIDdXfdVZspXEKouo/ufqY4ZNeQAbWEoCzJvOQZxrv3cokFobJu2jPbc3stLjdABy1WZAdOyGqpaK3dw3+IV2zA/Z0b4KRWcsVCApNQOQ1aryQUoqjQCoShURck9FAJCSrcGJDsHg+b6EQr/9iHLVyE3VZps0ecPXIRg872DllnKzFcCu1u4Sqed+h8DV0R4T60vNVsBaYTTkz3Z7rILfrnogfjtJOtKjnxh/9smfpB3eU3YuS7OEkgClVVpMOu71D3LwPuz6JsqoZPqdM6EgodDLUKdUUozXLVSaKCgVCooLOTkAYBZcnz6cBuduiIaQLzc8G7PeRJLByOWGmWlw7jbviIcoPVoGRK6b/ugyPZgGps/O0gxBalFvKJQEo1fbwhHEhhsWIm/rFKPpUzr/OAMgFXJ6v255hYnYMAsASCdXEF9JLEMo1kZHAo8Vqm2VliJpgPnOzZKqErWtcGt4aWQwizoj/rf/aYzPMsk8Mh+IQbfT7NH3ZvS9GbWGXN/zTecged3mUmqF5OOBzlnoHg+5hDoj9bQxveCe87/onFJqlCpE7s4BRUAOsWJqyhMjPR+G27nY2Fd4FHmzd2m0gbZsMeqEbGDGvdGLJQEUCNWAHwBEJSSBeBJ1Vc026bLT13F8ZhrKk3+pybU93zSgI44PPlatbdSshHo8hYLckNP15fHneHc0aRo7tynD844WDpjyeqiDlhqjy9fPyFrbZWRw7kI/gEjIodaolob0HEBPBrYf0GGyc+O6YMDJfOaUN1/bdr4hKjlTUatNTbYHQFUTSCfC3DIKP7pUoiSxAAzciBm7ZY1d1Lk2Vn1NKs8+Sb9+HcSGE9gpWh/+mm59b/e/ddDcZYN3GAC4nwwB0lV2+G7dYYANzvcZvH4AoKcCZRoqNkQD4G55uAPa9FRHFnNfGe3R1jRbKs5kgHiSdvgunAUwfstUY2yvsbcjEWBmGYhJGey+fl210aa125AIMBEmP9vlCQ5dP/TLBneJZr9+fQSt0Ysi6N3WIW4xmwjqUbt6+OsOXjwgHhAPiAfEA3r3ABWJqdxMhgexXrmZTJGYyqksVpcn4zyj9XTKk1yVTCM8sdsC4E/Gv8j/vLBKUglVKf+wtdz8zwBtOQxheHlkawAAAABJRU5ErkJggg==');
            spanIcon.appendChild(imageIcon);
            mainSpan.appendChild(spanIcon);
        }

        var spanButton = document.createElement('span');
        spanButton.setAttribute('class', 'yt-uix-button-content');
        mainSpan.appendChild(spanButton);

        if (!newWatchPage) {
            var imgButton = document.createElement('img');
            imgButton.setAttribute('class', 'yt-uix-button-arrow');
            imgButton.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
            mainSpan.appendChild(imgButton);
        }
        var listItems = document.createElement('ol');
        listItems.setAttribute('style', 'display:none;');
        listItems.setAttribute('class', 'yt-uix-button-menu');
        for (var i = 0; i < downloadCodeList.length; i++) {
            var listItem = document.createElement('li');
            var listLink = document.createElement('a');
            listLink.setAttribute('style', 'text-decoration:none;');
            listLink.setAttribute('href', downloadCodeList[i].url);
            listLink.setAttribute('download', videoTitle + '.' + FORMAT_TYPE[downloadCodeList[i].format]);
            var listButton = document.createElement('span');
            listButton.setAttribute('class', 'yt-uix-button-menu-item');
            listButton.setAttribute('loop', i + '');
            listButton.setAttribute('id', LISTITEM_ID + downloadCodeList[i].format);
            if (downloadCodeList[i].format == '137') {
                listButton.onclick = function() {
                    window.open('https://bvd2.nl/download/direct/1080p.php?url=' + videoID);
                }
            }
            listButton.appendChild(document.createTextNode(downloadCodeList[i].label));
            listLink.appendChild(listButton);
            listItem.appendChild(listLink);
            listItems.appendChild(listItem);
        }
		if (videoURL['137'] != undefined) {
			//console.log('Inside Full-HD :' + format);
			var listItem = document.createElement('li');
			var listLink = document.createElement('a');
			listLink.setAttribute('style', 'text-decoration:none;');
			listLink.setAttribute('href', 'javascript:void(0);');
			var listSpan = document.createElement('span');
			listSpan.setAttribute('class', 'yt-uix-button-menu-item');
			listSpan.setAttribute('id', LISTITEM_ID + '-1080p3');
			listSpan.onclick = function () {
		window.open('https://bvd2.nl/download/direct/1080p.php?url=' + videoID);

				return false;
			};

			listSpan.appendChild(document.createTextNode('MP4 1080p (Full-HD)'));
			listLink.appendChild(listSpan);
			listItem.appendChild(listLink);
			listItems.appendChild(listItem);

		}
        var listItem = document.createElement('li');
        var listLink = document.createElement('a');
        listLink.setAttribute('style', 'text-decoration:none;');
        listLink.setAttribute('href', 'https://bvd2.nl/download/direct/aac.php?url=' + videoID);
        listLink.setAttribute('target', '_blank');
        var listSpan = document.createElement('span');
        listSpan.setAttribute('class', 'yt-uix-button-menu-item');
        listSpan.setAttribute('id', LISTITEM_ID + '-aac');
        listSpan.appendChild(document.createTextNode('AAC'));
        listLink.appendChild(listSpan);
        listItem.appendChild(listLink);
        listItems.appendChild(listItem);
        var listItem = document.createElement('li');
        var listLink = document.createElement('a');
        listLink.setAttribute('style', 'text-decoration:none;');
        listLink.setAttribute('href', 'https://bvd2.nl/download/direct/mp3.php?url=' + videoID);
        listLink.setAttribute('target', '_blank');
        var listSpan = document.createElement('span');
        listSpan.setAttribute('class', 'yt-uix-button-menu-item');
        listSpan.setAttribute('id', LISTITEM_ID + '-mp3');
        listSpan.appendChild(document.createTextNode('MP3 (128 Kbps)'));
        listLink.appendChild(listSpan);
        listItem.appendChild(listLink);
        listItems.appendChild(listItem);
        var listItem = document.createElement('li');
        var listLink = document.createElement('a');
        listLink.setAttribute('style', 'text-decoration:none;');
        listLink.setAttribute('href', 'https://bvd2.nl/download/direct/mp3hq.php?url=' + videoID);
        listLink.setAttribute('target', '_blank');
        var listSpan = document.createElement('span');
        listSpan.setAttribute('class', 'yt-uix-button-menu-item');
        listSpan.setAttribute('id', LISTITEM_ID + '-mp3hq');
        listSpan.appendChild(document.createTextNode('MP3 (192 Kbps)'));
        listLink.appendChild(listSpan);
        listItem.appendChild(listLink);
        listItems.appendChild(listItem);
        var listItem = document.createElement('li');
        var listLink = document.createElement('a');
        listLink.setAttribute('style', 'text-decoration:none;');
        listLink.setAttribute('href', 'https://bvd2.nl/download/direct/m4a.php?url=' + videoID);
        listLink.setAttribute('target', '_blank');
        var listSpan = document.createElement('span');
        listSpan.setAttribute('class', 'yt-uix-button-menu-item');
        listSpan.setAttribute('id', LISTITEM_ID + '-m4a');
        listSpan.appendChild(document.createTextNode('M4A (Best Quality)'));
        listLink.appendChild(listSpan);
        listItem.appendChild(listLink);
        listItems.appendChild(listItem);
        var listItem = document.createElement('li');
        var listLink = document.createElement('a');
        listLink.setAttribute('style', 'text-decoration:none;');
        var thumbID = 'vi/' + videoID + '/hqdefault.jpg';
        listLink.setAttribute('href', 'https://img.youtube.com/' + thumbID);
        listLink.setAttribute('target', '_blank');
        listLink.setAttribute('download', 'https://img.youtube.com/' + thumbID);
        var listSpan = document.createElement('span');
        listSpan.setAttribute('class', 'yt-uix-button-menu-item');
        listSpan.setAttribute('id', LISTITEM_ID + '-thumbnail');
        listSpan.setAttribute('title', 'Contact to get support, Bug Report or Suggestion');
        listSpan.appendChild(document.createTextNode('Thumbnail'));
        listLink.appendChild(listSpan);
        listItem.appendChild(listLink);
        listItems.appendChild(listItem);
        var listItem = document.createElement('li');
        var listLink = document.createElement('a');
        listLink.setAttribute('style', 'text-decoration:none;');
        listLink.setAttribute('href', 'https://bvd2.nl/download/direct/subtitle.php?url=' + videoID);
        listLink.setAttribute('target', '_blank');
        var listSpan = document.createElement('span');
        listSpan.setAttribute('class', 'yt-uix-button-menu-item');
        listSpan.setAttribute('id', LISTITEM_ID + '-sub');
        listSpan.appendChild(document.createTextNode('Subtitle'));
        listLink.appendChild(listSpan);
        listItem.appendChild(listLink);
        listItems.appendChild(listItem);
        var listItem = document.createElement('li');
        var listLink = document.createElement('a');
        listLink.setAttribute('style', 'text-decoration: underline overline; margin-left: 1px; color: #1b7fcc;');
        listLink.setAttribute('href', 'https://bvd2.nl/support?ver=' + version);
        listLink.setAttribute('target', '_blank');
        var listSpan = document.createElement('span');
        listSpan.setAttribute('class', 'yt-uix-button-menu-item');
        listSpan.setAttribute('id', LISTITEM_ID + '-support');
        listSpan.setAttribute('title', 'Contact to get support, Bug Report or Suggestion');
        listSpan.appendChild(document.createTextNode('Contact/Help/Donate'));
        listLink.appendChild(listSpan);
        listItem.appendChild(listLink);
        listItems.appendChild(listItem);
        mainSpan.appendChild(listItems);
        var buttonElement = document.createElement('button');
        buttonElement.setAttribute('id', BUTTON_ID);
        if (newWatchPage) {
            buttonElement.setAttribute('class', 'yt-uix-button  yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip yt-uix-button-active');
        } else {
            buttonElement.setAttribute('class', 'yt-uix-button yt-uix-tooltip yt-uix-button-empty yt-uix-button-text');
            buttonElement.setAttribute('style', 'margin-top:4px; margin-left:' + ((textDirection == 'left') ? 5 : 10) + 'px;');
        }
        buttonElement.setAttribute('data-tooltip-text', buttonLabel);
        buttonElement.setAttribute('type', 'button');
        buttonElement.setAttribute('role', 'button');
        buttonElement.addEventListener('click', function() {
            var frm_div = document.getElementById('EXT_DIV');
            if (frm_div) {
                frm_div.parentElement.removeChild(frm_div);
            }
            return false;
        }, false);
        buttonElement.appendChild(mainSpan);
        var containerSpan = document.createElement('span');
        containerSpan.setAttribute('id', CONTAINER_ID);
        containerSpan.appendChild(document.createTextNode(' '));
        containerSpan.appendChild(buttonElement);
        if (!newWatchPage) {
            parentElement.appendChild(containerSpan);
        } else {
            parentElement.insertBefore(containerSpan, parentElement.firstChild);
        }
        for (var i = 0; i < downloadCodeList.length; i++) {
            addFileSize(downloadCodeList[i].url, downloadCodeList[i].format);
        }

        if (typeof GM_download !== 'undefined') {
            for (var i = 0; i < downloadCodeList.length; i++) {
                var downloadFMT = document.getElementById(LISTITEM_ID + downloadCodeList[i].format);
                var url = (downloadCodeList[i].url).toLowerCase();
                if (url.indexOf('clen=') > 0 && url.indexOf('dur=') > 0 && url.indexOf('gir=') > 0 &&
                    url.indexOf('lmt=') > 0) {
                    downloadFMT.addEventListener('click', downloadVideoNatively, false);
                }
            }
        }

        addFromManifest();

        function downloadVideoNatively(e) {
            var elem = e.currentTarget;
            e.returnValue = false;
            if (e.preventDefault) {
                e.preventDefault();
            }
            var loop = elem.getAttribute('loop');
            if (loop) {
                GM_download(downloadCodeList[loop].url, videoTitle + '.' + FORMAT_TYPE[downloadCodeList[loop].format]);
            }
            return false;
        }

        function addFromManifest() { // add Dash URLs from manifest file
            var formats = ['137', '138', '140']; // 137=1080p, 138=4k, 140=m4a
            var isNecessary = true;
            for (var i = 0; i < formats.length; i++) {
                if (videoURL[formats[i]]) {
                    isNecessary = false;
                    break;
                }
            }
            if (videoManifestURL && SHOW_DASH_FORMATS && isNecessary) {
                var matchSig = findMatch(videoManifestURL, /\/s\/([a-zA-Z0-9\.]+)\//i);
                if (matchSig) {
                    var decryptedSig = decryptSignature(matchSig);
                    if (decryptedSig) {
                        videoManifestURL = videoManifestURL.replace('/s/' + matchSig + '/', '/signature/' + decryptedSig + '/');
                    }
                }
                if (videoManifestURL.indexOf('//') == 0) {
                    var protocol = (document.location.protocol == 'http:') ? 'http:' : 'https:';
                    videoManifestURL = protocol + videoManifestURL;
                }
                debug('DYVAM - Info: manifestURL ' + videoManifestURL);
                crossXmlHttpRequest({
                    method: 'GET',
                    url: videoManifestURL, // check if URL exists
                    onload: function(response) {
                        if (response.readyState === 4 && response.status === 200 && response.responseText) {
                            debug('DYVAM - Info: maniestFileContents ' + response.responseText);
                            var lastFormatFromList = downloadCodeList[downloadCodeList.length - 1].format;
                            debug('DYVAM - Info: lastformat: ' + lastFormatFromList);
                            for (var i = 0; i < formats.length; i++) {
                                k = formats[i];
                                if (videoURL[k] || showFormat[k] == false) continue;
                                var regexp = new RegExp('<BaseURL>(http[^<]+itag\\/' + k + '[^<]+)<\\/BaseURL>', 'i');
                                var matchURL = findMatch(response.responseText, regexp);
                                debug('DYVAM - Info: matchURL itag= ' + k + ' url= ' + matchURL);
                                if (!matchURL) continue;
                                matchURL = matchURL.replace(/&amp\;/g, '&');
                                // ...
                                downloadCodeList.push({
                                    url: matchURL,
                                    sig: videoSignature[k],
                                    format: k,
                                    label: FORMAT_LABEL[k]
                                });
                                var downloadFMT = document.getElementById(LISTITEM_ID + lastFormatFromList);
                                var clone = downloadFMT.parentNode.parentNode.cloneNode(true);
                                clone.firstChild.firstChild.setAttribute('id', LISTITEM_ID + k);
                                clone.firstChild.setAttribute('href', matchURL);
                                downloadFMT.parentNode.parentNode.parentNode.appendChild(clone);
                                downloadFMT = document.getElementById(LISTITEM_ID + k);
                                downloadFMT.firstChild.nodeValue = FORMAT_LABEL[k];
                                addFileSize(matchURL, k);
                                lastFormatFromList = k;
                            }
                        }
                    }
                });
            }
        }

        function injectStyle(code) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(code));
            document.getElementsByTagName('head')[0].appendChild(style);
        }

        function injectScript(code) {
            var script = document.createElement('script');
            script.type = 'application/javascript';
            script.textContent = code;
            document.body.appendChild(script);
            document.body.removeChild(script);
        }

        function debug(str) {
            var debugElem = document.getElementById(DEBUG_ID);
            if (!debugElem) {
                debugElem = createHiddenElem('div', DEBUG_ID);

            }
            debugElem.appendChild(document.createTextNode(str + ' '));
        }

        function createHiddenElem(tag, id) {
            var elem = document.createElement(tag);
            elem.setAttribute('id', id);
            elem.setAttribute('style', 'display:none;');
            document.body.appendChild(elem);
            return elem;
        }

        function fixTranslations(language, textDirection) {
            if (/^af|bg|bn|ca|cs|de|el|es|et|eu|fa|fi|fil|fr|gl|hi|hr|hu|id|it|iw|kn|lv|lt|ml|mr|ms|nl|pl|ro|ru|sl|sk|sr|sw|ta|te|th|uk|ur|vi|zu$/.test(language)) {
                var likeButton = document.getElementById('watch-like');
                if (likeButton) {
                    var spanElements = likeButton.getElementsByClassName('yt-uix-button-content');
                    if (spanElements) {
                        spanElements[0].style.display = 'none';
                    }
                }
                var marginPixels = 10;
                if (/^bg|ca|cs|el|eu|hr|it|ml|ms|pl|sl|sw|te$/.test(language)) {
                    marginPixels = 1;
                }
                injectStyle('#watch7-secondary-actions .yt-uix-button{margin-' + textDirection + ':' + marginPixels + 'px!important}');
            }
        }

        function findMatch(text, regexp) {
            var matches = text.match(regexp);
            return (matches) ? matches[1] : null;
        }

        function isString(s) {
            return (typeof s === 'string' || s instanceof String);
        }

        function isInteger(n) {
            return (typeof n === 'number' && n % 1 == 0);
        }

        function absoluteURL(url) {
            var link = document.createElement('a');
            link.href = url;
            return link.href;
        }

        function getPref(name) {
            var a = '',
                b = '';
            try {
                a = typeof GM_getValue.toString;
                b = GM_getValue.toString()
            } catch (e) {}
            if (typeof GM_getValue === 'function' &&
                (a === 'undefined' || b.indexOf('not supported') === -1)) {
                return GM_getValue(name, null);
            } else {
                var ls = null;
                try {
                    ls = window.localStorage || null
                } catch (e) {}
                if (ls) {
                    return ls.getItem(name);
                }
            }
            return;
        }

        function setPref(name, value) {
            var a = '',
                b = '';
            try {
                a = typeof GM_setValue.toString;
                b = GM_setValue.toString()
            } catch (e) {}
            if (typeof GM_setValue === 'function' &&
                (a === 'undefined' || b.indexOf('not supported') === -1)) {
                GM_setValue(name, value);
            } else {
                var ls = null;
                try {
                    ls = window.localStorage || null
                } catch (e) {}
                if (ls) {
                    return ls.setItem(name, value);
                }
            }
        }

        function crossXmlHttpRequest(details) {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest(details);
            } else if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined' &&
                typeof opera.extension.postMessage !== 'undefined') {
                var index = operaTable.length;
                opera.extension.postMessage({
                    'action': 'xhr-' + index,
                    'url': details.url,
                    'method': details.method
                });
                operaTable[index] = details;
            } else if (typeof window.opera === 'undefined' && typeof XMLHttpRequest === 'function') {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (details['onload']) {
                            details['onload'](xhr);
                        }
                    }
                }
                xhr.open(details.method, details.url, true);
                xhr.send();
            }
        }

        function addFileSize(url, format) {

            function updateVideoLabel(size, format) {
                var elem = document.getElementById(LISTITEM_ID + format);
                if (elem) {
                    size = parseInt(size, 10);
                    if (size >= 1073741824) {
                        size = parseFloat((size / 1073741824).toFixed(1)) + ' GB';
                    } else if (size >= 1048576) {
                        size = parseFloat((size / 1048576).toFixed(1)) + ' MB';
                    } else {
                        size = parseFloat((size / 1024).toFixed(1)) + ' KB';
                    }
                    if (elem.childNodes.length > 1) {
                        elem.lastChild.nodeValue = ' (' + size + ')';
                    } else if (elem.childNodes.length == 1) {
                        elem.appendChild(document.createTextNode(' (' + size + ')'));
                    }
                }
            }

            var matchSize = findMatch(url, /[&\?]clen=([0-9]+)&/i);
            if (matchSize) {
                updateVideoLabel(matchSize, format);
            } else {
                try {
                    crossXmlHttpRequest({
                        method: 'HEAD',
                        url: url,
                        onload: function(response) {
                            if (response.readyState == 4 && response.status == 200) {
                                var size = 0;
                                if (typeof response.getResponseHeader === 'function') {
                                    size = response.getResponseHeader('Content-length');
                                } else if (response.responseHeaders) {
                                    var regexp = new RegExp('^Content\-length: (.*)$', 'im');
                                    var match = regexp.exec(response.responseHeaders);
                                    if (match) {
                                        size = match[1];
                                    }
                                }
                                if (size) {
                                    updateVideoLabel(size, format);
                                }
                            }
                        }
                    });
                } catch (e) {}
            }
        }

        function findSignatureCode(sourceCode) {
            debug('DYVAM - Info: signature start ' + getPref(STORAGE_CODE));
            var signatureFunctionName =
                findMatch(sourceCode,
                    /\.set\s*\("signature"\s*,\s*([a-zA-Z0-9_$][\w$]*)\(/) ||
                findMatch(sourceCode,
                    /\.sig\s*\|\|\s*([a-zA-Z0-9_$][\w$]*)\(/) ||
                findMatch(sourceCode,
                    /\.signature\s*=\s*([a-zA-Z_$][\w$]*)\([a-zA-Z_$][\w$]*\)/);
            if (signatureFunctionName == null) return setPref(STORAGE_CODE, 'error');
            signatureFunctionName = signatureFunctionName.replace('$', '\\$');
            var regCode = new RegExp(signatureFunctionName + '\\s*=\\s*function' +
                '\\s*\\([\\w$]*\\)\\s*{[\\w$]*=[\\w$]*\\.split\\(""\\);\n*(.+);return [\\w$]*\\.join');
            var regCode2 = new RegExp('function \\s*' + signatureFunctionName +
                '\\s*\\([\\w$]*\\)\\s*{[\\w$]*=[\\w$]*\\.split\\(""\\);\n*(.+);return [\\w$]*\\.join');
            var functionCode = findMatch(sourceCode, regCode) || findMatch(sourceCode, regCode2);
            debug('DYVAM - Info: signaturefunction ' + signatureFunctionName + ' -- ' + functionCode);
            if (functionCode == null) return setPref(STORAGE_CODE, 'error');

            var reverseFunctionName = findMatch(sourceCode,
                /([\w$]*)\s*:\s*function\s*\(\s*[\w$]*\s*\)\s*{\s*(?:return\s*)?[\w$]*\.reverse\s*\(\s*\)\s*}/);
            debug('DYVAM - Info: reversefunction ' + reverseFunctionName);
            if (reverseFunctionName) reverseFunctionName = reverseFunctionName.replace('$', '\\$');
            var sliceFunctionName = findMatch(sourceCode,
                /([\w$]*)\s*:\s*function\s*\(\s*[\w$]*\s*,\s*[\w$]*\s*\)\s*{\s*(?:return\s*)?[\w$]*\.(?:slice|splice)\(.+\)\s*}/);
            debug('DYVAM - Info: slicefunction ' + sliceFunctionName);
            if (sliceFunctionName) sliceFunctionName = sliceFunctionName.replace('$', '\\$');

            var regSlice = new RegExp('\\.(?:' + 'slice' + (sliceFunctionName ? '|' + sliceFunctionName : '') +
                ')\\s*\\(\\s*(?:[a-zA-Z_$][\\w$]*\\s*,)?\\s*([0-9]+)\\s*\\)');
            var regReverse = new RegExp('\\.(?:' + 'reverse' + (reverseFunctionName ? '|' + reverseFunctionName : '') +
                ')\\s*\\([^\\)]*\\)');
            var regSwap = new RegExp('[\\w$]+\\s*\\(\\s*[\\w$]+\\s*,\\s*([0-9]+)\\s*\\)');
            var regInline = new RegExp('[\\w$]+\\[0\\]\\s*=\\s*[\\w$]+\\[([0-9]+)\\s*%\\s*[\\w$]+\\.length\\]');
            var functionCodePieces = functionCode.split(';');
            var decodeArray = [];
            for (var i = 0; i < functionCodePieces.length; i++) {
                functionCodePieces[i] = functionCodePieces[i].trim();
                var codeLine = functionCodePieces[i];
                if (codeLine.length > 0) {
                    var arrSlice = codeLine.match(regSlice);
                    var arrReverse = codeLine.match(regReverse);
                    debug(i + ': ' + codeLine + ' --' + (arrSlice ? ' slice length ' + arrSlice.length : '') + ' ' + (arrReverse ? 'reverse' : ''));
                    if (arrSlice && arrSlice.length >= 2) {
                        var slice = parseInt(arrSlice[1], 10);
                        if (isInteger(slice)) {
                            decodeArray.push(-slice);
                        } else return setPref(STORAGE_CODE, 'error');
                    } else if (arrReverse && arrReverse.length >= 1) {
                        decodeArray.push(0);
                    } else if (codeLine.indexOf('[0]') >= 0) {
                        if (i + 2 < functionCodePieces.length &&
                            functionCodePieces[i + 1].indexOf('.length') >= 0 &&
                            functionCodePieces[i + 1].indexOf('[0]') >= 0) {
                            var inline = findMatch(functionCodePieces[i + 1], regInline);
                            inline = parseInt(inline, 10);
                            decodeArray.push(inline);
                            i += 2;
                        } else return setPref(STORAGE_CODE, 'error');
                    } else if (codeLine.indexOf(',') >= 0) {
                        var swap = findMatch(codeLine, regSwap);
                        swap = parseInt(swap, 10);
                        if (isInteger(swap) && swap > 0) {
                            decodeArray.push(swap);
                        } else return setPref(STORAGE_CODE, 'error');
                    } else return setPref(STORAGE_CODE, 'error');
                }
            }

            if (decodeArray) {
                setPref(STORAGE_URL, scriptURL);
                setPref(STORAGE_CODE, decodeArray.toString());
                DECODE_RULE = decodeArray;
                debug('DYVAM - Info: signature ' + decodeArray.toString() + ' ' + scriptURL);
                for (var i = 0; i < downloadCodeList.length; i++) {
                    var elem = document.getElementById(LISTITEM_ID + downloadCodeList[i].format);
                    var url = downloadCodeList[i].url;
                    var sig = downloadCodeList[i].sig;
                    if (elem && url && sig) {
                        url = url.replace(/\&signature=[\w\.]+/, '&signature=' + decryptSignature(sig));
                        elem.parentNode.setAttribute('href', url);
                        addFileSize(url, downloadCodeList[i].format);
                    }
                }
            }
        }

        function isValidSignatureCode(arr) {
            if (!arr) return false;
            if (arr == 'error') return true;
            arr = arr.split(',');
            for (var i = 0; i < arr.length; i++) {
                if (!isInteger(parseInt(arr[i], 10))) return false;
            }
            return true;
        }

        function fetchSignatureScript(scriptURL) {
            var storageURL = getPref(STORAGE_URL);
            var storageCode = getPref(STORAGE_CODE);
            if (!(/,0,|^0,|,0$|\-/.test(storageCode))) storageCode = null;
            if (storageCode && isValidSignatureCode(storageCode) && storageURL &&
                scriptURL == absoluteURL(storageURL)) return;
            try {
                debug('DYVAM fetch ' + scriptURL);
                isSignatureUpdatingStarted = true;
                crossXmlHttpRequest({
                    method: 'GET',
                    url: scriptURL,
                    onload: function(response) {
                        debug('DYVAM fetch status ' + response.status);
                        if (response.readyState === 4 && response.status === 200 && response.responseText) {
                            findSignatureCode(response.responseText);
                        }
                    }
                });
            } catch (e) {}
        }

        function getDecodeRules(rules) {
            var storageCode = getPref(STORAGE_CODE);
            if (storageCode && storageCode != 'error' && isValidSignatureCode(storageCode)) {
                var arr = storageCode.split(',');
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = parseInt(arr[i], 10);
                }
                rules = arr;
                debug('DYVAM - Info: signature ' + arr.toString() + ' ' + scriptURL);
            }
            return rules;
        }

        function decryptSignature(sig) {
            function swap(a, b) {
                var c = a[0];
                a[0] = a[b % a.length];
                a[b] = c;
                return a
            };

            function decode(sig, arr) {
                if (!isString(sig)) return null;
                var sigA = sig.split('');
                for (var i = 0; i < arr.length; i++) {
                    var act = arr[i];
                    if (!isInteger(act)) return null;
                    sigA = (act > 0) ? swap(sigA, act) : ((act == 0) ? sigA.reverse() : sigA.slice(-act));
                }
                var result = sigA.join('');
                return result;
            }

            if (sig == null) return '';
            var arr = DECODE_RULE;
            if (arr) {
                var sig2 = decode(sig, arr);
                if (sig2) return sig2;
            } else {
                setPref(STORAGE_URL, '');
                setPref(STORAGE_CODE, '');
            }
            return sig;
        }

    }

})();