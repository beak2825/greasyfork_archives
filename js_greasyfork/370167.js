// ==UserScript==
// @name         AddToFavorite
// @namespace    https://github.com/AlekPet/
// @version      1.6.2
// @description  Сохраняй интересные тебе страницы сайта, не пребегая к закладкам!
// @author       AlexPet | e-mail: alexepetrof@gmail.com
// @license     MIT;  https://raw.githubusercontent.com/AlekPet/AddToFavorite/master/LICENSE
// @match        http*://*/*
// @icon          https://raw.githubusercontent.com/AlekPet/AddToFavorite/master/assets/images/icon.png
// @run-at document-end
// @noframes
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_addValueChangeListener
// @require https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/370167/AddToFavorite.user.js
// @updateURL https://update.greasyfork.org/scripts/370167/AddToFavorite.meta.js
// ==/UserScript==

/* Changelog
[update 22.09.2017]
+Добавил кнопки для правки  удаления доменов и ссылок / Add buttons edit domains, links and delete

[update 28.11.2016]
+Добавил кнопку настроен и возможность сохранить бэкап / Add button setting, and save data

[update 29.10.2016]
+Добавленая синхронизация с другими вкладками / Add Synchronized other tabs save data.
*/

//Javascript Punycode converter derived from example in RFC3492.
//This implementation is created by some@domain.name and released into public domain
var punycode = new function Punycode() {
    // This object converts to and from puny-code used in IDN
    //
    // punycode.ToASCII ( domain )
    // 
    // Returns a puny coded representation of "domain".
    // It only converts the part of the domain name that
    // has non ASCII characters. I.e. it dosent matter if
    // you call it with a domain that already is in ASCII.
    //
    // punycode.ToUnicode (domain)
    //
    // Converts a puny-coded domain name to unicode.
    // It only converts the puny-coded parts of the domain name.
    // I.e. it dosent matter if you call it on a string
    // that already has been converted to unicode.
    //
    //
    this.utf16 = {
        // The utf16-class is necessary to convert from javascripts internal character representation to unicode and back.
        decode:function(input){
            var output = [], i=0, len=input.length,value,extra;
            while (i < len) {
                value = input.charCodeAt(i++);
                if ((value & 0xF800) === 0xD800) {
                    extra = input.charCodeAt(i++);
                    if ( ((value & 0xFC00) !== 0xD800) || ((extra & 0xFC00) !== 0xDC00) ) {
                        throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");
                    }
                    value = ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
                }
                output.push(value);
            }
            return output;
        },
        encode:function(input){
            var output = [], i=0, len=input.length,value;
            while (i < len) {
                value = input[i++];
                if ( (value & 0xF800) === 0xD800 ) {
                    throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
                }
                if (value > 0xFFFF) {
                    value -= 0x10000;
                    output.push(String.fromCharCode(((value >>>10) & 0x3FF) | 0xD800));
                    value = 0xDC00 | (value & 0x3FF);
                }
                output.push(String.fromCharCode(value));
            }
            return output.join("");
        }
    };

    //Default parameters
    var initial_n = 0x80;
    var initial_bias = 72;
    var delimiter = "\x2D";
    var base = 36;
    var damp = 700;
    var tmin=1;
    var tmax=26;
    var skew=38;
    var maxint = 0x7FFFFFFF;

    // decode_digit(cp) returns the numeric value of a basic code 
    // point (for use in representing integers) in the range 0 to
    // base-1, or base if cp is does not represent a value.

    function decode_digit(cp) {
        return cp - 48 < 10 ? cp - 22 : cp - 65 < 26 ? cp - 65 : cp - 97 < 26 ? cp - 97 : base;
    }

    // encode_digit(d,flag) returns the basic code point whose value
    // (when used for representing integers) is d, which needs to be in
    // the range 0 to base-1. The lowercase form is used unless flag is
    // nonzero, in which case the uppercase form is used. The behavior
    // is undefined if flag is nonzero and digit d has no uppercase form. 

    function encode_digit(d, flag) {
        return d + 22 + 75 * (d < 26) - ((flag !== 0) << 5);
        //  0..25 map to ASCII a..z or A..Z 
        // 26..35 map to ASCII 0..9
    }
    //** Bias adaptation function **
    function adapt(delta, numpoints, firsttime ) {
        var k;
        delta = firsttime ? Math.floor(delta / damp) : (delta >> 1);
        delta += Math.floor(delta / numpoints);

        for (k = 0; delta > (((base - tmin) * tmax) >> 1); k += base) {
                delta = Math.floor(delta / ( base - tmin ));
        }
        return Math.floor(k + (base - tmin + 1) * delta / (delta + skew));
    }

    // encode_basic(bcp,flag) forces a basic code point to lowercase if flag is zero,
    // uppercase if flag is nonzero, and returns the resulting code point.
    // The code point is unchanged if it is caseless.
    // The behavior is undefined if bcp is not a basic code point.

    function encode_basic(bcp, flag) {
        bcp -= (bcp - 97 < 26) << 5;
        return bcp + ((!flag && (bcp - 65 < 26)) << 5);
    }

    // Main decode
    this.decode=function(input,preserveCase) {
        // Dont use utf16
        var output=[];
        var case_flags=[];
        var input_length = input.length;

        var n, out, i, bias, basic, j, ic, oldi, w, k, digit, t, len;

        // Initialize the state: 

        n = initial_n;
        i = 0;
        bias = initial_bias;

        // Handle the basic code points: Let basic be the number of input code 
        // points before the last delimiter, or 0 if there is none, then
        // copy the first basic code points to the output.

        basic = input.lastIndexOf(delimiter);
        if (basic < 0) basic = 0;

        for (j = 0; j < basic; ++j) {
            if(preserveCase) case_flags[output.length] = ( input.charCodeAt(j) -65 < 26);
            if ( input.charCodeAt(j) >= 0x80) {
                throw new RangeError("Illegal input >= 0x80");
            }
            output.push( input.charCodeAt(j) );
        }

        // Main decoding loop: Start just after the last delimiter if any
        // basic code points were copied; start at the beginning otherwise. 

        for (ic = basic > 0 ? basic + 1 : 0; ic < input_length; ) {

            // ic is the index of the next character to be consumed,

            // Decode a generalized variable-length integer into delta,
            // which gets added to i. The overflow checking is easier
            // if we increase i as we go, then subtract off its starting 
            // value at the end to obtain delta.
            for (oldi = i, w = 1, k = base; ; k += base) {
                    if (ic >= input_length) {
                        throw RangeError ("punycode_bad_input(1)");
                    }
                    digit = decode_digit(input.charCodeAt(ic++));

                    if (digit >= base) {
                        throw RangeError("punycode_bad_input(2)");
                    }
                    if (digit > Math.floor((maxint - i) / w)) {
                        throw RangeError ("punycode_overflow(1)");
                    }
                    i += digit * w;
                    t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                    if (digit < t) { break; }
                    if (w > Math.floor(maxint / (base - t))) {
                        throw RangeError("punycode_overflow(2)");
                    }
                    w *= (base - t);
            }

            out = output.length + 1;
            bias = adapt(i - oldi, out, oldi === 0);

            // i was supposed to wrap around from out to 0,
            // incrementing n each time, so we'll fix that now: 
            if ( Math.floor(i / out) > maxint - n) {
                throw RangeError("punycode_overflow(3)");
            }
            n += Math.floor( i / out ) ;
            i %= out;

            // Insert n at position i of the output: 
            // Case of last character determines uppercase flag: 
            if (preserveCase) { case_flags.splice(i, 0, input.charCodeAt(ic -1) -65 < 26);}

            output.splice(i, 0, n);
            i++;
        }
        if (preserveCase) {
            for (i = 0, len = output.length; i < len; i++) {
                if (case_flags[i]) {
                    output[i] = (String.fromCharCode(output[i]).toUpperCase()).charCodeAt(0);
                }
            }
        }
        return this.utf16.encode(output);
    };

    //** Main encode function **

    this.encode = function (input,preserveCase) {
        //** Bias adaptation function **

        var n, delta, h, b, bias, j, m, q, k, t, ijv, case_flags;

        if (preserveCase) {
            // Preserve case, step1 of 2: Get a list of the unaltered string
            case_flags = this.utf16.decode(input);
        }
        // Converts the input in UTF-16 to Unicode
        input = this.utf16.decode(input.toLowerCase());

        var input_length = input.length; // Cache the length

        if (preserveCase) {
            // Preserve case, step2 of 2: Modify the list to true/false
            for (j=0; j < input_length; j++) {
                case_flags[j] = input[j] != case_flags[j];
            }
        }

        var output=[];


        // Initialize the state: 
        n = initial_n;
        delta = 0;
        bias = initial_bias;

        // Handle the basic code points: 
        for (j = 0; j < input_length; ++j) {
            if ( input[j] < 0x80) {
                output.push(
                    String.fromCharCode(
                        case_flags ? encode_basic(input[j], case_flags[j]) : input[j]
                    )
                );
            }
        }

        h = b = output.length;

        // h is the number of code points that have been handled, b is the
        // number of basic code points 

        if (b > 0) output.push(delimiter);

        // Main encoding loop: 
        //
        while (h < input_length) {
            // All non-basic code points < n have been
            // handled already. Find the next larger one: 

            for (m = maxint, j = 0; j < input_length; ++j) {
                ijv = input[j];
                if (ijv >= n && ijv < m) m = ijv;
            }

            // Increase delta enough to advance the decoder's
            // <n,i> state to <m,0>, but guard against overflow: 

            if (m - n > Math.floor((maxint - delta) / (h + 1))) {
                throw RangeError("punycode_overflow (1)");
            }
            delta += (m - n) * (h + 1);
            n = m;

            for (j = 0; j < input_length; ++j) {
                ijv = input[j];

                if (ijv < n ) {
                    if (++delta > maxint) return Error("punycode_overflow(2)");
                }

                if (ijv == n) {
                    // Represent delta as a generalized variable-length integer: 
                    for (q = delta, k = base; ; k += base) {
                        t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                        if (q < t) break;
                        output.push( String.fromCharCode(encode_digit(t + (q - t) % (base - t), 0)) );
                        q = Math.floor( (q - t) / (base - t) );
                    }
                    output.push( String.fromCharCode(encode_digit(q, preserveCase && case_flags[j] ? 1:0 )));
                    bias = adapt(delta, h + 1, h == b);
                    delta = 0;
                    ++h;
                }
            }

            ++delta;
            ++n;
        }
        return output.join("");
    };

    this.ToASCII = function ( domain ) {
        var domain_array = domain.split(".");
        var out = [];
        for (var i=0; i < domain_array.length; ++i) {
            var s = domain_array[i];
            out.push(
                s.match(/[^A-Za-z0-9-]/) ?
                "xn--" + punycode.encode(s) :
                s
            );
        }
        return out.join(".");
    };
    this.ToUnicode = function ( domain ) {
        var domain_array = domain.split(".");
        var out = [];
        for (var i=0; i < domain_array.length; ++i) {
            var s = domain_array[i];
            out.push(
                s.match(/^xn--/) ?
                punycode.decode(s.slice(4)) :
                s
            );
        }
        return out.join(".");
    };
}();
/*
Edited: Added the missing add and subtract of 0x10000 in the UTF-16 part.
Update Licence:
From RFC3492:
Disclaimer and license
Regarding this entire document or any portion of it (including the pseudocode and C code), the author makes no guarantees and is not responsible for any damage resulting from its use.
The author grants irrevocable permission to anyone to use, modify, and distribute it in any way that does not diminish the rights of anyone else to use, modify, and distribute it,
provided that redistributed derivative works do not contain misleading author or version information. Derivative works need not be licensed under similar terms.
*/
//=========================

