// ==UserScript==
// @name         [Nagisa]Typing-tube Auto punching [hack]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match         https://typing-tube.net/movie/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413831/%5BNagisa%5DTyping-tube%20Auto%20punching%20%5Bhack%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/413831/%5BNagisa%5DTyping-tube%20Auto%20punching%20%5Bhack%5D.meta.js
// ==/UserScript==

var cpm = 500;
//========================================================
//========================================================
(function() {

    'use strict';
    //要素の追加
    AddDom();

    //レース待機まで待機
//     var  isReady = false;
//     setInterval(function() {
//         if(isReady){return}
//         var dReady = document.querySelector("div > div > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > div > span");
//         if(dReady != null && dReady.innerText == ":00"){
//             console.log("GO");
//             isReady = true;
    setTimeout(Dump, 1000);//軽くウェイト
//          }
//     }, 100);
    //Your code here...
})();
//========================================================
//テキスト自動打ち込み
//========================================================
function Dump(){
    (function getString() {
        setTimeout(function() {
            if(document.getElementById("IsAuto").checked){
                var char;
                if( next_char[1] != null){
                    char = next_char[1][0];
                }
                if(char == null || char == ""){
                    if( next_char[0] != null){
                        char = next_char[0][0];
                    }
                }
                if(char != null && char != ""){
//                     if(isUpperCase(next_char[0][0])){
//                         char = next_char[0][0];
//                     }
                    var Code =char.toUpperCase().charCodeAt(0);
                    var codeText = "";
                    window.dispatchEvent( new KeyboardEvent( "keydown",{key: char ,keyCode: Code, code: codeText})) ;
                }
            }
            getString();
        }, 1000 / (cpm / 60));
    })()
}
//========================================================
//要素の追加
//========================================================
function AddDom(){
    //wrapper-------------------------------------------------------
    var dWrap = document.createElement("div");

    dWrap.id = "wrapper";
    var parent = document.getElementById("time_settings");
    parent.appendChild(dWrap);
    dWrap = document.getElementById("wrapper");
    //check box-------------------------------------------------------
    var dIsAuto = document.createElement("input");
    dIsAuto.id = "IsAuto";
    dIsAuto.setAttribute("type","checkbox");
    dIsAuto.setAttribute("name","IsAuto");
    if(ReadFromCookie("isAuto")){
       dIsAuto.setAttribute("checked","checked");
    }
    dIsAuto.addEventListener("click", function(){
        WriteToCookie("isAuto", document.getElementById("IsAuto").checked);
    });
    dWrap.appendChild(dIsAuto);

    var dRbIsAuto = document.createElement("label");
    dRbIsAuto.innerHTML = "オートプレイモード";
    dWrap.appendChild(dRbIsAuto);
    //cpm------------------------------------------------------------
    if(ReadFromCookie("cpm") != NaN){
        cpm = parseInt(ReadFromCookie("cpm"));
    }else{
      cpm = 500;
    }
    var dCpm = document.createElement("input");
    dCpm.id = "cpm";
    dCpm.setAttribute("type","range");
    dCpm.setAttribute("min","1");
    dCpm.setAttribute("max","3000");
    dWrap.appendChild(dCpm);
    document.getElementById("cpm").value = cpm;
    //cpm text------------------------------------------------------------
    var dTxtCpm = document.createElement("span");
    dTxtCpm.id = "cpmText";
    dTxtCpm.innerText = cpm.toString() + "cpm";
    dWrap.appendChild(dTxtCpm);
    dCpm.addEventListener("change", function(){
        var val = document.getElementById("cpm").value;
        var text = document.getElementById("cpmText");
        cpm = val;
        text.innerText = val.toString() + "cpm";
        WriteToCookie("cpm", cpm);
    });
}


/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note クッキー関連 ここから ---
*/

/**
*@description クッキーデータの読み込み
*@param name
*@return val
*/
function ReadFromCookie(name){
    var result = null;
    var cookieName = name + '=';
    var allcookies = document.cookie;
    var position = allcookies.indexOf( cookieName );
    if( position != -1 )
    {
        var startIndex = position + cookieName.length;
        var endIndex = allcookies.indexOf( ';', startIndex );
        if( endIndex == -1 )
        {
            endIndex = allcookies.length;
        }
        result = decodeURIComponent(
            allcookies.substring( startIndex, endIndex ) );
    }
    return result;
}

/**
*@description クッキーにデータの書き込み
*@param name
*@param val
*/
function WriteToCookie(name, val){
   //クッキーは制限されているみたい？

    var expire = new Date();
    expire.setTime( expire.getTime() + 1000 * 3600 * 24 * 30);
    document.cookie = name + '=' +  encodeURIComponent(val) + '; path=/ ; expires=' + expire.toUTCString();
}


/**
*@note クッキー関連 ここから ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////
function isUpperCase(str) {
   return str === str.toUpperCase();
}
