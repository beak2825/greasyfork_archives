// ==UserScript==
// @name         Map-Making Shortcuts
// @namespace    https://greasyfork.org/users/1179204
// @description  use shortcut to help you mapping on map-making app
// @version      1.4.9
// @license      BSD 3-Clause
// @author       KaKa
// @match        *://map-making.app/maps/*
// @grant        GM_addStyle
// @icon         https://www.svgrepo.com/show/521871/switch.svg
// @downloadURL https://update.greasyfork.org/scripts/503430/Map-Making%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/503430/Map-Making%20Shortcuts.meta.js
// ==/UserScript==
(function(){
    /* ------------------------------------------------------------------------------- */
    /* ----- KEYBOARD SHORTCUTS (MUST Refresh PAGE FOR CHANGES TO TAKE EFFECT) -------- */
    /* ------------------------------------------------------------------------------- */

    const KEYBOARD_SHORTCUTS = {
        // Single key
        switchLoc: 'Q',

        rewindLoc: 'E',

        deleteLoc: 'C',

        closeAndSaveLoc: 'V',

        copyLoc:'G',

        hideElement:'H',

        deSelectAll:'Z',

        pruneDuplicates:'P',

        tagDialog:'T',

        // SHIFT key is need
        deleteTags:'B',

        resetGulf:'M',

        classicMap:'N',

        GeoguessrModal: 'G',

        findLinkPanos:'K',

        exportAsCsv: 'D',

        fullScreenMap:'F',
    };


    /* ############################################################################### */
    /* ##### DON'T MODIFY ANYTHING BELOW HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
    /* ############################################################################### */


    let selections,currentIndex
    let mapListener
    let isDrawing, isShift,isCtrl,isApplied,isASV,isYSV,isHidden,isOpen,refreshScheduled
    let startX, startY, endX, endY
    let modal, mapInfo
    let selectionBox
    let style
    let actionIndex=-1
    let currentNumberKey = null;
    let shiftPressed = false;
    let overlay = null;
    let originalParent = null;
    let originalNextSibling = null;
    let tagContainer = null;
    let shortcuts = loadShortcuts();

    GM_addStyle(`
    .tag[data-shortcut-bound] {
      box-shadow: inset 0 0 0 3px rgb(0, 102, 255) !important;
    }
  `)
    function exportAsCsv(locs){
        const csvContent = jsonToCSV(locs);
        downloadCSV(csvContent);
    }

    function downloadCSV(csvContent, fileName = "output.csv") {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    function getTagsForRow(item, maxTags) {

        const tags = item.tags || [];
        return Array.from({ length: maxTags }, (_, index) => tags[index] || '');
    }

    function getFormattedDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }

    function getMaxTagCount(jsonData) {
        let maxTags = 0;
        jsonData.forEach(item => {
            if (item.tags && item.tags.length > maxTags) {
                maxTags = item.tags.length;
            }
        });
        return maxTags;
    }

    function jsonToCSV(jsonData) {
        const maxTags = getMaxTagCount(jsonData);
        const tagHeaders = Array.from({ length: maxTags }, (_, i) => `tag${i + 1}`);
        const headers = ["lat", "lng", "panoId", "heading", "pitch", "zoom", "date", ...tagHeaders];
        const rows = jsonData.map(item => {
            const lat = item.location.lat|| '';
            const lng = item.location.lng|| '';
            const panoId = item.panoId|| '';
            const heading = item.heading|| '';
            const pitch = item.pitch|| '';
            const zoom = item.zoom || '';
            const date = getFormattedDate(item.panoDate)||'';
            const tags = getTagsForRow(item, maxTags);

            return [
                lat,
                lng,
                panoId,
                heading,
                pitch,
                zoom,
                date,
                ...tags
            ];
        });

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        return csvContent;
    }

    function switchLoc(locs) {
        const isReview = document.querySelector('.review-header');
        if(isReview){
            const nextBtn = document.querySelector('[data-qa="review-next"]');
            if (nextBtn) {
                nextBtn.click();
            }
        }
        else{
            if(editor.currentLocation) editor.closeLocation(editor.currentLocation.updatedProps)
            if (!currentIndex) {
                currentIndex =1;
            } else {
                currentIndex +=1
                if (currentIndex>locs.length){
                    currentIndex=1
                }
            }
            editor.openLocation(locs[currentIndex-1]);
            focusOnLoc(locs[currentIndex-1])
        }
    }

    function rewindLoc(locs) {
        const isReview = document.querySelector('.review-header');
        if(isReview){
            const prevBtn = document.querySelector('[data-qa="review-prev"]');
            if (prevBtn) {
                prevBtn.click();
            }
        }
        else{
            if(editor.currentLocation) editor.closeLocation(editor.currentLocation.updatedProps)
            if (!currentIndex) {
                currentIndex =1;
            }
            else {
                currentIndex -=1
                if (currentIndex<1) currentIndex=locs.length
            }
            editor.openLocation(locs[currentIndex-1]);
            //focusOnLoc(locs[currentIndex-1])
        }
    }

    function focusOnLoc(loc){
        map.setCenter(loc.location)
        map.setZoom(16)
    }

    function deleteLoc(loc){
        const isReview = document.querySelector('.review-header');
        if (isReview) {
            const deleteButton = document.querySelector('[data-qa="location-delete"]');
            if (deleteButton) {
                deleteButton.click();
            }
        }
        else editor.closeAndDeleteLocation(loc)
    }

    function copyLoc(){
        editor.addLocation(editor.currentLocation.updatedProps)
    }

    function closeAndSaveLoc(){
        const isReview = document.querySelector('.review-header');
        if (isReview) {
            const saveButton = document.querySelector('[data-qa="location-save"]');
            if (saveButton) {
                saveButton.click();
            }
        }
        else editor.closeLocation(editor.currentLocation.updatedProps)
    }

    function setZoom(z){
        if(z<0)z=0
        if(z>4)z=4
        const svControl=unsafeWindow.streetView
        svControl.setZoom(z)

    }

    async function tagLoc(tag){
        if(editor.currentLocation){
            if(tag) await addTag(tag)
        }
    }

    async function addTag(tag){
        const isReview= document.querySelector('.review-header')
        const prevBtn = document.querySelector('[data-qa="review-prev"]');
        const nextBtn = document.querySelector('[data-qa="review-next"]');
        const currentLoc=editor.currentLocation.location
        const editLoc=editor.currentLocation.updatedProps
        if (isReview) {
            await editor.currentLocation.updatedProps.tags.push(tag)
            setTimeout(() => {
                if (nextBtn) nextBtn.click();
            }, 100);
            setTimeout(() => {
                if (prevBtn)prevBtn.click()
            }, 200);
        }
        else{
            await editor.closeAndDeleteLocation(editor.currentLocation.location)
            editLoc.tags.push(tag)
            await editor.addAndOpenLocation(editLoc)
        }
    }

    function deleteTags() {
        let selections = editor.selections;
        while (selections.length > 0) {
            const item = selections[0];
            const tag = JSON.parse(item.key);
            const tagName = tag.tagName;
            const locations = item.locations;

            editor.deleteTag(tagName, locations);

            selections = editor.selections;
        }
    }

    function customLayer(name,tileUrl,maxZoom,minZoom){
        return new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                return tileUrl
                    .replace('{z}', zoom)
                    .replace('{x}', coord.x)
                    .replace('{y}', coord.y);
            },
            tileSize: new google.maps.Size(256, 256),
            name: name,
            maxZoom:maxZoom,
            minZoom:minZoom||1
        });
    }

    function classicMap(){
        var tileUrl = `https://mapsresources-pa.googleapis.com/v1/tiles?map_id=61449c20e7fc278b&version=15797339025669136861&pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m2!1e0!2sm!3m7!2sen!3sCN!5e1105!12m1!1e3!12m1!1e2!4e0!5m5!1e0!8m2!1e1!1e1!8i47083502!6m6!1e12!2i2!11e0!39b0!44e0!50e0`
        const tileLayer=customLayer('google_labels_reset',tileUrl,20)
        map.mapTypes.stack.layers[0]=tileLayer
        map.setMapTypeId('stack')
    }

    function resetGulf(){
        var tileUrl = `https://maps.googleapis.com/maps/vt?pb=%211m5%211m4%211i{z}%212i{x}%213i{y}%214i256%212m2%211e0%212sm%213m17%212sen%213sMX%215e18%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212ss.e%3Ag%7Cp.v%3Aoff%2Cs.t%3A1%7Cs.e%3Ag.s%7Cp.v%3Aon%2Cs.e%3Al%7Cp.v%3Aon%215m1%215f1.350000023841858`
        if(JSON.parse(localStorage.getItem('mapBoldCountryBorders')))tileUrl=`https://maps.googleapis.com/maps/vt?pb=%211m5%211m4%211i{z}%212i{x}%213i{y}%214i256%212m2%211e0%212sm%213m17%212sen%213smx%215e18%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212ss.t%3A17%7Cs.e%3Ag.s%7Cp.w%3A2%7Cp.c%3A%23000000%2Cs.e%3Ag%7Cp.v%3Aoff%2Cs.t%3A1%7Cs.e%3Ag.s%7Cp.v%3Aon%2Cs.e%3Al%7Cp.v%3Aon%215m1%215f1.350000023841858`
        if(JSON.parse(localStorage.getItem('mapBoldSubdivisionBorders')))tileUrl=`https://maps.googleapis.com/maps/vt?pb=%211m5%211m4%211i{z}%212i{x}%213i{y}%214i256%212m2%211e0%212sm%213m17%212sen%213smx%215e18%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212ss.t%3A18%7Cs.e%3Ag.s%7Cp.w%3A3%2Cs.e%3Al%7Cp.v%3Aoff%2Cs.t%3A1%7Cs.e%3Ag.s%7Cp.v%3Aoff%215m1%215f1.350000023841858`
        if(JSON.parse(localStorage.getItem('mapBoldSubdivisionBorders'))&&JSON.parse(localStorage.getItem('mapBoldCountryBorders')))tileUrl=`https://maps.googleapis.com/maps/vt?pb=%211m5%211m4%211i{z}%212i{x}%213i{y}%214i256%212m2%211e0%212sm%213m17%212sen%213smx%215e18%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212ss.t%3A17%7Cs.e%3Ag.s%7Cp.w%3A2%7Cp.c%3A%23000000%2Cs.t%3A18%7Cs.e%3Ag.s%7Cp.w%3A3%2Cs.e%3Ag%7Cp.v%3Aoff%2Cs.t%3A1%7Cs.e%3Ag.s%7Cp.v%3Aon%2Cs.e%3Al%7Cp.v%3Aon%215m1%215f1.350000023841858`
        const tileLayer=customLayer('google_labels_reset',tileUrl,20)
        map.mapTypes.stack.layers[2]=tileLayer
        map.setMapTypeId('stack')
    }

    function setHW(){
        map.mapTypes.stack.layers.splice(2, 1)
        const tileUrl = `https://maprastertile-drcn.dbankcdn.cn/display-service/v1/online-render/getTile/24.12.10.10/{z}/{x}/{y}/?language=zh&p=46&scale=2&mapType=ROADMAP&presetStyleId=standard&pattern=JPG&key=DAEDANitav6P7Q0lWzCzKkLErbrJG4kS1u%2FCpEe5ZyxW5u0nSkb40bJ%2BYAugRN03fhf0BszLS1rCrzAogRHDZkxaMrloaHPQGO6LNg==`
        const tileLayer=customLayer('Petal_Maps',tileUrl,20)
        map.mapTypes.stack.layers[0]=tileLayer
        map.setMapTypeId('stack')
    }

    function setGD(){
        const tileUrl = `https://t2.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=75f0434f240669f4a2df6359275146d2`
        const tileLayer=customLayer('GaoDe_Terrain',tileUrl,20)
        //map.mapTypes.stack.layers[0]=tileLayer

        const tileUrl_ = `https://t2.tianditu.gov.cn/ibo_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ibo&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=75f0434f240669f4a2df6359275146d2`
        const tileLayer_=customLayer('GaoDe_Border',tileUrl_,10)
        map.mapTypes.stack.layers[1]=tileLayer_

        const _tileUrl = `https://t2.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=75f0434f240669f4a2df6359275146d2`
        const _tileLayer=customLayer('GaoDe_Labels',_tileUrl,20)
        //map.mapTypes.stack.layers[2]=_tileLayer

        map.setMapTypeId('stack')
    }

    function setYandex(){
        const svUrl=`https://core-stv-renderer.maps.yandex.net/2.x/tiles?l=stv&x={x}&y={y}&z={z}&scale=1&v=2025.04.04.20.13-1_25.03.31-4-24330`
        const baseUrl=`https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=5.04.07-2~b:250311142430~ib:250404100358-24371&x={x}&y={y}&z={z}&scale=1&lang=en_US`
        const svLayer=customLayer('Yandex_StreetView',svUrl,20,5)
        const baseLayer=customLayer('Yandex_Maps',baseUrl,20,1)
        map.mapTypes.stack.layers.splice(2, 0,svLayer)
        map.mapTypes.stack.layers.splice(2, 0,baseLayer)
        map.mapTypes.set("stack",map.mapTypes.stack.layers)
        map.setMapTypeId('stack')
    }

    function setApple(){
        const svUrl=`https://lookmap.eu.pythonanywhere.com/bluelines_raster_2x/{z}/{x}/{y}.png`
        const svLayer=customLayer('Apple_StreetView',svUrl,16)
        map.mapTypes.stack.layers.splice(2, 0,svLayer)
        map.setMapTypeId('stack')

    }
    function getBingTilesUrl(tileX, tileY, zoom, type) {
        var quadKey = tileXYToQuadKey(tileX, tileY, zoom);
        const tileUrl=`https://t.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/${quadKey}?it=Z,HC`
        return tileUrl
    }

    function tileXYToQuadKey(tileX, tileY, zoom) {
        var quadKey = '';
        for (var i = zoom; i > 0; i--) {
            var digit = 0;
            var mask = 1 << (i - 1);
            if ((tileX & mask) !== 0) {
                digit += 1;
            }
            if ((tileY & mask) !== 0) {
                digit += 2;
            }
            quadKey += digit.toString();
        }
        return quadKey;
    }
    function setBing(){
        const svLayer = new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                return getBingTilesUrl(coord.x,coord.y,zoom)
                    .replace('{z}', zoom)
                    .replace('{x}', coord.x)
                    .replace('{y}', coord.y);
            },
            tileSize: new google.maps.Size(256, 256),
            name: 'Bing_StreetSide',
            maxZoom:20
        });
        map.mapTypes.stack.layers.splice(2, 0,svLayer)
        map.setMapTypeId('stack')
    }

    async function downloadTile(id,g) {
        try {
            const response = await fetch(`https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${id}&output=tile&x=${g==='Gen4'?18:16}&y=${g==='Gen4'?13:11}&zoom=5&nbt=1&fover=2`);
            const imageBlob = await response.blob();
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const dataUrl = canvas.toDataURL('image/jpeg');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = id+'.jpg';
                link.click();
            };
            img.src = URL.createObjectURL(imageBlob);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function lon2tile(lng,zoom) {
        return (lng+180)/360*Math.pow(2,zoom);
    }

    function lat2tile(lat,zoom){
        return (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom);
    }

    function lonLatToEpsg3395Tile(lng, lat, zoom) {
        return [lon2tile(lng,zoom), lat2tile(lat,zoom)];
    }

    function getMap(){
        let element = document.getElementsByClassName("map-embed")[0]
        try{
            const keys = Object.keys(element)
            const key = keys.find(key => key.startsWith("__reactFiber$"))
            const props = element[key]
            if(!map)window.map=props.pendingProps.children[1].props.children[1].props.map
        }
        catch(e){
            console.error('Failed to get map: '+e)
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function fetchPanorama(service,panoId) {

        await delay(100);
        return await service.getPanorama({ pano: panoId });
    }

    async function findLinkPanos() {
        const startLoc = editor.currentLocation.updatedProps;
        let prevHeading = startLoc.heading;
        let service = new google.maps.StreetViewService();
        let metadata = await fetchPanorama(service,startLoc.panoId);
        while (metadata.data.links.length == 2) {
            let nextLoc = metadata.data.links.find(loc => Math.abs(loc.heading - prevHeading) <= 90);
            if (nextLoc) {
                metadata = await fetchPanorama(service,nextLoc.pano);
                editor.addLocation({
                    location: {
                        lat: metadata.data.location.latLng.lat(),
                        lng: metadata.data.location.latLng.lng()
                    },
                    panoId: metadata.data.location.pano,
                    heading: nextLoc.heading,
                    pitch: 0,
                    zoom: 0,
                    tags: [],
                    flags: 1
                });
                prevHeading = nextLoc.heading;
            }
            else break
        }
    }

    function toggleElementHidden() {
        if(!isHidden){
            style = GM_addStyle(`
    .embed-controls {display: none !important}
    .SLHIdE-sv-links-control {display: none !important}
    [class$="gmnoprint"], [class$="gm-style-cc"] {display: none !important}
  `);
            isHidden = true;
        }
        else{
            style.remove()
            isHidden=false;
        }
    }

    async function checkPano(panoId){
        let service = new google.maps.StreetViewService();
        const data= await service.getPanorama({ pano: panoId })
        return data.data
    }

    function getTileUrl(lat,lng){
        function lon2tile(lng,zoom) {
            return (Math.floor((lng+180)/360*Math.pow(2,zoom)));
        }
        function lat2tile(lat,zoom){
            return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
        }
        const zoom=20
        const tileX=lon2tile(lng,zoom)
        const tileY=lat2tile(lat,zoom)
        return `https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i${zoom}!2i${tileX}!3i${tileY}!2i9!3x1!2m2!1e0!2sm!3m5!2sen!3sus!5e1105!12m1!1e3!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e0`
    }

    function handleNumberKey(key) {
        const tagName = shortcuts[key];
        if(tagName){
            const tagEls = findTagElements(tagName);
            if (tagEls.length>0) {
                const tagEl = tagEls[0];
                if(!editor.currentLocation) tagEl.click()
                const deleteBtn = tagEl.querySelector('.tag__button--delete');
                const addBtn = tagEl.querySelector('.tag__button--add');

                const btnToClick = deleteBtn || addBtn
                if (btnToClick) {
                    btnToClick.click();
                }
            }
            else tagLoc(tagName)}
        else{
            if(!editor.currentLocation){
                const hasBtns = document.querySelectorAll('.tag__text');
                if(hasBtns[key-1])hasBtns[key-1].click()
            }
            const btns = document.querySelectorAll('.tag__button--add');

            if (btns[key - 1]) {
                btns[key - 1].click();
            }
        }
    }

    function refreshAllBadges() {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            const tagName = getTagName(tag);
            const num = Object.entries(shortcuts).find(([k, v]) => v === tagName)?.[0];
            if (num) {
                applyBadge(tag, num);
                markTagHighlight(tag, true);
            } else {
                removeBadge(tag);
                markTagHighlight(tag, false);
            }
        });
    }

    function getStorageKey() {
        const parts = location.pathname.split('/');
        const idx = parts.indexOf('maps');
        const mapId =idx >= 0 && idx + 1 < parts.length ? parts[idx + 1] : 'default';
        return `tagShortcuts_${mapId}`
    }

    function loadShortcuts() {
        try {
            return JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
        } catch {
            return {};
        }
    }

    function saveShortcuts() {
        localStorage.setItem(getStorageKey(), JSON.stringify(shortcuts));
    }

    function getTagName(tag) {
        const selectors = ['.tag__text', '.tag__text-container', 'label[for]', 'span'];
        for (const sel of selectors) {
            const el = tag.querySelector(sel);
            if (el) {
                const clone = el.cloneNode(true);
                clone.querySelectorAll(`.tag-shortcut-number, small`).forEach(e => e.remove());
                const name = clone.textContent.trim();
                if (name) return name;
            }
        }
        return tag.textContent.trim().replace(/\s*\d+$/, '');
    }

    function findTagElements(name) {
        if(!name) return[]
        return Array.from(document.querySelectorAll(".tag")).filter(tag => getTagName(tag) === name);
    }

    function markTagHighlight(tag, highlight) {
        if (highlight) {
            tag.setAttribute('data-shortcut-bound', 'true');
        } else {
            tag.removeAttribute('data-shortcut-bound');
        }
    }

    function applyBadge(tagEl, number) {
        if (!tagEl || typeof tagEl.querySelector !== "function") return;

        const selectors = ['.tag__text', '.tag__text-container', 'label[for]', 'span'];
        let container = null;
        for (const sel of selectors) {
            const el = tagEl.querySelector(sel);
            if (el) {
                container = el;
                break;
            }
        }

        if (!container) container = tagEl;

        const existing = container.querySelector('.tag-shortcut-number');
        if (existing) existing.remove();

        const badge = document.createElement('small');
        badge.className = 'tag-shortcut-number';
        badge.textContent = number;

        badge.style.position = 'absolute';
        badge.style.top = '-5px';
        badge.style.right = '-5px';
        badge.style.background = '#FF0000';
        badge.style.color = 'white';
        badge.style.borderRadius = '50%';
        badge.style.width = '18px';
        badge.style.height = '18px';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.fontSize = '0.7rem';
        badge.style.fontWeight = 'bold';
        badge.style.zIndex = '10';
        badge.style.pointerEvents = 'none';

        container.style.position = 'relative';
        container.appendChild(badge);
    }

    function removeBadge(tagEl) {
        const badge = tagEl.querySelector(`.tag-shortcut-number`);
        if (badge) badge.remove();
    }


    function showTagOverlay() {
        const fullscreenParent = document.fullscreenElement
        if (!fullscreenParent || isOpen || document.querySelector('.tag-overlay')) return;

        tagContainer = document.querySelector('.location-preview__tags');
        if (!tagContainer) return;

        overlay = document.createElement('div');
        overlay.className = 'tag-overlay';
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 2147483647;
        display: flex;
        justify-content: center;
        align-items: center;`;
        fullscreenParent.appendChild(overlay);

        const container = document.createElement('div');
        container.className = 'tag-overlay-container';
        container.style.cssText = `
      position: relative;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      background: #1a1a1a;
      border-radius: 12px;
      padding: 20px;
      overflow: auto;
      z-index: 2147483647;
      box-shadow: 0 10px 50px rgba(0, 0, 0, 0.7);
      border: 1px solid #444;
    `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.className = 'tag-overlay-close';
        closeBtn.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: white;
      z-index: 10;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
        });
        closeBtn.addEventListener('click', closeTagOverlay);

        container.appendChild(closeBtn);

        originalParent = tagContainer.parentNode;
        originalNextSibling = tagContainer.nextSibling;

        container.appendChild(tagContainer);
        overlay.appendChild(container);
        tagContainer.classList.add('tag-overlay-content');

        /*setTimeout(() => {
            const input = tagContainer.querySelector('.form-add-tag__input');
            if (input) {
                input.focus();
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);*/

        overlay._escHandler = (e) => {
            if (e.key === 'Escape') {
                closeTagOverlay();
            }
        };
        document.addEventListener('keydown', overlay._escHandler, true);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeTagOverlay();
            }
        });

        isOpen = true;
    }

    function closeTagOverlay() {
        if (!isOpen || !overlay) return;
        if (overlay._escHandler) {
            document.removeEventListener('keydown', overlay._escHandler, true);
        }
        if (tagContainer && originalParent) {
            tagContainer.classList.remove('tag-overlay-content');
            if (originalNextSibling) {
                originalParent.insertBefore(tagContainer, originalNextSibling);
            } else {
                originalParent.appendChild(tagContainer);
            }
        }
        overlay.remove();
        overlay = null;
        isOpen = false;
    }

    function toggleTagOverlay() {
        if (isOpen) {
            closeTagOverlay();
        } else {
            showTagOverlay();
        }
    }

    function toggleGeoguessrModal(){
        const container = document.querySelector('.mapsConsumerUiSceneCoreScene__root');
        if(!modal&&!mapInfo){
            const tileUrl = `https://mapsresources-pa.googleapis.com/v1/tiles?map_id=61449c20e7fc278b&version=15797339025669136861&pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i744503673!3m12!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0!5m2!1e3!5f2!23i47083502!23i56565656!26m2!1e2!1e3`
            modal = document.createElement('div');
            Object.assign(modal.style, {
                position: 'absolute',
                right: '2rem',
                bottom: '1rem',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.8rem',
                opacity:'0.4'
            });
            const map_container = document.createElement('div');
            map_container.id = 'mini-map';
            Object.assign(map_container.style, {
                width: '17rem',
                height: '10.8rem',
                borderRadius: '0.25rem',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                backgroundColor: '#e0e0e0',
                position: 'relative'
            });

            const miniMap = new google.maps.Map(map_container, {
                center: { lat: 0, lng: 0 },
                zoom: 1,
                disableDefaultUI: true,
                gestureHandling: 'none',
                clickableIcons: false,
                mapTypeId: 'roadmap'
            });
            const customMapType = customLayer('geoguessr_map', tileUrl, 20);


            miniMap.mapTypes.set('custom', customMapType);
            miniMap.setMapTypeId('custom');

            const control = document.createElement('div');
            const guess_button = document.createElement('button');
            guess_button.textContent = `PLACE YOUR PIN ON THE MAP`;

            Object.assign(guess_button.style, {
                borderRadius: '3.75rem',
                border: 'none',
                fontSize: '11px',
                width: '17rem',
                height: '2.22rem',
                padding: '0 1.5rem',
                display: 'inline-block',
                textAlign: 'center',
                fontWeight: '1200',
                fontStyle: 'italic',
                backgroundColor: 'black',
                color: '#fff',
                cursor: 'pointer'
            });

            mapInfo = document.createElement('div');
            mapInfo.style.position = 'absolute';
            mapInfo.style.top = '1rem';
            mapInfo.style.right = '0';
            mapInfo.style.zIndex = '9999';

            const wrapper = document.createElement('div');
            Object.assign(wrapper.style, {
                position: 'relative',
                zIndex: '0',
                borderRadius: '0.25rem',
                boxShadow: 'inset 0 1px 0 hsla(0,0%,100%,.15), inset 0 -1px 0 rgba(0,0,0,0.25)',
                background: 'none',
                filter: 'drop-shadow(0 1rem 1rem rgba(0,0,0,0.4))',
                padding: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                color: '#fff',
                fontFamily: 'sans-serif',
            });

            const start = document.createElement('div');
            Object.assign(start.style, {
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '-1rem',
                width: '100%',
                background:'linear-gradient(180deg, rgba(161,155,217,0.6) 0%, rgba(161,155,217,0) 50%), #4b3f72',
                transform: 'skewX(15deg)',
                zIndex: '-1'
            });

            const end = document.createElement('div');
            Object.assign(end.style, {
                position: 'absolute',
                top: '0',
                bottom: '0',
                background:'linear-gradient(180deg, rgba(161,155,217,0.6) 0%, rgba(161,155,217,0) 50%), #4b3f72',
                right: '-1rem',
                width: '100%',
                zIndex: '-1',
                overflow: 'hidden'
            });

            const infoContainer = document.createElement('div');
            infoContainer.style.display = 'flex';
            infoContainer.style.gap = '0.5rem';
            infoContainer.style.marginTop='0.5rem'
            infoContainer.style.zIndex='0'

            function createInfoSection(labelText, valueText) {
                const section = document.createElement('div');
                section.style.marginRight = '0.5rem';

                const label = document.createElement('div');
                label.textContent = labelText;
                Object.assign(label.style, {
                    fontStyle: 'italic',
                    fontWeight: '1200',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    color: '#cbbcf0'
                });

                const value = document.createElement('div');
                value.textContent = valueText;
                Object.assign(value.style, {
                    fontStyle: 'italic',
                    fontWeight: '700',
                    fontSize: '18px',
                    whiteSpace: 'nowrap',
                    color: '#fff'
                });

                section.appendChild(label);
                section.appendChild(value);
                return section;
            }

            infoContainer.appendChild(createInfoSection('Map', 'A Community World'));
            infoContainer.appendChild(createInfoSection('Round', '1 / 5'));
            infoContainer.appendChild(createInfoSection('Score', '0'));
            wrapper.appendChild(start);
            wrapper.appendChild(infoContainer);
            wrapper.appendChild(end);
            mapInfo.appendChild(wrapper);

            modal.appendChild(map_container);
            modal.appendChild(guess_button);
            container.appendChild(mapInfo)
            container.appendChild(modal);
        }
        else{
            container.removeChild(modal)
            container.removeChild(mapInfo)
            modal=null
            mapInfo=null
        }
    }

    let onKeyDown =async (e) => {
        if (e.target.tagName === 'INPUT' || e.target.isContentEditable||!isApplied) {
            return;
        }
        if (e.shiftKey) isShift = true;

        if (e.ctrlKey) isCtrl = true;

        const activeSelections=editor.selections.length > 0 ? editor.selections.flatMap(selection => selection.locations) : locations

        if (e.key >= '1' && e.key <= '9') {
            e.stopImmediatePropagation();
            currentNumberKey = parseInt(e.key);
        }
        if (!e.ctrlKey&&!e.shiftKey&&!e.metaKey&&e.key.toLowerCase()=== KEYBOARD_SHORTCUTS.tagDialog.toLowerCase()) {
            e.stopImmediatePropagation();
            toggleTagOverlay();
        }

        if (!e.shiftKey&&!e.ctrlKey&&(e.key === KEYBOARD_SHORTCUTS.hideElement || e.key === KEYBOARD_SHORTCUTS.hideElement.toLowerCase())) {
            e.stopImmediatePropagation();
            toggleElementHidden()
        }

        else if (!e.shiftKey&&!e.ctrlKey&&(e.key === KEYBOARD_SHORTCUTS.deSelectAll || e.key === KEYBOARD_SHORTCUTS.deSelectAll.toLowerCase())) {
            e.stopImmediatePropagation();
            editor.resetSelections()
        }

        else if (!e.shiftKey&&!e.ctrlKey&&(e.key === KEYBOARD_SHORTCUTS.copyLoc || e.key === KEYBOARD_SHORTCUTS.copyLoc.toLowerCase())) {
            e.stopImmediatePropagation();
            copyLoc()
        }

        else if (e.key === KEYBOARD_SHORTCUTS.switchLoc || e.key === KEYBOARD_SHORTCUTS.switchLoc.toLowerCase()) {
            e.stopImmediatePropagation();
            switchLoc(activeSelections)
        }

        else if (e.key === KEYBOARD_SHORTCUTS.rewindLoc || e.key === KEYBOARD_SHORTCUTS.rewindLoc.toLowerCase()) {
            e.stopImmediatePropagation();
            rewindLoc(activeSelections)
        }

        else if (!e.shiftKey&&!e.ctrlKey&&(e.key === KEYBOARD_SHORTCUTS.deleteLoc || e.key === KEYBOARD_SHORTCUTS.deleteLoc.toLowerCase())) {
            e.stopImmediatePropagation();
            deleteLoc(activeSelections[currentIndex-1])
        }
        else if (!e.shiftKey&&!e.ctrlKey&&(e.key === KEYBOARD_SHORTCUTS.closeAndSaveLoc || e.key === KEYBOARD_SHORTCUTS.closeAndSaveLoc.toLowerCase())) {
            e.stopImmediatePropagation();
            closeAndSaveLoc()
        }

        else if (e.key === KEYBOARD_SHORTCUTS.pruneDuplicates || e.key === KEYBOARD_SHORTCUTS.pruneDuplicates.toLowerCase()){
            const buttons = document.getElementsByTagName('button');
            const button = Array.from(buttons).find(btn => btn.textContent === 'Find duplicates');
            if(button) button.click()
            let duplicates_before_tag = editor.selections.filter(selection => selection?.key?.includes('dup'));

            if (duplicates_before_tag.length > 0) {
                duplicates_before_tag.forEach((dup) => {
                    const locationsMap = dup.locations.map(loc => loc.location);

                    const allTags = dup.locations.flatMap(loc => loc.tags);
                    const mergedTags = Array.from(new Set(allTags));

                    editor.pruneDuplicates(dup);

                    var prunedLocations = locations.filter(loc => locationsMap.includes(loc.location));

                    mergedTags.forEach(tag => {
                        editor.addTag(prunedLocations, tag);
                        prunedLocations = locations.filter(loc => locationsMap.includes(loc.location));
                    });
                });
            }
        }

        if(e.shiftKey){
            shiftPressed = true;

        if ((e.key === KEYBOARD_SHORTCUTS.GeoguessrModal || e.key === KEYBOARD_SHORTCUTS.GeoguessrModal.toLowerCase())) {
            e.stopImmediatePropagation();
            toggleGeoguessrModal();
            toggleElementHidden();
        }

        else if (e.key === KEYBOARD_SHORTCUTS.exportAsCsv || e.key === KEYBOARD_SHORTCUTS.exportAsCsv.toLowerCase()) {
            e.stopImmediatePropagation();
            exportAsCsv(activeSelections)
        }

        else if (e.key === KEYBOARD_SHORTCUTS.resetGulf || e.key === KEYBOARD_SHORTCUTS.resetGulf.toLowerCase()) {
            e.stopImmediatePropagation();
            resetGulf()
        }

        else if (e.key === KEYBOARD_SHORTCUTS.classicMap || e.key === KEYBOARD_SHORTCUTS.classicMap.toLowerCase()) {
            e.stopImmediatePropagation();
            classicMap()
        }

        else if (e.key === KEYBOARD_SHORTCUTS.deleteTags || e.key === KEYBOARD_SHORTCUTS.deleteTags.toLowerCase()) {
            e.stopImmediatePropagation();
            deleteTags()
        }

        else if (e.key === KEYBOARD_SHORTCUTS.findLinkPanos || e.key === KEYBOARD_SHORTCUTS.findLinkPanos.toLowerCase()) {
            e.stopImmediatePropagation();
            findLinkPanos();
        }

        else if (e.key === KEYBOARD_SHORTCUTS.fullScreenMap || e.key === KEYBOARD_SHORTCUTS.fullScreenMap.toLowerCase()) {
            e.stopImmediatePropagation();
            document.getElementsByClassName("gm-fullscreen-control")[0].click()
        }

        }

        if ((e.shiftKey)&&(e.key === 'h' || e.key === 'H')) {
            e.stopImmediatePropagation();
            setHW()
            //setBing()
        }
        /*if (e.key === 't' || e.key === 'T') {
            e.stopImmediatePropagation();
            getEditor()
            const panos=[]
            for (const loc of selections) {
                const panoId=loc.panoId
                var gen
                if (loc.tags.includes('Gen4')) gen='Gen4'
                if(panoId) panos.push({id:panoId,g:gen})
            }
            const downloadPromises = panos.map(pano => downloadTile(pano.id, pano.g));
            await Promise.all(downloadPromises);

        };*/
    }
    document.addEventListener("keydown", onKeyDown);

    var shortCutButton = document.createElement('button');
    shortCutButton.textContent = 'Shortcut Off';
    shortCutButton.style.position = 'absolute';
    shortCutButton.style.top = '8px';
    shortCutButton.style.right = '700px';
    shortCutButton.style.zIndex = '9999';
    shortCutButton.style.borderRadius = "18px";
    shortCutButton.style.padding = "5px 10px";
    shortCutButton.style.border = "none";
    shortCutButton.style.backgroundColor = "#4CAF50";
    shortCutButton.style.color = "white";
    shortCutButton.style.cursor = "pointer";
    shortCutButton.addEventListener('click', function(){
        if(isApplied){
            isApplied=false
            shortCutButton.style.border='none'
            shortCutButton.textContent = 'Shortcut Off';
        }
        else {isApplied=true
              shortCutButton.textContent = 'ShortCut On';
              shortCutButton.style.border='2px solid #fff'}

    });
    document.body.appendChild(shortCutButton)

    document.addEventListener('keyup', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.isContentEditable||!isApplied) {
            return;
        }

        if (!e.ctrlKey ) isCtrl = false;
        if(!e.shiftKey) isShift=false
        if (e.key >= '1' && e.key <= '9') {
            e.stopImmediatePropagation();
            handleNumberKey(parseInt(e.key))
            currentNumberKey = null;
        }
    });

    document.body.addEventListener('mousedown', (e) => {
        const tagEl = e.target.closest(".tag");
        if (!tagEl) return;
        if (!e.button === 0) return;

        const tagName = getTagName(tagEl);
        if (!tagName) return;
        if (isCtrl) {
            const matched = Object.entries(shortcuts).find(([k, v]) => v === tagName);
            if (matched) {
                const [num] = matched;
                delete shortcuts[num];
                saveShortcuts();
                removeBadge(tagEl);
            }
        } else if (currentNumberKey) {
            for (const [k, v] of Object.entries(shortcuts)) {
                if (parseInt(k) === currentNumberKey || v === tagName) {
                    delete shortcuts[k];
                    const oldTags = findTagElements(v);
                    oldTags.forEach(t => removeBadge(t));
                }
            }
            shortcuts[currentNumberKey] = tagName;
            saveShortcuts();
            applyBadge(tagEl, currentNumberKey);
        }
    }, true);

    document.addEventListener('mousedown', function(e) {
        if (e.button === 0&&isShift) {
            isDrawing = true;
            startX = e.clientX;
            startY = e.clientY;
            document.body.style.userSelect = 'none'
            selectionBox = document.createElement('div');
            selectionBox.style.position = 'absolute';
            selectionBox.style.border = '2px solid rgba(0, 128, 255, 0.7)';
            selectionBox.style.backgroundColor = 'rgba(0, 128, 255, 0.2)';
            document.body.appendChild(selectionBox);
        }

    });

    document.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            endX = e.clientX;
            endY = e.clientY;

            const width = Math.abs(endX - startX);
            const height = Math.abs(endY - startY);
            selectionBox.style.left = `${Math.min(startX, endX)}px`;
            selectionBox.style.top = `${Math.min(startY, endY)}px`;
            selectionBox.style.width = `${width}px`;
            selectionBox.style.height = `${height}px`;
            selectionBox.style.zIndex = '999999';
        }
    });

    document.addEventListener('mouseup', function(e) {
        if (isDrawing) {
            isDrawing = false;
            const rect = selectionBox.getBoundingClientRect();
            document.body.removeChild(selectionBox);
            const elements = document.querySelectorAll('ul.tag-list');
            elements.forEach(element => {
                const childrens = element.querySelectorAll('li.tag.has-button');
                childrens.forEach(child => {
                    const childRect = child.getBoundingClientRect();
                    if (
                        childRect.top >= rect.top &&
                        childRect.left >= rect.left &&
                        childRect.bottom <= rect.bottom &&
                        childRect.right <= rect.right
                    ) {
                        child.click();
                        document.body.style.userSelect = 'text';
                    }
                });
            });
        }
    });

    const observer = new MutationObserver(() => {
        if (refreshScheduled) return;
        refreshScheduled = true;

        setTimeout(() => {
            refreshScheduled = false;
            refreshAllBadges();
        }, 200);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();