GM_addStyle("\
           .spanplus{color: #727272; float:none;margin:4px 0;box-sizing: content-box;text-align: center; */ }\
           \
           .divFav_panel_button{position: fixed; bottom: 50%; right: 0px; z-index:9999;font: small arial,sans-serif;  margin: 0; text-align: center;    background: linear-gradient(to right,#bfbfbf,#929292);border-radius: 8px 0 0 8px;border: 1px solid silver;opacity: 0.8;}\
            \
           .div_FavB{width: 15px;height: 25px; border: 1px solid silver; background: linear-gradient(rgba(255, 255, 255, 1.0),rgba(192, 192, 192, 1.0));text-align: center;-webkit-user-select: none; cursor: pointer;border-radius:5px;box-shadow: 1px 1px 3px silver; margin: 5px 5px;border: 1px solid #7d7c7c;}\
           .div_FavB:hover{background: linear-gradient(rgb(184, 255, 189),rgb(42, 255, 88));}\
           \
           .div_Fav_window{position: fixed; bottom: 5px; right: 40px;z-index:9999;border: 1px solid #e4e4e4;   width: 240px; background: linear-gradient(#efefef,white); padding: 10px;    border-radius: 4px;    box-shadow: 1px 1px 3px #676464;box-sizing: content-box;font-size: small;;}\
           .div_Fav_window_inner{ overflow: auto; max-height: 500px;padding-right: 20px;box-sizing: content-box;}\
           \
           .div_Fav_win_title{padding: 5px;    color: white;    font-size: 8pt;    text-shadow: 2px 2px 1px silver;    text-align: center;cursor:pointer;box-sizing: content-box;line-height: 1.5;}\
           .div_Fav_win_title:hover{font-size:10pt; line-height: 1.1;}\
           \
           .div_Fav_ahref{color: #727272; top: 5px; font-weight: bolder;text-decoration:none;font-size:8pt; display:inline-block;box-sizing: content-box;}\
           .div_Fav_ahref:hover{color: #53b74a !important; font-size:9pt;}\
           .div_Fav_ahref:link{color: #727272;}\
           .div_Fav_ahref:visited{color: #2293cf;}\
           \
           .div_Fav_button{float: right;  width: 15px;  height: 15px; border-radius: 6px; text-align: center; cursor:pointer;box-sizing: content-box;}\
           .div_Fav_button_link{float: right;  width: 15px;  height: 15px; border-radius: 6px; text-align: center; cursor:pointer;box-sizing: content-box;line-height: 1.3;}\
           .div_Fav_button_link:hover,.div_Fav_button:hover{background: linear-gradient(#dcdcdb,#cfcfcf);}\
           \
           .div_Fav_del_button{color: #7f7f7f; background: linear-gradient(white,#b7b3b3);}\
           .div_Fav_ed_button{margin-right: 5px;color: #7f7f7f;    background: linear-gradient(white,#b7b3b3);}\
           .div_Fav_del_button_link{color: #773a3a;   background: linear-gradient(#e6e3e3,#b3acac);}\
           .div_Fav_ed_button_link{margin-right: 2px;color: #773a3a;    background: linear-gradient(#e6e3e3,#b3acac);}\
           \
           .body_domena_el{border-radius: 8px 8px 8px 8px; background: linear-gradient(#cfcfcf,#f9f9f9);margin: 15px 2px;box-shadow: 1px 1px 1px silver;box-sizing: content-box;}\
          \
          .divFav_buttons_style{cursor:pointer; box-shadow: 1px 1px 2px silver; border: 1px solid silver; border-radius: 10px; padding: 0 4px; background: linear-gradient(#0ab9b9,rgb(36, 152, 220)); color: white;user-select:none;}\
          .divFav_showAll{}\
          .setting_button{}\
          .divFav_buttons_style:hover{background: linear-gradient(#4fefef,rgb(28, 146, 216));}\
          .button_set{width: 130px;margin: 8px auto;padding: 3px;}\
          .setting_button_panel{position:fixed;width:260px;right: 310px;bottom: 5px;border: 1px solid silver; background: linear-gradient(rgba(255, 255, 255, 0.83),rgba(192, 192, 192, 0.83));text-align: center;-webkit-user-select: none;;border-radius:5px;box-shadow: 1px 1px 3px silver;}\
          \
          .divFav_Win_alert{ position: fixed;    top: 0; left: 0;   border: 1px solid silver;    width: 100%;    text-align: center;    font-weight: bold;    padding: 5px;    font-size: 12pt;    text-shadow: 1px 1px 2px black;z-index: 999999999;}\
          #divFav_B_search_button{border-radius:8px 8px; background:#ffffff;color:#0083ff;margin-right: 5px;;padding: 2px 2px;outline: none;}\
          #divFav_B_search_button:focus{border: 2px solid #0ab9b9;}  \
\
          .text_area_set{width: 240px; height: 170px;font-size: 10px;resize: vertical; border: 1px solid silver;}\
          .setting_but_m{font-weight: bold;margin: 0 auto;color: #8a8888;text-shadow: 1px 1px white;padding: 2px;border-radius: 3px;}\
          .code_setting_m{color: #8a8888;text-shadow: 1px 1px white;margin: 10px auto;}\
          .code_download_m{color: white; text-decoration: none;}\
          .code_download_m:visited{color:white;}\
          .code_download_m:hover{text-decoration: none;}\
            \
         .div_Fav_win_title + div >div{border-bottom: 1px solid rgba(102, 102, 102, 0.18);padding: 5px; clear: both;}\
         .div_Fav_win_title + div >div:last-child{border-bottom: none;}\
         \
         .pole_edit_domain_sites_class{position: fixed;top: 50%;left: 50%;border: 1px solid #a5a5a5;width: 500px;height: 200px;background: white;margin-left: -250px;margin-top: -100px;display:none;z-index:999999 !important;}\
         .pole_edit_domain_sites_header_class{background: silver; color: white;padding: 5px;font-family: monospace;}\
         .pole_edit_domain_sites_header_x{float: right;cursor:pointer;transition:all 1s;}\
         .pole_edit_domain_sites_header_x:hover{color:black; transform: rotateZ(360deg);}\
         .pole_edit_domain_sites_body_class{display: table;margin: auto;width: 100%;}\
         .pole_edit_domain_sites_body_class div:not(.Button_Panel):not(.ButtonEdit){display: table-cell;    text-align: center;width: 150px;}\
         .pole_edit_domain_sites_body_class div p{margin: 20px;padding:0;}\
         .pole_edit_domain_sites_body_class div input{width: 250px;}\
         .Button_Panel{text-align: -webkit-center; text-align: -moz-center; text-align: -o-center;margin-top: 15px;}\
         .Button_Panel .ButtonEdit{    display: block;    border: 1px solid silver;    height: 30px;    width: 150px;    background: linear-gradient(#ffffff,#afadad);    font-weight: bold;    color: grey;    cursor: pointer;    transition: all 1s;    text-align: center;    line-height: 25px;}\
         .Button_Panel .ButtonEdit:hover{background: linear-gradient(#ffffff,#848181);transform: scale(1.05);}\
         \
         #shadow_kogda_edit{position:fixed;display:none;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:99999;}\
");

