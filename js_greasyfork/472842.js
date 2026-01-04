// ==UserScript==
// @name Alarm_sound_nebenan
// @description Alarm_sound_nebenan: Auf der Seite "nebenan.de" wird, falls gewünscht, bei Posteingang ein Sound abgespielt.
// @version 1.0
// @author Hans
// @match https://nebenan.de/*
// @namespace    http://tampermonkey.net/
// @icon
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/472842/Alarm_sound_nebenan.user.js
// @updateURL https://update.greasyfork.org/scripts/472842/Alarm_sound_nebenan.meta.js
// ==/UserScript==
//@match *://*/*
// [1] skip all iframe
if (window.self != window.top) {
   // return;
}
//===============================================================================
// add style
//===============================================================================
function addStyle(css) {
    var head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
        var style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    } // end if
} // end of function
// add css
function shareCSS() {
    var s = "";
    s = ".DIV_obenrechts {  position: fixed;  top: 55px; right: 10px; width: 120px; height: 40px;   border: 2px solid #000;"+
		"		border-radius: 10px;  background-color: grey; opacity: 0.9; padding: 2px;" +
		"		box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.922) 3px 7px 18px;}	" +
        ".DIV_obenrechts:hover{   width: 205px; height: 425px;   box-shadow:  0px 0px 38px darkgreen,  0px 0px 18px green;}" +

        ".radio_Lable { font: 12px Arial, sans-serif; font-weight: 800;  font-style: italic; color: #fff; }" +

		".radio_div{ position: relative; top: 0px; left:5px;  margin-top: 40px;   " +
        "      	box-shadow: rgba(0, 0, 0, 0.35) 1px 3px 5px; font: 10px Arial, sans-serif; font-weight:900; border-radius: 8px;"+
		"  		background-color: white;  color: black;}" +
        ".radio_div:hover{  cursor: pointer;}" +

		"#KOPFZEILE{ position: fixed; right:10px; height:30px; width: 120px; border: 0px solid #000;}"+

		"#OPTIONEN{ display:none; margin-top: 40px; background-color: #aaa;}"+
		"#OPTIONEN_innen{margin-left:10px; "+
        "}"+
        ".CBX{ width: 18px; height: 18px; font: 10px; " +
        "      box-shadow: rgba(0, 0, 0, 0.35) 1px 3px 5px; font-weight:900; border-radius: 8px;  background-color: white;  color: black;}" +
        ".CBX:checked{    background-color: #fff;    color: #000;}" +
        ".CBX:hover{  cursor: pointer;}" +

		".btn {height: 30px;}"+
		".btn:link,.btn:visited {text-decoration: none;"+
		"	padding: 0px 0px;"+
		"	display: inline-block;position: relative; border-radius: 10px;    border: 1px solid #000;"+
		"	background:linear-gradient(#666, #ddd);" +
		"	background-color: grey;color:black;box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);}"+
		".btn:hover {background-color: green;box-shadow: 0 10px 20px rgba(0, 0, 0, 0.9);"+
		"			 background: linear-gradient(#ddd, #666);" +
		"			}"+
		".btn:active {background-color: red;}"+



		".btn_allg {height: 30px; color:black;}"+

		".btn_allg:link,.btn:visited {text-decoration: none;"+
		"	padding: 0px 0px;"+
		"	display: inline-block;position: relative; border-radius: 10px;    border: 1px solid #000;"+
		"	background:linear-gradient(#666, #ddd);" +
		"	background-color: grey;color:black;box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);}"+
		".btn_allg:hover {background-color: green;box-shadow: 0 10px 20px rgba(0, 0, 0, 0.9);"+
		"			      background: linear-gradient(#ddd, #666);" +
		"			}"+
		".btn_allg:active { color: red;	background: linear-gradient(#666, #eee);}"+



        "#LBL{ font: 14px Arial, sans-serif; font-weight: 800;    color: #000; }"+

		"#LBL_Play{position: relative;  margin-top: -1px;  font-family:Arial; font-weight: 800;  	font-size:36px;	padding:2px 0px;}"+

		".HR1{margin-left: 5px;  margin-right: 5px;  border: 1px solid black;  box-shadow: rgba(0, 0, 0, 0.9) 1px 1px 5px; }"+


        		"#VELOSITY {background-color: green;box-shadow: 0 10px 20px rgba(0, 0, 0, 0.9);"+
		"    -webkit-appearance: none;  appearance: none;" +


		"	height: 4px;		border-radius: 10px;      background: linear-gradient(#ddd, #666);" +

		"			}"+



		"" +
		"" +
		"" +
		"" +
		" ";
    // append
    addStyle("" + s);
}
//===============================================================================
const Button_anim_STR = '<div class="loader"><div class="justify-content-center jimu-primary-loading"></div></div>';
const Button_play_STR = '<p id="LBL_Play"> &blacktriangleright; </p>';
//===============================================================================
// main
//===============================================================================
function create_HTML() {
    // add css
    shareCSS();
    const div_A = document.createElement("div");
    div_A.setAttribute("id", "move_DIV");
    div_A.setAttribute("class", "DIV_obenrechts");
	div_A.innerHTML =
        '' +
        '	<div style=" margin-top: 5px; height: 0px;"></div>' +
		'	<div id="KOPFZEILE">'+
        '		<label id="LBL" >&nbsp;Alarm on&nbsp;&nbsp;</label>' +
        '		<lable id="CBX" class="CBX" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</lable>' +
        '	</div>'+



        '	<div id="OPTIONEN" >' +
			'	<div id="OPTIONEN_innen" >' +
			'		<label class="radio_Lable" >&nbsp;Ton</label><BR>' +
			'		<label class="radio_div" id="radio_div_0" name="radio_div"></label><label id="LBL" >&nbsp;&nbsp;sin</label><br>' +
			'		<label class="radio_div" id="radio_div_1" name="radio_div"></label><label id="LBL" >&nbsp;&nbsp;square</label><br>' +
			'		<label class="radio_div" id="radio_div_2" name="radio_div"></label><label id="LBL" >&nbsp;&nbsp;sawtooth</label><br>' +
			'		<label class="radio_div" id="radio_div_3" name="radio_div"></label><label id="LBL" >&nbsp;&nbsp;triangle</label><br>' +
			'		<hr class="HR1">'+
			'		<label class="radio_Lable">&nbsp;Melody</label><BR>' +
			'		<label class="radio_div" id="radio_div_Melody_0" name="radio_div_Melody"></label><label id="LBL" >&nbsp;&nbsp;Entchen</label><br>' +
			'		<label class="radio_div" id="radio_div_Melody_1" name="radio_div_Melody"></label><label id="LBL" >&nbsp;&nbsp;die Gedanken</label><br>' +
			'		<label class="radio_div" id="radio_div_Melody_2" name="radio_div_Melody"></label><label id="LBL" >&nbsp;&nbsp;Melody 2</label><br>' +
			'		<hr class="HR1">'+
			'		<label id="LBL" class="_radio_Lable" style="top: -12px; ">&nbsp; Velos: &nbsp;</label>' +
			'		<input type="range" id="VELOSITY" step="0.1" min="0" max="2" value="1" style=" width:100px;">'+
			'		<hr class="HR1">'+
			'		<label id="LBL" >&nbsp;play Melody:</label>' +
			'       <a id="play_B" href="#" class="btn" style="height: 25px; width: 25px;" >'+Button_play_STR +'		</a>'+
			'		<hr class="HR1">'+
			'		<label id="LBL" >&nbsp;Save</label>' +
			'   	<a id="save_local" href="#" class="btn_allg"  style="height: 25px; width: 45px;" >&nbsp;save</a>'+

			'<hr class="HR1">'+


			'<br>'+
			'<br>'+
			''+
			'	</div>'+
        '	</div>'+
		''+
		''
		;
    document.body.appendChild(div_A);
    //-----------------------------
    // add event click
    //-----------------------------
    document.getElementById("save_local").addEventListener("click", save_local_storage);

    document.getElementById("save_local").addEventListener("click", save_local_storage);
    document.getElementById("play_B").addEventListener("mousedown", Play_Button);
    document.getElementById("play_B").addEventListener("mouseup", Stop_Button);
    document.getElementById("CBX").addEventListener("click", Check_Aktion);
    document.getElementById("move_DIV").addEventListener("mouseover", display_DIV_over);
    document.getElementById("move_DIV").addEventListener("mouseout", display_DIV_out);
    //-----------------------------
}
//===============================================================================
//===============================================================================
function save_local_storage() {
	localStorage.setItem("waveforme", Get_Radio_Checked_ind("radio_div"));
	localStorage.setItem("Melody", Get_Radio_Checked_ind("radio_div_Melody"));
	localStorage.setItem("VELOSITY", document.getElementById("VELOSITY").value);
    	location.reload(true);
}
function load_local_storage() {
	var IND = localStorage.getItem("waveforme");
	if (IND != null){
		Set_Radio_Checked("radio_div",IND);
		waveform	= WF_Tab[IND];
	}
	IND = localStorage.getItem("Melody");
	if (IND != null){

		Set_Radio_Checked("radio_div_Melody",IND);

		Melody = structuredClone(Melody_Tab[IND]);
		Melody_Init();
	}
	IND = localStorage.getItem("VELOSITY");
	if (IND != null){

		document.getElementById("VELOSITY").value = IND;
	}
}
//===============================================================================
//===============================================================================
function Play_Button() {
        //this.innerHTML = "&blacksquare;";
        this.innerHTML = Button_anim_STR;

		StopMelody();
		playMelody();
}
function Stop_Button() {
//        this.innerHTML = "&blacktriangleright;";
        this.innerHTML = Button_play_STR;
		StopMelody();
		StopMelody();
		StopMelody();
		StopMelody();
}
//===============================================================================
function Toggle_Button() {
	var X = this.innerHTML;
	if (X == LEER_RD )
	{// check
		X = CHKed;
		StopMelody();
		playMelody();
	}
	else
	{// uncheck
		X = LEER_RD;
		StopMelody();
	}
	this.innerHTML = X;
}
//===============================================================================
//===============================================================================
function display_DIV_over(){
	var L = document.getElementById("OPTIONEN");
	L.style.display = "block";
	//L.style.height = "10px";
}
function display_DIV_out(){
	var L = document.getElementById("OPTIONEN");
	L.style.display = "none";
}
//===============================================================================
var LEER = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
var LEER_RD = "&nbsp;&nbsp;&nbsp;&nbsp;";
var CHKed = "&nbsp;&check;&nbsp;";
const WF_Tab = ["sine","square","sawtooth","triangle"]
var waveform = "";
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function Init_Radio_DIVs(Gruppe) {
	const Radio_DIVs = document.getElementsByName(Gruppe);
    for (let i = 0; i < Radio_DIVs.length; i++) {
        Radio_DIVs[i].addEventListener("click", Check_Aktion_Div);
        Radio_DIVs[i].innerHTML = LEER_RD;
    }
	Radio_DIVs[0].innerHTML = CHKed;
}
function Get_Radio_Checked_ind(Gruppe) {
	const Radio_DIVs = document.getElementsByName(Gruppe);
    for (let i = 0; i < Radio_DIVs.length; i++) {
		if (Radio_DIVs[i].innerHTML != LEER_RD){	return i; }
    }
}
function Set_Radio_Checked(Gruppe,i) {
	const Radio_DIVs = document.getElementsByName(Gruppe);
    for (let i = 0; i < Radio_DIVs.length; i++) {Radio_DIVs[i].innerHTML = LEER_RD; }
	Radio_DIVs[i].innerHTML = CHKed;
}
//===============================================================================
//===============================================================================
//---------------------------
//---------------------------
function Check_Aktion_Div() {
    var Name = this.id.substr(0,this.id.length-2);
	var IND = this.id.substr(-1);
	const Radio_DIVs = document.getElementsByName(Name);
	for (let i = 0; i < Radio_DIVs.length; i++) {
		Radio_DIVs[i].innerHTML = LEER_RD;
	}
    this.innerHTML = CHKed;
	//-----------------------------
	//-----------------------------
	if (Name == "radio_div"){
		waveform	= WF_Tab[IND];
	}
	//-----------------------------
	//-----------------------------
	if (Name == "radio_div_Melody"){
		Melody = structuredClone(Melody_Tab[IND]);
		Melody_Init();
	}
	//-----------------------------
	//-----------------------------
}
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//===============================================================================
var AC_A=new AudioContext()
function beep(vol, freq, duration){
  var OC_1 = AC_A.createOscillator()
  var GAIN = AC_A.createGain()
  OC_1.connect(GAIN)
  OC_1.frequency.value=freq
  OC_1.type=waveform;
  GAIN.connect(AC_A.destination)
  GAIN.gain.value=vol*0.01
  OC_1.start(AC_A.currentTime)
  OC_1.stop(AC_A.currentTime+duration*0.001)
}
//===============================================================================
//===============================================================================
//===============================================================================
// var myWindow = null;
function Check_Aktion() {

	var X = document.getElementById("CBX").innerHTML;
	if (X == LEER )
	{// check
		X = CHKed;
		document.getElementById("move_DIV").style.background = "#b88";
	}
	else
	{// uncheck

		StopMelody();
		X = LEER;
		document.getElementById("move_DIV").style.background = "grey";
	}
	document.getElementById("CBX").innerHTML = X;
}
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
function check_POST() {
    var X = document.getElementById("CBX").innerHTML;
    if (X > LEER )
	{		// check
        //--------------------------------------------------------------
        //--------------------------------------------------------------
        const ems = document.getElementsByTagName("li");
        for (let i = 0; i < ems.length; i++)
        {
            var STR = ems[i].innerHTML; // li - Postfach
            var pos = STR.search('<i class="ui-iconbox-mark-green"></i>');
            if (pos > 0)
            {
				//==================================================
				//==================== ALARM =======================
				//==================================================
//myWindow.blur();
//myWindow.document.write("<p>check_POST</p>");
//myWindow.resizeTo(0,0);
//myWindow.moveTo(300,200);
//		myWindow.focus();

//				window.confirm("sometext");
//				window.focus();
//				setTimeout(function(){window.focus();},1000);
//				if(PopUp_Window != ""){PopUp_Window.close();alert();};


//PopUp_Window = window.open("https://nebenan.de/messages", "", "width=200,height=100");
//PopUp_Window.focus();


				StopMelody();
				playMelody();

//                alert("=== Post ist eingegangen ! ==="+i);
				//==================================================
                break;
            }
			else
			{
//                alert("=== keine Post ist eingegangen ! ==="+i);
			}
        }// end for
    } //end if
    setTimeout (check_POST,5000);
    //--------------------------------------------------------------
    //--------------------------------------------------------------
}
//--------------------------------------------------------------//===============================================================================
//===============================================================================
//===============================================================================
//=================================================================================
var context = null;
var oscillator = null;
function getOrCreateContext() {
//  if (!context) {
    context = new AudioContext();
    oscillator = context.createOscillator();
    oscillator.connect(context.destination);
//  }
  return context;
}
//=================================================================================
function StopMelody() {
	if (oscillator!=null){
		oscillator.stop();
		//oscillator=null;
	}
}
function playMelody() {

const eps = 0.001;

		//Velos
	var Velos = document.getElementById("VELOSITY").value;
	//Melody[z][1] = Melody[z][1] * Velos;


	getOrCreateContext();
	oscillator.start(0);
	oscillator.type = waveform;
	var time = context.currentTime + eps;
	Melody.forEach(note => {
		const freq = note[0];

		oscillator.frequency.setTargetAtTime(0, time - eps, 0.001);
		oscillator.frequency.setTargetAtTime(freq, time, 0.001);
		time += (note[1]* Velos) / 1000;
	});
	setTimeout(StopMelody, time * 1000);
}
//=================================================================================
//=================================================================================
const Noten =[
["C0",16.351598],["C#0",17.323914],["D0",18.354048],["D#0",19.445436],["E0",20.601722],["F0",21.826764],["F#0",23.124651],["G0",24.499715],["G#0",25.956544],["A0",27.500000],["A#0",29.135235],["H0",30.867706],
["C1",32.703196],["C#1",34.647829],["D1",36.708096],["D#1",38.890873],["E1",41.203445],["F1",43.653529],["F#1",46.249303],["G1",48.999429],["G#1",51.913087],["A1",55.000000],["A#1",58.270470],["H1",61.735413],
["C2",65.406391],["C#2",69.295658],["D2",73.416192],["D#2",77.781746],["E2",82.406889],["F2",87.307058],["F#2",92.498606],["G2",97.998859],["G#2",103.826174],["A2",110.000000],["A#2",116.540940],["H2",123.470825],
["C3",130.812783],["C#3",138.591315],["D3",146.832384],["D#3",155.563492],["E3",164.813778],["F3",174.614116],["F#3",184.997211],["G3",195.997718],["G#3",207.652349],["A3",220.000000],["A#3",233.081881],["H3",246.941651],
["C4",261.625565],["C#4",277.182631],["D4",293.664768],["D#4",311.126984],["E4",329.627557],["F4",349.228231],["F#4",369.994423],["G4",391.995436],["G#4",415.304698],["A4",440.000000],["A#4",466.163762],["H4",493.883301],
["C5",523.251131],["C#5",554.365262],["D5",587.329536],["D#5",622.253967],["E5",659.255114],["F5",698.456463],["F#5",739.988845],["G5",783.990872],["G#5",830.609395],["A5",880.000000],["A#5",932.327523],["H5",987.766603],
["C6",1046.502261],["C#6",1108.730524],["D6",1174.659072],["D#6",1244.507935],["E6",1318.510228],["F6",1396.912926],["F#6",1479.977691],["G6",1567.981744],["G#6",1661.218790],["A6",1760.000000],["A#6",1864.655046],["H6",1975.533205],
["C7",2093.004522],["C#7",2217.461048],["D7",2349.318143],["D#7",2489.015870],["E7",2637.020455],["F7",2793.825851],["F#7",2959.955382],["G7",3135.963488],["G#7",3322.437581],["A7",3520.000000],["A#7",3729.310092],["H7",3951.066410],
["C8",4186.009045],["C#8",4434.922096],["D8",4698.636287],["D#8",4978.031740],["E8",5274.040911],["F8",5587.651703],["F#8",5919.910763],["G8",6271.926976],["G#8",6644.875161],["A8",7040.000000],["A#8",7458.620184],["H8",7902.132820],
["C9",8372.018090],["C#9",8869.844191],["D9",9397.272573],["D#9",9956.063479],["E9",10548.081821],["F9",11175.303406],["F#9",11839.821527],["G9",12543.853951],["G#9",13289.750323],["A9",14080.000000],["A#9",14917.240369],["H9",15804.265640],
];
//=================================================================================
const Melody_0 = [
["C#5",300],["D5",300],["E5",300],["F5",300],["G5",600],["G5",600],
["A5",300],["A5",300],["A5",300],["A5",300],["G5",900],
["A5",300],["A5",300],["A5",300],["A5",300],["G5",900],
["F5",300],["F5",300],["F5",300],["F5",300],["E5",600],["E5",600],
["G5",300],["G5",300],["G5",300],["G5",300],["C5",900],
];
const Melody_1 = [["D5",300],["D5",300],["G5",600],["G5",600],["H5",300],["G5",300],["D5",1200],
["D5",600],["C5",600],["A4",600],["D5",600],["H4",600],["G4",600],
];
const Melody_2 = [
["G5",300],
["A5",300],
["H5",300],
["C6",600],
["H5",300],
["A5",600],
["G5",300],
["H5",600],
["G5",300],
["D5",600],
];

