/// ==UserScript==
// @name         Free Google
// @namespace    Free Google
// @version      1.0.0
// @description  always set the google searach region to Ghana
// @author       DumbGPT
// @match        *://*.google.com/*
// @match        *://*.google.co.kr/*
// @match        *://*.google.co.jp/*
// @match        *://*.google.co.uk/*
// @match        *://*.google.de/*
// @match        *://*.google.fr/*
// @match        *://*.google.*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM_addValueChangeListener
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/534816/Free%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/534816/Free%20Google.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
 
    const CHECK_INTERVAL = 1000;
    

    function isGooglePage() {
        return window.location.hostname.includes('google.');
    }
    

    function modifyURL() {
        if (!isGooglePage()) return;
        
        let currentURL = window.location.href;
        let url = new URL(currentURL);
        
 
        const hasGlParam = url.searchParams.has('gl') && url.searchParams.get('gl') === 'GH';
        const hasSafeParam = url.searchParams.has('safe') && url.searchParams.get('safe') === 'off';
        
        if (hasGlParam && hasSafeParam) {
            return; 
        }
        
        url.searchParams.set('gl', 'GH');
        url.searchParams.set('safe', 'off');
        
        if (url.pathname.includes('/search')) {
            url.searchParams.set('pws', '0'); 
        }
        
      
        const newURL = url.toString();
        if (currentURL !== newURL) {
            window.location.replace(newURL);
        }
    }
    
    function setCookies() {
        if (!isGooglePage()) return;
        
        document.cookie = "PREF=gl=GH:safe=off; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/; domain=.google.com";
        document.cookie = "NID=; path=/; domain=.google.com";
        
        const domain = window.location.hostname;
        document.cookie = `PREF=gl=GH:safe=off; expires=Fri, 31 Dec 2030 23:59:59 GMT; path=/; domain=${domain}`;
        
        try {
            localStorage.setItem('google_settings_gl', 'GH');
            localStorage.setItem('google_settings_safe', 'off');
        } catch (e) {
            console.log('로컬 스토리지 접근 오류:', e);
        }
    }
    
    function modifyPreferencesPage() {
        if (!isGooglePage()) return;
        
        if (window.location.href.includes('/preferences') || window.location.href.includes('/setprefs')) {

            const regionSelects = document.querySelectorAll('select[name="cr"], select[name="gl"]');
            regionSelects.forEach(select => {

                for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === 'countryGH' || select.options[i].value === 'GH') {
                        select.selectedIndex = i;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }
            });
            
            const safeSearchInputs = document.querySelectorAll('input[name="safe"]');
            safeSearchInputs.forEach(input => {
                if (input.value === 'off') {
                    input.checked = true;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            
            setTimeout(() => {
                const saveButtons = document.querySelectorAll('input[type="submit"], button[type="submit"]');
                saveButtons.forEach(button => {
                    if (button.value === '저장' || button.innerText === '저장' || 
                        button.value === 'Save' || button.innerText === 'Save') {
                        button.click();
                    }
                });
            }, 1000);
        }
    }
    
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', () => {
            modifyURL();
            setCookies();
            setTimeout(modifyPreferencesPage, 1000);
        });
    }
    
    function main() {
        modifyURL();
        setCookies();
        setTimeout(modifyPreferencesPage, 1000);
    }
    
    main();
    
    setInterval(main, CHECK_INTERVAL);
    
    const observer = new MutationObserver(() => {
        modifyPreferencesPage();
    });
    
    window.addEventListener('load', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
