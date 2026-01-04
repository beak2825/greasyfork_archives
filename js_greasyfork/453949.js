// ==UserScript==
// @name         万豪积分价值计算（国内酒店中信92折人民币结算）
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Help to calculate the point value when you searching for Marriott hotels.
// @author       You
// @include       https://www.marriott.*/search/*
// @match        https://www.marriott.com*/reservation/availabilityCalendar.mi
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marriott.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453949/%E4%B8%87%E8%B1%AA%E7%A7%AF%E5%88%86%E4%BB%B7%E5%80%BC%E8%AE%A1%E7%AE%97%EF%BC%88%E5%9B%BD%E5%86%85%E9%85%92%E5%BA%97%E4%B8%AD%E4%BF%A192%E6%8A%98%E4%BA%BA%E6%B0%91%E5%B8%81%E7%BB%93%E7%AE%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/453949/%E4%B8%87%E8%B1%AA%E7%A7%AF%E5%88%86%E4%BB%B7%E5%80%BC%E8%AE%A1%E7%AE%97%EF%BC%88%E5%9B%BD%E5%86%85%E9%85%92%E5%BA%97%E4%B8%AD%E4%BF%A192%E6%8A%98%E4%BA%BA%E6%B0%91%E5%B8%81%E7%BB%93%E7%AE%97%EF%BC%89.meta.js
// ==/UserScript==

//setTimeout(calculatePointValue, 5000); // Adjust the delay as needed

var list = "";

var currency = [
      {type: "THB",
       exchange: 0.215,
       tax: 0.84246218
      },
      {type: "CNY",
       exchange: 1,
       tax:0.8577
      }
]
var config = [{
        host: "marriott.com.cn",
        abbrev: "cn",
        seedList: "div.property-card-container > div.property-card",
        calenderBoxList: "#isSubtotalView > tbody > tr > td ",
        calenderBoxPointsList: "#isNightlyRateView > tbody > tr > td ",
        leftButton : "li.js-previous-month a",
        rightButton : "li.js-next-month a",
        priceCell:"div.price-value",
        pointsCell: "div.m-price.points-value",
        seedHotelName: "",
        seedSize: "",
        seedUploaderNum: "",
        seedDownloaderNum: "",
        seedFInishNum: "",
        numOfClumns: "",
        fixedT0: "",
        fixedN0: "",
        A_ValueLevels: [
            { A_Value: 1, fontWeight: 'bold', color: '#900C3F ', fontSize: '140%' },
            { A_Value: 0.98, fontWeight: 'bold', color: 'red', fontSize: '100%' },
            { A_Value: 0, fontWeight: '', color: '', fontSize: '100%' }
        ]
    },
    {
        host: "marriott.com",
        abbrev: "com",
        seedList: "#merch-property-results > .js-property-list-container > .property-record-item",
        calenderBoxList: "div.DayPicker-Body > div.DayPicker-Week > div.DayPicker-Day",
        calenderBoxPointsList: "#isNightlyRateView > tbody > tr > td ",
        rightButton : "div.DayPicker-NavBar > span.DayPicker-NavButton.DayPicker-NavButton--next",
        leftButton : "div.DayPicker-NavBar > span.DayPicker-NavButton.DayPicker-NavButton--prev",
        seedHotelName: "",
        seedSize: "",
        seedUploaderNum: "",
        seedDownloaderNum: "",
        seedFInishNum: "",
        numOfClumns: "",
        fixedT0: "",
        fixedN0: "",
        A_ValueLevels: [
            { A_Value: 1, fontWeight: 'bold', color: '#900C3F ', fontSize: '140%' },
            { A_Value: 0.98, fontWeight: 'bold', color: 'red', fontSize: '100%' },
            { A_Value: 0, fontWeight: '', color: '', fontSize: '100%' }
        ]
    }
]

function getHotelName(dataObject){
    return dataObject.hotelName;
}

function getHotelPrice(dataObject){
    return parseInt(dataObject.replace(",",""));
}

function getCurrencyType(dataObject){
    return dataObject.currency;
}

function getCurencyRatio(dataObject){
    const foundCurrency = currency.find(cc => dataObject.includes(cc.type));
    return foundCurrency ? foundCurrency.exchange : null; // Return the excha
}

function getCurencyRatioTax(dataObject){
    const foundCurrency = currency.find(cc => dataObject.includes(cc.type));
    return foundCurrency ? foundCurrency.tax : null; // Return the excha
}



