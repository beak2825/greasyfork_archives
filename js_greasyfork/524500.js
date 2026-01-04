// ==UserScript==
// @name         飞书多维表格，表单、查询页优化
// @namespace    http://damafeng.com/
// @version      1.1.0
// @description  在飞书多维表格中，表单页面扩展中间区域，方便填写、查询页根据携带参数，字段填充并搜索
// @author       阿斯旺加布
// @match        *://damafeng.feishu.cn/share/base/form*
// @match        *://damafeng.feishu.cn/share/base/query*
// @match        *://damafeng.feishu.cn/base/WDI1bAGmJacfm4s3sG*
// @icon         data:image/png;base64,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
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_addElement
// @license      GPL-2.0-only
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.4.5/dist/sweetalert2.min.js
// @downloadURL https://update.greasyfork.org/scripts/524500/%E9%A3%9E%E4%B9%A6%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%EF%BC%8C%E8%A1%A8%E5%8D%95%E3%80%81%E6%9F%A5%E8%AF%A2%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/524500/%E9%A3%9E%E4%B9%A6%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%EF%BC%8C%E8%A1%A8%E5%8D%95%E3%80%81%E6%9F%A5%E8%AF%A2%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

function createCss() {
    var templateCSS = ".tipCss{position: absolute;width: 260px;height: 45px;background: #e3e3e3;display: none;justify-content: center;align-items: center;font-size: 18px;font-weight: bold;border-radius: 5px;color: green;}"
    //createElement('style', 'dmfStyle');
    //document.querySelector("#dmfStyle").innerHTML = (templateCSS);

    GM_addStyle(templateCSS)

    GM_notification({
        text: "This is the notification message.",
        title: "Notification Title",
        onclick: () => alert('I was clicked!')
    });
}


// 创建HTML 结构
function createHTML() {
    var localUrl = window.location.href;
    console.log("localUrl>>>", localUrl)

    // slogan
    setTimeout(() => {
        var barDiv = document.getElementsByClassName("navigation-bar__right")[0];
        var rightBar = barDiv.getElementsByClassName("left-content")[0];
        var newDiv = document.createElement('div');
        newDiv.id = "sloganDiv";
        newDiv.innerHTML = '<img src="https://erp.damafeng.com/assets/logo2.cb5e9f43.gif" data-v-8d8000f3="" style="width: 227px; height: 52px; padding-bottom: 6px; margin-left: 20px;">'
        rightBar.appendChild(newDiv);
    }, 4000)

    // 数据表页面
    if(localUrl.indexOf("/base/WDI1bAGmJacfm4s3sGqc7") > 0){
        tablePage(localUrl);
    }

    // form 表单==========================================
    if (localUrl.indexOf("/form/") > 0) {
        formPage(localUrl);
    }


    // 查询页面 ======================================================================================================
    if (localUrl.indexOf("/query/") > 0) {
        queryPage(localUrl);
    }

}