(function() {
'use strict';
if (window.top != window.self)  return;
    
var ls_value = GM_getValue('list_fav'),

addf = (ls_value)?JSON.parse(GM_getValue('list_fav')):{};

if(!addf.hasOwnProperty("list")) addf = {list: addf};

GM_addValueChangeListener('list_fav', function() {   
    ls_value = GM_getValue('list_fav');

    addf = (ls_value)?JSON.parse(GM_getValue('list_fav')):{};

    if(!addf.hasOwnProperty("list")) addf = {list: addf};

    updateList();
});
    
    
function hex(r,g,b){
var hexv="0123456789ABCDEF",
    valhex="",
    ff=[r,g,b];

for(var i=0;i<3;i++){
var del= ff[i] % 16,
    di=Math.floor(ff[i]/16);
if(ff[i]>=255){ 
valhex+="FF";
} else if(ff[i]<=0){
valhex+="00";
} else {
valhex+=hexv.charAt(di)+hexv.charAt(del);
}
}
return valhex;
}
    
function kolObj (obj) {
    var kol = 0;
    for (var znachen in obj) {
        if (Object.prototype.hasOwnProperty.call(obj,znachen)) {
            kol++;
        }
    }
    return kol;
}
        
    
function deleteDomain(el){
    el.stopPropagation();
try{
    if(confirm("Вы действительно хотите удалить домен?")){
    var el_target = el.target;
    delete addf.list[el_target.parentElement.title];
    saveToStorage(); 
    showAlert("Домен \""+el_target.parentElement.title+"\" был удален!",{col1:"rgba(233, 30, 161, 0.83)",col2:"rgba(35, 1, 13, 0.74)",text_col:"white"});
    }
}catch(e){
    alert(e);
}
}
    
function checInputValue(param){
    try{
    var text = param.text,
        tip_texta = param.tip;

    if(text.length>0 && text !== null && text !== undefined && !/^$/g.test(text) && !/(^$|^\s+$)/g.test(text)){
    
        if(tip_texta === "link"){
            if((/^(https?|ftp):\/\/.*/).test(text)){
                return true;
            } else {
                alert("Ошибка ввода ссылки!\nПроверьте написание ссылки!");
                return false;
            }
        } else if(tip_texta === "title"){
            return true;
        }
    } else {
    alert("Ошибка ввода!\nПоле название не заполненно, или имеет только одни пробелы и символы табуляции!");
    return false;
    }
    }catch(e){
        alert(e);
    }
}

var temp_var = {el_target : null};
    
function Button_Save_Edit_Domain_and_sites_links(){
try{
if($("#pole_edit_domain_sites").is(":visible")){
     var message_log ="";     
    if(temp_var.el_target.parentElement.id.indexOf('domen_') > -1){ // Правка только домена 
        
         if(confirm("Вы действительно хотите сохранить изменения домена?")){ 
             if(!checInputValue({text:$("#pole_edit_domain_sites_input_d_lt").val(),tip:"title"})){return;} 

             if($("#pole_edit_domain_sites_input_d_lt").val() != $("#pole_edit_domain_sites_input_d_lt").attr("title")){
             addf.list[$("#pole_edit_domain_sites_input_d_lt").val()] = {titles:addf.list[temp_var.el_target.parentElement.title].titles, sites: addf.list[temp_var.el_target.parentElement.title].sites};
             delete addf.list[temp_var.el_target.parentElement.title];
             
             message_log = "Домен \""+ $("#pole_edit_domain_sites_input_d_lt").val()+"\" был успешно изменен!"; 
             } else  message_log = "Домен \""+ $("#pole_edit_domain_sites_input_d_lt").val()+"\" не изменен, т.к. изменений не было!"; 
         }
         
     } else {  // Правка ссылки 
         
         if(confirm("Вы действительно хотите сохранить изменения ссылки?")){         
             if(!checInputValue({text:$("#pole_edit_domain_sites_input_d_lt").val(),tip:"title"})){return;}
             if(!checInputValue({text:$("#pole_edit_domain_sites_input_linkt").val(),tip:"link"})){return;}         
         
             var link_pos=temp_var.el_target.id.match(/link_edit_(\d+)/i)[1], // поиск в ид номер ссылки
                 pos_v_object=temp_var.el_target.parentElement.parentElement.parentElement.childNodes[0].title, // ищем название объекта
                 title_edit_save = addf.list[pos_v_object].titles.split(","),
                 link__edit_save = addf.list[pos_v_object].sites.split(",");

             title_edit_save[link_pos] = escape($("#pole_edit_domain_sites_input_d_lt").val());
             link__edit_save[link_pos] = encodeURIComponent($("#pole_edit_domain_sites_input_linkt").val());

             addf.list[pos_v_object].titles = title_edit_save.join(",");
             addf.list[pos_v_object].sites = link__edit_save.join(","); // объединяем ссылки и заголовки в своих ячейках объекта в строку
         
             message_log = "Ссылка \""+$("#pole_edit_domain_sites_input_d_lt").val()+"\" была успешно изменена!";          
     }
     }
     saveToStorage();
     showAlert(message_log,{col1:"rgba(233, 30, 161, 0.83)",col2:"rgba(35, 1, 13, 0.74)",text_col:"white"}); 
     $("#pole_edit_domain_sites").fadeOut(1000,function(){$("#shadow_kogda_edit").fadeOut(1000);}); 
}
}catch(e){
alert(e);
}
}
    
function editDomain_and_links(el){
    el.stopPropagation();
    var el_target = el.target; 
    temp_var.el_target = el_target;    
try{
if(!$("#pole_edit_domain_sites").is(":visible")){
    if(el_target.parentElement.id.indexOf('domen_') > -1){// Только домен
        if(confirm("Вы действительно хотите править домен?")){ 
            $("#pole_edit_domain_sites_input_linkt").css({"visibility":"hidden"});
            $("#pole_edit_domain_sites_input_linkt_p").css({"visibility":"hidden"});

            $("#shadow_kogda_edit").fadeIn(1000,function(){$("#pole_edit_domain_sites").fadeIn(1200);});
            $("#pole_edit_domain_sites_input_d_lt").attr("title",el_target.parentElement.title);              
            $("#pole_edit_domain_sites_input_d_lt").val(el_target.parentElement.title); 
        } 
    } else {
       if(confirm("Вы действительно хотите править ссылку?")){ 
            $("#pole_edit_domain_sites_input_linkt").css({"visibility":"visible"});
            $("#pole_edit_domain_sites_input_linkt_p").css({"visibility":"visible"}); 
        
            $("#shadow_kogda_edit").fadeIn(1000,function(){$("#pole_edit_domain_sites").fadeIn(1200);});
           
           var link_pos=el_target.id.match(/link_edit_(\d+)/i)[1], // поиск в ид номер ссылки
               pos_v_object=el_target.parentElement.parentElement.parentElement.childNodes[0].title, // ищем название объекта
           
               title_link = unescape(addf.list[pos_v_object].titles.split(",")[link_pos]),
               href_link = decodeURIComponent(addf.list[pos_v_object].sites.split(",")[link_pos]);

           $("#pole_edit_domain_sites_input_d_lt").attr("title",title_link);
           $("#pole_edit_domain_sites_input_d_lt").val(title_link);
           $("#pole_edit_domain_sites_input_linkt").attr("title",title_link);            
           $("#pole_edit_domain_sites_input_linkt").val(href_link);
       }
    }
} else {
   alert("Уже происходит правка!");
 }
}catch(e){
    alert(e);
}
}
    
function showHideElement(param, func){
    if(!param.el || param.el.length<1) return;
    var el = param.el,
        tip = param.tip || "toggle",
        anim_time = param.time || 1000,
        func_ = param.func || null;

    switch(tip){
        case "toggle":$(el).toggle(anim_time, func_);
            break;
        case "slideToggle":$(el).slideToggle(anim_time, func_);
            break;
        case "fadeToggle":$(el).fadeToggle(anim_time ,func_);
            break;
        case "fadeIn":$(el).fadeIn(anim_time, func_);
            break; 
        case "fadeOut":$(el).fadeOut(anim_time, func_);
            break;
        case "random":
            var rnd = Math.floor(Math.random()*3);
            if(rnd === 0) $(el).toggle(anim_time, func_); else if(rnd === 1) $(el).fadeToggle(anim_time, func_); else $(el).fadeToggle(anim_time, func_);
            break;            
        default:$(el).toggle(anim_time, func_);           
    }
}
    
function showAlert(text, colors){
    $("#completed_add_favb").slideToggle(1000, function(){$(this).fadeToggle(3000);});
    $("#completed_add_favb").text(text);
    var style_apply = {"z-index": "9999999999", "background": "linear-gradient("+ colors.col1+","+colors.col2+")", "color": colors.text_col};
    $("#completed_add_favb").css(style_apply);
}

function deleteLink(el){
try{
    var el_target = el.target,
        link_pos=el_target.id.match(/link_del_(\d+)/i)[1], // поиск в ид номер ссылки
        pos_v_object=el_target.parentElement.parentElement.parentElement.childNodes[0].title, // ищем название объекта

        link_split_dlya_udal = addf.list[pos_v_object].sites.split(","), // разделяем ссылки
        link_split_titles_dlya_udal = addf.list[pos_v_object].titles.split(","); // разделяем заголовки ссылок

    link_split_dlya_udal.splice(link_pos, 1); // удаляем выбранный элемент из ссылок
    link_split_titles_dlya_udal.splice(link_pos, 1); // удаляем выбранный элемент из заголовков

    if(link_split_dlya_udal.length>0 && link_split_titles_dlya_udal.length>0){
    addf.list[pos_v_object].sites = link_split_dlya_udal.join(","); // объединяем ссылки и заголовки в своих ячейках объекта в строку
    addf.list[pos_v_object].titles = link_split_titles_dlya_udal.join(",");
    } else {
    delete addf.list[pos_v_object];     // если все ссылки были удалены, удаляем и сам элемент объекта
    }
    $(el_target).slideUp(1000,function(){
    saveToStorage();
    showAlert("Ссылка \""+el_target.parentElement.firstChild.text+"...\" была удалена!",{col1:"rgba(243, 30, 161, 0.83)",col2:"rgba(55, 1, 13, 0.74)",text_col:"white"});    
    });

}catch(e){
    alert(e);
}
}

function search_in_obj(){
    var copy_addf = {},
        kol = 0,
        arr = ["",[]];

    for(var domeni in addf.list){
        var search_text = $("#divFav_B_search_button").val();
        if(domeni.indexOf(search_text) >=0){
            copy_addf[domeni] = addf.list[domeni];
            arr[1].push(kol);
        }
        kol++;
    }
    arr[0] = copy_addf;
    console.log(arr);
    return arr;
}
    
// Функция для Создания элементов    
function makeElem(el_n, el_st, el_clName, el_inT, el_title, el_id){
var div=document.createElement(el_n);
    if(el_st)div.style.cssText=el_st; //setAttribute("style", el_st);
    if(el_clName)div.className=el_clName;
    if(el_title)div.title=el_title;
    if(el_id)div.id=el_id;
    if(el_inT)div.innerHTML=el_inT;
   return div;
}

// Выводим наши значения на экран    
var disp =[];
function updateList(){
try{
    var dlina_nazvania = 20, // Длина обрезки заголовков
        divFav_WinInne = document.getElementsByClassName("div_Fav_window_inner")[0];
    divFav_WinInne.innerHTML="";
    var kol_ob =0,
    
    input_search = $("#divFav_B_search_button"),
    copy_addf = null,
    object_selected = addf.list,
    arrs_search = null,
    search_work = false;

    if(input_search.val().length<=0){
    // ################# NO FILTERS
    object_selected = addf.list;
    } else {
    // ################# FILTERS 
    arrs_search = search_in_obj();  
    object_selected = arrs_search[0];   
    search_work = true;
    divFav_WinInne.innerHTML="";
    }
    
    var object_addf = object_selected;
    
    for(var domeni in object_addf){
    var links = object_addf[domeni].sites.split(","),
    links_titles = object_addf[domeni].titles.split(","),

    rcol = "#"+hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255))+", #"+ hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)),
    body_domena = makeElem("div", null, "body_domena_el", null, null, null),
    title_domena = makeElem("div", "background: linear-gradient("+rcol+"); border-radius: 8px 8px 8px 8px;", "div_Fav_win_title", ((domeni.length>20)?domeni.substr(0,20)+" ...":domeni), domeni, "domen_"+((!search_work)?kol_ob:arrs_search[1][kol_ob])),
    delete_button_domain = makeElem("div", null, "div_Fav_button div_Fav_del_button", "x", "Удалить домен!", null),
    edit_button_domain = makeElem("div", null, "div_Fav_button div_Fav_ed_button", "e", "Править домен!", null),
    hide_elem =  makeElem("div", "display:"+((disp[kol_ob])?"block":"none"), null, null, null, null);
        
    
    body_domena.appendChild(title_domena); 
    body_domena.appendChild(hide_elem);
        
    title_domena.appendChild(delete_button_domain);
    title_domena.appendChild(edit_button_domain);
        
    divFav_WinInne.appendChild(body_domena);
        
    $(title_domena).click(function(){
           $(this).next("div").toggle(1000, function(){
               var self =  $(this).prev("div").attr("id"),
                   display_prop = parseInt(self.match(/domen_(\d+)/i)[1]);

               if($(this).css("display") === "block"){
               $(this).prev("div").css("border-radius", "8px 8px 0px 0px");
               $(this).css("display","block");
               disp[display_prop] = "1";
               } else {
               $(this).prev("div").css("border-radius", "8px 8px 8px 8px");
               $(this).css("display","none");
               disp[display_prop] = "1";
               }
           });
     });
        
        var body_links = "";
        for(var i=0;i<links.length;i++){
        var titles = unescape(links_titles[i]),
        divbody_button_edit_link = makeElem("div", null, "div_Fav_button_link div_Fav_ed_button_link", "e", "Править ссылку!", "link_edit_"+i),
        divbody_button_del_link = makeElem("div", null, "div_Fav_button_link div_Fav_del_button_link", "x", "Удалить ссылку!", "link_del_"+i),
        divbody_link_p = makeElem("div", "text-align: start;", null, null, null, domeni+"_link_"+i),
            
        divbody_link_a = document.createElement("a");
            divbody_link_a.className="div_Fav_ahref";
            divbody_link_a.href=decodeURIComponent(links[i]);
            divbody_link_a.title=titles;
            divbody_link_a.target="_blank";            
            divbody_link_a.innerText = ((titles.length>dlina_nazvania)?titles.slice(0,dlina_nazvania)+'...':titles);
            divbody_link_p.appendChild(divbody_link_a);
            
            divbody_link_p.appendChild(divbody_button_del_link);            
            divbody_link_p.appendChild(divbody_button_edit_link);            

            hide_elem.appendChild(divbody_link_p); 
            // Event listeners del link
            divbody_button_del_link.addEventListener("click", deleteLink, false); 
            divbody_button_edit_link.addEventListener("click", editDomain_and_links, false);             
            //
        }
    // Event listeners Del button
    delete_button_domain.addEventListener("click", deleteDomain, false);     
    //
    // Edit domain
    edit_button_domain.addEventListener("click", editDomain_and_links, false);        
    //
    kol_ob++;
    }
    if(kolObj (object_addf) < 1)  divFav_WinInne.innerHTML="Нечего не добавленно!";
    
    document.getElementById("texarea_set").value=JSON.stringify(addf.list);
}catch(e){
alert(e);
}    
}
 
