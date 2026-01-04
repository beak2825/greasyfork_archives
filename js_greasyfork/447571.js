// ==UserScript==
// @name         TETR.IO custom presets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add presets to TETR.IO custom games
// @author       0tv0
// @license      MIT
// @match        https://tetr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tetr.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447571/TETRIO%20custom%20presets.user.js
// @updateURL https://update.greasyfork.org/scripts/447571/TETRIO%20custom%20presets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
      return new Promise((res, rej) => setTimeout(res, ms));
    };

    function grabElements() {
      let boardWidth = document.querySelector("#custom_content_game > div:nth-child(2) > div:nth-child(9) > input");
      let boardHeight = document.querySelector("#custom_content_game > div:nth-child(2) > div:nth-child(10) > input");
      let metaConfigPanel = document.querySelector("#custom_content_meta > div:nth-child(2)");
      if(boardWidth && boardHeight && metaConfigPanel) return { boardWidth, boardHeight, metaConfigPanel };
      return null;
    };

    async function waitForElements() {
      let t;
      while(1) {
        t = grabElements();
        if(t) {
          console.log(t);
          break;
        };
        await sleep(100);
      };
      return t;
    };

    const TETRAMINOS = [ 's', 'z', 'j', 'l', 't', 'i', 'o', '_', '#' ];
    const NAMES = [ 'S piece', 'Z piece', 'J piece', 'L piece', 'T piece', 'I piece', 'O piece', 'Empty block', 'Garbage Mino' ];

    function createBoard(width, height) {
      return new Array(height).fill(null).map(x => new Array(width).fill(null).map(y => '_'));
    };

    function createMap(map = [], queue = [], held = null) {
      if(!held) held = null;
      if(!(typeof map === 'object' && Array.isArray(map))) throw new Error("Arg 1: Invalid type (May only be of type: Array)");
      if(map.filter(x => !(typeof x === 'object' && Array.isArray(x))).length > 0) throw new Error("Arg 1 (In content): Invalid type (May only be of type: Array)");
      if(!(typeof queue === 'object' && Array.isArray(queue))) throw new Error("Arg 2: Invalid type (May only be of type: Array)");
      if(queue.filter(x => !TETRAMINOS.includes(x)).length > 0) throw new Error("Arg 2 (In content): Invalid tetramino (Can only be 1 of " + TETRAMINOS.join(', ') + ") - make sure you are using lowercase letters");
      if(!TETRAMINOS.includes(held) && held !== null) throw new Error("Arg 3: Invalid tetramino (Can only be 1 of " + TETRAMINOS.join(', ') + ", OR falsy / false value) - make sure you are using lowercase letters");

      let width = map[0].length; // first row
      if(Math.max(...map.map(c => c.length)) !== width) throw new Error("Arg 1 (In content while parsing): a row is too large");
      if(Math.min(...map.map(c => c.length)) !== width) throw new Error("Arg 1 (In content while parsing): a row is too small");
      let height = map.length;

      let data = {
        width, height,
        sequence: ''
      };

      map.forEach(row => {
        row.forEach((piece, column) => {
          // because of the way this data is iterated through, we don't actually have to do anything to organize it, stuff will fall into place correctly
          data.sequence += piece;
        });
      });

      if(queue.length || held) data.sequence += '?';

      queue.forEach(tetramino => data.sequence += tetramino);

      if(held) data.sequence += '?' + held;

      return data;
    };

    var presets = [
      {
        name: "None",
        minWidth: null,
        minHeight: null,
        maxWidth: null,
        maxHeight: null,
        requiresEvenHeight: false,
        requiresEvenWidth: false,
        generator: (width, height) => {
          let board = createBoard(width, height);
          return createMap(board, [], null);
        }
      },
      {
        name: "4 Wide",
        minWidth: 4,
        // we technically still can setup a 4 wide, it just won't have any padding
        maxWidth: null,
        minHeight: 2,
        maxHeight: null,
        requiresEvenWidth: true,
        // while yes, it could be made with an odd width
        // i'm not going to code that in
        // plus anyone who plays with like board with 9 is just a psychopath
        requiresEvenHeight: false,
        generator: (width, height) => {
          let board = createBoard(width, height + 20);
          let padding = (width - 4) / 2;
          board.forEach(row => {
            // go from top to bottom row
            for(let i = 0; i < padding; i++) row[i] = row[(row.length - 1) - i] = i ? "#" : "z";
          });
          // construct the S piece
          // this should work even if width is like 4
          board[board.length - 1][padding - 1] = board[board.length - 1][padding] = 's';
          board[board.length - 2][padding] = board[board.length - 2][padding + 1] = 's';

          return createMap(board, [], null);
        }
      }
    ];

    function calculateAvailablePresets(width, height) {
      let data = presets;
      if(width % 2 === 1) data = data.filter(x => !x.requiresEvenWidth);
      if(height % 2 === 1) data = data.filter(x => !x.requiresEvenHeight);
      data = data.filter(x => typeof x.minWidth !== 'number' ? true : x.minWidth <= width);
      data = data.filter(x => typeof x.minHeight !== 'number' ? true : x.minHeight <= height);
      data = data.filter(x => typeof x.maxWidth !== 'number' ? true : x.maxWidth >= width);
      data = data.filter(x => typeof x.maxHeight !== 'number' ? true : x.maxHeight >= height);
      return data;
    };

    waitForElements().then(el => {
      let roomConfig = el.metaConfigPanel;

      /* THIS SECTION OF CODE BELOW IS FROM TETR.IO PLUS, IT WAS NOT MADE BY ME */

      let row = document.createElement('div');
      row.classList.add('room_config_row', 'flex-row', 'ns');
      roomConfig.insertBefore(row, roomConfig.firstChild);

      let label = document.createElement('div');
      label.classList.add('room_config_label', 'flex-item', 'ns');
      label.innerText = 'Use custom map';
      row.appendChild(label);

      let check = document.createElement('input');
      check.classList.add('room_config_item', 'flex-item');
      check.type = 'checkbox';
      row.appendChild(check);

      let row2 = document.createElement('div');
      row2.classList.add('room_config_row', 'flex-row', 'ns');
      roomConfig.insertBefore(row2, row.nextSibling);

      let label2 = document.createElement('div');
      label2.classList.add('room_config_label', 'flex-item', 'ns');
      label2.innerText = 'Custom map string';
      row2.appendChild(label2);

      let mapInput = document.createElement('input');
      mapInput.classList.add('room_config_item', 'flex-item');
      mapInput.style.fontFamily = 'monospace';

      check.addEventListener('change', evt => {
        mapInput.setAttribute("data-index", check.checked ? "map" : "");
      });

      row2.appendChild(mapInput);

      /* END COPIED SECTION */

      // hide custom map option
      row.style.display = 'none';
      row2.style.display = 'none';
      check.click();

      function setCustomMapToPreset(presetObject, width, height) {
        mapInput.value = presetObject.generator(width, height).sequence;
      };

      let presetElement = document.createElement('div');
      presetElement.classList.add('room_config_row', 'flex-row', 'imp');
      presetElement.title = "The preset to generate the map from, if any.";

      let presetLabel = document.createElement('div');
      presetLabel.classList.add('room_config_label', 'flex-item', 'ns');
      presetLabel.innerText = 'board preset';

      let presetOptions = document.createElement('div');
      presetOptions.classList.add('room_config_item', 'room_config_spinner', 'flex-item', 'ns');
      presetOptions.setAttribute('data-index', 'preset');
      presetOptions.innerText = "None [1/" + presets.length + "]";

      presetElement.appendChild(presetLabel);
      presetElement.appendChild(presetOptions);

      let mainConfig = el.boardHeight.parentElement.parentElement;
      let bagType = mainConfig.children[1];
      mainConfig.insertBefore(presetElement, bagType);

      // 5 minute crafts ahh fix for the option not being actually coded into the game and having function
      let gameButton = document.querySelector("#custom_opts_game");
      let optionsCycle = 0;
      let available = calculateAvailablePresets(parseInt(el.boardWidth.value), parseInt(el.boardHeight.value));
      let selected = "None";

      let recalculate = () => {
        console.log("Recalculation of presets in progress.");
        available = calculateAvailablePresets(parseInt(el.boardWidth.value), parseInt(el.boardHeight.value));

        if(available.map(x => x.name === selected).length === 0) {
          console.log("Board had illegal preset, removed");
          optionsCycle = 0;
        };

        setCustomMapToPreset(available[optionsCycle], parseInt(el.boardWidth.value), parseInt(el.boardHeight.value));
        presetOptions.innerText = available[optionsCycle].name + " [" + (optionsCycle + 1) + "/" + available.length + "]";

        console.log("All done");
      };

      el.boardWidth.onchange = recalculate;
      el.boardHeight.onchange = recalculate;

      presetOptions.onclick = () => {
        optionsCycle = ++optionsCycle % available.length;
        console.log({ optionsCycle, available });

        recalculate();
        gameButton.click(); // play the sound effect
      };
    });
})();