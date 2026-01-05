// ==UserScript==
// @name        HWM_Transactions_823
// @include     http://www.heroeswm.ru/object-info.php*
// @include     http://178.248.235.15/object-info.php*
// @include     http://qrator.heroeswm.ru/object-info.php*
// @description HWM_Transactions
// @namespace   test-count
// @version     2.4
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/29694/HWM_Transactions_823.user.js
// @updateURL https://update.greasyfork.org/scripts/29694/HWM_Transactions_823.meta.js
// ==/UserScript==

// Refactored, fixed and upgraded 'ClanCompanyNew 2.4' script by Рианти
try{
    var _clansSupported = [997, 823, 2336];
    //var _qURL = 'http://hwm.mcdir.ru/transactions/823/';
    var _qURL = 'http://hwm.mcdir.ru';
    var _submit = 0, _status = 0, _timeout;
    var _picQuestion = 'source/questionMark.jpg', _question = 'Учесть сделку';
    var _picAllow = 'source/vMark.jpg', _allow = 'Сделка будет учтена, покупайте!';
    var _picDeny = 'source/xMark.jpg', _deny = 'Ошибка, сделка не будет учтена!\r\n';
    var _picWait = 'source/ajax-loader.gif', _wait = 'Соединяемся с сервером, подождите...';

    var curClan = $('a[href^="clan_info"]');
    curClan = curClan ? parseInt(curClan.href.match(/id=(\d+)/)[1]) : -1;
    if(_clansSupported.indexOf(curClan) > -1){
        var pendScreenWrapper = document.createElement('div');
        document.body.appendChild(pendScreenWrapper);
        addStyle();
        var statusControl = document.createElement('img');
        $('td.wb > div').appendChild(statusControl);
        setTimeout("clearTimeout(Timer)", 0);
        mainPart1();
    }
} catch (e) {
    if(getStance() != "null") performStage2();
    console.log(e);
}



function mainPart1(){
    if(!getStance()) setStance("null");
    if(getStance() != "null") performStage2();
    else mainPart2();
}

function mainPart2(){
    setStance("null");
    addLinkControl();
    statusControlAction(performStage1, _picQuestion, _question, 'pointer');
    catchSubmit();
}

function addLinkControl(){
    var linkWrapper = document.createElement('div');
    linkWrapper.innerHTML = '<center><a href="' + _qURL + '" target=_blank title="Статистика продаж">Статистика</a></center>';
    document.getElementsByName('count')[0].parentNode.appendChild(linkWrapper);
    $('tr.wblight > td.wb').style['vertical-align'] = 'middle';
}

function statusControlAction(handler, picture, title, cursor){
    statusControl.onclick = handler;
    statusControl.src = _qURL + picture;
    statusControl.title = title;
    statusControl.ondragstart = function(){return false;};
    statusControl.style.position = 'relative';
    statusControl.style.top = '-1px';
    statusControl.style.width = '25px';
    statusControl.style.height = '20px';
    statusControl.style.cursor = cursor;
    statusControl.focus();
}

function catchSubmit(){
    var buyForm = $('object[data="swffiles/buycode.swf?ver=5"]');
    buyForm.onmouseup = possibleSubmit;
    buyForm.onkeypress = possibleSubmit;
    window.onbeforeunload = function (){
        if(_submit){
            return warning();
        }
    };
    function possibleSubmit(){
        _submit = 1;
        setTimeout(function(){_submit = 0;}, 100);
    }
}

function warning(){
    if(_status) return null;
    setTimeout(reloadBuyForm, 0);
    return "Если продолжите, Ваша сделка не будет учтена!";
}

function performStage1(){
    statusControlAction(function(){}, _picWait, _wait, 'default');
    var fv = document.getElementsByName('FlashVars');
    var params = fv[fv.length - 1].value.split('|');
    GM_xmlhttpRequest({
        method: "GET",
        url: _qURL + "StartBuy.php?id=" + params[5] + "&pl=" + params[7],
        synchronous: false,
        onload: stage1End,
        timeout: 10 * 1000,
        ontimeout: showError,
        onerror: showError
    });
}

function stage1End(details){
    var temp = new DOMParser().parseFromString(details.responseText, 'text/html');
    if (temp.getElementById('iapprove').innerHTML == '1') {
        setStance(_qURL + 'AppBuy.php?id=' + temp.getElementById('icode').innerHTML + '&sh=' + temp.getElementById('ihash').innerHTML);
        _status = 1;
        statusControlAction(function(){}, _picAllow, _allow, 'default');
        setTimeout(function(){
            _status = 0;
            setStance();
            statusControlAction(performStage1, _picQuestion, _question, 'pointer');
            tooLate();
        }, 10 * 1000);
    }
    else{
        showError(null, temp.getElementById('imessage').innerHTML);
    }
    return null;
}

function showError(e, text){
    if(e != null) text = 'Ошибка при попытке подключиться к серверу. Проверьте соединение с интернетом.';
    setStance();
    statusControlAction(function(){statusControlAction(performStage1, _picQuestion, _question, 'pointer'); clearTimeout(_timeout)}, _picDeny, _deny + text, 'pointer');
    _timeout = setTimeout(function(){statusControlAction(performStage1, _picQuestion, _question, 'pointer')}, 5 * 1000);
}

function performStage2(){
    showPendScreen('<b>Сделка совершена! Связываемся с сервером статистики!</b><br><br><img src="' + _qURL + 'source/ajax-loader.gif">');

    GM_xmlhttpRequest({
        method: "GET",
        url: getStance(),
        synchronous: false,
        onload: function(){
            hidePendScreen();
            mainPart2();
        },
        onerror: function(){
            showPendScreen('<b>Не удалось связаться с сервером. Проверьте соединение с интернетом.</b>');
            setTimeout(function(){
                hidePendScreen();
                mainPart2();
            }, 5 * 1000);
        }
    });

    window.onbeforeunload = function(){
        return "Если вы сейчас покинете страницу, Ваша сделка не будет учтена!";
    };
}

function reloadBuyForm(){ // Have to reload, since flash buy form is unable to accept submit twice during its lifetime
    var buyForm = $('object[data="swffiles/buycode.swf?ver=5"]');
    var clone = buyForm.cloneNode(true);
    buyForm.parentNode.replaceChild(clone, buyForm);
    catchSubmit();
}

function tooLate(){
    showPendScreen('<b>В следующий раз - обязательно получится!.. :)</b>');
    setTimeout(function(){
        hidePendScreen();
    }, 2 * 1000);
}

function setStance(s){
    s ? localStorage['urlRes'] = s : delete localStorage['urlRes'];
}

function getStance(){
    return localStorage['urlRes'] ? localStorage['urlRes'] : null;
}

function showPendScreen(html){
    pendScreenWrapper.id = 'PSW';
    pendScreenWrapper.innerHTML = html;
}

function hidePendScreen(){
    pendScreenWrapper.style.display = 'none';
}

function addStyle(){
    var style = document.createElement('style');
    style.innerHTML = '#PSW{position: absolute; z-index: 999; top: 0px; left: 0px; width: 105%; height: 105%; opacity: 0.75; background-color: white; text-align: center; padding-top: 20%; filter: alpha(opacity=75);}';
    document.head.appendChild(style);
}

function $(s){
    return document.querySelector(s);
}