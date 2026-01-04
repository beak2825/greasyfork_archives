// ==UserScript==
// @name         atcoder-lang
// @namespace    
// @version      0.1
// @description  try to take over the world!
// @author       uesugi
// @match       https://atcoder.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415889/atcoder-lang.user.js
// @updateURL https://update.greasyfork.org/scripts/415889/atcoder-lang.meta.js
// ==/UserScript==


async function aaa() {

    const res = await fetch("https://kenkoooo.com/atcoder/resources/lang.json", { cache: 'force-cache' });
    const list = await res.json();

    Array.prototype.forEach.call(document.querySelectorAll('.username'), function (u) {
        if (!u.href.includes('/users/')) {
            return;
        }
        const user_id = u.text;

        const angArray = fcfc(list, user_id);
        if (angArray.length === 0) {
            return;
        }


        const str_array = angArray.map((element) => {
            return element['language'] + ' : ' + element['count'];
        });

        let lang = angArray[0]['language'];

        const langSize = angArray.length;

        let lang_str = '';
        if (langSize >= 3) {
            lang_str += '/' + angArray[2]['language'];
        }
        if (langSize >= 2) {
            lang += '<span style="font-size: 10px;">' + '/' + angArray[1]['language'] + lang_str + ' </span>';
        }

        u.insertAdjacentHTML('beforeend', '/' + '<span data-toggle="tooltip" data-html="true" data-placement="right" style="font-size: 12px;" title="' + str_array.join('<br>') + '">' + lang + '</span>');
        $('[data-toggle="tooltip"]').tooltip();
    });
}

function fcfc(list, user_id) {
    const trim_user_id = user_id.trim();
    const index = binary_search(list, trim_user_id);
    return sequence_search(trim_user_id, list, index);


}

function binary_search(list, key) {

    let left = -1;
    let right = list.length;


    while (right - left > 1) {
        let mid = Math.floor(left + (right - left) / 2);

        if (isOK(mid, key, list)) {
            right = mid;
        } else {
            left = mid;
        }
    }


    return right;
}
function isOK(index, key, list) {
    if (list[index]['user_id'] >= key) {
        return true;
    }
    return false;


}
function sequence_search(user_id, list, index) {

    let array = new Array();
    array = array.concat(search_one(user_id, list, index, 1));
    array = array.concat(search_one(user_id, list, index - 1, -1));

    array.sort((a, b) => b['count'] - a['count']);

    return array;
}
function search_one(user_id, list, index, add) {
    const array = new Array();
    while (1) {
        if (list[index]['user_id'] !== user_id) {
            break;
        }
        array.push(list[index]);
        index += add;
    }

    return array;
}

function bbb() {
    const target = document.querySelector('#standings-tbody');


    const observer = new MutationObserver(records => {
        aaa();
    });


    observer.observe(target, {
        subtree: true,
        childList: true
    });
    aaa();
}



const MAX_RETRY_COUNT_FIND_DIFF_CONTAINER = 30;
var retry_counter = 0;


function getDiffContainerElements() {
    retry_counter++;

    if (retry_counter > MAX_RETRY_COUNT_FIND_DIFF_CONTAINER) {
        clearInterval(set_interval_id);
        delete set_interval_id;
    }
    var diff_container_elements = document.getElementById('standings-tbody');
    if (diff_container_elements != null) {
        if (typeof (set_interval_id) != 'undefined') {
            clearInterval(set_interval_id);
            delete set_interval_id;

            bbb();
        } else {
            return diff_container_elements;
        }
    }
}
var set_interval_id = setInterval(getDiffContainerElements, 1000);


