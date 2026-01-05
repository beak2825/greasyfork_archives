// ==UserScript==
// @name           Facebookenlarge
// @namespace      http://userscripts.org/users/23652
// @description    Enlarges pictures when you roll over them
// @include        http://*.facebook.com/*
// @include        https://*.facebook.com/*
// @include        http://facebook.com/*
// @include        https://facebook.com/*
// @copyright      JoeSimmons
// @version        1.0.7
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require        https://greasyfork.org/scripts/1885-joesimmons-library/code/JoeSimmons'%20Library.js?version=4838
// @require        https://greasyfork.org/scripts/2817-jsl-ajax-plugin/code/JSL%20-%20AJAX%20plugin.js?version=7911
// @grant          GM_xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/2819/Facebookenlarge.user.js
// @updateURL https://update.greasyfork.org/scripts/2819/Facebookenlarge.meta.js
// ==/UserScript==

/* CHANGELOG ////////////////////////////////////////

1.0.7 (11/12/2014)
    - fixed problem with some images not showing up at all
        it was because the script couldn't differentiate between good responses and empty responses
        some working images had an HTTP status of 0, and so did empty responses
        I've now switched to a GET request and just check if the response text is empty or not
        It not only preloads the image, but it can 100% check if the modified (large) image is working

1.0.6 (7/1/2014)
    - fixed feature to not show enlarged thumbnail in fullscreen view or on album image hover
    - fixed another small error with displaying some images

1.0.58 (6/26/2014)
    - fixed an error with displaying some images (removed "v/t1.0-1/" out of url)
    - made it not show a popup when the popup url is the same as the hovered url
          this prevents a popup when hovering over a photo in full screen viewing mode
    - added a small system to check if the enlarged url exists - if not, the user will
          be shown the thumbnail in the popup (no enlargement because it's not possible)
          instead of a small, empty, black box

1.0.57 (4/6/2014)
    - fixed a problem with banners (on shared pages boxes) unable to be enlarged

1.0.56 (3/28/2014)
    - fixed a problem with hovering over the "Photos" thumbnail on a page
    - fixed a problem with some thumbnails on the "About" page

1.0.55 (3/22/2014)
    - fixed an issue where hovering over someone's cover photo wouldn't show it

1.0.54 (3/20/2014)
    - allowed enlarging of the banner picture above "Like Page" button
    - adapted to the newest JSL

1.0.53 (9/13/2013)
    - added more image compatibility

1.0.52 (9/12/2013)
    - updated the 'ispic' RegExp

1.0.51
    - fixed the 'ispic' RegExp. some pics weren't getting matched

1.0.50
    - fixed a bug wherein the preview wouldn't always display in the correct corner
    - fixed a bug wherein some pictures would display incorrectly
    - updated HQ pic getting methods so that it shows the biggest picture possible (without ajax)
    - added a method so that the preview would never overlap the mouse cursor
    - now middle & right clicking don't hide the preview, only left-clicking

1.0.49
    - fixed a regexp bug that would cause some pictures to not show
    - added an anonymous function wrapper
    - updated GM_addStyle check/function

*/ //////////////////////////////////////////////////




// By: Ian Williams and edited for Facebook by JoeSimmons

