// ==UserScript==
// @name		Mirkohelper
// @namespace		https://www.wykop.pl/ludzie/osael/
// @description		Niezbędnik każdego Mirka!
// @author		osael
// @version		2.3.13
// @grant		none
// @include		*wykop.pl*
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/33429/Mirkohelper.user.js
// @updateURL https://update.greasyfork.org/scripts/33429/Mirkohelper.meta.js
// ==/UserScript==
//Bazowane na kilku innych dodatkach.
//To jest mój pierwszy skrypt. Powiedz jeżeli coś jest nie tak jak powinno lub mogłobyć zrobione lepiej.
//Podziekowania dla @Ginden oraz @kasper93.
//WERSJA TESTOWA POD NOWY WYPOK
//Reupload & zmiany by @Acrivec
//Pisac smialo o dodanie nowych fajnych
function main() {
  //------------ TU SIE DEFINIUJEMY ---------------------
  //( ͡° ͜ʖ ͡°)
  var MirkoEmotki = [
    '( ͡° ͜ʖ ͡°)',
    '( ͡~ ͜ʖ ͡°)',
    '( ͡° ʖ̯ ͡°)',
    '( ͡º ͜ʖ͡º)',
    '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)',
    '(⌐ ͡■ ͜ʖ ͡■)',
    '(・へ・)',
    'ლ(ಠ_ಠ ლ)',
    '(╥﹏╥)',
    '(╥‿╥)',
    '(╯︵╰,)',
    '( ͡; ʖ̯ ͡;)',
    '( ‾ʖ̫‾)',
    '(ღ˘⌣˘ღ)',
    '(ʘ‿ʘ)',
    '(｡◕‿‿◕｡)',
    'o( ❛ᴗ❛ )o',
    '(っ˘ω˘ς )',
    'ᕙ(⇀‸↼‶)ᕗ',
    'ᕦ(ò_óˇ)ᕤ',
    '(✌ ﾟ ∀ ﾟ)☞',
    '(╭☞σ ͜ʖσ)╭☞',
    '¯\\\\\\_(ツ)\\_/¯ ',
    '◕‿◕',
    '(ﾟｰﾟ)',
    '(>ლ)',
    '(－‸ლ)',
    '﴾͡๏̯͡๏﴿',
    'ಠ_ಠ',
    '(ಠ‸ಠ)',
    'ب_ب',
    'ヽ( ͝° ͜ʖ͡°)ﾉ',
    '( ͡°╭╮͡ °)',
    'ʕ•ᴥ•ʔ',
    'ᶘᵒᴥᵒᶅ',
    'ʕ ͡° ᴥ ͡° ʔ ',
    '( ˙꒳​˙ )',
    'ʚ♥̈́ɞ(ू•ᴗ•ू❁) ',
    '٩(｡•́‿•̀｡)۶♥',
    '(⌒(oo)⌒)',
    'ᄽὁȍ ̪ őὀᄿ',
    '(￣෴￣)',
    'ヽ( ͠°෴ °)ﾉ',
    '(づ•﹏•)づ',
    '(づ•‿•)づ',
    '(ง ͠° ͟ل͜ ͡°)ง',
    'ᕕ(ᐛ)ᕗ ',
    ''

  ];
  //Emotki proponowne przez mirki na #mirkohelper
  var MirkoEmotkiUsr = [
    '( ͡€ ͜ʖ ͡€)',
    'ლ(́◉◞౪◟◉‵ლ)',
    '(。ヘ°)',
    '(︶︹︺)',
    '(⌐ ͡■ ͟ʖ ͡■)',
    '(ᵔᴥᵔ)',
    '(￣ᴥ￣)',
    '(∪_∪)｡｡｡zzz',
    '( ͡~ ͜ʖ ͡~) ',
    'ヽ༼ຈل͜ຈ༽ﾉ',
    '(¬‿¬)',
    '(ﾉ´ヮ´)ﾉ*:･ﾟ✧',
    'ヾ(⌐■_■)ノ♪',
    '( ˘ ³˘)♥',
    '( ง ͡°╭͜ʖ╮͡° ) ง',
    '(ง •̀_•́)ง ',
    '( ˘▽˘)っ♨',
    '(ง ͠° ͟ʖ ͡°)ง',
    '(╯°□°）╯︵ ┻━┻',
    '┬──┬◡ﾉ(° -°ﾉ)',
    '(╯°□°）╯ /(.□. \\）',
    'ノ┬─┬ノ ︵ ( \\o°o)\\',
    '(〃＾▽＾〃)',
    '꧁',
    '꧂'
  ];
  var MirkoEmotkiBig = [
    '( ͡° ͜ʖ ͡°)\n( ͡° ͜ʖ ͡°)ﾉ⌐■-■\n(⌐ ͡■ ͜ʖ ͡■)',
    '┬┴┬┴┤ ( ͡° ͜ʖ├┬┴┬┴',
    '╚═( ͡° ͜ʖ ͡°)═╝\n╚═(███)═╝\n╚═(███)═╝\n.╚═(███)═╝\n..╚═(███)═╝\n…╚═(███)═╝\n…╚═(███)═╝\n..╚═(███)═╝\n.╚═(███)═╝\n╚═(███)═╝\n.╚═(███)═╝\n..╚═(███)═╝\n…╚═(███)═╝\n…╚═(███)═╝\n…..╚(███)╝\n……╚(██)╝\n………(█)\n……….*',
    '　　　　　　　　　　　 　 ∧__∧\n　　　　　　　　　　　 　( ͡° ͜ʖ ͡°)\n　　　　　　　　　　　　⊂　　つ\n　　　　　　　　　　　　　(つ ﾉ\n　　　　　　　　　　　　　 (ノ\n　　　　　＼　　　　　　☆\n　　　　　　　　　　　　　|　　　　　☆\n　　　　　　　　　　(⌒ ⌒ヽ　　　/\n　　　　＼　　（´⌒　　⌒　　⌒ヾ　　　／\n　　　　　 （’⌒　;　⌒　　　::⌒　　）\n　　　　　（´　　　　　）　　　　　:::　）　／\n　　☆─　（´⌒;:　　　　::⌒`）　:;　　）\n　　　　　（⌒::　　　::　　　　　::⌒　）\n　　 　／　（　　　　ゝ　　ヾ　丶　　ソ　─',
    '█■█ █ ▀█▀'
  ];
  var MirkoEmotkiBigDesc = [
    '(⌐ ͡■ ͜ʖ ͡■)',
    '( ͡° ͜ʖ├┬',
    '╚═( ͡° ͜ʖ ͡°)═╝',
    '( ͡° ͜ʖ ͡°)',
    'HIT'
  ];
  var MirkoSmieszki = '';
  var MirkoSmieszkiusr = '';
  var MirkoSmieszkiBig = [
  ];
  //A tu kolor linkow. Potrzebne pod nocny/dzienny    
  var classColor = $('a.editlenny').css('color');
  //CSSki
  $('<style type=\'text/css\'> .color\t\t\t{ color:' + classColor + ' !important;\t\t} </style>').appendTo('head');
  $('<style type=\'text/css\'> .mirkosmieszek\t{ min-width: 30px; float: left; padding: 0 5px 0px 0px;} </style>').appendTo('head');
  $('<style type=\'text/css\'> #mirkohelper\t\t{ position: absolute; width: 500px; height: 140px !important; line-height: 21px !important; padding: 0px !important; min-height: 0px !important;\t\t} </style>').appendTo('head');
  $('<style type=\'text/css\'> #mirki\t\t\t{ text-align: justify; border: 0px !important; padding: 0px !important; margin: 4px; } </style>').appendTo('head');
  $('<style type=\'text/css\'> #mirkiusr\t\t{ text-align: justify; border: 0px !important; padding: 0px !important; margin: 4px; display: none;\t\t} </style>').appendTo('head');
  $('<style type=\'text/css\'> div#halp\t\t\t{ border: 0px !important; padding: 0px !important; margin: 4px; display: none;    \t\t} </style>').appendTo('head');
  $('<style type=\'text/css\'> .mirkoButtons \t{ position: absolute; float: left; z-index: 101;  bottom: -4px; left: 3px; font-size: 9px;\t\t} </style>').appendTo('head');
  $('<style type=\'text/css\'> .mirkoFooter\t\t{ position: absolute; font-size: 9px; right: 3px; bottom: -3px; \t} </style>').appendTo('head');
  //Mielenie emotek
  MirkoEmotki.forEach(function (el) {
    MirkoSmieszki += '<a href="#" class="mirkosmieszek color" data-smieszek="' + el + '">' + el + '</a>';
  });
  MirkoEmotkiUsr.forEach(function (el) {
    MirkoSmieszkiusr += '<a href="#" class="mirkosmieszek color" data-smieszek="' + el + '">' + el + '</a>';
  });
  $.map(MirkoEmotkiBig, function (el, idx) {
    var desc = MirkoEmotkiBigDesc[idx];
    MirkoSmieszkiBig += '<a href="#" class="mirkosmieszek color" data-smieszek="' + el + '" title="' + el + '">' + desc + '</a>';
  });
  /*MirkoEmotkiBig.forEach(function(el){
		MirkoSmieszkiBig += '<a href="#" class="mirkosmieszek color" data-smieszek="'+el+'">'+el+'</a>';
	});   
    */
  //DA JOB
  if (window.location.href.indexOf('ulubione') < 0) {
    //Usuwamy Maciejowego helpera / Sorry Kaciej 
    $('div.grid-main div.ddC div.dropdown table').remove();
    //I dodajemy prawilny MirkoHelper
    $('div.grid-main div.ddC div.dropdown').prepend('<div id="mirkohelper" class="summary"></div>');
    $('div#mirkohelper').append('<div id="mirki">' + MirkoSmieszki + '</div>');
    $('div#mirkohelper').append('<div id="mirkiusr" class="bgfff rel">' + MirkoSmieszkiusr + '</div>');
    $('div#mirkohelper').append('<div id="moar" class="bgfff rel"><div id="halp">' + MirkoSmieszkiBig + '</div></div>');
    $('div#mirkohelper').prepend('<span class="mirkoButtons" style=""><a href"#" class="color" id="halp">BIG</a> <a href="#" class="color" id="moar">WINCYJ!</a></span>');
    $('div#mirkohelper').append('<span class="mirkoFooter"><a class="color" href="http://www.wykop.pl/dodatki/pokaz/291/" title="Strona MirkoHelpera" target="_blank">MirkoHelper</a> by <a class="color" href="http://www.wykop.pl/ludzie/Osael/" target="_blank" title="( ͡° ͜ʖ ͡°) usuń konto">@osael</a></span>');
  }  //A teraz obsluga tego towarzystwa
  //Wstawianie wybranej emotki tam gdzie jest kursor

  $(document).on('click', 'a.mirkosmieszek', function () {
    var smieszko = ($(this).attr('data-smieszek'));
    jQuery(this).closest('form').find('textarea').insertAtCaret(smieszko + ' ');
    return false;
  });
  //chowanie MOAR! pokazywanie WINCYJ! i w ogóle dziwki, koks i lasery      
  $(document).on('click', 'a#halp', function () {
    if ($('div#mirki').is(':visible')) {
      $('div#mirki').hide();
      $('div#mirkiusr').hide();
      $('div#halp').show();
    } else if ($('div#mirkiusr').is(':visible')) {
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
  $(document).on('click', 'a#moar', function () {
    if ($('div#mirki').is(':visible')) {
      $('div#mirki').hide();
      $('div#mirkiusr').show();
    } else if ($('div#mirkiusr').is(':visible')) {
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
    insertAtCaret: function (myValue) {
      return this.each(function (i) {
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
          this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
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
}//what is this i dont even

function addJQuery(callback) {
  var script = document.createElement('script');
  script.textContent = '(' + callback.toString() + ')();';
  document.body.appendChild(script);
}
