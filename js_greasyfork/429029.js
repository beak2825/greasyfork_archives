// ==UserScript==
// @name         Mouse dictionary helper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Mouse Dictionary で引いた結果をAnkiwebのdeckに登録する君
// @author       @ozero
// @match        *://*/*
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/429029/Mouse%20dictionary%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/429029/Mouse%20dictionary%20helper.meta.js
// ==/UserScript==

'use strict';


//Mouse dictionaryウィンドウクリック時の処理及び関連付け
( () => {
  let mouse_dictonary_helper = {};

  //Mouse dictionaryウィンドウの内容をGM.setValueでGMストレージに保存
  mouse_dictonary_helper.gsetval = (event) => {
    let mdh_element = document.getElementsByClassName('mouse_dictonary_helper')
    if(!mdh_element[0]){
      return false;
    }
    let content = mdh_element[0].innerText;
    GM.setValue( "mdhtmp", content );
    //console.log("set mdh", content);

    //Ctrlキー押下有無(→AnkiwebでAutofill後自動save&close)も持っとく
    if(event.ctrlKey ){
      GM.setValue( "mdhAutosave", "yes" );//set autosave flag
    }else{
      GM.setValue( "mdhAutosave", "no" );
    }

    //ついでにAnkiwebのデッキ追加ウィンドウを開く
    window.open('https://ankiuser.net/edit/', '_blank');

    return;
  };

  //Mouse dictionaryウィンドウの有無をpolling(200ms毎)してクリックイベントを追加
  const mdh_window_poll = () => {
    let mdh_element = document.getElementsByClassName('mouse_dictonary_helper')
    if(mdh_element[0]){
      mdh_element[0].addEventListener('click', mouse_dictonary_helper.gsetval, false);
      console.log("mdh addEventListener");
      return true;
    }else{
      setTimeout(()=>{
        mdh_window_poll();
      }, 200);
      //console.log("mdh polling");
      return false;
    }
  }
  mdh_window_poll();//Pollingの起動

} )();


//Ankiwebのデッキ追加URLを開いた際の入力欄autofill
(async function(){

  if(window.location.href !== "https://ankiuser.net/edit/"){
    return;
  }

  const mdhtmp = await GM.getValue( "mdhtmp", "" );
  if(mdhtmp === ""){
    return;
  }
  //console.log("get mdh", mdhtmp);

  //Util
  const sleep = (msec) => {
    return new Promise(resolve => setTimeout(resolve, msec))
  };

  //wait for form-dom loaded
  let loaded = false;
  while(!loaded){
    let el_front = document.getElementById("f0");
    if(!el_front){
      await sleep(100);
      continue;
    }
    let el_back = document.getElementById("f1");
    if(!el_back){
      await sleep(100);
      continue;
    }
    loaded = true;
  }

  //Autofill
  const mdhtmp_2 = mdhtmp.split("\n\n");
  const mdhtmp_3 = mdhtmp_2.shift().split("\n");
  const head = mdhtmp_3.shift().toLowerCase();//登録する単語は小文字に揃える
  const body = mdhtmp_3.join("\n");
  let el_front = document.getElementById("f0");
  let el_back = document.getElementById("f1");
  el_front.innerText = head;
  el_back.innerText = body;

  //Clear
  GM.setValue( "mdhtmp", "" );

  //もし既知の単語ならAlert出してここで止める
  const mdhKnownwordJson = await GM.getValue( "mdhKnownword", "{}" );
  let mdhKnownword = JSON.parse(mdhKnownwordJson);
  if(mdhKnownword[head]){
    document.title = "⚠二重登録";
    alert("二重登録: 単語 '" + head + "' は、過去にデッキに登録されています");
    return;
  }else{
    //既知の単語に追加する
    mdhKnownword[head] = true;
    GM.setValue( "mdhKnownword", JSON.stringify(mdhKnownword) );
  }

  //Autosave & close
  const mdhAutosave = await GM.getValue( "mdhAutosave", "no" );
  if(mdhAutosave !== "yes"){
    return;
  }
  GM.setValue( "mdhAutosave", "" );//clear autosave flag

  //Tell Autosave&close to user
  document.getElementById("msg").innerText="Auto Save & Auto Close ENABLED.";
  document.getElementById("msg").style.display = "block";

  await sleep(500);
  let el_btn = document.querySelector("body > main > p > button");
  el_btn.click();

  await sleep(1000);
  window.close();

})();


//Ankiwebの登録済み単語一覧を読み取ってGM.setValueでローカルに格納しておくやつ
(async function(){

  if(window.location.href !== "https://ankiweb.net/search/"){
    return;
  }

  let el_words = document.querySelectorAll("body > main > table > tbody > tr > td");
  if(el_words.length < 1){
    return;
  }

  //登録済み単語一覧をストレージに格納する
  let words = {};
  for(let el_w1 of el_words){
    let el_w2 = ("" + el_w1.innerText).split(" / ");
    if(el_w2.length < 2){
      continue;
    }
    let word = el_w2[0].toLowerCase();
    words[word] = true;
  }
  GM.setValue( "mdhKnownword", JSON.stringify(words) );

  return;
})();

//console.log("mdh loaded");