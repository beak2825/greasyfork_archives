// ==UserScript==
// @name         [YouTube-Chat] Words Typing
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       You
// @include        https://www.youtube.com/live_chat*
// @include        https://studio.youtube.com/live_chat?is_popout*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        unsafeWindow

// @require https://greasyfork.org/scripts/455494-micromodal-min-js/code/micromodal-min%20js.js?version=1121802

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455313/%5BYouTube-Chat%5D%20Words%20Typing.user.js
// @updateURL https://update.greasyfork.org/scripts/455313/%5BYouTube-Chat%5D%20Words%20Typing.meta.js
// ==/UserScript==

const chat = document.querySelector("#input > #input")
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  window.trustedTypes.createPolicy('default', {
    createHTML: (string) => string
  });
}


let wordSearch
let typingCheck
let htmlSetUp
let separator = " "
let searchTime = new Date().getTime()
let JpWords
let typeCountEvents

/**
 *@Description 単語集をロードする。
*/

class loadJpWords {

	constructor(searchBox) {
		this.txtUrls = [
			"https://dl.dropboxusercontent.com/s/hme8y6jx87fe0ri/3letter.txt?dl=0",
			"https://dl.dropboxusercontent.com/s/tyd629mownzv009/4letter.txt?dl=0",
			"https://dl.dropboxusercontent.com/s/g5zuaz6wjj4itmf/5letter.txt?dl=0",
			"https://dl.dropboxusercontent.com/s/4xfr7p4un9r38eh/6letter.txt?dl=0"
		]
	}


	async loadWords(text){

document.getElementById("panel-pages").insertAdjacentHTML('afterend', window.trustedTypes.defaultPolicy.createHTML(`
<div id="load-words">loading words...</div>
<style>
  #load-words{
      margin-left: 48px;
      white-space: nowrap;
  }


</style>`));
		//here our function should be implemented

		for(let i=0;i<this.txtUrls.length;i++){
			text = await fetch(this.txtUrls[i])
			text = await text.text()
			this[(i+3)+"words"] = text.split("\r\n")

		}
		document.getElementById("load-words").style.display = "none"
		if(!htmlSetUp){
			htmlSetUp = new HtmlSetUp()
			htmlSetUp.setUp()
		}
		return;
	}

}

class HtmlSetUp {

	constructor(){
		this.wordArea
		this.addTextOption
	}

