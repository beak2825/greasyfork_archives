// ==UserScript==
// @name         MediaKlikk - mentés
// @namespace    
// @version      0.9
// @description  Mentési segéd
// @author       vacsati
// @match        https://player.mediaklikk.hu/playernew/player.php?video=*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/33166/MediaKlikk%20-%20ment%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/33166/MediaKlikk%20-%20ment%C3%A9s.meta.js
// ==/UserScript==
// Szükséges     http://data.hu/get/7879852/chunk_list_downloader_v1.1.zip

console.log('MediaKlikk - mentés');

var letolt = "<svg fill='rgba(255,255,255,1)' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M0 0h24v24H0z' fill='none'/><path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z'/></svg>";
var stilus="position:absolute;top:100px;right:100px;background:rgba(0,0,0,0.5);border-radius:5px;padding:2px 4px;";
var allomany=jwplayer().getPlaylist(); allomany=allomany[0].file;
var hivatkozas=allomany.replace("playlist.m3u8", ""); //console.log('m3u8:'+allomany+' hivatkozás:'+hivatkozas);
var tmp = allomany.lastIndexOf("/");
var legngyb=0;
var legjobb=null;
var legjbbk=false;
//var cim=document.title.split(' | ')[0].replace(/ /g, "_");
var cim=decodeURI(window.location.search.split('&title=')[1].split('&')[0]).replace(/ /g, "_");
cim=cim.replace(/[őóö]/ig,"o");cim=cim.replace(/[úűü]/ig,"o");cim=cim.replace(/á/ig,"a");cim=cim.replace(/é/ig,"e");
if (tmp != -1) {
  var base_url = allomany.substr(0, tmp + 1);
  var m3u8 = allomany;
  $.ajax({
     type: "GET",
     url: m3u8,
     success: function(data) {
         $content=data;
         arr=data.split("\n");
         $removeItem = arr[0];
         arr = jQuery.grep(arr, function(value) {
             return value !== $removeItem;
         });
         arr1=[];
         arr2=[];
         $.each(arr, function(index, value ){
             //var pattern = /#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=[0-9]*/; //élő
             var pattern = /#EXT-X-STREAM-INF:BANDWIDTH=[0-9]*/; //régi
             if(pattern.test(value)){
                 var band=value.split("BANDWIDTH=")[1];
                 band=Number(band.split(",")[0]);
                 if(band > legngyb){
                     legjbbk=true;
                     legngyb = band;
                 }
                 //console.log('bnd: '+band);
             } else {
                 pattern = /m3u8/;
                 if(pattern.test(value)){
                     //console.log('m3u8: '+value);
                     if(legjbbk){
                         legjbbk=false;
                         legjobb=value;
                     }
                 }else{
                     //console.log('nem m3u8: '+value);
                 }
             }
         });
         //console.log('arr: '+JSON.stringify(arr));
     },
     error: function(request, status, error) {
         console.log('bajvan: '+error);
     },
     complete: function(data) {
         console.log('megvan:'+legjobb);//chunklist_w557993959_b3000000.m3u8
         var ny=legjobb.substring(10).split('.')[0];ny="media_"+ny+"_";
         var kesz="complete_"+ny+"0.ts";
         var btch="DEL "+ny+"*.ts\nREN "+kesz+" "+cim+".ts\nDEL indits-el*.bat";
         var bat_forras = "data:text/plain;base64," + btoa('C:\\CLD\\chunklist_downloader.exe "https:'+hivatkozas+legjobb+'"\nSTART C:\\CLD\n'+btch);
         $('#player').append('<a id="segedgomb3" href="'+bat_forras+'" download="indits-el.bat" style="'+stilus+'">'+letolt+'</a>');
     }
  });
}
