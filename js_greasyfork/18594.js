// ==UserScript==
// @name         improveV6
// @namespace    http://topraider.eu
// @version      6.1.5.0
// @description  improve message for OGame V6
// @author       Vulca
// @include       http://*.ogame.gameforge.com/game/index.php?page=messages*
// @include       http://*.ogame.gameforge.com/game/index.php?page=fleet1*
// @include       http://*.ogame.gameforge.com/game/index.php?page=research*
// @include       https://*.ogame.gameforge.com/game/index.php?page=messages*
// @include       https://*.ogame.gameforge.com/game/index.php?page=fleet1*
// @include       https://*.ogame.gameforge.com/game/index.php?page=research*
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/18594/improveV6.user.js
// @updateURL https://update.greasyfork.org/scripts/18594/improveV6.meta.js
// ==/UserScript==
'use strict';

function Vu_getValue(key,defaultVal) 
{
    try 
    {  return GM_getValue(key,defaultVal);    } 
    catch( err )
    {  
        return defaultVal;
    }
}

function Vu_setValue(key,value) 
{
    try 
    {  GM_setValue(key,value); } 
    catch( err )
    {}
}

function trim(string)
{return string.replace(/(^\s*)|(\s*$)/g,'');} 


function extractRess(res)
{
    if(/:/.test(res.textContent))
        res =trim(res.textContent.split(':')[1]);
    else
        res=trim(res.textContent);


    if(/^[0-9]{1,3}\.[0-9]{3}$/.test(res))
        res=res.replace(/\./g,'');
    else if (/^([0-9]{1,3}(\.|,))?[0-9]{1,3}(Md|Bn|Mrd)/.test(res))
        res=res.replace(/,/g,'.').replace(/Md|Bn|Mrd/g,'')*1000000000;
    else if (/^([0-9]{1,3}(\.|,))?[0-9]{1,3}(M|m)/.test(res))
        res=res.replace(/,/g,'.').replace(/(M|m)/g,'')*1000000;


    return parseInt(res);       
}

function compactNumber(n) 
{
    n=addPoints(n);


    if( /(^-?[0-9]{1,3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3})$/.test(n))
    {   
        n=n.replace(/([0-9]{1,2}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}$)/, "KT");
    }
    else if(/(^-?[0-9]{1,3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3})$/.test(n))
    {   
        n=n.replace(/([0-9]{1,2}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}$)/, "T");
    }
    else if(/(^-?[0-9]{1,3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3})$/.test(n))
    {   
        n=n.replace(/([0-9]{1,2}\.[0-9]{3}\.[0-9]{3}$)/, "G");
    }
    else if(/(^-?[0-9]{1,3}\.[0-9]{3}\.[0-9]{3}$)/.test(n))
    {
        n=n.replace(/([0-9]{1,2}\.[0-9]{3}$)/, "M");
    }   

    else if(/(^-?[0-9]{1,3}\.[0-9]{3}$)/.test(n))
    {
        n=n.replace(/([0-9]{2}$)/, "K");
    }       


    return n;
}

