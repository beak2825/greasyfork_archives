// ==UserScript==
// @name         Booru Cotrans
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tranlate images on boorus with cotrans.touhou.ai! Hit F8 to switch betweeen tranlated and original image. Hit F9 for configuration.
// @author       Rhodan81
// @match        https://gelbooru.com/index.php?page=post*
// @match        https://rule34.xxx/index.php?page=post*
// @match        https://chan.sankakucomplex.com/de/posts/*
// @match        https://booru.allthefallen.moe/posts/*
// @match        https://*.booru.org/index.php?page=post*
// @connect gelbooru.com
// @connect img3.gelbooru.com
// @connect rule34.xxx
// @connect wimg.rule34.xxx
// @connect api.cotrans.touhou.ai
// @connect s.sankakucomplex.com
// @connect chan.sankakucomplex.com
// @connect booru.allthefallen.moe
// @connect *.booru.org
// @connect img.booru.org
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant GM.xmlHttpRequest
// @grant GM_xmlhttpRequest
// @grant GM.setValue
// @grant GM_setValue
// @grant GM.getValue
// @grant GM_getValue
// @grant GM.deleteValue
// @grant GM_deleteValue
// @grant GM.addValueChangeListener
// @grant GM_addValueChangeListener
// @grant GM.removeValueChangeListener
// @grant GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/480033/Booru%20Cotrans.user.js
// @updateURL https://update.greasyfork.org/scripts/480033/Booru%20Cotrans.meta.js
// ==/UserScript==

