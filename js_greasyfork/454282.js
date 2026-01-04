// ==UserScript==
// @name         Add button on exhentai searchbox
// @description  Add your favorite keyword/tag on the searchbox
// @license      MIT
// @version      0.7
// @match        https://exhentai.org/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/383371
// @downloadURL https://update.greasyfork.org/scripts/454282/Add%20button%20on%20exhentai%20searchbox.user.js
// @updateURL https://update.greasyfork.org/scripts/454282/Add%20button%20on%20exhentai%20searchbox.meta.js
// ==/UserScript==

function convertColor(hexa){
    let chunks = [];
    let tmp,i;
    hexa = hexa.substr(1); // remove the pound
    if ( hexa.length === 3){
        tmp = hexa.split("");
        for(i=0;i<3;i++){
            chunks.push(parseInt(tmp[i]+""+tmp[i],16));
        }
    }else if (hexa.length === 6){
        tmp = hexa.match(/.{2}/g);
        for(i=0;i<3;i++){
            chunks.push(parseInt(tmp[i],16));
        }
    }else {
        throw new Error("'"+hexa+"' is not a valid hex format");
    }

    return chunks;
}

function convertToHexColor(decArray){
    let i,l = decArray.length,
    hexColor = "#";

    for (i=0;i<l;i++){
        hexColor += decArray[i].toString(16).padStart(2, '0');
    }
    return hexColor;
}

