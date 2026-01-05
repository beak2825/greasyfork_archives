// ==UserScript==
// @name        Move to Gym/Hotel
// @description ID: 847056
// @include     http://*.popmundo.com/World/Popmundo.aspx/Characte*
// @include     https://*.popmundo.com/World/Popmundo.aspx/Characte*
// @version     1.0.2
// @grant       none
// @namespace https://greasyfork.org/users/87193
// @downloadURL https://update.greasyfork.org/scripts/25716/Move%20to%20GymHotel.user.js
// @updateURL https://update.greasyfork.org/scripts/25716/Move%20to%20GymHotel.meta.js
// ==/UserScript==

var tmpGym = 0;
var tmpHotel = 0;

//Calc world fame media
jQuery("a[href^='/World/Popmundo.aspx/City/']")
.each(function()
{
	//media value;
	var tmpVal = jQuery(this).text();
		switch(tmpVal)
	{
		case "Amsterdã": tmpGym = 30224; tmpHotel = 1629929; break;
		case "Ankara": tmpGym = 554492; tmpHotel = 1470773; break;
		case "Antália": tmpGym = 2820144; tmpHotel = 2831497; break;
		case "Baku": tmpGym = 2512830; tmpHotel = 2530592; break;
		case "Barcelona": tmpGym = 1445827; tmpHotel = 1388561; break;
		case "Belgrado": tmpGym = 1057314; tmpHotel = 705438; break;
		case "Berlim": tmpGym = 41576; tmpHotel = 1266716; break;
		case "Bruxelas": tmpGym = 2894040; tmpHotel = 588006; break;
		case "Bucareste": tmpGym = 774490; tmpHotel = 1069091; break;
		case "Budapeste": tmpGym = 679892; tmpHotel = 2882073; break;
		case "Buenos Aires": tmpGym = 3141984; tmpHotel = 3148554; break;
		case "Chicago": tmpGym = 2818639; tmpHotel = 3020930; break;
		case "Cidade do México": tmpGym = 496625; tmpHotel = 170833; break;
		case "Cingapura": tmpGym = 2336004; tmpHotel = 478955; break;
		case "Copenhague": tmpGym = 68059; tmpHotel = 2896402; break;
		case "Dubrovnik": tmpGym = 399552; tmpHotel = 208036; break;
		case "Estocolmo": tmpGym = 2981808; tmpHotel = 63504; break;
		case "Glasgow": tmpGym = 664404; tmpHotel = 2779392; break;
		case "Helsinque": tmpGym = 3142866; tmpHotel = 3067677; break;
		case "Istambul": tmpGym = 191703; tmpHotel = 145843; break;
		case "Izmir": tmpGym = 3152514; tmpHotel = 783730; break;
		case "Jacarta": tmpGym = 2366691; tmpHotel = 2436264; break;
		case "Joanesburgo": tmpGym = 1846428; tmpHotel = 1911681; break;
		case "Kiev": tmpGym = 2434921; tmpHotel = 2462399; break;
		case "Londres": tmpGym = 26104; tmpHotel = 185095; break;
		case "Los Angeles": tmpGym = 3110547; tmpHotel = 3158065; break;
		case "Madri": tmpGym = 287998; tmpHotel = 697923; break;
		case "Manila": tmpGym = 3142960; tmpHotel = 3081054; break;
		case "Melbourne": tmpGym = 503620; tmpHotel = 3060383; break;
		case "Milão": tmpGym = 1890983; tmpHotel = 2086923; break;
		case "Montreal": tmpGym = 495817; tmpHotel = 1982834; break;
		case "Moscou": tmpGym = 834337; tmpHotel = 3142776; break;
		case "Nashville": tmpGym = 29436; tmpHotel = 307404; break;
		case "Nova Iorque": tmpGym = 1501045; tmpHotel = 224800; break;
		case "Paris": tmpGym = 50645; tmpHotel = 203535; break;
		case "Porto": tmpGym = 1167958; tmpHotel = 3120334; break;
		case "Rio de Janeiro": tmpGym = 130914; tmpHotel = 104871; break;
		case "Roma": tmpGym = 107752; tmpHotel = 216945; break;
		case "São Paulo": tmpGym = 1066120; tmpHotel = 462381; break;
		case "Sarajevo": tmpGym = 1254444; tmpHotel = 2806352; break;
		case "Seattle": tmpGym = 1353594; tmpHotel = 3127427; break;
		case "Sofia": tmpGym = 1963789; tmpHotel = 2052012; break;
		case "Tallinn": tmpGym = 2757734; tmpHotel = 3132596; break;
		case "Tóquio": tmpGym = 3046879; tmpHotel = 3055327; break;
		case "Toronto": tmpGym = 3142742; tmpHotel = 2812302; break;
		case "Tromsø": tmpGym = 107289; tmpHotel = 226300; break;
		case "Varsóvia": tmpGym = 3142735; tmpHotel = 848840; break;
		case "Vilnius": tmpGym = 2391809; tmpHotel = 2821133; break;
		case "Xangai": tmpGym = 725817; tmpHotel = 3182413; break;
	}
});

//Add line to pharagraph
jQuery("p:first")
.after(function()
{
	var tmpVal = '<a title="Move to Gym" href="/World/Popmundo.aspx/Locale/MoveToLocale/'+tmpGym+'"><img src="http://i.imgur.com/uvi6G0V.png"></a>  <a title="Move to Hotel" href="/World/Popmundo.aspx/Locale/MoveToLocale/'+tmpHotel+'"><img src="http://i.imgur.com/BrkFter.png"></a>';
	jQuery(this).append(tmpVal);
});