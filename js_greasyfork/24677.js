// ==UserScript==
// @name         ObrazekZeSchowka
// @namespace    fuuYeah
// @version      0.2.6
// @description  ObrazekZeSchowka - Umożliwia wklejanie obrazku bezpośrednio z systemowego schowka podczas dodawania grafiki do wpisu na mirko lub w komentarzu
// @author       @fuuYeah / Lukasz Kowalski
// @match        https://www.wykop.pl/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24677/ObrazekZeSchowka.user.js
// @updateURL https://update.greasyfork.org/scripts/24677/ObrazekZeSchowka.meta.js
// ==/UserScript==

(function(){
    function defer(method) {
        if (window.$) {
            method();
        } else {
            setTimeout(function () {
                defer(method)
            }, 200);
        }
    }

    function initScript() {
        console.log('ObrazekZeSchowka initialised and waiting for paste events');
        $(document).on('paste', '.addMediaOverlay .embedUrl', function (event) {
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;

            for (var i in items) {
                var item = items[i];

                if (item.kind === 'file') {
                    var blob = item.getAsFile(),
                        form = new FormData(),
                        hash = wykop.params.hash,
                        url = 'https://www.wykop.pl/ajax2/embed/upload/hash/' + hash,
                        xhr = new XMLHttpRequest();

                    form.append('mf_file_undefined', blob, "wykop_pl_dodatki ObrazekZeSchowka.png");
                    form.append('file_element', 'mf_file_undefined');
                    form.append('hash', hash);

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            var r = JSON.parse(xhr.responseText.replace('for(;;);', ''));

                            for (var i in r.operations) {
                                if (r.operations[i].type === 'callback') {
                                    var fn = wykop[r.operations[i].method];
                                    if (typeof fn === 'function') {
                                        fn($('.addMediaOverlay form'), r.operations[i].data);
                                    }
                                }
                            }
                        }
                    }

                    xhr.open("POST", url);
                    xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                    xhr.send(form);
                }
            }
        })
    }

    defer(initScript);
})();