// ==UserScript==
// @name        AnnuaireTelechargement Full DL
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @match       https://www.annuaire-telechargement.*/*
// @match       https://dl-protect.link/*
// @grant       none
// @version     3.1.0
// @author      Hoax017
// @license     MIT
// @description Ajoute un boutton pour recuperer tous les liens decodes
// @downloadURL https://update.greasyfork.org/scripts/477129/AnnuaireTelechargement%20Full%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/477129/AnnuaireTelechargement%20Full%20DL.meta.js
// ==/UserScript==
/* jshint esversion:8 */
	const waitElem = (selector, speed = 500, maxTime = 30000, errorFn = _ => _) => new Promise(function (resolve) {
		let maxIteration = maxTime / speed;
		let inter = setInterval(async _ => {
			if (document.querySelector(selector)) {
				clearInterval(inter)
				resolve()
			}
			maxIteration--
			if (maxIteration < 0) {
				clearInterval(inter);
				if (typeof errorFn === 'function') errorFn();
			}
		}, speed);
	});

  const uuidv4 = function () {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }


  const addModal = (id) => {
    const $modal = $(`
        <div class="modal" id="${id}" tabindex="-1" role="dialog" style="display: none;" aria-hidden="true">
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
                <button type="button" class="btn btn-primary" id="copyLinks">Copier les liens</button>
              </div>
            </div>
          </div>
        </div>`);
        $modal.on("click", "#copyLinks", function () {
          navigator.clipboard.writeText($(this).parents(".modal").find(`textarea#modal_body`).val())
        })
        $modal.get(0).update = function (links = []) {
          $(this).find(`textarea#modal_body`).val(links.join("\n"))
          $(this).find(`span#modal_title`).text(links.length)
        }
        $modal.on("hide.bs.modal", function () {
          this.update()
          $(this).off("hide.bs.modal")
        })
        $("body").append($modal)
  }

class Scrapper {
    static createButton(data) {
        return $(`<a href="#" class="btn btn-outline-primary px-3" style="float:right;"><img src="https://www.svgrepo.com/show/528952/download.svg" height="15px"></a>`)
            .click(async (event) => {

              $(window).on('storage', function(e) {
                if (e.originalEvent.key === this.uid && e.originalEvent.newValue) return;
                const decodedData = JSON.parse(e.originalEvent.newValue)
                let link = data.links.find(link => link.url.includes(`/${decodedData.id}?fn=`))
                link.fetched = decodedData.url;
              });


              const $modal = $('body').find("#modal_link")
              $modal.modal("show")
              let tab = null
              for (let link of data.links) {
                if (link.fetched) continue;
                console.log(`Open ${link.url}`)
                tab = open(link.url + `&uid=${this.uid}&origin=${location.origin}`)
                await new Promise(resolve => {
                  let inter = setInterval(_ => {
                    console.log({data, link, tab})
                    if (link.fetched) {
                      clearInterval(inter)
                      return resolve()
                    }
                  }, 300)
                })
                $modal[0].update(data.links.reduce((acc, link) => [...acc, link.fetched], []).filter(Boolean))
              }
              $modal[0].update(data.links.reduce((acc, link) => [...acc, link.fetched], []).filter(Boolean))
              $modal.modal("show")
            })
    }

    static setupAnnuaireStorage(uid) {
      localStorage.setItem(uid,queryParams.get("data"));
      close()
    }

    static setupAnnuaire() {
      this.uid = uuidv4();

      document.querySelector(".fiche center a").remove()
      const overlayAdInterval = setInterval(_ => $("#dontfoid").remove(), 100)
      setTimeout(_ => clearInterval(overlayAdInterval), 20000)
      var dataset = {}

      $(".list-group-item.list-group-item-action.justify-content-between").each((index, elem) => {
          let span = elem.querySelector("span span")
          if (span.title === "Premium") {
            elem.remove()
          }
          if (queryParams.get("p") !== "serie") return;
          if (!dataset.hasOwnProperty(span.title)) {
              let $header = $(elem).prev();
              dataset[span.title] = { header: $header.get(0), links: [] }
              $header.append(Scrapper.createButton(dataset[span.title]))
          }
          dataset[span.title].links.push({url: elem.href, fetched: null})
      });

      addModal("modal_link")
    }

    static async setupDlProtect() {
      if ($("#subButton").length) {
        await waitElem("#subButton:not([disabled])")
        setInterval(_ => $("#subButton").click(), 1000)
      }
      if ($(".container .text-center a").length){
        const $url =  $(".container .text-center a").first()
        const url = $url.attr("href").replace(/[&?]af(f)?=[^&]+/, '')
        $url.attr("href", url)
        $url.text(url)
        if (queryParams.get("uid") && queryParams.get("origin")) {
          window.location = queryParams.get("origin") + "?data=" + encodeURIComponent(JSON.stringify({
            url,
            id: location.pathname.replace("/",'')
          })) + "&uid=" + queryParams.get("uid")
        }
      }
    }
}

const queryParams = new URLSearchParams(location.search);
if (location.host.includes(".annuaire-telechargement.") && queryParams.get("uid"))
  Scrapper.setupAnnuaireStorage(queryParams.get("uid"));
else if (location.host.includes(".annuaire-telechargement."))
  Scrapper.setupAnnuaire();
else if (location.host === "dl-protect.link")
  Scrapper.setupDlProtect();