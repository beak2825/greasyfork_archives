// ==UserScript==
// @name        Find unused keys @Desura
// @namespace   https://greasyfork.org/users/726
// @description Find unused keys at www.desura.com/collection
// @include     http://www.desura.com/collection*
// @version     0.1
// @author      Deparsoul
// @license     GPL version 3 or any later version
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4632/Find%20unused%20keys%20%40Desura.user.js
// @updateURL https://update.greasyfork.org/scripts/4632/Find%20unused%20keys%20%40Desura.meta.js
// ==/UserScript==

function main(){

var fuk_button = jQuery('<a style="width:61px;color:darkred;" class="filterbtn btnfilter" href="#" id="find_unused_keys"><span>Find unused keys in following games</span></a>');

jQuery('#btnfilters').prepend(fuk_button);

fuk_button.click(function(){
    fuk_button.text('Checking ...').prop("disabled", true);;
    jQuery('.box').fadeTo('fast', 0.1);
    fuk_load(0);
});

function fuk_load(i){
    var item = jQuery('.box:eq('+i+')');
    
    if(item.length<1){
        fuk_button.text('Done');
        return;
    }

    var id = item.find('a.more').attr('href');
    jQuery.get(id+'/keys/', function(data){
        var page = jQuery(data);
        if(page.find('input:text[value=""]').length>0)
            item.fadeTo('fast', 1.0);
        else
            item.fadeOut('fast');
    });

    setTimeout('fuk_load('+(i+1)+')', 200);
}

}

var script = main.toString();
script = script.slice(script.indexOf('{')+1, -1);
var newElem = document.createElement('script');
newElem.type = 'text/javascript';
newElem.innerHTML = script;
document.body.appendChild(newElem);
