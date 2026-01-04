// ==UserScript==
// @name         Smash or Pass
// @namespace    http://tampermonkey.net/
// @version      0.81
// @description  why did I spend so long on this
// @author       someone with better priorities
// @license      MIT
// @run-at       document-start
// @match        https://www.pokemon.com/*/pokedex*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokemon.com
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/439945/Smash%20or%20Pass.user.js
// @updateURL https://update.greasyfork.org/scripts/439945/Smash%20or%20Pass.meta.js
// ==/UserScript==
const $ = window.jQuery;
const html2canvas = window.html2canvas;
var arr = [];
try { arr = JSON.parse(GM_getValue('arr', '[]')); }
catch (_ignore) {}
var mainPage = false;
if(window.location.href.substr(-8)=='pokedex/'){mainPage=true;}

function main(){

var listOfIndexesA = ".dummy";var listOfIndexesM = ".dummy";var listOfIndexesF = ".dummy";


var stylesheet ="<style>html{background:#323232}.animating{padding-bottom:10px;}.smashCont:hover{ box-shadow: 0 3000px rgba(255, 0, 0, 0.4) inset;}.smashCont img{width:160px;height:160px;}.screenshotEnabled{height:auto!important;width:100%!important;}#buttonList canvas{opacity:0.3;background:#111; border-radius:10px;height:calc(20% - 20px);margin:0px;width:200px;position:absolute;top:0;left:0;}.smashCont>.smashName{width:160px;height:40px;font-size:18px;text-align:center;line-height:40px;font-weight:600;color:#616161;}#buttonList{width:200px;height:100%;position:fixed;right:0;top:0;background:#eee;z-index:99999;text-align:center;overflow:hidden;}.sbutt{cursor: pointer;position:relative;display:block;color:white;font-size:28px;margin:10px ;border-radius:10px;height:calc(20% - 12px);line-height:18vh;overflow:hidden;}.smashCont{justify-content:space-around;width:160px;height:200px;margin:10px;background:#ccc;border-radius:5px;}#smashList{display:flex;justify-content:space-around!important;flex-wrap:wrap;width:200px;height:calc(100% - 40px);padding-top:40px;position:fixed;left:0;top:0;background:#eee;z-index:99999;overflow-y:scroll;}</style>";
$('body').append("<style>body{background:'#313131';}#expandButton{width:160px;line-height:20px;height:20px;margin:10px;position:absolute;top:0;left:0;background:#ccc;border-radius:5px;text-align:center;color:#616161}</style>");
$('body').append("<style>[mongender='F']{background:rgba(255,200,200,1)!important;}[mongender='M']{background:rgba(200,200,255,1)!important;}#smash{font-size:28px;height:20%;margin:12px;border-radius:10px;overflow:hidden;}.smashM,.smashF{cursor:pointer;line-height:5vh;display:block;height:25%;width:50%;float:left;background:rgba(0,0,0,0);}.smashM{background:#0072b0}.smashF{background:#dd2d51}.smashAll{cursor:pointer;line-height:15vh;display:block;height:75%!important;width:100%;background:rgba(0,0,0,0);}</style>");
$('body').append(stylesheet);
$('body').append("<div id='buttonList'><div id='smash' class='' style=''><div class='smashAll' style='background:#E3350D'>Smash</div><div class='smashM'>M</div><div class='smashF'>F</div></div> <a id='pass' class='sbutt' style='background:#30a7d7;'>Pass</a><a id='clearAll' class='sbutt' style='background:#777;'>Clear All</a><a id='screenshot' class='sbutt' style='background:#444;'>Screenshot</a><a id='output' class='sbutt' style='font-size:24px;background:#222;'>Image Output</a></div>");
var smashList = "<div id='smashList'><div id='expandButton' style='cursor:pointer;'>Expand/Shrink</div>";
for(var i=0;i<arr.length;i++){var entry = arr[i].split(',');var p = entry[0].slice(0,-4);p = p.substr(-3);smashList = smashList + "<div class='smashCont' monGender='"+entry[2]+"' monName='"+entry[1]+"'><img src='"+entry[0]+"'></img><div class='smashName'>#"+p+": "+entry[1]+"</div></div>";
                             if(entry[2]=='A'){listOfIndexesA = listOfIndexesA+',.results>li:nth-of-type('+p+')';}
                             if(entry[2]=='M'){listOfIndexesM = listOfIndexesM+',.results>li:nth-of-type('+p+')';}
                             if(entry[2]=='F'){listOfIndexesF = listOfIndexesF+',.results>li:nth-of-type('+p+')';}
                             }

$('body').append("<style>"+listOfIndexesA+"{background:rgba(0,0,0,0.1);border-radius:5px;}"+listOfIndexesM+"{background:rgba(0,0,255,0.1);border-radius:5px;}"+listOfIndexesF+"{background:rgba(255,0,0,0.1);border-radius:5px;};</style>");
smashList = smashList+"</div>";$('body').append(smashList);


//bonus CSS
if(mainPage==false){$('body').append("<style>#user-dashboard,#gus-wrapper,.pokedex-pokemon-evolution,.slider-widget,.footer-divider,.global-footer,[class='section pokedex-pokemon-share no-padding-top']{display:none;}[class='section pokedex-pokemon-header overflow-visible']{padding-top:10px!important}[class='container       pokedex']{height:calc(100vh - 120px)!important;margin-top:15px;min-height:100%!important;}</style>");}
if(mainPage==true){$('body').append("<style>#user-dashboard,#gus-wrapper,.global-footer,[class='mosaic section pokedex-promo']{display:none!important}.footer-divider{opacity:0;}#output{height:calc(20% - 30px)!important;line-height:17vh</style>");}

}

