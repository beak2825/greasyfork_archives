// ==UserScript==
// @name         WidgetTip
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Load save data
// @author       vanAmsen
// @match        https://www.tipranks.com/stocks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tipranks.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460728/WidgetTip.user.js
// @updateURL https://update.greasyfork.org/scripts/460728/WidgetTip.meta.js
// ==/UserScript==

//var tickers;
// Define global variable containing tickers to check
var tickers = ['NVDA', 'KO','NIO','IBM'];
var ratings = {}

function getTickers(){
    return tickers;
}

function getRating() {
  const ratingLabel = document.evaluate('//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]/div/div/div/div[2]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)?.singleNodeValue?.textContent;
  const ratingElement = document.querySelector('div.flexrsc.displayflex.fontSize1 svg text tspan');
  const rating = ratingElement?.textContent;

  return { rating: rating || null, ratingLabel: ratingLabel || null };
}


function getAnalyst() {
  const analystXPaths = {
      ratingLabel: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[1]/div/div/div/div[2]/span',
      analyst: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[1]/div/div/div/div[1]/div',
      price: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[1]/div[1]/div[1]/div[2]/div[3]/div[2]/div[1]/div[1]/div[1]/div/div[1]/div[1]/span',
      priceTarget: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[1]/div/div/div/div[2]/span[1]',
      side: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[1]/div/div/div/div[2]/span[2]',
      blogger: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[2]/div/div/div/div[1]/div',
      sentiment: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[2]/div/div/div/div[2]/span[2]',
      hedgeFund: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[3]/div/div/div/div[1]/div',
      insider: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[4]/div/div/div/div[1]/div',
      crowd: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[5]/div/div/div/div[1]/div',
      crowd7d: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[5]/div/div/div/div[2]/span[1]',
      crowd30d: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[5]/div/div/div/div[2]/span[2]',
      news: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[6]/div/div/div/div[1]/div',
      bullingNews: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[1]/a[6]/div/div/div/div[2]/span[1]',
      sma: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[2]/a/div/div/div[1]/div[1]/div',
      momentum: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[2]/a/div/div/div[2]/div[1]/div',
      roe: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[2]/div/div/div[1]/div[1]/div',
      asset: '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[2]/div/div/div[2]/div[1]/div'
  };

  const analystMap = {};
  for (const key in analystXPaths) {
    const xpath = analystXPaths[key];
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      const value = element.textContent.trim();
      analystMap[key] = value;
    } else {
      analystMap[key] = null;
    }
  }
  const ratingValue = document.querySelector('div.flexrsc.displayflex.fontSize1 svg text tspan').textContent;
  analystMap['rating'] = ratingValue
  return analystMap;
}


function isLoaded(ticker) {
  ticker = ticker || getTicker();
  if (ticker == null) {
    return true;
  }
  const element = document.evaluate('//*[@id="root"]/div[2]/div[4]/div[2]/div/div[1]/div[1]/div[1]/span', document, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;
  if (element) {
    const elementText = element.textContent.trim().toLowerCase();
    const tickerLowerCase = ticker.toLowerCase();
    return elementText === tickerLowerCase;
  }
  return false;
}


function getTicker() {
  const idx = localStorage.getItem("nextIndex");
  if (idx !== null) {
    const parsedIdx = parseInt(idx);
    if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < tickers.length) {
        let ticker = tickers[parsedIdx]
        if(ticker){
             return ticker.toLowerCase();
        }
    }
  }
  return null;
}

function isPageNotFound() {
  const xpath = '//*[@id="root"]/div[2]/div[5]/span[1]';
  const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (element) {
    return !element.textContent.includes('Page not found');
  }
  return false;
}