// Функция сохранения в localStorage    
function saveToStorage(){
try{
var save_data = ((arguments.length<=0)?JSON.stringify(addf):arguments[0]);
if(save_data.length>0 && save_data !== null && save_data !==""){
GM_setValue('list_fav', save_data);
updateList();
}
}catch(e){
alert(e);
}
}
// Поиск в объекте с рег. выраж.
function searchinObj(obj, reqex){
var keys=[];
for (var propvalue in obj) {
    if (obj.hasOwnProperty(propvalue) && reqex.test(propvalue)) {
        keys.push(propvalue);  
    }
  }
  return keys;
}
    
    
// Функция лобавления сссылки в избранное
function addSiteFav(){
    var wind_loc ="";

    wind_loc =  [encodeURIComponent(window.location.href), (/^xn--/.test(window.location.hostname)) ? punycode.ToUnicode (window.location.hostname): window.location.hostname, (document.title.length === 0 || document.title === "")?"Без названия":escape(document.title)]; // Создаем массив с элементами текущей старницы

    if(wind_loc && wind_loc !== null && wind_loc !== undefined && wind_loc.length>0){
    if(addf.list.hasOwnProperty(wind_loc[1])){ // domen uge est v baze
        // proveraem est' li link v spiske
        var list_sites = addf.list[wind_loc[1]].sites.split(","),
            list_sites_titles = addf.list[wind_loc[1]].titles.split(",");

        if(list_sites.indexOf(wind_loc[0]) < 0){ // esli net to dobavlaem
            list_sites.push(wind_loc[0]);
            list_sites_titles.push(wind_loc[2]);            
            addf.list[wind_loc[1]].sites = list_sites.join(",");
            addf.list[wind_loc[1]].titles = list_sites_titles.join(",");
        }
      } else { // domen ne nayden dobavlaem domen a potom i ssilku
           addf.list[wind_loc[1]] = {sites:wind_loc[0], titles:wind_loc[2]};
      }
        saveToStorage();
        showAlert("Ссылка \""+wind_loc[1]+"\" добавлена!",{col1:"rgba(0, 255, 79, 0.8)",col2:"rgba(9, 84, 6, 0.75)",text_col:"white"});
    } else {
    alert("Неверный адресс сайта!");    
    }
}

