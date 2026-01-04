// ==UserScript==
// @name         tapuz
// @namespace    http://tampermonkey.net/
// @version      0.05
// @description  tapuz forum msgs
// @author       clayton sh
// @match        https://forums.tapuz.co.il/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/406776/tapuz.user.js
// @updateURL https://update.greasyfork.org/scripts/406776/tapuz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //fix_unread_bug();

    if (window.location.href.indexOf('threads') != -1) {
        tapuz();
    }
})();


function tapuz() {
    indent();
    let blockquote_list = document.querySelectorAll('blockquote');
    for (let i=0; i<blockquote_list.length; i++) {
        blockquote_list[i].style.display = 'none';
    }
    const short_height = '5em';
    const expand_lbl = '+';
    const short_lbl = 'X';

    let list = document.querySelectorAll('article');
    let style = 'height:1.5em;cursor:pointer;padding:2px;margin:5px;background:white;color:blue;font-size:80%;';
    let box_close_all_child = document.createElement('div');
    box_close_all_child.style.cssText = style;
    box_close_all_child.style.width = 'fit-content';
    box_close_all_child.onclick = function() {
        for (let i = 0; i < list.length; i++) {
            if ((list[i].style.marginRight != '') && ((get_child_count(list, i) > 0) || (parseInt(list[i].style.marginRight) != 0)) && list[i].children[1]) {
                let footer = list[i].querySelectorAll('footer')[0];
                footer.style.display = 'none';
                list[i].children[1].style.maxHeight = short_height;
                list[i].children[1].style.overflow = 'hidden';
            }
        }
        switch_expand_short(document, short_lbl, expand_lbl);
    }
    box_close_all_child.innerText ='לצמצם את כל ההודעות';
    let bar = document.getElementsByClassName('p-nav-opposite')[0];
    bar.parentNode.insertBefore(box_close_all_child, bar);
    for (let i=0; i<list.length; i++) {
        if (list[i].style.marginRight != '') {
            if (get_child_count(list,i) > 0) {
                let is_first = (parseInt(list[i].style.marginRight) == 1);

                let box_close = document.createElement('div');
                let box_open = document.createElement('div');
                box_close.onclick = function() {
                    for (let j = i+1; j < list.length; j++) {
                        if (list[j].style.marginRight != '') {
                            if (div_is_indented(list[j], list[i])) {
                                list[j].style.display = 'none';
                            }
                            else break;
                        }
                    }
                }
                box_close.style.cssText = style;
                box_close.innerText = 'לסגור מתחת';

                box_open.onclick = function() {
                    list[i].children[1].style.maxHeight = '';
                    let footer = list[i].querySelectorAll('footer')[0];
                    footer.style.display = '';
                    for (let j = i+1; j < list.length; j++) {
                        if ((list[j].style.marginRight != '') && list[j].children[0]) {
                            if (div_is_indented(list[j], list[i])) {
                                list[j].style.display = '';
                                list[j].children[1].style.maxHeight = '';
                                let footer = list[j].querySelectorAll('footer')[0];
                                footer.style.display = '';
                                switch_expand_short(list[j], expand_lbl, short_lbl);
                            }
                            else break;
                        }
                    }
                    switch_expand_short(list[i], expand_lbl, short_lbl);
                }
                box_open.style.cssText = style;
                box_open.innerText = 'לפתוח מתחת';

                let box_close_parent = null;
                if (!is_first) {
                    box_close_parent = document.createElement('div');
                    box_close_parent.onclick = function() {
                        let j=i;
                        while (((list[j].style.marginRight == '') || (parseInt(list[j].style.marginRight) > 1)) && (j > 0)) {
                            j--;
                        }
                        for (let k=j+1; k < list.length; k++) {
                            if (list[k].style.marginRight != '') {
                                if (div_is_indented(list[k], list[j])) {
                                    list[k].style.display = 'none';
                                }
                                else break;
                            }
                        }
                    }
                    box_close_parent.style.cssText = style;
                    box_close_parent.innerText = 'לסגור את תת-השרשור כולו';
                }
                let button_wrapper = document.createElement('div');
                button_wrapper.style.display = 'flex';
                list[i].appendChild(button_wrapper);
                button_wrapper.appendChild(box_open);
                button_wrapper.appendChild(box_close);
                if (box_close_parent) button_wrapper.appendChild(box_close_parent);

            }

            let header = list[i].querySelectorAll('header')[0]
            let box_open_this = document.createElement('div');
            box_open_this.onclick = function() {
                if (box_open_this.innerText == expand_lbl) {
                    list[i].children[1].style.maxHeight = '';
                    list[i].querySelectorAll('footer')[0].style.display = '';
                    box_open_this.innerText = short_lbl;
                }
                else {
                    list[i].children[1].style.maxHeight = short_height;
                    list[i].children[1].style.overflow = 'hidden';
                    list[i].querySelectorAll('footer')[0].style.display = 'none';
                    box_open_this.innerText = expand_lbl;

                }
            }
            box_open_this.style.cssText = style;
            box_open_this.style.fontSize = '150%';
            box_open_this.style.margin = '0px';
            box_open_this.style.marginLeft = '1em';
            box_open_this.innerText = short_lbl;

            if (i > 0) {
                let box_close_above = document.createElement('div');
                box_close_above.onclick = function() {
                    let j = i-1;
                    while (((list[j].style.marginRight == '') || (list[j].margin > list[i].margin)) && (j > 0)) {
                        j--;
                    }
                    for (let k=j+1; k < list.length; k++) {
                        if (list[k].style.marginRight != '') {
                            if (div_is_indented(list[k], list[j])) {
                                list[k].style.display = 'none';
                            }
                            else break;
                        }
                    }
                }
                box_close_above.style.cssText = style;
                box_close_above.style.margin = '0px';
                box_close_above.style.marginLeft = '1em';
                box_close_above.innerText = 'לסגור את תת-השרשור מעל';
                header.insertBefore(box_close_above, header.children[0]);
            }



            let quote = list[i].querySelectorAll('blockquote');
            if (quote[0]) {
                let quote_open_this = document.createElement('div');
                quote_open_this.onclick = function() {
                    quote[0].style.display = '';
                }
                quote_open_this.style.cssText = style;
                quote_open_this.style.margin = '0px';
                quote_open_this.style.marginLeft = '1em';
                quote_open_this.innerText = 'ציטוט';
                header.insertBefore(quote_open_this, header.children[0]);
            }

            header.insertBefore(box_open_this, header.children[0]);


        }
    }
}

