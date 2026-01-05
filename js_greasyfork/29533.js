// ==UserScript==
// @name         Youtube video crop
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Crop videos on youtube
// @locale       en
// @author       You
// @match        *://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29533/Youtube%20video%20crop.user.js
// @updateURL https://update.greasyfork.org/scripts/29533/Youtube%20video%20crop.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var DEBUG = false;
    
    function injectCSS(css) {
        var styleTag = $('<style>' + css + '</style>');
        $('html > head').append(styleTag);
        console.log('injected css:', css);
    }
    injectCSS(
        '#_area_overlay{' +
        'display: none; position: absolute; pointer-events: none; ' +
        'top: 0: left: 0; z-index:10; ' +
        'background: rgba(255, 0, 0, 0.3); ' +
        '} ' +
        '._stupid_btn{'+
        'vertical-align: top; font-weight: bold; ' +
        'width: auto !important; '+
        'padding-right: 5px; padding-left: 5px;' +
        '}'
    );
    
    var _is_down = false;
    var _area_updating = false;
    var sx,sy;
    var sx_,sy_;
    var ex,ey;
    var scale = 1;
    var overlay;
    var _is_cropped = false;
    
    function scale_video(x, y, scale) {
        injectCSS('.video-stream{ transform: ' +
                  'translate(-50%, -50%) ' +
                  'scale(' + scale + ') ' +
                  'translate(50%, 50%) ' +
                  'translate(-' + x + '%, -' + y + '%)' +
                  '}');
    }
    function _update_area() {
        var player = $('.video-stream');
        var vwidth = player.width();
        var vheight = player.height();
        scale_video(sx, sy, scale);
        overlay.css('display', 'none');
        _area_updating = false;
    }
    
    function setup_cropper(){
        if(DEBUG) console.debug('Try setting up cropper.');
        if( $('.video-stream').length == 0) return;
        if(DEBUG) console.debug('Video stream found.');
        overlay = $('#_area_overlay');
        if(overlay.length > 0){
            if(DEBUG) console.debug('Overlay already present.');
        }else{
            if(DEBUG) console.debug('Creating overlay.');
            overlay = $('<div id="_area_overlay"></div>');
            $('body').append(overlay);
            
            if(DEBUG) console.debug('Adding buttons.');
            // we just assume if there is no overlay there are also no new buttons.
            $('.ytp-right-controls').prepend('<button class="_stupid_btn ytp-button" title="Crop video" id="_btn_crop">Crop</button>');
            
            // area calculation
            if(DEBUG) console.debug('Setting up area calulation event handler.');
            sx = sy = ex = ey = sx_ = sy_ = 0;
            $('#player').mousedown(function (e) {
                if (!_area_updating) return;
                _is_down = true;
                var vwidth = $('.video-stream').width();
                var vheight = $('.video-stream').height();
                var offset = $('.video-stream').offset();
                sx_ = (e.pageX - offset.left);
                sy_ = (e.pageY - offset.top);
                sx = ((100 / vwidth) * sx_);
                sy = ((100 / vheight) * sy_);
                overlay.css('top', e.pageY + 'px');
                overlay.css('left', e.pageX + 'px');
            });
            $('#player').mouseup(function (e) {
                if ((!_area_updating) || (!_is_down)) return;
                _is_down = false;
                _update_area();
            });
            $('#player').mousemove(function (e) {
                if ((!_area_updating) || (!_is_down)) return;
                var vwidth = $('.video-stream').width();
                var offset = $('.video-stream').offset();
                ex = (e.pageX - offset.left);
                ey = (e.pageY - offset.top);
                scale = (vwidth * 1) / (ex - sx_);
                overlay.css('width', (ex - sx_) + 'px');
                overlay.css('height', (ey - sy_) + 'px');
            });
            $('#player').mouseleave(function (e) {
                if ((!_area_updating) || (!_is_down)) return;
                _is_down = false;
                _update_area();
            });
            
            // UI buttons
            var btn = "#_btn_crop";
            if(DEBUG){
                console.debug('Setting up UI button handler.');
                var button = $('<button id="_dbg_btn"><h2>CROP</h2></button>');
                $('#player').prepend(button);
                btn += ", #_dbg_btn";
            }
            
            $(btn).click(function (e) {
                if(_is_cropped){
                    injectCSS('.video-stream{ transform:translate(-' + 0 + '%, ' + 0 + '%) scale(1) }');
                    _is_cropped = false;
                    $(btn).text('Crop');
                    return;
                }
                $(btn).text('Uncrop');
                overlay.css('display', 'block');
                _is_cropped = true;
                _area_updating = true;
            });
        }
    }
    addEventListener("spfdone", setup_cropper);
    setup_cropper();
}) ();
