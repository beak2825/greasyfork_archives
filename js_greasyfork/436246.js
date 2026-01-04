// ==UserScript==
// @name         echarts option Json 生成
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  echarts option json 生成
// @author       aries.zhou
// @match        https://echarts.apache.org/examples/en/editor.html?**
// @match        https://echarts.apache.org/examples/zh/editor.html?**
// @icon         https://www.google.com/s2/favicons?domain=apache.org
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/436246/echarts%20option%20Json%20%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/436246/echarts%20option%20Json%20%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('load', async function () {
  await sleep(1000);
  const container = document.getElementsByClassName('left-panel').item(0);
  //add text
  {
    const newText = document.createElement("textarea");
    newText.style.height = '100px';
    newText.style.width = '500px';
    newText.cols = 10;
    newText.value = '数据';
    newText.className = 'newoptionjson';
    newText.id = 'newoptionjson';
    container.appendChild(newText);
  }

//set text value
  {
    const textBox = document.getElementsByClassName('newoptionjson').item(0);
    var chart = echarts.getInstanceByDom(document.getElementsByClassName('chart-container').item(0));

    try {
      textBox.value = JSON.stringify(chart.getOption());
    } catch (exception_var) {
      console.log(exception_var);
      JSON.safeStringify = (obj, indent = 2) => {
        let cache = [];
        const retVal = JSON.stringify(
          obj,
          (key, value) =>
            typeof value === "object" && value !== null
              ? cache.includes(value)
                ? undefined // Duplicate reference found, discard key
                : cache.push(value) && value // Store value in our collection
              : value,
          indent
        );
        cache = null;
        return retVal;
      };
      textBox.value = JSON.safeStringify(chart.getOption());
    } finally {
      console.log("finally");
    }
  }
  //copy
  {
    await sleep(1000);
    document.getElementById('newoptionjson').select();
    var targetText = document.getElementsByClassName('newoptionjson').item(0);
    GM_setClipboard(targetText.value);
  }

}, false);
