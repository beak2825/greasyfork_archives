/*
 * Dependencies:
 *
 * GM_info(optional)
 * Docs: https://violentmonkey.github.io/api/gm/#gm_info
 * 
 * GM_xmlhttpRequest(optional)
 * Docs: https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
 *
 * JSZIP
 * Github: https://github.com/Stuk/jszip
 * CDN: https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
 *
 * FileSaver
 * Github: https://github.com/eligrey/FileSaver.js
 * CDN: https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
 */

;const ImageDownloader = (({ JSZip, saveAs }) => {
  let maxNum = 0;
  let promiseCount = 0;
  let fulfillCount = 0;
  let isErrorOccurred = false;

  // elements
  let startNumInputElement = null;
  let endNumInputElement = null;
  let downloadButtonElement = null;
  let panelElement = null;

  // svg icons
  const externalLinkSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentcolor" width="16" height="16"><path fill-rule="evenodd" d="M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z"></path></svg>`;
  const reloadSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentcolor" width="16" height="16"><path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.501 5.501 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.501 5.501 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834z"></path></svg>`;

  // initialization
  function init({
    maxImageAmount,
    getImagePromises,
    title = `paquete_${Date.now()}`,
    imageSuffix = 'webp',
    zipOptions = {},
    positionOptions = {}
  }) {
    // assign value
    maxNum = maxImageAmount;

    // setup UI
    setupUI(positionOptions);

    // add click event listener to download button
    downloadButtonElement.onclick = function () {
      if (!isOKToDownload()) return;

      this.disabled = true;
      this.textContent = "Procesando";
      this.style.backgroundColor = '#aaa';
      this.style.cursor = 'not-allowed';
      download(getImagePromises, title, imageSuffix, zipOptions);
    }
  }

  // setup UI
  function setupUI(positionOptions) {
    // common input element style
    const inputElementStyle = `
      box-sizing: content-box;
      padding: 1px 2px;
      width: 40%;
      height: 26px;

      border: 1px solid #aaa;
      border-radius: 4px;

      font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
      text-align: center;
    `;

    // create start number input element
    startNumInputElement = document.createElement('input');
    startNumInputElement.id = 'ImageDownloader-StartNumInput';
    startNumInputElement.style = inputElementStyle;
    startNumInputElement.type = 'text';
    startNumInputElement.value = 1;

    // create end number input element
    endNumInputElement = document.createElement('input');
    endNumInputElement.id = 'ImageDownloader-EndNumInput';
    endNumInputElement.style = inputElementStyle;
    endNumInputElement.type = 'text';
    endNumInputElement.value = maxNum;

    // prevent keyboard input from being blocked
    startNumInputElement.onkeydown = (e) => e.stopPropagation();
    endNumInputElement.onkeydown = (e) => e.stopPropagation();

    // create 'to' span element
    const toSpanElement = document.createElement('span');
    toSpanElement.id = 'ImageDownloader-ToSpan';
    toSpanElement.textContent = 'a';
    toSpanElement.style = `
      margin: 0 6px;
      color: black;
      line-height: 1;
      word-break: keep-all;
      user-select: none;
    `;

    // create download button element
    downloadButtonElement = document.createElement('button');
    downloadButtonElement.id = 'ImageDownloader-DownloadButton';
    downloadButtonElement.textContent = 'Descargar';
    downloadButtonElement.style = `
      margin-top: 8px;
      width: 128px;
      height: 48px;

      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 14px;
      font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
      color: #fff;
      line-height: 1.2;

      background-color: #0984e3;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    // create range input container element
    const rangeInputContainerElement = document.createElement('div');
    rangeInputContainerElement.id = 'ImageDownloader-RangeInputContainer';
    rangeInputContainerElement.style = `
      display: flex;
      justify-content: center;
      align-items: baseline;
    `;

    // create panel element
    panelElement = document.createElement('div');
    panelElement.id = 'ImageDownloader-Panel';
    panelElement.style = `
      position: fixed;
      top: 72px;
      left: 72px;
      z-index: 999999999;

      box-sizing: border-box;
      padding: 8px;
      width: 146px;
      height: 106px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: baseline;

      font-size: 14px;
      font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
      letter-spacing: normal;

      background-color: #f1f1f1;
      border: 1px solid #aaa;
      border-radius: 4px;
    `;

    // modify panel position according to 'positionOptions'
    for (const [key, value] of Object.entries(positionOptions)) {
      if (key === 'top' || key === 'bottom' || key === 'left' || key === 'right') {
        panelElement.style[key] = value;
      }
    }

    // assemble and then insert into document
    rangeInputContainerElement.appendChild(startNumInputElement);
    rangeInputContainerElement.appendChild(toSpanElement);
    rangeInputContainerElement.appendChild(endNumInputElement);
    panelElement.appendChild(rangeInputContainerElement);
    panelElement.appendChild(downloadButtonElement);
    document.body.appendChild(panelElement);
  }

  // check validity of page nums from input
  function isOKToDownload() {
    const startNum = Number(startNumInputElement.value);
    const endNum = Number(endNumInputElement.value);

    if (Number.isNaN(startNum) || Number.isNaN(endNum)) { alert("请正确输入数值\nIntroduzca el número de página correctamente."); return false; }
    if (!Number.isInteger(startNum) || !Number.isInteger(endNum)) { alert("请正确输入数值\nIntroduzca el número de página correctamente."); return false; }
    if (startNum < 1 || endNum < 1) { alert("页码的值不能小于1\nEl número de página no debe ser inferior a 1."); return false; }
    if (startNum > maxNum || endNum > maxNum) { alert(`页码的值不能大于${maxNum}\nEl número de página no debe ser superior a ${maxNum}.`); return false; }
    if (startNum > endNum) { alert("起始页码的值不能大于终止页码的值\nEl número de inicio no debe ser mayor que el número de final."); return false; }

    return true;
  }

  // start downloading
  async function download(getImagePromises, title, imageSuffix, zipOptions) {
    const startNum = Number(startNumInputElement.value);
    const endNum = Number(endNumInputElement.value);
    promiseCount = endNum - startNum + 1;

    // start downloading images, max amount of concurrent requests is limited to 4
    let images = [];
    for (let num = startNum; num <= endNum; num += 4) {
      const from = num;
      const to = Math.min(num + 3, endNum);
      try {
        const result = await Promise.all(getImagePromises(from, to));
        images = images.concat(result);
      } catch (error) {
        return; // cancel downloading
      }
    }

    // configure file structure of zip archive
    JSZip.defaults.date = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000);
    const zip = new JSZip();
    const zipTitle = title // remove some characters
    .replaceAll(/\/|\\|\:|\*|\?|\"|\<|\>|\|/g, '')
    .replaceAll(/\-\s|\-\-+/g, '')
    .replaceAll(/ZonaTMO/g, '')
    .replaceAll(/\s+/g, '_')
    .replace(/_+$/g, '')
    .replace(/^_+/g, '');
    const folder = zip.folder(zipTitle);
    for (const [index, image] of images.entries()) {
      const filename = `${String(index + 1).padStart(images.length >= 100 ? String(images.length).length : 2, '0')}.${imageSuffix}`;
      folder.file(filename, image, zipOptions);
    }

    // start zipping & show progress
    const zipProgressHandler = (metadata) => { downloadButtonElement.innerHTML = `Empaquetando<br>(${metadata.percent.toFixed()}%)`; }
    const content = await zip.generateAsync({ type: "blob" }, zipProgressHandler);

    // open 'Save As' window to save
    saveAs(content, `${zipTitle}.zip`);

    // all completed
    downloadButtonElement.textContent = "Completado";
  }

  // handle promise fulfilled
  function fulfillHandler(res) {
    if (!isErrorOccurred) {
      fulfillCount++;
      downloadButtonElement.innerHTML = `Procesando<br>(${fulfillCount}/${promiseCount})`;
    }

    return res;
  }

  // handle promise rejected
  function rejectHandler(err) {
    isErrorOccurred = true;
    console.error(err);

    downloadButtonElement.textContent = 'Se ha producido un error.';
    downloadButtonElement.style.backgroundColor = 'red';

    return Promise.reject(err);
  }

  return { init, fulfillHandler, rejectHandler };
})(window);
