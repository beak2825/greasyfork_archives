// ==UserScript==
// @name        WhatsApp Web Notification Sound Changer
// @description Adds a settings menu to change WhatsApp Web notification sound/volume
// @version     1.2
// @license     GPL-3.0-or-later
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @match       *://web.whatsapp.com/*
// @run-at      document-start
// @namespace https://greasyfork.org/users/751814
// @downloadURL https://update.greasyfork.org/scripts/424035/WhatsApp%20Web%20Notification%20Sound%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/424035/WhatsApp%20Web%20Notification%20Sound%20Changer.meta.js
// ==/UserScript==

var config_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAE4ElEQVR4nO2cL1BcSRCHP7ECgUAgIhAIxIqIiBUnUxWBiDixAoGIiEBEIBAIBOLEiRMREREIRAQCgYhAnFhxAoFAIBARiBOICARixYp3otkUUI/lbU/3zLx381V1oZb69fzt6el5UCgUCoVCoVAoFAqFwgOWgQ3gg9KGwGJ01R3hDTABqkC7A1bjSu8Gh4Q3/tT+iqy9E5xj1wHfI2vvBLfYdcBVZO2tZxm7xq+QvaQwB79h2wEVsBbVg5aziX0HrEf1oOX8gX0HfIrqQcv5hn0HfI7qQcs5w74DSig6Bz+x74DOh6I9YA85wX4AFpT/Y4h941dIKPq7yjPJJ20hvm0r/4c7X3ns8C3wBXjd4Lc9pNN+4NP4T2fCsKFPg3u/7p78j72Gv4/GS4mzM56fFQNs0w5N7Qzo1+iZjvZZmsZkluAb0czp6azoI6P+T2wyniHL0u69D8+N9ufsOLzZbNCu2TfK33mYVsvb8OYLY4E463audoHM5GTs1Yj6v9lWcCsqeUXz9bLL9hNYCmxLFYcKsV216GmOgZHwrtiE+pDWDY9cTdvtNKhF58AjV98Vex/Qro1YAP7NwNEbJAQ8Bf4GLvFJ4M1rP3AOS/cTOneGJMJWZ+jrI6HxZUKd05O1OUtIDiS2QxfoTpxD0hwSb3GqxnsX2ZGHeRotPSREjN0Jg0DdtSwSb/2/w3ZD+0i8pN8VjvvAGrIkeI98jwqGj866KySFveqg/RGL+J6CPW+cPJejA3S3gGq2sJ/WI2fNPew35jFy2ZSEAbb7gsvm9QTLO+dr5DYwKcvIYSjUmZhlIxbnhFMSZUHr6BFezbYZUW/IPcYEOZBmyRf0TsV8StRX6qzI/LHHMTqnzhNo1eaOvibQ2pgR+a//U7T7QDbVEHVoQ7yDBFq1gcMogdbGXNOeaX2q1Jp1B2jTFCct0pp1lbV2Wp8l0KotxjpMoLUx2ocVY+LmUVaVOiuknDJLdgnLDWlLxzVsB+gcI5nVbFhE1nCtQ1M7iqjZoqojevazjtfYZRcnxHlK+tZIb4UcIFciaK5lE/vSxBjRkPWF0g1yXRuNHvqcTxPbcNS+66R5Auw46v7FCv5VcXf43Au8x/9e+BjHpOIC+pOuZlpbdsI68Sq5R4a6H+H1enHWTLBYjraJ/wzK5ZYsJIceYifooqMB+uxs6MBxW4aOEjhUISP4CDmszYq9F5Ho7HsinRXOT1hXSFOe+NDGSCBwgmRRD5AGPyfti8sK2SPdD2f7iZ3M2TxD6F/EjIbaZKOQRp2XDScn2moTEtQH/WMgvCuW5KLe6sOqbbdbpDgtCQcNBHbdkn6+Zhnb73u2zVzfAjRlB534nJYvrZYsvsQ4T8n3BMkYriOFrRY3aaH2GTlBD5kvdZFVdcQ6s8VeI7n4VzW/3SDNE9Mr6h//9ZH6z1maYt3ezcXT/MvD0f4SS0h1dYw0xw2ycb6UMlhABkfdrMiyQHf6dGnE86P9JZaQsg+Phr9DPt6qydVMZ8Xo/m/yjdcbjw36IqoHLecK+w7Iuqo5Nzzy+dlWtOWIx3PSZJ8WayOfsO+AqLU7beelc4XGklWwtZE1bBt/HFd+N7AMRS8ja+8ElqFoihc4rccyFC0hqAKrD0RlmThrC2+QvNK+0nYojV8oFAqFQqFQKBQKhYf8B5iWbh8TtODQAAAAAElFTkSuQmCC";
const sleep = ms => new Promise(res => setTimeout(res, ms));

