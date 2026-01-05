// ==UserScript==
// @name         LowadiTraining
// @description  Lowadi auto training
// @version      1.60
// @include      https://www.lowadi.com*
// @exclude      https://www.lowadi.com/marketing/*
// @noframe      none
// @grant        none
// @author       Ilia Zykin
// @namespace    https://greasyfork.org/users/12821
// @downloadURL https://update.greasyfork.org/scripts/21126/LowadiTraining.user.js
// @updateURL https://update.greasyfork.org/scripts/21126/LowadiTraining.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var accountList, passwordList, loginAccount, passwordAccount, re, tagList, passList;

	//Сюда через знак тильда(~) пишем все ники и пароли, по которым нужно пройти
	accountList = '';
	passwordList = '';

	if (getCookie('step') == '0') {
		deleteCookie('accountList');
		deleteCookie('passwordList');
		setCookie('accountList', accountList);
		setCookie('passwordList', passwordList);

		if (getCookie('loginAccount') !== undefined) {
			loginAccount = getCookie('loginAccount');
			passwordAccount = getCookie('passwordAccount');
			re = /\s*\~\s*/;
			tagList = getCookie('accountList').split(re);
			passList = getCookie('passwordList').split(re);

			for (var i = 0; i < tagList.length; i++) {
				if (getCookie('loginAccount') == tagList[i] && (i+1) < tagList.length) {
					deleteCookie('loginAccount');
					deleteCookie('passwordAccount');
					setCookie('loginAccount', tagList[i+1]);
					setCookie('passwordAccount', passList[i+1]);
					deleteCookie('step');
					setCookie('step', '1');
                    break;
				}
			}

			if (getCookie('step') !== '1') {
				deleteCookie('step');
				setCookie('step', '1000');
			}
		} else {
			re = /\s*\~\s*/;
			tagList = getCookie('accountList').split(re);
			passList = getCookie('passwordList').split(re);
			setCookie('loginAccount', tagList[0]);
			setCookie('passwordAccount', passList[0]);
			deleteCookie('step');
			setCookie('step', '1');
		}
	}

	setTimer();
})();


