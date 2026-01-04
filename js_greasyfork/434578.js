// ==UserScript==
// @name Chess.com Custom Pieces - Fire Emblem Heroes
// @namespace theusaf.org
// @version 0.2.0
// @description FEH themed chess pieces.
// @author theusaf
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.chess.com/*
// @downloadURL https://update.greasyfork.org/scripts/434578/Chesscom%20Custom%20Pieces%20-%20Fire%20Emblem%20Heroes.user.js
// @updateURL https://update.greasyfork.org/scripts/434578/Chesscom%20Custom%20Pieces%20-%20Fire%20Emblem%20Heroes.meta.js
// ==/UserScript==

(function() {
let css = `

  /* White Pieces */
  /* Main Pieces */
  /* Queen 1 - Lyn */
  chess-board .piece.wq[piece-number="1"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344285565476904/lyn_queen0.png) !important;
  }

  /* Knight (Right) - Catria */
  chess-board .piece.wn[piece-number="1"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344282306498610/catra_knight.png) !important;
  }

  /* Knight (Left) - Thea */
  chess-board .piece.wn[piece-number="2"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344338396934174/thea_kngiht.png) !important;
  }

  /* Bishop (Right) - Rinea */
  chess-board .piece.wb[piece-number="1"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344290573467668/rinea_bishop.png) !important;
  }

  /* Bishop (Left) - Silque */
  chess-board .piece.wb[piece-number="2"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344337788743750/silque_bishop.png) !important;
  }

  /* Rook (Right) - Nephenee */
  chess-board .piece.wr[piece-number="1"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344288551813210/nephenee_rook.png) !important;
  }

  /* Room (Left) - Shamir */
  chess-board .piece.wr[piece-number="2"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344336056504380/shamir_rook.png) !important;
  }

  /* Default pieces */
  /* Pawn */
  chess-board .piece.wp {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/902766962424283146/blue_dude.png) !important;
  }

  /* King */
  chess-board .piece.wk {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/901972104797368361/Summoner_FEH_Sprite.PNG.png) !important;
  }

  /* Black Pieces */
  /* Main Pieces */
  /* Queen 1 - Celica */
  chess-board .piece.bq[piece-number="1"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903352348552855562/celica.png) !important;
  }

  /* Knight (Right) - Titania */
  chess-board .piece.bn[piece-number="1"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344339751678002/titania_knight.png) !important;
  }

  /* Knight (Left) - Melady */
  chess-board .piece.bn[piece-number="2"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344287691968542/melady_knight.png) !important;
  }

  /* Bishop (Right) - Sakura */
  chess-board .piece.bb[piece-number="1"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344291366182962/sakura_bishop.png) !important;
  }

  /* Bishop (Left) - Maria */
  chess-board .piece.bb[piece-number="2"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344286437900349/maria_bishop.png) !important;
  }

  /* Rook (Right) - Cordelia */
  chess-board .piece.br[piece-number="1"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344284378468403/cordelia_rook.png) !important;
  }

  /* Rook (Left) - Norne */
  chess-board .piece.br[piece-number="2"] {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903344289243885668/norne_bishop.png) !important;
  }

  /* Default pieces */
  /* Pawn */
  chess-board .piece.bp {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903347542669000734/pawn_Red.png) !important;
  }

  /* King */
  chess-board .piece.bk {
    background-image: url(https://cdn.discordapp.com/attachments/725415611542405160/903347539003183214/ike.png) !important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
