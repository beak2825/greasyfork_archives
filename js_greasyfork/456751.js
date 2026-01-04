// ==UserScript==
// @name         国家中小学智慧教育平台的教材下载
// @namespace    https://greasyfork.org/users/208628
// @version      0.1.4
// @description  国家中小学智慧教育平,教材下载,课本下载
// @author       holdpc
// @match        https://www.zxx.edu.cn/tchMaterial/*
// @match        https://basic.smartedu.cn/tchMaterial/*
// @license MIT
// @grant        GM_download
// @grant        GM_addElement
// @grant        GM_log

// @downloadURL https://update.greasyfork.org/scripts/456751/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/456751/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function download(){
  if (location.hostname === 'www.zxx.edu.cn' || location.hostname === 'basic.smartedu.cn' || location.pathname === '/tchMaterial/detail') {
	var url0=location.href
  var url0=url0.replace('basic.smartedu.cn','www.zxx.edu.cn')
	var url1=url0.replace('www.zxx.edu.cn/tchMaterial/detail?contentType=assets_document&contentId=','r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/')
	var url=url1.replace('&catalogType=tchMaterial&subCatalog=tchMaterial','.pkg/pdf.pdf')
	window.location.replace(url);
}
}download();