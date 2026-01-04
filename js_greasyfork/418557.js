// ==UserScript==
// @name         AtCoderYesNoOutput
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Write the output string when true and false to the clipboard
// @author       imomo
// @include      https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418557/AtCoderYesNoOutput.user.js
// @updateURL https://update.greasyfork.org/scripts/418557/AtCoderYesNoOutput.meta.js
// ==/UserScript==
/*ユーザー設定項目*/
//真偽値を入れる変数名を入力
var boolval = "ans"

var cpp = "cout << (("+boolval+")?\"[first]\":\"[second]\") << endl;"
var python = "print(\"[first]\" if "+boolval+" else \"[second]\")";

//使用言語に合わせてc++はcpp,Pythonはpythonと入力　エスケープ処理などが分かる方はオリジナルを入力しても構いません
//オリジナルの場合、1番目の文字列を[first]、2つ目の文字列を[second]としてください。
var outputtext = cpp;

/*設定項目終わり*/

onkeydown = function(){
    const regex = /[^A-Za-z!:()]/g;
    if((event.ctrlKey || event.metaKey) &&event.shiftKey){
        var selObj = window.getSelection().toString();
        console.log(selObj);
        var obj=[];
        if (selObj.indexOf(',') != -1)obj = selObj.split(',');
        else if(selObj.indexOf('，') != -1)obj = selObj.split('，');
        else obj = selObj.split('、');
        var first = obj[0].replace(regex,'');
        var second = obj[1].replace(regex,'');
        outputtext = outputtext.replace('[first]',first);
        outputtext = outputtext.replace('[second]',second);

        // 空div 生成
        var tmp = document.createElement("div");
        // 選択用のタグ生成
        var pre = document.createElement('pre');

        // 親要素のCSSで user-select: none だとコピーできないので書き換える
        pre.style.webkitUserSelect = 'auto';
        pre.style.userSelect = 'auto';
        tmp.appendChild(pre).textContent = outputtext;

        // 要素を画面外へ
        var s = tmp.style;
        s.position = 'fixed';
        s.right = '200%';

        // body に追加
        document.body.appendChild(tmp);
        // 要素を選択
        document.getSelection().selectAllChildren(tmp);

        // クリップボードにコピー
        document.execCommand("copy");

        // 要素削除
        document.body.removeChild(tmp);
    }
}