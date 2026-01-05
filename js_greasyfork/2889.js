// ==UserScript==
// @name        aljezur
// @namespace   petzworld.com
// @include     http://*aljezur.olx.pt/*
// @version     1.1
// @grant       none
// @description para fazer coisas em tuga
// @downloadURL https://update.greasyfork.org/scripts/2889/aljezur.user.js
// @updateURL https://update.greasyfork.org/scripts/2889/aljezur.meta.js
// ==/UserScript==

document.getElementById("create_adv_text").innerHTML="PPetz Rulazzz";

var count=30;
var counter;

var urlsToLoad  = [
    'http://aljezur.olx.pt/lucky-dave-cao-para-adopcao-na-aeza-iid-456596095',
    'http://aljezur.olx.pt/sorte-cao-para-adopcao-na-aeza-iid-456596873',
    'http://aljezur.olx.pt/dina-gata-para-adopcao-na-aeza-iid-456597829',
    'http://aljezur.olx.pt/lina-cadela-para-adopcao-na-aeza-iid-456595975',
    'http://aljezur.olx.pt/patch-cao-para-adopcao-na-aeza-iid-456596651',
    'http://aljezur-aljezur.olx.pt/basil-cao-para-adopcao-na-aeza-iid-456594869',
    'http://aljezur.olx.pt/bonnie-cadela-para-adopcao-na-aeza-iid-456595077',
    'http://aljezur.olx.pt/kobee-cao-para-adopcao-na-aeza-iid-456595867',
    'http://aljezur.olx.pt/rocky-cao-para-adopcao-na-aeza-iid-456596781',
    'http://aljezur.olx.pt/bica-gata-para-adopcao-na-aeza-iid-456597089',
    'http://aljezur.olx.pt/charly-cao-para-adopcao-na-aeza-iid-456595213',
    'http://aljezur.olx.pt/lucky-cao-para-adopcao-na-aeza-iid-456596041',
    'http://aljezur.olx.pt/nilo-cao-para-adopcao-na-aeza-iid-456596519',
    'http://aljezur.olx.pt/rita-gata-para-adopcao-na-aeza-iid-456597687',
    'http://aljezur.olx.pt/marley-cao-para-adopcao-na-aeza-iid-456596229',
    'http://aljezur.olx.pt/edgar-cao-para-adopcao-na-aeza-iid-456595317',
    'http://aljezur.olx.pt/luke-cao-para-adopcao-na-aeza-iid-456596155',
    'http://aljezur.olx.pt/chico-cao-para-adopcao-na-aeza-iid-456595269',
    'http://aljezur.olx.pt/lassie-cadela-para-adopcao-na-aeza-iid-456595927',
    'http://aljezur.olx.pt/paco-cao-para-adopcao-na-aeza-iid-456596569',
    'http://aljezur.olx.pt/gracioso-cao-para-adopcao-na-aeza-iid-456595555',
    'http://aljezur.olx.pt/mina-cadela-para-adopcao-na-aeza-iid-456596377',
    'http://aljezur.olx.pt/robby-cao-para-adopcao-na-aeza-iid-456596741',
    'http://aljezur.olx.pt/tess-cadela-para-adopcao-na-aeza-iid-456596909',
    'http://aljezur.olx.pt/gata-para-adopa-a-o-na-aeza-iid-456597867',
    'http://aljezur.olx.pt/ash-cao-para-adopcao-na-aeza-iid-456614823',
    'http://aljezur.olx.pt/muschy-gata-para-adopcao-na-aeza-iid-456683099',
    'http://aljezur.olx.pt/toms-gato-para-adopcao-na-aeza-iid-456683283',
    'http://aljezur.olx.pt/joya-cadela-para-adopcao-na-aeza-iid-456595779',
    'http://aljezur.olx.pt/moritz-cao-para-adopcao-na-aeza-iid-456596419',
    'http://aljezur.olx.pt/romulo-cao-para-adopcao-na-aeza-iid-456596821',
    'http://aljezur.olx.pt/angel-gata-para-adopcao-na-aeza-iid-456683197',
    'http://aljezur.olx.pt/gemma-cadela-para-adopcao-na-aeza-iid-456595487',
    'http://aljezur.olx.pt/blondie-cadela-para-adopcao-na-aeza-iid-456594999',
    'http://aljezur.olx.pt/gina-gata-para-adopcao-aeza-iid-457175859',
    'http://aljezur.olx.pt/felix-gato-para-adopcao-na-aeza-iid-456597781',
    'http://aljezur.olx.pt/tita-cadela-para-adopcao-na-aeza-iid-456596985',
    'http://aljezur.olx.pt/tikka-cadela-para-adopcao-na-aeza-iid-456596943',
    'http://aljezur.olx.pt/pasanda-cadela-para-adopcao-na-aeza-iid-456596607',
    'http://aljezur.olx.pt/nettie-cadela-para-adopcao-na-aeza-iid-456596463',
    'http://aljezur.olx.pt/mimi-cadela-para-adopcao-na-aeza-iid-456596325',
    'http://aljezur.olx.pt/elliot-cao-para-adopcao-na-aeza-iid-456595363',
    'http://aljezur.olx.pt/bramble-cadela-para-adopcao-na-aeza-iid-456595143',
    'http://aljezur.olx.pt/splodge-gato-para-adopcao-na-aeza-iid-456597747',
    'http://aljezur.olx.pt/milu-cadela-para-adopcao-na-aeza-iid-456596273',
    'http://aljezur.olx.pt/sweetie-gata-para-adopcao-na-aeza-iid-456683737',
    'http://aljezur.olx.pt/joi-cao-para-adopcao-na-aeza-iid-456595717'
];

