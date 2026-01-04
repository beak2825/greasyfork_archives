// ==UserScript==
// @name         Erweiterung (download button)für das gesehende videos ausblenden oder makieren
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Diese erweiterung erstellt einen Download  Button um direkt Videos von youtube zu laden,
// oder sie werden auf eine dritt seite weitergeleitet wo nsie das Yputube Video runterladen können.
// ACHTUNG: Dieses Script läuft nur mit meinen Userscript "Bastis Youtube Multi Script,gesehende videos ausblenden oder makieren",
// was in den nächsten Tagen Online kommt.
// Zu den Hauptscript kann dieses Script einfach eingebunden werden und das Hauptscript hat eine Funktion mehr.
// Alle Neue einstellmöglichkeiten der erweiterungen können in das Hauptmenü des Hauptscriptes eingestellt werden.
// @author       basti1012
// @allFrames    true
// @run-at document-end
// @license MIT License
// @noframes
// @exclude           *://myactivity.google.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @include      *youtube.com/watch?v=*
// @grant        none
// ==/UserScript==

if(!console_log_value){
    var console_log_value = [];
}
var start4 = performance.now();
if(!array_localsdtorage){
    var array_localsdtorage=[];
}
if(!erweiterungs_einstellungs_array){
    var erweiterungs_einstellungs_array=[];
}
array_localsdtorage.push(["download_einblenden", false],["download_from_fremdserver",true]);

