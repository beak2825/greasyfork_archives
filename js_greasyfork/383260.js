// ==UserScript==
// @name         FADE
// @namespace    https://steamcommunity.com/id/_DioniS_/
// @namespace    https://csgopatterns.ga
// @version      1.0
// @description  Script for auto find rare pattern!
// @author       DioniS (CS:GO Patterns)
// @include      https://steamcommunity.com/market/listings/730/*Karambi*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Ursus*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Navaja*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Stiletto*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Talon*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Bowie*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Shadow*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Falchion*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Butterfly*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Huntsman*Fade*
// @include      https://steamcommunity.com/market/listings/730/*M9*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Bayonet*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Flip*Fade*
// @include      https://steamcommunity.com/market/listings/730/*Gut*Fade*
// @exclude      https://steamcommunity.com/market/listings/730/*Marble*Fade*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383260/FADE.user.js
// @updateURL https://update.greasyfork.org/scripts/383260/FADE.meta.js
// ==/UserScript==
// _____  _____   _____ _____    ______     _   _
///  __ \/  ___|_|  __ \  _  |   | ___ \   | | | |
//| /  \/\ `--.(_) |  \/ | | |   | |_/ /_ _| |_| |_ ___ _ __ _ __  ___
//| |     `--. \ | | __| | | |   |  __/ _` | __| __/ _ \ '__| '_ \/ __|
//| \__/\/\__/ /_| |_\ \ \_/ /   | | | (_| | |_| ||  __/ |  | | | \__ \
// \____/\____/(_)\____/\___/    \_|  \__,_|\__|\__\___|_|  |_| |_|___/
//
var sed=[146,602,393,994,359,541,688,129,792,412,281,743,787,241,182,332,16,628,152,701,673,292,204,344,649,923,908,705,777,918,780,356,126];
var sed1=[652,252,832,988,457,685,660,112,522,773,736,982,578,873,340,230,48,274,607,795,471,867,452,621,653,874,761,826,683,14,770,949,454];
var sed2=[803,1000,243,108,876,32,58,444,614,213,728,631,405,696,8,461,233,854,202,337,702,5,971,378,539,178,966,171,672,732,188,370,493];
var sed3=[406,922,287,149,655,165,997,817,516,959,591,121,589,637,546,238,656,545,706,766,977,559,844,68,402,351,499,206,632,329,976,868,28];
var sed4=[809,791,372,195,156,972,177,785,397,90,459,725,203,553,962,483,441,232,756,941,753,473,764,727,710,626,858,537,561,818,909,590,254];
var sed5=[404,805,125,810,930,674,110,27,309,485,691,869,315,647,980,448,183,400,196,9,496,948,321,307,216,989,60,535,328,463,746,663,364];
var sed6=[234,333,71,506,222,266,411,170,582,794,717,413,445,958,62,415,353,845,605,670,931,846,667,812,438,630,570,138,334,3,822,723,907];
var sed7=[354,296,304,0,1,98,489,555,624,148,385,569,335,894,253,368,515,593,606,611,899,311,102,451,547,388,54,142,767,436,42,280,939];
var sed8=[269,642,598,783,507,262,853,4,693,45,733,384,579,532,552,479,258,709,96,185,387,678,929,143,540,425,164,217,310,162,189,151,20];
var sed9=[820,716,530,246,776,160,689,580,843,680,66,480,325,49,218,184,220,450,373,560,88,616,610,113,730,250,574,998,174,284,394,303,744];
var sed10=[193,369,24,504,627,464,992,286,551,119,443,969,477,529,226,498,116,492,865,715,531,419,409,106,699,235,750,919,999,7,166,594,31];
var sed11=[935,374,951,816,857,190,861,432,954,526,852,13,290,646,893,859,360,265,720,684,408,659,928,194,383,209,694,973,72,59,839,423,638];
var sed12=[913,153,883,39,259,600,410,134,44,237,371,352,896,595,77,434,349,490,469,603,317,279,772,355,731,75,510,983,83,248,115,221,544];
var sed13=[926,650,871,244,502,484,986,711,927,231,634,721,855,306,558,952,523,386,675,478,132,784,186,788,398,476,534,890,339,862,263,542,679];
var sed14=[497,708,739,197,557,219,519,562,472,198,127,796,159,669,467,169,407,208,585,242,330,417,362,456,17,135,681,131,748,320,268,275,692];
var sed15=[338,101,122,180,420,987,158,671,509,261,779,503,474,704,505,144,609,15,622,225,100,682,288,495,623,366,247,937,120,92,581,833,426];
var sed16=[500,305,99,316,768,35,985,965,755,81,945,771,391,563,319,882,418,934,618,331,239,36,215,786,565,724,643,74,501,906,264,123,957];
var sed17=[713,70,938,199,192,56,267,128,26,543,40,775,257,524,270,615,322,86,620,879,880,245,842,124,932,367,707,350,888,836,635,460,52];
var sed18=[662,55,363,25,200,346,900,831,870,847,722,625,814,718,347,830,850,970,69,700,51,365,799,82,214,548,619,905,85,327,644,819,889];
var sed19=[877,963,613,91,297,567,19,533,207,629,133,778,765,797,823,741,38,837,390,97,841,964,950,10,255,300,641,439,676,729,50,735,175];
var sed20=[67,617,379,139,967,65,554,734,357,140,228,695,738,903,61,271,95,272,947,996,427,829,904,661,828,294,53,475,573,978,343,318,2];
var sed21=[301,491,453,470,437,251,518,414,512,291,584,118,298,654,167,801,114,592,912,78,556,604,240,804,946,920,323,588,991,431,924,885,342];
var sed22=[864,901,806,737,884,666,163,633,63,760,902,549,942,273,312,382,697,57,802,916,974,866,187,835,111,18,23,596,277,851,984,886,933];
var sed23=[645,995,990,921,179,421,774,117,528,416,821,808,289,376,389,769,79,176,758,299,955,104,895,740,658,993,757,157,442,815,446,979,433];
var sed24=[752,863,22,276,487,324,587,811,47,698,154,860,392,361,37,878,285,336,875,191,293,161,538,898,953,782,719,227,612,424,429,212,513];
var sed25=[586,762,687,109,210,155,33,481,960,76,302,790,887,915,564,6,749,103,94,168,568,12,458,440,466,525,73,798,295,677,89,686,508];
var sed26=[381,430,30,377,145,260,536,891,511,566,940,282,759,488,283,130,21,223,514,813,665,181,211,608,64,43,314,249,917,597,640,447,173];
var sed27=[172,572,726,712,80,881,657,229,435,455,308,236,401,482,358,838,703,313,136,462,11,849,395,465,46,690,278,137,956,840,224,29,141];
var sed28=[781,827,599,751,789,375,872,486,150,345,793,449,84,399,824,754,639,856,936,396,968,550,494,914,201,571,747,517,147,577,800,943,981];
var sed29=[107,745,34,668,664,105,428,834,925,422,975,714,944,648,848,380,576,825,256,521,807,326,911,205,583,41,601,897,87,527,651,742,892];
var sed30=[468,348,341,910,636,403,520,961,93,575,763];
function c() {
    var items = document.getElementsByClassName("market_actionmenu_button");
    var ids = [];
    for (let i=0;i<items.length;i++)
        ids.push(items[i].id);
    var buttons = document.getElementsByClassName("market_listing_item_name_block");
    for(let i = 0; i < buttons.length-1; i++) {

        b(i);
    }
}

