// ==UserScript==
// @name         Trello Minimal Dark
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Make Trello Like Nullboard
// @author       You
// @match        https://trello.com/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @homepage     https://github.com/yueyericardo/trello_week
// @downloadURL https://update.greasyfork.org/scripts/426680/Trello%20Minimal%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/426680/Trello%20Minimal%20Dark.meta.js
// ==/UserScript==

GM_addStyle(`
#trello-root{
    background-color: #131313 !important;
}
.card-done {
    text-shadow: 0 0 4px #0008;
    text-decoration: line-through;
    text-decoration-color: #f12e2e;
}
.card-blur {
    filter: blur(5px);
}
/* Card Click */
.list-card-operation{
    padding-left: 200px;
    height: -webkit-fill-available;
}
.list-card-operation:hover {
    background: transparent;
}
/* List Width */
.list-wrapper {
    width: 330px;
}
.list-card {
    max-width: inherit;
}
/* Clean Header */
/* Trello logo */
._2eXs5ruz0QfFdH {
    display: none;
}
.js-board-views-btn-container{
    display: none;
}
.board-header-btn-without-icon {
    display: none;
}
#permission-level{
    display: none;
}
.board-header-facepile {
    display: none;
}
.board-header-btn-divider {
    display: none;
}
.list-wrapper.mod-add.is-idle {
    max-width: 27px;
    overflow: hidden;
}

/* Cover card */
.full-cover-list-card {
    min-height: 39px;
    color: #2adc41 !important;
    text-shadow: 0 0 4px #0008;
    font-size: inherit !important;
}
[class*="color-card-cover"][class*="color-card-cover-"] {
    background-color: transparent;
    box-shadow: none !important;
}
.full-cover-list-card:hover[class*="color-card-cover-"] {
    background-color: rgb(29 32 33);
}
.full-cover-list-card .list-card-details .list-card-title{
    font-size: 14px !important;
}
.list-card-title {
    color: inherit;
}


/* Center the lists */
#board {
    margin: auto;
    max-width: fit-content;
}

/* Center the board name */
.board-header-btn.mod-board-name {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

/* Tags */
.body-board-view .list-card-labels .card-label {
  font-weight: bold;
  color: #fff !important;
  text-transform: uppercase;
  letter-spacing: 0.1em !important;
  line-height: 14px !important;
  height: auto !important;
  min-height: 2px;
  padding: 1px 6px !important;
  margin-right: 5px !important;
  width: auto !important;
  text-shadow: none !important;
  font-size: 6px !important;
  opacity: .8 !important;
  margin-left: 0 !important;
  text-align: center;
}

.body-board-view .list-card-labels {
  display: flex !important;
}

`);

function markAllCard () {
        var a = document.getElementsByClassName('js-card-labels');
        for (var i = 0; i < a.length; i++) {
            var marked_done = false;
            var marked_blur = false;
            for (var j = 0; j < a[i].children.length; j++) {
                var b = a[i].children[j];
                if (b.classList.contains('card-label-purple') && !b.classList.contains('js-select-label')){
                    b.style.display = 'none';
                    b.parentElement.parentElement.children[1].classList.add('card-done');
                    marked_done = true;
                }
                if (b.classList.contains('card-label-red') && !b.classList.contains('js-select-label')){
                    b.style.display = 'none';
                    b.parentElement.parentElement.children[1].classList.add('card-blur');
                    marked_blur = true;
                }
            }
            // if no child or has not marked
            if (!a[i].children.length || !marked_done){
                 a[i].parentElement.children[1].classList.remove('card-done');
            }
            if (!a[i].children.length || !marked_blur){
                 a[i].parentElement.children[1].classList.remove('card-blur');
            }
        }
}

(function() {
    'use strict'
    var x = 0;
    var intervalID = setInterval(function () {
        // Your logic here
        markAllCard();
        if (++x === 30) {
            window.clearInterval(intervalID);
            setInterval(function () {
                markAllCard();
            }, 500);
        }
    }, 100);
})()


function exportList(inputlistName) {
    var s = [];
    jQuery.fn.reverse = [].reverse; // Copies columns starting from right to left
    jQuery(".list:has(.list-header-name)").reverse().each(function() {
    var listName = jQuery(this).find(".list-header-name-assist")[0].innerText;
    if (listName == inputlistName){
        s.push(listName + " 总结\n");
        jQuery(this).find(".list-card-title").each(function() {
            s.push("- " + this.innerText);
        });
    }
    });

    console.log(s.join("\n"));
    copy(s.join("\n"));
}


if(!unsafeWindow.exportList)
{
    unsafeWindow.exportList = exportList;
}