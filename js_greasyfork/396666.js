// ==UserScript==
// @name         Chatwork daily report
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Make daily report chatwork quickly
// @author       KhuongDV
// @match        https://www.chatwork.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396666/Chatwork%20daily%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/396666/Chatwork%20daily%20report.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function getDate(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + '/' + mm + '/' + dd;
      return today
    }

    function getUsername(){
      let xpath = "/html/body/div[3]/div[3]/div[2]/div[1]/div[2]/div[2]/p/span[1]"
      var e = document.evaluate(xpath, document, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
      let v = e.snapshotItem(0)
      return v.textContent;
    }

    let idFront = 'chatwork-frontend';
    let idBack = 'chatwork-backend';
    let idMainLayout = 'chatwork-report-script';

    function renderTextPull(numberFront="xxx", numberBack="xxx"){
      let textFront = `[To:3723700] SonNH
[To:2512009] HangVTK
[To:2389500]VinhTT
Hi everyone, please help me review this pull, thanks you. (bow)(bow)(bow)
Frontend:
https://bitbucket.org/teamvfa/ohe_gps-frontend/pull-requests/${numberFront}
`;
        let textBack = `Backend:
https://bitbucket.org/teamvfa/ohe_gps-backend/pull-requests/${numberBack}
`
     if(numberBack){
        return textFront + textBack;
     }
        return textFront;
    }


    function renderTextReport(){
        let xpath = "/html/body/div[3]/div[3]/div[2]/div[1]/div[2]/div[2]/p/span[1]"
        let elements = document.evaluate(xpath, document, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        let userElement = elements.snapshotItem(0);
        let username = userElement.textContent;
    return `[To:3064446] NhiNTT
[To:3038938] TrucLDT
[To:382767] CuongCL
[info][title]Web Developer - ${username} - ${getDate()}[/title]
1. Today's tasks:
- #OHE_GPS_POC-xxx : Fix something. : 4h -> 0h
- #OHE_GPS_POC-xxx : Fix something. : 4h -> 0h
2. Problems:
3. Next day's Plan:
- #OHE_GPS_POC-xxx: Fix feedback. 8h -> 0
4. Today’s OT plan:
5. Interaction progress :
- Vẫn nằm trong kế hoạch.
[/info]`
    }

    function createMainLayout(){
        var layout = document.createElement('div');
        layout.id = idMainLayout
        layout.style.position = 'fixed'
        layout.style["border-radius"] = '3px';
        layout.style["box-shadow"] = "20px 20px 60px #bcc8b7, -20px -20px 60px #fefff7";
        layout.style.padding = "5px 10px";
        layout.style["z-index"] = '9999';
        layout.style["min-width"] = '365px';
        layout.style["min-height"] = '100px';
        layout.style.background = "linear-gradient(145deg, #c7d4c2, #ecfbe6)";
        layout.style.top = "82px";
        layout.style.right = "0";
        document.body.append(layout)
    }

    function createButton(name, top, right,id = 'buttton'){
        var button = document.createElement('BUTTON');
        var text = document.createTextNode(name);
        button.style.position = 'fixed'
        button.style.background = 'rgb(0, 106, 156)'
        button.style["border-radius"] = "4px"
        button.style.border = "none"
        button.style.padding = "5px 10px"
        button.style["min-width"] = "160px"
        button.style.color = "white"
        button.style["z-index"] = '9999'
        button.style.cursor = 'pointer'
        button.style.top = top
        button.style.right = right
        button.id = id
        let mainElement = document.getElementById(idMainLayout)
        mainElement.append(button)
        button.appendChild(text);
        return button;
    }
    function enableSendButton(){
        let button = "chatInput__submit"
        let elements = document.getElementsByClassName(button)
        let firstElement = elements[0];
        firstElement.classList = "sc-feryYK chatInput__submit detIFS chatInput__submit--enabled"
    }
    function sendPull (){
        let textBoxId = "_chatText"
        let textField = document.getElementById(textBoxId);
        textField.style.height = "200px";
        textField.style["min-height"] = "125px";
        let pullFront = document.getElementById(idFront);
        let pullBack = document.getElementById(idBack);
        textField.value = renderTextPull(pullFront.value, pullBack.value);
        enableSendButton()
        // reset value
        pullFront.value = '';
        pullBack.value = '';
    }
    function sendReport (){
        let textBoxId = "_chatText";
        let textField = document.getElementById(textBoxId);
        textField.style.height = "320px";
        textField.style["min-height"] = "125px";
        textField.value = renderTextReport();
        enableSendButton()
    }
    function createForm(id, placeholder, top = "100px", right){
        var element = document.createElement('input');
        element.style.position = 'fixed';
        element.style.top = top;
        element.style.right = right;
        element.style['text-align'] = "center";
        element.style.padding = "3px 10px";
        element.style.width = "60px";
        element.style["z-index"] = '9999'
        element.id = id;
        element.type = "number";
        element.placeholder = placeholder;
        document.body.append(element);
    }

    function makeFunWithAvatar(){
        var element = document.createElement('p');
        element.style.position = 'fixed';
        element.style.top = "143px";
        element.style.right = "193px";
        element.style.width = "152px";
        element.style.padding = "3px 10px";
        element.style["z-index"] = '9999';
        element.style.background = '#fff';
        element.style["border-width"] = '1px';
        element.textContent = "OHE GP Model PoC_Dev";
        document.body.append(element);
    }
    function init(){
        createMainLayout();
        let pull = createButton('Gửi pull lên chatwork', '100px', '20px', 'my-pull')
        let report = createButton('Gửi report lên chatwork', '140px', '20px', 'my-report')
        pull.addEventListener("click", sendPull);
        report.addEventListener("click", sendReport);
        createForm(idFront, 'Front', '100px', '192px');
        createForm(idBack, 'Back','100px', '282px');
        makeFunWithAvatar();
    }

    init()


})();