function download_einblenden_anzeigen(){
    if(localStorage.getItem('download_einblenden')=='true'){
        if(location.href.indexOf('youtube.com/watch?')!=-1 || location.href.indexOf('youtu.be/')!=-1){
            function download2(){
                var id = window.location.search.split('v=')[1];
                let hrefDownload ='https://en.loader.to/4/?link=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D'+ id + '3&f=6&s=1&e=1&r=ddownr';
                window.open(hrefDownload, '_blank');
            }
            function download(){
                var id = window.location.search.split('v=')[1];
                let hrefDownload ='https://en.loader.to/4/?link=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D'+ id + '3&f=6&s=1&e=1&r=ddownr';
                window.open(hrefDownload, '_blank');
            }
            const styleTag = document.createElement('style');
            styleTag.id='BASTI1012_ERWEITERUNG_DOWNLOADBUTTON';
            styleTag.innerHTML = `
            div#download_tooltip {
                margin: -100px 0 0 -220px;
                position: absolute;
                line-height: 12px;
                border-radius: 5px;
                display:none;
                padding: 5px;
                width: 150px;
                z-index: 11111;
                background: rgba(2,2,2,0.8);
                color: white;
            }
            #download_tooltip:hover{
                background:green;
            }
            #download_tooltip:active{
                background:red;
            }
            button#www:hover #download_tooltip {
                display:block;
            }`;
            document.body.appendChild(styleTag);
            function download1(elm,swb,videoTitle){
              //  console.log('download 1 videotitle = '+videoTitle);
                var p=0;
                const apiUrl = 'https://co.wuk.sh/api/json';
                const requestData = {
                     url: window.location.href
                };
                const xhr = new XMLHttpRequest();
                xhr.open('POST', apiUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json');
           //     console.log("sending request");
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        if(xhr.status >= 200 && xhr.status < 300) {
                            const responseData = JSON.parse(xhr.responseText);
                            createButton(elm,'green','Download success <br> Status : '+xhr.status,1);
                            setTimeout(function() {
                                var a_elem= document.createElement('a');
                                a_elem.id="eee";
                                a_elem.href = responseData.url;
                                a_elem.download = videoTitle+'.mp4';
                                document.getElementsByTagName('body')[0].appendChild(a_elem);
                                a_elem.click();
                              //  document.getElementById("eee").remove();
                              // download_einblenden_anzeigen();
                            },1000);
                        }else{
                           // console.error('Download error');
                           var console_download_debugging='Download error';
                           var console_download_debugging_per=''+(performance.now() - start4) + ' ms.';
                           console_log_value.push({
                               name: console_download_debugging,
                               wert: console_download_debugging_per
                           });
                           if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                               console.table(console_log_value);
                           }
                            var fehlertext="<b style='color:red'>"+JSON.parse(xhr.responseText).text+"</b>";
                            createButton(elm,'red',`Download error ${xhr.status} <br> Text : ${fehlertext} <br> 2Alternative :
                            Versuche den Download über den Fremdserver <button id="eeee">Download Fremdserver</button>
                            <br><small>Auf den klick des Buttons wird eine neue Seite geöffnet</small><script>document.getElementById('eeee').addEventListener('click',function(){download2();})</script>`,1);
                        }
                    }
                };
                xhr.onerror = function() {
                    //  console.error('Network error');
                    var console_download_debugging='Network error';
                    var console_download_debugging_per=''+(performance.now() - start4) + ' ms.';
                    console_log_value.push({
                        name: console_download_debugging,
                        wert: console_download_debugging_per
                    });
                    if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                        console.table(console_log_value);
                    }
                    var fehlertext="<b style='color:red'>"+JSON.parse(xhr.responseText).text+"</b>";
                    createButton(elm,'red',`Network error ${xhr.status} <br> Text : ${fehlertext} <br> 1Alternative :
                    Versuche den Download über den Fremdserver <button id="eeee">Download Fremdserver</button>
                    <br><small>Auf den klick des Buttons wird eine neue Seite geöffnet</small><script>document.getElementById('eeee').addEventListener('click',function(){download2();})</script>`,1);
                };
                xhr.success = function(){
                    //console.log('Download erfolgreich');
                    var console_download_debugging='Download erfolgreich';
                    var console_download_debugging_per=''+(performance.now() - start4) + ' ms.';
                    console_log_value.push({
                        name: console_download_debugging,
                        wert: console_download_debugging_per
                    });
                    if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                        console.table(console_log_value);
                    }
                };
                if (p==0) {
                    p++;
                    xhr.send(JSON.stringify(requestData));
                    return;
                }
            }

            function createButton(elm,farbe,videoTitle,j){
                if(videoTitle==''){
                    setTimeout(function(){
                        try{
                            videoTitle=titel_holen();
                            if(videoTitle==''){
                                videoTitle=document.getElementsByTagName('title')[0].innerHTML;
                            }

                        }catch(e){
                            videoTitle=document.getElementsByTagName('title')[0].innerHTML;
                        }
                     //   console.log('titel auslesen '+videoTitle);//document.querySelector('title').innerHTML)
                    },2000);
                }else{
                    try{
                        videoTitle=titel_holen();
                        if(videoTitle==''){
                            videoTitle= document.getElementsByTagName('title')[0].innerHTML;
                        }
                    }catch(e){
                        videoTitle=document.getElementsByTagName('title')[0].innerHTML;
                    }
                  //  console.log('titel auslesen '+videoTitle);//document.querySelector('title').innerHTML)
                }
                setTimeout(function(){
                    if(document.getElementById('www')){
                        document.getElementById('www').remove();
               //         console.log('neuen Button erstellt mit der Farbe '+farbe+' und mit den Videotitle '+videoTitle);
                    }
                    const swb = document.createElement('button');
                    swb.classList.add('ytp-button');
                    swb.classList.add('downloadBTN');
                    swb.id="www";
                    if (j!=1) {
                        if(localStorage.getItem('download_from_fremdserver')=='true'){
                          //  swb.onclick = download;
                             swb.addEventListener('click',function(){
                             download();
                            });
                        }else{
                          //  swb.onclick = download1;
                             swb.addEventListener('click',function(){
                             download1(elm,swb,videoTitle);
                            });
                        }
                    }
                    swb.innerHTML=svg(farbe);
                    elm.appendChild(swb);
                    create_div(swb,videoTitle);
                },3222);
            }

            function create_div(swb,Text){
                const div_element = document.createElement('div');
                div_element.id='download_tooltip';
                if(Text!=''){
                    div_element.innerHTML=Text;
                }else{
                    div_element.innerHTML=titel_holen();
                }
                swb.appendChild(div_element);
            }
            function svg(farbe){
                var svg_ele= `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
                              <rect width="100%" height="100%" fill="none"/>
                              <polyline points="86 110 128 152 170 110" fill="#fff" stroke="${farbe}" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/>
                              <line x1="128" y1="40" x2="128" y2="152" fill="#fff" stroke="${farbe}" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/>
                              <path d="M216,152v56a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152" fill="none" stroke="${farbe}" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/>
                              </svg>`;
                return svg_ele;
            }
            function titel_holen(){
                try{
                return document.getElementById("above-the-fold").querySelector("#title").innerText == null ? window.location.toString() : document.getElementById("above-the-fold").querySelector("#title").innerText;
                }catch(e){
                    return document.getElementsByTagName('title')[0].innerHTML;
                }
            }
            function url_mutation(elm){
                let previousUrl = '';
                const observer = new MutationObserver(function(mutations) {
                    if (location.href !== previousUrl) {
                        previousUrl = location.href;
                    //    document.getElementById("www").remove();
                 //       console.log('neue url erkannt');
            //            console.log(titel_holen());
                        const vidh='';
                        setTimeout(function(){
                           const vidh=titel_holen();
                           var console_download_debugging=vidh;
                           var console_download_debugging_per=''+(performance.now() - start4) + ' ms.';

                           console_log_value.push({
                               name: console_download_debugging,
                               wert: console_download_debugging_per
                           });
                           if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                               console.table(console_log_value);
                           }
                          // console.log(vidh);
                        },2000);

                        setTimeout(function() {
                            if(localStorage.getItem('download_from_fremdserver')=='true'){
                                 createButton(elm,'#ddffe9fc',vidh,2);
                           }else{
                                createButton(elm,'#6fad85',vidh,2);
                           }
                        },3000);
                    }
                });
                const config = {subtree: true, childList: true};
                observer.observe(document, config);
            }
            function waitForElm(selector) {
                return new Promise(resolve => {
                    if (document.querySelector(selector)) {
                        return resolve(document.querySelector(selector));
                    }
                    const observer = new MutationObserver(mutations => {
                        if (document.querySelector(selector)) {
                            observer.disconnect();
                            resolve(document.querySelector(selector));
                        }
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                });
            }

            waitForElm('.ytp-right-controls').then((elm) => {
                if(localStorage.getItem('download_from_fremdserver')=='true'){
                    url_mutation(elm);
                    createButton(elm,'white',titel_holen(),2);
                }else{
                    function createButton1(elm,videoTitle){
                        url_mutation(elm);
                       // createButton(elm,'yellow',titel_holen(),1);
                        if (videoTitle =='') {
                            setTimeout(function() {
                                createButton(elm,'blue','Kein Downloadlink gefunden',2);
                            }, 10000);
                            console.log("Kein Downloadlink gefunden");
                           var console_download_debugging='Kein Download Link gefunden';
                           var console_download_debugging_per=''+(performance.now() - start4) + ' ms.';

                           console_log_value.push({
                               name: console_download_debugging,
                               wert: console_download_debugging_per
                           });
                           if(localStorage.getItem('console_log_debugging_aktivieren')=='true'){
                               console.table(console_log_value);
                           }
                        }else{
                            createButton(elm,'orange','Klicken um zu downloaden von<br>'+titel_holen(),2);
                        }
                    }
                    createButton1(elm,titel_holen());
                }
            });
            return 4;
        }else{
            return 5;
        }
        return 1;
    }else{
        return 2;
    }
  return 3;
}


