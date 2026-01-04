// ==UserScript==
// @name         审评助手3
// @namespace    nsyouran
// @version      6.0.0
// @author       nsyouran
// @description  审评助手+待办+已办+查询+笔记
// @icon         https://mpa.ah.gov.cn/_res/favicon.ico
// @match        https://ypjg.ahsyjj.cn:3510/spd/
// @match        https://ypjg.ahsyjj.cn:3510/spd/#
// @match        https://ypjg.ahsyjj.cn:3510/fileManager/preview*
// @match        https://ypjg.ahsyjj.cn:3510/qyd/secondYlqxsx/*
// @match        https://ypjg.ahsyjj.cn:3510/spd/cbxx/getUser*
// @match        https://www.cmde.org.cn/flfg/zdyz/zdyzwbk/index*
// @match        https://www.cmde.org.cn/splt/ltgxwt/index*
// @match        http://app.nifdc.org.cn/biaogzx/qxqwk.do*
// @match        http://zhjg.ahsyjj.cn:3610/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.11.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.global.prod.min.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://unpkg.com/v-clipboard@3.0.0-next.1/dist/v-clipboard.umd.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.2.32/index.full.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.2.32/locale/zh-cn.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus-icons-vue/2.0.10/index.iife.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/docxtemplater/3.34.3/docxtemplater.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js
// @require      https://unpkg.com/pizzip@3.1.4/dist/pizzip.min.js
// @require      https://unpkg.com/pizzip@3.1.4/dist/pizzip-utils.min.js
// @resource     element-plus-css  https://cdn.bootcdn.net/ajax/libs/element-plus/2.2.32/index.min.css
// @resource     unicloudjs        https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/378b6425-25ef-4ad3-85fb-c72cd76915f9.js
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/448785/%E5%AE%A1%E8%AF%84%E5%8A%A9%E6%89%8B3.user.js
// @updateURL https://update.greasyfork.org/scripts/448785/%E5%AE%A1%E8%AF%84%E5%8A%A9%E6%89%8B3.meta.js
// ==/UserScript==

(e=>{const a=document.createElement("style");a.dataset.source="vite-plugin-monkey",a.innerText=e,document.head.appendChild(a)})(" *,*:before,*:after{box-sizing:border-box}*::-webkit-scrollbar{width:8px}*::-webkit-scrollbar-thumb{background-color:#c8c8c8;border-radius:8px}textarea{font-family:Avenir,Helvetica,Arial,sans-serif}.el-table__row.clybc{background-color:#ff0!important}.el-popper{max-width:500px}.el-drawer__body{padding:0}.el-tabs__content{padding:0!important}.search[data-v-a285de8f]{padding:10px 10px 0}.btn[data-v-93351388]{position:absolute;background:transparent;border:none;transform:translate(70px,-70px)}.list[data-v-d24c8660]{display:flex;flex-direction:column;padding:10px 10px 0}.list .table[data-v-d24c8660]{flex-grow:1}.list .foot[data-v-d24c8660]{flex-shrink:0;border:1px solid green;height:100px}.copyable[data-v-d24c8660],.clickable[data-v-d24c8660]{cursor:pointer}.clickable[data-v-d24c8660]{color:#00f}.clickable[data-v-d24c8660]:hover{color:red}.mytodo[data-v-9fa22f96]{height:500px;display:flex;flex-direction:column}.mytodo .search[data-v-9fa22f96]{flex-shrink:0}.mytodo .list[data-v-9fa22f96]{flex-grow:1;overflow:hidden}.search[data-v-4a89fadc]{padding:10px 10px 0}.mydone[data-v-03eb911a]{height:500px;display:flex;flex-direction:column}.mydone .search[data-v-03eb911a]{flex-shrink:0}.mydone .list[data-v-03eb911a]{flex-grow:1;overflow:hidden}.pagiNation[data-v-03eb911a]{padding:10px 10px 20px}.search[data-v-f48158fa]{padding:10px 10px 0}.mysearch[data-v-3eb907d6]{height:500px;display:flex;flex-direction:column}.mysearch .search[data-v-3eb907d6]{flex-shrink:0}.mysearch .list[data-v-3eb907d6]{flex-grow:1;overflow:hidden}.pagiNation[data-v-3eb907d6]{padding:10px 10px 20px}.sphelper[data-v-0c8f56aa]{height:50px;width:50px;display:flex;justify-content:center;align-items:center;cursor:pointer}.sphelper[data-v-0c8f56aa]:hover{color:#e6a23c}.sphelper-block[data-v-0c8f56aa]{padding:10px;height:100%;display:flex;flex-direction:column}.search[data-v-0c8f56aa]{display:flex;flex-direction:row}.tabs[data-v-0c8f56aa]{width:100%;flex-grow:1;overflow-y:hidden}.search-btn[data-v-0c8f56aa]{margin-left:10px}.tab-content[data-v-0c8f56aa]{padding:10px;min-height:100px;max-height:800px;overflow-y:auto}.tab-content a[data-v-0c8f56aa]{text-decoration:none;color:#2980b9}.count[data-v-0c8f56aa]{background-color:red;color:#fff;margin-left:5px;font-style:normal;padding:0 8px;border-radius:10px}.baidu[data-v-0c8f56aa]{display:inline-block;background-image:url(https://www.baidu.com/favicon.ico);background-repeat:no-repeat;background-position:center;background-size:contain;width:2em;height:1em;transform:translateY(2px)}.form[data-v-db106125]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-db106125]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-db106125]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-1419a489]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-1419a489]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-1419a489]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-c2a14f89]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-c2a14f89]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-c2a14f89]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-86fc5475]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-86fc5475]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-86fc5475]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-e63b8e93]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-e63b8e93]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-e63b8e93]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-ad3d1bc8]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-ad3d1bc8]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-ad3d1bc8]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-5916e28c]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-5916e28c]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-5916e28c]{flex-shrink:0;text-align:right;padding:20px}#spnote[data-v-576746f6]{position:fixed;z-index:99;top:0;bottom:0;left:0;right:0;display:flex;flex-direction:row;background-color:#fff}#spnote .left[data-v-576746f6],#spnote .right[data-v-576746f6]{flex-shrink:0;display:flex;flex-direction:row}#spnote .left .body[data-v-576746f6],#spnote .right .body[data-v-576746f6]{flex-grow:1;width:300px}#spnote .left .cbtn[data-v-576746f6],#spnote .right .cbtn[data-v-576746f6]{display:flex;justify-content:center;align-items:center;cursor:pointer;user-select:none;width:20px;background-color:#e8e8e8}#spnote .left .cbtn[data-v-576746f6]:hover,#spnote .right .cbtn[data-v-576746f6]:hover{background-color:#c8c8c8}#spnote .middle[data-v-576746f6]{flex-grow:1}.middle[data-v-576746f6]{border:1px solid #c8c8c8;display:flex;flex-direction:column}.middle .tools[data-v-576746f6]{flex-shrink:0;border-bottom:1px solid #c8c8c8;padding:10px}.middle .tools .classify[data-v-576746f6]{width:300px;margin-right:12px}.middle .iframe[data-v-576746f6]{flex-grow:1}.left .body[data-v-576746f6]{overflow-y:auto}.left .body .item[data-v-576746f6]{line-height:20px;border-bottom:1px solid #c8c8c8;padding:5px 10px}.left .body .item[data-v-576746f6]:hover{background-color:#c8c8c8;color:#409eff}.left .body .item span[data-v-576746f6]{cursor:pointer;user-select:none}.left .body .item .icon[data-v-576746f6]{cursor:pointer;user-select:none;width:1.5em;height:1.5em;transform:translateY(1px)}.left .body .item.active[data-v-576746f6]{background-color:#e8e8e8;color:#409eff}.left .body .item.null[data-v-576746f6]{color:gray}.left .body .his .item[data-v-576746f6]{padding-left:40px}.right .body[data-v-576746f6]{display:flex;flex-direction:column}.right .body .baseinfo[data-v-576746f6]{margin:10px;border:1px solid #c8c8c8;border-radius:5px;padding:10px;flex-shrink:0}.right .body .comment[data-v-576746f6]{margin:0 10px;border:none;flex-shrink:0}.right .body .comment-his[data-v-576746f6]{flex-grow:1;overflow-y:auto;padding:10px}.comment-his .item[data-v-576746f6]{border:1px solid #c8c8c8;border-radius:5px;padding:10px;margin-bottom:10px;cursor:pointer;white-space:pre-wrap}.comment-his .item[data-v-576746f6]:hover,.comment-his .item.active[data-v-576746f6]{background-color:#e8e8e8}.copyable[data-v-576746f6]{cursor:pointer;user-select:none} ");

