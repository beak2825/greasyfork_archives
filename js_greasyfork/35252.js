// ==UserScript==
// @name         Google Night Mode
// @namespace    http://tampermonkey.net/
// @version      beta 0.4
// @description  A night mode for google !
// @author       VapeHorization
// @match        homepage
// @match        https://www.google.fr/*
// @match        https://www.google.com/*
// @match        https://www.google.it/*
// @match        https://www.play.google.com/*
// @match        https://www.google.fi/*
// @match        https://www.google.es/*
// @match        https://www.google.eu/*
// @match        https://www.google.de/*
// @match        https://www.google.dd/*
// @match        https://www.google.dk/*
// @match        https://www.google.cz/*
// @match        https://www.google.cu/*
// @match        https://www.google.cn/*
// @match        https://www.google.ch/*
// @match        https://www.google.ca/*
// @match        https://www.google.ca/*
// @match        https://www.google.bf/*
// @match        https://www.google.be/*
// @match        https://www.google.bg/*
// @match        https://www.google.vn/*
// @match        https://www.google.va/*
// @match        https://www.google.ru/*
// @match        https://www.google.ro/*
// @match        https://www.google.com.qa/*
// @match        https://www.google.pt/*
// @match        https://www.google.pl/*
// @match        https://www.google.no/*
// @match        https://www.google.nl/*
// @match        https://www.google.com.mx/*
// @match        https://www.google.co.ma/*
// @match        https://www.google.lt/*
// @match        https://www.google.la/*
// @match        https://www.google.co.jp/*
// @match        https://www.google.je/*
// @match        https://www.google.is/*
// @match        https://www.google.ie/*
// @match        https://www.google.iq/*
// @match        https://www.google.hu/*
// @match        https://www.google.com.hk/*
// @match        https://www.google.gp/*
// @match        https://www.google.ht/*
// @match        https://www.google.hr/*
// @match        https://www.google.gl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35252/Google%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/35252/Google%20Night%20Mode.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

addGlobalStyle(' div#viewport { background: #333 !important; }');
addGlobalStyle('#epbar #epb-notice , #epbar{ background: #333 !important; }');//CANADIAN VERSION
addGlobalStyle('.gb_Hg.gb_lb , .gb_Hg.gb_Hg .gb_Q , .gb_ke.gb_R { background: #333 !important; }' );
addGlobalStyle('#tw-container { background: #949494 !important; } ');

//re-CAPTCHA

addGlobalStyle('.rc-anchor-center-item , .rc-anchor-normal-footer , .rc-anchor-light{ background: #6e6e6e !important; }');
//--re-CAPTCHA--

//HIDE THE COUNTRY
addGlobalStyle('._Cbu { background: #333 !important; }');
addGlobalStyle('._Ubu { border: solid 1px #333 !important; } ');
addGlobalStyle('#fbar { border: solid 1px #333 !important; } ');
addGlobalStyle('._Ubu { background: #333 !important; }');
addGlobalStyle('._Vbu { color: #333 !important; }');
addGlobalStyle('._Vbu { cursor: default !important; ');
//--------------

addGlobalStyle('.fbar { background: #333 !important; }');

addGlobalStyle('._wtf { fill: lightblue !important; } ');

//FLIGHTS

