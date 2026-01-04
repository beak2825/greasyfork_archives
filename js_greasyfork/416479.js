// ==UserScript==
// @name         TirexoFullDL
// @namespace    https://greasyfork.org/fr/users/11667-hoax017
// @version      2.7.0
// @description  Telecharger tout les lien sur Tirexo
// @author       Hoax017
// @match        https://**/**
// @screen       http://prntscr.com/1qu4dun
// @screen       http://prntscr.com/1wrl8ud
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/416479/TirexoFullDL.user.js
// @updateURL https://update.greasyfork.org/scripts/416479/TirexoFullDL.meta.js
// ==/UserScript==
(async function () {
	'use strict';
	let sleepBetweenLinks = 20 + Math.floor(Math.random() * 5);
  let useTimer = location.hostname.includes("hyipstats.net");
	let protectUrls = [
		"journaldupirate.net",
		"decotoday.net",
		"buzzfil.org",
		"hyipstats.net",
		"berich.ai"
	];
	let msgerror;
	if ((msgerror = document.querySelector('html body div div h1')) && (msgerror.innerText == "403" || msgerror.innerText == "Error 520" || msgerror.innerText == "Error 1106" || msgerror.innerText == "Error 1006")) {
		setTimeout(_ => location.reload(true), 3000)
	}

	const waitElem = (selector, speed = 500, maxTime = 30000, fn = _ => _) => new Promise(function (resolve) {
		let maxIteration = maxTime / speed;
		let inter = setInterval(async _ => {
			if (document.querySelector(selector)) {
				clearInterval(inter)
				resolve()
			}
			maxIteration--
			if (maxIteration < 0) {
				clearInterval(inter);
				if (typeof fn === 'function') fn();
			}
		}, speed);
	});

	protectUrls = JSON.parse(GM_getValue("protectUrls", null)) || protectUrls;
	if (protectUrls.some(domain => location.hostname.includes(domain))) { // descript links
    // tracking clear
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    localStorage.clear();
    sessionStorage.clear() 
    
    const button = document.querySelector('input[value="Continuer pour voir le lien"]');
		if (button) {
      if (useTimer) await new Promise(end => setTimeout(end, 500 + Math.floor(Math.random() * 2000)));
      if (document.querySelector("h1.card-title"))
        document.querySelector("h1.card-title").scrollIntoView()      

			if (document.querySelector('span#captcha img')) {
				console.info("captcha needed");
				const k = "db753f23fcf2214d8cec18a66f1d85da"

				function getBase64Image(img) {
					var canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0);
					var dataURL = canvas.toDataURL("image/png");
					return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
				}

				const responseIdRaw = await fetch("https://2captcha.com/in.php", {
					method: "POST",
					body: JSON.stringify({
						key: k,
						textinstructions: "Type 2 numbers",
						header_acao: 1,
						method: "base64",
						body: getBase64Image(document.querySelector("span#captcha img"))
					})
				});
				const responseId = (await responseIdRaw.text()).split("|")
				if (!responseId || responseId.length !== 2) return;
				if (responseId[0] !== "OK") return;
				const id = responseId[1];

				let resolutionValue = null
				while (!resolutionValue) {
					if (useTimer) await new Promise(end => setTimeout(end, 1000));
					const responseResolveRaw = await fetch(`https://2captcha.com/res.php?key=${k}&action=get&id=${id}&header_acao=1`);
					const responseResolve = (await responseResolveRaw.text()).split("|")

					if (!responseResolve || responseResolve.length !== 2) continue;
					if (responseResolve[0] !== "OK") continue;
					resolutionValue = responseResolve[1]
				}
				document.querySelector('span#captcha ~ div input').value = resolutionValue
			} else if (document.querySelector("div#captcha p#wait")) {
				console.info("captcha needed");
				await waitElem("div[class*=\"geetest\"]", 500, 10000, _ => location.reload(true))
        if (useTimer) await new Promise(end => setTimeout(end, 500 + Math.floor(Math.random() * 2000)));
				document.querySelector("div[class*=\"geetest\"]").click();
				await waitElem(".geetest_success_btn", 200)
			}
			if (!document.querySelector(".iziToast-wrapper")) {
        if (useTimer) await new Promise(end => setTimeout(end, 1000 + Math.floor(Math.random() * 2000)));
				button.click()
			}
		} else if (document.querySelector('.alert a')) {
			var link = document.querySelector('div.alert a')
			link.href = link.href.replace(/(\?|&)af=\d+/, '').replace(/(\?|&)aff_id=\d+/, '')
			link.textContent = link.href;
			window.opener.parent.postMessage({link: link.href}, "*");
      if (useTimer) await new Promise(end => setTimeout(end, 500 + Math.floor(Math.random() * 2000)));
			window.close();
		} else if (document.querySelector(".message") && document.querySelector(".message").textContent.trim() === "Page Expired") {
			setTimeout(location.reload, 2000);
		} else if (document.querySelector("h2").innerText === "404 Page not found") {
			if (location.pathname.indexOf("/fr/") === 0) {
				location = location.pathname.substr(3)
			} else {
				alert("Lien invalide");
				window.close();
			}
		}

	} else if (location.hostname.includes("tirexo.")) { // get all links
		let finalHostDlLinks = [];
		window.addEventListener("message", function (message) {
			if (!protectUrls.some(domain => message.origin.includes(domain))) return;
			console.log("Getting URL", message.data.link)
			finalHostDlLinks.push(message.data.link)
      
      $("#modal_links #modal_title").text(finalHostDlLinks.length)
      $("#modal_links #modal_body").val(finalHostDlLinks.join("\n"))
		});
    
    const showTimer = time => new Promise(resolve => {
      let inter = setInterval(_ => {
        $("#modal_links #modal_body").val(finalHostDlLinks.join("\n") + `\nWaiting ${time--}s..`);
        if (time <= 0) {
          clearInterval(inter)
          resolve()
        }
      }, 1000)
    })


		const onDownloadAll = (async function () {
			let $parent = $(this).parents('.table-responsive');
			let nbChecked = $parent.find('tbody input[type="checkbox"]:checked').length
			let dlAll = !nbChecked
			let alreadyDL = [];
			if (dlAll) {
				$parent.find('select').val(100).change()
				await new Promise((end) => setTimeout(end, 2000));
			}
			finalHostDlLinks = [];
			const $trs = $parent.find("tbody tr");
			for (let i = 0; i < $trs.length; i++) {
				let tr = $trs[i]
				if (!dlAll && !(tr.querySelector('input[type="checkbox"]') || {checked: false}).checked)  continue;
        
				let a = tr.querySelector('a.download[data-id]')
				let linktitle = a.text.trim();
				console.log(linktitle)
				if (~alreadyDL.indexOf(linktitle)) continue;
				alreadyDL.push(linktitle);
        
        if (i > 0 && useTimer) {
            await showTimer(sleepBetweenLinks)
        }
        
				$("#modal_links #modal_body").val(finalHostDlLinks.join("\n")+"\nLoading...")
        $("#modal_links").modal('show')
        new ClipboardJS('.btn');
        
        
				await new Promise((resolve, reject) => {
					console.log(a.href)
					const win = open(a.href);
					if (!win) {
						alert("Impossible d'ouvrir la fenetre, pensez a autoriser les popups navigateur");
						reject();
					} else {
            win.blur()
            window.focus()
						var timer = setInterval(function () {
							if (win.closed) {
								console.log(a.href, "CLOSED")
								clearInterval(timer);
								resolve()
							}
						}, 1000);
					}
				});
			}
			console.log(finalHostDlLinks)
      
      $("#modal_links #modal_title").text(finalHostDlLinks.length)
			$("#modal_links #modal_body").val(finalHostDlLinks.join("\n"))
		});
		const init = _ => {
			if ($("button.Hoax_validated").length) return;
			$("tfoot").each(function () {
				let button = $(this).find('button.copy_serie')
				button.parent().prev().append($(`<button class="btn btn-info Hoax_validated" type="button"><i class="fa fa-files-o"></i> Récupérer  les liens</button>`).on('click', onDownloadAll))
  
			});
      $(`<li class="menu single-menu">
           <a href="#" class="dropdown-toggle">
            <div class="">Editer les sites
            </div>
          </a>
        </li>`)
      .click(_ => {
        $("#modal_links #modal_title").text(protectUrls.length)
        $("#modal_links #modal_body").val(protectUrls.join("\n"))
        $("#modal_links").on("hide.bs.modal", _ => {
          protectUrls = $("#modal_links #modal_body").val().split("\n").filter(e => e)
          GM_setValue("protectUrls", JSON.stringify(protectUrls));
          $("#modal_links").off("hide.bs.modal")
        })
        $("#modal_links").modal()
        new ClipboardJS('.btn');
      })
      .appendTo($("#topAccordion"));
      
			$("body").append($(`
        <div class="modal fade" id="modal_links" tabindex="-1" role="dialog" style="display: none;" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Liste des liens (<span id="modal_title"></span>)</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"><span class="masha_index masha_index164" rel="164"></span>×</span>
                </button>
              </div>
              <div class="modal-body" id="info_modal_links">
              <form>
                <div class="form-group">
                  <textarea class="form-control" name="repot" id="modal_body" style="height: 400px;"></textarea>
                </div>
              </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                <button type="button" class="btn btn-primary" data-clipboard-target="#modal_body">Copier les liens</button>
              </div>
            </div>
          </div>
        </div>`));
		};
		setInterval(init, 1000);
		init()
	}
})();