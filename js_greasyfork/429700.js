// ==UserScript==
// @name         Hide Youtube left sidebar items
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds a list of check-boxes to the bottom-most of the left sidebar for toggling visibility. (items that can be hidden are: Explore, Subscriptions, Subscriptions list, Library, History, Your videos, Watch later, More from Youtube)
// @author       babyrager
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @include https://youtube.com/*
// @include https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/429700/Hide%20Youtube%20left%20sidebar%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/429700/Hide%20Youtube%20left%20sidebar%20items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function(){

        var namespace = 'hide-yt-stuff-';
        function clickHide(){
            var key = namespace+this.getAttribute('data-hide-yt-key');
            if(this.checked){
                localStorage.setItem(key, 'is_checked');
                hideStuff(this.getAttribute('data-hide-yt-key'), true);
            }else{
                localStorage.removeItem(key);
                hideStuff(this.getAttribute('data-hide-yt-key'), false);
            }
        }

        function hideStuff(key, flag){
            var display_type = 'block';
            if(flag){
                display_type = 'none';
            }
            if(key == 'subscription'){
                document.querySelectorAll('a.yt-simple-endpoint').forEach(function(item){
                    if(item.getAttribute('title') == 'Subscriptions'){
                        item.style.display = display_type;
                    }
                });
            }
            else if(key == 'subscription-list'){
                document.querySelectorAll('yt-formatted-string.ytd-guide-section-renderer').forEach(function(item){
                    if(item.innerHTML.toLowerCase().trim() == 'subscriptions'){
                        item.parentNode.parentNode.style.display = display_type;
                    }
                });
            }
            else if(key == 'explore'){
                document.querySelectorAll('a.yt-simple-endpoint').forEach(function(item){
                    if(item.getAttribute('title') == 'Explore'){
                        item.style.display = display_type;
                    }
                });
            }else if(key == 'library'){
                document.querySelectorAll('a.yt-simple-endpoint').forEach(function(item){
                    if(item.getAttribute('title') == 'Library'){
                        item.style.display = display_type;
                    }
                });
            }else if(key == 'history'){
                document.querySelectorAll('a.yt-simple-endpoint').forEach(function(item){
                    if(item.getAttribute('title') == 'History'){
                        item.style.display = display_type;
                    }
                });
            }
            else if(key == 'your-videos'){
                document.querySelectorAll('a.yt-simple-endpoint').forEach(function(item){
                    if(item.getAttribute('title') == 'Your videos'){
                        item.style.display = display_type;
                    }
                });
            }else if(key == 'watch-later'){
                document.querySelectorAll('a.yt-simple-endpoint').forEach(function(item){
                    if(item.getAttribute('title') == 'Watch later'){
                        item.style.display = display_type;
                    }
                });
            }else if(key == 'liked-videos'){
                //doesn't work if it is hidden in the menu on page load, comment if you came up with a fix

                /*document.querySelectorAll('a.yt-simple-endpoint').forEach(function(item){
                    if(item.getAttribute('title') == 'Liked videos'){
                        item.style.display = display_type;
                    }
                });*/
            }else if(key == 'more-from-youtube'){
                setTimeout(function(){
                document.querySelectorAll('yt-formatted-string.ytd-guide-section-renderer').forEach(function(item){
                    if(item.innerHTML.toLowerCase().trim() == 'more from youtube'){
                        item.parentNode.parentNode.style.display = display_type;
                    }
                });
                },200);
            }
        }

        var obj = document.createElement('div');
        var str = '<div>';
        obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="subscription">Hide subscription</div>';
        obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="subscription-list">Hide subscription list</div>';
        obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="explore">Hide explore</div>';
        obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="library">Hide library</div>';
        obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="history">Hide history</div>';
        obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="your-videos">Hide your videos</div>';
        obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="watch-later">Hide watch later</div>';
        //obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="liked-videos">Hide liked videos</div>';
        obj.innerHTML += '<div style="margin-left:20px;display:flex;align-items:center"><input type="checkbox" data-hide-yt-key="more-from-youtube">Hide more from youtube</div>';
        obj.innerHTML +='<div style="margin-bottom: 40px"></div>';
        str+='</div>';

        document.querySelector('#footer').appendChild(obj);
        document.querySelectorAll('[data-hide-yt-key]').forEach(function(item){
            var key = namespace+item.getAttribute('data-hide-yt-key');
            if(localStorage.getItem(key) == 'is_checked'){
                item.checked = true;
                hideStuff(item.getAttribute('data-hide-yt-key'), true);
            }
        });
        document.querySelectorAll('[data-hide-yt-key]').forEach(function(item){
            item.addEventListener('change', clickHide);
        });
    });
})();