// ==UserScript==
// @name         Heatmap 2.0
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Generate heatmap images
// @author       Paweł Malak (pawemala) LCJ2
// @match        https://stowmap-eu.amazon.com/stowmap/loadFCAreaMap.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462773/Heatmap%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/462773/Heatmap%2020.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // Dropzones
  const zonesConfig = [
    {
      name: 'corrosive',
      code: 'cr',
      dropZones: ['dz-P-CORROSIVE', 'dz-P-CORROSIVE_HIGH_VELO'],
      towerLocation: 'D',
      range: [200, 227],
      type: 'sellable'
    },
    {
      name: 'hardline',
      code: 'hl',
      dropZones: ['dz-P-HARDLINE', 'dz-P-HARDLINE_B'],
      towerLocation: 'D',
      range: [228, 290],
      type: 'sellable'
    },
    {
      name: 'hardline dmg',
      code: 'hl_dmg',
      dropZones: ['dz-P-HARDLINE_DMG_A', 'dz-P-HARDLINE_DMG_B'],
      towerLocation: 'D',
      range: [228, 300],
      type: 'damage'
    },
    {
      name: 'flammables',
      code: 'fl',
      dropZones: ['dz-P-FLAMMABLES_A', 'dz-P-FLAMMABLES_B'],
      towerLocation: 'D',
      range: [301, 332],
      type: 'sellable'
    },
    {
      name: 'flammable aerosols',
      code: 'fa',
      dropZones: ['dz-P-FLAM_AEROSOLS'],
      towerLocation: 'D',
      range: [355, 373],
      type: 'sellable'
    },
    {
      name: 'restricted hazmat',
      code: 'rh',
      dropZones: ['dz-P-RESTRICTED_HAZMAT_A', 'dz-P-RESTRICTED_HAZMAT_B'],
      towerLocation: 'B',
      range: [232, 261],
      type: 'sellable'
    },
    {
      name: 'reactive',
      code: 'rr',
      dropZones: ['dz-P-Reactive'],
      towerLocation: 'A',
      range: [200, 231],
      type: 'sellable'
    }
  ];

  // Tv config
  const screenConfig = [
    {
      name: 'tv2_cr-hl',
      cells: [
        { type: 'data', code: 'cr', range: [200, 227] },
        {
          type: 'text',
          code: 'cr',
          content: [{ text: 'Damage', value: 'D203 - D206 (chunk 4)' }]
        },
        {
          type: 'data',
          code: 'hl',
          range: [228, 290],
          details: '(chunk 1, 2)'
        },
        {
          type: 'data',
          code: 'hl_dmg',
          range: [228, 300],
          details: '(chunk 3, 4)'
        }
      ]
    },
    {
      name: 'tv3_hl-fl',
      cells: [
        {
          type: 'data',
          code: 'hl',
          range: [228, 290],
          details: '(chunk 1, 2)'
        },
        {
          type: 'data',
          code: 'hl_dmg',
          range: [228, 300],
          details: '(chunk 3, 4)'
        },
        { type: 'data', code: 'fl', range: [301, 332] },
        {
          type: 'text',
          code: 'fl',
          content: [
            { text: 'HRV', value: 'D330 (chunk 4)' },
            { text: 'Damage', value: 'D333 - D334' }
          ]
        }
      ]
    },
    {
      name: 'tv4_fl-fa',
      cells: [
        { type: 'data', code: 'fl', range: [301, 332] },
        {
          type: 'text',
          code: 'fl',
          content: [
            { text: 'HRV', value: 'D330 (chunk 4)' },
            { text: 'Damage', value: 'D333 - D334' }
          ]
        },
        {
          type: 'data',
          code: 'fa',
          range: [355, 373],
          details: '(chunk 1, 2)'
        },
        {
          type: 'text',
          code: 'fa',
          content: [
            { text: 'Damage', value: 'D372 - D373 (chunk 4)' },
            { text: 'NFA', value: 'D349 - D354 (chunk 1, 2)' },
            { text: 'NFA Damage', value: 'D349 - D350 (chunk 4)' }
          ]
        }
      ]
    },
    {
      name: 'tv1_rh-rr',
      cells: [
        { type: 'data', code: 'rh', range: [232, 261] },
        {
          type: 'text',
          code: 'rh',
          content: [{ text: 'Damage', value: 'B235 - B236 (chunk 4)' }]
        },
        { type: 'data', code: 'rr', range: [200, 231] },
        {
          type: 'text',
          code: 'rr',
          content: [
            { text: 'HRV A', value: 'A218 - A219 (chunk 1)' },
            { text: 'HRV D', value: 'D242 - D243 (chunk 2)' },
            { text: 'HRV DMG', value: 'D242 - D243 (chunk 4)' }
          ]
        }
      ]
    }
  ];

  class Canvas {
    constructor(parentContainerEl, config) {
      this.parentContainerEl = parentContainerEl;
      this.config = config;

      this.createCanvas();
    }

    /**
     * Create canvas element and append it to the parent container
     */
    createCanvas() {
      const { width, height, id } = this.config;

      const canvasEl = document.createElement('canvas');
      canvasEl.id = id;
      canvasEl.width = width;
      canvasEl.height = height;
      canvasEl.style.display = 'none';
      this.parentContainerEl.appendChild(canvasEl);
      this.canvasEl = canvasEl;
      this.canvasCtx = canvasEl.getContext('2d');
    }

    /**
     * Reset given canvas to prevent elements overlapping
     */
    clearCanvas() {
      this.canvasCtx.clearRect(0, 0, this.config.width, this.config.height);
    }

    /**
     * Fill canvas with background color specified in the config
     */
    addBackground() {
      const { colorBackground, width, height } = this.config;
      this.canvasCtx.fillStyle = colorBackground;
      this.canvasCtx.fillRect(0, 0, width, height);
    }

    /**
     * Add header with a given text to the canvas cell
     * @param {Object<main: String, sub: String, utilization?: String>} text
     */
    addCellHeader(text) {
      const ctx = this.canvasCtx;
      const { main, sub, utilization } = text;
      const {
        width,
        subcellHeight,
        fontSize,
        fontFamily,
        colorAccent,
        colorPrimary
      } = this.config;

      // Text config
      ctx.textBaseline = 'bottom';
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'left';

      // Add area name
      ctx.fillStyle = colorAccent;
      ctx.fillText(main, 0, subcellHeight / 2);

      // Add area utilization
      if (utilization) {
        ctx.textAlign = 'right';
        ctx.fillText(utilization, width, subcellHeight / 2);
      }

      // Add area range text
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = colorPrimary;
      ctx.font = `${fontSize - 25}px ${fontFamily}`;
      ctx.fillText(sub, 0, subcellHeight / 1.8);
    }

    /**
     * Render cell of type `data` to the given canvas
     * @param {Canvas} canvasObj Instance of helper Canvas class
     * @param {Object} cellData
     */
    renderDataCell(canvasObj, cellData) {
      const {
        name,
        towerLocation,
        totalUtilization,
        range: [aisleStart, aisleEnd],
        aislesToDisplay,
        cellDetails
      } = cellData;
      const ctx = canvasObj.ctx;

      // Cell size calculation
      const { width, height, colorPrimary, colorAccent, fontSize, fontFamily } =
        canvasObj.config;
      const subcellWidth = width / 3;
      const subcellHeight = height / 4;

      // Set subcells size
      canvasObj.config = { ...canvasObj.config, subcellWidth, subcellHeight };

      // Add header
      canvasObj.addCellHeader({
        main: name.toUpperCase(),
        sub: `${aisleStart} - ${aisleEnd} ${cellDetails}`,
        utilization: `${totalUtilization}%`
      });

      // Create data subcells
      let aisleIterator = 0;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          // Check if aisle exists
          if (!aislesToDisplay[aisleIterator]) {
            break;
          }

          const { aisle, utilization } = aislesToDisplay[aisleIterator];

          // Add aisle number text
          ctx.fillStyle = colorPrimary;
          ctx.font = `${fontSize}px ${fontFamily}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            `${towerLocation}${aisle}`,
            subcellWidth * col + subcellWidth / 2,
            subcellHeight * row + subcellHeight + subcellHeight / 2
          );

          // Add aisle utilization text
          ctx.fillStyle = colorAccent;
          ctx.font = `${fontSize - 25}px ${fontFamily}`;
          ctx.fillText(
            `${utilization.toFixed(2)}%`,
            subcellWidth * col + subcellWidth / 2,
            subcellHeight * row + subcellHeight + subcellHeight / 1.2
          );

          aisleIterator++;
        }
      }
    }

    /**
     * Render cell of type `text` to the given canvas
     * @param {Canvas} canvasObj Instance of helper Canvas class
     * @param {Object} cellData
     */
    renderTextCell(canvasObj, cellData) {
      const { content, name } = cellData;
      const ctx = canvasObj.ctx;

      // Cell size calculation
      const { width, height, colorPrimary, colorAccent, fontSize, fontFamily } =
        canvasObj.config;
      const subcellHeight = height / 4;

      canvasObj.addCellHeader({
        main: name.toUpperCase(),
        sub: 'Alejki specjalne',
        utilization: null
      });

      // Text config
      ctx.font = `${fontSize}px ${fontFamily}`;

      // Create text subcells
      for (let row = 0; row < 3; row++) {
        // Check if text row exists
        if (!content[row]) {
          break;
        }

        const { text, value } = content[row];

        // Render left text column
        ctx.fillStyle = colorAccent;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, subcellHeight * row + subcellHeight * 1.5);

        // Render right text column
        ctx.fillStyle = colorPrimary;
        ctx.textAlign = 'right';
        ctx.fillText(value, width, subcellHeight * row + subcellHeight * 1.5);
      }
    }

    /**
     * Create main image, looping over content cells
     * @param {Canvas} helperCanvasObj Instance of Canvas class
     * @param {Object} screenConfig
     */
    renderMainImage(helperCanvasObj, screenConfig) {
      const { padding, verticalGap, horizontalGap } = this.config;
      const { cells } = screenConfig;
      const ctx = this.canvasCtx;

      let cellIterator = 0;

      for (let col = 0; col < 2; col++) {
        for (let row = 0; row < 2; row++) {
          // Check if cell exists
          if (!cells[cellIterator] && cells[cellIterator + 1]) {
            cellIterator++;
            continue;
          } else if (!cells[cellIterator]) {
            continue;
          }

          const { cellType } = cells[cellIterator];

          // Calculate position of image cell on the main canvas
          const posX =
            padding + verticalGap * col + helperCanvasObj.config.width * col;
          const posY =
            padding + horizontalGap * row + helperCanvasObj.config.height * row;

          // Clear small canvas to prevent elements overlapping
          helperCanvasObj.clearCanvas();

          switch (cellType) {
            case 'data':
              this.renderDataCell(helperCanvasObj, cells[cellIterator]);
              break;
            case 'text':
              this.renderTextCell(helperCanvasObj, cells[cellIterator]);
              break;
          }

          // Place small canvas content on the main canvas
          ctx.drawImage(helperCanvasObj.element, posX, posY);

          cellIterator++;
        }
      }

      // Add vertical separator
      this.addSeparator(
        [this.config.width / 2, this.config.padding],
        [
          this.config.width / 2,
          helperCanvasObj.config.height * 2 + this.config.horizontalGap * 2
        ]
      );

      // Add horizontal separator
      this.addSeparator(
        [
          this.config.padding,
          this.config.padding +
            helperCanvasObj.config.height +
            this.config.horizontalGap / 2
        ],
        [
          this.config.width - this.config.padding,
          this.config.padding +
            helperCanvasObj.config.height +
            this.config.horizontalGap / 2
        ]
      );
    }

    /**
     * Add generation timestamp to the canvas
     */
    addTimestamp() {
      const { colorPrimary, fontSize, fontFamily, width, height, bottomSpace } =
        this.config;

      this.canvasCtx.textAlign = 'center';
      this.canvasCtx.textBaseline = 'middle';
      this.canvasCtx.fillStyle = colorPrimary;
      this.canvasCtx.font = `${fontSize - 20}px ${fontFamily}`;
      this.canvasCtx.fillText(
        `Wygenerowano ${Canvas.timestamp}`,
        width / 2,
        height - bottomSpace / 2
      );
    }

    /**
     * Add line separator between cells
     * @param {Array<Number>} from Start point coordinates
     * @param {Array<Number>} to End point coordinates
     */
    addSeparator(from, to) {
      const ctx = this.canvasCtx;

      const [startFromX, startFromY] = from;
      const [moveToX, moveToY] = to;

      ctx.strokeStyle = this.config.colorAccent;
      ctx.beginPath();
      ctx.moveTo(startFromX, startFromY);
      ctx.lineTo(moveToX, moveToY);
      ctx.stroke();
    }

    /**
     * Return context for canvas instance
     * @returns {CanvasRenderingContext2D}
     */
    get ctx() {
      return this.canvasCtx;
    }

    /**
     * Return HTML element for canvas instance
     * @returns {HTMLElement<HTMLCanvasElement>}
     */
    get element() {
      return this.canvasEl;
    }

    /**
     * Save canvas as PNG image
     * @param {String} imageName Image filename
     */
    saveImage(imageName) {
      const link = document.createElement('a');
      const data = this.canvasEl
        .toDataURL()
        .replace('image/png', 'image/octet-stream');
      link.style.display = 'none';
      link.setAttribute('href', data);
      link.setAttribute('download', `${imageName}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    /**
     * Generate timestamp in DD.MM.YYYY hh:mm format
     * @returns {String}
     */
    static get timestamp() {
      const d = new Date();
      const pad = n => (n < 10 ? `0${n}` : n);

      return `${pad(d.getDate())}.${pad(
        d.getMonth() + 1
      )}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    /**
     * Generate random RGB color
     * @returns {String}
     */
    static get randomColor() {
      const a = [...Array(3)].map(() => Math.floor(Math.random() * 256));
      return `rgb(${a.join(',')})`;
    }
  }

  class UI {
    constructor(parentContainerEl) {
      this.parentContainerEl = parentContainerEl;
    }

    /**
     * Create main button and listen for events
     */
    createActionBtn(callback) {
      const btnEl = document.createElement('button');
      btnEl.style.backgroundColor = 'red';
      btnEl.style.position = 'fixed';
      btnEl.style.bottom = '20px';
      btnEl.style.right = '20px';
      btnEl.style.width = '50px';
      btnEl.style.height = '50px';
      btnEl.style.borderRadius = '50%';
      btnEl.style.border = '1px solid transparent';

      btnEl.addEventListener('click', callback);

      this.parentContainerEl.appendChild(btnEl);
      this.actionBtnEl = btnEl;
    }

    /**
     * Set color of the main button
     * @param {String} color
     */
    colorBtn(color) {
      this.actionBtnEl.style.backgroundColor = color;
    }

    /**
     * Click on every input with a given value
     * @param {Array<String>} values Array of values to find and interact with
     */
    static selectInputsByValue(values) {
      for (let v of values) {
        const inputEl = document.querySelector(`input[value="${v}"]`);

        if (inputEl) {
          inputEl.click();
        }
      }
    }

    /**
     * Select input, set value and dispatch change event
     * @param {String} selector CSS selector of an element
     * @param {*} value Value to be set
     */
    static selectOption(selector, value) {
      const inputEl = document.querySelector(selector);

      if (inputEl) {
        inputEl.value = `${value}`;
        inputEl.dispatchEvent(new Event('change'));
      }
    }

    /**
     * Click element represented by a given selector
     * @param {String} selector CSS selector of an element
     */
    static clickSelector(selector) {
      const el = document.querySelector(selector);

      if (el) {
        el.click();
      }
    }

    /**
     * Click `Submit` button to load data based on set config
     * Delete table content if it exists
     */
    static loadData() {
      const tableContent = document.querySelector('#capacityReport');

      if (tableContent) {
        tableContent.remove();
      }

      this.clickSelector('#submitButton button');
    }

    /**
     * Wait for an element with a given selector to be available
     * @param {String} selector CSS selector of an element
     * @returns {Promise<HTMLElement>}
     */
    static waitForElement(selector) {
      return new Promise(resolve => {
        if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
          if (document.querySelector(selector)) {
            resolve(document.querySelector(selector));
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }
  }

  class Data {
    towerMap = {
      sellable: {},
      damage: {}
    };

    /**
     * Get all data from the aisles table
     * @param {String} zoneType Zone type, can be either `sellable` or `damage`
     */
    scrapAisles(zoneType) {
      const aisles = [];

      for (let row of document.querySelectorAll('#capacityReport tbody tr')) {
        const id = row.querySelector('td:nth-child(1)').textContent;
        const utilization = parseFloat(
          row.querySelector('td:nth-child(8)').textContent
        );

        aisles.push({ id, utilization });

        // Add aisles to the tower map
        this.groupAisles(zoneType, aisles);
      }
    }

    /**
     * Get all data from the dropzones table
     */
    scrapZones() {
      const zones = {};

      for (let row of document.querySelectorAll('#capacityReport tbody tr')) {
        const dropzone = row.querySelector('td:nth-child(1)').textContent;
        const utilization = parseFloat(
          row.querySelector('td:nth-child(8)').textContent
        );

        zones[dropzone] = utilization;
      }

      this.dropZones = zones;
    }

    /**
     * Group aisles by zone type and location
     * @param {String} zoneType Zone type, can be either `sellable` or `damage`
     * @param {Array<Object<id: String, utilization: Number>>} aisles Array of aisle objects
     */
    groupAisles(zoneType, aisles) {
      for (let aisle of aisles) {
        let { id, utilization } = aisle;

        id = id.replace('P-1-', '');
        const [aisleZone, aisleNumber] = [id[0], id.slice(1)];

        if (!this.towerMap[zoneType][aisleZone]) {
          this.towerMap[zoneType][aisleZone] = {};
        }

        this.towerMap[zoneType][aisleZone][aisleNumber] = utilization;
      }
    }

    /**
     * Map aisles to zone based on zone type, location and range
     * @param {Object} zoneConfig
     * @returns {Object} Object of key:value pairs where key is aisle number and value is aisle utilization
     */
    mapZone(zoneConfig) {
      const { towerLocation, range, type } = zoneConfig;
      const [start, end] = range;
      const aisles = {};

      for (let aisle in this.towerMap[type][towerLocation]) {
        const aisleNumber = parseInt(aisle);

        if (aisleNumber >= start && aisleNumber <= end) {
          aisles[aisleNumber] = this.towerMap[type][towerLocation][aisleNumber];
        }
      }

      return aisles;
    }

    /**
     * Calculate total utilization for a given zone base on its dropZones
     * @param {Object} zoneConfig
     * @returns {Number} Float number representing total zone utilization formatted with fixed-point notation
     */
    calculateTotalUtilization(zoneConfig) {
      const { dropZones } = zoneConfig;
      let tmpUtilization = 0;

      for (let dropZone of dropZones) {
        tmpUtilization += this.dropZones[dropZone];
      }

      return (tmpUtilization / dropZones.length).toFixed(2);
    }
  }

  // Canvas design config
  const mainCanvasConfig = {
    id: 'main-canvas',
    width: 1920,
    height: 1080,
    padding: 40,
    verticalGap: 50,
    horizontalGap: 50,
    bottomSpace: 80,
    colorBackground: '#2d3436',
    colorPrimary: '#EFFBFF',
    colorAccent: '#ffa500',
    fontSize: 50,
    fontFamily: 'Arial'
  };

  const helperCanvasConfig = {
    ...mainCanvasConfig,
    id: 'helper-canvas',
    width:
      (mainCanvasConfig.width -
        mainCanvasConfig.padding * 2 -
        mainCanvasConfig.verticalGap) /
      2,
    height:
      (mainCanvasConfig.height -
        mainCanvasConfig.padding -
        mainCanvasConfig.horizontalGap -
        mainCanvasConfig.bottomSpace) /
      2
  };

  // Init stowmap data class
  const data = new Data();

  // Wait for stowmap to load data
  await UI.waitForElement('#records-table');

  // Get main container element
  const containerEl = document.querySelector('.main-Filters');

  // Create UI elements
  const ui = new UI(containerEl);
  const mainCanvas = new Canvas(containerEl, mainCanvasConfig);
  const helperCanvas = new Canvas(containerEl, helperCanvasConfig);

  // Stowmap data has been loaded, listen for btn events
  ui.createActionBtn(async () => {
    // Clear all bin types
    UI.clickSelector('#types');

    // Select bin types
    UI.selectInputsByValue(['LIBRARY', 'LIBRARY-DEEP']);

    // Check only unlocked bins
    UI.clickSelector('#lockedNo');

    // Load dropzones view
    UI.selectInputsByValue(['1']);
    UI.selectOption('.group-bins', 'DropZone');
    ui.colorBtn('orange');
    UI.loadData();
    await UI.waitForElement('#capacityReport');

    // Scrap dropzones data
    data.scrapZones();

    // Load dmg aisles view
    const dmgInputs = ['1', 'pa1d_damage_a1', 'pa1d_damage_b1'];

    UI.selectInputsByValue(dmgInputs);
    UI.selectOption('.group-bins', 'Aisle');
    UI.loadData();
    await UI.waitForElement('#capacityReport');

    // Show all aisles
    UI.selectOption('select[name="capacityReport_length"]', '500');

    // Scrap dmg aisles data
    data.scrapAisles('damage');

    // Load sellable aisles view
    const sellableInputs = [
      '1',
      'pa1a_reactive',
      'pa1a_hrv',
      'pa1a_media',
      'pa1b_hardline',
      'pa1b_non_flam_aerosols',
      'pa1b_restricted_hazmat_a',
      'pa1d_flammables_a1',
      'pa1d_hardline',
      'pa1d_flam_aerosols_a1',
      'pa1d_non_flam_aerosols',
      'pa1d_corrosive_a1',
      'pa1d_corrosive_high_velo',
      'DAMAGE'
    ];

    UI.selectInputsByValue(sellableInputs);
    UI.loadData();
    await UI.waitForElement('#capacityReport');

    // Show all aisles
    UI.selectOption('select[name="capacityReport_length"]', '500');

    // Scrap sellable aisles data
    data.scrapAisles('sellable');

    // Map aisles from tower map to zones based on range and location
    for (let zone of zonesConfig) {
      zone.aisles = data.mapZone(zone);
      zone.totalUtilization = data.calculateTotalUtilization(zone);
    }

    // Create image for each screen
    screenConfig.forEach(async (screen, screenIdx) => {
      let { name, cells } = screen;

      // Map screen cell config to zone object
      screenConfig[screenIdx].cells = cells.map(cell => {
        if (!cell) {
          return null;
        }

        // Find zone config by its code
        const zoneIdx = zonesConfig.findIndex(zone => zone.code == cell.code);

        switch (cell.type) {
          case 'data':
            const [zoneStart, zoneEnd] = cell.range;
            const { aisles } = zonesConfig[zoneIdx];

            let aislesToDisplay = [];

            // Filter out aisles not in tv range
            for (let aisle = zoneStart; aisle <= zoneEnd; aisle++) {
              if (aisles[aisle]) {
                aislesToDisplay.push({ aisle, utilization: aisles[aisle] });
              }
            }

            // Sort aisles by utilization
            aislesToDisplay.sort(
              ({ utilization: au }, { utilization: bu }) => au - bu
            );

            // Reduce number of aisles
            aislesToDisplay = aislesToDisplay.slice(0, 9);

            // Check for cell details to be displayed next to zone range
            const cellDetails = cell.details ? cell.details : '';

            return zonesConfig[zoneIdx]
              ? {
                  ...zonesConfig[zoneIdx],
                  cellType: cell.type,
                  aislesToDisplay,
                  cellDetails
                }
              : null;
          case 'text':
            return { ...cell, ...zonesConfig[zoneIdx], cellType: cell.type };
        }
      });

      // Style main canvas and create screen image
      mainCanvas.clearCanvas();
      mainCanvas.addBackground();
      mainCanvas.addTimestamp();
      mainCanvas.renderMainImage(helperCanvas, screenConfig[screenIdx]);

      // Save image
      mainCanvas.saveImage(name);
    });

    ui.colorBtn('green');
  });
})();
