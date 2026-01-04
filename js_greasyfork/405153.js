// ==UserScript==
// @name         feederチャット - トリップテスト
// @author       ゲームハック研究所の管理人
// @homepage     https://www1.x-feeder.info/javascript/
// @namespace    https://www.x-feeder.info/
// @version      3.1
// @description  まずは「ファイルを選択」ボタンで、改行で区切られたテキストファイルを読み込ませよう。
// @description 「(trip test)開始」ボタンを押すとトリップテストを始める。もう一度押すと止まる。「(trip test)保存」を押すと集めたトリップをcsv形式で保存する。
// @match        http*://*.x-feeder.info/*/
// @require      https://greasyfork.org/scripts/373658-feeder-chat-library/code/feeder-chat-library.js?version=641471
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405153/feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%20-%20%E3%83%88%E3%83%AA%E3%83%83%E3%83%97%E3%83%86%E3%82%B9%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/405153/feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%20-%20%E3%83%88%E3%83%AA%E3%83%83%E3%83%97%E3%83%86%E3%82%B9%E3%83%88.meta.js
// ==/UserScript==
(() => {
  'use strict';
  //定数----------------------------------------------------------------------------------------------------------------------------------------------------------
  const NAME = 'トリテス';//名前
  const STR = '1個ずつ丁寧に手打ち入力でトリップテストをしています。'//発言内容
  const POST_TIME = 3000;//投稿間隔（単位ミリ秒）
  const SAVE_TIME = 1000*60*60;//自動で保存する間隔（単位ミリ秒）
  //グローバル変数------------------------------------------------------------------------------------------------------------------------------------------------
  let g_wanted = [];//欲しいものリスト
  let g_array = [];//「欲しいものリストに引っかかったキーワード, 実際のトリップ, トリップキー」の順番で格納
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------

  const make_random_str = (_max) => {
    const _LETTERS_LIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";//使う文字リスト
    const _length = Math.floor(Math.random() * _max) + 1;//今回の長さ
    let _str = '';
    for (let i = 0; i < _length; i++) {
      _str += _LETTERS_LIST[Math.floor(Math.random() * _LETTERS_LIST.length)];
    }
    return _str;
  }

  const main_test = () => {
      const INPUTABLE_MAX = 100;//入力可能な最大文字数
      const num = INPUTABLE_MAX - NAME.length - 1;
      const trip_key = make_random_str(num);
      const name = NAME + '$' + trip_key;
      document.getElementById("post_form_name").value = name;
      feeder.say(STR);
      return trip_key;
  }

  const main_check = (_trip_log, _trip_key) => {
      let new_trip = '';
      for(let i = feeder.id.top(); i > feeder.id.lower(); i--){
          if(feeder.post.name(i) === NAME){
              new_trip = feeder.post.trip(i);
              break;
          }
      }
      if(new_trip === _trip_log || new_trip === ''){//失敗
          return false;
      }
      for(let i = 0; i < g_wanted.length; i++){
          if(~new_trip.indexOf(g_wanted[i])){
              let array = [g_wanted[i], new_trip, _trip_key];
              g_array.push(array);//格納
          }
      }
      return new_trip;
  }

  let g_trip_key = null;
  let g_trip_log = null;
  let g_test_flag = false;
  const main = () => {
      if(g_test_flag == false){//テスト
          g_trip_key = main_test();
          g_test_flag = true;
      }
      else {//チェック
          let false_or_trip = main_check(g_trip_log, g_trip_key);
          if(false_or_trip != false){
              g_trip_log = false_or_trip;
          }
          g_test_flag = false;
      }
  };

  const MakeCSVFile = (_array) => {
        let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//（文字化け対策）
        let csv_data = _array.map((l) => {return l.join(',')}).join('\r\n');
        let blob = new Blob([bom, csv_data], {type: 'text/csv'});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.target = '_blank';
        a.download = '収集したトリップ[' + feeder.roomid() + '].csv';
        a.click();
        URL.revokeObjectURL();//オブジェクトURLをメモリから開放させる
   }

  const read_file = (_input) => {
    const file = _input.files[0];
    const reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = (evt) => {
      const result = evt.target.result;
      let array = result.split(/[\t|\n|\r|\f]+/);//テキストファイルから配列作る
      let array2 = [];
      for(let i = 0; i < array.length; i++){
          if(/[^0-9a-zA-Z\.\/]/.test(array[i]) == false && array[i].length != 0){
              array2.push(array[i]);
          }
      }
      g_wanted = array2;
    }
  }

  const add_file_drop_zone = () => {
    const elm = document.createElement('input');
    elm.setAttribute('type', 'file');
    window.myFunc = () => {
      read_file(elm);
    }
    elm.addEventListener('change', window.myFunc);
    document.getElementById("post_btn").parentNode.appendChild(elm);
  };

  let g_push_flag = false;
  const g_alert_function_copy = window.alert;
  feeder.add.right("(trip test)開始", () => {
      if(g_wanted.length == 0){
          g_alert_function_copy('ファイルが選択されていません。');
      }
      else if(g_push_flag == false){
          g_push_flag = true;
          window.alert = isNaN;
          main();
          const post_time = Math.floor( POST_TIME / 2 );
          let auto_post = setInterval(() => {
              main();
              if(g_push_flag == false){
                  clearInterval(auto_post);
              }
          }, post_time);
          let auto_save = setInterval(() => {
              MakeCSVFile(g_array);
              if(g_push_flag == false){
                  clearInterval(auto_save);
              }
          }, SAVE_TIME);
      }
      else{
          g_push_flag = false;
          window.alert = g_alert_function_copy;
      }
  });

  add_file_drop_zone();

  feeder.add.right("(trip test)保存", () => {
      MakeCSVFile(g_array);
  });

})();