function div_is_indented(d1, d2) {
    return(parseInt(d1.style.marginRight) > parseInt(d2.style.marginRight));

}

function fix_unread_bug() {
    let list = document.querySelectorAll('a');
    for (let i = 0; i < list.length; i++) {
        for (let c of ['unread','latest']) {
            let unread_ix = list[i].href.indexOf(c);
            if (unread_ix != -1) {
                list[i].href = list[i].href.substring(0,unread_ix);
            }
        }
    }
}


function get_child_count(list, start_ix) {
    let child_cnt = 0;
    for (let j = start_ix+1; j < list.length; j++) {
        if (list[j].style.marginRight != '') {
            if (div_is_indented(list[j], list[start_ix])) {
                child_cnt++;
            }
            else break;
        }
    }
    return(child_cnt);
}

function indent() {
    let list = document.querySelectorAll('article');
    for (let i=0; i<list.length; i++) {
        if (list[i].style.marginRight != '') {
            if (list[i].margin == undefined) {
                list[i].margin = parseInt(list[i].style.marginRight);
            }
            if (list[i].margin > 1) {
                list[i].style.marginRight = (list[i].margin + (50 * (list[i].margin-1))).toString() + 'px';
            }
        }
    }
}

function switch_expand_short(elem, from, to) {
    let btn_list = elem.querySelectorAll('div');
    for (let i = 0; i < btn_list.length; i++) {
        if (btn_list[i].innerText == from) {
            btn_list[i].innerText = to;
        }
    }
}


