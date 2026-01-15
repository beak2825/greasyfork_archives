// ==UserScript==
// @name         「新しい日本語を作る会」コメントシステムの改良
// @namespace    http://lit.link/toracatman
// @version      2026-01-15
// @description  「新しい日本語を作る会」の コメントシステムを 改良します。
// @author       トラネコマン
// @match        http://www.tackns.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489086/%E3%80%8C%E6%96%B0%E3%81%97%E3%81%84%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%92%E4%BD%9C%E3%82%8B%E4%BC%9A%E3%80%8D%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%81%AE%E6%94%B9%E8%89%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/489086/%E3%80%8C%E6%96%B0%E3%81%97%E3%81%84%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%82%92%E4%BD%9C%E3%82%8B%E4%BC%9A%E3%80%8D%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%81%AE%E6%94%B9%E8%89%AF.meta.js
// ==/UserScript==

let css = `
.mute :is(.cs_name,.cs_name+.cs_text,input[type="button"]+input[type="button"],input[type="submit"],.cs_contents) {
    display: none;
}
.open * {
    display: initial !important;
}
`;

//ミュート追加
function addMute(t, w) {
    let mute = JSON.parse(localStorage.getItem("mute"));
    if (mute == null) mute = { names: [], contents: [] };

    if (t == 0) {
        if (mute.names.indexOf(w) === -1) mute.names.push(w);
    }
    else {
        if (mute.contents.indexOf(w) === -1) mute.contents.push(w);
    }

    localStorage.setItem("mute", JSON.stringify(mute));
    makeMuteWordItem(t, w);

    muteProcess();
}

//ミュート処理
function muteProcess() {
    let mute = JSON.parse(localStorage.getItem("mute"));
    if (mute == null) mute = { names: [], contents: [] };

    let a = document.querySelectorAll(".cs_comment:not(.mute) .cs_name");
    for (let i = 0; i < a.length; i++) {
        //名前
        let f = false;
        for (let j = 0; j < mute.names.length; j++) {
            if (new RegExp(mute.names[j], "u").test(a[i].textContent)) {
                applyMute(a[i], 0, mute.names[j]);
                f = true;
                break;
            }
        }
        if (f) continue;

        //本文
        for (let j = 0; j < mute.contents.length; j++) {
            if (new RegExp(mute.contents[j], "u").test(a[i].parentNode.lastElementChild.textContent)) {
                applyMute(a[i], 1, mute.contents[j]);
                break;
            }
        }
    }
}

//ミュート適用
function applyMute(a, t, w) {
    let comment = a.parentNode;
    comment.setAttribute("data-mutetype", t);
    comment.setAttribute("data-muteword", w);
    comment.querySelector(".cs_button").value = "ミュート解除";
    comment.classList.add("mute");
    let b = document.createElement("span");
    b.className = "cs_text";
    b.textContent = t == 0 ? "《ミュートしている投稿者によるコメントです》" : "《ミュートしている内容が含まれるコメントです》";
    a.nextElementSibling.after(b);
    let c = document.createElement("input");
    c.type = "button";
    c.value = "表示";
    c.className = "cs_button";
    c.onclick = function() { displayButton(this) };
    b.after(c);
    c.after(document.createTextNode("\n"));
}

//ミュート解除
function removeMute(t, w) {
    let mute = JSON.parse(localStorage.getItem("mute"));
    if (mute == null) return;

    if (t == 0) {
        mute.names = mute.names.filter(f => f !== w);
    }
    else {
        mute.contents = mute.contents.filter(f => f !== w);
    }

    localStorage.setItem("mute", JSON.stringify(mute));
    document.querySelector(`#mute_word_list input[data-mutetype="${t}"][data-muteword="${w}"]`).parentNode.remove();

    let a = document.querySelectorAll(`.mute[data-mutetype="${t}"][data-muteword="${w}"]`);
    for (let i = 0; i < a.length; i++) {
        a[i].removeAttribute("data-mutetype");
        a[i].removeAttribute("data-muteword");
        a[i].classList.remove("mute");
        a[i].classList.remove("open");
        a[i].querySelector(".cs_text+.cs_text").remove();
        a[i].querySelector(".cs_button").remove();
        a[i].querySelector(".cs_button").value = "ミュート";
    }
}

