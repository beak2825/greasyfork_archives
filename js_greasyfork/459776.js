// ==UserScript==
// @name         bos filter
// @namespace    http://tampermonkey.net/
// @version      1.55
// @description  so boszhipin fk u
// @author       zrx
// @match        https://www.zhipin.com/web/geek/job*
// @match        https://www.zhipin.com/web/geek/recommend*
// @match        https://www.zhipin.com/job_detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        GM_addStyle
// @require https://greasyfork.org/scripts/463829-common-js/code/commonjs.js?version=1174761
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459776/bos%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/459776/bos%20filter.meta.js
// ==/UserScript==

var LOCAL_STORAGE_COMPANY_SET = "COMPANY_SET";
var LOCAL_STORAGE_DEFAULT_SALARY = "DEFAULT_SALARY";
var LOCAL_STORAGE_ONLINE_AUTO_FILTER_FLAG = "ONLINE_AUTO_FILTER_FLAG";
var LOCAL_STORAGE_SALARY_AUTO_FILTER_FLAG = "SALARY_AUTO_FILTER_FLAG";
var LOCAL_STORAGE_COMPANY_AUTO_FILTER_FLAG = "COMPANY_AUTO_FILTER_FLAG";

var defaultSalary = (() => {
    let result = localStorage.getItem(LOCAL_STORAGE_DEFAULT_SALARY);
    if (null == result || "" == result) {
        return {
            minDefault: "",
            maxDefault: ""
        };
    }
    return JSON.parse(result);
})();

var companySet = (() => {
    let result = localStorage.getItem(LOCAL_STORAGE_COMPANY_SET);
    if (null == result || "" == result) {
        return new Set();
    }
    return new Set(JSON.parse(result));
})();

var onlineAutoFilterFlag = getFlag(LOCAL_STORAGE_ONLINE_AUTO_FILTER_FLAG);
var salaryAutoFilterFlag = getFlag(LOCAL_STORAGE_SALARY_AUTO_FILTER_FLAG);
var companyAutoFilterFlag = getFlag(LOCAL_STORAGE_COMPANY_AUTO_FILTER_FLAG);

function getFlag(key) {
    let value = localStorage.getItem(key);
    if (null == value || "" == value) {
        return false;
    }
    return JSON.parse(value);
}

var globalCss = `
    .job-card-wrapper {
        width: 900px !important;
    }
    .job-name {
        max-width: 320px !important;
    }
    .job-side-wrapper,
    .nav,
    .subscribe-weixin-wrapper,
    .satisfaction-feedback-wrapper.clearfix,
    .hot-link-wrapper,
    .job-search-scan,
    #footer,
    .sider-box.refresh-lines,
    .vip-guide.sider-box,
    .similar-job-wrapper,
    .promotion-img,
    .job-detail-section.more-job-section,
    .job-detail-section.prop-item,
    .job-detail-section.security-box,
    .job-detail-section.links-container.links-container-new,
    .vip-info,
    .resume-diagnose-card.level-old-2,
    .sider-box.zhipin-resume {
        display: none !important;
    }
`;

$(function () {
    GM_addStyle(globalCss);
});

$(window).load(function () {
    if (window.location.pathname.indexOf("/job_detail/") != -1) {
        return;
    }

    //设置顶部的html
    doWithInterval("#header", (position) => {
        let html = `
            <div style="float: right;">
                <div>
                    <button id="filter-online">在线筛选</button>
                    <button id="filter-company">公司屏蔽</button>
                    <button id="filter-salary">工资筛选</button>
                    <input type='text' id='min-salary' value='${defaultSalary.minDefault}' style='width: 3em'>
                    <input type='text' id='max-salary' value='${defaultSalary.maxDefault}' style='width: 3em'>
                    <button id="default-salary">设为默认</button>
                </div>
                <div>
                    <input type="checkbox" id="online-auto-filter"><span style="color:#fff;">自动在线筛选</span>
                    <input type="checkbox" id="salary-auto-filter"><span style="color:#fff;">自动薪资筛选</span>
                    <input type="checkbox" id="company-auto-filter"><span style="color:#fff;">自动公司屏蔽</span>
                </div>
            </div>
        `;
        position.prepend(html);

        $("#filter-online").on("click", filterOnline);
        $("#filter-company").on("click", filterCompany)
        $("#filter-salary").on("click", filterSalary);
        $("#default-salary").on("click", updateDefaultSalary);

        if (onlineAutoFilterFlag) {
            $("#online-auto-filter").prop("checked", true);
        }
        if (salaryAutoFilterFlag) {
            $("#salary-auto-filter").prop("checked", true);
        }
        if (companyAutoFilterFlag) {
            $("#company-auto-filter").prop("checked", true);
        }

        $("#online-auto-filter").on("change", (e) => {
            onlineAutoFilterFlag = $(e.target).is(":checked");
            if (onlineAutoFilterFlag) {
                filterOnline();
            }
            localStorage.setItem(LOCAL_STORAGE_ONLINE_AUTO_FILTER_FLAG, onlineAutoFilterFlag);
        });

        $("#salary-auto-filter").on("change", (e) => {
            if ($(e.target).is(":checked")) {
                try {
                    filterSalary();
                }
                catch (execption) {
                    $(e.target).prop("checked", false);
                    return;
                }
                salaryAutoFilterFlag = true;
                localStorage.setItem(LOCAL_STORAGE_SALARY_AUTO_FILTER_FLAG, true);
            }
            else {
                salaryAutoFilterFlag = false;
                localStorage.setItem(LOCAL_STORAGE_SALARY_AUTO_FILTER_FLAG, false);
            }
        });

        $("#company-auto-filter").on("change", (e) => {
            companyAutoFilterFlag = $(e.target).is(":checked");
            if (companyAutoFilterFlag) {
                filterCompany();
            }
            localStorage.setItem(LOCAL_STORAGE_COMPANY_AUTO_FILTER_FLAG, companyAutoFilterFlag);
        });
    });
    //自动过滤
    if (companyAutoFilterFlag || onlineAutoFilterFlag || salaryAutoFilterFlag) {
        autoFilter();
    }
    //设置公司过滤按钮html
    setCompanyFilterHtml();
});

