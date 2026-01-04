// ==UserScript==
// @name         Neopets: Stocks enhancer
// @author       Tombaugh Regio
// @version      1.4
// @description  Show only the stocks you want, and adds columns for monthly highs and lows
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/stockmarket.phtml?type=list&search=%&bargain=true
// @match        http://www.neopets.com/stockmarket.phtml?type=portfolio
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/427684/Neopets%3A%20Stocks%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/427684/Neopets%3A%20Stocks%20enhancer.meta.js
// ==/UserScript==

// ======================================================================

const PRICE = {
    //Lowest price that can be purchased. Default lowest is 15
    lowest: 15,

    //Highest price to consider
    highest: 15
}

// ======================================================================

//Get stock market data from Neostocks
GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://neostocks.info/?period=1m',
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(responseDetails) {
        return new Promise((resolve, reject) => {
            resolve(GM_setValue("responseText", responseDetails.responseText))
        })
    }
})

const stockData = GM_getValue("responseText").match(/{"summary_data":{.+"1m":\[{(.+)}\],"all":.+}/)[1]
const stockTickerInfos = stockData.split("},{")
const monthlyStocks = []

for(const datapoints of stockTickerInfos) {
    const datapoint = datapoints.split(",")
    const ticker = datapoint[0].match(/.+:"(.+)"/)[1]
    const high = datapoint[4].match(/\d+/)[0]
    const low = datapoint[6].match(/\d+/)[0]

    monthlyStocks.push({ticker: ticker, high: high, low: low})
}

let stocksTable, stockContainer
const URL = document.URL

if(URL.includes("portfolio")) {

    //Get the table with all the stock information
    stocksTable = document.evaluate("//a[contains(., 'here')]",
                                    document, null, XPathResult.ANY_TYPE, null ).iterateNext()
        .parentNode.querySelector("table")
    stocksTable.style.marginTop = "2em"
    stockContainer = stocksTable.querySelectorAll("tr")

    //Separate stock headers from rows, and push headers into an array
    let portfolioHeaders, portfolioSubheaders, portfolioRows
    [portfolioHeaders, portfolioSubheaders, ...portfolioRows] = stockContainer

    let topHeaderTitles = [], subheaderTitles = []

    const setCustomHeader = (i, number, header, HTML) => {if(i == number) header.innerHTML = HTML}
    function setNewHeaders(headers, titles, ARRAY){
        for (const [i, header] of headers.childNodes.entries()) {
            for(const OBJECT of ARRAY) {
                setCustomHeader(i, OBJECT.number, header, OBJECT.HTML)
            }
            if (header.nodeName != "#text") {titles.push(header.textContent)}
        }
    }

    setNewHeaders(portfolioHeaders, topHeaderTitles, [{number: 3, HTML: `<b>Month</b>`}])
    setNewHeaders(portfolioSubheaders, subheaderTitles, [{number: 5, HTML: `<b>High</b>`},{number: 9, HTML: `<b>Low</b>`}])


    for (const row of portfolioRows) {
        const cells = row.querySelectorAll("td")
        for (const [i, cell] of cells.entries()) {
            if (cells.length == 9){

                //Find the columns with highs and lows, and set their contents to data from Neostocks
                if (i == subheaderTitles.indexOf("Ticker")) {
                    const cellTicker = cell.querySelector("a").textContent
                    for (const stock of monthlyStocks) {
                        if (cellTicker == stock.ticker) {
                            const cellHigh = cells[subheaderTitles.indexOf("High")]
                            const cellLow = cells[subheaderTitles.indexOf("Low")]
                            cellHigh.innerHTML = `<a href="https://neostocks.info/tickers/${
                                                    stock.ticker}?period=1m" ><b>${
                                                    stock.high}</b></a>`

                            cellLow.innerHTML = `<a href="https://neostocks.info/tickers/${
                                                    stock.ticker}?period=1m" ><b>${
                                                    stock.low}</b></a>`

                            cellHigh.classList.add("monthly-high")
                            cellLow.classList.add("monthly-low")
                        }
                    }
                }

                //Style the current price if it's above the monthly high or below the monthly low
                if (i == subheaderTitles.indexOf("Current Price")) {
                    const cellHigh = cells[subheaderTitles.indexOf("High")]
                    const cellLow = cells[subheaderTitles.indexOf("Low")]

                    if (parseInt(cell.textContent) > parseInt(cellHigh.textContent)) {
                        cell.innerHTML = `<font color="green"><b>${cell.textContent}</b></font>`
                    }

                    if (parseInt(cell.textContent) < parseInt(cellLow.textContent)) {
                        cell.innerHTML = `<font color="red"><b>${cell.textContent}</b></font>`
                    }
                }

                //Hide stock logos
                if (i == subheaderTitles.indexOf("Icon")) {
                    const images = cell.querySelectorAll("img")
                    for(const image of images) {
                        if (image.title.length > 0) {
                            image.style.display = "none"
                        }
                    }
                }
            }
        }
    }

    //Swap rows
    for (const [i, row] of stockContainer.entries()) {
        if (i != 0 && row.children[3] != undefined) {row.children[3].after(row.children[2])}
    }
}

if(URL.includes("bargain")) {

    //Get the table with all the stock information
    stocksTable = document.evaluate("//b[contains(., 'Bargain Stocks')]",
                                    document, null, XPathResult.ANY_TYPE, null ).iterateNext()
        .nextSibling.nextSibling.nextSibling.nextSibling

    stocksTable.style.marginTop = "2em"
    stockContainer = stocksTable.querySelectorAll("tr")

    //Add columns for monthly lows and highs
    stockContainer.forEach(row => {
        row.appendChild(row.lastChild.cloneNode(true))
        row.appendChild(row.lastChild.cloneNode(true))
    })

    //Separate stock headers from rows, and push headers into an array
    let stockHeader, stockRows
    [stockHeader, ...stockRows] = stockContainer

    let headers = []
    stockHeader.childNodes.forEach((header, i) => {
        if (i == 7) {header.innerHTML = `<font color = "white"><b>High</b></font>`}
        if(i == 8) {header.innerHTML = `<font color = "white"><b>Low</b></font>`}
        headers.push(header.innerText)
    })

    //Hide logo and change columns
    for (const row of stockContainer) {
        for (const [i, column] of row.childNodes.entries()) {
            const logoColumn = headers.findIndex(e => e == "Logo")
            const changeColumn = headers.findIndex(e => e == "Change")

            if (i == logoColumn || i == changeColumn) {column.style.display = "none"}
        }
    }

    //For each row, add monthly highs and lows, and hide them if they're outside the specified price range
    for(const row of stockRows) {
        let monthlyHighHTML = `<a href="https://neostocks.info/bargain?period=1m"
                                  title="Click to check if stocks have updated.">n/a</a>`
        let monthlyLowHTML = monthlyHighHTML

        for (const [i, cell] of row.childNodes.entries()) {
            const cellText = cell.innerText
            const tickerColumn = headers.findIndex(e => e == "Ticker")
            const priceColumn = headers.findIndex(e => e == "Curr")
            const highColumn = headers.findIndex(e => e == "High")
            const lowColumn = headers.findIndex(e => e == "Low")

            //Add monthly highs and lows
            for (const stock of monthlyStocks) {
                if (i == tickerColumn && cellText == stock.ticker) {
                    monthlyHighHTML = `<a href="https://neostocks.info/tickers/${
                    stock.ticker}?period=1m" ><b>${
                    stock.high}</b></a>`
                    monthlyLowHTML = `<a href="https://neostocks.info/tickers/${
                    stock.ticker}?period=1m" ><b>${
                    stock.low}</b></a>`
                }
            }

            if (i == highColumn) {cell.innerHTML = monthlyHighHTML}
            if (i == lowColumn) {cell.innerHTML = monthlyLowHTML}


            //Style the price column like the hidden change column
            if (i == priceColumn) {
                const fontColor = cell.nextSibling.childNodes[0].color
                const tooltipText = cell.nextSibling.textContent
                cell.innerHTML = `<a href="#" title="${
                tooltipText}"><font color="${
                fontColor}"><b>${cellText}</b></font></a>`
            }

            //If price is outside prescribed range, hide the row
            if (i == priceColumn && (cellText < PRICE.lowest || cellText > PRICE.highest)) {
                row.style.display = "none"
            }
        }
    }
}
