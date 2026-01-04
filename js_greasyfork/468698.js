// ==UserScript==
// @name         kbin collapsible media preview
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @match        https://karab.in/*
// @namespace    https://greasyfork.org/en/users/1098129-domicidaldesigns
// @version      1.0.4
// @description  collapsible media preview for kbin.social
// @author       DomicidalDesigns
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468698/kbin%20collapsible%20media%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/468698/kbin%20collapsible%20media%20preview.meta.js
// ==/UserScript==

//attributions: [1] W3Schools (collapse js tutorial)
(function() {
    'use strict';

    // Your code here...

    function collapsePreviews() {
        // Add buttons after every image preview

        var x = document.getElementsByClassName('preview');

        for (let i = 0; i < x.length; i++) {
            // This is needed to prevent unwanted images being collapsed
            if (x[i].nodeName != 'DIV') {break};

            var _button = document.createElement("button");

            _button.classList.add('collapsible');


            var ref = x[i].parentNode;
            var parent = ref.parentNode;
            parent.insertBefore(_button, ref);
            // When creating a new button, check the collapse state to update the icon properly
            var content = _button.nextElementSibling;
            if (content.style.maxHeight) {
            } else {
                _button.classList.add('active')
            }

            ref.classList.add('collapseContent');


        }

        // Toggle content when collapse buttons are clicked.[1]

        var coll = document.getElementsByClassName("collapsible");


        for (let j = 0; j < coll.length; j++) {
            coll[j].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }

    }

    function removeCollapses() {
        // Delete collapse buttons

        var collapses = document.getElementsByClassName('collapsible');

        while (collapses[0]) {
            collapses[0].parentNode.removeChild(collapses[0]);
        }
    }

    // styles
    var css = `<style>
            .collapsible {
              background: none;
              color: white;
              cursor: pointer;
              padding: 18px;
              width: 100%;
              border: none;
              text-align: left;
              outline: none;
              font-size: 15px;
            }

            .collapsible:after {
              content: '-';
              color: white;
              font-weight: bold;
              float: left;
              margin-left: 5px;
            }

            .collapsible.active:after {
              content: "+";
            }

            .collapseContent {
              padding: 0 18px;
              max-height: 0;
              overflow: hidden;
              transition: max-height 0.2s ease-out;
              background: none;
            }

                </style>`;


    document.body.innerHTML += css;

    // initial population of media preview collapse buttons
    removeCollapses();
    setTimeout(collapsePreviews, 1000);

    function collapseMedia() {
        removeCollapses();
        collapsePreviews();
    }

    // Populate new collapse buttons on scroll
    document.addEventListener("scroll", function() {
        collapseMedia();
    })

})();