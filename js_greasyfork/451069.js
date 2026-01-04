// ==UserScript==
// @name         Kahoot Game Finding Loop
// @version      0.11
// @description  The fuk ee dat???!!!!
// @author       Mega-Konami
// @license      MIT
// @match        *://kahoot.it/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kahoot.it
// @namespace kahoot-game-finding-loop-mk-1l2jff
// @downloadURL https://update.greasyfork.org/scripts/451069/Kahoot%20Game%20Finding%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/451069/Kahoot%20Game%20Finding%20Loop.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {
    var code, btn, inp;
    var el = document.createElement('DIV');
    el.id = 'cds';
    document.body.appendChild(el);
    console.log('Connected!');
    window.addEventListener('load', function() {
        btn = document.querySelector('button.enter-pin-form__SubmitButton-sc-z047z0-1');
        inp = document.querySelector('input#game-input');
        function* CodeGenerator() {
            function rand(min, max) {return Math.floor(Math.random()*(max-min)+min);}
            const chars = '1234567890';
            while (true) {
                var len = 6; code = '';
                for (var i=0;i<6;i++) {
                    code += chars[rand(0,chars.length)];
                }
                var spread = code.split();
                if (spread[0]==='0') {
                    spread[0] = '1';
                    for (i in spread) {
                        code = '';
                        code += spread[i];
                    }
                }
                yield code;
            }
        }
        const gen = CodeGenerator();
        setInterval(function() {
            code = gen.next().value;
            var b = [...code];
            if (parseInt(b[0]) < 7) {
                b[0] = '7';
                code = '';
                for (var i in b) {
                    code += b[i];
                }
            }
            fetch(`https://kahoot.it/reserve/session/${code}/`, {
                method: 'GET'
            }).then(function(res) {
                console.log(typeof res.text());
                if (res.ok||res.status < 400) {
                    var e = document.createElement('SPAN');
                    e.innerHTML = code;
                    document.getElementById('cds').appendChild(e);
                }
            });
        }, 50);
    });
})();