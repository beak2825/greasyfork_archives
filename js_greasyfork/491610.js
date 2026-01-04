// ==UserScript==
// @name        店小秘产品多功能编辑【速卖通】⚙
// @namespace   None
// @match       https://www.dianxiaomi.com/smtProduct/edit.htm
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @icon        https://www.dianxiaomi.com/favicon.ico
// @version     0.0.1
// @license     MIT
// @author      Kuromi_Note
// @description 2024/4/3 10:12:22
// @downloadURL https://update.greasyfork.org/scripts/491610/%E5%BA%97%E5%B0%8F%E7%A7%98%E4%BA%A7%E5%93%81%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%BC%96%E8%BE%91%E3%80%90%E9%80%9F%E5%8D%96%E9%80%9A%E3%80%91%E2%9A%99.user.js
// @updateURL https://update.greasyfork.org/scripts/491610/%E5%BA%97%E5%B0%8F%E7%A7%98%E4%BA%A7%E5%93%81%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%BC%96%E8%BE%91%E3%80%90%E9%80%9F%E5%8D%96%E9%80%9A%E3%80%91%E2%9A%99.meta.js
// ==/UserScript==
const decodeFormData = function (rawData) {
    var data = [];
    for (var key in rawData) {
        data.push(`${key}=${rawData[key]}`);
    }
    return data.join("&");
};
const dialog = function (html, fn, type = "ny") {
    $yesBtn = $(`<button class="button btn-determine" type="button">确定</button>`);
    $noBtn = $(`<button class="button btn-gray m-left10" type="button" data-dismiss="modal">关闭</button>`)
    $yesBtn.on('click',function (){
        $("#myToolBoxDialog .modal-body").append($yesBtn).empty();
        $("#myToolBoxDialog .modal-footer").append($yesBtn).empty();
        $("#myToolBoxDialog").modal("hide");
    });
    $noBtn.on('click',function (){
        $("#myToolBoxDialog .modal-body").append($yesBtn).empty();
        $("#myToolBoxDialog .modal-footer").append($yesBtn).empty();
        $("#myToolBoxDialog").modal("hide");
    });
    $("#myToolBoxDialog .modal-body").html(html);
    $yesBtn.on("click",fn);
    for (var char of type){
        switch (char){
            case 'y':
                $("#myToolBoxDialog .modal-footer").append($yesBtn);
                break;
            case 'n':
                $("#myToolBoxDialog .modal-footer").append($noBtn);
                break;
            default:
                break;
        }
    }
    $("#myToolBoxDialog").modal("show");
}

