// ==UserScript==
// @name         Netflav enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Netflav enhancer...
// @author       HappyTreeFriends
// @namespace    https://greasyfork.org/users/317047
// @match        https://www.netflav.com/video*
// @icon         https://www.google.com/s2/favicons?domain=netflav.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434766/Netflav%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/434766/Netflav%20enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() =>{

        makeCopyBtn(document.querySelector('.videodetail_field_values'), document.querySelector('.videodetail_title'));
        makeCopyBtn(document.querySelector('.videodetail_field_values'));

        const element = document.querySelector('#video-details')
        const button = document.createElement("button");
        const buttonDiv = document.createElement("div");
        button.innerHTML = 'Copy URL';
        button.onclick = function(){ copyURL()};
        buttonDiv.appendChild(button);
        buttonDiv.setAttribute('class', 'videoiframe_source_tag');
        element.prepend(buttonDiv);
    }, 3000);



})();

var copyToClipboard = function(secretInfo) {
    const tempInput = document.createElement('INPUT');
    document.body.appendChild(tempInput);
    tempInput.setAttribute('value', secretInfo)
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

function makeCopyBtn(element1, element2 = null){
    let title = element1.innerText;
    if(element2) title = title + " " + element2.innerText;
    const button = document.createElement("button");
    button.innerHTML = 'Copy';
    button.onclick = function(){ copyToClipboard(title.trim() )} ;
    if(element2){
        element2.appendChild(button);
    }else{
        element1.appendChild(button);
    }
}


function copyURL (){
    const initJson = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
    let videourl;
    let apiURL='';
    const URLs = /(avple|asianclub|mm9842)/;
    if(initJson.props.initialState.video.data.srcs.length > 0){
        videourl = initJson.props.initialState.video.data.srcs.find(item => item.match(URLs));
    }else{
        videourl = initJson.props.initialState.video.data.src;
    }
    if(!videourl || !videourl.match(URLs)) {alert('URL not found'); return}
    if(videourl.match(/asianclub/)) {apiURL = 'https://asianclub.tv/api/source/'}
    if(videourl.match(/avple/)) {apiURL = 'https://www.avple.video/api/source/'}
    if(videourl.match(/mm9842/)) {apiURL = 'https://mm9842.com/api/source/'}
    GM_xmlhttpRequest({
        method: "POST",
        url: apiURL+videourl.split('/').slice(-1)[0],
        onload: function(response) {
            const result = JSON.parse(response.responseText);
            const item = result.data.find(item => item.label == '720p');
            if(!item) {alert('URL not found'); return}
            copyToClipboard(item.file)
        }
    });
}