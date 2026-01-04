// ==UserScript==
// @name         通用ai插图脚本ios版
// @namespace    http://tampermonkey.net/
// @version      14.9.2
// @license GPL
// @description  免费或者使用sd的api或使用novelai3 以及comfyui 配合ai 在酒馆生成插图 投喂咖啡：https://afdian.com/a/cqgnyy
// @author       从前跟你一样
// @grant        unsafeWindow
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      vagrantup.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect       *
// @connect      127.0.0.1
// @connect      novelai.net
// @match        *://*/*
// @description  Save user settings
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues

// @downloadURL https://update.greasyfork.org/scripts/520028/%E9%80%9A%E7%94%A8ai%E6%8F%92%E5%9B%BE%E8%84%9A%E6%9C%ACios%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/520028/%E9%80%9A%E7%94%A8ai%E6%8F%92%E5%9B%BE%E8%84%9A%E6%9C%ACios%E7%89%88.meta.js
// ==/UserScript==




//开启脚本后点击酒馆左下角的三条杠，文生图设置，不需要修改脚步！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
( function() {
  'use strict';
  let ster="";
  let images="";
  let imagesid="";
  let db=""
  let objectStorereadwrite="";
  let  objectStorereadonly="";
  let  xiancheng=true;
  let nai3cankaotupian="";
  let comfyuicankaotupian="";


  let json=`{
    "2": {
      "inputs": {
        "stop_at_clip_layer": -2,
        "clip": [
          "20",
          1
        ]
      },
      "class_type": "CLIPSetLastLayer",
      "_meta": {
        "title": "CLIP设置停止层"
      }
    },
    "5": {
      "inputs": {
        "seed": %seed%,
        "steps": %steps%,
        "cfg": %cfg_scale%,
        "sampler_name": %sampler_name%,
        "scheduler": "karras",
        "denoise": 1,
        "model": [
          "158",
          0
        ],
        "positive": [
          "158",
          1
        ],
        "negative": [
          "59",
          0
        ],
        "latent_image": [
          "6",
          0
        ]
      },
      "class_type": "KSampler",
      "_meta": {
        "title": "K采样器"
      }
    },
    "6": {
      "inputs": {
        "width": %width%,
        "height": %height%,
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage",
      "_meta": {
        "title": "空Latent"
      }
    },
    "20": {
      "inputs": {
        "ckpt_name": %MODEL_NAME%
      },
      "class_type": "CheckpointLoaderSimple",
      "_meta": {
        "title": "Checkpoint加载器(简易)"
      }
    },
    "31": {
      "inputs": {
        "samples": [
          "5",
          0
        ],
        "vae": [
          "20",
          2
        ]
      },
      "class_type": "VAEDecode",
      "_meta": {
        "title": "VAE解码"
      }
    },
    "59": {
      "inputs": {
        "text": %negative_prompt%,
        "speak_and_recognation": true,
        "clip": [
          "2",
          0
        ]
      },
      "class_type": "CLIPTextEncode",
      "_meta": {
        "title": "CLIP文本编码器"
      }
    },
    "122": {
      "inputs": {
        "filename_prefix": "lowres_MANGURI",
        "images": [
          "31",
          0
        ]
      },
      "class_type": "SaveImage",
      "_meta": {
        "title": "保存图像"
      }
    },
    "158": {
      "inputs": {
        "positive": %prompt%,
        "打开可视化PromptUI": "",
        "speak_and_recognation": true,
        "model": [
          "20",
          0
        ],
        "clip": [
          "2",
          0
        ]
      },
      "class_type": "WeiLinComfyUIPromptToLorasOnly",
      "_meta": {
        "title": "WeiLin 正向提示词Lora自动加载"
      }
    }
  }`;
  
  let json2=`{
    "3": {
      "inputs": {
        "seed": %seed%,
        "steps": %steps%,
        "cfg": %cfg_scale%,
        "sampler_name": %sampler_name%,
        "scheduler": "karras",
        "denoise": 1,
        "model": [
          "15",
          0
        ],
        "positive": [
          "20",
          1
        ],
        "negative": [
          "7",
          0
        ],
        "latent_image": [
          "19",
          0
        ]
      },
      "class_type": "KSampler",
      "_meta": {
        "title": "K采样器"
      }
    },
    "4": {
      "inputs": {
        "ckpt_name": %MODEL_NAME%
      },
      "class_type": "CheckpointLoaderSimple",
      "_meta": {
        "title": "Checkpoint加载器(简易)"
      }
    },
    "7": {
      "inputs": {
        "text": %negative_prompt%,
        "speak_and_recognation": true,
        "clip": [
          "4",
          1
        ]
      },
      "class_type": "CLIPTextEncode",
      "_meta": {
        "title": "CLIP文本编码器"
      }
    },
    "8": {
      "inputs": {
        "samples": [
          "3",
          0
        ],
        "vae": [
          "4",
          2
        ]
      },
      "class_type": "VAEDecode",
      "_meta": {
        "title": "VAE解码"
      }
    },
    "23": {
      "inputs": {
        "filename_prefix": "ComfyUI",
        "images": [
          "8",
          0
        ]
      },
      "class_type": "SaveImage",
      "_meta": {
        "title": "保存图像"
      }
    },
    "13": {
      "inputs": {
        "preset": %ipa%,
        "model": [
          "20",
          0
        ]
      },
      "class_type": "IPAdapterUnifiedLoader",
      "_meta": {
        "title": "IPAdapter加载器"
      }
    },
    "14": {
      "inputs": {
        "image": %comfyuicankaotupian%,
        "upload": "image"
      },
      "class_type": "LoadImage",
      "_meta": {
        "title": "加载图像"
      }
    },
    "15": {
      "inputs": {
        "weight": %c_quanzhong%,
        "weight_faceidv2": %c_idquanzhong%,
        "weight_type": "style and composition",
        "combine_embeds": "concat",
        "start_at": 0,
        "end_at": 1,
        "embeds_scaling": "K+mean(V) w/ C penalty",
        "layer_weights": "0:0, 1:0, 2:0, 3:%c_xijie%, 4:0, 5:0, 6:%c_fenwei%, 7:0, 8:0, 9:0, 10:0",
        "speak_and_recognation": true,
        "model": [
          "13",
          0
        ],
        "ipadapter": [
          "13",
          1
        ],
        "image": [
          "14",
          0
        ]
      },
      "class_type": "IPAdapterMS",
      "_meta": {
        "title": "应用IPAdapter Mad Scientist"
      }
    },
    "19": {
      "inputs": {
        "width": %width%,
        "height": %height%,
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage",
      "_meta": {
        "title": "空Latent"
      }
    },
    "20": {
      "inputs": {
        "positive": %prompt%,
        "打开可视化PromptUI": "",
        "speak_and_recognation": true,
        "model": [
          "4",
          0
        ],
        "clip": [
          "4",
          1
        ]
      },
      "class_type": "WeiLinComfyUIPromptToLorasOnly",
      "_meta": {
        "title": "WeiLin 正向提示词Lora自动加载"
      }
    }
  }`
  // 添加点击事件监听器到您的按钮或元素上
  $(document).ready(function() {
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
  const dbName = 'tupian';
  const dbVersion = 1;
  const objectStoreName = 'tupianhuancun';
async function Storereadwrite(data){//使用数据库
  const request = indexedDB.open(dbName, dbVersion);
  request.onerror = function(event) {
  console.error('Failed to open database:', event.target.error);
  };
  request.onsuccess = function(event) {
      db = event.target.result;
   const dbeadwrite = db.transaction([`${objectStoreName}`], 'readwrite');
   objectStorereadwrite = dbeadwrite.objectStore(`${objectStoreName}`);
   objectStorereadwrite.put(data);

  };
  request.onupgradeneeded = function(event) {
      const db = event.target.result;
      // 判断对象存储是否存在
      if (!db.objectStoreNames.contains(objectStoreName)) {
        // 如果对象存储不存在，则创建它
        const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id' });
        console.log('Object store created:', objectStoreName);
      } else {
        console.log('Object store already exists:', objectStoreName);
      }
    };

}

async function Storereadonly(id){//使用数据库
 return new Promise((resolve, reject) => {
   const request = indexedDB.open(dbName, dbVersion);
  request.onerror = function(event) {
  console.error('Failed to open database:', event.target.error);
  };
   request.onerror = function(event) {
            reject(event.target.error);
   };
   request.onupgradeneeded = function(event) {
              const db = event.target.result;
              // 判断对象存储是否存在
              if (!db.objectStoreNames.contains(objectStoreName)) {
                // 如果对象存储不存在，则创建它
                const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id' });
                console.log('Object store created:', objectStoreName);
              } else {
                console.log('Object store already exists:', objectStoreName);
              }
   };

   request.onsuccess = function(event) {
              const db = event.target.result;
              const dbreadonly = db.transaction([`${objectStoreName}`], 'readonly');
              objectStorereadonly = dbreadonly.objectStore(`${objectStoreName}`);
             const req =objectStorereadonly.get(id)
             req.onsuccess = function(event) {
              const data = event.target.result;
              resolve(data);
            };
     };


});
}
async function Storedelete(id){//使用数据库
   const request = indexedDB.open(dbName, dbVersion);
  request.onerror = function(event) {
  console.error('Failed to open database:', event.target.error);
  };
   request.onerror = function(event) {
            reject(event.target.error);
   };
   request.onupgradeneeded = function(event) {
              const db = event.target.result;
              // 判断对象存储是否存在
              if (!db.objectStoreNames.contains(objectStoreName)) {
                // 如果对象存储不存在，则创建它
                const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id' });
                console.log('Object store created:', objectStoreName);
              } else {
                console.log('Object store already exists:', objectStoreName);
              }
   };

    request.onsuccess = function(event) {
              const db = event.target.result;
              const dbreadonly = db.transaction([`${objectStoreName}`], 'readwrite');
              const readwrite = dbreadonly.objectStore(`${objectStoreName}`);
              readwrite.delete(id);
     };

}

  // 定义默认设置
  const defaultSettings = {
      scriptEnabled:false,
      yushe:{"默认":{"fixedPrompt":'',"negativePrompt":''}},
      yusheid:"默认",
      mode: 'free',
      freeMode:'flux-anime',
      cache: "1",
      sdUrl: 'http://localhost:7860',
      novelaiApi: '000000',
      startTag: 'image###',
      endTag: '###',
      fixedPrompt: '',
      nai3Scale: '10',
      sdCfgScale: '7',
      sm:"true",
      dyn:'true',
      cfg_rescale:'0.18',
      UCP:'bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap',
      AQT:'best quality, amazing quality, very aesthetic, absurdres',
      steps: '28',
      width: '1024',
      height: '1024',
      seed: '0',
      restoreFaces: 'false',
      samplerName: 'DPM++ 2M',
      comfyuisamplerName: 'euler_ancestral',
      sampler:"k_euler",
      negativePrompt: '',
      zidongdianji:"true",
      nai3VibeTransfer: "false",
      InformationExtracted:'0.3',
      ReferenceStrength:"0.6",
      nai3Deceisp:"true",
      nai3Variety:"true",
      Schedule:"native",
      MODEL_NAME: "不带后缀例如tPonynai3_v65",
      c_fenwei:"0.8",
      c_xijie:"0.8",
      c_idquanzhong:"1.10",
      c_quanzhong:"0.8",
      ipa:"STANDARD (medium strength)",
      dbclike:"false",
      workers:{"默认":json,"默认人物一致":json2},
      workerid:"默认",
      worker:json
  };
  let settings = {};

  defaultSettings.yushe["默认"]={"negativePrompt":defaultSettings.negativePrompt,"fixedPrompt":defaultSettings.fixedPrompt};

  for (const [key, defaultValue] of Object.entries(defaultSettings)) {

      settings[key] = GM_getValue(key, defaultValue);
  //     if(settings[key]=="image:{"){          //版本更新数据
  //       if(key=="startTag"){
  //       settings[key]="image###";
  //       }
  //    }
  //    if(settings[key]=="}"){          //版本更新数据
  //     if(key=="endTag"){
  //     settings[key]="###";
  //     }
  //  }

      // 如果没有读取到值，就使用默认值并保存
      if (settings[key] === defaultValue) {
          if(key=="yushe"||key=="workers"||key=="worker"){
              GM_setValue(key, JSON.stringify(defaultValue));//使用字符串保存
          }else{
              GM_setValue(key, defaultValue);
          }
      }else if(key=="yushe"||key=="workers"){
          console.log(settings);
          settings[key]=JSON.parse(settings[key]);//转json
      }
  }
  settings.worker=settings["workers"][settings.workerid];//设置提示词
  // settings["negativePrompt"]=settings["yushe"][settings.yusheid]["negativePrompt"];//设置提示词
  // settings["fixedPrompt"]=settings["yushe"][settings.yusheid]["fixedPrompt"];


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
  <label>模式：
    <select id="mode">
      <option value="sd" ${settings.mode === 'sd' ? 'selected' : ''}>SD</option>
      <option value="novelai" ${settings.mode === 'novelai' ? 'selected' : ''}>NovelAI</option>
      <option value="comfyui" ${settings.mode === 'comfyui' ? 'selected' : ''}>Comfyui</option>
      <option value="free" ${settings.mode === 'free' ? 'selected' : ''}>Free</option>
    </select>
  </label><br>
  <label>freeMode：
    <select id="freeMode">
      <option value="flux" ${settings.freeMode === 'flux' ? 'selected' : ''}>flux</option>
      <option value="flux-realism" ${settings.freeMode === 'flux-realism' ? 'selected' : ''}>flux-realism</option>
      <option value="flux-anime" ${settings.freeMode === 'flux-anime' ? 'selected' : ''}>flux-anime</option>
      <option value="flux-3d" ${settings.freeMode === 'flux-3d' ? 'selected' : ''}>flux-3d</option>
      <option value="any-dark" ${settings.freeMode === 'any-dark' ? 'selected' : ''}>any-dark</option>
      <option value="turbo" ${settings.freeMode === 'turbo' ? 'selected' : ''}>turbo</option>
      <option value="flux-pro" ${settings.freeMode === 'flux-pro' ? 'selected' : ''}>flux-pro</option>
      <option value="flux-cablyai" ${settings.freeMode === 'flux-cablyai' ? 'selected' : ''}>flux-cablyai</option>
    </select>
  </label><br>
  <label>隐藏按钮为双击图片。注意双击震动反馈一次就够：
    <select id="dbclike">
      <option value="true" ${settings.dbclike === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.dbclike === 'false' ? 'selected' : ''}>False</option>
    </select>
    

  <div class="inline-elements">固定提示词设置:
    <select id="yusheid">`
    for (const [key, defaultValue] of Object.entries(settings.yushe)) {
   html += `
      <option value=${key}  ${settings.yusheid === key ? 'selected' : ''}>${key}</option>
     `
    }

    html +=
  `  </select>

  <div class="menu_button interactable" title="保存风格" data-i18n="[title]Save style" id="tishici_save_style" tabindex="0">
                  <i class="fa-solid fa-save"></i>
              </div>

  <div class="menu_button interactable" title="删除风格" data-i18n="[title]Delete style" id="tishici_delete_style" tabindex="0">
                  <i class="fa-solid fa-trash-can"></i>
              </div>
  </div>
  <label>固定正面提示词：</label><br>
  <textarea class="text_pole textarea_compact" id="fixedPrompt" style="height: 55px;">${settings.fixedPrompt}</textarea>
  <label>固定负面提示词：</label><br>
  <textarea class="text_pole textarea_compact" id="negativePrompt" style="height: 55px;">${settings.negativePrompt}</textarea>
      </label><br>`
if(settings.mode === 'comfyui'){
   html +=`
  <div class="inline-elements">工作流设置:
    <select id="workerid">`
    for (const [key, defaultValue] of Object.entries(settings.workers)) {
   html += `
      <option value=${key}  ${settings.workerid === key ? 'selected' : ''}>${key}</option>
     `
    }
    html +=
  `  </select>
  <div class="menu_button interactable" title="保存风格" data-i18n="[title]Save style" id="worker_save_style" tabindex="0">
                  <i class="fa-solid fa-save"></i>
              </div>

  <div class="menu_button interactable" title="删除风格" data-i18n="[title]Delete style" id="worker_delete_style" tabindex="0">
                  <i class="fa-solid fa-trash-can"></i>
              </div>
  </div>
  <label>工作流:</label><br>
  <textarea class="text_pole textarea_compact" id="worker" style="height: 55px;">${settings.worker}</textarea>
`
  }
 html +=`
  <label>正面预设：
    <select id="AQT">
      <option value="best quality, amazing quality, very aesthetic, absurdres" ${settings.AQT === 'best quality, amazing quality, very aesthetic, absurdres' ? 'selected' : ''}>True</option>
      <option value="" ${settings.AQT === '' ? 'selected' : ''}>False</option>
    </select>
  </label><br>
    <label>负面预设：
    <select id="UCP">
     <option value="" ${settings.UCP === '' ? 'selected' : ''}>无</option>
      <option value="lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]" ${settings.UCP === 'lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]' ? 'selected' : ''}>Heavy</option>
      <option value="lowres, jpeg artifacts, worst quality, watermark, blurry, very displeasing" ${settings.UCP === 'lowres, jpeg artifacts, worst quality, watermark, blurry, very displeasing' ? 'selected' : ''}>Light</option>
      <option value="lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract], bad anatomy, bad hands, @_@, mismatched pupils, heart-shaped pupils, glowing eyes" ${settings.UCP === 'lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract], bad anatomy, bad hands, @_@, mismatched pupils, heart-shaped pupils, glowing eyes' ? 'selected' : ''}>Human Focus</option>
      <option value="bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap" ${settings.UCP === 'bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap' ? 'selected' : ''}>作者预设</option>
      <option value="negativeXL_D, negativeXL, source_furry, extra limbs, deformations, long fingers, fused fingers, inaccurate_anatomy, bad proportions, poorly drawn hands, bad hands, extra_fingers, extra_hand, extra_arm, distorted fingers, ugly hands, creepy hands, six fingers, malformed fingers, long_fingers, interlocked fingers:1.2, ugly, deformed, uneven, asymmetrical, unnatural, missing fingers, extra digit, fewer digits, opaque eyes, small eyes, ugly eyes, blurred eyes, bad face, (bad anatomy, ugly face:1.2), (worst quality, low quality, not detailed, low resolution:1.2), motion_blur, blur, blur_censor, blurry, simple_background, text, error, cropped, normal quality, jpeg artifacts, watermark, logo, signature, username, artist name" ${settings.UCP === 'negativeXL_D, negativeXL, source_furry, extra limbs, deformations, long fingers, fused fingers, inaccurate_anatomy, bad proportions, poorly drawn hands, bad hands, extra_fingers, extra_hand, extra_arm, distorted fingers, ugly hands, creepy hands, six fingers, malformed fingers, long_fingers, interlocked fingers:1.2, ugly, deformed, uneven, asymmetrical, unnatural, missing fingers, extra digit, fewer digits, opaque eyes, small eyes, ugly eyes, blurred eyes, bad face, (bad anatomy, ugly face:1.2), (worst quality, low quality, not detailed, low resolution:1.2), motion_blur, blur, blur_censor, blurry, simple_background, text, error, cropped, normal quality, jpeg artifacts, watermark, logo, signature, username, artist name' ? 'selected' : ''}>作者预设2</option>
      </select>
  </label><br>
  <label>缓存：
    <select id="cache">
      <option value="0" ${settings.cache === '0' ? 'selected' : ''}>不缓存</option>
      <option value="1" ${settings.cache === '1' ? 'selected' : ''}>缓存一天</option>
      <option value="7" ${settings.cache === '7' ? 'selected' : ''}>缓存一星期</option>
      <option value="30" ${settings.cache === '30' ? 'selected' : ''}>缓存一个月</option>
      <option value="365" ${settings.cache === '365' ? 'selected' : ''}>缓存一年</option>
    </select>
  </label><br>
  <label>SD OR COMFYUI URL：<input type="text" id="sdUrl" value="${settings.sdUrl}"></label><br>
  `
    if(settings.mode === 'comfyui'){
   html += `
      <label>COMFYUI 模型文件名称不带后缀：<input type="text" id="MODEL_NAME" value="${settings.MODEL_NAME}"></label><br>
          <label>comfyui采样方式：
      <select id="comfyuisamplerName">
      <option value="euler" ${settings.comfyuisamplerName === 'euler' ? 'selected' : ''}>euler</option>
      <option value="euler_cfg_pp" ${settings.comfyuisamplerName === 'euler_cfg_pp' ? 'selected' : ''}>euler_cfg_pp</option>
      <option value="euler_ancestral" ${settings.comfyuisamplerName === 'euler_ancestral' ? 'selected' : ''}>euler_ancestral</option>
      <option value="euler_ancestral_cfg_pp" ${settings.comfyuisamplerName === 'euler_ancestral_cfg_pp' ? 'selected' : ''}>euler_ancestral_cfg_pp</option>
      <option value="dpmpp_2s_ancestral" ${settings.comfyuisamplerName === 'dpmpp_2s_ancestral' ? 'selected' : ''}>dpmpp_2s_ancestral</option>
      <option value="dpmpp_2m_sde" ${settings.comfyuisamplerName === 'dpmpp_2m_sde' ? 'selected' : ''}>dpmpp_2m_sde</option>
      <option value="dpmpp_3m_sde" ${settings.comfyuisamplerName === 'dpmpp_3m_sde' ? 'selected' : ''}>dpmpp_3m_sde</option>
      <option value="dpmpp_3m_sde_gpu" ${settings.comfyuisamplerName === 'dpmpp_3m_sde_gpu' ? 'selected' : ''}>dpmpp_3m_sde_gpu</option>
      </select>
  </label><br>
     `
    }
    html +=
  `
  
  <label>NovelAI API：<input type="text" id="novelaiApi" value="${settings.novelaiApi}"></label><br>
  <label>开始标记：<input type="text" id="startTag" value="${settings.startTag}"></label><br>
  <label>结束标记：<input type="text" id="endTag" value="${settings.endTag}"></label><br>
  `
    if(settings.mode === 'novelai'){
   html += `
       <label>NAI3关键词关联性Prompt Guidance：<input type="number" id="nai3Scale" value="${settings.nai3Scale}"></label><br>
      <label>NAI3关键词重调Prompt Guidance Rescale：<input type="number" id="cfg_rescale" value="${settings.cfg_rescale}"></label><br>
     `
    }
    html +=
  `

  <label>生成步数steps：<input type="number" id="steps" value="${settings.steps}"></label><br>
  <label>宽度width：<input type="number" id="width" value="${settings.width}"></label><br>
  <label>高度height：<input type="number" id="height" value="${settings.height}"></label><br>
  <label>生成种子seed：<input type="number" id="seed" value="${settings.seed}"></label><br>
      
    `
    if(settings.mode === 'sd'|| settings.mode === 'comfyui'){
      html += `
      <label>关键词关联性cfg_scale：<input type="number" id="sdCfgScale" value="${settings.sdCfgScale}"></label><br>
      `
    }
    if(settings.mode === 'sd'){
   html += `
       
      <label>SD面部修复restore_faces：
    <select id="restoreFaces">
      <option value="true" ${settings.restoreFaces === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.restoreFaces === 'false' ? 'selected' : ''}>False</option>
    </select>
  </label><br>
    <label>SD采样方式：
  <select id="samplerName">
      <option value="DPM++ 2M" ${settings.samplerName === 'DPM++ 2M' ? 'selected' : ''}>DPM++ 2M</option>
      <option value="DPM++ SDE" ${settings.samplerName === 'DPM++ SDE' ? 'selected' : ''}>DPM++ SDE</option>
      <option value="DPM++ 2M SDE" ${settings.samplerName === 'DPM++ 2M SDE' ? 'selected' : ''}>DPM++ 2M SDE</option>
      <option value="DPM++ 2M SDE Heun" ${settings.samplerName === 'DPM++ 2M SDE Heun' ? 'selected' : ''}>DPM++ 2M SDE Heun</option>
      <option value="DPM++ 2S a" ${settings.samplerName === 'DPM++ 2S a' ? 'selected' : ''}>DPM++ 2S a</option>
      <option value="DPM++ 3M SDE" ${settings.samplerName === 'DPM++ 3M SDE' ? 'selected' : ''}>DPM++ 3M SDE</option>
      <option value="Euler a" ${settings.samplerName === 'Euler a' ? 'selected' : ''}>Euler a</option>
      <option value="Euler" ${settings.samplerName === 'Euler' ? 'selected' : ''}>Euler</option>
       </select>
  </label><br>
     `
    }
    html +=
  `

  `
    if(settings.mode === 'novelai'){
   html += `
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
    <label>nai3噪点：
  <select id="Schedule">
      <option value="native" ${settings.Schedule === 'native' ? 'selected' : ''}>native</option>
      <option value="exponential" ${settings.Schedule === 'exponential' ? 'selected' : ''}>exponential</option>
      <option value="polyexponential" ${settings.Schedule === 'polyexponential' ? 'selected' : ''}>polyexponential</option>
      <option value="karras" ${settings.Schedule === 'karras' ? 'selected' : ''}>karras</option>
       </select>
  </label><br>
          <label>nai3sm：
    <select id="sm">
      <option value="true" ${settings.sm === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.sm === 'false' ? 'selected' : ''}>False</option>
    </select>
    </label><br>
   <label>nai3dyn：
    <select id="dyn">
      <option value="true" ${settings.dyn === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.dyn === 'false' ? 'selected' : ''}>False</option>
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
      <label>nai3氛围参考图片:
    <input type="file" id="imageInput" accept="image/*">
    <button type="button" onclick="document.getElementById('imageInput').click();">选择图片</button>
    <img id="previewImage" src="" alt="预览图片">
    </label>
  <br>
   <label>nai3图片氛围转移VibeTransfer：
    <select id="nai3VibeTransfer">
      <option value="true" ${settings.nai3VibeTransfer === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.nai3VibeTransfer === 'false' ? 'selected' : ''}>False</option>
    </select>
  <br>
    <label>氛围提取信息InformationExtracted(0-1)：<input type="number" id="InformationExtracted" value="${settings.InformationExtracted}"></label><br>
      <label>氛围强度ReferenceStrength(0-1)：<input type="number" id="ReferenceStrength" value="${settings.ReferenceStrength}"></label><br>
     `
    }
    if(settings.mode === 'comfyui'){
    html +=
    `
    <label>comfyui氛围参考图片:
    <input type="file" id="imageInput2" accept="image/*">
    <button type="button" onclick="document.getElementById('imageInput2').click();">选择图片</button>
    <img id="previewImage2" src="" alt="预览图片">
    </label>
  <br>

  <label>ipa：
    <select id="ipa">
      <option value="STANDARD (medium strength)" ${settings.ipa === 'STANDARD (medium strength)' ? 'selected' : ''}>STANDARD (medium strength)</option>
      <option value="LIGHT - SD1.5 only (low strength)" ${settings.ipa === 'LIGHT - SD1.5 only (low strength)' ? 'selected' : ''}>LIGHT - SD1.5 only (low strength)</option>
      <option value="VIT-G (medium strength)" ${settings.ipa === 'VIT-G (medium strength)' ? 'selected' : ''}>VIT-G (medium strength)</option>
      <option value="PLUS (high strength)" ${settings.ipa === 'PLUS (high strength)' ? 'selected' : ''}>PLUS (high strength)</option>
      <option value="PLUS FACE (portraits)" ${settings.ipa === 'PLUS FACE (portraits)' ? 'selected' : ''}>PLUS FACE (portraits)</option>
      <option value="FULL FACE - SD1.5 only (portraits stronger)" ${settings.ipa === 'FULL FACE - SD1.5 only (portraits stronger)' ? 'selected' : ''}>FULL FACE - SD1.5 only (portraits stronger)</option>
    </select>
    <br>
      <label>氛围强度：<input type="number" id="c_fenwei" value="${settings.c_fenwei}"></label><br>
      <label>细节强度：<input type="number" id="c_xijie" value="${settings.c_xijie}"></label><br>
          <label>权重：<input type="number" id="c_quanzhong" value="${settings.c_quanzhong}"></label><br>
      <label>faceid权重：<input type="number" id="c_idquanzhong" value="${settings.c_idquanzhong}"></label><br>
    `
    }
    html +=
  `
    <label>自动点击生成:
    <select id="zidongdianji">
      <option value="true" ${settings.zidongdianji === 'true' ? 'selected' : ''}>True</option>
      <option value="false" ${settings.zidongdianji === 'false' ? 'selected' : ''}>False</option>
    </select>
  <br>
  <button id="Clear-Cache">清除图片缓存</button><br>
  <button id="save-settings">保存设置</button>
  <button id="close-settings">关闭</button>
  <a id="visit-website-link" href="https://asgdd1kjanhq.sg.larksuite.com/wiki/MqOIw9n3qisWc9kXNhdlkoKCguu?from=from_copylink" target="_blank">帮助</a>
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
      document.getElementById('Clear-Cache').addEventListener('click', clearCache);
      // 添加滑块切换事件监听器
      document.getElementById('scriptToggle').addEventListener('change', function() {
          settings.scriptEnabled = this.checked;
          GM_setValue('scriptEnabled', this.checked);
          console.log('Script ' + (this.checked ? 'enabled' : 'disabled'));
      });
      document.getElementById('yusheid').addEventListener('change',tishici_change);
      

      document.getElementById('tishici_save_style').addEventListener('click', tishici_save);
      document.getElementById('tishici_delete_style').addEventListener('click', tishici_delete);

      if(document.getElementById('workerid')){
        document.getElementById('workerid').addEventListener('change',worker_change);
       }

      
      if(document.getElementById('worker_save_style')){
        document.getElementById('worker_save_style').addEventListener('click', worker_save);
       }
      
      if(document.getElementById('worker_delete_style')){
        document.getElementById('worker_delete_style').addEventListener('click', worker_delete);
       }
     const imageInput= document.getElementById('imageInput')
     const imageInput2= document.getElementById('imageInput2')
     if(imageInput){
      imageInput.addEventListener('change', handleImageUpload);
     }
     if(imageInput2){
      imageInput2.addEventListener('change', handleImageUpload2);
     }
      return panel;
  }

function tishici_save(){


  stylInput("请输入配置名称").then((result) => {
      if (result) {
        const negativePrompt = document.getElementById("negativePrompt");
        const fixedPrompt = document.getElementById("fixedPrompt");
        const selectElement = document.getElementById("yusheid");
        // 创建新的option元素
        let newOption = new Option(result, result);

      // 将新的option添加到select中
      if(!settings.yushe.hasOwnProperty(result)){
        selectElement.add(newOption);
        selectElement.value=result;
      }
        settings.yusheid=result;
        settings.yushe[result]={"fixedPrompt":fixedPrompt.value,"negativePrompt":negativePrompt.value};
        settings.negativePrompt=negativePrompt.value;
        settings.fixedPrompt=fixedPrompt.value;
        GM_setValue("yushe",JSON.stringify(settings.yushe));
        GM_setValue("yusheid",settings.yusheid);
        GM_setValue("negativePrompt",settings.negativePrompt);
        GM_setValue("fixedPrompt","");
        return true;
      } else {
        return false;
      }
    })


}

function tishici_delete(){


  stylishConfirm("是否确定删除").then((result) => {
      if (result) {
          const negativePrompt = document.getElementById("negativePrompt");
          const fixedPrompt = document.getElementById("fixedPrompt");
          const selectElement = document.getElementById("yusheid");

          console.log("selectElement",selectElement.value)
          let valve = selectElement.value;

         // negativePrompt.value="";
        //  fixedPrompt.value="";
          Reflect.deleteProperty(settings.yushe, selectElement.value);
          selectElement.remove(selectElement.selectedIndex);
          selectElement.value="默认";
          settings.yusheid="默认";

          GM_setValue("yusheid",settings.yusheid);
          GM_setValue("yushe",JSON.stringify(settings.yushe));
         // GM_setValue("negativePrompt","");
        //  GM_setValue("fixedPrompt","");

        return true;
      } else {
        return false;
      }
    })



}

function worker_save(){


  stylInput("请输入配置名称").then((result) => {
      if (result) {
        const worker = document.getElementById("worker");
        const selectElement = document.getElementById("workerid");
        // 创建新的option元素
        let newOption = new Option(result, result);

      // 将新的option添加到select中
      if(!settings.workers.hasOwnProperty(result)){
        selectElement.add(newOption);
        selectElement.value=result;
      }
        settings.workerid=result;
        settings.workers[result]=worker.value;
        settings.worker=worker.value;
        GM_setValue("workers",JSON.stringify(settings.workes));
        GM_setValue("workerid",settings.workerid);
        GM_setValue("worker",JSON.stringify(settings.worker));
        return true;
      } else {
        return false;
      }
    })
}

function worker_delete(){
  stylishConfirm("是否确定删除").then((result) => {
      if (result) {

        const worker = document.getElementById("worker");
        const selectElement = document.getElementById("workerid");

        if(selectElement.value=="默认"){
          alert("默认配置不能删除");
          return false;
        }

          console.log("selectElement",selectElement.value)
          let valve = selectElement.value;

         // negativePrompt.value="";
        //  fixedPrompt.value="";
          Reflect.deleteProperty(settings.workers, selectElement.value);
          selectElement.remove(selectElement.selectedIndex);
          selectElement.value="默认";
          settings.workerid="默认";
          settings.worker=settings["workers"][settings.workerid];//设置提示词
          worker.value=settings["workers"][settings.workerid];//设置提示词
          GM_setValue("workerid",settings.workerid);
          GM_setValue("workers",JSON.stringify(settings.workers));
          GM_setValue("worker",JSON.stringify(settings.worker));
         // GM_setValue("negativePrompt","");
        //  GM_setValue("fixedPrompt","");
        return true;
      } else {
        return false;
      }
    })

}

function tishici_change(){


  const negativePrompt = document.getElementById("negativePrompt");
  const fixedPrompt = document.getElementById("fixedPrompt");
  const selectElement = document.getElementById("yusheid");

  settings.yusheid=selectElement.value;

  negativePrompt.value=settings["yushe"][settings.yusheid]["negativePrompt"];//设置提示词
  settings["negativePrompt"]=settings["yushe"][settings.yusheid]["negativePrompt"];//设置提示词

  settings["fixedPrompt"]=settings["yushe"][settings.yusheid]["fixedPrompt"];
  fixedPrompt.value=settings["yushe"][settings.yusheid]["fixedPrompt"];//设置提示词

  GM_setValue("yusheid",settings.yusheid);
  GM_setValue("negativePrompt",settings.negativePrompt);
  GM_setValue("fixedPrompt",settings.fixedPrompt);

}


function worker_change(){

  const worker = document.getElementById("worker");
  const selectElement = document.getElementById("workerid");

  settings.workerid=selectElement.value;

  worker.value=settings["workers"][settings.workerid];//设置提示词
  settings["worker"]=settings["workers"][settings.workerid];//设置提示词
  GM_setValue("workerid",settings.workerid);
  GM_setValue("worker",JSON.stringify(settings.worker));

}

//确认框
function stylInput(message) {
  return new Promise((resolve) => {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    // 创建确认框
    const confirmBox = document.createElement('div');
    // confirmBox.style.position = 'fixed';
    // confirmBox.style.top = '50%';
    // confirmBox.style.left = '50%';
    // confirmBox.style.transform = 'translate(-50%, -50%)';
    confirmBox.style.backgroundColor = '#fff';
    confirmBox.style.padding = '20px';
    confirmBox.style.borderRadius = '5px';
    confirmBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    confirmBox.style.zIndex = '10000';
    confirmBox.style.position = 'absolute';
    confirmBox.style.top = '50%';
    confirmBox.style.left = '50%';
    confirmBox.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(confirmBox);

    // 创建消息文本
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageText.style.marginBottom = '20px';
    messageText.style.color = '#333';
    confirmBox.appendChild(messageText);
    //创建输入框
    const messageinput = document.createElement('input');
    messageinput.textContent = message;
    messageinput.style.marginBottom = '20px';
    messageinput.style.color = '#333';
    confirmBox.appendChild(messageinput);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'right';
    confirmBox.appendChild(buttonContainer);

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.marginRight = '10px';
    cancelButton.style.padding = '10px 20px';
    cancelButton.style.backgroundColor = '#6c757d';
    cancelButton.style.color = '#fff';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '5px';
    cancelButton.style.cursor = 'pointer';
    buttonContainer.appendChild(cancelButton);

    // 创建确定按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确定';
    confirmButton.style.padding = '10px 20px';
    confirmButton.style.backgroundColor = '#007bff';
    confirmButton.style.color = '#fff';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '5px';
    confirmButton.style.cursor = 'pointer';
    buttonContainer.appendChild(confirmButton);

    // 点击取消按钮关闭确认框并返回 false
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      document.body.removeChild(confirmBox);

      resolve(false);
    });

    // 点击确定按钮关闭确认框并返回 true
    confirmButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      document.body.removeChild(confirmBox);
      resolve(messageinput.value);
    });
  });
}

