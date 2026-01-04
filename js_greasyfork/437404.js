// ==UserScript==
// @name        AE辅助 v6
// @namespace https://greasyfork.org/zh-CN/users/216246
// @version     6.1.8
// @description 2024-11-07重写 速卖通发货辅助：【订单列表页】添加商品中文名提示、数量高亮提示、合单发货提示;【订单详情页】添加商品中文名提示、订购总数量提示;【物流确认页】添加订单商品信息、多单商品信息、订单成本、预计利润等展示，添加物流最低价高亮显示;【物流列表页】订单包含商品信息展示;【评价管理】按指定页数自动5星好评;
// @icon        data:image/png;base64,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
// @author      H.ZH
// @require     https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/2.1.4/jquery.min.js
// @require     https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/limonte-sweetalert2/11.4.4/sweetalert2.all.min.js
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.10/clipboard.min.js
// @require     https://update.greasyfork.org/scripts/519530/1495106/layer-xiugai.js
// @require     https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @match       *://*.aliexpress.com/apps/home*
// @match       *://*.aliexpress.com/apps/order/detail*
// @match       *://*.aliexpress.com/m_apps/order-manage/orderDetail*
// @match       *://cainiao.aliexpress.com/export/ae/consign/select_solution.htm*
// @match       *://cainiao.aliexpress.com/export/ae/consign/createLgOrder.htm*
// @match       *://cainiao.aliexpress.com/export/ae/consign/create_lg_order.htm*
// @match       *://sg-cgmp.aliexpress.com/aex-seller-center/logistic/createLogistic
// @match       *://cgmp.aliexpress.com/ae-global-seller-center/logistics_order_list*
// @match       *://sg-cgmp.aliexpress.com/ae-global-seller-center/logistics_order_list*
// @match       *://sg-cgmp.aliexpress.com/aex-seller-center/logistic/logisticOrderManage*
// @match       *://cainiao.aliexpress.com/pickup/create_handover_order.htm*
// @match       *://*.aliexpress.com/apps/createlogistic/index*
// @match       *://*.aliexpress.com/apps/release/createlogistic/index*
// @match       *://*.aliexpress.com/apps/order/index*
// @match       *://feedback.aliexpress.com/management/feedbackSellerList.htm*
// @match       https://*.aliexpress.com/apps/product/publish*
// @match       https://sg-cgmp.aliexpress.com/aex-seller-center/aeg-receive-delivery/createReceiveDelivery*
// @match       https://sg-cgmp.aliexpress.com/aex-seller-center/aeg-receive-delivery/release/createReceiveDelivery*
// @match       *://csp.aliexpress.com/m_apps/aepop-product-publish/prePopToChoice/choice-edit*
// @match       *://csp.aliexpress.com/m_apps/logistic/ship_cn*
// @match       *://csp.aliexpress.com/m_apps/logistic/create_ship_cn*
// @grant       unsafeWindow
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/437404/AE%E8%BE%85%E5%8A%A9%20v6.user.js
// @updateURL https://update.greasyfork.org/scripts/437404/AE%E8%BE%85%E5%8A%A9%20v6.meta.js
// ==/UserScript==

