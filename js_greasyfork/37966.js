// ==UserScript==
// @name         BiggerGolem
// @namespace    http://github.com/apetresc
// @version      2.8.2
// @description  Bigger Golem brings a variety of improvements to the popular turn-based board game site Little Golem
// @author       Adrian Petrescu <apetresc@gmail.com>
// @include      /^https?:\/\/(?:www\.)?littlegolem\.net\/jsp\/game\/game\.jsp.*$/
// @run-at       document-end
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/37966/BiggerGolem.user.js
// @updateURL https://update.greasyfork.org/scripts/37966/BiggerGolem.meta.js
// ==/UserScript==
// =========================== CONFIGURATION ===================================

// CHES_STYLE: Set a custom piece set for Chess and Chess960 games.
// Valid values: ["alpha", "default"]
var CHESS_STYLE = "alpha";
// CHESS_SIZE: The size, in pixels, of each square on the board.
// LittleGolem's default board is 32px.
var CHESS_SIZE = "64";

// SHOGI_STYLE: Set a custom piece set for Shogi games.
// Valid values: ["Ryoko", "Kinki", "Hidetchi", "default"]
var SHOGI_STYLE = "Ryoko";

// GO_COORDINATES: If true, draw coordinates around Go games of all board sizes
var GO_COORDINATES = true;

// REVERSI_BACKGROUND: If true, use a felt green background for all Reversi
// games
var REVERSI_BACKGROUND = false;
// REVERSI_STYLE: Set a custom piece set for Reversi games
// Valid values: ["svg", "go", "default"]
var REVERSI_STYLE = "svg";
// REVERSI_SIZE: The size, in pixels, of each square on the board.
// LittleGolem's default board size is 32px.
var REVERSI_SIZE = "64";
// =============================================================================

function setChessStyle(pieces, size) {
  var pieceRegex = /^.*\/([wb][prnbqk])\.gif$/;
  if (typeof chrome != "undefined" && typeof chrome.extension != "undefined") {
    var extension_prefix = chrome.extension.getURL('');
  } else {
    var extension_prefix = "https://biggergolem.s3.amazonaws.com/";
  }

  if (size != '32') {
    $('body table td').css('width', size + 'px');
    $('body table td').css('height', size + 'px');
    $('body table img').css('width', size + 'px');
    $('body table img').css('height', size + 'px');
  }

  if (pieces != 'default') {
    $('body table img').each(function(i, element) {
      var piece = pieceRegex.exec(element.src);
      if (piece !== null) {
        piece = piece[1][0] + piece[1][1].toUpperCase();
        element.src = extension_prefix + 'img/chess/' + pieces + '/' + piece + '.svg';
      }
    });
  }
}
function setGoCoordinates(setCoordinates, size) {
    if (setCoordinates) {
        let num_size = parseInt(size);
        if (!isNaN(num_size)) {
            $('table[style*="wood004"] tr').prepend(function (i, txt) {
                return '<td>&nbsp;' + (num_size - i) + '</td>';
            });
            let coordinates_row = "<td></td>";
            for (i = 0; i < num_size; i++) {
                let skip_i = i >= 8 ? 1 : 0;
                coordinates_row += '<td align="center">' + String.fromCharCode(65 + i + skip_i) + '</td>';
            }
            $('table[style*="wood004"]').append('<tr>' + coordinates_row + '</tr>');
        }
    }
}
function setShogiStyle(style) {
  if (style == "default") {
    return;
  }

  if (typeof chrome != "undefined" && typeof chrome.extension != "undefined") {
    var extension_prefix = chrome.extension.getURL('');
  } else {
    var extension_prefix = "https://biggergolem.s3.amazonaws.com/";
  }

  $("div.col-md-12 div").each(function(i) {
      var piece_pos = this.style.backgroundImage.search(/shogi\d\d/);
      if (piece_pos >= 0) {
          var piece = this.style.backgroundImage.substr(piece_pos, 7);
          this.style.backgroundImage = "url(" + extension_prefix + "img/shogi/" + style + "/" + piece + ".png" + ")";
          this.style.height = "48px";
      }
  });

  // Might also be a promotion box.
  $('img').each(function(i) {
    var piece_pos = this.src.search(/shogi\d\d/);
    if (piece_pos >= 0) {
        var piece = this.src.substr(piece_pos, 7);
        this.src = extension_prefix + "img/shogi/" + style + "/" + piece + ".png";
    }
  });
}

