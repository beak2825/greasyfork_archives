// ==UserScript==
// @name         Trello Category
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://trello.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22154/Trello%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/22154/Trello%20Category.meta.js
// ==/UserScript==

function render(){
    var color_match = 
        {
            Everyone: '#e67e22',
            Product: '#95a5a6',
            Marketing: '#2980b9',
            Hardware: '#1abc9c',
            CXO: '#e74c3c',
            Operation: '#95a5a6',
            Software: '#f1c40f'
        };


    $('span.board-tile-details-name').each(function(){
        var title = $(this).text();
        var re = /\[ (.+) \] (.+)/;
        var match = title.match(re);
        if(match){
            $(this).text(match[2]);
            $('<br/><span class="board-category">'+match[1]+'</span>').insertAfter($(this));
            var tile = $(this).parent().parent();
            tile.css({'border-left': '20px solid '+color_match[match[1]]});
        }
    });
}
$(window).load(function(){
    render();
    
    $('body').append(`<style>
body{
    background: #FEFEFE;
}

#header {
    background: #333;
}

.board-tile-details-name {
    text-shadow: 0 0 10px rgba(0,0,0,0.8);
}

.board-tile-fade {
    background-color: rgba(0,0,0,.4);
}

span.board-category{
    background: rgba(0,0,0,0);
    color: white;
    position: relative;
    text-shadow: 0 0 7px black;
    display: inline-block;
    line-height: 1em;
    font-size: 8px;
    margin-right: 5px;
    vertical-align: top;
    opacity: 0.7;
}

.board-tile-details-sub-name{
    display: none;
}

.board-tile-fade{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>`);
});

setInterval(render, 1000);