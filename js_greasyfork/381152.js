// ==UserScript==
// @name         Průměry
// @namespace    https://greasyfork.org/en/users/287642-jomaxims
// @version      0.4.0
// @description  Bakaláři Průměry
// @author       Franz Herrmann
// @match        *://*.bakalari.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381152/Pr%C5%AFm%C4%9Bry.user.js
// @updateURL https://update.greasyfork.org/scripts/381152/Pr%C5%AFm%C4%9Bry.meta.js
// ==/UserScript==

(function() {

const predmet = document.getElementsByClassName('predmet-radek');

function prumer() {
  for(let p = 0; p < predmet.length; p++) {
    if(predmet[p].querySelector('#vysledek')) {
      predmet[p].querySelector('#vysledek').remove();
    }
    const zBlock = predmet[p].querySelectorAll('.znamka-v');
    let cZnamka = 0;
    let cVaha = 0;
    for(let z = 0; z < zBlock.length; z++) {
      const Att = zBlock[z].getAttribute('data-clasif').split(',');
      let znamka = Number(JSON.parse(Att).MarkText.replace(/[^\d-]/g, '0').replace('-','.5'));
      let vaha = Number(JSON.parse(Att).vaha.toString().replace(/[^\d]/g, '0'));
      if (predmet[p].querySelectorAll('.znamka-v')[z].classList.contains('znamkaDisable')) {
        znamka = 0;
        vaha = 0;
      }
      if (znamka == 0) {
        vaha = 0;
      }
      const vysledek = znamka * vaha;
      cZnamka += vysledek;
      cVaha += vaha;
      let zBarva = '';
      if (znamka >= 0) {
        zBarva = '0, 255, 0, ';
      }
      if (znamka >= 2) {
        zBarva = '192, 255, 0, ';
      }
      if (znamka >= 3) {
        zBarva = '255, 255, 0, ';
      }
      if (znamka >= 4) {
        zBarva = '255, 128, 0, ';
      }
      if (znamka >= 5) {
        zBarva = '255, 0, 0, ';
      }
      zBlock[z].style.backgroundColor = 'rgba(' + zBarva + vaha/10 + ')';
    }
  const prumer = cZnamka / cVaha;
  const pDiv = predmet[p].querySelector('.obal').appendChild(document.createElement('div'));
  pDiv.id = 'vysledek';
  pDiv.innerText = prumer.toFixed(2);
  if (isNaN(prumer) === true) {
    pDiv.innerText = 'No Marks';
  }
  let bBarva = '';
  if (prumer > 0) {
    bBarva = '#00FF00';
  }
  if (prumer > 1.5) {
    bBarva = '#C0FF00';
  }
  if (prumer > 2.5) {
    bBarva = '#FFFF00';
  }
  if (prumer > 3.5) {
    bBarva = '#FF8000';
  }
  if (prumer > 4.5) {
    bBarva = '#FF0000';
  }
  if (isNaN(prumer) === true) {
    bBarva = '#FFFFFF';
  }
  pDiv.style.cssText = 'margin: 1px; position: absolute; top: 27px; color: ' + bBarva + ' !important; font-weight: bold; font-size: 1.2em; text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000, 1px  1px 0 #000,0 1px 0 #000, -1px  1px 0 #000, -1px  0   0 #000;';
  predmet[p].querySelector('h3').style.width = '150px';
  predmet[p].style.backgroundColor = '#FFFFFF';
  if (predmet[p].querySelector('.znamky').children.length < 1) {
    predmet[p].querySelector('.bx-next').classList.add('disabled');
  }
  }
}

function button() {
  for (let pb = 0; pb < predmet.length; pb++) {
    const add = predmet[pb].querySelector('.obal').appendChild(document.createElement('div'));
    add.className = 'addBlock';
    predmet[pb].querySelector('.addBlock').style.cssText = 'position: absolute; top: 10px; right: 10px;'
    add.innerHTML = '<input class="addInput" type="text" autocomplete="off" placeholder="Z"><br><input class="addInput" type="text" autocomplete="off" placeholder="V"><br><input class="addButton" id="addButton" type="button" value="-"><input class="addButton" id="removeButton" type="button" value="+">';
    predmet[pb].querySelectorAll('.addInput')[0].style.cssText = 'position: relative; width: 20px; text-align: center; margin-left: 24px;';
    predmet[pb].querySelectorAll('.addInput')[1].style.cssText = 'position: relative; width: 20px; text-align: center; margin-left: 24px;';
    predmet[pb].querySelectorAll('.addButton')[0].style.cssText = 'position: relative; width: 24px;';
    predmet[pb].querySelectorAll('.addButton')[1].style.cssText = 'position: relative; width: 24px;';
    predmet[pb].querySelectorAll('.addButton')[0].addEventListener('click', function(){znamkaRemove(pb);});
    predmet[pb].querySelectorAll('.addButton')[1].addEventListener('click', function(){znamkaSubmit(pb);});
    predmet[pb].querySelectorAll('.addButton')[0].addEventListener('click', function(event){event.stopPropagation();});
    predmet[pb].querySelectorAll('.addButton')[1].addEventListener('click', function(event){event.stopPropagation();});
    predmet[pb].querySelectorAll('.addInput')[0].addEventListener('click', function(event){event.stopPropagation();});
    predmet[pb].querySelectorAll('.addInput')[1].addEventListener('click', function(event){event.stopPropagation();});

    for (let d = 0; d < predmet[pb].querySelectorAll('.znamky .znamka-v').length; d++) {
      const zCont = predmet[pb].querySelector('.znamky');
      let disableButton = '<div id="disableButton" style="color: #FFFFFF; position: absolute; top: 0; right: 0; width: 17px; height: 17px; text-align: right; z-index: 2; line-height: 10px; padding-right: 3px; user-select: none;">-</div><div class="disableButton" style="position: absolute; top: 0; right: 0; width: 0; height: 0; border-top: 17px solid #3d3d3d; border-left: 17px solid transparent; z-index: 1;"></div>';
      zCont.querySelectorAll('.znamka-v')[d].insertAdjacentHTML('beforeend', disableButton);
      zCont.querySelectorAll('#disableButton')[d].addEventListener('click', function(){znamkaDisable(pb, d);});
      zCont.querySelectorAll('#disableButton')[d].addEventListener('click', function(event){event.stopPropagation();});
    }
  }
}

function znamkaSubmit(cPredmet) {
  const pZnamky = predmet[cPredmet].querySelector('.znamky');
  const addZnamka = predmet[cPredmet].getElementsByClassName('addInput')[0].value;
  const addVaha = predmet[cPredmet].getElementsByClassName('addInput')[1].value;
  const dataClasif = {
        "ShowCaption": true,
        "ShowTheme": true,
        "ShowType": true,
        "ShowWeight": true,
        "bodymax": 0,
        "caption": "",
        "id": "",
        "nazev": "",
        "oznaceni": addVaha,
        "poznamkakzobrazeni": "",
        "strdatum": "",
        "strporadivetrideuplne": "",
        "typ": addVaha,
        "udel_datum": "",
        "vaha": addVaha,
        "znamkakzobrazeni": addZnamka,
        "calculatedMark": "",
        "MarkText": addZnamka,
        "PointsText": "",
        "datum": "",
        "Teacher": "",
        "IsNew": false,
        "MarkTooltip": null
    };
  const pZnamkyDiv = '<div class="znamka-v" id="znamkaRemove" title style="float: left; list-style: none; position: relative; width: 56px; border: 1px #FFFFFF; box-shadow: inset 0px 0px 2px 0px #000000;" data-clasif=' + JSON.stringify(dataClasif) + '><div class="cislovka obrovsky"><div class="ob">' + addZnamka + '</div></div><div class="bod"></div><div class="dodatek"><span>' + addVaha + '</span><br>Custom</div></div>';
  if (addZnamka != '' && addVaha != '') {
  pZnamky.insertAdjacentHTML('beforeend', pZnamkyDiv)
  window.dispatchEvent(new Event('resize'));
  }
}

function znamkaRemove(rPredmet) {
  if (predmet[rPredmet].querySelector('.znamky').lastElementChild.id == 'znamkaRemove') {
    predmet[rPredmet].querySelector('.znamky').lastElementChild.remove();
  } else {
    const removeConfirm = confirm('Remove non-custom');
    if (removeConfirm == true) {
      predmet[rPredmet].querySelector('.znamky').lastElementChild.remove();
    }
  }
  prumer();
  if (predmet[rPredmet].querySelector('.znamky').children.length >= 1) {
    window.dispatchEvent(new Event('resize'));
  }
}

function znamkaDisable(pb, d) {
  if (predmet[pb].querySelectorAll('.znamka-v')[d].classList.contains('znamkaDisable')) {
    predmet[pb].querySelectorAll('.znamka-v')[d].className = 'znamka-v tooltip-bubble';
    predmet[pb].querySelectorAll('#disableButton')[d].style.color = '#FFFFFF';
    predmet[pb].querySelectorAll('.disableButton')[d].style.borderTop = '17px solid #3d3d3d';
    predmet[pb].querySelectorAll('.znamka-v')[d].style.backgroundColor = '#FFFFFF';
    predmet[pb].querySelectorAll('.znamka-v')[d].querySelector('style').remove();
  }
  else {
    predmet[pb].querySelectorAll('.znamka-v')[d].className = 'znamka-v tooltip-bubble znamkaDisable';
    predmet[pb].querySelectorAll('#disableButton')[d].style.color = '#000000';
    predmet[pb].querySelectorAll('.disableButton')[d].style.borderTop = '17px solid #efefef';
    const disableStyle = '<style>.znamkaDisable {background-color: #000000 !important;} .znamkaDisable:hover {background-color: #000000 !important;} .znamkaDisable .cislovka {color: #FFFFFF !important;} .znamkaDisable .dodatek {color: #FFFFFF !important;}</style>';
    predmet[pb].querySelectorAll('.znamka-v')[d].insertAdjacentHTML('beforeend', disableStyle);
  }
  prumer()
}

window.addEventListener('load', prumer);
window.addEventListener('load', button);
window.addEventListener('resize', prumer);

})();