//确认框
function stylishConfirm(message) {
  return new Promise((resolve) => {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    // 创建确认框
    const confirmBox = document.createElement('div');
    // confirmBox.style.position = 'fixed';
    // confirmBox.style.top = '50%';
    // confirmBox.style.left = '50%';
    // confirmBox.style.transform = 'translate(-50%, -50%)';
    confirmBox.style.backgroundColor = '#fff';
    confirmBox.style.padding = '20px';
    confirmBox.style.borderRadius = '5px';
    confirmBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    confirmBox.style.zIndex = '10000';
    confirmBox.style.position = 'absolute';
    confirmBox.style.top = '50%';
    confirmBox.style.left = '50%';
    confirmBox.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(confirmBox);

    // 创建消息文本
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageText.style.marginBottom = '20px';
    messageText.style.color = '#333';
    confirmBox.appendChild(messageText);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'right';
    confirmBox.appendChild(buttonContainer);

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.marginRight = '10px';
    cancelButton.style.padding = '10px 20px';
    cancelButton.style.backgroundColor = '#6c757d';
    cancelButton.style.color = '#fff';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '5px';
    cancelButton.style.cursor = 'pointer';
    buttonContainer.appendChild(cancelButton);

    // 创建确定按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确定';
    confirmButton.style.padding = '10px 20px';
    confirmButton.style.backgroundColor = '#007bff';
    confirmButton.style.color = '#fff';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '5px';
    confirmButton.style.cursor = 'pointer';
    buttonContainer.appendChild(confirmButton);

    // 点击取消按钮关闭确认框并返回 false
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      document.body.removeChild(confirmBox);

      resolve(false);
    });

    // 点击确定按钮关闭确认框并返回 true
    confirmButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      document.body.removeChild(confirmBox);
      resolve(true);
    });
  });
}

 async function clearCache() {

  await stylishConfirm("是否清空图片缓存").then(async (result) => {
    if (result) {
      console.log("imagesid",imagesid)
      if(imagesid!=""){
              for (let [key, value] of Object.entries(imagesid)) {
    
                  await Storedelete(key);
              }
              imagesid={};
              await Storedelete("tupianshuju");
        }
        GM_deleteValue("图片数据");
        alert("已清除图片缓存");

      return true;
    } else {
      return false;
    }
  })

  

  }

  function removeTrailingSlash(str) {
    return str.endsWith('/') ? str.slice(0, -1) : str;
    }

  function saveSettings() {
      for (const key of Object.keys(defaultSettings)) {
          if(key=="yushe"){
              GM_setValue(key, JSON.stringify(settings[key]));

              continue;
          }
          if(key=="workers"){
            GM_setValue(key, JSON.stringify(settings[key]));

            continue;
        }
        if(key=="worker"){
          GM_setValue(key, JSON.stringify(settings[key]));

          continue;
      }

          const element = document.getElementById(key);
          if (element) {

              if(key=="sdUrl"){

                 if(element.value !== settings[key]){

                     element.value=removeTrailingSlash(element.value);
                     if(!confirm("你修改了url,请确认是否为http://192.168.10.2:7860 这种http://+ip/网址+端口的模式，确认？如果不清楚请刷新网页恢复默认！")){
                        return;
                     }
                    // return false;

                 }

                 }
              if(key=="samplerName"){

                     if(element.value !== settings[key]){
                     if(!confirm("你修改了sd的采样方式，请注意输入是否正确，确认？如果不清楚请点取消刷新网页恢复默认！")){
                        return;
                     }
                    // return false;

                 }

              }
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


  function unzipFile(arrayBuffer) {
      return new Promise((resolve, reject) => {
          JSZip.loadAsync(arrayBuffer)
              .then(function(zip) {
              console.log("ZIP 文件加载成功");

              // 遍历 ZIP 文件中的所有文件
              zip.forEach(function (relativePath, zipEntry) {
                  console.log("文件名:", zipEntry.name);

                  // // 解压每个文件
                  // zipEntry.async('blob').then(function(blob) {
                  //     console.log("文件大小:", blob.size);
                  //     // 处理解压后的文件内容

                  //     resolve(blob);
                  // });
                  zipEntry.async('base64').then(function(base64String) {
                      console.log("文件大小:", base64String.size);
                      resolve(base64String);
                  });
              });
          }).catch(reject);
      }) }
  function extractPrompt(str, start, end) {
      // const startIndex = str.indexOf(start);
      // if (startIndex === -1) return str; // 如果没有找到开始标记,返回原字符串

      // const endIndex = str.lastIndexOf(end);
      // if (endIndex === -1 || endIndex <= startIndex) return str; // 如果没有找到结束标记或结束标记在开始标记之前,返回原字符串

      // return str.slice(startIndex + start.length, endIndex);
      return str//.replace(":", '').replace("：", '')
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = function(e) {
      const base64Image = e.target.result;
      nai3cankaotupian=base64Image;
      let img=document.getElementById('previewImage')
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.src = base64Image;
      // Process the base64 image data here
      console.log(base64Image);
    };
  
    reader.readAsDataURL(file);
  }

async  function handleImageUpload2(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const binaryReader = new FileReader();
  
    reader.onload = function(e) {
      const base64Image = e.target.result;
      nai3cankaotupian=base64Image;
      console.log(base64Image);
     let img=document.getElementById('previewImage2')
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.src = base64Image;
      // Process the base64 image data here
      console.log(base64Image);
    };

 
    binaryReader.onload = function(e) {
        const binaryData = e.target.result;
        const formData = new FormData();
        
        // 构造 original_ref 对象
        const original_ref = {
            filename: file.name,
            type: "input",
            subfolder: "clipspace"
        };

        // 添加所有必要的字段
        formData.append('image', new Blob([binaryData], { type: file.type }), file.name);


        let url111 = settings.sdUrl.trim().replaceAll("7860","8188");

        GM_xmlhttpRequest({
            method: "POST",
            url: `${url111}/upload/image`, // 修改为正确的接口路径
            data: formData,
            // 不需要手动设置 Content-Type，让浏览器自动处理 FormData
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log("上传成功", response);
                    try {
                        const result = JSON.parse(response.responseText);
                        comfyuicankaotupian=result.name;
                        console.log("服务器返回数据:", result);
                    } catch(e) {
                        console.log("原始返回数据:", response.responseText);
                    }
                } else {
                    alert("上传失败");
                    try {
                        const errorData = JSON.parse(response.responseText);
                        console.error("错误详情:", errorData);
                    } catch(e) {
                        console.error("原始错误信息:", response.responseText);
                    }
                }
            },
            onerror: function(error) {
                alert("网络错误");
            }
        });
    };

    binaryReader.onerror = function(error) {
        console.error("文件读取错误", error);
    };

    reader.readAsDataURL(file);
    binaryReader.readAsArrayBuffer(file);
  }
  
  function generateRandomSeed() {
    // 生成一个在 0 到 999999999 之间的随机整数
    return Math.floor(Math.random() * 10000000000);
}


  async function replaceWithnovelai() {
      if(!settings.scriptEnabled){
          return;
      }
      if(checkSendBuClass()){
          return;
      }
      unsafeWindow.模式=settings.mode; //sd  novelai  free  使用sd 或novelai 或 免费的  novelai需要获取api    sd启动器需要启用api功能。例如绘世启动器中 的高级选项  启用api选择开启。
      unsafeWindow.start=settings.startTag;//检测ai输出的提示词以什么开头  会被去除；可以自定义。
      unsafeWindow.end=settings.endTag;///检测ai输出的提示词以什么结尾，不去除，可以自定义。提示词会采用两者之间的文字。
      // 以下为novelai的设置  注意更改脚本设置 需要刷新网页。
      var ps = document.getElementsByClassName("mes_text");
      for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          var linkText = p.textContent;
          var regex = new RegExp(`${escapeRegExp(unsafeWindow.start)}([\\s\\S]*?)${escapeRegExp(unsafeWindow.end)}`);
          var matches = linkText.match(regex);
          if(matches){
              var targetText = matches[1];
              var link = extractPrompt(targetText,unsafeWindow.start,unsafeWindow.end);
              //alert(targetText)
              link=link.replaceAll("《","<").replaceAll("》",">").replaceAll("\n","");
              const button = document.createElement('button');
              var uniqueId = "button_image" + Math.random().toString(36).substr(2, 9);
              button.id = uniqueId;
              button.classList.add('button_image');
              button.textContent = '生成图片';
              button.dataset.link = link;
              const imgSpan = document.createElement('span');
              imgSpan.id="span_" + Math.random().toString(36).substr(2, 9);
              imgSpan.dataset.name=uniqueId;
              button.name=imgSpan.id;
              let  re=new RegExp(`${unsafeWindow.start}([\\s\\S]*?)${unsafeWindow.end}`);
              let Text=p.innerHTML.match(re)[0];
              console.log("Text",p.innerHTML.match(re));

              p.innerHTML = p.innerHTML.replace(Text, button.outerHTML);
              // alert(targetText);
              // 重新找到新创建的按钮
              var newbutton = document.getElementById(uniqueId);

              if(settings.dbclike=="true"){
                imgSpan.addEventListener('dblclick', (event) => {
                  addSmoothShakeEffect(event.target);
                  console.log("sssssssss",event.target.dataset.name);
                  nai3(document.getElementById(event.target.dataset.name))// 程序触发按钮的点击事件
  
                });
              }
              async function nai3(button1) {
                let access_token = settings.novelaiApi//填写你的novelai的apikey，在官方网站的设置  Account 里 Get Persistent API Token
                button1.textContent="加载中";
                let model = "nai-diffusion-3"//使用的模型  多个选  择 "safe-diffusion"   "nai-diffusion"   "nai-diffusion-furry"  "furry-diffusion-inpainting" "nai-diffusion-2"  "nai-diffusion-3-inpainting"  "nai-diffusion-furry-3-inpainting"

                let prompt=await zhengmian(settings.fixedPrompt,button1.dataset.link,settings.AQT);                    //固定正面提示词
                let  negative_prompt=await fumian(settings.negativePrompt,settings.UCP);


                let preset_data = {
                       "params_version":3,
                       "width":Number(settings.width),
                       "height":Number(settings.height),
                       "scale":Number(settings.nai3Scale),//提示词关联性
                       "sampler":settings.sampler, //"k_euler",//使用的采样器   "k_dpm_2"   "k_dpmpp_2m"    "ddim_v3"  "k_dpmpp_2s_ancestral"
                       "steps":Number(settings.steps),//生成的步数
                       "n_samples":1,
                       "ucPreset":3,//预设
                       "qualityToggle":true,
                       "sm":settings.sm === "false"? false : true,
                       "sm_dyn":settings.dyn === "false"||settings.sm === "false"? false : true,
                       "dynamic_thresholding":settings.nai3Deceisp === "false"? false : true,
                       "controlnet_strength":1,
                       "legacy":false,
                       "add_original_image":false,
                       "cfg_rescale":Number(settings.cfg_rescale),//关联性调整
                       "noise_schedule":settings.Schedule,
                       "skip_cfg_above_sigma": settings.nai3Variety === "false"? null : 19.343056794463642,
                       "legacy_v3_extend":false,
                       "seed": settings.seed === "0"||settings.seed === "" ? generateRandomSeed() : Number(settings.seed),//生成的种子，下面是固定的负面提示词
                       "negative_prompt":negative_prompt,
                       "reference_image_multiple":[],
                       "reference_information_extracted_multiple":[],
                       "reference_strength_multiple":[]
                      }
                      console.log("nai3cankaotupian",nai3cankaotupian);
                      console.log("settings.nai3VibeTransfer",settings.nai3VibeTransfer);

                      if(nai3cankaotupian!=''&&settings.nai3VibeTransfer=="true"){
                        preset_data.reference_image_multiple.push(nai3cankaotupian.split(',')[1]);
                        preset_data.reference_information_extracted_multiple.push(Number(settings.InformationExtracted));
                        preset_data.reference_strength_multiple.push(Number(settings.ReferenceStrength));

                      }

                const payload = preset_data;
                const urlObj = new URL("https://image.novelai.net/ai/generate-image");

                const Authorization="Bearer "+access_token;
                const data11 = {
                    "input": prompt,//+
                    "model": "nai-diffusion-3",
                    "action": "generate",
                    "parameters": preset_data
                }
                let abc=true;
               while(abc){
                if(xiancheng){
                    abc=false;
                }else{

                   await sleep(1000);
                }
                };
                console.log("data11",data11)

                try {
                    xiancheng=false;
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: urlObj,
                            data: JSON.stringify(data11),
                            responseType: "arraybuffer",
                            proxy: "socks5://127.0.0.1:1082", // 添加本地代理配置
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization":Authorization
                            },
                            onload: function(response) {

                                if (response.status >= 200 && response.status < 400) {
                                    resolve(response);
                                    button1.textContent="生成图片";
                                } else {
                                    button1.textContent="生成图片";
                                    if(response.status==400){
                                        alert("验证错误");
                                    }
                                    if(response.status==401){
                                        alert("api错误请检测api是否正确");
                                    }
                                    if(response.status==402){
                                        alert("需要有效订阅才能访问此端点。");
                                    }
                                    if(response.status==404){
                                        alert("发生404");
                                    }
                                    if(response.status==409){
                                        alert("发生冲突错误");
                                    }
                                    if(response.status==500){
                                        alert("未知错误");
                                    }
                                    if(response.status==429){
                                        alert("请求过多");
                                    }
                                    //alert("响应内容:", response.responseText);
                                    xiancheng=true;
                                    resolve(response);
                                }
                            },
                            
                            onerror: function(error,response) {
                                 button1.textContent="生成图片";
                                alert("请求错误，请检查代理");
                                xiancheng=true;
                                reject(error);
                            }
                        });
                    });

                    const data123 = await response.response;
                    if (response.status >400) {
                    let mess=await response.responseText;
                    alert(`请求失败,状态码: ${await mess} `) 
                    console.log(mess);
                    return ;
                    }


                    let re= await unzipFile(data123);
                    let imageUrl="data:image/png;base64," + re;
                    xiancheng=true;
                   await setItemImg(button1.dataset.link,imageUrl);
                    // let blob = new Blob([re], { type: 'image/png' });
                    // let imageUrl = URL.createObjectURL(blob);

                    button1.textContent="生成图片";
                    let imgSpan = document.getElementById(button1.name);
                    const img2 = document.createElement('img');
                    img2.src=imageUrl;
                    img2.alt = "Generated Image2";
                    img2.dataset.name=imgSpan.dataset.name
                    imgSpan.innerHTML = '';
                    
                    if(settings.dbclike=="true"){
                      button1.textContent="";
                      button1.style.width = '0';
                      button1.style.height = '0';
                      button1.style.overflow = 'hidden';
                      button1.style.padding = '0';
                      button1.style.border = 'none';
                      }
                    imgSpan.appendChild(img2);


                } catch (error) {
                    button1.textContent="生成图片";
                    xiancheng=true;
                    console.error('Error generating image:', error);
                    alert("生成图片失败"+error);
                }
                
              }
              if(!p.hasclik){
              p.hasclik=true;
              p.addEventListener('click', async function(event) {
                    if (event.target.tagName === 'BUTTON') {
                        // 获取按钮的id
                    }else{

                    return;
                    }

                   var button1=event.target;
                   if(!button1.id.includes("image")){
                    return;
                   }

                  nai3(button1);

              });}
              console.log('imgSpan',imgSpan);

              newbutton.parentNode.insertBefore(imgSpan, newbutton.nextSibling);

              let loadimg=await getItemImg(link)
              console.log('loadimg',loadimg);
              if(loadimg){
                  const dataURL = loadimg;
                  let imgSpan = document.getElementById(button.name);
                  const img = document.createElement('img');
                  img.src = dataURL;
                  img.alt = "Generated Image";
                  img.dataset.name=imgSpan.dataset.name
                  imgSpan.innerHTML = '';
                  imgSpan.appendChild(img);
                  if(settings.dbclike=="true"){
                    imgSpan.style.textAlign = 'center';
                    newbutton.textContent="";
                    newbutton.style.width = '0';
                    newbutton.style.height = '0';
                    newbutton.style.overflow = 'hidden';
                    newbutton.style.padding = '0';
                    newbutton.style.border = 'none';
                    }

              }else{
                const mesTextElements = document.getElementsByClassName('mes_text');
                const lastMesText = mesTextElements[mesTextElements.length - 1];

                if(lastMesText==p&&settings.zidongdianji=="true"){

                   nai3(newbutton);

                }

          }
          }
      }
  }

