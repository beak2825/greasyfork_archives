// ==UserScript==
// @name         c4ai-command-r-plus.hf.space
// @namespace    Apache-2.0
// @version      1.3.2
// @description  Customizing the appearance of the cohereforai-c4ai-command-r-plus.hf.space page
// @author       Tony 0tis
// @license      Apache-2.0
// @match        *://cohereforai-c4ai-command-r-plus.hf.space/*
// @icon         https://cohereforai-c4ai-command-r-plus.hf.space/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491871/c4ai-command-r-plushfspace.user.js
// @updateURL https://update.greasyfork.org/scripts/491871/c4ai-command-r-plushfspace.meta.js
// ==/UserScript==

(function() {
    const manifestUrl = 'https://raw.githubusercontent.com/tony-0tis/manifests/refs/heads/main/cohereforai-c4ai-command.hf.space/manifest.json'
    console.log('start customize');
    document.title = 'C4AI Command R Plus - on Hugging Face Space by CohereForAI';
    const observer = new MutationObserver((mutationsList, observer)=>{
        for (const mutation of mutationsList) {
            for(const node of mutation.addedNodes){
                if(node.id === 'logo-img'){
                    node.parentNode.parentNode.style.display = 'none';
                }
                if(node.classList && node.classList.contains('label') && node.innerText === 'Examples'){
                	node.parentNode.parentNode.style.display = 'none';
                }
                if(node.classList && node.classList.contains('message-wrap')){
                	let parent = node;
                	while(true || parent){
                		if(parent.id.includes('component')){
                			parent.style.height = '100%';
                			parent.style.overflow = 'auto';
                			if(parent.id === 'component-0'){
                				parent.style.height = 'calc(100dvh - 40px)';
                				document.title = 'C4AI Command R Plus - a Hugging Face Space by CohereForAI';
                				break;
                			}
                		}
                		parent = parent.parentNode;
                	}
                }
                if(node.nodeName === 'FOOTER'){
                    node.style.display = 'none';
                }
                if(node.nodeName === 'TEXTAREA'){
                    node.style.minHeight = '46px';
                    node.parentNode.parentNode.style.padding = '0px';
                }
                if(node.nodeName === 'BUTTON' && node.innerText === 'Clear chat'){
                    node.innerText = '🗑️';
                    node.style.flex = '0';
                    node.style.minWidth = '50px';
                    node.parentNode.style.flexDirection = 'row-reverse';
                }
            }
        }
    });
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
    document.addEventListener('beforeunload', ()=>{
        observer.disconnect();
    });

    const manifest = document.createElement('link');
    manifest.rel = 'manifest'
    manifest.href = manifestUrl;
    document.head.appendChild(manifest);
})();