// ==UserScript==
// @name         Typing Tube マイリスト
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  多機能マイリストを追加
// @author       nora
// @license MIT
// @match        https://typing-tube.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502518/Typing%20Tube%20%E3%83%9E%E3%82%A4%E3%83%AA%E3%82%B9%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/502518/Typing%20Tube%20%E3%83%9E%E3%82%A4%E3%83%AA%E3%82%B9%E3%83%88.meta.js
// ==/UserScript==

// --- マイリスト表示設定方法 ---
//[並び替え]   昇順        降順         ランダム
//sort.type = "ascend" or "descend" or "random"
//[並び替え]   中央値        最高値        id      曲名       マイリスト追加順
//sort.mode = "medSpeed" or "maxSpeed" or "id" or "title" or "add"
//[速度表示]   ロマ   かな
//speedDisp = "R" or "K"
//[言語] (真 = 日本語のみ, 偽 = 日本語以外, "all" = 両方あり
//ja = 真 or 偽 or "all"

//マイリスト設定初期値
let config = {
    sort: {
        type: "descend", // sort.type
        mode: "medSpeed" // sort.mode
    },
    speedDisp: "R", // speedDisp
    ja: "all",
    //ja: true // 真
    //ja: false // 偽
    keyword: "", //曲名フィルター
}



let up = "i";
let down = "k";
let home = "j";
let end = "l";



class myList {
    constructor(){
        this.highlightLine = 0;
        this.lineHeight = 25;
        this.defaultScroll = 50 - this.lineHeight*4;

        this.config = structuredClone(config);
    };

    open(){
        $("#modal").remove();

        $("#ChatInput")?.blur();
        $("body").prepend(`<div id="myList_modal">
            <div id="myList_holder">
                <table id="myList_table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th id="title" colspan="2">曲名</th>
                            <th id="median_speed" style="background-color:${config.speedDisp === "R" ? "#ffa800" : "#82cf02"};">中央値(${config.speedDisp})</th>
                            <th id="max_speed" style="background-color:${config.speedDisp === "R" ? "#ffa800" : "#82cf02"};">最高値(${config.speedDisp})</th>
                        </tr>
                    </thead>
                    <tbody id="myList"></tbody>
                </table>
            </div>
        </div>`);
        this.dataSet(JSON.parse(localStorage.getItem("myList")));
    };

    close(){
        $(document).off(".myList");
        $("#myList_modal").remove();
        $("#ChatInput")?.focus();
    };

    manage(id){
        if (isNaN(id)) return alert("idが数値ではありません\nid: " + id);

        try {
            if (!parseLyric.romaMedianSpeed) throw new Error("ローマ字の中央値が存在しません");
            if (!parseLyric.romaMaxSpeed) throw new Error("ローマ字の最高値が存在しません");
            if (!parseLyric.kanaMedianSpeed) throw new Error("かなの中央値が存在しません");
            if (!parseLyric.kanaMaxSpeed) throw new Error("かなの最高値が存在しません");
        } catch (error) {
            return alert(error.message);
        }

        let myList = JSON.parse(localStorage.getItem("myList"));
        let hasID = myList.some(love => love.id === id);

        if(!hasID){
            let title;
            let medianR = parseLyric.romaMedianSpeed.toFixed(2);
            let maxR = parseLyric.romaMaxSpeed.toFixed(2);
            let medianK = parseLyric.kanaMedianSpeed.toFixed(2);
            let maxK = parseLyric.kanaMaxSpeed.toFixed(2);

            let defaultTitle = player?.videoTitle || "";
            let customTitle = prompt("選曲画面に表示する曲名を設定（デフォルトは空白で送信してください)\nデフォルト: " + defaultTitle);

            if (customTitle === null) return;
            title = customTitle || defaultTitle;

            let love = {
                "id":id,
                "title":title,
                "medR":medianR,
                "maxR":maxR,
                "medK":medianK,
                "maxK":maxK
            };

            myList.push(love);
            localStorage.setItem("myList",JSON.stringify(myList));
            $("#list_btn").text("マイリストから削除")
        }else{
            let title = myList.filter(e => e.id == id)[0].title;
            if(confirm(title + " をマイリストから削除しますか？")){
                myList = myList.filter(e => e.id != id);
                localStorage.setItem("myList",JSON.stringify(myList));
                alert(title + " を削除しました。");
                $("#list_btn").text("マイリストへ追加")
            }
        }
    }

