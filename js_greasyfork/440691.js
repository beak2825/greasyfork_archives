// ==UserScript==
// @name         forfeiture.gov auto retrieve next search result page on scroll
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPLv3
// @author       jcunews
// @description  https://www.reddit.com/r/HTML/comments/t19vn6/use_developer_tools_f12_to_show_entire_list/
// @match        https://search.forfeiture.gov/NoticeSearch.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440691/forfeituregov%20auto%20retrieve%20next%20search%20result%20page%20on%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/440691/forfeituregov%20auto%20retrieve%20next%20search%20result%20page%20on%20scroll.meta.js
// ==/UserScript==

(busy => {
  function loadNext() {
    busy = true;
    Main_SearchResultPanel.insertAdjacentHTML("beforeend", '<center id=eLoading style="background:#dd0">Loading next search result...</center>');
    fetch(uxMasterPageForm.action, {
      method: uxMasterPageForm.method,
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: Array.from(uxMasterPageForm.elements).map(e => {
        return e.name + "=" + encodeURIComponent(e.name === "__EVENTTARGET" ? "ctl00$Main$lnkNext" : e.value)
      }).join("&"),
      referrer: location.href
    }).catch(e => {
      busy = false;
      eLoading.remove();
      alert("Failed to retrieve next search result.\n" + e)
    }).then(
      r => r.text().then(
        (t, a, b) => {
          busy = false;
          eLoading.remove();
          (a = document.createElement("DIV")).innerHTML = t;
          t = a.querySelector("#Main_SearchResultPanel");
          (b = document.createElement("CENTER")).innerHTML = "Page " + a.querySelector("#Main_SearchResultPageDropDownList1").selectedOptions[0].textContent;
          b.style.cssText = "background:#ddd";
          t.replaceChild(b, t.firstElementChild);
          Main_SearchResultPanel.insertAdjacentHTML("beforeend", t.innerHTML);
          Array.from(a.querySelector("#uxMasterPageForm").elements).forEach(e => uxMasterPageForm[e.name].value = e.value)
        }
      )
    )
  }
  if (window.Main_lnkNext2 && Main_lnkNext2.href) {
    document.querySelector("#srch-results-header h2").insertAdjacentHTML("beforeend",
      `<div style="display:inline;margin-left:2em;font-size:12pt;color:#000">${
        Main_uxCurrentPageLabel.textContent.match(/\d+ records?/)[0]
      }</div>`
    );
    Main_searchResultPagingLinkTablePanel.style.cssText = Main_searchResultPagingLinkTablePanel2.style.cssText = "height:0;overflow:hidden";
    addEventListener("scroll", ev => {
      if (((scrollY + innerHeight) > Main_searchResultPagingLinkTablePanel2.offsetTop) && !budy) loadNext()
    });
  }
})();
