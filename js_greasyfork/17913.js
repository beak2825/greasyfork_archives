// ==UserScript==
// @name        Lazy Embedded Video
// @namespace   zeusex81@gmail.com
// @description Lazy load embedded videos from Youtube/Dailymotion/Vimeo/Rutube/Twitch/Coub/Rumble
// @version     4.3
// @include     *
// @icon        https://i.imgur.com/rf0mFDM.png
// @license     MIT
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/17913/Lazy%20Embedded%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/17913/Lazy%20Embedded%20Video.meta.js
// ==/UserScript==

(async function() {
    var a = document.createElement("A");
    try      { a.href = top.location.href; }
    catch(e) { a.href = document.referrer || location.href; }
    if(a.hostname && /(youtube|dailymotion|vimeo|rutube|twitch|coub|rumble)\.[^.]+$/.test(a.hostname))
        return;
    var getValue = typeof(GM) != "undefined" ? GM.getValue : typeof(GM_getValue) != "undefined" ? GM_getValue :
                                 function(name, value) { return localStorage.getItem(name) || value; };
    var setValue = typeof(GM) != "undefined" ? GM.setValue : typeof(GM_setValue) != "undefined" ? GM_setValue :
                                 function(name, value) { localStorage.setItem(name, value); };

    var settings = JSON.parse(await getValue("zeusLEV", '[false,true,[]]'));
    while(typeof(settings) == "string") settings = JSON.parse(settings);
    if(settings[2].includes(location.hostname))
        return;

    var listener = false;
    var createListener = function() {
        if(listener) return;
        listener = true;
        window.addEventListener("message", async function(e) {
            if(!e.data.startsWith("lazyVideo")) return;
            var data = e.data.split(' ');
            switch(data[1]) {
            case "CSP"      : iframes[parseInt(data[2])].dataset.lazyVideo = 3; break;
            case "play"     : iframes[parseInt(data[2])].removeAttribute("srcdoc");
                              iframes[parseInt(data[2])].src = data[3];         break;
            case "settings" :
                settings = JSON.parse(await getValue("zeusLEV", '[false,true,[]]'));
                while(typeof(settings) == "string") settings = JSON.parse(settings);
                switch(data[2]) {
                case "autoplay"  : settings[0] = data[3] == 'true'; break;
                case "flash"     : settings[1] = data[3] == 'true'; break;
                case "reset"     : settings[2] = [];                break;
                case "whitelist" :
                    observer.disconnect();
                    cancelAnimationFrame(animation);
                    if(!settings[2].includes(location.hostname))
                        settings[2].push(location.hostname);
                    for(var i = 0; i < iframes.length; i++)
                        iframes[i].removeAttribute("srcdoc");
                    break;
                }
                setValue("zeusLEV", JSON.stringify(settings));
                break;
            }
        });
    }

    var html, iframes = [];
    var createHtml = function(url, src, api, background_img) {
        /(.*\/\/(?:[^.\/]+\.)?([^.\/]+)\.[^.\/]+)\//i.test(url);
        var provider_url = RegExp.$1, provider_name = RegExp.$2, data_convert = "", button_color = "";
        if(api) api += '&callback=jsonpCallback';
        switch(provider_name) {
        case "youtube" :
            button_color  = "#c22";
            data_convert += 'data = {'+
                                'thumbnail_url: (data.items[0].snippet.thumbnails.maxres || data.items[0].snippet.thumbnails.standard || '+
                                                'data.items[0].snippet.thumbnails.high   || data.items[0].snippet.thumbnails.medium   || '+
                                                'data.items[0].snippet.thumbnails.default).url,'+
                                'title:          data.items[0].snippet.title,'+
                                'author_url:     "https://www.youtube.com/channel/"+data.items[0].snippet.channelId,'+
                                'author_name:    data.items[0].snippet.channelTitle,'+
                                'duration:       data.items[0].contentDetails ? /PT(\\d+H)?(\\d+M)?(\\d+S)?/i.test(data.items[0].contentDetails.duration) && '+
                                                '(parseInt(RegExp.$1||0)*3600+parseInt(RegExp.$2||0)*60+parseInt(RegExp.$3||0)) || "LIVE" : "PLAYLIST"'+
                            '};';
            break;
        case "dailymotion" :
            button_color  = "#fd5";
            data_convert += 'data.author_url  = data["owner.url"];'+
                            'data.author_name = data["owner.screenname"];'+
                            'if(!data.duration) data.duration = "LIVE";';
            break;
        case "vimeo" :
            button_color  = "#5af";
            data_convert += 'if(data.thumbnail_url) data.thumbnail_url = data.thumbnail_url.replace(/_\\d+x\\d+/i, "");';
            break;
        case "rutube" :
            button_color  = "#444";
            data_convert += 'if(data.thumbnail_url) data.thumbnail_url = data.thumbnail_url.replace(/\\?.+/i, "");';
            break;
        case "twitch" :
            button_color  = "#548";
            break;
        case "coub" :
            button_color  = "#04f";
            data_convert += 'if(data.channel_url) data.author_url = data.channel_url;';
            break;
        case "rumble" :
            button_color  = "#8c4";
            break;
        }
        if(!html) html = [
            '<!doctype html>'+
            '<html>'+
                '<head>'+
                    '<title>Lazy Embedded Video</title>'+
                    '<style>'+
                        'html { height:100%; } '+
                        'body { margin:0; height:100%; color:white; font:14px sans-serif; '+
                               '--thumbnail_url:', background_img, '; background:black var(--thumbnail_url) center/100% no-repeat; } '+
                        'a { color:inherit; font-weight:bold; text-decoration:none; } '+
                        'a:hover { text-decoration:underline; } '+
                        '#interface { position:absolute; width:100%; height:100%; overflow:hidden; opacity:0.9; '+
                        '-moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none; } '+
                        '#playButton { display:flex; height:100%; cursor:pointer; } '+
                        '#playButton > div { width:70px; height:70px; margin:auto; border-radius:50%; background-color:black; } '+
                        '#playButton:hover > div { background-color:', button_color, '; } '+
                        '#playButton > div > div { width:0; height:0; margin:20px 0 0 25px; border:solid transparent; '+
                                                  'border-width:14px 0px 14px 28px; border-left-color:white; } '+
                        '#infobar { position:absolute; top:0px; width:100%; height:32px; display:flex; '+
                        'box-sizing:border-box; background:black; border:0px solid grey; border-bottom-width:1px; } '+
                            '#author, #title, #duration { overflow:hidden; white-space:nowrap; margin:auto 8px; } '+
                            '#author { flex-shrink:0; max-width:30%; color:', button_color ,'; } '+
                            '#space { flex-grow:1; } '+
                            '#duration { flex-shrink:0; } '+
                        '#settingsButton { flex-basis:32px; flex-shrink:0; font:bold 20px sans-serif; text-align:center; cursor:pointer; } '+
                        '#settingsButton:hover { color:', button_color, '; } '+
                        '#settingsButton.active { background-color:', button_color, '; color:black; } '+
                        '#settingsPanel { position:absolute; right:0px; top:31px; max-height:100%; margin:0px; list-style:none; padding:8px; '+
                        'border:solid grey; border-width:0px 0px 1px 1px; background-color:', button_color ,'; color:black; cursor:default; visibility:hidden; } '+
                        '#settingsPanel.active { visibility:visible; } '+
                            '#settingsPanel label { display:inline-block; width:144px; vertical-align:top; } '+
                            '#settingsPanel button { width:100%; }'+
                    '</style>'+
                '</head>'+
                '<body>'+
                    '<div id=interface>'+
                        '<div id=playButton><div><div></div></div></div>'+
                        '<div id=infobar>'+
                            '<a id=author target=_blank onmouseenter="this.title = this.scrollWidth > this.clientWidth ? this.textContent : \'\';" href="', provider_url, '">', provider_name, '</a>'+
                            '<a id=title  target=_blank onmouseenter="this.title = this.scrollWidth > this.clientWidth ? this.textContent : \'\';" href="', url, '">', url, '</a>'+
                            '<div id=space></div>'+
                            '<span id=settingsButton>⚙</span>'+
                        '</div>'+
                        '<ul id=settingsPanel>'+
                            '<li><label>Allow autoplay:</label><input class=setting type=checkbox', '', '></li>'+
                            '<li><label>Legacy Flash support:</label><input class=setting type=checkbox', '', '></li>'+
                            '<li><button class=setting>Whitelist this site</button>'+
                            '<li><button class=setting>Clear whitelist</button>'+
                        '</ul>'+
                    '</div>'+
                    '<script>'+
                        'parent.postMessage("lazyVideo CSP ', iframes.length, '", "'+location.href+'");'+
                        'document.getElementById("playButton").onclick = function() {'+
                            'parent.postMessage("lazyVideo play ', iframes.length, ' ', src, '", "'+location.href+'");'+
                        '};'+
                        'var settingsButton = document.getElementById("settingsButton");'+
                        'var settingsPanel  = document.getElementById("settingsPanel");'+
                        'settingsButton.onclick = function() {'+
                            'settingsButton.classList.toggle("active");'+
                            'settingsPanel.classList.toggle("active");'+
                        '};'+
                        '[].slice.call(settingsPanel.getElementsByClassName("setting")).forEach(function(e, i) {'+
                            'switch(i) {'+
                            'case 0: e.onchange = function() { parent.postMessage("lazyVideo settings autoplay "+e.checked, "'+location.href+'"); }; break;'+
                            'case 1: e.onchange = function() { parent.postMessage("lazyVideo settings flash "+e.checked   , "'+location.href+'"); }; break;'+
                            'case 2: e.onclick  = function() { parent.postMessage("lazyVideo settings whitelist"          , "'+location.href+'"); }; break;'+
                            'case 3: e.onclick  = function() { parent.postMessage("lazyVideo settings reset"              , "'+location.href+'"); }; break;'+
                            '}'+
                        '});'+
                        'function removeProtocol(url) { return url.replace(/^[a-z]+:/i, ""); }'+
                        'function jsonpCallback(data) {',
                            data_convert,
                            'if(data.thumbnail_url) document.body.style.setProperty("--thumbnail_url", "url("+data.thumbnail_url+")");'+
                            'if(data.thumbnail_url) document.body.style.setProperty("--darkreader-bgimg--thumbnail_url", "url("+data.thumbnail_url+")");'+
                            'if(data.url)           document.getElementById("title").href         = removeProtocol(data.url);'+
                            'if(data.title)         document.getElementById("title").textContent  = data.title;'+
                            'if(data.author_url)    document.getElementById("author").href        = removeProtocol(data.author_url);'+
                            'if(data.author_name)   document.getElementById("author").textContent = data.author_name;'+
                            'if(data.duration)      document.getElementById("space").insertAdjacentHTML("afterend",'+
                                '"<div id=duration>"+(Number(data.duration) ? new Date(data.duration*1000).toISOString().substr(11,8) : data.duration)+"</div>");'+
                        '}'+
                    '</script>'+
                    '<script id=api src="', api, '"></script>'+
                '</body>'+
            '</html>'
        ];
        html[ 1] = background_img || 'none';
        html[ 3] = button_color;
        html[ 5] = button_color;
        html[ 7] = button_color;
        html[ 9] = button_color;
        html[11] = button_color;
        html[13] = provider_url;
        html[15] = provider_name;
        html[17] = url;
        html[19] = url;
        html[21] = settings[0] ? ' checked' : '';
        html[23] = settings[1] ? ' checked' : '';
        html[25] = iframes.length;
        html[27] = iframes.length;
        html[29] = src;
        html[31] = data_convert;
        html[33] = api;
    };

    var createOembed  = function(api, url) { return api+encodeURIComponent(url); };
    // var createNOembed = function(api, url) { return createOembed("https://noembed.com/embed?url=", url); };
    var createJOembed = function(api, url) { return createOembed("https://json2jsonp.com/?url=", createOembed(api, url)); };

    var createLazyVideo = function(elem) {
        var id, args = "", url, src = a.href = elem.src || elem.data || elem.dataset.src;
        if(!a.hostname || elem.dataset.lazyVideo) return;
        elem.dataset.lazyVideo = 1;
        switch(a.hostname.match(/([^.]+)\.[^.]+$/)[1]) {
        case "youtube" :
        case "youtube-nocookie" :
            if(/\/(?:p\/|embed\/videoseries)([^&]*)/i.test(a.pathname)) {
                id = RegExp.$1 || (/[?&]list=([^&]+)/i.test(a.search) && RegExp.$1);
                if(!id || (settings[0] && a.search.includes("autoplay=1"))) return;
                if(/[?&](v=[^&]+)/i.test(a.search))     args += "&"+RegExp.$1;
                if(/[?&](index=[^&]+)/i.test(a.search)) args += "&"+RegExp.$1;
                if(/[?&](start=[^&]+)/i.test(a.search)) args += "&"+RegExp.$1;
                createHtml(
                    url = /[?&]v=([^&]+)/i.test(a.search) ? "https://www.youtube.com/watch?list="+id+args : "https://www.youtube.com/playlist?list="+id,
                    src = "https://www.youtube-nocookie.com/embed/videoseries?autoplay=1&list="+id+args,
                    "https://www.googleapis.com/youtube/v3/playlists?part=snippet&fields=items/snippet(channelId,title,thumbnails,channelTitle)&key=AIzaSyBJ-o6n51GQ6jEqjvEN0bI1KdX5CHZQy5E&id="+id,
                    /[?&]v=([^&]+)/i.test(a.search) ? "url(https://i.ytimg.com/vi/"+RegExp.$1+"/hqdefault.jpg)" : null
                );
            } else {
                if(/\/(?:v|embed)\/([^&]*)/i.test(a.pathname)) id = RegExp.$1 || (/[?&]v=([^&]+)/i.test(a.search) && RegExp.$1);
                if(!id || (settings[0] && a.search.includes("autoplay=1"))) return;
                if(/[?&](start=[^&]+)/i.test(a.search)) args += "&"+RegExp.$1;
                createHtml(
                    url = "https://www.youtube.com/watch?v="+id+args,
                    src = "https://www.youtube-nocookie.com/embed/"+id+"?autoplay=1"+args,
                    // createNOembed("https://www.youtube.com/oembed?format=json&url=", url),
                    "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&fields=items(snippet(channelId,title,thumbnails,channelTitle),contentDetails/duration)&key=AIzaSyBJ-o6n51GQ6jEqjvEN0bI1KdX5CHZQy5E&id="+id,
                    "url(https://i.ytimg.com/vi/"+id+"/hqdefault.jpg)"
                );
            }
            break;
        case "dailymotion" :
            if(/\/(?:swf|embed)\/(?:video\/)?([^&_]+)/i.test(a.pathname)) id = RegExp.$1;
            if(!id || (settings[0] && a.search.includes("autoplay=1"))) return;
            // if(/[?&](mute=[^&]+)/i.test(a.search))  args += "&"+RegExp.$1;
            if(/[?&](start=[^&]+)/i.test(a.search)) args += "&"+RegExp.$1;
            createHtml(
                url = "https://www.dailymotion.com/video/"+id+"?"+args,
                src = "https://www.dailymotion.com/embed/video/"+id+"?autoplay=1"+args,
                // createOembed("https://www.dailymotion.com/services/oembed?format=json&url=", url),
                "https://api.dailymotion.com/video/"+id+"?fields=owner.screenname,owner.url,title,url,duration,thumbnail_url",
                "url(https://www.dailymotion.com/thumbnail/video/"+id+")"
            );
            break;
        case "vimeo" :
            if(/\/(?:moogaloop\.swf|video\/)([^&]*)/i.test(a.pathname))
                id = RegExp.$1 || (/[?&]clip_id=([^&]+)/i.test(a.search) && RegExp.$1);
            if(!id || (settings[0] && a.search.includes("autoplay=1"))) return;
            if(/[?&](loop=[^&]+)/i.test(a.search))  args += "&"+RegExp.$1;
            if(/(\#t=[\dhms]+)/i.test(a.hash))      args += RegExp.$1;
            createHtml(
                url = "https://vimeo.com/"+id+"?"+args,
                src = "https://player.vimeo.com/video/"+id+"?autoplay=1"+args,
                createOembed("https://vimeo.com/api/oembed.json?url=", url)
            );
            break;
        case "rutube" :
            if(/(?:\/play)?\/embed\/([^&.\/]+)/i.test(a.pathname)) id = RegExp.$1;
            else if(/[?&]pl_video=([^&]+)/i.test(a.search))        id = RegExp.$1;
            if(!id || (settings[0] && a.search.includes("autoStart=1"))) return;
            if(/[?&](bmstart=[^&]+)/i.test(a.search)) args += "&"+RegExp.$1;
            createHtml(
                url = "https://rutube.ru/"+(isNaN(id) ? "video/"+id+"/" : "tracks/"+id+".html"),
                src = "https://rutube.ru/"+(a.pathname.includes("/embed/") ? "play/embed/"+id+"?autoStart=1"+args : "pl/?pl_video="+id),
                createJOembed("https://rutube.ru/api/oembed/?format=json&url=", url)
            );
            break;
        case "twitch" :
            if(/(channel|video|clip)=([^&]+)/i.test(a.search))       {args = RegExp.$1; id = RegExp.$2;}
            else if(/(stream=.+&channelId)=([^&]+)/i.test(a.search)) {args = RegExp.$1; id = RegExp.$2;}
            else if(/\/(.+)\/embed/i.test(a.pathname))               {args = "channel"; id = RegExp.$1;}
            if(!id || (settings[0] && a.search.includes("autoplay=true"))) return;
            createHtml(
                url = "https://"+(args=="clip" ? "clips" : "www")+".twitch.tv/"+(args=="video" ? "videos/" : "")+id,
                src = a.href.split('?')[0]+"?autoplay=true&"+args+"="+id+"&parent="+location.hostname,
                null,
                "url(https://static-cdn.jtvnw.net/previews-ttv/live_user_"+(args=="channel" ? id : 0)+"-0x0.jpg)"
            );
            break;
        case "coub" :
            if(/\/embed\/([^&]+)/i.test(a.pathname)) id = RegExp.$1;
            if(!id || (settings[0] && a.search.includes("autostart=true"))) return;
            createHtml(
                url = "https://coub.com/view/"+id,
                src = "https://coub.com/embed/"+id+"?startWithHD=true&autostart=true",
                createJOembed("https://coub.com/api/oembed.json?url=", url)
            );
            break;
        case "rumble" :
            if(/\/embed\/([^\/]+)/i.test(a.pathname)) id = RegExp.$1;
            if(!id || (settings[0] && a.search.includes("autoplay=2"))) return;
            if(/[?&](start=[^&]+)/i.test(a.search)) args += "&"+RegExp.$1;
            createHtml(
                url = "https://rumble.com/"+id+"-.html",
                src = "https://rumble.com/embed/"+id+"/?autoplay=2"+args,
                createJOembed("https://rumble.com/api/Media/oembed.json?url=", src)
            );
            break;
        default :
            return;
        }
        if(elem.tagName != "IFRAME") {
            if(elem.parentNode.tagName == "OBJECT")
                elem = elem.parentNode;
            var iframe = document.createElement("IFRAME");
            iframe.src           = src;
            iframe.id            = elem.id;
            iframe.name          = elem.name;
            iframe.className     = elem.className;
            iframe.style.cssText = elem.style.cssText;
            iframe.width         = elem.width;
            iframe.height        = elem.height;
            iframe.frameBorder   = elem.border;
            iframe.align         = elem.align;
            elem.parentNode.replaceChild(iframe, elem);
            elem = iframe;
        }
        createListener();
        elem.dataset.lazyVideo = 2;
        elem.allowFullscreen   = true;
        elem.srcdoc            = html.join("");
        iframes.push(elem);
        setTimeout(function() {
            if(elem.dataset.lazyVideo != 3)
                elem.removeAttribute("srcdoc");
        }, 15000);
    };

    var observer, animation;
    var update = function() {
        if(!document.body) {
            animation = requestAnimationFrame(update);
        } else if(!observer) {
            observer = new MutationObserver(function() { if(!animation) animation = requestAnimationFrame(update); });
            observer.observe(document.body, {childList: true, attributes: false, characterData: false, subtree: true});
            animation = requestAnimationFrame(update);
        } else {
            var nodes = document.querySelectorAll(settings[1] ? "IFRAME, EMBED, OBJECT" : "IFRAME");
            for(var i = 0; i < nodes.length; i++)
                createLazyVideo(nodes[i]);
            animation = null;
        }
    };
    update();
})();