    sortMyList(myList,conf){
        let type = conf.sort.type;
        let mode = conf.sort.mode;
        let speedDisp = conf.speedDisp;

        myList = myList.filter(love => this.convert(love["title"]).includes(this.convert(conf.keyword)));

        if(type === "descend" || type === "ascend") {
            if(mode !== "add"){
                myList.sort((a,b) => {
                    if(mode === "medSpeed" || mode === "maxSpeed"){
                        let e = mode.slice(0,3) + speedDisp;
                        return type === "descend"
                        ? b[e]-a[e]
                        : a[e]-b[e]
                    }else if(mode === "id"){
                        return type === "descend"
                        ? b[mode]-a[mode]
                        : a[mode]-b[mode]
                    }else if(mode === "title"){
                        return type === "descend"
                        ? b[mode].localeCompare(a[mode])
                        : a[mode].localeCompare(b[mode])
                    }
                })
            }else if(type === "descend"){
                myList = myList.reverse();
            }
        }else if(type === "random"){
            for (let i = myList.length-1; i>0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [myList[i],myList[j]] = [myList[j],myList[i]];
            }
        }

        if(conf.ja !== "all"){
            myList = myList.filter(love => conf.ja
                ? love.medR != love.medK
                : love.medR == love.medK
            )
        }

        return myList;
    }

    dataSet(myList,conf = config){
        this.myList = this.sortMyList(myList,conf);

        $("#median_speed").css("background-color",this.config.speedDisp === "R" ? "#ffa800" : "#82cf02");
        $("#max_speed").css("background-color",this.config.speedDisp === "R" ? "#ffa800" : "#82cf02");
        $("#median_speed").text(`中央値(${this.config.speedDisp})`)
        $("#max_speed").text(`最高値(${this.config.speedDisp})`)

        let HTML = `<tr>
                        <td class="column_id" style="cursor: pointer;"></td>
                        <td class="column_title" style="cursor: pointer;" colspan="2"></td>
                        <td class="column_speed median"></td>
                        <td class="column_speed max"></td>
                    </tr>`.repeat(this.myList.length);
        $("#myList").html(HTML);

        let id = $(".column_id");
        let title = $(".column_title");
        let median = $(".median");
        let max = $(".max");

        this.myList.forEach((e,i)=>{
            id.eq(i).text("#" + e.id);
            title.eq(i).text(e.title);
            median.eq(i).text(e[`med${conf.speedDisp}`]);
            max.eq(i).text(e[`max${conf.speedDisp}`]);
        });

        this.highlightLine = 0;
        document.querySelector("#myList_modal > div").scrollTo(0,this.defaultScroll);

        title.eq(0)?.css("border","double 3px #007bff");
        title.eq(0)?.html(`<div class="pyon">${title.eq(0).text()}</div>`);

        this.speedColor();
        this.titleColor(this.myList);
        this.eventListener();
    }

    speedColor(){
        $(".column_speed").each((_,cell) => {
            let speed = $(cell).text();
            speed < 8 ? $(cell).css("background-color","#00ff00") :
            speed < 12.50 ? $(cell).css("background-color","#ffff00") :
            speed < 15.00 ? $(cell).css("background-color","#ff9900") :
            speed < 20.00 ? $(cell).css("background-color","#ff0000") : $(cell).css("background-color","#ff0000");
        })
    }

    titleColor(myList){
        $(".column_title").each((i,cell) => {
            let roma_speed = myList[i].medR;
            let kana_speed = myList[i].medK;
            if (roma_speed === kana_speed) $(cell).css({
                "font-weight": "bold",
                "color": "#fc7ca1"
            });
        })
    }

