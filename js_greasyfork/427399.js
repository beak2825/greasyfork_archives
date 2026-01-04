// ==UserScript==
// @name         解除浏览器调试限制
// @namespace    https://www.tampermonkey.net/
// @version      0.1
// @description  解除浏览器调试限制,方便调试
// @author       liuyuno
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAM1BMVEUmN0n////X2duqrrN0fIU+S1r19vbr7O2eo6iRlp3BxMe2ub2DiZFkbXdSXWnMztHh4+TKs5gPAAABU0lEQVRo3u2U2ZKEIAxFSSKbovb/f+1AE9DxrV2qZrnnpRMKc4oQ2gAAAAAAAAAAAP+Vidiah4lENJqHCVmymoexntxgnsYOi/mDLElEtu7NMWf2cPIkkj6cx4GIpMVMb1xtYPI1nbQkl53i3jvCWclEinunIzX83CV9MZyRqOMlIry21Ichcvm1KnFELOIps5yRJKI2zFbXX7adSKokE1s0fSjpJaqjN2uuSpftVneMdT5yxCcks1ZQbDmI2e4qVYl6TWnYCYlopf3yIeatMp+QaHus6YR983K83iE5fiYHCf8eyfh99KNOa5ul6RZJ2FXtw7YJw3WJVvVmQx9Hq7jcItGn1pH+qJNeyWWJBsSpHCroOycpjhLMN0lMoIbvUsde/7BukpjoSKl37zVzyVyUzMwcNbahfPxao954YEd+DZqZiZn3IQAAAAAAAAAA8OP4ApDaB6Vrg4qvAAAAAElFTkSuQmCC
// @require      https://greasyfork.org/scripts/415668-zmquery3-5-1/code/zmQuery351.js?version=866815
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_info
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427399/%E8%A7%A3%E9%99%A4%E6%B5%8F%E8%A7%88%E5%99%A8%E8%B0%83%E8%AF%95%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/427399/%E8%A7%A3%E9%99%A4%E6%B5%8F%E8%A7%88%E5%99%A8%E8%B0%83%E8%AF%95%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';

    zmQuery(function () {
        zmQuery('body').append(`<script>
console.log = ()=> {}
window.Firebug = false;
console.clear = () => {};
</script>`)

    });

})();