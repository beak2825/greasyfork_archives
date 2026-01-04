// ==UserScript==
// @name        Pinterest Augmentation
// @description Make Pinterest work
// @namespace   exkss
// @author	    exkss
// @include     http*://ru.pinterest.com/*
// @include     http*://www.pinterest.ru/*
// @version     1.0.2
// @grant       GM.xmlHttpRequest
// @grant    	GM.openInTab
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.listValues 
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/372802/Pinterest%20Augmentation.user.js
// @updateURL https://update.greasyfork.org/scripts/372802/Pinterest%20Augmentation.meta.js
// ==/UserScript==

function formatParams(params) {
    return "?" + Object
        .keys(params)
        .map(function (key) {
            return key + "=" + encodeURIComponent(params[key])
        })
        .join("&")
}



function GM_addStyle(cssString) {								// GM3
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssString;
    document.querySelector('head').appendChild(style);
}

class Construct {
    constructor(options) {
        this.options = options;
        this.rootElement = null;
        this.parsedHTML = null;
        this.CSSdone = false;
        this.templateCSS = {};
        this.empty = true;
        this.visible = false;
    }

    render() {
        if (!this.CSSdone && this.options.element.CSS) { GM_addStyle(this.options.element.CSS); this.CSSdone = true; }

        this.parsedHTML = (new DOMParser()).parseFromString(this.options.element.HTML, "text/html");


        if (this.options.element.objectProperties) {
            for (var el of Object.keys(this.options.element.objectProperties)) {
                for (var eventType of Object.keys(this.options.element.objectProperties[el])) {
                    var actEl = this.parsedHTML.querySelector('#' + el);
                    if (actEl) {
                        attributeValue = this.options.element.objectProperties[el][eventType];
                        actEl[eventType] = attributeValue;
                    } else {
                        console.log("CONSTRUCTOR ERROR: " + this.options.name + ", No such element: " + el + ", eventType: " + eventType);
                    }
                }
            }
        }

        this.rootElement = this.parsedHTML.firstChild.lastChild.firstChild;


        if (this.options.element.globals) {
            for (var elName of this.options.element.globals) {
                var el = this.rootElement.querySelector('#' + elName);
                if (el) {
                    this.options.element[options.element.globals[elName]] = el;
                } else {
                    console.log("CONSTRUCTOR ERROR: " + this.options.name + ", No such element: " + elName + ", Global: " + this.options.element.globals[elName]);
                }
            }
        }
        this.empty = false;
    }
    async drawTemplates() {
        if (!this.options.element.templates) { return false; }
        var templates = this.options.element.templates;
        for (var template of Object.keys(templates)) {
            var tempData;
            if (templates[template].dataProvider.constructor.name === 'AsyncFunction') {
                tempData = await templates[template].dataProvider();
            } else {
                tempData = templates[template].dataProvider();
            }
            if (!this.templateCSS[template] && templates[template].CSS) {
                GM_addStyle(templates[template].CSS);
                this.templateCSS[template] = true;
            }

            var Parser = new DOMParser();

            var target = this.getElement(templates[template].targetName);
            if (!target || target === null) {
                console.log("TEMPLATE CONSTRUCTOR ERROR: " + template +
                    ", No such target: " + templates[template].targetName);
                console.log(this.rootElement)
            }

            while (target.firstChild) { target.removeChild(target.firstChild) }
            //TEMPLATES
            for (var valueDict of tempData) {
                var templateDOM =
                    (Parser)
                        .parseFromString(templates[template].HTML, "text/html")
                        .firstChild.lastChild.firstChild;

                for (var element of Object.keys(templates[template].dataElements)) {
                    for (var value of Object.keys(templates[template].dataElements[element])) {
                        for (var property of templates[template].dataElements[element][value]) {
                            var actEl = templateDOM.querySelector('.' + element) || templateDOM.className === element ? templateDOM : null;
                            if (actEl) {
                                actEl[property] = actEl[property] + valueDict[value];
                            } else {
                                console.log("TEMPLATE CONSTRUCTOR ERROR: " + template + ", No such element: " + element + ", value: " + value + " in ", templateDOM);
                            }
                        }
                    }
                }
                //TEMPLATES ATTRIBUTES
                if (templates[template].objectProperties) {
                    for (var el of Object.keys(templates[template].objectProperties)) {
                        for (var eventType of Object.keys(templates[template].objectProperties[el])) {
                            var actEl = templateDOM.querySelector('.' + el) || templateDOM.className === element ? templateDOM : null;
                            if (actEl) {
                                var attributeValue = templates[template].objectProperties[el][eventType];
                                actEl[eventType] = attributeValue;
                            } else {
                                console.log("TEMPLATE CONSTRUCTOR ERROR: " + template + ", No such element: " + el + ", eventType: " + eventType + " in ", templateDOM);
                            }
                        }
                    }
                }
                if (templates[template].altPlaceFunction) {
                    templates[template].altPlaceFunction(templateDOM, target)
                } else {
                    target.appendChild(templateDOM);
                }
            }
        }
    }
    erase() {
        if (this.rootElement) {
            this.rootElement.parentNode.removeChild(this.rootElement);
            this.rootElement = null;
        };
    }
    eraseTemplates(name) {
        if (this.options.element.templates[name]) {
            var target = this.rootElement.getElement(this.options.element.templates[name].targetName);
            if (target) {
                while (target.firstChild) {
                    target.removeChild(target.firstChild);
                }
            }
        };
    }
    clear() {
        if (this.rootElement) {
            while (this.rootElement.firstChild) {
                this.rootElement.removeChild(this.rootElement.firstChild);
            }
            this.empty = true;
        };
    }
    getRoot() {
        if (!this.rootElement || this.empty) this.render();
        return this.rootElement;
    }
    getElement(id) {
        if (!this.rootElement) render();
        var target = this.rootElement.querySelector("#" + id);
        if (!target || target === null) { if (this.rootElement.id === id) return this.rootElement; }
        return target;
    }
    getClass(className) {
        if (!this.rootElement) render();
        return this.rootElement.querySelectorAll('.' + className);
    }
    getTag(tagName) {
        if (!this.rootElement) render();
        return this.rootElement.querySelectorAll(tagName);
    }
    toClass(className, action) {
        for (var element of getClass(className)) {
            action(element);
        }
    }
    toTag(tagName, action) {
        for (var element of getTag(tagName)) {
            action(element);
        }
    }
};