    eventListener(){
        $(document).off(".myList");

        $(document).on("click.myList","#myList_holder",e => {
            if ($("#filter").length) this.filterClose();

            let className = e.target.className;
            if(className === "column_id"){
                let id = $(e.target).text();
                navigator.clipboard.writeText(id).then(() => {
                    let highlight = $(".column_title").eq($(e.target.parentNode).index()).text();
                    this.showMessage(highlight,"のIDをコピーしました。");
                });
            }else if(className === "pyon" || className === "column_title"){
                let url = "https://typing-tube.net/movie/show/" + $(".column_id").eq($(e.target.parentNode).closest("tr").index()).text().slice(1);

                e.shiftKey || e.ctrlKey ? open(url) : location.href = url;

                this.showMessage($(e.target).text(),"へ遷移しています…");
            }
        })

        $(document).on("mouseover.myList","#filter",e => {
            if (e.target.id === "detail_toggle") this.detailFilter();
        })

        $(document).on("keydown.myList",e => {
            let key = e.key;
            let code = e.originalEvent.code;

            if(key === "f" && e.ctrlKey && !$("#filter").length){
                e.preventDefault();
                this.filterOpen();
            };

            if(key === "c" && e.ctrlKey){
                e.preventDefault();
                let id = $(".column_id").eq(this.highlightLine).text();
                navigator.clipboard.writeText(id).then(() => {
                    let highlight = $(".column_title").eq(this.highlightLine).text();
                    this.showMessage(highlight,"のIDをコピーしました。");
                });
            }

            if(key === "d" && e.ctrlKey){
                e.preventDefault();
                let title = $(".column_title").eq(this.highlightLine).text();
                if(confirm(title + " をマイリストから削除しますか？")){
                    let myList = JSON.parse(localStorage.getItem("myList"));
                    let id = $(".column_id").eq(this.highlightLine).text().slice(1);
                    myList = myList.filter(e => e.id != id);
                    localStorage.setItem("myList",JSON.stringify(myList));
                    alert(title + " を削除しました。");
                }
            }

            if(code === "Space" || key === "Enter"){
                e.preventDefault();
                let url = "https://typing-tube.net/movie/show/" + $(".column_id").eq(this.highlightLine).text().slice(1);

                e.shiftKey || e.ctrlKey ? open(url) : location.href = url;

                this.showMessage($(".column_title").eq(this.highlightLine).text(),"へ遷移しています…");
            }

            if(code === "KeyA" || code === "KeyE" || code === "KeyR" || code === "KeyN"){
                e.preventDefault();
                let conf = e.shiftKey ? this.config : structuredClone(config);
                switch (code.slice(3)) {
                    case "A":
                        conf.sort.mode = "add";
                        break;
                    case "E":
                        conf.ja = 0;
                        break;
                    case "R":
                        conf = structuredClone(conf);
                        conf.sort.type = "random";
                        break;
                    case "N":
                        return this.dataSet(JSON.parse(localStorage.getItem("myList")),structuredClone(config));
                }

                let myList = e.shiftKey ? this.myList : JSON.parse(localStorage.getItem("myList"));
                this.dataSet(myList,conf);
            }

            if(key === down && !e.ctrlKey && this.highlightLine < $(".column_title").length-1){
                this.highlightLine++;
                if (($("#myList_holder").scrollTop()-this.defaultScroll) <= this.lineHeight * this.highlightLine)$("#myList_holder").scrollTop(this.defaultScroll + this.highlightLine * this.lineHeight);
                this.highlight()
            }else if(key === up && !e.ctrlKey && this.highlightLine > 0){
                this.highlightLine--;
                if (($("#myList_holder").scrollTop()-this.defaultScroll) >= this.lineHeight * this.highlightLine) $("#myList_holder").scrollTop(this.defaultScroll + this.highlightLine * this.lineHeight);
                this.highlight()
            }else if(key === end && !e.ctrlKey){
                this.highlightLine = $(".column_title").length - 1 < this.highlightLine + 30 ? $(".column_title").length - 1 : this.highlightLine + 30;
                $("#myList_holder").scrollTop(this.lineHeight * this.highlightLine + this.defaultScroll);
                this.highlight()
            }else if(key === home && !e.ctrlKey){
                this.highlightLine = 0 > this.highlightLine - 30 ? 0 : this.highlightLine - 30;
                $("#myList_holder").scrollTop(this.lineHeight * this.highlightLine + this.defaultScroll);
                this.highlight()
            }
        })
    }

