// ==UserScript==
// @name         Alibaba Keyword Tools
// @namespace    http://tampermonkey.net/
// @version      0.9.18
// @description  try to take over the world!
// @date         2021.03.22
// @author       Everest
// @match        https://www.alibaba.com/product-detail/*
// @match        https://www.alibaba.com/products/*
// @match        https://www.alibaba.com/trade/search?
// @match        https://*.alibaba.com/productlist*
// @match        https://*.alibaba.com/featureproductlist*
// @match        https://*.en.alibaba.com/productgrouplist*
// @match        https://showcase.alibaba.com/product_manage.htm*
// @match        https://hz-productposting.alibaba.com/product/ranksearch/rankSearch.htm*
// @match        https://hz-productposting.alibaba.com/product/products_manage.htm*
// @match        https://hz-productposting.alibaba.com/product/editing.htm*
// @match        https://post.alibaba.com/product/publish.htm?itemId=*
// @match        https://hz-mydata.alibaba.com/self/keyword.htm*
// @match        https://www2.alibaba.com/manage_ad_keyword.htm*
// @match        https://login.alibaba.com*
// @match        https://passport.alibaba.com/mini_login.htm*
// @match        https://www.alibaba.com/showroom*
// @match        https://photobank.alibaba.com/home/index.htm*
// @match        https://post.alibaba.com/product/success.htm?isSuccess=true*
// @match        https://i.alibaba.com/*
// @match        https://data.alibaba.com/product/ineffective*
// @match        https://data.alibaba.com/traffic/keyword*
// @match        https://hz-productposting.alibaba.com/trash/trash_manage.htm*
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_getTabs
// @grant       GM_getTab
// @grant       GM_openInTab
// @grant       GM_tabs
// @grant       GM_addValueChangeListener
// @grant       GM_deleteValue
// @grant       unsafeWindow
//@require      http://libs.baidu.com/jquery/2.0.0/jquery.js
//@require      http://www.linkman.info/js/test.js
// require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
//@icon data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAAICBAAAIiMAABwiAAATEwABIz4AAx0+AAAyMwAGChIADBQiAAAnKwALEh4ACBYWAAAwMgANGjMACAwQAAwYKgABHyAAAwsLAAEzPgABKz4ADh47AAE7OwAMEBYABgwMAAYIDAAHIz4AACwsAAAkJgABFxcAASc+AAcfPgABNTcAAQ8RAA8XJwARGCQADhIWAAsbNwANDxQAEBwwAAA3OwABLz4ABis+AAU7PgAGJz4ABRYWAAYPEAAPHTcABTc+AAUvPgACBgYAACAiAAQjPgACID4AACouAAAqLAAKDhQAEBosAAAMDgAEMz4ACx0+AAE7PgAMEBoABgwOAAoKCgAALjAABCYoAAQnPgABNz4ABT4+AAQNDgAMID4AAT4+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AQUREREQqQxIoKDApKysZGT5HR0dHRzw8QxIoExMdBBkUIEdHR0dHPDxDEigTEx0rOzsYBkdHR0dHPEMSEhMTKTs7HjgnR0dHR0c8QxISKCk7OzsNFUdHR0dHRzxDQxIwOzs7DTEAESA5MQM8PENDEjs7Ozs7RUdHR0dHIBwcPBIoOzs7OztFR0dHR0cDRzxDEyg7Ozs7DkdHR0dHR0dHPB0TKDs7Oz8BR0dHR0dHR0QdHRMoGTs7OyERG0dHR0dEBAQdEygTOzs7OzshGBwfRDQEBB0TKBIdOzs7OzseLggFNAQEHRMoKBITOzs7Ozs7BQU0BAQdExMoEkNDKTs7OwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @downloadURL https://update.greasyfork.org/scripts/32156/Alibaba%20Keyword%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/32156/Alibaba%20Keyword%20Tools.meta.js
// ==/UserScript==
/*
var script = document.createElement("script");
script.textContent = "(" + grease.toString() + ")()";
document.body.appendChild(script);
*/

function GM_onMessage(label, callback) {
    GM_addValueChangeListener(label, function() {
        callback.apply(undefined, arguments[2]);
    });
}

function GM_sendMessage(label) {
    GM_setValue(label, Array.from(arguments).slice(1));
}


function getXY(obj){
    var x = 0,y = 0;
    if (obj.getBoundingClientRect) {
        var box = obj.getBoundingClientRect();
        var D = document.documentElement;
        x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
        y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop
    }
    else{
        for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {}
        }
        return {
        x: x,
        y: y
    }
}

//导出表格数据到excel
var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="font-size:15px;" border="1">{table}</table></body></html>',
        base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g,
                             function(m, p) {
                return c[p];
            });
        };
    return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table);
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        };
        window.location.href = uri + base64(format(template, ctx));
    };
})();

function infoToTable(pageType, item, data) {
    let tr = document.createElement("tr");
    let td_title = document.createElement("td");
    td_title.innerText = data.title;
    tr.append(td_title);

    let td_url = document.createElement("td");
    td_url.innerText = data.url;
    tr.append(td_url);

    let td_companyName = document.createElement("td");
    td_companyName.innerText = data.companyName;
    tr.append(td_companyName);

    let td_companyUrl = document.createElement("td");
    td_companyUrl.innerText = data.companyUrl;
    tr.append(td_companyUrl);

    let td_employee = document.createElement("td");
    td_employee.innerText = data.employee;
    tr.append(td_employee);

    let td_price = document.createElement("td");
    td_price.innerText = data.price;
    tr.append(td_price);

    let td_moq = document.createElement("td");
    td_moq.innerText = data.moq;
    tr.append(td_moq);

    let td_showcase = document.createElement("td");
    td_showcase.innerText = data.isShowcase;
    tr.append(td_showcase);

    let td_catalog = document.createElement("td");
    td_catalog.innerText = data.catalog;
    tr.append(td_catalog);

    let keywordArr = data.keywords !== null ? data.keywords.split(",") : [];
    for (let i = 0; i <　3; i++) {
        //        if(keywordArr[i] === null || keywordArr[i] === undefined) {
        //            keywordArr[i] = "none";
        //        }
        let td_keywords = document.createElement("td");
        td_keywords.innerText = keywordArr[i];
        tr.append(td_keywords);
    }

    resultTable.append(tr);
}

function downloadExcel() {
    let resultTable = document.querySelector("#resultTable");
    if (resultTable === null) {
        alert("请先获取关键词再下载");
        return;
    }
    let sheetName = "Default";
    let pageType = window.location.href.indexOf("/productlist") > 0 ? 1 : window.location.href.indexOf("/featureproductlist") > 0 ? 2 : window.location.href.indexOf("/productgrouplist") > 0 ? 3 : 0;
    if (pageType > 0) {
        //let companyTag = document.querySelector(".company-name");
        //sheetName = companyTag.innerText;
        sheetName = pageType === 2 ? "Showcase-" + sheetName : sheetName;
    } else {
        let searchInputTag = document.querySelector("[name=SearchText]");
        //console.log("searchInputTag:" + searchInputTag);
        sheetName = searchInputTag !== null ? searchInputTag.value : "keywords";
    }

    tableToExcel(resultTable, sheetName);
}

let obj = {
            timeout : 1*1000,//间隔时间
            nextpageInterval : 3 * 1000,
            keywordsPatern  : /<meta name=\"keywords\".*, High Quality (.*?)\"/m,
            end : '"/> ',
            patern : /class="qrPRskw".+<\/a>/g,
            dds : ["Title", "Product URL", "Company Name", "Company URL", "Sales", "Price", "MOQ", "Showcase", "Catalog", "K1", "K2", "K3"],
            catalog_patern : /itemprop=\"name\".*\s*(.*)\s*/img,  //*？懒惰匹配 *贪婪匹配 g 匹配多个 不加g 只匹配一个
            employee_patern: /contactName.* (.*?)\",/m,
            price_patern: /class=\"ma-ref-price\".*?>([0-9\.]*)<\/span>.*?([0-9\.]*)<\/span>/m,
            moq_patern: /class=\"ma-min-order\".*?>([0-9]*)/m,
            company_patern: /class=\"company-name link-default\" href=\"(.*?)\".*?title=\"(.*?)\"/m,
            title_patern: /class=\"ma-title\" title=\"(.*?)\"/,
            url_patern: /rel=\"canonical\" href=\"(.*?)\"/
        };

function getKeywords(itemLinks, index, pageType) {
    let href = itemLinks[index].getAttribute("href");
    if(pageType > 0 && href){
        let id = /product\/([0-9]*)-/.exec(href)[1];//https://co-world.en.alibaba.com/product/60735712481-211981965/change_lens_fast_and_easy_ski_goggles_Made_in_Taiwan_SP249_.html
        href = href.substring(href.lastIndexOf("/") + 1, href.indexOf(".html"));
        let arr = href.split("_");
        let subfix;
        for (let i = 0; i < arr.length; i++) {//7个词https://www.alibaba.com/product-detail/New-design-TPU-frame-racing-motorcycle_1820316853.html
            subfix = i == 0 ? arr[i] : (subfix + "-" + arr[i]);
            if(i == 5 || i == arr.length - 1) {
                subfix += "_" + id + ".html";
                break;
            }
        }
        href = "https://www.alibaba.com/product-detail/" + subfix;
    }
    console.log(href);
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {"Accept": "text/xml"},
        url : href,
        onload : function (response) {
            //console.log(response.responseText);
            let title_result = obj.title_patern.exec(response.response);
            //GM_log(employee_result);
            let title = title_result !== null ? title_result[1] : "";

            let url_result = obj.url_patern.exec(response.response);
            //GM_log(employee_result);
            let url = url_result !== null ? url_result[1] : "";

            let employee_result = obj.employee_patern.exec(response.response);
            //GM_log(employee_result);
            let employee = employee_result !== null ? employee_result[1] : "";
            let keywords_result = obj.keywordsPatern.exec(response.responseText);
            let keywords = keywords_result != null ? keywords_result[1] : "";
            let catalogRegExp = new RegExp(obj.catalog_patern);
            let catalogMatch, catalog = "";
            while((catalogMatch = catalogRegExp.exec(response.responseText)) != null){
                if(RegExp.$1){
                    catalog += RegExp.$1.trim() + '>';
                }
            }
            let company_result = obj.company_patern.exec(response.responseText);
            let companyUrl = company_result != null ? company_result[1] : "";
            let companyName = company_result != null ? company_result[2] : "";
            let price_result = obj.price_patern.exec(response.responseText);
            let price = price_result != null ? price_result[1] + "-" + price_result[2] : "";
            let moq_result = obj.moq_patern.exec(response.responseText);
            let moq = moq_result != null ? moq_result[1] : "";
            let data = {title:title, url:url, catalog: catalog, keywords: keywords, employee: employee, companyUrl: companyUrl, companyName: companyName, price: price, moq: moq, isShowcase: "NO"};
            //显示关键词到页面
            if(pageType > 0){
                let div=document.createElement("div");
                div.setAttribute("mark", "justmark");
                div.setAttribute("class", "tags");
                div.innerHTML = "<strong>Keywords:</strong>" + keywords;
                itemLinks[index].parentNode.parentNode.appendChild(div);
            }

            infoToTable(pageType, itemLinks[index], data);
            index++;
            if(index < itemLinks.length){
                //匿名函数封装解决setTimeout传递参数问题
                setTimeout(function(){getKeywords(itemLinks, index, pageType);}, obj.timeout);
            } else {
                GM_setValue("keywords", resultTable.outerHTML);
                let nextBtn = pageType > 0 ? document.querySelector("a.ui-pagination-next") : document.querySelector("a.next");
                if(nextBtn != null) {
                    GM_setValue("processNextpage", 1);
                    nextBtn.click();
                }
            }
        }
    });
}

