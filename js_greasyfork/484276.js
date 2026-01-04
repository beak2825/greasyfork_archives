// ==UserScript==
// @name         GGn Upload PostImage
// @namespace    https://greasyfork.org/
// @license      MIT
// @version      1.2
// @description  Adds PostImage Buttons next to PTPImage It upload buttons
// @author       drlivog
// @match        https://gazellegames.net/upload.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM.xmlHttpRequest
// @connect      postimages.org
// @connect      postimg.cc
// @downloadURL https://update.greasyfork.org/scripts/484276/GGn%20Upload%20PostImage.user.js
// @updateURL https://update.greasyfork.org/scripts/484276/GGn%20Upload%20PostImage.meta.js
// ==/UserScript==

/* eslint-env jquery */
/* jshint esversion: 11 */

(function() {
    'use strict';
    addPostImageBtns();
    $('a:contains("+")').on('click', () => { addPostImageBtns(); } );
    document.querySelector('#categories').addEventListener('change', () => {
        window.setTimeout(()=>{
            addPostImageBtns();
            $('a:contains("+")').on('click', () => { addPostImageBtns(); } );
        }, 500);
    });
})();

function addPostImageBtns() {
    $('#image_block span').each( (index, element) => {
        if ($(element).find('.postimage').length > 0) {
            return; //Already has postimage button.
        }
        $(element).append(`<input type="button" id="postImage${index}" class="postimage" value="PostImage It">`);
        $('#postImage'+index).on("click", ()=>{
            uploadPostImage( $('#postImage'+index).parent().children('input[name="screens[]"]').eq(0).val(), (r) => {
                if (r.status === 200) {
                    try {
                        if (r.response.status === 'OK') {
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: r.response.url,
                                onload: ra => {
                                    const x = new DOMParser().parseFromString(ra.responseText, "text/html");
                                    $('#postImage'+index).parent().children('input[name="screens[]"]').eq(0).val(x.getElementById("code_direct")?.value);
                                }
                            });
                        } else {
                            alert('Unable to upload image to PostImage!');
                            console.log(r);
                            console.log($('#postImage'+index).parent().children('input[name="screens[]"]').eq(0).val());
                        }
                    } catch(e) {
                        alert('ERR: Unable to upload image to PostImage!');
                        console.log($('#postImage'+index).parent().children('input[name="screens[]"]').eq(0).val());
                    }
                }
                return false;
            });
        });
    });
    if ( $('#image').parent().find('.postimage').length === 0 ) {
        $('#image').parent().children('input[value="PTPImg It"]').eq(0).after('<input type="button" id="postImageCover" class="postimage" value="PostImage It">');
        $('#postImageCover').on('click', () => {
            uploadPostImage($('#image').val(), (r) => {
                if (r.status === 200) {
                    try {
                        if (r.response.status === 'OK') {
                            GM.xmlHttpRequest({
                                method: 'GET',
                                url: r.response.url,
                                onload: ra => {
                                    const x = new DOMParser().parseFromString(ra.responseText, "text/html");
                                    $('#image').val(x.getElementById("code_direct")?.value);
                                }
                            });
                        } else {
                            alert('Unable to upload image to PostImage!');
                            console.log($('#image').val());
                        }
                    } catch(e) {
                        alert('Unable to upload image to PostImage!');
                        console.log($('#image').val());
                    }
                }
                return false;
            });
        });
    }
}

function uploadPostImage(url, callback) {
    const data = {
        token: "61aa06d6116f7331ad7b2ba9c7fb707ec9b182e8",
        upload_session:	rand_string(32),
        url: url,
        numfiles: "1",
        gallery: "",
        code: "hotlink",
        ui: "",
        optsize: "0",
        expire: "0",
        session_upload: Date.now().toString()
    };
    GM.xmlHttpRequest({
        method: 'POST',
        headers: {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        url: "https://postimages.org/json/rr",
        responseType: 'json',
        data: serialize(data),
        onload: ( response => {callback(response);})
    });

    function rand_string(length) {
        var str = "";
        var possibles =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < length; i++) {
            str += possibles.charAt(Math.floor(Math.random() * possibles.length));
        }
        return str;
    }

    function serialize (obj, prefix) {
        var q = [];
        for (var p in obj) {
            if (!obj.hasOwnProperty(p)) {
                continue;
            }
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            q.push(
                typeof v == "object"
                ? serialize(v, k)
                : encodeURIComponent(k) + "=" + encodeURIComponent(v)
            );
        }
        return q.join("&");
    }
}