let gmc = new GM_config(
    {
        'id': 'BooruCotransConfig', // The id used for this instance of GM_config
        'title': 'Booru Cotrans Settings', // Panel Title
        'fields': // Fields object
        {
            'target_language': // This is the id of the field
            {
                'label': 'Target language', // Appears next to field
                'type': 'select', // Makes this setting a text field
                'options': ['English', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Czech', 'Dutch', 'French', 'German', 'Hungarian', 'Italian', 'Japanese', 'Korean', 'Polish', 'Portuguese (Brazil)', 'Romanian', 'Russian', 'Spanish', 'Türkish', 'Ukrainian', 'Vietnames', 'Arabic', 'Serbian', 'Croation', 'Thai'], // Possible choices
                'default': 'English' // Default value if user doesn't change it
            },
            'translator':
            {
                'label': 'Translation engine',
                'type': 'select',
                'options': ['gpt3.5', 'google','youdao','baidu','deepl','papago','offline'],
                'default': 'gpt3.5'
            },
            'size':
            {
                'label': 'Translation resolution',
                'type': 'select',
                'options': ['1024x1024', '1536x1536','2048x2048','2560x2560'],
                'default': '1536x1536'
            },
            'direction':
            {
                'label': 'Text direction',
                'type': 'select',
                'options': ['Automatic', 'Horizontal','Vertical'],
                'default': 'Automatic'
            },
        },
        'events':
        {
            'save': function () { // runs after values are saved
                if (tranlated_image_src != null) {
                    tranlated_image_src = null;
                }
                if (translated == true) {
                    untranlate_image();
                    tranlate_image();
                }
                this.close();
            }
        }
    });

let GMP
{
  // polyfill functions
  const GMPFunctionMap = {
    xmlHttpRequest: typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : undefined,
    setValue: typeof GM_setValue !== 'undefined' ? GM_setValue : undefined,
    getValue: typeof GM_getValue !== 'undefined' ? GM_getValue : undefined,
    deleteValue: typeof GM_deleteValue !== 'undefined' ? GM_deleteValue : undefined,
    addValueChangeListener: typeof GM_addValueChangeListener !== 'undefined' ? GM_addValueChangeListener : undefined,
    removeValueChangeListener: typeof GM_removeValueChangeListener !== 'undefined' ? GM_removeValueChangeListener : undefined,
  }
  const xmlHttpRequest = GM.xmlHttpRequest.bind(GM) || GMPFunctionMap.xmlHttpRequest
  GMP = new Proxy(GM, {
    get(target, prop) {
      if (prop === 'xmlHttpRequest') {
        return (context) => {
          return new Promise((resolve, reject) => {
            xmlHttpRequest({
              ...context,
              onload(event) {
                context.onload?.()
                resolve(event)
              },
              onerror(event) {
                context.onerror?.()
                reject(event)
              },
            })
          })
        }
      }
      if (prop in target) {
        const v = target[prop]
        return typeof v === 'function' ? v.bind(target) : v
      }
      if (prop in GMPFunctionMap && typeof GMPFunctionMap[prop] === 'function')
        return GMPFunctionMap[prop]

      console.error(`[Cotrans Manga Translator] GM.${prop} isn't supported in your userscript engine and it's required by this script. This may lead to unexpected behavior.`)
    },
  })
}

let image = document.getElementById('image');
let translated = false;
let tranlated_image_src;
let original_image_src;
const translating_idle_image = document.createElement("img");
translating_idle_image.src = 'data:image/png;base64,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';
translating_idle_image.style.position = 'fixed';
translating_idle_image.style.bottom = '50px';
translating_idle_image.style.left = '50px';
translating_idle_image.style.display = 'none';
document.body.appendChild(translating_idle_image);

function key_up(e) {
    if (e.code === 'F8') {
        if (translated == false)
            tranlate_image();
        else
            untranlate_image();
    }
    else if (e.code === 'F9') {
        gmc.open();
    }
}

function get_language() {
    switch(gmc.get('target_language')) {
        case 'English':
            return 'ENG';
        case 'Chinese (Simplified)':
            return 'CHS';
        case 'Chinese (Traditional)':
            return 'CHT';
        case 'Czech':
            return 'CSY';
        case 'Dutch':
            return 'NLD';
        case 'French':
            return 'FRA';
        case 'German':
            return 'DEU';
        case 'Hungarian':
            return 'HUN';
        case 'Italian':
            return 'ITA';
        case 'Japanese':
            return 'JPN';
        case 'Korean':
            return 'KOR';
        case 'Polish':
            return 'PLK';
        case 'Portuguese (Brazil)':
            return 'PTB';
        case 'Romanian':
            return 'ROM';
        case 'Russian':
            return 'RUS';
        case 'Spanish':
            return 'ESP';
        case 'Türkish':
            return 'TRK';
        case 'Ukrainian':
            return 'UKR';
        case 'Vietnames':
            return 'VIN';
        case 'Arabic':
            return 'ARA';
        case 'Serbian':
            return 'SRP';
        case 'Croation':
            return 'HRV';
        case 'Thai':
            return 'THA';
        default:
            return 'ENG';
    }
}

function get_translator() {
    return gmc.get('translator');
}

function get_size() {
    switch(gmc.get('size')) {
        case '1024x1024':
            return 'S';
        case '1536x1536':
            return 'M';
        case '2048x2048':
            return 'L';
        case '2560x2560':
            return 'X';
        default:
            return 'M';
    }
}

function get_direction() {
    switch(gmc.get('direction')) {
        case 'Automatic':
            return 'auto';
        case 'Horizontal':
            return 'h';
        case 'Vertical':
            return 'v';
        default:
            return 'auto';
    }
}

document.addEventListener('keyup', key_up, false);

async function pullTranslationStatusPolling(id) {
    while (true) {
        console.info('Polling translation result');
        const res = await GMP.xmlHttpRequest({
            method: "GET",
            url: `https://api.cotrans.touhou.ai/task/${id}/status/v1`
        });
        const msg = JSON.parse(res.responseText);

        if (msg.type === "result") {
            return msg.result;
        }

        await new Promise(resolve => setTimeout(resolve, 1e3));
    }
}

async function untranlate_image() {
    translated = false;
    image.src = original_image_src;
}

async function tranlate_image() {
    if (tranlated_image_src != null) {
        image.src = tranlated_image_src;
        translated = true;
        return;
    }

    console.info('Tranlating image');
    translating_idle_image.style.display = 'unset';

    const result_get_blob = await GMP.xmlHttpRequest({
        method: "GET",
        responseType: "blob",
        url: image.src,
        overrideMimeType: "text/plain; charset=x-user-defined"});
    let file_blob = result_get_blob.response;

    const form_data = new FormData();
    form_data.append("file", file_blob);
    form_data.append("target_language", get_language());
    form_data.append("detector", "default");
    form_data.append("direction", get_direction());
    form_data.append("translator", get_translator());
    form_data.append("size", get_size());
    form_data.append("retry", "false");
    const result = await GMP.xmlHttpRequest({
        method: "POST",
        url: "https://api.cotrans.touhou.ai/task/upload/v1",
        // @ts-expect-error FormData is supported
        data: form_data
    });

    let responseText = JSON.parse(result.responseText);
    let mask_url = responseText.result?.translation_mask;

    if (!mask_url) {
        const res = await pullTranslationStatusPolling(responseText.id);
    mask_url = res.translation_mask;
    }

    const c = document.createElement("canvas");
    var ctx=c.getContext("2d");
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    imageObj1.src = URL.createObjectURL(file_blob);
    imageObj1.onload = function() {
        c.width = imageObj1.width;
        c.height = imageObj1.height;
        ctx.drawImage(imageObj1, 0, 0);
        imageObj2.src = mask_url;
        imageObj2.crossOrigin = "anonymous";
        imageObj2.onload = function() {
            ctx.drawImage(imageObj2, 0, 0);
            original_image_src = image.src;
            tranlated_image_src = c.toDataURL("image/png");
            image.src = tranlated_image_src;
            translated = true;
            translating_idle_image.style.display = 'none';
        }
    };
}