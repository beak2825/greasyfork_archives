// ==UserScript==
// @name         Erweiterung (Zusatzinfos) für das gesehene Videos ausblenden oder markieren
// @namespace    https://basti1012.bplaced.net
// @version      2.2
// @description  zeigt den transfer an und die downloadmenge der aktuellen sessin und den doownload seid
// installatiion des scriptes
// Man kann sich auch die Mausdiztanz der aktuellen session und die komplette edntfernung
// der maus seid installation des scriptes
// @author       basti1012
// @allFrames    true
// @run-at document-end
// @license MIT License
// @include       https://youtube.com*
// @exclude           *://myactivity.google.com/*
// @exclude      *music.youtube.com/*
// @noframes
// @icon        https://basti1012.de/images/favicon.png
// ==/UserScript==

if(!console_log_value){
    var console_log_value = [];
}
var start = performance.now();

if(!array_localsdtorage){
    var array_localsdtorage=[];
}
if(!erweiterungs_einstellungs_array){
    var erweiterungs_einstellungs_array=[];
}



array_localsdtorage.push(["zusatzinfos_einblenden",true],
                         ["transfer_gesamt1",0],
                         ["transfer_style",""],
    					 ["transfer_speicher_rytmus","s"],
						 ["transfer_speicher_rytmus_helfer1",0],
						 ["transfer_speicher_interval_helfer",0],
						 ["transfer_speicher_interval_array", JSON.stringify([])],
                         ["transfer_style_image_meter",""],
                         ["transfer_style_image_down",""],
                         ["selector_zusatzinformationen","title"],
                         ["mouse_oder_datentransfer", true],
                         ["mouse_distans_session", 0],
                         ["mouse_distans_immer", 0]);

