// ==UserScript==
// @name        NetSuite Custom Flags
// @namespace   jhutt.com
// @license     MIT
// @match       https://1206578.app.netsuite.com/app/accounting/transactions/salesord.nl*
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @version     0.46
// @description Provides a space for custom flags on orders
// @downloadURL https://update.greasyfork.org/scripts/500450/NetSuite%20Custom%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/500450/NetSuite%20Custom%20Flags.meta.js
// ==/UserScript==


// Determine if the record is in edit mode
// console.log('Determining edit mode');
const edCheck = new RegExp('e=T');
const url = window.location.href;
let isEd;
edCheck.test(url) ? isEd = true : isEd = false;
// isEd ? console.log('Page is in edit mode') : console.log('Page is not in edit mode');

// Custom flags
const flags = {
    boPresent : false,
    boItems : [],
    discountHigh : false,
    custNoGroms : false,
    hasCustom : false,
    needShipCost : false,
    hasProbSKU : false,
    probSKUs : [],
    freightSKUs : [],
    needsFreight : false,
    isFreight : false,
    shouldFreight : false,
    shouldFSKUs : []
};

// Item row numbers
const itmCol = {
  set : false,
  itmSKU : "ITEM",
  boStatus : (isEd) ? "ESD (USED IN AUTOMATION)" : "STATUS",
  numBO : (isEd) ? "BACK ORDERED" : "# BACKORDERED",
  needsFreight : "MUST SHIP FREIGHT?"
};

// I might be able to make this more efficient by adding 5 to validity check variables and then counting down for a valid number
// Content rows start at 2, accounting for header row
/**
 * Gets the size of the order's item table programmatically, in rows
 * @return The final row number. This will not necessarily be the total number of literal rows, but the final row number in the HTML.
 */
const getRowCount = () => {
  let testRows;
  let lastRow = 0;
  let y = 2;
  testRows = document.querySelector("#item_splits > tbody > tr:nth-child(2) > td:nth-child(1)");
  // The lines are written differently in edit mode, so we'll need to account for this while counting rows
  if (isEd) {
    y = 1;
    while (testRows) {
      lastRow = y - 1;
      testRows = document.querySelector(`#item_row_${y} > td:nth-child(1)`);
      y++;
    }
  } else {
      while (testRows) {
        lastRow = y - 1;
        testRows = document.querySelector(`#item_splits > tbody > tr:nth-child(${y}) > td:nth-child(1)`);
        y++;
      }
    }
  return lastRow;
}

const getColumnCount = () => {
  let testColumns;
  let lastColumn = 0;
  let x = 1;
  testColumns = document.querySelector("#item_splits > tbody > tr:nth-child(2) > td:nth-child(1)");
  // The lines are written differently in edit mode, so we'll need to account for this while counting rows
  if (isEd) {
    while (testColumns) {
      lastColumn = x - 1;
      testColumns = document.querySelector(`#item_row_1 > td:nth-child(${x})`);
      x++;
    }
  } else {
      while (testColumns) {
      lastColumn = x - 1;
      testColumns = document.querySelector(`#item_splits > tbody > tr:nth-child(2) > td:nth-child(${x})`);
      x++;
      }
  }
  return lastColumn;
}

/**
 * Checks a text to see if it matches a column header, and sets according to the given number
 */
const checkItemHeader = (check, num) => {
  switch (check) {
    case itmCol.itmSKU:
      itmCol.itmSKU = num;
      break;
    case itmCol.numBO:
      itmCol.numBO = num;
      break;
    case itmCol.boStatus:
      itmCol.boStatus = num;
      break;
    case itmCol.needsFreight:
      itmCol.needsFreight = num;
      break;
  }
}

