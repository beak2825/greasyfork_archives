// ==UserScript==
// @name                禁止访问网页
// @name:en             Be A Good Guy | Block Webites
// @name:zh-cn          禁止访问网页
// @description         禁止访问网页列表，做一个自律的人，成为更好的自己。
// @description:en      Block websites, be a disciplined person, and become a better self.
// @description:zh-cn   禁止访问网页列表，做一个自律的人，成为更好的自己。
// @namespace           https://github.com/BasilGuo/
// @license             MIT
// @version             0.1.3
// @author              Basil Guo
// @match               http*://*/*
// @grant               GM_addStyle
// @grant               GM_deleteValue
// @grant               GM_getValue
// @grant               GM_listValues
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @icon                https://images2.imgbox.com/01/e3/5as6gVyM_o.png
// @homepageURL         https://gist.github.com/BasilGuo/64c0730f2cdee29d2abf057577b86b39
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/469409/%E7%A6%81%E6%AD%A2%E8%AE%BF%E9%97%AE%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/469409/%E7%A6%81%E6%AD%A2%E8%AE%BF%E9%97%AE%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var g_one_rule_window = false;
    const G_LANGUAGE_INDEX = ('en' === navigator.language || 'en' === navigator.userLanguage) ? 0 : 1;

    // https://stackoverflow.com/questions/55935641/how-to-get-language-of-user-navigator-languages-not-working
    // console.log(navigator.language, navigator.userLanguage);
    // console.log(navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage));

    const G_RULE_PROMPT = {
        'title': {
            'addRule': ["Add A Rule For Current Site", '为本站添加规则'],
            'listRule': ["List Rules of All Sites", '列出所有网站规则'],
            'clearRule': ["Clear All Rules of All Sites", "清空所有网站规则"],
            'customURL': ["Custom the Redirect Webite", "自定义重定向网站"]
        },
        'common': {
            'btnCancelText': [`Cancel`, `取消`],
            'btnOKText': [`OK`, `确认`],
            'btnDeleteText': [`Delete`, `删除`],
            'noRuleText': [`There is no access rules now.`, `当前没有受限访问网站`],
            'alertText': [`There is a rule window opened. Please close it first~`, `已经有一个规则窗口了，请先关闭吧~`],
            'redirectURLText': [`Input the URL you would finally accessed when browsing blocked websites`, `输入访问被禁止网站时，最终重定向到的网址`]
        },
        'add': {
            'titleText': [`Add access time limit rule for<br/>${location.host}`, `给${location.host}<br/>添加访问限制时间规则`],
            'siteURLText': [`Set the site path. Default is the current hostname so you could let it alone. Not support for wildcards now.`, `设置本网站屏蔽规则，暂不支持通配符，默认为当前网站域名，非必填项`],
            'limitDayLongText': [`Limit for all day`, `全天限制`],
            'limitStartTimeText': [`Limit start time: `, `限制开始时间`],
            'limitEndTimeText': [`Limit  end  time: `, `限制结束时间`],
            'failedTimeText': [`Add rule failed for limit start time should be less than end time`, `添加规则失败：限制开始时间应该先于限制结束时间`],
            'failedHostText': [`Add rule failed because URL of current site is wrong, please correct it.<br/>Take the following www.example.com/path/subpath as an example. No protocols is needed.`, `添加规则失败：网站URL规则设置错误，参考例子不带协议`],
            'successText': [`Add rule success, effect after refress site.`, `规则添加成功，刷新页面以生效规则`]
        },
        'list': {
            'titleText': [`Limit access rules for all websites`, `当前所有网站限制访问规则`],
            'ruleHostText': [`Limit Website`, `限制网站`],
            'ruleTimeStartText': [`Limit Start Time`, `限制开始时间`],
            'ruleTimeEndText': [`Limit End Time`, `限制结束时间`],
            'deleteActionText': [`Actions`, `操作`],
            'deleteRuleConfirmText1': [`Are you sure to delete?`, `真的要删除限制规则吗？`],
            'deleteRuleConfirmText2': [`Buddy, being the best self?`, `你不打算成为更好的自己了吗？`],
            'deleteRuleConfirmText3': [`OK, the last time to confirm.`, `好吧，最后一次确认了。`],
            'deleteRuleCancelText': [`OK, I have known you are the best.`, `我就知道你是最棒的！`],
        }
    };

    function cancelRuleWindow() {
        let rule_window = document.getElementById('bs-rule');
        rule_window.parentNode.removeChild(rule_window);
        g_one_rule_window = false;
    }

    function addRuleLimitTimeDaylongOnChange() {
        let limit_time_daylong_cbx = document.getElementById('rule-time-day-long');
        let limit_time_start_input = document.getElementById('rule-time-start');
        let limit_time_end_input = document.getElementById('rule-time-end');

        if (limit_time_daylong_cbx.checked) {
            limit_time_start_input.disabled = "disabled";
            limit_time_end_input.disabled = "disabled";
        }
        else {
            limit_time_start_input.disabled = "";
            limit_time_end_input.disabled = "";
        }
    }

    function addRuleOKButtonClick() {
        let time_arr, hour, minute;
        let limit_start_secs, limit_end_secs;
        let limit_time_daylong_cbx = document.getElementById('rule-time-day-long');
        let limit_time_start = document.getElementById('rule-time-start').value;
        let limit_time_end = document.getElementById('rule-time-end').value;
        let rule_url_input = document.getElementById('rule-url');

        if (limit_time_daylong_cbx.checked) {
            limit_time_start = '00:00';
            limit_time_end = '23:59';
        }

        time_arr = limit_time_start.split(':');
        hour = time_arr[0];
        minute = time_arr[1];
        limit_start_secs = hour * 3600 + minute * 60;
        time_arr = limit_time_end.split(':');
        hour = time_arr[0];
        minute = time_arr[1];
        limit_end_secs = hour * 3600 + minute * 60;

        if (limit_start_secs > limit_end_secs) {
            alert(G_RULE_PROMPT.add.failedTimeText[G_LANGUAGE_INDEX]);
            return;
        } else {
            let rule_url = rule_url_input.value;
            let all_hosts = GM_getValue('BlockWebsitesRules');
            let all_hosts_set;

            if (rule_url === '') {
                rule_url = document.location.host;
            } else if (rule_url.indexOf("://") !== -1) {
                rule_url = rule_url.split("://")[1];
            }
            rule_url = rule_url.replace(/\/$/g, ''); // remove the last '/'

            if (all_hosts === undefined || all_hosts === '') {
                all_hosts_set = new Set();
            } else {
                all_hosts_set = new Set(JSON.parse(all_hosts)['BlockWebsitesRules'].split(' '));
            }

            if (document.location.href.indexOf(rule_url) === -1 || rule_url.indexOf(document.location.host) === -1) {
                alert(G_RULE_PROMPT.add.failedHostText[G_LANGUAGE_INDEX]);
                return;
            }

            console.log("all_hosts: ", all_hosts);
            all_hosts_set.add(rule_url);
            all_hosts = { 'BlockWebsitesRules': Array.from(all_hosts_set).join(' ') };
            console.log('BlockWebsitesRules: ', all_hosts);
            GM_setValue(rule_url, JSON.stringify({ 'start': limit_start_secs, 'end': limit_end_secs }));
            GM_setValue("BlockWebsitesRules", JSON.stringify(all_hosts));
            cancelRuleWindow();
            alert(G_RULE_PROMPT.add.successText[G_LANGUAGE_INDEX]);
            location.reload();
        }
    }

    function addRuleActions() {
        let limit_time_daylong_cbx = document.getElementById('rule-time-day-long');
        let ok_add_btn = document.getElementById("ok-add-btn");
        let cancel_add_btn = document.getElementById("cancel-add-btn");

        limit_time_daylong_cbx.onchange = addRuleLimitTimeDaylongOnChange;
        ok_add_btn.onclick = addRuleOKButtonClick;
        cancel_add_btn.onclick = cancelRuleWindow;
        g_one_rule_window = true;
    }

    function addRuleWindow() {
        let add_rule_div = `<div class="bs-rule-content" id="bs-rule">
            <div class="bs-rule-header" id="bs-rule-header">
              <!-- <span class="close">×</span> -->
              <h2>${G_RULE_PROMPT.add.titleText[G_LANGUAGE_INDEX]}</h2>
            </div>
            <div class="bs-rule-body" id="bs-rule-body">
              <form>
                <label for="rule-time-day-long">${G_RULE_PROMPT.add.limitDayLongText[G_LANGUAGE_INDEX]}</label>
                <input type="checkbox" id="rule-time-day-long" name="ruleTimeDayLong" />
                <hr/>
                <label for="rule-time-start">${G_RULE_PROMPT.add.limitStartTimeText[G_LANGUAGE_INDEX]}</label>
                <input id="rule-time-start" type="time" name="limitTimeStart", value="00:00" pattern="[0-9]{2}:[0-9]{2}" required />
                <br/>
                <label for="rule-time-end">${G_RULE_PROMPT.add.limitEndTimeText[G_LANGUAGE_INDEX]}</label>
                <input id="rule-time-end" type="time" name="limitTimeEnd", value="18:00" pattern="[0-9]{2}:[0-9]{2}" required />
                <hr/>
                <label for="rule-url">${G_RULE_PROMPT.add.siteURLText[G_LANGUAGE_INDEX]}</label>
                <br/>
                <input type="text" id="rule-url" name="ruleURL" placeholder="www.example.com/path/subpath" style="width:68%" />
              </form>
            </div>
            <div class="bs-rule-footer" id="bs-rule-footer">
              <button id="cancel-add-btn" class="bs-btn bs-cancel-btn">${G_RULE_PROMPT.common.btnCancelText[G_LANGUAGE_INDEX]}</button>
              <button id="ok-add-btn" class="bs-btn bs-ok-btn">${G_RULE_PROMPT.common.btnOKText[G_LANGUAGE_INDEX]}</button>
            </div>
        </div>`
        let body = document.getElementsByTagName("body")[0];
        let rule_div = document.createElement("div");
        rule_div.setAttribute("id", "bs-rule");
        rule_div.setAttribute("class", "bs-rule");
        rule_div.innerHTML = add_rule_div;
        body.prepend(rule_div);
        g_one_rule_window = true;
    }

    function addRule(event) {
        if (g_one_rule_window) {
            alert(G_RULE_PROMPT.common.alertText[G_LANGUAGE_INDEX]);
            return;
        }

        addRuleWindow();
        addRuleActions();
    }

    function listRuleWindow() {
        let list_rule_div = `<div class="bs-rule-content" id="bs-rule">
            <div class="bs-rule-header" id="bs-rule-header">
              <!-- <span class="close">×</span> -->
              <h2>${G_RULE_PROMPT.list.titleText[G_LANGUAGE_INDEX]}</h2>
            </div>
            <div class="bs-rule-body" id="bs-rule-body">
                <table id="bs-rule-list-tbl">
                <thead>
                  <tr>
                    <td>${G_RULE_PROMPT.list.ruleHostText[G_LANGUAGE_INDEX]}</td>
                    <td>${G_RULE_PROMPT.list.ruleTimeStartText[G_LANGUAGE_INDEX]}</td>
                    <td>${G_RULE_PROMPT.list.ruleTimeEndText[G_LANGUAGE_INDEX]}</td>
                    <td>${G_RULE_PROMPT.list.deleteActionText[G_LANGUAGE_INDEX]}</td>
                  </tr>
                </thead>
                <tbody id="bs-rule-list-tbl-body">
                </tbody>
                </table>
            </div>
            <div class="bs-rule-footer" id="bs-rule-footer">
              <button id="cancel-add-btn" class="bs-btn bs-cancel-btn">${G_RULE_PROMPT.common.btnCancelText[G_LANGUAGE_INDEX]}</button>
            </div>
        </div>`
        let body = document.getElementsByTagName("body")[0];
        let rule_div = document.createElement("div");
        rule_div.setAttribute("id", "bs-rule");
        rule_div.setAttribute("class", "bs-rule");
        rule_div.innerHTML = list_rule_div;
        body.prepend(rule_div);
        g_one_rule_window = true;
    }

    function listRuleActions() {
        let cancel_btn = document.getElementById("cancel-add-btn");
        let bs_rule_window = document.getElementById('bs-rule');

        cancel_btn.onclick = cancelRuleWindow;
        window.onclick = function (event) {
            if (event.target === bs_rule_window) {
                cancelRuleWindow();
            }
        }
    }

    function deleteRuleConfirm(msg) {
        if (msg && msg.length != 0) {
            msg = "\n" + msg;
        } else {
            msg = '';
        }
        let rs = confirm(G_RULE_PROMPT.list.deleteRuleConfirmText1[G_LANGUAGE_INDEX] + msg);
        if (!rs) {
            alert(G_RULE_PROMPT.list.deleteRuleCancelText[G_LANGUAGE_INDEX]);
        } else {
            rs = confirm(G_RULE_PROMPT.list.deleteRuleConfirmText2[G_LANGUAGE_INDEX] + msg);
            if (!rs) {
                alert(G_RULE_PROMPT.list.deleteRuleCancelText[G_LANGUAGE_INDEX]);
            } else {
                rs = confirm(G_RULE_PROMPT.list.deleteRuleConfirmText3[G_LANGUAGE_INDEX] + msg);
                if (!rs) {
                    alert(G_RULE_PROMPT.list.deleteRuleCancelText[G_LANGUAGE_INDEX]);
                }
            }
        }
        return rs;
    }

    function deleteRule() {
        let mrs = JSON.parse(GM_getValue(this.name));
        let msg = this.name + " : ";
        msg = msg + parseInt(mrs['start'] / 3600).toFixed(0).padStart(2, '0') + ":" + parseInt(mrs['start'] % 3600 / 60).toFixed(0).padStart(2, '0');
        msg += '-';
        msg = msg + parseInt(mrs['end'] / 3600).toFixed(0).padStart(2, '0') + ":" + parseInt(mrs['end'] % 3600 / 60).toFixed(0).padStart(2, '0');
        let rs = deleteRuleConfirm(msg);

        if (!rs) return;

        let all_hosts = GM_getValue('BlockWebsitesRules');
        let all_hosts_set;

        if (all_hosts === undefined || all_hosts === '') {
            all_hosts_set = new Set();
        } else {
            all_hosts_set = new Set(JSON.parse(all_hosts)['BlockWebsitesRules'].split(' '));
        }

        console.log("all_hosts: ", all_hosts);
        all_hosts_set.delete(this.name);
        all_hosts = { 'BlockWebsitesRules': Array.from(all_hosts_set).join(' ') };
        console.log('BlockWebsitesRules: ', all_hosts);
        GM_deleteValue(this.name);
        GM_setValue("BlockWebsitesRules", JSON.stringify(all_hosts));
        cancelRuleWindow();
        listRuleFillTable();
    }

    function listRuleFillTable() {
        let blockedSites = JSON.parse(GM_getValue('BlockWebsitesRules'));
        blockedSites = blockedSites['BlockWebsitesRules'].split(' ');
        let rule_tbl_body = document.getElementById("bs-rule-list-tbl-body");
        let is_no_rule = true;

        for (let blocked_site of blockedSites) {
            let site = GM_getValue(blocked_site);
            if (site !== undefined) {
                is_no_rule = false;
                let mrs = JSON.parse(site);
                let tr = document.createElement("tr");
                tr.innerHTML = `<td>${blocked_site}</td>
                <td>${parseInt(mrs['start'] / 3600).toFixed(0).padStart(2, '0')}:${parseInt(mrs['start'] % 3600 / 60).toFixed(0).padStart(2, '0')}</td>
                <td>${parseInt(mrs['end'] / 3600).toFixed(0).padStart(2, '0')}:${parseInt(mrs['end'] % 3600 / 60).toFixed(0).padStart(2, '0')}</td>
                <td><button name="${blocked_site}" class="bs-btn bs-delete-btn">${G_RULE_PROMPT.common.btnDeleteText[G_LANGUAGE_INDEX]}</button></td>`
                rule_tbl_body.append(tr);
            }
        }

        if (is_no_rule) {
            let bs_rule_body = document.getElementById("bs-rule-body");
            let no_rule_txt = document.createElement('h2');
            no_rule_txt.innerHTML = G_RULE_PROMPT.common.noRuleText[G_LANGUAGE_INDEX];
            bs_rule_body.append(no_rule_txt);
        } else {
            let del_btns = document.getElementsByClassName("bs-delete-btn");
            for (let i = 0; i < del_btns.length; ++i) {
                del_btns[i].onclick = deleteRule;
            }
        }
    }

    function listRule(event) {
        if (g_one_rule_window) {
            alert(G_RULE_PROMPT.common.alertText[G_LANGUAGE_INDEX]);
            return;
        }

        listRuleWindow();
        listRuleActions();
        listRuleFillTable();
    }

    function clearRule() {
        let rs = deleteRuleConfirm();
        if (!rs) { return; }

        let all_hosts = GM_getValue('BlockWebsitesRules');
        let all_hosts_set;

        if (all_hosts === undefined || all_hosts === '') {
            all_hosts_set = new Set();
        } else {
            all_hosts_set = new Set(JSON.parse(all_hosts)['BlockWebsitesRules'].split(' '));
        }

        console.log("all_hosts_set", all_hosts_set);

        for (let site of all_hosts_set) {
            console.log(site);
            GM_deleteValue(site);
        }

        all_hosts = { 'BlockWebsitesRules': '' };
        console.log('BlockWebsitesRules: ', all_hosts);
        GM_setValue("BlockWebsitesRules", JSON.stringify(all_hosts));
    }

    function customURL() {
        let url = prompt(G_RULE_PROMPT.common.redirectURLText[G_LANGUAGE_INDEX], "https://www.example.org/");
        GM_setValue("BlockWebsiteRedirectURL", url);
    }

    function setup() {
        let css = `#bs-rule-body>input,.bs-rule{width:100%}.bs-rule{display:block;position:fixed;max-width:unset;z-index:99999;padding-top:100px;left:0;top:0;height:100%;overflow:auto;background-color:rgba(0,0,0,.4)}.bs-rule-content{position:relative;background-color:#fefefe;margin:auto;padding:0;border:1px solid #888;width:35%;box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);-webkit-animation-name:bs-rule-animatetop;-webkit-animation-duration:.4s;animation-name:bs-rule-animatetop;animation-duration:.4s}.bs-rule-body,.bs-rule-footer,.bs-rule-header{padding:2px 16px}.bs-rule-footer,.bs-rule-header{background-color:#5587a2;color:#fff}@-webkit-keyframes bs-rule-animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}@keyframes bs-rule-animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}.bs-close{color:#fff;float:right;font-size:28px;font-weight:700}.bs-close:focus,.bs-close:hover{color:#000;text-decoration:none;cursor:pointer}.bs-rule-body{min-height:20%;max-height:100%;min-width:20%;max-width:100%;overflow-x:auto;overflow-y:auto}.bs-rule-footer{text-align:right}.bs-btn{color:#000;border:none;border-radius:5px;font-size:1.2em}.bs-btn:focus,.bs-btn:hover{cursor:pointer;box-shadow:1px 1px 1px rgba(0,0,0,.5);-moz-box-shadow:1px 1px .5em rgba(0,0,0,.5);-webkit-box-shadow:1px 1px .5em rgba(0,0,0,.5);background-color:#5587a2}.bs-ok-btn{background-color:#888}.bs-cancel-btn{background-color:#afafaf}.bs-delete-btn{border-color:none;font-size:1em;background-color:#e5624a}#bs-rule-body>table{border-collapse:collapse}#bs-rule-body>table>thead{background-color:#333;color:#fff;font-size:.875rem;text-transform:title;letter-spacing:2%}#bs-rule-body>table>td,#bs-rule-body>table>tr{border:1px solid #000;color:#000;text-align:left}`;
        GM_addStyle(css);

        let url = GM_getValue("BlockWebsiteRedirectURL");
        if (url === undefined || url === '') {
            GM_setValue("BlockWebsiteRedirectURL", 'chrome-extension://invalid');
        }

    }

    function register_menu() {
        GM_registerMenuCommand(G_RULE_PROMPT.title.addRule[G_LANGUAGE_INDEX], addRule, "a");
        GM_registerMenuCommand(G_RULE_PROMPT.title.listRule[G_LANGUAGE_INDEX], listRule, "l");
        GM_registerMenuCommand(G_RULE_PROMPT.title.clearRule[G_LANGUAGE_INDEX], clearRule, "c");
        GM_registerMenuCommand(G_RULE_PROMPT.title.customURL[G_LANGUAGE_INDEX], customURL, "s");
    }

    function locationReplace(url) {
        console.log(url);
        // location.href = url;
        // location.assign(url);
        location.replace(url);
    }

    function check_to_block() {
        let datetime = new Date();
        let hours = datetime.getHours();
        let minutes = datetime.getMinutes();
        let seconds = hours * 3600 + minutes * 60;
        let paths = document.location.href.split("://")[1].split("/");
        let path = document.location.host;
        let i = 1;

        do {
            let rs = GM_getValue(path);

            if (rs !== undefined) {
                let trs = JSON.parse(rs); // time rs
                if (trs['start'] <= seconds && seconds <= trs['end']) {
                    let url = GM_getValue("BlockWebsiteRedirectURL");
                    locationReplace(url);
                }
            }
            if (i < paths.length) {
                path = path + "/" + paths[i];
            }
        } while (i++ < paths.length)
    }

    function deleteKeysWithConfirm() {
        let keys = GM_listValues();
        console.log(keys);
        for (let i = 0; i < keys.length; ++i) {
            let v = keys[i];
            let rs = confirm("Delete?" + v + ": " + GM_getValue(v));
            if (rs) {
                GM_deleteValue(v);
            }
        }
        console.log(GM_listValues());
    }

    function main() {
        // deleteKeysWithConfirm();
        setup();
        register_menu();
        check_to_block();
    }

    main();
})();
