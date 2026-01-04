// ==UserScript==
// @name         e-タイプ数カウンター
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  localStorageにエタイ腕試しでの様々な記録を保存します。
// @author       norara
// @license MIT
// @match        https://www.e-typing.ne.jp/*
// @exclude      https://www.e-typing.ne.jp/app/ad*
// @icon         https://www.e-typing.ne.jp/images/kana/typing/variety/ico_keybo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483038/e-%E3%82%BF%E3%82%A4%E3%83%97%E6%95%B0%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/483038/e-%E3%82%BF%E3%82%A4%E3%83%97%E6%95%B0%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

if(location.href.match("app") && location.href.includes("trysc.trysc.trysc")){ //いふらーめが開かれたときに実行されるコード
    function etyEx(rankingLength,mode){
        this.k = JSON.parse(localStorage.getItem("log_typingKeyCodeCount"))
        this.ac = JSON.parse(localStorage.getItem("log_allTypingCount"));
        this.dc = JSON.parse(localStorage.getItem("log_dayTypingCount"));
        this.rc = JSON.parse(localStorage.getItem("log_registCount"));

        this.lm; //LogMessage
        this.m = mode; //ローマ字英語かな
        this.mi = "REK".indexOf(this.m); //localStorageの配列の順番
        this.now = new Date().toLocaleString().split(" ")[0]; // XXXX/XX/XX
        this.rl = rankingLength; //default = 30
        this.t; //いろはかるた とか

        this.iframe_observer();
        document.addEventListener("keyup",e=>this.keyupEvent.bind(this));
    }

    etyEx.prototype.keyupEvent = function(e){
        this.ac[this.mi]++ //単純な打鍵回数のログ
        this.ac[3]++
        this.dc[this.mi] = Number(this.dc[this.mi].split("_")[0]) + 1 + `_${this.now}`;
        this.dc[3] = Number(this.dc[3].split("_")[0]) + 1 + `_${this.now}`;

        this.k[this.mi][e.code] ?
            (this.k[this.mi][e.code]++,this.k[3][e.code]++) :
        (this.k[this.mi]["その他"]++,this.k[3]["その他"]++)

        localStorage.setItem("log_typingCodeCount",JSON.stringify(this.k));
        localStorage.setItem("log_allTypingCount",JSON.stringify(this.ac));
        localStorage.setItem("log_dayTypingCount",JSON.stringify(this.dc));
    }

    etyEx.prototype.iframe_observer = function(){
        let registFlag;
        const observer = new MutationObserver(e=>{
            let add = e[0].addedNodes[0];
            let remove = e[0].removedNodes[0];
            if(remove && remove.id == "hands"){
                registFlag = false; //リザルト生成しなおしたので成績登録できるように
                const result_observer = new MutationObserver(e=>{
                    if($("#btn_area").length){
                        result_observer.disconnect(); //リザルト生成されたら監視解除
                        if(!registFlag && $("#regist_btn").length){
                            registFlag = true;
                            this.logMessage = [];
                            this.rc[this.mi]++
                            this.rc[3]++
                            localStorage.setItem("log_registCount",JSON.stringify(this.rc));
                            this.rr_themeData(Number($(".data").eq(0).text()))
                            this.rr_compData();
                            this.rr_wordData();
                            this.registKeyCount();
                            this.sum_avg();
                            console.log("成績登録完了しました。")
                            window.parent.postMessage(this.logMessage);
                        }
                    }else if(e[0].addedNodes[0] && e[0].addedNodes[0].id == "error_view"){
                        targetClick(document.getElementById("error_view_retry_btn"))
                    }
                })
                result_observer.observe($("#result").get(0),{childList:true})
            }else if(add && add.id == "start_view"){
                setTimeout(()=>{targetClick(document.getElementById("start_btn"))},100); //安定しなかったのでsetTimeout使用 ナンデ...

                this.t = $(".title").eq(0).text()

                //モード別その週のお題をログに保存する
                this.get_theme(`${this.t}_${this.now}`);
                //モード別の1日打鍵数ランキング登録
                this.rr_dayTypingCount(this.t);
            }else if(add && add.id == "error_view"){
                //例題読み込みエラー がでたらエンターで押せるように要素改変
                targetClick(document.getElementById("retry_btn"));
            }
        })
        observer.observe($("#app").get(0),{childList:true})
    }

    etyEx.prototype.get_theme = function(data){
        //"数のある言葉_2024/2/14"など
        const thisWeek = JSON.parse(localStorage.getItem("log_thisWeekTheme"))

        //以前のお題の時の日付 (theme_1970/1/1 ←この日付)
        const p = new Date(thisWeek[this.mi].split("_")[1])
        //pの日付をそのお題のが含まれている週(日曜～月曜)の日曜日にする
        const pws = new Date(p.setDate(p.getDate() - (p.getDay() == 0 ? 7 : p.getDay() == 1 ? 8 : p.getDay())));
        //pwsの日付に2を足して以前のお題が更新されたときの日付にする
        const pw = new Date(pws.setDate(pws.getDate()+2)).toLocaleString().split(" ")[0];

        //現在の週
        const c = new Date(data.split("_")[1]);//現在の日付
        const cws = new Date(c.setDate(c.getDate() - (c.getDay() == 0 ? 7 : c.getDay() == 1 ? 8 : c.getDay())));
        const cw = new Date(cws.setDate(cws.getDate()+2)).toLocaleString().split(" ")[0];

        if(pw !== cw){
            thisWeek[this.mi] = data
            localStorage.setItem("log_thisWeekTheme",JSON.stringify(thisWeek))
            alert(`今週のテーマ(${this.m}) ${data.split("_")[0]} を登録しました。`)
        }else{
            console.log(`今週のテーマ(${this.m})は登録済みです。`)
        }
    }

    //ランキング登録系
    etyEx.prototype.rr_themeData = function(score){
        let day = new Date().toLocaleString(); //時間 (XXXX/XX/XX XX:XX:XX)
        let log = JSON.parse(localStorage.getItem("logR_themeScore")); //ワード別スコアランキング取得
        let ranking = log[this.mi];
        ranking[this.t] !== undefined ? ranking[this.t].push(`${score}_${day}`) : ranking[this.t] = [`${score}_${day}`]; //初めて登録するワードは新しく作る
        ranking[this.t].sort((a,b)=>b.split("_")[0]-a.split("_")[0]) //ワード毎のスコアランキングを降順に並び替える
        log[this.mi][this.t] = ranking[this.t].slice(0,this.rl)

        localStorage.setItem("logR_themeScore",JSON.stringify(log))
    }

    etyEx.prototype.rr_compData = function(){
        let data = ["0_compScore","2_compInputTime","3_compStr1","3_compStr2","5_compKPM","7_compLatency","8_compRKPM"];
        let day = new Date().toLocaleString()
        //文字数、昇順のものを除いたランキング登録
        for(let i=0;data.length>i;i++){
            let log = JSON.parse(localStorage.getItem(`logR_${data[i].split("_")[1]}`))
            let ranking = log[this.mi];
            let text = $(".data").eq(data[i].split("_")[0]).text();
            //入力時間じゃないならそのままtext
            let result = !text.includes("秒") ? text : text.includes("分") ? text.split("分")[0]*60 + parseFloat(text.split("分")[1].replace("秒",".")) : text.replace("秒",".");
            ranking.push(result + `_${this.t}_${day}`)

            //ランキングを並び替え
            switch(data[i].split("comp")[1]){
                case "Score":
                case "Str1":
                case "KPM":
                case "RKPM": //降順で並び替え
                    ranking.sort((a,b) => parseFloat(b.split("_")[0]) - parseFloat(a.split("_")[0]))
                    break;
                case "InputTime":
                case "Str2":
                case "Latency": //昇順で並び替え
                    ranking.sort((a,b) => parseFloat(a.split("_")[0]) - parseFloat(b.split("_")[0]))
                    break;
            }
            log[this.mi] = ranking.slice(0,this.rl); //そのモードのランキングを更新
            this.addLogMessage(log[this.mi],day,data[i].split("_")[1])
            localStorage.setItem(`logR_${data[i].split("_")[1]}`,JSON.stringify(log));
        }
    }

    etyEx.prototype.rr_wordData = function(){
        let data = ["wordInputTime","wordStr1","wordStr2","wordKPM","wordLatency","wordRKPM",];
        let day = new Date().toLocaleString(); //現在の日付(XXXX/XX/XX)
        for(let i=0;data.length>i;i++){
            for(let j=0;$(".sentence").length>j;j++){
                //モードが英語ならワードの情報をローマ字の部分にする
                let word = this.m == "E" ? $(".sentence").eq(j).text() : $(".example").eq(j).text();//聞いて極楽見て地獄
                let wordLength = $(".sentence").eq(j).text().length;//KIITEGOKURAKUMITEJIGOKUなどの長さ
                let plus = document.querySelectorAll("#exampleList ul li")[j].children[2].textContent.split(",");//chrome拡張 "e-typing plus" で追加された要素
                //ログのワード毎ランキング
                let log = JSON.parse(localStorage.getItem(`logR_${data[i]}`));
                let ranking = log[this.mi];
                switch (data[i]){
                    case "wordKPM":
                    case "wordRKPM": //plusから取得する部分
                    case "wordLatency": //wordLatencyは昇順
                        ranking.push(plus[data[i] == "wordLatency" ? 0 : data[i] == "wordKPM" ? 1 : 2].replace(/[^\d.]/g,"") + `_${word}_${day}`);
                        ranking.sort((a,b) => data[i] == "wordLatency" ? parseFloat(a.split("_")[0]) - parseFloat(b.split("_")[0]) : parseFloat(b.split("_")[0]) - parseFloat(a.split("_")[0]));
                        break;
                    case "wordStr1": //ワード自体から取得するやつ
                    case "wordStr2": //2は少ないランキング = 昇順
                        ranking.push(wordLength + `_${word}_${day}`);
                        ranking.sort((a,b) => data[i] === "wordStr2" ? parseFloat(a.split("_")[0]) - parseFloat(b.split("_")[0]) : parseFloat(b.split("_")[0]) - parseFloat(a.split("_")[0]));
                        break;
                    case "wordInputTime": //ワードごとの入力時間計算
                        ranking.push((wordLength / (plus[1].replace(/[^\d.]/g,"") / 60)).toFixed(3) + `_${word}_${day}`);
                        ranking.sort((a,b) => parseFloat(a.split("_")[0]) - parseFloat(b.split("_")[0]));
                        break;
                }
                log[this.mi] = ranking.slice(0,this.rl); //そのモードのランキングを更新
                if (j == $(".sentence").length-1) this.addLogMessage(log[this.mi],day,data[i])
                localStorage.setItem(`logR_${data[i]}`,JSON.stringify(log));
            }
        }
    }

    etyEx.prototype.rr_dayTypingCount = function(){
        //countのlengthだけ繰り返し、日付が違うなら各モードの1日打鍵数に登録する。
        let flag = false;
        let count = JSON.parse(localStorage.getItem("log_dayTypingCount")) //[a,a,a,a]
        for(let i=0;i<4;i++){
            if(count[i].split("_")[2] != this.now){
                flag = true;
                let prc = count[i].split("_"); //[0]=打鍵数 [1]=テーマ [2]=日付 (ALLはテーマがない
                let log = JSON.parse(localStorage.getItem("logR_dayTypingCount")); //1日打鍵数のランキング
                //ランキングに登録する
                let ranking = log[i];
                ranking.push(`${prc[0]}_${prc[1]}_${prc[2]}`);
                ranking.sort((a,b) => parseFloat(b.split("_")[0]) - parseFloat(a.split("_")[0]))
                log[i] = ranking.slice(0,this.rl);
                localStorage.setItem("logR_dayTypingCount",JSON.stringify(log));

                //1日打鍵数をリセットする
                count[i] = i == 3 ? `0_-_${this.now}` : `0_${JSON.parse(localStorage.getItem("log_thisWeekTheme"))[i].split("_")[0]}_${this.now}`;
                //リセットしたカウンターをセットする
                if (i == 3) localStorage.setItem("log_dayTypingCount",JSON.stringify(count))
            }
        }
        console.log(flag ? "以前の1日打鍵数をランキング登録しました。" : "今日の打鍵数はランキング登録済みです。")
    }

    etyEx.prototype.registKeyCount = function(){
        let rkc = JSON.parse(localStorage.getItem("log_registKeyCount"))
        //問題文 (ローマ字部分
        let e = $(".sentence");
        //モード別のログ
        let log = rkc[this.mi];
        for(let i=0;i<e.length;i++){
            let text = e.eq(i).text().toLowerCase();
            for(let j=0;j<text.length;j++){
                if(log[text[j]] === undefined && text[j] !== " "){
                    log["その他"]++;
                }else if(this.m === "E" && text[j] === " "){
                    log["Space"]++;
                };
                log[text[j]]++;
            }
        }

        //英語は何故かスペースが1つ" ":nullという値になるのでそいつ消す
        if (this.m === "E") delete log[" "];
        rkc[this.mi] = log
        localStorage.setItem("log_registKeyCount",JSON.stringify(rkc))
    }

    etyEx.prototype.sum_avg = function(){
        let data = $(".data");
        let rc = JSON.parse(localStorage.getItem("log_registCount"))[this.mi]; //registCount
        let sum = JSON.parse(localStorage.getItem("log_registDataSum"));
        let s = sum[this.mi]; //モード別のsumログ
        s.score += parseFloat(data.eq(0).text());
        s.inputTime += data.eq(2).text().includes("分") ? data.eq(2).text().split("分")[0] * 60 + parseFloat(data.eq(2).text().split("分")[1].replace("秒",".")) : parseFloat(data.eq(2).text().replace("秒","."))
        s.str += parseFloat(data.eq(3).text());
        s.miss += parseFloat(data.eq(4).text());
        s.WPM += parseFloat(data.eq(5).text());
        s.accuracyStr += data.eq(3).text() * (data.eq(6).text().replace("%","") / 100);
        s.latency += parseFloat(data.eq(7).text());
        s.RKPM += parseFloat(data.eq(8).text());

        let avg = JSON.parse(localStorage.getItem("log_registDataAvg"));
        let a = avg[this.mi]; //モード別のavgログ
        a.score = s.score / rc
        a.inputTime = s.inputTime / rc
        a.str = s.str / rc
        a.miss = s.miss / rc
        a.WPM = s.WPM / rc
        a.accuracy = s.accuracyStr / s.str * 100
        a.latency = s.latency / rc
        a.RKPM = s.RKPM / rc

        sum[this.mi] = s;
        avg[this.mi] = a;
        localStorage.setItem("log_registDataSum",JSON.stringify(sum));
        localStorage.setItem("log_registDataAvg",JSON.stringify(avg));
    }

    etyEx.prototype.addLogMessage = function(data,day,registMode){
        registMode = ({
            "compScore":"スコア","compInputTime":"入力時間","compStr1":"入力文字数(多)","compStr2":"入力文字数(少)","compKPM":"KPM","compLatency":"初速","compRKPM":"RKPM",
            "wordInputTime":"ワード別入力時間","wordStr1":"ワード別入力文字数(多)","wordStr2":"ワード別入力文字数(少)","wordKPM":"ワード別KPM","wordLatency":"ワード別初速","wordRKPM":"ワード別RKPM",
        })[registMode];
        let unit = registMode.match("スコア") ? "pt" :
        registMode.match(/(時間|初速)/) ? "秒" :
        registMode.match("文字数") ? "文字" :
        registMode.match("KPM") ? registMode.replace(/[^A-Z]/g,"") : "---深刻なエラーが発生しました---";
        $.each(data,(rank,e)=>{
            if(e.split("_")[2] == day){
                let word = e.split("_")[1];
                let record = e.split("_")[0]
                this.logMessage.push({"registMode":registMode,"word":word,"rank":rank+1,"record":record,"unit":unit})
            }
        })
    }

    function targetClick(target){
        target.setAttribute("tabindex","0"); //focus()できるようにする
        target.focus();
        target.onkeydown = e=>{if(e.code == "Enter")target.click()}; //Enterでクリックできるように
    }

    new etyEx(30,location.href.match("std.0") ? "R" : location.href.match("std.2") ? "E" : "K")
}else{ //iframe以外に実行させるコード
	document.addEventListener("keydown",e=>{
		if(e.code == "Enter" && !document.getElementsByClassName("pp_overlay")[0]){
			document.querySelector("a[title='腕試しレベルチェック']")?.click();
		}
	})
    //HTML,CSSセット
    setHTML();
    setCSS();
    //ランクインのメッセージを表示する
    function showLogMessage(logMessage) {
        let log = document.getElementById("logMessage");
        let i = 0;
        (function repeat(count){
            document.getElementById("message-1").innerHTML = logMessage[i]["registMode"] + "のランキング" + logMessage[i]["rank"] + "位にランクイン！" + `<span style="color:#000;font-size:0.5em;">&nbsp;${i+1}/${logMessage.length}</span>`;
            document.getElementById("message-2").innerHTML = "ワード&nbsp;:&nbsp;" + logMessage[i]["word"];
            document.getElementById("message-3").innerHTML = "記録&nbsp;:&nbsp;" + logMessage[i]["record"] + logMessage[i]["unit"];
            log.style.top = "0";
            setTimeout(() => {
                log.style.top = "-150px";
                if (count > 1) setTimeout(() => repeat(count - 1),750); i++;
            },3000);
        })(logMessage.length)
    }

    //iframeからshowLogMessageの引数を受け取り実行するためのリスナー
    window.addEventListener("message",argument=>showLogMessage(argument.data));

    var aelFlag = false;
function open(){
    document.getElementById("overlay").style.display = "block";
    document.getElementById("game-screen").style.display = "block";
    document.getElementById("game-view2").style.display = "block";

    //各モードの成績登録回数が0ならALLウィンドウへの打鍵数以外のe-タイプ数カウンターのセレクトを消す
    let modes = "REK"
    for(let i=1;i<=modes.length;i++){
        if(JSON.parse(localStorage["log_registCount"])[i-1] == 0){
            if(document.getElementById(`etc${i}`))document.getElementById(`etc${i}`).remove();
            if(document.getElementById(`etc${i+3}`))document.getElementById(`etc${i+3}`).remove();
        }
    }

    if(JSON.parse(localStorage.log_keydownCount)[3] == 0){
        console.log("いふらーめで打鍵してね")
        //閉じるボタンを押したときの動作
        if(!aelFlag){document.getElementById("close-button1").addEventListener("click",()=>{
            aelFlag = true;
            document.getElementById("overlay").style.display = "none";
            document.getElementById("game-screen").style.display = "none";
            document.getElementById("game-view2").style.display = "none";
            document.getElementById("log-ranking").style.display = "none";
        })}
        document.getElementById("text-container").innerHTML="<div></div><div style='text-align:center'>iframeで打鍵してください</div><div style='text-align:right; font-size:8px'>できたら再読み込みしてね!</div>"
    }else{
        function setKeyData(log,mode){
            document.getElementById("game-screen").style.display = "block";
            document.getElementById("game-view2").style.display = "block";
            document.getElementById("select").style.display = "none";
            document.getElementById("log-ranking").style.display = "none";

            document.getElementById("virtual-keyboard").innerHTML = `
            <div class="key_ESC" name="Escape">ESC</div>
            <div class="key_F1" name="F1">F1</div>
            <div class="key_F2" name="F2">F2</div>
            <div class="key_F3" name="F3">F3</div>
            <div class="key_F4" name="F4">F4</div>
            <div class="key_F5" name="F5">F5</div>
            <div class="key_F6" name="F6">F6</div>
            <div class="key_F7" name="F7">F7</div>
            <div class="key_F8" name="F8">F8</div>
            <div class="key_F9" name="F9">F9</div>
            <div class="key_F10" name="F10">F10</div>
            <div class="key_F11" name="F11">F11</div>
            <div class="key_F12" name="F12">F12</div>
            <div class="deco_key1" name="全角/半角">漢</div>
            <div class="key_1" name="1">1</div>
            <div class="key_2" name="2">2</div>
            <div class="key_3" name="3">3</div>
            <div class="key_4" name="4">4</div>
            <div class="key_5" name="5">5</div>
            <div class="key_6" name="6">6</div>
            <div class="key_7" name="7">7</div>
            <div class="key_8" name="8">8</div>
            <div class="key_9" name="9">9</div>
            <div class="key_0" name="0">0</div>
            <div class="key_hyphen" name="-">-</div>
            <div class="deco_key2" name="^">^</div>
            <div class="deco_key3" name="IntlYen">&yen;</div>
            <div class="deco_key4" name="Backspace">BS</div>
            <div class="deco_key5" name="Tab">Tab</div>
            <div class="key_q" name="Q">Q</div>
            <div class="key_w" name="W">W</div>
            <div class="key_e" name="E">E</div>
            <div class="key_r" name="R">R</div>
            <div class="key_t" name="T">T</div>
            <div class="key_y" name="Y">Y</div>
            <div class="key_u" name="U">U</div>
            <div class="key_i" name="I">I</div>
            <div class="key_o" name="O">O</div>
            <div class="key_p" name="P">P</div>
            <div class="key_atmark" name="@">@</div>
            <div class="deco_key6" name="[">[</div>
            <div class="key_Enter" name="Enter">Enter</div>
            <div class="deco_key7" name="CapsLock">Caps</div>
            <div class="key_a" name="A">A</div>
            <div class="key_s" name="S">S</div>
            <div class="key_d" name="D">D</div>
            <div class="key_f" name="F">F</div>
            <div class="key_g" name="G">G</div>
            <div class="key_h" name="H">H</div>
            <div class="key_j" name="J">J</div>
            <div class="key_k" name="K">K</div>
            <div class="key_l" name="L">L</div>
            <div class="key_semicolon" name=";">;</div>
            <div class="key_colon" name=":">:</div>
            <div class="deco_key8" name="]">]</div>
            <div class="key_lShift" name="左シフト">shift</div>
            <div class="key_z" name="Z">Z</div>
            <div class="key_x" name="X">X</div>
            <div class="key_c" name="C">C</div>
            <div class="key_v" name="V">V</div>
            <div class="key_b" name="B">B</div>
            <div class="key_n" name="N">N</div>
            <div class="key_m" name="M">M</div>
            <div class="key_comma" name=",">,</div>
            <div class="key_period" name=".">.</div>
            <div class="key_slash" name="/">/</div>
            <div class="deco_key9" name="バックスラッシュ">＼</div>
            <div class="key_rShift" name="右シフト">shift</div>
            <div class="deco_key10" name="左Ctrl">Ctrl</div>
            <div class="deco_key11" name="Windows">Win</div>
            <div class="deco_key12" name="左Alt">Alt</div>
            <div class="deco_key13" name="無変換">無変</div>
            <div class="key_space" name="Space">space</div>
            <div class="deco_key14" name="変換">変換</div>
            <div class="deco_key15" name="カタカナ">かな</div>
            <div class="deco_key16" name="右Alt">Alt</div>
            <div class="deco_key17" name="ContextMenu">▤</div>
            <div class="deco_key18" name="右Ctrl">Ctrl</div>`

            //トータルとか今日の打鍵数の部分をモード別にする
            var kor = log.match("regist") ? "registDataSum" : "keydownCount"
            var modeIndex = "REKA".indexOf(mode);
            console.log("もーどいんでっくす : " + modeIndex)

            var total = kor == "registDataSum" ? JSON.parse(localStorage[`log_${kor}`])[modeIndex].str : JSON.parse(localStorage[`log_${kor}`])[modeIndex]
            var day = Math.floor((new Date()-new Date(localStorage.log_start.split(" ")[0].replace("/","-"))) / (1000*60*60*24)) + 1;
            var todayCount = Number(JSON.parse(localStorage.log_dayKeyCount)[modeIndex].split("_")[0]).toLocaleString()
            var average = parseInt(total / day);
            var registCount = JSON.parse(localStorage.log_registCount)[modeIndex];
            var maxCount = JSON.parse(localStorage.log_dayKeydown)[modeIndex][0].split("_")[0];
            var maxCountTheme = JSON.parse(localStorage.log_dayKeydown)[modeIndex][0].split("_")[1];
            var maxCountDay = JSON.parse(localStorage.log_dayKeydown)[modeIndex][0].split("_")[mode == "A" ? 1 : 2];

            document.getElementById("total").textContent = Number(total).toLocaleString();
            document.getElementById("today").textContent = kor == "registDataSum" ? "-" : todayCount;//registには1日ごとのデータがない（めんどくさい
            document.getElementById("average").textContent = Number(average).toLocaleString();
            document.getElementById("registCount").textContent = Number(registCount).toLocaleString();
            document.getElementById("maxCount").textContent = kor == "registDataSum" ? "-" : Number(maxCount).toLocaleString();
            document.getElementById("maxCount").title = kor == "registDataSum" ? "-" : maxCountTheme;
            document.getElementById("maxCountDay").textContent = kor == "registDataSum" ? "最大 -" : "最大 " + maxCountDay;
            document.getElementById("day").textContent = Number(day).toLocaleString();
            //key-dataの要素
            var keyName = document.getElementById("keyName");
            var keyTotal = document.getElementById("keyTotal");
            var keyAvg = document.getElementById("keyAvg");

            var index;
            var vk = document.getElementById("virtual-keyboard");
            //virtual-keyboardを各モードで出てくる文字列のみ表示する
            if(log.match("regist")){Array.from(vk.children).forEach(
                (e,i) => {
                    if(mode == "R"){
                        index = [14,15,16,17,18,19,20,21,22,23,24,29,30,31,32,33,34,35,36,37,38,43,44,45,46,47,48,49,50,51,56,57,58,59,60,61,62,63];
                        if(!index.includes(i)) e.textContent = "";
                    }else if(mode == "E"){
                        vk.children[14].setAttribute("name","!");
                        vk.children[14].textContent = "!";
                        vk.children[20].setAttribute("name","'");
                        vk.children[20].textContent = "'";
                        vk.children[65].setAttribute("name","?");
                        vk.children[65].textContent = "?";
                        vk.children[72].setAttribute("name","Space");
                        index = [24,29,30,31,32,33,34,35,36,37,38,43,44,45,46,47,48,49,50,51,56,57,58,59,60,61,62,63,64,72];
                        if(!index.includes(i)) e.textContent = "";
                    }else if(mode == "K"){
                        index = {"14":"ぬ","15":"ふ","16":"あ","17":"う","18":"え","19":"お","20":"や","21":"ゆ","22":"よ","23":"わ","24":"ほ","25":"へ","26":"ー","29":"た","30":"て","31":"い","32":"す","33":"か","34":"ん","35":"な","36":"に","37":"ら","38":"せ","39":"゛","40":"゜","43":"ち","44":"と","45":"し","46":"は","47":"き","48":"く","49":"ま","50":"の","51":"り","52":"れ","53":"け","54":"む","56":"つ","57":"さ","58":"そ","59":"ひ","60":"こ","61":"み","62":"も","63":"ね","64":"る","65":"め","66":"ろ"};
                        e.setAttribute("name",index[i])
                        !index[i] ? e.textContent = "" : e.textContent = index[i];
                    }
                }
            )}
            let count_log = Object.entries(JSON.parse(localStorage[log])[modeIndex]).sort((a, b) => b[1] - a[1]);
            var max = String(count_log[0][1]).length > 2 ? Math.ceil(count_log[0][1] / (10 ** (String(count_log[0][1]).length - 2))) * (10 ** (String(count_log[0][1]).length - 2)) : 100;
            var a = max / 10
            console.log(max)
            //目盛りの値毎にキーボードの色を変えるためのclass名とallの名前の相関
            //これの修正頑張ってねーーーー
            var keys = log.match("regist") && mode == "K" ?
                {"key_0":"わ","key_1":"ぬ","key_2":"ふ","key_3":"あ","key_4":"う","key_5":"え","key_6":"お","key_7":"や","key_8":"ゆ","key_9":"よ","key_a":"ち","key_b":"こ","key_c":"そ","key_d":"し","key_e":"い","key_f":"は","key_g":"き","key_h":"く","key_i":"に","key_j":"ま","key_k":"の","key_l":"り","key_m":"も","key_n":"み","key_o":"ら","key_p":"せ","key_q":"た","key_r":"す","key_s":"と","key_t":"か","key_u":"な","key_v":"ひ","key_w":"て","key_x":"さ","key_y":"ん","key_z":"つ","deco_key2":"へ","deco_key3":"ー","deco_key6":"゜","deco_key8":"む","deco_key9":"ろ","key_hyphen":"ほ","key_atmark":"゛","key_semicolon":"れ","key_colon":"け","key_comma":"ね","key_period":"る","key_slash":"め"} : log.match("regist") ?
            {"key_0":"0","key_1":"1","key_2":"2","key_3":"3","key_4":"4","key_5":"5","key_6":"6","key_7":"7","key_8":"8","key_9":"9","key_a":"a","key_b":"b","key_c":"c","key_d":"d","key_e":"e","key_f":"f","key_g":"g","key_h":"h","key_i":"i","key_j":"j","key_k":"k","key_l":"l","key_m":"m","key_n":"n","key_o":"o","key_p":"p","key_q":"q","key_r":"r","key_s":"s","key_t":"t","key_u":"u","key_v":"v","key_w":"w","key_x":"x","key_y":"y","key_z":"z","deco_key1":"全角/半角","deco_key2":"^","deco_key3":"IntlYen","deco_key4":"Backspace","deco_key5":"Tab","deco_key6":"[","deco_key7":"CapsLock","deco_key8":"]","deco_key9":"IntlRo","deco_key10":"ControlLeft","deco_key11":"win","deco_key12":"AltLeft","deco_key13":"無変換","deco_key14":"変換","deco_key15":"カタカナ","deco_key16":"AltRight","deco_key17":"ContextMenu","deco_key18":"ControlRight","key_hyphen":"-","key_atmark":"@","key_Enter":"Enter","key_semicolon":";","key_colon":":","key_lShift":"ShiftLeft","key_comma":",","key_period":".","key_slash":"/","key_rShift":"ShiftRight","key_space":"Space","key_ESC":"Escape","key_F1":"F1","key_F2":"F2","key_F3":"F3","key_F4":"F4","key_F5":"F5","key_F6":"F6","key_F7":"F7","key_F8":"F8","key_F9":"F9","key_F10":"F10","key_F11":"F11","key_F12":"F12"} :
            {"key_0":"Digit0","key_1":"Digit1","key_2":"Digit2","key_3":"Digit3","key_4":"Digit4","key_5":"Digit5","key_6":"Digit6","key_7":"Digit7","key_8":"Digit8","key_9":"Digit9","key_a":"KeyA","key_b":"KeyB","key_c":"KeyC","key_d":"KeyD","key_e":"KeyE","key_f":"KeyF","key_g":"KeyG","key_h":"KeyH","key_i":"KeyI","key_j":"KeyJ","key_k":"KeyK","key_l":"KeyL","key_m":"KeyM","key_n":"KeyN","key_o":"KeyO","key_p":"KeyP","key_q":"KeyQ","key_r":"KeyR","key_s":"KeyS","key_t":"KeyT","key_u":"KeyU","key_v":"KeyV","key_w":"KeyW","key_x":"KeyX","key_y":"KeyY","key_z":"KeyZ","deco_key1":"全角/半角","deco_key2":"^","deco_key3":"IntlYen","deco_key4":"Backspace","deco_key5":"Tab","deco_key6":"[","deco_key7":"CapsLock","deco_key8":"]","deco_key9":"IntlRo","deco_key10":"ControlLeft","deco_key11":"win","deco_key12":"AltLeft","deco_key13":"無変換","deco_key14":"変換","deco_key15":"カタカナ","deco_key16":"AltRight","deco_key17":"ContextMenu","deco_key18":"ControlRight","key_hyphen":"-","key_atmark":"@","key_Enter":"Enter","key_semicolon":";","key_colon":":","key_lShift":"ShiftLeft","key_comma":",","key_period":".","key_slash":"/","key_rShift":"ShiftRight","key_space":"Space","key_ESC":"Escape","key_F1":"F1","key_F2":"F2","key_F3":"F3","key_F4":"F4","key_F5":"F5","key_F6":"F6","key_F7":"F7","key_F8":"F8","key_F9":"F9","key_F10":"F10","key_F11":"F11","key_F12":"F12"}
            console.log(keys)
            var keyboard_obj = log == "log_keydownCode" ? JSON.parse(localStorage.log_keydownCode)[modeIndex] : JSON.parse(localStorage.log_regist_key)[modeIndex]
            console.log(keyboard_obj)
            //キーボードの色を打鍵数毎に決める
            for(var key in keys){
                var num = keyboard_obj[keys[key]]//そのキーの打鍵数
                document.getElementsByClassName(key)[0].style.backgroundColor =
                    //数値じゃなければ色なし(成績登録時の入力文字の場合)
                    isNaN(num) ? "" :
                num >= 0 && num <= max-a*9 ? "" :
                num <= max-a*8 ? "#faf0dd" :
                num <= max-a*7 ? "#fae5c6" :
                num <= max-a*6 ? "#fadaaf" :
                num <= max-a*5 ? "#facf90" :
                num <= max-a*4 ? "#fac382" :
                num <= max-a*3 ? "#fab66f" :
                num <= max-a*2 ? "#faa957" :
                num <= max-a ? "#fa9b46" :
                num <= max ? "#fa8f39" : "#fa8427"
            }

            //キー名に表示する文字列対応表
            let keyNames = {"KeyA":"A","KeyB":"B","KeyC":"C","KeyD":"D","KeyE":"E","KeyF":"F","KeyG":"G","KeyH":"H","KeyI":"I","KeyJ":"J","KeyK":"K","KeyL":"L","KeyM":"M","KeyN":"N","KeyO":"O","KeyP":"P","KeyQ":"Q","KeyR":"R","KeyS":"S","KeyT":"T","KeyU":"U","KeyV":"V","KeyW":"W","KeyX":"X","KeyY":"Y","KeyZ":"Z","Digit0":"0","Digit1":"1","Digit2":"2","Digit3":"3","Digit4":"4","Digit5":"5","Digit6":"6","Digit7":"7","Digit8":"8","Digit9":"9","F1":"F1","F2":"F2","F3":"F3","F4":"F4","F5":"F5","F6":"F6","F7":"F7","F8":"F8","F9":"F9","F10":"F10","F11":"F11","F12":"F12","Escape":"ESC","Backquote":"全角/半角","Minus":"-","Equal":"^","IntlYen":"¥","Backspace":"BackSpace","Tab":"Tab","BracketLeft":"@","BracketRight":"[","Enter":"Enter","CapsLock":"CapsLock","Semicolon":";","Quote":":","Backslash":"]","ShiftLeft":"左シフト","Comma":",","Period":".","Slash":"/","IntlRo":"バックスラッシュ","ShiftRight":"右シフト","ControlLeft":"左Ctrl","MetaLeft":"Windows","AltLeft":"左Alt","NonConvert":"無変換","Space":"Space","Convert":"変換","KanaMode":"カタカナ","AltRight":"右Alt","ContextMenu":"ContextMenu","ControlRight":"右Ctrl","ScrollLock":"ScrollLock","Pause":"Pause","Insert":"Insert","Home":"Home","PageUp":"PageUp","Delete":"Delete","End":"End","PageDown":"PageDown","ArrowUp":"↑","ArrowLeft":"←","ArrowDown":"↓","ArrowRight":"→","Numpad0":"テンキー0","Numpad1":"テンキー1","Numpad2":"テンキー2","Numpad3":"テンキー3","Numpad4":"テンキー4","Numpad5":"テンキー5","Numpad6":"テンキー6","Numpad7":"テンキー7","Numpad8":"テンキー8","Numpad9":"テンキー9","NumLock":"NumLock","NumpadDivide":"NumpadDivide","NumpadMultiply":"NumpadMultiply","NumpadSubtract":"NumpadSubtract","NumpadAdd":"NumpadAdd","NumpadEnter":"NumpadEnter","NumpadDecimal":"NumpadDecimal","その他":"その他"}
            switch(log){
                case "log_keydownCode":
                    keyName.innerHTML = count_log.map(a => `<div>${keyNames[a[0]]}</div>`).join("")
                    keyTotal.innerHTML = count_log.map(a => `<div>${Number(a[1]).toLocaleString()}</div>`).join("")
                    keyAvg.innerHTML = count_log.map(a => `<div>${Number(Math.round(a[1] / day)).toLocaleString()}</div>`).join("")
                    break;
                case "log_regist_key":
                    var regist_mode = Object.entries(JSON.parse(localStorage.log_regist_key)[modeIndex]).sort((a, b) => b[1] - a[1]);
                    keyName.innerHTML = regist_mode.map(a => a[0].length == 1 ? `<div>${a[0].toUpperCase()}</div>` : `<div>${a[0]}</div>`).join("")
                    keyTotal.innerHTML = regist_mode.map(a => `<div>${Number(a[1]).toLocaleString()}</div>`).join("")
                    keyAvg.innerHTML = regist_mode.map(a => `<div>${Number(Math.round(a[1] / day)).toLocaleString()}</div>`).join("")
                    break;
            }
        }

        setKeyData("log_keydownCode","K")
        //setKeyData("log_regist_key","K")
































        //addEventListenerを追加してないなら追加する
        if(!aelFlag){
            aelFlag = true;
            document.getElementById("virtual-keyboard").addEventListener("mouseover",function(event){
                event.target.classList.add("active");
            });

            document.getElementById("virtual-keyboard").addEventListener("mouseout",function(event){
                setTimeout(()=>{
                    event.target.classList.remove("active");
                },500)
            });

            //上メニューの[カウンター]をクリックしたときの動作
            document.getElementById("type-counter").addEventListener("click",_=>{
                document.getElementById("select").style.display = "block";
                document.getElementById("e-type").style.display = "block";
                document.getElementById("ranking-select").style.display = "none";
                document.getElementById("r-score").style.display = "none";
                document.getElementById("e-score").style.display = "none";
                document.getElementById("k-score").style.display = "none";
            })

            // [ランキング]
            document.getElementById("rankings").addEventListener("click",_=>{
                document.getElementById("select").style.display = "block";
                document.getElementById("e-type").style.display = "none";
                document.getElementById("ranking-select").style.display = "block";
                document.getElementById("r-score").style.display = "block";
                document.getElementById("e-score").style.display = "block";
                document.getElementById("k-score").style.display = "block";
            })

            //キーボードのキーをクリックするとkey-dataの対応するキーに推移する
            let kn = document.getElementById("keyName");
            let p = kn.children[0]
            document.getElementById("virtual-keyboard").addEventListener("click",function(e){
                Array.from(kn.children).some(
                    (t,i) => {
                        if(t.textContent == e.target.getAttribute("name")){
                            p.style.backgroundColor = "#fff";
                            document.getElementById("key-data").scrollTop = i * 21.89;
                            kn.children[i].style.backgroundColor = "#ffd778";
                            p = kn.children[i]
                            return true;
                        }
                    }
                )
            })

            //閉じるボタンを押したときの動作
            document.getElementById("close-button1").addEventListener("click",()=>{
                document.getElementById("overlay").style.display = "none";
                document.getElementById("game-screen").style.display = "none";
                document.getElementById("game-view2").style.display = "none";
                document.getElementById("log-ranking").style.display = "none";
                document.getElementById("select").style.display = "none";
            })

            //e-タイプ数カウンター本体のselect操作時のコードを書く(game-view2の中の要素!!!!!!!!!)
            document.getElementById("e-type").addEventListener("change",()=>{
                let value = document.getElementById("e-type").value;
                console.log(value)
                let a = {
                    "e-タイプ数カウンター":"log_keydownCode,A",
                    "ウィンドウ打鍵数(ALL)":"log_keydownCode,A",
                    "ウィンドウ打鍵数(R)":"log_keydownCode,R",
                    "ウィンドウ打鍵数(E)":"log_keydownCode,E",
                    "ウィンドウ打鍵数(K)":"log_keydownCode,K",
                    "成績登録打鍵数(R)":"log_regist_key,R",
                    "成績登録打鍵数(E)":"log_regist_key,E",
                    "成績登録打鍵数(K)":"log_regist_key,K",
                }
                setKeyData(a[value].split(",")[0],a[value].split(",")[1])
            })

            //ランキングのselect要素を変えたとき
            document.getElementById("ranking-select").addEventListener("change",()=>{
                document.getElementById("select").style.display = "none";
                document.getElementById("game-view2").style.display = "none";
                document.getElementById("log-ranking").style.display = "block";
                //ランキングを白紙にする
                for(let i=0;i<30;i++){
                    let ele = document.getElementsByClassName("lrs")[i]
                    ele.children[1].textContent = ""
                    ele.children[2].textContent = ""
                }

                let value = document.getElementById("ranking-select").value;
                //青い部分のテキスト
                document.getElementsByClassName("lrd-d")[0].textContent = value
                document.getElementsByClassName("lrd-d")[1].children[0].textContent = value + "の平均"
                //selectしたvalueに対応するlogのランキング
                let a = {
                    "ランキング":"log_dayKeydown_ALL",
                    "1日の打鍵数(ALL)":"log_dayKeydown_ALL",
                    "1日の打鍵数(R)":"log_dayKeydown_R",
                    "1日の打鍵数(E)":"log_dayKeydown_E",
                    "1日の打鍵数(K)":"log_dayKeydown_K",
                    "スコア(R)":"log_score_R",
                    "スコア(E)":"log_score_E",
                    "スコア(K)":"log_score_K",
                    "15問入力時間(R)":"log_inputTimeShort_R",
                    "15問入力時間(E)":"log_inputTimeShort_E",
                    "15問入力時間(K)":"log_inputTimeShort_K",
                    "15問多い入力文字数(R)":"log_strMany_R",
                    "15問多い入力文字数(E)":"log_strMany_E",
                    "15問多い入力文字数(K)":"log_strMany_K",
                    "15問少ない入力文字数(R)":"log_strFew_R",
                    "15問少ない入力文字数(E)":"log_strFew_E",
                    "15問少ない入力文字数(K)":"log_strFew_K",
                    "15問KPM(R)":"log_KPM_R",
                    "15問KPM(E)":"log_KPM_E",
                    "15問KPM(K)":"log_KPM_K",
                    "15問初速(R)":"log_latency_R",
                    "15問初速(E)":"log_latency_E",
                    "15問初速(K)":"log_latency_K",
                    "15問RKPM(R)":"log_RKPM_R",
                    "15問RKPM(E)":"log_RKPM_E",
                    "15問RKPM(K)":"log_RKPM_K",
                    "ワード別KPM(R)":"log_wordKPM_R",
                    "ワード別KPM(E)":"log_wordKPM_E",
                    "ワード別KPM(K)":"log_wordKPM_K",
                    "ワード別RKPM(R)":"log_wordRKPM_R",
                    "ワード別RKPM(E)":"log_wordRKPM_E",
                    "ワード別RKPM(K)":"log_wordRKPM_K",
                    "ワード別入力時間(R)":"log_wordInputTimeShort_R",
                    "ワード別入力時間(E)":"log_wordInputTimeShort_E",
                    "ワード別入力時間(K)":"log_wordInputTimeShort_K",
                    "ワード別多い入力文字数(R)":"log_wordStrMany_R",
                    "ワード別多い入力文字数(E)":"log_wordStrMany_E",
                    "ワード別多い入力文字数(K)":"log_wordStrMany_K",
                    "ワード別少ない入力文字数(R)":"log_wordStrFew_R",
                    "ワード別少ない入力文字数(E)":"log_wordStrFew_E",
                    "ワード別少ない入力文字数(K)":"log_wordStrFew_K",
                    "ワード別初速(R)":"log_wordLatency_R",
                    "ワード別初速(E)":"log_wordLatency_E",
                    "ワード別初速(K)":"log_wordLatency_K"
                }

                //記録の削除などで判別する用（classにしてるのは適当
                document.getElementById("lrss").className = a[value]
                //ランキングにセレクトしたlogのランキング配列をセットする
                for(let i=0;i<JSON.parse(localStorage.getItem(a[value])).length;i++){
                    let values = Object.values(JSON.parse(localStorage.getItem(a[value]))[i])[0]
                    var ele = document.getElementsByClassName("lrs")[i]
                    ele.children[1].textContent = Object.keys(JSON.parse(localStorage.getItem(a[value]))[i])
                    if(values.match("_")){
                        ele.children[2].textContent = values.split("_")[0]
                        ele.children[2].title = values.split("_")[1]
                    }else{
                        ele.children[2].textContent = values
                    }

                    let sum = 0;
                    Array.from(document.getElementsByClassName("lrs")).some((e,i)=>{
                        let record = e.children[2].textContent
                        if (record == "") return true;
                        sum += Number(record)
                        document.getElementsByClassName("lrd-d")[1].children[1].textContent = (sum / (i+1)).toFixed($("#ranking-select")[0].value.includes("初速") ? 3 : 2)
                    })
                }
            })

            //ランキングをクリックしたときにそのデータを削除するか聞く
            document.getElementById("lrss").addEventListener("click",e=>{
                if(e.target.id != "lrss" && e.target.className != "lrs"){
                    if(!document.getElementById("lrss").className){
                        alert("できません")
                    }else{
                        let log = JSON.parse(localStorage[document.getElementById("lrss").className]);//そのランキングのlocalStorage
                        let index = e.target.parentNode.children[0].textContent.replace("位","") - 1;//logのインデックス
                        if(confirm(`${$("#ranking-select")[0].value} の ${index+1}位 の記録を削除しますか？`)){
                            if(confirm("削除すると元には戻せません。本当によろしいですか？")){
                                log.splice(index,1)
                                localStorage.setItem(document.getElementById("lrss").className,JSON.stringify(log))
                                console.log(JSON.parse(localStorage[document.getElementById("lrss").className]))
                                alert(`記録を削除しました。もう一度 ${$("#ranking-select")[0].value} のランキングを開くと反映されます。`)
                            }else{
                                alert("削除をキャンセルしました。")
                            }
                        }else{
                            alert("削除をキャンセルしました。")
                        }
                    }
                }
            })

            let rs = document.getElementById("r-score"); //セレクト要素
            let es = document.getElementById("e-score");
            let ks = document.getElementById("k-score");

            let rt = Object.keys(JSON.parse(localStorage.log_themeScore)[0]); //Rの成績登録済みお題
            let et = Object.keys(JSON.parse(localStorage.log_themeScore)[1]); //E
            let kt = Object.keys(JSON.parse(localStorage.log_themeScore)[2]); //K

            rt.forEach(n=>rs.add(new Option([n]))); //selectにoptionを追加
            et.forEach(n=>es.add(new Option([n])));
            kt.forEach(n=>ks.add(new Option([n])));

            rs.addEventListener("change",_=>{
                document.getElementById("select").style.display = "none";
                document.getElementById("game-view2").style.display = "none";
                document.getElementById("log-ranking").style.display = "block";

                //ランキングを白紙にする
                for(let i=0;i<30;i++){
                    let ele = document.getElementsByClassName("lrs")[i]
                    ele.children[1].textContent = ""
                    ele.children[2].textContent = ""
                }

                let v = rs.value;
                document.getElementsByClassName("lrd-d")[0].textContent = v;
                document.getElementsByClassName("lrd-d")[1].children[0].textContent = v + "の平均";

                for(let i=0;i<JSON.parse(localStorage.log_score)[0][v].length;i++){
                    let values = JSON.parse(localStorage.log_score)[0][v][i];
                    let e = document.getElementsByClassName("lrs")[i];
                    e.children[1].textContent = values.split("_")[1];
                    e.children[2].textContent = values.split("_")[0];
                }
            })

            es.addEventListener("change",_=>{
                document.getElementById("select").style.display = "none";
                document.getElementById("game-view2").style.display = "none";
                document.getElementById("log-ranking").style.display = "block";

                //ランキングを白紙にする
                for(let i=0;i<30;i++){
                    let ele = document.getElementsByClassName("lrs")[i]
                    ele.children[1].textContent = ""
                    ele.children[2].textContent = ""
                }

                let v = es.value;
                document.getElementsByClassName("lrd-d")[0].textContent = v;
                document.getElementsByClassName("lrd-d")[1].children[0].textContent = v + "の平均";

                for(let i=0;i<JSON.parse(localStorage.log_score)[1][v].length;i++){
                    let values = JSON.parse(localStorage.log_score)[1][v][i];
                    let e = document.getElementsByClassName("lrs")[i];
                    e.children[1].textContent = values.split("_")[1];
                    e.children[2].textContent = values.split("_")[0];
                }
            })

            ks.addEventListener("change",_=>{
                document.getElementById("select").style.display = "none";
                document.getElementById("game-view2").style.display = "none";
                document.getElementById("log-ranking").style.display = "block";

                //ランキングを白紙にする
                for(let i=0;i<30;i++){
                    let ele = document.getElementsByClassName("lrs")[i]
                    ele.children[1].textContent = ""
                    ele.children[2].textContent = ""
                }

                let v = ks.value;
                document.getElementsByClassName("lrd-d")[0].textContent = v;
                document.getElementsByClassName("lrd-d")[1].children[0].textContent = v + "の平均";

                for(let i=0;i<JSON.parse(localStorage.log_score)[2][v].length;i++){
                    let values = JSON.parse(localStorage.log_score)[2][v][i];
                    let e = document.getElementsByClassName("lrs")[i];
                    e.children[1].textContent = values.split("_")[1];
                    e.children[2].textContent = values.split("_")[0];
                }
            })
        }
    }

    //キーのメモリ(スペース的に入れられないのでコメントアウト中)
    /*for(var e of document.querySelectorAll(".box")){
          e.textContent = max
          max = max -a
      }*/
}
}

