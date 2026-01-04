// ==UserScript==
// @name         Hiragana  and Katakana learning
// @namespace    https://github.com/AlekPet/
// @version      1.1
// @description  Teach the alphabet...
// @author       AlekPet
// @license     MIT;
// @match        http*://*/*
// @icon          https://raw.githubusercontent.com/AlekPet/Hiragana-and-Katakana-learning/master/assets/images/icon.png
// @run-at document-end
// @noframes
// @grant GM_addStyle
// @require https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/370166/Hiragana%20%20and%20Katakana%20learning.user.js
// @updateURL https://update.greasyfork.org/scripts/370166/Hiragana%20%20and%20Katakana%20learning.meta.js
// ==/UserScript==

/*
Hiragana  and Katakana learning
*/
GM_addStyle("\
	.main_pole_style{position:fixed; top: 5px; left: 5px;background: rgba(255,255,255,0.8);border:1px solid silver;padding:2px;display:none;z-index:1500;font: small arial,sans-serif;margin: 0; line-height: normal;}\
	.main_pole_style>p{text-align: center;}\
	.main_pole_style #panel{text-align:center; }\
	#panel input[type=\"number\"],#panel input[type=\"checkbox\"]{width: 30px;padding: 2px 2px;margin:3px 3px;}\
	#panel > select{    width: 170px;    padding: 6px 5px;    margin: 3px 21px;}\
	#panel input[type=\"button\"]{ display: inline-block;    position: relative;   vertical-align: middle;    min-height: 2.46153846em;    box-sizing: border-box;    font-weight: 400;    font-family: inherit;    line-height: 1;    text-align: center; border-radius: 2px;    border: 1px solid transparent;    cursor: pointer;   color: #FFF;  background-color: #0095ff;  border-color: #07c;    box-shadow: inset 0 1px 0 #66bfff;transition: all .1s ease-in;}\
	#panel input[type=\"button\"]:hover{ color: rgba(255,255,255,0.9);    background-color: #07c;    border-color: #005999;    box-shadow: inset 0 1px 0 #3af;}\
	#paper table{border:2px solid black;padding:18px 18px;text-align:center;display: table; border-collapse: separate;border-spacing: 2px;border-color: grey;}\
	.pansimv > td{width:88px;padding:18px 18px;display: table-cell;vertical-align: inherit; border: 1px solid black;}\
	.pansimvotv{font-size:18pt;background:yellow;}\
	#h_k_learn_button{position:fixed;top:14px;left:14px;background: linear-gradient(rgba(42, 42, 111, 0.8),rgba(0, 255, 255, 0.8));color: rgba(255,255,255,0.8);padding: 5px;border: 1px solid rgba(255,255,255,0.8);box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); cursor: pointer;border-radius:3px;font: bold 9pt monospace;z-index:1600;}\
	#h_k_learn_button:active {background: linear-gradient(rgba(42, 42, 111, 0.8),rgba(255, 0, 177, 0.8));}\
	#h_k_learn_button:hover {background: linear-gradient(rgba(6, 6, 90, 0.8),rgba(36, 255, 255, 0.8));};\
");

