// ==UserScript==

// @name        Stickers RISK

// @description Ajoute des stickers RISK à JVC

// @author      Monarchisme

// @match       http://www.jeuxvideo.com/*

// @version			2.4

// @noframes

// @namespace https://greasyfork.org/users/62597
// @downloadURL https://update.greasyfork.org/scripts/24120/Stickers%20RISK.user.js
// @updateURL https://update.greasyfork.org/scripts/24120/Stickers%20RISK.meta.js
// ==/UserScript==


var isChrome = !!window.chrome && !!window.chrome.webstore;

if(isChrome){
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
}

unsafeWindow.add_txt = function(src){

	document.getElementById("message_topic").value += " "+src+" ";

};

function add_sticker(name,img_array){

	var tab = document.getElementsByClassName("jv-editor-toolbar")[0]

	var para = document.createElement("div");

	para.id = "sticker_"+name;

	para.innerHTML = name;

	para.style.margin = "4px";

	para.style.padding = "4px";

	para.style.cursor = "pointer";

	para.style.display = "inline-block";

	para.style.border = "1px solid #8A8A8A";

	para.style.borderRadius = "3px";

	tab.appendChild(para);

	para.addEventListener('click', function(event){ 

		var body = document.getElementsByClassName("f-stkrs")[0];

		body.innerHTML = "";

		for (var i = 0; i < img_array.length; i++) {

			body.innerHTML += '<div class="f-stkr-w"><div class="f-stkr f-no-sml"><span class="f-hlpr"></span><img onclick="add_txt(this.src)" src="'+img_array[i]+'" data-code=""></div></div>';

		}

	}, false);
	
};


