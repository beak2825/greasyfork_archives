// ==UserScript==
// @name         @shenzi#soushuba_tid_tmp
// @name:zh-CN   @神紫#小说网站 搜书吧 缓存tid
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  搜书吧 缓存tid
// @author       神紫
// @match        *://vsdf.n.rkggs5f4e5asf.com/*
// @match        *://v.asf.nupt4j5yt4.com/*
// @match        *://s.dg.b4yh4tyj46.com/*
// @match        *://p6.36.nu6kiu4yuk5.com/*
// @match        *://u0.k1.2ijtyj454.com/*
// @match        *://52n.mf.56sdfwef45.com/*
// @match        *://62df.th.9ef56erg.com/*
// @match        *://upq.asd6.sa5f6dff3f12.com/*
// @match        *://q1.v.agrth45tge.com/*
// @match        *://b6d.vb.2bhrg1e54.com/*
// @match        *://cc96.c3.c3sdefwewer.com/*
// @match        *://33ty.hk.sdvs4df4e5f4.com/*
// @match        *://nhg.69.tj55tg4y5asd.com/*
// @match        *://gdr.6d9g.b172gf1r5g.com/*
// @match        *://g9dr.bnm.9vdrg4er5.com/*
// @match        *://sxsy77.com/*
// @match        *://sxsy122.com/*
// @match        *://sxsy19.com/*
// @match        *://404ba.com/*
// @match        *://404zu.com/*
// @match        *://404zu.net/*
// @match        *://404zu.org/*
// @match        *://404ku.com/*
// @icon         https://b6d.vb.2bhrg1e54.com/favicon.ico
// @icon         https://sxsy19.com/favicon.ico
// @icon         https://404ku.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529749/%40shenzisoushuba_tid_tmp.user.js
// @updateURL https://update.greasyfork.org/scripts/529749/%40shenzisoushuba_tid_tmp.meta.js
// ==/UserScript==