(function(vue, ElementPlus, ElementPlusIconsVue, ElementPlusLocaleZhCn, Clipboard, $$2, XLSX, PizZip, PizZipUtils, DocxTemplater, saveAs) {
  var _a, _b;
  "use strict";
  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k in e) {
        if (k !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  const ElementPlusIconsVue__namespace = /* @__PURE__ */ _interopNamespaceDefault(ElementPlusIconsVue);
  const XLSX__namespace = /* @__PURE__ */ _interopNamespaceDefault(XLSX);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("element-plus-css");
  const style = "";
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var GM_getResourceText$1 = /* @__PURE__ */ (() => monkeyWindow.GM_getResourceText)();
  eval(GM_getResourceText$1("unicloudjs"));
  const db = uniCloud.database();
  db.command.aggregate;
  const _ = db.command;
  const DB = {
    async getJbrInfo(ids) {
      const res = await db.collection("sp-record").aggregate().match({
        xksbxxid: _.in(ids)
      }).limit(500).end();
      const infos = {};
      for (const i of res.result.data) {
        infos[i.xksbxxid] = i;
      }
      return infos;
    },
    async setSPJLCoud(data) {
      let res = await db.collection("sp-record").where({
        xksbxxid: data.xksbxxid
      }).get();
      let doc = res.result.data[0];
      let rtn;
      if (doc) {
        rtn = db.collection("sp-record").doc(doc._id).update(data);
      } else {
        rtn = db.collection("sp-record").add(data);
      }
      return rtn;
    },
    getNoteList(id) {
      return new Promise((resolve, reject) => {
        db.collection("notes").aggregate().match({
          xksbxxid: id
        }).sort({ index: 1 }).limit(500).end().then((res) => {
          resolve(res.result.data);
        });
      });
    },
    saveNote(note) {
      const {
        _id,
        xksbxxid: id,
        fileId,
        data,
        index
      } = note;
      if (_id)
        return db.collection("notes").where({
          xksbxxid: id,
          fileId
        }).update({
          index,
          data,
          fileId,
          xksbxxid: id
        });
      else
        return db.collection("notes").add({
          index,
          data,
          fileId,
          xksbxxid: id
        });
    },
    queryClassification(value) {
      return new Promise(async (resolve, reject) => {
        let reg = new RegExp(`.*?${value}.*?`, "i");
        let { result: { data: classification } } = await db.collection("classification").where(_.or(
          {
            code: reg
          },
          {
            description: reg
          },
          {
            intend: reg
          },
          {
            examples: reg
          }
        )).limit(50).get();
        let { result: { data: noclinical } } = await db.collection("noclinical").where(_.or(
          {
            name: reg
          },
          {
            description: reg
          },
          {
            code: reg
          }
        )).limit(50).get();
        let { result: { data: standard } } = await db.collection("standard").where(_.or(
          {
            name: reg
          },
          {
            range: reg
          },
          {
            code: reg
          }
        )).limit(50).get();
        let { result: { data: principle } } = await db.collection("principle").where(_.or(
          {
            name: reg
          }
        )).limit(50).get();
        principle = principle.filter((item) => {
          item.url = item.url.replace(/images\/(.*?)&/, ($0, $1, $2) => {
            return $0.replace($1, encodeURIComponent($1));
          });
          return true;
        });
        resolve({
          classification,
          noclinical,
          standard,
          principle
        });
      });
    },
    getPrincipleInfo() {
      return new Promise(async (resolve, reject) => {
        let lastUpdate = "", total = 0;
        await db.collection("principle").where({ lastUpdate: _.exists(true) }).orderBy("lastUpdate", "desc").limit(1).get().then((res) => {
          lastUpdate = new Date(res.result.data[0].lastUpdate).toLocaleString();
        });
        await db.collection("principle").count().then((res) => {
          total = res.result.total;
        });
        resolve({
          lastUpdate,
          total
        });
      });
    },
    getStandardInfo() {
      return new Promise(async (resolve, reject) => {
        let lastUpdate = "", total = 0;
        await db.collection("standard").where({ lastUpdate: _.exists(true) }).orderBy("lastUpdate", "desc").limit(1).get().then((res) => {
          lastUpdate = new Date(res.result.data[0].lastUpdate).toLocaleString();
        });
        await db.collection("standard").count().then((res) => {
          total = res.result.total;
        });
        resolve({
          lastUpdate,
          total
        });
      });
    },
    getStandard(limit = 500, skip = 0) {
      return new Promise(async (resolve, reject) => {
        db.collection("standard").limit(limit).skip(skip).get().then((res) => {
          resolve(res.result.data);
        });
      });
    },
    addStandard(data) {
      return db.collection("standard").add(data);
    },
    getClassCode(value = "", cb) {
      const reg = new RegExp(`.*?${value.trim()}.*?`, "i");
      return db.collection("classification").where(_.or(
        { code: reg },
        {
          description: reg
        },
        {
          intend: reg
        },
        {
          examples: reg
        }
      )).limit(20).get().then((res) => {
        console.log(res.result.data);
        cb && cb(res.result.data);
      });
    }
  };
  const baseUrl$1 = "https://ypjg.ahsyjj.cn:3510/";
  function get(url) {
    return new Promise((resolve, reject) => {
      $$2.ajax({
        url: baseUrl$1 + url,
        type: "get",
        success(res) {
          resolve(res);
        },
        error(err) {
          window.location.href = "http://zhjg.ahsyjj.cn:3610/#/login?redirect=%2F";
          reject(err);
        }
      });
    });
  }
  function post(param) {
    return new Promise((resolve, reject) => {
      $$2.ajax({
        url: baseUrl$1 + param.url,
        type: "post",
        contentType: param.contentType || "application/x-www-form-urlencoded",
        dataType: param.dataType || "json",
        data: param.data,
        success(res) {
          resolve(res);
        },
        error(err) {
          window.location.href = "http://zhjg.ahsyjj.cn:3610/#/login?redirect=%2F";
          reject(err);
        }
      });
    });
  }
  function _getXkdbListplus(data) {
    return post({
      url: "spd/xkba/getXkdbListplus.do",
      data: {
        ...{
          sbr: "",
          ajbh: "",
          sbrzjhm: "",
          sxmc: "",
          hjmc: "",
          sbsjq: "",
          sbsjz: "",
          zxhjmc: "",
          clbc: "0",
          page: 1,
          rows: 1e3
        },
        ...data
      }
    });
  }
  function _getXkybListplus(data) {
    return post({
      url: "spd/xkba/getXkybListplus.do",
      data: {
        ...{
          sbr: "",
          ajbh: "",
          sbrzjhm: "",
          sxmc: "",
          hjmc: "",
          slrqq: "",
          slrqz: "",
          cnbjrqq: "",
          cnbjrqz: "",
          sfzz: "",
          zxhjmc: "",
          page: 1,
          rows: 1e3
        },
        ...data
      }
    });
  }
  function _tjpage(data) {
    return post({
      url: "spd/tj/tjpage.do",
      data: {
        ...{
          sbr: "",
          sbrzjhm: "",
          sxmc: "",
          jdswh: "",
          ajbh: "",
          unitCode: "342100",
          slrqq: "",
          slrqz: "",
          sbsjq: "2020-04-20",
          sbsjz: "",
          bjrqq: "",
          bjrqz: "",
          hjmc: "",
          sbzt: "",
          xklbzldm: "",
          dwzsysx: "",
          dwhjsysx: "",
          zdhysftg: "",
          bljg: "",
          sfzdhy: "",
          sfcngz: "",
          cpmc: "",
          sfgq: "",
          gqzt: "",
          xzqhdm: "34",
          page: 1,
          rows: 1e3
        },
        ...data
      }
    });
  }
  function shenpiRecord(id) {
    return post({
      url: "spd/shenp/shenpiRecord.do",
      data: {
        licStateCode: "10",
        xksbxxid: id
      }
    });
  }
  function findJsp(id, activityinstid) {
    return get("spd/xkba/findJsp.do?id=" + id + "&activityinstid=" + activityinstid);
  }
  async function parseShenpiRecord(id) {
    const { items: records } = await shenpiRecord(id);
    let spy = "", jcy = "", youxian = false, spfb = "";
    for (const i of records) {
      if (i.blrxm == "周冬" && i.spyj.match(/请(.{2,4})办理/)) {
        spy = i.spyj;
      }
      if (i.blrxm == "吴文华" && i.spyj && i.spyj.match(/请(.{2,4})办理/)) {
        jcy = i.spyj;
      }
      if (i.bmmc == "许可注册处" && i.spyj && i.spyj.match(/优先/)) {
        youxian = i.spyj;
      }
    }
    for (const i of records) {
      if (spy.match(i.blrxm) && i.spjg == "材料补充" && i.spyj) {
        spfb += " || " + i.spyj;
      }
    }
    if (!spfb)
      spfb = "无";
    const res = { spy, jcy, youxian, spfb, xksbxxid: id };
    await DB.setSPJLCoud(res);
    return res;
  }
  async function getDjym(id) {
    return post({
      url: "spd/shenp/getDjym.do",
      dataType: "text",
      data: {
        xksbxxid: id
      }
    });
  }
  async function getCaseHTML(id) {
    const djym = await getDjym(id);
    return get(`qyd/${djym}?xkbaSbxx.xksbxxid=${id}&xkbaSxxx.djym=matter/register&applyOptType=view`);
  }
  async function getCPMC(id) {
    const html = await getCaseHTML(id);
    let sxmc = /class="split-title-shenbao">(.*?)</.exec(html)[1];
    let sbr = /name="xkbaSbxx.sbr".*?value="(.*?)"/.exec(html)[1];
    let cpmc = /id="cpmc"[\s\S]*?value="(.*?)"/.exec(html)[1];
    let _regCode = /id="ylqxzczh"[\s\S]*?value="(.*?)"/.exec(html);
    let regCode = _regCode ? _regCode[1] : "";
    let classCode = /id="flbm(huixian)?"[\s\S]*?value="(.*?)"/.exec(html)[2];
    let _scdz = /input id="scdz(null)?"[\s\S]*?value="(.*?)"/.exec(html);
    let scdz;
    if (!_scdz) {
      scdz = /textarea id="scdz(null)?"[\s\S]*?>(.*?)</.exec(html)[2];
    } else {
      scdz = _scdz[2];
    }
    let ggxh = /id="(xh|bz)gg"[\s\S]*?>(.*?)</.exec(html)[2];
    let rtn = { xksbxxid: id, cpmc, regCode, classCode, scdz, ggxh, sxmc, sbr };
    return rtn;
  }
  async function _addMoreInfo(res) {
    let xksbxxids = [];
    const _records = res.records.sort((a, b) => {
      return +new Date(a.slrq) - +new Date(b.slrq);
    });
    const records = [];
    for (const i of _records) {
      if (xksbxxids.indexOf(i.xksbxxid) === -1) {
        xksbxxids.push(i.xksbxxid);
        records.push(i);
      }
    }
    let jbrInfos = await DB.getJbrInfo(xksbxxids);
    const list_gq_bh = [];
    const list_gq_wbh = [];
    const list_wgq = [];
    let jbr_list = [];
    const { deptName } = await xkbasys.getUser();
    for (const i of records) {
      if (jbrInfos[i.xksbxxid] === void 0) {
        jbrInfos[i.xksbxxid] = await parseShenpiRecord(i.xksbxxid);
      } else {
        if (i.sxmc.indexOf("首次") !== -1 && (!jbrInfos[i.xksbxxid].spy || !jbrInfos[i.xksbxxid].jcy)) {
          if (!jbrInfos[i.xksbxxid].spy && deptName === "注册审评部" && (i.hjmc.indexOf("注册审评") !== -1 || i.hjmc.indexOf("业务部门经办人综合评定") !== -1)) {
            jbrInfos[i.xksbxxid] = await parseShenpiRecord(i.xksbxxid);
          }
          if (!jbrInfos[i.xksbxxid].jcy && deptName === "医疗器械检查部" && i.hjmc.indexOf("器械检查") !== -1) {
            jbrInfos[i.xksbxxid] = await parseShenpiRecord(i.xksbxxid);
          }
        }
      }
      if (i.sxmc.indexOf("生产许可证") === -1 && (i.cpmc.trim() === "" && (jbrInfos[i.xksbxxid].cpmc === void 0 || jbrInfos[i.xksbxxid].cpmc === "") || !jbrInfos[i.xksbxxid].scdz && i.sxmc.indexOf("首次") === -1)) {
        let tmp = await getCPMC(i.xksbxxid);
        jbrInfos[i.xksbxxid].cpmc = tmp.cpmc;
        jbrInfos[i.xksbxxid].scdz = tmp.scdz;
        delete jbrInfos[i.xksbxxid]._id;
        DB.setSPJLCoud(jbrInfos[i.xksbxxid]);
      }
      const item = {
        ...i,
        ...jbrInfos[i.xksbxxid]
      };
      if (i.gqzt === "1") {
        if (i.hjmc == "注册审评部技术审评" || i.hjmc == "业务部门经办人综合评定") {
          list_gq_bh.push(item);
        } else {
          list_gq_wbh.push(item);
        }
      } else {
        list_wgq.push(item);
      }
      if (item.spy)
        jbr_list.push(item.spy.match(/请(.*?)办理/)[1]);
      if (item.jcy)
        jbr_list.push(item.jcy.match(/请(.*?)办理/)[1]);
    }
    res.records = list_gq_bh.concat(list_gq_wbh).concat(list_wgq);
    res.jbrList = Array.from(new Set(jbr_list)).map((i) => {
      return {
        value: i,
        label: i
      };
    });
    res.jbrList.push({
      value: "",
      label: "全部"
    });
    return res;
  }
  function findShenBanInfo(id) {
    return post({
      url: "spd/shenp/findShenBanInfo.do",
      data: { id, hjid: id }
    });
  }
  const xkbasys = {
    getXkdbListplus(data) {
      return new Promise(async (resolve, reject) => {
        ElementPlus.ElMessage.info("加载我的待办...");
        let db_res = await _getXkdbListplus(data);
        ElementPlus.ElMessage.info("加载我的已办...");
        let yb_res = await _getXkybListplus({
          ...data,
          zxhjmc: "企业整改材料补充"
        });
        ElementPlus.ElMessage.info("加载经办人信息...");
        const res = await _addMoreInfo({
          ...db_res,
          records: db_res.records.concat(yb_res.records),
          total: db_res.total + yb_res.total
        });
        resolve(res);
      });
    },
    getXkybListplus(data) {
      return new Promise(async (resolve, reject) => {
        let res = await _getXkybListplus(data);
        res = await _addMoreInfo(res);
        res.records = res.records.filter((i) => {
          return i.gqzt !== "1";
        }).sort((a, b) => {
          return +new Date(b.slrq) - +new Date(a.slrq);
        });
        resolve(res);
      });
    },
    tjpage(data) {
      return _tjpage(data);
    },
    getCaseInfo(id) {
      return new Promise(async (resolve, reject) => {
        const info = await findShenBanInfo(id);
        getCaseHTML(id).then((html) => {
          let cpmc = /id="cpmc"[\s\S]*?value="(.*?)"/.exec(html)[1];
          let _regCode = /id="ylqxzczh"[\s\S]*?value="(.*?)"/.exec(html);
          let regCode = _regCode ? _regCode[1] : "";
          let classCode = /id="flbm(huixian)?"[\s\S]*?value="(.*?)"/.exec(html)[2];
          let _scdz = /input id="scdz(null)?"[\s\S]*?value="(.*?)"/.exec(html);
          let scdz;
          if (!_scdz) {
            scdz = /textarea id="scdz(null)?"[\s\S]*?>(.*?)</.exec(html)[2];
          } else {
            scdz = _scdz[2];
          }
          let ggxh = /id="(xh|bz)gg"[\s\S]*?>(.*?)</.exec(html)[2];
          resolve({
            xksbxxid: id,
            cpmc,
            regCode,
            classCode,
            scdz,
            ggxh,
            ajbh: info.ajbh,
            sbr: info.sbr,
            sxmc: info.sxmc,
            slrq: info.slrq.substring(0, 10)
          });
        });
      });
    },
    getUser() {
      return post({
        url: "spd/cbxx/getUser"
      });
    },
    todo(id, hjmc, activityinstid) {
      console.warn(id, hjmc, activityinstid);
      findJsp(id, activityinstid).then((res) => {
        console.warn(res.jspLocation);
        if (window.Frame && window.Frame.openNewMainTab) {
          const options = {
            title: hjmc,
            url: res.jspLocation + "?xksbxxid=" + id + "&activityinstid=" + activityinstid,
            closable: true
          };
          window.Frame.openNewMainTab(options);
        } else {
          window.open(
            "https://ypjg.ahsyjj.cn:3510/spd/" + res.jspLocation + "?xksbxxid=" + id + "&activityinstid=" + activityinstid
          );
        }
      });
    },
    sqclmlXkbaList(id) {
      return new Promise((resolve, reject) => {
        let sqclmlXkbaList = JSON.parse(localStorage.getItem("sqclmlXkbaList")) || {};
        if (sqclmlXkbaList[id])
          resolve(sqclmlXkbaList);
        else {
          post({
            url: "spd/shenp/ShenBaoShenCha.do",
            data: {
              xksbxxid: id,
              zxbb: 1,
              licStateCode: 10
            }
          }).then((res) => {
            sqclmlXkbaList[id] = { list: res.items };
            localStorage.setItem("sqclmlXkbaList", JSON.stringify(sqclmlXkbaList));
            resolve(sqclmlXkbaList);
          });
        }
      });
    },
    async getToken(url) {
      return new Promise((resolve, reject) => {
        $$2.ajax({
          url,
          success: (res) => {
            let token = /token=(.*?)"/.exec(res)[1];
            resolve(token);
          }
        });
      });
    },
    clbc(id) {
      window.open(
        `https://ypjg.ahsyjj.cn:3510/spd/cbxx/getUser?page=clbc&id=${id}`
      );
    },
    hyjy(id) {
      window.open(
        `https://ypjg.ahsyjj.cn:3510/spd/cbxx/getUser?page=hyjy&id=${id}`
      );
    },
    pdbg(id) {
      window.open(
        `https://ypjg.ahsyjj.cn:3510/spd/cbxx/getUser?page=pdbg&id=${id}`
      );
    },
    hcqd(id) {
      window.open(
        `https://ypjg.ahsyjj.cn:3510/spd/cbxx/getUser?page=pdbg&id=${id}`
      );
    }
  };
  const _hoisted_1$f = { class: "search" };
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    __name: "MyTodoSearch",
    props: {
      jbrList: {
        type: Array,
        default: []
      }
    },
    emits: ["change", "syncChange", "statistic"],
    setup(__props, { expose, emit }) {
      const props = __props;
      const more = vue.ref(false);
      const form = vue.ref({});
      expose({ form });
      function submit() {
        if (form.value.sbsjq) {
          form.value.sbsjq = form.value.sbsjq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.sbsjz) {
          form.value.sbsjz = form.value.sbsjz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        emit("change", form.value);
      }
      vue.onMounted(() => {
        xkbasys.getUser().then((res) => {
          form.value.jbr = res.name;
        });
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowDown = vue.resolveComponent("ArrowDown");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$f, [
          vue.createVNode(_component_el_form, {
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "企业名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sbr,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sbr = $event),
                    onInput: _cache[1] || (_cache[1] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "受理编号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.ajbh,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.ajbh = $event),
                    onInput: _cache[3] || (_cache[3] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "产品名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.cpmc,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.cpmc = $event),
                    onInput: _cache[5] || (_cache[5] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "经办人",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.jbr,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.jbr = $event),
                    onChange: _cache[7] || (_cache[7] = ($event) => emit("syncChange", form.value)),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.jbrList, (item) => {
                        return vue.openBlock(), vue.createBlock(_component_el_option, {
                          key: item.value,
                          label: item.label,
                          value: item.value
                        }, null, 8, ["label", "value"]);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: submit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("筛选")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[8] || (_cache[8] = ($event) => emit("statistic")),
                    icon: vue.unref(ElementPlusIconsVue.PieChart)
                  }, null, 8, ["icon"]),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[9] || (_cache[9] = ($event) => more.value = !more.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_icon, null, {
                        default: vue.withCtx(() => [
                          !more.value ? (vue.openBlock(), vue.createBlock(_component_ArrowRight, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_ArrowDown, { key: 1 }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          more.value ? (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.hjmc,
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.hjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "待受理",
                        value: "待受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已受理",
                        value: "已受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审查中",
                        value: "审查中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审批中",
                        value: "审批中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "制证",
                        value: "制证"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "技术审评",
                        value: "技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "送达",
                        value: "送达"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "中心办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.zxhjmc,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.zxhjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人方案制定",
                        value: "器械检查部经办人方案制定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人检查综合评定",
                        value: "器械检查部经办人检查综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "中心主任签批",
                        value: "中心主任签批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人审核",
                        value: "器械检查部负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业整改",
                        value: "企业整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部负责人分办",
                        value: "注册审评部负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人分办",
                        value: "业务部门负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人综合评定",
                        value: "业务部门经办人综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人审批",
                        value: "业务部门负责人审批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部接收分发",
                        value: "质量部接收分发"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人分办",
                        value: "器械检查部负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部审核",
                        value: "质量部审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "中心副主任（分管）核定",
                        value: "中心副主任（分管）核定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人审批",
                        value: "器械检查部负责人审批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部技术审评",
                        value: "注册审评部技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人审核",
                        value: "业务部门负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部上报省局",
                        value: "质量部上报省局"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部经办人综合评定",
                        value: "注册审评部经办人综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业整改材料补充",
                        value: "企业整改材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人资料审查",
                        value: "器械检查部经办人资料审查"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业材料补充",
                        value: "企业材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部负责人审核",
                        value: "注册审评部负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人资料审查",
                        value: "业务部门经办人资料审查"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人方案制定",
                        value: "企业材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业材料补充",
                        value: "业务部门经办人方案制定"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "是否材料补充",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.clbc,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.clbc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: "0"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "申请时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjq,
                            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.sbsjq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjz,
                            "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.sbsjz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const MyTodoSearch_vue_vue_type_style_index_0_scoped_a285de8f_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const MyTodoSearch = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-a285de8f"]]);
  const _hoisted_1$e = { class: "btn" };
  const _hoisted_2$b = ["src"];
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    __name: "CaseRecords",
    setup(__props, { expose }) {
      const show = vue.ref(false);
      const id = vue.ref("");
      expose({ show, id });
      const src = vue.computed(() => {
        return `https://ypjg.ahsyjj.cn:3510/spd/pj/spjl?xksbxxid=${id.value}`;
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createBlock(_component_el_dialog, {
          modelValue: show.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => show.value = $event),
          title: "办理记录",
          width: "1000px"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$e, [
              vue.createVNode(_component_el_button, {
                size: "small",
                icon: vue.unref(ElementPlusIconsVue.Refresh),
                onClick: _cache[0] || (_cache[0] = ($event) => id.value = id.value + "&t=" + new Date().getTime())
              }, null, 8, ["icon"])
            ]),
            vue.createElementVNode("iframe", {
              frameborder: "0",
              src: vue.unref(src),
              style: { "display": "block", "border": "0", "width": "100%", "height": "600px" }
            }, null, 8, _hoisted_2$b)
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  });
  const CaseRecords_vue_vue_type_style_index_0_scoped_93351388_lang = "";
  const CaseRecords = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-93351388"]]);
  async function copy(text) {
    if (!text)
      return;
    await Clipboard.Clipboard.copy(text);
    ElementPlus.ElMessage.success("已复制：" + text);
  }
  function formatExcelDate(numb, format = "-") {
    if (!numb) {
      return "";
    }
    let time = new Date(
      new Date("1900-1-1").getTime() + (numb - 1) * 3600 * 24 * 1e3
    );
    const year = time.getFullYear() + "";
    const month = time.getMonth() + 1 + "";
    const date = time.getDate();
    if (format && format.length === 1) {
      return year + format + (+month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
    }
    return year + (+month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date);
  }
  function dateFormat(date) {
    return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
  }
  const _withScopeId$6 = (n) => (vue.pushScopeId("data-v-d24c8660"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$d = { class: "list" };
  const _hoisted_2$a = ["onClick"];
  const _hoisted_3$a = { key: 0 };
  const _hoisted_4$9 = { key: 1 };
  const _hoisted_5$9 = ["onClick"];
  const _hoisted_6$3 = ["onClick"];
  const _hoisted_7$3 = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_8$3 = ["onClick"];
  const _hoisted_9$3 = { key: 0 };
  const _hoisted_10$3 = { key: 1 };
  const _hoisted_11$3 = ["onClick"];
  const _hoisted_12$3 = ["onClick"];
  const _hoisted_13$3 = {
    key: 0,
    style: { "display": "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center" }
  };
  const _hoisted_14$3 = { key: 0 };
  const _hoisted_15$3 = { key: 1 };
  const _hoisted_16$3 = ["onClick"];
  const _hoisted_17$2 = {
    key: 0,
    class: "foot"
  };
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    __name: "CaseList",
    props: {
      data: {
        type: Array,
        default: []
      },
      page: {
        type: Boolean,
        default: true
      },
      filter: {
        type: Array,
        default: []
      }
    },
    setup(__props) {
      const props = __props;
      const filter = vue.computed(() => {
        const f = {};
        for (const i of props.filter) {
          f[i] = true;
        }
        return f;
      });
      const recordsRef = vue.ref();
      function bljl(id) {
        recordsRef.value.id = id;
        recordsRef.value.show = true;
      }
      function rowClassName(p) {
        return p.row.gqzt === "1" && (p.row.hjmc == "注册审评部技术审评" || p.row.hjmc == "业务部门经办人综合评定") ? "clybc" : "";
      }
      let quickViewLoading = vue.ref({});
      function quickView(row) {
        const { xksbxxid: id } = row;
        if (quickViewLoading.value[id])
          return;
        quickViewLoading.value[id] = true;
        xkbasys.sqclmlXkbaList(id).then(async (res) => {
          if (!res[id].baseinfo) {
            res[id].baseinfo = row;
            localStorage.setItem("sqclmlXkbaList", JSON.stringify(res));
            console.warn(JSON.parse(JSON.stringify(res)));
          }
          let key = encodeURIComponent(res[id].list[0].fileId);
          let token_url = `https://ypjg.ahsyjj.cn:3510/qyd/fileManager/preview.do?key=${key}`;
          let token = await xkbasys.getToken(token_url);
          window.open(
            `https://ypjg.ahsyjj.cn:3510/fileManager/preview?key=${key}&token=${token}&contents=local&id=${row.xksbxxid}`,
            "_blank"
          );
          quickViewLoading.value[id] = false;
        });
      }
      return (_ctx, _cache) => {
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_CopyDocument = vue.resolveComponent("CopyDocument");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_Warning = vue.resolveComponent("Warning");
        const _component_el_tag = vue.resolveComponent("el-tag");
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_VideoPause = vue.resolveComponent("VideoPause");
        const _component_el_table = vue.resolveComponent("el-table");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$d, [
          vue.createVNode(_component_el_table, {
            class: "table",
            "row-class-name": rowClassName,
            data: props.data,
            border: "",
            size: "small"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_table_column, {
                type: "index",
                index: (i) => i + 1,
                align: "center"
              }, null, 8, ["index"]),
              vue.createVNode(_component_el_table_column, {
                prop: "sbr",
                label: "企业名称"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.sbr)
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.sbr), 1)
                  ], 8, _hoisted_2$a)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "xzqhmc",
                label: "区域",
                width: "80"
              }),
              vue.createVNode(_component_el_table_column, {
                label: "联系人/电话",
                width: "110"
              }, {
                default: vue.withCtx((scope) => [
                  scope.row.wtdlr ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$a, [
                    vue.createElementVNode("div", null, vue.toDisplayString(scope.row.wtdlr), 1),
                    vue.createElementVNode("div", null, vue.toDisplayString(scope.row.wtdlrlxdh), 1)
                  ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$9, [
                    vue.createElementVNode("div", null, [
                      vue.createTextVNode(vue.toDisplayString(scope.row.lxdlr) + " ", 1),
                      vue.createVNode(_component_el_icon, { color: "#e6a23c" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_Warning)
                        ]),
                        _: 1
                      })
                    ]),
                    vue.createElementVNode("div", null, vue.toDisplayString(scope.row.lxdlrsjhm), 1)
                  ]))
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "ajbh",
                label: "受理编号",
                width: "105"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.ajbh)
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.ajbh), 1)
                  ], 8, _hoisted_5$9)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "sxmc",
                label: "事项名称"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "clickable",
                    onClick: ($event) => vue.unref(xkbasys).todo(scope.row.xksbxxid, scope.row.hjmc, scope.row.activityInstId)
                  }, [
                    vue.createTextVNode(vue.toDisplayString(scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/) ? scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/)[1] : scope.row.sxmc) + " ", 1),
                    _hoisted_7$3,
                    scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/) ? (vue.openBlock(), vue.createBlock(_component_el_tag, {
                      key: 0,
                      type: scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/)[3] == "首次" ? "success" : scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/)[3] == "变更" ? "danger" : scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/)[3] == "延续" ? "warning" : "info"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/) ? scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/)[2] : ""), 1)
                      ]),
                      _: 2
                    }, 1032, ["type"])) : vue.createCommentVNode("", true),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/) ? scope.row.sxmc.match(/(.*?)((首次|变更|延续)注册)(.*?)/)[4] : ""), 1)
                  ], 8, _hoisted_6$3)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "cpmc",
                label: "产品名称"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "clickable",
                    onClick: ($event) => quickView(scope.row)
                  }, [
                    vue.withDirectives(vue.createVNode(_component_el_icon, { class: "is-loading" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_Loading)
                      ]),
                      _: 2
                    }, 1536), [
                      [vue.vShow, vue.unref(quickViewLoading)[scope.row.xksbxxid]]
                    ]),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.cpmc.trim() ? scope.row.cpmc.replace(/[(品种:)\(\)]/g, "") : "xxxxxxxx"), 1)
                  ], 8, _hoisted_8$3)
                ]),
                _: 1
              }),
              !vue.unref(filter).jbr ? (vue.openBlock(), vue.createBlock(_component_el_table_column, {
                key: 0,
                label: "经办人",
                width: "120"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", null, [
                    scope.row.spy ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$3, vue.toDisplayString(scope.row.spy) + " ", 1)) : vue.createCommentVNode("", true),
                    scope.row.jcy ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$3, vue.toDisplayString(scope.row.jcy) + " ", 1)) : vue.createCommentVNode("", true)
                  ])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.createVNode(_component_el_table_column, {
                prop: "slrq",
                label: "申报时间",
                width: "100",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.slrq.substring(0, 10))
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.sbsj ? scope.row.sbsj.substring(0, 10) : ""), 1)
                  ], 8, _hoisted_11$3)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "slrq",
                label: "受理时间",
                width: "100",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.slrq.substring(0, 10))
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.slrq ? scope.row.slrq.substring(0, 10) : ""), 1)
                  ], 8, _hoisted_12$3)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                label: "承诺时间",
                width: "100",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  scope.row.gqzt == "1" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13$3, [
                    vue.createElementVNode("div", null, [
                      vue.createVNode(_component_el_icon, {
                        color: "#7bd153",
                        size: "24"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_VideoPause)
                        ]),
                        _: 1
                      })
                    ]),
                    scope.row.hjmc == "注册审评部技术审评" || scope.row.hjmc == "业务部门经办人综合评定" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14$3, "材料已补充")) : vue.createCommentVNode("", true)
                  ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_15$3, vue.toDisplayString(scope.row.cnbjrq ? scope.row.cnbjrq.substring(0, 10) : ""), 1))
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "hjmc",
                label: "当前环节",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "clickable",
                    onClick: ($event) => bljl(scope.row.xksbxxid)
                  }, vue.toDisplayString(scope.row.hjmc), 9, _hoisted_16$3)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "hjsysx",
                label: "总剩余时限",
                width: "56",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", null, vue.toDisplayString(scope.row.hjsysx ? scope.row.hjsysx.replace(/日(.*?)$/g, "日") : ""), 1)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "zsysx",
                label: "中心总时",
                width: "50",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", null, vue.toDisplayString(scope.row.zsysx ? scope.row.zsysx.replace(/日(.*?)$/g, "日") : ""), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["data"]),
          props.page ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_17$2, "foot")) : vue.createCommentVNode("", true),
          vue.createVNode(CaseRecords, {
            ref_key: "recordsRef",
            ref: recordsRef
          }, null, 512)
        ]);
      };
    }
  });
  const CaseList_vue_vue_type_style_index_0_scoped_d24c8660_lang = "";
  const CaseList = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-d24c8660"]]);
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    __name: "MyTodo",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      let _todoList;
      const todoList = vue.ref([]);
      const jbrList = vue.ref([{ label: "全部", value: "" }]);
      const searchRef = vue.ref();
      function getList() {
        loading.value = true;
        xkbasys.getXkdbListplus({
          ...searchRef.value.form
          // rows: 10, page: 10
        }).then((res) => {
          console.warn(res);
          _todoList = res.records;
          jbrList.value = res.jbrList || [{ label: "全部", value: "" }];
          statistic.value = initStatistic();
          onSyncSearch();
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      function onSyncSearch(form) {
        const { jbr, sbr, ajbh, cpmc } = searchRef.value.form;
        todoList.value = _todoList.filter((i) => {
          let flag = (i.jcy + i.spy).indexOf(jbr) !== -1;
          flag && (flag = sbr ? i.sbr.indexOf(sbr) !== -1 : true);
          flag && (flag = ajbh ? i.ajbh.indexOf(ajbh) !== -1 : true);
          flag && (flag = cpmc ? i.cpmc.indexOf(cpmc) !== -1 : true);
          return flag;
        });
      }
      const showStatistic = vue.ref(false);
      const statistic = vue.ref();
      const initStatistic = () => {
        let statistic2 = {};
        for (const i of _todoList) {
          let spy = i.spy.match(/请(.*?)办理/)[1];
          let _sxmc = i.sxmc.match(/.{2}注册/);
          let sxmc = _sxmc ? _sxmc[0] : i.sxmc.match(/说明书变更/)[0];
          if (!statistic2[spy])
            statistic2[spy] = {
              [sxmc]: 0
            };
          if (!statistic2[spy][sxmc])
            statistic2[spy][sxmc] = 0;
          statistic2[spy][sxmc]++;
        }
        let tmp = [];
        let total = 0;
        for (const i in statistic2) {
          let t = 0;
          for (const j in statistic2[i]) {
            t += statistic2[i][j];
          }
          total += t;
          tmp.push({
            审评员: i,
            ...statistic2[i],
            小计: t
          });
        }
        tmp = tmp.sort((a, b) => b.小计 - a.小计);
        tmp.push({ 审评员: "总计", 小计: total });
        return tmp;
      };
      function onStatistic() {
        showStatistic.value = true;
      }
      vue.onMounted(() => {
        height.value = $(".mytodo").parent().parent()[0].clientHeight;
        getList();
      });
      return (_ctx, _cache) => {
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "mytodo",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(MyTodoSearch, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            jbrList: jbrList.value,
            onChange: onSearch,
            onSyncChange: onSyncSearch,
            onStatistic
          }, null, 8, ["jbrList"]),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: todoList.value,
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createVNode(_component_el_dialog, {
            modelValue: showStatistic.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showStatistic.value = $event),
            title: "统计",
            width: "800px"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_table, { data: statistic.value }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    prop: "审评员",
                    label: "审评员"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "首次注册",
                    label: "首次注册"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "变更注册",
                    label: "变更注册"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "延续注册",
                    label: "延续注册"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "说明书变更",
                    label: "说明书变更"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "小计",
                    label: "小计"
                  })
                ]),
                _: 1
              }, 8, ["data"])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 4);
      };
    }
  });
  const MyTodo_vue_vue_type_style_index_0_scoped_9fa22f96_lang = "";
  const MyTodoVue = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-9fa22f96"]]);
  const _hoisted_1$c = { class: "search" };
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    __name: "MyDoneSearch",
    props: {
      jbrList: {
        type: Array,
        default: []
      }
    },
    emits: ["change", "syncChange"],
    setup(__props, { expose, emit }) {
      const more = vue.ref(false);
      const form = vue.ref({});
      expose({ form });
      function submit() {
        if (form.value.slrqq) {
          form.value.slrqq = form.value.slrqq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.slrqz) {
          form.value.slrqz = form.value.slrqz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.cnbjrqq) {
          form.value.cnbjrqq = form.value.cnbjrqq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.cnbjrqz) {
          form.value.cnbjrqz = form.value.cnbjrqz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        emit("change", form.value);
      }
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowDown = vue.resolveComponent("ArrowDown");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$c, [
          vue.createVNode(_component_el_form, {
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "企业名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sbr,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sbr = $event),
                    onInput: _cache[1] || (_cache[1] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "受理编号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.ajbh,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.ajbh = $event),
                    onInput: _cache[3] || (_cache[3] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "产品名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.cpmc,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.cpmc = $event),
                    onChange: _cache[5] || (_cache[5] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: submit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("筛选")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[6] || (_cache[6] = ($event) => more.value = !more.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_icon, null, {
                        default: vue.withCtx(() => [
                          !more.value ? (vue.openBlock(), vue.createBlock(_component_ArrowRight, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_ArrowDown, { key: 1 }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          more.value ? (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.hjmc,
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.hjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "受理",
                        value: "受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审查中",
                        value: "审查中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审批中",
                        value: "审批中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补齐补正",
                        value: "补齐补正"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补充材料",
                        value: "补充材料"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "整改",
                        value: "整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "制证",
                        value: "制证"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "技术审评",
                        value: "技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "送达",
                        value: "送达"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "签收",
                        value: "签收"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "流程结束",
                        value: "流程结束"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "中心办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.zxhjmc,
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.zxhjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人方案制定",
                        value: "器械检查部经办人方案制定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人检查综合评定",
                        value: "器械检查部经办人检查综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "中心主任签批",
                        value: "中心主任签批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人审核",
                        value: "器械检查部负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业整改",
                        value: "企业整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部负责人分办",
                        value: "注册审评部负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人分办",
                        value: "业务部门负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人综合评定",
                        value: "业务部门经办人综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人审批",
                        value: "业务部门负责人审批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部接收分发",
                        value: "质量部接收分发"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人分办",
                        value: "器械检查部负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部审核",
                        value: "质量部审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "中心副主任（分管）核定",
                        value: "中心副主任（分管）核定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人审批",
                        value: "器械检查部负责人审批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部技术审评",
                        value: "注册审评部技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人审核",
                        value: "业务部门负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部上报省局",
                        value: "质量部上报省局"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部经办人综合评定",
                        value: "注册审评部经办人综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业整改材料补充",
                        value: "企业整改材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人资料审查",
                        value: "器械检查部经办人资料审查"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业材料补充",
                        value: "企业材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部负责人审核",
                        value: "注册审评部负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人资料审查",
                        value: "业务部门经办人资料审查"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人方案制定",
                        value: "企业材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业材料补充",
                        value: "业务部门经办人方案制定"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "制证状态",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfzz,
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.sfzz = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已制证",
                        value: "is null"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "未制证",
                        value: "is not null"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "受理时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqq,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.slrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqz,
                            "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.slrqz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "承诺时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.cnbjrqq,
                            "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.cnbjrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.cnbjrqz,
                            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.cnbjrqz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const MyDoneSearch_vue_vue_type_style_index_0_scoped_4a89fadc_lang = "";
  const MyDoneSearch = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-4a89fadc"]]);
  const _hoisted_1$b = { class: "pagiNation" };
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "MyDone",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      let _doneList = [];
      const doneList = vue.ref([]);
      const searchRef = vue.ref();
      const pageInfo = vue.ref({
        page: 1,
        size: 50
      });
      const pageTotal = vue.ref(0);
      vue.watch(pageInfo.value, () => {
        getList();
      });
      function getList() {
        loading.value = true;
        xkbasys.getXkybListplus({
          ...searchRef.value.form,
          rows: pageInfo.value.size,
          page: pageInfo.value.page
        }).then((res) => {
          pageTotal.value = res.total;
          _doneList = res.records;
          onSyncSearch();
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      function onSyncSearch() {
        doneList.value = _doneList.filter((i) => {
          const { sbr, ajbh } = searchRef.value.form;
          let flag = sbr ? i.sbr.indexOf(sbr) !== -1 : true;
          flag && (flag = ajbh ? i.ajbh.indexOf(ajbh) !== -1 : true);
          return flag;
        });
      }
      vue.onMounted(() => {
        height.value = $(".mydone").parent().parent()[0].clientHeight;
        getList();
      });
      return (_ctx, _cache) => {
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "mydone",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(MyDoneSearch, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            onChange: onSearch,
            onSyncChange: onSyncSearch
          }, null, 512),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: doneList.value,
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$b, [
            vue.createVNode(_component_el_pagination, {
              small: "",
              background: "",
              layout: "prev, pager, next,sizes",
              total: pageTotal.value,
              "page-sizes": [50, 100, 200, 500],
              "page-size": pageInfo.value.size,
              "onUpdate:pageSize": _cache[0] || (_cache[0] = ($event) => pageInfo.value.size = $event),
              "current-page": pageInfo.value.page,
              "onUpdate:currentPage": _cache[1] || (_cache[1] = ($event) => pageInfo.value.page = $event)
            }, null, 8, ["total", "page-size", "current-page"])
          ])
        ], 4);
      };
    }
  });
  const MyDone_vue_vue_type_style_index_0_scoped_03eb911a_lang = "";
  const MyDoneVue = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-03eb911a"]]);
  const _withScopeId$5 = (n) => (vue.pushScopeId("data-v-f48158fa"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$a = { class: "search" };
  const _hoisted_2$9 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_3$9 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$8 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_5$8 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "MySearchSearch",
    props: {
      jbrList: {
        type: Array,
        default: []
      }
    },
    emits: ["change", "syncChange"],
    setup(__props, { expose, emit }) {
      const more = vue.ref(false);
      const form = vue.ref({
        unitCode: "342100",
        sbsjq: "2020-04-20"
      });
      expose({ form });
      function submit() {
        if (form.value.slrqq) {
          form.value.slrqq = form.value.slrqq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.slrqz) {
          form.value.slrqz = form.value.slrqz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.sbsjq) {
          form.value.sbsjq = form.value.sbsjq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.sbsjz) {
          form.value.sbsjz = form.value.sbsjz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.bjrqq) {
          form.value.bjrqq = form.value.bjrqq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.bjrqz) {
          form.value.bjrqz = form.value.bjrqz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        emit("change", form.value);
      }
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowDown = vue.resolveComponent("ArrowDown");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$a, [
          vue.createVNode(_component_el_form, {
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "企业名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sbr,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sbr = $event),
                    onInput: _cache[1] || (_cache[1] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "受理编号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.ajbh,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.ajbh = $event),
                    onInput: _cache[3] || (_cache[3] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "事项名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sxmc,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.sxmc = $event),
                    onChange: _cache[5] || (_cache[5] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "产品名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.cpmc,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.cpmc = $event),
                    onChange: _cache[7] || (_cache[7] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: submit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("筛选")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[8] || (_cache[8] = ($event) => more.value = !more.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_icon, null, {
                        default: vue.withCtx(() => [
                          !more.value ? (vue.openBlock(), vue.createBlock(_component_ArrowRight, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_ArrowDown, { key: 1 }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          more.value ? (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "申请时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjq,
                            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.sbsjq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjz,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.sbsjz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "申报状态",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sbzt,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.sbzt = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "待受理",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "办理中",
                        value: "3"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已办结",
                        value: "2"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.hjmc,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.hjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "受理",
                        value: "受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审查中",
                        value: "审查中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审批中",
                        value: "审批中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补齐补正",
                        value: "补齐补正"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补充材料",
                        value: "补充材料"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "整改",
                        value: "整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "制证",
                        value: "制证"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "技术审评",
                        value: "技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "送达",
                        value: "送达"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "签收",
                        value: "签收"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "流程结束",
                        value: "流程结束"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              _hoisted_2$9,
              vue.createVNode(_component_el_form_item, {
                label: "受理时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqq,
                            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.slrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqz,
                            "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.slrqz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "业务类型",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.xklbzldm,
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.value.xklbzldm = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "新办/核发",
                        value: "01"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "变更",
                        value: "02"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "延续",
                        value: "03"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补办",
                        value: "04"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注销/撤销",
                        value: "05"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "换证",
                        value: "11"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "换发",
                        value: "12"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "决定书文号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.jdswh,
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => form.value.jdswh = $event),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              _hoisted_3$9,
              vue.createVNode(_component_el_form_item, {
                label: "办结时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.bjrqq,
                            "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => form.value.bjrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.bjrqq,
                            "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => form.value.bjrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "办理结果",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.bljg,
                    "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => form.value.bljg = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "不予受理",
                        value: "3"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "不予许可（备案）",
                        value: "2"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "准予许可（备案）",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "承诺告知",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfcngz,
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => form.value.sfcngz = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "0"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              _hoisted_4$8,
              vue.createVNode(_component_el_form_item, {
                label: "自动核验",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfzdhy,
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => form.value.sfzdhy = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "99"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "88"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "核验通过",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.zdhysftg,
                    "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => form.value.zdhysftg = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "0"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "是否挂起",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfgq,
                    "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => form.value.sfgq = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已挂起",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "未挂起",
                        value: "0"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "正在挂起",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.gqzt,
                    "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => form.value.gqzt = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "挂起结束",
                        value: "0"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "挂起中",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              _hoisted_5$8,
              vue.createVNode(_component_el_form_item, {
                label: "办理单位",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.unitCode,
                    "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => form.value.unitCode = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "药品审评查验中心",
                        value: "342100"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "所属地区",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.xzqhdm,
                    "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => form.value.xzqhdm = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "安徽省",
                        value: "34"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "合肥市",
                        value: "3401"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const MySearchSearch_vue_vue_type_style_index_0_scoped_f48158fa_lang = "";
  const MySearchSearch = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-f48158fa"]]);
  const _hoisted_1$9 = { class: "pagiNation" };
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "MySearch",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      let _doneList = [];
      const doneList = vue.ref([]);
      const searchRef = vue.ref();
      const pageInfo = vue.ref({
        page: 1,
        size: 20
      });
      const pageTotal = vue.ref(0);
      vue.watch(pageInfo.value, () => {
        getList();
      });
      function getList() {
        loading.value = true;
        xkbasys.tjpage({
          ...searchRef.value.form,
          rows: pageInfo.value.size,
          page: pageInfo.value.page
        }).then((res) => {
          console.warn(res);
          pageTotal.value = res.recordCount;
          doneList.value = res.items;
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      function onSyncSearch() {
        doneList.value = _doneList.filter((i) => {
          const { sbr, ajbh } = searchRef.value.form;
          let flag = sbr ? i.sbr.indexOf(sbr) !== -1 : true;
          flag && (flag = ajbh ? i.ajbh.indexOf(ajbh) !== -1 : true);
          return flag;
        });
      }
      vue.onMounted(() => {
        height.value = $(".mysearch").parent().parent()[0].clientHeight;
        getList();
      });
      return (_ctx, _cache) => {
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "mysearch",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(MySearchSearch, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            onChange: onSearch,
            onSyncChange: onSyncSearch
          }, null, 512),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: doneList.value,
            filter: ["jbr"],
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$9, [
            vue.createVNode(_component_el_pagination, {
              small: "",
              background: "",
              layout: "prev, pager, next,sizes, total",
              total: pageTotal.value,
              "page-sizes": [20, 50, 100, 200, 500],
              "page-size": pageInfo.value.size,
              "onUpdate:pageSize": _cache[0] || (_cache[0] = ($event) => pageInfo.value.size = $event),
              "current-page": pageInfo.value.page,
              "onUpdate:currentPage": _cache[1] || (_cache[1] = ($event) => pageInfo.value.page = $event)
            }, null, 8, ["total", "page-size", "current-page"])
          ])
        ], 4);
      };
    }
  });
  const MySearch_vue_vue_type_style_index_0_scoped_3eb907d6_lang = "";
  const MySearchVue = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-3eb907d6"]]);
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "HightLight",
    props: {
      reg: {
        type: String,
        default: ""
      },
      str: {
        type: String,
        default: ""
      }
    },
    setup(__props) {
      const props = __props;
      const el = vue.ref();
      vue.onMounted(() => {
        el.value.outerHTML = props.str.replace(RegExp(props.reg, "g"), (str) => {
          return `<span style='color: red'>${str}</span>`;
        });
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          ref_key: "el",
          ref: el
        }, null, 512);
      };
    }
  });
  const _hoisted_1$8 = { class: "sphelper-block" };
  const _hoisted_2$8 = { class: "search" };
  const _hoisted_3$8 = { class: "count" };
  const _hoisted_4$7 = { class: "tab-content" };
  const _hoisted_5$7 = {
    style: { "font-size": "12px" },
    href: ""
  };
  const _hoisted_6$2 = { class: "count" };
  const _hoisted_7$2 = { class: "tab-content" };
  const _hoisted_8$2 = ["href"];
  const _hoisted_9$2 = { class: "count" };
  const _hoisted_10$2 = { class: "tab-content" };
  const _hoisted_11$2 = { style: { "color": "gray", "font-size": "0.8em", "margin-left": "1em" } };
  const _hoisted_12$2 = ["href"];
  const _hoisted_13$2 = ["href"];
  const _hoisted_14$2 = { class: "count" };
  const _hoisted_15$2 = { class: "tab-content" };
  const _hoisted_16$2 = { style: { "color": "gray", "font-size": "0.8em", "margin-left": "1em" } };
  const _hoisted_17$1 = ["href"];
  const _hoisted_18$1 = ["href"];
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "SpHelper",
    props: {
      iscomp: {
        type: Boolean,
        default: false
      }
    },
    setup(__props, { expose }) {
      const props = __props;
      const show = vue.ref(false);
      expose({ show });
      const input = vue.ref();
      const loading = vue.ref(false);
      const value = vue.ref("");
      function onSearch() {
        console.log(value.value);
        loading.value = true;
        DB.queryClassification(value.value).then((res) => {
          console.log(res);
          result.value = res;
          loading.value = false;
        });
      }
      const activeTab = vue.ref("first");
      const result = vue.ref({
        classification: [],
        noclinical: [],
        principle: [],
        standard: []
      });
      const principle = vue.ref({
        lastUpdate: "",
        total: 0
      });
      const standard = vue.ref({
        lastUpdate: "",
        total: 0
      });
      vue.onMounted(() => {
        DB.getPrincipleInfo().then((res) => {
          principle.value = res;
        });
        DB.getStandardInfo().then((res) => {
          standard.value = res;
        });
      });
      const standardUpdateLoading = vue.ref(false);
      const standardUpdateData = vue.ref([]);
      const fileTemp = vue.ref();
      function chooseLocalStandard(e) {
        const templateFile = e.target.files[0];
        console.warn(templateFile);
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(templateFile);
        fileReader.onload = (e2) => {
          const sheet = XLSX__namespace.read(e2.target.result, {
            type: "binary",
            codepage: 936
          }).Sheets[`器械目录表`];
          console.warn(sheet);
          let tmp = sheet["!ref"].match(/(\D+)(\d+):(\D+)(\d+)/);
          let rowStart = 2;
          let rowEnd = +tmp[4] * 1;
          (tmp[3] + "").charCodeAt(0);
          let data = [];
          for (let i = rowStart; i <= rowEnd; i++) {
            let row = {};
            row.code = sheet[`B${i}`] ? sheet[`B${i}`].v : "";
            row.name = sheet[`C${i}`] ? sheet[`C${i}`].v : "";
            row.prop = sheet[`D${i}`] ? sheet[`D${i}`].v : "";
            row.pubDate = formatExcelDate(
              sheet[`E${i}`] ? sheet[`E${i}`].v : ""
            );
            row.implementDate = formatExcelDate(
              sheet[`F${i}`] ? sheet[`F${i}`].v : ""
            );
            row.useNationName = sheet[`H${i}`] ? sheet[`H${i}`].v : "";
            row.useNationLevel = sheet[`I${i}`] ? sheet[`I${i}`].v : "";
            row.useNationClass = sheet[`J${i}`] ? sheet[`J${i}`].v : "";
            row.class = sheet[`K${i}`] ? sheet[`K${i}`].v : "";
            row.state = sheet[`L${i}`] ? sheet[`L${i}`].v : "";
            row.range = sheet[`M${i}`] ? sheet[`M${i}`].v : "";
            row.belongName = sheet[`N${i}`] ? sheet[`N${i}`].v : "";
            row.belongCode = sheet[`P${i}`] ? sheet[`P${i}`].v : "";
            row.ccs = sheet[`Q${i}`] ? sheet[`Q${i}`].v : "";
            row.ics = sheet[`R${i}`] ? sheet[`R${i}`].v : "";
            row.replaceCode = sheet[`S${i}`] ? sheet[`S${i}`].v : "";
            row.cbCode = sheet[`T${i}`] ? sheet[`T${i}`].v : "";
            row.uid = row.code + row.pubDate;
            row.lastUpdate = new Date();
            data.push(row);
          }
          console.warn(data);
          standardUpdateData.value = data;
          standardUpdateLoading.value = false;
        };
      }
      async function standardUpload() {
        if (!standardUpdateData.value[0])
          return;
        standardUpdateLoading.value = true;
        let total = standard.value.total;
        let pageSize = 500;
        let pages = Math.ceil(total / pageSize);
        let cloudData = [];
        console.warn(total, pageSize, pages);
        for (let i = 0; i < pages; i++) {
          let tmp = await DB.getStandard(pageSize, i * pageSize);
          cloudData = cloudData.concat(tmp);
        }
        let cloudObj = {};
        for (const i of cloudData) {
          cloudObj[i.uid] = i;
        }
        console.warn(cloudObj);
        for (const i of standardUpdateData.value) {
          if (!cloudObj[i.uid]) {
            await DB.addStandard(i);
            console.warn(i);
          }
        }
        standardUpdateLoading.value = false;
        standardUpdateData.value = [];
        DB.getStandardInfo().then((res) => {
          standard.value = res;
        });
      }
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_card = vue.resolveComponent("el-card");
        const _component_el_tab_pane = vue.resolveComponent("el-tab-pane");
        const _component_UploadFilled = vue.resolveComponent("UploadFilled");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_QuestionFilled = vue.resolveComponent("QuestionFilled");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_tabs = vue.resolveComponent("el-tabs");
        const _component_el_drawer = vue.resolveComponent("el-drawer");
        const _component_Search = vue.resolveComponent("Search");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_drawer, {
            modelValue: show.value,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => show.value = $event),
            size: "600",
            "append-to-body": "",
            direction: "ltr",
            "with-header": false
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$8, [
                vue.createElementVNode("div", _hoisted_2$8, [
                  vue.createVNode(_component_el_input, {
                    ref_key: "input",
                    ref: input,
                    class: "search-input",
                    size: "default",
                    clearable: "",
                    modelValue: value.value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
                    onChange: onSearch,
                    placeholder: "分类/免临床/指导原则/标准"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_button, {
                    class: "search-btn",
                    size: "default",
                    type: "primary",
                    onClick: onSearch
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("搜索")
                    ]),
                    _: 1
                  })
                ]),
                vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_tabs, {
                  class: "tabs",
                  style: { "margin-top": "10px" },
                  modelValue: activeTab.value,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => activeTab.value = $event),
                  type: "border-card"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_tab_pane, {
                      label: "分类",
                      name: "first"
                    }, {
                      label: vue.withCtx(() => [
                        vue.createVNode(_component_el_link, {
                          underline: false,
                          icon: vue.unref(ElementPlusIconsVue.Tools),
                          target: "_blank",
                          href: "https://www.zhixie.info/"
                        }, null, 8, ["icon"]),
                        vue.createTextVNode("分类 "),
                        vue.createElementVNode("i", _hoisted_3$8, vue.toDisplayString(result.value.classification.length), 1)
                      ]),
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_4$7, [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(result.value.classification, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_el_card, {
                              key: item._id,
                              style: { "margin-bottom": "10px", "font-size": "14px" }
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_sfc_main$a, {
                                      reg: value.value,
                                      str: item.management_code + " " + item.code + " （" + item.catalogue_name + " - " + item.onelevel_name + " - " + item.twolevel_name + "）"
                                    }, null, 8, ["reg", "str"])
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("描 述：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$a, {
                                          reg: value.value,
                                          str: item.description
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("用 途：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$a, {
                                          reg: value.value,
                                          str: item.intend
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("举 例：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$a, {
                                          reg: value.value,
                                          str: item.examples
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("a", _hoisted_5$7, vue.toDisplayString(item.source), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_tab_pane, {
                      label: "免临床",
                      name: "second"
                    }, {
                      label: vue.withCtx(() => [
                        vue.createTextVNode(" 免临床 "),
                        vue.createElementVNode("i", _hoisted_6$2, vue.toDisplayString(result.value.noclinical.length), 1)
                      ]),
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_7$2, [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(result.value.noclinical, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_el_card, {
                              key: item._id,
                              style: { "margin-bottom": "10px", "font-size": "14px" }
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_sfc_main$a, {
                                      reg: value.value,
                                      str: item.management_code + " " + item.code + " （" + item.name + "）"
                                    }, null, 8, ["reg", "str"])
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("描 述：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$a, {
                                          reg: value.value,
                                          str: item.description
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("a", {
                                      target: "_blank",
                                      style: { "font-size": "12px" },
                                      href: item.source_url
                                    }, vue.toDisplayString(item.source), 9, _hoisted_8$2)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_tab_pane, {
                      label: "指导原则",
                      name: "third"
                    }, {
                      label: vue.withCtx(() => [
                        vue.createVNode(_component_el_link, {
                          underline: false,
                          icon: vue.unref(ElementPlusIconsVue.Tools),
                          target: "_blank",
                          href: "https://www.cmde.org.cn/flfg/zdyz/zdyzwbk/index.html"
                        }, null, 8, ["icon"]),
                        vue.createTextVNode("指导原则 "),
                        vue.createElementVNode("i", _hoisted_9$2, vue.toDisplayString(result.value.principle.length), 1)
                      ]),
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_10$2, [
                          vue.createElementVNode("span", _hoisted_11$2, "最后更新于：" + vue.toDisplayString(principle.value.lastUpdate) + "，总计：" + vue.toDisplayString(principle.value.total), 1),
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(result.value.principle, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_el_card, {
                              key: item._id,
                              style: { "margin-bottom": "10px", "font-size": "14px" }
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("a", {
                                      target: "_blank",
                                      href: item.url
                                    }, [
                                      vue.createVNode(_sfc_main$a, {
                                        reg: value.value,
                                        str: item.name
                                      }, null, 8, ["reg", "str"])
                                    ], 8, _hoisted_12$2),
                                    vue.createElementVNode("a", {
                                      target: "_blank",
                                      href: "https://www.baidu.com/s?wd=" + item.name,
                                      class: "baidu"
                                    }, null, 8, _hoisted_13$2)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, { style: { "color": "gray", "font-size": "12px" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(vue.toDisplayString(item.pubDate), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_tab_pane, {
                      label: "标准",
                      name: "fourth"
                    }, {
                      label: vue.withCtx(() => [
                        vue.createVNode(_component_el_link, {
                          underline: false,
                          icon: vue.unref(ElementPlusIconsVue.Tools),
                          target: "_blank",
                          href: "http://app.nifdc.org.cn/biaogzx/qxqwk.do"
                        }, null, 8, ["icon"]),
                        vue.createTextVNode("标准 "),
                        vue.createElementVNode("i", _hoisted_14$2, vue.toDisplayString(result.value.standard.length), 1)
                      ]),
                      default: vue.withCtx(() => [
                        vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_15$2, [
                          vue.createElementVNode("span", _hoisted_16$2, [
                            vue.createTextVNode(" 最后更新于：" + vue.toDisplayString(standard.value.lastUpdate) + "，总计：" + vue.toDisplayString(standard.value.total) + " ", 1),
                            vue.createVNode(_component_el_link, {
                              underline: false,
                              style: { "float": "right", "font-size": "1.2em" },
                              onClick: _cache[1] || (_cache[1] = ($event) => {
                                fileTemp.value.click();
                                standardUpdateLoading.value = true;
                              })
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_icon, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_UploadFilled)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            vue.createVNode(_component_el_link, { underline: false }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_tooltip, {
                                  class: "item",
                                  effect: "dark",
                                  content: "1.中检院导出全部；2.另存为xls文件；3.上传xls",
                                  placement: "bottom"
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_icon, null, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_component_QuestionFilled)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            vue.withDirectives(vue.createElementVNode("input", {
                              type: "file",
                              ref_key: "fileTemp",
                              ref: fileTemp,
                              accept: ".xls",
                              onChange: _cache[2] || (_cache[2] = ($event) => chooseLocalStandard($event))
                            }, null, 544), [
                              [vue.vShow, false]
                            ])
                          ]),
                          standardUpdateData.value[0] ? (vue.openBlock(), vue.createBlock(_component_el_card, {
                            key: 0,
                            style: { "margin-bottom": "10px", "font-size": "14px", "background": "gray" }
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode(" 例： "),
                                  vue.createVNode(_sfc_main$a, {
                                    reg: value.value,
                                    str: standardUpdateData.value[100].code + " " + standardUpdateData.value[100].name
                                  }, null, 8, ["reg", "str"]),
                                  vue.createElementVNode("a", {
                                    target: "_blank",
                                    href: "https://www.baidu.com/s?wd=" + standardUpdateData.value[100].code + " " + standardUpdateData.value[100].name,
                                    class: "baidu"
                                  }, null, 8, _hoisted_17$1)
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_row, null, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("使用范围：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 20 }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_sfc_main$a, {
                                        reg: value.value,
                                        str: standardUpdateData.value[100].range
                                      }, null, 8, ["reg", "str"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_row, null, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("实施时间：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 8 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(standardUpdateData.value[100].implementDate), 1)
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("标准状态：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 8 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(standardUpdateData.value[100].state), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_row, null, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("发布时间：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 8 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(standardUpdateData.value[100].pubDate), 1)
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("代替标准：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 8 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(standardUpdateData.value[100].replaceCode), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_row, { style: { "text-align": "right", "padding-top": "10px" } }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_button, {
                                    size: "small",
                                    type: "primary",
                                    onClick: standardUpload
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("确认上传" + vue.toDisplayString(standardUpdateData.value.length ? " (" + standardUpdateData.value.length + ")" : ""), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : vue.createCommentVNode("", true),
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(result.value.standard, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_el_card, {
                              key: item._id,
                              style: { "margin-bottom": "10px", "font-size": "14px" }
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_sfc_main$a, {
                                      reg: value.value,
                                      str: item.code + " " + item.name
                                    }, null, 8, ["reg", "str"]),
                                    vue.createElementVNode("a", {
                                      target: "_blank",
                                      href: "https://www.baidu.com/s?wd=" + item.code + " " + item.name,
                                      class: "baidu"
                                    }, null, 8, _hoisted_18$1)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("使用范围：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$a, {
                                          reg: value.value,
                                          str: item.range
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("实施时间：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 8 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.implementDate), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("标准状态：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 8 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.state), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("发布时间：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 8 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.pubDate), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("代替标准：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 8 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.replaceCode), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])), [
                          [_directive_loading, standardUpdateLoading.value]
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])), [
                  [_directive_loading, loading.value]
                ])
              ])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          !props.iscomp ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "sphelper",
            onClick: _cache[5] || (_cache[5] = ($event) => show.value = true)
          }, [
            vue.createVNode(_component_el_icon, { size: "30" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_Search)
              ]),
              _: 1
            })
          ])) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const SpHelper_vue_vue_type_style_index_0_scoped_0c8f56aa_lang = "";
  const SpHelperVue = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-0c8f56aa"]]);
  const docPreview = (param) => {
    return new Promise((resolve, reject) => {
      const url = param.tempUrl;
      PizZipUtils.getBinaryContent(url, async (error, content) => {
        const zip = new PizZip(content);
        const doc = new DocxTemplater(zip, { linebreaks: true }).render(
          param.data
        );
        const out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        if (param.saveName) {
          await saveAs(out, param.saveName);
          setTimeout(() => {
            resolve(true);
          }, 3e3);
        } else {
          resolve(out);
        }
      });
    });
  };
  const _hoisted_1$7 = { class: "form" };
  const _hoisted_2$7 = { class: "block" };
  const _hoisted_3$7 = { class: "btns" };
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "PageClbc",
    setup(__props) {
      const loading = vue.ref(true);
      const form = vue.ref({
        sbr: "",
        sxmc: "",
        ajbh: "",
        cpmc: ""
      });
      const today = vue.ref(new Date());
      const bznr = vue.ref("    ****");
      const user = vue.ref("");
      const telephone = vue.ref(localStorage.getItem("telephone") || "");
      const telChange = () => {
        localStorage.setItem("telephone", telephone.value);
      };
      const doDocPreview = () => {
        loading.value = true;
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/fa8b2335-91c0-49bf-9588-fcb3b0376526.docx`,
          data: {
            sbr: form.value.sbr,
            cpmc: form.value.cpmc,
            ajbh: form.value.ajbh,
            sxmc: form.value.sxmc,
            bznr: bznr.value,
            date: dateFormat(today.value),
            user: user.value,
            telephone: telephone.value
          },
          saveName: `补正通知-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        const id = window.location.href.match(/id=(.*?)$/)[1];
        xkbasys.getCaseInfo(id).then((res) => {
          form.value = res;
          loading.value = false;
        });
        xkbasys.getUser().then((res) => {
          user.value = res.name;
        });
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [
          vue.createElementVNode("div", _hoisted_2$7, [
            vue.createVNode(_component_el_form, {
              size: "default",
              model: form.value
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, {
                  label: "事项名称",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sxmc,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sxmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "受理编号",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.ajbh,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.ajbh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "企业名称",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sbr,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.sbr = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "产品名称",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.cpmc,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.cpmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "补正内容",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 12 },
                      modelValue: bznr.value,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => bznr.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "通知日期",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_date_picker, {
                      modelValue: today.value,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => today.value = $event),
                      format: "YYYY-MM-DD",
                      type: "date",
                      placeholder: "选择日期"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: " 联系人",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: user.value,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => user.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "联系电话",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: telephone.value,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => telephone.value = $event),
                      onChange: telChange
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          vue.createElementVNode("div", _hoisted_3$7, [
            vue.createVNode(_component_el_button, {
              size: "default",
              type: "primary",
              onClick: doDocPreview
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("生成并下载")
              ]),
              _: 1
            })
          ])
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const PageClbc_vue_vue_type_style_index_0_scoped_db106125_lang = "";
  const PageClbc = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-db106125"]]);
  const _withScopeId$4 = (n) => (vue.pushScopeId("data-v-1419a489"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$6 = { class: "form" };
  const _hoisted_2$6 = { class: "block" };
  const _hoisted_3$6 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$6 = { style: { "padding": "0 1em" } };
  const _hoisted_5$6 = { class: "btns" };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "PageHyjy",
    setup(__props) {
      const loading = vue.ref(true);
      const form = vue.ref({});
      const user = vue.ref("");
      const today = vue.ref(new Date());
      const hsnr = vue.ref("");
      const hsnrSelector = vue.ref([
        {
          description: "产品首次注册",
          checked: false
        },
        {
          description: "重大变更注册",
          checked: false
        },
        {
          description: "简易发补",
          checked: false
        },
        {
          description: "涉及审评要求不明确、难以准确把握审评尺度的医疗器械",
          checked: false
        },
        {
          description: "其他适用于会审会决定的医疗器械",
          checked: false
        }
      ]);
      const hsnrChange = () => {
        let tmp = "";
        for (const i of hsnrSelector.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + "\n";
        }
        hsnr.value = tmp.substring(0, tmp.length - 1);
      };
      const hsjy = vue.ref("");
      const doDocPreview = () => {
        loading.value = true;
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/deed5ac4-c31b-44fa-95a4-6fa3e48a8bda.docx`,
          data: {
            sbr: form.value.sbr,
            cpmc: form.value.cpmc,
            ajbh: form.value.ajbh,
            sxmc: form.value.sxmc,
            ggxh: form.value.ggxh,
            date: dateFormat(today.value),
            hsnr: hsnr.value,
            hsjy: hsjy.value,
            user: user.value
          },
          saveName: `会审纪要-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        const id = window.location.href.match(/id=(.*?)$/)[1];
        xkbasys.getCaseInfo(id).then((res) => {
          form.value = res;
          loading.value = false;
        });
        xkbasys.getUser().then((res) => {
          user.value = res.name;
        });
        hsnrChange();
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          vue.createElementVNode("div", _hoisted_2$6, [
            vue.createVNode(_component_el_form, {
              size: "default",
              model: form.value
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, { label: "事项名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sxmc,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sxmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "受理编号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.ajbh,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.ajbh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "企业名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sbr,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.sbr = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "会议时间" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_date_picker, {
                      modelValue: today.value,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => today.value = $event),
                      type: "date",
                      placeholder: "选择日期",
                      format: "YYYY-MM-DD"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "产品名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.cpmc,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.cpmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "规格型号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: "",
                      modelValue: form.value.ggxh,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.ggxh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "会审内容" }, {
                  default: vue.withCtx(() => [
                    _hoisted_3$6,
                    vue.createElementVNode("div", _hoisted_4$6, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(hsnrSelector.value, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                          vue.createVNode(_component_el_checkbox, {
                            label: item.description,
                            modelValue: item.checked,
                            "onUpdate:modelValue": ($event) => item.checked = $event,
                            onChange: hsnrChange
                          }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                        ]);
                      }), 128))
                    ])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "会审纪要" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 10 },
                      modelValue: hsjy.value,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => hsjy.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          vue.createElementVNode("div", _hoisted_5$6, [
            vue.createVNode(_component_el_button, {
              size: "default",
              type: "primary",
              onClick: doDocPreview
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("生成并下载")
              ]),
              _: 1
            })
          ])
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const PageHyjy_vue_vue_type_style_index_0_scoped_1419a489_lang = "";
  const PageHyjy = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-1419a489"]]);
  const _withScopeId$3 = (n) => (vue.pushScopeId("data-v-c2a14f89"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$5 = { class: "form" };
  const _hoisted_2$5 = { class: "block" };
  const _hoisted_3$5 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$5 = { style: { "padding": "0 1em" } };
  const _hoisted_5$5 = { class: "btns" };
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "PageHcqd",
    setup(__props) {
      const loading = vue.ref(true);
      const form = vue.ref({});
      const user = vue.ref("");
      const zcxs = vue.ref("");
      const zcxsSelector = vue.ref([
        {
          description: "首次注册申请",
          checked: true
        },
        {
          description: "变更注册申请",
          checked: false
        }
      ]);
      const zcxsChange = () => {
        let tmp = "";
        for (const i of zcxsSelector.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + "          ";
        }
        zcxs.value = tmp.substring(0, tmp.length - 1);
      };
      const zdhswt = vue.ref("无");
      const qtwt = vue.ref("无");
      const doDocPreview = () => {
        loading.value = true;
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/34c74e05-bcc4-4ca7-8b65-6944651e3a1c.docx`,
          data: {
            sbr: form.value.sbr,
            cpmc: form.value.cpmc,
            ajbh: form.value.ajbh,
            zcxs: zcxs.value,
            zdhswt: zdhswt.value,
            qtwt: qtwt.value
          },
          saveName: `重点关注清单-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        const id = window.location.href.match(/id=(.*?)$/)[1];
        xkbasys.getCaseInfo(id).then((res) => {
          form.value = res;
          loading.value = false;
        });
        xkbasys.getUser().then((res) => {
          user.value = res.name;
        });
        zcxsChange();
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
          vue.createElementVNode("div", _hoisted_2$5, [
            vue.createVNode(_component_el_form, {
              size: "default",
              model: form.value
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, { label: "事项名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sxmc,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sxmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "受理编号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.ajbh,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.ajbh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "企业名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sbr,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.sbr = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "产品名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.cpmc,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.cpmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "注册形式" }, {
                  default: vue.withCtx(() => [
                    _hoisted_3$5,
                    vue.createElementVNode("div", _hoisted_4$5, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(zcxsSelector.value, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                          vue.createVNode(_component_el_checkbox, {
                            label: item.description,
                            modelValue: item.checked,
                            "onUpdate:modelValue": ($event) => item.checked = $event,
                            onChange: zcxsChange
                          }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                        ]);
                      }), 128))
                    ])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "重点问题" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 5 },
                      modelValue: zdhswt.value,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => zdhswt.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "其他问题" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 5 },
                      modelValue: qtwt.value,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => qtwt.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          vue.createElementVNode("div", _hoisted_5$5, [
            vue.createVNode(_component_el_button, {
              size: "default",
              type: "primary",
              onClick: doDocPreview
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("生成并下载")
              ]),
              _: 1
            })
          ])
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const PageHcqd_vue_vue_type_style_index_0_scoped_c2a14f89_lang = "";
  const PageHcqd = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-c2a14f89"]]);
  const _withScopeId$2 = (n) => (vue.pushScopeId("data-v-86fc5475"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$4 = { style: { "padding": "0 1em" } };
  const _hoisted_2$4 = { style: { "padding": "0 1em" } };
  const _hoisted_3$4 = { style: { "padding": "0 1em" } };
  const _hoisted_4$4 = { style: { "margin-left": "15px" } };
  const _hoisted_5$4 = { style: { "margin-left": "15px" } };
  const _hoisted_6$1 = { style: { "margin-left": "15px" } };
  const _hoisted_7$1 = { style: { "margin-left": "15px" } };
  const _hoisted_8$1 = { style: { "margin-left": "15px" } };
  const _hoisted_9$1 = { style: { "margin-left": "15px" } };
  const _hoisted_10$1 = { style: { "margin-left": "15px" } };
  const _hoisted_11$1 = { style: { "margin-left": "15px" } };
  const _hoisted_12$1 = { style: { "margin-left": "15px" } };
  const _hoisted_13$1 = { style: { "padding": "0 1em" } };
  const _hoisted_14$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_15$1 = { style: { "padding": "0 1em" } };
  const _hoisted_16$1 = { style: { "padding": "0 1em" } };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "PagePdbgBG",
    props: {
      form: {
        type: Object,
        default: {}
      }
    },
    setup(__props) {
      const props = __props;
      const loading = vue.ref(false);
      const form = vue.ref({});
      vue.watch(props, () => {
        form.value = { ...form.value, ...props.form };
      });
      const applyChangeInfo = vue.ref([
        { description: "变更产品名称", checked: false },
        { description: "变更产品技术要求", checked: false },
        { description: "变更产品型号规格", checked: false },
        { description: "变更产品结构及组成", checked: false },
        { description: "变更产品适用范围", checked: false },
        { description: "变更注册证中“其他内容”", checked: false },
        { description: "变更其他内容", checked: false }
      ]);
      const applyInfoChange = () => {
        let tmp = "";
        for (const i of applyChangeInfo.value) {
          if (i.checked)
            tmp += i.description + "、";
        }
        form.value.applyChangeInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const teckCheckContentInit = () => {
        form.value.teckCheckContent = `该产品为${form.value.classify}医疗器械，分类编码${form.value.classCode} ${form.value.className}，注册证号：${form.value.regCode}。本次申请变更注册，${form.value.applyChangeInfoStr}。`;
      };
      const realChangeInfo = vue.ref([
        { description: "变更产品名称", checked: false },
        { description: "变更产品技术要求", checked: false },
        { description: "变更产品型号规格", checked: false },
        { description: "变更产品结构及组成", checked: false },
        { description: "变更产品适用范围", checked: false },
        { description: "变更注册证中“其他内容”", checked: false },
        { description: "变更其他内容", checked: false }
      ]);
      const realInfoChange = () => {
        let tmp = "";
        let j = 0;
        for (const i of realChangeInfo.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + " ";
          if (j == 2 || j == 4)
            tmp += "\n";
          j++;
        }
        form.value.realChangeInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const changeType = vue.ref([
        { description: "产品设计变化", checked: false },
        { description: "原材料变化", checked: false },
        { description: "生产工艺变化", checked: false },
        { description: "适用范围变化", checked: false },
        { description: "其余变化", checked: false }
      ]);
      const typeChange = () => {
        let tmp = "";
        let j = 0;
        for (const i of changeType.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + " ";
          if (j == 1)
            tmp += "\n";
          j++;
        }
        form.value.changeTypeStr = tmp.substring(0, tmp.length - 1);
      };
      const proveInfo = vue.ref([
        { description: "不适用强制性标准说明", checked: false },
        { description: "产品风险管理资料", checked: false },
        { description: "产品检验报告", checked: false },
        { description: "研究资料", checked: false },
        { description: "临床评价资料", checked: false },
        { description: "产品说明书变化对比表", checked: false },
        { description: "变更前和变更后的产品技术要求", checked: false },
        { description: "变更前和变更后的产品说明书", checked: false },
        { description: "证明产品安全有效的其他资料", checked: false }
      ]);
      const proveInfoChange = () => {
        let tmp = "";
        let j = 0;
        for (const i of proveInfo.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + " ";
          if (j == 1 || j == 4 || j == 6)
            tmp += "\n";
          j++;
        }
        form.value.proveInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const attachInfo = vue.ref([
        { description: "产品名称变化对比表", checked: false },
        { description: "产品技术要求变化对比表", checked: false },
        { description: "产品型号规格变化对比表", checked: false },
        { description: "产品结构及组成变化对比表", checked: false },
        { description: "产品适用范围变化对比表", checked: false },
        { description: "注册证中“其他内容”变化对比表", checked: false },
        { description: "其他内容变化对比表", checked: false }
      ]);
      const attachInfoChange = () => {
        let tmp = "";
        for (const i of attachInfo.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + "\n";
        }
        form.value.attachInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const conclusionInfo = vue.ref([
        { description: "符合技术审评要求，建议准予注册。", checked: true },
        {
          description: "申请资料不符合技术审评要求，建议不予注册。\n具体理由和依据：",
          checked: false
        },
        { description: "同意企业申请，建议准予撤回。", checked: false }
      ]);
      const conclusionInfoChange = (index) => {
        let tmp = "";
        let j = 0;
        for (const i of conclusionInfo.value) {
          if (index == j)
            tmp += "■";
          else
            tmp += "□";
          if (index == j && 1 == j)
            tmp += i.description + form.value.conclusionReason + "\n";
          else
            tmp += i.description + "\n";
          tmp += "\n";
          j++;
        }
        form.value.conclusionInfoStr = tmp.substring(0, tmp.length - 2);
      };
      function isOrNot(b, trueStr, falseStr) {
        return b ? trueStr ? trueStr : "■是 □否" : falseStr ? falseStr : "□是 ■否";
      }
      const doDocPreview = () => {
        loading.value = true;
        const value = form.value;
        const data = {
          sbr: value.sbr,
          cpmc: value.cpmc,
          ajbh: value.ajbh,
          slrq: value.slrq,
          ggxh: value.ggxh,
          scdz: value.scdz,
          teckCheckContent: value.teckCheckContent,
          realChangeInfoStr: value.realChangeInfoStr,
          changeTypeStr: value.changeTypeStr,
          isSystemCheckStr: isOrNot(value.isSystemCheck),
          isSystemCheckPassedStr: value.isSystemCheck ? isOrNot(
            value.isSystemCheckPassed,
            "■通过核查 □未通过核查",
            "□通过核查 ■未通过核查"
          ) : "□通过核查 □未通过核查",
          isPatchedStr: isOrNot(value.isPatched),
          patchContent: value.patchContent,
          patchDate: !value.isPatched ? "" : value.patchDate.toISOString().substring(0, 10),
          isPatchPassedStr: value.isPatched ? isOrNot(value.isPatchPassed) : "□是 □否",
          isUseForceStandardStr: isOrNot(value.isUseForceStandard),
          isTechRequireChangeStr: isOrNot(realChangeInfo.value[1].checked),
          isInstructionChangeStr: isOrNot(value.isInstructionChange),
          isSelfTestReportStr: isOrNot(
            value.isSelfTestReport,
            "■注册人出具的自检报告 □委托有资质的医疗器械检验机构出具的检验报告",
            "□注册人出具的自检报告 ■委托有资质的医疗器械检验机构出具的检验报告"
          ),
          isNoClinicalStr: isOrNot(value.isNoClinical),
          isEquivalentStr: isOrNot(value.isEquivalent),
          proveInfoStr: value.proveInfoStr,
          beforChangeContent: value.beforChangeContent,
          afterChangeContent: value.afterChangeContent,
          attachInfoStr: value.attachInfoStr,
          conclusionInfoStr: value.conclusionInfoStr
        };
        console.log(data);
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/74645f5a-d807-4634-a6c8-2b52109f8619.docx`,
          data,
          saveName: `综合评定报告-变更-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        form.value = {
          className: "",
          teckCheckContent: "****",
          applyChangeInfoStr: "",
          realChangeInfoStr: "",
          changeTypeStr: "",
          isSystemCheck: false,
          isSystemCheckPassed: true,
          isPatched: true,
          patchContent: "见材料补充环节意见。",
          patchDate: new Date(),
          isPatchPassed: true,
          isUseForceStandard: false,
          isInstructionChange: false,
          isSelfTestReport: false,
          isNoClinical: true,
          isEquivalent: false,
          proveInfoStr: "",
          beforChangeContent: "",
          afterChangeContent: "",
          attachInfoStr: "",
          conclusion: 0,
          conclusionInfoStr: "",
          conclusionReason: "",
          ...props.form
        };
        conclusionInfoChange(0);
        attachInfoChange();
        typeChange();
        proveInfoChange();
        realInfoChange();
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_form_item, { label: "注册证号" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                modelValue: form.value.regCode,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.regCode = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "申请变更信息" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$4, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(applyChangeInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: applyInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "技术审查内容" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.teckCheckContent,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.teckCheckContent = $event)
              }, null, 8, ["modelValue"]),
              vue.createElementVNode("span", {
                onClick: teckCheckContentInit,
                style: { "color": "gray", "font-size": "0.8em", "cursor": "pointer" }
              }, "自动生成")
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "实际变更情况" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_2$4, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(realChangeInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: realInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "变更涉及的变化类型" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_3$4, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(changeType.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: typeChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "是否需要针对变化部分进行质量管理体系核查" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_4$4, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheck,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.isSystemCheck = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheck,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.isSystemCheck = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "质量管理体系核查结果" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_5$4, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheckPassed,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.isSystemCheckPassed = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("通过核查")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheckPassed,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.isSystemCheckPassed = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("未通过核查")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, form.value.isSystemCheck]
          ]),
          vue.createVNode(_component_el_form_item, { label: "是否存在注册申报资料发补情况" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_6$1, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatched,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.isPatched = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatched,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.isPatched = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 0,
            label: "需一次性补正的内容"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.patchContent,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.patchContent = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 1,
            label: "补正材料收审时间"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_date_picker, {
                modelValue: form.value.patchDate,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.patchDate = $event),
                type: "date",
                placeholder: "选择日期",
                format: "YYYY-MM-DD"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 2,
            label: "补正后注册申报资料是否规范"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_7$1, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatchPassed,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.isPatchPassed = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatchPassed,
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.isPatchPassed = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          vue.createVNode(_component_el_form_item, { label: "申报产品是否适用强制性标准" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_8$1, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isUseForceStandard,
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.isUseForceStandard = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isUseForceStandard,
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.isUseForceStandard = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "产品说明书是否发生变化" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_9$1, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isInstructionChange,
                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.isInstructionChange = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isInstructionChange,
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.value.isInstructionChange = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "产品检验报告提交形式" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_10$1, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSelfTestReport,
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => form.value.isSelfTestReport = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("注册人出具的自检报告")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSelfTestReport,
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => form.value.isSelfTestReport = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("委托有资质的医疗器械检验机构出具的检验报告")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "产品是否免于临床评价" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_11$1, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isNoClinical,
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => form.value.isNoClinical = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isNoClinical,
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => form.value.isNoClinical = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "变化部分是否有可能影响产品安全、有效及申报产品与《免于进行临床评价医疗器械目录》所述产品等同性论证" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_12$1, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isEquivalent,
                  "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => form.value.isEquivalent = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isEquivalent,
                  "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => form.value.isEquivalent = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "证明资料" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_13$1, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(proveInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: proveInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "变更前内容" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.beforChangeContent,
                "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => form.value.beforChangeContent = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "变更后内容" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.afterChangeContent,
                "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => form.value.afterChangeContent = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "附页" }, {
            default: vue.withCtx(() => [
              _hoisted_14$1,
              vue.createElementVNode("div", _hoisted_15$1, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(attachInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: attachInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "技术审评意见 " }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_16$1, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(conclusionInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_radio, {
                      label: index,
                      modelValue: form.value.conclusion,
                      "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => form.value.conclusion = $event),
                      onChange: conclusionInfoChange
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item.description), 1)
                      ]),
                      _: 2
                    }, 1032, ["label", "modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "具体理由和依据" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.conclusionReason,
                "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => form.value.conclusionReason = $event),
                onInput: _cache[26] || (_cache[26] = ($event) => conclusionInfoChange(form.value.conclusion))
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, form.value.conclusion === 1]
          ]),
          vue.createVNode(_component_el_form_item, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                disabled: loading.value,
                size: "default",
                type: "primary",
                onClick: doDocPreview
              }, {
                default: vue.withCtx(() => [
                  loading.value ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                    key: 0,
                    class: vue.normalizeClass(loading.value ? "is-loading" : "")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_Loading)
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("", true),
                  vue.createTextVNode(" 生成并下载 ")
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const PagePdbgBG_vue_vue_type_style_index_0_scoped_86fc5475_lang = "";
  const PagePdbgBG = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-86fc5475"]]);
  const _hoisted_1$3 = { style: { "padding-left": "15px" } };
  const _hoisted_2$3 = { style: { "padding-left": "15px" } };
  const _hoisted_3$3 = { style: { "padding-left": "15px" } };
  const _hoisted_4$3 = { style: { "padding": "0 1em" } };
  const _hoisted_5$3 = { style: { "padding": "0 1em" } };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "PagePdbgYX",
    props: {
      form: {
        type: Object,
        default: {}
      }
    },
    setup(__props) {
      const props = __props;
      const loading = vue.ref(false);
      const form = vue.ref({});
      vue.watch(props, () => {
        form.value = { ...form.value, ...props.form };
      });
      const teckCheckContentInit = () => {
        form.value.teckCheckContent = `该产品为${form.value.classify}医疗器械，分类编码${form.value.classCode} ${form.value.className}，注册证号：${form.value.regCode}。`;
      };
      const proveInfo = vue.ref([
        { description: "变更注册文件及其附件的复印件", checked: false },
        { description: "依据变更注册文件修改的产品技术要求", checked: false },
        { description: "无需办理变更注册或者无需变化即可符合新的医疗器械强制性标准的情况说明和相关证明资料", checked: false }
      ]);
      const proveInfoChange = () => {
        let tmp = "";
        for (const i of proveInfo.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + " ";
        }
        form.value.proveInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const conclusionInfo = vue.ref([
        { description: "符合技术审评要求，建议准予注册。", checked: true },
        {
          description: "申请资料不符合技术审评要求，建议不予注册。\n具体理由和依据：",
          checked: false
        },
        { description: "同意企业申请，建议准予撤回。", checked: false }
      ]);
      const conclusionInfoChange = (index) => {
        let tmp = "";
        let j = 0;
        for (const i of conclusionInfo.value) {
          if (index == j)
            tmp += "■";
          else
            tmp += "□";
          if (index == j && 1 == j)
            tmp += i.description + form.value.conclusionReason + "\n";
          else
            tmp += i.description + "\n";
          tmp += "\n";
          j++;
        }
        form.value.conclusionInfoStr = tmp.substring(0, tmp.length - 2);
      };
      function isOrNot(b, trueStr, falseStr) {
        return b ? trueStr ? trueStr : "■是 □否" : falseStr ? falseStr : "□是 ■否";
      }
      const doDocPreview = () => {
        loading.value = true;
        const value = form.value;
        const data = {
          sbr: value.sbr,
          cpmc: value.cpmc,
          ajbh: value.ajbh,
          slrq: value.slrq,
          ggxh: value.ggxh,
          scdz: value.scdz,
          teckCheckContent: value.teckCheckContent,
          changeHistory: value.changeHistory,
          isPatchedStr: isOrNot(value.isPatched),
          patchContent: value.patchContent,
          patchDate: !value.isPatched ? "" : value.patchDate.toISOString().substring(0, 10),
          isPatchPassedStr: value.isPatched ? isOrNot(value.isPatchPassed) : "□是 □否",
          proveInfoStr: value.proveInfoStr,
          conclusionInfoStr: value.conclusionInfoStr,
          isForceStandardUpdateStr: isOrNot(value.isForceStandardUpdate),
          isChangedForStandardStr: isOrNot(value.isChangedForStandard),
          isTeckChangeStr: isOrNot(value.isTeckChange)
        };
        console.log(data);
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/027f947f-0093-457c-bd3b-4671f3f245cb.docx`,
          data,
          saveName: `综合评定报告-延续-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        form.value = {
          className: "",
          teckCheckContent: "****",
          changeHistory: "",
          isPatched: true,
          patchContent: "见材料补充环节意见。",
          patchDate: new Date(),
          isPatchPassed: true,
          proveInfoStr: "",
          conclusion: 0,
          conclusionInfoStr: "",
          conclusionReason: "",
          isForceStandardUpdate: false,
          isChangedForStandard: false,
          isTeckChange: false,
          ...props.form
        };
        conclusionInfoChange(0);
        proveInfoChange();
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_form_item, { label: "技术审查内容" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.teckCheckContent,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.teckCheckContent = $event)
              }, null, 8, ["modelValue"]),
              vue.createElementVNode("span", {
                onClick: teckCheckContentInit,
                style: { "color": "gray", "font-size": "0.8em", "cursor": "pointer" }
              }, "自动生成")
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "本周期内变更历史" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.changeHistory,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.changeHistory = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "是否存在注册申报资料发补情况" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_radio, {
                modelValue: form.value.isPatched,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.isPatched = $event),
                label: true
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("是")
                ]),
                _: 1
              }, 8, ["modelValue"]),
              vue.createVNode(_component_el_radio, {
                modelValue: form.value.isPatched,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.isPatched = $event),
                label: false
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("否")
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          }),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 0,
            label: "需一次性补正的内容"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.patchContent,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.patchContent = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 1,
            label: "补正材料收审时间"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_date_picker, {
                modelValue: form.value.patchDate,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.patchDate = $event),
                type: "date",
                placeholder: "选择日期",
                format: "YYYY-MM-DD"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 2,
            label: "补正后注册申报资料是否规范"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_radio, {
                modelValue: form.value.isPatchPassed,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.isPatchPassed = $event),
                label: true
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("是")
                ]),
                _: 1
              }, 8, ["modelValue"]),
              vue.createVNode(_component_el_radio, {
                modelValue: form.value.isPatchPassed,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.isPatchPassed = $event),
                label: false
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("否")
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          vue.createVNode(_component_el_form_item, { label: "注册证效期内是否有新的医疗器械强制性标准发布实施" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$3, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isForceStandardUpdate,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.isForceStandardUpdate = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isForceStandardUpdate,
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.isForceStandardUpdate = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "是否为符合新的医疗器械强制性标准办理变更注册" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_2$3, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isChangedForStandard,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.isChangedForStandard = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isChangedForStandard,
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.isChangedForStandard = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "产品技术要求是否发生变更" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_3$3, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isTeckChange,
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.isTeckChange = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isTeckChange,
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.isTeckChange = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "证明资料" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_4$3, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(proveInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: proveInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "技术审评意见 " }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_5$3, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(conclusionInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_radio, {
                      label: index,
                      modelValue: form.value.conclusion,
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.conclusion = $event),
                      onChange: conclusionInfoChange
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item.description), 1)
                      ]),
                      _: 2
                    }, 1032, ["label", "modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "具体理由和依据" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.conclusionReason,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.value.conclusionReason = $event),
                onInput: _cache[16] || (_cache[16] = ($event) => conclusionInfoChange(form.value.conclusion))
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, form.value.conclusion === 1]
          ]),
          vue.createVNode(_component_el_form_item, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                disabled: loading.value,
                size: "default",
                type: "primary",
                onClick: doDocPreview
              }, {
                default: vue.withCtx(() => [
                  loading.value ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                    key: 0,
                    class: vue.normalizeClass(loading.value ? "is-loading" : "")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_Loading)
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("", true),
                  vue.createTextVNode(" 生成并下载 ")
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const PagePdbgYX_vue_vue_type_style_index_0_scoped_e63b8e93_lang = "";
  const PagePdbgYX = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-e63b8e93"]]);
  const _hoisted_1$2 = { style: { "margin-left": "15px" } };
  const _hoisted_2$2 = { style: { "margin-left": "15px" } };
  const _hoisted_3$2 = { style: { "margin-left": "15px" } };
  const _hoisted_4$2 = { style: { "margin-left": "15px" } };
  const _hoisted_5$2 = { style: { "padding": "0 1em" } };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "PagePdbgSC",
    props: {
      form: {
        type: Object,
        default: {}
      }
    },
    setup(__props) {
      const props = __props;
      const loading = vue.ref(false);
      const form = vue.ref({});
      vue.watch(props, () => {
        form.value = { ...form.value, ...props.form };
      });
      const conclusionInfo = vue.ref([
        { description: "符合技术审评要求，建议准予注册。", checked: true },
        {
          description: "申请资料不符合技术审评要求，建议不予注册。\n具体理由和依据：",
          checked: false
        },
        { description: "同意企业申请，建议准予撤回。", checked: false }
      ]);
      const conclusionInfoChange = (index) => {
        let tmp = "";
        let j = 0;
        for (const i of conclusionInfo.value) {
          if (index == j)
            tmp += "■";
          else
            tmp += "□";
          if (index == j && 1 == j)
            tmp += i.description + form.value.conclusionReason + "\n";
          else
            tmp += i.description + "\n";
          tmp += "\n";
          j++;
        }
        form.value.conclusionInfoStr = tmp.substring(0, tmp.length - 2);
      };
      function isOrNot(b, trueStr, falseStr) {
        return b ? trueStr ? trueStr : "■是 □否" : falseStr ? falseStr : "□是 ■否";
      }
      const doDocPreview = () => {
        const value = form.value;
        const data = {
          sbr: value.sbr,
          cpmc: value.cpmc,
          ajbh: value.ajbh,
          slrq: value.slrq,
          ggxh: value.ggxh,
          scdz: value.scdz,
          isSystemCheckStr: isOrNot(value.isSystemCheck),
          isSystemCheckPassedStr: !value.isSystemCheck ? isOrNot(
            value.isSystemCheckPassed,
            "■通过核查 □整改后通过",
            "□通过核查 □整改后通过"
          ) : "□通过核查 □整改后通过",
          isPatchedStr: isOrNot(value.isPatched),
          patchDate: !value.isPatched ? "" : value.patchDate.toISOString().substring(0, 10),
          isPatchPassedStr: value.isPatched ? isOrNot(value.isPatchPassed) : "□是 □否",
          conclusionInfoStr: value.conclusionInfoStr
        };
        console.log(data);
        loading.value = true;
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/5e429e48-dd47-4403-9531-f1237103e809.docx`,
          data,
          saveName: `综合评定报告-首次-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        form.value = {
          isSystemCheck: false,
          isSystemCheckPassed: true,
          isPatched: true,
          patchDate: new Date(),
          isPatchPassed: true,
          conclusion: 0,
          conclusionInfoStr: "",
          conclusionReason: "",
          ...props.form
        };
        conclusionInfoChange(0);
      });
      return (_ctx, _cache) => {
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_form_item, { label: "是否免于现场检查" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheck,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.isSystemCheck = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheck,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.isSystemCheck = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "质量管理体系核查结果" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_2$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheckPassed,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.isSystemCheckPassed = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("通过核查")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheckPassed,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.isSystemCheckPassed = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("整改后通过")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, !form.value.isSystemCheck]
          ]),
          vue.createVNode(_component_el_form_item, { label: "是否存在注册申报资料发补情况" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_3$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatched,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.isPatched = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatched,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.isPatched = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 0,
            label: "补正材料收审时间"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_date_picker, {
                modelValue: form.value.patchDate,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.patchDate = $event),
                type: "date",
                placeholder: "选择日期",
                format: "YYYY-MM-DD"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 1,
            label: "补正后注册申报资料是否规范"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_4$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatchPassed,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.isPatchPassed = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatchPassed,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.isPatchPassed = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          vue.createVNode(_component_el_form_item, { label: "技术审评意见 " }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_5$2, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(conclusionInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_radio, {
                      label: index,
                      modelValue: form.value.conclusion,
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.conclusion = $event),
                      onChange: conclusionInfoChange
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item.description), 1)
                      ]),
                      _: 2
                    }, 1032, ["label", "modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "具体理由和依据" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.conclusionReason,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.conclusionReason = $event),
                onInput: _cache[11] || (_cache[11] = ($event) => conclusionInfoChange(form.value.conclusion))
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, form.value.conclusion === 1]
          ]),
          vue.createVNode(_component_el_form_item, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                disabled: loading.value,
                size: "default",
                type: "primary",
                onClick: doDocPreview
              }, {
                default: vue.withCtx(() => [
                  loading.value ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                    key: 0,
                    class: vue.normalizeClass(loading.value ? "is-loading" : "")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_Loading)
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("", true),
                  vue.createTextVNode(" 生成并下载 ")
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const PagePdbgSC_vue_vue_type_style_index_0_scoped_ad3d1bc8_lang = "";
  const PagePdbgSC = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-ad3d1bc8"]]);
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-5916e28c"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "form" };
  const _hoisted_2$1 = { class: "block" };
  const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$1 = { class: "code" };
  const _hoisted_5$1 = {
    class: "name",
    style: { "color": "gray", "font-size": "0.8em" }
  };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "PagePdbg",
    setup(__props) {
      const loading = vue.ref(true);
      const sxmc = vue.ref("");
      const form = vue.ref({
        classify: "无源"
      });
      const classCodeSelect = (e) => {
        form.value.classCode = e.code;
        form.value.className = e.twolevel_name;
      };
      vue.onMounted(() => {
        const id = window.location.href.match(/id=(.*?)$/)[1];
        xkbasys.getCaseInfo(id).then((res) => {
          console.warn(res);
          if (res.sxmc.indexOf("首次") !== -1) {
            sxmc.value = "sc";
          } else if (res.sxmc.indexOf("延续") !== -1) {
            sxmc.value = "yx";
          } else if (res.sxmc.indexOf("变更") !== -1) {
            sxmc.value = "bg";
          }
          form.value = { ...form.value, ...res };
          console.log(form.value);
          loading.value = false;
        });
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_autocomplete = vue.resolveComponent("el-autocomplete");
        const _component_el_form = vue.resolveComponent("el-form");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", _hoisted_2$1, [
            vue.createVNode(_component_el_form, {
              size: "default",
              model: form.value,
              "label-position": "top"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, { label: "事项名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sxmc,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sxmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "受理编号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.ajbh,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.ajbh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "企业名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sbr,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.sbr = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "产品名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.cpmc,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.cpmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "规格型号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: "",
                      modelValue: form.value.ggxh,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.ggxh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "产品大类" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_radio, {
                      modelValue: form.value.classify,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.classify = $event),
                      label: "有源"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("有源")
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    vue.createVNode(_component_el_radio, {
                      modelValue: form.value.classify,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.classify = $event),
                      label: "无源"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("无源")
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    vue.createVNode(_component_el_radio, {
                      modelValue: form.value.classify,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.classify = $event),
                      label: "IVD"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("IVD")
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "分类编码" }, {
                  default: vue.withCtx(() => [
                    _hoisted_3$1,
                    vue.createVNode(_component_el_autocomplete, {
                      style: { "width": "100%" },
                      modelValue: form.value.classCode,
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.classCode = $event),
                      "fetch-suggestions": vue.unref(DB).getClassCode,
                      onSelect: classCodeSelect,
                      "trigger-on-focus": false
                    }, {
                      default: vue.withCtx(({ item }) => [
                        vue.createElementVNode("div", _hoisted_4$1, vue.toDisplayString(item.code), 1),
                        vue.createElementVNode("div", _hoisted_5$1, vue.toDisplayString(item.catalogue_name) + "-" + vue.toDisplayString(item.onelevel_name) + "-" + vue.toDisplayString(item.twolevel_name), 1)
                      ]),
                      _: 1
                    }, 8, ["modelValue", "fetch-suggestions"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "分类名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.className,
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.className = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                sxmc.value === "bg" ? (vue.openBlock(), vue.createBlock(PagePdbgBG, {
                  key: 0,
                  form: form.value
                }, null, 8, ["form"])) : vue.createCommentVNode("", true),
                sxmc.value === "yx" ? (vue.openBlock(), vue.createBlock(PagePdbgYX, {
                  key: 1,
                  form: form.value
                }, null, 8, ["form"])) : vue.createCommentVNode("", true),
                sxmc.value === "sc" ? (vue.openBlock(), vue.createBlock(PagePdbgSC, {
                  key: 2,
                  form: form.value
                }, null, 8, ["form"])) : vue.createCommentVNode("", true)
              ]),
              _: 1
            }, 8, ["model"])
          ])
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const PagePdbg_vue_vue_type_style_index_0_scoped_5916e28c_lang = "";
  const PagePdbg = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5916e28c"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "PageManager",
    props: {
      page: {
        type: String,
        default: ""
      }
    },
    setup(__props, { expose }) {
      const props = __props;
      const show = vue.ref(false);
      expose({ show });
      return (_ctx, _cache) => {
        const _component_el_drawer = vue.resolveComponent("el-drawer");
        return vue.openBlock(), vue.createBlock(_component_el_drawer, {
          modelValue: show.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => show.value = $event),
          size: "680",
          direction: "ltr",
          "with-header": false
        }, {
          default: vue.withCtx(() => [
            props.page === "clbc" ? (vue.openBlock(), vue.createBlock(PageClbc, { key: 0 })) : vue.createCommentVNode("", true),
            props.page === "hyjy" ? (vue.openBlock(), vue.createBlock(PageHyjy, { key: 1 })) : vue.createCommentVNode("", true),
            props.page === "hcqd" ? (vue.openBlock(), vue.createBlock(PageHcqd, { key: 2 })) : vue.createCommentVNode("", true),
            props.page === "pdbg" ? (vue.openBlock(), vue.createBlock(PagePdbg, { key: 3 })) : vue.createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  });
  const _withScopeId = (n) => (vue.pushScopeId("data-v-576746f6"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { id: "spnote" };
  const _hoisted_2 = { class: "left" };
  const _hoisted_3 = ["onClick"];
  const _hoisted_4 = {
    key: 0,
    class: "his"
  };
  const _hoisted_5 = ["onClick"];
  const _hoisted_6 = { class: "middle" };
  const _hoisted_7 = { class: "tools" };
  const _hoisted_8 = { class: "iframe" };
  const _hoisted_9 = ["src"];
  const _hoisted_10 = {
    class: "tools",
    style: { "text-align": "right" }
  };
  const _hoisted_11 = { class: "right" };
  const _hoisted_12 = {
    key: 0,
    class: "baseinfo"
  };
  const _hoisted_13 = { style: { "font-weight": "bold" } };
  const _hoisted_14 = { key: 0 };
  const _hoisted_15 = { key: 1 };
  const _hoisted_16 = { class: "comment" };
  const _hoisted_17 = {
    key: 0,
    style: { "text-align": "right" }
  };
  const _hoisted_18 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", { style: { "color": "gray" } }, " 保存中... ", -1));
  const _hoisted_19 = { class: "comment-his" };
  const _hoisted_20 = ["onClick"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "SpNote",
    setup(__props) {
      const fileId = vue.ref("");
      const token = vue.ref("");
      const id = vue.ref("");
      const classSearch = vue.ref("");
      const caseRecords = vue.ref();
      function openCaseRecords() {
        caseRecords.value.id = id.value;
        caseRecords.value.show = true;
      }
      const spHelper = vue.ref();
      function openSpHelper() {
        spHelper.value.show = true;
      }
      vue.watch(fileId, () => {
        var _a2;
        (_a2 = contents.value.list) == null ? void 0 : _a2.map((i) => {
          if (i.fileId === fileId.value) {
            document.title = i.clmlmc;
          }
        });
      });
      const contents = vue.ref({});
      const collapse = vue.reactive({
        left: true,
        right: true,
        leftLoading: false,
        rightLoading: false
      });
      const noteSaving = vue.ref(false);
      let noteChanged = false;
      const notes = vue.ref();
      const note = vue.computed(() => {
        const baseNote = vue.ref({
          data: { comment: "" },
          xksbxxid: id.value,
          fileId: fileId.value,
          index: 0
        });
        if (contents.value.list) {
          let index = 0;
          contents.value.list.map((v, i) => {
            if (v.fileId === fileId.value) {
              index = i;
            }
          });
          baseNote.value.index = index;
        }
        if (!notes.value) {
          return baseNote.value;
        }
        let rtn;
        notes.value.map((i) => {
          if (i.fileId === fileId.value) {
            rtn = i;
          }
        });
        return rtn ? rtn : baseNote.value;
      });
      let n_timer;
      function commentInput(value) {
        noteChanged = true;
        if (n_timer)
          clearTimeout(n_timer);
        n_timer = setTimeout(() => {
          saveNote();
        }, 60 * 1e3);
      }
      function saveNote() {
        if (!noteChanged)
          return;
        if (n_timer)
          clearTimeout(n_timer);
        noteChanged = false;
        noteSaving.value = true;
        DB.saveNote(note.value).then((res) => {
          console.warn(res.result.updated);
          if (res.result.updated === void 0)
            initNotes();
          noteSaving.value = false;
        });
      }
      vue.onMounted(() => {
        initData();
        initContents();
        initNotes();
      });
      async function initNotes() {
        DB.getNoteList(id.value).then((res) => {
          console.warn(res);
          notes.value = res;
        });
      }
      function initContents() {
        collapse.leftLoading = true;
        xkbasys.sqclmlXkbaList(id.value).then((res) => {
          var _a2;
          console.warn(res[id.value]);
          contents.value = res[id.value];
          (_a2 = contents.value.list) == null ? void 0 : _a2.map((i) => {
            if (i.fileId === null)
              i.clmlmc += "(未上传)";
            i.fileId = encodeURIComponent(i.fileId);
            if (i.fileId === fileId.value) {
              document.title = i.clmlmc;
            }
            i.fileList.map((j) => {
              j.fileId = encodeURIComponent(j.fileId);
            });
          });
          contents.value.baseinfo.cpmc = contents.value.baseinfo.cpmc.replace(/[(品种:)\(\)]/g, "");
          collapse.leftLoading = false;
        });
      }
      function initData() {
        const href2 = window.location.href;
        const query = {};
        href2.split("?")[1].split("&").forEach((q) => {
          const t = q.split("=");
          query[t[0]] = t[1];
        });
        fileId.value = query.key;
        token.value = query.token;
        id.value = query.id;
      }
      const tools = [
        {
          title: "智械",
          url: "https://www.zhixie.info/"
        },
        {
          title: "道客",
          url: "https://www.doc88.com/"
        },
        {
          title: "行标",
          url: "http://app.nifdc.org.cn/biaogzx/qxqwk.do"
        },
        {
          title: "国标",
          url: "http://openstd.samr.gov.cn/bzgk/gb/index"
        },
        {
          title: "国家局",
          url: "https://www.nmpa.gov.cn/datasearch/search-result.html"
        },
        {
          title: "百度",
          url: "https://www.baidu.com"
        },
        {
          title: "有道",
          url: "https://fanyi.youdao.com/"
        }
      ];
      function open(url) {
        window.open(url);
      }
      const pageManager = vue.ref();
      const page = vue.ref("");
      return (_ctx, _cache) => {
        const _component_Link = vue.resolveComponent("Link");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowLeft = vue.resolveComponent("ArrowLeft");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_CopyDocument = vue.resolveComponent("CopyDocument");
        const _component_UserFilled = vue.resolveComponent("UserFilled");
        const _component_Loading = vue.resolveComponent("Loading");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
              class: "body",
              style: vue.normalizeStyle(`width: ${collapse.left ? 300 : 0}px`)
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(contents.value.list, (c) => {
                return vue.openBlock(), vue.createElementBlock("div", null, [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["item", c.fileId !== "null" ? c.fileId === fileId.value ? "active" : "" : "null"])
                  }, [
                    vue.createVNode(_component_el_link, {
                      underline: false,
                      target: "_blank",
                      href: "?key=" + c.fileId + "&token=" + token.value + "&id=" + id.value
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_icon, { class: "icon" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_Link)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 2
                    }, 1032, ["href"]),
                    vue.createElementVNode("span", {
                      onClick: ($event) => c.fileId !== "null" && (fileId.value = c.fileId)
                    }, vue.toDisplayString(c.clmlmc), 9, _hoisted_3)
                  ], 2),
                  c.fileList.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(c.fileList, (h, i) => {
                      return vue.openBlock(), vue.createElementBlock("div", null, [
                        vue.createElementVNode("div", {
                          class: vue.normalizeClass(["item", h.fileId === fileId.value ? "active" : ""])
                        }, [
                          vue.createElementVNode("span", {
                            onClick: ($event) => fileId.value = h.fileId
                          }, [
                            vue.createVNode(_component_el_tooltip, {
                              content: h.scyj
                            }, {
                              default: vue.withCtx(() => [
                                vue.createTextVNode(" 历史上传：" + vue.toDisplayString(h.fileName), 1)
                              ]),
                              _: 2
                            }, 1032, ["content"])
                          ], 8, _hoisted_5)
                        ], 2)
                      ]);
                    }), 256))
                  ])) : vue.createCommentVNode("", true)
                ]);
              }), 256))
            ], 4)), [
              [_directive_loading, collapse.leftLoading]
            ]),
            vue.createElementVNode("div", {
              class: "cbtn",
              onClick: _cache[0] || (_cache[0] = ($event) => collapse.left = !collapse.left)
            }, [
              !collapse.left ? (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 0 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_ArrowRight)
                ]),
                _: 1
              })) : (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 1 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_ArrowLeft)
                ]),
                _: 1
              }))
            ])
          ]),
          vue.createElementVNode("div", _hoisted_6, [
            vue.createElementVNode("div", _hoisted_7, [
              vue.createVNode(_component_el_input, {
                class: "classify",
                onClick: openSpHelper,
                modelValue: classSearch.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => classSearch.value = $event),
                "prefix-icon": vue.unref(ElementPlusIconsVue.Search),
                placeholder: "分类 / 免临床 / 标准 / 指导原则",
                clearable: ""
              }, null, 8, ["modelValue", "prefix-icon"]),
              vue.createVNode(_component_el_button, { onClick: openCaseRecords }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("办理记录")
                ]),
                _: 1
              }),
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(tools, (t) => {
                return vue.createVNode(_component_el_button, {
                  onClick: ($event) => open(t.url)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(t.title), 1)
                  ]),
                  _: 2
                }, 1032, ["onClick"]);
              }), 64))
            ]),
            vue.createElementVNode("div", _hoisted_8, [
              vue.createElementVNode("iframe", {
                width: "100%",
                height: "100%",
                src: "/fileManager/fileresource.pdf?key=" + fileId.value + "&token=" + token.value + "&id=" + id.value,
                frameborder: "no",
                border: "0"
              }, null, 8, _hoisted_9)
            ]),
            vue.createElementVNode("div", _hoisted_10, [
              vue.createVNode(_component_el_button, {
                onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(xkbasys).todo(contents.value.baseinfo.xksbxxid, contents.value.baseinfo.hjmc, contents.value.baseinfo.activityInstId))
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("业务办理")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[3] || (_cache[3] = ($event) => {
                  pageManager.value.show = true;
                  page.value = "clbc";
                })
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("材料补充")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[4] || (_cache[4] = ($event) => {
                  pageManager.value.show = true;
                  page.value = "hyjy";
                })
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("会议纪要")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[5] || (_cache[5] = ($event) => {
                  pageManager.value.show = true;
                  page.value = "hcqd";
                })
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("核查清单")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[6] || (_cache[6] = ($event) => {
                  pageManager.value.show = true;
                  page.value = "pdbg";
                })
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("评定报告")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[7] || (_cache[7] = ($event) => vue.unref(copy)(
                  `${contents.value.baseinfo.sbr}-${contents.value.baseinfo.cpmc}-${contents.value.baseinfo.ajbh}`
                ))
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("生成目录")
                ]),
                _: 1
              })
            ])
          ]),
          vue.createElementVNode("div", _hoisted_11, [
            vue.createElementVNode("div", {
              class: "cbtn",
              onClick: _cache[8] || (_cache[8] = ($event) => collapse.right = !collapse.right)
            }, [
              collapse.right ? (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 0 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_ArrowRight)
                ]),
                _: 1
              })) : (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 1 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_ArrowLeft)
                ]),
                _: 1
              }))
            ]),
            vue.createElementVNode("div", {
              class: "body",
              style: vue.normalizeStyle(`width: ${collapse.right ? 500 : 0}px`)
            }, [
              contents.value.baseinfo ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, [
                vue.createElementVNode("div", _hoisted_13, [
                  vue.createTextVNode(vue.toDisplayString(contents.value.baseinfo.sxmc) + " ", 1),
                  vue.createElementVNode("span", {
                    class: "copyable",
                    onClick: _cache[9] || (_cache[9] = ($event) => vue.unref(copy)(contents.value.baseinfo.ajbh))
                  }, [
                    vue.createTextVNode(" （ "),
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(contents.value.baseinfo.ajbh) + " ） ", 1)
                  ])
                ]),
                vue.createElementVNode("div", {
                  class: "copyable",
                  onClick: _cache[10] || (_cache[10] = ($event) => vue.unref(copy)(contents.value.baseinfo.sbr))
                }, vue.toDisplayString(contents.value.baseinfo.sbr), 1),
                vue.createElementVNode("div", {
                  class: "copyable",
                  onClick: _cache[11] || (_cache[11] = ($event) => vue.unref(copy)(contents.value.baseinfo.scdz))
                }, vue.toDisplayString(contents.value.baseinfo.scdz), 1),
                vue.createElementVNode("div", {
                  class: "copyable",
                  onClick: _cache[12] || (_cache[12] = ($event) => vue.unref(copy)(contents.value.baseinfo.cpmc))
                }, vue.toDisplayString(contents.value.baseinfo.cpmc), 1),
                vue.createElementVNode("div", null, [
                  contents.value.baseinfo.wtdlr ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_14, vue.toDisplayString(contents.value.baseinfo.wtdlr) + " " + vue.toDisplayString(contents.value.baseinfo.wtdlrlxdh), 1)) : vue.createCommentVNode("", true),
                  contents.value.baseinfo.wtdlr !== contents.value.baseinfo.lxdlr ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_15, [
                    vue.createVNode(_component_el_icon, { style: { "transform": "translateY(2px)" } }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_UserFilled)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(contents.value.baseinfo.lxdlr) + " " + vue.toDisplayString(contents.value.baseinfo.lxdlrsjhm), 1)
                  ])) : vue.createCommentVNode("", true)
                ])
              ])) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", _hoisted_16, [
                vue.createVNode(_component_el_input, {
                  disabled: noteSaving.value,
                  onBlur: saveNote,
                  onInput: _cache[13] || (_cache[13] = ($event) => commentInput()),
                  modelValue: vue.unref(note).data.comment,
                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => vue.unref(note).data.comment = $event),
                  rows: 8,
                  type: "textarea"
                }, null, 8, ["disabled", "modelValue"]),
                noteSaving.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_17, [
                  vue.createVNode(_component_el_icon, { class: "is-loading" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_Loading)
                    ]),
                    _: 1
                  }),
                  _hoisted_18
                ])) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("div", _hoisted_19, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(notes.value, (n) => {
                  return vue.openBlock(), vue.createElementBlock("div", null, [
                    n.data.comment ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 0,
                      class: vue.normalizeClass(["item", fileId.value === n.fileId ? "active" : ""]),
                      onClick: ($event) => fileId.value = n.fileId
                    }, vue.toDisplayString(n.data.comment), 11, _hoisted_20)) : vue.createCommentVNode("", true)
                  ]);
                }), 256))
              ])
            ], 4)
          ]),
          vue.createVNode(CaseRecords, {
            ref_key: "caseRecords",
            ref: caseRecords
          }, null, 512),
          vue.createVNode(SpHelperVue, {
            ref_key: "spHelper",
            ref: spHelper,
            iscomp: true
          }, null, 512),
          vue.createVNode(_sfc_main$1, {
            ref_key: "pageManager",
            ref: pageManager,
            page: page.value
          }, null, 8, ["page"])
        ]);
      };
    }
  });
  const SpNote_vue_vue_type_style_index_0_scoped_576746f6_lang = "";
  const SpNoteVue = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-576746f6"]]);
  const gxwtExport = async () => {
    const href2 = window.location.href;
    console.warn(href2);
    const gray = document.querySelector(".gray");
    console.log(gray);
    const totalPage = (gray == null ? void 0 : gray.innerHTML.match(/共(.*?)页/)[1]) || 0;
    console.log(totalPage);
    const data = [];
    for (let i = 0; i < totalPage; i++) {
      const url = `https://www.cmde.org.cn/splt/ltgxwt/index${i == 0 ? "" : "_" + i}.html`;
      console.log(url);
      await getHtml(url).then(async (html) => {
        const list = $(html).find(".list ul li");
        for (let i2 = 0; i2 < list.length; i2++) {
          const ele = list[i2];
          const $a = $($(ele).children()[1]);
          const title = $a.attr("title");
          const url2 = $a.attr("href").replace("../..", "https://www.cmde.org.cn/");
          const date = $(ele).children()[2].innerHTML.replace(/[\(\)]/g, "");
          console.log(title, url2, date);
          await getHtml(url2).then((html2) => {
            const content = html2.match(/"ContentStart"\/>(.*?)<meta name="ContentEnd"/s);
            const str = content[1].replace(/<.*?>/g, "").trim();
            data.push({
              "共性问题": title,
              "器审中心答复": str,
              "答复时间": date
            });
          });
        }
      });
    }
    console.log(data);
    const ws = XLSX__namespace.utils.json_to_sheet(data);
    const wb = {
      SheetNames: ["答疑"],
      Sheets: {
        "答疑": ws
      }
    };
    XLSX__namespace.write(wb, { bookType: "xlsx", bookSST: true, type: "base64" });
    XLSX__namespace.writeFile(wb, "器审中心答疑.xlsx");
  };
  function getHtml(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "get",
        url,
        success(html) {
          resolve(html);
        }
      });
    });
  }
  const win = unsafeWindow;
  const $$1 = win.$;
  const href = window.location.href;
  const baseUrl = "https://ypjg.ahsyjj.cn:3510/";
  if (href === baseUrl + "spd/" || href === baseUrl + "spd/#") {
    console.warn("首页", window.location.href);
    handleHomePage();
    spHelperInit();
  } else if (href.indexOf(baseUrl + "fileManager/preview") !== -1) {
    console.warn("笔记", window.location.href);
    spNoteInit();
  } else if (href.indexOf("https://www.cmde.org.cn/splt/ltgxwt") !== -1) {
    console.warn("共性问题");
    const exportLi = $$1(`<li class="columnPageTitle">导出</li>`);
    (_b = (_a = document.querySelector(".columnPageTitle")) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.appendChild(exportLi[0]);
    exportLi.click(async () => {
      exportLi.html("导出中，请务重复点击...");
      await gxwtExport();
      exportLi.html("导出成功");
      exportLi.unbind();
    });
  }
  function handleHomePage() {
    $$1("#cbxx").css("position", "absolute");
    {
      const myTodoText = "我的待办+", myDoneText = "我的已办+", bjSearchText = "办件查询+";
      const treeDom = $$1(".easyui-tree.sidemenu-tree.tree")[0];
      const { data, onClick } = $$1(treeDom).tree("options");
      data.splice(2, 0, { text: myTodoText, children: [] });
      data.splice(3, 0, { text: myDoneText, children: [] });
      data.splice(4, 0, { text: bjSearchText, children: [] });
      $$1(treeDom).tree({
        data,
        onClick(node) {
          let app;
          if (node.text === myTodoText) {
            console.warn(myTodoText);
            app = MyTodoVue;
          } else if (node.text === myDoneText) {
            console.warn(myDoneText);
            app = MyDoneVue;
          } else if (node.text === bjSearchText) {
            console.warn(bjSearchText);
            app = MySearchVue;
          } else {
            return onClick(node);
          }
          premount(node.text, app);
        }
      });
    }
    {
      const bjSearchText = "办件查询+";
      const treeDom = $$1(".easyui-tree.sidemenu-tree.tree")[2];
      const { data, onClick } = $$1(treeDom).tree("options");
      data.splice(1, 0, { text: bjSearchText, children: [] });
      $$1(treeDom).tree({
        data,
        onClick(node) {
          let app;
          if (node.text === bjSearchText) {
            console.warn(bjSearchText);
            app = MySearchVue;
          } else {
            return onClick(node);
          }
          premount(node.text, app);
        }
      });
    }
    function premount(title, component) {
      Frame.openNewMainTab({ title });
      const tab = $$1("#maintab").tabs("getTab", title);
      tab.find("iframe").remove();
      mount(tab, component);
    }
  }
  function spHelperInit() {
    let helper_entry = $$1(".sphelper");
    if (helper_entry.length)
      return;
    helper_entry = $$1(
      /*html*/
      `
    <div class="sphelper">
    </div>
  `
    );
    $$1(".super-setting-left").append(helper_entry);
    mount(helper_entry, SpHelperVue);
  }
  function spNoteInit() {
    if (document.querySelector("#spnote"))
      return;
    if (window.location.href.indexOf("id=") === -1)
      return;
    mount(document.body, SpNoteVue);
  }
  function mount(root, component) {
    const app = vue.createApp(component);
    for (const [key, component2] of Object.entries(ElementPlusIconsVue__namespace)) {
      app.component(key, component2);
    }
    app.use(ElementPlus, { locale: ElementPlusLocaleZhCn }).use(Clipboard).mount((() => {
      const div = document.createElement("div");
      root.append(div);
      return div;
    })());
  }
})(Vue, ElementPlus, ElementPlusIconsVue, ElementPlusLocaleZhCn, this["v-clipboard"], $, XLSX, PizZip, PizZipUtils, docxtemplater, saveAs);