if(!localStorage.getItem("log_start")){
    if(confirm("すべてのログを初期化します。よろしいですか？")){
        if(confirm("記録開始日、打鍵数、ランキングなどすべて初期化します。本当によろしいですか？")){
            //記録開始日とその時刻
            localStorage.setItem("log_start",new Date().toLocaleString());
            //その週のテーマ(R,E,K) R,Kでお題が一致しなかったことがあるので一応Kも
            localStorage.setItem("log_thisWeekTheme",`["R_1970/1/1","E_1970/1/1","K_1970/1/1"]`);
            //腕試し成績登録時の打った文字(R,E,K) 補足:念のため"その他"に成績登録時に以下の配列に書いてない文字が入る
            localStorage.setItem("log_registKeyCount",`[{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0,"g":0,"h":0,"i":0,"j":0,"k":0,"l":0,"m":0,"n":0,"o":0,"p":0,"q":0,"r":0,"s":0,"t":0,"u":0,"v":0,"w":0,"x":0,"y":0,"z":0,"-":0,",":0,"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"その他":0},{"a":0,"b":0,"c":0,"d":0,"e":0,"f":0,"g":0,"h":0,"i":0,"j":0,"k":0,"l":0,"m":0,"n":0,"o":0,"p":0,"q":0,"r":0,"s":0,"t":0,"u":0,"v":0,"w":0,"x":0,"y":0,"z":0,"Space":0,"'":0,"-":0,",":0,".":0,"!":0,"?":0,"その他":0},{"あ":0,"い":0,"う":0,"え":0,"お":0,"か":0,"き":0,"く":0,"け":0,"こ":0,"さ":0,"し":0,"す":0,"せ":0,"そ":0,"た":0,"ち":0,"つ":0,"て":0,"と":0,"な":0,"に":0,"ぬ":0,"ね":0,"の":0,"は":0,"ひ":0,"ふ":0,"へ":0,"ほ":0,"ま":0,"み":0,"む":0,"め":0,"も":0,"や":0,"ゆ":0,"よ":0,"ら":0,"り":0,"る":0,"れ":0,"ろ":0,"わ":0,"を":0,"ん":0,"ぁ":0,"ぃ":0,"ぅ":0,"ぇ":0,"ぉ":0,"っ":0,"ゃ":0,"ゅ":0,"ょ":0,"ー":0,"、":0,"゛":0,"゜":0,"その他":0}]`);

            //腕試しウィンドウへの打鍵数(キー別)
            localStorage.setItem("log_typingKeyCodeCount",JSON.stringify(Array("REKA".length).fill({"KeyA":0,"KeyB":0,"KeyC":0,"KeyD":0,"KeyE":0,"KeyF":0,"KeyG":0,"KeyH":0,"KeyI":0,"KeyJ":0,"KeyK":0,"KeyL":0,"KeyM":0,"KeyN":0,"KeyO":0,"KeyP":0,"KeyQ":0,"KeyR":0,"KeyS":0,"KeyT":0,"KeyU":0,"KeyV":0,"KeyW":0,"KeyX":0,"KeyY":0,"KeyZ":0,"Digit0":0,"Digit1":0,"Digit2":0,"Digit3":0,"Digit4":0,"Digit5":0,"Digit6":0,"Digit7":0,"Digit8":0,"Digit9":0,"F1":0,"F2":0,"F3":0,"F4":0,"F5":0,"F6":0,"F7":0,"F8":0,"F9":0,"F10":0,"F11":0,"F12":0,"Escape":0,"Backquote":0,"Minus":0,"Equal":0,"IntlYen":0,"Backspace":0,"Tab":0,"BracketLeft":0,"BracketRight":0,"Enter":0,"CapsLock":0,"Semicolon":0,"Quote":0,"Backslash":0,"ShiftLeft":0,"Comma":0,"Period":0,"Slash":0,"IntlRo":0,"ShiftRight":0,"ControlLeft":0,"MetaLeft":0,"AltLeft":0,"NonConvert":0,"Space":0,"Convert":0,"KanaMode":0,"AltRight":0,"ContextMenu":0,"ControlRight":0,"ScrollLock":0,"Pause":0,"Insert":0,"Home":0,"PageUp":0,"Delete":0,"End":0,"PageDown":0,"ArrowUp":0,"ArrowLeft":0,"ArrowDown":0,"ArrowRight":0,"Numpad0":0,"Numpad1":0,"Numpad2":0,"Numpad3":0,"Numpad4":0,"Numpad5":0,"Numpad6":0,"Numpad7":0,"Numpad8":0,"Numpad9":0,"NumLock":0,"NumpadDivide":0,"NumpadMultiply":0,"NumpadSubtract":0,"NumpadAdd":0,"NumpadEnter":0,"NumpadDecimal":0,"その他":0})))
            //腕試しウィンドウへの打鍵ログ(単純に入力するごとに1ずつ加算)
            localStorage.setItem("log_allTypingCount","[0,0,0,0]"); //R,E,K
            //今日の打鍵数
            localStorage.setItem("log_dayTypingCount",`["0_-_1970/1/1","0_-_1970/1/1","0_-_1970/1/1","0_-_1970/1/1"]`)

            //成績登録した回数
            localStorage.setItem("log_registCount","[0,0,0,0]");

            //スコア、初速などのそれぞれ合計値
            localStorage.setItem("log_registDataSum",JSON.stringify(Array("REK".length).fill({"score":0,"inputTime":0,"str":0,"miss":0,"WPM":0,"latency":0,"RKPM":0,"accuracyStr":0,})))
            //スコア、初速などの平均値
            localStorage.setItem("log_registDataAvg",JSON.stringify(Array("REK".length).fill({"score":0,"inputTime":0,"str":0,"miss":0,"WPM":0,"latency":0,"RKPM":0,"accuracy":0})));


            //ワード別スコアランキング（
            localStorage.setItem("logR_themeScore","[{},{},{}]")
            //1日の打鍵数ランキング
            localStorage.setItem("logR_dayTypingCount","[[],[],[],[]]")

            //15問のスコアランキング
            localStorage.setItem("logR_compScore","[[],[],[]]")
            //15問の入力時間ランキング
            localStorage.setItem("logR_compInputTime","[[],[],[]]")
            //15問の入力文字数ランキング (1 = 多 2 = 少)
            localStorage.setItem("logR_compStr1","[[],[],[]]")
            localStorage.setItem("logR_compStr2","[[],[],[]]")
            //15問のWPM(KPM)ランキング
            localStorage.setItem("logR_compKPM","[[],[],[]]")
            //15問の初速ランキング
            localStorage.setItem("logR_compLatency","[[],[],[]]")
            //15問のRKPMランキング
            localStorage.setItem("logR_compRKPM","[[],[],[]]")

            //ワード毎のKPMランキング
            localStorage.setItem("logR_wordKPM","[[],[],[]]")
            //ワード毎のRKPMランキング
            localStorage.setItem("logR_wordRKPM","[[],[],[]]")
            //ワード毎の入力時間ランキング
            localStorage.setItem("logR_wordInputTime","[[],[],[]]")
            //ワード毎の入力文字数ランキング (1 = 多 2 = 少)
            localStorage.setItem("logR_wordStr1","[[],[],[]]")
            localStorage.setItem("logR_wordStr2","[[],[],[]]")
            //ワード毎の初速ランキング
            localStorage.setItem("logR_wordLatency","[[],[],[]]")
            alert("打鍵ログを初期化しました。")
        }else{
            alert("初期化をキャンセルしました。");
        }
    }else{
        alert("初期化をキャンセルしました。");
    }
}




