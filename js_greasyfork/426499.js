// ==UserScript==
// @name          Lichess Full Coords
// @description   Displays full coordinates on each square.
// @author        amogus
// @license       Apache-2.0
// @include       http://lichess.org/*
// @include       https://lichess.org/*
// @include       http://*.lichess.org/*
// @include       https://*.lichess.org/*
// @run-at        document-start
// @version 0.0.2
// @namespace https://greasyfork.org/users/28185
// @downloadURL https://update.greasyfork.org/scripts/426499/Lichess%20Full%20Coords.user.js
// @updateURL https://update.greasyfork.org/scripts/426499/Lichess%20Full%20Coords.meta.js
// ==/UserScript==
(function() {
  let css = `
    cordgrid {
      height: 100% !important;
    }

    coords.grid {
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      display: grid !important;
      grid-template-columns: auto auto auto auto auto auto auto auto !important;
      grid-auto-flow: row !important;
      grid-auto-flow: dense !important;
    }

    .orientation-white coords.grid.black {
      display: none !important;
    }

    .orientation-black coords.grid.white {
      display: none !important;
    }

    coords.grid coord {
      padding-left: 4px !important;
      color: var(--cg-ccw); !important;
      font-size: 0.8em;
    }

    coords.grid coord:nth-child(16n+1),
    coords.grid coord:nth-child(16n+3),
    coords.grid coord:nth-child(16n+5),
    coords.grid coord:nth-child(16n+7),
    coords.grid coord:nth-child(16n+10),
    coords.grid coord:nth-child(16n+12),
    coords.grid coord:nth-child(16n+14),
    coords.grid coord:nth-child(16n) {
      color: var(--cg-ccb); !important;
    }

    coords.files, coords.ranks {
      display: none !important;
    }
  `;
  let html = `
    <coords class='grid white'>
      <coord>a8</coord>
      <coord>b8</coord>
      <coord>c8</coord>
      <coord>d8</coord>
      <coord>e8</coord>
      <coord>f8</coord>
      <coord>g8</coord>
      <coord>h8</coord>
      <coord>a7</coord>
      <coord>b7</coord>
      <coord>c7</coord>
      <coord>d7</coord>
      <coord>e7</coord>
      <coord>f7</coord>
      <coord>g7</coord>
      <coord>h7</coord>
      <coord>a6</coord>
      <coord>b6</coord>
      <coord>c6</coord>
      <coord>d6</coord>
      <coord>e6</coord>
      <coord>f6</coord>
      <coord>g6</coord>
      <coord>h6</coord>
      <coord>a5</coord>
      <coord>b5</coord>
      <coord>c5</coord>
      <coord>d5</coord>
      <coord>e5</coord>
      <coord>f5</coord>
      <coord>g5</coord>
      <coord>h5</coord>
      <coord>a4</coord>
      <coord>b4</coord>
      <coord>c4</coord>
      <coord>d4</coord>
      <coord>e4</coord>
      <coord>f4</coord>
      <coord>g4</coord>
      <coord>h4</coord>
      <coord>a3</coord>
      <coord>b3</coord>
      <coord>c3</coord>
      <coord>d3</coord>
      <coord>e3</coord>
      <coord>f3</coord>
      <coord>g3</coord>
      <coord>h3</coord>
      <coord>a2</coord>
      <coord>b2</coord>
      <coord>c2</coord>
      <coord>d2</coord>
      <coord>e2</coord>
      <coord>f2</coord>
      <coord>g2</coord>
      <coord>h2</coord>
      <coord>a1</coord>
      <coord>b1</coord>
      <coord>c1</coord>
      <coord>d1</coord>
      <coord>e1</coord>
      <coord>f1</coord>
      <coord>g1</coord>
      <coord>h1</coord>
    </coords>

    <coords class='grid black'>
      <coord>h1</coord>
      <coord>g1</coord>
      <coord>f1</coord>
      <coord>e1</coord>
      <coord>d1</coord>
      <coord>c1</coord>
      <coord>b1</coord>
      <coord>a1</coord>
      <coord>h2</coord>
      <coord>g2</coord>
      <coord>f2</coord>
      <coord>e2</coord>
      <coord>d2</coord>
      <coord>c2</coord>
      <coord>b2</coord>
      <coord>a2</coord>
      <coord>h3</coord>
      <coord>g3</coord>
      <coord>f3</coord>
      <coord>e3</coord>
      <coord>d3</coord>
      <coord>c3</coord>
      <coord>b3</coord>
      <coord>a3</coord>
      <coord>h4</coord>
      <coord>g4</coord>
      <coord>f4</coord>
      <coord>e4</coord>
      <coord>d4</coord>
      <coord>c4</coord>
      <coord>b4</coord>
      <coord>a4</coord>
      <coord>h5</coord>
      <coord>g5</coord>
      <coord>f5</coord>
      <coord>e5</coord>
      <coord>d5</coord>
      <coord>c5</coord>
      <coord>b5</coord>
      <coord>a5</coord>
      <coord>h6</coord>
      <coord>g6</coord>
      <coord>f6</coord>
      <coord>e6</coord>
      <coord>d6</coord>
      <coord>c6</coord>
      <coord>b6</coord>
      <coord>a6</coord>
      <coord>h7</coord>
      <coord>g7</coord>
      <coord>f7</coord>
      <coord>e7</coord>
      <coord>d7</coord>
      <coord>c7</coord>
      <coord>b7</coord>
      <coord>a7</coord>
      <coord>h8</coord>
      <coord>g8</coord>
      <coord>f8</coord>
      <coord>e8</coord>
      <coord>d8</coord>
      <coord>c8</coord>
      <coord>b8</coord>
      <coord>a8</coord>
    </coords>
  `;

  let css_node = document.createElement("style");
  css_node.type = "text/css";
  css_node.appendChild(document.createTextNode(css));

  let html_node = document.createElement("div");
  html_node.classList.add("cordgrid");
  html_node.innerHTML = html;

  // todo: support iframes
  document.head.appendChild(css_node);

  function update() {
    let elems = document.querySelectorAll("cg-container");
    for (let i = 0; i < elems.length; i++) {
      if (elems[i].querySelector("div.cordgrid") == null) {
        elems[i].appendChild(html_node.cloneNode(true));
      }
    }
  }

  setInterval(update, 200);
  setTimeout(update, 700);
})();
