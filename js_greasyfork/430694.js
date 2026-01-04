// ==UserScript==
// @name         Roster vehicles extensions
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Исправление стилей ростера, и компактная розстановка елементов
// @author       wandersher
// @match        https://st-roster.win/rt/show/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAz1BMVEX/UAH////9//3//P3+SAD8TwL65NX2PQD8///5PAD/TAD5QAD42sb42cj7PwD9+fDuUAD+//jtspLwRADwsY/13sv/7OLyo4X2vKHzooH0Ww76UQDxPQDxQwD//fv3///ypH3uyq76++3y4cjyzar228DtYyb8//TqTQDwSgD5++bwaCzqaSb/9vD1yKjqayT2xrT1zKz+7tnv0bX2wJ/wZzTyYB/x0LDrYiXyYRr2zav+9fP/9ujnOgD5UhXyXADwcjn94tfraDvkMAD4u5XbxJpaAAAPHElEQVR4nO1dbWPaRhLW7mrRsMYFRUfaeoVU8AuW32KTxk4T3Gvu7v//ppsZCds4CAShkpLuk/hDCML7MO870qznOTg4ODg4ODg4ODg4ODg4ODg4ODg4/C3Qnmd3vlabfS7lb4IljjvCfMvFtQHFcLA7TMspaoIX3Q13xV3En9E0j3JoQwRPAUDsAlBiGBttW2yMWlsdHEKyEz8hVAhwOsKvqWkea2D1qAcoisWStwC/X4YwHOmsaRrl0CY4hiSRC4bJFhDIUSq89DRqqZZq8hHBKVugBFyqlAK2ANKDRCqViN5IWwwb7dNVDBPBUOQMw/nbbTGb9cM0lCABeiNjWsjQWh31QDFD+PQYjRDRFgiieIxfjUqQ4zC2LYwZaIOngAskguN4+/WhCw3uAP1wKBP0qKZdDLWx2saHIBHoMd6PTB78twB5FzO6A5mgEStxGHsYeZrm9QyMg4ZsEB2FTNJxsOP3r3V0K9IUxSgwaJg2BUaUYdCT7D+VGMeZbz1DhmS3Acndjx7QFiEEKY4DtOzWULTe6BSSUCBFuIs5d8PVboMDH/XUotgiVFSpMGwAxsVWMMytKBgC+hhcGryPcaX4iv/h919+/2ULfPDzj4pPMHtLMFkQmMC1IEdFF8E2CCEqqUxRRTlzNuZ+DmKL/Bvg+t63TPHxTqgU0OXAMDB252p6fww968enmMNgrBZiPEIDRC/on00gRLWtDLy8f8ZStCYaA4YdMulh0IKiH9c0OqUMjZK0B5QgLlH7Z9f4b6k2M3sCJrP9q1xRzeiE3I0iilHDlki/3sRDSABNR5KKUj6JBCeSM+ltgGFm/jGn6AXvBYSC3c2o2YqYrJCdDBohpEgQ7UZ7/scJLXBboJpP7m3hbh5YLULOUXff2doDLBOkrxtTtRHVF6im9xOM+1tX+ayV12e5ntpgLESo1JSq/mZlGJ+S+DAWwvtuRl7U+vd9EVLI3lqGIkwW7sbToxNQU/zylER30xA70tER2qBKyJGOR+RE2Yuq7dkVSHNbJFv2sNJAVUc5Qi9C5a9fUw0ly3EP4yB5evE+IC9KNtiXctd9GkFB8Poqj4tefCcgTbCegh4aeBNRg8slivOoX3cROhlkbc76IJKdZSjJGvv3uaJiXBRKpkpMKS42IEOLFT3VOqikglSU8kr/j75IdrHBAqjfiXoK/V78CUM//sHsJq5ZhoY9+jFvqqFHH0esomiDn3dnt0CI2c1Hn+Mq5qiQUtWvir2b+oBpC4WJPgd1eOiSBaINYqq2fZR4DdSLdHJW1MUYNFIsOlGOPSxZ6pSjNvHTnszdSPskQgwTVD99K9CyFaXhHBcp9KsQfZeCw7hOW0T9GUqqcWhPJqD9BlzNfR8Lgm8WIQkRPerkzPe4CotvUgy4GPpDrPrrYkfa06MsC0MFJtvW4B8kOBfh7l50GVMO/TaPiw8UMyiNP42xkKkj+qO4oiGkVPFgoMc4SB0xgzZIpfl+GAp4YYvxLdpiIjGB60W1tFBRYtEhqDxxeR97rKNogzBVtNO2F4QUNOYff8qTVMxuEsxt8PvsxbWYov7pJs23DSGPg1Qu9dFDiL0xRB+GHrUI/QYpUhpB23ifDmrQUu11uX8WhuIh1rxT6t9PdqiWNkB+hsk7X/OeXfSJ4qwScFgHQ5RhTxBDLHhpk4YkeA3hlvXuZiShTD9/ZDet/fg2//xaGco+bVkY/Dm7wK937zLEGPEZ5ou9m8dpnQwPehTYZT+gRMbynsyO/NYJHrNwjEfXl3kaHvT5xV4tDL2fDvm39QOia67m02m4DtMphutkZUWVTtZeSdfOr+h71F1mCL2DGvjpZYb6z/NBNliHLHvsSFgprs7jxmvP/6QI2ChDqgvXAd8UdNRqPe4Eay+lqy2VUc0ypFpqwyXdWZkMu+tvELKWWyC2SYZV3u91O2L13k2n2kc0KsNKcAwr/FLHcJ94zVDbr2s2nScii0KgCsMXb3/5OfwfjcZD9KTG81+/J3f02zE0/te1H32MT/uUDTI0ZvDH0UoMnkVbieHRv1d+zB9H9DlNMvTfrFo6ZpW/+U8dlSoM/V9LWsZv/Ia11P9XyQ7ir8+6W4Gh9n8u2cR64zcrw30x9P4JDFcTRIbeD8+wnTKUP7wMHUPH0DF0DB1Dx9AxdAwdQ8fQMXQMHUPH0DF0DB1Dx9AxdAwdQ8fQMXQMHUPH0DF0DB1Dx/D7YSjojqGtGP5W8tzbj8JQO4atZPh0SUWGq9Fehr9Wv3OPpgsd/Lz6Zvf2MoTOual8b6LWZtARq5+Sbi1Dkc7Oq999qc9nafK9MUxglplqDI3NZvRA88onh9rLUIRwfM43Quu1DLVnTfa2fNJEixlKCbOBMZufKPGzTlo+87S9DCFJQ8HuZr0MUYIzIcufkW4vQ5odAAKluEmG5zOVJOWjChpkOOnSv/w3ovz5ZjUVs8yzQadECTuBpTBR/nwmmicybOpO9umCYTkkQNrJ/G45Q7TBNU+A04S05u4RVv2uZYZrpn1IGkY6Oy9l+CXIZgBJ6cOy9ID6G3oq39bJ0HtiGBBDc9VPafmrVylp3u7ssYQhfHmcYeAss0HJD+Vf8iNG3bBOhgc9XgDKkB6W96+uxRTKZ0OFqRgPS0gcjyEVarWWKqFUUjzp7NctQ2YIk9jLPENzd6YiLNe0EFCGq70RfMkuaNbbyutUKqbpJH+U29q4VhnmDGlQKf1uLAzOLqA8nhV2uJJhp3s+BxmutGMaz3RxlhWTeO5EfQy112WG6EVuAhoaoa257JcOpoG3mR+UMKQnnY8w5V7thhKYfCimRgTj3JDhsBaG+mAMIWsdjCNKKz2LtkjTKl/HNZVgVpOhIyyP+NofzNMkfDX3ReELISwmRdIUnkSBglDc1TNTwcuGUPjOmy7aIbmCdxM1Va9lgQTfDow263IaowdzXLxaMkb0MlO4/sun5w8tzeBRNIAZU/mojomtqJg8W55WksKnmMbhGe1/uPgqLiZYQA1Ii4M1MsRv5+hCyunS6yFNw0InQ2M/bHwnaMh3qMTpQS1zMGmSkY2HzEYpHjpLr/iXk1dBL0nkLMNVemY9Q6tJUZdeVxgHr/JdEBOMKWIqJeE0srWdYWL0aAg85j+U7FGNRYp9jGwh2yLqFKUjnbw+3FgB+0dzGneT14iSZxXlYQJlGNzQfC1yt8e1nihgdHSa8taREieB4Qlu/lkf3Y3KGZJizRYDZDfuYvhki8VgJp7Odl3MajVkg4JmT8LhqM7x3haNcTRMJTOEcaDz7AalOC3UDSX49pxGWugKDI31KWjkU3xQD9AGDY/1sxgHJUYaGrVfi5N5Ag+LGw1zawM4oWFDhofuFV4fFQ5t0NLLmxkaepCbFDW3QSkurp4mfGLYUMR8mJnaJ7Tz4ERIeCbWXZfHKaFH7dOgugRUOjs32z3pfDSnGZA00at/WQzcC07QyZAIoV4bfOZIHlVydkMjo9ijYhrOM/PeZuZZqyrNVDCDt/hpqQqv3xUDTKNb8s6U8dLQxAYIou1FhwB56TTuojcld/NuguEZc1EaxLfNxAF8/2BOh5qEl77RRaom8/mow/NGCOp8+B5/x6GAk64d8Fiuy0mINshatlhWNRlqVtQJx0FK1cY09o4GX6KKNjYrWZO7KeqfB5ovyMO8++hkliJz1ckf/vk8zMfrGy84AR6yC2IY1UtqCdqjWckcFyWGfstRw//r6NV4w6oMtb7/azGz/FZwLkoSrJXSK2gK/YcsQsmhn88moWMcluaUVGfoc2C1FOjZBJU8jIzf4MRyHi4eDVOWIdaLsc1o0Kf1zE5ayiMKaWR2d0xxFm2QBus3fhqL1tlxPuI4odM7OJl8taTKE3hIyy3ZIE1lDQURbP5sBNLUaJgHjZBCP/ub5bdUZ0helGaVI0H6adKLvlgV/h0d8iRFAWL86H0LQyIY3XAaEaY0Ur8NDGkCkMmespvbLqUCy2+pzpCmhN/yoU8Kw0TW7MkPL4FlHA335r2bk2DA63qxtEoMdW7C8UnKB7Bhsl3XZOQqoLHUw8WpgOPAN3pJjpUZahM8YAjEyJNQudT4GTPPIJnRMQm06kSO+YyfnRgGNzLEzD3My6X6iZSCGxhRL9+JUlgS+94uDL34hBSBVGEYmdbY4AIU+otNQaRI521VvtskT9SsDW64oZZX9M0xKQMma6NeKguKsX6Rm25gmG/70sjnVIn8dMBRq1S0AB+dcgzFXhvmqJxtsRgrydB2saIHEYZcLq0YwNc48kH/w3zpEuhk38XZvlUY0mEWdIIpxsEeHcnTQhkSjM3IozKbcdfL8iJYdzsrRtAiZzjOzxHkcomcDMVBGGYtZUegHbjj4rhjOIktH3tBMlzRQaXE+gttmHv51j2gBSZY0Td7+tEmkKJGvXxbUGHoN75HTY3u8YqJ5lKFKWopqzLVg7RRLtHJZC04aq0c5Fw4R2VvI2+Kto3+Tx/y3eNnfpgZwPUH7j/S8QecawvauvdM8ycCbgAVU5I39oH3bvgAmv5Sr5969CHM3/nc8jAc6On4PdmKenATyKiOn3JUlCJt0JvLpV4/9ehVn/dkMNB3b4Uiq6Q4OGixDT4BqymWYmGLuer6ly97/dSjL25CoOMr6MYgzLfhtF25aBko8pOi5sLCYoptDSm+7PXnPXoaR+4FY2rFYUFI7bPG92Sq4jn0f93rVyHZ4KsePW259kbfCTsCbfgfpwXHV73+VT36BIWNYaLpZW8B2mSMh6t7/at69DLBir4VezJVoYvDLdkUX/X6V/ToSYJRTScd7RFlvf4k7Dfdo98Xynr9T0fGLvXoW1gtbUJJr//DrDi8ubke/b5Q0uvX2eK0sUZ79PvCql6/5W2r5nv0+8LXvX6SXwt69PvCil5/O3r0+8LKXj+G/3b06PeFl71+OkuQzhhrR49+X3jZ66d6ETOZW9mKHv2+8LrX748eRDt69PvCUq8/hNv/jjnZbkmPfl940euX85BufGpLj35feNnrlwJa1KPfF557/exvRHt69PvCc69f8iaNaFWPfl9Y9PqxzE/a1aPfFxa9fjpJvF09+n1h0esH2bYe/b6w6PWrVvbo9wUO/V++q23DLaGNif73Y6poAWrE+N53XRBuAO/d6LqeXXJwcHBwcHBwcHBwcHBwcHBwcHBwcPiH4f+/YaAqA1TxUQAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430694/Roster%20vehicles%20extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/430694/Roster%20vehicles%20extensions.meta.js
// ==/UserScript==