function processNextpage(pageType) {
    let nextBtn = pageType > 0 ? document.querySelector("a.ui-pagination-next") : document.querySelector("a.next");
    if(nextBtn != null) {
        nextBtn.click();
    }
}

function process() {
    if(document.querySelector("[mark]") !== null) {
        alert("你还要我怎样？？");
        return;
    }
    //0 搜索页 1产品分类页 2 橱窗产品页 3 分组页
    let pageType = window.location.href.indexOf("/productlist") > 0 ? 1 : window.location.href.indexOf("/featureproductlist") > 0 ? 2 : window.location.href.indexOf("/productgrouplist") > 0 ? 3 : 0;
    let itemLinks = pageType > 0 ? document.querySelectorAll("div.product-title>a") : document.querySelectorAll("h2.title>a");
    console.log("productlist:" + pageType);

    console.log("itemsLinks:" + itemLinks.length);
    if (itemLinks !== null && itemLinks.length > 0) {
        let oldData = GM_getValue("keywords");
        let tableDiv = document.createElement("div");
        if(oldData !== null && oldData != undefined && oldData.length > 0) {
            tableDiv.innerHTML = oldData;
        }
        let resultTable = document.querySelector("#resultTable");
        if (resultTable === null){
            resultTable = document.createElement("table");
            resultTable.id = "resultTable";
            resultTable.setAttribute("border", "0");
            //resultTable.style.display = "none";
            let headerTr = document.createElement("tr");
            for(let i = 0; i< obj.dds.length; i++) {
                let td = document.createElement("td");
                td.innerText = obj.dds[i];
                headerTr.append(td);
            }
            resultTable.append(headerTr);
            document.body.append(resultTable);
        }
        getKeywords(itemLinks, 0, pageType);
    }
}

function clearTable() {
    GM_setValue("keywords", "");
    alert("数据已清除");
}

function isShowcase(itemList, index) {
    if(index >= itemList.length) {
        return;
    }
    let aDom = itemList[index].querySelectorAll("a")[1];
    let href = aDom.href.substring(0, aDom.href.indexOf("company_profile")) + "featureproductlist.html";
    GM_log(href);
    let domdot = aDom.getAttribute("data-domdot");
    let pid = domdot.substring(domdot.indexOf("pid:") + 4, domdot.indexOf(",ext"));
    GM_log("pid: " + pid);

    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {"Accept": "application/json"},
        url : href,
        onload : function (response) {
            let isShowcase = false;
            isShowcase = response.responseText.indexOf(pid) > 0;
            let showDom = document.createElement("a");
            showDom.innerHTML = isShowcase === true ? '<font color="red">'+pid+' YES </font>' : "NO";
            itemList[index].parentNode.append(showDom);

            //GM_log(window.location.href);
            //index++;
            //匿名函数封装解决setTimeout传递参数问题
            // setTimeout(function(){fn(itemList, index, timeout);}, timeout);
        }
    });
}

function showIsShowcase() {
    let itemList = document.querySelectorAll(".stitle,util-ellipsis");
    let timeout = 500;
    if(itemList !== null) {
        for(let i = 0; i < itemList.length; i++) {
            setTimeout(function(){isShowcase(itemList, i);},  i * timeout);
        }
    }
}

function processShowcaseKeywords(itemList, index) {
    if(index >= itemList.length) {
        return;
    }
    let aDom = itemList[index].querySelectorAll("a")[0];
    let href = aDom.href;
    GM_log(href);
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {"Accept": "application/json"},
        url : href,
        onload : function (response) {

            let keywords = response.responseText.substring(response.responseText.indexOf("产品关键词"), response.responseText.indexOf("产品详细描述"));
            let showDom = document.createElement("div");
            showDom.innerHTML =  '<a><font color="red">--'+(index+1)+": "+keywords+'</font></a><br>';
            itemList[index].parentNode.parentNode.parentNode.append(showDom);

            //GM_log(window.location.href);
            //index++;
            //匿名函数封装解决setTimeout传递参数问题
            // setTimeout(function(){fn(itemList, index, timeout);}, timeout);
        }
    });
}

function showcaseKeywords() {
    let itemList = document.querySelectorAll(".subject");
    let timeout = 500;
    if(itemList !== null) {
        for(let i = 0; i < itemList.length; i++) {
            setTimeout(function(){processShowcaseKeywords(itemList, i);},  i * timeout);
        }
    }
}

function ranksearch() {
    let textInput = document.querySelector("#queryString");
    textInput.value = this.innerHTML;
    let btn = document.querySelector(".ui-button,ui-button-primary,ui-button-large");
    btn.click();
}

let default_keywords = "kids goggles|ski goggles|snow goggles|custom ski goggles|snowboard goggles|sports goggles|motocross goggles|motorcycle goggles|racing goggles|mx goggles|custom motorcycle goggles|custom motocross goggles|motocross mask|motorcycle mask";

function addRanksearchKeyword() {
    let addInput = document.querySelector("#addInput");
    if (addInput.value === "clear" && confirm("Confirm To Clear Data?") === true) {
        GM_setValue("ranksearchkeywords", "");
        alert(" clear succ!");
    }else if (addInput.value === "default"){
        GM_setValue("ranksearchkeywords", default_keywords);
        alert(" add default keywords succ!");
    }else{
        let keywords = GM_getValue("ranksearchkeywords", "");
        keywords += keywords !== "" ? "|" + addInput.value : addInput.value;
        GM_setValue("ranksearchkeywords", keywords);
        alert(addInput.value + " added succ!");
    }
}

function getTop5Price(keywordId, cb) {
    let href = "https://www2.alibaba.com/asyGetTopFivePrice.do?";
    href = href + getQueryParam();
    href = href + "&json=" + "%7B%22id%22%3A" + keywordId + "%7D";
    GM_log(href);
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        url : href,
        onload : function (response) {
            //let tests;
            //let data = eval("tests="+response.responseText +";console.log(tests);");
            GM_log(response);
            let responseJSON = jQuery.parseJSON(response.responseText);
            //GM_log(responseJSON.data[1]);
            cb(responseJSON);
        }
    });
}

function showListItemP4PPrice(responseJSON){
    let sponsorList = document.querySelectorAll("span.sl");
    GM_log(sponsorList);
    for(let i = 0; i < sponsorList.length; i++) {
        //sponsorList[i].innerText = "Price: " + responseJSON.data[i] + "  " + sponsorList[i].innerText;
        sponsorList[i].innerHTML = sponsorList[i].innerHTML.replace(sponsorList[i].innerText, "<font color='red'>Price: " + responseJSON.data[i] + "</font>    " + sponsorList[i].innerText);
    }

}

function showKeywordTop5Price(responseJSON) {

}

function showTop5Price(){
    let adKeyword = document.querySelector("input[name=SearchText]").value;
    if (adKeyword !== null || adKeyword !== "") {
        let href = "https://www2.alibaba.com/asyGetAdKeyword.do?";
        href = href + getQueryParam();
        adKeyword = adKeyword.replace(/\s/g,"+");
        href = href + "&json=%7B%22status%22%3A%22all%22%2C%22cost%22%3A%22all%22%2C%22click%22%3A%22all%22%2C%22exposure%22%3A%22all%22%2C%22cpc%22%3A%22all%22%2C%22qsStar%22%3A%22all%22%2C%22kw%22%3A%22"+ adKeyword +"%22%2C%22isExact%22%3A%22Y%22%2C%22date%22%3A7%2C%22tagId%22%3A-1%2C%22delayShow%22%3Afalse%2C%22recStrategy%22%3A1%2C%22recType%22%3A%22recommend%22%7D&_dt_p4p_id_=0a6780bc15229487291565714e6b2a&_csrf_token_=ynoqhydh9wyj&_dt_page_id_=716275890be691185ac65a7916296d15a471239f76";
        GM_xmlhttpRequest({ //获取列表
            method : "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            url : href,
            onload : function (response) {
                //let tests;
                //let data = eval("tests="+response.responseText +";console.log(tests);");
                let id = /\"id\":([0-9]*)/.exec(response.responseText);
                GM_log("keywordId:" + id);
                if (id === null) {
                    alert("请先登录账号！！！");
                }else {
                    getTop5Price(id[1], showListItemP4PPrice);
                }

            }
        });
    }

}

function updateAliParams(url, data){
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        url : url + "?value=" + data,
        onload : function (response) {
            GM_log(response);
        }
    });
}

let updataAliParamsUrl = "http://192.168.0.105/xcrm/index.php/home/alitools/updataAliParams";
let updataAliP4PParamsUrl = "http://192.168.0.105/xcrm/index.php/home/alitools/updataAliP4PParams";
function setAliParam(){
    let rex = /ctoken=(.*?)&/;
    let ctoken = rex.exec(document.cookie)[1];
    GM_setValue("ali_ctoken", ctoken);
    GM_setValue("ali_dmtrack_pageid", dmtrack_pageid);
    let params = "ali_ctoken:" + ctoken + "%0D%0Aali_dmtrack_pageid:" + dmtrack_pageid;
    if(typeof(BP) !== "undefined"){
        GM_setValue("ali_csrf_token_", BP.EXTRA_PARAMS._csrf_token_);
        GM_setValue("ali_dt_p4p_id_", BP.EXTRA_PARAMS._dt_p4p_id_);
        params = params + "%0D%0Aali_csrf_token_:" + BP.EXTRA_PARAMS._csrf_token_ + "%0D%0Aali_dt_p4p_id_:" + BP.EXTRA_PARAMS._dt_p4p_id_;
    } else {
        params = params + "%0D%0Ac_:%0D%0Aali_dt_p4p_id_:";
    }

    updateAliParams(updataAliParamsUrl, params);

}

function getQueryParam(){
    let queryParams = "";
    queryParams = queryParams + "ctoken=" + GM_getValue("ali_ctoken");
    queryParams = queryParams + "&_csrf_token_=" + GM_getValue("ali_csrf_token_");
    queryParams = queryParams + "&_dt_p4p_id_=" + GM_getValue("ali_dt_p4p_id_");
    queryParams = queryParams + "&dmtrack_pageid=" + GM_getValue("ali_dmtrack_pageid");
    queryParams = queryParams + "&_dt_page_id_=" + GM_getValue("ali_dmtrack_pageid");
    return queryParams;
}

