// ==UserScript==
// @name        Find unused keys @Groupees
// @namespace   https://greasyfork.org/users/726
// @version     0.93
// @author      Deparsoul
// @description Find unused keys at groupees.com
// @include     /^https?:\/\/groupees\.com\/users\/\d+/
// @include     /^https?:\/\/groupees\.com\/purchases/
// https://groupees.com/purchases
// @license     GPL version 3 or any later version
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4621/Find%20unused%20keys%20%40Groupees.user.js
// @updateURL https://update.greasyfork.org/scripts/4621/Find%20unused%20keys%20%40Groupees.meta.js
// ==/UserScript==

function main(){

var fuk_button = jQuery('<button id="find_unused_keys" class="button" style="padding:10px;margin:10px;">Find unused keys in following bundles</button>');
jQuery('#profile_content').prepend(fuk_button);

fuk_button.click(function(){
    fuk_button.text('Loading ...').prop("disabled", true);;
    fuk_load(0);
});

function fuk_load(i){
    var item = $('.profile-item:eq('+i+')');
    
    if(item.length<1){
        fuk_button.text('Done');
        return;
    }

    var id = item.data('id');
    jQuery.get('/orders/'+id, {user_id:ProfileApp.user.id}, function(data){
        eval(data);
        item.find('.product').each(function(){
            var product = jQuery(this);
            if(product.find('input.code:enabled').length==0)
                product.remove();
        });
        if(item.find('.product').length==0)
            item.slideUp();
    });

    setTimeout('fuk_load('+(i+1)+')', 1000);
}

}

var script = main.toString();
script = script.slice(script.indexOf('{')+1, -1);
var newElem = document.createElement('script');
newElem.type = 'text/javascript';
newElem.innerHTML = script;
document.body.appendChild(newElem);
