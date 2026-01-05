
// ==UserScript==
// @name 			Jira and Omnitracker Multifunctional Script
// @include			*jira*
// @include			*omnitracker.homecredit.net*
// @grant 			none
// @icon			https://jira.homecredit.kz/favicon.ico
// @author			Sergey Dudkin
// @run-at			document-end
// @version			1.0.7.0
// @description		Скрипт, автоматически подставляющий предложения при ответе на заявки.
// @namespace 		https://greasyfork.org/users/4638
// @downloadURL https://update.greasyfork.org/scripts/21226/Jira%20and%20Omnitracker%20Multifunctional%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/21226/Jira%20and%20Omnitracker%20Multifunctional%20Script.meta.js
// ==/UserScript==


var locationString = location.toString();
var doOnce = 0;


function createEl(elementName, id /*optional*/, attrArr /*optional*/, parentEl /*optional*/) {
	
	var el = document.createElement(elementName);
	if (id) {el.id = id;}
	if (attrArr) {
		for (var attr in attrArr) {
			el.setAttribute(attr, attrArr[attr]);
		}
	}
	if (parentEl) {
		parentEl.appendChild(el);
	}
	return el;
}

function createText(txt) {  
	
	return document.createTextNode(txt);
}

function appendCSS(obj) {
	
	var cssString = "",
	propString = "",
	eachSelector = "",
	style = createEl("style");
	for(var selector in CSS) {
		eachSelector = CSS[selector];
		propString = "";
		for(var property in eachSelector) {
			propString += property + ":" + eachSelector[property] + ";";
		}
		cssString += selector + "{" + propString + "}";
	}
	style.appendChild(createText(cssString));
	document.head.appendChild(style);
}

function setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);

    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}





function launchTimer(myTime) {

	timer.appendChild(document.createTextNode(myTime));
	timerCheckbox = createEl("input", "timerCheckbox", {type:"checkbox", checked:"checked"}, document.body);
	
	//Timer work
	setInterval(function() { 
		if (document.getElementById("timer").innerHTML > 0 && timerCheckbox.checked && document.getElementById("comment") != document.activeElement) { 
			document.getElementById("timer").innerHTML = (document.getElementById("timer").innerHTML - 1) 
		}
		else {
			if (document.getElementById("timer").innerHTML == 0 && doOnce == 0) {		
				doOnce = 1;
				location.reload();
			}
		}
	}, 1000);
}


var CSS = {
	'#timer' : {
		'font-family' : 'Arial',
		'font-size' : '15px',
		'font-weight' : 'bold',
		'color' : 'gray',
		'position' : 'fixed',
		'bottom' : '20px',
		'left' : '20px'
	},
	
	'#timerCheckbox' : {
		'position' : 'fixed',
		'bottom' : '20px',
		'left' : '3px'
	}
};

var timer = createEl("p", "timer", {}, document.body);
var timerCheckbox; 
appendCSS(CSS);



if (locationString.search("filter=15301") >= 0) {

	launchTimer(55);
}

if (locationString.search("Dashboard.jspa") >= 0) {	
  	 
	launchTimer(40);
}

if (locationString.search("omnitracker.homecredit.net") >= 0) {	
  	 
	launchTimer(140);
    
    setInterval(function() { 
		eventFire(document.getElementsByClassName('scgcell2')[0], 'click');
        eventFire(document.getElementsByClassName('scgcell2exp')[0], 'click');    
	}, 70000);
}



var x = 0;

setInterval(function() { 

	if (document.getElementById("comment") != document.activeElement) {
      
		x = 0;
	}

	if (document.getElementById("comment") == document.activeElement && document.getElementById("comment").value == "" && x == 0) {

		if (document.getElementsByClassName("dialog-title")[0].innerText.search("Принять в работу") >= 0 ) {

			document.getElementById("comment").value = "Ваша заявка принята в работу.";	
		}
		else if (document.getElementsByClassName("dialog-title")[0].innerText.search("Вернуть на группу ОСПО") >= 0 ) {
			
			document.getElementById("comment").value = "\r\nВаша заявка возвращается на группу ОСПО. Коллеги, прошу принять заявку в работу.";
          	setCaretPosition("comment", 0);
		}
     	else if (document.getElementsByClassName("dialog-title")[0].innerText.search("Вернуть в работу ОСПО") >= 0 ) {
			
			document.getElementById("comment").value = "Ваша заявка возвращается на группу ОСПО.";
		}
		else if (document.getElementsByClassName("dialog-title")[0].innerText.search("Сторонняя Компания") >= 0 ) {

            document.getElementById("comment").value = 
              "Ваш запрос обрабатывается в заявке " + document.getElementById("customfield_10302").value + 
              " с приоритетом '" + getSelectedText("customfield_16200") + "'" +
              " на стороне " + getSelectedText("customfield_10801") + ".";

            setCaretPosition("comment", 13);
		}
      	else if (document.getElementsByClassName("dialog-title")[0].innerText.search("Подтверждение у пользователя о выполнении заявки") >= 0 ) {
			
			document.getElementById("comment").value = "\r\n\r\nПрошу Вас проверить и подтвердить выполнение заявки. Вы также можете закрыть заявку самостоятельно, используя опцию в меню справа 'Закрыть заявку'.";
          	setCaretPosition("comment", 0);
		}
      	else if (document.getElementsByClassName("dialog-title")[0].innerText.search("Закрыть заявку") >= 0 ) {
			
			document.getElementById("comment").value = "Ваша заявка исполнена. Если у Вас возникнет проблема, просим создать новую заявку в Jira Service Desk. В будущем, вы также можете закрывать заявку самостоятельно, используя опцию в меню справа 'Закрыть заявку'. Закрыто.";
          	setCaretPosition("comment", 0);
		}

		x = 1;
	}

}, 500);