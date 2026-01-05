// ==UserScript==
// @name Play All YouTube Videos Channel
// @description Adds a button that lets you play all videos from this YouTube channel.
// @homepageURL https://github.com/DrakeRoxas/playyoutubechannel
// @author Drake Roxas
// @version 1.0.0
// @date 2016-01-13
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/html5player*
// @match https://s.ytimg.com/yts/jsbin/html5player*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @run-at document-end
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAB3RJTUUH2wMOCgIoGUYEAQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAAGSUExURfi/JO/v797e3sbGxq2traWlpZSUlJycnNbW1oyEhIRaWow5OZQhIZwYGKUQEKUICK0ICJQxMYxKSoxzc4x7e4RCQpQYGKUAAK0AALUAAL0AAK0QEIxra5QpKa0YGIxSUsYAAKUhIZR7e87Ozr0ICJRSUr29vYxjY6U5OaUpKa0hIb21tZwAALUICO/Ozu/GxqUxMZSEhLUYGO/W1r0YGKVCQpQQEL0pKffe3vfW1pxra5Q5OcZCQvfn585CQr2trZx7e8ZSUs5SUq05Oc5jY9ZjY84AAKWMjM5zc957e60pKdaMjOelpbWcnLWUlLVCQsYYGMYICNbOzpQICMYhIbV7e5xaWt6cnPfv79bGxt6lpe+9vc5KSs6lpb0xMc6EhM69vbUxMbUhIb1aWs61tcZaWuecnMYxMb1KSsZjY96UlNa1td7W1r17e9a9vZwQEN6trb1jY8YQENZra+fOzr1zc85aWufe3t6MjMY5OdZaWt61tdZ7e+/n5+e9vc6MjMZra+/e3ue1tdalpd7GxrUpKalL4aAAAAABdFJOUwBA5thmAAACxklEQVR42uXX/1/SQBgH8NuAoEQ2ijgbBivJLznBAiUUKiyJSgOVAk0tKZKw75mRRt/7v4MBY8ezjW39Vs8v8rqHz/u1jbvbidC/XL8KmcpOqVT6nSjXjooGw8WfFd+QWGfE4oLbtbr++PdMOy0BDYLjEj/0xevfWIyVAI7b/aIj/9WHsRrA8Yf9bqSexVgD4Lic9kWE/LgPwPGfNfJHDO4P8Iuq+S2M9QD8oUp+nxEAcFCtfgIA/14x/9ElAKDQbNQAwN9VAiYEABy0OgsAWAnB/AcBAtVWawkAfJ4CD0BQADZavYcQgI9h3CCQjpD5PcEgwG+SwLRhIL0vz78SjAPEU3hrHODfyX4I6rUJIP0G3oExoNwFXpoB+HwXmDEFpF9IwKA5YK+Tp9fMAdUOsC6YA553gKcmgdTfAhV1oMQqADndQDmJ0AZLAsFnCIV3VYDHJLAjDkZKciAaFz/lCeBJB1glgXBrNLndBWLJ9uZGAI+keTBLANL8SnWAzWRniAC2pG+6lQF0hfjTqCIBrEvjDwiggFSLuIUoLY0vEwAbUcsnc/LlnO02HGvEz+hXEeJ5Yj+4L2vNkxOJDSnlQzliIq2synr3embiUBjmw0FyU83KX04Ob+9aAK/Ppd5deZloz4HFlCHzt3sX0x2a6LcvQb4ab8r7i+DVdqvnCq/D5ZzqdhfAcr5B9wD0PNwPEu0ZnLwK9oPgNfCQJ2fhhhITJ3E8BjeUOXA+QNQlBh5xLjemVCgKjzgzNIJFjWF4yJoKhafgIWt6VHGmjgR0HvMuTipPdWQJ6AImbBRSE8aY/sC4er5xFx5vHyB4YRRpFWUf0AL4c+dHkHZRFo9TDeB9Aa3Llwjr8FlFwB+wO/rHm0VbPae9mPini/O5h/XGxatw2I6fGHAOuhiGZVxO98lTdgutP94yaIvVdqxZdpvFYTT9X9UfqQQlTXlm8wkAAAAASUVORK5CYII=
// @namespace https://greasyfork.org/users/27155
// @downloadURL https://update.greasyfork.org/scripts/16218/Play%20All%20YouTube%20Videos%20Channel.user.js
// @updateURL https://update.greasyfork.org/scripts/16218/Play%20All%20YouTube%20Videos%20Channel.meta.js
// ==/UserScript==