/**
数据表页面
**/
function tablePage(localUrl) {
    document.addEventListener('click', function(event) {
        setTimeout(() => {
            localUrl = window.location.href;

            //
            var wrapperDiv = document.getElementsByClassName("bitable-view-head-wrapper")[0];
            //wrapperDiv = document.getElementsByClassName("b-scroll-view-wrapper")[0]
            var ulItem = wrapperDiv.querySelector("ul");

            // 新增的按钮对象
            var liHtml = '<div class="bitable-view-menu-item__content bitable-layout-row bitable-layout-cross-center"><button id="addClueBtn" type="button" class="ud__button ud__button--filled ud__button--filled-default ud__button--size-md suite-share layout-row layout-cross-center layout-main-center note-share-hide suite-share-btn--mr8 note-btn note-title__share"><span class="ud__button__icon-inline ud__button__icon-inline-start"><div class="new-share-icon"><span class="universe-icon"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="AddOutlined"><path d="M12 2a1 1 0 0 0-1 1v8H3a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-8h8a1 1 0 1 0 0-2h-8V3a1 1 0 0 0-1-1Z" fill="currentColor"></path></svg></span></div></span><span class="suite-share__text" id="btnText">新增客户</span></button></div>'
            var newLi = document.createElement('li');

            var liId = "", btnText = "", btnHref = "";

            // 客户信息页面
            if (localUrl.indexOf("tblxrS4beSLVCC") > 0) {
                
                if (ulItem.innerHTML.indexOf("khxxLi") < 0) {
                    liId = "khxxLi";
                    btnText = "新增客户";
                    btnHref = "https://damafeng.feishu.cn/share/base/form/shrcnSkyar3vX8eL0NjxWCKBdCc";
                    //newLi.id = "khxxLi";
                    //newLi.classList.add("bitable-view-menu-item","bitable-layout-row","bitable-layout-cross-center","bitable-noselect","J-bitable-sidebar__item","bitable-view-menu-item--tab-active","bitable-view-menu-item--long-indent-style","bitable-view-menu-item--tab-style","bitable-view-menu-item-tab-vewp08X8my","bitable-view-menu-item-tab--grid");
                    //newLi.style = "padding-left: 16px; height: 40px;background: #f5f6f7;";
                    //newLi.innerHTML = liHtml
                    //ulItem.appendChild(newLi);

                    //var addClueBtn = document.getElementById("addClueBtn");
                    //addClueBtn.addEventListener('click', () => {
                    //    window.open("https://damafeng.feishu.cn/share/base/form/shrcnSkyar3vX8eL0NjxWCKBdCc")
                    //})
                } else {
                    liId = "";
                }
            } else if (localUrl.indexOf("tblDpyFa6woF7") > 0) {

                if (ulItem.innerHTML.indexOf("xsddLi") < 0) {
                    liId = "xsddLi";
                    btnText = "新增销售订单";
                    btnHref = "https://damafeng.feishu.cn/share/base/form/shrcnbUw69TLkRcpSRvjvXSFdLg";
                } else {
                    liId = "";
                }
            }

            if (liId != "") {
                newLi.id = liId;
                newLi.classList.add("bitable-view-menu-item","bitable-layout-row","bitable-layout-cross-center","bitable-noselect","J-bitable-sidebar__item","bitable-view-menu-item--tab-active","bitable-view-menu-item--long-indent-style","bitable-view-menu-item--tab-style","bitable-view-menu-item-tab-vewp08X8my","bitable-view-menu-item-tab--grid");
                newLi.style = "padding-left: 16px; height: 40px;background: #f5f6f7;";
                newLi.innerHTML = liHtml
                ulItem.appendChild(newLi);

                var addClueBtn = document.getElementById("addClueBtn");
                jQuery("#btnText").text(btnText);
                addClueBtn.addEventListener('click', () => {
                    window.open(btnHref)
                })

                if (liId == "khxxLi") {
                    document.getElementById('xsddLi').remove(); // 移除 客户信息页面 的添加客户按钮
                } else if (liId == "xsddLi") {
                    document.getElementById('khxxLi').remove(); // 移除 客户信息页面 的添加客户按钮
                }
            } else {
                if(document.getElementById('khxxLi')){
                    document.getElementById('khxxLi').remove(); // 移除 客户信息页面 的添加客户按钮
                }
                if(document.getElementById('xsddLi')){
                    document.getElementById('xsddLi').remove(); // 移除 销售订单页面 的添加销售订单按钮
                }
            }
        }, 500)
    });
}

