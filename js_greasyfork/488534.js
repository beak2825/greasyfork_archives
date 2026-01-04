// ==UserScript==
// @name         Civitai Model Download Helper
// @description  Send the model_id of the current page to the Stable Diffusion (AUTOMATIC1111) WebUI's civitai extension download page.
// @license      MIT
// @version      1.0.1
// @match        https://civitai.com/models/*
// @match        http://localhost:7860/
// @compatible   Chrome/Chromium + Tampermonkey
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @namespace https://greasyfork.org/users/383371
// @downloadURL https://update.greasyfork.org/scripts/488534/Civitai%20Model%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/488534/Civitai%20Model%20Download%20Helper.meta.js
// ==/UserScript==


const WEBUI_URL = 'http://localhost:7860/'  // modify this and the second 'match url' above

async function setter(){
    let model_id = await GM_getValue('model_id', '');
    await GM_setValue('model_id', '');
    if(model_id.length > 0){
        let input_element = document.querySelector('input[placeholder="Model URL or Model ID"]');
        let submit_element = input_element.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[4].childNodes[1];
        input_element.value = model_id;
        input_element.dispatchEvent(new Event('input'));
        submit_element.click();
    }
}


async function create_download_button(){
    let download_button = document.createElement('span');
    download_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-download"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path><path d="M7 11l5 5l5 -5"></path><path d="M12 4l0 12"></path></svg>';
    let model_id = document.location.href.match(/https:\/\/civitai\.com\/models\/(?<model_id>\d+).*/).groups.model_id;
    download_button.addEventListener('click', function(){GM_setValue('model_id', model_id)});
    download_button.style.cursor = 'pointer';
    return download_button;
}


window.addEventListener('load', async function(event) {
    if(window.location.href == WEBUI_URL){
        setInterval(setter, 1000);
    }else{
        let container_element = document.querySelector('a[href="https://education.civitai.com/civitais-100-beginners-guide-to-generative-ai-art/#heading-77"]').parentNode;
        let download_button = await create_download_button();
        container_element.prepend(download_button);
    }
});