function calculatePointValue(){
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----start1")
    var rateContainers = document.getElementsByClassName('rate-container');
    console.log(rateContainers[0])
    console.log("legnth: "+ rateContainers.length)
    // Iterate through each 'rate-container'
    for (var j = 0; j < rateContainers.length; j++) {
        if(!rateContainers[j].getElementsByClassName('m-price points-value')[0]){
            if(rateContainers[j].getElementsByClassName('t-points t-point-saver-point')[0]){
                console.log(j+"HHHHHHHHHHHHHHHHHHHHHHHHHH---------CNCNCNCN-----------------")
                var points2 = parseInt( rateContainers[j].getElementsByClassName('t-points t-point-saver-point')[0].innerText.replace("&nbsp;","").replace(",",""));
                var currency2 = parseInt(rateContainers[j].getElementsByClassName('t-price')[0].innerText.replace("&nbsp;","").replace(",",""));
                var result2 = currency2 * 0.92 / points2;
                var button2 = document.createElement('button');
                button2.innerText = 'CP Value: ' + result2.toFixed(3);
                button2.style.marginRight = '10px';
                if(result2 >= 0.05){
                    button2.setAttribute("style", "background-color: #4CAF50; color: white; margin-right: 10px;");
                }
                if(result2 < 0.05){
                    button2.setAttribute("style", "background-color: #f44336; ; color: white; margin-right: 10px;");
                }
                rateContainers[j].insertBefore(button2, rateContainers[j].firstChild);
            }
            continue
        }
        console.log(j+"HHHHHHHHHHHHHHHHHHHHHHHHHH-------------------------------------")
        console.log('', rateContainers[j].getElementsByClassName('m-price points-value')[0].innerText.replace("&nbsp;","").replace(",",""));
        console.log('', rateContainers[j].getElementsByClassName('t-font-alt-xs price-value m-price-currency-s')[0].innerText.replace("&nbsp;","").replace(",",""));
        var points = parseInt( rateContainers[j].getElementsByClassName('m-price points-value')[0].innerText.replace("&nbsp;","").replace(",",""));
        var currency = parseInt(rateContainers[j].getElementsByClassName('t-font-alt-xs price-value m-price-currency-s')[0].innerText.replace("&nbsp;","").replace(",",""));
        var result = currency * 0.92 / points;
        var button = document.createElement('button');
        button.innerText = 'CP Value: ' + result.toFixed(3);
        button.style.marginRight = '10px';
        if(result >= 0.05){
            button.setAttribute("style", "background-color: #4CAF50; color: white; margin-right: 10px;");

        }
        if(result < 0.05){
            button.setAttribute("style", "background-color: #f44336; ; color: white; margin-right: 10px;");
        }
        rateContainers[j].insertBefore(button, rateContainers[j].firstChild);
    }

    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----end")
}

function add_A_Value_Columns_helper(html, theConfig) {
     console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH---------------检查页面按钮加载------------");
     const intv = setInterval(function() {
                   const RightButton = document.querySelector("a.shop-pagination-next");

                    if (RightButton==null) {
                        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误33333--页面按钮还没加载，继续加载-");
                        return;
                    }

                    const rows = document.querySelectorAll(theConfig.seedList);
                    for (let i = 0; i < rows.length; i++) {
                        let trd = rows[i].querySelector(theConfig.priceCell);
                        if(trd){
                            continue;
                        }else{
                            let trd2 = rows[i].querySelector("div.price-container > div > div > a > div > span > span.price-value > span");
                            if(trd2){
                                continue;
                            }else{
                                 let trd3 = rows[i].querySelector(theConfig.pointsCell);
                                 if(trd3){
                                    continue;
                                }else{
                                    let trd4 = rows[i].querySelector("div.unavailable-text");
                                    if(trd4){
                                        continue;
                                    }else{
                                        let trd5 = rows[i].querySelector("span.opening-soon-font");
                                        if(trd5){
                                            continue;
                                        }else{
                                            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH---------------rows 数据出错------------");
                                            console.log(rows[i]);
                                            return;
                                    }}

                            }
                        }
                    }}


                    clearInterval(intv);
                    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH---------------按钮加载完成------------");
                    console.log(RightButton);
                   add_A_Value_Columns(html, theConfig);
                }, 1000);

}