const cutIllicitChar = function (string) {
    var _s = "";
    var letterList = "abcdefghijklmnopqrstuvwxyz";
    letterList += letterList + letterList.toUpperCase();
    for (var char of string.split("")) {
        if (letterList.includes(char)) {
            _s += char;
        }
    }
    return _s;
}
window.onload = async function () {
    $mainFloatPad = $(`<div id="editorFloatPad"></div>`);
    $labelHeader = $(`
    <div class="labelHeader">
    <label>多功能编辑工具箱【速卖通】<span style="font-size: 12px">@version 0.0.1</span></label>
    </div>
    `);
    $infoMap = $(`
    <table class="productListAdvancedSearch editorInfoMap" style="width: 100%">
    <tbody>
    <tr><th><span>基本信息</span></th></tr>
    <tr>
        <td><span>设置类目: </span></td>
        <td>
        <button class="button btn-determine">设置当前类目为默认值</button>
        <a style="background-color: rgba(255,255,255,0.4)" href="javascript:;">清除默认类目</a>
        </td>
    </tr>
    <tr>
        <td><span>设置品牌: </span></td>
        <td>
        <select action="setBrand">
            <option value="-1">请选择</option>
            <option value="-2" style="display: none">自动选择</option>
            ${
        await (async function () {
            var _s = "";
            for (var brand of await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://www.dianxiaomi.com/smtCategory/syncCategoryBrand.json",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    data: decodeFormData({
                        shopId: $("#shopId").val(),
                        categoryId: $("#categoryHistoryId").val()
                    }),
                    onload: function (response) {
                        resolve(JSON.parse(response.responseText)['brandHistoryList']);
                    }
                });
            })) {
                _s += `<option value="${brand.brandId}">${brand.brandName}</option>`;
            }
            return _s;
        })()
    }
        </select>
        <label>
            <input type="checkbox" action="isAutoSetProductBrand"><span style="margin-left: 3px">自动选择品牌</span>
        </label>
        </td>
    </tr>
    <tr><th>产品信息</th></tr>
    <tr>
        <td><span>设置分组: </span></td>
        <td>
        <label>
        <button class="button btn-determine" action="isSetDefaultProductGroup">设置当前分组为默认值</button>
        <a style="background-color: rgba(255,255,255,0.4)" href="javascript:;">清除默认分组</a>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>SKU序列: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isSetProductSkuCode" />
        <div style="display: inline-block">
            <span>前缀: </span>
            <input class="form-component w75" type="text" action="prefixCode" maxlength="4" minlength="1" placeholder="前缀"/>
            <span>长度: </span>
            <input class="form-component w75" type="text" action="codeLength" maxlength="2" minlength="1" oninput="clearMistakeNumber(this);" placeholder="编码长度"/>
        </div>
        <a style="background-color: rgba(255,255,255,0.4)" href="javascript:;" data-type="skuSetHistory">历史记录</a>
        </label>
        <span style="margin-left: 25px;">示范: </span>
        <span style="color: yellow;margin-left: 10px;display: none" flag="skuExample">
            <span style="color: yellow" data-v="skuCodeFirst"></span> ~ <span style="color: yellow" data-v="skuCodeEnd"></span>
        </span>
        <span style="color: yellow;margin-left: 10px;display: inline-block" flag="skuExampleError">格式错误，请检查参数</span>
        </td>
    </tr>
    <tr>
        <td><span>设置批发: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isSetBulk"/>
        <span>购买</span>
        <input type="text" class="form-component smsmInput w100" value="" name="bulkOrder" data-v="bulkOrder" placeholder="2~100000" oninput="clearMistakeNumber(this)">
        <span>件/个以上时减免</span>
        <input type="text" class="smsmInput form-component w70" value="" name="bulkDiscount" data-v="bulkDiscount" placeholder="1~99" oninput="clearMistakeNumber(this)">
        <span>%</span>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>设置发货期限: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isDeliveryTime"/>
        <input class="form-component w200 mRight20 smInput" type="text" data-v="deliveryTime" oninput="clearMistakeNumber(this)"/>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>设置统一库存: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isSetStock"/>
        <input type="text" class="form-component w120 smInput sameVariantIpt" data-v="ipmSkuStock" placeholder="产品统一库存" oninput="clearMistakeNumber(this)">
        </label>
        </td>
    </tr>
    <tr><th>包装信息</th></tr>
    <tr>
        <td><span>包装后重量: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isSetGrossWeight"/>
        <input class="w70 smsmInput form-component" type="text"  data-v="grossWeight" oninput="clearNoNumAndMinusDecimal3(this);">
        <span>（公斤/件/个）</span>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>包装后尺寸: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isSetPackageSize"/>
        <input class="w70 form-component smsmInput mRight10" type="text" data-v="packageLength" oninput="clearMistakeNumber(this)">
        <span>X</span>
        <input class="w70 form-component smsmInput mLeft10 mRight10" type="text" data-v="packageWidth" oninput="clearMistakeNumber(this)">
        <span>X</span>
        <input class="w70 form-component smsmInput mLeft10 " type="text" data-v="packageHeight" oninput="clearMistakeNumber(this)">
        </label>
        </td>
    </tr>
    <tr><th>模板信息</th></tr>
    <tr>
        <td><span>运费模板: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isSetFreight"/>
        <select action="setFreight">
            <option value="-1">请选择运费模板</option>
            ${
        await (async function () {
            var _s = "";
            for (var freight of await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://www.dianxiaomi.com/smtShopInfoSync/freightList.json",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    data: decodeFormData({
                        shopId: $("#shopId").val(),
                    }),
                    onload: function (response) {
                        resolve(JSON.parse(response.responseText)['freightTemplateList']);
                    }
                });
            })) {
                _s += `<option value="${freight.templateId}">${freight.templateName}</option>`
            }
            return _s;
        })()
    }
        </select>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>服务模板: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isSetPromise"/>
        <select action="setPromise">
            <option value="-1">请选择服务模板</option>
            ${
        await (async function () {
            var _s = "";
            for (var promise of await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://www.dianxiaomi.com/smtShopInfoSync/promiseList.json",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    data: decodeFormData({
                        shopId: $("#shopId").val(),
                    }),
                    onload: function (response) {
                        resolve(JSON.parse(response.responseText)['promiseTemplateList']);
                    }
                });
            })) {
                _s += `<option value="${promise.templateId}">${promise.templateName}</option>`
            }
            return _s;
        })()
    }
        </select>
        </label>
        </td>
    </tr>
    <tr><th>其他信息</th></tr>
    <tr>
        <td><span>欧盟负责人: </span></td>
        <td>
        <label>
        <input type="checkbox" action="isSetResponsiblePerson"/>
        <select action="setPromise">
            <option value="-1">---- 请选择欧盟责任人----</option>
            ${
        await (async function () {
            var _s = "";
            for (var msrEus of await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://www.dianxiaomi.com/smtProduct/getMsrEus.json",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    data: decodeFormData({
                        shopId: $("#shopId").val(),
                    }),
                    onload: function (response) {
                        resolve(JSON.parse(response.responseText).data[$("#shopId").val()].euContactList);
                    }
                });
            })) {
                _s += `<option value="${msrEus.msrEuId}">${msrEus.msrEuName}</option>`
            }
            return _s;
        })()
    }
        </select>
        </label>
        </td>
    </tr>
    <tr><th>附加动作</th></tr>
    <tr>
        <td><span>自定义属性: </span></td>
        <td>
        <label>
            <input type="checkbox" action="isAdjustImageOrder">
            <span style="margin-left: 3px">清除产品所有自定义属性</span>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>调整主图顺序: </span></td>
        <td>
        <label>
            <input type="checkbox" action="isAdjustImageOrder">
            <span style="margin-left: 3px">将主图中第二张图片放置为首图</span>
            <span style="color: yellow">(若主图数量低于2则会跳过此操作)</span>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>产品图片去重: </span></td>
        <td>
        <label>
            <input type="checkbox" action="isImageDeduplication"/>
            <span>通过</span>
            <select>
            <option>图片URL</option>
            </select>
            <span>方式进行去重</span>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>营销图片: </span></td>
        <td>
        <label>
            <input type="checkbox" action="isSetMarketImage"/>
            <span>一键生成营销图片</span>
            <span style="color: yellow">(若已经存在营销图片则会跳过此操作)</span>
        </label>
        </td>
    </tr>
    <tr>
        <td><span>无线端描述: </span></td>
        <td>
        <button class="button btn-determine">快速生成无线端描述</button>
        <label>
            <input type="checkbox" action="isSetWirelessDesc"/>
            <span>自动生成无线端描述</span>
            <span style="color: yellow">(若已经存在无线端描述则会跳过此操作)</span>
        </label>
        </td>
    </tr>
    <tr><th>第三方平台</th></tr>
    <tr><td colspan="3" class="f-left" style="color: yellow">它可以通过SKU列表里的SKU获取到其他第三方平台的数据，进而完成复杂的映射操作</td></tr>
    <tr>
        <td><span>店小秘</span></td>
        <td>
            <label>
            <span>开启</span>
            <input type="checkbox" action="isGetDianxiaomiProductData"/>
            </label>
        </td>
    </tr>
    <tr>
        <td><span>ZONO ERP</span></td>
        <td>
            <label>
            <span>开启</span>
            <input type="checkbox" action="isGetZonoErpProductData"/>
            </label>
        </td>
    </tr>
    <tr><th>逻辑计算</th></tr>
    <tr>
        <td></td>
        <td>敬请期待,,,</td>
    </tr>
    </tbody>
    </table>
    `);
    $infoMap.find(`input[action='prefixCode'],input[action='codeLength']`).on('input', function () {
        if ($(`input[action='prefixCode']`).val().length > 0 && $(`input[action='codeLength']`).val().length > 0) {
            $infoMap.find(`span[flag="skuExample"]`).css('display', 'inline-block');
            $infoMap.find(`span[flag="skuExampleError"]`).css('display', 'none');
            $infoMap.find(`span[data-v='skuCodeFirst']`).text($(`input[action='prefixCode']`).val() + "".padStart($(`input[action='codeLength']`).val(), '0'));
            $infoMap.find(`span[data-v='skuCodeEnd']`).text($(`input[action='prefixCode']`).val() + "".padStart($(`input[action='codeLength']`).val(), '9'));
        } else {
            $infoMap.find(`span[flag="skuExample"]`).css('display', 'none');
            $infoMap.find(`span[flag="skuExampleError"]`).css('display', 'inline-block');
        }
    });
    $infoMap.find(`input[action='prefixCode']`).on('input', function () {
        $infoMap.find(`input[action='prefixCode']`).val(cutIllicitChar($infoMap.find(`input[action='prefixCode']`).val()));
    });
    $infoMap.find(`a[data-type='skuSetHistory']`).on('click',function (){
        dialog(
            `<span>测试测试</span>`,
            function (){
                console.log("123");
            },"yn");
    })
    $mainFloatPad.append($labelHeader);
    $mainFloatPad.append($infoMap);

    $("body").append($mainFloatPad);
    $dialog = $(`
        <div class="modal" id="myToolBoxDialog" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="display: none; z-index: 3003;">
            <div class="modal-dialog" style="width:314px;">
                <div class="modal-content bs-example bs-example-tabs">
                    <div class="modal-header" style="padding:7px 15px;">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>
                        <h4 class="modal-title" id="myModalLabelCode">SKU历史记录</h4>
                    </div>
                    <div class="modal-body tab-content p10 " style="height:100px;padding-top:20px;">
                    </div>
                    <div class="modal-footer btn-box">
                    </div>
                </div>
            </div>
        </div>
    `);
    $("body").append($dialog);
    $("body").on('keydown',function (e){
        if(+e.keyCode === 192){
            $mainFloatPad.css("display",$mainFloatPad.is(":visible")?"none":"block");
        }
    });
    await execute();
}

