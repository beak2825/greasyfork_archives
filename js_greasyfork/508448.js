// ==UserScript==
// @name         XButtonx
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  calc umur, auto reload, hapus Ads, darkmode
// @author       xkhd
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508448/XButtonx.user.js
// @updateURL https://update.greasyfork.org/scripts/508448/XButtonx.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Floating main button ---
    const floatingBtn = document.createElement('div');
    floatingBtn.style.cssText = `
        position: fixed; bottom: 60px; right: 60px;
        width: 60px; height: 60px; border-radius: 50%;
        overflow: hidden; z-index: 9999; cursor: pointer;
        border: 3px solid #007bff; background: #fff;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.3s ease; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    const iconImg = document.createElement('img');
    iconImg.src = 'https://lh3.googleusercontent.com/a/AGNmyxaEnKjzfKogUt2-V-11G5OAQMl0OZKBz7562IzJ=s96-c';
    iconImg.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 50%;';
    floatingBtn.appendChild(iconImg);
    document.body.appendChild(floatingBtn);

    // --- Button container (positioned relative to floating button center) ---
    const btnContainer = document.createElement('div');
    // offset to align with floatingBtn center (floatingBtn bottom/right are 60px)
    btnContainer.style.cssText = `
        position: fixed; bottom: 90px; right: 90px;
        width: 0; height: 0; z-index: 9998; pointer-events: none;
    `;
    document.body.appendChild(btnContainer);

    const menuButtons = [];

    // --- Helper: create tooltip element for a button ---
    function makeTooltip(text) {
        const tip = document.createElement('div');
        tip.textContent = text;
        tip.style.cssText = `
            position: absolute;
            bottom: 130%;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            padding: 6px 8px;
            background: rgba(0,0,0,0.85);
            color: #fff;
            font-size: 12px;
            border-radius: 6px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.18s ease, transform 0.18s ease;
            transform-origin: bottom center;
            z-index: 10001;
        `;
        return tip;
    }

    // --- SVG icons (inline) ---
    const SVG = {
        calc: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="lime" stroke-width="1.6" fill="#ffffff"/>
                <path d="M7 7h10M7 11h10M7 15h10" stroke="lime" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>`,
        reload: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M21 12a9 9 0 10-2.6 6.1L21 21v-4.1" stroke="blue" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>`,
        removeAds: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <circle cx="12" cy="12" r="8" stroke="red" stroke-width="1.6" fill="#ffffff"/>
                      <path d="M8 8l8 8M16 8l-8 8" stroke="red" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>`,
        dark: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                 <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="orange" stroke-width="1.4" fill="#ffffff"/>
               </svg>`
    };

    // --- Create a menu button with SVG and tooltip text ---
    function createIconButton(svgHTML, tooltipText, callback) {
        const btn = document.createElement('button');
        btn.innerHTML = svgHTML;
        btn.setAttribute('aria-label', tooltipText);
        btn.style.cssText = `
            position: absolute;
            width: 36px; height: 36px; /* rectangle-ish for nicer alignment */
            display:flex; align-items:center; justify-content:center;
            transform: translate(0px, 0px);
            opacity: 0;
            transition: transform 0.38s cubic-bezier(.2,.9,.2,1), opacity 0.28s ease;
            pointer-events: auto;
            background: transparent;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 6px;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        `;

        // tooltip
        const tip = makeTooltip(tooltipText);
        btn.appendChild(tip);

        // mouse handlers (use dataset tx,ty that will be set later)
        btn.addEventListener('mouseenter', () => {
            const tx = parseFloat(btn.dataset.tx || 0);
            const ty = parseFloat(btn.dataset.ty || 0);
            btn.style.transform = `translate(${tx}px, ${ty}px) scale(1.08)`;
            btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.28)';
            tip.style.opacity = '1';
            tip.style.transform = 'translateX(-50%) translateY(-6px)';
        });
        btn.addEventListener('mouseleave', () => {
            const tx = parseFloat(btn.dataset.tx || 0);
            const ty = parseFloat(btn.dataset.ty || 0);
            btn.style.transform = `translate(${tx}px, ${ty}px) scale(1)`;
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.18)';
            tip.style.opacity = '0';
            tip.style.transform = 'translateX(-50%) translateY(0)';
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // avoid closing menu if needed
            callback && callback(e);
        });

        btnContainer.appendChild(btn);
        menuButtons.push(btn);
        return btn;
    }

    // --- Kalkulator Umur (statis) ---
    function showAgeCalculator() {
        const container = document.createElement('div');
        container.style.cssText = `
            all: initial;
            font-family: Arial, sans-serif;
            font-size: 14px;
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.25);
            z-index: 10000; min-width: 300px;
            color: #000000;
        `;
        container.innerHTML = `
            <h3 style="margin:0 0 10px 0; font-size:16px; font-weight:700; color:#222;">Kalkulator Umur</h3>
            <label style="display:block; margin-bottom:6px; color:#333;">Tanggal Lahir:</label>
            <input type="date" id="birthDate" style="padding:8px; width:100%; margin-bottom:12px; border:1px solid #ddd; border-radius:6px;">
            <label style="display:block; margin-bottom:6px; color:#333;">Tanggal Acuan:</label>
            <input type="date" id="refDate" value="${new Date().toISOString().split('T')[0]}" style="padding:8px; width:100%; margin-bottom:12px; border:1px solid #ddd; border-radius:6px;">
            <div style="display:flex; gap:10px; justify-content:space-between; margin-top:8px;">
                <button id="calcBtn" style="flex:1; background:#007bff; color:#fff; padding:8px; border:none; border-radius:6px; cursor:pointer;">Hitung</button>
                <button id="closeBtn" style="flex:1; background:#6c757d; color:#fff; padding:8px; border:none; border-radius:6px; cursor:pointer;">Tutup</button>
            </div>
            <div id="result" style="margin-top:14px; font-weight:700; color:#222;"></div>
        `;

        document.body.appendChild(container);

        container.querySelector('#closeBtn').onclick = () => container.remove();
        container.querySelector('#calcBtn').onclick = () => {
            const birthVal = container.querySelector('#birthDate').value;
            const refVal = container.querySelector('#refDate').value;
            const birth = birthVal ? new Date(birthVal) : NaN;
            const ref = refVal ? new Date(refVal) : NaN;
            if (isNaN(birth) || isNaN(ref)) {
                alert("Mohon masukkan kedua tanggal.");
                return;
            }
            if (ref < birth) {
                alert("Tanggal acuan tidak boleh sebelum tanggal lahir.");
                return;
            }
            const age = calcAge(birth, ref);
            container.querySelector('#result').textContent =
                `${age.years} tahun, ${age.months} bulan, ${age.days} hari`;
        };
    }

    function calcAge(birth, ref) {
        let years = ref.getFullYear() - birth.getFullYear();
        let months = ref.getMonth() - birth.getMonth();
        let days = ref.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return { years, months, days };
    }

    // --- Placeholder Auto Reload ---
    function showAutoReloadPopup() {
        // Example implementation: simple popup with interval in minutes (you can extend)
        const container = document.createElement('div');
        container.style.cssText = `
            all: initial;
            font-family: Arial, sans-serif;
            font-size: 14px;
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 16px;
            border-radius: 10px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.25);
            z-index: 10000; min-width: 280px;
            color: #000;
        `;
        container.innerHTML = `
            <h3 style="margin:0 0 10px 0; font-size:16px; color:#222;">Auto Reload</h3>
            <label style="display:block; margin-bottom:6px;">Interval (menit)</label>
            <input id="reloadMin" type="number" min="1" placeholder="Menit" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:6px;">
            <div style="display:flex; gap:8px; margin-top:10px;">
                <button id="startReload" style="flex:1; background:#007bff; color:#fff; padding:8px; border:none; border-radius:6px; cursor:pointer;">Mulai</button>
                <button id="stopReload" style="flex:1; background:#6c757d; color:#fff; padding:8px; border:none; border-radius:6px; cursor:pointer;">Berhenti</button>
            </div>
            <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                <button id="closeReload" style="background:transparent; border:none; color:#007bff; cursor:pointer;">Tutup</button>
            </div>
        `;
        document.body.appendChild(container);

        let intervalRef = null;
        container.querySelector('#startReload').onclick = () => {
            const m = parseInt(container.querySelector('#reloadMin').value, 10);
            if (isNaN(m) || m <= 0) {
                alert('Masukkan interval (menit) yang valid.');
                return;
            }
            if (intervalRef) clearInterval(intervalRef);
            intervalRef = setInterval(() => location.reload(), m * 60 * 1000);
            alert(`Auto reload setiap ${m} menit diaktifkan.`);
        };
        container.querySelector('#stopReload').onclick = () => {
            if (intervalRef) {
                clearInterval(intervalRef);
                intervalRef = null;
                alert('Auto reload dihentikan.');
            } else alert('Auto reload belum aktif.');
        };
        container.querySelector('#closeReload').onclick = () => container.remove();
    }

    // --- Remove Ads ---
    function removeAds() {
        const selectors = [
            '[id^="ad"]','[class*="ad"]','[id*="banner"]','[class*="banner"]',
            '[class*="promo"]','[class*="sponsored"]','[class*="ads"]',
            '[id*="popup"]','[class*="popup"]','[class*="overlay"]'
        ];
        selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.style.display = 'none'));
        alert('Berhasil menyembunyikan elemen yang berlabel iklan (metode heuristik).');
    }

    // --- Dark Mode toggle (kept global) ---
    const darkStyle = document.createElement('style');
    darkStyle.textContent = `
        body.dark-mode, body.dark-mode * {
            background-color: #111 !important;
            color: #ddd !important;
            border-color: #333 !important;
        }
    `;
    document.head.appendChild(darkStyle);

    if (localStorage.getItem('darkModeEnabled') === 'true') {
        document.body.classList.add('dark-mode');
    }
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkModeEnabled', document.body.classList.contains('dark-mode'));
    }

    // --- Add icon buttons (SVG icons + tooltip text + callbacks) ---
    createIconButton(SVG.calc, 'Kalkulator Umur', showAgeCalculator);
    createIconButton(SVG.reload, 'Auto Reload', showAutoReloadPopup);
    createIconButton(SVG.removeAds, 'Hapus Iklan', removeAds);
    createIconButton(SVG.dark, 'Dark Mode', toggleDarkMode);

    // --- Quarter-circle animation logic ---
    let menuOpen = false;
    floatingBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        const total = menuButtons.length;
        const radius = 120; // jarak tombol dari pusat
        const startAngle = -90; // degrees (top)
        const endAngle = -180; // degrees (left)
        const step = (endAngle - startAngle) / Math.max(1, (total - 1));

        menuButtons.forEach((btn, i) => {
            if (menuOpen) {
                const angleDeg = startAngle + step * i;
                const angle = angleDeg * (Math.PI / 180);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                // store translation so hover can reapply scale without losing coords
                btn.dataset.tx = x.toFixed(2);
                btn.dataset.ty = y.toFixed(2);
                // small staggered delay for nicer effect
                btn.style.transitionDelay = `${i * 0.03}s`;
                // move and show
                btn.style.transform = `translate(${x}px, ${y}px) scale(1)`;
                btn.style.opacity = '1';
            } else {
                btn.style.transitionDelay = `${(menuButtons.length - 1 - i) * 0.02}s`;
                btn.dataset.tx = 0;
                btn.dataset.ty = 0;
                btn.style.transform = `translate(0px, 0px) scale(1)`;
                btn.style.opacity = '0';
            }
        });

        floatingBtn.style.transform = menuOpen ? 'rotate(45deg)' : 'rotate(0deg)';
    });

    // --- Close menu when clicking outside ---
    document.addEventListener('click', (e) => {
        if (!menuOpen) return;
        if (floatingBtn.contains(e.target)) return;
        // if clicked a menu button, keep menu open (optional). We'll close for simplicity.
        menuOpen = false;
        menuButtons.forEach((btn, i) => {
            btn.style.transitionDelay = `${(menuButtons.length - 1 - i) * 0.02}s`;
            btn.dataset.tx = 0;
            btn.dataset.ty = 0;
            btn.style.transform = `translate(0px, 0px) scale(1)`;
            btn.style.opacity = '0';
        });
        floatingBtn.style.transform = 'rotate(0deg)';
    });

    // --- Prevent accidental selection when double-clicking ---
    floatingBtn.addEventListener('mousedown', (e) => e.preventDefault());

})();
