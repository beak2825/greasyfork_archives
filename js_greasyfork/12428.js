// ==UserScript==
// @name         Taringa Google Imagenes
// @namespace    Fabi
// @version      0.93
// @description  Buscar imagenes en google en comentarios/shouts
// @author       @OK
// @match        http://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12428/Taringa%20Google%20Imagenes.user.js
// @updateURL https://update.greasyfork.org/scripts/12428/Taringa%20Google%20Imagenes.meta.js
// ==/UserScript==

var Templat={
    button:'<button class="btn btn--blue gi-toggle" onclick="toggleDropWindow($(this))">Google Imagenes</button>',
    imageFrame:'<li><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" onerror="$(this).parent(\'li\').remove();"></li>',
    commtDropDown:'<div class="gi-container-comment"><input type="hidden" class="gi-page" value=""><div class="gi-search-search"><input type="text" class="gi-search-box"/><button class="btn btn--blue gi-button-search">Buscar</button></div><hr><ul></ul></div>',
    shoutTab:'<div class="clearfix gi-container-shout" id="gi-container-shout" style="display: none;padding: 10px;width: 543px;border: 1px solid #CCC;border-radius: 0 0 3px 3px;border-top: 0;position: relative;"><a class="remove-attach floatR"><i class="icon remove-s"></i></a></div>',
    createTemplate:function(type){
        var template;
        switch(type){
            case 'button':
                template= $(Templat.button);
                break;
            case 'shout':
                template= $(Templat.shoutTab);
                $('.my-shout-content-mi').prepend(template);
                break;
            case 'comment':
                $('.cont_comm').append(Templat.commtDropDown);
                break;
        }
        
    },
    addStyleSheet:function(){
        var stsh='.gi-container-comment.gi-loading:after{content:"Cargando...";position:absolute;color:#FFF;right:17px;margin-top:-69px;background-color:#455A64;padding:13px 26px}.gi-container-comment{margin-bottom: 10px;display:none;width: 560px;height: 300px; overflow: hidden;overflow-y: scroll;border: solid 1px #C6C6C6;padding: 8px;}.gi-container-comment ul{list-style:none;margin:0;padding:0}.gi-container-comment ul li{margin:5px;padding:0;float:left;width:150px;height:150px; overflow: hidden;}.gi-container-comment ul li img{width:100%;cursor:pointer}';
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.appendChild(document.createTextNode(stsh));
        document.getElementsByTagName('head')[0].appendChild(s);
    }
};
toggleDropWindow=function(obj){
    //gi-reply
   $(obj).parent().find('.gi-container-comment').toggle();

};
//Pagination
var gPage=function(term,obj,page){
    if(parseInt(page)==-1){return;}
    $.ajax({
        url:'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+term,
        dataType:'jsonp',
        jsonpCallback: "taringa",
        beforeSend:function(er,rr){
            rr.url='https://ajax.googleapis.com/ajax/services/search/images?v=1.0&rsz=8&callback=taringa&start='+page+'&q='+term;
            $(obj).parent('.gi-search-search').parent('.gi-container-comment').addClass('gi-loading');
        },
        success:function(e){
            $(obj).parent('.gi-search-search').parent('.gi-container-comment').removeClass('gi-loading');
            
            if(e.responseStatus==400){
                //No más resultados
                $(obj).parent('.gi-search-search').parent('.gi-container-comment').children('ul').append('<li><b>No hay más resultados</b></li>');
                $(obj).parent('.gi-search-search').parent('.gi-container-comment').find('.gi-page').val(-1);
                return;
            }
            var results=e.responseData.results;
            for (a=0;a<results.length;a++){
                var temImg=$(Templat.imageFrame);
                $(temImg).children('img').attr('src',results[a].url);
                var uurl=results[a].url;
                $(obj).parent('.gi-search-search').parent('.gi-container-comment').children('ul').append(temImg);
               
            }
             
            if(results.length<1){$(obj).parent('.gi-search-search').parent('.gi-container-comment').children('ul').append('<li>No hay más resultados</li>');}
            
            else{
                $(obj).parent('.gi-search-search').parent('.gi-container-comment').find('.gi-page').val(page*2);
            }
        }
    })
};
var gSearch=function(term,obj){
    
    $.ajax({
        url:'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+term,
        dataType:'jsonp',
        jsonpCallback: "taringa",
        beforeSend:function(er,rr){
            rr.url='https://ajax.googleapis.com/ajax/services/search/images?v=1.0&rsz=8&start=0&callback=taringa&q='+term;
            $(obj).parent('.gi-search-search').parent('.gi-container-comment').addClass('gi-loading');
        },
        success:function(e){
            $(obj).parent('.gi-search-search').parent('.gi-container-comment').removeClass('gi-loading');
            var results=e.responseData.results;
            $(obj).parent('.gi-search-search').parent('.gi-container-comment').children('ul').html('');
            for (a=0;a<results.length;a++){
                var temImg=$(Templat.imageFrame);
                $(temImg).children('img').attr('src',results[a].url);
                var uurl=results[a].url;
                $(obj).parent('.gi-search-search').parent('.gi-container-comment').children('ul').append(temImg);

            }
           
            if(results.length<1){$(obj).parent('.gi-search-search').parent('.gi-container-comment').children('ul').append('<li><b>No se encontraron resultados</b></li>');}
             $(obj).parent('.gi-search-search').parent('.gi-container-comment').find('.gi-page').val(e.responseData.cursor.pages[1].start);

        }
    })
};

