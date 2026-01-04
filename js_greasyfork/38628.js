// ==UserScript==
// @name    Publication Auto PDF
// @name:zh-CN  SCI文献PDF直达
// @version 0.5.0
// @author  sincostandx
// @description Automatically jumps to PDF when you visit a journal article abstract page. Also includes a utility to copy or download citation info.
// @description:zh-CN  访问SCI文献摘要页时自动跳转至PDF，附带文献摘录工具
// @match https://www.sciencedirect.com/science/article/*
// @match https://onlinelibrary.wiley.com/doi/*
// @match https://*.onlinelibrary.wiley.com/doi/*
// @match https://pubs.acs.org/doi/*
// @match https://www.tandfonline.com/doi/*
// @match https://www.beilstein-journals.org/*
// @match https://pubs.rsc.org/en/content/*
// @match https://link.springer.com/article*
// @match https://pubs.aip.org/aip/*/article/*
// @match https://www.nature.com/articles*
// @match https://www.science.org/doi/*
// @match https://journals.aps.org/*/abstract/10*
// @match https://cdnsciencepub.com/doi/*
// @match https://iopscience.iop.org/article/10*
// @match https://www.cell.com/*/fulltext/*
// @match https://journals.lww.com/*
// @match https://*.biomedcentral.com/articles/*
// @match https://journals.sagepub.com/doi/*
// @match https://academic.oup.com/*/article/*
// @match https://karger.com/*/article/*
// @match https://www.cambridge.org/core/journals/*/article/*
// @match https://www.annualreviews.org/doi/*
// @match https://www.jstage.jst.go.jp/article/*
// @match https://www.hindawi.com/journals/*
// @match https://*.theclinics.com/article/*
// @match https://www.liebertpub.com/doi/*
// @match https://thorax.bmj.com/content/*
// @match https://journals.physiology.org/doi/*
// @match https://www.ahajournals.org/doi/*
// @match https://dl.acm.org/doi/*
// @match https://journals.asm.org/doi/*
// @match https://*.apa.org/record/*
// @match https://*.apa.org/fulltext/*
// @match https://www.thelancet.com/journals/*/article/*
// @match https://jamanetwork.com/journals/*
// @match https://aacrjournals.org/*/article/*
// @match https://royalsocietypublishing.org/doi/*
// @match https://journals.plos.org/*/article*
// @match https://*.psychiatryonline.org/doi/*
// @match https://opg.optica.org/*/*.cfm*
// @match https://www.thieme-connect.de/products/ejournals/*
// @match https://journals.ametsoc.org/view/journals/*
// @match https://www.frontiersin.org/articles/*
// @match https://www.worldscientific.com/doi/*
// @match https://www.nejm.org/doi/*
// @match https://ascopubs.org/doi/*
// @match https://www.jto.org/article/*
// @match https://www.jci.org/articles/*
// @match https://www.pnas.org/doi/*
// @grant   GM.getValue
// @grant   GM.setValue
// @run-at  document-start
// @namespace https://greasyfork.org/users/171198
// @downloadURL https://update.greasyfork.org/scripts/38628/Publication%20Auto%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/38628/Publication%20Auto%20PDF.meta.js
// ==/UserScript==