function zusatzinfos_einblenden_anzeigen(){
    if(localStorage.getItem('zusatzinfos_einblenden')=='true'){
        const set_timeout_var=500;
        if(localStorage.getItem('mouse_oder_datentransfer')=='true'){
            var mause_ele;
	        if(localStorage.getItem('transfer_style')==''){
                if(!localStorage.getItem('selector_zusatzinformationen') ||
		        localStorage.getItem('selector_zusatzinformationen')==''){
		    	    mause_ele=document.querySelector('title')
                }else{
		    	    mause_ele=document.querySelector(localStorage.getItem('selector_zusatzinformationen'))
                }
		    }else{
		        if(localStorage.getItem('selector_zusatzinformationen')!='' &&
		    	localStorage.getItem('selector_zusatzinformationen')!='title'){
                    mause_ele=document.querySelector(localStorage.getItem('selector_zusatzinformationen'))
                    mause_ele.style=localStorage.getItem('transfer_style');
		        }else{
		    	    mause_ele=document.createElement('div');
                    mause_ele.id='traffic_anzeige';
                    mause_ele.style=localStorage.getItem('transfer_style');
		    	}
            }
            var totalDistance = 0;
            var lastSeenAt = {
                x: null,
                y: null
            };
            var var_immer=parseInt(localStorage.getItem('mouse_distans_immer'));
            var var_session=parseInt(localStorage.getItem('mouse_distans_session'));
            document.addEventListener('mousemove',function(event) {
                if(lastSeenAt.x){
                    totalDistance += Math.sqrt(Math.pow(lastSeenAt.y - event.clientY, 2) + Math.pow(lastSeenAt.x - event.clientX, 2));
                    mause_ele.innerHTML=`
                    Pixels:   ${Math.round(totalDistance)} <br>
                    Zentimeter : ${((totalDistance / 75) / 10).toFixed(0)} <br>
                    Meter : ${(((totalDistance) / 75) / 1000).toFixed(2)}<br>
                    Seid Beginn Pixel : ${((var_immer+totalDistance).toFixed(0))} px <br>
                    Seid Beginn Zentimeter : ${((((var_immer+totalDistance)) / 75) / 1).toFixed(0)} <br>
                    Seid beginn Meter : ${(((var_immer+totalDistance) / 75) / 100).toFixed(2)} <br>`;

                    if(ww=='title'){
                       mause_ele.innerHTML=`
                        Pixel: ${Math.round(totalDistance)},
                        Zentimeter : ${((totalDistance / 75) / 10).toFixed(0)} ,
                        Meter : ${(((totalDistance) / 75) / 1000).toFixed(2)},
                        Gesamt Pixel : ${((var_immer+totalDistance).toFixed(0))} ,
                        Gesamt Zentimeter : ${((((var_immer+totalDistance)) / 75) / 1).toFixed(0)},
                        Gesamt Meter : ${(((var_immer+totalDistance) / 75) / 100).toFixed(2)} `;
                    }
                }
                localStorage.setItem('mouse_distans_immer',(var_immer+totalDistance));
                localStorage.setItem('mouse_distans_session',(var_session+totalDistance));
                lastSeenAt.x = event.clientX;
                lastSeenAt.y = event.clientY;
            });
            localStorage.setItem('mouse_distans_immer',(var_immer+totalDistance));
            localStorage.setItem('mouse_distans_session',(var_session+totalDistance));
            return 5;
        }else{
		    const transfer_array=JSON.parse(localStorage.getItem("transfer_speicher_interval_array"));
            var trafficDiv='';
            var meter_image;
            var download_image;
            var ww;
            var down_image_base64;
            var meter_image_base64;
            try{
                ww=localStorage.getItem('selector_zusatzinformationen').trim();
                const set_timeout_var=10000;
            }catch(e){
                ww='title';//localStorage.getItem('selector_zusatzinformationen').trim();
                const set_timeout_var=500;
            }

            if(localStorage.getItem('transfer_style_image_down')==''){
               down_image_base64=`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCA0ODYgNTEyLjAzOSI+PHBhdGggZmlsbD0iIzEwQTQ0RSIgZD0iTTMxNC40NTUgMjczLjU4bDE5LjgwOS0yNTYuNTE0QzMzNC45ODYgNy43MTggMzI2LjU3NSAwIDMxNy4yMDIgMEgxNjguNzk4Yy05LjM3MyAwLTE3Ljc4NCA3LjcwNS0xNy4wNjIgMTcuMDY2bDE5LjgwOSAyNTYuNTE0aC0uMzY5TDcwLjIwOSAyMzguMjZjLTUxLjIxNS0xOS43ODEtOTEuODggMTIuMTg5LTU3LjQ0NCA0OS41OTFsMTkxLjY1MyAxOTkuOTk3YzMyLjI1NyAzMi4yNTQgNDUuNzYyIDMyLjI1NCA3OC4wMTYgMGwxOTEuNjUyLTE5OS45OTdjMzIuNDM0LTM2LjI3Ni02LjIyOC02OS4zNzItNTcuNDQxLTQ5LjU5MWwtMTAwLjk2OSAzNS4zMmgtMS4yMjF6Ii8+PC9zdmc+`;
            }else{
               down_image_base64=localStorage.getItem('transfer_style_image_down');
            }
            if(localStorage.getItem('transfer_style_image_meter')==''){
               meter_image_base64='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCA1MTIgMjc4Ljg2MiI+PHBhdGggZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMCAyNTUuOTk5QzAgMTg1LjMxMSAyOC42NTUgMTIxLjMxIDc0Ljk4MiA3NC45ODIgMTIxLjMxMSAyOC42NTUgMTg1LjMxMSAwIDI1Ni4wMDEgMGM1NS40NTUgMCAxMDYuNzk0IDE3LjYzOCAxNDguNzE0IDQ3LjYwN2wtMjYuNjgyIDIyLjAxN2MtMjkuNzU3LTE5LjUyMS02NC40Ny0zMi4xMDktMTAxLjg0NS0zNS40Njh2MjkuMDY3aC00MC4zNzdWMzQuMTU2Yy00NS4yMjUgNC4wNjMtODYuNTU0IDIxLjY0My0xMTkuOTE2IDQ4LjY2NWwyNC43OTMgMjQuNzk0LTI4LjU0OSAyOC41NDktMjUuMjAyLTI1LjIwMmMtMzMuNDYyIDM4Ljk2OS01My42ODUgODkuNjQxLTUzLjY4NSAxNDUuMDM3SDB6TTQ1MC40OTcgODkuNTQ3QzQ4OC44MzcgMTM0LjMwNCA1MTIgMTkyLjQ0OCA1MTIgMjU1Ljk5OWgtMzMuMjUyYzAtNTMuMDI5LTE4LjUzMS0xMDEuNzMtNDkuNDY3LTEzOS45NzlsMjEuMjE2LTI2LjQ3M3oiLz48cGF0aCBmaWxsPSIjRUYxQzI1IiBkPSJNMjMzLjMyMyAyMjAuODZjLTM4LjkwNCAzMi4xNDMgMTMuMTMxIDg2LjI0NSA0OC4yMzggNDAuMTg4TDQ0MC4xNzkgNjMuMTIzbC03LjQyNy02LjgyNkwyMzMuMzIzIDIyMC44NnoiLz48L3N2Zz4=';
            }else{
               meter_image_base64=localStorage.getItem('transfer_style_image_meter');
            }
            function starte(){
                try{
                    if(ww!='title'){
                        var zusa_style=document.createElement('style');
                        zusa_style.id='BASTI1012_ERWEITERUNG_ZUSATZINFOS';
                        zusa_style.innerHTML=`
                        #traffic_anzeige img{
                            height:11px !important;
                        }
                        .bi::before, [class="bi"]::before, [class="b"]::before {
                             display: inline-block;
                             font-display: block;
                             font-family: bootstrap-icons !important;
                             font-style: normal;
                             font-weight: normal !important;
                             font-variant: normal;
                             text-transform: none;
                             line-height: 1;
                             vertical-align: -0.125em;
                             -webkit-font-smoothing: antialiased;
                             -moz-osx-font-smoothing: grayscale;
                        }`;
                        document.getElementsByTagName('head')[0].appendChild(zusa_style);
                    }
                    if(ww=='title'){
                        trafficDiv = document.querySelector('title');
                        meter_image=`🕐`;
                        download_image=`⬇`;
                    }else if(ww!='' && ww!='title'){
                        if(localStorage.getItem('transfer_style')==''){
                            GM_addStyle(`@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css");`);
                            trafficDiv = document.querySelector(ww);
                            trafficDiv.style=`height:auto !important;pointer-events:none;position:fixed;z-index:999999;left:0;top:0;size:15px;background:rgba(0, 0, 0, 0.7);color:white;padding:5px;`;
                            meter_image=`<i class='bi'><img src="${meter_image_base64}"></i>`;
                            download_image=`<i class='bi'><img src="${down_image_base64}"></i>`;
                        }else{
                            trafficDiv = document.createElement('div');
                            trafficDiv.id='traffic_anzeige';
                            trafficDiv.style=localStorage.getItem('transfer_style');
                            meter_image=`<i class='bi'><img src="${meter_image_base64}"></i>`;
                            download_image=`<i class='bi'><img src="${down_image_base64}"></i>`;
                        }
                    }else if(ww==''){
                        if(localStorage.getItem('transfer_style')==''){
                            trafficDiv = document.createElement('div');
                            trafficDiv.id='traffic_anzeige';
                            GM_addStyle(`@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css");`);
                            trafficDiv.style=`height:auto !important;pointer-events:none;position:fixed;z-index:999999;left:0;top:0;size:15px;background:rgba(0, 0, 0, 1);color:white;padding:5px;`;
                            meter_image=`<i class='bi'><img src="${meter_image_base64}"></i>`;
                            download_image=`<i class='bi'><img src="${down_image_base64}"></i>`;
                        }else{
                            trafficDiv = document.createElement('div');
                            trafficDiv.id='traffic_anzeige';
                            trafficDiv.style=localStorage.getItem('transfer_style');
                            meter_image=`<img src="${meter_image_base64}">`;
                            download_image=`<img src="${down_image_base64}">`;
                        }
                    }
                    if(ww!='' && ww!='title' || ww!='title' && ww==''){
                        trafficDiv.innerHTML = `${download_image} <span id='traffic_helper1'></span> •
                        ${meter_image} <span id='traffic_helper2'></span> •
                        ${download_image}
                        ${download_image}<span id='traffic_helper3'></span>`;
                        document.body.appendChild(trafficDiv);
                     }
                     let totalReceivedSize = 0;
                     function formatBytes(bytes, decimals = 2) {
                         if (!+bytes) return '0 Bytes';
                         const k = 1024;
                         const dm = decimals < 0 ? 0 : decimals;
                         const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
                         const i = Math.floor(Math.log(bytes) / Math.log(k));
                         return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
                     }
                     function updateTraffic() {
                         const resources = window.performance.getEntriesByType('resource');
                         const now = performance.now();
                         const receivedThisSecond = resources.reduce((acc, entry) => {
                             if (now - entry.responseEnd < 1000) {
                                 return acc + entry.transferSize;
                             } else {
                                 return acc;
                             }
                         }, 0);
                        totalReceivedSize += receivedThisSecond;
                        var totalee=parseInt(localStorage.getItem('transfer_gesamt1'))+parseInt(receivedThisSecond);
                        localStorage.setItem('transfer_gesamt1',totalee);//totalReceivedSize1);
	                    var d1 = new Date();
                        var tag1 = d1.getDate();
                        var jahr1 = d1.getFullYear();
                        var stunde1 = d1.getHours();
                        var stunde2 = d1.getHours();
                        var monat1= d1.getMonth()+1;
                        if(tag1<10){
                            tag1='0'+tag1;
                        }
                        if(monat1<10){
                            monat1='0'+monat1;
                        }
	                    if(stunde1<10){
                            stunde1='0'+stunde1;
                        }
                        var totalee_transfer=parseInt(localStorage.getItem('transfer_speicher_interval_helfer'))+parseInt(receivedThisSecond);
                        localStorage.setItem('transfer_speicher_interval_helfer',totalee_transfer);
			        	if(localStorage.getItem('transfer_speicher_rytmus_helfer1')==stunde1){
			            }else{
			        	    localStorage.setItem('transfer_speicher_rytmus_helfer1',stunde1);
			        	    transfer_array.push([stunde2+ '-' +tag1+ '-' +monat1 + '-' +jahr1,totalee_transfer]);
			                console_debug('Zusatzinfos:',stunde2+'-'+stunde1+'-'+tag1+'-'+monat1+'-'+jahr1+'----'+totalee_transfer,241);
                            console_debug(2,2);
			        		localStorage.setItem('transfer_speicher_interval_array',JSON.stringify(transfer_array));
                            var killer=setTimeout(function(){
                                localStorage.setItem('transfer_speicher_interval_helfer',0);
		                      	console_debug('Zusazuonfos:',stunde2+'-'+stunde1+'-'+tag1+'-'+monat1+'-'+jahr1+'----'+totalee_transfer,247);
                                console_debug(2,2);
                            },1500);
			        	}
                        if(ww!='title'){
                             document.querySelector('#traffic_helper1').innerText=formatBytes(totalReceivedSize);
                             document.querySelector('#traffic_helper2').innerText=formatBytes(receivedThisSecond);
                             document.querySelector('#traffic_helper3').innerText=formatBytes(totalee)+' = '+formatBytes(totalee_transfer);
                        }else{

                             trafficDiv.innerHTML = `${download_image}
                             ${formatBytes(totalReceivedSize)} •
                             ${meter_image} ${formatBytes(receivedThisSecond)} •
                             ${download_image}
                             ${download_image}
                             ${formatBytes(totalee)} = ${formatBytes(totalee_transfer)}`;
                        }
                    }
                    setInterval(updateTraffic, 1000);
                }catch(e){
                    //console.log(e);
			        console_debug('Zusazuinfos:',e,268);
                    console_debug(2,2);
                    setTimeout(starte, 5000);
                }
            }
            if(localStorage.getItem('zusatzinfos_einblenden')=='true'){
                setTimeout(starte,1000);
            }
        }
        return 1;
    }else{
        return 2;
    }
    return 3;
}
var checkboxerweiterung_zusatzinfos_aktivieren;
if(localStorage.getItem('zusatzinfos_einblenden')=='true'){
    checkboxerweiterung_zusatzinfos_aktivieren ='checked="true"';
}else{
    checkboxerweiterung_zusatzinfos_aktivieren ='';
}
var checkboxerweiterung_zusatzinfos_mause_oder_daten ='';
if(localStorage.getItem('mouse_oder_datentransfer')=='true'){
    checkboxerweiterung_zusatzinfos_mause_oder_daten ='checked="true"';
}else{
    checkboxerweiterung_zusatzinfos_mause_oder_daten ='';
}
if(!erweiterungs_einstellungs_array){
    erweiterungs_einstellungs_array = [];
}

