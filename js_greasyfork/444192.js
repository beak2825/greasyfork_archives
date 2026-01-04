// ==UserScript==
// @name         人力-正式機&測試機-後台首頁快速連結
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  後台首頁快速連結
// @author       You
// @match        https://lcahr.lingcheng.tw/TalentMatch/UserRoles/Manage
// @match        https://ahr.coa.gov.tw/UserRoles/Manage
// @match        https://lcahr.lingcheng.tw/TalentMatchBox/UserRoles/Manage
// @match        http://localhost:30942/UserRoles/Manage
// @icon         https://www.google.com/s2/favicons?domain=lingcheng.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444192/%E4%BA%BA%E5%8A%9B-%E6%AD%A3%E5%BC%8F%E6%A9%9F%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E5%BE%8C%E5%8F%B0%E9%A6%96%E9%A0%81%E5%BF%AB%E9%80%9F%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/444192/%E4%BA%BA%E5%8A%9B-%E6%AD%A3%E5%BC%8F%E6%A9%9F%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E5%BE%8C%E5%8F%B0%E9%A6%96%E9%A0%81%E5%BF%AB%E9%80%9F%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const list = [
        [
            [`Admin Query`, `/Admin/Query`],
            [`查詢使用者身份`, `/ZForAdmin/UsersInRoles`]
        ],
        [
            [`需工單`, `/WorkApplications/Manage`],
            [`職缺單`, `/PTWorkApplication/Manage`],
            [`農機詢問單`, `/AGMAskManage/Manage`],
        ],
        [
            [`需工農場`, `/Farms/Manage`],
            [`農機主`, `/AGMSupplier/Manage`],
            [`求職者`, `/PTWorker/Manage`],
            [`農務人員`, `/Farmers/Manage`],
            [`農委會管理者`, `/COA/Manage`],
            [`單位使用者`, `/ExecutionUsers/Manage`],
            [`車機廠商`, `/AGMCompanyForAdmin/Manage`],
            [`帳號申請紀錄`, `/IntegratedUserManage/Manage`],
            [`Admin/客服人員`, `/Admin/Manage`],
        ],
        [
            [`團別類型設定`, `/GroupTypes/Manage`],
            [`團別資料管理`, `/ExecutionGroups/Manage`],
        ],
        [
            [`執行成效報表`, `/Report/Efficiency`],
            [`月報表`, `/Report/MonthReport`],
            [`請休假管理`, `/Attendance/Apply`],
            [`差勤查詢`, `/Attendance/Query`],
            [`勞健保管理`, `/SalaryManage/Insurance`],
            [`月薪管理`, `/SalaryManage/Salary`],
        ]
    ];


    // -----------------------------------------------------------------------------------
    $(function() {
        const $container = $('<div>', {style: "position: fixed; top: 50px; right:20px;"});
        const $btnContainer = $('<div>', {style: "display: flex;"});

        const CreateBtn = function([btnName, href, title]) {
            let $newBtn = $("<button>", {
                type: 'button',
                class: 'btn btn-primary form-control m-1',
                style: "margin: 2px",
                title: title || href,
                html: btnName,
                'data-toogle': 'tooltip',
            });
            $newBtn.click(() => {
                location.href = location.href.replace('/UserRoles/Manage', href);
            })
            return $newBtn;
        }
        list.forEach(optionList => {
            let $tmpContainer = $("<div>", {style: "padding: 5px; width: 200px;"});
            optionList.forEach(options => {
                let $newBtn = CreateBtn(options);
                $tmpContainer.append($newBtn);
            });
            $btnContainer.append($tmpContainer);
        });

        const $toggleSlideBtn = $("<button>", {
            type: 'button',
            class: 'btn btn-warning form-control m-1',
            style: "margin: 2px",
            html: "收起/展開",
        });
        $toggleSlideBtn.click(() => $btnContainer.slideToggle());
        $container.append($toggleSlideBtn);
        $container.append($btnContainer);

        $container.appendTo("body");
        $btnContainer.find("[data-toggle='tooltip']").tooltip();
    });

    // Your code here...
})();