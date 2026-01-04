// ==UserScript==
// @name BRS
// @namespace https://lzimul.dns.army/
// @version 1.0.1
// @description (Browser records save) 浏览器访问记录保存
// @author lZiMUl
// @include http*://*.*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439554/BRS.user.js
// @updateURL https://update.greasyfork.org/scripts/439554/BRS.meta.js
// ==/UserScript==

((global) => {
    class Upload {
        static ws = null;
        constructor({
            host,
            port
        }) {
            const ws = new WebSocket(`wss://${host}:${port}`);
            ws.addEventListener('open', () => Upload.ws = ws)
        }
        
        save(url) {
            Upload.ws.send(JSON.stringify({
                timer: new Date().getTime(),
                url
            }))
        }
    }
    
    new Update({
        host: 'lzimul.dns.army',
        port: 4433
    }).save(global.location.href);
})(window);