function nextAction() {
	step = parseInt(getCookie('step'));
	console.log(step);
	switch(step) {
		case 1:
			if (window.location.pathname == '/site/logIn' || window.location == 'http://www.lowadi.com/') {
				//document.getElementById('header-login-label').click();
				document.getElementById('login').value = getCookie('loginAccount');
				document.getElementById('password').value = getCookie('passwordAccount');
				deleteCookie('step'); setCookie('step', (step+1));
				document.getElementById('authentificationSubmit').click();
			} else {
				window.location.href = '/site/logIn';
			}
			break;
		case 2: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 3: deleteCookie('step'); setCookie('step', (step+1)); window.location.href = '/elevage/chevaux/cheval?id=1'; break; //click to hourse
		case 4: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 5: clickIfIsset('id', 'training-endurance-submit', '0'); break;
		case 6: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 7: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 8: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 9: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 10: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 11: clickIfIsset('class', 'tuto-avatar-gift', '0'); break;
		case 12: deleteCookie('step'); setCookie('step', (step+1)); window.location.href = '/marche/boutique'; break; //location to shop
		case 13:
			if (document.getElementById('soumettre12') !== null) {
				deleteCookie('step'); setCookie('step', (step+1));
				document.getElementById('soumettre12').click();
			}
			break;
		case 14: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 15: deleteCookie('step'); setCookie('step', (step+1)); window.location.href = '/elevage/chevaux/'; break; //location to stable
		case 16: clickIfIsset('class', 'spacer-small-top action action-style-2', '0'); break;
		case 17: clickIfIsset('class', 'modele float-left clickable', '0'); break; //Надеть седло
		case 18: //Подтвердить снаряжение
			if (document.getElementById('choisir-equipement-popup-content').getElementsByClassName('spacer-top button button-style-0')[0] !== null) {
				deleteCookie('step'); setCookie('step', (step+1));
				document.getElementById('choisir-equipement-popup-content').getElementsByClassName('spacer-top button button-style-0')[0].click();
			}
			break;
		case 19: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 20: clickIfIsset('class', 'action action-style-4 competition-cross', '0'); break;
		case 21: clickIfIsset('class', 'button button-style-0', '0'); break;
		case 22: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 23: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 24: clickIfIsset('class', 'tuto-avatar-gift', '0'); break;
		case 25: deleteCookie('step'); setCookie('step', (step+1)); window.location.href = '/marche/noir/'; break; //location to black shop
		case 26: deleteCookie('step'); setCookie('step', (step+1)); window.location.href = '/marche/noir/object?qName=baton-fertilite'; break; //location to staff
		case 27: document.getElementById('pass-radio').click(); //Select pay
			clickIfIsset('class', 'button button-style-2', '0'); break;
		case 28: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 29: clickIfIsset('class', 'action action-style-4 saillir', '0'); break; //location to horsing
		case 30: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 31: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 32: clickIfIsset('class', 'button button-style-0', '1'); break;
		case 33: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 34: clickIfIsset('id', 'boutonDoReproduction', '0'); break;
		case 35: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 36: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 37: clickIfIsset('class', 'action action-style-4 panser', '0'); break;
		case 38: clickIfIsset('class', 'tuto-avatar-gift', '0'); break;
		case 39: clickIfIsset('id', 'boutonNourrir', '0'); break;
		case 40: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 41:
			if (document.getElementById('haySlider') !== null) {
				var countFu = parseInt(document.getElementsByClassName('tuto-avatar-info-content')[0].getElementsByTagName('strong')[3].innerHTML);
				deleteCookie('step'); setCookie('step', (step+1));
				document.getElementById('haySlider').getElementsByTagName('ol')[0].getElementsByTagName('li')[countFu].click();
			}
			break;
		case 42: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 43:
			if (document.getElementById('oatsSlider') !== null) {
				if (document.getElementById('oatsSlider').getElementsByClassName('slider-number')[8] !== null) {
					var countOv = parseInt(document.getElementsByClassName('tuto-avatar-info-content')[0].getElementsByTagName('strong')[0].innerHTML);
					deleteCookie('step'); setCookie('step', (step+1));
					document.getElementById('oatsSlider').getElementsByTagName('ol')[0].getElementsByTagName('li')[countOv].click();
				}
			}
			break;
		case 44: clickIfIsset('class', 'button-inner-0', '0'); break;
		case 45: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 46: clickIfIsset('class', 'action action-style-4 coucher', '0'); break;
		case 47: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 48: clickIfIsset('id', 'boutonVieillir', '0'); break;
		case 49: clickIfIsset('class', 'button-inner-0', '1'); break;
		case 50: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 51: clickIfIsset('id', 'boutonPanser', '0'); break;
		case 52: clickIfIsset('id', 'boutonBoire', '0'); break;
		case 53: clickIfIsset('id', 'boutonBalade-foret', '0'); break;
		case 54:
			if (document.getElementById('walkforetSlider') !== null) {
				if (document.getElementById('walkforetSlider').getElementsByClassName('slider-number')[10] !== null) {
					deleteCookie('step'); setCookie('step', (step+1));
					document.getElementById('walkforetSlider').getElementsByTagName('ol')[0].getElementsByTagName('li')[10].click();
				}
			}
			break;
		case 55: clickIfIsset('id', 'walk-foret-submit', '0'); break;
		case 56:
			//Если ошибка висит
			if (document.getElementById('errorsBox').style.display != 'none') {
				window.location.reload(true);
			} else {
				if (document.getElementById('boutonBalade-foret').className == 'tab-action tab-action-select action action-style-4 balade-foret action-disabled') {
					deleteCookie('step'); setCookie('step', (step+1));
				} else if (document.getElementById('walkforetSlider') !== null) {
						if (document.getElementById('walkforetSlider').getElementsByClassName('slider-number')[10] !== null) {
							document.getElementById('boutonBalade-foret').click();
							document.getElementById('walkforetSlider').getElementsByTagName('ol')[0].getElementsByTagName('li')[10].click();
							document.getElementById('walk-foret-submit').click();
						}
					}
			}
			break;
		case 57: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 58: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 59: clickIfIsset('id', 'boutonCaresser', '0'); break;
		case 60: clickIfIsset('class', 'tuto-avatar-gift', '0'); break;
		case 61: clickIfIsset('id', 'boutonCarotte', '0'); break;
		case 62: clickIfIsset('id', 'boutonNourrir', '0'); break;
		case 63:
			if (document.getElementById('haySlider') !== null) {
				if (document.getElementById('haySlider').getElementsByClassName('slider-number')[10] !== null) {
					var countFu = parseInt(document.getElementsByClassName('section-fourrage section-fourrage-target')[0].innerHTML);
					document.getElementById('haySlider').getElementsByTagName('ol')[0].getElementsByTagName('li')[countFu].click();
				}
			}
			if (document.getElementById('oatsSlider') !== null) {
				if (document.getElementById('oatsSlider').getElementsByClassName('slider-number')[0] !== null) {
					var countOv = parseInt(document.getElementsByClassName('section-avoine section-avoine-target')[0].innerHTML);
					deleteCookie('step'); setCookie('step', (step+1));
					document.getElementById('oatsSlider').getElementsByTagName('ol')[0].getElementsByTagName('li')[countOv].click();
				}
			}
			break;
		case 64: clickIfIsset('class', 'button-inner-0', '0'); break;
		case 65: clickIfIsset('id', 'boutonCoucher', '0'); break;
		case 66: clickIfIsset('id', 'boutonVieillir', '0'); break;
		case 67: clickIfIsset('class', 'button-inner-0', '1'); break;
		case 68: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 69: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 70: clickIfIsset('id', 'boutonPanser', '0'); break;
		case 71: clickIfIsset('id', 'boutonNourrir', '0'); break;
		case 72:
			if (document.getElementById('haySlider') !== null) {
				if (document.getElementById('haySlider').getElementsByClassName('slider-number')[12] !== null) {
					var countFu = parseInt(document.getElementsByClassName('section-fourrage section-fourrage-target')[0].innerHTML);
					deleteCookie('step'); setCookie('step', (step+1));
					document.getElementById('haySlider').getElementsByTagName('ol')[0].getElementsByTagName('li')[countFu].click();
				}
			}
			break;
		case 73: clickIfIsset('class', 'button-inner-0', '0'); break;
		case 74: clickIfIsset('id', 'boutonCoucher', '0'); break;
		case 75: clickIfIsset('id', 'boutonVieillir', '0'); break;
		case 76: clickIfIsset('class', 'button-inner-0', '1'); break;
		case 77: clickIfIsset('id', 'doValiderEtape', '0'); break;
		case 78: clickIfIsset('id', 'boutonVeterinaire', '0'); break;
		case 79:
			document.getElementById('poulain-1').focus();
			document.getElementById('poulain-1').value = '1';
			document.getElementById('poulain-2').focus();
			document.getElementById('poulain-2').value = '2';
			deleteCookie('step'); setCookie('step', (step+1));
			document.getElementsByClassName('sowcle-form form-select-name')[0].submit();
			break;
		case 80:
			document.getElementById('poulain-2').value = '2';
			deleteCookie('step'); setCookie('step', (step+1));
			document.getElementsByClassName('sowcle-form form-select-name')[0].submit();
			break;
		case 81: clickIfIsset('class', 'tuto-avatar-gift', '0'); break;
		case 82:
			if (document.getElementById('privateMessage') !== null) {
				deleteCookie('step'); setCookie('step', (step+1));
				document.getElementById('privateMessage').click();
			} break;
		case 83: clickIfIsset('class', 'tabs-messages-new-nonlu', '0'); break;
		case 84: clickIfIsset('id', 'link-elevage', '0'); break;
		case 85: clickIfIsset('class', 'tuto-avatar-gift', '0'); break;
		case 86:
			deleteCookie('step'); setCookie('step', (step+1));
			document.getElementById('doValiderEtape').click();
	}
}