function fixShogiPgn() {
  function convertToPsn(moves) {
    function convertCoords(lgCoords) {
      return String.fromCharCode(106 - parseInt(lgCoords[0])) + (106 - lgCoords.charCodeAt(1));
    }

    var players = $('.portlet.box.yellow .portlet-body .col-xs-6.col-md-6 a')

    var psn = ""
    psn += "[Event \"Little Golem Game\"]\n";
    psn += "[Site \"littlegolem.net\"]\n";
    psn += "[Date \"2018.02.05\"]\n";
    // I am fully aware that technically the colors are flipped here. However,
    // xboard interprets "white" as the first player and "black" as the second
    // player, even in shogi, so this is the best way to match that.
    psn += "[White \"" + players[0].text.replace(" ★", "") + "\"]\n";
    psn += "[Black \"" + players[1].text.replace(" ★", "") + "\"]\n";
    psn += "[Result \"*\"]\n";
    psn += "[Variant \"shogi\"]\n";
    psn += "\n";

    var num_moves = moves.length;
    var move_num = 1;
    var move_len = 1;
    var promoted_pieces = new Set([]);
    for (var i = 0; i < num_moves; i++) {
      var promoted_move = false;
      if (i % 2 == 0) {
        psn += move_num + '. ';
        move_num++;
      } else {
        move_len = ('' + (i + 1)).length;
      }

      if (moves[i].indexOf('-') > 0) {
        if (promoted_pieces.has(moves[i].substring(move_len + 5, move_len + 7))) {
          promoted_pieces.delete(moves[i].substring(move_len + 5, move_len + 7));
        }
        if (promoted_pieces.has(moves[i].substring(move_len + 2, move_len + 4))) {
          promoted_move = true;
          promoted_pieces.delete(moves[i].substring(move_len + 2, move_len + 4));
          promoted_pieces.add(moves[i].substring(move_len + 5, move_len + 7));
        }

        psn += (promoted_move ? '+' : '') + moves[i][move_len + 1] + convertCoords(moves[i].substring(move_len + 2, move_len + 4)) + convertCoords(moves[i].substring(move_len + 5, move_len + 7)) + moves[i].substring(move_len + 7) + ' ';
      } else {
        psn += moves[i][move_len + 1] + '@' + convertCoords(moves[i].substring(move_len + 2, move_len + 4)) + moves[i].substring(move_len + 4) + ' ';
      }
      if (moves[i].endsWith("+")) {
        promoted_pieces.add(moves[i].substring(move_len + 5, move_len + 7));
      }
      promoted_move = false;
    }

    // console.log(psn);
    return btoa(psn);
  }

  $('.caption:contains(Move List) + .actions a')
      .attr("download", "game" + new URLSearchParams(window.location.search).get("gid") + ".pgn")
      .attr('href', 'data:application/x-shogi-pgn;base64,' + convertToPsn($('.caption:contains(Move List)').parents('.portlet').find('.portlet-body a,span').map(function(x) { return $(this).text(); }).get()));
}
function setReversiStyle({ background, pieces, size }) {
  if (typeof chrome != "undefined" && typeof chrome.extension != "undefined") {
    var extension_prefix = chrome.extension.getURL('');
  } else {
    var extension_prefix = "https://biggergolem.s3.amazonaws.com/";
  }
  
  var lastMove = $("table[bordercolor] td[bgcolor='#FF9115']");
  var lastMoveImg = $("table[bordercolor] td[bgcolor='#FF9115'] img");
  if (background) {
    if (lastMove.length) {
      lastMove[0].style.backgroundColor = "#00EE00";
    }
    var tds = $("table[bordercolor] td[bgcolor!='#FF9115']:has(img)");
    for (var i = 0; i < tds.length; i++) {
      tds[i].style.backgroundColor = "#008800";
    }
  }

  if (pieces === 'go') {
    if (lastMove.length) {
      var lastMoveColor = lastMoveImg[0].src.match(/\/reversi\/([bw])\.gif/)[1];
      $(lastMoveImg[0]).attr("src","/iphone/images/go/35_"+lastMoveColor+"sx.png");
    }
    var imgs = $("table[bordercolor] img[src*=reversi]");
    for (var i = 0; i < imgs.length; i++) {
      var color = imgs[i].src.match(/\/reversi\/([bw])\.gif/)[1];
      $(imgs[i]).attr("src","/iphone/images/go/35_"+color+"s.png");
    }
  } else if (pieces === 'svg') {
    $('body table img').each(function(i, element) {
      const color = element.getAttribute('alt');
      if (color && color.length > 0) {
        element.src = extension_prefix + `img/reversi/${color.toLowerCase()}.svg`;
      }
    });
  }

  if (size !== '32') {
    const sizeString = `${size}px`;
    $('body table td').css({ height: sizeString, width: sizeString });
    $('body table img').css({ height: sizeString, width: sizeString });
  }
}
function fixBrokenHexBoard() {
  var emptyLinks = $('svg a:empty');

  if (emptyLinks.length == 0) {
    return;
  }

  var lines = $('svg line[style*="stroke-width:.5"]');
  var size = lines.length / 4;

  var minX = 999999, minY = 999999, maxX = 0, maxY = 0;
  var coordBase = 'a'.charCodeAt(0);
  var currentPage = window.location.href;

  lines.each(function() {
    minX = Math.min(minX, this.x1.baseVal.value, this.x2.baseVal.value);
    maxX = Math.max(maxX, this.x1.baseVal.value, this.x2.baseVal.value);
    minY = Math.min(minY, this.y1.baseVal.value, this.y2.baseVal.value);
    maxY = Math.max(maxY, this.y1.baseVal.value, this.y2.baseVal.value);
  });

  var midX = (minX + maxX) / 2;
  var midY = (minY + maxY) / 2;

  $('svg a:empty').each(function() {
    let coords = this.href.baseVal.substr(-2);
    let x = coords.charCodeAt(0) - coordBase, y = coords.charCodeAt(1) - coordBase;

    targetX = minX + y * (midX - minX) / (size - 1) + x * (midX - minX) / (size - 1);
    targetY = midY + y * (maxY - midY) / (size - 1) - x * (maxY - midY) / (size - 1);

    let tx = String.fromCharCode(coordBase + x), ty = String.fromCharCode(coordBase + y);

    $('svg').append('<a href="' + currentPage + "&move=" + tx + ty + '"><circle cx="' + targetX + '" cy="' + targetY + '" r="' + (0.5 * (midX - minX) / (size - 1)) + '" fill="none" style="pointer-events: fill"/></a>');
  });

  $('svg a:empty').remove();

  $('svg').html($('svg').html());
}

