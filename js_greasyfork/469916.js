// ==UserScript==
// @name         23.06.26旺销王商品编辑脚本
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  旺销王商品自动处理：自定义规则生成SKU|自定义规则排序尺寸&长度|库存&价格自动匹配|自定义规则处理尺寸&长度|手动替换特殊尺寸&长度
// @author       menkeng
// @license      GPLv3
// @match        https://www.wxwerp.com/m/publish/publishproductedit.aspx?id=*
// @match        https://2.wxwerp.com/m/publish/publishproductedit.aspx?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wxwerp.com
// @grant        unsafeWindow
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/469916/230626%E6%97%BA%E9%94%80%E7%8E%8B%E5%95%86%E5%93%81%E7%BC%96%E8%BE%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469916/230626%E6%97%BA%E9%94%80%E7%8E%8B%E5%95%86%E5%93%81%E7%BC%96%E8%BE%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
// skuinfo--change--getinfo--short--change--postinfo

async function skuchange() {
  console.time("skuchange");

  document.querySelector("#auto_build_sku").click();

  await new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList, observer) => {
      const target = document.querySelector(
        "body > div.dialogscrolling .dialog_panel > div > div.build_sku_main.middle_panel > input"
      );
      if (target) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  const bb = document.querySelector(
    "body > div.dialogscrolling .dialog_panel > div > div.build_sku_main.middle_panel > input"
  );
  const skuid = bb.value;
  bb.value = processText(skuid);

  const event = new Event("change", { bubbles: true });
  bb.dispatchEvent(event);
  document
    .querySelector(
      "body > div.dialogscrolling div.dialog_panel div.option > a:nth-child(1)"
    )
    .click();
  console.timeEnd("skuchange");
}

// const conditions = [
//   { match: ["长度", "颜色", "尺寸"], result: "{颜色}||{尺寸}X{长度}" },
//   { match: ["颜色", "螺纹直径", "长度"], result: "{颜色}||{螺纹直径}-{长度}" },
//   { match: ["长度", "尺寸"], result: "{尺寸}X{长度}" },
//   { match: ["颜色", "尺寸"], result: "{颜色}||{尺寸}" },
//   { match: ["颜色", "长度"], result: "{颜色}||{长度}" },
//   { match: ["长度", "螺纹直径"], result: "{螺纹直径}-{长度}" },
//   { match: ["内径", "外径", "件数"], result: "{内径}{外径}{件数}" },
//   { match: ["内径", "外径"], result: "{外径}||{内径}" },
//   { match: ["螺纹直径"], result: "{螺纹直径}" },
//   { match: ["导轨长度"], result: "{导轨长度}" },
//   { match: ["颜色"], result: "{颜色}" },
//   { match: ["件数"], result: "{件数}" },
//   { match: ["长度"], result: "{长度}" },
//   { match: ["尺寸"], result: "{尺寸}" },
//   { match: ["内径"], result: "{内径}" },
//   { match: ["外径"], result: "{外径}" },
// ];

// function processText(originalText) {
//   for (const condition of conditions) {
//     if (condition.match.every((text) => originalText.includes(text))) {
//       return condition.result;
//     }
//   }
//   return "";
// }

function processText(inputString) {
  console.log("input string: " + inputString);
  const unitList = [
    "颜色",
    "导轨长度",
    "长度",
    "尺寸",
    "螺纹直径",
    "内径",
    "外径",
    "件数",
  ];
  let outputString = "";
  unitList.sort((a, b) => b.length - a.length);
  let foundUnits = [];
  for (let unit of unitList) {
    let index = inputString.indexOf(unit);
    while (index >= 0) {
      foundUnits.push({ unit: unit, index: index });
      index = inputString.indexOf(unit, index + unit.length);
    }
  }
  foundUnits.sort((a, b) => a.index - b.index);
  for (let found of foundUnits) {
    switch (found.unit) {
      case "颜色":
        outputString += `{${found.unit}}||`;
        break;
      default:
        outputString += `{${found.unit}}|`;
        break;
    }
  }

  console.log("output string: " + outputString);
  return outputString;
}

async function changetabele() {
  console.time("changetabele");

  const tables = document.querySelectorAll("table.tbl.color_uploaders");
  const event = new Event("change", { bubbles: true });

  const inputs = [];
  for (const table of tables) {
    const rows = table.querySelectorAll(
      "tr:not(:first-child) td:nth-child(2) > input"
    );
    for (const input of rows) {
      inputs.push(input);
    }
  }

  inputs.forEach((input) => {
    input.dispatchEvent(event);
  });

  console.timeEnd("changetabele");
}
let relationships = {};
// 提取匹配关系
function getre() {
  console.time("getre");
  const tableElement = document.querySelector(".tbl.marginfees.ae_marginfees");
  const rows = tableElement.querySelectorAll("tr:not(:first-child)");
  console.log(rows.length);
  const data = Array.from(rows).map((row) => {
    const id = row.cells[row.cells.length - 1].querySelector("input").value;
    const stock = row.cells[row.cells.length - 2].querySelector("input").value;
    const price = row.cells[row.cells.length - 3].querySelector("input").value;
    return { id, stock, price };
  });
  data.forEach(({ id, stock, price }) => {
    relationships[id] = { stock, price };
  });
  console.log(relationships);
  console.timeEnd("getre");
}

