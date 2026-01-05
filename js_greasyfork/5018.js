// ==UserScript==
// @name		FUPI
// @namespace	http://forum.pravda.com.ua
// @version    	0.6
// @description	FUP Ignore
// @match		http://forum.pravda.com.ua/index.php?board*
// @match		http://forum.pravda.com.ua/index.php?topic*
// @copyright	2014+, forum.pravda.com.ua
// @grant		GM_getValue
// @grant		GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/5018/FUPI.user.js
// @updateURL https://update.greasyfork.org/scripts/5018/FUPI.meta.js
// ==/UserScript==

processPage(null);

function processPage(dialog) {
    var initialized = dialog != null, ignored = load(), i;
    if(!initialized)
        dialog = createDialog(document.getElementById('user-info'));
        
    if (document.location.href.match('board') !== null) {
        var topicRows = document.getElementsByClassName('list')[0].rows;
        for (i = 1; i < topicRows.length; i++) {
            var autherLink = topicRows[i].cells[3].getElementsByTagName('a')[0];
            if (!initialized) {
                topicRows[i].cells[3].appendChild(createToggleButton(autherLink, true, dialog));

                var lastWriterLink = topicRows[i].cells[4].getElementsByTagName('a')[1];
                topicRows[i].cells[4].appendChild(createToggleButton(lastWriterLink, true, dialog));
            }
            topicRows[i].style.display = getUserIndex(autherLink.innerHTML, ignored) == -1 ? 'table-row' : 'none';
        }
    } else {
        var postDivs = document.getElementsByClassName('message');        
        for (i = 0; i < postDivs.length; i++) {
            var userLink = postDivs[i].getElementsByTagName('a')[1];
            if (!initialized) {
                var userDiv = postDivs[i].getElementsByClassName('message-author icon-user')[0];
                userDiv.insertBefore(createToggleButton(userLink, true, dialog), userDiv.children[1]);
            }            
            postDivs[i].style.display = getUserIndex(userLink.innerHTML, ignored) == -1 ? 'inline' : 'none';
        }
    }
}

function load() {
    var ignored = [];
    try {
        var str = GM_getValue('FUP_IGNORED', '');
        if (str !== '')
            ignored = JSON.parse(str);
    } catch(error) {
        console.error("Ігнор список пошкоджено: ", error);
    }
    return ignored;
};

function save(ignored) {
    GM_setValue('FUP_IGNORED', JSON.stringify(ignored));
};

function createDialog(container) {
    var dialog = document.createElement('div');    
    container.innerHTML += " » ";
    var link = createLink('ignored-link', 'Ігноровані', 'Показати/сховати', 
		function () {
            dialog.style.display = dialog.style.display == 'none' ? 'inline' : 'none';
            updateDialog(dialog);
        }
	);
    container.appendChild(link);
    
    var style = dialog.style;
    style.display = 'none';
    style.position = 'fixed';
    style.textAlign = 'left';
    style.width = '150px';
    style.padding = '5px';
    style.border = '1px solid black';
    style.backgroundColor = 'white';
    container.appendChild(dialog);
    var linkRect = link.getBoundingClientRect();
    dialog.style.left = linkRect.right - 158 + 'px';
    dialog.style.top = linkRect.bottom + 'px';
    return dialog;
}

function updateDialog(dialog) {
    if (dialog.style.display == 'inline') {
        while (dialog.firstChild)
            dialog.removeChild(dialog.firstChild);
        
        var ignored = load();    
        if (ignored.length === 0)
            dialog.appendChild(document.createElement('div')).innerHTML = '(пусто)';
        else {
            for (i = 0; i < ignored.length; i++) {
                var userDiv = document.createElement('div');
                var userLink = createLink(null, ignored[i].name, 'Перегляд профілю ' + ignored[i].name, ignored[i].profile);
                userDiv.appendChild(userLink);
                userDiv.appendChild(createToggleButton(userLink, false, dialog));
    
                dialog.appendChild(userDiv);
            }
        }
    }
}

function createToggleButton(userLink, toIgnore, dialog) {
    var result = createLink(null, 'x', toIgnore ? 'Ігнорувати ' : 'Не ігнорувати ' + userLink.innerHTML, 
		function() {
            var ignored = load(), ignoredIndex = getUserIndex(userLink.innerHTML, ignored);            
            if(toIgnore == (ignoredIndex == -1)) {                
                if(toIgnore)
                    ignored.push({profile: userLink.href, name: userLink.innerHTML});
                else
                    ignored.splice(ignoredIndex, 1);                
                save(ignored);
                processPage(dialog);
                updateDialog(dialog);
            }
        }
	);
	result.style.fontWeight = 'normal';
    result.style.paddingLeft = toIgnore ? '5px' : '9px';
    return result;
}

function createLink(id, innerHTML, title, target) {
    var result = document.createElement('a');
    result.style.cursor = 'pointer';
    result.id = id;
    result.innerHTML = innerHTML;
    result.title = title;
    if(typeof target == 'string')
        result.href = target;
    else 
        result.addEventListener('click', target);
    return result;
}

function getUserIndex(name, list) {
    var result = -1;
    for (var i = 0; i < list.length; i++)
        if (list[i].name == name) {
            result = i;
            break;
        }
    return result;
}