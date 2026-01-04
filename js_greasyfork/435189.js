// ==UserScript==
// @name         Bonkshitter
// @version      3.3
// @author       Blu ft. Salama ft. MYTH_doglover
// @description  Why is this legal?
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        GM_xmlhttpRequest

// @namespace https://greasyfork.org/users/747730
// @downloadURL https://update.greasyfork.org/scripts/435189/Bonkshitter.user.js
// @updateURL https://update.greasyfork.org/scripts/435189/Bonkshitter.meta.js
// ==/UserScript==

// This userscript is a nasty orgy of a bunch of Bonk stuff.

//Thanks to Salama for getting this to work!



//Shortcut Color Change

var keys = {}
function handleKeyPress(evt) {
  let { keyCode, type } = evt || Event; // to deal with IE
  let isKeyDown = (type == 'keydown');
  keys[keyCode] = isKeyDown;

    //Shift + 6 for ffa
  if(isKeyDown && keys[16] && keys[54]){
    document.getElementById("newbonklobby_ffabutton").click();
  }
 //Shift + 7 for red
  else if(isKeyDown && keys[16] && keys[55]){
    document.getElementById("newbonklobby_redbutton").click();
  }
  else if(isKeyDown && keys[16] && keys[56]){
    document.getElementById("newbonklobby_bluebutton").click();
  }
  //Shift + 9 for yellow
  else if(isKeyDown && keys[16] && keys[57]){
    document.getElementById("newbonklobby_yellowbutton").click();
  }
      //Shift + 0 for green
  else if(isKeyDown && keys[16] && keys[48]){
    document.getElementById("newbonklobby_greenbutton").click();
  }
};

window.addEventListener("keyup", handleKeyPress);
window.addEventListener("keydown", handleKeyPress);


//Replay Speed

let replayspeed = document.getElementById('bgreplay_timescrub');
replayspeed.max = 100;
replayspeed.value = 5;




//Injector Start

const injectorName = `Bonkshitter`;
const errorMsg = `Poops! ${injectorName} was comfortable to toad.
This may be poo to an resizement to Bonkio.com. If so, please don't report this error!
This could also be because you have an extension that is in cahoots with \
${injectorName}`;