var BoardsPanel = new function () {
    this.boardsData = null
    this.init = async function () {
        console.log("init");
        
        var reqData = {
            source_url: unsafeWindow.location.pathname,
            data: {
                "options": {
                    "isPrefetch": false,
                    "pin_id": Object.values(unsafeWindow.__INITIAL_STATE__.resources.data.PinPageResource)[0].data,
                    "field_set_key": "board_picker",
                    "shortlist_suggestions": 2
                }, "context": {}
            },
            "_": (new Date()).getTime()
        };
        console.log("sending");
        
        GM.xmlHttpRequest({
            method: 'GET',
            url: '/resource/BoardPickerBoardsResource/get/',
            data: formatParams(reqData),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/javascript, */*, q=0.01',
                'Referer': unsafeWindow.location.origin,
                //'X-APP-VERSION': unsafeWindow.P.pubSub.instance.channels.site.messages.appVersion,
                //'X-CSRFToken': unsafeWindow.P.context.instance.cookies.csrftoken,
                'X-Pinterest-AppState': 'active',
                'X-Requested-With': 'XMLHttpRequest'
            },

            onload: function (r) {
                var resData = JSON.parse(r.response);
                BoardsPanel.boardsData = resData.resource_data_cache[0].data;
                document.body.appendChild(BoardsPanel.control.getRoot());
                BoardsPanel.control.drawTemplates();

            },
            onerror: function (r) {
                console.log("ERROR", r);
                return false;
            }
        });
        console.log("request sent");
    }
    this.HTML = `
        <div id="BoardsPanelDiv">
            <div id="ownedBoardsDiv">
            </div>
            <div id="collBoardsDiv">
            </div>
        </div>

    `
    this.CSS = `
        #BoardsPanelDiv {

            background-color: var(--bgheader) !important;
            box-shadow: 0 5px 8px rgba(0, 0, 0, 0.33) !important;
            color: var(--text1) !important;

            position: fixed;
            top: 15vh;
            text-align: left;
            max-height: 75vh;
            min-height: 25vh;
            border-radius: 0 15px 15px 0px;
            background: whitesmoke;
            display: block;
            transition: left 0.2s;
            transition-delay: 0.5s;
            left: -290px;
            width: 300px;
            overflow-x: scroll;
        }

        #BoardsPanelDiv:hover{
            transition-delay: 0s;
            left: 0px;
        }

        #tagsContainer{
            position: relative;
            text-align: left;
            overflow-y: scroll;
            max-height: 100%;
            margin: 10px 20px 10px 10px;
            display: inline-block;
            width: 100%;
        }

        .buttonDone{
            background: #4485c5 !important;
        }
        .buttonWait{
            background: #bdb020 !important;
        }
        .buttonError{
            background: #000 !important;
        }






    `
    this.objectProperties = {
        /*
        subsRefreshAllButton: {
            onclick: function (e) {
    
            }
        }
        */
    }
    this.templates = {
        OwnBoardButton: {
            targetName: "ownedBoardsDiv",
            HTML: `
                    <input value="" type="button" class="BoardButton" id="BoardButton_">
                `,
            CSS: `
                .BoardButton {

                    border: none;
                    padding: 2px 15px 4px 15px;
                    margin: 5px;
                    text-decoration: none;
                    background: #bd081c;
                    color: #ffff;
                    font-family: sans-serif;
                    font-size: 1rem;
                    line-height: 1;
                    cursor: pointer;
                    text-align: center;
                    transition: background 250ms ease-in-out, transform 150ms ease;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    border-radius: 5px;
                    font-family: Segoe UI Symbol;
                    line-height: inherit;      
                    font-weight: 700;          
                }
                
                .BoardButton:hover,
                .BoardButton:focus {
                    background: #ad081b;
                    outline: 0;
                }

                .BoardButton:active {
                    transform: scale(0.90);
                }





            `,
            /*altPlaceFunction: function (el, target) {
    
            },*/
            dataElements: {
                BoardButton: {
                    name: ['value'],
                    id: ['id']
                }
            },
            dataProvider: async function () {
                var data = [];
                var userName = unsafeWindow["__INITIAL_STATE__"].viewer.username;
                var boards = BoardsPanel.boardsData.all_boards;
                for (var board of boards) {
                    if (board.owner.username === userName) {
                        let newBoardData = board;
                        if (newBoardData.privacy === "secret") { newBoardData.name = "🔒 " + newBoardData.name }
                        if (newBoardData.is_collaborative === true) { newBoardData.name = " " + newBoardData.name }
                        if (newBoardData.is_collaborative !== true) {
                            data.push(newBoardData);
                        }
                    }
                }

                function compare(a, b) {
                    if (a.name.toLowerCase() < b.name.toLowerCase())
                        return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase())
                        return 1;
                    return 0;
                }

                data.sort(compare);

                return data;
            },
            objectProperties: {
                BoardButton: {
                    onclick: function (e) {
                        BoardsPanel.boardButtonHandler(e)
                    }
                }
            }
        },
        CollBoardButton: {
            targetName: "collBoardsDiv",
            HTML: `
                    <input value="" type="button" class="BoardButton" id="BoardButton_">
                `,
            CSS: `
                .BoardButton {
                    border: none;
                    padding: 2px 15px 4px 15px;
                    margin: 5px;
                    text-decoration: none;
                    background: #bd081c;
                    color: #ffff;
                    font-family: sans-serif;
                    font-size: 1rem;
                    line-height: 1;
                    cursor: pointer;
                    text-align: center;
                    transition: background 250ms ease-in-out, transform 150ms ease;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    border-radius: 5px;
                    font-family: Segoe UI Symbol;
                    line-height: inherit;      
                    font-weight: 700;          
                }
                
                .BoardButton:hover,
                .BoardButton:focus {
                    background: #ad081b;
                    outline: 0;
                }

                .BoardButton:active {
                    transform: scale(0.90);
                }





            `,
            /*altPlaceFunction: function (el, target) {
    
            },*/
            dataElements: {
                BoardButton: {
                    name: ['value'],
                    id: ['id']
                }
            },
            dataProvider: async function () {
                var data = [];
                var userName = unsafeWindow["__INITIAL_STATE__"].viewer.username;
                var boards = unsafeWindow["__INITIAL_STATE__"].boards.content
                for (var boardId of Object.keys(unsafeWindow["__INITIAL_STATE__"].boards.content)) {
                    if (boards[boardId].owner.username !== userName) {
                        let newBoardData = boards[boardId]
                        if (newBoardData.privacy === "secret") { newBoardData.name = "🔒 " + newBoardData.name }
                        if (newBoardData.is_collaborative === true) { newBoardData.name = " " + newBoardData.name }
                        data.push(newBoardData);
                    }
                }

                function compare(a, b) {
                    if (a.name.toLowerCase() < b.name.toLowerCase())
                        return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase())
                        return 1;
                    return 0;
                }

                data.sort(compare);

                return data;
            },
            objectProperties: {
                BoardButton: {
                    onclick: function (e) {
                        BoardsPanel.boardButtonHandler(e)
                    }
                }
            }
        }
    }

    this.control = new Construct({
        name: "Boards Panel",
        element: this
    });


    this.boardButtonHandler = function (e) {
        var button = e.target
        if (button.classList.contains("buttonWait")) { return; }
        button.classList.toggle("buttonWait");

        var boardId = button.id.split("_")[1];
        var pinData = Object.values(unsafeWindow.__INITIAL_STATE__.resources.data.PinPageResource)[0].data

        data = {
            options: {
                description: pinData.description,
                link: pinData.link,
                title: pinData.title,
                clientTrackingParams: "",
                board_id: boardId,
                pin_id: pinData.id,
                is_buyable_pin: pinData.buyable_product,
                is_removable: false
            },
            context: {}
        }
        console.log("START: pinning to board " + boardId);
        if (true) {
            console.log(("data=" + JSON.stringify(data) + "&source_url=" + unsafeWindow.location.pathname).replace(/&/g, "%26"));
            console.log(("data=" + JSON.stringify(data) + "&source_url=" + unsafeWindow.location.pathname));
            console.log(encodeURIComponent("data=" + JSON.stringify(data) + "&source_url=" + unsafeWindow.location.pathname));




            var request = GM.xmlHttpRequest({
                method: 'POST',
                url: '/resource/RepinResource/create/',
                data: "data=" + encodeURIComponent(JSON.stringify(data)) + "&source_url=" + unsafeWindow.location.pathname,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json, text/javascript, */*, q=0.01',
                    'Referer': unsafeWindow.location.origin,
                    'X-APP-VERSION': unsafeWindow.P.startArgs.initialPageContext.appVersion,
                    'X-CSRFToken': unsafeWindow.P.startArgs.context.cookies.csrftoken,
                    'X-Pinterest-AppState': 'active',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                onload: function (r) {
                    var res;
                    if (r.response !== "") {
                        res = JSON.parse(r.response);
                    }

                    if (r.response !== "" && r.status === 200) {
                        console.log("SUCCESS: pin to board " + boardId);
                        button.classList.toggle("buttonWait");
                        button.classList.toggle("buttonDone");
                    } else {
                        console.log("ERROR: pin to board " + boardId + " failed.\n", r);
                        button.classList.toggle("buttonWait");
                        button.classList.toggle("buttonError");
                    }

                },
                onerror: function (r) {
                    console.log("ERROR: pin to board " + boardId + " failed.\n", r);
                    button.classList.toggle("buttonWait");
                    button.classList.toggle("buttonError");
                }
            });
        } else {
            var url = '/resource/RepinResource/create/';
            var params = "data=" + JSON.stringify(data) + "&source_url=" + unsafeWindow.location.pathname;
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.setRequestHeader('Accept', 'application/json, text/javascript, */*, q=0.01');
            http.setRequestHeader('X-APP-VERSION', unsafeWindow.P.pubSub.instance.channels.site.messages.appVersion);
            http.setRequestHeader('X-CSRFToken', unsafeWindow.P.context.instance.cookies.csrftoken);
            http.setRequestHeader('X-Pinterest-AppState', 'active');
            http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            http.onerror = function () {
                console.log("ERROR: pin to board " + boardId + " failed");

                button.classList.toggle("buttonWait");
                button.classList.toggle("buttonError");
            }

            http.onload = function (e) {
                if (http.readyState == 4) {
                    if (http.status == 200) {
                        console.log("SUCCESS: pin to board " + boardId);
                        button.classList.toggle("buttonWait");
                        button.classList.toggle("buttonDone");
                    } else {
                        http.onerror(e);
                    }
                }
            }
        }

    }



};


var initCycle = setInterval(initCheck, 100);

function initCheck() {
    if (!unsafeWindow["__INITIAL_STATE__"]) { return; }
    else {
        clearInterval(initCycle);
        console.log("ready");
        BoardsPanel.init();
        console.log("done");
        
    }
}






