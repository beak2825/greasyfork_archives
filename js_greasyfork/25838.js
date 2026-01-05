// ==UserScript==
// @name        Board Scroller
// @description Scroller boarda
// @namespace   xkomtfsrandombug
// @include     http://tfs.x-kom.org/tfs/X-KOM.PL/XKomWeb/Rozw%C3%B3j%20strony/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25838/Board%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/25838/Board%20Scroller.meta.js
// ==/UserScript==

setTimeout(function() {
    
    var $board = $('.taskboardTableBodyScrollContainer'),
        boardJson = null,
        oldBoardJson = null,
        timer = null;
    
    $board.animate({'scrollTop': 0}, 0);
    
    var scroller = function() {
        if ($board.scrollTop() > $board.find('table').height() / 2) {
            $board.animate({'scrollTop': 0}, Math.random() * (15000 - 1500) + 1500, 'swing', function() {
                $board.animate({'scrollTop': $board.find('table').height()}, Math.random() * (15000 - 1500) + 1500, 'swing', function() { scroller () });
            });
        } else {
            $board.animate({'scrollTop': $board.find('table').height()}, Math.random() * (15000 - 1500) + 1500, 'swing', function() {
                $board.animate({'scrollTop': 0}, Math.random() * (15000 - 1500) + 1500, 'swing', function() { scroller () });
            });
        }
    }
    
    setInterval(function() {
        $.ajax($('[title=Current]').find('a[href]').attr('href')).done(function(res) {
            var newBoardJson = $(res).filter('.main-container').find('#taskboard').find('script').first().text();
            oldBoardJson = boardJson;
            boardJson = JSON.parse(newBoardJson).payload.data; 
        });

        if (JSON.stringify(boardJson) !== JSON.stringify(oldBoardJson) && oldBoardJson !== null) {
            location.reload();
        }        
    }, 10000);

    
    $board.on("wheel mousewheel keyup touchmove", function(event){
        $(this).stop();
        
        clearTimeout(timer);
        
        timer = setTimeout(function() {
            scroller();
        }, 5000);
    });

    scroller();
    
    
}, 3000);