/*
function loading_other_view(){
var setting_other_view = document.getElementById("setting_other_view"),
db = addf.list;
    setting_other_view.innerHTML = "";
if($(".setting_button_panel").is(":visible")){
    
    
    for(var zn in db){
    var parseiz_db = makeElem("div", "margin:10px auto; cursor:pointer;", "", "<div style=\"width: 200px;margin: 0 auto;background: #007cff;padding: 3px;color: white;\">"+zn+"</div>", zn, null),
      
    titles_pole = makeElem("div", "display:none; padding: 5px;", "", null, "pole_titles_from_"+zn, null);
        
        parseiz_db.addEventListener("click", function(e){
            if(e.target.id !== "no_hide") e.target.nextElementSibling.style.display =(e.target.nextElementSibling.style.display === "block")?"none":"block";
        });
        
    var titles_sp = db[zn].titles.split(","),
     sites_sp = db[zn].sites.split(",");
        
        for(var i=0; i<titles_sp.length;i++){
               var div_s = makeElem("div", "margin-top:5px;border:1px solid black;", "", "<div style=\"background: #6d9fd4;color: white;padding: 3px;\">"+unescape(titles_sp[i]).substring(0,20)+"..."+"</div>", unescape(titles_sp[i]).substring(0,50)+"...", null),
                sites_pole = makeElem("div", "display:none;padding: 5px;", "", null, "pole_sites_from_"+zn, null);
           
            for(var j=0;j<2;j++){
               var label_pole =(j<1)?makeElem("span", "padding: 5px;", "", "Название:", null, "no_hide"):makeElem("span", "padding: 5px;", "", "Ссылка:", null, "no_hide"),
                inp_s = document.createElement("input");
                   inp_s.type="text";
                   inp_s.id="no_hide";
                   inp_s.setAttribute("style","margin-top:5px;");
                   inp_s.value=(j<1)?unescape(titles_sp[i]):decodeURIComponent(sites_sp[i]);
                   sites_pole.appendChild(label_pole);
                   sites_pole.appendChild(inp_s);
            }
           
        div_s.appendChild(sites_pole);
        titles_pole.appendChild(div_s);
         }
        parseiz_db.appendChild(titles_pole);
        setting_other_view.appendChild(parseiz_db);
    }

}
}
*/
    