function top5price() {
    let href = "https://www2.alibaba.com/asyGetTopFivePrice.do?";
    href = href + getQueryParam();
    href = href + "&json=" + "%7B%22id%22%3A" + 77875531411 + "%7D";
    GM_log(href);
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {"Accept": "application/json"},
        url : href,
        onload : function (response) {
            GM_log(typeof(response.responseText));
            let responseJSON = jQuery.parseJSON(response.responseText);
            for (let i = 0; i < 5; i++) {
                if(responseJSON.data[i] == null){
                    responseJSON.data[i] = 0;
                }
            }
            GM_log(responseJSON.data.toString());
        }
    });
}

let watched_keywords = [
    {keyword: "colorful goggles", id: 77836861543},
    {keyword: "custom motocross goggles", id: 77879023836},
    {keyword: "custom motorcycle goggles", id: 77875531410},
    {keyword: "custom mx goggles", id: 77879023827},
    {keyword: "dirt bike goggles", id: 77875531411},
    {keyword: "goggles factory", id: 77836861549},
    {keyword: "goggles motocross", id: 77836861554},
    {keyword: "goggles motorcycle", id: 77836861560},
    {keyword: "goggles motorcycle motocross", id: 77836861548},
    {keyword: "moto goggles", id: 77836861559},
    {keyword: "motocross glasses", id: 77836861561},
    {keyword: "motocross goggles", id: 77879023822},
    {keyword: "motocross goggles 100%", id: 77836861563},
    {keyword: "motocross goggles racing", id: 77836861546},
    {keyword: "motocross googles", id: 77836861555},
    {keyword: "motorcycle glasses", id: 77879023848},
    {keyword: "motorcycle goggles", id: 77879023828},
    {keyword: "motorcycle motocross mx goggles", id: 77836861545},
    {keyword: "motorcycle riding glasses", id: 77879023852},
    {keyword: "motorcycle riding goggles", id: 77875531409},
    {keyword: "mx goggles", id: 77879023867},
    {keyword: "mx goggles motocross", id: 77879023839},
    {keyword: "mx goggles roll off", id: 77836861544},
    {keyword: "racing goggles", id: 77836861557},
    {keyword: "racing motocross goggles", id: 77836861547},
    {keyword: "riding goggles", id: 77837569549},
    {keyword: "tear off goggle", id: 77879023878},
];
let count = 0;
let getPriceUrl = "https://www2.alibaba.com/asyGetTopFivePrice.do";
let getAdKeywordUrl = "https://www2.alibaba.com/asyGetKeywordEstimateRank.do";
let getKeywordEstimaeRankUrl = "https://www2.alibaba.com/asyGetKeywordEstimateRank.do";
let timeoutId = 0;
let intervalId = 0;
let intervalTime = 15*60;
let nextKeywordIntervalTime = 2;
let leftTime = intervalTime;
let started = 0;
let watchItems;
let settings;
function startWatchKeywordPrice(){
    if(started == 1){
        return;
    }

    let catItem = document.querySelector('li[data-id="76104900753"]');//watch list
    if (catItem == null) {
        setTimeout(startWatchKeywordPrice, 1000);
    } else {
        catItem.click();
        setTimeout(doWatchKeywordPrice, 1500);
    }

}

function nextPage(){
    let next = document.querySelector("a.next");
    if (next == null) {
        GM_log("next err");
        return;
    }
    next.click();
    setTimeout(doWatchKeywordPrice, 1500);
}

function doWatchKeywordPrice() {
    let loadingPanel = document.querySelector('div.bp-loading-panel');
    if(loadingPanel !== null && loadingPanel.getAttribute("aria-hidden") == "true") {//加载完成后开始
        started = 1;
        let table = document.querySelector("div.bp-table-main-wraper table");
        watchItems = table == null ? null : table.querySelectorAll('tr[data-role="list-item"]');//取得本页关键词列表
        if(watchItems != null && watchItems.length > 0) {
            watchKeywordPrice();
        } else {
            GM_log("err no watchItems");
        }
    } else {
        setTimeout(doWatchKeywordPrice, 1000);
    }
}

function watchKeywordPrice() {
    let keyword = watchItems[count].children[2] != null ? watchItems[count].children[2].innerText : null;
    let id = watchItems[count].getAttribute("data-id");
    if (keyword == null || id == null) {
        GM_log("keyword or id err, keyword=" + keyword + ", id=" + id);
        return;
    }
    updateDisplayLable("正在处理..." + keyword);
    let params = getQueryParam();
    params = params + "&json=" + "%7B%22id%22%3A" + id + "%7D";
    //GM_log(getPriceUrl);
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        url : getPriceUrl,
        data: params,
        onload : function (response) {
            //GM_log(typeof(response.responseText));
            if(response.status == 200){
                let responseJSON = null;
                try{
                    responseJSON = jQuery.parseJSON(response.responseText);
                    //GM_log(responseJSON.data);
                    if(responseJSON.data != null) {
                        for (let i = 0; i < 5; i++) {
                            if(responseJSON.data[i] == null){
                                responseJSON.data[i] = 0;
                            }
                        }
                        let data = {price:responseJSON.data.toString(), keywordId: id, keywordName: keyword, s: ""};
                        data.myPrice = watchItems[count].children[4] == null ? 0 : watchItems[count].children[4].innerText;
                        data.avgPrice = watchItems[count].children[5] == null ? 0 : watchItems[count].children[5].innerText;
                        data.myRank = watchItems[count].children[6] == null ? "" : watchItems[count].children[6].innerText;

                        //GM_log(data);
                        getSerachResult(data);

                    }
                }catch(e){
                    GM_log(response);
                    GM_log(e);
                    if(response.finalUrl.indexOf("https://login.alibaba.com") >= 0 || response.finalUrl.indexOf("https://passport.alibaba.com") >= 0){
                        stopWatchKeywordPrice();
                        GM_setValue("reLogin", 1);
                        reLogin();
                        //timeoutId = setTimeout(watchKeywordPrice, 10*1000);
                    }
                }
            }

        }
    });
}

function getSerachResult(data){
    let searchKeyword = data.keywordName.replace(new RegExp(" ", "g"), "+");
    let url = "https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText="+ searchKeyword +"&ctoken="+ GM_getValue("ali_ctoken") +"&dmtrack_pageid="+ GM_getValue("ali_dmtrack_pageid") +"&XPJAX=1";
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        url : url,
        onload : function (response) {
            try{
                let obj = jQuery.parseJSON(response.responseText);
                let s = '';
                if(obj != null && obj.normalList != null) {
                    for(let i = 0; i < 6; i++){
                        if(obj.normalList[i] && obj.normalList[i].isP4p == true){
                            let sName = obj.normalList[i].supplierHref.substring(2, obj.normalList[i].supplierHref.indexOf("."));
                            s += (s.length > 0 ? "," : "") + sName + "|" + obj.normalList[i].productId;
                        }
                    }
                    data.s = s;
                    //GM_log("s:" + data.s);
                    collect(data);
                    count++;
                }
            } catch(e) {
                GM_log(e);
                if(response.finalUrl.indexOf("https://login.alibaba.com") >= 0 || response.finalUrl.indexOf("https://passport.alibaba.com") >= 0){
                    stopWatchKeywordPrice();
                    GM_setValue("reLogin", 1);
                    reLogin();
                    //timeoutId = setTimeout(watchKeywordPrice, 10*1000);
                }
            }

            if(count < watchItems.length) {
                timeoutId = setTimeout(watchKeywordPrice, nextKeywordIntervalTime*1000);// next keyword
            } else {
                watchItems = null;
                count = 0;
                let hasNextPage = document.querySelector("a.next") != null;
                if(hasNextPage){//有bug
                    nextPage();
                } else {
                    started = 0;
                    leftTime = intervalTime;
                    //timeoutId = setTimeout(watchKeywordPrice, intervalTime*1000);
                    intervalId = setInterval(countdown, 1*1000);
                }
            }
        }
    });
}

function stopWatchKeywordPrice(){
    clearTimeout(timeoutId);
    count = 0;
    started = 0;
    watchItems = null;
    clearInterval(intervalId);
    leftTime = intervalTime;
    updateDisplayLable("已停止");

    //alert("已停止");
}

function collect(data) {
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "p=" + data.price + "&s=" + data.s + "&keywordId=" + data.keywordId + "&keywordName=" + data.keywordName + "&myPrice=" + data.myPrice + "&avgPrice=" + data.avgPrice + "&myRank=" + data.myRank,
        url : settings.collectUrl,
        onload : function (response) {
            if(response.responseText != "OK") {
               GM_log(response.responseText);
            }
        }
    });
}

function countdown() {
    leftTime --;
    let text = "倒计时： " + leftTime + "秒";
    updateDisplayLable(text);
    if(leftTime == 0) {
        clearInterval(intervalId);
        //updateDisplayLable("收集数据中。。。");
        startWatchKeywordPrice();
    }
}

function updateDisplayLable(text) {
    let timer = document.querySelector("#leftTime");
    if(timer == null) {
        let parentNode = document.querySelector("div.navigation-main ul");
        let split = document.createElement("li");
        split.setAttribute("class", "split");
        parentNode.append(split);
        let li = document.createElement("li");
        timer = document.createElement("a");
        timer.id = "leftTime";
        li.append(timer);
        parentNode.append(li);
        parentNode.setAttribute("added", "yes");
    }
    timer.innerText = text;
}

function xhrGet(url, accept, callback){

}

function queryCategory(items, index){
    let url = "https:" + items[index].getAttribute("href");
    GM_log(url);
    if(url != null && url != "") {
        GM_xmlhttpRequest({ //获取列表
            method : "GET",
            headers: {"Accept": "text/xml"},
            url : url,
            onload : function (response) {
                let catalogRegExp = new RegExp(obj.catalog_patern);
                let catalogMatch, catalog = "", i = 0;
                while((catalogMatch = catalogRegExp.exec(response.responseText)) != null){
                    if(i > 1 && RegExp.$1){
                        catalog += ' > ' + RegExp.$1.trim();
                    }
                    i++;
                }
                let showDiv = document.createElement("div");
                showDiv.setAttribute("class", "category");
                showDiv.innerHTML = "<strong>"+ catalog +"</strong>"
                items[index].parentNode.parentNode.appendChild(showDiv);
                index ++;
                if(index < items.length){
                    setTimeout(function(){queryCategory(items, index);}, 1000);
                }
            }
        });
    }
}

function showCategory(){
    let items = document.querySelectorAll(".product-subject>a");
    if(items == null || items.length <= 0) {
        setTimeout(showCategory, 1000);
    } else {
       queryCategory(items, 0);
    }
}

//pIndex productItems 已经定义
function checkContactUS(){
    pIndex = 0;
    productItems = qa(".next-table-cell.last");
    GM_log(productItems);
    if(productItems != null && productItems.length > 0){
        doCheckContactUS(productItems, 0);
    }
}

