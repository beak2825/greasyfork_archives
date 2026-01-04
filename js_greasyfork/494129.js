// ==UserScript==
// @name         Pano Downloader
// @namespace    https://greasyfork.org/users/1179204
// @version      1.4.8
// @description  download panoramas from google
// @author       KaKa
// @match        https://map-making.app/maps/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// @icon         https://www.svgrepo.com/show/502638/download-photo.svg
// @downloadURL https://update.greasyfork.org/scripts/494129/Pano%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/494129/Pano%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let zoomLevel
    const OPENMAP_TILE_HOST1="https://storage.nambox.com/"
    const OPENMAP_TILE_HOST2="https://hn.storage.weodata.vn/"
    const KAKAO_TILE_URL = "https://map0.daumcdn.net/map_roadview";
    const tileImagePathCache = /* @__PURE__ */ new Map();

    function getSelection() {
        const activeSelections = unsafeWindow.editor.selections

        return activeSelections.flatMap(selection => selection.locations)
    }

    function stripPanoId(pano,prefix) {
        return pano.replace(prefix, "");
    }

    const HOST_CACHE={}
    async function checkHostUrl(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                timeout: 3000
            });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    async function getOpenmapThumbUrl(panoId) {
        if(HOST_CACHE[panoId])return HOST_CACHE[panoId]
        const paramUrl = `streetview-cdn/derivates/${panoId.slice(0, 2)}/${panoId.slice(2, 4)}/${panoId.slice(4, 6)}/${panoId.slice(6, 8)}/${panoId.slice(9)}/sd.jpg`;
        const urlTemplate = await checkHostUrl(`${OPENMAP_TILE_HOST1}${paramUrl}`) ? `${OPENMAP_TILE_HOST1}${paramUrl}` : `${OPENMAP_TILE_HOST2}${paramUrl}`;
        const url = new URL(urlTemplate);
        HOST_CACHE[panoId]=url.href
        return url.href;
    }
    async function getOpenmapTileUrl(panoId, x, y) {
        if(HOST_CACHE[panoId])return HOST_CACHE[panoId]
        const paramUrl = `streetview-cdn/derivates/${panoId.slice(0, 2)}/${panoId.slice(2, 4)}/${panoId.slice(4, 6)}/${panoId.slice(6, 8)}/${panoId.slice(9)}/tiles/${x}_${y}.jpg`;
        const urlTemplate = await checkHostUrl(`${OPENMAP_TILE_HOST1}${paramUrl}`) ? `${OPENMAP_TILE_HOST1}${paramUrl}` : `${OPENMAP_TILE_HOST2}${paramUrl}`;
        const url = new URL(urlTemplate);
        HOST_CACHE[panoId]=url.href
        return url.href;
    }

    async function get_yandex_pano(id) {
        try {

            const response = await fetch(`https://api-maps.yandex.com/services/panoramas/1.x?l=stv&lang=en_US&origin=userAction&provider=streetview&oid=${stripPanoId(id,"YANDEX:")}`);

            if (!response.ok) {
                console.error(`Error fetching imageKey: HTTP ${response.status}`);
                return null;
            }

            const data = await response.json();
            if (data) {
                return {imageId:data.data.Data.Images.imageId,
                        width:data.data.Data.Images.Zooms.length===4 ?data.data.Data.Images.Zooms[0].width:data.data.Data.Images.Zooms[1].width,
                        height:data.data.Data.Images.Zooms.length===4 ?data.data.Data.Images.Zooms[0].height:data.data.Data.Images.Zooms[1].height,
                        zoomLevels:data.data.Data.Images.Zooms.length};
            } else {
                console.error('Error fetching imageKey: Data format invalid.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching imageKey:', error.message);
            return null;
        }
    }
    async function get_kakao_pano(id) {
        try {

            const response = await fetch(`https://rv.map.kakao.com/roadview-search/v2/node/${id}?SERVICE=glpano`);

            if (!response.ok) {
                console.error(`Error fetching imageKey: HTTP ${response.status}`);
                return null;
            }

            const data = await response.json();
            if (data) {
                const kakao = data.street_view.street;
                return kakao.img_path
            } else {
                console.error('Error fetching imageKey: Data format invalid.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching imageKey:', error.message);
            return null;
        }
    }
    const GOOGLE_TO_KAKAO_ZOOM = [0, 0, 1, 1, 2];
    const KAKAO_HORZ_TILES = [1, 8, 16];
    function getTileIndex(zoom, x, y) {
        const w = KAKAO_HORZ_TILES[zoom];
        return (y + 1) * w + (x - w) + 1;
    }
    function getTileImageName(imagePath) {
        const i = imagePath.lastIndexOf("/");
        return imagePath.slice(i + 1);
    }
    function buildTileUrl(imagePath, zoom, x, y) {
        zoom = GOOGLE_TO_KAKAO_ZOOM[zoom];
        const tileIndex = getTileIndex(zoom, x, y).toString().padStart(zoom + 1, "0");
        if (zoom === 1) {
            return `${KAKAO_TILE_URL}${imagePath}/${getTileImageName(imagePath)}_${tileIndex}.jpg`;
        }
        if (zoom === 2) {
            return `${KAKAO_TILE_URL}${imagePath}_HD1/${getTileImageName(imagePath)}_HD1_${tileIndex}.jpg`;
        }
        return `${KAKAO_TILE_URL}${imagePath}.jpg`;
    }

    async function getTileUrlAsync(pano, zoom, x, y) {
        if(tileImagePathCache.get(stripPanoId(pano,"KAKAO")))return buildTileUrl(tileImagePathCache.get(stripPanoId(pano,"KAKAO")),zoom,x,y)
        const img_path = await get_kakao_pano(pano)
        if (!img_path) {
            throw new Error(`Could not find Kakao image path for pano "${pano}"`);
        }
        tileImagePathCache.set(stripPanoId(pano,"KAKAO"), img_path);
        return buildTileUrl(img_path, zoom, x, y);
    }

    async function runScript() {

        const { value: option,dismiss: inputDismiss } = await Swal.fire({
            title: 'Select Panoramas',
            text: 'Do you want to input the panoId from your selections on map-making? If you click "Cancel", you will need to upload a JSON file.',
            icon: 'question',
            showCancelButton: true,
            showCloseButton:true,
            allowOutsideClick: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        });


        if (option) {

            const selectedLocs=getSelection()
            if(selectedLocs.length>0) {
                const { value: options, dismiss: inputDismiss } = await Swal.fire({
                    title: 'Download Options',
                    html:
                    '<select id="zoom-select" class="swal2-input" style="width:180px; height:40px; margin:5px; font-size:16px;white-space:prewrap">' +
                    '<option value="1">1 (100KB~500KB)</option>' +
                    '<option value="2">2 (500KB~1MB)</option>' +
                    '<option value="3">3 (1MB~4MB)</option>' +
                    '<option value="4">4 (4MB~8MB)</option>' +
                    '<option value="5">5 (8MB~24MB)</option>' +
                    '</select>'+
                    '<select id="img-select" class="swal2-input" style="width:180px; height:40px; margin:5px; font-size:16px;white-space:prewrap">' +
                    '<option value="1">Equirectangular</option>' +
                    '<option value="2">Perspective</option>' +
                    '<option value="3">Thumbnail</option>' +
                    '</select>',
                    icon: 'question',
                    showCancelButton: true,
                    showCloseButton: true,
                    allowOutsideClick: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel',
                    preConfirm: () => {
                        return [document.getElementById('zoom-select').value,document.getElementById('img-select').value];
                    }
                });
                if (options){
                    zoomLevel=parseInt(options[0])
                    processData(selectedLocs,parseInt(options[1]))
                }}
        }

        else if(inputDismiss==='cancel'){

            const input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none'
            document.body.appendChild(input);

            const data = await new Promise((resolve) => {
                input.addEventListener('change', async () => {
                    const file = input.files[0];
                    const reader = new FileReader();

                    reader.onload = (event) => {
                        try {
                            const result = JSON.parse(event.target.result);
                            resolve(result);

                            document.body.removeChild(input);
                        } catch (error) {
                            Swal.fire('Error Parsing JSON Data!', 'The input JSON data is invalid or incorrectly formatted.','error');
                        }
                    };

                    reader.readAsText(file);
                });


                input.click();
            });
        }
        function generatePerspective(canvas, FOV, THETA, PHI, outputWidth, outputHeight) {
            const perspectiveCanvas = document.createElement('canvas');
            perspectiveCanvas.width = outputWidth;
            perspectiveCanvas.height = outputHeight;
            const perspectiveCtx = perspectiveCanvas.getContext('2d');

            const f = 0.5 * outputWidth / Math.tan((FOV / 2) * (Math.PI / 180));
            const cx = outputWidth / 2;
            const cy = outputHeight / 2;

            var inputWidth = canvas.width;
            var inputHeight = canvas.height;
            const inputCtx = canvas.getContext('2d');
            const inputImageData = inputCtx.getImageData(0, 0, inputWidth, inputHeight);

            const outputImageData = perspectiveCtx.createImageData(outputWidth, outputHeight);
            const outputData = outputImageData.data;

            const R1 = rotationMatrix([0, 1, 0], THETA);
            const rotatedXAxis = applyRotation(R1, [1, 0, 0]);
            const R2 = rotationMatrix(rotatedXAxis, PHI);
            const R = multiplyMatrices(R2, R1);

            for (let y = 0; y < outputHeight; y++) {
                for (let x = 0; x < outputWidth; x++) {
                    const nx = (x - cx) / f;
                    const ny = (y - cy) / f;
                    const nz = 1;

                    const [rx, ry, rz] = applyRotation(R, [nx, ny, nz]);

                    const lon = Math.atan2(rx, rz);
                    const lat = Math.asin(ry / Math.sqrt(rx * rx + ry * ry + rz * rz));

                    const u = Math.floor(((lon / (2 * Math.PI)) + 0.5) * inputWidth);
                    const v = Math.floor(((lat / Math.PI) + 0.5) * inputHeight);

                    if (u >= 0 && u < inputWidth && v >= 0 && v < inputHeight) {
                        const srcOffset = (v * inputWidth + u) * 4;
                        const destOffset = (y * outputWidth + x) * 4;

                        outputData[destOffset] = inputImageData.data[srcOffset];       // Red
                        outputData[destOffset + 1] = inputImageData.data[srcOffset + 1]; // Green
                        outputData[destOffset + 2] = inputImageData.data[srcOffset + 2]; // Blue
                        outputData[destOffset + 3] = 255;                             // Alpha
                    }
                }
            }

            perspectiveCtx.putImageData(outputImageData, 0, 0);
            return perspectiveCanvas;
        }

        function rotationMatrix(axis, angle) {
            const rad = angle * (Math.PI / 180);
            const c = Math.cos(rad);
            const s = Math.sin(rad);
            const t = 1 - c;
            const [x, y, z] = axis;

            return [
                [t*x*x + c,   t*x*y - s*z, t*x*z + s*y],
                [t*x*y + s*z, t*y*y + c,   t*y*z - s*x],
                [t*x*z - s*y, t*y*z + s*x, t*z*z + c]
            ];
        }

        function applyRotation(matrix, vector) {
            return [
                matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
                matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
                matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2]
            ];
        }

        function multiplyMatrices(A, B) {
            const result = Array(3).fill(null).map(() => Array(3).fill(0));
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    for (let k = 0; k < 3; k++) {
                        result[i][j] += A[i][k] * B[k][j];
                    }
                }
            }
            return result;
        }
        async function downloadPanoramaImage(panoId, fileName,w,h,th,ch,tp,mode) {
            return new Promise(async (resolve, reject) => {
                try {
                    let canvas, ctx, tilesPerRow, tilesPerColumn, tileUrl, imageUrl, imageKey, zoomLevels;
                    var [tileWidth ,tileHeight]= [512, 512];

                    if (panoId.includes('BAIDU')||panoId.includes('TENCENT')) {
                        tilesPerRow = 16;
                        tilesPerColumn = 8;
                    }
                    else if(panoId.includes('KAKAO:')){
                        if(zoomLevel ==5) {
                            tilesPerRow = 16;
                            tilesPerColumn = 8;
                        }
                        else if (zoomLevel>=3){
                            zoomLevel=4
                            tilesPerRow = 8;
                            tilesPerColumn = 4;
                        }
                        else{
                            zoomLevel=3
                            tilesPerRow = 8;
                            tilesPerColumn = 4;
                        }
                    }

                    else if (panoId.includes('OPENMAP')){
                        tilesPerRow = 8;
                        tilesPerColumn = 4;
                        tileWidth=720
                        tileHeight=720
                    }
                    else if (panoId.includes('YANDEX')){
                        const metadata=await get_yandex_pano(panoId)
                        imageKey=metadata.imageId
                        /*if (metadata.width<=7000){
                            tilesPerRow=22
                            tilesPerColumn = 8;
                        }
                        else if(metadata.width<=9000) {
                            tilesPerRow=28
                            tilesPerColumn = 14;
                        }
                        else{
                            tilesPerRow=28
                            tilesPerColumn = 10;
                        }*/
                        tileWidth=256
                        tileHeight=256
                        zoomLevels=metadata.zoomLevels
                        tilesPerRow=Math.ceil(metadata.width / tileWidth)
                        tilesPerColumn = Math.ceil(metadata.height / tileHeight);
                    }
                    else {
                        let zoomTiles;

                        imageUrl = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${panoId}&output=tile&zoom=${zoomLevel}&nbt=0&fover=2`;
                        zoomTiles = [2, 4, 8, 16, 32];
                        tilesPerRow = Math.min(Math.ceil(w / tileWidth), zoomTiles[zoomLevel - 1]);
                        tilesPerColumn = Math.min(Math.ceil(h / tileHeight), zoomTiles[zoomLevel - 1] / 2);

                    }

                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');

                    canvas.width = tilesPerRow * tileWidth;
                    canvas.height = tilesPerColumn * tileHeight;
                    if (w === 13312) {
                        const sizeMap = {
                            4: [6656, 3328],
                            3: [3328, 1664],
                            2: [1664, 832],
                            1: [832, 416]
                        };
                        if (sizeMap[zoomLevel]) {
                            [canvas.width, canvas.height] = sizeMap[zoomLevel];
                        }
                    }
                    if (panoId.includes('YANDEX')&&mode==2){
                        canvas.height=3584
                    }
                    const loadTile = (x, y) => {
                        return new Promise(async (resolveTile) => {
                            let tile;
                            if (panoId.includes('TENCENT'))tileUrl = `https://sv4.map.qq.com/tile?svid=${stripPanoId(panoId,"TENCENT:")}&x=${x}&y=${y}&from=web&level=1`;

                            else if (panoId.includes('BAIDU'))tileUrl = `https://mapsv0.bdimg.com/?qt=pdata&sid=${stripPanoId(panoId,"BAIDU")}&pos=${y}_${x}&z=5`;

                            else if (panoId.includes('YANDEX'))tileUrl = `https://pano.maps.yandex.net/${imageKey}/${zoomLevels==4?0:1}.${x}.${y}`;

                            else if (panoId.includes('OPENMAP'))tileUrl =await getOpenmapTileUrl(stripPanoId(panoId,"OEPNMAP"),x,y)

                            else if (panoId.includes('KAKAO:')) tileUrl= await getTileUrlAsync(stripPanoId(panoId,"KAKAO:"),zoomLevel-1,x,y)

                            else tileUrl = `${imageUrl}&x=${x}&y=${y}`;

                            try {
                                tile = await loadImage(tileUrl);
                                ctx.drawImage(tile, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                                resolveTile();
                            } catch (error) {
                                console.error(`Error loading tile at ${x},${y}:`, error);
                                resolveTile();
                            }
                        });
                    };
                    let tilePromises = [];
                    for (let y = 0; y < tilesPerColumn; y++) {
                        for (let x = 0; x < tilesPerRow; x++) {
                            tilePromises.push(loadTile(x, y));
                        }
                    }

                    await Promise.all(tilePromises);

                    if(mode!=1){
                        var targetTheta
                        if(th||th==0) targetTheta=(th-ch)
                        else targetTheta=0
                        const perspectiveCanvas = generatePerspective(canvas, 125,targetTheta,tp,1920, 1080)
                        perspectiveCanvas.toBlob(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = fileName+'.png';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                            resolve();
                        }, 'image/png');}
                    else{
                        canvas.toBlob(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = fileName+'.jpg';
                            document.body.appendChild(a);
                            a.click(); document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                            resolve();
                        }, 'image/jpeg');
                    }
                } catch (error) {
                    Swal.fire('Error!', error.toString(),'error');
                    reject(error);
                }
            });
        }
        async function downloadPanoThumbnail(panoId, fileName, h,p) {
            var url = `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=${panoId}&cb_client=maps_sv.tactile.gps&yaw=${h}&pitch=${p}&thumbfov=120&width=1024&height=512`;
            if(panoId.includes('BAIDU')) url=`https://mapsv0.bdimg.com/?qt=pr3d&fovy=125&quality=100&panoid=${stripPanoId(panoId,"BAIDU:")}&heading=${h}&pitch=${p}&width=1024&height=768`
            else if (panoId.includes('OPENMAP')) url= await getOpenmapThumbUrl(stripPanoId(panoId,"OPENMAP:"))
            else if (panoId.includes('TENCENT')) url=`https://sv0.map.qq.com/thumb?from=web&level=2&svid=${stripPanoId(panoId,"TENCENT:")}`
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

                const blob = await response.blob();
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `${fileName}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                console.log(`Failed to download: ${fileName}.png`);
            } catch (error) {
                console.error(`Failed to download (${fileName}):`, error);
            }
        }
        async function loadImage(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
                img.src = url;
            });
        }

        var CHUNK_SIZE = Math.round(20/zoomLevel);

        var promises = [];

        async function processChunk(chunk,mode) {
            var service = new google.maps.StreetViewService();
            var promises = chunk.map(async coord => {
                let panoId = coord.panoId;
                const th=coord.heading
                const tp=coord.pitch
                let latLng = {lat: coord.location.lat, lng: coord.location.lng};
                let svData;

                if ((panoId || latLng)) {
                    svData = await getSVData(service, panoId ? {pano: panoId} : {location: latLng, radius: 5});
                }

                if (svData.tiles&&svData.tiles.worldSize) {
                    const w=svData.tiles.worldSize.width
                    const h=svData.tiles.worldSize.height
                    const ch=svData.tiles.centerHeading
                    const fileName = panoId;
                    if(mode==3) await downloadPanoThumbnail(panoId,fileName,th,tp)
                    else await downloadPanoramaImage(panoId, fileName,w,h,th,ch,tp,mode);
                }

            });

            await Promise.all(promises);
        }

        function getSVData(service, options) {
            return new Promise(resolve => service.getPanorama({...options}, (data, status) => {
                resolve(data);
            }));
        }

        async function processData(panos,mode) {
            try {
                let processedChunks = 0;
                const swal = Swal.fire({
                    title: 'Downloading',
                    text: 'Please wait...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                for (let i = 0; i < panos.length; i += 5) {
                    let chunk = panos.slice(i, i + 5);
                    await processChunk(chunk,mode);
                    processedChunks++;
                    const progress = Math.min((processedChunks /panos.length) * 100, 100);
                    Swal.update({
                        html: `<div>${progress.toFixed(2)}% completed</div>
                       <div class="swal2-progress">
                           <div class="swal2-progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" style="width: ${progress}%;">
                           </div>
                       </div>`
                    });
                }
                swal.close();
                Swal.fire('Success!','Download completed', 'success');
            } catch (error) {
                swal.close();
                Swal.fire('Error!',"Failed to download due to:"+error.toString(),'error');
            }
        }
    }

    var downloadButton=document.createElement('button');
    downloadButton.textContent='Download Panos'
    downloadButton.addEventListener('click', runScript);
    downloadButton.style.width='160px'
    downloadButton.style.position = 'fixed';
    downloadButton.style.right = '150px';
    downloadButton.style.bottom = '15px';
    downloadButton.style.borderRadius = "18px";
    downloadButton.style.padding = "5px 10px";
    downloadButton.style.border = "none";
    downloadButton.style.color = "white";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.backgroundColor = "#4CAF50";
    document.body.appendChild(downloadButton);

})();