function injector(src){
	let newSrc = src;

    //allow No Gravity to be selected
	newSrc=newSrc.replace('[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),',NOGRAVITY_MODE);
    newSrc=newSrc.replace('P1R[43][P1R[7][551]][S9L.C1E(116)]={lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097),forceTeams:true,forceTeamCount:2,editorCanTarget:false};', NGMODE_METADATA);

    //add classic rules to NoGravity
    newSrc=newSrc.replace('if(O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "v"', 'if(O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "v" || O7R[0][4][O7R[8][118]] == "ng"');
    newSrc=newSrc.replace('O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "bs"', 'O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "bs" || O7R[0][4][O7R[8][118]] == "ng"');

    //add gravity effect
    newSrc=newSrc.replace('"v"){;}',NOGRAVITY_GAME);


//Moonwalk Start

//allow Moonwalk to be selected

    //allow Moonwalk to be selected
	newSrc=newSrc.replace('[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),',MOONWALK_MODE);
    newSrc=newSrc.replace('P1R[43][P1R[7][551]][S9L.C1E(116)]={lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097),forceTeams:true,forceTeamCount:2,editorCanTarget:false};', MOONWALK_MODE_METADATA);

    //add classic rules to Moonwalk
    newSrc=newSrc.replace('if(O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "v"', 'if(O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "v" || O7R[0][4][O7R[8][118]] == "mw"');
    newSrc=newSrc.replace('O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "bs"', 'O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "bs" || O7R[0][4][O7R[8][118]] == "mw"');

    //add gravity effect
    newSrc=newSrc.replace('"v"){;}',MOONWALK_GAME);

//Moonwalk Stop



//Host Tools Start

    //Remove round limit
	document.getElementById('newbonklobby_roundsinput').removeAttribute("maxlength");
	newSrc = newSrc.replace(/...\[[0-9]\]\[[0-9]\]\[...\[[0-9]\]\[[0-9]?[0-9]?[0-9]\]\]=Math\[...\[[0-9]\]\[[0-9]?[0-9]?[0-9]\]\]\(Math\[...\[[0-9]\]\[[0-9]?[0-9]?[0-9]\]\]\(1,...\[[0-9]\]\[[0-9]\]\[...\[[0-9]\]\[[0-9]?[0-9]?[0-9]\]\]\),9\);/, '');



    //Balance all
newSrc = newSrc.replace('t7V[6][t7V[3][645]]()', 't7V[6][t7V[3][645]]() || t7V[6] === "*" || t7V[7][0] == "/balanceall"');
newSrc = newSrc.replace('t7V[7][0] == S9L.W1E(1868)', 't7V[7][0] == S9L.W1E(1868) || t7V[7][0] == "/balanceall"');
newSrc = newSrc.replace('t7V[67]=t7V[97];break;', BALANCE_SELECTION);
newSrc = newSrc.replace('parseInt(t7V[7][2]);', 'parseInt(t7V[7][t7V[7][0] == "/balanceall" ? 1 : 2]);')
newSrc = newSrc.replace('if(t7V[95] == 0)', BALANCE_ALL_MESSAGE);

newSrc = newSrc.replace('if(t7V[7][0] == S9L.W1E(1868', CUSTOM_COMMANDS+'else if(t7V[7][0] == S9L.W1E(1868');
newSrc = newSrc.replace('j0V[69][t7V[3][644]](S9L.W1E(1896),S9L.C1E(1870),false);', 'j0V[69][t7V[3][644]](S9L.W1E(1896),S9L.C1E(1870),false);j0V[69][t7V[3][644]]("/hhelp - commands from host extension",S9L.C1E(1870),false);');

//Disable teams when switching modes
newSrc = newSrc.replace('G7p[0][2][m7p[4][702]]=S9L.W1E(116);', 'G7p[0][2][m7p[4][702]]=S9L.W1E(116);this.autoForcedTeams=!G7p[0][2][m7p[4][114]];');
newSrc = newSrc.replace('G7p[1][m7p[4][663]]();', 'G7p[1][m7p[4][663]]();'+AUTO_NO_TEAMS);


//Host Tools Stop



//Simple stuff

    newSrc=newSrc.replace('[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),',SIMPLE_MODE);
	newSrc=newSrc.replace('P1R[43][P1R[7][551]][S9L.C1E(1187)]={lobbyName:S9L.W1E(2088),gameStartName:S9L.W1E(2089),lobbyDescription:S9L.W1E(2090),tutorialTitle:S9L.W1E(2091),tutorialText:S9L.C1E(2092),forceTeams:false,forceTeamCount:null,editorCanTarget:false};', MAP_EDITOR_SIMPLE);

//Simple done


//VarTOL Start



// Add the VTOL movement code
  newSrc = newSrc.replace('"v"){;}', VARTOL_GAME);

  // Allow VarTOL to be selected
	newSrc=newSrc.replace('[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),', VARTOL_MODE);
	newSrc=newSrc.replace('P1R[43][P1R[7][551]][S9L.C1E(116)]={lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097),forceTeams:true,forceTeamCount:2,editorCanTarget:false};', MODE_METADATA2);

  // register outline, bow, and jetpack graphics
  newSrc = newSrc.replace('this[S5p[4][149]][S5p[4][118]] == S9L.C1E(1131)', 'this[S5p[4][149]][S5p[4][118]] == S9L.C1E(1131) || this[S5p[4][149]][S5p[4][118]] == "var"');
  newSrc = newSrc.replace('this[S5p[4][149]][S5p[4][118]] == S9L.W1E(1131)', 'this[S5p[4][149]][S5p[4][118]] == S9L.W1E(1131) || this[S5p[4][149]][S5p[4][118]] == "var"');
	newSrc = newSrc.replace('build(D2i,h2i) {',RENDER_JETPACK2);

  // Attempt to add var in same places as ar
  // recover cooldown a1a +8 to 1000
  newSrc = newSrc.replace(`&& (O7R[0][4][O7R[8][118]] == "ar" ||`,`&& (O7R[0][4][O7R[8][118]] == "ar" || O7R[0][4][O7R[8][118]] == "var" ||`);
  // arrow direction and charge
  newSrc = newSrc.replace(`if(O7R[0][4][O7R[8][118]] == "ar" ||`, `if(O7R[0][4][O7R[8][118]] == "ar" || O7R[0][4][O7R[8][118]] == "var" ||`);
  // doArrows
  newSrc = newSrc.replace(`this[t1C[149]][t1C[118]] == "ar"`, `this[t1C[149]][t1C[118]] == "ar" || this[t1C[149]][t1C[118]] == "var"`);
  // start with half arrow charge
  newSrc = newSrc.replace(`I1R[0][5][I1R[6][118]] == S9L.W1E(1130)`, `I1R[0][5][I1R[6][118]] == S9L.W1E(1130) || I1R[0][5][I1R[6][118]] == "var"`);
  // movement (DONT NEED: movement already taken care of in VARTOL_GAME)
  // newSrc = newSrc.replace('&& O7R[5][O7R[956]][O7R[8][189]] == 0){', '&& O7R[5][O7R[956]][O7R[8][189]] == 0 || O7R[0][4][O7R[8][118]] == "var" && O7R[5][O7R[956]][O7R[8][189]] == 0){');

  // Attempt to add var in same places as v
  // body rotation true
  newSrc = newSrc.replace(`if(O7R[0][4][O7R[8][118]] == "v"){O7R[10][O7R[8][198]]=false;`, `if(O7R[0][4][O7R[8][118]] == "v" || O7R[0][4][O7R[8][118]] == "var"){O7R[10][O7R[8][198]]=false;`);
  // vtolwing physics
  newSrc = newSrc.replace(`){O7R[48]=new P1R[22]();`, `|| O7R[0][4][O7R[8][118]] == "var"){O7R[48]=new P1R[22]();`);
  // ??? draw rects but not called :/
  newSrc = newSrc.replace(`if(B1V[0][3][B1V[3][118]] == S9L.C1E(62)){B`, `if(B1V[0][3][B1V[3][118]] == S9L.C1E(62) || B1V[0][3][B1V[3][118]] == "var"){debugger; B`);
  // ??? idek
  newSrc = newSrc.replace(`B1V[0][3][B1V[3][118]] == S9L.C1E(62)){f`, `B1V[0][3][B1V[3][118]] == S9L.C1E(62) || B1V[0][3][B1V[3][118]] == "var"){f`);

  // Account for body rotation when firing
  newSrc = newSrc.replace(`O7R[5][O7R[956]][O7R[8][190]] *`, ARROW_COMPENSATION);



//VarTOL Stop



//VTOL stuff
newSrc=newSrc.replace('"v"){;}',VTOL);
newSrc=newSrc.replace('S9L.W1E(116)];',VTOL_MODE);
newSrc=newSrc.replace('build(D2i,h2i) {',RENDER_JETPACK);
newSrc=newSrc.replace('P1R[43][P1R[7][551]][S9L.W1E(62)]={lobbyName:S9L.C1E(2070),gameStartName:S9L.W1E(2070),lobbyDescription:S9L.W1E(2071),tutorialTitle:S9L.C1E(2072),tutorialText:S9L.C1E(2073),forceTeams:false,forceTeamCount:null,editorCanTarget:false};', MAP_EDITOR_VTOL);
newSrc=newSrc.replace('function w8I(){', END_GAME);	console.log("Bonk VTOL injector run");
//VTOL done



    //Death Grapple Start
    newSrc=newSrc.replace('S9L.W1E(116)];','"dsp",S9L.W1E(116)];');
newSrc=newSrc.replace('O7R[5][O7R[956]][O7R[8][288]]=O7R[72][O7R[8][264]](O7R[15]);', 'O7R[5][O7R[956]][O7R[8][288]]=O7R[72][O7R[8][264]](O7R[15]);' + THE_THING);
newSrc=newSrc.replace('this[O5p[7][1570]][O5p[7][477]](2 * this[O5p[7][1511]],0xcccccc,0.5);', MODIFIED_GRAPPLE);
newSrc=newSrc.replace('P1R[43][P1R[7][551]][S9L.C1E(1131)]={lobbyName:S9L.W1E(2083),gameStartName:S9L.C1E(2084),lobbyDescription:S9L.C1E(2085),tutorialTitle:S9L.W1E(2086),tutorialText:S9L.C1E(2087),forceTeams:false,forceTeamCount:null,editorCanTarget:true};', MODE_INFO);

newSrc=newSrc.replaceAll('O7R[0][4][O7R[8][118]] == "sp"', '(O7R[0][4][O7R[8][118]] == "sp" || O7R[0][4][O7R[8][118]] == "dsp")');
newSrc=newSrc.replace('this[t1C[149]][t1C[118]] == "sp"', 'this[t1C[149]][t1C[118]] == "sp" || this[t1C[149]][t1C[118]] == "dsp"');
newSrc=newSrc.replaceAll('B1V[0][3][B1V[3][118]] == S9L.C1E(1132)', '(B1V[0][3][B1V[3][118]] == S9L.C1E(1132) || B1V[0][3][B1V[3][118]] == "dsp")');
newSrc=newSrc.replace('this[S5p[4][149]][S5p[4][118]] == S9L.C1E(1132)', '(this[S5p[4][149]][S5p[4][118]] == S9L.C1E(1132) || this[S5p[4][149]][S5p[4][118]] == "dsp")');

newSrc=newSrc.replace('this[t1C[1588]](f0M,w0M,t0M,K2M);', 'this[t1C[1588]](f0M,w0M,t0M,K2M,this[t1C[149]][t1C[118]]);');
newSrc=newSrc.replace('doGrapple(I6i,U6i,R6i,z6i)', 'doGrapple(I6i,U6i,R6i,z6i,mode)');


    //Death Grapple Done

//Soccer Start

newSrc=newSrc.replace('lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097)', 'lobbyName:"Soccer",gameStartName:"SOCCER",lobbyDescription:"Soccer, not football!",tutorialTitle:"Soccer Mode",tutorialText:S9L.W1E(2097)');


//Soccer Done



//Spiderman Start

newSrc=newSrc.replace('lobbyName:S9L.W1E(2074),gameStartName:S9L.C1E(2075),lobbyDescription:S9L.W1E(2076),tutorialTitle:S9L.W1E(2077),tutorialText:S9L.C1E(2078)', 'lobbyName:"Spiderman",gameStartName:"SPIDERMAN",lobbyDescription:"Spiderman, Spiderman! Does whatever a spider can!",tutorialTitle:"Spiderman Mode",tutorialText:S9L.C1E(2078)');

//Spiderman Done


//? Start

//newSrc=newSrc.replace('lobbyName:S9L.C1E(2070),gameStartName:S9L.W1E(2070),lobbyDescription:S9L.W1E(2071),tutorialTitle:S9L.C1E(2072),tutorialText:S9L.C1E(2073)', 'lobbyName:"test",gameStartName:"SPIDERMAN",lobbyDescription:"Spiderman, Spiderman! Does whatever a spider can!",tutorialTitle:"Spiderman Mode",tutorialText:S9L.C1E(2078)');

//? Done


//Archery Start

newSrc=newSrc.replace('lobbyName:S9L.W1E(2079),gameStartName:S9L.W1E(1734),lobbyDescription:S9L.W1E(2080),tutorialTitle:S9L.C1E(2081),tutorialText:S9L.W1E(2082)', 'lobbyName:"Archery",gameStartName:"ARCHERY",lobbyDescription:"Hawkeye moment",tutorialTitle:"Archery Mode",tutorialText:S9L.W1E(2082)');

//Archery Done


//? Start

newSrc=newSrc.replace('lobbyName:S9L.W1E(2083),gameStartName:S9L.C1E(2084),lobbyDescription:S9L.C1E(2085),tutorialTitle:S9L.W1E(2086),tutorialText:S9L.C1E(2087),tutorialText:S9L.C1E(2073)', 'lobbyName:"test",gameStartName:"SPIDERMAN",lobbyDescription:"Spiderman, Spiderman! Does whatever a spider can!",tutorialTitle:"Spiderman Mode",tutorialText:S9L.C1E(2087),tutorialText:S9L.C1E(2073)');

//? Done

//? Start

newSrc=newSrc.replace('lobbyName:S9L.W1E(2088),gameStartName:S9L.W1E(2089),lobbyDescription:S9L.W1E(2090),tutorialTitle:S9L.W1E(2091),tutorialText:S9L.C1E(2092)', 'lobbyName:"Shit",gameStartName:"SHIT",lobbyDescription:"Nob mode only!",tutorialTitle:"Shit Mode",tutorialText:S9L.C1E(2092)');

//? Done


//? Start

newSrc=newSrc.replace('lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097)', 'lobbyName:"Shit",gameStartName:"SHIT",lobbyDescription:"Nob mode only!",tutorialTitle:"Shit Mode",tutorialText:S9L.W1E(2097)');

//? Done


	if(src === newSrc) throw "Injection failed!";
	console.log(injectorName+" injector run");
	return newSrc;
}







