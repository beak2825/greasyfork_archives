// ==UserScript==
// @name         PornoLab.net Thumbnail Expander
// @namespace    http://pornolab.net/
// @version      0.5.2
// @description  Automatically unfolds spoilers and replaces thumbnails with full sized images while removing thumbnails linking to adware.
// @author       Anonymous
// @include      http://pornolab.net/forum/viewtopic.php*
// @include      https://pornolab.net/forum/viewtopic.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13546/PornoLabnet%20Thumbnail%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/13546/PornoLabnet%20Thumbnail%20Expander.meta.js
// ==/UserScript==

(function(){
    ////////// SETTINGS: ///////////
    var auto_unfold = true;       // auto unfold spoilers
    var auto_preload = true;      // start loading images while the spoiler is closed
    var max_img_width = '1200px'; // max image widths, set to 'auto' to disable
    // thumbnails hosted on these sites will be removed:
    var blocked_hosts = ['piccash.net', 'picclick.ru', 'pic4cash.ru', 'picspeed.ru', 'picforall.ru', 'freescreens.ru'];
    ////////////////////////////////
    var targets = document.querySelectorAll('.sp-wrap');
    for(var i=0; i<targets.length; i++){
        var containers = targets[i].querySelectorAll('var.postImg');
        for(var j=0; j<containers.length; j++){
            var url = containers[j].title;
            if(url.indexOf('fastpic.org/thumb/') != -1){
                (function(target, pageUrl){
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: pageUrl,
                        onload: function(response) {
                            var matches = response.responseText.match(/<img src="http(.+?)" class="image img-fluid"/);
                            if(matches && matches.length > 1) {
                                var url = 'http' + matches[1];
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: url,
                                    responseType: 'blob',
                                    headers: {
                                        referer: pageUrl,
                                    },
                                    onload: function(response) {
                                        var reader = new FileReader();
                                        reader.onload = function() {
                                            updateImageUrl(target, reader.result);
                                        };
                                        reader.readAsDataURL(response.response);
                                    }
                                });
                            }
                        }
                    });
                })(containers[j], containers[j].parentNode.href);
            } else if(url.indexOf('imagebam.com') != -1){
                (function(target){
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: target.parentNode.href,
                        onload: function(response) {
                            var matches = response.responseText.match(/<img src="(.+?)"[^>]+class="main-image/i);
                            if(matches && matches.length > 1) {
                                updateImageUrl(target, matches[1]);
                            }
                        }
                    });
                })(containers[j]);
            } else if(url.indexOf('imagevenue.com') != -1){
                (function(target){
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: target.parentNode.href,
                        onload: function(response) {
                            var matches = response.responseText.match(/<img src="http(.+?)"/i);
                            if(matches && matches.length > 1) {
                                updateImageUrl(target, 'http' + matches[1]);
                            }
                        }
                    });
                })(containers[j]);
            } else if(url.indexOf('imgbox.com') != -1){
                url = url.replace('thumbs', 'images');
                url = url.replace('_t', '_o');
            } else if(url.indexOf('imgdrive.net') != -1){
                url = url.replace('small', 'big');
            } else {
                for(var b=0; b<blocked_hosts.length; b++){
                    if(url.indexOf(blocked_hosts[b]) != -1){
                        url = null;
                        break;
                    }
                }
            }
            if(url){
                updateImageUrl(containers[j], url);
            }
        }

        if(containers.length) {
            if(auto_unfold){
                var headers = targets[i].querySelectorAll('.sp-head');
                for(var m=0; m<headers.length; m++){
                    headers[m].className += ' unfolded';
                }
            }
            if(auto_unfold || auto_preload){
                var bodies = targets[i].querySelectorAll('.sp-body');
                for(var k=0; k<bodies.length; k++){
                    if(auto_preload){
                        bodies[k].className += ' inited';
                    }
                    if(auto_unfold){
                        bodies[k].style.display = 'block';
                    }
                }
            }
        }
    }

    function updateImageUrl(node, url) {
        node.title = url;
        if(auto_preload){
            node.innerHTML = '<img src="' + url + '" style="max-width:' + max_img_width + '" title=""/>';
        }
    }

})();