    highlight(){
        let title = document.getElementsByClassName("column_title")
        let index = Array.from(title).findIndex(e => getComputedStyle(e).borderStyle === "double");
        title[index].style.border = "";
        title[index].innerHTML = title[index].textContent;

        title[this.highlightLine].style.border = "double 3px #007bff";
        title[this.highlightLine].innerHTML = `<div class="pyon">${title[this.highlightLine].textContent}</div>`
    }

    showMessage(highlight,message){
        $("body").prepend(`<div class="message" style="z-index:${$(".message,#filter").length+5000}">
            <div class="underline">
                <span class="message_highlight" style="max-width: calc(100% - ${message.length*16}px);">${highlight}</span>
                <span>${message}</span>
            </div>
        </div>`);

        $(".message").first().animate({
            top: 0
        },1000,"easeOutExpo",function(){
            setTimeout(()=>{
                $(this).animate({
                    top: -72.5 - 5
                },1000,"easeOutExpo",function(){
                    $(this).remove();
                })
            },1500)
        })
    }

    filterOpen(){
        $("#filter").remove();
        $("#myList_modal").prepend(`<div id="filter" style="z-index: 1; top: 0px;">
            <div>
                <input type="text" id="filter_input" placeholder="キーワードを入れて曲名検索">
            </div>
            <div id="detail_toggle"></div>
        </div>`);

        $("#filter_input").focus();
        $("#filter_input").on({
            "input":e => {
                let value = e.target.value;

                this.config.keyword = value;

                this.dataSet(JSON.parse(localStorage.getItem("myList")),this.config);
            },
            "keydown":e => {
                e.stopPropagation();
                if (e.key === "Enter") this.filterClose();
                if (e.key === "Escape") $("#filter_input").blur();
            }
        })
    }

    filterClose(){
        $("#filter").remove();
        this.config.keyword = "";
    }

