// ==UserScript==
// @name         [e-typing]Escキーで即時リトライ
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  e-typingでEscキーを入力後、即座にリトライします。
// @author       You
// @match        https://www.e-typing.ne.jp/app/jsa_*
// @exclude      https://www.e-typing.ne.jp/app/ad*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443859/%5Be-typing%5DEsc%E3%82%AD%E3%83%BC%E3%81%A7%E5%8D%B3%E6%99%82%E3%83%AA%E3%83%88%E3%83%A9%E3%82%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/443859/%5Be-typing%5DEsc%E3%82%AD%E3%83%BC%E3%81%A7%E5%8D%B3%E6%99%82%E3%83%AA%E3%83%88%E3%83%A9%E3%82%A4.meta.js
// ==/UserScript==





class SetMutationObserver {

	constructor(){
		this.observer
		this.elem = document.getElementById("app")
		this.config = {
			childList: true//「子ノード（テキストノードも含む）」の変化
		};
		this.retryFlag = false

		this.set()
		this.startObserve()
	}

	startObserve(){
		this.observer.observe(this.elem, this.config);
	}

	stopObserve(){
		this.observer.disconnect();
	}

	set(){
		this.observer = new MutationObserver(function(event){

			const add = event[0].addedNodes[0]
			const remove = event[0].removedNodes[0]
			console.log(add)
			console.log(remove)

			if(remove && (remove.id == 'hands' || remove.id == 'second_container')){
				console.log('resultDisplay')

				if(document.getElementById("battle-progress-bar") == null){
					setMutationObserver.setResultObserver()
				}

				return;
			}

			if(add && add.id == 'example_container'){
				console.log('battleAreaSetUp')

				if(!setUp.option){
					setMutationObserver.stopObserve()
				}

				const BATTLE_OPTION = localStorage.getItem("battle-option")

				if(setMutationObserver.retryFlag && (BATTLE_OPTION == "false" || !BATTLE_OPTION)){
					setMutationObserver.retryFlag = false
					document.dispatchEvent( new KeyboardEvent("keydown",{
						// keyCode:32 スペースキー keyCode:76 Lキー
						// keyプロパティ & codeプロパティでは開始できませんでした。
						keyCode: (setUp.Lstart && setUp.typingMode == 'roma' ? 76 : 32)
					}))

					return;
				}
			}

		});
	}


	setResultObserver(){
		this.result = document.getElementById("result")

		this.resultObserver = new MutationObserver(function(){
			console.log('result!')
			if(setUp.option && document.getElementsByClassName("result_data")[0].firstElementChild.firstElementChild.getElementsByClassName("data")[0].textContent == '-'){
				setMutationObserver.retryFlag = true
				document.getElementById("replay_btn").click()

			}
			setMutationObserver.resultObserver.disconnect();
		});

		this.resultObserver.observe(this.result, this.config);
	}

}
let setMutationObserver


class SetUp {

	constructor(){
		this.typingMode
		this.checkTypingMode()
		this.option
		this.Lstart

	}


	checkDisplayMenu(){
		const config = {
			childList: true//「子ノード（テキストノードも含む）」の変化
		};

		const Observe = new MutationObserver(function(event){

			setTimeout( () => {
				setUp.createMenu()
				setMutationObserver = new SetMutationObserver()
			})

			Observe.disconnect();
		});

		Observe.observe(document.getElementById("app"), config);

	}


	checkTypingMode(){

		if(location.href.match(/kana\.1/)){
			this.typingMode = "kana"
		}else if(location.href.match(/std\.2/) || location.href.match(/lstn\.4/)){
			this.typingMode = "eng"
		}else{
			this.typingMode = "roma"
		}

		this.checkDisplayMenu()
	}

	createMenu(){
		const FUNC_VIEW = document.getElementById("func_view")

        if(!localStorage.getItem("disable-option")){
            localStorage.setItem("disable-option" , "true");
        }

		this.Lstart = localStorage.getItem("Lstart-option") == "false" ? false : true;
		this.option = localStorage.getItem("disable-option") == "false" ? false : true;

		FUNC_VIEW.style.height = (FUNC_VIEW.clientHeight ? FUNC_VIEW.clientHeight : 26) + 30 + "px"

		FUNC_VIEW.insertAdjacentHTML('beforeend' , `<div>
<label><small>自動リトライを有効化</small><input id="disable-option" type="checkbox" style="display:none;" ${this.option == false ? "" : "checked"}><div id="disable-btn" style="margin-left:4px;margin-right: 18px;" class="switch_btn"><a class="on_btn btn show">ON</a><a class="off_btn btn" style="display:${this.option == false ? "block" : ""};">OFF</a></div></label>
${ this.typingMode == 'roma' ? `<label><small>自動リトライ時にLスタートで開始</small><input id="Lstart-option" type="checkbox" style="display:none;" ${this.Lstart == false ? "" : "checked"}><div style="margin-left:4px;margin-right: 18px;" id="Lstart-btn" class="switch_btn"><a class="on_btn btn show">ON</a><a class="off_btn btn" style="display:${this.Lstart == false ? "block" : ""};">OFF</a></div></label>` :""}
</div>`)
		if(this.typingMode == 'roma'){
			document.getElementById("Lstart-option").addEventListener("change" , event => {
				localStorage.setItem("Lstart-option" , event.target.checked);

				if(event.target.checked){
					document.querySelector("#Lstart-btn .off_btn").style.display = ""
					setUp.Lstart = true;
				}else{
					document.querySelector("#Lstart-btn .off_btn").style.display = "block"
					setUp.Lstart = false;
				}
			})
		}

		document.getElementById("disable-option").addEventListener("change" , event => {
			localStorage.setItem("disable-option" , event.target.checked);

			if(event.target.checked){
				document.querySelector("#disable-btn .off_btn").style.display = ""
				setUp.option = true;
			}else{
				document.querySelector("#disable-btn .off_btn").style.display = "block"
				setUp.option = false;
			}
		})
	}




}

const setUp = new SetUp()