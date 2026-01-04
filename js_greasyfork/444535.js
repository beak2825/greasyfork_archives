// ==UserScript==
// @name         druid SQL详情页打印 SQL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  详情页最下方新增按钮，点击后在控制台打印参数拼接后的SQL
// @author       信念
// @match        http://*.com/proxy/http/kcard-prod/*/druid/sql-detail.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444535/druid%20SQL%E8%AF%A6%E6%83%85%E9%A1%B5%E6%89%93%E5%8D%B0%20SQL.user.js
// @updateURL https://update.greasyfork.org/scripts/444535/druid%20SQL%E8%AF%A6%E6%83%85%E9%A1%B5%E6%89%93%E5%8D%B0%20SQL.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function sleep(ms){
        return new Promise((resolve)=>setTimeout(resolve,ms));
    }
    document.querySelector("body > div.container-fluid > div > div > div > a").removeAttribute('href')
    document.querySelector("body > div.container-fluid > div > div > div > a").innerHTML = '控制台打印SQL'
    let paramsStr = document.querySelector("#LastSlowParameters").innerText.replaceAll(/\[|\]/g, '')
    async function test(){
        var temple=await sleep(2000);
        paramsStr = document.querySelector("#LastSlowParameters").innerText.replaceAll(/\[|\]/g, '')
        let params = paramsStr.split(',')
        let sql = document.querySelector("#formattedSql").value
        params.forEach((v, i) => {
            if (/^"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}"$/.test(v)) {
                sql = sql.replace('?', "to_date('" + v.replaceAll('"', '') + "', 'yyyy-MM-dd hh24:mi:ss')")
            } else if (v.indexOf('"') != -1) {
                sql = sql.replace('?', v.replaceAll('"', '\''))
            } else {
                sql = sql.replace('?', v)
            }
        })

        const seletor = document.querySelector("body > div.container-fluid > div > div > div > a")
        seletor.addEventListener("click", copySql)

        function copySql() {
            console.log(sql)
        }
        return temple
    }

    if(paramsStr.length == 0) {
        test()
    }
})();