// form 表单页面
function formPage(localUrl) {

    // 创建提示框
    createTipDiv();

    // 设置表格宽度
    var formBody = document.getElementsByClassName("form-body")[0]
    if(localUrl.indexOf("%E9%80%80%E6%AC%BE%E6%89%B9%E6%AC%A1%E5%8F%B7") > 0){ // 销售退款
        formBody.style.maxWidth = "1500px";

        // from 表单
        var fromT = document.getElementsByClassName("ud__form ud__form-vertical ud__form-md")[0]
        fromT.style.maxWidth = "1500px";
        fromT.style.display = "flex";
        fromT.style.flexWrap = "wrap";
        fromT.style.justifyContent = "space-between";

        var fromItem = fromT.getElementsByTagName("div")
        for (var i in fromItem) {
            var id = fromItem[i].id;
            if (id.includes("field-item-fld")) {
                if (i == 0) {
                    fromItem[i].style.width = "100%"
                } else {
                    fromItem[i].style.width = "48%"
                }
            } else if (id.includes("field-item-table")) {
                fromItem[i].style.width = "100%"
            }
        }
    } else if (localUrl.indexOf("shrcnbUw69TLkRcpSRvjvX") > 0) { // 新增销售订单
        document.getElementsByClassName("ud__row ud__form__item ud__form__item-error-locally form-submit-wrapper")[0].style.width = "75%" // 提交按钮

        formBody.style.maxWidth = "1500px";
        // from 表单
        let fromT = document.getElementsByClassName("ud__form ud__form-vertical ud__form-md")[0]
        fromT.style.maxWidth = "100%";
        fromT.style.display = "flex";
        fromT.style.flexWrap = "wrap";
        fromT.style.justifyContent = "flex-start;";

        let fromItem = fromT.getElementsByTagName("div")
        for (let i in fromItem) {
            let id = fromItem[i].id;
            if (id && id.includes("field-item-fld")) {
                let label = fromItem[i].querySelector("label").innerHTML;
                if (label == "办理产品数量" || label == "产品1" || label == "产品2" || label == "产品3") {
                    fromItem[i].style.width = "80%";
                    if(label == "产品1" || label == "产品2" || label == "产品3"){
                        jQuery(fromItem[i]).before("<hr style='width: 100%;    margin: -10px 5px;'>")
                    }
                } else if (label == "客户") {
                    fromItem[i].style.width = "30%"
                } else {
                    fromItem[i].style.width = "30%"
                }

                // 修改销售合同项，增加添加合同按钮
                if (label == "销售合同") {
                    jQuery(fromItem[i]).find(".ud__form__item__control").css("display", "flex").css("flex-direction", "row");
                    jQuery(fromItem[i]).find(".ud__form__item__control__input").css("width", "60%");

                    // 新增销售合同
                    let divHtml = '<div class="bitable-view-menu-item__content bitable-layout-row bitable-layout-cross-center" style="width: 87px; margin: 5px 0 0 30px;"><button id="addHtBtn" type="button" class="ud__button ud__button--filled ud__button--filled-default ud__button--size-md suite-share layout-row layout-cross-center layout-main-center note-share-hide suite-share-btn--mr8 note-btn note-title__share"><span class="ud__button__icon-inline ud__button__icon-inline-start"><div class="new-share-icon"><span class="universe-icon"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="AddOutlined"><path d="M12 2a1 1 0 0 0-1 1v8H3a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-8h8a1 1 0 1 0 0-2h-8V3a1 1 0 0 0-1-1Z" fill="currentColor"></path></svg></span></div></span><span class="suite-share__text" id="btnText">新增合同</span></button></div>'
                    jQuery(fromItem[i]).find(".ud__form__item__control__input").after(divHtml);
                    var addHtBtn = document.getElementById("addHtBtn");
                    addHtBtn.addEventListener('click', () => {
                        let kh = jQuery("#field-item-flduOvSSQa").find(".ud__form__item__control").find(".bitable-731feb__select-dropdown").text();

                        // 点击按钮
                        window.open("https://damafeng.feishu.cn/share/base/form/shrcnS9LgOPZ4ioUFL8azVaTmvf?甲方=" + kh)
                    })
                } else {
                    jQuery(fromItem[i]).find(".bitable-form_editor").css("width", "90%");
                }
            } else if (id && id.includes("field-item-table")) {
                fromItem[i].style.width = "100%"
            }
        }

        // 办理产品数量，改变后修改样式
        jQuery("#number-editor-input-fldZJ0etvn").on("change", function(){
            console.log(">>>>>>>>>>>>>>>>")
            let lableList = ["客户", "客户名称", "销售合同", "销售经理", "业务类型", "返点金额", "商务费金额", "备注", "办理产品数量"]
            setTimeout(() => {
                fromItem = fromT.getElementsByTagName("div")
                for (let i in fromItem) {
                    let id = fromItem[i].id;
                    if (id && id.includes("field-item-fld")) {
                        let label = fromItem[i].querySelector("label").innerHTML;
                        if (!lableList.includes(label)) {
                            if (label == "产品1" || label == "产品2" || label == "产品3") {
                                fromItem[i].style.width = "90%"
                                jQuery(fromItem[i]).before("<hr style='width: 100%;    margin: -10px 5px;'>")
                            } else {
                                fromItem[i].style.width = "48%"
                                jQuery(fromItem[i]).find(".bitable-form_editor").css("width", "90%");
                            }
                        }
                    }
                }
            }, 500);
        })
    } else if (localUrl.indexOf("shrcnS9LgOPZ4ioUFL8azVa") > 0) { // 销售合同
        document.getElementsByClassName("ud__row ud__form__item ud__form__item-error-locally form-submit-wrapper")[0].style.width = "75%"; // 提交按钮
        formBody.style.maxWidth = "70%";
        // from 表单
        let fromT = document.getElementsByClassName("ud__form ud__form-vertical ud__form-md")[0]
        fromT.style.maxWidth = "100%";
        fromT.style.display = "flex";
        fromT.style.flexWrap = "wrap";
        fromT.style.justifyContent = "flex-start;";

        let fromItem = fromT.getElementsByTagName("div")
        for (let i in fromItem) {
            let id = fromItem[i].id;
            if (id && id.includes("field-item-fld")) {
                let label = fromItem[i].querySelector("label").innerHTML;
                if (label == "销售合同名称") {
                    fromItem[i].style.width = "80%";
                } else {
                    fromItem[i].style.width = "45%"
                }
                jQuery(fromItem[i]).find(".bitable-form_editor").css("width", "90%");
            }
        }
        let params = getParams();
        let name = params.get("甲方")
        if(name == null){
            return;
        }
        setTimeout(() => {
            let jiaFangItem = jQuery("#field-item-fldXh7bUT8").find(".bitable-731feb__select");
            jiaFangItem.find(".bitable-731feb__select-dropdown").click();
            setTimeout(() => {
                jiaFangItem.find(".b-select-dropdown-container").find(".b-select-search").val(name);
            }, 1200);
        }, 1000)
    } else if (localUrl.indexOf("shrcnrqLKEslc4AGcuT2yS7") > 0) { // 销售回款单
        document.getElementsByClassName("ud__row ud__form__item ud__form__item-error-locally form-submit-wrapper")[0].style.width = "75%"; // 提交按钮
        formBody.style.maxWidth = "70%";
        // from 表单
        let fromT = document.getElementsByClassName("ud__form ud__form-vertical ud__form-md")[0]
        fromT.style.maxWidth = "100%";
        fromT.style.display = "flex";
        fromT.style.flexWrap = "wrap";
        fromT.style.justifyContent = "flex-start;";

        let fromItem = fromT.getElementsByTagName("div")
        for (let i in fromItem) {
            let id = fromItem[i].id;
            if (id && id.includes("field-item-fld")) {
                let label = fromItem[i].querySelector("label").innerHTML;
                if (label == "交付单明细") {
                    fromItem[i].style.width = "100%";
                } else {
                    fromItem[i].style.width = "25%"
                }
                jQuery(fromItem[i]).find(".bitable-form_editor").css("width", "90%");
            } else if (id && id.includes("field-item-table")) {
                fromItem[i].style.width = "100%"
            }
        }

        // 调整交付单明细 列宽
        jQuery(".ud__table-content").find("table").css("width", "1945px");
        let colgroup = jQuery(".ud__table-content").find("colgroup").find("col");
        let list100 = ["2", "3", "6", "9"], list110 = ["4", "5", "7", "8", "10"];
        for(let i in list100) {
            jQuery(colgroup[Number(list100[i])]).css("width", "100px").css("minWidth", "100px")
        }
        for(let i in list110) {

            if(Number(list110[i]) < 7){
                jQuery(colgroup[Number(list110[i])]).css("width", "110px").css("minWidth", "110px")
            } else {
                jQuery(colgroup[Number(list110[i])]).css("width", "123px").css("minWidth", "123px")
            }
        }

    }

    if (document.getElementsByClassName("ud__table-container")[0]) {
        formBody.style.maxWidth = "80%";
    }

    // 新增按钮——提交并关闭页面==========
    // 原按钮的DIV
    var btnDiv = document.getElementsByClassName("ud__row ud__form__item ud__form__item-error-locally form-submit-wrapper")[0];
    btnDiv = btnDiv.getElementsByClassName("ud__form__item__control__input__content")[0];
    btnDiv.style.display = "flex";

    var btn = btnDiv.getElementsByClassName("ud__button ud__button--filled ud__button--filled-default ud__button--size-md form-submit")[0]
    btn.style.width = "150px";

    // 创建一个新的子元素
    var newChild = document.createElement('div');
    newChild.innerHTML = '<button type="button" id="submitAndClose" class="ud__button ud__button--filled ud__button--filled-default ud__button--size-md form-submit" style="margin-right: 30%;"><span>提交并关闭</span></button>';
    btnDiv.appendChild(newChild);

    // 监听按钮的点击事件
    var newBtn = document.getElementById("submitAndClose");
    newBtn.addEventListener("click", function(event){
        btn.click();
        setTimeout(function(){
            let error = document.getElementsByClassName("ud__form__item__control__explain-error")

            // 自动关闭页面
            if(error.length == 0) {
                let tipDiv = document.getElementsByClassName("tipCss")[0];
                tipDiv.style.display = "flex";
                setTimeout(function(){
                    window.close();
                }, 1500);
            }
        }, 1000);
    })

    // 查看提交记录，自动筛选指定信息
    if (localUrl.indexOf("checkUpdate=1") > 0) {
        // 点击 “查看提交记录”
        var shareHeader = document.getElementsByClassName("share-form-entry-header")[0];
        var checkBtn = shareHeader.querySelector("button");
        checkBtn.click();
        var params = getParams();

        // 产品报价
        if (localUrl.indexOf("shrcnT9krkHOvSooljqqdQslnRf") > 0 || localUrl.indexOf("shrcnkqhCKfgifc2eSdFIHQ7KNh") > 0 || localUrl.indexOf("shrcnvOLexGq1F5Gv2c5V53iJ1e") > 0 ) {
            var name = params.get("产品名称")
            if(name == null){
                return;
            }
            setTimeout(function(){
                var items = document.getElementsByClassName("base-form-query-page-result-record Base-Query-Record-Item-White");

                for(var i in items) {
                    var titleDiv = items[i].getElementsByClassName("base-form-query-page-result-record-title")[0];
                    var titleValue = titleDiv.getElementsByClassName("base-form-query-page-result-field-value")[0].innerHTML;
                    console.log("titleValue>>>", titleValue, name)
                    if(titleValue.indexOf(name) > 0) {
                        items[i].click();

                        // 监听保存按钮，保存后 重置URL
                        setTimeout(function(){

                            // 保存 按钮DIV
                            var saveBtnDiv = document.getElementsByClassName("share-form-query-record-card_submit-wrapper")[0];
                            console.log("saveBtnDiv>>>", saveBtnDiv)
                            var saveBtn = saveBtnDiv.querySelector("button");
                            saveBtn.addEventListener("click", function(event){
                                var newUrl = localUrl.substring(0, localUrl.indexOf("&"));
                                window.location.href = newUrl; // 重置URL
                            })
                        }, 1000)
                    } else {
                        items[i].style.display = "none";
                    }
                };
            }, 1000);

        }
    }
}