const loadSetting = async function(){

}
const execute = async function(){
    $dianxiaomiSubmenu = $(`
    <li class="dropdown-submenu">
        <a tabindex="-1" href="javascript:;" data-toggle="dropdown">店小秘「内联映射」
        <span class="myjCaretRight" style="margin-top:3px;color:#999;"></span>
        </a>
        <ul class="dropdown-menu">
            <li class="dropdown-header">店小秘「内联映射」</li>
            <li class="dropdown-submenu">
                <a tabindex="-1" href="javascript:;">速卖通 
                <span class="myjCaretRight" style="margin-top:3px;color:#999;"></span>
                </a>
                <ul class="dropdown-menu" role="menu">
                <li class="dropdown-header">店小秘「内联映射」> 速卖通</li>
                <li class="loading">
                    <a tabindex="-1" href="javascript:;">搜索中,请稍后...（速卖通）
                    <img style="height: 15px" src="https://www.gstatic.com/ui/v1/activityindicator/loading_24.gif">
                    </a>
                </li>
                </ul>
            </li>
            <li class="dropdown-submenu">
                <a tabindex="-1" href="javascript:;">虾皮(shopee) 
                <span class="myjCaretRight" style="margin-top:3px;color:#999;"></span>
                </a>
                <ul class="dropdown-menu" role="menu">
                <li class="dropdown-header">店小秘「内联映射」> 虾皮(shopee)</li>
                <li class="loading">
                    <a tabindex="-1" href="javascript:;">搜索中,请稍后...（虾皮）
                    <img style="height: 15px" src="https://www.gstatic.com/ui/v1/activityindicator/loading_24.gif">
                    </a>
                </li>
                </ul>
            </li>
        </ul>
    </li>
    `);
    $zono_erpSubmenu = $(`
    <li class="dropdown-submenu">
        <a tabindex="-1" href="javascript:;" >ZONO ERP
            <span class="myjCaretRight" style="margin-top:3px;color:#999;"></span>
        </a>
        <ul class="dropdown-menu">
            <li class="dropdown-header">ZONO ERP(120系统)</li>
            <li>
            <a href="javascript:;">搜索中,请稍后...
            <img style="height: 15px" src="https://www.gstatic.com/ui/v1/activityindicator/loading_24.gif">
            </a>
            </li>
        </ul>
    </li>
    `);
    $dropdown_div = $(`
        <div class="dropdown fl m-left10 dropDownDiv">
            <a class="dropdown-toggle glyphicon glyphicon-globe mTop10" href="javascript:" data-toggle="dropdown" type="button"></a>
            <ul class="dropdown-menu m0 p0 pull-right" style="min-width:50px;right: -10px;">
            <li class="dropdown-header">第三方平台</li>
            </ul>
        </div>
    `);
    $dropdown_div.find("ul.dropdown-menu:first").append($dianxiaomiSubmenu);
    $dropdown_div.find("ul.dropdown-menu:first").append($zono_erpSubmenu);
    // $dianxiaomiSubmenu.find('li.dropdown-submenu:first').on('mouseover',function (){
    //     $dianxiaomiSubmenu.find('')
    // });
    $("#skuVariantList tr[data-name='skuProperty'] td[data-names='price'] input.sameVariantIpt").before($dropdown_div);
    // if ($("table.editorInfoMap input[action='isGetDianxiaomiProductData']").is(":checked")){
    //    $dropdown_div.find("ul.dropdown-menu").append($dianxiaomiSubmenu);
    // }
    // if ($("table.editorInfoMap input[action='isGetZonoErpProductData']").is(":checked")){
    //     $dropdown_div.find("ul.dropdown-menu").append($zono_erpSubmenu);
    // }
}

