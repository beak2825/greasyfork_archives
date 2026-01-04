// ==UserScript==
// @name         Screenshot from video
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Use NumPad keys to step by frame(60/30 fps), make screenshot, flip horizontally.
// @author       befreex
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464321/Screenshot%20from%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/464321/Screenshot%20from%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function download_canvas_image2() {

        if (window.gg_img === undefined) {
            window.gg_img = document.createElement('img');

        }

        // test me more
        window.gg_img.setAttribute('crossorigin', 'anonymous')
        /*Somehow src needs to be set again in order for crossorigin to work */
    }


    function download_canvas_image() {

        let video = document.querySelector('video');
        if (video === undefined) {
            //console.log('VIDEO undefined')
            return
        }

        if (window.gg_canvas === undefined) {
            video.autoplay = false;
            window.gg_canvas = document.createElement('canvas');
            window.gg_ctx = window.gg_canvas.getContext('2d');

            window.gg_a = document.createElement('a');
            window.gg_a.target = "blank";

            // gg_canvas.style.display = 'none';
            window.gg_canvas.style.cssText = `
    display: none;
    z-index: 10000;
    position: fixed;
    left:0;
    top:0;
    width: 50vw;

    `
            window.gg_canvas.addEventListener('dblclick',()=>{
                window.gg_canvas.style.display = window.gg_canvas.style.display == 'none' ? 'block' : 'none';
            })
            document.body.appendChild(window.gg_canvas);

        }

        window.gg_canvas.width = video.videoWidth;
        window.gg_canvas.height = video.videoHeight;

        // video.setAttribute('crossorigin', 'Anonymous');
        // video.setAttribute('crossorigin', '*');

        // src_saved = video.getAttribute('src');
        // console.log('src_saved',src_saved)
        // video.setAttribute('src', src_saved);

        // gg_canvas.setAttribute('crossorigin', 'anonymous');
        // gg_canvas.setAttribute('src', video.src);

        // console.log('VIDEO undefined')
        let video_filename = video.src.match(/[^\/]*$/)
        video_filename = (video_filename == null ? '' : video_filename[0] + ' ')
        video_filename = video_filename + new Date().toISOString() + '.png'
        video_filename = video_filename.replace(/\:/g, '_')
        if(navigator.clipboard) {
            navigator.clipboard.writeText(video_filename)
        }


        window.gg_ctx.drawImage(video, 0, 0)
        try {
            let du;
            du = window.gg_canvas.toDataURL('image/png');
            window.gg_a.href = du;
            window.gg_a.download = video_filename;
            window.gg_a.click();
        } catch (e) {
            console.log(e)
            window.gg_canvas.style.display = 'block';
        }
    }

    let k_double = 1;
    // let g_filter_style = "";
    let g_filter_grayscale = false
    let g_filter_flip = false
    let g_filter_contrast = false
    let upd_style = ()=>{
        let v = document.querySelector('video');

        v.style.transform = g_filter_flip?"scaleX(-1)":""
        v.style.filter = (g_filter_grayscale?"grayscale(1) ":"") + (g_filter_contrast?"contrast(1.5) ":"");
    }
    window.addEventListener('keydown', function() {
/*         console.log(event) */
        if(event.key == "Process"){
            return
        }
        if(event.code.indexOf('Numpad') == 0){
            event.stopPropagation()
        }
        if (event.code == 'Numpad7') {
            window.gg_vscr_enabled = !window.gg_vscr_enabled;
            //console.log('vscr aft', window.gg_vscr_enabled)
        }
        if (!window.gg_vscr_enabled) {
            return
        }

        if (event.code == 'Numpad9') {
            download_canvas_image()
        } else {
            let video = document.querySelector('video');
            let k = event.shiftKey ? 10 : 1;
            switch (event.code) {
                case "Numpad8":
                    if (window.gg_canvas) {
                        window.gg_canvas.style.display = window.gg_canvas.style.display == 'none' ? 'block' : 'none';
                    }
                    break
                case "Numpad2":
                    video.currentTime -= 0.016 * k * k_double;
                    break;

                case "Numpad3":
                    video.currentTime += 0.016 * k * k_double;
                    break;

                case "Numpad4":
                    k_double = (k_double == 1 ?
                                2 :
                                (k_double == 2 ?
                                 4 :
                                 1)
                               );
                    // console.log(`k double ${k_double}`)
                    break;

                case "Numpad5":
                    video.currentTime -= (event.shiftKey ? 3 : 1);
                    break;

                case "Numpad6":
                    video.currentTime += (event.shiftKey ? 3 : 1);
                    break;

                case "Numpad1":
                    if (video.paused) {
                        video.play()
                    } else {
                        video.pause()
                    }
                    break;
                case "NumpadMultiply":
                    g_filter_flip = !g_filter_flip
                    upd_style()
                    break;
                case "NumpadSubtract":
                    g_filter_grayscale = !g_filter_grayscale
                    upd_style()
                    break;
                case "NumpadAdd":
                    g_filter_contrast = !g_filter_contrast
                    upd_style()
                    break;
            }

        }
    }, true)

    // Your code here...
})();