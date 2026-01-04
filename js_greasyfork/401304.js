// ==UserScript==
// @name         Langlib TPO local data store
// @version      0.0.0
// @description  Use www.langlib.com/Mokao/TOEFL without having an account. (tips: right-click + "open in new tab" on a practice link to enter it)
// @match        *://www.langlib.com/Mokao/TOEFL/Test/*
// @match        *://www.langlib.com/Mokao/TOEFL/Answer/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/410786
// @downloadURL https://update.greasyfork.org/scripts/401304/Langlib%20TPO%20local%20data%20store.user.js
// @updateURL https://update.greasyfork.org/scripts/401304/Langlib%20TPO%20local%20data%20store.meta.js
// ==/UserScript==


new MutationObserver(function(mutations, observer) {
	if(unsafeWindow.$ === undefined || unsafeWindow.$.ajax === undefined) return
	observer.disconnect()

	unsafeWindow.$.oldAjax= unsafeWindow.$.ajax
	unsafeWindow.$.ajax=function(){
		if(arguments[0] && arguments[0].success){
			const option=arguments[0]
			if(option.url==="/Mokao/TOEFL/InitTPOUserAnswer") {
				option.oldSuccess = option.success
				option.success=function(response, textStatus, xhr){

					const {tpoIndex} = JSON.parse(option.data)
					const storeKey='data_' + tpoIndex
					const data=GM_getValue(storeKey)
					if(data===undefined){
						response.forEach(function(it) { it.UA="" })
						GM_setValue(storeKey, JSON.stringify(response))
					} else
						response = JSON.parse(data)

					return option.oldSuccess(response, textStatus, xhr)
				}
			}
			else if(option.url==="/Mokao/TOEFL/SaveTPOUserAnswer") {
				const {answer, questNo, section, tpoIndex} = JSON.parse(option.data)

				const storeKey="data_" + tpoIndex
				let data=GM_getValue(storeKey)
				if(data!==undefined){
					data=JSON.parse(data)
					data.find( function(it){ return it.S===section && it.QN===questNo }
						).UA=answer
					GM_setValue(storeKey, JSON.stringify(data))
				}else{
					console.error("Unexpected error | option=", option)
				}
			}
			else if(option.url==="/Mokao/TOEFL/ReWriteTPOUserRecord") {
				const {tpoIndex, section} = JSON.parse(option.data)
				const storeKey="data_" + tpoIndex
				GM_deleteValue(storeKey)
				option.success('success')
			}
		}
		return unsafeWindow.$.oldAjax(...arguments)
	}

}).observe(unsafeWindow.document, { childList: true, subtree: true })
