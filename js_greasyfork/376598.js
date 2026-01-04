// ==UserScript==
// @name        HWM_WH_Helper
// @namespace   Рианти
// @description Сохранение последних введенных данных по артам, работа без перезагрузки при сохранении новых параметров или взятии артов со склада, сохраненение всего одной кнопкой, и другое.
// @include     https://www.heroeswm.ru/sklad_info.php?id=*&cat=*
// @version     1.4
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/376598/HWM_WH_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/376598/HWM_WH_Helper.meta.js
// ==/UserScript==

// Когда цена оранжевая - значит, что сохраненная в скрипте цифра отличается от текущей на складе. Оранжевая - та что сохранена у тебя. Чтоб узнать текущую нужно навести мышку на поле с ценой, она будет в подсказке

///settings
var elementColorOnDifference = '#E97300';
var defaultAccessLevel = 0;
var checkerTimeout = 50; //ms
//\settings

var saveStack = [], removeStack = [], stackBusy = 0, dissasembly = 0, transferNick, transferPrice, battlesCount, leaseTime;

var constants = {
    disabledAccessLevel: '1000',
    inventorySign: ''
};

getSign(function (sign){ constants.inventorySign = sign });

function serialize (form) {
    if (!form || form.nodeName !== "FORM") {
        return;
    }
    var i, j, q = [];
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue;
        }
        switch (form.elements[i].nodeName) {
            case 'INPUT':
                switch (form.elements[i].type) {
                    case 'text':
                    case 'hidden':
                    case 'password':
                    case 'button':
                    case 'reset':
                    case 'submit':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                    case 'checkbox':
                    case 'radio':
                        if (form.elements[i].checked) {
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        }
                        break;
                }
                break;
            case 'file':
                break;
            case 'TEXTAREA':
                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                break;
            case 'SELECT':
                switch (form.elements[i].type) {
                    case 'select-one':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                    case 'select-multiple':
                        for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                            if (form.elements[i].options[j].selected) {
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                            }
                        }
                        break;
                }
                break;
            case 'BUTTON':
                switch (form.elements[i].type) {
                    case 'reset':
                    case 'submit':
                    case 'button':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                }
                break;
        }
    }
    return q.join("&");
}

var buttons = document.querySelectorAll('input[type="submit"][value="Сохранить"]');
for(var i = 0; i < buttons.length; i++){
    buttons[i].onclick = function(e){
        e.preventDefault();
        e.target.value = 'Сохраняем..';
        e.target.disabled = true;
        stackBusy = 1;
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: 'https://www.heroeswm.ru/sklad_info.php?' + serialize(e.target.form),
            method: "GET",
            onload: function(response){
                e.target.value = 'Сохранено';
                stackBusy = 0;
            }
        });
    };
    saveStack.push(buttons[i]);
}

buttons = document.querySelectorAll('input[type="submit"][value="Разобрать"]');
for(i = 0; i < buttons.length; i++){
    var t = buttons[i].parentElement.parentElement.parentElement.innerHTML.split('uid=');
    var st = [], uid;
    for (var j = 1; j < t.length; j++){
        uid = t[j].substr(0, t[j].indexOf('&'));
        if(st.indexOf(uid) == -1) st.push(uid);
    }
    buttons[i].id = '-1|' + st.join('|');
    buttons[i].onclick = function(e){
        if (!e.ctrlKey && !dissasembly){
            e.traget.form.submit(); // traget?
            return;
        }
        if(e.ctrlKey && e.shiftKey) {
            transferNick = prompt('Введите ник получателя:');
            if(!transferNick) return;
            transferPrice = prompt('Введите ЦЗБ каждого из артов:', 1);
            if(!transferPrice) return;
            battlesCount = prompt('Введите кол-во боёв:', 1);
            if(!battlesCount) return;
            leaseTime = prompt('Введите период аренды:', 0.1);
            if(!leaseTime) return;
        }
        e.preventDefault();
        stackBusy = 1;
        if(!e.shiftKey) e.target.value = 'Забираем..';
        else e.target.value = 'Вешаем..';
        e.target.disabled = true;
        disassemble(e);
    };
    removeStack.push(buttons[i]);
}

function disassemble(e) {
    if (e.target.id == '') {
        if (!e.shiftKey) e.target.value = 'Забрано';
        else e.target.value = 'Подвешено';
        stackBusy = 0;
        return;
    }

    var ids = e.target.id.split('|');
    var curId = ids.shift();
    e.target.id = ids.join('|');

    if (curId == '-1') {
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: 'https://www.heroeswm.ru/sklad_info.php?' + serialize(e.target.form),
            method: "GET",
            onload: function (response) {
                disassemble(e);
            }
        });
    } else {
        var se = 'set_id=0&inv_id=' + curId + '&action=get_art&cat=0&sign=' + serialize(e.target.form).split('sign=')[1];
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: 'https://www.heroeswm.ru/sklad_info.php?' + se,
            method: "GET",
            onload: function (response) {
                if (e.shiftKey){
                    var artId = curId,
                        recieverNick = transferNick,
                        price = transferPrice * battlesCount,
                        dayTime = leaseTime,
                        battles = battlesCount;
                    transferArt(artId, recieverNick, price, dayTime, battles, constants.inventorySign, function(){
                        disassemble(e);
                    });
                } else disassemble(e);
            }
        });
    }
}