async function add_A_Value_Columns(html, theConfig) {
    const rows = document.querySelectorAll(theConfig.seedList);
    const firstRowRecorrd = rows[0].innerHTML;
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH------/////酒店列表模式/////---------------------------------------------------");
    const pointsValueStoreList = new Array(rows.length);
    const hotelNameStoreList = new Array(rows.length);
    for (let i = 0; i < rows.length; i++) {
        pointsValueStoreList[i] = 0;
        hotelNameStoreList[i] = "";
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----LOOP----------------------------------------------------------------"+i);
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----当前row[i]---"); console.log(rows[i]);
        const dataProperty = rows[i].getAttribute('data-property');
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----当前dataPropertyl---");
        console.log(dataProperty)
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----当前搜刮路径---"); console.log(theConfig.priceCell);
        let trd = rows[i].querySelector(theConfig.priceCell);
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----当前搜刮结果---"); console.log(trd);
        const dataObject = JSON.parse(dataProperty.replace(/&quot;/g, '"'));
        const hotelName = getHotelName(dataObject);
        hotelNameStoreList[i] = hotelName;
        if(!trd){
            trd = rows[i].querySelector("div.price-container > div > div > a > div > span > span.price-value > span");
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----再次搜刮div.price-container > div > div > a > div > span > span.price-value > span--结果"); console.log(trd);
              if(!trd){
              console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----价格Cell为空，跳过---");
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----------------------------------------------------------------------------");
            continue;
              }

        }
        let price = getHotelPrice(trd.innerHTML);
        const currType = getCurrencyType(dataObject);
        const currRatio = getCurencyRatio(currType);
        const RMBValue = price * currRatio;
        let pointsAmount = rows[i].querySelector(theConfig.pointsCell);
        if(!pointsAmount){
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----积分Cell为空，跳过---");
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----------------------------------------------------------------------------");
        continue;
        }
        pointsAmount = getHotelPrice(pointsAmount.innerHTML);
        const targecell = rows[i].querySelector('div.price-container');
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----下面是targecell---");
        console.log(targecell)
        // Create a new div element
        const newDiv = document.createElement('div');
        newDiv.className = 'new-div-class'; // Add a class name to the new div

        if(currType == 'CNY'){
            price = parseInt(price * 0.92 / 0.8577);
            const eachWworth = parseInt(price/pointsAmount*10000);
            pointsValueStoreList[i] = eachWworth;
            newDiv.innerHTML = `
                           <div>${hotelName}</div>
                           <div>中信92折包税：${price}</div>
                           <div>每万分值：<span style="background-color: ${eachWworth > 500 ? 'green' : 'red'}; color: white;">${eachWworth}</span></div>
                              `;
        }else{
            newDiv.innerHTML = `
                          <div>${hotelName}</div>
                          <div>${price}</div>
                          <div>人民币：${RMBValue}</div> `;
        }
        // Style the new div
        newDiv.style.display = 'block'; // Ensure it's a block-level element
        newDiv.style.textAlign = 'top'; // Align text to the left (default, but added for clarity)
        newDiv.style.marginRight = '10px'; // Add padding to the right
        newDiv.style.verticalAlign = 'top'; // Align text to the top
        newDiv.style.lineHeight = 'normal'; // Ensure normal line height for proper alignment
        newDiv.style.border = '1px solid black'; // Add a 1px black border to indicate the boundary


        const rateValueContainer = targecell.querySelector('div.price-sub-section');
        targecell.insertBefore(newDiv, rateValueContainer);
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----插入自建DIV完成！！！---");
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----------------------------------------------------------------------------");
    }
    const RightButton = document.querySelector("a.shop-pagination-next");
        if (!RightButton.hasAttribute('data-listener-added')) {
            RightButton.addEventListener('click', function (event) {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-BUtton CLICK!!!!-----222222222222--");
                 RightButton.removeAttribute('data-listener-added');
                //event.preventDefault(); // Prevent the default link behavior
                const intv = setInterval(function() {
                    const newrows = document.querySelectorAll(theConfig.seedList);
                    if (newrows==null) {
                        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误0000--rows为空，继续检测-");
                        return false;
                    }
                    const newfirstRowRecorrd = newrows[0].innerHTML;
                    if (newrows && newrows.length < 1) {
                        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误1111--页面为空，继续检测-");
                        return false;
                    }
                    if (newfirstRowRecorrd == firstRowRecorrd) {
                        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误2222---页面还没有刷新，继续检测---");
                        return false;
                    }
                    clearInterval(intv);
                   add_A_Value_Columns_helper(html, theConfig);
                }, 1000);
                // Remove the custom attribute after the click
            }, { once: true });

            // Mark the listener as added
            RightButton.setAttribute('data-listener-added', 'true');
        }

      const LButton = document.querySelector("a.shop-pagination-prev");
        if (!LButton.hasAttribute('data-listener-added')) {
            LButton.addEventListener('click', function (event) {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-BUtton CLICK!!!!-----222222222222--");
                 LButton.removeAttribute('data-listener-added');
                //event.preventDefault(); // Prevent the default link behavior
                const intv = setInterval(function() {
                    const newrows = document.querySelectorAll(theConfig.seedList);
                    if (newrows==null) {
                        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误0000--rows为空，继续检测-");
                        return false;
                    }
                    const newfirstRowRecorrd = newrows[0].innerHTML;
                    if (newrows && newrows.length < 1) {
                        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误1111--页面为空，继续检测-");
                        return false;
                    }
                    if (newfirstRowRecorrd == firstRowRecorrd) {
                        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误2222---页面还没有刷新，继续检测---");
                        return false;
                    }
                    clearInterval(intv);
                   add_A_Value_Columns_helper(html, theConfig);
                }, 1000);
                // Remove the custom attribute after the click
            }, { once: true });

            // Mark the listener as added
            LButton.setAttribute('data-listener-added', 'true');
        }
    //重新排序
    // Combine rows with their points into an array of objects
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----开始排序！！！前3个排序！！！！！---");
     for (let i = 0; i < rows.length; i++) {
        console.log("XXXOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO----i="+i+"--HOTEL:--"+hotelNameStoreList[i]+"-----POINTS:"+pointsValueStoreList[i]+"----------------------------------------------------");
     }
    // Extract the first 3 elements and their corresponding values
    const TOTALNUMTOREMOVE = rows.length;
    const rowsArray = Array.from(rows);
    const firstThree = rowsArray.slice(0, TOTALNUMTOREMOVE);
    const firstThreeValues = pointsValueStoreList.slice(0, TOTALNUMTOREMOVE);
    const pairedRows = firstThree.map((row, index) => ({
        row: row,
        value: firstThreeValues[index]
    }));
    pairedRows.sort((a, b) => b.value - a.value);
    const parent = rows[0].parentElement;
    for (let i = pairedRows.length - 1; i >= 0; i--) {
        parent.insertBefore(pairedRows[i].row, parent.firstChild); // Moves the row to the top in reverse order
    }




    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----所有代码完成！！！---");
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH--------STOP--------------------------------------------------------------");
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH--------STOP--------------------------------------------------------------");
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH--------STOP--------------------------------------------------------------");
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH--------STOP--------------------------------------------------------------");

}

