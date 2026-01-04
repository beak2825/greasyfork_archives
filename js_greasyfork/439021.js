// ==UserScript==
// @name            中烟新商盟小助手
// @namespace       https://github.com/sdokio
// @version         0.0.1
// @author          SoyaDokio
// @description     中烟新商盟订烟时删除所有订购量为0的行
// @homepage        https://github.com/sdokio/UserScript
// @icon            data:image/ico;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAAAABILAAASCwAAAAEAAAAAAAAwWxYAMFwYADVfHAA3YR8AOGEgADpkIwBAaCkARGsuAEpwNABQdTsAYIFOAGmIVwBqiVgAbItbAHOQYgB4lGgAhJ51AIafeACHoHgAiKF5AI6mgACSqYUAlKuIAJqvjQChtZgApLeZAKa5mwCnup0Aq7yiALLCqQC5x7EAucixALzKtAC+zLcAwM66AMPQvgDI1MIAytXEANDaygDU3c8A1d7QANjg1ADc49gA4ObcAOLo3wDn7OUA6u7nAPT28wD5+vgA/P38AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBgYHCIaGhoYGhocJzExMQQDAAATKwoAAwEBAQEJKDEEAgACEikvCgABAQEBAQYuBAAAABUiMTAEAQEBAQECEwQBAAETHjExDwYWIiYgJgYEAwAABy4iMRcqHR4nLQ4EBAIAAgAUIhUVFC0xMSEBAwQAAAgVHQ0ABB0xMRsDAQMEAw8vMTEVBAYQCwQAAAAEBAoxMTEdJQ0iGSQDAwAABAQrKSQkJA8SMS0jCwAAAQQKEAwOCwQBCjExHxQBAAIEGAAAAQEBAQEnMSQUAQEBAzEGAwEBAQEBBiwtEQEBAQMxJA4EAgABAQEFGhYBAQEDMTExLSkoJycnJycpJygnKAAAPUMAAFByAAByYQAARmkAAHMAAABNbwAAbGUAAHRoAAA6XAAATkQAAFNcAABzdAAAMzIAAGluAAB3cwAAd2U=
// @supportURL      https://github.com/sdokio/UserScript/issues/new/choose
// @license         MIT

// @match           *://*.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm*
// @match           *://*.xinshangmeng.com/eciop/orderForCC/cgtCartForCC.htm*
// @run-at          document-idle

// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest

// @note            2022/01/23 0.1.1 初版发布
// @downloadURL https://update.greasyfork.org/scripts/439021/%E4%B8%AD%E7%83%9F%E6%96%B0%E5%95%86%E7%9B%9F%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439021/%E4%B8%AD%E7%83%9F%E6%96%B0%E5%95%86%E7%9B%9F%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    "use strict";

    main();

    function main() {
        if (document.location.host.indexOf('xinshangmeng.com') > -1) {
            if (document.location.pathname === '/eciop/orderForCC/cgtListForCC.htm') {
                var cgtCode = '6901028180580';// 蓝楼
                getCgtLmt(cgtCode);
                // 暂时不可用，原因仍需调查
                // appendButtonSetAllReq();
            } else if (document.location.pathname === '/eciop/orderForCC/cgtCartForCC.htm') {
                appendButtonRemoveAll();
            }
        }
    }

    // 获取指定商品的可用量
    function getCgtLmt(cgtCode) {
        GM_xmlhttpRequest({
            url: getlink + 'order/cgtCo.do',
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'method=getBusiCgtLmt'
                    + '&orgCode=' + porgCode
                    + '&custCode=' + pcustCode
                    + '&cgtCode=' + cgtCode
                    + '&orderId=' + document.querySelector('#coNum').value
                    + '&orderDate=' + porderDate
                    + '&zone=' + porgCode
                    + '&v=' + new Date().getTime()
                    + '&_view=async',
            onload: function(data) {
                console.log(data.responseText);
                var cgtLmt = JSON.parse(data.responseText)[0].QTY_LMT;
                var cgtReq = Math.ceil(cgtLmt * 1.5);
                console.log('cgtReq=' + cgtReq);
                setOrdQty(cgtCode, 55, !1, cgtReq);
            }
        });
    }

    // 收藏指定商品
    function addFav() {
        var inXml = "";
        inXml = '<xsm><fav_info org_code="' + orgCode + '" cust_code="' + custCode + '">',
        inXml = inXml + '<cgt cgt_code="' + cgtCode + '" cgt_name="' + cgtName + '" qty="1" seq="999" note=""></cgt>',
        inXml += "</fav_info></xsm>",
        inXml = encodeURI(inXml);

        GM_xmlhttpRequest({
            url: getlink + 'order/cgtCo.do'
                    + 'method=addFav'
                    + '&zone=' + porgCode
                    + '&v=' + new Date().getTime()
                    + '&_view=async',
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {inXml: inXml},
            onload: function(data) {
                console.log(data.responseText);
                var cgtLmt = JSON.parse(data.responseText)[0].QTY_LMT;
                var cgtReq = Math.ceil(cgtLmt * 1.5);
                console.log('cgtReq=' + cgtReq);
                setOrdQty(cgtCode, 55, !1, cgtReq);
            }
        });
    }

    // 添加按钮：【一键订满】
    function appendButtonSetAllReq() {
        // 判断是否为目标页面
        if (document.location.pathname.indexOf('/cgtListForCC.htm') == -1) {
            return;
        }
        // 获取加入购物车按钮
        var smt = document.querySelector('#smt');
        if (!smt) return;
        var eleParent = smt.parentElement;
        if (!eleParent) return;
        // 添加一键订满按钮
        var btnSetAllReq = document.createElement('input');
        btnSetAllReq.className = 'xsm-order-check-box-input m110';
        btnSetAllReq.type = 'button';
        btnSetAllReq.value = '一键订满';
        btnSetAllReq.style += ';font-size: 18px;margin-right: 10px;';
        btnSetAllReq.addEventListener('click', setAllReqWithThreeSecondTimesOfKyl);
        eleParent.appendChild(btnSetAllReq);
    }

    // 添加按钮：【没货全删】
    function appendButtonRemoveAll() {
        // 判断是否为目标页面
        if (document.location.pathname.indexOf('/cgtCartForCC.htm') == -1) {
            return;
        }
        // 获取继续购物按钮
        var addbtn = document.querySelector('#addbtn');
        if (!addbtn) return;
        var eleParent = addbtn.parentElement;
        if (!eleParent) return;
        // 添加一键全删按钮
        var btnRemoveAll = document.createElement('input');
        btnRemoveAll.className = 'xsm-order-check-box-input m110';
        btnRemoveAll.type = 'button';
        btnRemoveAll.value = '一键全删';
        btnRemoveAll.style += ';font-size: 18px;';
        btnRemoveAll.addEventListener('click', removeAllWithKylZero);
        eleParent.appendChild(btnRemoveAll);
    }

    // 一键全订1.5倍可用量（限收收藏）
    function setAllReqWithThreeSecondTimesOfKyl() {
        console.log('function BIND testing');
        var times = 1.5;
        setAllReqWithSpecificTimesOfKyl(times);
    }

    // 设定可用量的指定倍数的需求量（仅限已收藏商品）（若含小数则个位进1）
    // 例：商品1的可用量为1时，将订购量设为1x[指定倍数]
    //     商品1的可用量为5时，将订购量设为5x[指定倍数]
    function setAllReqWithSpecificTimesOfKyl(times) {
        // 若尚未勾选“仅显示收藏”则勾选它
        var chkIsFav = document.querySelector('#isFav');
        if (chkIsFav && !chkIsFav.checked) {
            chkIsFav.click();
        }
        // 把每行需求量的“+”号都点一下
        var rows = document.querySelector('#newul').querySelectorAll('li');// 每个商品是一行
        for (var row of rows) {
            var reqQty = row.querySelector('.cgt-col-req-qty');// 可编辑的需求量
            if (reqQty.style.display != 'none') {
                reqQty.querySelector('.adda').click();
            }
        }
        // 随便点一下好让最后一个输入框失焦
        // rows.click();// 这行似乎无效，且当商品总行数只有1行时下面代码会失效
        // 把每行的订购量都设定为该行可用量的指定倍数
        for (var row of rows) {
            var qtlLmt = row.querySelector('.cgt-col-qtl-lmt');// 可用量
            qtlLmt = parseInt(qtlLmt.innerText.trim());
            var req = 1;
            if (qtlLmt > 0) {
                req = Math.ceil(qtlLmt * times);
            }
            if (req > 1) {
                var ordQty = row.querySelector('.cgt-col-ord-qty');// 可编辑的订购量
                ordQty.querySelector('input[name="ord_qty"]').value = req;
            }
        }
    }

    // 一键全删订购量为0商品
    function removeAllWithKylZero() {
        var ord = '0';
        removeAllWithKyl(ord);
    }

    // 删除订购量为指定值的所有商品
    function removeAllWithKyl(ord) {
        // 依次点击每一个可用量为0的行的删除按钮
        var rows = document.getElementById('uladd').children;
        for (var i = rows.length - 1; i >= 0; i--) {
            var spans = rows[i].getElementsByTagName('span');
            for (var span of spans) {
                if (span.id.startsWith('qty_lmt') && span.innerText.trim() == ord) {
                    rows[i].getElementsByClassName('operation')[0].getElementsByClassName('delCgt')[0].click();
                }
            }
        }
        // 隐藏黑色半透明背景
        var _interval1 = setInterval(function() {
            var eleLastChild = document.body.lastChild;
            if (eleLastChild.tagName === 'DIV' && eleLastChild.style.zIndex === '9999') {
                eleLastChild.remove();
            }
        }, 50);
        // 隐藏弹窗
        var _interval2 = setInterval(function() {
            var eleDivs = document.getElementsByClassName('ui_success');
            for (var eleDiv of eleDivs) {
                eleDiv.remove();
            }
        }, 50);
        setTimeout(function() {
            clearInterval(_interval1);
            clearInterval(_interval2);
        }, 3000);
    }

})();