function short() {
  // 获取所有 class 为 tbl color_uploaders 的 table 元素
  const tables = document.querySelectorAll(".tbl.color_uploaders");

  // 遍历每个 table 元素
  for (let i = 0; i < tables.length; i++) {
    // 获取当前 table 中第一个 td 元素的文本内容
    const firstTdText = tables[i].querySelector("td").textContent.trim();
    console.log(firstTdText);
    switch (firstTdText) {
      case "长度":
        console.log(`执行第 ${i + 1} 个 table 的长度排序函数`);
        sortLength(tables[i]);
        break;
      case "颜色":
        sortSize(tables[i]);
        console.log(`跳过第 ${i + 1} 个 table 的颜色`);
        // 跳过当前循环
        continue;
      case "尺寸":
        console.log(`执行第 ${i + 1} 个 table 的尺寸排序函数`);
        sortSize(tables[i]);
        break;
      case "螺纹直径":
        console.log(`执行第 ${i + 1} 个 table 的螺纹直径排序函数`);
        sortSize(tables[i]);
        // 螺纹直径和尺寸相同
        break;
      case "内径":
        console.log(`执行第 ${i + 1} 个 table 的内径排序函数`);
        sortSize(tables[i]);
        break;
      case "外径":
        console.log(`执行第 ${i + 1} 个 table 的外径排序函数`);
        sortOuterDiameter(tables[i]);
        break;
      case "导轨长度":
        console.log(`执行第 ${i + 1} 个 table 的导轨长度排序函数`);
        sortRailLength(tables[i]);
        break;
      default:
        sort_define(tables[i]);
        console.log(
          `第 ${i + 1
          } 个 table 中的第一个 td 元素的文本内容为未知值: ${firstTdText}`
        );
        // 处理未知的文本内容
        break;
    }
  }

  // 排序长度函数   完成
  function sortLength(table) {
    // 获取 table 中除了第一行，每一行的第二个单元格中 input 的值
    const inputs = Array.from(
      table.querySelectorAll("tr:not(:first-child) td:nth-child(2) input")
    );
    // 获取所有的数据并分类
    const data = inputs.map((input) => input.value.trim());
    const format1 = /^(\d+(\.\d+)?)mm$/i;
    const format2 = /^(\d+(\.\d+)?)mm\s*(?:\*|\s|x)?\s*(\d+)pcs?$/i;
    let data1 = [];
    let data2 = [];
    for (let i = 0; i < data.length; i++) {
      if (format1.test(data[i])) {
        data1.push(data[i]);
      } else if (format2.test(data[i])) {
        data2.push(data[i]);
      }
    }

    console.log(`data1: ${data1}`);
    console.log(`data2: ${data2}`);

    // 对不同类型的数据分别进行排序
    data1 = data1.sort((a, b) => parseFloat(a) - parseFloat(b));
    data2 = data2.sort((a, b) => {
      const aLength = parseFloat(a.match(/^(\d+(\.\d+)?)mm/i)[1]);
      const bLength = parseFloat(b.match(/^(\d+(\.\d+)?)mm/i)[1]);
      if (aLength !== bLength) {
        return aLength - bLength;
      }
      const aQuantity = parseFloat(a.match(/(\d+)pcs?$/i)[1]);
      const bQuantity = parseFloat(b.match(/(\d+)pcs?$/i)[1]);
      return aQuantity - bQuantity;
    });

    // 将排好序的数据填回到输入框中
    let index = 0;
    for (let i = 0; i < inputs.length; i++) {
      const inputValue = inputs[i].value.trim();
      if (format1.test(inputValue)) {
        inputs[i].value = data1[index++] || "";
      } else if (format2.test(inputValue)) {
        inputs[i].value = data2[index++] || "";
      }
      console.log(`updated input ${i}: ${inputs[i].value}`);
    }
  }
  // 排序尺寸函数   完成
  // function sortSize(table) {
  //   const format1 = /^M\d+(\.\d+)?$/i;
  //   const format2 = /^M\d+(\.\d+)?(\s+\d+(\.\d+)?)?pcs?$/i;
  //   const format3 = /^M\d+(\.\d+)?\s+x\s+\d+(\.\d+)?(mm)?$/i;
  //   const format4 = /^M\d+(\.\d+)?\s+\w+$/i;
  //   const format5 = /^M\d+(\.\d+)?\s*x\s*(\d+(\.\d+)?(mm)?)\s*\d+pcs?$/i;
  //   const format6 = /^M\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*\d+pcs?\s*\(\w+\)$/i;
  //   const format7 = /^\d+pcs?\s+M\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(mm)?$/i;
  //   const format8 = /^(\d+(\.\d+)?x){2}\d+(\.\d+)?$/;
  //   const format9 = /^[a-zA-Z]+\s\d+(\.\d+)?$/;
  //   const format10 = /^M\d+(\.\d+)?\s+\d+\s+pcs$/i;
  //   const format11 = /^\d+\s+Steel\s?M\d+x\d+x\d+(\.\d+)?$/i;

  //   const inputs_all = table.querySelectorAll("tr:not(:first-child) td:nth-child(2) input");
  //   const data = [];

  //   for (let i = 0; i < inputs_all.length; i++) {
  //     const input = inputs_all[i]
  //     if (input) {
  //       const value = input.value.trim();
  //       if (value.match(format1) || value.match(format2) || value.match(format3) || value.match(format4) || value.match(format5) || value.match(format6) || value.match(format7) || value.match(format8) || value.match(format9) || value.match(format10) || value.match(format11)) {
  //         data.push(value);
  //       }
  //     }
  //   }

  //   data.sort((a, b) => {
  //     switch (a.type) {
  //       case 1:
  //         if (b.type !== 1) {
  //           return -1;
  //         }
  //         return a.size - b.size;
  //       case 2:
  //         if (b.type !== 2) {
  //           return 1;
  //         }
  //         if (a.size !== b.size) {
  //           return a.size - b.size;
  //         }
  //         return a.quantity - b.quantity;
  //       case 3:
  //         if (b.type !== 3) {
  //           return 1;
  //         }
  //         if (a.size !== b.size) {
  //           return a.size - b.size;
  //         }
  //         return a.length - b.length;
  //       case 4:
  //         if (b.type !== 4) {
  //           return 1;
  //         }
  //         return a.size - b.size;
  //       case 5:
  //       case 6:
  //       case 7:
  //         if (b.type !== a.type) {
  //           return 1;
  //         }
  //         if (a.size !== b.size) {
  //           return a.size - b.size;
  //         }
  //         if (a.length !== b.length) {
  //           return a.length - b.length;
  //         }
  //         return a.quantity - b.quantity;
  //       case 8:
  //         if (b.type !== 8) {
  //           return 1;
  //         }
  //         for (let i = 0; i < a.sizes.length; i++) {
  //           if (a.sizes[i] !== b.sizes[i]) {
  //             return a.sizes[i] - b.sizes[i];
  //           }
  //         }
  //         return 0;
  //       case 9:
  //         if (b.type !== 9) {
  //           return 1;
  //         }
  //         if (a.size !== b.size) {
  //           return a.size - b.size;
  //         }
  //         return 0;
  //       case 10:
  //         if (b.type !== 10) {
  //           return 1;
  //         }
  //         if (a.size !== b.size) {
  //           return a.size - b.size;
  //         }
  //         return a.quantity - b.quantity;
  //       case 11:
  //         if (b.type !== 11) {
  //           return 1;
  //         }
  //         for (let i = 0; i < a.numbers.length; i++) {
  //           if (a.numbers[i] !== b.numbers[i]) {
  //             return a.numbers[i] - b.numbers[i];
  //           }
  //         }
  //         return 0;
  //       default:
  //         return 0;
  //     }
  //   });



  //   inputs_all.forEach((input, index) => {
  //     input.value = data[index];
  //   });

  // }

  function sortSize(table) {
    const format1 = /^M\d+(\.\d+)?$/i;
    const format2 = /^M\d+(\.\d+)?(\s+\d+(\.\d+)?)?pcs?$/i;
    const format3 = /^M\d+(\.\d+)?\s+x\s+\d+(\.\d+)?(mm)?$/i;
    const format4 = /^M\d+(\.\d+)?\s+\w+$/i;
    const format5 = /^M\d+(\.\d+)?\s*x\s*(\d+(\.\d+)?(mm)?)\s*\d+pcs?$/i;
    const format6 = /^M\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*\d+pcs?\s*\(\w+\)$/i;
    const format7 = /^\d+pcs?\s+M\d+(\.\d+)?\s*x\s*\d+(\.\d+)?(mm)?$/i;
    const format8 = /^(\d+(\.\d+)?x){2}\d+(\.\d+)?$/;
    const format9 = /^[a-zA-Z]+\s\d+(\.\d+)?$/;
    const format10 = /^M\d+(\.\d+)?\s+\d+\s+pcs$/i;
    const format11 = /^\d+\s+Steel\s?M\d+x\d+x\d+(\.\d+)?$/i;
    const format12 = /^M\s+(\d+)\s+x\s+(\d+)\s+(\d+)pcs?$/i;

    const inputs_all = table.querySelectorAll("tr:not(:first-child) td:nth-child(2) input");
    const data = [];

    // 将input的值存储为数组
    for (let i = 0; i < inputs_all.length; i++) {
      const input = inputs_all[i];
      if (input) {
        const value = input.value.trim();
        data.push(value);
      }
    }

    // 根据值的类型进行数组排序
    data.sort((a, b) => {
      // 根据值的类型判断排序逻辑
      if (format1.test(a) && format1.test(b)) {
        // 类型1的比较逻辑
        const sizeA = parseFloat(a.substring(1));
        const sizeB = parseFloat(b.substring(1));
        return sizeA - sizeB;
      } else if (format2.test(a) && format2.test(b)) {
        // 类型2的比较逻辑
        const sizeA = parseFloat(a.substring(1));
        const sizeB = parseFloat(b.substring(1));
        const quantityA = parseFloat(a.match(/\d+(\.\d+)?/)[0]) || 1;
        const quantityB = parseFloat(b.match(/\d+(\.\d+)?/)[0]) || 1;
        if (sizeA !== sizeB) {
          return sizeA - sizeB;
        }
        return quantityA - quantityB;
      } else if (format3.test(a) && format3.test(b)) {
        // 类型3的比较逻辑
        const sizeA = parseFloat(a.substring(1, a.indexOf("x")));
        const sizeB = parseFloat(b.substring(1, b.indexOf("x")));
        const lengthA = parseFloat(a.match(/x\s*(\d+(\.\d+)?)/)[1]);
        const lengthB = parseFloat(b.match(/x\s*(\d+(\.\d+)?)/)[1]);
        if (sizeA !== sizeB) {
          return sizeA - sizeB;
        }
        return lengthA - lengthB;
      } else if (format4.test(a) && format4.test(b)) {
        const sizeA = parseFloat(a.substring(1));
        const sizeB = parseFloat(b.substring(1));
        if (sizeA !== sizeB) {
          return sizeA - sizeB;
        }
      } else if (format5.test(a) && format5.test(b)) {
        const sizeA = parseFloat(a.match(/\d+(\.\d+)?(mm)?/)[0]);
        const sizeB = parseFloat(b.match(/\d+(\.\d+)?(mm)?/)[0]);
        const quantityA = parseFloat(a.match(/\d+pcs?/)[0]);
        const quantityB = parseFloat(b.match(/\d+pcs?/)[0]);
        if (sizeA !== sizeB) {
          return sizeA - sizeB;
        }
        return quantityA - quantityB;
      } else if (format6.test(a) && format6.test(b)) {
        const sizeA = parseFloat(a.match(/\d+(\.\d+)?/)[0]);
        const sizeB = parseFloat(b.match(/\d+(\.\d+)?/)[0]);
        const quantityA = parseFloat(a.match(/\d+pcs?/)[0]);
        const quantityB = parseFloat(b.match(/\d+pcs?/)[0]);
        if (sizeA !== sizeB) {
          return sizeA - sizeB;
        }
        return quantityA - quantityB;
      } else if (format7.test(a) && format7.test(b)) {
        const quantityA = parseFloat(a.match(/^\d+/)[0]);
        const quantityB = parseFloat(b.match(/^\d+/)[0]);
        const sizeA = parseFloat(a.match(/M\d+(\.\d+)?/)[0].substring(1));
        const sizeB = parseFloat(b.match(/M\d+(\.\d+)?/)[0].substring(1));
        if (sizeA !== sizeB) {
          return sizeA - sizeB;
        }
        return quantityA - quantityB;
      } else if (format8.test(a) && format8.test(b)) {
        const dimensionsA = a.split("x").map(parseFloat);
        const dimensionsB = b.split("x").map(parseFloat);
        if (dimensionsA !== dimensionsB) {
          return dimensionsA - dimensionsB;
        }
      } else if (format9.test(a) && format9.test(b)) {
        const typeA = a.match(/^[a-zA-Z]+/)[0].toUpperCase();
        const typeB = b.match(/^[a-zA-Z]+/)[0].toUpperCase();
        const sizeA = parseFloat(a.match(/\d+(\.\d+)?/)[0]);
        const sizeB = parseFloat(b.match(/\d+(\.\d+)?/)[0]);
        if (typeA !== typeB) {
          return sizeA - sizeB;
        }
        return sizeA - sizeB;

      } else if (format10.test(a) && format10.test(b)) {
        const sizeA = parseFloat(a.match(/M\d+(\.\d+)?/)[0].substring(1));
        const sizeB = parseFloat(b.match(/M\d+(\.\d+)?/)[0].substring(1));
        const quantityA = parseFloat(a.match(/\d+/)[0]);
        const quantityB = parseFloat(b.match(/\d+/)[0]);
        if (sizeA !== sizeB) {
          return sizeA - sizeB;
        }
        return quantityA - quantityB;
      } else if (format11.test(a) && format11.test(b)) {
        const sizeA = parseFloat(a.match(/M\d+x\d+x\d+(\.\d+)?/i)[0].substring(1));
        const sizeB = parseFloat(b.match(/M\d+x\d+x\d+(\.\d+)?/i)[0].substring(1));
        if (typeA !== typeB) {
          return sizeA - sizeB;
        }
        return sizeA - sizeB;
      }else if (format12.test(a) && format12.test(b)) {
        console.log(a, b);
        const numbersA = a.match(format12).slice(1).map(Number);
        const numbersB = b.match(format12).slice(1).map(Number);
        for (let i = 0; i < Math.min(numbersA.length, numbersB.length); i++) {
          if (numbersA[i] !== numbersB[i]) {
            return numbersA[i] - numbersB[i];
          }
        }
        return 0;
      }
       else {
        return 0;
      }
    });
    inputs_all.forEach((input, index) => {
      input.value = data[index];
    });
  }




  // for (let i = 0; i < inputs_all.length; i++) {
  //   const input = inputs_all[i]
  //   if (input) {
  //     const value = input.value.trim();
  //     let match = null;
  //     if (format1.test(value)) {
  //       match = value.match(format1);
  //       const size = parseFloat(match[0].substring(1));
  //       data.push({ type: 1, size, input:inputs_all[i] });
  //     } else if (format2.test(value)) {
  //       match = value.match(format2);
  //       const size = parseFloat(match[0].substring(1));
  //       const quantity = parseFloat(match[2]) || 1;
  //       data.push({ type: 2, size, quantity, input:inputs_all[i] });
  //     } else if (format3.test(value)) {
  //       match = value.match(format3);
  //       const size = parseFloat(match[0].substring(1, match[0].indexOf("x")));
  //       const length = parseFloat(
  //         match[0].substring(match[0].indexOf("x") + 1)
  //       );
  //       data.push({ type: 3, size, length, input:inputs_all[i] });
  //     } else if (format4.test(value)) {
  //       match = value.match(format4);
  //       const size = parseFloat(match[0].substring(1));
  //       data.push({ type: 4, size, input:inputs_all[i] });
  //     } else if (format5.test(value)) {
  //       match = value.match(format5);
  //       const size = parseFloat(match[0].substring(1, match[0].indexOf("x")));
  //       let lengthIndex = 1;
  //       if (!match[lengthIndex]) {
  //         lengthIndex = 2;
  //       }
  //       const length = parseFloat(match[lengthIndex]);
  //       const quantity = parseFloat(match[3]) || 1;
  //       data.push({ type: 5, size, length, quantity, input:inputs_all[i] });
  //     } else if (format6.test(value)) {
  //       match = value.match(format6);
  //       const size = parseFloat(match[0].substring(1, match[0].indexOf("x")));
  //       const length = parseFloat(match[0].match(/x\s*(\d+(\.\d+)?)/)[1]);
  //       const quantity = parseFloat(match[0].match(/\d+pcs?/)[0]);
  //       data.push({ type: 6, size, length, quantity, input:inputs_all[i] });
  //     } else if (format7.test(value)) {
  //       match = value.match(format7);
  //       const size = parseFloat(
  //         match[0].match(/M\d+(\.\d+)?/)[0].substring(1)
  //       );
  //       const length = parseFloat(match[0].match(/x\s*(\d+(\.\d+)?)/)[1]);
  //       const quantity = parseFloat(match[0].match(/^\d+/)[0]);
  //       data.push({ type: 7, size, length, quantity, input:inputs_all[i] });
  //     } else if (format8.test(value)) {
  //       match = value.match(format8);
  //       const sizes = match[0].split("x").map(parseFloat);
  //       data.push({ type: 8, sizes, input:inputs_all[i] });
  //     } else if (format9.test(value)) {
  //       match = value.match(format9);
  //       const size = parseFloat(match[0].match(/\d+(\.\d+)?/)[0]);
  //       data.push({ type: 9, size, quantity, input:inputs_all[i] });
  //     } else if (format10.test(value)) {
  //       match = value.match(format10);
  //       const size = parseFloat(match[0].substring(1, match[0].indexOf(" ")));
  //       const quantity = parseFloat(match[0].match(/\d+\s+pcs$/i)[0]);
  //       data.push({ type: 10, size, quantity, input:inputs_all[i] });
  //     } else if (format11.test(value)) {
  //       match = value.match(format11);
  //       const numbers = value.match(/\d+(\.\d+)?/g).map(parseFloat);
  //       data.push({ type: 11, numbers, input:inputs_all[i] });
  //     }
  //   }
  // }
  // data.sort((a, b) => {
  //   switch (a.type) {
  //     case 1:
  //       if (b.type !== 1) {
  //         return -1;
  //       }
  //       return a.size - b.size;
  //     case 2:
  //       if (b.type !== 2) {
  //         return 1;
  //       }
  //       if (a.size !== b.size) {
  //         return a.size - b.size;
  //       }
  //       return a.quantity - b.quantity;
  //     case 3:
  //       if (b.type !== 3) {
  //         return 1;
  //       }
  //       if (a.size !== b.size) {
  //         return a.size - b.size;
  //       }
  //       return a.length - b.length;
  //     case 4:
  //       if (b.type !== 4) {
  //         return 1;
  //       }
  //       return a.size - b.size;
  //     case 5:
  //       if (b.type !== 5) {
  //         return 1;
  //       }
  //       if (a.size !== b.size) {
  //         return a.size - b.size;
  //       }
  //       if (a.length !== b.length) {
  //         return a.length - b.length;
  //       }
  //       return a.quantity - b.quantity;
  //     case 6:
  //       if (b.type !== 6) {
  //         return 1;
  //       }
  //       if (a.size !== b.size) {
  //         return a.size - b.size;
  //       }
  //       if (a.length !== b.length) {
  //         return a.length - b.length;
  //       }
  //       return a.quantity - b.quantity;
  //     case 7:
  //       if (b.type !== 7) {
  //         return 1;
  //       }
  //       if (a.size !== b.size) {
  //         return a.size - b.size;
  //       }
  //       if (a.length !== b.length) {
  //         return a.length - b.length;
  //       }
  //       return a.quantity - b.quantity;
  //     case 8:
  //       if (b.type !== 8) {
  //         return 1;
  //       }
  //       for (let i = 0; i < a.sizes.length; i++) {
  //         if (a.sizes[i] !== b.sizes[i]) {
  //           return a.sizes[i] - b.sizes[i];
  //         }
  //       }
  //       return 0;
  //     case 9:
  //       if (b.type !== 9) {
  //         return 1;
  //       }
  //       if (a.size !== b.size) {
  //         return a.size - b.size;
  //       }
  //       return 0;
  //     case 10:
  //       if (b.type !== 10) {
  //         return 1;
  //       }
  //       if (a.size !== b.size) {
  //         return a.size - b.size;
  //       }
  //       return a.quantity - b.quantity;
  //     case 11:
  //       if (b.type !== 11) {
  //         return 1;
  //       }
  //       for (let i = 0; i < a.numbers.length; i++) {
  //         if (a.numbers[i] !== b.numbers[i]) {
  //           return a.numbers[i] - b.numbers[i];
  //         }
  //       }
  //       return 0;
  //     default:
  //       return 0;
  //   }
  // });
  // console.log(data);
  // inputs_all.forEach((input, index) => {
  //   console.log(`updated input ${index}: ${inputs_all[index].value}`);
  //   input.value = data[index].input.value;
  // });



  // const tbody = table.querySelector("tbody");
  // for (let i = 0; i < data.length; i++) {
  //   tbody.appendChild(data[i].row);
  // }
  // }
  // 螺纹直径排序
  function sortThreadDiameter(table) {
    // 获取 table 中除了第一行，每一行的第二个单元格中 input 的值
    const inputs = Array.from(
      table.querySelectorAll("tr:not(:first-child) td:nth-child(2) input")
    );
    // 获取所有的数据并分类
    const data = inputs.map((input) => input.value.trim());
    const format1 = /^M(\d+(\.\d+)?)$/i;
    const format2 = /^M(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)mm$/i;
    const format3 = /^M(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)mm\s*(\d+)pcs?$/i;
    let data1 = [];
    let data2 = [];
    let data3 = [];
    for (let i = 0; i < data.length; i++) {
      if (format1.test(data[i])) {
        data1.push(data[i]);
      } else if (format2.test(data[i])) {
        data2.push(data[i]);
      } else if (format3.test(data[i])) {
        data3.push(data[i]);
      }
    }

    // 对不同类型的数据分别进行排序
    data1 = data1.sort(
      (a, b) => parseFloat(a.substr(1)) - parseFloat(b.substr(1))
    );
    data2 = data2.sort((a, b) => {
      const aDiameter = parseFloat(a.match(/^M(\d+(\.\d+)?)\s*x/i)[1]);
      const bDiameter = parseFloat(b.match(/^M(\d+(\.\d+)?)\s*x/i)[1]);
      if (aDiameter !== bDiameter) {
        return aDiameter - bDiameter;
      }
      const aLength = parseFloat(a.match(/x\s*(\d+(\.\d+)?)mm/i)[1]);
      const bLength = parseFloat(b.match(/x\s*(\d+(\.\d+)?)mm/i)[1]);
      if (aLength !== bLength) {
        return aLength - bLength;
      }
      return 0;
    });
    data3 = data3.sort((a, b) => {
      const aDiameter = parseFloat(a.match(/^M(\d+(\.\d+)?)\s*x/i)[1]);
      const bDiameter = parseFloat(b.match(/^M(\d+(\.\d+)?)\s*x/i)[1]);
      if (aDiameter !== bDiameter) {
        return aDiameter - bDiameter;
      }
      const aLength = parseFloat(a.match(/x\s*(\d+(\.\d+)?)mm/i)[1]);
      const bLength = parseFloat(b.match(/x\s*(\d+(\.\d+)?)mm/i)[1]);
      if (aLength !== bLength) {
        return aLength - bLength;
      }
      const aQuantity = parseFloat(a.match(/(\d+)pcs?$/i)[1]);
      const bQuantity = parseFloat(b.match(/(\d+)pcs?$/i)[1]);
      return aQuantity - bQuantity;
    });

    // 将排好序的数据填回到输入框中
    let index = 0;
    for (let i = 0; i < inputs.length; i++) {
      const inputValue = inputs[i].value.trim();
      if (format1.test(inputValue)) {
        inputs[i].value = data1[index++] || "";
      } else if (format2.test(inputValue)) {
        inputs[i].value = data2[index++] || "";
      } else if (format3.test(inputValue)) {
        inputs[i].value = data3[index++] || "";
      }
    }
  }
  // 内径排序   完成
  function sortInnerDiameter(table) {
    // 获取 table 中除了第一行，每一行的第二个单元格中 input 的值
    const inputs = Array.from(
      table.querySelectorAll("tr:not(:first-child) td:nth-child(2) input")
    );
    // 获取所有的数据并分类
    const data = inputs.map((input) => input.value.trim());
    const format1 = /^M(\d+(\.\d+)?)$/i;
    const format2 = /^(\d+(\.\d+)?x){2}\d+(\.\d+)?$/;
    const format3 = /^[a-zA-Z]+\s\d+(\.\d+)?$/;

    let data1 = [];
    let data2 = [];
    let data3 = [];

    for (let i = 0; i < data.length; i++) {
      if (format1.test(data[i])) {
        data1.push(data[i]);
      } else if (format2.test(data[i])) {
        data2.push(data[i]);
      } else if (format3.test(data[i])) {
        data3.push(data[i]);
      }
    }

    // 对不同类型的数据分别进行排序
    data1 = data1.sort(
      (a, b) => parseFloat(a.substr(1)) - parseFloat(b.substr(1))
    );
    data2 = data2.sort((a, b) => {
      const aValues = a.split("x").map(parseFloat);
      const bValues = b.split("x").map(parseFloat);
      for (let i = 0; i < aValues.length; i++) {
        if (aValues[i] !== bValues[i]) {
          return aValues[i] - bValues[i];
        }
      }
      return 0;
    });
    data3 = data3.sort((a, b) => {
      const aValues = a.split(" ");
      const bValues = b.split(" ");
      if (aValues[1] !== bValues[1]) {
        return parseFloat(aValues[1]) - parseFloat(bValues[1]);
      }
      return 0;
    });

    // 将排好序的数据填回到输入框中
    let index = 0;
    for (let i = 0; i < inputs.length; i++) {
      const inputValue = inputs[i].value.trim();
      if (format1.test(inputValue)) {
        inputs[i].value = data1[index++] || "";
      } else if (format2.test(inputValue)) {
        inputs[i].value = data2[index++] || "";
      } else if (format3.test(inputValue)) {
        inputs[i].value = data3[index++] || "";
      }
    }
  }
  // 外径排序   完成
  function sortOuterDiameter(table) {
    // 获取表格中除了第一行，每一行的第二个单元格中 input 的值
    const inputs = Array.from(
      table.querySelectorAll("tr:not(:first-child) td:nth-child(2) input")
    );

    // 获取数据，并将其分类为 Lm+数字+uu|luu|suu、数字+x+数字+x+1位或两位数字 或 四位字母+数字 的组合
    const data1 = [];
    const data2 = [];
    const data3 = [];
    for (let i = 0; i < inputs.length; i++) {
      const value = inputs[i].value.trim();
      if (/^Lm\d+[uls]u$/i.test(value)) {
        console.log("math1 before: ", value);
        data1.push(value);
      } else if (/\d+x\d+x\d{1,2}mm$/i.test(value)) {
        data2.push(value);
      } else if (/^[A-Za-z]{4}\d+$/.test(value)) {
        data3.push(value);
      }
    }

    // 对 data1 进行排序
    data1.sort((a, b) => {
      const aNum = parseInt(a.match(/\d+/)[0]);
      const bNum = parseInt(b.match(/\d+/)[0]);
      if (aNum < bNum) {
        return -1;
      } else if (aNum > bNum) {
        return 1;
      } else {
        return 0;
      }
    });

    // 对 data2 进行排序
    data2.sort((a, b) => {
      const aNums = a.match(/\d+/g).map((num) => parseInt(num));
      const bNums = b.match(/\d+/g).map((num) => parseInt(num));
      for (let i = 0; i < aNums.length; i++) {
        if (aNums[i] < bNums[i]) {
          return -1;
        } else if (aNums[i] > bNums[i]) {
          return 1;
        }
      }
      return 0;
    });

    // 对 data3 进行排序
    data3.sort((a, b) => {
      const aAlpha = a.match(/^[A-Za-z]{4}/)[0];
      const bAlpha = b.match(/^[A-Za-z]{4}/)[0];
      const aNum = parseInt(a.match(/\d+$/)[0]);
      const bNum = parseInt(b.match(/\d+$/)[0]);
      if (aAlpha < bAlpha) {
        return -1;
      } else if (aAlpha > bAlpha) {
        return 1;
      } else {
        return aNum - bNum;
      }
    });

    // 将排好序的数据填回到输入框中
    let index1 = 0;
    let index2 = 0;
    let index3 = 0;
    for (let i = 0; i < inputs.length; i++) {
      if (/^Lm\d+[uls]u$/i.test(inputs[i].value)) {
        inputs[i].value = data1[index1++] || "";
      } else if (/\d+x\d+x\d{1,2}mm$/i.test(inputs[i].value)) {
        inputs[i].value = data2[index2++] || "";
      } else if (/^[A-Za-z]{4}\d+$/.test(inputs[i].value)) {
        inputs[i].value = data3[index3++] || "";
      }
    }
  }
  // 导轨长度排序  完成
  function sortRailLength(table) {
    console.log("开始排序");
    // 获取 table 中除了第一行，每一行的第二个单元格中 input 的值
    const inputs = Array.from(
      table.querySelectorAll("tr:not(:first-child) td:nth-child(2) input")
    );

    // 获取所有的数据并分类
    const data = inputs.map((input) => input.value.trim());
    const regex = /^([a-zA-Z]*)(\d+)([a-zA-Z]*)$/; // 匹配字母和数字的组合

    const dataWithLetters = [];
    const dataWithoutLetters = [];

    for (let i = 0; i < data.length; i++) {
      const match = data[i].match(regex);
      if (match) {
        dataWithLetters.push({
          str: data[i],
          letters: match[1],
          digits: parseInt(match[2], 10),
          tail: match[3],
        });
      } else {
        dataWithoutLetters.push({
          str: data[i],
          letters: "",
          digits: parseInt(data[i], 10),
          tail: "",
        });
      }
    }

    console.log("分类完成");

    // 对带字母的数据按照字母和数字的顺序进行排序
    dataWithLetters.sort((a, b) => {
      if (a.letters < b.letters) {
        return -1;
      } else if (a.letters > b.letters) {
        return 1;
      } else {
        return b.digits - a.digits;
      }
    });

    console.log("带字母的数据排序完成");

    // 对不带字母的数据按照数字的顺序进行排序
    dataWithoutLetters.sort((a, b) => b.digits - a.digits);

    console.log("不带字母的数据排序完成");

    // 将排好序的数据填回到输入框中
    let index1 = 0,
      index2 = 0;
    for (let i = 0; i < inputs.length; i++) {
      const inputValue = inputs[i].value.trim();
      if (regex.test(inputValue)) {
        inputs[i].value = dataWithLetters[index1].str;
        index1++;
      } else {
        inputs[i].value = dataWithoutLetters[index2].str;
        index2++;
      }
    }

    console.log("填充完成");
  }

  // 通用排序
  function sort_define(table) {
    // 获取除了第一行以外的所有行
    const rows = Array.from(table.querySelectorAll("tr:not(:first-child)"));

    // 将每行的数据保存到一个数组中
    const data = [];
    for (let i = 0; i < rows.length; i++) {
      const input = rows[i].querySelector("td:nth-child(2) input");
      if (input) {
        const value = input.value.trim();
        data.push({ value, row: rows[i] });
      }
    }

    // 按照数值部分从小到大排序
    data.sort((a, b) => {
      const aNumbers = extractNumbers(a.value);
      const bNumbers = extractNumbers(b.value);

      for (let i = 0; i < Math.min(aNumbers.length, bNumbers.length); i++) {
        if (aNumbers[i] > bNumbers[i]) {
          return 1;
        } else if (aNumbers[i] < bNumbers[i]) {
          return -1;
        }
      }

      return aNumbers.length - bNumbers.length;
    });

    // 提取数字
    function extractNumbers(value) {
      const numbers = value.match(/\d+(\.\d+)?/g);
      return numbers ? numbers.map(Number) : [];
    }

    // 将排序后的数据按顺序修改到表格中
    for (let i = 0; i < data.length; i++) {
      const row = data[i].row;
      const input = row.querySelector("td:nth-child(2) input");
      if (input) {
        input.value = data[i].value;
      }
    }
  }

  function splitString(str) {
    const parts = [];
    let start = 0;
    let lastWasDigit = false;
    for (let i = 0; i <= str.length; i++) {
      const c = str.charAt(i);
      const isDigit = /\d/.test(c);
      if (isDigit !== lastWasDigit && i > start) {
        parts.push(str.substring(start, i));
        start = i;
      }
      lastWasDigit = isDigit;
    }
    parts.push(str.substring(start));
    return parts;
  }
}