(function () {
    "use strict";

    GM_addStyle(`
        .dz-input-danger:focus{border-color: #FF5722 !important;}
    `)
    //时间格式化
    Date.prototype.format = function (fmt) {
        var o = {
            "Y+": this.getFullYear().toString(),
            "M+": (this.getMonth() + 1).toString(), //月份
            "d+": this.getDate().toString(), //日
            "h+": this.getHours().toString(), //小时
            "m+": this.getMinutes().toString(), //分
            "s+": this.getSeconds().toString(), //秒
            "q+": (Math.floor((this.getMonth() + 3) / 3)).toString(), //季度
            S: this.getMilliseconds().toString(), //毫秒
        };
        for (var k in o) {
            var res = new RegExp("(" + k + ")").exec(fmt)
            if (res) {
                fmt = fmt.replace(
                    res[1],
                    res[1].length == 1
                        ? o[k]
                        : o[k].padStart(res[1].length, "0")
                );
            }
        }
        return fmt;
    };
    /** 一些原始固定值 */
    const constant = {
        FDate: {
            nowDate: () => new Date().format("YYYY-MM-dd"),
            nowTime: () => new Date().format("YYYY-MM-dd hh:mm:ss"),
            getDate: function (d) {
                return d ? new Date(d).format("YYYY-MM-dd") : this.nowDate();
            },
            diffDay: function (sDate, eDate) {
                //2参数没做格式验证
                sDate = Date.parse(sDate);
                eDate = Date.parse(eDate);
                return Math.abs(Math.ceil((eDate - sDate) / (1 * 24 * 60 * 60 * 1000)));
            },
        },
        //数据过期时间,单位:天
        dataExpTime: 7,
        //本地存储
        storageOptions: {
            //存储默认key前缀
            defaultPrefix: "_dz_",
            //订单信息本地存储保存最长时间(天)
            orderDataExpireDate: 7
        },
        //计算订单利润/商品发布价格用的属性(非固定)
        calcOptions: {
            key: 'calc_options',
            //美元兑人民币汇率
            u2r: GM_getValue("_dz_u2r", 7),
            //平台佣金
            commission: 0.08,
            //物流打包包装重量(kg)
            packing_weight: 0.005,
            //物流价格系数
            freight_rate: 185,
            //可打的最大折扣
            max_discount: 0.4,
            //计算商品发布价格时默认折扣
            off_sale: 0.3,
            //默认N倍成本利润系数
            profit: 1.3,
            //报价方式 usd | rmb
            curreny: 'usd'
        },
        orderOptions: {
            storagePrefix: 'order_'
        },
        productOptions: {
            weight: {
                "2mm": 5, "3mm": 6, "4mm": 10, "6mm": 20, "8mm": 30, "10mm": 55, "3x5mm": 7, "5x7mm": 20, "8x11mm": 46, "JZ-3mm": 5, "JZ-4mm": 7, "JZ-6mm": 10
            }
        },
        dzApi: {
            base: "https://www.longingbeads.top/api",
            api: {
                itemsAttrs: "/v1/product/itemsAttrs",
                recordOrders: "/v1/order/recordOrders",
                fetchOrder: "/v1/order/fetchOrder"
            }
        },
        aePage: {
            base: "https://csp.aliexpress.com",
            path: {
                orderIndex: "/apps/order/index",
                orderDetail: "/apps/order/detail",
                createLogistic: "/aex-seller-center/logistic/createLogistic",
                logisticOrderManage: "/aex-seller-center/logistic/logisticOrderManage",
                feedbackSellerList: "/management/feedbackSellerList.htm",
                logisticShipCN: "/m_apps/logistic/ship_cn",
                logisticCreateShipCN: "/m_apps/logistic/create_ship_cn",
                newOrderDetail: "/m_apps/order-manage/orderDetail"
            },
        },
        successRes: (data = {}, msg = 'success') => ({
            code: 0, msg, data
        }),
        errorRes: (data = {}, msg = 'error') => ({
            code: 1, msg, data
        }),
        linelist: {
            "菜鸟超级经济": 1, "Cainiao Super Economy": 1, "菜鸟超级经济Global": 1, "Cainiao Super Economy Global": 1, "菜鸟特货专线－超级经济": 1, "Cainiao Super Economy for Special Goods": 1, "菜鸟专线经济": 1, "Cainiao Expedited Economy": 1, "菜鸟超级经济-顺友": 1, "SunYou Economic Air Mail": 1, "菜鸟超级经济-燕文": 1, "Yanwen Economic Air Mail": 1, "中国邮政平常小包+": 1, "China Post Ordinary Small Packet Plus": 1, "菜鸟无忧特惠专线": 2, "AliExpress Saver Shipping": 2, "菜鸟特货专线－简易": 2, "Cainiao Saver Shipping For Special Goods": 2, "菜鸟无忧物流-标准": 2, "AliExpress Standard Shipping": 2, "菜鸟无忧集运-沙特": 2, "Aliexpress Direct": 2, "菜鸟无忧集运-阿联酋": 2, "Aliexpress Direct": 2, "菜鸟无忧集运-阿曼": 2, "Aliexpress Direct": 2, "菜鸟无忧集运-卡塔尔": 2, "Aliexpress Direct": 2, "菜鸟无忧集运-巴林": 2, "Aliexpress Direct": 2, "中国邮政挂号小包": 2, "China Post Registered Air Mail": 2, "燕文航空挂号小包": 2, "Special Line-YW": 2, "菜鸟无忧物流-优先": 3, "AliExpress Premium Shipping": 3, "菜鸟特货专线－标快": 3, "Cainiao Standard - SG Air": 3, "DHL": 3, "DPEX": 3, "EMS": 3, "E特快": 3, "e-EMS": 3, "Fedex IE": 3, "Fedex IP": 3, "顺丰速运": 3, "SF Express": 3, "UPS全球快捷": 3, "UPS Expedited": 3, "UPS全球速快": 3, "UPS Express Saver": 3
        }
    };

    const commonUtils = () => {
        const { storageOptions, calcOptions, orderOptions, successRes, errorRes, FDate } = constant;

        const locationHref = location.href;

        const getLocationUrl = () => location.href;

        /** 检查对象是否为空 */
        const isEmptyObject = (obj) => {
            let name;
            for (name in obj) {
                return false;
            }
            return true;
        }
        /**
         * 检查空值： [undefined, null, NaN, [], {}], 注意值：0, false 为非空;
         */
        const isEmpty = (value) => {
            switch (Object.prototype.toString.call(value)) {
                case '[object Undefined]':
                    return value === void 0;
                case '[object Null]':
                    return value === null;
                case '[object Number]':
                    return isNaN(value);
                case '[object String]':
                    return value === "";
                case '[object Boolean]':
                    return false;
                case '[object Object]':
                    return Object.keys(value).length === 0;
                case '[object Array]':
                    return value.length === 0;
                default:
                    return false;
            }
        }

        /**
         * 检查字符串是否是json格式
         * @param {string} str 待检查字符串
         * @returns boolean
         */
        const isJSONString = (str) => {
            if (typeof str === "string") {
                try {
                    const obj = JSON.parse(str);
                    if (typeof obj === "object" && obj) {
                        return true
                    }
                } catch (e) {
                    return false;
                }
            }
            return false;
        }
        /** 分析URL */
        const parseURL = function (href) {
            let url = new URL(href),
                searchParams = new URLSearchParams(url.search),
                obj = {};
            searchParams = Object.fromEntries(searchParams);
            obj.protocol = url.protocol;
            obj.hostname = url.hostname;
            obj.port = url.port;
            obj.pathname = url.pathname;
            obj.search = searchParams;
            obj.hash = url.hash;
            return obj;
        }

        /**  从本地存储读取数据 */
        const getItem = (key, defaultValue, prefix) => {
            return GM_getValue((!prefix && prefix != '' ? storageOptions.defaultPrefix : prefix.toString()) + key, defaultValue);
        }

        /** 保存数据到本地 */
        const setItem = (key, value, prefix) => {
            GM_setValue((!prefix && prefix != '' ? storageOptions.defaultPrefix : prefix.toString()) + key, value);
        }

        /** 删除本地数据 */
        const deleteItem = (key, prefix) => {
            GM_deleteValue((!prefix && prefix != '' ? storageOptions.defaultPrefix : prefix.toString()) + key);
        }

        /** 商家Id */
        const getSellerId = () => (unsafeWindow.globalDadaConfig && unsafeWindow.globalDadaConfig.sellerId) || unsafeWindow?.vmData?.pageTrackingParams?.cspSellerId;

        /** 店铺所有商品属性 */
        const getItemAttrs = (sellerId) => getItem(`item_attrs_${sellerId}`, {});

        /** 获取计算订单利润/商品发布价格用属性 */
        const getCalcOptions = () => getItem(calcOptions.key, calcOptions);

        /** 设置允许数据互通的店铺 */
        const setAllowStore = (data) => {
            setItem("stores", data || []);
        }


        /** 获取允许数据互通的店铺 */
        const getallowStores = () => getItem("stores", []);

        /** 数值取小数点N后位 */
        const toFixed = (num, l = 2) => Number(new RegExp("^-?\\d+(?:\\.\\d{0,2})?").exec(num) ? new RegExp("^-?\\d+(?:\\.\\d{0," + l + "})?").exec(num)[0] : 0);

        /** 正则匹配值 */
        const getMatchStr = (str, exp) => {
            if (!str || !exp) return null;
            let res = str.match(new RegExp(`${exp}`));
            return res ? res[1] : null;
        }

        /** 控制台显示错误提示 */
        const showError = (msg) => {
            console.warn && console.warn('DZ hint: ' + msg);
        }
        /** 休眠等待一定时间*/
        const sleep = (time = 1e3) => new Promise((resolve) => setTimeout(resolve, time));
        /**
         * API签名
         * @param {object} data 数据对象,格式为json
         * @returns string|boolean
         */
        const apiSign = (data) => {
            data = JSON.stringify(data);
            if (!isJSONString(data)) return false;
            const t = new Date().getTime();
            const appKey = getItem("app_key", "", storageOptions.defaultPrefix);
            const appSecret = getItem("app_secret", "", storageOptions.defaultPrefix);
            if (!appKey || !appSecret) {
                return false;
            }
            const sign = CryptoJS.MD5(appSecret + "&" + t + "&" + appKey + "&" + data).toString();
            return { t, appKey, sign };
        }

        /** Ajax请求 */
        const ajaxRequest = (url, options = { data: [] }) => {
            const { data, ...setting } = options;
            const { t, appKey, sign } = apiSign(data);
            const postData = JSON.stringify(data);

            return new Promise((resolve, reject) => {
                $.ajax(
                    Object.assign(
                        {
                            url,
                            method: 'post',
                            dataType: 'json',
                            data: { t, appKey, sign, data: encodeURIComponent(postData) },
                            success: (result) => {
                                resolve(result);
                            },
                            error: (xhr) => {
                                reject(xhr.responseText);
                            }
                        },
                        setting
                    )
                )
            })
        }

        /** 更新采购提示信息 */
        const updatePurshasingTips = (
            orderId,
            skuItemInfo = {
                image: "",
                name: "",
                spu: "",
                sku: "",
                cost: 0,
                weight: 0,
                diameter: "",
                qty: ""
            },
            tips
        ) => {
            const info = getItem(orderId, {}, orderOptions.storagePrefix);
            info['orderId'] = orderId;
            const tipsText = tips + "-" + skuItemInfo.diameter + "x" + skuItemInfo.qty;
            const nameTipsText = skuItemInfo.name + "-" + skuItemInfo.diameter + "x" + skuItemInfo.qty;
            const skuTipsText = skuItemInfo.spu + "-" + skuItemInfo.diameter + "x" + skuItemInfo.qty;
            if (info["purshasingTips"]) {
                if (info["purshasingTips"].indexOf(nameTipsText) >= 0)
                    tipsText != nameTipsText && (info["purshasingTips"] = info["purshasingTips"].replace(nameTipsText, tipsText));
                else if (info["purshasingTips"].indexOf(skuTipsText) >= 0)
                    tipsText != skuTipsText && (info["purshasingTips"] = info["purshasingTips"].replace(skuTipsText, tipsText));
                else
                    info["purshasingTips"] += "," + tipsText;
            } else {
                info["purshasingTips"] = tipsText;
            }
            setItem(orderId, info, orderOptions.storagePrefix);
            return info["purshasingTips"];
        }
        /** 更新采购列表 */
        const updatePurshasingData = (
            orderId,
            skuItemData = {
                image: "",
                name: "",
                spu: "",
                sku: "",
                cost: 0,
                weight: 0,
                diameter: "",
                qty: 1
            }) => {
            const { image, ...itemData } = skuItemData;
            const storagePurshasingData = getItem("purshasing_list", []);
            const todayDate = FDate.nowDate();
            const todayDataIndex = storagePurshasingData.findIndex((item) => item.date == todayDate);
            let todayPurshasingData = storagePurshasingData[todayDataIndex];
            if (isEmpty(todayPurshasingData)) {
                todayPurshasingData = {
                    "date": todayDate,
                    "list": {},
                }
                todayPurshasingData.list[skuItemData["spu"]] = {
                    image,
                    orders: [orderId],
                    skus: [itemData]
                }
                storagePurshasingData.push(todayPurshasingData)
            } else {
                if (skuItemData["spu"] in todayPurshasingData.list) {
                    const orders = todayPurshasingData.list[skuItemData["spu"]]["orders"];
                    if (orders.includes(orderId)) {
                        return;
                    }
                    const findIndex = todayPurshasingData.list[skuItemData["spu"]]["skus"].findIndex((item) => item.sku == skuItemData.sku);
                    todayPurshasingData.list[skuItemData["spu"]]["orders"].push(orderId);
                    if (findIndex !== -1) {
                        todayPurshasingData.list[skuItemData["spu"]]["skus"][findIndex]["qty"] += Number(skuItemData.qty);
                    } else {
                        todayPurshasingData.list[skuItemData["spu"]]["skus"].push(itemData);
                    }
                } else {
                    todayPurshasingData.list[skuItemData["spu"]] = {
                        image,
                        orders: [orderId],
                        skus: [itemData]
                    };
                }
                storagePurshasingData[todayDataIndex] = todayPurshasingData;
            }
            setItem("purshasing_list", storagePurshasingData);
        }

        return {
            locationHref,
            getLocationUrl,
            parseURL,
            isEmptyObject,
            isEmpty,
            isJSONString,
            getItem,
            setItem,
            deleteItem,
            getSellerId,
            getItemAttrs,
            getCalcOptions,
            setAllowStore,
            getallowStores,
            toFixed,
            getMatchStr,
            showError,
            apiSign,
            ajaxRequest,
            sleep,
            updatePurshasingTips,
            updatePurshasingData
        };
    }

    const domUtils = () => {
        const { productOptions } = constant;
        const { isEmpty, } = commonUtils();
        /**
         * Form 表单验证
         * @param elem dom JQ对象
         */
        const formVerify = (elem) => {

            let verify = {
                required: [/[\S]+/, "必填项不能为空"],
                number: function (value) {
                    if (!value || isNaN(value)) return "只能填写数字";
                },
            },
                stop = !0,
                warning = `dz-input-danger`;
            const verifyElem = elem.find("[verify]");
            $.each(verifyElem, function (idx, item) {
                let that = $(this),
                    vers = that.attr("verify").split("|"),
                    value = that.val();
                that.removeClass(warning);
                $.each(vers, function (_, thisVer) {
                    var isTrue, //是否命中校验
                        errorText = "", //错误提示文本
                        isFn = typeof verify[thisVer] === "function";
                    if (verify[thisVer]) {
                        var isTrue = isFn
                            ? (errorText = verify[thisVer](value, item))
                            : !verify[thisVer][0].test(value);
                        errorText = errorText || verify[thisVer][1];
                        if (isTrue) {
                            that.addClass(warning);
                            item.focus();
                            stop = false
                            return stop;
                        }
                    }
                });
                if (!stop) return stop;
            });
            return stop;
        };


        /** 生成一个按钮 */
        const renderBtn = (options, clickCallback = () => { }) => {
            return $("<button>",
                {
                    type: "button",
                    id: options?.id ?? "",
                    class: options?.className ?? "next-btn next-medium next-btn-normal",
                    text: options?.text ?? "★按钮★"
                })
                .on('click', function () {
                    typeof clickCallback === 'function' ? clickCallback.call(this) : '';
                })
        }

        const renderTableRow = (className = "next-table-row", style = "") => {
            return $("<tr></tr>", { "class": className, style });
        }

        const renderTableCell = (content = "", className = "next-tabl-cell", style = "") => {
            return $("<td></td>", { "class": className, style }).html(content);
        }

        const renderTableCellContent = (content = "", className = "next-table-cell-wrapper", style = "") => {
            return $("<div></div>", { class: className, style }).html(content);
        }

        /**
         * 根据采购数据生成采购表格
         * @param {Array} data 采购列表数据
         * @param {Number} rows 单个采购商品占据表格行数
         */
        const renderPurshasingTable = (data = {}, rows = 14) => {
            if (isEmpty(data)) {
                return null
            }
            const tableElem = $("<table></table>", { style: "border-collapse:collapse;border:0;" })
                .append("<thead><th>图片</th><th>名称</th><th>尺寸</th><th>数量</th></thead>");
            //名称占几行
            const nameRows = 1;
            const blankFillText = "&nbsp;";
            //因为有array.shift()操作,所以这里data要复制一份
            data = JSON.parse(JSON.stringify(data));
            Object.keys(data).forEach(index => {
                const item = data[index];
                const imgSrc = item?.image ? item.image + "_220x220.jpg" : null;
                const totalSkus = item?.skus?.length ?? 0;
                rows = totalSkus > rows ? totalSkus : rows;
                //名称列前置空白格数量
                const nameColumnPreBlankCellCount = Math.ceil((rows - nameRows) / 2);
                //sku/数量列前置空白格数量
                const skuColumnPreBlankCellCount = Math.ceil((rows - totalSkus) / 2);
                let skuItem = null;
                for (var i = 0; i < rows; i++) {
                    const rowElem = $("<tr></tr>");
                    i === 0 && rowElem.append(
                        renderTableCell(imgSrc ? $("<img>", { src: imgSrc, width: "220px" }) : index, "", "border:1px solid #d4d4d4;")
                            .attr("rowSpan", rows)
                    );

                    //产品名称列
                    if (i === nameColumnPreBlankCellCount) {
                        const itemName = item?.skus?.[0]?.name || index;
                        rowElem.append(renderTableCell(index.indexOf("N") === 0 ? itemName : index, "", "border:1px solid #d4d4d4;"));
                    } else {
                        rowElem.append(renderTableCell(blankFillText, "next-tabl-cell", "border:1px solid #d4d4d4;"));
                    }
                    //sku,diameter,qty列
                    if (i >= skuColumnPreBlankCellCount) {
                        skuItem = item?.skus?.shift()
                        rowElem.append(renderTableCell(skuItem ? skuItem.diameter : blankFillText, "", "border:1px solid #d4d4d4;"))
                            .append(renderTableCell(skuItem ? "x" + skuItem.qty : blankFillText, "", "border:1px solid #d4d4d4;"));
                    } else {
                        rowElem.append(renderTableCell(blankFillText, "", "border:1px solid #d4d4d4;"))
                            .append(renderTableCell(blankFillText, "", "border:1px solid #d4d4d4;"));
                    }
                    tableElem.append(rowElem);
                }
            })
            return tableElem;
        }
        /**
         * 商品尺寸对应重量提示表格
         */
        const renderItemWeightTipsTable = () => {
            const diameterWeight = productOptions.weight;
            const tableElem = $("<table></table>");
            const theadRowElem = renderTableRow(), tbodyElem = renderTableRow();
            theadRowElem.append($("<th></th>", { class: "next-table-cell next-table-header-node" }).html(renderTableCellContent("直径重量提示")));
            tbodyElem.append(renderTableCell(renderTableCellContent("重量(单位:g)")));
            Object.keys(diameterWeight).forEach((item) => {
                theadRowElem.append($("<th></th>", { class: "next-table-cell next-table-header-node" }).html(renderTableCellContent(item)));
                tbodyElem.append(renderTableCell(renderTableCellContent(diameterWeight[item] / 1000)));
            })
            return tableElem
                .append(
                    $("<thead></thead>").append(theadRowElem)
                )
                .append(
                    $("<tbody></tbody>").append(tbodyElem)
                );
        }

        const nodeMutationObserver = (targetNode, callback) => {
            if (!targetNode) return;
            const config = {
                childList: true,
                attributes: true,
                subtree: true,
                characterData: true
            }
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        console.log('DOM changed:', mutation);
                        typeof callback === "function" && callback();
                    }
                }
            })
            observer.observe(targetNode, config);
            return observer;
        }

        return {
            formVerify,
            renderBtn,
            renderTableRow,
            renderTableCell,
            renderTableCellContent,
            renderPurshasingTable,
            renderItemWeightTipsTable,
            nodeMutationObserver
        }
    }

    const aeDomUtils = () => {
        const { sleep, locationHref, getLocationUrl, getItem, setItem, isEmptyObject, getMatchStr, updatePurshasingTips, updatePurshasingData } = commonUtils()
        const { productOptions, aePage, orderOptions } = constant
        //============订单列表页 apps/order/index================

        /** 当前页码 */
        const getCurrentPage = () => $(".next-pagination .next-current").text().trim();

        /** 当前limit */
        const getCurrentLimit = () => $(".next-pagination-size-selector").length > 0
            ? $(".next-pagination-size-selector em").text().trim()
            : $(".pagesize-select em").text().trim();

        /** 生成订单详情页url */
        const buildOrderDetailUrl = (orderId) => {
            const { parseURL } = commonUtils();
            const parsedUrl = parseURL(locationHref);
            delete parsedUrl.search['orderTab'];
            delete parsedUrl.search['spm'];
            parsedUrl.search['orderId'] = orderId;
            return parsedUrl.protocol + "//" + parsedUrl.hostname + aePage.path.orderDetail + "?" + $.param(parsedUrl.search);
        }

        /** 生成订单详情页url */
        const buildLogisticCreateUrl = (orderId) => {
            return aePage.base + aePage.path.logisticCreateShipCN + "?trade_order_id=" + orderId + "&shipType=3PL&channelId=565293";
        }
        /**
         * 创建订单提示
         * @param {string} tipsText
         */
        const renderCommonTipsElem = (tipsText = "", className, style = "color:#ff5e00") => {
            return $('<div></div>', { 'class': 'row ' + (className ?? ''), style, 'text': tipsText });
        }

        /**
         * 创建订单多单提示
         * @param {string} tipsText
         */
        const renderRelatedOrdersElem = (orderId, relatedOrderIds) => {
            const elem = [];
            if (Array.isArray(relatedOrderIds) && relatedOrderIds.length > 0) {

                relatedOrderIds.forEach(item => {
                    let links = [$("<a>", { href: buildOrderDetailUrl(item), target: "_blank", style: "color:#ff5e00", text: item })];
                    locationHref.indexOf(aePage.path.logisticShipCN) >= 0 && links.push(
                        $("<a>", { href: buildLogisticCreateUrl(item), target: "_blank", text: " 填单" })
                    )
                    item !== orderId
                        && elem.push(renderCommonTipsElem("", "dz-other-orders").append(links));
                });
            }
            return elem;
        }

        /** 创建订单多单提示节点元素 */
        const renderMultiOrderTipElem = (orderId, memberId, members) => {
            let elem = [];
            if (!orderId) return elem;
            //检查,标记订单时
            if (memberId && !isEmptyObject(members)) {
                const orderIds = members[memberId];
                orderIds && orderIds.length > 1 && (elem = [
                    renderCommonTipsElem(`多单x${orderIds.length}`, "dz-other-order-tips"),
                    renderCommonTipsElem('其它订单:', 'dz-other-order-text', ''),
                    ...renderRelatedOrdersElem(orderId, orderIds.filter(item => item != orderId))
                ]);
                //刷新页面时
            } else {
                //读取本地存储的订单信息
                const orderInfo = getItem(orderId, null, orderOptions.storagePrefix)
                if (orderInfo) {
                    //添加采购提示
                    if ('purshasingTips' in orderInfo) {
                        elem.push(renderCommonTipsElem(orderInfo.purshasingTips, "dz-purshasing-tips"));
                    }
                    //添加多单提示
                    if ('relatedOrderTips' in orderInfo && orderInfo.relatedOrderTips) {
                        elem.push(renderCommonTipsElem(orderInfo.relatedOrderTips + "(原始)", "dz-other-order-tips"));
                    }
                    //添加多单中其它订单
                    if ('relatedOrders' in orderInfo && orderInfo.relatedOrders.length > 0) {
                        elem.push(renderCommonTipsElem('其它订单:', 'dz-other-order-text', ''));
                        elem = [...elem, ...renderRelatedOrdersElem(orderId, orderInfo.relatedOrders)];
                    }
                }
            }
            return elem;
        }
        /** 高亮订单商品大于1的qty */
        const highlightQty = (elem) => {
            if (!(elem instanceof jQuery)) {
                elem = $(elem)
            }
            let orderQtyElem = elem.find(".quantity,.count");
            if (orderQtyElem.length > 0) {
                orderQtyElem.text().trim() != "x1" && orderQtyElem.text().trim() != "1" && orderQtyElem.find(".tb-text").css({ "color": "#ff5e00", "border": "1px solid #ff5e00", "background-color": "#fff2eb", "padding": "0 3px" })
            } else {
                orderQtyElem = elem.find("tr:gt(0)");
                $.each(orderQtyElem, (index, item) => {
                    orderQtyElem = $(item).find("td:eq(1)");
                    const orderQty = orderQtyElem.text().replace("下单：", "").trim();
                    if (Number(orderQty) > 1) {
                        orderQtyElem.find("div:last").css({ "background-color": " #fff3e0", "border": "1px solid #fedca5", "border-radius": "2.5px", "color": "#e95200" });
                    }
                })
            }

        }

        /**
         * 创建商品名称提示信息dom
         * @param {string} tipsText 提示文本
         */
        const renderProductNameTipElem = (tipsText) => {
            return $("<span>", { "class": "dz-product-name-tips", "style": "font-weight:700", text: `(${tipsText ?? ""})` });
        }

        /** 添加图片放大按钮 */
        const renderZoomInImageBtn = (images = {
            "title": "", //相册标题
            "id": 123, //相册id
            //"start": 0, //初始显示的图片序号，默认0
            "data": [   //相册包含的图片，数组格式
                {
                    "alt": "",
                    "src": "", //原图地址
                    "thumb": "" //缩略图地址
                }
            ]
        }) => {
            return $("<a>", { href: "javascript:void(0);", style: "display:block;", text: "放大图片" })
                .on("click", function () {
                    layer.photos({
                        photos: images,
                    })
                })
        }

        /**
         * @param {JQuery<HTMLElement>} elem 包含订单商品信息的Dom元素
         * @param {object} itemAttrs 所有商品的属性信息
         * @returns 名称提示信息dom
         */
        const appendProductNameTips = (elem, itemAttrs = {}) => {
            let tipsElem = null;
            if (elem.length > 0) {
                $.each(elem.find(".table-cell-item"), (index, item) => {
                    const that = $(item)
                    if (that.text().indexOf("商品编码") >= 0 || that.text().indexOf("Product Code") >= 0) {
                        const skuElem = that.find(".table-cell-item-value")
                        const skuText = skuElem.text().toUpperCase().trim();
                        const productNameTipText = (!isEmptyObject(itemAttrs) && (skuText in itemAttrs)) ? (itemAttrs[skuText]?.name ?? skuText) : skuText;
                        tipsElem = renderProductNameTipElem(productNameTipText);
                        skuElem.find(".show-text").after(tipsElem)
                    }
                })
            }
            return tipsElem;
        }

        /**
         * 添加标记缺货提示按钮
         * @param {object} orderInfo 点击按钮对应订单的订单信息
         * @param {Function} clickCallback 按钮点击
         */
        const renderStockupBtn = (orderId, skuItemInfo, clickCallback) => {
            return $(
                "<span>",
                {
                    "data-orderid": orderId,
                    style: "color:#fff;background:#3d8eff;width:1.25rem;height:1.25rem;cursor: pointer;display:inline-block;text-align:center;",
                    text: "补"
                },
            ).on("click", function () {
                typeof clickCallback === "function" && clickCallback.call(this, skuItemInfo)
            })
        }

        /** 获取行商品信息 */
        const findItemDomInfo = (rowElem, itemAttrs = {}) => {
            const itemInfo = {
                image: "",
                name: "",
                spu: "",
                sku: "",
                cost: 0,
                unitPrice: 0,
                weight: 0,
                diameter: "",
                qty: 1
            };
            if (!rowElem || rowElem.length === 0) {
                return itemInfo;
            }
            const productInfoElem = rowElem.find(".tb-product-info");

            if (productInfoElem.length > 0) {
                const imgElem = productInfoElem.find(".tb-product-info-image-img");
                const qtyElem = rowElem.find('.quantity').length > 0 ? rowElem.find('.quantity') : rowElem.find('.count');

                itemInfo.image = imgElem.length > 0 ? imgElem.attr("src").replace("_50x50.jpg", "") : "";
                itemInfo.qty = Number(getMatchStr(qtyElem.text(), "([0-9]+)"));
                itemInfo.logistics = rowElem.find(".logistics .show-text:eq(0)").text();
                $.each(productInfoElem.find(".table-cell-item"), (index, item) => {
                    const that = $(item)
                    if (that.text().indexOf("商品编码") >= 0 || that.text().indexOf("Product Code") >= 0) {
                        const skuElem = that.find(".table-cell-item-value .show-text")
                        itemInfo.sku = skuElem.text().toUpperCase().trim();
                        itemInfo.diameter = that.prev().text();
                        itemInfo.diameter = getMatchStr(itemInfo.diameter, "([0-9Xx-]+mm)");
                        if (!isEmptyObject(itemAttrs)) {
                            const skuItem = itemAttrs[itemInfo.sku];
                            itemInfo.name = skuItem?.name ?? itemInfo.sku;
                            itemInfo.spu = skuItem?.psku || skuItem?.spu || "";
                            itemInfo.cost = skuItem?.cost || 0;
                            itemInfo.weight = Number(skuItem?.weight || productOptions[itemInfo.diameter]?.weight) || 0;
                        } else {
                            itemInfo.name = itemInfo.sku;
                            itemInfo.spu = itemInfo.sku.split("-")[0];
                        }
                    }
                })
            }
            const unitPriceElem = rowElem.find(".price .tb-text");
            if (unitPriceElem.length > 0) {
                itemInfo.unitPrice = Number(getMatchStr(unitPriceElem.text().replace(",", ""), "([0-9.]+)"));
            }
            return itemInfo;
        }

        /**
         * 追加订单各种提示信息
         * @param { JQuery<HTMLElement> } orderItemRowsDom 订单商品所有行节点Dom
         * @param { object } itemAttrs 店铺所有商品属性信息
         * @param { boolean} isChecked 是否是检查后标记
         */
        const appendTips = (orderItemRowsDom, itemAttrs, isChecked = false) => {
            const ownerMemberOrders = isChecked ? getItem("member_orders", {}) : {};
            let orderId = "", orderInfo = {};
            $.each(orderItemRowsDom, (idx, elem) => {
                const that = $(elem)
                //检查行是否有订单信息
                const orderInfoElem = that.find('.tb-order-info');

                if (orderInfoElem.length > 0) {
                    orderId = orderInfoElem.find('a:eq(0)').text();
                    const buyerInfoElem = that.find(".dada-buyer-info");
                    const ownerMemberId = getMatchStr(buyerInfoElem.find("a.buyer-name").attr("href"), "ownerMemberId=([^&]+)");
                    const orderTipsElem = isChecked ? renderMultiOrderTipElem(orderId, ownerMemberId, ownerMemberOrders) : renderMultiOrderTipElem(orderId);

                    orderInfo = getItem(orderId, {}, orderOptions.storagePrefix);
                    if (orderTipsElem.length > 0) {
                        orderInfoElem.append(orderTipsElem)
                    }
                    if (isChecked) {
                        //存储多单信息
                        const relatedOrders = (ownerMemberOrders[ownerMemberId] || []).filter(item => item != orderId)
                        const relatedOrderTips = (ownerMemberOrders[ownerMemberId] && ownerMemberOrders[ownerMemberId].length > 1) ? "多单x" + ownerMemberOrders[ownerMemberId].length : "";
                        orderInfo = Object.assign(orderInfo, { orderId, relatedOrders, relatedOrderTips });
                        setItem(orderId, orderInfo, orderOptions.storagePrefix);
                    }
                }

                if (!isChecked) {
                    //sku所有商品信息
                    const skuItemInfo = findItemDomInfo(that, itemAttrs);

                    const imageElem = that.find(".tb-product-info-image-img");
                    const zoomInBtn = renderZoomInImageBtn({
                        "title": skuItemInfo.spu, //相册标题
                        "id": skuItemInfo.spu, //相册id
                        //"start": 0, //初始显示的图片序号，默认0
                        "data": [   //相册包含的图片，数组格式
                            {
                                "alt": skuItemInfo.name,
                                "src": imageElem.length > 0 ? imageElem.attr("src").replace("_50x50.jpg", "") : "", //原图地址
                                "thumb": imageElem.length > 0 ? imageElem.attr("src") : "" //缩略图地址
                            }
                        ]
                    })
                    imageElem.parent().after(zoomInBtn);
                    //高亮显示数量大于1的
                    highlightQty(that);
                    //添加sku对应中文名显示,高亮显示商品尺寸
                    const productInfoElem = that.find(".tb-product-info-info");
                    const tipsElem = appendProductNameTips(productInfoElem, itemAttrs);
                    if (tipsElem) {
                        //orderInfoElem和orderInfo不能在这里作为参数再次回传
                        //这里不能用上面直接使用orderInfo,因为它是会变的
                        //也不能作为参数传递给renderStockupBtn()后再callback()回传过来,因为这样它会被固定为传入时的值.这样后面修改后,如果再次操作得到的info值还是原先的
                        //也不能用orderInfoElem,同样的道理
                        const stockupBtnElem = renderStockupBtn(orderId, skuItemInfo, function (skuItemData) {
                            let tipsText = "";
                            const that = $(this);//当前点击的 "补"货按钮

                            //这里rowElem需要重新获取
                            const rowElem = that.closest('tr.next-table-row');

                            layer.confirm(
                                "请选择用SKU或名称添加备注",
                                {
                                    title: "如何添加备注?",
                                    btn: ["名称", "SKU", "取消"],
                                    end: () => {
                                        if (tipsText == "") return;
                                        //上级最近的行

                                        let orderInfoElem = null;
                                        if (rowElem.find(".tb-order-info").length > 0) {
                                            orderInfoElem = rowElem.find(".tb-order-info");
                                        } else {
                                            //遍历行同级所有行
                                            $.each(rowElem.prevAll(), (index, item) => {
                                                const that = $(item);
                                                if (that.find(".tb-order-info").length > 0) {
                                                    orderInfoElem = that.find(".tb-order-info");
                                                    return false;
                                                }
                                            })
                                        }
                                        let orderId = "";
                                        //订单列表页
                                        if (orderInfoElem && orderInfoElem.length > 0) {
                                            orderId = orderInfoElem.find('a:eq(0)').text();
                                            const purshasingTipsText = updatePurshasingTips(orderId, skuItemData, tipsText);
                                            if (that.data("orderid") == orderId) {
                                                orderInfoElem.find(".dz-purshasing-tips").remove();
                                                orderInfoElem.find(".comment").after(renderCommonTipsElem(purshasingTipsText, "dz-purshasing-tips"));
                                                layer.msg("添加成功", { time: 1e3 })
                                            }

                                        } else {
                                            //订单详情页
                                            orderId = getMatchStr(locationHref, "orderId=([0-9]+)");
                                            if (orderId) {
                                                const orderIdInfoElem = $(".parent-copyOrderId").closest(".elements");
                                                const purshasingTipsText = updatePurshasingTips(orderId, skuItemData, tipsText);
                                                $(".dz-purshasing-tips").remove();
                                                orderIdInfoElem.length > 0 && orderIdInfoElem.after(renderCommonTipsElem(purshasingTipsText, "dz-purshasing-tips"));
                                                layer.msg("添加成功", { time: 1e3 })
                                            }
                                        }
                                        updatePurshasingData(orderId, skuItemData);
                                    }
                                },
                                (index) => {
                                    tipsText = skuItemData.name;
                                    layer.close(index);
                                },
                                () => {
                                    tipsText = skuItemData.spu;
                                },
                                (index) => {
                                    layer.close(index);
                                }
                            )

                        })
                        tipsElem.after(stockupBtnElem)
                    }
                }
            });
        }

        /**
         * 新版本"我要发货"页面,添加提示等..
         * @param {JQuery<HTMLElement>[]} ordersTableDom 每个订单都是单独一个table.
         * @param {object} itemAttrs 
         * @param { boolean} isChecked 是否是手动点标记
         */
        const logisticShipCNAppendTips = (ordersTableDom, itemAttrs, isChecked = false) => {
            //不同的tab 显示url是不一样的
            const locationUrl = getLocationUrl();
            const ownerMemberOrders = isChecked ? getItem("member_orders1", {}) : {};
            let orderId = "", orderInfo = {};

            $.each(ordersTableDom || [], (index, item) => {
                const that = $(item);
                const rows = that.find("tr");
                //获取订单ID
                orderId = rows.eq(0).find("a:eq(0)").text().trim();
                if (!orderId) return true;
                const buyerName = rows.eq(1).find("[class*='cells--buyerName--']").eq(1).text().trim();
                const buyerSign = buyerName.replaceAll(" ", "-") + orderId.slice(-4);

                orderInfo = getItem(orderId, {}, orderOptions.storagePrefix);

                //添加多单提示
                const multiOrderTipElem = isChecked ? renderMultiOrderTipElem(orderId, buyerSign, ownerMemberOrders) : renderMultiOrderTipElem(orderId);
                const logisticCellElem = rows.eq(1).find("td:eq(2)");
                logisticCellElem.find(".dz-multi-tips").remove();
                logisticCellElem.append($("<div></div>", { class: "dz-multi-tips" }).html(multiOrderTipElem));

                highlightQty(that);
                //手动点了标记
                if (isChecked) {
                    //存储多单信息
                    const relatedOrders = (ownerMemberOrders[buyerSign] || []).filter(item => item != orderId)
                    const relatedOrderTips = (ownerMemberOrders[buyerSign] && ownerMemberOrders[buyerSign].length > 1) ? "多单x" + ownerMemberOrders[buyerSign].length : "";
                    //同时存储订单中商品信息
                    orderInfo = Object.assign(orderInfo, { orderId, relatedOrders, relatedOrderTips });
                    setItem(orderId, orderInfo, orderOptions.storagePrefix);
                }
            })
        }
        /**
         * 新版我要发货页面添加图片点击放大功能
         */
        const logisticShipCNAppendImageZoomInOut = () => {
            const imageElems = () => $('img[class*="cells--img--"]');
            //添加点击图片放大功能
            $.each(imageElems(), (index, item) => {
                const that = $(item);
                const imageSrc = that.attr("src");
                that.on('click', () => {
                    layer.photos({
                        photos: {
                            "title": "查看大图",
                            "id": 123, //相册id
                            //"start": 0, //初始显示的图片序号，默认0
                            "data": [   //相册包含的图片，数组格式
                                {
                                    "alt": "",
                                    "src": imageSrc.replace("_220x220.jpg", ""), //原图地址
                                    "thumb": imageSrc //缩略图地址
                                }
                            ]
                        },
                    })
                })
            })
        }


        return {
            getCurrentPage,
            getCurrentLimit,
            renderCommonTipsElem,
            renderMultiOrderTipElem,
            highlightQty,
            appendProductNameTips,
            renderStockupBtn,
            findItemDomInfo,
            renderZoomInImageBtn,
            appendTips,
            logisticShipCNAppendTips,
            logisticShipCNAppendImageZoomInOut,
        }
    }

    const run = async () => {
        const { locationHref, isEmpty, sleep, getMatchStr, getItem, setItem, deleteItem, getSellerId, getItemAttrs, ajaxRequest, showError, toFixed } = commonUtils()
        const { aePage, dzApi, orderOptions, FDate, storageOptions, dataExpTime } = constant

        //删除${dataExpTime}天前的订单
        let lastCheckDate = getItem("last_check_date", ""),
            nowDate = FDate.nowDate();
        if (lastCheckDate == "" || lastCheckDate != nowDate) {
            //处理订单数据
            setItem("last_check_date", nowDate);
            let listValues = GM_listValues();
            listValues.forEach(item => {
                let _item = {};
                if (item.indexOf('order_') >= 0) {
                    _item = getItem(item, {}, "");
                    (!_item.payDate || FDate.diffDay(nowDate, _item.payDate) >= dataExpTime) && deleteItem(item, "");
                }
            });
            //处理指定商品采购列表数据
            let purshasingList = getItem('purshasing_list', []);
            !Array.isArray(purshasingList) && (purshasingList = [purshasingList]);

            while (purshasingList.length > dataExpTime) {
                purshasingList.shift();
                if (purshasingList.length == 0) break;
            }
            setItem('purshasing_list', purshasingList);
        }

        //订单列表页
        if (locationHref.indexOf(aePage.path.orderIndex) > 0) {
            //等待订单列表加载完成
            const tableRows = () => $('.next-table-row');
            if (tableRows().length === 0) {
                sleep(1e3).then(() => { run() })
                return
            }
            const { appendTips } = aeDomUtils();
            const { renderBtn, renderPurshasingTable, formVerify } = domUtils();

            //商家ID
            const sellerId = getSellerId();
            //所有商品SKU属性
            const itemAttrs = getItemAttrs(sellerId);


            //【手动】向页面添加一些手动控制的事件按钮
            //记录买家和其购买的订单ID
            const ownerMemberOrders = {};
            const btns = [
                {
                    options: {
                        id: "dzUpdateAppKeySecretBtn",
                        text: "★更新密钥★"
                    },
                    callback: function (t) {
                        const content = [
                            '<blockquote style="margin:0;border-color: #eee;border-style: solid;border-width: 1px;border-left: 5px solid #1E9FFF;margin-bottom: 15px;padding: 10px;border-radius: 0 2px 2px 0;">获取方式:工作后台菜单:权限管理->API访问授权</blockquote>',
                            '<div style="margin-bottom: 15px;display: flex;align-items: center;"><label style="width: 65px;text-align:right;">APP KEY:</label><div style="flex:1">',
                            '<input type="text" name="appkey" verify="required" placeholder="请输入APP KEY" autocomplete="off" style="width: 100%;border: 1px solid #eee; padding-left: 10px; background-color: #fff; color: rgba(0,0,0,.85); border-radius: 2px; height: 2rem;outline:none;" />',
                            '</div></div>',
                            '<div style="margin-bottom: 15px;display: flex;align-items: center;"><label style="width: 65px;text-align:right;">密 钥:</label><div style="flex:1">',
                            '<input type="text" name="appsecret" verify="required" placeholder="请输入密钥" autocomplete="off" style="width: 100%;border: 1px solid #eee; padding-left: 10px; background-color: #fff; color: rgba(0,0,0,.85); border-radius: 2px; height: 2rem;outline:none;" />',
                            '</div></div>'
                        ].join("");
                        layer.open({
                            title: "请输入用户API授权密钥",
                            shadeClose: true,
                            content: `<div class='dz-update-ks-container' style="min-width:400px;">${content}</div>`,
                            btn: ['更新', '取消'],
                            yes: function (index) {
                                const ksContainerEle = $(".dz-update-ks-container")
                                if (!formVerify(ksContainerEle)) {
                                    return;
                                }
                                const appkey = ksContainerEle.find("input[name='appkey']").val();
                                const appsecret = ksContainerEle.find("input[name='appsecret']").val();
                                setItem("app_key", appkey, storageOptions.defaultPrefix);
                                setItem("app_secret", appsecret, storageOptions.defaultPrefix);
                                layer.msg("更新成功")
                            },
                            btn2: function (index) {
                                layer.close(index)
                            }
                        })
                    },
                },
                {
                    options: {
                        id: "dzUpdateIemsAttrBtn",
                        text: "★同步商品属性★"
                    },
                    callback: function (t) {
                        const appKey = getItem("app_key", "", storageOptions.defaultPrefix);
                        const appSecret = getItem("app_secret", "", storageOptions.defaultPrefix);
                        if (appKey == "" || appSecret == "") {
                            layer.msg("请先更新key与密钥")
                            return false;
                        }
                        const fetchItemsAttrsApi = dzApi.base + dzApi.api.itemsAttrs;
                        ajaxRequest(fetchItemsAttrsApi, { data: { sellerId }, method: 'get' }).then(
                            (res) => {
                                if (res?.code == 0) {
                                    setItem(`item_attrs_${sellerId}`, res.data?.list || {}, storageOptions.defaultPrefix);
                                    layer.msg(res.msg)
                                } else {
                                    layer.msg(res?.msg || "错误请求")
                                }
                            },
                            (error) => { layer.msg("对不起,请求出错..."); showError(error); }
                        )
                    },
                },
                {
                    options: {
                        id: "dzPurshasingViewBtn",
                        text: "▶查看采购列表◀"
                    },
                    callback: () => {
                        let purshasingData = getItem("purshasing_list", []);
                        const dateList = purshasingData.map(item => item.date) || [];

                        const showPurshasingTable = (purshasingData = { date: "", list: {} }) => {
                            const purshasingTableElem = renderPurshasingTable(purshasingData.list);
                            const winDom = window.open("", "_blank");
                            const $body = $(winDom.document.body);
                            $body.append(`<h2>${purshasingData.date}</h2>`)
                                .append(purshasingTableElem);

                        }
                        const content = [
                            '<div class="dz-purshase-date-box" style="display:flex;gap:1.25rem;padding:10px;">',
                            (function () {
                                const html = []
                                dateList.forEach(item => {
                                    html.push(`<div><input type="checkbox" name="purshase-data" value="${item}" /> <a class="dz-show-purshase-data" href="javascript:void(0);" data-date="${item}">${item}</a></div>`);
                                })
                                return html.join("");
                            })(),
                            '</div>'
                        ].join("");

                        layer.open({
                            type: 1,
                            title: "按日期查看采购列表",
                            shadeClose: true,
                            area: ['500px'],
                            content,
                            btn: ['合并日期查看', '关闭'],
                            yes: function () {
                                const checkedElem = $(".dz-purshase-date-box").find("input[name='purshase-data']:checked");
                                const checkedDate = [];
                                $.each(checkedElem, (index, item) => {
                                    checkedDate.push(item.value);
                                })
                                if (checkedDate.length === 0) {
                                    layer.alert("请至少选择一个日期")
                                    return;
                                }
                                //选中的日期采购列表最终合集
                                let checkedPurshaseData = {};
                                purshasingData.forEach((item) => {
                                    if (checkedDate.includes(item.date)) {
                                        const list = item?.list || {};
                                        Object.keys(list).forEach(spuKey => {
                                            if (!(spuKey in checkedPurshaseData)) {
                                                checkedPurshaseData[spuKey] = list[spuKey];
                                            } else {
                                                const skuItems = list[spuKey]?.skus ?? [];
                                                skuItems.forEach((_item, _index) => {
                                                    const findIndex = checkedPurshaseData[spuKey]?.skus?.findIndex(fItem => fItem.sku == _item.sku);
                                                    if (findIndex != -1) {
                                                        checkedPurshaseData[spuKey]["skus"][findIndex].qty += _item.qty;
                                                    } else {
                                                        checkedPurshaseData[spuKey]["skus"]?.push(_item);
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                                showPurshasingTable({ date: FDate.nowDate(), list: checkedPurshaseData });
                            },
                            btn2: (index) => {
                                layer.close(index);
                            }
                        })
                        $(document).on("click", ".dz-show-purshase-data", function () {
                            const that = $(this);
                            const data = purshasingData.find(item => item.date == that.data("date"));
                            showPurshasingTable(data);
                        });
                    }
                },
                {
                    options: {
                        id: "dzCheckMultiBtn",
                        text: "▶检查多单◀"
                    },
                    callback: () => {
                        $.each(tableRows(), (idx, elem) => {
                            const that = $(elem)
                            //检查行是否有订单信息(有订单号的行也包含买家信息)
                            const orderInfoElem = that.find(".tb-order-info");
                            if (orderInfoElem.length === 0) {
                                return true;
                            }
                            const buyerInfoElem = that.find(".dada-buyer-info");
                            const orderId = orderInfoElem.find('a:eq(0)').text().trim();
                            const ownerMemberId = getMatchStr(buyerInfoElem.find("a.buyer-name").attr("href"), "ownerMemberId=([^&]+)");
                            if (!ownerMemberId || !orderId) {
                                console.log("第" + idx + "个订单无法取得订单ID或用户ID");
                                return true;
                            }
                            if (!(ownerMemberId in ownerMemberOrders)) {
                                ownerMemberOrders[ownerMemberId] = [orderId]
                            } else {
                                !ownerMemberOrders[ownerMemberId].includes(orderId) && ownerMemberOrders[ownerMemberId].push(orderId);
                            }
                        })
                        //保存检查结果
                        setItem("member_orders", ownerMemberOrders);
                        layer.alert('如果有多页，请逐页检查完成后再点标记按钮!', { title: "提示" });
                    }
                },
                {
                    options: {
                        id: "dzAppendMultiInfoBtn",
                        text: "★标记多单★"
                    },
                    callback: function (opts) {
                        $(".dz-other-orders,.dz-other-order-text").remove();
                        $(".dz-other-order-tips:gt(0)").remove();
                        appendTips(tableRows(), itemAttrs, true);
                        layer.msg("标记完成");
                    },
                },

            ]

            const dzToolBarElem = $("<div>", { style: "display:flex;gap:0.75rem;margin-top:0.75rem;" }).insertAfter($(".toolbar-zone"));
            btns.forEach(item => {
                dzToolBarElem.append(renderBtn(item.options, item.callback))
            });

            /** 【自动】当发生表格重载,页面刷新,数据页换页时重新追加提示信息 */

            //自动添加
            setInterval(function () {
                if ($("#dz-tipped").length == 0) {
                    $(".table-zone .next-table").append(
                        "<input type='hidden' value='1' id='dz-tipped' />"
                    );
                    appendTips(tableRows(), itemAttrs);
                }
            }, 1e3);


        }
        //订单详情页
        else if (locationHref.indexOf(aePage.path.orderDetail) > 0 || locationHref.indexOf(aePage.path.newOrderDetail) > 0) {
            //页面各个模块加载完成后
            if ($(".table-zone").length >= 3 && ($(".parent-extendDeliveryDate").length > 0 || $('.parent-orderBasicInfo').length > 0)) {
                const { renderMultiOrderTipElem, appendTips, findItemDomInfo } = aeDomUtils();
                const { linelist } = constant;
                const orderId = getMatchStr(locationHref, "orderId=([0-9]+)");
                const orderIdElem = $(".parent-copyOrderId").closest(".elements");
                const addrElem = () => $(".address-desensitize > .content").children();
                if (orderIdElem.length > 0) {
                    const orderTipsElem = renderMultiOrderTipElem(orderId);
                    orderIdElem.after(orderTipsElem);
                }

                const tableRows = () => $('.parent-tradeOrderItemsTable .next-table-row');
                const sellerId = getSellerId();
                const itemAttrs = getItemAttrs(sellerId);
                //添加提示信息
                appendTips(tableRows(), itemAttrs);
                //本地存储订单信息
                const orderInfoData = getItem(orderId, {}, orderOptions.storagePrefix);
                /**
                 * 获取订单所有商品及成本和重量等信息
                 * @param {JQuery<HTMLElement>} rowsElem 所有订单行节点
                 * @param {object} itemAttrs 店铺所有商品属性信息
                 * @returns 订单商品信息
                 */
                const getOrderItemInfo = (rowsElem, itemAttrs) => {
                    const itemInfoData = {
                        totalQty: 0,
                        totalWeight: 0,
                        totalCost: 0,
                        defaultLogistics: "",
                        detail: []
                    };
                    if (!rowsElem || !rowsElem.jquery || rowsElem.length === 0) {
                        return itemInfoData;
                    }
                    $.each(rowsElem, (index, item) => {
                        const that = $(item);
                        const { image, logistics, ...skuItemData } = findItemDomInfo(that, itemAttrs);
                        if ('defaultLogistics' in itemInfoData && itemInfoData['defaultLogistics']) {
                            logistics in linelist
                                && itemInfoData['defaultLogistics'] in linelist
                                && linelist[logistics] > linelist[itemInfoData['defaultLogistics']]
                                && (itemInfoData.defaultLogistics = logistics);
                        } else {
                            itemInfoData.defaultLogistics = logistics;
                        }
                        itemInfoData.totalQty += skuItemData.qty;
                        itemInfoData.totalWeight += (skuItemData.qty * skuItemData.weight);
                        itemInfoData.totalCost += (skuItemData.qty * skuItemData.cost);
                        itemInfoData.detail.push(skuItemData);
                    })
                    itemInfoData.totalWeight = toFixed(Number((itemInfoData.totalWeight / 1000)), 3);
                    itemInfoData.totalCost = toFixed(Number(itemInfoData.totalCost), 2);
                    return itemInfoData;
                }

                const getAddressInfo = () => new Promise((resolve, reject) => {
                    const getAddress = () =>
                    ({
                        buyerName: addrElem().eq(0).find(".content").text().trim() || '-',
                        address: addrElem().eq(1).find(".content").text().trim() || '-',
                        zipCode: addrElem().eq(2).find(".content").text().trim() || '-',
                        phone: addrElem().eq(3).find(".content").text().trim() || '-',
                    });

                    setTimeout(() => {
                        let address = getAddress();
                        if (address['address'] == '-') {
                            setTimeout(() => {
                                address = getAddress();
                                resolve(address);
                            }, 1e3)
                        } else
                            resolve(address);
                    }, 1e3)
                })

                /** 获取订单所有需要的信息 */
                orderInfoData['orderId'] = orderId;
                orderInfoData['sellerId'] = sellerId;
                !("relatedOrders" in orderInfoData) && (orderInfoData['relatedOrders'] = []);
                !("relatedOrderTips" in orderInfoData) && (orderInfoData['relatedOrderTips'] = "");


                orderInfoData['currency'] = $(".productPrice .show-text").text().indexOf('$') >= 0 ? '$' : '￥';
                const priceReg = orderInfoData['currency'] === '$' ? "\\$([0-9.]+)" : "￥\\s*([0-9.]+)";
                //产品总金额
                orderInfoData['productPrice'] = 1 * (getMatchStr($(".productPrice .show-text").text().replace(",", ""), priceReg) || 0);
                //产品总金额
                orderInfoData['shippingFee'] = 1 * (getMatchStr($(".shippingFee .show-text").text().replace(",", ""), priceReg) || 0);
                //调价金额
                orderInfoData['adjustPrice'] = 1 * (getMatchStr($(".adjustPrice .show-text").text().replace(",", ""), priceReg) || 0);
                //预计增值税
                orderInfoData['taxIncludeFee'] = 1 * (getMatchStr($(".taxIncludeFee .show-text").text().replace(",", ""), priceReg) || 0);
                //店铺优惠
                orderInfoData['storePromotion'] = 1 * (getMatchStr($(".storePromotion .show-text").text().replace(",", ""), priceReg) || 0);
                //订单金额
                orderInfoData['orderPrice'] = 1 * (getMatchStr($(".orderPrice .show-text").text().replace(",", ""), priceReg) || 0);
                //交易佣金
                orderInfoData['escrowCommission'] = 1 * (getMatchStr($(".escrowCommission .show-text").text().replace(",", ""), priceReg) || 0);
                //联盟佣金
                orderInfoData['affiliateCommission'] = 1 * (getMatchStr($(".affiliateCommission .tb-text").text().replace(",", ""), priceReg) || 0);
                //巴西关税
                orderInfoData['duty'] = 1 * (getMatchStr($(".DUTY .show-text").text().replace(",", ""), priceReg) || 0);
                //巴西流通税
                orderInfoData['icms'] = 1 * (getMatchStr($(".ICMS .show-text").text().replace(",", ""), priceReg) || 0);
                //金币营销费
                orderInfoData['coinCommission'] = 1 * (getMatchStr($(".coinCommission .tb-text").text().replace(",", ""), priceReg) || 0);
                //预计可得
                orderInfoData['estimateRevenue'] = 1 * (getMatchStr($(".estimateRevenue .tb-text").text().replace(",", ""), priceReg) - orderInfoData['duty'] - orderInfoData['icms'] || 0);
                //订单备注
                orderInfoData['comment'] = $(".dada-text-commentText").text();
                //订单付款时间
                orderInfoData['payDate'] = $(".payDate").text();
                //订单地址
                orderInfoData['fullAddress'] = await getAddressInfo();

                orderInfoData['country'] = "";
                if (orderInfoData['fullAddress']['address'] && orderInfoData['fullAddress']['address'].indexOf("," > 0)) {
                    orderInfoData['country'] = orderInfoData['fullAddress'].address.split(",");
                    orderInfoData['country'] = (orderInfoData['country'][(orderInfoData['country'].length - 2)]) || '';
                    orderInfoData['country'] = orderInfoData['country'].trim();
                }

                const { totalQty, totalWeight, totalCost, defaultLogistics, detail } = getOrderItemInfo(tableRows(), itemAttrs);
                //默认物流
                orderInfoData['defaultLogistics'] = defaultLogistics;
                orderInfoData['totalQty'] = totalQty;
                orderInfoData['totalWeight'] = totalWeight;
                orderInfoData['totalCost'] = totalCost;
                orderInfoData['items'] = detail;

                setItem(orderId, orderInfoData, orderOptions.storagePrefix);

            } else {
                sleep(1e3).then(() => { run() });
            }
        }
        //创建物流页
        else if (locationHref.indexOf(aePage.path.createLogistic) > 0 || locationHref.indexOf(aePage.path.logisticCreateShipCN) > 0) {
            const isNewLogisticCreate = (locationHref.indexOf(aePage.path.logisticCreateShipCN) > 0);
            const checkLoadingElem = isNewLogisticCreate ? $("div[class*='LogisticSolution--init_card']") : $(".shipping-info-container .address-info");
            if (checkLoadingElem.length !== 0) {
                const { renderBtn, renderTableRow, renderTableCell, renderTableCellContent, renderItemWeightTipsTable, formVerify, nodeMutationObserver } = domUtils();
                const { linelist } = constant;
                const orderId = getMatchStr(locationHref, "trade_order_id=([0-9]+)");
                const commentBtn = () => isNewLogisticCreate ? $("button:last") : $('button[class*="footer--button--"]');
                let orderItemInfoData = getItem(orderId, {}, orderOptions.storagePrefix);
                //表格列定义
                const tableColumns = [
                    {
                        label: "订单号",
                        prop: "orderId",
                    },
                    {
                        label: "订购数量",
                        prop: "totalQty",
                    },
                    {
                        label: "重量(kg)",
                        prop: "totalWeight",
                    },
                    {
                        label: "成本(元)",
                        prop: "totalCost",
                    },
                    {
                        label: "订单金额",
                        prop: "orderPrice",
                    },
                    {
                        label: "预计收入",
                        prop: "estimateRevenue",
                    },
                    {
                        label: "默认物流",
                        prop: "defaultLogistics",
                    },

                ];
                //获取订单及其相关其它订单的所有订单数据
                const getOrders = () => {
                    const orders = [orderItemInfoData];
                    //多单数据做为数组元素添加到数组中
                    if (orderItemInfoData.relatedOrders && orderItemInfoData.relatedOrders.length > 0) {
                        orderItemInfoData.relatedOrders.forEach((item, index) => {
                            const otherOrderInfoData = getItem(item, { "orderId": item }, orderOptions.storagePrefix);
                            orders.push(otherOrderInfoData);
                        })
                    }
                    return orders;
                }
                commentBtn().on("click", () => {
                    const orders = getOrders();
                    ajaxRequest(dzApi.base + dzApi.api.recordOrders, { data: orders }).then(
                        (res) => { console.log(res); },
                        (error) => { showError(error); }
                    )
                })

                if (!isEmpty(orderItemInfoData)) {
                    //多单合计数量,成本,价格等...
                    let totalData = {
                        qty: 0,
                        weight: 0,
                        cost: 0,
                        orderPrice: 0,
                        estimateRevenue: 0,
                        logistics: ""
                    }
                    //获取底部内容容器对象(非jquery),用于监听对象内容变化
                    const getFooterContentElem = () => {
                        const selector = isNewLogisticCreate ? '[data-hottag-name="运费估计"]' : '[class*="footer--showText--"]';
                        return document.querySelector(selector);
                    }
                    //获取预计运费
                    const getRevenueLogisticAmount = () => {
                        const amountElem = isNewLogisticCreate ? $('[class*="create_ship--amount"]') : $('[class*="footer--amount--"]').eq(0)
                        return Number((amountElem.text().replace("￥", "").trim())) || 0;
                    }
                    //获取指定物流方式
                    const getLastLogistic = () => {
                        const shipServiceElem = isNewLogisticCreate ? $('[class*="create_ship--service--"]') : $('[class*="footer--amount--"]')
                        return shipServiceElem.text().trim() || "";
                    }

                    //获取被排除的一起发货的订单[orderId1,...]
                    const getExcludedShipTogetherOrders = () => orderItemInfoData.excludedOrders || []

                    //排除一起发发货的订单
                    const addExcludeOrder = (orderItemInfoData, excludeOrderId) => {
                        excludeOrderId = excludeOrderId + "";
                        if (orderItemInfoData.orderId == excludeOrderId) return
                        "excludedOrders" in orderItemInfoData
                            ? !orderItemInfoData.excludedOrders.includes(excludeOrderId) && orderItemInfoData.excludedOrders.push(excludeOrderId)
                            : orderItemInfoData.excludedOrders = [excludeOrderId]
                        setItem(orderItemInfoData.orderId, orderItemInfoData, orderOptions.storagePrefix)
                    }
                    //去除要一起发货的订单标记
                    const delExcludeOrder = (orderItemInfoData, orderId) => {
                        orderId = orderId + '';
                        if (orderItemInfoData.orderId == orderId) return
                        if ("excludedOrders" in orderItemInfoData) {
                            orderItemInfoData.excludedOrders = orderItemInfoData.excludedOrders.filter(item => item != orderId);
                            setItem(orderItemInfoData.orderId, orderItemInfoData, orderOptions.storagePrefix)
                        }
                    }
                    //美元转人民币汇率
                    const u2r = () => getItem("u2r", orderItemInfoData.currency == "$" ? 7 : 1, storageOptions.defaultPrefix);
                    //生成汇率输入框
                    const renderU2RInput = () => {
                        return $(
                            "<input />",
                            {
                                id: "dz-u2r-ipt",
                                style: "font-size: 1rem;height: 30px;padding: 0 12px;width:5rem;border:1px solid #c5cbd3",
                                verify: "required|number",
                                value: u2r
                            }
                        )
                    }
                    //生成计算预计利润dom节点
                    const renderCalcEstimateProfitElem = (data) => {
                        const logistic = getLastLogistic();
                        const revenueLogisticAmount = getRevenueLogisticAmount();
                        const estimateProfit = (data.estimateRevenue * u2r() - data.cost - revenueLogisticAmount) || 0;
                        orderItemInfoData.selectedLogistic = logistic;
                        orderItemInfoData.revenueLogisticAmount = revenueLogisticAmount;
                        orderItemInfoData.estimateProfit = toFixed(Number(estimateProfit), 2);
                        setItem(orderItemInfoData.orderId, orderItemInfoData, orderOptions.storagePrefix);
                        return $("<div></div>", { id: "dz-estimate-profit-container" })
                            .append(
                                $("<span></span>", { text: "物流方式:" + logistic + ", " }))
                            .append(
                                $("<span></span>", { style: "font-weight:1rem;" })
                                    .html(
                                        `预计利润:<span style="padding:0 0.5rem;font-weight:700;${(estimateProfit >= 0 ? "color:#00CA47;background-color:#e2f9ea;" : "color:#e53f3f;background-color: #efdfdf;")}">${orderItemInfoData.estimateProfit}</span>元`
                                    )
                                    .append(
                                        $("<span></span>", { text: `,公式:${toFixed(data.estimateRevenue)}*${u2r()}-${toFixed(data.cost)}-${revenueLogisticAmount}=${toFixed(orderItemInfoData.estimateProfit)}` })
                                    )
                            );
                    }
                    //生成修改汇率按钮
                    const changeU2RBtn = () => renderBtn(
                        {
                            className: "cn-next-btn cn-next-small cn-next-btn-primary cn-ui-button next-btn next-small next-btn-primary",
                            text: "修改汇率",
                        },
                        function () {
                            const inputElem = $("#dz-u2r-ipt");
                            if ($("#dz-u2r-ipt").length == 0 || !formVerify(inputElem.parent())) return;
                            const u2rLocal = getItem("u2r", 7, storageOptions.defaultPrefix);
                            const u2rVal = Number(inputElem.val().trim());
                            if (u2rLocal == u2rVal) return;
                            const estimateProfitCellElem = $(".dz-estimate-profit-cell");
                            !isEmpty(u2rVal) && setItem("u2r", u2rVal, storageOptions.defaultPrefix);
                            if (estimateProfitCellElem.length > 0) {
                                estimateProfitCellElem.find("#dz-estimate-profit-container").remove();
                                estimateProfitCellElem.append(renderCalcEstimateProfitElem(totalData))
                            }
                        }
                    );
                    //多单其它订单合并发货或排除合并发货
                    const splitOrMergeShipping = (action, orderId) => {
                        action == 'exclude' ? addExcludeOrder(orderItemInfoData, orderId) : delExcludeOrder(orderItemInfoData, orderId);
                        const tableElem = $("#dz-order-data-table");
                        tableElem.remove();
                        orderItemInfoData = getItem(orderItemInfoData.orderId, {}, orderOptions.storagePrefix);
                        totalData = { qty: 0, weight: 0, cost: 0, orderPrice: 0, estimateRevenue: 0, logistics: "" }
                        appendInfoTable();
                    }
                    //生成订单信息表格
                    const renderInfoTableElem = () => {
                        //生成订单成本,重量,价格等信息表格
                        let tableElem = $("<table></table>");
                        const tbodyElem = $("<tbody></tbody>");

                        //表头需要添加货币符号的列
                        const appendCurrencyProp = ["orderPrice", "estimateRevenue"];
                        const excludedShipTogetherOrders = getExcludedShipTogetherOrders();

                        //生成表格节点与多订单合计数据
                        getOrders().forEach((item, index) => {
                            const threadRowElem = renderTableRow("");
                            const rowElem = renderTableRow();
                            //是否排除一起发货
                            const isExcludOrder = excludedShipTogetherOrders.includes(item?.orderId);
                            tableColumns.forEach((column, idx) => {
                                index == 0 && threadRowElem.append(
                                    $("<th></th>", { class: "next-table-cell next-table-header-node" })
                                        .html(renderTableCellContent(column.label + `${appendCurrencyProp.includes(column.prop) ? "(" + item.currency + ")" : ""}`))
                                );
                                const context = !(column.prop in item) || isExcludOrder ? "-" : item[column.prop];
                                const orderDetailLinkElem = $(
                                    "<a></a>",
                                    {
                                        href: aePage.base + aePage.path.orderDetail + "?orderId=" + item['orderId'],
                                        target: "_blank",
                                        style: isExcludOrder ? "text-decoration:line-through;" : "",
                                        text: item['orderId'] + (item['orderId'] == orderItemInfoData.orderId && orderItemInfoData?.relatedOrders?.length > 0 ? "(主单)" : "")
                                    }
                                );
                                const actionLinkElem = $(
                                    "<a></a>",
                                    {
                                        href: "javascript:void(0)",
                                        "data-orderid": item['orderId'],
                                        "data-action": isExcludOrder ? "include" : "exclude",
                                        text: isExcludOrder ? " 合发" : " 排除"
                                    }
                                ).on("click", function () {
                                    const that = $(this);
                                    const orderId = that.data("orderid");
                                    const action = that.data("action");
                                    if (orderItemInfoData.orderId != orderId) {
                                        splitOrMergeShipping(action, orderId);
                                    }
                                });
                                rowElem.append(
                                    renderTableCell(
                                        renderTableCellContent(
                                            column.prop == "orderId"
                                                ? item['orderId'] == orderItemInfoData.orderId ? orderDetailLinkElem : [orderDetailLinkElem, actionLinkElem]
                                                : context
                                        )
                                    )
                                );
                            })
                            index == 0 && tableElem.append($("<thead></thead>").append(threadRowElem));
                            tbodyElem.append(rowElem);
                            totalData.qty += (isExcludOrder ? 0 : item.totalQty ?? 0);
                            totalData.weight += (isExcludOrder ? 0 : item.totalWeight ?? 0);
                            totalData.cost += (isExcludOrder ? 0 : item.totalCost ?? 0);
                            totalData.orderPrice += (isExcludOrder ? 0 : item.orderPrice ?? 0);
                            totalData.estimateRevenue += (isExcludOrder ? 0 : item.estimateRevenue ?? 0);
                            totalData.logistics = totalData.logistics ?
                                ((totalData.logistics in linelist) && (item.defaultLogistics in linelist) && linelist[item.defaultLogistics] > linelist[totalData.logistics]
                                    ? item.defaultLogistics : totalData.logistics
                                )
                                : item.defaultLogistics;
                        })
                        //添加多订单合计数据展示
                        if (orderItemInfoData.relatedOrders && orderItemInfoData.relatedOrders.length > 0) {
                            const totalElem = renderTableRow()
                                .append(
                                    renderTableCell(
                                        renderTableCellContent("总计", "", "text-align:right;font-weight:700;")
                                    )
                                )
                                .append(renderTableCell(
                                    renderTableCellContent(totalData.qty, "next-table-cell-wrapper", "font-weight:700;")
                                ))
                                .append(renderTableCell(
                                    renderTableCellContent(totalData.weight, "next-table-cell-wrapper", "font-weight:700;")
                                ))
                                .append(renderTableCell(
                                    renderTableCellContent(toFixed(totalData.cost), "next-table-cell-wrapper", "font-weight:700;")
                                ))
                                .append(renderTableCell(
                                    renderTableCellContent(toFixed(totalData.orderPrice), "next-table-cell-wrapper", "font-weight:700;")
                                ))
                                .append(renderTableCell(
                                    renderTableCellContent(toFixed(totalData.estimateRevenue), "next-table-cell-wrapper", "font-weight:700;")
                                ))
                                .append(renderTableCell(
                                    renderTableCellContent((totalData.logistics), "next-table-cell-wrapper", "font-weight:700;")
                                ));
                            tbodyElem.append(totalElem);
                        }
                        const estimateProfitElem = renderTableRow().append(
                            renderTableCell(
                                renderTableCellContent(
                                    $("<div></div>")
                                        .append("美元兑人民币汇率:")
                                        .append(renderU2RInput()),
                                    "next-table-cell-wrapper dz-estimate-profit-cell",
                                    "display:flex;gap:0.75rem;align-items:center;"
                                )
                                    .append(changeU2RBtn())
                                    .append(renderCalcEstimateProfitElem(totalData))
                            ).attr("colSpan", tableColumns.length)
                        );
                        tbodyElem.append(estimateProfitElem);
                        return tableElem = tableElem.append(tbodyElem);
                    }

                    const appendItemWeightTips = () => {
                        checkLoadingElem.append($("<div></div>", { class: "next-table", style: "position:unset!important;margin-bottom:5px" }).append(renderItemWeightTipsTable()));
                    }
                    const appendRelatedOrderTips = () => {
                        if (!isEmpty(orderItemInfoData["relatedOrderTips"])) {
                            checkLoadingElem.append(
                                $("<div></div>", { style: "padding:0 0.75rem;margin:0.75rem 0;border: 1px solid #f56200;color:#ff5e00;background-color: #fff2eb;", text: orderItemInfoData["relatedOrderTips"] })
                            );
                        }
                    }
                    const appendInfoTable = () => {
                        checkLoadingElem.append($("<div></div>", { class: "next-table", id: "dz-order-data-table" }).append(renderInfoTableElem()));
                    }

                    const recalcEstimateProfit = () => {
                        const estimateProfitCellElem = $(".dz-estimate-profit-cell");
                        if (estimateProfitCellElem.length > 0) {
                            estimateProfitCellElem.find("#dz-estimate-profit-container").remove();
                            estimateProfitCellElem.append(renderCalcEstimateProfitElem(totalData))
                        }
                    }

                    const addShipObserver = () => {
                        return nodeMutationObserver(getFooterContentElem(), function () {
                            recalcEstimateProfit()
                        })
                    }

                    appendItemWeightTips();
                    appendRelatedOrderTips();
                    appendInfoTable();
                    //监控物流方式,价格节点数据变化
                    if (isNewLogisticCreate) {
                        const createShipMethodElem = () => $("[class*='create_ship--service']");
                        const createShipAmountElem = () => $("[class*='create_ship--amount']");
                        let shipMethod = "";
                        let shipAmount = "";
                        setInterval(() => {
                            if (createShipAmountElem().length > 0 && (shipMethod != createShipMethodElem().text() || shipAmount != createShipAmountElem().text())) {
                                shipMethod = createShipMethodElem().text();
                                shipAmount = createShipAmountElem().text();
                                recalcEstimateProfit()
                            }
                        }, 5e2);

                    } else {
                        addShipObserver();
                    }

                }

            } else {
                sleep(1e3).then(() => { run() });
            }
        }
        //国际小包订单页
        else if (locationHref.indexOf(aePage.path.logisticOrderManage) > 0) {
            const logisticTableElem = () => $(".logistic_order_body .cn-next-table-body");
            const firstRowElem = () => logisticTableElem().find("tr:first");
            if (firstRowElem().length === 0) {
                sleep(1e3).then(() => { run() });
                return;
            }
            const markState = () => firstRowElem().find("#dz-mark").length > 0;
            const rowsElem = () => logisticTableElem().find("tr");
            const renderRelatedOrdersElem = (orderId) => {
                const orderData = getItem(orderId, {}, orderOptions.storagePrefix);
                let elem = [];
                if (!isEmpty(orderData)) {
                    const relatedOrders = orderData.relatedOrders || []
                    if (relatedOrders.length > 0) {
                        relatedOrders.forEach((item) => {
                            elem.push(
                                $("<span></span>", { class: "relation-li mouse-over" })
                                    .append(
                                        $("<span></span>", { class: "relation-li-title", text: "关联订单" })
                                    )
                                    .append([
                                        $("<a></a>",
                                            {
                                                class: "relation-li-text",
                                                target: "_blank",
                                                href: aePage.base + aePage.path.orderDetail + "?orderId=" + item,
                                                text: item
                                            }
                                        ),
                                        $("<a></a>",
                                            {
                                                class: "relation-li-text",
                                                style: "margin-left:0.5rem;",
                                                target: "_blank",
                                                href: aePage.base + "/apps/cn/singleDeclareShippingLogistic?tradeOrderId=" + item,
                                                text: "填单"
                                            }
                                        ),
                                    ])
                            )
                        })
                    }
                }
                return elem
            }
            const appendRelatedOrders = () => {
                $.each(rowsElem(), (index, item) => {
                    const rowElem = $(item);
                    const relationBoxElem = rowElem.find(".relation-ul");
                    const relationListElem = relationBoxElem.find(".relation-li");
                    const orderIdElem = relationListElem.last();
                    if (orderIdElem.text().indexOf("交易订单") >= 0) {
                        const orderId = getMatchStr(orderIdElem.find("a:eq(0)").attr("href"), "orderId=([0-9]+)");
                        if (orderId) {
                            const relatedOrdersElem = renderRelatedOrdersElem(orderId);
                            if (relatedOrdersElem.length > 0) {
                                orderIdElem.find("a:eq(0)").after($("<span></span>", { text: "多单", style: "color: #fff!important;background-color: #3d8eff;padding: 0 0.25rem;margin-left:0.5rem;border-radius: 0.25rem;" }));
                                relationBoxElem.append(relatedOrdersElem);
                            }

                        }
                    }
                })
            }
            setInterval(() => {
                if (!markState()) {
                    firstRowElem().append($("<input/>", { hidden: true, id: "dz-mark" }));
                    sleep(500).then(() => { appendRelatedOrders() });
                }
            }, 1e3);
        }
        //评价管理页
        else if (locationHref.indexOf(aePage.path.feedbackSellerList) > 0) {
            let autoFeedbackPages = getItem("auto_feedback_pages", 0),
                awaitingTab = $('#awaiting_me_tab'),
                feedBackLastPage = () => {
                    let paginationNext = $('.ui-pagination-next');
                    if (paginationNext.length == 0) {
                        setItem("auto_feedback_pages", 0);
                        return
                    }
                    if (paginationNext.prev().hasClass('ui-pagination-active')) {// || autoFeedbackPages>1 加上这个条件，就是不会从最后一页开始往前点了
                        let go = new Promise((resolve, reject) => {
                            $('#checkAll').trigger("click");
                            setItem("auto_feedback_pages", --autoFeedbackPages);
                            return resolve();
                        })
                            .then(() => {
                                sleep(2e3).then(() => {
                                    $('<span></span>').appendTo($('a.evaluate-bt')).trigger("click");
                                });
                            })
                            .then(() => {
                                sleep(2e3).then(() => {
                                    $('.ui-raty-star-trigger .raty-item:last').trigger("click");
                                });
                            })
                            .then(() => {
                                sleep(5e3).then(() => {
                                    $('#confirm_cpf').trigger("click");
                                });
                            });
                    } else {
                        sleep(5e3).then(() => {
                            $('<span></span>').appendTo(paginationNext.prev()).trigger("click");
                        });
                    }
                };
            if (awaitingTab.length > 0) {
                if (awaitingTab.hasClass('ui-tab-active')) {
                    if (autoFeedbackPages > 0) {
                        feedBackLastPage();
                    } else {
                        $('<a class="ui-button ui-button-primary ui-button-large">5星好评最后</a>')
                            .appendTo($('.operation-bar'))
                            .after('<input type="text" name="autofeedbackpages" value="1" style="width:30px"/>页')
                            .on("click", function () {
                                setItem("auto_feedback_pages", autoFeedbackPages = Number($(this).next('input').val()) || 1);
                                feedBackLastPage();
                            });
                    }
                } else if (autoFeedbackPages > 0) {
                    awaitingTab.trigger("click");
                }
            }
        }
        //新版"我要发货"页面
        else if (locationHref.indexOf(aePage.path.logisticShipCN) > 0) {
            //等待订单列表加载完成
            const tableItems = () => $('.next-table-row');
            if (tableItems().length === 0) {
                sleep(1e3).then(() => { run() })
                return
            }
            const { getLocationUrl } = commonUtils()
            const { renderBtn } = domUtils();
            const { logisticShipCNAppendTips, logisticShipCNAppendImageZoomInOut } = aeDomUtils();
            //判断页面数据是否重新加载的几个要素(不是包含所有100%的情况)
            const getFirstOrderId = () => $('.next-table-row.first').find('a:eq(0)').text().trim();
            let locationUrl = "";
            let ordersNumber = 0;
            let firstOrderId = "";
            const sellerId = getSellerId();
            const itemAttrs = getItemAttrs(sellerId);

            const ownerMemberOrders = {};
            //向页面添加自定义按钮
            const btns = [
                {
                    options: {
                        id: "dzCheckMultiBtn",
                        text: "▶检查多单◀"
                    },
                    callback: () => {
                        //tables()=>$('.next-table-row')
                        //一个table包含一个订单
                        $.each(tableItems(), (idx, elem) => {
                            const that = $(elem);

                            const orderIdElem = that.find("tr.next-table-group-header");
                            const orderId = orderIdElem.find('a:eq(0)').text().trim();
                            const buyerInfoElem = that.find("tr:eq(1)");
                            const buyerName = buyerInfoElem.find("[class*='cells--buyerName--']").eq(1).text().trim();

                            if (!orderId) return true;
                            const buyerSign = buyerName.replaceAll(" ", "-") + orderId.slice(-4);

                            if (!(buyerSign in ownerMemberOrders)) {
                                ownerMemberOrders[buyerSign] = [orderId]
                            } else {
                                !ownerMemberOrders[buyerSign].includes(orderId) && ownerMemberOrders[buyerSign].push(orderId);
                            }
                        })
                        //保存检查结果
                        setItem("member_orders1", ownerMemberOrders);
                        layer.alert('如果有多页，请逐页检查完成后再点标记按钮!', { title: "提示" });
                    }
                },
                {
                    options: {
                        id: "dzAppendMultiInfoBtn",
                        text: "★标记多单★"
                    },
                    callback: function (opts) {
                        $(".dz-other-orders,.dz-other-order-text").remove();
                        $(".dz-other-order-tips:gt(0)").remove();
                        logisticShipCNAppendTips(tableItems(), itemAttrs, true);
                        layer.msg("标记完成");
                    },
                },

            ]
            //自动添加
            setInterval(function () {
                if (firstOrderId != getFirstOrderId() || ordersNumber != tableItems().length || locationUrl != getLocationUrl()) {
                    firstOrderId = getFirstOrderId();
                    ordersNumber = tableItems().length;
                    locationUrl = getLocationUrl();
                    logisticShipCNAppendTips(tableItems(), itemAttrs);
                    logisticShipCNAppendImageZoomInOut();
                }
                if ($(".dz-toolbar").length == 0 && getLocationUrl().indexOf("WAIT_TO_PACKAGE") >= 0 && $(".chc-pro-table-toolbar-start").length > 0) {
                    const dzToolBarElem = $("<div>", { class: "dz-toolbar", style: "display:flex;gap:0.75rem;" }).insertAfter($(".chc-pro-table-toolbar-start"));
                    btns.forEach(item => {
                        dzToolBarElem.append(renderBtn(item.options, item.callback))
                    });
                }
            }, 1e3);
        }
    }
    //开始执行
    run()
})()