// Adds NOGRAVITY to mode selection button
const NOGRAVITY_MODE= `[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),"ng",`;
//add NOGRAVITY metadata
const NGMODE_METADATA= `P1R[43][P1R[7][551]][S9L.C1E(116)]={lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097),forceTeams:true,forceTeamCount:2,editorCanTarget:false}; P1R[43][P1R[7][551]]["ng"] = {lobbyName:"No Gravity",gameStartName:"NO GRAVITY",lobbyDescription:"Bonk without gravity!",tutorialTitle:"No Gravity Mode",tutorialText:"•Move with the arrow keys\\r\\n•Hold X to make yourself heavier",forceTeams:false,forceTeamCount:null,editorCanTarget:false};`;


const NOGRAVITY_GAME = `"v"){;} if (O7R[0][4][O7R[8][118]] == "ng"){

//change gravity function
if(O7R[72][O7R[8][177]]()[O7R[8][40]] != 0){O7R[72][O7R[8][178]](new P1R[2](0,0));;}

                          }`;
//No Gravity Stop

//Moonwalk Start

// Adds Moonwalk to mode selection button
const MOONWALK_MODE= `[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),"mw",`;
//add Moonwalk metadata
const MOONWALK_MODE_METADATA= `P1R[43][P1R[7][551]][S9L.C1E(116)]={lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097),forceTeams:true,forceTeamCount:2,editorCanTarget:false}; P1R[43][P1R[7][551]]["mw"] = {lobbyName:"Moonwalk",gameStartName:"MOONWALK",lobbyDescription:"Bonk with low gravity!",tutorialTitle:"Moonwalk Mode",tutorialText:"•Move with the arrow keys\\r\\n•Hold X to make yourself heavier",forceTeams:false,forceTeamCount:null,editorCanTarget:false};`;


