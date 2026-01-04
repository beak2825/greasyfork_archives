// ==UserScript==
// @name         PON KPD Calculator
// @namespace    1
// @version      0.12
// @description  Автоматический калькулятор КПД вещей PoN. Не считает параметры общего усиления, а так же физ. нин. и ген. резистов.
// @author       https:/pathofninja.ru/info_pl.php?pl=Нет
// @match        *://pathofninja.ru/game/game*
// @match        *://www.pathofninja.ru/game/game*
// @match        *://148.251.233.231/game/game*
// @match        *://178.63.14.254/game/game*
// @match        *://pon.fun/game/game*
// @match        *://www.pon.fun/game/game*
// @match        *://pathofninja.ru/item/*
// @match        *://www.pathofninja.ru/item/*
// @match        *://148.251.233.231/item/*
// @match        *://178.63.14.254/item/*
// @match        *://pon.fun/item/*
// @match        *://www.pon.fun/item/*
// @icon         http://mrshex.narod.ru/pon/qw.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375093/PON%20KPD%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/375093/PON%20KPD%20Calculator.meta.js
// ==/UserScript==
var bGreasemonkeyServiceDefined     = false;

try {
    if (typeof Components.interfaces.gmIGreasemonkeyService === "object") {
        bGreasemonkeyServiceDefined = true;
    }
}
catch (err) {
    //Ignore.
}

if ( typeof unsafeWindow === "undefined"  ||  ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
        var dummyElem   = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
}

window.$ = unsafeWindow.$;


unsafeWindow.make_prop = function(props,skills)
{

 	var i, j, temp;
 	var txt_props= [];
 	var txt_skills= [];
    var KPD='';



   for(i=0; i<props.length; i++)
   {
     if(props[i]!=0)
		 {
			 temp=props[i];

			 if(i==0) temp=temp[0]+" "+temp[1];
		 	 if(i==2 && props[i]=='0-0') continue;

			 if(temp>0 && i>1) temp='+'+temp;
		 	 if( (i>=16 && i<=20) || (i>=24 && i<=36) ) temp+='%';

		 	 txt_props.push(inv_prop[i]+': <b>'+temp+'</b>');
		 }
   }

   KPD='<br>KPD: <b>'+((Number(props[2].split('-')[0])+Number(props[2].split('-')[1]))/2+props[3]/2+props[4]+props[5]+props[6]+props[9]/10+props[10]/20+props[11]/10+props[12]/10+props[13]/10+props[14]/10)+'</b>';
   if (KPD=="<br>KPD: <b>0</b>") KPD='';


   for(i=0; i<skills.length; i++)
   {
		 temp=skills[i];

		 if(temp>0) temp='+'+temp;

     if(temp!=0) txt_skills.push(rus_skill[i]+': <b>'+temp+'</b>');
   }

   txt_props=txt_props.join('<br>');
   txt_skills=(txt_skills.length>0)? '<br>'+txt_skills.join('<br>') : '';

   return txt_props+txt_skills+KPD;

};


unsafeWindow.item_info2 = function(type, elem)
{
	var button='', html='';

	if(opt.length>0) {
		html+="<table class='tbl4'>";
		for(i=0; i<opt.length; i++) {
			if(type=='upgrade') button='<b>Общая стооооимость</b>: '+props[i][0][0]+' '+props[i][0][1]+' | <b>Стоимость апгрейда</b>: '+opt[i][0][1]+' '+props[i][0][1]+' ';
			html+=item_info_tbl(opt[i], props[i], skills[i], req_p[i], req_s[i], button, '');
		}
		html+="<table>";
	}
	document.getElementById("item").innerHTML = html;
};

unsafeWindow.CheckItemInfo = function (){
var  d1 = document.getElementById("item");
if (d1!=undefined) item_info2('upgrade', 'item');
};

document.addEventListener("onreadystatechange", CheckItemInfo ());