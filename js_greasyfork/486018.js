// ==UserScript==
// @name         typing-tube選曲画面追加
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  お手軽選曲
// @author       nora
// @license MIT
// @match        https://typing-tube.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486018/typing-tube%E9%81%B8%E6%9B%B2%E7%94%BB%E9%9D%A2%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/486018/typing-tube%E9%81%B8%E6%9B%B2%E7%94%BB%E9%9D%A2%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==




//設定
var open       = "m" //ctrl+"open"キーで選曲画面を開きます。
var add        = "a" //譜面開始前、ctrl+"add"キーでマイリストへの追加を行えます。

var down       = "f" //"down"キーで1つずつ下に移動します。
var up         = "j" //"up"キーで1つずつ上に移動します。
var transition = " " //"transition"キーを押すと選択した曲へ遷移します。(初期値 = スペースキー)
var copy       = "c" //"copy"キーを押すと選択中の曲のIDをコピーします。
var search     = "f" //ctrl+"search"キーで検索ボックスにフォーカスします。

var width      = 75 //選曲画面の横幅(%)
var height     = 75 //選曲画面の縦幅(%)

















//選曲データの配列を無ければ作成
if (localStorage.getItem("myList") === null) localStorage.setItem("myList","[]");

var scroll = 61.43 - 22.97*5
var scrollCount = 0;
var data = JSON.parse(localStorage.getItem("myList"));
var aelflag = false; //addeventlistener
var romaFlag = true;

