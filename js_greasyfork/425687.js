// ==UserScript==
// @name         dcinside Image preview
// @namespace    http://tampermonkey.net/
// @description  Preview images in a post by hovering over its number.
// @version      0.1
// @author       leonid
// @match        https://gall.dcinside.com/*
// @downloadURL https://update.greasyfork.org/scripts/425687/dcinside%20Image%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/425687/dcinside%20Image%20preview.meta.js
// ==/UserScript==
(function() {
    function getHTML(url, callback, errorCallback) {
        const xhr = new XMLHttpRequest();

        xhr.onload = function() {
            callback(this.responseXML);
        }
        xhr.onerror = function() {
            errorCallback();
        }

        xhr.open('GET', url);
        xhr.responseType = 'document';
        xhr.send();
    }

    const loaded = {};
    $('.gall_num').each((i, obj) => {
        const url = $(obj).parent().find('a')[0];
        const popup = $('<div />').css({
            'align-items': 'center',
            'background-color': 'gray',
            'display': 'flex',
            'height': '600px',
            'justify-content': 'center',
            'margin': '-300px 0 0 -650px',
            'overflow': 'hidden',
            'position': 'absolute',
            'visibility': 'hidden',
            'width': '600px',
        });
        const content = $('<div />');
        popup.append(content);
        $(obj).append(popup);

        let shrink;
        $(obj).mouseenter(() => {
            if (!loaded[url]) {
                loaded[url] = true;
                getHTML(url, (xml) => {
                    content.append($(xml).find('.writing_view_box img,.writing_view_box video').css({
                        'height': '600px',
                        'margin': '2px',
                        'width': '',
                    }, () => {
                        loaded[url] = false;
                    }));
                });
            }
            shrink = setInterval(() => {
                if (popup.prop('scrollHeight') > popup.height() || popup.prop('scrollWidth') > popup.width()) {
                    const imgs = popup.find('img,video');
                    imgs.css('height', `${imgs.first().height() - 5}px`);
                }
            }, 5);
            popup.css('visibility', 'visible');
        }).mouseleave(() => {
            clearInterval(shrink)
            popup.css('visibility', 'hidden');
        });
    });
})();
