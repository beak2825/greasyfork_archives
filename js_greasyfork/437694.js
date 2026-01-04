// ==UserScript==
// @name Popup_BPM
// @id Popup_BPM
// @version 1.3
// @namespace Violentmonkey Scripts
// @grant none

// @match  *://logs.mango.local/*
// @match  *://redmine.mango.local/*
// @match  *://192.168.42.55:8081/*
// @match  *://creatio/*
// @match  *://creatio.corp.mango.ru/*
// @match  *://bpmprod01-msk.corp.mango.ru/*
// @match  *://bpmprod02-msk.corp.mango.ru/*
// @match  *://192.168.79.10/*

// @description  Ivanchenko D.V.
// @copyright      2021. Ivanchenko D.V.
// @downloadURL https://update.greasyfork.org/scripts/437694/Popup_BPM.user.js
// @updateURL https://update.greasyfork.org/scripts/437694/Popup_BPM.meta.js
// ==/UserScript==

//   *://creatio/*
//   *://creatio.corp.mango.ru/*
//   *://bpmprod01-msk.corp.mango.ru/*
//   *://bpmprod02-msk.corp.mango.ru/*
//   *://192.168.79.10/*
//---------------------------------------------------------------------------------------------------------------------------------------
/** прослушивает xhr запросы */
class XHRListener {
    static overrideSend(callback) {
        var oldSend, i;
        if (XMLHttpRequest.callbacks) {
            XMLHttpRequest.callbacks.push(callback);
        } else {
            XMLHttpRequest.callbacks = [callback];
            oldSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function () {
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    XMLHttpRequest.callbacks[i](this);
                }
                oldSend.apply(this, arguments);
            }
        }
    }

    /**
     * @param {any} urlPattern regexp для урла
     * @param {function} callback колбэк функция
     */
    static on(urlPattern, callback) {
        this.overrideSend((xhr) => {
            const temp = xhr.onload;
            xhr.onload = function () {
                if (temp) {
                    temp.apply(this, arguments);
                }
                if (!urlPattern.test(xhr.responseURL)) return;

                const url = xhr.responseURL;
                const text = xhr.responseText;

                let json;
                try {
                    json = JSON.parse(text);
                } catch (error) {

                }
                callback({
                    url,
                    text,
                    json
                });
            }
        });
    }
}
// GLOBAL

const currentEnvironment = "prod";
const booster_environment = {};
if (currentEnvironment === "prod") {
    booster_environment.MA_WORK_NODE_URL = "https://testairchat.mangotele.com:8039";
    booster_environment.bpmSet = ["creatio", "creatio.corp.mango.ru", "bpmprod01-msk.corp.mango.ru", "bpmprod02-msk.corp.mango.ru", "192.168.79.10", "redmine.mango.local"];
    booster_environment.lk = {
        base: "lk.mango-office.ru"
    };
    booster_environment.DA = 'https://testairchat.mangotele.com:2740'; //Базовая ссылка на анализатор дампов
} else if (currentEnvironment === "test") {
    booster_environment.MA_WORK_NODE_URL = "https://testairchat.mangotele.com:8038";
    booster_environment.bpmSet = ["192.168.10.11"];
    booster_environment.lk = {
        base: "issa7-234811-dev-ru.by.mgo.su"
    };
    booster_environment.DA = 'https://testairchat.mangotele.com:2739'; //Базовая ссылка на анализатор дампов
} else {
    booster_environment.MA_WORK_NODE_URL = "https://testairchat.mangotele.com:8038";
    booster_environment.bpmSet = ["192.168.10.11"];
    booster_environment.lk = {
        base: "issa7-234811-dev-ru.by.mgo.su"
    };
    booster_environment.DA = 'https://localhost:4200'; //Базовая ссылка на анализатор дампов
}
/** режим отладки */
const DEBUG = false;
const VERSION = '4.15.12';
const PM = 'http://192.168.20.129:8080';
const AP = 'http://192.168.42.55:8081';
const MM = 'http://mango-monitor.mango.local';
const MMAPI = 'http://voip-monitor.by.mgo.su:18080';
const LO = 'http://logs.mango.local';
const WA = 'http://webadmin.mango.local:8088';
const BACKEND = 'http://192.168.20.129:9090';
// TODO Не забывать указывать № перед релизом новой версии
//Получение popup окна с заявкой из RM или ОмиЭ
setTimeout(() => {
    let RM_number = $('#CasePageStnCaseNumberRMIntegerEdit-el').val();
    RM_numberfull = RM_number.replace(/\s/g, '');
    let check_length = new RegExp("[0-9]{6}$").test(RM_numberfull);
    let check_number = new RegExp("[2,3,4]+$").test(RM_numberfull);
    if (check_number, check_length) {
        Window_app_rm ();
        sendStatsOfBPM(' ', 'check_to_rm', location.href.split("/")[8], ' ', ' ');
      
        function sendStatsOfBPM(email, type, from, to, note) {
            const requestParams = {
                email: getUserEmailFromCasePage(),
                type: type,
                from: from,
                to: getLs(),
                note: note
            };

            function getLs() {
                const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
                const lsObject = document.querySelector(lsSelector);
                let ls = "";
                if (lsObject !== null) {
                    ls = lsObject.innerText;
                }
                return ls;
            }

            function getUserEmailFromCasePage() {
                try {
                    const userEmail = sysValues.CURRENT_USER.displayValue;
                    if (typeof userEmail === "string" && userEmail.length > 0) {
                        return userEmail;
                    }
                    throw new Error("not userEmail");
                } catch (err) {
                    return "stub";
                }
            }
            $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
        };
    } else {
        console.log('Нет заявки в RM')
    };
}, 5000);
 