function doCheckContactUS(items, index){
    let item = items[index].querySelector("a");
    let productId = /id=([0-9]+)/.exec(item.getAttribute("href"))[1];
    let url = "https://post.alibaba.com/product/publish.htm?itemId=" + productId + "&checkContactUS=";
    GM_log(url);
    if(!openTab){
        GM_openInTab(url);
        openTab = true;
    } else {
        GM_sendMessage("check_contact_us_url", JSON.stringify({url: url, r: Math.random()}));
    }
}

function notifyCheckContactUS() {

    let replace = true;

    let ifr = document.querySelector("#superText_ifr");
    //
    if(ifr){
        let ifr_body = ifr.contentDocument.querySelector("#tinymce");
        if(ifr_body) {
            ifr_body.focus();
            let productId = /itemId=([0-9]+)/.exec(window.location.href)[1];
            let aArr = ifr_body.querySelectorAll("a");
            let suc = true;
            for(let i = 0; i < aArr.length; i++){
                if(/tracelog=tracedetailfeedback/.test(aArr[i].getAttribute("href"))){
                    GM_log(aArr[i].getAttribute("href"));
                    suc = false;
                };
            }
            if(!suc && replace){
                GM_log(productId);
                let contactUs = "https://message.alibaba.com/msgsend/contact.htm?action=contact_action&domain=1&id=" + productId;
                GM_log(contactUs);
                ifr_body.innerHTML = ifr_body.innerHTML.replace(/https:\/\/message.alibaba.com\/msgsend\/contact.htm.*?"/gm, contactUs + '"');
                //提交
                setTimeout(function(){document.querySelectorAll(".next-btn.next-btn-primary.next-btn-large.step-buttons")[1].click();}, 1000);
                q("#mceu_0").click();
            } else {
                GM_sendMessage("check_contact_us", JSON.stringify({check: suc, productId: productId, r: Math.random()}));
            }


        } else {
            setTimeout(notifyCheckContactUS, 2000);
        }
    } else {
        setTimeout(notifyCheckContactUS, 2000);
    }
}

function insertShowCategoryBtn() {
    let btns = document.querySelector(".custom-batch-container");
    if(btns) {
        let newNode = btns.childNodes[5].cloneNode(true);
        newNode.innerText = "显示类目";
        newNode.onclick = function(){
            if(document.querySelector(".category") == null){
                showCategory();
            }
        }
        btns.insertBefore(newNode, btns.childNodes[5]);

        let checkScoreBtn = btns.childNodes[5].cloneNode(true);
        checkScoreBtn.innerText = "质量得分";
        checkScoreBtn.onclick = checkScore;
        btns.insertBefore(checkScoreBtn, btns.childNodes[5]);
        GM_onMessage("update_product_score", function(){
            let data = GM_getValue("update_product_score");
            let dataObj = jQuery.parseJSON(data);
            GM_log(dataObj);
            let showNode = productItems[pIndex].parentNode.querySelector(".cell-wrapper.product-quality");
            let div = document.createElement("div");
            div.innerHTML = '<font color="green">' + dataObj.score + "</font>";
            showNode.append(div);
            pIndex++;
            if(pIndex >= productItems.length){
                pIndex = 0;
                productItems = null;
            } else {
                setTimeout(function(){doCheckScore(productItems, pIndex);}, 1000);
            }
        });

        let checkContactUsBtn = btns.childNodes[5].cloneNode(true);
        checkContactUsBtn.innerText = "检查Contact US";
        checkContactUsBtn.onclick = checkContactUS;
        GM_onMessage("check_contact_us", function(){
            let data = GM_getValue("check_contact_us");
            let dataObj = jQuery.parseJSON(data);
            GM_log(dataObj);
            let showNode = productItems[pIndex].parentNode.querySelector(".cell-wrapper.product-quality");
            let div = document.createElement("div");
            div.innerHTML = '<font color="green">'+dataObj.check+'</font>';
            showNode.append(div);
            pIndex++;
            if(pIndex >= productItems.length){
                pIndex = 0;
                productItems = null;
                GM_log("任务完成");
            } else {
                setTimeout(function(){doCheckContactUS(productItems, pIndex);}, 1000);
            }
        });

        btns.insertBefore(checkContactUsBtn, btns.childNodes[5]);
    } else {
       setTimeout(insertShowCategoryBtn, 1000);
    }
}

function testCallLocalHost(){
    let href = settings.aliToolsHost + "/alibaba/collect.php";
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "p=1,2,3,4,5&keywordId=123456",
        url : href,
        onload : function (response) {
            GM_log(response);
        }
    });
}

function testGetItemList(){
    //let itemlist = document.querySelectorAll('li[data-name="motocross goggles"]');
    let itemlist = document.querySelectorAll('a');
    //GM_log(itemlist);
    for(let i = 0; i< itemlist.length; i++) {
        GM_log('{keyword: "' + itemlist[i].getAttribute("data-keyword") + '", id: ' + itemlist[i].getAttribute("data-id") + "},");
    }
    //itemlist.click();
}

function testChromeExt(){
    GM_getTabs(function(tabs){
        GM_log(GM_tabs);
    });
    GM_getTab(function(tab){
        GM_log(tab);
    });
}

function testSearch(){
    let url = "https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=motocross+goggles&ctoken=m7jci0995ypa&dmtrack_pageid=7142d2520be69f955ad326a9162c8cf0971e9a29c6&XPJAX=1";
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        url : url,
        onload : function (response) {
            GM_log(jQuery.parseJSON(response.responseText));
        }
    });
}

function testGetProductDetail(){
    let url = "https://offer.alibaba.com/product/fetchSiteTag.jsonp?siteName=detail&pageFrom=detail&pageInfo=%7B%22productId%22%3A%22428582513%22%2C%22siteName%22%3A%22detail%22%2C%22productType%22%3A%22detail%22%2C%22pageType%22%3A%22detail%22%2C%22isP4P%22%3Afalse%2C%22pageDevice%22%3A%22PC%22%7D&language=&callback=";
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        url : url,
        onload : function (response) {
            GM_log(jQuery.parseJSON(response.responseText));
        }
    });
}

function loadShowKeywordRankJS(){
    var head = document.getElementsByTagName('HEAD').item(0);
    var script_showcase = document.createElement('script');
    script_showcase.id = "script_showcase";
    script_showcase.src = settings.aliToolsHost + '/web/alibaba/showcase_sc_global.js?' + Math.random();
    head.appendChild(script_showcase);

    var script_package = document.createElement('script');
    script_package.id = "script_package";
    script_package.src = settings.aliToolsHost + '/web/alibaba/package.js?' + Math.random();
    head.appendChild(script_package);

    var script_local = document.createElement('script');
    script_local.id = "script_local";
    script_local.src = settings.aliToolsHost + '/web/alibaba/local.js?' + Math.random();
    head.appendChild(script_local);
    console.log("loadShowKeywordRankJS")
}

function initShowKeywordRankSetting(){
    let script =
    `var server = '//hz-mydata.alibaba.com/';
    var onePageServer = '//message.alibaba.com/';
    var Config = {
        message:{
            busy: '服务器正忙，请稍候再试。',
            noData: '抱歉，系统暂时没有统计到任何数据！'
        },
        info:{
            server : '//hz-mydata.alibaba.com/',
            p4pServer : 'http://www2.alibaba.com/',
            edmNewVersion : '',
            language : 'zh_cn'
        }
    };
    console.log("initShowKeywordRankSetting");`

    let scriptDom = document.createElement("script");
    scriptDom.innerText = script;
    document.head.appendChild(scriptDom);
}

function initShowKeywordRankModel(){
    if(q("#script_package") && q("#script_showcase") && q("#script_local")){
        seajs.iuse("//i.alicdn.com/ida-mydata/self-keyword/rank/rank.js")(function(Rank){
            Rank.init();
        });


        seajs.iuse(["ida-mydata/common/event/event.js","sc-global/node_modules/@alife/alpha-jquery/jquery"])(function(a, i){
            i(".J-product-rank").live("click", function(e) {
                a.fire("show-keyword-rank", {
                    target: i(e.target),
                    keyword: i(e.target).attr("data-keyword") || ""
                })
            });
        });
        seajs.iuse("//i.alicdn.com/local/test.js")(function(t){
            t.setGM_xmlHttpRequest(GM_xmlhttpRequest);
        });

        seajs.iuse("ida-mydata/common/string/string.js");
        GM_log("initShowKeywordRankModel");
    } else {
        setTimeout(initShowKeywordRankModel, 500);
    }

}

function setShowKeywordRankButton(){
    let parentNode = qa(".ui2-button-group.ui2-button-group-normal")[1];
    let insertBtn = document.createElement("a");
    insertBtn.setAttribute("class", "ui2-button ui2-button-normal ui2-button-medium");
    insertBtn.innerText = "查产品排名";
    insertBtn.id = "showKeywordRankButton";
    insertBtn.addEventListener("click", initShowKeywordLink);
    parentNode.append(insertBtn);
}

function setAnalystRankButton(){
    let parentNode = qa(".ui2-button-group.ui2-button-group-normal")[1];
    let insertBtn = document.createElement("a");
    insertBtn.setAttribute("class", "ui2-button ui2-button-normal ui2-button-medium");
    insertBtn.innerText = "产品排名分析";
    insertBtn.id = "showKeywordRankButton";
    insertBtn.addEventListener("click", analystKeywordRank);
    parentNode.append(insertBtn);
}

function setTop5PriceButton(){
    let parentNode = qa(".ui2-button-group.ui2-button-group-normal")[1];
    let insertBtn = document.createElement("a");
    insertBtn.setAttribute("class", "ui2-button ui2-button-normal ui2-button-medium");
    insertBtn.innerText = "前五名价格";
    insertBtn.id = "showKeywordRankButton";
    insertBtn.addEventListener("click", analystKeywordTop5Price);
    parentNode.append(insertBtn);
}

function doAnalystKeywordTop5Price(list, index){
    let parentTD = list[index].querySelectorAll("td");
    let keywordId = parentTD[4].querySelector("a").getAttribute("data-id");
    getTop5Price(keywordId, function(responseJSON){
        let span = document.createElement("span");
        span.innerText = responseJSON.data;
        span.setAttribute("name","top5price");
        parentTD[4].append(span);
        index++;
        if(index < list.length){
            setTimeout(function(){doAnalystKeywordTop5Price(list, index);}, 1000);
        }
    });
}

