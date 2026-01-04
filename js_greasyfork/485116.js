// ==UserScript==
// @name         邦供云辅助
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  注入外置代码，增加自定义功能
// @author       empyrealtear
// @match        http://bgy.zhengbang.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhengbang.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js
// @require      https://update.greasyfork.org/scripts/444783/1048986/xlsxfullmin.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/nanobar/0.4.2/nanobar.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_cookie
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485116/%E9%82%A6%E4%BE%9B%E4%BA%91%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/485116/%E9%82%A6%E4%BE%9B%E4%BA%91%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        url: {
            '产品管理': "http://bgy.zhengbang.com/blade-base/blade-product/product/page",
            '采购目录': "http://bgy.zhengbang.com/blade-pur/catalog/list",
            '采购计划': "http://bgy.zhengbang.com/blade-pur/plan/page",
            '采购计划明细': "http://bgy.zhengbang.com/blade-pur/plan/selectPlanById",
            '采购合同': "http://bgy.zhengbang.com/blade-pur/contract/page",
            '合同关联查询': "http://bgy.zhengbang.com/blade-pur/contract/getCascadList",
            '采购合同明细': "http://bgy.zhengbang.com/blade-pur/contract/selectContractDetail",
            '项目档案': "http://bgy.zhengbang.com/blade-pur/projectArchive/list",
            '到货验收': "http://bgy.zhengbang.com/blade-pur/blade-pur_arrival/arrival/page",
            '到货验收明细': "http://bgy.zhengbang.com/blade-pur/blade-pur_arrival/arrival/detail",
            '安装验收': "http://bgy.zhengbang.com/blade-pur/install/page",
            '安装验收明细': "http://bgy.zhengbang.com/blade-pur/install/selectInstall",
            '结算验收': "http://bgy.zhengbang.com/blade-fin/balance/page",
            '结算验收明细': "http://bgy.zhengbang.com/blade-fin/balance/selectBalanceDetail",
            '付款申请': "http://bgy.zhengbang.com/blade-fin/payApply/page",
            '付款申请明细': "http://bgy.zhengbang.com/blade-fin/payApply/selectPayApplyDetail",
            '财务付款': "http://bgy.zhengbang.com/blade-fin/pay/page",
            '财务付款待办': "http://bgy.zhengbang.com/blade-fin/payApply/selectUpcomingPay",
            '财务付款明细': "http://bgy.zhengbang.com/blade-fin/pay/selectPayDetail",
            '收款单': "http://bgy.zhengbang.com/blade-fin/receipt/list",
            '付款方式': "http://bgy.zhengbang.com/blade-base/payment/page",
            '履约保证金': "http://bgy.zhengbang.com/blade-pur/bzj/page"
        }
    }
    const utils = {
        readCookie: (key) => new RegExp(`${key}=(?<key>[^;]+)`).exec(document.cookie)?.groups?.key,
        page: (url, current = 1, size = 500, israw = true) => {
            var res
            jQuery.ajax({
                url: url + `?tenantCode=XMGC&current=${current}&size=${size}`,
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': 'Basic eG1nYzp4bWdjX3NlY3JldA==',
                    'blade-auth': "bearer " + utils.readCookie('saber-access-token')
                },
                async: false,
                success: (e) => {
                    res = israw ? e : e['data']
                }
            })
            return res
        },
        pages: (url) => {
            var arr = []
            var total = utils.page(url, 1, 0)['data']['total']
            var cur = 1
            do {
                var res = utils.page(url, cur)
                if (res.code == 200) {
                    arr = arr.concat(res.data['records'])
                    cur += 1
                }
            } while (arr.length < total)
            return arr
        },
        detail: (url, id, isquery = true, israw = true) => {
            var res
            jQuery.ajax({
                url: url + (isquery ? `/${id}` : `?id=${id}`),
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': 'Basic eG1nYzp4bWdjX3NlY3JldA==',
                    'blade-auth': "bearer " + utils.readCookie('saber-access-token')
                },
                async: false,
                success: (e) => {
                    res = israw ? e : e['data']
                }
            })
            return res
        },
        detailAsync: (url, id, isquery = true) => {
            return unsafeWindow.axios({
                url: url + (isquery ? `/${id}` : `?id=${id}`),
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': 'Basic eG1nYzp4bWdjX3NlY3JldA==',
                    'blade-auth': "bearer " + utils.readCookie('saber-access-token')
                },
            })
        },
        asyncPool: async (arr, delegate, start = (v) => v, end = (v) => v, poolLimit = 10) => {
            const ret = []
            const executing = new Set()
            let arr_res = new Array(arr.length)
            let cur = 0
            let completeCount = 0

            var nanobar = new Nanobar({ id: 'nanobar', target: document.body })
            jQuery("#nanobar").css('background', '#BEE7E9')
            jQuery("#nanobar .bar").css('background', '#F4606C')

            arr = start(arr)
            for (const item of arr) {
                const p = Promise.resolve().then(async () => {
                    try {
                        var res = await delegate(item, arr)
                        arr_res[cur] = res
                    } catch (err) {
                        console.warn(err)
                        arr_res[cur] = err
                    }
                    return
                }).finally(() => {
                    nanobar.go((++completeCount) / arr.length * 100)
                    cur++
                })
                ret.push(p)
                executing.add(p)
                const clean = () => executing.delete(p)
                p.then(clean).catch(clean)
                if (executing.size >= poolLimit) {
                    await Promise.race(executing)
                }
            }
            return Promise.all(ret).then(() => {
                jQuery("#nanobar").remove()
                console.log(arr_res)
                console.log(completeCount)
                return end(arr_res)
            })
        },
        s2ab: (s) => {
            let buf = new ArrayBuffer(s.length)
            let view = new Uint8Array(buf)
            for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
            return buf
        }
    }
    const export_module = {
        '采购合同': (v) => {
            try {
                var parity = jQuery.map(v['contractParitys'], x => {
                    if (x['isBid'] == '1')
                        return x
                })[0]
                var details = jQuery.map(v['contractDetails'], x => {
                    return {
                        '明细id': x['id'],
                        '计划id': x['planId'],
                        '计划名称': x['planName'],
                        '物料id': x['productId'],
                        '物料编码': x['productCode'],
                        '物料分类（设备名称）': x['productName'],
                        '物料名称（设备二级分类）': x['productTypeName'],
                        '规格型号': x['productSpec'],
                        '单位': x['masterUnitName'],
                        '采购数量': x['purQuantity'],
                        '单价': x['purPrice'],
                        '设备金额': x['purAmount'],
                    }
                })
                return {
                    '合同id': v['id'],
                    '采购主体': v['companyName'],
                    '项目名称': v['projectName'],
                    '供应商名称': v['supplyName'],
                    '合同明细': details,
                    '比价id': parity['id'],
                    '设备总金额': parity['productTotalAmount'],
                    '设备税率': parity['equipmentTaxRate'],
                    '运费': parity['transportAmount'],
                    '运距': parity['transportDistance'],
                    '运费标准': parity['freightStandard'],
                    '安装费': parity['installAmount'],
                    '安装标准': parity['installStandard'],
                    '优惠金额': parity['discountAmount'],
                    '明细总金额（表单）': parity['totalAmount'],
                    '合同总金额（列表）': v['totalAmount'],
                    '合同编号': v['contractCode'],
                    '合同标题': v['contractName'],
                    '签订日期': v['contractDate'],
                    '合同签订人': v['createName'],
                    '审批状态': v['status']
                }
            } catch(err) {
                console.warn(err)
                return {
                    '合同id': v['id'],
                    '采购主体': v['companyName'],
                    '项目名称': v['projectName'],
                    '供应商名称': v['supplyName'],
                    '合同明细': [],
                    '比价id': null,
                    '设备总金额': null,
                    '设备税率': null,
                    '运费': null,
                    '运距': null,
                    '运费标准': null,
                    '安装费': null,
                    '安装标准': null,
                    '优惠金额': null,
                    '明细总金额（表单）': null,
                    '合同总金额（列表）': v['totalAmount'],
                    '合同编号': v['contractCode'],
                    '合同标题': v['contractName'],
                    '签订日期': v['contractDate'],
                    '合同签订人': v['createName'],
                    '审批状态': v['status']
                }
            }
        }
    }

    unsafeWindow.jQuery = jQuery
    unsafeWindow.config = config
    unsafeWindow.utils = utils
    // unsafeWindow.export_module = export_module
    // unsafeWindow.XLSX = XLSX
    // unsafeWindow.Nanobar = Nanobar

    function downloadList() {
        //var arr = utils.page(config.url['采购合同'], 1, 200, false)['records']
        var arr = utils.pages(config.url['采购合同'])
        console.log(arr.length)
        //var mid = Math.ceil(arr.length / 2)
        //arr = arr.slice(0, mid)
        //arr = arr.slice(mid + 1, arr.length)
        var details = utils.asyncPool(arr, async (v) => {
            await utils.detailAsync(config.url['采购合同明细'], v.id).then(e => {
                var res = e['data']
                v['contractDetails'] = res['contractDetails']
                v['contractParitys'] = res['contractParitys']
                v['contractAtts'] = res['contractAtts']
                return v
            })
            return v
        }, (v) => v, v => {
            var arr = jQuery.map(v, i => {
                try {
                    return export_module['采购合同'](i)
                } catch(error) {
                    console.log(i)
                }
            })
            var ext = jQuery.map(arr, i => {
                for (let k in i) {
                    if (k != '合同明细')
                        jQuery.map(i['合同明细'], dts => {
                            dts[k] = i[k]
                        })
                }
                return i['合同明细']
            })
            var workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(arr, {
                header: [
                    '合同id', '采购主体', '项目名称', '供应商名称', '明细id', '计划id', '计划名称', '比价id',
                    '设备总金额', '设备税率', '运费', '运距', '运费标准', '安装费', '安装标准', '优惠金额',
                    '明细总金额（表单）', '合同总金额（列表）', '合同编号', '合同标题', '签订日期', '合同签订人']
            }), '采购订单')
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(ext, {
                header: [
                    '合同id', '采购主体', '项目名称', '供应商名称', '明细id', '计划id', '计划名称',
                    '物料id', '物料编码', '物料分类（设备名称）', '物料名称（设备二级分类）', '规格型号',
                    '单位', '采购数量', '单价', '设备金额', '比价id', '设备总金额', '设备税率', '运费',
                    '运距', '运费标准', '安装费', '安装标准', '优惠金额', '明细总金额（表单）', '合同总金额（列表）',
                    '合同编号', '合同标题', '签订日期', '合同签订人']
            }), '订单明细')
            //console.log(v, arr, ext)
            let wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
            saveAs(new Blob([utils.s2ab(wbout)], { type: 'application/octet-stream' }), '采购订单明细.xlsx')
        })
    }

    GM_registerMenuCommand("遍历合同列表", downloadList)
})();