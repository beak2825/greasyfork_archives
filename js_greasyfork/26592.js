// ==UserScript==
// @name         Wave Account Managers
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/3.1.62/jquery.inputmask.bundle.js
// @author       You
// @match        https://next.waveapps.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26592/Wave%20Account%20Managers.user.js
// @updateURL https://update.greasyfork.org/scripts/26592/Wave%20Account%20Managers.meta.js
// ==/UserScript==

GM_addStyle('.headerbtn {background-color: white; color: gray; border: none; width: 25px; height: 25px; font-size: 1.5em} .headerbtn:hover {cursor: pointer; color: black;} \
			 .active {background: #a8d4cf !important;}');

var d = document;
var b = d.body;

var cover = d.createElement('div');
var update = 0;
b.appendChild(cover);
cover.style.cssText = 'display: none; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); position: fixed; top: 0px; left: 0px; z-index: 1000;';
cover.addEventListener('click', function() {
	if (update === 0) {
		update = 1;
		setTimeout(function() {
			update = 0;
		}, 2000);
	}
	else {
		update++;
	}
	
	if (update > 4) {
		window.location = 'https://greasyfork.org/scripts/26592-wave-account-managers/code/Wave%20Account%20Managers.user.js';
	}
});

var maindiv = d.createElement('div');
cover.appendChild(maindiv);

var span = d.createElement('span');
span.style.cssText = 'height: 20px; width: 95%; padding-top: 5px; display: block; margin: 0 auto;';

var backbtn = d.createElement('button');
backbtn.addEventListener('click', showReps);
backbtn.className = 'headerbtn';
backbtn.style.float = 'left';
backbtn.innerHTML = '&larr;';

var closebtn = d.createElement('button');
closebtn.className = 'headerbtn';
closebtn.style.float = 'right';
closebtn.innerHTML = '&#10006;';
closebtn.addEventListener('click', close);

var title = d.createElement('h2');
title.style.cssText = 'color: black; width: 100%;';

var select = d.createElement('select');
select.style.width = '90%';

var editrepsbtn = d.createElement('button');
editrepsbtn.className = 'headerbtn';
editrepsbtn.innerHTML = '&#9998;';
editrepsbtn.addEventListener('click', editReps);

var submitbtn = d.createElement('button');
submitbtn.style.cssText = 'margin-top: 5px;';
submitbtn.innerHTML = 'Submit';
submitbtn.addEventListener('click', submit);

var ul = d.createElement('ul');
ul.style.cssText = 'list-style: none; height: 150px; overflow-y: scroll; display: block;';

var nameinput = d.createElement('input');
nameinput.disabled = true;
nameinput.style.cssText = 'width: 63%; border-radius: 2px; border: solid 1px black; margin: 0 0 10px 0; height: 40px; font-size: 1.5em; text-align: center;';

var phoneinput = d.createElement('input');
phoneinput.setAttribute('id', 'phoneinput');
phoneinput.disabled = true;
phoneinput.style.cssText = 'width: 32%; border-radius: 2px; border: solid 1px black; margin-left: 5px; height: 40px; font-size: 1.5em; text-align: center;';

var addbtn = d.createElement('button');
addbtn.style.cssText = 'width: 98%; margin-bottom: 10px;';
addbtn.innerHTML = 'New Sales Rep';
addbtn.addEventListener('click', add);

var cancelbtn = d.createElement('button');
cancelbtn.style.cssText = 'width: 40%;';
cancelbtn.disabled = true;
cancelbtn.innerHTML = 'Cancel';
cancelbtn.addEventListener('click', cancel);

var savebtn = d.createElement('button');
savebtn.style.cssText = 'width: 40%;';
savebtn.disabled = true;
savebtn.innerHTML = 'Save';
savebtn.addEventListener('click', save);

var list = GM_getValue('list');

var running = 0;

(function() {
    'use strict';
    
    var main_loop = setInterval(mainLoop, 500);
    
})();

function mainLoop() {
    var loc = window.location.href;
    if (loc.indexOf('invoices/add') > -1) {
        if (running === 0) {
			cover.style.display = 'block';
            running = 1;
            showReps();
        }
    }
    else {
        if (running === 1) {
            running = 0;
        }
    }
}

