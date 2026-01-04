// ==UserScript==
// @name         Nejire Helper
// @namespace    http://tampermonkey.net/
// @version      0.5.7
// @description  ねじれ村建て補助
// @author       You
// @match        http://nejiten.halfmoon.jp/*date=0
// @match        http://nejiten.halfmoon.jp/*mkvil
// @grant        none

// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404816/Nejire%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/404816/Nejire%20Helper.meta.js
// ==/UserScript==

//====================デフォルト設定====================//
//ONにする属性リスト
const stateTrue = ["dummy_skill", "dummy_limit", "first_fortune", "card", "open_vote", "revote_on", "sleep_on",
                   "duelvote_on","suddenflag", "free_power", "dragon_ball", "follow_message", "revenge_message",
                   "charisma_on", "nekonyan_on", "sympathy_on",
                   "peep_check", "pp_check", "ww_check", "fix_check", "wolf_evo", "per_on", "calumon_on"]

//OFFにする属性リスト
const stateFalse = ["botflag", "death_flag", "first_guard", "night_commit","anonymous_id", "hope_skill", "freename_on", "open_skill", "telepathy_on", "flirt_on"]

//値を変更する属性リスト
const val = { "pass" : "vip",
              "time" : 6, //昼時間変更
              "revote_num" : 2, //再投票回数
              "night_time" : 1, //夜時間変更
              "life_time" : 9, //夜生存者追加時間変更
              "sleep_time" : 15, //二度寝変更
              "composition" : 7, //ランダム
              "charisma_par" : 10, //カリスマ率

             }

var auto_status = 0;

//====================関数====================//
//属性の値を変える関数
function changeValue(name, value){
    $('[name='+ name +']')[0].value = value
}

//属性の状態を変える関数
function changeFlag(name, state){
    $('[name='+ name +']')[0].checked = state
    $('[name='+ name +']')[0].value = state ? "on" : "off"
}

//デフォルトの設定を適用する関数
function defaultSetting(){
    stateTrue.forEach(function(name){
        changeFlag(name, true)
    })

    stateFalse.forEach(function(name){
        changeFlag(name, false)
    })

    Object.keys(val).forEach(function(key){
        changeValue(key, val[key])
    })

    $('[name="open_comp"]')[2].checked = true
}

//入力値を反映する関数
function setSetting(mkvil=false){
    //基本設定
    changeValue("name", $('[name="name_set"]')[0].value) //村の名前
    changeValue("per_name", $('[name="randomset"]')[0].value) //確率編成

    //編集結果反映(村編集画面のみ)
    if(!mkvil){
        changeValue("homuhomu_on", $('[name="homuhomu_set"]')[0].value)
        changeValue("pp_plus", $('[name="pp_set"]')[0].value)
        changeValue("ww_plus", $('[name="ww_set"]')[0].value)
    }

    //キャラクターセット設定(村作成画面のみ)
    if(mkvil){
        var charset = $('[name="charset"]')[0].value
        changeValue("char", charset)
    }

    alert("設定完了")
}

//村人の人数を読み込む関数
function load_surviver(vilId){
  var num
  $.ajax({
    type:'GET',
    url:'/index.cgi?vid=' + vilId + '&date=1',
    async: false,
    dataType:'html'
  })
  .then(
    function(data){
      num = $(data).find('#list table').text().match(/\d+/)
    },
    function(){
      alert("読み込み失敗");
  });
  console.log(num)
  return num
}

function culc_condition(vilId, vilsize, pp_plus){
    return vilsize < 4 ? `村人が少なすぎて計算できません...` : `村の人数${vilsize} 吊り数${Math.floor((vilsize - 2) / 2 )} 人外(人数外含む)${vilsize - Math.floor(vilsize / 2) - parseInt(pp_plus)}`
}