GM_addStyle(`
#editorFloatPad{
    backdrop-filter: blur(6px);
    position: fixed;
    bottom: 0px;
    background-color: rgba(0, 0, 0, 0.4);
    height: 35%;
    width: 100%;
    z-index: 100;
}
.labelHeader{
    width: 100%;
    height: 50px;
    padding: 0 5px 5px 5px;
    border-bottom: 1px solid rgba(255,255,255,0.5);
}
.dropdown:hover ul.dropdown-menu .dropdown-submenu > ul.dropdown-menu {display:none;}
.dropdown ul.dropdown-menu .dropdown-submenu:hover > ul.dropdown-menu {display:block;}
.labelHeader label{
    line-height: 40px;
    vertical-align: middle;
    display: inline-block;
    padding: 5px;
    font-size: 15px;
    color: white;
    font-weight: bold;
}

.editorInfoMap{
    width: 100%;
    overflow-x: auto;
    height: calc(100% - 50px);
    display: block;
    padding: 5px;
}
.editorInfoMap::-webkit-scrollbar {
    display:none
}
.editorInfoMap label{
    user-select: none;
}
.editorInfoMap th{
    font-size: 14px;
    color: white;
    padding: 5px;
}
.editorInfoMap td span{
    color: white
}
.editorInfoMap select{
    border-radius: 2px;
    padding: 6px;
    border: 1px solid #ccc;
    line-height: 30;
    height: 32px;
    width: 240px;
}
`);
