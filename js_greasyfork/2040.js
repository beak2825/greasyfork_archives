// ==UserScript==
// @name		Mirkohelper
// @namespace		http://www.wykop.pl/ludzie/osael/
// @description		Niezbędnik każdego Mirka!
// @author		osael
// @version		2.2
// @grant		none
// @include		http://www.wykop.pl/mikroblog*
// @include		http://www.wykop.pl/wpis*
// @include		http://www.wykop.pl/tag*
// @include		http://www.wykop.pl/ludzie*
// @include		http://www.wykop.pl/dodatki*
// @include		http://www.wykop.pl/wiadomosc-prywatna*
// @include		http://www.wykop.pl/moj*
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/2040/Mirkohelper.user.js
// @updateURL https://update.greasyfork.org/scripts/2040/Mirkohelper.meta.js
// ==/UserScript==
//Bazowane na kilku innych dodatkach.
//To jest mój pierwszy skrypt. Powiedz jeżeli coś jest nie tak jak powinno lub mogłobyć zrobione lepiej.
//Podziekowania dla @Ginden oraz @kasper93.

//WERSJA TESTOWA POD NOWY WYPOK


function main() {

    
    //------------ TU SIE DEFINIUJEMY ---------------------
    //( ͡° ͜ʖ ͡°)
    var MirkoEmotki = [
		'( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)',
		'( \u0361\u00B0 \u0296\u032F \u0361\u00B0)',
		'( \u0361\u00BA \u035C\u0296\u0361\u00BA)',
		'( \u0361\u00B0( \u0361\u00B0 \u035C\u0296( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)\u0296 \u0361\u00B0) \u0361\u00B0)',
		'(\u2310 \u0361\u25A0 \u035C\u0296 \u0361\u25A0)',
		'(\u30FB\u3078\u30FB)',
		'\u10DA(\u0CA0_\u0CA0 \u10DA)',
		'(\u2565\uFE4F\u2565)',
        '(\u256F\uFE35\u2570,)',
		'( \u0361; \u0296\u032F \u0361;)',
        '( \u203E\u0296\u032B\u203E)',
		'(\u0298\u203F\u0298)',
		'(\uFF61\u25D5\u203F\u203F\u25D5\uFF61)',
		'\u1559(\u21C0\u2038\u21BC\u2036)\u1557',
		'\u1566(\u00F2_\u00F3\u02C7)\u1564',
		'(\u270C \uFF9F \u2200 \uFF9F)\u261E',
		't(\u30C4)_/\u00AF',
		'\u25D5\u203F\u25D5',
        '(\uFF9F\uFF70\uFF9F)',
        '(>\u10DA)',
		'\uFD3E\u0361\u0E4F\u032F\u0361\u0E4F\uFD3F',
		'\u0CA0_\u0CA0',
		'\u0628_\u0628',
        '\u30FD( \u035D\u00B0 \u035C\u0296\u0361\u00B0)\uFF89',
        '( \u0361\u00B0\u256D\u256E\u0361 \u00B0)',
		'\u0295\u2022\u1D25\u2022\u0294',
		'\u1D98\u1D52\u1D25\u1D52\u1D85',
		'(\u2312(oo)\u2312)',
		'\u113D\u1F41\u020D \u032A \u0151\u1F40\u113F'
	];
	//Emotki proponowne przez mirki na #mirkohelper
	var MirkoEmotkiUsr = [
		'( \u0361\u20AC \u035C\u0296 \u0361\u20AC)',
		'\u10DA(\u0301\u25C9\u25DE\u0C6A\u25DF\u25C9\u2035\u10DA)',
		'(\u3002\u30D8\u00B0)',
		'(\uFE36\uFE39\uFE3A)',
        '(\u2310 \u0361\u25A0 \u035F\u0296 \u0361\u25A0)',
		'(\u1D54\u1D25\u1D54)',        
		'(\u222A_\u222A)\uFF61\uFF61\uFF61zzz',
        '( \u0361~ \u035C\u0296 \u0361~) ',
		'\u30FD\u0F3C\u0E88\u0644\u035C\u0E88\u0F3D\uFF89',
		'(\u00AC\u203F\u00AC)',
		'(\uFF89\u00B4\u30EE\u00B4)\uFF89*:\uFF65\uFF9F\u2727',
		'\u30FE(\u2310\u25A0_\u25A0)\u30CE\u266A',
        '( \u02D8 \u00B3\u02D8)\u2665',
        '( \u0E07 \u0361\u00B0\u256D\u035C\u0296\u256E\u0361\u00B0 ) \u0E07',
        '(\u0E07 \u2022\u0300_\u2022\u0301)\u0E07 ',
        '( \u02D8\u25BD\u02D8)\u3063\u2668',
        '(\u0E07 \u0360\u00B0 \u035F\u0296 \u0361\u00B0)\u0E07',
        '(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B',
        '\u252C\u2500\u2500\u252C\u25E1\uFF89(\u00B0 -\u00B0\uFF89)'

	];

	var MirkoEmotkiBig = [
        '( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)\n( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)\uFF89\u2310\u25A0-\u25A0\n(\u2310 \u0361\u25A0 \u035C\u0296 \u0361\u25A0)',
        '\u252C\u2534\u252C\u2534\u2524 ( \u0361\u00B0 \u035C\u0296\u251C\u252C\u2534\u252C\u2534',
        '\u255A\u2550( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)\u2550\u255D\n\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n.\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n..\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n\u2026\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n\u2026\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n..\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n.\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n.\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n..\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n\u2026\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n\u2026\u255A\u2550(\u2588\u2588\u2588)\u2550\u255D\n\u2026..\u255A(\u2588\u2588\u2588)\u255D\n\u2026\u2026\u255A(\u2588\u2588)\u255D\n\u2026\u2026\u2026(\u2588)\n\u2026\u2026\u2026.*',
        '\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000 \u3000 \u2227__\u2227\n\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000 \u3000( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)\n\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u2282\u3000\u3000\u3064\n\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000(\u3064 \uFF89\n\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000 (\u30CE\n\u3000\u3000\u3000\u3000\u3000\uFF3C\u3000\u3000\u3000\u3000\u3000\u3000\u2606\n\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000|\u3000\u3000\u3000\u3000\u3000\u2606\n\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000(\u2312 \u2312\u30FD\u3000\u3000\u3000/\n\u3000\u3000\u3000\u3000\uFF3C\u3000\u3000\uFF08\u00B4\u2312\u3000\u3000\u2312\u3000\u3000\u2312\u30FE\u3000\u3000\u3000\uFF0F\n\u3000\u3000\u3000\u3000\u3000 \uFF08\u2019\u2312\u3000;\u3000\u2312\u3000\u3000\u3000::\u2312\u3000\u3000\uFF09\n\u3000\u3000\u3000\u3000\u3000\uFF08\u00B4\u3000\u3000\u3000\u3000\u3000\uFF09\u3000\u3000\u3000\u3000\u3000:::\u3000\uFF09\u3000\uFF0F\n\u3000\u3000\u2606\u2500\u3000\uFF08\u00B4\u2312;:\u3000\u3000\u3000\u3000::\u2312`\uFF09\u3000:;\u3000\u3000\uFF09\n\u3000\u3000\u3000\u3000\u3000\uFF08\u2312::\u3000\u3000\u3000::\u3000\u3000\u3000\u3000\u3000::\u2312\u3000\uFF09\n\u3000\u3000 \u3000\uFF0F\u3000\uFF08\u3000\u3000\u3000\u3000\u309D\u3000\u3000\u30FE\u3000\u4E36\u3000\u3000\u30BD\u3000\u2500',
        '\u2588\u25A0\u2588 \u2588 \u2580\u2588\u2580'
    ];
    var MirkoEmotkiBigDesc = [
        '(\u2310 \u0361\u25A0 \u035C\u0296 \u0361\u25A0)',
        '( \u0361\u00B0 \u035C\u0296\u251C\u252C',
        '\u255A\u2550( \u0361\u00B0 \u035C\u0296 \u0361\u00B0)\u2550\u255D',
        '( ͡° ͜ʖ ͡°)',
        'HIT'
    ];

	var MirkoSmieszki = '';
	var MirkoSmieszkiusr = '';
    var MirkoSmieszkiBig = [];
	//A tu kolor linkow. Potrzebne pod nocny/dzienny    
    var classColor = $('a.editlenny').css("color");
    
    //CSSki
    $("<style type='text/css'> .color			{ color:"+classColor+" !important;		} </style>").appendTo("head");
    $("<style type='text/css'> .mirkosmieszek	{ min-width: 30px; float: left; padding: 0 5px 0px 0px;} </style>").appendTo("head");
    $("<style type='text/css'> #mirkohelper		{ position: absolute; width: 500px; height: 85px; line-height: 21px !important; padding: 0px !important; min-height: 0px !important;		} </style>").appendTo("head");     
    $("<style type='text/css'> #mirki			{ text-align: justify; border: 0px !important; padding: 0px !important; margin: 4px; } </style>").appendTo("head"); 
    $("<style type='text/css'> #mirkiusr		{ text-align: justify; border: 0px !important; padding: 0px !important; margin: 4px; display: none;		} </style>").appendTo("head");
    $("<style type='text/css'> div#halp			{ border: 0px !important; padding: 0px !important; margin: 4px; display: none;    		} </style>").appendTo("head");
    $("<style type='text/css'> .mirkoButtons 	{ position: absolute; float: left; z-index: 101;  bottom: -4px; left: 3px; font-size: 9px;		} </style>").appendTo("head");
    $("<style type='text/css'> .mirkoFooter		{ position: absolute; font-size: 9px; right: 3px; bottom: -3px; 	} </style>").appendTo("head");  

	//Mielenie emotek
	MirkoEmotki.forEach(function(el){
        MirkoSmieszki += '<a href="#" class="mirkosmieszek color" data-smieszek="'+el+'">'+el+'</a>';
	});
	MirkoEmotkiUsr.forEach(function(el){
		MirkoSmieszkiusr += '<a href="#" class="mirkosmieszek color" data-smieszek="'+el+'">'+el+'</a>';
	});
    $.map(MirkoEmotkiBig, function (el, idx) {
        var desc = MirkoEmotkiBigDesc[idx];
        MirkoSmieszkiBig += '<a href="#" class="mirkosmieszek color" data-smieszek="'+el+'" title="'+el+'">'+desc+'</a>';
       
    });   
	/*MirkoEmotkiBig.forEach(function(el){
		MirkoSmieszkiBig += '<a href="#" class="mirkosmieszek color" data-smieszek="'+el+'">'+el+'</a>';
	});   
    */
	//DA JOB
    if(window.location.href.indexOf("ulubione") <0) {
        //Usuwamy Maciejowego helpera / Sorry Kaciej 
        $('div.grid-main div.ddC div.dropdown table').remove();
        
        //I dodajemy prawilny MirkoHelper
        $('div.grid-main div.ddC div.dropdown').prepend('<div id="mirkohelper" class="summary"></div>');
        $('div#mirkohelper').append('<div id="mirki">'+ MirkoSmieszki +'</div>');
        $('div#mirkohelper').append('<div id="mirkiusr" class="bgfff rel">'+ MirkoSmieszkiusr +'</div>');
        $('div#mirkohelper').append('<div id="moar" class="bgfff rel"><div id="halp">'+ MirkoSmieszkiBig +'</div></div>');    
        $('div#mirkohelper').prepend('<span class="mirkoButtons" style=""><a href"#" class="color" id="halp">BIG</a> <a href="#" class="color" id="moar">WINCYJ!</a></span>');
        $('div#mirkohelper').append('<span class="mirkoFooter"><a class="color" href="http://www.wykop.pl/dodatki/pokaz/291/" title="Strona MirkoHelpera" target="_blank">MirkoHelper</a> by <a class="color" href="http://www.wykop.pl/ludzie/Osael/" target="_blank" title="( ͡° ͜ʖ ͡°) usuń konto">@osael</a></span>');   
    }
    //A teraz obsluga tego towarzystwa
    
    //Wstawianie wybranej emotki tam gdzie jest kursor
    $(document).on('click', 'a.mirkosmieszek', function() {
        	var smieszko = ($(this).attr("data-smieszek"));
    		jQuery(this).closest('form').find('textarea').insertAtCaret(smieszko+" "); 
        	return false;
    });

    //chowanie MOAR! pokazywanie WINCYJ! i w ogóle dziwki, koks i lasery      
    $(document).on("click", 'a#halp', function(){
        if( $('div#mirki').is(':visible') ) {
            $('div#mirki').hide();
            $('div#mirkiusr').hide();
            $('div#halp').show();
        } else if ( $('div#mirkiusr').is(':visible') ) {
            $('div#mirkiusr').hide();
            $('div#mirki').hide();    
            $('div#halp').show();
        } else {
            $('div#halp').hide();
            $('div#mirki').show();
        }
        return false;
    });
    //niezle pojebane, nie? ale dziala! :D
    $(document).on("click", 'a#moar', function(){
        if( $('div#mirki').is(':visible') ) {
            $('div#mirki').hide();
            $('div#mirkiusr').show();
        } else if ( $('div#mirkiusr').is(':visible') ) {
            $('div#mirkiusr').hide();
            $('div#mirki').show();    
        } else {
            $('div#mirkiusr').show();
        }
        $('div#halp').hide();
        return false;
    });  
    
    
	//Skrypcik na wstawianie MirkoEmotki gdzie jest kursor
	jQuery.fn.extend({
        insertAtCaret: function(myValue){
            return this.each(function(i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    var sel = document.selection.createRange();
                    sel.text = myValue;
                    this.focus();
                }
                else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            });
        }
    });
    
}

if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera >.>
	main();
}

//what is this i dont even
function addJQuery(callback) {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
}