//====================村編集ページ====================//
if(document.URL.match(/date=0/)){
    var $input = $(":input", document.forms[0])
    var $input_copy = $input.clone(false);
    var $input_modified = []

    const vilId = location.search.match(/\d{5,}/)

    var vilsize = load_surviver(vilId)

    $.each($input_copy, function(){
        if(this.name == "char" || this.name == "composition" || this.name == "wide_comp"){
            return true;
        }
        if(this.type == "checkbox") this.value = "off"
        if(this.name == "open_comp") this.value = "2"
        this.type= "hidden"
        $input_modified.push(this)
    });

    var $dummy = jQuery('<div>')
    $dummy.append($input_modified);
    var html = $dummy.html();

    //編集対象のデフォルト値
    const name = $('[name="name"]')[0].value
    const pass = $('[name="pass"]')[0].value
    const char_set = $('[name="char"]')[0].value
    const homuhomu = $('[name="homuhomu_on"]')[0].value
    const composition = $('[name="composition"]')[0].value

    //非フォームinputのデフォルト値(例外処理)
    const wide_comp = $('[name="wide_comp"]')[0].value
    const pp_plus = $('[name="pp_plus"]')[0].value
    const ww_plus = $('[name="ww_plus"]')[0].value

    var message = `"PPチェッカー: ${pp_plus}、人狼チェッカー: ${ww_plus}で開始"`


    if($('[name="per_name"]').length){
        var text = `
        <iframe name="next" style="width:0px;height:0px;border:0px;"></iframe>
        <h2>自動設定</h2>
        <form action="index.cgi" method="post" name="mkvilForm">
　　　　<table>
　　　　<td align="left"><b>つかいかた ： 以下の値を入力 ⇒ 自動設定　⇒ 村編集 (※自動設定しないと反映されません)</b></td>
        <tr><td align="left">村の名前: <input name="name_set" size="4" value="${name}"></td></tr>
        <tr><td align="left">使用するランダム編成: <input name="randomset" size="15" value="ランダム8"></td></tr>
        <tr><td align="left">語尾: <input name="homuhomu_set" size="8" value="${homuhomu}"> </td></tr>
        ${html}
        <tr><td align="left"> PPチェッカー: <input name="pp_set" id="pp_set" size="1" style="width:25px" value=${pp_plus}><input type="button" id="pp_add" value="+" class="submit" style="width:25px"><input type="button" id="pp_sub" value="-" class="submit" style="width:25px"></td></tr>
        <tr><td align="left">人狼チェッカー: <input name="ww_set" id="ww_set" size="1" style="width:25px" value=${ww_plus}><input type="button" id="ww_add" value="+" class="submit" style="width:25px"><input type="button" id="ww_sub" value="-" class="submit" style="width:25px"></td></tr>
        <tr><td align="left">現在の村条件: <div id="condition"></div></td></tr>
        </table>
        <p></p>
        <input type="hidden" name="char" value="${char_set}">
        <input type="hidden" name="composition" value="${composition}">
        <input type="hidden" name="wide_comp" value="${wide_comp}">

        <input type="button" id="auto_generate" value="自動設定" class="submit">
        <input type="submit" id="edit_vil" value="村編集" class="submit">

        <input type="button" id="roll_call" value="点呼開始" class="submit">
        <input type="button" id="kick" value="未点呼退村" class="submit">
        <input type="button" id="start" value="村開始" class="submit">

        </form>

        (テスト機能)
        <form action="index.cgi" method="post" id="config_out" target="next" onSubmit="return alert('告知完了')">
          <input type="hidden" name="cmd" value="msg">
          <input type="hidden" name="guest" value="on">
          <input type="hidden" name="vid" value="${vilId}">
          <input type="hidden" name="j_data" value="日本語のデータ">
          <input type="hidden" name="pass" size="10" value="${pass}">
          <input type="hidden" name="loud" value="on">
          <input type="hidden" name="message" value=${message}>
          <input type="submit" value="村設定告知" class="submit">

          <input type="button" id="auto_mode" style="width:300px" value="えるみぃが何もしてくれないボタン" class="submit">
        </form>

<h2>点呼状況</h2>
<p></p>
<input type="button" id="get_status" value="点呼状況更新" class="submit">
<div id="user_list"></div>
<p></p>
<br>
        <p></p>
        <h2>通常設定</h2>`

        $('[class="mkvil_index"]')[0].insertAdjacentHTML('BeforeBegin', text)

        $('#condition').text(culc_condition(vilId, vilsize, pp_plus))

        $('#user_list').load('http://nejiten.halfmoon.jp/index.cgi?vid=' + vilId + ' #list table');


        $('#get_status')[0].onclick = function(){
            $('#user_list').load('http://nejiten.halfmoon.jp/index.cgi?vid=' + vilId + ' #list table');
        }

        $('#pp_add')[0].onclick = function(){
            if($('#pp_set')[0].value < 5) $('#pp_set')[0].value++
            $('#condition').text(culc_condition(vilId, vilsize, $('[name="pp_set"]')[0].value))
        }

        $('#pp_sub')[0].onclick = function(){
            if($('#pp_set')[0].value > 0) $('#pp_set')[0].value--
            $('#condition').text(culc_condition(vilId, vilsize, $('[name="pp_set"]')[0].value))
        }

        $('#ww_add')[0].onclick = function(){
            if($('#ww_set')[0].value < 5) $('#ww_set')[0].value++
        }

        $('#ww_sub')[0].onclick = function(){
            if($('#ww_set')[0].value > 0) $('#ww_set')[0].value--
        }

        $('#auto_generate')[0].onclick = function(){
            defaultSetting()
            setSetting()
            vilsize = load_surviver(vilId)
            $('#condition').text(culc_condition(vilId, vilsize, $('[name="pp_set"]')[0].value))
        }

        $('#roll_call')[0].onclick = function(){
            $.post("index.cgi", `cmd=tenko&vid=${vilId}&tenko_value=0`)
            vilsize = load_surviver(vilId)
            $('#condition').text(culc_condition(vilId, vilsize, $('[name="pp_set"]')[0].value))
        }

        $('#kick')[0].onclick = function(){
            if(confirm('本当に未点呼者をキックしますか？')){
              $.post("index.cgi", `cmd=exit&vid=${vilId}&exit_id=-1`)
              vilsize = load_surviver(vilId)
              $('#condition').text(culc_condition(vilId, vilsize, $('[name="pp_plus"]')[0].value))
            }
        }

        $('#start')[0].onclick = function(){
            if(confirm(`${load_surviver(vilId)}人で村を開始しますか？`)){
              $.post("index.cgi", `cmd=upstart&vid=${vilId}`)
              window.location.href = `http://nejiten.halfmoon.jp/index.cgi?vid=${vilId}`
            }
        }

        $('#config_out')[0].onclick = function(){
            var num = load_surviver(vilId)
            vilsize = num
            $('#condition').text(culc_condition(vilId, vilsize, $('[name="pp_set"]')[0].value))

            var pnum = $('[name="pp_plus"]')[0].value
            var wnum = $('[name="ww_plus"]')[0].value
            var count = Math.floor((num - 2) / 2)
            var pp = Math.floor(num / 2) + parseInt(pnum)
            var np = num - pp

            $('[name="message"]')[0].value = `PPチェッカー: ${pnum}、人狼チェッカー: ${wnum}で開始...\n 吊り回数 : ${count}回 \n 人数内村人 : ${pp}人 \n 人外(人数外含む) : ${np}人(うち狼${wnum}人)`
        }

        $('[id="auto_mode"]')[0].onclick = function(){
            //var tenko = prompt("何分後に点呼にゃ？")
            //var kicktime = prompt("点呼後何分で村を始めるにゃ？")
            alert("にゃ")
        }
    }
}

