// ==UserScript==
// @name        muahahaha subtitulamos.tv
// @namespace   muahahaha
// @version     1.2
// @include     https://www.subtitulamos.tv/shows/*
// @include     https://www.subtitulamos.tv/subtitles/*/translate
// @run-at      document-end
// @grant       unsafeWindow
// @description to srt in translation
// @downloadURL https://update.greasyfork.org/scripts/40696/muahahaha%20subtitulamostv.user.js
// @updateURL https://update.greasyfork.org/scripts/40696/muahahaha%20subtitulamostv.meta.js
// ==/UserScript==

unsafeWindow.muahahaha=function(){
    var es_listado=/^\/shows\/[0-9]+\/?.*$/.test(location.pathname);
    var es_traduccion=/^\/subtitles\/[0-9]+\/translate$/.test(location.pathname);
    if(es_listado){
        var contenedor=document.querySelector('#episodes');
        Array.from( contenedor.querySelectorAll('.episode') )
            .map( $v => contenedor.removeChild($v) )
            .reverse()
            .forEach( $v => contenedor.appendChild($v) )
        ;
    }
    else if(es_traduccion){
        if(
            unsafeWindow.translation
            &&unsafeWindow.translation.sequences
            &&unsafeWindow.translation.sequences.length
        ){
            var botoncito=document.createElement('button');
            botoncito.setAttribute('type','button');
            botoncito.appendChild(document.createTextNode('To SRT'));
            document.querySelector('#translation-tools').appendChild(botoncito);
            botoncito.addEventListener('click',function(){

                var ms2text=function(ms){
                    var t=new Date();
                    t.setHours(0);
                    t.setMinutes(0);
                    t.setSeconds(0);
                    t.setMilliseconds(0);
                    t.setTime(t.getTime()+ms);
                    return ''
                        +(t.getHours()<10?'0':'')+t.getHours()
                        +':'+(t.getMinutes()<10?'0':'')+t.getMinutes()
                        +':'+(t.getSeconds()<10?'0':'')+t.getSeconds()
                        +','+(t.getMilliseconds()<100?'0':'')+(t.getMilliseconds()<10?'0':'')+t.getMilliseconds()
                    ;
                };

                var srt=[];
                for(var i=0;i<unsafeWindow.translation.sequences.length;i++){
                    srt.push([
                        i+1
                        ,''+ms2text(unsafeWindow.translation.sequences[i].tstart)+' --> '+ms2text(unsafeWindow.translation.sequences[i].tend)
                        ,unsafeWindow.translation.sequences[i].text===''?('['+unsafeWindow.translation.sequences[i].secondary_text+']'):unsafeWindow.translation.sequences[i].text
                    ].join('\n'));
                }

                var negrito=document.createElement('div');
                negrito.setAttribute('style','z-index:999;position:fixed;top:0;left:0;height:100vh;width:100vw;background:rgba(0,0,0,0.5);');
                document.querySelector('body').appendChild(negrito);
                document.querySelector('body').style.overflow='hidden';
                negrito.addEventListener('click',function(event){
                    event.target.parentElement.removeChild(event.target);
                    document.querySelector('body').style.overflow='auto';
                });

                var textarea=document.createElement('textarea');
                textarea.setAttribute('style','height:calc(100vh - 10vh * 2);width:calc(100vw - 10vh * 2);margin:10vh;');
                textarea.value=srt.join('\n\n');
                negrito.appendChild(textarea);
                textarea.addEventListener('click',function(event){
                    event.stopPropagation();
                },{capture:true});
                textarea.addEventListener('dblclick',function(event){
                    event.target.select();
                },{capture:true});

            });
        }
        else{
            setTimeout(unsafeWindow.muahahaha,500+1000*Math.random());
        }
    }
};
unsafeWindow.muahahaha();
