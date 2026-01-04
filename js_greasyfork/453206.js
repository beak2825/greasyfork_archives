// ==UserScript==
// @name         TK拼多多插件
// @namespace    tk_pdd_tool
// @version      1.1.5
// @description  用于拼多多商品链接转化快手CID落地页获取商品主图使用
// @license      仅限内部使用。
// @author       xuhaoqiang
// @match        http://*/cidsv/create_pdd_kaishou_cid_link.html
// @match        https://mobile.yangkeduo.com/goods.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener

// @downloadURL https://update.greasyfork.org/scripts/453206/TK%E6%8B%BC%E5%A4%9A%E5%A4%9A%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/453206/TK%E6%8B%BC%E5%A4%9A%E5%A4%9A%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    const KEYNAME = 'TkPddCookis';
    var isInSettingPage = location.href.indexOf('create_pdd_kaishou_cid_link.html')>-1;
    var isInPddPage = /mobile\.yangkeduo\.com\/goods1?\.html\?goods_id=\d+/.test(location.href);
    if(isInSettingPage){
        document.getElementById('plugTips').style.display = 'none';
        document.getElementById('loinPddBtn').removeAttribute('disabled');
        let TkPddCookis = localStorage.getItem(KEYNAME)||'';
        GM_setValue(KEYNAME,TkPddCookis);
        GM_addValueChangeListener(KEYNAME,function(name,ov,nv,remote){
            if(remote){
                localStorage.setItem(KEYNAME,nv);
                document.getElementById('cookie_ipt').value=nv;
                if(ov!=nv)alert('设置“自动获取拼多多商品主图参数”成功');
                if(typeof(PddPage)!='undefined')PddPage.close();
            }
        });
    }
    if(isInPddPage){
        GM_setValue(KEYNAME,document.cookie);
    }
})();