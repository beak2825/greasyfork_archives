// ==UserScript==
// @name          BoxOfChocolates
// @description   Gives you a ready-to-use command to install multiple packages that you select on chocolatey.org
// @author        SundaraRaman R updated by ifugu
// @version       0.1.2
// @include       http://*chocolatey.org/*
// @include       https://*chocolatey.org/*
// @grant         none
// @history       0.1.2 added support for SSL
// @history       0.1.1 fixed script to look for 'choco install' instead of 'cinst'; fixed command output
// @history       0.1.0 initial version by SundaraRaman R
// @namespace https://greasyfork.org/users/2306
// @downloadURL https://update.greasyfork.org/scripts/5175/BoxOfChocolates.user.js
// @updateURL https://update.greasyfork.org/scripts/5175/BoxOfChocolates.meta.js
// ==/UserScript==

var pkg_names_store = 'GMx_abiteasier_chocolates'; //stores package names uniquely using JSON
var get_em_all_store = 'GMx_abiteasier_cmd'; //actual command created from pkg_names_store

insert_clickme_style(); // Create and insert a style for clickable small texts ("Add to Box" and "Clear all")
insert_add_to_box();
write_box(localStorage[get_em_all_store]);

function insert_clickme_style() {
    var s = document.createElement('style');
    s.type = 'text/css';
    var style_content = '.GMx_click_me {';
    style_content += 'font-size: 70%; line-height: 0.9; color: #C96;';
    style_content += 'cursor: pointer; border-bottom: thin dotted;';
    style_content += 'float: right;';
    style_content += '}';
    style_content += ' #GMx_box_o_choc { font-size: 1.1em; }';
    s.appendChild(document.createTextNode(style_content));

    document.head.appendChild(s);
}

function storage_callback(storage_event) {
    if (storage_event.key === get_em_all_store) {
        if (storage_event.newValue) { //if it has been assigned a new value rather than removed
            update_box(localStorage[get_em_all_store]);
        }
        else {
            clear_the_box();
        }
    }
}
window.addEventListener('storage', storage_callback, false);

function update_box(new_cmd) {
    var box_o_choc = document.getElementById('GMx_box_o_choc');
    if (box_o_choc) {
        box_o_choc.firstChild.nodeValue = new_cmd;
        box_o_choc.parentNode.style.display = "block";
    }
    else {
        write_box(new_cmd);
    }
}

function clear_the_box() 
{
    var outer_box = document.getElementById('GMx_box_container');
    outer_box.style.display = 'none';
    var inner_box = document.getElementById('GMx_box_o_choc');
    inner_box.firstChild.nodeValue = '';
}

function write_box(get_em_all_cmd) {
    var text_elem = document.createTextNode(get_em_all_cmd || '');

    var clear_elem = document.createElement('span');
    var clear_text = document.createTextNode('Clear All');
    clear_elem.appendChild(clear_text);
    clear_elem.classList.add('GMx_click_me');
    clear_elem.onclick = function () {
        localStorage.removeItem(get_em_all_store);
        localStorage.removeItem(pkg_names_store);
        clear_the_box();
    }

    var box_o_choc = document.createElement('code');
    box_o_choc.appendChild(text_elem);
    box_o_choc.appendChild(clear_elem);
    box_o_choc.id = 'GMx_box_o_choc';

    var box_label = document.createElement('div');
    var label_text = "Your box o' chocolates:";
    box_label.appendChild(document.createTextNode(label_text));
    box_label.style.padding = '2px 5px 2px 1px';

    var box_container = document.createElement('div');
    box_container.appendChild(box_label);
    box_container.appendChild(box_o_choc);
    box_container.style.border = '1px solid';
    box_container.style.borderRadius = '2px';
    box_container.style.color = '#663300';
    box_container.style.margin = '5px 0px';
    box_container.style.padding = '0px 0px 1px 0px';
    box_container.style.backgroundColor = '#CC9966';
    box_container.id = 'GMx_box_container';
    box_container.classList.add('nuget-badge');

    if (! get_em_all_cmd) {
        box_container.style.display = 'none';
    }
    document.getElementById('content-wrapper').insertBefore(box_container, document.getElementById('body'));

}

function make_get_em_all_cmd(box_obj)
{
    var cmd = 'choco install';
    for (var key in box_obj) {
        if (box_obj.hasOwnProperty(key))
            cmd += " '" + key + "'";
    }
    return cmd;
}

function get_atb_elem(pkg_name) {
    var add_to_box = document.createElement('span');
    var atb_text = document.createTextNode('Add to Box');
    add_to_box.appendChild(atb_text);
    add_to_box.id = 'GMx_addtobox'; 
    add_to_box.classList.add('GMx_click_me');

    add_to_box.onclick = function() {
        var box_contents = JSON.parse(localStorage[pkg_names_store] || '{}');
        box_contents[pkg_name] = 'add_this';
        localStorage[pkg_names_store] = JSON.stringify(box_contents);
        var get_em_all_cmd = make_get_em_all_cmd(box_contents);
        localStorage[get_em_all_store] = get_em_all_cmd;
        update_box(get_em_all_cmd);
    }

    return add_to_box;
}

function insert_add_to_box() {
    var code_elems = document.getElementsByTagName('code');

    var cinst_regex = /choco\s+install\s+([\s\S]+)/;
    for (var i = 0; i < code_elems.length; i++) {
        var ce = code_elems[i];
        var cmd = ce.textContent;
        var cinst_match = cmd.match(cinst_regex);

        if (cinst_match) {
            var cmdStr = cinst_match[1].replace(/(\r\n|\n|\r)/gm, '').trim().replace(/\s+/g, ' '),
                add_to_box = get_atb_elem(cmdStr);
            ce.appendChild(add_to_box);
        }
    }
}