function PreviewScreenshotsUtils() {
	window.isScreenshotExist = (url) => fetch(url, { method: 'OPTIONS' }).then(async resp => (await resp.text()).length === 0)

	window.createScreenshotPreviewButton = async (nickname, tank, url) => {
		var formats = ["jpg", "jpeg", "JPG", "JPEG"]
		for (var i = 0; i < formats.length; i++) {
			const format = formats[i]
			if (await window.isScreenshotExist(url + tank + '_' + nickname + "." + format)) {
				const button = document.createElement('a')
				button.href = url + tank + '_' + nickname + "." + format
				button.className = "btn btn-sm btn-success"
				button.dataset['lightbox'] = "image-group"
				button.role = "button"
				button.title = "| " + nickname + " | " + tank + " |"
				button.innerHTML = '<span class="glyphicon glyphicon-picture" aria-hidden="true"></span>'
				return button
			}
		}
		return null

	}

	window.replaceVehiclesNames = (tank) => {
		return tank
			.replace('Progetto M35 mod 46', 'Progetto_46')
			.replace('Waffenträger auf Pz. IV', 'Waffentrager_Pz._IV')
			.replace('Объект 430', 'Об.430')
			.replace('Leopard Prototyp A', 'Leopard_PT_A')
			.replace('Pz.Kpfw. IV Ausf. H', 'Pz._IV_H')
			.replace('Pz.Kpfw. II Luchs', 'Luchs')
			.replace('Jagdpanzer 38(t) Hetzer', 'Hetzer')
			.replace('Durchbruchswagen 2', 'D.W._2')
			.replace('Bat.-Chatillon 25t AP', 'B-C_25t_AP%EF%BB%BF')
			.replace('VK 45.02 (P) Ausf. B', 'VK_45.02_B%EF%BB%BF')
			.replace('ИС-3-II', '_ИС-3-II')
			.replace('Prototipo Standard B', 'Standard_B')
			.replace('60TP Lewandowskiego', '60TP')
			.replace('50TP prototyp', '50TP_pr.')
			.replace('M26 Pershing', 'Pershing')
			.replace('Rhm.-Borsig Waffentrager', 'Rhm.-Borsig')



	}

	window.createScreenshotPreviewButtons = (slots, url) => {
		slots.map(async ({ player, vehicle, vehicle2 }) => {
			if (!player.querySelector('a[data-lightbox="image-group"]')) {
				const nickname = player.querySelector('a:nth-child(1)').innerText.trim()
				const tank = window.replaceVehiclesNames(vehicle.innerText.trim()).replace(/[ \/]/g, '_')
				if (nickname !== "Занять") {
					window.createScreenshotPreviewButton(nickname, tank, url).then(button => button ? player.appendChild(button) : null)
					if (vehicle2) {
						const tank2 = window.replaceVehiclesNames(vehicle2.innerText.trim()).replace(/[ \/]/g, '_')
						window.createScreenshotPreviewButton(nickname, tank2, url).then(button => button ? player.appendChild(button) : null)
					}
				}
			}
		})
	}

	window.analyzeScreenshotPreviewButtons = () => {
		let url = ""
		const preview = document.querySelector('a[data-lightbox="image-group"]')
		if (preview) {
			const [original, date, id] = new RegExp('^https:\\/\\/st-roster.win\\/screen\\/(.*?)\\/(.*?)\\/.*$').exec(preview.href)
			url = "https://st-roster.win/screen/" + date + "/" + id + "/"
		} else {
			const id = document.querySelector('input[name="test_id"]').value
			const date = (new Date().getMonth() + 1).toString().padStart(2, "0") + (new Date().getDate()).toString().padStart(2, "0") + (new Date().getFullYear().toString().slice(2))
			url = "https://st-roster.win/screen/" + date + "/" + id + "/"
		}
		const slots = []
		Array.from(document.querySelectorAll('#table-vehicle tbody tr')).map(row => {
			const player1 = row.querySelector('td:nth-child(1)')
			const player2 = row.querySelector('td:nth-child(9)')
			const vehicle1 = row.querySelector('td:nth-child(2)')
			const vehicle2 = row.querySelector('td:nth-child(8)')
			slots.push({
				player: player1,
				vehicle: vehicle1,
				vehicle2: vehicle1.innerText.trim() !== vehicle2.innerText.trim() ? vehicle2 : null
			})
			slots.push({
				player: player2,
				vehicle: vehicle2,
				vehicle2: vehicle1.innerText.trim() !== vehicle2.innerText.trim() ? vehicle1 : null
			})
		})
		setInterval(() => window.createScreenshotPreviewButtons(slots, url), 30000)
		window.createScreenshotPreviewButtons(slots, url)
	}

	window.analyzeScreenshotPreviewButtons()

	const container = document.querySelector("div.container")
	container.className = "container-fluid main"

	const slot = document.querySelector('a.btn.btn-danger')
    
	if (slot) {
		slot.innerText = slot.innerText.split("\\n")[0]
		const id = new RegExp(".*\/(.*?)$").exec(slot.href)[1]
		const upload = document.querySelector('a[href="/rt/screenadd/' + id + '"]')
		if (upload) {
			upload.className = "btn btn-sm btn-primary"
			upload.innerHTML = ""
			const icon = document.createElement('span')
			icon.className = "glyphicon glyphicon-picture"
			upload.appendChild(icon)
			slot.parentElement.appendChild(upload)
		}
	}

	Array.from(document.querySelectorAll('hr')).map(it => it.remove())
	Array.from(document.querySelectorAll('br')).map(it => it.remove())

	Array.from(document.querySelectorAll('#table-vehicle table thead th:nth-child(1),th:nth-child(9)')).map(it => it.setAttribute('width', '17%'))
	Array.from(document.querySelectorAll('#table-vehicle table thead th:nth-child(2),th:nth-child(8)')).map(it => it.setAttribute('width', '15%'))
	Array.from(document.querySelectorAll('#table-vehicle table thead th:nth-child(3),th:nth-child(6)')).map(it => it.setAttribute('width', '4%'))
	Array.from(document.querySelectorAll('#table-vehicle table thead th:nth-child(4),th:nth-child(7)')).map(it => it.setAttribute('width', '12%'))
	Array.from(document.querySelectorAll('#table-vehicle table thead th:nth-child(5)')).map(it => it.setAttribute('width', '2%'))


	const rating = document.querySelector('.row.rating-block')
	if (rating) {
		const disables = !!rating.querySelector('.rating-disabled')
		if (slot && !disables) {
			rating.querySelector('input[name="rating"]').value = "10"
			const submit = document.querySelector('input[type="submit"]')
			submit.setAttribute('id', 'submit-rating')
			const button = document.createElement('label')
			button.className = "btn btn-sm btn-warning"
			button.setAttribute('for', 'submit-rating')
			const icon = document.createElement('span')
			icon.className = "glyphicon glyphicon-star"
			button.appendChild(icon)
			slot.parentElement.appendChild(button)
		}
	}

}

