// ==UserScript==
// @name         high pena CSS for smartphone(CSS built-in)
// @namespace    http://tampermonkey.net/
// @version      0.023
// @description  high pena 2 スマホ用のCSSです。不具合があるかもしれないので自己責任で使ってください。Android版FirefoxにアドオンTampermonkeyで動作確認。iOSは不明。
// @author       ankoiri
// @match     http://yaranaika.s64.coreserver.jp/highpena2/*
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/38419/high%20pena%20CSS%20for%20smartphone%28CSS%20built-in%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38419/high%20pena%20CSS%20for%20smartphone%28CSS%20built-in%29.meta.js
// ==/UserScript==


(function() {



    var url = location.href;

    //ラッパーのtable width 変更
    var xpath = document.evaluate("/html/body/table" , document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    var xpath_obj = xpath.singleNodeValue;
    xpath_obj.width = "99%";

    //野手・投手のテーブル横スクロール用
    var table_width = parseInt(window.innerWidth *0.90);
    //console.log("screen.width:" + table_width);



   var linkobj = document.getElementsByTagName('link')[0];
    //console.log("linkobj:" + linkobj);
    //linkobj.parentNode.removeChild(linkobj);


    var head ;
    var link , link2;

    head  = document.getElementsByTagName('head')[0];
    //console.log("head:"+head);
    if( ! head ) return ;

    //viewport980に固定

    var viewport_meta;

    viewport_meta = document.createElement('meta') ;
    viewport_meta.name = 'viewport';
    viewport_meta.content = 'width=980';
    head.appendChild(viewport_meta) ;

    //CSS追加
    link  = document.createElement('link') ;
    link.typ  = 'text/css' ;
    link.rel  = 'stylesheet' ;
    head.appendChild(link) ;

    //link2  = document.createElement('link') ;
    //link2.typ  = 'text/css' ;
    //link2.rel  = 'stylesheet' ;
    //link2.href = drawer;

    //head.appendChild(link2) ;








    //トップ画面
    xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[2]/tbody/tr/td[3]/input[3]" , document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    xpath_obj = xpath.singleNodeValue;
    //console.log("type=" + xpath_obj.value);

    //トップ画面(オフシーズン 日本シリーズ の場合)
    xpath4 = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[4]/tbody/tr[1]/td/table/tbody/tr/td/table/tbody/tr/td[2]/font/font/b" , document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    xpath_obj4 = xpath4.singleNodeValue;

    //console.log("type=" + xpath_obj.value);


    //能力アップ画面 意識設定画面
    xpath2 = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[4]/tbody/tr/td/h3" , document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    xpath_obj2 = xpath2.singleNodeValue;
    //console.log("xpath_obj2.innerHTML:" + xpath_obj2.innerHTML);


    //ログイン画面
    xpath3 = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[5]/tbody/tr/td/table/tbody/tr/td[2]/table[2]/tbody/tr[1]/td[1]" , document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    xpath_obj3 = xpath3.singleNodeValue;
    //console.log("xpath_obj3.innerHTML:" + xpath_obj3.innerHTML);

    //公式記録とタイトル
    xpath5 = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[4]/tbody/tr/td/h3" , document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    xpath_obj5 = xpath5.singleNodeValue;
    //console.log("xpath_obj3.innerHTML:" + xpath_obj3.innerHTML);


    //練習成果
    xpath6 = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[4]/tbody/tr/td/h4" , document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    xpath_obj6 = xpath6.singleNodeValue;
    //console.log("xpath_obj3.innerHTML:" + xpath_obj3.innerHTML);




    var flag = 0;
    var syurui = "default";

    //記録
    if(xpath_obj5 && xpath_obj5.innerHTML.match(/公式記録とタイトル/)){

        //console.log( "URL:" + location.href);
        //link.href = record;
        syurui = "record";

    //球団偵察モード
    }else if(xpath_obj6 && xpath_obj6.innerHTML.match(/練習成果/)){

        //console.log( "URL:" + location.href);
        //link.href = training;
        syurui = "training";

    //球団偵察モード
    }else if(location.href.match(/mode=team&team_id/)){

        //console.log( "URL:" + location.href);
        //link.href = team_mode;
        syurui = "team_mode";
        flag = 7;

    }else if(xpath_obj4 && xpath_obj4.innerHTML.match(/日本シリーズ/) && xpath_obj && xpath_obj.value == "ログイン"){
        //console.log("ホーム画面(日本シリーズ)");

        //link.href = home_nihon;
        syurui = "home_nihon";

        flag = 4;

        //ホーム画面(オフシーズン 新規登録リンク有り)
    }else if(xpath_obj4 && xpath_obj4.innerHTML.match(/オフシーズン/) && xpath_obj && xpath_obj.value == "ログイン"){
        //console.log("ホーム画面(オフシーズン)");

        //link.href = home_off;
        syurui = "home_off";
        flag = 5;

        //ホーム画面(オフ・日シリ以外)
    }else if (xpath_obj && xpath_obj.value == "ログイン" ){

        //link.href = home_on;
        syurui = "home_on";
        flag = 1;

        //能力アップ結果画面
    }else if(xpath_obj2 && xpath_obj2.innerHTML.match(/能力アップ結果/)){
        console.log("能力アップ結果画面1");
        //link.href = skill2;
        syurui = "skill2";
        flag = 0;

        //能力アップ画面
    }else if(xpath_obj2 && xpath_obj2.innerHTML.match(/能力アップ/)){
        console.log("能力アップ画面1");
        //link.href = skill;
        syurui = "skill";
        flag = 2;

    //意識設定画面
    }else if(xpath_obj2 && xpath_obj2.innerHTML.match(/意識設定/)){
        console.log("意識設定画面1");
        //link.href = consciousness;
        syurui = "consciousness";
        flag = 6;

        //ログイン画面
    }else if(xpath_obj3 && xpath_obj3.innerHTML.match(/ドラフト指名/)){
        console.log("ログイン画面");

        //link.href = login;
        syurui = "login";
        flag = 3;
      /*
    }else if(location.href.match(/rule.html/)){
        console.log(location.href);
        //link.href = rule;
        syurui = "rule";
      */

    }else{

        //link.href = defaultcss;


    }

    console.log("flag:" + flag);









    //ドロワー追加用
    var div_element = document.createElement("div");
    div_element.classList.add("header_wrapper");

    //オフシーズンの場合、新規登録を追加する
    if(flag === 5){
        div_element.innerHTML = '<div class="header"><div class="nav-drawer"><input id="nav-input" type="checkbox" class="nav-unshown"><label id="nav-open" for="nav-input"><span></span></label><label class="nav-unshown" id="nav-close" for="nav-input"></label><div id="nav-content">' +
        '<ul>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi">ホーム</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=ranking">ランキング</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=record">記録</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=calendar">日程</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/rule.html">あそびかた</a></li>' +
        '<li><a href="http://jbbs.livedoor.jp/game/44608/">掲示板</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=draft">ドラフト</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=entry">新規登録</a></li>' +
        '</ul></div></div><DIV STYLE="font-size:60px;font-weight:900; color:#DC143C; margin-top:-70pt; margin-left:170pt">2</DIV><DIV STYLE="font-size:40px; font-weight:600; color:000000;margin-top:-45pt;margin-left:115pt">high pena</DIV></div>';

        //document.body.appendChild(div_element);
        //console.log(div_element.innerHTML);
    }else{


        div_element.innerHTML = '<div class="header"><div class="nav-drawer"><input id="nav-input" type="checkbox" class="nav-unshown"><label id="nav-open" for="nav-input"><span></span></label><label class="nav-unshown" id="nav-close" for="nav-input"></label><div id="nav-content">' +
        '<ul>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi">ホーム</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=ranking">ランキング</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=record">記録</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=calendar">日程</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/rule.html">あそびかた</a></li>' +
        '<li><a href="http://jbbs.livedoor.jp/game/44608/">掲示板</a></li>' +
        '<li><a href="http://yaranaika.s64.coreserver.jp/highpena2/index.cgi?mode=draft">ドラフト</a></li>' +
        '</ul></div></div><DIV STYLE="font-size:60px;font-weight:900; color:#DC143C; margin-top:-70pt; margin-left:170pt">2</DIV><DIV STYLE="font-size:40px; font-weight:600; color:000000;margin-top:-45pt;margin-left:115pt">high pena</DIV></div>';

        //document.body.appendChild(div_element);
        //console.log(div_element.innerHTML);

    }

        //一番上に追加する
        var parentObject = document.getElementsByTagName("body")[0];
        parentObject.insertBefore(div_element,parentObject.firstChild);


    //-----------------------------------









    // ログイン後の画面
    if(flag === 3 ){





        //投手　折りたたむ
        xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[5]/tbody/tr/td/form/form/table[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        //console.log("xpathtousyu:" + xpath.singleNodeValue);
        xpath_obj = xpath.singleNodeValue;

        xpath_obj.outerHTML = "<div onclick=\"obj=document.getElementById('open2').style; obj.display=(obj.display=='none')?'block':'none';\"><a style=\"font-size:30px;cursor:pointer;text-decoration: underline;\">▼タップで表示</a></div><div id=\"open2\" style=\"display:none;clear:both;\"><div style=\"\width:" + table_width + "px; overflow-x:scroll;\">" + xpath_obj.outerHTML + "</div></div><br>";


        //野手　折りたたむ
        xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[5]/tbody/tr/td/form/table[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        //console.log("xpathyasyu:" + xpath.singleNodeValue);
        xpath_obj = xpath.singleNodeValue;

        //var temp = "<thread>" + xpath_obj.innerHTML;
        //xpath_obj.innerHTML = temp;
        xpath_obj.outerHTML = "<div onclick=\"obj=document.getElementById('open1').style; obj.display=(obj.display=='none')?'block':'none';\"><a style=\"font-size:30px;cursor:pointer;text-decoration: underline;\">▼タップで表示</a></div><div id=\"open1\" style=\"display:none;clear:both;\"><div style=\"width:" + table_width + "px; overflow-x:scroll;\">" + xpath_obj.outerHTML + "</div></div><br>";

        //console.log("xpath_obj:" + xpath_obj.innerHTML);

        //チーム方針変更　折りたたむ
        xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[5]/tbody/tr/td/table/tbody/tr/td[1]/table[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        //console.log("xpathhoushin:" + xpath.singleNodeValue);
        xpath_obj = xpath.singleNodeValue;

        xpath_obj.outerHTML = "<div onclick=\"obj=document.getElementById('open3').style; obj.display=(obj.display=='none')?'block':'none';\"><a style=\"font-size:30px;cursor:pointer;text-decoration: underline;\">▼チーム方針変更 表示</a></div><div id=\"open3\" style=\"display:none;clear:both;\">" + xpath_obj.outerHTML + "</div><br>";

        //野手ポジション・打順変更ボタン 左寄せ
        xpath = document.evaluate("//*[@id=\"open1\"]/div/table/tbody/tr/td/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        xpath_obj = xpath.singleNodeValue;
        xpath_obj.align = "left";


        //投手起用順変更ボタン 左寄せ
        xpath = document.evaluate("//*[@id=\"open2\"]/div/table/tbody/tr/td/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        xpath_obj = xpath.singleNodeValue;
        xpath_obj.align = "left";

        // 契約更改～設定 再設計
        xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[5]/tbody/tr/td/form/form/table[1]/tbody/tr/td[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        //console.log("xpathhoushin:" + xpath.singleNodeValue);
        xpath_obj = xpath.singleNodeValue;


        var menu2 = ["","","","","","","","","","","","","",""];

        var arr = xpath_obj.innerHTML.split(/></g);
        var k=-1;

        //add the brackets back in
        for(var i = 0; i < arr.length; i++){


            if(i == 0){
                arr[i] =  arr[i] + '>';
            }else if(i == arr.length -1){
                arr[i] =  '<'  + arr[i];
            }else{
                arr[i] = '<' + arr[i] + '>';

            }


            //console.log("arr[" + i + "]:" + arr[i]);
            if(arr[i].match(/<h4/) || arr[i].match(/<table/) ){
                //console.log("next:" + k);
                k++;
            }

            if(!(arr[i].match(/<table/) || arr[i].match(/<\/table/) || arr[i].match(/<tbody/) || arr[i].match(/<\/tbody/) || arr[i].match(/<tr/) || arr[i].match(/<\/tr/) || arr[i].match(/<td/) || arr[i].match(/<\/td/)  || arr[i].match(/<form/) || arr[i].match(/<\/form/)  )){
                menu2[k] += arr[i];

            }

        }
        var table_str ="<table>";

        for(i=0;i<k+1;i++){
            //console.log("menu2[" + i + "]:" + menu2[i]);




            if(menu2[i].match(/<h4/)){
                table_str = table_str + "</tr><tr>";
                //console.log("tr:" + i);
            }

            table_str = table_str + "<td><form action='index.cgi' method='post'>" +  menu2[i] + "</td></form>";


        }
        table_str = table_str + "</table>";

        //console.log("table_str:" + table_str);

        xpath_obj.innerHTML = table_str;











        //画面更新ボタン 左寄せ
        /*
        xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[5]/tbody/tr/td/form/form/table[1]/tbody/tr/td[1]/form/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        xpath_obj = xpath.singleNodeValue;
        xpath_obj.align = "left";
        */


    }

    if(flag === 2) {
        //能力　ポイントテーブル tr入れ替え


        xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[4]/tbody/tr/td/table/tbody/tr[2]/td[1]/form/table", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var table = xpath.singleNodeValue;



        //console.log("row1:" + table.innerHTML);

        var point_cell = [];

        for(j=0;j<10;j++){

            //console.log("table.rows[" + j + "].innerHTML" +  table.rows[j].cells[0].innerHTML);
            point_cell[j] = table.rows[j].cells[0].innerHTML;
        }

        table.innerHTML = "";

        // 行要素を追加
        var tr0 = table.insertRow(-1);
        var tr1 = table.insertRow(-1);

        var td = [];



        //table.innerHTML = "";

        for(j=0;j<10;j=j+2){

            td[j] = tr0.insertCell(-1);
            td[j].innerHTML = point_cell[j];
            td[j+1] = tr1.insertCell(-1);
            td[j+1].innerHTML = point_cell[j+1];

        }
        //console.log("aa" + newtable.innerHTML);






    }



    // 他球団偵察モードの画面

    if(flag === 7 ){

        console.log("table_width:" + table_width);

        //投手　テーブルスクロール
        xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[4]/tbody/tr/td/table[3]/tbody/tr/td/table", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        //console.log("xpathtousyu:" + xpath.singleNodeValue);
        xpath_obj = xpath.singleNodeValue;

        xpath_obj.outerHTML = "<div style=\"\width:" + table_width + "px; overflow-x:scroll; padding-bottom:30px;\">" + xpath_obj.outerHTML + "</div>";


        //野手　テーブルスクロール
        xpath = document.evaluate("/html/body/table/tbody/tr[1]/td[2]/table[4]/tbody/tr/td/table[2]/tbody/tr/td/table", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        //console.log("xpathyasyu:" + xpath.singleNodeValue);
        xpath_obj = xpath.singleNodeValue;

        //var temp = "<thread>" + xpath_obj.innerHTML;
        //xpath_obj.innerHTML = temp;
        xpath_obj.outerHTML = "<div style=\"width:" + table_width + "px; overflow-x:scroll; padding-bottom:30px;\">" + xpath_obj.outerHTML + "</div><br>";

        //console.log("xpath_obj:" + xpath_obj.innerHTML);


    }

    /* --------------------------------------------------------------------------------------------------- */
    /* headにCSS 追加 */
    //headにドロワーCSS追加
    xpath = document.evaluate("/html/head" , document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    xpath_obj = xpath.singleNodeValue;
    xpath_obj.innerHTML = xpath_obj.innerHTML  + "<style>" + loadCSS("drawer") + "</style>";


    //ページに対応したcss追加
    xpath_obj.innerHTML = xpath_obj.innerHTML  + "<style>" + loadCSS(syurui) + "</style>";

    console.log("syurui = " + syurui);


    /* --------------------------------------------------------------------------------------------------- */












/* CSS 関数 本体 */
    function loadCSS(syurui){

        var txt;


        if(syurui == "drawer"){
            txt = (function(param) {return param[0].replace(/\n|\r/g, "");})`

/* ヘッダーの分、上に余白 */
body > table {

padding-top: 100px;

}

.header_wrapper {

width: 100%;
position: relative;
z-index: 98;

}

/*ヘッダーまわりはご自由に*/
.header {

//background-color: #0066FF;
height: 95px;
width: 99%;
position: fixed; /* 固定 */
margin:0 auto;



/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#0066ff+0,0066ff+50,ffffff+99 */
background: rgb(0,102,255); /* Old browsers */
background: -moz-linear-gradient(left, rgba(0,102,255,1) 0%, rgba(0,102,255,1) 50%, rgba(255,255,255,1) 99%); /* FF3.6-15 */
background: -webkit-linear-gradient(left, rgba(0,102,255,1) 0%,rgba(0,102,255,1) 50%,rgba(255,255,255,1) 99%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to right, rgba(0,102,255,1) 0%,rgba(0,102,255,1) 50%,rgba(255,255,255,1) 99%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0066ff', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */

}

.nav-drawer {
position: relative;
padding-left:20px;
width:98%;
display: block;

}

/*チェックボックス等は非表示に*/
.nav-unshown {
display:none;
}

/*アイコンのスペース*/
#nav-open {
display: inline-block;
width: 80px;
height: 80px;
vertical-align: middle;
padding: 15 10 0 10;
background-color:#e4e4e4;
}

/*ハンバーガーアイコンをCSSだけで表現*/
#nav-open span, #nav-open span:before, #nav-open span:after {
position: absolute;
height: 5px;/*線の太さ*/
width: 80px;/*長さ*/
border-radius: 3px;
background: #555;
display: block;
content: '';
cursor: pointer;
}
#nav-open span:before {
bottom: -26px;
}
#nav-open span:after {
bottom: -52px;
}

/*閉じる用の薄黒カバー*/
#nav-close {
display: none;/*はじめは隠しておく*/
position: fixed;
z-index: 99;
top: 0;/*全体に広がるように*/
left: 0;
width: 100%;
height: 100%;
background: black;
opacity: 0;
transition: .3s ease-in-out;
}

/*中身*/
#nav-content {
overflow: auto;
position: fixed;
top: 0;
left: 0;
z-index: 9999;/*最前面に*/
width: 90%;/*右側に隙間を作る*/
max-width: 360px;/*最大幅*/
height: 100%;
background: #e4e4e4;/*背景色*/
transition: .3s ease-in-out;/*滑らかに表示*/
-webkit-transform: translateX(-105%);
transform: translateX(-105%);/*左に隠しておく*/
}

/*チェックが入ったらもろもろ表示*/
#nav-input:checked ~ #nav-close {
display: block;/*カバーを表示*/
opacity: .5;
}

#nav-input:checked ~ #nav-content {
-webkit-transform: translateX(0%);
transform: translateX(0%);/*中身を表示*/
box-shadow: 6px 0 25px rgba(0,0,0,.15);
}


.nav-drawer ul{
list-style-type: none;
font-size: 60px;
bor: underline;
padding: 0 10 0 10;


}
#nav-content > ul > li:nth-child(1) {

border-top: 2px solid #000000;
}


.nav-drawer li{
border-bottom: 2px solid #000000;
padding: 5 0 5 0;

}





.nav-drawer a:link {
color:#215dc6;
background-color:inherit;
text-decoration:none;
}
.nav-drawer a:active {
color:#215dc6;
background-color:#ccddee;
text-decoration:none;
}
.nav-drawer a:visited {
color:#613da6;
background-color:inherit;
text-decoration:none;
}
.nav-drawer a:hover {
color:#215dc6;
background-color:#ccddee;
text-decoration:underline;
}



/* li全体をリンクにする */
#nav-content > ul > li:nth-child(1n) > a {

display:block;

}


#nav-content > ul > li:nth-child(1n) > a:link {

color:#215dc6;
background-color:inherit;
text-decoration:none;
}

#nav-content > ul > li:nth-child(1n) > a:active {
color:#215dc6;
background-color:#ccddee;
text-decoration:none;
}

#nav-content > ul > li:nth-child(1n) > a:active {

color:#613da6;
background-color:inherit;
text-decoration:none;
}


`;
        }



        if(syurui != "drawer"){
            txt = (function(param) {return param[0].replace(/\n|\r/g, "");})`

body {
width: 100%;
min-width: 980px;
color:black;
background-color:white;
font-size:18px;
font-family:verdana, arial, helvetica, Sans-Serif;
}
th,td {
font-size:18px;
font-family:verdana, arial, helvetica, Sans-Serif;
}

`;
        }


       if(syurui == "login"){


            txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`



/* 練習セレクトメニュー */
body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > form:nth-child(4) > table:nth-child(13) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(6) {

	text-align:center;

}



/* 掲示板・お知らせ */
body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > form:nth-child(4) > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(1) > td {

	display: block;
	width: 100%;

}

/* 掲示板 5個まで 名前部分 */
body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > form:nth-child(4) > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > dl:nth-child(2) > dt:nth-child(n+21) {

	display: none;

}

/* 掲示板 5個まで コメント部分 */
body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > form:nth-child(4) > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > dl:nth-child(2) > dd:nth-child(n+22) {

	display: none;

}

/* 掲示板 5個まで 改行部分 */
body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > form:nth-child(4) > table:nth-child(15) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > dl:nth-child(2) > br:nth-child(n+23) {

	display: none;

}




/* 練習セレクトボックス */
body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > form:nth-child(4) > table:nth-child(13) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(6) > select {

	width: 200px;

}

select {

	width: 140px;
	height: 80px;
	font-size: 20px;

}


input {

	width: 160px;
	height: 80px;
	font-size: 20px;

}


/* 意識 画像拡大 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(1) > table:nth-child(3)  img {

	height:6px;

}

/* 日程 フォントサイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font {

	font-size:18px;

}




/* 上部 */


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	width:100%;
	display: block;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > table > tbody > tr > td:nth-child(2) {

	width:100%;
	display: block;
}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > table > tbody > tr > td:nth-child(3) {

	width:100%;
	display: block;
}


/* チーム方針 td サイズ */


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > table:nth-child(5) > tbody > tr:nth-child(1) > td:nth-child(2n+6) {

	width:20%;

}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > table:nth-child(5) select{

	width: 100%;

}




/* 次の試合1 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > b {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}

/* 次の試合2 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > strong {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}



/* X年度 X月X日 width調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	width: 140px;

}

/* X年度　調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > font {

	font-size:20px;

}

/* 試合日の球場名を非表示 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)  small {

	display: none;

}

/* 球場情報を非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > table > tbody > tr > td:nth-child(1) > table:nth-child(2) {

	display: none;

}


/* 行動 table 縦表示 */


	/* 名前～アイテム */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(1) {
		display:list-item;
		list-style:none;
		width:100%;
}

	/* 練習～意識 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(2) {

		display:list-item;
		list-style:none;
		width:100%;

}

	/* 練習メニュー　大きさ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width:250px;

}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(3) {

	display:list-item;
	list-style:none;
	width:100%;
}


/* 契約更改～設定 調整 */



body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(3) > table:nth-child(1) {


	display:block;

}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(3) > table tr {


	display:inline-block;

}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(3) > table tr td {


	display:block;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(3) form {

	margin: 0;

}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(3) > table:nth-child(n) > tbody > tr:nth-child(n) {

	height: 150px;
	width: 25%;

}








/* 練習セレクトメニュー サイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width: 200px;

}





/* 掲示板 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(11) > tbody > tr:nth-child(1) > td:nth-child(1) {

		display:list-item;
		list-style:none;
		width:100%;

}

/* お知らせ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(11) > tbody > tr:nth-child(1) > td:nth-child(2) {

		display:list-item;
		list-style:none;
		width:100%;

}




/* 書き込み */


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(11) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

		display:list-item;
		list-style:none;
		width:100%;

}


textarea[name="com_content"] {

	height: 150px;

}

/* 野手テーブル 改行しない*/
#open1 > div > table > tbody > tr > td > table {
	white-space: nowrap;

}

/* セル間隔調整 */
#open1 > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(n) {

	padding: 0 6 0 6;

}

#open1 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) {

	padding: 15 0 15 0;

}


/* 投手テーブル 改行しない*/
#open2 > div > table > tbody > tr > td > table {
	white-space: nowrap;

}

/* セル間隔調整 */
#open2 > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(n) {

	padding: 0 6 0 6;

}
#open2 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) {

	padding: 15 0 15 0;

}





/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 40px;

}


/* 順番移動▲ */
#open1 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) > font:nth-child(1) {
	font-size: 50px;
}

#open1 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) > font:nth-child(5) {
	font-size: 50px;
}

/* 順番移動▲ */
#open2 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) > font:nth-child(1) {
	font-size: 50px;
}

#open2 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) > font:nth-child(5) {
	font-size: 50px;
}

#open1 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) > input[type="text"] {

	width: 100px;

}

#open1 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(2) > select {

	width: 100px;

}

#open2 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) > input[type="text"] {

	width: 100px;

}




/* 野手ポジション・打順変更ボタン 位置調整 */
#open1 > div > table > tbody > tr > td > div {

	padding-bottom: 30px;
	position: relative;
	left: 150px;


}
#open1 > div > table > tbody > tr > td > div > input {

	width: 300px;

}


/* 投手起用順変更ボタン 位置調整 */

#open2 > div > table > tbody > tr > td > div {

	padding-bottom: 30px;
	position: relative;
	left: 150px;

}
#open2 > div > table > tbody > tr > td > div  > input {

	width: 300px;

}

/* 画面更新ボタン 位置調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > form > table:nth-child(9) > tbody > tr > td:nth-child(1) > form > div {


	padding: 30 0 30 0;
	position: relative;



}


#oreore_sm {
	background-color: #ff00ff;
}

#oreore_sm2 {
	background-color: #ff0055;
}


/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) {

	display: none;

}


/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}










/* 通常メニューを消す */
/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table {

	display: none;

}

/* ドラフト メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	display: none;

}


/* ロゴのテーブルを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2)  {

	display: none;

}




#open2 > div > table > tbody > tr > td > div > input[type="submit"] {

	z-index:1;
        position: relative;

}

`;


        }else if(syurui == "home_on"){

            console.log("home_on");
txt = (function(param) {return param[0].replace(/\n|\r/g, "");})`

body {
	width: 100%;
	min-width: 980px;
	color:black;
	background-color:white;
	font-size:18px;
	font-family:verdana, arial, helvetica, Sans-Serif;
}
th,td {
	font-size:18px;
	font-family:verdana, arial, helvetica, Sans-Serif;
}







input {

	width: 140px;
	height: 80px;
	font-size: 20px;

}



/* 日程 フォントサイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font {

	font-size:18px;

}






/* 次の試合1 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > b {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}

/* 次の試合2 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > strong {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}



/* X年度 X月X日 width調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	width: 140px;

}

/* X年度　調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > font {

	font-size:20px;

}

/* 試合日の球場名を非表示 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)  small {

	display: none;

}




/* 練習セレクトメニュー サイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width: 200px;

}










textarea[name="com_content"] {

	height: 150px;

}

/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1)  {

	width: 250px;
}



/* ログイン部分 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td {

	display: block;
}




/* メニュー（ランキング等） */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table > tbody > tr > td > a > img  {

	height: 30px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {


	height: 50px;

}


/* ロゴとログインメニューを並べる */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {
	float:left;

}

/* ドラフト */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	//display:none;
	position:absolute;
	height: 50px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) img {

	height: 30px;

}






body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {

	display: none;

}



/* 通常メニューを消す */
/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table {

	display: none;

}

/* ドラフト メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	display: none;

}

/* ロゴを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {

	display: none;

}




/* 順位表 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) {

	margin: 2px;
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table {

	width: 98%;
	margin: 2px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table {

	width: 98%;
	margin: 2px;

}


`;
        }else if(syurui == "home_nihon"){

            txt = (function(param) {return param[0].replace(/\n|\r/g, "");})`


body {
	width: 100%;
	min-width: 980px;
	color:black;
	background-color:white;
	font-size:18px;
	font-family:verdana, arial, helvetica, Sans-Serif;
}
th,td {
	font-size:18px;
	font-family:verdana, arial, helvetica, Sans-Serif;
}








input {

	width: 140px;
	height: 80px;
	font-size: 20px;

}



/* 日程 フォントサイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font {

	font-size:18px;

}






/* 次の試合1 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > b {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}

/* 次の試合2 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > strong {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}



/* X年度 X月X日 width調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	width: 140px;

}

/* X年度　調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > font {

	font-size:20px;

}

/* 試合日の球場名を非表示 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)  small {

	display: none;

}




/* 練習セレクトメニュー サイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width: 200px;

}










textarea[name="com_content"] {

	height: 150px;

}

/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1)  {

	width: 250px;
}



/* ログイン部分 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td {

	display: block;
}




/* メニュー（ランキング等） */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table > tbody > tr > td > a > img  {

	height: 30px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {


	height: 50px;

}


/* ロゴとログインメニューを並べる */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {
	float:left;

}

/* ドラフト */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	//display:none;
	position:absolute;
	height: 50px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) img {

	height: 30px;

}






body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {

	display: none;

}



/* 通常メニューを消す */
/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table {

	display: none;

}

/* ドラフト メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	display: none;

}

/* ロゴを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {

	display: none;

}




/* 順位表 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(11) {

	margin: 2px;
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table {

	width: 98%;
	margin: 2px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table {

	width: 98%;
	margin: 2px;

}




/* 日本シリーズ結果表示 調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) {
	width: 30%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(2) {
	width: 40%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) {
	width: 30%;
}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(3) {
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(5) {
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table:nth-child(3) {
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table:nth-child(5) {
	width: 98%;
}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(n+3) > tbody > tr:nth-child(n) > td:nth-child(n) {

	font-size: 16px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) >  table:nth-child(n+3) > tbody > tr:nth-child(n) > td:nth-child(n) {

	font-size: 16px;

}



/* 日シリ テーブル調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) {

	width: 98%;

}


/* 日シリ 勝敗 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td:nth-child(2) {

	font-size: 16px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table:nth-child(1) > tbody > tr > td:nth-child(2) {

	font-size: 16px;

}


`;


        }else if(syurui == "home_off"){

            txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`

body {
	width: 100%;
	min-width: 980px;
	color:black;
	background-color:white;
	font-size:18px;
	font-family:verdana, arial, helvetica, Sans-Serif;
}
th,td {
	font-size:18px;
	font-family:verdana, arial, helvetica, Sans-Serif;
}


input {

	width: 140px;
	height: 80px;
	font-size: 20px;

}



/* 日程 フォントサイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font {

	font-size:18px;

}






/* 次の試合1 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > b {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}

/* 次の試合2 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > strong {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}



/* X年度 X月X日 width調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	width: 140px;

}

/* X年度　調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > font {

	font-size:20px;

}

/* 試合日の球場名を非表示 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)  small {

	display: none;

}




/* 練習セレクトメニュー サイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width: 200px;

}










textarea[name="com_content"] {

	height: 150px;

}

/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1)  {

	width: 250px;
}



/* ログイン部分 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td {

	display: block;
}




/* メニュー（ランキング等） */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table > tbody > tr > td > a > img  {

	height: 30px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {


	height: 50px;

}


/* ロゴとログインメニューを並べる */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {
	float:left;

}

/* ドラフト */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	//display:none;
	position:absolute;
	height: 50px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) img {

	height: 30px;

}






body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {

	display: none;

}



/* 通常メニューを消す */
/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(8) > table {

	display: none;

}

/* 新規登録 メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	display: none;

}

/* ドラフト メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) {

	display: none;

}


/* ロゴを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {

	display: none;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody {


}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	border-style: none;


}



/* 順位表 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(11) {

	margin: 2px;
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table {

	width: 98%;
	margin: 2px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table {

	width: 98%;
	margin: 2px;

}



/* 日本シリーズ結果表示 調整 */


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) {
	width: 30%;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(2) {
	width: 40%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) {
	width: 30%;
}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(3) {
	width: 98%;


}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(5) {
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table:nth-child(3) {
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table:nth-child(5) {
	width: 98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(n+3) > tbody > tr:nth-child(n) > td:nth-child(n) {

	font-size: 16px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) >  table:nth-child(n+3) > tbody > tr:nth-child(n) > td:nth-child(n) {

	font-size: 16px;

}


/* 日シリ テーブル調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) {

	width: 98%;

}


/* 日シリ 勝敗 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr > td:nth-child(2) {

	font-size: 16px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td:nth-child(3) > table:nth-child(1) > tbody > tr > td:nth-child(2) {

	font-size: 16px;

}







`;


        }else if(syurui == "skill"){

            txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`

input {

	width: 250px;
	height: 80px;
	font-size: 20px;

}



/* 日程 フォントサイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font {

	font-size:18px;

}






/* 次の試合1 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > b {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}

/* 次の試合2 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > strong {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}



/* X年度 X月X日 width調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	width: 140px;

}

/* X年度　調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > font {

	font-size:20px;

}

/* 試合日の球場名を非表示 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)  small {

	display: none;

}




/* 練習セレクトメニュー サイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width: 200px;

}










textarea[name="com_content"] {

	height: 150px;

}

/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}



/* ログイン部分 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td {

	display: block;
}




/* メニュー（ランキング等） */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table > tbody > tr > td > a > img  {

	height: 30px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {


	height: 50px;

}


/* ロゴとログインメニューを並べる */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {
	float:left;

}

/* ドラフト */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	//display:none;
	position:absolute;
	height: 50px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) img {

	height: 30px;

}






body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {

	display: none;

}



/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) {

	display: none;

}


/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}

/* タイトルロゴのセル表示調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(3) {

	width: 100%;
	height: 80px;

}

/* ロゴのテーブルを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2)  {

	display: none;

}


/* 能力アップ　全体テーブル */


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) {

	width:98%;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table {

	width:99%;

}



body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) {
	display:list-item;
	list-style:none;
	width:100%;

}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) {

	display:list-item;
	list-style:none;
	width:100%;

}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr:nth-child(2n) > td > input {

	height:40px;
	width: 80px;
}



/* 名前　ステータス　テーブル */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1),
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2),
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(3) {
	display: block;
	width: 100%;


}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(n) > small {

	font-size: 18px;

}




/* ポイントテーブル */


/* greasemonkeyでテーブル作り直し カラー */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table {
	text-align: center;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table tr td {

	font-size: 24px;


}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr:nth-child(2) > td:nth-child(n) > input {

	font-size:24px;
	width:140px;
	text-align: center;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr:nth-child(1) > td:nth-child(1) {
	background-color: #ffdddd;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr:nth-child(1) > td:nth-child(2) {
	background-color: #ddffdd;
}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr:nth-child(1) > td:nth-child(3) {
	background-color: #ddddff;
}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr:nth-child(1) > td:nth-child(4) {
	background-color: #ffffdd;
}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr:nth-child(1) > td:nth-child(5) {
	background-color: #ddffff;
}




/* ポイントテーブル end */



/* ポイント振り分けテーブル */


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(2n) > td:nth-child(n) > select {

	width: 140px;
	height: 80px;
	font-size:26px;

}


body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(n) > td:nth-child(n) > table > tbody > tr > td:nth-child(1) > input[type="checkbox"] {


	width: 40px;
	height: 80px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(6) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(9) > tbody > tr:nth-child(1) > td > input[type="submit"] {

	width: 250px;
	height: 100px;


}


`;

        }else if(syurui == "skill2"){

            txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`

input {

	width: 250px;
	height: 80px;
	font-size: 20px;

}






/* 練習セレクトメニュー サイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width: 200px;

}




/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}



/* ログイン部分 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td {

	display: block;
}




/* メニュー（ランキング等） */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table > tbody > tr > td > a > img  {

	height: 30px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {


	height: 50px;

}


/* ロゴとログインメニューを並べる */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {
	float:left;

}

/* ドラフト */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	//display:none;
	position:absolute;
	height: 50px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) img {

	height: 30px;

}






body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {

	display: none;

}



/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) {

	display: none;

}


/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}

/* タイトルロゴのセル表示調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(3) {

	width: 100%;
	height: 80px;

}

/* ロゴのテーブルを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2)  {

	display: none;

}




/* 能力アップ結果　数値サイズ */



body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(1) > td > table small ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td > table small {

	font-size: 18px;

}







`;


        }else if(syurui == "team_mode"){

            txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`
/* 日程 フォントサイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font {

	font-size:18px;

}




/* 上部 */
/*body table tbody tr:nth-child(1) td:nth-child(2) table:nth-child(7) td {*/
body  table  tbody  tr:nth-child(1)  td:nth-child(2)  table:nth-child(7) tbody  tr  td  table:nth-child(2) td {
	display: block;
	width: 100%;
}

body table tbody tr:nth-child(1) td:nth-child(2) table:nth-child(7) tbody tr td table:nth-child(2) tbody tr td:nth-child(1) table:nth-child(4) td {

	display: table-cell;
	width: 25%;
}

body table tbody tr:nth-child(1) td:nth-child(2) table:nth-child(7) tbody tr td table:nth-child(2) tbody tr td:nth-child(2) table tbody tr:nth-child(1) td table td {

	display: table-cell;
	width: unset;

}

body  table  tbody tr:nth-child(1) td:nth-child(2) table:nth-child(7) tbody tr td table:nth-child(2) tbody tr td:nth-child(2) table tbody tr:nth-child(n) td table tbody tr:nth-child(n) td {

	display: table-cell;
	width: unset;


}

body table tbody tr:nth-child(1) td:nth-child(2) table:nth-child(7) tbody >tr td table:nth-child(2) tbody tr td:nth-child(2) table tbody tr:nth-child(3) td table td {
	display: table-cell;
	width: unset;


}





/* 野手テーブル 改行しない*/

body table tbody tr:nth-child(1) td:nth-child(2) table:nth-child(7) tbody tr td table:nth-child(4) tbody tr td table td {
	white-space: nowrap;

}



/* 投手テーブル 改行しない*/
body table tbody tr:nth-child(1) td:nth-child(2) table:nth-child(7) tbody tr td table:nth-child(7) tbody tr td table td {

	white-space: nowrap;

}

/* セル間隔調整 */
#open2 > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(n) {

	padding: 0 6 0 6;

}
#open2 > div > table > tbody > tr > td > table > tbody > tr:nth-child(2n) > td:nth-child(1) {

	padding: 15 0 15 0;

}





/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 40px;

}





/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) {

	display: none;

}


/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}










/* 通常メニューを消す */
/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table {

	display: none;

}

/* ドラフト メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	display: none;

}


/* ロゴのテーブルを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2)  {

	display: none;

}




#open2 > div > table > tbody > tr > td > div > input[type="submit"] {

	z-index:1;
        position: relative;

}



`;
        }else if(syurui == "consciousness"){

            txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`

input[type="submit"] {

	width: 250px;
	height: 80px;
	font-size: 20px;

}











textarea[name="com_content"] {

	height: 150px;

}








body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) img {

	height: 30px;

}






body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {

	display: none;

}



/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) {

	display: none;

}


/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}

/* タイトルロゴのセル表示調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(3) {

	width: 100%;
	height: 80px;

}

/* ロゴのテーブルを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2)  {

	display: none;

}


select {

	//width: 140px;
	height: 80px;
	font-size:26px;

}

input[type="radio"] {

	width: 30px;
	height: 40px;

}

/* テーブル枠調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) {

	width: 99%;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table {

	width: 98%;

}




`;

            }else if(syurui == "training"){

                txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`

input {

	width: 270px;
	height: 80px;
	font-size: 20px;

}



/* 次の試合1 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > b {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}

/* 次の試合2 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > strong {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}




/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}



/* ログイン部分 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td {

	display: block;
}










/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) {

	display: none;

}


/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}

/* タイトルロゴのセル表示調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(3) {

	width: 100%;
	height: 80px;

}

/* ロゴのテーブルを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2)  {

	display: none;

}




/* テーブル枠調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) {

	width: 99%;

}




/* 戻る　リンク */

a[href="javascript:history.back()"] {

	font-size: 40px;

}



/* 休息ボタン */
 input[value="休息する"] {
	width: 150px;
	padding: 0 20 0 20;
}


/* 休息ボタン */
 input[value="ログイン画面に戻る"] {
	width: 210px;
	padding: 0 20 0 20;
}

/* ステータス */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td > table:nth-child(3) td {

	font-size: 24px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td > center > font {

	font-size: 20px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(8) > tbody > tr > td > table:nth-child(10) {

	width: 100%;

}



`;


            }else if(syurui == "record"){

                txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`

input {

	width: 140px;
	height: 80px;
	font-size: 20px;

}



/* 日程 フォントサイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font {

	font-size:18px;

}






/* 次の試合1 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > b {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}

/* 次の試合2 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > strong {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}



/* X年度 X月X日 width調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	width: 140px;

}

/* X年度　調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > font {

	font-size:20px;

}

/* 試合日の球場名を非表示 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)  small {

	display: none;

}




/* 練習セレクトメニュー サイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width: 200px;

}










textarea[name="com_content"] {

	height: 150px;

}

/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}



/* ログイン部分 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td {

	display: block;
}




/* メニュー（ランキング等） */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table > tbody > tr > td > a > img  {

	height: 30px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {


	height: 50px;

}


/* ロゴとログインメニューを並べる */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {
	float:left;

}

/* ドラフト */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	//display:none;
	position:absolute;
	height: 50px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) img {

	height: 30px;

}






body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {

	display: none;

}



/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) {

	display: none;

}


/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}

/* タイトルロゴのセル表示調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(3) {

	width: 100%;
	height: 80px;

}

/* ロゴのテーブルを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2)  {

	display: none;

}


select {

	//width: 140px;
	height: 80px;
	font-size:26px;

}

input[type="checkbox"] {


	width: 40px;
	height: 80px;

}

/* テーブル枠調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) {

	width: 99%;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(6) > tbody > tr > td:nth-child(1) > table {

	width: 99%;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(6) > tbody > tr > td:nth-child(3) > table {

	width: 99%;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(6) > tbody > tr > td:nth-child(-n+3) {

	display: block;
	width: 100%;

}




/* タイトルホルダー テーブル */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) {

	width: 100%;

}

	/* 選手名 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n+1) > td:nth-child(1) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n+1) > td:nth-child(6) {

	width: 18%;
	padding-left: 2px;
	padding-right: 0px;

}

	/* 回数 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n+1) > td:nth-child(2) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n+1) > td:nth-child(7){

	text-align: center;
	width: 8%;
	font-size: 12px;
	padding-left: 0px;
	padding-right: 0px;

}

	/* チーム */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n+1) > td:nth-child(3) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n+1) > td:nth-child(8) {

	font-size: 14px;
	padding-left: 0px;
	padding-right: 0px;
	width: 10%;
}




	/* データ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n+1) > td:nth-child(4) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n) > td:nth-child(9) {

	width: 7%;
	text-align: right;
	padding-left: 0px;
	padding-right: 5px;

}






	/* タイトル名 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(9) > tbody > tr:nth-child(n+1) > th {
	width: 14%;
	font-size: 16px;
	padding: 0;
	margin: 0;

}



/* ベストナイン */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) {

	width: 96%;

}


	/* 選手名 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) > tbody > tr:nth-child(n+1) > td:nth-child(1) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) > tbody > tr:nth-child(n+1) > td:nth-child(5) {

	width: 22%;

}

	/* 回数 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) > tbody > tr:nth-child(n+1) > td:nth-child(2) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) > tbody > tr:nth-child(n+1) > td:nth-child(6) {

	font-size: 12px;
	width: 5%;

}

	/* 守備位置 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) > tbody > tr:nth-child(2) > th {

	width: 16%;

}

	/* チーム名 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) > tbody > tr:nth-child(n+1) > td:nth-child(3) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) > tbody > tr:nth-child(n+1) > td:nth-child(7) {

	font-size: 16px;
	width : 15%;

}






/* ゴールデングラブ */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(16) {

	width: 96%;

}


	/* 選手名 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(20) > tbody > tr:nth-child(n+1) > td:nth-child(1) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(20) > tbody > tr:nth-child(n+1) > td:nth-child(5) {

	width: 22%;

}

	/* 回数 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(20) > tbody > tr:nth-child(n+1) > td:nth-child(2) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(20) > tbody > tr:nth-child(n+1) > td:nth-child(6) {

	font-size: 12px;
	width: 5%;

}

	/* 守備位置 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(20) > tbody > tr:nth-child(2) > th {

	width: 16%;

}

	/* チーム名 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(20) > tbody > tr:nth-child(n+1) > td:nth-child(3) ,
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(20) > tbody > tr:nth-child(n+1) > td:nth-child(7) {

	font-size: 16px;
	width : 15%;

}






`;





            }else if(syurui == "default"){

                txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`



input {

	width: 250px;
	height: 80px;
	font-size: 20px;

}



/* 日程 フォントサイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font {

	font-size:18px;

}






/* 次の試合1 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > b {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}

/* 次の試合2 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > strong {

	word-wrap: break-word;
	white-space: normal;
	display: block;

}



/* X年度 X月X日 width調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) {

	width: 140px;

}

/* X年度　調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > font {

	font-size:20px;

}

/* 試合日の球場名を非表示 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2)  small {

	display: none;

}




/* 練習セレクトメニュー サイズ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(9) > tbody > tr > td > form > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) > select {

	width: 200px;

}










textarea[name="com_content"] {

	height: 150px;

}

/* ヘッダ部 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {

	height: 80px;


}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(n+2) img {

	width: 80px;

}

/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}



/* ログイン部分 */

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td {

	display: block;
}




/* メニュー（ランキング等） */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(7) > table > tbody > tr > td > a > img  {

	height: 30px;
}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) {


	height: 50px;

}


/* ロゴとログインメニューを並べる */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) {
	float:left;

}

/* ドラフト */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) {

	//display:none;
	position:absolute;
	height: 50px;

}

body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(6) img {

	height: 30px;

}






body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {

	display: none;

}



/* ヘッダ画像 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(2) {


	display: none;

}
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) > table > tbody > tr > td:nth-child(1) {

	display: none;


}

/* メニュー非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(4) {

	display: none;

}


/* ロゴ */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(1) > a > strong > img {

	height: 80px;
	width: 250px;
}

/* タイトルロゴのセル表示調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td:nth-child(3) {

	width: 100%;
	height: 80px;

}

/* ロゴのテーブルを非表示 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2)  {

	display: none;

}


select {

	//width: 140px;
	height: 80px;
	font-size:26px;

}

input[type="checkbox"] {


	width: 40px;
	height: 80px;

}

/* テーブル枠調整 */
body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(5) {

	width: 99%;

}


/* ラジオボタン */
input[type="radio"] {

	width: 30px;
	height: 40px;

}


/* 戻る　リンク */

a[href="javascript:history.back()"] {

	font-size: 40px;

}


`;





       /*
            }else if(syurui == "rule"){

                txt = txt + (function(param) {return param[0].replace(/\n|\r/g, "");})`



`;
       */



            }












return txt;




    }









})();



