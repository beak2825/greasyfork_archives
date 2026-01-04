// ==UserScript==
// @name         아카라이브 방문기록 영구저장
// @license      MIT
// @author       saradapang
// @description  IndexedDB로 방문 기록 저장, body 높이 및 게시글 클릭 시 링크 정보 갱신
// @namespace    http://tampermonkey.net
// @version      1.5
// @match        https://arca.live/b/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/532564/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%B0%A9%EB%AC%B8%EA%B8%B0%EB%A1%9D%20%EC%98%81%EA%B5%AC%EC%A0%80%EC%9E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/532564/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%B0%A9%EB%AC%B8%EA%B8%B0%EB%A1%9D%20%EC%98%81%EA%B5%AC%EC%A0%80%EC%9E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DB_NAME = 'ArcaVisitedDB';
    const DB_VERSION = 2;
    const STORE_NAME = 'visitedPosts';
    let db = null;

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = () => {
                const upgradeDB = request.result;
                if (upgradeDB.objectStoreNames.contains(STORE_NAME)) {
                    upgradeDB.deleteObjectStore(STORE_NAME);
                }
                upgradeDB.createObjectStore(STORE_NAME);
            };

            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };

            request.onerror = (event) => {
                console.error('IndexedDB open error', event);
                reject(event);
            };
        });
    }

    function setVisitedPost(postPath, dateString) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(postPath);
            req.onsuccess = () => {
                let readCount = 1;
                if (req.result) {
                    readCount = (req.result.readCount || 1) + 1;
                }
                store.put({ visitedAt: dateString, readCount: readCount }, postPath);
            };
            tx.oncomplete = () => resolve();
            tx.onerror = (e) => {
                console.error('setVisitedPost error', e);
                reject(e);
            };
        });
    }

    function getVisitedPostsForPaths(paths) {
        return new Promise((resolve, reject) => {
            const results = {};
            if (!paths || paths.length === 0) {
                resolve(results);
                return;
            }

            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            let pending = paths.length;

            paths.forEach((path) => {
                const req = store.get(path);
                req.onsuccess = () => {
                    if (req.result) {
                        results[path] = req.result;
                    }
                    pending--;
                    if (pending === 0) resolve(results);
                };
                req.onerror = (e) => {
                    console.error('IndexedDB get error', e);
                    pending--;
                    if (pending === 0) resolve(results);
                };
            });
        });
    }

    function clearAllVisitedPosts() {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = (e) => {
                console.error('clearAllVisitedPosts error', e);
                reject(e);
            };
        });
    }

    GM_registerMenuCommand("방문 기록 초기화 (IndexedDB)", () => {
        if (confirm("정말 방문 기록을 초기화 하시겠습니까?")) {
            clearAllVisitedPosts().then(() => {
                alert("방문 기록이 모두 초기화되었습니다.");
            }).catch(e => {
                alert("초기화 중 오류가 발생했습니다. 콘솔을 확인하세요.");
                console.error(e);
            });
        }
    });

    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }

    function updateArticleLinks() {
        const articleLinks = document.querySelectorAll('.list-table a.vrow');
        const postPaths = [];
        articleLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/b/')) {
                const baseUrl = href.split('?')[0];
                postPaths.push(baseUrl);
            }
        });

        getVisitedPostsForPaths(postPaths).then(visitedMap => {
            articleLinks.forEach((link, linkIndex) => {
                const href = link.getAttribute('href');
                if (!href) return;
                const baseUrl = href.split('?')[0];
                const record = visitedMap[baseUrl];
                if (record) {
                    link.style.backgroundColor = linkIndex % 2 === 0
                        ? 'rgba(169,169,169,0.5)'
                        : 'rgba(211,211,211,0.5)';
                    link.style.color = '#000';
                    const titleElement = link.querySelector('.vcol.col-title .title');
                    if (titleElement && !titleElement.querySelector('.visited-info')) {
                        const visitInfo = document.createElement('div');
                        visitInfo.className = 'visited-info';
                        visitInfo.style.fontSize = '10px';
                        visitInfo.style.marginTop = '2px';
                        const dt = new Date(record.visitedAt);
                        const readCount = record.readCount || 1;
                        visitInfo.textContent = 'Last visited: ' + dt.toLocaleString() + ' (' + readCount + '회 읽음)';
                        titleElement.appendChild(visitInfo);
                    }
                }
            });
        }).catch(e => {
            console.error('방문 기록 조회 오류', e);
        });
    }

    function observeBodyHeightChanges(callback) {
        const resizeObserver = new ResizeObserver(() => {
            callback();
        });
        resizeObserver.observe(document.body);
    }

    function observeArticleClicks(callback) {
        document.body.addEventListener('mousedown', (e) => {
            const isLeftOrMiddleClick = e.button === 0 || e.button === 1;
            const target = e.target.closest('.list-table a.vrow');
            if (isLeftOrMiddleClick && target) {
                callback();
            }
        });
    }


    openDB().then(() => {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);

        // 게시글 상세 페이지
        if (pathSegments.length >= 3) {
            const postPath = '/' + pathSegments.slice(0, 3).join('/');
            setVisitedPost(postPath, new Date().toISOString())
                .catch(e => console.error('방문 기록 저장 오류', e));
        }

        // 게시글 목록 페이지
        if (pathSegments.length === 2) {
            const debouncedUpdate = debounce(updateArticleLinks, 300);
            setTimeout(() => {
                updateArticleLinks();
                observeBodyHeightChanges(debouncedUpdate);
                observeArticleClicks(debouncedUpdate);
            }, 500);
        }
    }).catch(e => {
        console.error('IndexedDB 열기 실패', e);
    });
})();
