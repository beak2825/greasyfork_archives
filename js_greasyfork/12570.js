// ==UserScript==
// @name         Coso que esconde shouts con palabras determinadas
// @namespace    Naoko
// @version      0.5
// @description  lo del titulo
// @author       @Naoko-
// @match        http://www.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12570/Coso%20que%20esconde%20shouts%20con%20palabras%20determinadas.user.js
// @updateURL https://update.greasyfork.org/scripts/12570/Coso%20que%20esconde%20shouts%20con%20palabras%20determinadas.meta.js
// ==/UserScript==

(function($){
    var adt='<li class="bck"><a class="btn g" title="Bloqueos"><div class="btn-text"><i class="s-pic"></i></div></a></li>';
    var adtt='<div class="clearfix attach-bck" style="display: none;padding: 10px;width: 543px;border: 1px solid #CCC;border-radius: 0 0 3px 3px;border-top: 0;position: relative;"><a class="remove-attach floatR"><i class="icon remove-s"></i></a><div class="add-url" style="margin-top: 15px;margin-bottom: -5px;"><input class="simple bck" type="text" name="url" tabindex="601" placeholder="Escribe la palabra" autocomplete="off"></div><div style="margin-top: 8px;" class="list pija-list"></div></div></div>';
    prefix='<div class="list-element"><b>%%word%%</b><span class="value delBl" data-word="%%word%%">Eliminar</span></div>';
    function getBList(){
        if(localStorage.WordBlackList == undefined){
            localStorage.setItem('WordBlackList','[]');
            
            return [];
        }
        var de=JSON.parse(localStorage.WordBlackList);

        return de;
    }
    
    function addWord(word){

        var de=JSON.parse(localStorage.WordBlackList);
        de.push(word);
        localStorage.WordBlackList=JSON.stringify(de);

    }
    
    function removeWord(word){
       
        var de=JSON.parse(localStorage.WordBlackList);
        var indx=de.indexOf(word);
        if(indx>-1){    
            de.splice(indx,1);
            localStorage.WordBlackList=JSON.stringify(de);
        }
    }
    
    var hideShouts=function(){
        //Callbacks, callbacks, and more callbacks
        $('.activity-element.shout,.activity-element.image,.activity-element.video,.activity-element.link').each(function(a, obj){
         
            var shoutContent=$(obj).find('.activity-content').html();
            var dataHide=$(obj).attr('data-feed');

            var list=getBList();
            for(a=0;a<list.length;a++){
                //make regex
                var expr= new RegExp(list[a],'ig');
                var ok=expr.test(shoutContent);

                if(ok){
                    //Hide!
                    $(obj).hide();
                    //and make request
                    $.post('/ajax/newsfeed/hide',{id:dataHide});
                }
            }                 

        });     
    }


    //Internal

    $.fn.addButton=function(cl,title,top){
        var btnTemplate='<button class="btn %class%">%title%</button>';
        if(typeof top=='undefined'){
            this.append(btnTemplate.replace('%class%',cl).replace('%title%',title));
        }
        else{
            this.prepend(btnTemplate.replace('%class%',cl).replace('%title%',title));
        }
        return this;
    };


    $(document).ready(function(){
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(searchString, position) {
                position = position || 0;
                return this.indexOf(searchString, position) === position;
            };
        }
        $('.my-shout-attach-options').prepend(adt);
        $('.my-shout-content-mi').prepend(adtt);
        $('.bck i.s-pic').css({'background':'url("data:image/png;base64,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")',
                               'background-position':0,
                               'background-repeat':'no-repeat',
                               'background-size': '16px',
                               'top': '-1px',
                               'left': '1px',
                              });
        $('.my-shout-attach-options').on('click','.bck',function(e){
            e.preventDefault();
            e.stopPropagation();
            $('#uploadImagemi9766Uploader').css({'top':'-1000px'});
            $('.my-shout-attach,.dropdown-menu.my-shout-attach-image.select-list').hide();
            $('.pija-list').html('');
            //Fill word list
            var list=getBList();
            for(a=0;a<list.length;a++){
                $('.pija-list').append('<div class="list-element"><b>'+list[a]+'</b><span style="cursor:pointer" class="value delWrd" data-word="'+list[a]+'">Eliminar</span></div>');
            }
            if(list.length<1){$('.pija-list').append( '<div class="list-element noword">No hay palabras bloqueadas</div>');}
            
            $('.attach-bck').show();            
        });
        $('.attach-bck').on('click','.remove-attach',function(e){e.preventDefault();e.stopPropagation();$('.attach-bck').hide()});
        $('.attach-bck > .add-url').addButton('g if-urlup simple-btn word-add" style="padding: 6px 10px;margin-top: 1px;"','Añadir'); 
        $('li.link,li.video,li.image').on('click',function(){
            $('.attach-bck').hide();
        });
        $('.bck > a').tipsy();

        //Finally
        $(document).ajaxSuccess(function(event,jqXHR,settings){
            if(settings.url.indexOf('ajax/feed/fetch')>-1){
                hideShouts();
            }
        });
        $(document).on('click','.delWrd',function(){
            removeWord($(this).attr('data-word'));
            $(this).parent('.list-element').slideToggle(200);
        });
        $(document).on('click','.word-add',function(){
            var valu=$('input.bck').val();
            if(valu!=""){
                addWord(valu);
                $('.pija-list').append('<div class="list-element"><b>'+valu+'</b><span style="cursor:pointer" class="value delWrd" data-word="'+valu+'">Eliminar</span></div>');
                $('.noword').remove();
                $('input.bck').val('');
            }
        });
        hideShouts();
        
    });
})(jQuery);