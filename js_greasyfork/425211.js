// ==UserScript==
// @name         Оружейная комната на странице перса
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Создаёт простую оружейную комнату на странице персонажа. Цены на элементы берутся автоматически с рынка учитывая среднее значение между первыми 5 лотами. Также присутсвует общая информация по крафту. Если у вас медленный интернет подождите пару секунд перед тем как нажать "Показать оружейную", если инет тормозит то скрипт может не успеть прочесть цену элементов и будет показывать NaN.
// @author       You
// @match        https://www.heroeswm.ru/home.php
// @match        https://www.lordswm.com/home.php

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425211/%D0%9E%D1%80%D1%83%D0%B6%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BD%D0%B0%D1%82%D0%B0%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B5%20%D0%BF%D0%B5%D1%80%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/425211/%D0%9E%D1%80%D1%83%D0%B6%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BD%D0%B0%D1%82%D0%B0%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B5%20%D0%BF%D0%B5%D1%80%D1%81%D0%B0.meta.js
// ==/UserScript==

(function() {

    var timeDelay=100;
    'use strict';
    var styleSheet=`
.txt1{
width:700px;
height:615;
}
.divBox{
  border: 1px solid black;
  padding: 2px 4px;
  overflow-y: scroll;
  overflow-x: auto;
height:450px;
width:750px;
font-size:13px;
}
.divcraft{
margin-left:1px;
}
.button1{
margin-left:4px;
}
.divcraf1{
margin-right:}
.input{
width:25px;
}
.div1class{
    margin-left: 20px;
margin-bottom:1px;
font-size:15px;
}
//float:left;

.div2class{
float:left;
margin-left:10px;
font-size:15px;

}
.divcraft{
//float:right;

}
`;

    var s=document.createElement('Style');
    s.type="text/css";
    s.innerHTML=styleSheet;
    (document.head || document.documentElement).appendChild(s);
    var medie=[];
    function makeHttpObject() {
        try {return new XMLHttpRequest();}
        catch (error) {}
        try {return new ActiveXObject("Msxml2.XMLHTTP");}
        catch (error) {}
        try {return new ActiveXObject("Microsoft.XMLHTTP");}
        catch (error) {}

        throw new Error("Could not create HTTP request object.");
    }

    var doc = document.getElementsByClassName("wbwhite");
    let pp=doc[0];

    var link= ["https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=abrasive","https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=snake_poison","https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=tiger_tusk",
               "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=ice_crystal","https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=moon_stone","https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=fire_crystal","https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=meteorit",
               "https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=witch_flower","https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=wind_flower","https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=fern_flower","https://www.heroeswm.ru/auction.php?cat=elements&sort=0&art_type=badgrib"];
    var j;
    var request=[];
    request[0] = makeHttpObject();
    request[0].open("GET", link[0], true);
    request[0].send(null);
    request[0].onreadystatechange = function() {
        if (request[0].readyState == 4){
            var reg=request[0].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
            let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
            var zena;
            medie[0]=0;
            for(let i=0;i<5;i++){
                zena=String(zeni[i]).replace(",","");
                medie[0]+=parseInt(zena);
            }
            medie[0]/=5;
        }}

    setTimeout( function(){
        request[1] = makeHttpObject();
        request[1].open("GET", link[1], true);
        request[1].send(null);
        request[1].onreadystatechange = function() {
            if (request[1].readyState == 4){
                var reg1=request[1].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni1=String(reg1).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena1;
                medie[1]=0;
                for(let i=0;i<5;i++){
                    zena1=String(zeni1[i]).replace(",","");
                    medie[1]+=parseInt(zena1);
                }
                medie[1]/=5;
                j++;
            }}
    },1);
    setTimeout( function(){
        request[2] = makeHttpObject();
        request[2].open("GET", link[2], true);
        request[2].send(null);
        request[2].onreadystatechange = function() {
            if (request[2].readyState == 4){
                var reg=request[2].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[2]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[2]+=parseInt(zena);
                }
                medie[2]/=5;
            }}
    },1);
    setTimeout( function(){
        request[3] = makeHttpObject();
        request[3].open("GET", link[3], true);
        request[3].send(null);
        request[3].onreadystatechange = function() {
            if (request[3].readyState == 4){
                var reg=request[3].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[3]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[3]+=parseInt(zena);
                }
                medie[3]/=5;
            }}
    }, 1);
    setTimeout( function(){
        request[4] = makeHttpObject();
        request[4].open("GET", link[4], true);
        request[4].send(null);
        request[4].onreadystatechange = function() {
            if (request[4].readyState == 4){
                var reg=request[4].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[4]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[4]+=parseInt(zena);
                }
                medie[4]/=5;
            }}
    },1);
    setTimeout( function(){
        request[5] = makeHttpObject();
        request[5].open("GET", link[5], true);
        request[5].send(null);
        request[5].onreadystatechange = function() {
            if (request[5].readyState == 4){
                var reg=request[5].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[5]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[5]+=parseInt(zena);
                }
                medie[5]/=5;
            }}
    }, 1);
    setTimeout( function(){
        request[6] = makeHttpObject();
        request[6].open("GET", link[6], true);
        request[6].send(null);
        request[6].onreadystatechange = function() {
            if (request[6].readyState == 4){
                var reg=request[6].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[6]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[6]+=parseInt(zena);
                }
                medie[6]/=5;
            }}
    }, 1);
    setTimeout( function(){
        request[7] = makeHttpObject();
        request[7].open("GET", link[7], true);
        request[7].send(null);
        request[7].onreadystatechange = function() {
            if (request[7].readyState == 4){
                var reg=request[7].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[7]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[7]+=parseInt(zena);
                }
                medie[7]/=5;
            }}
    }, 1);
    setTimeout( function(){
        request[8] = makeHttpObject();
        request[8].open("GET", link[8], true);
        request[8].send(null);
        request[8].onreadystatechange = function() {
            if (request[8].readyState == 4){
                var reg=request[8].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[8]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[8]+=parseInt(zena);
                }
                medie[8]/=5;
            }}
    }, 1);
    setTimeout( function(){
        request[9] = makeHttpObject();
        request[9].open("GET", link[9], true);
        request[9].send(null);
        request[9].onreadystatechange = function() {
            if (request[9].readyState == 4){
                var reg=request[9].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[9]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[9]+=parseInt(zena);
                }
                medie[9]/=5;
            }}
    }, 1);
    setTimeout( function(){
        request[10] = makeHttpObject();
        request[10].open("GET", link[10], true);
        request[10].send(null);
        request[10].onreadystatechange = function() {
            if (request[10].readyState == 4){
                var reg=request[10].responseText.match('(?<=Время:\ Завершающиеся</option><option\ value=2\ >Время:\ Новые\ предложения</option><option\ value=3\ >Цена:\ По\ убыванию</option><option\ value=4\ \ selected\ >Цена:\ По\ возрастанию</option></select).*(?=</td></tr></table></td></tr></table></td></tr></table></center></div></BODY></HTML>)');
                let zeni=String(reg).match(/(?<=border=0\ title="Золото"\ alt=""\ \ class="rs"\ ><\/td><td>).*?(?=<\/td><\/tr><\/table><\/div><\/td><td>)/g);
                var zena;
                medie[10]=0;
                for(let i=0;i<5;i++){
                    zena=String(zeni[i]).replace(",","");
                    medie[10]+=parseInt(zena);
                }
                medie[10]/=5;
            }}
    }, 1);
    setTimeout(function(){
        var txt=document.createElement("textarea");
        txt.className="txt1";
        txt.value=`Оружие:
Для урона магией земли необходим осколок метеорита + ядовитый гриб;
Для урона магией огня необходим клык тигра + огненный кристалл;
Для урона магией воды необходим ледяной кристалл + змеиный яд;
Для урона магией воздуха необходим цветов ветров + цветок ведьм;
Для игнорирование защиты цели необходим лунный камень + абразив.
Броня:
Для защиты от магии земли необходим осколок метеорита;
Для защиты от магии огня необходим огненный кристалл;
Для защиты от магии воды необходим ледяной кристалл;
Для защиты от магии воздуха необходим цветок ветров;
Для защиты от физического урона необходим лунный камень + абразив.
Ювелирка:
Для увеличения урона магией природы необходим цветов ветров + клык тигра;
Для увеличения урона магией земли, пробивание воздуха необходим осколок метеорита + клык тигра;
Для увеличения урона магией воздуха, пробивание земли необходим цветов ветров + осколок метеорита;
Для увеличения урона магией воды, пробивание огня необходим ледяной кристалл + цветок ведьм;
Для увеличения крона магией огня, пробивание воды необходим огненный кристалл + абразив.

Для крафта необходимо по:
12% - 45 пар
11% - 37 пар
10% - 30 пар
9% - 24 пары
8% - 19 пар
7% - 15 пар
6% - 12 пар
5% - 9 пар
4% - 6 пар
3% - 4 пары
2% - 2 пары
1% - 1 пара
Кроме того необходимо:
1-й мод + 2 цветка папоротника
2-й мод + 4 цветка папоротника
3-й мод + 6 цветков папоротника
4-й мод + 8 цветков папоротника
5-й мод + 10 цветков папоротника
`;
        txt.style.display="none";
        var btntxt=document.createElement('button');
        pp.append(btntxt);
        btntxt.innerHTML="Показать инфу";
        btntxt.onclick=()=>{
            txt.style.display="block";
            btntxt.style.display="none";
            btntxt1.style.display="block";
        }
        var btntxt1=document.createElement('button');
        btntxt1.style.display="none";
        /////////////**********************************************************************************************************************************************
        var div=document.createElement("div");

        pp.append(btntxt1);
        btntxt1.innerHTML="Скрыть инфу";
        btntxt1.onclick=()=>{
            txt.style.display="none";
            btntxt1.style.display="none";
            btntxt.style.display="block";

        }
        pp.append(txt);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        var btndiv=document.createElement('button');
        pp.append(btndiv);
        btndiv.innerHTML="Показать оружейную";
        btndiv.onclick=()=>{
            var temp = document.createElement('textarea');
            temp.value=medie;
            //  pp.appendChild(temp);
            div.className="divBox";
            var div1=document.createElement("div1");
            div1.className="div1class";
            var div2=document.createElement("div");
            div2.className="div2class";
            let tn=document.createTextNode("Абразив: "+medie[0]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Змеиный яд: "+medie[1]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Клык тигра: "+medie[2]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Ледяной кристалл: "+medie[3]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Лунный камень: "+medie[4]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Огненный кристалл: "+medie[5]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Осколок метеорита: "+medie[6]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Цветок ведьм: "+medie[7]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Цветок ветров: "+medie[8]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Цветок папоротника: "+medie[9]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);
            tn=document.createTextNode("Ядовитый гриб: "+medie[10]);
            div2.appendChild(document.createElement("br"));
            div2.appendChild(tn);

            var weap12=0;
            weap12=(medie[0]+medie[1]+medie[2]+medie[3]+medie[4]+medie[5]+medie[6]+medie[7]+medie[8]+medie[10])*45+medie[9]*30;
            tn=document.createTextNode("Пушка 5*12: "+Math.round(weap12));
            div1.appendChild(document.createElement("br"));
            div1.appendChild(tn);
            var armor12=0;
            armor12=(medie[0]+medie[3]+medie[4]+medie[5]+medie[6]+medie[8])*45+medie[9]*30;
            tn=document.createTextNode("Броня 5*12: "+Math.round(armor12));
            div1.appendChild(document.createElement("br"));
            div1.appendChild(tn);
            var jew12=0;
            jew12=(medie[8]*2+medie[2]*2+medie[6]*2+medie[3]+medie[7]+medie[5]+medie[0])*45+medie[9]*30;
            tn=document.createTextNode("Ювелирка 5*12: "+Math.round(jew12));
            div1.appendChild(document.createElement("br"));
            div1.appendChild(tn);
            div.appendChild(div1);
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var myCheck=document.createElement("button");
            myCheck.innerHTML="Показать цены элементов";
            var myCheck1=document.createElement("button");
            myCheck1.innerHTML="Скрыть цены элементов";
            div.appendChild(document.createElement("br"));
            div2.style.display="none";
            div.appendChild(myCheck);
            div.appendChild(myCheck1);
            div.appendChild(div2);
            myCheck1.style.display="none";
            myCheck.onclick=()=>{
                div2.style.display = "block";
                myCheck1.style.display="block";
                myCheck.style.display="none";

            }
            myCheck1.onclick=()=>{
                div2.style.display = "none";
                myCheck.style.display="block";
                myCheck1.style.display="none";

            }
            div.appendChild(document.createElement("br"));
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var inputweapon1=document.createElement("input");
            var inputweapon2=document.createElement("input");
            var inputweapon3=document.createElement("input");
            var inputweapon4=document.createElement("input");
            var inputweapon5=document.createElement("input");
            var inputweapon6=document.createElement("input");
            var inputweapon7=document.createElement("input");
            inputweapon1.value=0; inputweapon2.value=0; inputweapon3.value=0; inputweapon4.value=0; inputweapon5.value=0; inputweapon6.value=0; inputweapon7.value=0;
            var inputarmor1=document.createElement("input");
            var inputarmor2=document.createElement("input");
            var inputarmor3=document.createElement("input");
            var inputarmor4=document.createElement("input");
            var inputarmor5=document.createElement("input");
            var inputarmor6=document.createElement("input");
            var inputarmor7=document.createElement("input");
            inputarmor1.value=0; inputarmor2.value=0; inputarmor3.value=0; inputarmor4.value=0; inputarmor5.value=0; inputarmor6.value=0; inputarmor7.value=0;

            var inputjew1=document.createElement("input");
            var inputjew2=document.createElement("input");
            var inputjew3=document.createElement("input");
            var inputjew4=document.createElement("input");
            var inputjew5=document.createElement("input");
            var inputjew6=document.createElement("input");
            var inputjew7=document.createElement("input");
            inputjew1.value=0; inputjew2.value=0; inputjew3.value=0; inputjew4.value=0; inputjew5.value=0; inputjew6.value=0; inputjew7.value=0;
            inputweapon1.className="input";
            inputweapon2.className="input";
            inputweapon3.className="input";
            inputweapon4.className="input";
            inputweapon5.className="input";
            inputweapon6.className="input";
            inputweapon7.className="input";

            inputarmor1.className="input";
            inputarmor2.className="input";
            inputarmor3.className="input";
            inputarmor4.className="input";
            inputarmor5.className="input";
            inputarmor6.className="input";
            inputarmor7.className="input";

            inputjew1.className="input";
            inputjew2.className="input";
            inputjew3.className="input";
            inputjew4.className="input";
            inputjew5.className="input";
            inputjew6.className="input";
            inputjew7.className="input";

            var tnweapon=document.createTextNode("Крафт Пушки: ");
            var tnarmor=document.createTextNode("Крафт Брони: ");
            var tnjew=document.createTextNode("Крафт Ювелирки: ");
            var divweapon=document.createElement("div");
            divweapon.nameClass="divcraf";
            var divarmor=document.createElement("div");
            divarmor.nameClass="divcraf";
            var divjew=document.createElement("div");
            divjew.nameClass="divcraf1";
            var divweapon1=document.createElement("div");
            divweapon1.nameClass="divcraft1";
            var divarmor1=document.createElement("div");
            divarmor1.nameClass="divcraft1";
            var divjew1=document.createElement("div");
            divjew1.nameClass="divcraft1";

            let btn1 = document.createElement("button");
            let btn2 = document.createElement("button");
            let btn3 = document.createElement("button");
            divweapon1.append(tnweapon);        divarmor1.append(tnarmor);      divjew1.append(tnjew);

            divweapon.append("I"); divweapon.append(inputweapon1);        divweapon.append("E"); divweapon.append(inputweapon2);        divweapon.append("A"); divweapon.append(inputweapon3);        divweapon.append("W"); divweapon.append(inputweapon4);        divweapon.append("F"); divweapon.append(inputweapon5);        divweapon.append(" Откат золота за 1 элемент: "); divweapon.append(inputweapon6); divweapon.append(" Откат пар: "); divweapon.append(inputweapon7);  divweapon.append(btn1);
            divarmor.append("D"); divarmor.append(inputarmor1);       divarmor.append("E"); divarmor.append(inputarmor2);       divarmor.append("A"); divarmor.append(inputarmor3);        divarmor.append("W"); divarmor.append(inputarmor4);        divarmor.append("F"); divarmor.append(inputarmor5);          divarmor.append(" Откат золота за 1 элемент: "); divarmor.append(inputarmor6); divarmor.append(" Откат пар: "); divarmor.append(inputarmor7); divarmor.append(btn2);
            divjew.append("N"); divjew.append(inputjew1);        divjew.append("E"); divjew.append(inputjew2);        divjew.append("A"); divjew.append(inputjew3);        divjew.append("W"); divjew.append(inputjew4);        divjew.append("F"); divjew.append(inputjew5);        divjew.append(" Откат золота за 1 элемент: "); divjew.append(inputjew6); divjew.append(" Откат пар: "); divjew.append(inputjew7); divjew.append(btn3);
            divweapon1.append(divweapon);        divarmor1.append(divarmor);      divjew1.append(divjew);
            var divcraft=document.createElement("div");
            divcraft.className="divcraft";
            divcraft.append(divweapon1);  divcraft.append(document.createElement("br"));       divcraft.append(divarmor1); divcraft.append(document.createElement("br"));       divcraft.append(divjew1);

            btn1.className="Button1";
            btn1.innerHTML="Посчитать";
            btn1.onclick=()=>{
                var res=calc(parseInt(inputweapon1.value),parseInt(inputweapon2.value),parseInt(inputweapon3.value),parseInt(inputweapon4.value),parseInt(inputweapon5.value),parseInt(inputweapon6.value),parseInt(inputweapon7.value),1);
                var div5=document.createElement("div");
                var temp6=document.createTextNode("Цена крафта пушки: "+Math.round(res.tot)+"; цена I"+inputweapon1.value+": "+Math.round(res.c1)+"; цена E"+inputweapon2.value+": "+Math.round(res.c2) +"; цена A"+inputweapon3.value+": "+Math.round(res.c3) +"; цена W"+inputweapon4.value+": "+Math.round(res.c4) +"; цена F"+inputweapon5.value+": "+Math.round(res.c5)+" (Откат: "+inputweapon6.value+" золота за каждый элемент и "+inputweapon7.value+" пар с каждого мода)");
                div.append(document.createElement("br"));
                div.append(temp6);
                pp.append(div);
            }
            btn2.className="Button1";
            btn2.innerHTML="Посчитать";
            btn2.onclick=()=>{
                var res=calc(parseInt(inputarmor1.value),parseInt(inputarmor2.value),parseInt(inputarmor3.value),parseInt(inputarmor4.value),parseInt(inputarmor5.value),parseInt(inputarmor6.value),parseInt(inputarmor7.value),2);
                var div5=document.createElement("div");
                var temp6=document.createTextNode("Цена крафта брони: "+Math.round(res.tot)+"; цена D"+inputarmor1.value+": "+Math.round(res.c1)+"; цена E"+inputarmor2.value+": "+Math.round(res.c2) +"; цена A"+inputarmor3.value+": "+Math.round(res.c3) +"; цена W"+inputarmor4.value+": "+Math.round(res.c4) +"; цена F"+inputarmor5.value+": "+Math.round(res.c5)+" (Откат: "+inputarmor6.value+" золота за каждый элемент и "+inputarmor7.value+" пар с каждого мода)");
                div.append(document.createElement("br"));
                div.append(temp6);
                pp.append(div);
            }
            btn3.className="Button1";
            btn3.innerHTML="Посчитать";
            btn3.onclick=()=>{
                var res=calc(parseInt(inputjew1.value),parseInt(inputjew2.value),parseInt(inputjew3.value),parseInt(inputjew4.value),parseInt(inputjew5.value),parseInt(inputjew6.value),parseInt(inputjew7.value),3);
                var div5=document.createElement("div");
                var temp6=document.createTextNode("Цена крафта ювы: "+Math.round(res.tot)+"; цена N"+inputjew1.value+": "+Math.round(res.c1)+"; цена E"+inputjew2.value+": "+Math.round(res.c2) +"; цена A"+inputjew3.value+": "+Math.round(res.c3) +"; цена W"+inputjew4.value+": "+Math.round(res.c4) +"; цена F"+inputjew5.value+": "+Math.round(res.c5)+" (Откат: "+inputjew6.value+" золота за каждый элемент и "+inputjew7.value+" пар с каждого мода)");
                div.append(document.createElement("br"));
                div.append(temp6);
                pp.append(div);
            }



            div.append(divcraft);
            pp.append(div);

            ////////////////////////////////////////////////////////////////
            div.style.display="block";
            btndiv.style.display="none";
            btndiv1.style.display="block";
        }
        var btndiv1=document.createElement('button');
        var btndiv2=document.createElement('button');
        pp.append(btndiv2);
        btndiv1.style.display="none";

        pp.append(btndiv1);
        btndiv1.innerHTML="Скрыть оружейную";
        btndiv1.onclick=()=>{
            div.style.display="none";
            btndiv1.style.display="none";
            btndiv2.style.display="block";

        }
        btndiv2.style.display="none";

        pp.append(btndiv1);
        btndiv2.innerHTML="Показать оружейную";
        btndiv2.onclick=()=>{
            div.style.display="block";
            btndiv1.style.display="block";
            btndiv2.style.display="none";

        }
        //   pp.append(div);
        //  div.style.display="none";
    },timeDelay);
    function calc(a,b,c,d,e,f,g,h) {
        var array=[0,1,2,4,6,9,12,15,19,24,30,37,45];
        var c1; var c2; var c3; var c4; var c5; var c6;
        var pap=5;
        var arrpap=[0,2,6,12,20,30];
        if(h==1){
            if(a==0) pap--; if(b==0) pap--; if(c==0) pap--; if(d==0) pap--; if(e==0) pap--;

            if(a!=0) c1=array[a]*(medie[0]+medie[4])-f*array[a]*2-g*(medie[0]+medie[4]); else c1=0;
            if(b!=0) c2=array[b]*(medie[6]+medie[10])-f*array[b]*2-g*(medie[6]+medie[10]); else c2=0;
            if(c!=0) c3=array[c]*(medie[8]+medie[7])-f*array[c]*2-g*(medie[8]+medie[7]); else c3=0;
            if(d!=0) c4=array[d]*(medie[3]+medie[1])-f*array[d]*2-g*(medie[3]+medie[1]); else c4=0;
            if(e!=0) c5=array[e]*(medie[2]+medie[5])-f*array[e]*2-g*(medie[2]+medie[5]); else c5=0;
            c6=arrpap[pap]*medie[9];
            return{
                'c1':c1,
                'c2':c2,
                'c3':c3,
                'c4':c4,
                'c5':c5,
                'tot':c1+c2+c3+c4+c5+c6
            }}
        if(h==2){
            if(a!=0) c1=array[a]*(medie[0]+medie[4])-f*array[a]*2-g*(medie[0]+medie[4]); else c1=0;
            if(b!=0) c2=array[b]*(medie[6])-f*array[b]-g*(medie[6]); else c2=0;
            if(c!=0) c3=array[c]*(medie[8])-f*array[c]-g*(medie[8]); else c3=0;
            if(d!=0) c4=array[d]*(medie[3])-f*array[d]-g*(medie[3]); else c4=0;
            if(e!=0) c5=array[e]*(medie[5])-f*array[e]-g*(medie[5]); else c5=0;
            if(a==0) pap--; if(b==0) pap--; if(c==0) pap--; if(d==0) pap--; if(e==0) pap--;
            c6=arrpap[pap]*medie[9];
            return{
                'c1':c1,
                'c2':c2,
                'c3':c3,
                'c4':c4,
                'c5':c5,
                'tot':c1+c2+c3+c4+c5+c6
            }
        }
        if(h==3){
            if(a!=0) c1=array[a]*(medie[8]+medie[2])-f*array[a]*2-g*(medie[8]+medie[2]); else c1=0;
            if(b!=0) c2=array[b]*(medie[6]+medie[2])-f*array[b]*2-g*(medie[6]+medie[2]); else c2=0;
            if(c!=0) c3=array[c]*(medie[6]+medie[8])-f*array[c]*2-g*(medie[6]+medie[8]); else c3=0;
            if(d!=0) c4=array[d]*(medie[3]+medie[7])-f*array[d]*2-g*(medie[3]+medie[7]); else c4=0;
            if(e!=0) c5=array[e]*(medie[5]+medie[0])-f*array[e]*2-g*(medie[5]+medie[0]); else c5=0;
            if(a==0) pap--; if(b==0) pap--; if(c==0) pap--; if(d==0) pap--; if(e==0) pap--;
            c6=arrpap[pap]*medie[9];

            return{
                'c1':c1,
                'c2':c2,
                'c3':c3,
                'c4':c4,
                'c5':c5,
                'tot':c1+c2+c3+c4+c5+c6
            }
        }
    }
})();