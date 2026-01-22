// ==UserScript==
// @name         CHZZK Live Bar
// @version      2.0.0
// @match        https://chzzk.naver.com/*
// @description  치지직 라이브 방송에서 접속 시점부터 최대 1분30초간 되감기가 가능한 재생바를 제공합니다.
// @grant        none
// @author       k22pr
// @namespace    k22pr/chzzk-live-bar
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547123/CHZZK%20Live%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/547123/CHZZK%20Live%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 상수 정의
    const VIDEO_LAYOUT_NAME = "div#live_player_layout";
    const VIDEO_ELEMENT_NAME = "video.webplayer-internal-video";
    const BOTTOM_SEL = "div.pzp-pc__bottom";
    const EDGE_EPS = 0.5;
    const LIVE_EPS = 3.5;
    const MAX_VIDEO_DURATION = 60 * 1.5;

    // CSS 스타일
    const CSS = `
        .live-bar-box{display:flex !important;position:absolute;left:0px;bottom:30px !important;width:100%;font-size:11px;line-height:1;}
        .live-bar-box .live-bar-ui{width:100%;display:flex;gap:8px;align-items:center;color:#fff;padding:6px 8px;}
        .live-bar-box .go{width:45px;border:0;border-radius:6px;padding:2px 8px;background:#868e96;color:#fff;cursor:pointer;font-size:11px;line-height:1;margin-left:4px;}
        .live-bar-box .go.live{background:rgb(221, 51, 51);box-shadow:0px 0px 4px rgba(221, 51, 51, 0.5);}
        .live-bar-box .t{white-space:nowrap;min-width:20px;text-align:center}
        .live-bar-box .time{display:flex;gap:4px;align-items:center}
        .live-bar-box .slide-box{display:flex;flex:1;position:relative;align-items:center;width:100%; height:4px;padding:8px 0px;cursor:pointer;background:transparent;}
        .live-bar-box .slide-box:hover{height:6px;}
        .live-bar-box .slide-box div{transition:width 0.1s, height 0.2s;}
        .live-bar-box .slide-box .track{position:absolute;left:0px;width:100%;height:2px;border-radius:3px;background:rgba(255,255,255,0.5);}
        .live-bar-box .slide-box .rng{position:absolute;left:0px;height:2px;border-radius:3px;background:#00f889;}
        .live-bar-box .slide-box:hover .track{height:6px;border-radius:3px;box-shadow:0px 0px 4px rgba(0,0,0,0.3);}
        .live-bar-box .slide-box:hover .rng{height:6px;border-radius:3px;box-shadow:0px 0px 5px #00f889;}
        .live-bar-box.no-anim .slide-box .rng { transition: none !important; }

        .live-bar-box .hover-tip{
            position:absolute; top:0; transform:translate(-50%,-140%);
            background:rgba(0,0,0,.7); color:#fff; padding:2px 6px; border-radius:4px;
            font-size:11px/1; pointer-events:none;
            opacity:0; transition:opacity .12s;
        }
        .live-bar-box .hover-tip.show{ opacity:1; }
        .live-bar-box .hover-x{
            position:absolute; top:0; bottom:0; width:1px; background:rgba(255,255,255,1);
            transform:translateX(-.5px); opacity:0; transition:opacity .12s;
        }
        .live-bar-box .hover-x.show{ opacity:1; }
    `;

    // 스타일 한 번만 주입
    const styleOnce = (() => {
        let done = false;
        return () => {
            if (done) return;
            done = true;
            const s = document.createElement("style");
            s.textContent = CSS;
            document.head.appendChild(s);
        };
    })();

    // 시간 포맷 함수
    function timeFormat(t) {
        const h = (t / 3600) | 0;
        const m = ((t % 3600) / 60) | 0;
        const s = t % 60 | 0;

        return h
            ? `${t > 0 ? "" : "-"}${Math.abs(h)}:${String(Math.abs(m)).padStart(2, "0")}:${String(Math.abs(s)).padStart(2, "0")}`
            : `${t > 0 ? "" : "-"}${Math.abs(m)}:${String(Math.abs(s)).padStart(2, "0")}`;
    }

    // 재생 가능 범위 계산
    function getEdges(v) {
        const s = v.seekable;
        if (s && s.length) {
            const start = s.start(0);
            const end = s.end(s.length - 1);
            return {
                start: Math.max(start, end - MAX_VIDEO_DURATION),
                end: s.end(s.length - 1),
                ok: true,
            };
        }
        const b = v.buffered;
        if (b && b.length) {
            const start = b.start(0);
            const end = b.end(b.length - 1);
            return {
                start: Math.max(start, end - MAX_VIDEO_DURATION),
                end: b.end(b.length - 1),
                ok: true,
            };
        }
        return { start: 0, end: isFinite(v.duration) ? v.duration : 0, ok: false };
    }

    // 컨트롤 바 컨테이너 찾기
    function findBottomContainer(v) {
        let c = document.querySelector(BOTTOM_SEL);
        if (c) return c;
        let node = v;
        while (node) {
            const root = node.getRootNode?.();
            const host = root && root.host;
            if (!host) break;
            const inHost = root.querySelector?.(BOTTOM_SEL);
            if (inHost) return inHost;
            node = host;
        }
        return null;
    }

    // 라이브 페이지 여부 확인
    function isLivePage() {
        return location.pathname.startsWith("/live/");
    }

    // 재생바 마운트
    function mount(v) {
        if (v.__liveBarMounted) return;
        const bottom = findBottomContainer(v);
        if (!bottom) return;

        styleOnce();

        if (bottom.querySelector(".live-bar-box")) return;

        document.querySelector(`${BOTTOM_SEL} .slider`)?.remove();

        const wrap = document.createElement("div");
        wrap.className = "live-bar-box pzp-pc__progress-slider";
        wrap.innerHTML = `
            <div class="live-bar-ui">
            <div class='slide-box'>
                <div class='track'></div>
                <div class="rng"></div>
            </div>
                <div class='time'>
                    <span class="t total">0:00</span>
                    <button class="go">LIVE</button>
                </div>
            </div>
        `;
        bottom.appendChild(wrap);

        const rng = wrap.querySelector(".rng");
        const tTotal = wrap.querySelector(".total");
        const btn = wrap.querySelector(".go");
        const slide = wrap.querySelector(".slide-box");

        const tip = document.createElement("div");
        tip.className = "hover-tip";
        tip.textContent = "0:00";
        const cross = document.createElement("div");
        cross.className = "hover-x";
        slide.appendChild(cross);
        slide.appendChild(tip);
        let raf = 0;
        let lastEvt = null;

        const useRVFC = "requestVideoFrameCallback" in v;
        let rafId = 0;

        const onMove = (e) => {
            lastEvt = e;
            if (!raf)
                raf = requestAnimationFrame(() => {
                    raf = 0;
                    if (lastEvt) renderAt(lastEvt.clientX);
                });
        };

        function seekFromClick(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            wrap.classList.add("no-anim");
            const rect = slide.getBoundingClientRect();
            const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
            const ratio = rect.width ? x / rect.width : 0;

            const { start, end } = getEdges(v);
            const target = start + ratio * (end - start);
            seekTo(target);

            requestAnimationFrame(() => wrap.classList.remove("no-anim"));
        }

        const atLiveEdge = (currentTime) => {
            const { end } = getEdges(v);
            return currentTime - end > -LIVE_EPS;
        };

        function renderAt(clientX) {
            const rect = slide.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const ratio = rect.width ? x / rect.width : 0;

            const { start, end, ok } = getEdges(v);
            const lo = ok ? start : 0;
            const hi = ok && isFinite(end) ? end : isFinite(v.duration) ? v.duration : lo;
            if (!isFinite(hi) || hi <= lo) return;

            const t = lo + ratio * (hi - lo);
            const nearLive = atLiveEdge(t);

            tip.textContent = nearLive ? "LIVE" : timeFormat(t - hi);
            cross.style.left = `${x}px`;
            tip.style.left = `${x}px`;
        }

        function updateUI() {
            const { start, end } = getEdges(v);

            const percent = (v.currentTime - start) / (end - start);
            if (end - v.currentTime < LIVE_EPS) {
                rng.style.width = "100%";
            } else {
                rng.style.width = `${Math.min(100, percent * 100)}%`;
            }

            const totalTime = Math.max(0, end - start);
            tTotal.textContent = timeFormat(Math.min(totalTime, MAX_VIDEO_DURATION));

            const live = atLiveEdge(v.currentTime);
            if (live) {
                btn.textContent = "LIVE";
                btn.classList.add("live");
            } else {
                btn.textContent = timeFormat(v.currentTime - end + start - totalTime);
                btn.classList.remove("live");
            }
            if (lastEvt) renderAt(lastEvt.clientX);
        }

        function seekTo(val) {
            const { start, end } = getEdges(v);
            const lo = start;
            const hi = end;
            v.currentTime = Math.min(hi - 1, Math.max(lo, val));
        }

        slide.addEventListener("mousedown", seekFromClick);
        document.querySelector(VIDEO_LAYOUT_NAME)?.addEventListener("keydown", (evt) => {
            const e = evt;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                wrap.classList.add("no-anim");

                if (e.key === "ArrowLeft") {
                    seekTo(parseFloat(String(v.currentTime)) - 5);
                } else if (e.key === "ArrowRight") {
                    seekTo(parseFloat(String(v.currentTime)) + 5);
                }

                requestAnimationFrame(() => wrap.classList.remove("no-anim"));
            }
        });

        btn.addEventListener("click", () => {
            const { end, ok } = getEdges(v);
            if (!ok) return;
            seekTo(end - EDGE_EPS);
        });

        slide.addEventListener("pointerenter", (e) => {
            tip.classList.add("show");
            cross.classList.add("show");
            onMove(e);
        }, { passive: true });

        slide.addEventListener("pointermove", onMove, { passive: true });

        slide.addEventListener("pointerleave", () => {
            tip.classList.remove("show");
            cross.classList.remove("show");
        });

        function loopRVFC() {
            v.requestVideoFrameCallback(() => {
                updateUI();
                loopRVFC();
            });
        }
        function loopRAF() {
            updateUI();
            rafId = requestAnimationFrame(loopRAF);
        }

        ["loadedmetadata", "durationchange", "progress", "playing", "pause", "waiting", "seeked", "seeking", "ratechange", "timeupdate", "resize"].forEach((ev) => v.addEventListener(ev, updateUI));

        updateUI();
        if (useRVFC) loopRVFC();
        else loopRAF();

        const mo = new MutationObserver(() => {
            if (!document.contains(v) || !document.contains(wrap)) {
                if (rafId) cancelAnimationFrame(rafId);
                wrap.remove();
                mo.disconnect();
            }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });

        v.__liveBarMounted = true;
    }

    // 요소 감지 옵저버
    function observeElement(options) {
        const { selector, onElementAdded, root = document.documentElement } = options;

        if (onElementAdded) {
            root.querySelectorAll?.(selector)?.forEach(onElementAdded);
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (onElementAdded) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;
                        const el = node;
                        if (el.matches?.(selector)) {
                            onElementAdded(el);
                        }
                        el.querySelectorAll?.(selector)?.forEach(onElementAdded);
                    }
                }
            }
        });

        observer.observe(root, { childList: true, subtree: true });
        return () => observer.disconnect();
    }

    // URL 변경 감지
    function startUrlWatcher(options) {
        const { onPathChange, interval = 500 } = options;
        let lastPath = location.pathname;

        const check = () => {
            const currentPath = location.pathname;
            if (currentPath !== lastPath) {
                const oldPath = lastPath;
                lastPath = currentPath;
                onPathChange(currentPath, oldPath);
            }
        };

        const intervalId = setInterval(check, interval);
        check();

        return () => clearInterval(intervalId);
    }

    // 모든 비디오에 재생바 마운트 시도
    function tryMountAll() {
        if (!isLivePage()) return;
        document.querySelectorAll(VIDEO_ELEMENT_NAME).forEach((v) => {
            const bottom = findBottomContainer(v);
            if (bottom) mount(v);
        });
    }

    // 초기화
    function init() {
        tryMountAll();

        // 비디오 요소 추가 감지
        observeElement({
            selector: VIDEO_ELEMENT_NAME,
            onElementAdded: () => tryMountAll(),
        });

        // 컨트롤 바 추가 감지
        observeElement({
            selector: BOTTOM_SEL,
            onElementAdded: () => tryMountAll(),
        });

        // URL 변경 감지
        startUrlWatcher({
            onPathChange: () => tryMountAll(),
            interval: 500,
        });
    }

    // DOM 준비 후 실행
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
