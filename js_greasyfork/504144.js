// ==UserScript==
// @name                speed bot 7.3
// @description         yo ye
// @version             7.3
// @author              Qwyua
// @match               *://gartic.io/*
// @match               *://cdn.blockaway.net/*
// @grant               GM_addStyle
// @grant               GM_openInTab
// @icon                https://i.hizliresim.com/mptijzd.png
// @namespace https://greasyfork.org/users/1306392
// @downloadURL https://update.greasyfork.org/scripts/504144/speed%20bot%2073.user.js
// @updateURL https://update.greasyfork.org/scripts/504144/speed%20bot%2073.meta.js
// ==/UserScript==

let adet="1";//açılacak proxy sayısını buradan ayarlayın ve 1-10 arsı değer verin

let site=location.href.toLowerCase();//bulunduğunuz sitenin urlsini işler



/*-IFRAME ALANI- */
let iframealan = document.createElement('div');// div elementi oluşturma
iframealan.innerHTML ='<div id="iframealan"></div>';//html değeri verildiği yer
setInterval(function() { //komutun kendini yenilemesini&tekrarlamasını sağlar
    if(document.title.indexOf("#") !== -1){ //eğer sayfa başlığında # varsa altta ki kodlar çalışır
        if(document.querySelector('#iframealan')==null){ //eğer iframealanı yoksa altta ki kodlar çalışır
            document.querySelector('div[class="scrollElements"]').appendChild(iframealan);//iframe alanını ekler
        }
    }

},100);//komutun hangi aralıklarla tekrarlanacağını belirleyen süre (1000[mili saniye]=1 saniye)
//ıframe alanı kicksiz botun eklendiği yer






if(site.indexOf('gartic.io')!=-1)//eğer bulunduğun sayfanın urlsinde gartic.io varsa alttaki kodlar çalışır
{

    /*BOTLARI KAPAT BUTONU*/
    var bot2close=document.createElement('button');// buton elementi oluşturma
    bot2close.innerHTML='<button class="btBlueBig" style="width:40px;left:126px;background-color:red;border:1px solid red;"></span><i class="gg-close-o" style="left:8px;"></i><strong></strong></button>'; //html değeri verildiği yer
    bot2close.setAttribute('id','bot2close');//id nin verildiği yer
    bot2close.setAttribute('style','position:absolute;z-index: 2;display:none');//butona style verildiği yer
    document.body.appendChild(bot2close);// butonu ekler
    document.getElementById("bot2close").addEventListener("click",iframeclose,false);// eğer tıklanırsa iframeclose u çalıştıracak
    function iframeclose(event)
    {
        document.querySelector('#bot2close').style='position:absolute;z-index: 2;display:none;';// bot2close id sine sahip elementin style ini değiştirir
        document.querySelector('#iframealan').innerHTML='';// iframealan id li yerin html ını değiştirir

    };




    /*İframe ekleyen(kicksiz bot) buton*/
    var bot2=document.createElement('button');// buton elementi oluşturma
    bot2.innerHTML='<button id="bot2" class="btBlueBig" style="left:64px;width:54px;"></span><i class="gg-user-add"></i><strong style="left:4px;">²</strong></button>';//butona html değeri verme
    bot2.setAttribute('style','position:absolute;z-index: 2;');// butona style verme
    document.body.appendChild(bot2); //butonu ekleme
    document.getElementById("bot2").addEventListener("click",addiframe,false);// tıklayınca addiframe i çalıştıracak





    /*iframe&kicksiz bot un eklendiği yer*/
    function addiframe(event)
    {
        document.querySelector('#bot2close').style='position:absolute;z-index: 2;display:block;';//botları kapat butonunu görünür hale getirir
        var iframebot=document.createElement('iframe');//iframe elementi oluşturur
        let ifrm="https://garticbot.tr.gg/?botfromextension="+window.location.href; // url sonuna oda kodunu verir
        iframebot.setAttribute('src',ifrm);// url yi iframe de açar
        iframebot.setAttribute('id','frame');// iframe ye id verir
        iframebot.setAttribute('style','z-index: 2;display:none;'); //iframe ye style verir
        document.querySelector('#iframealan').appendChild(iframebot) // iframe alanına ekler
    };




    /*Proxy i açan buton*/
    var bot=document.createElement('button');//buton elementi oluşturur
    bot.innerHTML='<button id="bot" class="btYellowBig" style="width:54px"></span><i class="gg-user-add"></i><strong></strong></button>';//html değeri verilir
    bot.setAttribute('style','position:absolute;z-index: 2;');// style verilir
    document.body.appendChild(bot);// butonu ekler
    document.getElementById("bot").addEventListener("click",openproxy,false);//butona tıklandığında openproxy i çalıştırır
    function openproxy(Event){
        let link="https://cdn.blockaway.net/_tr/?successMessage=WW91ciBhZHZlcnRpc2VtZW50IHN1YnNjcmlwdGlvbiBzdWNjZXNzZnVsbHkgY2FuY2VsbGVk&__cpLangSet=1/#"+window.location.href;
        for(let i =0;i<=adet;i++){
            GM_openInTab(link);}
    }
}



setInterval(function(){
    let linkyeri=document.querySelector('input[id="url"]');
    if(site.indexOf('cdn.blockaway.net')!=-1){
        if(linkyeri.value=="")
        {
            linkyeri.value="https://gartic.io/"+window.location.href.replace("https://cdn.blockaway.net/_tr/?successMessage=WW91ciBhZHZlcnRpc2VtZW50IHN1YnNjcmlwdGlvbiBzdWNjZXNzZnVsbHkgY2FuY2VsbGVk&__cpLangSet=1/#https://gartic.io/","");//link yerine değer verir
            document.querySelector('i[class="fa fa-arrow-right"]').dispatchEvent(new MouseEvent("click",{bubbles:true,button:0}//butona tıklatır
                                                                                               )
                                                                                )
        }
    }
},300)


GM_addStyle(`.gg-close-o{box-sizing: border-box;position:relative;display: block;transform:scale(var(--ggs,1));width: 22px;height:22px;border: 2px solid;border-radius:40px}.gg-close-o::after,.gg-close-o::before{content:"";display:block;box-sizing: border-box;position:absolute;width:12px;height:2px;background:currentColor;transform:rotate(45deg);border-radius:5px;top: 8px;left: 3px}.gg-close-o::after{transform: rotate(-45deg)}.gg-user-add{display:block;transform:scale(var(--ggs,1));box-sizing:border-box;width:20px;height:18px;background:linear-gradient(to left,currentColor 8px,transparent 0)no-repeat 14px 6px/6px 2px,linear-gradient(to left,currentColor 8px,transparent 0)no-repeat 16px 4px/2px 6px}.gg-user-add::after,.gg-user-add::before{content:"";display:block;box-sizing:border-box;position:absolute;border:2px solid}.gg-user-add::before{width:8px;height:8px;border-radius:30px;top:0;left:20px}.gg-user-add::after{left:18px;width:12px;height:9px;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px;top:9px}`);



//end