addGlobalStyle('.LJV2HGB-a-g, .LJV2HGB-a-g input { background: #6e6e6e !important; } ');
addGlobalStyle('.LJV2HGB-eb-j.LJV2HGB-eb-h.LJV2HGB-eb-p, .LJV2HGB-eb-j.LJV2HGB-eb-h.LJV2HGB-eb-p:hover , .LJV2HGB-eb-j .LJV2HGB-eb-b , .LJV2HGB-eb-j.LJV2HGB-eb-o.LJV2HGB-eb-l, .LJV2HGB-eb-j.LJV2HGB-eb-o.LJV2HGB-eb-k{ background: #333 !important;  } ');
addGlobalStyle('.LJV2HGB-eb-j.LJV2HGB-eb-h.LJV2HGB-eb-p, .LJV2HGB-eb-j.LJV2HGB-eb-h.LJV2HGB-eb-p:hover , .LJV2HGB-eb-j .LJV2HGB-eb-b , .LJV2HGB-eb-j.LJV2HGB-eb-o.LJV2HGB-eb-l, .LJV2HGB-eb-j.LJV2HGB-eb-o.LJV2HGB-eb-k { color: #f2f2f2 !important; }');
addGlobalStyle('.LJV2HGB-eb-j.LJV2HGB-eb-o.LJV2HGB-eb-l, .LJV2HGB-eb-j.LJV2HGB-eb-o.LJV2HGB-eb-k { border: solid #e6e6e6 1px !important; } ');
addGlobalStyle('.LJV2HGB-Ab-c , .LJV2HGB-Lb-b { background: #333 !important; }');
addGlobalStyle('.LJV2HGB-Lb-b { color: white !important; } ');
addGlobalStyle('.LJV2HGB-f-b input[type=text] { background: #333 !important; } ');
addGlobalStyle('.LJV2HGB-D-g, .LJV2HGB-D-a , .LJV2HGB-D-b, .LJV2HGB-D-h{ background: #333 !important; }' );
addGlobalStyle('.popupContent input[type=text], .LJV2HGB-f-b input[type=text], .LJV2HGB-f-j input[type=text] , .LJV2HGB-G-o .LJV2HGB-G-m , .LJV2HGB-s-c { color: white !important; } ');
addGlobalStyle('.LJV2HGB-o-I.LJV2HGB-o-F ,  .LJV2HGB-o-J { background: #6e6e6e !important;} ');
addGlobalStyle('.LJV2HGB-o-d , .LJV2HGB-p-c .LJV2HGB-p-d , .LJV2HGB-p-h { background: #333 !important; } ');
addGlobalStyle('.LJV2HGB-p-d { color: #777 !important; } ');
addGlobalStyle('.LJV2HGB-p-h:hover , .LJV2HGB-p-d , .LJV2HGB-p-e:hover { background: #333 !important; } ');
addGlobalStyle('.LJV2HGB-c-k .LJV2HGB-f-n, .LJV2HGB-c-l .LJV2HGB-f-n , .LJV2HGB-f-n , .LJV2HGB-f-v , LJV2HGB-f-i { background: #333 !important; }');
addGlobalStyle('.LJV2HGB-R-q { color: grey !important; } ');
addGlobalStyle('.LJV2HGB-R-i { background: #333 !important; } ');
addGlobalStyle('.LJV2HGB-rb-e , .LJV2HGB-R-x { color: white !important; } ');

//TO FINISH : https://www.google.fr/flights/#search;f=NTE;d=2017-11;r=WE;mc=e
//---FLIGHTS---

//SEARCH BAR

addGlobalStyle('.gsfi, .lst , .sbib_b { background: #1C1C1C !important; }');
addGlobalStyle('.gsfi, .lst , .sbib_b { color: white !important; } ');
addGlobalStyle('.gsst_a , #gs_st0  { background: #6e6e6e !important; }');
addGlobalStyle('.gsst_a { border-left: solid #1c1c1c 3px !important; } ');
addGlobalStyle('.gsst_a { border-bottom: solid #1c1c1c 1px !important; }');
addGlobalStyle('.sbsb_g { background: #6e6e6e !important; }');
addGlobalStyle('.sbsb_g{ border-top: solid 1px white !important; }');
addGlobalStyle('.sbdd_a[dir=ltr] .sbsb_j { background: #6e6e6e !important; }');
addGlobalStyle('[role=presentation] { color: #f2f2f2 !important; } ');
addGlobalStyle('[role=presentation]:hover { border-bottom: solid white 1px !important; } ');
addGlobalStyle('[role=option] { color: #f2f2f2 !important; } ');
addGlobalStyle('[role=option] ,  .sbsb_c{ background: #333 !important; }' );
addGlobalStyle(':dir(ltr) { color: #f2f2f2 !important; } ');
addGlobalStyle('.sbsb_g { background: white !important; }');
addGlobalStyle('.sbdd_a input { background: #333 !important; }');
addGlobalStyle('.sbdd_a input { border: solid 2px #6e6e6e !important; }');
addGlobalStyle('.sbdd_a input { margin-top: -4px !important; } ');
addGlobalStyle('.sbdd_a input { height: 25px !important;  }');
addGlobalStyle('.sbdd_a input:hover { color: #f2f2f2 !important; }' );
addGlobalStyle('.sbdd_a input { color: #e6e6e6 !important; }');
addGlobalStyle('#sbsb_f { color: #f2f2f2 !important; }');
addGlobalStyle('#sbsb_f:hover { color: #e6e6e6 !important; }');
addGlobalStyle('.sbpqs_a { color: #e6e6e6 !important; } ');
addGlobalStyle('.sbpqs_a { font-weight: bold !important; }' );

