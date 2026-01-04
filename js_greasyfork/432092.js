// ==UserScript==
// @name         XDR数据模型生成
// @namespace    undefined
// @version      1.0.1
// @description  XDR数据模型生成sql内容
// @author       江南小虫虫
// @match        *://10.0.0.106/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432092/XDR%E6%95%B0%E6%8D%AE%E6%A8%A1%E5%9E%8B%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/432092/XDR%E6%95%B0%E6%8D%AE%E6%A8%A1%E5%9E%8B%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================需要输入的地方====================
    let APP_ID = "cli_a1bf455d5638900d"
    let APP_SECRET = "P6pCFxz6VcanOwzdo7hZ7EKwIu08Qe0e"
    // 表格链接
    let TABLE_URL = "https://lgpznaxp6u.feishu.cn/base/bascn9Mje7aT32C7PLHtqdpYGNb?table=tblxRQtyUzIU4AuF&view=vewXYZSDe5"
    // 编辑模型链接
    let DATAMODELURL = "https://10.0.0.106/#/add/addModel?id=10006"
    // 表格对应列名
    let COLUMN = "天眼-对应字段"
    // ====================需要输入的地方====================

    let BITABLE_APP_TOKEN = getBitableTokenByUrl(TABLE_URL)
    let TABLE_ID = getTableIDByUrl(TABLE_URL)
    DATAMODELURL = getDataModelByUrl(DATAMODELURL)
    let feishu_dict = new Array();

    function getDataModelByUrl(url){
        var urlObject = new URL(url)
        var dataModelUrl = urlObject.origin+"/api/datamanager/template/getinfo?"+urlObject.href.split("?")[1]
        console.log("dataModelUrl: ", dataModelUrl)
        return dataModelUrl
    }
    function getBitableTokenByUrl(url){
        var urlObject = new URL(url)
        var bitableToken = urlObject.pathname.split('/')[2]
        console.log("bitableToken: ",bitableToken);
        return bitableToken
    }
    function getTableIDByUrl(url){
        var urlObject = new URL(url)
        var searchParams = new URLSearchParams(urlObject.search)
        var tableId = searchParams.get('table')
        console.log("tableID: ", tableId);
        return tableId
    }

    // 根据pageToken获取数据，api每次只能获取100条
    function getTableContentByPageToken(tenant_access_token, page_token) {
        console.log("tenant_access_token: ", tenant_access_token)
        console.log("page_token: ", page_token)
        var feishu_table_url = ""
        if (page_token) {
            feishu_table_url = "https://open.feishu.cn/open-apis/bitable/v1/apps/" + BITABLE_APP_TOKEN + "/tables/" + TABLE_ID + "/records" + "?page_token=" + page_token
        } else {
            feishu_table_url = "https://open.feishu.cn/open-apis/bitable/v1/apps/" + BITABLE_APP_TOKEN + "/tables/" + TABLE_ID + "/records"
        }
        console.log("feishu_table_url: ", feishu_table_url)
        var feishu_token_headers = {
            "Authorization": "Bearer " + tenant_access_token,
            "Content-Type": "application/json"
        }
        return runAsync(feishu_table_url, "GET", feishu_token_headers, null);
    }

    // 循环获取表格内容
    function getAllTableContent(tenant_access_token) {
        var results = new Array(),
            page_token = '';
        return new Promise(function(resolve, reject) {
            (function loop(page_token) {
                getTableContentByPageToken(tenant_access_token, page_token).then(function(data) {
                    console.log("获取的表格内容：");
                    console.log(data);
                    var table_json_data = eval('(' + data + ')');
                    var has_more = table_json_data.data.has_more;
                    var items = table_json_data.data.items;
                    var all_list = items.map((value) => value.fields)
                    console.log("fields字段：", all_list);
                    all_list.map((x)=>{results[x["id"][0].text]=x[COLUMN]})
                    if (has_more) {
                        page_token = table_json_data.data.page_token
                        console.log("还有值，继续")
                        console.log(page_token)
                        loop(page_token);
                    } else {
                        console.log("终于搞完了")
                        resolve(results);
                    }
                }).catch(reject);
            })('');
        });
    }


    function runAsync(url, send_type, headers, data) {
        var p = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: send_type,
                url: url,
                headers: headers,
                data: data,
                onload: function(response) {
                    //console.log("请求成功");
                    //console.log(response.responseText);

                    resolve(response.responseText);

                },
                onerror: function(response) {
                    //console.log("请求失败");
                    reject("请求失败");
                }
            });
        })
        return p;
    }

    // 获取xdr cookie
    let jsonStr = decodeURIComponent(document.cookie).split('=')[2]
    let xdr_token = eval('(' + jsonStr + ')').token;

    // 获取飞书token
    var feishu_token_url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/";
    var feishu_token_headers = {
        "app_id": APP_ID,
        "app_secret": APP_SECRET,
        "Content-Type": "application/json"
    }
    var feishu_token_data = JSON.stringify({
        "app_id": APP_ID,
        "app_secret": APP_SECRET
    })

    runAsync(feishu_token_url, "POST", feishu_token_headers, feishu_token_data).then((result) => {
        console.log("1. 获取飞书token");
        console.log(result);
        let tenant_access_token = eval('(' + result + ')').tenant_access_token;
        return tenant_access_token
    }).then((token) => {
        console.log("2. 获取表格内容");
        console.log("从上一级获取的飞书token：")
        console.log(token)
        var feishu_table_url = "https://open.feishu.cn/open-apis/bitable/v1/apps/" + BITABLE_APP_TOKEN + "/tables/" + TABLE_ID + "/records"
        var feishu_token_headers = {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
        getAllTableContent(token).then((result) => {
            console.log("最终，飞书表格中的内容如下")
            console.log(result)
            feishu_dict = result
        }).then(()=>{
            var xdr_headers = {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": xdr_token,
                "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            }
            runAsync(DATAMODELURL, "GET", xdr_headers, null).then((result)=>{
                //console.log("模型结果：");
                //console.log(result);
                var columns = eval(eval('(' + result + ')').data.columns);
                console.log("转换前内容")
                console.log(columns);
                let fields = columns.map(x => {
                    return {
                        'key': x.key,
                        'name': x.name,
                        'rule': feishu_dict[x.name]==undefined || feishu_dict[x.name].startsWith("#") ? x.rule:feishu_dict[x.name],
                        'field_type': x.field_type,
                        'description': x.description,
                        'display_name': x.display_name
                    }
                })
                console.log("转换后内容：")
                console.log(fields);
                console.log("最后结果：")
                //console.log(JSON.stringify(fields))
                document.writeln(JSON.stringify(fields) + '<br>')
            });
        });
    })
})();