function fixHexSgf() {
  function convertToSgf(moves) {
    var players = $('.portlet.box.yellow .portlet-body .col-xs-6.col-md-6 a')
    
    var sgf = "(;FF[4]PB[" +
      players[0].text.replace(" ★", "") +
      "]PW[" +
      players[1].text.replace(" ★", "") +
      "]SZ[" +
      /Hex.*-Size (\d+)/.exec($(".page-title").text())[1] +
      "]SO[http://www.littlegolem.com]";
    var swap = 0;

    if (moves.length > 1 && moves[1].indexOf('swap') >= 0) {
      // This is a hack to deal with the fact that none of the Hex SGF editors I've ever seen properly
      // implement swap-pieces. So we just hardcode the swap into the SGF.
      swap = 1;
    }
      
    for (var i = 0; i < moves.length; i++) {
      if (swap == 1 && i == 0) {
        sgf += ";" + "W[" + String.fromCharCode('a'.charCodeAt(0) + parseInt(moves[0].substring(3)) - 1) + (moves[0][2].charCodeAt(0) - 'a'.charCodeAt(0) + 1) + "]" +
          "C[This was actually a swap move played by black]";
        i += 1;
      } else {
        sgf += ";" + (i % 2 == 0 ? "B" : "W") + "[" + moves[i].substring(moves[i].indexOf(".") + 1) + "]";
      }
    }
    
    sgf += ")";
    
    return btoa(sgf);
  }
  
  $('.caption:contains(Move List) + .actions a')
      .attr('download', 'game' + new URLSearchParams(window.location.search).get("gid") + ".hsgf")
      .attr('href', 'data:application/x-hex-sgf;base64,' + convertToSgf($('.caption:contains(Move List)').parents('.portlet').find('.portlet-body a,span').map(function(x) { return $(this).text(); }).get()));
}
(function() {
    'use strict';

    var game_name = $('h3.page-title').text();

    if (game_name.indexOf('Reversi') >= 0) {
        setReversiStyle({
            background: REVERSI_BACKGROUND,
            pieces: REVERSI_STYLE,
            size: REVERSI_SIZE
        });
    } else if (game_name.indexOf('Shogi') >= 0) {
        setShogiStyle(SHOGI_STYLE);
        setTimeout(function() {
          fixShogiPgn();
        }, 600);
    } else if (game_name.indexOf('Go') >= 0) {
        let size = 0;
        if (game_name.indexOf('19x19') >= 0 || game_name.indexOf('Random100') >= 0) {
            size = 19;
        } else if (game_name.indexOf('13x13') >= 0) {
            size = 13;
        } else if (game_name.indexOf('9x9') >= 0) {
            size = 9;
        }
        if (size > 0) {
            setGoCoordinates(GO_COORDINATES, size);
        }
    } else if (game_name.indexOf('Chess') >= 0) {
        setChessStyle(CHESS_STYLE, CHESS_SIZE);
    } else if (game_name.indexOf('Hex') >= 0) {
        fixBrokenHexBoard();
        setTimeout(function() {
          fixHexSgf();
        }, 600);
    }
})();
