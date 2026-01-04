// ==UserScript==
// @name         SbBlizzardExtension
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  玻璃渣娱乐论坛杂项增强
// @author       丩卩夂忄
// @match        *://*.fbigames.com/
// @match        *://*.fbigames.com/*
// @icon         https://fbigames.com/data/assets/logo/favicon.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499405/SbBlizzardExtension.user.js
// @updateURL https://update.greasyfork.org/scripts/499405/SbBlizzardExtension.meta.js
// ==/UserScript==
window.addEventListener("load", _ => {
	let $lastCard = null
	let lockFlag = false
	let endData = ""
	$(document).on("click", ".cardItem", function () {
		endData = ""
		$lastCard = $(this)
	})
	$(document).on("keydown", e => {
		if (!$lastCard || $("#card-modal").attr("aria-hidden") === "true" || lockFlag) {
			return
		}
		switch (e.key) {
			case "ArrowRight":
				let $nextAll = $lastCard.nextAll()
				new Promise(resolve => {
					if ($nextAll.length === 0) {
						queryNext().then(_ => {
							$lastCard.nextAll()
							resolve()
						})
					} else if ($nextAll.length <= 5) {
						queryNext()
						resolve()
					} else {
						resolve()
					}
				}).then(_ => {
					if ($nextAll.length === 0) {
						return
					}
					$lastCard = $nextAll.eq(0)
					fbigames.hearthstone.showCardDetail.call($lastCard.children())
				})
				break
			case "ArrowLeft":
				let $prevAll = $lastCard.prevAll()
				if ($prevAll.length === 0) {
					return
				}
				$lastCard = $prevAll.eq(0)
				fbigames.hearthstone.showCardDetail.call($lastCard.children())
				break
		}
	})

	function queryNext() {
		lockFlag = true
		return new Promise(resolve => {
			let $page = $(".page")
			$page.val(parseInt($page.val()) + 1)
			let form = $(".form")
			let data = form.serialize()
			if (endData === data) {
				$page.val(parseInt($page.val()) - 1)
				lockFlag = false
				resolve()
			} else {
				let url = form.attr("action")
				$.post(url, data, function (response) {
					if (response.cards.length > 0) {
						fbigames.hearthstone.updateCardList(response.cards)
						fbigames.hearthstone.scrollTag = fbigames.hearthstone.getPage() < response.page.pageNum
					} else {
						$page.val(parseInt($page.val()) - 1)
					}
					endData = data
					lockFlag = false
					resolve()
				})
			}
		})
	}
})