var checkboxerweiterungdownloadbuttonaktivieren;
if(localStorage.getItem('download_einblenden')=='true'){
     checkboxerweiterungdownloadbuttonaktivieren ='checked="true"';
}else{
    checkboxerweiterungdownloadbuttonaktivieren ='';
}

var checkboxerweiterungdownloadbuttonfremdserver;
if(localStorage.getItem('download_from_fremdserver')=='true'){
    checkboxerweiterungdownloadbuttonfremdserver ='checked="true"';
}else{
    checkboxerweiterungdownloadbuttonfremdserver ='';
}

if(!erweiterungs_einstellungs_array){
     erweiterungs_einstellungs_array = [];
}
erweiterungs_einstellungs_array.push(['downloadnutton_anzeigen',`<hr>
<label>
    <label style="display:flex;flex-direction:column">
        <p>
            <strong>Downloadbutton Aktivieren</strong>
            <input type="checkbox" id="download_button_aktivieren" ${checkboxerweiterungdownloadbuttonaktivieren}>
            <span>?
                <small>
                    Mit dieser Funktion wird im Player ein Downloadbutton angezeigt ,um das aktuell laufene Video runterladen zu können.
                </small>
            </span>
        </p>
    </label>
        <label style="display:flex;flex-direction:column">
        <p>
            <strong>Direkt-downloaf,oder Fremdserver</strong>
            <input type="checkbox" id="download_button_fremdserver" ${checkboxerweiterungdownloadbuttonfremdserver}>
            <span>?
                <small>
                    Mit dieser Funktion kann beim klick auf den Icon das Video firekt runtergeladen werden
                    ,oder sie werden auf einer dritt Seite weitergeladen,
                    wo sie das Video dann auch runterladen können
                </small>
            </span>
        </p>
    </label>
</label><hr style="height:3px;background:black">`]);
if(!array_script){
	var array_script=[];
}
array_script.push([`
    var downloadbutton_var=document.getElementById('download_button_aktivieren')
    downloadbutton_var.addEventListener('click',function(u){
        if(downloadbutton_var.checked==true){
            localStorage.setItem('download_einblenden',true);
        }else{
            localStorage.setItem('download_einblenden',false);
        }
    })
    var downloadbutton_fremdserver_var=document.getElementById('download_button_fremdserver')
    downloadbutton_fremdserver_var.addEventListener('click',function(u){
        if(downloadbutton_fremdserver_var.checked==true){
            localStorage.setItem('download_from_fremdserver',true);
        }else{
            localStorage.setItem('download_from_fremdserver',false);
        }
    })
`]);