async function runMainfnction(html, theConfig, settingQuery){
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----进入主程序：下面是rows[0]---");
    const rows = document.querySelectorAll(settingQuery);

    console.log(rows[0]);
    for (let i = 0; i < rows.length; i++) {
        const price = rows[i].querySelector('a > div > h2');
        if(!price){
            continue;
        }
        price = price.innerText;
        price = getHotelPrice(price);
        const currencyText = rows[i].querySelector('a > div > p').innerText;
        const CurrType = currencyText.substring(0, 3); // "   THB/总计 5 晚   "
        if(currencyText.substring(3)[0] == "总"){
            const nights =currencyText.substring(3).replace("总计", "").replace("晚", "").trim();
        }
        else{
             const nights = currencyText.substring(3).replace("晚", "").trim();
        }
        const currRatio = getCurencyRatio(CurrType);
        const totalP = parseInt(price * currRatio);
        //计算包税价格
        totalP = totalP/getCurencyRatioTax(CurrType);

        const h2Element = document.createElement("p");
        h2Element.setAttribute(
            "class",
            "l-margin-none t-font-xs"
        );
        h2Element.style.fontSize = "18px";
        h2Element.textContent = "人民币税后：" + parseInt(totalP);
        h2Element.style.color = "red";
        const targecell = rows[i].querySelector('a > div');
        //const rateValueContainer = rows[i].querySelector('a > div > p');
        targecell.appendChild(h2Element);
    }
    list = document.querySelectorAll(settingQuery)[0].innerHTML;
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----list更新为---");
    console.log(list);
    console.log("YES DONE--------");
}

