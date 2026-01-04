// ==UserScript==
// @name         ChessTempo Analysis
// @locale       en
// @description  provide analysis links on ChessTempo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       SethTr
// @match        *://chesstempo.com/*
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/37925/ChessTempo%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/37925/ChessTempo%20Analysis.meta.js
// ==/UserScript==

GM_addStyle(".links-panel {" +
            "color: white;" +
            "background-color: #333;" +
            "position: absolute;" +
            "top: 25%;" +
            "left: 1%;" +
            "border-radius: 5px;" +
            "padding: 5px;" +
            "text-align: center;" +
            "font-size: 18px;" +
            "}");

function toCord(offset) {
    var num = Number(offset.substr(0, offset.length - 1));
    return Math.round(num / 12.5);
}

function fenName(piece) {
    piece = piece.substr(piece.lastIndexOf('/') + 1, 100);
    var isWhite = piece.indexOf("white") >= 0;
    var name = ["king", "queen", "rook", "bishop", "knight", "pawn"];
    var fen = ["k", "q", "r", "b", "n", "p"];
    for (i = 0; i < name.length; i++) {
        if (piece.indexOf(name[i]) >= 0) {
            if (isWhite) {
                return fen[i].toUpperCase();
            } else {
                return fen[i].toLowerCase();
            }
        }
    }
    return "WTF" + piece;
}

function fenNotation(board, isWhite) {
    var fen = '';
    for (y = 0; y < 8; y++) {
        var spaces = 0;
        for (x = 0; x < 8; x++) {
            var p = isWhite ? board[8*y + x] : board[63 - (8*y + x)];
            if (p) {
                if (spaces > 0) fen += spaces;
                fen += p;
                spaces = 0;
            } else {
                spaces += 1;
            }
        }
        if (spaces > 0) fen += spaces;
        if (y != 7)     fen += '/';
    }
    fen += ' ' + (isWhite ? 'w' : 'b');
    return fen;
}

function lichessFen(fen) {
    return "https://www.lichess.org/analysis/" + fen.replace(' ', '_');
}

function createWrappedLink(parent, text) {
    var link = document.createElement('a');
    link.appendChild(document.createTextNode(text));
    link.title = text;
    link.target="_blank";
    link.href = "http://lichess.com";
    var div = document.createElement('div');
    div.appendChild(link);
    parent.appendChild(div);
    return link;
}

function createLinks() {
    console.log("adding button for links");
    var linkWrapper = document.createElement('div');
    linkWrapper.className = 'links-panel';

    whiteLink = createWrappedLink(linkWrapper, "Analysis white to play");
    blackLink = createWrappedLink(linkWrapper, "Analysis black to play");

    document.getElementsByTagName('body')[0].appendChild(linkWrapper);
    return [whiteLink, blackLink];
}

(function() {
    'use strict';

    var links = createLinks();

    setInterval(function() {
        jQuery.noConflict();
        var board = {};

        jQuery('.svgPieceContainer').parent().each(function(index, pieceDiv) {
            var x = toCord(pieceDiv.style.left);
            var y = toCord(pieceDiv.style.top);
            var piece = fenName(pieceDiv.children[0].src);
            board[8*y + x] = piece;
        });

        var whiteLink = lichessFen(fenNotation(board, true));
        var blackLink = lichessFen(fenNotation(board, false));

        console.log("White to play analysis: ", whiteLink);
        console.log("Black to play analysis: ", blackLink);

        links[0].href = whiteLink;
        links[1].href = blackLink;
    }, 3000);

})();