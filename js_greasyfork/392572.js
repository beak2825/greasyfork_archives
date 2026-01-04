// ==UserScript==
// @name         e621 Thumbnail Enhancer
// @version      1.01
// @description  Resizes thumbnails on e621.net, replacing them with higher resoltion images and adding support for video previews.
// @author       swordgedance
// @include      http://*e621.net/post*
// @include      https://*e621.net/post*
// @include      http://*e621.net/pool*
// @include      https://*e621.net/pool*
// @grant        GM.xmlHttpRequest
// @namespace    https://greasyfork.org/de/users/398891
// @downloadURL https://update.greasyfork.org/scripts/392572/e621%20Thumbnail%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/392572/e621%20Thumbnail%20Enhancer.meta.js
// ==/UserScript==

//original rooshoos
//http://twitter.com/rooshoos



var sty =document.createElement("style");
sty.innerHTML=[
     "div.thumbEnh_cont{"
    ,"    display: grid;"
    ,"    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));"
    ,"}"
    ,"div.thumbEnh_cont span.thumb{"
    ,"    width:90%;"
    ,"    height:auto;"
    ,"}"
    ,"span.thumb img{"
    ,"    width:100%;"
    ,"    height:auto;"
    ,"}"
    // ,"span.thumb {"
    // ,"    width: 30%;" //auto;"
    // ,"    height: auto;" //250px;"
    // ,"    margin: 0 10px 10px 0;"
    // ,"}"

    ,"span.thumb .preview {"
    ,"    display: block;"
    ,"    height: auto;"//220px;"
    ,"    width: 100%;"//auto;"
    ,"}"

    ,"#child-posts-expanded-thumbs span.thumb,"
    ,"#child-posts-expanded-thumbs span.thumb .preview {"
    ,"    width: 32%;"//180px;"
    ,"    height:auto;"
    ,"}"

    ,"span.thumb .post-score {"
    ,"    width: auto !important;"
    ,"}"

    ,"span.thumb .tooltip-thumb {"
    ,"    display: block;"
    ,"    position: relative;"
    ,"}"

    ,"span.thumb .gif,"
    ,"span.thumb .video {"
    ,"    position: relative;"
    ,"    display: block;"
    ,"}"

    ,"span.thumb .gif:not(:hover)::after,"
    ,"span.thumb .video:not(:hover)::after {"
    ,"    content: '';"
    ,"    display: block;"
    ,"    position: absolute;"
    ,"    top: 0; bottom: 0; left: 0; right: 0;"
    ,"}"

    ,"span.thumb .video:not(:hover)::after {"
    ,"    background: transparent "
    ,"        url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjA2IiBoZWlnaHQ9IjIwNiIgdmlld0JveD0iMCAwIDIwNiAyMDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxjaXJjbGUgaWQ9ImIiIGN4PSI5MCIgY3k9IjkwIiByPSI5MCIvPjxmaWx0ZXIgeD0iLTUwJSIgeT0iLTUwJSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iYSI+PGZlT2Zmc2V0IGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI2LjUiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSIvPjxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93Qmx1ck91dGVyMSIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9Im91dCIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI5NDE1NzYwOSAwIiBpbj0ic2hhZG93Qmx1ck91dGVyMSIvPjwvZmlsdGVyPjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzIDEzKSI+PHVzZSBmaWxsPSIjMDAwIiBmaWx0ZXI9InVybCgjYSkiIHhsaW5rOmhyZWY9IiNiIi8+PHVzZSBmaWxsLW9wYWNpdHk9Ii44ODEiIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNiIi8+PC9nPjxwYXRoIGZpbGwtb3BhY2l0eT0iLjQiIGZpbGw9IiMwMDAiIGQ9Ik04MS41IDE0Ny42NThWNTkuMzQybDY1IDQ0LjE1OCIvPjwvZz48L3N2Zz4=)"
    ,"        no-repeat center/80px;"
    ,"}"

    ,"span.thumb .gif:not(:hover)::after {"
    ,"    content: 'GIF';"
    ,"    width: 60px;"
    ,"    height: 30px;"
    ,"    margin: auto;"
    ,"    font-size: 16px;"
    ,"    font-weight: bold;"
    ,"    line-height: 30px;"
    ,"    color: rgba(0,0,0,0.4);"
    ,"    background-color: rgba(255,255,255,0.8);"
    ,"    border-radius: 6px;"
    ,"    box-shadow: 0 0 13px rgba(0,0,0,0.29);"
    ,"}"

    ,"span.thumb .gif:hover .preview {"
    ,"    display: none !important;"
    ,"}"

    ,"span.thumb .gif:hover img.preview {"
    ,"    display: block !important;"
    ,"}"
].join("");
document.head.appendChild(sty);


