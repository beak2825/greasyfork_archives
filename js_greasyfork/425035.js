// ==UserScript==
// @name         ArtPrice from PfB(Цена арта)
// @version      0.2.1
// @description  Дает возможность посчитать цену арта зная цзб на странице арта
// @author       Super-Dragon
// @match        https://www.heroeswm.ru/art_info.php?*
// @match        https://www.lordswm.com/art_info.php?*
// @match        https://www.178.248.235.15/art_info.php?*
// @grant        none
// @namespace    Art

// @downloadURL https://update.greasyfork.org/scripts/425035/ArtPrice%20from%20PfB%28%D0%A6%D0%B5%D0%BD%D0%B0%20%D0%B0%D1%80%D1%82%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425035/ArtPrice%20from%20PfB%28%D0%A6%D0%B5%D0%BD%D0%B0%20%D0%B0%D1%80%D1%82%D0%B0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styleSheet=`
.Button1 {
background-color:"green";
padding:2px;
font-size:16px;
width:130px;
height:30px;
    margin-top: 3px;
    margin-bottom: 2px;
    margin-left: 20px;

}
.textArea1{
width:130px;
height:30px;
margin-left:0px;
    margin-top:1px;
}
.div1{
    margin-left: 20px;
margin-bottom:1px;
font-size:15px;
}
.div2{
margin-left:10px;
font-size:15px;

}
`;

    var s=document.createElement('Style');
    s.type="text/css";
    s.innerHTML=styleSheet;
    (document.head || document.documentElement).appendChild(s);

    var i;
    var proc1=80;
    var proc2=80;
    var rem;
    var stoim=50000;
    var battles=0;
    var percr=90;
    var percs=100;

    var doc = document.getElementsByClassName("wblight");
    let pp=doc[0];
    var text=doc[1].textContent;
    var ht=doc[1].outerHTML;
    var htt=ht.match('(?<=<b>\ Стоимость:</b>).*(?=<b>Описание:</b>)');
    ht=String(ht).replace(`${htt}`, '');
    ht=String(ht).replace(/,/g, '');

    let temp = document.createElement('textarea');
    temp.className="textArea1";

    let btn = document.createElement("button");
    btn.className="Button1";
    btn.innerHTML="Посчитать цену";
    btn.onclick=()=>{
        if(!parseInt(proc[1])) {proc[1]=proc[0];}
        var res=smith(parseInt(proc[0]),parseInt(proc[1]),parseInt(rem),parseInt(temp.value));
        //let temp1 = document.createElement('textarea');
        var div2=document.createElement("div");
        var spazio="\n";
        let temp3=document.createTextNode("Цена за бой: "+temp.value);
        let temp4=document.createTextNode("Цена арта: "+res.zena);
        let temp5=document.createTextNode("Боев: "+res.battles);
        let temp6=document.createTextNode("Оптимальная прочка: 0/"+res.proc2);

        div2.appendChild(temp3);
        div2.appendChild(document.createElement("br"));
        div2.appendChild(temp4);
        div2.appendChild(document.createElement("br"));
        div2.appendChild(temp5);
        div2.appendChild(document.createElement("br"));
        div2.appendChild(temp6);

        div2.className="div2";
        pp.appendChild(document.createElement("br"),btn);
        pp.appendChild(div2,btn);

    }
    pp.insertBefore(btn,pp.childNodes[0]);
    var newDiv = document.createElement("div");
    let temp2=document.createTextNode("Цена за бой:");
    newDiv.appendChild(temp2);
    newDiv.appendChild(temp);
    newDiv.className="div1";
    pp.insertBefore(newDiv,pp.childNodes[0]);

    var proc;
    proc=text.match('(?<=Прочность:\ ).*?(?=\ Очки\ амуниции:\ )');
    if(proc==null) {proc=text.match('(?<=Прочность:\ ).*(?=Модификаторы:)');}
    rem=String(ht).match('(?<=class="rs"></td><td>).*(?=</td></tr>)','g');
    proc=String(proc).match(/\d{1,5}/g);

    var regext='(?<=Стоимость\ ремонта:).*(?=")'
    var remm=text.match(regext);

    function smith(proc1,proc2,rem,stoim) {
        var zena=proc1*stoim;
        var tmpbattles=proc1;
        var zzb=rem/(Math.floor(proc2*percr/percs));
        battles=proc1;
        if(zzb>stoim){
            return {
                'zena': Math.round(zena*100)/100,
                'proc2': proc2,
                'battles': battles
            }
        }

        for (i = 100; i > 0; i--)
        {
            zzb=rem/(Math.floor(proc2*percr/percs));
            if(zzb>stoim){
                return {
                    'zena': Math.round(zena*100)/100,
                    'proc2': proc2,
                    'battles': battles
                }
            }
            battles=battles+Math.floor(proc2*percr/percs);
            zena=zena+Math.floor(proc2*percr/percs)*stoim-rem;
            proc2--;
        }
    }

})();