//ミュートした ワード一覧の 作成
function makeMuteWordList() {
    let mute = JSON.parse(localStorage.getItem("mute"));
    if (mute == null) mute = { names: [], contents: [] };

    let details = document.createElement("details");
    details.id = "mute_word_list";
    let summary = document.createElement("summary");
    summary.textContent = "ミュートしたワード一覧";
    details.appendChild(summary);

    let span;
    let ul;

    //名前
    span = document.createElement("span");
    span.textContent = "名前";
    details.appendChild(span);
    ul = document.createElement("ul");
    ul.id = "mute_word_names";
    details.appendChild(ul);

    //本文
    span = document.createElement("span");
    span.textContent = "本文";
    details.appendChild(span);
    ul = document.createElement("ul");
    ul.id = "mute_word_contents";
    details.appendChild(ul);

    document.muteform.after(details);

    for (let i = 0; i < mute.names.length; i++) {
        makeMuteWordItem(0, mute.names[i]);
    }
    for (let i = 0; i < mute.contents.length; i++) {
        makeMuteWordItem(1, mute.contents[i]);
    }
}

//項目の 作成
function makeMuteWordItem(t, w) {
    let li = document.createElement("li");
    li.textContent = w;
    let input = document.createElement("input");
    input.type = "button";
    input.value = "ミュート解除";
    input.className = "cs_button";
    input.setAttribute("data-mutetype", t);
    input.setAttribute("data-muteword", w);
    input.onclick = function() { removeMute(Number(this.getAttribute("data-mutetype")), this.getAttribute("data-muteword")); };
    li.appendChild(input);
    document.getElementById(t == 0 ? "mute_word_names" : "mute_word_contents").appendChild(li);
}

//表示ボタン
function displayButton(a) {
    a.parentNode.classList.add("open");
    a.value = "隠す";
    a.onclick = function() { hideButton(this) };
}

//隠すボタン
function hideButton(a) {
    a.parentNode.classList.remove("open");
    a.value = "表示";
    a.onclick = function() { displayButton(this) };
}