function doAnalystKeywordRank(list, index){
    let parentTD = list[index].querySelectorAll("td");
    let keyword = parentTD[2].innerText.replace(/\s/g, "+");
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "keyword=" + keyword,
        url : "https://hz-mydata.alibaba.com/self/.json?action=CommonAction&iName=getKeywordSearchProducts&ctoken=" + GM_getValue("ali_ctoken") + "&dmtrack_pageid=" + GM_getValue("ali_dmtrack_pageid"),
        onload : function (response) {

            let jsonObj = jQuery.parseJSON(response.responseText);
             //GM_log(jsonObj.value);
            if (jsonObj.value && jsonObj.value.length > 0) {
                let text = "排名(" + jsonObj.value.length + "):" ;
                for(let i = 0; i < jsonObj.value.length; i++) {
                    //GM_log(jsonObj.value[i].pageNO);
                    if(jsonObj.value[i].pageNO == 1) {
                        text += jsonObj.value[i].pageNO + "-" + jsonObj.value[i].rowNO + ",";
                    }
                }
                let insertA = document.createElement('a');
                insertA.setAttribute("class", "J-product-rank");
                insertA.setAttribute("name", "rankDetail");
                insertA.setAttribute("data-keyword", parentTD[2].innerText);
                insertA.href = "javascript:;";
                insertA.innerText = text;
                let insertSpan = document.createElement('span');
                insertSpan.setAttribute("class", "checkRank");
                insertSpan.setAttribute("style","width: 18px;height: 14px;display: inline-block;position: relative;top: 2px;margin: 2 2px;background: url(https://i.alicdn.com/ida-mydata/common/base/imgs/mydata.17c29b97.png) no-repeat transparent -73px -20px;");
                //insertA.append(insertSpan);
                parentTD[3].appendChild(insertA);
            }


            index++;
            if(index < list.length){
                setTimeout(function(){doAnalystKeywordRank(list, index);}, 1000);
            }
        }
    });
}

function analystKeywordRank(){
    if(q("[name=rankDetail]") == null){
        let itemTRs = document.querySelector(".bp-table-main").querySelectorAll('[data-role="list-item"]');
        if(itemTRs != null && itemTRs.length > 0){
            doAnalystKeywordRank(itemTRs, 0);
        }
    }
}

function analystKeywordTop5Price(){
    if(q("[name=top5price]") == null){
        let itemTRs = document.querySelector(".bp-table-main").querySelectorAll('[data-role="list-item"]');
        if(itemTRs != null && itemTRs.length > 0){
            doAnalystKeywordTop5Price(itemTRs, 0);
        }
    }
}

function initShowKeywordLink(){
    if(q(".J-product-rank") == null){
        let itemTRs = document.querySelector(".bp-table-main").querySelectorAll('[data-role="list-item"]');
        for (let i = 0; i < itemTRs.length; i++){
            let parentTD = itemTRs[i].querySelectorAll("td");
            let insertA = document.createElement('a');
            insertA.setAttribute("class", "J-product-rank");
            insertA.setAttribute("data-keyword", parentTD[2].innerText);
            insertA.href = "javascript:;";
            insertA.innerText = "产品排名";
            let insertSpan = document.createElement('span');
            insertSpan.setAttribute("class", "checkRank");
            insertSpan.setAttribute("style","width: 18px;height: 14px;display: inline-block;position: relative;top: 2px;margin: 2 2px;background: url(https://i.alicdn.com/ida-mydata/common/base/imgs/mydata.17c29b97.png) no-repeat transparent -73px -20px;");
            //insertA.append(insertSpan);
            parentTD[3].appendChild(insertA);
        }
    }
}

function initShowKeywordRankUI(){

    //insertSpan.addEventListener("click", function(){alert("click");});

    let insertDiv = document.createElement('div');
    document.body.appendChild(insertDiv);
    var head = document.getElementsByTagName('HEAD').item(0);
    var style = document.createElement('link');
    style.href = 'https://i.alicdn.com/ida-mydata/??common/base/common4v.49291607.css,common/feedback/feedback.a0572a53.css,self-keyword/page/page.1632f19e.css,common/base/base.77b925c8.css,common/title/title.aee1b770.css,self-keyword/tip/tip.0a3102c2.css,common/stats/stats.d18db98a.css,self-keyword/condition/condition.52e9fb3f.css,self-keyword/custom/custom.430029c5.css,self-keyword/detail/detail.34f56342.css,self-keyword/info/info.1945b22f.css,self-keyword/rank/rank.4b7f3403.css,common/showcase/showcase.8ca3d5cb.css';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    head.appendChild(style);

    insertDiv.innerHTML = `<div id="J-product-rank-details" class="ui-balloon ui-balloon-lt product-rank-details" data-widget-cid="widget-13">
    <div class="product-rank-details-title">
        产品排名    </div>
    <div id="J-product-rank-details-content" class="product-rank-details-content"></div>
    <div id="J-product-rank-details-pagination"></div>
    <div class="tip-loading" id="J-tip-loading-product-rank-details"><img src="//u.alicdn.com/js/5v/lib/yui/carousel/assets/ajax-loader.gif"></div>
    <div class="tip-no-data" id="J-tip-no-data-product-rank-details">目前该词下您没有排名在前10页的产品。</div>
    <div class="tip-server-busy" id="J-tip-server-busy-product-rank-details">服务器正忙，请稍候再试。</div>
    <script id="J-product-rank-details-template" type="text/x-handlebars-template">
        <div class="product-rank-details-tip">只展示该词下排名前10页的产品。</div>
        <table border="0" cellspacing="0" cellpadding="0">
            <tbody>
                {{#each this}}
                    <tr>
                        <td class="td-pimg">
                            {{#if editURL}}
                                <a class="product-img" href="{{editURL}}" target="_blank"><img width="60px" height="60px" src="{{getImgSrc imageURL}}" /></a>
                            {{else}}
                                <a class="product-img"><img width="60px" height="60px" src="{{getImgSrc imageURL}}" /></a>
                            {{/if}}
                        </td>
                        <td class="td-pname">
                            <div class="product-name">
                                {{#if editURL}}
                                    <a href="{{editURL}}" title="{{subject}}" target="_blank">{{subString subject 65}}</a>
                                {{else}}
                                    <span title="{{subject}}, 产品不归属于当前登录账号，不支持编辑。">{{subString subject 65}}</span>
                                {{/if}}
                            </div>
                            <div class="td-rank" style="width:100%;position:relative;">


			第<span>{{pageNO}}</span>页



			第<span>{{rowNO}}</span>位

	                            </div>
                        </td>
                        <td class="products-action-p4p">
                                <br/>
                                <a href="http:///hz-productposting.alibaba.com/product/editing.htm?id={{id}}" target="_blank" class="ui2-button ui2-button-link">编辑产品</a>
                                                        {{#if isRealtimeShowcase}}
                                <br>
                                <span class="product-showcase-op product-showcase-delete" data-id="{{id}}">移除橱窗产品</span>
                            {{else}}
                                <br>
                                <span class="product-showcase-op product-showcase-add" data-id="{{id}}">添加橱窗产品</span>
                            {{/if}}
                        </td>
                {{/each}}
            </tbody>
        </table>
    </script>
    <a class="ui-balloon-arrow"></a>
    <a class="ui-balloon-close ico-close" id="J-product-rank-details-close"></a>
</div>`;
    GM_log("initShowKeywordRankUI");
}

function initShowKeywordRank(){
    setShowKeywordRankButton();
    initShowKeywordLink();
    initShowKeywordRankSetting();
    loadShowKeywordRankJS();
    initShowKeywordRankUI();
    setTimeout(initShowKeywordRankModel, 2000);
}
let getCheckRankKeywordsUrl = "http://192.168.0.105/xcrm/index.php/home/keywords/checkRankKeywords";
let checkRankUrl = "https://hz-mydata.alibaba.com/self/.json?action=CommonAction&iName=getKeywordSearchProducts&ctoken=";
let postDataUrl = "http://192.168.0.105/xcrm/index.php/home/rank/collectRankData";
function checkKeywordsRank(){

    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        url : getCheckRankKeywordsUrl,
        onload : function (response) {
            GM_log(response);
            let result = jQuery.parseJSON(response.responseText);
            GM_log(result);
            checkRank(result.value, 0);

        }
    });

}

function postData(keyword, result){
 GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8"
        },
        url : postDataUrl + "?keyword=" + keyword + "&result=" + result,
        onload : function (response) {
            GM_log(response);
        }
    });

}

function checkRank(keywords, index){
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8"
        },
        url : checkRankUrl + GM_getValue("ali_ctoken") + "&dmtrack_pageid=" + GM_getValue("ali_dmtrack_pageid") + "&keyword=" + keywords[index].keyword,
        onload : function (response) {
            GM_log(response);
            let result = jQuery.parseJSON(response.responseText);
            if(result.successed == true){
                postData(keywords[index].keyword, response.responseText.replace('"successed":true,',""));
            } else {
                GM_log("query fail...." + response.finalUrl);
            }
            GM_log(result);
            index ++;
            if(index < keywords.length){
                checkRank(keywords, index);
            }


        }
    });
}

function autoGetShowroomTags(){
    let items = document.querySelectorAll(".item-main");
    let resultTable = q("#resultTable");
    if(resultTable == null){
        resultTable = document.createElement("table");
        resultTable.id = "resultTable";
        let tr = document.createElement("tr");
        resultTable.append(tr);
    }
    let trs = resultTable.querySelectorAll("tr");
    let curTr = trs[trs.length - 1];
    for(let i = 0; i < items.length; i++){
        let tagsNode = items[i].querySelector(".tags");
        if(tagsNode){
            let tags = tagsNode ? tagsNode.innerText : "";
            let urlNode = items[i].querySelector(".title.seo-title>a");
            let url = urlNode.getAttribute("href");
            let title = urlNode.innerText;
            tags = tags.replace("Tags: ", "");
            tags = tags.replace("| View larger image ", "");
            //GM_log(tags.trim() + " | " + title + " | " + url);
            let arr = tags.split("|");
            for(let i in arr){
                if(curTr.querySelectorAll("td").length >= 5) {
                    curTr = document.createElement("tr");
                    resultTable.append(curTr);
                }
                let td = document.createElement("td");
                td.innerText = arr[i];
                curTr.append(td);
            }
        }
    }
    let currentPage = parseInt(q(".current").innerText);
    if(currentPage < 15 && q("a.next") != null) {
        GM_setValue("keywords", resultTable.outerHTML);
        if(GM_getValue("autoGetShowroomTags") == null){
            GM_setValue("autoGetShowroomTags", 1);
        }
        q("a.next").click();
    } else {
        GM_deleteValue("autoGetShowroomTags");
        let keywordSearch = q("[name=SearchText]").value;
        let sheetName = keywordSearch != null && keywordSearch != "" ? keywordSearch : "tags";
        tableToExcel(resultTable, sheetName);
    }

}

function downProductTagsExl(){
    let resultTable = q("#resultTable");
    if(resultTable != null) {
        let keywordSearch = q("[name=SearchText]").value;
        let sheetName = keywordSearch != null && keywordSearch != "" ? keywordSearch : "tags";
        tableToExcel(resultTable, sheetName);
    }
}

