// ==UserScript==
// @name                WME GeoFile
// @namespace           https://github.com/JS55CT
// @description         WME GeoFile is a File Importer that allows you to import various geometry files (supported formats: GeoJSON, KML, WKT, GML, GPX, OSM, shapefiles(SHP,SHX,DBF).ZIP) into the Waze Map Editor (WME).
// @version             2025.06.30.00
// @author              JS55CT
// @match               https://www.waze.com/*/editor*
// @match               https://www.waze.com/editor*
// @match               https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @require             https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.15.0/proj4-src.js
// @require             https://update.greasyfork.org/scripts/524747/1542062/GeoKMLer.js
// @require             https://update.greasyfork.org/scripts/527113/1538395/GeoKMZer.js
// @require             https://update.greasyfork.org/scripts/523986/1575829/GeoWKTer.js
// @require             https://update.greasyfork.org/scripts/523870/1534525/GeoGPXer.js
// @require             https://update.greasyfork.org/scripts/526229/1537672/GeoGMLer.js
// @require             https://update.greasyfork.org/scripts/526996/1537647/GeoSHPer.js
// @connect             tigerweb.geo.census.gov
// @connect             greasyfork.org
// @connect             epsg.io
// @grant               GM_xmlhttpRequest
// @license             Waze Development and Editing Community License
// @downloadURL https://update.greasyfork.org/scripts/540764/WME%20GeoFile.user.js
// @updateURL https://update.greasyfork.org/scripts/540764/WME%20GeoFile.meta.js
// ==/UserScript==

/************************************************************************************************************************************************************************
  This script is based on the original "[WME Geometries v1.8](https://greasyfork.org/en/scripts/8129-wme-geometries/code?version=1284539)" 
  script by Timbones and contributors.

  **Permission to share this modified version with the Waze editing community was given by Timbones to JS55CT in May 2025 via conversation in Discord.**
  
  Given this, I share this version of the script under the following LICENSE:

  Waze Development and Editing Community License:

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to use
  the Software solely for purposes related to Waze Development and Editing,
  including contributions to the Waze platform, map editing, and related community
  projects, subject to the following conditions:

  1. **Scope of Use**:
     - The Software may only be used by individuals who are active participants in the Waze Development and Editing community.
     - The Software shall not be used for any commercial purpose without prior written consent from the Licensor.
     - Redistribution, modification, or integration of the Software in projects outside the Waze community is prohibited.

  2. **Restrictions**:
     - Unauthorized copying, sharing, or distribution of the Software outside the Waze community is expressly forbidden.
     - The Software shall not be integrated into any tool, application, or project that is not directly related to Waze map editing or development.

  3. **Contribution Back**:
     - Modifications and improvements made to the Software must be reported back to the Licensor and, whenever possible, shared with the broader Waze Development and Editing community.

  4. **Termination**:
     - This license may be terminated by the Licensor if the terms are violated, or if the Software is used in a manner inconsistent with the intended use within the Waze community.

  5. **No Warranty**:
     - The Software is provided "as is", without warranty of any kind, express or implied. The Licensor holds no liability for any damages or issues arising from the use of the Software.

  By using the Software, you agree to adhere to these terms and conditions, ensuring the Software remains beneficial and accessible to the intended community.
*************************************************************************************************************************************************************************/

/********
 * TO DO LIST:
 *  1. Update Labels for line feachers for pathLabel? and pathLabelCurve?  Need to understand installPathFollowingLabels() more.
 *********/

/*
External Variables and Objects:
GM_info: 
unsafeWindow: 
WazeWrap: external utility library for interacting with the Waze Map Editor environment.
LZString: library used for compressing and decompressing strings.
proj4: Proj4-src.js version 2.15.0
GeoWKTer, GeoGPXer, GeoGMLer, GeoKMLer, GeoKMZer, GeoSHPer external classes/functions used for parsing geospatial data formats.
*/

