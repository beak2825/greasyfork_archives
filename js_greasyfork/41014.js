// ==UserScript==
// @name         Google Plus Image Download Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://plus.google.com/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/41014/Google%20Plus%20Image%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/41014/Google%20Plus%20Image%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = `
._post-image-download {
    margin: 20px;
    text-align: right;
    position: relative;
    overflow: hidden;
}
._post-image-download a {
    color: #000000;
    padding: 0;
    line-height: 36px;
    width: 36px;
    height: 36px;
    display: block;
    text-align: center;
    float: right;
    font-size: 24px;
    border-radius: 50%;
    background-color: #eee;
}
`;
    $('head').append('<style type="text/css">' + css + '</style>');

    function addDownloadButtons() {
        //$('._post-image-download').remove();
        $('.SlwI7e').each(function() {
            if ( $('._post-image-download', this).length > 0 ) return;
            var img = $('img', this);
            if (img.length == 1) {
                var url = img[0].src.replace(/\/w[0-9]+-h[0-9]+[^\/]*\//, '/w9999-h9999/');
                $(this).append('<div class="_post-image-download"><a target="_blank" href="'+url+'">&#128426;</a></div>');
            } else {
                $(this).append('<div class="_post-image-download">error</div>');
            }
            //console.log(this);
        });
    }

    addDownloadButtons();
    setInterval( addDownloadButtons, 1000 * 4 );


})();