buttons = document.querySelectorAll('input[type="submit"][value="Забрать"]');
for(i = 0; i < buttons.length; i++){
    buttons[i].onclick = function(e){
        e.preventDefault();
        if(e.shiftKey && e.ctrlKey){
            transferNick = prompt('Введите ник получателя:');
            if(!transferNick) return;
            transferPrice = prompt('Введите ЦЗБ каждого из артов:', 1);
            if(!transferPrice) return;
            battlesCount = prompt('Введите кол-во боёв:', 1);
            if(!battlesCount) return;
            leaseTime = prompt('Введите период аренды:', 0.1);
            if(!leaseTime) return;
            e.target.value = 'Вешаем..';
        }
        else e.target.value = 'Забираем..';
        e.target.disabled = true;
        stackBusy = 1;
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: 'https://www.heroeswm.ru/sklad_info.php?' + serialize(e.target.form),
            method: "GET",
            onload: function(response){
                if(e.shiftKey && e.ctrlKey){
                    var artId = e.target.form.querySelector('input[name="inv_id"]').value,
                        recieverNick = transferNick,
                        price = transferPrice * battlesCount,
                        dayTime = leaseTime,
                        battles = battlesCount;
                    transferArt(artId, recieverNick, price, dayTime, battles, constants.inventorySign, function(){
                        e.target.value = 'Подвешено';
                        stackBusy = 0;
                    });
                }
                else {
                    e.target.value = 'Забрано';
                    stackBusy = 0;
                }
            }
        });
    };
    removeStack.push(buttons[i]);
}

var forms = document.querySelectorAll('input[type="submit"][value="Сохранить"]');
for(i = 0; i < forms.length - 1; i++){
    var form = forms[i].parentElement.parentElement;
    var artId = form.querySelector('input[name="inv_id"]').value;
    var blimit = form.querySelector('select[name="blimit"]');
    var bcost = form.querySelector('input[name="bcost"]');
    var al = form.querySelector('select[name="al"]');

    var saved = JSON.parse(GM_getValue('saved' + artId, 'null'));
    if (saved){
        if(saved.blimit != null && blimit.selectedIndex != saved.blimit){
            blimit.title = 'Сейчас выставлено за: ' + blimit[blimit.selectedIndex].innerHTML;
            blimit.value = saved.blimit;
            blimit.style.color = elementColorOnDifference;
        }
        if(saved.bcost != null && bcost.value != saved.bcost){
            bcost.title = 'Текущее: ' + bcost.value;
            bcost.value = saved.bcost;
            bcost.style.color = elementColorOnDifference;
        }
        if(saved.al == constants.disabledAccessLevel) saved.al = 0;
        if(al.value == constants.disabledAccessLevel || (saved.al != null && al.value != saved.al)){
            al.title = 'Текущее: ' + al[al.selectedIndex].innerHTML;
            al.value = (saved.al != null ? saved.al : defaultAccessLevel);
            al.style.color = elementColorOnDifference;
        }
    }

    blimit.onchange = bcost.onchange = al.onchange = function(e){
        var form = e.target.form;
        var artId = form.parentNode.querySelector('input[name="inv_id"]').value;
        var saved = JSON.parse(GM_getValue('saved' + artId, '{}'));
        saved[e.target.name] = e.target.value;
        GM_setValue('saved' + artId, JSON.stringify(saved));
    }
}

if(document.location.href.indexOf('cat=4') == -1){
    var cell = document.querySelector('td[align="left"][colspan="2"]');
    var cellParent = cell.parentElement.parentElement;

    var tr = document.createElement('tr');
    cellParent.insertBefore(tr, cellParent.firstChild);

    var td = document.createElement('td');
    tr.appendChild(td);
    td.align = 'center';
    td.setAttribute('colspan', '3');
    td.innerHTML = '<input type="button" value="Сохранить всё" id="scr_save_all">';

    td = document.createElement('td');
    tr.appendChild(td);
    td.align = 'center';
    td.setAttribute('colspan', '3');
    td.innerHTML = '<input type="button" value="Забрать всё" id="scr_remove_all">';

    document.getElementById('scr_save_all').onclick = saveAll;

    document.getElementById('scr_remove_all').onclick = removeAll;
} else {
    var cell = document.querySelector('td[align="left"][colspan="3"]');
    var cellParent = cell.parentElement.parentElement;

    var tr = document.createElement('tr');
    cellParent.insertBefore(tr, cellParent.firstChild);

    var td = document.createElement('td');
    tr.appendChild(td);
    td.align = 'center';
    td.setAttribute('colspan', '6');
    td.innerHTML = '<input type="button" value="Сохранить всё" id="scr_save_all">';

    document.getElementById('scr_save_all').onclick = saveAll;
}