// Build an array out of the table
const buildItemTable = () => {
  const itemTable = [];
  const totalRows = getRowCount();
  const totalColumns = getColumnCount();
  let currentRow = [];
  let row = 2;
  let column = 1;
  let aRow;
  if (isEd) {
    row = 1;
    while (row <= totalRows) {
      currentRow = [];
      while (column <= totalColumns) {
        aRow = document.querySelector(`#item_row_${row} > td:nth-child(${column})`).innerText;
        currentRow.push(aRow);
        if (!itmCol.set) checkItemHeader(document.querySelector(`#item_headerrow > td:nth-child(${column})`).innerText,column-1);
        column++;
      };
      itmCol.set = true;
      column = 1;
      itemTable.push(currentRow);
      row++
    };
  } else {
      while (row <= totalRows) {
      currentRow = [];
        while (column <= totalColumns) {
          aRow = document.querySelector(`#item_splits > tbody > tr:nth-child(${row}) > td:nth-child(${column})`).innerText;
          currentRow.push(aRow);
          if (!itmCol.set) checkItemHeader(document.querySelector(`#item_splits > tbody > tr.uir-machine-headerrow > td:nth-child(${column})`).innerText,column-1);
          column++;
        };
      itmCol.set = true;
      column = 1;
      itemTable.push(currentRow);
      row++
      };
  }
  // console.log(itmCol);
  return itemTable;
}

let theTable = [];

const boESDs = {
  skus : [],
  isSome : false,
  isAll : true
};

////////////////////////////// Begin check functions //////////////////////////////

// Preset requisite  columns
const table = {
  SKUs: [],
  desc: [],
  qty: [],
  freight: []
}

// Function to call first to fill above arrays
const fillColumnArrays = () => {
  theTable.forEach((element) => {
    table.SKUs.push(element[0]);
    table.desc.push(element[1]);
    table.qty.push(element[6]);
    table.freight.push(element[itmCol.needsFreight]);
  });
}

const boESDCheck = () => {
  for (let i = 0; i <= theTable.length-1; i++) {
    if (theTable[i][itmCol.numBO] > 0 && theTable[i][itmCol.boStatus] == 'In stock! Awaiting transfer') {
      boESDs.skus.push(theTable[i][itmCol.itmSKU]);
    } else if (theTable[i][itmCol.numBO] > 0 && theTable[i][itmCol.boStatus] != 'In stock! Awaiting transfer') {
      boESDs.isAll = false;
    }
  }
  if (boESDs.skus.length != 0) { boESDs.isSome = true };
}

const lowDiscountCheck = () => {
  if (document.querySelector("#discountrate_fs_lbl_uir_label")) {
    let discount = isEd ? document.querySelector("#discountrate_fs_lbl_uir_label").nextElementSibling.firstElementChild.firstElementChild.value : document.querySelector("#discountrate_fs_lbl_uir_label").nextElementSibling.innerText;
    discount = Number(discount.substring(0,discount.length-1));
    if (Math.abs(discount) > 10) {
      flags.discountHigh = true;
    }
  }
}

const customTopGrommetCheck = () => {
  const iteArray = table.SKUs;
  const descArray = table.desc;
  const qtyArray = table.qty;
  const deskInds = [];
  const gromInds = [];
  let deskQty = 0
  let gromQty = 0
  // const isCust = new RegExp(/Custom.*Desk/);
  // const isGrom = new RegExp(/grommet/);
  descArray.forEach((element, index) => {
    if (element.includes('Custom') && element.includes('Desk') && !iteArray[index].includes('PARENT') && !iteArray[index].includes('SAMPLE')) {
      deskInds.push(index);
      deskQty += Number(qtyArray[index]);
    } else if (element.includes('grommet') || element.includes('Grommet')) {
      gromInds.push(index);
      if (iteArray[index].includes('KITGROMMET-none')) {
        gromQty += Number(qtyArray[index])*2;
      } else {
        gromQty += Number(qtyArray[index]);
      }
    }
  });
  if (gromQty < deskQty) {
    flags.custNoGroms = true;
  }
  if (deskQty > 0) {
    flags.hasCustom = true;
  }
}

