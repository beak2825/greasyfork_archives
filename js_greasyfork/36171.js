// ==UserScript==
// @name         Bumpeador Voxed
// @namespace    voxed.bump
// @version      0.1
// @description  Bumpeador de vox. Te posicionas en un vox y envía comentarios.
// @author       Voxero
// @match        http://www.voxed.net/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36171/Bumpeador%20Voxed.user.js
// @updateURL https://update.greasyfork.org/scripts/36171/Bumpeador%20Voxed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var comments = [
        "me chupa la pija pichón",
        "jijo",
        "12 añitos el OP",
        ">hide",
        "me chupa la concha (soy mujer)",
        "cerrá el orto mogolico",
        "uff man",
        "basta Gaspar"
    ];

    function addComment(comment)
    {
        var jsXHR = new XMLHttpRequest();
        jsXHR.open( 'POST', 'http://www.voxed.net/ajax/comment/add' );
        var formData = new FormData();
        formData.append("attach", document.getElementById("attach").files[0]);
        formData.append("hash", hash);
        formData.append("content", comment);
        formData.append("youtube", "");
        jsXHR.send( formData );
    }

    function gCookie(n) {
        var name = n + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ck = decodedCookie.split(';');
        for(var i = 0; i <ck.length; i++) {
            var c = ck[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    if(gCookie('b').length > 0)
    {
        var hash = document.getElementById('hash').value;

        if(hash.length > 0)
        {
            var bump = setInterval(function () {
                if(comments.length === 0)
                {
                    clearInterval(bump);
                }
                else
                {
                    var randomComment = Math.floor(Math.random() * (comments.length -1));
                    addComment(comments[randomComment]);
                    comments.splice(randomComment, 1);
                }
            }, 11000);
        }
    }
})();