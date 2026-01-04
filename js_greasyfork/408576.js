// ==UserScript==
// @name         Login With Token
// @namespace    https://leaked.wiki/
// @version      0.1
// @description  Adds a button to login with a token.
// @author       Sango
// @match        *://discord.com/login*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/408576/Login%20With%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/408576/Login%20With%20Token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        var item = '<div class="marginTop20-3TxNs6 marginBottom20-32qID7"><h5 class="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP">Token</h5><div class="inputWrapper-31_8H8"><input id="tokenin" class="inputDefault-_djjkz input-cIJ7To" name="token" type="token" placeholder="Token Here.." aria-label="Token" autocomplete="off" maxlength="999" spellcheck="false" value="" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAZ9JREFUOBGVU7uKwkAUPXmID5AttNyFYBGwsLGwFBUFF/wOhfyE5jPcxkZt/IHFxg+wsZJtrFwS8NWIohZm545xNkp8XcjMnbnnnJk790YyTfPTcZwm+z7whEmSNGWwaqPR+Ca4/AqZCO5BX+STkcBTJ5/gp9HLkb2BR34kEoGu6xewlwQ0TUOxWPQXCIVCIhAMBsEeS6y9MbHpOirNlUoF6XQanU4Hq9UKhmHAsiy0Wq2L2DWZ1i+l4Ccg1et1hwJ0zd1uxzGUwn6/98OLPZbiL1vUxA3OZEI8IhOGlfKdTU3+BrThZ5lMBoVCAev1Gr1eD7PZDIFAALIs80NIRNzAT4DIw+EQm80G2WyWQ1KpFHK5nICr1NvezhIR5iyXSyQSCUSjUSiKgnK5jGQyCVVVEYvF0O12oeTz+R+GJfk3L5n8yWTC+yEej3OxwWCA4/GI7XaLfr/P0/jvlis2VadUKvH+IFK73YZt2yCxcDiM6ZR+SuDuI45GI4zHY8zncxwOB05YLBZ8Pg83BajOjEilummEuVeFmtssvgJurPYHGEKbZ/T0eqIAAAAASUVORK5CYII=&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;"></div></div><button type="button" id="tlogin" class="marginBottom20-32qID7 button-3k0cO7 button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeLarge-1vSeWK fullWidth-1orjjo grow-q77ONN"><div class="contents-18-Yxp">Login With Token</div></button>'
        $(item).prependTo('.block-egJnc0');

        document.getElementById("tlogin").addEventListener("click", function(){
            var token = document.getElementById("tokenin").value;
            window.localStorage = document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage;
            window.setInterval(() => window.localStorage.token = `"${token}"`);
            window.location.reload();
        });
    });


})();