function Window_app_rm() {
  let 
  dialog = document.createElement('dialog'),
  myP = document.createElement('p'),
  buttonClose = document.createElement('button'),
  buttonShow = document.createElement('button'),
  OpenRM = document.createElement('button'),
  container = document.createElement('div'),
  myPText = document.createElement('span');
  
  buttonShow.style.visibility ="hidden";
  container.style.height = "10px";
  container.style.width = "20px";
  container.style.position = "fixed";
  container.style.top = "18%";
  container.style.left = "50%";
  dialog.style = "background-color: rgba(255, 255, 255, 1); border: 5px solid black;  border-radius: 15px;";
  myP.style ="margin-left: auto; margin-right: auto; width: 40em; height: 12em;";
  myPText.innerHTML="ВНИМАНИЕ! <br> ТАКАЯ ЗАЯВКА УЖЕ ЕСТЬ В REDMINE!"; 
  myPText.style = "font-size: 30px; color: red; font-weight: 600; text-align: center;";
  OpenRM.style = "color: #090909; padding: 0.7em 1.7em;  font-size: 16px; border-radius: 0.2em;  background: #e8e8e8; border: 1px solid #e8e8e8; box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff; position: absolute; left: 63%; top: 70%;";
  buttonClose.style ="color: #090909; padding: 0.7em 1.7em;  font-size: 10px; border-radius: 0.2em;  background: #e8e8e8; border: 1px solid #e8e8e8; box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;";
  OpenRM.appendChild(document.createTextNode("Открыть RM"));
  OpenRM.id = ('showRM');
  buttonClose.id = ('close');
  buttonClose.appendChild(document.createTextNode("закрыть"));
  buttonShow.appendChild(document.createTextNode("открыть RM"));
  buttonShow.id = ('show');
  
  
  dialog.appendChild(myP);
  myP.appendChild(myPText);
  dialog.appendChild(buttonClose);
  container.id = ('dialog-container');
  dialog.appendChild(OpenRM);
  container.appendChild(buttonShow);
  container.appendChild(dialog);
  
  
	document.body.appendChild( container );
  
setTimeout(() => {
  document.getElementById('show').onclick(); 
  }, 4000);
 
  buttonShow.onclick = function() {
    dialog.show();
  };
   OpenRM.onclick = function (){
    let RM_number = $('#CasePageStnCaseNumberRMIntegerEdit-el').val();
    let RM_numberfull = RM_number.replace(/\s/g, '');
    let win = window.open(`http://redmine.mango.local/issues/${RM_numberfull}`, '_blank');
          win.focus();
     
       sendStatsOfBPM(' ', 'link_to_rm', location.href.split("/")[8], ' ', ' ');
        
        function sendStatsOfBPM(email, type, from, to, note) {
            const requestParams = {
                email: getUserEmailFromCasePage(),
                type: type,
                from: from,
                to: getLs(),
                note: note
            };

            function getLs() {
                const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
                const lsObject = document.querySelector(lsSelector);
                let ls = "";
                if (lsObject !== null) {
                    ls = lsObject.innerText;
                }
                return ls;
            }

            function getUserEmailFromCasePage() {
                try {
                    const userEmail = sysValues.CURRENT_USER.displayValue;
                    if (typeof userEmail === "string" && userEmail.length > 0) {
                        return userEmail;
                    }
                    throw new Error("not userEmail");
                } catch (err) {
                    return "stub";
                }
            }
            $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
        };
  }  
  buttonClose.onclick = function() {
    dialog.close();
  };
}
//----------------------------------------------------------------------------------------------------------
setTimeout(() => {
    let Omi_number = $('#CasePageStnCaseNumberOMIntegerEdit-el').val();
    Omi_number_full = Omi_number.replace(/\s/g, '');
    let check_length = new RegExp("[0-9]{7}$").test(Omi_number_full);
    let check_number = new RegExp("[1]+$").test(Omi_number_full);
    if (check_number, check_length) {
       Window_app_omi();
        sendStatsOfBPM(' ', 'check_to_omi', location.href.split("/")[8], ' ', ' ');

        function sendStatsOfBPM(email, type, from, to, note) {
            const requestParams = {
                email: getUserEmailFromCasePage(),
                type: type,
                from: from,
                to: getLs(),
                note: note
            };

            function getLs() {
                const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
                const lsObject = document.querySelector(lsSelector);
                let ls = "";
                if (lsObject !== null) {
                    ls = lsObject.innerText;
                }
                return ls;
            }

            function getUserEmailFromCasePage() {
                try {
                    const userEmail = sysValues.CURRENT_USER.displayValue;
                    if (typeof userEmail === "string" && userEmail.length > 0) {
                        return userEmail;
                    }
                    throw new Error("not userEmail");
                } catch (err) {
                    return "stub";
                }
            }
            $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
        };
    } else {
        console.log('Нет заявки в ОМиЭ')
    };
}, 5000);

