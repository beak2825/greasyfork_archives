// ==UserScript==
// @name         ZeroTolerance Grid View (fixed)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows all photos in a true grid overlay (fixed selectors) on ZeroToleranceFilms photosets.
// @match        https://members.zerotolerancefilms.com/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533447/ZeroTolerance%20Grid%20View%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533447/ZeroTolerance%20Grid%20View%20%28fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentCarouselImages = [];
    let gridScrollPosition = 0;

    // Hide the React overlay container (once we've pulled URLs)
    function hideDefaultCarousel() {
        const overlay = document.getElementById('pageOverlaySlot');
        if (overlay) overlay.style.display = 'none';
    }

    // Pull URLs from the overlay
    function extractCarouselImages() {
        const overlay = document.getElementById('pageOverlaySlot');
        const imgs = overlay.querySelectorAll('img');
        return Array.from(imgs).map(i => i.src).filter((v,i,a)=> v && a.indexOf(v)===i);
    }

    // Step through overlay arrows only
    function loadAllCarouselImages(callback) {
        const overlay = document.getElementById('pageOverlaySlot');
        const img = overlay.querySelector('img');
        if (!loadAllCarouselImages.startSrc && img) {
            loadAllCarouselImages.startSrc = img.src;
        }
        const nextArrow = overlay.querySelector('a.next-Link:not(.disabled-Link)');
        // if we’ve looped back to the first src, we’re done
        if (loadAllCarouselImages.called && img && img.src === loadAllCarouselImages.startSrc) {
            return callback();
        }
        loadAllCarouselImages.called = true;
        if (nextArrow) {
            nextArrow.click();
            setTimeout(() => loadAllCarouselImages(callback), 500);
        } else {
            callback();
        }
    }

    // Build the grid overlay
    function createOverlayContainer(images) {
        let c = document.getElementById('ztGridOverlay');
        if (c) c.remove();

        c = document.createElement('div');
        c.id = 'ztGridOverlay';
        Object.assign(c.style, {
            position:'fixed', top:0, left:0,
            width:'100vw', height:'100vh',
            backgroundColor:'rgba(0,0,0,0.95)',
            backgroundColor:'black',
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(600px,1fr))',
            gap:'10px', padding:'20px', overflowY:'auto',
            zIndex:9999
        });
        c.addEventListener('scroll', ()=> {
            gridScrollPosition = c.scrollTop;
        });

        images.forEach((src,i) => {
            const cell = document.createElement('div');
            Object.assign(cell.style, {
                height:'562.5px', overflow:'hidden',
                display:'flex', alignItems:'center', justifyContent:'center'
            });
            const img = document.createElement('img');
            img.src = src;
            Object.assign(img.style, {
                maxWidth:'100%', maxHeight:'100%',
                objectFit:'contain', cursor:'pointer'
            });
            img.addEventListener('click', ()=> {
                c.remove();
                document.getElementById('ztGridClose').remove();
                createCustomCarousel(i);
            });
            cell.appendChild(img);
            c.appendChild(cell);
        });

        document.body.appendChild(c);
        // restore scroll
        setTimeout(()=> c.scrollTop = gridScrollPosition, 0);

        const btn = document.createElement('button');
        btn.id = 'ztGridClose';
        btn.textContent = 'Close Grid';
        Object.assign(btn.style, {
            position:'fixed', top:'20px', right:'20px',
            padding:'10px 20px', fontSize:'16px',
            cursor:'pointer', zIndex:10000
        });
        btn.addEventListener('click', ()=> {
            c.remove();
            btn.remove();
        });
        document.body.appendChild(btn);
    }

    // Build a simple zoom/drag carousel
    function createCustomCarousel(startIndex) {
        const overlay = document.getElementById('pageOverlaySlot');
        // hide the React version
        hideDefaultCarousel();

        let idx = startIndex, scale=1, tx=0, ty=0, sx, sy;
        const wrapper = document.createElement('div');
        Object.assign(wrapper.style, {
            position:'fixed',top:0,left:0,
            width:'100vw',height:'100vh',
            backgroundColor:'black',
            display:'flex',alignItems:'center',justifyContent:'center',
            overflow:'hidden',zIndex:10000
        });

        const img = document.createElement('img');
        img.src = currentCarouselImages[idx];
        Object.assign(img.style, {
            maxWidth:'90%', maxHeight:'90%',
            objectFit:'contain', cursor:'grab',
            transformOrigin:'0 0'
        });
        img.draggable = false;

        // wheel zoom
        img.addEventListener('wheel', e => {
            e.preventDefault();
            const r = e.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.max(1, scale + r);
            const rect = img.getBoundingClientRect();
            const ox = e.clientX - rect.left, oy = e.clientY - rect.top;
            const ratio = newScale/scale;
            tx = ox - ratio*(ox - tx);
            ty = oy - ratio*(oy - ty);
            scale = newScale;
            img.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
        });

        // drag
        img.addEventListener('mousedown', e => {
            e.preventDefault();
            sx = e.clientX - tx;
            sy = e.clientY - ty;
            document.addEventListener('mousemove', ondrag);
            document.addEventListener('mouseup', offdrag);
        });
        function ondrag(e) {
            tx = e.clientX - sx;
            ty = e.clientY - sy;
            img.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
        }
        function offdrag() {
            document.removeEventListener('mousemove', ondrag);
            document.removeEventListener('mouseup', offdrag);
        }

        wrapper.appendChild(img);

        ['‹','›'].forEach((sym,dirIdx)=> {
            const btn = document.createElement('button');
            btn.textContent = sym;
            Object.assign(btn.style, {
                position:'absolute',
                [dirIdx===0?'left':'right']:'20px',
                top:'50%', transform:'translateY(-50%)',
                fontSize:'30px', background:'transparent',
                border:'none', color:'white', cursor:'pointer',
                zIndex:10001
            });
            btn.addEventListener('click', ()=> {
                scale=1; tx=0; ty=0;
                idx = (idx + (dirIdx===0?-1:1) + currentCarouselImages.length) % currentCarouselImages.length;
                img.src = currentCarouselImages[idx];
                img.style.transform = 'translate(0,0) scale(1)';
            });
            wrapper.appendChild(btn);
        });

        const close = document.createElement('button');
        close.textContent = 'Close Carousel';
        Object.assign(close.style, {
            position:'fixed', top:'20px', right:'20px',
            padding:'10px 20px', fontSize:'16px',
            cursor:'pointer', zIndex:10002
        });
        close.addEventListener('click', ()=> {
            wrapper.remove();
            close.remove();
            createOverlayContainer(currentCarouselImages);
        });

        document.body.appendChild(wrapper);
        document.body.appendChild(close);
    }

    // Main toggle routine
    function toggleOverlay() {
        // first, walk the React overlay
        loadAllCarouselImages(() => {
            const images = extractCarouselImages();
            currentCarouselImages = images.slice();
            if (images.length) {
                // now hide React and show our grid
                hideDefaultCarousel();
                createOverlayContainer(images);
            } else {
                alert('No carousel images found.');
            }
        });
    }

    // Ensure overlay is open, then toggle
    function launchGridOverlay() {
        const overlayImg = document.querySelector('#pageOverlaySlot img');
        if (overlayImg) {
            toggleOverlay();
        } else {
            // click first thumbnail to open React lightbox
            const thumb = document.querySelector('.ListingGrid-ListingGridItem img');
            if (!thumb) return alert('No gallery images found.');
            thumb.click();
            const iv = setInterval(() => {
                if (document.querySelector('#pageOverlaySlot img')) {
                    clearInterval(iv);
                    toggleOverlay();
                }
            }, 300);
        }
    }

    // Inject the “Grid View” button next to the title
    function addGridButton() {
        const sel = 'h1.Title.PhotosetGallery-PhotosetTitle-Title';
        const insert = () => {
            const h1 = document.querySelector(sel);
            if (h1 && !document.getElementById('ztGridBtn')) {
                const btn = document.createElement('button');
                btn.id = 'ztGridBtn';
                btn.textContent = 'Grid View';
                Object.assign(btn.style, {
                    marginLeft:'20px', padding:'8px 16px',
                    fontSize:'16px', cursor:'pointer',
                    backgroundColor:'yellow', border:'1px solid #999',
                    borderRadius:'4px', fontWeight:'bold'
                });
                btn.addEventListener('click', launchGridOverlay);
                h1.parentNode.insertBefore(btn, h1.nextSibling);
                return true;
            }
            return false;
        };
        if (!insert()) {
            const obs = new MutationObserver((m,o)=> {
                if (insert()) o.disconnect();
            });
            obs.observe(document.body,{childList:true,subtree:true});
            setInterval(insert, 500);
        }
    }

    if (document.readyState!=='loading') addGridButton();
    else document.addEventListener('DOMContentLoaded', addGridButton);

})();
