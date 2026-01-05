// ==UserScript==
// @version 1.6
// @name Librus Srednia
// @namespace https://greasyfork.org/pl/scripts/16170-librus-srednia/code/Librus%20Srednia.user.js
// @description Liczy srednia wazona na librusie
// @include https://synergia.librus.pl/przegladaj_oceny/uczen
// @author szonek
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/16170/Librus%20Srednia.user.js
// @updateURL https://update.greasyfork.org/scripts/16170/Librus%20Srednia.meta.js
// ==/UserScript==   


javascript:(function()
{
	var pole=document.getElementsByClassName('decorated stretch')[1].children[1];
	
	// pierwszy semestr
	for (var i=0;i<pole.children.length-2;i+=2)
	{
		pole.children[i].children[3].innerHTML="";
		pole.children[i].children[7].innerHTML="";
		var srednia=0;
		var sumawag=0;
		var srednia1=0;
		var sumawag1=0;
		for(var j=0; j<pole.children[i].children[2].children.length;j++)
		{
			
			var string=pole.children[i].children[2].children[j].children[0].getAttribute("title");
			if(string[string.search("Licz do średniej: ")+18]=="t")
			{
				var waga=parseInt(string.substr(string.search("Waga: ")+5));
				var ocena=pole.children[i].children[2].children[j].children[0].innerHTML;
				var liczba=parseInt(ocena);
				if(ocena[1]=="+") liczba+=0.5;
				else  if(ocena[1]=="-") liczba-=0.25;
				srednia+=liczba*waga;
				sumawag+=waga;
			}
		}
		if(!isNaN(srednia/sumawag))pole.children[i].children[3].innerHTML=Math.round(srednia/sumawag*100)/100;
		else pole.children[i].children[3].innerHTML="-";
		srednia=0;
		sumawag=0;

		for(var j=0; j<pole.children[i].children[6].children.length;j++)
		{
			
			var string1=pole.children[i].children[6].children[j].children[0].getAttribute("title");
			if(string1[string1.search("Licz do średniej: ")+18]=="t")
			{
				var waga1=parseInt(string1.substr(string1.search("Waga: ")+5));
				var ocena1=pole.children[i].children[6].children[j].children[0].innerHTML;
				var liczba1=parseInt(ocena1);
				if(ocena1[1]=="+") liczba1+=0.5;
				else  if(ocena1[1]=="-") liczba1-=0.25;
				srednia1+=liczba1*waga1;
				sumawag1+=waga1;
			}
		}
		if(!isNaN(srednia1/sumawag1))pole.children[i].children[7].innerHTML=Math.round(srednia1/sumawag1*100)/100;
		else pole.children[i].children[7].innerHTML="-";
		srednia1=0;
		sumawag1=0;
	}
	

	//koniec roku
	
	for (var i=0;i<pole.children.length-2;i+=2)
	{
		pole.children[i].children[9].innerHTML="";
		var a=parseFloat(pole.children[i].children[3].innerHTML);
		var b=parseFloat(pole.children[i].children[7].innerHTML);
		if(isNaN(a)&&isNaN(b)) pole.children[i].children[9].innerHTML="-";
		else if(isNaN(a)) pole.children[i].children[9].innerHTML=b;
		else if(isNaN(b)) pole.children[i].children[9].innerHTML=a;
                else pole.children[i].children[9].innerHTML=Math.round((a+b)*50)/100;
	}
})();