function filterOnline() {
    filterTemplate($(".job-card-wrapper"), (target) => target.find(".boss-online-tag").length == 0);
}

function filterSalary() {
    filterTemplate($(".job-card-wrapper"), (target) => doFilterSalary(target, checkSalary()));
}

const salaryRegExp = /^[1-9]{1}[0-9]{0,1}$/;
function checkSalary() {
    let minStr = $("#min-salary").val();
    if (null == salaryRegExp.exec(minStr)) {
        alert("请正确输入最小值");
        throw new Error('请正确输入最小值');
    }

    let maxStr = $("#max-salary").val()
    if (null == salaryRegExp.exec(maxStr)) {
        alert("请正确输入最大值");
        throw new Error('请正确输入最大值');
    }

    let minSalary = Number(minStr);
    let maxSalary = Number(maxStr);
    if (minSalary > maxSalary) {
        alert("请正确输入最小值和最大值");
        throw new Error('请正确输入最小值和最大值');
    }

    return {
        min: minSalary,
        max: maxSalary
    };
}

function doFilterSalary(target, salary) {
    let jobSalary = target.find(".salary").text();
    let i = jobSalary.indexOf("-");
    let min = Number(jobSalary.substring(0, i));
    if (min < salary.min) {
        return true;
    }
    let k = jobSalary.indexOf("K");
    let max = Number(jobSalary.substring(i + 1, k));
    if (max > salary.max) {
        return true;
    }
    return false;
}

function filterCompany() {
    filterTemplate($(".job-card-wrapper"), (target) => keyFilter(target, ".company-name > a", companySet));
}

function updateDefaultSalary() {
    let salary = checkSalary();
    defaultSalary.minDefault = salary.min;
    defaultSalary.maxDefault = salary.max;
    localStorage.setItem(LOCAL_STORAGE_DEFAULT_SALARY, JSON.stringify(defaultSalary));
}

function updateAutoFilterFlag(target, key, func) {
    if ($(target).is(":checked")) {
        func();
        localStorage.setItem(key, true);
    }
    else {
        localStorage.setItem(key, false);
    }
}

function autoFilter() {
    doWithInterval(".job-card-wrapper", (position) => {
        filterTemplate($(position), (target) => {
            if (companyAutoFilterFlag) {
                if (keyFilter(target, ".company-name > a", companySet)) {
                    return true;
                }
            }
            if (onlineAutoFilterFlag) {
                if (target.find(".boss-online-tag").length == 0) {
                    return true;
                }
            }
            if (salaryAutoFilterFlag) {
                if (doFilterSalary(target, checkSalary())) {
                    return true;
                }
            }
            return false;
        });
        $(".options-pages>a").on("click", autoFilter);
    });
}

function setCompanyFilterHtml() {
    doWithInterval(".company-name > a", (position) => {
        let html = `<button class="add-company" style="border-radius: 5px;background-color: #00bebd;color: #ffffff;">屏蔽</button>`;
        position.after(html);
        $(".add-company").on("click", (e) => {
            companySet.add($(e.target).prev().text())
            localStorage.setItem(LOCAL_STORAGE_COMPANY_SET, JSON.stringify(Array.from(companySet)));
            filterCompany();
            e.stopPropagation();
        });
        $(".options-pages>a").on("click", () => setCompanyFilterHtml());
    });
}