(function () {
    var contDiv = document.querySelector("span.thumb").parentElement;
    contDiv.className = "thumbEnh_cont";


    function is_gif(i) {
        return /^(?!data:).*\.gif/i.test(i.src);
    }

    function freeze_gif(i) {
        var c = document.createElement('canvas');
        var w = c.width = i.naturalWidth;
        var h = c.height = i.naturalHeight;
        var p = i.parentNode;
        c.getContext('2d').drawImage(i, 0, 0, w, h);
        p.className = ['gif', p.className].join(' ');
        try {
            i.src = c.toDataURL("image/gif"); // if possible, retain all css aspects
        } catch (e) { // cross-domain -- mimic original with all its tag attributes
            replaceImg(c, i);
            i.style.display = 'none';
            p.insertBefore(i, p.firstChild);
        }
    }

    function replaceImg(e, i) {
        e.className = i.className;
        var s = window.getComputedStyle(i);
        e.style.border = s.getPropertyValue('border');
        e.style.borderRadius = s.getPropertyValue('border-radius');
        i.parentNode.replaceChild(e, i);
    }

    function setVideo(thumb, videoUrl) {
        var video = document.createElement('video'),
            parent = thumb.parentNode;
        video.controls = false;
        video.loop = true;
        video.muted = true;
        video.preload = 'metadata';
        video.addEventListener('loadedmetadata', function () {
            parent.className = ['video', parent.className].join(' ');
            parent.addEventListener('mouseenter', function () {
                video.play();
            });
            parent.addEventListener('mouseleave', function () {
                video.pause();
            });
            replaceImg(this, thumb);
        }, false);
        video.src = videoUrl;
    }

    /* Replace video thumbnails with actual playable video */
    function videoThumb(thumb, parseHTML) {
        parseHTML = parseHTML || false;
        var parent = thumb.parentNode;

        GM.xmlHttpRequest({
            method: "GET",
            url: parent.href,
            headers: {
                "Accept": "text/xml"
            },
            onload: function (response) {
                var videoUrl = null;
                if (response.readyState !== 4) return;
                if (!response.responseXML) return;

                var file_url = response.responseXML.getElementsByTagName('file_url')[0];
                if (!file_url) return;

                videoUrl = file_url.childNodes[0].nodeValue;
                setVideo(thumb, videoUrl);
            }
        });

    }

    /* Replace image thumbnails with higher resolution */
    function imageThumb(thumb) {
        var newThumb = new Image(),
            replace = function (thumb) {
                thumb.src = this.src;
                if (is_gif(thumb)) {
                    //freeze_gif(thumb);
                }
            },
            trynoSample = function (thumb) {
                this.onerror = tryGif.bind(this, thumb);
                this.src = thumb.src.replace('/preview/', '/');

            },
            tryGif = function (thumb) {
                this.onerror = null;
                this.src = thumb.src.replace('/preview/', '/').replace('.jpg', '.gif');
            };
        newThumb.onload = replace.bind(newThumb, thumb);
        newThumb.onerror = trynoSample.bind(newThumb, thumb);
        newThumb.src = thumb.src.replace('/preview/', '/sample/');
    }

    function imgError(image) {
        image.onerror = "";
        image.src = "/images/noimage.gif";
        return true;
    }

    /* Run above on all thumbnails */
    var thumbs = document.querySelectorAll('span.thumb img');
    //var typ=document.querySelectorAll('span.thumb span.type-badge');
    for (i = 0; i < thumbs.length; i++) {
        var thumb = thumbs[i];
        var badge = thumb.parentElement.querySelector("span.type-badge");
        if (badge && badge.innerHTML.toLowerCase() == "webm") {
            (function (thumb, i) {
                setTimeout(function () {
                    videoThumb(thumb);
                }, 100 * i);
            })(thumb, i);
        } else {

            imageThumb(thumb);

        }
    }
})();