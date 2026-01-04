// ==UserScript==
// @name         CloudFlare Turnstile Token Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bypass cloudflare turnstile token generator
// @author       alpgul
// @license      GPL-3.0
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloudflare.com
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addElement
// @connect      challenges.cloudflare.com
// @tag          cloudflare

// @downloadURL https://update.greasyfork.org/scripts/502601/CloudFlare%20Turnstile%20Token%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/502601/CloudFlare%20Turnstile%20Token%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const api = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    let startTime;
    let fakeApi;
    function generateUniqueId() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
                                                            (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
                                                           );
    }
    function EventModifier (evt, obj) {
        const proxy = new Proxy(evt, {
            get: (target, prop) => obj[prop] || target[prop]
        })
        return new evt.constructor(evt.type, proxy)
    }
    async function createApiURL() {
        const response = await new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: api,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = response.responseText;
                            resolve(data);
                        } catch (error) {
                            reject("Error parsing data:"+ error);
                        }
                    } else {
                        reject("Error fetching data:"+ response.status+ response.statusText);
                    }
                },
                onerror: function(error) {
                    reject("Error making XHR request:"+ error);
                }
            });
        });
        const script = response;
        const newScript = script.replaceAll(/(\w+)\.location\.href/g, `$1.location._href`);
        const blob = new Blob([newScript], {
            type: 'text/javascript'
        });
        let blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    }
    async function createCloudflareFrame(url, key,fakeApi) {
        const id=generateUniqueId();
        const dom = `<!DOCTYPE html>
<html lang="en">
<head>
<script>
const originalSetAttribute = window.HTMLIFrameElement.prototype.setAttribute;

window.HTMLIFrameElement.prototype.setAttribute = function(name, value) {
  if (name === 'src') {
    value += "#origin=${new URL(url).origin}";
  }
  originalSetAttribute.call(this, name, value);
};

window.location._href="${url}";
document.head.insertAdjacentHTML('beforeend',"<script src='https://challenges.cloudflare.com/turnstile/v0/api.js' defer>");
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
      const targetInput = mutation.target;
      if (targetInput.name === 'cf-turnstile-response') {
        //console.log('cf-turnstile-response:', targetInput.value);
				window.parent.postMessage({'id':"${id}",'url':"${url}",'key':"${key}",'token':targetInput.value}, '*');
      }
    }
  });
});
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['value'],
  subtree: true
});
<\/script>
<script src="${fakeApi}" defer><\/script>
</head>
<body style="display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;">
 <div class="cf-turnstile" data-sitekey="${key}"></div>
 </body>
</html>`;
        const iframe=GM_addElement(document.body, 'iframe', { id,srcdoc: dom });
        return iframe;
    }
    window.addEventListener('message',(e)=>{
        const data=e.data;
        if(data.url && data.key && data.token && data.id){

            const tokenInput = document.getElementById('token-input');
            tokenInput.value=data.token;
        const closeButton = document.getElementById('closeDialog');
            closeButton.innerText="Close Time: "+(Date.now()-startTime)/1000+" sec";
            const iframe=document.getElementById(data.id);
            setTimeout(()=>iframe.remove(),1000);
        }
    });


    async function main(url,key) {
        try{
            if(!fakeApi){
                fakeApi=await createApiURL()
            }
            const iframeCF = await createCloudflareFrame(url, key,fakeApi);
        }catch(err){
            const tokenInput = document.getElementById('token-input');
            tokenInput.value="ERROR:"+err.message;
        }

    }
    async function createPrompt(){
        const dialogHTML=`  <dialog id="myDialog">
    <h2>Get Token</h2>
    <p>
      <label for="url-input">URL:</label>
      <input type="text" id="url-input" placeholder="Enter URL" value="https://2captcha.com/demo/cloudflare-turnstile">
    </p>
    <p>
      <label for="sitekey-input">Site Key:</label>
      <input type="text" id="sitekey-input" placeholder="Enter Site Key"  value="0x4AAAAAAAVrOwQWPlm3Bnr5">
    </p>
    <button id="getToken">Get Token</button>
    <p>
      <label for="token-input">Token:</label>
      <input type="text" id="token-input" placeholder="Token" disabled>
    </p>
    <button id="closeDialog">Close</button>
  </dialog>`;

        document.body.insertAdjacentHTML('beforeend',dialogHTML);
        const dialog = document.getElementById('myDialog');
        const closeButton = document.getElementById('closeDialog');
        const getTokenButton = document.getElementById('getToken');
        const urlInput = document.getElementById('url-input');
        const sitekeyInput = document.getElementById('sitekey-input');
        dialog.showModal();
        closeButton.addEventListener('click', () => {
            dialog.close();
        });

        getTokenButton.addEventListener('click', () => {
            startTime=Date.now()
            const url = urlInput.value;
            const sitekey = sitekeyInput.value;
            main(url,sitekey);
        });
    }
    if('https://challenges.cloudflare.com'===unsafeWindow.location.origin){

        const targetSelector="input[type=checkbox]";
        Element.prototype._addEventListener = Element.prototype.addEventListener;
        Element.prototype.addEventListener = function () {
            let args = [...arguments];
            let temp = args[1];
            args[1] = function () {
                let args2 = [...arguments];
                args2[0] = new EventModifier(args2[0], { isTrusted: true });
                return temp(...args2);
            };
            return this._addEventListener(...args);
        };
        EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function () {
            let args = [...arguments];
            let temp = args[1];
            args[1] = function () {
                let args2 = [...arguments];
                args2[0] = new EventModifier(args2[0], { origin: unsafeWindow.location.hash.split("origin=")[1] || args2[0].origin });
                return temp(...args2);
            };
            return this._addEventListener(...args);
        };
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    const addedNodes = Array.from(mutation.addedNodes);
                    for (const addedNode of addedNodes) {
                        if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
                            const node = addedNode?.querySelector(targetSelector);
                            if (node) {
                                node.parentElement.click();
                            }
                        }
                    }
                }
            }
        });
        const observerOptions = {
            childList: true,
            subtree: true,
        };

        const originalAttachShadow = Element.prototype.attachShadow;

        function attachShadowProxy(options) {
            const shadowRoot = originalAttachShadow.call(this, options);
            observer.observe(
                shadowRoot,
                observerOptions
            );

            return shadowRoot;
        }
        Element.prototype.attachShadow = attachShadowProxy;

    }
    GM_registerMenuCommand('Open Token Generator', e => {
        createPrompt()
    });
})();