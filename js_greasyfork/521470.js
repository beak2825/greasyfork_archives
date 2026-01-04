// ==UserScript==
// @name         NovelAI 绘图脚本（精简版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用 NovelAI 生成插图
// @author       从前跟你一样（根据原脚本修改）
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      novelai.net
// @downloadURL https://update.greasyfork.org/scripts/521470/NovelAI%20%E7%BB%98%E5%9B%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521470/NovelAI%20%E7%BB%98%E5%9B%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    const defaultSettings = {
        scriptEnabled: false,
        novelaiApi: '000000', // 请填入你的 NovelAI API Key
        startTag: 'image###',
        endTag: '###',
        nai3Scale: '10',
        cfg_rescale: '0.18',
        UCP: 'bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap',
        AQT: 'best quality, amazing quality, very aesthetic, absurdres',
        steps: '28',
        width: '1024',
        height: '1024',
        seed: '0',
        sampler: "k_euler",
        negativePrompt: '',
        zidongdianji: "true",
        nai3VibeTransfer: "false",
        InformationExtracted: '0.3',
        ReferenceStrength: "0.6",
        nai3Deceisp: "true",
        nai3Variety: "true",
        Schedule: "native",
        novelaimode: "nai-diffusion-3"
    };

    let settings = {};

    // 读取设置
    for (const [key, defaultValue] of Object.entries(defaultSettings)) {
        settings[key] = GM_getValue(key, defaultValue);
    }
    let nai3cankaotupian = "";  // 存储参考图片的 base64 数据

    // 替换文本中的图片标签
    function replaceWithNovelai() {
        if (!settings.scriptEnabled) {
            return;
        }
        if (checkSendBuClass()) {
            return;
        }

        const ps = document.getElementsByClassName("mes_text");
        for (let p of ps) {
            const linkText = p.textContent;
            const regex = new RegExp(`${escapeRegExp(settings.startTag)}([\\s\\S]*?)${escapeRegExp(settings.endTag)}`);
            const matches = linkText.match(regex);
            if (matches) {
                const targetText = matches[1];
                let link = targetText.replace(settings.startTag, '').replace(settings.endTag, '').trim();
                link = link.replaceAll("《", "<").replaceAll("》", ">").replaceAll("\n", "");

                const button = document.createElement('button');
                const uniqueId = "button_image" + Math.random().toString(36).substr(2, 9);
                button.id = uniqueId;
                button.classList.add('button_image'); // 添加样式类名
                button.textContent = '生成图片';
                button.dataset.link = link;

                const imgSpan = document.createElement('span'); //用于展示图片的容器
                imgSpan.id = "span_" + Math.random().toString(36).substr(2, 9);
                imgSpan.dataset.name = uniqueId;
                button.name = imgSpan.id;

                const re = new RegExp(`${settings.startTag}([\\s\\S]*?)${settings.endTag}`);
                const Text = p.innerHTML.match(re)[0];
                p.innerHTML = p.innerHTML.replace(Text, button.outerHTML);

                const newbutton = document.getElementById(uniqueId);
                newbutton.parentNode.insertBefore(imgSpan, newbutton.nextSibling);

                // 点击按钮生成图片
                newbutton.addEventListener('click', () => {
                    nai3(newbutton);
                });
                 const mesTextElements = document.getElementsByClassName('mes_text');
                const lastMesText = mesTextElements[mesTextElements.length - 1];

                if(lastMesText==p&&settings.zidongdianji=="true"){

                   nai3(newbutton);

                }


            }
        }
    }

  function isElementHidden(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return false; // 元素不存在

    // 优先使用内联样式
    if (element.style.display === 'none') return true;

    // 获取计算后的样式
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.display === 'none';
  }