function b(i) {
   var keys = Object.keys(g_rgAssets[730][2]);
   var link = g_rgAssets[730][2][keys[i]].market_actions[0].link;
    link = link.replace('%assetid%', keys[i]);
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.csgofloat.com/?url=' + link,
        onload: response => {
            response = JSON.parse(response.response);
            var seed = response.iteminfo.paintseed;
            for(let j=0;j<40;j++){
if(seed==sed[j]){
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="70% FADE";
}
                if(seed==sed1[j]){
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="71% FADE";
}
                if(seed==sed2[j]){
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="72% FADE";
}
                if(seed==sed3[j]){
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="73% FADE";
}
                if(seed==sed4[j]){
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="74% FADE";
}
                if(seed==sed5[j]){
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="75% FADE";
}
                if(seed==sed6[j]){
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="76% FADE";
}
                if(seed==sed7[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="77% FADE";
}
                if(seed==sed8[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="78% FADE";
}
                if(seed==sed9[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="79% FADE";
}
                if(seed==sed10[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="80% FADE";
}
                if(seed==sed11[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="81% FADE";
}
                if(seed==sed12[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="82% FADE";
}
                if(seed==sed13[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="83% FADE";
}
                if(seed==sed14[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="84% FADE";
}
                if(seed==sed15[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="85% FADE";
}
                if(seed==sed16[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="86% FADE";
}
                if(seed==sed17[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="87% FADE";
}
                if(seed==sed18[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="88% FADE";
}
                if(seed==sed19[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="89% FADE";
}
                if(seed==sed20[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="90% FADE";
}
                if(seed==sed21[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="91% FADE";
}
                if(seed==sed22[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="92% FADE";
}
                if(seed==sed23[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="93% FADE";
}
                if(seed==sed24[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="94% FADE";
}
                if(seed==sed25[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="95% FADE";
}
                if(seed==sed26[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="96% FADE";
}
                if(seed==sed27[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="97% FADE";
}
                if(seed==sed28[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="98% FADE";
}
                if(seed==sed29[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="99% FADE";
}
                                if(seed==sed30[j]){

    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="100% FADE";
}
            }
        }

    });
    document.getElementsByClassName('market_listing_price')[i*3].innerHTML=document.getElementsByClassName('market_listing_price')[i*3].innerHTML+" ✓";
}
var button_node = document.createElement("a");
button_node.onclick = c;
button_node.innerText = "Check";
button_node.setAttribute("class", "btn_green_white_innerfade btn_medium market_noncommodity_buyorder_button");
button_node.style = "line-height: 30px;font-size: 15px;width:120px;text-align:center";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(button_node);