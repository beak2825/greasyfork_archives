// ==UserScript==
// @name         Invidious save video progress
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Locally saves video progress on invidio.us and adds some more functonality such as: link to watch history, links to alternate invious instances, copying invidious links with timestamp, quick copy/open youtube link from list view.
// @author       Noruf
// @match        https://invidio.us/*
// @match        https://invidious.snopyta.org/*
// @match        https://invidiou.sh/*
// @match        https://yewtu.be/*
// @match        https://invidious.toot.koeln/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382503/Invidious%20save%20video%20progress.user.js
// @updateURL https://update.greasyfork.org/scripts/382503/Invidious%20save%20video%20progress.meta.js
// ==/UserScript==



(function() {
    'use strict';
    const timestamps = localStorage.timestamps ? JSON.parse(localStorage.timestamps) : {};
    let search = window.location.search;
    const isVideoPage = window.location.pathname.includes('watch');
    const videoId = isVideoPage? window.location.search.match(/v=(.*?)(&|$)/)[1]: ' ';
    const instances = ["invidio.us","invidious.snopyta.org","invidiou.sh","yewtu.be","invidious.toot.koeln"].filter(x => x!=window.location.hostname);

//    onReadyEvent(addOtherSources);
    var url = new URL(window.location.href);
    var time = url.searchParams.get("t");
    if(!time&&timestamps[videoId]){
        search = replaceQueryParam('t', timestamps[videoId], search);
        window.location.replace(window.location.pathname + search);
    }
    onReadyEvent(addHistoryButton);
    onReadyEvent(changeLinks);
    if(isVideoPage) onReadyEvent(videoProgressMain);
    onReadyEvent(addCopyYoutubeLinkButton);

    function replaceQueryParam(param, newval, search) {
        const regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
        const query = search.replace(regex, "$1").replace(/&$/, '');
        return (query.length > 2 ? query : "?") + (newval ? "&" + param + "=" + newval : '');
    }

    function onReadyEvent(callback){
        // in case the document is already rendered
        if (document.readyState!='loading') callback();
        // modern browsers
        else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
        // IE <= 8
        else {document.attachEvent('onreadystatechange', function(){
            if (document.readyState=='complete') callback();
        });}
    }

    function altLinks(altP){
        const altLink = document.createElement("a");
        altLink.appendChild(document.createTextNode("Alternate source"));
        altLink.style.cursor = "pointer";

        const linkList = document.createElement("div");
        linkList.style.display = "none"
        for (let inst of instances){
            const a = document.createElement("a");
            a.href = `https://${inst}/watch?v=${videoId}`;
            a.appendChild(document.createTextNode(inst));
            linkList.appendChild(a);
            linkList.appendChild(document.createElement("br"));
        }
        altLink.onclick = function(){
            linkList.style.display = linkList.style.display=="none"?"block":"none"
        }
        altP.appendChild(altLink);
        altP.appendChild(linkList);

    }

    function addCopyYoutubeLinkButton(){
        if(!isVideoPage)return;
        const a = document.querySelector('a[href*="youtube"');
        const p = document.createElement("a");
        p.appendChild(document.createTextNode(" copy"));
        a.parentElement.append(p);
        p.onclick = () => {
            copyToClipboard(a.href);
        };
        p.style.cursor = "pointer";
        const altP = document.createElement("p");
        altLinks(altP)
        const ul = p.parentElement.parentElement;
        ul.insertBefore(altP,ul.childNodes[2]);
    }


    function addHistoryButton(){
        const userfield = document.querySelector('.user-field');
        const newdiv = document.createElement('div');
        newdiv.className = 'pure-u-1-4';
        userfield.prepend(newdiv);
        const anchor = document.createElement('a');
        anchor.href = '/feed/history';
        anchor.className = 'pure-menu-heading';
        newdiv.append(anchor);
        const i = document.createElement('i');
        i.className = 'icon ion-md-time';
        anchor.append(i);
    }
    function changeLinks(){
        const thumbnails = document.querySelectorAll('div.thumbnail');
        thumbnails.forEach(t =>{
            const a = t.parentElement;
            const href = a.href;
            if(!href.includes("watch"))return;
            const id = href.match(/v=(.*?)(&|$)/)[1];
            if(timestamps[id]){
                a.href = `${href}&t=${timestamps[id]}s`;
            }
            if(isVideoPage)return;
            const YT = replaceQueryParam('list', '', href).replace(window.location.host,'youtube.com');
            const copy = document.createElement("a");
            copy.appendChild(document.createTextNode("copy"));
            const open = document.createElement("a");
            open.href = YT;
            open.appendChild(document.createTextNode("open"));
            const div = document.createElement('h5');
            div.style['text-align'] = 'right';
            div.style['margin-top'] = '-5%';
            div.append('YT link: ',copy,' ',open);
            a.parentElement.append(div);
            copy.onclick = () => {
                copyToClipboard(YT);
            };
        });
    }

    function videoProgressMain (){
        const player = document.querySelector('video');
        player.onpause = () => {saveProgress(false)};
        window.addEventListener('beforeunload', function (e) {
            saveProgress(false);
            e.returnValue = ''; // Chrome requires returnValue to be set.
        });
        const saveToClipboard = document.createElement("BUTTON");
        saveToClipboard.className = "pure-button";
        saveToClipboard.appendChild(document.createTextNode("Save To Clipboard"))
        document.querySelector('#subscribe').parentElement.appendChild(saveToClipboard);
        const message = document.createElement("span");
        document.querySelector('#genre').parentElement.appendChild(message);
        saveToClipboard.onclick = () => {
            saveProgress(true);
        }
        function saveProgress(doCopy){
            const time = Math.floor(document.querySelector('video').currentTime);
            if(isNaN(player.duration))return;
            if(doCopy){
                copyToClipboard(getURL(time));
            }
            timestamps[videoId] = time;
            if(time < 60 || player.duration - time < 60) {
                delete timestamps[videoId];
                message.innerHTML = `Timestamp not saved!`;
            } else{
                message.innerHTML = `Saved at ${convertSeconds(time)}`;
            }
            history.replaceState( {} , '', replaceQueryParam('t',time,window.location.pathname + window.location.search));
            localStorage.timestamps = JSON.stringify(timestamps);
        }

        function getURL(seconds){
            return `${window.location.origin}/watch?v=${videoId}&t=${seconds}s`;
        }
        function convertSeconds(seconds){
            return new Date(seconds * 1000).toISOString().substr(11, 8);
        }
    }


    function copyToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = 0;
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.error('Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
    }
})();