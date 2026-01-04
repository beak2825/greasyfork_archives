// ==UserScript==
// @name         lapostemailcreate
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://compte.laposte.net/inscription/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32042/lapostemailcreate.user.js
// @updateURL https://update.greasyfork.org/scripts/32042/lapostemailcreate.meta.js
// ==/UserScript==

(function() {
    'use strict';

        var x = [  
'MauricePirkle',
'ShalonHaapala',
'EleneKettle',
'PauleneGagne',
'AlphonsoYounger',
'HillaryPurcell',
'HyePipkins',
'JanettCalnan',
'DinoWertz',
'Omer_Kagawa',
'Sonia_Vecchio',
'Leora_Kamen',
'Floyd_Garofalo',
'Shanti_Stuck',
'Yen_Alvear',
'Caroline_Opitz',
'Mona_Rembert',
'Raguel_Delahanty',
'ManuelProper',
'Shemeka Curry',
'Clarisa',
'Beata',
'Guillermo',
'Ciera',
'Sigrid',
'Many',
'Jaleesa',
'Euna',
'Twila',
'Tish',
'Aurea',
'Elly',
'Terisa',
'Rayford',
'Joetta',
'Adolfo',
'Breanna',
'Thomasena',
'Tiffani',
'Elvis',
'Peggy',
'Mike',
'Weldon',
'Kris',
'Elia',
'Romona',
'Evelina',
'Annale',
'Suzan',
'Kristen',
'Brett',
'Dominga',
'Loria',
'Cherrie',
'Marquetta',
'Aubrey',
'Carolee',
'Layne',
'Oliver',
'Meaghan',
'Dee',
'Charline',
'Caren',
'Myrtle',
'Kathrin',
'Salvator',
'Chana',
'Carlyn',
'Laurene',
'Elida',
'Reggie',
'Ferdinand',
'Cordell',
'Kim',
'Jarod',
'Tuan',
'Jeromy',
'Vicent',
'Deon',
'Myron',
'Nathanial',
'Rudolph',
'Numbers',
'Julio',
'Grover',
'Alberto',
'Stevie',
'Frankie',
'Dominique',
'Jaime',
'Damien',
'Hung',
'Nickolas',
'Jacob',
'Fletcher',
'Millard',
'Arden',
'Benedict',
'Gayle',
'Sergio',
'Rickie',
'Jasper',
'Jonathan',
'Shaun',
'Tanner',
'Rusty',
'Steven',
'Mohammad',
'Spencer',
'Terrence',
'Hubert',
'Carrol',
'Edison',
'Bennett',
'Darrin',
'Joaquin',
'Morris',
'Thaddeus',
'Angel',
'Alonso',
'Laure' ,
'Bailey',
'Pansy',
'Pauline',
'Pasty',
'Andres',
'Janetta',
'Wendell',
'Retha',
'Kyung',
'Nanette',
'Lera',
'Dorotha',
'Geralyn',
'Lidia',
'Shari',
'Lasonya',
'Gregoria',
'Lorri',
'Thad',
'Tanika',
'Brigette',
'Mose',
'Claud',
'Un',
'Charleen',
'Antionette',
'Chrissy',
'Evelina',
'Maxima',
'Noble',
'Reggie',
'Iona',
'Farrah',
'Ignacio',
'Woodrow',
'Kyong',
'Rhoda',
'Magan',
'Rosalind',
'Elfriede',
'Holley',
'Portia',
'Laronda',
'Bess',
'Jed',
'Robt',
'Tommy',
'Bernardo',
'Johnson',
'Sol',
'Alfonso',
'Lenny',
'Josiah',
'Domenic',
'Arnulfo',
'Omar',
'Andre',
'Joey',
'Fermin',
'Vaughn',
'Elijah',
'Brant',
'Jarrett',
'Franklin',
'Garry',
'Alton',
'Christoper',
'Ted',
'Rocco',
'Johnie',
'Irving',
'Clemente',
'Douglass',
'Emilio',
'Burton',
'Napoleon',
'Wallace',
'Rosendo',
'Arlen',
'Jordan',
'Orval',
'Dillon',
'Tyree',
'Parker'] ;



var x2 =[
'case',
'Vilas-boas',
'Garside',
'Yorgey',
'Triggs',
'Blackwell',
'Nakae',
'Lamarca',
'Cerioli',
'Moon',
'Sioras',
'Nureddin',
'Orsher',
'Scranton',
'Gallagher',
'Milley',
'Ford',
'Avery',
'Muther',
'Zurn',
'Mirtin-gonzalez',
'Gomez-yafl',
'Bulwer',
'Cazzola',
'Bridge',
'Shelor',
'Aguirre',
'Ciampaglia',
'Trinder',
'Akiyoshi',
'Kelleher',
'Petracca',
'Willson',
'Vanedema',
'Zaccagnino',
'Craul',
'Grimmett',
'Livingstone',
'Lunneborg',
'Dacosta',
'Lutes',
'Martinlopez',
'marrington',
'Lugira',
'Ishikawa',
'Debush',
'Forman',
'Zheng',
'Fleckenstein',
'Mazer',
'Fontes',
'Skenazi',
'Mcdowell',
'Akaishi',
'Ortiz',
'Mccullagh',
'Herron',
'Babcock',
'Aly',
'Smirin',
'Branton',
'Ronsman',
'Mckay',
'Breckner',
'Shavelson',
'Bertuzzi',
'Descrivan',
'Snowhill',
'Fairchild',
'Mcleod',
'Tiffney',
'shape',
'auto',
'chape',
'Tsiatis',
'Philipson',
'Depifanio',
'Mcknespiey',
'Klatzky',
'Trakimas',
'Marquis',
'Boyes-watson',
'Bartoo',
'Dangiolini',
'Shumaker',
'Lilley',
'Ebralidse',
'Bajaj',
'Hinkson',
'Langman',
'Bradner',
'Wucherpfennig',
'Meagher',
'Kolster',
'Dore',
'Krupnick',
'Bjorkoy',
'Paulauskis',
'Philbrick',
'Nightingale',
'Boxer',
'Yanagisawa',
'Korzun',
'Corcoran',
'Timberman',
'Kimball',
'Pfister',
'Shepsle',
'Merz', 
'Levy',
'Zak',
'Jochim',
'Fadule',
'Segura',
'Marek',
'Traver'] ; 

var nom =  x[Math.floor(Math.random()*100)];
var prenom = x2[Math.floor(Math.random()*100)];
var codepostal =  Math.ceil( Math.random()*9) +""+ Math.ceil( Math.random()*9) +""+ Math.ceil( Math.random()*9) +""+ Math.ceil( Math.random()*9) +""+ Math.ceil( Math.random()*9) ;

//sexe
civility_2.click();

//nom
	var a = document.getElementsByClassName("input");
	var b =  a[0].id  ;  
	var c = document.getElementById(b);

	c.value="dupond" ;
 
//prenom

ipPrenom.value="marion" ; 


// date 1

var randoom= Math.random()
if(randoom<0.5){
 $('#select-1 option[value=10]').attr('selected', true); 
}

else{
  $('#select-1 option[value=11]').attr('selected', true);
}
$("#select-1").trigger('change');

// date 2 
 $('#select-2 option[value=janvier]').attr('selected', true);
$("#select-2").trigger('change');

//date 3
$('.select-2 option[value=1995]').attr('selected', true);
$('.select-2 option[value=1995]').trigger('change')

// code postal

ipCP.value="75001" ; 
// mail

ipMail.value = nom+ prenom + Math.floor( Math.random()*1000)+   Math.random().toString(36).substr(9, 1)  
setTimeout(function(){document.getElementById('ipMail').focus(); }, 1500);



//mdp
ipPwd.value="Chien1234@"
setTimeout(function(){document.getElementById('ipPwd').focus(); }, 2000);

// mdp validec
setTimeout(function(){
ipPwd2.value="Chien1234@"
 }, 2500);

//type question
ipQuest.value=2
 ;

setTimeout(function(){
checkSave() ; 
 }, 1000);


setTimeout(function(){
// question ?
ipMyQuest.value="createur ? " 

//rep !
ipMyRep.value="Mcnoke"

// valider condition
conditionscbx.click();
 }, 2100);

    // Your code here...
})();