// ==UserScript==
// @name         WME TTS test
// @description  Play TTS
// @version      0.11
// @author       Vinkoy
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/editor/*
// @include      https://editor-beta.waze.com/*/editor/*
// @namespace    https://greasyfork.org/en/scripts/23202-wme-tts-test
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23202/WME%20TTS%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/23202/WME%20TTS%20test.meta.js
// ==/UserScript==

(function() {
    var minutes_value = 20;
    var round_exit_value = 1;

function TTStest_bootstrap()
{
	var oWaze=Window.W;
	var oI18n=Window.I18n;

	if (typeof unsafeWindow !== "undefined")
	{
		oWaze=unsafeWindow.W;
		oI18n=unsafeWindow.I18n;
	}

	if (typeof oWaze === "undefined")
	{
		setTimeout(TTStest_bootstrap, 500);
		return;
	}
	if (typeof oWaze.map === "undefined")
	{
		setTimeout(TTStest_bootstrap, 500);
		return;
	}
	if (typeof oWaze.selectionManager === "undefined")
	{
		setTimeout(TTStest_bootstrap, 500);
		return;
	}
	if (typeof oI18n === "undefined")
	{
		setTimeout(TTStest_bootstrap, 500);
		return;
	}
	if (typeof oI18n.translations === "undefined")
	{
		setTimeout(TTStest_bootstrap, 500);
		return;
	}

    oWaze.selectionManager.events.register("selectionchanged", null, addBtns);
	setTimeout(TTStest_initBindKey, 500);
}

function addBtns()
{
    if(!document.getElementById("WME-test-tts") && W.selectionManager.getSelectedFeatures().length > 0 && W.selectionManager.getSelectedFeatures()[0].model.type === 'segment')
	{
		var btnSection = document.createElement('div');
		btnSection.id = "WME-test-tts";
		var userTabs = document.getElementById('edit-panel');
		if (!(userTabs && getElementsByClassName('nav-tabs', userTabs)))
			return;

		var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
		if (typeof navTabs !== "undefined")
		{
			if (!getElementsByClassName('tab-content', userTabs))
				return;

			var tabContent = getElementsByClassName('tab-content', userTabs)[0];

			if (typeof tabContent !== "undefined")
			{
				newtab = document.createElement('li');
				newtab.innerHTML = '<a href="#WME-test-tts" id="wmettstest" data-toggle="tab">TTS <i class="fa fa-lock" id="wmetts_lock"></i></a>';
				navTabs.appendChild(newtab);

                var class_style_turn = 'class="btn btn-default" style="font-size:18px; width:40px; padding:0px; background-color: #4CC600; cursor: pointer;" ';
                var class_style_keep = 'class="btn btn-default" style="font-size:18px; width:40px; padding:0px; background-color: #CBFF84; cursor: pointer;" ';
                var class_style_exit = 'class="btn btn-default" style="font-size:18px; width:40px; padding:0px; background-color: #6CB5FF; cursor: pointer;" ';
                var class_style_roundabout = 'class="btn btn-default" style="font-size:24px; width:40px; padding:0px; cursor: pointer;" ';

                var street = W.model.streets.get(W.selectionManager.getSelectedFeatures()[0].model.attributes.primaryStreetID);
                var streetName = 'Безымянный сегмент';
                if (typeof street !== "undefined" && street !== null)
                {
                    if (street.name !== null)
                    {
                        streetName = street.name;
                    }
                }

				btnSection.innerHTML = '<div class="form-group">'+
                    '<h4>TTS Test <sup>' + GM_info.script.version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/en/scripts/23202-wme-tts-test" title="Link" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>' +
					'<div class="controls-container">' +
                    '</br>' +
                    '<button id="wmettsStreet" class="btn btn-default" title="'+streetName+'"><i class="fa fa-volume-up" style="font-size:16px;"></i>&nbsp;&nbsp;'+streetName+'</button>&nbsp;' +
                    '</br></br>' +
                    '<button id="wmettsContinue" class="btn btn-default" title="Продолжайте движение около '+minutes_value+' минут"><i class="fa fa-volume-up" style="font-size:16px;"></i>&nbsp;&nbsp;Продолжайте движение около</button>&nbsp;' +
                    '</br>' +
                    '<input type="number" id="minutes" value="'+minutes_value+'" style="width: 60px; margin-top: 5px;"/>&nbsp; минут' +
                    '</br>' +
                    '<button id="wmettsContStraight" class="btn btn-default" title="Продолжайте движение прямо на "><i class="fa fa-volume-up" style="font-size:16px;"></i>&nbsp;&nbsp;Продолжайте движение прямо на <i>'+streetName+'</i></button>&nbsp;' +
                    '</br>' +
                    '<button id="wmettsUturn" class="btn btn-default" title="Развернитесь на '+streetName+'"><i class="fa fa-volume-up" style="font-size:16px;"></i>&nbsp;&nbsp; Развернитесь на <i>'+streetName+'</i></button>&nbsp;' +
                    '</br>' +
                    '<button id="wmettsGoing" class="btn btn-default" title="поедем по '+streetName+'"><i class="fa fa-volume-up" style="font-size:16px;"></i>&nbsp;&nbsp; Поедем по <i>'+streetName+'</i></button>&nbsp;' +
                    '</br></br>' +
                    '<label class="control-label">Поверните...</label>' +
					'<button id="wmettsTL" '+class_style_turn+' title="Поверните налево">←</button>&nbsp;' +
                    '<button id="wmettsTR" '+class_style_turn+' title="Поверните направо">→</button>&nbsp;' +
                    '</br></br>' +
                    '<label class="control-label">Держитесь...</label>' +
                    '<button id="wmettsKL" '+class_style_keep+' title="Держитесь левее">↖</button>&nbsp;' +
                    '<button id="wmettsKR" '+class_style_keep+' title="Держитесь правее">↗</button>&nbsp;' +
                    '</br></br>' +
                    '<label class="control-label">Съезд...</label>' +
                    '<button id="wmettsEL" '+class_style_exit+' title="Съезд слева">↖</button>&nbsp;' +
                    '<button id="wmettsER" '+class_style_exit+' title="Съезд справа">↗</button>&nbsp;' +
                    '</br></br>' +
                    '<label class="control-label">Съезд на кольце...</label>' +
                    '<button id="wmettsRND" '+class_style_roundabout+' title="На кольце '+round_exit_value+' съезд">☼</button>&nbsp;' +
                    '<input type="number" id="round_exit" value="'+round_exit_value+'" min="1" max="7" style="width: 60px; margin-top: 5px;"/>&nbsp; съезд' +
					'</div></div>';

				btnSection.className = "tab-pane";
				tabContent.appendChild(btnSection);
			}
			else
				btnSection.id='';
        }
        else
			btnSection.id='';

        if(btnSection.id !== '')
        {
            document.getElementById('wmettsStreet').onclick = playTTS;
            document.getElementById('wmettsContinue').onclick = playTTS;
            document.getElementById('wmettsContStraight').onclick = playTTS;
            document.getElementById('wmettsTL').onclick = playTTS;
            document.getElementById('wmettsTR').onclick = playTTS;
            document.getElementById('wmettsKL').onclick = playTTS;
            document.getElementById('wmettsKR').onclick = playTTS;
            document.getElementById('wmettsEL').onclick = playTTS;
            document.getElementById('wmettsER').onclick = playTTS;
            document.getElementById('wmettsRND').onclick = playTTS;
            document.getElementById('wmettsUturn').onclick = playTTS;
            document.getElementById('wmettsGoing').onclick = playTTS;
            document.getElementById('minutes').onchange = function(){
                minutes_value = document.getElementById('minutes').value;
                };
            document.getElementById('round_exit').onchange = function(){
                round_exit_value = document.getElementById('round_exit').value;
                };
        }
    }
    else if ( !document.getElementById("WME-test-tts") && W.selectionManager.getSelectedFeatures().length > 0 && W.selectionManager.getSelectedFeatures()[0].model.type == "venue" )
    {
		var btnSection = document.createElement('div');
		btnSection.id = "WME-test-tts";
		var userTabs = document.getElementById('edit-panel');
		if (!(userTabs && getElementsByClassName('nav-tabs', userTabs)))
			return;

		var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
		if (typeof navTabs !== "undefined")
		{
			if (!getElementsByClassName('tab-content', userTabs))
				return;

			var tabContent = getElementsByClassName('tab-content', userTabs)[0];

			if (typeof tabContent !== "undefined")
			{
				newtab = document.createElement('li');
				newtab.innerHTML = '<a href="#WME-test-tts" id="wmettstest" data-toggle="tab">TTS <i class="fa fa-lock" id="wmetts_lock"></i></a>';
				navTabs.appendChild(newtab);

                var venue = W.selectionManager.getSelectedFeatures()[0].model.attributes.name;
                var poiName = 'ПОИ БЕЗ ИМЕНИ';
                if (W.selectionManager.getSelectedFeatures()[0].model.attributes.name !== "")
                {
                    poiName = W.selectionManager.getSelectedFeatures()[0].model.attributes.name;
                }


				btnSection.innerHTML = '<div class="form-group">'+
                    '<h4>TTS Test <sup>' + GM_info.script.version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/en/scripts/23202-wme-tts-test" title="Link" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>' +
					'<div class="controls-container">' +
                    '</br>' +
                    '<button id="wmettsStreet" class="btn btn-default" title="'+poiName+'"><i class="fa fa-volume-up" style="font-size:16px;"></i>&nbsp;&nbsp;'+poiName+'</button>&nbsp;' +
                    '</br></br>' +
					'</div></div>';

				btnSection.className = "tab-pane";
				tabContent.appendChild(btnSection);
			}
			else
				btnSection.id='';
        }
        else
			btnSection.id='';

        if(btnSection.id !== '')
        {
            if(document.getElementById('wmettsStreet')) document.getElementById('wmettsStreet').onclick = playTTS;
            if(document.getElementById('wmettsContinue')) document.getElementById('wmettsContinue').onclick = playTTS;
            if(document.getElementById('wmettsContStraight')) document.getElementById('wmettsContStraight').onclick = playTTS;
            if(document.getElementById('wmettsTL')) document.getElementById('wmettsTL').onclick = playTTS;
            if(document.getElementById('wmettsTR')) document.getElementById('wmettsTR').onclick = playTTS;
            if(document.getElementById('wmettsKL')) document.getElementById('wmettsKL').onclick = playTTS;
            if(document.getElementById('wmettsKR')) document.getElementById('wmettsKR').onclick = playTTS;
            if(document.getElementById('wmettsEL')) document.getElementById('wmettsEL').onclick = playTTS;
            if(document.getElementById('wmettsER')) document.getElementById('wmettsER').onclick = playTTS;
            if(document.getElementById('wmettsUturn')) document.getElementById('wmettsUturn').onclick = playTTS;
            if(document.getElementById('wmettsGoing')) document.getElementById('wmettsGoing').onclick = playTTS;
            if(document.getElementById('wmettsRND')) document.getElementById('wmettsRND').onclick = playTTS;
        }
    }

    if(document.getElementById("WME-test-tts"))
    {
        if (W.selectionManager.getSelectedFeatures().length > 0)
        {
            var disabledButton=false;
            var model=W.selectionManager.getSelectedFeatures()[0].model;

            if ((model.type !== 'segment' || !(model.getAddress().attributes.hasOwnProperty('street') && model.getAddress().attributes.street !== null && model.getAddress().attributes.street.name !== null)) && (model.type !== 'venue' || model.attributes.name === ""))
                disabledButton=true;

            var lock=document.getElementById('wmetts_lock');
            if (lock)
            {

                if (disabledButton)
                {
                    lock.setAttribute('style','color:red;');
                    lock.setAttribute('class', "fa fa-lock");
                }
                else
                {
                    lock.setAttribute('style','color:green;');
                    lock.setAttribute('class', "fa fa-unlock");
                }
            }

            if(document.getElementById('wmettsStreet')) document.getElementById('wmettsStreet').disabled = disabledButton;
            if(document.getElementById('wmettsContinue')) document.getElementById('wmettsContinue').disabled = disabledButton;
            if(document.getElementById('wmettsContStraight')) document.getElementById('wmettsContStraight').disabled = disabledButton;
            if(document.getElementById('wmettsTL')) document.getElementById('wmettsTL').disabled = disabledButton;
            if(document.getElementById('wmettsTR')) document.getElementById('wmettsTR').disabled = disabledButton;
            if(document.getElementById('wmettsKL')) document.getElementById('wmettsKL').disabled = disabledButton;
            if(document.getElementById('wmettsKR')) document.getElementById('wmettsKR').disabled = disabledButton;
            if(document.getElementById('wmettsEL')) document.getElementById('wmettsEL').disabled = disabledButton;
            if(document.getElementById('wmettsER')) document.getElementById('wmettsER').disabled = disabledButton;
            if(document.getElementById('wmettsUturn')) document.getElementById('wmettsUturn').disabled = disabledButton;
            if(document.getElementById('wmettsGoing')) document.getElementById('wmettsGoing').disabled = disabledButton;
            if(document.getElementById('wmettsRND')) document.getElementById('wmettsRND').disabled = disabledButton;
        }
    }
}

function playTTS()
{
    var ttsName = '';
    if (W.selectionManager.getSelectedFeatures()[0].model.type === 'segment' )
    {
        if (W.selectionManager.getSelectedFeatures().length != 1)
        {
            alert('Выберите только один сегмент');
            return;
        }

        var street = W.model.streets.get(W.selectionManager.getSelectedFeatures()[0].model.attributes.primaryStreetID);
        if (typeof street !== "undefined")
        {
            if (street.name === null)
            {
                alert('Безымянный сегмент');
                return;
            }
            else
            {
                ttsName = street.name;
            }
        }
        else
        {
            console.log('WME_TTS undefined street');
            return;
        }
    }
    else if (W.selectionManager.getSelectedFeatures()[0].model.type === 'venue')
    {
        ttsName = W.selectionManager.getSelectedFeatures()[0].model.attributes.name;
    }

    var preText = '';
    switch (this.id)
    {
    case 'wmettsStreet':
        preText = ' ';
        break;
    case 'wmettsContinue':
        preText = 'продолжайте движение около ';
        var minutes;
        if (document.getElementById('minutes') !== null )
            minutes = minutes_value + ' мин. до ';
        else
            minutes = '20 мин. до ';
        ttsName = minutes + ttsName;
        break;
    case 'wmettsContStraight':
        preText = 'продолжайте движение прямо на ';
        break;
    case 'wmettsTL':
        preText = 'поверните налево на ';
        break;
    case 'wmettsTR':
        preText = 'поверните направо на ';
        break;
    case 'wmettsKL':
        preText = 'держитесь левее на ';
        break;
    case 'wmettsKR':
        preText = 'держитесь правее на ';
        break;
    case 'wmettsEL':
        preText = 'съезд слева на ';
        break;
    case 'wmettsER':
        preText = 'съезд справа на ';
        break;
    case 'wmettsUturn':
        preText = 'развернитесь на ';
        break;
    case 'wmettsGoing':
        preText = 'Поедем по ';
        break;
    case 'wmettsRND':
        var round_exit_text;
        switch (round_exit_value)
        {
        case '1':
            round_exit_text = 'первый';
            break;
        case '2':
            round_exit_text = 'второй';
            break;
        case '3':
            round_exit_text = 'третий';
            break;
        case '4':
            round_exit_text = 'четвёртый';
            break;
        case '5':
            round_exit_text = 'пятый';
            break;
        case '6':
            round_exit_text = 'шестой';
            break;
        case '7':
            round_exit_text = 'седьмой';
            break;
        default:
            round_exit_text = 'первый';
        }
        preText = 'на кольце '+round_exit_text+' съезд на ';
        break;
    default:
        alert("Unknown error");
    }

    if (preText !== '')
    {
    new Audio('https://ttsgw.world.waze.com/TTSGateway/Text2SpeechServlet?text='+preText+ttsName+'&lang=ru-RU&lon=0&lat=0&version=6&protocol=2&sessionid=12345654321&content_type=audio%2Fmpeg&type=street&validate_data=positive&skipCache=true').play();
    }
}

function getElementsByClassName(classname, node) {
	if(!node)
		node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}


TTStest_bootstrap();



// ------------------------------
function playTTSHand()
{
	if ((typeof arguments[0]) === "object")
	{
		switch(arguments[0].type)
		{
			case 'click': // click button
			{
				var e=document.getElementById(arguments[0].id);
				if(e)
					e.click();

				break;
			}
		}
	}
}

function TTStest_initBindKey()
{
	var Config =[
        {handler: 'wmettsStreet',   title: 'Имя сегмента/ПОИ',           func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsStreet'}},
        {handler: 'wmettsContinue', title: 'Продолжайте движение', func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsContinue'}},
        {handler: 'wmettsContStraight', title: 'Продолжайте движение', func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsContStraight'}},
		{handler: 'wmettsTL',       title: 'Поверните налево на',        func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsTL'}},
		{handler: 'wmettsTR',       title: 'Поверните направо на',       func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsTR'}},
		{handler: 'wmettsKL',       title: 'Держитесь левее на',         func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsKL'}},
		{handler: 'wmettsKR',       title: 'Держитесь правее на',        func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsKR'}},
		{handler: 'wmettsEL',       title: 'Съезд слева на',             func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsEL'}},
		{handler: 'wmettsER',       title: 'Съезд справа на',            func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsER'}},
		{handler: 'wmettsUturn',    title: 'Развернитесь на',            func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsUturn'}},
		{handler: 'wmettsGoing',    title: 'Поедем по',            func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsGoing'}},
		{handler: 'wmettsRND',      title: 'На кольце первый съезд на',  func:playTTSHand, key:-1, arg:{type:'click',id:'wmettsRND'}},
	];

	for(var i=0; i < Config.length; ++i)
	{
		WMEKSRegisterKeyboardShortcut('WME TTS test', 'WME TTS test', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
	}

    WMEKSLoadKeyboardShortcuts('WME TTS test');

	window.addEventListener("beforeunload", function() {
		WMEKSSaveKeyboardShortcuts('WME TTS test');
	}, false);
}

// from: https://greasyfork.org/ru/scripts/16071-wme-keyboard-shortcuts (modify)
/*
when adding shortcuts each shortcut will need a uniuque name
the command to add links is WMERegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
	ScriptName: This is the name of your script used to track all of your shortcuts on load and save.
	ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
	ShortcutsHeader: this is the header that will show up in the keyboard editor
	NewShortcut: This is the name of the shortcut and needs to be uniuque from all of the other shortcuts, from other scripts, and WME
	ShortcutDescription: This wil show up as the text next to your shortcut
	FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
	ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
	ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
*/
function WMEKSRegisterKeyboardShortcut(e,r,t,a,o,s,c){try{I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members.length}catch(n){W.accelerators.Groups[e]=[],W.accelerators.Groups[e].members=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[e]=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].description=r,I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members=[]}if(o&&"function"==typeof o){I18n.translations[I18n.locale].keyboard_shortcuts.groups[e].members[t]=a,W.accelerators.addAction(t,{group:e});var l="-1",i={};i[l]=t,W.accelerators._registerShortcuts(i),null!==s&&(i={},i[s]=t,W.accelerators._registerShortcuts(i)),W.accelerators.events.register(t,null,function(){o(c)})}else alert("The function "+o+" has not been declared")}function WMEKSLoadKeyboardShortcuts(e){if(localStorage[e+"KBS"])for(var r=JSON.parse(localStorage[e+"KBS"]),t=0;t<r.length;t++)W.accelerators._registerShortcuts(r[t])}function WMEKSSaveKeyboardShortcuts(e){var r=[];for(var t in W.accelerators.Actions){var a="";if(W.accelerators.Actions[t].group==e){W.accelerators.Actions[t].shortcut?(W.accelerators.Actions[t].shortcut.altKey===!0&&(a+="A"),W.accelerators.Actions[t].shortcut.shiftKey===!0&&(a+="S"),W.accelerators.Actions[t].shortcut.ctrlKey===!0&&(a+="C"),""!==a&&(a+="+"),W.accelerators.Actions[t].shortcut.keyCode&&(a+=W.accelerators.Actions[t].shortcut.keyCode)):a="-1";var o={};o[a]=W.accelerators.Actions[t].id,r[r.length]=o}}localStorage[e+"KBS"]=JSON.stringify(r)}
/* ********************************************************** */

})();