function showReps() {
	var active = maindiv.getElementsByClassName('active')[0];
	if (active !== undefined) {
		active = active.innerHTML;
		resetContent();
	}
	else {
		var listheader = d.createElement('option');
		listheader.innerHTML = '--- Choose a sales rep ---';
		listheader.selected = true;
		listheader.hidden = true;
		listheader.disabled = true;
		listheader.value = null;
		resetContent();
		select.appendChild(listheader);
	}
	maindiv.style.cssText = 'width: 360px; transition: width .4s, height .05s; height: 150px; background: white; border-radius: 10px; margin: 300px auto; color: black; text-align: center;';
	title.innerHTML = 'Choose Sales Rep';
	maindiv.appendChild(span);
	span.appendChild(closebtn);
	maindiv.appendChild(title);
	maindiv.appendChild(select);

	for (var rep in list) {
		var option = d.createElement('option');
		option.innerHTML = rep + ' ' + list[rep];
		option.value = rep + ' ' + list[rep];
		select.appendChild(option);
		if (active === rep) {
			option.selected = true;
		}
	}

	maindiv.appendChild(editrepsbtn);
	maindiv.appendChild(submitbtn);
}

function editReps() {
	var selected = null;
	if (select.value !== 'null') {
		selected = select.value.split(' (')[0];
	}
	maindiv.style.cssText = 'width: 600px; transition: width .4s, height .05s; height: 400px; background: white; border-radius: 10px; margin: 300px auto; color: black; text-align: center;';
	resetContent();
	title.innerHTML = 'Edit Sales Reps';
	maindiv.appendChild(span);
	span.appendChild(backbtn);
	span.appendChild(closebtn);
	maindiv.appendChild(title);
	maindiv.appendChild(ul);

	for (var rep in list) {
		var li = d.createElement('li');
		var repbtn = d.createElement('button');
		repbtn.setAttribute('type', 'main');
		repbtn.style.cssText = 'width: 74%; background: white; height: 30px; border: none; padding: 2px 0;';
		repbtn.className = 'repbutton';
		repbtn.innerHTML = rep;
		repbtn.addEventListener('click', selectRep);
		repbtn.addEventListener('mouseover', btnhover);
		repbtn.addEventListener('mouseout', btnunhover);

		var editbtn = d.createElement('button');
		editbtn.style.cssText = 'border: none; width: 12%; height: 30px; background-color: white;';
		editbtn.innerHTML = '&#9998;';
		editbtn.setAttribute('rep', rep);
		editbtn.setAttribute('type', 'edit');
		editbtn.addEventListener('click', edit);
		editbtn.addEventListener('mouseover', btnhover);
		editbtn.addEventListener('mouseout', btnunhover);

		var delbtn = d.createElement('button');
		delbtn.style.cssText = 'border: none; width: 12%; height: 30px; color: red; background-color: white;';
		delbtn.innerHTML = '&#10006;';
		delbtn.setAttribute('rep', rep);
		delbtn.setAttribute('type', 'delete');
		delbtn.addEventListener('click', del);
		delbtn.addEventListener('mouseover', btnhover);
		delbtn.addEventListener('mouseout', btnunhover);

		if (selected === rep) {
			repbtn.className = 'active';
		}

		li.appendChild(repbtn);
		li.appendChild(editbtn);
		li.appendChild(delbtn);
		ul.appendChild(li);
	}
	maindiv.appendChild(addbtn);
	maindiv.appendChild(nameinput);
	maindiv.appendChild(phoneinput);
	maindiv.appendChild(cancelbtn);
	maindiv.appendChild(savebtn);

	$(window).load(function() {
	   var phones = [{ "mask": "(###) ###-####"}];
	    $('#phoneinput').inputmask({ 
	        mask: phones, 
	        greedy: false, 
	        definitions: { '#': { validator: "[0-9]", cardinality: 1}} });
	});

	var active = maindiv.getElementsByClassName('active')[0];
	if (active !== undefined) {
		active.nextSibling.click();
	}
}

function selectRep() {
	var rep = this.innerHTML;
	var btn = this.parentNode.parentNode.getElementsByClassName('active')[0];
	if (btn !== undefined) {
		btn.className = '';
	}
	this.className = 'active';
	nameinput.value = rep;
	phoneinput.value = list[rep];
}

function close() {
	cover.style.display = 'none';
}

function submit() {
	cover.style.display = 'none';
	setManager(select.value);
}