const MOONWALK_GAME = `"v"){;} if (O7R[0][4][O7R[8][118]] == "mw"){

//change gravity function
if(O7R[72][O7R[8][177]]()[O7R[8][40]] != 10){O7R[72][O7R[8][178]](new P1R[2](0,10));;}

                          }`;

//Moonwalk Stop

//Host Tools Start


let CUSTOM_COMMANDS = `
if(t7V[7][0] == "/hhelp") {
	j0V[69][t7V[3][644]]("/balance * -100 to 100",S9L.C1E(1870),false);
	j0V[69][t7V[3][644]]("/balanceall -100 to 100",S9L.C1E(1870),false);
	j0V[69][t7V[3][644]]("/start",S9L.C1E(1870),false);
}
else if(t7V[7][0] == "/start") {
	document.getElementById("newbonklobby_startbutton").click();
}
`;

let BALANCE_ALL_MESSAGE = `
if(t7V[67] == -2) {
	j0V[69].showStatusMessage(S9L.C1E(1875) + "Everyone" + S9L.C1E(1877) + t7V[95], S9L.C1E(1870), false);
}
else if(t7V[95] == 0)
`;



let BALANCE_SELECTION = `

j0V[23].bal[t7V[97]] = t7V[95];
j0V[94][t7V[3][646]](t7V[97], t7V[95]);
if (j0V[69]) {
	j0V[69][t7V[3][647]]();
}
t7V[67]=-2;
if(j0V[44][t7V[97]][t7V[3][568]][t7V[3][645]]() == t7V[6][t7V[3][645]]()) {
t7V[67]=t7V[95];
break;
}
`;

