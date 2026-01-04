const url = "https://virtupets.net";

async function vpApiSetupClientID() {
  let clientID;
  try {
    clientID = await GM.getValue('ClientID');
    if (!clientID) {
      const id = crypto.randomUUID();
      await GM.setValue('ClientID', crypto.randomUUID());
      clientID = id;
    }
  } catch (error) {
    console.error(error, "Failed to setup client ID.", "setupClientID");
    clientID = "";
  }
  return clientID;
}

async function vpApiCreateGetRequest(apiVersion) {
  const clientID = await vpApiSetupClientID();
  return {
    method: "GET",
    headers: {
      "Version": apiVersion,
      "ClientID": clientID
    }
  }
}

async function vpApiCreatePostRequest(apiVersion, body) {
  const clientID = await vpApiSetupClientID();
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Version": apiVersion,
      "ClientID": clientID,
      "ClientVersion": "0.10a",
    },
    body: JSON.stringify(body),
  }
}

async function getItemDetails(itemName) {
  const apiVersion = "0.1";
  const request = await vpApiCreateGetRequest(apiVersion);
  return fetch(`${url}/items/details?q=${encodeURIComponent(itemName)}`, request);
}

/* Expects items to be an array of item name strings. */
async function bulkShopWizardPrices(items) {
  const apiVersion = "0.1";
  const request = await vpApiCreatePostRequest(apiVersion, items);
  return fetch(`${url}/shop-prices/bulk`, request);
}

/* Expects to receive the shop wizard page document page */
async function sendShopWizardPrices(doc) {
  try {
    const tokens = doc?.querySelector('.mt-1 strong')?.textContent?.split(" ... ");
    let body;
    const itemName = tokens?.length >= 2 ? tokens[1]?.trim() : undefined;
    if (!vpApiValidateSearchRange(doc) || !itemName) {
      return;
    }
    else if (vpApiValidateTable(doc)) {
      const dataElements = doc.querySelectorAll('.market_grid .data');
      const i32Max = 2147483647;
      let lowestPrice = i32Max;
      let totalStock = 0;
      let totalShops = 0;
      let includesOwnUnpricedItem = false;

      for (let i = 0; i < dataElements.length; i += 4) {
        const stock = parseInt(dataElements[i + 2].querySelector('span').textContent);
        const price = parseInt(dataElements[i + 3].querySelector('strong').textContent.replace(/[^0-9]/g, ''));

        if (price > 0) {
          lowestPrice = Math.min(price, lowestPrice);
          totalStock += stock;
          totalShops += 1;
        } else {
          includesOwnUnpricedItem = true;
        }
      }
      if (lowestPrice < i32Max && totalStock > 0 && dataElements.length > 0) {
        body = {
          item_name: itemName,
          price: lowestPrice,
          total_stock: totalStock,
          total_shops: totalShops
        };
      } else if (includesOwnUnpricedItem && totalStock == 0 && dataElements.length == 4) {
        body = {
          item_name: itemName,
          total_stock: 0,
          total_shops: 0
        };
      }
    }
    else if (vpApiValidateUnbuyable(doc)) {
      body = {
        item_name: itemName,
        total_stock: 0,
        total_shops: 0
      };
    }

    if (body && !doc.querySelector('#vp_api_data_sent')) {
      const grid = doc.querySelector('.market_grid.sw_results');
      const sentFlag = doc.createElement('div');
      sentFlag.style.display = 'none';
      sentFlag.id = 'vp_api_data_sent';
      grid.appendChild(sentFlag);

      const apiVersion = "0.11";
      const options = await vpApiCreatePostRequest(apiVersion, body);
      console.log(`Data uploaded to ${url}`);
      return await fetch(`${url}/shop-prices`, options);
    }

  } catch (error) {
    vpApiLogError(error, "Failed to send shop prices to the API.", "sendShopPrices");
  }
}

function vpApiValidateSearchRange(doc) {
  if (doc.querySelector('main .center .mt-1 span')?.textContent?.toLowerCase() == '(searching between 1 and 99,999 np)') {
    return true;
  }
  return false;
}
function vpApiValidateTable(doc) {
  const header = doc.querySelectorAll('.market_grid .header');
  const check = ['owner', 'item', 'stock', 'price'];
  if (check.length != header.length) return false;
  for (let i = 0; i < header.length; i += 1) {
    const title = header[i].querySelector('strong').textContent.toLowerCase();
    if (check[i] != title) {
      const message = `Unknown header named "${title}" in position ${i + 1}, expected "${check[i]}".`;
      const error = new Error(message);
      logError(error, "Validation Error.", "validateTable");
      throw error;
    }
  }
  return true;
}

function vpApiValidateUnbuyable(doc) {
  const notFoundMsg = "i did not find anything. :( please try again, and i will search elsewhere!";
  const wrongHeaders = doc.querySelectorAll('.market_grid .header').length > 0;
  const wrongMessage = doc.querySelector('main p.center').textContent.toLowerCase() != notFoundMsg;
  if (wrongHeaders || wrongMessage) {
    return false;
  }
  return true;
}

async function vpApiLogError(error, message, operation, statusCode = undefined) {
  try {
    console.log(message);
    const errorBody = {
      message: `${message}. Error: ${error.message.replace(/^Error:\s*/, '')}`,
      status_code: statusCode,
      route: `virtupets_api::${operation}`
    };
    const options = await vpApiCreatePostRequest("0.1", errorBody);
    fetch(`${url}/errors`, options);
  } catch (error) {
    console.error('Error sending error report:', error);
  }
}