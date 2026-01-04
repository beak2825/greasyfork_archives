// ==UserScript==
// @name        muahahaha tusubtitulo.com
// @namespace   muahahaha
// @version     1.2
// @include     https://www.tusubtitulo.com/list.php?*
// @include     https://www.tusubtitulo.com/show/*
// @include     https://www.tusubtitulo.com/season/*
// @run-at      document-end
// @grant       unsafeWindow
// @description to srt in translation
// @downloadURL https://update.greasyfork.org/scripts/40699/muahahaha%20tusubtitulocom.user.js
// @updateURL https://update.greasyfork.org/scripts/40699/muahahaha%20tusubtitulocom.meta.js
// ==/UserScript==

unsafeWindow.muahahaha=function(){
    var es_traduccion=/^\/list.php$/.test(location.pathname);
    var es_listado=(
        /^\/show\/[0-9]+$/.test(location.pathname)
        ||
        /^\/season\/[0-9]+\/[0-9]+$/.test(location.pathname)
    );
    if(es_listado){
        if(
            document
            &&document.querySelectorAll
            &&document.querySelectorAll('#episodes>table').length
        ){
            var contenedor=document.querySelector('#episodes');
            Array.from( document.querySelectorAll('#episodes>table') )
                .map( $v => contenedor.removeChild($v) )
                .reverse()
                .forEach( $v => contenedor.appendChild($v) )
            ;
        }
        else{
            setTimeout(unsafeWindow.muahahaha,500+1000*Math.random());
        }
    }
    else if(es_traduccion){
        if(
            unsafeWindow.sub
            &&unsafeWindow.sub.sequences
            &&Object.getOwnPropertyNames(unsafeWindow.sub.sequences).length
        ){
            var botoncito=document.createElement('button');
            botoncito.setAttribute('type','button');
            botoncito.appendChild(document.createTextNode('To SRT'));
            document.querySelector('#toggle_last_version').parentElement.appendChild(botoncito);
            botoncito.addEventListener('click',function(){

                var time2text=function(time){
                    return ''
                        +(time.Hour<10?'0':'')+time.Hour
                        +':'+(time.Min<10?'0':'')+time.Min
                        +':'+(time.Sec<10?'0':'')+time.Sec
                        +','+(time.Milli<100?'0':'')+(time.Milli<10?'0':'')+time.Milli
                    ;
                };

                var ms2text=function(ms){
                    var t=new Date();
                    t.setHours(0);
                    t.setMinutes(0);
                    t.setSeconds(0);
                    t.setMilliseconds(0);
                    t.setTime(t.getTime()+1*ms);
                    return time2text({Hour:t.getHours(),Min:t.getMinutes(),Sec:t.getSeconds(),Milli:t.getMilliseconds()});
                };

                var srt=[];
                for(var i=0,l=Object.getOwnPropertyNames(unsafeWindow.sub.sequences),n=1;i<l.length;i++,n++){
                    while(unsafeWindow.sub.sequences[l[i]].Number-n){
                        srt.push([
                            n
                            ,''+ms2text(unsafeWindow.Subtitle.secondaryLangs[unsafeWindow.sub.secondaryLangId][n].tstart)
                            +' --> '+ms2text(unsafeWindow.Subtitle.secondaryLangs[unsafeWindow.sub.secondaryLangId][n].tend)
                            ,'['+unsafeWindow.Subtitle.secondaryLangs[unsafeWindow.sub.secondaryLangId][n].text+']'
                        ].join('\n'));
                        n++;
                    }
                    srt.push([
                        unsafeWindow.sub.sequences[l[i]].Number
                        ,''+time2text(unsafeWindow.sub.sequences[l[i]].StartTime)+' --> '+time2text(unsafeWindow.sub.sequences[l[i]].EndTime)
                        ,unsafeWindow.sub.sequences[l[i]].Text
                    ].join('\n'));
                }

                var negrito=document.createElement('div');
                negrito.setAttribute('style','position:fixed;top:0;left:0;height:100vh;width:100vw;background:rgba(0,0,0,0.5);');
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