let AUTO_NO_TEAMS = `
if(typeof(this) == "object" && this.autoForcedTeams && G7p[0][2].mo != S9L.C1E(116)) {
	this.autoForcedTeams = false;
	G7p[0][2][m7p[4][114]] = false;
	G7p[5][m7p[4][790]](G7p[0][2][m7p[4][702]],G7p[0][2][m7p[4][118]]);
	G7p[1][m7p[4][663]]();
	G7p[5][m7p[4][828]](G7p[0][2][m7p[4][114]]);
	G7p[1][m7p[4][647]]();
}`;



//Host Tools Stop




//ADD VTOL BELOW



let END_GAME=`
function w8I() {
	if(j0V[94]["hostID"] == j0V[94]["getLSID"]()) {
		j0V[94]["sendReturnToLobby"]();
	}
`;

let RENDER_JETPACK=`
build(D2i,h2i) {
	if(this["gameSettings"]["mo"]=="v") {
		this["VTOLWing"]=new PIXI["Graphics"]();
		this["VTOLWing"]["beginFill"](0xcccccc);
		this["VTOLWing"]["drawRect"](
			this["radius"]*(-V["footHW"]+V["footOffsetX"]),
			this["radius"]*(-V["footHH"]+V["footOffsetY"]),
			this["radius"]*(V["footHW"]*2),
			this["radius"]*(V["footHH"]*2)
		);
		this["VTOLWing"]["beginFill"](0xcccccc);
		this["VTOLWing"]["drawRect"](
			this["radius"]*(-V["footHW"]+-V["footOffsetX"]),
			this["radius"]*(-V["footHH"]+V["footOffsetY"]),
			this["radius"]*(V["footHW"]*2),
			this["radius"]*(V["footHH"]*2)
			);
		this["container"]["addChild"](this["VTOLWing"]);
	}`;

