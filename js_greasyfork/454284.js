// ==UserScript==
// @name         Add button on exhentai searchbox from tag button
// @description  Add your favorite keyword/tag on the searchbox from tag button
// @license      MIT
// @version      0.4
// @match        https://exhentai.org/g/*
// @run-at       context-menu
// @namespace https://greasyfork.org/users/383371
// @downloadURL https://update.greasyfork.org/scripts/454284/Add%20button%20on%20exhentai%20searchbox%20from%20tag%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/454284/Add%20button%20on%20exhentai%20searchbox%20from%20tag%20button.meta.js
// ==/UserScript==


function capitalize(str) {
   var tmp = str.toLowerCase().split(' ');
   for(let i = 0; i < tmp.length; i++) {
       tmp[i] = tmp[i].charAt(0).toUpperCase() + tmp[i].substring(1);
   }
   return tmp.join(' ');
}

function add_tag(tag, name){
    let config = JSON.parse(window.localStorage.getItem('config'));
    if(!config){
        config = [];
    }
    config.push([tag, name]);
    window.localStorage.setItem('config', JSON.stringify(config));
    let search_tag_config = JSON.parse(window.localStorage.getItem('search_tag_config'));
    if(!search_tag_config){
        search_tag_config = [];
        if(config){
            for(let ele of config){
                search_tag_config.push(
                    {
                        'key': ele[1],
                        'value': ele[0],
                        'color': '',
                    }
                );
            }
        }
    }else{
        search_tag_config.push(
            {
                'key': name,
                'value': tag,
                'color': '',
            }
        );
    }
    window.localStorage.setItem('search_tag_config', JSON.stringify(search_tag_config));
}

(function() {
    if(document.activeElement.id.substring(0, 2) == 'ta'){
        let tag = document.activeElement.href.substring(document.activeElement.href.indexOf('tag/') + 4).replaceAll('+', ' ');
        let tmp = tag.split(':');
        let tag_namespace = tmp[0];
        let tag_value = tmp[1];
        tag_value += '$';
        if(tag_value.includes(' ')){
            tag_value = `"${tag_value}"`;
        }
        let name = prompt('name', capitalize(document.activeElement.innerText));
        if(!name){
            return;
        }
        add_tag(`${tag_namespace}:${tag_value}`, name);
        alert(`${tag_namespace}:${tag_value} added`);
    }else if(document.activeElement.href.includes('uploader')){
        let uploader = document.activeElement.text;
        let tag = `uploader:${uploader}`;
        let name = prompt('name', capitalize(uploader));
        if(!name){
            return;
        }
        add_tag(`${tag}`, name);
        alert(`${tag} added`);
    }
})();
