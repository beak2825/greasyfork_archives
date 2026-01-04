// ==UserScript==
// @name         Wikipedia Extender
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.17
// @license      GNU AGPLv3
// @author       jcunews
// @description  Adds: sidebar toggle bar (click on blue vertical separator bar), auto collapsing sticky floating table of contents at top left (hover mouse on it to expand), collapsible sections (click section title to toggle), section links (for getting URL to page sections), auto popup sticky table headers (when table height is longer than the screen), table manipulations (double click empty space of a table cell to show menu).
// @match        *://*.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381474/Wikipedia%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/381474/Wikipedia%20Extender.meta.js
// ==/UserScript==

(() => {

  //*** CONFIGURATION BEGIN ***

  //Set to `true` to automatically hide the Wikipedia sidebar.
  var autohideSidebar = false;

  //*** CONFIGURATION END ***

  var sty = document.head.appendChild(document.createElement("STYLE")), eContent = document.querySelector("#content"), mwp = window["mw-panel"];

  //*** add sidebar toggle bar ***

  if (mwp) {
    //init sidebar bar
    sty.textContent += `
#mw-panel {overflow:hidden!important}
#sbt {position:absolute; margin-top:-1px; width:6px; background:#adf; cursor:pointer}`;
    var sbt = document.createElement("DIV");
    sbt.id = "sbt";
    sbt.onclick = () => {
      if (!mwp.style.display) { //hide
        mwp.style.display = "none";
        sbt.style.left = "0";
        eContent.style.marginLeft = "5px";
      } else { //unhide
        mwp.style.display = "";
        sbt.style.left = (mwp.offsetWidth + 3) + "px";
        eContent.style.marginLeft = "";
      }
      sbt.style.height = eContent.offsetHeight + "px";
      updateTableHeadersX();
      updateTableHeadersPos();
    };

    var t = new Date;
    function updSidebarBarPos() {
      if (eContent.offsetLeft > 8) {
        sbt.style.left = eContent.offsetLeft + "px";
      } else setTimeout(updSidebarBarPos, 100);
      sbt.style.height = eContent.offsetHeight + "px";
    }

    if (window.toctogglecheckbox && /enwikihidetoc=1/.test(document.cookie)) {
      toctogglecheckbox.addEventListener("change", updSidebarBarPos);
      (function waitTocHidden() {
        if (toctogglecheckbox.checked) {
          updSidebarBarPos()
        } else setTimeout(waitTocHidden, 100);
      })();
    }
    eContent.parentNode.insertBefore(sbt, eContent);
    addEventListener("resize", updSidebarBarPos);
    let ts = Date.now();
    (function usbp() {
      updSidebarBarPos();
      if ((Date.now() - ts) < 1000) setTimeout(usbp, 200)
    })();

    if (autohideSidebar) {
      setTimeout(() => {
        sbt.click()
      }, 20);
    }

  }

  //*** end: add sidebar toggle bar ***


  //*** add floating table of contents ***

  //add sticky toc, if has toc
  var stoc, ele = window.toc;
  if (ele && (ele.childElementCount > 1)) {
    sty.textContent += `
#toc.sticky {position:fixed; z-index:10; left:0; top: 0; padding:0 .5ex; background:#f9f9f9; white-space:nowrap; font-family:sans-serif; font-size:10pt}
#toc.sticky #toctitle {margin:.3ex 0 .2ex 0}
#toc.sticky #toctitle h2 {font-family:sans-serif}
#toc.sticky > ul {display:none; margin-bottom:0; max-height:${innerHeight - eContent.offsetTop - 30}px; padding-right:3ex}
#toc.sticky:hover #toctitle {width:auto}
#toc.sticky:hover > ul {display:block; overflow-y:auto}`;
    (stoc = ele.cloneNode(true)).classList.add("sticky");
    (ele = stoc.querySelector(".toctogglespan")) && ele.remove();
    document.body.appendChild(stoc);
  }

  //*** end: add floating table of contents ***


  //*** add collapsible sections and section links ***

  //add section toggle on section headlines. and add permalink if possible
  var a, b, c;

  function toggleSection() {
    var ele = this.parentNode, htyp = ele.matches('div.mw-heading') ? ele.firstElementChild.tagName : ele.tagName, exp;
    if (this.classList.contains("expanded")) {
      this.classList.remove("expanded");
      this.classList.add("collapsed");
      exp = false;
    } else {
      this.classList.remove("collapsed");
      this.classList.add("expanded");
      exp = true;
    }
    ele = ele.nextElementSibling;
    while (ele) {
      if (ele.matches('div.mw-heading')) {
        if ((ele.firstElementChild.tagName[0] === "H") && (ele.firstElementChild.tagName[1] <= htyp[1])) break;
      } else if (((ele.tagName[0] === "H") && (ele.tagName[1] <= htyp[1])) || ele.matches('div.navbox')) break;
      if (exp) {
        ele.style.display = ele.getAttribute("od_");;
        ele.removeAttribute("od_");
      } else {
        ele.setAttribute("od_", ele.style.display);
        ele.style.display = "none";
      }
      ele = ele.nextElementSibling;
    }
    updateTableHeadersPos();
    dispatchEvent(new Event("resize"))
  }

  sty.textContent += `.mw-headline,.mw-heading>:is(h1,h2,h3,h4).expanded:after{content:" \\23f6"}
.mw-headline,.mw-heading>:is(h1,h2,h3,h4).collapsed:after{content:" \\23f7"}
.mw-headline,.mw-heading>:is(h1,h2,h3,h4):hover {background:#ddf; cursor:pointer}`;
  document.querySelectorAll('.mw-headline,.mw-heading>:is(h1,h2,h3,h4)').forEach(a => {
    a.classList.add("expanded");
    a.onclick = toggleSection;
    if (c = a.id ? a.id : (a.name ? a.name : "")) {
      (b = document.createElement("SPAN")).className = "mw-editsection";
      b.innerHTML = `<span class="mw-editsection-bracket">[</span><a href="${location.href.split("#")[0] + "#" + c}" title="Link to this section">link</a><span class="mw-editsection-bracket">]</span>`;
      a.parentNode.appendChild(b);
    }
  });

  //*** end: add collapsible sections and section links ***


  //*** add sticky table headers ***

  var headers = [], headersCount;

  //sticky table header functions
  function cssPxValToNumber(s) {
    return parseInt(s.match(/^(\d+)/)[1]);
  }

  function getDocumentXY(ele) {
    var a = [ele.offsetLeft, ele.offsetTop];
    ele = ele.offsetParent;
    while(ele) {
      a[0] += ele.offsetLeft;
      a[1] += ele.offsetTop;
      ele = ele.offsetParent;
    }
    return a;
  }

  function updateTableDimensions(hdr) {
    var i, j, k, l, lc, css, tbl = hdr.table, tc = tbl.rows[0].cells, scrLeft = document.documentElement.scrollLeft;
    css = getComputedStyle(tc[0]);
    k = (cssPxValToNumber(css.borderLeftWidth) + cssPxValToNumber(css.borderRightWidth) + cssPxValToNumber(css.paddingLeft) + cssPxValToNumber(css.paddingRight)) + 1;
    hdr.style.width = tbl.offsetWidth + "px";
    hdr.style.height = tc[0].offsetHeight + "px";
    lc = (l = Array.from(hdr.rows[0].cells)).length;
    l.forEach((c, j) => c.style.width = (tc[j].offsetWidth - k + ((j * 2) >= lc ? 1 : 0)) + "px");
    j = getDocumentXY(tbl);
    hdr.absLeft = j[0];
    hdr.absTop = j[1];
    hdr.absRight = (hdr.absLeft + tbl.offsetWidth) - hdr.offsetWidth;
    j = tbl.rows;
    l = j.length;
    k = j[l - 1].cells;
    hdr.absBottom = (hdr.absTop + tbl.offsetHeight) - ((k[k.length - 1].tagName === "TH") && (l >= 3) ? k[0].offsetHeight + j[l - 2].cells[0].offsetHeight : 0) - hdr.offsetHeight;
  }

  function updateTableHeadersX() {
    var scrLeft = document.documentElement.scrollLeft;
    headers.forEach(h => {
      updateTableDimensions(h);
      h.style.left = (h.absLeft - scrLeft - 1) + "px";
    });
//    dispatchEvent(new Event("resize"))
  }

  function updateTableHeadersPos() {
    var scrLeft = document.documentElement.scrollLeft, scrTop = document.documentElement.scrollTop;
    headers.forEach(h => {
      if ((scrTop > h.absTop) && (scrTop < h.absBottom)) {
        h.style.display = "";
        h.style.left = (h.absLeft - scrLeft - 1) + "px";
      } else h.style.display = "none";
    });
    updateTableHeadersX();
    dispatchEvent(new Event("resize"))
  }

  function tableHeaderClick(ev) {
    if (ev.target.className !== "headerSort") return;
    this.table.rows[0].cells[ev.target.cellIndex].click();
    Array.from(this.rows[0].cells).forEach(c => c.className = this.table.rows[0].cells[c.cellIndex].className);
  }

  //add sticky table headers for any table
  (function addStickyTblHdr() {
    var a, tables = document.querySelectorAll(".wikitable"), i, tbl, hdr, j, css, k, l = tables.length;
    if (!tables.length) return;
    tables.forEach((tbl, i) => {
      if ((tbl.rows[0].cells.length < 2) || (tbl.rows[0].cells[1].tagName !== "TH")) return;
      (hdr = document.createElement("TABLE")).sticky = true;
      hdr.table = tbl;
      tbl.hdr = hdr;
      Array.from(tbl.attributes).forEach(a => hdr.setAttribute(a.name, a.value)); //copy table attributes
      hdr.id = "";
      hdr.style.cssText = tbl.style.cssText + ";position:absolute;z-index:9;margin:" + getComputedStyle(tbl).margin + ";border:2px solid#000;width:" + tbl.offsetWidth + "px;height:" + (tbl.rows[0].cells[0].offsetHeight + 2) + "px;table-layout:fixed";
      a = tbl.rows[0].outerHTML; //first header row
      if (tbl.rows[1] && tbl.rows[1].lastElementChild && (tbl.rows[1].lastElementChild.tagName === "TH")) a += tbl.rows[1].outerHTML; //second header row
      hdr.innerHTML = a;
      headers.push(tbl.parentNode.insertBefore(hdr, tbl));
      updateTableDimensions(hdr);
      hdr.style.display = "none";
      hdr.style.position = "fixed";
      hdr.style.top = "0";
      hdr.style.margin = "0";
      hdr.addEventListener("click", tableHeaderClick);
    });
    headersCount = headers.length;
    updateTableHeadersPos();
    addEventListener("scroll", updateTableHeadersPos);
    addEventListener("resize", updateTableHeadersX);
  })();

  //*** end: add sticky table headers ***


  //*** add table manipulations ***

  var tcp = document.createElement("DIV"), tcpWid, tcpHei;

  function sortTable(table, colidx, numeric, start, count) {

    function sort2(func, start, count) {
      if (!func || !table.childElementCount) return;
      var tbl = table.children[0], ar, tmp, i;
      while (tbl && (tbl.tagName !== "TBODY")) tbl = tbl.nextElementSibling;
      if (!tbl.rows.length) return;
      if (isNaN(start)) start = tbl.rows[0].cells.length && (tbl.rows[0].cells[0].tagName === "TH") ? 1 : 0;
      if (start < 0) start = 0;
      if (isNaN(count) || (count <= 0)) count = tbl.rows.length - start;
      if (count === table.rows.length) {
        ar = Array.from(tbl.rows);
      } else ar = Array.from(tbl.rows).splice(start, count);
      ar.sort(func);
      tmp = document.createElement("TBODY");
      for (i = 0; i < start; i++) tmp.appendChild(tbl.rows[i].cloneNode(true));
      for (i = 0; i < ar.length; i++) tmp.appendChild(ar[i].cloneNode(true));
      for (i = (start + count); i < tbl.rows.length; i++) tmp.appendChild(tbl.rows[i].cloneNode(true));
      table.replaceChild(tmp, tbl);
    }

    function stripComma(s) {
      var a = s.valueOf(), b = a.lastIndexOf(",");
      while (b > 0) {
        a = a.substr(0, b) + a.substr(b + 1, 99);
        b = a.lastIndexOf(",");
      }
      return a;
    }

    if (isNaN(colidx) || (colidx < 0)) colidx = 0;
    sort2(function(i1, i2) {
      var t1, t2, n1, n2;
      if (i1.cells.length > colidx) {
        t1 = i1.cells[colidx].textContent
      } else t1 = "";
      if (i2.cells.length > colidx) {
        t2 = i2.cells[colidx].textContent
      } else t2 = "";
      if (numeric) {
        n1 = parseFloat(stripComma(t1));
        n2 = parseFloat(stripComma(t2));
        if (!isNaN(n1)) {
          return isNaN(n2) ? -1 : n1 - n2;
        } else if (!isNaN(n2)) return 1;
      }
      t1 = t1.toLowerCase();
      t2 = t2.toLowerCase();
      if (t1 < t2) {
        return -1
      } else if (t1 > t2) {
        return 1
      } else return 0;
    }, start, count);
  }

  function docClick(ev) {
    var a, ele = ev.target, table, rows, cell, rowStart, rowEnd, rowCount;
    if ((ev.target === tcp) || !tcp.parentNode) return;
    table = tcp.table;
    rows = table.rows;
    cell = tcp.cell;
    hdrRow = table.hdr.rows[0];
    tcp.style.opacity = ".666";
    tcp.cell.style.background = tcp.cell.style.backgroundz ? tcp.cell.style.backgroundz : "";
    if (a = ele.attributes["tcpcmd"]) { //command element
      rowStart = 0;
      while (rows[rowStart].cells[rows[rowStart].cells.length - 1].tagName === "TH") rowStart++;
      rowEnd = rows.length - 1;
      while (rows[rowEnd].cells[rows[rowEnd].cells.length - 1].tagName === "TH") rowEnd--;
      rowCount = rowStart + rowEnd + 1;
      setTimeout(() => {
        var i, j, ci = cell.cellIndex, txt = cell.textContent.trim().toLowerCase(), cnt = 0;
        switch(a.value) {
        case "SortCol":
          sortTable(table, cell.cellIndex, false, rowStart, rowCount);
          break;
        case "SortColNum":
          sortTable(table, cell.cellIndex, true, rowStart, rowCount);
          break;
        case "MoveColFirst":
          if (ci === 0) break;
          Array.from(rows).forEach((r, z) => {
            try {
              r.insertBefore(r.cells[ci], r.cells[0]);
            } catch(z) {}
          });
          hdrRow.insertBefore(hdrRow.cells[ci], hdrRow.cells[0]);
          break;
        case "MoveColLeft":
          if (ci === 0) break;
          Array.from(rows).forEach((r, z) => {
            try {
              r.insertBefore(r.cells[ci], r.cells[ci - 1]);
            } catch(z) {}
          });
          hdrRow.insertBefore(hdrRow.cells[ci], hdrRow.cells[ci - 1]);
          break;
        case "MoveColRight":
          if (ci === (rows[0].cells.length - 1)) break;
          Array.from(rows).forEach((r, z) => {
            try {
              r.insertBefore(r.cells[ci], r.cells[ci + 2]);
            } catch(z) {}
          });
          hdrRow.insertBefore(hdrRow.cells[ci], hdrRow.cells[ci + 2]);
          break;
        case "MoveColLast":
          if (ci === (rows[0].cells.length - 1)) break;
          Array.from(rows).forEach((r, z) => {
            try {
              r.appendChild(r.cells[ci]);
            } catch(z) {}
          });
          hdrRow.appendChild(hdrRow.cells[ci]);
          break;
        case "HidCol":
          Array.from(rows).forEach((r, z) => {
            try {
              r.cells[ci].style.display = "none";
            } catch(z) {}
          });
          hdrRow.cells[ci].style.display = "none";
          break;
        case "HidRow":
          cell.parentNode.style.display = "none";
          break;
        case "HidRowSamTxt":
          for (i = rowEnd; i >= rowStart; i--) {
            try {
              if ((rows[i].cells[ci].textContent.trim().toLowerCase() === txt) && (rows[i].style.display !== "none")) cnt++;
            } catch(z) {}
          }
          if (!confirm("Hide " + cnt + " matching rows?")) break;
          for (i = rowEnd; i >= rowStart; i--) {
            try {
              if (rows[i].cells[ci].textContent.trim().toLowerCase() === txt) rows[i].style.display = "none";
            } catch(z) {}
          }
          break;
        case "HidRowConTxt":
          txt = prompt("Enter search text.", txt);
          if (txt === null) break;
          if (txt === "") {
            alert("Search text can not be empty.");
            break;
          }
          for (i = rowEnd; i >= rowStart; i--) {
            try {
              if ((rows[i].cells[ci].textContent.trim().toLowerCase().indexOf(txt) >= 0) && (rows[i].style.display !== "none")) cnt++;
            } catch(z) {}
          }
          if (!confirm("Hide " + cnt + " matching rows?")) break;
          for (i = rowEnd; i >= rowStart; i--) {
            try {
              if (rows[i].cells[ci].textContent.trim().toLowerCase().indexOf(txt) >= 0) rows[i].style.display = "none";
            } catch(z) {}
          }
          break;
        case "HidRowNotSamTxt":
          for (i = rowEnd; i >= rowStart; i--) {
            try {
              if ((rows[i].cells[ci].textContent.trim().toLowerCase() !== txt) && (rows[i].style.display !== "none")) cnt++;
            } catch(z) {}
          }
          if (!confirm("Hide " + cnt + " matching rows?")) break;
          for (i = rowEnd; i >= rowStart; i--) {
            try {
              if (rows[i].cells[ci].textContent.trim().toLowerCase() !== txt) rows[i].style.display = "none";
            } catch(z) {}
          }
          break;
        case "HidRowNotConTxt":
          txt = prompt("Enter search text.", txt);
          if (txt === null) break;
          if (txt === "") {
            alert("Search text can not be empty.");
            break;
          }
          for (i = rowEnd; i >= rowStart; i--) {
            try {
              if ((rows[i].cells[ci].textContent.trim().toLowerCase().indexOf(txt) < 0) && (rows[i].style.display !== "none")) cnt++;
            } catch(z) {}
          }
          if (!confirm("Hide " + cnt + " matching rows?")) break;
          for (i = rowEnd; i >= rowStart; i--) {
            try {
              if(rows[i].cells[ci].textContent.trim().toLowerCase().indexOf(txt) < 0) rows[i].style.display = "none";
            } catch(z) {}
          }
          break;
        case "UnhideAll":
          for (i = rows.length - 1; i >= 0; i--) {
            for (j = rows[i].cells.length - 1; j >= 0; j--) {
              try {
                rows[i].cells[j].style.display = "";
              } catch(z) {}
            }
            try {
              rows[i].style.display = "";
            } catch(z) {}
          }
          for (j = hdrRow.cells.length - 1; j >= 0; j--) {
            try {
              hdrRow.cells[j].style.display = "";
            } catch(z) {}
          }
          break;
        case "ExpToCsv":
          a = false;
          (b = document.createElement("A")).href = "data:text/comma-separated-values;charset=utf-8;base64," + btoa(
            encodeURIComponent(Array.from(rows).reduce((p, r, i, ar) => {
              if (!r.cells.length) return p;
              if (r.cells[r.cells.length - 1].tagName === "TD") {
                a = true;
              } else if (a) return p;
              p.push(Array.from(r.cells).map((c, t) => {
                t = c.textContent.replace(/^\s+|\s+$/g, "");
                if (!(/[",]/).test(t)) {
                  return t;
                } else return '"' + t.replace(/"/g, '""') + '"';
              }));
              return p;
            }, []).join("\n") + "\n").replace(/%([0-9A-F]{2})/g, (m, p) => String.fromCharCode('0x' + p))
          );
          b.download = "table.csv";
          b.style.display = "none";
          document.body.appendChild(b).click();
          b.remove();
          break;
        }
        updSidebarBarPos();
        updateTableHeadersX();
      }, 0);
    }
    tcp.parentNode.removeChild(tcp);
    tcp.style.opacity = 0;
  }

  function getNewBgColor(ele) {
    var clr = getComputedStyle(ele).backgroundColor, r, g, b, rx;
    while (clr === "transparent") {
      ele = ele.parentNode;
      if (!ele) return "#dfd";
      clr = getComputedStyle(ele).backgroundColor;
    }
    rx = clr.match(/rgb\((\d+), (\d+), (\d+)\)/i);
    if(!rx) {
      rx = clr.match(/#([0-9a-f])([0-9a-f])([0-9a-f])/i);
      if (rx) {
        rx[1] = parseInt(rx[1], 16);
        rx[2] = parseInt(rx[2], 16);
        rx[3] = parseInt(rx[3], 16);
      } else return "#dfd";
    }
    if ((rx[2] > rx[1]) && (rx[2] > rx[3])) return "#fdd";
    return "#dfd";
  }

  function showTableCtrlPanel(ev) {
    var cell = ev.target, tbl, tblX, tblY, rows, cells, row, cellX, cellY, cellWidth, cellHeight, hdrTop, hdrBottom, pos, posDelta;
    while (!(/^(TH|TD)$/).test(cell.tagName)) {
      cell = cell.parentNode;
      if (!cell) return;
    }
    rows = (tbl = (row = cell.parentNode).parentNode.parentNode).rows;
    cells = rows[0].cells;
    if (tbl.sticky || !tbl.tHead || !tbl.tHead.childElementCount) return;
    tblX = tbl.offsetLeft;
    tblY = tbl.offsetTop;
    cellX = cell.offsetLeft;
    cellY = cell.offsetTop;
    cellWidth = cell.offsetWidth;
    cellHeight = cell.offsetHeight;
    cell.style.background = getNewBgColor(cell);
    tcp.table = tbl;
    tcp.cell = cell;
    hdrTop = cells[0].tagName === "TH";
    hdrBottom = cells[cells.length - 1].tagName === "TH";
    tcp.info.textContent = "Row " + (row.rowIndex + 1) + "/" + rows.length + ", Cell " + (cell.cellIndex + 1) + "/" + row.cells.length + ", " + (hdrTop ? (hdrBottom ? "Top+Bottom" : "Top") : (hdrBottom ? "Bottom" : "No")) + " Header";
    tbl.parentNode.insertBefore(tcp, tbl);
    if (tcp.style.opacity === "0") {
      tcpWid = tcp.offsetWidth;
      tcpHei = tcp.offsetHeight;
    }
    pos = tblX + cellX + Math.floor(cellWidth / 2);
    tcp.style.left = pos + "px";
    posDelta = (getDocumentXY(tcp)[0] + tcpWid - scrollX) - innerWidth;
    if (posDelta > 0) tcp.style.left = ((innerWidth + (posDelta - tcpWid)) >= tcpWid ? pos - tcpWid : pos - posDelta) + "px";
    pos = tblY + cellY + cellHeight;
    tcp.style.top = pos + "px";
    posDelta = (getDocumentXY(tcp)[1] + tcpHei - scrollY) - innerHeight;
    if (posDelta > 0) tcp.style.top = ((innerHeight + (posDelta - tcpHei - cellHeight)) >= tcpHei ? pos - tcpHei - cellHeight : pos - posDelta) + "px";
    tcp.style.opacity = "";
  }

  sty.textContent += `
#tcp {position:absolute; z-index:999; border:1px solid; background:#c3d4e5}
#tcp div {border-bottom:1px solid; padding:0 4px; background: ddd; white-space:nowrap}
#tcp a {display:block; padding:0 4px; white-space:nowrap; text-decoration:none}
#tcp a:hover {background:#def}
#tcp hr {margin:0}`;
  tcp.id = "tcp";
  tcp.style.opacity = 0;
  tcp.innerHTML = `<div></div>
<a tcpcmd="SortCol" href="javascript:void(0)">Sort column</a>
<a tcpcmd="SortColNum" href="javascript:void(0)">Sort column (numeric)</a>
<hr />
<a tcpcmd="MoveColFirst" href="javascript:void(0)">Move column to leftmost</a>
<a tcpcmd="MoveColLeft" href="javascript:void(0)">Move column to left</a>
<a tcpcmd="MoveColRight" href="javascript:void(0)">Move column to right</a>
<a tcpcmd="MoveColLast" href="javascript:void(0)">Move column to rightmost</a>
<hr />
<a tcpcmd="HidCol" href="javascript:void(0)">Hide column</a>
<hr />
<a tcpcmd="HidRow" href="javascript:void(0)">Hide row</a>
<a tcpcmd="HidRowSamTxt" href="javascript:void(0)">Hide row if cell has same text</a>
<a tcpcmd="HidRowConTxt" href="javascript:void(0)">Hide row if cell contains...</a>
<a tcpcmd="HidRowNotSamTxt" href="javascript:void(0)">Hide row if cell doesn't have same text</a>
<a tcpcmd="HidRowNotConTxt" href="javascript:void(0)">Hide row if cell doesn't contain...</a>
<hr />
<a tcpcmd="UnhideAll" href="javascript:void(0)">Unhide All Hidden Rows/Columns</a>
<hr />
<a tcpcmd="ExpToCsv" href="javascript:void(0)">Export to CSV</a>`;
  tcp.info = tcp.firstElementChild;
  tcp.onclick = docClick;
  document.addEventListener("click", docClick);
  document.addEventListener("dblclick", showTableCtrlPanel);

  //*** end: add table manipulations ***

})();