    detailFilter(){
        let detailToggle = $("#detail_toggle");
        let deg = (Number(document.getElementById("detail_toggle").style.transform.replace(/\D/g,"")) || 0) + 180;

        if(!$("#detail").length){
            detailToggle.css("transform",`rotate(${deg}deg)`);

            detailToggle.before(`<div id="detail">
                <div>
                    <div>打鍵速度表示</div>
                    <label><input type="radio" name="speed" value="R">ローマ字</label>
                    <label><input type="radio" name="speed" value="K">かな</label>
                </div>
                <div>
                    <div>並び替え</div>
                    <label><input type="radio" name="sort" value="descend">降順</label>
                    <label><input type="radio" name="sort" value="ascend">昇順</label>
                    <label title="ショートカット: r (初期設定) shift+r (現在の設定)"><input type="radio" name="sort" value="random">ランダム</label>
                </div>
                <div>
                    <div>言語</div>
                    <label><input type="radio" name="language" value="1">日本語</label>
                    <label title="ショートカット: e (初期設定) shift+e (現在の設定)"><input type="radio" name="language" value="0">英語&nbsp;+&nbsp;その他</label>
                    <label><input type="radio" name="language" value="all">全て</label>
                </div>
            </div>`);

            $(`#detail input[name="speed"][value="${this.config.speedDisp}"]`).prop("checked",true);
            $(`#detail input[name="sort"][value="${this.config.sort.type}"]`).prop("checked",true);
            $(`#detail input[name="language"][value="${this.config.ja}"]`).prop("checked",true);

            $("#filter").off(".filter");
            $("#filter").on("change.filter mouseover.filter",e => {
                if (e.type === "mouseover" && !$(e.target).closest("#sort_mode_tooltip").length) $("#sort_mode_tooltip").remove();
                if((e.type === "change" && ($(e.target).value === "descend" || $(e.target).value === "ascend")) || (e.type === "mouseover" && $(e.target).is("input[type='radio'][name='sort']") && $(e.target).is(":checked") && $(e.target).attr("value") !== "random")){
                    $("#sort_mode_tooltip").remove();
                    let filter = $("#filter");
                    let top = $(e.target).offset().top - filter.offset().top + 13;
                    let left = $(e.target).offset().left - filter.offset().left - 8;
                    filter.append(`<div id="sort_mode_tooltip" style="top: ${top}px; left: ${left}px;">
                            <div><label><input type="radio" name="sort_mode" value="id">ID</label></div>
                            <div><label><input type="radio" name="sort_mode" value="title">曲名</label></div>
                            <div><label><input type="radio" name="sort_mode" value="medSpeed">中央値</label></div>
                            <div><label><input type="radio" name="sort_mode" value="maxSpeed">最高値</label></div>
                            <div><label title="ショートカット: a (初期設定) shift+a (現在の設定)"><input type="radio" name="sort_mode" value="add">追加順</label></div>
                        </div>`);

                    if (e.type === "mouseover") $(`#sort_mode_tooltip [value="${this.config.sort.mode}"]`).prop("checked",true);
                    $("#sort_mode_tooltip").one("mouseleave",function(){$(this).remove()})
                }

                if (e.type === "mouseover") return;

                let myList = JSON.parse(localStorage.getItem("myList"));
                let value = e.target.getAttribute("value");
                switch (e.target.getAttribute("name")) {
                    case "speed":
                        this.config.speedDisp = value;
                        this.dataSet(myList,this.config);
                        break;
                    case "sort":
                        this.config.sort.type = value;
                        if (value === "random") this.dataSet(myList,this.config);
                        break;
                    case "sort_mode":
                        this.config.sort.mode = value;
                        this.dataSet(myList,this.config);
                        break;
                    case "language":
                        this.config.ja = value === "all" ? value : JSON.parse(value);
                        this.dataSet(myList,this.config);
                }
            })

            $("#detail").animate({height:"150px",top:"0px"},500,"easeOutExpo")
        }else{
            detailToggle.css("transform",`rotate(${deg}deg)`);
            $("#detail").animate({height:"0px",top:"-200px"},500,"easeOutExpo",function(){$(this).remove()});
        }
    }

