// ==UserScript==
// @name         图片悬浮放大工具（稳定修正版）
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  悬浮图片显示放大按钮；不改DOM；支持缩放/旋转/翻转/左右键拖拽；按钮点击不触发原事件
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544249/%E5%9B%BE%E7%89%87%E6%82%AC%E6%B5%AE%E6%94%BE%E5%A4%A7%E5%B7%A5%E5%85%B7%EF%BC%88%E7%A8%B3%E5%AE%9A%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544249/%E5%9B%BE%E7%89%87%E6%82%AC%E6%B5%AE%E6%94%BE%E5%A4%A7%E5%B7%A5%E5%85%B7%EF%BC%88%E7%A8%B3%E5%AE%9A%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .tm-zoom-icon {
            position: absolute;
            width: 24px;
            height: 24px;
            background: rgba(255,255,255,.7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
            opacity: 0;
            transition: opacity .2s;
            z-index: 999999;
            user-select: none;
        }
        .tm-zoom-icon:hover { background: rgba(255,255,255,.95); }

        .tm-zoom-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999998;
            cursor: grab;
        }
        .tm-zoom-overlay.grabbing { cursor: grabbing; }

        .tm-zoom-img {
            max-width: 90%;
            max-height: 90%;
            transition: transform .15s;
            pointer-events: none;
            user-select: none;
        }

        .tm-btn {
            position: fixed;
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,.6);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
            z-index: 999999;
        }
        .tm-btn:hover { background: rgba(0,0,0,.85); }

        .tm-close { right: 20px; top: 20px; }
        .tm-rotate { right: 20px; top: 80px; }
        .tm-flip { right: 20px; top: 140px; }
        .tm-reset { right: 20px; top: 200px; }
    `);

    let icon, iconParent;

    // 只初始化一次 icon
    icon = document.createElement('div');
    icon.className = 'tm-zoom-icon';
    icon.innerHTML = '<svg t="1754016487003" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2732" width="16" height="16"><path d="M919.920093 725.414549q3.014188 26.122962 7.033105 58.776664t7.53547 66.814498 7.53547 67.819227 7.033105 60.786122q6.028376 47.222277-41.193901 44.208089-25.118232-2.009459-56.767205-5.526011t-64.805039-7.53547-65.809769-8.037834-59.781393-7.033105q-29.137149-3.014188-37.174984-16.578033t9.042564-30.644243q11.052022-10.047293 27.127691-27.630056t27.127691-28.634785q11.052022-12.056752 7.033105-22.104044t-16.075669-23.108774q-28.13242-27.127691-51.241194-49.231735t-51.241194-51.241194q-6.028376-6.028376-12.056752-13.061481t-9.042564-15.573304-1.004729-18.085127 13.061481-20.59695q6.028376-6.028376 10.047293-10.549658t8.037834-8.037834 8.540199-8.037834 11.554387-12.559116q20.094586-20.094586 37.174984-17.080398t37.174984 23.108774 41.193901 40.691536 47.222277 46.719912q19.089857 18.085127 32.653702 25.118232t26.625326-6.028376q9.042564-9.042564 22.606409-21.60168t23.611138-22.606409q17.080398-17.080398 30.644243-13.061481t16.578033 30.141879zM43.79615 383.80659q-3.014188-26.122962-7.033105-58.776664t-7.53547-66.814498-7.53547-67.819227-7.033105-60.786122q-3.014188-26.122962 6.53074-36.170255t33.658431-8.037834q25.118232 2.009459 56.767205 5.526011t64.805039 7.53547 65.809769 8.037834 59.781393 7.033105q30.141879 3.014188 37.677348 16.578033t-9.544928 30.644243q-10.047293 10.047293-24.615868 26.122962t-25.620597 27.127691q-12.056752 12.056752-8.037834 22.104044t17.080398 23.108774q13.061481 14.06621 24.615868 24.615868t22.606409 21.099315 23.108774 22.606409l25.118232 25.118232q6.028376 6.028376 11.554387 14.06621t8.037834 17.080398-0.502365 19.089857-13.061481 20.094586l-11.052022 11.052022q-4.018917 4.018917-7.53547 8.037834t-8.540199 8.037834l-11.052022 12.056752q-20.094586 20.094586-34.663161 15.070939t-34.663161-25.118232-38.179713-37.677348-44.208089-43.705724q-18.085127-18.085127-32.151337-25.118232t-27.127691 6.028376q-9.042564 10.047293-25.118232 24.615868t-26.122962 24.615868q-17.080398 17.080398-30.141879 13.061481t-16.075669-30.141879zM905.853883 84.397261q26.122962-3.014188 36.170255 6.53074t8.037834 34.663161-5.526011 56.767205-7.53547 64.805039-8.037834 65.809769-7.033105 59.781393q-3.014188 29.137149-16.578033 37.174984t-30.644243-10.047293q-10.047293-10.047293-26.122962-24.615868t-27.127691-25.620597q-12.056752-11.052022-22.104044-7.53547t-23.108774 16.578033q-27.127691 27.127691-47.724641 49.231735t-48.729371 50.236465q-6.028376 6.028376-14.06621 11.554387t-17.080398 8.037834-19.089857-0.502365-20.094586-14.06621q-6.028376-6.028376-10.549658-10.047293t-8.540199-8.037834-8.540199-8.037834-11.554387-12.056752q-20.094586-20.094586-16.075669-35.165525t25.118232-35.165525l38.179713-40.189172q19.089857-20.094586 45.212818-46.217547 19.089857-18.085127 26.122962-32.151337t-7.033105-26.122962q-9.042564-9.042564-23.108774-24.615868t-24.113503-25.620597q-17.080398-17.080398-13.061481-30.141879t30.141879-16.075669 58.776664-7.033105 67.316863-7.53547 67.819227-7.53547 60.283758-7.033105zM350.238584 640.012559q6.028376 6.028376 10.549658 10.047293t8.540199 8.037834l8.037834 9.042564 12.056752 11.052022q20.094586 20.094586 17.582763 36.672619t-23.611138 37.677348q-19.089857 19.089857-40.189172 40.691536t-47.222277 47.724641q-18.085127 18.085127-22.606409 29.639514t8.540199 24.615868q10.047293 9.042564 22.606409 22.606409t22.606409 23.611138q17.080398 17.080398 12.559116 30.141879t-30.644243 16.075669-58.274299 7.033105-66.814498 8.037834-68.321592 8.037834-60.786122 7.033105q-25.118232 2.009459-35.66789-7.53547t-8.540199-33.658431q2.009459-25.118232 5.526011-56.767205t7.53547-64.805039 8.037834-65.809769 7.033105-59.781393q3.014188-30.141879 16.578033-37.677348t30.644243 9.544928q10.047293 10.047293 27.630056 26.122962t28.634785 27.127691q12.056752 12.056752 20.094586 10.549658t20.094586-14.568575q13.061481-13.061481 25.118232-25.620597t24.113503-24.615868 24.615868-25.118232 26.625326-27.127691q6.028376-6.028376 13.061481-12.056752t15.573304-9.042564 18.085127-0.502365 20.59695 13.563845z" p-id="2733"></path></svg>';


    // 🔒 关键：只拦截 mousedown / mouseup，不拦截 click 本身
    ['mousedown', 'mouseup'].forEach(type => {
        icon.addEventListener(type, e => {
            e.preventDefault();
            e.stopPropagation();
        }, true);
    });

    // click：只阻止冒泡，允许自己执行
    icon.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        showZoom(icon._imgSrc);
    });

    // 悬浮图片显示 icon
    document.addEventListener('mouseover', e => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement)) return;
        if (img.width < 50 || img.height < 50) return;

        let parent = img.offsetParent || img.parentNode;
        if (!parent) return;

        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        if (iconParent !== parent) {
            icon.remove();
            parent.appendChild(icon);
            iconParent = parent;
        }

        const r = img.getBoundingClientRect();
        const pr = parent.getBoundingClientRect();

        icon.style.left = (r.right - pr.left - 28) + 'px';
        icon.style.top = (r.top - pr.top + 4) + 'px';
        icon.style.opacity = 1;

        icon._imgSrc = img.src;
    });

    document.addEventListener('mouseout', e => {
        const to = e.relatedTarget;
        if (to === icon) return;
        if (iconParent && iconParent.contains(to)) return;
        icon.style.opacity = 0;
    });

    // ===== 放大查看 =====
    function showZoom(src) {
        const overlay = document.createElement('div');
        overlay.className = 'tm-zoom-overlay';

        const img = document.createElement('img');
        img.className = 'tm-zoom-img';
        img.src = src;

        const close = btn('tm-btn tm-close', '×');
        const rotate = btn('tm-btn tm-rotate', '↻');
        const flip = btn('tm-btn tm-flip', '⇋');
        const reset = btn('tm-btn tm-reset', '⟲');

        overlay.appendChild(img);
        document.body.append(overlay, close, rotate, flip, reset);
        document.body.style.overflow = 'hidden';

        let scale = 1, x = 0, y = 0, deg = 0, flipX = 1;
        let dragging = false, sx, sy;

        const apply = () => {
            img.style.transform =
                `translate(${x}px,${y}px) scale(${scale * flipX},${scale}) rotate(${deg}deg)`;
        };

        overlay.addEventListener('mousedown', e => {
            if (e.button !== 0 && e.button !== 2) return;
            dragging = true;
            sx = e.clientX - x;
            sy = e.clientY - y;
            overlay.classList.add('grabbing');
            e.preventDefault();
        });

        overlay.addEventListener('mousemove', e => {
            if (!dragging) return;
            x = e.clientX - sx;
            y = e.clientY - sy;
            apply();
        });

        overlay.addEventListener('mouseup', () => {
            dragging = false;
            overlay.classList.remove('grabbing');
        });

        overlay.addEventListener('contextmenu', e => e.preventDefault());

        overlay.addEventListener('wheel', e => {
            e.preventDefault();
            scale += e.deltaY > 0 ? -0.1 : 0.1;
            scale = Math.max(0.1, scale);
            apply();
        });

        rotate.onclick = () => { deg = (deg + 90) % 360; apply(); };
        flip.onclick = () => { flipX *= -1; apply(); };
        reset.onclick = () => { scale=1; x=y=0; deg=0; flipX=1; apply(); };

        function closeAll() {
            overlay.remove();
            close.remove();
            rotate.remove();
            flip.remove();
            reset.remove();
            document.body.style.overflow = '';
        }

        close.onclick = closeAll;
        overlay.onclick = e => { if (e.target === overlay) closeAll(); };
    }

    function btn(cls, txt) {
        const d = document.createElement('div');
        d.className = cls;
        d.innerHTML = txt;
        return d;
    }

})();
