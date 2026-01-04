// ==UserScript==
// @name         Scrapy Spider for Instagram
// @namespace    https://www.instagram.com/
// @version      0.1.0
// @description  Scrapy spider for scraping Instagram
// @author       Denny Vuong (@denny64)
// @match        https://instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414788/Scrapy%20Spider%20for%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/414788/Scrapy%20Spider%20for%20Instagram.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const puppeteer = require('puppeteer');
const { getChrome } = require('./chrome-script');

const LIMIT = 6;

function generateErrorMsg(error, url) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      url,
      error: `Unexpected error. Sorry, there was a problem, this API call has not been billed. Error message - ${error.message}`
    })
  }
}

module.exports.instagram = async (event) => {
  const { queryStringParameters } = event;

  if (!queryStringParameters || !queryStringParameters.url) {
    return {
      status: 404,
      url,
      error: "URL provided is not valid. Please provide a valid url."
    }
  }


  const { url } = queryStringParameters;
  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });
  const page = await browser.newPage();
  const response = await page.goto(url, { timeout: 100000, waitUntil: 'networkidle0' });
  const xpath_expression = '//a[@href]';
  await page.waitForXPath(xpath_expression);
  const links = await page.$x(xpath_expression);
  const unfilteredUrls = await page.evaluate((...links) => {
    return links.map(e => {
      if (e.href.includes('/p/')) {
        return e.href;
      }
    });
  }, ...links);

  let linkUrls = unfilteredUrls.filter(function (el) {
    return el != null;
  });

  linkUrls = linkUrls.slice(0, LIMIT);


  let pageData = {
    statusCode: response.status(),
    body: JSON.stringify({ url, linkUrls })
  };

  if (url.includes('/p/')) {
    const post_xpath = '//*[@id="react-root"]/section/main/div/div/article/div[2]/div[1]/ul/div/li/div/div/div[2]/span';
    try {
      await page.waitForXPath(post_xpath, { timeout: 3000 })
      const span = await page.$x(post_xpath);
      const text = await page.evaluate((...span) => {
        return span.map(e => {
          console.log('span===', e)
          return e.textContent
        });
      }, ...span);
      const images = await page.$$eval('img.FFVAD[src]', imgs => imgs.map(img => img.getAttribute('src')));

      pageData['body'] = JSON.stringify({ url, text, images });
      await browser.close();

      return pageData

    } catch (e) {
      // await browser.close();
      return generateErrorMsg(e, url);
    }
  } else {
    // await browser.close();
    return pageData
  }
};