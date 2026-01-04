// ==UserScript==
// @name         Thumbloader
// @namespace    http://tampermonkey.net/
// @version      0.2.71
// @description  Faster way to preview images on boards
// @author       You
// @match        *://*/*
// @icon         https://gelbooru.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431081/Thumbloader.user.js
// @updateURL https://update.greasyfork.org/scripts/431081/Thumbloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = '';
    css += '.mprw-item img, .mprw-item video {max-width: 100%}';
    css += '.mprw-popup {position: fixed; bottom: 30px; right: 30px; z-index: 999999999; background: #353535; color: #FFF; padding: 5px; opacity: 0.3; border-radius: 15px; display: flex; flex-wrap: wrap;}';
    css += 'body .mprw-item {width: 100%; height: auto; display: block}';
    css += 'body .mprw-item:hover {z-index:9999}';
    css += '.tmbldr-modal {position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);text-align:center; z-index: 999}';
    css += '.tmbldr-modal:after {content:"";display:inline-block;vertical-align:middle;width:0;height:100%}';
    css += '.tmbldr-modal .tmbldr-modal-content {display:inline-block;vertical-align:middle;max-width:100%;height:100%}';
    css += '.tmbldr-modal .tmbldr-modal-media {width:100%;height:100%}';
    css += '.tmbldr-modal-media img, .tmbldr-modal-media video {object-fit:contain;width:100%;height:100%}';
    css += '.tmbldr-btn {padding: 5px 10px; background: #272727; border-radius: 10px; margin: 5px;}';
    var styles = document.createElement('div');
    styles.innerHTML += '<style>' + css + '</style>';
    document.body.appendChild(styles);

    function media_type(url) {
        var is_video = false;
        if(String(url).indexOf('.mp4') > 0) is_video = true;
        if(String(url).indexOf('.webm') > 0) is_video = true;
        return is_video ? 'video' : 'img';
    }

    function getOriginal(url, callback) {
        fetch(url, {}).then(function(res) {
            var page = res.text().then(function(html) {
                var source = null;
                debugger;
                if(source === null) { /* paheal */
                    source = /href=['"](.+)['"].+File Only/.exec(html);
                    if(source !== null) source = source[1];
                }
                if(source === null) {
                    source = /id="main_image" [\S\s]*?<source.+src="(.*?)"/.exec(html);
                    if(source !== null) source = source[1];
                }
                if(source === null) {
                    source = /og\:image".+content="(.+?)"/gm.exec(html);
                    if(source !== null) source = source[1];
                }
                var type = media_type(source);
                var preview = '<a href="'+source+'">'+source+'</a>';
                if(type == 'img') preview = '<img src="'+source+'">';
                else if(type == 'video') preview = '<video autoplay controls loop volume=0 muted src="'+source+'"></video>';
                var result = {type: type, url: source, page: url, preview: preview};
                if(typeof callback === 'function') callback(result);
            });
        });
    }

    function preload(url) {
        var el = document.querySelector('.thumb:not(.loaded,.loading), .thumbnail-preview:not(.loaded,.loading)');
        var href = el.querySelector('a');
        if(href) {
            getOriginal(href, function(data) {
                var preload_el = document.createElement('div')
                preload_el.setAttribute('style', 'display:none');
                preload_el.innerHTML = data.preview;
                document.body.append(preload_el);
                el.setAttribute('preloaded', data.source);
            });
        }
    }

    function updateModal(content) {
        var modal = document.querySelector('.tmbldr-modal');
        if(!document.querySelector('.tmbldr-modal')) {
            modal = document.createElement('div');
            modal.setAttribute('class', 'tmbldr-modal');
            modal.innerHTML = '<div class="tmbldr-modal-content">...</div>';
            document.body.appendChild(modal)
        }
        var $$content = document.querySelector('.tmbldr-modal-content');
        $$content.innerHTML = content;
    }

    function closeModal() {
        var modal = document.querySelector('.tmbldr-modal');
        if(modal) modal.parentNode.removeChild(modal);
    }

    function next() {

        var el = document.querySelector('.thumb:not(.loaded,.loading), .thumbnail-preview:not(.loaded,.loading)');
        if(!el) document.querySelector('[alt="next"]').click();

        var link = el.querySelector('a');
        console.log(link)

        if(link && link.href) {
            el.classList.add('loading');
            getOriginal(link.href, function(media) {
                el.classList.add('loaded');
                el.classList.remove('loading');
                var el_full = document.createElement('div');
                el_full.innerHTML = '<a href="'+ link.href +'" clas="mprw-link">Post</a>';
                el.appendChild(el_full);
                updateModal('<div class="tmbldr-modal-media">' + media.preview + '</div>');
            });
            preload();
        }
    }

    var autoplaing = false;
    function autoplay(force_status) {
        if(autoplaing || force_status === false) {
            clearInterval(autoplaing);
            autoplaing = false;
            controls.querySelector('[do="auto"]').innerHTML = '▶';
        } else {
            next();
            autoplaing = setInterval(next, 8000);
            controls.querySelector('[do="auto"]').innerHTML = '⏸';
        }
    }


    if(document.querySelector('.thumb,.thumbnail-preview')) {
        var controls = document.createElement('div');
        controls.classList.add('mprw-popup');
        var h = '';
        h += '<div class="tmbldr-btn" do="auto">▶</div>';
        h += '<div class="tmbldr-btn" do="next">Next</div>';
        h += '<div class="tmbldr-btn" do="close">Close</div>';
        controls.innerHTML += h;
        document.body.appendChild(controls);
        controls.addEventListener('click', function(e) {
            var action = e.target.getAttribute('do');
            if(action == 'auto') autoplay()
            if(action == 'next') if(autoplaing) { next(); autoplay(); } else next();
            if(action == 'close') { autoplay(false); closeModal(); }
        });
        var overcontrols = false;
        controls.onmouseenter = function() { overcontrols = true; };
        controls.onmouseleave = function() { overcontrols = false; };
        document.addEventListener("keyup", function() {
            if(overcontrols) next();
        });
    }

})();