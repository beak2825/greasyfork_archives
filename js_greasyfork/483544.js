// ==UserScript==
// @name         Ban
// @namespace    http://tampermonkey.net/
// @version      2023-12-31
// @description  Pseudos bans jeuxvideo.com
// @author       PneuTueur
// @match        *://*.jeuxvideo.com/forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jeuxvideo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483544/Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/483544/Ban.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Check only 4 times per days function
    const toCheck = (account) => {
      if (account.lastCheck === 0) return true
      if (account.lastCheck) {
       const today = new Date
       const lastCheckDate = new Date(account.lastCheck)
       const diff = today.getTime() - lastCheckDate.getTime()
       const days = diff / (1000 * 60 * 60 * 24)
       if (days >= 0.25) return true
       else return false
      }
      return true
    }
    const container = document.querySelector("#forum-right-col")
    if (container == null) return
    container.insertAdjacentHTML("beforeend",`
        <style>
            ul.account-list {
              vertical-align:top;
            }
            ul.account-list a {
              font-weight: bold;
            }
            ul.account-list a:not(.checked) {
              opacity: 0.3;
            }
            ul.account-list a.banned {
              color: red!important;
            }
            ul.account-list a.available {
              color: lawngreen!important;
            }
            ul.account-list a.failed {
              color: yellow!important;
            }
            ul.account-list .remove {
              margin-left: 8px;
              font-weight: bold;
            }
            ul.account-list .remove:hover {
              cursor: pointer;
            }
            #add-account {
              border-color: var(--jv-input-border-color);
              background-color: var(--jv-input-bg-color);
              border-radius: 0.25rem;
            }
        </style>
    `)
    const bannedAccountsStorage = localStorage.getItem("bannedAccounts")
    let bannedAccounts = bannedAccountsStorage ? JSON.parse(bannedAccountsStorage) : []
    const buildContainer = () => {
     const template = `
       <div id="bannedAccounts" class="card card-jv-forum card-forum-margin">
         <div class="card-header">Comptes</div>
           <div class="card-body">
             <div class="bloc-forums-preferes has-scrollbar">
               <h4 class="titre-info-fofo">Comptes</h4>
                  <ul class="account-list" id="list1" style="display: inline-block;">
                  </ul>
                  <ul class="account-list" id="list2" style="display: inline-block;">
                  </ul>
                <h4 class="titre-info-fofo">Ajouter un compte</h4>
                <input id="add-account" maxlength="15" class="txt-search form-control" "type="text" placeholder="Ajouter un compte" autocomplete="off" value="">
              </div>
           </div>
         </div>
       </div>
     `
     container.insertAdjacentHTML("beforeend",template)
    }
    buildContainer()
    const bannedAccountContainer = document.querySelector("#bannedAccounts")
    const html_list1 = bannedAccountContainer.querySelector("ul#list1")
    const html_list2 = bannedAccountContainer.querySelector("ul#list2")

    const buildAccountList = (accounts) => {
      const list1 = []
      const list2 = []
      let nb_accounts_in_list1 = html_list1.getElementsByTagName('li').length
      let nb_accounts_in_list2 = html_list2.getElementsByTagName('li').length

      accounts.forEach((a, index) => {
        if (nb_accounts_in_list1===nb_accounts_in_list2) {
            list1.push(`<li><a name="${a.name}" class="account ${a.status !== "" && !toCheck(a) ? `checked ${a.status}` : ""}" target="_blank" href="https://www.jeuxvideo.com/profil/${a.name.toLowerCase()}?mode=infos">${a.name}</a><span name="${a.name}" class="remove">x</span></li>`)
            nb_accounts_in_list1++
        }
        else {
            list2.push(`<li><a name="${a.name}" class="account ${a.status !== "" && !toCheck(a) ? `checked ${a.status}` : ""}" target="_blank" href="https://www.jeuxvideo.com/profil/${a.name.toLowerCase()}?mode=infos">${a.name}</a><span name="${a.name}" class="remove">x</span></li>`)
            nb_accounts_in_list2++
        }
      })
      html_list1.insertAdjacentHTML("beforeend",list1.join(""))
      html_list2.insertAdjacentHTML("beforeend",list2.join(""))
    }
    // Manually add from input
    const addAccountInput = document.querySelector("#add-account")
    addAccountInput.addEventListener("keypress", (event) => {
      if (event.keyCode === 13) {
        const value = event.target.value
        const canAdd = value !== "" && bannedAccounts.findIndex(a => a.name === event.target.value) < 0
        const account = {
          name: value,
          lastCheck: 0,
          status: ""
        }
        if (canAdd) {
         buildAccountList([account])
         bannedAccounts.push(account)
         localStorage.setItem("bannedAccounts", JSON.stringify(bannedAccounts))
        }
        event.target.value = '';
      }
    })
    // Check account
    const checkAccount = async (account) => {
      const accountEl = document.querySelector(`a[name="${account.name}"]`)
      accountEl.classList.add("checking")
      let getAccountPage = await fetch(`https://www.jeuxvideo.com/profil/${account.name.toLowerCase()}?mode=infos`)
      if (getAccountPage.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        getAccountPage = await fetch(getAccountPage)
      }
      if (getAccountPage.status === 503) {
        accountEl.classList.add("failed")
      }
      const pageContent = await getAccountPage.text()
      const parser = new DOMParser()
      const htmlDocument = parser.parseFromString(pageContent, "text/html")
      const bannedBanner = htmlDocument.querySelector(".alert.alert-danger")
      const errorImage = htmlDocument.querySelector("img.img-erreur")
      if (bannedBanner) {
        account.status = "banned"
        accountEl.classList.add("banned")
      } else if (errorImage) {
        account.status = "failed"
        accountEl.classList.add("failed")
      }
      else {
        account.status = "available"
        accountEl.classList.add("available")
      }
      account.lastCheck = Date.now()
      accountEl.classList.add("checked")
      accountEl.classList.remove("checking")
      localStorage.setItem("bannedAccounts", JSON.stringify(bannedAccounts))
    }
    // Observers
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const el = mutation.target
            const accounts = Array.from(el.querySelectorAll("a"))
            const filteredAccounts = accounts.filter((a) => !a.classList.contains("checked") && !a.classList.contains("checking"))
            if (filteredAccounts.length > 0) {
              filteredAccounts.forEach(a => {
                const accountItem = bannedAccounts.find(aItem => aItem.name == a.name)
                if (accountItem) checkAccount(accountItem)
              })
            }
        }
    });
    observer.observe(html_list1, { subtree: false, childList: true, attributes: false });
    observer.observe(html_list2, { subtree: false, childList: true, attributes: false });
    // Add from storage
    if (bannedAccounts.length > 0) {
      buildAccountList(bannedAccounts)
    }
    // Remove account
    bannedAccountContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove")) {
        bannedAccounts = bannedAccounts.filter(a => a.name !== event.target.getAttribute("name"));
        html_list1.innerHTML = '';
        html_list2.innerHTML = '';
        buildAccountList(bannedAccounts);
        localStorage.setItem("bannedAccounts", JSON.stringify(bannedAccounts))
        event.target.parentNode.remove()
      }
    })
})();