// ==UserScript==
// @name         erweiterung (benachrichtigungen für das  gesehende videos ausblenden oder makieren
// @namespace    https://basti1012.bplaced.net
// @version      1.3
// @description  zeigt an wie viele nachrichten gelesen und ungelesen sind mit farbauswahl
// @author       basti1012
// @allFrames           true
// @run-at document-end
// @license MIT License
// @noframes
// @icon        https://basti1012.de/images/favicon.png
// ==/UserScript==

if(!console_log_value){
var console_log_value = [];
}
var start1 = performance.now();
if(!array_localsdtorage){
    var array_localsdtorage=[];
}
if(!erweiterungs_einstellungs_array){
var erweiterungs_einstellungs_array=[];
}
var console_benachrichtigung='________';
var console_benachrichtigung_per='________';

array_localsdtorage.push(["srollen_hoehe_in_px_benachrichtungen", 50000],["reloaden_nach_millisekunden_benachrichtungen", 60000],["nicht_gesehene_benachtichtigung_color","#ff0000"],["gesehene_benachtichtigung_color","##00ff00"],["erweiterung_benachrichtigung_aktivieren",false],["sound_benachrichtungen",true],["sound_link_benachrichtungen",""]);

function benachrichtigungen_auslesen(){
    var var_menge_all_post;
    var var_menge_unread_post;
    if(localStorage.getItem('erweiterung_benachrichtigung_aktivieren')=='true'){
        
        
                            const styleTag12 = document.createElement('style');
            styleTag12.innerHTML = `
         div#items .style-scope.yt-multi-page-menu-section-renderer {

                background:${localStorage.getItem('gesehene_benachtichtigung_color')};

            }
         div#items .style-scope.yt-multi-page-menu-section-renderer.unread {

                background:${localStorage.getItem('nicht_gesehene_benachtichtigung_color')};

            }`;
            document.head.appendChild(styleTag12);
        
        
        
        
        /*
        function isValidURL(string){
            var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            return (res !== null)
        }
        if(localStorage.getItem('sound_benachrichtungen')=='true'){
            var checkurl = localStorage.getItem('sound_link_benachrichtungen');
            var be_sound = document.createElement("audio");
            if(localStorage.getItem('sound_link_benachrichtungen')=='' || checkurl.length<=11 || isValidURL(checkurl)!=true){
                 be_sound.src = "https://basti1012.bplaced.net/media/1.mp3";
                 be_sound.type = "audio/ogg";
                 be_sound.autoplay = "true";
            }else{
                be_sound.src=checkurl;
            }
        }
        var bo = document.getElementsByTagName("body")[0];
        bo.appendChild(be_sound);
        var gg=0;
        var benachrichtigung_interval=setInterval(function(){
            gg++;
            if(document.querySelector('#buttons > .style-scope ~ .style-scope .undefined')){// && document.querySelector('ytd-notification-topbar-button-renderer')){
                //console.log('%cGlocke gefunden','color:green');
				console_benachrichtigung='Glocke gefunden :';
                console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
                console_log_value.push({
                    name: console_benachrichtigung,
                    wert: console_benachrichtigung_per
                });
                if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                    console.table(console_log_value);
                }
                clearInterval(benachrichtigung_interval);
                var startinterval;
                var erstclick=false;
                var new_message_helper;
                function benachrichtigungs_unction_interval(){
                    if(erstclick==false){
                        if(document.querySelector('#buttons > .style-scope ~ .style-scope .undefined')){
                            document.querySelector('#buttons > .style-scope ~ .style-scope .undefined').click();
                            document.querySelector('#contentWrapper').style.display='none';
                        // setTimeout(function(){
                            document.querySelector('#contentWrapper #container').scrollBy(0,localStorage.getItem('srollen_hoehe_in_px_benachrichtungen'));

                            document.querySelector('#contentWrapper').style.display='block';
                            document.querySelector('#buttons > .style-scope ~ .style-scope .undefined').click();
                        // },444);
                            clearInterval(startinterval);
                            erstclick=true;
                        }else{
                            return true;
                        }
                   }

                   var nn=document.querySelector('ytd-notification-topbar-button-renderer');
                   nn.click();

                   document.querySelector('#contentWrapper').style.display='none';
                   document.querySelector('#contentWrapper #container').scrollBy(0,localStorage.getItem('srollen_hoehe_in_px_benachrichtungen'));

                   var_menge_all_post=document.querySelectorAll('#contentWrapper #container #sections #items ytd-notification-renderer').length;
                   //  console.log('%cGlocke insgesamt '+var_menge_all_post+' erhalten','color:orange');
				   console_benachrichtigung='Glocke insgesamt '+var_menge_all_post+' erhalten';
                   console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
                   console_log_value.push({
                       name: console_benachrichtigung,
                       wert: console_benachrichtigung_per
                  });
                  if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                      console.table(console_log_value);
                  }
                   document.querySelectorAll('#contentWrapper #container #sections #items ytd-notification-renderer:not(.unread)').forEach(function(ba){
                       ba.style.background='rgba(255,0,0,0.5)';
                   });

                   var_menge_unread_post=document.querySelectorAll('#contentWrapper #container #sections #items .unread').length;
                  // console.log('%cGlocke nachrichten, ungelesene Nachrichten '+var_menge_unread_post+' / '+var_menge_all_post,'color:green');
				   console_benachrichtigung='Glocke nachrichten, ungelesene Nachrichten '+var_menge_unread_post+' / '+var_menge_all_post+'';
                   console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
                   console_log_value.push({
                       name: console_benachrichtigung,
                       wert: console_benachrichtigung_per
                   });
                   if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                       console.table(console_log_value);
                   }
                   document.querySelectorAll('#contentWrapper #container #sections #items .unread').forEach(function(ba1){
                       ba1.style.background='rgba(0,255,0,0.5)';
                   });

                   //console.log('%cGlocke nachrichten '+var_menge_unread_post,'color:green');
				   console_benachrichtigung='Glocke nachrichten '+var_menge_unread_post+'';
                   console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
                   console_log_value.push({
                       name: console_benachrichtigung,
                       wert: console_benachrichtigung_per
                   });
                   if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                       console.table(console_log_value);
                   }
                   var tooltip_var=document.querySelector('ytd-notification-topbar-button-renderer #tooltip');
                   tooltip_var.innerHTML=`Sie haben noch ${var_menge_unread_post} ungelesene Benachrichtigungen  <br> von insgesamt ${var_menge_all_post}`;
                   document.querySelector('#buttons > .style-scope ~ .style-scope .undefined').innerHTML=`<div title="Sie haben noch ${var_menge_unread_post} ungelesene Benachrichtigungen von insgesamt ${var_menge_all_post}" style="width:16px;background:green;position: absolute;top: -8px;left:8px;padding: 2px;border: 1px solid white;border-radius: 50%;text-align: center;font-size: 9px;font-weight: 200;line-height: 16px;" class="yt-spec-icon-badge-shape__badge">${var_menge_unread_post}/${var_menge_all_post}</div>
                   <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z"></path></svg>`;
                   document.querySelector('#contentWrapper').style.display='block';

                   nn.click();
                   //console.log(new_message_helper+'  =  '+var_menge_unread_post);
				   console_benachrichtigung=''+new_message_helper+'  =  '+var_menge_unread_post+'';
                   console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
                   console_log_value.push({
                       name: console_benachrichtigung,
                       wert: console_benachrichtigung_per
                   });
                   if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                       console.table(console_log_value);
                   }
                   if(new_message_helper!=var_menge_unread_post){
                       nn.style.background='red';
                       nn.style.borderRadius='50%';
                       if(localStorage.getItem('sound_benachrichtungen')=='true'){
                           be_sound.play();
                       }
                       setTimeout(function(){
                           nn.style.background='none';
                       },1000);
                   }
                   new_message_helper=var_menge_unread_post;
                   var benachrichtigungs_timer_counter=localStorage.getItem('reloaden_nach_millisekunden_benachrichtungen');
                   var sekunden_ablauf=benachrichtigungs_timer_counter/1000;
                   var nachrichten_tooltip_info_timer=setInterval(function(){
                       sekunden_ablauf--;
                       tooltip_var.innerHTML=`Sie haben noch ${var_menge_unread_post} ungelesene Benachrichtigungen  <br>
                       von insgesamt ${var_menge_all_post}<br>
                       Nachrichten werden alle ${benachrichtigungs_timer_counter/1000} Sekunden aktualiesiert<br>
                       Nächte aktualisierung in ${sekunden_ablauf} Sekunden`;
                       if(sekunden_ablauf<=0){
                           clearInterval(nachrichten_tooltip_info_timer);
                           benachrichtigungs_unction_interval();
                       }
                   },1000);
               }
               startinterval=setInterval(function(){
                   benachrichtigungs_unction_interval();
               },1000);
           }else{
                //console.log('%cGlocke durch scriptnoch noch nicht gefunden nach '+gg+' versuchen','color:rgba(188,1,1,0.5)');
			   	console_benachrichtigung='Glocke durch scriptnoch noch nicht gefunden nach '+gg+' versuchen';
                console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
                console_log_value.push({
                    name: console_benachrichtigung,
                    wert: console_benachrichtigung_per
                });
                if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                    console.table(console_log_value);
                }
           }
           if(gg>=10){
                clearInterval(benachrichtigung_interval);
                //console.log('%cGlocke durch script nach '+gg+' versuchen nicht gefunden, versuche werden abgebrochen durch timeout','color:red');
			   	console_benachrichtigung='Glocke durch script nach '+gg+' versuchen nicht gefunden, versuche werden abgebrochen durch timeout';
                console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
                console_log_value.push({
                    name: console_benachrichtigung,
                    wert: console_benachrichtigung_per
                });
                if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                    console.table(console_log_value);
                }
                gg=0;
           }
       },4000);
       */
       return 1;
	}else{
		return 2;
	}
	return 3;
}
var checkboxerweiterungsoundaktiv;
var checkboxerweiterungaktiv;
if(localStorage.getItem('sound_benachrichtungen')=='true'){
    checkboxerweiterungsoundaktiv ='checked="true"';
}else{
    checkboxerweiterungsoundaktiv ='';
}
if(localStorage.getItem('erweiterung_benachrichtigung_aktivieren')=='true'){
    checkboxerweiterungaktiv ='checked="true"';
}else{
    checkboxerweiterungaktiv ='';
}
if(!erweiterungs_einstellungs_array){
    erweiterungs_einstellungs_array = [];
}
erweiterungs_einstellungs_array.push(['benachrichtigungen_auslesen',`
<label>
    <label style="display:flex;flex-direction:column">
        <p>
            <strong>Benachrichtigungs tool</strong>
            <input type="checkbox" id="erweiterungbenachrichtigungaktivieren" ${checkboxerweiterungaktiv}>
            <span>?
                <small>
                    Mit dieser funktion werden die benachrichtigen auch mehr als 0 angezeigt.Mit farbauswahl für nicht gelesene und gelesene benachrichtigungen uvm.
                </small>
            </span>
        </p>
    </label>
    <label style="display:flex;flex-direction:column">
	<p>Farbe gesehende Benachrichtigung:
	    <input type="color" value="${localStorage.getItem('gesehene_benachtichtigung_color')}" id="gesehenebenachtichtigungcolor">
		</p>
	</label>
     <label style="display:flex;flex-direction:column"><p>
	 Farbe nicht gesehene Benachrichtigung:
	    <input type="color" value="${localStorage.getItem('nicht_gesehene_benachtichtigung_color')}" id="nichtgesehenebenachtichtigungcolor"></p>
	</label>
     <label style="display:flex;flex-direction:column"><p>
	 Scrolhöhe in der Benachrichtigungen:
        <input type="number" value="${localStorage.getItem('srollen_hoehe_in_px_benachrichtungen')}" id="srollenhoeheinpxbenachrichtungen"></p>
	</label>
    <label style="display:flex;flex-direction:column"><p>
	Reloadzeit des benachrichtigungseingang:
       <input type="number" value="${localStorage.getItem('reloaden_nach_millisekunden_benachrichtungen')}" id="reloadennaxhnachmillisekundenbenachrichtungen"></p>
   </label>
   <label style="display:flex;flex-direction:column"><p>
       Sound bei neue Benachrichtigung:
       <input type="checkbox" id="soundbenachrichtungen" ${checkboxerweiterungsoundaktiv}></p>
   </label>

   <label style="display:flex;flex-direction:column"><p>
   Sound auswahl mit Link
       <input type="text" value="${localStorage.getItem('sound_link_benachrichtungen')}" id="soundlinkbenachrichtungen"></p>
   </label>

   <small>Wenn das Feld bei Soundauswahl Link leer bleibt wird ein Standartton abgespielt,<br>
       Wenn Sie einen Link zur Sounddatei eingeben wird doeser dann abfespielt
   </small>
</label>     <hr style="height:3px;background:black">`]);