// 查询页面
function queryPage(localUrl){
    // 解析地址栏参数
    let paramsStr = localUrl.substring(localUrl.indexOf("?") + 1);
    paramsStr = paramsStr.replaceAll("query_", "");
    console.log("paramsStr>>>", paramsStr)
    if (!paramsStr) return {};

    // 将查询字符串分割成键值对数组
    const params = paramsStr.split('&');

    // 创建一个对象来存储解析后的参数
    const result = new Map();
    params.forEach(param => {
        const [key, value] = param.split('=');
        // 解码URL组件，以确保正确处理特殊字符
        result.set(decodeURIComponent(key), decodeURIComponent(value || ''));
    });
    console.log("result>>>", result)
    let finishNum = 0;

    // 获取查询页面参数
    setTimeout(function(){
        let formDiv = document.getElementById("QueryConditionDragContainerId");
        let formItemDiv = formDiv.getElementsByClassName("base-form-query-page-condition-item Base-Condition-Card-White-Class");
        for(var i in formItemDiv){
            const formItem = formItemDiv[i];

            // 字段名称
            let name = formItem.getElementsByClassName("name-span")[0].innerHTML;


            // 右侧图标，用于区分类型
            let rightDiv = formItem.getElementsByClassName("universe-icon base-form-query-page-condition-item_right")[0];
            let rightSvg = rightDiv.querySelector("svg")
            if (rightSvg != null && typeof formItem != "number") {

                let dataIcon = jQuery(rightSvg).attr("data-icon")
                if (dataIcon == "LookupOutlined") { // 查找引用输入框===========
                    setTimeout(function(){
                        let itemDiv = formItem.getElementsByClassName("bitable-f5b837__filter--text-input")[0];
                        let inuptItem = formItem.getElementsByClassName("edit")[0].querySelector("input");
                        //inuptItem.remove(); // 移除元素
                        inuptItem.click()
                        inuptItem.setAttribute('value', result.get(name))

                        // 重新创建元素
                        var newInput = document.createElement('input');
                        newInput.type = "text";
                        newInput.setAttribute('value', result.get(name))
                        //itemDiv.appendChild(newInput);
                        finishNum++;
                    }, 2000)
                } else if(dataIcon == "SheetOnedatareferenceOutlined"){ // 单项引用==============
                    let selectItemDiv = formItem.getElementsByClassName("bitable-731feb__select-dropdown b-select-dropdown-menu enabled")[0];
                    let selectItem = selectItemDiv.getElementsByClassName("b-select-value-placeholder")[0];
                    selectItem.click();

                    setTimeout(function(){
                        let inuptItem = document.getElementsByClassName("b-select-search")[0];
                        //inuptItem.focus()

                        //inuptItem.setAttribute('value', result.get(name))
                        jQuery(inuptItem).val(result.get(name));
                        //inuptItem.click();
                        jQuery(inuptItem).trigger('input');


                        jQuery(inuptItem).trigger(jQuery.Event('keydown', {keyCode: 65}));


                        /**
                            let selectLiDiv = document.getElementsByClassName("auto-sizer-wrapper")[0];
                            let selectLi = selectLiDiv.getElementsByTagName("li");
                            for(var i in selectLi){
                                    console.log("inuptItem>>>", jQuery(selectLi[i]).attr("title"), result.get(name))
                                if(jQuery(selectLi[i]).attr("title") == result.get(name)){
                                    jQuery(selectLi[i]).click();
                                }
                            }
**/

                    }, 800);

                    finishNum++;
                } else {
                    finishNum++;
                }
            }
        };

        // 点击 “查询” 按钮
        let count = 0;
        const intervalId = setInterval(() => {
            console.log('执行次数:', count + 1, result.size, finishNum);

            if (finishNum >= result.size) {
                clearInterval(intervalId);
                console.log("finishNum>>>", finishNum)
                let bottomDiv = document.getElementsByClassName("base-form-query-page-condition_bottom")[0].getElementsByClassName("base-form-close-panel-when-click")[0];
                //bottomDiv.querySelector("button").click();
            }

            if (count >= 5) {
                clearInterval(intervalId);
            }
            count++;
        }, 1000);

    }, 1000)
}