//特殊処理
function convertSpecial(s) {
    return s.replace(/\\\\/g, "\\").replace(/&amp;/g, "&")
        .replace(/https?:\/\/[\w!?\/+\-_~=;.,*&@#$%()'[\]]+/g, '<a href="$&">$&</a>');
}

(() => {
    let style = document.createElement("style");
    style.textContent = css;
    document.body.appendChild(style);

    //ミュートフォームの 作成
    if (location.href.indexOf("comments.cgi") !== -1) {
        let d = document.createElement("div");
        d.innerHTML = `
<p>
    【ミュートについて】<br>
    見たくないコメントを非表示にするため、ミュート機能を作りました。<br>
    ミュートパターンを選択し、ミュートするワードを入力し、ミュートボタンを押してください。<br>
</p>
<p>
    【コメントにあるミュートボタンについて】<br>
    ミュートパターンが完全一致の場合、名前、本文をミュートします。<br>
    一部の場合、選択したテキストをミュートします。<br>
    正規表現の場合、ミュートするワードに選択したテキストコピーされるので、ミュートするパターンを入力したら、ミュートボタンを押してください。
</p>
<form name="muteform">
    <p>
        ミュートパターン
        <label><input type="radio" name="mutepat" value="name" checked>名前に完全一致</label>
        <label><input type="radio" name="mutepat" value="namepart">名前の一部</label>
        <label><input type="radio" name="mutepat" value="namereg">名前の正規表現</label>
        <label><input type="radio" name="mutepat" value="content">本文に完全一致</label>
        <label><input type="radio" name="mutepat" value="contentpart">本文の一部</label>
        <label><input type="radio" name="mutepat" value="contentreg">本文の正規表現</label>
    </p>
    <p>ミュートするワード<input type="text" name="muteword"><input type="button" value="ミュート" class="cs_button"></p>
</form>`;
        d.querySelector(".cs_button").onclick = () => {
            if (document.muteform.muteword.value == "") {
                alert("ミュートするワードを入力してください。");
                return;
            }
            let s = document.muteform.muteword.value.replace(/[\[\]\.\|\^\$\(\)\*\+\?\{\}\\]/g, "\\$&");
            switch (document.muteform.mutepat.value) {
                case "name":
                    addMute(0, `^${s}\$`);
                    break;
                case "namepart":
                    addMute(0, s);
                    break;
                case "namereg":
                    addMute(0, document.muteform.muteword.value);
                    break;
                case "content":
                    addMute(1, `^${s}\$`);
                    break;
                case "contentpart":
                    addMute(1, s);
                    break;
                case "contentreg":
                    addMute(1, document.muteform.muteword.value);
                    break;
            }
        };
        document.querySelector('input[name="delkey"]').after(d);

        //ミュートした ワード一覧の 作成
        makeMuteWordList();
    }

    //ミュートボタンの 作成
    let a = document.querySelectorAll(".cs_comment .cs_name");
    for (let i = 0; i < a.length; i++) {
        let b = document.createElement("input");
        b.type = "button";
        b.value = "ミュート";
        b.className = "cs_button";
        b.onclick = function() {
            if (!this.parentNode.classList.contains("mute")) {
                //ミュート
                let s;
                switch (document.muteform.mutepat.value) {
                    case "name":
                        addMute(0, `^${this.parentNode.querySelector(".cs_name").textContent.replace(/[\[\]\.\|\^\$\(\)\*\+\?\{\}\\]/g, "\\$&")}\$`);
                        break;
                    case "content":
                        addMute(1, `^${this.parentNode.querySelector(".cs_contents").textContent.replace(/[\[\]\.\|\^\$\(\)\*\+\?\{\}\\]/g, "\\$&")}\$`);
                        break;
                    case "namepart":
                        s = String(document.getSelection()).replace(/[\[\]\.\|\^\$\(\)\*\+\?\{\}\\]/g, "\\$&");
                        if (s != "") {
                            addMute(0, s);
                        }
                        else {
                            alert("ミュートするワードを選択してください。");
                        }
                        break;
                    case "contentpart":
                        s = String(document.getSelection()).replace(/[\[\]\.\|\^\$\(\)\*\+\?\{\}\\]/g, "\\$&");
                        if (s != "") {
                            addMute(1, s);
                        }
                        else {
                            alert("ミュートするワードを選択してください。");
                        }
                        break;
                    case "namereg":
                    case "contentreg":
                        s = String(document.getSelection()).replace(/[\[\]\.\|\^\$\(\)\*\+\?\{\}\\]/g, "\\$&");
                        console.log("aaa");
                        console.log(s);
                        if (s != "") {
                            document.muteform.muteword.value = s;
                            document.muteform.muteword.focus();
                        }
                        else {
                            alert("ミュートするワードを選択してください。");
                        }
                        break;
                }
            }
            else {
                //ミュート解除
                let comment = this.parentNode;
                removeMute(Number(comment.getAttribute("data-mutetype")), comment.getAttribute("data-muteword"));
            }
        };
        a[i].nextElementSibling.after(b);
        b.after(document.createTextNode("\n"));
    }

    //ミュート
    muteProcess();

    //バックスラッシュ、特殊文字、リンク
    a = document.getElementsByClassName("cs_contents");
    for (let i = 0; i < a.length; i++) {
        a[i].innerHTML = convertSpecial(a[i].innerHTML);
    }
    if (location.href.indexOf("comment_post.cgi") !== -1) {
        a = document.querySelector("tr:nth-child(5) td:nth-child(2)");
        a.classList.add("cs_contents");
        a.innerHTML = convertSpecial(a.innerHTML);
    }
})();