(function() {
  "use strict";

  let tit = null; // title
  let doi = null;
  let pdf = null; // pdf url

  let sty = null; // citation text style

  // attempt to extract DOI from URL
  function getCrudeDOI() {
    const l = location.pathname.match(/(^.+doi\/)([^/]+\/)?(10\.[^/]+\/[^/]+)/);
    if (l === null) return [null, null];
    const d = l[l.length-1];
    return [d, l[1] + "pdf/" + d];
  }

  const [doiCrude, pdfPathname] = getCrudeDOI();

  // determine if we need to redirect to PDF
  let jump = sessionStorage.getItem("%" + doiCrude) === null &&
                                          sessionStorage.getItem(location.pathname) === null;

  // For sites in "shortcutSites" modify the URL directly.
  // Otherwise, load PDF link from meta data or DOM.
  if (doiCrude !== null) {
    sessionStorage.setItem("%" + doiCrude, "1");
    if (jump && location.pathname !== pdfPathname) {
      const shortcutSites = ["acs", "aps", "wiley", "tandfonline", "sagepub", "annualreviews", "liebertpub",
                             "physiology", "ahajournals", "acm", "royalsocietypublishing", "psychiatryonline", "thieme",
                             "worldscientific", "nejm", "ascopubs", "cdnsciencepub", "asm", "science", "pnas"];
      const hostname = location.hostname;
      if (shortcutSites.some(a=>hostname.includes(a))) {
        location.pathname = pdfPathname;
      }
    } else {
      new Promise(checkLoaded).then(loadMeta);
    }
  } else {
    sessionStorage.setItem(location.pathname, "1");
    if (location.hostname.includes(".apa.")) {
      new Promise(checkAPALoaded).then(loadMeta);
    } else {
      new Promise(checkLoaded).then(loadMeta);
    }
  }

  function checkLoaded(resolve) {
    function check(){
      if (document.body !== null && document.body.innerHTML.length !== 0) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    }
    check();
  }

  function checkAPALoaded(resolve) {
    let count = 0;
    function check(){
      const main = document.querySelector("main");
      if (main !== null && main.offsetHeight > 300) {
        resolve();
      } else if (++count < 30){
        setTimeout(check, 1000);
      }
    }
    check();
  }

  function loadMeta() {
    const titmeta = ["dc.title", "citation_title", "wkhealth_title", "og:title"];
    const doimeta = ["citation_doi", "dc.identifier", "dc.source"];
    const pdfmeta = ["citation_pdf_url", "wkhealth_pdf_url"];
    const metaList = document.getElementsByTagName("meta");
    for (const meta of metaList) {
      let n = meta.getAttribute("name");
      if (n === null) {
        n = meta.getAttribute("property");
        if (n === null) continue;
      }
      n = n.toLowerCase();
      if (tit === null && titmeta.includes(n)) {
        tit = meta.getAttribute("content");
        continue;
      }
      if (doi === null && doimeta.includes(n)) {
        const d = meta.getAttribute("content");
        if (d.includes("10.")) {
          if (d.includes("doi")) {
            doi = d.slice(d.indexOf("10."));
          } else {
            doi = d;
          }
          continue;
        }
      }
      if (pdf === null && pdfmeta.includes(n)) {
        pdf = meta.getAttribute("content");
      }
    }
    if (jump && location.hostname.includes("sciencedirect")) {
      if (loadElsevierPDF()) return;
    }
    if (pdf !== null && location.hostname.includes(".apa.")) {
      // need to remove query string in apa pdf links
      const url = new URL(pdf);
      url.search = '';
      pdf = url.toString();
    }
    if (jump && pdf !== null && location.href !== pdf) {
      location.href = pdf;
    } else {
      if (doi === null) {
        doi = doiCrude;
        if (doi === null) return;
      }
      if (tit === null) tit = "Unknown Title";
      if (pdf === null) pdf = pdfPathname;
      toolbox(tit, doi, pdf);
    }
  }

  // newbr, newinput, newtag are util functions to create toolbox elements.
  function newbr(parent) {
    parent.appendChild(document.createElement("br"));
  }

  function newinput(parent, type, value, onclick) {
    const i = document.createElement("input");
    i.type = type;
    i.value = value;
    if (onclick !== null) {
      i.addEventListener("click", onclick, false);
    }
    i.className = "toolbox";
    parent.appendChild(i);
    return i;
  }

  function newtag(parent, tag, text) {
    const i = document.createElement(tag);
    if (text !== null) {
      i.textContent = text;
    }
    i.className = "toolbox";
    parent.appendChild(i);
    return i;
  }

  function loadElsevierPDF() {
    let pdflink = null;
    let trials = 0;
    function getJSON(resolve) {
      function get() {
        const json = document.querySelector('script[type="application/json"]');
        try {
          const meta = JSON.parse(json.innerHTML).article.pdfDownload.urlMetadata;
          pdflink = "/" + meta.path + "/" + meta.pii + meta.pdfExtension + "?md5=" + meta.queryParams.md5 + "&pid=" + meta.queryParams.pid;
          return true;
        } catch(e) {
          return false;
        }
      }
      if (!get()) {
        if (++trials > 30) {
          console.error("Auto PDF: Unable to load JSON from DOM!");
          throw "";
        }
        setTimeout(() => {getJSON(resolve);}, 1000);
        return;
      }
      resolve(pdflink);
    }
    new Promise(getJSON).then((pdflink) => {
      location.href = pdflink;
    }).catch(() => {});
    return true;
  }

  function toolbox(tit, doi, pdf) {
    const div = document.createElement("div");
    div.style = `
z-index: 2147483647;
position: fixed;
right: 10px;
top: 50%;
transform: translate(0, -50%);
border: 2px groove black;
background: white;
box-shadow: 6px 6px 3px grey;`;

    const sheet = document.createElement("style")
    sheet.textContent = `
.toolbox {
  font-size: small !important;
  font-family: sans-serif !important;
  margin-bottom: 4px !important;
  margin-top: 0 !important;
  display: initial !important;
  line-height: initial !important;
}

input.toolbox, select.toolbox {
  background-image: none !important;
  width: auto;
  max-height: none;
  height: initial;
}

textarea.toolbox, input.toolbox[type=text] {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 11em;
  padding: 0.5rem;
  border-style: solid;
}

a.toolbox:hover {
  color: #006db4;
}

a.toolbox {
  cursor: pointer;
  color: #10147e;
}

input.toolbox[type=button]:hover {
  background: #006db4;
}

input.toolbox[type=button] {
  padding: 4px 8px;
  background: #10147e;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

[tooltip]:before {
  position: absolute;
  opacity: 0;
}

[tooltip]:hover:before {
  content: attr(tooltip);
  opacity: 1;
  color: black;
  background: white;
  padding: 2px;
  border: 1px groove black;
  white-space: nowrap;
  overflow: hidden;
  right: 0;
  margin-top: -25pt;
}

h2.toolbox {
  font-size: large !important;
}
`;
    div.appendChild(sheet);

    // Hide and Settings button
    const hide_btn_parent = newtag(div, "div", null);
    hide_btn_parent.style = "display: flex !important; justify-content: flex-end; padding-right: 10px;";
    const hide_btn = newtag(hide_btn_parent, "a", "✖");
    hide_btn.style = "font-size: large !important; text-decoration: none;";
    hide_btn.addEventListener("click", () => div.remove(), false);

    // DOI textbox and copy button
    const txt_doi = newinput(div,"text",doi,null);
    newbr(div);
    newinput(div, "button", "Copy", () => {txt_doi.select(); document.execCommand("Copy");});
    newbr(div);newbr(div);

    // info textbox and copy button
    const info = tit + "\t" + doi;
    const txt_inf = newinput(div, "text", info, null);
    newbr(div);
    newinput(div, "button", "Copy", () => {txt_inf.select(); document.execCommand("Copy");});
    newbr(div);newbr(div);

    // bibtex button
    const txt_bib = newtag(div, "textarea", null);
    txt_bib.style = "resize: none; display: none !important;";
    newbr(div);
    const btn_bib_label = "Copy BibTeX";
    const btn_bib = newinput(div, "button", btn_bib_label, loadBib);
    newbr(div);
    function loadBib() {
      btn_bib.disabled = true;
      btn_bib.value = "Loading";
      fetch("https://dx.doi.org/" + doi, {
        headers: {
          "Accept": "application/x-bibtex"
        }})
        .then(response => response.text())
        .then(data => {
          txt_bib.value = data;
          txt_bib.style.display = "";
          txt_bib.select();
          document.execCommand("Copy");
          btn_bib.value = btn_bib_label;
          btn_bib.disabled = false;
        })
        .catch(error => {
          alert("Cannot load BibTeX.");
          btn_bib.value = btn_bib_label;
          btn_bib.disabled = false;
        });
    }
    // Text button
    const btn_txt_label = "Copy Text";
    const btn_txt = newinput(div, "button", btn_txt_label, loadTxt);
    function loadTxt() {
      if (sty === "") {
        setstyle();
        return;
      }
      btn_txt.disabled = true;
      btn_txt.value = "Loading";
      fetch("https://dx.doi.org/" + doi, {
        headers: {
          "Accept": "text/x-bibliography; style=" + sty
        }})
        .then(response => response.text())
        .then(data => {
          txt_bib.value = data;
          txt_bib.style.display = "";
          txt_bib.select();
          document.execCommand("Copy");
          btn_txt.value = btn_txt_label;
          btn_txt.disabled = false;
        })
        .catch(error => {
          alert("Cannot load text reference.");
          btn_txt.value = btn_txt_label;
          btn_txt.disabled = false;
        });
    }
    // text style link
    const stylink = newtag(div, "a", "Style");
    stylink.addEventListener("click", setstyle, false);
    newbr(div);

    function setstyle() {
      const div = document.createElement("div");
      div.style = `
z-index: 2147483647;
position: fixed;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
border: 2px groove black;
background: white;
padding: 20px;
box-shadow: 10px 10px 5px grey;`;

      newtag(div, "h2", "Choose a citation style for text references:");
      const sel = newtag(div, "select", null);
      sel.size = 15;
      sel.style.minWidth = "600px";
      newbr(div);
      newtag(div, "p", "This citation style will be saved as default.").style = "margin-top: 5px !important";
      newbr(div);

      const btns = newtag(div, "div", null);
      btns.style = "display: block !important; text-align: center;";
      // OK button
      newinput(btns, "button", "OK", () => {
        setStyleAndTooltip(sel.value);
        GM.setValue("sty", sty);
        document.body.removeChild(div);
        loadTxt();
      });
      // cancel button
      newinput(btns, "button", "Cancel", () => document.body.removeChild(div)).style.marginLeft = "1em";

      // load styles
      fetch("https://citation.crosscite.org/styles")
        .then(response => response.json())
        .then(data => {
          for (const i of data) {
            const x = document.createElement("option");
            x.text = i;
            sel.add(x);
          }
          if (sty !== "") {
            sel.value = sty;
          } else {
            sel.selectedIndex = 0;
          }
        })
        .catch(error => {
          alert("Cannot load style list.");
          document.body.removeChild(div);
        });
      document.body.appendChild(div);
    }

    // RIS link
    const rislink = newtag(div, "a", "Download RIS");
    rislink.addEventListener("click", loadris);
    function loadris() {
      rislink.removeEventListener("click", loadris);
      fetch("https://dx.doi.org/" + doi, {
        headers: {
          "Accept": "application/x-research-info-systems"
        }})
        .then(response => response.text())
        .then(data => {
          const blob = new Blob([data], {type: "octet/stream"});
          const url = URL.createObjectURL(blob);
          rislink.href = url;
          rislink.download = doi.replace("/", "_") + ".ris";
          rislink.click();
        })
        .catch(error => {
          alert("Cannot download RIS.");
          rislink.addEventListener("click", loadris);
        });
    }

    newbr(div);newbr(div);

    // PDF link
    if (pdf === null && location.hostname.includes("sciencedirect")) {
      pdf = sessionStorage.getItem(doi);
      if (pdf === null) {
        const pdflink = newtag(div, "a", "PDF");
        pdflink.addEventListener("click",() => {if (!loadElsevierPDF()) alert("Failed to load PDF link");});
        newbr(div);newbr(div);
      }
    }
    if (pdf !== null) {
      const pdflink = newtag(div,"a","PDF");
      pdflink.href = pdf;
      newbr(div);newbr(div);
    }

    // Sci-Hub link
    const scihubURL = "https://sci-hub.st/";
    const scihublink = newtag(div, "a", "Sci-Hub");
    if (doi !== null) {
      scihublink.href = scihubURL + doi;
    } else {
      scihublink.href = scihubURL + location.href;
    }
    newbr(div);newbr(div);

    document.body.appendChild(div);

    function setStyleAndTooltip(v) {
      sty = v;
      stylink.setAttribute("tooltip", v === null ? "Reference style not set" : "Current style: " + v);
    }

    GM.getValue("sty", null).then(setStyleAndTooltip);
  }
})();