let VTOL_MODE=`"v",S9L.W1E(116)];` //Adds VTOL to mode selection button

let VTOL=`"v") {
	var O1B=[];
	O1B[11]=(-22/30)*O7R[445];
	O1B[791]=0.12;
	O1B[874]=new P1R[2](0,O1B[11]);
	O1B[874]=O7R[5][O7R[956]]["body"]["GetWorldVector"](O1B[874],O1B[874]);
	O1B[857]=new P1R[2](0,O1B[11]*O1B[791]);
	O1B[857]=O7R[5][O7R[956]]["body"]["GetWorldVector"](
		O1B[857],
		O1B[857]
	);
	O1B[347]=O7R[5][O7R[956]]["body"]["GetWorldPoint"](new P1R[2](
		V["footOffsetX"]*O7R[445],
		V["footOffsetY"]*O7R[445]
	));
	O1B[848]=O7R[5][O7R[956]]["body"]["GetWorldPoint"](new P1R[2](
		-V["footOffsetX"]*O7R[445],
		V["footOffsetY"]*O7R[445]
	));
	O1B[195]="none";
	if(O7R[0][1][O7R[956]]["up"]) {
		if(O7R[0][1][O7R[956]]["left"]) {
			O1B[195]="right";
		}
		else if(O7R[0][1][O7R[956]]["right"]) {
			O1B[195]="left";
		}
		else {
			O1B[195]="both";
		}
	}
	else if(O7R[0][1][O7R[956]]["left"] && O7R[0][1][O7R[956]]["right"]) {
		O1B[195]="both";
	}
	else if(O7R[0][1][O7R[956]]["left"]) {
		O1B[195]="right";
	}
	else if(O7R[0][1][O7R[956]]["right"]) {
		O1B[195]="left";
	}
	if(O1B[195]=="both") {
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[874],O1B[347]);
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[874],O1B[848]);
	}
	if(O1B[195]=="left") {
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[874],O1B[347]);
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[857],O1B[848]);
	}
	if(O1B[195]=="right") {
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[857],O1B[347]);
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[874],O1B[848]);
	}
}`;

let MAP_EDITOR_VTOL=`P1R[43][P1R[7][551]][S9L.W1E(62)]={lobbyName:S9L.C1E(2070),gameStartName:S9L.W1E(2070),lobbyDescription:S9L.W1E(2071),tutorialTitle:S9L.C1E(2072),tutorialText:S9L.C1E(2073),forceTeams:false,forceTeamCount:null,editorCanTarget:true};`;



//VTOL DONE




//Simple Start

// Adds Simple to mode selection button
let SIMPLE_MODE= `[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),"bs",`;
// Adds Simple to map editor "For mode:" selector
let MAP_EDITOR_SIMPLE= `P1R[43][P1R[7][551]][S9L.C1E(1187)]={lobbyName:S9L.W1E(2088),gameStartName:S9L.W1E(2089),lobbyDescription:S9L.W1E(2090),tutorialTitle:S9L.W1E(2091),tutorialText:S9L.C1E(2092),forceTeams:false,forceTeamCount:null,editorCanTarget:true};`;

//Simple Stop

//VarTOL Start

