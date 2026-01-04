// ==UserScript==
// @name         Microsoft Update Catalog - Auto Highlight the version for your OS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto Highlight the version for your OS when you download the updates from Microsoft Update Catalog
// @author       You
// @match        https://www.catalog.update.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429342/Microsoft%20Update%20Catalog%20-%20Auto%20Highlight%20the%20version%20for%20your%20OS.user.js
// @updateURL https://update.greasyfork.org/scripts/429342/Microsoft%20Update%20Catalog%20-%20Auto%20Highlight%20the%20version%20for%20your%20OS.meta.js
// ==/UserScript==

(function $$() {
    'use strict';

    if(!document.documentElement) return window.requestAnimationFrame($$);


    function addStyle(styleText) {
        const styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.textContent = styleText;
        document.documentElement.appendChild(styleNode);
        return styleNode;
    }

    const cssText=`
    [ms-update-highlighted-row] td{
    font-weight:900;
    }
    [ms-update-highlighted-row] td input:only-of-type{
    font-weight:600;
    background-color:rgba(100,135,220,0.3);
    }

    `


    function isIntelX64(){
    // https://stackoverflow.com/a/13709431/6764107

        if(!window.navigator)return null;

        let ua= navigator.userAgent;
        if(!ua || typeof ua !='string')return null;

        let kua = ua.replace(/64\d/g,'').replace(/\s*[;,]\s*/,'$1 ')

        let res1 = /x86_64|x86\-64|Win64|x64;|amd64|AMD64|WOW64|x64_64/.test(kua);
        let res2 = /ia64|sparc64|ppc64|IRIX64/.test(kua);

        return res1 && !res2;

    }



    /* DEMO http://jsfiddle.net/rLnwg3vy/ */

    /**
 * JavaScript Client Detection
 * (C) viazenetti GmbH (Christian Ludwig)
 */
function getJSCD () {
    {
        let screen = window.screen;
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen && screen.width) {
            let width = (screen.width) ? screen.width : '';
            let height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        // browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // Legacy Edge
        else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
            browser = 'Microsoft Legacy Edge';
            version = nAgt.substring(verOffset + 5);
        }
        // Edge (Chromium)
        else if ((verOffset = nAgt.indexOf('Edg')) != -1) {
            browser = 'Microsoft Edge';
            version = nAgt.substring(verOffset + 4);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Chrome OS', r:/CrOS/},
            {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS':
            case 'Mac OS X':
            case 'Android':
                osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else  {
                flashVersion = unknown;
            }
        }
    }

    return {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion,
        isIntelX64: isIntelX64()
    };
}

/*
alert(
    'OS: ' + jscd.os +' '+ jscd.osVersion + '\n' +
    'Browser: ' + jscd.browser +' '+ jscd.browserMajorVersion +
      ' (' + jscd.browserVersion + ')\n' +
    'Mobile: ' + jscd.mobile + '\n' +
    'Flash: ' + jscd.flashVersion + '\n' +
    'Cookies: ' + jscd.cookies + '\n' +
    'Screen Size: ' + jscd.screen + '\n\n' +
    'Full User Agent: ' + navigator.userAgent
);*/







    function nearestParent(dom, f){

        let p = dom;
        while(p && p.nodeType>0){
            if(f(p)) return p
            p=p.parentNode;
        }
        return null;

    }

    function nOfType(elm){
        if(!elm)return -1;
        let parent = elm.parentNode;
        let i=0;
        if(!parent) return -1;
        for(const s of parent.children){
            if(elm===s) return i;
            if(s.nodeName==elm.nodeName) i++;
        }
        return -1;

    }

    let jscd=null;


    let addedStyle=null;



    let m11=1;
    setInterval(function(){
        let e11;
        if(m11&&(e11=document.querySelector('td>a[id*="product"]:only-of-type>span:only-of-type'))){

            m11=0;


            let e22=document.querySelector('td>a[id*="title"]:only-of-type>span:only-of-type');

            if(!e22)return;

            jscd = jscd||getJSCD();

            let osVersion = jscd.os +' '+ jscd.osVersion;
            if(osVersion=='Windows 7'){

            }



            let tContainer = nearestParent(e11, (elm)=>elm.nodeName=="TBODY"||elm.nodeName=="TABLE");

            let idx11=nOfType(nearestParent(e11, (elm)=>elm.nodeName=="TD"))
            let idx22=nOfType(nearestParent(e22, (elm)=>elm.nodeName=="TD"))




            let tds = tContainer.querySelectorAll(`td:nth-of-type(${idx11+1})`)

            for(const elm of tds){

                let products_txt = elm.textContent.replace(/[^a-zA-Z0-9\-\_\s\,]/g,'').trim();
                let products = products_txt.split(/\s*,\s*/);
                let isProductFound = products.includes(osVersion);
                /*
                Windows 7,Windows 8,Windows Server 2003,Windows Server 2003, Datacenter Edition,Windows Server 2008,Windows Server 2008 R2,Windows Server 2012,Windows Vista,Windows XP x64 Edition
                */

                if(isProductFound){

                    let tr = nearestParent(elm, (elm)=>elm.nodeName=="TR")


                    let title = tr.querySelector(`td:nth-of-type(${idx22+1})`)

                    let p = (title.textContent+'').match(/\b(x64|x86)\b/);

                    //console.log(p);

                    if(p){
                        if((p[0]=='x86'&&jscd.isIntelX64===true)||(p[0]=='x64'&&jscd.isIntelX64===false)) continue;
                    }

                    addedStyle=addedStyle||addStyle(cssText);

                    tr.setAttribute('ms-update-highlighted-row','')


                }

            }

        }

    },250)





    // Your code here...
})();