// ==UserScript==
// @name         PCR图书馆辅助计算器
// @namespace    http://tampermonkey.net/

// @version      2.70.2
// @description  辅助计算PCR手游的所需体力，总次数
// @author       winrey,colin,hymbz
// @license      MIT
// @icon         https://pcredivewiki.tw/static/images/unit/icon_unit_108831.png
// @supportURL   https://github.com/winrey/pcr-wiki-helper/issues
// @homepage     https://github.com/winrey/pcr-wiki-helper
// @run-at       document-start
// @connect      cdn.jsdelivr.net
// @match        *://pcredivewiki.tw/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setClipboard
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.info
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/winrey/pcr-wiki-helper@eea66a67d2a0f3794d905fd6447b66329dc34d2e/js/solver.js
// @downloadURL https://update.greasyfork.org/scripts/422157/PCR%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%BE%85%E5%8A%A9%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/422157/PCR%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%BE%85%E5%8A%A9%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = time => new Promise(r => setTimeout(r, time));

  $(document).ready(function () {
    GM_addStyle(`
.helper--calc-result-cell.helper--show-deleted-btn::after {
  content: '\u2716';
  position: absolute;
  bottom: 70px;
  background-color: #ff0000;
  color: #fff;
  line-height: 0.9rem;
  border-radius: 30%;
  padding: 3px;
  opacity: 50%;
  cursor: pointer;
  z-index: 10000;
}
.helper--calc-result-cell.helper--show-deleted-btn.multiSelect-no::after {
  content: '\u00A0\u00A0\u00A0';
}
.helper--calc-result-cell.helper--show-deleted-btn.multiSelect-yes::after {
  content: '\u2714';
}
.mapDrop-table .helper-oddTri {
    right: .3rem;
    top: 1.6rem;
    color: black;
}
.mapDrop-table .helper--calc-result-cell{
    width: 70px;
    height: 70px;
    margin: 0 auto;
    position: relative;
}
.mapDrop-table .helper--calc-result-cell.un--wanted{
 opacity: 0.4;
}
.mapDrop-table .helper-block {
    top: 1.6rem;
    right: .12rem;
}
#helper--bottom-btn-group {
  position: fixed;
  right: calc(60px + 1% - 2px);
  bottom: 90px;
  overflow: visible;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.helper--nav-to-level.helper--important::after {
  content: "独";
  color: #e60c0c;
  font-size: .5em;
  position: relative;
  top: -0.8em;
}
span.dropsProgress.hide{
display: none;
}
#helper--modal-content:not(.helper--drop) input[item-name], #helper--modal-content:not(.helper--drop) input[orig-item-name] {
    display: none;
}
#helper--modal-content input[item-name], #helper--modal-content input[orig-item-name]{
    width: 6em;    
}
a.singleSelect{
  display: none
}
a.singleSelect.ready{
  display: inline
}
.switch-multiSelectBtnState {
    display: none;
    width: 70px;
    height: 32px;
    border: solid 2px #ddd;
    border-radius: 30px;
    background-color: #FFF;
    position: relative;
    padding-left: 2.6rem;
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
    -webkit-user-select: none;
    font-size: 14px;
    left: 5.1rem;
}
.switch-multiSelectBtnState.ready {
    display: inline;
}
.switch-handler.ready{
    display: inline-block;
}
.switch-multiSelectBtnState.selected-completedBtn{
    pointer-events: none;
}
.switch-multiSelectBtnState::before {
    right: 4rem;
    content: '多选';
    position: absolute;
    width: 2rem;
    font-size: 15px;
    top: -0.1rem;
    margin-right: -1rem;
    transition: width 0s 0s,margin-right .3s ,top 0.3s,content 0s 1s;
}
.switch-multiSelectBtnState.active.selected-completedBtn::before {
    right: 3rem;
    content: '已选完成';
    font-size: 14px;
    top: -0.08rem;
    margin-right: 0rem;
    border-radius: 11%;
    width: 4rem;
    border: 2px outset #f5d68e;
    pointer-events: all;
    line-height: 15.9px;
    transition: box-shadow 0.3s
}
.switch-multiSelectBtnState.selected-completedBtn:hover::before {
    box-shadow: -0.7px 1px 5.1px #000;
}
.switch-handler {
    position: relative;
    left: 2.5rem;
    top: 0.25rem;
    width: 1rem;
    height: 1rem;
    background-color: #FFF;
    border-radius: 100% 100%;
    -webkit-box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.52);
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.52);
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    display: none;
}
.switch-multiSelectBtnState.active {
    border-color: #4cd964;
    background-color: #4cd964;
}
.switch-handler.ready.active {
    left: 3.9rem;
}
.switch-handler::after {
    color: #000000;
    content: '关';
    position: relative;
    bottom: 0.25rem;
    left: -0.6rem;
    padding-left: 1rem;
    -webkit-transition: color .3s 0.1s;
}
.switch-handler.active::after {
    content: '   ';
    color: #fff0;
    position: relative;
    left: -4rem;
}
.switch-handler.active::before {
    content: '开';
    color: #f5f5f5;
    right: 1.4rem;
    padding-right: 1.4rem;
}
.switch-handler::before {
    content: '\u00A0\u00A0\u00A0';
    color: #fff0;
    width: 2.6rem;
    bottom: 0.2rem;
    -webkit-transition: color .3s .1s;
    position: relative;
}
.form-control.active{
transition:border linear .2s,box-shadow linear .5s;
-moz-transition:border linear .2s,-moz-box-shadow linear .5s;
-webkit-transition:border linear .2s,-webkit-box-shadow linear .5s;
outline:none;
border-color: rgba(12, 255, 0, 0.75);
box-shadow:0 0 8px rgba(59, 224, 9, 0.75);
-moz-box-shadow:0 0 8px rgba(93,149,242,.5);
-webkit-box-shadow:0 0 8px rgba(93,149,242,3);
}
`)
    /**
        * 点击“存储队伍”按钮
        */
    const saveTeamData = () => {
      findOnePCRelem(`.sticky-top>button.pcbtn.primary`, '儲存隊伍').click();
      let d = document.querySelector('a[href="##"]')
      d && d.click()
    }
    /**
     * 自动切换到地图掉落模式
     *
     */
    function autoSwitch2MapList() {
      findOnePCRelem(`button`, '地圖掉落模式').click();//findOnePCRelem(`.d-flex.flex-nowrap.mb-3.armory-function>button.pcbtn.mr-3`, '地圖掉落模式').click();
    }
    function selectNumInOnePage(num, event) {
      const $select = $("#app > .main > .container > .item-box > .row.mb-3 > div:nth-child(3) > .row > div:nth-child(3) select");
      if (num) {
        const changeEvent = new Event('change');
        $select.val(1000)
        $select[0].dispatchEvent(changeEvent)
      }
      else
        return $select.val();
    }
    function toPage(num) {
      const $table = $(".mapDrop-table:not(.helper)");
      const $pages = $($table.find("tr").toArray().pop());
      const $frist = $($pages.find("li").toArray()[num || 1]);
      $frist.children()[0].click()
    }
    async function getMapData() {
      function rowParser($tr, page, index) {
        function parseItem($item) {
          const url = $($item.find("a")[0]).attr("href");
          const name = $($item.find("img")[0]).attr("title");
          const img = $($item.find("img")[0]).attr("src");
          const requireItemID = img.match(/\d{6}/)[0] //pcredivewiki.tw/static/images/equipment/icon_equipment_115221.png
          const odd = parseInt($($item.find("h6.dropOdd")[0]).text()) / 100; // %不算在parseInt内
          const count = parseInt(!/無需|溢/.test($($item.find(".py-1")[0]).text()) && $($item.find(".py-1")[0]).text() || 0);
          const id = /\d+/.exec(img)[0];
          return { url, name, img, odd, count, id };
        }
        const children = $tr.children().map(function () { return $(this) });
        const name = children[0].text();
        const requirement = parseInt(children[1].text());
        const items = $(children[2].children()[0]).children().toArray().map(v => parseItem($(v)));
        return { name: name, requirement: requirement, items: items, page: page, index: index };
      }
      function next($table) {
        const $pages = $($table.find("tr").toArray().pop());
        const $next = $($pages.find("li").toArray().pop());
        if ($next.hasClass("disabled"))
          return false;
        $next.children()[0].click()
        return true;
      }
      let $table = $(".mapDrop-table:not(.helper)");
      const data = [];
      toPage(1);
      let page = 1;
      await sleep(20);
      do {
        await sleep(20);
        $table = $(".mapDrop-table:not(.helper)");
        //判断简易计算
        let start = $table.find("thead>tr").length, pageData = $table.find("tr")
        pageData = pageData
          .toArray()
          .map($)
        if (start === 1) {
          pageData = pageData.slice(start, -1)  // 最后一行是分页栏
        } else {
          pageData = pageData
            .filter(function (i, v) { return v !== this && v >= 2 || false }.bind(pageData.length - 1)) //结果过滤偶数
        }
        pageData = pageData.map((m, i) => rowParser(m, page, i));
        data.push.apply(data, pageData);
        page += 1;
      } while (next($table))
      toPage(1);
      return data;
    }
    function getCost(name) {
      if (name === "1-1") return 6
      if (name.startsWith("1-")) return 8;
      if (name.startsWith("2-")) return 8;
      if (name.startsWith("3-")) return 8;
      if (name.startsWith("4-")) return 9;
      if (name.startsWith("5-")) return 9;
      if (name.startsWith("6-")) return 9;
      return 10;
    }
    function calcResult(data) {
      data = data.map(chan => {
        const sum = (...arr) => [].concat(...arr).reduce((acc, val) => acc + val, 0);
        chan.exception = sum(chan.items.map(v => v.count * v.odd));
        chan.max = Math.max.apply(null, chan.items.map(v => v.count / v.odd));
        chan.min = Math.min.apply(null, chan.items.filter(v => v.count).map(v => v.count / v.odd));
        chan.effective = sum.apply(null, chan.items.map(v => v.count ? v.odd : 0));
        return chan;
      });
      const model = {
        "optimize": "cost",
        "opType": "min",
        "constraints": (() => {
          const equis = {};
          data.forEach(c => c.items.forEach(e => equis[e.name] = { "min": e.count }));
          return equis;
        })(),
        "variables": (() => {
          const challs = {};
          data.forEach(c => {
            const cMap = {};
            c.items.forEach(item => cMap[item.name] = item.odd);
            cMap.cost = getCost(c.name);
            challs[c.name] = cMap;
          });
          return challs;
        })(),
      };
      console.log("model", model);
      const lp_result = solver.Solve(model);
      console.log(lp_result);
      for (let k in lp_result) {
        if (!k.includes("-")) continue;
        const target = data.find(c => c.name === k);
        if (target)
          target.times = lp_result[k] || 0;
      }
      return {
        total: lp_result.result,
        map: data
          .sort((a, b) => b.times - a.times)
          .sort((a, b) => b.effective - a.effective)
      };
    }

    const BOUNS_KEY = "___bouns";

    function askBouns() {
      const bouns = parseInt(prompt("请输入目前倍数(N3或N2，非活动期可取消)").split('').reverse().join('') || "1") || 1
      sessionStorage.setItem(BOUNS_KEY, bouns);
      return bouns;
    }
    function getBouns() {
      let bouns = parseInt(sessionStorage.getItem("___bouns"));
      if (!bouns) {
        bouns = askBouns();
      }
      return bouns
    }
    function showResult(data) {
      const bouns = getBouns();
      const table = genTable(data.map.filter(m => m.times));
      const comment = $.parseHTML('<a href>说明</a>');
      const commentLines = [];
      commentLines.push("推荐使用方法：按照列表顺序刷图，数量不要超过「适用」和「推荐」两者的最小值，完成后修改数量，重新根据新情景计算。");
      commentLines.push("");
      commentLines.push("注意：如果您尚缺好感，可考虑以30体/次为倍数单位扫荡刷图，能最大化获取发情蛋糕。");
      commentLines.push("");
      commentLines.push("---表头说明---");
      commentLines.push("『章节』关卡编号。点击编号可以自动跳转到图书馆原表中关卡详细介绍。点击『章节』能切换排序");
      commentLines.push("『独』标识。代表当前结果中仅有该图能出的装备碎片。赶进度的话刷满黄色碎片数。");
      commentLines.push("『需求』关卡需求。图中所需装备总数。");
      commentLines.push("『效率』装备效率。图中所有有效装备掉落的概率和。");
      commentLines.push("『适用』有效次数。预计能保持「效率」不变的次数。");
      commentLines.push("『推荐』推荐次数。假设概率固定，由考虑体力的线性规划算法计算出的总最优刷图次数。");
      commentLines.push("『最大』最大次数。最近该图需要的最高次数。");
      $(comment[0]).click(e => { alert(commentLines.join('\n')); e.preventDefault(); e.stopPropagation() });
      const quickModifyBtn = $.parseHTML(`<a href="##" style='margin-left: 1rem;'>快速修改</a>`);
      $(quickModifyBtn[0]).click(async e => {
        let modifyState = !document.querySelector('.singleSelect.ready');
        [...document.querySelectorAll('span.dropsProgress')].reduce((t, i) => i.classList.toggle('hide', modifyState), document.querySelector('span.dropsProgress'))
        //点击快速修改 如果找不到输入框就没法设置 document.querySelector('#app div.p-2.text-center.mapDrop-item.mr-2 input.form-control') || findOnePCRelem('table span button', '快速修改').click();
        document.querySelector('#app div.p-2.text-center.mapDrop-item.mr-2 input.form-control') || findOnePCRelem('table button', '快速修改').click();
        document.querySelector('#popBox.modal.fade.show') && document.querySelector('#popBox.modal.fade.show').click();
        document.getElementById('helper--modal-content').classList.toggle('helper--drop', modifyState);
        deleteItem(modifyState)
        modifyState && document.querySelector('span.switch-multiSelectBtnState').addEventListener(`click`, multiItemChange)
        modifyState && document.querySelector('span.switch-handler').addEventListener(`click`, (e) => {
          multiSelectState(switchMultBtnState("active", !document.querySelector('span.switch-multiSelectBtnState.active'))); e.stopImmediatePropagation()
        })
        modifyState && (document.querySelector('.singleSelect.ready').parentElement.scrollLeft = 500);
        return false;
      });
      const reCalcBtn = $.parseHTML(`<a href class=singleSelect style='margin-left: 1rem;'title='修改所有装备后 点击自动保存和计算'>重新计算</a>`);
      const multipleBtn = $.parseHTML(`<span class=switch-multiSelectBtnState></span><span class="switch-handler"></span>`)
      $(reCalcBtn[0]).click(() => { handleClickCalcBtn(); return false; });
      showModalByDom(`总体力需求：${Math.round(data.total / bouns)} &nbsp;&nbsp; 当前倍率：${bouns} &nbsp;&nbsp; `, comment, quickModifyBtn, reCalcBtn, multipleBtn, table);
    }
    function createModal(...content) {
      const containerStyle = `
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                position: fixed;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: all ease-in-out 0.5s;
            `;
      const maskStyle = `
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                position: absolute;
                z-index: 11000;
            `;
      const boxStyle = `
                min-width: 80%;
                z-index: 12000;
            `;
      const contentStyle = `
                width: 100%;
                margin-bottom: 10px;
                max-height: 80vh;
                overflow: scroll;
            `
      const html = `
                <div id="helper--modal" style="${containerStyle}">
                    <div id="helper--modal-mask" style="${maskStyle}"></div>
                    <div class="breadcrumb" style="${boxStyle}">
                        <div id="helper--modal-content" style="${contentStyle}">${content.join("")}</div>
                        <button id="helper--modal-close" type="button" class="pcbtn mr-3"> 关闭 </button>
                        <button id="helper--modal-Clipboard" type="button" class="pcbtn mr-3" title='导出到粘贴板'> >&#128203 </button>
                    </div>
                </div>
            `;
      $("#app").after(html);
      $("#helper--modal-close").click(() => hideModal());
      $("#helper--modal-mask").click(() => hideModal());
      $("#helper--modal-Clipboard").click(() => txtToClipboard());
    }

    function genItemsGroup(items) {
      const old = window.performance.now()
      items = boundLocatStrong(items)// ${item.Unique?`唯一`:``}

      const html = `
                <div class="d-flex flex-nowrap justify-content-center">
                    ${items.map(item => `
                        <div class="p-2 text-center mapDrop-item mr-2 helper-cell"   style='${item.Unique && `background-color: rgba(255,193,7,.5); border-radius: 0.7vw;` || ``}'>
                            <div class='helper--calc-result-cell  ${!item.count && `un--wanted` || ''}'
                                 onclick
                                 ${`data-item-count=${item.count}`}
                                 data-item-id=${item.img.match(/\d{6}/)[0]}
                                 data-item-name=${item.name}
                             >
                            <a
                                href="${item.url}"
                                class=""
                                target="_blank"
                            >
                                <img
                                    width="70"
                                    title="${item.name + ` `}${item.information && item.information || ``}${item.Unique && ` 该图限定` || ``}"
                                    src="${item.img}"
                                    class="aligncenter"
                                >
                            <span class="oddTri helper-oddTri">
                            <i class="dropOdd text-center helper-block ">
                             ${Math.round(item.odd * 100)}%</i></span>
                            </a>
                            </div>
                            <span class="text-center py-1 d-block"
                                  ${!item.count && `style="opacity:0.4"`}
                                  title="${item.information}"
                                  data-total-need=${item.count}
                             > ${item.count && `总需` + item.count || `已满`} </span>
                            <span><input type="number" class="form-control" item-name="${item.name}" value="${item.has || 0}"></span>
                            <span><input type="number" class="form-control" orig-item-name="${item.name}" placeholder="增量" title="输入掉落数量，回车确认并跳转下个物品"></span>
                            <span class= 'dropsProgress ${item.count && ' ' || 'hide'} '>进度:${item.has || 0}</span>
                        </div>
                    `).join("")}
                </div>
            `;
      return html;
    }
    function boundLocatStrong(items) {
      for (let item of items) {
        try {
          let p = ~~new RegExp("\"equipment_id\":" + item.id + ",\"count\":([^,]+),")
            .exec(localStorage.itemList)[1].replace(/^\"|\"$/g, '');
          item.information = `有` + p + " 缺" + (item.count)
          item.has = p;
          let c = `${item.count && (item.count += p)}`
        } catch (e) {
          item.count = 0
        }
      }
      return items
    }
    const changeItemCount = (e) => {
      // 快速完成
      const singleItem = () => {
        const $this = $(e.target);
        const count = $this[0].dataset.itemCount
        if (!count) return
        const ID = $this[0].dataset.itemId
        const name = $this[0].dataset.itemName
        if (confirm(`${name}的数量达到了${count}。刷新后点击计算`)) {
          itemCountChage(ID, count);
          GM.setValue(`mount`, `(()=>{ setTimeout(handleClickCalcBtn,2000) })()`)
          location.reload();
        }
      }
      const multiItem = () => {
        e.target.classList.toggle(`multiSelect-yes`, !(e.target.classList[e.target.classList.length - 1] == `multiSelect-yes`))
        let cls = document.querySelector('.switch-multiSelectBtnState').classList
        cls.toggle(`selected-completedBtn`, document.querySelectorAll('.multiSelect-yes').length != 0)
      }
      e.target.classList[e.target.classList.length - 1] == `helper--show-deleted-btn` && !singleItem() || multiItem()
    }
    const multiItemChange = (e) => {
      let cell = document.querySelectorAll('.multiSelect-yes')
      if (cell.length && confirm(`你目前选了${cell.length}个装备,开始修改,点击确定生效`)) {
        for (let dom of [...cell]) {
          itemCountChage(dom.dataset.itemId, dom.dataset.itemCount);
        }
        GM.setValue(`mount`, `(()=>{ setTimeout(handleClickCalcBtn,2000) })()`)
        location.reload();
      }
    }
    function itemCountChage(equipment_id, count) {
      let p = new RegExp("\"equipment_id\":" + equipment_id + ",\"count\":([^,]+)", 'g')
      let t = new RegExp(`\\d+`, 'g')
      localStorage.setItem(`itemList`, localStorage.itemList.replace(p, (match, p1) => {
        return match.substr(0, 30) + p1.replace(t, count)//match[match.length-1]match.length-3
      }))
    };
    function uniqueItem(mapData) {
      let itmes = [];
      for (let i = 0; i < mapData.length; i++) {
        itmes.push(...mapData[i].items)
      }
      for (let t of itmes) {
        itmes[t.name] = itmes[t.name] && itmes[t.name] + 1 || 1
      }
      for (let i = 0; i < mapData.length; i++) {
        for (const item of mapData[i].items) {
          if (item.count > 0 && itmes[item.name] < 2) {
            mapData[i].IsuniqueItem = true
            item.Unique = true
          }
        }
      }
    }
    function sortColumn(e) {//-1>a,b 1>b,a//greedy
      let trList = [...e.target.closest('table').querySelectorAll(`tbody>tr`)]
      const greedy = () => {
        trList.sort((a, b) => { return ~~a.dataset.isUniqueItem && -1 || ~~a.dataset.isUniqueItem && 1 || 0 })
          .sort((a, b) => { return ~~a.dataset.isUniqueItem && ~~b.dataset.isUniqueItem && (~~b.children[2].dataset.dropEffective - ~~a.children[2].dataset.dropEffective) || 0 })
        return 1
      }
      const dropEffective = () => {
        trList.sort((a, b) => { return ~~b.children[2].dataset.dropEffective - ~~a.children[2].dataset.dropEffective || 0 })
        return 0
      }
      e.target.dataset.sortType = !~~e.target.dataset.sortType && greedy() || dropEffective()//切换状态保存
      let tbody = e.target.closest('table').querySelector("tbody")
      tbody.innerHTML = ''
      for (let t of trList) {
        tbody.appendChild(t)
      }
    }
    async function txtToClipboard() {
      const 数据条目 = '20',//(条)
        trList = [...document.querySelectorAll(`table.table.table-bordered.mapDrop-table.helper>tbody tr:nth-child(-n+${数据条目})`)],
        howMuchSpace = (sum = 12, a) => { return a = [], a.length = sum, a.fill(space, 0, sum).join(``) },
        surroundedByaBar = (text, Rows = 6, horizontal = text.length + 8) => {
          Rows = Rows & 1 && Rows || Rows + 1//only odd
          let str = enter, blank = (horizontal - text.length) / 2, half = Math.ceil(Rows / 2);
          for (let i = 1; i <= Rows; i++) {
            str += '|'
            for (let k = 0; k < horizontal; k++) {
              (Rows === i || 1 === i) && (str += '-') || i === half || (str += ' ')
              //中间行k已到居中文本位置
              i === half &&
                (blank <= k && k < blank + text.length - 2 && (k = text.length + blank - 1, str += text) ||
                  (str += ' '))
            }
            str += '|' + enter
          }
          str.substr(0, str.length - 2)
          return str
        },
        space = ' ', enter = '\r\n',
        title = `${howMuchSpace(17)}pcr简易装备库${howMuchSpace()}数据目:${trList.length}${enter}`;
      let count = 0,
        text = `\u200E ${howMuchSpace(3)}章节${howMuchSpace(6)}需求${howMuchSpace(6)}效率${howMuchSpace(6)}适用${howMuchSpace(6)}推荐${howMuchSpace(6)}最大${enter}`;
      for (let t of trList) {
        text += howMuchSpace(5)
        for (let b = 1; b < 13; b += 2) {
          let lent = t.childNodes[b].innerText.length
          text += (t.childNodes[b].innerText + howMuchSpace(10 - lent))
        }
        text = text.trim()
        text += enter
        count += 1
      }
      findOnePCRelem('.modal-body button', '產生網址連結').click();
      findOnePCRelem('.modal-body button', '產生匯出文字').click()
      await sleep(40)
      //设置dom移除监听 负责在生成链接后设置粘贴板
      document.querySelector('.wating').parentElement
        .parentElement.parentElement
        .addEventListener("DOMNodeRemoved",
          () => {
            GM.setClipboard(`${title}${text.trim()}${enter}${enter}${enter}7天内打开链接,装备、角色数据完整保留,但将于${(d => `${d.getMonth() + 1}月${d.getDate()}号`)(new Date(new Date().getTime() + 7 * 86400000))}失效！${enter}请尽快打开链接:${surroundedByaBar(document.querySelector('.modal-body input')._value||'network error,copy Text below')}${enter}${howMuchSpace(4)}${enter}${howMuchSpace(4)}并点击储存队伍${enter}${enter}${enter}${howMuchSpace(4)}如果链接失效,可复制"[](内!!!)的字符"到文字汇入队伍的输入框${enter}[${document.querySelector('.modal-body textarea').innerHTML}]`);

            document.querySelector('.modal-body button:nth-child(2)').click();
            alert(`已导出粘贴板,可复制至word、社交平台`);
          }, { once: true })
    }

    const deleteItem = (switchOn) => {
      switchMultBtnState(`ready`, switchOn)
      for (let i of $('table .p-2.text-center.mapDrop-item.mr-2>div.helper--calc-result-cell')) {
        ~~i.dataset.itemCount && switchOn && !!$(i).addClass('helper--show-deleted-btn') || $(i).removeClass('helper--show-deleted-btn')
      }
      !switchOn && multiSelectState()
    }
    const switchMultBtnState = (cls, switchOn = false) => {
      let state = ['ready', 'active', 'selected-completedBtn']
      !switchOn && cls == state[1] && document.querySelector('a.singleSelect').classList.toggle(state[0], !switchOn)
      if (!switchOn && cls == state[0] && !state.forEach(i => {
        document.querySelector('span.switch-multiSelectBtnState').classList.toggle(i, switchOn)
        document.querySelector('span.switch-handler').classList.toggle(i, switchOn)
        document.querySelector('a.singleSelect').classList.toggle(i, switchOn)
      })) return switchOn;
      if (!switchOn && cls == (state.shift() && state)[0] && !state.forEach(i => {
        document.querySelector('span.switch-multiSelectBtnState').classList.toggle(i, switchOn)
        document.querySelector('span.switch-handler').classList.toggle(i, switchOn)
      })) return switchOn;
      document.querySelector('span.switch-multiSelectBtnState').classList.toggle(cls, switchOn)
      document.querySelector('span.switch-handler').classList.toggle(cls, switchOn)
      switchOn && cls == state[1] ? document.querySelector('a.singleSelect').classList.toggle(state[0], !switchOn) : document.querySelector('a.singleSelect').classList.toggle(state[0], switchOn)
      return switchOn
    }
    const multiSelectState = (switchOn = false) => {
      for (let i of $('table .p-2.text-center.mapDrop-item.mr-2>div.helper--calc-result-cell')) {
        let c = ~~i.dataset.itemCount
        c && i.classList.toggle("multiSelect-no", switchOn);
        c && !switchOn && i.classList.toggle("multiSelect-yes", switchOn)
      }
    }
    const toDetailsTheMap = (map) => {
      const onlineMap = `https://pcredivewiki.tw/Map`;
      const genUri = () => {
        /* 日后地图更新
    打开https://pcredivewiki.tw/Map 打开控制台按下Exc 在console中输入
   ` $$('.btn.btn-info.p-3')
.map(el => (el.innerText.replace(/\d+\./,'')+'N'))
.reduce((sum, value) =>{return sum .push(value),sum},[]).join('","')
`
不含反引号 输出后模仿格式(注意前后引号!!)复制到下面maps中
    */
        console.log(`如果地图更新的话看我,点右边的超链接`)
        const levelsForMapUir = new Map()
        const maps = ["朱諾平原N", "帕拉斯高原N", "赫柏丘陵N", "維斯塔溪谷N",
          "刻瑞斯森林N", "佛洛拉湖畔N", "墨提斯大瀑布N", "伊麗絲樹海N",
          "弗麗嘉雪原N", "洛麗泰海岸N", "蓋奴亞荒漠N", "波諾尼亞砂丘N",
          "朵羅西亞溼地N", "尤金尼亞熱地N", "塔利亞火山N", "泰美斯銀嶺N",
          "菲得斯冰原N", "法艾頓草原N", "法艾頓草原‧南部N", "卡斯塔利亞樹林‧西部N",
          "卡斯塔利亞樹林‧東部N", "馬提爾德岩峰‧南部N", "馬提爾德岩峰‧北部N", "雷蒂烏斯群峰‧西麓N",
          "雷蒂烏斯群峰‧東麓N", "佩特羅大森林‧西部N", "佩特羅大森林‧東部N", "迪茲塔爾河蝕岸‧北部N",
          "迪茲塔爾河蝕岸‧南部N", "弗泰拉斷崖‧北部N", "弗泰拉斷崖‧南部N", "法斯奇亞森林‧南部N",
          "ファスキア森林・東部N", "デクスティア岩崖・西壁N", "デクスティア岩崖・東壁N"]
        let i = 1
        for (let m of maps) {
          levelsForMapUir.set(i, `https://pcredivewiki.tw/Map/Detail/${encodeURI(m)}`); i += 1
        }
        return levelsForMapUir
      }
      const mapIndex = map.split('-');
      const p = mapIndex.shift() >> 0
      const d = genUri()
      d.has(p) && GM.setValue(`toMap`, mapIndex.shift() >> 0) && unsafeWindow.open(d.get(p)) || alert(`地图可能更新了，请按下F12 ，再按下Esc，找到‘如果地图更新的话看我,点右边的超链接’字样，按提示修改脚本`)

    }
    function genTable(mapData) {
      uniqueItem(mapData);
      const bouns = getBouns();//
      const html = `
                <table width="1000px" class="table table-bordered mapDrop-table helper">
                    <thead>
                        <th style="min-width: 71px; vertical-align: baseline;cursor: pointer;" data-sort-type='0' title='点击可转换成贪心排序'>章节</th>
                        <th style="min-width: 67px; vertical-align: baseline;">需求</th>
                        <th style="min-width: 67px; vertical-align: baseline;">效率</th>
                        <th style="min-width: 67px; vertical-align: baseline;">适用</th>
                        <th style="min-width: 67px; vertical-align: baseline;">推荐</th>
<th style="min-width: 67px; vertical-align: baseline;">最大</th>
                        <th> 掉落一覽 </th>
                    </thead>
                    <tbody>
                        ${mapData.map(m => `
                            <tr data-is-unique-item=${m.IsuniqueItem && 1 || 0}>
                                <td>
                                    <a href="#" class="helper--nav-to-level ${m.IsuniqueItem && 'helper--important'}" data-pag:e="${m.page}" data-index="${m.index}" title="查看对手阵容">
                                        ${m.name}
                                    </a>
                                </td>
                                <td> ${m.requirement} </td>
                                <td data-drop-effective=${Math.round(m.effective * 100)}> ${Math.round(m.effective * 100)}% </td>
                                <td> ${Math.ceil(m.min / bouns)} </td>
                                <td> ${Math.ceil(m.times / bouns)} </td>
                                <td> ${Math.ceil(m.max / bouns)} </td>
                                <td align="center">
                                    ${genItemsGroup(m.items)}
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `.trim();
      const table = $.parseHTML(html).pop();  // 0是一堆逗号，我也不造这是什么鬼
      $(table).find("a.helper--nav-to-level").click(function (e) {
        const $this = $(e.currentTarget);
        const page = parseInt($this.attr("data-page"));
        const index = parseInt($this.attr("data-index"));
        //hideModal();
        toDetailsTheMap($this.text())
        /*
          setTimeout(() => {
              const $table = $(".mapDrop-table:not(.helper)");
              const elem = $table.find("tr")[index];
              elem.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center",
              })
          }, 200)
          */
      })
      $(table).find('.p-2.text-center.mapDrop-item.mr-2>div.helper--calc-result-cell').click(changeItemCount)
      const Debounce = function (fn, delay = 500, immediate = false) {
        typeof delay === 'boolean' && (immediate = delay)
        let timer = null // 闭包存储setTimeout状态
        return function () {
          let self = this // 事件源this
          let args = arguments // 接收事件源的event
          if (timer) clearTimeout(timer) // 存在就清除执行fn的定时器
          if (immediate) { // 立即执行
            let callNow = !timer // 执行fn的状态
            timer = setTimeout(function () {
              timer = null
            }, delay)
            if (callNow) fn.call(self, ...args)
          } else { // 非立即执行
            timer = setTimeout(function () { // 或者使用箭头函数将this指向dom
              fn.call(self, ...args)
            }, delay)
          }
        }
      }
      const inputEntry = async e => {
        const itemName = e.target.getAttribute('item-name')
        const newNum = +e.srcElement.value;
        // 通过图书馆的快速修改功能来进行库存的修改
        const inputDom = document.querySelector(`#app table img[title="${itemName}"]`)
          .closest('div').querySelector('input');
        if (inputDom.value === newNum) return
        e.target.classList.toggle('active', 1)
        inputDom.value = newNum
        inputDom.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", keyCode: 13 }));
        // 在修改库存后，修改结果页的库存显示
        // table.querySelectorAll(`input[item-name=${itemName}]`).forEach(dom => {
        // })
        // 在输入掉落数时同步所有相同装备下的 input 的 value
        const c = [...table.querySelectorAll(`input[item-name=${itemName}]`)]
        c.reduce((t, i) => {
          i.value = newNum;
          const itemSpanDom = i.closest('div').querySelector('span.text-center');
          const title = itemSpanDom.getAttribute("title");
          let totalNeed = itemSpanDom.getAttribute("data-total-need");
          itemSpanDom.innerText = newNum < totalNeed ? `总需${totalNeed}` : "已满";
          itemSpanDom.setAttribute("title", `有${newNum} 缺${Math.max(totalNeed - newNum, 0)}`);
          i.closest('div').querySelector('img').setAttribute("title", `有${newNum} 缺${Math.max(totalNeed - newNum, 0)}`);
          i.closest('div').querySelector('span.dropsProgress').innerText = `进度:${newNum}`;
        }, c[0])
      }
      const fnChanged = Debounce(Debounce(inputEntry, 150), 150)
      table.querySelectorAll('input[item-name]').forEach(inputDom => {
        inputDom.addEventListener('input', fnChanged);
        inputDom.addEventListener('keyup', fnChanged);
      });
      const deltaInputEntry = async e => {
        // 只有回车触发更改
        if (e.keyCode != 13) { return }
        // 修改上方总数量并触发修改事件 -> delegate to inputEntry()
        const itemName = e.target.getAttribute('orig-item-name')
        const delta = +e.srcElement.value;
        const origInputDom = e.target.closest("div").querySelector('input[item-name]');
        origInputDom.value = +origInputDom.value + delta;
        origInputDom.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", keyCode: 13 }));
        e.target.value = "";
        // 如有下个物品，跳转焦点
        const nextItemDiv = e.target.closest("div").nextElementSibling;
        if (nextItemDiv) {
          nextItemDiv.querySelector('input[orig-item-name]').focus();
        }
      }
      table.querySelectorAll('input[orig-item-name]').forEach(inputDom => {
        inputDom.addEventListener('input', deltaInputEntry);
        inputDom.addEventListener('keyup', deltaInputEntry);
      });
      return table
    }
    function hideModal() {
      document.querySelector('#popBox.modal.fade.show') && document.querySelector('#popBox.modal.fade.show').click();
      $("#helper--modal").css("opacity", 0);
      $("#helper--modal").css("pointer-events", "none");
    }
    function showModal(...content) {
      $("#helper--modal").css("opacity", 1);
      $("#helper--modal").css("pointer-events", "");
      if (content && content.length) {
        debugger
        $("#helper--modal-content").html(content.join(""));
      }
    }

    async function showModalByDom(...dom) {
      $("#helper--modal").css("opacity", 1);
      $("#helper--modal").css("pointer-events", "");
      if (dom.length) {
        $("#helper--modal-content").html("");
        for (let i in dom)
          $("#helper--modal-content").append(dom[i]);
      }
      document.querySelector("table.table.table-bordered.mapDrop-table.helper th").addEventListener(`click`, sortColumn)
    }

    async function handleClickCalcBtn() {
      autoSwitch2MapList();
      await sleep(300);
      saveTeamData();
      // 自动调整至旧版数量
      //const tempDom = document.querySelector('button[title="設計圖數量為舊版數量"]');
      //if(![...tempDom.classList].includes('active'))
      //    tempDom.click();
      //await sleep(100);
      document.getElementById('helper--modal-content').classList.remove('helper--drop');
      if (selectNumInOnePage() != "1000") {
        selectNumInOnePage(1000);
      }
      await sleep(100);
      const data = await getMapData();
      console.log("data", data);
      const result = calcResult(data);
      console.log("result", result);
      showResult(result);
      changeBtnGroup();
    }

    async function handleFastModifyBtn() {
      const $table = $(".mapDrop-table:not(.helper)");
      if ($table && $table.find("thead button").length) {
        $table.find("thead button")[0].click();
      } else {
        alert("现在还不是地图掉落页面呢～");
      }
    }
    function btnFactory(content, colorRotate, onClick) {
      const btn = $.parseHTML(`
                <div class="armory-function" style="padding: 0; padding-top: 1vh; overflow: visible; filter: hue-rotate(${colorRotate}deg);">
                    <button class="pcbtn primary" style="border-radius: 50%;"> ${content} </button>
                </div>
            `);
      $(btn).click(onClick);
      return btn;
    };
    /**
    * 返回pcr的按钮element
    *
    * @param {String} css 按钮的父级或集合
    * @param {?String} btnName 按钮的innerText!
    * @returns:html元素
    */
    function findOnePCRelem(css, btnName) {
      if (!btnName) {
        return $(css)
      }
      return [...document.querySelectorAll(css)].filter(node => node.innerText === btnName).pop();
    }
    function createBtnGroup() {
      const group = $.parseHTML(`
                <div id="helper--bottom-btn-group" class="scroll-fixed-bottom"></div>
            `);
      const fastModifyBtn = btnFactory("快速<br>修改", 270, handleFastModifyBtn);
      const bounsBtn = btnFactory("修改<br>倍数", 180, askBouns);
      const calcBtn = btnFactory("计算<br>结果", 90, handleClickCalcBtn);
      $(group).append(calcBtn);
      $(group).append(fastModifyBtn);
      $(group).append(bounsBtn);
      $("#app .container").append(group);
    }
    function changeBtnGroup() {
      const group = $("#helper--bottom-btn-group");
      group.html("");
      const fastModifyBtn = btnFactory("快速<br>修改", 188, handleFastModifyBtn);
      const bounsBtn = btnFactory("修改<br>倍数", 216, askBouns);
      const lastResultBtn = btnFactory("上次<br>结果", 144, () => showModal());
      const calcBtn = btnFactory("重新<br>计算", 72, handleClickCalcBtn);
      group.append(calcBtn);
      group.append(bounsBtn);
      group.append(fastModifyBtn);
      group.append(lastResultBtn);
    }
    function appendName(mapName) {
      document.querySelector('nav.navbar.navbar-expand-md.navbar-dark.fixed-top').style.visibility = "hidden";//隐藏导航条
      document.querySelector('.float-right.pcbtn.mr-3') && !document.querySelector('.float-right.pcbtn.mr-3').click();//显示魔物
      const toName = (name, ElementFindByNameDotParent = document.querySelector('#H' + name.mapName).parentElement) => { ElementFindByNameDotParent.scrollIntoView({ block: 'center', }), ElementFindByNameDotParent.style.border = '3px solid #db1f77' };
      [...document.querySelectorAll('.item-title')].forEach(ele => ele.id = 'H' + ele.outerText.split('-').pop()
      )//添加id方便toName
      toName({ mapName })
    }
    createBtnGroup();
    createModal();
    (async () => {
      try {
        let before = await GM.getValue('mount', 0), after = await GM.getValue('toMap', 0);
        before && eval(before)
        await sleep(2000)
        unsafeWindow.location.href.includes("https://pcredivewiki.tw/Map/Detail") && after && appendName(after);
      } catch (e) {
        console.log(`错误: ` + e)
      } finally {
        await GM.deleteValue('mount');
        await GM.deleteValue('toMap');
      }
    })();
  });
})();


