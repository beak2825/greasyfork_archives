// ==UserScript==
// @name         Uni-v3
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       You
// @match        https://app.uniswap.org/
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471543/Uni-v3.user.js
// @updateURL https://update.greasyfork.org/scripts/471543/Uni-v3.meta.js
// ==/UserScript==


if (! /#\/add*/.test(location.hash)) return;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getContentElementByXpath(path) {
    return parseFloat(document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent);
}

function getPropertyElementByXpath(path, property) {
    return parseFloat(document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.getAttribute(property));
}

function getValueElementById(_id) {
    return parseFloat(document.getElementById(_id).value);
}


(async function () {

    await sleep(1000);
    while (true) {

        try {

            addData();

            let coinValue = getContentElementByXpath("//div[div[text()='Current Price:']]/div[2]/span") //1.24159;
            let coinQtd = getPropertyElementByXpath("//main//div[@id='add-liquidity-input-tokena']//input", "value") // 805.429;
            let usdQtd = getPropertyElementByXpath("//main//div[@id='add-liquidity-input-tokenb']//input", "value") // 1000.00;
            let rangeMin = getPropertyElementByXpath("//div[div[text()='Min Price']]//input", "value") // 0.79965;
            let rangeMax = getPropertyElementByXpath("//div[div[text()='Max Price']]//input", "value") // 1.9278;
            let deltaRangeMin = coinValue - rangeMin;
            let deltaRangeMax = rangeMax - coinValue;
            let diffDeltaRange = deltaRangeMin - deltaRangeMax;
            let poolValue = (coinValue * coinQtd) + usdQtd; // 2000,012592

            let bestCaseAveragePrice = (coinValue + rangeMax) / 2;
            let bestCasePoolValue = (coinQtd * bestCaseAveragePrice) + usdQtd;  // 2276,359309
            let bestCaseDiff = bestCasePoolValue - poolValue; // 276,346717

            let worstCaseAveragePrice = (coinValue + rangeMin) / 2;
            let worstCasePoolValue = (coinQtd * rangeMin) + (usdQtd / worstCaseAveragePrice * rangeMin);  // 1427,555646
            let worstCaseDiff = worstCasePoolValue - poolValue; //  -572,4569457


            let qtdCoinMultiBorrow = getValueElementById("qtdCoinMultiBorrow") // 1;
            let multiDiffDeltaRange = getValueElementById("multiDiffDeltaRange") // 2

            let qtdCoinToBorrow = coinQtd * (qtdCoinMultiBorrow + (diffDeltaRange * multiDiffDeltaRange))
            let valueCoinToBorrow = qtdCoinToBorrow * coinValue;

            let poolValueWithBorrow = poolValue + valueCoinToBorrow;

            let bestCaseRepayPrice = qtdCoinToBorrow * rangeMax;
            let worstCaseRepayPrice = qtdCoinToBorrow * rangeMin;

            let bestCasePNL = (valueCoinToBorrow - bestCaseRepayPrice) + bestCaseDiff;
            let bestPNLPercentage = bestCasePNL / poolValue;

            let worstCasePNL = (valueCoinToBorrow - worstCaseRepayPrice) + worstCaseDiff;
            let worstPNLPercentage = worstCasePNL / poolValue;

            try {
                addResult();


                function addResult() {

                    const idResult = 'result';

                    const idElementResult = document.getElementById(idResult);
                    if (idElementResult) {
                        idElementResult.remove();
                    }

                    const div = document.createElement('div');

                    div.id = idResult;

                    div.style.cssText = 'position: relative; top: -450px;';

                    div.innerHTML = `
        
                    <style>
                        table {
                            border-collapse: collapse;
                        }
                        
                        table td, table th {
                            border: 1px solid black;
                        }
                        th { 
                            width: 200px;
                        }
        
                        .important {
                            font-weight: bold;
                        }
        
                    </style>
        
        
                    <table>
                        <tr>
                            <th>Variáveis</th>
                            <th>Valor</th>
                        </tr>
                        <tr>
                            <td class="important">qtdCoinToBorrow</td>
                            <td class="important">${qtdCoinToBorrow}</td>
                        </tr>
                        <tr>
                            <td class="important">valueCoinToBorrow</td>
                            <td class="important">${valueCoinToBorrow}</td>
                        </tr>
                        <tr>
                            <td>deltaRangeMin</td>
                            <td>${deltaRangeMin}</td>
                        </tr>
                        <tr>
                            <td>deltaRangeMax</td>
                            <td>${deltaRangeMax}</td>
                        </tr>
                        <tr>
                            <td>diffDeltaRange</td>
                            <td>${diffDeltaRange}</td>
                        </tr>
                        <tr>
                            <td>poolValue</td>
                            <td>${poolValue}</td>
                        </tr>
                        <tr>
                            <td>poolValueWithBorrow</td>
                            <td>${poolValueWithBorrow}</td>
                        </tr>
                        
                    </table>
                    
        
                    <br />
        
                    <table>
                        <tr>
                            <th>Variáveis</th>
                            <th>Melhor caso</th>
                            <th>Pior Caso</th>
                            
                        </tr>
                        <tr>
                            <td>AveragePrice</td>
                            <td>${bestCaseAveragePrice}</td>
                            <td>${worstCaseAveragePrice}</td>
                        </tr>
                        <tr>
                            <td>PoolValue</td>
                            <td>${bestCasePoolValue}</td>
                            <td>${worstCasePoolValue}</td>
                        </tr>
                        <tr>
                            <td>CaseDiff</td>
                            <td>${bestCaseDiff}</td>
                            <td>${worstCaseDiff}</td>
                        </tr>
                        <tr>
                            <td>RepayPrice</td>
                            <td>${bestCaseRepayPrice}</td>
                            <td>${worstCaseRepayPrice}</td>
                        </tr>
                        <tr>
                            <td>PNL</td>
                            <td>${bestCasePNL}</td>
                            <td>${worstCasePNL}</td>
                        </tr>
                        <tr>
                            <td>PNLPercentage</td>
                            <td>${bestPNLPercentage}</td>
                            <td>${worstPNLPercentage}</td>
                        </tr>
                    </table>
                `;

                    document.getElementById('root').appendChild(div);
                }

            } catch (ex) {
                console.log(ex);
            }

        } catch (ex) {
            console.log(ex);
        }


        function addData() {

            const idData = 'data';

            const idElement = document.getElementById(idData);

            if (!idElement) {

                const div = document.createElement('div');

                div.id = idData;

                div.style.cssText = 'position: relative; top: -480px;';

                div.innerHTML = `
                <label> 
                    qtdCoinMultiBorrow
                </label>
                <input type="text" id="qtdCoinMultiBorrow" value="1" />
                
                <label> 
                    multiDiffDeltaRange
                </label>
                <input type="text" id="multiDiffDeltaRange" value="2" />
            `;

                document.getElementById('root').appendChild(div);
            }

        }

        console.log("running.....");
        await sleep(2000);
    }

})();