add_sticker("RISK",["http://image.noelshack.com/fichiers/2016/41/1476390288-img-3957.jpg", "http://image.noelshack.com/fichiers/2016/41/1476390349-img-3958.jpg", "http://image.noelshack.com/fichiers/2016/41/1476390373-img-3959.jpg", "http://image.noelshack.com/fichiers/2016/41/1476388552-img-3942.jpg", "http://image.noelshack.com/fichiers/2016/41/1476388619-img-3943.jpg", "http://image.noelshack.com/fichiers/2016/41/1476388662-img-3951.jpg", "http://image.noelshack.com/fichiers/2016/41/1476388697-img-3950.jpg", "http://image.noelshack.com/fichiers/2016/41/1476388743-img-3949.jpg", "http://image.noelshack.com/fichiers/2016/41/1476389417-img-3952.jpg", "http://image.noelshack.com/fichiers/2016/41/1476392504-img-3963.jpg", "http://image.noelshack.com/fichiers/2016/41/1476392554-img-3964.jpg", "http://image.noelshack.com/fichiers/2016/41/1476393519-img-3971.jpg", "http://image.noelshack.com/fichiers/2016/41/1476393576-img-3972.jpg", "http://image.noelshack.com/fichiers/2016/41/1476393604-img-3973.jpg", "http://image.noelshack.com/fichiers/2016/41/1476423957-img-3977.jpg", "http://image.noelshack.com/fichiers/2016/41/1476424035-img-3979.jpg", "http://image.noelshack.com/fichiers/2016/41/1476424096-img-3980.jpg", "http://image.noelshack.com/fichiers/2016/41/1476424127-img-3981.jpg", "http://image.noelshack.com/fichiers/2016/41/1476424205-img-3978.jpg",  "http://image.noelshack.com/fichiers/2016/41/1476522922-img-3997.jpg", "http://image.noelshack.com/fichiers/2016/41/1476523142-img-3999.jpg", "http://image.noelshack.com/fichiers/2016/41/1476535986-img-4012.jpg", "http://image.noelshack.com/fichiers/2016/41/1476535961-img-4011.jpg", "http://image.noelshack.com/fichiers/2016/41/1476535485-img-4007.jpg", "http://image.noelshack.com/fichiers/2016/41/1476536616-img-4018.jpg", "http://image.noelshack.com/fichiers/2016/41/1476536560-img-4017.jpg", "http://image.noelshack.com/fichiers/2016/41/1476536639-img-4019.jpg",
"http://image.noelshack.com/fichiers/2016/31/1470494453-img2.png",
"http://image.noelshack.com/fichiers/2016/47/1480106058-img-4171.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480106124-img-4172.jpg", 
"http://image.noelshack.com/fichiers/2016/47/1480106165-img-4174.jpg", 
"http://image.noelshack.com/fichiers/2016/47/1480106948-img-4183.jpg", 
"http://image.noelshack.com/fichiers/2016/47/1480106995-img-4181.jpg", 
"http://image.noelshack.com/fichiers/2016/47/1480107027-img-4182.jpg", 
"http://image.noelshack.com/fichiers/2016/47/1480107067-img-4185.jpg", 
"http://image.noelshack.com/fichiers/2016/47/1480107100-img-4184.jpg", 
"http://image.noelshack.com/fichiers/2016/47/1480111617-img-4199.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480111655-img-4200.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480114265-img-4215.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480114834-img-4216.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480115081-img-4217.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480170405-stickeritalesinblack.png",
"http://image.noelshack.com/fichiers/2016/47/1480171146-guerrieritale.png",
"http://image.noelshack.com/fichiers/2016/47/1480172599-roxstaliser.png",
"http://image.noelshack.com/fichiers/2016/47/1480172609-roxstalvie.png",
"http://image.noelshack.com/fichiers/2016/47/1480173430-ratoxstalpsd.png",
"http://image.noelshack.com/fichiers/2016/47/1480173607-roxstalvie2.png",
"http://image.noelshack.com/fichiers/2016/47/1480174227-rayanamojito.png",
"http://image.noelshack.com/fichiers/2016/47/1480175969-boxe.png",
"http://image.noelshack.com/fichiers/2016/47/1480189180-ferveurdevl.png",
"http://image.noelshack.com/fichiers/2016/47/1480189195-mariagoulag.png",
"http://image.noelshack.com/fichiers/2016/47/1480189193-marialenina.png",
"http://image.noelshack.com/fichiers/2016/47/1480189188-uberquibande.png",
"http://image.noelshack.com/fichiers/2016/47/1480258694-img-4221.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480258780-img-4222.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480258830-img-4223.jpg",
"http://image.noelshack.com/fichiers/2016/48/1480788898-monalpha.png",
"http://image.noelshack.com/fichiers/2016/48/1480789573-daftritalei.png",
"http://image.noelshack.com/fichiers/2016/48/1480803148-ritaleandloves.png",
"http://image.noelshack.com/fichiers/2016/48/1480809698-triggereduber.png",
"http://image.noelshack.com/fichiers/2016/48/1480810125-triggeredvl.png",
"http://image.noelshack.com/fichiers/2016/48/1480810169-triggeredmona.png",
"http://image.noelshack.com/fichiers/2016/48/1480810470-triggeredrayyn.png",
"http://image.noelshack.com/fichiers/2016/48/1480810517-triggeredroxou.png",
"http://image.noelshack.com/fichiers/2016/48/1480811452-triggeredcouille.png",
"http://image.noelshack.com/fichiers/2016/48/1480811460-triggeredpan.png",
"http://image.noelshack.com/fichiers/2016/48/1480811458-triggeredsopa.png",
"http://image.noelshack.com/fichiers/2016/48/1480812464-uberalles.png",
"http://image.noelshack.com/fichiers/2016/48/1480812463-uberuberalles.png",
"http://image.noelshack.com/fichiers/2016/50/1481903416-monaetuber1.jpg",
"http://image.noelshack.com/fichiers/2016/50/1481903415-monaetuber2.jpg",
"http://image.noelshack.com/fichiers/2016/50/1481903415-monaetuber3.jpg",
"http://image.noelshack.com/fichiers/2016/50/1481662637-img-4516.jpg",
"http://image.noelshack.com/minis/2016/50/1481662781-img-4517.png",
"http://image.noelshack.com/fichiers/2016/50/1481906235-poltempsdeniaiser.jpg",


"http://image.noelshack.com/fichiers/2016/47/1480165792-damso1.png",
"http://image.noelshack.com/fichiers/2016/47/1480165783-damso2.png",
"http://image.noelshack.com/fichiers/2016/47/1480165796-damso3.png",
"http://image.noelshack.com/fichiers/2016/47/1480165811-damso4.png",
"http://image.noelshack.com/fichiers/2016/47/1480165779-damso5.png",
"http://image.noelshack.com/fichiers/2016/47/1480165808-damso6.png",
"http://image.noelshack.com/fichiers/2016/47/1480165793-damso7.png",
"http://image.noelshack.com/fichiers/2016/47/1480165807-damso8.png",
"http://image.noelshack.com/fichiers/2016/47/1480165806-damso9.png",
"http://image.noelshack.com/fichiers/2016/47/1480165987-vald1.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165987-vald10.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165986-vald11.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165985-vald12.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165992-vald13.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165985-vald14.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165998-vald15.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165994-vald2.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165997-vald3.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165999-vald4.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165995-vald5.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165998-vald6.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165999-vald7.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480165999-vald8.jpg",
"http://image.noelshack.com/fichiers/2016/47/1480166000-vald9.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074056-sticker-fillon1.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074041-sticker-fillon10.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074046-sticker-fillon11.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074055-sticker-fillon12.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074049-sticker-fillon13-5.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074045-sticker-fillon13.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074076-sticker-fillon14.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074066-sticker-fillon2.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074077-sticker-fillon3.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074103-sticker-fillon4-5.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074090-sticker-fillon4.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074087-sticker-fillon5.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074086-sticker-fillon6.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074106-sticker-fillon7.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074106-sticker-fillon8.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074106-sticker-fillon9-5.jpg",
"http://image.noelshack.com/fichiers/2016/50/1482074106-sticker-fillon9.jpg"]);
