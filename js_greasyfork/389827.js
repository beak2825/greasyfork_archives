// ==UserScript==
// @name         Kralik
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://darkelf.bkralik.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389827/Kralik.user.js
// @updateURL https://update.greasyfork.org/scripts/389827/Kralik.meta.js
// ==/UserScript==


console.log('helou');
var vypocetBtn = document.forms[2].getElementsByTagName('button')[0];
vypocetBtn.addEventListener('click',ShowCasualites);
/*
var newVypocetBtn = document.createElement('button');
newVypocetBtn.innerHTML = 'Pocitaj';
newVypocetBtn.onclick = (e)=>{
        this.army_strength.countArmyStrength(document.forms[2]);
        ShowCasualites();
    };
vypocetBtn.parentElement.append(newVypocetBtn);
*/

var unit1input = document.getElementsByName('unit1')[0];
var unit2input = document.getElementsByName('unit2')[0];
var unit3input = document.getElementsByName('unit3')[0];
var inputs = [unit1input, unit2input, unit3input];
inputs.forEach(function createButtons(x){
    console.log('helou');
    var btnp = document.createElement('button');
    var thisName = x.name;
    btnp.innerHTML = '+';
    btnp.className = thisName+'btnp';
    btnp.type = 'button';
    btnp.onclick = (e)=>{
        ChangeNumberInValue(x,+1);
        this.army_strength.countArmyStrength(document.forms[2]);
        ShowCasualites();
    };
    x.parentElement.parentElement.insertBefore(btnp,x.parentElement);
    var btnm = document.createElement('button');
    btnm.innerHTML = '-';
    btnm.className = thisName+'btnm';
    btnm.type = 'button';
    btnm.onclick = (e)=>{
        ChangeNumberInValue(x,-1);
        this.army_strength.countArmyStrength(document.forms[2]);
        ShowCasualites();
    };
    x.parentElement.parentElement.insertBefore(btnm,x.parentElement);
});

document.forms[2].getElementsByTagName('div')[4]

var divStraty = document.createElement('div');
divStraty.className="singlecolumn";
for(var i = 0;i<3;i++){
    var label = document.createElement('label');
    label.innerHTML = ' umrie ' +i+ '. stupna'
    var stratyInput = document.createElement('input');
    stratyInput.size = 3;
    stratyInput.id='startInput'+i;
    divStraty.appendChild(label);
    label.prepend(stratyInput);
    var br = document.createElement('br');
    divStraty.appendChild(br);

}
document.forms[2].appendChild(divStraty);

var label1 = document.createElement('label');

var inputObrana = document.createElement('input');
label1.innerHTML = ' obrana kam smeruje utok (pre pocitanie strat)';
inputObrana.size = 3;
label1.prepend(inputObrana)

document.forms[2].getElementsByTagName('div')[4].append(label1);




function ShowCasualites(){
    if(inputObrana.value=="")
    {
        console.log(inputObrana.value);
    inputObrana.value='0';
    }

    var utok = parseInt(document.getElementsByName('attack_output')[0].value);
    var obrana = parseInt(inputObrana.value);
    var pocet1= parseInt(unit1input.value);
    var pocet2= parseInt(unit2input.value);
    var pocet3= parseInt(unit3input.value);
    var straty = CalulateCasualties([pocet1,pocet2,pocet3],utok,obrana);
    document.getElementById('startInput0').value=straty[0];
    document.getElementById('startInput1').value=straty[1];
    document.getElementById('startInput2').value=straty[2];

}

function CalulateCasualties(units,attack,defence)
{
    if (defence >= 3*attack) {
        return units;
    }
    var lost1 = Math.floor(units[0]*(defence/attack)/3);
    var lost2 = Math.floor(units[1]*(defence/attack)/3);
    var lost3 = Math.floor(units[2]*(defence/attack)/3);
    return [lost1,lost2,lost3]
}


function ChangeNumberInValue(ele,change)
{
    ele.value = parseInt(ele.value) + +change;
};
	var S = function(b, e) {
		this.base_cost = b;
		this.exp_cost = e;
	};

	var HS = function(a, ae, def, defe, sp, spe, md, mde, es, ese, s, se, t, te, des, dese, ef, efe) {
		this.attack = new S(a, ae);
		this.defence = new S(def, defe);
		this.spell_power = new S (sp, spe);
		this.magical_defence = new S(md, mde);
		this.escape = new S(es, ese);
		this.survival = new S(s, se);
		this.thieving = new S(t, te);
		this.destruction = new S(des, dese);
		this.efficiency = new S(ef, efe);
	};
DB.Heroes.extra_fighter = new HS(270,2.7,200,2.6,580,4.1,200,2.7,200,2.4,140,2.5,170,2.8,120,1.7,1200,5.3);
let option = document.createElement('option');
option.value='extra_fighter';
option.innerText = 'Extra bojovnik'
document.getElementsByName('hero_type')[0].append(option);

document.getElementsByName('attack')[2].removeAttribute('readonly');


function moveArtsByValue(value)
{
let tbody = document.forms[10].children[0].children[0];
    for(let i=1;i<9;i++)
    {
        let select = tbody.children[i].children[0].children[0];
        select.options[value].selected=true;
        select.onchange();
    }

}
let MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Skret';
MoveArtsUpButton.onclick = () => moveArtsByValue(2);
document.forms[10].append(MoveArtsUpButton);

MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Zbrojnos';
MoveArtsUpButton.onclick = () => moveArtsByValue(1);
document.forms[10].append(MoveArtsUpButton);

MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Legionar';
MoveArtsUpButton.onclick = () =>moveArtsByValue(3);
document.forms[10].append(MoveArtsUpButton);

MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Rytier';
MoveArtsUpButton.onclick = () =>moveArtsByValue(4);
document.forms[10].append(MoveArtsUpButton);

MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Trpaslik';
MoveArtsUpButton.onclick = () =>moveArtsByValue(5);
document.forms[10].append(MoveArtsUpButton);

MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Elf';
MoveArtsUpButton.onclick = () =>moveArtsByValue(6);
document.forms[10].append(MoveArtsUpButton);

MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Nekromant';
MoveArtsUpButton.onclick =() => moveArtsByValue(7);
document.forms[10].append(MoveArtsUpButton);

MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Mag';
MoveArtsUpButton.onclick = () =>moveArtsByValue(8);
document.forms[10].append(MoveArtsUpButton);

MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='DE';
MoveArtsUpButton.onclick = () =>moveArtsByValue(9);
document.forms[10].append(MoveArtsUpButton);


MoveArtsUpButton = document.createElement('button');
MoveArtsUpButton.innerText='Vasek';
MoveArtsUpButton.onclick = () =>moveArtsByValue(10);
document.forms[10].append(MoveArtsUpButton);
