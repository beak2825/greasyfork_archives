// ==UserScript==
// @name         快速保存商品
// @namespace    YoungYang
// @version      0.2
// @description  店小秘快速保存
// @author       You
// @match        *://www.dianxiaomi.com/pddkjProduct/add.htm
// @match        *://www.dianxiaomi.com/pddkjProduct/quoteEdit.htm?*
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/522253/%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/522253/%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        .dianxiaomi {
            position: relative;
            z-index: 1001;
        }
        .dianxiaomi .popups-button {
            position: fixed;
            top: 50%;
            right: 0px;
            z-index: 99999;
            background: rgba(255, 255, 255, 0.5);
            color: rgb(0, 0, 0);
            font-size: 1.5em;
            padding: 10px;
            text-align: center;
            cursor: pointer;
        }
        .dianxiaomi .popups-panel {
            position: fixed;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            pointer-events: none;
        }
        .dianxiaomi.is-active .popups-panel {
            opacity: 1;
            pointer-events: auto;
        }
        .dianxiaomi .popups-panel .panel-main {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 30px;
            padding: 30px;
            width: 300px;
            height: auto;
            background: #fff;
        }
        .dianxiaomi .popups-panel .panel-main {
            & label,
            & input,
            & select{
                width: 100%;
            }
        }
        .dianxiaomi .popups-panel .panel-main .main-Dashboard {
            display: flex;
            flex-direction: column;
        }
        .dianxiaomi .popups-panel .panel-main .main-Dashboard .btn-ground{
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
        }
        .dianxiaomi .popups-panel .panel-main .main-Dashboard .btn-ground div{
            cursor: pointer;
        }
        .dianxiaomi .popups-panel .panel-main .main-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `);

    function drawInfoInPage(id) {
        var dom = document.getElementById(id);
    
        if (!dom) {
            dom = document.createElement("div");
            dom.id = id;
            dom.className = "dianxiaomi";
            document.body.appendChild(dom);
        }
    
        dom.innerHTML = `
            <div class="popups-button">
                <div class="">面板</div>
            </div>
            <div class="popups-panel">
                <div class="panel-main">
                    <div class="main-Dashboard">
                        <p>[Image主图] <br> [Image颜色] </p>
                        <label for="template">模板:</label>
                        <select id="template" name="template"></select>
                        ${  new RegExp("/pddkjProduct/quoteEdit").test(window.location.href) ? '<div><label for="templateName">模板名:</label><input id="templateName"></div>' : "" }
                        <div class="btn-ground">
                            ${  new RegExp("/pddkjProduct/quoteEdit").test(window.location.href) ? '<div class="SaveTemplate">保存当前模板</div>' : "" }
                            <div class="DelTemplate">删除选中模板</div>
                        </div>

                        <div class="btn-ground">
                            <input class="ImportTemplate" type="file" accept=".json">
                            <div class="ExportTemplate">导出模板</div>
                        </div>
                    </div>
                    <div class="main-options">
                        <div class="options-item">
                            <label for="serialNumber">Serial Number:</label>
                            <input id="serialNumber">
                        </div>
                        <div class="options-item">
                            <label for="AttributePattern">属性:</label>
                            <input id="AttributePattern" type="text" list="patternList" />
                            <datalist id="patternList"></datalist>
                        </div>
                        <div id="triggerButton">添加商品</div>
                    </div>
                </div>
            </div>
        `;
    }
    drawInfoInPage("dianxiaomi");

    function getPatternList(){
        return $('[data-name="图案"] .menuContentValueDataList').val();
    }
    function getAjaxData() {

        var isError = false;

        var returnAjaxData = {};
        var dxmState = $('#dxmState').val(), //产品状态
            $categoryType = $('#categoryType'),//分类类型： 0：非服装类类目（除鞋子类目外的其他非服装类目）  1：服装类目 2：鞋子类目 ，默认非服装类目
            comData = {
                isHasVariation: true,//是否有变种主题，根据产品分类来判断,默认都是有变种主题的
                variationThemMaxNum: 3,//变种主题的个数，目前默认最多只能添加3个变种主题
                variationMaxLenNum: 35,//变种属性值支持的最大字符长度 35个字符
                checkSkuAttrData: {}, //按点击顺序保存变种属性值，编辑页保存、发布时用到，
                variAttrTableData: [],//临时存储变种列表的一些数据
                skuMaxLen: 50,//sku字符上限50
                customSkuMaxNum: 400,//非服装或鞋子类最多支持的sku数量
                customAttrMaxNum: 50,//非服装类一个主题下最多可以勾选的最大属性数量
                clothColorMaxNum: 20, //服装类颜色属性值最大数量20个skc
                clothSizeMaxNum: 10, //服装类尺码属性值最大数量10个
                skuAttDataArr: {},//变种属性值记录 {attrName1:['value1','value2','value3'],attrName2:['value1','value2','value3']}
                skuAttrArr: [],
                skuAttrData: {
                    color: [
                        { name: '白色', rgb: '#ffffff', colorId: 'white', class: 'f-black' },
                        { name: '黑色', rgb: '#000000', colorId: 'black' },
                        { name: '红色', rgb: '#FF2600', colorId: 'red' },
                        { name: '蓝色', rgb: '#0433FF', colorId: 'blue' },
                        { name: '绿色', rgb: '#009051', colorId: 'green' },
                        { name: '灰色', rgb: '#797979', colorId: 'grey' },
                        { name: '棕色', rgb: '#941100', colorId: 'brown' },
                        { name: '黄褐', rgb: '#929000', colorId: 'tan' },
                        { name: '米黄', rgb: '#FFFFCC', colorId: 'beige', class: 'f-black' },
                        { name: '粉红', rgb: '#FF2F92', colorId: 'pink' },
                        { name: '橙色', rgb: '#FF9300', colorId: 'orange' },
                        { name: '黄色', rgb: '#FFFB00', colorId: 'yellow', class: 'f-black' },
                        { name: '乳白', rgb: '#EBEBEB', colorId: 'ivory', class: 'f-black' },
                        { name: '藏青', rgb: '#000080', colorId: 'navy blue' },
                        { name: '紫色', rgb: '#531B93', colorId: 'purple' },
                        { name: '金色', rgb: '#FFD479', colorId: 'gold' }
                    ],
                    size: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL']
                },
                skuShowData: {},//产品分类切换时获取到的页面的变种历史数据
                colorArr: ['color', 'colour', '颜色', '顏色', '颜色分类'],
                sizeArr: ['size', '尺码', '尺碼', '尺寸', '尺寸分类', 'specification'],
                modalArr: ['适用手机型号'],
                newSkuVariation: [],// 既有推荐主题又有自定义主题时，把自定义的主题存起来
                html: {
                    label: '<div class="change-box-out changeBoxOut">' +
                        '<label><input type="checkbox" value="&{value}" checked data-valid="&{valId}" specid="&{specId}"/>' +
                        '<span class="white-space name changeName"><!--&{name}--></span></label>&{nameCtr}</div>',
                    attrTypeTh: '<th class="error-box">状态</th>',
                    attrTh: '<th class="w120 minW120 maxW200 skuAttrName" data-name="&{nameUc}"><!--&{name}--></th>',
                    upcTh: '<th class="minW120-imp addStrSp validformOut" attrId="external_product_id">' +
                        '<span uid="codeTypeName">' +
                        '<div class="codeTypeNameIn"></div>' +
                        '<div class="upcOrEanSelBox">' +
                        '<select class="form-component w80 h25 p-top0 p-bottom0" uid="upcOrEanSel" datatype="mustVisible" nullmsg="请选择产品状态" errormsg="请选择产品状态">' +
                        '<option value="1">EAN</option><option value="2">UPC</option><option value="3">ISBN</option></select>' +
                        '<i class="iconfont icon_help_outline gray-c v-middle" data-container="body" data-toggle="popover" data-trigger="hover" data-html="true" data-placement="top"' +
                        ' data-content="<span class=\'f13 gray-c\'>该字段提交平台后不可修改</span>"></i></div>' +
                        '<div class="upcDocHide &{onlineNoShow}">(<a href="javascript:" id="upcBatchEditBtn" data-names="upcOrEan">批量编辑</a>)</div>' +
                        '</span></th>',
                    attrTdTypeStr: '<td class="error-box"><div class="f-red inline-block errorType" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="right" data-content="变种发布失败，请重新提交！"><i class="attach-icons">error</div></td>',
                    attrTd: '<td class="w120 minW120 maxW200 skuAttr white-space" uid="skuAttr" data-name="&{skuAttrName}" value="&{skuAttrValUc}" data-index="&{index}" data-en="&{enValue}"><!--&{skuAttrVal}--></td>',
                    upcTd: '<td class="addStrSp validformOut" uid="external_product_id" data-iptType="input">' +
                        '<input class="form-component attrAddIpt" name="identifierCode" type="text"' +
                        ' maxlength="20" datatype="skuUpc" nullmsg="请填写EAN" errormsg="请填写EAN"/></td>',
                    colorStr: '<label class="color-item items"><input type="checkbox" value="&{attrNameStr}" /><span &{fontColor} style="background: &{bgColor}">&{attrName}</span></label>',
                    sizeStr: '<label class="size-item items"><input type="checkbox" value="&{attrNameStr}">&{attrName}</label>',
                    changeCon: '<div class="change-con changeCon">' +
                        '<input class="form-component w170 changeIpt" type="text" maxlength="14" onblur="PDDKJ_PRODUCT_FN.skuFn.singleEditSaveBefore(this);" />' +
                        '<span><span class="attach-icons md-18 icon-save btnSave" title="保存">save</span>' +
                        '<span class="attach-icons md-18 btnClose" title="取消">close</span></span></div>',
                    shopPriceTd: '<td class="f-left">' +
                        '<div class="validformOut"><div class="input-group">' +
                        '<input class="form-control p-right25 sameVarinatIpt" name="shopPrice" type="text" value="" placeholder="店铺价格" data-shopid="&{shopId}" data-pricemin="&{priceMin}" data-pricemax="&{priceMax}" formtype="shopPrice" datatype="shopPrice" oninput="PDDKJ_PRODUCT_FN.skuFn.shopPriceInputFn(this);">' +
                        '<span class="input-group-addon">&{currency}</span>' +
                        '</div>&{sameVarinatStr}</div>' +
                        '<div class="gray-c discountPrice" data-shopid="&{shopId}" data-type=""></div></td>',
                    sameVarliAll: '<li><a href="javascript:" data-name="all" data-value="" onclick="PDDKJ_PRODUCT_FN.skuFn.sameVariantUse(this)">应用到全部</a></li>',
                    sameVarliItem: '<li><a href="javascript:" data-name="&{varitNameUc}" onclick="PDDKJ_PRODUCT_FN.skuFn.sameVariantUse(this)">应用到同&{varitName}</a></li>',
    
                    skuImgTh: '<th class="img" style="width:80px">' +
                        '<div><span class="f-red">*</span>预览图</div><div class="btn-dropdown dropdown"><div class="&{onlineNoShow}">(<a href="javascript:">批量<span class="caret"></span></a>)</div>' +
                        '<ul class="menu dropdown-menu minW140">' +
                        '<li><a href="javascript:" onclick="IMG_BATCH_ENLARGE.imgBatchEnlarge(this, \'imgList\');">查看大图</a></li>' +
                        '<li><a href="javascript:" onclick="IMGRESIZE.modalBuild(\'skuInfoTable\', PDDKJ_PRODUCT_FN.skuFn.resizecall, \'.tuiImageBox\');">批量改图片尺寸</a></li>' +
                        '<li><a href="javascript:" onclick="TOAST_IMAGE_EDITOR.onBatchEditImage(\'.variImgEnlargeOut\',  \'.tuiImageBox\', null, true);">批量编辑</a></li>' +
                        '<li class="rightAnchorEnd"><a class="inline-block" href="javascript:" onclick="ALIYUN_TRANSLATE.batchImgTranslate(\'.skuInfoTable\');">图片翻译</a>' +
                        '<p class="inline-block pLeft10 pointer" style="white-space: nowrap;" onclick="ADVANCED_TRANSLATE.openShopModal(\'18\')">' +
                        '<i class="attach-icons f18 v-middle getTranslateWordsNumIcon" style="color: #aaaaaa;" data-type="true" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="" img></i></p></li>' +
                        '<li class="dropdown-submenu selCustomTagsBoxNew">' +
                        '<a class="removefromcart dropdownSubmenuA selCustomTagsBtnNew" href="javascript:">添加水印<span class="myjCaretRight" style="margin-top:3px;color:#999;"></span></a>' +
                        '<ul class="dropdown-menu batch-add-watermark p0" id="addWatermarkNew1" style="overflow-y: auto;max-height: 250px;"></ul></li>' +
                        '<li><a href="javascript:" onclick="PDDKJ_PRODUCT_IMAGE_UP.imageFn.openClearVariAttrImg(this);">清空图片</a></li></ul></div></th>',
                    skuImgTd: '<td class="img tuiImageEditorBox">' +
                        '<div class="img-out btn-dropdown">' +
                        '<img class="img-css imgCss tuiImageBox" referrerpolicy="no-referrer" src="../static/img/addImg.jpg" data-type="skuImg" name="image"/>' +
                        '<a class="hide remove-sku-img removeSkuImgBtn" onclick="PDDKJ_PRODUCT_IMAGE_UP.imageFn.deleteSkuImg(this);" href="javascript:"></a>' +
                        '<ul class="menu" role="menu" aria-labelledby="dropdownMenu2">' +
                        '<li role="presentation" class="default operatingTitle hide">更换图片</li>' +
                        '<li><a href="javascript:" onclick="PDDKJ_PRODUCT_IMAGE_UP.imageFn.uploadImg(1, this);">本地图片</a></li>' +
                        '<li><a href="javascript:" onclick="PDDKJ_PRODUCT_IMAGE_UP.imageFn.uploadImg(3, this);">空间图片</a></li>' +
                        '<li><a href="javascript:" onclick="PDDKJ_PRODUCT_IMAGE_UP.imageFn.uploadImg(2, this);">网络图片</a></li>' +
                        '<li><a href="javascript:" onclick="PDDKJ_PRODUCT_IMAGE_UP.imageFn.uploadImg(6, this);">引用产品轮播图</a></li>' +
                        '<li><a href="javascript:" onclick="PDDKJ_PRODUCT_IMAGE_UP.imageFn.uploadImg(7, this);">引用采集图片</a></li>' +
                        '<li role="presentation" class="default operatingTitle hide">图片应用到</li>' +
                        '&{themeStr}' +
                        '<li role="presentation" class="default operatingTitle hide">图片编辑</li>' +
                        '<li class="tuiImageEditorCheckLi hide"><a class="tuiImageEditorCheck" href="javascript:" data-isUseNewImg="1" data-name="imgEditor">小秘美图</a></li>' +
                        // '<li class="tuiImageEditorCheckLi hide"><a href="javascript:" class="tuiImageEditorCheck" data-isUseNewImg="1">在线美图</a></li>' +
                        '</ul></div>' +
                        '</td>',
                    proGroupInput: $('#productGroupInputHtml').html()
                },
                isClick: false,
                priceLimit: {},
                isInitState: false,//是否是初始化回显时的状态
                isShowDataState: false,
                joinStr: '&-&',    // 分隔符
                isInitCagegory: false,
                initIsShowThem: true,//初始化的时候如果有变种主题的回显数据，则需要显示，否则不显示
                isStop: false, //变种是否过多需要拦截后面的程序
                url: {
                    productUrl: 'pddkjProduct', //请求产品的接口前缀，是pddkj的全球产品还是站点产品
                    categoryUrl: 'pddkjCategory' //请求分类的接口前缀，是pddkj的全球产品还是站点产品
                },
                sizeCategoryObj: {},
                customeThemeSizeState: false,//非服装类目时，如果没有选择尺码，创建尺码表则显示“无规格默认尺码”列，对应尺码用size代替
                skuHistoryData: null,//切换分类的时候，先存下上一次的操作数据，切换完后需要拿来回显,如果是对不上的就强对应
                themeList: [], //临时存储下变种主题名称
                sizeChartIdObj: { 11: 'sizeChartsMen', 12: 'sizeChartsWomen', 13: 'sizeChartsGirls', 107: 'sizeChartsBoys' },     // 11是男鞋 12是女鞋 13、107是童鞋
                sizeChartIdDoubleObj: { 11: 'sizeChartsMenDouble', 12: 'sizeChartsWomenDouble', 13: 'sizeChartsGirlsDouble', 107: 'sizeChartsBoysDouble' },     // 11是男鞋 12是女鞋 13、107是童鞋
                sizeChartDataObj: {},     // 11是男鞋 12是女鞋 13是女童鞋、107是男童鞋
                sizeChartDoubleDataObj: {},     // 11是男鞋 12是女鞋 13是女童鞋、107是男童鞋
                countrySizeObj: { 2: 'euSize', 4: 'ukSize', 6: 'usSize', 20: 'jpSize', 21: 'krSize', 9: 'mxSize', 8: 'brSize', 28: 'clSize', 54: 'coSize' },   // 2是欧码 4是英码 6是美码 20是日本码 21是韩国码 9是墨西哥码 8是巴西码
                sizeRangeObj: { 2: 'eurange', 4: 'ukrange', 6: 'usrange', 20: 'jprange', 21: 'krrange', 9: 'mxrange', 8: 'brrange', 28: 'clrange', 54: 'corange' },   // 2是欧码 4是英码 6是美码 20是日本码 21是韩国码 9是墨西哥码 8是巴西码
                sizeChartsMen: {},
                sizeChartsWomen: {},
                sizeChartsGirls: {},
                sizeChartsBoys: {},
                sizeChartsMenDouble: {},
                sizeChartsWomenDouble: {},
                sizeChartsGirlsDouble: {},
                sizeChartsBoysDouble: {},
                isDraftFirstChangeCategory: false,
                brandInfo: [], // 品牌数据
                priceUnitObj: {
                    USD: '$',
                    CNY: '¥',
                    // JPY: '￥',
                    CAD: 'CA$',
                    GBP: '£',
                    AUD: 'AU$',
                    EUR: '€',
                    MXN: 'MX$',
                    PLN: 'zł',
                    SEK: 'kr',
                    CHF: 'CHF',
                    KRW: '₩',
                    SAR: 'SAR',
                    SGD: 'S$',
                    AED: 'AED',
                    // KWD
                    NOK: 'kr',
                    // CLP:'CLP$',
                    MYR: 'RM',
                    PHP: '₱',
                    TWD: 'NT$',
                    THB: '฿',
                    QAR: 'QAR',
                    // JOD:'JOD',
                    BRL: 'R$',
                    // OMR:'OMR',
                    // BHD:'BHD',
                    ILS: '₪',
                    ZAR: 'R',
                    CZK: 'Kč',
                    HUF: 'Ft',
                    DKK: 'kr.',
                    RON: 'Lei',
                    BGN: 'лв.',
                    HKD: 'HK$',
                    COP: '$',
                    GEL: '₾'
                },
                saveState: false,//保存状态,如果点击了保存，在调用保存接口前置为true，防止重复提交请求
            },
            productFn = {
                attrData: {},
                attrTr: '<tr><td class="attr-name attrName w200 v-top"></td><td class="attr-val attrVal validformOut"></td></tr>',
                textIpt: '<input class="form-component" type="text"/>',
                timeIpt: '<div class="date-picker-box w250"> <i class="iconfont icon_calendar date-picker-calendar">' +
                    '</i><input class="form-component date-picker-ipt screenTimeData" name="reservation" id="" type="text" placeholder="请选择日期" data-startTime="" data-endTime=""/>' +
                    '<i class="iconfont icon_close date-picker-clear" rol="dateClear"></i>' +
                    '</div>',
                // numberIpt: '<input class="form-component" oninput="clearMistakeNumber(this)" type="text"/>',
                // floatIpt: '<input class="form-component" oninput="clearNoNumAndMinus(this)" type="text"/>',
                // timeIpt: '<input class="form-component Wdate" data-type="timeIpt" onclick="WdatePicker(WdatePicker({skin:\'whyGreen\',dateFmt: \'yyyy-MM-dd\'}))" type="text"/>',
                combobox: '<div class="combobox-out comboboxOut"></div>',
                select: '<div class="inline-block w250 commSelectBox v-middle"><div class="sel-group w-full">' +
                    '<input class="menuContentValueBox" type="hidden" /><input class="menuContentValueDataList" type="hidden" value="" />' +
                    '<input class="form-component ipt-normal w-full menuContentShowBox" type="text" readonly placeholder="请选择" />' +
                    '<i class="iconfont icon_down icons-last-icon"></i></div></div>',
                checkbox: '<label class="m-right20 maxW150"><input class="m-right5 proAttrCheckbox" type="checkbox" />' +
                    '<span class="checkboxName inline-block v-middle no-new-line w130"></span></label>',
                option: '<option></option>',
                $productAttrShow: $('#productAttribute'),
    
                init: function () {
                    var $productTitle = $('#productTitle'),
                        $productEnTitle = $('#productI18n'),
                        that = this;
    
                    //产品标题字符长度自动检测处理
                    that.strTesting($productTitle, 'countNum', fieldsLimit.nameMax, '.productTitleNum', true);
                    that.strTesting($productEnTitle, 'countNum', fieldsLimit.nameMax, '.productEnTitleNum', true);
    
                    //敏感类型和敏感属性回显
                    that.showSensitiveAttrData();
    
                    //产品标题字数计算及检测
                    $productTitle.off('input').on('input', function (e) {
                        that.strTesting(this, 'countNum', fieldsLimit.nameMax, '.productTitleNum', true);
                    });
    
                    $productEnTitle.off('input').on('input', function (e) {
                        that.strTesting(this, 'countNum', fieldsLimit.nameMax, '.productEnTitleNum', true);
                    });
    
                    //产品标题首字母大写事件
                    $('.productTitTextSize').off('click').on('click', function () {
                        var $productTitle = $(this).closest('.productTitleBox').find('input[type="text"]'),
                            str = $.trim($productTitle.val());
    
                        $productTitle.val(str.wordFirstUpperCase());
                    });
    
                    //敏感属性切换时做下显示隐藏处理
                    $(D).off('click', 'input[name="sensitiveState"]').on('click', 'input[name="sensitiveState"]', function () {
                        that.sensitiveStateClick(this);
                        that.sensitiveTypeClick();
                    });
    
                    //敏感类型勾选显示或隐藏指定输入框处理
                    $(D).off('click', 'input[name="sensitiveType"]').on('click', 'input[name="sensitiveType"]', function () {
                        that.sensitiveTypeClick();
                    });
    
                    //产品货号不能为中文，只能为英文、数字和英文字符
                    $(D).off('blur', '#productNumber').on('blur', '#productNumber', function () {
                        that.strTesting($(this), 'productSku');
                    });
    
                    // todo 重写图片生成视频 暂时不支持
                },
                //敏感属性切换事件方法
                sensitiveStateClick: function (obj) {
                    var type = +$(obj).val();
    
                    $('.sensitiveStateType')[type ? 'removeClass' : 'addClass']('hide').find('input[type="checkbox"]').prop('checked', false);
                },
    
                //敏感类型点击事件处理
                sensitiveTypeClick: function () {
                    var $sensitiveStateTypeValueBox = $('#sensitiveStateTypeValueBox'),
                        $maxBatteryCapacityBox = $('#maxBatteryCapacityBox'),
                        $maxLiquidCapacityBox = $('#maxLiquidCapacityBox'),
                        $maxKnifeLengthBox = $('#maxKnifeLengthBox'),
                        $knifeAngleBox = $('#knifeAngleBox'),
                        isAllChecked = false;
    
                    $sensitiveStateTypeValueBox.find('td > div').addClass('hide');
                    $('input[name="sensitiveType"]').each(function () {
                        var type = $(this).val(),
                            state = $(this).is(':checked');
    
                        switch (type) {
                            case '140001'://液体  maxLiquidCapacity
                                $maxLiquidCapacityBox[state ? 'removeClass' : 'addClass']('hide');
                                break;
                            case '170001': //刀具 maxKnifeLength
                                $maxKnifeLengthBox[state ? 'removeClass' : 'addClass']('hide');
                                $knifeAngleBox[state ? 'removeClass' : 'addClass']('hide');
                                break;
                        }
                    });
                    //带电、闪电 maxBatteryCapacity
                    if ($('input[name="sensitiveType"][value="110001"]').is(':checked') || $('input[name="sensitiveType"][value="120001"]').is(':checked')) isAllChecked = true;
                    $maxBatteryCapacityBox[isAllChecked ? 'removeClass' : 'addClass']('hide');
                    $sensitiveStateTypeValueBox[$sensitiveStateTypeValueBox.find('div.hide').length === 3 ? 'addClass' : 'removeClass']('hide');
                },
    
                //敏感类型和敏感属性回显
                showSensitiveAttrData: function () {
                    var sensitiveAttrData = $.trim($('#sensitiveAttrData').val()),
                        hasChange = false;
                    /*
                    * 需要提交最小单位的数值
                    * 1 Wh = 1000 mWh
                    * 1 ml = 1000 uL
                    * 1 mm = 1000 um
                    * 所以*1000 大对象带K，兼容历史数据
                    * */
                    if (sensitiveAttrData) {
                        var trueSensitiveAttrData = sensitiveAttrData.split('K');
    
                        hasChange = sensitiveAttrData.indexOf('K') > -1;
                        if (hasChange) {
                            sensitiveAttrData = trueSensitiveAttrData[1] && trueSensitiveAttrData[1].split(',');
                        } else {
                            sensitiveAttrData = sensitiveAttrData.split(',');
                        }
                    }
                    if (sensitiveAttrData && sensitiveAttrData.length) {
                        this.sensitiveStateClick($('[name="sensitiveState"][value="1"]').prop('checked', true));
                        var $sensitiveType = $('input[name="sensitiveType"]');
                        $.each(sensitiveAttrData, function (i, j) {
                            var arr = j.split(':'),
                                type = arr[0],
                                val = arr.length > 1 ? arr[1] : '';
    
                            //兼容旧数据
                            if (type === '1') type = '110001';
                            if (type === '2') type = '120001';
                            if (type === '3') type = '130001';
                            if (type === '4') type = '140001';
                            if (type === '5') type = '150001';
                            if (type === '6') type = '160001';
                            if (type === '7') type = '170001';
    
                            if (hasChange) {
                                if (type !== '170001') {
                                    val = val / 1000;
                                } else {
                                    // xxx-xxx
                                    var removeVal = val && val.split('-'),
                                        length = removeVal[0] / 10,
                                        angle = removeVal[1];
    
                                    val = length + '-' + angle;
                                }
                            }
    
                            $sensitiveType.filter('[value="' + type + '"]').prop('checked', true);
                            if ((type === '110001' || type === '120001') && val) $('#maxBatteryCapacity').val(val);
                            if (type === '140001' && val) $('#maxLiquidCapacity').val(val);
                            if (type === '170001' && val) {
                                var valStr = val.split('-');
                                $('#maxKnifeLength').val(valStr[0]);
                                $('#knifeAngle').val(valStr[1]);
                            }
                        });
                    }
                    this.sensitiveTypeClick(true);
                },
    
                //轮播图展示和隐藏处理
                productCarouselImageShowOrHide: function () {
                    //分类类型： 0：非服装类类目（除鞋子类目外的其他非服装类目）  1：服装类目 2：鞋子类目 ，默认非服装类目
                    $('.productCarouselImageTr,.productNumberTr')[+$categoryType.val() === 1 ? 'addClass' : 'removeClass']('hide');
                },
    
                //字符检测
                strTesting: function (obj, type, maxNum, numObj, op) {
                    var validateA = /[\u4E00-\u9FA5]/g,//匹配中文
                        validateE = /[^\x00-\xff]/ig,    //中文和全角字符
                        validateK = /[　    ]/g, //匹配中文空格等空格 &#12288; &ensp; &emsp; &thinsp;\u00a0
                        validateI = /[^a-zA-Z0-9\.\-\(\)\s\u4E00-\u9FA5]+/ig, //判断自定义名称
                        validateL = /[\u200B\u001d]/g, //匹配去除不可见特殊字符
                        validateM = /\s/g,  //匹配空格
                        detailT = null,
                        strTestingType = true,
                        str = '';
    
                    switch (type) {
                        case 'countNum': //长度计算
                            var $obj = $(obj),
                                objVal = $obj.val(),
                                num = objVal.length,
                                $numObj = $(numObj);
                            //如果op等于true，则说明当前是标题和描述获取字符长度
    
                            if (op) {
                                //获取汉字加非汉字字符长度
                                num = $.trim(objVal).length;
                            }
                            if (numObj === '.productTitleNum' || numObj === '.productEnTitleNum') num = getZnNameLen($.trim($.trim(objVal)));
                            if (num <= maxNum) {
                                $numObj.removeClass('f-red');
                            } else {
                                $numObj.addClass('f-red');
                                strTestingType = false;
                            }
                            $numObj.html(num);
                            break;
                        case 'propertyValueDefinitionName': //服装类颜色skc自定义名称校验
                        case 'productSku'://产品货号
                        case 'variationSku': //变种列表的sku货号
                            var oldVal = $(obj).val(),
                                isOnline = dxmState !== 'online',
                                msg = '';
    
                            if (type === 'propertyValueDefinitionName') msg = 'SKC编码（货号）';
                            if (type === 'productSku') msg = '产品货号';
                            if (type === 'variationSku') msg = 'SKU货号';
                            str = oldVal.replace(validateM, ' ').replace(validateL, '');
                            //如果自定义名称中包含中文、或者长度大于20字符，或者当前是在线产品并且内容中包含特殊符号时进入
                            if ((str.match(validateE) /*|| str.length > 20*/) || (!isOnline && str.match(validateI))) {
                                $(obj).next().next().html('<span class="glyphicon glyphicon-remove-circle"></span>' + msg + '不能包含中文和中文符号');
                                strTestingType = false;
                            }
                            // 只有不是在线产品，才去除规则之外的特殊字符
                            if (isOnline && str.match(validateI)) {
                                str = str.replace(validateI, ' ');
                            }
                            if (strTestingType) $(obj).next().next().html('');
                            break;
                    }
                    return strTestingType;
                },
    
    
                /*************************产品属性生成相关方法******************************/
                /*************************产品属性生成相关方法******************************/
    
                //获取产品属性信息
                getProductAttr: function (categoryId, call, isInit) {
                    var that = this,
                        shopId = $('#shopId').val();
    
                    commonAjaxFn(comData.url.categoryUrl + '/attributeList.json', {
                        shopId: shopId,
                        categoryId: categoryId
                    }, 'json', function (data) {
                        if (data && !+data.code) {
                            $('#categoryId').val(categoryId);
                            var result = data.data || [];
                            productFn.$productAttrShow.html('');//因为品牌跟店铺有关，所以切换品牌时，需要先清空品牌数据
                            that.filterProductAttributeData(result, isInit);//过滤保存一下产品属性的数据
                            that.showProductAttribute();//产品属性结构初始化生成
                            skuFn.skuDataHandle();//变种数据处理
                            $('.productImgDiv')[comData.isHasVariation ? 'addClass' : 'removeClass']('hide');
                            $('#categoryChoose').modal('hide');
                            $('.category').html($('.categoryChooseCrumbs').html());
                            //选中下拉
                            basicsFn.getNewCategoryHistory(categoryId);
                            call && typeof call === 'function' && call();
                            if (comData.isInitState || comData.skuHistoryData) {
                                initFn.initSkuList(null, comData.isInitState ? null : comData.skuHistoryData);//确保第一次下拉的时候触发切换回显
                            }
                        } else {
                            commonMsgFn((data && data.msg) ? data.msg : '该分类不支持发布产品');
                        }
                        comData.isDraftFirstChangeCategory = false;
                    });
                },
    
                //过滤产品属性，将需要的产品属性保留下来
                filterProductAttributeData: function (data, isInit) {
                    skuFn.clearSkuAttr();//清除变种信息
                    comData.productAttributeData = [];//清空产品属性数据
                    comData.productChildAttributeData = {};//产品子属性数据，key存储父属性的下拉框内的vid，切换父属性的时候，去查找看是否有对应子属性数据
                    comData.variationData = [];//清空变种属性
                    comData.themeList = [];//清空主题集合
                    var properties = /*data.properties*/data || [],
                        categoryType = +$categoryType.val(),
                        requireAttributeArr = [],//必填产品属性集合
                        noRequireAttributeArr = [],//非必填产品属性集合
                        variationsArr = [],//变种名称集合，用于去重处理
                        attributeArr = [],//属性名称集合
                        colorThemeHistory = {//尺码和颜色如果等级一样的话，确保颜色在尺码前面，这里状态是用来判断尺码是否要往最前面放
                            index: -1,
                            state: 0
                        },
                        defaultThemeName,
                        isHasOtherCustomTheme = false,//除了一个系统主题外，是否还有另外一个自定义主题，根据系统主题自带的inputMaxSpecNum值来判断：0：没有自定义主题，1需要增加一个自定义主题
                        customThemeNum = 0;
                    if (properties && properties.length) {
                        $.each(properties, function (i, j) {
    
                            /*
                            * 因为SKU、包裹尺寸（长宽高）、UPC会在产品属性这里动态给过来，所以在展示的时候，做下过滤，单独放到下面的“价格与库存”那里展示，然后保存的时候再放到产品属性里保存
                            * */
                            var type = /*j.valueType*/'list',
                                parentSpecId = j.parentSpecId,
                                pid = j.pid,
                                refPid = j.refPid,
                                templatePid = j.templatePid,
                                // inputMaxNum = j.inputMaxNum, //输入最大值如果是0，说明不能输入自定义的，应该是下拉框
                                propertyValueType = j.propertyValueType,//属性值类型
                                // attributeId = j.attributeId,
                                attributeName = j.name,
                                chooseMaxNum = j.chooseMaxNum,
                                valueMaxLength = chooseMaxNum ? chooseMaxNum : 200,//最大限制，如果没有就用默认的200
                                values = j.values,//下拉框数据
                                valueUnit = j.valueUnit,
                                allowVariations = j.isSale,//是否是变种主题 为true是变种主题属性
                                required = j.required,
                                mainSale = j.mainSale,
                                multivalued = false,
                                controlType = j.controlType,
                                valueExtendInfo = j.valueExtendInfo ? j.valueExtendInfo : '',
                                minValue = j.minValue,
                                maxValue = j.maxValue;
    
                            if (values && values.length && typeof values === 'string') values = JSON.parse(values);
                            if (+controlType !== 16 && chooseMaxNum && chooseMaxNum > 1 && values && values.length) type = 'checkbox';//多选类型，系统多选还是自定义多选
                            if (+controlType !== 16 && (!values || !values.length)) type = 'string';//没有可选择的数据，判断为输入框框类型
                            if (+controlType === 5) type = 'timeIpt'; // 单个时间选择器 （年月日）
                            var getInputTypr = function (type, values) {
                                var inputType = 'numberIpt';
    
                                //输入框类型处理
                                switch (type) {
                                    case 'list':
                                    case 'boolean':
                                        inputType = 'select';
                                        break;
                                    case 'number':
                                    case 'number_unit':
                                        inputType = 'numberIpt';
                                        break;
                                    case 'string':
                                        inputType = (values && values.length) ? 'combobox' : 'textIpt';
                                        break;
                                    case 'checkbox':
                                        inputType = 'checkbox';
                                        break;
                                    case 'timeIpt':
                                        inputType = 'timeIpt';
                                        break;
                                }
                                return inputType;
                            };
    
                            //产品属性和变种属性数据收集及排序处理
                            //变种属性
                            if (allowVariations) {
                                //非编辑页回显状态时才做矫正，编辑页回显可能有保存过，直接去除主题数据会丢失
                                if (!isHasOtherCustomTheme && ((!comData.isShowDataState && +j.inputMaxSpecNum === 1) || comData.isShowDataState) && !comData.isDraftFirstChangeCategory) isHasOtherCustomTheme = true;
                                if (!customThemeNum && +j.inputMaxSpecNum) customThemeNum = +j.inputMaxSpecNum;//自定义主题的数量
                                if (variationsArr.indexOf(attributeName) === -1) {
                                    variationsArr.push(attributeName);
                                    if (!required && mainSale) required = true;//改成必填主题
                                    if (comData.colorArr.indexOf(attributeName.toLowerCase()) !== -1) {
                                        colorThemeHistory.index = comData.variationData.length;
                                        colorThemeHistory.state = required ? 1 : 2;//如果主题有尺码，后面是颜色主题时。判断下是不是跟它同一等级，是的话尺码主题不要放在最前面
                                    }
                                    var newData = {
                                        mainSale: mainSale,
                                        propertyValueType: propertyValueType,
                                        parentSpecId: parentSpecId,
                                        pid: pid,
                                        refPid: refPid,
                                        templatePid: templatePid,
                                        name: attributeName,
                                        valueUnit: valueUnit,
                                        values: values,
                                        required: required,
                                        valueMaxLength: valueMaxLength,
                                        multivalued: multivalued,
                                        controlType: +controlType,//类型如果是3，则该主题下的属性值需要支持自定义输入
                                    };
                                    //轮到是尺码主题时，要看前面的主题有没有颜色，有颜色如果是同一等级的话，将尺码放到颜色的后面
                                    if (colorThemeHistory.index !== -1 && comData.sizeArr.indexOf(attributeName.toLowerCase()) !== -1 && ((colorThemeHistory.state === 1 && required) || (colorThemeHistory.state === 2 && !required))) {
                                        comData.variationData.splice(colorThemeHistory.index + 1, 0, newData);
                                        comData.themeList.splice(colorThemeHistory.index + 1, 0, (attributeName).toLowerCase());//收集主题名称，回显时需要对比使用
                                    } else {
                                        //必填变种放最前面，其他非必填的插入最后面
                                        comData.variationData[required ? 'unshift' : 'push'](newData);
                                        comData.themeList[required ? 'unshift' : 'push']((attributeName).toLowerCase());//收集主题名称，回显时需要对比使用
                                    }
                                    if (parentSpecId && listStr.hasOwnProperty(parentSpecId)) {
                                        defaultThemeName = attributeName;
                                    } else {
                                        var newAttributeName = attributeName.replace('尺寸', '尺码');
                                        $.each(customThemeArray, function (i, j) {//模糊匹配到系统主题
                                            if (newAttributeName.indexOf(j) !== -1) {
                                                defaultThemeName = j;
                                                return false;
                                            }
                                        });
                                        if (!defaultThemeName && customThemeNum && parentSpecId) defaultThemeName = newAttributeName;//分类返回的主题也计入进来
                                    }
                                } else {
                                    return true;//跳过循环
                                }
                                //如果分类是非服装类，去变种属性里面看有没有颜色和尺码，如果都有才能判断是鞋子类，没有则是非服装类
                                // if (!categoryType && (attributeName === '颜色' || attributeName === 'color') && (attributeName === '尺码' || attributeName === 'size')) $categoryType.val(2);
                                if (!categoryType &&/* (attributeName === '颜色' || attributeName === 'color' || attributeName === '尺码' || attributeName === 'size') &&*/ $.trim(values).length) {
                                    $categoryType.val(2);
                                }
                            } else {//产品属性
                                if (attributeArr.indexOf(attributeName) === -1) {
                                    attributeArr.push(attributeName);
                                    var templatePropertyValueParentList = j.templatePropertyValueParent ? (typeof j.templatePropertyValueParent === 'string' ? JSON.parse(j.templatePropertyValueParent) : j.templatePropertyValueParent) : null,//子属性改字段有数据，父属性无内容
                                        showConditionList = j.showCondition ? (typeof j.showCondition === 'string' ? JSON.parse(j.showCondition) : j.showCondition) : null, //子属性改字段有数据，父属性无内容
                                        isBrand = attributeName === '品牌名',
                                        productAttrInfo = {
                                            mainSale: mainSale,
                                            propertyValueType: propertyValueType,
                                            valueType: type,
                                            inputType: getInputTypr(type, j.values),
                                            parentSpecId: parentSpecId,
                                            pid: pid,
                                            refPid: refPid,
                                            showType: j.showType,//通过父属性templatePid关联查到对应存在showType=1且parentTemplatePid= templatePid的数据，则为子属性，子属性需要先隐藏不生成（showType：0表示父属性，1表示子属性）
                                            templatePid: templatePid,
                                            parentTemplatePid: j.parentTemplatePid,//子属性需要通过这个去找到父属性
                                            templatePropertyValueParentList: templatePropertyValueParentList,
                                            attributeName: attributeName,
                                            valueUnit: valueUnit,
                                            values: j.values,
                                            valueMaxLength: valueMaxLength,
                                            required: required,
                                            controlType: controlType,//如果是16，则产品属性需要下拉却支持手动输入，手动输入暂时只支持数字
                                            chooseMaxNum: chooseMaxNum, //大于1时是多选类型，最大选择数量为chooseMaxNum的值
                                            valueExtendInfo: valueExtendInfo,
                                            minValue: minValue,
                                            maxValue: maxValue
                                        };
    
                                    if (required) {
                                        requireAttributeArr[isBrand ? 'unshift' : 'push'](productAttrInfo);
                                    } else {
                                        noRequireAttributeArr[isBrand ? 'unshift' : 'push'](productAttrInfo);
                                    }
                                    //子属性数据存储起来
                                    $.each((templatePropertyValueParentList && templatePropertyValueParentList.length) ? templatePropertyValueParentList : [], function (a, b) {
                                        var childOpArr = b.vidList || [];
                                        $.each((b.parentVidList && b.parentVidList.length) ? b.parentVidList : [], function (x, y) {
                                            var parentVid = $.trim(y);
    
                                            if (parentVid) {
                                                if (!comData.productChildAttributeData.hasOwnProperty(parentVid)) comData.productChildAttributeData[parentVid] = [];
                                                productAttrInfo.vidList = childOpArr;
                                                comData.productChildAttributeData[parentVid].push(JSON.parse(JSON.stringify(productAttrInfo)));
                                            }
                                        });
                                    });
                                    // 兼容多一个子属性字段
                                    $.each((showConditionList && showConditionList.length) ? showConditionList : [], function (a, b) {
                                        $.each((b.parentVids && b.parentVids.length) ? b.parentVids : [], function (x, y) {
                                            var parentVid = $.trim(y);
    
                                            if (parentVid) {
                                                if (!comData.productChildAttributeData.hasOwnProperty(parentVid)) comData.productChildAttributeData[parentVid] = [];
                                                productAttrInfo.vidList = [];
                                                comData.productChildAttributeData[parentVid].push(JSON.parse(JSON.stringify(productAttrInfo)));
                                            }
                                        });
                                    });
                                } else {
                                    return true;//跳过循环
                                }
                            }
                        });
                        //如果分类是非服装类，去变种属性里面看有没有颜色和尺码，如果都有才能判断是鞋子类，没有则是非服装类
                        // if (!categoryType && (variationsArr.indexOf('颜色') !== -1 || (variationsArr.indexOf('color') !== -1)) && (variationsArr.indexOf('尺码') !== -1 || (variationsArr.indexOf('size') !== -1))) $categoryType.val(2);
                    }
                    //这块处理介于有系统推荐主题和自定义主题的分类产品的回显
                    comData.newSkuVariation = [];
    
                    /*
                    * 这里做下兼容，如果是已保存过的，编辑回显先展示出来，加个提示，让用户自己去移除该无效的自定义主题，而不是我们回显的时候直接就清掉了数据；
                    * 但是如果是采集箱强对或者切分类时的操作，则根据接口返回inputMaxSpecNum字段是否为1来判断展示还是去除
                    * */
                    if (isHasOtherCustomTheme && defaultThemeName && comData.themeList.length === 1) {
                        var parentSpecName,
                            parentSpecId;
    
                        if (isInit) {
                            var optionValue = $('#pddkjVariation').attr('data-optionvalue');
    
                            if (optionValue && typeof optionValue === 'string') optionValue = JSON.parse(optionValue);
                            if (optionValue && typeof optionValue === 'object' && !isEmptyObject(optionValue)) {
                                $.each(optionValue, function (key, obj) {
                                    var newAttributeName = key.replace('尺寸', '尺码');
                                    if (defaultThemeName !== key && customThemeArray.indexOf(key) !== -1) {
                                        parentSpecName = key;
                                        parentSpecId = customThemeData[customThemeArray.indexOf(key)][key];
                                    }
                                    //兼容新增主题，但是历史数据下该分类没有该主题的情况
                                    if (customThemeNum === 1 && !parentSpecName) {
                                        if (newAttributeName.indexOf('颜色') !== -1) {
                                            parentSpecName = customThemeArray[1];//尺码
                                        }
                                        if (newAttributeName.indexOf('尺码') !== -1) {
                                            parentSpecName = customThemeArray[0];//颜色
                                        }
                                        parentSpecId = parentSpecName === '颜色' ? 1001 : 3001;
                                    }
                                });
                            }
                        } else {
                            parentSpecName = customThemeArray[defaultThemeName === customThemeArray[0] ? 1 : 0];
                            parentSpecId = parentSpecName === '颜色' ? 1001 : 3001;
                        }
    
                        if (parentSpecName && parentSpecId) {
                            comData.newSkuVariation.push({
                                parentSpecName: parentSpecName,
                                parentSpecId: parentSpecId,
                                listOptionList: [],
                                customThemeNum: customThemeNum
                            });//另外一个自定义主题按顺序取
                        }
                    }
                    if (!+$categoryType.val() || comData.newSkuVariation.length) {//如果是非服装类，取下自定义主题信息
                        $.each(listStr, function (x, j) {
                            var listObj = {
                                parentSpecId: x,
                                parentSpecName: j
                            };
    
                            !+$categoryType.val() ? comData.variationData.push(listObj) : comData.newSkuVariation[0].listOptionList.push(listObj);
                        });
                    }
                    comData.productAttributeData = requireAttributeArr.concat(noRequireAttributeArr);//合并数组，将必填属性放在数组前面，非必填属性排后面
                    comData.isHasVariation = comData.variationData.length > 0;//是否有变种主题
                    showOrHideNodeByCategoryType();//更新完分类类型后再做显示和隐藏处理
                },
    
                //产品属性显示处理
                showProductAttribute: function () {
                    var that = this,
                        $productAttribute = that.$productAttrShow,
                        proAttrData = comData.productAttributeData,//产品属性数据
                        $table = $('<table></table>'),
                        $trArr = [];
    
                    $productAttribute.html('').closest('tr').removeClass('hide');
                    if (proAttrData && proAttrData.length) {
                        $.each(proAttrData, function (i, j) {
                            $trArr.push(that.attrHtmlBuild(j));
                            // that.attrData['id' + j.attributeId] = j;
                        });
                        $productAttribute.html($table.html($trArr));
    
                        //添加展开查看非必填属性的按钮
                        if ($productAttribute.find('tr[data-required="false"]').length && !$productAttribute.find('#otherAttrShowBox').length) {
                            $productAttribute.find('tbody').append('<tr id="otherAttrShowBox"><td class="f-right" colspan="2">' +
                                '<a id="otherAttrShowAndHide" href="javascript:" data-type="close">+展开</a></td></tr>');
                            that.initClickOpenAttribute();
                        }
                        //如果没有一条是必填属性，则把第一条产品属性显示出来，并且在发布的时候还要再验证下，产品属性不能为空，哪怕是没有必填属性也要填一个
                        if (!$productAttribute.find('tr[data-required="true"]').length) {
                            $productAttribute.find('tr[data-required="false"]').eq(0).removeClass('hide');
                        }
    
                        //必填加验证提示处理
                        $productAttribute.find('td.attrName').each(function () {
                            var $tr = $(this).closest('tr'),
                                required = $tr.attr('data-required');
    
                            if (!required || required === 'false') return true;//如果是未必填属性，则跳过循环
    
                            var type = $tr.attr('data-htmltype'),
                                errorMsg = '请' + ((type === 'textIpt' || type === 'numberIpt') ? '输入' : '选择') + '产品属性';
    
                            $tr.find('.attrVal .menuContentShowBox:not(".attributeUnit"),.attrVal input:text:not(".otherCheckboxIpt")').attr({
                                formId: 'form',
                                formtype: 'must',
                                datatype: 'none',
                                nullmsg: errorMsg,
                                errormsg: errorMsg
                            });
                        });
                        // 注册下拉搜索组件
                        $productAttribute.find('.commSelectBox').each(function (selectIndex, selectItem) {
                            var $selectItem = $(selectItem),
                                valueStr = $selectItem.find('.menuContentValueDataList').val(),
                                valueArr = valueStr ? JSON.parse(valueStr) : [];
    
                            $selectItem.selectMenu({
                                data: valueArr, //下拉选项数据
                                clickCall: function (content, $iptObj) {
                                    var $tr = $iptObj.closest('tr');
    
                                    if (+$tr.attr('data-isHasChild')) PDDKJ_PRODUCT_FN.productFn.productParentAttrChange($iptObj, $tr.hasClass('hide')); //添加子属性下拉框切换方法
                                }
                            });
                        });
                        $productAttribute.find('tr[data-ishaschild="1"]').each(function (i, j) {
                            PDDKJ_PRODUCT_FN.productFn.productParentAttrChange($(j).find('.menuContentShowBox'), $(j).hasClass('hide'));
                        });
                        // $productAttribute.find('tr[attrid="brand"] .commSelectBox').removeClass('v-top');
                        $productAttribute.find('tr[data-selectinput="1"]').each(function () {
                            var tipHtml = '<i class="iconfont icon_help_outline"' +
                                ' data-container="body" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true"' +
                                ' data-content="<div class=\'w330\'>所有成分比例之和需等于100%</div>"></i>';
                            $(this).find('td.attrName').append(tipHtml);
                            $(this).find('td.attrVal').append(comData.html.proGroupInput);
                        });
                        // 注册时间单个选择器
                        $('.screenTimeData').daterangepicker({
                            format: 'YYYY-MM-DD', //date/time格式
                            separator: ' - ', //分隔符
                            singleDatePicker: true //是否是单个时间选择器
                        });
                        if (dxmState === 'online') $productAttribute.find('input,select').prop('disabled', true);
                        that.initProductClickHandle();
                    } else {//如果没有产品属性则不展示
                        $productAttribute.closest('tr').addClass('hide');
                    }
                },
    
                //产品属性操作事件相关部分处理
                initProductClickHandle: function () {
                    var that = this;
    
                    //产品属性多选类型超过指定的限制数量时，拦截报错
                    $(D).off('click', '#productAttribute input.proAttrCheckbox').on('click', '#productAttribute input.proAttrCheckbox', function () {
                        var $tr = $(this).closest('tr'),
                            maxCheckNum = $tr.attr('data-max'),
                            $checkedInput = $tr.find('input[type="checkbox"]:checked');
    
                        if ($checkedInput.length > +maxCheckNum) {
                            $(this).prop('checked', false);
                            MYJ.message.error('最多勾选' + maxCheckNum + '个产品属性');
                        }
                        var vid = $(this).val();
                        if (vid && !isEmptyObject(comData.productChildAttributeData) && comData.productChildAttributeData.hasOwnProperty(vid)) PDDKJ_PRODUCT_FN.productFn.productParentAttrChange($(this), $tr.hasClass('hide') || !$(this).prop('checked')); //添加子属性下拉框切换方法
                    });
                    $(D).off('click', '.productAddBtn').on('click', '.productAddBtn', function () {
                        that.addSelectProductArr(this);
                    });
    
                    $(D).off('click', '.productRemoveBtn').on('click', '.productRemoveBtn', function () {
                        commonEmptyDomFn($(this).closest('tr'));
                    });
                },
    
                //下拉类型的产品属性添加事件方法封装
                addSelectProductArr: function (obj) {
                    var $tr = $(obj).closest('tr'),
                        pid = $tr.attr('pid'),
                        refpid = $tr.attr('refpid'),
                        isHasChild = +$tr.attr('data-isHasChild'),
                        selectinput = +$tr.attr('data-selectinput'),
                        dataStr = $tr.find('.menuContentValueDataList').val(),
                        dataArr = dataStr ? JSON.parse(dataStr) : [];
    
                    //根据option数量限定可添加的个数
                    if (productFn.$productAttrShow.find('tr[pid="' + pid + '"][refpid="' + refpid + '"]').length < +$tr.attr('data-opnum')) {
                        var $cloneTr = $tr.clone();
    
                        $cloneTr.removeAttr('data-name data-state');
                        $cloneTr.find('.attrName').html('').end().find('.attrVal').html(this.select);
                        if (selectinput) $cloneTr.find('td.attrVal').append(comData.html.proGroupInput);
                        // commonEmptyDomFn($cloneTr.find('.chosen-container'));
    
                        $cloneTr.addClass('addAttrTr').find('.productRemoveBtn').removeClass('hide');
                        $cloneTr.find('.menuContentValueDataList').val(dataStr);
                        productFn.$productAttrShow.find('tr[pid="' + pid + '"][refpid="' + refpid + '"]').last().after($cloneTr);
                        $cloneTr.find('.commSelectBox').selectMenu({//注册插件
                            data: dataArr,
                            clickCall: function (content, $iptObj) {
                                var $tr = $iptObj.closest('tr');
    
                                if (+$tr.attr('data-isHasChild')) PDDKJ_PRODUCT_FN.productFn.productParentAttrChange($iptObj, $tr.hasClass('hide')); //添加子属性下拉框切换方法
                            }
                        });
                    }
                },
    
                //产品属性非必填属性展开、收起事件
                initClickOpenAttribute: function () {
                    var that = this;
    
                    $(D).off('click', '#otherAttrShowAndHide').on('click', '#otherAttrShowAndHide', function () {
                        var $this = $(this),
                            type = $this.attr('data-type'),
                            isOpen = type === 'open',
                            $brand = that.$productAttrShow.find('tr[refpid="1960"]'),
                            $peopleTr = that.$productAttrShow.find('tr[refpid="115"]'),
                            $hideProAttributeTr = that.$productAttrShow.find('tr[data-required="false"]').not('.childHideTr');
    
                        $this.attr('data-type', isOpen ? 'close' : 'open').text(isOpen ? '+展开' : '-收起');
                        $hideProAttributeTr[isOpen ? 'addClass' : 'removeClass']('hide');
                        $brand.removeClass('hide'); // 品牌保持展示
                        $peopleTr.removeClass('hide'); // 适用人群保持展示
                    });
                },
    
                //判断单条属性类型
                getAttrType: function (data) {
                    var isCustomized = data.isCustomized,   // 是否支持自定义
                        isMultipleSelected = data.isMultipleSelected,   // 是否支持多选
                        isHasValues = data.values ? JSON.parse(data.values) : [],   // 是否有可选项
                        type;
                    if (+isMultipleSelected) {
                        if (+isCustomized) {
                            type = 'checkboxOther'; // 多选框可自定义
                        } else {
                            type = 'checkbox';      // 多选框不可自定义
                        }
                    } else {
                        if (+isCustomized) {
                            type = isHasValues.length ? 'combobox' : 'textIpt';     // 单选框可自定义or自定义字段
                        } else {
                            type = 'select';        // 单选框不可自定义
                        }
                    }
                    return type;
                },
    
                //生成产品属性的单位下拉框
                createAttributeUnitHtml: function (attributeUnit) {
                    var option = '<option value="">-- 请选择 --</option>',
                        options = '<option value="&{value}">&{html}</option>';
    
                    attributeUnit = JSON.parse(attributeUnit);
                    $.each(attributeUnit, function (i, j) {
                        option += options.format({
                            value: j,
                            html: j
                        });
                    });
                    return '<select class="form-component m-left10 w150 attributeUnit"' +
                        ' datatype="attrUnit" nullmsg="请选择产品属性" errormsg="请选择产品属性">' + option + '</select>';
                },
    
                //生成单条属性
                attrHtmlBuild: function (data) {
                    var that = this,
                        // type = that.getAttrType(data),
                        attributeName = data.attributeName,//属性中文名
                        isBrand = attributeName === '品牌名', // 是否为品牌
                        isPeople = +data.refPid === 115, // 是否为适用人群，该产品属性需要特殊处理
                        inputType = isBrand ? 'select' : data.inputType,
                        valueType = /*data.inputValidationType*/data.valueType,
                        valueMaxLength = data.valueMaxLength,
                        $str = $(that.attrTr),
                        attrInputHtml = inputType !== 'checkbox' ? that[inputType].format({ maxlength: valueMaxLength ? ('maxlength="' + valueMaxLength + '"') : '' }) : '',
                        required = data.required,
                        unitArr = (data.valueUnit && data.valueUnit.length) ? (typeof data.valueUnit === 'string' ? JSON.parse(data.valueUnit) : data.valueUnit) : [],
                        valueUnit = (unitArr && unitArr.length) ? unitArr[0] : '',
                        isSelectInput = (data.controlType && +data.controlType === 16),//是否是下拉和手动输入组合的类型
                        showType = +data.showType,//showType如果是0则表示要先直接展示的父属性，1则为子属性，需要先隐藏，待切换到指定父属性的内容值时再显示出来
                        minValue = +data.minValue,
                        maxValue = +data.maxValue,
                        attrNameHtml = '';
    
                    if (required) {
                        $str.find('td.attrVal').addClass('validformOut');
                        attrNameHtml += '<span class="f-red">*</span>';
                    } else if (!isBrand && !isPeople) {
                        // 品牌不隐藏
                        $str.addClass('hide');
                    }
                    attrNameHtml += '<span class="dataName">' + attributeName + '</span>';
                    $str.find('.attrName').html(attrNameHtml);
    
                    if (valueUnit && inputType === 'textIpt') {
                        //增加一个单位来展示
                        var unitStr = '';
    
                        if (unitArr && Array.isArray(unitArr) && unitArr.length) {
                            $.each(unitArr, function (unitIndex, unitValue) {
                                unitStr += '<option value="' + unitValue + '">' + unitValue + '</option>';
                            })
                        }
                        attrInputHtml += '<select class="w100 attrUnitSelect">' + unitStr + '</select>';
                    }
    
                    if (isBrand) {
                        attrInputHtml += '<a href="javascript:" onclick="PDDKJ_PRODUCT_FN.productFn.syncBrand(this);" class="m-left12">同步</a>';
                    }
    
                    $str.data('attrData', data);
                    $str.attr({
                        'pid': data.pid,
                        'refpid': data.refPid,
                        'data-name': attributeName,
                        'data-parentSpecId': data.parentSpecId,
                        'data-htmltype': inputType,
                        'data-required': required,
                        'templatepid': data.templatePid,
                        'unit': valueUnit,
                        'data-show': showType,
                        'parentTemplatePid': data.parentTemplatePid
                    }).find('.attrVal').html(attrInputHtml);
    
                    if (!isBrand) {
                        if (inputType === 'select') {//list和radio时
                            var dataArr = [{
                                value: '',
                                dataName: '',
                                name: '-- 请选择 --'
                            }],
                                isHasChild = +!showType,
                                valuesArr = data.values ? data.values : [];
    
                            if (valuesArr && typeof valuesArr === 'string') valuesArr = JSON.parse(valuesArr);
                            if (valuesArr.length) {//下拉数据
                                $.each(valuesArr, function (i, j) {
                                    var attrName = j['value'];
    
                                    if (!attrName) return;
                                    dataArr.push({
                                        value: j['vid'],
                                        name: attrName,
                                        attrName: attrName,
                                        metadata: valueType === 'boolean' ? (attrName === 'No' ? 'false' : 'true') : ''
                                    });
                                    // 判断是否为父属性
                                    if (comData.productChildAttributeData && comData.productChildAttributeData.hasOwnProperty(j['vid'])) {
                                        isHasChild = 1;
                                    }
                                });
                                $str.attr('data-opnum', valuesArr.length);
                            }
                            $str.attr({ 'data-selectinput': isSelectInput ? '1' : '0', 'data-isHasChild': isHasChild }).find('.menuContentValueDataList').val(JSON.stringify(dataArr));
                        } else if (inputType === 'combobox') {
                            var arr = [];
    
                            if (data.values) {
                                $.each(JSON.parse(data.values), function (i, j) {
                                    arr.push({
                                        id: j['vid'],
                                        val: j['value'],
                                        name: j['value'],
                                        metadata: valueType === 'boolean' ? (j['value'] === 'No' ? 'false' : 'true') : ''
                                    });
                                });
                            }
                            $str.find('.attrVal .comboboxOut').combobox(arr, { type: true });
                        } else if (inputType === 'checkbox') {
                            var checkboxHtml = [];
    
                            if (data.values) {
                                $.each(typeof data.values === 'string' ? JSON.parse(data.values) : (data.values ? data.values : []), function (i, j) {
                                    var $checkbox = $(that.checkbox);
    
                                    $checkbox.find('.proAttrCheckbox').val(j['vid']);
                                    $checkbox.find('.checkboxName').attr({
                                        'data-name': j['value'],
                                        'title': j['value']
                                    }).text(j['value']);
                                    checkboxHtml.push($checkbox);
                                });
                                $str.attr('data-max', data.chooseMaxNum ? data.chooseMaxNum : 0).find('.attrVal').html('<div class="max-h200 p-left10 m-right10 flex attrValueIptBox" style="overflow: auto;"></div>');
                                $str.find('.attrValueIptBox').html(checkboxHtml);
                            }
                        } else if (inputType === 'textIpt') {//输入框类型
                            if (maxValue) $str.find('input[type="text"]').attr({ 'data-max': maxValue, 'data-min': minValue }).attr('maxlength', maxValue);
                        }
                    } else {
                        var dataArr = [{
                            value: '',
                            dataName: '',
                            name: '-- 请选择 --'
                        }],
                            valuesArr = comData.brandInfo;
    
                        if (valuesArr && valuesArr.length) {//下拉数据
                            $.each(valuesArr, function (i, j) {
                                var attrName = j['brandNameEn'];
    
                                if (!attrName) return;
                                dataArr.push({
                                    value: j['vid'],
                                    name: attrName,
                                    attrName: attrName,
                                    metadata: ''
                                });
                            });
                            $str.attr('data-opnum', valuesArr.length);
                        }
                        $str.attr({ 'data-selectinput': '0', 'data-isHasChild': 1 }).find('.menuContentValueDataList').val(JSON.stringify(dataArr));
                    }
    
    
                    if (valueType === 'number_unit' && data.values) {//处理单位
                        $str.find('.attrVal').append(that.createAttributeUnitHtml(data));
                    }
                    if (showType === 1) $str.addClass('hide');//隐藏子属性
                    return $str;
                },
    
                // 不能为负值，2位小数,上限100
                replaceAddSub: function (obj) {
                    var $obj = $(obj);
                    clearNoNumAndMinus(obj);
                    if (+$obj.val() > 100) $obj.val('100');
                },
    
                //产品父属性切换时调用的方法,如果本身是隐藏的，则走了切换逻辑后也不能显示出来isHide
                productParentAttrChange: function (obj, isHide) {
                    var $obj = $(obj),
                        $tr = $obj.closest('tr'),
                        isAddAttr = $tr.hasClass('addAttrTr'),
                        htmlType = $tr.attr('data-htmltype'),
                        isCheckBox = htmlType === 'checkbox',
                        vid = isCheckBox ? $obj.val() : $obj.attr('data-value'),
                        currentTemplatepId = $tr.attr('templatepid'),
                        currentPid = $tr.attr('pid'),
                        currentRepid = $tr.attr('refpid'),
                        $childAttrTrAll = this.$productAttrShow.find('tr[parenttemplatepid="' + currentTemplatepId + '"][data-show="1"]'),
                        $otherTr = $tr.siblings('tr[pid="' + currentPid + '"][refpid="' + currentRepid + '"][templatepid="' + currentTemplatepId + '"]');
    
                    // 如果是新添加的，可能会跟上一个互斥，上一个属性要展示的话，那这个属性哪怕是隐藏也不能隐藏
                    if (isAddAttr && $childAttrTrAll.not('.hide').length && $otherTr.length) {
                        $otherTr.each(function () {
                            var vidNew = $(this).find('.menuContentValueBox').val();
                            if (vidNew && !isEmptyObject(comData.productChildAttributeData) && comData.productChildAttributeData.hasOwnProperty(vidNew)) {
                                $.each(comData.productChildAttributeData[vidNew], function (i, j) {
                                    var pid = j.pid,
                                        templatePid = j.templatePid,
                                        $childAttrTr = $childAttrTrAll.filter('[pid="' + pid + '"][templatepid="' + templatePid + '"]');
    
                                    if ($childAttrTr.length) {
                                        $childAttrTr.addClass('noHide');//加标识
                                        $.each(j.vidList || [], function (x, y) {
                                            $childAttrTr.find('li.menuListLi[data-value="' + y + '"]').addClass('childNoHide');//加标识
                                        });
                                    }
                                });
                            }
                        });
                        $childAttrTrAll = this.$productAttrShow.find('tr[parenttemplatepid="' + currentTemplatepId + '"][data-show="1"]').not('.noHide');
                    }
                    $childAttrTrAll.addClass('hide childHideTr');
                    if (vid && !isEmptyObject(comData.productChildAttributeData) && comData.productChildAttributeData.hasOwnProperty(vid)) {
                        $.each(comData.productChildAttributeData[vid], function (i, j) {
                            var pid = j.pid,
                                templatePid = j.templatePid,
                                $childAttrTr = $childAttrTrAll.filter('[pid="' + pid + '"][templatepid="' + templatePid + '"]');
    
                            if ($childAttrTr.length) {
                                $childAttrTr.find('li.menuListLi[data-value!=""]').not('.childNoHide').addClass('hide child-hide');//为了避免被下拉搜索插件干扰，这里用child-hide做标记，防止将需要隐藏的内容展示处理
                                $.each(j.vidList || [], function (x, y) {
                                    $childAttrTr.find('li.menuListLi[data-value="' + y + '"]').removeClass('hide child-hide');//找到相对应的节点再显示出来
                                });
                                $tr.after($childAttrTr.removeClass(isHide ? 'childHideTr' : 'hide childHideTr'));
                                $childAttrTr.find('.menuContentValueBox').trigger('selectMenu:update');//注册插件
                            }
                        });
                    }
                },
    
                // 编辑时调用回填方法
                pddkjDataPush: function () {
                    var submitData = $('#productDataStr').val();
                    try {
                        submitData = JSON.parse(submitData || '{}');
                    } catch (e) {
                        submitData = JSON.parse('{}');
                    }
                    if (!isEmptyObject(submitData)) this.setSubmitData(submitData);
                },
    
                // 属性回填
                setSubmitData: function (data) {
                    if (data) {
                        var attrIdObj = {};
                        $commDom.productAttrShow = $('#productAttribute');
                        $.each(data, function (i, j) {
                            if (j.attributeId && attrIdObj[j.attributeId]) return;
                            attrIdObj[j.attributeId] = true;
                            var $tr = $commDom.productAttrShow.find('tr[attrId="' + j.attributeId + '"]');
                            if ($tr.length) {
                                var type = $tr.attr('data-htmlType'),
                                    valueList = j['values'],
                                    isValueLen = valueList && valueList.length,
                                    valueId = isValueLen ? valueList[0]['valueId'] : '',
                                    value = isValueLen ? valueList[0]['valueName'] : '';
                                if (type === 'select') {
                                    // 循环所有下拉框的option选项，这里可能会有多个下拉框
                                    $.each($tr.find('select:first'), function (k, l) {
                                        $.each($(l).find('option'), function () {
                                            if ((valueId && $(this).val() === ('' + valueId)) || (value && ucToStr($(this).attr('data-name')) === value)) {
                                                //选中当前下拉框选项
                                                $(this).prop('selected', true);
                                                return false;
                                            }
                                        });
                                    });
                                } else if (type === 'checkbox' || type === 'checkboxOther') {
                                    $tr.find('.proAttrCheckbox').prop('checked', false).closest('.userDefaultBox').remove();
                                    if (isValueLen) {
                                        $.each(valueList, function (k, l) {
                                            var idStr = l['valueId'],
                                                originalName = l['valueName'],
                                                originalNameStrToUc = strToUc(originalName),
                                                $proAttrCheckbox = null;
                                            if (idStr && +idStr) {
                                                $tr.find('.proAttrCheckbox').each(function () {
                                                    if (+$(this).val() === +idStr) {
                                                        $proAttrCheckbox = $(this);
                                                        return false;
                                                    }
                                                });
                                            } else if (!idStr) {
                                                if (originalName) {
                                                    $tr.find('.proAttrCheckbox').each(function () {
                                                        if ($(this).val() === originalName) {
                                                            $proAttrCheckbox = $(this);
                                                            return false;
                                                        }
                                                    });
                                                }
                                                if (originalNameStrToUc && !$proAttrCheckbox) {
                                                    $tr.find('.checkboxName').each(function () {
                                                        if ($(this).attr('data-name') === originalNameStrToUc) {
                                                            $proAttrCheckbox = $(this).closest('label').find('.proAttrCheckbox');
                                                            return false;
                                                        }
                                                    });
                                                }
                                            }
                                            if ($proAttrCheckbox) {
                                                $proAttrCheckbox.prop('checked', true);
                                                var vid = $proAttrCheckbox.val();
                                                if (vid && !isEmptyObject(comData.productChildAttributeData) && comData.productChildAttributeData.hasOwnProperty(vid)) PDDKJ_PRODUCT_FN.productFn.productParentAttrChange($proAttrCheckbox, $tr.hasClass('hide') || !$proAttrCheckbox.prop('checked')); //添加子属性下拉框切换方法
                                            } else {
                                                $tr.find('.otherCheckboxIpt').val(originalName);
                                                $tr.find('.otherCheckboxBtn').click();
                                            }
                                        });
                                    }
                                } else if (type === 'combobox') {
                                    var isFlag = true;
                                    if (!valueId || valueId === '0') {
                                        // 循环可输入下拉框的可选项
                                        $.each($tr.find('div[name="comboboxOption"]'), function (k, l) {
                                            if (ucToStr($(l).attr('value')) === value) {
                                                // 找到对应的id赋值并且把内容赋值，这里找的是$tr下所有的文本框
                                                $tr.find('input:text').val(value).data('comboboxId', $(l).attr('data-id'));
                                                isFlag = false;
                                                return false;
                                            }
                                        });
                                    }
                                    if (isFlag) {
                                        $tr.find('input:text').val(value).data('comboboxId', valueId);
                                    }
                                } else {
                                    $tr.find('input:text').val(value);
                                }
                            }
                        })
                    }
                },
                /*************************产品属性生成相关方法end******************************/
                //刷新产品素材图
                updateMaterialImg: function () {
                    PDDKJ_PRODUCT_IMAGE_UP.imageFn.showProductMaterialImg({ isFlag: 1 });//直接更新素材图
                },
    
                // 刀刃角度输入判断
                knifeAngleInputJudgment: function (obj) {
                    clearMistakeNumber(obj);
                    var $obj = $(obj),
                        val = $obj.val(),
                        valNumber = +val;
    
                    // 取值范围 [1,360]
                    if (+valNumber > 360) val = '360';
                    $obj.val(val);
                },
    
                getBrandInfo: function (shopId, call) {
                    var that = this;
    
                    MYJ.ajax({
                        url: 'popTemuCategory/getBrand.json',
                        data: {
                            shopId: shopId
                        },
                        success: function (res) {
                            if (+res.code) {
                                MYJ.message.error(res.msg);
                            }
                            comData.brandInfo = res.data || [];
                            that.reRenderBrand();
                        },
                        complete: function () {
                            call && typeof call === 'function' && call();
                        }
                    });
                },
    
                syncBrand: function () {
                    var that = this;
    
                    MYJ.ajax({
                        url: 'popTemuCategory/syncTemuBrand.json',
                        data: {
                            shopId: $('#shopId').val()
                        },
                        success: function (res) {
                            if (!+res.code) {
                                MYJ.message.success('同步成功！');
                            } else {
                                MYJ.message.error(res.msg);
                            }
                            comData.brandInfo = res.data || [];
                            that.reRenderBrand();
                        },
                        error: function (res) {
                            MYJ.message.error(res.msg);
                        }
                    })
                },
    
                reRenderBrand: function () {
                    var $brandInfo = $('#productAttribute tbody').find('tr[data-name="品牌名"]');
    
                    // 此时如果已经生成了品牌，则进行重新渲染
                    if ($brandInfo.length && comData.brandInfo) {
                        var dataArr = [{
                            value: '',
                            dataName: '',
                            name: '-- 请选择 --'
                        }];
    
                        $.each(comData.brandInfo, function (index, item) {
                            var attrName = item['brandNameEn'];
    
                            if (!attrName) return;
                            dataArr.push({
                                value: item['vid'],
                                name: attrName,
                                attrName: attrName,
                                metadata: ''
                            });
                        })
                        $brandInfo.find('.commSelectBox').selectMenu({
                            data: dataArr, //下拉选项数据
                            clickCall: function (content, $iptObj) {
                                var $tr = $iptObj.closest('tr');
    
                                if (+$tr.attr('data-isHasChild')) PDDKJ_PRODUCT_FN.productFn.productParentAttrChange($iptObj, $tr.hasClass('hide')); //添加子属性下拉框切换方法
                            }
                        }).trigger('selectMenu:update');
                    }
                },
            },
            $commDom = {
                skuAttrBox: $('#skuInfoArrBox'), //sku 属性列表
                skuInfoTable: $('#skuInfoTable'), //sku列表（新）
                skuShopPriceInfoTable: $('#skuShopPriceInfoTable') //多变种店铺价格和促销价列表
            },
            detectionTypeObj = {
                priceDetection: false, // 价格检测
                bannedWordDetection: false // 违禁词检测
            },
            fieldsLimit = {
                // variationOptionMax: 100, //变种属性最大长度限制
                nameMin: 0,        // 标题最小字符数量限制为0个字符
                nameMax: 120,       // 标题最大字符数 120
                descMax: 10000,     // 产品描述支持的最大字符数，暂时用10000限制
                priceMin: 0.01,     // 变种价格（供货价）最小限制
                priceMax: 999999,   //变种价格（供货价）最大限制
                minImgNum: 5,       // 产品图片（产品轮播图）最少选1张
                maxImgNum: 10,       // 产品图片（产品轮播图）最多选6张
                stockMin: 0,        // 库存最小最大限制
                stockMax: 99999,
                weightMin: 0.1,       // 重量最小值
                weightMax: 99999.9,      // 重量最大值99999.9g
                sizeMaxLen: 299.9,         //尺寸长宽高最大限制299.9CM
                clothMinNum: $('#userId').val() === '313016' ? 3 : 5 //指定用户图片最小上传数量改成3，其他用户继续使用5
            },
            zhankai = '展开',
            shouqile = '收起',
            skuOrder = [],
            oldSkuValue = {},
            shopCurrency = 'CNY',
            sellerLoginId = '',
            isStockingAreaMust = false, // 备货区域是否必填 香港主体店铺（币种USD店铺）
            isProductFileMust = false, // 产品文件是否必填
            $toSubmit = $('.toSubmit'),
            pageType = $('#pageType').val();
    
        //公用报错提示方法
        var commonMsgFn = function (msg, type, isText, time) {
            isError = true;
            $.fn.message({type: type ? 'success' : 'error', msg: msg, isText: !!isText, existTime: time ? time : 3000});
        };
    
        const saveFn = {
            init: function () { },
    
            //发布之前做下图片大小的验证
            beforeSaveValidateImgSize: function (op) {
                var categoryType = +$categoryType.val(),//产品分类类目类型 0：非服装；  1：服装类  2：鞋子类
                    isDraft = dxmState === 'draft',
                    imgTypeName = '',
                    imgObj = {},
                    $imgNode = {},
                    num = 0,
                    flag = false,
                    $productMaterialImg = $('#productMaterialImgBox').find('img'),
                    materialImg = $productMaterialImg.attr('src');
    
                $('img.border-red').removeClass('border-red');
                if (materialImg && materialImg.indexOf('static/img/kong.png') === -1) {
                    imgTypeName = '素材图';
                    imgObj[imgTypeName] = [materialImg];
                    $imgNode[imgTypeName] = $productMaterialImg;
                    num++;
                }
    
                if (categoryType === 1) {//服装类，验证
                    var $skuImg = $('.colorsImg').find('img.tuiImageBox');
    
                    if ($skuImg.length) {
                        imgTypeName = 'skc颜色图';
                        imgObj[imgTypeName] = [];
                        $imgNode[imgTypeName] = $skuImg;
                        $skuImg.each(function (i, j) {
                            imgObj[imgTypeName].push($(j).attr('src'));
                            num++;
                        });
                    }
                } else {//非服装、鞋子类，轮播图、预览图获取处理
                    var $liList = $('#myjDrop > li');
    
                    if ($liList.length) {
                        imgTypeName = '产品轮播图';
                        imgObj[imgTypeName] = [];
                        $imgNode[imgTypeName] = [];
                        $.each($liList, function (i, j) {
                            var imgUrl = $(j).find('img').attr('src');
                            if (isDraft) {
                                if ($(j).find('[name="selectedImg"]').is(':checked')) {
                                    imgObj[imgTypeName].push(imgUrl);
                                    $imgNode[imgTypeName].push($(j).find('img'));
                                    num++;
                                }
                            } else {
                                imgObj[imgTypeName].push(imgUrl);
                                $imgNode[imgTypeName].push($(j).find('img'));
                                num++;
                            }
                        });
                    }
    
                    var $listSkuImg = $('#skuInfoTable tbody').find('img.imgCss');
    
                    if ($listSkuImg.length) {
                        imgTypeName = '预览图';
                        imgObj[imgTypeName] = [];
                        $imgNode[imgTypeName] = $listSkuImg;
                        $listSkuImg.each(function (i, j) {
                            var imgUrl = $(j).find('img').attr('src');
    
                            if (imgUrl && imgUrl.indexOf('static/img/addImg.jpg') === -1) {
                                imgObj[imgTypeName].push(imgUrl);
                                num++;
                            }
                        });
                    }
                }
                if (!isEmptyObject(imgObj)) {//将多种类型的图片验证转成一维数组方式验证
                    var count = 0,
                        $loading = $('#loading');
    
                    $loading.modal('show');//因为是异步加载，等待时间可能较长，需要加个loading处理，避免重复点击
                    $.each(imgObj, function (imgType, imgArr) {
                        if (flag) return false;
                        $.each(imgArr, function (index, imgUrl) {
                            if (flag) return false;
                            imageUrlTransFiles(getPicRealUrl(imgUrl), function (files, imgSrc) {
                                if (flag) return;
                                count++;
                                if (files.size > 2097152) {//2097152
                                    commonMsgFn('大小超出限制！' + imgType + '最大不能超过2M');
                                    flag = true;
                                    $imgNode[imgType].each(function () {
                                        if ($(this).attr('src') === imgSrc.split('?v=')[0]) {//报错做下标红提示处理
                                            $(this).addClass('border-red');
                                            return false;
                                        }
                                    });
                                    $loading.modal('hide');
                                } else if (count === num) {//验证正常则再走保存逻辑
                                    $loading.modal('hide');
                                    saveFn.save(op);
                                }
                            }, flag);
                        });
                    });
                }
            },
    
            //将尺码表上设置过的尺码标记下，保存的时候再对比
            setCheckedSize: function () {
                var flag = false,
                    groupIds = [],
                    records = [],
                    $checkedInput = $('.sizeTheme:visible').find('input[type="checkbox"]:checked');
    
                $('.sizeSetBtn').each(function () {
                    if (flag) return false;
                    var arr = [],
                        status = $(this).closest('td').find('input[type="checkbox"]').is(':checked'),//看是否勾选，如果取消了，则不保存
                        sizeObj = $(this).data('settings');
    
                    records = [];
                    if (status) {
                        if (sizeObj && !isEmptyObject(sizeObj)) {//拆开来再验证下，确保尺码表设置的内容都有值，并且跟尺码都对上
                            if (sizeObj.hasOwnProperty('content')) {
                                if (sizeObj.content.hasOwnProperty('meta') && (sizeObj.content.meta.hasOwnProperty('groups') || sizeObj.content.meta.hasOwnProperty('groupList'))) {
                                    $.each(sizeObj.content.meta.groups ? sizeObj.content.meta.groups : sizeObj.content.meta.groupList, function (a, b) {
                                        groupIds.push(+b.id);//把id存起来
                                    });
                                }
                                if (sizeObj.content.hasOwnProperty('records')) {
                                    $.each(sizeObj.content.records, function (i, j) {
                                        if (flag) return false;
                                        $.each(j.values, function (k, y) {
                                            if (groupIds.length && groupIds.indexOf(+k) !== -1 && arr.indexOf(y) === -1) {
                                                if ($checkedInput.filter('[data-val="' + y + '"]').length) {
                                                    arr.push(y);
                                                    // 设置的尺码跟真实勾选的尺码不同（设置的尺码比真实勾选的尺码更多，直接去除未勾选的设置即可）
                                                    records.push(j);
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                        }
                    }
                    $(this).data({ 'sizeArrStr': arr.length ? arr.join(',') : '', 'records': records });
                });
            },
    
            //保存或发布方法
            save: function (op) {
                var $loading = $('#loading');
    
                $loading.modal('show');//点击按钮时加loading，防止连点
    
                var that = this,
                    $shopId = $('#shopId'),
                    categoryType = +$categoryType.val(),//产品分类类目类型 0：非服装；  1：服装类  2：鞋子类
                    $categoryId = $('#categoryHistoryId'),
                    // brandInfo = $('#productAttribute').find('tr[attrid="brandId"]').find('select').val(), //获取品牌信息
                    productAttrDataStr,  //产品属性
                    sourceUrls = '', //来源url
                    sensitiveState = $('input[name="sensitiveState"]:checked').val(),//敏感属性 0：否 1：是（默认0）
                    sensitiveAttr = '',
                    carouselImageObj = null,//产品轮播图、采集图对象数据
                    materialImgUrl = that.getMaterialImageUrl(),//素材图
                    $sizeTemplateSelect = $('.sizeTemplateTd').find('select:not(":disabled")'),
                    sizeTemplateId = $sizeTemplateSelect.length ? $sizeTemplateSelect.val() : null,//尺码表
                    $sizeTable1 = $('.sizeSetBtn[data-index="0"]:visible'),//尺码表1
                    $sizeTable2 = $('.sizeSetBtn[data-index="1"]:visible'),//尺码表2
                    // createSizeTemplate1 =
                    $sizeTemplateSelect2 = $('.sizeTemplateTd2').find('select:not(":disabled")'),
                    sizeTemplateId2 = $sizeTemplateSelect2.length ? $sizeTemplateSelect2.val() : null,//尺码表2（套装类）
                    // createSizeTemplate2 = $('.sizeSetBtn[data-index="1"]:visible'),//尺码表1
                    sizeCharts = [],//创建尺码表要用这个字段传，sizeCharts和sizeTemplateId、sizeTemplateId2不能同时传值
                    optionValueArr = JSON.stringify('[]'),//获取服装类和鞋子类的颜色和尺码的属性值信息，非服装类不传内容
                    description = PDDKJ_PRODUCT_FN.descriptionFn.descSave(), //取描述
                    isPublishState = (+op === 2 || +op === 5),//是否发布状态，如果是发布状态，需要增加一些字段的验证，变种图只取前十张
                    $modelInfoAddBtn = $('.modelInfoAddBtn:visible'),
                    modelInfoIsMust = $modelInfoAddBtn.length ? $modelInfoAddBtn.attr('data-must') === 'true' : false,//是有有模特信息，且必填
                    goodsModel = $('#goodsModelTable').data('goodsModel'),//模特信息 json字符串类型
                    $productOrigin = $('#productOrigin'),
                    productOrigin = $productOrigin.val(),   // 产地
                    $inventoryRegion = $('input[name="inventoryRegion"]:checked'),
                    inventoryRegion = $inventoryRegion.val(),  // 备货区域 1:国内备货 2:海外备货 3:保税仓备货
                    fileProductObj = $('.productFileBox').data('fileObj') || {};
    
                //基本信息
                if (dxmState !== 'online') {
                    if (!$shopId.val()) {
                        commonMsgFn('请选择店铺账号');
                        $loading.modal('hide');
                        return;
                    }
                    if (!$categoryId.val()) {
                        commonMsgFn('请选择分类');
                        $loading.modal('hide');
                        return;
                    }
                }
    
                // 产品属性
                productAttrDataStr = that.getSubmitData(isPublishState);
                if (productAttrDataStr === false) {
                    $loading.modal('hide');
                    return;
                }
    
                if (isPublishState && !materialImgUrl) {//发布的时候验下素材图必填
                    commonMsgFn('产品素材图为空，请上传' + (categoryType === 1 ? 'skc颜色图' : '产品轮播图'));
                    $loading.modal('hide');
                    return;
                }
    
                // 发布验证产地
                if (+op === 2 || +op === 5) {
                    if (!productOrigin) {
                        $('a[data-name="#productProductInfo"]').click();
                        commonMsgFn('请选择产地！');
                        $loading.modal('hide');
                        return;
                    }
                }
    
                // 英文标题
                var productEnStr = that.getSaveTitle($('#productI18n').val() || '', 'en'),
                    productNameI18nObj = {
                        en: productEnStr
                    };
    
                // 判断是否为全空格
                if (/^\s*$/.test(productEnStr)) productEnStr = '';
    
                // 外包装信息
                var $packageShape = $('#packageShape'),
                    $packageType = $('#packageType'),
                    $packageImages = $('#packageImgShow').find('#myjPackageDrop img.imgCss'),
                    packageImagesStr = '';
    
                $.each($packageImages, function (imgIndex, imgItem) {
                    var $imgItem = $(imgItem),
                        imgSrc = $imgItem.attr('src');
                    if (imgSrc) {
                        packageImagesStr += (packageImagesStr ? '|' : '') + returnStringReplaceResult(imgSrc, 'cdnimg.dianxiaomi.com', 'kj-img.pddpic.com', true);
                    }
                });
    
                //敏感类型字符拼接
                var flag = false;
                if (+sensitiveState) {
                    $('.com-input-group.error-box').removeClass('error-box');
                    $('[name="sensitiveType"]:checked').each(function () {
                        var type = $(this).val(),
                            newVal = '';
    
                        /*
                        *
                        * 需要提交最小单位的数值
                        * 1 Wh = 1000 mWh
                        * 1 ml = 1000 uL
                        * 1 mm = 1000 um
                        * 所以*1000 大对象前面放K，兼容历史数据
                        * */
    
                        if (type === '110001' || type === '120001') {//电量
                            var $maxBatteryCapacity = $('#maxBatteryCapacity'),
                                maxBatteryCapacity = $.trim($maxBatteryCapacity.val());
    
                            if (!maxBatteryCapacity) {
                                flag = true;
                                commonMsgFn('请填写电量');
                                $maxBatteryCapacity.focus().closest('.com-input-group').addClass('error-box');
                                return false;
                            }
                            if (+maxBatteryCapacity < 1 || +maxBatteryCapacity > 10000) {
                                flag = true;
                                commonMsgFn('电量请输入1-10000的整数');
                                $maxBatteryCapacity.focus().select().closest('.com-input-group').addClass('error-box');
                                return false;
                            }
                            maxBatteryCapacity = +maxBatteryCapacity * 1000;
                            newVal = type + ':' + maxBatteryCapacity;
                        } else if (type === '140001') {//容量
                            var $maxLiquidCapacity = $('#maxLiquidCapacity'),
                                maxLiquidCapacity = $.trim($maxLiquidCapacity.val());
    
                            if (!maxLiquidCapacity) {
                                flag = true;
                                commonMsgFn('请填写容量');
                                $maxLiquidCapacity.focus().closest('.com-input-group').addClass('error-box');
                                return false;
                            }
                            if (+maxLiquidCapacity < 1 || +maxLiquidCapacity > 500) {
                                flag = true;
                                commonMsgFn('容量请输入1-500的整数');
                                $maxLiquidCapacity.focus().select().closest('.com-input-group').addClass('error-box');
                                return false;
                            }
                            maxLiquidCapacity = +maxLiquidCapacity * 1000;
                            newVal = type + ':' + maxLiquidCapacity;
                        } else if (type === '170001') {
                            var $maxKnifeLength = $('#maxKnifeLength'),
                                maxKnifeLength = $.trim($maxKnifeLength.val()),
                                $knifeAngle = $('#knifeAngle'),
                                knifeAngle = $.trim($knifeAngle.val());
    
                            if (!maxKnifeLength) {
                                flag = true;
                                commonMsgFn('请填写长度');
                                $maxKnifeLength.focus().closest('.com-input-group').addClass('error-box');
                                return false;
                            }
                            if (!knifeAngle) {
                                flag = true;
                                commonMsgFn('请填写刀刃角度');
                                $knifeAngle.focus().closest('.com-input-group').addClass('error-box');
                                return false;
                            }
                            if (+maxKnifeLength < 1 || +maxKnifeLength > 500) {
                                flag = true;
                                commonMsgFn('长度请输入1-500的整数');
                                $maxKnifeLength.focus().select().closest('.com-input-group').addClass('error-box');
                                return false;
                            }
                            if (+knifeAngle < 1 || +knifeAngle > 360) {
                                flag = true;
                                commonMsgFn('刀刃角度请输入1-360的整数');
                                $knifeAngle.focus().select().closest('.com-input-group').addClass('error-box');
                                return false;
                            }
                            maxKnifeLength = +maxKnifeLength * 10;
                            newVal = type + ':' + maxKnifeLength + '-' + knifeAngle;
                        } else {
                            newVal = type;
                        }
                        sensitiveAttr += (sensitiveAttr ? ',' : '') + newVal
                    });
                    if (sensitiveAttr) sensitiveAttr = 'K' + sensitiveAttr;
                }
                if (flag) {
                    $loading.modal('hide');
                    return;
                }
                //变种验证不能为空，保存也要验证
                if (!$commDom.skuInfoTable.find('tbody tr').length) {
                    commonMsgFn('产品变种不能为空！');
                    $loading.modal('hide');
                    $('.locationHrefIn.skuInfoLi').find('a').click();
                    return;
                }
    
                //来源url
                $('tr[sourceurlmarktr="sourceUrlMarkTr"] input[name="sourceUrl"]').each(function () {
                    sourceUrls += (!sourceUrls ? '' : '|') + $.trim($(this).val());
                });
    
                if (MYJ.verifySourceUrlsFn(sourceUrls)) return;
                if (categoryType !== 1) {
                    carouselImageObj = that.getImageUrl(isPublishState); //产品轮播图片（服装类不用传）
    
                    if (carouselImageObj === false) {
                        $loading.modal('hide');
                        return;
                    }
                }
    
                if (categoryType) {//除了非服装类外都要传
                    //变种主题
                    optionValueArr = that.getColorAndSizeThemInfo(categoryType);
    
                    if (optionValueArr === false) {//如果返回的值是false，则当前变种主题及属性填写不正确
                        $loading.modal('hide');
                        return;
                    }
                }
    
                var mainProductSkuSpecReqs = that.getMainProductSkuSpecReqs(categoryType, isPublishState);//产品级的变种数据
    
                if (mainProductSkuSpecReqs === false) {
                    $loading.modal('hide');
                    return;
                }
    
                if ($sizeTable1.length || $sizeTable2.length) {
                    // that.setCheckedSize();//重新拆解创建的尺码表所选择的尺码。一定要确保尺码都能对上
    
                    var sizeMsg = '',
                        checkedSizeStr = '';
    
                    //已勾选的尺码信息
                    $('.sizeTheme:visible').find('input[type="checkbox"]:checked').each(function (i, j) {
                        checkedSizeStr += (checkedSizeStr ? ',' : '') + $(j).attr('data-val');
                    });
                    $('.sizeSetBtn').each(function (i, j) {
                        var sizeObj = $(this).data('settings'),
                            isMust = $(this).attr('data-ismust') === '1',
                            // sizeArrStr = $(this).data('sizeArrStr'),
                            newSizeObj = {};
    
                        if (sizeObj && !isEmptyObject(sizeObj)) {//拆开来再验证下，确保尺码表设置的内容都有值，并且跟尺码都对上
                            newSizeObj = JSON.parse(JSON.stringify(sizeObj));
                        } else if (isMust) {//如果勾选了尺码表，但是没有设置的情况
                            sizeMsg = '请完善尺码表' + (i + 1) + '的信息';
                            var top = $(this).offset();
                            top && $(D).scrollTop(top.top - 80);    // 滚动条跳到该报错的位置
                            return false;
                        }
                        if (!isEmptyObject(newSizeObj)) sizeCharts.push(newSizeObj);//未勾选的用空对象占位置，回显时才能根据数字下标找对应位置
                    });
                    if (sizeMsg) {
                        commonMsgFn(sizeMsg);
                        $loading.modal('hide');
                        return;
                    }
                }/* else {
                var isValidateSizeChart = $('.sizeTemplateTr:visible').length > 0;
    
                //服装类尺码表必填
                if (isValidateSizeChart && categoryType === 1 && !sizeTemplateId && isPublishState) {
                    commonMsgFn('请选择尺码表');
                    $loading.modal('hide');
                    return;
                }
                if (isValidateSizeChart && sizeTemplateId2 && sizeTemplateId2 === sizeTemplateId) {
                    commonMsgFn('多个尺码表不能重复');
                    $loading.modal('hide');
                    return;
                }
            }*/
    
                var variationListStr = that.getProductSkcReqs(isPublishState, categoryType, 1); //变种列表信息
    
                if (variationListStr === false) {
                    $loading.modal('hide');
                    return;
                }
    
                /*  goodsModel = {
                      modelProfileUrl: '',//模特头像地址
                      sizeSpecName: '', //试穿的尺码规格
                      sizeSpecId: 0, //试穿的尺码规格的id
                      modelId: 0, //模特模板的id
                      modelWaist: '', //模特腰围文本，modeltype为2时传空（即鞋子类型时）
                      modelType: 1, //模特类型 1：成衣 2：鞋子
                      modelName: '',//模特名称
                      modelHeight: '0',//模特身高文本，modeltype为2时传空（即鞋子类型时）
                      modelFootWidth: '0',//模特脚宽，modeltype为1时传空（即成衣类型时）
                      modelFootLength:  '0',//模特脚长文本，modeltype为1时传空（即成衣类型时）
                      modelFeature: 1,//模特特性 1：真实模特
                      modelBust:  '0',//模特胸围文本，modeltype为2时传空（即鞋子类型时）
                      tryOnResult: 1, //试穿心得：1，舒适 2：紧身 3：宽松
                      modelHip: '0'//模特臀围文本，modeltype为2时传空（即鞋子类型时）
                  };*/
    
                // 发布时校验模特信息，其他情况不校验
                if (+op === 2 && modelInfoIsMust && !goodsModel) {
                    commonMsgFn('请添加模特信息');
                    $loading.modal('hide');
                    return;
                }
                if (goodsModel && +goodsModel.modelType === 0) goodsModel.modelType = 1;//纠正状态错误的问题
    
                var instructionsLanguages = '',
                    $singleFileTranslationTarget = $('input[name="singleFileTranslationTarget"]:checked');
                if (fileProductObj.instructionsId && $singleFileTranslationTarget) {
                    $.each($singleFileTranslationTarget, function (fileTargetIndex, fileTargetDom) {
                        instructionsLanguages += (instructionsLanguages ? ',' : '') + $(fileTargetDom).val();
                    })
                }
    
                var idStr = $('#idStr').val(),
                    productId = $('#productId').val(),
                    ajaxData = {
                        op: +op, //保存=1、发布=2、保存并移入待发布=3,定时发布=5
                        id: idStr ? idStr : null, //数据库id
                        productId: productId ? productId : null, //平台ID
                        shopId: $shopId.val(), //店铺账号
                        dxmState: dxmState, //编辑页状态
                        categoryType: categoryType,//分类类目的类型 0：非服装 1：服装 2：鞋类
                        categoryId: +$categoryId.val(), //产品分类id
                        fullCid: $('#fullCid').attr('data-id'), //店小秘分类全路径id //that.getProCategoryFullId(),
                        sourceUrl: sourceUrls, //来源URL
                        attributes: JSON.stringify(productAttrDataStr),  //产品属性 对应productPropertyReqs
                        productName: that.getSaveTitle($('#productTitle').val() || ''),  //产品标题
                        productNameI18n: productEnStr ? JSON.stringify(productNameI18nObj) : '',
                        productOrigin: productOrigin,   //产地
                        outerGoodsUrl: $.trim($('#outerGoodsUrl').val()),//站外产品链接
                        mainImage: (carouselImageObj && carouselImageObj.proImgs.length) ? carouselImageObj.proImgs.join('|') : '', //产品图片
                        draftImgUrl: (carouselImageObj && carouselImageObj.draftImgs.length) ? carouselImageObj.draftImgs.join('|') : '', //产品采集图片
                        materialImgUrl: materialImgUrl, //产品素材图，产品分类支持尺码图才有值
                        sensitiveAttr: sensitiveAttr,
                        // sizeTemplateIds: (sizeTemplateId ? sizeTemplateId : '') + (sizeTemplateId2 !== null ? ',' + sizeTemplateId2 : ''),
                        optionValue: optionValueArr, //变种信息部分，非服装类不传内容，内容是所有勾选的颜色和尺码的信息,对应字段productPropertyReqs
                        mainProductSkuSpecReqs: mainProductSkuSpecReqs,
                        variationListStr: variationListStr, //变种列表数据集合json格式[{}] 对应的字段是productSkcReqs
                        description: description,
                        personalizationSwitch: $('[name="personalizationSwitch"]:checked').val(),
                        goodsModel: goodsModel ? JSON.stringify(goodsModel) : '',
                        packageShape: $packageShape.val() ? Number($packageShape.val()) : '',         // 外包装形状
                        packageType: $packageType.val() ? Number($packageType.val()) : '',           // 外包装类型
                        packageImages: packageImagesStr,          // 外包装图片
                        dxmPdfUrl: fileProductObj.dxmPdfUrl || '',
                        instructionsId: fileProductObj.instructionsId || '',
                        qualifiedEn: fileProductObj.qualifiedEn || '',
                        instructionsLanguages: fileProductObj.instructionsId && instructionsLanguages,
                        instructionsTranslateId: fileProductObj.instructionsTranslateId || '',
                        instructionsName: fileProductObj.instructionsName || ''
                    };
                if ($sizeTable1.length || $sizeTable2.length) {
                    ajaxData.sizeCharts = JSON.stringify(sizeCharts);
                }
                // if (sizeTemplateId || sizeTemplateId2) {
                //     ajaxData.sizeTemplateIds = (sizeTemplateId ? sizeTemplateId : '') + (sizeTemplateId2 !== null ? ',' + sizeTemplateId2 : '');
                // }
                ajaxData.sizeTemplateIds = '';//直接清空模板id
                if (isStockingAreaMust) ajaxData['inventoryRegion'] = inventoryRegion;
    
                // 视频数据处理
                var $proVideoUrlIpt = $('#proVideoUrlIpt'), //产品视频input
                    videoVal = $proVideoUrlIpt.val(), //产品视频的值
                    videoType = +$proVideoUrlIpt.attr('data-type'),
                    videoUploadId = $('#videoUploadId').val(),
                    videoUrl = $('#videoUrl').val(),
                    videoImg = $('.videoShowImgBox').attr('src');
    
                if (videoImg && videoImg.indexOf('static/img/productVideoIcon.png') !== -1) {
                    videoImg = '';
                }
                if (videoVal) {
                    ajaxData['videoThumbnail'] = videoImg;
                    if (videoType === 1) { //如果等于1则是本地上传
                        ajaxData['dxmVideoId'] = videoVal;
                        ajaxData['videoUrl'] = videoUrl;
                    } else if (videoType === 2) { //如果等于2则是图片生成
                        ajaxData['videoUrl'] = videoVal;
                    }
                    if (videoUploadId && videoUploadId !== '0') {
                        ajaxData['videoUploadId'] = videoUploadId;
                    }
                }
    
                if (+op === 5) {
                    var dxmScheduleTime = $('#dxmScheduleTime').val();
                    if (!$.trim(dxmScheduleTime)) {
                        $.fn.message({ type: 'error', msg: '请填写定时发布时间！' });
                        $loading.modal('hide');
                        return;
                    }
                    var timeZone = $('#timeZone').val();
                    if (!$.trim(timeZone)) {
                        $.fn.message({ type: 'error', msg: '请填写时区！' });
                        $loading.modal('hide');
                        return;
                    }
                    ajaxData.dxmScheduleTimeStr = parseToBeijingTime(dxmScheduleTime, timeZone);
                    $loading.modal('hide');
                    $('#timingPublishModal').modal('hide');
                } else {
                    $loading.modal('hide');
                }
    
                if (+op === 5 || +op === 2) {   // 发布=2,定时发布=5
                    var variantionList = ajaxData.variationListStr ? JSON.parse(ajaxData.variationListStr) : '',
                        productObj,
                        dataObj;
    
                    $.each(variantionList, function (index, item) {
                        item['sku'] = item['extCode'] || '';
                    });
                    productObj = {
                        id: ajaxData.id,
                        name: ajaxData.productName,
                        variationBos: variantionList,
                        currency: shopCurrency
                    };
                    dataObj = {
                        submitType: '', //批量还是单个，该参数先不去掉，后续如果要加价格检测时可能会用到
                        ids: '',
                        platform: 'pddkj',
                        dxmState: ajaxData.dxmState,
                        detectionUrl: 'priceDetection/protectPriceDetection.json',
                        datas: {
                            ids: '',
                            shopId: $.trim($shopId.val())
                        },
                        productStr: JSON.stringify(productObj),
                        productName: ajaxData.productName,
                        description: ajaxData.description,
                        productNameI18n: ajaxData.productNameI18n
                    };
    
                    that.detection(dataObj, 'new', function (data) {
                        that.saveAjaxFn(comData.url.productUrl + '/add.json', ajaxData);
                    });
                } else {
                    that.saveAjaxFn(comData.url.productUrl + '/add.json', ajaxData);
                }
            },
    
            // 获取标题
            getSaveTitle: function (productStr, type) {
                productStr = productStr.replace(/\s*,/g, ','); // 将,前的空格去除
                productStr = productStr.replace(/\s*，/g, '，'); // 将，前的空格去除
                productStr = productStr.replace(/,/g, ', '); // 给,后增加一个空格
                if (type === 'en') {
                    productStr = productStr.replace(/\s*\//g, '/'); // 将/前的空格去除
                    productStr = productStr.replace(/\//g, '/ '); // 给/后增加一个空格
                }
                productStr = productStr.replace(/\s+/g, ' '); // 连续多个空格合并为同一个
                return $.trim(productStr);
            },
    
            getDetectionItem: function () {
                var item = null;
    
                $.each(detectionTypeObj, function (i, j) {
                    if (j === false && item === null) item = i;
                });
    
                return item;
            },
    
            /**
             * 检测
             * @param data 数据
             * @param type 是否初始化
             * @param call 回调
             */
            detection: function (data, type, call) {
                var that = this;
                //项目状态初始化
                if (type === 'new') {
                    $.each(detectionTypeObj, function (i, j) {
                        if (j === true) detectionTypeObj[i] = false;
                    });
                }
    
                //项目执行完成状态处理
                if (type && type !== 'new') detectionTypeObj[type] = true;
    
                //获取检测项目
                var item = that.getDetectionItem(),
                    platform = data.platform,
                    dataObj = {};
    
                if (item !== null) { //执行检测项目
                    switch (item) {
                        case 'priceDetection':  // 价格检测
                            var datas = data.datas,
                                productIds = data.ids,
                                dxmState = data.dxmState,
                                priceFormula = data.priceFormula,
                                productStr = data.productStr,
                                detectionUrl = data.detectionUrl,
                                productIdArr = productIds ? productIds.split(',') : [];
    
                            dataObj = {
                                isDataToZip: true, //价格检测请求数据需要转压缩传给后端
                                dataFile: productStr, //需要转为file传给后端进行检测的字段数据
                                platform: platform,
                                position: 'listBatchChange', //列表页发布
                                saveData: {
                                    datas: data
                                },
                                dxmState: dxmState,
                                detectionData: {
                                    platform: platform
                                }, //无需转file的字段数据
                                detectionUrl: detectionUrl,
                                callback: function (data, type) {
                                    that.detection(data.datas, type, call);
                                }
                            };
                            PRICE_DETECTION_APPLY.priceDetectionEntrance(dataObj); //价格检测
                            break;
                        case 'bannedWordDetection':
                            /*
                            * 违禁词检测
                            * dataObj= {
                            *   saveData:{datas:{}, ...} 发布数据,datas保存的是需要提交的参数,datas里面只保存提交需要的参数，其他的字段则根据抽出去的ajax请求方法还用到哪些字段进行单独添加
                            *   detectionData:{productName:'aa', ...} 违禁词数据
                            *   detectionUrl:'url' 违禁词请求地址
                            *   callback:function 完成及跳过回调函数
                            * }*/
                            dataObj = {
                                saveData: {
                                    datas: data
                                },
                                detectionData: { //检测违禁词数据
                                    platform: platform,   // 平台
                                    productName: data.productName, //标题
                                    description: data.description, //描述
                                    productNameI18n: data.productNameI18n   // 英文标题
                                },
                                detectionUrl: 'bannedWord/pddKJCheckBannedWord.json',
                                callback: function (data, type) {
                                    that.detection(data.datas, type, call);
                                } //提交发布
                            };
                            bannedWordProDet.setEditSaveDataObj(dataObj, platform); //检测违禁词
                            break;
                    }
                } else {    // 执行结束
                    // 执行发布提交操作
                    call(data);
                }
            },
    
            getDetectSkuList: function () {
                var that = this,
                    $skuTr = $commDom.skuInfoTable.find('tbody tr'),
                    skuTableList = [];
    
                $.each($skuTr, function (i, j) {
                    var $that = $(j),
                        id = $that.attr('data-skuId'),
                        price = +$.trim($that.find('[name="price"]').val()),
                        data = {
                            id: id ? id : null,//店小秘的变种id
                            currency: $('#currency').val(),//全球账号币种为USD，站点站好号根据站点传
                            sku: $.trim($that.find('[name="variationSku"]').val()), //变种sku
                            price: price ? price : ''
                        };
    
                    skuTableList.push(data);
                });
                return skuTableList;
            },
    
            //保存请求方法
            saveAjaxFn: function (url, ajaxData) {
                if (!comData.saveState) {
                    comData.saveState = true;
                } else {
                    return;
                }
                
                returnAjaxData = ajaxData;
                return;
                webJsDataToZip(JSON.stringify(ajaxData), 'pddkjSave.txt', function (content) {
                    var formData = new FormData(),
                        op = ajaxData.op;
    
                    formData.append('file', content); //把dataFile转压缩之后的数据content存到file字段里面给后端
                    if (op) formData.append('op', op);
    
                    MYJ.ajax({
                        url: url,
                        data: formData,
                        cache: false,//设置为false以禁用请求页面的缓存。这对于上传文件尤其重要，因为文件内容通常不应该被缓存。
                        processData: false,//设置为false以防止jQuery对data参数进行序列化。这对于FormData对象尤其重要，因为你需要以原始格式发送表单数据。
                        contentType: false, //设置为false以允许浏览器自动设置正确的`Content-Type`和`boundary`。这对于FormData对象尤其重要，因为浏览器需要知道如何正确地格式化表单数据。
                        pointKey: 'pddkjSave',
                        pointDom: $toSubmit,
                        success: function (data) {
                            //清空刷新拦截
                            window.onbeforeunload = null;
                            if (data) {
                                var $modal = $('#msgModal'),
                                    $msgText = $('div#msgText'),
                                    $msgBtnDelete = $('#msgBtnDelete'),
                                    $msgBtnAdd = $('#msgBtnAdd'),
                                    $msgBtnaBtchAdd = $('#msgBtnaBtchAdd'),
                                    $msgBtnEdit = $('#msgBtnEdit');
    
                                //创建产品地址根据是站点还是全球状态动态改变
                                $('.msgBtnAdd').click(function () {
                                    W.location.href = locHref + comData.url.productUrl + '/add.htm';
                                });
                                if (!+data.code) {
                                    $('#quoteProductId').val(data.data);
                                    if (+ajaxData.op === 1) {
                                        var val = '待发布',
                                            productId = ajaxData.id;
    
                                        if (dxmState === 'draft') val = '采集箱';
    
                                        $msgText.text($.trim(productId) ? '您的产品编辑成功！' : '您的产品已保存到「 ' + val + '」，请在待发布页完成发布！');
                                        $msgBtnDelete.hide();
                                        $msgBtnAdd.show();
                                        $msgBtnEdit.show();
                                    } else if (+ajaxData.op === 3) {
                                        $msgText.text('产品已移入待发布，请在「待发布」中查看！');
                                        $msgBtnDelete.hide();
                                        $msgBtnAdd.show();
                                        $msgBtnEdit.show();
                                    } else if (+ajaxData.op === 5) {
                                        $msgText.text('产品已移入定时发布，请在「定时发布」中查看！');
                                        $msgBtnAdd.hide();
                                        $msgBtnaBtchAdd.show();
                                        $msgBtnEdit.hide();
                                        $msgBtnDelete.click(function () {
                                            W.close();
                                        });
                                    } else {
                                        if (dxmState === 'online') {
                                            $msgText.text('产品已提交平台更新，请稍后查看');
                                            $msgBtnEdit.hide();
                                            $msgBtnAdd.hide();
                                            $msgBtnDelete.click(function () {
                                                W.location.href = locHref + comData.url.productUrl + '/edit.htm?id=' + $('#quoteProductId').val();
                                            });
                                        } else {
                                            $msgBtnAdd.hide();
                                            $msgBtnEdit.hide();
                                            // 修改提示文案为弹层
                                            $msgText.text('产品已提交发布，请在「发布中」、「发布失败」或「在线产品」中查看！');
                                            $msgBtnaBtchAdd.show();
                                            $msgBtnDelete.click(function () {
                                                W.close();
                                            });
    
                                        }
                                    }
                                    $modal.modal('show');
                                    $('#msgBtnDel').click(function () {
                                        W.close();
                                    });
                                    if (dxmState === 'online') {
                                        $msgBtnDelete.click(function () {
                                            W.close();
                                        });
                                    }
                                    $msgBtnEdit.click(function () {
                                        W.location.href = locHref + comData.url.productUrl + '/edit.htm?id=' + $('#quoteProductId').val();
                                    });
    
                                } else {
                                    // 拼接提示框信息
                                    var msg = '<span style="color:red;">' + (data.msg ? data.msg : '请检查当前帐号是否是登录状态') + '</span><br/>';
    
                                    $msgBtnAdd.hide();
                                    $msgBtnEdit.hide();
                                    $modal.find('#msgText').html(msg);
                                    $modal.modal('show');
                                }
                            }
                            var flagTime = setTimeout(function () {
                                clearTimeout(flagTime);
                                flagTime = null;
                                comData.saveState = false;
                            }, 15000);//间隔15s后再去放开状态，如果是脚本触发的话基本是点击发布后脚本会直接触发
                        },
                        error: function () {
                            $('#loading').modal('hide');
                            commonMsgFn('网络异常，请稍后重试！');
                            var flagTime = setTimeout(function () {
                                clearTimeout(flagTime);
                                flagTime = null;
                                comData.saveState = false;
                            }, 5000);//间隔5s后再去放开状态，如果是脚本触发的话基本是点击发布后脚本会直接触发
                        }
                    });
                });
            },
    
            validateImgSize: function (type, imgWidth, imgHeight) {
                var flag = false;
    
                if (type === 1) {//产品轮播图
                    if (+imgHeight) {
                        if (+imgWidth < 800 || +imgHeight < 800) {
                            commonMsgFn('产品轮播图尺寸不能小于800*800');
                            flag = true;
                        } else if (+imgWidth !== +imgHeight) {
                            commonMsgFn('产品轮播图必须为1:1尺寸');
                            flag = true;
                        }
                    }
                } else if (type === 2) {//服装类颜色图
                    if (!+imgWidth && !+imgHeight) return false;
                    if (+imgWidth < 1340/* || +imgHeight < 1785*/) {//因为有误差，先只按一边控制比例处理
                        commonMsgFn('服装类图片尺寸不能小于1340px * 1785px');
                        flag = true;
                        // +(($IMG.width / $IMG.height).toFixed(2)) === 0.75
                    } else if (+(+imgWidth / +imgHeight).toFixed(2) !== 0.75) {
                        commonMsgFn('服装类图片宽高比例需要3:4，请重新上传图片');
                        flag = true;
                    }
                } else if (type === 3) {//非服装或鞋子类变种列表的预览图
                    if (+imgHeight) {
                        if (+imgWidth < 800 || +imgHeight < 800) {
                            commonMsgFn('预览图尺寸不能小于800*800');
                            flag = true;
                        } else if (+imgWidth !== +imgHeight) {
                            commonMsgFn('变种预览图必须为1:1尺寸');
                            flag = true;
                        }
                    }
                }
                return flag;
            },
    
            //获取轮播图片url
            getImageUrl: function (isPublishState) {
                var that = this,
                    imgObj = {
                        proImgs: [],
                        draftImgs: []
                    },
                    isDraft = dxmState === 'draft',
                    $liList = $('#myjDrop > li'),
                    maxUploadNum = PDDKJ_PRODUCT_IMAGE_UP.imageFn.getMaxUploadNum(),
                    minUploadNum = PDDKJ_PRODUCT_IMAGE_UP.imageFn.getMinUploadNum(),
                    flag = true;
    
                $.each($liList, function (i, j) {
                    var src = $(j).find('img').attr('src'),
                        imgWidth = 0,
                        imgHeight = 0;
    
                    if (isPublishState) {//如果是发布，做下图片大小的验证，直接取页面展示的那个尺寸
                        var $imgSize = $(j).find('.imgSize:visible'),
                            imgSizeStr = $imgSize.length ? $.trim($imgSize.text()) : '',
                            imgSizeArr = imgSizeStr ? imgSizeStr.split(' X ') : [];
    
                        imgWidth = (imgSizeArr.length && imgSizeArr.length === 2) ? imgSizeArr[0] : 0;
                        imgHeight = (imgSizeArr.length && imgSizeArr.length === 2) ? imgSizeArr[1] : 0;
                    }
                    if (src && src.indexOf('cdnimg.dianxiaomi.com') > -1) {
                        src = returnStringReplaceResult(src, 'cdnimg.dianxiaomi.com', 'kj-img.pddpic.com', true);//保存再把地址替换回去
                    }
                    if (isDraft) {
                        if ($(j).find('[name="selectedImg"]').is(':checked')) {
                            if (isPublishState && that.validateImgSize(1, +imgWidth, +imgHeight)) {
                                flag = false;
                                return false;
                            }
                            imgObj.proImgs.push(src);
                        }
                        imgObj.draftImgs.push(src);
                    } else {
                        if (isPublishState && that.validateImgSize(1, +imgWidth, +imgHeight)) {
                            flag = false;
                            return false;
                        }
                        imgObj.proImgs.push(src);
                    }
                });
                if (!flag) return false;
                if (imgObj.proImgs.length < minUploadNum) {
                    commonMsgFn('产品轮播图至少需要上传' + minUploadNum + '张');
                    $('.productCarouselImageTr').eq(0).scrollIntoView();    // 滚动条到第一个error的位置
                    return false;
                }
                if (imgObj.proImgs.length > maxUploadNum) {
                    commonMsgFn('产品轮播图不能超过' + maxUploadNum + '张');
                    $('.productCarouselImageTr').eq(0).scrollIntoView();    // 滚动条到第一个error的位置
                    return false;
                }
                return imgObj;
            },
    
            //获取素材图
            getMaterialImageUrl: function () {
                var $pddkjSizeImgTr = $('.productMaterialImgTr'),
                    imgUrl = $pddkjSizeImgTr.find('.productMaterialImg').attr('src');
    
                if (imgUrl && imgUrl.indexOf('static/img/kong.png') !== -1) {
                    imgUrl = '';
                }
                if (imgUrl && imgUrl.indexOf('cdnimg.dianxiaomi.com') > -1) imgUrl = returnStringReplaceResult(imgUrl, 'cdnimg.dianxiaomi.com', 'kj-img.pddpic.com', true);//保存再把地址替换回去
                return imgUrl;
            },
    
            //获取服装类和鞋子类的颜色和尺码的属性值信息，字段productSpecPropertyReqs
            getColorAndSizeThemInfo: function (categoryType) {
                /*   {
                       "parentSpecId":1001,
                       "parentSpecName":"颜色",
                       "specId":16054,
                       "specName":"象牙白",
                       "propName":"颜色",
                       "propValue":"象牙白",
                       "refPid":63,
                       "vid":435,
                       "valueUnit":"",
                       "pid":13,
                       "templatePid":283706,
                       "valueGroupId":1,
                       "valueGroupName":"白色系"
                   }*/
    
                var flag = false,
                    $skuInfoTr = $('#defaultTheme').find('tr.skuAttributeTr');
    
                if ($skuInfoTr.filter('.defaulteCustomTheme,.colorTheme,.sizeTheme').length) $skuInfoTr = $skuInfoTr.filter('.defaulteCustomTheme,.colorTheme,.sizeTheme');//兼容把自定义主题放到系统主题下的问题，这里还是要只取系统主题
    
                var $checkedInput = $skuInfoTr.find('input[type="checkbox"]:checked'),
                    skuLen = $checkedInput.length,
                    arr = [];
    
                var getNewVal = function (oldVal) {
                    return oldVal ? oldVal : '';
                };
    
                if (!skuLen) {
                    commonMsgFn('请至少选择一个变种');
                    return false;
                } else {
                    $skuInfoTr.each(function () {//验证必填主题未勾选的情况
                        var requited = $(this).attr('data-requited'),
                            theme = ucToStr($(this).attr('data-name')),
                            $checkedInputs = $(this).find('input[type="checkbox"]:checked');
    
                        if (requited && requited === 'true' && !$checkedInputs.length) {
                            commonMsgFn('主题' + theme + '至少需要选一个');
                            flag = true;
                            return false;
                        }
                        if (categoryType === 1) {
                            if ((theme === '颜色' || theme === 'color') && $checkedInputs.length > 20) {//服装类skc颜色属性值不能超过20个
                                commonMsgFn('服装类最多只能填写20个颜色skc');
                                flag = true;
                                return false;
                            }
                            if ((theme === '尺码' || theme === 'size') && $checkedInputs.length > 10) {//服装类尺码属性值不能超过10个
                                commonMsgFn('服装类最多只能填写10种尺码类型');
                                flag = true;
                                return false;
                            }
                        }
                    });
                    $checkedInput.each(function () {
                        var $input = $(this),
                            $tr = $input.closest('tr.skuAttributeTr'),
                            themeName = ucToStr($tr.attr('data-name')),
                            attrVal = $input.attr('data-val');
    
                        if (!attrVal) attrVal = ucToStr($.trim($input.val()));
                        arr.push({
                            parentSpecId: $tr.attr('data-parentspecid'),
                            parentSpecName: themeName,
                            propName: themeName,
                            pid: getNewVal($tr.attr('data-pid')),
                            refPid: getNewVal($tr.attr('data-refpid')),
                            vid: getNewVal($input.attr('vid')),
                            specId: ($input.attr('specid') && $input.attr('vid')) ? $input.attr('specid') : 0,
                            valueUnit: getNewVal($tr.attr('data-unit')),
                            specName: attrVal,
                            propValue: attrVal,
                            templatePid: getNewVal($tr.attr('templatepid')),
                            valueGroupId: $input.attr('groupid') ? $input.attr('groupid') : '0',//如果没有值改传0，不然发布报错
                            valueGroupName: getNewVal($input.attr('groupname'))
                        });
                    });
    
                    if (flag) {
                        return false;
                    } else {
                        if (categoryType === 2 && skuLen > comData.customSkuMaxNum) {//鞋类变种不能超过400个
                            commonMsgFn('变种个数不能超过' + comData.customSkuMaxNum + '个，现有' + skuLen + '个变种信息！');
                            // $skuInfoTr.first().find(':text[name="variationSku"]').focus().blur();
                            return false;
                        }
    
                        return arr.length ? JSON.stringify(arr) : false;
                    }
                }
            },
    
            getMainProductSkuSpecReqs: function (categoryType, isPublishState) {//服装类的mainProductSkuSpecReqs需要动态取值，其他非服装类和鞋子类的写死即可
                /*  {
                      "parentSpecId": 1001,
                      "parentSpecName":"颜色",
                      "specId":16054,
                      "specName":"象牙白"
                      "previewImgUrls":[
                      "https://img.kwcdn.com/product/1dec4a1140/c52a5d21-e044-46f8-b41e-5e54bc1d27c9_1500x2000.jpeg"
                  ],
                      "extCode":"货号1",
                      "productSkcId": 0
                  }*/
    
                var that = this,
                    flag = true,
                    $colorTheme = $('.colorTheme'),
                    $colorsImg = $('.colorsImg'),
                    parentSpecId = $colorTheme.attr('data-parentspecid'),
                    parentSpecName = ucToStr($colorTheme.attr('data-name')),
                    $colorImgTr = $colorsImg.find('tr:gt(0)'),
                    isClothesType = categoryType === 1,//是否服装类
                    arr = [];
    
                if (isClothesType) {//服装类
                    $colorImgTr.each(function (i, j) {
                        if (!flag) return false;
                        var $firstTd = $(j).find('td:first'),
                            $skuImgTd = $(j).find('td.skuImgTd'),
                            previewImgUrls = '',
                            $skcInput = $(j).find('input[type="text"]'),
                            skc = $.trim($skcInput.val()),
                            obj = {
                                parentSpecId: parentSpecId,
                                parentSpecName: parentSpecName,
                                specId: $firstTd.attr('cid'),
                                specName: $firstTd.attr('data-name'),
                                // previewImgUrls: '',//变种图
                                extCode: skc,//颜色图里面的skc货号
                                productSkcId: ''//变种id，发布时才需要，暂时不传
                            },
                            skuImgNum = $skuImgTd.find('img').length;
    
                        if (obj.specName && strToUc(obj.specName) === obj.specId) obj.specId = 0;//是服装类的自定义属性值，id换成0
                        if (skc) {
                            flag = productFn.strTesting($skcInput, 'propertyValueDefinitionName');//skc验证不能为中文和中文字符
                            if (!flag) {
                                $skcInput.focus().select();
                                commonMsgFn('SKC编码（货号）不能含有中文和中文字符');
                                $('.location-href li a[data-name="#skuInfo"]').click().addClass('f-red');
                                return false;
                            }
                        }
    
                        if ($skuImgTd.length && skuImgNum) {
                            $skuImgTd.find('img').each(function () {
                                if (isPublishState) {//发布时验证颜色图比例和宽高限制
                                    var imgWidth = $(this).attr('data-w'),
                                        imgHeight = $(this).attr('data-h');
    
                                    if (that.validateImgSize(2, +imgWidth, +imgHeight)) {
                                        flag = false;
                                        return false;
                                    }
                                }
                                previewImgUrls += (previewImgUrls ? '|' : '') + $(this).attr('src');
                            });
                        }
                        if (!flag) return false;
                        if (skuImgNum < fieldsLimit.clothMinNum) {//服装类颜色图必须要上传5张
                            flag = false;
                            commonMsgFn('服装类颜色属性必须上传' + fieldsLimit.clothMinNum + '张图片');
                            $skuImgTd[0].scrollIntoView();
                            return false;
                        }
                        if (skuImgNum > 10) {//服装类颜色图上传数量最多10张
                            flag = false;
                            commonMsgFn('服装类颜色属性最多只能上传10张图片');
                            $skuImgTd[0].scrollIntoView();
                            return false;
                        }
                        if (previewImgUrls && previewImgUrls.indexOf('cdnimg.dianxiaomi.com') > -1) previewImgUrls = returnStringReplaceResult(previewImgUrls, 'cdnimg.dianxiaomi.com', 'kj-img.pddpic.com', true);//保存再把地址替换回去
                        obj.previewImgUrls = previewImgUrls;
                        arr.push(obj);
                    });
                } else {//非服装类和鞋子类
                    var $productNumber = $('#productNumber'),
                        productNumber = $.trim($productNumber.val()),
                        previewImgUrlsStr = $commDom.skuInfoTable.find('tbody tr').eq(0).find('img.imgCss').attr('src');//取变种图第一张
    
                    if (productNumber) {
                        if (!productFn.strTesting($productNumber, 'productSku')) {//产品货号非中文验证
                            flag = false;
                            commonMsgFn('产品货号不能包含中文和中文符号');
                            return false;
                        }
                    }
                    if (previewImgUrlsStr && previewImgUrlsStr.indexOf('cdnimg.dianxiaomi.com') > -1) previewImgUrlsStr = returnStringReplaceResult(previewImgUrlsStr, 'cdnimg.dianxiaomi.com', 'kj-img.pddpic.com', true);//保存再把地址替换回去
    
                    arr.push({
                        parentSpecId: 0,
                        parentSpecName: '',
                        specId: 0,
                        specName: '',
                        previewImgUrls: previewImgUrlsStr,
                        extCode: productNumber,//skc货号
                        productSkcId: ''//变种id，发布时才需要，暂时不传
                    });
                }
                if (!flag) return false;
                return arr.length ? JSON.stringify(arr) : false;
            },
    
            //获取变种列表数据 对应字段productSkuReqs；temporary：是否临时取数据，不是保存或发布时取的数据，临时取数据不做校验，没有的用空代替
            getProductSkcReqs: function (isPublishState, categoryType, isSave) {
                /*       {
                           "thumbUrl":"https://img.kwcdn.com/product/1dec4a1140/c52a5d21-e044-46f8-b41e-5e54bc1d27c9_1500x2000.jpeg",
                           "extCode":"1",
                           "supplierPrice":200,
                           "productSkuSpecReqs":[
                           {
                               "parentSpecId":1001,
                               "parentSpecName":"颜色",
                               "specId":16054,
                               "specName":"象牙白"
                           },
                           {
                               "parentSpecId":3001,
                               "parentSpecName":"尺码",
                               "specId":16113,
                               "specName":"62"
                           }
                       ],
                           "productSkuId":0,
                           "productSkuWhExtAttrReq":{
                           "productSkuVolumeReq":{
                               "len":10,
                                   "width":20,
                                   "height":20
                           },
                           "productSkuWeightReq":{
                               "value":4000
                           },
                           "productSkuBarCodeReqs":[
               
                           ]
                       }
                       },*/
                var that = this,
                    flag = true,
                    $skuInfoTr = $commDom.skuInfoTable.find('tbody tr'),
                    skuLen = $skuInfoTr.length,
                    isClothesType = categoryType === 1,//是否服装类
                    isNotClothesType = !categoryType,//非服装类
                    $colorTheme = isNotClothesType ? null : $('.colorTheme'),
                    $sizeTheme = isNotClothesType ? null : $('.sizeTheme'),
                    $colorsImg = isNotClothesType ? null : $('.colorsImg'),
                    $customTheme = $('#customTheme'),
                    customThemeObj = null,
                    arr = [];
    
                if (skuLen) {
                    if (!categoryType && skuLen > comData.customSkuMaxNum) {
                        if (isSave) {
                            commonMsgFn('非服装类下最多只能填写' + comData.customSkuMaxNum + '个sku');
                            return false;
                        }
                    }
                    $skuInfoTr.each(function (i, j) {
                        var trId = $(j).attr('trid'),
                            extCode = $.trim($(j).find('input[name="variationSku"]').val()),//sku货号
                            thumbUrl = '',
                            $skuImg = null,
                            imgWidth = 0,
                            imgHeight = 0,
                            supplierPrice = $.trim($(j).find('input[name="price"]').val()),//供货价
                            suggestedPrice = $.trim($(j).find('input[name="suggestedPrice"]').val()),//建议售价
                            suggestedPriceCurrencyType = $(j).find('.suggestedPriceUnitSel').val(),//建议售价的币种
                            skuClassification = '', //sku分类：1单品  2：组合装 3：混合套装
                            numberOfPieces = '', //sku分类的数量
                            pieceUnitCode = '',//sku分类数量的单位
                            productSkuId = 0,//sku id先写死，发布时再自动获取
                            skuLength = $.trim($(j).find('input[name="skuLength"]').val()),
                            skuWidth = $.trim($(j).find('input[name="skuWidth"]').val()),
                            skuHeight = $.trim($(j).find('input[name="skuHeight"]').val()),
                            weight = $.trim($(j).find('input[name="weight"]').val()),
                            productSkuSpecReqs = [],//[{"parentSpecId":1001,"parentSpecName":"颜色","specId":16088,"specName":"淡青色"},{"parentSpecId":3001,"parentSpecName":"尺码","specId":16130,"specName":"39"}]
                            warehouseStockQuantityReqs = '',
                            idStr = $(j).attr('data-id'),
                            obj = {
                                id: idStr ? idStr : null,
                                productSkuId: productSkuId,
                                supplierPrice: +((+supplierPrice * 100).toFixed(2)),//价格在保存的时候转成100倍传给后台
                                extCode: extCode,
                                length: +skuLength * 10,//长宽高乘以10转成单位mm的数据
                                width: +skuWidth * 10,
                                height: +skuHeight * 10,
                                weight: +((+weight * 1000).toFixed(1)),//重量乘以1000转成单位mg的数据
                                codeType: isClothesType ? null : $('select[uid="upcOrEanSel"]').val(),//根据选择的值传
                                code: isClothesType ? null : $.trim($(j).find('input[name="identifierCode"]').val()) //商品条码或叫upc，鞋子和非服装类才有
                                // ,suggestedPrice: +((+suggestedPrice * 100).toFixed(2)),//价格在保存的时候转成100倍传给后台
                                // suggestedPriceCurrencyType: suggestedPriceCurrencyType,
                                // skuClassification: +skuClassification,
                                // numberOfPieces: +numberOfPieces,
                                // pieceUnitCode: pieceUnitCode
                            };
    
                        var $skuTr = $commDom.skuInfoTable.find('tbody tr[trid="' + trId + '"]');
                        skuClassification = $skuTr.find('.skuCategorySel').val();
                        numberOfPieces = $.trim($skuTr.find('input[name="skuCategoryNum"]').val());
                        pieceUnitCode = $skuTr.find('.skuCategoryNumUnitSel').val();
                        warehouseStockQuantityReqs = $skuTr.find('input.warehouseStockQuantityReqs').val();
                        if (!isSave) {
                            obj['supplierPriceDouble'] = +supplierPrice;//临时取数据回显的，不保存给后台的加上这个字段
                            obj['lengthDouble'] = +skuLength;//临时取数据回显的，不保存给后台的加上这个字段
                            obj['widthDouble'] = +skuWidth;//临时取数据回显的，不保存给后台的加上这个字段
                            obj['heightDouble'] = +skuHeight;//临时取数据回显的，不保存给后台的加上这个字段
                            obj['weightDouble'] = +weight;//临时取数据回显的，不保存给后台的加上这个字段
                        }
                        if (isPublishState) {
                            if ((!+skuLength || !+skuWidth || !+skuHeight)) {
                                commonMsgFn('尺寸请填写完整');
                                flag = false;
                                return false;
                            }
                            //通过材积重量计算公式验证
                            if (isClothesType && (skuLength * skuWidth * skuHeight) / 6 > +weight) {//服装类才验证
                                commonMsgFn('服装类产品体积重【（长x宽x高）/6】需要小于产品重量（g）');
                                flag = false;
                                return false;
                            }
                        }
    
                        if (isSave) {
                            if (+skuLength > fieldsLimit.sizeMaxLen || +skuWidth > fieldsLimit.sizeMaxLen || +skuHeight > fieldsLimit.sizeMaxLen) {
                                commonMsgFn('尺寸长宽高不能超过' + fieldsLimit.sizeMaxLen + 'cm');
                                flag = false;
                                return false;
                            }
                            if (+skuLength < +skuWidth || +skuLength < +skuHeight || +skuWidth < +skuHeight) {
                                commonMsgFn('尺寸长宽高需要满足长≥宽≥高');
                                flag = false;
                                return false;
                            }
                            if (+suggestedPrice) {
                                obj['suggestedPrice'] = +((+suggestedPrice * 100).toFixed(2));//价格在保存的时候转成100倍传给后台
                                if (suggestedPriceCurrencyType) {
                                    obj['suggestedPriceCurrencyType'] = suggestedPriceCurrencyType;
                                } else {
                                    commonMsgFn('请选择建议售价的币种');
                                    flag = false;
                                    return false;
                                }
                            }
                            if (numberOfPieces === '0') {
                                commonMsgFn('数量不能为0');
                                flag = false;
                                return false;
                            }
                            if (+numberOfPieces) {//sku分类的数量，有值才保存
                                obj['numberOfPieces'] = +numberOfPieces;//数量
                                obj['skuClassification'] = +skuClassification;//类型
                                obj['pieceUnitCode'] = pieceUnitCode;//单位
                            }
                        }
                        if (+categoryType !== 1) {//鞋子或者非服装类直接取变种图
                            $skuImg = $(j).find('img');
                            thumbUrl = $skuImg.attr('src');
                            if (thumbUrl && thumbUrl.indexOf('static/img/addImg.jpg') !== -1) thumbUrl = '';
                            if (isSave && !thumbUrl) {
                                flag = false;
                                commonMsgFn('请上传预览图');
                                return false;
                            }
                            imgWidth = $skuImg.attr('data-w');
                            imgHeight = $skuImg.attr('data-h');
                            //发布时验证变种预览图图片尺寸
                            if (isPublishState && that.validateImgSize(3, +imgWidth, +imgHeight)) {
                                flag = false;
                                return false;
                            }
                        }
    
                        if (+categoryType) {//服装类或鞋子类进来
                            var $defaulteCustomTheme = $('.defaulteCustomTheme');
                            $(j).find('td.skuAttr').each(function (x, y) {
                                var themeNameStr = $(y).attr('data-name'),
                                    themeName = ucToStr(themeNameStr),
                                    attrVal = $(y).attr('value'),
                                    parentSpecId = 0,
                                    $input = null,
                                    specName = attrVal ? ucToStr(attrVal) : '',
                                    $newTheme = null,
                                    $otherCustomTheme = null;
    
                                if (+categoryType === 2 && $defaulteCustomTheme.length) {//如果是鞋子类目，变种主题是动态变动的，则强对应颜色和尺寸
                                    $newTheme = $defaulteCustomTheme.filter('[data-name="' + themeNameStr + '"]');
                                }
    
                                //既有系统自动的也有自定义主题的情况，取这个节点
                                if (comData.newSkuVariation.length && comData.newSkuVariation[0].parentSpecName === themeName) {
                                    $otherCustomTheme = $('#defaultTheme').find('.skuAttributeTr[data-name="' + themeNameStr + '"]');
                                }
                                if (themeName === '颜色' || themeName === 'color') {
                                    parentSpecId = ($otherCustomTheme && $otherCustomTheme.length) ? $otherCustomTheme.attr('data-parentspecid') : $colorTheme.attr('data-parentspecid');
                                    $input = ($otherCustomTheme && $otherCustomTheme.length) ? $otherCustomTheme.find('input[type="checkbox"][value="' + attrVal + '"]') : $colorTheme.find('input[type="checkbox"][value="' + attrVal + '"]');
                                } else if (themeName === '尺码' || themeName === 'size') {
                                    parentSpecId = ($otherCustomTheme && $otherCustomTheme.length) ? $otherCustomTheme.attr('data-parentspecid') : $sizeTheme.attr('data-parentspecid');
                                    $input = ($otherCustomTheme && $otherCustomTheme.length) ? $otherCustomTheme.find('input[type="checkbox"][value="' + attrVal + '"]') : $sizeTheme.find('input[type="checkbox"][value="' + attrVal + '"]');
                                } else {//处理鞋子类目的
                                    if ($otherCustomTheme && $otherCustomTheme.length) {
                                        parentSpecId = $otherCustomTheme.attr('data-parentspecid');
                                        $input = $otherCustomTheme.find('input[type="checkbox"][value="' + attrVal + '"]');
                                    } else if ($newTheme && $newTheme.length) {
                                        parentSpecId = $newTheme.attr('data-parentspecid');
                                        $input = $newTheme.find('input[type="checkbox"][value="' + attrVal + '"]');
                                    }
                                }
    
                                if (isClothesType && (themeName === '颜色' || themeName === 'color')) {//服装类颜色属性时进入
                                    var $colorImgTd = $colorsImg.find('td[data-name="' + specName + '"]'),
                                        $colorImgTr = $colorImgTd.length ? $colorImgTd.closest('tr') : null,
                                        skcVal = ($colorImgTr && $colorImgTr.length) ? $.trim($colorImgTr.find('[data-names="propertyValueDefinitionName"]').val()) : '',
                                        $imgS = ($colorImgTr && $colorImgTr.length) ? $colorImgTr.find('img:first') : null;
    
                                    if ($imgS && $imgS.length) thumbUrl = $imgS.attr('src');
                                    if (thumbUrl && thumbUrl.indexOf('static/img/addImg.jpg') !== -1) thumbUrl = '';//变种这里图片只取颜色图第一张
                                    if (obj.extCode === null) obj.extCode = skcVal;//服装类的取颜色列表那里的skc
                                }
    
                                if (isPublishState && specName.length > comData.variationMaxLenNum && $input.not('[data-cilck="checkbox"]').length) {
                                    $('#loading').modal('hide');
                                    commonMsgFn('自定义属性“' + strEscapeCharacter(specName) + '”长度不能超过' + comData.variationMaxLenNum + '个字符');
                                    $input.closest('td.attributeTd')[0].scrollIntoView();
                                    flag = false;
                                    return false;
                                }
    
                                productSkuSpecReqs.push({
                                    parentSpecId: parentSpecId,
                                    parentSpecName: themeName,
                                    specId: ($input && $input.length && $input.attr('specid') && $input.attr('vid')) ? $input.attr('specid') : 0,//区分服装类自定义属性值
                                    specName: specName
                                });
                            });
                        } else {//非服装类取自定义的那些变种
                            $(j).find('td.skuAttr').each(function (x, y) {
                                var themeNameStr = $(y).attr('data-name'),
                                    themeName = ucToStr(themeNameStr),
                                    attrVal = $(y).attr('value'),
                                    specName = attrVal ? ucToStr(attrVal) : '',
                                    $skuAttributeTr = $customTheme.find('tr.skuAttributeTr[data-name="' + themeNameStr + '"]'),
                                    // specId = ($skuAttributeTr && $skuAttributeTr.length && $skuAttributeTr.find('[type="checkbox"][value="' + attrVal + '"]').length) ? $skuAttributeTr.find('[type="checkbox"][value="' + attrVal + '"]').attr('specid') : 0,
                                    parentSpecId = ($skuAttributeTr.length && $skuAttributeTr.prev().length) ? $skuAttributeTr.prev().find('option:selected').attr('value') : 0;
    
                                if (isPublishState && specName.length > comData.variationMaxLenNum && $skuAttributeTr.find('input[value="' + attrVal + '"]').not('[data-cilck="checkbox"]').length) {
                                    $('#loading').modal('hide');
                                    commonMsgFn('自定义属性“' + strEscapeCharacter(specName) + '”长度不能超过' + comData.variationMaxLenNum + '个字符');
                                    $skuAttributeTr.find('input[value="' + attrVal + '"]').not('[data-cilck="checkbox"]').closest('td.attributeTd')[0].scrollIntoView();
                                    flag = false;
                                    return false;
                                }
    
                                //第一次的时候把主题和它对应的id存一下，后面就不需要再到节点上取，只需要从对象里取就可以
                                if (!customThemeObj) customThemeObj = {};
                                if (!customThemeObj.hasOwnProperty(themeNameStr)) customThemeObj[themeNameStr] = parentSpecId;
                                if (!parentSpecId && customThemeObj && customThemeObj[themeNameStr]) parentSpecId = customThemeObj[themeNameStr];
                                productSkuSpecReqs.push({
                                    parentSpecId: parentSpecId,
                                    parentSpecName: themeName,
                                    specId: /*specId*/0,
                                    specName: specName
                                });
                            });
                        }
                        if (thumbUrl && thumbUrl.indexOf('cdnimg.dianxiaomi.com') > -1) thumbUrl = returnStringReplaceResult(thumbUrl, 'cdnimg.dianxiaomi.com', 'kj-img.pddpic.com', true);//保存再把地址替换回去
                        obj.thumbUrl = thumbUrl;
                        obj.productSkuSpecReqs = JSON.stringify(productSkuSpecReqs);
                        obj.productSkuStockQuantityReq = warehouseStockQuantityReqs;
                        // obj.stock = stock;
                        // obj.dxmProductId = dxmProductId;
                        arr.push(obj);
                    });
                }
                if (!flag) return false;
                return arr.length ? JSON.stringify(arr) : false;
            },
    
            //获取变种图片 json格式, [{value_id: "",img_url: "", custom_value: ""}]
            getSkuImageUrl: function () {
                var skuImgs = [],
                    imgInfo;
    
                $('.thumbnailsSingle').each(function (i, j) {
                    var $colorImg = $(j).find('.colorImg'),
                        name = ucToStr($(j).attr('data-name')),
                        valId = $(j).attr('data-valid'),//属性值id，平台返回，没有就用value代替
                        // them = ucToStr($(j).attr('data-cid')),
                        src = $colorImg.attr('src');
    
                    imgInfo = {
                        value_id: valId ? valId : name,
                        img_url: src.indexOf('static/img/addImg.jpg') !== -1 ? '' : src,//如果是空图，则不传图片地址
                        custom_value: name
                    };
                    skuImgs.push(imgInfo);
                });
                skuImgs = JSON.stringify(skuImgs);
                return skuImgs;
            },
    
            //获取SKU属性值数据
            getSkuAttrList: function (theme, option, mustFlag, isNoSave) {
                var skuAttrList = [];
    
                if (comData.checkSkuAttrData && comData.checkSkuAttrData[theme]) {
                    var $skuInfoAttr = $('.pddkjSkuBox').find('.skuInfoAttr[data-name="' + theme + '"]'),
                        isFlag = false;
    
                    $.each(comData.checkSkuAttrData[theme], function (i, j) {
                        var skuAttrStr = ucToStr(j),
                            optionValId = $skuInfoAttr.find('.attrOptionsBox [type="checkbox"][value="' + j + '"]').attr('data-valid'),
                            optionObj = {};
    
                        // if (dxmState !== 'online') {
                        if (!isNoSave && $.trim(skuAttrStr).length > comData.variationMaxLenNum) {
                            commonMsgFn('变种属性值“' + skuAttrStr + '”已超过' + comData.variationMaxLenNum + '个字符，请修改！', 0, true, 10000);
                            $('.skuInfoAttr[data-num="' + option + '"]').find(':checkbox[value="' + j + '"]')
                                .closest('.changeBoxOut').find('.btnEdit').click();
                            isFlag = true;
                            return false;
                        }
                        // }
                        //没有平台id就用值代替
                        optionObj[optionValId ? optionValId : ucToStr(j)] = ucToStr(j);
                        skuAttrList.push(optionObj);
                    });
                    if (isFlag) return false;
                }
                if (!isNoSave && mustFlag && !skuAttrList.length) {
                    commonMsgFn('必选变种属性未选择!');
                    $('.location-href li a[data-name="#skuInfo"]').click().addClass('f-red');
                    return false;//如果是必填变种没有选择内容，则报错提示
                }
                return skuAttrList;
            },
    
            //产品属性提交
            getSubmitData: function (isPublishState) {
                var arr = [],
                    flag = false,
                    selectInputObj = {},
                    $loading = $('#loading');
    
                productFn.$productAttrShow.find('tr[data-name]').each(function () {
                    if (flag) return false;
                    if (+$(this).attr('data-show') === 1 && $(this).hasClass('hide')) return true;//跳过循环
                    var $that = $(this),
                        isMust = $that.attr('data-required') === 'true',
                        attrData = $that.data('attrData'),
                        pid = attrData.pid,
                        minValue = attrData.minValue,
                        maxValue = attrData.maxValue,
                        refPid = attrData.refPid,
                        controlType = attrData.controlType,
                        name = attrData.attributeName,
                        templatePid = attrData.templatePid,
                        type = $that.attr('data-htmlType'),
                        unitArr = (attrData.valueUnit && attrData.valueUnit.length) ? (typeof attrData.valueUnit === 'string' ? JSON.parse(attrData.valueUnit) : attrData.valueUnit) : [],
                        valueUnit = (unitArr && unitArr.length) ? unitArr[0] : '',
                        valueExtendInfo = attrData.valueExtendInfo,
                        propValue,
                        vid,
                        numberInputValue = '';
                    if (type === 'select') {
                        var $select = $that.find('.menuContentShowBox'),
                            isMoreSelect = $that.attr('data-selectinput') === '1',
                            otherPropValTotal = 0;
    
                        propValue = $that.find('.menuContentValueBox').attr('data-name');
    
                        if (propValue && propValue.indexOf('请选择') !== -1) propValue = '';
    
                        vid = $that.find('.menuContentValueBox').val();
                        // vid = $that.find('option:selected').attr('value');
                        if (isPublishState && isMust && !$that.hasClass('hide') && !vid) {
                            $loading.modal('hide');
                            $select[0].scrollIntoView();
                            commonMsgFn('必填产品属性未填写');
                            $select.focus();
                            flag = true;
                            return false;
                        }
                        // if (isMoreSelect) numberInputValue = '100.00';//先写死这个成分比例，后面再加交互
                        if (isMoreSelect) {
                            numberInputValue = $.trim($that.find('.numInput').val());
                            if (numberInputValue === '' && propValue === '无') numberInputValue = '0';//兼容选了“无”，但不填写内容的情况
                            if ((numberInputValue === '' && propValue) || (numberInputValue && !propValue)) {
                                commonMsgFn('请完善材质信息');
                                $loading.modal('hide');
                                if ($(this).hasClass('hide')) $('#otherAttrShowAndHide').trigger('click');
                                $(this).find(numberInputValue === '' ? '.numInput' : '.menuContentShowBox').focus().select();
                                flag = true;
                                return false;
                            }
                            if (+numberInputValue > 100) {
                                commonMsgFn('材质成分不能超过100');
                                flag = true;
                                return false;
                            }
                            if (refPid && vid && propValue) {
                                if (!selectInputObj.hasOwnProperty(refPid)) selectInputObj[refPid] = [];
                                if (selectInputObj[refPid].indexOf(vid) === -1) selectInputObj[refPid].push(vid);//记录下id值，去重需要使用
                            }
                        }
                        otherPropValTotal = +numberInputValue;
                        if (propValue) {//只保存填写了的内容（必填的在form验证插件已验证过，这里不做验证了）
                            var obj = {
                                valueUnit: valueUnit,
                                propValue: propValue,
                                propName: name,
                                refPid: refPid,
                                vid: vid,
                                pid: pid,
                                templatePid: templatePid,
                                numberInputValue: +numberInputValue ? (+numberInputValue).toFixed(2) : ''
                            };
    
                            if (name === '品牌名') obj['controlType'] = controlType;
                            arr.push(obj);
                        }
                        //如果是多个下拉多选的情况，再取下其他的值
                        if (isMoreSelect) {
                            $that.siblings('tr[pid="' + pid + '"][refpid="' + refPid + '"]').each(function () {
                                var $selectOther = $(this).find('.menuContentValueBox'),
                                    selectOtherPropValue = $selectOther.attr('data-name'),
                                    otherVid = $selectOther.val(),
                                    otherNumberInputValue = $.trim($(this).find('.numInput').val());
    
                                if (selectOtherPropValue || otherNumberInputValue) {//只保存填写了的内容（必填的在form验证插件已验证过，这里不做验证了）
                                    if (otherNumberInputValue === '' && selectOtherPropValue === '无') otherNumberInputValue = '0';//兼容选了“无”，但不填写内容的情况
                                    if ((otherNumberInputValue === '' && selectOtherPropValue) || (otherNumberInputValue && !selectOtherPropValue)) {
                                        commonMsgFn('请完善材质信息');
                                        $loading.modal('hide');
                                        $(this).find(otherNumberInputValue === '' ? '.numInput' : '.menuContentShowBox').focus().select();
                                        flag = true;
                                        return false;
                                    }
                                    if (+((+otherNumberInputValue).toFixed(4)) > 100) {
                                        commonMsgFn('材质百分比不能超过100');
                                        $loading.modal('hide');
                                        $(this).find('.numInput').focus().select();
                                        flag = true;
                                        return false;
                                    }
                                    if (otherVid) {
                                        if (selectInputObj[refPid] && selectInputObj[refPid].indexOf(otherVid) === -1) {
                                            selectInputObj[refPid].push(otherVid);//记录下id值，去重需要使用
                                        } else {
                                            commonMsgFn('材质不能重复');
                                            $loading.modal('hide');
                                            $(this).find('.menuContentShowBox').focus();
                                            flag = true;
                                            return false;
                                        }
                                    }
                                    otherPropValTotal += +otherNumberInputValue;
                                    if (+((+otherPropValTotal).toFixed(4)) > 100) {
                                        commonMsgFn('材质百分比不能超过100');
                                        $loading.modal('hide');
                                        $(this).find('.numInput').focus().select();
                                        flag = true;
                                        return false;
                                    }
                                    if (selectOtherPropValue) {
                                        arr.push({
                                            valueUnit: valueUnit,
                                            propValue: selectOtherPropValue,
                                            propName: name,
                                            refPid: refPid,
                                            vid: otherVid,
                                            pid: pid,
                                            templatePid: templatePid,
                                            numberInputValue: +otherNumberInputValue ? (+otherNumberInputValue).toFixed(2) : ''
                                        });
                                    }
                                }
                            });
                            if (otherPropValTotal && +((+otherPropValTotal).toFixed(4)) < 100) {
                                commonMsgFn('单个材料属性的百分比之和需等于100');
                                $loading.modal('hide');
                                $(this).find('.numInput').focus().select();
                                flag = true;
                                return false;
                            }
                        }
                    } else if (type === 'checkbox') {//
                        $that.find('input[type="checkbox"]:checked').each(function () {
                            var checkboxVal = $(this).next('.checkboxName').attr('data-name'),
                                checkboxVid = $(this).val();
                            if (checkboxVal) {//只保存填写了的内容（必填的在form验证插件已验证过，这里不做验证了）
                                arr.push({
                                    valueUnit: '',
                                    propValue: checkboxVal,
                                    propName: name,
                                    refPid: refPid,
                                    vid: checkboxVid,
                                    pid: pid,
                                    templatePid: templatePid,
                                    valueExtendInfo: valueExtendInfo
                                });
                            }
                        });
                        if (isPublishState && isMust && !$that.hasClass('hide') && !$that.find('input[type="checkbox"]:checked').length) {
                            $that.find('input[type="checkbox"]:first-child')[0].scrollIntoView();
                            commonMsgFn('必填产品属性未填写');
                            flag = true;
                            return false;
                        }
                    } else if (type === 'textIpt') {
                        var unitVal = '',
                            unitSelect = $that.find('.attrUnitSelect'),
                            inputVal = $.trim($that.find('input').val());
    
                        if (isPublishState && isMust && !$that.hasClass('hide') && !inputVal) {
                            $that.find('input')[0].scrollIntoView();
                            commonMsgFn('必填产品属性未填写');
                            flag = true;
                            return false;
                        }
                        if (inputVal) {//只保存填写了的内容（必填的在form验证插件已验证过，这里不做验证了）
                            /*  if (isContainChinese(inputVal)) {
                                  commonMsgFn('产品属性不能包含中文字符');
                                  $loading.modal('hide');
                                  $that.find('input').focus().select();
                                  flag = true;
                                  return false;
                              }*/
                            if (minValue && inputVal.length < +minValue) {
                                commonMsgFn('最少请输入' + minValue + '个字符');
                                $loading.modal('hide');
                                $that.find('input').focus().select();
                                flag = true;
                                return false;
                            }
                            if (maxValue && inputVal.length > +maxValue) {
                                commonMsgFn('最多请输入' + maxValue + '个字符');
                                $loading.modal('hide');
                                $that.find('input').focus().select();
                                flag = true;
                                return false;
                            }
                            if (unitSelect && unitSelect.length) {
                                unitVal = unitSelect.val();
                            }
                            arr.push({
                                valueUnit: unitVal || '',
                                propValue: inputVal,
                                propName: name,
                                refPid: refPid,
                                vid: 0,
                                pid: pid,
                                templatePid: templatePid,
                                valueExtendInfo: valueExtendInfo
                            });
                        }
                    } else if (type === 'timeIpt') {
                        var $tiemSingle = $that.find('.screenTimeData'),
                            inputVal = $tiemSingle.val();
    
                        if (isPublishState && isMust && !$that.hasClass('hide') && !inputVal) {
                            $that.find('input')[0].scrollIntoView();
                            commonMsgFn('必填产品属性未填写');
                            flag = true;
                            return false;
                        }
                        if (inputVal) {
                            arr.push({
                                propValue: inputVal,
                                propName: name,
                                valueUnit: valueUnit,
                                refPid: refPid,
                                vid: 0,
                                pid: pid,
                                templatePid: templatePid,
                                valueExtendInfo: valueExtendInfo
                            });
                        }
                    }
    
                });
                if (flag) return false;
                var hasRequired = productFn.$productAttrShow.find('tr[data-name][data-required="true"]').length > 0;
                if (hasRequired && !arr.length && isPublishState) {
                    commonMsgFn('产品属性至少需要选择一条');
                    return false;
                }
                return arr.length ? arr : '';
            }
        }
    
        saveFn.save(1);

        if( isError ){
            return false;  
        }
        
        return returnAjaxData;
    }
    function addTemplateList(){

        const listValues = GM_listValues();
        // 获取templateList元素
        let templateList = document.getElementById('template');
        // 清空TemplateList中的所有选项
        templateList.innerHTML = '';

        for (let index = 0; index < listValues.length; index++) {
            const text = listValues[index];
            const value = GM_getValue(text);

            let option = document.createElement('option');
            option.value = JSON.stringify(value);
            option.textContent = text;
            templateList.appendChild(option);
        }

        setTimeout(function(){
            $(templateList).trigger("change");
        },100);

    }
    addTemplateList();
    
    function addPatternList(){
        // 获取datalist元素
        let dataList = document.getElementById('patternList');
        // 清空datalist中的所有选项
        dataList.innerHTML = '';
        // 重新添加选项到datalist
        patternDataList.forEach(function(item) {
            let option = document.createElement('option');
            option.value = item.name;
            dataList.appendChild(option);
        });
    }

    let ajaxData = null;
    let patternDataList = [{
        "value": "",
        "dataName": "",
        "name": "-- 请选择 --"
    }];
    addPatternList();

    $("#dianxiaomi").on("change","#template",function(e){
        let item = this.value;
        try {
            item = JSON.parse(item);
            ajaxData = item.ajaxData;
            patternDataList = JSON.parse(item.patternData);
        } catch (error) {
            ajaxData = null;
            patternDataList = [];
        }
        addPatternList();
    });
    $("#dianxiaomi").on("click",".popups-button",function(e){
        $(e.delegateTarget).toggleClass("is-active");
    });
    $("#dianxiaomi").on("click",".SaveTemplate",function(e){
        let templateName = $("#templateName").val();
        if (templateName!=null && templateName!=""){

            let ajaxData = getAjaxData();
            let patternData = getPatternList();

            if( ajaxData ){
                GM_setValue(templateName.trim(),{
                    ajaxData: ajaxData,
                    patternData: patternData
                });
                addTemplateList();
                $("#templateName").val("");
            }
            
        }
    });
    $("#dianxiaomi").on("click",".DelTemplate",function(e){
        if( confirm("是否删除") ){
            GM_deleteValue( $("#template option:selected").text().trim() );
            addTemplateList();
        }
    });

    $("#dianxiaomi").on("change",".ImportTemplate",function(e){
        let file = e.target.files[0];
        if (file) {
            if( confirm("导入模板会覆盖同名模板") ){
                let reader = new FileReader();
                reader.onload = function(event) {
                    try {
                    // 将文件内容解析为JSON对象
                    let json = JSON.parse(event.target.result);
                    // 使用解析后的数据
                    console.log("ImportTemplate",json);
                    // 这里可以添加你的逻辑，比如将数据存储到WebSQL或进行其他操作

                    for (let index = 0; index < json.length; index++) {
                        const curData = json[index];
                        GM_setValue(curData.name,curData.value);
                    }
                    addTemplateList();

                    } catch (err) {
                        console.error('Error parsing JSON:', err);
                    }
                };
                reader.readAsText(file); // 读取文件内容
            }else{
                e.target.value = '';
            }
        }
    });

    $("#dianxiaomi").on("click",".ExportTemplate",function(e){
        let ExportData = [];

        const listValues = GM_listValues();
        for (let index = 0; index < listValues.length; index++) {
            const templateName = listValues[index];
            const templateValue = GM_getValue(templateName);

            // option.value = JSON.stringify(value);
            ExportData.push({
                name: templateName,
                value: templateValue
            })
        }

        // 将数据转换为JSON字符串
        let jsonString = JSON.stringify(ExportData, null, 2);
        // 创建一个Blob对象，类型为JSON
        let blob = new Blob([jsonString], { type: 'application/json' });
        // 创建一个链接元素用于下载
        let downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${new Date().getTime()}.json`; // 指定下载文件的名称
        // 模拟点击链接以下载文件
        document.body.appendChild(a);
        a.click();
        // 清理DOM和URL对象
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);

    });


    function GetImageUrl(name){
        return $.ajax({
            type: 'POST',
            url: gitWinLocHref() + 'album/selectImgList.htm',
            data: {
                fullCid: '',
                pageNo: 1,
                pageSize: 20,
                name: name
            }
        });
    }
    
    
    async function saveDate(serialNumber, AttributePattern, data) {
        let postData = Object.assign({}, data);

        // 替换属性
        let arrAttributes = JSON.parse(postData.attributes);
        arrAttributes = arrAttributes.map(function(item){
            if( item.propName == "图案"){
                item.propValue = AttributePattern.name;
                item.vid = String(AttributePattern.value);
            }
            return item;
        });
        postData.attributes = JSON.stringify(arrAttributes);
        
        // 替换标题 [serialNumber]
        postData.productName = `${AttributePattern.name}${postData.productName}${serialNumber}`

        // 替换图片 [Image主图]
        function replaceImageUrl(text, variable,replacement) {
            // 构建正则表达式，匹配 http 或 https，任意数字序列，以及变量部分
            const regex = new RegExp(`https?://cos\\.myqcloud\\.com/\\d+/\\[Image${variable}\\]`, 'g');
            
            // 替换匹配的URL
            return text.replace(regex, replacement);
        }
        
        // 获取图片类型
        let arrImage = ["主图"];
        let arrMainProductSkuSpecReqs = JSON.parse(postData.mainProductSkuSpecReqs);
        for (let index = 0; index < arrMainProductSkuSpecReqs.length; index++) {
            arrImage.push( arrMainProductSkuSpecReqs[index].specName);
        }

        console.log("图片类型",arrImage);

        // 获取图片地址
        let PromiseImage = await Promise.all(arrImage.map((item) => GetImageUrl(`${serialNumber}-${item}`) )); 
        let objImage = {};
        let TemporaryImage = $('#TemporaryImage');
        if ( TemporaryImage.length == 0 ) {
            $('body').append('<div id="TemporaryImage" style="display: none;"></div>');
            TemporaryImage = $('#TemporaryImage');
        }
        for (let index = 0; index < PromiseImage.length; index++) {
            const element = PromiseImage[index];
            TemporaryImage.html(element);
            const imgSrc = $("#TemporaryImage .imgHomeDiv:first-child .imgHomeImg .imgDivIn img").attr("src");
            objImage[arrImage[index]] = imgSrc;
        }
        console.log("图片地址",objImage);
        
        postData.materialImgUrl = replaceImageUrl(postData.materialImgUrl,"主图",objImage["主图"]);

        for (let index = 0; index < arrMainProductSkuSpecReqs.length; index++) {
            let cutItem = arrMainProductSkuSpecReqs[index];
            cutItem.extCode = serialNumber;
            cutItem.previewImgUrls = replaceImageUrl(cutItem.previewImgUrls,cutItem.specName,objImage[cutItem.specName]);
        }

        console.log("arrMainProductSkuSpecReqs",arrMainProductSkuSpecReqs);
        postData.mainProductSkuSpecReqs = JSON.stringify(arrMainProductSkuSpecReqs);



        let arrVariationListStr = JSON.parse(postData.variationListStr);


        for (let index = 0; index < arrVariationListStr.length; index++) {
            const cutItem = arrVariationListStr[index];

            let arrExtCode = cutItem.extCode.split("-");
            arrExtCode[0] = serialNumber;
            cutItem.extCode = arrExtCode.join("-");

            let type = null;

            let arrProductSkuSpecReqs = JSON.parse(cutItem.productSkuSpecReqs);
            for (let i = 0; i < arrProductSkuSpecReqs.length; i++) {
                const element = arrProductSkuSpecReqs[i];
                if( element.parentSpecName == "颜色" ){
                    type = element.specName;
                }
            }

            cutItem.thumbUrl = objImage[type];
        }

        console.log("arrVariationListStr",arrVariationListStr);

        postData.variationListStr = JSON.stringify(arrVariationListStr);
        
    
        let url = "pddkjProduct/add.json";
        let $toSubmit = $('.toSubmit[data-value="save-1"]');
    
        webJsDataToZip(JSON.stringify(postData), 'pddkjSave.txt', function (content) {
            var formData = new FormData(),
                op = ajaxData.op;
    
            formData.append('file', content); //把dataFile转压缩之后的数据content存到file字段里面给后端
            if (op) formData.append('op', op);
    
            MYJ.ajax({
                url: url,
                data: formData,
                cache: false,//设置为false以禁用请求页面的缓存。这对于上传文件尤其重要，因为文件内容通常不应该被缓存。
                processData: false,//设置为false以防止jQuery对data参数进行序列化。这对于FormData对象尤其重要，因为你需要以原始格式发送表单数据。
                contentType: false, //设置为false以允许浏览器自动设置正确的`Content-Type`和`boundary`。这对于FormData对象尤其重要，因为浏览器需要知道如何正确地格式化表单数据。
                pointKey: 'pddkjSave',
                pointDom: $toSubmit,
                success: function (data) {
                    //清空刷新拦截
                    window.onbeforeunload = null;
                },
                error: function () {
                    $('#loading').modal('hide');
                    commonMsgFn('网络异常，请稍后重试！');
                    var flagTime = setTimeout(function () {
                        clearTimeout(flagTime);
                        flagTime = null;
                        comData.saveState = false;
                    }, 5000);//间隔5s后再去放开状态，如果是脚本触发的话基本是点击发布后脚本会直接触发
                }
            });
        });
    }
    
    
    function findAttrNameByValue(value, data) {
        // 遍历对象数组
        for (let item of data) {
            // 检查 value 属性是否存在且等于用户输入的 value
            if (item.name == value) {
                // 返回对应的 attrName 属性值
                return {
                    name: item.name,
                    value: item.value
                };
            }
        }
        // 如果遍历结束都没有找到，返回 null
        return null;
    }
    function getPattern() {
        let AttributePattern = document.getElementById('AttributePattern');
        let value = AttributePattern.value;
        AttributePattern.value = "";
    
        return findAttrNameByValue(value, patternDataList);
    }
    
    document.getElementById('triggerButton').addEventListener('click', function () {
        let serialNumber = document.getElementById('serialNumber');
        let AttributePattern = getPattern();
        if (serialNumber.value != "" && AttributePattern.value != null && ajaxData != null ) {
            saveDate(serialNumber.value, AttributePattern, ajaxData);
        }
        serialNumber.value = "";
    });
})();