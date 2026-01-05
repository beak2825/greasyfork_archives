// ==UserScript==
// @name         Adult Novelty Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adult Novelty Helper thing
// @author       tos
// @match        *.torn.com/companies.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27640/Adult%20Novelty%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/27640/Adult%20Novelty%20Helper.meta.js
// ==/UserScript==

var APIkey = 'APIkey';

var companyDetails = document.querySelectorAll(".company-stats-list.company-info")[0].children;

var soldTotal = 0;
var stockTotal= 0;
var orderTotal = 0;

var company = {};
if(company){console.log('check 1');}

companyAPI();

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if(node.action) {
          if(node.action.split('torn.com/')[1] == 'companies.php?step=pricing&update=1') {
              addTotalsRow(soldTotal, stockTotal);
          }
          if(node.action.split('torn.com/')[1] == 'companies.php?step=stock1') {
              addStockTotals();
          }
      }
    }
  }
});

const wrapper = document.querySelector('.company-wrap');
observer.observe(wrapper, { subtree: true, childList: true });


function companyAPI(){
    $.ajax({
        type: "POST",
        url: 'https://api.torn.com/company/?selections=detailed,stock,employees&key='+APIkey,
        success: function (response) {
            if(response.company_detailed) {
                company = response;
                var employeeIDs = Object.keys(response.company_employees);
                // # ofemployees
                if(employeeIDs.length < 10) {employeeAlert();}
                // employee efficiency
                for(i=0; i<employeeIDs.length; i++) {
                    if(response.company_employees[employeeIDs[i]].effectiveness < 5) {effectivenessAlert();}
                }
                // # of trains
                if(response.company_detailed.trains_available > 10) {trainAlert();}
                // totals
                var items = Object.keys(response.company_stock);
                for(j=0; j < items.length; j++) {
                    soldTotal += response.company_stock[items[j]].sold_amount;
                    stockTotal += response.company_stock[items[j]].in_stock;
                    orderTotal =+ response.company_stock[items[j]].on_order;
                }
                if(orderTotal === 0) {orderAlert();}
            }
        }
    });
}



function employeeAlert() {
    var employees = companyDetails[0].getElementsByClassName('details-wrap')[3];
    employees.style.backgroundColor = '#f8e0da';
    employees.style.color = "red";
    employees.style.fontWeight = "bold";
}
function trainAlert() {
    var trains = companyDetails[2].getElementsByClassName('details-wrap')[1];
    trains.style.backgroundColor = "#d7e1cc";
    trains.style.color = "green";
    trains.style.fontWeight = "bold";
}
function effectivenessAlert() {
    var employeeTab = document.querySelector('#ui-id-4');
    employeeTab.style.backgroundColor = '#f8e0da';
}
function orderAlert() {
    var stockTab = document.querySelector('#ui-id-8');
     stockTab.style.backgroundColor = '#f8e0da';
}

function addTotalsRow(soldTotal, stockTotal) {
    var pricingList = document.getElementsByClassName('pricing-list-wrap')[0];
    var totalsRow = document.createElement('ul');
    totalsRow.className = 'pricing-list-title bold t-hide';
    totalsRow.innerHTML = '<li class="name">Totals</li>'+
                          '<li class="cost"><div class="t-delimiter"></div></li>'+
                          '<li class="rrp"><div class="t-delimiter"></div></li>'+
                          '<li class="sold-total"><div class="t-delimiter"></div></li>'+
                          '<li class="sold-daily">'+ numberWithCommas(soldTotal) +'<div class="t-delimiter"></div></li>'+
                          '<li class="stock">' + numberWithCommas(stockTotal) +'<div class="t-delimiter"></div></li>'+
                          '<li class="price"><div class="t-delimiter"></div></li>'+
                          '<li class="clear"></li>';
    if(pricingList){
        if(pricingList.children.length < 3){
            pricingList.appendChild(totalsRow);
        }
    }
}

function addStockTotals() {
    var stockWrap = document.querySelector('.stock-list-wrap');
    var nameCol = stockWrap.getElementsByClassName('name');
    var rrpCol = stockWrap.getElementsByClassName('rrp');
    var deliveryCol = stockWrap.getElementsByClassName('delivery');
    console.log(rrpCol);
    rrpCol[0].innerText = 'Sold Daily';
    for(k=1; k < 9; k++){
        rrpCol[k].innerText = numberWithCommas(company.company_stock[nameCol[k].innerText].sold_amount);
    }
    rrpCol[9].innerText = numberWithCommas(soldTotal);
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}