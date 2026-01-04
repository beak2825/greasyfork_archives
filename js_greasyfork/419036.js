// ==UserScript==
// @name         Bonk.io Custom Mods
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Some custom enhancements to bonk.io
// @author       You
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419036/Bonkio%20Custom%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/419036/Bonkio%20Custom%20Mods.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function () {
    'use strict';

    const pd_func = document.getElementById('maingameframe').contentWindow.Event.prototype.preventDefault;

    document.getElementById('maingameframe').contentWindow.Event.prototype.preventDefault = function() {
        const ev = this;
        if (ev.ctrlKey || ev.shiftKey || (ev.key?.[0] === 'F' && ev.key?.length > 1)) return;
        const bound_pd = pd_func.bind(ev);
        bound_pd();
    };

    let style1 = `
    <style>
        body { overflow: hidden; }
        #bonkioheader { display: none; }
        #adboxverticalleftCurse { display: none; }
        #adboxverticalCurse { display: none; }
        #descriptioncontainer { display: none; }
        #maingameframe { margin: 0 !important; }
    </style>
    `;
    document.head.insertAdjacentHTML("beforeend", style1);

    window.addEventListener('load', () => {
        let frame = document.getElementById('maingameframe');
        let frameDoc = document.getElementById('maingameframe').contentDocument;

        let setup;
        let observer = new MutationObserver((mutations, me) => {
            if (frameDoc.getElementById('roomlisttopbar')) {
                me.disconnect(); // stop observing
                setup();
                return;
            }
        });
        observer.observe(frameDoc, {
            childList: true,
            subtree: true
        });

        setup = () => {
/*
            let style1 = `
            <style>
                body { overflow: hidden; }
                #bonkioheader { display: none; }
                #adboxverticalleftCurse { display: none; }
                #adboxverticalCurse { display: none; }
                #descriptioncontainer { display: none; }
                #maingameframe { margin: 0 !important; }
            </style>
            `;
            document.head.insertAdjacentHTML("beforeend", style1);
*/
            let placeholderStyler = `
            <style>
                [contenteditable=true]:empty:before {
                    content: attr(placeholder);
                    pointer-events: none;
                    display: block; /* For Firefox */
                    color: #757575;
                }
            </style>
            `;
            frameDoc.head.insertAdjacentHTML("beforeend", placeholderStyler);

            console.log(document.head);

            let $ = frame.contentWindow.$;

            function filterRooms(s) {
                s = s.toLowerCase();
                let matches = el => el.children[0].textContent.toLowerCase().includes(s);
                $('#roomlisttable tr').each((i, el) => {
                    el.hidden = !matches(el);
                });
            }

            let inp = `<span contentEditable="true" type="text" id="roomSearchInputBox" placeholder="Search Rooms.." style="
                float: right;
                padding: 2px 8px;
                margin: 5px 20px;
                border: 2px solid #006157;
                border-radius: 5px;
                font: large futurept_b1;
                width: 20%;
                background: white;
                "></span>`;

            $('#roomlisttopbar').append(inp);

            function debounce (fn) {

                // Setup a timer
                let timeout;

                // Return a function to run debounced
                return function () {

                    // Setup the arguments
                    let context = this;
                    let args = arguments;

                    // If there's a timer, cancel it
                    if (timeout) {
                        window.cancelAnimationFrame(timeout);
                    }

                    // Setup the new requestAnimationFrame()
                    timeout = window.requestAnimationFrame(function () {
                        fn.apply(context, args);
                    });

                };

            }

            $('#roomSearchInputBox').keyup(debounce(ev => filterRooms(ev.target.textContent)));

            $('body').keydown(debounce(ev => {
                if (ev.altKey) {
                    if (ev.key === 'q' && $('#roomListContainer')[0].offsetParent === null) {
                        $('#pretty_top_exit').click(); $('#leaveconfirmwindow_okbutton').click();
                    }
                    else if (ev.key === 'r') {$('#roomlistrefreshbutton').click();}
                }
                if (ev.key === '/') $('#roomSearchInputBox').focus();
            }));

    /****** Implemented by Chaz *******

            // Can double click room to trigger join
            let room_join_dblclick_handler = (ev) => $("#roomlistjoinbutton").click();
            $("#roomlisttable").on("dblclick", "tr", room_join_dblclick_handler);

            // Press enter to submit password for joining room
            let room_pass_enter_handler = (ev) => {
                ev.key === "Enter" && $("#roomlistpassjoinbutton").click();
            };
            $("#roomlistjoinpasswordtext").on("keydown", room_pass_enter_handler);
   *******/
        };
    });
})();