function checkSendBuClass() {
const element = document.getElementById('send_but');
if (element && element.className.includes('displayNone')) {
  return true;
}
return false;
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



  async function replaceSpansWithImagesst() {

      if(!settings.scriptEnabled){
          return;
      }
      if(checkSendBuClass()){
          return;
      }
      //以下为sd的设置
      unsafeWindow.start=settings.startTag;
      unsafeWindow.end=settings.endTag;
      unsafeWindow.url = settings.sdUrl.replace("8188","7860").trim();//sd地址 记得要修改上面的connect 的sd域名才能访问 此处要带端口！
      unsafeWindow.prompts = settings.fixedPrompt; //额外固定的提示词 nsfw?    也可以固定你要的 lora 。每次都会加载提示词后面。下面是反向提示词
      unsafeWindow.negative_prompt =settings.negativePrompt
      unsafeWindow.cfg_scale = settings.sdCfgScale;//关键词关联性
      unsafeWindow.width = settings.width; //宽度
      unsafeWindow.height = settings.height;//长度
      unsafeWindow.restore_faces = settings.restoreFaces; //面部修复
      unsafeWindow.steps = settings.steps;//步数
      unsafeWindow.sampler_name=settings.samplerName ; //采样方式
      var ps = document.getElementsByClassName("mes_text");
      for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          var linkText = p.textContent;
          var regex = new RegExp(`${escapeRegExp(unsafeWindow.start)}([\\s\\S]*?)${escapeRegExp(unsafeWindow.end)}`);
          var matches = linkText.match(regex);
          if(matches){
              var targetText = matches[1];
              console.log("matches",matches);
              var link = extractPrompt(targetText,unsafeWindow.start,unsafeWindow.end);
              link=link.replaceAll("《","<").replaceAll("》",">").replaceAll("\n","");//修改lora<>
              const button = document.createElement('button');
              var uniqueId = "button_image" + Math.random().toString(36).substr(2, 9);
              button.id = uniqueId;
              button.textContent = '生成图片';
              button.classList.add('button_image');
              button.classList.add('button_image');

              const imgSpan = document.createElement('span');
              imgSpan.id="span_" + Math.random().toString(36).substr(2, 9);
              imgSpan.dataset.name=uniqueId;
              button.name=imgSpan.id;
              button.dataset.link = link;
              let  re=new RegExp(`${unsafeWindow.start}([\\s\\S]*?)${unsafeWindow.end}`);
              let Text=p.innerHTML.match(re)[0];
              console.log("Text",p.innerHTML.match(re));

              p.innerHTML = p.innerHTML.replace(Text, button.outerHTML);
              // alert(targetText);
              // 重新找到新创建的按钮
              var newbutton = document.getElementById(uniqueId);
              if(settings.dbclike=="true"){
                imgSpan.addEventListener('dblclick', (event) => {
                  addSmoothShakeEffect(event.target);
                  console.log("sssssssss",event.target.dataset.name);
                  sd(document.getElementById(event.target.dataset.name))// 程序触发按钮的点击事件
                });
              }

              newbutton.spanid=imgSpan.id;

             async function sd(button1){

                if(!button1.id.includes("image")){
                  return;
              }
              const url = unsafeWindow.url;
              button1.textContent="加载中";
              let prompt=await zhengmian(settings.fixedPrompt,button1.dataset.link,settings.AQT);                    //固定正面提示词
              let  negative_prompt=await fumian(settings.negativePrompt,settings.UCP);
              const payload = {
                  "prompt": prompt,
                  "negative_prompt": negative_prompt,
                  "steps": unsafeWindow.steps,
                  "sampler_name": unsafeWindow.sampler_name,
                  "width": unsafeWindow.width,
                  "height": unsafeWindow.height,
                  "restore_faces": unsafeWindow.restore_faces,
                  "cfg_scale":unsafeWindow.cfg_scale,
                  "seed":settings.seed === 0||settings.seed === "0"||settings.seed === "" ? -1 : settings.seed
              };

              console.log("payload",payload);
              //alert(payload.prompt);

             
              let abc=true;
              while(abc){
               if(xiancheng){
                   abc=false;
               }else{

                  await sleep(1000);
               }
               };

              try {
                   const urlObj = new URL(url+"/sdapi/v1/txt2img");
                  xiancheng=false;
                  const response = await new Promise((resolve, reject) => {
                      GM_xmlhttpRequest({
                          method: "POST",
                          url: urlObj,
                          data: JSON.stringify(payload),
                          headers: {
                              "Content-Type": "application/json",

                              "Access-Control-Allow-Origin": "*"
                          },
                          onload: function(response) {
                              if (response.status >= 200 && response.status < 400) {
                                  button1.textContent="生成图片";
                                  xiancheng=true;
                                  resolve(response);
                              } else {
                                  button1.textContent="生成图片";
                                  alert("响应内容:sd返回错误可能是你输入参数有误"+response.responseText);
                                  console.log("响应内容:", response.responseText);
                                  xiancheng=true;
                                  reject(new Error(`请求失败,状态码: ${response.status}`));

                              }
                          },
                          onerror: function(error,response) {
                               var newbutton1 = document.getElementById(uniqueId);
                               button1.textContent="生成图片";
                               xiancheng=true;  
                              alert("请求错误。请检测地址"+url+"是否正确.或sd已正确开启，sd启动器需要启用api功能。例如绘世启动器中 的高级选项  启用api选择开启。并且启动器需要重启生效"+error.status+error.statusText);
                              reject(error);
                          }
                      });
                  });
                  xiancheng=true;    
                  const r = JSON.parse(response.responseText);

                  for (let i of r['images']) {
                      const png_payload = {
                          "image": "data:image/png;base64," + i
                      };

                      const response2 = await new Promise((resolve, reject) => {
                          GM_xmlhttpRequest({
                              method: "POST",
                              url: `${url}/sdapi/v1/png-info`,
                              data: JSON.stringify(png_payload),
                              headers: {
                                  "Content-Type": "application/json"
                              },
                              onload: resolve,
                              onerror: reject
                          });
                      });
                      button1.textContent="生成图片";
                      const pngInfo = JSON.parse(response2.responseText).info;
                      const dataURL = "data:image/png;base64," + i;

                      await setItemImg(button1.dataset.link,dataURL);
                      //let imgSpan = button1.nextElementSibling;
                      let imgSpan = document.getElementById(button1.name);
                      const img = document.createElement('img');

                      img.src = dataURL;
                      img.alt = "Generated Image";
                      img.dataset.parameters = pngInfo;
                      img.dataset.name=imgSpan.dataset.name
                      imgSpan.innerHTML = '';
                      
                      if(settings.dbclike=="true"){
                        imgSpan.style.textAlign = 'center';
                        button1.textContent="";
                        button1.style.width = '0';
                        button1.style.height = '0';
                        button1.style.overflow = 'hidden';
                        button1.style.padding = '0';
                        button1.style.border = 'none';
                        }
                      imgSpan.appendChild(img);

                  }
              } catch (error) {
                  console.error('Error generating image:', error);
                  alert("生成图片失败"+error)
                  xiancheng=true;
              }
              }

              if(!p.hasclik){
              p.hasclik=true;
              p.addEventListener('click', async function(event) {
                  if (event.target.tagName === 'BUTTON') {
                      // 获取按钮的id

                  }else{

                      return;
                  }

                  var button1=event.target;

                 sd(button1);
                 
              });
              }
              //   p.parentNode.replaceChild(button, span);

             
              newbutton.parentNode.insertBefore(imgSpan, newbutton.nextSibling);

              let loadimg=await getItemImg(link)
              console.log('loadimg',loadimg);
              if(loadimg){
                  const dataURL = loadimg;
                  let imgSpan = document.getElementById(button.name);
                  const img = document.createElement('img');
                  img.src = dataURL;
                  img.alt = "Generated Image";
                  img.dataset.name=imgSpan.dataset.name
                  imgSpan.innerHTML = '';
                  imgSpan.appendChild(img);
                  if(settings.dbclike=="true"){
                    newbutton.textContent="";
                    newbutton.style.width = '0';
                    newbutton.style.height = '0';
                    newbutton.style.overflow = 'hidden';
                    newbutton.style.padding = '0';
                    newbutton.style.border = 'none';
                    }

              }else{
                const mesTextElements = document.getElementsByClassName('mes_text');
                const lastMesText = mesTextElements[mesTextElements.length - 1];

                if(lastMesText==p&&settings.zidongdianji=="true"){

                  sd(newbutton);

                }

          }

          }
      }
  }

  async function replacepro(payload,json){

    json=json.replaceAll("%seed%",Number(payload.seed));
    json=json.replaceAll("%steps%",Number(payload.steps)); 
    json=json.replaceAll("%cfg_scale%",Number(payload.cfg_scale)); 
    json=json.replaceAll("%sampler_name%",`${'"'+payload.sampler_name+'"'}`); 
    json=json.replaceAll("%width%",Number(payload.width)); 
    json=json.replaceAll("%height%",Number(payload.height)); 
    json=json.replaceAll("%negative_prompt%",`${'"'+payload.negative_prompt+'"'}`); 
    json=json.replaceAll("%prompt%",`${'"'+payload.prompt+'"'}`); 
    json=json.replaceAll("%MODEL_NAME%",`"${payload.MODEL_NAME.trim()}.safetensors"`); 
    json=json.replaceAll("%c_quanzhong%",Number(payload.c_quanzhong)); 
    json=json.replaceAll("%c_idquanzhong%",Number(payload.c_idquanzhong)); 
    json=json.replaceAll("%c_xijie%",Number(payload.c_xijie)); 
    json=json.replaceAll("%c_fenwei%",Number(payload.c_fenwei)); 
    json=json.replaceAll("%comfyuicankaotupian%",`${'"'+payload.comfyuicankaotupian+'"'}`); 
    json=json.replaceAll("%ipa%",`${'"'+payload.ipa+'"'}`); 
    
    console.log(json);
    return json
}




  async function replaceSpansWithImagesstcomfyui() {

    if(!settings.scriptEnabled){
        return;
    }
    if(checkSendBuClass()){
        return;
    }
    //以下为comfyui的设置
    unsafeWindow.start=settings.startTag;
    unsafeWindow.end=settings.endTag;
    unsafeWindow.url = settings.sdUrl.replace("7860","8188").trim();//sd地址 记得要修改上面的connect 的sd域名才能访问 此处要带端口！
    unsafeWindow.prompts = settings.fixedPrompt; //额外固定的提示词 nsfw?    也可以固定你要的 lora 。每次都会加载提示词后面。下面是反向提示词
    unsafeWindow.negative_prompt =settings.negativePrompt
    unsafeWindow.cfg_scale = settings.sdCfgScale;//关键词关联性
    unsafeWindow.width = settings.width; //宽度
    unsafeWindow.height = settings.height;//长度
    unsafeWindow.restore_faces = settings.restoreFaces; //面部修复
    unsafeWindow.steps = settings.steps;//步数
    unsafeWindow.sampler_name=settings.comfyuisamplerName ; //采样方式
    unsafeWindow.MODEL_NAME=settings.MODEL_NAME;
    var ps = document.getElementsByClassName("mes_text");
    for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        var linkText = p.textContent;
        var regex = new RegExp(`${escapeRegExp(unsafeWindow.start)}([\\s\\S]*?)${escapeRegExp(unsafeWindow.end)}`);
        var matches = linkText.match(regex);
        if(matches){
            var targetText = matches[1];
            console.log("matches",matches);
            var link = extractPrompt(targetText,unsafeWindow.start,unsafeWindow.end);
            link=link.replaceAll("《","<").replaceAll("》",">").replaceAll("\n","");//修改lora<>
            const button = document.createElement('button');
            var uniqueId = "button_image" + Math.random().toString(36).substr(2, 9);
            button.id = uniqueId;
            button.classList.add('button_image');
            button.textContent = '生成图片';

            const imgSpan = document.createElement('span');

            imgSpan.id="span_" + Math.random().toString(36).substr(2, 9);
            imgSpan.dataset.name=uniqueId;

            button.name=imgSpan.id;
            button.dataset.link = link;
            let  re=new RegExp(`${unsafeWindow.start}([\\s\\S]*?)${unsafeWindow.end}`);
            let Text=p.innerHTML.match(re)[0];
            console.log("Text",p.innerHTML.match(re));

            p.innerHTML = p.innerHTML.replace(Text, button.outerHTML);
            // alert(targetText);
            // 重新找到新创建的按钮
            var newbutton = document.getElementById(uniqueId);
            
            if(settings.dbclike=="true"){
              imgSpan.addEventListener('dblclick', (event) => {
                console.log("sssssssss",event.target.dataset.name);
                addSmoothShakeEffect(event.target);
                sd(document.getElementById(event.target.dataset.name))// 程序触发按钮的点击事件

              });
            }

            newbutton.spanid=imgSpan.id;

           async function sd(button1){

              if(!button1.id.includes("image")){
                return;
            }
            const url = unsafeWindow.url;
            button1.textContent="加载中";
            let prompt=await zhengmian(settings.fixedPrompt,button1.dataset.link,settings.AQT);                    //固定正面提示词

            function replaceLoraTags(input) {
              // 正则表达式
              const regex = /<lora:([^:]+)(?:\.safetensors)?:([^>]+)(?::1)?>/g;
              
              return input.replace(regex, (match, filename, value) => {
                  if (match.includes('.safetensors')) {
                      // 已经是新格式，不需要改变
                      return match;
                  }
                  // 构造新的标签格式
                  return `<lora:${filename}.safetensors:${value}:1>`;
              });
          }
          prompt=replaceLoraTags(prompt);  //替换lora字符串  处理字符

          console.log("prompt",prompt);
            let  negative_prompt=await fumian(settings.negativePrompt,settings.UCP);
            negative_prompt=replaceLoraTags(negative_prompt);
        prompt=prompt.replaceAll("\n",",").replaceAll("\\\\","\\").replaceAll("\\","\\\\");
        negative_prompt=negative_prompt.replaceAll("\n",",").replaceAll("\\\\","\\").replaceAll("\\","\\\\");

            let payload = {
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "steps": unsafeWindow.steps,
                "sampler_name": unsafeWindow.sampler_name,
                "width": unsafeWindow.width,
                "height": unsafeWindow.height,
                "cfg_scale":unsafeWindow.cfg_scale,
                "seed":settings.seed === 0||settings.seed === "0"||settings.seed === "" ? generateRandomSeed() : settings.seed,
                "MODEL_NAME":unsafeWindow.MODEL_NAME,
                "c_quanzhong":settings.c_quanzhong,
                "c_idquanzhong":settings.c_idquanzhong,
                "c_xijie":settings.c_xijie,
                "c_fenwei":settings.c_fenwei,
                "comfyuicankaotupian": comfyuicankaotupian,
                "ipa": settings.ipa
            };
            //工作流




const clientId = "533ef3a3-39c0-4e39-9ced-37d290f371f8";

    payload=await replacepro(payload,settings.worker);

     
      payload=`{"client_id":"${clientId}",
        "prompt":${payload}
        }`

            console.log("payload",payload);
            //alert(payload.prompt);
           
            let abc=true;
            while(abc){
             if(xiancheng){
                 abc=false;
             }else{

                await sleep(1000); //排队线程
             }
             };

            try {
                const urlObj = new URL(url+"/prompt");
                xiancheng=false;
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: urlObj,
                        data: `${payload}`,
                        headers: {
                            "Content-Type": "application/json",

                            "Access-Control-Allow-Origin": "*"
                        },
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 400) {
                                

                                resolve(response);
                            } else {
                                button1.textContent="生成图片";
                                alert("响应内容:sd返回错误可能是你输入参数有误"+response.responseText);
                                console.log("响应内容:", response.responseText);
                                xiancheng=true;
                                reject(new Error(`请求失败,状态码: ${response.status}`));
                            }
                        },
                        onerror: function(error,response) {
                             var newbutton1 = document.getElementById(uniqueId);
                             button1.textContent="生成图片";
                             xiancheng=true;  
                            alert("请求错误。请检测地址"+urlObj+"是否正确.或comfyui已正确开启，启动器需要启用api功能。例如绘世启动器中 的高级选项  启用api选择开启。并且启动器需要重启生效"+error.status+error.statusText);
                            reject(error);
                        }
                    });
                });
                
                const r = JSON.parse(response.responseText);

                let id=r.prompt_id;
                let ii=0;
                button1.textContent="等待生成图片";


                while(true){
                  try {
                    

                     
                      const response2 = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `${url}/history/${id}`,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            onload: resolve,
                            onerror: reject
                        });
                    });

                  console.log("response2",response2.responseText);
                  let re=JSON.parse(await response2.responseText)
                  if(re.hasOwnProperty(id)) {

                    xiancheng=true;
                    button1.textContent="生成图片";
                    function getFilenameFromOutputs(outputs) {
                      // 获取 outputs 对象的所有键
                      const keys = Object.keys(outputs);
                      // 如果没有键，返回 null
                      if (keys.length === 0) {
                          return null;
                      }
                      
                      // 获取第一个键
                      const firstKey = keys[0];
                      
                      // 获取该键对应的对象
                      const outputObject = outputs[firstKey];
                      
                      // 检查 images 数组是否存在且不为空
                      if (outputObject.images && outputObject.images.length > 0) {
                          // 返回第一个图像的 filename
                          return outputObject.images[0].filename;
                      }
                      
                      // 如果没有找到 filename，返回 null
                      return null;


                  }
                  button1.textContent="正在加载图片";

                   let filename=getFilenameFromOutputs(re[id]["outputs"]);

                    let fileurl=`${url}/view?filename=${filename}&type=output`
                    
                    const response = await new Promise((resolve, reject) => {
                      GM_xmlhttpRequest({
                          method: "GET",
                          url: fileurl,
                          responseType: "arraybuffer",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          onload: function(response) {
                              if (response.status >= 200 && response.status < 400) {
                                  resolve(response);
                                  //alert("以成功返回"+response.status);
                              } else {
                                 
                                  alert(`响应内容: 可能是你lora或者参数错误`);
                                  reject(new Error(`请求失败,状态码: ${response.status}`));
                              }
                          },
                          onerror: function(error,response) {
                              alert("请求错误，请检查代理"+error);
                              reject(error);
                          }
                      });
                  });
                  let re2 =await response.response;
                  let blob = new Blob([re2], { type: 'image/png' });
                  const imageUrl = URL.createObjectURL(blob);  

                  console.log("dataURL",imageUrl);
                  await convertImageToBase64(button1.dataset.link,blob)  
                      
                      //let imgSpan = button1.nextElementSibling;
                      let imgSpan = document.getElementById(button1.name);
                      const img = document.createElement('img');

                      img.src = imageUrl;
                      img.alt = "Generated Image";
                      img.dataset.name=imgSpan.dataset.name
                      imgSpan.innerHTML = '';

                      imgSpan.appendChild(img);   
                      if(settings.dbclike=="true"){
                        imgSpan.style.textAlign = 'center';
                        button1.textContent="";
                        button1.style.width = '0';
                        button1.style.height = '0';
                        button1.style.overflow = 'hidden';
                        button1.style.padding = '0';
                        button1.style.border = 'none';
                        }
                      break;
                  }
                await sleep(1000);
                ii=ii++;

                if(ii>30){
                    xiancheng=true;
                    button1.textContent="生成图片";
                    console.error('Error generating image:');
                    alert("comfyui服务器可能已断开连接，请检查sd是否已开启，sd启动器中 的高级选项  启用api选择开启。并且启动器需要重启生效");
                    break;
                }
              } catch (error) {
                xiancheng=true;
                button1.textContent="生成图片";
                console.error('Error generating image:');
                alert("comfyui服务器可能已断开连接"+error);
                break;
                    
              }
                    
                }

            } catch (error) {
                console.error('Error generating image:', error);
                alert(error);
                xiancheng=true;
                button1.textContent="生成图片";
            }
            }

            if(!p.hasclik){
            p.hasclik=true;
            p.addEventListener('click', async function(event) {
                if (event.target.tagName === 'BUTTON') {
                    // 获取按钮的id

                }else{

                    return;
                }

                var button1=event.target;

               sd(button1);
               
            });
            }
            //   p.parentNode.replaceChild(button, span);

           
            newbutton.parentNode.insertBefore(imgSpan, newbutton.nextSibling);

            let loadimg=await getItemImg(link)
            console.log('loadimg',loadimg);
            if(loadimg){
                const dataURL = loadimg;
                let imgSpan = document.getElementById(button.name);
                const img = document.createElement('img');
                img.src = dataURL;
                img.alt = "Generated Image";
                img.dataset.name=imgSpan.dataset.name
                imgSpan.innerHTML = '';
                imgSpan.appendChild(img);

                if(settings.dbclike=="true"){
                  newbutton.textContent="";
                  newbutton.style.width = '0';
                  newbutton.style.height = '0';
                  newbutton.style.overflow = 'hidden';
                  newbutton.style.padding = '0';
                  newbutton.style.border = 'none';
                  }

            }else{
              const mesTextElements = document.getElementsByClassName('mes_text');
              const lastMesText = mesTextElements[mesTextElements.length - 1];

              if(lastMesText==p&&settings.zidongdianji=="true"){

                sd(newbutton);

              }

        }

        }
    }
}