(async function main() {
  'use strict';
  const scriptMetadata = GM_info.script;
  const scriptName = scriptMetadata.name;
  const downloadUrl = 'https://update.greasyfork.org/scripts/540764/WME%20GeoFile.user.js';
  let geolist;
  let debug = false;
  let formats;
  let formathelp;
  let db;
  let groupToggler;
  let projectionMap = {};

  function layerStoreObj(fileContent, color, fileext, filename, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, labelattribute, orgFileext) {
    this.fileContent = fileContent;
    this.color = color;
    this.fileext = fileext;
    this.filename = filename;
    this.fillOpacity = fillOpacity;
    this.fontsize = fontsize;
    this.lineopacity = lineopacity;
    this.linesize = linesize;
    this.linestyle = linestyle;
    this.labelpos = labelpos;
    this.labelattribute = labelattribute;
    this.orgFileext = orgFileext;
  }

  let wmeSDK;
  try {
    wmeSDK = await bootstrap({ useWazeWrap: true, scriptUpdateMonitor: { downloadUrl } });
    const formatResults = createLayersFormats();
    formats = formatResults.formats;
    formathelp = formatResults.formathelp;
    // HACK bootstrp uses "wme-ready" "Dispatched only once, after the wme-initialized, wme-logged-in, and wme-map-data-loaded events have been dispatched."
    // But we need wmeSDK.DataModel.Countries.getTopCountry(); in init() fires with null 90% of the time, so have to wait a little!
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`${scriptName}: Bootstrap complete: All dependencies are ready.`);
    init();
  } catch (error) {
    console.error('Error during bootstrap initialization:', error);
  }

  /*********************************************************************
   * loadLayers
   *
   * Loads all saved layers from the IndexedDB and processes each one asynchronously.
   * This function retrieves the entire set of stored layers, decompresses them,
   * and invokes the parsing function for each layer, enabling them to be rendered or manipulated further.
   *
   * Workflow Details:
   * 1. Logs the start of the loading process to the console.
   * 2. Initiates a read-only transaction with the IndexedDB to fetch all stored layers.
   * 3. If layers are available:
   *    a. Displays a parsing message indicating processing is underway.
   *    b. Iterates over each stored layer asynchronously, using `loadLayer` to fetch and decompress each layer individually.
   *    c. Calls `parseFile` on each successfully loaded layer to process and render it.
   *    d. Ensures the parsing message is hidden upon completion of all operations.
   * 4. Logs a message when no layers are present to be loaded.
   *
   * Error Handling:
   * - Logs and rejects any errors occurring during the IndexedDB retrieval process.
   * - Catches and logs errors for each specific layer processing attempt to avoid interrupting the overall loading sequence.
   *
   * @returns {Promise} - Resolves when all operations are complete, whether successful or encountering errors in parts.
   *************************************************************************/
  async function loadLayers() {
    console.log(`${scriptName}: Loading Saved Layers...`);

    /******** Disabling this section as I don't want to mess up WME GEOMETRIES script  **********/
    // Check local storage for any legacy layers
    /*
    if (localStorage.WMEGeoLayers !== undefined) {
      WazeWrap.Alerts.info(scriptName, 'Old layers were found in local storage. These will be deleted. Please reload your files to convert them to IndexedDB storage.');
      localStorage.removeItem('WMEGeoLayers');
      console.log(`${scriptName}: Old layers in local storage have been deleted. Please reload your files.`);
    }
    */

    // Continue by loading layers stored in IndexedDB
    const transaction = db.transaction(['layers'], 'readonly');
    const store = transaction.objectStore('layers');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = async function () {
        const storedLayers = request.result || [];

        if (storedLayers.length > 0) {
          try {
            toggleParsingMessage(true);

            const layerPromises = storedLayers.map(async (storedLayer) => {
              try {
                const layer = await loadLayer(storedLayer.filename);
                if (layer) {
                  parseFile(layer);
                }
              } catch (error) {
                console.error(`${scriptName}: Error processing layer:`, error);
              }
            });

            await Promise.all(layerPromises);
          } finally {
            toggleParsingMessage(false);
          }
        } else {
          console.log(`${scriptName}: No layers to load.`);
        }

        resolve();
      };

      request.onerror = function (event) {
        console.error(`${scriptName}: Error loading layers from IndexedDB`, event.target.error);
        reject(new Error('Failed to load layers from database'));
      };
    });
  }

  /*********************************************************************
   * Fetches and decompresses a specified layer from the IndexedDB by its filename.
   * This function handles the retrieval of a single layer, decompressing its data for subsequent usage.
   *
   * @param {string} filename - The name of the file representing the layer to be loaded.
   *
   * Workflow Details:
   * 1. Initiates a read-only transaction with the IndexedDB to fetch layer data by the filename.
   * 2. On successful retrieval:
   *    a. Decompresses the stored data using LZString and parses it back to its original form.
   *    b. Resolves the promise with the full decompressed data object.
   * 3. If no data is found for the specified filename, resolves with `null`.
   *
   * Error Handling:
   * - Logs errors to the console if data retrieval from the database fails.
   * - Rejects the promise with an error if data fetching is unsuccessful.
   *
   * @returns {Promise<Object|null>} - Resolves with the decompressed layer object if successful, or `null` if not found.
   *************************************************************************/
  async function loadLayer(filename) {
    const transaction = db.transaction(['layers'], 'readonly');
    const store = transaction.objectStore('layers');
    const request = store.get(filename);

    return new Promise((resolve, reject) => {
      request.onsuccess = function () {
        const result = request.result;
        if (result) {
          // Decompress the entire stored object
          const decompressedFileObj = JSON.parse(LZString.decompress(result.compressedData));
          resolve(decompressedFileObj);
        } else {
          resolve(null);
        }
      };

      request.onerror = function (event) {
        console.error('Error retrieving layer:', event.target.error);
        reject(new Error('Failed to fetch layer data'));
      };
    });
  }

  /*********************************************************************
   * init
   *
   * Description:
   * Initializes the user interface for the "WME GeoFile" sidebar tab in the Waze Map Editor. This function sets up
   * the DOM structure, styles, event listeners, and interactions necessary for importing and working with geometric
   * files and Well-Known Text (WKT) inputs.
   *
   * Parameters:
   * - This function does not take any direct parameters but interacts with global objects and the document's DOM.
   *
   * Behavior:
   * - Registers a new sidebar tab labeled "GEO" using Waze's userscript API.
   * - Builds a user interface dynamically, adding elements such as title sections, file inputs, and buttons for importing
   *   and clearing WKT data.
   * - Configures event listeners for file input changes and button clicks to handle layer management and WKT drawing.
   * - Sets default styles and hover effects for UI components to enhance user experience.
   * - Displays information about available formats and coordinate systems to guide users in their inputs.
   * - Ensures that the existing layers are loaded upon initialization by calling a separate function, `loadLayers`.
   *
   *************************************************************************/
  async function init() {
    console.log(`${scriptName}: Loading User Interface ...`);

    wmeSDK.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
      tabLabel.textContent = 'GeoFile';
      tabLabel.title = `${scriptName}`;

      let geobox = document.createElement('div');
      tabPane.appendChild(geobox);

      let geotitle = document.createElement('div');
      geotitle.innerHTML = GM_info.script.name;
      geotitle.style.cssText = 'text-align: center; font-size: 1.1em; font-weight: bold;';
      geobox.appendChild(geotitle);

      let geoversion = document.createElement('div');
      geoversion.innerHTML = 'v ' + GM_info.script.version;
      geoversion.style.cssText = 'text-align: center; font-size: 0.9em;';
      geobox.appendChild(geoversion);

      let hr = document.createElement('hr');
      hr.style.cssText = 'margin-top: 3px; margin-bottom: 3px; border: 0; border-top: 1px solid;';
      geobox.appendChild(hr);

      geolist = document.createElement('ul');
      geolist.style.cssText = 'margin: 5px 0; padding: 5px;';
      geobox.appendChild(geolist);

      let hr1 = document.createElement('hr');
      hr1.style.cssText = 'margin-top: 3px; margin-bottom: 3px; border: 0; border-top: 1px solid;';
      geobox.appendChild(hr1);

      let geoform = document.createElement('form');
      geoform.style.cssText = 'display: flex; flex-direction: column; gap: 0px;';
      geoform.id = 'geoform';
      geobox.appendChild(geoform);

      let fileContainer = document.createElement('div');
      fileContainer.style.cssText = 'position: relative; display: inline-block;';

      let inputfile = document.createElement('input');
      inputfile.type = 'file';
      inputfile.id = 'GeometryFile';
      inputfile.title = '.geojson, .gml or .wkt';
      inputfile.style.cssText = 'opacity: 0; position: absolute; top: 0; left: 0; width: 95%; height: 100%; cursor: pointer; pointer-events: none;';
      fileContainer.appendChild(inputfile);

      let customLabel = createButton('Import GEO File', '#8BC34A', '#689F38', '#FFFFFF', 'label', 'GeometryFile');
      fileContainer.appendChild(customLabel);
      geoform.appendChild(fileContainer);

      inputfile.addEventListener('change', addGeometryLayer, false);

      let notes = document.createElement('p');
      notes.innerHTML = `
    <b>Formats:</b><br>
    ${formathelp}<br>
    <b>EPSG:</b> Default codes supported:<br>
    | 3035 | 3414 | 4214 | 4258 | 4267 | 4283 |<br>
    | 4326 | 25832 | 26901->26923 | 27700 |<br>
    | 32601->32660 | 32701->32760 |<br>
    | All others dynamically sourced from espg.io |`;
      notes.style.cssText = 'display: block; font-size: 0.9em; margin-left: 0px; margin-bottom: 0px;';
      geoform.appendChild(notes);

      //ONLY LOAD THIS SECTION if TOP COUNTRY is the Check for US and its territories */
      try {
        const wmeTopCountry = wmeSDK.DataModel.Countries.getTopCountry();

        if (wmeTopCountry && ['US', 'GQ', 'RQ', 'VQ', 'AQ', 'CQ'].includes(wmeTopCountry.abbr)) {
          console.log(`${scriptName}: Top Level Country = ${wmeTopCountry.name} | ${wmeTopCountry.abbr}`);

          let hrElement0 = document.createElement('hr');
          hrElement0.style.cssText = 'margin: 5px 0; border: 0; border-top: 1px solid';
          geoform.appendChild(hrElement0);

          let usCensusB = document.createElement('p');
          usCensusB.innerHTML = `
        <b><a href="https://tigerweb.geo.census.gov/tigerwebmain/TIGERweb_main.html" target="_blank"; text-decoration: underline;">
          US Census Bureau:
        </a></b>`;
          usCensusB.style.cssText = 'display: block; font-size: 0.9em; margin-left: 0px; margin-bottom: 0px;';
          geoform.appendChild(usCensusB);

          // State Boundary Button
          const stateBoundaryButtonContainer = createButton('Draw State Boundary', '#E57373', '#D32F2F', '#FFFFFF', 'input');
          stateBoundaryButtonContainer.onclick = () => {
            drawBoundary('state');
          };
          geoform.appendChild(stateBoundaryButtonContainer);

          // County Boundary Button
          const countyBoundaryButtonContainer = createButton('Draw County Boundary', '#8BC34A', '#689F38', '#FFFFFF', 'input');
          countyBoundaryButtonContainer.onclick = () => {
            drawBoundary('county');
          };
          geoform.appendChild(countyBoundaryButtonContainer);

          // countySub Boundary Button
          const countySubBoundaryButtonContainer = createButton('Draw County Sub Boundary', '#42A5F5', '#1976D2', '#FFFFFF', 'input');
          countySubBoundaryButtonContainer.onclick = () => {
            drawBoundary('countysub');
          };
          geoform.appendChild(countySubBoundaryButtonContainer);

          // ZipCode Boundary Button
          const zipCodeBoundaryButtonContainer = createButton('Draw Zip Code Boundary', '#6F66D2', '#645CBD', '#FFFFFF', 'input');
          zipCodeBoundaryButtonContainer.onclick = () => {
            drawBoundary('zipcode');
          };
          geoform.appendChild(zipCodeBoundaryButtonContainer);

          const whatsInViewButtonContainer = createButton('Whats in View', '#BA68C8', '#9C27B0', '#FFFFFF', 'input');
          whatsInViewButtonContainer.onclick = () => {
            whatsInView();
          };
          geoform.appendChild(whatsInViewButtonContainer);
        } else {
          console.warn(`${scriptName}: Unable to determine the top country. The map might be zoomed out too far.`);
        }
      } catch (error) {
        console.warn(`${scriptName}: Unable to determine top country. Reason:`, error);
      } // END OF Check for US and its territories / US Census Bureau spacific inputs

      let hrElement1 = document.createElement('hr');
      hrElement1.style.cssText = 'margin: 5px 0; border: 0; border-top: 1px solid';
      geoform.appendChild(hrElement1);

      let inputContainer = document.createElement('div');
      inputContainer.style.cssText = 'display: flex; flex-direction: column; gap: 5px; margin-top: 10px;';

      let colorFontSizeRow = document.createElement('div');
      colorFontSizeRow.style.cssText = 'display: flex; justify-content: normal; align-items: center; gap: 0px;';

      let input_color_label = document.createElement('label');
      input_color_label.setAttribute('for', 'color');
      input_color_label.innerHTML = 'Color: ';
      input_color_label.style.cssText = 'font-weight: normal; flex-shrink: 0; margin-right: 5px;';

      let input_color = document.createElement('input');
      input_color.type = 'color';
      input_color.id = 'color';
      input_color.value = '#00bfff';
      input_color.name = 'color';
      input_color.style.cssText = 'width: 60px;';

      let input_font_size_label = document.createElement('label');
      input_font_size_label.setAttribute('for', 'font_size');
      input_font_size_label.innerHTML = 'Font Size: ';
      input_font_size_label.style.cssText = 'margin-left: 40px; font-weight: normal; flex-shrink: 0; margin-right: 5px;';

      let input_font_size = document.createElement('input');
      input_font_size.type = 'number';
      input_font_size.id = 'font_size';
      input_font_size.min = '0';
      input_font_size.max = '20';
      input_font_size.name = 'font_size';
      input_font_size.value = '12';
      input_font_size.step = '1.0';
      input_font_size.style.cssText = 'width: 50px; text-align: center;';

      colorFontSizeRow.appendChild(input_color_label);
      colorFontSizeRow.appendChild(input_color);
      colorFontSizeRow.appendChild(input_font_size_label);
      colorFontSizeRow.appendChild(input_font_size);
      inputContainer.appendChild(colorFontSizeRow);

      // Row for fill opacity input
      let fillOpacityRow = document.createElement('div');
      fillOpacityRow.style.cssText = `display: flex; flex-direction: column;`;

      // Polygon Fill Opacity
      let input_fill_opacity_label = document.createElement('label');
      input_fill_opacity_label.setAttribute('for', 'fill_opacity');
      input_fill_opacity_label.innerHTML = `Fill Opacity % [${(0.05 * 100).toFixed()}]`;
      input_fill_opacity_label.style.cssText = `font-weight: normal;`;

      let input_fill_opacity = document.createElement('input');
      input_fill_opacity.type = 'range';
      input_fill_opacity.id = 'fill_opacity';
      input_fill_opacity.min = '0';
      input_fill_opacity.max = '1';
      input_fill_opacity.step = '0.01';
      input_fill_opacity.value = '0.05';
      input_fill_opacity.name = 'fill_opacity';
      input_fill_opacity.style.cssText = `width: 100%; appearance: none; height: 12px; border-radius: 5px; outline: none;`;

      // Thumb styling via CSS pseudo-elements
      const styleElement = document.createElement('style');
      styleElement.textContent = `
    input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px; /* Thumb width */
    height: 15px; /* Thumb height */
    background: #808080;  /* Thumb color */
    cursor: pointer; /* Switch cursor to pointer when hovering the thumb */
    border-radius: 50%;
   }
   input[type=range]::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #808080;
    cursor: pointer;
    border-radius: 50%;
  }
  input[type=range]::-ms-thumb {
    width: 15px;
    height: 15px;
    background: #808080;
    cursor: pointer;
    border-radius: 50%;
  }
  `;

      document.head.appendChild(styleElement);

      // Initialize with the input color's current value and opacity
      let updateOpacityInputStyles = () => {
        let color = input_color.value;
        let opacityValue = input_fill_opacity.value;
        let rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacityValue})`;

        input_fill_opacity.style.backgroundColor = rgbaColor;
        input_fill_opacity.style.border = `2px solid ${color}`;
      };

      updateOpacityInputStyles();

      // Event listener to update the label dynamically
      input_fill_opacity.addEventListener('input', function () {
        input_fill_opacity_label.innerHTML = `Fill Opacity % [${Math.round(this.value * 100)}]`;
        updateOpacityInputStyles();
      });

      // Append elements to the fill opacity row
      fillOpacityRow.appendChild(input_fill_opacity_label);
      fillOpacityRow.appendChild(input_fill_opacity);

      // Append the fill opacity row to the input container
      inputContainer.appendChild(fillOpacityRow);

      // Section for line stroke settings
      let lineStrokeSection = document.createElement('div');
      lineStrokeSection.style.cssText = `display: flex; flex-direction: column; margin-top: 10px;`;

      // Line stroke section label
      let lineStrokeSectionLabel = document.createElement('span');
      lineStrokeSectionLabel.innerText = 'Line Stroke Settings:';
      lineStrokeSectionLabel.style.cssText = `font-weight: bold; margin-bottom: 10px;`;
      lineStrokeSection.appendChild(lineStrokeSectionLabel);

      // Line Stroke Size
      let lineStrokeSizeRow = document.createElement('div');
      lineStrokeSizeRow.style.cssText = `display: flex; align-items: center;`;

      let line_stroke_size_label = document.createElement('label');
      line_stroke_size_label.setAttribute('for', 'line_size');
      line_stroke_size_label.innerHTML = 'Size:';
      line_stroke_size_label.style.cssText = `font-weight: normal; margin-right: 5px;`;

      let line_stroke_size = document.createElement('input');
      line_stroke_size.type = 'number';
      line_stroke_size.id = 'line_size';
      line_stroke_size.min = '0';
      line_stroke_size.max = '10';
      line_stroke_size.name = 'line_size';
      line_stroke_size.value = '1';
      line_stroke_size.step = '.5';
      line_stroke_size.style.cssText = `width: 50px;`;

      lineStrokeSizeRow.appendChild(line_stroke_size_label);
      lineStrokeSizeRow.appendChild(line_stroke_size);
      lineStrokeSection.appendChild(lineStrokeSizeRow);

      // Line Stroke Style
      let lineStrokeStyleRow = document.createElement('div');
      lineStrokeStyleRow.style.cssText = `display: flex; align-items: center; gap: 10px; margin-top: 5px; margin-bottom: 5px;`;

      let line_stroke_types_label = document.createElement('span');
      line_stroke_types_label.innerText = 'Style:';
      line_stroke_types_label.style.cssText = `font-weight: normal;`;
      lineStrokeStyleRow.appendChild(line_stroke_types_label);

      let line_stroke_types = [
        { id: 'solid', value: 'Solid' },
        { id: 'dash', value: 'Dash' },
        { id: 'dot', value: 'Dot' },
      ];
      for (const type of line_stroke_types) {
        let radioContainer = document.createElement('div');
        radioContainer.style.cssText = `display: flex; align-items: center; gap: 5px;`;

        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = type.id;
        radio.value = type.id;
        radio.name = 'line_stroke_style';
        radio.style.cssText = `margin: 0; vertical-align: middle;`;

        if (type.id === 'solid') {
          radio.checked = true;
        }

        let label = document.createElement('label');
        label.setAttribute('for', radio.id);
        label.innerHTML = type.value;
        label.style.cssText = `font-weight: normal; margin: 0; line-height: 1;`;

        radioContainer.appendChild(radio);
        radioContainer.appendChild(label);

        lineStrokeStyleRow.appendChild(radioContainer);
      }

      lineStrokeSection.appendChild(lineStrokeStyleRow);
      inputContainer.appendChild(lineStrokeSection);

      // Line Stroke Opacity
      let lineStrokeOpacityRow = document.createElement('div');
      lineStrokeOpacityRow.style.cssText = `display: flex; flex-direction: column;`;

      let line_stroke_opacity_label = document.createElement('label');
      line_stroke_opacity_label.setAttribute('for', 'line_stroke_opacity');
      line_stroke_opacity_label.innerHTML = 'Opacity % [100]';
      line_stroke_opacity_label.style.cssText = `font-weight: normal;`;

      let line_stroke_opacity = document.createElement('input');
      line_stroke_opacity.type = 'range';
      line_stroke_opacity.id = 'line_stroke_opacity';
      line_stroke_opacity.min = '0';
      line_stroke_opacity.max = '1';
      line_stroke_opacity.step = '.05';
      line_stroke_opacity.value = '1';
      line_stroke_opacity.name = 'line_stroke_opacity';
      line_stroke_opacity.style.cssText = `width: 100%; appearance: none; height: 12px; border-radius: 5px; outline: none;`;

      const updateLineOpacityInputStyles = () => {
        let color = input_color.value;
        let opacityValue = line_stroke_opacity.value;
        let rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacityValue})`;
        line_stroke_opacity.style.backgroundColor = rgbaColor;
        line_stroke_opacity.style.border = `2px solid ${color}`;
      };

      updateLineOpacityInputStyles();

      line_stroke_opacity.addEventListener('input', function () {
        line_stroke_opacity_label.innerHTML = `Opacity % [${Math.round(this.value * 100)}]`;
        updateLineOpacityInputStyles();
      });

      input_color.addEventListener('input', () => {
        updateLineOpacityInputStyles();
        updateOpacityInputStyles();
      });

      lineStrokeOpacityRow.appendChild(line_stroke_opacity_label);
      lineStrokeOpacityRow.appendChild(line_stroke_opacity);

      // Append the line stroke opacity row to the input container
      inputContainer.appendChild(lineStrokeOpacityRow);

      // Adding a horizontal break before Label Position
      let hrElement2 = document.createElement('hr');
      hrElement2.style.cssText = `margin: 5px 0; border: 0; border-top: 1px solid`;
      inputContainer.appendChild(hrElement2);

      // Section for label position
      let labelPositionSection = document.createElement('div');
      labelPositionSection.style.cssText = `display: flex; flex-direction: column;`;

      // Label position section label
      let labelPositionSectionLabel = document.createElement('span');
      labelPositionSectionLabel.innerText = 'Label Position Settings:';
      labelPositionSectionLabel.style.cssText = `font-weight: bold; margin-bottom: 5px;`;
      labelPositionSection.appendChild(labelPositionSectionLabel);

      // Container for horizontal and vertical positioning options
      let labelPositionContainer = document.createElement('div');
      labelPositionContainer.style.cssText = `display: flex; margin-left: 10px; gap: 80px;`;

      // Column for horizontal alignment
      let horizontalColumn = document.createElement('div');
      horizontalColumn.style.cssText = `display: flex; flex-direction: column; gap: 5px;`;

      let horizontalLabel = document.createElement('span');
      horizontalLabel.innerText = 'Horizontal:';
      horizontalLabel.style.cssText = `font-weight: normal;`;
      horizontalColumn.appendChild(horizontalLabel);

      let label_pos_horizontal = [
        { id: 'l', value: 'Left' },
        { id: 'c', value: 'Center' },
        { id: 'r', value: 'Right' },
      ];
      for (const pos of label_pos_horizontal) {
        let radioHorizontalRow = document.createElement('div');
        radioHorizontalRow.style.cssText = `display: flex; align-items: center; gap: 5px;`;

        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = pos.id;
        radio.value = pos.id;
        radio.name = 'label_pos_horizontal';
        radio.style.cssText = `margin: 0; vertical-align: middle;`;

        let label = document.createElement('label');
        label.setAttribute('for', radio.id);
        label.innerHTML = pos.value;
        label.style.cssText = `font-weight: normal; margin: 0; line-height: 1;`;

        if (radio.id === 'c') {
          radio.checked = true;
        }

        radioHorizontalRow.appendChild(radio);
        radioHorizontalRow.appendChild(label);
        horizontalColumn.appendChild(radioHorizontalRow);
      }

      // Column for vertical alignment
      let verticalColumn = document.createElement('div');
      verticalColumn.style.cssText = `display: flex; flex-direction: column; gap: 5px;`;

      let verticalLabel = document.createElement('span');
      verticalLabel.innerText = 'Vertical:';
      verticalLabel.style.cssText = `font-weight: normal;`;
      verticalColumn.appendChild(verticalLabel);

      let label_pos_vertical = [
        { id: 't', value: 'Top' },
        { id: 'm', value: 'Middle' },
        { id: 'b', value: 'Bottom' },
      ];
      for (const pos of label_pos_vertical) {
        let radioVerticalRow = document.createElement('div');
        radioVerticalRow.style.cssText = `display: flex; align-items: center; gap: 5px;`;

        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = pos.id;
        radio.value = pos.id;
        radio.name = 'label_pos_vertical';
        radio.style.cssText = `margin: 0; vertical-align: middle;`;

        let label = document.createElement('label');
        label.setAttribute('for', radio.id);
        label.innerHTML = pos.value;
        label.style.cssText = `font-weight: normal; margin: 0; line-height: 1;`;

        if (radio.id === 'm') {
          radio.checked = true;
        }

        radioVerticalRow.appendChild(radio);
        radioVerticalRow.appendChild(label);
        verticalColumn.appendChild(radioVerticalRow);
      }

      // Append columns to the label position container
      labelPositionContainer.appendChild(horizontalColumn);
      labelPositionContainer.appendChild(verticalColumn);
      labelPositionSection.appendChild(labelPositionContainer);
      inputContainer.appendChild(labelPositionSection);
      geoform.appendChild(inputContainer);

      // Adding a horizontal break before the WKT input section
      let hrElement3 = document.createElement('hr');
      hrElement3.style.cssText = `margin: 5px 0; border: 0; border-top: 1px solid`;
      geoform.appendChild(hrElement3);

      // New label for the Text Area for WKT input section
      let wktSectionLabel = document.createElement('div');
      wktSectionLabel.innerHTML = 'WKT Input: (<a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry" target="_blank">WKT Format</a> )';
      wktSectionLabel.style.cssText = `font-weight: bold; margin-bottom: 5px; margin-top: 5px; display: block;`;
      geoform.appendChild(wktSectionLabel);

      // Text Area for WKT input
      let wktContainer = document.createElement('div');
      wktContainer.style.cssText = `display: flex; flex-direction: column; gap: 5px;`;

      // Input for WKT Name
      let input_WKT_name = document.createElement('input');
      input_WKT_name.type = 'text';
      input_WKT_name.id = 'input_WKT_name';
      input_WKT_name.name = 'input_WKT_name';
      input_WKT_name.placeholder = 'Name of WKT';
      input_WKT_name.style.cssText = `padding: 8px; font-size: 1rem; border: 2px solid; border-radius: 5px; width: 100%; box-sizing: border-box;`;
      wktContainer.appendChild(input_WKT_name);

      // Text Area for WKT input
      let input_WKT = document.createElement('textarea');
      input_WKT.id = 'input_WKT';
      input_WKT.name = 'input_WKT';
      input_WKT.placeholder = 'POINT(X Y)  LINESTRING (X Y, X Y,...)  POLYGON(X Y, X Y, X Y,...) etc....';
      input_WKT.style.cssText = `width: 100%; height: 10rem; min-height: 5rem; max-height: 40rem; padding: 8px; font-size: 1rem; border: 2px solid; border-radius: 5px; box-sizing: border-box; resize: vertical;`;
      // Restrict resizing to vertical
      wktContainer.appendChild(input_WKT);

      // Container for the buttons
      let buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `display: flex; gap: 45px;`;

      let submit_WKT_btn = createButton('Import WKT', '#8BC34A', '#689F38', '#FFFFFF', 'input');
      submit_WKT_btn.id = 'submit_WKT_btn';
      submit_WKT_btn.title = 'Import WKT Geometry to WME Layer';
      submit_WKT_btn.addEventListener('click', draw_WKT);
      buttonContainer.appendChild(submit_WKT_btn);

      let clear_WKT_btn = createButton('Clear WKT', '#E57373', '#D32F2F', '#FFFFFF', 'input');
      clear_WKT_btn.id = 'clear_WKT_btn';
      clear_WKT_btn.title = 'Clear WKT Geometry Input and Name';
      clear_WKT_btn.addEventListener('click', clear_WKT_input);
      buttonContainer.appendChild(clear_WKT_btn);

      wktContainer.appendChild(buttonContainer);
      geoform.appendChild(wktContainer); // Append the container to the form

      // Add Toggle Button for Debug
      let debugToggleContainer = document.createElement('div');
      debugToggleContainer.style.cssText = `display: flex; align-items: center; margin-top: 15px;`;

      let debugToggleLabel = document.createElement('label');
      debugToggleLabel.style.cssText = `margin-left: 10px;`;

      const updateLabel = () => {
        debugToggleLabel.innerText = `Debug mode ${debug ? 'ON' : 'OFF'}`;
      };

      let debugSwitchWrapper = document.createElement('label');
      debugSwitchWrapper.style.cssText = `position: relative; display: inline-block; width: 40px; height: 20px; border: 1px solid #ccc; border-radius: 20px;`;

      let debugToggleSwitch = document.createElement('input');
      debugToggleSwitch.type = 'checkbox';
      debugToggleSwitch.style.cssText = `opacity: 0; width: 0; height: 0;`;

      let switchSlider = document.createElement('span');
      switchSlider.style.cssText = `position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px;`;

      let innerSpan = document.createElement('span');
      innerSpan.style.cssText = `position: absolute; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%;`;

      switchSlider.appendChild(innerSpan);

      const updateSwitchState = () => {
        switchSlider.style.backgroundColor = debug ? '#8BC34A' : '#ccc';
        innerSpan.style.transform = debug ? 'translateX(20px)' : 'translateX(0)';
      };

      debugToggleSwitch.checked = debug;
      updateLabel();
      updateSwitchState();

      debugToggleSwitch.addEventListener('change', () => {
        debug = debugToggleSwitch.checked;
        updateLabel();
        updateSwitchState();
        console.log(`${scriptName}: Debug mode is now ${debug ? 'enabled' : 'disabled'}`);
      });

      debugSwitchWrapper.appendChild(debugToggleSwitch);
      debugSwitchWrapper.appendChild(switchSlider);
      debugToggleContainer.appendChild(debugSwitchWrapper);
      debugToggleContainer.appendChild(debugToggleLabel);
      geoform.appendChild(debugToggleContainer);

      console.log(`${scriptName}: User Interface Loaded!`);
    });

    setupProjectionsAndTransforms();

    wmeSDK.Events.on({
      eventName: 'wme-map-move-end',
      eventHandler: () => {
        const whatsInView = document.getElementById('WMEGeowhatsInViewMessage');

        if (whatsInView) {
          // Call the update function to refresh the contents of the existing popup
          updateWhatsInView(whatsInView);
        }
        // If the message does not exist, do nothing
      },
    });

    try {
      await initDatabase(); // Now you can safely call functions that use the db
      console.log(`${scriptName}: IndexedDB initialized successfully!`);
      loadLayers();
    } catch (error) {
      console.error(`${scriptName}: Application Initialization Error:`, error);
    }
  }

  function initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('GeometryLayersDB', 1);

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('layers')) {
          db.createObjectStore('layers', { keyPath: 'filename' });
        }
      };

      request.onsuccess = function (event) {
        db = event.target.result;
        resolve();
      };

      request.onerror = function (event) {
        console.error('Failed to open IndexedDB:', event.target.error);
        reject(new Error('IndexedDB initialization failed'));
      };
    });
  }

  /****************************************************************************************
 * setupProjectionsAndTransforms
 *
 * Initializes and registers coordinate reference systems (CRS) and their transformations
 * using the Proj4 library. Ensures a wide range of geographic projections are available 
 * for accurate map rendering and interoperability.
 *
 * Function Workflow:
 * 1. **Projection Definitions**:
 *    - Defines proj4-compatible string definitions for a variety of EPSG codes.
 *    - Each projection is associated with properties like `units` and `maxExtent`.
 *    - Includes global systems like WGS84 and a range of UTM zone projections.

 * 2. **Registration Process**:
 *    - Registers each projection definition with the proj4 library.
 *    - Projections are made available for use in geographic applications needing diverse CRS support.

 * 3. **Alias and Identifier Mapping**:
 *    - Creates a `projectionMap` linking common CRS identifiers to EPSG codes.
 *    - Utilizes template-based logic to generate multiple aliases for each projection, 
 *      simplifying reference and lookup across applications.

 * 4. **UTM Zones Configuration**:
 *    - Automatically constructs and registers UTM zone projections for both hemispheres 
 *      using a loop to cover EPSG:326xx and EPSG:327xx series.

 * 5. **Logging and Debugging**:
 *    - Provides comprehensive logging if debugging is enabled, listing registered projections
 *      and their detailed definitions for verification and troubleshooting.

 * Notes:
 * - Ensure this function runs at initialization to make all defined projections and transformations 
 *   instantly available across your mapping application.
 * - Alerts or logs errors if prerequisites are missing or issues arise during setup.
 ****************************************************************************************/
  function setupProjectionsAndTransforms() {
    // Define projection mappings with additional properties needed to create OpenLayers projections (units: , maxExtent: yx:)
    //definition: should be in proj4js format
    const projDefs = {
      'EPSG:4326': {
        definition: '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
      },
      'EPSG:3857': {
        definition: '+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs',
      },
      'EPSG:900913': {
        definition: '+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs',
      },
      'EPSG:102100': {
        definition: '+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs',
      },
      'EPSG:4269': {
        definition: '+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees',
      },
      'EPSG:4267': {
        definition: '+title=NAD27 +proj=longlat +ellps=clrk66 +datum=NAD27 +no_defs',
      },
      'EPSG:3035': {
        definition: '+title=ETRS89-extended / LAEA Europe +proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:4258': {
        definition: '+title=ETRS89 (European Terrestrial Reference System 1989 +proj=longlat +ellps=GRS80 +no_defs +type=crs',
      },
      'EPSG:25832': {
        definition: '+title=ETRS89 / UTM zone 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:27700': {
        definition: '+title=OSGB36 / British National Grid +proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060 +units=m +no_defs',
      },
      'EPSG:4283': {
        definition: '+title=GDA94 / Geocentric Datum of Australia 1994 +proj=longlat +ellps=GRS80 +no_defs +type=crs',
      },
      'EPSG:4214': {
        definition: '+title=Beijing 1954 +proj=longlat +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +no_defs +type=crs',
      },
      'EPSG:3414': {
        definition:
          '+title=SVY21 / Singapore TM +proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
      },
      // NAD 83 and by Zone
      'EPSG:26901': {
        definition: '+title=NAD83 / UTM zone 1N +proj=utm +zone=1 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26902': {
        definition: '+title=NAD83 / UTM zone 2N +proj=utm +zone=2 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26903': {
        definition: '+title=NAD83 / UTM zone 3N +proj=utm +zone=3 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26904': {
        definition: '+title=NAD83 / UTM zone 4N +proj=utm +zone=4 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26905': {
        definition: '+title=NAD83 / UTM zone 5N +proj=utm +zone=5 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26906': {
        definition: '+title=NAD83 / UTM zone 6N +proj=utm +zone=6 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26907': {
        definition: '+title=NAD83 / UTM zone 7N +proj=utm +zone=7 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26908': {
        definition: '+title=NAD83 / UTM zone 8N +proj=utm +zone=8 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26909': {
        definition: '+title=NAD83 / UTM zone 9N +proj=utm +zone=9 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26910': {
        definition: '+title=NAD83 / UTM zone 10N +proj=utm +zone=10 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26911': {
        definition: '+title=NAD83 / UTM zone 11N +proj=utm +zone=11 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26912': {
        definition: '+title=NAD83 / UTM zone 12N +proj=utm +zone=12 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26913': {
        definition: '+title=NAD83 / UTM zone 13N +proj=utm +zone=13 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26914': {
        definition: '+title=NAD83 / UTM zone 14N +proj=utm +zone=14 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26915': {
        definition: '+title=NAD83 / UTM zone 15N +proj=utm +zone=15 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26916': {
        definition: '+title=NAD83 / UTM zone 16N +proj=utm +zone=16 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26917': {
        definition: '+title=NAD83 / UTM zone 17N +proj=utm +zone=17 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26918': {
        definition: '+title=NAD83 / UTM zone 18N +proj=utm +zone=18 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26919': {
        definition: '+title=NAD83 / UTM zone 19N +proj=utm +zone=19 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26920': {
        definition: '+title=NAD83 / UTM zone 20N +proj=utm +zone=20 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26921': {
        definition: '+title=NAD83 / UTM zone 21N +proj=utm +zone=21 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26922': {
        definition: '+title=NAD83 / UTM zone 22N +proj=utm +zone=22 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
      'EPSG:26923': {
        definition: '+title=NAD83 / UTM zone 23N +proj=utm +zone=23 +ellps=GRS80 +towgs84=-2,0,4,0,0,0,0 +units=m +no_defs +type=crs',
      },
    };

    // Add WGS 84 UTM Zones - Global UTM zones covering various longitudes for both hemispheres
    for (let zone = 1; zone <= 60; zone++) {
      projDefs[`EPSG:${32600 + zone}`] = {
        definition: `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`,
      };
      projDefs[`EPSG:${32700 + zone}`] = {
        definition: `+proj=utm +zone=${zone} +south +datum=WGS84 +units=m +no_defs`,
      };
    }

    // Register the projections in proj4.defs
    for (const [epsg, { definition }] of Object.entries(projDefs)) {
      proj4.defs(epsg, definition);
    }

    // Logging the # of registered proj4 definitions
    if (debug) {
      const defsCount = Object.entries(proj4.defs).length;
      console.log(`${scriptName}: Number of proj4 definitions registered: ${defsCount}`);
    }

    projectionMap = {
      // WGS84 common aliases, same as EPSG:4326
      CRS84: 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:CRS84': 'EPSG:4326',
      WGS84: 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:WGS84': 'EPSG:4326',
      'WGS 84': 'EPSG:4326',
      'WGS_84': 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:WGS_84': 'EPSG:4326',
      'CRS WGS84': 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:CRS_WGS84': 'EPSG:4326',
      'CRS:WGS84': 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:CRS:WGS84': 'EPSG:4326',
      'CRS::WGS84': 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:CRS::WGS84': 'EPSG:4326',
      'CRS:84': 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:CRS:84': 'EPSG:4326',
      'CRS::84': 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:CRS::84': 'EPSG:4326',
      'CRS 84': 'EPSG:4326',
      'urn:ogc:def:crs:OGC:1.3:CRS_84': 'EPSG:4326',
      // NAD83 common aliases, same as EPSG:4269
      'NAD 83': 'EPSG:4269',
      'NAD_83': 'EPSG:4269',
      'urn:ogc:def:crs:OGC:1.3:NAD_83': 'EPSG:4269',
      NAD83: 'EPSG:4269',
      'urn:ogc:def:crs:OGC:1.3:NAD83': 'EPSG:4269',
      // ETRS89 / LAEA Europe common aliases, same as EPSG:3035
      'ETRS 89': 'EPSG:3035',
      'ETRS_89': 'EPSG:3035',
      'urn:ogc:def:crs:OGC:1.3:ETRS_89': 'EPSG:3035',
      ETRS89: 'EPSG:3035',
      'urn:ogc:def:crs:OGC:1.3:ETRS89': 'EPSG:3035',
      // NAD27 common aliases, same as EPSG:4267
      'NAD 27': 'EPSG:4267',
      'NAD_27': 'EPSG:4267',
      'urn:ogc:def:crs:OGC:1.3:NAD_27': 'EPSG:4267',
      NAD27: 'EPSG:4267',
      'urn:ogc:def:crs:OGC:1.3:NAD27': 'EPSG:4267',
    };

    const identifierTemplates = [
      'EPSG:{{code}}',
      'urn:ogc:def:crs:EPSG:{{code}}',
      'urn:ogc:def:crs:OGC:1.3:EPSG:{{code}}',
      'EPSG::{{code}}',
      'urn:ogc:def:crs:EPSG::{{code}}',
      'urn:ogc:def:crs:OGC:1.3:EPSG::{{code}}',
      'CRS:{{code}}',
      'urn:ogc:def:crs:OGC:1.3:CRS:{{code}}',
      'CRS::{{code}}',
      'urn:ogc:def:crs:OGC:1.3:CRS::{{code}}',
      'CRS {{code}}',
      'CRS_{{code}}',
      'urn:ogc:def:crs:OGC:1.3:CRS_{{code}}',
      'CRS{{code}}',
      'urn:ogc:def:crs:OGC:1.3:CRS{{code}}',
    ];

    // Extract EPSG codes from the projDefs object
    const epsgCodes = Object.keys(projDefs).map((key) => key.split(':')[1]);
    epsgCodes.forEach((code) => {
      identifierTemplates.forEach((template) => {
        const identifier = template.replace('{{code}}', code);
        projectionMap[identifier] = `EPSG:${code}`;
      });
    });

    if (debug) console.log(`${scriptName}: projectionMap:`, projectionMap);
  }

  /****************************************************************************************
   * fetchProjString
   *
   * Retrieves the projection definition string for a specified CRS identifier from `epsg.io`.
   * This function attempts to identify the EPSG code from various formats using a pattern
   * matching approach and then makes an HTTP request to fetch the corresponding projection
   * string. The result is stored in the `proj4` definitions for future CRS transformations.
   * Handles both retrieval and error scenarios, reporting back through a callback.
   *
   * Parameters:
   * @param {string} identifier - The CRS identifier that may be in various formats.
   * @param {function} callback - A function invoked with either an error or a success message
   * containing the fetched projection definition.
   *
   * Workflow:
   * - Utilizes regex patterns to extract the numeric EPSG code from varying CRS identifier formats.
   * - Constructs the standard EPSG code string and maps it in the global projectionMap for quick reference.
   * - Forms a request URL targeting the EPSG service `epsg.io`, which provides projection data.
   * - Executes `GM_xmlhttpRequest` to asynchronously fetch the definition string.
   * - On successful retrieval, updates `proj4.defs` with the definition; otherwise, calls back with an error.
   * - Provides informative feedback through the callback, capturing success details or error context.
   ****************************************************************************************/
  function fetchProjString(identifier, callback) {
    // Function to extract the EPSG code from various identifier formats
    function extractEPSGCode(identifier) {
      const identifierPatterns = [
        /^EPSG:(\d+)$/,
        /^urn:ogc:def:crs:EPSG:(\d+)$/,
        /^urn:ogc:def:crs:OGC:1\.3:EPSG:(\d+)$/,
        /^EPSG::(\d+)$/,
        /^urn:ogc:def:crs:EPSG::(\d+)$/,
        /^urn:ogc:def:crs:OGC:1\.3:EPSG::(\d+)$/,
        /^CRS:(\d+)$/,
        /^urn:ogc:def:crs:OGC:1\.3:CRS:(\d+)$/,
        /^CRS::(\d+)$/,
        /^urn:ogc:def:crs:OGC:1\.3:CRS::(\d+)$/,
        /^CRS (\d+)$/,
        /^CRS_(\d+)$/,
        /^urn:ogc:def:crs:OGC:1\.3:CRS_(\d+)$/,
        /^CRS(\d+)$/,
        /^urn:ogc:def:crs:OGC:1\.3:CRS(\d+)$/,
      ];

      for (const pattern of identifierPatterns) {
        const match = identifier.match(pattern);
        if (match) {
          return match[1]; // Return the captured EPSG code
        }
      }

      throw new Error('Invalid EPSG code format');
    }

    try {
      // Extract the plain EPSG code using the helper function
      const epsgCode = extractEPSGCode(identifier);
      const epsg = `EPSG:${epsgCode}`; // Construct EPSG format for usage
      // Add to projectionMap
      projectionMap[identifier] = epsg;

      const url = `https://epsg.io/${epsgCode}.proj4`;

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            // Update proj4.defs with the fetched definition
            proj4.defs(epsg, response.responseText);
            // Create the informational message
            const message = `${epsg} was added with definition: ${response.responseText}`;
            callback(null, message);
          } else {
            callback(new Error(`Failed to get ESPG Projection data from espg.io for ${identifier}: status code:${response.status}`), null);
          }
        },
        onerror: function (error) {
          callback(new Error(`Network Error: ${error}`), null);
        },
      });
    } catch (error) {
      // If the EPSG code extraction fails, pass the error to the callback
      callback(error, null);
    }
  }

  /****************************************************************************
   * draw_WKT
   *
   * Description:
   * Parses user-supplied Well-Known Text (WKT) to create a geometric layer on the map using the wicket.js library for
   * reliable parsing. This function configures the layer with user-defined styling options and ensures the layer is
   * stored and displayed appropriately.
   *
   * Parameters:
   * - No explicit parameters are passed; all input is taken from DOM elements configured by the user.
   *
   * Behavior:
   * - Retrieves styling options and WKT input from predefined HTML elements.
   * - Checks for duplicate layer names to prevent adding layers with the same name to the map.
   * - Validates the presence of WKT input and handles errors related to parsing and conversion to GeoJSON format.
   * - Constructs a `layerStoreObj` containing the parsed GeoJSON data and its styling details.
   * - Uses `parseFile` to add the parsed and styled layer to the map.
   * - Compresses and stores the layer information in `localStorage` for persistence.
   * - Provides users with real-time feedback via console logs and alerts when debug mode is enabled or when errors arise.
   *
   * Notes:
   * - Utilizes global variables and functions such as `formats`, `storedLayers`, and `parseFile`.
   * - Relies on DOM elements and user inputs that need to be correctly set up in the environment for this function to work.
   *****************************************************************************/
  function draw_WKT() {
    // Retrieve style and layer options
    let color = document.getElementById('color').value;
    let fillOpacity = document.getElementById('fill_opacity').value;
    let fontsize = document.getElementById('font_size').value;
    let lineopacity = document.getElementById('line_stroke_opacity').value;
    let linesize = document.getElementById('line_size').value;
    let linestyle = document.querySelector('input[name="line_stroke_style"]:checked').value;
    let layerName = document.getElementById('input_WKT_name').value.trim();
    let labelpos = document.querySelector('input[name="label_pos_horizontal"]:checked').value + document.querySelector('input[name="label_pos_vertical"]:checked').value;

    // Check for empty layer name
    if (!layerName) {
      if (debug) console.error(`${scriptName}: WKT Input layer name cannot be empty.`);
      WazeWrap.Alerts.error(scriptName, 'WKT Input layer name cannot be empty.');
      return;
    }

    // Attempt to check if the layer already exists using SDK
    const layerID = layerName.replace(/[^a-z0-9_-]/gi, '_');

    try {
      // Try setting the visibility of the layer to check existence
      wmeSDK.Map.setLayerVisibility({
        layerName: layerID,
        visibility: true,
      });

      // If this succeeds, the layer already exists
      if (debug) console.error(`${scriptName}: Current layer name "${layerName}" already used!`);
      WazeWrap.Alerts.error(scriptName, `Current layer name "${layerName} " already used!`);
      return;
    } catch (error) {
      if (error.name === 'InvalidStateError') {
        // Layer does not exist: it's safe to proceed further
        if (debug) console.log(`${scriptName}: Layer name ${layerName} does not exist, proceeding to parse file.`);
      } else {
        console.error(`${scriptName}: Error checking layer existence`, error);
        WazeWrap.Alerts.error(scriptName, `Error checking layer existence.\n${error.message}`);
        return;
      }
    }

    // Retrieve and validate WKT input
    let wktInput = document.getElementById('input_WKT').value.trim();
    if (!wktInput) {
      if (debug) console.error(`${scriptName}: WKT input is empty.`);
      WazeWrap.Alerts.error(scriptName, 'WKT input is empty.');
      return;
    }

    try {
      // Create an instance of GeoWKTer
      const geoWKTer = new GeoWKTer();
      const wktString = geoWKTer.read(wktInput, layerName);
      const geojson = geoWKTer.toGeoJSON(wktString); // Convert to GeoJSON

      // Prepare the layer object and invoke parseFile, which handles layer creation
      const obj = new layerStoreObj(geojson, color, 'GEOJSON', layerName, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, '${Name}', 'WKT');
      parseFile(obj);
    } catch (error) {
      console.error(`${scriptName}: Error processing WKT input`, error);
      WazeWrap.Alerts.error(scriptName, `Error processing WKT input. Please check your input format.\n${error.message}`);
    }
  }

  // Clears the current contents of the textarea.
  function clear_WKT_input() {
    document.getElementById('input_WKT').value = '';
    document.getElementById('input_WKT_name').value = '';
  }

  /****************************************************************************
   * Draws the boundary of a geographical region (state, county, or CountySub) using ArcGIS data and user-defined
   * formatting options. Retrieves and parses geographical data, applies specified styling, and checks for existing layers
   * to prevent duplicating the visualization on the map. Alerts are shown for operations and error handling.
   *
   * @param {string} item - A descriptor indicating the type of boundary to be drawn (e.g., "State", "County", "CountySub").
   *
   * Function workflow:
   * 1. Collects styling options from HTML form elements, which include color, opacity, font size, line styles, and label positions.
   * 2. Utilizes `getArcGISdata` to fetch the GeoJSON representation of the specified boundary.
   * 3. Validates the fetched data to ensure features exist. If none are found, alerts the user.
   * 4. Checks the map for existing boundary visualizations to avoid duplicating them.
   * 5. If a valid and non-duplicate boundary is identified:
   *    a. Constructs a new `layerStoreObj` using the fetched GeoJSON data and the user-defined styling options.
   *    b. Calls `parseFile` to render the boundary onto the map.
   * 6. Logs messages and displays alerts about the success of the operation, duplicate layers, and any data retrieval errors.
   *
   * Error Handling:
   * - Logs errors to the console and displays alerts for data retrieval issues from the GIS service.
   * - Notifies the user if the retrieved data does not contain any features.
   * - Alerts on attempts to render already loaded boundaries.
   *****************************************************************************/
  function drawBoundary(item) {
    if (debug) console.log(`drawBoundary called with item: ${item}`);
    // Retrieve styling options
    let color = document.getElementById('color').value;
    let fillOpacity = document.getElementById('fill_opacity').value;
    let fontsize = document.getElementById('font_size').value;
    let lineopacity = document.getElementById('line_stroke_opacity').value;
    let linesize = document.getElementById('line_size').value;
    let linestyle = document.querySelector('input[name="line_stroke_style"]:checked').value;
    let labelpos = document.querySelector('input[name="label_pos_horizontal"]:checked').value + document.querySelector('input[name="label_pos_vertical"]:checked').value;

    // Get boundary geoJSON from is US Census Bureau
    getArcGISdata(item)
      .then((geojson) => {
        if (!geojson || !geojson.features || geojson.features.length === 0) {
          console.log(`No ${item} Boundary Available, Sorry!`);
          WazeWrap.Alerts.info(scriptName, `No ${item} Boundary Available, Sorry!`);
          return;
        }
        // Extract the first feature, assuming that's the desired state boundary for simplicity
        const Feature = geojson.features[0];
        let layerName;

        if (item === 'zipcode') {
          layerName = `ZIP CODE: ${Feature.properties.BASENAME}`;
        } else {
          layerName = Feature.properties.NAME;
        }
        const layerID = layerName.replace(/[^a-z0-9_-]/gi, '_');

        try {
          // Attempt to set the visibility of the layer using the SDK to check if it exists
          wmeSDK.Map.setLayerVisibility({
            layerName: layerID,
            visibility: true,
          });

          // If successful, the layer already exists
          if (debug) console.log(`${scriptName}: current ${item} "${layerName}" boundary already loaded`);
          WazeWrap.Alerts.error(scriptName, `Current ${item} "${layerName}" Boundary already Loaded!`);
          return;
        } catch (error) {
          if (error.name === 'InvalidStateError') {
            // Layer does not exist: it's safe to proceed further
            if (debug) console.log(`${scriptName}: Layer "${layerName}" does not exist, proceeding to parse file.`);
          } else {
            console.error(`${scriptName}: Error checking layer existence`, error);
            WazeWrap.Alerts.error(scriptName, `Error checking layer existence.\n${error.message}`);
            return;
          }
        }

        // Create the layer object and invoke parseFile since the layer does not exist
        const obj = new layerStoreObj(geojson, color, 'GEOJSON', layerName, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, `${layerName}`, 'GEOJSON');
        parseFile(obj);
      })
      .catch((error) => {
        console.error(`${scriptName}: Failed to retrieve ${item} boundary:`, error);
        WazeWrap.Alerts.error(scriptName, `Failed to retrieve ${item} boundary.`);
      });
  }

  /*************************************************************************
   * addGeometryLayer
   *
   * Description:
   * Facilitates the addition of a new geometry layer to the map by reading a user-selected file, parsing its contents,
   * and configuring the layer with specified styling options. The function also updates UI elements and handles storage
   * of the layer information.
   *
   * Process:
   * - Captures a file from a user's file input and determines its extension and name.
   * - Collects styling and configuration options from the user interface through DOM elements.
   * - Validates user-selected file format against supported formats, handling any unsupported formats with an error message.
   * - Leverages a `FileReader` to asynchronously read the file's contents and creates a `fileObj`.
   * - Calls `parseFile` to interpret `fileObj`, creating and configuring the geometry layers on the map.
   * - Updates persistent storage with compressed data to save the state of added geometrical layers.
   *
   * Notes:
   * - Operates within a larger system context, relying on global variables such as `formats` for file format validation.
   *************************************************************************/
  function addGeometryLayer() {
    const fileList = document.getElementById('GeometryFile');
    const file = fileList.files[0];
    fileList.value = '';

    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf('.');

    const fileext = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1).toUpperCase() : '';
    const filename = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

    // Collect configuration options from UI
    const color = document.getElementById('color').value;
    const fillOpacity = document.getElementById('fill_opacity').value;
    const fontsize = document.getElementById('font_size').value;
    const lineopacity = document.getElementById('line_stroke_opacity').value;
    const linesize = document.getElementById('line_size').value;
    const linestyle = document.querySelector('input[name="line_stroke_style"]:checked').value;
    const labelpos = document.querySelector('input[name="label_pos_horizontal"]:checked').value + document.querySelector('input[name="label_pos_vertical"]:checked').value;

    const reader = new FileReader();

    reader.onload = function (e) {
      requestAnimationFrame(() => {
        try {
          let fileObj;

          switch (fileext) {
            case 'ZIP':
              if (debug) console.log(`${scriptName}: .ZIP shapefile file found, converting to GEOJSON...`);
              if (debug) console.time(`${scriptName}: .ZIP shapefile conversion in`);

              const geoSHPer = new GeoSHPer();

              (async () => {
                try {
                  toggleParsingMessage(true); // turned off in parseFile()

                  await geoSHPer.read(e.target.result);
                  const SHPgeoJSON = geoSHPer.toGeoJSON();
                  if (debug) console.timeEnd(`${scriptName}: .ZIP shapefile conversion in`);

                  const fileObj = new layerStoreObj(SHPgeoJSON, color, 'GEOJSON', filename, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, '', 'SHP');
                  parseFile(fileObj);
                } catch (error) {
                  toggleParsingMessage(false);
                  handleError('ZIP shapefile')(error);
                }
              })();
              break;

            case 'WKT':
              try {
                // WKT files are assumed to be in projection WGS84  = EPSG:4326
                if (debug) console.log(`${scriptName}: .WKT file found, converting to GEOJSON...`);
                if (debug) console.time(`${scriptName}: .WKT conversion in`);
                toggleParsingMessage(true); // turned off in parseFile()

                const geoWKTer = new GeoWKTer();
                const wktDoc = geoWKTer.read(e.target.result, filename);
                const WKTgeoJSON = geoWKTer.toGeoJSON(wktDoc);

                if (debug) console.timeEnd(`${scriptName}: .WKT conversion in`);
                fileObj = new layerStoreObj(WKTgeoJSON, color, 'GEOJSON', filename, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, '', fileext);
                parseFile(fileObj);
              } catch (error) {
                toggleParsingMessage(false);
                handleError('WKT conversion')(error);
              }
              break;

            case 'GPX':
              //The GPX format is inherently based on the WGS 84 coordinate system (EPSG:4326)
              try {
                if (debug) console.log(`${scriptName}: .GPX file found, converting to GEOJSON...`);
                if (debug) console.time(`${scriptName}: .GPX conversion in`);
                toggleParsingMessage(true); // turned off in parseFile()

                const geoGPXer = new GeoGPXer();
                const gpxDoc = geoGPXer.read(e.target.result);
                const GPXtoGeoJSON = geoGPXer.toGeoJSON(gpxDoc);

                if (debug) console.timeEnd(`${scriptName}: .GPX conversion in`);
                fileObj = new layerStoreObj(GPXtoGeoJSON, color, 'GEOJSON', filename, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, '', fileext);
                parseFile(fileObj);
              } catch (error) {
                toggleParsingMessage(false);
                handleError('GPX conversion')(error);
              }
              break;

            case 'KML':
              //Represent geographic data and are natively based on the WGS 84 coordinate system (EPSG:4326)
              try {
                if (debug) console.log(`${scriptName}: .KML file found, converting to GEOJSON...`);
                if (debug) console.time(`${scriptName}: .KML conversion in`);
                toggleParsingMessage(true); // turned off in parseFile()

                const geoKMLer = new GeoKMLer();
                const kmlDoc = geoKMLer.read(e.target.result);
                const KMLtoGeoJSON = geoKMLer.toGeoJSON(kmlDoc, true);

                if (debug) console.timeEnd(`${scriptName}: .KML conversion in`);
                fileObj = new layerStoreObj(KMLtoGeoJSON, color, 'GEOJSON', filename, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, '', fileext);
                parseFile(fileObj);
              } catch (error) {
                toggleParsingMessage(false);
                handleError('KML conversion')(error);
              }
              break;

            case 'KMZ':
              //Represent geographic data and are natively based on the WGS 84 coordinate system (EPSG:4326)
              if (debug) console.log(`${scriptName}: .KMZ file found, extracting .KML files...`);
              if (debug) console.time(`${scriptName}: .KMZ conversion in`);
              toggleParsingMessage(true); // turned off in parseFile()

              const geoKMZer = new GeoKMZer();

              (async () => {
                try {
                  // Read and parse the KMZ file
                  const kmlContentsArray = await geoKMZer.read(e.target.result);

                  // Iterate over each KML file extracted from the KMZ
                  kmlContentsArray.forEach(({ filename: kmlFile, content }, index) => {
                    // Construct unique filenames for each KML file
                    const uniqueFilename = kmlContentsArray.length > 1 ? `${filename}_${index + 1}` : `${filename}`;

                    if (debug) console.log(`${scriptName}: Converting extracted .KML to GEOJSON...`);
                    const geoKMLer = new GeoKMLer();
                    const kmlDoc = geoKMLer.read(content);
                    const KMLtoGeoJSON = geoKMLer.toGeoJSON(kmlDoc, true);

                    if (debug) console.timeEnd(`${scriptName}: .KMZ conversion in`);
                    fileObj = new layerStoreObj(KMLtoGeoJSON, color, 'GEOJSON', uniqueFilename, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, '', 'KMZ');
                    parseFile(fileObj);
                  });
                } catch (error) {
                  toggleParsingMessage(false);
                  handleError('KMZ read operation')(error);
                }
              })();
              break;

            case 'GML':
              try {
                if (debug) console.log(`${scriptName}: .GML file found, converting to GEOJSON...`);
                if (debug) console.time(`${scriptName}: .GML conversion in`);
                toggleParsingMessage(true); // turned off in parseFile()

                const geoGMLer = new GeoGMLer();
                const gmlDoc = geoGMLer.read(e.target.result);
                const GMLtoGeoJSON = geoGMLer.toGeoJSON(gmlDoc);

                if (debug) console.timeEnd(`${scriptName}: .GML conversion in`);

                fileObj = new layerStoreObj(GMLtoGeoJSON, color, 'GEOJSON', filename, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, '', fileext);
                parseFile(fileObj);
              } catch (error) {
                toggleParsingMessage(false);
                handleError('GML conversion')(error);
              }
              break;

            case 'GEOJSON':
              try {
                if (debug) console.log(`${scriptName}: .GEOJSON file found...`);
                toggleParsingMessage(true); // turned off in parseFile()
                const geojsonData = JSON.parse(e.target.result); // Parse the .GEOJSON file content as a JSON object
                fileObj = new layerStoreObj(geojsonData, color, fileext, filename, fillOpacity, fontsize, lineopacity, linesize, linestyle, labelpos, '', fileext);
                parseFile(fileObj);
              } catch (error) {
                toggleParsingMessage(false);
                handleError('GEOJSON parsing')(error);
              }
              break;

            default:
              toggleParsingMessage(false);
              handleError('unsupported file type')(new Error('Unsupported file type'));
              break;
          }
        } catch (error) {
          toggleParsingMessage(false);
          handleError('file')(error);
        }
      });
    };

    if (fileext === 'ZIP' || fileext === 'KMZ') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }

    function handleError(context) {
      return (error) => {
        console.error(`${scriptName}: Error parsing ${context}:`, error);
        WazeWrap.Alerts.error(scriptName, `${error}`);
      };
    }
  }

  /****************************************************************************************
   * transformGeoJSON
   *
   * Transforms the coordinates of a GeoJSON object from a source CRS to a target CRS using proj4.
   * Validates CRS formats and ensures their definitions exist in proj4 before proceeding.
   *
   * Parameters:
   * @param {Object} geoJSON - The GeoJSON object to transform, which can be a FeatureCollection,
   * Feature, GeometryCollection, or Geometry.
   * @param {string} sourceCRS - The source Coordinate Reference System, formatted as 'EPSG:####'.
   * @param {string} targetCRS - The target Coordinate Reference System, formatted as 'EPSG:####'.
   *
   * Returns:
   * @returns {Object} - The transformed GeoJSON object with updated coordinates.
   *
   * Workflow:
   * - Validates CRS formats and checks for their existence in proj4 definitions.
   * - Depending on GeoJSON type, recursively applies coordinate conversion.
   * - Updates the CRS information within the GeoJSON to reflect the target CRS.
   ****************************************************************************************/
  function transformGeoJSON(geoJSON, sourceCRS, targetCRS) {
    if (debug) console.log(`${scriptName}: transformGeoJSON() called with SourceCRS = ${sourceCRS} and TargetCRS = ${targetCRS}`);

    const isValidCRS = (crs) => typeof crs === 'string' && /^EPSG:\d{4,5}$/.test(crs);

    if (!isValidCRS(sourceCRS) || !isValidCRS(targetCRS)) {
      console.error(`${scriptName}: Invalid CRS format detected: sourceCRS: ${sourceCRS}, targetCRS: ${targetCRS}`);
      throw new Error("Coordinates Reference Systems must be formatted as a string 'EPSG:####'.");
    }

    if (!proj4.defs[sourceCRS]) {
      console.error(`${scriptName}: Source CRS ${sourceCRS} is not defined in proj4.`);
      throw new Error(`Source CRS ${sourceCRS} is not defined in proj4.`);
    }

    if (!proj4.defs[targetCRS]) {
      console.error(`${scriptName}: Target CRS ${targetCRS} is not defined in proj4.`);
      throw new Error(`Target CRS ${targetCRS} is not defined in proj4.`);
    }

    const geoJSONTypeMap = {
      FEATURECOLLECTION: 'FeatureCollection',
      FEATURE: 'Feature',
      GEOMETRYCOLLECTION: 'GeometryCollection',
      POINT: 'Point',
      LINESTRING: 'LineString',
      POLYGON: 'Polygon',
      MULTIPOINT: 'MultiPoint',
      MULTILINESTRING: 'MultiLineString',
      MULTIPOLYGON: 'MultiPolygon',
    };

    const updateGeoJSONType = (type) => geoJSONTypeMap[type.toUpperCase()] || type;

    // Normalize the feacher "type" at the root level to valid geoJSON
    geoJSON.type = updateGeoJSONType(geoJSON.type);

    if (geoJSON.type === 'FeatureCollection') {
      geoJSON.features = flattenGeoJSON(geoJSON.features, sourceCRS, targetCRS);
    } else if (geoJSON.type === 'Feature') {
      // Convert the geometry into features and directly use as features
      geoJSON.features = flattenGeometry(geoJSON.geometry, sourceCRS, targetCRS);
    } else if (geoJSON.type === 'GeometryCollection') {
      // Convert each geometry into features and directly use as features
      geoJSON.features = geoJSON.geometries.flatMap((geometry) => flattenGeometry(geometry, sourceCRS, targetCRS));
    }

    geoJSON.crs = {
      type: 'name',
      properties: {
        name: targetCRS,
      },
    };

    return geoJSON;
  }

  /****************************************************************************************
   * flattenGeoJSON
   *
   * Converts complex geometries (MultiPoint, MultiLineString, MultiPolygon) into simpler forms
   * (Point, LineString, Polygon) and applies coordinate transformations.
   *
   * Parameters:
   * @param {Array} features - The array of features from the GeoJSON FeatureCollection.
   * @param {string} sourceCRS - The source Coordinate Reference System, formatted as 'EPSG:####'.
   * @param {string} targetCRS - The target Coordinate Reference System, formatted as 'EPSG:####'.
   *
   * Returns:
   * @returns {Array} - The array of flattened and transformed features.
   ****************************************************************************************/
  function flattenGeoJSON(features, sourceCRS, targetCRS) {
    return features.flatMap((feature) => {
      const flattenedGeometries = [];
      geomEach(feature.geometry, (geometry) => {
        const type = geometry === null ? null : geometry.type;
        switch (type) {
          case 'Point':
          case 'LineString':
          case 'Polygon':
            flattenedGeometries.push({
              type: 'Feature',
              geometry: {
                type: type,
                coordinates: convertCoordinates(sourceCRS, targetCRS, geometry.coordinates),
              },
              properties: feature.properties,
            });
            break;
          case 'MultiPoint':
          case 'MultiLineString':
          case 'MultiPolygon':
            const geomType = type.split('Multi')[1];
            geometry.coordinates.forEach((coordinate) => {
              flattenedGeometries.push({
                type: 'Feature',
                geometry: {
                  type: geomType,
                  coordinates: convertCoordinates(sourceCRS, targetCRS, coordinate),
                },
                properties: feature.properties,
              });
            });
            break;
          case 'GeometryCollection':
            geometry.geometries.forEach((geom) => {
              flattenedGeometries.push({
                type: 'Feature',
                geometry: {
                  type: geom.type,
                  coordinates: convertCoordinates(sourceCRS, targetCRS, geom.coordinates),
                },
                properties: feature.properties,
              });
            });
            break;
          default:
            throw new Error(`Unknown Geometry Type: ${type}`);
        }
      });
      return flattenedGeometries;
    });
  }

  /**
   * Flattens and transforms a GeoJSON geometry into a collection of GeoJSON features,
   * converting coordinates from a source CRS to a target CRS.
   *
   * @param {Object} geometry - The GeoJSON geometry object to be flattened.
   * @param {string} sourceCRS - The EPSG code of the source Coordinate Reference System.
   * @param {string} targetCRS - The EPSG code of the target Coordinate Reference System.
   * @returns {Array<Object>} - An array of GeoJSON features derived from the input geometry.
   *
   * The function handles various geometry types:
   * - Converts 'Point', 'LineString', and 'Polygon' directly into features.
   * - Splits 'MultiPoint', 'MultiLineString', and 'MultiPolygon' into individual features.
   * - Each feature includes the transformed coordinates and an empty properties object.
   *
   * Throws an error if the geometry type is unknown.
   */
  function flattenGeometry(geometry, sourceCRS, targetCRS) {
    const flattenedFeatures = [];
    geomEach(geometry, (geom) => {
      const type = geom === null ? null : geom.type;
      switch (type) {
        case 'Point':
        case 'LineString':
        case 'Polygon':
          flattenedFeatures.push({
            type: 'Feature',
            geometry: {
              type: type,
              coordinates: convertCoordinates(sourceCRS, targetCRS, geom.coordinates),
            },
            properties: {}, // Add any additional properties if needed
          });
          break;
        case 'MultiPoint':
        case 'MultiLineString':
        case 'MultiPolygon':
          const geomType = type.split('Multi')[1];
          geom.coordinates.forEach((coordinate) => {
            flattenedFeatures.push({
              type: 'Feature',
              geometry: {
                type: geomType,
                coordinates: convertCoordinates(sourceCRS, targetCRS, coordinate),
              },
              properties: {}, // Add any additional properties if needed
            });
          });
          break;
        default:
          throw new Error(`Unknown Geometry Type: ${type}`);
      }
    });
    return flattenedFeatures;
  }

  /****************************************************************************************
   * geomEach
   *
   * Iterates over each geometry in a feature to handle different types and coordinate structures.
   *
   * Parameters:
   * @param {Object} geometry - The geometry object extracted from a feature.
   * @param {Function} callback - A callback function to execute for each geometry type.
   ****************************************************************************************/
  function geomEach(geometry, callback) {
    const type = geometry === null ? null : geometry.type;
    switch (type) {
      case 'Point':
      case 'LineString':
      case 'Polygon':
        callback(geometry);
        break;
      case 'MultiPoint':
      case 'MultiLineString':
      case 'MultiPolygon':
        geometry.coordinates.forEach((coordinate) => {
          callback({
            type: type.split('Multi')[1],
            coordinates: coordinate,
          });
        });
        break;
      case 'GeometryCollection':
        geometry.geometries.forEach(callback);
        break;
      default:
        throw new Error(`Unknown Geometry Type: ${type}`);
    }
  }

  /****************************************************************************************
   * convertCoordinates
   *
   * Converts coordinates from a source CRS to a target CRS using proj4. Handles different
   * coordinate structures like points, lines, and polygons recursively if necessary.
   *
   * Parameters:
   * @param {string} sourceCRS - The CRS of the input coordinates, as 'EPSG:####'.
   * @param {string} targetCRS - The CRS to convert the coordinates to, as 'EPSG:####'.
   * @param {Array} coordinates - Array representing the coordinates to be converted. This
   * could be a single point [x, y] or recursive arrays for lines and polygons.
   *
   * Returns:
   * @returns {Array} - The converted coordinates with Z & M dimension removed if present.
   *
   * Workflow:
   * - Recursively converts coordinate arrays for complex geometries.
   * - Applies proj4 transformation to single points.
   ****************************************************************************************/
  function convertCoordinates(sourceCRS, targetCRS, coordinates) {
    // Function to strip Z coordinates
    function stripZ(coords) {
      if (Array.isArray(coords[0])) {
        return coords.map(stripZ);
      } else {
        return coords.slice(0, 2); // Return only X, Y
      }
    }

    const strippedCoords = stripZ(coordinates);
    // Handle multi-point, line, or polygon coordinates recursively if needed
    if (Array.isArray(strippedCoords[0])) {
      return strippedCoords.map((coordinate) => convertCoordinates(sourceCRS, targetCRS, coordinate));
    }

    // Handle single point coordinates
    if (typeof strippedCoords[0] === 'number') {
      const [x, y] = strippedCoords; // Destructure into x and y

      // Convert the single point using proj4
      const convertedPoint = proj4(sourceCRS, targetCRS, [x, y]);
      return convertedPoint;
    }

    console.warn(`${scriptName}: Unsupported coordinate format detected. Returning coordinates unchanged.`);
    return strippedCoords;
  }

  /****************************************************************************************
   * parseFile
   *
   * Handles the parsing and processing of geographic data from a given file object, managing
   * projections and styling, and integrating parsed features as a vector layer on the map.
   * The function dynamically adjusts to the identified CRS from the input data or defaults
   * to a standard coordinate reference system, ensuring smooth operations and UI feedback
   * on file processing status.
   *
   * Parameters:
   * @param {Object} fileObj - Contains all relevant data and configurations for processing.
   *   - {string} filename - Name of the input file to be processed.
   *   - {string} orgFileext - Original file extension determining parser logic.
   *   - {Object} fileContent - Original content of the file, usually GeoJSON format.
   *   - {string} color - Designated color for styling the feature layer.
   *   - {number} lineopacity, linesize, linestyle - Parameters for configuring line aesthetics.
   *   - {number} fillOpacity - Controls opacity for filled regions within features.
   *   - {number} fontsize - Specifies font size for feature labels.
   *   - {string} labelpos - Defines positional anchor for labels on the map.
   *   - {string} labelattribute - Attribute key for labeling features.
   *
   * Workflow:
   * - Determines the source CRS from GeoJSON content; defaults to 'EPSG:4326' if unspecified.
   * - Checks for mapped CRS in projectionMap, or dynamically fetches definitions with fetchProjString.
   * - Engages proj4 to transform GeoJSON features to the target CRS ('EPSG:4326').
   * - Validates presence of parsed features, handling errors gracefully and alerting the user.
   * - Prompts user for label attribute selection if not predefined, enhancing interactivity.
   * - Successfully positions styled feature layer in the map, reflecting parsed content.
   * - Updates user interface elements to relay parsing status and results.
   ****************************************************************************************/
  function parseFile(fileObj) {
    if (debug) console.log(`${scriptName}: parseFile(): called with input:`, fileObj);

    const orgFileext = fileObj.orgFileext.toUpperCase();
    const fileContent = fileObj.fileContent;
    const filename = fileObj.filename;

    // Default CRS if none is specified
    let sourceCRS = 'EPSG:4326';

    // Check if a CRS definition exists in the GeoJSON file
    if (fileContent.crs && fileContent.crs.properties && fileContent.crs.properties.name) {
      const projection = fileContent.crs.properties.name;
      const mappedCRS = projectionMap[projection];

      if (mappedCRS) {
        sourceCRS = mappedCRS;
        if (debug) console.log(`${scriptName}: External Projection found: ${projection} mapped to: ${sourceCRS}`);
        processFileContent();
      } else {
        fetchProjString(projection, function (error, message) {
          if (error) {
            const supportedProjections = 'EPSG:3035|3414|4214|4258|4267|4283|4326|25832|26901->26923|27700|32601->32660|32701->32760|';
            const errorMessage = `
                        Found unsupported projection: ${projection}.
                        Default supported projections are: ${supportedProjections}
                        Could not source a projection definition from epsg.io.
                        Cannot proceed without a supported projection.`;
            console.error(`${scriptName}: Error - ${errorMessage}`);
            WazeWrap.Alerts.error(scriptName, errorMessage);
            toggleParsingMessage(false);
            return;
          } else {
            console.log(`${scriptName}: Info: ${message}`);
            sourceCRS = projectionMap[projection];
            processFileContent();
          }
        });
      }
    } else {
      const message = 'No External projection found. Defaulting to EPSG:4326 (WGS 84).';
      if (debug) {
        console.warn(`${scriptName}: Warning - ${message}`);
        WazeWrap.Alerts.info(scriptName, message);
      }
      processFileContent();
    }

    function processFileContent() {
      try {
        const targetCRS = 'EPSG:4326'; // New WME SDK uses EPSG:4326
        const geoJSONToParse = transformGeoJSON(fileContent, sourceCRS, targetCRS);
        const featuresSDK = geoJSONToParse.features;

        if (featuresSDK.length === 0) {
          toggleParsingMessage(false);
          console.error(`${scriptName}: No features found in transformed GeoJSON for ${filename}.${orgFileext}.`);
          WazeWrap.Alerts.error(`${scriptName}: No features found in transformed GeoJSON for ${filename}.${orgFileext}.`);
          return;
        }

        if (debug) console.log(`${scriptName}: Found ${featuresSDK.length} features for ${filename}.${orgFileext}.`);

        toggleParsingMessage(false);

        if (fileObj.labelattribute) {
          createLayerWithLabelSDK(fileObj, featuresSDK, sourceCRS);
        } else {
          if (Array.isArray(featuresSDK)) {
            if (debug) console.log(`${scriptName}: Sample feature objects:`, featuresSDK.slice(0, 10));
            presentFeaturesAttributesSDK(featuresSDK.slice(0, 50), featuresSDK.length)
              .then((selectedAttribute) => {
                if (selectedAttribute) {
                  fileObj.labelattribute = selectedAttribute;
                  console.log(`${scriptName}: Label attribute selected: ${fileObj.labelattribute}`);
                  createLayerWithLabelSDK(fileObj, featuresSDK, sourceCRS);
                }
              })
              .catch((cancelReason) => {
                console.warn(`${scriptName}: User cancelled attribute selection and import: ${cancelReason}`);
              });
          }
        }
      } catch (error) {
        toggleParsingMessage(false);
        console.error(`${scriptName}: Error parsing GeoJSON for ${filename}.${orgFileext}:`, error);
        WazeWrap.Alerts.error(`${scriptName}: Error parsing GeoJSON for ${filename}.${orgFileext}:\n${error}`);
      }
    }
  }

  /******************************************************************************************
   * createLayerWithLabelSDK
   *
   * Description:
   * Configures and adds a new vector layer to the map using the WME SDK, applying styling and
   * dynamic labeling based on attributes from geographic features. This function handles the label
   * styling context, constructs the layer using SDK capabilities, updates the UI with toggler
   * controls, and stores the layer configuration in IndexedDB to preserve its state across sessions.
   *
   * Parameters:
   * @param {Object} fileObj - Contains metadata and styling options for the layer.
   *   - {string} filename - Name of the file, sanitized and used for layer ID.
   *   - {string} color - Color for layer styling.
   *   - {number} lineopacity - Opacity for line styling.
   *   - {number} linesize - Width of lines in the layer.
   *   - {string} linestyle - Dash style for lines.
   *   - {number} fillOpacity - Opacity for filling geometries.
   *   - {number} fontsize - Font size for labels and points.
   *   - {string} labelattribute - Template string for labeling features with `${attribute}` syntax.
   *   - {string} labelpos - Position for label text alignment.
   * @param {Array} features - Array of geographic features to be added to the layer.
   * @param {Object} externalProjection - Projection object for transforming feature coordinates.
   *
   * Behavior:
   * - Constructs a label context to format and position labels based on feature attributes.
   * - Defines layer styling using attributes from `fileObj` and assigns style context for dynamic label computation.
   * - Creates a vector layer using the SDK, setting its unique ID from the sanitized filename.
   * - Uses SDK to manage layer visibility and adds geographic features to the layer.
   * - Registers the layer with a group toggler for UI controls to manage its visibility.
   * - Integrates the layer into the main map and manages associated UI elements for toggling.
   * - Prevents duplicate storage by checking existing layers, updating IndexedDB storage only for new layers.
   ******************************************************************************************/
  async function createLayerWithLabelSDK(fileObj, features, externalProjection) {
    toggleLoadingMessage(true); // Show the user the loading message!

    const delayDuration = 300;
    setTimeout(async () => {
      try {
        let labelContext = {
          formatLabel: (context) => {
            let labelTemplate = fileObj.labelattribute;

            if (!labelTemplate || labelTemplate.trim() === '') {
              return '';
            }

            labelTemplate = labelTemplate.replace(/\\n/g, '\n').replace(/<br\s*\/?>/gi, '\n');

            if (!labelTemplate.includes('${')) {
              return labelTemplate;
            }

            labelTemplate = labelTemplate
              .replace(/\${(.*?)}/g, (match, attributeName) => {
                attributeName = attributeName.trim();

                if (context?.feature?.properties?.[attributeName]) {
                  let attributeValue = context.feature.properties[attributeName] || '';
                  if (typeof attributeValue !== 'string') {
                    attributeValue = String(attributeValue);
                  }
                  attributeValue = attributeValue.replace(/<br\s*\/?>/gi, '\n');
                  return attributeValue;
                }

                return ''; // Replace with empty if attribute not found
              })
              .trim();

            return labelTemplate;
          },
        };

        const layerStyle = {
          stroke: true,
          strokeColor: fileObj.color,
          strokeOpacity: fileObj.lineopacity,
          strokeWidth: fileObj.linesize,
          strokeDashstyle: fileObj.linestyle,
          fillColor: fileObj.color,
          fillOpacity: fileObj.fillOpacity,
          pointRadius: fileObj.fontsize,
          fontColor: fileObj.color,
          fontSize: fileObj.fontsize,
          labelOutlineColor: 'black',
          labelOutlineWidth: fileObj.fontsize / 4,
          labelAlign: fileObj.labelpos,
          label: '${formatLabel}',
        };

        const layerConfig = {
          styleContext: labelContext,
          styleRules: [
            {
              predicate: () => true,
              style: layerStyle,
            },
          ],
        };

        let layerid = fileObj.filename.replace(/[^a-z0-9_-]/gi, '_');

        // Using the SDK to add the layer with styles and zIndexing
        // Future Idea: Consider removing the return statements to test scenarios where two files with the same name load into the same layer but contain different features.
        // Potential Behavior: Only the second file might get saved to IndexedDB for reload purposes. This might need upstream handling in parserFile().
        // Enhancement: Implement a prompt to ask users if they want to merge new file loads into existing layers.
        // Option: Provide a selection popup for users to choose which layer to merge if layers already exist.
        // Current Approach: For now, we stop execution and inform the user if the layer name is already in use.
        try {
          wmeSDK.Map.addLayer({
            layerName: layerid,
            styleRules: layerConfig.styleRules,
            styleContext: layerConfig.styleContext,
            zIndexing: true,
          });
        } catch (error) {
          if (error.name === 'InvalidStateError') {
            console.error(`${scriptName}: Layer "${fileObj.filename}" already exists.`);
            WazeWrap.Alerts.error(scriptName, `Current Layer "${fileObj.filename}" already exists.`);
            return;
          } else {
            console.error(`${scriptName}: Unexpected error:`, error);
            WazeWrap.Alerts.error(scriptName, `Unexpected error creating Layer "${fileObj.filename}"`);
            return;
          }
        }

        // Set visibility to true for the layer
        wmeSDK.Map.setLayerVisibility({ layerName: layerid, visibility: true });

        // Map features array with unique index-based IDs  TODO:  Look into addeding the unique ID in transformGeoJSON()
        const featuresToLog = features.map((f, index) => ({
          type: f.type,
          id: f.properties.OBJECTID || `${layerid}_${index}`, // Use feature index for uniqueness
          geometry: f.geometry,
          properties: f.properties,
        }));

        // Initialize counters for individual feature addition
        let successCount = featuresToLog.length;
        // Track the total processing time for the layer
        const layerStartTime = performance.now();

        wmeSDK.Map.dangerouslyAddFeaturesToLayerWithoutValidation({ features: featuresToLog, layerName: layerid });

        // Handle completion logging
        // Calculate and log the total processing time for the layer
        const layerEndTime = performance.now();
        const totalLayerDuration = layerEndTime - layerStartTime;

        console.log(`${scriptName}: layer: ${fileObj.filename} processed in ${totalLayerDuration.toFixed(2)} ms - ${successCount} features added`);

        // Add group toggler logic if necessary (assuming SDK supports it)
        if (!groupToggler) {
          groupToggler = addGroupToggler(false, 'layer-switcher-group_wme_geofile', 'WME GeoFile');
        }
        addToGeoList(fileObj.filename, fileObj.color, fileObj.orgFileext, fileObj.labelattribute, externalProjection);
        addLayerToggler(groupToggler, fileObj.filename, layerid);

        // Check and store layers in IndexedDB
        try {
          await storeLayer(fileObj);
        } catch (error) {
          console.error(`${scriptName}: Failed to store data in IndexedDB:`, error);
          WazeWrap.Alerts.error('Storage Error', 'Failed to store data. Ensure IndexedDB is not full and try again. Layer will not be saved.');
        }
      } finally {
        toggleLoadingMessage(false); // Turn off the loading message!
      }
    }, delayDuration);
  }

  /****************************************************************************
   * storeLayer
   *
   * Asynchronously stores a given file object in an IndexedDB object store named "layers".
   * If the file object is not already stored (determined by its filename), it will compress the object,
   * calculate its size in kilobits and megabits, and then store it.
   *
   * @param {Object} fileObj - The file object to be stored, which must include a 'filename' property.
   *
   * The function operates as follows:
   * 1. Checks whether the file identified by 'filename' already exists in the database.
   * 2. If the file does not exist:
   *    a. Compresses the entire file object using LZString compression.
   *    b. Calculates the size of the compressed data in bits, kilobits, and megabits.
   *    c. Stores the compressed data with its filename in IndexedDB.
   *    d. Logs a message to the console with the size details.
   * 3. If the file already exists, skips the storage process and logs a message.
   *
   * @returns {Promise} - Resolves when the file is successfully stored or skipped if it exists.
   *                      Rejects with an error if an operation fails.
   ****************************************************************************/
  async function storeLayer(fileObj) {
    const transaction = db.transaction(['layers'], 'readwrite');
    const store = transaction.objectStore('layers');

    return new Promise((resolve, reject) => {
      const request = store.get(fileObj.filename);

      request.onsuccess = function () {
        const existingLayer = request.result;

        if (!existingLayer) {
          // Compress the entire fileObj
          const compressedData = LZString.compress(JSON.stringify(fileObj));

          // Calculate size of compressed data
          const byteSize = compressedData.length * 2; // Assuming 2 bytes per character
          const bitSize = byteSize * 8;
          const sizeInKilobits = bitSize / 1024;
          const sizeInMegabits = bitSize / 1048576;

          const compressedFileObj = {
            filename: fileObj.filename, // Keep the filename uncompressed
            compressedData,
          };

          const addRequest = store.add(compressedFileObj);

          addRequest.onsuccess = function () {
            console.log(`${scriptName}: Stored Compressed Data file - ${fileObj.filename}. Size: ${sizeInKilobits.toFixed(2)} Kb, ${sizeInMegabits.toFixed(3)} Mb`);
            resolve();
          };

          addRequest.onerror = function (event) {
            console.error(`${scriptName}: Failed to store data in IndexedDB`, event.target.error);
            reject(new Error('Failed to store data'));
          };
        } else {
          console.log(`${scriptName}: Skipping duplicate storage for file: ${fileObj.filename}`);
          resolve();
        }
      };

      request.onerror = function (event) {
        console.error(`${scriptName}: Failed to retrieve data from IndexedDB`, event.target.error);
        reject(new Error('Failed to retrieve data'));
      };
    });
  }

  function toggleLoadingMessage(show) {
    const existingMessage = document.getElementById('WMEGeoLoadingMessage');

    if (show) {
      if (!existingMessage) {
        const loadingMessage = document.createElement('div');
        loadingMessage.id = 'WMEGeoLoadingMessage';
        loadingMessage.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 16px 32px; background: rgba(0, 0, 0, 0.7); border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); font-family: 'Arial', sans-serif; font-size: 1.1rem; text-align: center; z-index: 2000; color: #ffffff; border: 2px solid #ff5733;`;
        loadingMessage.textContent = 'WME GeoFile: New Geometries Loading, please wait...';
        document.body.appendChild(loadingMessage);
      }
    } else {
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  }

  function toggleParsingMessage(show) {
    const existingMessage = document.getElementById('WMEGeoParsingMessage');

    if (show) {
      if (!existingMessage) {
        const parsingMessage = document.createElement('div');
        parsingMessage.id = 'WMEGeoParsingMessage';
        parsingMessage.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 16px 32px; background: rgba(0, 0, 0, 0.7); border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); font-family: 'Arial', sans-serif; font-size: 1.1rem; text-align: center; z-index: 2000; color: #ffffff; border: 2px solid #33ff57;`;
        parsingMessage.textContent = 'WME GeoFile: Parsing and converting input files, please wait...';
        document.body.appendChild(parsingMessage);
      }
    } else {
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  }

  /******************************************************************************
   * Function: whatsInView
   *
   * Description:
   * Displays or updates a draggable overlay on the webpage, showing geographical data
   * currently in view. Calls `updateWhatsInView` to refresh content rather than rebuild
   * the overlay if it already exists.
   *
   * Main Operations:
   * - Checks for existing overlay (`WMEGeowhatsInViewMessage`). If present, updates it.
   * - Otherwise, creates new overlay elements styled for display.
   * - Makes the overlay draggable via its header.
   * - Integrates custom scrollbar styles for aesthetic purposes.
   * - Calls `updateWhatsInView` to fill the overlay with data.
   **********************************************************************************/
  async function whatsInView() {
    let whatsInView = document.getElementById('WMEGeowhatsInViewMessage');

    if (!whatsInView) {
      // Create the overlay if it doesn't exist
      whatsInView = document.createElement('div');
      whatsInView.id = 'WMEGeowhatsInViewMessage';
      whatsInView.style = `position: absolute; padding: 0; background: rgba(0, 0, 0, 0.8); border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); z-index: 1000; width: 375px; height: 375px; min-width: 200px; min-height: 200px; max-width: 30vw; max-height: 40vh; left: 50%; top: 50%; transform: translate(-50%, -50%); resize: both; overflow: hidden;`;

      const header = document.createElement('div');
      header.style = `background: #33ff57; font-weight: 300; color: black; padding: 5px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center; height: 30px; position: sticky; top: 0; cursor: move;`;
      const title = document.createElement('span');
      title.innerText = 'WME GeoFile - Whats in View';
      header.appendChild(title);

      const closeButton = document.createElement('span');
      closeButton.textContent = 'X';
      closeButton.style = `cursor: pointer; font-size: 20px; margin-left: 10px;`;
      closeButton.addEventListener('click', () => {
        whatsInView.remove();
      });
      header.appendChild(closeButton);

      header.onmousedown = (event) => {
        event.preventDefault();
        const initialX = event.clientX;
        const initialY = event.clientY;
        const offsetX = initialX - whatsInView.offsetLeft;
        const offsetY = initialY - whatsInView.offsetTop;

        document.onmousemove = (ev) => {
          whatsInView.style.left = `${ev.clientX - offsetX}px`;
          whatsInView.style.top = `${ev.clientY - offsetY}px`;
        };

        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };

      const contentContainer = document.createElement('div');
      contentContainer.id = 'WMEGeowhatsInViewContent';
      contentContainer.style = `padding: 5px; height: calc(100% - 30px); overflow-y: auto; overflow-x: hidden; color: #ffffff; font-family: 'Arial', sans-serif; font-size: 1.0rem; text-align: left;`;

      whatsInView.appendChild(header);
      whatsInView.appendChild(contentContainer);

      const mapElement = document.getElementsByTagName('wz-page-content')[0];
      if (mapElement) {
        mapElement.appendChild(whatsInView);
      } else {
        console.warn("DOM Element with the tag Name 'wz-page-content' not found.");
        //document.body.appendChild(whatsInView);
      }

      // Add custom scrollbar styles once
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `#WMEGeowhatsInViewMessage div::-webkit-scrollbar { width: 12px; }
      #WMEGeowhatsInViewMessage div::-webkit-scrollbar-track { background: #333333; border-radius: 10px; }
      #WMEGeowhatsInViewMessage div::-webkit-scrollbar-thumb { background-color: #33ff57; border-radius: 10px; border: 2px solid transparent; }
      #WMEGeowhatsInViewMessage div::-webkit-scrollbar-thumb:hover { background-color: #28d245; }`;
      document.head.appendChild(styleElement);
    }

    // Update content of the overlay (whether newly created or existing)
    await updateWhatsInView(whatsInView); 
  }

  /********************************************************************************
   * Function: updateWhatsInView
   *
   * Description:
   * This asynchronous function populates the content of a specified overlay with
   * sorted geographical data, including states, counties, towns, and zip codes.
   *
   * Main Operations:
   * - Clears existing content in the overlay's content container.
   * - Fetches geographic data asynchronously for states, counties, towns, and zip codes.
   * - Organizes data hierarchically (states -> counties -> towns).
   * - Sorts each level of geographic entities alphabetically.
   * - Constructs HTML content to display sorted geographic information.
   * - Renders zip codes separately, sorted alphabetically.
   *
   * Parameters:
   * - whatsInView: The DOM element containing the overlay message to be updated.
   *
   * Returns:
   * - None
   *
   * Notes:
   * Ensures data is fetched and displayed in a structured and user-friendly format within the overlay.
   ******************************************************************************/
  async function updateWhatsInView(whatsInView) {
    const contentContainer = whatsInView.querySelector('#WMEGeowhatsInViewContent');

    if (!contentContainer) {
      console.error('Content container not found in existing message.');
      return;
    }

    contentContainer.innerHTML = '';

    const dataTypes = ['state', 'county', 'countysub', 'zipcode'];
    const promises = dataTypes.map(async (dataType) => {
      try {
        return await getArcGISdata(dataType, false);
      } catch (error) {
        console.error(`Error fetching data for ${dataType}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);

    if (!results || results.length < 4 || !results[0] || !results[1] || !results[2] || !results[3]) {
      console.error('Failed to fetch necessary data');
      return;
    }

    const [stateData, countyData, townData, zipData] = results;

    // Organize states
    const states = stateData.features.reduce((acc, feature) => {
      const stateName = feature.properties.NAME;
      const stateNum = feature.properties.STATE;
      acc[stateNum] = { name: stateName, counties: {} };
      return acc;
    }, {});

    // Organize counties under respective states
    countyData.features.forEach((feature) => {
      const countyName = feature.properties.NAME;
      const countyNum = feature.properties.COUNTY;
      const stateNum = feature.properties.STATE;

      if (states[stateNum]) {
        states[stateNum].counties[countyNum] = { name: countyName, towns: [] };
      }
    });

    // Organize towns under respective counties
    townData.features.forEach((feature) => {
      const townName = feature.properties.NAME;
      const countyNum = feature.properties.COUNTY;
      const stateNum = feature.properties.STATE;

      if (states[stateNum] && states[stateNum].counties[countyNum]) {
        states[stateNum].counties[countyNum].towns.push(townName);
      }
    });

    let messageContent = '';

    // Sort states by name before processing
    const sortedStates = Object.values(states).sort((a, b) => a.name.localeCompare(b.name));

    sortedStates.forEach((state) => {
      messageContent += `<div style="margin-left: 0;"><strong>${state.name.toUpperCase()}:</strong></div>`;

      // Sort counties by name within each state
      const sortedCounties = Object.values(state.counties).sort((a, b) => a.name.localeCompare(b.name));

      sortedCounties.forEach((county) => {
        messageContent += `<div style="margin-left: 20px;"><strong>${county.name}:</strong></div>`;

        // Sort towns by name within each county
        county.towns.sort().forEach((town) => {
          messageContent += `<div style="margin-left: 40px;">&bull; ${town}</div>`;
        });
      });
    });

    messageContent += `<br><strong>ZIP CODES:</strong><br>`;

    // Sort zip codes by name and add them to the content
    const sortedZipCodes = zipData.features.sort((a, b) => {
      const zipA = a.properties.BASENAME;
      const zipB = b.properties.BASENAME;
      return zipA.localeCompare(zipB);
    });

    sortedZipCodes.forEach((feature) => {
      const zipName = feature.properties.BASENAME;
      messageContent += `<div style="margin-left: 20px;">&bull; ${zipName}</div>`;
    });

    contentContainer.innerHTML = messageContent;
  }

  /**********************************************************************************************************
   * presentFeaturesAttributesSDK
   *
   * Description:
   * Displays a user interface to facilitate the selection of an attribute from a set of geographic features.
   * If there is only one attribute, it automatically resolves with that attribute. Otherwise, it presents a modal
   * dialog with a dropdown list for the user to select the label attribute.
   *
   * Parameters:
   * @param {Array} features - An array of feature objects, each containing a set of attributes to choose from.
   *
   * Returns:
   * @returns {Promise} - A promise that resolves with the chosen attribute or rejects if the user cancels.
   *
   * Behavior:
   * - Immediately resolves if there is only one attribute across all features.
   * - Constructs a modal dialog centrally positioned on the screen to display feature properties.
   * - Iterates over the provided features, listing the attributes for each feature in a scrollable container.
   * - Utilizes a dropdown (`select` element) populated with the attributes for user selection.
   * - Includes "Import" and "Cancel" buttons to either resolve the promise with the selected attribute
   *   or reject the promise, respectively.
   * - Ensures modal visibility with a semi-transparent overlay backdrop.
   *****************************************************************************************************/
  function presentFeaturesAttributesSDK(features, nbFeatures) {
    return new Promise((resolve, reject) => {
      const allAttributes = features.map((feature) => Object.keys(feature.properties));
      const attributes = Array.from(new Set(allAttributes.flat()));

      let attributeInput = document.createElement('div');
      let title = document.createElement('label');
      let propsContainer = document.createElement('div');

      // Determine the theme to set appropriate styles
      const htmlElement = document.querySelector('html');
      const theme = htmlElement.getAttribute('wz-theme') || 'light';

      if (theme === 'dark') {
        attributeInput.style.cssText =
          'position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 1001; width: 80%; max-width: 600px; padding: 10px; background: #333; border: 3px solid #666; border-radius: 5%; display: flex; flex-direction: column;';
        title.style.cssText = 'margin-bottom: 5px; color: #ddd; align-self: center; font-size: 1.2em;';
        propsContainer.style.cssText = 'overflow-y: auto; max-height: 300px; padding: 5px; border: 3px solid #444; border-radius: 10px; ';
      } else {
        attributeInput.style.cssText =
          'position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 1001; width: 80%; max-width: 600px; padding: 10px; background:rgb(228, 227, 227); border: 3px solid #aaa; border-radius: 5%; display: flex; flex-direction: column;';
        title.style.cssText = 'margin-bottom: 5px; color: #333; align-self: center; font-size: 1.2em;';
        propsContainer.style.cssText = 'overflow-y: auto; max-height: 300px; padding: 5px; border: 2px solid black; border-radius: 10px;';
      }

      title.innerHTML = `Feature Attributes<br>Total Features: ${nbFeatures}`;
      attributeInput.appendChild(title);

      let message = document.createElement('p');
      message.style.cssText = 'margin-top: 10px; color: #777; text-align: center;';

      attributeInput.appendChild(propsContainer);

      features.forEach((feature, index) => {
        let featureHeader = document.createElement('label');
        featureHeader.style.cssText = theme === 'dark' ? 'color: #ddd; font-size: 1.1em;' : 'color: #333; font-size: 1.1em;';
        featureHeader.textContent = `Feature ${index + 1}`;
        propsContainer.appendChild(featureHeader);

        let propsList = document.createElement('ul');
        Object.keys(feature.properties).forEach((key) => {
          let propItem = document.createElement('li');
          propItem.style.cssText = 'list-style-type: none; padding: 2px; font-size: 0.9em;';
          propItem.innerHTML = `<span style="color:rgb(53, 134, 187);">${key}</span>: ${feature.properties[key]}`;
          propsList.appendChild(propItem);
        });
        propsContainer.appendChild(propsList);
      });

      let inputLabel = document.createElement('label');
      inputLabel.style.cssText = 'display: block; margin-top: 15px;';
      inputLabel.textContent = 'Select Attribute to use for Label:';

      attributeInput.appendChild(inputLabel);

      let selectBox = document.createElement('select');
      selectBox.style.cssText = 'width: 90%; padding: 8px; margin-top: 5px; margin-left: 5%; margin-right: 5%; border-radius: 5px;';
      attributes.forEach((attribute) => {
        let option = document.createElement('option');
        option.value = attribute;
        option.textContent = attribute;
        selectBox.appendChild(option);
      });

      let noLabelsOption = document.createElement('option');
      noLabelsOption.value = '';
      noLabelsOption.textContent = '- No Labels -';
      selectBox.appendChild(noLabelsOption);

      let customLabelOption = document.createElement('option');
      customLabelOption.value = 'custom';
      customLabelOption.textContent = 'Custom Label';
      selectBox.appendChild(customLabelOption);

      attributeInput.appendChild(selectBox);

      // Dynamically apply inline styles to ensure precedence
      let customLabelInput = document.createElement('textarea');
      customLabelInput.className = 'custom-label-input';
      customLabelInput.placeholder = `Enter your custom label using \${attributeName} for dynamic values.
      Feature 1
        BridgeNumber: 01995
        FacilityCarried: U.S. ROUTE 6
        FeatureCrossed: BIG RIVER
      
      Example: (explicit new lines formatting)
      #:\${BridgeNumber}\\n\${FacilityCarried} over\\n\${FeatureCrossed}
      
      Example: (multi-line formatting)
      #:\${BridgeNumber}
      \${FacilityCarried} over
      \${FeatureCrossed}

      Expected Output: 
        #:01995
        U.S. ROUTE 6 over
        BIG RIVER`;
      customLabelInput.style.cssText =
        'color: #5DADE2 !important; width: 90%; height: 300px; max-height: 300px; padding: 8px; font-size: 1rem; border: 2px solid #ddd; border-radius: 5px; box-sizing: border-box; resize: vertical; display: none; margin-top: 5px; margin-left: 5%; margin-right: 5%;';
      attributeInput.appendChild(customLabelInput);

      selectBox.addEventListener('change', () => {
        customLabelInput.style.display = selectBox.value === 'custom' ? 'block' : 'none';
      });

      let buttonsContainer = document.createElement('div');
      buttonsContainer.style.cssText = 'margin-top: 10px; display: flex; justify-content: flex-end; width: 90%; margin-left: 5%; margin-right: 5%;';

      let overlay = document.createElement('div');
      overlay.id = 'presentFeaturesAttributesOverlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;';
      overlay.appendChild(attributeInput);

      let importButton = createButton('Import', '#8BC34A', '#689F38', '#FFFFFF', 'button');
      importButton.onclick = () => {
        if (selectBox.value === 'custom' && customLabelInput.value.trim() === '') {
          WazeWrap.Alerts.error(scriptName, "Please enter a custom label expression when selecting 'Custom Label'.");
          return;
        }

        document.body.removeChild(overlay);

        let resolvedValue;
        if (selectBox.value === 'custom' && customLabelInput.value.trim() !== '') {
          resolvedValue = customLabelInput.value.trim();
        } else if (selectBox.value !== '- No Labels -') {
          resolvedValue = `\${${selectBox.value}}`;
        } else {
          resolvedValue = '';
        }
        resolve(resolvedValue);
      };

      let cancelButton = createButton('Cancel', '#E57373', '#D32F2F', '#FFFFFF', 'button');
      cancelButton.onclick = () => {
        document.body.removeChild(overlay);
        reject('Operation cancelled by the user');
      };

      buttonsContainer.appendChild(importButton);
      buttonsContainer.appendChild(cancelButton);
      attributeInput.appendChild(buttonsContainer);

      document.body.appendChild(overlay);
    });
  }

  /*************************************************************************************
   * addToGeoList
   *
   * Description:
   * Adds a new list item (representing a geographic file) to the UI's geographic file list. Each item displays the filename
   * and includes a tooltip with additional file information, like file type, label attribute, and projection details.
   * A remove button is also provided to delete the layer from the list and handle associated cleanup.
   *
   * Parameters:
   * @param {string} filename - The name of the file, used as the display text and ID.
   * @param {string} color - The color used to style the filename text.
   * @param {string} fileext - The extension/type of the file; included in the tooltip.
   * @param {string} labelattribute - The label attribute used; included in the tooltip.
   * @param {Object} externalProjection - The projection details; included in the tooltip.
   *
   * Behavior:
   * - Creates a list item styled with CSS properties for layout and hover effects.
   * - Displays the filename in the specified color, with text overflow handling.
   * - Provides additional file details in a tooltip triggered on hover.
   * - Adds a remove button to each list item, invoking the `removeGeometryLayer` function when clicked.
   * - Appends each configured list item to the global `geolist` element for UI rendering.
   ****************************************************************************************/
  function addToGeoList(filename, color, fileext, labelattribute, externalProjection) {
    let liObj = document.createElement('li');
    liObj.id = filename.replace(/[^a-z0-9_-]/gi, '_');
    liObj.style.cssText =
      'position: relative; padding: 2px 2px; margin: 2px 0; background: transparent; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; font-size: 0.95em;';

    liObj.addEventListener('mouseover', function () {
      liObj.style.background = '#eaeaea';
    });

    liObj.addEventListener('mouseout', function () {
      liObj.style.background = 'transparent';
    });

    let fileText = document.createElement('span');
    fileText.style.cssText = `color: ${color}; flex-grow: 1; flex-shrink: 1; flex-basis: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 5px;`;
    fileText.innerHTML = filename;

    const tooltipContent = `File Type: ${fileext}\nLabel: ${labelattribute}\nProjection: ${externalProjection}`;
    fileText.title = tooltipContent;

    liObj.appendChild(fileText);

    let removeButton = document.createElement('button');
    removeButton.innerHTML = 'X';
    removeButton.style.cssText = 'flex: none; background-color: #E57373; color: white; border: none; padding: 0; width: 16px; height: 16px; cursor: pointer; margin-left: 3px;';
    removeButton.addEventListener('click', () => removeGeometryLayer(filename));
    liObj.appendChild(removeButton);

    geolist.appendChild(liObj);
  }

  function createButton(text, bgColor, mouseoverColor, textColor, type = 'button', labelFor = '') {
    let element;

    if (type === 'label') {
      element = document.createElement('label');
      element.textContent = text;

      if (labelFor) {
        element.htmlFor = labelFor;
      }
    } else if (type === 'input') {
      element = document.createElement('input');
      element.type = 'button';
      element.value = text;
    } else {
      element = document.createElement('button');
      element.textContent = text;
    }

    element.style.cssText = `padding: 8px 0; font-size: 1.1rem; border: 2px solid ${bgColor}; border-radius: 20px; cursor: pointer; background-color: ${bgColor}; 
  color: ${textColor}; box-sizing: border-box; transition: background-color 0.3s, border-color 0.3s; font-weight: bold; text-align: center; width: 95%; margin: 3px;`;

    // Apply !important to forcibly set color
    element.style.setProperty('color', textColor, 'important');

    element.addEventListener('mouseover', function () {
      element.style.backgroundColor = mouseoverColor;
      element.style.borderColor = mouseoverColor;
    });

    element.addEventListener('mouseout', function () {
      element.style.backgroundColor = bgColor;
      element.style.borderColor = bgColor;
    });

    return element; // Assuming you need to return the created element
  }

  /***************************************************************************
   * removeGeometryLayer
   *
   * Description:
   * This function removes a specified geometry layer from the map, updates the stored layers,
   * and manages corresponding UI elements and local storage entries.
   *
   * Parameters:
   * @param {string} filename - The name of the file associated with the geometry layer to be removed.
   *
   * Behavior:
   * - Identifies and destroys the specified geometry layer from the map.
   * - Updates the `storedLayers` array by removing the layer corresponding to the filename.
   * - Identifies and removes UI elements associated with the layer:
   *   - The toggler item identified by the prefixed ID "t_[sanitizedFilename]".
   *   - The list item identified by the filename.
   * - Updates local storage:
   *   - Removes the entire storage entry if no layers remain.
   *   - Compresses and updates the storage entry with remaining layers if any exist.
   * - Logs the changes in local storage size.
   ****************************************************************************/
  async function removeGeometryLayer(filename) {
    const layerName = filename.replace(/[^a-z0-9_-]/gi, '_');

    try {
      // Use the SDK to remove the layer
      wmeSDK.Map.removeLayer({ layerName: layerName });
      console.log(`${scriptName}: Layer removed with ID: ${layerName}`);

      // Asynchronously remove the layer from IndexedDB
      try {
        await removeLayerFromIndexedDB(filename);
        console.log(`${scriptName}: Removed file - ${filename} from IndexedDB.`);
      } catch (error) {
        console.error(`${scriptName}: Failed to remove layer ${filename} from IndexedDB:`, error);
      }

      // Sanitize filename and define IDs
      const listItemId = filename.replace(/[^a-z0-9_-]/gi, '_');
      const layerTogglerId = `t_${listItemId}`;

      // Remove the toggler item if it exists
      const togglerItem = document.getElementById(layerTogglerId);
      if (togglerItem?.parentElement) {
        togglerItem.parentElement.removeChild(togglerItem);
      }

      // Remove any list item using the listItemId
      const listItem = document.getElementById(listItemId);
      if (listItem) {
        listItem.remove();
      }
    } catch (error) {
      console.error(`${scriptName}: Failed to remove layer or UI elements for ${filename}:`, error);
    }
  }

  // Function to remove a layer from IndexedDB
  async function removeLayerFromIndexedDB(filename) {
    if (!db) {
      // Check if the database is initialized
      return Promise.reject(new Error('Database not initialized'));
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['layers'], 'readwrite');
      const store = transaction.objectStore('layers');
      const request = store.delete(filename);

      // Transaction-level error handling
      transaction.onerror = function (event) {
        reject(new Error('Transaction failed during deletion'));
      };

      // Request-specific success and error handling
      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function (event) {
        reject(new Error('Failed to delete layer from database'));
      };
    });
  }

  /********************************************************************
   * createLayersFormats
   *
   * Description:
   * Initializes and returns an object of supported geometric data formats for use in parsing and rendering map data.
   * This function checks for the availability of various format parsers and creates instance objects for each, capturing
   * any parsing capabilities with error handling.
   *
   * Process:
   * - Verifies the availability of the `Wkt` library, logging an error if it is not loaded.
   * - Defines a helper function `tryCreateFormat` to instantiate format objects and log successes or errors.
   * - Attempts to create format instances for GEOJSON, WKT, KML, GPX, GML, OSM, and ZIP files of (SHP,SHX,DBF) using corresponding constructors.
   * - Continually builds a `formathelp` string that lists all formats successfully instantiated.
   * - Returns an object containing both the instantiated formats and the help string.
   *
   * Notes:
   * - Ensures debug logs are provided for tracing function execution when `debug` mode is active.
   **************************************************************/
  function createLayersFormats() {
    const formats = {};
    let formathelp = '';

    function tryCreateFormat(formatName, formatUtility) {
      try {
        if (typeof formatUtility === 'function') {
          try {
            const formatInstance = new formatUtility();
            formats[formatName] = formatInstance;
          } catch (constructorError) {
            formats[formatName] = formatUtility;
          }
          formathelp += `${formatName} | `;
          console.log(`${scriptName}: Successfully added format: ${formatName}`);
        } else if (formatUtility) {
          formats[formatName] = formatUtility;
          formathelp += `${formatName} | `;
          console.log(`${scriptName}: Successfully added format: ${formatName}`);
        } else {
          console.warn(`${scriptName}: ${formatName} is not a valid function or instance.`);
        }
      } catch (error) {
        console.error(`${scriptName}: Error creating format ${formatName}:`, error);
      }
    }

    // Add GEOJSON format
    formats['GEOJSON'] = 'GEOJSON';
    formathelp += 'GEOJSON | ';
    console.log(`${scriptName}: Successfully added format: GEOJSON`);

    // Add other formats using custom parsers or utilities
    tryCreateFormat('KML', typeof GeoKMLer !== 'undefined' && GeoKMLer);
    tryCreateFormat('KMZ', typeof GeoKMZer !== 'undefined' && GeoKMZer);
    tryCreateFormat('GML', typeof GeoGMLer !== 'undefined' && GeoGMLer);
    tryCreateFormat('GPX', typeof GeoGPXer !== 'undefined' && GeoGPXer);
    tryCreateFormat('WKT', typeof GeoWKTer !== 'undefined' && GeoWKTer);

    if (typeof GeoSHPer !== 'undefined') {
      formats['ZIP'] = GeoSHPer;
      formathelp += 'ZIP(SHP,DBF,PRJ,CPG) | ';
      console.log(`${scriptName}: Successfully added format: ZIP (shapefile)`);
    } else {
      console.error(`${scriptName}: Shapefile support (GeoSHPer) is not available.`);
    }

    console.log(`${scriptName}: Finished loading document format parsers.`);
    return { formats, formathelp };
  }

  /***********************************************************************************
   * addGroupToggler
   *
   * Description:
   * This function creates and adds a group toggler to a layer switcher UI component. It manages the visibility and interaction
   * of different layer groups within a map or similar UI, providing a toggling mechanism for user interface groups.
   *
   * Parameters:
   * @param {boolean} isDefault - A flag indicating whether the group is a default group.
   * @param {string} layerSwitcherGroupItemName - The unique name used as an identifier for the layer switcher group element.
   * @param {string} layerGroupVisibleName - The human-readable name for the layer group, shown in the UI.
   *
   * Returns:
   * @returns {HTMLElement} - The group element that has been created or modified.
   *
   * Behavior:
   * - If `isDefault` is true, it retrieves and operates on the existing group element related to the provided name.
   * - Otherwise, it dynamically creates a new group list item.
   * - Builds a toggler that includes a caret icon, a toggle switch, and a label displaying the group's visible name.
   * - Attaches event handlers to manage collapsible behavior of the group toggler and switches.
   * - Appends the configured group to the main UI component, either as an existing group or newly created one.
   * - Logs the creation of the group toggler to the console for debugging purposes.
   *****************************************************************************************/
  function addGroupToggler(isDefault, layerSwitcherGroupItemName, layerGroupVisibleName) {
    var group;
    if (isDefault === true) {
      group = document.getElementById(layerSwitcherGroupItemName).parentElement.parentElement;
    } else {
      var layerGroupsList = document.getElementsByClassName('list-unstyled togglers')[0];
      group = document.createElement('li');
      group.className = 'group';

      var togglerContainer = document.createElement('div');
      togglerContainer.className = 'layer-switcher-toggler-tree-category';

      var groupButton = document.createElement('wz-button');
      groupButton.color = 'clear-icon';
      groupButton.size = 'xs';

      var iCaretDown = document.createElement('i');
      iCaretDown.className = 'toggle-category w-icon w-icon-caret-down';
      iCaretDown.dataset.groupId = layerSwitcherGroupItemName.replace('layer-switcher-', '').toUpperCase();

      var togglerSwitch = document.createElement('wz-toggle-switch');
      togglerSwitch.className = layerSwitcherGroupItemName + ' hydrated';
      togglerSwitch.id = layerSwitcherGroupItemName;
      togglerSwitch.checked = true;

      var label = document.createElement('label');
      label.className = 'label-text';
      label.htmlFor = togglerSwitch.id;

      var togglerChildrenList = document.createElement('ul');
      togglerChildrenList.className = 'collapsible-' + layerSwitcherGroupItemName.replace('layer-switcher-', '').toUpperCase();
      label.appendChild(document.createTextNode(layerGroupVisibleName));
      groupButton.addEventListener('click', layerTogglerGroupMinimizerEventHandler(iCaretDown));
      togglerSwitch.addEventListener('click', layerTogglerGroupMinimizerEventHandler(iCaretDown));
      groupButton.appendChild(iCaretDown);
      togglerContainer.appendChild(groupButton);
      togglerContainer.appendChild(togglerSwitch);
      togglerContainer.appendChild(label);
      group.appendChild(togglerContainer);
      group.appendChild(togglerChildrenList);
      layerGroupsList.appendChild(group);
    }

    if (debug) console.log(`${scriptName}: Layer Group Toggler created for ${layerGroupVisibleName}`);
    return group;
  }

  /******************************************************************************
   * addLayerToggler
   *
   * Description:
   * This function adds a toggler for individual layers within a group in a layer switcher UI component. It manages the visibility
   * and interaction for specific map layers, allowing users to toggle them on and off within a UI group.
   *
   * Parameters:
   * @param {HTMLElement} groupToggler - The parent group toggler element under which the layer toggler is added.
   * @param {string} layerName - The name of the layer, used for display and creating unique identifiers.
   * @param {Object} layerObj - The layer object that is being toggled, typically representing a map or UI layer.
   *
   * Behavior:
   * - Locates the container (UL) within the group toggler where new layer togglers are to be appended.
   * - Creates a checkbox element for the layer, setting it to checked by default for visibility.
   * - Attaches events to both the individual layer checkbox and the group checkbox for toggling functionality.
   * - Appends the fully configured toggler to the UI.
   * - Logs the creation of the layer toggler for debugging purposes.
   *****************************************************************************/
  function addLayerToggler(groupToggler, layerName, layerId) {
    const layer_container = groupToggler.getElementsByTagName('UL')[0];
    const layerGroupCheckbox = groupToggler.getElementsByClassName('layer-switcher-toggler-tree-category')[0].getElementsByTagName('wz-toggle-switch')[0];
    const toggler = document.createElement('li');
    const togglerCheckbox = document.createElement('wz-checkbox');
    togglerCheckbox.setAttribute('checked', 'true');

    // Generate ID for togglerCheckbox using layerName
    const togglerId = 't_' + layerId;
    togglerCheckbox.id = togglerId;

    togglerCheckbox.className = 'hydrated';
    togglerCheckbox.appendChild(document.createTextNode(layerName));
    toggler.appendChild(togglerCheckbox);
    layer_container.appendChild(toggler);

    // Attach event handlers using layerId to manage visibility with SDK
    togglerCheckbox.addEventListener('change', layerTogglerEventHandler(layerId));
    layerGroupCheckbox.addEventListener('change', layerTogglerGroupEventHandler(togglerCheckbox, layerId));

    if (debug) console.log(`${scriptName}: Layer Toggler created for ${layerName}`);
  }

  function layerTogglerEventHandler(layerId) {
    return function () {
      const isVisible = this.checked;
      try {
        wmeSDK.Map.setLayerVisibility({
          layerName: layerId,
          visibility: isVisible,
        });
      } catch (error) {
        console.error(`Failed to set visibility for layer with ID ${layerId}:`, error);
      }
      if (debug) console.log(`${scriptName}: Layer visibility set to ${isVisible} for layer ${layerId}`);
    };
  }

  function layerTogglerGroupEventHandler(groupCheckbox, layerId) {
    return function () {
      const shouldBeVisible = this.checked && groupCheckbox.checked;
      try {
        wmeSDK.Map.setLayerVisibility({
          layerName: layerId,
          visibility: shouldBeVisible,
        });
      } catch (error) {
        console.error(`Failed to set group visibility for layer ${layerId}:`, error);
      }
      groupCheckbox.disabled = !this.checked;
      if (!groupCheckbox.checked) {
        groupCheckbox.disabled = false;
      }
      if (debug) console.log(`${scriptName}: WME GeoFile Group Layer visibility set to ${shouldBeVisible}`);
    };
  }

  function layerTogglerGroupMinimizerEventHandler(iCaretDown) {
    return function () {
      const ulCollapsible = iCaretDown.closest('li').querySelector('ul');
      iCaretDown.classList.toggle('upside-down');
      ulCollapsible.classList.toggle('collapse-layer-switcher-group');
    };
  }

  /****************************************************************************************
   * getArcGISdata
   *
   * Fetches geographic data from an ArcGIS service based on specified data types and options.
   * This function constructs a query URL to retrieve data from the specified ArcGIS endpoint,
   * obtaining either point or extent geometry based on the current view of the map within WME (Waze Map Editor).
   *
   * Parameters:
   * @param {string} [dataType="state"] - The type of geographic data to fetch, with possible values
   * such as "state", "county", "countysub", "zipcode". Each data type corresponds to a different endpoint.
   * @param {boolean} [returnGeo=true] - Indicates whether the function should include geometry in the response.
   * If true, the geometry is included; if false, the function queries the current extent for visible regions.
   *
   * Returns:
   * @returns {Promise<Object>} - A promise that resolves to a JSON object containing the requested geographic data.
   * The data is formatted as GeoJSON with added CRS (Coordinate Reference System) information.
   *
   * Workflow:
   * - Validates the dataType argument to ensure it matches a predefined configuration.
   * - Depending on returnGeo, sets the geometry parameter to either a center point or map extent.
   * - Constructs a query string for the ArcGIS REST API, including necessary spatial information.
   * - Initiates an HTTP GET request using GM_xmlhttpRequest, handling success and error responses.
   * - Parses the GeoJSON response and attaches CRS information.
   *
   * Errors:
   * - Throws an error for invalid dataType options.
   * - Rejects the promise if JSON parsing fails or the HTTP request encounters an error.
   ****************************************************************************************/
  function getArcGISdata(dataType = 'state', returnGeo = true) {
    // Define URLs and field names for each data type
    const CONFIG = {
      state: {
        url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0',
        outFields: 'BASENAME,NAME,STATE',
      },
      county: {
        url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1',
        outFields: 'BASENAME,NAME,STATE,COUNTY',
      },
      countysub: {
        url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1',
        outFields: 'BASENAME,NAME,STATE,COUNTY',
      },
      zipcode: {
        url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/1',
        outFields: 'BASENAME',
      },
      // Add more configurations as needed
    };

    // Check if the dataType is valid
    const config = CONFIG[dataType.toLowerCase()];
    if (!config) {
      throw new Error(`Invalid data type: ${dataType}`);
    }

    let geometry;
    let geometryType;

    if (returnGeo) {
      // Obtain the center of the map in WGS84 format and Create a geometry object for it
      const wgs84Center = wmeSDK.Map.getMapCenter(); // Get the current center coordinates of the WME map
      geometry = {
        x: wgs84Center.lon,
        y: wgs84Center.lat,
        spatialReference: { wkid: 4326 },
      };
      geometryType = 'esriGeometryPoint';
    } else {
      // Get current map extent and visible regions
      const wgs84Extent = wmeSDK.Map.getMapExtent();
      geometry = {
        xmin: wgs84Extent[0],
        ymin: wgs84Extent[1],
        xmax: wgs84Extent[2],
        ymax: wgs84Extent[3],
        spatialReference: { wkid: 4326 },
      };
      geometryType = 'esriGeometryEnvelope';
    }

    const url = `${config.url}/query?geometry=${encodeURIComponent(JSON.stringify(geometry))}`;
    const queryString =
      `${url}&outFields=${encodeURIComponent(config.outFields)}&returnGeometry=${returnGeo}&spatialRel=esriSpatialRelIntersects` +
      `&geometryType=${geometryType}&inSR=${geometry.spatialReference.wkid}&outSR=${geometry.spatialReference.wkid}&f=GeoJSON`;

    if (debug) console.log(`${scriptName}: getArcGISdata(${dataType})`, queryString);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: queryString,
        method: 'GET',
        onload: function (response) {
          try {
            const jsonResponse = JSON.parse(response.responseText);
            // Add CRS information to the GeoJSON response
            jsonResponse.crs = {
              type: 'name',
              properties: {
                name: 'EPSG:4326',
              },
            };
            resolve(jsonResponse); // Resolve the promise with the JSON response
          } catch (error) {
            reject(new Error('Failed to parse JSON response: ' + error.message));
          }
        },
        onerror: function (error) {
          reject(new Error('Request failed: ' + error.statusText));
        },
      });
    });
  }
})();
