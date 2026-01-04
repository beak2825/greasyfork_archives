// ==UserScript==
// @name         xinshangmeng
// @namespace    http://www.xinshangmeng.com
// @version      0.1
// @description  China tobacco bureau cigarette order inventory inquiry
// @author       Chomutekinodango）
// @include      *gd.xinshangmeng.com:9090/eciop/orderForCC/cgtListForCC.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390068/xinshangmeng.user.js
// @updateURL https://update.greasyfork.org/scripts/390068/xinshangmeng.meta.js
// ==/UserScript==
    $(function(){

        let input=$('input.xsm-order-list-shuru-input');//获取所有的输入框dom节点
        console.dir(input);
        console.log(document);
        input.each(function(){$(this).focus().val(2).blur();});
        input.each(function(){$(this).focus().val(0).blur();});
        console.log('这是一个新商盟中烟卷烟订货库存一键查询脚本！')
        $('#xsm-order-jydh-list-content').load(function(){console.log('success')});
    });
