// ==UserScript==
// @name         Photographic
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Gudigno
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392714/Photographic.user.js
// @updateURL https://update.greasyfork.org/scripts/392714/Photographic.meta.js
// ==/UserScript==

(function() {
    'use strict';



var maping = new Array();



maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24553646848.jpg"] =	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24590200508.jpg"] =	[1,12,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-41489769671.jpg"] =	[1,4,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-23822193188.jpg"] =	[1,5,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-28788637827.jpg"] =	[1,5,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24559342207.jpg"] =	[1,10,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/e1jubz_overcloud1981.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/1pnvc6_adventurekid.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-38717041974.jpg"] =	[1,10,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/1g834t_heberstanton.jpg"] =	[2,7,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-25692747998.jpg"] =	[1,12,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24138758357.jpg"] =	[1,3,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24321213568.jpg"] =	[1,3,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24326577067.jpg"] =	[1,3,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-32242470038.jpg"] =	[1,3,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-43220383711.jpg"] =	[1,3,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma1/batch3/fl-13384656.jpg"] =	[2,2,2,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-40891015350.jpg"] =	[1,4,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24077004687.jpg"] =	[1,5,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-39962498645.jpg"] =	[1,5,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-42987744851.jpg"] =	[1,5,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-30274519638.jpg"] =	[2,2,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-30113817677.jpg"] =	[2,4,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-41051069894.jpg"] =	[2,6,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-29844951397.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-38418757705.jpg"] =	[2,7,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24553646848.jpg"] =	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-28662616928.jpg"] =	[2,9,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24725591377.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-40839381390.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/131ojd_lucasssoares01.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-43938217434.jpg"] =	[2,6,13,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/007sjd_overcloud1981.jpg"] =	[2,6,1,,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-28878225037.jpg"] =	[2,7,13,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/k875qh_90eyes.jpg"] =	[2,7,4,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-44057598415.jpg"] =	[2,8,3,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/1hsew6_photosbyaced.jpg"] =	[2,9,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/v0rmbi_yurakovalenko.jpg"] =	[2,5,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-29351438007.jpg"] =	[2,9,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-42215815045.jpg"] =	[2,2,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-40841071432.jpg"] =	[2,5,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24506029167.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-44133840921.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-38566295096.jpg"] =	[2,7,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-23971339247.jpg"] =	[2,8,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-23822193188.jpg"] =	[2,8,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-42028311401.jpg"] =	[2,8,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-42499948881.jpg"] =	[2,8,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24483621077.jpg"] =	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-41492469002.jpg"] =	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-41964301062.jpg"] =	[2,9,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-43089847472.jpg"] =	[2,9,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/0bhula_oierelo.jpg"] =	[2,9,2,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-28800855408.jpg"] =	[3,1,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-23962158707.jpg"] =	[3,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-30114881927.jpg"] =	[3,1,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-41704492191.jpg"] =	[3,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24494843627.jpg"] =	[3,8,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24483430887.jpg"] =	[3,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-28605526647.jpg"] =	[4,10,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/1ffyq0_legspinadi.jpg"] =	[2,7,3,1];
//maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/pf3fx1_snowhaze.jpg"] =	
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-28444979939.jpg"] =	[4,12,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-24694799177.jpg"] =	[4,2,2,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/28miof_manttek.jpg"] =	[4,5,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/0lczfb_cya.jpg"] =	[2,6,2,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/2htjry_alfann24.jpg"] = [2,6,1,2];
//maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-39909699041.jpg"] = 		
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/17k17a_overcloud1981.jpg"] =	[2,5,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma2/9bepoj_ramtinx.jpg"] =	[2,11,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-30137728018.jpg"] =	[1,11,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-41489769671.jpg"] =	[1,4,5,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-4740436471.jpg"] =	[1,12,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85280722.jpg"] =	[2,8,1,2];		
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-28964811268.jpg"] =	[2,7,1,2];	
//maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-30137728018.jpg"] =	
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85305091.jpg"] =	[2,2,1,1];
//maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85304599.jpg"] =	
//maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma1/batch3/fl-13384656.jpg"] = [2,2,2,2]
//maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85274649.jpg"] =	
//maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-42987744851.jpg"] =	
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-28605526647.jpg"] =	[4,10,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-22655390183.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-247217508.jpg"] =	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-3059365218.jpg"] =	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-4452471152.jpg"] =	[2,11,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-9736229819.jpg"] =	[2,8,3,2];	
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85288724.jpg"] = 	[2,6,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85309783.jpg"] =	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85278142.jpg"] =	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85300045.jpg"] =	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-5167175482.jpg"] =	[2,11,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85314819.jpg"] =	[2,8,1,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85270929.jpg"] = 	[2,8,5,2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-30114881927.jpg"] =	[3,1,1,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85309176.jpg"] =	[2,8,1,2];	
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85304737.jpg"] =	[2,8,4,1];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-8590368086.jpg"] =	[2,8,5,2];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-17574147221.jpg"] = [2,8,5,1];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85282199.jpg"] =  [2,4,5,1];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85274245.jpg"] =  [2, 5, 5, 1];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85294820.jpg"] =  [2,8,5,2];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=palma/fl2017-29844951397.jpg"] =  [2,6,1,2];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-85294820.jpg"] = [2,8,1,2];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-9492788663.jpg"] = [2, 2, 3, 1];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-8788471554.jpg"] = [3, 3, 5, 1];

maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl-6993826.jpg"] = [2, 9, 5, 2];
maping["https://lr9wwi2ifd.execute-api.us-west-2.amazonaws.com/api/f8-img-app?key=preg_as/fl2017-33177283351.jpg"] = [2, 8, 5, 2];
    var a = document.getElementsByClassName('cml jsawesome');
    var size_a =  a.length;

        for (var i = 0 ; i < size_a; i++) 
        {
        	var ImgAct = a[i].getElementsByTagName('img')[0].src;

        	if (maping[ImgAct] != null) 
        	{

        		var elemento = document.createElement("p");
                var contenido = document.createTextNode(" DONE ('-') ");
                elemento.appendChild(contenido);
                elemento.setAttribute("align","center");
                var prin_no = document.getElementsByClassName("cml jsawesome")
                [i].getElementsByTagName("img")[0].parentNode,
                first = document.getElementsByClassName("cml jsawesome")
                [i].getElementsByTagName("img")[0];
                prin_no.insertBefore(elemento,first);


        		//for (var j = 0; j < 3; j++) {
				var FirstValue  = maping[ImgAct][0] -1 ;
        		a[i].getElementsByClassName('radios logic-only-if cml_field')
        		[0].getElementsByClassName('cml_row')
        		[FirstValue].getElementsByTagName('input')[0].checked = 1;

        		var SecondValue = maping[ImgAct][1] -1 ;
				a[i].getElementsByClassName('radios logic-only-if cml_field')
        		[1].getElementsByClassName('cml_row')
        		[SecondValue].getElementsByTagName('input')[0].checked = 1;

        		var ThirdValue = maping[ImgAct][2] -1 ;
				a[i].getElementsByClassName('checkboxes logic-only-if cml_field')
				[0].getElementsByClassName('cml_row')
				[ThirdValue].getElementsByTagName('input')[0].checked = 1;

        		var ForthValue = maping[ImgAct][3] -1 ;
        		a[i].getElementsByClassName('radios logic-only-if cml_field')
        		[2].getElementsByClassName('cml_row')
        		[ForthValue].getElementsByTagName('input')[0].checked = 1;

        		}
        	}
    // Your code here...
})();