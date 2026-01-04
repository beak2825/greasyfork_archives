// ==UserScript==
// @name         图寻复盘工具 PRO
// @namespace    https://greasyfork.org/users/1179204
// @version      2.0.5
// @description  增加复盘小地图，全面提升复盘效果
// @match        *://tuxun.fun/replay-pano?gameId=*&round=*
// @icon         data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iIzAwMDAwMCI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiPjwvZz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+PHRpdGxlPjcwIEJhc2ljIGljb25zIGJ5IFhpY29ucy5jbzwvdGl0bGU+PHBhdGggZD0iTTI0LDEuMzJjLTkuOTIsMC0xOCw3LjgtMTgsMTcuMzhBMTYuODMsMTYuODMsMCwwLDAsOS41NywyOS4wOWwxMi44NCwxNi44YTIsMiwwLDAsMCwzLjE4LDBsMTIuODQtMTYuOEExNi44NCwxNi44NCwwLDAsMCw0MiwxOC43QzQyLDkuMTIsMzMuOTIsMS4zMiwyNCwxLjMyWiIgZmlsbD0iI2ZmOTQyNyI+PC9wYXRoPjxwYXRoIGQ9Ik0yNS4zNywxMi4xM2E3LDcsMCwxLDAsNS41LDUuNUE3LDcsMCwwLDAsMjUuMzcsMTIuMTNaIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9nPjwvc3ZnPg==
// @author       KaKa
// @license      BSD
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
// @require      https://unpkg.com/gcoord/dist/gcoord.global.prod.js
// @require      https://unpkg.com/leaflet.heat/dist/leaflet-heat.js
// @require      https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.min.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js
// @require      https://unpkg.com/protomaps-leaflet@5.1.0/dist/protomaps-leaflet.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.1.0/dist/chartjs-plugin-annotation.min.js
// @downloadURL https://update.greasyfork.org/scripts/500325/%E5%9B%BE%E5%AF%BB%E5%A4%8D%E7%9B%98%E5%B7%A5%E5%85%B7%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/500325/%E5%9B%BE%E5%AF%BB%E5%A4%8D%E7%9B%98%E5%B7%A5%E5%85%B7%20PRO.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`

    @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

    #panels {
        position: fixed;
        top: 100px;
        left: 10px;
        padding: 10px;
        border-radius: 20px !important;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        width: 180px;
    }

    #panels button {
        cursor: pointer;
        width: 100% !important;
        font-weight: bold !important;
        border: 8px solid #000000 !important;
        text-align: left !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
        backdrop-filter: blur(10px);
        margin-bottom: 5px;
        border-radius: 4px;
        background-color: #000000 !important;
        color: #A0A0A0 !important;
    }

    #timeline {
        cursor: pointer;
        width: 100%;
        font-weight: bold;
        font-size:14px;
        border: 8px solid #000000;
        text-align: left;
        padding-left: 4px;
        padding-right: 2px;
        backdrop-filter: blur(10px);
        margin-bottom: 5px;
        border-radius: 4px;
        background-color: #000000;
        color: #A0A0A0;
    }

    #replay {
        cursor: pointer;
        width: 100%;
        font-weight: bold;
        font-size:16px;
        border: 8px solid #000000;
        text-align: left;
        padding-left: 4px;
        padding-right: 2px;
        backdrop-filter: blur(10px);
        margin-bottom: 5px;
        border-radius: 4px;
        background-color: #000000;
        color: #A0A0A0;
    }

    .leaflet-opacity-control {
      background-color: #fff;
      width: 100px;
      height: 28px;
      box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
      border-radius: 5px;
    }

    .custom-marker {
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    }

    .leaflet-tooltip {
       background: rgba(255, 255, 255, 0.8);
       border: 0.5px solid #ccc;
       border-radius: 4px;
       font-size: 13px;
       color: black;
       font-weight: bold;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 1s linear;
    }

     @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;}
        }
