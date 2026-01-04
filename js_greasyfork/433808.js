// ==UserScript==
// @name         네이버쇼핑 모바일 구매버튼
// @namespace    http://tampermonkey.net/
// @version      1.6.1bugfix
// @description  자동으로 주문서로 이동, 자동새로고침
// @author       You
// @match        https://m.smartstore.naver.com/*
// @match        https://m.brand.naver.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433808/%EB%84%A4%EC%9D%B4%EB%B2%84%EC%87%BC%ED%95%91%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EA%B5%AC%EB%A7%A4%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/433808/%EB%84%A4%EC%9D%B4%EB%B2%84%EC%87%BC%ED%95%91%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EA%B5%AC%EB%A7%A4%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

var setItemName = ""; // 구매할 상품의 문자열 일부를 큰따옴표 안에 입력하세요, 없으면 따옴표를 빈상태로 그냥 놔두세요.
var forceKeyword = false; // 문자열이 포함되지 않은경우 새로고침하려면 true로 변경하세요, 만약 문자열을 못찾았을경우 첫번재꺼를 사려면 그냥 놔두세요


var itemflag = false;
if (setItemName.length >0 ) itemflag = true;

var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}

var alertcnt=0;
alrtScope.alert = function (str) {
    $('html > head > title').text(str);
    if(str.includes('현재 해당 상품의')){
        $('button:contains("바로구매")').trigger('click');
    }
    if(str.includes('이 상품은')){
        $('button:contains("바로구매")').trigger('click');
    }
    if(str.includes('잠시 후 다시')){
        $('button:contains("바로구매")').trigger('click');
    }
};


function setItem(){
    var items = $('span:contains("상품 구매 옵션")').parent().find("a").eq(0).parent().find("ul a");
    var selectedCheck = false;
    for(var i=0; i< items.length; i++){
        if(items[i].text.includes('(품절)')==false){
            if(itemflag){
                if(items[i].text.includes(setItemName)){
                    $('a:contains("'+items[i].text+'") span').trigger('click');
                    selectedCheck = true;
                    break;
                }
            }else{
                $('a:contains("'+items[i].text+'") span').trigger('click');
                selectedCheck = true;
                break;
            }
        }
    }

    //var forceKeyword = false; // 문자열이 포함되지 않은경우 구매를 스킵하려면 true로 변경하세요 만약 문자열을 못찾았을경우 첫번재꺼를 사려면 그냥 놔두세요
    if(itemflag && !selectedCheck){
        if(forceKeyword){
            location.reload();
        }else{
            for(i=0; i< items.length; i++){
                console.log(items[i].text.includes('(품절)'))
                if(items[i].text.includes('(품절)')==false){
                    $('a:contains("'+items[i].text+'") span').trigger('click');
                    break;
                }
            }
        }
    }
    $('button:contains("바로구매")').trigger('click');
}

var macro = setInterval(function() {
    if( $('p:contains("현재 구매하실 수 없는 상품")').length > 0){
        clearInterval(macro);
        location.reload();
    }
    if( $('p:contains("준비된 재고가 소진되어 품절되었습니다")').length > 0){
        clearInterval(macro);
        location.reload();
    }
    if( $('p:contains("주문 폭주로 구매가 어렵습니다")').length > 0){
        clearInterval(macro);
        location.reload();
    }
    if( $('p:contains("현재 판매중인 상품이나")').length > 0){
        clearInterval(macro);
        location.reload();
    }
    $('button:contains("구매하기")').trigger('click');
    if($('div:contains("옵션을 먼저 선택해주세요.")').length > 0){
        clearInterval(macro);
        setItem();
    }
}, 10);



var mother = document.getElementsByClassName("module_detail_benefit");
var child = mother[0].getElementsByClassName("sub_text");
console.log();
//alert(child[0].innerText);
if(child[0].innerText == "고객을 위한 혜택"){
    window.location.href = 'https://nid.naver.com/nidlogin.login';
}
setTimeout(function() {

    if(document.getElementsByClassName("error_type").length == 1){
        location.reload();
    }
    if(document.getElementsByClassName("page_cart").length == 1){
        if(document.getElementById("check_all") == null){
            location.reload();
        }
    }
    if(document.getElementsByClassName("title_error").length >= 1){
        location.reload();
    }
    if(document.getElementsByClassName("not_goods").length >= 1){
        location.reload();
    }else{
        openFullScreenMode();

    }

    if(document.getElementsByClassName("order_payment").length == 1){
        var payifno = document.getElementsByClassName('_payMethodRadio');
        payifno[2].click();
        var payifnoDetail = document.getElementsByClassName('_payMeansClassRadio');
        payifnoDetail[3].click();
        document.getElementById('all_agree').click();
        nmp.front.order.order_sheet.account();
    }
}, 150);