//大文字→小文字、カタカナ→ひらがなに変換
function convert(src) {
    let a = src.toLowerCase();
    return a.replace(/[\u30a1-\u30f6]/g,function(match){
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}

//ﾀｲﾂﾍﾞ選曲マイリストに新しい曲データを追加する
function push(){
    let list = JSON.parse(localStorage.getItem("myList"))

    //新しい曲データ
    let id = location.href.split("https://typing-tube.net/movie/show/")[1]
    let title; //デフォルトかカスタムか
    let me_r = parseLyric.romaMedianSpeed.toFixed(2)
    let ma_r = parseLyric.romaMaxSpeed.toFixed(2)
    let me_k = parseLyric.kanaMedianSpeed.toFixed(2)
    let ma_k = parseLyric.kanaMaxSpeed.toFixed(2)

    //idが既にある場合削除するかどうか。
    if(list.filter(e=>e.id==id).length != 0){
        let result = confirm("この曲はお気に入り済みです。データを削除しますか？")
        if(result === true){
            list = list.filter(e=>e["id"] != id);
            localStorage.setItem("myList",JSON.stringify(list));
            alert("データを削除しました。");
        }
        return;
    }

    //曲名をデフォルトかカスタム
    let default_title = player.videoTitle;
    let custom_title = prompt("選曲画面に表示する曲名を設定（デフォルトは空白で送信してください）")

    if (custom_title === null) return; //キャンセルなら終了
    title = custom_title || default_title;

    let item = {"id":id, "title":title, "median_r":me_r, "max_r":ma_r, "median_k":me_k, "max_k":ma_k}

    list.push(item);
    localStorage.setItem("myList",JSON.stringify(list));
}

//中央値と最高値のセルを数値によって背景色変更
function speed_color(){
    document.querySelectorAll(".column_speed").forEach(cell => {
        var value = parseInt(cell.textContent);
        value < 8 ? cell.style.backgroundColor = "#00ff00" :
        value < 12.50 ? cell.style.backgroundColor = "#ffff00" :
        value < 15.00 ? cell.style.backgroundColor = "#ff9900" : cell.style.backgroundColor = "#ff0000";
    });
}

//modeが英語なら文字色を変える
function title_color(){
    document.querySelectorAll(".column_title").forEach((cell,index) => {
        if (data[index].median_r == data[index].median_k) cell.style.color = "rgba(252,124,161)";
    });
}

//選曲画面のセルにデータ配置
function setColumnData(myList){
    let RorK = romaFlag ? "r" : "k"
    myList = myList.sort((a,b)=>b[`median_${RorK}`]-a[`median_${RorK}`]);
    //要素セット
    let HTML = `<tr>
                    <td class="column_ID modal-td" style="cursor: pointer;"></td>
                    <td class="column_title modal-td" style="cursor: pointer;" colspan="2"></td>
                    <td class="column_speed median modal-td"></td>
                    <td class="column_speed max modal-td"></td>
                </tr>`.repeat(myList.length)
    document.getElementById("data_cells").innerHTML = HTML

    //初期値へスクロール
    scroll = 61.43 - 22.97*5;
    scrollCount = 0;
    document.querySelector("#modal > div").scrollTo(0,scroll)

    let id = document.querySelectorAll(".column_ID");
    let title = document.querySelectorAll(".column_title");
    let median = document.querySelectorAll(".median");
    let max = document.querySelectorAll(".max");

    myList.forEach((t,i)=>{ //要素にテキストいれる
        id[i].textContent = "#" + t["id"]
        title[i].textContent = t["title"]
        median[i].textContent = t[`median_${RorK}`]
        max[i].textContent = t[`max_${RorK}`]
    })

    document.getElementsByClassName("column_title")[0].style.cssText += "border:double 3px #007bff";
    speed_color();
    title_color();
    ael();
}

//引数をクリップボードにコピー
function copyText(text,index){
    let copy = document.body.appendChild(document.createElement("textarea"));
    copy.value = text;
    copy.select();
    document.execCommand("copy");
    copy.remove();

    let message = document.getElementById("message");
    let song = document.getElementsByClassName("column_title")[index].textContent;
    message.innerHTML = "<span style='color:#68a5da'>" + song + "</span> のIDをコピーしました！"
    message.style.display = "block";

    //3秒後にメッセージを非表示にする
    setTimeout(function() {
        message.style.display = "none";
    },3000);
}

function ael(){
    //IDのセルをクリックしたときにコピー&メッセージを表示
    document.querySelectorAll(".column_ID").forEach((e,i)=>{
        e.addEventListener("click",()=>{
            let id = e.textContent;
            copyText(id,i)
        });
    });

    //URLのセルをクリックしたときにページ遷移
    document.querySelectorAll(".column_title").forEach((cell,index) => {
        cell.addEventListener("click", function() {
            const message = document.getElementById("message");
            message.innerHTML = "<span style='color:#68a5da'>" + cell.textContent + "</span> へ遷移しています…"
            message.style.display = "block";

            //その曲へ遷移する
            window.location.href = "https://typing-tube.net/movie/show/" + document.getElementsByClassName("column_ID")[index].textContent.slice(1);
        });
    });

    //重複しちゃうやつ
    if(!aelflag){
        aelflag = true
        //速度セルクリックでR,K切り替え
        document.getElementById("median_speed").addEventListener("click",function(){
            let median = document.getElementById("median_speed");
            let max = document.getElementById("max_speed");
            if(romaFlag){
                median.textContent = "中央値(K)";
                max.textContent = "最高(K)";
                median.style.backgroundColor = "#82cf02";
                max.style.backgroundColor = "#82cf02";
                romaFlag = false
            }else if(!romaFlag){
                median.textContent = "中央値(R)";
                max.textContent = "最高(R)";
                median.style.backgroundColor = "#ffa800";
                max.style.backgroundColor = "#ffa800";
                romaFlag = true
            }
            setColumnData(data);
        });

        var modal = document.getElementById("modal")
        var input = document.getElementById("input")
        //選曲キーボードショートカット
        document.addEventListener("keydown",e=>{
            let title = document.getElementsByClassName("column_title")
            if(e.key == down && !e.ctrlKey && scrollCount < data.length-1 && modal.style.display != "none" && !(document.activeElement == input)){
                //"down"キーでセル下移動
                scrollCount++;
                title[scrollCount-1].style.removeProperty('border');
                title[scrollCount].style.cssText += "border:double 3px #007bff";
                document.querySelector("#modal > div").scrollTo(0,scroll + scrollCount*22.97)
            }else if(e.key == up && !e.ctrlKey && scrollCount > 0 && modal.style.display != "none" && !(document.activeElement == input)){
                //"up"キーでセル上移動
                scrollCount--;
                title[scrollCount+1].style.removeProperty('border');
                title[scrollCount].style.cssText += "border: double 3px #007bff;";
                document.querySelector("#modal > div").scrollTo(0,scroll + scrollCount*22.97)
            }else if(e.key == transition && !e.ctrlKey && modal.style.display != "none"){
                //"transition"キーで曲遷移
                location.href = "https://typing-tube.net/movie/show/" + document.getElementsByClassName("column_ID")[scrollCount].textContent.replace("#","")
                const message = document.getElementById("message");
                message.innerHTML = "<span style='color:#68a5da'>" + document.getElementsByClassName("column_title")[scrollCount].textContent + "</span> へ遷移しています..."
                message.style.display = "block";
            }else if(e.key == copy && !e.ctrlKey && modal.style.display != "none"){
                //"copy"キーでIDコピー
                copyText(document.getElementsByClassName("column_ID")[scrollCount].textContent,scrollCount)
            }else if(e.key == search && e.ctrlKey && modal.style.display != "none"){
                //ctrl+"search"でinputにフォーカス
                e.preventDefault();
                input.focus();
            }else if(e.code == "Escape" && modal.style.display != "none"){
                //Escapeキーで選曲画面を閉じる
                modal.style.display = "none";
            }
        })

        input.addEventListener("keydown",e=>{
            if(e.code == "Enter"){
                let key = e.target.value //入力された文字をkeyに代入
                //マイリストからkeyが含まれてるtitleを抽出
                data = JSON.parse(localStorage.getItem("myList")).filter(t=>convert(t["title"]).includes(convert(key)))
                e.target.blur();
                e.target.value = "" //input欄をクリア

                setColumnData(data);
            }
        });

        //選曲画面の外をクリックで閉じる
        document.addEventListener("click",function(e){
            if (e.target == modal) {
                modal.style.display = "none";
            }
        })
    }
}

let modalHTML = `
    <div id="modal" style="display: none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.7); z-index:2147483647;">
        <div class="modal-content" style="background-color:#fff; margin:5% auto; border:1px solid #888; width:${width}%; height:${height}%; text-align:center; position:relative; overflow:auto;">
            <div id="message" class="copy-header"></div>
            <table style="width:100%; table-layout:fixed; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th class="modal-th">ID</th>
                        <th class="modal-th" colspan="2" id="title"><input id="input" placeholder="キーワードを入れて検索" style="width:100%;">曲名&nbsp/&nbsp検索</th>
                        <th class="modal-th" id="median_speed" style="cursor:pointer; background-color:#ffa800;">中央値(R)</th>
                        <th class="modal-th" id="max_speed" style="background-color:#ffa800;">最高(R)</th>
                    </tr>
                </thead>
                <tbody id="data_cells">
                    <!-- data配列の要素分だけ行を作る -->
                </tbody>
            </table>
        </div>
    </div>`;

let modalCSS = `
.modal-th{
    border: 1px solid #888;
    text-align: center;
    padding: 8px;
    background-color: #bebdc2;
    color: black;
}
.modal-th:hover{
    background-color: #9fa1a7;
}
.modal-td{
    color: black;
    border: 1px solid #888;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: black;
}
.modal-td:hover{
    background-color: #d9ebf9;
}
.modal-td:active {
    background-color: #bcdcf4;
}
.copy-header{
    display: none;
    background-color: #50505a;
    color: white;
    position: sticky;
    top: 0;
}`;

//HTMLくっつけ
document.body.insertAdjacentHTML("beforeend",modalHTML);

//styleくっつけ
document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:modalCSS}));

