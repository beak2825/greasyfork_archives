// ==UserScript==
// @name         Bunkr Image Viewer
// @namespace    https://bunkr-albums.io/
// @version      1.0.2
// @description  Bunkr-Albums: adding nice image viewer, simple yet great functionality. Try it: double-click for instant full res zoom, mouse wheel scroll to +\- zoom, etc.
// @author       stasgrin
// @match        https://bunkr.ac/*
// @match        https://bunkr.ci/*
// @match        https://bunkr.si/*
// @match        https://bunkr.black/*
// @match        https://bunkr.ax/*
// @match        https://bunkr.fi/*
// @match        https://bunkr.site/*
// @match        https://bunkr.pk/*
// @match        https://bunkr.ps/*
// @match        https://bunkr.ph/*
// @match        https://bunkr.cr/*
// @icon         https://dash.bunkr.pk/assets/img/icon.svg
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.min.js
// @resource     REMOTE_CSS https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519419/Bunkr%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/519419/Bunkr%20Image%20Viewer.meta.js
// ==/UserScript==

const viewerjsCss = GM_getResourceText("REMOTE_CSS");
GM_addStyle(viewerjsCss);

$(window).on('load', function() {
    console.log('Bunkr viewer: started');
    let images = $('body main figure > img');
    if(images){
        // TODO: gallery viewer
        /*    images.each(function(i) {
            try{
                console.log('Bunkr viewer: image found', images[i]);
                const viewer = new Viewer(images[i]);
                images[i].on('click', viewer.show());
            }
            catch(err) {
                console.log('Bunkr viewer: image fetch failed');
            }
        });*/
        try{
            const viewer = new Viewer(images[0],{toolbar: false,navbar:false,title:false});
            images[0].on('click', viewer.show());
        }
        catch(err) {
            console.log('Bunkr viewer: image fetch failed');
        }
    }
    console.log('Bunkr viewer: ended');
});