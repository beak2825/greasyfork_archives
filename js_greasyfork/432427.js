// ==UserScript==
// @name         K12 Dark Mode
// @namespace    https://greasyfork.org/en/scripts/432427-k12-dark-mode
// @version      2.0
// @description  Makes the k12 pages a little easier on the eyes ;)
// @author       Chase Davis
// @match        https://learning.k12.com/*
// @match        https://login-learn.k12.com/*
// @match        https://smart.newrow.com/*
// @match        https://learnx-svc.k12.com/learnx-svc/getIndex/token/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document.start
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/432427/K12%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/432427/K12%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*

|‾‾‾‾‾‾‾‾‾‾‾D̅I̅S̅C̅L̅A̅I̅M̅E̅R̅‾‾‾‾‾‾‾‾‾‾‾|
|                                |
|     Some elements are nigh     |
|  impossible to change, due to  |
|    their class name AND id     |
|  changing on every page load.  |
|  These two values are the only |
|  way to grab elements, so it's |
| just impossible to do anything |
| to elements tampermonkey can't |
|  even find. Some elements are  |
|  embedded, making it flat out  |
|     impossible to grab them.   |
|                                |
|             Sorry!             |
|________________________________|

*/



//                     ====================={ Initialization }=====================

// Load colors from storage
let bgRaw = GM_getValue('bg1')
let bg2Raw = GM_getValue('bg2')
let txtRaw = GM_getValue('tc')
let tbColorRaw = GM_getValue('tb')
let img = GM_getValue('img')

var bg;
var bg2;
var txt;
var tbColor;

/*Take the last character off the color value. There's a strange bug where the script adds ';'
  on the end of the string every time, causing the color value to be invalid.*/



try {

    bg = bgRaw.split('',7);
    bg = bg.join('');

    bg2 = bg2Raw.split('',7);
    bg2 = bg2.join('');

    txt = txtRaw.split('',7);
    txt = txt.join('');

    tbColor = tbColorRaw.split('',7);
    tbColor = tbColor.join('');

}catch(fail){alert('It looks like this is your fisrt time using K12 DarkMode. Welcome!\n\nI sincerely hope you enjoy my work! If you have the time, please consider giving feedback in the discord server. Reload the page to launch the script. Thanks!')}

    // If colors are null or nonexistent, reset them
if (typeof(bg) != "string" || typeof(bg2) != "string" || typeof(txt) != "string" || typeof(tbColor) != "string" || typeof(img) != "string"){

let bg = '#404040';
GM_setValue('bg1',bg);

let bg2 = '#606060';
GM_setValue('bg2',bg2);

let txt = '#c0c0c0';
GM_setValue('tc',txt);

let tbColor = '#004674';
GM_setValue('tb',tbColor);

let img = 'https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png';
GM_setValue('img', img);

};

console.log('%cBackground: '+bg, 'color: '+bg);
console.log('%cSecondary Background: '+bg2, 'color: '+bg2);
console.log('%cText Color: '+txt, 'color: '+txt);
console.log('%cAccent: '+tbColor, 'color: '+tbColor);
console.log('Wallpaper: '+img);