function inicia(){
    setTimeout(FireTimer,1000);
}

window.addEventListener ("load", inicia, false);

window.addEventListener ("hashchange", inicia,  false);

function timerClick(){
    count=count-1;
    
    if (count < 0){
        clearInterval(counter);
        return;
    }
    
    document.getElementById("create_adv_text").innerHTML="Click: "+count + " segundos";
}

function timerNext(){
    count=count-1;
    
    if (count < 0){
        clearInterval(counter);
        return;
    }
    
    document.getElementById("create_adv_text").innerHTML="Next: "+count + " segundos";
}

function Tempo(sec,op){
    count=sec;
    if(op == 1){
        counter=setInterval(timerClick, 1000);
    }else{
        counter=setInterval(timerNext, 1000);
    }
}

function FireTimer () {
    var x=document.getElementsByTagName('b').length;
    
    if(x == 13 || x==14){
        Tempo(1,1);
        setTimeout(GotoClica, 500);
    }
    
    var str = location.href;
    
    var nres = str.search("vt=1");
    
    while(nres != -1){
        str = str.replace("/?vt=1","");
        str = str.replace("?vt=1","");
        nres = str.search("vt=1");
    }
    
    
    var numUrls     = urlsToLoad.length;
    var urlIdx      = urlsToLoad.indexOf (str)+1;
    
    
    document.getElementById("reply_form_btn").innerHTML=urlIdx+"/"+numUrls+" patudos "+x;
    
    
    if(str=='http://aljezur.olx.pt/joi-cao-para-adopcao-na-aeza-iid-456595717'){
        Tempo(3600);
        setTimeout (GotoNextURL, 3600000); // 5000 == 5 seconds
    }else{
        if(x == 21 || x == 22){
            if(urlIdx%2 == 0){
                Tempo(2,2);
                setTimeout (GotoNextURL, 1600); // 5000 == 5 seconds
            }else{
                Tempo(3,2);
                setTimeout (GotoNextURL, 2700); // 5000 == 5 seconds
            }
        }
    }
}

function GotoClica () {    
    if(document.getElementById("dogs_button")){
        document.getElementById("dogs_button").click();
    }
    
    if(document.getElementById("cats_button")){
        document.getElementById("cats_button").click();
    }
}

function GotoNextURL () {
    var numUrls     = urlsToLoad.length;
    
    
    var str = location.href;
    
    var nres = str.search("vt=1");
    
    while(nres != -1){
        str = str.replace("/?vt=1","");
        str = str.replace("?vt=1","");
        nres = str.search("vt=1");
    }
    
    
    var urlIdx      = urlsToLoad.indexOf (str);
    urlIdx++;
    if (urlIdx >= numUrls)
        urlIdx = 0;
    
    //var urlIdx = Math.floor((Math.random() * numUrls));
    
    
    location.href   = urlsToLoad[urlIdx];
}