(function() {
    'use strict';
    const style = document.createElement("style");
    style.innerText = `
        h1{font-size: 30px}
        h2{font-size: 24px}
    	#lightbox{ transform: translateY(-50px) !important; }
		.main{ padding: 0 2% !important; margin-top: 50px !important; }
        .btn-sm{ margin: 0 2px; }
        table{ margin-bottom: 0 !important; }
		tr td:nth-child(9) { display: flex; flex-direction: row-reverse; }
		tbody tr td:nth-child(1) a:nth-child(1) { width: 182px; }
		tbody tr td:nth-child(5) { text-align:center; }
        tbody tr td:nth-child(9) a:nth-child(1) { width: 182px; }
		.main .row div:first-child { display: flex; justify-content: space-between; align-items: center; }
        .row .row.rating-block{ display:block !important; margin-right: 0; margin-left: 0; }
        .rating-block .panel.panel-info{ justify-content: unset; margin-bottom: unset; border-color: transparent; }
		.rating-block .panel-heading{ display: none !important; }
        .rating-block .panel-body form{  display: flex; justify-content: space-between; align-items: center; margin: 0 10px; }
        .rating-block .panel-body form h5{ display: none !important; }
        .rating-block .panel-body form .col-lg-2, .rating-block .panel-body form .col-lg-6 { width: unset; }
        .rating-container .rating { margin-right: 15px; margin-bottom: -5px; }
        .rating-container .caption { display: flex;  width: 160px; justify-content: center; margin-top:0;}
        .row .row { display: none !important; }
    `//.row.rating-block { display: none; }
    document.head.appendChild(style);
    PreviewScreenshotsUtils();
})();