$(document).ready(function(){
main();
var next = $('.pokedex-pokemon-pagination>a:nth-of-type(2)').attr('href');
$('#smashList').scrollTop($('#smashList')[0].scrollHeight);
    //no idea why these auto fire otherwise
if(mainPage){
$('#loadMore').trigger('click');
$('body').append('<style>#pass,#smash{pointer-events:none;filter:greyscale(1);-webkit-filter: grayscale(1);cursor: not-allowed;}</style>');
}
else{
var gender = ($('.column-7:nth-of-type(1)>ul>li:nth-of-type(3) .attribute-value').html()).trim().replace(/(\r\n|\n|\r)/gm, "");
if (gender=='Unknown'){console.log('unknown');$('body').append("<style>.smashM,.smashF{pointer-events:none;filter:greyscale(1);-webkit-filter: grayscale(1);cursor: not-allowed;}</style>")};
if (gender=='<i class="icon icon_male_symbol"></i>    <i class="icon icon_female_symbol"></i>'){console.log('both');}
if (gender=='<i class="icon icon_male_symbol"></i>'){console.log('male only');$('body').append("<style>.smashAll,.smashF{pointer-events:none;filter:greyscale(1);-webkit-filter: grayscale(1);cursor: not-allowed;}</style>")}
if (gender=='<i class="icon icon_female_symbol"></i>'){console.log('female only');$('body').append("<style>.smashAll,.smashM{pointer-events:none;filter:greyscale(1);-webkit-filter: grayscale(1);cursor: not-allowed;}</style>")}
const smashButton = $(".smashAll");$(smashButton).click(() => smashListAdd('A'));
const smashButtonM = $(".smashM");$(smashButtonM).click(() => smashListAdd('M'));
const smashButtonF = $(".smashF");$(smashButtonF).click(() => smashListAdd('F'));

const passButton = $("#pass");$(passButton).click(() => loadNext());
}
const clearButton = $("#clearAll");$(clearButton).click(() => clearAll());

$("#expandButton").click(function(){$('#smashList').toggleClass('screenshotEnabled');});


$("#screenshot").click(function(){
    if(mainPage){alert('Only works with a dex entry open. Dunno why.')}
    else{
    const node= document.getElementById('smashList');
    $('#smashList').toggleClass('screenshotEnabled');
    $('#output canvas').remove();
    html2canvas(node, { allowTaint: true, useCORS: false }).then(canvas => {document.getElementById('output').appendChild(canvas); $('#smashList').toggleClass('screenshotEnabled');})
    }
})
    $(".smashCont").click(function(){
    var monName = $(this).attr('monName');
    var filteredArray = arr.filter(function(elem){return elem.indexOf(monName) == -1});arr = filteredArray;
    $(this).css('display','none');
    GM_setValue('arr', JSON.stringify(filteredArray));
})

function clearAll(){if (confirm("Are you sure?")) {arr=[];GM_setValue('arr',arr);$('.smashCont').remove();$('#smashList').append("<div id='expandButton'>Expand/Shrink</div>");}
else {}
                   }
function smashListAdd(gend){console.log('trying to add with gend = '+gend);try { arr = JSON.parse(GM_getValue('arr', '[]')); }catch (_ignore) {} var currentElement = $(".profile-images img");arr.push(""+$(currentElement).attr("src") + ","+ $(currentElement).attr("alt")+","+gend);GM_setValue('arr', JSON.stringify(arr));loadNext();}
function loadNext(){GM_setValue('arr', JSON.stringify(arr));location.href=next;}
});