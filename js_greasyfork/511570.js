// ==UserScript==
// @name         Porkbun Links + Cheap List
// @namespace    http://porkbun.com/
// @version      1.0
// @description  makes unavailable links in Porkbun clickable (+ whois and intodns link) Also adds a sidebar  list in order of cheapest domains
// @author       zvodd | OriginalAuthor: StuffBySpencer
// @match        https://porkbun.com/checkout/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511570/Porkbun%20Links%20%2B%20Cheap%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/511570/Porkbun%20Links%20%2B%20Cheap%20List.meta.js
// ==/UserScript==

(function() {
  //Styling for addon UI
    document.body.insertAdjacentHTML("afterbegin",`
    <style>
      div.notHomepageTopContainer.container {
      padding-right:220px;
      }

      #cheaplist {
      position:absolute;
      top:180px;
      right:10px;
      width:15em;
      min-height:20em;
      z-index:999;
      padding:0;
      }

      #cheaplist li {
      margin-bottom:10px;
      list-style-type:none;
      cursor:pointer;
      background-color:#f0f0f0;
      }

      .cheapprice {
      font-weight:700;
      color:red;
      }

      .cheapprice::before {
      content:"$";
      }

      .cheapprice::after {
      content:":";
      color:#000;
      font-weight:400;
      }

      .cheaptitle {
      font-size:14px;
      color:blue;
      }

      .highlight {
      background-color:#fff;
      border:thin dotted red;
      }
    .info{
      text-decoration: initial;
      display: flex;
      flex-direction: row;
      justify-content: left;
      height: 100%;
      height: 45px;
    }
    </style>
    `);

    // Select the node that will be observed for mutations
    const domainRow = document.querySelectorAll('.searchResultRow');
    var mute_count = 0;

    // Callback function to execute when mutations are observed
    const setHrefCb = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            const elem = mutation.target;
            if (mutation.type === 'attributes' && mutation.attributeName === 'class' && elem.classList.contains('searchResultRowDomain')){
                let hostname = elem.innerText.trim();
                let id = "anc_"+hostname
                if (elem.classList.contains('availableDomain')) {
                    elem.innerHTML = `<span id="${id}" >${hostname}</span>`;
                }else if (elem.classList.contains('unavailableDomain')) {
                    elem.innerHTML = `<a id="${id}" href="http://${hostname}" target="_blank">${hostname}</a>`;
                    if (elem.parentElement.querySelector(".info") == null) {
                        elem.classList.replace('col-md-5', 'col-md-3')
                        elem.insertAdjacentHTML("afterend",`
                        <div class="info searchResultRowCell col-md-1">
                          <a href="https://who.is/whois/${hostname}" target="_blank">whois</a> | <a href="https://intodns.com/${hostname}" target="_blank">intodns</a>
                        </div>
                      `);
                    }
                }
            }
        }
        // Call on the last row
        mute_count++;
        if (mute_count == domainRow.length){
            genElements();
        }
    };

    for (let i = 0; i < domainRow.length; i++) {
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(setHrefCb);

        // Start observing the target node for configured mutations
        observer.observe(domainRow[i], { attributes: true, childList: true, subtree: true });
    }

    function cheapSort(){
        var cSort = [...document.querySelectorAll(".searchResultRow.availableDomainRow")]
        .map(e=>({e:e.querySelector(".searchResultRowCell"),p: e.querySelector(".renewsAtContainer")}))
        .map(({e,p})=>({p: p.textContent.trim().split("$").pop(), n: e.textContent.trim(), e:e}))
        .sort((x,y)=>(Number(x.p)>Number(y.p))?1:-1)
        console.log(cSort.map(({n,p})=>(p+": "+ n)))
        return cSort
    }

    function genElements(){
        let objs = cheapSort();
        let htstring = `<ul id="cheaplist">`
        objs.forEach(({n,p,e}) => {
            let id = "anc_"+n;
            htstring +=(
            `<li data-anc="${id}">
            <span class="cheapprice" >${p}</span><span class="cheaptitle">${n}</span>
            </li>`
            );
        })
        htstring += `</ul>`;
        document.body.insertAdjacentHTML("afterbegin", htstring)

        const chlist = [...document.querySelectorAll("#cheaplist li")]
        for(const chitem of chlist){
          chitem.addEventListener("click", (_) => handleClick(chitem))
        }
    }

    // highlight and scroll to
    function handleClick(originElement){
        const anc = originElement.dataset['anc'];
        const tablelink = document.getElementById(anc)
        toggleClass(tablelink, "highlight")
        tablelink.scrollIntoView()
    }

    function toggleClass(element, className) {
      if (element && typeof element.classList !== 'undefined') {
        element.classList.toggle(className);
      }
    }
})();