// 匹配关系
function updeatere() {
  console.log(relationships);
  console.time("up");
  const table = document.querySelector(".tbl.marginfees.ae_marginfees");
  const rows = Array.from(table.querySelectorAll("tr:not(:first-child)"));
  const stockInputs = rows.map((row) =>
    row.cells[row.cells.length - 2].querySelector("input")
  );
  const priceInputs = rows.map((row) =>
    row.cells[row.cells.length - 3].querySelector("input")
  );

  stockInputs.forEach((input, index) => {
    const id =
      rows[index].cells[rows[index].cells.length - 1].querySelector(
        "input"
      ).value;
    const relationship = relationships[id];
    input.value = relationship.stock;
    priceInputs[index].value = relationship.price;
  });

  console.timeEnd("up");
}
// 批量替换
function replaceAll() {
  var replaceStr = prompt("请输入要替换的字符串：", "");
  var replaceValue = prompt("请输入替换值：", "");

  // 替换 class 为 "tbl color_uploaders" 的表格中第二个单元格中的 input 值
  var colorUploadersTables = document.getElementsByClassName(
    "tbl color_uploaders"
  );
  for (var i = 0; i < colorUploadersTables.length; i++) {
    var rows = colorUploadersTables[i].rows;
    for (var j = 1; j < rows.length; j++) {
      var cells = rows[j].cells;
      var input = cells[1].querySelector("input");
      if (input) {
        var inputValue = input.value;
        var newInputValue = inputValue.replace(replaceStr, replaceValue);
        input.value = newInputValue;
      }
    }
  }

  // 替换 class 为 "tbl marginfees ae_marginfees" 的表格中倒数第三个单元格中的 input 值
  var marginfeesTables = document.getElementsByClassName(
    "tbl marginfees ae_marginfees"
  );
  for (var i = 0; i < marginfeesTables.length; i++) {
    var rows = marginfeesTables[i].rows;
    for (var j = 1; j < rows.length; j++) {
      var cells = rows[j].cells;
      var input = cells[cells.length - 3].querySelector("input");
      if (input) {
        var inputValue = input.value;
        var newInputValue = inputValue.replace(replaceStr, replaceValue);
        input.value = newInputValue;
      }
    }
  }
}
// 规则替换
function rep() {
  const tables = document.querySelectorAll("table.tbl.color_uploaders");
  const pcsRegex = /(\d+)\s*(pcs|pc)/i;
  const removeSpaces = (str) => str.replace(/\s/g, "");

  for (const table of tables) {
    const firstTD = table.querySelector("tr:first-child td:first-child");
    if (firstTD.innerText !== "尺寸") {
      console.log("第一个单元格不是“尺寸”，跳过该表格。");
      continue;
    }

    const inputs = table.querySelectorAll(
      "tr:not(:first-child) td:nth-child(2) > input"
    );
    inputs.forEach((input) => {
      let value = input.value.trim();
      const match = value.match(pcsRegex);
      if (match) {
        value = value.replace(match[0], `(${match[1]}${match[2]})`);
      }
      value = removeSpaces(value);
      input.value = value;
    });
  }
}
const button2 = document.createElement("button");
button2.textContent = "替换";
button2.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    padding: 10px 15px;
    font-size: 15px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
    cursor: pointer;
  `;

document.body.appendChild(button2);
button2.addEventListener("click", replaceAll);
const button = document.createElement("button");
button.textContent = "执行脚本";
document.body.appendChild(button);
button.style.cssText = `
    position: fixed;
    top: 10px;
    left: 80px;
    padding: 10px 15px;
    font-size: 15px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
    cursor: pointer;
  `;

button.addEventListener("mouseover", () => {
  button.style.backgroundColor = "#0069d9";
});

button.addEventListener("mouseout", () => {
  button.style.backgroundColor = "#007bff";
});
button2.addEventListener("mouseover", () => {
  button2.style.backgroundColor = "#0069d9";
});

button2.addEventListener("mouseout", () => {
  button2.style.backgroundColor = "#007bff";
});
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

button.onclick = async function () {
  button.innerText = "开始运行";
  await sleep(500);
  button.innerText = "运行中 - 正在更改 sku";
  skuchange();
  await sleep(500);
  button.innerText = "运行中 - 正在更改表格";
  changetabele();
  await sleep(2000);
  button.innerText = "运行中 - 正在获取结果";
  getre();
  await sleep(500);
  button.innerText = "运行中 - 正在排序";
  short();
  await sleep(500);
  button.innerText = "运行中 - 正在更改 sku";
  skuchange();
  await sleep(500);
  button.innerText = "运行中 - 正在更改表格";
  changetabele();
  await sleep(500);
  button.innerText = "运行中 - 正在更新结果";
  updeatere();
  await sleep(500);
  button.innerText = "运行中 - 正在规则编辑";
  rep();
  await sleep(500);
  button.innerText = "运行完毕";
};