	setUp(){
		const fontSizeFlag = localStorage.getItem('words-font-size') == null && !isNaN(+localStorage.getItem('words-font-size'))


		const shortcutKeys = `
Esc or Space: Word skip
Tab: Switch Text Box
`
		wordSearch = new WordSearch();
		document.getElementById("top").insertAdjacentHTML("afterend",window.trustedTypes.defaultPolicy.createHTML(`
<div id="minimum-dictionary">
  <div id="word-table" class='words-typing-mode'>＃<span id="wordarea">${wordSearch.result.join(separator).toLowerCase()}</span></div>
  <div id="word-tools">
    <input class='words-typing-mode' id="word-search-box" maxlength="6" autocomplete="off" value="" placeholder="[?] Search">
    <span class='words-typing-mode'><span id="word-match">0</span> word</span>
    <span data-micromodal-trigger="modal-1" id="shortcut-keys" title="${shortcutKeys}">⌨</span>
    <span><span id="typing-count">${+sessionStorage.getItem('liveTypingCount') ? +sessionStorage.getItem('liveTypingCount') : 0}</span> types</span>
    <span class='words-typing-mode'><span id="typing-speed">0.0</span> k/s</span>
  </div>
</div>
<style>
  #minimum-dictionary{
      margin-left: 48px;
      white-space: nowrap;
  }
  #word-search-box{
  background: rgb(0 0 0 / 10%);
      border: #000000 thin;
      border-top: none;
      outline: solid thin #ffffffa6;
      color: rgb(255 255 255 / 87%);
      width: 8rem;
  }
  #minimum-dictionary > div {
    margin-bottom: 1rem;
  }
  #word-tools > *{
    margin-right: 0.9rem;
  }
  #shortcut-keys:hover{
    text-decoration: underline;
    cursor: help;
  }
</style>

<style id="words-typing">
  .words-typing-mode{
   display:${localStorage.getItem('enable-words-typing') != 'false' ? '' : 'none'};
  }
  #shortcut-keys{
   color:${localStorage.getItem('enable-words-typing') != 'false' ? 'gold' : ''};
  }

  #word-tools{
    margin-top:${localStorage.getItem('enable-words-typing') != 'false' ? '' : '0.5rem'};
  }
</style>

<style id="words-font">
  #word-table{
   font-size:${fontSizeFlag ? 13 : +localStorage.getItem('words-font-size')}px;
  }

</style>
`))
		document.body.insertAdjacentHTML("afterend",window.trustedTypes.defaultPolicy.createHTML(`
<div id="modal-1" aria-hidden="false" class="is-open">

        <div class="modal__overlay" tabindex="-1" data-micromodal-close="">

          <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
            <header class="modal__header">
              <h1 id="modal-1-title" class="modal__title">
                Words Typing Option
              </h1>
            </header>
            <div id="modal-1-content" class="modal__content">
              <label><input type="checkbox" id="enable-words-typing" ${localStorage.getItem('enable-words-typing') != 'false' ? 'checked' : ''}>Enable Words Typing</label>
              <label><input type="checkbox" id="miss-word-skip" ${localStorage.getItem('miss-word-skip') != 'true' ? '' : 'checked'}>Miss Word Skip</label>
              <label>font-size<input type="number" min="13" max="30" id="words-font-size" value='${fontSizeFlag ? 13 : +localStorage.getItem('words-font-size')}'>px</label>
              <label>Add Text<input type="text" id="add-text" value='${localStorage.getItem('add-text') == null ? '＃' : localStorage.getItem('add-text')}'></label>
            </div>
          </div>
        </div>
      </div>
<style>
  #modal-1 {
    display: none;
  }
  #modal-1.is-open {
    display: block;
    color: rgb(255 255 255 / 90%);
  }
  .modal__container {
    background-color: #212121;
    padding: 30px;
    margin-right: 20px;
    margin-left: 20px;
    max-width: 640px;
    max-height: 100vh;
    width: 100%;
    border-radius: 4px;
    overflow-y: auto;
    box-sizing: border-box;
  }
.modal__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}
  .modal__content {
    margin-top: 2rem;
    margin-bottom: 2rem;
    line-height: 1.5;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
  }
  #words-font-size{
    width:30px;
  }
</style>`))
		this.wordArea = document.getElementById("wordarea")
		this.addTextOption = document.getElementById("add-text")
		document.getElementById("modal-1-content").addEventListener('change', event => {
			switch(event.target.type){
				case 'checkbox' :
					localStorage.setItem(event.target.id,event.target.checked)

					if(event.target.id == 'enable-words-typing'){
						document.getElementById("words-typing").innerText =
							`.words-typing-mode{
   display:${event.target.checked ? '' : 'none'};
}

  #shortcut-keys{
   color:${event.target.checked ? 'gold' : ''};
  }
  #word-tools{
    margin-top:${event.target.checked ? '' : '0.5rem'};
  }`

						if(!event.target.checked){
							//addText("")
						}else if(!JpWords){
							JpWords = new loadJpWords()
							JpWords.loadWords()
						}
					}
					break;
				case 'number' :
					localStorage.setItem(event.target.id,event.target.value)
					document.getElementById("words-font").innerText =
						`#word-table{
   font-size:${typeof event.target.value == 'number' ? 13 : +event.target.value}px;
  }`
					break;
				case 'text' :
					localStorage.setItem(event.target.id,event.target.value)
					break;

			}
		})

		MicroModal.init()
		MicroModal.close()
		typingCheck = new TypingCheck(isNaN(+sessionStorage.getItem('liveTypingCount')) ? 0 : +sessionStorage.getItem('liveTypingCount'))
		typeCountEvents = new TypeCountEvents();

		window.addEventListener('beforeunload',typeCountEvents.setSessionStorageTypingCount);


		chat.addEventListener("input", typingCheck.typeCheck.bind(typingCheck))
		chat.addEventListener("keydown", typingCheck.enterSubmitWord.bind(typingCheck))
		chat.addEventListener("focus", e => {
			if(!e.target.textContent && localStorage.getItem('enable-words-typing') != 'false'){
				//addText(htmlSetUp.addTextOption.value)
			}else{
				//moveEndCaret(chat)
			}
		})

	 document.getElementById("word-search-box").addEventListener("keydown",wordSearch.Search.bind(wordSearch))
	 document.getElementById("word-search-box").addEventListener("focus",e => {
		 e.target.value = ""
	 })
	 setInterval(typeCountEvents.updateTypingSpeed,1000)
 }


}



class TypingCheck {

	constructor(sessionTypeCount) {
		this.typelog = "";
		this.roundTypeCounter = sessionTypeCount
		this.typeCounter = sessionTypeCount
	}


    /**
     *@Description inputイベントで入力ワードを比較する。
    */
	typeCheck(event){


		const c = new RegExp(`^${chat.textContent}`,"i")
		const match = wordSearch.result[0] ? wordSearch.result[0].match(c) : ""
		const matchLength = (match ? match[0].length : 0)

		if(event.data && /insertCompositionText|insertText/.test(event.inputType) && this.typelog.length < event.target.textContent.length){
			document.getElementById("typing-count").textContent = ++this.typeCounter;
			typeCountEvents.updateTypingSpeed()
		}

		this.typelog = event.target.textContent || "";

		if(match){
			htmlSetUp.wordArea.textContent = (wordSearch.result[0].slice(matchLength) + separator + wordSearch.result.slice(1,10).join(separator)).toLowerCase()
        }else if(!chat.textContent){
            htmlSetUp.wordArea.textContent = wordSearch.result.slice(0,10).join(separator).toLowerCase()
        }

	}