erweiterungs_einstellungs_array.push(['zusatzinfos_anzeigen',`<hr>
<label>
    <label style="display:flex;flex-direction:column">
        <p>
            <strong>Zusatzinfos einblenden</strong>
            <input type="checkbox" id="zusatzinfos_einblenden_id" ${checkboxerweiterung_zusatzinfos_aktivieren}>
    <span>?
      <small>
        Es gibt 2 auswahlmöglichkeiten im nächten einstell Menü.
        Dazu noch den Datentrasfer der aktuell läuft ,
        Transfer der seid beginn der Seite von Youtube läauft und der Gesamt Transfer angezeigt<br>
       1. Man kann auch die Maus Distanz anzeigen lassen die die Maus,
        auf allen Youtube Seiten hinter sich gelassen hat.
        Es wird einmal die distanz während des aktuellen besuchs von Youtube angezeigt
        und einmal fir distanz seid beginn dieses Scriptes.<br>
        Aktuell stehen die Informationen in der Titel Leiste.
        Unter den Menü Punkt Entwickler können sie den Standort der Anzeige ändern.
      </small></span>
        </p>
    </label>
    <label>Extra Infos auswahl Maus oder Tranfer
        <input type="checkbox" id="mouse_oder_daten_id" ${checkboxerweiterung_zusatzinfos_mause_oder_daten}>
        <span>?
            <small>
                Bei aktivierter Checkbox werden distanz von ihre Maus angezegt auf den Youtube Seiten gemacht hat<br>
                Bleibt das Kästchen leer, wird die aktuelle und Gesamt Transferdaten angezeigt.
            </small>
       </span>
    </label>
    <label style="display:flex;flex-direction:column">
          Zusatzinfos position:<br>
          <code>document.querySelector('</code><code style="color:red">head</code><code>');</code>
          <input type="text" id="selector_textarea" value="${localStorage.getItem('selector_zusatzinformationen')}">
          <small>Mit querySelector können Sie die Anzeige in jedes andere Element anzeigen
              lassen ( Vorsicht,Xoutube arbeitet mit gleichen is'd, was die möglichkeit eine id zu nutzen schwerer macht).
              Sie können den Infos auch eine feste Position geben.
              Einfach beues Element erstellen uns über das Style Attributte die position und style der anzeige angeben.
          </small>
    </label>
    <label style="display:flex;flex-direction:column">
          Einen Link oder base64 zu einen Icon was einen Pfeil nach unten zeigt Optional:<br>
          <input type="text" id="image_pfeil_value" value="${localStorage.getItem('transfer_style_image_down')}">
          <small>
          geben sie ein eigenes base64 link zum icon an
          </small>
    </label>
    <label style="display:flex;flex-direction:column">
          Einen Link oder base64 zu einen Icon was einen Meter nach unten zeigt Optional:<br>
          <input type="text" id="image_meter_value" value="${localStorage.getItem('transfer_style_image_meter')}">
          <small>
          geben sie ein eigenes base64 link zum icon an
          </small>
    </label>
    <label style="display:flex;flex-direction:column">
          Css angabe um style und position zu erstellen zb so<br>
          <code>
          height:auto !important;
          pointer-events:none;
          position:fixed;
          z-index:999999;
          left:0;
          top:0;
          size:15px;
          background:rgba(0, 0, 0, 0.7);
          color:white;
          padding:5px;
          </code>
          <input type="text" id="fraffic_position_erstellen" value="${localStorage.getItem('transfer_style')}">
          <small>
          Geben sie hier eine inline style angabe ein.Ihre angaben werden dann direkt auf ihren Xontainer angewendet.
          </small>
    </label>
</label>     <hr style="height:3px;background:black">`]);
if(!array_script){
	var array_script=[];
}
array_script.push([`
    var zusatzinfos_einblenden_id_var=document.getElementById('zusatzinfos_einblenden_id')
    zusatzinfos_einblenden_id_var.addEventListener('click',function(u){
        if(zusatzinfos_einblenden_id_var.checked==true){
            localStorage.setItem('zusatzinfos_einblenden',true);
        }else{
            localStorage.setItem('zusatzinfos_einblenden',false);
        }
    })

    var zusatzinfos_mouse_oder_daten_id_var=document.getElementById('mouse_oder_daten_id')
    zusatzinfos_mouse_oder_daten_id_var.addEventListener('click',function(u){
        if(zusatzinfos_mouse_oder_daten_id_var.checked==true){
            localStorage.setItem('mouse_oder_datentransfer',true);
        }else{
            localStorage.setItem('mouse_oder_datentransfer',false);
        }
    })

    document.getElementById('selector_textarea').addEventListener('click',function(u){
        localStorage.setItem('selector_zusatzinformationen',document.getElementById('selector_textarea').value);
    })
    document.getElementById('image_pfeil_value').addEventListener('click',function(u){
        localStorage.setItem('transfer_style_image_down',document.getElementById('image_pfeil_value').value);
    })
    document.getElementById('image_meter_value').addEventListener('click',function(u){
        localStorage.setItem('transfer_style_image_meter',document.getElementById('image_meter_value').value);
    })
    document.getElementById('fraffic_position_erstellen').addEventListener('click',function(u){
        localStorage.setItem('transfer_style',document.getElementById('fraffic_position_erstellen').value);
    })

`,'Erweiterung Zusatzinfos']);

if(localStorage.getItem('zusatzinfos_einblenden')){
    var zusatz_infos_var=zusatzinfos_einblenden_anzeigen();
    if(zusatz_infos_var==1){
		console_debug('Zusatzinfos:','aktiviert',412);
    }else if(zusatz_infos_var==2){
		console_debug('Zusatzinfos:','deaktiviert',414);
    }else if(zusatz_infos_var==3){
	    console_debug('zusatzinfos:','error ladeen:',416);
    }else if(zusatz_infos_var==4){
	    console_debug('Zusatzinfos:','datentransfer aktive: ',418);
    }else if(zusatz_infos_var==5){
	    console_debug('Zusatzinfos:','mousedistanz aktive: ',420);
    }else{
		console_debug('zusatzinfos:','error ladeen:',422);
    }
}

