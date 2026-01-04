
// ==UserScript==
// @name         Youtube Sort Playlist
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sort playlist while saving videos to playlists. Type in textbox to filter playlists. Addes support for light and dark theme. Contact me if you find any bugs.
// @author       Vivek Makwana
// @match        https://www.youtube.com/*
// @grant        none
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/400524/Youtube%20Sort%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/400524/Youtube%20Sort%20Playlist.meta.js
// ==/UserScript==

function renderTitle() {
    var interval2 = setInterval(function(){
        if($("#header #title")){
            clearInterval(interval2);
            $('#header #title').css('width','200px');
            if($("paper-toggle-button.ytd-toggle-item-renderer").attr('checked')){
                $('#header #title').html('<button id="sort_save_to" style="background: rgba(255,255,255,0.08); border: none; border-radius: 2px; color: #fff; padding: 8px 16px; margin-right: 16px;">A-Z ↓</button><input type="text" class="filter_save_to" style="background: #121212; color: rgba(255,255,255,0.88); padding: 8px 16px; border: 0; border-radius: 2px; width: 30%;" />');
            } else {
                $('#header #title').html('<button id="sort_save_to" style="background: #f8f8f8; border: 1px solid rgb(211,211,211); border-radius: 2px; color: #000; padding: 8px 16px; margin-right: 16px;">A-Z ↓</button><input type="text" class="filter_save_to" style="background: #ffffff; color: #111111; padding: 8px 16px; border: 1px solid rgb(211,211,211); border-radius: 2px; width: 30%;" />');
            }
        }
    },500);
}

function keyupSearch(e){
    var arr = Array();
    document.querySelector("#playlists.ytd-add-to-playlist-renderer").style.display = "flex";
    document.querySelector("#playlists.ytd-add-to-playlist-renderer").style.flexDirection = "column";
    document.querySelectorAll("#playlists yt-formatted-string").forEach(function(item){
        arr.push(item.innerHTML);
    })
    let filtered = arr.filter(function(item){
        return (item!='<!--css-build:shady-->' && item.toLowerCase().includes(e.target.value.toLowerCase()))
    })
    document.querySelectorAll("#playlists.ytd-add-to-playlist-renderer #label").forEach(function(el1, index){
        el1.closest("ytd-playlist-add-to-option-renderer.ytd-add-to-playlist-renderer").style.display = "none";
        filtered.forEach(function(item) {
            if(el1.innerHTML == item)
            {
                el1.closest("ytd-playlist-add-to-option-renderer.ytd-add-to-playlist-renderer").style.display = "block";
            }
        });
    })
    document.querySelector("ytd-playlist-add-to-option-renderer.style-scope.ytd-add-to-playlist-renderer:last-child").style.marginBottom = '16px';
}

var interval1 = setInterval(function(){
    if($("#top-level-buttons ytd-button-renderer")){
        clearInterval(interval1);
        $(document).on("click", "#top-level-buttons ytd-button-renderer:last-child", function(e){
            renderTitle();
        })
        if($('.filter_save_to')){
            $(document).on('keyup', '.filter_save_to', function(e){
                keyupSearch(e);
            })
        }
    }
},1000);

document.addEventListener("click", function(e){
    var filter_save_to;
    if($(e.target).hasClass('ytd-menu-service-item-renderer')){
        renderTitle();
        if($('.filter_save_to')){
            $(document).on('keyup', '.filter_save_to', function(e){
                keyupSearch(e);
            })
        }
    }
    if(e.target.id=='sort_save_to'){
        var arr = Array();
        document.querySelector("#playlists.ytd-add-to-playlist-renderer").style.display = "flex";
        document.querySelector("#playlists.ytd-add-to-playlist-renderer").style.flexDirection = "column";
        document.querySelectorAll("#playlists yt-formatted-string").forEach(function(item){
            arr.push(item.innerHTML);
        })
        let filtered = arr.filter(function(item){
            return item!='<!--css-build:shady-->'
        })
        i = 1;
        filtered.sort().forEach(function(sort1){
            document.querySelectorAll("#playlists yt-formatted-string").forEach(function(el1, index){
                if(sort1==el1.innerHTML){
                    el1.closest("ytd-playlist-add-to-option-renderer").style.order = i;
                    i++;
                }
            })
        })
        document.querySelector("ytd-playlist-add-to-option-renderer.style-scope.ytd-add-to-playlist-renderer:last-child").style.marginBottom = '16px';
    }
});