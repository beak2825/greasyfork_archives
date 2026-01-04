// ==UserScript==
// @name         さくタイ+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  正確性を表示(さくタイに組み込みVer)
// @author       つべ
// @license MIT
// @match        http://typing.tsurizamurai.com/daken*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493785/%E3%81%95%E3%81%8F%E3%82%BF%E3%82%A4%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/493785/%E3%81%95%E3%81%8F%E3%82%BF%E3%82%A4%2B.meta.js
// ==/UserScript==
const t_list = [50,100,200,300,400,500,600,700,800];
let list_cnt = 0;

document.getElementsByClassName("count")[0].insertAdjacentHTML('beforebegin',`<td id="acc_cnt" width="80"><div id="acc">0</div></td>
<td id="countlabelS" width="110" style="font-size: 21.3333px;">正確率</td>`)

/**
 * 既存関数showCountを書換
 * 打鍵＆ミス数更新時に正確率を更新する処理を追加。
 *
 * dakencount {さくタイ既存のタイピングカウント用のグローバル変数}
 * misscount {さくタイ既存のミスカウント用のグローバル変数}
 */

function D(T,Ntime){
    Textarea.value = `${T}打鍵: 残り${Ntime}秒\n${Textarea.value}`;
}

showCount = function() {
    if (softflg == 0) {
        document.getElementById("daken").innerHTML = dakencount;
        document.getElementById("miss").innerHTML = misscount;
        acc_display()
    } else {
        document.getElementById("daken").innerHTML = dakencount;
        document.getElementById("miss").innerHTML = misscount;
        acc_display()
    }

    if(dakencount == t_list[list_cnt]){
        D(t_list[list_cnt],time.textContent);
        if(list_cnt <= t_list.length){
            list_cnt++;
        }
    }
}

/*ラップタイムここまで*/

/**
 * 既存関数countDownを書換
 * 開始前の3秒カウントダウンをacc要素にも表示
 */
countDown = function (){
    if(--stcountNum < 0){
        setSearchStr();
        startflg = true;
        nowtime = new Date();
        starttime = nowtime.getTime();
        timeStart();
        setText(true);
        showCount();
    }else{
        if(softflg == 0){
            document.getElementById("daken").innerHTML = stcountNum + 1;
            document.getElementById("miss").innerHTML = stcountNum + 1;
            document.getElementById("time").innerHTML = stcountNum + 1;
            document.getElementById("acc").innerText = stcountNum + 1
        }else{
            document.getElementById("daken").innerHTML = stcountNum + 1;
            document.getElementById("miss").innerHTML = stcountNum + 1;
            document.getElementById("time").innerHTML = stcountNum + 1;
            document.getElementById("acc").innerText = stcountNum + 1
        }
        timerID1 = setTimeout("countDown()", 1000);
    }
}


function acc_display(){
    const ACC = dakencount/(dakencount+misscount)*1000
    const ACC_floor = Math.floor(ACC)/10

    //sei1変数がNaNだった場合は100を表示。
    document.getElementById("acc").innerText = isNaN(ACC_floor) ? 100 : ACC_floor;
}

//

const text1 = document.getElementsByClassName('text1')[0].parentElement;
text1.parentElement.firstElementChild.remove();
text1.insertAdjacentHTML("beforebegin",`<textarea id="record_area"></textarea>`);
document.body.insertAdjacentHTML("beforeend",`<style>

#acc_cnt{
    background-color: rgb(255, 238, 255);
}
#acc{
    font-size: 22.6667px;
    color: rgb(128, 0, 128);
    text-align: center;
}
textarea{
    height: 5vh;
    width: 72.95vw;
    background-color: #ffdab6;
    border: solid 1px #cc99cc;
    resize: none;
    font-weight: bold;
    font-family: "ＭＳ Ｐゴシック";
    color: #003300;
    font-size: 1.5em;
    border-bottom: 0px;
}

textarea::-webkit-scrollbar {
  width: 0.5em; /* スクロールバーの幅 */
}

textarea::-webkit-scrollbar-thumb {
  background-color: transparent; /* スクロールバーのボタン部分の背景色 */
}

/* フォーカス時のスタイル */
textarea:focus {
  border: solid 1px #cc99cc;
  outline: none; /* フォーカス時のデフォルトの青い輪郭を削除 */
}

</style>`)

const Textarea = document.getElementById('record_area'),
      acc = document.getElementById('acc'),
      daken = document.getElementById('daken'),
      miss = document.getElementById('miss'),
      time = document.getElementById('time');

timeStop = function(){
    startflg = false;
    clearTimeout(timerID1);
    clearTimeout(timerID2);
    list_cnt = 0;
    var now = new Date();
    document.form1.para2.value = now.getTime();
    keyPressClear(keypress);
    if(softflg == 0){music.src = "";}
    /*ここから追加処理*/
    if(time.textContent =="0" || time.textContent =="1"){
        Textarea.value = `${acc.textContent}正確率 ${daken.textContent}打鍵 ${miss.textContent}ミス ☆完走☆\n` + Textarea.value;
    }else{
        Textarea.value = `${acc.textContent}正確率 ${daken.textContent}打鍵 ${miss.textContent}ミス ${time.textContent}残り時間\n` + Textarea.value;
    }
}

Textarea.addEventListener('focus',()=>Textarea.style.height = "50vh");
Textarea.addEventListener('blur',()=>{
    Textarea.style.height = "5vh";
    document.getElementsByClassName('start')[0].focus();
    document.getElementsByTagName('table')[1].scrollIntoView(true);
    scrollBy(0,-35);
});