async function add_A_Value_Columns_Calender(html, theConfig, mode) {
    const settingQuery = null;
    console.log("mode 是" + mode);
    if(mode == "1"){
       settingQuery = theConfig.calenderBoxList;
    }
    else if(mode == "2"){
       settingQuery = theConfig.calenderBoxPointsList;
    }
    const intv = setInterval(function() {
        var rows = document.querySelectorAll(settingQuery);
        console.log(settingQuery);
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----检查list是否和rows一样---");
        var rowcontent = rows[0].innerHTML;
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----list是---");
        console.log(list);
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----rows[0]是---");
        console.log(rowcontent);
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----匹配结果---");
        console.log(list == rowcontent);
        if (rows && rows.length < 1) {
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误1111---");
            return false;
        }
        if (list == rowcontent) {
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH----返回错误2222---");
            return false;
        }

        const RightButton = document.querySelector(theConfig.rightButton);
        if (!RightButton.hasAttribute('data-listener-added')) {
            RightButton.addEventListener('click', function (event) {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-BUtton CLICK!!!!-----222222222222--");
                event.preventDefault(); // Prevent the default link behavior
                add_A_Value_Columns_Calender(document, theConfig, mode);
                // Remove the custom attribute after the click
                RightButton.removeAttribute('data-listener-added');
            }, { once: true });

            // Mark the listener as added
            RightButton.setAttribute('data-listener-added', 'true');
        }

        const leftButton = document.querySelector(theConfig.leftButton);
        if (!leftButton.hasAttribute('data-listener-added')) {
            leftButton.addEventListener('click', function (event) {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-BUtton CLICK!!!!-----222222222222--");
                event.preventDefault(); // Prevent the default link behavior
                add_A_Value_Columns_Calender(document, theConfig, mode);
                // Remove the custom attribute after the click
                leftButton.removeAttribute('data-listener-added');
            }, { once: true });

            // Mark the listener as added
            leftButton.setAttribute('data-listener-added', 'true');
        }

        clearInterval(intv);
        runMainfnction(html, theConfig, settingQuery);
    }, 1000);

}

(function() {
    'use strict';
    var currentwebsite = window.location.host;
    var foundConfig = config.find(cc => currentwebsite.includes(cc.host));
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-网址已匹配-------"+foundConfig.host);
    const observeDOMChanges1 = (selector, callback) => {
        const observer = new MutationObserver(() => {
            const elements = document.querySelectorAll(selector);
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-拉取1所有元素！！！-------");
            if (elements && elements.length > 0) {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-拉取1成功 结束观察！！！ 拉取结果是  -------");
                console.log(elements);
                observer.disconnect(); // Stop observing once elements are found
                callback("1");
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true, // To observe changes within child nodes
            attributes: true, // To detect changes in attributes
            characterData: true, // To detect changes in text nodes
        });
    };
    const observeDOMChanges2 = (selector,selector2, callback) => {
        const observer = new MutationObserver(() => {
            const elements = document.querySelectorAll(selector);
            const elementsPoints = document.querySelectorAll(selector2);
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-拉取2所有元素！！！-------");
            if (elements && elements.length > 0) {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-拉取2.1成功 结束观察！！！-------");
                observer.disconnect(); // Stop observing once elements are found
                callback("1");
            }
            else if (elementsPoints && elementsPoints.length > 0) {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-拉取2.2成功 结束观察！！！-------");
                observer.disconnect(); // Stop observing once elements are found
                callback("2");
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true, // To observe changes within child nodes
            attributes: true, // To detect changes in attributes
            characterData: true, // To detect changes in text nodes
        });
    };



    async function myFunction() {
        if (window.location.href.includes("reservation/availabilityCalendar.mi")) {
            observeDOMChanges2(foundConfig.calenderBoxList,foundConfig.calenderBoxPointsList, (result) => {
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-运行myfunction11111-------");
            add_A_Value_Columns_Calender(document, foundConfig, result);
        });
        } else if (window.location.href.includes("search/findHotels.mi")) {
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-运行myfunction2222-------");
            observeDOMChanges1(foundConfig.seedList, () => {
            add_A_Value_Columns_helper(document, foundConfig);
        });
        }else if (window.location.href.includes("search/availabilityCalendar.mi")) {
            observeDOMChanges2(foundConfig.calenderBoxList,foundConfig.calenderBoxPointsList, (result) => {
            console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH-运行myfunction3333-------");
            add_A_Value_Columns_Calender(document, foundConfig, result);
        });
        }
    }

    myFunction();



})();