// Inject custom input boxes
jQuery(function($) {



function writeCSS() {
try {document.getElementById('amazingStyle').remove();} catch(err){console.log(err)}
let css = `
<style id="amazingStyle">
    * {
    background: `+bg+` !important;
    color: `+txt+` !important;
    }

    [class*="d2l-page"] {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-body {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    [class*="homepage-"] {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-placeholder {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-placeholder-live {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-box-layout {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-page-title {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-twopanelselector-main-padding {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-twopanelselector-side-padding {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-box {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-page-search {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    .d2l-le-TreeAccordionItem-wrapper {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }

    [class*="d2l_1_"] {
    background: `+bg2+` !important;
    color: `+txt+` !important;
    }
</style>
`;

$('head').append(css);
console.log('css injected');
};

if (document.URL.includes('learnx-svc')) {
    writeCSS();
} else {

let dropdownHTML = `
<style>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: `+bg2+`;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>

<div class="dropdown">
  <span id="color-dropdown"; style="color: #FFF">Color Customization</span>
    <div class="dropdown-content"; style="color:`+txt+`; border-radius: 8px; border: 1px solid `+bg+`;">

      <div class="spacer"; style="padding: 5px">
        Background Color:
        <input id="inp1" value="`+bg+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

      <div class="spacer"; style="padding: 5px">
        Secondary Color:
        <input id="inp2" value="`+bg2+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

      <div class="spacer"; style="padding: 5px">
        Accent Color:
        <input id="inp4" value="`+tbColor+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

      <div class="spacer"; style="padding: 5px">
        Text Color:
        <input id="inp3" value="`+txt+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

      <div class="spacer"; style="padding: 5px">
        Background Image:
        <input id="inp5" value="`+img+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

  </div>
</div>`

let dropdownHTML_dashboard = `
<style>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: `+bg2+`;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>

<div class="dropdown">
  <span id="color-dropdown"; style="color: `+txt+`; font-size: 1.5vw; background-color: `+bg+`; padding: 10px; border-radius: 8px; position: relative; top: 30px;">Color Customization</span>
    <div class="dropdown-content"; style="color:`+txt+`; border-radius: 8px; border: 1px solid `+bg+`; top: 240%;">

      <div class="spacer"; style="padding: 5px">
        Background Color:
        <input id="inp1" value="`+bg+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

      <div class="spacer"; style="padding: 5px">
        Secondary Color:
        <input id="inp2" value="`+bg2+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

      <div class="spacer"; style="padding: 5px">
        Accent Color:
        <input id="inp4" value="`+tbColor+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

      <div class="spacer"; style="padding: 5px">
        Text Color:
        <input id="inp3" value="`+txt+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

      <div class="spacer"; style="padding: 5px">
        Background Image:
        <input id="inp5" value="`+img+`"; style="background-color: `+bg+`; color:`+txt+`;"></input>
      </div>

  </div>
</div>`

if (document.URL.includes('d2l') && !document.URL.includes('enhancedSequenceViewer')) {

    $('.d2l-navigation-s-main-wrapper').append(dropdownHTML);

};
/*setTimeout(() => {
    document.getElementById('logo-container').remove(); //Rickroll prank ;)
    document.getElementsByClassName('col-sm-8 col-sm-offset-2 form-container content-panel')[0].style.background = '#00000000';
    console.log('never gonna give you up');
    document.getElementsByClassName('nextgen login-body')[0].style.backgroundImage = 'url(https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png)'
}, 3000);*/



//                     ====================={ Input Checks }=====================

function rewriteColors() {

    let bgRaw = GM_getValue('bg1')
    let bg2Raw = GM_getValue('bg2')
    let txtRaw = GM_getValue('tc')
    let tbColorRaw = GM_getValue('tb')
    let img = GM_getValue('img')

    try {

        bg = bgRaw.split('',7);
        bg = bg.join('');

        bg2 = bg2Raw.split('',7);
        bg2 = bg2.join('');

        txt = txtRaw.split('',7);
        txt = txt.join('');

        tbColor = tbColorRaw.split('',7);
        tbColor = tbColor.join('');

        img = GM_getValue('img', img);

    }catch(fail){alert('Congratulations, you messed something up!')}; //If you somehow manage to corrupt the colors

}

//if (!document.URL.includes('learnx-svc')) {

// Check for input updates
$('#inp1').change(function(){
bg = document.getElementById('inp1').value
GM_setValue('bg1',bg);
rewriteColors();
});

// Check for input updates
$('#inp2').change(function(){
bg2 = document.getElementById('inp2').value
GM_setValue('bg2',bg2);
rewriteColors();
});

// Check for input updates
$('#inp3').change(function(){
txt = document.getElementById('inp3').value
GM_setValue('tc',txt);
rewriteColors();
});

// Check for input updates                        I know it's redundant, but hey, it works, doesn't it?
$('#inp4').change(function(){
tbColor = document.getElementById('inp4').value
GM_setValue('tb',tbColor);
rewriteColors();
});

// Check for input updates
$('#inp5').change(function(){
img = document.getElementById('inp5').value
GM_setValue('img',img);
rewriteColors();
});



//                     ====================={ Element Manipulation }=====================

var timer = setInterval(paint, 200) //Sets the script to re-paint the whole page every 0.01 seconds, so no more need to refresh.
function paint() {

if (document.URL.includes('enhancedSequenceViewer')) {
    writeCSS();
};

try {//                     ======================{ LOGIN PAGE SECTION }======================

    var element = document.getElementById('logo-container');
    element.remove();
    //Removes the bright white logo
    document.getElementsByClassName('app-container')[0].style.backgroundImage = 'none';
    document.getElementsByClassName('app-container')[0].style.background = bg;
    document.getElementsByClassName('nextgen login-body')[0].style.background = bg
    //Backdrop removal/darkening
    document.getElementsByClassName('col-sm-8 col-sm-offset-2 form-container content-panel')[0].style.background = bg2;
    document.getElementsByClassName('col-sm-8 col-sm-offset-2 form-container content-panel')[0].style.color = txt;
    document.getElementsByClassName('col-sm-8 col-sm-offset-2 form-container content-panel')[0].style.border = 'none';
    //Login box darken

}catch(err){};



try {//                     ======================{  HOMEPAGE SECTION  }======================

    document.getElementById('wallpaper').style.backgroundImage = 'url('+img+')';
    document.getElementById('header-bar').style.background = bg2;
    document.getElementById('side-nav').style.background = bg;
    document.getElementById('wallpaper').style.background = bg;
    document.getElementsByClassName('credit-courtesy')[0].innerHTML = '';
    document.getElementsByClassName('credit-name')[0].innerHTML = 'Rick A.';
    document.getElementsByClassName('credit-school')[0].innerHTML = 'He\'s never gonna give you up.';

    if (document.getElementById('color-dropdown') == undefined){
        $('.col-lg-7').append(dropdownHTML_dashboard);

        // Check for input updates
        $('#inp1').change(function(){
            bg = document.getElementById('inp1').value
            GM_setValue('bg1',bg);
            rewriteColors();
        });

        // Check for input updates
        $('#inp2').change(function(){
            bg2 = document.getElementById('inp2').value
            GM_setValue('bg2',bg2);
            rewriteColors();
        });

        // Check for input updates
        $('#inp3').change(function(){
            txt = document.getElementById('inp3').value
            GM_setValue('tc',txt);
            rewriteColors();
        });

        // Check for input updates                        I know it's redundant, but hey, it works, doesn't it?
        $('#inp4').change(function(){
            tbColor = document.getElementById('inp4').value
            GM_setValue('tb',tbColor);
            rewriteColors();
        });

        // Check for input updates
        $('#inp5').change(function(){
            img = document.getElementById('inp5').value
            GM_setValue('img',img);
            rewriteColors();
        });

    };
    document.getElementById('drawer-btn').remove()
    $('#header-title').remove()

}catch(err){};



try {//                     ======================{    PLAN SECTION    }======================

    let element = document.getElementById('enrollment-data-table table-responsive gh-tooltip-handled gh-popovers-handled');
    element.remove();
    document.getElementsByClassName('content')[0].style.background = '#000';

}catch(err){};



try{

    document.getElementsByClassName('d2l-navigation-s d2l-branding-navigation-light-foreground-color d2l-navigation-s-linkarea-has-color')[0].style.background = bg;
    document.getElementsByClassName('d2l-branding-navigation-background-color d2l-visible-on-ancestor-target')[0].style.background = tbColor;
    document.getElementsByClassName('d2l-page-main-padding')[0].background = bg

    let homePage = document.getElementsByClassName('d2l-widget d2l-tile');
    let homeWidgets = document.getElementsByClassName('d2l-widget d2l-tile d2l-custom-widget');

      try {

        homePage[6].style.background = bg2;
        homePage[6].style.color = txt;
        homePage[1].remove();
        homeWidgets[0].style.background = bg2;
        homeWidgets[0].style.color = txt;

      }catch(err){};

    let x = document.getElementsByClassName('d2l-widget d2l-tile d2l-widget-padding-full d2l-custom-widget');

    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.background = bg2;
        x[i].style.color = txt;
    };

    document.getElementById('underlay').style.background = bg;
    document.getElementsByClassName('d2l-course-banner-container')[0].remove();

}catch(err){/*console.log(err)*/}



try{//                     ======================{   LESSON SECTION   }======================

    //document.getElementsByClassName('d2l-body d2l-typography vui-typography d2l-suppress-nav daylight')[0].style.background = bg2;
    //

    let divs = document.getElementsByClassName('ng-scope')

    for (i = 0; i < divs.length; i++){
        divs[i].style.background = bg;
        divs[i].style.color = txt;
    };

    divs = document.getElementsByClassName('K12COMP_nestedMain')

    for (i = 0; i < divs.length; i++){
        divs[i].style.background = bg;
        divs[i].style.color = txt;
    };

}catch(err){console.log(err)};

try{//                     ======================{   CONTENT SECTION  }======================

    let divs = document.getElementById('D2L_LE_Content_TreeBrowser').children

    for (i = 0; i < divs.length; i++){
        document.getElementById('D2L_LE_Content_TreeBrowser').children[i].firstChild.style.color = txt;
    };

    divs = document.getElementsByClassName('d2l-le-TreeAccordionItem-wrapper')

    for (i = 0; i < divs.length; i++){
        document.getElementsByClassName('d2l-le-TreeAccordionItem-wrapper')[i].style.color = txt;
    };

    divs = document.getElementsByClassName('d2l-link')

    for (i = 0; i < divs.length; i++){
        document.getElementsByClassName('d2l-link')[i].style.color = txt;
    };

    divs = document.getElementsByClassName('d2l-collapsepane-header')

    for (i = 0; i < divs.length; i++){
        document.getElementsByClassName('d2l-collapsepane-header')[i].style.background = bg2;
        document.getElementsByClassName('d2l-collapsepane-content')[i].style.background = bg2;
    };

    document.getElementsByClassName('d2l-box')[0].style.background = 'none';
    document.getElementsByClassName('d2l-box')[0].style.color = txt;
    document.getElementsByClassName('d2l-box-layout')[0].style.background = bg;
    document.getElementsByClassName('d2l-body')[0].style.background = bg;

}catch(err){/*console.log(err)*/};

try{//                     ======================{   LESSON2 SECTION  }======================

    document.getElementsByClassName('d2l-page-main-padding')[0].style.background = bg;
    document.getElementById('ContentView').firstChild.style.background = bg2;

}catch(err){/*console.log(err)*/};

};

let underlay = document.URL.includes('d2l/home');
if (underlay) {//Same story here
$('html').append('<div id="underlay"; style="pointer-events: none; background-color: '+bg+'; position: fixed; top: 0px; left: 0px; height: 2000px; width: 2000px; z-index: -10;"></div>');
};

// =====================(  END PAINT SECTION  )=====================

};
});
})(); // Ah yes callBack hell :I