//--------------------------------------------------------
function Freq_zur_note(query){
	for(var z=0;z<Noten.length;z++){if(Noten[z].indexOf(query) !== -1){return Noten[z][1];  }	}
}
//--------------------------------------------------------
function Melody_Oktave_wechsel(O_pm){
	for(var z=0;z<Melody.length;z++){
		Melody[z][0] = Melody[z][0] * Math.pow(2, O_pm) ;
	}
}
//--------------------------------------------------------
function Melody_Init(){
	//alert(Velos);
	for(var z=0;z<Melody.length;z++){
		Melody[z][0] = Freq_zur_note(Melody[z][0]);
	}
	//alert(Melody);
}
//=================================================================================
//=======Button=anim===============================================================
//=================================================================================
function Button_anim_CSS() {
    var s = "";
    s = ""+
		".loader {position: relative;top: 12px;bottom: 0;left: 10px;right: 0; height:14px;}"+
		".jimu-primary-loading:before,.jimu-primary-loading:after {position: absolute;top: 0;content: '';}"+
		".jimu-primary-loading:before {left: -19.992px;}"+
		".jimu-primary-loading:after {left: 19.992px;-webkit-animation-delay: 0.32s !important;animation-delay: 0.32s !important;}"+
		".jimu-primary-loading:before,.jimu-primary-loading:after,.jimu-primary-loading {background: #076fe5;-webkit-animation: loading-keys-app-loading 0.8s infinite ease-in-out;animation: loading-keys-app-loading 0.8s infinite ease-in-out;width: 13.6px;height: 32px;}"+
		".jimu-primary-loading {text-indent: -9999em;margin: auto;position: absolute;-webkit-animation-delay: 0.16s !important;animation-delay: 0.16s !important;"+
		"zoom: 20%;}"+
		"@-webkit-keyframes loading-keys-app-loading {0%,80%,100% {opacity: .75;box-shadow: 0 0 #076fe5;height: 32px;}40% {opacity: 1;box-shadow: 0 -8px #076fe5;height: 40px;}}"+
		"@keyframes loading-keys-app-loading {0%,80%,100% {opacity: .75;box-shadow: 0 0 #076fe5;height: 32px;}40% {opacity: 1;box-shadow: 0 -8px #076fe5;height: 40px;}}"+
        "";
    addStyle("" + s);
}

Button_anim_CSS();
//=================================================================================
//=================================================================================
//=================================================================================//=================================================================================
//=================================================================================
create_HTML();

var Melody_Tab = [];
Melody_Tab[0] = structuredClone(Melody_0);
Melody_Tab[1] = structuredClone(Melody_1);
Melody_Tab[2] = structuredClone(Melody_2);
var Melody = [];
Melody = structuredClone(Melody_Tab[0]);


waveform = WF_Tab[0]; // sin

Melody_Init();

Init_Radio_DIVs("radio_div");
Init_Radio_DIVs("radio_div_Melody");

load_local_storage();

setTimeout (check_POST,18000);