const intlShipCheck = () => {
  const shipAdd = isEd ? document.querySelector("#shipaddress").innerHTML : document.querySelector("#shipaddress_fs_lbl_uir_label").nextElementSibling.innerText;
  const usContl = new RegExp(/AL|AZ|AR|CA|CO|CT|DE|DC|FL|GA|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|VI|WA|WV|WI|WY|United States Map/);
  let shipCost = 0;
  if (isEd) {
    if (document.querySelector("#shippingcost_formattedValue")) {
      shipCost = Number(document.querySelector("#shippingcost_formattedValue").value);
    }
  } else {
    if (document.querySelector("#shippingcost_fs_lbl_uir_label")) {
      shipCost = Number(document.querySelector("#shippingcost_fs_lbl_uir_label").nextElementSibling.innerText);
    }
  }
  if (!usContl.test(shipAdd) && shipCost == 0) {
    flags.needShipCost = true;
  }
}

const problemSKUCheck = () => {
  const problemSKUs = ["TOP433-60x30-B2S","TOP433-72x30-B2S","TOP433-80x30-B2S"];
  const iteArray = table.SKUs;
  const badSKUs = [];
  problemSKUs.forEach((sku) => {
    if (iteArray.includes(sku)) {
      badSKUs.push(sku);
    }
  });
  flags.probSKUs = badSKUs;
  if (badSKUs.length > 0) {
    flags.hasProbSKU = true
    };
  };

const freightSKUCheck = () => {
  const freightArray = table.freight;
  const iteArray = table.SKUs;
  const freightSKUs = [];
  const shipMethod = (isEd) ? document.querySelector("#shipmethod_fs_lbl_uir_label").nextElementSibling.firstElementChild.firstElementChild.firstElementChild.value : document.querySelector("#shipmethod_fs_lbl_uir_label").nextElementSibling.innerText;
  freightArray.forEach((line, index) => {
    if (line == "Yes") {
      freightSKUs.push(iteArray[index]);
    }
  });
  flags.freightSKUs = freightSKUs;
  if (freightSKUs.length != 0) {
    flags.needsFreight = true;
  }
  if (shipMethod.toLowerCase().includes("freight")) {
    flags.isFreight = true;
  }
}

const shouldFreightCheck = () => {
    const iteArray = table.SKUs;
    const descArray = table.desc;
    const problemSKUs = [];
    if (!flags.isFreight) {
        descArray.forEach((element, index) => {
            if (element.replace("\n"," ").includes("Ping Pong") && element.includes("Custom")) {
                problemSKUs.push(iteArray[index]);
            }
        });
        if (problemSKUs.length > 0) {
            flags.shouldFreight = true;
            flags.shouldFSKUs = problemSKUs;
        }
    }
}
////////////////////////////// End check functions //////////////////////////////

/**
 * A function to build custom flags
 * @constructor
 * @param id {string} - The ID which will be passed to the element upon construction. The checkbox will be given the same ID and appended with "check"
 * @param text {string} - The text which will be put next to the flag
 * @param test {boolean} - Should be a statement or variable which will evaluate to true or false. Will determine if the flag is shown (true) or not (false)
 * @param color {string} - Flag colors can be "green", "yellow", or "red"
 */
const flagBuilder = (id, text, test, color) => {
  const flag = document.createElement("div");
  flag.id = id;
  if (test) {
    flag.style.display = "flex";
  } else {
    flag.style.display = "none";
  }
  const flagBG = document.createElement("div");
  flagBG.style.position = "relative";
  flagBG.style.display = "grid";
  // flagBG.style.flexWrap = "wrap";
  flagBG.style.gridTemplateColumns = "auto auto";
  flagBG.style.alignContent = "center";
  flagBG.style.height = "auto";
  flagBG.style.borderRadius = "8px";
  flagBG.style.padding = "0px 6px";
  flagBG.style.margin = "0px 12px 12px 0px";
  switch (color) {
    case "yellow":
      flagBG.style.backgroundColor = "#fffc85";
      break;
    case "red":
      flagBG.style.backgroundColor = "#ed6b6b";
      break;
    case "green":
      flagBG.style.backgroundColor = "#b0f3c2";
      break;
  }
  const flagInner = document.createElement("div");
  const flagChk = document.createElement("input");
  flagChk.type = "checkbox";
  flagChk.id = id + "check";
  flagChk.checked = "true";
  const flagP = document.createElement("p");
  flagP.style.marginLeft = "5px";
  flagP.innerHTML = text;
  flagInner.appendChild(flagChk);
  flagInner.appendChild(flagP);
  // flagBG.appendChild(flagInner);
  flagBG.appendChild(flagChk);
  flagBG.appendChild(flagP);
  flag.appendChild(flagBG);
  return flag;
}

