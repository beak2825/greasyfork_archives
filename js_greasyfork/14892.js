// ==UserScript==
// @name         Visor de junabilidad
// @namespace    Naoko-
// @version      0.3
// @description  Agrega un medidor de junabilidad en perfiles
// @author       You
// @include        http*://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14892/Visor%20de%20junabilidad.user.js
// @updateURL https://update.greasyfork.org/scripts/14892/Visor%20de%20junabilidad.meta.js
// ==/UserScript==

(function($){
    var CalcJuna=function(value){
        value = value.replace(/@/ig,'');
        $.get('https://api.taringa.net/user/nick/view/'+value,function(e){
            if(e.code!='undefined'){
                $.get('https://api.taringa.net/shout/user/view/'+e.id+'?count=50',function(eo){
                    if(Object.prototype.toString.call(eo) === '[object Array]' ) {
                        if(eo.length>0){
                            var likeProm=0;
                            var favProm=0;
                            var reshoutProm=0;
                            var replyProm=0;
                            var b=0;
                            for(a=0;a<eo.length;a++){
                                //promedios

                                if(eo[a].reshouter==null){
                                    likeProm+=eo[a].likes;
                                    favProm+=eo[a].favorites;
                                    reshoutProm+=eo[a].forwards;
                                    replyProm+=eo[a].replies;
                                    b++;
                                }
                            }
                            likeProm=(likeProm/b);
                            favProm=(favProm/b);
                            reshoutProm=(reshoutProm/b);
                            replyProm=(replyProm/b)
                            var finalVal=((likeProm+favProm+reshoutProm+replyProm)/b)*100;
                            var fText = "";
                            //Tomamos como base 500
                            if(finalVal<10){
                                fText='Tremendamente Injunable, no lo quieren ni los bots.';
                            }
                            if(finalVal>9 && finalVal<20){
                                fText='Injunable, no lo mires, cerrá esta pestaña.'
                            }
                            if(finalVal>19 && finalVal<100){
                                fText='Junable';
                            }
                            if(finalVal>99){
                                fText='Estrellita del Mi'
                            }

                            if(value.indexOf('falla')>-1){
                                fText+='<br> Persona no grata en Taringa';
                            }
                            
                            //Usamos Bigote para el template. 2015 amigos...
                            var template ='<p style="color:#000"><strong>Puntos: </strong>{{level}}</p><p style="color:#000"><strong>{{&rank}}</strong></p>';
                            var result={level:Math.floor(finalVal),rank:fText};

                            $('.junab').html(Mustache.render(template, result));
                            
                        }
                        else{
                            template ='<p style="color:#000"><strong>Puntos: </strong>{{level}}</p><p style="color:#000"><strong>{{&rank}}</strong></p>';
                            result={level:0,rank:'No lo juna nadie'};
                            $('.junab').html(Mustache.render(template, result));
                        }
                    }
                });      
            }
            else{
               //??
            }
        });

    }

    //Re obvio, si es null, no estamos en un perfil

    var nick = $('.nickname').html();
    if(nick===null) return; //Salimos, no hacemos nada mogolico de mierda

   
    $('#sidebar').prepend('<div class="box clearfix"><div class="title clearfix"><h2>Junabilidad</h2></div><div class="junab">Cargando...</div></div>');
    CalcJuna(nick);

})(jQuery);