// Define function to check each ticker URL
async function startCheck(recheck) {
    // retrieve the current ticker index from storage or start from 0 if it's not set
    let nextIndex = 0;

    if(!isCheckRunning()){
        localStorage.setItem('tickers', JSON.stringify(tickers));
        localStorage.setItem('ratings', JSON.stringify(ratings));
        localStorage.setItem("nextIndex", nextIndex.toString());
    }else{
        nextIndex = localStorage.getItem("nextIndex")
        nextIndex = parseInt(nextIndex);
    }

    let ticker = getTicker();
    let url = `https://www.tipranks.com/stocks/${ticker}`;

    if(ticker!=null && url!=window.location.href){
        window.location.href = url;
    }

    // loop over the remaining tickers
    if (nextIndex < tickers.length) {
        // store the current ticker index in storage

        ticker = getTicker();
        url = `https://www.tipranks.com/stocks/${ticker}`;

        if(ticker!=null && url==window.location.href){
            console.log('Wait=>isLoaded(ticker):'+isLoaded(ticker));
            for (let i = 0; i < 3; i++) {
                if (!isLoaded(ticker)) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log(i+':Wait=>isLoaded(ticker):'+isLoaded(ticker));
                }
            }
        }else{
            if(ticker!=null && url!=window.location.href){
                window.location.href = url;
            }else{
                nextIndex++
                localStorage.setItem("nextIndex", nextIndex.toString());
            }
        }

        if(isLoaded(ticker)){
            console.log('Ok=>isLoaded(ticker):'+isLoaded(ticker));
            let ratingVal = getRating();
            if(ratingVal){
                ratings[ticker] = ratingVal;
            }
            localStorage.setItem('ratings', JSON.stringify(ratings));

            nextIndex++
            localStorage.setItem("nextIndex", nextIndex.toString());

            ticker = getTicker();
            url = `https://www.tipranks.com/stocks/${ticker}`;

            if(ticker!=null && url!=window.location.href){
                //await new Promise(resolve => setTimeout(resolve, 1000));
                window.location.href = url;
            }
        }else{
            console.log('else=>isLoaded(ticker):'+isLoaded(ticker));
            if (isPageNotFound()) {
                console.log('PageNotFound');
                nextIndex++
                localStorage.setItem("nextIndex", nextIndex.toString());
            }
        }

    }

    if(nextIndex >= tickers.length){
        await new Promise(resolve => setTimeout(resolve, 1000));
        stopCheck();
        return;
    }

    if(recheck<=3){
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('recheck');
        //startCheck(recheck+1);
    }else{
        console.log('recheck=>nextIndex');
        nextIndex++
        localStorage.setItem("nextIndex", nextIndex.toString());
    }
  // remove the current ticker index from storage when all tickers have been processed
  //localStorage.removeItem("currentIndex");
}


function downloadTxt() {

  const data = JSON.parse(localStorage.getItem('ratings'));

  // Get the column headers from the first object in the array
  const keys = Object.keys(data);
  const values = Object.values(data);
  const headers = ['ticker', ...Object.keys(values[0])];
  // Create the table header row as a tab-separated string
  const headerRow = headers.join('\t');

  // Create an array to hold the table rows
  const rows = [headerRow];

  // Iterate over the data array and add each row as a tab-separated string
  for (const [ticker, item] of Object.entries(data)) {
    const values = Object.values(item);
    const row = [ticker, ...values].join('\t');
    rows.push(row);
  }

  // Join the rows array into a single string with newlines between each row
    const table = rows.join('\n');

    // Create a new Blob object from the table string
    const file = new Blob([table], {type: 'text/plain'});

    // Create a URL for the file object
    const fileUrl = URL.createObjectURL(file);

    // Create a new anchor element with a download attribute
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    // Get the current date
    const today = new Date();

    // Format the date as YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    // Set the filename to include the date
    downloadLink.download = `ratings_${dateString}.txt`;

  // Simulate a click on the download link to trigger the download
  downloadLink.click();

  // Clean up the URL object after the download completes
  URL.revokeObjectURL(fileUrl);
}


function downloadJson() {
  const ratings = JSON.parse(localStorage.getItem('ratings'));

  // Convert the ratings data to a JSON string
  const jsonString = JSON.stringify(ratings);

  // Create a new Blob object from the JSON string
  const file = new Blob([jsonString], {type: 'application/json'});

  // Create a URL for the file object
  const fileUrl = URL.createObjectURL(file);

  // Create a new anchor element with a download attribute
  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
        // Get the current date
    const today = new Date();
    // Format the date as YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    // Set the filename to include the date
    downloadLink.download = `ratings_${dateString}.json`;

  // Simulate a click on the download link to trigger the download
  downloadLink.click();

  // Clean up the URL object after the download completes
  URL.revokeObjectURL(fileUrl);
}

function isCheckRunning(){
    return (localStorage.getItem("nextIndex") != null);
}

function stopCheck(){
    localStorage.removeItem("nextIndex");
    document.getElementById('idStartStopButton').textContent = 'Start';

    downloadTxt();
}