function testGetKeywordSearchProducts(){//"//hz-mydata.alibaba.com/self/.json?action=CommonAction&iName=getKeywordSearchProducts"
    window.xxxx = 0;
    let url = "https://hz-mydata.alibaba.com/self/.json?action=CommonAction&iName=getKeywordSearchProducts&0.5477810472456115&ctoken=12sd2gi_uwcmz&dmtrack_pageid=7416c5430bb796c25ae6a6ac16314fa87cb6711a2e"
    GM_xmlhttpRequest({ //获取列表
        method : "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: "keyword=goggles+motocross",
        url : url,
        onload : function (response) {
            GM_log(response);
        }
    });
}

function testWindowFunction(){
    window.testWindowFunction = function(){
        testGetKeywordSearchProducts();
    }
}

function testCallSeajs(){
    seajs.iuse("//i.alicdn.com/local/test.js")(function(t){
        t.init(GM_xmlhttpRequest);
    });
}

function reLogin(){
    GM_log("reLogin.....");
    window.location.reload();
}

function autoLogin() {
    var ali_settings = GMgetValue('ali_settings','{"keywordInterval":"","cycleInterval":"","aliUserName":"","aliUserPassword":""}')
    .then((ag)=>{
        let settings = JSON.parse(ag);
        document.querySelector("#fm-login-id").value = settings.aliUserName;
        document.querySelector("#fm-login-password").value = settings.aliUserPassword;
        setTimeout("document.querySelector('#fm-login-submit').click();", 2000);
    });
}

function insertQuickSumitBtn(){
    GM_log("quicksumit");
    let insetNode = q(".form-pinbar");
    if (insetNode) {
        let quickSumitBtn = document.createElement("button");// document.querySelector("#submitFormBtnA").cloneNode(true);
        quickSumitBtn.innerText = "提 交";
        quickSumitBtn.type = "button";//必需加这句
        quickSumitBtn.setAttribute("class", "next-btn next-btn-primary next-btn-large step-buttons");
        quickSumitBtn.setAttribute("style", "margin-left: 30%;margin-right: 30%;margin-bottom:10px;");
        quickSumitBtn.onclick = function () {
            document.querySelectorAll(".next-btn.next-btn-primary.next-btn-large.step-buttons")[1].click();
        }
        insetNode.append(quickSumitBtn);
    } else {
        setTimeout(insertQuickSumitBtn, 1000);
    }

}

function applyTemplate(){
    let ifr = document.querySelector("#superText_ifr");
    let ifr_body = ifr.contentDocument.querySelector("#tinymce");
    if(ifr_body != null){
        let modelNameTag = document.querySelector("[name=sysAttrValueIdAndValue3]");
        GM_xmlhttpRequest({ //获取列表
            method : "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            url : settings.aliToolsHost + "/alibaba/template/" + modelNameTag.value + ".template.html",
            onload : function (response) {
                GM_log(response);
                let template = response.responseText;
                let productName = q("#productName").value;
                let productId = q("#productId").value;
                let contactUs = "https://message.alibaba.com/msgsend/contact.htm?action=contact_action&domain=1&id=" + productId;
                template = template.replace(/{productName}/, productName);
                template = template.replace(/{contactUs}/g, contactUs);
                GM_log(template);
                ifr_body.innerHTML = template;
                ifr_body.focus();
            }
        });

    }
}


function insertApplyTemplateBtn(){
    let mceItemList = document.querySelector("#mceItemList");
    if (mceItemList && document.querySelector(".mceItem")) {

        let applyTemplateBtn = document.createElement("a");// document.querySelector("#submitFormBtnA").cloneNode(true);
        let modelNameTag = document.querySelector("[name=sysAttrValueIdAndValue3]");
        let modelName = modelNameTag == null || modelNameTag.value == "" ? "无型号" : modelNameTag.value;
        applyTemplateBtn.innerHTML = "<font color='blue'>使用模版 " + modelName + "</font>";
        applyTemplateBtn.setAttribute("class","mceItemSubject");
        //applyTemplateBtn.setAttribute("class", "next-btn next-btn-primary next-btn-large");
        //applyTemplateBtn.setAttribute("style", "font-color:red;");
        applyTemplateBtn.onclick = function () {
            modelNameTag = document.querySelector("[name=sysAttrValueIdAndValue3]");
            if(modelName == null || modelNameTag.value == "") {
                alert("请设置产品型号");
                return;
            }
            applyTemplate();
        }
        mceItemList.append(applyTemplateBtn);

    } else {
        setTimeout(insertApplyTemplateBtn, 1000);
    }

}

function insertSetContactUSBtn(){
    let mceItemList = document.querySelector("#mceItemList");
    if (mceItemList && document.querySelector(".mceItem")) {

        let setContactUSBtn = document.createElement("a");// document.querySelector("#submitFormBtnA").cloneNode(true);
        setContactUSBtn.innerHTML = "<font color='blue'>设置CONTACT US</font>";
        setContactUSBtn.setAttribute("class","mceItemSubject");
        //applyTemplateBtn.setAttribute("class", "next-btn next-btn-primary next-btn-large");
        //applyTemplateBtn.setAttribute("style", "font-color:red;");
        setContactUSBtn.onclick = function () {
            notifyCheckContactUS();
        }
        mceItemList.append(setContactUSBtn);

    } else {
        setTimeout(insertSetContactUSBtn, 1000);
    }

}

function testMessage(){
     GM_sendMessage('_.unique.name.greetings', 'hello', window.location.href);
}

function sideBar () {
    GMaddStyle(`
    /*TMHY:TamperMonkeyHuanYan*/
    #TMHYvideoContainer{z-index:999998;background:rgba(0,0,0,.7);position:fixed;top:7em;left:5em;height:65%;width:65%;resize:both;overflow:auto;box-shadow:2px 2px 5px 5px rgba(255,255,0,.8);}
    /*TMHYVideoContainer*/
    #TMHYvideoContainer button{top:.1em;cursor:pointer;visibility:hidden;font-size:3em;color:#fff;background:transparent;border:0;}
    #TMHYvideoContainer:hover button{visibility:visible;}
    #TMHYvideoContainer:hover button:hover{color:#ff0;}
    #TMHYiframe{height:100%;width:100%;overflow:auto;position:absolute;top:0;left:0;margin:auto;border:0;box-shadow:0 0 3em rgba(0,0,0,.4);z-index:-1;}
    /*TMHYIframe*/
    #TMHYul{position:fixed;top:5em;left:0;padding:0;z-index:999999;}
    #TMHYul li{list-style:none;}
    #TMHYul svg{float:right;}
    .TM1{opacity:0.3;position:relative;padding-right:.5em;width:1.5em;cursor:pointer;}
    .TM1:hover{opacity:1;}
    .TM1 span{display:block;border-radius:0 .3em .3em 0;background-color:#ffff00;border:0;font:bold 1em "微软雅黑"!important;color:#ff0000;margin:0;padding:1em .3em;}
    .TM3{position:absolute;top:0;left:1.5em;display:none;border-radius:.3em;margin:0;padding:0;}
    .TM3 li{float:none;width:11em;margin:0;font-size:2em;padding:.15em 1em;cursor:pointer;color:#3a3a3a!important;background:rgba(255,255,0,0.8);}
    .TM3 li:hover{color:white!important;background:rgba(0,0,0,.8);}
    .TM3 li:last-child{border-radius:0 0 .35em .35em;}
    .TM3 li:first-child{border-radius:.35em .35em 0 0;}
    .TM1:hover .TM3{display:block;}
    /*自定义解析接口,本页播放窗口设置*/
    .TMHYp {position:fixed;top:20%;left:20%;z-index:999999;background:yellow;padding:30px 20px 10px 20px;border-radius:10px;text-align:center;}/*TMHYpanel*/
    .TMHYp * {font-size:16px;background:rgba(255,255,0,1);font-family:'微软雅黑';color:#3a3a3a;border-radius:10px;}
    #tMuserDefine li {margin:5px;width:100%;list-style-type:none;}
    .TMHYp input[type=text] {border-radius:5px !important;border:1px solid #3a3a3a;margin:2px 10px 2px 5px;padding:2px 5px;}
    .TMHYxti {width:600px;}/*TMHYlongTextInput*/
    .TMHYlti {width:350px;}/*TMHYlongTextInput*/
    .TMHYmti {width:160px;}/*TMHYmti*/
    .idelete {float: left;  display: inline-block; color: red; padding: 0 20px !important; cursor: pointer;}
    .iname {padding-right:10px;}
    li:hover .idelete,li:hover .ilink,li:hover .iname {background:rgba(224,175,17,0.62);}
    .TMHYp button {border:1px solid #3a3a3a;border-radius:5px;cursor:pointer;padding: 2px 10px;margin:10px 20px 0 20px;}
    .TMHYp button:hover {background:#3a3a3a;color:yellow;}
    .TMHYClose {position:absolute;top:0;left:0;margin:0!important;}
    .TMHYp fieldset {margin:0;padding:10px;}
    .TMHYp legend {padding:0 10px;}
    .TMHYp label {display:inline-block;}
    .TMHYspan80 {display:inline-block;text-align:right;width:80px;}
    .TMHYspan120 {display:inline-block;text-align:right;width:120px;}
    .TMHYspan200 {display:inline-block;text-align:right;width:200px;}
    #inTabSettingSave {position:relative;margin-top:10px;padding:3px 20px;}
  `);
    let mysettings=[
        {id:"process",click:process,title:"获取Alibaba Keywords"},
        {id:"downloadExcel",click:downloadExcel,title:"下载Alibaba Keywords"},
        {id:"SshowcaseKeywords",click:showcaseKeywords,title:"橱窗产品关键词分析"},
        {id:"showIsShowcase",click:showIsShowcase,title:"是否橱窗产品"},
        {id:"top5price",click:top5price,title:"p4p关键词top5价格"},
        {id:"showTop5Price",click:showTop5Price,title:"显示top5竞价价格"},
        {id:"clearTable",click:clearTable,title:"清除数据"},
        {id:"startWatchKeywordPrice",click:startWatchKeywordPrice,title:"获取关键词出价"},
        {id:"stopWatchKeywordPrice",click:stopWatchKeywordPrice,title:"停止获取关键词出价"},
        {id:"autoGetShowroomTags",click:autoGetShowroomTags,title:"自动获取SHOWROOM TAGS"},
        {id:"downProductTagsExl",click:downProductTagsExl,title:"下载SHOWROOM TAGS"},
        {id:"test",click:checkKeywordsRank, title:"测试用"}
    ];
    //console.log(mysettings);
    if(top.location==location){//只在顶层页面运行，在iframe中不起作用
        /*  执行  */
        var div = document.createElement("div");
        div.id = "TMHYd";
        let innerText = '', i = 0;
        /*提供的接口列表*/
        for (;i < mysettings.length;i++) {
            innerText += `<li id=${mysettings[i].id} data-order=${i} title="${mysettings[i].title}">${mysettings[i].title}</li>`;
        }
        div.innerHTML = `
                <ul id="TMHYul">
                <li class="TM1"><span id="TMList"  title="Everest" onclick="">▶</span><ul class="TM3 TM4">${innerText}</ul></li>
                <li class="TM1"><span id="TMSet">▣</span><ul class="TM3">
                <li><input type="checkbox" id="addApiChekBx"><label id="batchUpdate">批量替换</label></li>
                <li><label id="intabSettingBtn">设置</label></li>
                </ul></li>
                </ul>
                `;
        document.body.appendChild(div);
        if(q("#batchUpdate")){
            q("#batchUpdate").onclick = batchUpdate;
        }
        if(q("#intabSettingBtn")){
            q("#intabSettingBtn").onclick = intabSetting;
        }
        let j = 0;
        for(j in mysettings){
            let liItem = q("#" + mysettings[j].id);
            if(liItem != null) {
               liItem.onclick = mysettings[j].click;
            }
        }


    }
}