addGlobalStyle('._zF {background: #6e6e6e !important; }');
addGlobalStyle('._zF { color: white !important; }');
//----------------

//BUTTON

addGlobalStyle('.jhp input[type="submit"], .gbqfba { background: #333 !important; }');
addGlobalStyle('.jhp input[type="submit"], .gbqfba { color: white !important; }');
//---------------

//GMAIL BUTTON , ETC
addGlobalStyle('#gb#gb a.gb_P, #gb#gb span.gb_P  { color: white !important; }');
//-------------------

addGlobalStyle('body {background: #333 !important; } ');

//PROFILE

addGlobalStyle('.gb_fa { background: #333 !important; }');
addGlobalStyle('.gb_Bb { color: white !important;  }');
addGlobalStyle('.gb_Fb { background: #6e6e6e !important; }');
addGlobalStyle('.gb_Fa, #gb a.gb_Fa.gb_Fa { color: #333 !important; } ');
//-----------------------

//SEARCH PAGE

addGlobalStyle(' div.sfbg, div.sfbgg{ background: #6e6e6e !important; }');
addGlobalStyle(' #hdtb.notl div { background: #6e6e6e !important; }');

//QUESTION

addGlobalStyle('._xXc { color: white !important; } ');
addGlobalStyle('._jYe ._AXc { color: #e6e6e6 !important; } ');

//

addGlobalStyle('._thf ._pk , ._rhf , ._qgo ._qhf { background: #6e6e6e !important; } ');
addGlobalStyle('._qgo { border: none !important; } ');
addGlobalStyle('._qhf { color: #f2f2f2 !important; }');
addGlobalStyle('.mod:first-child { background: #333 !important; } ');
addGlobalStyle('._U7g { background: #a5a5a5 !important;  } ');
//----QUESTIONS-----

//SEARCH BAR


addGlobalStyle('.sbib_b { border: solid #1C1C1C 3px !important; } ');
addGlobalStyle('.sbib_b { border-right: solid #1C1C1C 1px !important; } ');
addGlobalStyle('.srp #gs_st0 { border-left: solid #1C1C1C 2px !important; }');
addGlobalStyle(' #gs_st0 { border-left: solid #1C1C1C 3px !important; } ');
addGlobalStyle('.srp #gs_st0 { background: #1c1c1c !important; } ');
addGlobalStyle('.gsst_a , #gs_st0 , .gsst_a { background: #1c1c1c !important; } ');
addGlobalStyle('.sbico-, .srp #sfdiv { background: #1c1c1c !important; }');
//-------SEARCH-BAR-------

//TOP BAR
addGlobalStyle('#hdtb-msb .hdtb-mitem.hdtb-msel{ font-weight: bold !important; }');
addGlobalStyle('#hdtb .hdtb-mitem a { color: #e6e6e6 !important; }');
addGlobalStyle('#hdtb .hdtb-mitem a:hover { color: white !important; }');
addGlobalStyle('#hdtb .hdtb-mitem a:hover { font-weight: bold !important; }' );
addGlobalStyle('#hdtb-msb #hdtb-more, #hdtb-msb #hdtb-tls { color: white !important; } ');
addGlobalStyle('body.vasq .ab_tnav_wrp , .ab_tnav_wrp , #extabar { background: #333 !important; } ');
addGlobalStyle('#hdtb.hdtba #hdtb-msb .hdtb-mitem.hdtb-msel { font-weight: bold !important; } ');
addGlobalStyle('#hdtb-msb .hdtb-tl-sel { background: #333 !important; }');
addGlobalStyle('#hdtb-msb #hdtb-tls:hover { background: #333 !important; }' );
addGlobalStyle(' , body.vasq #hdtb-msb .hdtb-mitem.hdtb-msel { height: 5px !important; } ');
addGlobalStyle('#hdtb-msb .hdtb-mitem.hdtb-msel, #hdtb-msb .hdtb-mitem.hdtb-msel-pre { color: lightblue !important; } ');