function add() {
	showcsbtns();
	clearInputs();
	unlockinputs();
	savebtn.setAttribute('rep', null);
}

function edit() {
	var rep = this.getAttribute('rep');
	var btn = this.parentNode.parentNode.getElementsByClassName('active')[0];
	if (btn !== undefined) {
		btn.className = '';
	}
	this.previousSibling.className = 'active';
	unlockinputs();
	showcsbtns();
	nameinput.value = rep;
	phoneinput.value = list[rep];
	cancelbtn.setAttribute('rep', rep);
	cancelbtn.setAttribute('phone', list[rep]);
}

function cancel() {
	showaddbtn();
	nameinput.value = cancelbtn.getAttribute('rep');
	phoneinput.value = cancelbtn.getAttribute('phone');
	lockinputs();
}

function save() {
	var rep = this.getAttribute('rep');
	if (rep !== null) {
		delete list[rep];
	}
	list[nameinput.value] = phoneinput.value;

	var keys = [];
	for (var k in list) {
		if (list.hasOwnProperty(k)) {
			keys.push(k);
		}
	}

	keys.sort();

	var len = keys.length;
	var sorted = {};

	for (var i = 0; i < len; i++) {
		k = keys[i];
		sorted[k] = list[k];
	}

	list = sorted;
	GM_setValue('list', list);
	lockinputs();
	showaddbtn();
	editReps();
}

function del() {
	var rep = this.getAttribute('rep');
	var check = confirm('Are you sure you want to delete ' + rep + '?');
	if (check) { 
		delete list[rep];
		GM_setValue('list', list);
		clearInputs();
		editReps();
	}
}

function btnhover() {
	var type = this.getAttribute('type');
	if (type === 'main') {
		this.style.backgroundColor = '#a8d4cf';
	}
	else { 
		if (type === 'edit') {
			this.style.backgroundColor = '#a8d4cf';
		}
		else if (type === 'delete') {
			this.style.backgroundColor = 'red';
			this.previousSibling.style.backgroundColor = '#cecece';
			this.style.color = 'white';
		}
		this.parentNode.firstChild.style.backgroundColor = '#cecece';
	}
}

function btnunhover() {
	var type = this.getAttribute('type');
	this.style.backgroundColor = 'white';
	this.style.color = 'black';

	if (type === 'delete' || type === 'edit') {
		this.parentNode.firstChild.style.backgroundColor = 'white';
		this.parentNode.parentNode.firstChild.firstChild.style.backgroundColor = 'white';
		if (type === 'delete') {
			this.style.color = 'red';
			this.previousSibling.style.backgroundColor = 'white';
		}
	}
}

function lockinputs() {
	nameinput.disabled = true;
	phoneinput.disabled = true;
}

function unlockinputs() {
	nameinput.disabled = false;
	phoneinput.disabled = false;
}

function showaddbtn() {
	addbtn.disabled = false;
	cancelbtn.disabled = true;
	savebtn.disabled = true;
}

function showcsbtns() {
	addbtn.disabled = true;
	cancelbtn.disabled = false;
	savebtn.disabled = false;
}

function clearInputs() {
	nameinput.value = '';
	phoneinput.value = '';
}

function resetContent() {
	maindiv.innerHTML = '';
	span.innerHTML = '';
	select.innerHTML = '';
	ul.innerHTML = '';
}

function setManager(manager) {
    var m = manager;
    var buttons = document.getElementsByTagName('button');
    var len = buttons.length;
    var header_button;

    for (var i = 0; i < len; i++) {
        if (buttons[i].innerHTML.indexOf('Business') > -1) {
            header_button = buttons[i];
        }
    }

    header_button.click();

    var flag = 0;

    var img = document.getElementsByClassName('invoice-add-info__content__logo')[0].getElementsByTagName('img')[0];
    var waitforimage = setInterval(function() {
        if (img.offsetWidth !== 0) {
            clearInterval(waitforimage);

            var inputs = document.getElementsByTagName('input');
            len = inputs.length;

            var manager_input;

            for (i = 0; i < len; i++) {
                if (inputs[i].value.indexOf('Manager') > -1) {
                    manager_input = inputs[i];
                }
            }
            manager_input.value += (m + ' ');
            manager_input.focus();
        }
    }, 500);
}