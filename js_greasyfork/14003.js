// ==UserScript==
// @name           Rutracker Blacklist
// @namespace	   https://greasyfork.org/ru/users/19952-xant1k-bt
// @description    Personal ban-list
// @include        https://rutracker.org/forum/viewtopic.php*
// @author         moscow-beast
// @license        GPLv2
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/14003/Rutracker%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/14003/Rutracker%20Blacklist.meta.js
// ==/UserScript==

// init vars
var trolls;
var topmenu;
var delimiter;
var scriptmenu;
var setuparea;
var hide;
var hidehtml;
var l10n = {
    link_name   :   'Blacklist',
    save        :   'Сохранить',
    cancel      :   'Отменить',
    hide_users  :   'Скрывать посты этих пользователей'
}

function elemenateTrolls() {
    var pnics = document.getElementsByClassName('nick')
    for (i=0; pnics[i]!=undefined; i++) {
        nic = pnics[i].getElementsByTagName('a')[0];
        if (nic.innerText.match(makeRegExp(trolls))) {
            nic.parentNode.parentNode.parentNode.parentNode.style.display='none';
        }
    }
}
function restorePosts() {
    var posts1 = document.getElementsByClassName('row1');
    var posts2 = document.getElementsByClassName('row2');
    for (i=0; posts1[i]!=undefined; i++) if (posts1[i].style.display=='none') posts1[i].style.display='table-row-group';
    for (i=0; posts2[i]!=undefined; i++) if (posts2[i].style.display=='none') posts2[i].style.display='table-row-group';
}
function menuClickHandler() {
    if (setuparea.style.display == 'none') {
        setuparea.style.display = 'block';
    } else {
        setuparea.style.display = 'none';
    }
}
function updateSetup() {
    setuparea.style.display = 'none';
    trolls = document.getElementById('at_trollslist').value.replace(/[\n\l]{2,}/g, '\n');
    document.getElementById('at_trollslist').value=trolls;
    hide = document.getElementById('at_hide').checked;
    localStorage.setItem('at_list', trolls);
    localStorage.setItem('at_hide', hide);
    restorePosts();
    if (hide == true) elemenateTrolls();
}
function makeRegExp(list) {
    var temp = list.split('\n');
    return "/^"+temp.join('$|^')+"$|unknown_bug/";
}
function initAT() {
    topmenu = document.getElementById('main-nav').getElementsByClassName('nowrap')[1];
    delimiter = document.createTextNode('· ');
    scriptmenu = document.createElement('a');
    setuparea = document.createElement('div');
    trolls = localStorage.getItem('at_list');
    if (trolls == null) trolls = '';
    hide = localStorage.getItem('at_hide');
    if (hide == null) {
        hide = 'false';
        localStorage.setItem('at_list', 'false');
    }
    if (hide == 'false') hidehtml = '';
    else hidehtml = ' checked';
    var setupareahtml = '<textarea style="width: 320px; height: 320px;" id="at_trollslist">'+trolls+'</textarea>';
    setupareahtml += '<p><label><input type="checkbox" '+hidehtml+' id="at_hide"> '+l10n.hide_users+'</label></p>';
    setupareahtml += '<p style="text-align: right"><input type="button" id="at_cancel" value="'+l10n.cancel+'">';
    setupareahtml += '<input type="button" id="at_save" value="'+l10n.save+'">';
    setuparea.innerHTML=setupareahtml;
    setuparea.style.backgroundColor="#EFEFEF";
    setuparea.style.border="1px solid #CFD4D8";
    setuparea.style.padding="5px";
    setuparea.style.width="322px";
    setuparea.style.margin="3px 5px 0";
    setuparea.style.position="absolute";
    setuparea.style.right="12px";
    setuparea.style.textAlign="left";
    setuparea.style.display = 'none';
    setuparea.style.zIndex="1";
    scriptmenu.innerText = l10n.link_name;
    scriptmenu.setAttribute('href','javascript:void(0);');
    scriptmenu.style.fontWeight='bold';
    topmenu.appendChild(delimiter);
    topmenu.appendChild(scriptmenu);
    topmenu.appendChild(setuparea);
    document.getElementById('at_save').addEventListener("click",updateSetup,false);
    document.getElementById('at_cancel').addEventListener("click",function(){setuparea.style.display = 'none';},false);
    scriptmenu.addEventListener("click",menuClickHandler,false);
    if (hide == 'true') elemenateTrolls();
}

initAT();