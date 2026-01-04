// ==UserScript==
// @name     Sentry to Datadog RUM and Log buttons
// @version  3
// @grant    none
// @match    https://*.sentry.io/issues/*
// @license  MIT
// @namespace happyviking
// @description Read the README
// @downloadURL https://update.greasyfork.org/scripts/475250/Sentry%20to%20Datadog%20RUM%20and%20Log%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/475250/Sentry%20to%20Datadog%20RUM%20and%20Log%20buttons.meta.js
// ==/UserScript==

// This script requires getting some react props from these HTML elements.
// Methodology for this is borrowed (and modified) from here:
// https://stackoverflow.com/questions/70507318/how-to-get-react-element-props-from-html-element-with-javascript
// But it requires some more DOM access than userscripts (and extensions) normally have
// https://stackoverflow.com/questions/72726773/access-react-props-functions-via-native-javascript
// so I've put everything in an actual script tag
// Logic still behaves the same, comment out the first line below <COMMENT LINE IF EDITING> to get syntax highligting if you need to edit the script


// <COMMENT LINE BELOW IF EDITING>
const logic = `

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const main = async () => {

    const info = {}

    //ID
    await waitForElm('div[data-test-id="event-tags"]') //Just waiting till it loads
    const ID = document.querySelector('td[data-test-id="user-context-id-value"]')?.querySelector(".val-string > span")?.textContent
    info.id = ID

    //RUM
    const RUMTable = document.querySelector('div[data-test-id="event-section-context-datadog"]')?.nextElementSibling
    if (RUMTable){
        //https://stackoverflow.com/questions/37098405/javascript-queryselector-find-div-by-innertext
        const tableKey = document.evaluate('//td[text()="RUM"]', RUMTable, null, XPathResult.ANY_TYPE, null).iterateNext()
        const RUM = tableKey?.nextSibling?.querySelector(".val-string > span")?.textContent
        info.RUM = RUM
    }


    //Timestamp
    const timeElement = document.querySelector("time")
    let props = getReactProps(timeElement);
    const exactTimestamp = new Date(props.date)
    const imrovedTimeString = exactTimestamp.toLocaleString(undefined, {
        weekday: undefined,
        year: undefined,
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: "UTC"
      })
    
    timeElement.textContent = imrovedTimeString
    info.time = imrovedTimeString
    
    

    const buttonHolder = document.createElement("div")
    buttonHolder.id = "thebuttonholder"
    const parent = document.querySelector("header")?.parentElement
    if (!parent) return

    if (!document.getElementById("thebuttonholder")) parent.insertBefore(buttonHolder, document.querySelector('div[role=tabpanel]'))

    if (!document.getElementById("rum-shortcut")){
        if (info.RUM){
            buttonHolder.appendChild(makeButton("Provided RUM","rum-shortcut", info.RUM))
        }else{
            const text = document.createElement("p")
            text.textContent = "NO PROVIDED RUM 🥲"
            text.style.color = "red"
            text.style.fontSize = "18px"
            text.id = "rum-shortcut"
            buttonHolder.appendChild(text)
        }
    }


    if (info.time && info.id && !document.getElementById("manual-rum-shortcut")){
        //Adding more info to the date so that the resultant date object is accurate
        info.time += " " + (new Date()).getFullYear() + " UTC"
        const eventTime = new Date(Date.parse(info.time)).getTime()
        const OFFSET = 300000 //5 minutes in milliseconfs
        const OFFSET_SHORTER = 60000 //1 minutes in milliseconfs
        const OFFSET_FOR_HIGHLIGHTING = 30000 //30 seconds in milliseconfs

        //Adding inferred RUM button
        const manualRumURL = new URL("https://app.datadoghq.com/rum/sessions?query=%40type%3Aerror&cols=&tab=session&viz=stream&live=false")
        manualRumURL.searchParams.set("query", (manualRumURL.searchParams.get("query") || "") + " @usr.id:" + info.id)
        manualRumURL.searchParams.set("from_ts", eventTime - OFFSET )
        manualRumURL.searchParams.set("to_ts", eventTime + OFFSET)
        //For my "Datadog RUM log highlighting" script
        manualRumURL.searchParams.set("highlight_from", eventTime - OFFSET_FOR_HIGHLIGHTING )
        manualRumURL.searchParams.set("highlight_to", eventTime + OFFSET_FOR_HIGHLIGHTING)
        buttonHolder.appendChild(makeButton("Inferred RUM","manual-rum-shortcut", manualRumURL.toString()))

        //Adding Logs button
        const logsUrl = new URL("https://app.datadoghq.com/logs?cols=host%2Cservice%2C%40accountName%2C%40args.url&index=&messageDisplay=inline&refresh_mode=sliding&stream_sort=time%2Cdesc&viz=stream&live=false")
        logsUrl.searchParams.set("query", "@usr.id:" + info.id)
        logsUrl.searchParams.set("from_ts", eventTime - OFFSET_SHORTER )
        logsUrl.searchParams.set("to_ts", eventTime + OFFSET_SHORTER)
        //For my "Datadog Log log highlighting" script
        logsUrl.searchParams.set("highlight_from", eventTime - OFFSET_FOR_HIGHLIGHTING )
        logsUrl.searchParams.set("highlight_to", eventTime + OFFSET_FOR_HIGHLIGHTING)
        buttonHolder.appendChild(makeButton("Relevant Logs","logs-shortcut", logsUrl.toString()))
    }
}


const makeButton = (text, id, href) => {
    const button = document.createElement("button")
    button.textContent = text
    const link = document.createElement("a")
    link.appendChild(button)
    link.href = href
    link.target="_blank"
    link.id = id
    button.className = document.querySelector('button[aria-label="Resolve"]')?.className ?? ""
    return link
}


const getReactProps = (target) => {
    let keyof_ReactProps = undefined
    let parent = target.parentElement
    while (parent) {
        keyof_ReactProps = Object.keys(parent).find(k => k.startsWith("__reactProps$"));
        if (!keyof_ReactProps){
            parent = parent.parentElement
        }else{
            break
        }
    }

    const symof_ReactFragment = Symbol.for("react.fragment");

    //Find the path from target to parent
    let path = [];
    let elem = target;
    while (elem !== parent) {
        let index = 0;
        for (let sibling = elem; sibling != null;) {
            if (sibling[keyof_ReactProps]) index++;
            sibling = sibling.previousElementSibling;
        }
        path.push({ child: elem, index });
        elem = elem.parentElement;
    }
    //Walk down the path to find the react state props
    let state = elem[keyof_ReactProps];
    for (let i = path.length - 1; i >= 0 && state != null; i--) {
        //Find the target child state index
        let childStateIndex = 0, childElemIndex = 0;
        while (childStateIndex < state.children.length) {
            let childState = state.children[childStateIndex];
            if (childState instanceof Object) {
                //Fragment children are inlined in the parent DOM element
                let isFragment = childState.type === symof_ReactFragment && childState.props.children.length;
                childElemIndex += isFragment ? childState.props.children.length : 1;
                if (childElemIndex === path[i].index) break;
            }
            childStateIndex++;
        }
        let childState = state.children[childStateIndex] ?? (childStateIndex === 0 ? state.children : null);
        state = childState?.props;
        elem = path[i].child;
    }
    return state;
}

main()

// ` //DOn't remove this line, this terminales the script string when the line below the <COMMENT LINE IF EDITING> line is not commented out

const attachScript = () => {
    const id = "button-adder-script"
    if (document.getElementById(id)) return
    console.log("Adding script for Sentry to Datadog userscript")
    const script = document.createElement("script");
    script.textContent = logic;
    script.id = id
    document.body.appendChild(script);
}

//There are probably cleaner ways to do this but I don't really care, this works and this
//is supposed to be fast
let currentPage = location.href;
attachScript()
setInterval(() =>
{
    if (currentPage != location.href){
        currentPage = location.href;
        attachScript()
    }
}, 500);