// Adds VarTOL to mode selection button
let VARTOL_MODE= `[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),"var",`;
// Adds VarTOL to bonk mode directory
let MODE_METADATA2= `P1R[43][P1R[7][551]][S9L.C1E(116)]={lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097),forceTeams:true,forceTeamCount:2,editorCanTarget:false}; P1R[43][P1R[7][551]]["var"] = {lobbyName:"VarTOL",gameStartName:"VARTOL",lobbyDescription:"VTOL and Arrows had a baby. And this baby knows how to rock.",tutorialTitle:"VarTOL Mode",tutorialText:"•Fly around with the arrow keys\\r\\n•Hold Z to draw an arrow\\r\\n•Hold X to make yourself heavier",forceTeams:false,forceTeamCount:null,editorCanTarget:false};`;
// Renders jetpack
let RENDER_JETPACK2=`
build(D2i,h2i) {
	var S5p=[arguments];
	S5p[4]=y3uu;
	if(this["gameSettings"]["mo"]=="var") {
		this["VTOLWing"]=new PIXI["Graphics"]();
		this["VTOLWing"]["beginFill"](0xff3030);
		this["VTOLWing"]["drawRect"](
			this["radius"]*(-V["footHW"]+V["footOffsetX"]),
			this["radius"]*(-V["footHH"]+V["footOffsetY"]),
			this["radius"]*(V["footHW"]*6),
			this["radius"]*(V["footHH"]*2)
		);
		this["container"]["addChild"](this["VTOLWing"]);
	}`;

let VARTOL_GAME = `"v"){;} if (O7R[0][4][O7R[8][118]] == "var"){
var O1B=[];
	O1B[11]=(-22/30)*O7R[445];
	O1B[791]=0.12;
	O1B[874]=new P1R[2](0,O1B[11]);
	O1B[874]=O7R[5][O7R[956]]["body"]["GetWorldVector"](O1B[874],O1B[874]);
	O1B[857]=new P1R[2](0,O1B[11]*O1B[791]);
	O1B[857]=O7R[5][O7R[956]]["body"]["GetWorldVector"](
		O1B[857],
		O1B[857]
	);
	O1B[347]=O7R[5][O7R[956]]["body"]["GetWorldPoint"](new P1R[2](
		V["footOffsetX"]*O7R[445],
		V["footOffsetY"]*O7R[445]
	));
	O1B[848]=O7R[5][O7R[956]]["body"]["GetWorldPoint"](new P1R[2](
		-V["footOffsetX"]*O7R[445],
		V["footOffsetY"]*O7R[445]
	));
	O1B[195]="none";
	if(O7R[0][1][O7R[956]]["up"]) {
		if(O7R[0][1][O7R[956]]["left"] && O7R[5][O7R[956]][O7R[8][189]] == 0) {
			O1B[195]="right";
		}
		else if(O7R[0][1][O7R[956]]["right"] && O7R[5][O7R[956]][O7R[8][189]] == 0) {
			O1B[195]="left";
		}
		else {
			O1B[195]="both";
		}
	}
	else if(O7R[0][1][O7R[956]]["left"] && O7R[0][1][O7R[956]]["right"] && O7R[5][O7R[956]][O7R[8][189]] == 0) {
		O1B[195]="both";
	}
	else if(O7R[0][1][O7R[956]]["left"] && O7R[5][O7R[956]][O7R[8][189]] == 0) {
		O1B[195]="right";
	}
	else if(O7R[0][1][O7R[956]]["right"] && O7R[5][O7R[956]][O7R[8][189]] == 0) {
		O1B[195]="left";
	}
	if(O1B[195]=="both") {
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[874],O1B[347]);
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[874],O1B[848]);
	}
	if(O1B[195]=="left") {
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[874],O1B[347]);
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[857],O1B[848]);
	}
	if(O1B[195]=="right") {
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[857],O1B[347]);
		O7R[5][O7R[956]]["body"]["ApplyImpulse"](O1B[874],O1B[848]);
	}
                          }`;
// Calculate player angle from rotation matrix and add to the arrow's angle
let ARROW_COMPENSATION = `(O7R[5][O7R[956]][O7R[8][190]] + (-Math.round(Math.atan2(O7R[5][O7R[956]]["body"]["m_xf"]["R"].col2.x, O7R[5][O7R[956]]["body"]["m_xf"]["R"].col1.x) * (180/Math.PI)))) *`;

//VarTOL Stop




//DEATH GRAPPLE START



let MODIFIED_GRAPPLE=`
if(mode == "sp") {
	this[O5p[7][1570]][O5p[7][477]](2 * this[O5p[7][1511]],0xcccccc,0.5);
}
else {
	var color;
	switch(O5p[0][0][O5p[7][41]][this[O5p[7][1105]]].team) {
		case 2:
			color = 0xff0000;
			break;
			case 3:
			color = 0x0000ff;
			break;
			case 4:
			color = 0x00ff00;
			break;
			case 5:
			color = 0xffff00;
			break;
		default:
			color = 0x000000;
			break;
	}
	this[O5p[7][1570]][O5p[7][477]](2 * this[O5p[7][1511]],color,1);
}
`;