function Window_app_omi() {
  let 
  dialog = document.createElement('dialog'),
  myP = document.createElement('p'),
  buttonClose = document.createElement('button'),
  buttonShow = document.createElement('button'),
  OpenRM = document.createElement('button'),
  container = document.createElement('div'),
  myPText = document.createElement('span');
  
  buttonShow.style.visibility ="hidden";
  container.style.height = "10px";
  container.style.width = "20px";
  container.style.position = "fixed";
  container.style.top = "18%";
  container.style.left = "50%";
  dialog.style = "background-color: rgba(255, 255, 255, 1); border: 5px solid black;  border-radius: 15px;";
  myP.style ="margin-left: auto; margin-right: auto; width: 28em; height: 15em;";
  myPText.innerHTML="ВНИМАНИЕ! <br> ЗАЯВКА ПЕРЕДАНА В ОМиЭ!"; 
  myPText.style = "font-size: 30px; color: red; font-weight: 600; text-align: center;";
  buttonClose.style ="color: #090909; padding: 0.7em 1.7em;  font-size: 10px; border-radius: 0.2em;  background: #e8e8e8; border: 1px solid #e8e8e8; box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;position: absolute; left: 40%; top: 80%";
  buttonClose.id = ('close');
  buttonClose.appendChild(document.createTextNode("закрыть"));
  buttonShow.appendChild(document.createTextNode("открыть"));
  buttonShow.id = ('show');
  
  dialog.appendChild(myP);
  myP.appendChild(myPText);
  dialog.appendChild(buttonClose);
  container.id = ('dialog-container');
  container.appendChild(buttonShow);
  container.appendChild(dialog);
  
  
	document.body.appendChild( container );
  
setTimeout(() => {
  document.getElementById('show').onclick(); 
  }, 4000);
 
  buttonShow.onclick = function() {
    dialog.show();
  };
  
  buttonClose.onclick = function() {
    dialog.close();
  };
}

