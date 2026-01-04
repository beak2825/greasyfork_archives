// ==UserScript==
// @license      MIT
// @name         E-Code
// @version      1.1
// @description  Evades Coder
// @author       0vC4
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/670183
// ==/UserScript==

const Coder = await (async () => {
    const getFile = async url => await fetch(url).then(d=>d.text());
    const use = code => new Function('return '+code)();

    eval(await getFile('https://cdn.jsdelivr.net/gh/dcodeIO/protobuf.js@6.11.2/dist/light/protobuf.min.js'));
    const appUrl = await getFile(location.href).then(d=>d.match(/app\.[a-z0-9]*\.js/)[0]);
    const mainJS = await getFile(location.href+'/'+appUrl);
    const scheme = use(mainJS.match(/(?<=\.addJSON\()\{(.|\n)+?\}(?=\);)/)[0]);

    const coder = new protobuf.Root();
    coder.addJSON(scheme);

    return {
        protobuf: coder,
        decode: {
            server(packet) {
                return coder.FramePayload.toObject(coder.FramePayload.decode(new Uint8Array(packet)));
            },
            client(packet) {
                return coder.ClientPayload.toObject(coder.ClientPayload.decode(new Uint8Array(packet)));
            }
        },
        encode: {
            server(object) {
                return coder.FramePayload.encode(object).finish();
            },
            client(object) {
                return coder.ClientPayload.encode(object).finish();
            }
        }
    };
})();