(function () { // anonymous function wrapper

    'use strict';

    var delay = 400,
        coords = {
            'x' : 0,
            'y' : 0
        },
        size = /([\d_]{5,})([_\/])[qstna]([_\.])?/i,
        ispic = /https?:\/\/((fbcdn-)?(profile|s?(photos|content)-\w|s(photos|content))((-\w+)+)?(\.ak|\.xx)?\.(fbcdn|akamaihd))\.net\/(.*\/)+.*([_\/][qstna]([\._])?)?.*(jpe?g|[tg]iff?|bmp|png)([?&][a-z]+=[a-zA-Z0-9]+)*/i,
        rFbexternal = /&(cfs|upscale)(=[^&]+)?/g,
        XbyX = /(v\/t[^\/]+\/)?(\w(\d+\.)+\d+\/)?\w\d{2,4}x\d{2,4}\//,
        c = /\w(\d+\.)+\d+\//,
        app = /www\/app_full_proxy\.php/,
        show_d, // timeout holder
        docFrag = document.createDocumentFragment();

    // Debug by JoeSimmons
    function debug() {
        var d = document.getElementById('debugT'),
            body = document.body,
            strings = [], i, arg;

        for(i = 0; i < arguments.length; i += 1) {
            arg = arguments[i];
            if ( (typeof arg === 'string' ? arg.trim() !== '' : arg ) ) {
                strings.push(arg);
            }
        }
        
        if (!d && body) {
            d = document.createElement('pre');
            d.id = 'debugT';
            d.setAttribute('style', 'position: fixed; width: 97%; height: 20%; margin: 0 1% 6px 1%; padding: 5px; color: #000000; background: #E6F4FF; border: 3px double #0099FF; border-top: 0; z-index: 999999; scroll-y: auto; overflow: auto; white-space: pre-wrap;');
            d.textContent = '[Debug Window 2.0 - Drag box to read fully - Copyright Joe Simmons \'CC BY-ND 3.0\']\n\n\n\n' + strings.join('\n\n');
            d.addEventListener('dblclick', function (e) {e.target.style.display = 'none';}, false);
            body.insertBefore(d, document.body.firstChild);
            } else {
                d.textContent += '\n\n--------------------------------------------------\n\n' + strings.join('\n\n');
            }

        if (d.style.display === 'none') d.style.display = 'block';
    }

    function primeThumbs() {
        JSL('//a[@data-hovercard]/img/..').removeAttribute('data-hovercard');
    }

    // record mouse movement for positioning the preview images
    function handleMove(event) {
        coords.x = event.pageX - pageXOffset;
        coords.y = event.pageY - pageYOffset;
        event.stopPropagation();
    }

    function show(src) {
        var pop = JSL('#picPop'),
            x = coords.x,
            y = coords.y,
            isTop = y < (window.innerHeight / 2), // is mouse at top?
            isLeft = x < ( (window.innerWidth - 15 /* 15 is the scrollbar width, approx. */) / 2), // is mouse at left?
            maxWidth = (isLeft ? (window.innerWidth - x) : x) - 25, // keep the image at least 25px away from the cursor
            vert, hori;

        // make sure the preview doesn't show beyond the browser dimensions or overlap the mouse cursor
        // this alone only limits the max-width, but coupled with the 4-corner system, it works
        pop.css('max-width', maxWidth + 'px');

        // set the preview's source url
        pop.attribute('src', src);

        // determine where the preview should display according to hovered image's position
        // ideally, as far away from the hovered image as possible
        vert = isTop ? 'bottom' : 'top';     // should the preview be on the top or bottom?
        hori = isLeft ? 'right' : 'left';    // should the preview be on the left or right?

        // reset the position of the hover box
        pop.css('top', 'auto').css('right', 'auto').css('bottom', 'auto').css('left', 'auto');

        // set the corner it will appear in
        pop.css(vert, '0').css(hori, '0');

        // show the preview
        pop.show('block');
    }

    function handleMouseover(event) {
        var t = event.target,
            tag = t.tagName.toLowerCase(),
            style = t.getAttribute('style'),
            _class = t.className,
            src = style && style.match(ispic) ? t.getAttribute('style') : unescape(t.src),
            imgExist = JSL('./img | ./i | ./div/img | ./span/img', t),
            odd = JSL('./../img | ./../i | ./../../div[@class="detail"]/i[@class="photo" and contains(@style, "background-image")]', t),
            ohoe = JSL('./ancestor::a[( contains(@href, "oh=") and contains(@href, "oe=") ) or ( contains(@href, "oh%3D") and contains(@href, "oe%3D") )]', t),
            snowlift = JSL('#photos_snowlift'),
            goThroughWithShow, hqImg;

        // checks if enlarged thumbnail's url exists before showing it
        function checkSource(res) {
            if (res.responseText === '') {
                // if the enlarged thumbnail url has a problem, show the original thumbnail instead
                hidePicPop();
                show_d = window.setTimeout(show, 200, this);
            }
        }

        // sometimes the hovered element can be a parent element of the actual thumbnail element
        if (imgExist.exists) {
            t = imgExist[0];
            src = unescape(t.src);
            tag = t.tagName.toLowerCase();

            if ( src.indexOf('fbexternal') !== -1 && src.match(ispic) ) {
                src = src.match(ispic)[0].replace(rFbexternal, '');
            }
        }

        if (ohoe.exists) {
            src = decodeURIComponent( ohoe.attribute('href') ).split('&src=')[1].split('&smallsrc=')[0];
        }

        // support for elements that when hovered over, aren't the image itself
        // or it's an element where it displays the image by css' background-image
        if ( tag === 'div' && (['coverBorder', 'mat'].indexOf(_class) !== -1) ) {
            if (odd.exists) {
                t = odd[0];
                tag = t.tagName.toLowerCase();
                style = t.getAttribute('style');

                if (tag === 'i' && typeof style === 'string' && style.indexOf('background-image') !== -1) {
                    src = style.match(ispic)[0];
                } else {
                    src = unescape(t.src);
                }
            }
        }

        if ( ['img', 'i'].indexOf(tag) !== -1 && src.match(ispic) ) {
            if ( tag === 'img' && src.match(app) ) {
                src = src.match(ispic)[0];
            }

            hqImg = ohoe.exists ? src.replace(XbyX, '') : hq(t, tag, src);
            goThroughWithShow = true;

            // debug( src.match(ispic) != null ? 'src is recognized\norig url: ' + src + '\nhq url:   ' + hqImg : 'src is NOT recognized' );
        } else if ( tag === 'div' && t.className == 'UIMediaItem_PhotoFrame' && t.parentNode.parentNode.parentNode.getAttribute('style').match(ispic) ) {
            hqImg = hq(t, tag);
            goThroughWithShow = true;
        }

        // make sure we don't show enlarged thumbnails for album or fullscreen view images
        if (t.className.indexOf('spotlight') !== -1 || JSL(t).parent('#imagestage').exists) {
            goThroughWithShow = false;
        }

        // if we chose to show the image, let's go through that process
        if (goThroughWithShow === true) {
            // show the image if it's indeed a facebook thumbnail
            // and the enlarged url is not the same as the thumbnail url
            show_d = window.setTimeout(show, delay, hqImg);

            // let's send a quick request to see if this is a valid image
            // if not, we just show the original thumbnail
            // ps: this not only preloads the image, but it's a sure-fire way
            //     of knowing if it's a false positive or not (e.g., status==0 but image displays fine)
            JSL.ajax(hqImg, {
                context : src,
                method : 'GET',
                onload : checkSource,
                onerror : checkSource
            });
        }

        event.stopPropagation();
    }

    function hidePicPop(event) {
        var picPop = JSL('#picPop');

        // don't hide the enlarged picture if a middle or right click happens
        if (typeof event !== 'undefined' && typeof event.which === 'number' && event.which > 1) { return; }

        window.clearTimeout(show_d);

        picPop.hide();
        picPop.removeAttribute('src');

        if (typeof event !== 'undefined') {
            event.stopPropagation();
        }
    }

    function hq(e, tag, src) {
        var r = '', style = e.getAttribute('style');

        switch (tag) {
            case 'div': {
                r = e.parentNode.parentNode.parentNode.getAttribute('style').match(ispic)[0];
                break;
            }

            case 'img': case 'i': {
                if ( typeof style === 'string' && style.match(ispic) ) {
                    r = style.match(ispic)[0];
                } else if (typeof src === 'string') {
                    r = src;
                } else {
                    r = e.src;
                }

                break;
            }
        }

        return r.replace(XbyX, '').replace(c, '').replace(size, '$1$2n$3');
    }

    function info(i) {
        var info = JSL('#infoBox');

        i = (i + '').replace(/[\n\r]/g, '\n<br />\n');

        info.show('block').prop('innerHTML', i);
    }

    // Make sure the page is not in a frame
    if (window.self !== window.top) { return; }

    JSL.addStyle('' +
        '#picPop { ' +
            'z-index: 99999; ' +
            'position: fixed; ' +
            'background: #000000; '+
            'overflow: hidden; ' +
            'border: 2px solid #000000; ' +
            'outline: 2px solid #FFFFFF; ' +
            'max-height: 98%; ' +
        '}\n\n' +
        '.HovercardOverlay, ._5uek, ._7m4, ._8xh, ._3aml, #fbProfileCover .coverBorder { ' +
            'display: none !important; ' +
        '}' +
    '');

    // add the info box
    docFrag.appendChild( JSL.create('span', {id: 'infoBox', style: 'border: 1px solid #666666; border-radius: 6px; position: fixed; top: 4px; left: 45%; font-size: 10pt; font-family: sans-serif, arial; background: #EEEEEE; color: #000000; padding: 10px; z-index: 999999; overflow: auto; display: none;'}) );

    // add the hovering bigger image holder
    docFrag.appendChild( JSL.create('img', {id: 'picPop', style: 'display: none;', 'class':'hover_img_thumb'}) );

    document.body.appendChild(docFrag);

    // keep tabs on where the mouse is so we never problems with the positioning of the preview
    window.addEventListener('mousemove', handleMove, false);

    // hover over a thumbnail
    window.addEventListener('mouseover', handleMouseover, false);

    // hide the preview when moving the mouse off a thumbnail
    window.addEventListener('mouseout', hidePicPop, false);

    // hide the preview when left-clicking
    window.addEventListener('click', hidePicPop, false);

    primeThumbs();
    JSL.setInterval(primeThumbs, 1000);

}());