    convert(input){
        //大文字 → 小文字
        input = input.toLowerCase();

        //全角英数字・記号 → 半角
        input = input.replace(/[！-～]/g,match => {
            return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
        }).replace(/”/g,"\"")
            .replace(/’/g,"'")
            .replace(/‘/g,"`")
            .replace(/￥/g,"\\")
            .replace(/　/g," ")
            .replace(/ー/g,"-")
            .replace(/〜/g,"~")
            .replace(/・/g,"/");



        let kanaMap = {
            'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
            'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
            'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
            'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
            'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
            'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
            'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
            'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
            'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
            'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
            'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
            'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
            'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
            'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
            'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
            'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
            'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
            'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
            '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
        };

        //半角カタカナ → カタカナ
        let reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
        input = input.replace(reg,match => {
            return kanaMap[match];
        }).replace(/ﾞ/g, '゛').replace(/ﾟ/g, '゜');

        //カタカナ → ひらがな
        input = input.replace(/[\u30a1-\u30f6]/g,match => {
            let char = match.charCodeAt(0) - 0x60;
            return String.fromCharCode(char);
        });

        //ローマ字 → ひらがな
        //https://github.com/shikatan0/romaji-to-hira-js
        let romaji_hira = {a:'あ',b:{a:'ば',e:'べ',i:'び',o:'ぼ',u:'ぶ',y:{a:'びゃ',e:'びぇ',i:'びぃ',o:'びょ',u:'びゅ'}},c:{a:'か',e:'せ',h:{a:'ちゃ',e:'ちぇ',i:'ち',o:'ちょ',u:'ちゅ'},i:'し',o:'こ',u:'く',y:{a:'ちゃ',e:'ちぇ',i:'ちぃ',o:'ちょ',u:'ちゅ'}},d:{a:'だ',e:'で',h:{a:'でゃ',e:'でぇ',i:'でぃ',o:'でょ',u:'でゅ'},i:'ぢ',o:'ど',u:'づ',w:{a:'どぁ',e:'どぇ',i:'どぃ',o:'どぉ',u:'どぅ'},y:{a:'ぢゃ',e:'ぢぇ',i:'ぢぃ',o:'ぢょ',u:'ぢゅ'}},e:'え',f:{a:'ふぁ',e:'ふぇ',i:'ふぃ',o:'ふぉ',u:'ふ',w:{a:'ふぁ',e:'ふぇ',i:'ふぃ',o:'ふぉ',u:'ふぅ'},y:{a:'ふゃ',e:'ふぇ',i:'ふぃ',o:'ふょ',u:'ふゅ'}},g:{a:'が',e:'げ',i:'ぎ',o:'ご',u:'ぐ',w:{a:'ぐぁ',e:'ぐぇ',i:'ぐぃ',o:'ぐぉ',u:'ぐぅ'},y:{a:'ぎゃ',e:'ぎぇ',i:'ぎぃ',o:'ぎょ',u:'ぎゅ'}},h:{a:'は',e:'へ',i:'ひ',o:'ほ',u:'ふ',y:{a:'ひゃ',e:'ひぇ',i:'ひぃ',o:'ひょ',u:'ひゅ'}},i:'い',j:{a:'じゃ',e:'じぇ',i:'じ',o:'じょ',u:'じゅ',y:{a:'じゃ',e:'じぇ',i:'じぃ',o:'じょ',u:'じゅ'}},k:{a:'か',e:'け',i:'き',o:'こ',u:'く',w:{a:'くぁ'},y:{a:'きゃ',e:'きぇ',i:'きぃ',o:'きょ',u:'きゅ'}},l:{a:'ぁ',e:'ぇ',i:'ぃ',k:{a:'ヵ',e:'ヶ'},o:'ぉ',t:{s:{u:'っ'},u:'っ'},u:'ぅ',w:{a:'ゎ'},y:{a:'ゃ',e:'ぇ',i:'ぃ',o:'ょ',u:'ゅ'}},m:{a:'ま',e:'め',i:'み',o:'も',u:'む',y:{a:'みゃ',e:'みぇ',i:'みぃ',o:'みょ',u:'みゅ'}},n:{a:'な',e:'ね',i:'に',n:'ん',o:'の',u:'ぬ',y:{a:'にゃ',e:'にぇ',i:'にぃ',o:'にょ',u:'にゅ'}},o:'お',p:{a:'ぱ',e:'ぺ',i:'ぴ',o:'ぽ',u:'ぷ',y:{a:'ぴゃ',e:'ぴぇ',i:'ぴぃ',o:'ぴょ',u:'ぴゅ'}},q:{a:'くぁ',e:'くぇ',i:'くぃ',o:'くぉ',u:'く',w:{a:'くぁ',e:'くぇ',i:'くぃ',o:'くぉ',u:'くぅ'},y:{a:'くゃ',e:'くぇ',i:'くぃ',o:'くょ',u:'くゅ'}},r:{a:'ら',e:'れ',i:'り',o:'ろ',u:'る',y:{a:'りゃ',e:'りぇ',i:'りぃ',o:'りょ',u:'りゅ'}},s:{a:'さ',e:'せ',h:{a:'しゃ',e:'しぇ',i:'し',o:'しょ',u:'しゅ'},i:'し',o:'そ',u:'す',w:{a:'すぁ',e:'すぇ',i:'すぃ',o:'すぉ',u:'すぅ'},y:{a:'しゃ',e:'しぇ',i:'しぃ',o:'しょ',u:'しゅ'}},t:{a:'た',e:'て',h:{a:'てゃ',e:'てぇ',i:'てぃ',o:'てょ',u:'てゅ'},i:'ち',o:'と',s:{a:'つぁ',e:'つぇ',i:'つぃ',o:'つぉ',u:'つ'},u:'つ',w:{a:'とぁ',e:'とぇ',i:'とぃ',o:'とぉ',u:'とぅ'},y:{a:'ちゃ',e:'ちぇ',i:'ちぃ',o:'ちょ',u:'ちゅ'}},u:'う',v:{a:'ゔぁ',e:'ゔぇ',i:'ゔぃ',o:'ゔぉ',u:'ゔ',y:{a:'ゔゃ',e:'ゔぇ',i:'ゔぃ',o:'ゔょ',u:'ゔゅ'}},w:{a:'わ',e:'うぇ',h:{a:'うぁ',e:'うぇ',i:'うぃ',o:'うぉ',u:'う'},i:'うぃ',o:'を',u:'う',y:{e:'ゑ',i:'ゐ'},},x:{a:'ぁ',e:'ぇ',i:'ぃ',k:{a:'ヵ',e:'ヶ'},n:'ん',o:'ぉ',t:{s:{u:'っ'},u:'っ'},u:'ぅ',w:{a:'ゎ'},y:{a:'ゃ',e:'ぇ',i:'ぃ',o:'ょ',u:'ゅ'}},y:{a:'や',e:'いぇ',i:'い',o:'よ',u:'ゆ'},z:{a:'ざ',e:'ぜ',i:'じ',o:'ぞ',u:'ず',y:{a:'じゃ',e:'じぇ',i:'じぃ',o:'じょ',u:'じゅ'}}}
        input = ((input) => {
            let result = ''  // 変換結果の出力文字列
            let state = romaji_hira  // 解析の状態
            let pending = ''  // 変換保留中の文字
            let dual = false  // 同じ文字が連続して入力されたか
            let offset = 0  // 入力文字列内での位置
            const size = input.length
            while (offset < size) {
                const char = input[offset]
                // 現在の解析状態で一致する文字が存在する場合
                if (char in state) {
                    const value = state[char]
                    // 変換確定
                    if (typeof value === 'string') {
                        if (dual) {
                            result += 'っ'
                            dual = false
                        }
                        result += value
                        pending = ''
                        state = romaji_hira
                    }
                    // 変換途中
                    else {
                        state = value
                        pending = char
                    }
                    offset += 1
                    continue
                }
                // 現在の解析状態で一致する文字が存在しない場合
                // 連続する同じ文字に続けて入力された文字の場合
                if (dual) {
                    result += pending + pending
                    pending = ''
                    state = romaji_hira
                    dual = false
                    continue
                }
                // 直前の文字との厳密等価判定
                switch (pending) {
                    case char:
                        dual = true
                        state = romaji_hira
                        continue
                    case 'n':
                        result += 'ん'
                        pending = ''
                        state = romaji_hira
                        continue
                    case '':
                        result += char
                        offset += 1
                        continue
                }
                // 該当なし
                result += pending
                pending = ''
                state = romaji_hira
                continue
            }
            // 末尾の未確定な入力
            if (dual) {
                pending += pending
            }
            return result + pending
        })(input)



        let kanaToRoma = {
            "あ":"a","い":"i","う":"u","え":"e","お":"o",
            "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
            "さ":"sa","し":"si","す":"su","せ":"se","そ":"so",
            "た":"ta","ち":"ti","つ":"tu","て":"te","と":"to",
            "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",
            "は":"ha","ひ":"hi","ふ":"hu","へ":"he","ほ":"ho",
            "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
            "や":"ya","ゆ":"yu","よ":"yo",
            "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
            "わ":"wa","を":"wo","ん":"nn",
            "ぁ":"la","ぃ":"li","ぅ":"lu","ぇ":"le","ぉ":"lo",
            "っ":"ltu",
            "ゃ":"lya","ゅ":"lyu","ょ":"lyo",
            "ヴ":"vu",
            "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
            "ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
            "だ":"da","ぢ":"di","づ":"du","で":"de","ど":"do",
            "ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
            "ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",
        }

        //ひらがなを一意のローマ字へ再変換
        input = input.split("").map(e => {
            return kanaToRoma[e] ? kanaToRoma[e] : e
        }).join("");

        return input;
    }
};