//ADVANCED--SEARCH

addGlobalStyle('div._Ie div._Vm { color: #f2f2f2 !important; }' );
addGlobalStyle('div._Ie div._Ai input[type="text"], div._Ie div._Ai span._gRb { background: #333 !important; }' );
addGlobalStyle('div._Ie div._Ai input[type="text"], div._Ie div._Ai span._gRb { color: white !important; }');
addGlobalStyle('._oB { background: #6e6e6e !important; } ');
addGlobalStyle('._nB { background: #333 !important; } ');
addGlobalStyle('.goog-menuitem { background: #6e6e6e !important; } ');
addGlobalStyle('.goog-menuitem:hover { color: #f2f2f2 !important; }' );
addGlobalStyle('.goog-menuitem { color: #e6e6e6 !important; } ');
addGlobalStyle('div._yf { color: white !important; }' );
addGlobalStyle('div._Ie div._Rj span._fq { color: gray !important; } ');

//-----ADVANCED---SEARCH-----

//PARAMETERS

addGlobalStyle('a._VJq:hover { border-bottom: solid white 1px !important; }' );
addGlobalStyle('a._VJq:hover { background: transparent !important; } ');
//----PARAMETERS----

//TOOLS

addGlobalStyle('#hdtb.notl , #hdtb.notl, #hdtb.notl  { color: white !important; }');
addGlobalStyle('body.vasq .hdtb-mn-o, body.vasq .hdtb-mn-c { background: #333 !important; } ');
addGlobalStyle(' #hdtb.notl li { background: #333 !important; } ');
addGlobalStyle('#hdtb.notl a, #hdtb.notl div, #hdtb.notl li { color: white !important; }');
addGlobalStyle('#cdrlnk { background: #333 !important; } ');
addGlobalStyle('#hdtb .hdtbItm a:hover { border-bottom: solid white 1px !important; }');
addGlobalStyle('#hdtb .hdtbItm a:hover { background: #333 !important; } ');
//-------TOOLS------


addGlobalStyle('._dMq { background: #333 !important; }');

//MUSIC---TITLES

addGlobalStyle('._bfj , .rlc__slider-page , .rl_container { background: #333 !important; }');
addGlobalStyle('.rl_center { border: solid #333 1px !important; } ');
addGlobalStyle('._S6g._Ggo g-fab { background: #6e6e6e !important; } ');
addGlobalStyle('._S6g._Ggo g-fab { color: lightblue !important; } ');
addGlobalStyle('._S6g._Ggo g-fab { border: solid white 1px !important; } ');
addGlobalStyle('._S6g._Ggo g-fab:hover { background: #333 !important; } ');
addGlobalStyle('._S6g._Ggo g-fab:hover { border: solid #1C1C1C 3px !important; } ');
//----MUSIC--TITLES----

//-------TOP-BAR------------

addGlobalStyle('a:link { color: #e6e6e6 !important; }' );
addGlobalStyle('.st { color: gray !important; }' );
addGlobalStyle('._SWb a.fl { background: #333 !important; }' );
addGlobalStyle('#res a { color: #f2f2f2 !important; } ');
addGlobalStyle('#res h3 { color: white !important; }' );
addGlobalStyle('._Jvo , ._VSv , ._USv{ background: #6e6e6e !important; } ');
addGlobalStyle('.f { color: #f2f2f2 !important; }');
addGlobalStyle('cite { font-weight: bold !important; } ');
addGlobalStyle('#brs .med { color: white !important; } ');

//RENS

