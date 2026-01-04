// ==UserScript==
// @name         Youtube Restore Liked and Watch Later Button Pre Polymer
// @namespace    https://openuserjs.org/scripts/QWFP6/Youtube_music_tab
// @version      1.2
// @description  Restores the Liked Videos and Watch Later Button for the old YouTube layout that Good Old YouTube doesn't restore.
// @author       QWFP6
// @match      *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416118/Youtube%20Restore%20Liked%20and%20Watch%20Later%20Button%20Pre%20Polymer.user.js
// @updateURL https://update.greasyfork.org/scripts/416118/Youtube%20Restore%20Liked%20and%20Watch%20Later%20Button%20Pre%20Polymer.meta.js
// ==/UserScript==


ymt = {
    init: function(){
        ymt.addMusicTab();
        window.addEventListener("spfdone", ymt.addMusicTab);
    },
    addMusicTab: function(){
        var music = document.createElement("li");
        music.id = "__YTP_MUSIC_TAB__";
        ymt.selected(music);
        ymt.unselected(music);
        ymt.addGuideItem() + ymt.addGuideItem2();
            document.querySelector("appbar-guide-menu").appendChild(music);
    },
    addGuideItem: function(){
        var musicItem = '<a class="guide-item yt-uix-sessionlink yt-valign spf-link " href="https://www.youtube.com/playlist?list=LL" title="Liked videos" data-sessionlink="feature=g-playlists&amp;ved=CBIQtSwoCQ&amp;ei=vOZ3VbHuBMy5oAOEkYOgDw" data-visibility-tracking="" data-external-id="VLLL81dLeaF4JG89hgAehoPjBw" data-serialized-endpoint="0qDduQEcEhpWTExMODFkTGVhRjRKRzg5aGdBZWhvUGpCdw%3D%3D"> <span class="yt-valign-container"> <span class="thumb guide-likes-playlist-icon yt-sprite"></span> <span class="display-name no-count"> <span> Liked videos </span> </span> </span> </a>';
        var div = document.createElement('div');
        div.innerHTML = musicItem;
        var musicNode  = div.childNodes[0];
        var child = document.querySelector('#subscriptions-guide-item');
        child.parentNode.insertBefore(musicNode, child.nextSibling);
    },
   addGuideItem2: function(){
        var musicItem = '<a class="guide-item yt-uix-sessionlink yt-valign spf-link " href="https://www.youtube.com/playlist?list=WL" title="Liked videos" data-sessionlink="feature=g-playlists&amp;ved=CBIQtSwoCQ&amp;ei=vOZ3VbHuBMy5oAOEkYOgDw" data-visibility-tracking="" data-external-id="VLLL81dLeaF4JG89hgAehoPjBw" data-serialized-endpoint="0qDduQEcEhpWTExMODFkTGVhRjRKRzg5aGdBZWhvUGpCdw%3D%3D"> <span class="yt-valign-container"> <span class="thumb guide-watch-later-icon yt-sprite"></span> <span class="display-name no-count"> <span> Watch Later </span> </span> </span> </a>';
        var div = document.createElement('div');
        div.innerHTML = musicItem;
        var musicNode  = div.childNodes[0];
        var child = document.querySelector('#subscriptions-guide-item');
        child.parentNode.insertBefore(musicNode, child.nextSibling);
    },
    unselected:function(music){
        var a = document.createElement("a");
        a.href="/feed/music";
        a.className="yt-uix-button   spf-link yt-uix-sessionlink yt-uix-button-epic-nav-item yt-uix-button-size-default";
        var span = document.createElement("span");
        span.className="yt-uix-button-content";
        span.innerText="Musique";
        music.appendChild(a);
        a.appendChild(span);
    },
    selected:function(music){
        var h2 = document.createElement("h2");
        h2.className="epic-nav-item-heading";
        h2.innerText="Musique";
        music.appendChild(h2);
    }
}

ymt.init();