function continueCheck(){
    if( isCheckRunning() ){
        tickers = JSON.parse(localStorage.getItem('tickers'));
        ratings = JSON.parse(localStorage.getItem('ratings'));
        startCheck(0)
    }
}

window.getRating = getRating
window.getTickers = getTickers
window.startCheck = startCheck
window.getAnalyst = getAnalyst
window.isLoaded = isLoaded
window.getTicker = getTicker
window.downloadTxt = downloadTxt

function getFundamental() {
  const roeXpath = '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[2]/div/div/div[1]/div[1]/div';
  const assetGrowthXpath = '//*[@id="tr-stock-page-content"]/div[1]/div[3]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[2]/div[2]/div/div[2]/div/div/div[2]/div[1]/div';

  const roeElement = document.evaluate(roeXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const roeValue = roeElement ? roeElement.textContent.trim() : null;

  const assetGrowthElement = document.evaluate(assetGrowthXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const assetGrowthValue = assetGrowthElement ? assetGrowthElement.textContent.trim() : null;

  return {
    ROE: roeValue,
    AssetGrowth: assetGrowthValue
  };
}




function loadFileButton(){
    const button = document.createElement('button');
    button.textContent = 'Load File';
    button.id = 'idLoadFileButton';
    button.style.display = 'block';
    button.style.fontWeight = 'normal'; // Set default font weight
    button.style.transition = 'font-weight 0.2s'; // Add transition effect
    button.addEventListener('mouseenter', function() {
        // Set bold font weight on hover
        button.style.fontWeight = 'bold';
    });
    button.addEventListener('mouseleave', function() {
        // Set default font weight on mouse leave
        button.style.fontWeight = 'normal';
    });
    button.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.addEventListener('change', function() {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                tickers = event.target.result.split('\n').map(function(ticker) {
                    return ticker.replace(/\r$/, ''); // remove '\r' character from end of each line
                });
                console.log(tickers);
                alert('Loaded ' + tickers.length + ' tickers.');
            };
            reader.readAsText(file);
        });
        input.click();
    });
    return button
}

function startButton() {
    // Create a new button element
    const button = document.createElement('button');
    button.id = 'idStartStopButton';
    button.style.display = 'block';
    button.style.fontWeight = 'normal'; // Set default font weight
    button.style.transition = 'font-weight 0.2s'; // Add transition effect
    button.addEventListener('mouseenter', function() {
        // Set bold font weight on hover
        button.style.fontWeight = 'bold';
    });
    button.addEventListener('mouseleave', function() {
        // Set default font weight on mouse leave
        button.style.fontWeight = 'normal';
    });
    // Set the text content of the button
    if (!isCheckRunning()) {
        button.textContent = 'Start';
    } else {
        button.textContent = 'Stop';
    }

    // Add an event listener to the button
    button.addEventListener('click', function() {
        if (isCheckRunning()) {
            button.textContent = 'Start';
            stopCheck();
        } else {
            button.textContent = 'Stop';
            startCheck(0);
        }
    });

    // Return the button element
    return button;
}

function getProgress(){
    if( localStorage.getItem("nextIndex") != null){
        const tot = JSON.parse(localStorage.getItem('tickers'));
        const i = parseInt(localStorage.getItem("nextIndex"));
        return i / tot.length
    }else{
        return 0
    }
}

function loadWidget(){
    // Create a new div element for the widget
    const widget = document.createElement('div');

    // Set the style for the widget
    widget.style.position = 'fixed';
    widget.style.top = '50%';
    widget.style.right = '0';
    widget.style.transform = 'translateY(-50%)';
    widget.style.backgroundColor = '#fff';
    widget.style.padding = '10px';
    widget.style.border = '1px solid #ccc';
    widget.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
    widget.style.zIndex = '9999';

    // Add the progress bar to the widget
    const progressBar = document.createElement('div');
    progressBar.style.width = '100%';
    progressBar.style.height = '15px';
    progressBar.style.backgroundColor = '#8bc34a'; // Green color
    progressBar.style.borderRadius = '5px';
    widget.appendChild(progressBar);

    const progress = getProgress();
    progressBar.style.width = `${progress * 100}%`;

    // Add the "Load file" button to the widget
    widget.appendChild(loadFileButton());
    widget.appendChild(startButton());

    // Add the widget to the document
    document.body.appendChild(widget);
}

(function() {
    'use strict';
    loadWidget();

    window.onload = function() {
        continueCheck();
    };
})();