let THE_THING=`
if(j6V.mo == "dsp") {
	let getDistance = (p1, p2) => {
		return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
	}
	let distToSegmentSquared = (circleCenter, circleRadius, segmentStart, segmentEnd) => {
		/*https://web.archive.org/web/20211104230620/https://www.emanueleferonato.com/2018/08/06/pure-mathematics-line-segment-vs-circle-collision-detection-along-with-html5-example/*/
		let l2 = getDistance(segmentStart, segmentEnd);
		let t = ((circleCenter.x - segmentStart.x) * (segmentEnd.x - segmentStart.x) + (circleCenter.y - segmentStart.y) * (segmentEnd.y - segmentStart.y)) / l2;
		t = Math.max(0, Math.min(1, t));
		let tX = segmentStart.x + t * (segmentEnd.x - segmentStart.x);
		let tY = segmentStart.y + t * (segmentEnd.y - segmentStart.y);
		let tPoint = {
			x: tX,
			y: tY
		}
		let distancePoint = {}
		distancePoint.x = Math.round(tX);
		distancePoint.y =  Math.round(tY);
		return getDistance(circleCenter, tPoint) < circleRadius * circleRadius;
	}
	for (let player of O7R[0][0].discs) {
		if(player == O7R[0][0].discs[O7R[956]] || player == undefined || (player.team > 1 && player.team == O7R[0][0].discs[O7R[956]].team )) continue;
		if(distToSegmentSquared(player, 1, O7R[0][0].discs[O7R[956]], O7R[294])) {
			O7R[5][O7R[0][0].discs.indexOf(player)].diedThisStep = 1;
		}
}
}`;

let MODE_INFO=`
P1R[43][P1R[7][551]][S9L.C1E(1131)]={lobbyName:S9L.W1E(2083),gameStartName:S9L.C1E(2084),lobbyDescription:S9L.C1E(2085),tutorialTitle:S9L.W1E(2086),tutorialText:S9L.C1E(2087),forceTeams:false,forceTeamCount:null,editorCanTarget:true};
P1R[43][P1R[7][551]]["dsp"]={
	lobbyName:"Death Grapple",
	gameStartName:"DEATH GRAPPLE",
	lobbyDescription:"You have rockets on either side of your player.\\nUse the up key to engage both jets, or left/right to only engage one.\\nHold Z to give your rockets a temporary boost.",
	tutorialTitle:S9L.C1E(2072),
	tutorialText:S9L.C1E(2073),
	forceTeams:false,
	forceTeamCount:null,
	editorCanTarget:false
};`;


//DEATH GRAPPLE STOP



const head = document.getElementsByTagName("head")[0];
head.appendChild = new Proxy(head.appendChild, {
    apply: async (target, thisArg, args) => {
        if (args[0] && args[0].src.includes("alpha2s.js")) {
            console.log("[Bonkshitter] Fetching alpha2s.js...")
            let src = await fetch(args[0].src).then(res => res.text())
            let newSrc=injector(src);

            //if(src === newSrc) throw "Injection failed!";
            // Remove the src attribute so it doesn't try to load the original script
            args[0].removeAttribute("src");
            // Add the new script to the <script>'s contents
            args[0].textContent = newSrc;

            console.log("[BONKSHITTER] Patched alpha2s.js")
        }
        return target.apply(thisArg, args);
    }
});


console.log(injectorName+" injector loaded");




//Some VTOL stuff

let VTOLquality = document.createElement('option');
VTOLquality.text = 'VTOL';
VTOLquality.value = 4;

document.getElementById('settings_graphicsquality').appendChild (VTOLquality);


document.getElementById('newswindow_topbar').innerHTML = 'VTOL will be back...';

document.getElementById('ingamecountdown_top').innerHTML = "VTOL will be back in";

document.getElementById("ingamecountdown_text").style.opacity = "0";


//Turn off Replay

let replaydelete = document.createElement("div");
replaydelete.classList.add("brownButton");
replaydelete.classList.add("brownButton_classic");
replaydelete.classList.add("buttonShadow");
replaydelete.innerHTML = "REPLAY OFF";

replaydelete.onclick = function () {
let myobj = document.getElementById("bgreplay");
myobj.remove();
}

let headthing = document.getElementById("settings_filterprofanity_label");
headthing.appendChild (replaydelete);




console.log("Bonkshitter complete!");