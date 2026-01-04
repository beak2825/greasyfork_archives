// ==UserScript==
// @name         Rule34 Favorites Search dev
// @version      5.5
// @description  Adds a search bar to the Favorites page
// @author       Librake
// @namespace    https://discord.gg/jZzYFNeCTw
// @match        https://rule34.xxx/index.php?page=favorites&s=view&id=*
// @match        https://rule34.xxx/index.php?page=post&s=list*
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @icon         https://goo.su/zX0ivG
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498653/Rule34%20Favorites%20Search%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/498653/Rule34%20Favorites%20Search%20dev.meta.js
// ==/UserScript==


// === Version 1.3 Changelog ===
// - Search tags autocomplete in Verbatim mode
// - Sort Score and other sorting options
// - Results pagination
// - Toggle to hide blacklisted images
// - Auto refresh Favorites page if you added new favorites
// - Fixed removing without page reload and script reset
// - Fixed Favorites detection on other pages without rescan



(function () {
    'use strict';


    var inlineLZString = function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();
    /* lz-string.js - JavaScript compression and decompression using LZ-based algorithms. (c) 2013-2015 Pieroxy, MIT License */
    var localLZString;

    function onLZStringReady(event) {
         try {
            if (event && event.detail && event.detail.LZS) {
                localLZString = event.detail.LZS;
            } else {
                localLZString = inlineLZString;
            }
        } catch (error) {
            localLZString = inlineLZString;
        }
    }

    document.addEventListener('LZStringReady', onLZStringReady);

    const scriptElement = document.createElement('script');
    scriptElement.textContent = `
    var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();

    var event = new CustomEvent('LZStringReady', {
        detail: {
            LZS: LZString
        }
    });
    document.dispatchEvent(event);
    `;

    document.head.appendChild(scriptElement);


    const discordLink = "https://discord.gg/jZzYFNeCTw"

    const scriptVersion = '1.3';
    let allImages = [];
    let loadedImages = [];
    let images;
    let results = [];
    let searchTag = "";
    let searchTags = [];
    let negativeTags = [];
    let hardSearch = false;
    let orMode = false;
    let useBlacklist = false;
    let inputTags = [];
    let fromBack = false;
    let needScan = false;
    let fullScan = false;
    let actualFavCount;
    let prevFavCount;
    let loadedTags = [];
    let appendLoadedSave = false;
    let prevUserId;
    let lastImageId;
    let textColor;
    let darkMode = false;
    let userId;
    let isMobile;
    let customIcon = true;
    let borderFavs = true;

    const PageType = {
        FAVORITE_VIEW: 'FAVORITE_VIEW',
        POST_LIST: 'POST_LIST',
        POST_VIEW: 'POST_VIEW',
        UNKNOWN: 'UNKNOWN',
    };

    function getPageType() {
        const url = window.location.href;
    
        if (url.includes('page=favorites&s=view&id=')) {
            return PageType.FAVORITE_VIEW;
        } else if (url.includes('page=post&s=list')) {
            return PageType.POST_LIST;
        } else if (url.includes('page=post&s=view')) {
            return PageType.POST_VIEW;
        } else {
            return PageType.UNKNOWN;
        }
    }

    const pageType = getPageType();

    function getBgColor() {
        const bodyElement = document.querySelector('body');
        const computedStyle = window.getComputedStyle(bodyElement);
        const backgroundColor = computedStyle.backgroundColor;

        return backgroundColor;
    }

    function isMobileVersion() {
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"][type="text/css"][media="screen"]');

        for (let i = 0; i < cssLinks.length; i++) {
            const href = cssLinks[i].getAttribute('href');
            if (href && (href.includes('mobile.css') || href.includes('mobile-dark.css'))) {
                return true;
            }
        }

        return false;
    }

    function isDarkMode() {
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"][type="text/css"][media="screen"]');

        for (let i = 0; i < cssLinks.length; i++) {
            const href = cssLinks[i].getAttribute('href');
            if (href && (href.includes('dark.css'))) {
                return true;
            }
        }

        return false;
    }

    function loadSavedData() {
        const savedInputTags = localStorage.getItem('inputTags');
        loadedTags = savedInputTags ? JSON.parse(savedInputTags) : [];

        const savedHardSearch = localStorage.getItem('hardSearch');
        hardSearch = savedHardSearch ? JSON.parse(savedHardSearch) : true;
        const savedOrMode = localStorage.getItem('orMode');
        orMode = savedOrMode ? JSON.parse(savedOrMode) : false;

        const savedBlacklist = localStorage.getItem('useBlacklist');
        useBlacklist = savedBlacklist ? JSON.parse(savedBlacklist) : false;

        const savedCustomIcon = localStorage.getItem('customIcon');
        customIcon = savedCustomIcon ? JSON.parse(savedCustomIcon) : true;
        const savedborderFavs = localStorage.getItem('borderFavs');
        borderFavs = savedborderFavs ? JSON.parse(savedborderFavs) : true;

        const savedFromBack = localStorage.getItem('fromBack');
        fromBack = savedFromBack ? JSON.parse(savedFromBack) : false;
        localStorage.removeItem('fromBack');

        const savedPrevFavCount = localStorage.getItem('prevFavCount');
        prevFavCount = (savedPrevFavCount && savedPrevFavCount != 'undefined') ? JSON.parse(savedPrevFavCount) : 0;

        prevUserId = loadSavedUserId();
    }

    function loadSavedUserId() {
        const savedPrevId = localStorage.getItem('userId');
        return (savedPrevId && savedPrevId != 'undefined') ? JSON.parse(savedPrevId) : null;
    }

    function reset() {
        localStorage.clear();
        location.reload();
    }

    function updateIcon(newIconUrl) {
        const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        existingFavicons.forEach(favicon => favicon.parentNode.removeChild(favicon));

        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = newIconUrl;

        document.head.appendChild(link);

        const shortcutIconLink = document.createElement('link');
        shortcutIconLink.rel = 'shortcut icon';
        shortcutIconLink.href = newIconUrl;

        document.head.appendChild(shortcutIconLink);
    }

    function getRemovalQueue() {
        const removalQueue = localStorage.getItem('removalQueue');
        return removalQueue ? JSON.parse(removalQueue) : [];
    }
    function addToRemovalQueue(id) {
        const removalQueue = getRemovalQueue();
        removalQueue.push(id);
        localStorage.setItem('removalQueue', JSON.stringify(removalQueue)); 
    }
    function clearRemovalQueue() {
        localStorage.removeItem('removalQueue');
    }

    function getAdditionalQueue() {
        const data = localStorage.getItem('additionalQueue');
        return data ? JSON.parse(data) : [];
    }
    function addToAdditionalQueue(id) {
        const queue = getAdditionalQueue();
        if (!queue.includes(id)) {
            queue.push(id);
            localStorage.setItem('additionalQueue', JSON.stringify(queue));
        }
    }
    function clearAdditionalQueue() {
        localStorage.removeItem('additionalQueue');
    }
    function removeFromAdditionalQueue(id) {
        const additionalQueueData = localStorage.getItem('additionalQueue');
        const additionalQueue = additionalQueueData ? JSON.parse(additionalQueueData) : [];
    
        const index = additionalQueue.indexOf(id);
        if (index !== -1) {
            additionalQueue.splice(index, 1);
    
            localStorage.setItem('additionalQueue', JSON.stringify(additionalQueue));
    
        } else {
        }
    }
    
    function getThumbImgId(img) {
        return img.src.split('?')[1]
    }
    
    function loadAllImagesFromLocalStorage(callback) {
        try {
            const storedData = localStorage.getItem('allImages');
            if (!storedData) {
                callback([]);
                return;
            }

            const decompressedData = localLZString.decompressFromUTF16(storedData);

            const loadedAllImages = decompressedData ? JSON.parse(decompressedData) : [];

            callback(loadedAllImages);
        }
        catch (e) {
            callback([]);
        }
    }

    function saveAllImagesToLocalStorage() {
        const allImagesData = [];
        allImagesData.push(...allImages.map(img => ({
            src: img.getAttribute('src'),
            title: img.getAttribute('title'),
            link: `index.php?page=post&s=view&id=${getThumbImgId(img)}`,
            id: getThumbImgId(img),
            score: img.score
        })));

        if (appendLoadedSave) {
            allImagesData.push(...loadedImages.map(img => ({
                src: img.src,
                title: img.title,
                link: img.link,
                id: img.id,
                score: img.score
            })));
        }

        const jsonStr = JSON.stringify(allImagesData);

        const compressedData = localLZString.compressToUTF16(jsonStr);
        try {
            localStorage.setItem('allImages', compressedData);
        } catch (e) {
            console.error("Storage limit exceeded: ", e);
        }
    }

    function getIdFromUrl() {
        var url = window.location.href;
        var idIndex = url.indexOf("id=");
        if (idIndex !== -1) {
            var idStartIndex = idIndex + 3;
            var idEndIndex = url.indexOf("&", idStartIndex);
            if (idEndIndex === -1) {
                idEndIndex = url.length;
            }
            var id = url.substring(idStartIndex, idEndIndex);
            return id;
        }
        return null;
    }

    async function getFavoritesCount(userId) {
        const url = `https://rule34.xxx/index.php?page=account&s=profile&id=${userId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const favoritesRow = Array.from(doc.querySelectorAll('tr')).find(row =>
                row.querySelector('td strong')?.textContent.trim() === 'Favorites'
            );

            if (!favoritesRow) {
                throw new Error('Favorites row not found');
            }

            const favoritesCount = favoritesRow.querySelector('td a')?.textContent.trim();
            return favoritesCount ? parseInt(favoritesCount, 10) : null;
        } catch (error) {
            console.error('Error fetching favorites count:', error);
            return null;
        }
    }

    function displayScanStatus(text) {
        document.getElementById('progress').textContent = text;
    }


    const SearchInputModule = (() => {
        let currentFocus;
        let searchInput = document.getElementById('searchTagInput');
        let autocompleteOpen = false;
        const inputWrapper = createSearchInputField();

        function search() {
            searchTags.length = 0;
            negativeTags.length = 0;
            inputTags = inputWrapper.querySelector('input').value.trim().split(' ');
            inputTags = inputTags.map(tag => tag.toLowerCase());
            inputTags.forEach(tag => {
                if (tag.startsWith('-')) {
                    negativeTags.push(tag.substring(1));
                } else if (tag.length > 0) {
                    searchTags.push(tag);
                }
            });
            scan();
        }

        function handleSearchBar(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                search();
            }
        }
        function createAutocomplete() {
            const autocomplete = document.createElement('div');
            autocomplete.id = 'autocomplete-list';
            autocomplete.className = 'autocomplete-items';
            autocomplete.style.position = 'absolute';
            autocomplete.style.zIndex = '9999';
            autocomplete.style.backgroundColor = darkMode ? "rgb(48, 48, 48)" : 'rgba(182, 232, 176, 0.8)';
            autocomplete.style.backgroundColor = darkMode ? "rgb(48, 48, 48)" : 'white';
            autocomplete.style.color = 'black';
            autocomplete.style.border = '1px solid #ccc';
            autocomplete.style.padding = '5px';



            return autocomplete;
        }
        function handleAutoComplete(event) {
            let value = this.value;
            if (!value || value.length === 0) {
                closeAllLists();
                return false;
            }

            const lastChar = value.slice(-1);
            if (lastChar === ' ') value = '';

            value = value.trim().split(' ').pop();
            let hasMinus = false;

            if (value[0] === '-') {
                hasMinus = true;
                value = value.substr(1);
            }

            closeAllLists();
            currentFocus = -1;


            fetch(`https://ac.rule34.xxx/autocomplete.php?q=${value}`)
                .then(response => response.json())
                .then(data => {
                    closeAllLists();
                    autocompleteOpen = true;
                    const autocomplete = createAutocomplete();
                
                    this.parentNode.appendChild(autocomplete);
                    if (data.length === 0) {
                        autocomplete.remove();
                        return false;
                    }
                    data.forEach(item => {
                        const option = document.createElement('div');
                        option.classList.add(`tag-type-${item.type}`);
                        
                        const mark = document.createElement('mark');
                        mark.textContent = item.label.substr(0, value.length);
                        mark.style.backgroundColor = darkMode ? 'rgba(82, 82, 20, 0.8)' : 'rgba(255, 255, 0, 0.7)';
                        mark.style.padding = '0';

                        const remainingText = document.createTextNode(item.label.substr(value.length));
                        option.innerHTML = '';
                        option.appendChild(mark);
                        option.appendChild(remainingText);

                        option.style.cursor = 'pointer';
                        option.style.padding = isMobile ? '5px 0' : '3px 0';
                        option.style.display = 'flex';
                        option.style.alignItems = 'center';
                        option.style.justifyContent = 'flex-start';

                        option.innerHTML += `<input type="hidden" value="${item.value}">`;
                        option.addEventListener('click', function(e) {
                            const optionValue = hasMinus ? `-${this.getElementsByTagName('input')[0].value}` : this.getElementsByTagName('input')[0].value;
                            const tags = searchInput.value.split(' ');
                            tags.pop();
                            tags.push(optionValue);
                            tags.push('');
                            searchInput.value = tags.join(' ');
                            closeAllLists();
                        });
                        option.addEventListener('mouseover', function() {
                            const items = autocomplete.getElementsByTagName('div');
                            for (let i = 0; i < items.length; i++) {
                                items[i].style.backgroundColor = '';
                                items[i].style.textShadow = '';
                            }

                            this.style.backgroundColor = darkMode ? '#505a50' : 'hsl(0, 0.00%, 90.60%)';
                            if (darkMode) this.style.textShadow = "1px 1px 1px #000,-1px -1px 1px #000,1px -1px 1px #000,-1px 1px 1px #000";
                            currentFocus = Array.prototype.indexOf.call(items, this);
                            autocompleteOpen = true;
                        });
                        option.addEventListener('mouseleave', function() {
                            this.style.textShadow = '';
                            this.style.backgroundColor = '';
                        });
                        autocomplete.appendChild(option);
                    });
                });
        }
        function handleAutocompleteSelection(event) {

            let list = document.getElementById('autocomplete-list');
            if (list) {
                list = list.getElementsByTagName('div');
            }
            if (event.key === 'ArrowDown') {
                autocompleteOpen = true;
                currentFocus++;
                addActive(list, currentFocus);
            } else if (event.key === 'ArrowUp') {
                autocompleteOpen = true;
                currentFocus--;
                addActive(list, currentFocus);
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (currentFocus > -1) {
                    if (list) {
                        list[currentFocus].click();
                    } else {
                        search();
                    }
                } else if (currentFocus === -1) {
                    search();
                }
            } else if (event.key === 'Tab') {
                event.preventDefault();
                if (currentFocus > -1) {
                    if (list) {
                        list[currentFocus].click();
                    }
                }
            }
        }
        function handleAutocompleteClear(event) {
                const value = this.value;
                if (!value || value.length === 0) {
                    closeAllLists();
                    return false;
                }
        }
        function initAutoComplete(searchInput) {
            inputWrapper.querySelector('input').removeEventListener('keyup', handleSearchBar, true);
            searchInput.addEventListener('input',handleAutoComplete , 'autocomplete');
            searchInput.addEventListener('keydown',handleAutocompleteSelection , 'autocomplete');
    
            searchInput.addEventListener('keyup', handleAutocompleteClear, 'autocomplete');
    
            document.addEventListener('click', function(event) {
                closeAllLists(event.target);
            }, 'autocomplete');

            if (darkMode) {
                const style = document.createElement('style');
                style.textContent = `
                    .tag-type-artist > a, 
                    a.tag-type-artist, 
                    .tag-type-artist > a:hover, 
                    a.tag-type-artist:hover, 
                    .tag-type-artist {
                        color: var(--c-link-artist) !important;
                    }
                    .tag-type-copyright > a, 
                    a.tag-type-copyright, 
                    .tag-type-copyright > a:hover, 
                    a.tag-type-copyright:hover, 
                    .tag-type-copyright {
                        color: var(--c-link-copyright) !important;
                    }
                    .tag-type-character > a, 
                    a.tag-type-character, 
                    .tag-type-character > a:hover, 
                    a.tag-type-character:hover, 
                    .tag-type-character {
                        color: var(--c-link-character) !important;
                    }
                    .tag-type-metadata > a, 
                    a.tag-type-metadata, 
                    .tag-type-metadata > a:hover, 
                    a.tag-type-metadata:hover, 
                    .tag-type-metadata {
                        color: var(--c-link-metadata) !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        function addActive(list, currentFocus) {
            if (!list) {
                return false;
            }
            removeActive(list);
            if (currentFocus >= list.length) {
                currentFocus = 0;
            }
            if (currentFocus < 0) {
                currentFocus = list.length - 1;
            }

            list[currentFocus].style.backgroundColor = darkMode ? '#505a50' : 'hsl(0, 0.00%, 90.60%)';
            if (darkMode) list[currentFocus].style.textShadow = "1px 1px 1px #000,-1px -1px 1px #000,1px -1px 1px #000,-1px 1px 1px #000";
        }
        function removeActive(list) {
            for (let i = 0; i < list.length; i++) {
                list[i].style.backgroundColor = '';
                if (darkMode) list[i].style.textShadow = '';
            }
        }
    
        function closeAllLists() {
            const items = document.getElementsByClassName('autocomplete-items');
            for (let i = 0; i < items.length; i++) {
                items[i].parentNode.removeChild(items[i]);
            }
            autocompleteOpen = false;
        }
        function destroyAutocomplete(searchInput, inputWrapper) {
            searchInput.removeEventListener('input', handleAutoComplete, 'autocomplete');
            searchInput.removeEventListener('keydown', handleAutocompleteSelection, 'autocomplete');
            searchInput.removeEventListener('keyup', handleAutocompleteClear, 'autocomplete');
            closeAllLists();
            inputWrapper.querySelector('input').addEventListener('keyup', handleSearchBar, true);
        }

        function createSearchInput() {
            const header = document.getElementById('header');
            const navbar = document.getElementById('navbar');

            const inputContainer = document.createElement('div');
            inputContainer.style.marginLeft = '20px';

            const helpContainer = createHelpTooltip(isMobile ? -20 : 0);
            const settingsContainer = createSettings();
            const createToggleElement = isMobile ? createToggleButton : createCheckbox;

            const verbatimModeButtonTitle = isMobile ? 'Verbatim' : 'Verbatim mode';
            const verbatimModeContainer = createToggleElement('verbatimModeCheckbox', verbatimModeButtonTitle, hardSearch, (checked) => {
                hardSearch = checked;
                if (checked === false) {
                    toggleActiveState(useBlacklistContainer, false);
                    destroyAutocomplete(searchInput, inputWrapper);
                    localStorage.setItem('useBlacklist', JSON.stringify(false));
                }
                if (checked === true) {
                    initAutoComplete(searchInput);
                }
                localStorage.setItem('hardSearch', JSON.stringify(checked));
            });
            

            const orModeButtonTitle = isMobile ? 'Or' : 'Or mode';
            const orModeContainer = createToggleElement('orMode', orModeButtonTitle, orMode, (checked) => {
                orMode = checked;
                localStorage.setItem('orMode', JSON.stringify(checked));
            });

            const useBlacklistContainer = createToggleElement('useBlacklist', 'Use blacklist', useBlacklist, (checked) => {
                useBlacklist = checked;

                if (checked === true) {
                    if (!hardSearch) {
                        hardSearch = true;
                        initAutoComplete(searchInput);
                        toggleActiveState(verbatimModeContainer, true);
                        localStorage.setItem('hardSearch', JSON.stringify(checked));
                    }
                }
                localStorage.setItem('useBlacklist', JSON.stringify(checked));
            });
            function toggleActiveState(element, isActive) {
                if (isMobile) {
                    element.childNodes[0].style.backgroundColor = isActive ? '#2196F3' : '#e0e0e0';
                    element.childNodes[0].style.color = isActive ? '#fff' : '#555';
                } else {
                    element.childNodes[0].checked = isActive;
                }
            }
            

            const searchButton = createSearchButton(() => {
                search();
            });

            const progress = document.createElement('span');
            progress.id = 'progress';
            progress.style.marginLeft = '10px';

            if (isMobile) {
                const container1 = document.createElement('div');
                container1.style.display = 'flex';
                container1.style.position = 'relative';
                container1.style.width = 'calc(100% - 10px - 20px)';
                container1.style.maxWidth = '430px';
                container1.style.marginLeft = '10px';
                container1.style.alignItems = 'center';

                progress.style.position = 'absolute';
                progress.style.right = '20px';

                settingsContainer.style.marginRight = '20px';

                container1.appendChild(settingsContainer);
                container1.appendChild(helpContainer);
                container1.appendChild(progress);

                inputContainer.appendChild(container1);

                const container2 = document.createElement('div');
                container2.appendChild(inputWrapper);
                container2.style.marginTop = '10px';

                inputContainer.appendChild(container2);

                const container3 = document.createElement('div');
                container3.style.display = 'flex';
                container3.style.justifyContent = 'space-between';
                container3.style.width = 'calc(100% - 20px)';
                container3.style.maxWidth = '450px';
                container3.style.alignItems = 'center';
                container3.style.marginTop = '10px';


                container3.appendChild(verbatimModeContainer);
                container3.appendChild(orModeContainer);
                container3.appendChild(useBlacklistContainer);
                container3.appendChild(searchButton);
                inputContainer.appendChild(container3);

                const spacer = document.createElement('div');
                spacer.style.height = '10px';
                inputContainer.appendChild(spacer);

            } else {
                inputContainer.style.marginTop = '10px';
                inputContainer.appendChild(helpContainer);
                inputContainer.appendChild(verbatimModeContainer);
                inputContainer.appendChild(orModeContainer);
                inputContainer.appendChild(useBlacklistContainer);
                inputContainer.appendChild(inputWrapper);
                inputContainer.appendChild(searchButton);
                inputContainer.appendChild(settingsContainer);
                inputContainer.appendChild(progress);
            }

            header.insertBefore(inputContainer, navbar.nextSibling);


            if (loadedTags.length > 0) {
                inputWrapper.querySelector('input').value = loadedTags.join(' ');
            }

            const spans = document.querySelectorAll('span');
            spans.forEach(span => {
                if (span.textContent.trim() === 'Help & Info') {
                    const computedStyle = getComputedStyle(span);
                    const currentColor = computedStyle.color;
                    textColor = currentColor;
                    if (currentColor !== 'rgb(0, 0, 0)') {
                        darkMode = true;
                    }
                }
            });
            if (hardSearch === true) initAutoComplete(searchInput);
            else destroyAutocomplete(searchInput, inputWrapper);

        }

        function createSettings() {
            const settingsContainer = document.createElement('div');
            settingsContainer.style.display = 'inline-block';
            settingsContainer.style.marginRight = '10px';
            settingsContainer.style.position = 'relative';

            const label = document.createElement('span');
            const img = document.createElement('img');
            const icon = 'https://raw.githubusercontent.com/Librake/Favorites-Search/main/res/settings.svg';
            const iconDark = 'https://raw.githubusercontent.com/Librake/Favorites-Search/main/res/settings_dark.svg';
            img.src = darkMode ? iconDark : icon;
            img.alt = 'S';

            const labelSize = isMobile ? 30 : 22;
            img.style.width = `${labelSize}px`;
            img.style.height = `${labelSize}px`;
            img.style.fill = 'red';
            label.appendChild(img);
            label.style.fontWeight = 'bold';
            label.style.textDecoration = 'underline';
            label.style.cursor = 'pointer';

            const tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.top = '100%';
            tooltip.style.left = '0';
            tooltip.style.paddingTop = '10px';
            tooltip.style.paddingRight = '30px';
            tooltip.style.paddingBottom = '15px';
            tooltip.style.paddingLeft = '20px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.backgroundColor = '#333';
            tooltip.style.color = '#fff';
            tooltip.style.whiteSpace = 'normal';
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.2s';
            tooltip.style.maxWidth = 'calc(100vw - 30px)';
            tooltip.style.height = 'auto';
            tooltip.style.maxHeight = '400px';
            tooltip.style.marginTop = '9px';
            tooltip.style.zIndex = '9999';
            tooltip.style.overflowX = 'auto';

            if (darkMode) {
                tooltip.style.border = '1px solid #fff';
            }

            function adjustTooltipPosition() {
                const rect = tooltip.getBoundingClientRect();
                const cont = settingsContainer.getBoundingClientRect();

                const offset = -150;
                const width = 500;
                let addOffset = 0;

                if (isMobile) {
                    tooltip.style.width = 'calc(100vw - 30px)';
                    tooltip.style.maxWidth = '450px';

                    addOffset = -(cont.left + offset) + 20;
                }
                else {
                    tooltip.style.width = `${width-50}px`;

                    if (cont.left + offset + width + 30 > window.innerWidth) {
                        addOffset = -(cont.left + offset + width - window.innerWidth) - 30;
                    }

                    if (cont.left + offset < 0) {
                        addOffset = -(cont.left + offset) + 20;
                    }

                }
                tooltip.style.marginLeft = `${offset + addOffset}px`;

            }

            const closeButton = document.createElement('button');
            closeButton.textContent = '\u00D7';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.color = isMobile ? '#E08B82' : '#fff';
            closeButton.style.fontSize = '20px';
            closeButton.style.cursor = 'pointer';

            closeButton.onclick = (event) => {
                event.stopPropagation();
                hideTooltip();
            };

            function createCheckboxWithDescription(labelText, descriptionText, initialState, action) {
                const container = document.createElement('div');
                container.style.marginBottom = '10px';


                const checkbox = createCheckbox(labelText, labelText, initialState, (checked) => {
                    action(checked);
                });

                const description = document.createElement('span');
                description.innerHTML = descriptionText;
                description.style.display = 'block';
                description.style.fontSize = '14px';
                description.style.color = '#999';
                description.style.marginLeft = '30px';

                container.appendChild(checkbox);
                container.appendChild(description);

                return container;
            }

            const checkboxContainer1 = createCheckboxWithDescription(
                'Custom icon',
                'Use custom red icon for the Favorites tab.',
                customIcon,
                (checked) => {
                    customIcon = checked;
                    localStorage.setItem('customIcon', JSON.stringify(checked));
                    location.reload();
                }
            );

            const checkboxContainer2 = createCheckboxWithDescription(
                'Favorites detection',
                'Highlights images with a red border on other pages of the site if they are already in your favorites.<br>(requires scanned)',
                borderFavs,
                (checked) => {
                    borderFavs = checked;
                    localStorage.setItem('borderFavs', JSON.stringify(checked));
                }
            );

            const tooltipText = document.createElement('div');
            tooltipText.innerHTML = "If something doesn't work properly, try to...";

            function updateTooltipMaxHeight() {
                const rect = tooltip.getBoundingClientRect();
                const availableHeight = window.innerHeight - rect.top - 10;
                tooltip.style.maxHeight = `${availableHeight}px`;
            }
            function updateSize() {
                updateTooltipMaxHeight();
                adjustTooltipPosition();
            }
            updateTooltipMaxHeight();
            window.addEventListener('resize', updateSize);

            tooltip.appendChild(closeButton);
            if(!isMobile) {
                tooltip.appendChild(checkboxContainer1);
            }
            tooltip.appendChild(checkboxContainer2);

            let tooltipVisible = false;

            label.onclick = (event) => {
                event.stopPropagation();
                if (tooltipVisible) {
                    hideTooltip();
                } else {
                    showTooltip();
                }
            };

            setTimeout(function() {
                const spans = document.querySelectorAll('span');
                spans.forEach(span => {
                    if (span.textContent.trim() === 'Help & Info') {
                        span.addEventListener('mouseover', () => {
                            hideTooltip();
                        });
                    }
                });
            }, 300);


            document.addEventListener('click', (event) => {
                if (tooltipVisible && !tooltip.contains(event.target) && event.target !== label) {
                    hideTooltip();
                }
            });

            settingsContainer.appendChild(label);
            settingsContainer.appendChild(tooltip);

            return settingsContainer;

            function showTooltip() {
                adjustTooltipPosition();
                label.style.color = '#CC0000';
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
                tooltipVisible = true;

                img.style.transform = 'rotate(10deg)';
            }

            function hideTooltip() {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
                label.style.color = '';
                tooltipVisible = false;

                img.style.transform = 'rotate(0deg)';
            }
            
        
        }

        function createHelpTooltip(offset = 0) {
            const helpContainer = document.createElement('div');
            helpContainer.style.display = 'inline-block';
            helpContainer.style.marginRight = '25px';
            helpContainer.style.position = 'relative';

            const helpText = document.createElement('span');
            helpText.textContent = 'Help & Info';
            helpText.style.fontWeight = 'bold';
            helpText.style.textDecoration = 'underline';

            const tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.top = '100%';
            tooltip.style.left = '0';
            tooltip.style.paddingTop = '10px';
            tooltip.style.paddingRight = '30px';
            tooltip.style.paddingBottom = '15px';
            tooltip.style.paddingLeft = '20px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.backgroundColor = '#333';
            tooltip.style.color = '#fff';
            tooltip.style.whiteSpace = 'normal';
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.2s';
            tooltip.style.width = '550px';
            tooltip.style.maxWidth = 'calc(100vw - 30px)';
            tooltip.style.height = 'auto';
            tooltip.style.maxHeight = '400px';
            tooltip.style.marginTop = '15px';
            tooltip.style.marginLeft = `${offset}px`;
            tooltip.style.zIndex = '9999';
            tooltip.style.overflowX = 'auto';

            if (darkMode) {
                tooltip.style.border = '1px solid #fff';
            }

            function adjustTooltipPosition() {
                const cont = helpContainer.getBoundingClientRect();

                const offset = 0;
                let addOffset = 0;

                if (isMobile) {
                    tooltip.style.width = 'calc(100vw - 30px)';
                    tooltip.style.maxWidth = '450px';

                    addOffset = -(cont.left + offset) + 20;
                }

                tooltip.style.marginLeft = `${offset + addOffset}px`;

            }



            const closeButton = document.createElement('button');
            closeButton.textContent = '\u00D7';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.color = isMobile ? '#E08B82' : '#fff';;
            closeButton.style.fontSize = '20px';
            closeButton.style.cursor = 'pointer';

            closeButton.onclick = () => {
                hideTooltip();
            };


            const content = [
                `<b>Verbatim mode</b> ON - standard search by full tags with autocomplete.`,
                `<b>Verbatim mode</b> OFF - search using keywords instead of tags, you can search by any part of the tag, such as '<span style="color: #EC91FF;">gahara</span>' instead of 'senjou<span style="color: #EC91FF;">gahara</span>_hitagi'.`,
                "<b>Or mode</b> - should search result contain 'any' or 'all' of tags/keywords.",
                "<b>Use blacklist</b> - hide search results with tags stated in your account's blacklist.",
                "Use '-' to exclude tags/keywords.",
                "A full scan takes a while, but it's only needed for the first search or after a reset.",
                "Script doesn't work properly in incognito mode, browser restart clears all cached scanned data.",
                "On the search results page, use the Back button on the screen or Esc instead of the Back button on your browser.",
                `Compatible with <a href="${'https://www.google.com/search?q=Imagus'}" target="_blank" style="color: #7289DA; text-decoration: underline; font-size: 1.2em;">Imagus</a>,
             a very useful extension for Booru sites for full-screen mouse-over image preview.`
            ];

            const list = document.createElement('ul');
            list.style.paddingLeft = '10px';
            list.style.margin = '0';
            list.style.listStyleType = 'disc';

            content.forEach(text => {
                const listItem = document.createElement('li');
                listItem.innerHTML = text;
                listItem.style.padding = '3px';
                listItem.style.margin = '5px 0';
                list.appendChild(listItem);
            });

            tooltip.appendChild(list);

            const tooltipText = document.createElement('div');
            tooltipText.innerHTML = "If smth doesn't work properly try to";

            const discordText = document.createElement('div');
            discordText.innerHTML = `
            <p><p>If you still have some questions or suggestions, visit the project's
            <a href="${discordLink}" target="_blank" style="color: #7289DA; text-decoration: underline; font-size: 1.2em;">Discord</a>.</p>
            <p>You can also find some other useful scripts for Rule34 there.</p>`;

            function updateTooltipMaxHeight() {
                const rect = tooltip.getBoundingClientRect();
                const availableHeight = window.innerHeight - rect.top - 10;
                tooltip.style.maxHeight = `${availableHeight}px`;
            }

            function updateSize() {
                updateTooltipMaxHeight();
                adjustTooltipPosition();
            }
            updateTooltipMaxHeight();

            window.addEventListener('resize', updateSize);


            const resetButton = document.createElement('button');
            resetButton.textContent = 'Reset';
            resetButton.style.backgroundColor = '#e26c5e';
            resetButton.style.color = '#fff';
            resetButton.style.border = 'none';
            resetButton.style.padding = '5px 10px';
            resetButton.style.borderRadius = '5px';
            resetButton.style.cursor = 'pointer';
            resetButton.style.marginTop = '10px';
            resetButton.style.marginLeft = '10px';
            resetButton.style.zIndex = '10000';
            resetButton.onmouseover = () => {
                resetButton.style.backgroundColor = '#c45a4b';
            };
            resetButton.onmouseout = () => {
                resetButton.style.backgroundColor = '#e26c5e';
            };
            resetButton.onclick = reset;

            tooltipText.appendChild(resetButton);
            tooltipText.appendChild(discordText);
            tooltip.appendChild(closeButton);
            tooltip.appendChild(tooltipText);

            let hideTimeout;
            helpText.onmouseover = () => {
                adjustTooltipPosition();

                helpText.style.color = '#CC0000';
                clearTimeout(hideTimeout);
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            };

            const timeToHide = isMobile ? 0 : 300;
            helpText.onmouseout = (event) => {
                hideTimeout = setTimeout(() => {
                    if (!tooltip.contains(event.relatedTarget)) {
                        hideTooltip();
                    }
                }, timeToHide);
            };

            tooltip.onmouseover = () => {
                clearTimeout(hideTimeout);
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            };
            tooltip.onmouseout = (event) => {
                hideTimeout = setTimeout(() => {
                    if (!helpText.contains(event.relatedTarget)) {
                        hideTooltip();
                    }
                }, timeToHide);
            };

            helpContainer.appendChild(helpText);
            helpContainer.appendChild(tooltip);

            return helpContainer;

            function hideTooltip() {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
                helpText.style.color = textColor;
            }
        }

        function createCheckbox(id, labelText, isChecked, onChange) {
            const container = document.createElement('div');
            container.style.display = 'inline-block';
            container.style.marginRight = '25px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.style.marginRight = isMobile ? '15px' : '5px';
            checkbox.style.verticalAlign = 'middle';
            checkbox.checked = isChecked;
            checkbox.onchange = () => onChange(checkbox.checked);

            const label = document.createElement('label');
            label.htmlFor = id;
            label.textContent = labelText;
            label.style.verticalAlign = 'middle';

            container.appendChild(checkbox);
            container.appendChild(label);

            return container;
        }

        function createToggleButton(id, labelText, isActive, onChange) {
            const container = document.createElement('div');
            container.style.display = 'inline-block';

            const toggleButton = document.createElement('button');
            toggleButton.textContent = labelText;
            toggleButton.style.backgroundColor = isActive ? '#2196F3' : '#e0e0e0';
            toggleButton.style.color = isActive ? '#fff' : '#555';
            toggleButton.style.border = 'none';
            toggleButton.style.padding = '5px 8px';
            toggleButton.style.borderRadius = '4px';
            toggleButton.style.cursor = 'pointer';

            toggleButton.onmouseover = () => {
                toggleButton.style.backgroundColor = isActive ? '#1976D2' : '#bdbdbd';
            };
            toggleButton.onmouseout = () => {
                toggleButton.style.backgroundColor = isActive ? '#2196F3' : '#e0e0e0';
            };

            toggleButton.onclick = () => {
                isActive = !isActive;
                toggleButton.style.backgroundColor = isActive ? '#2196F3' : '#e0e0e0';
                toggleButton.style.color = isActive ? '#fff' : '#555';
                onChange(isActive);
            };

            container.appendChild(toggleButton);

            return container;
        }

        function createSearchInputField() {
            const inputWrapper = document.createElement('div');
            inputWrapper.style.position = 'relative';
            inputWrapper.style.display = 'inline-block';
            inputWrapper.style.width = 'calc(100% - 20px)';
            inputWrapper.style.maxWidth = '450px';
            inputWrapper.style.boxSizing = 'border-box';
            inputWrapper.style.marginRight = '10px';


            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Enter tags or parts of tags...';
            input.id = 'searchTagInput';
            input.style.padding = '5px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '3px';
            input.style.width = '100%';
            input.style.boxSizing = 'border-box';
            input.autocomplete = 'off';
            searchInput = input;

            const clearButton = document.createElement('button');
            clearButton.textContent = '\u00D7';
            clearButton.style.border = 'none';
            clearButton.style.background = 'none';
            clearButton.style.fontSize = '25px';
            clearButton.style.cursor = 'pointer';
            clearButton.style.position = 'absolute';
            clearButton.style.right = '7px';
            clearButton.style.top = '50%';
            clearButton.style.transform = 'translateY(-50%)';
            clearButton.style.color = '#ccc';
            clearButton.style.padding = '0';

            clearButton.onclick = () => {
                input.value = '';
                input.focus();
                localStorage.removeItem('inputTags');
            };

            inputWrapper.appendChild(input);
            inputWrapper.appendChild(clearButton);

            return inputWrapper;
        }

        function createSearchButton(onClick) {
            const button = document.createElement('button');
            button.textContent = 'Search';

            button.onclick = onClick;

            button.style.color = 'white';
            button.style.backgroundColor = '#e26c5e';

            if (isMobile) {
                button.style.border = 'none';
                button.style.padding = '10px 20px';
                button.style.borderRadius = '5px';
            } else {
                button.style.marginRight = '10px';
                button.style.padding = '5px 10px';
                button.style.border = '1px solid #ccc';
                button.style.borderRadius = '3px';
                button.style.cursor = 'pointer';
                button.onmouseover = () => {
                    button.style.backgroundColor = '#c45a4b';
                };
                button.onmouseout = () => {
                    button.style.backgroundColor = '#e26c5e';
                };
            }

            return button;
        }

        return {
            createSearchInput
        };
    })();


    function scan() {
        if (needScan) {

            if (fullScan) {
                searchAllPages();
            }
            else {
                searchNewPages();
            }
        }
        else {
            loadAllPages();
        }
    }

    async function fetchFavoritesPage(page) {

        const url = `https://rule34.xxx/index.php?page=favorites&s=view&id=${userId}&pid=${page * 50}`;
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            return doc;
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            return null;
        }
    }
    function getCookieValue(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return match[2];
        }
        return null;
    }
    async function extractImagesAndTags(doc, loadedImgs) {
        const postScores = new Map();

        if (loadedImgs) {
            images = loadedImgs;
        }
        else {
            const scripts = doc.querySelectorAll('script');
            const postRegex = /posts\[(\d+)]\s*=\s*{[\s\S]*?score:\s*['"](\d+)['"]/g;


            scripts.forEach((script) => {
                if (script.textContent.includes('score:')) {
                    const scriptContent = script.textContent;

                    let match;
                    while ((match = postRegex.exec(scriptContent)) !== null) {
                        const postId = match[1];
                        const score = match[2];
                        postScores.set(postId, score);
                    }
                }
            });

            images = doc.querySelectorAll('.thumb img[src]');
        }
        if (useBlacklist) {
            const blacklistedTags = getCookieValue('tag_blacklist');
            if (blacklistedTags) {
                decodeURIComponent(blacklistedTags).split('%20').forEach(tag => {
                    negativeTags.push(tag);
                });
            }
        }
        images.forEach(image => {
            if (!loadedImgs) {
                const imgId = getThumbImgId(image);
                image.score = postScores.get(imgId) || null;
                
                allImages.push(image);
            }

            let tags = '';
            if (hardSearch) {
                tags = image.title.trim().split(' ');
            } else {
                tags = image.title;
            }

            var positived;

            if (orMode) {
                positived = false;
                searchTags.forEach(tag => {
                    if (tags.includes(tag)) {
                        positived = true;
                    }
                });
            }
            else {
                positived = true;
                searchTags.forEach(tag => {
                    if (!tags.includes(tag)) {
                        positived = false;
                    }
                });
            }

            if (searchTags.length == 0) {
                positived = true;
            }

            if (positived) {
                var negatived = false;
                negativeTags.forEach(ntag => {
                    if (tags.includes(ntag)) {
                        negatived = true;
                    }
                });

                if (!negatived) {

                    if (loadedImgs) {
                        results.push({
                            link: image.link,
                            src: image.src,
                            id: image.link.split('id=')[1],
                            video: image.title.trim().split(' ').includes('video'),
                            score: image.score
                        });
                    }
                    else {
                        const imageId = getThumbImgId(image);
                        const postLink = `index.php?page=post&s=view&id=${imageId}`
                        results.push({
                            link: postLink,
                            src: image.src,
                            id: imageId,
                            video: image.title.trim().split(' ').includes('video'),
                            score: image.score
                        });
                    }

                }
            }
        });
        if (!loadedImgs && images.length) {
            lastImageId = getThumbImgId(images[images.length - 1]);
        }
    }

    function loadAllPages() {
        extractImagesAndTags(false, loadedImages);
        displayResultsInModal();
    }

    async function searchAllPages(startPage = 0) {

        const totalPages = Math.ceil(actualFavCount / 50);
        const fetchPromises = [];
        let loadedPages = startPage;

        const maxConcurrentRequests = 9;
        let activeRequests = 0;

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function fetchAndExtract(page, attempt = 0) {
            while (activeRequests >= maxConcurrentRequests) {
                await delay(100);
            }

            activeRequests++;
            const delayTime = attempt > 0 ? Math.pow(2, attempt) * 100 : page * 50;
            await delay(delayTime);
            const doc = await fetchFavoritesPage(page);

            if (doc) {
                await extractImagesAndTags(doc);
            }

            let retryCount = 0;
            while (images.length === 0 && retryCount < 5) {
                const retryDelay = Math.pow(2, retryCount) * 100;
                await delay(retryDelay);
                const retryDoc = await fetchFavoritesPage(page);
                if (retryDoc) {
                    await extractImagesAndTags(retryDoc);
                }
                retryCount++;
            }

            if (images.length > 0) {
                loadedPages++;
            }

            document.getElementById('progress').innerHTML = `scanning: ${loadedPages} / ${totalPages}&nbsp;&nbsp;(full)`;

            activeRequests--;
        }

        for (let page = startPage; page < totalPages; page++) {
            fetchPromises.push(fetchAndExtract(page));
        }

        await Promise.all(fetchPromises);

        displayResultsInModal();
    }

    async function searchNewPages() {

        const totalPages = Math.min(10, Math.ceil(actualFavCount / 50));
        const fetchPromises = [];
        let loadedPages = 0;

        const maxConcurrentRequests = 9;
        let activeRequests = 0;

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function fetchAndExtract(page, attempt = 0) {
            while (activeRequests >= maxConcurrentRequests) {
                await delay(100);
            }

            activeRequests++;
            const delayTime = attempt > 0 ? Math.pow(2, attempt) * 100 : page * 50;
            await delay(delayTime);
            const doc = await fetchFavoritesPage(page);

            if (doc) {
                await extractImagesAndTags(doc);
            }

            let retryCount = 0;
            while (images.length === 0 && retryCount < 5) {
                const retryDelay = Math.pow(2, retryCount) * 100;
                await delay(retryDelay);
                const retryDoc = await fetchFavoritesPage(page);
                if (retryDoc) {
                    await extractImagesAndTags(retryDoc);
                }
                retryCount++;
            }

            if (images.length > 0) {
                loadedPages++;
            }

            displayScanStatus(`scanning: ${loadedPages} / ${totalPages}`);
            activeRequests--;
        }

        for (let page = 0; page < totalPages; page++) {
            fetchPromises.push(fetchAndExtract(page));
        }

        await Promise.all(fetchPromises);


        const lastResultId = lastImageId;
        const indexToDelete = loadedImages.findIndex(item => item.link.split('id=')[1] === lastResultId);
        if (indexToDelete !== -1) {
            loadedImages.splice(0, indexToDelete + 1);
            extractImagesAndTags(false, loadedImages);
            appendLoadedSave = true;
            displayResultsInModal();
        }
        else {
            await delay(100);
            searchAllPages(10);
        }
    }


    function displayResultsInModal(tabTitle = 'Fav Search', columnWidth = 250) {
        const bgColor = getBgColor();

        document.body.innerHTML = '';

        const defaultPageSize = 50;
        const savedImagesPerPage = localStorage.getItem('imagesPerPage') || defaultPageSize;
        let imagesPerPage = savedImagesPerPage === 'All' ? actualFavCount : parseInt(savedImagesPerPage, 10);

        const pageSizes = [10, 15, 25, 50, 100, 250, 500, 1000, 'All'];


        let currentPage = 1;
        let currentResults = results.slice();

        function displayCurretnpage() {
            showResults(currentResults);
            scrollToTop();
        }

        function cropCurrentPage(resultsToCrop, page, pageSize) {
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            const paginatedResults = resultsToCrop.slice(startIndex, endIndex);
            return paginatedResults;
        }

        function createPageSizeSelector(updatePageIndicator) {
            const pageSizeContainer = document.createElement('div');
            pageSizeContainer.style.marginLeft = '50px';
            pageSizeContainer.style.display = 'flex';
            pageSizeContainer.style.alignItems = 'center';

            const pageSizeLabel = document.createElement('label');
            pageSizeLabel.textContent = 'Page size:';
            pageSizeLabel.style.marginRight = '10px';
            pageSizeLabel.style.fontFamily = 'Verdana, sans-serif';
            pageSizeLabel.style.fontSize = '16px';
            pageSizeLabel.style.color = textColor;

            const pageSizeSelect = document.createElement('select');
            pageSizeSelect.style.padding = '5px';
            pageSizeSelect.style.fontSize = '16px';


            pageSizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                pageSizeSelect.appendChild(option);
            });

            pageSizeSelect.value = savedImagesPerPage; 

            pageSizeSelect.addEventListener('change', () => {
                const size = pageSizeSelect.value;
                imagesPerPage = size === 'All'? actualFavCount : parseInt(size, 10);
                localStorage.setItem('imagesPerPage', size);
                currentPage = 1;
                displayCurretnpage();
                updatePageIndicator();
            });

            pageSizeContainer.appendChild(pageSizeLabel);
            pageSizeContainer.appendChild(pageSizeSelect);

            return pageSizeContainer;
        }

        function createPaginationControls(onPageChange, isMain) {
            const paginationContainer = document.createElement('div');
            paginationContainer.style.display = 'flex';
            paginationContainer.style.justifyContent = 'center';
            paginationContainer.style.alignItems = 'center';
            paginationContainer.style.margin = '10px 0';
            paginationContainer.style.marginRight = '0px';
        
            const prevButton = document.createElement('button');
            prevButton.textContent = '<';
            prevButton.style.marginRight = '10px';
            prevButton.style.padding = '5px 10px';
            prevButton.style.cursor = 'pointer';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', openPrevPage);

            function openPrevPage() {
                if (currentPage > 1) {
                    currentPage--;
                    onPageChange();
                    prevButton.blur();
                    displayCurretnpage();
                }
            }
            function openNextPage() {
                const totalPages = Math.ceil(currentResults.length / imagesPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    onPageChange();
                    nextButton.blur();
                    displayCurretnpage();
                }
            }
            
            if (isMain) {
                document.addEventListener('keydown', (event) => {
                    if (event.key === 'ArrowLeft') {
                        openPrevPage();
                    }
                    if (event.key === 'ArrowRight') {
                        openNextPage();
                    }
                });

                if (isMobile) {
                    let touchStartX = 0;
                    let touchEndX = 0;

                    function handleTouchStart(event) {
                        touchStartX = event.touches[0].clientX;
                    }

                    function handleTouchEnd(event) {
                        touchEndX = event.changedTouches[0].clientX;

                        const deltaX = touchEndX - touchStartX;

                        if (Math.abs(deltaX) > 100) {
                            if (deltaX > 0) {
                                openPrevPage();
                            } else {
                                openNextPage();
                            }
                        }
                    }

                    resultContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
                    resultContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

                }
            }
        
            const pageIndicator = document.createElement('span');
            pageIndicator.style.margin = '0 10px';
            pageIndicator.style.fontSize = '16px';
            pageIndicator.style.fontFamily = 'Verdana, sans-serif';
            pageIndicator.style.color = darkMode ? textColor : '#333'
        
            function updatePageIndicator() {
                const totalPages = Math.ceil(currentResults.length / imagesPerPage);
                pageIndicator.textContent = `${currentPage}/${totalPages}`;
                prevButton.disabled = currentPage === 1;
                nextButton.disabled = currentPage >= totalPages;          
            }
        
            const nextButton = document.createElement('button');
            nextButton.textContent = '>';
            nextButton.style.marginLeft = '10px';
            nextButton.style.padding = '5px 10px';
            nextButton.style.cursor = 'pointer';
        
            nextButton.addEventListener('click', openNextPage);
        
            paginationContainer.appendChild(prevButton);
            paginationContainer.appendChild(pageIndicator);
            paginationContainer.appendChild(nextButton);
        
            updatePageIndicator();
        
            return { paginationContainer, prevButton, nextButton, updatePageIndicator };
        }
        


        localStorage.setItem('inputTags', JSON.stringify(inputTags));
        localStorage.setItem('prevFavCount', JSON.stringify(actualFavCount));
        localStorage.setItem('userId', JSON.stringify(userId));
        if (needScan) {
            try {
            saveAllImagesToLocalStorage();
            clearRemovalQueue();
            clearAdditionalQueue();
            }
            catch (e) {
                setTimeout(() => {
                    alert(`Error: Scan results cannot be cached, so each search requires a fresh scan.\nHowever, you can still view the search results.\nTry using the Tampermonkey and updating or changing your browser to resolve the issue.\nPlease report the bug if this issue persists.`);
                }, 1000);
            }
        }

        const existingResultContainer = document.querySelector('#resultContainer');
        if (existingResultContainer) {
            existingResultContainer.remove();
        }

        let removeLabelsShown = false;

        const resultContainer = document.createElement('div');
        resultContainer.id = 'resultContainer';
        resultContainer.style.width = '100%';
        resultContainer.style.height = '100vh';
        resultContainer.style.backgroundColor = bgColor;
        resultContainer.style.color = 'white';
        resultContainer.style.overflowY = 'auto';
        resultContainer.style.zIndex = '10000';
        resultContainer.style.padding = '20px';
        resultContainer.style.boxSizing = 'border-box';
        resultContainer.style.display = 'flex';
        resultContainer.style.flexDirection = 'column';

        const imagesContainer = document.createElement('div');
        imagesContainer.id = 'imagesContainer';
        imagesContainer.style.width = '100%';
        imagesContainer.style.marginTop = '10px';
        imagesContainer.style.display = 'flex';
        imagesContainer.style.flexWrap = 'wrap';
        imagesContainer.style.justifyContent = 'flex-start';
        imagesContainer.style.alignContent = 'flex-start';
        imagesContainer.style.alignItems = 'flex-start';
        
        function scrollToTop() {
            resultContainer.scrollTop = 0;
        }

        const imageCount = document.createElement('div');
        let hidenVideoNumber = 0;
        function updateImageCounter() {
            imageCount.textContent = `Images: ${results.length - hidenVideoNumber}`;
        }

        const bottomControls = createPaginationControls(updatePageControls, false);
        const { paginationContainer, prevButton, nextButton, updatePageIndicator } = createPaginationControls(updatePageControls, true);
        function updatePageControls() {
            updatePageIndicator();
            bottomControls.updatePageIndicator();
        }
        

        function createHeaderContainer() {
            const defaultButtonColor = '#DBA19D';
            const defaultButtonColorHowered = '#9E7471';
            const activeButtonColor = '#e26c5e';
            const activeButtonColorHowered = '#c45a4b';
            
            let selectedButton;  
            function isButtonSelected(button) {
                return (selectedButton === button);
            }   

            function selectButton(button) {
                if (isButtonSelected(button)) return;
                resetButtonSelection();
                selectedButton = button;
                button.style.backgroundColor = activeButtonColorHowered;
            }

            function resetButtonSelection() {
                hidenVideoNumber = 0;
                randomizeButton.style.backgroundColor = defaultButtonColor;
                scoreButton.style.backgroundColor = defaultButtonColor;
                dateButton.style.backgroundColor = defaultButtonColor;
            }

            const headerContainer = document.createElement('div');
            headerContainer.style.width = '100%';
            headerContainer.style.display = 'flex';
            headerContainer.style.flexDirection = 'column';
            headerContainer.style.alignItems = 'flex-start';

            imageCount.textContent = `Images: ${results.length}`;
            imageCount.style.fontFamily = 'Verdana, sans-serif';
            imageCount.style.fontSize = '20px';
            imageCount.style.fontWeight = 'bold';
            imageCount.style.color = textColor;
            imageCount.style.textAlign = 'left';
            imageCount.style.marginBottom = '10px';

            const controlsContainer = document.createElement('div');
            controlsContainer.style.width = '100%';
            controlsContainer.style.display = 'flex';
            controlsContainer.style.alignItems = 'center';

            const toggleRemoveLabelContainer = document.createElement('div');
            toggleRemoveLabelContainer.style.display = 'flex';
            toggleRemoveLabelContainer.style.alignItems = 'center';

            const toggleRemoveLabelCheckbox = document.createElement('input');
            toggleRemoveLabelCheckbox.type = 'checkbox';
            toggleRemoveLabelCheckbox.id = 'toggleRemoveLabelCheckbox';
            toggleRemoveLabelCheckbox.style.marginRight = '10px';
            toggleRemoveLabelCheckbox.onchange = () => {
                removeLabelsShown = !removeLabelsShown;
                const removeLabels = document.querySelectorAll('.removeLabel');
                removeLabels.forEach(label => {
                    label.style.display = toggleRemoveLabelCheckbox.checked ? 'inline' : 'none';
                });
            };

            const toggleRemoveLabelText = document.createElement('label');
            toggleRemoveLabelText.htmlFor = 'toggleRemoveLabelCheckbox';
            toggleRemoveLabelText.textContent = 'Removing';
            toggleRemoveLabelText.style.color = textColor;
            toggleRemoveLabelText.style.fontFamily = 'Verdana, sans-serif';
            toggleRemoveLabelText.style.fontSize = '16px';
            toggleRemoveLabelText.style.fontWeight = 'bold';

            toggleRemoveLabelContainer.appendChild(toggleRemoveLabelCheckbox);
            toggleRemoveLabelContainer.appendChild(toggleRemoveLabelText);

            const randomizeButton = document.createElement('button');
            randomizeButton.textContent = 'Randomize';
            randomizeButton.style.backgroundColor = defaultButtonColor;
            randomizeButton.style.color = 'white';
            randomizeButton.style.border = 'none';
            randomizeButton.style.padding = '5px 10px 3px 10px';
            randomizeButton.style.cursor = 'pointer';
            randomizeButton.style.borderRadius = '3px';
            randomizeButton.style.fontSize = '18px';
            randomizeButton.style.marginLeft = '20px';
            randomizeButton.onmouseover = () => {
                randomizeButton.style.backgroundColor = isButtonSelected(randomizeButton) ? activeButtonColorHowered : defaultButtonColorHowered;
            };
            randomizeButton.onmouseout = () => {
                randomizeButton.style.backgroundColor = isButtonSelected(randomizeButton) ? activeButtonColor : defaultButtonColor;
            };
            randomizeButton.onclick = () => {
                if(isButtonSelected(scoreButton)) {
                    hidenVideoNumber = 0;
                    updateImageCounter();
                }
                selectButton(randomizeButton);
                const shuffledResults = results.slice().sort(() => 0.5 - Math.random());
                updateCurrentResults(shuffledResults);
                updatePageControls();
            };

            const scoreButton = document.createElement('button');
            scoreButton.textContent = 'Score';
            scoreButton.style.backgroundColor = defaultButtonColor; 
            scoreButton.style.color = 'white';
            scoreButton.style.border = 'none';
            scoreButton.style.padding = '5px 10px 3px 10px';
            scoreButton.style.cursor = 'pointer';
            scoreButton.style.borderRadius = '3px';
            scoreButton.style.fontSize = '18px';
            scoreButton.style.marginLeft = '20px';
            scoreButton.style.marginRight = '400px';
            scoreButton.style.flexShrink = '0';


            scoreButton.onmouseover = () => {
                scoreButton.style.backgroundColor = isButtonSelected(scoreButton) ? activeButtonColorHowered : defaultButtonColorHowered;
            };

            scoreButton.onmouseout = () => {
                scoreButton.style.backgroundColor = isButtonSelected(scoreButton) ? activeButtonColor : defaultButtonColor;
            };

            let isNoVid = false;

            scoreButton.onclick = () => {
                if(isButtonSelected(scoreButton)) {
                    if (isNoVid) {
                        scoreButton.textContent = 'Score';
                        isNoVid = false;
                    } else {
                        scoreButton.textContent = 'Score no video';
                        isNoVid = true;
                    }
                }
                else {
                    selectButton(scoreButton);
                }

                let sortedResults;
                if (isNoVid) {
                    const numberWithVideos = results.length; 
                    sortedResults = results.filter(result => !result.video);
                    const numberWithOutVideos = sortedResults.length;
                    sortedResults = sortedResults.sort((a, b) => b.score - a.score);
                    hidenVideoNumber = numberWithVideos - numberWithOutVideos;
                }
                else {
                    sortedResults = results.slice().sort((a, b) => b.score - a.score);
                    hidenVideoNumber = 0;
                }
                updateImageCounter();
                updateCurrentResults(sortedResults);
                updatePageControls();
            };

            const dateButton = document.createElement('button');
            dateButton.textContent = 'New';
            dateButton.style.backgroundColor = defaultButtonColor;
            dateButton.style.color = 'white';
            dateButton.style.border = 'none';
            dateButton.style.padding = '5px 10px 3px 10px';
            dateButton.style.cursor = 'pointer';
            dateButton.style.borderRadius = '3px';
            dateButton.style.fontSize = '18px';
            dateButton.style.marginLeft = '20px';
            dateButton.style.width = '56px';

            dateButton.onmouseover = () => {
                dateButton.style.backgroundColor = isButtonSelected(dateButton) ? activeButtonColorHowered : defaultButtonColorHowered;
            };

            dateButton.onmouseout = () => {
                dateButton.style.backgroundColor = isButtonSelected(dateButton) ? activeButtonColor : defaultButtonColor;
            };

            let isNewOrder = true; 

            dateButton.onclick = () => {
                if(isButtonSelected(scoreButton)) {
                    hidenVideoNumber = 0;
                    updateImageCounter();
                }
                if(isButtonSelected(dateButton)) {
                    if (isNewOrder) {
                        dateButton.textContent = 'Old';
                        isNewOrder = false;
                    } else {
                        dateButton.textContent = 'New';
                        isNewOrder = true;
                    }
                }
                else {
                    selectButton(dateButton);
                }

                if (isNewOrder) {
                    updateCurrentResults(results.slice());
                }
                else {
                    updateCurrentResults(results.slice().reverse());
                }
                updatePageControls();
            };
        
            const pageSizeSelector = createPageSizeSelector(updatePageControls);

            const topPageControls = document.createElement('div');
            topPageControls.style.display = 'flex';
            topPageControls.style.alignItems = 'center';
            topPageControls.style.position = 'absolute';
            topPageControls.style.marginLeft = '850px';

            topPageControls.appendChild(paginationContainer);
            topPageControls.appendChild(pageSizeSelector);


            selectButton(dateButton);

            function updateLayout() {
                const screenWidth = window.innerWidth || document.documentElement.clientWidth;
                if (screenWidth >= 1250) {
                    controlsContainer.appendChild(toggleRemoveLabelContainer);
                    controlsContainer.appendChild(randomizeButton);
                    controlsContainer.appendChild(dateButton);
                    controlsContainer.appendChild(scoreButton);

                    randomizeButton.style.marginLeft = '50px';
                    headerContainer.style.flexDirection = 'row';
                    headerContainer.style.alignItems = 'center';
                    headerContainer.style.position = 'relative';
                    headerContainer.style.marginTop = '0px';
                    headerContainer.style.justifyContent = 'flex-start';

                    imageCount.style.position = 'absolute';
                    imageCount.style.marginBottom = '0';
                    imageCount.style.marginLeft = '600px';
                    imageCount.style.top = 'auto'; 

                    pageSizeSelector.style.marginLeft = '50px';

                    topPageControls.style.position = 'absolute';
                    topPageControls.style.marginLeft = '850px';

                    controlsContainer.style.flexDirection = 'row';
                    controlsContainer.style.justifyContent = 'flex-start';
                    controlsContainer.style.marginTop = '0px';
                    controlsContainer.appendChild(topPageControls);
                    controlsContainer.appendChild(imageCount);
                    toggleRemoveLabelText.textContent = 'Removing';
                    toggleRemoveLabelContainer.style.marginLeft = '10px';

                    headerContainer.appendChild(controlsContainer);

                } 
                else if (screenWidth >= 600) {
                    const imageCountContainer = document.createElement('div');
                    imageCountContainer.style.flexDirection = 'row';
                    imageCountContainer.style.position = 'relative';
                    imageCountContainer.style.display = 'flex';
                    imageCountContainer.style.alignItems = 'center';
                    imageCountContainer.appendChild(imageCount);
                    imageCountContainer.appendChild(topPageControls);

                    controlsContainer.appendChild(toggleRemoveLabelContainer);
                    controlsContainer.appendChild(randomizeButton);
                    controlsContainer.appendChild(dateButton);
                    controlsContainer.appendChild(scoreButton);

                    randomizeButton.style.marginLeft = '50px';
                    headerContainer.style.flexDirection = 'column';
                    headerContainer.style.alignItems = 'flex-start';

                    imageCount.style.position = 'relative';
                    imageCount.style.marginBottom = '0px';
                    imageCount.style.transform = 'translateX(0%)';
                    imageCount.style.marginLeft = '10px';

                    pageSizeSelector.style.marginLeft = '50px';

                    topPageControls.style.position = 'relative';
                    topPageControls.style.marginLeft = '50px';

                    controlsContainer.style.flexDirection = 'row';
                    controlsContainer.style.justifyContent = 'flex-start';
                    controlsContainer.style.marginTop = '0px';
                    toggleRemoveLabelText.textContent = 'Removing';
                    toggleRemoveLabelContainer.style.marginLeft = '10px';

                    headerContainer.appendChild(imageCountContainer);
                    headerContainer.appendChild(controlsContainer);
                }          
                else {
                    const imageCountContainer = document.createElement('div');
                    imageCountContainer.appendChild(imageCount);
                    imageCountContainer.appendChild(toggleRemoveLabelContainer);
                    imageCountContainer.style.flexDirection = 'row';
                    imageCountContainer.style.position = 'relative';
                    imageCountContainer.style.display = 'flex';

                    pageSizeSelector.style.marginLeft = '0px';

                    randomizeButton.style.marginLeft = '0px';
                    headerContainer.style.flexDirection = 'column';
                    headerContainer.style.alignItems = 'flex-start';

                    imageCount.style.position = 'relative';
                    imageCount.style.marginBottom = '10px';
                    imageCount.style.transform = 'translateX(0%)';
                    imageCount.style.marginLeft = '0px';

                    controlsContainer.style.flexDirection = 'row';
                    controlsContainer.style.justifyContent = 'flex-start';
                    controlsContainer.style.marginTop = '10px';

                    toggleRemoveLabelContainer.style.marginLeft = '0px';
                    toggleRemoveLabelContainer.style.position = 'relative';
                    toggleRemoveLabelContainer.style.marginLeft = '30px';

                    topPageControls.style.position = 'relative';
                    topPageControls.style.marginLeft = '0px';

                    pageSizeSelector.style.marginLeft = '10px';

                    controlsContainer.appendChild(randomizeButton);
                    controlsContainer.appendChild(dateButton);
                    controlsContainer.appendChild(scoreButton);

                    headerContainer.appendChild(imageCountContainer);
                    headerContainer.appendChild(topPageControls);
                    headerContainer.appendChild(controlsContainer);
                }
            }

            updateLayout();

            window.addEventListener('resize', updateLayout);

            return headerContainer;
        }

        const headerContainer = createHeaderContainer();
        resultContainer.appendChild(headerContainer);

        const spacer = document.createElement('div');
        spacer.style.width = '100%';
        spacer.style.height = '20px';
        resultContainer.appendChild(spacer);

        resultContainer.appendChild(imagesContainer);

        displayCurretnpage();

        function returnToFavPage() {
            localStorage.setItem('fromBack', JSON.stringify(true));
            location.reload();
        }

        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.style.position = 'fixed';
        backButton.style.top = '10px';
        backButton.style.right = '20px';
        backButton.style.backgroundColor = 'transparent';
        backButton.style.border = 'none';
        backButton.style.color = darkMode ? textColor : '#0b3d91';
        backButton.style.fontSize = '24px';
        backButton.style.fontWeight = 'bold';
        backButton.style.cursor = 'pointer';
        backButton.style.zIndex = '9999';
        backButton.addEventListener('mouseover', () => {
            backButton.style.color = '#660000';
        });
        backButton.addEventListener('mouseout', () => {
            backButton.style.color = darkMode ? textColor : '#0b3d91';

        });
        backButton.addEventListener('click', () => {
            returnToFavPage();
        });
        document.body.appendChild(backButton);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                returnToFavPage();
            }
        });

        const bottomSpacer = document.createElement('div');
        bottomSpacer.style.width = '100%';
        bottomSpacer.style.height = '50px';
        bottomSpacer.style.flexShrink = '0';
        bottomSpacer.style.display = 'block';

        if (isMobile) {
            
            document.addEventListener('touchmove', function(event) {
                const scrollPosition = window.scrollY; 
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            
                if (scrollPosition >= maxScroll && event.touches[0].clientY > 0) {
                    event.preventDefault();
                }
            }, { passive: false });
            
        }

        document.title = tabTitle || 'Results';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';

        resultContainer.appendChild(bottomControls.paginationContainer);
        if (isMobile) resultContainer.appendChild(bottomSpacer);
        document.body.appendChild(resultContainer);
        scrollToTop();

        function updateCurrentResults(shuffledResults) {
            currentPage = 1;
            currentResults = shuffledResults;
            showResults(shuffledResults);
        }

        function showResults(shuffledResults) {
            imagesContainer.querySelectorAll('.resultItem').forEach(item => item.remove());

            const pageResults = cropCurrentPage(shuffledResults, currentPage, imagesPerPage);
            pageResults.forEach(result => {
                appendResult(result);
            });
        }

        function appendResult(result) {
            if (!result) return;
            const resultItem = document.createElement('div');
            resultItem.className = 'resultItem';
            resultItem.id = `favorite-${result.id}`;
            resultItem.style.textAlign = 'center';
            resultItem.style.width = `${columnWidth}px`;
            resultItem.style.margin = '10px';
            resultItem.style.alignSelf = 'flex-start';

            resultItem.style.position = 'relative';
            resultItem.style.transition = 'height 0.15s'
        
            const removeLabel = document.createElement('a');
            removeLabel.href = '#';
            removeLabel.className = 'removeLabel';
            removeLabel.style.color = darkMode ? textColor : '#009';
            removeLabel.style.fontWeight = 'bold';
            removeLabel.style.textDecoration = 'none';
            removeLabel.style.fontFamily = 'Verdana, sans-serif';
            removeLabel.style.fontSize = '100%';
            removeLabel.style.display = removeLabelsShown ? 'inline' : 'none';
            removeLabel.textContent = 'Remove';

            function updateResultItemHeight() {
                if (!isMobile) {
                    resultItem.style.height = removeLabel.style.display === 'inline' ? '275px' : '250px'; 
                }
            }

            removeLabel.onclick = (event) => {
                addToRemovalQueue(result.id);
                event.preventDefault();
                fetch(`index.php?page=favorites&s=delete&id=${result.id}`, {
                    method: 'GET',
                })
                .then(response => {
                    if (response.ok) {
                        const element = document.getElementById(`favorite-${result.id}`);
                        if (element) {
                            const indexToRemove = results.indexOf(result);
                            const indexToRemoveCurrent = currentResults.indexOf(result);
                            if (indexToRemove > -1) {
                                results.splice(indexToRemove, 1);
                            }
                            if (indexToRemoveCurrent > -1) {
                                currentResults[indexToRemoveCurrent] = null;
                            }
                            element.remove();
                            updateImageCounter();
                        } else {
                            console.error(`Element with ID favorite-${result.id} not found`);
                        }
                    } else {
                        console.error("Failed to remove from favorites");
                    }
                })
                .catch(error => console.error("Error:", error));
            };
        
            const borderStyle = result.video ? 'border: 3px solid rgb(0, 0, 255);' : '';
        
            resultItem.innerHTML = `
                <a href="index.php?page=post&s=view&id=${result.id}" id="p${result.id}" target="_blank">
                    <img src="${result.src}" title="" border="0" alt="" style="max-width: 100%; max-height: 100%; ${borderStyle}; margin-bottom: 5px;">
                </a><br>
            `;

            resultItem.appendChild(removeLabel);
            imagesContainer.appendChild(resultItem);


            const observer = new MutationObserver(() => updateResultItemHeight());
            observer.observe(removeLabel, { attributes: true, attributeFilter: ['style'] });

            updateResultItemHeight();
        }
    }

    let favCountOnLastUpdate;

    async function fastCheckForScanIsNeeded() {
        const savedUserId = loadSavedUserId();

        if (savedUserId) {
            const sameUser = getIdFromUrl() == savedUserId;
            if (!sameUser) {
                const scanStatus = document.getElementById('progress').textContent;
                return !(scanStatus == 'new user');
            }
            else {
                return getFavoritesCount(userId).then(favCount => {
                    const haveNewFavs = favCount != favCountOnLastUpdate;
                    if (haveNewFavs && favCountOnLastUpdate) {
                        favCountOnLastUpdate = favCount;
                        return true;
                    }
                    else {
                        return false;
                    }
                });

            }
        }
        else {
            return false;
        }
    }

    function switchedToFavPage() {
        fastCheckForScanIsNeeded().then(checkResult => {
            if (checkResult) location.reload();
        });
    }

    function checkForUpdate() {
        const savedVersion = localStorage.getItem('scriptVersion');
        if (savedVersion) {
            if (savedVersion != scriptVersion) {
                alert(`Favorites Search script was updated to version ${scriptVersion}\nNew features available:\n- Search tags autocomplete in Verbatim mode\n- Sort Score and other sorting options\n- Results pagination\n- Toggle to hide blacklisted images\n- Auto refresh Favorites page if you added new favorites\n- Fixed removing without page reload and script reset\n- Fixed Favorites detection on other pages without rescan`);

                reset();
            }
        }
    }

    function init() {
        if (customIcon) {
            updateIcon('https://i.imgur.com/EtURK0r.png');
        }

        checkForUpdate();
        localStorage.setItem('scriptVersion', scriptVersion);

        SearchInputModule.createSearchInput();

        document.addEventListener(
            "click",
            function (e) {
                const target = e.target.closest("a");
        
                if (
                    target &&
                    target.getAttribute("onclick") &&
                    target.getAttribute("onclick").includes("favorites&s=delete")
                ) {  
                    const onclickCode = target.getAttribute("onclick");
        
                    const idMatch = onclickCode.match(/id=(\d+)/);
                    if (idMatch) {
                        const id = idMatch[1];
                        removeFromAdditionalQueue(id);
                        addToRemovalQueue(id);
                    }
                }
            },
            true
        );
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                switchedToFavPage();
            }
        });
        
        getFavoritesCount(userId).then(favoritesCount => {
            actualFavCount = favoritesCount;
            favCountOnLastUpdate = favoritesCount;

            loadAllImagesFromLocalStorage(function(loadedImgs) {
                const removalQueue = getRemovalQueue();
                const removalSet = new Set();
                removalQueue.forEach(id => {
                    removalSet.add(id);
                });

                loadedImages = loadedImgs.filter(img => {
                    if (removalSet.has(img.id)) {
                        return false;
                    }
                    return true;
                });

                needScan = true;
                fullScan = true;
                if (prevUserId) {
                    if (userId == prevUserId) {
                        if (prevFavCount > 0 && loadedImages.length > 0) {
                            fullScan = false;
                            const loadedFirstId = loadedImages[0].id;

                            fetchFavoritesPage(0).then(pageDoc => {
                                const actualFirstId = pageDoc.querySelectorAll('.thumb img')[0].parentElement.href.split('id=')[1];
                                const loadedCount = loadedImages.length;
                                if ((loadedFirstId != actualFirstId) && !fromBack || (favoritesCount != prevFavCount)) {
                                    displayScanStatus('scanned (new)');
                                }
                                else {
                                    needScan = false;
                                    allImages = loadedImages;
                                    displayScanStatus('scanned');
                                }
                            });
                        }
                        else {
                            displayScanStatus('need scan');
                        }
                    }
                    else {
                        displayScanStatus('new user');
                    }
                }
                else {
                    displayScanStatus('need scan');
                }
            });
        });

    }

    const exploreModule = (() => {
        const BORDER_COLOR = '#DB1C32';
        const BORDER_THICKNESS = 3;

        function onPostPage() {
            const originalAddFav = window.addFav;

            window.addFav = function(postId) {
                addToAdditionalQueue(postId);
                originalAddFav.apply(this, arguments);
            };
        }

        function handleUserReturn() {
            const additionalQueue = getAdditionalQueue();
            const additionalSet = new Set();
            additionalQueue.forEach(id => {
                additionalSet.add(id);
            });

            if (additionalQueue.length > 0) {
                const imageListDivs = document.querySelectorAll('div.image-list');
                imageListDivs.forEach(imageListDiv => {
                    const thumbs = imageListDiv.querySelectorAll('span.thumb');

                    thumbs.forEach(thumb => {
                        const images = thumb.querySelectorAll('img');

                        images.forEach(img => {
                            const imgId = getThumbImgId(img);
                            if (additionalSet.has(imgId)) {
                                img.style.border = `${BORDER_THICKNESS}px solid ${BORDER_COLOR}`;
                            }
                        });
                    });
                });
            }
        }

        function highlightFavs() {
            const savedborderFavs = localStorage.getItem('borderFavs');
            borderFavs = savedborderFavs ? JSON.parse(savedborderFavs) : true;

            if (borderFavs) {

                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') {
                        handleUserReturn();
                    }
                });

                loadAllImagesFromLocalStorage(function(loadedImgs) {

                    const idSet = new Set();
                    loadedImgs.forEach(img => {
                        idSet.add(img.id);
                    });

                    const additionalQueue = getAdditionalQueue();
                    const additionalSet = new Set();
                    additionalQueue.forEach(id => {
                        additionalSet.add(id);
                    });

                    const removalQueue = getRemovalQueue();
                    const removalSet = new Set();
                    removalQueue.forEach(id => {
                        removalSet.add(id);
                    });

                    if (loadedImgs.length > 0) {
                        const imageListDivs = document.querySelectorAll('div.image-list');
                        imageListDivs.forEach(imageListDiv => {
                            const thumbs = imageListDiv.querySelectorAll('span.thumb');

                            thumbs.forEach(thumb => {
                                const images = thumb.querySelectorAll('img');

                                images.forEach(img => {
                                    const imgId = getThumbImgId(img);
                                    if (additionalSet.has(imgId) || (idSet.has(imgId) && !removalSet.has(imgId))) {
                                        img.style.border = `${BORDER_THICKNESS}px solid ${BORDER_COLOR}`;
                                    }
                                });
                            });
                        });
                    }
                });
            }
        }
        return {
            highlightFavs,
            onPostPage
        };
    })();


    if(pageType === PageType.FAVORITE_VIEW) {
        userId = getIdFromUrl();
        isMobile = isMobileVersion();
        darkMode = isDarkMode();
        loadSavedData();
        init();
    }
    else if (pageType === PageType.POST_LIST) {
        exploreModule.highlightFavs();
    } 
    else if (pageType === PageType.POST_VIEW) {
        exploreModule.onPostPage();
    }

    


})();