function setHTML(){
    //e-タイプ数カウンターのHTML
    const eTypeCounter_HTML = `
    <div id="overlay" style="display:none; position:fixed; top:0px; left:0px; width:100%; height:100%; background-color:#000; opacity: 0.8;"></div>
    <div id="game-screen">
      <div id="game-header">
        <div class="container" style="display:none">
          <div class="box" style="background-color:#fa8427;"></div>
          <div class="box" style="background-color:#fa8f39;"></div>
          <div class="box" style="background-color:#fa9b46;"></div>
          <div class="box" style="background-color:#faa957;"></div>
          <div class="box" style="background-color:#fab66f;"></div>
          <div class="box" style="background-color:#fac382;"></div>
          <div class="box" style="background-color:#facf90;"></div>
          <div class="box" style="background-color:#fadaaf;"></div>
          <div class="box" style="background-color:#fae5c6;"></div>
          <div class="box" style="background-color:#faf0dd;"></div>
        <div class="box"></div>
      </div>
        <div class="description">e-タイプ数カウンター</div>
        <div id="type-counter"><div class="submenu" style="display:flex;/* opacity:0; */justify-content: space-between;width:300px;">
<div>
<h1>腕試しウィンドウ</h1>
<ul>
<li><div>ローマ字</div></li>
<li><div>英語</div></li>
<li><div>かな</div></li>


</ul>
</div><div>
<h1>成績登録</h1>
<ul>
<li><div>ローマ字</div></li>
<li><div>英語</div></li>
<li><div>かな</div></li>


</ul>
</div>
</div>カウンター</div>
        <div id="rankings">ランキング</div>
        <button id="close-button1" type="button">閉じる</button>
      </div>
      <div id="game-body">
        <div id="select">
          <div id="type">
            <select id="e-type" style="margin:0 auto;" size="7">
               <option id="etc0">ウィンドウ打鍵数(ALL)</option>
               <option id="etc1">ウィンドウ打鍵数(R)</option>
               <option id="etc2">ウィンドウ打鍵数(E)</option>
               <option id="etc3">ウィンドウ打鍵数(K)</option>
               <option id="etc4">成績登録打鍵数(R)</option>
               <option id="etc5">成績登録打鍵数(E)</option>
               <option id="etc6">成績登録打鍵数(K)</option>
            </select>
            <select id="ranking-select" style="width:25%" size="15">
               <option>1日の打鍵数(ALL)</option>
               <option>1日の打鍵数(R)</option>
               <option>1日の打鍵数(E)</option>
               <option>1日の打鍵数(K)</option>
               <option>スコア(R)</option>
               <option>スコア(E)</option>
               <option>スコア(K)</option>
               <option>15問入力時間(R)</option>
               <option>15問入力時間(E)</option>
               <option>15問入力時間(K)</option>
               <option>15問多い入力文字数(R)</option>
               <option>15問多い入力文字数(E)</option>
               <option>15問多い入力文字数(K)</option>
               <option>15問少ない入力文字数(R)</option>
               <option>15問少ない入力文字数(E)</option>
               <option>15問少ない入力文字数(K)</option>
               <option>15問KPM(R)</option>
               <option>15問KPM(E)</option>
               <option>15問KPM(K)</option>
               <option>15問初速(R)</option>
               <option>15問初速(E)</option>
               <option>15問初速(K)</option>
               <option>15問RKPM(R)</option>
               <option>15問RKPM(E)</option>
               <option>15問RKPM(K)</option>
               <option>ワード別KPM(R)</option>
               <option>ワード別KPM(E)</option>
               <option>ワード別KPM(K)</option>
               <option>ワード別RKPM(R)</option>
               <option>ワード別RKPM(E)</option>
               <option>ワード別RKPM(K)</option>
               <option>ワード別入力時間(R)</option>
               <option>ワード別入力時間(E)</option>
               <option>ワード別入力時間(K)</option>
               <option>ワード別多い入力文字数(R)</option>
               <option>ワード別多い入力文字数(E)</option>
               <option>ワード別多い入力文字数(K)</option>
               <option>ワード別少ない入力文字数(R)</option>
               <option>ワード別少ない入力文字数(E)</option>
               <option>ワード別少ない入力文字数(K)</option>
               <option>ワード別初速(R)</option>
               <option>ワード別初速(E)</option>
               <option>ワード別初速(K)</option>
            </select>
            <select id="r-score" style="width:25%" size="15"></select>
            <select id="e-score" style="width:25%" size="15"></select>
            <select id="k-score" style="width:25%" size="15"></select>
          </div>
        </div>
        <div id="log-ranking">
          <div id="lrd" style="width:616px; height:36px; display:flex; justify-content:space-between; align-items:center;">
            <div class="lrd-d">何かのモード</div>
            <div class="lrd-d">
              <div style="float:left;"></div>
              <div style="padding-left:10px; float:left;">avg</div>
            </div>
          </div>
          <div id="lrh">
            <div style="width:83px; float:left;">ランク</div>
            <div style="width:436px; float:left;">日付</div>
            <div style="width:64px; text-align:right; float:left;">記録</div>
          </div>
          <div id="lrss">
          ${Array.from({length:30},(_,i)=>`
          <div class="lrs" title="クリックで記録を削除">
            <div style="width:83px; float:left;">${i+1+"位"}</div>
            <div style="width:436px; float:left;"></div>
            <div style="width:64px; text-align:right; float:left;"></div>
          </div>
          `).join('')}
          </div>
        </div>
        <div id="game-view2">
          <div id="text-container">
            <div id="data" style="border-right: 1px solid #d8d8d8;">
              <div class="data-row">
                <div class="data-left">トータル</div>
                <div id="total" class="data-right"></div>
              </div>
              <div class="data-row">
                <div class="data-left">今日</div>
                <div id="today" class="data-right" style="color:#ff1a1a"></div>
              </div>
              <div class="data-row">
                <div class="data-left">平均/1日</div>
                <div id="average" class="data-right" style="color:#1a1aff"></div>
              </div>
              <div class="data-row">
                <div class="data-left">成績登録回数</div>
                <div id="registCount" class="data-right"></div>
              </div>
              <div class="data-row">
                <div id="maxCountDay" class="data-left">最大</div>
                <div id="maxCount" class="data-right"></div>
              </div>
              <div class="data-row">
                <div class="data-left">カウント日数</div>
                <div id="day" class="data-right"></div>
              </div>
            </div>
            <div id="key-data">
              <div class="key-header">キー名</div>
              <div class="key-header">トータル</div>
              <div class="key-header">平均/1日</div>
              <div id="keyName" style="margin:0 -253.16px 0 5px"></div>
              <div id="keyTotal" style="padding-left:5px;"></div>
              <div id="keyAvg" style="color:#1a1aff; padding-left:5px;"></div>
            </div>
          </div>
          <div id="virtual-keyboard">
            <div class="key_ESC" name="Escape">ESC</div>
            <div class="key_F1" name="F1">F1</div>
            <div class="key_F2" name="F2">F2</div>
            <div class="key_F3" name="F3">F3</div>
            <div class="key_F4" name="F4">F4</div>
            <div class="key_F5" name="F5">F5</div>
            <div class="key_F6" name="F6">F6</div>
            <div class="key_F7" name="F7">F7</div>
            <div class="key_F8" name="F8">F8</div>
            <div class="key_F9" name="F9">F9</div>
            <div class="key_F10" name="F10">F10</div>
            <div class="key_F11" name="F11">F11</div>
            <div class="key_F12" name="F12">F12</div>
            <div class="deco_key1" name="全角/半角">漢</div>
            <div class="key_1" name="1">1</div>
            <div class="key_2" name="2">2</div>
            <div class="key_3" name="3">3</div>
            <div class="key_4" name="4">4</div>
            <div class="key_5" name="5">5</div>
            <div class="key_6" name="6">6</div>
            <div class="key_7" name="7">7</div>
            <div class="key_8" name="8">8</div>
            <div class="key_9" name="9">9</div>
            <div class="key_0" name="0">0</div>
            <div class="key_hyphen" name="-">-</div>
            <div class="deco_key2" name="^">^</div>
            <div class="deco_key3" name="IntlYen">&yen;</div>
            <div class="deco_key4" name="Backspace">BS</div>
            <div class="deco_key5" name="Tab">Tab</div>
            <div class="key_q" name="Q">Q</div>
            <div class="key_w" name="W">W</div>
            <div class="key_e" name="E">E</div>
            <div class="key_r" name="R">R</div>
            <div class="key_t" name="T">T</div>
            <div class="key_y" name="Y">Y</div>
            <div class="key_u" name="U">U</div>
            <div class="key_i" name="I">I</div>
            <div class="key_o" name="O">O</div>
            <div class="key_p" name="P">P</div>
            <div class="key_atmark" name="@">@</div>
            <div class="deco_key6" name="[">[</div>
            <div class="key_Enter" name="Enter">Enter</div>
            <div class="deco_key7" name="CapsLock">Caps</div>
            <div class="key_a" name="A">A</div>
            <div class="key_s" name="S">S</div>
            <div class="key_d" name="D">D</div>
            <div class="key_f" name="F">F</div>
            <div class="key_g" name="G">G</div>
            <div class="key_h" name="H">H</div>
            <div class="key_j" name="J">J</div>
            <div class="key_k" name="K">K</div>
            <div class="key_l" name="L">L</div>
            <div class="key_semicolon" name=";">;</div>
            <div class="key_colon" name=":">:</div>
            <div class="deco_key8" name="]">]</div>
            <div class="key_lShift" name="ShiftLeft">shift</div>
            <div class="key_z" name="Z">Z</div>
            <div class="key_x" name="X">X</div>
            <div class="key_c" name="C">C</div>
            <div class="key_v" name="V">V</div>
            <div class="key_b" name="B">B</div>
            <div class="key_n" name="N">N</div>
            <div class="key_m" name="M">M</div>
            <div class="key_comma" name=",">,</div>
            <div class="key_period" name=".">.</div>
            <div class="key_slash" name="/">/</div>
            <div class="deco_key9" name="IntlRo">＼</div>
            <div class="key_rShift" name="ShiftRight">shift</div>
            <div class="deco_key10" name="ControlLeft">Ctrl</div>
            <div class="deco_key11" name="win">Win</div>
            <div class="deco_key12" name="AltLeft">Alt</div>
            <div class="deco_key13" name="無変換">無変</div>
            <div class="key_space" name="Space">space</div>
            <div class="deco_key14" name="変換">変換</div>
            <div class="deco_key15" name="カタカナ">かな</div>
            <div class="deco_key16" name="AltRight">Alt</div>
            <div class="deco_key17" name="ContextMenu">▤</div>
            <div class="deco_key18" name="ControlRight">Ctrl</div>
          </div>
        </div>
      </div>
    </div>

    <div id="logMessage">
      <div id="message-1" style="color:#5383c3;">テーマ別スコア1位にランクイン</div>
      <div style="border-top: 1px dashed #000; margin:0 auto 10px; width:80%;"></div>
      <div id="message-2">ワード : 数のある言葉</div>
      <div id="message-3">記録 : 500</div>
    </div>`;

    //開くボタンを追加
    const button = document.createElement("div");
    button.id = "e-type-counter"
    button.textContent = "e-タイプ数カウンター";
    button.addEventListener("click",()=>{
        open();
    });
    const e = document.getElementById("practice_menu")
    if(e) e.parentNode.insertBefore(button,e);

    document.body.insertAdjacentHTML("beforeend",eTypeCounter_HTML);
}