function add_btn(tag, name, color=null){
    let ep1 = document.createElement('input');
    if(color){
        ep1.style.background = color;
    }
    ep1.type = 'button';
    ep1.value = name;
    ep1.tag = tag;
    ep1.onclick = function(e){
        let search_box = document.getElementById('searchbox').firstChild.childNodes[2].childNodes[0];
        let search_submit = document.getElementById('searchbox').firstChild.childNodes[2].childNodes[1];
        if(search_box.value.indexOf(e.target.tag) == -1){
            search_box.value = (search_box.value+ ' ' + e.target.tag).trim();
            search_submit.click();
        }else{
            search_box.value = search_box.value.replace(e.target.tag, '').trim();
        }
    }
    ep1.oncontextmenu = delete_tag;
    /*function(e){
        e.preventDefault();
        let name = e.target.value
        let result = confirm('Delete [' + name + ']?');
        if(result){
            let config = JSON.parse(window.localStorage.getItem('config'));
            let new_config = [];
            for(e of config){
                if(e[1] != name){
                    new_config.push(e);
                }
            }
            window.localStorage.setItem('config', JSON.stringify(new_config));
            window.location.href = window.location.href;
        }
    }*/
    ep1.id = 'tag_' + name;
    ep1.draggable = true;
    ep1.ondragstart = drag;
    ep1.ondrop = drop;
    ep1.ondragover = allow_drop;
    document.getElementById('searchbox').firstChild.childNodes[2].append(ep1);
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

function add_add_tag_btn(){
    let ep0 = document.createElement('div');
    let ep1 = document.createElement('input');
    let ep2 = document.createElement('input');
    ep1.id = 'operation_button';
    ep1.type = 'button';
    ep1.value = '+';
    ep1.onclick = function(){
        var tag_name = prompt('tag#name or tag. [language:chinese$#Chinese] or [language:chinese$]', '');
        if(!tag_name){
            return;
        }
        if(tag_name.includes('#')){
            let tmp = tag_name.split('#');
            let tag = tmp[0];
            let name = tmp[1];
            add_tag(tag, name);
            window.location.href = window.location.href;
            return;
        }else{
            var tag = tag_name;
        }
        var name = prompt('name', '');
        if(!name){
            return;
        }
        add_tag(tag, name);
        window.location.href = window.location.href;
    }
    ep1.oncontextmenu = function(e){
        e.preventDefault();
        ep2.click();
    }
    ep2.type = 'color';
    ep2.hidden = true;
    ep2.id = 'color_panel';
    ep2.onchange = sync_color;
    ep0.append(ep1);
    ep0.append(ep2);
    ep0.style.display = 'inline';

    ep0.id = 'operation_box';
    ep0.draggable = true;
    ep0.ondragstart = drag;
    ep0.ondrop = drop;
    ep0.ondragover = allow_drop;

    document.getElementById('searchbox').firstChild.childNodes[2].append(ep0);
}

window.addEventListener('DOMContentLoaded',function(event){
    if(document.getElementById('searchbox')){
        add_add_tag_btn();
        let ep_br = document.createElement('p');
        ep_br.value = '<br>';
        document.getElementById('searchbox').firstChild.childNodes[2].append(ep_br);
        let search_tag_config = JSON.parse(window.localStorage.getItem('search_tag_config'));
        let config = JSON.parse(window.localStorage.getItem('config'))
        if(search_tag_config){
            for(let e of search_tag_config){
                add_btn(e.value, e.key, e.color);
            }
            for(let i=search_tag_config.length;i<config.length;i++){
                add_btn(config[i][0], config[i][1]);
            }
        }else{
            if(config){
                for(let e of config){
                    add_btn(e[0], e[1]);
                }
            }
        }
        document.getElementById('searchbox').firstChild.childNodes[2].firstChild.style.width = '519px';
    }
});

function drag(e){
    e.dataTransfer.setData("target_id", e.target.id);
}

function sync_color(e){
    let color_codes = convertColor(document.getElementById('color_panel').value);
    let radial_color_codes = [Math.max(color_codes[0]-32, 0), Math.max(color_codes[1]-32, 0), Math.max(color_codes[2]-32, 0)];
    document.getElementById('operation_button').style.background = `radial-gradient(${convertToHexColor(radial_color_codes)},${convertToHexColor(color_codes)})`;
}

function drop(event){
    event.preventDefault();
    let drop_target = event.target;
    let drag_target_id = event.dataTransfer.getData('target_id');
    if(drag_target_id.startsWith('tag')){
        let drag_target = document.getElementById(drag_target_id);
        let tmp = document.createElement('span');
        tmp.className = 'hide';
        drop_target.before(tmp);
        drag_target.before(drop_target);
        tmp.replaceWith(drag_target);
    }else if(drag_target_id == 'operation_box'){
        let color_codes = convertColor(document.getElementById('color_panel').value);
        let radial_color_codes = [Math.max(color_codes[0]-32, 0), Math.max(color_codes[1]-32, 0), Math.max(color_codes[2]-32, 0)];
        console.log(radial_color_codes);
        console.log(convertToHexColor(color_codes));
        console.log(convertToHexColor(radial_color_codes));
        event.target.style.background = `radial-gradient(${convertToHexColor(radial_color_codes)},${convertToHexColor(color_codes)})`;
    }
    save_tags();
}

function allow_drop(e){
    e.preventDefault();
}

function save_tags(){
    let tags_list = document.getElementById('searchbox').firstChild.childNodes[2].childNodes;
    let config = [];
    let search_tag_config = [];
    for(let i=5;i<tags_list.length;i++){
        config.push([tags_list[i].tag, tags_list[i].value]);
        search_tag_config.push(
            {
                'key': tags_list[i].value,
                'value': tags_list[i].tag,
                'color': tags_list[i].style.background,
            }
        );
    }
    window.localStorage.setItem('config', JSON.stringify(config));
    window.localStorage.setItem('search_tag_config', JSON.stringify(search_tag_config));
}

function delete_tag(e){
    e.preventDefault();
    let name = e.target.value
    let result = confirm('Delete [' + name + ']?');
    if(result){
        let config = JSON.parse(window.localStorage.getItem('config'));
        if(config){
            let new_config = [];
            for(e of config){
                if(e[1] != name){
                    new_config.push(e);
                }
            }
            window.localStorage.setItem('config', JSON.stringify(new_config));
        }
        let search_tag_config = JSON.parse(window.localStorage.getItem('search_tag_config'));
        if(search_tag_config){
            let new_search_tag_config = [];
            for(let ele of search_tag_config){
                if(ele.key != name){
                    new_search_tag_config.push(
                        {
                            'key': ele.key,
                            'value': ele.value,
                            'color': ele.color,
                        }
                    );
                }
            }
            window.localStorage.setItem('search_tag_config', JSON.stringify(new_search_tag_config));
        }
        window.location.href = window.location.href;
    }
}
