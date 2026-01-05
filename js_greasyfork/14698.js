// ==UserScript==
// @name       Fast Attach
// @namespace  Naoko-
// @version    0.1
// @description  Para adjuntar imagen-video con solo poner el link (y un enter como en Facebook)
// @match      http://www.taringa.net/mi
// @downloadURL https://update.greasyfork.org/scripts/14698/Fast%20Attach.user.js
// @updateURL https://update.greasyfork.org/scripts/14698/Fast%20Attach.meta.js
// ==/UserScript==

var LaPutaMadre;
$(document).ready(function(){

    $('#my-shout-body-mi').on('keyup',function(e){
        var patt=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?[\r\n|\n|\r]+/;
        var str= $(this).val();
        var ok=patt.test(str);
        
        if(ok&&!LaPutaMadre){
            e.preventDefault();

             var url=patt.exec(str)[0];
            var Aform = $('.add-url').children('form');
            var Attype="";
            if(url.endsWith('.jpg')||url.endsWith('.png')||url.endsWith('.gif')){
                Attype="image";
            }
            else{
                Attype="video";
            }
            if($('.my-shout-attach').hasClass('attach-image')||$('.my-shout-attach').hasClass('attach-video')||$('.my-shout-attach').hasClass('attach-link')){
                $('.my-shout-attach').hasClass('attach-image');
               $('.my-shout-attach').hasClass('attach-video');
                $('.my-shout-attach').hasClass('attach-link');
            }
            $('.my-shout-attach').addClass('attach-'+Attype);
            $('.my-shout-attach').html(tmpl('template_attach_'+Attype+'_input'));
            $('.my-shout-attach').show();
            $('input.simple').val(url);
            //var el=$('.my-shout-attach-options .image a[data-type="'+Attype+'"]').closest('.shout-box');
           var el=$('.shout-box[data-in="mi"]')
            mi.attach.submitUrl(el,Attype);          
            var ShoutCleaned=$('#my-shout-body-mi').val().replace(url,"");
             $('#my-shout-body-mi').val(ShoutCleaned);
            LaPutaMadre=true;
            $(document).on('click','.remove-attach',function(){
                LaPutaMadre=false;
			});
        }
        
    });
    LaPutaMadre=false;
});
LaPutaMadre=false;
console.log(LaPutaMadre);