//====================村作成ページ====================//
else if(document.URL.match (/mkvil/)){
    text = `
        <h2>自動設定</h2>
　　　　<table>
　　　　<td align="left"><b>つかいかた ： 以下の値を入力 ⇒ 自動設定 ⇒ 村作成</b></td>
        <tr><td align="left">村の名前: <input name="name_set" size="4" value="vip村"></td></tr>
        <tr><td align="left">
        キャラセット: <select name="charset"><option value="1">ねじれ</option><option value="2">東方+橙汁</option><option value="3">人狼審問</option><option value="5">霧雨降る街</option><option value="6">mtmt</option><option value="7">文明開化</option><option value="8">トロイカ</option><option value="9">哀愁のタタロチカ</option><option value="10">なく頃に</option><option value="11">VOCALOID</option><option value="13">ダンガンロンパ</option><option value="14">ライダー</option><option value="15">眠りの園</option><option value="16">azuma</option><option value="17">欧州</option><option value="18">蒸気満ちる宴</option><option value="19">お茶会</option><option value="20">ねこっぷ</option><option value="21">ジランドール</option><option selected value="22">Cathedral</option><option value="23">夜月町</option><option value="24">メトロポリス</option><option value="25">かりんか</option><option value="26">ハロリンカ</option><option value="27">Emoricu</option><option value="28">Cumorie</option><option value="29">Mad Party</option><option value="30">宝石箱《Jewel Box》</option><option value="31">イルミネーション</option><option value="32">演奏会</option><option value="33">学園カテドラル</option><option value="34">おかしな街</option><option value="35">-汝人狼也-人物画</option><option value="36">【H)SOCIUS(A】</option><option value="37">花見会</option><option value="38">花一匁</option><option value="39">いろころる</option><option value="40">ゆるどらる</option><option value="41">南区</option><option value="42">AtoZ</option><option value="43">瑞洋館</option><option value="44">曲芸会</option><option value="45">かくりよ</option><option value="46">狼兎</option><option value="47">曲芸会Hello！</option><option value="48">Liberte</option><option value="49">歳時抄</option><option value="50">魔法少女は眠らない</option><option value="51">Fate/Grand Order</option></select>
        </td></tr>
        <tr><td align="left">使用するランダム編成: <input name="randomset" size="15" value="ランダム8"></td></tr>
        </table>
        <input type="button" id="auto_generate" value="自動設定" class="submit">
        <input type="submit" value="村作成" class="submit">
        <p></p>
        <h2>通常設定</h2>
        `

    $('[class="mkvil_index"]')[0].insertAdjacentHTML('BeforeBegin', text)

    $('[id="auto_generate"]')[0].onclick = function(){
        defaultSetting()
        setSetting(true)
    }
}