`);

    L.Control.OpacityControl = L.Control.extend({
        options: {
            position: 'topright'
        },

        initialize: function (layer, options) {
            this.layer = layer;
            L.setOptions(this, options);
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-opacity-control');
            this.container=container
            container.innerHTML = `
                <input type="range" id="opacity-slider" min="0" max="100" value="100" step="10" style="margin:5px; width:90px">
            `;
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);
            L.DomEvent.on(container.querySelector('#opacity-slider'), 'input', function (e) {
                var opacity = e.target.value / 100;
                this._currentOpacity = opacity;
                this.layer.setOpacity(opacity)
            }.bind(this));

            return container;
        },
        setOpacity: function(value){
            if(this.container) this.container.style.opacity=`${value}`
        }
    });

    L.control.opacityControl = function(opts) {
        return new L.Control.OpacityControl(opts);
    };

    const TILE_SIZE = 256;

    const BAIDU_TILE_CACHE = {};

    function deg(n) { return n * 180 / Math.PI; }
    function proj(n, t) {
        if (!BAIDU_TILE_CACHE[t]) BAIDU_TILE_CACHE[t] = {};
        if (!Array.isArray(BAIDU_TILE_CACHE[t][n])) BAIDU_TILE_CACHE[t][n] = computeProj(n, t);
        return BAIDU_TILE_CACHE[t][n];
    }
    function computeProj(n, t) {
        const r = t * Math.pow(2, n);
        return [r / 360, r / (2 * Math.PI), r / 2, r];
    }
    function inverseWebMercator([x, y], z, r = 512) {
        const [scaleX, scaleY, c] = proj(z, r);
        const a = (y - c) / -scaleY;
        const p = (x - c) / scaleX;
        const A = deg(2 * Math.atan(Math.exp(a)) - Math.PI / 2);
        return [p, A];
    }

    function isInChina(lon, lat) {
        return lon >= 72.004 && lon <= 137.8347 && lat >= 0.8293 && lat <= 55.8271;
    }

    function googleToBaidu([lng, lat]) {
        return gcoord.transform([lng, lat], gcoord.GCJ02, gcoord.BD09MC);
    }

    function baiduToTile([x, y], zoom) {
        const dpi = 2 ** (18 - zoom);
        return [x / dpi / TILE_SIZE, y / dpi / TILE_SIZE];
    }

    async function renderTile(bbox, zoom, signal) {
        const topLeftBaidu = googleToBaidu([bbox[0], bbox[3]]);
        const bottomRightBaidu = googleToBaidu([bbox[2], bbox[1]]);
        const topLeftTile = baiduToTile(topLeftBaidu, zoom);
        const bottomRightTile = baiduToTile(bottomRightBaidu, zoom);

        const topLeftOffset = [
            (topLeftTile[0] - Math.floor(topLeftTile[0])) * TILE_SIZE,
            (1 - (topLeftTile[1] - Math.floor(topLeftTile[1]))) * TILE_SIZE
        ];
        const horzTileOffset = Math.floor(bottomRightTile[0]) - Math.floor(topLeftTile[0]);
        const vertTileOffset = Math.floor(topLeftTile[1]) - Math.floor(bottomRightTile[1]);
        const bottomRightOffset = [
            (horzTileOffset + bottomRightTile[0] - Math.floor(bottomRightTile[0])) * TILE_SIZE,
            (vertTileOffset + 1 - (bottomRightTile[1] - Math.floor(bottomRightTile[1]))) * TILE_SIZE
        ];

        const helper = new OffscreenCanvas(
            TILE_SIZE * (horzTileOffset + 1),
            TILE_SIZE * (vertTileOffset + 1)
        );
        const helpCtx = helper.getContext("2d");

        for (let x = Math.floor(topLeftTile[0]); x <= Math.floor(bottomRightTile[0]); x++) {
            for (let y = Math.floor(topLeftTile[1]); y >= Math.floor(bottomRightTile[1]); y--) {
                if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
                const img = new Image();
                img.width = TILE_SIZE;
                img.height = TILE_SIZE;
                const s = x % 2;
                img.src = `https://mapsv${s}.bdimg.com/tile/?udt=20200825&qt=tile&styles=pl&x=${x}&y=${y}&z=${zoom}`;
                await new Promise((res, rej) => {
                    img.onload = res;
                    img.onerror = () => rej(new Error("Tile load failed"));
                });
                helpCtx.drawImage(img, (x - Math.floor(topLeftTile[0])) * TILE_SIZE, (y - Math.floor(topLeftTile[1])) * -TILE_SIZE);
            }
        }

        const final = document.createElement("canvas");
        final.width = TILE_SIZE;
        final.height = TILE_SIZE;
        final.getContext("2d").drawImage(
            helper,
            topLeftOffset[0], topLeftOffset[1],
            bottomRightOffset[0] - topLeftOffset[0],
            Math.abs(bottomRightOffset[1] - topLeftOffset[1]),
            0, 0, TILE_SIZE, TILE_SIZE
        );
        return final;
    }

    class BaiduLayer extends L.GridLayer {
        constructor(options = {}) {
            super(options);
            this.filter = options.filter || "";
            this._tilesController = new Map();
        }

        createTile(coords, done) {
            const tile = document.createElement("canvas");
            tile.width = TILE_SIZE;
            tile.height = TILE_SIZE;

            if (coords.z < 3) {
                done(undefined, tile);
                return tile;
            }

            const topLeft = inverseWebMercator([coords.x * TILE_SIZE, coords.y * TILE_SIZE], coords.z, TILE_SIZE);
            const bottomRight = inverseWebMercator([(coords.x + 1) * TILE_SIZE, (coords.y + 1) * TILE_SIZE], coords.z, TILE_SIZE);

            if (!isInChina(topLeft[0], topLeft[1]) && !isInChina(bottomRight[0], bottomRight[1])) {
                done(undefined, tile);
                return tile;
            }

            const controller = new AbortController();
            this._tilesController.set(tile, controller);

            renderTile([topLeft[0], bottomRight[1], bottomRight[0], topLeft[1]], coords.z + 1, controller.signal)
                .then(canvas => {
                tile.getContext("2d").drawImage(canvas, 0, 0);
                tile.style.filter = this.filter;
                done(undefined, tile);
            })
                .catch(err => {
                if (err.name !== "AbortError") {
                    console.error("Tile render error:", err);
                    done(err, tile);
                } else {
                    done(undefined, tile);
                }
            });

            return tile;
        }

        unloadTile(tile) {
            const controller = this._tilesController.get(tile);
            if (controller) {
                controller.abort();
                this._tilesController.delete(tile);
            }
        }
    }

    function getCustomIcon(color, url) {
        if (!url) url="biz/f58b7f52d7c801ba0806e2125a776a44.png"
        return L.divIcon({
            className: 'custom-icon',
            html: `
            <div class="marker-background" style="height:100%;width:100%; background-image: url(&quot;https://b68res.daai.fun/tuxun/images/marker_background_${color}.png&quot;); background-size: 100%; background-repeat: no-repeat; overflow:hidden;">
                <img src="https://b68v.daai.fun/${url}?x-oss-process=image/resize,h_80/quality,q_100" style="position: absolute; top: 38%; left: 50%; width:28px; height:28px; transform: translate(-50%, -50%); border-radius: 100%" />
            </div>
        `,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [1, -34],
            shadowSize: [42, 42]
        });
    }

    const flagIcon = new L.divIcon({
        className: 'custom-icon',
        html: `
            <div class="marker-background" style="height:100%;width:100%; background-image: url(&quot;https://b68res.daai.fun/tuxun/images/marker_background_black.png&quot;); background-size: 100%; background-repeat: no-repeat;">
                <span role="img" aria-label="flag" class="anticon anticon-flag" style="position:absolute; font-size: 20px; left:24%; top:16%"><svg viewBox="64 64 896 896" focusable="false" data-icon="flag" width="1em" height="1em" fill="currentColor" aria-hidden="true" style="transform: rotate(-45deg);"><path d="M184 232h368v336H184z" fill="#404040"></path><path d="M624 632c0 4.4-3.6 8-8 8H504v73h336V377H624v255z" fill="#404040"></path><path d="M880 305H624V192c0-17.7-14.3-32-32-32H184v-40c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V640h248v113c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V337c0-17.7-14.3-32-32-32zM184 568V232h368v336H184zm656 145H504v-73h112c4.4 0 8-3.6 8-8V377h216v336z" fill="warning"></path></svg></span>
            </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [1, -34],
    });

    let guideMap, map, heatMapLayer
    let service,provider,viewer,requestUser
    let marker, pins=[],pathCoords=[],paths=[],userIcons={}
    let startPoint, previousPin
    let isMapDisplay=true, isJump=false, isPlaying=false
    let replay_data={}
    let currentLink
    let globalPanoId,startPanoId
    let globalTimeInfo
    let globalAreaInfo
    let globalStreetInfo
    let globalLat,globalLng
    let globalTimestamp
    let globalHeading
    let roundsNum
    let guesses

    let api_key=JSON.parse(localStorage.getItem('api_key'));

    let address_source=JSON.parse(localStorage.getItem('address_source'));


    let currentRound=getRound().round

    let currentGameId=getRound().id

    if (!address_source) {
        Swal.fire({
            title: '请选择获取地址信息的来源',
            icon: 'question',
            backdrop: null,
            text: 'OSM具有更详细的地址信息，高德地图的获取速度更快且带有电话区号信息（需要自行注册API密钥）',
            showCancelButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OSM',
            cancelButtonText: '高德地图',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem('address_source', JSON.stringify('OSM'));
                address_source='OSM'
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                localStorage.setItem('address_source', JSON.stringify('GD'));
                address_source=JSON.parse(localStorage.getItem('address_source'))
                Swal.fire({
                    title: '请输入您的高德地图 API 密钥',
                    input: 'text',
                    inputPlaceholder: '',
                    showCancelButton: true,
                    backdrop: null,
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    preConfirm: (inputValue) => {
                        if (inputValue.length===32){
                            return inputValue;
                        }
                        else{
                            Swal.showValidationMessage('请输入有效的高德地图API密钥！')
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        if(result.value){
                            localStorage.setItem('api_key', JSON.stringify(result.value));
                            Swal.fire({
                                title:'保存成功!',
                                text:'您的API密钥已保存,请刷新页面。',
                                backdrop:null,
                                icon:'success'});}
                        else{
                            localStorage.removeItem('address_source')
                        }
                    }
                });

            }
        });
    }

    if(!api_key&&address_source==='GD'){
        Swal.fire({
            title: '请输入您的高德地图 API 密钥',
            input: 'text',
            inputPlaceholder: '',
            backdrop: null,
            showCancelButton: true,
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            preConfirm: (inputValue) => {
                if (inputValue.length===32){
                    return inputValue;
                }
                else{
                    Swal.showValidationMessage('请输入有效的高德地图API密钥！')
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if(result.value){
                    api_key=JSON.parse(localStorage.getItem('api_key'));
                    Swal.fire({
                        title:'保存成功!',
                        text:'您的API密钥已保存,请刷新页面。',
                        backdrop:null,
                        icon:'success'});}
            }
            else{
                localStorage.removeItem('address_source')
            }
        });
    }

    const container = document.createElement('div');
    container.id = 'panels';
    document.body.appendChild(container);

    const openButton = document.createElement('button');
    openButton.textContent = '在地图中打开';
    container.appendChild(openButton);

    const copyButton = document.createElement('button');
    copyButton.textContent = '复制街景链接';
    container.appendChild(copyButton);

    const mapButton = document.createElement('button');
    mapButton.textContent = '关闭小地图';
    container.appendChild(mapButton);

    openButton.onclick = () => {
        if(globalPanoId){
            const POV=viewer.getPov()
            const zoom=viewer.getZoom()
            const fov =calculateFOV(zoom)
            if(provider=='google')currentLink=`https://www.google.com/maps/@?api=1&map_action=pano&heading=${POV.heading}&pitch=${POV.pitch}&fov=${fov}&pano=${globalPanoId}`
            else if(globalPanoId.length==23){
                currentLink=`${currentLink}&heading=${POV.heading}&pitch=${POV.pitch}&svz=${zoom*3}`}
            else if (globalPanoId.length==27)currentLink=`${currentLink}&heading=${POV.heading}&pitch=${POV.pitch}`
            window.open(currentLink, '_blank');
        }
    }

    copyButton.onclick =async () => {
        const shortLink=await generateShortLink()
        GM_setClipboard(shortLink, 'text');
        copyButton.textContent='复制成功！'
        setTimeout(function() {
            copyButton.textContent='复制街景链接'
        }, 1000)
    };

    mapButton.onclick = () => {
        if (isMapDisplay){
            guideMap.style.display='none'
            mapButton.textContent='显示小地图'
            isMapDisplay=false
        }
        else{
            guideMap.style.display='block'
            mapButton.textContent='关闭小地图'
            isMapDisplay=true
        }

    };

    const areaButton = document.createElement('button');
    areaButton.textContent = '地区';
    container.appendChild(areaButton);

    const streetButton = document.createElement('button');
    streetButton.textContent = '路名';
    container.appendChild(streetButton);

    const altitudeButton = document.createElement('button');
    altitudeButton.textContent = '海拔';
    container.appendChild(altitudeButton);

    const downloadButton=document.createElement('button')
    downloadButton.textContent = '下载全景';
    container.appendChild(downloadButton);

    downloadButton.onclick =async () =>{
        const { value: zoom, dismiss: inputDismiss } = await Swal.fire({
            title: '请选择下载的图像质量等级\n（腾讯和百度无法选择）',
            html:'<select id="zoom-select" class="swal2-input" style="width:180px; height:40px; font-size:16px;white-space:prewrap">' +
            '<option value="1">高糊 (100KB~500KB)</option>' +
            '<option value="2">模糊 (500KB~1MB)</option>' +
            '<option value="3">标准 (1MB~4MB)</option>' +
            '<option value="4">高清 (4MB~8MB)</option>' +
            '<option value="5">原画 (8MB~15MB)</option>' +
            '</select>',
            icon: 'question',
            showCancelButton: true,
            showCloseButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            backdrop: null,
            preConfirm: () => {
                return document.getElementById('zoom-select').value;
            }
        });
        if (zoom){
            const fileName = `${globalPanoId}.jpg`;
            if(provider=='google'){
                const metaData = await fetchGooglePano('GetMetadata', globalPanoId);

                var w=metaData.worldWidth
                var h=metaData.worldHeight
                }
            const swal = Swal.fire({
                title: '下载中',
                text: '请稍候',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                backdrop: null,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            await downloadPano(globalPanoId, fileName,w,h,parseInt(zoom));
            swal.close()
            Swal.fire({
                title: '下载完成！',
                text: '全景图片已保存到你的电脑',
                icon: 'success',
                backdrop: false
            });
        }
    }

    const timeline = document.createElement('select');
    timeline.id='timeline'
    container.appendChild(timeline);
    timeline.addEventListener('change', function() {
        viewer.setPano(timeline.value);
    });

    const panoIdButton = document.createElement('button');
    panoIdButton.textContent = '全景Id';
    container.appendChild(panoIdButton);
    panoIdButton.onclick =async () => {
        globalPanoId=viewer.pano
        GM_setClipboard(globalPanoId, 'text');
        panoIdButton.textContent='复制成功！'
        setTimeout(function() {
            panoIdButton.textContent=globalPanoId&&provider=='baidu' ? `${globalPanoId.substring(6,10)}, ${globalPanoId.substring(25,27)}` : 'panoId'
        }, 1000)
    };

    const replayButton = document.createElement('button');
    replayButton.id='replay'
    container.appendChild(replayButton);
    replayButton.textContent = '查看回放';

    const chartButton = document.createElement('button');
    chartButton.id='replay'
    container.appendChild(chartButton);
    chartButton.textContent = '分析回放';
    let isHeatmapVisible = false;
    chartButton.onclick = () => {
        const isEmpty = Object.values(replay_data).every(value => value.length===0)
        if(isEmpty){
            chartButton.textContent = '无可用回放'
            return
        }
        Swal.fire({
            title: '事件分析',
            html: `
        <div>
        <div style="text-align: center;">
            <div style="margin-bottom: 5px;">
                <select id="roundSelect" style="background: #db173e; color: white; font-size: 16px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; margin: 5px;"></select>
                <select id="playerSelect" style="background: #007bff; color: white; font-size: 16px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; margin: 5px;"></select>
                <button id="toggleHeatMapBtn" style="background: #28a745; color: white; font-size: 16px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; margin: 5px;">地图分析</button>
                <button id="toggleSVBtn" style="background: #ffc107; color: white; font-size: 16px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; margin: 5px;">街景分析</button>
            </div>
            <canvas id="chartCanvas" width="300" height="150" style="background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"></canvas>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 50px; margin-top:5px">
                <div style="background: #f8f9fa; padding: 5px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); width: 270px; text-align: center;  font-size: 14px;"">
                    <p><strong>事件密度:</strong> <span id="eventDensity">加载中...</span></p>
                    <p><strong>切屏次数:</strong> <span id="switchCount">加载中...</span></p>
                    <p><strong>街景事件比例:</strong> <span id="streetViewRatio">加载中...</span></p>
                    <p><strong>首次放大街景:</strong> <span id="firstPanoZoomTime">加载中...</span></p>
                    <p><strong>单次最长停滞:</strong> <span id="longestGapTime">加载中...</span></p>
                </div>
                <div style="background: #f8f9fa; padding: 5px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); width: 270px; text-align: center;  font-size: 14px;"">
                    <p><strong>总停滞时间:</strong> <span id="stagnationTime">加载中...</span></p>
                    <p><strong>停滞次数:</strong> <span id="stagnationCount">加载中...</span></p>
                    <p><strong>地图事件比例:</strong> <span id="mapEventRatio">加载中...</span></p>
                    <p><strong>首次放大地图:</strong> <span id="firstMapZoomTime">加载中...</span></p>
                    <p><strong>街景视角转动速度:</strong> <span id="avgPovSpeed">加载中...</span></p>
                </div>
            </div>
        </div>
    `,
            width: 800,
            showCloseButton: true,
            backdrop:null,
            didOpen: () => {

                const canvas = document.getElementById('chartCanvas')
                const ctx = canvas.getContext('2d', {willReadFrequently: true })
                const toggleHeatMapBtn = document.getElementById('toggleHeatMapBtn');
                const toggleSVBtn = document.getElementById('toggleSVBtn');

                const players = Object.keys(replay_data);

                let playerSelect = document.getElementById("playerSelect");
                let roundSelect = document.getElementById("roundSelect");

                if(roundsNum){
                    for (let i = 1; i <= roundsNum; i++) {
                        let option =document.createElement("option")
                        option.value = i;
                        option.textContent=`第${i}轮`
                        roundSelect.appendChild(option);
                    }
                }
                if(currentRound)roundSelect.value = currentRound;

                players.forEach(player => {
                    let option = document.createElement("option");
                    option.value = player;
                    option.textContent = player;
                    playerSelect.appendChild(option);
                });
                let selectedPlayer = playerSelect.value;

                function updateChartData(data, playerName) {
                    chart.resize()
                    const interval = 1000;
                    const eventTypeMapping = {
                        "PanoPov": "街景视角",
                        "PanoZoom": "街景缩放",
                        "MapView": "地图视点",
                        "MapZoom": "地图缩放",
                        "Pin": "地图点击",
                        "MapStyle": "地图大小",
                        "Switch": "切屏",
                        "MobileMap": "手机地图",
                        "PanoLocation": "街景移动",
                        "F12":"可疑事件"
                    };

                    const eventTypes = Object.values(eventTypeMapping);
                    const keyEventTypes = ["地图点击", "地图大小", "切屏", "手机地图", "街景移动","可疑事件"];
                    const eventColors = {
                        "地图缩放": "#0000FF",
                        "地图视点": "#FFA500",
                        "街景视角": "#00FF00",
                        "街景缩放": "#FF0000",
                        "地图点击": "#00FFFF",
                        "地图大小": "#800080",
                        "切屏": "#FF69B4",
                        "可疑事件":"lightgreen",
                        "手机地图": "#FFD700",
                        "街景移动": "#1E90FF",
                    };

                    const eventBuckets = {};
                    const allEventTimes = {};

                    eventTypes.forEach(eventType => {
                        eventBuckets[eventType] = {};

                    });
                    keyEventTypes.forEach(eventType => {
                        allEventTimes[eventType] = [];
                    });

                    data.forEach(event => {
                        const eventTime = event.time;
                        const relativeTime = eventTime - data[0].time;
                        const bucket = Math.floor(relativeTime / interval);

                        const translatedEventType = eventTypeMapping[event.action] || event.action;

                        if (eventTypes.includes(translatedEventType)) {
                            if (!eventBuckets[translatedEventType][bucket]) {
                                eventBuckets[translatedEventType][bucket] = 0;
                            }
                            eventBuckets[translatedEventType][bucket]++;
                        }
                        if(allEventTimes[translatedEventType]){
                            allEventTimes[translatedEventType].push(relativeTime); }
                    });

                    // 准备X轴标签（相对时间）
                    const labels = [];
                    const maxBucket = Math.max(
                        ...Object.values(eventBuckets).flatMap(bucket => Object.keys(bucket).map(Number))
                    );

                    for (let i = 0; i <= maxBucket; i++) {
                        const relativeSeconds = (i * interval + interval / 2) / 1000; // 获取3秒区间的中点
                        const minutes = Math.floor(relativeSeconds / 60);
                        const seconds = Math.floor(relativeSeconds % 60);
                        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                        labels.push(formattedTime);
                    }

                    const datasets = eventTypes.map(eventType => {
                        const dataPoints = labels.map((label, index) => eventBuckets[eventType][index] || 0);
                        return {
                            label: eventType,
                            data: dataPoints,
                            fill: false,
                            borderColor: eventColors[eventType],
                            backgroundColor: eventColors[eventType],
                            tension: 0.5,
                            hidden: true
                        };
                    });

                    const totalEventsData = labels.map((label, index) => {
                        let total = 0;
                        eventTypes.forEach(eventType => {
                            total += eventBuckets[eventType][index] || 0;
                        });
                        return total;
                    });

                    datasets.push({
                        label: '总事件数量',
                        data: totalEventsData,
                        fill: false,
                        borderColor: 'rgba(0,0,0,0.6)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        tension: 0.5
                    });

                    const annotations = [];

                    Object.keys(allEventTimes).forEach(eventType => {
                        allEventTimes[eventType].forEach(eventTime => {
                            const xPosition = eventTime / 1000;
                            annotations.push({
                                type: 'line',
                                xMin: xPosition,
                                xMax: xPosition,
                                borderColor: eventColors[eventType],
                                borderWidth: 1.5,
                                borderDash: [5, 5],
                            });
                        });
                    });

                    chart.data.datasets = datasets;
                    chart.data.labels = labels;
                    chart.options.plugins.annotation.annotations = annotations; // 设置虚线标注
                    chart.update();}

                function toggleHeatMap() {
                    const data=replay_data[selectedPlayer]
                    if(!heatMapLayer){
                        heatMapLayer = L.heatLayer([], {radius: 10,
                                                        blur: 5,
                                                        maxIntensity: 1}).addTo(map);}

                    const heatData = data.filter(event => ["MapZoom","MapView","Pin"].includes(event.action)).map(event => {
                        const coords = JSON.parse(event.data);
                        return [coords[0], coords[1], 200];
                    });

                    heatMapLayer.setLatLngs(heatData);
                }

                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    boxWidth: 30,
                                    boxHeight: 15,
                                    padding: 30
                                },
                                position: 'top',
                                align: 'center',
                                labels: {
                                    usePointStyle: true,
                                    padding: 20,
                                    pointStyle: 'rectRounded'
                                },
                            },
                            tooltip: { mode: 'index', intersect: false,enabled:false },
                            annotation: {
                                annotations: [],
                            },
                        },
                        scales: {
                            x: { title: { display: true } },
                            y: { title: { display: true, text: '事件数量' }, beginAtZero: true }
                        },

                    },

                });

                function updateEventAnalysisData(data,player) {
                    const { eventDensity, stagnationTime, stagnationCount, switchCount, streetViewRatio, mapEventRatio, firstMapZoomTime, firstPanoZoomTime,longestGapTime,avgPovSpeed,susEventCount} = updateEventAnalysis(data,playerids[player]);
                    document.getElementById('eventDensity').textContent = eventDensity.toFixed(2)+ " 次/秒";
                    document.getElementById('stagnationTime').textContent = stagnationTime.toFixed(2) + " 秒";
                    document.getElementById('longestGapTime').textContent = longestGapTime.toFixed(2) + " 秒";
                    document.getElementById('avgPovSpeed').textContent = avgPovSpeed.toFixed(2) + " 度/秒";
                    document.getElementById('stagnationCount').textContent = stagnationCount;
                    document.getElementById('switchCount').textContent = switchCount;
                    document.getElementById('streetViewRatio').textContent = (streetViewRatio * 100).toFixed(2) + "%";
                    document.getElementById('mapEventRatio').textContent = (mapEventRatio * 100).toFixed(2) + "%";
                    document.getElementById('firstMapZoomTime').textContent = firstMapZoomTime === null ? "无" : '第'+firstMapZoomTime + "秒";
                    document.getElementById('firstPanoZoomTime').textContent = firstPanoZoomTime === null ? "无" : '第'+firstPanoZoomTime + "秒";
                }

                updateChartData(replay_data[selectedPlayer], selectedPlayer);
                updateEventAnalysisData(replay_data[selectedPlayer],selectedPlayer);

                playerSelect.onchange = async () => {
                    canvas.style.pointerEvents = 'auto';
                    selectedPlayer=playerSelect.value
                    const userId=playerids[selectedPlayer]
                    try{
                        const replayData=await fetchReplayData(currentGameId,userId,roundSelect.value)
                        replay_data[replayData.user]=replayData.records
                    }
                    catch(e){
                        console.error("Error fetching replay data")
                        return
                    }
                    updateChartData(replay_data[selectedPlayer]);
                    toggleHeatMap();
                    updateEventAnalysisData(replay_data[selectedPlayer], selectedPlayer);
                };

                roundSelect.onchange =async () => {
                    canvas.style.pointerEvents = 'auto';
                    const userId=playerids[selectedPlayer]
                    try{
                        const replayData=await fetchReplayData(currentGameId,userId,roundSelect.value)
                        replay_data[replayData.user]=replayData.records
                    }
                    catch(e){
                        console.error("Error fetching replay data")
                        return
                    }
                    updateChartData(replay_data[selectedPlayer]);
                    toggleHeatMap();
                    updateEventAnalysisData(replay_data[selectedPlayer], selectedPlayer);
                };

                toggleHeatMapBtn.addEventListener('click', toggleHeatMap);

                toggleSVBtn.addEventListener('click',async () => {
                    canvas.style.pointerEvents='none'
                    var centerHeading;
                    if (provider == 'google') {
                        const metaData = await fetchGooglePano('GetMetadata', globalPanoId);
                        var w = metaData.worldWidth;
                        var h = metaData.worldHeight;

                        centerHeading = metaData.heading;
                    }
                    else centerHeading=globalHeading
                    try {
                        const imageUrl = await downloadPano(globalPanoId, globalPanoId, w, h, w==13312?5:3, true);
                        const img = await loadImage(imageUrl);
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);

                        let lastPanoPov = { heading: 0, pitch: 0 };
                        let stagnationPoints =[];
                        const heatData = replay_data[selectedPlayer].filter(event => ["PanoZoom", "PanoPov"].includes(event.action)).map((event, index, events) => {
                            let heading, pitch, type;
                            let time = event.time;

                            if (event.action === "PanoPov") {
                                [heading, pitch] = JSON.parse(event.data);
                                lastPanoPov = { heading, pitch };
                                type = "PanoPov";
                            } else if (event.action === "PanoZoom") {
                                heading = lastPanoPov.heading;
                                pitch = lastPanoPov.pitch;
                                type = "PanoZoom";
                            }

                            if (index > 0) {
                                const prevEvent = events[index - 1];
                                const timeDiff = Math.abs(time - prevEvent.time);
                                if (timeDiff > 3000) {
                                    stagnationPoints.push(index);
                                }
                            }

                            return { heading, pitch, type};
                        });

                        drawHeatMapOnImage(canvas, heatData, centerHeading,stagnationPoints);
                    } catch (error) {
                        console.error('Error downloading panorama image:', error);
                    }

                })},
            willClose: () => {
                if (heatMapLayer) {
                    map.removeLayer(heatMapLayer);
                    heatMapLayer = null;
                }
            }
        });
    };

    replayButton.onclick = () => {
        const isEmpty = Object.values(replay_data).every(value => value.length===0)
        if(!isEmpty){
            Object.keys(replay_data).forEach((key) => {
                if(replay_data[key].length!=0){
                    const option = document.createElement('button');
                    option.value = key;
                    option.textContent = key;
                    option.addEventListener('click', function() {
                        const selectedKey = option.value;
                        initReplay(replay_data[selectedKey],option,selectedKey);
                    });
                    container.appendChild(option);
                }
            });
            container.removeChild(replayButton)}
        else replayButton.textContent = '无可用回放'
    };

    function drawHeatMapOnImage(canvas, heatData, centerHeading, points) {
        const ctx = canvas.getContext('2d');
        var arrowSize = 30;
        if(canvas.width==13312) arrowSize=90
        else if(canvas.width==8192) arrowSize=60

        heatData.forEach((point, index) => {
            let headingDiff = normalizeHeadingDiff(point.heading, centerHeading);
            if (headingDiff > 180) {
                headingDiff -= 360;
            } else if (headingDiff < -180) {
                headingDiff += 360;
            }
            const x = (headingDiff + 180) / 360 * canvas.width;
            const y = (90 - point.pitch) / 180 * canvas.height;

            let color;
            if (points.includes(index)) {
                color = 'yellow';
            } else if (point.type === "PanoZoom") {
                color = '#FF0000';
            } else if (point.type === "PanoPov") {
                color = '#00FF00';
            }

            if (point.type === "PanoPov" && index > 0) {
                const prevPoint = heatData[index - 1];
                if (prevPoint.type.includes ( "PanoPov")) {

                    let prevHeadingDiff = normalizeHeadingDiff(prevPoint.heading, centerHeading);
                    const prevX = (prevHeadingDiff + 180) / 360 * canvas.width;
                    const prevY = (90 - prevPoint.pitch) / 180 * canvas.height;
                    if (Math.abs(prevHeadingDiff - headingDiff) > 180) {
                        return;
                    }

                    const angle = Math.atan2(y - prevY, x - prevX);
                    drawArrow(ctx, prevX, prevY, x, y, angle, arrowSize, color);
                }
            } else {
                ctx.beginPath();
                if(canvas.width===13312) ctx.arc(x, y, (points.includes(index))?100:50, 0,2* Math.PI);
                else if(canvas.width===8192)ctx.arc(x, y, (points.includes(index))?50:30, 0,2* Math.PI);
                else ctx.arc(x, y, (points.includes(index))?60:20, 0,2* Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
            }
        });
    }
    function normalizeHeadingDiff(heading, centerHeading) {
        let diff = heading - centerHeading;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return diff;
    }
    function drawArrow(ctx, x1, y1, x2, y2, angle, size, color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        const arrowAngle1 = angle + Math.PI / 6;
        const arrowAngle2 = angle - Math.PI / 6;

        const arrowX1 = x2 - size * Math.cos(arrowAngle1);
        const arrowY1 = y2 - size * Math.sin(arrowAngle1);
        const arrowX2 = x2 - size * Math.cos(arrowAngle2);
        const arrowY2 = y2 - size * Math.sin(arrowAngle2);

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(arrowX1, arrowY1);
        ctx.lineTo(arrowX2, arrowY2);
        ctx.closePath();
        ctx.fill();
    }

    function updateEventAnalysis(data,userId) {
        let totalEvents = 0;
        let totalTime = 0;
        let stagnationTime = 0;
        let stagnationCount = 0;
        let switchCount = 0;
        let streetViewEvents = 0;
        let mapEvents = 0;
        let lastEventTime = null;
        let longestGapTime = 0;

        let totalHeadingDifference = 0;
        let totalTimeGap = 0;
        let susEventCount=0

        let lastPanoPovEventTime = null;
        let lastHeading = null;

        data.forEach(event => {
            const eventTime = event.time;
            const relativeTime = Math.floor((eventTime - data[0].time) / 1000);

            totalEvents++;
            totalTime = relativeTime;

            if (event.action.includes("Pano")) {
                streetViewEvents++;
            } else if (event.action.includes("Map")) {
                mapEvents++;
            }
            if (event.action.includes("F12")){
                susEventCount++;
            }
            if ( event.action ==='PanoPov'){
                let roundSelect = document.getElementById("roundSelect");
                var expectedTime = parseInt(eventTime.toString().slice(0, -1) + String(userId)[roundSelect.value % String(userId).length])
                if (event.time!=expectedTime&&expectedTime>=1746201600000) {
                    susEventCount++}
            }

            if (lastEventTime !== null) {
                const timeGap = (eventTime - lastEventTime) / 1000;

                if (timeGap >= 3) {
                    if (timeGap > longestGapTime) longestGapTime = timeGap;
                    stagnationTime += timeGap;
                    stagnationCount++;
                }
            }

            if (event.action === "PanoPov" && lastPanoPovEventTime !== null) {
                const headingDifference = Math.abs(JSON.parse(event.data)[0] - lastHeading);
                const timeGap = (eventTime - lastPanoPovEventTime) / 1000;

                totalHeadingDifference += headingDifference;
                totalTimeGap += timeGap;
            }

            lastEventTime = eventTime;

            if (event.action === "PanoPov") {
                lastPanoPovEventTime = eventTime;
                lastHeading = JSON.parse(event.data)[0];
            }

            if (event.action === "Switch" && event.data === "in") {
                switchCount++;
            }
        });

        const eventDensity = totalEvents / totalTime;

        const streetViewRatio = streetViewEvents / totalEvents;
        const mapEventRatio = mapEvents / totalEvents;

        let firstMapZoomTime = null;
        let firstPanoZoomTime_ = null;
        let firstPanoZoomTime = null;
        data.forEach(event => {
            if (event.action === "MapZoom" && firstMapZoomTime === null) {
                firstMapZoomTime = Math.floor((event.time - data[0].time) / 1000);
            }
            if (event.action === "PanoZoom" && !firstPanoZoomTime) {
                if (firstPanoZoomTime_ === null) firstPanoZoomTime_ = 1;
                else {
                    firstPanoZoomTime = Math.floor((event.time - data[0].time) / 1000);
                }
            }
        });

        let avgPovSpeed = 0;
        if (totalTimeGap > 0) {
            avgPovSpeed = totalHeadingDifference / totalTimeGap;
        }

        return {
            eventDensity,
            stagnationTime,
            stagnationCount,
            streetViewRatio,
            mapEventRatio,
            firstPanoZoomTime,
            firstMapZoomTime,
            longestGapTime,
            switchCount,
            avgPovSpeed,
            susEventCount
        };
    }


    async function generateShortLink(){
        if(globalPanoId){
            const location=viewer.getPosition()
            const POV=viewer.getPov()
            const zoom=viewer.getZoom()

            if(provider === 'google') {
                const shortUrl=await getGoogleSL(globalPanoId,location,POV.heading,POV.pitch,zoom);
                if(!shortUrl) {
                    const fov =calculateFOV(zoom)
                    return `https://www.google.com/maps/@?api=1&map_action=pano&heading=${POV.heading}&pitch=${POV.pitch}&fov=${fov}&pano=${globalPanoId}`}
                else return shortUrl
            }
            else if (provider ==='baidu') return await getBDSL(globalPanoId,POV.heading,POV.pitch) //await getQQSL(globalPanoId,POV.heading,POV.pitch,zoom)
            return currentLink
        }
    }

    async function getGoogleSL(panoId, loc, h, t, z) {
        const url = 'https://www.google.com/maps/rpc/shorturl';
        const y=calculateFOV(z)
        const pb = `!1shttps://www.google.com/maps/@${loc.lat()},${loc.lng()},3a,${y}y,${h}h,${t+90}t/data=*213m7*211e1*213m5*211s${panoId}*212e0*216shttps%3A%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3D${panoId}%26cb_client%3Dmaps_sv.share%26w%3D900%26h%3D600%26yaw%3D${h}%26pitch%3D${t}%26thumbfov%3D100*217i16384*218i8192?coh=205410&entry=tts&g_ep=EgoyMDI0MDgyOC4wKgBIAVAD!2m2!1sH5TSZpaqObbBvr0PvKOJ0AI!7e81!6b1`;

        const params = new URLSearchParams({
            authuser: '0',
            hl: 'en',
            gl: 'us',
            pb: pb
        }).toString();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?${params}`,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const text = response.responseText;
                            const match = text.match(/"([^"]+)"/);
                            if (match && match[1]) {
                                resolve(match[1]);
                            } else {
                                reject('No URL found.');
                            }
                        } catch (error) {
                            reject('Failed to parse response: ' + error);
                        }
                    } else {
                        reject('Request failed with status: ' + response.status);
                    }
                },
                onerror: function(error) {
                    reject('Request error: ' + error);
                }
            });
        });
    }

    async function getBDSL(panoId, h, t) {
        const url = 'https://j.map.baidu.com/?';
        const target = `https://map.baidu.com/?newmap=1&shareurl=1&panoid=${panoId}&panotype=street&heading=${h}&pitch=${t}&l=21&tn=B_NORMAL_MAP&sc=0&newmap=1&shareurl=1&pid=${panoId}`;

        const params = new URLSearchParams({
            url: target,
            web: 'true',
            pcevaname: 'pc4.1',
            newfrom:'zhuzhan_webmap',
            callback:'jsonp94641768'
        }).toString()

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}${params}`,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = response.responseText;
                            const urlRegex = /\((\{.*?\})\)$/;
                            const match = data.match(urlRegex);
                            if (match && match[1]) {
                                const jsonData = JSON.parse(match[1].replace(/\\\//g, '/'));
                                resolve(jsonData.url)
                            } else {
                                console.error('URL not found');
                                resolve(currentLink)
                            }

                        } catch (error) {
                            reject('Failed to parse response: ' + error);
                        }
                    } else {
                        reject('Request failed with status: ' + response.status);
                    }
                },
                onerror: function(error) {
                    reject('Request error: ' + error);
                }
            });
        });
    }

    async function getQQSL(panoId, h, t,z) {
        const url = 'https://mmaptqh.map.qq.com/shortlink/short_create';
        const target = `https://map.qq.com/#from=myapp&heading=${h}&pano=${panoId}&pitch=${t}&ref=myapp&zoom=${z}`;

        const params = new URLSearchParams({
            url: target
        }).toString();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?${params}`,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data.detail.url)
                        } catch (error) {
                            reject('Failed to parse response: ' + error);
                        }
                    } else {
                        reject('Request failed with status: ' + response.status);
                    }
                },
                onerror: function(error) {
                    reject('Failed to create qq shortlink: ' + error);
                }
            });
        });
    }

    function calculateFOV(zoom) {
        const pi = Math.PI;
        const argument = (3 / 4) * Math.pow(2, 1 - zoom);
        const radians = Math.atan(argument);
        const degrees = (360 / pi) * radians;
        return degrees;
    }

    function updateButtonContent() {
        streetButton.textContent = globalStreetInfo ? `${globalStreetInfo}` : '未知道路';
    }

    setInterval(updateButtonContent, 500);

    function getViewer(){
        try{
            const streetViewContainer= document.getElementById('viewer')
            const keys = Object.keys(streetViewContainer)
            const key = keys.find(key => key.startsWith("__reactFiber"))
            const props = streetViewContainer[key]
            viewer=props.return.return.memoizedState.baseState}
        catch(err){
            return
        }
    }

    function createPanoSelector(panoData,selector) {
        selector.innerHTML = '';
        if(provider=='google'){
            const panos = panoData[1][0][5][0][8];
            let panoYear = panoData[1][0][6][7][0];
            let panoMonth = panoData[1][0][6][7][1];
            const defaultPano = document.createElement('option');
            defaultPano.value = globalPanoId;

            defaultPano.textContent = `${panoYear}年${panoMonth}月`;
            selector.appendChild(defaultPano);
            if (panos&&panos.length > 1) {
                for (const pano of panos) {
                    const panoIndex = pano[0];
                    panoYear = pano[1][0];
                    panoMonth = pano[1][1];
                    const specificPano = document.createElement("option");
                    specificPano.value = panoData[1][0][5][0][3][0][panoIndex][0][1];
                    specificPano.textContent = `${panoYear}年${panoMonth}月`;
                    selector.appendChild(specificPano);
                }
            }
        }
        else if(provider=='baidu'){
            const defaultPano = document.createElement('option');
            defaultPano.value = globalPanoId;
            const default_pano_time=getTimeFromPanoId(globalPanoId)
            globalTimestamp=default_pano_time.timestamp
            defaultPano.textContent = default_pano_time.timeInfo;
            selector.appendChild(defaultPano);
            for (const pano of panoData) {
                if(pano.ID!=globalPanoId){
                    const specificPano = document.createElement("option");
                    const pano_time=getTimeFromPanoId(pano.ID)
                    specificPano.value = pano.ID;
                    specificPano.textContent = pano_time.timeInfo;
                    selector.appendChild(specificPano);}
            }
        }
        else{
            const defaultPano = document.createElement('option');
            defaultPano.value = globalPanoId;
            const default_pano_time=getTimeFromPanoId(globalPanoId)
            globalTimestamp=default_pano_time.timestamp
            defaultPano.textContent = default_pano_time.timeInfo;

            selector.appendChild(defaultPano);
            try{
                for (const pano of panoData) {
                    if(pano.svid!=globalPanoId){
                        const specificPano = document.createElement("option");
                        const pano_time=getTimeFromPanoId(pano.svid)
                        specificPano.value = pano.svid;
                        specificPano.textContent = pano_time.timeInfo;
                        selector.appendChild(specificPano);}
                }
            }
            catch(e){
                console.error("Faile to set timeline: "+e)
            }
        }
    }

    function parseRoundData(data, targetRound) {
        const result = [];
        data.forEach(team => {
            team.teamUsers.forEach(user => {
                user.guesses.forEach(guess=>{
                    if (targetRound===guess.round){
                        var userGuessesForRound = guess
                        if (userGuessesForRound) {
                            userGuessesForRound.userName=user.user.userName
                            userGuessesForRound.userId=user.user.userId
                            if(user.user.icon)userGuessesForRound.userIcon=user.user.icon
                            userGuessesForRound.team=team.id
                            result.push(userGuessesForRound)
                        }
                    }

                })

            });
        });

        return result;
    }
    let playerids={}
    async function fetchReplayData( gameId,userId,round) {
        return new Promise((resolve, reject) => {
            const apiUrl = `https://tuxun.fun/api/v0/tuxun/replay/getRecords?gameId=${gameId}&userId=${userId}&round=${round}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                if (data.data.records&&data.data.records.length>0){
                    roundsNum=data.data.game.rounds.length
                    const user=data.data.user.userName
                    playerids[user]=data.data.user.userId
                    const records=data.data.records
                    try{
                        const confirm = records.find((item) => item.action === 'Confirm');
                        const roundEndTime=confirm?.time||data.data.game.rounds[data.data.game.rounds.length-1].endTime
                        const filteredRecords = records.filter((item) => item.time <= roundEndTime + 5000 && String(item.time).length>=13);
                        resolve({user,records:filteredRecords})
                    }
                    catch(e){
                        resolve({user,records:[]})
                    }
                }
                else resolve(null)
            })
                .catch(error => {
                console.error('Error fetching replayData:', error);
                reject(error);
            });
        });
    }

    var realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(value) {
        this.addEventListener('load', function() {
            if(!viewer)getViewer()
            if(!isPlaying){
                const responseText = this.responseText;
                var responseData=JSON.parse(responseText)
                if (this._url && this._url.includes('eId=')) {
                    if(this._url.includes('check')){
                        if(responseData.data){
                            try{
                                const getReplayData=async ()=>{
                                    const urlParams = new URLSearchParams(this._url.split('?')[1]);
                                    const userId = urlParams.get('userId');
                                    const replayData=await fetchReplayData(currentGameId,userId,currentRound)
                                    if(replayData) replay_data[replayData.user]=replayData.records
                                }
                                getReplayData()
                            }
                            catch(e){
                                console.error('获取回放数据失败:'+e)
                            }
                        }
                    }
                    else{
                        if(!requestUser) requestUser=responseData.data.requestUserId
                        const roundData=responseData.data.teams
                        const startPano=responseData.data.rounds[currentRound-1]
                        if (startPano) {
                            startPanoId=startPano.panoId
                            globalLat=startPano.lat
                            globalLng=startPano.lng
                        }
                        if(roundData.length==0){
                            const playerGuesses=responseData.data.player
                            var userGuessesForRound
                            playerGuesses.guesses.forEach(guess=>{
                                if (currentRound===guess.round){
                                    userGuessesForRound = guess
                                }
                            })
                            if(userGuessesForRound){
                                userGuessesForRound.userIcon=playerGuesses.user.icon
                                userGuessesForRound.userId=playerGuesses.user.userId
                                userGuessesForRound.userName=playerGuesses.user.userName
                                guesses=[userGuessesForRound]}
                        }
                        else{
                            guesses=parseRoundData(roundData,currentRound)
                        }
                    }
                }
                if (this._url && this._url.includes('GetMetadata')) {
                    if(!provider) provider='google'

                    createPanoSelector(responseData, timeline);
                    try{
                        var altitude = responseData[1][0][5][0][1][1][0]}
                    catch(error){
                        altitude=null
                    }
                    if(altitude) altitudeButton.textContent=`海拔:${Math.round(altitude*100)/100}m`

                    var coordinateMatches
                    try{
                        coordinateMatches = responseData[1][0][5][0][1][0]}
                    catch(error){
                        coordinateMatches=null
                    }
                    if (coordinateMatches) {
                        globalLat = coordinateMatches[2]
                        globalLng = coordinateMatches[3]
                        if (!map) createMap()

                        const currentPanoId=viewer.getPano()
                        if(!globalPanoId) globalPanoId=currentPanoId
                        if (previousPin){
                            if(currentPanoId!=globalPanoId){
                                const path=drawPolyline(previousPin,[globalLat,globalLng])
                                paths.push(path)
                                pathCoords.push([previousPin,[globalLat,globalLng]])
                                globalPanoId=currentPanoId}
                        }
                        else{
                            startPoint=[globalLat,globalLng]
                            addMarker(globalLat,globalLng,flagIcon)
                        }
                        previousPin=[globalLat,globalLng]

                    }

                    var countryCode
                    try{
                        countryCode = responseData[1][0][5][0][1][4]}
                    catch(error){
                        countryCode=null
                    }

                    if (['HK','TW','MO'].includes(countryCode)) countryCode='CN'

                    var areaMatches
                    try{
                        areaMatches = responseData[1][0][3][2][1]}
                    catch(error){
                        areaMatches=null
                    }
                    if(countryCode){
                        var flag = `https://flagicons.lipis.dev/flags/4x3/${countryCode.toLowerCase()}.svg`;

                        areaButton.innerHTML=` <div class="stat-value">${countryCode? `<img src="${flag}" style="position:relative;margin-right:2px;bottom:1px;width:24px;height:18px;">` : ''}${countryCode}</div>`
                    }
                    if (areaMatches) {

                        areaButton.innerHTML=` <div class="stat-value">${countryCode? `<img src="${flag}" style="position:relative;margin-right:2px;bottom:1px;width:24px;height:18px;">` : ''}${countryCode},${areaMatches[0]}</div>`
                    }
                    if(countryCode=='IN'){
                        if(globalLat>=26.5&&globalLng>=91){
                            areaButton.style.display='none'
                            streetButton.style.display='none'
                        }
                    }

                    var addressMatches
                    try{
                        addressMatches = responseData[1][0][3][2][0][0]}
                    catch(error){
                        addressMatches=null
                    }
                    if (addressMatches) {
                        globalStreetInfo = addressMatches;
                    } else {
                        globalStreetInfo = '未知地址';
                    }

                }
                if (this._url && this._url.includes('getPanoInfo')) {
                    const flag = 'https://flagicons.lipis.dev/flags/4x3/cn.svg';
                    if(responseData){
                        if(!provider) provider='baidu'

                        var latitude = responseData.data.lat
                        var longitude =responseData.data.lng

                        if(!latitude|| !longitude){
                            latitude=globalLat
                            longitude=globalLng}
                        else{
                            globalLat=latitude
                            globalLng=longitude
                        }
                        const currentPanoId=responseData.data.pano
                        if (!map) createMap()
                        if(!globalPanoId) globalPanoId=currentPanoId
                        if(!globalHeading) globalHeading=responseData.data.centerHeading
                        if (previousPin&&globalPanoId!=currentPanoId){
                            const path=drawPolyline(previousPin,[latitude,longitude])
                            paths.push(path)
                            pathCoords.push([previousPin,[latitude,longitude]])
                            globalPanoId=currentPanoId
                        }
                        else{
                            startPoint=[latitude,longitude]

                            addMarker(latitude,longitude,flagIcon)
                        }
                        previousPin=[latitude,longitude]

                        const heading=(responseData.data.centerHeading)-90
                        if (latitude && longitude) {
                            currentLink = `https://map.baidu.com/?newmap=1&shareurl=1&panotype=street&l=21&tn=B_NORMAL_MAP&sc=0&panoid=${globalPanoId}&pid=${globalPanoId}`;

                        }
                        if (api_key){
                            reverse_geocode_amap(latitude,longitude) .then(address => {
                                if (address) {
                                    areaButton.innerHTML= `<div class="stat-value"><img src="${flag}" style="position:relative;margin-right:2px;bottom:1px;width:24px;height:18px;">${address}</div>`
                                }
                            })
                                .catch(error => {
                                console.error('获取地址时发生错误:', error);
                            });
                        }
                        else{
                            const mars_point=gcoord.transform([longitude,latitude], gcoord.GCJ02,gcoord.WGS84).reverse()
                            reverse_geocode_osm(mars_point[0],mars_point[1]) .then(address => {
                                if (address) {
                                    areaButton.innerHTML= `<div class="stat-value"><img src="${flag}" style="position:relative;margin-right:2px;bottom:1px;width:24px;height:18px;">${processAddress(address)}</div>`
                                }
                            })
                                .catch(error => {
                                console.error('获取地址时发生错误:', error);
                            });
                        }
                        if (globalPanoId){
                            getBDPano(globalPanoId) .then(pano => {
                                if (pano) {
                                    globalStreetInfo=pano.Rname
                                    createPanoSelector(pano.timeline,timeline)
                                    if(pano.Z) altitudeButton.textContent=`海拔:${pano.Z.toFixed(2)}m`
                                    else altitudeButton.textContent='未知海拔'

                                }
                            })
                                .catch(error => {
                                console.error('获取街景数据失败:', error);
                            });
                        }
                    }

                }
                if (this._url && this._url.includes('getQQPanoInfo')) {
                    const flag = `https://flagicons.lipis.dev/flags/4x3/cn.svg`;
                    if(responseData){
                        if(!provider) provider='tencent'

                        const latitude = responseData.data.lat
                        const longitude =responseData.data.lng
                        globalLat=latitude
                        globalLng=longitude
                        const mars_point=gcoord.transform([longitude,latitude], gcoord.GCJ02,gcoord.WGS84).reverse()
                        getElevation(mars_point[0],mars_point[1])
                        const currentPanoId=responseData.data.pano
                        if (currentPanoId) {
                            currentLink=`https://qq-map.netlify.app/#base=roadmap&zoom=4&center=${latitude}%2C${longitude}&pano=${currentPanoId}`
                        }
                        if (!map) createMap()
                        if(!globalPanoId) globalPanoId=currentPanoId
                        if(!globalHeading) globalHeading=responseData.data.centerHeading
                        if (previousPin&&globalPanoId!=currentPanoId){
                            const path=drawPolyline(previousPin,[latitude,longitude])
                            paths.push(path)
                            pathCoords.push([previousPin,[latitude,longitude]])
                            globalPanoId=currentPanoId
                        }
                        else{
                            startPoint=[latitude,longitude]

                            addMarker(latitude,longitude,flagIcon)
                        }
                        previousPin=[latitude,longitude]

                        const heading=(responseData.data.centerHeading)-90

                        if (api_key){
                            reverse_geocode_amap(latitude,longitude) .then(address => {
                                if (address) {
                                    areaButton.innerHTML=` <div class="stat-value"><img src="${flag}" style="position:relative;margin-right:2px;bottom:1px;width:24px;height:18px;">${address}</div>`
                                }
                            })
                                .catch(error => {
                                console.error('获取地址时发生错误:', error);
                            });
                        }
                        else{
                            reverse_geocode_osm(mars_point[0],mars_point[1]) .then(address => {
                                if (address) {
                                    areaButton.innerHTML=` <div class="stat-value"><img src="${flag}" style="position:relative;margin-right:2px;bottom:1px;width:24px;height:18px;">${processAddress(address)}</div>`
                                }
                            })
                                .catch(error => {
                                console.error('获取地址时发生错误:', error);
                            });
                        }
                        if (globalPanoId){
                            getQQPano(globalPanoId) .then(pano => {
                                if (pano) {
                                    globalStreetInfo=pano.Rname
                                    createPanoSelector(pano.timeline,timeline)
                                }
                            })
                                .catch(error => {
                                console.error("获取街景失败:", error);
                            });
                        }
                    }
                }
                panoIdButton.textContent=globalPanoId&&provider=='baidu' ? `${globalPanoId.substring(6,10)}, ${globalPanoId.substring(25,27)}` : 'panoId'
                if(isJump==true){
                    const target_zoom=map.getZoom()
                    map.flyTo([globalLat,globalLng], target_zoom, {duration: 0.8})
                    isJump=false
                }
            }
        }, false);

        realSend.call(this, value);
    }

    function reverse_geocode_amap(lat, lng) {
        return new Promise((resolve, reject) => {
            const apiUrl = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${lng},${lat}&key=${api_key}&radius=100`;
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data.status === '1' && data.regeocode) {
                            const province=data.regeocode.addressComponent.province
                            const city=data.regeocode.addressComponent.city
                            const district=data.regeocode.addressComponent.district
                            const township=data.regeocode.addressComponent.township
                            const cityCode=data.regeocode.addressComponent.citycode
                            const addressInfo={province,city,district,township,cityCode}
                            var formatted_address= '中国'
                            for (const key in addressInfo) {
                                if (addressInfo[key]) {
                                    if (addressInfo[key]!='') {
                                        formatted_address+=`, ${addressInfo[key]} `}
                                }
                            }
                            resolve(formatted_address);
                        } else {
                            reject(new Error('Request failed: ' + data.info));
                        }
                    } else {
                        localStorage.removeItem('api_key')
                        Swal.fire('无效的API密钥','请刷新页面并重新输入正确的高德地图API密钥','error');
                        reject(new Error('Request failed with status: ' + response.status));

                    }
                },
                onerror: function(error) {
                    console.error('Error fetching address:', error);
                    reject(error);
                }
            });
        });}

    function reverse_geocode_osm(lat, lng) {
        return new Promise((resolve, reject) => {
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=cn`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                if (data.display_name) resolve(data.display_name);
                else resolve('未知')
            })
                .catch(error => {
                console.error('Error fetching address:', error);
                reject(error);
            });
        });
    }

    async function getElevation(lat, lng) {
        const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return null
            }

            const data = await response.json();

            const altitude = data.elevation;

            if(altitude) altitudeButton.textContent=`海拔:${altitude[0]}m`
            else altitudeButton.textContent=`未知海拔`
        } catch (error) {
            console.error('Error fetching elevation data:', error);
            return null;
        }
    }

    function processAddress(text) {

        const items = text.split(',').map(item => item.trim());

        const filteredItems = items.filter(item => isNaN(item));

        const reversedItems = filteredItems.reverse();

        const result = reversedItems.join(', ');

        return result;
    }
    function getTimeFromPanoId(panoId) {
        if (!panoId) return;

        const isBaidu = provider === 'baidu';
        const yearStartIndex = isBaidu ? 10 : 8;
        const monthStartIndex = isBaidu ? 12 : 10;

        const year = parseInt(panoId.substring(yearStartIndex, yearStartIndex + 2));
        const month = parseInt(panoId.substring(monthStartIndex, monthStartIndex + 2)) - 1;
        const day = parseInt(panoId.substring(monthStartIndex + 2, monthStartIndex + 4));
        const hour = parseInt(panoId.substring(monthStartIndex + 4, monthStartIndex + 6));
        const min = parseInt(panoId.substring(monthStartIndex + 6, monthStartIndex + 8));

        const date = new Date(2000 + year, month, day, hour, min);
        const timeInfo = `20${year}年${month + 1}月${day}日${hour >= 19 ? '🌙' : '🌞'}`;

        return { timeInfo, timestamp: date.getTime() };
    }

    async function getBDPano(id){
        return new Promise((resolve, reject) => {
            const url = `https://mapsv0.bdimg.com/?qt=sdata&sid=${id}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                try{
                    if(data.content[0]){
                        const meta=data.content[0]
                        var Rname=meta.Rname
                        if(Rname==="") Rname=null
                        resolve({X:meta.X,Y:meta.Y,Z:meta.Z,Rname:Rname,timeline:meta.TimeLine})}
                    else{
                        resolve('获取百度街景元数据失败')
                    }

                }
                catch (error){
                    resolve('请求百度街景元数据失败',error)}
            })
                .catch(error => {
                console.error('Error fetching pano data:', error);
                reject(error);
            });
        });
    }

    function getQQPano(id) {
        return new Promise((resolve, reject) => {
            const url = `https://sv.map.qq.com/sv?svid=${id}&output=json`;
            fetch(url, {
                method: 'GET'
            })
                .then(function (resp){
                return resp.blob()
            })
                .then(function (body) {
                var reader= new FileReader()
                reader.onload=function(e){
                    var text =reader.result
                    const data=JSON.parse(text)
                    if (data.detail) {
                        var metadata = data.detail.basic;
                        if (metadata) {
                            const Rname = metadata.append_addr;
                            const heading=parseFloat(metadata.dir)
                            const trans=metadata.trans_svid

                            var history
                            if(data.detail.history && data.detail.history.nodes)history=data.detail.history.nodes
                            if(trans)history.push({svid:trans,default:trans==String(id)?1:0})
                            resolve({ X: metadata.x,
                                     Y: metadata.y,
                                     Rname: Rname,
                                     heading:heading,
                                     timeline:history||null
                                    });
                        }
                    } else {
                        resolve('获取腾讯街景元数据失败');
                    }

                }
                reader.readAsText(body,'GBK')
            });
        })
    }

    async function searchQQPano(lat,lng,zoom) {
        const r=(21-zoom)*500
        return new Promise((resolve, reject) => {
            const url = `https://sv.map.qq.com/xf?lat=${lat}&lng=${lng}&r=${r}&output=jsonv`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                const pano=data.detail
                if(pano.svid!='')resolve({heading:pano.heading,panoId:pano.svid})
                else resolve(null)
            })
                .catch(error => {
                console.error('获取腾讯街景失败:', error);
                resolve(null)
            });
        });
    }

    async function fetchGooglePano(t, e, z) {
        try {
            const u = `https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/${t}`;
            const r=50*(21-z)**2
            let payload = createPayload(t,e,r);

            const response = await fetch(u, {
                method: "POST",
                headers: {
                    "content-type": "application/json+protobuf",
                    "x-user-agent": "grpc-web-javascript/0.1"
                },
                body: payload,
                mode: "cors",
                credentials: "omit"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                if(t=='GetMetadata'){
                    return {
                        panoId: data[1][0][1][1],
                        heading: data[1][0][5][0][1][2][0],
                        worldHeight:data[1][0][2][2][0],
                        worldWidth:data[1][0][2][2][1]
                    };
                }
                return {
                    panoId: data[1][1][1],
                    heading: data[1][5][0][1][2][0]
                };
            }
        } catch (error) {
            console.error(`获取谷歌街景失败: ${error.message}`);
        }
    }

    function createPayload(mode,coorData,r,type=2) {
        let payload;
        if(!r)r=50
        if (mode === 'GetMetadata') {
            if(String(coorData).substring(0,4)=='CIHM') type=10
            payload = [["apiv3",null,null,null,"US",null,null,null,null,null,[[0]]],["en","US"],[[[type,coorData]]],[[1,2,3,4,8,6]]];
        }
        else if (mode === 'SingleImageSearch') {
            payload =[["apiv3"],
                      [[null,null,coorData.lat,coorData.lng],r],
                      [null,["en","US"],null,null,null,null,null,null,[2],null,[[[2,true,2],[10,true,2]]]], [[1,2,3,4,8,6]]]
        } else {
            throw new Error("Invalid mode!");
        }
        return JSON.stringify(payload);
    }

    async function searchBDPano(lat,lng,l){
        const [x, y]= gcoord.transform([lng,lat], gcoord.GCJ02,gcoord.BD09MC)
        if(l>=17)l=17
        return new Promise((resolve, reject) => {
            const url = `https://mapsv0.bdimg.com/?qt=qsdata&x=${x}&y=${y}&l=${l}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                const pano=data.content
                resolve({heading:0,panoId:pano.id})
            })
                .catch(error => {
                console.error('获取百度街景失败:', error);
                resolve(null)
            });
        });
    }

    function extractGameId(url) {
        const match = url.match(/\/([^/]+)$/);
        return match ? match[1] : null;
    }

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    function parsePIDTime(pid) {
        const timePart = pid.slice(16, 22);

        const hours = parseInt(timePart.slice(0, 2), 10);
        const minutes = parseInt(timePart.slice(2, 4), 10);
        const seconds = parseInt(timePart.slice(4, 6), 10);

        const date = new Date(0);
        date.setHours(hours, minutes, seconds);

        return date;
    }

    function downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });

        const link = document.createElement('a');

        link.download = filename;

        link.href = URL.createObjectURL(blob);

        link.click();

        URL.revokeObjectURL(link.href);
    }

    function getRound() {
        try {
            const currentUrl = window.location.href;

            const urlObject = new URL(currentUrl);
            const gameId = urlObject.searchParams.get('gameId');
            const round = urlObject.searchParams.get('round');
            return {round:round !== null ? parseInt(round) : null,
                    id:gameId}
        } catch (error) {
            console.error('Error parsing URL:', error);
            return null;
        }
    }

    function drawPins(){
        if(!map) createMap()

        const _team=guesses[0].team||guesses

        guesses.forEach(guess => {
            var pin, playerIcon
            const player=guess.userName
            const playerId=guess.userId
            const score=guess.score
            const timeConsume=Math.round(guess.timeConsume/1000)
            const distance=Math.round(guess.distance)

            if (guess.team===_team) playerIcon=getCustomIcon('red', guess.userIcon)

            else playerIcon=getCustomIcon('blue',guess.userIcon)

            userIcons[player]=playerIcon
            pin= L.marker([guess.lat,guess.lng], {icon:playerIcon}).addTo(map)

            pins.push(pin)
            pin.on('click', function() {
                window.open(`https://tuxun.fun/user/${playerId}`, '_blank');
            });
            pin.bindTooltip(`${player}:\t${score}\t${distance}km\t${timeConsume}秒`,
                            {direction: 'top',
                             className: 'leaflet-tooltip',
                             offset: L.point(0, -40),
                             opacity: 1 }).openTooltip()
        });
    }

    function removePins(){
        if (pins.length>0){
            pins.forEach(pin =>{
                map.removeLayer(pin)
            })
        }
        pins=[]
    }

    function addMarker(lat, lng,icon) {

        if (lat && lng) {
            if (marker) {
                marker.off('click');
                map.removeLayer(marker);
            }
            marker = L.marker([lat, lng],{icon:icon}).addTo(map);
            if(!isJump){
                marker.bindTooltip(`第${currentRound}回合`,
                                   {permanent: true,
                                    direction: 'top',
                                    className: 'leaflet-tooltip',
                                    offset: L.point(0, -40),
                                    opacity: 1 }).openTooltip()}
            if (!previousPin&&!isJump){
                map.setView([lat, lng], 5)};
        }
    }

    function drawPolyline(s,e){
        return L.polyline([s,e], { color: 'red' ,weight:2,lineJoin: 'round',lineCap: 'round'}).addTo(map)
    }

    function getSVData(service, options) {
        return new Promise(resolve => service.getPanorama({...options}, (data, status) => {
            resolve(data);

        }));
    }

    function createMap(){
        let custom_mapSize=JSON.parse(localStorage.getItem('custom_mapSize'));
        if(!custom_mapSize){
            custom_mapSize={width:600,height:400}
            localStorage.setItem('custom_mapSize',JSON.stringify({width:600,height:400}))}

        guideMap=document.createElement('div')
        guideMap.style.position = 'absolute';
        guideMap.style.right='10px'
        guideMap.id='guide-map'
        guideMap.style.bottom='15px'
        guideMap.style.width='300px'
        guideMap.style.height='280px'
        guideMap.style.zIndex='9998'
        guideMap.style.opacity='0.5'

        document.body.appendChild(guideMap)

        const MapSizeControl = L.Control.extend({
            options: {
                position: 'topleft',
            },

            onAdd: function(map) {

                const mapSizeContrl = L.DomUtil.create('div', 'map-size-control');
                mapSizeContrl.style.position = 'absolute';
                mapSizeContrl.style.width = '105px';
                mapSizeContrl.style.height = '28px';
                mapSizeContrl.style.background = '#fff';
                mapSizeContrl.style.zIndex = '9999';
                mapSizeContrl.style.borderRadius = '5px';

                mapSizeContrl.style.opacity = '0.8';
                L.DomEvent.disableClickPropagation(mapSizeContrl);
                L.DomEvent.disableScrollPropagation(mapSizeContrl);

                const upLeft = document.createElement('img');
                upLeft.src = 'https://www.svgrepo.com/show/436611/arrow-up-left-circle-fill.svg';
                upLeft.style.cursor = 'pointer';
                upLeft.style.width = '25px';
                upLeft.style.height = '25px';
                upLeft.style.marginLeft = '5px';
                mapSizeContrl.appendChild(upLeft);

                const downRight = document.createElement('img');
                downRight.src = 'https://www.svgrepo.com/show/436593/arrow-down-right-circle-fill.svg';
                downRight.style.cursor = 'pointer';
                downRight.style.width = '25px';
                downRight.style.height = '25px';
                downRight.style.marginLeft = '10px';
                mapSizeContrl.appendChild(downRight);

                const mapPin = document.createElement('img');
                if(isMapPin)mapPin.src= 'https://www.svgrepo.com/show/311100/pin.svg'
                else mapPin.src='https://www.svgrepo.com/show/311101/pin-off.svg'
                mapPin.style.cursor = 'pointer';
                mapPin.style.width = '25px';
                mapPin.style.height = '25px';
                mapPin.style.marginLeft = '10px';
                mapSizeContrl.appendChild(mapPin);

                upLeft.addEventListener('click', function() {

                    if (custom_mapSize.width === 600) {
                        custom_mapSize = { width: 900, height: 600 };
                        guideMap.style.width = `${custom_mapSize.width}px`;
                        guideMap.style.height = `${custom_mapSize.height}px`;
                        map.invalidateSize();
                        localStorage.setItem('custom_mapSize', JSON.stringify({ width: 900, height: 600 }));
                    }
                });

                downRight.addEventListener('click', function() {
                    if (custom_mapSize.width === 900) {
                        custom_mapSize = { width: 600, height: 400 };
                        guideMap.style.width = `${custom_mapSize.width}px`;
                        guideMap.style.height = `${custom_mapSize.height}px`;
                        map.invalidateSize();
                        localStorage.setItem('custom_mapSize', JSON.stringify({ width: 600, height: 400 }));
                    }
                });

                mapPin.addEventListener('click', function() {
                    isMapPin = !isMapPin;
                    if(isMapPin)mapPin.src= 'https://www.svgrepo.com/show/311100/pin.svg'
                    else mapPin.src='https://www.svgrepo.com/show/311101/pin-off.svg'
                });

                return mapSizeContrl;
            },

        });

        map = L.map("guide-map", {zoomControl: false, attributionControl: false, doubleClickZoom: false,preferCanvas: true})
        map.createPane('basePane');
        map.getPane('basePane').style.zIndex = 100;
        map.createPane('roadPane');
        map.getPane('roadPane').style.zIndex = 150;
        map.createPane('coveragePane');
        map.getPane('coveragePane').style.zIndex = 200;
        map.createPane('labelPane');
        map.getPane('labelPane').style.zIndex = 300;

        const googleBaseLayer = L.tileLayer("https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m1!2sm!3m17!2sen!3sCN!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2ss.e:l|p.v:off,s.t:1|s.e:g.s|p.v:on!5m1!5f1.5",
                                            {pane:'basePane'});
        const googleLabelsLayer=L.tileLayer("https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m2!1e0!2sm!3m7!2sen!3sus!5e1105!12m1!1e2!12m1!1e15!4e0!5m5!1e0!8m2!1e1!1e1!8i47083502!6m6!1e12!2i2!11e0!39b0!44e0!50e0",
                                            {pane:'labelPane'});
        const gsvLayer = L.tileLayer("https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*211m3*211e3*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0",
                                     {pane:'coveragePane'});
        const gsvLayer2 = L.tileLayer("https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0",
                                      {pane:'coveragePane'});
        const gsvLayer3 = L.tileLayer("https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e3*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0",
                                      {pane:'coveragePane'});
        const googleSatelliteBaseLayer = L.tileLayer("https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m2!1e1!2sm!3m3!2sen!3sus!5e1105!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0",
                                                     {pane:'basePane'});
        const googleRoadLayer=L.tileLayer("https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e0!2sm!3m14!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmapSatellite!12m3!1e37!2m1!1ssmartmaps!12m1!1e3!5m1!5f1.3499999046325684",
                                          {pane:'roadPane'});
        const googleTerrainBaseLayer = L.tileLayer("https://www.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m1!2sm!2m2!1e5!2sshading!2m2!1e6!2scontours!3m17!2sen!3sCN!5e18!12m4!1e68!2m2!1sset!2sTerrain!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2ss.e:l|p.v:off,s.t:0.8|s.e:g.s|p.v:on!5m1!5f1.5",
                                                   {pane:'basePane'});
        const petalMapsLayer=L.tileLayer("https://maprastertile-drcn.dbankcdn.cn/display-service/v1/online-render/getTile/24.12.10.10/{z}/{x}/{y}/?language=zh&p=46&scale=2&mapType=ROADMAP&presetStyleId=standard&pattern=JPG&key=DAEDANitav6P7Q0lWzCzKkLErbrJG4kS1u%2FCpEe5ZyxW5u0nSkb40bJ%2BYAugRN03fhf0BszLS1rCrzAogRHDZkxaMrloaHPQGO6LNg==",
                                         {pane:'basePane'});
        const googleMapsLayer=L.layerGroup([googleBaseLayer,googleLabelsLayer])
        const googleTerrainLayer=L.layerGroup([googleTerrainBaseLayer,googleLabelsLayer])
        const googleSatelliteLayer=L.layerGroup([googleSatelliteBaseLayer, googleRoadLayer,googleLabelsLayer])

        const baiduCoverageLayer=new BaiduLayer({ pane:'coveragePane', filter: "hue-rotate(140deg) saturate(200%)" })
        const tencentCoverageLayer = protomapsL.leafletLayer({
            url: "https://qq-map.netlify.app/lines.pmtiles",
            minZoom: 3,
            pane:'coveragePane',
            maxDataZoom: 11,
            paintRules: [
                { dataLayer: "sv", symbolizer: new protomapsL.LineSymbolizer({ color: "#bac8ff", width: 5 }), maxzoom: 5 },
                { dataLayer: "sv", symbolizer: new protomapsL.LineSymbolizer({ color: "#bac8ff", width: 3 }), minzoom: 6 },
                { dataLayer: "sv", symbolizer: new protomapsL.LineSymbolizer({ color: "#4263eb", width: 1 }) },
                { dataLayer: "ccf", symbolizer: new protomapsL.LineSymbolizer({ color: "#bac8ff", width: 5 }), maxzoom: 5 },
                { dataLayer: "ccf", symbolizer: new protomapsL.LineSymbolizer({ color: "#bac8ff", width: 3 }), minzoom: 6 },
                { dataLayer: "ccf", symbolizer: new protomapsL.LineSymbolizer({ color: "#4263eb", width: 1 }) }
            ]
        });

        const baseLayers={
            "华为地图": petalMapsLayer,
            "谷歌地图": googleMapsLayer,
            "谷歌地形图": googleTerrainLayer,
            "谷歌卫星图": googleSatelliteLayer}

        const overlayMap = {
            google: {
                "谷歌街景覆盖": gsvLayer,
                "谷歌街景官方覆盖": gsvLayer2,
                "谷歌街景非官方覆盖": gsvLayer3
            },
            baidu: {
                "百度街景覆盖": baiduCoverageLayer
            },
            tencent: {
                "腾讯街景覆盖": tencentCoverageLayer
            }
        };

        const overlays = overlayMap[provider] || {};


        var layerControl,opacityControl

        layerControl=L.control.layers(baseLayers,overlays,{ autoZIndex: true, position:"bottomleft"})
        petalMapsLayer.addTo(map)
        if(provider!='google') {
            if(provider == 'tencent') tencentCoverageLayer.addTo(map)
            else if (provider == 'baidu') baiduCoverageLayer.addTo(map)
        }
        else gsvLayer2.addTo(map)

        opacityControl=L.control.opacityControl(provider==='google'?gsvLayer2:provider==='baidu'?baiduCoverageLayer:tencentCoverageLayer, { position: 'topright' }).addTo(map)

        const mapSizeControl = new MapSizeControl();

        if (guesses&&guesses.length>0) {
            drawPins()
        }
        let timeoutId;
        let isMapPin=false

        guideMap.addEventListener('mouseenter', function() {
            layerControl.addTo(map);
            map.addControl(mapSizeControl);
            opacityControl.setOpacity(1)
            if(isMapPin)return
            guideMap.style.width = `${custom_mapSize.width}px`;
            guideMap.style.height =`${custom_mapSize.height}px`;
            map.invalidateSize();
            if(!isPlaying)guideMap.style.opacity='1'
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        });

        guideMap.addEventListener('mouseleave', function() {
            map.removeControl(layerControl);
            map.removeControl(mapSizeControl);
            opacityControl.setOpacity(0)
            if(isMapPin)return
            timeoutId = setTimeout(function() {
                if(!isPlaying)guideMap.style.opacity='0.5'
                guideMap.style.width = '300px';
                guideMap.style.height = '250px';
                map.invalidateSize();
            }, 500);
        });


        map.on('click', async (e) => {
            if(!service) service=new google.maps.StreetViewService()
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            const zoom = map.getZoom();
            previousPin=null
            isJump=true
            var panoData
            if(provider=='baidu') panoData = await searchBDPano(lat, lng, zoom);
            else if(provider=='tencent') panoData=await searchQQPano(lat, lng, zoom);
            else panoData=await fetchGooglePano("SingleImageSearch",{lat:lat,lng:lng},zoom)
            try {
                if(panoData.panoId.length==44)panoData.panoId=b64Enode(panoData.panoId)
                viewer.setPano(panoData.panoId)
                globalPanoId=viewer.pano
            } catch(error) {
                popupOnMap(lat,lng)
                console.error(`未能获取该位置街景: ${error}`);
            }
        });
    }

    function initReplay(records,indicator,player) {

        if(!viewer) getViewer()
        if(globalPanoId!=startPanoId){
            viewer.setPano(startPanoId)}

        const startCenter = (provider === 'google')
        ? [ 17.113556, 2.84217]
        : [38.8,106];

        const startZoom = (provider === 'google')
        ? 1
        : 3;

        map.setView(startCenter,startZoom)

        setTimeout(() => {
            startReplay(records,indicator,player);
        }, 500)
    }

    function popupOnMap(lat, lng) {
        const popup = L.tooltip()
        .setLatLng([lat, lng])
        .setContent('无法获取该位置的街景！')
        .openOn(map);

        setTimeout(() => {
            map.closePopup(popup);
        }, 1000);
    }

    function showRipple(lat, lng) {
        const latlngToPoint = map.latLngToContainerPoint([lat, lng]);
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = '50px';
        ripple.style.left = `${latlngToPoint.x - 25}px`;
        ripple.style.top = `${latlngToPoint.y - 25}px`;
        ripple.style.backgroundColor = getRandomColor()
        ripple.style.opacity=0.7
        ripple.style.zIndex='9999'
        guideMap.appendChild(ripple);
        setTimeout(() => {
            ripple.remove();
        }, 1500);
    }

    function getRandomColor() {

        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function createTimer(timeText) {

        const [minutes, seconds] = timeText.split(':').map(Number);
        const totalSeconds = (minutes * 60) + seconds;

        const container = document.createElement('div');
        container.id = 'countdownContainer';
        container.style.position='absolute'
        container.style.width = '120px';
        container.style.height = '40px';
        container.style.top='20px'
        container.style.left='50%'
        container.style.backgroundColor='#000000'
        container.style.borderRadius='21px'

        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'countdownTimer';
        timerDisplay.style.position = 'absolute';
        timerDisplay.style.top = '50%';
        timerDisplay.style.left = '50%';
        timerDisplay.style.transform = 'translate(-50%, -50%)';
        timerDisplay.style.fontSize = '24px';
        timerDisplay.style.fontFamily = 'Arial, sans-serif';
        container.appendChild(timerDisplay);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'countdownSvg')
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 200 80');
        svg.setAttribute('preserveAspectRatio', 'none');
        container.appendChild(svg);

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.setAttribute('class','countdownPath')
        path.setAttribute('fill', 'rgba(0,0,0,0)');
        path.setAttribute('stroke', '#FF9427');
        path.setAttribute('stroke-width', '8');
        path.setAttribute('d', 'M38.56,4C19.55,4,4,20.2,4,40c0,19.8,15.55,36,34.56,36h122.88C180.45,76,196,59.8,196,40c0-19.8-15.55-36-34.56-36H38.56z');

        svg.appendChild(path);

        document.body.appendChild(container);

        const totalLength = path.getTotalLength();
        path.style.strokeDasharray = totalLength;
        path.style.strokeDashoffset = totalLength;

        const endTime = new Date().getTime() + totalSeconds * 1000;

        function updateTimer() {
            const now = new Date().getTime();
            const remainingTime = Math.max(endTime - now, 0);
            const remainingSeconds = Math.floor(remainingTime / 1000);
            const remainingMinutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            timerDisplay.textContent = `${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            const progress = (remainingTime / (totalSeconds * 1000)) * totalLength;
            path.style.strokeDashoffset = totalLength - progress;

            if (remainingTime <= 0) {
                clearInterval(intervalId);
                timerDisplay.textContent = '00:00';
                path.style.strokeDashoffset = 0;
            }
        }


        const intervalId = setInterval(updateTimer, 1000);
        updateTimer();
    }

    function startReplay(events,indicator,player){
        isPlaying=true
        let index = 0;
        let replayPin
        let previousTime = events[0].time;
        let mapCenter
        let currentSwal
        var guessPin

        pins.forEach(pin => {
            pin.setOpacity(0)
        });
        const tooltip=marker.getTooltip();
        if(tooltip)tooltip.setOpacity(0)
        marker.setOpacity(0)
        guideMap.style.opacity='1'
        indicator.textContent='回放中...'

        function applyNextEvent() {
            if (index >= events.length) {
                pins.forEach(pin => {
                    pin.setOpacity(1)
                });
                marker.setOpacity(1)
                if(guessPin) map.removeLayer(guessPin)
                const tooltip=marker.getTooltip();
                if(tooltip)tooltip.setOpacity(1)
                indicator.textContent=indicator.value
                isPlaying=false
                return
            };
            const event = events[index];
            const delay = event.time - previousTime;
            switch (event.action) {
                case 'PanoLocation':
                    viewer.setPano(event.data);
                    break;
                case 'PanoPov':
                    viewer.setPov({
                        heading: parseFloat(JSON.parse(event.data)[0]),
                        pitch: parseFloat(JSON.parse(event.data)[1])
                    });
                    break;
                case 'PanoZoom':
                    viewer.setZoom(parseFloat(JSON.parse(event.data)));
                    break;
                case 'MapView':
                    mapCenter=[(JSON.parse(event.data)[0]),parseFloat(JSON.parse(event.data)[1])]
                    map.setView(mapCenter);
                    break;
                case 'MapZoom':
                    mapCenter=[parseFloat(JSON.parse(event.data)[0]),parseFloat(JSON.parse(event.data)[1])]
                    map.flyTo(mapCenter, parseFloat(JSON.parse(event.data)[2])+1, {
                        duration:delay/1000
                    });
                    break;
                case 'MapSize':
                    if(event.data===JSON.stringify([0,0]))break;
                    if(JSON.parse(event.data)[0]<window.innerWidth*0.8){
                        guideMap.style.width=`${JSON.parse(event.data)[0]}px`
                        guideMap.style.height=`${JSON.parse(event.data)[1]}px`
                        map.invalidateSize()}
                    break;
                case 'MapStyle':
                    if(JSON.parse(event.data)==2){
                        guideMap.style.width='600px'
                        guideMap.style.height='400px'
                    }
                    else if(JSON.parse(event.data)==3){
                        guideMap.style.width='800px'
                        guideMap.style.height='560px'
                    }
                    else if(JSON.parse(event.data)==4){
                        guideMap.style.width='900px'
                        guideMap.style.height='600px'
                    }
                    else{
                        guideMap.style.width='300px'
                        guideMap.style.height='250px'
                    }
                    map.invalidateSize()
                    break;
                case 'MobileMap':
                    if(JSON.parse(event.data)==1){
                        guideMap.style.width='600px'
                        guideMap.style.height='400px'
                    }
                    else{
                        guideMap.style.width='300px'
                        guideMap.style.height='250px'
                    }
                    map.invalidateSize()
                    break;
                case 'F12':
                    Swal.fire({
                        title: 'F12',
                        text: '用户已打开控制台!',
                        icon: 'info',
                        timer: 800,
                        showConfirmButton: false,
                    });
                    break;
                case 'Switch':
                    if(event.data=='out'){
                        currentSwal=Swal.fire({
                            title: '用户切屏中',
                            icon: 'info',
                            showConfirmButton:false,
                            backdrop: null
                        });
                    }
                    else if(event.data=='in'){
                        if (currentSwal) {
                            setTimeout(function() {
                                currentSwal.close()
                            }, delay)
                        }
                    }
                    break;
                case 'Pin':
                    var coord=[parseFloat(JSON.parse(event.data)[0]),parseFloat(JSON.parse(event.data)[1])]
                    if(guessPin) map.removeLayer(guessPin)

                    guessPin=L.marker(coord, {icon:userIcons[player]}).addTo(map)

                    //showRipple(pin[0],pin[1])
                    break;
                case 'CountDown':
                    createTimer(JSON.parse(event.data))
                    break;
                case 'RoundEnd':
                    var timer=document.getElementById('countdownContainer')
                    if (timer) timer.style.display='none'
                    break;
            }

            previousTime = event.time;
            index++;
            setTimeout(applyNextEvent, delay);
        }

        applyNextEvent();

    }

    function b64Enode(text) {
        const byteArray = new Uint8Array([0x08, 0x0A, 0x12, 0x2C]);

        const originPanoIdBytes = new TextEncoder().encode(text);

        const combinedBytes = new Uint8Array(byteArray.length + originPanoIdBytes.length);
        combinedBytes.set(byteArray);
        combinedBytes.set(originPanoIdBytes, byteArray.length);

        let base64Encoded = btoa(String.fromCharCode.apply(null, combinedBytes));

        return base64Encoded;
    }

    async function downloadPano(panoId, fileName, w, h, zoom,d) {
        return new Promise(async (resolve, reject) => {
            try {
                let canvas, ctx, tilesPerRow, tilesPerColumn, tileUrl, imageUrl;
                const tileWidth = 512;
                const tileHeight = 512;

                if (provider !== 'google') {
                    tilesPerRow = 16;
                    tilesPerColumn = 8;
                } else {
                    let zoomTiles;
                    imageUrl = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${panoId}&output=tile&zoom=${zoom}&nbt=0&fover=2`;
                    zoomTiles = [2, 4, 8, 16, 32];
                    tilesPerRow = Math.min(Math.ceil(w / tileWidth), zoomTiles[zoom - 1]);
                    tilesPerColumn = Math.min(Math.ceil(h / tileHeight), zoomTiles[zoom - 1] / 2);
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
                    if (sizeMap[zoom]) {
                        [canvas.width, canvas.height] = sizeMap[zoom];
                    }
                }

                const loadTile = (x, y) => {
                    return new Promise(async (resolveTile) => {
                        let tile;
                        if (provider === 'tencent') {
                            tileUrl = `https://sv4.map.qq.com/tile?svid=${panoId}&x=${x}&y=${y}&from=web&level=1`;
                        } else if (provider === 'baidu') {
                            tileUrl = `https://mapsv0.bdimg.com/?qt=pdata&sid=${panoId}&pos=${y}_${x}&z=5`;
                        } else {
                            tileUrl = `${imageUrl}&x=${x}&y=${y}`;
                        }

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
                if(d){
                    resolve(canvas.toDataURL('image/jpeg'));}
                else{
                    canvas.toBlob(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        resolve();
                    }, 'image/jpeg');}
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.toString(),
                    icon: 'error',
                    backdrop: false
                });
                reject(error);
            }
        });
    }

    function drawSegmentedLine(ctx, x1, y1, x2, y2, alpha) {
        ctx.setLineDash([10, 5]);

        const midX1 = x1 + (x2 - x1) * 0.49;
        const midY1 = y1 + (y2 - y1) * 0.49;
        const midX2 = x1 + (x2 - x1) * 0.51;
        const midY2 = y1 + (y2 - y1) * 0.51;

        ctx.lineWidth = 1.5;
        ctx.setLineDash([10, 5]);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(midX1, midY1);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(midX1, midY1);
        ctx.lineTo(midX2, midY2);
        ctx.stroke();

        ctx.lineWidth = 1.5;
        ctx.setLineDash([10, 5]);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(midX2, midY2);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
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
    let isAnimating = false;
    let animationTimestamp = 0;

    function animatePovNorth() {
        if (!viewer) getViewer();

        const startTime = Date.now();
        animationTimestamp = startTime;

        const currentPov = viewer.getPov();
        const currentZoom = viewer.getZoom();

        const isHeadingZero = currentPov.heading % 360 === 0 || isAnimating;
        const targetPov = {
            heading: 0,
            pitch: isHeadingZero ? -90 : 0,
        };

        if (Math.abs(targetPov.heading - currentPov.heading) > 180) {
            targetPov.heading += 360;
        }

        const transitionDuration = 4 * Math.max(Math.abs(targetPov.heading - currentPov.heading), 100);
        let previousTimestamp = null;

        function updatePov(timestamp) {
            if (animationTimestamp !== startTime) return;
            if (!previousTimestamp) previousTimestamp = timestamp;

            const progress = Math.min((timestamp - previousTimestamp) / transitionDuration, 1);
            const easing = 1 - Math.pow(1 - progress, 3);

            const newHeading = currentPov.heading + (targetPov.heading - currentPov.heading) * easing;
            const newPitch = currentPov.pitch + (targetPov.pitch - currentPov.pitch) * easing;

            viewer.setPov({ heading: newHeading, pitch: newPitch });
            viewer.setZoom(currentZoom + (0 - currentZoom) * easing);

            if (progress < 1) {
                requestAnimationFrame(updatePov);
            } else {
                isAnimating = false;
            }
        }

        isAnimating = true;
        requestAnimationFrame(updatePov);
    }
    window.addEventListener('popstate', function(event) {
        const container = document.getElementById('coordinates-container');
        if (container) {
            container.remove();
        }
    });

    XMLHttpRequest.prototype.originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        this.originOpen(method, url, async, user, pass);
    };

    let clearMode;
    let clearStyle;
    let onFocus;
    const focus_canvas = document.createElement("canvas");
    focus_canvas.style.zIndex=0
    focus_canvas.style.position = "fixed";
    focus_canvas.style.top = "0";
    focus_canvas.style.left = "0";
    focus_canvas.style.width = "100vw";
    focus_canvas.style.height = "100vh";
    focus_canvas.style.pointerEvents = "none";

    focus_canvas.width = window.innerWidth;
    focus_canvas.height = window.innerHeight;
    const ctx = focus_canvas.getContext("2d");

    drawSegmentedLine(ctx, 0, 0, focus_canvas.width, focus_canvas.height,0.9);
    drawSegmentedLine(ctx, focus_canvas.width, 0, 0, focus_canvas.height,0.9);


    let onKeyDown =async (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        /*if (e.key === 'K' || e.key === 'k'){
        }*/
        if (e.shiftKey&&(e.key === 'r' || e.key === 'R')) {
            e.stopImmediatePropagation();
            localStorage.removeItem('address_source')
            localStorage.removeItem('api_key')
            Swal.fire({title:'清除成功',
                       backdrop:null,
                       text:'获取地址信息的来源已重置，您的API密钥已从缓存中清除，请刷新页面后重新选择。',
                       icon:'success'});
        }
        else if (e.key === 'm' || e.key === 'M') {
            e.stopImmediatePropagation();
            if (isMapDisplay){
                guideMap.style.display='none'
                isMapDisplay=false
            }
            else{
                guideMap.style.display='block'
                isMapDisplay=true
            }
        }
        else if(e.key=='h'||e.key=='H'){
            if(!clearMode){
                clearStyle = GM_addStyle(`
    #panels {display: none !important}
    #guide-map {display: none !important}
    button {display: none !important}
    .gmnoprint.SLHIdE-sv-links-control {display: none !important}
    .gm-compass {display: none !important}
    .verson___kI92b {display: none !important}
    .navigate___xl6aN {display: none !important}
    img[src="https://webmap0.bdimg.com/wolfman/static/pano/images/pano-logo_7969e0c.png"] {opacity: 0 !important}
`);
                clearMode=true
            }
            else {
                clearMode=false
                clearStyle.remove()
            }
        }
        else if (e.key.toLowerCase() === 'x'){
            if (!onFocus){
                onFocus=true
                document.body.appendChild(focus_canvas)
            }
            else{
                onFocus=false
                document.body.removeChild(focus_canvas)
            }
        }
        else if (e.key.toLowerCase() === 'f') {
            e.stopImmediatePropagation();
            if(globalLat&&globalLng&&globalTimestamp){
                const sunPosition=SunCalc.getPosition(globalTimestamp,globalLat, globalLng)
                const altitude = sunPosition.altitude;
                const azimuth = sunPosition.azimuth;
                const altitudeDegrees = altitude * (180 / Math.PI);
                const azimuthDegrees = azimuth * (180 / Math.PI);
                viewer.setPov({heading:azimuthDegrees+180,pitch:altitudeDegrees})
                viewer.setZoom(1)
            }
        }
        else if (e.key.toLowerCase() === 'g') {
            e.stopImmediatePropagation();
            if(globalLat&&globalLng&&globalTimestamp){
                const moonPosition=SunCalc.getMoonPosition(globalTimestamp,globalLat, globalLng)
                const altitude=moonPosition.altitude
                const azimuth = moonPosition.azimuth;
                const altitudeDegrees = altitude * (180 / Math.PI);
                const azimuthDegrees = azimuth * (180 / Math.PI);
                viewer.setPov({heading:azimuthDegrees+180,pitch:altitudeDegrees})
                viewer.setZoom(1)
            }
        }
        else if ((e.ctrlKey) && e.key.toLowerCase() === 'v'){
            navigator.clipboard.readText().then(function(text) {
                if(provider=='tencent'&&text.length!=23)return
                else if(provider=='baidu'&&text.length!=27) return
                else if(provider=='google'&&![64,44,22].includes(text.length)) return
                if(text.length==44)text=b64Enode(text)
                previousPin=null
                isJump=true
                viewer.setPano(text)
                globalPanoId=viewer.pano
            }).catch(function(err) {
                console.error('读取剪贴板失败: ', err);
            });
        }
        else if (e.key.toLowerCase() === 'n') animatePovNorth();

    }

    document.addEventListener("keydown", onKeyDown);
})();