// BPM
class BPMToLkButton {
  constructor() {
    this.init();
  }
  init() {
    const MA_INNER_BUTTON_HTML = `<span style="font-size:10px">Перейти в ЛК</span>`;

    getParameters()
      .then(addButton)
      .catch((error) => {
        console.error(error);
      });

    function getParameters() {
      return new Promise((resolve) => {
        const lklabelSelector = `label[id^='CasePageStnAcc']`;
        let tryCount = 0;

        const changeLkLabelinterval = setInterval(() => {
          try {
            const labelObject = document.querySelector(lklabelSelector);

            if (labelObject) {
              clearInterval(changeLkLabelinterval);
              return resolve({ labelObject: labelObject });
            } else {
              tryCount++;
            }

            if (tryCount >= 6) {
              clearInterval(changeLkLabelinterval);
            }
          } catch (error) {
            console.error("error: ", error);
            clearInterval(changeLkLabelinterval);
          }
        }, 1200);
      });
    }

    function addButton(params) {
      const button = document.createElement("button");
      button.innerHTML = MA_INNER_BUTTON_HTML;
      button.onclick = function () {
        try {
          openLk();
        } catch (error) {
          console.error("error: ", error);
        }
      };

      params.labelObject.after(button);
    }

    function openLk() {
      const url = `${booster_environment.MA_WORK_NODE_URL}/wa/lk`;

      const ls = getLs();

      if (ls.length > 0) {
        fetch(url)
          .then((data) =>
            data.json().then((json) => {
              try {
                if (json.data.result === true) {
                  openPage(json.data, ls);
                }
              } catch (error) {
                console.error("error: ", error);
              }
            })
          )
          .catch((error) => {
            console.error("error: ", error);
          });
      }

      function getLs() {
        const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
        const lsObject = document.querySelector(lsSelector);
        let ls = "";

        if (lsObject !== null) {
          ls = lsObject.innerText;
        }

        return ls;
      }

      function openPage(data, ls) {
        var form = document.createElement("form");
        form.target = "_blank";
        form.method = "POST";
        form.action = data["ics-url"];
        form.style.display = "none";

        // fscontrol
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "fscontrol";
        input.value = ls;
        form.appendChild(input);

        // auth-type
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "auth-type";
        input.value = "webadmin";
        form.appendChild(input);

        // ticket
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "ticket";
        input.value = data["ticket"];
        form.appendChild(input);

        // timezoneoffset
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "timezoneoffset";
        input.value = data["timezone-offset"];
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
    
        BPMCommon.sendStats("bpm_to_lk_ork", location.href.split("/")[8], ls, " ");
      }
    }
  }
}

class BPMCommon {
  static sendStats(type, from, to, note) {
    const requestParams = {
      email: BPMCommon.getUserEmailFromCasePage(),
      type: type,
      from: from,
      to: to,
      note: note
    };

    $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
  }

  static getUserEmailFromCasePage() {
    try {
      const userEmail = sysValues.CURRENT_USER.displayValue;

      if (typeof userEmail === "string" && userEmail.length > 0) {
        return userEmail;
      }
      throw new Error("not userEmail");
    } catch (err) {
      return "stub";
    }
  }

  static getCookie(name) {
    try {
      let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
      return matches ? decodeURIComponent(matches[1]) : "";
    } catch (err) {
      return "";
    }
  }
}

function bpmModule() {
  let prevHash = null;

  XHRListener.on(/.*/, (e) => {
    const currentHash = location.hash;

    if (prevHash !== currentHash) {
      prevHash = currentHash;

      if (/CardModuleV2\/CasePage\/edit\//i.test(prevHash)) {
        new BPMToLkButton();
      }
      if (/CardModuleV2\/Account1Page\/edit\//i.test(prevHash)) {
         new BPMToLkButton();
        
      }
    }
  });
}
function getJquery(callback, isCallBackIndepent){
        if (typeof jQuery == 'undefined') {
            var jq = document.createElement('script');
            jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js";
            document.head.appendChild(jq);
            jq.onload = callback;
            return;
        }

        if (isCallBackIndepent){
            callback();
        }
}

if (window.location.host.includes(booster_environment.lk.base)) {
  const self = this;

  const callback = function () {
    $(document).ready(function () {
      setTimeout(lkModule.bind(self), 300);
    });
  };

  getJquery(callback, true);
}

if (isRightBpm()) {
  $(document).ready(function () {
    setTimeout(bpmModule, 300);
  });
}

function isRightBpm() {
  for (let value of booster_environment.bpmSet) {
    if (window.location.host.includes(value)) {
      return true;
    }
  }

  return false;
}