class init extends myList {
    constructor(){
        super();
        if (!localStorage.getItem("myList")) this.initMyList();
        this.appendCSS();
        this.appendHTML();

        $(document).on({
            "keydown": e => this.keydownEvent(e),
            "click": e => this.clickEvent(e)
        });
    }

    initMyList(){
        if(confirm("マイリストを初期化しますか？")){
            localStorage.setItem("myList","[]");
            alert("マイリストを初期化しました。");
        }
    }

    appendCSS(){
        let myListCSS = `
        #myList_modal {
            background-color: rgba(0,0,0,0.7);
            color: black;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
        }

        #myList_holder {
            background-color: #fff;
            margin: 5% auto;
            width: 800px;
            height: 750px;
            overflow: auto;
            border-radius: 20px
        }

        #myList_table {
            width: 100%;
            table-layout: fixed;
        }

        #myList_table th {
            background-color: #bebdc2;
            height: 50px;
            border: 1px solid #888;
            text-align: center;
        }

        #myList_table th:hover {
            background-color: #9fa1a7;
        }

        #myList td {
            height: ${this.lineHeight}px;
            border: 1px solid #888;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        #myList td:hover {
            background-color: #d9ebf9;
        }

        #myList td:active {
            background-color: #bcdcf4;
        }

        .message, #filter {
            color: white;
            text-align: center;
            width: 500px;
            position: fixed;
            top: -72.5px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgb(80 80 80 / 80%);
            padding: 20px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            box-shadow: 0px 0px 10px rgba(255,255,255,.5);
            border: 2px solid #597f7f;
            border-top: none;
        }

        .message > :first-child, #filter > :first-child {
            width: 85%;
            border-bottom: 1px dashed #fff;
            margin: 0 auto 10px;
        }

        .message_highlight {
            display: inline-block;
            color: #7ff;
            white-space: nowrap;
            overflow-y: clip;
            text-overflow: ellipsis;
            font-weight: bold;
        }

        #filter_input {
            width: 100%;
            color: white;
            border: none;
            background-color: transparent;
        }

        #detail {
            position: relative;
            top: -200px;
        }

        #sort_mode_tooltip {
            z-index: 1;
            text-align: left;
            padding: 5px;
            border: 3px solid gray;
            border-radius: 10px;
            background-color: rgb(0 0 0 / 80%);
            position: absolute;
        }

        #detail_toggle {
            cursor: pointer;
            line-height: 0;
            transition: transform .5s ease;
        }

        #detail_toggle::after {
            content: "▼";
            color: aqua;
            opacity: 0.8;
        }

        .pyon {
            animation: pyon .8s infinite ease-in-out;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        @keyframes pyon {
            0% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
            100% { transform: translateY(0); }
        }`;

        let css = $("<style></style>").text(myListCSS);
        $("head").append(css);
    }

