// ==UserScript==
// @name         XDML-helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       FrankFang
// @match        https://xiedaimala.com/tasks/*/video_tutorials/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405167/XDML-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/405167/XDML-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const script = document.createElement('script')
    script.src = 'https://cdn.bootcdn.net/ajax/libs/interact.js/1.9.19/interact.min.js'
    script.onload = function(){
        const div = document.createElement('div')
        div.id='mask'
        div.style.background = 'black';
        div.style.width = '100px'
        div.style.border = '1px solid red'
        div.style.height = '100px'
        div.style.zIndex = 9999
        div.style.position = 'absolute'
        div.style.touchAction = 'none'
        document.body.appendChild(div)
        interact(div)
            .resizable({
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: true, top: true },

            listeners: {
                move (event) {
                    var target = event.target
                    var x = (parseFloat(target.getAttribute('data-x')) || 0)
                    var y = (parseFloat(target.getAttribute('data-y')) || 0)

                    // update the element's style
                    target.style.width = event.rect.width + 'px'
                    target.style.height = event.rect.height + 'px'

                    // translate when resizing from top or left edges
                    x += event.deltaRect.left
                    y += event.deltaRect.top

                    target.style.webkitTransform = target.style.transform =
                        'translate(' + x + 'px,' + y + 'px)'

                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                    target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
                }
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 50 }
                })
            ],

            inertia: true
        })
            .draggable({
            listeners: { move: window.dragMoveListener },
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ]
        })
        console.log('done!')
    }
    document.body.appendChild(script)
    window.dragMoveListener = function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

})();