//生成"嵌入页面大小位置设置"面板
  function intabSetting(){
      var a = makeEl('div');
      a.id='TMHYSetting';
      a.setAttribute('class', 'TMHYp');
      a.innerHTML = `
      <button class="TMHYClose" onclick="document.body.removeChild(this.parentNode)">&#128473;</button>
      <fieldset>
        <legend>参数设置</legend>
        <label for="TMpH"><span class="TMHYspan80">词间隔</span><input type="text" id="keywordInterval" value="${settings.keywordInterval}"  class="TMHYmti" placeholder='默认2秒'/>秒</label>
        <label for="TMpW"><span class="TMHYspan80">采集周期</span><input type="text" id="cycleInterval" value="${settings.cycleInterval}"  class="TMHYmti" placeholder='默认900秒'/>秒</label><br />
        <label for="TMpL"><span class="TMHYspan80">用户名</span><input type="text" id="aliUserName" value="${settings.aliUserName}" class="TMHYmti" placeholder=''/></label>
        <label for="TMpT"><span class="TMHYspan80">登录密码</span><input type="text" id="aliUserPassword" value="${settings.aliUserPassword}"  class="TMHYmti" placeholder=''/></label><br />
        <label for="TMpL"><span class="TMHYspan120">HOST</span><input type="text" id="aliToolsHost" value="${settings.aliToolsHost}" class="TMHYti" placeholder='主机地址'/></label>

      </fieldset>
      <button id="cancle" onclick="document.body.removeChild(this.parentNode)">取消</button>
      <button id="intabSettingSave">保存</button>
      `;
      document.body.appendChild(a);
      q('#intabSettingSave').addEventListener('click', saveInTabSetting, false);
  }

function initReplaceBtn(){
    let items = document.querySelectorAll(".default-preview-item");
    if (items != null && items.length > 0) {
        GM_log(items.length);
        for (let i = 0; i < items.length; i++){
            let input = items[i].querySelector(".ui2-checkbox-customize-input");
            let id = input.getAttribute("id").replace("checkbox-", "");
            let url = items[i].querySelector(".default-preview-box>img").getAttribute("src").replace("_350x350.jpg");
            let ul = items[i].querySelector("ul");
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.href = "javascript:void(0);";
            a.id = id;
            a.url = url;
            a.innerText = "批量替换";
            a.onclick = function(){
                batchUpdate(id, url);
            }
            li.append(a);
            ul.insertBefore(li, ul.childNodes[0]);
        }
    } else {
        setTimeout(initReplaceBtn, 2000);
    }
}

function UIUpdateCallback (records) {
    records.map(function (record) {
        console.log(record);
    });
}

let observerList = [];

function observeUIUpdate(selector, options, callback){
    var mo = new MutationObserver(callback);
    var element = document.getElementById(selector);
    options = {
        'attributes': true,
        'attributeOldValue': true,
        'attributeFilter': ["style"]
    }

    mo.observe(element, options);
    observerList.push(mo);
}

function batchUpdate(id, url){
    var a = makeEl('div');
      a.id='BatchUpdate';
      a.setAttribute('class', 'TMHYp');
      a.innerHTML = `
      <button class="TMHYClose" onclick="document.body.removeChild(this.parentNode)">&#128473;</button>
      <fieldset>
        <legend>图片批量替换</legend>
        <input type="hidden" value="${id}" id="imageId"/>
        <label for="TMpH"><span class="TMHYspan80">原始图片</span><input type="text" id="keywordInterval" class="TMHYxti" value="${url}" placeholder='原始图片地址'/></label><br />
        <label for="TMpW"><span class="TMHYspan80">新图片</span><input type="text" id="cycleInterval" class="TMHYxti" placeholder='新图片地址'/></label>

      </fieldset>
      <button id="cancle" onclick="document.body.removeChild(this.parentNode)">取消</button>
      <button id="batchUpdateDo">确定</button>
      `;
      document.body.appendChild(a);
      q('#batchUpdateDo').addEventListener('click', batchUpdateDo, false);
}

let listReferenceProductsUrl = "https://photobank.alibaba.com/photobank/node/ajax/photos/reference/listReferenceProductsByImageId.do?";
function batchUpdateDo(){
    let queryParams = "";
    queryParams = queryParams + "ctoken=" + GM_getValue("ali_ctoken");
    queryParams = queryParams + "&dmtrack_pageid=" + GM_getValue("ali_dmtrack_pageid");
    queryParams = queryParams + "&_=" + Date.now();
    queryParams = queryParams + "&id=" + q("#imageId").value;
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        url : listReferenceProductsUrl + queryParams,
        onload : function (response) {
            GM_log(response);
        }
    });
}

//保存嵌入页面大小位置设置
function saveInTabSetting(){
    var ali_settings = {
        keywordInterval:q('#keywordInterval').value,
        cycleInterval:q('#cycleInterval').value,
        aliUserName:q('#aliUserName').value,
        aliUserPassword:q('#aliUserPassword').value,
        aliToolsHost:q('#aliToolsHost').value
    };
    GMsetValue('ali_settings', JSON.stringify(ali_settings));
    settings = ali_settings;
    setTimeout('document.body.removeChild(q("#TMHYSetting"));', 30);
}

function GMaddStyle(cssText){
    let a = document.createElement('style');
    a.textContent = cssText;
    let doc = document.head || document.documentElement;
    doc.appendChild(a);
}
/* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
   * 为了兼容GreasyMonkey 4.0 获取结构化数据,比如 json Array 等,
   * 应当先将字符串还原为对象,再执行后续操作
   * GMgetValue(name,defaultValue).then((result)=>{
   *   let result = JSON.parse(result);
   *   // other code...
   * };
   */
function GMgetValue(name, defaultValue) {
    if (typeof GM_getValue === 'function') {
        return new Promise((resolve, reject) => {
            resolve(GM_getValue(name, defaultValue));
            // reject();
        });
    } else {
        return GM.getValue(name, defaultValue);
    }
}
/* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
   * 为了兼容GreasyMonkey 4.0 储存结构化数据,比如 json Array 等,
   * 应当先将对象字符串化,
   * GMsetValue(name, JSON.stringify(defaultValue))
   */
function GMsetValue(name, defaultValue) {
    if (typeof GM_setValue === 'function') {
        GM_setValue(name, defaultValue);
    } else {
        GM.setValue(name, defaultValue);
    }
}
function GMxmlhttpRequest(obj){
    if (GM_xmlhttpRequest === "function") {
        GM_xmlhttpRequest(obj);
    } else{
        GM.xmlhttpRequest(obj);
    }
}

function initSetting(){
    var ali_settings = GMgetValue('ali_settings','{"keywordInterval":"","cycleInterval":"","aliUserName":"","aliUserPassword":"","aliToolsHost":""}')
    .then((ag)=>{
      settings = JSON.parse(ag);
      settings.collectUrl = settings.aliToolsHost + "/alibaba/collect.php";
    });
}



function interact(methodName, params){

}
let productItems;
let pIndex = 0;
let openTab = false;
function checkScore(){
    pIndex = 0;
    productItems = qa(".next-table-cell.last");
    if(productItems != null && productItems.length > 0){
        doCheckScore(productItems, 0);
    }
}

function doCheckScore(items, index){
    let item = items[index].querySelector("a");
    let url = item.getAttribute("href") + "&checkScore=";
    if(!openTab){
        GM_openInTab(url);
        openTab = true;
    } else {
        GM_sendMessage("check_product_score_url", JSON.stringify({url: url, r: Math.random()}));
    }
}

function notifyScore() {
    let scoreTextDiv = q(".score-text");
    if(scoreTextDiv){
        let productId = q("#productId").value;
        GM_sendMessage("update_product_score", JSON.stringify({score: scoreTextDiv.innerText, productId: productId,r: Math.random()}));
    } else {
        setTimeout(notifyScore, 1000);
    }
}

function autoBathJoinP4PNext(){
    let next = q(".ui-pagination-next");
    next.click();
    setTimeout(autoBathJoinP4P, 2000);
}

function autoBathJoinP4P(){
    let checkBtn = q("[name=check-all]");
    if(checkBtn  != null && checkBtn.getAttribute("disabled") == null){
        checkBtn.click();
        q(".ui-batch-join").click();
    }
    let next = q(".ui-pagination-next");
    if(next != null && next.getAttribute("class") == "ui-pagination-next"){
        setTimeout(autoBathJoinP4PNext, 1000);
    }

}

function setBathJoinP4PBtn() {
    let div = q(".batch-join-p4p");
    let btn = document.createElement("input");
    btn.setAttribute("class", "ui-button ui-button-primary ui-button-medium");
    btn.type = "button";
    btn.value="Auto Join P4P";
    btn.addEventListener("click", autoBathJoinP4P);
    div.append(btn);
}

function get_PAGE_SCHEMA_Keywords(){
    let keywords = document.querySelector("[name='keywords']");

   if(keywords != null){
       let content = keywords.getAttribute("content");
       if (content != null && content != "") {
           console.log(content);
           content = content.substring(content.indexOf("Buy") + 3, content.lastIndexOf("Product"));
       }

       let tagsWrap = document.querySelector(".ma-tag-wrap");
       tagsWrap.innerHTML = "<strong>Keywords:</strong>" + content;


   } else {
       setTimeout(get_PAGE_SCHEMA_Keywords, 1000);
   }
}


