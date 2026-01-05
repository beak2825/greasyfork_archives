// ==UserScript==
// @name         MyAnimeList(MAL) - Last updates "Edit Button"
// @version      1.4.1
// @description  Brings the edit button back to your profile
// @author       Cpt_mathix
// @match        *://myanimelist.net/profile*
// @exclude      *://myanimelist.net/profile/*/*
// @license      GPL-2.0+; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/13250/MyAnimeList%28MAL%29%20-%20Last%20updates%20%22Edit%20Button%22.user.js
// @updateURL https://update.greasyfork.org/scripts/13250/MyAnimeList%28MAL%29%20-%20Last%20updates%20%22Edit%20Button%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function lastUpdatesEditButton() {
        var you = document.getElementsByClassName('header-profile-link')[0].textContent;
        var user_profile = document.getElementsByTagName('title')[0].textContent.replace("\'s Profile - MyAnimeList.net", "");

        prepareLastUpdates();
        processLastUpdates(you.trim() == user_profile.trim());

        function prepareLastUpdates() {
            var data = document.getElementsByClassName("statistics-updates");
            for(var i = 0; i < data.length; i++) {
                var edit = document.createElement('div');
                edit.className = "add_edit_button";

                var title = data[i].getElementsByTagName('a')[1];
                title.parentNode.insertBefore(edit, title.parentNode.childNodes[2]);
                title.className += 'pr4';
            }
        }

        function processLastUpdates(isYourProfile) {
            var data = document.getElementsByClassName("statistics-updates");
            for(var i = 0; i < data.length; i++) {
                var itemUrl = data[i].getElementsByTagName('a');
                var id = itemUrl[0].href.match(/\d+/)[0];
                var edit = data[i].getElementsByClassName("add_edit_button")[0];

                createEditButton(data[i], edit, id, isYourProfile);
            }

            var checkExist = setInterval(function() {
                if ($('#fancybox-inner')) {
                    clearInterval(checkExist);
                    observeFancyBox();
                }
            }, 100);

            $('.lightbox').fancybox({
                'width'			: 700,
                'height'		: '85%',
                'overlayShow'	: false,
                'titleShow'     : false,
                'type'          : 'iframe'
            });
        }

        function createEditButton(element, edit, id, isYourProfile) {
            var url;
            if (element.parentNode.className.indexOf('manga') == -1) {
                url = "/ownlist/anime/" + id + "/edit?hideLayout=1";
                edit.outerHTML = '<a href=' + url + ' title="Edit this entry" class="lightbox button_edit">' + (isYourProfile ? 'edit' : 'add/edit') + '</a>';
            } else {
                url = "/ownlist/manga/" + id + "/edit?hideLayout=1";
                edit.outerHTML = '<a href=' + url + ' title="Edit this entry" class="lightbox button_edit">' + (isYourProfile ? 'edit' : 'add/edit') + '</a>';
            }
        }

        function observeFancyBox() {
            var target = document.querySelector('#fancybox-inner');
            var observer = new MutationObserver(function(mutations) {
                var iframe = document.querySelector('#fancybox-frame');

                if (iframe) {
                    iframe.onload = function() {
                        var iframeUrl = this.contentWindow.location.href;
                        if (iframeUrl.indexOf("hideLayout") === -1) {
                            this.contentWindow.location.replace(iframeUrl + "&hideLayout=1");
                        }
                    };
                }
            });
            var config = { attributes: false, childList: true, characterData: false };
            observer.observe(target, config);
        }
    }

    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ lastUpdatesEditButton +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
})();