if(!array_script){
	var array_script=[];
}
array_script.push([`
var benachrichtigungs_set_localstorage=["erweiterung_benachrichtigung_aktivieren",
"gesehene_benachtichtigung_color",
"nicht_gesehene_benachtichtigung_color",
"srollen_hoehe_in_px_benachrichtungen",
"reloaden_nach_millisekunden_benachrichtungen",
"sound_benachrichtungen",
"sound_link_benachrichtungen"];

var benachrichtigung_ids=["erweiterungbenachrichtigungaktivieren",
"gesehenebenachtichtigungcolor",
"nichtgesehenebenachtichtigungcolor",
"srollenhoeheinpxbenachrichtungen",
"reloadennaxhnachmillisekundenbenachrichtungen",
"soundbenachrichtungen",
"soundlinkbenachrichtungen"];

//console.log(benachrichtigung_ids,benachrichtigung_ids.length);
//console.log(benachrichtigungs_set_localstorage,benachrichtigungs_set_localstorage.length)
for(let benachrichtigungsplus=0;benachrichtigungsplus<=benachrichtigung_ids.length-1;benachrichtigungsplus++){

//console.log(benachrichtigungsplus,benachrichtigung_ids[benachrichtigungsplus]);
    var was_be_einstellung_var=document.getElementById(benachrichtigung_ids[benachrichtigungsplus]);
//    console.log(was_be_einstellung_var);
    was_be_einstellung_var.addEventListener('click',function(j,index){
//console.log(benachrichtigungs_set_localstorage,benachrichtigungsplus,j,index)
    if(j.target.type=='checkbox'){
	    if(j.target.checked==true){
		    localStorage.setItem(benachrichtigungs_set_localstorage[benachrichtigungsplus],true);
	    }else{
		    localStorage.setItem(benachrichtigungs_set_localstorage[benachrichtigungsplus],false);
	    }
     //   console.log(j.target.checked+' save')
    }else{
	    localStorage.setItem(benachrichtigungs_set_localstorage[benachrichtigungsplus],j.target.value);
     //   console.log(j.target.value+' save')
    }
    })
}
`]);
if(localStorage.getItem('erweiterung_benachrichtigung_aktivieren')){
	    console_benachrichtigung='________';
        console_benachrichtigung_per='________';
    var be_func=benachrichtigungen_auslesen();
    if(be_func==1){
        //console.log('%cBenachrichtigungen  aktiv: ' + (performance.now() - start1) + ' ms.','color:green');
		 console_benachrichtigung='Benachrichtigungen  aktiv:';
         console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
    }else if(be_func==2){
        //console.log('%cbenachrichtigungen deaktiviert: '+ (performance.now() - start1) + ' ms.','color:red');
		 console_benachrichtigung='benachrichtigungen deaktiviert:';
         console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
    }else if(be_func==3){
        //console.log('%cbenachrichtigungen functin error : '+ (performance.now() - start1) + ' ms.','color:red');
		 console_benachrichtigung='benachrichtigungen functin error :';
         console_benachrichtigung_per=''+(performance.now() - start1) + ' ms.';
    }
}
        console_log_value.push({
            name: console_benachrichtigung,
            wert: console_benachrichtigung_per
        });
