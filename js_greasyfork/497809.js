// ==UserScript==
// @name         YT時間軸書籤bookmarks
// @namespace    https://greasyfork.org/zh-TW/users/4839-leadra
// @version      1.1.2
// @description  自動記憶[臨時時間戳]+自定義3個書籤
// @description:en  youtube timeline for Automatic memory [temporary timestamp] + custom 3 bookmarks
// @author       puzzle
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/live/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497809/YT%E6%99%82%E9%96%93%E8%BB%B8%E6%9B%B8%E7%B1%A4bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/497809/YT%E6%99%82%E9%96%93%E8%BB%B8%E6%9B%B8%E7%B1%A4bookmarks.meta.js
// ==/UserScript==
//原作者https://greasyfork.org/users/115438-puzzle
//localStorage改成sessionStorage，關閉網頁就刪除紀錄
(async function() {
    'use strict';

    const __helper = {
        $: (sel, parent = document) => parent.querySelector(sel),
        $$: (sel, parent = document) => Array.from(parent.querySelectorAll(sel)),
        async waitUntilExist(selector) {
            return new Promise((resolve, reject) => {
                let timer = setInterval(function (e) {
                    const el = document.querySelector(selector);
                    if (el) {
                        clearInterval(timer);
                        resolve(el);
                    }
                }, 100);
            });
        }
    }
    const {$, $$, waitUntilExist} = __helper;


    const progressBar = {
        elem: await waitUntilExist('.ytp-progress-bar'),
        get ariaValueMin() {
            return this.elem.ariaValueMin;
        },
        get ariaValueNow() {
            return this.elem.ariaValueNow;
        },
        get ariaValueMax() {
            return this.elem.ariaValueMax;
        },
        mouseDown: false,
    };

    const video = {
        elem: await waitUntilExist('video'),
        get offset() {
            return Math.max(video.elem.currentTime - this.ytCurrentTime, 0);
        },
        get ytCurrentTime() {
            return progressBar.ariaValueNow - progressBar.ariaValueMin;
        },
        get ytDuration() {
            return progressBar.ariaValueMax - progressBar.ariaValueMin;
        },
        get currentTime() {
            return this.ytCurrentTime - this.offset;
        },
        set currentTime(value) {
            console.log(`set currentTime: ${value}`);
            video.elem.currentTime = Math.max(value + this.offset, 0);
        },
        get duration() {
            return video.elem.duration;
        }
    };

    let isLiveStream = !!$('.ytp-time-display.ytp-live');
    let hasChapters = !!$('.ytp-chapters-container')?.children?.length;


    progressBar.elem.insertAdjacentHTML('beforeEnd', `
            <style>
                #userscript-bookmarks {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 50;
                    top: 0;

                    & .bookmark:not([style]),
                    & .bookmark[data-description='']::before{ display: none; }

                    & .bookmark {
                        position: absolute;
                        transform: translate(-50%,-50%);
                        border: clamp(10px,2.5vh, 18px) solid transparent;
                        border-top: clamp(10px,2.5vh, 18px) solid orange;
                    }
                    & .bookmark:hover::before {
                        content: attr(data-description);
                        position: absolute;
                        font-size: clamp(12px, 2.5vh, 16px);
                        background: black;
                        padding: 5px;
                        border-radius: 5px;
                        white-space: nowrap;
                    }
                    & .bookmark::after {
                        content: attr(data-num);
                        position: absolute;
                        transform: translate(-50%, -100%);
                        color: black;
                        font-size: clamp(10px, 2.5vh, 14px);
                    }
                }
                #userscript-recent-positions {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 50;
                    top: 0;

                    & .position {
                        position: absolute;
                        width: 3px;
                        height: 1vh;
                        transform: translate(-50%);
                    }

                }
            </style>
            <div id='userscript-bookmarks'>
                <span class='bookmark' data-num='1' data-description=''></span>
                <span class='bookmark' data-num='2' data-description=''></span>
                <span class='bookmark' data-num='3' data-description=''></span>
            </div>
            <div id='userscript-recent-positions'>
                <span class='position' data-num='1'></span>
                <span class='position' data-num='2'></span>
            </div>
        `);


    const positions = {
        state: {
            prev: 0,
            current: 0,
        },

        elems: {
            container: $('#userscript-recent-positions'),
            get list() { return [...this.container.children] },
        },

        toggle() {
            [this.state.prev, this.state.current] = [this.state.current, this.state.prev];
            console.log(`toggle(): this.state.prev, this.state.current = ${this.state.prev}, ${this.state.current}`);
            video.currentTime = this.state.current;
        },

        reset() {
            positions.state.prev = 0;
            positions.state.current = 0;
        },

        markers: {
            async set(num, time, type) {
                isLiveStream || await videoLoaded();

                const elem = positions.elems.list[num-1];

                switch (type) {
                    case 'current': elem.style.background = 'lime'; break;
                    case 'prev': elem.style.background = 'snow'; break;
                }

                const offset = (time || video.ytCurrentTime) * 100 / video.ytDuration;
                elem.style.left = `${offset}%`;
            }
        },
    };


    const bookmarks = {
        state: [],

        elems: {
            container: $('#userscript-bookmarks'),
            get list() { return [...this.container.children] }

        },

        _resetState(num = null) {
            if (num) {
                this.state[num-1] = null;
            } else {
                this.state = []
            }
        },

        set(num, time, description = '') {
            this._markers._set(num, time + video.offset);
            this.descriptions.set(num, description);
            time = time || video.ytCurrentTime;
            this.state[num-1] = time;
        },


        reset(num = null) { this._markers._remove(num); this._resetState(num); this.descriptions._reset(num); },
        call(num) { video.currentTime = this.state[num-1]; },

        _markers: {
            async _set(num, time) {
                isLiveStream || await videoLoaded();
                const elem = bookmarks.elems.list[num-1];
                const offset = (time || video.ytCurrentTime) * 100 / video.ytDuration;
                elem.style.left = `${offset}%`;
            },

            _remove(num = null) {
                if (num) {
                    bookmarks.elems.list[num-1].removeAttribute('style');
                } else {
                    bookmarks.elems.list.forEach( bookmark => {
                        bookmark.removeAttribute('style');
                    })
                }
            },
        },

        descriptions: {
            set(num, description = '') {
                bookmarks.elems.list[num-1].dataset.description = description;
            },

            _reset(num = null) {
                if (num) {
                    bookmarks.elems.list[num-1].dataset.description = '';
                } else {
                    bookmarks.elems.list.forEach( bookmark => {
                        bookmark.dataset.description = '';
                    })
                }
            },
        },

        sessionStorage: {
            save(num,time,description = '') {
                const videoID = new URLSearchParams(location.search).get('v');
                const storedBookmarks = (sessionStorage[videoID] && JSON.parse(sessionStorage[videoID])) || [];
                time = time || video.ytCurrentTime;
                storedBookmarks[num-1] = {num, time, description};
                sessionStorage[videoID] = JSON.stringify(storedBookmarks);
            },

            restore() {
                const videoID = new URLSearchParams(location.search).get('v');
                if (!sessionStorage[videoID]) return;
                const storedBookmarks = JSON.parse(sessionStorage[videoID]);
                storedBookmarks.forEach(bookmark => {
                    bookmark && bookmarks.set(bookmark.num, bookmark.time, bookmark.description);
                })
            },

            remove(num = null) {
                const videoID = new URLSearchParams(location.search).get('v');
                if (num) {
                    const storedBookmarks = JSON.parse(sessionStorage[videoID]);
                    if (storedBookmarks.length > 1) {
                        storedBookmarks[num-1] = null;
                        sessionStorage[videoID] = JSON.stringify(storedBookmarks);
                        return;
                    }
                }
                delete sessionStorage[videoID];
            },
        },
    };


    async function videoLoaded() {
        return new Promise( (res, rej) => {
            setTimeout(function loop() {
                if (video.elem.duration) {
                    return res();
                }
                setTimeout(loop, 100);
            },0)
        })
    }

//滑鼠事件ctrl=跳；shift=刪除；0=click
    document.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('bookmark')) {
            const bookmarkDataset = e.target.dataset;
            e.preventDefault();
            e.stopPropagation();
            if (e.button === 0 & e.ctrlKey) {
                    bookmarks.call(bookmarkDataset.num);
                    return;
                }else if (e.button === 0 & e.shiftKey) {
                    bookmarks.reset(bookmarkDataset.num);
                    bookmarks.sessionStorage.remove(bookmarkDataset.num);
                    return;
                }
        }
    }, true)


    document.addEventListener('keydown', e => {

        if (e.target.isContentEditable || e.target.tagName === 'INPUT') return;
//快速鍵
        const hotkeys = {
            switchRecentPositions: 'F1',
            bookmark1: 'Digit1',
            bookmark2: 'Digit2',
            bookmark3: 'Digit3',
            resetBookmarks: 'Digit0',
            resetBookmarks2: 'Digit4',
            modifierCall: 'ctrlKey',
            modifierDelete: 'shiftKey',
            //modifierDescription: 'altKey',
        };

        if (!Object.values(hotkeys).some( key => key === e.code)) return;

        e.preventDefault();
        e.stopPropagation();

        const processBookmark = (num) => {
            const modifierCall = e[hotkeys.modifierCall],
                  modifierDelete = e[hotkeys.modifierDelete],
                  modifierDescription = e[hotkeys.modifierDescription];

            if (modifierCall) {
                bookmarks.call(num);
            } else if (modifierDelete) {
                bookmarks.reset(num);
                bookmarks.sessionStorage.remove(num);
            } else if (modifierDescription) {
                const description = prompt('Bookmark description', bookmarks.elems.list[num-1].dataset.description) || '';
                bookmarks.descriptions.set(num, description);
                bookmarks.sessionStorage.save(num, bookmarks.state[num-1], description);
            } else {
                bookmarks.set(num);
                bookmarks.sessionStorage.save(num);
            }
        };


        if (e.code === hotkeys.switchRecentPositions) {
            positions.toggle();
        } else if (e.code === hotkeys.bookmark1) {
            processBookmark(1);
        } else if (e.code === hotkeys.bookmark2) {
            processBookmark(2);
        } else if (e.code === hotkeys.bookmark3) {
            processBookmark(3);
        } else if (e.code === hotkeys.resetBookmarks||hotkeys.resetBookmarks2) {
            bookmarks.reset();
            bookmarks.sessionStorage.remove();
        }

    }, true)


//跳20秒以上，更新記憶點(不分滑鼠、快速鍵)
    video.elem.addEventListener('timeupdate', function() {
      //if (progressBar.mouseDown && Math.abs(video.ytCurrentTime - positions.state.current) > 20) {
      if (Math.abs(video.ytCurrentTime - positions.state.current) > 20) {
            positions.state.prev = positions.state.current;
        }
        positions.state.current = video.ytCurrentTime;
        positions.markers.set(1, positions.state.prev, 'prev');
        positions.markers.set(2, positions.state.current, 'current');
        progressBar.mouseDown = false;
    })

    progressBar.elem.addEventListener('mousedown', function() {
        progressBar.mouseDown = true;
    }, true)


    document.addEventListener('yt-navigate-finish', e => {
        isLiveStream = !!$('.ytp-time-display.ytp-live');
        hasChapters = !!$('.ytp-chapters-container')?.children?.length;
        positions.reset();
        bookmarks.reset();
        bookmarks.sessionStorage.restore();
    })

})();