(function () {
    function getChannelId() {
        var metas = document.getElementsByTagName('meta');

        for (i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute("itemprop") == "channelId") {
                return metas[i].getAttribute("content").slice(2);
            }
        }

        return "";
    }

    var CHANNEL_ID = getChannelId();
    var BUTTON_TEXT = {'en':'Play All','fr':'Tout Ecouter'};
    var BUTTON_TOOLTIP = {'en':'Play all videos from this channel','fr':'Ecouter toutes les vidéos de cette chaine'};

    start();

    function makeButton(url, margin) {
        var language=document.documentElement.getAttribute('lang');
        var buttonText=(BUTTON_TEXT[language])?BUTTON_TEXT[language]:BUTTON_TEXT.en;
        var buttonLabel=(BUTTON_TOOLTIP[language])?BUTTON_TOOLTIP[language]:BUTTON_TOOLTIP.en;
        
        var node = document.createElement("a");
        node.href = url;
        var html = '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-subscribe-branded yt-uix-button-has-icon no-icon-markup yt-uix-subscription-button yt-can-buffer yt-uix-tooltip" data-tooltip-text="'+buttonLabel+'" type="button" style="height: 22px; float: right;';
        if (margin) html += ' margin: 8px 8px 0px 0px;';
        html += '"><span class="yt-uix-button-content"><span class="subscribe-label">'+buttonText+'</span></span></button>';
        node.innerHTML = html;
        return node;
    }


    function start() {
        var pagecontainer=document.getElementById('page-container');
        if (!pagecontainer || !CHANNEL_ID) return;
        run();       
        var isAjax=/class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
        var logocontainer=document.getElementById('logo-container');  
        if (logocontainer && !isAjax) { // fix for blocked videos
            isAjax=(' '+logocontainer.className+' ').indexOf(' spf-link ')>=0;
        }
        var content=document.getElementById('content');
        if (isAjax && content) { // Ajax UI
            var mo=window.MutationObserver||window.WebKitMutationObserver;
            if(typeof mo!=='undefined') {
                var observer=new mo(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if(mutation.addedNodes!==null) {
                            for (var i=0; i<mutation.addedNodes.length; i++) {
                                if (mutation.addedNodes[i].id=='watch7-content' || 
                                    mutation.addedNodes[i].id=='watch7-main-container' || 
                                    mutation.addedNodes[i].className=='branded-page-v2-container branded-page-base-bold-titles branded-page-v2-container-flex-width branded-page-v2-has-top-row branded-page-v2-secondary-column-hidden' ||
                                    mutation.addedNodes[i].className=='branded-page-v2-container branded-page-base-bold-titles branded-page-v2-container-flex-width branded-page-v2-has-top-row') { // old value: movie_player
                                    run();
                                    break;
                                }
                            }
                        }
                    });
                });
                observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
            } else { // MutationObserver fallback for old browsers
                pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
            }
        }
    }

    function onNodeInserted(e) { 
        if (e && e.target && (e.target.id=='watch7-content' || 
                              e.target.id=='watch7-main-container' ||
                              e.target.className=='branded-page-v2-container branded-page-base-bold-titles branded-page-v2-container-flex-width branded-page-v2-has-top-row branded-page-v2-secondary-column-hidden' ||
                              e.target.className=='branded-page-v2-container branded-page-base-bold-titles branded-page-v2-container-flex-width branded-page-v2-has-top-row')) { // old value: movie_player
            run();
        }
    }

    function run() {
        if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) addInWatch(); 
        if (/^https?:\/\/www\.youtube.com\/user\//.test(window.location.href) || /^https?:\/\/www\.youtube.com\/channel\//.test(window.location.href)) addInUser();
    }

    function addInWatch() {
        var url = window.location.href;
        console.log(url);
        index = url.indexOf('list=');
        if (index > -1) {
            endIndex = url.indexOf('&', index);
            if (endIndex > -1) {
                url = url.replace(url.substr(index, endIndex), "list=UU" + CHANNEL_ID);
            } else {
                url = url.slice(0, index) + "list=UU" + CHANNEL_ID;
            }
        } else {
            url += "&list=UU" + CHANNEL_ID;
        }
        console.log(url);

        if (url == window.location.href) return;

        var content = document.getElementById("watch7-content");
        var infos = content.getElementsByClassName('yt-user-info');
        for (i = 0; i < infos.length; i++) {
            infos[i].appendChild(makeButton(url));
        }
    }

    function addInUser() {
        var url = "https://www.youtube.com/playlist?list=UU" + CHANNEL_ID;
        console.log(url);

        var content = document.getElementById('channel-subheader');
        content.appendChild(makeButton(url, true));
        content = document.getElementById('appbar-nav');
        content.appendChild(makeButton(url, true));
    }

})();