// ==UserScript==
// @name         备份
// @namespace    coderWyh
// @version      0.1.0
// @description  This script is only for Chinese mainland users. The script function is to help Beijing Construction Research Company set up excel forms with one click 禁止非授权使用，仅限测试人员使用代码，用于保存数据
// @author       coderWyh
// @match        http://www.gczl360.com:8084/Admin/ZLKGL/Template*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @run-at       document-end
// ==/UserScript==
// 本代码所有权归作者所有 作者QQ：2471630907 手机号：18990193572  微信同手机号
// 本代码具有知识产权 未经作者授权严禁任何人进行使用、传播、二次开发等一系列损害作者知识产权的操作
// 作者对未经授权的操作保留起诉但不仅限于起诉的维护个人知识产权利益的法律途径
(function() {
    'use strict';
    let baseId = getUrlParams('BaseId')
    let menuId = getUrlParams('MenuId')
    async function queryData() {
        let data = await axios.post('/Admin/ZLKGL/GetTemplateJson',{
            baseId: baseId,
            menuId: menuId
        })

        let result = await axios.post(BASEURL+'jky/bf/add',{
            valueId: data.data.templateId,
            menuId: menuId,
            kuName: $('.toplogin>span:first').text(),
            name: $("#Name").val(),
            shareType: 0,
            baseId: baseId,
            jsonData: data.data.data,
        })
    }
    queryData()
    setTimeout(function(){
        for (let i = 0; i < spread.getSheetCount(); i++) {
                spread.getSheet(i).options.rowHeaderVisible = true;
                spread.getSheet(i).options.colHeaderVisible = true;
            }
    },800)
    console.clear()
    function getUrlParams(name) { // 不传name返回所有值，否则返回对应值
        let url = window.location.search;
        if (url.indexOf('?') == 1) { return false; }
        url = url.substr(1);
        url = url.split('&');
        let nameres;
        // 获取全部参数及其值
        for(var i=0;i<url.length;i++) {
            var info = url[i].split('=');
            var obj = {};
            obj[info[0]] = decodeURI(info[1]);
            url[i] = obj;
        }
        // 如果传入一个参数名称，就匹配其值
        if (name) {
            for(let i=0;i<url.length;i++) {
                for (const key in url[i]) {
                    if (key == name) {
                        nameres = url[i][key];
                    }
                }
            }
        } else {
            nameres = url;
        }
        // 返回结果
        return nameres;
    }
})();