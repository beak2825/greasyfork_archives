// ==UserScript==
// @name         web版小說 - 字數切割內文📄
// @description  貼上到翻譯網站的工具
// @namespace    copy_0x408B769E
// @author       Covenant
// @version      1.0.5
// @license      MIT
// @homepage
// @match        *://*/*/*/
// @icon         data:image/x-icon;base64,AAABAAMAEBAAAAEAIABoBAAANgAAACAgAAABACAAqBAAAJ4EAAAwMAAAAQAgAKglAABGFQAAKAAAABAAAAAgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAH//vs1////nf/+/NP////1////9f/+/NP///+d//77NQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///+d//////////////////////////////////////////////+dAAAAAQAAAAEAAAABAAAAAQAAAAH//vzT////////////////+ffk//n35P/////////////////////////////+/NMAAAABAAAAAQAAAAH///+d///////////z7sf/8+7H//Pux//59+T/8+7H/+7mrv//////////////////////////nQAAAAH//vs1+ffk/+7mrv/z7sf/8+7H//n35P///////////+bai//GrQL/8+7H/////////////////////////vs1+fbjofPux//m2ov/5tqL///////////////////////u5q7/xq0C//Pux///////////////////////////nf/+/NP59+T///////Pux//XxUX/+ffk/////////////////9fFRf/z7sf////////////z7sf/8+7H///+/NP////1////////////////7uau/8y1Gf////////////n35P/MtRn/3s9m////////////zLUZ/8y1Gf/////1////9f/////////////////////XxUX/18VF////////////xq0C/8y1Gf///////////8atAv/m2ov/////9f/+/NP//////////////////////////7iYAP/m2ov//////97PZv/XxUX//////+bai//XxUX////////+/NP///+d///////////////////////////m2ov/7uau///////ez2b/zLUZ//Pux//z7sf///////////////+d//77Nf//////////////////////////////////////////3s9m/7iYAP/m2ov///////////////////77NQAAAAH///+d/////////////////////////////////////+bai/+4mAD/18VF////////////////nQAAAAEAAAABAAAAAf/+/NP////////////////////////////////59+T/5tqL/+7mrv////////780wAAAAEAAAABAAAAAQAAAAEAAAAB////nf//////////////////////////////////////////////nQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH//vs1////nf/+/NP////1////9f/+/NP///+d//77NQAAAAEAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAACAAAABAAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///0h///9Wf79+J3////N////7f///+3////t////7f///83+/fid///9Wf///SEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///0h/v34nf///+3///////////////////////////////////////////////////////////79+J3///0hAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB////if/////////////////////////////////////////////////////////////////////////////////////+/fidAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB///9If///83////////////////////////////////////////////////////////////////////////////////////////////////////N///9IQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf///SH////t///////////////////////////////////////////////////////////////////////////////////////////////////////////////////9IQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///0h////7f////////////////////////////////////////////////by1v/28tb/9vLW///////////////////////////////////////////////////////////////9IQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf///83/////////////////////////////////////7uev/+nfmf/p35n/7uev//by1v/28tb/9vLW/+7nr//////////////////////////////////////////////////////tAAAAAQAAAAEAAAABAAAAAQAAAAH///+J////////////////////////////////6d+Z/+DSb//p35n/9vLW///////////////////////28tb/z7oj//by1v/////////////////////////////////////////////////+/fidAAAAAQAAAAEAAAAB///9Ie7nr//28tb/////////////////7uev/+DSb//p35n/9vLW/////////////////////////////////+DSb//HrQP/z7oj//by1v////////////////////////////////////////////////////0hAAAAAQAAAAH+/fid7uev/+nfmf/p35n/7uev/+nfmf/p35n/9vLW///////////////////////////////////////28tb/x60D/+DSb//PuiP/4NJv//////////////////////////////////////////////////79+J0AAAABAAAAAf//////////9vLW/+DSb//PuiP/2MZI///////////////////////////////////////////////////////PuiP/4NJv/9jGSP/p35n//////////////////////////////////////////////////////wAAAAH///1Z9vLW/+7nr//p35n/9vLW///////p35n/z7oj//by1v////////////////////////////////////////////by1v/HrQP/x60D//by1v/////////////////////////////////////////////////////////9Wf79+J3u56//9vLW///////////////////////p35n/x60D/+7nr////////////////////////////////////////////8+6I/+9oAD/9vLW///////////////////////////////////////////////////////+/fid////zf/////////////////////////////////////p35n/vaAA/+7nr///////////////////////////////////////6d+Z/+DSb//u56/////////////////////////////28tb/z7oj/+DSb////////////////83////t///////////////////////////////////////////g0m//vaAA/+7nr/////////////////////////////by1v/Yxkj/z7oj/8etA//28tb//////////////////////+nfmf+9oAD/vaAA/+7nr///////////7f///+3////////////////////////////////////////////////PuiP/vaAA//by1v//////////////////////9vLW/8etA//HrQP/x60D/+nfmf//////////////////////4NJv/8etA//HrQP/7uev///////////t////7f////////////////////////////////////////////////by1v+9oAD/z7oj////////////////////////////z7oj/8etA//HrQP/4NJv///////////////////////Yxkj/x60D/8etA//28tb//////////+3////t/////////////////////////////////////////////////////9jGSP+9oAD/2MZI///////////////////////Yxkj/x60D/8etA//PuiP//////////////////////8+6I/+9oAD/4NJv////////////////7f///83/////////////////////////////////////////////////////9vLW/8etA/+9oAD/7uev/////////////////9jGSP/HrQP/z7oj/+DSb//////////////////p35n/vaAA/9jGSP/////////////////////N/v34nf//////////////////////////////////////////////////////////2MZI/72gAP+9oAD/6d+Z////////////7uev/+DSb//g0m//4NJv//by1v///////////8etA//PuiP///////////////////////79+J3///1Z///////////////////////////////////////////////////////////p35n/vaAA/9jGSP/u56/////////////p35n/x60D/8etA/+9oAD/6d+Z///////g0m//2MZI///////////////////////////////9WQAAAAH///////////////////////////////////////////////////////////by1v/28tb//////////////////////+nfmf/HrQP/z7oj/8etA//g0m////////by1v////////////////////////////////8AAAABAAAAAf79+J3/////////////////////////////////////////////////////////////////////////////////////7uev/8etA//PuiP/x60D/9jGSP///////////////////////////////////////v34nQAAAAEAAAAB///9If/////////////////////////////////////////////////////////////////////////////////////28tb/x60D/8etA//HrQP/z7oj//////////////////////////////////////////0hAAAAAQAAAAEAAAAB////if/////////////////////////////////////////////////////////////////////////////////////PuiP/x60D/8etA//HrQP/9vLW////////////////////////////////iQAAAAEAAAABAAAAAQAAAAEAAAAB////zf///////////////////////////////////////////////////////////////////////////////8+6I/+9oAD/x60D/72gAP/p35n//////////////////////////80AAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///0h////7f//////////////////////////////////////////////////////////////////////////6d+Z/8+6I//Yxkj/z7oj/+nfmf/////////////////////t///9IQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///0h////7f//////////////////////////////////////////////////////////////////////////////////////////////////////////////7f///SEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///0h////zf///////////////////////////////////////////////////////////////////////////////////////////////////83///0hAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB////if////////////////////////////////////////////////////////////////////////////////////////+JAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB///9If///4n////t/////////////////////////////////////////////////////////+3+/fid///9IQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///1Z/v34nf///83////t////7f///+3////t////zf79+J3///1ZAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAwAAAAYAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf///yP//vth////rf///9P////T////7////+/////v////7////9P////T////rf/++2H///8jAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf///yP///2F////0///////////////////////////////////////////////////////////////////////////////0////YX///8jAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///8j////rf//////////////////////////////////////////////////////////////////////////////////////////////////////////////rf///yMAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf///YX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2FAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///8j////0///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0////yMAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf/++2H//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////vthAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB//77Yf/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9hQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH//vth/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////YUAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf/++2H/////////////////////////////////////////////////////////////////////////////////////+PTc//j03P/w6rv/+PTc/////////////////////////////////////////////////////////////////////////////////////////vthAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB////I//////////////////////////////////////////////////////////////////////w6rv/6N2U/+jdlP/o3ZT/6N2U//Dqu//w6rv/+PTc//j03P/o3ZT/////////////////////////////////////////////////////////////////////////////////////IwAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB////0//////////////////////////////////////////////////////49Nz/39Bq/9/Qav/o3ZT/6N2U//Dqu/////////////////////////////Dqu//OuBr/8Oq7////////////////////////////////////////////////////////////////////////////////7wAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH//vth////////////////////////////////////////////////8Oq7/9/Qav/WxET/6N2U//j03P///////////////////////////////////////////+jdlP/OuBr/1sRE/////////////////////////////////////////////////////////////////////////////////////YUAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH49Nz///////////////////////////////////////j03P/f0Gr/1sRE/+jdlP///////////////////////////////////////////////////////////864Gv/WxET/zrga/864Gv////////////////////////////////////////////////////////////////////////////////////8jAAAAAQAAAAEAAAABAAAAAeXaiZff0Gr/39Bq/+jdlP/49Nz/////////////////39Bq/9bERP/o3ZT/////////////////////////////////////////////////////////////////6N2U/8SqAf/WxET/1sRE/8SqAf/f0Gr///////////////////////////////////////////////////////////////////////////////+tAAAAAQAAAAEAAAABAAAAAf//////////8Oq7/+jdlP/f0Gr/6N2U//Dqu//f0Gr/39Bq//j03P//////////////////////////////////////////////////////////////////////39Bq/8SqAf/f0Gr/6N2U/8SqAf/WxET/////////////////////////////////////////////////////////////////////////////////////IwAAAAEAAAAB//77Yf/////////////////////w6rv/xKoB/8SqAf/WxET/////////////////////////////////////////////////////////////////////////////////8Oq7/8SqAf/o3ZT//////8SqAf/f0Gr////////////////////////////////////////////////////////////////////////////////////9hQAAAAEAAAAB////0///////////+PTc/9/Qav/f0Gr/8Oq7//j03P/WxET/zrga//j03P///////////////////////////////////////////////////////////////////////////9bERP/EqgH/1sRE/8SqAf/o3ZT/////////////////////////////////////////////////////////////////////////////////////0wAAAAH///8j+PTc//Dqu//o3ZT/39Bq/+jdlP//////////////////////zrga/8SqAf/w6rv///////////////////////////////////////////////////////////////////////Dqu//EqgH/xKoB/8SqAf/w6rv//////////////////////////////////////////////////////////////////////////////////////////yP//vth39Bq/+jdlP/w6rv//////////////////////////////////////9/Qav/EqgH/6N2U///////////////////////////////////////////////////////////////////////OuBr/xKoB/8SqAf/o3ZT////////////////////////////////////////////////////////////////////////////////////////++2H///2F///////////////////////////////////////////////////////////WxET/xKoB/9/Qav/////////////////////////////////////////////////////////////////WxET/xKoB/864Gv/w6rv/////////////////////////////////////////////////+PTc/+jdlP/49Nz//////////////////////////63///+t////////////////////////////////////////////////////////////////1sRE/8SqAf/f0Gr////////////////////////////////////////////////////////////49Nz/6N2U/+jdlP/o3ZT/8Oq7////////////////////////////////////////////1sRE/8SqAf/EqgH/8Oq7/////////////////////9P////T/////////////////////////////////////////////////////////////////////864Gv/EqgH/39Bq//////////////////////////////////////////////////Dqu//WxET/zrga/864Gv/EqgH/zrga///////////////////////////////////////49Nz/xKoB/8SqAf/EqgH/zrga/////////////////////9P////v//////////////////////////////////////////////////////////////////////Dqu//EqgH/xKoB/9/Qav///////////////////////////////////////////+jdlP/EqgH/xKoB/864Gv/EqgH/zrga///////////////////////////////////////w6rv/xKoB/864Gv/EqgH/zrga/////////////////////+/////v///////////////////////////////////////////////////////////////////////////f0Gr/xKoB/8SqAf/o3ZT///////////////////////////////////////j03P/OuBr/xKoB/864Gv/OuBr/xKoB//j03P/////////////////////////////////o3ZT/xKoB/864Gv/EqgH/zrga/////////////////////+/////v////////////////////////////////////////////////////////////////////////////////zrga/8SqAf/EqgH/+PTc///////////////////////////////////////OuBr/xKoB/864Gv/OuBr/xKoB//Dqu//////////////////////////////////f0Gr/xKoB/864Gv/EqgH/1sRE/////////////////////+/////v////////////////////////////////////////////////////////////////////////////////39Bq/8SqAf/EqgH/zrga///////////////////////////////////////WxET/xKoB/864Gv/OuBr/xKoB/9/Qav/////////////////////////////////WxET/xKoB/864Gv/EqgH/8Oq7/////////////////////+/////T/////////////////////////////////////////////////////////////////////////////////////864Gv/EqgH/xKoB/9bERP/////////////////////////////////f0Gr/xKoB/864Gv/OuBr/xKoB/9bERP////////////////////////////j03P/EqgH/zrga/8SqAf/f0Gr//////////////////////////9P///+t/////////////////////////////////////////////////////////////////////////////////////+jdlP/EqgH/zrga/8SqAf/o3ZT////////////////////////////f0Gr/xKoB/8SqAf/EqgH/xKoB/864Gv///////////////////////////9/Qav/EqgH/xKoB/864Gv///////////////////////////////9P///2F///////////////////////////////////////////////////////////////////////////////////////////OuBr/xKoB/8SqAf/EqgH/+PTc///////////////////////o3ZT/zrga/9/Qav/o3ZT/6N2U//Dqu////////////////////////////864Gv/EqgH/zrga//j03P///////////////////////////////63//vth///////////////////////////////////////////////////////////////////////////////////////////f0Gr/xKoB/864Gv/EqgH/xKoB//Dqu//////////////////49Nz/8Oq7//Dqu//o3ZT/6N2U/9bERP/w6rv/////////////////6N2U/8SqAf/OuBr/+PTc///////////////////////////////////++2H///8j///////////////////////////////////////////////////////////////////////////////////////////w6rv/xKoB/8SqAf/EqgH/1sRE//j03P/////////////////w6rv/xKoB/8SqAf/EqgH/xKoB/8SqAf/f0Gr////////////w6rv/xKoB/9bERP///////////////////////////////////////////////yMAAAAB////0///////////////////////////////////////////////////////////////////////////////////////////1sRE/9/Qav/49Nz////////////////////////////w6rv/xKoB/864Gv/OuBr/zrga/8SqAf/WxET////////////o3ZT/39Bq////////////////////////////////////////////////0wAAAAEAAAAB//77Yf/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////49Nz/zrga/8SqAf/OuBr/zrga/8SqAf/OuBr///////////////////////////////////////////////////////////////////77YQAAAAEAAAABAAAAAf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zrga/8SqAf/OuBr/zrga/8SqAf/OuBr/+PTc////////////////////////////////////////////////////////////AAAAAQAAAAEAAAABAAAAAf///YX/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1sRE/8SqAf/OuBr/zrga/864Gv/EqgH/6N2U//////////////////////////////////////////////////////////+tAAAAAQAAAAEAAAABAAAAAQAAAAH/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1sRE/8SqAf/OuBr/zrga/864Gv/EqgH/39Bq//////////////////////////////////////////////////////////8jAAAAAQAAAAEAAAABAAAAAQAAAAH//vth////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6N2U/8SqAf/OuBr/zrga/864Gv/EqgH/39Bq/////////////////////////////////////////////////////YUAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB////0///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6N2U/8SqAf/OuBr/zrga/864Gv/EqgH/1sRE////////////////////////////////////////////////0wAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB////I///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8Oq7/8SqAf/OuBr/zrga/864Gv/EqgH/zrga//j03P//////////////////////////////////////////IwAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf///yP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////864Gv/EqgH/xKoB/8SqAf/EqgH/xKoB//Dqu////////////////////////////////////vthAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH//vth//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////j03P/w6rv/8Oq7//j03P/49Nz/8Oq7///////////////////////////////////++2EAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAB//77Yf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////77YQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf/++2H////v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////vthAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///8j////0///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0////yMAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf/++2H////v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////vthAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH///8j///9hf///+/////////////////////////////////////////////////////////////////////////////////////////////////////v///9hf///yMAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAH//vth////rf//////////////////////////////////////////////////////////////////////////////rf/++2EAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAf///yP//vth///9hf///63////T////7////+/////v////7////9P///+t///9hf/++2H///8jAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/460646/web%E7%89%88%E5%B0%8F%E8%AA%AA%20-%20%E5%AD%97%E6%95%B8%E5%88%87%E5%89%B2%E5%85%A7%E6%96%87%F0%9F%93%84.user.js
// @updateURL https://update.greasyfork.org/scripts/460646/web%E7%89%88%E5%B0%8F%E8%AA%AA%20-%20%E5%AD%97%E6%95%B8%E5%88%87%E5%89%B2%E5%85%A7%E6%96%87%F0%9F%93%84.meta.js
// ==/UserScript==
function katakanaToRomajiText(m){
    var katakana = ['ア', 'イ', 'ウ', 'エ', 'オ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ',
                    'カ', 'キ', 'ク', 'ケ', 'コ', /*'ヵ', 'ヶ',*/
                    'サ', 'シ', 'ス', 'セ', 'ソ',
                    'タ', 'チ', 'ツ', 'テ', 'ト', 'ッ',
                    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
                    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
                    'マ', 'ミ', 'ム', 'メ', 'モ',
                    'ラ', 'リ', 'ル', 'レ', 'ロ',
                    'ヤ', 'ユ', 'ヨ', 'ャ', 'ュ', 'ョ',
                    'ワ', 'ヲ', 'ヴ', 'ヮ', 'ヰ', 'ヱ',
                    'ン', 'ヷ', 'ヺ', 'ヸ', 'ヹ', 'ー',
                    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
                    'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
                    'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
                    'バ', 'ビ', 'ブ', 'ベ', 'ボ',
                    'パ', 'ピ', 'プ', 'ペ', 'ポ',
                    '・'];
    var romaji = ['a', 'i', 'u', 'e', 'o','a', 'i', 'u', 'e', 'o',
                  'ka', 'ki', 'ku', 'ke', 'ko', /*'ka', 'ke',*/
                  'sa', 'shi', 'su', 'se', 'so',
                  'ta', 'chi', 'tsu', 'te', 'to', '·',
                  'ha', 'hi', 'hu', 'he', 'ho',
                  'na', 'ni', 'nu', 'ne', 'no',
                  'ma', 'mi', 'mu', 'me', 'mo',
                  'la', 'li', 'lu', 'le', 'lo',
                  'ya', 'yu', 'yo','ya', 'yu', 'yo',
                  'wa', 'wo', 'v', 'wa', 'wyi', 'wye',
                  'n', 'va', 'vo', 'vi', 've', '',
                  'ga', 'gi', 'gu', 'ge', 'go',
                  'za', 'ji', 'zu', 'ze', 'zo',
                  'da', 'di', 'du', 'de', 'do',
                  'ba', 'bi', 'bu', 'be', 'bo',
                  'pa', 'pi', 'pu', 'pe', 'po',
                  '・'];
    var katakanaMap = {};
    for (var i in romaji){
        katakanaMap[katakana[i]] = romaji[i];
    }
    //
    var sa = [];
    for (let i = 0; i < m.length; i++) {
        sa.push(katakanaMap[m.charAt(i)]);
    }
    return sa.join('');
}
//
var ary_btn=[];
var url=fn_url(document.location);
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
const font_family_default="font-family: 'Noto Sans','Segoe UI','Roboto_Regular','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','Noto Sans Symbols','Noto Sans Symbols2','symbol_emoji','emoji_back',sans-serif;";
const font_family_panel="font-family: 'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','DroidSans_Mono','Courier New','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','Noto Sans Symbols','Noto Sans Symbols2','symbol_emoji','color_emoji','emoji_back',sans-serif;";
const font_family_condensed="font-family: 'Noto Sans','DejaVu Sans','Firple Slim','Segoe UI','Roboto_Regular','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','Noto Sans Symbols','Noto Sans Symbols2','symbol_emoji','emoji_back',sans-serif;";
const font_family_jp_custom="font-family: 'JiyunoTsubasaFont','Noto Sans','Segoe UI','Roboto_Regular','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','Noto Sans Symbols','Noto Sans Symbols2','symbol_emoji','emoji_back',sans-serif;";
const font_face_default=`@font-face{font-family: 'JiyunoTsubasaFont';src: url('https://cdn.leafscape.be/JiyunoTsubasa/JiyunoTsubasa_web.woff2') format("woff2");font-display: swap;}`;
var style_font_face;
var style_user_css;
if(JenkHash(url[0].host)[2]==1082881694){
    style_font_face=create_style(font_face_default,"gm_font_face_copy_0x852922BC_innerText",["user_gm_font_face","css_copy_0x852922BC_innerText"]);
    style_user_css=create_style(".user_btn_10em{"+font_family_jp_custom+"cursor: pointer;}\n","gm_user_css_copy_0x852922BC_innerText",["user_gm_css","css_copy_0x852922BC_innerText"]);//questions/25105736/
    style_user_css.textContent+=`.user_btn_10em{min-width: 10em; height: 25px;padding: 0.1rem 0.5rem;color: #EFEFEF;background: #303030;border-color: #707070;border-radius: 4px;}
.user_input_200{`+font_family_panel+`font-weight: 100;}
.user_input_200{color: #EFEFEF; background: #303030;border-color: #707070;border-radius: 0.5rem;border-width: 0.2rem;border-style: inset;font-size: 200%;}
input.user_input_200:focus{border-style: inset !important;border-width: 0.2rem !important;border-color: #d0d000 !important;}/*[class~='user_input_200']*/
input.user_input_200:focus{outline-style: inset;outline-color: #d0d000;/*outline-offset: 2px;*/}\n`;
}
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_input(placeholder,class_name,is_num,is_appendChild,node,refNode){
    let input=create_node("Input",class_name,is_appendChild,node,refNode);
    input.placeholder=placeholder;
    input.type="text";
    if(is_num)input.size="10";
    if(is_num)input.setAttribute("maxlength", "10");
    //if(is_num)input.setAttribute("oninput","this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\..*/g, '$1');");
    if(is_num){
        input.addEventListener("input", function (e) {
            this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\..*/g, '$1');
        });
    }return input;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
}
function create_node_text(tagname,innerText,class_name,is_appendChild,node,refNode){
    let element=create_node(tagname,class_name,is_appendChild,node,refNode);
    element.innerText=innerText;
    element.lang='ja';
    return element;
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
function JenkHash(key,is_toLowerCase){
    function parseSignedInt(str){//questions/13468474
        const i = parseInt(str, 16);
        return i >= 0x80000000 ? i - 0x100000000 : i;
    }
    if(is_toLowerCase)key=key.toLowerCase();
    let hash = 0;
    for(let i = 0; i < key.length; ++i){
        hash += key.charCodeAt(i);
        hash += (hash << 10);
        hash ^= (hash >>> 6);
    }
    hash += (hash << 3);
    hash ^= (hash >>> 11);
    hash += (hash << 15);
    hash = hash >>> 0;
    return ["0x"+hash.toString(16).toUpperCase().padStart(8,"0"),parseSignedInt("0x"+hash.toString(16)),hash];
}
function fn_remove_multiple_line_breaks(str){//questions/22962220
    return str.replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n');
}
function fn_ruby(){
    let ruby_rt=document.querySelectorAll('ruby>rt');
    for(let i=0; i<ruby_rt.length; i++){
        ruby_rt[i].innerText="\uFF5F"+ruby_rt[i].innerText+"\uFF60";
    }
}
function fn_katakana_add_lomaji(str){
    let new_str="";
    let tmp_katakana="";
    let state_katakana=false;
    for(let i=0; i<str.length; i++){
        if(str[i].match(/[\u30a0-\u30ff]/)!=null){
            state_katakana=true;
            tmp_katakana+=str[i];
        }
        else{
            if(state_katakana){
                state_katakana=false;
                new_str+=tmp_katakana+"\u2993"+katakanaToRomajiText(tmp_katakana)+"\u2994";
                new_str+=str[i];
                tmp_katakana="";
            }
            else{new_str+=str[i];}
        }
    }
    return new_str;
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    let host=url[0].host;
    if(JenkHash(host)[2]==1082881694){
        let div_novel_contents=document.querySelectorAll('div#novel_contents')[0];
        let div_novel_color=document.querySelectorAll('div#novel_color')[0];
        let btn_copy_all;
        let btn_copy_all_romaji;
        let btn_1000;
        let btn_5000;
        let input_len;
        let novel_text_raw="";
        let novel_text_kana="";
        if(div_novel_contents!=undefined){
            div_novel_contents.style="margin-left: 1%;";
            btn_copy_all=create_btn("copy all","user_btn_10em",false,div_novel_contents,div_novel_contents.firstChild);
            btn_copy_all_romaji=create_btn("copy all (romaji)","user_btn_10em",false,div_novel_contents,div_novel_color);
            btn_1000=create_btn("1000","user_btn_10em",false,div_novel_contents,div_novel_color);
            btn_5000=create_btn("5000","user_btn_10em",false,div_novel_contents,div_novel_color);
            input_len=create_input("placeholder","user_input_200",true,false,div_novel_contents,div_novel_color);
            create_node('br',[],false,div_novel_contents,div_novel_color);
            create_node('br',[],false,div_novel_contents,div_novel_color);
        }
        if(div_novel_color!=undefined){
            fn_ruby();
            novel_text_raw=fn_remove_multiple_line_breaks(div_novel_color.innerText);
            novel_text_kana=fn_remove_multiple_line_breaks(fn_katakana_add_lomaji(div_novel_color.innerText));
            input_len.placeholder=div_novel_color.innerText.length+"文字";
            btn_copy_all.addEventListener('click',() => {
                navigator.clipboard.writeText(novel_text_raw);
            });
            btn_copy_all_romaji.addEventListener('click',() => {
                navigator.clipboard.writeText(novel_text_kana);
            });
            function fn_novel_split(){
                let moji=parseInt(input_len.value);
                if(moji>=1000){
                    for(let i=0; i<ary_btn.length; i++){//remove btn
                        ary_btn[i].remove();
                    }
                    let ary_word=novel_text_kana.split('\n');
                    let ary_block=[];
                    let index=0;
                    for(let i=0; i<ary_word.length; i++){//split text
                        if(ary_block[index]==undefined)ary_block[index]="";
                        if((ary_block[index]+ary_word[i]).length<moji){
                            ary_block[index]+=ary_word[i]+"\n";
                        }
                        else{
                            index++;
                            if(ary_block[index]==undefined)ary_block[index]="";
                            ary_block[index]+=ary_word[i]+"\n";
                        }
                    }
                    for(let i=0; i<ary_block.length; i++){//add btn
                        ary_btn[i]=create_btn("copy "+(i+1)+", ["+ary_block[i].length+"]","user_btn",false,div_novel_contents,div_novel_color);
                        ary_btn[i].addEventListener('click',() => {
                            navigator.clipboard.writeText(ary_block[i]);
                        });
                    }
                }
            }
            input_len.addEventListener("keyup", function(e){
                fn_novel_split();
            });
            btn_1000.addEventListener('click',() => {//腾讯翻译字數限制
                input_len.value=1000;
                fn_novel_split();
            });
            btn_5000.addEventListener('click',() => {//有道翻译字數限制
                input_len.value=5000;
                fn_novel_split();
            });
        }
    }
})();