"use strict";
(function () {
    class DecimalBase64To {
        static base64Code = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
        static decToB64(decimal) {
            if (decimal === 0)
                return this.base64Code[0];
            const base64Arr = [];
            while (decimal > 0) {
                const remainder = decimal % 64;
                base64Arr.push(this.base64Code[remainder]);
                decimal = Math.floor((decimal - remainder) / 64);
            }
            return base64Arr.reverse().join("");
        }
        static b64ToDec(base64) {
            let decimal = 0;
            for (let i = 0; i < base64.length; i++) {
                const value = this.base64Code.indexOf(base64[i]);
                if (value === -1)
                    return NaN;
                decimal = decimal * 64 + value;
            }
            return decimal;
        }
    }
    class DataTmp {
        data_key;
        max_exist_time_get_data_tmp;
        black_flag;
        last_time_get_data_tmp = -1;
        data = "";
        constructor(data_key, black_flag = "|", max_exist_time_get_data_tmp = 30 * 1000) {
            this.data_key = data_key;
            this.black_flag = black_flag;
            this.max_exist_time_get_data_tmp = max_exist_time_get_data_tmp;
        }
        init() {
            this.data = GM_getValue(this.data_key, this.black_flag);
            this.last_time_get_data_tmp = Date.now();
        }
        _add(value) { this.data += `${value}${this.black_flag}`; }
        _del(value) { this.data = this.data.replace(`${this.black_flag}${value}${this.black_flag}`, this.black_flag); }
        _save() { GM_setValue(this.data_key, this.data); }
        exist(value) { return this.data.indexOf(`${this.black_flag}${value}${this.black_flag}`) !== -1; }
        init_tmp() { if (Date.now() - this.last_time_get_data_tmp >= this.max_exist_time_get_data_tmp) {
            this.init();
        } }
        add_unsave(value) {
            this.init_tmp();
            this._add(value);
        }
        add_save(value) {
            this.init();
            if (!this.exist(value)) {
                this._add(value);
                this._save();
            }
        }
        del_save(value) {
            this.init();
            if (this.exist(value)) {
                this._del(value);
                this._save();
            }
        }
        load(values) {
            this.init();
            let updated = false;
            for (const value of values) {
                if (!this.exist(value)) {
                    if (!updated)
                        updated = true;
                    this._add(value);
                }
            }
            if (updated) {
                this._save();
            }
        }
        dumps_fmt_dump(dumps) { return dumps.split(this.black_flag).map(dt => dt.trim()).filter(dt => dt.length !== 0); }
        fmt_data() { this.init(); return this.dumps_fmt_dump(this.data); }
        dump() { return this.fmt_data(); }
        dumps() { this.init(); return this.data; }
        optimize_sorted() {
            const dts = this.fmt_data();
            if (dts.length === 0)
                return;
            const data = dts.sort().join(this.black_flag);
            GM_setValue(this.data_key, `${this.black_flag}${data}${this.black_flag}`);
        }
    }
    class ImExData {
        static im_init = false;
        static im_open;
        static dm_init = false;
        static dm_open;
        static dts_exp_fail(dts) {
            const fails = [];
            dts.forEach((dat) => { if (isNaN(DecimalBase64To.b64ToDec(dat))) {
                fails.push(dat);
            } });
            return fails;
        }
        static load_im_dm_style() {
            const style = document.createElement("style");
            style.innerText = `
#confirm-dialog {
  border: none;
  border-radius: 8px;
  padding: 20px;
  min-width: 20em;
  width: 30em;
  max-width: 80%;
}

#confirm-dialog[data-state="init"] #confirm-content { border-color: #1f1f1f; }
#confirm-dialog[data-state="succeed"] #confirm-content { border-color: #7fff00; }
#confirm-dialog[data-state="fail"] #confirm-content { border-color: #ff0000; }

#confirm-content {
  min-width: 97%;
  max-width: 97%;
  min-height: 10em;
  height: 20em;
  max-height: 80vh;
}

#confirm-error { color: #ff0000; font-weight: bold; }
`;
            document.body.appendChild(style);
        }
        static load_im_element(data_key, data_ban_key, black_flag) {
            const confirmDialog = document.createElement("dialog");
            const confirmContent = document.createElement("textarea");
            const confirmError = document.createElement("p");
            const confirmPaste = document.createElement("button");
            const confirmSubmit = document.createElement("button");
            const confirmClose = document.createElement("button");
            confirmContent.placeholder = "请输入要导入的数据";
            confirmPaste.innerText = "导入剪切板的数据";
            confirmSubmit.innerText = "确定";
            confirmClose.innerText = "取消";
            confirmDialog.id = "confirm-dialog";
            confirmContent.id = "confirm-content";
            confirmError.id = "confirm-error";
            confirmPaste.id = "confirm-paste";
            confirmSubmit.id = "confirm-submit";
            confirmClose.id = "confirm-close";
            function msgOut(state, errorinfo, content) { confirmDialog.dataset.state = state; confirmError.innerText = errorinfo; confirmContent.value = content; }
            function initOut() { msgOut("init", "", ""); }
            function infoOut(content) { msgOut("succeed", "", content); }
            function errorOut(errorinfo, content = "") { msgOut("fail", errorinfo, content); }
            const initObj = () => {
                option_dbpack = null;
                initOut();
            };
            this.im_open = () => {
                confirmDialog.showModal();
                initObj();
            };
            const checkdata = () => {
                const importedData = confirmContent.value.trim();
                if (importedData.length === 0)
                    return errorOut("无数据");
                let idbpack;
                try {
                    idbpack = this.im_dbpack(importedData, this.allowKeys, black_flag);
                }
                catch (e) {
                    return errorOut(e.message);
                }
                let dt = new DataTmp(data_key, black_flag);
                const i10 = this.allowKeyCore in idbpack;
                const i20 = this.allowKeyBan in idbpack;
                const importedCoreData = i10 ? dt.dumps_fmt_dump(idbpack[this.allowKeyCore]) : [];
                const importedBanData = i20 ? dt.dumps_fmt_dump(idbpack[this.allowKeyBan]) : [];
                dt = null;
                const fails = this.dts_exp_fail(importedCoreData);
                if (fails.length !== 0)
                    return errorOut("↑↑↑❌浏览数据加载出错❌↑↑↑", importedCoreData.join(black_flag));
                const failBans = this.dts_exp_fail(importedBanData);
                if (failBans.length !== 0)
                    return errorOut("↑↑↑❌封禁数据加载出错❌↑↑↑", importedBanData.join(black_flag));
                option_dbpack = idbpack;
                if (!i10)
                    return infoOut(`封禁数据：\n${importedBanData.join(black_flag)}`);
                if (!i20)
                    return infoOut(`浏览数据：\n${importedCoreData.join(black_flag)}`);
                return infoOut(`浏览数据：\n${importedCoreData.join(black_flag)}\n${`${'-'.repeat(10)}\n`.repeat(3)}封禁数据：\n${importedBanData.join(black_flag)}`);
            };
            let option_dbpack;
            confirmContent.addEventListener("change", checkdata);
            confirmPaste.addEventListener("click", () => {
                navigator.clipboard.readText()
                    .then((text) => { confirmContent.value = text; checkdata(); })
                    .catch((err) => { alert(`无法从剪切板读取数据: ${err}`); });
            });
            confirmSubmit.addEventListener("click", () => {
                if (confirmDialog.dataset?.state !== "succeed")
                    return;
                if (option_dbpack === null)
                    return;
                let dt = new DataTmp(data_key, black_flag);
                const i10 = this.allowKeyCore in option_dbpack;
                const i20 = this.allowKeyBan in option_dbpack;
                const importedCoreData = i10 ? dt.dumps_fmt_dump(option_dbpack[this.allowKeyCore]) : [];
                const importedBanData = i20 ? dt.dumps_fmt_dump(option_dbpack[this.allowKeyBan]) : [];
                if (i10)
                    dt.load(importedCoreData);
                if (i20)
                    new DataTmp(data_ban_key, black_flag).load(importedBanData);
                dt = null;
                initObj();
                confirmDialog.close();
            });
            confirmClose.addEventListener("click", () => {
                if (confirmDialog === null)
                    return;
                initObj();
                confirmDialog.close();
            });
            confirmDialog.appendChild(confirmContent);
            confirmDialog.appendChild(confirmError);
            confirmDialog.appendChild(confirmPaste);
            confirmDialog.appendChild(confirmSubmit);
            confirmDialog.appendChild(confirmClose);
            document.body.appendChild(confirmDialog);
        }
        static add_dm_options(select, options, currOption) {
            const optionEls = [];
            for (const option of options) {
                if (option === currOption)
                    continue;
                const thisOption = option;
                const optionEl = document.createElement("option");
                optionEl.className = "option-other-web";
                optionEl.value = optionEl.innerText = thisOption;
                select.appendChild(optionEl);
                optionEls.push(optionEl);
            }
            return optionEls;
        }
        static remove_dm_options(select, options) {
            for (const option of options) {
                select.removeChild(option);
            }
            options.splice(0, options.length);
        }
        static load_dm_element(ksDt, ksBanDt, data_key, data_ban_key, black_flag) {
            const confirmDialog = document.createElement("dialog");
            const confirmTitle = document.createElement("select");
            const confirmOptionVoid = document.createElement("option");
            const confirmContent = document.createElement("textarea");
            const confirmError = document.createElement("p");
            const confirmSubmit = document.createElement("button");
            const confirmClose = document.createElement("button");
            confirmOptionVoid.innerText = "请选择网站";
            confirmOptionVoid.value = "null";
            confirmOptionVoid.selected = true;
            confirmContent.readOnly = true;
            confirmContent.placeholder = "请选择上方‘其他网站的数据’，\n以便装以‘该网站’的数据到‘本网站’。";
            confirmSubmit.innerText = "确定";
            confirmClose.innerText = "取消";
            confirmDialog.id = "confirm-dialog";
            confirmTitle.id = "confirm-selects";
            confirmContent.id = "confirm-content";
            confirmError.id = "confirm-error";
            confirmSubmit.id = "confirm-submit";
            confirmClose.id = "confirm-close";
            function msgOut(state, errorinfo, content) { confirmDialog.dataset.state = state; confirmError.innerText = errorinfo; confirmContent.value = content; }
            function initOut() { msgOut("init", "", ""); }
            function infoOut(content) { msgOut("succeed", "", content); }
            function errorOut(errorinfo, content = "") { msgOut("fail", errorinfo, content); }
            const initObj = () => {
                optionHt = null;
                if (options !== null)
                    this.remove_dm_options(confirmTitle, options);
                initOut();
                confirmOptionVoid.selected = true;
            };
            this.dm_open = () => {
                confirmDialog.showModal();
                initObj();
                options = this.add_dm_options(confirmTitle, ksDt.read_fmt_hts(), all_tid_dt.unfmt_host(data_key));
            };
            let optionHt;
            let options = null;
            confirmTitle.addEventListener("change", () => {
                const { selectedOptions } = confirmTitle;
                if (selectedOptions.length === 0)
                    return errorOut("异常程式-无选择");
                else if (selectedOptions.length > 1)
                    return errorOut("异常程式-多重选择");
                const selectedOption = selectedOptions[0];
                const optionHt2 = selectedOption.value;
                const importedData = new DataTmp(ksDt.fmt_key(optionHt2), black_flag).dump();
                const importedBanData = new DataTmp(ksBanDt.fmt_key(optionHt2), black_flag).dump();
                const i10 = importedData.length === 0;
                const i20 = importedBanData.length === 0;
                if (i10 && i20)
                    return errorOut("网站数据为空");
                const fails = this.dts_exp_fail(importedData);
                if (fails.length !== 0)
                    return errorOut("↑↑↑❌浏览数据加载出错❌↑↑↑", importedData.join(black_flag));
                const failBans = this.dts_exp_fail(importedBanData);
                if (failBans.length !== 0)
                    return errorOut("↑↑↑❌封禁数据加载出错❌↑↑↑", importedBanData.join(black_flag));
                optionHt = optionHt2;
                if (i10)
                    return infoOut(`封禁数据：\n${importedBanData.join(black_flag)}`);
                if (i20)
                    return infoOut(`浏览数据：\n${importedData.join(black_flag)}`);
                return infoOut(`浏览数据：\n${importedData.join(black_flag)}\n${`${'-'.repeat(10)}\n`.repeat(3)}封禁数据：\n${importedBanData.join(black_flag)}`);
            });
            confirmSubmit.addEventListener("click", () => {
                if (confirmDialog.dataset?.state !== "succeed")
                    return;
                if (optionHt === null)
                    return;
                const data_key2 = ksDt.fmt_key(optionHt);
                const data_ban_key2 = ksBanDt.fmt_key(optionHt);
                const dump_key2 = new DataTmp(data_key2, black_flag).dump();
                const dump_ban_key2 = new DataTmp(data_ban_key2, black_flag).dump();
                if (dump_key2.length !== 0)
                    new DataTmp(data_key, black_flag).load(dump_key2);
                if (dump_ban_key2.length !== 0)
                    new DataTmp(data_ban_key, black_flag).load(dump_ban_key2);
                ksDt.delete_key(data_key2);
                ksBanDt.delete_key(data_ban_key2);
                initObj();
                confirmDialog.close();
            });
            confirmClose.addEventListener("click", () => {
                if (confirmDialog === null)
                    return;
                initObj();
                confirmDialog.close();
            });
            confirmTitle.appendChild(confirmOptionVoid);
            confirmDialog.appendChild(confirmTitle);
            confirmDialog.appendChild(confirmContent);
            confirmDialog.appendChild(confirmError);
            confirmDialog.appendChild(confirmSubmit);
            confirmDialog.appendChild(confirmClose);
            document.body.appendChild(confirmDialog);
        }
        static optimize_sorted_base(ksDt, black_flag) {
            const keys = ksDt.read_keys();
            for (const key of keys) {
                let dt = new DataTmp(key, black_flag);
                dt.optimize_sorted();
                dt = null;
            }
        }
        static ex_dbpack_start(k, black_flag) { return `${k}${black_flag.repeat(2)}>>${k}>>>${black_flag.repeat(2)}`; }
        static ex_dbpack_end(k, black_flag) { return `${black_flag.repeat(2)}<<${k}<<<${black_flag.repeat(2)}`; }
        static ex_dbpack_split(black_flag) { return `${black_flag.repeat(2)}<>><><${black_flag.repeat(2)}`; }
        static allowKeyCore = "core";
        static allowKeyBan = "ban";
        static allowKeys = [this.allowKeyCore, this.allowKeyBan];
        static im_dbpack(dbpack, keys, black_flag) {
            const dbpacks = dbpack.split(this.ex_dbpack_split(black_flag));
            const eobj = {};
            for (const dbpack of dbpacks) {
                const [k] = dbpack.split(black_flag, 1);
                if (k in eobj)
                    throw new Error("数据key值重复");
                if (!keys.includes(k))
                    throw new Error(`${k}[k]不属于keys: ${JSON.stringify(keys)}`);
                const dbpack_start = this.ex_dbpack_start(k, black_flag);
                if (!dbpack.startsWith(dbpack_start))
                    throw new Error(`${dbpack_start}这个头部数据未能匹配到这个数据：${dbpack}`);
                const dbpack_end = this.ex_dbpack_end(k, black_flag);
                if (!dbpack.endsWith(dbpack_end))
                    throw new Error(`${dbpack_end}这个尾部数据未能匹配到这个数据：${dbpack}`);
                eobj[k] = dbpack.substring(dbpack_start.length, dbpack.length - dbpack_end.length);
            }
            return eobj;
        }
        static ex_dbpack(mp, black_flag) { return mp.map(([k, v]) => `${this.ex_dbpack_start(k, black_flag)}${v}${this.ex_dbpack_end(k, black_flag)}`).join(this.ex_dbpack_split(black_flag)); }
        static im(data_key, data_ban_key, black_flag) {
            if (!this.im_init) {
                this.im_init = true;
                if (!this.dm_init)
                    this.load_im_dm_style();
                this.load_im_element(data_key, data_ban_key, black_flag);
            }
            this.im_open?.();
        }
        static ex(data_key, data_ban_key, black_flag) {
            const dbpack = this.ex_dbpack([
                [this.allowKeyCore, new DataTmp(data_key, black_flag).dumps()],
                [this.allowKeyBan, new DataTmp(data_ban_key, black_flag).dumps()],
            ], black_flag);
            if (dbpack === "") {
                alert("写入剪贴板失败: tid数据为空");
            }
            else {
                try {
                    GM_setClipboard(dbpack);
                    alert("写入剪贴板成功！");
                }
                catch (error) {
                    alert("写入剪贴板失败: " + error);
                }
            }
        }
        static data_migration(ksDt, ksBanDt, data_key, data_ban_key, black_flag) {
            if (!this.dm_init) {
                this.dm_init = true;
                if (!this.im_init)
                    this.load_im_dm_style();
                this.load_dm_element(ksDt, ksBanDt, data_key, data_ban_key, black_flag);
            }
            this.dm_open?.();
        }
        static optimize_sorted(ksDt, ksBanDt, black_flag) {
            this.optimize_sorted_base(ksDt, black_flag);
            this.optimize_sorted_base(ksBanDt, black_flag);
        }
    }
    class KeysDt {
        mkey;
        constructor(mkey) { this.mkey = `#${mkey}`; }
        unfmt_host(key) { return key.substring(0, key.length - this.mkey.length); }
        fmt_key(host) { return `${host}${this.mkey}`; }
        check_key(key) { return key.endsWith(this.mkey); }
        delete_key(key) { this.check_key(key) ? GM_deleteValue(key) : undefined; }
        read_keys() { return GM_listValues().filter((key) => this.check_key(key)); }
        read_fmt_hts() { return this.read_keys().map((key) => this.unfmt_host(key)); }
    }
    function rCodeE(rCode, min = 4, max = 6) {
        const rcl = rCode.length;
        const rl = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Array(rl).fill("")
            .map(() => rCode[Math.floor(Math.random() * rcl)])
            .join("");
    }
    function reset_gmdata(key, handle) {
        const rf = rCodeE(".0123456789");
        let userInput = prompt(`您正在进行一个危险的操作[${handle}]，请输入这段字符串=> ${rf} <=以确保该操作是由您本人的发动的！`);
        if (userInput === null) {
            alert("❌操作已取消。❌");
        }
        else if (userInput === rf) {
            alert(`✔️输入正确，请确认此消息(Enter)，操作[${handle}]将会运行。✔️`);
            GM_deleteValue(key);
        }
        else {
            alert("❌输入错误，操作已取消。❌");
        }
    }
    const all_tid_dt = new KeysDt("tid_datas");
    const all_tid_ban_dt = new KeysDt("tid_ban_datas");
    const tid_tmp_key = all_tid_dt.fmt_key(window.location.host);
    const tid_ban_tmp_key = all_tid_ban_dt.fmt_key(window.location.host);
    const tid_split = "|";
    GM_registerMenuCommand("重置tid浏览数据", () => reset_gmdata(tid_tmp_key, "重置tid浏览数据"));
    GM_registerMenuCommand("重置tid封禁数据", () => reset_gmdata(tid_ban_tmp_key, "重置tid封禁数据"));
    GM_registerMenuCommand("导出tid数据到剪切板", () => ImExData.ex(tid_tmp_key, tid_ban_tmp_key, tid_split));
    GM_registerMenuCommand("导入tid数据从剪切板", () => ImExData.im(tid_tmp_key, tid_ban_tmp_key, tid_split));
    GM_registerMenuCommand("迁移tid数据从缓存中", () => ImExData.data_migration(all_tid_dt, all_tid_ban_dt, tid_tmp_key, tid_ban_tmp_key, tid_split));
    GM_registerMenuCommand("tid数据顺序优化", () => ImExData.optimize_sorted(all_tid_dt, all_tid_ban_dt, tid_split));
    let ApplicationNames;
    (function (ApplicationNames) {
        ApplicationNames["soushuba"] = "\u641C\u4E66\u5427";
        ApplicationNames["sxsy"] = "\u5C1A\u9999\u4E66\u82D1";
        ApplicationNames["ba404"] = "404\u5427 - \u7F51\u7EDC\u5C0F\u8BF4\u4EA4\u6D41\u8BBA\u575B | 404\u7EC4 | 404KU | 404\u4E66\u5427";
    })(ApplicationNames || (ApplicationNames = {}));
    function getApplicationName() {
        const applicationNameMeta = document.querySelector('meta[name="application-name"]');
        if (applicationNameMeta === null)
            return null;
        let applicationName = applicationNameMeta.getAttribute('content');
        if (applicationName === null)
            return null;
        applicationName = applicationName.trim();
        const appName = Object.values(ApplicationNames).find(name => name.split("|").map(name => name.trim()).includes(applicationName));
        return appName ? appName : null;
    }
    function load_tid_style() {
        const style = document.createElement("style");
        style.innerHTML = `
#threadlisttableid tr[data-fidxexist="hide"] { display: none; }

#delform tr[data-banstate="init"][data-fidxexist="exist"]:hover td,
#delform tr[data-banstate="init"][data-fidxexist="exist"]:hover th,
#threadlisttableid tr[data-banstate="init"][data-fidxexist="exist"]:hover td,
#threadlisttableid tr[data-banstate="init"][data-fidxexist="exist"]:hover th { background: #0096fa; }

#delform tr[data-banstate="init"][data-fidxexist="exist"] th > a,
#threadlisttableid tr[data-banstate="init"][data-fidxexist="exist"] a.s.xst,
#threadlist ul li[data-banstate="init"][data-fidxexist="exist"] h3 a { color: snow; background: #0096fa; }

#threadlist ul li[data-fidxexist="exist"] h3 a strong font { color: snow; background: red; }

#delform tr[data-banstate="init"] td.icn,
#delform tr[data-banstate="ban"],
#threadlisttableid tr[data-banstate="init"] td.icn,
#threadlisttableid tr[data-banstate="ban"],
#threadlist ul li[data-banstate="init"] h3 span.uv,
#threadlist ul li[data-banstate="ban"] { position: relative; }

#delform tr[data-banstate="init"] td.icn:after,
#delform tr[data-banstate="ban"]:after,
#threadlisttableid tr[data-banstate="init"] td.icn:after,
#threadlisttableid tr[data-banstate="ban"]:after,
#threadlist ul li[data-banstate="init"] h3 span.uv:after,
#threadlist ul li[data-banstate="ban"]:after {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 65001;
  width: 100%;
  height: 100%;
  cursor: pointer;
  pointer-events: all;
}

#delform tr[data-banstate="init"] td.icn:after:active,
#threadlisttableid tr[data-banstate="init"] td.icn:after:active,
#threadlist ul li[data-banstate="init"] h3 span.uv:after:active {
  text-shadow: 2px 2px 6px black;
}

#delform tr[data-banstate="init"] td.icn:after,
#threadlisttableid tr[data-banstate="init"] td.icn:after,
#threadlist ul li[data-banstate="init"] h3 span.uv:after {
  content: "❌";
  background-color: #ffffff;
}
#delform tr[data-banstate="init"] td.icn:after,
#threadlisttableid tr[data-banstate="init"] td.icn:after {
  font-size: 1.5em;
}
#threadlist ul li[data-banstate="init"] h3 span.uv:after {
  font-size: 1.2em;
  top: 2.0em;
}
#delform tr[data-banstate="ban"] td.by,
#threadlisttableid tr[data-banstate="ban"] td.by { display: none; }
#delform tr[data-banstate="ban"]:after,
#threadlisttableid tr[data-banstate="ban"]:after,
#threadlist ul li[data-banstate="ban"]:after {
  content: "UI屏蔽中，点击解除屏蔽";
  background-color: rgba(255, 0, 0, 0.5);
  font-size: 2.0em;
  color: aliceblue;
  font-weight: bold;
  letter-spacing: 0.3em;
}
`;
        document.head.appendChild(style);
    }
    function load_replycoins_style() {
        const style = document.createElement("style");
        style.innerHTML = `
.post-btn-time {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.3em;
}
.post-btn-time .time-u30,
.post-btn-time .time-u45,
.post-btn-time .time-u60 {
  background: #0096fa;
}
.post-btn-time.run .time-u30,
.post-btn-time.run .time-u45,
.post-btn-time.run .time-u60 {
  background: red;
}
.post-btn-time.run.u30 .time-u30,
.post-btn-time.run.u45 .time-u30,
.post-btn-time.run.u45 .time-u45,
.post-btn-time.run.u60 .time-u30,
.post-btn-time.run.u60 .time-u45,
.post-btn-time.run.u60 .time-u60 {
  background: green;
}
.post-btn {
  font-size: 1.2em;
  font-weight: bold;
  background: #0096fa;
  color: azure;
  border: 0;
  border-radius: 0.3em;
  padding: 0.3em 0.6em;
  cursor: pointer;
}`;
        document.head.appendChild(style);
    }
    function keyJump() {
        function pageJump(className) {
            const elements = document.getElementsByClassName(className);
            if (elements.length === 0)
                return;
            const element = elements[0];
            if (!(element instanceof HTMLAnchorElement))
                return;
            element.click();
        }
        document.body.addEventListener("keydown", ({ altKey, ctrlKey, key, shiftKey }) => {
            if (!ctrlKey && !shiftKey && !altKey) {
                if (key === "ArrowLeft" || key === "a") {
                    pageJump("prev");
                }
                else if (key === "ArrowRight" || key === "d") {
                    pageJump("nxt");
                }
            }
        });
    }
    function keyJump404(urlSearch) {
        function pageJump(add) {
            const page = urlSearch.get("page");
            const next_page = (page === null ? 1 : parseInt(page, 10)) + add;
            urlSearch.set("page", next_page.toString(10));
            window.location.search = urlSearch.toString();
        }
        document.body.addEventListener("keydown", ({ altKey, ctrlKey, key, shiftKey }) => {
            if (!ctrlKey && !shiftKey && !altKey) {
                if (key === "ArrowLeft" || key === "a") {
                    pageJump(-1);
                }
                else if (key === "ArrowRight" || key === "d") {
                    pageJump(1);
                }
            }
        });
    }
    function keyJumpHome() {
        function pageJump(className) {
            const elements = document.getElementsByClassName(className);
            if (elements.length === 0)
                return;
            const element = elements[0];
            if (!(element instanceof HTMLAnchorElement))
                return;
            element.click();
        }
        function pageJumpX(className) {
            const spanf = document.getElementsByClassName(className);
            if (spanf.length === 0)
                return;
            const span = spanf[0];
            if (!(span instanceof HTMLSpanElement))
                return;
            const af = span.getElementsByTagName("a");
            if (af.length === 0)
                return;
            const a = af[0];
            a.click();
        }
        document.body.addEventListener("keydown", ({ altKey, ctrlKey, key, shiftKey }) => {
            if (!ctrlKey && !shiftKey && !altKey) {
                if (key === "ArrowLeft" || key === "a") {
                    pageJumpX("pgb");
                }
                else if (key === "ArrowRight" || key === "d") {
                    pageJump("nxt");
                }
            }
        });
    }
    function newthread_mark_a4(element, tid_s10, dt, banDt) {
        const tid_i10 = parseInt(tid_s10, 10);
        if (isNaN(tid_i10) || !isFinite(tid_i10))
            return;
        const tid_b64 = DecimalBase64To.decToB64(tid_i10);
        const dataset = element.dataset;
        dataset.tid = tid_b64;
        dataset.fidxexist = dt.exist(tid_b64) ? "exist" : "init";
        dataset.banstate = banDt.exist(tid_b64) ? "ban" : "init";
    }
    function newthread_mark_a3(element, a0, dt, banDt) {
        const { href } = a0;
        if (href.trim().length === 0)
            return;
        const m = href.match(tid_pattern_a2);
        if (m === null)
            return;
        const tid = DecimalBase64To.decToB64(parseInt(m[0], 10));
        const dataset = element.dataset;
        dataset.tid = tid;
        dataset.fidxexist = dt.exist(tid) ? "exist" : "init";
        dataset.banstate = banDt.exist(tid) ? "ban" : "init";
    }
    function target_find_a(target) {
        if (target === null)
            return null;
        if (!(target instanceof Element))
            return null;
        if (target instanceof HTMLAnchorElement)
            return target;
        const a = target.closest("a");
        if (a === null)
            return undefined;
        return a;
    }
    function newthread_mark_forumdisplay(tbody, dt, banDt, soushuba_remove_guanggao = false) {
        const trf = tbody.getElementsByTagName("tr");
        if (trf.length === 0)
            return;
        const tr = trf[0];
        const thf = tr.getElementsByTagName("th");
        if (thf.length === 0)
            return;
        const th = thf[0];
        const af = th.getElementsByTagName("a");
        if (af.length === 0)
            return;
        const { id: cid } = af[0];
        if (cid.trim().length === 0)
            return;
        const m = cid.match(tid_from_id_pattern);
        if (m === null) {
            if (soushuba_remove_guanggao) {
                if (cid.match(tid_bad_from_id_pattern) === null)
                    return;
                tr.dataset.fidxexist = "hide";
                return;
            }
            else {
                return;
            }
        }
        const tid_s10 = m.groups?.tid;
        if (tid_s10 === undefined)
            return;
        newthread_mark_a4(tr, tid_s10, dt, banDt);
    }
    function newthread_mark_home(tr, dt, banDt) {
        const icnf = tr.getElementsByClassName("icn");
        if (icnf.length === 0)
            return;
        const icn = icnf[0];
        if (!(icn instanceof HTMLTableCellElement))
            return;
        const af = icn.getElementsByTagName("a");
        if (af.length === 0)
            return;
        const { href } = af[0];
        if (href.length === 0)
            return;
        const m = href.match(tid_from_url_pattern);
        if (m === null)
            return;
        const tid_s10 = m.groups?.tid;
        if (tid_s10 === undefined)
            return;
        newthread_mark_a4(tr, tid_s10, dt, banDt);
    }
    function newthread_mark_search(li, dt, banDt) {
        const h3f = li.getElementsByTagName("h3");
        if (h3f.length === 0)
            return;
        const h3 = h3f[0];
        const af = h3.getElementsByTagName("a");
        if (af.length === 0)
            return;
        const a0 = af[0];
        newthread_mark_a3(li, a0, dt, banDt);
        const span = document.createElement("span");
        span.className = "uv";
        h3.insertAdjacentElement("afterbegin", span);
    }
    function newthread_mark_listen_forumdisplay(xbody, dt, banDt) {
        let BUTTONS;
        (function (BUTTONS) {
            BUTTONS[BUTTONS["LEFT"] = 0] = "LEFT";
            BUTTONS[BUTTONS["CENTER"] = 1] = "CENTER";
        })(BUTTONS || (BUTTONS = {}));
        function click(xbody, target, button, dt, banDt) {
            let ex_handle = true;
            let ban_handle = true;
            const a = target_find_a(target);
            if (a === null)
                throw new Error("target不是标签HTMLElement的子集。");
            if (a === undefined) {
                if (button === BUTTONS.CENTER) {
                    throw new Error("target父元素a未查询到 && target不是元素a。");
                }
                else {
                    ex_handle = false;
                }
            }
            else {
                if (!xbody.contains(a))
                    throw new Error("xbody并不包含子元素a。");
            }
            const tr = target.closest("tr");
            if (tr === null)
                throw new Error("target父元素tr未查询到。");
            if (!xbody.contains(tr))
                throw new Error("xbody并不包含子元素tr。");
            const dataset = tr.dataset;
            const tid = dataset?.tid;
            if (tid === undefined)
                throw new Error("元素tr的dataset的tid属性并不存在。");
            const banstate = dataset?.banstate;
            if (banstate === undefined)
                throw new Error("元素tr的dataset的banstate属性并不存在。");
            const fidxexist = dataset?.fidxexist;
            if (fidxexist === undefined)
                throw new Error("元素tr的dataset的fidxexist属性并不存在。");
            if (ex_handle) {
                const { href } = a;
                if (tid_find.test(href)) {
                    dataset.fidxexist = "exist";
                    dt.add_unsave(tid);
                    return;
                }
            }
            if (ban_handle) {
                if (banstate === "init") {
                    const td = target.closest("td");
                    if (td === null)
                        return;
                    if (!td.classList.contains("icn"))
                        return;
                    if (isNaN(DecimalBase64To.b64ToDec(tid)))
                        return;
                    if (!banDt.exist(tid))
                        banDt.add_save(tid);
                    dataset.banstate = "ban";
                    return;
                }
                else if (banstate === "ban") {
                    if (isNaN(DecimalBase64To.b64ToDec(tid)))
                        return;
                    if (banDt.exist(tid))
                        banDt.del_save(tid);
                    dataset.banstate = "init";
                    return;
                }
                else {
                    throw new Error("程式错误。");
                }
            }
        }
        xbody.addEventListener("mousedown", ({ target, button }) => {
            let fbutton;
            if (button === 0) {
                fbutton = BUTTONS.LEFT;
            }
            else if (button === 1) {
                fbutton = BUTTONS.CENTER;
            }
            else {
                return;
            }
            try {
                return click(xbody, target, fbutton, dt, banDt);
            }
            catch (err) {
            }
        });
    }
    function forumdisplay(soushuba_remove_guanggao = false) {
        const dt = new DataTmp(tid_tmp_key, tid_split);
        dt.init();
        const banDt = new DataTmp(tid_ban_tmp_key, tid_split);
        banDt.init();
        load_tid_style();
        const threadlisttableid = document.getElementById("threadlisttableid");
        if (threadlisttableid === null)
            return;
        if (!(threadlisttableid instanceof HTMLTableElement))
            return;
        const xbody = threadlisttableid;
        const tbodys = xbody.getElementsByTagName("tbody");
        for (const tbody of tbodys) {
            newthread_mark_forumdisplay(tbody, dt, banDt, soushuba_remove_guanggao);
        }
        newthread_mark_listen_forumdisplay(xbody, dt, banDt);
        const observer = new MutationObserver(function (mutations, observer) {
            for (const mutation of mutations) {
                if (mutation.type !== "childList")
                    return;
                const { addedNodes } = mutation;
                if (addedNodes.length === 0)
                    continue;
                for (const addedNode of addedNodes) {
                    if (!(addedNode instanceof HTMLTableSectionElement))
                        continue;
                    newthread_mark_forumdisplay(addedNode, dt, banDt);
                }
            }
        });
        const config = {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: false,
        };
        observer.observe(xbody, config);
    }
    function homephp() {
        const dt = new DataTmp(tid_tmp_key, tid_split);
        dt.init();
        const banDt = new DataTmp(tid_ban_tmp_key, tid_split);
        banDt.init();
        load_tid_style();
        const delform = document.getElementById("delform");
        if (delform === null)
            return;
        if (!(delform instanceof HTMLFormElement))
            return;
        let tablef = delform.getElementsByTagName("table");
        if (tablef.length === 0)
            return;
        const table = tablef[0];
        let tbodyf = table.getElementsByTagName("tbody");
        if (tbodyf.length === 0)
            return;
        const tbody = tbodyf[0];
        const xbody = tbody;
        const trs = xbody.getElementsByTagName("tr");
        for (const tr of trs) {
            newthread_mark_home(tr, dt, banDt);
        }
        newthread_mark_listen_forumdisplay(xbody, dt, banDt);
    }
    function searchphp() {
        const dt = new DataTmp(tid_tmp_key, tid_split);
        dt.init();
        const banDt = new DataTmp(tid_ban_tmp_key, tid_split);
        banDt.init();
        load_tid_style();
        const threadlist = document.getElementById("threadlist");
        if (threadlist === null)
            return;
        if (!(threadlist instanceof HTMLDivElement))
            return;
        const ulf = threadlist.getElementsByTagName("ul");
        if (ulf.length === 0)
            return;
        const ul = ulf[0];
        const xbody = ul;
        const lis = xbody.getElementsByTagName("li");
        for (const li of lis) {
            newthread_mark_search(li, dt, banDt);
        }
        function click_a(a) {
            const li = a.closest("li[data-banstate] h3");
            if (li === null)
                return "li error";
            const dataset = li.dataset;
            if (dataset?.fidxexist === undefined)
                return "li error";
            const tid = dataset?.tid;
            if (tid === undefined)
                return "li error";
            const href = a.href;
            if (!tid_find.test(href))
                return "href is null";
            dataset.fidxexist = "exist";
            dt.add_unsave(tid);
            return "final";
        }
        function run_a(target) {
            const a = target_find_a(target);
            return a === null ? "element is null" : a === undefined ? "element unfind a" : click_a(a);
        }
        function run_ban(target, li) {
            const dataset = li.dataset;
            const banstate = dataset?.banstate;
            if (banstate === "init") {
                const span = target.closest("li[data-banstate] h3 span.uv");
                if (span === null)
                    return;
                const tid = dataset?.tid;
                if (tid === undefined)
                    return;
                if (isNaN(DecimalBase64To.b64ToDec(tid)))
                    return;
                if (!banDt.exist(tid))
                    banDt.add_save(tid);
                dataset.banstate = "ban";
                return;
            }
            else if (banstate === "ban") {
                const tid = dataset?.tid;
                if (tid === undefined)
                    return;
                if (isNaN(DecimalBase64To.b64ToDec(tid)))
                    return;
                if (banDt.exist(tid))
                    banDt.del_save(tid);
                dataset.banstate = "init";
                return;
            }
        }
        xbody.addEventListener("mousedown", ({ target, button }) => {
            if (button === 0) {
                const res1 = run_a(target);
                if (res1 === "final")
                    return;
                if (res1 === "element is null")
                    return;
                let li;
                if (res1 === "element unfind a") {
                    li = target.closest("li[data-banstate]");
                    if (li === null)
                        return null;
                }
                else if (res1 === "li error") {
                    return;
                }
                else if (res1 === "href is null") {
                    li = target.closest("li[data-banstate]");
                    if (li === null)
                        return null;
                }
                else {
                    return;
                }
                li.closest("li[data-banstate]");
                run_ban(target, li);
            }
            else if (button === 1) {
                run_a(target);
            }
        });
    }
    function viewthread(get_tid) {
        if (get_tid === null || get_tid === undefined)
            return;
        const tid_b10 = parseInt(get_tid, 10);
        if (isNaN(tid_b10) || !isFinite(tid_b10))
            return;
        const tid_b64 = DecimalBase64To.decToB64(tid_b10);
        let dt = new DataTmp(tid_tmp_key, tid_split);
        dt.add_save(tid_b64);
        dt = null;
    }
    function viewthread_replycoins() {
        const fastpostsubmit = document.getElementById("fastpostsubmit");
        if (fastpostsubmit === null || !(fastpostsubmit instanceof HTMLButtonElement))
            throw new Error("fastpostsubmit");
        const fastpostmessage = document.getElementById("fastpostmessage");
        if (fastpostmessage === null || !(fastpostmessage instanceof HTMLTextAreaElement))
            throw new Error("fastpostmessage");
        const pgses = document.getElementsByClassName("pgs");
        if (pgses.length !== 2)
            throw new Error("pgs");
        const pgs1 = pgses[0];
        if (!(pgs1 instanceof HTMLDivElement))
            throw new Error("pgs1");
        const pgs2 = pgses[1];
        if (!(pgs2 instanceof HTMLDivElement))
            throw new Error("pgs2");
        load_replycoins_style();
        function initElement(top) {
            const div = document.createElement("div");
            const pbtn = document.createElement("button");
            const timer = document.createElement("span");
            const time = document.createElement("span");
            const time30u = document.createElement("span");
            const time45u = document.createElement("span");
            const time60u = document.createElement("span");
            pbtn.className = "post-btn";
            pbtn.innerHTML = "快速回复(CTRL+D)";
            timer.className = "post-btn-timer";
            timer.innerHTML = "时间(s): ";
            time.className = "post-btn-time";
            time.innerHTML = "未启动";
            time30u.className = "time-u30";
            time30u.innerHTML = "30s↑";
            time45u.className = "time-u45";
            time45u.innerHTML = "45s↑";
            time60u.className = "time-u60";
            time60u.innerHTML = "60s↑";
            div.className = "post-btn-time";
            div.appendChild(pbtn);
            div.appendChild(timer);
            div.appendChild(time);
            div.appendChild(time30u);
            div.appendChild(time45u);
            div.appendChild(time60u);
            top.appendChild(div);
            function run() {
                const { classList } = div;
                if (classList.contains("run")) {
                    if (classList.contains("u30")) {
                        classList.remove("u30");
                    }
                    else if (classList.contains("u45")) {
                        classList.remove("u45");
                    }
                    else if (classList.contains("u60")) {
                        classList.remove("u60");
                    }
                }
                else {
                    classList.add("run");
                }
            }
            function update(s) {
                time.innerHTML = s.toString(10);
                if (s === 30) {
                    div.classList.add("u30");
                }
                else if (s === 45) {
                    div.classList.remove("u30");
                    div.classList.add("u45");
                }
                else if (s === 60) {
                    div.classList.remove("u45");
                    div.classList.add("u60");
                }
            }
            return [pbtn, update, run];
        }
        const [pbtn1, update1, run1] = initElement(pgs1);
        const [pbtn2, update2, run2] = initElement(pgs2);
        function choice(...array) {
            const randomIndex = Math.floor(Math.random() * array.length);
            return array[randomIndex];
        }
        function linkc(...array) {
            return array.join("");
        }
        const values = [
            () => linkc(choice("👍🏻", "👍", "⭐️", "(*￣▽￣)b", ""), choice("感谢", "谢谢"), choice("👍🏻", "👍", "⭐️", "(*￣▽￣)b", ""), choice("楼主", "lz", "大佬", "dl"), choice(linkc(choice("的", ""), "分享"), linkc("分享", choice("的", ""), choice("帖子", "文件", "书"))), choice("👍🏻", "👍", "⭐️", "(*￣▽￣)b", "  !  !  !", "")),
        ];
        function postdata(fastpostmessage, fastpostsubmit) {
            fastpostmessage.value = choice(...values)();
            fastpostsubmit.click();
            startTimeCount();
        }
        window.addEventListener("keypress", (ev) => {
            const { key, ctrlKey, shiftKey, altKey } = ev;
            if (ctrlKey && !shiftKey && !altKey) {
                if (key === "d") {
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            }
        });
        window.addEventListener("keydown", (ev) => {
            const { key, ctrlKey, shiftKey, altKey } = ev;
            if (ctrlKey && !shiftKey && !altKey) {
                if (key === "d") {
                    postdata(fastpostmessage, fastpostsubmit);
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            }
        });
        pbtn1.addEventListener("click", () => {
            postdata(fastpostmessage, fastpostsubmit);
        });
        pbtn2.addEventListener("click", () => {
            postdata(fastpostmessage, fastpostsubmit);
        });
        let timer;
        function startTimeCount() {
            if (timer !== undefined) {
                clearInterval(timer);
                timer = undefined;
            }
            let countdownTime = 0;
            run1();
            run2();
            const updateCountdown = () => {
                countdownTime++;
                update1(countdownTime);
                update2(countdownTime);
            };
            timer = setInterval(updateCountdown, 1000);
        }
    }
    const { pathname: pn, search } = window.location;
    const tid_pattern_a2 = /(?<=(?:^|\/)thread-)[1-9]\d*(?=-[1-9]\d*-[1-9]\d*[.]html)|(?<=[?&]tid=)[1-9]\d*(?=&|$)/;
    const tid_from_url_pattern = /[?&]tid=(?<tid>[1-9]\d*)(?:&|$)/;
    const tid_from_id_pattern = /^content_(?<tid>[1-9]\d*)$/;
    const tid_bad_from_id_pattern = /^content_adver&aid=[1-9]\d*$/;
    const tid_find = /(^|\/)thread-[1-9]\d*-[1-9]\d*-[1-9]\d*[.]html|[?&]tid=[1-9]\d*(&|$)/;
    const tid_forumdisplay2_pattern = /^\/forum-\d+-\d+[.]html$/;
    const tid_viewthread2t_pattern = /^\/thread-(?<tid>\d+)-\d+-\d+[.]html$/;
    let m;
    if (pn === "/forum.php") {
        const urlSearch = new URLSearchParams(search);
        const mod = urlSearch.get("mod");
        if (mod === null) {
            return;
        }
        else if (mod === "viewthread") {
            const applicationName = getApplicationName();
            if (applicationName === ApplicationNames.soushuba || applicationName === ApplicationNames.sxsy || applicationName === ApplicationNames.ba404) {
                const get_tid = urlSearch.get("tid");
                viewthread(get_tid);
                viewthread_replycoins();
            }
        }
        else if (mod === "forumdisplay") {
            const applicationName = getApplicationName();
            if (applicationName === ApplicationNames.soushuba) {
                forumdisplay(true);
                keyJump();
            }
            else if (applicationName === ApplicationNames.sxsy) {
                forumdisplay();
                keyJump();
            }
            else if (applicationName === ApplicationNames.ba404) {
                forumdisplay();
                keyJump404(urlSearch);
            }
        }
    }
    else if (pn === "/search.php") {
        const urlSearch = new URLSearchParams(search);
        const mod = urlSearch.get("mod");
        if (mod === null) {
            return;
        }
        else if (mod === "forum") {
            searchphp();
            keyJump();
        }
    }
    else if (pn === "/home.php") {
        const urlSearch = new URLSearchParams(search);
        const mod = urlSearch.get("mod");
        if (mod === null) {
            return;
        }
        else if (mod === "space") {
            const do_ = urlSearch.get("do");
            if (do_ === null)
                return;
            const uid = urlSearch.get("uid");
            if (uid === null)
                return;
            homephp();
            keyJumpHome();
        }
    }
    else if (tid_forumdisplay2_pattern.test(pn)) {
        const applicationName = getApplicationName();
        if (applicationName === ApplicationNames.ba404) {
            forumdisplay();
            keyJump();
        }
    }
    else if ((m = pn.match(tid_viewthread2t_pattern)) !== null) {
        const applicationName = getApplicationName();
        if (applicationName === ApplicationNames.ba404) {
            const get_tid = m.groups?.tid;
            viewthread(get_tid);
            viewthread_replycoins();
        }
    }
})();