function setCSS(){
    const eTypeCounter_css = `
#logMessage{
  text-align:center;
  width:500px;
  position:fixed;
  top:-150px;
  left:50%;
  transform: translateX(-50%);
  background-color:rgba(255,255,255,.8);
  padding:20px;
  transition:top 0.5s ease-in-out;
  border-bottom-left-radius:10px;
  border-bottom-right-radius:10px;
  box-shadow: 0px 0px 10px rgba(0,0,0,.5);
  border:2px solid #000;
  border-top:none;
  z-index:200000;
}

    #select{
        display:none;
        background-color:rgba(0,0,0,0.8);
        position:absolute;
        width:728px;
        height:520px;
        z-index:5000;
    }

    #type{
        display: flex;
        justify-content: space-between;
    }

    #e-type-counter{
        cursor:pointer;
        border-radius:3px;
        height:35px;
        line-height:35px;
        color:#fff;
        font-size:116%;
        font-weight:bold;
        margin:0 0 6px;
        padding-left:10px;
        background:linear-gradient(25deg,rgba(44,118,255,.6),rgba(61,239,245,.7))
    }

    #e-type-counter:hover {
        background:linear-gradient(25deg,rgba(61,239,245,.7),rgba(44,118,255,.6))
    }

    #keyName div{
        padding-left:2px;
    }
    .lrs:hover{
        background-color:#e9f9ff;
    }
    #game-screen{display:none;position:absolute;left:50%;transform:translateX(-50%);top:43px;width:748px;background:#fff;padding:0 10px 10px;z-index:10000}#game-screen,#game-screen *{font-family:Meiryo,Arial,sans-serif;box-sizing:border-box}#game-header{position:relative;height:40px;border-bottom:1px solid #cacaca;margin:0 0 5px}#type-counter{position:absolute;top:6px;right:141px;width:67px;height:27px;font-size:11px;font-weight:700;color:#777;background:linear-gradient(0deg,#eee,#fff);padding:1px 5px;border:1px solid #ccc;border-radius:3px;cursor:pointer;appearance:none}#ranking-button:hover,#type-counter:hover,#rankings:hover,#close-button1:hover{background:linear-gradient(180deg,#eee,#fff)}#rankings{text-overflow:ellipsis;position:absolute;top:6px;right:68px;width:67px;height:27px;font-size:11px;font-weight:700;color:#777;background:linear-gradient(0deg,#eee,#fff);padding:1px 5px;border:1px solid #ccc;border-radius:3px;cursor:pointer;appearance:none}#close-button1{position:absolute;top:6px;right:0;width:63px;height:27px;font-size:11px;font-weight:700;color:#777;background:linear-gradient(0deg,#eee,#fff);padding:1px 5px;border:1px solid #ccc;border-radius:3px;cursor:pointer;appearance:none}#close-button1:before{content:"";display:inline-block;width:12px;height:12px;background-image:url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" fill="%23777"/></svg>');background-size:contain;background-repeat:no-repeat;margin-right:2px;vertical-align:-.2em}#game-header .description{height:40px;font-size:18px;color:#7b7a7a;line-height:40px;margin:0 0 0 5px}#game-body{display:table;width:728px;height:520px;color:#636363}#log-ranking{margin:0 auto;width:647px;height:520px;background-color:#fff;border-radius:3px;-webkit-border-radius:3px;padding:6px 6px 0;border:1px solid #e6e6e6;overflow-y:scroll;display:none}.lrd-d{width:303px;height:34px;padding-left:10px;-webkit-border-radius:3px;border:1px solid #a6e4f9;line-height:34px;font-size:14px;float:left;color:#00aed5;background-color:#e9f9ff;font-weight:700}#lrh{color:#00aed5;padding-left:13px}.lrs{cursor:pointer;width:616.4px;height:39.49px;border:1px solid #d7d8da;border-radius:3px;-webkit-border-radius:3px;padding:8px 13px;background-color:#fff;margin:0 0 6px;clear:both}#data{border-right:1px solid #d8d8d8}.data-row{display:flex;justify-content:space-between}.data-left{text-align:left;padding:3px}.data-right{text-align:right;padding:3px}#key-data{overflow-y:scroll;border:1px solid #d8d8d8;grid-column:2/4;display:grid;grid-template-columns:1fr 1fr 1fr}.key-header{border-right:1px solid #d8d8d8;background-color:#fff;text-align:center;font-weight:700;position:sticky;top:0}.key-header:hover{background-color:#d9ebf9}#game-view2{display:none}#text-container{position:relative;max-width:610px;height:250px;border:1px solid #d8d8d8;margin:0 auto 10px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr 1fr}#virtual-keyboard{position:relative;width:610px;margin:0 auto}#virtual-keyboard div{cursor:pointer;position:absolute;width:36px;height:36px;border:1px solid #d8d8d8;border-radius:3px;font-weight:700;font-size:16px;line-height:34px;text-align:center;overflow:hidden}#virtual-keyboard div.deco_key1{top:41px;left:0}#virtual-keyboard div.key_1{top:41px;left:41px}#virtual-keyboard div.key_2{top:41px;left:82px}#virtual-keyboard div.key_3{top:41px;left:123px}#virtual-keyboard div.key_4{top:41px;left:164px}#virtual-keyboard div.key_5{top:41px;left:205px}#virtual-keyboard div.key_6{top:41px;left:246px}#virtual-keyboard div.key_7{top:41px;left:287px}#virtual-keyboard div.key_8{top:41px;left:328px}#virtual-keyboard div.key_9{top:41px;left:369px}#virtual-keyboard div.key_0{top:41px;left:410px}#virtual-keyboard div.key_hyphen{top:41px;left:451px}#virtual-keyboard div.deco_key2{top:41px;left:492px}#virtual-keyboard div.deco_key3{top:41px;left:533px}#virtual-keyboard div.deco_key4{top:41px;left:574px}#virtual-keyboard div.deco_key5{top:82px;width:56px}#virtual-keyboard div.key_q{top:82px;left:61px}#virtual-keyboard div.key_w{top:82px;left:102px}#virtual-keyboard div.key_e{top:82px;left:143px}#virtual-keyboard div.key_r{top:82px;left:184px}#virtual-keyboard div.key_t{top:82px;left:225px}#virtual-keyboard div.key_y{top:82px;left:266px}#virtual-keyboard div.key_u{top:82px;left:307px}#virtual-keyboard div.key_i{top:82px;left:348px}#virtual-keyboard div.key_o{top:82px;left:389px}#virtual-keyboard div.key_p{top:82px;left:430px}#virtual-keyboard div.key_atmark{top:82px;left:471px}#virtual-keyboard div.deco_key6{top:82px;left:512px}#virtual-keyboard div.key_Enter{top:82px;left:553px;width:57px;height:77px;clip-path:polygon(0 0,100% 0,100% 100%,21px 100%,21px 36px,0 36px)}#virtual-keyboard div.key_Enter:after{position:absolute;display:block;content:"";top:34px;left:0;width:20px;height:41px;border-top:1px solid #d8d8d8;border-right:1px solid #d8d8d8}#virtual-keyboard div.deco_key7{top:123px;width:76px}#virtual-keyboard div.key_a{top:123px;left:81px}#virtual-keyboard div.key_s{top:123px;left:122px}#virtual-keyboard div.key_d{top:123px;left:163px}#virtual-keyboard div.key_f{top:123px;left:204px}#virtual-keyboard div.key_g{top:123px;left:245px}#virtual-keyboard div.key_h{top:123px;left:286px}#virtual-keyboard div.key_j{top:123px;left:327px}#virtual-keyboard div.key_k{top:123px;left:368px}#virtual-keyboard div.key_l{top:123px;left:409px}#virtual-keyboard div.key_semicolon{top:123px;left:450px}#virtual-keyboard div.key_colon{top:123px;left:491px}#virtual-keyboard div.deco_key8{top:123px;left:532px}#virtual-keyboard div.key_lShift{top:164px;left:0;width:96px}#virtual-keyboard div.key_z{top:164px;left:101px}#virtual-keyboard div.key_x{top:164px;left:142px}#virtual-keyboard div.key_c{top:164px;left:183px}#virtual-keyboard div.key_v{top:164px;left:224px}#virtual-keyboard div.key_b{top:164px;left:265px}#virtual-keyboard div.key_n{top:164px;left:306px}#virtual-keyboard div.key_m{top:164px;left:347px}#virtual-keyboard div.key_comma{top:164px;left:388px}#virtual-keyboard div.key_period{top:164px;left:429px}#virtual-keyboard div.key_slash{top:164px;left:470px}#virtual-keyboard div.deco_key9{top:164px;left:511px}#virtual-keyboard div.key_rShift{top:164px;left:552px;width:58px}#virtual-keyboard div.deco_key10{top:205px;left:0;width:56px}#virtual-keyboard div.deco_key11{top:205px;left:61px}#virtual-keyboard div.deco_key12{top:205px;left:102px}#virtual-keyboard div.deco_key13{top:205px;left:143px}#virtual-keyboard div.key_space{top:205px;left:184px;width:181px}#virtual-keyboard div.deco_key14{top:205px;left:370px}#virtual-keyboard div.deco_key15{top:205px;left:411px}#virtual-keyboard div.deco_key16{top:205px;left:452px;width:56px}#virtual-keyboard div.deco_key17{top:205px;left:513px}#virtual-keyboard div.deco_key18{top:205px;left:554px;width:56px}#virtual-keyboard div.key_ESC{top 0;left:0;width:41px;height:30px}#virtual-keyboard div.key_F1{top 0;left:50px;width:45px;height:30px}#virtual-keyboard div.key_F2{top 0;top 0;left:95px;width:45px;height:30px}#virtual-keyboard div.key_F3{top 0;left:140px;width:45px;height:30px}#virtual-keyboard div.key_F4{top 0;left:185px;width:45px;height:30px}#virtual-keyboard div.key_F5{top 0;left:240px;width:45px;height:30px}#virtual-keyboard div.key_F6{top 0;left:285px;width:45px;height:30px}#virtual-keyboard div.key_F7{top 0;left:330px;width:45px;height:30px}#virtual-keyboard div.key_F8{top 0;left:375px;width:45px;height:30px}#virtual-keyboard div.key_F9{top 0;left:430px;width:45px;height:30px}#virtual-keyboard div.key_F10{top 0;left:475px;width:45px;height:30px}#virtual-keyboard div.key_F11{top 0;left:520px;width:45px;height:30px}#virtual-keyboard div.key_F12{top 0;left:565px;width:45px;height:30px}#virtual-keyboard div.active{border-color:#50bfff!important;background:-moz-linear-gradient(65deg,rgba(44,118,255,.6),rgba(61,239,245,.7));background:-webkit-linear-gradient(65deg,rgba(44,118,255,.6),rgba(61,239,245,.7));background:linear-gradient(25deg,rgba(44,118,255,.6),rgba(61,239,245,.7));color:#fff!important}`
    document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:eTypeCounter_css}));
}