const performChecks = () => {
    boESDCheck();
    lowDiscountCheck();
    customTopGrommetCheck();
    intlShipCheck();
    problemSKUCheck();
    freightSKUCheck();
    shouldFreightCheck();
}

const buildCustomFlags = () => {
    const flagDiv = document.createElement("div");
    flagDiv.style.fontSize = "13px";
    flagDiv.id = "custflags";
    // BO flag for items with no ESD
    const boESDFlag = flagBuilder("boflag", boESDs.isAll ? "Backorder ESD flag exists but all BO items are waiting for transfer" : `Backorder ESD flag exists, some BO items (${boESDs.skus.join(', ')}) are waiting for transfer`, boESDs.isSome, boESDs.isAll ? "green" : "yellow");
    flagDiv.appendChild(boESDFlag);
    // Discount flag for a discount over 10%
    const discountFlag = flagBuilder("dscflag", "Order discount is over 10%", flags.discountHigh, "yellow");
    flagDiv.appendChild(discountFlag);
    // Flag for checking if custom desktops are present and if so have grommet SKUs
    const customsFlag = flagBuilder("custsflag", flags.custNoGroms ? "Order contains custom desktops and too few grommet SKUs" : "Order contains custom desktops", flags.hasCustom, flags.custNoGroms ? "red" : "yellow");
    flagDiv.appendChild(customsFlag);
    // Flag for checking if the order is going outside US48 and has a ship cost
    const shipCostFlag = flagBuilder("us48shipflag", "Order is outside US48 but no ship cost is present", flags.needShipCost, "red");
    flagDiv.appendChild(shipCostFlag);
    // Flag for checking if a problem SKU is on an order
    const probSKUFlag = flagBuilder("probskuflag", `Order contains one or more problem items (${flags.probSKUs.join(", ")})`, flags.hasProbSKU, "red");
    flagDiv.appendChild(probSKUFlag);
    // Flag for displaying what items (if any) must ship freight
    const freightFlag = flagBuilder("freightflag", flags.needsFreight ? `Order must ship freight due to (${flags.freightSKUs.join(", ")})` : `Order is shipping freight but no items require it`, (flags.isFreight || flags.needsFreight), flags.needsFreight ? "green" : "yellow")
    flagDiv.appendChild(freightFlag);
    // Flag for checking if an item that should ship freight is not tripping the ship method
    const shouldFreightFlag = flagBuilder("shouldfreightflag", `Items present need freight (${flags.shouldFSKUs.join(', ')}) but ship method is non-freight`, flags.shouldFreight, "red")
    flagDiv.appendChild(shouldFreightFlag);
    ///// Add all flags to document /////
    document.querySelector("#custbody_order_processing_flags_val").after(flagDiv);
}

const tableCheck = VM.observe(document.body, () => {
  // Find the target node
  const node = (isEd) ? document.querySelector(`#item_row_1 > td:nth-child(1)`) : document.querySelector(`#item_splits > tbody > tr:nth-child(2) > td:nth-child(1)`);

  if (node) {
    // console.log('Building item table')
    theTable = buildItemTable();
    fillColumnArrays();
    // console.log(theTable);
    // console.log('Checking flag conditions')
    performChecks();
    // console.log('Inserting custom flags')
    buildCustomFlags();

    // disconnect observer
    return true;
  }
});
