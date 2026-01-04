// ==UserScript==
// @name         大店加可定制/桌垫可定制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://porder.shop.jd.com/order/orderlist*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422845/%E5%A4%A7%E5%BA%97%E5%8A%A0%E5%8F%AF%E5%AE%9A%E5%88%B6%E6%A1%8C%E5%9E%AB%E5%8F%AF%E5%AE%9A%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/422845/%E5%A4%A7%E5%BA%97%E5%8A%A0%E5%8F%AF%E5%AE%9A%E5%88%B6%E6%A1%8C%E5%9E%AB%E5%8F%AF%E5%AE%9A%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    var _name=""
    var bz_all=['桌垫可定制:无味 ','可定制: ','库房成品: ','布样: ','']
    var num=0
    'use strict';
    let jbz='<button type="button" id="kdz" class="ivu-btn ivu-btn-primary ivu-btn-large" style="    background: #2199ff;color: #fff; border: 0px; float: left;"> <span>可定制</span></button>'
    window.onload=function(){
        $(".ivu-modal-footer").eq(0).append(jbz)
        $("#kdz").click(function(){
            let bz= $(".ivu-input").eq(0).val()
            for(var i=0;i <bz_all.length;i++){
                bz=bz.replace(bz_all[i%bz_all.length],'')
            }
             bz=bz.replace(_name,'')

            num++
            let bz1=bz_all[num%bz_all.length]+bz+_name
            $(".ivu-input").eq(0).val(bz1)

        })

    }
    // Your code here...
})();