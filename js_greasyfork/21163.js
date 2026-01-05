// ==UserScript==
// @name        ss-Google-Search
// @namespace   ss-Google-Search
// @description highlight keywords and double tap 's' key
// @version     1
// @grant       none
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/21163/ss-Google-Search.user.js
// @updateURL https://update.greasyfork.org/scripts/21163/ss-Google-Search.meta.js
// ==/UserScript==
var reset_function;
var current_key_state = 0;
var search_string;
var search_string_url;
var google_search_api = "https://www.google.com.hk/search?q=";
var query_specials_map = {};
query_specials_map["%"] = "%25";	
query_specials_map["&"] = "%26";
function search_query_paser(text){
for (var key in query_specials_map) {
text = text.split(key).join(query_specials_map[key]);
} 
return text;
} 
function search(){  
    search_string = search_query_paser(window.getSelection().toString()); 
    if (""===search_string) return; 
    search_string_url = google_search_api + search_string  
    window.open(search_string_url, "Powered By ss-Google-Search",
    	"toolbar=yes,menubar=yes,resizable=yes,titlebar=yes.location=yes,scrollbars=yes,status=yes,width=" + 
    	screen.width + ",height=" + screen.height);  
}
document.addEventListener('keydown', function(event) {  
//alert(event.keyCode.toString()); 
    if (event.keyCode == 83) {  
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
    search();
    return;
    } 
    }
    current_key_state = 0;
    clearTimeout(reset_function);
}, true);
 
