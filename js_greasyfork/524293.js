// ==UserScript==
// @name         替换文本
// @license      MIT
// @namespace    https://github.com/laiyoi/GM_scripts
// @version      1.0.4
// @description  可影响输入框中的内容，支持自定义设置
// @author       laiyoi
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.4.0/dist/sweetalert2.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/524293/%E6%9B%BF%E6%8D%A2%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/524293/%E6%9B%BF%E6%8D%A2%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

// 默认字典，如果没有保存过，则使用这个
let dictionary = GM_getValue("dictionary", {});

// 是否影响输入框
let affectInput = GM_getValue('setting_affect_input', true);

// 统计字典替换成功的次数
let settingSuccessTimes = GM_getValue('setting_success_times', 0);

// 显示设置框
function showSettingBox() {
  let html = `
    <div style="font-size: 1em;">
      <label class="panai-setting-label">
        影响输入框的替换
        <input type="checkbox" id="S-Affect-Input" ${affectInput ? 'checked' : ''} class="panai-setting-checkbox">
      </label>
      <h3>自定义替换词典</h3>
      <div>
        <label>关键词：</label>
        <input type="text" id="key" placeholder="输入关键词" />
      </div>
      <div>
        <label>替换文本：</label>
        <input type="text" id="value" placeholder="输入替换文本" />
      </div>
      <button id="addEntry">添加替换</button>
      <div>
        <h4>当前替换项</h4>
        <ul id="dictionaryList"></ul>
      </div>
      <div>
        <button id="importSettings">导入设置</button>
        <button id="exportSettings">导出设置</button>
      </div>
    </div>
  `;

  Swal.fire({
    title: '字典替换配置',
    html,
    icon: 'info',
    showCloseButton: true,
    confirmButtonText: '保存',
    footer: '<div style="text-align: center;font-size: 1em;">助手免费开源，Powered by <a href="https://www.example.com">example</a></div>',
    customClass: 'panai-setting-box'
  }).then((res) => {
    if (res.isConfirmed) {
      // 保存字典设置
      GM_setValue('setting_affect_input', document.getElementById('S-Affect-Input').checked);
      GM_setValue("dictionary", dictionary);
      res.isConfirmed && history.go(0);
    }
  });

  const keyInput = document.getElementById("key");
  const valueInput = document.getElementById("value");
  const dictionaryList = document.getElementById("dictionaryList");
  const addButton = document.getElementById("addEntry");
  const affectInputCheckbox = document.getElementById("S-Affect-Input");

  // 更新显示的字典列表
  function updateDictionaryList() {
    dictionaryList.innerHTML = "";
  
    // Create a wrapper for the dictionary list to make it scrollable
    const scrollWrapper = document.createElement("div");
    scrollWrapper.style.maxHeight = "300px"; // Limit the height of the dictionary list
    scrollWrapper.style.overflowY = "auto"; // Enable vertical scrolling if content overflows
    scrollWrapper.style.paddingRight = "5px"; // Add some space for scrollbar
  
    for (const [key, value] of Object.entries(dictionary)) {
      const listItem = document.createElement("li");
      
      // Compact display: use a shorter format
      listItem.textContent = `${key} → ${value}`;
  
      // Create delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "删除";
      deleteButton.style.marginLeft = "10px";
      deleteButton.style.fontSize = "0.8em"; // Reduce button size
      deleteButton.addEventListener("click", () => {
        delete dictionary[key];
        updateDictionaryList(); // 更新显示的字典列表
      });
  
      // Append delete button and the list item
      listItem.appendChild(deleteButton);
  
      // Style list items for more compact display
      listItem.style.display = "flex"; // Use flexbox for compact layout
      listItem.style.justifyContent = "space-between"; // Space between text and delete button
      listItem.style.marginBottom = "5px"; // Reduce spacing between items
  
      scrollWrapper.appendChild(listItem); // Add list item to the scrollable container
    }
  
    dictionaryList.appendChild(scrollWrapper); // Add the scrollable wrapper to the dictionary list container
  }

  // 添加替换项
  addButton.addEventListener("click", () => {
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();

    if (key && value) {
      dictionary[key] = value;
      keyInput.value = "";
      valueInput.value = "";
      updateDictionaryList();
    }
  });

  // 导出设置为JSON（不包含 affectInput）
  document.getElementById("exportSettings").addEventListener("click", () => {
    const settingsJSON = JSON.stringify({ dictionary }); // 只导出字典
    const blob = new Blob([settingsJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "settings.json";
    a.click();
  });

  // 导入设置（不影响 affectInput）
  document.getElementById("importSettings").addEventListener("click", () => {
    Swal.fire({
      title: '选择导入文件',
      input: 'file',
      inputAttributes: {
        accept: '.json',
        'aria-label': 'Upload your settings'
      },
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const file = result.value;
        const reader = new FileReader();
        
        reader.onload = function(event) {
          try {
            const importedSettings = JSON.parse(event.target.result);

            // 校验导入内容是否包含字典
            if (importedSettings.hasOwnProperty('dictionary')) {
              // 合并导入的字典到现有字典中
              dictionary = { ...dictionary, ...importedSettings.dictionary };

              updateDictionaryList(); // 更新显示的字典列表
              Swal.fire('设置已成功导入！');
            } else {
              throw new Error('导入的文件格式不正确');
            }
          } catch (error) {
            Swal.fire('导入失败', `错误信息：${error.message}`, 'error');
          }
        };

        reader.onerror = function() {
          Swal.fire('导入失败', '文件读取错误，请确保文件格式正确', 'error');
        };

        reader.readAsText(file);
      }
    });
  });

  // 初始化页面显示字典
  updateDictionaryList();
  affectInputCheckbox.checked = GM_getValue('setting_affect_input', true);
}

// 替换页面中的文本
function replacer(str) {
  const dictionary_ = {
    '湖人': '科比',
    '豆包': '董斌',
    '超越': '超载',
  }
  // prereplace
  for (const [key_, value_] of Object.entries(dictionary_)) {
    const regex_ = new RegExp(key_, 'g');
    str = str.replace(regex_, value_);
  }

  for (const [key, value] of Object.entries(dictionary)) {
    const regex = new RegExp(key, 'g');
    str = str.replace(regex, value);
  }
  return str;
}

const elementToMatch = [
  "title",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "article",
  "section",
  "blockquote",
  "li",
  "a",
  "CC",
  "span",
];

// 替换页面中的文本内容
function replace(root) {
  requestIdleCallback(() => {
    root
      .querySelectorAll(
        elementToMatch
          .concat(elementToMatch.map((name) => name + " *"))
          .concat(affectInput ? ["input"] : [])
          .join(",")
    ).forEach((candidate) => {
      if (!candidate.closest('.panai-setting-box')) { // 排除设置页面的内容
        if (candidate.nodeName === "INPUT" && affectInput) {
          candidate.value = replacer(candidate.value);
        } else if (candidate.textContent && candidate.textContent == candidate.innerHTML.trim()) {
          candidate.textContent = replacer(candidate.textContent);
        } else if (Array.from(candidate.childNodes).filter((c) => c.nodeName == "BR")) {
          Array.from(candidate.childNodes).forEach((maybeText) => {
            if (maybeText.nodeType === Node.TEXT_NODE) {
              maybeText.textContent = replacer(maybeText.textContent);
            }
          });
        }
      }
    });
  });
}

/**
 * @param {Element} root
 */
async function afterDomLoaded(root) {
  if (!root) return;

  const fn = () => {
    replace(root);
    root.querySelectorAll("*").forEach(async (node) => {
      if (node.shadowRoot) {
        await afterDomLoaded(node.shadowRoot);
      }
    });
  };

  while (document.readyState === "loading") {
    await new Promise((r) => setTimeout(r, 1000));
  }
  fn();
}

// 初始执行
afterDomLoaded(document);
setInterval(() => afterDomLoaded(document), 2500);

// 注册菜单命令
GM_registerMenuCommand('⚙️ 设置', () => {
  showSettingBox();
});