/* Стартовая функция 
@makeElem(element, style, className, InnerText, title, Id)  
*/
function init(){
    var divFav_panel_button=makeElem("div", "display:none;", "divFav_panel_button", null, null, null),
        divFav_B=makeElem("div", null, "div_FavB", "<div class=\"spanplus\">+</div>","Добавить в избранное!", null),
        divFav_B_show_hide=makeElem("div", null, "div_FavB", "<div class=\"spanplus\">▼</div>", "Показать/Скрыть список", null),
        divFav_Win=makeElem("div", "display:none;", "div_Fav_window", null, null, null),
        divFav_WinInner=makeElem("div", null, "div_Fav_window_inner", null, null, null),
        divFav_Win_alert=makeElem("div", "display:none;", "divFav_Win_alert", "Добавленно!", null, "completed_add_favb"),
    
        titlediv_prog = makeElem("div", "text-align:left;", null, "", "", null),

        search_prog = document.createElement("input");
    search_prog.type = "text";
    search_prog.id = "divFav_B_search_button";  
    search_prog.placeholder="Искать...";
    
     var divFav_showAll=makeElem("span", null, "divFav_showAll divFav_buttons_style", "+", "Развернуть / Свернуть", null),

         setting_button = makeElem("span", null, "setting_button divFav_buttons_style", "♥", "Настройки", "b_opensetting"),
         setting_button_panel = makeElem("div", "display:none;", "setting_button_panel", "<div class=\"setting_but_m\">Настройки</div><p class=\"code_setting_m\">Код настроек:</p>", null, null),

         texarea_set = document.createElement("textarea");
    texarea_set.className="text_area_set";//.setAttribute("style","width: 240px; height: 170px;font-size: 10px;resize: vertical;");
    //texarea_set.setAttribute("readonly","true");
    texarea_set.id="texarea_set";
    texarea_set.value=JSON.stringify(addf.list) || "";
    
    var button_backupbd = makeElem("div", null, "button_set divFav_buttons_style", "<a class='code_download_m' href='javascript:void(0);' download='backup_bd.txt'>Сделать бэкап</a>", "Бэкап базы ссылок!", "b_backup"),
        button_set = makeElem("div", null, "button_set divFav_buttons_style", "Закрыть", "Закрыть", "b_close_save"),
    
    // Other view codes beta
    // setting_other_but = makeElem("div", "margin: 5px auto;", null, "<div style=\"background: #004f75;color: white;padding: 5px;width: 200px;margin: 0 auto;cursor: pointer;\">Смотреть код</div>", "", "setting_other_but"),
    // setting_other_view = makeElem("div", "background: white; margin: 0 auto;width: 235px;padding: 5px;overflow-y: auto;height: 200px;display:none;", null, null, "Other View", "setting_other_view"),
    
    // Menu edit domain and links
        pole_edit_domain_sites = makeElem("div", null, "pole_edit_domain_sites_class", null, null, "pole_edit_domain_sites"),
        pole_edit_domain_sites_header = makeElem("div", null, "pole_edit_domain_sites_header_class", "Редактирование<div class=\"pole_edit_domain_sites_header_x\">X</div>", null, "pole_edit_domain_sites_header"),

        html_edit_body = '<div><p>Название: </p><p id="pole_edit_domain_sites_input_linkt_p">Ссылка: </p></div><div><input type="text" style="margin-bottom: 15px;" id="pole_edit_domain_sites_input_d_lt" placeholder="Название" value=""><input type="text" id="pole_edit_domain_sites_input_linkt" placeholder="Ссылка" value=""></div>',
        pole_edit_domain_sites_body = makeElem("div", null, "pole_edit_domain_sites_body_class", html_edit_body, null, "pole_edit_domain_sites_body"),
        ButtonSaveDLedit = makeElem("div",null,"Button_Panel","<div class=\"ButtonEdit\" id=\"pole_edit_domain_sites_ButtonEdit\">Сохранить</div>",null, null),
        shadow_kogda_edit= makeElem("div", null, null, null, null, "shadow_kogda_edit");

    document.body.appendChild(divFav_panel_button);
    divFav_panel_button.appendChild(divFav_B_show_hide);

        pole_edit_domain_sites.appendChild(pole_edit_domain_sites_header);
        pole_edit_domain_sites.appendChild(pole_edit_domain_sites_body);
        pole_edit_domain_sites.appendChild(ButtonSaveDLedit);     
    
        divFav_panel_button.appendChild(divFav_B);   
    
        document.body.appendChild(divFav_Win_alert);
    
        titlediv_prog.appendChild(search_prog); 
        titlediv_prog.appendChild(divFav_showAll);
        titlediv_prog.appendChild(setting_button);
    
        setting_button_panel.appendChild(texarea_set);

        //setting_button_panel.appendChild(setting_other_but);
        //setting_button_panel.appendChild(setting_other_view);     
        //$(setting_other_but).click(function(){$("#setting_other_view").toggle(1000);});   
    
        setting_button_panel.appendChild(button_backupbd);    
        setting_button_panel.appendChild(button_set);      
 
        divFav_Win.appendChild(setting_button_panel);    
    
        divFav_Win.appendChild(titlediv_prog);
        divFav_Win.appendChild(divFav_WinInner);  
    
        document.body.appendChild(divFav_Win);
    
        document.body.appendChild(pole_edit_domain_sites);    
        document.body.appendChild(shadow_kogda_edit);    

   button_backupbd.addEventListener("click", function(){
       if(this.children[0].innerText !== "Сохранить"){
           var text = JSON.stringify(addf.list),
               file = new Blob([text], {type: "text/plain"}),
               URL = window.URL || window.webkitURL;
           this.children[0].href = URL.createObjectURL(file);
           this.setAttribute("download","backup_bd.txt");
       }
   },false);
    
   divFav_B.addEventListener("click", addSiteFav,false);
   //Button save edit domain title or site link and title 
   var ButtonEdit = document.getElementById("pole_edit_domain_sites_ButtonEdit");
       ButtonEdit.addEventListener("click", Button_Save_Edit_Domain_and_sites_links,false);
    
    // X - close edit panel
    document.getElementsByClassName("pole_edit_domain_sites_header_x")[0].addEventListener("click", function(){
        $("#pole_edit_domain_sites").fadeOut(1000,function(){$("#shadow_kogda_edit").fadeOut(1000);});       
    },false);
    
   texarea_set.addEventListener("input", function(){
       if(texarea_set.value !== JSON.stringify(addf.list)){
           $("#b_backup a").attr("title","Сохранить").text("Сохранить");
       } else {
           $("#b_backup a").attr("title","Сделать бэкап").text("Сделать бэкап");
       }
   },false);  
   
    // Привязываем событие для мыши, для остеживания курсора > указаннного значеня для появления кнопок
   $(document.documentElement).mousemove(showpanel_button_right_plus);

   $("#b_close_save").add("#b_opensetting").click(function(){
           $(".setting_button_panel").fadeToggle('slow', function(){/*loading_other_view();*/});
   });
   
   $("#b_backup").on( "click",function(){
       if($("#b_backup a").text() === "Сохранить"){
           if(confirm("ВНИМАНИЕ:\nВы внесли изменения в базу данных ссылок!\nНеверные изминения в структуре может повредить всю базу!\nСделайте резервную копию!\nВы хотите внести сохранить изменения ?")){
               let txtVal = $("#texarea_set").val();
               if(txtVal != "" && /^\s*$/.test(txtVal) && !/^{.*}$/.test(txtVal)){
                   alert("Неправильные данные!");
                   texarea_set.value = JSON.stringify(addf.list);
                   return;
               }

               try{
                   JSON.parse(txtVal);
               }catch(e){
                   alert("Неправильные данные!\n"+e.name);
                   texarea_set.value = JSON.stringify(addf.list);
                   return;
               }

               saveToStorage(txtVal);
               showAlert("Данные успешно сохранены в базе ссылок!",{col1:"rgba(0, 255, 79, 0.8)",col2:"rgba(9, 84, 6, 0.75)",text_col:"white"});
           } else {
               showAlert("Вы отказались от сохранения данных!",{col1:"rgba(243, 30, 161, 0.83)",col2:"rgba(55, 1, 13, 0.74)",text_col:"white"});
               texarea_set.value = JSON.stringify(addf.list);
               $("#b_backup a").text("Сделать бэкап");
           }
       }
   });
    
   $(divFav_showAll).click(function(){
       var kol_el = 0;       
       if($(this).text() === "+"){
       $(".div_Fav_win_title").nextAll("div").filter(function() {disp[kol_el]=1;kol_el++;return $(this).css("display") === "none";}).slice(0, $(".div_Fav_win_title").length).toggle(1000);
       $(".div_Fav_win_title").css("border-radius", "8px 8px 0px 0px");
       $(this).text('-');
        $(this).css("padding", "0 6px");
       } else {
       $(".div_Fav_win_title").nextAll("div").filter(function() {disp[kol_el]=0;kol_el++;return $(this).css("display") === "block";}).slice(0, $(".div_Fav_win_title").length).toggle(1000); 
       $(".div_Fav_win_title").css("border-radius", "8px 8px 8px 8px");
       $(this).text('+');
       $(this).css("padding", "0 4px");           
       }
   });
    
    $("#divFav_B_search_button").on("input propertychange",function(){
    updateList();    
    });

let typeView = Math.floor(Math.random()*3);

$(divFav_B_show_hide).click(function(){
    if($(".div_Fav_window .div_Fav_window_inner").children().length == 0 && addf.list && addf.list !== null && addf.list !== undefined){
        updateList();
    }

     if(typeView === 0){
         $(".div_Fav_window").toggle(1000,function(){
             divFav_B_show_hide.childNodes[0].innerHTML =(divFav_B_show_hide.childNodes[0].innerText !== "▲")?"▲":"▼";
         });
     } else if(typeView === 1){
         $(".div_Fav_window").slideToggle(1000,function(){
             divFav_B_show_hide.childNodes[0].innerHTML =(divFav_B_show_hide.childNodes[0].innerText !== "▲")?"▲":"▼";
         });
     } else if(typeView === 2){
         $(".div_Fav_window").fadeToggle(1000,function(){
             divFav_B_show_hide.childNodes[0].innerHTML =(divFav_B_show_hide.childNodes[0].innerText !== "▲")?"▲":"▼";
         });
     }
});

// Отобразить сохраненные значения при старте
/*    if(addf.list && addf.list !== null && addf.list !== undefined){
        try{
        updateList();
        } catch(e){
        alert(e);
        }
    }*/
}
    
function showpanel_button_right_plus( event ) {

    var xproc = (event.pageX*100)/document.documentElement.clientWidth;
  // var yproc = ((event.pageY-515)*100)/(document.documentElement.clientHeight);
    if(document.getElementsByClassName("divFav_panel_button")[0]) {
        if(xproc > 70){
            $(".divFav_panel_button").fadeIn("slow");
        } else if(!$("#pole_edit_domain_sites").is(":visible")){
            $(".divFav_panel_button").fadeOut("slow");

            if($(".div_FavB")[0].childNodes[0].innerText !== "▲"){
                $(".div_Fav_window").fadeOut(1000,function(){
                    $(".div_FavB")[0].childNodes[0].innerHTML = ($(".div_FavB")[0].childNodes[0].innerText != "▲")?"▲":"▼";
                });
            }

        }
    }
}
    init();
    
})();
