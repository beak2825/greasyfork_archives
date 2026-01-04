// ==UserScript==
// @name        Racourcis R'
// @namespace   Mountyhall
// @description Client MountyZilla
// @include     */mountyhall/*
// @version 0.2
// @downloadURL https://update.greasyfork.org/scripts/370193/Racourcis%20R%27.user.js
// @updateURL https://update.greasyfork.org/scripts/370193/Racourcis%20R%27.meta.js
// ==/UserScript==


function createButton(idTalent,textTalent) {
	var  listeIcons = {1008: "Fabr BdN", 1009: "Lanc BdN", 147: "2 Act", 13: "Transb", 47: "Stop",3: "Att",23: "Souffler",26: "GG",9: "PX",25: "Decam",525: "Glando",16: "Goin",34: "Champi",4: "Ramas",
		536: "Mouch",22: "Guilde",6: "Amelio",24: "Conc",1: "Depl",45: "Relev",5: "Entr",40: "Trolligion",46: "Apo",11: "Parc/Po",103: "AM",109: "AP",106: "Bal",143: "Barou",124: "Bid",101: "BS",
		104: "Camou",114: "Charge",116: "Cdm",115: "Piege",111: "CA",108: "CdB",144: "Course",112: "DE",127: "Dress",119: "EM",107: "Fre",141: "Golem",126: "Grat",117: "HE",105: "IdC", 50: "Ballu",
		118: "Insulte",123: "LdP",137: "Marq",125: "MeM",133: "Necro",146: "Paint",110: "Par",121: "Pist",135: "Plant",102: "RA",140: "Rep",138: "Retr",142: "Roto",128: "Sham",145: "Interp",
		148: "Pierre",220: "AA",216: "AE",206: "AdA",207: "AdE",205: "AdD",227: "BaM",229: "BuM",208: "Explo",212: "FP",219: "FA",218: "Glue",228: "GdS",202: "Hypno",210: "IdT",215: "Invi",
		233: "Levit",234: "PreM",201: "Projo",221: "Proj",235: "PuM",204: "RP",217: "Sacro",236: "Obsi",224: "Telek",213: "TP",203: "Vampi",222: "VA",209: "VL",223: "VlC",211: "VT",214: "Siphon",35: "Enfouir", 7: "Cueillir"};
	var myShortcut = listeIcons[idTalent];
	if(typeof myShortcut == 'undefined') 
		myShortcut = textTalent;
        var newButton = document.createElement('button'); 
        newButton.setAttribute('id','Btn_Talent_'+idTalent);
        newButton.setAttribute('value',idTalent);
        newButton.setAttribute('class','button');
        newButton.setAttribute('title',textTalent);
	Object.assign(newButton.style,{
		"display": "inline-block", 
		"white-space": "nowrap", 
		"user-select": "none", 
		"-webkit-touch-callout":"none", 
		"-webkit-user-select":"none", 
		"-khtml-user-select":"none", 
		"-moz-user-select":"none", 
		"-ms-user-select":"none", 
		"-webkit-tap-highlight-color":"rgba(0,0,0,0)", 
		"max-width": "45px",  
		"text-overflow": "ellipsis", 
		"overflow-x": "hidden", 
		"margin": "2px", 
		"cursor":  "pointer",
		"padding": "1px 3px", 
		"font-size": "11px", 
		"background-color": "#666633", 
		"color": "#FFFFFF", 
		"border-width": "1px", 
		"border-top-color": "#CCCC00",  
		"border-left-color": "#CCCC00", 
		"border-right-color": "#330000", 
		"border-bottom-color": "#330000", 
		"border-style": "outset", 
		"border-width": "1px",
	});
	newButton.textContent = myShortcut;
        return newButton; 
}

function removeShortcut(idTalent,textTalent) {
	window.open('/mountyhall/MH_Play/Play_action.php?as_Action=ACTION+%21%21&as_SelectName='+textTalent+'&as_Action2=Shortcuts&ai_ToDo='+idTalent,'Action');
}

function getShortcutList() {
        return document.getElementsByClassName('shortAction');
} 

function addButtonShortcutZone(){
    var listeFavoriTr = document.getElementById('listeFavori');
    var newTr = listeFavoriTr.parentNode.parentNode.parentNode.parentNode.insertRow(0);
    var newTd = newTr.insertCell(0);
    var newDiv = document.createElement('div');
    newDiv.setAttribute('style','padding-left: 24px');
    newTd.appendChild(newDiv);
    return newDiv;
}

function isPage(url) {
        return 0 <= window.location.href.indexOf(url);
}


function addLongPressListener() {

	Array.from(document.querySelectorAll(".button")).forEach(div=>{
		let done = false;
  		div.addEventListener("contextmenu", function(e){
    			e.preventDefault();
			if(window.confirm("voulez-vous supprimer le raccourci pour l'action : "+div.title+" ?")) {
				removeShortcut(div.getAttribute("value"),div.title);
			}	
      			done = true;
  		});

        // Ã§a c'est si on veut faire autre chose sur le click
  		div.addEventListener("click", function(e){
  			if(!done) {
      				window.open('Play_action.php?ai_ToDo='+div.getAttribute("value")+'&as_Action=ACTION!','Action');
			}
  		})
	})
}


/* function addLongPressListener() {

	let timer;
	Array.from(document.querySelectorAll(".button")).forEach(div=>{
		let done = false;
  		div.addEventListener("mousedown", function(e){
  			clearTimeout(timer);
    			timer = setTimeout(()=>{
				if(window.confirm("voulez-vous supprimer le raccourci pour l'action : "+div.title+" ?")) {
					removeShortcut(div.getAttribute("value"),div.title);
				}	
      				done = true;
    			}, 2000)
    			return false;
  		});
  		div.addEventListener("mouseup", function(e){
  			if (done) return;
  			clearTimeout(timer);
    			div.click();
  		});
  // Ã§a c'est si on veut faire autre chose sur le click
  		div.addEventListener("click", function(e){
  			if(!done) {
      				window.open('Play_action.php?ai_ToDo='+div.getAttribute("value")+'&as_Action=ACTION!','Action');
			}
  		})
	})
}*/

/*************************************************************************************
 *
 *  MAIN
 *
 *************************************************************************************/

 function mainMenu() {
       var shortcutList = getShortcutList();
       if (shortcutList.length <= 0 ) return false;
       
       var newButtonZone = addButtonShortcutZone();
       
	Array.prototype.forEach.call(shortcutList,function(element) {
           var idTalent = new URL('http://www.toto.com/'+element.getAttribute('href')).searchParams.get("ai_ToDo");
           var textTalent = element.innerHTML;
	var newButton = createButton(idTalent,textTalent);	
	if(newButton !== false)
           newButtonZone.append(createButton(idTalent,textTalent));
       });
	addLongPressListener();

 }


// ajout des champs sur le profil
if(isPage("MH_Play/Play_menu.php")){ 
  mainMenu();
}