addGlobalStyle('.kno-ecr-pt { color: white !important; } ');
addGlobalStyle('.knowledge-panel.kp-blk .mod, ._kTi .mod { color: #e6e6e6 !important; } ');
addGlobalStyle('#rhs a { color: white !important; } ');
addGlobalStyle('#rhs a { font-weight: bold !important; } ');
addGlobalStyle('#rhs a { font-size: 15px !important; }' );
addGlobalStyle('.rl_item .title , .kp-blk ._Wdh ._wjf , ._Kjf{ background: #333 !important; } ');
addGlobalStyle('._W5e { color: #f2f2f2 !important; } ');
addGlobalStyle('._Rsi { color: #c1bdbd !important; } ');
addGlobalStyle('.rl_item .title { color: #f2f2f2 !important; } ');
addGlobalStyle('.kp-blk ._Wdh ._wjf { border-left: solid #333 10px !important; } ');
addGlobalStyle('._xK ._h3d { color: #f2f2f2 !important; } ');
addGlobalStyle('#rhs ._WGh .exp-txt-c { color: #e4e4e4 !important; } ');
addGlobalStyle('._gdf { color: #333 !important; } ');
addGlobalStyle('._Ejf, ._Kjg { color: #f2f2f2 !important; } ');

addGlobalStyle('#rhs ._wD.rhsvw:hover { background: transparent !important; } ');
addGlobalStyle('._pk { color: white !important; }');
addGlobalStyle('._Adb { color: #e6e6e6 !important; } ');
//-----RENS------

addGlobalStyle('.stp { color: #e6e6e6 !important; } ');
addGlobalStyle('._Iqg { color: lightblue !important; } ');

//IDK

addGlobalStyle('._wCh { background: #6e6e6e !important; } ');
addGlobalStyle('._wCh { border-radius: 2px !important; }' );
addGlobalStyle('._J3q { color: #e6e6e6 !important; } ');

addGlobalStyle('._U5o , ._A2o ._n2o , ._A2o { background: #333 !important; } ');
//---IDK---

//AD

addGlobalStyle('.ellip { font-weight: bold !important; } ');
addGlobalStyle('.ellip { color: gray !important; } ');
//---AD---

//COLOR--PALETTE

addGlobalStyle('._Fpi ._uii { color: white !important; } ');
addGlobalStyle('._Fpi ._uii { font-weight: bold !important; } ');
addGlobalStyle('._Wxn { color: #f2f2f2 !important; } ');
addGlobalStyle('._Xxn { color: #e6e6e6 !important; } ');
addGlobalStye('._Wxn { font-weight: bold !important; } ');

//--COLOR-PALETTE--

//TRANSLATER

addGlobalStyle('.tw-data-placeholder { color: red !important; }');
addGlobalStyle('#tw-container { background: #949494 !important; }');
addGlobalStyle('svg:hover , .tw-menu-btn-image:hover , .tw-menu-btn:hover , #tw-source, #tw-target:hover , #tw-mic:hover { background: transparent !important; }' );
addGlobalStyle('.tw-lang-selector { background: #333 !important; }');
addGlobalStyle('.tw-lang-selector { color: #f2f2f2 !important; }');
addGlobalStyle('.tw-lang-selector , .tw-lang-selector:not(.tw-dl) { border: solid transparent 1px !important; } ');
addGlobalStyle('.tw-lang-selector { margin-left: 4px !important; } ');
addGlobalStyle('.tw-lang-selector-wrapper , .tw-lang-selector:not(.tw-dl) { border: solid transparent 1px !important; } ');
addGlobalStyle('#_fVd { background: #333 !important; } ');
addGlobalStyle('.tw-data-placeholder { color: white !important; } ');
addGlobalStyle('#center_col ._WGh .exp-txt-c { color: #e6e6e6 !important; } ');
addGlobalStyle('#center_col ._WGh .exp-txt-c { font-weight: bold !important; } ');
//-----TRANSLATER------


addGlobalStyle('.sbico-c { background: #6e6e6e !important; }');
addGlobalStyle('.sbico-c {border: none !important; } ');
addGlobalStyle('.hp .big #sfdiv { height: 30px !important; }');

//INFO
addGlobalStyle('._wCh { background: #6e6e6e !important; } ');
addGlobalStyle('._J3q { color: #e6e6e6 !important; } ');
addGlobalStyle('._wCh { border-radius: 2px !important; }');
//----INFO----


addGlobalStyle('.abup , ._ffj ._bfj , .gic { background: #949494 !important; }');
addGlobalStyle('#appbar a { background: #333 !important; }');
addGlobalStyle('#appbar a , .kltat { color: #e6e6e6 !important; } ');

//CALCULATOR