    /**
     *@Description チャットテキストボックスのkeydownイベント。

     *@note
     *Enterで送信時、入力したワードを評価。
     *Escでワードスキップ
	 *Tabでテキストボックスフォーカス切り替え
    */
	enterSubmitWord(event){

        if(event.key == "Enter" && chat.textContent){

            if(chat.textContent && wordSearch.result[0].toLowerCase() == chat.textContent.toLowerCase() || localStorage.getItem('miss-word-skip') == 'true'){
                wordSearch.result = wordSearch.result.slice(1)
				document.getElementById("word-match").textContent = wordSearch.result.length
            }else if(chat.textContent == htmlSetUp.addTextOption.value || !chat.textContent){
				wordSkip()
			}

			if(chat.textContent != htmlSetUp.addTextOption.value && chat.textContent){
				document.getElementById("typing-count").textContent = ++this.typeCounter;
				typeCountEvents.updateTypingSpeed()
			}

            htmlSetUp.wordArea.textContent = wordSearch.result.slice(0,10).join(separator).toLowerCase()

        }else if(event.key == "Escape" && localStorage.getItem('enable-words-typing') != 'false'){

			wordSkip()

        }else if(event.key == "Tab" && localStorage.getItem('enable-words-typing') != 'false'){

            if(document.activeElement.id === "input"){
                document.getElementById("word-search-box").focus()
            }else{
                chat.focus()
            }
			event.preventDefault()

		}
	}

}

function wordSkip(){
	wordSearch.result = wordSearch.result.slice(1)
	document.getElementById("word-match").textContent = wordSearch.result.length
	htmlSetUp.wordArea.textContent = wordSearch.result.slice(0,10).join(separator).toLowerCase()
}

class WordSearch {

	constructor(searchBox) {
		this.result = []
	}

	async Search(event){

		//検索ボックスにフォーカスしている状態でEnterを押した
		if(event.key == "Enter"){
			//Enterを押した検索ボックスの要素
			this.searchBox = event.target

			if(/？/.test(this.searchBox.value)){
				separator = "　"
				//文字列で正規表現を作成
				const RegText = `^${this.searchBox.value.replace(/[？]/g, "\\D")}$`
				//文字列を正規表現に変換
				const Reg = new RegExp(RegText ,"i")
				//正規表現にマッチする単語のみを絞り込む
				this.result = JpWords[`${this.searchBox.value.length}words`].filter(word => Reg.test(word)).slice(0,100);

			}else{
				separator = " "
				this.result = await this.getEngWords()
			}


			//結果を出力
			htmlSetUp.wordArea.textContent = this.result.slice(0,10).join(separator).toLowerCase()

			//結果件数を表示
			document.getElementById("word-match").textContent = this.result.length

			//チャットにフォーカス
			chat.focus()
			//moveEndCaret(chat)

			//打鍵速度計測用時間・測定用打鍵数を設定
			searchTime = new Date().getTime()
			typingCheck.roundTypeCounter = new Number(typingCheck.typeCounter)
			document.getElementById("typing-speed").textContent = (0).toFixed(1)

		}else if(event.key == "Tab"){

			chat.focus()

			event.preventDefault()

		}
	}





	async getEngWords(html){
		//here our function should be implemented
		let result = []

		for(let i=1;i<=100;i+=100){
			let html = await fetch(`https://www.onelook.com//?w=${this.searchBox.value}&ssbp=1&first=${i}`)
			html = await html.text()

			//wordの前後のいちを取得
			const start = html.search(/<td width=20% valign=top>/)
			const end = html.search(/<\/TR><\/TABLE>/)


			//word要素のみを取り出す
			const wordsElement = html.slice(start,end)

			//取得したワードを配列に結合
			result = result.concat(wordsElement.match(/(?<=\>)[a-zA-Z]+(?=\<)/g))
		}

		return result;

	}
}


class TypeCountEvents {


	/**
     *@Description 打鍵速度を更新する
    */
	updateTypingSpeed(){
		document.getElementById("typing-speed").textContent = ((typingCheck.typeCounter - typingCheck.roundTypeCounter) / ((new Date().getTime()-searchTime)/1000)).toFixed(1)
	}

	/**
     *@Description ページを離れるときに打件数をSessionStorageに保存する
    */
	setSessionStorageTypingCount(){
		sessionStorage.setItem('liveTypingCount',typingCheck.typeCounter);
	}
}


if(localStorage.getItem('enable-words-typing') != 'false'){
	JpWords = new loadJpWords()
	JpWords.loadWords()
}else{
	htmlSetUp = new HtmlSetUp()
	htmlSetUp.setUp()
}