/**
 * 创建元素
 **/
function createElement(dom,domId){
    var rootElement = document.body;
    var newElement = document.createElement(dom);
    newElement.id = domId;
    var newElementHtmlContent = document.createTextNode('');
    rootElement.appendChild(newElement);
    newElement.appendChild(newElementHtmlContent);
}

// 解析地址栏参数
function getParams() {
    // 解析地址栏参数
    var localUrl = window.location.href;
    let paramsStr = localUrl.substring(localUrl.indexOf("?") + 1);
    paramsStr = paramsStr.replaceAll("query_", "");
    console.log("paramsStr>>>", paramsStr)
    if (!paramsStr) return {};

    // 将查询字符串分割成键值对数组
    const params = paramsStr.split('&');

    // 创建一个对象来存储解析后的参数
    const result = new Map();
    params.forEach(param => {
        const [key, value] = param.split('=');
        // 解码URL组件，以确保正确处理特殊字符
        result.set(decodeURIComponent(key), decodeURIComponent(value || ''));
    });
    console.log("result>>>", result)
    return result;
}

// 创建提示弹框
function createTipDiv() {
    var html = "✔提交成功，页面即将关闭！";
    // 创建一个自己的结构
    let example = document.createElement("div")
    // 给 example 这个 div 设置类名
    example.classList.add("tipCss")
    example.innerHTML = html
    let logo = document.querySelector("#handleOk")
    document.getElementsByClassName("form-body")[0].appendChild(example)
}

(function () {
    'use strict';
    // 创建CSS样式
    createCss();

    createHTML();
})();

