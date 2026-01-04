// ==UserScript==
// @name         onelook.com & shiwehi.com WB最適化
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  WB用
// @author       You
// @match        https://www.onelook.com/*
// @match        https://shiwehi.com/tools/wordsearch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onelook.com
// @require     https://greasyfork.org/scripts/451526-www-onelook-com-2022-9-17-19-40-48/code/wwwonelookcom%20-%202022917%2019:40:48.user.js
// @require      https://greasyfork.org/scripts/450326-shiwehi-com-2022-8-28-19-27-32/code/shiwehicom%20-%202022828%2019:27:32.user.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451929/onelookcom%20%20shiwehicom%20WB%E6%9C%80%E9%81%A9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451929/onelookcom%20%20shiwehicom%20WB%E6%9C%80%E9%81%A9%E5%8C%96.meta.js
// ==/UserScript==
let url__ = location.href

if(url__.match('onelook.com')){
document.querySelector('[align="right"] [href*="&first"]').insertAdjacentHTML("afterend" , `
<div><label><input id=shiwehi type=checkbox ${localStorage.getItem("shiwehi") != "false" ? "checked":""}>日本語検索時に謎解き単語検索βに移動する</label>
</div>`)
document.getElementById("shiwehi").addEventListener("change", e => {
localStorage.setItem("shiwehi",e.target.checked)
})
window.addEventListener("keydown",function(event){
	if(event.key == "Enter"){
		if(chk(event.target.value.slice(0,1)) && document.getElementById("shiwehi").checked){
			const KANA_WORD = event.target.value
			window.location.href = `https://shiwehi.com/tools/wordsearch/?${KANA_WORD}`;
			event.target.value = ""
			event.preventDefault()
		}
	}
})
document.getElementById("olinput").value = ""

let resultWord = ""
const ADD_WORD = location.href.match(/(first=)(\d*)/) != null ? +location.href.match(/(first=)(\d*)/)[2]+100 : 101
var obj = new XMLHttpRequest();
obj.open('GET',`https://www.onelook.com//?w=${document.getElementById("olinput").value}&scwo=1&first=${ADD_WORD.toString()}`,true);//true:非同期通信
obj.onreadystatechange = function(){

	if (obj.readyState === 4 && obj.status === 200){
		var str = obj.responseText; //読み込んだHTMLを変数に代入
//----処理

const NEXT = obj.responseText.slice(obj.responseText.search(/<td width=20% valign=top>/))
const NEXT_WORD = NEXT.slice(0,NEXT.search(/<\/TR><\/TABLE>/))

document.querySelector("[width='20%']").parentElement.insertAdjacentHTML("beforeend", NEXT_WORD);
const words = document.querySelectorAll("[width='20%'] [href]")
for(let i=0 ; i<words.length ;i++){
resultWord += words[i].textContent + " "
}
document.querySelector("[width='20%']").parentElement.style.fontWeight = "bold"
document.querySelector("[width='20%']").parentElement.style.lineHeight = "27px"
document.querySelector("[width='20%']").parentElement.innerHTML = resultWord.toLowerCase()
//----処理
	}

	};
	obj.send(null); //リクエストの送信

document.body.addEventListener("click",function(){
document.getElementById("olinput").focus()
})
document.body.addEventListener("focus",function(){
document.getElementById("olinput").focus()
})
const NEXT_PAGE = ADD_WORD+100
document.querySelector('[align="right"] [href*="&first"]').href = document.querySelector('[href*="&first"]').href.replace(/(first=)(\d+)/ , `$1${NEXT_PAGE}`)
}else if(url__.match('shiwehi.com')){

document.getElementById("main-content").insertAdjacentHTML("beforeend" , `
<label><input id=onelook type=checkbox ${localStorage.getItem("onelook") != "false" ? "checked":""}>英単語検索時にonelook.comに移動する</label>
<form id="jp-index-option"><label><input name="index-option" value="pig" type="radio" ${localStorage.getItem("jp-index-option") == "pig" ? "checked" : ""}>豚辞書</label>
<label><input name="index-option" value="people" type="radio" ${localStorage.getItem("jp-index-option") != "pig" ? "checked" : ""} >一般</label></form>
<form id="display-option"><label><input name="display-option" value="straight" type="radio" ${localStorage.getItem("display-option") == "straight" ? "checked" : ""}>一列表示</label>
<label><input name="display-option" value="flex" type="radio" ${localStorage.getItem("display-option") != "straight" ? "checked" : ""} >複数列表示</label></form>
<style id="straight"></style>`)
if(localStorage.getItem("jp-index-option") != "pig"){
	document.getElementsByClassName("button-label")[1].click()
}
if(localStorage.getItem("display-option") == "straight"){
	document.getElementById("straight").textContent = `
#result-list{
display:contents;
}
ul, li {
    margin-bottom: 5px;
}
`
}


if(decodeURIComponent(location.search).slice(1)){
	document.getElementById("query").value = decodeURIComponent(location.search).slice(1)
	document.querySelector("[value='検索']").click()
}else if(sessionStorage.getItem("queryParamBak")){
	document.getElementById("query").value = sessionStorage.getItem("queryParamBak")
	sessionStorage.removeItem("queryParamBak")
	document.querySelector("[value='検索']").click()
}
document.getElementById("query").value = ""

document.getElementById("jp-index-option").addEventListener("change", e => {
	localStorage.setItem("jp-index-option",e.target.value)
	if(e.target.value == "pig"){
		document.getElementsByClassName("button-label")[0].click()
	}else{
		document.getElementsByClassName("button-label")[1].click()
	}
})
	document.getElementById("display-option").addEventListener("change", e => {
		localStorage.setItem("display-option",e.target.value)
		if(e.target.value == "straight"){
			document.getElementById("straight").textContent = `
#result-list{
display:contents;
}
ul, li {
    margin-bottom: 5px;
}
`
		}else{
			document.getElementById("straight").textContent = `
#result-list{
display:flex;
}

`		}
	})
	document.getElementById("onelook").addEventListener("change", e => {
		localStorage.setItem("onelook",e.target.checked)
	})
	document.getElementById("query").addEventListener("input",function(event){
		if(chk(event.target.value.slice(0,1))){
			if(localStorage.getItem("jp-index-option") == "pig"){
				document.getElementsByClassName("button-label")[0].click()
			}else{
				document.getElementsByClassName("button-label")[1].click()
			}
		}else{
			document.getElementsByClassName("button-label")[2].click()
		}

	})
	window.addEventListener("keyup",function(event){
	if(event.target.value && event.key == "Enter"){
		if(!chk(event.target.value.slice(0,1)) && document.getElementById("onelook").checked){
			const ENG_WORD = event.target.value.replace(/\?/g , "%3F")
			window.location.href = `https://www.onelook.com/?w=${ENG_WORD}&ssbp=1&ls=a`;
		}else if(!chk(event.target.value.slice(0,1)) || location.search){
			sessionStorage.setItem("queryParamBak" , document.getElementById("query").value)
			window.location.href = `https://shiwehi.com/tools/wordsearch/`;
		}
		event.target.value = ""
	}


})
document.body.addEventListener("click",function(){
	if(document.activeElement.type != "text"){
		document.getElementById("query").focus()
	}
})
document.body.addEventListener("focus",function(){
	document.getElementById("query").focus()
})
	document.getElementById("query").setAttribute("autocomplete","off")
	document.getElementById("query").focus()
}

function chk(str) {

    // 全角文字チェック
    if (str.match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/)) {
        //全角文字
        console.log("全角文字です");
		return true;
    } else {
        //全角文字以外
        console.log("全角文字ではありません");
		return false;
    }

}