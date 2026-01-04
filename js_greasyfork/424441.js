// ==UserScript==
// @name         Twonky Enhancer
// @version      v20230809.1524
// @description  Fix Twonky public Web UI
// @author       ltlwinston
// @match        http*://*/*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js
// @namespace https://greasyfork.org/users/754595
// @downloadURL https://update.greasyfork.org/scripts/424441/Twonky%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/424441/Twonky%20Enhancer.meta.js
// ==/UserScript==
GM_addElement('link',{
    rel: "stylesheet",
    href: "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
});
GM_addElement('link',{
    rel: "stylesheet",
    href: "//cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.css"
});

const interesting_words = [
'sex', 'intim', 'sess', 'osé', 'porc', 'porn', 'intim', 'naught', 'xxx', 'privat', 'whatsapp', 'signal', 'telegram', 'sent', 'bitch', 'cunt', 'puttan', 'hot', 'blowjob', 'pussy', 'figa', 'tette', 'culo', 'anal', 'pomp', 'bocchin', 'personal'
];

(async function () {
    'use strict';

    const USE_CACHE = true;

    if (document.title.match(/(twonky|pv connect|mediaserver)/i)) {
        if(document.body.innerText.indexOf('Access is restricted to MediaServer configuration!')>=0) {
            window.location.href = '/webbrowse';
            return;
        }

        async function loadServerStatus() {
            const status = {};
            await fetch('/rpc/info_status').then(r => r.text()).then(s => s.split(/[\t\n ]/).forEach(i => {
                const [k,v] = i.split('|');
                status[k] = isNaN(v) ? v : parseInt(v);
            }));
            return status;
        }

        async function loadPhotoAlbums(SERVER_UUID) {
            const albumUrl = '/nmc/rss/server/RB' + SERVER_UUID + ',0/IB' + SERVER_UUID + ',_MCQyJDI0,,1,0,_Um9vdA==,0,,0,0,_UGhvdG9z,_MCQz,?start=0&count=30000&fmt=json';
            const albumResult = await fetch(albumUrl).then(x=>x.json());
            if (!albumResult || !albumResult.item) {
                throw 'ERR: Cannot load photo albums';
            }
            return albumResult.item.map(x=>({title: x.title, bookmark: x.bookmark}));
        }
        async function loadVideoAlbums(SERVER_UUID) {
            const albumUrl = '/nmc/rss/server/RB' + SERVER_UUID + ',0/IB' + SERVER_UUID + ',_MCQzJDM1,,1,0,_Um9vdA==,0,,0,0,_VmlkZW9z,_MCQz,?start=0&count=30000&fmt=json';
            const albumResult = await fetch(albumUrl).then(x=>x.json());
            if (!albumResult || !albumResult.item) {
                throw 'ERR: Cannot load video albums';
            }
            return albumResult.item.map(x=>({title: x.title, bookmark: x.bookmark}));
        }
        async function getPath(bookmark) {
            return fetch('/nmc/rpc/get_item_path?server='+encodeURIComponent(bookmark)).then(x => x.text());
        }

        if (typeof unsafeWindow['statusData'] == 'undefined') {
            unsafeWindow['statusData'] = {'language': 'en'};
        }
        if (!('language' in unsafeWindow['statusData'])) {
            unsafeWindow['statusData']['language'] = 'en';
            initPage();
        }

        const statusElem = document.createElement('div');
        statusElem.id = 'te_status';
        statusElem.style.position = 'fixed';
        statusElem.style.color = 'black';
        statusElem.style.top = '1em';
        statusElem.style.left = '1em';
        statusElem.innerHTML = '<a href="javascript:return false;"><i class="fa fa-refresh"></i></a><br>'
        document.body.appendChild(statusElem);

        const status = await loadServerStatus();
        let SERVER_UUID = '';
        let photoAlbums = {};
        let videoAlbums = {};

        if (status) {
            if (('videos' in status) && ('pictures' in status)) {
                let nPics = status.pictures;
                let nVids = status.videos;
                statusElem.innerHTML += `<i class="fa fa-photo"></i> ${nPics} <i class="fa fa-video-camera"></i> ${nVids}`;

                SERVER_UUID = status.server_udn;
                if (SERVER_UUID) {
                    const pAlbumStatus = document.createElement('div');
                    const vAlbumStatus = document.createElement('div');
                    statusElem.appendChild(pAlbumStatus);
                    statusElem.appendChild(vAlbumStatus);

                    pAlbumStatus.innerHTML = '<i class="fa fa-file-image-o"></i> Loading...';
                    loadPhotoAlbums(SERVER_UUID).then(a => {
                        a.forEach(x => {photoAlbums[x.title] = x});
                        pAlbumStatus.innerHTML = (a.length+' <i class="fa fa-file-image-o"></i><br><input id="pasearch" placeholder="Search a photo album">');
                        const pasearch = document.querySelector('#pasearch');
                        pasearch.addEventListener('blur', function(e){this.value = ''});
                        pasearch.addEventListener('awesomplete-select', function(e){
                            openPhotoAlbum(SERVER_UUID, e.text.value);
                            //window.open(window.location.pathname + "#"+window.location.origin+"/nmc/rss/server/RB" + status.server_udn + ",0/IB" + e.text.value + '?start=0&count=30', '_blank');
                            e.preventDefault();
                        });
                        new Awesomplete(pasearch, {list: a, data: i => ({label:i.title, value:i.bookmark})});
                    }).catch(e => {
                        pAlbumStatus.innerText = (e);
                    });
                    vAlbumStatus.innerHTML = '<i class="fa fa-file-video-o"></i> Loading...';
                    loadVideoAlbums(SERVER_UUID).then(a => {
                        a.forEach(x => {videoAlbums[x.title] = x});
                        vAlbumStatus.innerHTML = (a.length+' <i class="fa fa-file-video-o"></i><br><input id="vasearch" placeholder="Search a video album">');
                        const vasearch = document.querySelector('#vasearch');
                        vasearch.addEventListener('blur', function(e){this.value = ''});
                        vasearch.addEventListener('awesomplete-select', function(e){
                            window.open(window.location.pathname + "#"+window.location.origin+"/nmc/rss/server/RB" + status.server_udn + ",0/IB" + e.text.value + '?start=0&count=30', '_blank');
                            e.preventDefault();
                        });
                        new Awesomplete(vasearch, {list: a, data: i => ({label:i.title, value:i.bookmark})});
                    }).catch(e => {
                        vAlbumStatus.innerText = (e);
                    });
                } else {
                    const pAlbumStatus = document.createElement('div');
                    pAlbumStatus.innerText = 'Album search not available.';
                    statusElem.appendChild(pAlbumStatus);
                }
            }
        }

        function fixUrl(url) {
            if (!url || typeof url !== 'string') {
                return "";
            }
            const re = /((127\.\d+\.\d+\.\d+)|(10\.\d+\.\d+\.\d+)|(172\.1[6-9]\.\d+\.\d+)|(172\.2[0-9]\.\d+\.\d+)|(172\.3[0-1]\.\d+\.\d+)|(192\.168\.\d+\.\d+))(:\d+)?/g;
            return url.replace(re,window.location.host);
        }

        unsafeWindow.fixLoadedPage = function fixLoadedPage() {
            document.querySelectorAll('img').forEach(function(img){
                if (img.src) {
                    img.src = fixUrl(img.src);
                }
            });
            document.querySelectorAll('a').forEach(function(a){
                if (a.href) {
                    a.href = fixUrl(a.href);
                }
            });
        }

        function hijackXHR() {
            var rawOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                if (!this._hooked) {
                    this._hooked = true;
                    this._url = url;
                    setupHook(this);
                }
                rawOpen.apply(this, [method, url, async, user, password]);
            }
            function setupHook(xhr) {
                function get() {
                    delete xhr.responseText;
                    var ret = xhr.responseText;
                    try {
                        if (USE_CACHE && xhr._url && xhr._url.match(/start=/)) {
                            var index = parseInt(xhr._url.match(/start=(\d+)/)[1]);
                            var json = JSON.parse(ret);
                            if (json && json.item && json.item.length) {
                                json.item.forEach((i,k) => {
                                    if (i && i.meta && i.meta.id) {
                                        var id1 = 'fTh' + i.meta.id;
                                        var id2 = 'fThBB' + (index + k);
                                        cachePut(id1, i);
                                        cachePut(id2, i);
                                    }
                                });
                            }
                        }
                    } catch (ex) {}
                    setup();
                    return fixUrl(ret);
                }

                function set(str) {
                    // Should be unused
                    console.log('set responseText: %s', str);
                }

                function setup() {
                    Object.defineProperty(xhr, 'responseText', { get, set, configurable: true });
                }
                setup();
            }
        }

        const CACHE = unsafeWindow.CACHE = {};
        function cachePut(k,v) {
            CACHE[k] = v;
        }
        function cacheGet(k, defaultValue='') {
            return k in CACHE ? CACHE[k] : defaultValue;
        }

        function getFilename(url) {
            if (!url) return '';
            var match = url.match(/[^/]+$/);
            if (!match.length) return false;
            return match[0].replace(/\?.*$/,'');
        }

        function addShortcuts() {
            document.body.addEventListener('keyup', function (e) {
                var currentPage = document.querySelector('#browsePages span');
                if (!currentPage) return;
                switch(e.keyCode) {
                        // Left
                    case 37:
                        currentPage.previousElementSibling && currentPage.previousElementSibling.click();
                        console.log('prev');
                        break;
                        // Right
                    case 39:
                        currentPage.nextElementSibling && currentPage.nextElementSibling.click();
                        console.log('next');
                        break;
                }
            });
        }

        function watchOnNewNodes(baseElementSelector, newNodeSelector, callback) {
            const observer = new MutationObserver(function(mutationsList, observer) {
                for(const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function(n){
                            if (!n || !n.querySelectorAll) return;
                            n.querySelectorAll(newNodeSelector).forEach(node => {
                                if(node) callback(node);
                            })
                        });
                    }
                }
            });
            let targetNode = baseElementSelector;
            if (typeof baseElementSelector === 'string') {
                targetNode = document.querySelector(baseElementSelector);
            }
            if (!targetNode) {
                return;
            }
            const config = { attributes: false, childList: true, subtree: true };
            observer.observe(targetNode, config);
        }
        function watchOnEvent(baseElementSelector, eventName, selector, callback) {
            watchOnNewNodes(baseElementSelector, selector, function(node){
                node.addEventListener(eventName, callback);
            });
        }
        function createPhotoAlbumUrl(SERVER_UUID, bookmark) {
            return window.location.pathname + "#"+window.location.origin+"/nmc/rss/server/RB" + SERVER_UUID + ",0/IB" + bookmark + '?start=0&count=30';
        }
        function openPhotoAlbum(SERVER_UUID, bookmark) {
            window.open(createPhotoAlbumUrl(SERVER_UUID, bookmark), '_blank');
        }

        fixLoadedPage();
        hijackXHR();
        addShortcuts();

        watchOnNewNodes('#wrapper', '.byFolderContainer', function(n){
            const link = n.querySelector('.myLibraryBeamContainerNmcLocalDevice');
            const link2 = n.querySelector('.beam-button');
            const title = n.querySelector('.titleContainer');
            if (link && title) {
                const href = '/#' + (title.onclick+'').match(/http[^']+/)[0];
                link.href = href;
                link.title = 'Open album';
                link.style.height = 'auto';
                link.style.marginTop = '7px';
                link.style.background = 'none';
                link.style.backgroundImage = 'none';
                link.innerHTML = '<button><i class="fa fa-external-link"></i></button>';
                link.target = '_blank';
                link.onclick = function(e) {
                    e.stopPropagation();
                };
            }
            else if (link2){
                const a = document.createElement('a');
                a.innerHTML = '<button><i class="fa fa-external-link"></i></button>';
                a.target = '_blank';
                a.href = '/webbrowse#' + (n.onclick+'').match(/http[^']+/)[0];
                link2.parentElement.appendChild(a);
                link2.parentElement.removeChild(link2);
            }
        });
        if (USE_CACHE) {
            /**/
            const footer = document.createElement('div');
            footer.id = 'info_footer';
            footer.style.color = 'black';
            footer.style.padding = '1em';
            footer.style.display = 'none';
            footer.style.position = 'fixed';
            footer.style.background = 'grey';
            document.body.appendChild(footer);
            watchOnEvent('#wrapper', 'mouseleave', '.photoThumbnail', async function (e) {
                footer.innerHTML = '';
                footer.style.display = 'none';
                let pathBtn = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'pathbtn');
            });
            watchOnEvent('#wrapper', 'mouseleave', '.myLibraryMediaIconVideo img', async function (e) {
                footer.innerHTML = '';
                footer.style.display = 'none';
                let pathBtn = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'pathbtn');
            });
            watchOnEvent('#wrapper', 'mouseenter', '.myLibraryMediaIconVideo img', async function (e) {
                var info = cacheGet(this.id);
                if (info) {
                    let btnContainer = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'btncontainer');
                    if (!btnContainer) {
                        btnContainer = document.createElement('div');
                        btnContainer.id = this.id + 'btncontainer';
                        btnContainer.style.position = 'absolute';
                        btnContainer.style.bottom = '0px';
                        let container = this.parentElement.parentElement;
                        container.appendChild(btnContainer);
                    }
                    let aVid = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'avid');
                    if (this.src && !aVid) {
                        const url = fixUrl(info.meta.res[0].value);
                        this.parentElement.href = url;
                        this.parentElement.onclick = function(){};
                        aVid = document.createElement('a');
                        aVid.id = this.id + 'avid';
                        aVid.href = url;
                        aVid.target = '_blank';
                        aVid.title = 'Open video in new tab';
                        aVid.innerHTML = '<button style="font-size:0.8em;"><i class="fa fa-film"></i></button>';
                        btnContainer.appendChild(aVid);
                    }
                    let toAlbumBtn = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'toalbum');
                    if (!toAlbumBtn && (info.meta['upnp:album'] in photoAlbums)) {
                        const a = document.createElement('a');
                        toAlbumBtn = document.createElement('button');
                        toAlbumBtn.id = this.id + 'toalbum';
                        toAlbumBtn.title = 'Open photo album';
                        toAlbumBtn.innerHTML = '<i class="fa fa-external-link"></i>';
                        toAlbumBtn.style.fontSize = '0.8em';
                        btnContainer.appendChild(a);
                        a.target = '_blank';
                        a.href = createPhotoAlbumUrl(status.server_udn, photoAlbums[info.meta['upnp:album']].bookmark);
                        a.appendChild(toAlbumBtn);
                    }

                    if (!info.path) {
                        info.path = await getPath(info.bookmark);
                    }
                    let pathBtn = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'pathbtn');
                    if (!pathBtn) {
                        pathBtn = document.createElement('button');
                        pathBtn.id = this.id + 'pathbtn';
                        pathBtn.title = 'Click to copy file path';
                        pathBtn.innerHTML = '<i class="fa fa-clipboard"></i>';
                        pathBtn.style.fontSize = '0.8em';
                        btnContainer.appendChild(pathBtn);
                        pathBtn.addEventListener('click', function(){
                            GM_setClipboard(info.path);
                        });
                    }
                    footer.innerHTML = ('ALBUM: ' + info.meta['upnp:album'] + '<br>PATH: ' + info.path);
                    footer.style.display = 'block';
                }
            });
            watchOnEvent('#wrapper', 'mouseenter', '.photoThumbnail', async function (e) {
                var info = cacheGet(this.id);
                if (info) {
                    let btnContainer = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'btncontainer');
                    if (!btnContainer) {
                        btnContainer = document.createElement('div');
                        btnContainer.id = this.id + 'btncontainer';
                        btnContainer.style.position = 'absolute';
                        btnContainer.style.bottom = '0px';
                        let container = this.parentElement.parentElement;
                        container.appendChild(btnContainer);
                    }
                    let aImg = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'aimg');
                    if (this.src && !aImg) {
                        aImg = document.createElement('a');
                        aImg.id = this.id + 'aimg';
                        aImg.href = this.src.replace(/\?.*/,'');
                        aImg.target = '_blank';
                        aImg.title = 'Open image in new tab';
                        aImg.innerHTML = '<button style="font-size:0.8em;"><i class="fa fa-photo"></i></button>';
                        btnContainer.appendChild(aImg);
                    }
                    let toAlbumBtn = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'toalbum');
                    if (!toAlbumBtn && (info.meta['upnp:album'] in photoAlbums)) {
                        const a = document.createElement('a');
                        toAlbumBtn = document.createElement('button');
                        toAlbumBtn.id = this.id + 'toalbum';
                        toAlbumBtn.title = 'Open photo album';
                        toAlbumBtn.innerHTML = '<i class="fa fa-external-link"></i>';
                        toAlbumBtn.style.fontSize = '0.8em';
                        btnContainer.appendChild(a);
                        a.target = '_blank';
                        a.href = createPhotoAlbumUrl(status.server_udn, photoAlbums[info.meta['upnp:album']].bookmark);
                        a.appendChild(toAlbumBtn);
                    }

                    if (!info.path) {
                        info.path = await getPath(info.bookmark);
                    }
                    let pathBtn = document.querySelector('#' + this.id.replace(/\$/g,'\\$') + 'pathbtn');
                    if (!pathBtn) {
                        pathBtn = document.createElement('button');
                        pathBtn.id = this.id + 'pathbtn';
                        pathBtn.title = 'Click to copy file path';
                        pathBtn.innerHTML = '<i class="fa fa-clipboard"></i>';
                        pathBtn.style.fontSize = '0.8em';
                        btnContainer.appendChild(pathBtn);
                        pathBtn.addEventListener('click', function(){
                            GM_setClipboard(info.path);
                        });
                    }
                    footer.innerHTML = ('ALBUM: ' + info.meta['upnp:album'] + '<br>PATH: ' + info.path);
                    footer.style.display = 'block';
                }
            });
            window.onmousemove = function (e) {
                footer.style.top = (e.clientY + 20) + 'px';
                footer.style.left = (e.clientX + 20) + 'px';
            };
            /**/
        }

    }
    /**/
})();