(function() {
    'use strict';
var HiraganaAndKatakana  = {
    lng_select:function(){
		this.lang_sel = {
			otveti_ru:"а,и,у,э,о,ка,ки,ку,кэ,ко,са,си,су,сэ,со,та,ти,цу,тэ,то,на,ни,ну,нэ,но,ха,хи,фу,хэ,хо,ма,ми,му,мэ,мо,я,ю,йо,ра,ри,ру,рэ,ро,ва,н,о(пад.)",
			otveti_en:"a,i,u,e,o,ka,ki,ku,ke,ko,sa,shi,su,se,so,ta,chi,tsu,te,to,na,ni,nu,ne,no,ha,hi,fu,he,ho,ma,mi,mu,me,mo,ya,yu,yo,ra,ri,ru,re,ro,wa,n,wo",
			selected_lang: "",
			ru : {
				sel_all: "Все",
				sel_ryad: "Ряд ",
				upd_b: "Обновить",
				upd_tim_s: "Обн.в.сек.",
				otveti: "Ответы",
				vis_otv: "Показать ответы?",
				button_lrn: "Начать изучение..."
			},
			en : {
				sel_all: "All",
				sel_ryad: "Row ",
				upd_b: "Refresh",
				upd_tim_s: "Update per sec.",
				otveti: "Answer",
				vis_otv: "Show answers?",
				button_lrn: "Begin learn..."                
			},
		};

    var langu = (navigator.language !== null && navigator.language!=="")?navigator.language:"en-US";
        langu = langu.replace(/-RU|-EN|-US/i,"");

		if(langu == "ru"){
			this.otveti=this.lang_sel.otveti_ru;	
		}else if(langu == "en") {
			this.otveti=this.lang_sel.otveti_en;
		}else {
			this.otveti=this.lang_sel.otveti_en;
		}
        this.lang_sel.selected_lang=langu;	
        
},
	inst: function (){
		this.bukvih="あ,い,う,え,お,か,き,く,け,こ,さ,し,す,せ,そ,た,ち,つ,て,と,な,に,ぬ,ね,の,は,ひ,ふ,へ,ほ,ま,み,む,め,も,や,ゆ,よ,ら,り,る,れ,ろ,わ,ん,を";
		this.bukvik="ア,イ,ウ,エ,オ,カ,キ,ク,ケ,コ,サ,シ,ス,セ,ソ,タ,チ,ツ,テ,ト,ナ,ニ,ヌ,ネ,ノ,ハ,ヒ,フ,ヘ,ホ,マ,ミ,ム,メ,モ,ヤ,ユ,ヨ,ラ,リ,ル,レ,ロ,ワ,ン,ヲ";

	    var langu = this.lang_sel.selected_lang;	
		this.paper=document.getElementById("paper");
		this.paper.innerHTML="";

		if(!this.panel){
			this.panel=document.getElementById("panel");

			this.sel=document.createElement("select");
			this.inp=document.createElement("input");
			this.inp.type="number";
			this.inp.value="5";
			this.inp.size="3";

			this.inpref=document.createElement("input");
			this.inpref.type="button";
			this.inpref.value=this.lang_sel[langu].upd_b;
			this.inpref.onclick=HiraganaAndKatakana.refresh;

			this.spanel=document.createElement("span");
			this.spanel.innerHTML=" Hiragana";

			this.inpch=document.createElement("input");
			this.inpch.type="checkbox";
			this.inpch.value="0";
			this.inpch.onclick=HiraganaAndKatakana.smena;

//Timer/
			this.tiel=document.createElement("span");
			this.tiel.innerHTML=" | Timer:";

			this.tich=document.createElement("input");
			this.tich.type="checkbox";
			this.tich.value="0";
			this.tich.onclick=HiraganaAndKatakana.trefresh;

			this.tielo=document.createElement("span");
			this.tielo.innerHTML=" | "+this.lang_sel[langu].upd_tim_s;
            
			this.tieloi=document.createElement("input");
      			this.tieloi.type="number";
			this.tieloi.value="2";
			this.tieloi.size="3";            

// ответы
			this.otvtext=document.createElement("span");
			this.otvtext.innerHTML=" | "+this.lang_sel[langu].otveti;

			this.otvch=document.createElement("input");
			this.otvch.type="checkbox";
			this.otvch.value="0";
			this.otvch.checked=true;

			this.otvch.onclick = HiraganaAndKatakana.refresh;
      }

this.arbuk=this.bukvih.split(",");
this.arot=this.otveti.split(",");

for(var i=0;i<11;i++){
	this.opt=document.createElement("option");
	this.opt.value=i;
	var selv="";
	switch(i){
		case 8:selv=this.arot[5*i-5]+" "+this.arot[5*i-4]+" "+this.arot[5*i-3];
		break;
		case 9:selv=this.arot[5*i-7]+" "+this.arot[5*i-6]+" "+this.arot[5*i-5]+" "+this.arot[5*i-4]+" "+this.arot[5*i-3];
		break;
		case 10:selv=this.arot[43]+" "+this.arot[44]+" "+this.arot[45];
		break;
		default:selv=this.arot[5*i-5]+" "+this.arot[5*i-4]+" "+this.arot[5*i-3]+" "+this.arot[5*i-2]+" "+this.arot[5*i-1];
	}

	this.opt.innerHTML=(i===0)?this.lang_sel[langu].sel_all:this.lang_sel[langu].sel_ryad+i+" : "+selv;
	this.sel.appendChild(this.opt);
}
	this.sel.onchange=function (){
	HiraganaAndKatakana.refresh();
};

	this.panel.appendChild(this.inpref);

	this.panel.appendChild(this.sel);
	this.panel.appendChild(this.inp);

// Смена азбук
	this.panel.appendChild(this.spanel);
	this.panel.appendChild(this.inpch);

// Показ. ответов
	this.panel.appendChild(this.otvtext);
	this.panel.appendChild(this.otvch);

//  Вставка таймера
	this.panel.appendChild(this.tiel);
	this.panel.appendChild(this.tich);
	this.panel.appendChild(this.tielo);
	this.panel.appendChild(this.tieloi);

	HiraganaAndKatakana.refresh();
},

rnd: function (z){
	var bukvr=0;
	if(z===0) {
		bukvr=Math.floor(Math.random()*this.arbuk.length);
	}
	else {
		if(z==8){
			bukvr=Math.floor(Math.random()*(37-35+1)+35);
		}else if(z==10){
			bukvr=Math.floor(Math.random()*(45-43+1)+43);
		}else if(z==9){
			bukvr=Math.floor(Math.random()*(42-38+1)+38);
		}else{
			bukvr=Math.floor(Math.random()*(5*z-(5*z-5)))+(5*z-5);
		}
	}
	return bukvr;
},

refresh: function (){
	var me=HiraganaAndKatakana;
	var sel=Number(me.sel.value) || 0;
	me.kol=Number(me.inp.value) || 5;
	me.otv="";
	me.paper.innerHTML="";
	var htmlparse="<table><tr class='pansimv'>";

	for(var i=0;i<me.kol;i++){
		var rndb=HiraganaAndKatakana.rnd(sel);
		me.otv+=me.arot[rndb]+" \n";
		htmlparse+="<td>"+me.arbuk[rndb]+"</td>";
	}
	if(me.otvch.checked){
		htmlparse+="</tr><tr class='pansimvotv'>";
		var splot=me.otv.split(" \n");
		for(i=0;i<me.kol;i++){
		htmlparse+="<td>"+splot[i]+"</td>";
		}
	}

	htmlparse+="</tr></table>";
	me.paper.innerHTML=htmlparse;
},
otvet:function (){
	if(confirm(this.lang_sel[this.lang_sel.selected_lang].vis_otv))alert(this.otv);
},
smena: function(){
	var me=HiraganaAndKatakana;
	if(me.inpch.checked){
		me.arbuk=me.bukvik.split(",");
		me.spanel.innerHTML=" Katakana";
	} else {
		me.arbuk=me.bukvih.split(",");
		me.spanel.innerHTML=" Haragana";
	}
	HiraganaAndKatakana.refresh();
},
trefresh:function(){
	var me=HiraganaAndKatakana;
	if(me.tich.checked) {
		HiraganaAndKatakana.refresh();
		me.tieloi.disabled=true;
		me.sT=setInterval(HiraganaAndKatakana.refresh,(Number(me.tieloi.value) || 2)*1000);
	}
	else {
		clearInterval(me.sT);
		me.tieloi.disabled=false;
	}
},
start_function:function(){ //  start_function - start      
    HiraganaAndKatakana.lng_select();    
    this.main_panel_body = document.createElement("div");
    
    var learn_button = document.createElement("div");
    learn_button.id = "h_k_learn_button";
    learn_button.innerText=HiraganaAndKatakana.lang_sel[HiraganaAndKatakana.lang_sel.selected_lang].button_lrn;
    this.main_panel_body.appendChild(learn_button);
    
    this.main_pole = document.createElement("div");
    this.main_pole.className="main_pole_style";
    this.main_pole.innerHTML='<p>Learning Hiragana And Katakana:</p><div id="paper" style="padding:5px 5px;font-size:88pt" onclick="HiraganaAndKatakana.otvet()"></div><div id="panel" style="padding: 5px 5px;"></div>';    
    //document.body.appendChild(this.main_pole);
    this.main_panel_body.appendChild(this.main_pole);    
    document.body.appendChild(this.main_panel_body);
    
    $(learn_button).click(function(){
        $(".main_pole_style").fadeToggle(1000,function(){
            learn_button.innerText=(learn_button.innerText!="X")?"X":HiraganaAndKatakana.lang_sel[HiraganaAndKatakana.lang_sel.selected_lang].button_lrn;
        });
        if(!HiraganaAndKatakana.panel)HiraganaAndKatakana.inst();
    });   
} //  start_function - end  
};
 

HiraganaAndKatakana.start_function();  
    
})();
