// ==UserScript==
// @name         instaclear
// @namespace    sanyabeat.instaclear
// @version      1.14
// @description  Lightweight script that monitors your instagram-journey and kills annoying overlays at real-time mode. It let you save photos just using default context-menu.
// @author       sanyabeast <a.gvrnsk@gmail.com>
// @match        https://www.instagram.com/
// @match        https://www.instagram.com/*
// @match        https://www.instagram.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407913/instaclear.user.js
// @updateURL https://update.greasyfork.org/scripts/407913/instaclear.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("%cinstacler works", "color: magenta")

    const video_dl_btn_style = `
        position: absolute;
        top: 4px;
        right: 4px;
        background: transparent;
        width: 30px; height: 24px;
        text-align: center;
        border: none;
        cursor: pointer;
    `;

    function trycatch ( cb ) {
        try { cb(); } catch ( err ) { console.warn( err ) }
    }

    function enable_hires(){
        trycatch ( ()=>{
            let processed_count = 0
            let image_els = document.querySelectorAll("[srcset]")
            for ( let i = 0; i < image_els.length; i++ ) {
                let img = image_els[i]
                if (!img.ic_processed){
                    img.sizes = "2000px"
                    processed_count++
                    img.ic_processed = true
                }
            }

            if (processed_count > 0 ) console.log(`%cjust enabled hi-res for ${processed_count + 1} images`, "color: cyan")
        } )

        return true
    }

    function make_videos () {
        let vids = document.querySelectorAll("video")
        let processed_count = 0
        trycatch( ()=>{
            for(let i=0;i<vids.length;i++){
                let v = vids[i]
                if (v._processed) return
                v._processed = true
                processed_count++
                let p = v.parentNode
                if (p && p.parentNode && p.parentNode.parentNode && p.parentNode.parentNode.parentNode ){
                    p = p.parentNode.parentNode.parentNode
                    let btn = parse_html(`<a href="${v.src}" target="_blank" style="${video_dl_btn_style}" class="instclr btn">💾</a>`)
                    p.appendChild(btn)
                }
            }
        } )

        if (processed_count > 0 ) console.log(`%cjust processed  ${processed_count + 1} videos`, "color: #4caf50")
        return true
    }

    function parse_html (html){ let d = document.createElement("div"); d.innerHTML = html; let dom = d.children[0]; return dom; }

    function clear_instagram () {
        trycatch ( ()=>{
            let cleared_count = 0
            let o = document.querySelectorAll("div + div");
            for ( let i=0; i<o.length; i++ ){
                if (o[i].attributes.length === 1 && o[i].children.length === 0 && o[i].style.zIndex !== "-1") {
                    cleared_count++
                    o[i].style.zIndex = "-1"
                }
            }

            if (cleared_count > 0 ) console.log(`%cjust cleared ${cleared_count + 1} emptyboxes`, "color: orange")
        } )

        return true
    }

    let observer = new MutationObserver( e => setTimeout( o => enable_hires() && clear_instagram() && make_videos(), 250) );
    observer.observe( document.body, { attributes: true, childList: true, subtree: true } );

    function fire_event (el, etype){
        if (!el) return
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }

    document.addEventListener("mousewheel", ( evt )=>{
        let view_section_el = document.querySelector("article[role=presentation] > header + div + div")
        let next_button_el = document.querySelector(".coreSpriteRightPaginationArrow")
        let prev_button_el = document.querySelector(".coreSpriteLeftPaginationArrow")

        if ( view_section_el ) {
            let class_name = view_section_el.className
            if ( evt.srcElement.closest(`.${class_name}`) ) {
                fire_event( evt.deltaY > 0 ? next_button_el : prev_button_el, "click" )
            }

        }

    })
})();