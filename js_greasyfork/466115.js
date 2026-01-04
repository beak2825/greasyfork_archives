// ==UserScript==
// @name         磊哥开发阿里黑盒子
// @namespace    https://www2.alibaba.com/campaign_list.htm
// @version      1.0.1
// @match        https://www2.alibaba.com/*
// @match        https://www.alibaba.com/product-detail/*
// @match        https://*.en.alibaba.com/*
// @match       https://*.alibaba.com/message*
// @match        https://www.alibaba.com/trade/search*
// @match       https://www.alibaba.com/products/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alibaba.com
// @namespace  http://www.alibaba.com
// @description  1-阿里巴巴国际站视频下载2-显示全店产品数量3-增加产品编辑界面新元素
// @match *://www.alibaba.com/*
// @match *://data.alibaba.com/*
// @match *://*.alibaba.com/trade/search*
// @match *://*.alibaba.com/product-detail/*
// @match *://keywordIndex.alibaba.com/*
// @match *://photobank.alibaba.com/*
// @match *://post.alibaba.com/*
// @match *://hz-productposting.alibaba.com/*
// @match *.alibaba.com/product/*
// @grant        GM_xmlhttpRequest
// @grant GM_addStyle
// @license Apache
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466115/%E7%A3%8A%E5%93%A5%E5%BC%80%E5%8F%91%E9%98%BF%E9%87%8C%E9%BB%91%E7%9B%92%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/466115/%E7%A3%8A%E5%93%A5%E5%BC%80%E5%8F%91%E9%98%BF%E9%87%8C%E9%BB%91%E7%9B%92%E5%AD%90.meta.js
// ==/UserScript==
(function () {
    'use strict';
    GM_addStyle(
        ".switch{position:relative;width:45px;height:17px;display:inline-block} .switch input{display:none}.d_slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ca2222;transition:.4s}.d_slider:before{position:absolute;content:'';height:13px;width:13px;left:2px;bottom:2px;background-color:#fff;transition:.4s}input:checked+.d_slider{background-color:#2ab934}input:checked+.d_slider:before{transform:translateX(28px)}.on{display:none}.off,.on{color:#fff;position:absolute;transform:translate(-50%,-50%);top:50%;left:50%;font-size:8px}input:checked+.d_slider .on{display:block} input:checked+.d_slider .off{display:none}.d_slider.round{border-radius:17px}.d_slider.round:before{border-radius:50%}"
    );
    // 工具函数 -- 添加元素属性
    function setAttributes(el, attrs) {
        for (let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
    // 工具函数 -- 复制
    function copy(e, textContent = true) {
        let obj = document.createElement('input');
        document.body.appendChild(obj);
        obj.value = textContent ? e.textContent : e;
        obj.select();
        document.execCommand('copy', false);
        obj.remove();
        return obj.value
    }
    // 工具函数 -- 序数
    function addCounter(productList, margin) {
        var cssText = "position:absolute;z-index:1;margin-left:" + margin +
            "px;display:inline-block;background:SlateGray;color:WhiteSmoke;font-family:'微软雅黑';font-size:14px;text-align:center;width:20px;line-height:20px;border-radius:50%;";
        var div = document.createElement('div');
        var idx = 1;
        for (var i = 0; i < productList.length; i++) {
            if (productList[i].getAttribute('data-index')) {
                continue;
            } else {
                productList[i].setAttribute('data-index', idx);
                div.innerHTML = "<div id='product_" + i + "' style=" + cssText + ">" + idx + "</div>";
                productList[i].innerHTML = div.innerHTML + productList[i].innerHTML;
                idx++;
            }
        }
    }
    // 工具函数 -- 首字母大写
    function Capitalize(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    function productList() {
        if (document.querySelector(".product-info")) {
            addCounter(document.querySelectorAll(".product-info"), -80);
        }
        let productList = document.querySelectorAll(".product-info");
        for (var i = 0; i < productList.length; i++) {
            var el = document.getElementsByClassName('product-id')[i];
            var el2 = document.getElementById("product_" + i);
            var product_id = el.innerText.replace(/[^0-9]/ig, "");
            let inquiry_url =
                "https://message.alibaba.com/msgsend/contact.htm?action=contact_action&domain=1&id=" +
                product_id;
            var similar_url = "https://post.alibaba.com/product/publish.htm?pubType=similarPost&itemId=" +
                product_id;
            el2.onclick = function () {
                copy(inquiry_url, false)
                alert(`${inquiry_url}\n……Copy The Inquiry URL Done……`);
            }
            el.setAttribute('data-href', inquiry_url)
            let product_a = productList[i].parentNode.querySelector(".next-col.next-col-3>span>div")
            if (product_a){
            let product_analysis = document.createElement("span");
            product_analysis.innerHTML =
                `<br><a href="https://data.alibaba.com/product/overview?prodId=${product_id}" target="_blank">效果真牛逼</a>`;
            if (!product_a.textContent.match("效果")) { // 动态加载fix
                product_a.appendChild(product_analysis);
            }
            }
        }
    }
    // 添加产品运营工作台产品编辑按钮
    function productEdit() {
        let products, products_cell;
        if (document.querySelector('.upgrade-products-article-item')) {
            products_cell = '.upgrade-products-article-item';
            products = document.querySelectorAll(products_cell);
        } else {
            products_cell = '.upgrade-products-grid-record';
            products = document.querySelectorAll(products_cell);
        }
        let ln = products.length;
        // 非已经存在编辑按钮
        if (ln && !document.querySelector(products_cell).textContent.match("编辑")) {
            for (let i = 0; i < ln; i++) {
                let product_title = products[i].querySelector(".product-subject").title;
                let product_container = products[i].querySelector(".product-id");
                let product_id = product_container.textContent.match(/\d+/)[0]; // 产品ID
                // console.log(product_title, product_id);
                let product_href =
                    `<a href="//post.alibaba.com/product/publish.htm?spm=a2747.manage.0.0.77fb71d2zK7Jvr&itemId=${product_id}" target="_blank"><br/>编辑</a>
        <a href="//hz-productposting.alibaba.com/product/manage_products.htm?#/product/all/1-10/productId=${product_id}" target="_blank"> 数据</a>
        <a href="https://data.alibaba.com/product/overview?prodId=${product_id}" target="_blank">效果明细</a>`
                if (!product_container.textContent.match("编辑")) { // 动态加载fix
                    product_container.innerHTML += product_href;
                }
            }
            console.log("添加产品运营工作台产品编辑按钮成功!!!");
        }
    }
    // 添加产品分析页面按钮
    function productAnalyse() {
        let product_tab = document.querySelector(".Product_tab .next-tabs-nav li[aria-selected='true']").textContent
        let products = document.querySelectorAll('tbody>tr')
        let ln = products.length;
        // 非已经存在产品分层按钮
        if (product_tab =="我的产品"){
        if (ln && !document.querySelector('tbody>tr:last-child').textContent.match("分层")) {
            for (let i = 0; i < ln; i++) {
                let product_title = products[i].querySelector(".media-content").textContent;
                let product_url = products[i].querySelector(".custom-td-content>a").href;
                let product_id = product_url.match(/_(\d+)\.htm(l)?/)[1]; // 产品ID
                // console.log(product_title, product_id);
                let product_newURL =
                    "https://post.alibaba.com/product/publish.htm?spm=a2747.manage.0.0.8e9071d2H60Rr7&pubType=similarPost&itemId=" +
                    product_id + "&behavior=copyNew";
                let product_href =
                    `<br><a class="action-enabled TEST" href="${product_newURL}" target="_blank" behavior="copyToNewProduct">复制</a><br>
        <a class="action-enabled TEST" href="//hz-productposting.alibaba.com/product/manage_products.htm?#/product/all/1-10/productId=${product_id}" target="_blank">分层</a>`;
                // 非产品不可编辑状态
                if (products[i].querySelector(".action-enabled")) {
                    let product_container = products[i].querySelector(".action-enabled").parentElement; // 插入span 编辑 ...
                    if (!product_container.textContent.match("分层")) { // fix动态加载js，指选择日期产品后排序会重复添加的
                        product_container.innerHTML += product_href;
                    }
                }
                // product_container.parentNode.insertBefore(document.createElement("br"), product_container.nextSibling);
                // document.querySelector('col:last-child').style.setProperty("width", "180px", "important"); // 设置表格最后一栏宽度
            }
            console.log("添加产品分析页面按钮成功!!!");
        }}
        else{
        // 零效果产品
        // 非对不起，未能查询到符合您要求的产品，建议重新设置查询条件或者已经存在复制按钮
        if (!document.querySelector('.ineffective-product tbody>tr').textContent.match("未能查询到") && !document.querySelector('.ineffective-product tbody>tr').textContent
            .match("复制")) {
            products = document.querySelectorAll('.ineffective-product tbody>tr')
            ln = products.length;
            for (let i = 0; i < ln; i++) {
                let product_info = products[i].querySelectorAll('.next-table-cell-wrapper'); // 表格每一行产品
                // console.log(product_info);
                let product_url = product_info[1].querySelector("a").href;
                let product_container = product_info[6].querySelector(".edit-delete-off"); // <span class="edit-delete-off">...
                let product_id = product_url.match(/_(\d+)\.htm(l)?/)[1]; // http://www.alibaba.com/product-detail//XXX_123456789.html?spm=a2... // 产品ID
                let product_newURL =
                    "https://post.alibaba.com/product/publish.htm?spm=a2747.manage.0.0.8e9071d2H60Rr7&pubType=similarPost&itemId=" +
                    product_id + "&behavior=copyNew";
                let product_HTML = document.createElement("span");
                product_HTML.innerHTML =
                    `<a href="${product_newURL}" target="_blank" behavior="copyToNewProduct">复制</a><br/>
         <a href="//hz-productposting.alibaba.com/product/manage_products.htm?#/product/all/1-10/productId=${product_id}" target="_blank">数据</a><span>&nbsp;&nbsp;&nbsp;</span>
         <a href="https://data.alibaba.com/product/overview?prodId=${product_id}" target="_blank">效果</a>`;
                if (!product_container.textContent.match("数据")) { // 动态加载fix
                    product_container.appendChild(product_HTML);
                }
            }
            console.log("零效果产品页复制按钮添加成功!!!");
        }
        }
    }
    // 添加产品页按钮
    function productDetail() {
        let product_id;
        if (!document.querySelector('.ali_product_keywords')) {
            if (document.querySelector(".module-pdp-title") || document.querySelector(".product-title")) {
                let product_title;
                let product_title_container;
                let product_image_container;
                if (document.querySelector(".module-pdp-title")){
                product_title = document.querySelector(".module-pdp-title").textContent;
                product_title_container = ".module-pdp-title";
                product_image_container = ".main-image-thumb-item img";
                }
                else{
                product_title = document.querySelector(".product-title h1").textContent;
                product_title_container = ".product-title h1";
                product_image_container = ".main-list>.main-item>img";
                } // 在不同浏览器或设备显示代码不一样
                // console.log(product_title);
                if (/\/product\//.test(document.URL)) {
                    product_id = document.URL.match(/(\d+)-(\d+)/)[1];; // 产品ID
                } else if (/chinese\.alibaba/.test(document.URL)) {
                    product_id = document.URL.match(/-(\d+)\.htm(l)?/)[1]; // 中文网页产品ID
                } else {
                    product_id = document.URL.match(/_(\d+)\.htm(l)?/)[1]; // 产品ID
                }
                // overwriting the innerHTML is not a good idea indeed, will gone event listener so using appendChild here.
                let product_html = document.createElement("div");
                product_html.innerHTML =
                    `<p style="color:#ff6a00" class="ali_product_keywords">${product_keywords_html}</p>`;
                document.querySelector(product_title_container).parentElement.appendChild(product_html); // 同标题class
                let kws = document.getElementsByClassName("product_keyword");
                for (let i = 0; i < kws.length; i++) {
                    kws[i].onclick = function () {
                        let kkws = copy(kws[i]);
                        kws[i].innerHTML = "Copied";
                window.setTimeout(function () {
                    kws[i].innerHTML = kkws;
                }, 1500)
                    }
                }
                console.log("添加产品分析页面按钮成功!!!");
                document.querySelectorAll(product_image_container).forEach(v => (v.src = v.src.replace(
                    /_50x50\.(jpg|png)/, "").replace(/_100x100xz\.(jpg|png)/, ""))); // 修改图片轮播链接为原图
            }
        }
        // 动态加载
        window.addEventListener('load', function () {
            if (document.querySelector(".details-user-actions")) {
                let container = document.querySelector(".details-user-actions");
                let product_tool = document.createElement("span");
                if (document.querySelector('.image-d_slider video')) {
                    if (!document.querySelector('.details-user-actions').textContent.match("视频")) {
                        let video_link = document.querySelector('video').src; // 产品视频链接
                        let video_poster = document.querySelector('video').poster; // 产品视频封面链接
                        let video_html =
                            `<a href="${video_link}" target="_blank">视频链接 </a><a href="${video_poster}" target="_blank">视频封面</a>`
                        product_tool.innerHTML = video_html;
                    }
                }
                let product_edit_style = document.querySelector(".is-magic") ? "智能编辑" : document.querySelector(
                    "#J-rich-text-description>div:only-child") ? "旧版智能编辑" : "普通编辑";
                product_tool.innerHTML +=
                    `<br/>${product_edit_style}  <a href="//post.alibaba.com/product/publish.htm?spm=a2747.manage.0.0.77fb71d2zK7Jvr&itemId=${product_id}" target="_blank">编辑</a>
        <a href="//hz-productposting.alibaba.com/product/manage_products.htm?#/product/all/1-10/productId=${product_id}" target="_blank">数据</a>
          <a href="https://data.alibaba.com/product/overview?prodId=${product_id}" target="_blank">效果明细</a>
          <a href="https://post.alibaba.com/product/publish.htm?spm=a2747.manage.0.0.8e9071d2H60Rr7&pubType=similarPost&itemId=${product_id}" target="_blank" behavior="copyToNewProduct">复制</a>`;
                if (!document.querySelector('.details-user-actions').textContent.match("数据")) {
                    container.appendChild(product_tool);
                }
            }
        })
    }
    // 添加图片银行直接下载原图按钮
    function productPhoto() {
        let products = document.querySelectorAll('.photo-grid-item') // 获取图片容器
        let ln = products.length;
        // 非已存在下载原图链接按钮
        if (!document.querySelector('.image-info').textContent.match("下载原图")) {
            for (let i = 0; i < ln; i++) {
                let product_src = products[i].querySelector(".photo-grid-img-wrapper img").src; // 获取图片链接
                let product_picforamt = product_src.match(/_350x350\.(jpg|png)/)[1];
                let product_picLink = product_src.replace(/_350x350\.(jpg|png)/, "");
                let product_picName = products[i].querySelector(".display-name button").textContent; // 获取图片文件名
                // console.log(product_picName);
                let product_picContainer = products[i].querySelector(".image-info");
                let product_picHTML = document.createElement("a");
                setAttributes(product_picHTML, {
                    "href": `${product_picLink}?attachment=${product_picName}.${product_picforamt}`,
                    "target": "_blank",
                    "rel": "noopener noreferrer"
                });
                product_picHTML.innerHTML = "下载原图";
                product_picContainer.appendChild(product_picHTML);
            }
            // console.log("添加图片银行直接下载原图按钮成功!");
        }
    }
    //添加关键词指数页搜索按钮
    function productKeywordIndex() {
        let keywords = document.querySelectorAll('.next-table-row');
        let ln = keywords.length;
        // 非已经存在搜索按钮
        if (ln && !document.querySelector('.next-table-row a i')) {
            for (let i = 0; i < ln; i++) {
                let kws_container = keywords[i].querySelectorAll(".next-table-cell-wrapper")[1].querySelector(
                    "span");
                let kw = kws_container.querySelector("a").textContent;
                let alibaba_link = document.createElement("a");
                setAttributes(alibaba_link, {
                    "href": `https://www.alibaba.com/products/${kw}.html?viewtype=G`,
                    "target": "_blank",
                    "rel": "noopener noreferrer",
                    "title": "在阿里巴巴搜索"
                });
                alibaba_link.innerHTML =
                    ` <i class="next-icon next-icon-search next-small next-search-icon"></i>`;
                let product_link = document.createElement("a");
                setAttributes(product_link, {
                    "href": `https://hz-productposting.alibaba.com/product/manage_products.htm?#/product/all/1-10/productKeyword=${kw}`,
                    "target": "_blank",
                    "rel": "noopener noreferrer",
                    "title": "在发布产品列表搜索"
                });
                product_link.innerHTML =
                    ` <i class="next-icon next-icon-search next-small next-search-icon"></i>`;
                if (!kws_container.querySelector('.next-table-row a i')) { // 动态加载fix
                    kws_container.appendChild(alibaba_link);
                    kws_container.appendChild(product_link);
                }
            }
            console.log("添加关键词指数页搜索按钮成功!!!");
        }
    }
    // 产品编辑页增强
    function productPublish() {
        let product_keywords;
        product_keywords = document.querySelectorAll(".posting-field-keywords li");
        function alibaba_link(kw) {
            let kw_search_link = document.createElement("a");
            setAttributes(kw_search_link, {
                "href": `https://www.alibaba.com/products/${kw}.html?viewtype=G`,
                "target": "_blank",
                "rel": "noopener noreferrer",
                "title": "在阿里巴巴搜索",
                "class": "alibaba_search",
            });
            kw_search_link.innerHTML = `<i class="next-icon next-icon-search next-small next-search-icon"></i>`;
            return kw_search_link;
        }
        for (let i = 0; i < product_keywords.length; i++) {
            let kw_container = product_keywords[i].querySelector(".next-input-control");
            kw_container.appendChild(alibaba_link(product_keywords[i].querySelector("input").value));
            product_keywords[i].querySelector("input").addEventListener('change', function (e) {
                kw_container.replaceChild(alibaba_link(this.value), kw_container.querySelector(
                    '.alibaba_search'));
            });
        }
        if (document.querySelectorAll("#productsm").length < 1) {
            let product_menu = document.querySelector('.next-menu-content')
            product_menu.insertAdjacentHTML('beforeend',
                '<li id="productpic" tabindex="-1" role="menuitem" class="next-menu-item next-nav-item"><span>上传图片</span></li>'
            );
            document.querySelector('#productpic').onclick = function () {
                let img_uploadButton = document.getElementsByClassName('upload-select-inner')[0].getElementsByTagName(
                    "button")[0]
                if (img_uploadButton.disabled) {
                    alert("产品图片已满，请删除部分图片后重新尝试上传！")
                } else {
                    img_uploadButton.click();
                    // document.querySelector('#productpic span').style.color = "orange"
                }
            }
            product_menu.insertAdjacentHTML('beforeend',
                '<li id = "productsc" tabindex="-1" role="menuitem" class="next-menu-item next-nav-item"><span>检测质量分</span></li'
            );
            document.querySelector('#productsc').onclick = function () {
                let rate = document.getElementById('struct-pinbar').getElementsByClassName('block-text default')[0]; // 产品质量分
                if (rate) {
                    rate.click()
                } else if (document.getElementById('struct-pinbar').getElementsByClassName('block-text')) {
                    document.getElementById('struct-pinbar').getElementsByClassName('block-text')[0].click();
                } else {
                    alert("检测出错！")
                }
                let product_score = document.getElementById('struct-pinbar').getElementsByClassName('number');
                window.setTimeout(function () {
                    if (product_score.length) {
                        document.querySelector('#productsc span').textContent =
                            `检测质量分(${product_score[0].textContent})`;
                    }
                }, 2500);
                let product_title = document.getElementById('productTitle').value;
                let product_titleCapitalize = document.createElement("span");
                product_titleCapitalize.className = "product_titleCapitalize";
                product_titleCapitalize.innerHTML = `<br>${Capitalize(product_title)}`;
                let product_title_container = document.getElementById('productTitle').parentNode.parentNode;
                product_title_container.appendChild(product_titleCapitalize);
                product_title_container.replaceChild(product_titleCapitalize, product_title_container.querySelector(
                    '.product_titleCapitalize'));
            product_titleCapitalize.onclick = function () {
                copy(product_titleCapitalize);
                product_titleCapitalize.innerHTML = "<br>Copied";
                window.setTimeout(function () {
                    product_titleCapitalize.innerHTML = `<br>${Capitalize(product_title)}`;
                }, 1500);
            }
            }
            product_menu.insertAdjacentHTML('beforeend',
                '<li id = "productsm" tabindex="-1" role="menuitem" class="next-menu-item next-nav-item"><span>提交产品</span></li'
            );
            document.querySelector('#productsm').onclick = function () {
                document.getElementsByClassName("next-btn next-btn-primary next-btn-large step-buttons")[0].click(); // 提交按钮
            }
        }
    }
    // 搜索关键词显示公司名
    function productSupplierDisplay() {
        let products;
        if (document.querySelector('.seb-refine-ctb__viewtype>a').classList.contains('active')) {
            products = document.querySelectorAll('.app-organic-search__list>div.J-offer-wrapper');
        } else {
            products = document.querySelectorAll('.organic-gallery-offer-outter');
        }
        let ln = products.length;
        function fireMouseEvents(element, eventNames) {
            if (element && eventNames && eventNames.length) {
                for (let index in eventNames) {
                    let eventName = eventNames[index];
                    if (element.fireEvent) {
                        element.fireEvent('on' + eventName);
                    } else {
                        let eventObject = document.createEvent('MouseEvents');
                        eventObject.initEvent(eventName, true, false);
                        element.dispatchEvent(eventObject);
                    }
                }
            }
        }
         let supplier_idx = 0
        for (let i = 0; i < ln; i++) {
            let supplier_container;
            // 视图切换按钮
            if (document.querySelector('.seb-refine-ctb__viewtype>a').classList.contains('active')) {
                supplier_container = products[i].querySelector(".list-no-v2-decisionsup__row");
            } else {
                supplier_container = products[i].querySelector(".organic-gallery-offer_bottom-align-section");
            }
            if (supplier_container && document.getElementById("d_switch").checked) {
                if (products[i].querySelector('.gallery-theme-card-default__image-ctn') || products[i].querySelector(
                        '.offer-theme-search')) {
                    continue; // 跳过广告位Discover Now
                } else {
                    supplier_idx = supplier_idx + 1;
                    if (!products[i].querySelector(".alisupplier_name")) {
                        let product_link = products[i].querySelector('a').href; // 获取产品链接
                        let product_title = products[i].querySelector('.elements-title-normal').textContent; // 获取产品名
                        // 控制台输出产品标题 测试使用
                        //console.log(i, product_title);
                        let product_inq, supplier_link, supplier_id = "";
                        if (document.querySelector('.seb-refine-ctb__viewtype>a').classList.contains('active')) {
                            product_inq = products[i].querySelector('.contact-supplier-btn').href;
                            supplier_link = products[i].querySelector('.list-no-v2-decisionsup__row>span a').href;
                            fireMouseEvents(products[i].querySelector(".list-no-v2-decisionsup__row>span a"), [
                                'mouseover', 'mousedown']); // 触发鼠标显示供应商信息
                        } else {
                            product_inq = products[i].querySelector('.organic-gallery-offer__bottom-v2 a').href; // 获取产品询盘链接
                            supplier_link = products[i].querySelector(".organic-gallery-offer__seller-company").href; // 获取供应商链接
                            fireMouseEvents(products[i].querySelector(".organic-gallery-offer__seller-company"), [
                                'mouseover', 'mousedown']); // 触发鼠标显示供应商信息
                        }
                        if (supplier_link.indexOf(".en.alibaba") != -1) {
                            supplier_id = supplier_link.substring(supplier_link.indexOf("//") + 2,
                                supplier_link.indexOf(".en.alibaba"))
                        } else {
                            supplier_id = "";
                        }
                        console.log(supplier_link, supplier_id);
                        let link = document.createElement("a");
                        setAttributes(link, {
                            "href": `${supplier_link}`,
                            "target": "_blank",
                            "class": "alisupplier_name",
                        });
                        // 采集到弹出供应商信息
                        if (document.querySelector(".next-overlay-wrapper .supplier-tag-popup__content_href")) {
                            if (!document.getElementById("force_supplier").checked) {
                                ;
                                if (supplier_id) {
                                    link.innerHTML = document.querySelector(
                                            ".next-overlay-wrapper .supplier-tag-popup__content_href").textContent +
                                        "(" +
                                        supplier_id + "," + supplier_idx +")";
                                } else {
                                    link.innerHTML = document.querySelector(
                                        ".next-overlay-wrapper .supplier-tag-popup__content_href").textContent + "(" + supplier_idx +")";
                                }
                                supplier_container.appendChild(link);
                                let supplier_opener = document.querySelector(".next-balloon-normal");
                                supplier_opener.parentNode.removeChild(supplier_opener);
                            }
                        }
                    }
                }
            }
        }
    }
    // 显示阿里巴巴标签页名称
    window.addEventListener('load', function () {
        let title_list = [".sc-hd-m-logo-anchor", ".av-change-container-title",
            ".auth-cent-list-container-title", ".product-task-title-name", ".top-bar-name",
                          ".home-header>.home-header-title", ".rank-header-title", ".next-card-title",
            ".next-feedback-title",
                          ".freight-template-app-title", ".showcase-zh>.fs22", ".inquiry-list-title", ".common-h1",
            ".title-wrapper>h1", ".live-manage-management-title>h3",
                          ".home-header-title", ".big-title", "h2.page-title>span", ".next-tabs-tab-inner>div",
            ".bp2-nav-bar>div", ".component-page-title", ".header-title", ".page-title>h3",
                          ".diagnosis-h3", ".collect-products-list h1", ".CGS_BASIC .page-title", "h2.sub-title",
                          ".title", ".title-text", ".photo-header-title", "h1", ".page-title", ".manage-title",
            ".ui-header-extend", "h2", "h3"];
        for (let i = 0; i < title_list.length; i++) {
            if (!
                /(w{3}|i|fundma|onetouch|waimaoquan|activity|alicrm|marketing|siteadmin|customize|offer)\.alibaba\.com/
                .test(document.URL)) {
                if (document.querySelector(title_list[i])) {
                    console.log(title_list[i], document.querySelector(title_list[i]));
                    document.title = document.querySelector(title_list[i]).textContent;
                    break;
                }
            }
        }
    }, false);
    if (/product_grow_up_manage/.test(document.URL)) {
        setInterval(productEdit, 2500);
        // 添加产品运营工作台产品编辑按钮
    } else if (/overview/.test(document.URL)) {
        setInterval(productAnalyse, 2000);
        // 添加产品分析页面按钮, 含零效果产品
    } else if (/(product-detail)|(\/product\/\d+-\d+)/.test(document.URL)) {
        setInterval(productDetail, 2500);
        // 添加产品详情页按钮
    } else if (/photobank/.test(document.URL)) {
        setInterval(productPhoto, 2500);
        // 添加图片银行直接下载原图按钮
    } else if (/keyword/.test(document.URL)) {
        setInterval(productKeywordIndex, 2500);
        // 添加关键词指数页搜索按钮
    } else if (/hz-productposting\./.test(document.URL)) {
        setInterval(productList, 2500);
        // 产品编辑页增强
    } else if (/(trade\/search)|(\/products\/)/.test(document.URL)) {
        // 添加搜索关键词显示公司名按钮
        if (document.getElementsByClassName('refine-filters__result-left')) {
            let dswitch = document.createElement('label');
            dswitch.innerHTML =
                "<input id='d_switch' type='checkbox'><div class='d_slider round'><span class='on'>ON</span><span class='off'>OFF</span></div>";
            dswitch.setAttribute('class', 'switch');
            document.getElementsByClassName('refine-filters__result-left')[0].appendChild(dswitch);
            document.getElementsByClassName('refine-filters__result-left')[0].innerHTML +=
                '<input type="checkbox" id="force_supplier" style="margin: .4rem;position:relative;top:-3px"><label for="force_supplier">强制显示供应商名称</label>';
        }
        setInterval(productSupplierDisplay, 2500);
    } else if (/post\.alibaba/ig.test(document.URL)) {
        window.addEventListener('load', productPublish(), false);
        // 产品编辑页增强
    }
})();
var main = setInterval(function() {
    var html = document.documentElement.outerHTML;
    var titles = document.head.querySelector("[name~=description][content]").content;
    if (titles)
    {
    var reg = /TotalLines%22%3A(\d+)%2C/g;
    var content = titles.substring(titles.indexOf("and") + 3);
    //alert(content);
    var number = reg.exec(html)[1]
    //alert(number)
    var div = document.querySelector(".next-tabs-nav");
    div.style.color = "red";
    div.style.fontWeight = "bold";
    var hr1 = document.createElement("hr");
    div.appendChild(hr1);
    var e = document.createElement("span");
    e.innerText = "经过磊哥演算，全店产品数量：" + number;
    div.appendChild(e);
    var hr2 = document.createElement("hr");
    div.appendChild(hr2);
    clearInterval(main);
    }
},
2000);
(function() {
    'use strict';
    //https://github.com/DeveloperMDCM
    // MDCM
let video = document.querySelector('#main-video > div > div > div > video');
const linkDiv = document.querySelector("#container > div.layout-content > div > div.screen-body > div.screen-layout > div.layout-left > div.main-layout > div.thumb-list > div > div > div.detail-next-slick-list");
const link = document.createElement('DIV');
linkDiv.appendChild(link);
link.innerHTML = `<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.button-container{
  background-color: red;
}
.button-container:hover{
  background-color: black;
}
a:hover{
  background-color: black;
}
</style>
<div style="margin: 6px 0;" class="container">
<button style=" width: 100%;border-radius: 20px; " class="button-container">
  <a style="color: #fff;"  class="link-descarga" href="#">Download Video</a>
</button>
</div>
`;
const download = async (url, filename) => {
  const data = await fetch(url)
  const blob = await data.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', objectUrl)
  link.setAttribute('download', filename)
  link.textContent = 'moises';
  link.click();
  const linkdescarga = document.querySelector('.link-descarga');
  linkdescarga.textContent = 'Espere un momento';
  setTimeout(()=>{
    linkdescarga.textContent = 'Download Video'
  },3000);
}
link.addEventListener('click', ()=>{
  video = document.querySelector('#main-video > div > div > div > video');
  console.log(video.src)
  download(`${video.src}`,'video-MDCM');
})
if(video) {
  setInterval(()=>{
    video = document.querySelector('#main-video > div > div > div > video').src;
  },1000);
};
})();