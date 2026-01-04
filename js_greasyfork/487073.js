// ==UserScript==
// @name Tableの表をソート
// @description 開始行をAlt+左/Alt+右クリック：表を↑/↓順に並べ替え　縦罫線をドラッグ：左右に調節　Ctrl+ドラッグ：何でもリサイズ
// @match *://*/*
// @match file:///*.html
// @exclude *://*.2chan.net/*
// @noframes
// @version 0.1.8
// @run-at document-idle
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/487073/Table%E3%81%AE%E8%A1%A8%E3%82%92%E3%82%BD%E3%83%BC%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/487073/Table%E3%81%AE%E8%A1%A8%E3%82%92%E3%82%BD%E3%83%BC%E3%83%88.meta.js
// ==/UserScript==

(function() {

  const SORT_ASCENDING_ACTION = "Alt+0"; // Shift+ Alt+ Ctrl+ 0:左ボタン 1:中ボタン 2:右ボタン 3:X1ボタン 4:X2ボタン
  const SORT_DESCENDING_ACTION = "Alt+2";
  const GRABBABLE_WIDTH_PX = 8; // 機能２で縦罫線を掴める幅
  const DRAG_TARGET = "td,th"; // 左ドラッグで幅を動かせる要素
  const DRAG_TARGET_CTRL = "table,div,li,ul"; // Ctrl+左ドラッグで幅を動かせる要素
  const ADJUST_MARGIN = 1; // 1:Ctrl+縦ドラッグ時にmarginも動かす　0:無効 2025.07

  function dragTarget(e) { return !e.ctrlKey ? DRAG_TARGET : DRAG_TARGET_CTRL }

  String.prototype.match1 = function(re) { return this?.match(re)?.slice(1)?.find(Boolean) } // this./a(bc)|d(ef)/ 等の()でキャプチャした最初の１つを返す　gフラグ不可

  let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.some(v => v[1] === str)) return;
      var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" //      var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
      var d = Date.now()
      var uid = [...Array(12)].map(() => S[Math.floor((d + Math.random() * S.length) % S.length)]).join('')
      document.head.insertAdjacentHTML("beforeend", `<style id="${uid}">${str}</style>`);
      this.added.push([uid, str]);
      return uid;
    },
    remove: function(str) { // str:登録したCSSでもaddでreturnしたuidでも良い
      let uid = this.added.find(v => v[1] === str || v[0] === str)?.[0]
      if (uid) {
        document.querySelector(`#${uid}`)?.remove();
        this.added = this.added.filter(v => v[0] !== uid)
      }
    }
  }
  let ingrab = 0
  document.head.insertAdjacentHTML("beforeend", `<style>.tsMovingAttract{outline:1px solid #8800ffe0 !important;}.tsMovingAttract2{outline:2px solid #8800ffe0 !important;}</style>`)
  setSort();
  setDragCol();

  function setSort() {
    document?.body?.addEventListener("mousedown", e => {
      let key = (e?.shiftKey ? "Shift+" : "") + (e?.altKey ? "Alt+" : "") + (e?.ctrlKey ? "Ctrl+" : "") + e?.button;
      if (key == SORT_ASCENDING_ACTION || key == SORT_DESCENDING_ACTION) {
        //if (e?.target?.matches('table th,table thead td,table>tbody>tr:first-child>td')) {
        if (e?.target?.matches('table th,table td')) {
          let th = e?.target //?.closest('table th,table thead td,table tr:first-child td')
          let table = e?.target?.closest("table");

          e.stopPropagation()
          e.preventDefault()
          if (!table.querySelector('[rowspan],[colspan]')) {
            let body = table?.querySelector('tbody')
            let column = th?.cellIndex;

            //            [...table.querySelectorAll('td:not([data-sortkey])')].forEach(e => e.asnum = parseFloat(e?.textContent?.trim()?.replace(/(\d)\,(\d)/gm, "$1$2"))); // ^1,000$などの数値に関しては,を除去
            [...table.querySelectorAll('td:not([data-sortkey])')].filter(e => e?.textContent?.trim()?.match(/^[0-9\,\.]+$/gm)).forEach(e => {
              let asnum = parseFloat(e?.textContent?.trim()?.replace(/^(\d)\,(\d)$/gm, "$1$2"))
              if (!Number.isNaN(asnum)) e.asnum = asnum;
            }); // ^1,000$などの数値に関しては,を除去
            [...table.querySelectorAll('td:not([data-sortkey])')].forEach(e => { // セル内文字列が「abc100」「100」「100abc」「約100～」のどれかなら数値が主体のデータだろうと判断し数値データとして見る。「abc100abc」なら文字列と判断。,は無視。
              if (e?.textContent?.trim()?.match(/^[0-9\,\.\–\-]+\D+$|^[0-9\,\.\-\–]+$|^\D+[0-9\,\.\-\–]+$|^約\d+|^約?[0-9\,\.\-\–]+\D*[〜～]約?[0-9\,\.\-\–]+\D*$|^微量$/gm)) {
                let asnum = parseFloat(e?.textContent?.trim()?.replace(/–/gm, "-")?.replace(/(\d)\,(\d)/g, "$1$2")?.match1(/(\-?[0-9\,\.]+)/)) // なぜか「–」ダッシュをマイナスとして使うサイトもあるのでマイナスに置き換える
                if (e?.textContent?.trim() == "微量") asnum = 0.001;
                if (!Number.isNaN(asnum)) e.asnum = asnum;
              }
            })
            let startrow = Array.from(table.rows).findIndex(r => r.contains(e.target)); //alert(startrow)

            let col = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' })
            let rows = Array.from(table.rows).filter((e, i) => !(i == 0 && e.querySelector('th'))).slice(0, startrow).concat(
              //            let rows = Array.from(table.rows).slice(0, startrow).concat(
              key == SORT_ASCENDING_ACTION ?
              Array.from(table.rows).slice(startrow).sort((a, b) => a?.cells?.[column]?.asnum !== undefined && b?.cells?.[column]?.asnum !== undefined ? a?.cells?.[column]?.asnum == b?.cells?.[column]?.asnum ? 0 : a?.cells?.[column]?.asnum - b?.cells?.[column]?.asnum : col.compare(a?.cells?.[column]?.dataset?.sortkey || a?.cells?.[column]?.textContent?.trim(), b?.cells?.[column]?.dataset?.sortkey || b?.cells?.[column]?.textContent?.trim())) :
              Array.from(table.rows).slice(startrow).sort((a, b) => a?.cells?.[column]?.asnum !== undefined && b?.cells?.[column]?.asnum !== undefined ? a?.cells?.[column]?.asnum == b?.cells?.[column]?.asnum ? 0 : b?.cells?.[column]?.asnum - a?.cells?.[column]?.asnum : col.compare(b?.cells?.[column]?.dataset?.sortkey || b?.cells?.[column]?.textContent?.trim(), a?.cells?.[column]?.dataset?.sortkey || a?.cells?.[column]?.textContent?.trim()))
              //              Array.from(table.rows).slice(startrow).sort((a, b) => a?.cells?.[column]?.asnum && b?.cells?.[column]?.asnum ? a?.cells?.[column]?.asnum == b?.cells?.[column]?.asnum ? 0 : b?.cells?.[column]?.asnum - a?.cells?.[column]?.asnum : col.compare(b?.cells?.[column]?.textContent?.trim(), a?.cells?.[column]?.textContent?.trim()))
            )
            let fragment = new DocumentFragment(); // prependを使っても順番を維持するためにDocumentFragmentを使う
            rows.forEach(tr => fragment.appendChild(tr))
            body.prepend(fragment)
          } else {
            [...table.querySelectorAll('[colspan]')].forEach(e => {
              let c = e.getAttribute("colspan");
              e.removeAttribute("colspan");
              e.insertAdjacentHTML("afterend", "<td></td>".repeat(c - 1))
            });
            [...table.querySelectorAll('[rowspan]')].forEach(e => { e.removeAttribute("rowspan"); });
            [...table.querySelectorAll('tr')].filter(e => !e.hasChildNodes()).forEach(e => e.remove());
          }
          return false
        }
      }
    })
  }

  // Tableの縦罫線をドラッグで動かす
  function setDragCol() {
    document.addEventListener('mousedown', startResize);
    document.addEventListener('mousemove', function f(e) {
      let pare = e?.target?.nodeType == 1 && e?.target?.closest(dragTarget(e))
      if (pare && (e.clientX - pare.getBoundingClientRect().right > -GRABBABLE_WIDTH_PX)) {
        //if (document.body.style.cursor != 'col-resize') document.body.style.cursor = 'col-resize';
        !f?.done && addstyle.add(`${DRAG_TARGET},${DRAG_TARGET_CTRL} {cursor:col-resize !important;}`);
        f.done = 1;
      } else {
        //if (!ingrab && document.body.style.cursor != 'default') document.body.style.cursor = 'default'
        f?.done && addstyle.remove(`${DRAG_TARGET},${DRAG_TARGET_CTRL} {cursor:col-resize !important;}`);
        f.done = 0;
      }
    });

    function startResize(e) {
      //let pare = e?.target?.nodeType == 1 && e?.target?.closest(dragTarget(e))
      if (e?.target?.nodeType != 1) return;
      let pare = (e?.ctrlKey && e?.target?.matches("td,th,tr") && e?.target?.closest("table")) || e.target.closest(dragTarget(e))
      if (!pare) return;
      if (pare?.getBoundingClientRect()?.right - e?.clientX > GRABBABLE_WIDTH_PX) return;
      if (e?.target?.matches(".pEmbedYT")) return;

      e.preventDefault();
      e.stopPropagation();
      let startX = e.clientX;
      let startY = e.clientY;
      let startWidth = parseFloat(getComputedStyle(pare).getPropertyValue('width'));
      [...pare.querySelectorAll(':is(TR , TH , TD , LI)')].forEach(cell => {
        cell.dataset.tspadding = (parseFloat(getComputedStyle(cell).getPropertyValue('padding-top')) + parseFloat(getComputedStyle(cell).getPropertyValue('padding-bottom'))) / 2;
      });
      if (ADJUST_MARGIN) {
        [...pare.querySelectorAll(':is(*)')].forEach(cell => {
          cell.dataset.tsmargin = (parseFloat(getComputedStyle(cell).getPropertyValue('margin-top')) + parseFloat(getComputedStyle(cell).getPropertyValue('margin-bottom'))) / 2;
          cell.dataset.tslineheight = window.getComputedStyle(cell).lineHeight === 'normal' ? parseFloat(window.getComputedStyle(cell).fontSize) * 1.2 : parseFloat(window.getComputedStyle(cell).lineHeight) //(parseFloat(getComputedStyle(cell).getPropertyValue('line-height')));console.log(getComputedStyle(cell).getPropertyValue('line-height'))
        });
      }
      var orgLineHeight = window.getComputedStyle(pare).lineHeight?.match0(/([\d\.]*)px/);
      //pare.dataset.tslineheight=window.getComputedStyle(pare).lineHeight?.match0(/([\d\.]*)px/);
      ingrab = 1;
      document.addEventListener('mousemove', dragColumn);
      document.addEventListener('mouseup', endDrag);
      return false;

      function dragColumn(em) {
        //let pare=e.target.closest(dragTarget(e))
        let movedY = startY - em.clientY;
        let offsetY = ((movedY) - Math.sign(movedY) * Math.min(32, Math.abs(movedY))) / 16; // 縦に32ピクセル以上動いたらセルの縦paddingも調節する
        if (offsetY != 0) {
          pare.classList.add("tsMovingAttract2");
          if (ADJUST_MARGIN) {
            [...pare.querySelectorAll('*')].forEach(e => {
              e.style.lineHeight = `${+e.dataset.tslineheight + offsetY}px`;
              e.classList.add("tsMovingAttract2");
            })
          } else pare.style.lineHeight = `${+orgLineHeight + offsetY}px !important`;
          //          setTimeout(pare => pare?.classList?.remove("tsMovingAttract2"), 17, pare)
        }
        setTimeout(() => [...document.querySelectorAll('.tsMovingAttract2')].forEach(e => e?.classList?.remove("tsMovingAttract2")), 17)
        if (["TD", "TH"].includes(pare.tagName)) {
          [...pare.closest("table").querySelectorAll(`:is(td,th):nth-child(${pare.cellIndex + 1})`)].forEach(cell => {
            cell.style.width = `${startWidth + em.clientX - startX}px`;
            cell.style.overflowWrap = "anywhere";
            //cell.style.whiteSpace = "break-spaces";
            cell.style.whiteSpace = "initial";
            cell.style.wordWrap = "break-word";
            cell.style.minWidth = `0px`;
            cell.style.maxWidth = `${Number.MAX_SAFE_INTEGER}px`;
          })
        } else {
          pare.style.resize = "both";
          pare.style.overflow = "auto"
          pare.style.width = `${startWidth + em.clientX - startX}px`;
          pare.style.minWidth = `0px`;
          pare.style.maxWidth = `${Number.MAX_SAFE_INTEGER}px`;

          [...pare.querySelectorAll(':is(TR , TH , TD , LI)')].forEach(cell => {
            offsetY != 0 && cell.classList.add("tsMovingAttract");
            //          setTimeout(() => cell?.classList?.remove("tsMovingAttract"), 17, cell)
            cell.style.paddingTop = `${+cell.dataset.tspadding + offsetY}px`;
            cell.style.paddingBottom = `${+cell.dataset.tspadding + offsetY}px`;
          });

          if (ADJUST_MARGIN) {
            [...pare.querySelectorAll(':is(*)')].forEach(cell => {
              offsetY != 0 && cell.classList.add("tsMovingAttract");
              if (+cell.dataset.tsmargin + offsetY > 0) {
                cell.style.marginTop = `${+cell.dataset.tsmargin + offsetY}px`;
                cell.style.marginBottom = `${+cell.dataset.tsmargin + offsetY}px`
              };
            });
          }
          setTimeout(() => [...document.querySelectorAll('.tsMovingAttract')].forEach(e => e?.classList?.remove("tsMovingAttract")), 17)

        }
      }

      function endDrag() {
        document.removeEventListener('mousemove', dragColumn);
        document.removeEventListener('mouseup', endDrag);
        ingrab = 0;
        pare.querySelectorAll('[data-tspadding]').forEach(e => delete e.dataset.tspadding);
        if (ADJUST_MARGIN) {
          pare.querySelectorAll('[data-tsmargin]').forEach(e => delete e.dataset.tsmargin);
          pare.querySelectorAll('[data-tslineheight]').forEach(e => delete e.dataset.tslineheight);
        }
        //pare.querySelectorAll('[data-tslineheight').forEach(e => delete e.dataset.tslineheight);
      };
    }
  }

  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function ctLong(callback, name = "test", time = 10) { console.time(name); for (let i = time; i--;) { callback() } console.timeEnd(name) } // 速度測定（もともと長くかかるもの）
  function ct(callback, name = "test", time = 10) { let i = 0; let st = Date.now(); while (Date.now() - st < 1000) { i++, callback() } console.log(`${name} ${i}回実行 / 1sec , ${1000/i}ミリ秒/１実行 ${callback.toString().replace(/\n+|\s+/gm," ").slice(0,77)}`) } // 速度測定（一瞬で終わるもの）

})();