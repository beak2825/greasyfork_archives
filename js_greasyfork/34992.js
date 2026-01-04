// ==UserScript==
// @name         ACGN股票交易市場測試機刷錢外掛_測試中
// @namespace    http://tampermonkey.net/
// @version      3.5.5
// @description  try to take over the world!
// @author       cs12341795
// @match        https://test.acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34992/ACGN%E8%82%A1%E7%A5%A8%E4%BA%A4%E6%98%93%E5%B8%82%E5%A0%B4%E6%B8%AC%E8%A9%A6%E6%A9%9F%E5%88%B7%E9%8C%A2%E5%A4%96%E6%8E%9B_%E6%B8%AC%E8%A9%A6%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/34992/ACGN%E8%82%A1%E7%A5%A8%E4%BA%A4%E6%98%93%E5%B8%82%E5%A0%B4%E6%B8%AC%E8%A9%A6%E6%A9%9F%E5%88%B7%E9%8C%A2%E5%A4%96%E6%8E%9B_%E6%B8%AC%E8%A9%A6%E4%B8%AD.meta.js
// ==/UserScript==

Template.accountInfo.onRendered(() => {
    console.log("auto give money check");
    setTimeout(wait, 1000);
});

function wait()
{
    console.log("auto give money check");
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-give-money">自動給錢100</button>`).insertAfter($('.btn-warning')[5]);
    $('#auto-give-money')[0].addEventListener("click", function() {give_money(100); });
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-give-money">自動給錢50</button>`).insertAfter($('.btn-warning')[5]);
    $('#auto-give-money')[0].addEventListener("click", function() {give_money(50); });
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-give-money">自動給錢10</button>`).insertAfter($('.btn-warning')[5]);
    $('#auto-give-money')[0].addEventListener("click", function() {give_money(10); });
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-give-money">自動給錢5</button>`).insertAfter($('.btn-warning')[5]);
    $('#auto-give-money')[0].addEventListener("click", function() {give_money(5); });
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-give-money">自動給錢1</button>`).insertAfter($('.btn-warning')[5]);
    $('#auto-give-money')[0].addEventListener("click", function() {give_money(1); });


    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-take-money">自動罰錢100</button>`).insertAfter($('.btn-warning')[4]);
    $('#auto-take-money')[0].addEventListener("click", function() {take_money(100); });
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-take-money">自動罰錢50</button>`).insertAfter($('.btn-warning')[4]);
    $('#auto-take-money')[0].addEventListener("click", function() {take_money(50); });
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-take-money">自動罰錢10</button>`).insertAfter($('.btn-warning')[4]);
    $('#auto-take-money')[0].addEventListener("click", function() {take_money(10); });
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-take-money">自動罰錢5</button>`).insertAfter($('.btn-warning')[4]);
    $('#auto-take-money')[0].addEventListener("click", function() {take_money(5); });
    $(`<button class="btn btn-outline-info btn-sm mt-1" type="button" id="auto-take-money">自動罰錢1</button>`).insertAfter($('.btn-warning')[4]);
    $('#auto-take-money')[0].addEventListener("click", function() {take_money(1); });

}
function give_money(nn)
{
    console.log("start give_money()");
    setTimeout(auto_start, 50, 0, nn);
}

function take_money(nn)
{
    console.log("start give_money()");
    setTimeout(auto_start2, 50, 0, nn);
}

function auto_start(number, nn)
{
    console.log("auto");
    if (number < nn)
    {
        number += 1;
        $('.btn-warning')[5].click();
        setTimeout(auto_text1, 100, number, nn);

    }

}


function auto_text1(number, nn)
{
    $('input[type="text"]').val("我知道你需要$$ " + number);
    const lost = $('.btn-primary').length - 1;
    $('.btn-primary')[lost].click();

    setTimeout(auto_text2, 100, number, nn);
}

function auto_text2(number, nn)
{
    $('input[type="number"]').val("2100000000");
    const lost2 = $('.btn-primary').length - 1;
    $('.btn-primary')[lost2].click();

    setTimeout(auto_start, 100, number, nn);
}



function auto_start2(number, nn)
{
    console.log("auto");
    if (number < nn)
    {
        number += 1;
        $('.btn-warning')[4].click();
        setTimeout(auto_text1_2, 100, number, nn);

    }

}


function auto_text1_2(number, nn)
{
    $('input[type="text"]').val("我覺得你不需要$$ " + number);
    const lost = $('.btn-primary').length - 1;
    $('.btn-primary')[lost].click();

    setTimeout(auto_text2_2, 100, number, nn);
}

function auto_text2_2(number, nn)
{
    $('input[type="number"]').val("2100000000");
    const lost2 = $('.btn-primary').length - 1;
    $('.btn-primary')[lost2].click();

    setTimeout(auto_start2, 100, number, nn);
}