//Start
$(document).ready(function(){
    //Add Stylesheet
    Templat.addStyleSheet();
    Templat.createTemplate('comment');
    Templat.createTemplate('shout');
    $('.dropdown-menu.my-shout-attach-image.select-list').prepend('<li><a href="#" onclick="event.preventDefault();event.stopPropagation();$(\'#uploadImagemi4581Uploader\').css(\'\',\'top: -1000px!important;\');$(\'.gi-container-shout, .dropdown-menu.my-shout-attach-image.select-list,.gi-container-comment\').toggle();">Desde Google</a></li>');
    $('div.myComment-text-box').append(Templat.button);
    $('.gi-container-shout').append(Templat.commtDropDown);
    $('.gi-container-shout').find('.gi-container-comment').css({'width':'526px'});
    $('.gi-container-shout').on('click','.remove-attach',function(e){e.preventDefault();e.stopPropagation();$('.gi-container-shout, .gi-container-comment').hide();});
    $('body').on('click','.answerCitar',function(){

        var ooj=$(this).offsetParent().offsetParent().offsetParent().find('#cont_reply');
        console.log(ooj);
        $(ooj).append($(Templat.commtDropDown).css({'width':'485px'}).addClass('gi-reply'));
    });
    
    //InfiniteScroll
    
    $('.gi-container-comment').bind('scroll', function(){
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight){
           gPage($(this).find('.gi-search-search').find('.gi-search-box').val(),$(this).find('.gi-search-search').find('.gi-button-search'),$(this).find('.gi-page').val());
        }
    });
    
    $('body').on('click','.gi-search-search .gi-button-search',function(){
        var term=$(this).parent('.gi-search-search').find('.gi-search-box').val();
        if(term==""){return;}
        gSearch(term,$(this));
    });
    $('.gi-container-comment').on('click','li',function(){
                                       
                    if($(this).context.offsetParent.id.indexOf('cont_reply')>-1){
                         var khe=$($(this).context.offsetParent).find('.form-input-text');

                        $(khe).val($(khe).val()+'\n[img='+$(this).find('img').attr('src')+']');
                    }
                    else if($(this).context.offsetParent.id.indexOf('gi-container-shout')>-1){
                        var Attype="image";
                        $('.my-shout-attach').addClass('attach-'+Attype);
                        $('.my-shout-attach').html(tmpl('template_attach_'+Attype+'_input'));
                        $('.my-shout-attach').show();
                        $('input.simple').val($(this).find('img').attr('src'));
                        var el=$('.shout-box[data-in="mi"]')
                        mi.attach.submitUrl(el,Attype);         
                        $('.gi-container-shout, .gi-container-comment').hide();

                    }
                    else{
                        var khe=$($(this).context.offsetParent).find('.form-input-text');

                        $(khe).val($(khe).val()+'\n[img='+$(this).find('img').attr('src')+']');
                    }
                });
});