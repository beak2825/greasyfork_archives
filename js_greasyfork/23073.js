// ==UserScript==
// @name        tt-Google-Translate
// @namespace   tt-Google-Translate
// @description highlight keywords and double tap 't' key
// @version     1
// @grant       none
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/23073/tt-Google-Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/23073/tt-Google-Translate.meta.js
// ==/UserScript==
var reset_function;
var current_key_state = 0;
var translate_string;
var google_translate_final_url;
var google_translate_api = "https://translate.google.com.hk/?hl=en&tab=wT#en/zh-TW/";
/*
var query_specials_map = {};
query_specials_map["%"] = "%25";    
query_specials_map["&"] = "%26";
*/
function translate_query_parser(text){
    /*
for (var key in query_specials_map) {
text = text.split(key).join(query_specials_map[key]);
} 
*/
return text;
} 
function translate(){  
    translate_string = translate_query_parser(window.getSelection().toString()); 
    if (""===translate_string) return; 
    google_translate_final_url = google_translate_api
    + translate_string;
    window.open(google_translate_final_url, "Powered By tt-Google-Translate",
        "toolbar=yes,menubar=yes,resizable=yes,titlebar=yes.location=yes,scrollbars=yes,status=yes,width=" + 
        screen.width + ",height=" + screen.height); 
}
document.addEventListener('keydown', function(event) {  
//alert(event.keyCode.toString()); 
    if (event.keyCode == 84) {  
    if(current_key_state == 0){
    current_key_state = 1;
    //clearTimeout(reset_function);
    reset_function = setTimeout(function(){ 
     current_key_state = 0;
     }, 300); 
     return;
    }
    if(current_key_state == 1){ 
    current_key_state = 0;
    clearTimeout(reset_function);    
    translate();
    return;
    } 
    }
    current_key_state = 0;
    clearTimeout(reset_function);
}, true);
 