    appendHTML(){
        //左メニュー キッズコーナー の上に選曲ボタン追加
        //$("a[href='/kids']").parent().before("<li class='navigation__sub @@variantsactive'><a class='text-nowrap' id='myListOpen'><i class='icon-search' style='font-size:20px'></i>選曲</a></li>");
        $("a[href='/kids']").parent().before("<li><a id='myListOpen'><i class='icon-search' style='font-size:20px'></i>選曲</a></li>");
        $("#myListOpen").on("click",() => this.open());

        //[練習モードで開始]ボタンの左にマイリスト操作ボタン追加
        if($("#practice-mode-button").length){
            $("#practice-mode-button").before(`<span class="btn btn-border" id="list_btn" style="cursor:pointer">マイリスト${JSON.parse(localStorage.myList).filter(e => e["id"] === location.href.replace(/\D/g,"")).length === 0 ? "へ追加" : "から削除"}</span>`);
            $("#list_btn").on("click",() => this.manage(location.href.replace(/\D/g,"")));
        }
    }

    keydownEvent = (e) => {
        if(e.ctrlKey){
            if(e.key === "o"){
                if(!$("#myList_modal").length){
                    e.preventDefault();
                    this.open();
                }
            }else if(e.key === "s"){
                if(location.href.includes("movie/show/")){
                    e.preventDefault();
                    this.manage(location.href.replace(/\D/g,""));
                }
            }
        }else{
            if(e.key === "Escape"){
                if ($("#filter").length) return this.filterClose();
                this.close();
            }
        }
    }

    clickEvent = (e) => {
        if (e.target.id === "myList_modal") this.close();
    }
};

window.c = new init();