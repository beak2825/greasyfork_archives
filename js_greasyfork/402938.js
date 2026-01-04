// ==UserScript==
// @name         百度后台辅助
// @namespace    https://fengchao.baidu.com/
// @version      0.13
// @description  接管百度前端!
// @author       sherlock
// @match        https://fengchao.baidu.com/fc/manage/new/user/*/mt/all/keyword
// @grant        GM_addStyle
// @require      https://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402938/%E7%99%BE%E5%BA%A6%E5%90%8E%E5%8F%B0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/402938/%E7%99%BE%E5%BA%A6%E5%90%8E%E5%8F%B0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==



(function() {
    init();
})();




function init() {
    $(".new-fc-one-menu-root .new-fc-one-menu-item:first").on('click', function() {
        console.log(123)
        setTimeout(function() {
            one();
        }, 3000);

    })
    GM_addStyle(".kr-station-edit-container .adgroup-keyword-edit-2{height:534px}");

}

function one() {
    if ($("#copykeywords").length == 0) {
        var btnStr = `<button id="copykeywords" style="margin-left:10px" type="button" label="一键复制" class="new-fc-one-btn new-fc-one-btn-base-b1 new-fc-one-btn-default">一键复制</button>`;
        $(".batch-operations div").eq(0).append(btnStr)
        $("#copykeywords").on('click', function() { copyKeywords() })
    }
}


function copyKeywords() {
    var keywords = '';
    $('.sug-table-list .row-item').each(function() {
        keywords += $(this).find("div:first").text() + "\r\n";
    });
    if (copyTxt(keywords.trim())) {
        $("#copykeywords").html('<font color="green">复制成功<font>');
        setTimeout(function() {
            $("#copykeywords").html('一键复制');
        }, 1000);
    }
}


function copyTxt(text = '') {
    var oInput = document.createElement('textarea');
    oInput.value = text;
    document.body.appendChild(oInput);
    oInput.select();
    document.execCommand("Copy");
    oInput.style.display = 'none';
    oInput.remove();
    return true;
}