function addPoints(nombre)
{

    var signe = '';
    if (nombre<0)
    {
        nombre = Math.abs(nombre);
        signe = '-';
    }
    nombre=parseInt(nombre);
    var str = nombre.toString(), n = str.length;
    if (n <4) {return signe + nombre;} 
    else 
    {
        return  signe + (((n % 3) ? str.substr(0, n % 3) + '.' : '') + str.substr(n % 3).match(new RegExp('[0-9]{3}', 'g')).join('.'));
    }

}
function addGT()
{
    if(!document.getElementsByClassName('addGT')[0] && document.getElementsByClassName('resspan')[0])
    {
        var message = document.getElementsByClassName('msg');
        var listeRC=Vu_getValue('listeRc'+serveur+idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');

        for(var i=0 ; i<message.length ; i++)
        {
            var ress = message[i].getElementsByClassName('resspan');


            if(ress[0])
            {

                message[i].getElementsByClassName('compacting')[0].style.display="none";
                message[i].getElementsByClassName('compacting')[2].style.display="none";
                if(message[i].getElementsByTagName('br')[2])
                    message[i].getElementsByTagName('br')[2].style.display="none";




                var m =extractRess(ress[0]);
                var c =extractRess(ress[1]);
                var d =extractRess(ress[2]);

                var coef=message[i].getElementsByClassName('ctn ctn4')[4].textContent.replace(/[^0-9]/g,'');


                var fret=coef/100*(m+c+d);
                
                if(fret>2500000)
                    fret+=250000;
                else fret*=1.1;
                    

                var link=message[i].getElementsByClassName('msg_actions clearfix')[0].getElementsByTagName('a')[3].href;
                
                if(message[i].getElementsByClassName('icon_espionage')[0])  //v6.1.5
                    var link=message[i].getElementsByClassName('msg_actions clearfix')[0].getElementsByTagName('a')[2].href;

                var APIkey = /(sr-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(message[i].getElementsByClassName('icon_apikey')[0].title)[0].split('-')[3];


                var linkGT=link+'&am203='+Math.ceil(fret/25000)+'&addGT='+APIkey;
                var linkPT=link+'&am202='+Math.ceil(fret/5000)+'&addGT='+APIkey;




                var newElement = document.createElement("span"); // On crée un nouvelle élément div
                newElement.innerHTML ='(<a href="'+linkPT+'">'+compactNumber(Math.ceil(fret/5000))+' '+PT+'</a>'+
                    ' | <a href="'+linkGT+'">GT</a>)';


                newElement.className ='addGT';
                newElement.id ='addGT'+APIkey;


                message[i].getElementsByClassName('ctn ctn4')[2].appendChild(newElement);


                message[i].getElementsByClassName('icon_nf_link fleft')[2].href+='&addGT='+APIkey;

                document.getElementById('addGT'+APIkey).addEventListener("click", function(event) 
                                                                         {


                    this.getElementsByTagName('a')[0].style.color="rgba(250,0,0,0.6)";
                    this.getElementsByTagName('a')[0].style.fontWeight="bold";
                    this.getElementsByTagName('a')[1].style.color="rgba(250,0,0,0.6)";
                    this.getElementsByTagName('a')[1].style.fontWeight="bold";

                    this.style.color="rgba(250,0,0,0.6)";
                    this.style.fontWeight="bold";


                }, true);


                var crkeyReg = new RegExp(APIkey, "g"); 

                if(message[i].getElementsByClassName('tooltipRight')[1])
                    var def = extractRess(message[i].getElementsByClassName('tooltipRight')[1]);
                else var def=1;

                if(crkeyReg.test(listeRC))
                {
                    // document.getElementById('addGT'+APIkey).style.background="rgba(250,0,0,0.3)";
                    message[i].getElementsByClassName('addGT')[0].getElementsByTagName('a')[0].style.color="rgba(250,0,0,0.6)";
                    message[i].getElementsByClassName('addGT')[0].getElementsByTagName('a')[0].style.fontWeight="bold";
                    message[i].getElementsByClassName('addGT')[0].getElementsByTagName('a')[1].style.color="rgba(250,0,0,0.6)";
                    message[i].getElementsByClassName('addGT')[0].getElementsByTagName('a')[1].style.fontWeight="bold";

                    message[i].getElementsByClassName('addGT')[0].style.color="rgba(250,0,0,0.6)";
                    message[i].getElementsByClassName('addGT')[0].style.fontWeight="bold";


                }else if( Math.ceil(fret/5000) >300 && def ==0)
                {
                    message[i].getElementsByClassName('addGT')[0].getElementsByTagName('a')[0].style.color="rgba(0,250,0,0.6)";
                    message[i].getElementsByClassName('addGT')[0].getElementsByTagName('a')[0].style.fontWeight="bold";

                }
                else if(Math.ceil(fret/5000) >200 && def ==0)
                {
                    message[i].getElementsByClassName('addGT')[0].getElementsByTagName('a')[0].style.color="rgba(250,250,0,0.6)";

                }


                if(m>90000000)
                    ress[0].style.color="#00ff00";
                else if(m>20000000)
                    ress[0].style.color="#ccaa33";

                if(c>100000000)
                    ress[1].style.color="#00ff00";
                else if(c>20000000)
                    ress[1].style.color="#ccaa33";

                if(d>100000000)
                    ress[2].style.color="#00ff00";
                else if(d>20000000)
                    ress[2].style.color="#ccaa33";



                if(message[i].getElementsByClassName('tooltipLeft')[0])
                {
                    var flotte = extractRess(message[i].getElementsByClassName('tooltipLeft')[0])*30/100;                    


                    if(flotte > 100000000)
                        message[i].getElementsByClassName('tooltipLeft')[0].style.color="#00ff00";
                    else if(flotte > 50000000)
                        message[i].getElementsByClassName('tooltipLeft')[0].style.color="#ccaa33";

                    if(message[i].getElementsByClassName('tooltipRight')[1].innerHTML != '')
                    {    



                        if(def==0) 
                        {   
                            message[i].getElementsByClassName('tooltipRight')[1].style.color="#00bb00";
                            def=1;
                        }
                        else if (def<1000000)
                            message[i].getElementsByClassName('tooltipRight')[1].style.color="#bb8800";
                        else message[i].getElementsByClassName('tooltipRight')[1].style.color="#bb0000";

                        if(flotte+fret>5000000)
                        {
                            var ratio = Math.min(20, (fret+flotte) / def);
                            ratio = Math.round(ratio*100)/10;



                            var newElement = document.createElement("center"); // On crée un nouvelle élément div
                            newElement.innerHTML ='   ->R = '+ratio;
                            newElement.style.display= "inline-block";
                            newElement.style.margin= "auto";
                            newElement.style.width= "20%";
                            newElement.style.color= (ratio>1 ? '#00ff00' : '#ff0000');
                            message[i].getElementsByClassName('tooltipLeft')[0].appendChild(newElement);
                        }

                        /* if(fret+flotte<1000000)
                {
                    message[i].getElementsByClassName('msg_content')[0].style.display = 'none';
                }
                */

                    }
                    else 
                    {
                        var newElement = document.createElement("center"); // On crée un nouvelle élément div
                        newElement.innerHTML ='NO DATA FOR DEFENCE !!!!!';
                        newElement.style.color= '#ff0000';

                        message[i].getElementsByClassName('msg_content')[0].appendChild(newElement);


                    }   
                }
                else 
                {
                    var newElement = document.createElement("center"); // On crée un nouvelle élément div
                    newElement.innerHTML ='NO DATA FOR FLEET AND DEF !!!!!';
                    newElement.style.color= '#ff0000';

                    message[i].getElementsByClassName('msg_content')[0].appendChild(newElement);


                }


                var coord = message[i].getElementsByClassName('msg_title blue_txt')[0].getElementsByTagName('a')[0].textContent.split('[')[1].replace(/\[|\]/g,'').replace(/:/g,',');

                var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
                newElement3.innerHTML ='<a title="Sonder" href="javascript:void(0);"><img onclick="sendShips(6,'+coord+',1,7);this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RThGRTYxQjk3OUI3MTFFNTg4RjlGODY4OEY2NkIwRTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RThGRTYxQkE3OUI3MTFFNTg4RjlGODY4OEY2NkIwRTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFOEZFNjFCNzc5QjcxMUU1ODhGOUY4Njg4RjY2QjBFOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFOEZFNjFCODc5QjcxMUU1ODhGOUY4Njg4RjY2QjBFOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsgD/7MAAAM/SURBVHjarFbNbhMxEB47TkPTEkLVHlCFOJT+CDhUCKHSE4eK16hA5cAb8AQVTwACVUK8QB8A9VAhBD1wACRQUeFE4QCFlrYo3U3Wg8f2eDebZMOflc3Yns8ej2f82QIRYez05ORApXJnQFUWSiVZM12hCAGFhbBZDLe11vtRHK2Z7/bOx60tMTo+MV0drG7UTo7Vq8dHQSoFqLUBCz8QbZ1lsdEUkyQtODr8Dj92v+z9bDTmlJBiefjESL1cGYJm3ACI4Y+LgBYgqI5+NVCFodpIvXH0aVlJgIVj1TpojMySaJBfXZiE62VTbzqdBwkP0l7HOPA4qg+auaX4fE0ZV2uJjgwQwf/sJzLGXDs2E/r+TAw7dKYu/GIExpBoYQyJYWX338TEKdq96ScLdbxo1DZ2KqSK+dgbWhJiseRhXXW8akyTR6E3j96Q20K/cYUSeuo0baSRwvtHu6ZoGSbng68msYGg2Ec6Mz0wIo0eHzIVFoYMNIat553y7sv1tvS9NXu1O1a7U0tzClmyuyVtMoDzygUuccmRk/dyRqhQXzespjBY6RKBiuQTjUHZKe+/etLzsJIuPwZ14hauMbCF5PRx3mg3QKfyweunsHR+Hm5emA+TU5sK9VGdMNkxzgB76eIp0ScDZj9vcOXNM1g6NxfaXKjfrs9jCUN9YSySQbRbx+dJOhJ0xjS2e3Nj5jKsvN1oa3OhOmMJk23bLMbUqE3xU2em0DA3tJpRetACATn58N0LuD59KdcPBbqUO1S5Avu7X82B5UBmtiZfFqcuwiMzYS8doM6xuT+qIfaegjjrBCs9NCsXz862tcGzCAU+j0VPsSJDfgoCBekMKyNgH5n976bjtj20loLYo4Kt+5siciyv+Jq2hgRkAv0PxW8/JZZjHKRk4KD5hBf4n/zRfiqXieaawH1jtZa9NvklUyT5hdQdg/6KN19CZI2H0vDTGr1Y3H3kPfsN2Q/DPKct7+FjMTI+MVNRpeclVa7rJAlsy3kjAKD9ycJPr7SfkzubjVJKQzsl8+xq7sWt1hX5bfv9ZtRK5qI4XtWYHKS0gWnsfPoHY+Eq1/76g4xH/mWkk4OoGa/S3DvbHzZ/CTAA8TsfHei+E/IAAAAASUVORK5CYII=\';return false;" id="imgSonde" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzMxRTYzN0Y3OTcwMTFFNUE3MjBEOTU0MDY5MDM1NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzMxRTYzODA3OTcwMTFFNUE3MjBEOTU0MDY5MDM1NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMzFFNjM3RDc5NzAxMUU1QTcyMEQ5NTQwNjkwMzU1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMzFFNjM3RTc5NzAxMUU1QTcyMEQ5NTQwNjkwMzU1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrpMQEkAAAMuSURBVHjarFbdTlQxEJ72FBZWXNeNXBhiTEAEI0aJIUK4MiE+k09AfBoewJAYYwwmSKIRFQJ6I3qhGBAwy57d07E/Mz3dv4N/zZ6dtvO10+lMv1YgIoxemZwcLJUeDarSUpLIiukKRQgoLBYbY7ittT5qpI1V8z3c/7SzIy6NTUyVh8svKhdHq+XzNZBKAWptwIIGoquzLDaaY7KsBacnh/Dj4Ovhz3p9Xgkplkcu1KoDpWFopnWAFP64CNCAILv61eAQnKvUqvXTz8vKqJeGyhXQ2DRLsoNodWESriemnnkdgQSBNOkYB4Sz9WEztxRfHijjaiXTTQNEoJ/7RGTMt1tmQuqPYtilM3VBixHYgkwLY0iMKLf/JiZe0e7NWbJQx4tG7WKnQqqYj72xS0Isljysp45XjXnyKCTzSIb8FtLGFUroq9N2I40U5J/dNWWXYXI++GoSm7KoWHozfTAijx4fMhUWhgw0hp3n3fLN+pO29J2Zu98bq/2ptXMKmbjdki4ZwHvlA5f55OiQmx1GbLF9vbDahsFJnwi2SD7RGJTd8t3Lp30Pq9V1jkGd+YVrDGwhOX28N9oP0Ll8v/EMpu4swvTsYpjctm2xfbZuMfEYb4C99PGUSMmA8UcGt189h6nbC6HNxfa79RHWYmxfGIvWILqt4/MkPQl6YxrbvZm8dQ+2X6+1tbnYOmMtJm67LMbcqEvxy1evo2FuaDUb+UELBOTl7uY6XJuZ6+iHAl3OHWqgBEcH38yB5UBGW9NZxm/ehY9vN/rqutmcjmqIPVEQZ51gJUFjOX5jtq0NxCK9sEgUKyLyUxAoSEesjIBnyPi/l47b7tA6CmKPCrbub4roYHnF17QzJCAK9D8U2n6bWJ5x0CYDB40SXuB/8kfTVD4TzTWBR8ZqJb42+SVTJPmF1BuDdMWbL7NkjSfS8NOqfbH4+4g8+w15FoZ5Tjvew8eiNjYxXVLJWqIGqjrLAtty3ggAaH+y8NMr7+fkjrNRSmloJzHPruZh2motyO97u1uNVjbfSNMVjdlxThuYx47SPxgLV7mm6w8ij+hlpLPjRjNdsXPv733Y+iXAANc0GruC56fxAAAAAElFTkSuQmCC" />';

                if(!message[i].getElementsByClassName('icon_espionage')[0])
                message[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);


                message[i].getElementsByClassName('msg_sender')[0].innerHTML=message[i].getElementsByClassName('compacting')[0].innerHTML.split(':</span>')[1];

                if(document.getElementsByName('ogame-version')[0].content == '6.0.7')
                    message[i].getElementsByClassName('msg_sender')[0].getElementsByTagName('a')[0].style.display='none';




                if(!message[i].getElementsByClassName('topraderespi')[0])
                {   
                    var tech = Vu_getValue('techno'+document.getElementsByName('ogame-universe')[0].content.split('.')[0]+document.getElementsByName('ogame-player-id')[0].content, "0|0|0").split('|');


                    var api = /(sr-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(message[i].getElementsByClassName('icon_apikey ')[0].title)[0];

                    var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
                    newElement3.innerHTML ='<a title="SpeedSim" target="_blank" href="http://topraider.eu/index.php?SR_KEY='+api+'&combu='+tech[0]+'&impu='+tech[1]+'&prop='+tech[2]+'&arme='+tech[3]+'&bouclier='+tech[4]+'&protect='+tech[5]+'&speed='+document.getElementsByName('ogame-universe-speed-fleet')[0].content+'"><img class="speedSimTR" src="http://topraider.eu/images/simu.png" />';
                    message[i].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);
                }



            }




        }





    }
    else if(document.getElementsByClassName('resource_list_el tooltipCustom')[0] && ! document.getElementById('speedsimOK'))
    { // RE DETAILLé
        document.getElementsByClassName('resource_list_el tooltipCustom')[0].getElementsByClassName('res_value')[0].innerHTML = '<span id="speedsimOK" style="font-size:0.5em;">Métal:</span>'+addPoints(extractRess(document.getElementsByClassName('resource_list_el tooltipCustom')[0].getElementsByClassName('res_value')[0]));
        document.getElementsByClassName('resource_list_el tooltipCustom')[1].getElementsByClassName('res_value')[0].innerHTML = '<span style="font-size:0.5em;">Cristal:</span>'+addPoints(extractRess(document.getElementsByClassName('resource_list_el tooltipCustom')[1].getElementsByClassName('res_value')[0]));
        document.getElementsByClassName('resource_list_el tooltipCustom')[2].getElementsByClassName('res_value')[0].innerHTML = '<span style="font-size:0.5em;">Deutérium:</span>'+addPoints(extractRess(document.getElementsByClassName('resource_list_el tooltipCustom')[2].getElementsByClassName('res_value')[0]));

        var img=document.getElementsByTagName('img');
        for(var j=0 ; j<img.length ; j++)
            img[j].alt="\n";


        var tech = Vu_getValue('techno'+document.getElementsByName('ogame-universe')[0].content.split('.')[0]+document.getElementsByName('ogame-player-id')[0].content, "0|0|0").split('|');
        var api = /(sr-[a-z]{2}-[0-9]+-[0-9a-z]+)/.exec(document.getElementsByClassName('detail_msg')[0].getElementsByClassName('icon_apikey')[0].title)[1]

        var newElement3 = document.createElement("span"); // On crée un nouvelle élément div
        newElement3.innerHTML ='<a title="SpeedSim" target="_blank" href="http://topraider.eu/index.php?SR_KEY='+api+'&combu='+tech[0]+'&impu='+tech[1]+'&prop='+tech[2]+'&arme='+tech[3]+'&bouclier='+tech[4]+'&protect='+tech[5]+'&speed='+document.getElementsByName('ogame-universe-speed-fleet')[0].content+'"><img src="http://topraider.eu/images/simu.png" />';
        document.getElementsByClassName('detail_msg')[0].getElementsByClassName('msg_actions clearfix')[0].appendChild(newElement3);





    }
    if (false &  !document.getElementsByClassName('improveRC')[0] && document.getElementsByClassName("msg_ctn msg_ctn3 tooltipLeft")[0])
    { // PAGE RC



        var message = document.getElementsByClassName('msg');
        for(var i=0 ; i<message.length ; i++)
        {
            var loots = message[i].getElementsByClassName('combatLeftSide')[0].getElementsByClassName("msg_ctn msg_ctn3 tooltipLeft")[0];
            loots.innerHTML += loots.title;
            loots.className += ' improveRC';

        }
    }
}


// DEBUT SCRIPT

var version = document.getElementsByName('ogame-version')[0].content;

if(/page=message/.test(location.href))
{
    var idPlayer =document.getElementsByName('ogame-player-id')[0].content;
    var serveur  = document.getElementsByName('ogame-universe')[0].content;

    var PT = 'SC';
    var GT = 'LC';

    if(document.getElementsByName('ogame-language')[0].content == 'fr')
    {
        PT = 'PT';
        GT = 'GT';       
    }

    setInterval(addGT,500);
}
else if(/page=fleet1/.test(location.href) && /addGT=/.test(location.href) )
{

    var idPlayer =document.getElementsByName('ogame-player-id')[0].content;
    var serveur  = document.getElementsByName('ogame-universe')[0].content;


    var listeRC=Vu_getValue('listeRc'+serveur+idPlayer, '1||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||').split('|');
    listeRC[parseInt(listeRC[0])+1]=location.href.split(/addGT=/g)[1];
    listeRC[0]=(parseInt(listeRC[0])+1)%250;

    Vu_setValue('listeRc'+serveur+idPlayer, listeRC.join('|'));  

}
else if(/page=research/.test(location.href))
{

    var niveaux = document.getElementsByClassName('level') ;
    var niveau ='';
    var listNiveau='';

    for (var f=5; f<16 ; f++)
    {
        if(typeof(niveaux[f].getElementsByClassName('textlabel')[0])=="undefined") 
        {   

            niveau = niveaux[f].innerHTML.split('span')[0].replace( /[^0-9-]/g, ""); 

        }
        else 
        {

            niveau = niveaux[f].textContent;

            var span = niveaux[f].getElementsByTagName('span');

            for(var k=0; k< span.length ; k++)
            {   niveau = trim(niveau.replace( span[k].textContent, ""));}
        }

        //alert( parseInt(niveau) +'  '+f);
        listNiveau+=niveau+'|';

        if(f==7)
            f=12;

    }


    Vu_setValue('techno'+document.getElementsByName('ogame-universe')[0].content.split('.')[0]+document.getElementsByName('ogame-player-id')[0].content, listNiveau);


}