(function() {
    'use strict';
    var _TM = {
        getKeywordSearchProducts: function (params){
            GM_log(parmas);
        }
    };
    GM_onMessage('_.unique.name.greetings', function(src, message) {
        console.log('[onMessage]', src, '=>', message);
    });

    var tMscript = document.createElement('script');
    tMscript.innerText = `q = function(cssSelector){return document.querySelector(cssSelector);};qa = function(cssSelector){return document.querySelectorAll(cssSelector);};`;
    document.head.appendChild(tMscript);
    window.q = function(cssSelector) {return document.querySelector(cssSelector);};
    window.qa = function(cssSelector) {return document.querySelectorAll(cssSelector);};
    window.makeEl = function(tag){return document.createElement(tag);};
    window.alert = function (){return console.log("xxx");};
    window.addEventListener("_TM_", function(method, params){_TM[methodName].apply(params);});

    initSetting();

    sideBar();
    console.log("GM value keywords");
    //GM_log(GM_getValue("ranksearchkeywords").toString());//error
    let table = document.createElement("table");
    document.body.append(table);
    table.outerHTML = GM_getValue("keywords");
    if(/^https?:\/\/i\.alibaba.com\//.test(window.location.href)){
        setAliParam();
    }else if (/^https?:\/\/data.alibaba.com\/product\/ineffective/.test(window.location.href)) {
        let pageNum = document.createElement("a");
        pageNum.id = "pageNum";
        pageNum.innerText = "0";
        pageNum.onclick = function() {
            pageNum.innerHTML = 0;
        }

        let insertBtn = document.createElement("button");
        insertBtn.id = "deletePageAll";
        insertBtn.innerText = "删除本页";
        insertBtn.setAttribute("class", "next-btn next-medium next-btn-normal");
        insertBtn.onclick = function(){
            pauseBtn.disabbled = false;
            let selectAllBtn = document.querySelector(".select-all").querySelector("input");
            selectAllBtn.click();
            let deleteAllBtn = document.querySelector(".delete>button");
            deleteAllBtn.click();
            let confirmBtn = document.querySelector(".next-btn-primary.next-dialog-btn");
            confirmBtn.click();
            setTimeout(function(){
                let cancleBtn = document.querySelectorAll(".next-btn-normal.next-dialog-btn");
                //let cancleBtn = document.querySelectorAll(".ui-window-close");
                console.log(cancleBtn);
                if(cancleBtn && cancleBtn.length > 0) {
                    for(let i = 0; i < cancleBtn.length; i++){
                        cancleBtn[i].click();
                    }
                }

            },1500);
            let pageNum = document.querySelector("#pageNum");
            let currentNum = parseInt(pageNum.innerHTML) + 1;
            pageNum.innerHTML = currentNum;
            setTimeout(function(){

                let selectAllBtn = document.querySelector(".select-all").querySelector("input");
                selectAllBtn.click();
                let nextPageBtn = document.querySelectorAll(".next-pagination-item.next-next");
                    nextPageBtn[1].click();

                
            },2500);
            if(currentNum < 20){
                setTimeout(function(){
                    let pauseBtn = document.querySelector("#pauseBtn");
                    if(pauseBtn.disabled == false) {
                        let delAllBtn = document.querySelector("#deletePageAll");
                        delAllBtn.click();
                    }
                },4500);
            } else {
                /*
                let formData = new FormData();
                formData.append("action", "trash_manage_action");
                formData.append("event_submit_do_delete", "");
                formData.append("event_submit_do_clear", "anything");
                formData.append("event_submit_do_recover", "");
                formData.append("identityCode", "SESS_WS1060146179_1597584137057_4780");//
                formData.append("trashType", "product");
                formData.append("id", "");
                formData.append("origin", "");
                formData.append("_csrf_token_", window.csrfToken);//
                var httpRequest = new XMLHttpRequest();
                httpRequest.open("POST", "https://hz-productposting.alibaba.com/trash/trash_manage.htm?spm=a2793.11769249.0.0.25763e5fM2C2V8&s=auto", true);
                httpRequest.onload = function(e){
                    let delAllBtn = document.querySelector("#deletePageAll");
                    delAllBtn.click();
                    console.log("trash deleted....");
                }
                httpRequest.send(formData);
                */
                let recycleBox = document.querySelector("#recycleBox");
                recycleBox.click();
                currentNum = 0;
                pageNum.innerHTML = currentNum;
                setTimeout(function(){
                    let pauseBtn = document.querySelector("#pauseBtn");
                    if(pauseBtn.disabled == false) {
                        let delAllBtn = document.querySelector("#deletePageAll");
                        delAllBtn.click();
                    }
                },10000);
            }
            

        }
        let pauseBtn = document.createElement("button");
        pauseBtn.id = "pauseBtn";
        pauseBtn.innerText = "暂停";
        pauseBtn.setAttribute("class", "next-btn next-medium next-btn-normal");
        pauseBtn.onclick = function(){
            pauseBtn.disabbled = true;

        }
        let recycleBox = document.createElement("a");
        recycleBox.id = "recycleBox";
        recycleBox.innerText = "回收站";
        recycleBox.setAttribute("href", "https://hz-productposting.alibaba.com/trash/trash_manage.htm?s=auto");
        recycleBox.setAttribute("target", "_blank");
        let div = document.querySelector(".action");
         div.append(pageNum);
        div.append(insertBtn);
        div.append(pauseBtn);

        div.append(recycleBox);

    }else if(/^https?:\/\/hz-productposting.alibaba.com\/trash\/trash_manage.htm/.test(window.location.href)){
        setTimeout(function(){
            clearDustbin.action();
        }, 1500);
        setTimeout(function(){
            let okBtn = document.querySelector("input[name='msgBoxOkButton'");
            okBtn.click();
        }, 2500);
    }else if (/^https?:\/\/www\.alibaba.com\/product-detail\//.test(window.location.href)) {
        // 选择将观察突变的节点
        var targetNode = document.getElementsByTagName('body')[0];

        // 观察者的选项(要观察哪些突变)
        var config = { attributes: true, childList: true, subtree: true };

        // 当观察到突变时执行的回调函数
        var callback = function(mutationsList) {
            mutationsList.forEach(function(item,index){
                if (item.type == 'childList') {
                    console.log('有节点发生改变，当前节点的内容是：');
                    console.log(item.target.innerHTML);
                } else if (item.type == 'attributes') {
                    console.log('修改了'+item.attributeName+'属性');
                }
            });
        };

        // 创建一个链接到回调函数的观察者实例
        var observer = new MutationObserver(callback);

        // 开始观察已配置突变的目标节点
        //observer.observe(targetNode, config);
        // 停止观察
        //observer.disconnect();
        get_PAGE_SCHEMA_Keywords();
        
    } else if(/^https?:\/\/hz-productposting\.alibaba.com\/product\/ranksearch\//.test(window.location.href)){
        let keywords = GM_getValue("ranksearchkeywords", "");

        let insertDiv = document.createElement("div");
        let parentDiv = document.querySelectorAll(".search-main");
        if(keywords !== "") {
            let keywordsArr = keywords.split("|");
            let table = document.createElement("table");
            let tr = null;
            for(let i = 0; i < keywordsArr.length; i++) {
                if(i % 6 === 0){
                    tr = document.createElement("tr");
                    table.append(tr);
                }
                let td = document.createElement("td");
                td.setAttribute("style","padding-right:20px");
                let a = document.createElement("a");
                a.onclick = ranksearch;
                a.href = "#";
                a.innerHTML = keywordsArr[i];
                td.append(a);
                tr.append(td);
            }
            insertDiv.append(table);
        }

        let addInput = document.createElement("input");
        addInput.setAttribute("length", 80);
        addInput.id = "addInput";
        let addBtn = document.createElement("button");
        addBtn.onclick = addRanksearchKeyword;
        addBtn.innerText = "Add Keyword";
        insertDiv.append(addInput);
        insertDiv.append(addBtn);

        parentDiv[0].appendChild(insertDiv);
    }else if(/^https?:\/\/www2\.alibaba.com\/manage_ad_keyword.htm/.test(window.location.href)){
        setAliParam();
        setAnalystRankButton();
        setTop5PriceButton();
        setTimeout(initShowKeywordRank, 2000);

        if(GM_getValue("reLogin") == 1){
            GM_setValue("reLogin", 0);
            startWatchKeywordPrice();
        }
        //setLeftTime(leftTime);
    }else if(/^https?:\/\/passport.alibaba.com/.test(window.location.href)){
        if(GM_getValue("reLogin") == 1) {
            autoLogin();
        }
    }else if(/productlist/.test(window.location.href) || /featureproductlist/.test(window.location.href) || /productgrouplist/.test(window.location.href)){//店铺内产品列表
        GM_log(GM_getValue("processNextpage"));
        if(GM_getValue("processNextpage") == 1){
            GM_setValue("processNextpage", 0);
            GM_log("processNextpage......");
            process();
        }
    } else if(/hz-productposting\.alibaba\.com\/product\/products_manage.htm/.test(window.location.href)){
        insertShowCategoryBtn();
    } else if(/https:\/\/hz-mydata.alibaba.com\/self\/keyword.htm/.test(window.location.href)){
        setBathJoinP4PBtn();
    }else if(/www.alibaba.com\/showroom/.test(window.location.href)){
        if(GM_getValue("autoGetShowroomTags") == 1) {
            autoGetShowroomTags();
        }
    } else if(/https:\/\/post.alibaba.com\/product\/publish.htm/.test(window.location.href)){
        insertQuickSumitBtn();
        //insertApplyTemplateBtn();
        insertSetContactUSBtn();
        GM_onMessage("check_contact_us_url", function(){
            let data = GM_getValue("check_contact_us_url");
            let dataObj = jQuery.parseJSON(data);
            if(dataObj){
                window.location.href = dataObj.url;
            }
        });
        if(/checkScore=/.test(window.location.href)){
            window.onbeforeunload = function(){
                alert("close");
            };
            GM_onMessage("check_product_score_url", function(){
                let data = GM_getValue("check_product_score_url");
                let dataObj = jQuery.parseJSON(data);
                if(dataObj){
                    window.location.href = dataObj.url;
                }
            });
            notifyScore();
        } else if(/checkContactUS=/.test(window.location.href)){
            let y = (document.body.scrollHeight / 3) * 2;
            if(q("#struct-superText")) {
                y = getXY(q("#struct-superText")).y;
            }
            window.scrollTo(0, y);
             notifyCheckContactUS();
        }
    }else if(/post.alibaba.com\/product\/success.htm\?isSuccess=true/.test(window.location.href)){
        GM_onMessage("check_contact_us_url", function(){
            let data = GM_getValue("check_contact_us_url");
            let dataObj = jQuery.parseJSON(data);
            if(dataObj){
                window.location.href = dataObj.url;
            }
        });
        let productId = /primaryId=([0-9]+)/.exec(window.location.href)[1];
        GM_sendMessage("check_contact_us", JSON.stringify({suc: true, productId: productId, r: Math.random()}));
    }else if(/photobank.alibaba.com\/home\/index.htm/.test(window.location.href)){
        initReplaceBtn();

    } else if(/www\.alibaba\.com\/trade\/search/.test(window.location.href) || /www\.alibaba\.com\/products\//.test(window.location.href)) {
        console.log("test:kkkkk");

        let itemList = document.querySelectorAll(".stitle,util-ellipsis");
        GM_log(itemList);
        if(itemList !== null) {
            for (let i = 0; i < itemList.length; i++) {
                let aDomList = itemList[i].querySelectorAll("a");
                let featureproductlistLink = aDomList[1].href.replace("company_profile.html#top-nav-bar", "featureproductlist.html");
                let toShowcaseDom = document.createElement("a");
                toShowcaseDom.href = featureproductlistLink;
                toShowcaseDom.innerText = "=>> Showcase =>>";
                toShowcaseDom.target = "_blank";
                itemList[i].parentNode.append(toShowcaseDom);
            }
        }
    }
})();