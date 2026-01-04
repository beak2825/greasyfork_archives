// ==UserScript==
// @name         GFStockFundationRemainPredict
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       Juicefish
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @match        https://test.acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40771/GFStockFundationRemainPredict.user.js
// @updateURL https://update.greasyfork.org/scripts/40771/GFStockFundationRemainPredict.meta.js
// ==/UserScript==

// 在新創列表加入預計股價、個人股權資訊
Template.foundationListCard.onRendered(() => {
  function insertAfterLastRow(row) {
    instance.$(".row-info").last().after(row);
  }


    console.log('test');
  const instance = Template.instance();

  const infoRowSample = instance.$(".row-info").last();

  /*
  const stockPriceRow = infoRowSample.clone();
  stockPriceRow.find("p:eq(0)").html(t("foundationPlanStockPrice"));
  insertAfterLastRow(stockPriceRow);
  */

  const availableAmountRow = infoRowSample.clone();
  availableAmountRow.find("p:eq(0)").html('有效投資額');
  insertAfterLastRow(availableAmountRow);

  const availablePriceRow = infoRowSample.clone();
  availablePriceRow.find("p:eq(0)").html('有效股價');
  insertAfterLastRow(availablePriceRow);

  const nextPredictAmountRow = infoRowSample.clone();
  nextPredictAmountRow.find("p:eq(0)").html('進位餘額');
  insertAfterLastRow(nextPredictAmountRow);

  const nextPredictPriceRow = infoRowSample.clone();
  nextPredictPriceRow.find("p:eq(0)").html('進位股價');
  insertAfterLastRow(nextPredictPriceRow);


  instance.autorun(() => {
    const foundationData = Template.currentData();
    const totalFund = foundationData.invest.reduce((sum, {amount}) => sum + amount, 0);
    const stockPrice = computeStockPriceFromTotalFund(totalFund);
    const curSliceFund = foundationData.invest.reduce((sum, {amount}) => sum + Math.floor(amount/stockPrice)*stockPrice, 0);
    const curSlicePrice = computeStockPriceFromTotalFund(curSliceFund);
    const nextPrice = curSlicePrice * 2 < 1024 ? curSlicePrice * 2 : 1024;
    const nextSliceFund = curSlicePrice * 2 * 1000 - foundationData.invest.reduce((sum, {amount}) => sum + Math.floor(amount/nextPrice)*nextPrice, 0);

      availableAmountRow.find("p:eq(1)").html(`$ ${curSliceFund.toString().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`);
      availablePriceRow.find("p:eq(1)").html(`$ ${curSlicePrice.toString().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`);
      nextPredictAmountRow.find("p:eq(1)").html(`$ ${nextSliceFund.toString().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`);
      nextPredictPriceRow.find("p:eq(1)").html(`$ ${nextPrice.toString().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`);
  });
});

// 從總投資額推算新創公司的預計股價
function computeStockPriceFromTotalFund(totalFund) {
  let result = 1;
  while (totalFund / 1000 > result) result *= 2;
  return Math.max(1, result / 2);
}
