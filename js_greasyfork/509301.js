// ==UserScript==
// @name         UserFriendly-NETjobs-HKU
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  userscript for NETjobs providing option to re-enable text-highlighting and right-click, also a button to search employers' company name on search engine directly
// @author       SimonTheLiquid
// @match        https://web2.cedars.hku.hk/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hku.hk
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509301/UserFriendly-NETjobs-HKU.user.js
// @updateURL https://update.greasyfork.org/scripts/509301/UserFriendly-NETjobs-HKU.meta.js
// ==/UserScript==
 
(function() {
    /*
    Users should strictly follow the terms and conditions of NETjobs.
    Any act violating the terms and conditions is strongly discouraged.
    */
    'use strict';
 
    var pageType = (document.URL.startsWith("https://web2.cedars.hku.hk/jobs/job_detail.php")) ? 'detail' : ((document.URL.startsWith("https://web2.cedars.hku.hk/jobs/index.php") || document.URL.startsWith("https://web2.cedars.hku.hk/jobs/search.php")) ? 'main' : '');
 
    function Init()
    {
        var styles = `
            .BtnSearch#hidden{
                display:none;
            }
            .BtnSearch#show{
                display:inline !important;
            }
        `;
        var styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
 
        document.querySelector('[id="content"]').insertAdjacentHTML("afterbegin", '<br><label style=""><input type="checkbox" style="vertical-align:bottom;" class="inputHighlight"></input>Enable Highlights</label>')
        document.querySelector('[id="content"]').insertAdjacentHTML("afterbegin", '<br><label style=""><input type="checkbox" style="vertical-align:bottom;" class="inputSearch"></input>Enable Employer Search</label>')
        document.querySelector('[id="content"]').insertAdjacentHTML("afterbegin", '<br><label>search engine: <select style="" class="inputEngine"><option value="duckduckgo">duckduckgo</option><option value="google">google</option></select></label>')
 
        if (pageType=='detail')
        {
            document.querySelectorAll('[class="value"]').forEach(e => {
                if(!e.parentNode.childNodes[0].textContent.includes("Name")) return;
                e.insertAdjacentHTML("afterbegin", '<a class="BtnSearch" target="_blank" data-q="' + e.textContent + '">&#x1F50D</a>');
            });
        }
        else if (pageType=='main')
        {
            document.querySelector('[id="content"]').querySelectorAll('a').forEach(e => {
                e.setAttribute('draggable', 'false');
            });
            document.querySelector('[id="content"]').querySelectorAll('tbody').forEach(t => t.querySelectorAll('tr').forEach(e => {
                e.childNodes[1].childNodes[0].insertAdjacentHTML("afterbegin", '<a class="BtnSearch" style="word-wrap:break-word;" target="_blank" data-q="' + e.childNodes[1].textContent + '">&#x1F50D</a>');
            }));
        }
        window.addEventListener("focus", e => Setup(false));
        Setup();
    }
 
    function EnableHighlight(enabled)
    {
        if (enabled)
        {
            $(document).unbind('contextmenu');
            $(document).unbind('copy paste')
        }
        else
        {
            $(document).bind('contextmenu', function(e) {return false;} );
            $(document).bind('copy paste', function(e) {e.preventDefault();} );
        }
 
        var sheets = document.querySelectorAll('link[rel="stylesheet"]');
        for (var i=0; i<sheets.length; i++)
        {
            if (sheets[i].getAttribute('href')!=null && sheets[i].href.startsWith("https://web2.cedars.hku.hk/jobs/css/screen.css"))
            {
                var val = enabled ? "text" : "none"
                if (Object.hasOwn(sheets[i].sheet.cssRules[0].style, 'webkitTouchCallout')) sheets[i].sheet.cssRules[0].style.webkitTouchCallout = val;
                if (Object.hasOwn(sheets[i].sheet.cssRules[0].style, 'webkitUserSelect')) sheets[i].sheet.cssRules[0].style.webkitUserSelect = val;
                if (Object.hasOwn(sheets[i].sheet.cssRules[0].style, 'khtmlUserSelect')) sheets[i].sheet.cssRules[0].style.khtmlUserSelect = val;
                if (Object.hasOwn(sheets[i].sheet.cssRules[0].style, 'mozUserSelect')) sheets[i].sheet.cssRules[0].style.mozUserSelect = val;
                if (Object.hasOwn(sheets[i].sheet.cssRules[0].style, 'msUserSelect')) sheets[i].sheet.cssRules[0].style.msUserSelect = val;
                if (Object.hasOwn(sheets[i].sheet.cssRules[0].style, 'userSelect')) sheets[i].sheet.cssRules[0].style.userSelect = val;
                break;
            }
        }
    }
 
    function EnableSearch(enabled)
    {
        if (enabled)
        {
            document.querySelectorAll('a[class="BtnSearch"]').forEach(e => e.setAttribute('id', 'show'));
        }
        else
        {
            document.querySelectorAll('a[class="BtnSearch"]').forEach(e => e.setAttribute('id', 'hidden'));
        }
    }
 
    function SetEngine(engine)
    {
        var link = "https://duckduckgo.com/?q=";
        if (engine=='google') link = "https://www.google.com/search?q=";
        document.querySelectorAll('a[class="BtnSearch"]').forEach(e => {
            var q = e.getAttribute('data-q', '');
            e.setAttribute('href', q=='' ? '' : link+q);
        });
    }
 
    function Setup(first = true)
    {
        console.log('set' + GM_getValue(pageType+'highlight', true) + " " + GM_getValue(pageType+'search', true) + " " + GM_getValue(pageType+'engine', 'duckduckgo'));
        var ih = document.querySelector('[id="content"]').querySelector('[class="inputHighlight"]');
        var vh = GM_getValue(pageType+'highlight', true);
        vh ? ih.setAttribute('checked', '') : ih.removeAttribute('checked');
        EnableHighlight(vh);
 
        var is = document.querySelector('[id="content"]').querySelector('[class="inputSearch"]');
        var vs = GM_getValue(pageType+'search', true);
        vs ? is.setAttribute('checked', '') : is.removeAttribute('checked');
        EnableSearch(vs);
 
        var ie = document.querySelector('[id="content"]').querySelector('[class="inputEngine"]');
        var engine = GM_getValue(pageType+'engine', 'duckduckgo');
        ie.querySelector('[value="' + engine + '"]').setAttribute('selected', '');
        SetEngine(engine);
 
        if (first)
        {
            ih.addEventListener('change', () => {
                GM_setValue(pageType+'highlight', ih.checked);
                EnableHighlight(ih.checked);
                console.log(ih.checked);
            });
            is.addEventListener('change', () => {
                GM_setValue(pageType+'search', is.checked);
                EnableSearch(is.checked);
                console.log(is.checked);
            });
            ie.addEventListener('change', () => {
                GM_setValue(pageType+'engine', ie.value);
                SetEngine(ie.value);
            });
        }
    }
 
    Init();
 
})();