addGlobalStyle('#cwfleb , .vk_c, .vk_cxp, .vk_ic , .cwtlwm { background: #6e6e6e !important; }');
addGlobalStyle('.cwtlotc , .cwtlptc{ background: #333 !important; } ');
addGlobalStyle('.cwcot { color: #f2f2f2 !important; } ');
addGlobalStyle('.cwrdca { background: rgba(78, 69, 69, 0.6) !important; } ');

//------CALCULATOR-------

//MORE_RESULT
addGlobalStyle('#rhs ._wD.rhsvw , #rhs ._tdf , #rhs .kp-blk { background: #6e6e6e !important; }');
addGlobalStyle('#rhs ._wD.rhsvw:hover { background: #6e6e6e !important; } ');
addGlobalStyle('._pk { color: #f2f2f2 !important; } ');
addGlobalStyle('.rhstc3 .rhsg4 { color: #e6e6e6 !important; } ');
addGlobalStyle('#rhs ._tdf { border-radius: 3px 3px 0px 0px !important; } ');
//-----MORE--RESULT-----

addGlobalStyle('._Rm { color: hsl(122.6, 41%, 44.5%) !important;  } '); //URL WEBSITE


//ASSOCIATED--RESEARCH

addGlobalStyle('.kxbcl { color: #1C1C1C !important; }' );
//----ASSOCIATED--RESEARCH----

//-----SEARCH-PAGE-----

//RULES
addGlobalStyle('#maia-header { background: #6e6e6e !important; }');
addGlobalStyle('#maia-nav-x { background: #333 !important; }');
addGlobalStyle('html { background: #333 !important; }');
addGlobalStyle('#pp-header h1 { color: white !important; } ');
addGlobalStyle('h1+p, h2+p, h3+p, h4+p, h5+p, h6+p , #pp-wrapper{ color: #e6e6e6 !important; } ');
addGlobalStyle('#pp-wrapper .highlight, #pp-wrapper a.highlight, #pp-wrapper a.highlight:visited { background: #6e6e6e !important; } ');
addGlobalStyle('h1 { color: #f2f2f2 !important; } ');
addGlobalStyle('#pp-wrapper h2 , #pp-wrapper strong{ color: #f2f2f2 !important; }');
addGlobalStyle('#maia-footer-local , #maia-footer-global { background: #6e6e6e !important; }');
addGlobalStyle('#maia-footer h3 { color: white !important; } ');
addGlobalStyle('.maia-locales select { background: #333 !important; } ');
addGlobalStyle('.maia-locales select { color: #e6e6e6 !important; } ');

//-------RULES--------


//TERMS
addGlobalStyle('h2 { color: white !important; }');
addGlobalStyle('p { color: #e6e6e6 !important; }');
addGlobalStyle('.maia-aside { background: #333 !important; }');
addGlobalStyle('h4 { color: white !important; }');
//------TERMS-------

//I'M LUCKY--SEARCH--GOOGLE

addGlobalStyle('.jhp input[type="submit"]:hover, .gbqfba:hover { background: #6e6e6e !important; } ');
addGlobalStyle('.jhp input[type="submit"]:hover, .gbqfba:hover { border: solid #6e6e6e 2px !important; } ');
//-----I'M--LUCKY----SEARCH--GOOGLE

//GOOGLE-IMAGE

addGlobalStyle('._ucd { color: #f2f2f2 !important; } ');
addGlobalStyle('._ucd:hover , .rg_i:hover { color: #333 !important; } ');
//---GOOGLE-IMAGE---

//OTHERS

addGlobalStyle('*:visited { color: #f2f2f2 !important; } ');
addGlobalStyle('.gb_ba, .gb_ba+.gb_ka, .gb_ma .gb_ka, .gb_ma .gb_ia { background: #333 !important; }');
addGlobalStyle('#gb a.gb_ja { background: #6e6e6e !important; } ');
addGlobalStyle('.gb_3:hover , .gb_O .gb_2:hover { color: black !important; }');
addGlobalStyle('.subsect { color: #e6e6e6 !important; }' );
addGlobalStyle('._Tgc { color: #e6e6e6 !important; }');
addGlobalStyle('._xXc { color: #e6e6e6 !important; }');
addGlobalStyle('.gb_Oc { background-color: gray !important; } ');
//-----OTHERS-----


addGlobalStyle('._wtf { color: lightblue !important; }' );// ._wtf