// ==UserScript==
// @name         EasyMC save tokens
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  It saves tokens, you can delete an existing token
// @author       Euaek
// @match        https://easymc.io/get*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=easymc.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502105/EasyMC%20save%20tokens.user.js
// @updateURL https://update.greasyfork.org/scripts/502105/EasyMC%20save%20tokens.meta.js
// ==/UserScript==

    let json = localStorage.l;
    let deleted = localStorage.d;
    try{deleted = JSON.parse(deleted);}catch{}
    try{json = JSON.parse(json);}catch{}
    if(!deleted) deleted = [];
    if(!json) json = [];

window.deleteS = (i) => {
    deleted.push(json[i]);
json.splice(i, 1);
            localStorage.l = JSON.stringify(json);
            localStorage.d = JSON.stringify(deleted);
    update();
}

let update = () => {
    let j = '';
    let i = 0;
    document.querySelector('#list').innerHTML = '';
    json.forEach(e => {
        if(!deleted.includes(e))
            j += '<div id="s-'+i+'" style="margin-right:5px"><span>'+e+'</span><button onclick="deleteS('+i+')" class="">X</button></div>';
        else
            j += '<div id="s-'+i+'" style="margin-right:5px"><span style="color:yellow" title="you deleted this token">'+e+'</span><button onclick="deleteS('+i+')" class="">X</button></div>';
        i++;
        document.querySelector('#list').innerHTML = j;
    });
    if(document.querySelector('#list').innerHTML == '') document.querySelector('#list').innerHTML = 'Empty';
}

    let token;
    setTimeout(() => {

        if(!document.querySelector('input')) location.reload();
        token = document.querySelector('input').value;
        if(!deleted.includes(token) && !json.includes(token)) {
            json.push(token);
            localStorage.l = JSON.stringify(json);
        }

        document.querySelectorAll('.mt-4.mb-4.row')[0].innerHTML = '<div id="list"></div>';
        document.querySelectorAll('.ad')[0].remove();
        update();

        //document.querySelectorAll('.ad').forEach(e => e.remove());

        setInterval(()=>{
            let a = document.querySelector('.btn-lg');
            if(a) {
                a.click();
            }
        }, 1000);
    }, 3000);