var download_einblenden_an=download_einblenden_anzeigen();
var console_download='________';
var console_download_per='________';
    if(download_einblenden_an==1){
        //  console.log('%c download button aktiviert'+ (performance.now() - start4) + ' ms.','color:green');
        console_download=' download button aktiviert';
        console_download_per=''+(performance.now() - start4) + ' ms.';
    }else if(download_einblenden_an==2){
        //  console.log('%c download button deaktiviert'+ (performance.now() - start4) + ' ms.','color:orange');
        console_download=' download button deaktiviert';
        console_download_per=''+(performance.now() - start4) + ' ms.';
    }else if(download_einblenden_an==3){
        //  console.log('%c cFunctin download button gerufen error '+ (performance.now() - start4) + ' ms.','color:red');
        console_download='Functin download button gerufen error';
        console_download_per=''+(performance.now() - start4) + ' ms.';
    }else if(download_einblenden_an==4){
	    //	console.log('%c download button Watch Seite'+ (performance.now() - start4) + ' ms.','color:green');
        console_download='download button Watch Seite';
        console_download_per=''+(performance.now() - start4) + ' ms.';
	}else if(download_einblenden_an==5){
	    //  console.log('%c download button Keine watch seite'+ (performance.now() - start4) + ' ms.','color:orange');
        console_download='download button Keine watch seite';
        console_download_per=''+(performance.now() - start4) + ' ms.';
	}
    console_log_value.push({
        name: console_download,
        wert: console_download_per
    });