function doStore()
{
  let c = `
    window.notificationAudio.volume = ${GM_config.get('volume')/100}
    if(${GM_config.get('useSound')}){
      window.notificationAudio.src = "${GM_config.get('sound')}"
    } else {
      window.notificationAudio.src = window.defaultNotificationAudioPath
    }`; 
  unsafeWindow.eval(c);
}

GM_config.init(
{
  'id': 'wa_web_cfg',
  'title': 'Notification Settings',
  'fields': 
  {
    'volume': {
      'label': 'Notification Volume Percent',
      'type': 'int',
      'min': 0,
      'max': 100,
      'default': 100
    },
    'sound': {
      'label': 'Notification Sound File',
      'type': 'fileupload'
    },
    'useSound': {
      'label': 'Use custom sound',
      'type': 'checkbox',
      'default': false
    },
    'playButton': {
      'label': 'Play notification sound',
      'type': 'button',
      'click': function() {
        unsafeWindow.notificationAudio.play();
      }
    }
  },
  'events':
  {
    'save': doStore
  },
  'types':
  {
    'fileupload': {
      'default': null,
        toNode: function(configId) {
          var field = this.settings,
              id = this.id,
              create = this.create,
              retNode = create('div', { className: 'config_var',
                id: configId + '_' + id + '_var',
                title: field.title || '' });

          retNode.appendChild(create('label', {
            innerHTML: field.label,
            id: configId + '_' + id + '_field_label',
            for: configId + '_field_' + id,
            className: 'field_label'
          }));
          
          var props = {
            id: configId + '_field_' + id,
            type: 'file'
          };
          let input = create('input', props);
          input.onchange = function() {
            let reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function() {
              input.setAttribute('datauri', reader.result);
            };
          };
          
          retNode.appendChild(input);
          return retNode;
        },
        toValue: function() {
          var rval = null;
          if (this.wrapper) {
            var input = this.wrapper.getElementsByTagName('input')[0];
            rval = input.getAttribute('datauri');
          }
          return rval;
        },
        reset: function() {
          if (this.wrapper) {
            var input = this.wrapper.getElementsByTagName('input')[0];
            input.value = '';
          }
        }
    }
  }
});

document.addEventListener('readystatechange', async (event) => {
  if(document.readyState === 'interactive') {
    unsafeWindow.eval(`
      window.Audio = class extends Audio
      {
        constructor(x){
        
        super(x);
          if(x != undefined && x.includes('notification')) { 
            window.notificationAudio = this;
            window.defaultNotificationAudioPath = x;
          }
        }
      };
`   );
  }
  if(document.readyState === 'complete') {
    var headers = [];
    
    while (headers.length < 1) {
      headers = document.querySelectorAll('header');
      await sleep(200);
    }
    var config = document.createElement('img');
    config.src = config_image;
    config.style.height = "75%";
    config.style.cursor = "pointer";
    config.onclick = ()=>GM_config.open();
    headers[0].appendChild(config);
    doStore();
  }
});

