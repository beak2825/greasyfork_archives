// ==UserScript==
// @name         VWorld Download Button Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  VWorld 다운로드 버튼을 직접 다운로드 링크로 변환
// @author       Your Name
// @match        https://www.vworld.kr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536668/VWorld%20Download%20Button%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/536668/VWorld%20Download%20Button%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        document.querySelectorAll("button.bt.ico.down.bg.primary").forEach(el=>{
            let a = document.createElement("a");
            a.innerHTML = el.innerHTML;
            a.classList = el.classList;
            a.type = "button";

            const onclick = el.getAttribute("onclick") ?? el.onclick.toString();
            const [dsId, fileNo, fileSize] = [...onclick.matchAll(/'([^']+)'/g)].map(match => match[1]);

            if (fileSize < 500000000) {
                a.target = "_blank";
                a.href = `/dtmk/downloadResourceFile.do?ds_id=${dsId}&fileNo=${fileNo}`;
            }
            else {
                const tr = el.parentElement.parentElement;
                const checkbox = tr.querySelector('input[name=chkDs]');
                const ds_file_sq = [ checkbox.value ];
                a.addEventListener("click", (e)=>{
                    e.preventDefault();
                    // open new window
                    const newWindow = window.open("", "_blank", "width=1000,height=1000");
                    newWindow.location.href = `/dtmk/downloadResourceFile2.do?ds_id=${dsId}&ds_file_sq=${ds_file_sq}`;
                });
                a.href = `#download-${dsId}-${fileNo}`;
            }
            el.parentElement.replaceChild(a, el);
        });

        document.querySelectorAll('a[href^="javascript:listFnc.goData(\'NA\',"]').forEach(a => {
            const match = a.getAttribute('href').match(/goData\('NA',\s*'([^']+)'/);
            if (match && match[1]) {
                const dsId = match[1];
                a.setAttribute('href', `https://www.vworld.kr/dtmk/dtmk_ntads_s002.do?svcCde=NA&dsId=${dsId}`);
                a.setAttribute('target', '_blank');
            }
        });

        // goMain 링크 변환
        document.querySelectorAll('a[href="javascript:urlFnc.goMain();"]').forEach(a => {
            a.setAttribute('href', '/v4po_main.do');
            a.setAttribute('target', '_self');
        });
    }, 10);

    setInterval(function() {
        // 1. Select all <a> tags whose href starts with "javascript:listFnc.goData"
        document.querySelectorAll('a[href^="javascript:listFnc.goData"]').forEach(function(el) {
          const jsHref = el.getAttribute('href');
          // 2. Extract svcCde and dsId from inside goData('...','...');
          const m = jsHref.match(/listFnc\.goData\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/);
          if (m) {
            const svcCde = m[1]; // e.g. "MK"
            const dsId   = m[2]; // e.g. "30524"
            // 3. Build the new pathname:
            //    /dtmk/dtmk_ntads_s002.do?svcCde=MK&dsId=30524
            const svcLower = svcCde.toLowerCase(); 
            const newHref  = `/dt${svcLower}/dt${svcLower}_ntads_s002.do?svcCde=${svcCde}&dsId=${dsId}`;
            el.setAttribute('href', newHref);
          }
        });
    }, 10);
      
})();