function saveAll(){
    if (!saveStack.length){
        document.location.reload();
        return;
    }
    if(stackBusy){
        setTimeout(saveAll, checkerTimeout);
        return;
    }

    var but = saveStack.shift();
    but.click();
    setTimeout(saveAll, checkerTimeout);
}

function removeAll(){
    if (!removeStack.length){
        document.location.reload();
        return;
    }
    if(stackBusy){
        setTimeout(removeAll, checkerTimeout);
        return;
    }
    dissasembly = 1;
    var but = removeStack.shift();
    but.click();
    setTimeout(removeAll, checkerTimeout);
}

var buttons = document.querySelectorAll('input[type="submit"][value="Разобрать"]');
for (var i = 0; i < buttons.length; i++){
    buttons[i].className = 'dissassembly';
}
buttons = document.querySelectorAll('input[type="submit"][value="Забрать"]');
for (var i = 0; i < buttons.length; i++){
    buttons[i].className = 'takeItem';
}

document.onkeydown = function(e){
    if (e.ctrlKey && !e.shiftKey) {
        var buttons = document.querySelectorAll('input[type="submit"][class="dissassembly"]');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].value = 'Забрать';
        }
    }
    if (e.ctrlKey && e.shiftKey) {
        var buttons = document.querySelectorAll('input[type="submit"][class="dissassembly"]');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].value = 'Подвесить';
        }
        buttons = document.querySelectorAll('input[type="submit"][class="takeItem"]');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].value = 'Подвесить';
        }
    }
};

document.onkeyup=function(e){
    if (!e.ctrlKey && !e.shiftKey) {
        var buttons = document.querySelectorAll('input[type="submit"][class="dissassembly"]');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].value = 'Разобрать';
        }
        buttons = document.querySelectorAll('input[type="submit"][class="takeItem"]');
        for (var i = 0; i < buttons.length; i++){
            buttons[i].value = 'Забрать';
        }
    }
};

function getSign(callbackFunc){
    requestPage ('https://www.heroeswm.ru/inventory.php', function(dom){
        try {
            var scripts = dom.querySelectorAll("script");
            var sign;
            for ( var i=scripts.length; i--; ) {
                sign = /sign=([a-z0-9]+)/.exec( scripts[i].innerHTML );
                if ( sign ) {
                    sign = sign[1];
                    break;
                }
            }
            console.log(sign);
            callbackFunc(sign);
        } catch ( e) { console.log (e)}
    });
}

function transferArt(artId, recieverNick, price, dayTime, battles, sign, callbackFunc){
			GM_xmlhttpRequest
			({
				method:"POST",
				url: "https://www.heroeswm.ru/art_transfer.php" ,
				headers:
				{
					'Content-Type'		: 'application/x-www-form-urlencoded' ,
					'Referer'			: 'https://www.heroeswm.ru/art_transfer.php?id='+artId ,
				},
				data: 'id='+artId+'&nick='+urlencode(recieverNick)+'&gold='+price+'&wood=0&ore=0&mercury=0&sulphur=0&crystal=0&gem=0&sendtype=2&dtime='+dayTime+'&bcount='+battles+'&art_id=&sign='+sign ,
				onload:function(res)
				{
					if (callbackFunc && typeof callbackFunc == 'function') callbackFunc(res);
				}
			});
}

function urlencode (str) {
    var trans=[],snart=[],ret=[];
    for(var i=0x410;i<=0x44F;i++){trans[i]=i-0x350;snart[i-0x350] = i;}
    trans[0x401]= 0xA8;trans[0x451]= 0xB8;snart[0xA8] = 0x401;snart[0xB8] = 0x451;
    for(var i=0;i<str.length;i++){
        var n=str.charCodeAt(i);
        if(typeof trans[n]!='undefined') n = trans[n];
        if (n <= 0xFF) ret.push(n);
    }
    return escape(String.fromCharCode.apply(null,ret));
}

function requestPage (url, onloadHandler){
    console.log('loading: ', url);
    try{
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: url,
            method: "GET",
            onload: function(response){
                onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
            },
            onerror: function(){ setTimeout( function() { requestPage (url, onloadHandler) }, 500 ) },
            ontimeout: function(){ requestPage (url, onloadHandler) },
            timeout: 5000
        });
    } catch (e) {
        console.log(e);
    }
}