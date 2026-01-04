// ==UserScript==
// @name         F95Zone.to - Gofile No Limit DL
// @namespace    https://greasyfork.org/fr/users/1468290-payamarre
// @version      1.7.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @description  Allows Gofile links to generate a bypass link via a third-party service to skip download limits.
// @author       NoOne
// @license      MIT
// @match        https://f95zone.to/*
// @grant        GM_xmlhttpRequest
// @connect      f95zone.to
// @antifeature  ads  Redirects links through gf.1drv.eu.org to bypass Gofile download quotas.
// @downloadURL https://update.greasyfork.org/scripts/542928/F95Zoneto%20-%20Gofile%20No%20Limit%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/542928/F95Zoneto%20-%20Gofile%20No%20Limit%20DL.meta.js
// ==/UserScript==

(function(){
    const BYPASS_SERVER = "https://gf.1drv.eu.org/";

    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
    document.head.appendChild(fontAwesome);

    const customStyle = document.createElement("style");
    customStyle.textContent = `
        .dlx{cursor:pointer;background:none;border:none;font-size:16px;margin-left:8px;text-decoration:none;color:inherit;display:inline-block;transition:transform 0.2s;}
        .dlx:hover{transform:scale(1.2);color:#ff7300;}
        .dlx-loading{animation:fa-spin 2s infinite linear;}
    `;
    document.head.appendChild(customStyle);

    function injectButton(anchor){
        if(anchor.nextSibling && anchor.nextSibling.classList && anchor.nextSibling.classList.contains("dlx")) return;

        const btn = document.createElement("button");
        btn.className = "dlx";
        btn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i>';
        btn.title = "Generate Bypass Link";

        btn.onclick = () => handleLinkProcessing(anchor, btn);

        anchor.insertAdjacentElement("afterend", btn);
    }

    function handleLinkProcessing(anchor, btn){
        btn.innerHTML = '<i class="fa-solid fa-spinner dlx-loading"></i>';
        GM_xmlhttpRequest({
            method: "POST",
            url: anchor.href,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            data: "xhr=1&download=1",
            onload: response => {
                let data;
                try { 
                    data = JSON.parse(response.responseText); 
                } catch(err) { 
                    btn.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:#ff4d4d;"></i>'; 
                    triggerCaptcha(anchor.href); 
                    return; 
                }

                if(!data.msg){ 
                    btn.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:#ff4d4d;"></i>'; 
                    triggerCaptcha(anchor.href); 
                    return; 
                }

                let responseHtml = data.msg;
                let gofileId = responseHtml.match(/gofile\.io\/d\/([\w\d]+)/);

                if(gofileId){
                    const downloadLink = document.createElement("a");
                    downloadLink.href = BYPASS_SERVER + gofileId[1];
                    downloadLink.innerHTML = '<i class="fa-solid fa-circle-arrow-down" style="color:#2ecc71;"></i>';
                    downloadLink.title = "Download (No Limit)";
                    downloadLink.target = "_blank";
                    downloadLink.className = "dlx";
                    btn.replaceWith(downloadLink);
                    return;
                }

                if(/captcha|recaptcha/i.test(responseHtml)){ 
                    btn.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:#ff4d4d;"></i>'; 
                    triggerCaptcha(anchor.href); 
                    return; 
                }
                
                btn.innerHTML = '<i class="fa-solid fa-skull" style="color:#888;"></i>';
            },
            onerror: () => btn.innerHTML = '<i class="fa-solid fa-skull" style="color:#888;"></i>'
        });
    }

    function triggerCaptcha(url){
        window.open(url, "captcha", "width=600,height=800");
    }

    function findLinks(){
        document.querySelectorAll('a[href*="/masked/gofile.io/"]').forEach(injectButton);
    }

    findLinks();
    new MutationObserver(findLinks).observe(document.body, {childList: true, subtree: true});
})();