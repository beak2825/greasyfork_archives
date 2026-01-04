// ==UserScript==
// @name         秒数タイムタグ、歌詞自動貼り付け機[typing-tube.net]
// @namespace    https://typing-tube.net/
// @version      1.3
// @description  自分用。TIMSで作成したタイピングデータをTypingTube用に変換する
// @match        https://typing-tube.net/movie/edit*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/408600/%E7%A7%92%E6%95%B0%E3%82%BF%E3%82%A4%E3%83%A0%E3%82%BF%E3%82%B0%E3%80%81%E6%AD%8C%E8%A9%9E%E8%87%AA%E5%8B%95%E8%B2%BC%E3%82%8A%E4%BB%98%E3%81%91%E6%A9%9F%5Btyping-tubenet%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/408600/%E7%A7%92%E6%95%B0%E3%82%BF%E3%82%A4%E3%83%A0%E3%82%BF%E3%82%B0%E3%80%81%E6%AD%8C%E8%A9%9E%E8%87%AA%E5%8B%95%E8%B2%BC%E3%82%8A%E4%BB%98%E3%81%91%E6%A9%9F%5Btyping-tubenet%5D.meta.js
// ==/UserScript==
$(function() {
  // フォームの入力欄が更新されたかどうかを表すフラグです。
  var isChanged = false;

$("#save .btn-outline-success").click(function() {
    // 保存ボタンが押されたらフラグを落とします。
    isChanged = false;
  });
  $(window).bind("beforeunload", function() {
    if (isChanged) {
      // isChangedフラグがtrueの場合、つまり入力内容が変更されていた
      // 場合のみ文字列を返すようにします。
      return "このページを離れようとしています。";
    }
  });

  $("[type='text']").change(function() {
    // 入力内容が更新されている場合は、isChangedフラグをtrueにします。
    isChanged = true;
  });
});

    $('#edit').append('<div><label><input id=lrcConverTypeKana name=lrcConvertType type=radio >かな </label><label><input name=lrcConvertType type=radio checked>英語</label></div><div><span id="time_text_length">0行</span><textarea id="time_text" style="margin-left:20px;" rows="4" cols="8" name="text1"></textarea><span id="lyric_text_length">0行</span>'+
'<textarea id="lyric_text" style="margin-left:20px;" rows="4" cols="100" name="text1"></textarea>'+
'<button type="button" id="xml_button" disabled>xml→TT変換実行(行数一致で実行可能)</button></div>')

document.getElementById("xml_button").addEventListener('click',(function jiccou(){
document.getElementById("time").value = ""
document.getElementById("words").value = ""
document.getElementById("kana").value = ""
    SetTime();
line_number = 0;
end_flag = false;
zeromoji= false;
}))

document.getElementById("time_text").addEventListener('change',(function (){
document.getElementById("time_text_length").innerHTML = document.getElementById("time_text").value.split(/\n/).length+"行"
if(document.getElementById("time_text").value.split(/\n/).length == document.getElementById("lyric_text").value.split(/\n/).length && document.getElementById("time_text").value.split(/\n/).length + document.getElementById("lyric_text").value.split(/\n/).length != 2){
document.getElementById("xml_button").disabled = false;
}else if(document.getElementById("lyric_text").value.split(/\n/).length == 1 || document.getElementById("time_text").value.split(/\n/).length == 1){
document.getElementById("xml_button").disabled = true;
}else{
document.getElementById("xml_button").disabled = true;
}
}))
document.getElementById("lyric_text").addEventListener('change',(function (){
document.getElementById("lyric_text_length").innerHTML = document.getElementById("lyric_text").value.split(/\n/).length+"行"
if(document.getElementById("time_text").value.split(/\n/).length == document.getElementById("lyric_text").value.split(/\n/).length){
document.getElementById("xml_button").disabled = false;
}else if(document.getElementById("lyric_text").value.split(/\n/).length == 0 || document.getElementById("time_text").value.split(/\n/).length == 0){
document.getElementById("xml_button").disabled = true;
}else{
document.getElementById("xml_button").disabled = true;
}
}))

var line_number = 0;
var end_flag = false;
var zeromoji= false;

function SetTime(){
    setTimeout(() => {
        if(document.getElementById("kana").value.length != 0 || zeromoji){
            add_button();
        }else if(document.getElementById("time").value.length == 0){
add_copy()
        }
        if(!end_flag){
            SetTime();
        }
    }, 20);
}
function add_copy(){
        if(document.getElementById("lyric_text").value.split(/\n/)[line_number].length == 0){
zeromoji = true
document.getElementById("time").value = (Number(document.getElementById("time_text").value.split(/\n/)[line_number])+0.2).toFixed(3)
        }else{
document.getElementById("time").value = document.getElementById("time_text").value.split(/\n/)[line_number]
document.getElementById("words").value = document.getElementById("lyric_text").value.split(/\n/)[line_number]

        }
line_number++

    if(document.getElementById('lrcConverTypeKana').checked){
        command_kakasi();
    }else{
        command_kakasi_en();
    }
}

function add_button(){

command_add();
zeromoji=false;
if(document.getElementById("time_text").value.split(/\n/).length <= line_number){
end_flag=true
}
}


