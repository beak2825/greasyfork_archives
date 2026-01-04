// ==UserScript==
// @name         darkw generator próśb
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  dodaje przycisk do znacznika code dzieki ktoremu mozna generowac prosbe o wygenerowanie linku
// @author       wasina
// @match        https://darkw.pl/*
// @exclude     https://darkw.pl/generowanie-linkow-f7/*
// @connect     rapidu.net
// @connect     fileshark.pl
// @connect     ddownload.com
// @connect     wrzucajpliki.pl
// @connect     rapidgator.net
// @grant       GM_xmlhttpRequest
// @require     https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @require     https://cdn.jsdelivr.net/npm/axios-userscript-adapter@0.0.4/dist/axiosGmxhrAdapter.min.js
// @downloadURL https://update.greasyfork.org/scripts/411863/darkw%20generator%20pr%C3%B3%C5%9Bb.user.js
// @updateURL https://update.greasyfork.org/scripts/411863/darkw%20generator%20pr%C3%B3%C5%9Bb.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  axios.defaults.adapter = axiosGmxhrAdapter;

  let chosenLinks = [];
  let filteredLinks = [];
  let availableLinks = [];
  let hostnameList = new Set();

  const siteList = [
    "rapidu.net",
    "fileshark.pl",
    "ddownload.com",
    "wrzucajpliki.pl",
    "rapidgator.net"
  ];

  addButtons();

  function addButtons() {
    const codeElements = document.getElementsByTagName("code");
    let codeid = 0;
    for (let item of codeElements) {
      if (siteList.some((el) => item.innerHTML.includes(el))) {
        const button = document.createElement("div");
        button.innerText = "Poproś o generacje";
        button.classList.add("button", "button--with-icon", "spo", "generuj");
        button.style.width = "150px";
        button.dataset.codeid = codeid;
        button.addEventListener("click", getLinksInfo);
        item.appendChild(document.createElement("br"));
        item.appendChild(button);
      }
      codeid++;
    }
  }

  async function getLinksInfo(e) {
    const codeid = e.target.dataset.codeid;
    let links = document
      .getElementsByTagName("code")
      [codeid].innerHTML.replace(/\n/g, "")
      .split("<br>");
    links = links.filter((el) => siteList.some((site) => el.includes(site)));
    loader();
    hostnameList = new Set();
    const linksList = [];
    for (let i = 0; i < links.length; i++) {
      const link = {
        href: links[i],
      };
      hostnameList.add(new URL(links[i]).hostname);
      link.size = "? ";
      linksList.push(link);
    }
    availableLinks = linksList;
    filteredLinks = linksList;
    chosenLinks = [];
    const modal_box = generateModalBox(linksList);
    modalFastCose();
    document.body.appendChild(modal_box);
    refreshLinksView()
  }

  async function checkLink(e) {
    const id = e.target.dataset.id;
    const size = await getSize(filteredLinks[id].href)
    filteredLinks[id].size = size;
    document.getElementById(
      "info" + id
    ).innerHTML = size === 0
    ? filteredLinks[id].href + " <strong>niedostepny</strong>"
    : filteredLinks[id].href + " <strong>" + filteredLinks[id].size + "GB</strong>";
    e.target.style.display = 'none'; 
  }

  async function checkAllLink(e){
    for (let i = 0; i < filteredLinks.length; i++) {
      const size = await getSize(filteredLinks[i].href)
      filteredLinks[i].size = size;
      let id = availableLinks.findIndex(el => el.href == filteredLinks[i].href);
      availableLinks[id].size = size;
      document.getElementById(
        "info" + i
      ).innerHTML = size === 0
      ? filteredLinks[i].href + " <strong>niedostepny</strong>"
      : filteredLinks[i].href + " <strong>" + filteredLinks[i].size + "GB</strong>";
    }
    e.target.style.display = 'none';
    document.querySelectorAll('.checkbtn').forEach( el => {
      el.style.display = 'none';
    }) 
  }
  
  async function getSize(link){
    let size;
    return await axios
      .get(link)
      .then((response) => {
        const doc = document.implementation.createHTMLDocument("");
        doc.write(response.data);
        let selector, sizeStr;
        if (link.includes("rapidu")) {
          selector = ".title small";
          if ((sizeStr = doc.querySelector(selector).innerText)) {
          } else {
            return 0;
          }
        } else if (link.includes("fileshark")) {
          selector = ".size-file strong";
          if ((sizeStr = doc.querySelector(selector).innerText)) {
          } else {
            return 0;
          }
        } else if (link.includes("ddownload")) {
          selector = ".file-size";
          if ((sizeStr = doc.querySelector(selector).innerText)) {
          } else {
            return 0;
          }
        } else if (link.includes("wrzucajpliki")) {
          selector = "span";
          if ((sizeStr = doc.querySelectorAll(selector)[16].innerText.slice(1, -1))) {
          } else {
            return 0;
          }
        } else if (link.includes("rapidgator")) {
          selector = "strong";
          
          if ((sizeStr = doc.querySelectorAll(selector)[2].innerText)) {
            if(!sizeStr.includes("GB") && !sizeStr.includes("MB")) return 0
          } else {
            return 0;
          }
        }

        if (sizeStr.includes("GB")) {
          return Number(sizeStr.slice(0, -3));
        } else {
          return (Number(sizeStr.slice(0, -3)) / 1024).toFixed(2);
        }
      })
      .catch((error) => {
        console.log(error);
        return 0;
      });
  }

  function generateModalBox(links) {
    const modal_box = document.createElement("div");
    modal_box.classList.add("modal_box");

    const c1 = document.createElement("div");
    c1.classList.add("c1");
    const c2 = document.createElement("div");
    c2.classList.add("c2");

    const modal_content = document.createElement("div");
    modal_content.classList.add("modal_content");

    if(hostnameList.size > 1){
      let p = document.createElement("p");
      p.innerHTML = "Hostingi";
      modal_content.appendChild(p)
      const host_list = document.createElement("div");
      host_list.classList.add("modal_contentsd");
      hostnameList.forEach(hostname => {
        const checkbox = document.createElement("div");
        checkbox.classList.add("checkbox", "host_list");
        checkbox.style.display = "inline-block";
        checkbox.style.marginLeft = "10px";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "host"
        input.id = "host_" + hostname
        input.dataset.name = hostname;
        input.addEventListener('click', filterLinks)
        const label = document.createElement("label");
        label.innerHTML = hostname
        label.htmlFor = "host_" + hostname;
        checkbox.appendChild(input);
        checkbox.appendChild(label);
        host_list.appendChild(checkbox);
      })
      modal_content.appendChild(host_list)
    }
    
    let p = document.createElement("p");
    p.innerHTML = "Wybierz linki"
    p.style.clear = "both"
    modal_content.appendChild(p)
    modal_content.style.width = "1100px";
    modal_content.style.overflow = "hidden"

    const tabs_content = document.createElement("div");
    tabs_content.id = "links-list"
    if(links.length > 15){
      tabs_content.style.overflowY = "scroll";
      tabs_content.style.maxHeight = "500px";
    }


    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "checkall";
    input.addEventListener('click', checkAll)
    const label = document.createElement("label");
    label.innerHTML = "Wybierz wszystkie";
    label.htmlFor = "checkall";
    checkbox.appendChild(input);
    checkbox.appendChild(label);

    p = document.createElement("p");
    p.innerText = "Wybranych linków: 0";
    p.id = "links-count";

    modal_content.appendChild(checkbox);
    modal_content.appendChild(tabs_content);

    const form = document.createElement("div");
    form.classList.add("modal_form");
    const buttons = document.createElement("div");
    buttons.classList.add("buttons", "buttons--center");

    const button = document.createElement("div");
    button.classList.add("button", "button--with-icon");
    button.innerText = "Anuluj";
    button.addEventListener("click", loaderClose);

    const button2 = document.createElement("div");
    button2.classList.add("button", "button--with-icon");
    button2.innerText = "Dodaj";
    button2.addEventListener("click", send);

    const button3 = document.createElement("div");
    button3.classList.add("button", "button--with-icon");
    button3.innerText = "Sprawdź wszystkie";
    button3.id = "check-all-btn";
    button3.addEventListener("click", checkAllLink);

    buttons.appendChild(button);
    buttons.appendChild(button3);
    buttons.appendChild(button2);
    form.appendChild(buttons);
    modal_content.appendChild(p);
    modal_content.appendChild(form);
    c2.appendChild(modal_content);
    c2.appendChild(modal_content);
    c1.appendChild(c2);
    modal_box.appendChild(c1);
    return modal_box;
  }

  function filterLinks(e){
    const name = e.target.dataset.name;
    filteredLinks = availableLinks.filter(el => el.href.includes(name))
    chosenLinks = [];
    const checkBtn = document.getElementById("check-all-btn");
    for(let el of filteredLinks){
      if(el.size == "? " || el.size == 0){
        checkBtn.style.display = "flex"
        break;
      }
    }
    updateSize();
    refreshLinksView();
  }


  function refreshLinksView(){
    const linksContainer = document.getElementById("links-list");
    linksContainer.innerHTML = '';

    let linkid = 0;
    for (let link of filteredLinks) {
      const checkbox = document.createElement("div");
      checkbox.classList.add("checkbox");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = 1;
      input.id = "link" + linkid;
      input.dataset.id = linkid;
      input.classList.add('link-list');
      input.addEventListener("change", addLink);
      if (link.size === 0) input.disabled = true;
      const label = document.createElement("label");
      label.innerHTML =
        link.size === 0
          ? link.href + " <strong>niedostepny</strong>"
          : link.href + "<strong>" + link.size + "GB</strong>";
      if(link.used) label.innerHTML = "<s>" + label.innerHTML + "</s>"
      label.id = "info" + linkid;
      label.htmlFor = "link" + linkid;
      const checkButton = document.createElement("div");
      checkButton.classList.add("button", "button--with-icon");
      checkButton.innerText = "Sprawdź dostępność";
      checkButton.classList.add("checkbtn");
      checkButton.style.height = "18px";
      checkButton.style.marginLeft = "5px";
      checkButton.dataset.id = linkid;
      checkButton.addEventListener("click", checkLink)
      checkbox.appendChild(input);
      checkbox.appendChild(label);
      if(link.size == "? ") checkbox.appendChild(checkButton);
      linksContainer.appendChild(checkbox);
      linkid++;
    }
  }

  function addLink(e) {
    const id = e.target.dataset.id;
    if (filteredLinks[id].size == "? " || filteredLinks[id].size == 0){
      e.target.checked = false;
      return
    } 
    if (e.target.checked) {
      chosenLinks.push(filteredLinks[id]);
    } else {
      const index = chosenLinks.findIndex(el =>  el.href == filteredLinks[id].href);
      chosenLinks.splice(index, 1);
    }
    updateSize();
  }

  function checkAll(e){
    chosenLinks = [];
    let links = document.getElementsByClassName('link-list');
    if (e.target.checked){
      let i = 0
      for(let link of links){
        if (filteredLinks[i].size != "? " && filteredLinks[i].size != 0){
          link.checked = true;
          chosenLinks.push(filteredLinks[i]);
        }
        i++
      }
    }else {
      for(let link of links){
        link.checked = false;
      }
    }
    updateSize();    
  }

  function send() {
    if(chosenLinks.length < 1) return

    for (let i = 0; i < chosenLinks.length; i++) {
      const link = chosenLinks[i];
      let id = filteredLinks.findIndex(el => el.href == link.href);
      filteredLinks[id].used = true
      newWindow(link);
    }

    chosenLinks = [];
    updateSize();
    refreshLinksView();
  }

  function newWindow(link){
    const url = new URL(link.href);
    chosenLinks.site = url.hostname;
    let postTitle = url.hostname + " " + link.size + " GB";
    let postMessage = `[code]${link.href}[/code]`;
    const bodyFormData = new FormData();
    bodyFormData.append("postTitle", postTitle);
    bodyFormData.append("postDesc", "");
    bodyFormData.append("postMessage", postMessage);
    bodyFormData.append("postAction", "1");
    bodyFormData.append("postOption", "2");
    bodyFormData.append("postPollQuestion", "");
    bodyFormData.append("postPollTime", "");
    bodyFormData.append("postPollOption", "");

    axios({
      method: "post",
      url: "https://darkw.pl/new-topic-f7/",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
      .then(function (response) {
        const state = {};
        const title = "";
        const url = "new-topic-f7/";

        const newWindow = window.open('https://darkw.pl/new-topic-f7/', '_blank',);
        newWindow.document.write(response.data);
        newWindow.history.pushState(state, title, url)
        // loaderClose();
      })
      .catch(function (response) {
        // loaderClose();
        console.log(response);
      });
  }

  function updateSize() {
    document.getElementById(
      "links-count"
    ).innerText = `Wybranych linków: ${chosenLinks.length}`;
  }
})();
