// ==UserScript==
// @name         易仓头程信息维护
// @namespace    http://maxpeedingrods.cn/
// @version      0.1.2
// @description  易仓头程信息维护-录入费用与跟踪号
// @author       knight
// @license      No License
// @match        https://*.eccang.com/transfer/batch/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://libs.baidu.com/jquery/2.0.3/jquery.min.js
// @require      https://www.layuicdn.com/layer-v3.1.1/layer.js
// @downloadURL https://update.greasyfork.org/scripts/510102/%E6%98%93%E4%BB%93%E5%A4%B4%E7%A8%8B%E4%BF%A1%E6%81%AF%E7%BB%B4%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/510102/%E6%98%93%E4%BB%93%E5%A4%B4%E7%A8%8B%E4%BF%A1%E6%81%AF%E7%BB%B4%E6%8A%A4.meta.js
// ==/UserScript==

/**
 * 常量信息
 */
class Constant {
    static domain = "https://owms.maxpeedingrods.cn";
}

/**
 * 页面位置类
 */
class Page {
    static path = "";
    addListener() {
        return null;
    }
}

/**
 * 头程总单管理页
 */
class Fee1OrderIndexPage extends Page {
    static path = '/transfer/batch/list';
    static baseUrl = '/warehouse_management/shipment_batch_info/excelImport';
    static importBtnName = '批量导入头程总单';
    addListener() {
        console.log("Fee1OrderIndexPage start");
        let that = this;
        setInterval(function () {
            if ($("#opration_area").length > 0) {
                that.addExportli();
            };
        }, 1000);
    }

    addExportli() {
        //先检查按钮是否存在
        let liId = 'cqgg-fee1-import-excel';
        let isExist = document.getElementById(liId);
        if (isExist) {
            return;
        }

        let html = '<li id=' + liId + ' style="width: 180px"><input type="file" id="cqgg-file-excel-import" style="display: none;">'
            + '<label for="cqgg-file-excel-import">'
            + Fee1OrderIndexPage.importBtnName + '</label></li>';

        console.log($("#opration_area > div:nth-child(5) > ul > li > ul"));
        $("#opration_area > div:nth-child(5) > ul > li > ul").append(html);
        let that = this;
        $("#cqgg-file-excel-import").on("change", function (e) {
            var files = e.target.files;
            if (files.length) {
                that.importExcel(files[0]);
            }
        })
    }
    importExcel(file) {
        layer.load();
        var formData = new FormData();
        formData.append("excel", file);
        let url = Constant.domain + Fee1OrderIndexPage.baseUrl;

        $.ajax({
            url: url,
            dataType: "json",
            type: "post",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (result) {
                layer.closeAll();
                $("#cqgg-file-excel-import").val(null);
                if (!result.status) {
                    layer.alert(result.msg);
                    return;
                }
                console.log(result);
                layer.msg(result.msg);
            },
            error: function (response) {
                layer.closeAll();
                layer.alert("导入失败，请重试");
            }
        })
    }
}

/**
* 头程总单列表页
*/
class Fee1OrderListPage extends Page {
    static path = '/transfer/batch/input-fee-and-tracking-no';
    static baseUrl = '/warehouse_management/shipment_batch_info/show';
    static buttonName = '更多信息';

    addListener() {
        let that = this;
        setInterval(function () {
            if ($("#editCostForm").length > 0) {
                that.addButton();
            }
        }, 1000);
    }

    addButton() {
        let that = this;
        $.each($("#editCostForm table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)"), function (index, element) {
            that.creatButton(element, index, "append");
        });
    }

    creatButton(node, buttonNum, insertLocation) {
        //先检查按钮是否存在
        let buttonId = 'cqgg-fee1-info-more' + '_' + buttonNum;
        let isButtonExist = document.getElementById(buttonId);

        if (!isButtonExist) {
            let tbCode = $("#editCostForm .checkTrajectory").attr("tb_code");
            this.createButtonReal(node, buttonId, tbCode, insertLocation);
        }
    }

    createButtonReal(node, buttonId, tbCode, insertLocation) {
        let button = document.createElement("span");
        button.innerText = Constant.buttonName;
        button.id = buttonId;
        button.className = "cqgg-fee1-info-more-button";
        let that = this;
        button.onclick = function () {
            that.openLayer(tbCode);
        };
        node[insertLocation](button);
    }

    openLayer(tbCode) {
        if (!tbCode) {
            layer.alert("未解析到编号，请刷新重试");
            return;
        }
        let url = Constant.domain + Fee1OrderListPage.baseUrl + "?tb_code=" + tbCode;
        console.log("正在打开界面：" + url);

        layer.open({
            type: 2,
            skin: 'layui-layer-rim',
            area: ['40%', '500px'],
            offset: "",
            title: Fee1OrderListPage.buttonName,
            anim: 1,
            shade: false,
            maxmin: true,
            content: url,
        });
    }
}


/**
 * 页面工厂类
 */
class PageFactory {
    static make(path) {
        switch (path) {
            case Fee1OrderListPage.path:
                return new Fee1OrderListPage();
            case Fee1OrderIndexPage.path:
                return new Fee1OrderIndexPage();
            default:
                return new Page();
        }
    }
}

function start() {
    addStyle();

    //引入layer
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`);

    console.log('------in getPage-----------');

    let currentPath = window.location.pathname;
    console.log(currentPath);

    let instance = PageFactory.make(window.location.pathname);
    instance.addListener();
}


/**
 * 添加CSS样式
 */
function addStyle() {
    let css = `
    #cqgg-fee1-import-excel label {
        width: 180px;
    height: 100%;
    text-align: center;
    display: block;
    padding: 5px;
    font-size: 13px;
    }
        .cqgg-fee1-info-more-button {
            display: inline-block;
            border: 1px solid #199EDB;
            background-color: #199EDB;
            color: #fff;
            cursor: pointer;
            text-align: center;
            margin: 2px;
            border-radius: 2px;
        }
        .cqgg-fee1-info-more-ul {
            text-align: left;
            font-size: 14px;
        }
        .cqgg-fee1-info-more-ul li{
            list-style-type: decimal;
            margin: 10px 20px;
            border-bottom: 1px dashed gray;
        }
        .cqgg-fee1-info-more-ul li i{
            font-weight: bold;
        }
        .cqgg-fee1-info-more-ul li p{
            text-indent: 2em;
        }
    `
    GM_addStyle(css);
}

(function () {
    'use strict';

    start();
})();