//選曲画面開くボタンくっつけ
document.querySelector("a[href='/kids']").parentElement.insertAdjacentHTML("beforebegin","<li class='navigation__sub @@variantsactive'><a class='text-nowrap' id='music-select'><i class='icon-search' style='font-size:20p'></i>選曲</a></li>");

//練習モードで開始ボタンの左にマイリストに追加ボタンくっつけ
if(document.getElementById("practice-mode-button")){
    document.getElementById("practice-mode-button").insertAdjacentHTML("beforebegin",`<span class="btn btn-border" id="list-btn" style="cursor:pointer">マイリスト${JSON.parse(localStorage.myList).filter(e=>e["id"] == location.href.replace(/\D/g,"")).length == 0 ? "へ追加" : "から削除"}</span>`);
    document.getElementById("list-btn").addEventListener("click",push);
}

//選曲画面開くショートカット
document.addEventListener("keydown",e=>{if(e.key == open && e.ctrlKey){e.preventDefault();document.getElementById("music-select").click()}})

//マイリスト追加ショートカット
document.addEventListener("keydown",e=>{
    if(e.key == add && e.ctrlKey){
        e.preventDefault();
        document.getElementById("list-btn").click();
    }
})

//新しく設置した要素をクリックしたときにモーダルダイアログを表示させる
document.getElementById("music-select").addEventListener("click", function() {
    //画面に表示する
    modal.style.display = "block";

    //各列のデータをセット
    setColumnData(JSON.parse(localStorage.getItem("myList")));
});