// ==UserScript==
// @name         Tradescentre-Demo-Supabase
// @namespace    http://tampermonkey.net/
// @version      v2
// @description  Tradescentre userscript using Supabase Realtime
// @author       You
// @match        https://www.tradingview.com/markets/currencies/
// @match        https://www.tradingview.com/chart/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @require      https://unpkg.com/@supabase/supabase-js@2
// @require      https://code.jquery.com/jquery-3.6.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/518293/Tradescentre-Demo-Supabase.user.js
// @updateURL https://update.greasyfork.org/scripts/518293/Tradescentre-Demo-Supabase.meta.js
// ==/UserScript==

const endPoint = "wss://hqrbcqlvfqnklmgxxqwo.supabase.co/realtime/v1/websocket";
const apiKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxcmJjcWx2ZnFua2xtZ3h4cXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1ODgzMjQsImV4cCI6MjA0MTE2NDMyNH0.9i3Mx-L5X4jVOPrXnxjlG-Tm-OSAWnOd8PjTDsxm-Zw";

const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get("accessToken");
const userId = urlParams.get("userId");

const client = supabase.createClient(endPoint, apiKey);
client.realtime.accessToken = accessToken;

const room = client.channel("online", {
  config: {
    broadcast: { ack: true },
    private: true,
  },
});

room.subscribe(async (status, err) => {
  console.log("status:", status);
  // console.log('error:', err);
  if (status !== "SUBSCRIBED") return null;

  // TODO: Scrape and send initial data
  // const serverResponse = await room.send({
  //     type: 'broadcast',
  //     event: 'update',
  //     payload: { message: 'Message from userscript' }
  // });
});

const trades = [];

$(document).ready(async function () {
  await scrapeTableContainer();
});

async function scrapeTrades(jqueryElement) {
  const symbol = (
    await waitElement(() =>
      $(jqueryElement).find('span[class*="titleContent"]')
    )
  ).text();
  const quantity = (
    await waitElement(() => $(jqueryElement).find("td[data-label*=Qty]"))
  ).text();
  const pnl = (
    await waitElement(() => $(jqueryElement).find('td[data-label*="P&L"]'))
  ).text();
  const side = (
    await waitElement(() => $(jqueryElement).find("td[data-label*=Side]"))
  ).text();
  const avgFillPrice = (
    await waitElement(() =>
      $(jqueryElement).find('td[data-label*="Avg Fill Price"]')
    )
  ).text();
  return {
    symbol,
    quantity: parseInt(quantity),
    pnl,
    side,
    avgFillPrice: parseFloat(avgFillPrice.split(",").join("")),
  };
}

async function handleMutation(tableContainer, mutationList) {
  for (const mutation of mutationList) {
    if (mutation.addedNodes.length > 0) {
      const rows = Array.from(mutation.addedNodes).filter((m) => {
        return $(m).hasClass("ka-row");
      });
      await shiftTrades(rows);
    } else if (mutation.removedNodes.length > 0) {
      await removeTrades(mutation.removedNodes);
    } else if (mutation.type == "characterData") {
      const val = await waitElement(() =>
        $(mutation.target.parentNode).parents("tr.ka-row")
      );
      const rows = val.parent("").find("tr.ka-row");

      // Adds/updates current trades based on scraped data
      // await shiftTrades(rows);
      const scraped = await scrapeTrades(val);
      const index = findIndex(scraped);
      if (index >= 0) {
        trades[index] = { ...trades[index], ...scraped };
      } else {
        trades.push(scraped);
      }
      // Send scraped trades(formatted) to server
      await room.send({
        type: "broadcast",
        event: "update",
        payload: {
          id: userId,
          trades,
        },
      });
    }
  }
}

async function removeTrades(nodes) {
  for (const node of nodes) {
    const row = $(node).hasClass("ka-row")
      ? $(node)
      : $(node).find("tr.ka-row");
    const trade = await scrapeTrades(row);
    const index = findIndex(trade);
    if (index >= 0) {
      trades.splice(index, 1);
      return;
    }
  }
}

// Adds/updates current trades based on scraped data
async function shiftTrades(rows) {
  for (const val of rows) {
    const row = await scrapeTrades(val);
    const index = findIndex(row);
    if (index >= 0) {
      trades[index] = { ...trades[index], ...row };
    } else {
      trades.push(row);
    }
  }
}

function findIndex(row) {
  return trades.findIndex((value) => value.symbol == row.symbol);
}

async function scrapeTableContainer() {
  const tableContainer = await waitElement(() => $("div.ka"));
  const tableObs = new MutationObserver((mutation, observer) => {
    handleMutation(tableContainer, mutation);
  });
  tableObs.observe(tableContainer[0], {
    subtree: true,
    childList: true,
    characterData: true,
  });
}

// Waits element as it is being loaded in the DOM
async function waitElement(findElement) {
  let jqueryElement = findElement();
  const promise = new Promise((resolve) => {
    const interval = setInterval(() => {
      jqueryElement = findElement();
      if (jqueryElement.length > 0) {
        resolve(jqueryElement);
        clearInterval(interval);
      }
    }, 100);
  });
  return await promise;
}