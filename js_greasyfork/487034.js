// ==UserScript==
// @name         Autodarts Caller
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  Another Autodarts-Caller
// @author       benebelter
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/445697/1244619/Greasy%20Fork%20API.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/487034/Autodarts%20Caller.user.js
// @updateURL https://update.greasyfork.org/scripts/487034/Autodarts%20Caller.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //////////////// CONFIG ////////////////////

    var triplesound = 0; // 0=off / 1=simple beep on / 2=Löwen-sound (Soft-tip) on => triple_sound if hitting a triple
    var boosound = 0; //  0=off / 1=on => crowd-boo if hitting a miss
    var server = 'http://autodarts.x10.mx/'; //  Server
    var caller = ''; //  caller: "russ_bray", "google" (select language in next line)
    var language = 'en';
    var update = '';
    var call;

    //////////////// CONFIG ////////////////////
    var scolia_eng = '{"1":{"num":"1","start":0.0,"end":0.9},"2":{"num":"2","start":1.0,"end":1.9},"3":{"num":"3","start":1.9,"end":2.85},"4":{"num":"4","start":2.85,"end":3.85},"5":{"num":"5","start":3.85,"end":4.8},"6":{"num":"6","start":4.8,"end":5.75},"7":{"num":"7","start":5.7,"end":6.8},"8":{"num":"8","start":6.8,"end":7.6},"9":{"num":"9","start":7.7,"end":8.8},"10":{"num":"10","start":8.8,"end":10.0},"11":{"num":"11","start":10.0,"end":11.0},"12":{"num":"12","start":11.0,"end":11.9},"13":{"num":"13","start":12.0,"end":12.9},"14":{"num":"14","start":13.0,"end":13.9},"15":{"num":"15","start":14.0,"end":15.0},"16":{"num":"16","start":15.0,"end":15.9},"17":{"num":"17","start":16.0,"end":17.0},"18":{"num":"18","start":17.0,"end":17.9},"19":{"num":"19","start":18.0,"end":19.0},"20":{"num":"20","start":19.0,"end":19.9},"21":{"num":"21","start":20.0,"end":20.9},"22":{"num":"22","start":21.0,"end":21.9},"23":{"num":"23","start":22.0,"end":23.0},"24":{"num":"24","start":23.0,"end":23.9},"25":{"num":"25","start":24.0,"end":25.0},"26":{"num":"26","start":25.0,"end":26.0},"27":{"num":"27","start":26.0,"end":26.9},"28":{"num":"28","start":27.0,"end":27.9},"29":{"num":"29","start":27.9,"end":28.9},"30":{"num":"30","start":29.0,"end":29.9},"31":{"num":"31","start":30.0,"end":30.9},"32":{"num":"32","start":31.0,"end":32.0},"33":{"num":"33","start":32.0,"end":32.9},"34":{"num":"34","start":33.0,"end":33.9},"35":{"num":"35","start":34.0,"end":35},"36":{"num":"36","start":35.1,"end":36.0},"37":{"num":"37","start":36.1,"end":37.1},"38":{"num":"38","start":37.1,"end":38.1},"39":{"num":"39","start":38.1,"end":39.1},"40":{"num":"40","start":39.1,"end":40.1},"41":{"num":"41","start":40.1,"end":40.9},"42":{"num":"42","start":40.9,"end":41.9},"43":{"num":"43","start":42.0,"end":43.0},"44":{"num":"44","start":43.0,"end":44.0},"45":{"num":"45","start":44.0,"end":45.0},"46":{"num":"46","start":45.0,"end":46.1},"47":{"num":"47","start":46.2,"end":47.2},"48":{"num":"48","start":47.2,"end":48.2},"49":{"num":"49","start":48.2,"end":49.2},"50":{"num":"50","start":49.3,"end":50.2},"51":{"num":"51","start":50.3,"end":51.2},"52":{"num":"52","start":51.2,"end":52.3},"53":{"num":"53","start":52.3,"end":53.3},"54":{"num":"54","start":53.3,"end":54.3},"55":{"num":"55","start":54.3,"end":55.4},"56":{"num":"56","start":55.4,"end":56.6},"57":{"num":"57","start":56.6,"end":57.6},"58":{"num":"58","start":57.7,"end":58.7},"59":{"num":"59","start":58.7,"end":59.9},"60":{"num":"60","start":59.9,"end":60.9},"61":{"num":"61","start":60.9,"end":61.9},"62":{"num":"62","start":62.0,"end":63.0},"63":{"num":"63","start":63.0,"end":64.0},"64":{"num":"64","start":64.0,"end":65.2},"65":{"num":"65","start":65.2,"end":66.4},"66":{"num":"66","start":66.4,"end":67.7},"67":{"num":"67","start":67.8,"end":68.8},"68":{"num":"68","start":68.8,"end":69.9},"69":{"num":"69","start":70.0,"end":70.9},"70":{"num":"70","start":71.0,"end":72.0},"71":{"num":"71","start":72.1,"end":73.1},"72":{"num":"72","start":73.1,"end":74.3},"73":{"num":"73","start":74.3,"end":75.5},"74":{"num":"74","start":75.6,"end":76.6},"75":{"num":"75","start":76.7,"end":77.75},"76":{"num":"76","start":77.85,"end":79.0},"77":{"num":"77","start":79.1,"end":80.2},"78":{"num":"78","start":80.2,"end":81.2},"79":{"num":"79","start":81.2,"end":82.3},"80":{"num":"80","start":82.4,"end":83.1},"81":{"num":"81","start":83.1,"end":84.2},"82":{"num":"82","start":84.2,"end":85.0},"83":{"num":"83","start":85.15,"end":86.0},"84":{"num":"84","start":86.1,"end":87.0},"85":{"num":"85","start":87.0,"end":88},"86":{"num":"86","start":88.05,"end":89.0},"87":{"num":"87","start":89.0,"end":90.0},"88":{"num":"88","start":90.0,"end":91.0},"89":{"num":"89","start":91.0,"end":91.9},"90":{"num":"90","start":92.0,"end":92.9},"91":{"num":"91","start":92.9,"end":93.9},"92":{"num":"92","start":93.9,"end":94.9},"93":{"num":"93","start":94.9,"end":96},"94":{"num":"94","start":96.1,"end":97.0},"95":{"num":"95","start":97.0,"end":98.1},"96":{"num":"96","start":98.3,"end":99.4},"97":{"num":"97","start":99.4,"end":100.6},"98":{"num":"98","start":100.6,"end":101.5},"99":{"num":"99","start":101.6,"end":102.7},"100":{"num":"100","start":102.75,"end":104.0},"101":{"num":"101","start":104.1,"end":105.3},"102":{"num":"102","start":105.3,"end":106.5},"103":{"num":"103","start":106.6,"end":108.1},"104":{"num":"104","start":108.2,"end":109.6},"105":{"num":"105","start":109.7,"end":111.2},"106":{"num":"106","start":111.3,"end":112.8},"107":{"num":"107","start":112.8,"end":114.2},"108":{"num":"108","start":114.3,"end":115.5},"109":{"num":"109","start":115.6,"end":116.9},"110":{"num":"110","start":116.9,"end":118.2},"111":{"num":"111","start":118.3,"end":119.85},"112":{"num":"112","start":119.85,"end":121.4},"113":{"num":"113","start":121.5,"end":123},"114":{"num":"114","start":123.1,"end":124.7},"115":{"num":"115","start":124.8,"end":126.3},"116":{"num":"116","start":126.4,"end":128},"117":{"num":"117","start":128.1,"end":129.8},"118":{"num":"118","start":129.8,"end":131.4},"119":{"num":"119","start":131.5,"end":133.1},"120":{"num":"120","start":133.1,"end":134.7},"121":{"num":"121","start":134.7,"end":136.7},"122":{"num":"122","start":136.75,"end":138.8},"123":{"num":"123","start":138.8,"end":141.2},"124":{"num":"124","start":141.2,"end":143.3},"125":{"num":"125","start":143.3,"end":145.55},"126":{"num":"126","start":145.55,"end":147.8},"127":{"num":"127","start":147.8,"end":149.9},"128":{"num":"128","start":149.9,"end":152},"129":{"num":"129","start":152.1,"end":154},"130":{"num":"130","start":154.15,"end":155.85},"131":{"num":"131","start":155.85,"end":157.8},"132":{"num":"132","start":157.9,"end":159.7},"133":{"num":"133","start":159.7,"end":161.8},"134":{"num":"134","start":161.8,"end":163.8},"135":{"num":"135","start":163.95,"end":166},"136":{"num":"136","start":166.1,"end":168.1},"137":{"num":"137","start":168.1,"end":170.0},"138":{"num":"138","start":170.1,"end":172},"139":{"num":"139","start":172.1,"end":174},"140":{"num":"140","start":174.1,"end":175.8},"141":{"num":"141","start":175.8,"end":177.65},"142":{"num":"142","start":177.65,"end":179.5},"143":{"num":"143","start":179.5,"end":181.4},"144":{"num":"144","start":181.5,"end":183.35},"145":{"num":"145","start":183.35,"end":185.35},"146":{"num":"146","start":185.35,"end":187.3},"147":{"num":"147","start":187.4,"end":189.1},"148":{"num":"148","start":189.2,"end":191.0},"149":{"num":"149","start":191.0,"end":192.8},"150":{"num":"150","start":192.9,"end":194.4},"151":{"num":"151","start":194.4,"end":196.1},"152":{"num":"152","start":196.2,"end":197.8},"153":{"num":"153","start":197.9,"end":199.65},"154":{"num":"154","start":199.65,"end":201.4},"155":{"num":"155","start":201.4,"end":203.2},"156":{"num":"156","start":203.2,"end":205.1},"157":{"num":"157","start":205.1,"end":207.0},"158":{"num":"158","start":207.0,"end":208.7},"159":{"num":"159","start":208.7,"end":210.4},"160":{"num":"160","start":210.4,"end":211.9},"161":{"num":"161","start":212.0,"end":213.55},"162":{"num":"162","start":213.55,"end":215.4},"164":{"num":"164","start":215.5,"end":217.3},"165":{"num":"165","start":217.3,"end":219.45},"167":{"num":"167","start":219.45,"end":221.3},"168":{"num":"168","start":221.4,"end":223.0},"170":{"num":"170","start":223.15,"end":224.85},"171":{"num":"171","start":224.85,"end":227.1},"174":{"num":"174","start":227.1,"end":229.3},"177":{"num":"177","start":229.3,"end":231.6},"180":{"num":"180","start":231.6,"end":237.1},"gameshot":{"num":"gameshot","start":579.9,"end":580.7},"0":{"num":"0","start":580.8,"end":583}}';
    var scolia_ger = '{"1":{"num":"1","start":0.0,"end":0.7},"2":{"num":"2","start":0.7,"end":1.35},"3":{"num":"3","start":1.35,"end":1.95},"4":{"num":"4","start":1.95,"end":2.55},"5":{"num":"5","start":2.55,"end":3.35},"6":{"num":"6","start":3.35,"end":4.15},"7":{"num":"7","start":4.15,"end":4.7},"8":{"num":"8","start":4.75,"end":5.4},"9":{"num":"9","start":5.4,"end":6.0},"10":{"num":"10","start":6.0,"end":6.5},"11":{"num":"11","start":6.59,"end":7.15},"12":{"num":"12","start":7.25,"end":8.0},"13":{"num":"13","start":8.05,"end":8.8},"14":{"num":"14","start":8.85,"end":9.65},"15":{"num":"15","start":9.65,"end":10.6},"16":{"num":"16","start":10.6,"end":11.6},"17":{"num":"17","start":11.6,"end":12.55},"18":{"num":"18","start":12.6,"end":13.4},"19":{"num":"19","start":13.4,"end":14.2},"20":{"num":"20","start":14.2,"end":15.0},"21":{"num":"21","start":15.1,"end":16.15},"22":{"num":"22","start":16.15,"end":17.45},"23":{"num":"23","start":17.45,"end":18.7},"24":{"num":"24","start":18.7,"end":20.0},"25":{"num":"25","start":20.0,"end":21.3},"26":{"num":"26","start":21.3,"end":22.65},"27":{"num":"27","start":22.65,"end":23.95},"28":{"num":"28","start":23.95,"end":25.2},"29":{"num":"29","start":25.2,"end":26.6},"30":{"num":"30","start":26.6,"end":27.5},"31":{"num":"31","start":27.55,"end":28.7},"32":{"num":"32","start":28.7,"end":29.9},"33":{"num":"33","start":30.0,"end":31.1},"34":{"num":"34","start":31.2,"end":32.4},"35":{"num":"35","start":32.4,"end":33.6},"36":{"num":"36","start":33.6,"end":34.9},"37":{"num":"37","start":35.05,"end":36.3},"38":{"num":"38","start":36.3,"end":37.4},"39":{"num":"39","start":37.55,"end":38.7},"40":{"num":"40","start":38.7,"end":39.45},"41":{"num":"41","start":39.6,"end":40.8},"42":{"num":"42","start":40.8,"end":42.2},"43":{"num":"43","start":42.3,"end":43.5},"44":{"num":"44","start":43.5,"end":44.8},"45":{"num":"45","start":44.8,"end":45.9},"46":{"num":"46","start":46.05,"end":47.2},"47":{"num":"47","start":46.9,"end":48.5},"48":{"num":"48","start":48.7,"end":49.8},"49":{"num":"49","start":49.8,"end":51.0},"50":{"num":"50","start":51.1,"end":51.9},"51":{"num":"51","start":52.05,"end":53.35},"52":{"num":"52","start":53.35,"end":54.8},"53":{"num":"53","start":54.8,"end":56.2},"54":{"num":"54","start":56.2,"end":57.6},"55":{"num":"55","start":57.7,"end":59},"56":{"num":"56","start":59.05,"end":60.5},"57":{"num":"57","start":60.5,"end":61.9},"58":{"num":"58","start":61.9,"end":63.15},"59":{"num":"59","start":63.25,"end":64.5},"60":{"num":"60","start":64.5,"end":65.5},"61":{"num":"61","start":65.6,"end":66.85},"62":{"num":"62","start":66.85,"end":68.35},"63":{"num":"63","start":68.35,"end":69.7},"64":{"num":"64","start":69.7,"end":71.1},"65":{"num":"65","start":71.1,"end":72.4},"66":{"num":"66","start":72.5,"end":73.75},"67":{"num":"67","start":73.85,"end":75.15},"68":{"num":"68","start":75.15,"end":76.45},"69":{"num":"69","start":76.45,"end":77.95},"70":{"num":"70","start":77.95,"end":78.8},"71":{"num":"71","start":78.95,"end":80.16},"72":{"num":"72","start":80.16,"end":81.65},"73":{"num":"73","start":81.6,"end":82.9},"74":{"num":"74","start":83.0,"end":84.35},"75":{"num":"75","start":84.35,"end":85.68},"76":{"num":"76","start":85.68,"end":87.0},"77":{"num":"77","start":87.1,"end":88.3},"78":{"num":"78","start":88.47,"end":89.7},"79":{"num":"79","start":89.8,"end":91.0},"80":{"num":"80","start":91.15,"end":91.9},"81":{"num":"81","start":91.95,"end":93.15},"82":{"num":"82","start":93.25,"end":94.65},"83":{"num":"83","start":94.65,"end":95.9},"84":{"num":"84","start":96.0,"end":97.25},"85":{"num":"85","start":97.25,"end":98.4},"86":{"num":"86","start":98.5,"end":99.8},"87":{"num":"87","start":99.8,"end":101.15},"88":{"num":"88","start":101.15,"end":102.45},"89":{"num":"89","start":102.45,"end":103.8},"90":{"num":"90","start":103.8,"end":104.8},"91":{"num":"91","start":104.8,"end":106.0},"92":{"num":"92","start":106.0,"end":107.3},"93":{"num":"93","start":107.4,"end":108.7},"94":{"num":"94","start":108.7,"end":110.2},"95":{"num":"95","start":110.2,"end":111.4},"96":{"num":"96","start":111.45,"end":112.75},"97":{"num":"97","start":112.85,"end":114.2},"98":{"num":"98","start":114.2,"end":115.5},"99":{"num":"99","start":115.5,"end":116.7},"100":{"num":"100","start":116.7,"end":117.7},"101":{"num":"101","start":117.8,"end":118.85},"102":{"num":"102","start":118.95,"end":120.0},"103":{"num":"103","start":120.0,"end":121.0},"104":{"num":"104","start":121.0,"end":122.05},"105":{"num":"105","start":122.05,"end":123.1},"106":{"num":"106","start":123.2,"end":124.35},"107":{"num":"107","start":124.35,"end":125.4},"108":{"num":"108","start":125.4,"end":126.6},"109":{"num":"109","start":126.6,"end":127.6},"110":{"num":"110","start":127.6,"end":128.6},"111":{"num":"111","start":128.7,"end":129.95},"112":{"num":"112","start":129.95,"end":131.2},"113":{"num":"113","start":131.2,"end":132.4},"114":{"num":"114","start":132.45,"end":133.55},"115":{"num":"115","start":133.55,"end":134.75},"116":{"num":"116","start":134.75,"end":136.2},"117":{"num":"117","start":136.2,"end":137.6},"118":{"num":"118","start":137.6,"end":138.7},"119":{"num":"119","start":138.8,"end":140.0},"120":{"num":"120","start":140.0,"end":141.35},"121":{"num":"121","start":141.45,"end":143.1},"122":{"num":"122","start":143.1,"end":144.6},"123":{"num":"123","start":144.75,"end":146.35},"124":{"num":"124","start":146.4,"end":148.05},"125":{"num":"125","start":148.05,"end":149.7},"126":{"num":"126","start":149.7,"end":151.4},"127":{"num":"127","start":151.4,"end":153.0},"128":{"num":"128","start":153.1,"end":154.65},"129":{"num":"129","start":154.75,"end":156.15},"130":{"num":"130","start":156.25,"end":157.55},"131":{"num":"131","start":157.55,"end":159.1},"132":{"num":"132","start":159.1,"end":160.65},"133":{"num":"133","start":160.75,"end":162.35},"134":{"num":"134","start":162.45,"end":163.85},"135":{"num":"135","start":163.95,"end":165.45},"136":{"num":"136","start":165.55,"end":167.1},"137":{"num":"137","start":167.2,"end":168.8},"138":{"num":"138","start":168.9,"end":170.5},"139":{"num":"139","start":170.5,"end":172.0},"140":{"num":"140","start":172.1,"end":173.35},"141":{"num":"141","start":173.35,"end":174.85},"142":{"num":"142","start":174.95,"end":176.5},"143":{"num":"143","start":176.6,"end":178.15},"144":{"num":"144","start":178.25,"end":179.75},"145":{"num":"145","start":179.75,"end":181.3},"146":{"num":"146","start":181.4,"end":183.2},"147":{"num":"147","start":183.2,"end":184.9},"148":{"num":"148","start":185,"end":186.6},"149":{"num":"149","start":186.7,"end":188.45},"150":{"num":"150","start":188.45,"end":189.85},"151":{"num":"151","start":189.95,"end":191.6},"152":{"num":"152","start":191.6,"end":193.25},"153":{"num":"153","start":193.35,"end":195},"154":{"num":"154","start":195.05,"end":196.7},"155":{"num":"155","start":196.73,"end":198.4},"156":{"num":"156","start":198.4,"end":200.1},"157":{"num":"157","start":200.1,"end":201.75},"158":{"num":"158","start":201.9,"end":203.5},"159":{"num":"159","start":203.6,"end":205.15},"160":{"num":"160","start":205.25,"end":206.8},"161":{"num":"161","start":206.8,"end":208.45},"162":{"num":"162","start":208.45,"end":210.0},"164":{"num":"164","start":210.1,"end":211.5},"165":{"num":"165","start":211.6,"end":213.2},"167":{"num":"167","start":213.2,"end":214.85},"168":{"num":"168","start":214.85,"end":216.5},"170":{"num":"170","start":216.5,"end":217.8},"171":{"num":"171","start":217.8,"end":219.4},"174":{"num":"174","start":219.4,"end":220.9},"177":{"num":"177","start":221.0,"end":222.8},"180":{"num":"180","start":222.9,"end":224.3},"0":{"num":"0","start":577.85,"end":578.5},"gameshot":{"num":"gameshot","start":578.7,"end":580.0}}';

    const arrscolia_eng = JSON.parse(scolia_eng);
    const arrscolia_ger = JSON.parse(scolia_ger);
    const audioObj_ger = new Audio('http://autodarts.x10.mx/scolia/x01_ger.mp3');
    const audioObj_eng = new Audio('http://autodarts.x10.mx/scolia/x01_eng.mp3');

    var playSegment = function playSegment(audioObj, start,stop ){
        let audioObjNew = audioObj.cloneNode(true); //this is to prevent "play() request was interrupted" error.
        audioObjNew.currentTime = start;
        audioObjNew.play();
        audioObjNew.int = setInterval(function() {
            if (audioObjNew.currentTime > stop) {
                audioObjNew.pause();
                clearInterval(audioObjNew.int);
            }
        }, 5);
    }



    function soundGo(file, audio, call){
        if (audio === 1){
            if ( file.includes("scolia_eng") && call != -1 && call != undefined) {
                if (call == 'gameshot and the match') { call = 'gameshot';}
                playSegment(audioObj_eng , arrscolia_eng[call]['start'] , arrscolia_eng[call]['end']);
            }

            else if (file.includes("scolia_ger") && call != -1 && call != undefined) {
                if (call == 'gameshot and the match') { call = 'gameshot';}
                playSegment(audioObj_ger , arrscolia_ger[call]['start'] , arrscolia_ger[call]['end']);
            }
            else {
                const audio = new Audio(file);
                audio.play();
            }
        }
    }

    $(document).ready(function(){

        // Check script for update
        (async () => {
            update = await GM.getValue('update');
            if( (Date.now()  - 86400000) > update ) {
                var myVersion = GM_info.script.version;
                GreasyFork.getScriptHistory('487034').then(data => {
                    var lastVersion = JSON.stringify( data[0]['version']).replace(/^["'](.+(?=["']$))["']$/, '$1');

                    console.log ('Caller-addon version: ', myVersion, myVersion === lastVersion);
                    if(myVersion != lastVersion) {
                        var url = "https://update.greasyfork.org/scripts/487034/Autodarts_Caller.user.js";
                        var tk = "There is a newer version of the script Autodarts-Caller! Get the update from version " +myVersion+ " -> "+lastVersion;
                        if (confirm(tk)) {
                            window.location.replace("https://greasyfork.org/de/scripts/487034-autodarts-caller");
                        }
                        else {
                            // Speichern
                            (async () => {
                                await GM.setValue('update', Date.now() );
                            })();
                        }
                        return false;
                    }

                })
            }
            else{
                console.log('Update wird erneut in '+  (86400000 - (Date.now()-update))   + ' erinnert!');
            }
        })();// asyn-end
        // Update end//



        var t1 = 0; var t2 = 0; var t3 = 0;
        var m1 = 0; var m2 = 0; var m3 = 0;
        var dotmp3 = '.mp3';
        var called =  0 ;
        var gameshot_status = 0;
        var busted = 0;
        var audio = 1;
        var firstgameoncall = 0;
        var score_is_edited = 0;

        $(document).on('change', '#caller', function(){

            caller = $("#caller").find(":selected").val();

            console.log('Neuer Caller gewählt: '+caller);
            // Speichern
            (async () => {
                await GM.setValue('caller', caller);

            })();


            if(caller == 'scolia_eng') {
                server = 'http://autodarts.x10.mx/';
                caller = 'scolia_eng';
                dotmp3 = '.mp3';
                $("#caller option[value='scolia_eng']").prop('selected', true);

            }
            if(caller == 'scolia_ger') {
                server = 'http://autodarts.x10.mx/';
                caller = 'scolia_ger';
                dotmp3 = '.mp3';
                $("#caller option[value='scolia_ger']").prop('selected', true);
            }

            if(caller == 'russ_bray') {
                server = 'http://autodarts.x10.mx/';
                caller = 'russ_bray';
                dotmp3 = '.mp3';
                $("#caller option[value='russ_bray']").prop('selected', true);

            }
            if(caller == 'georgeno') {
                server = 'http://autodarts.x10.mx/';
                caller = 'georgeno';
                dotmp3 = '.mp3';
                $("#caller option[value='georgeno']").prop('selected', true);

            }
            else if(caller == 'shorty') {
                server = 'http://autodarts.x10.mx/';
                caller = 'shorty';
                dotmp3 = '.mp3';
                $("#caller option[value='shorty']").prop('selected', true);

            }

            else if(caller == 'haulpinks') {
                server = 'http://autodarts.x10.mx/';
                caller = 'haulpinks';
                dotmp3 = '.mp3';
                $("#caller option[value='haulpinks']").prop('selected', true);
                console.log('haulpinks aktiv');
            }

            else if(caller == 'lothar') {
                server = 'http://autodarts.x10.mx/';
                caller = 'lothar';
                dotmp3 = '.mp3';
                $("#caller option[value='lothar']").prop('selected', true);
                console.log('lothar aktiv');
            }

            else if(caller == 'phil') {
                server = 'http://autodarts.x10.mx/';
                caller = 'lidarts';
                dotmp3 = '.mp3';
                $("#caller option[value='phil']").prop('selected', true);
                console.log('phil aktiv');
            }


            else if(caller == 'bayrisch') {
                server = 'http://autodarts.x10.mx/';
                caller = 'bayrisch';
                dotmp3 = '.mp3';
                $("#caller option[value='bayrisch']").prop('selected', true);
                console.log('bayrisch aktiv');
            }

            else if(caller == '1_male_eng') {
                server = 'http://autodarts.x10.mx/';
                caller = '1_male_eng';
                dotmp3 = '.mp3';
                $("#caller option[value='1_male_eng']").prop('selected', true);
                console.log('1_male_eng aktiv');

            }

            else if(caller == 'google_eng') {
                dotmp3 = '';
                language = 'en';
                //  server = 'http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl='+language+'&q=';
                server = 'https://autodarts.x10.mx/mp3_helper.php?language='+language+'&text=';
                caller = '';
                $("#caller option[value='google_eng']").prop('selected', true);
                console.log('eng aktiv');

            }

            else if(caller == 'google_de') {
                dotmp3 = '';
                language = 'de';
                //server = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl='+language+'&q=';
                server = 'https://autodarts.de.cool/mp3_helper.php?language='+language+'&text=';
                $("#caller option[value='google_de']").prop('selected', true);
                caller = '';
            }

            else  if(caller == 'google_fr') {
                dotmp3 = '';
                language = 'fr';
                server = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl='+language+'&q=';
                server = 'https://autodarts.de.cool/mp3_helper.php?language='+language+'&text=';
                caller = '';
                $("#caller option[value='google_fr']").prop('selected', true);
            }

            // neuen Caller einmal sprechen lassen

            soundGo(server+caller+'/game on'+dotmp3, audio, call); // Wert in Audio-Funktion übergeben

        })


        setInterval(function() {

            // If class exist (Header) -> init
            if($("#ad-ext-game-variant").length && $("#ad-ext-game-variant").text() === "X01"   ) { // neu 29.08.24 (Class of X01..)

                // // // // // // // // // // read + set last settings // // // // // // // //
                (async () => {

                    triplesound = await GM.getValue('triplesound');
                    caller      = await GM.getValue('caller');
                    boosound    = await GM.getValue('boosound');

                    $("#triplesound option[value='"+triplesound+"']").prop('selected', true);
                    $("#boosound option[value='"+boosound+"']").prop('selected', true);
                    $("#caller option[value='"+caller+"']").prop('selected', true);
                })();

                if (typeof triplesound == 'undefined'){
                    triplesound = '0';
                }

                if (typeof caller == 'undefined'){
                    caller = 'x';
                }

                if (typeof boosound == 'undefined'){
                    boosound = '0';
                }
                // // // // // // // // // // // // // // // // // //

                var x = $(".css-1tq00ko").text();
                var x0 = $(".ad-ext-turn-points").text(); // Score-Feld neu
                var x1 = $(".ad-ext-turn-throw:eq(0)").text(); // 1. Dart
                //    console.log(x1);
                var x2 = $(".ad-ext-turn-throw:eq(1)").text(); // 2. Dart
                var x3 = $(".ad-ext-turn-throw:eq(2)").text(); // 3. Dart

                var gameshot1 = $(".ad-ext-player-score").eq(0).text(); // Spieler 1
                var gameshot2 = $(".ad-ext-player-score").eq(1).text(); // Spieler 2
                var gameshot3 = $(".ad-ext-player-score").eq(2).text(); // Spieler 3
                var gameshot4 = $(".ad-ext-player-score").eq(3).text(); // Spieler 4
                var gameshot5 = $(".ad-ext-player-score").eq(4).text(); // Spieler 5
                var gameshot6 = $(".ad-ext-player-score").eq(5).text(); // Spieler 6


                //// Bust-Ausgabe ////
                if (x0 == 'BUST' && busted == 0) {
                    soundGo(server+caller+"/0"+dotmp3, audio, 0);
                    console.log(server+caller+"/0"+dotmp3);
                    busted = 1;
                }

                //// Gameshot-Ausgabe ////

                // Gameshot aktivieren
                $("button:contains('Undo'),button:contains('Next Leg'),button:contains('Finish'),button:contains('Start')").on( "click", function() {
                    gameshot_status = 0;

                })
                /// Gameshot ///
                if (   gameshot_status != 1
                    && caller != 'x'
                    && (gameshot1 == "0" || gameshot2 == "0" || gameshot3 == "0"|| gameshot4 == "0"|| gameshot5 == "0"|| gameshot6 == "0")   ){
                    gameshot_status = 1;

                    if( $("button:contains('Finish')").length ){
                        soundGo(server+caller+"/gameshot and the match"+dotmp3, audio, 'gameshot and the match');
                        soundGo(server+"/chase_the_sun/chase_the_sun.mp3", audio, 'chase_the_sun');

                    }
                    else {
                        console.log('Gameshot!');
                        soundGo(server+caller+"/gameshot"+dotmp3, audio, 'gameshot');
                    }

                }
                //// END Gameshot ////

                ///////////////////////////////////////////////// TRIPLE Beep ///////////////////////////
                if(triplesound == 1){

                    // Triple 1st dart
                    if (x1.includes("T") && t1 === 0 && $(".ad-ext-turn-throw:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0) {
                        t1 = 1;
                        soundGo( "https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);

                    }
                    // Triple 2st dart
                    else if(x2.includes("T") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo( "https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 3rd dart
                    else if(x3.includes("T") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo( "https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                }
                ///////////////////////////////////////////////// END TRIPLE CALLER ///////////////////////////


                ///////////////////////////////////////////////// TRIPLE CALLER Beep ///////////////////////////
                if(triplesound == 3) {
                    // Triple 20 1st dart
                    if ( x1.includes("T20") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 19 1st dart
                    else if ( x1.includes("T19") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 18 1st dart
                    else if ( x1.includes("T18") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 17 1st dart
                    if ( x1.includes("T17") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Bullseye 1st dart
                    if ( x1.includes("BULL") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }

                    /// 2. Dart
                    // Triple 20 1st dart
                    if ( x2.includes("T20") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 19 1st dart
                    else if ( x2.includes("T19") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 18 1st dart
                    else if ( x2.includes("T18") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 17 1st dart
                    if ( x2.includes("T17") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Bullseye 2nd dart
                    if ( x2.includes("BULL") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }


                    /// 3. Dart
                    // Triple 20 1st dart
                    if ( x3.includes("T20") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 19 1st dart
                    else if ( x3.includes("T19") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 18 1st dart
                    else if ( x3.includes("T18") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Triple 17 1st dart
                    else if ( x3.includes("T17") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }
                    // Bullseye 3rd dart
                    if ( x3.includes("BULL") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/triple_beep.mp3", audio, -1);
                    }


                }

                ///////////////////////////////////////////////// TRIPLE CALLER E-Dart Löwen///////////////////////////
                if(triplesound == 2) {
                    // Triple 20 1st dart
                    if ( x1.includes("T20") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple20_old.wav", audio, -1);
                    }
                    // Triple 19 1st dart
                    else if ( x1.includes("T19") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple19_old.wav", audio, -1);
                    }
                    // Triple 18 1st dart
                    else if ( x1.includes("T18") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple18_old.wav", audio, -1);
                    }
                    // Triple 17 1st dart
                    if ( x1.includes("T17") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple17_old.wav", audio, -1);
                    }
                    // Bullseye 1st dart
                    if ( x1.includes("BULL") && t1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t1 = 1;
                        soundGo("https://autodarts.x10.mx/triple/bullseye.mp3", audio, -1);
                    }

                    /// 2. Dart
                    // Triple 20 1st dart
                    if ( x2.includes("T20") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple20_old.wav", audio, -1);
                    }
                    // Triple 19 1st dart
                    else if ( x2.includes("T19") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple19_old.wav", audio, -1);
                    }
                    // Triple 18 1st dart
                    else if ( x2.includes("T18") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple18_old.wav", audio, -1);
                    }
                    // Triple 17 1st dart
                    if ( x2.includes("T17") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple17_old.wav", audio, -1);
                    }
                    // Bullseye 2nd dart
                    if ( x2.includes("BULL") && t2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t2 = 1;
                        soundGo("https://autodarts.x10.mx/triple/bullseye.mp3", audio, -1);
                    }


                    /// 3. Dart
                    // Triple 20 1st dart
                    if ( x3.includes("T20") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple20_old.wav", audio, -1);
                    }
                    // Triple 19 1st dart
                    else if ( x3.includes("T19") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple19_old.wav", audio, -1);
                    }
                    // Triple 18 1st dart
                    else if ( x3.includes("T18") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple18_old.wav", audio, -1);
                    }
                    // Triple 17 1st dart
                    else if ( x3.includes("T17") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/SoundHwTriple17_old.wav", audio, call);
                    }
                    // Bullseye 3rd dart
                    if ( x3.includes("BULL") && t3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0){
                        t3 = 1;
                        soundGo("https://autodarts.x10.mx/triple/bullseye.mp3", audio, -1);
                    }


                }


                ///////////////////////////////////////////////// Miss CALLER ///////////////////////////
                if(boosound == 1){

                    // miss 1st dart
                    if ( x1.includes("M") && m1 === 0 && $(".css-1p5spmi:eq(0)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0)

                    {  m1 = 1;
                     soundGo("https://autodarts.x10.mx/russ_bray/miss_1st_dart.mp3", audio, -1);
                    }
                    // miss 2st dart
                    else if ( x2.includes("M") && m2 === 0 && $(".css-1p5spmi:eq(1)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi' && called == 0)
                    {   m2 = 1;
                     soundGo("https://autodarts.x10.mx/russ_bray/miss_2nd_dart.mp3", audio, -1);
                    }

                    // miss 3rd dart
                    else if ( x3.includes("M") && m3 === 0 && $(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1fzu0fr' && called == 0)
                    {    m3 = 1;
                     soundGo("https://autodarts.x10.mx/russ_bray/miss_3rd_dart.mp3", audio, -1);
                    }
                }

                // Caller reset
                if( (x1 == '' || $(".css-1p5spmi:eq(2)").closest('div').attr('class') != 'ad-ext-turn-throw css-1p5spmi') && called == 1) {
                    called = 0; busted = 0;
                }


                // Korrektur nach Klick auf Ok -> Score auslesen und Caller erneut aktivieren (called=0)
                $("button:contains('Ok')").on( "click", function() {
                    called = 1;
                    setTimeout(function (){
                        var x0 = $(".css-1tq00ko:eq(0)").text(); // read new score with delay(wait for AD-Response)
                        score_is_edited = 1;
                    }, 1500);

                });

                // Caller if 3rd Dart has a score(class) and called == 0
                if( ($(".css-1p5spmi:eq(2)").closest('div').attr('class') == 'ad-ext-turn-throw css-1p5spmi'
                     && called == 0
                     && caller != 'x')
                   || score_is_edited == 1 ) {
                    called = 1;
                    score_is_edited = 0;
                    soundGo(server+caller+'/'+x0+dotmp3, audio, x0); // Wert in Audio-Funktion übergeben
                    t1 = 0; t2 = 0; t3 = 0; // reset/enable triple-sound
                    m1 = 0; m2 = 0; m3 = 0; // reset/enable miss-sound
                }


                // Sound-Option-Selects einfügen wenn noch nicht existiert
                if($("#caller").length == 0) {

                    //  var select = $.get("https://autodarts.x10.mx/menu/multiselect1.php");
                    var menuneu = ' ';

                    $(".css-1kxhnmo").after('<select id="caller" name="caller" class="css-bs3vp6" style="padding:5px 5px 5px 5px;"><option selected disabled style="background-color: #353d47">Caller</option><option value="x" style="background-color: #353d47">OFF</option><option value="1_male_eng" style="background-color: #353d47">Male eng</option><option value="scolia_eng" style="background-color: #353d47">Scolia english</option><option value="scolia_ger" style="background-color: #353d47">Scolia german</option><option value="russ_bray" style="background-color: #353d47">Russ B</option><option value="phil" style="background-color: #353d47">Phil</option><option value="georgeno" style="background-color: #353d47">George N</option><option value="shorty" style="background-color: #353d47">Shorty eng</option><option value="lothar" style="background-color: #353d47">Lothar german</option><option value="haulpinks" style="background-color: #353d47">Caller Paul eng</option><option value="bayrisch" style="background-color: #353d47">Bavarian male</option></select><select id="triplesound" name="triplesound" class="css-bs3vp6" style="padding:5px;"><option selected disabled style="background-color: #353d47">Triple-Sound</option><option value="0" style="background-color: #353d47">Beep off</option><option value="1" style="background-color: #353d47">Beep: all triple</option><option value="3" style="background-color: #353d47">Beep: 17-20</option><option value="2" style="background-color: #353d47">Löwen (Softtip)</option></select><select id="boosound" name="boosound" class="css-bs3vp6" style="padding:5px;"><option selected disabled style="background-color: #353d47">Boo-Sound</option><option value="1" style="background-color: #353d47">Boo ON</option><option value="0" style="background-color: #353d47">Boo OFF</option></select>'+menuneu);

                    //////  Triple-Select ehem css-1tw9fat

                    $(document).on('change', '#triplesound', function(){
                        triplesound = $("#triplesound").find(":selected").val();

                        // save triple-settings
                        (async () => {
                            await GM.setValue('triplesound', triplesound);
                        })();

                    })

                    // Boo-Select
                    //     $(".css-l32vgy").append('<select id="boosound" name="boosound" class="css-l32vgy" style="padding:5px;"><option selected disabled style="background-color: #353d47">Boo-Sound</option><option value="1" style="background-color: #353d47">Boo ON</option><option value="0" style="background-color: #353d47">Boo OFF</option></select>');

                    $(document).on('change', '#boosound', function(){
                        boosound = $("#boosound").find(":selected").val();
                        // save boo-settings
                        (async () => {
                            await GM.setValue('boosound', boosound);
                        })();
                    })

                } // end add dropdowns

            }
        }, 200);

    });

})();