function setTimer() {
	var timerId = setInterval(function() {
		if (getCookie('step') !== undefined && getCookie('step') != '87') {
			nextAction();
		} else {
			if (getCookie('step') === undefined) {
				setCookie('step', '0');
			} else if (window.location.pathname == '/jeu/') {
				deleteCookie('step');
				setCookie('step', '0');
				document.getElementsByClassName('grid-row')[6].click();
			} else {
				window.location.href = 'http://www.lowadi.com/jeu/';
			}
		}
	}, 4000);
}

function clickIfIsset(type, name, numEl) {
	step = parseInt(getCookie('step'));
	switch(type) {
		case 'id':
			if (document.getElementById(name) !== null) {
				deleteCookie('step'); setCookie('step', (step+1));
				document.getElementById(name).click();
			} break;
		case 'class':
			if (document.getElementsByClassName(name)[numEl] !== null) {
				deleteCookie('step'); setCookie('step', (step+1));
				document.getElementsByClassName(name)[numEl].click();
			} break;
	}
}

function setCookie (name, value) {
	var date = new Date(new Date().getTime() + 31449600000);
	document.cookie = name+'='+value+'; path=/; expires=' + date.toUTCString();
}

function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
	setCookie(name, "", {
		expires: -1
	});
}

function getRandomArbitary(min, max)
{
	return Math.random() * (max - min) + min;
}