function checkSendBuClass() {
// const element = document.getElementById('send_but');
const element = isElementHidden('send_but');
const element2 = isElementHidden('mes_stop');

if (element ||!element2) {
  return true;
}
return false;
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

    // NovelAI 生成图片函数
   async function nai3(button1) {
        button1.textContent = "加载中...";
        const access_token = settings.novelaiApi;

        let aqt = "";
        if (settings.AQT !== '' && settings.novelaimode == "nai-diffusion-4-curated-preview") {

            aqt = "rating:general, best quality, very aesthetic, absurdres";

        } else if (settings.AQT !== '' && settings.novelaimode == "nai-diffusion-4-full") {
            aqt = "no text, best quality, very aesthetic, absurdres";
        } else {
            aqt = settings.AQT;
        }

        let prompt = zhengmian(settings.negativePrompt, button1.dataset.link, aqt);                    //固定正面提示词

        let negative_prompt = fumian(settings.negativePrompt, settings.UCP);

        let preset_data = {
            "params_version": 3,
            "width": Number(settings.width),
            "height": Number(settings.height),
            "scale": Number(settings.nai3Scale),//提示词关联性
            "sampler": settings.sampler, //"k_euler",//使用的采样器   "k_dpm_2"   "k_dpmpp_2m"    "ddim_v3"  "k_dpmpp_2s_ancestral"
            "steps": Number(settings.steps),//生成的步数
            "n_samples": 1,
            "ucPreset": 3,//预设
            "qualityToggle": true,
            "sm": settings.sm === "false" ? false : true,
            "sm_dyn": settings.dyn === "false" || settings.sm === "false" ? false : true,
            "dynamic_thresholding": settings.nai3Deceisp === "false" ? false : true,
            "controlnet_strength": 1,
            "legacy": false,
            "add_original_image": false,
            "cfg_rescale": Number(settings.cfg_rescale),//关联性调整
            "noise_schedule": settings.Schedule,
            "skip_cfg_above_sigma": settings.nai3Variety === "false" ? null : 19.343056794463642,
            "legacy_v3_extend": false,
            "seed": settings.seed === "0" || settings.seed === "" ? generateRandomSeed() : Number(settings.seed),//生成的种子，下面是固定的负面提示词
            "negative_prompt": negative_prompt,
            "reference_image_multiple": [],
            "reference_information_extracted_multiple": [],
            "reference_strength_multiple": []
        }

        if (settings.sampler == "k_euler_ancestral") {
            preset_data["deliberate_euler_ancestral_bug"] = false;
            preset_data["prefer_brownian"] = true;
        }


        if (nai3cankaotupian != '' && settings.nai3VibeTransfer == "true") {
            preset_data.reference_image_multiple.push(nai3cankaotupian.split(',')[1]);
            preset_data.reference_information_extracted_multiple.push(Number(settings.InformationExtracted));
            preset_data.reference_strength_multiple.push(Number(settings.ReferenceStrength));

        }

        const payload = preset_data;
        const urlObj = new URL("https://image.novelai.net/ai/generate-image");

        const Authorization = "Bearer " + access_token;
        const data11 = {
            "input": prompt,//+
            "model": settings.novelaimode,
            "action": "generate",
            "parameters": preset_data
        }

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: urlObj,
                    data: JSON.stringify(data11),
                    responseType: "arraybuffer",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": Authorization
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 400) {
                            resolve(response);
                        } else {
                            button1.textContent = "生成图片";
                            if (response.status == 400) {
                                alert("验证错误");
                            }
                            if (response.status == 401) {
                                alert("api错误请检测api是否正确");
                            }
                            if (response.status == 402) {
                                alert("需要有效订阅才能访问此端点。");
                            }
                            if (response.status == 404) {
                                alert("发生404");
                            }
                            if (response.status == 409) {
                                alert("发生冲突错误");
                            }
                            if (response.status == 500) {
                                alert("未知错误");
                            }
                            if (response.status == 429) {
                                alert("请求过多");
                            }
                            resolve(response); //即使失败也resolve，避免程序卡住
                        }
                    },
                    onerror: function(error) {
                        button1.textContent = "生成图片";
                        alert("请求错误，请检查代理或网络");
                        reject(error);
                    }
                });
            });

            // 如果请求成功，处理图片数据
            if (response.status >= 200 && response.status < 400) {
                const data123 = await response.response;
                let re = await unzipFile(data123);
                let imageUrl = "data:image/png;base64," + re;

                let imgSpan = document.getElementById(button1.name);
                const img2 = document.createElement('img');
                img2.src = imageUrl;
                img2.alt = "Generated Image2";
                img2.dataset.name = imgSpan.dataset.name
                imgSpan.innerHTML = '';
                imgSpan.appendChild(img2);

                button1.textContent = "生成图片";

            }

        } catch (error) {
            button1.textContent = "生成图片";
            console.error('Error generating image:', error);
            alert("生成图片失败" + error);
        }
    }

    function generateRandomSeed() {
        // 生成一个在 0 到 999999999 之间的随机整数
        return Math.floor(Math.random() * 10000000000);
    }
    async function zhengmian(text, prom, AQT) {

        if (text == '') {

            return prom + ", " + AQT;
        } else {

            return text + ", " + prom + ", " + AQT;
        }

    }
    async function fumian(text, UCP) {
        console.log("negativePrompt", settings.negativePrompt)
        if (text == "") {

            return UCP;

        } else if (UCP == "") {

            return text;
        } else {

            return UCP + ", " + text;
        }

    }

    // 解压 base64 数据的函数 (使用 Promise 封装)
    function unzipFile(arrayBuffer) {
        return new Promise((resolve, reject) => {
            JSZip.loadAsync(arrayBuffer)
                .then(function(zip) {
                    zip.forEach(function(relativePath, zipEntry) {
                        if (!zipEntry.dir) { // 确保不是目录
                            zipEntry.async('base64').then(function(base64String) {
                                resolve(base64String);
                            });
                        }
                    });
                }).catch(reject); // 捕获并处理任何错误
        });
    }

     // 添加点击事件监听器到您的按钮或元素上
  $(document).ready(function() {
    console.log("页面加载完成"); // 确认 jQuery 是否正常工作
     ster= setInterval(addNewElement, 2000);
      const style1 = document.createElement('style');
      style1.textContent = `
        .button_image {
    /* 基础样式 */
    padding: 3px 4px;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);

    /* 文本和图标布局 */
    display: inline-flex;
    align-items: center;
    gap: 8px;

    /* 防止文本换行 */
    white-space: nowrap;

    /* 去除默认按钮样式 */
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
     }
      `;
    document.head.appendChild(style1);
  });

  // 定义默认设置


  function addNewElement() {
      const targetElement = document.querySelector('#option_toggle_AN');
      if (targetElement) {
          clearInterval(ster);
          const newElement = document.createElement('a');
          newElement.id = 'option_toggle_AN2';
          const icon = document.createElement('i');
          icon.className = 'fa-lg fa-solid fa-note-sticky';
          newElement.appendChild(icon);
          const span = document.createElement('span');
          span.setAttribute('data-i18n', "打开设置");
          span.textContent = '打开文生图设置';
          newElement.appendChild(span);
          // return  true; // 表示操作成功完成
          targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
          console.log("New element added successfully");
          document.getElementById('option_toggle_AN2').addEventListener('click', showSettingsPanel);
          /*******工具 */
          const newElement2 = document.createElement('a');
          newElement2.id = 'option_toggle_AN3';

          const icon2 = document.createElement('i');
          icon2.className = 'fa-lg fa-solid fa-note-sticky';
          newElement2.appendChild(icon2);

          const span2 = document.createElement('span');
          span2.setAttribute('data-i18n', "打开设置");
          span2.textContent = '打开酒馆工具设置';
          newElement2.appendChild(span2);
          // return  true; // 表示操作成功完成
          targetElement.parentNode.insertBefore(newElement2, targetElement.nextSibling);
          console.log("New element added successfully2");
        //  document.getElementById('option_toggle_AN3').addEventListener('click', showSettingsPanel2);
     }
  }

  function createSettingsPanel() {
      const panel = document.createElement('div');
      panel.id = 'settings-panel';
      panel.style.position = 'absolute';
      panel.style.top = '50%';
      panel.style.left = '50%';
      panel.style.transform = 'translate(-50%, -50%)';
      panel.style.backgroundColor = 'black';  // 设置背景为黑色
      panel.style.color = 'white';// 设置字体为白色
      panel.style.padding = '20px';
      panel.style.border = '1px solid white';// 设置边框为白色
      panel.style.zIndex = '10000';
      panel.style.display = 'none';
      panel.style.overflowY = 'auto';
      panel.style.maxHeight = '80vh';
      let html = `
<style>
  #settings-panel input, #settings-panel select {
    background-color: #444;
    color: white;
    background-color: black;
    border: none;
    padding: 5px;
    margin: 5px 0;
    white-space: nowrap;
  }
  .inline-elements div {
  display: inline-block; /* 或者使用 display: flex; */
  }
  #settings-panel button {
    background-color: #444;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  #settings-panel button:hover {
    background-color: #555;
  }
  #previewImage {
  width: 20vh; /* 将图片宽度设置为视口高度的 80% */
  height: auto; /* 根据宽度自适应高度，保持图片比例 */
  display: block; /* 将图片显示为块级元素，便于居中 */
}

</style>
`;

      html += `
  <h2>设置面板</h2>
      <label class="switch">
    <input type="checkbox" id="scriptToggle" ${settings.scriptEnabled ? 'checked' : ''}>
    <span class="slider"></span>
  </label>
  <label for="scriptToggle" style="display: inline-block; margin-left: 10px;">启用脚本</label>
  <br><br>

  <label>NovelAI API：<input type="text" id="novelaiApi" value="${settings.novelaiApi}"></label><br>
  <label>开始标记：<input type="text" id="startTag" value="${settings.startTag}"></label><br>
  <label>结束标记：<input type="text" id="endTag" value="${settings.endTag}"></label><br>

   html +=
       <label>novelai模型：
      <select id="novelaimode">
      <option value="nai-diffusion-3" ${settings.novelaimode === 'nai-diffusion-3' ? 'selected' : ''}>nai-diffusion-3</option>
      <option value="nai-diffusion-4-curated-preview" ${settings.novelaimode === 'nai-diffusion-4-curated-preview' ? 'selected' : ''}>nai-diffusion-4-curated-preview</option>
      <option value="nai-diffusion-4-full" ${settings.novelaimode === 'nai-diffusion-4-full' ? 'selected' : ''}>nai-diffusion-4-full</option>
       </select>
    </label><br>
    <label>NAI3关键词关联性Prompt Guidance：<input type="number" id="nai3Scale" value="${settings.nai3Scale}"></label><br>
      <label>NAI3关键词重调Prompt Guidance Rescale：<input type="number" id="cfg_rescale" value="${settings.cfg_rescale}"></label><br>

  <label>生成步数steps：<input type="number" id="steps" value="${settings.steps}"></label><br>
  <label>宽度width：<input type="number" id="width" value="${settings.width}"></label><br>
  <label>高度height：<input type="number" id="height" value="${settings.height}"></label><br>
  <label>生成种子seed：<input type="number" id="seed" value="${settings.seed}"></label><br>

   html +=
      <label>nai3采样方式：
  <select id="sampler">
      <option value="k_euler" ${settings.sampler === 'k_euler' ? 'selected' : ''}>k_euler</option>
      <option value="k_dpm_2" ${settings.sampler === 'k_dpm_2' ? 'selected' : ''}>k_dpm_2</option>
      <option value="ddim_v3" ${settings.sampler === 'ddim_v3' ? 'selected' : ''}>ddim_v3</option>
      <option value="k_dpmpp_2s_ancestral" ${settings.sampler === 'k_dpmpp_2s_ancestral' ? 'selected' : ''}>k_dpmpp_2s_ancestral</option>
      <option value="k_dpmpp_2m" ${settings.sampler === 'k_dpmpp_2m' ? 'selected' : ''}>k_dpmpp_2m</option>
      <option value="k_euler_ancestral" ${settings.sampler === 'k_euler_ancestral' ? 'selected' : ''}>k_euler_ancestral</option>
      </select>
  </label><br>

     <label>nai3Variety多样性：
    <select id="nai3Variety">
      <option value="true" ${settings.nai3Variety === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.nai3Variety === 'false' ? 'selected' : ''}>False</option>
    </select>
  </label><br>
     <label>nai3Deceisp减少伪影：
    <select id="nai3Deceisp">
      <option value="true" ${settings.nai3Deceisp === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.nai3Deceisp === 'false' ? 'selected' : ''}>False</option>
    </select>
  </label><br>

    <label>自动点击生成:
    <select id="zidongdianji">
      <option value="true" ${settings.zidongdianji === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.zidongdianji === 'false' ? 'selected' : ''}>False</option>
    </select>
  <br>
  <button id="save-settings">保存设置</button>
  <button id="close-settings">关闭</button>
  <a id="visit-website-link" href="https://gxcgf4l6b2y.feishu.cn/docx/XDo7dLpvhov6AexuLu3c8mpynSC?from=from_copylink" target="_blank">帮助</a>
  <a id="visit-website-link" href="https://discord.com/channels/1134557553011998840/1215675312721887272/1215675312721887272" target="_blank">dc讨论</a>
  <a id="visit-website-link">BY从前我跟你一样</a>
  <br>
  <a id="visit-website-link" href="https://afdian.com/a/cqgnyy" target="_blank">支持作者</a>

`;

panel.innerHTML+=html;
      const style = document.createElement('style');
      style.textContent = `
  #settings-panel input, #settings-panel select {
    background-color: #444;
    color: white;
    background-color: black;
    border: none;
    padding: 5px;
    margin: 5px 0;
  }
  #settings-panel button {
    background-color: #444;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  #settings-panel button:hover {
    background-color: #555;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: #2196F3;
  }
  input:checked + .slider:before {
    transform: translateX(26px);
  }

`;

      document.body.appendChild(panel);
      document.head.appendChild(style);
      document.getElementById('save-settings').addEventListener('click', saveSettings);
      document.getElementById('close-settings').addEventListener('click', closeSettings);
      // 添加滑块切换事件监听器
      document.getElementById('scriptToggle').addEventListener('change', function() {
          settings.scriptEnabled = this.checked;
          GM_setValue('scriptEnabled', this.checked);
          console.log('Script ' + (this.checked ? 'enabled' : 'disabled'));
      });

      return panel;
  }



  function saveSettings() {
      for (const key of Object.keys(defaultSettings)) {
          if(key=="yushe"){
              GM_setValue(key, JSON.stringify(settings[key]));

              continue;
          }

          const element = document.getElementById(key);
          if (element) {


              if(key=="steps"){

                     if((element.value !== settings[key])&&(Number(element.value)>28)&&(settings["mode"]=="novelai")){
                     if(!confirm("你修改了nai3的步数并且大于28，大于28将会收费，确认？如果不清楚请点取消刷新网页恢复默认！")){
                        return;
                     }
                    // return false;

                 }

              }
             if(key=="height"||key=="width"){

                     if(element.value !== settings[key]&&(Number(element.value)>1024)&&(settings["mode"]=="novelai")||key=="width"&&Number(element.value)>1024&&settings["mode"]=="novelai"){
                     if(!confirm("你修改了nai3的宽高并且大于1024，大于1024将会收费，确认？如果不清楚请点取消刷新网页恢复默认！")){
                        return;
                     }
                    // return false;

                 }

              }

              settings[key] = element.value;

              GM_setValue(key, element.value);

          }
      }
      console.log('Settings saved');
      hideSettingsPanel();
  }
  function closeSettings() {
      hideSettingsPanel();
  }




  function showSettingsPanel() {
      for (const key of Object.keys(defaultSettings)) {
          const element = document.getElementById(key);
          if (element) {
              settings[key] = element.value;
              GM_setValue(key, element.value);
          }
      }
      console.log('Settings saved:', settings);
      const panel = document.getElementById('settings-panel');
      if (!panel) {
          createSettingsPanel();
      }
      document.getElementById('settings-panel').style.display = 'block';
  }

  function hideSettingsPanel() {
      document.getElementById('settings-panel').style.display = 'none';
  }


    // 定时检查并替换
    setInterval(replaceWithNovelai, 2000);
})();