async  function convertImageToBase64(link,imageBlob) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Image = e.target.result;
    setItemImg(link,base64Image);

    // Process the base64 image data here
  };
  reader.readAsDataURL(imageBlob);
}













  async function replaceSpansWithImagesfree() {
      if(!settings.scriptEnabled){
          return;
      }
      if(checkSendBuClass()){
          return;
      }
      unsafeWindow.start=settings.startTag;
      unsafeWindow.end=settings.endTag;
      unsafeWindow.url = settings.sdUrl;//sd地址 记得要修改上面的connect 的sd域名才能访问 此处要带端口！
      unsafeWindow.prompts = settings.fixedPrompt; //额外固定的提示词 nsfw?    也可以固定你要的 lora 。每次都会加载提示词后面。下面是反向提示词
      unsafeWindow.negative_prompt =settings.negativePrompt
      unsafeWindow.cfg_scale = settings.sdCfgScale;//关键词关联性
      unsafeWindow.width = settings.width; //宽度
      unsafeWindow.freeMode=settings.freeMode;//模型
      unsafeWindow.height = settings.height;//长度
      unsafeWindow.restore_faces = settings.restoreFaces; //面部修复
      unsafeWindow.steps = settings.steps;//步数
      unsafeWindow.sampler_name=settings.samplerName ; //采样方式
      var ps = document.getElementsByClassName("mes_text");
      for (var i = 0; i < ps.length; i++) {
          var p = ps[i];
          var linkText = p.textContent;
          var regex = new RegExp(`${escapeRegExp(unsafeWindow.start)}([\\s\\S]*?)${escapeRegExp(unsafeWindow.end)}`);
          var matches = linkText.match(regex);
          if(matches){
              var targetText = matches[1];
              var link =  extractPrompt(targetText,unsafeWindow.start,unsafeWindow.end);
              const button = document.createElement('button');
              link=link.replaceAll("《","<").replaceAll("》",">").replaceAll("\n","");//
              var uniqueId = "button_image" + Math.random().toString(36).substr(2, 9);
              button.id = uniqueId;
              button.classList.add('button_image');
              button.textContent = '生成图片';
               const imgSpan = document.createElement('span');
              imgSpan.id="span_" + Math.random().toString(36).substr(2, 9);
              imgSpan.dataset.name=uniqueId;
              button.name=imgSpan.id;

              button.dataset.link = link;
              let  re=new RegExp(`${unsafeWindow.start}([\\s\\S]*?)${unsafeWindow.end}`);
              let Text=p.innerHTML.match(re)[0];
              console.log("Text",p.innerHTML.match(re));

              p.innerHTML = p.innerHTML.replace(Text, button.outerHTML);
              // alert(targetText);
              // 重新找到新创建的按钮
              var newbutton = document.getElementById(uniqueId);
              if(settings.dbclike=="true"){
                imgSpan.addEventListener('dblclick', (event) => {
                  addSmoothShakeEffect(event.target);
                  console.log("sssssssss",event.target.dataset.name);
                  free(document.getElementById(event.target.dataset.name))// 程序触发按钮的点击事件
  
                });
              }

              async function free(button1){

                var ran = Math.floor(Math.random() * 1000000000).toString();
                //固定正面提示词

                 let prompt = await zhengmian(settings.fixedPrompt,button1.dataset.link,settings.AQT);
                 unsafeWindow.width = settings.width; //宽度
                 unsafeWindow.height = settings.height;//长度
                 prompt=prompt.replaceAll(" ","");
                 prompt=prompt.replaceAll(","," ");
                 console.log('prompt',prompt);
                 const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)+"?width="+unsafeWindow.width+"&height="+unsafeWindow.height+"&seed="+ran+"&model="+unsafeWindow.freeMode}`;
                 console.log('uel',url);
                 const img = document.createElement('img');
                 img.src = url;
                 img.alt = "Generated Image";
                 img.dataset.name=imgSpan.dataset.name;
                 let imgSpan = document.getElementById(button1.name);
                 imgSpan.innerHTML = '';
                 imgSpan.appendChild(img);
                 
                 if(settings.dbclike=="true"){
                  button1.textContent="";
                  button1.style.width = '0';
                  button1.style.height = '0';
                  button1.style.overflow = 'hidden';
                  button1.style.padding = '0';
                  button1.style.border = 'none';
                  }       



              }
              if(!p.hasclik){
              p.hasclik=true;
              p.addEventListener('click', async function() {
                        if (event.target.tagName === 'BUTTON') {
                        // 获取按钮的id

                    }else{

                    return;
                    }

                  var button1=event.target;
                  if(!button1.id.includes("image")){
                      return;
                  }
                  free(button1);


              });}

              newbutton.parentNode.insertBefore(imgSpan, newbutton.nextSibling);

              let loadimg=await getItemImg(link)
              console.log('loadimg',loadimg);
              if(loadimg){
                  const dataURL = loadimg;
                  let imgSpan = document.getElementById(button.name);
                  const img = document.createElement('img');
                  img.src = dataURL;
                  img.alt = "Generated Image";
                  imgSpan.innerHTML = '';
                  img.dataset.name=imgSpan.dataset.name
                  imgSpan.appendChild(img);
                  imgSpan.style.textAlign = 'center';

                  if(settings.dbclike=="true"){
                  newbutton.textContent="";
                  newbutton.style.width = '0';
                  newbutton.style.height = '0';
                  newbutton.style.overflow = 'hidden';
                  newbutton.style.padding = '0';
                  newbutton.style.border = 'none';
                  }

              }else{
                const mesTextElements = document.getElementsByClassName('mes_text');
                const lastMesText = mesTextElements[mesTextElements.length - 1];

                if(lastMesText==p&&settings.zidongdianji=="true"){

                  free(newbutton);

                }

          }


          }
      }
  }

async function chenk(){
      if(settings.mode=="sd"){
      replaceSpansWithImagesst();
  }else if(settings.mode=="novelai"){
      replaceWithnovelai();
  }else if(settings.mode=="comfyui"){
    replaceSpansWithImagesstcomfyui();
  }else{
      replaceSpansWithImagesfree();
  }
  }

  setInterval(chenk, 2000);


async function setItemImg(tag,img){
     let md5=CryptoJS.MD5(tag).toString();
     if(imagesid==""){

      imagesid={};

     }

    let  time=new Date().getTime();
  //   console.log("md5",md5);
  //   console.log("time",time);
  //   console.log("img",img);

    console.log("imagesid",imagesid);
    imagesid[md5]=[time];
    //console.log("imagesmd5",images[md5]);
  const data = { id: `${md5}`, tupian: `${img}` };
  const data2 = { id: "tupianshuju", shuju: `${JSON.stringify(imagesid)}` };
  Storereadwrite(data);
  Storereadwrite(data2);

    //  GM_setValue("图片",JSON.stringify(images));

  };
async function getItemImg(tag){

      let md5=CryptoJS.MD5(tag).toString();
      if(imagesid==""){//载入图片数据
   //   let image;
     // image=GM_getValue("图片数据","无");
      let imageid=await Storereadonly("tupianshuju");

    //  console.log("imageid",imageid);
      // console.log("image",image);
      // console.log("imageid",imageid);
      if(!imageid){
          return false;
      }
   //   console.log("image",image);

      // if(image!="无"){//转移旧数据
      //     let json=JSON.parse(image);
      //     alert("数据转移");

      //     for (let [key, value] of Object.entries(json)) {

      //         if(await delDate(value)){

      //          Reflect.deleteProperty(json, key);
      //          GM_deleteValue(key);

      //         }

      //     }
      //     imagesid={};
      //     for (let [key, value] of Object.entries(json)) {
      //         console.log(key + ': ' + value);
      //             imagesid[key]=value;
      //            let tupian= GM_getValue(key,"");
      //             const data={ id: `${key}`, tupian: `${tupian}` }
      //             await Storereadwrite(data);
      //       }

      //    // GM_setValue("图片数据",JSON.stringify(imagesid));
      //     const data = { id: "tupianshuju", shuju: `${JSON.stringify(imagesid)}` };
      //     await Storereadwrite(data);

      //     GM_deleteValue("图片数据");
      //     console.log("imagesid",imagesid);
      //     let list=GM_listValues();
      //     for(let i=0;i<list.length;i++){
      //         if(!settings.hasOwnProperty(list[i])){
      //             GM_deleteValue(list[i]);
      //         }
      //     }
      // }else{
          imagesid={};
          imagesid=JSON.parse(imageid.shuju);
  // }
  for (let [key, value] of Object.entries(imagesid)) {

      if(await delDate(value)){

       Reflect.deleteProperty(imagesid, key);

       await Storedelete(key);

      }

      }
      const data = { id: "tupianshuju", shuju: `${JSON.stringify(imagesid)}` };
      await Storereadwrite(data);

  }
  if(imagesid.hasOwnProperty(md5)){
          let image=await Storereadonly(md5);
          console.log("image",image);
          return  image.tupian;

      }

      return false;
 };


async function delDate(tagdate){

          // 获取当前日期
          const currentDate = new Date();

          // 计算当前日期和目标日期之间的差值 (以毫秒为单位)
          const timeDiff = currentDate.getTime() - Number(tagdate);

          // 将毫秒转换为天数
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          // 判断是否超过缓存时间
          if (daysDiff > Number(settings.cache)) {
             return true;
          } else {
             return false;
          }

 }
async function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
async function zhengmian(text,prom,AQT) {

   if(text==''){

      return  prom+", "+AQT;
   }else{

      return  text+", "+prom+", "+AQT;
   }

}
async  function fumian(text,UCP){
  console.log("negativePrompt",settings.negativePrompt)
  if(text==""){

      return UCP;

  }else if(UCP==""){

      return  text;
  }else{

     return  UCP+", "+text;
  }

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// 使用 requestAnimationFrame 实现更流畅的震动
function addSmoothShakeEffect(imgElement) {
  // 确保图片有定位属性
  if (getComputedStyle(imgElement).position === 'static') {
      imgElement.style.position = 'relative';
  }

  const startTime = Date.now();
  const duration = 300; // 持续时间（毫秒）
  const amplitude = 3; // 震动幅度

  function shake() {
      const elapsed = Date.now() - startTime;
      
      if (elapsed < duration) {
          // 使用正弦函数创建震动效果
          const offset = amplitude * Math.sin(elapsed / duration * Math.PI * 10);
          imgElement.style.left = `${offset}px`;
          
          requestAnimationFrame(shake);
      } else {
          // 重置位置
          imgElement.style.left = '0px';
      }
  }

  requestAnimationFrame(shake);
}


})();