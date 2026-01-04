// ==UserScript==
// @name         Site Measurements
// @namespace    http://tampermonkey.net/
// @version      2024-10-29.2
// @license      MIT
// @description  Logs fetch, xhr, ws requests in console
// @author       Grosmar
// @match        https://*.livejasmin.com/*
// @match        https://livejasmin.com/*
// @match        https://*.oranum.com/*
// @match        https://oranum.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livejasmin.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/502707/Site%20Measurements.user.js
// @updateURL https://update.greasyfork.org/scripts/502707/Site%20Measurements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Measurement prep
    let measurements = [{msg: "PAGE_LOAD", title: "First page load", time: Date.now()}];
    const pushMeasurement = (msg) => { if (msg) { measurements.push( {time: Date.now(), msg: msg.msg, title:msg.title, sum:msg.sum } ) } return msg; };
    let avgHistory = {};
    let avgHistorySum = { time: 0, count: 0 };


    // CONFIG
    let networkLogsEnabled = localStorage.getItem("networkMeasuermentConsoleLogs") == "true";
    const filteredWs = /jaws\./; // these websockets will be filtered out from logging
    const binaryWsPackageCountLimit = 3; //show only this amount of binary packages
    const wsEventFilter = { r: /onRandomAccessPoint|onMetaData/, limit: 2} // messages with this content will be shown only `limit` amount of time
    const injectWsSend = { pattern: /"join",\{(?!.*enableTrace)/, replacement: '"join",{"enableTrace":true,' }; // if message pattern matches, injects this into websocket command

    let wsBinaryCounter = 0; // Used to determine second binary package for keyframe

    window.ocId= null;
    const getOcId = (data) =>
    {
        const match = data.match(/roomId":"([a-z0-9\-]+)"/);
        return match ? match[1] : null;
    }
    let allowListenPlaying = false; // avoid listining fake background playing events

    const measurementConfig =
          [
              {
                  callType: /^(?:NETWORK_User_MouseUp|NETWORK_User_TouchStart)/,
                  filter: null,
                  filterArgIndex: null,
                  func: (args) => { return ({msg: "USER_START", title: "User interaction (MouseUp or TouchStart)" + ocId}) }
              },
              {
                  callType: /^NETWORK_Ws_Send/,
                  filter: /"join"/,
                  filterArgIndex: 1,
                  func: (args) => { if (!ocId && measurements.length < 2) { ocId = getOcId(args[1]); return {msg: "OC_JOINING", title: "Join WebSocket request sent " + ocId, sum: "SUM_PREP"} } else return null; }
              },
              {
                  callType: /^NETWORK_Ws_Msg/,
                  filter: /"getEdge"/,
                  filterArgIndex: 1,
                  func: (args) => {
                      if ( measurements.at(-1)?.msg != "OC_JOINING" )
                      {
                          return null;
                      }
                      let data = JSON.parse(args[1].replace(/[0-9]*/, ""));
                      let refTime = measurements.at(-1).time;
                      data[0].response.forEach( e => { if ( e.name.includes("Edge") ) {return;} refTime += e.time; measurements.push( { time: refTime, msg: "OC_JOINED_" + e.name.replaceAll(/([A-Z])/g, "_$1").toUpperCase(), title: "WS Join response server side part: " + e.name } ) } );
                      return { msg: "OC_JOINED_REMAINDER", title: "WS Join response remainder, which is not measured on server side" };
                  }
              },
              {
                  callType: /^NETWORK_Ws_Msg/,
                  filter: /setVideoData/,
                  filterArgIndex: 1,
                  func: (args) => { return (measurements.at(-1)?.msg.includes("OC_JOINED_") ? {msg:"OC_SET_VIDEO_DATA", title:"Arrival of stream url"} : null) }
              },
              {
                  callType: /^NETWORK_Ws_Conn/,
                  filter: /ngs-edge/,
                  filterArgIndex: 0,
                  func: (args) => { wsBinaryCounter = 0; return {msg:"STREAM_ON_CONNECTING", title:"Starting NGS WS Connection " + ocId, sum: "SUM_OC"} }
              },
              {
                  callType: /^NETWORK_Ws_Open/,
                  filter: /ngs-edge/,
                  filterArgIndex: 0,
                  func: (args) => ({msg: "STREAM_ON_CONNECTION_OPEN", title:"Connected to NGS WebSocket " + ocId})
              },
              {
                  callType: /^NETWORK_Ws_Msg/,
                  filter: /"eventType":"onConnected"/,
                  filterArgIndex: 1,
                  func: (args) => ({msg:"STREAM_ON_CONNECTION_ACTIVE", title:"NGS WS onConnected message received"})
              },
              {
                  callType: /^NETWORK_Ws_Msg/,
                  filter: /"eventType":"onServerInfo"/,
                  filterArgIndex: 1,
                  func: (args) => ({msg:"STREAM_ON_SERVER_INFO", title:"NGS WS onServerInfo message received"})
              },
              {
                  callType: /^NETWORK_Ws_Msg/,
                  filter: /"onStreamStatus":/,
                  filterArgIndex: 1,
                  func: (args) => { return {msg:"STREAM_ON_STREAM_STATUS " + (args[1].includes('isColdStarted":true') ? "🔵" : ( args[1].includes('isColdStarted":false') ? "🔥" : "?")), title:"NGS WS onStreamStatus message received"} }
              },
              {
                  callType: /^NETWORK_Ws_Msg/,
                  filter: /"eventType":"onStreamInfo"/,
                  filterArgIndex: 1,
                  func: (args) => ({msg:"STREAM_ON_STREAM_INFO", title: "NGS WS onStreamInfo message received"})
              },
              {
                  callType: /^NETWORK_Ws_Msg/,
                  filter: /ngs-edge/,
                  filterArgIndex: 0,
                  func: (args) => {
                      if ( args[2] ) {
                          wsBinaryCounter++;

                          if ( wsBinaryCounter == 1 ) { return {msg: "STREAM_FIRST_BINARY", title:"NGS First binary package received"} }
                          else if ( wsBinaryCounter == 2 ) { allowListenPlaying = true; return {msg: "STREAM_RECEIVE_KEYFRAME", title:"NGS First keyframe received (2nd ws packet)" + ocId, sum: "SUM_STREAM_DATA"} }
                          else { return null; }
                      }
                  }
              },
              {
                  callType: /^NETWORK_Video_LoadedData/,
                  filter: /.{2,}/,
                  filterArgIndex: 0,
                  func: (args) => { return args[0].length > 0 && allowListenPlaying ? {msg:"STREAM_MEDIA_LOADED_DATA", title:"Video element loadedData event received"} : null } // empty video id filtered out because it's some preroll stuff
              },
              {
                  callType: /^NETWORK_Video_Playing/,
                  filter: /.{2,}/,
                  filterArgIndex: 0,
                  func: (args) => { if (args[0].length > 0 && allowListenPlaying) { let id = ocId; ocId = null; allowListenPlaying = false; return {msg:"STREAM_MEDIA_PLAYING", title:"Video element playing event received" + id, sum: "SUM_STREAM_PLAYBACK"} } else return null } // empty video id filtered out because it's some preroll stuff
              }
          ]; // these steps will be measured and shown when reaches the last step

    // SCRIPT

    console.log("NETWORK MEASUREMENT");

    // UI
    const createFloating = ( id, style, addClose ) =>
    {
        const div = document.createElement('div');
        div.id = id;
        Object.assign(div.style, {width: '280px', height: '100px', color: "white", background: '#700000', position: 'absolute', top: '50px', left: '50px', zIndex: 100000 });
        Object.assign(div.style, style);

        const content = document.createElement("div");
        div.appendChild( content );

        if (addClose)
        {
            const close = document.createElement("div");
            close.textContent = "x";
            close.className = "measurement-close";
            Object.assign(close.style, { position: "absolute", padding: "5px", textAlign: "center", lineHeight: "12px", top: "0px", right: "5px", color: "#999999", cursor: "pointer" } );
            close.onclick = () => { div.style.display = "none" }
            div.appendChild(close);
        }

        let isDown = false, offsetX, offsetY;
        content.addEventListener('mousedown', e => { isDown = true; offsetX = e.offsetX; offsetY = e.offsetY; });
        document.addEventListener('mousemove', e => { if (isDown) Object.assign(div.style, {left: e.pageX - offsetX + 'px', top: e.pageY - offsetY + 'px'}); });
        document.addEventListener('mouseup', () => { isDown = false });
        return div;
    }

    const measurementIcon = createFloating( "measurementFloatingIcon", {left: 0, top: 0, cursor: "poiner", borderRadius: "50%", width: "35px", height: "35px", border: "1px solid #500000", background: "#700000", color: "white", textAlign: "center", lineHeight: "35px", userSelect: "none" } );
    measurementIcon.firstElementChild.textContent = "M";
    const display = localStorage.getItem("networkMeasuermentDisplay") == "true";
    const floatingBox = createFloating( "measurementFloatingBox", {display: display ? "box" : "none", fontFamily: "monospace", padding: "5px", fontSize: "11px", height: "auto", minHeight: "100px", borderRadius: "2px"}, true );
    measurementIcon.addEventListener("click", () => { floatingBox.style.display == "none" ? floatingBox.style.display = "block" : floatingBox.style.display = "none"; localStorage.setItem("networkMeasuermentDisplay", floatingBox.style.display != "none"); });

    floatingBox.querySelector(".measurement-close").addEventListener("click", () => { localStorage.setItem("networkMeasuermentDisplay", floatingBox.style.display != "none"); } );
    floatingBox.firstChild.style.minHeight = "100px";

    const enableLogsCheckbox = document.createElement('input');
    enableLogsCheckbox.type = "checkbox";
    enableLogsCheckbox.title = "Enable console logs";
    enableLogsCheckbox.checked = networkLogsEnabled;
    enableLogsCheckbox.onchange = () => { networkLogsEnabled = !networkLogsEnabled; localStorage.setItem("networkMeasuermentConsoleLogs", networkLogsEnabled); };
    Object.assign(enableLogsCheckbox.style, { position: "absolute", top: "5px", right: "20px", width: "12px", height: "12px" });
    floatingBox.appendChild(enableLogsCheckbox);

    const clearHistoryIcon = document.createElement('div');
    clearHistoryIcon.title = "Clear history";
    clearHistoryIcon.textContent = "🗑";
    clearHistoryIcon.onclick = () => { avgHistory = {}; avgHistorySum = { time: 0, count: 0 }; alert("History cleared"); };
    Object.assign(clearHistoryIcon.style, { position: "absolute", top: "4px", right: "40px", width: "12px", height: "12px", cursor: "pointer"});
    floatingBox.appendChild(clearHistoryIcon);

    // Measurements

    const addToAvgHistory = (name, time) =>
    {
        if ( !avgHistory[name] )
        {
            avgHistory[name] = {count: 1, time: time};
        }
        else
        {
            avgHistory[name] = {count: avgHistory[name].count+1, time: (avgHistory[name].time * avgHistory[name].count + time) / (avgHistory[name].count + 1) };
        }
    }

    const parseMeasurements = () =>
    {
        let parsedMeasurements = [];
        let sumTime = 0;
        let partialSumTime = 0;
        let partialSumTimes = [];

        for ( let i = 0; i < measurements.length; i++ )
        {
            let diffTime = i == 0 ? 0 : measurements[i].time - measurements[i-1].time;

            parsedMeasurements.push( {msg: measurements[i].msg, title: measurements[i].title, time: diffTime} );
            addToAvgHistory(measurements[i].msg, diffTime);

            sumTime += diffTime;
            partialSumTime += diffTime;

            if ( measurements[i].sum )
            {
                partialSumTimes.push( { name: measurements[i].sum, sum: partialSumTime } );
                addToAvgHistory(measurements[i].sum, partialSumTime);
                partialSumTime = 0;
            }
        }

        avgHistorySum = { count: avgHistorySum.count+1, time: (avgHistorySum.time * avgHistorySum.count + sumTime) / (avgHistorySum.count + 1) };

        return { measurements: parsedMeasurements, sum: sumTime, partialSum: partialSumTimes };
    }

    const printMeasurements = () =>
    {
        /*if (measurements.length < 3 )
        {
            return;
        }*/

        const parsed = parseMeasurements();
        const parsedMeasurements = parsed.measurements;
        const sum = parsed.sum;

        const bg = 'background-color: #00000022';

        const pad = 27;
        let resultText = "";
        let resultHtml = "";

        for ( let i = 0; i < parsedMeasurements.length; i++ )
        {
            resultText += parsedMeasurements[i].msg.padEnd(pad) + " " + (parsedMeasurements[i].time).toString().padStart(4) + "\n";
            resultHtml += `
            <tr>
                <td title="${parsedMeasurements[i].title}" ${i % 2 == 0 ? 'style="' + bg + '"' : ""}>${parsedMeasurements[i].msg}</td>
                <td style="text-align:right${i % 2 == 0 ? '; ' + bg : ""}">${parsedMeasurements[i].time}</td>
                <td style="padding-left:2px;font-style:italic;text-align:right${i % 2 == 0 ? '; ' + bg : ""}">${Math.round(avgHistory[parsedMeasurements[i].msg].time)}</td>
            </tr>`;
        }

        resultHtml += `<tr><td colSpan="3">&nbsp;</td></tr>`;

        for ( let i = 0; i < parsed.partialSum.length; i++ )
        {
            resultText += parsed.partialSum[i].name.padEnd(pad) + " " + (parsed.partialSum[i].sum).toString().padStart(4) + "\n";
            resultHtml += `
            <tr>
                <td title="${parsed.partialSum[i].name}" ${i % 2 == 0 ? 'style="' + bg + '"' : ""}>${parsed.partialSum[i].name}</td>
                <td style="text-align:right${i % 2 == 0 ? '; ' + bg : ""}">${parsed.partialSum[i].sum}</td>
                <td style="padding-left:2px;font-style:italic;text-align:right${i % 2 == 0 ? '; ' + bg : ""}">${Math.round(avgHistory[parsed.partialSum[i].name].time)}</td>
            </tr>`;
        }

        const measurementText = 'MEASUREMENTS'.padEnd(pad) + '\n' + '____________'.padEnd(pad) + '\n' + resultText + '\n' + 'SUM'.padEnd(pad) + ' ' + sum.toString().padStart(4);
        const measurementHtml = `
        <b>MEASUREMENTS</b><br><br>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Event</b></td>
                    <td style="text-align:right"><b>Time</b></td>
                    <td style="font-style:italic;text-align:right;"><b>Avg</b></td>
                </tr>
            </thead>
            <tbody>
                ${resultHtml}
                <tr>
                    <td><b>SUM</b></td>
                    <td style="text-align:right"><b>${sum}</b></td>
                    <td style="font-style:italic;text-align:right;"><b>${Math.round(avgHistorySum.time)}</b></td>
                </tr>
        </table>`;

        console.log('%c' + measurementText, 'background: red; color: #bada55');
        floatingBox.firstElementChild.innerHTML = measurementHtml;

    }

    const addMeasurement = (callType, ...args) =>
    {
        let highlighted = false;

        for ( let i = 0; i < measurementConfig.length; i++ )
        {

            if (measurementConfig[i].callType.test(callType) && (!measurementConfig[i].filter || isNaN(measurementConfig[i].filterArgIndex) || measurementConfig[i].filter.test(args[measurementConfig[i].filterArgIndex])))
            {

                let pushed = false;
                if ( (pushed = pushMeasurement( measurementConfig[i].func(args) )) && i == 0 )
                {
                    measurements = measurements.slice(-1); // reset if it was the first real action
                }

                if (pushed)
                {
                    highlighted = true;
                    try
                    {
                        networkLogsEnabled && console.log('%c' + callType + " " + JSON.stringify(args), 'background: darkorange; color: white');
                    }
                    catch (e)
                    {
                        networkLogsEnabled && console.log('%c' + callType + " " + args, 'background: darkorange; color: white');
                    }
                }

                if ( i == measurementConfig.length - 1 && pushed )
                {
                    printMeasurements(); // print if it was the last
                    measurements = [];
                }

                break;
            }
        }

        if ( networkLogsEnabled && !highlighted )
        {
            console.log( callType, ...args );
        }
    }



    // Image listeners
    const OrigImage = window.Image;
    window.Image = function(...args) { const img = new OrigImage(...args); img.addEventListener('load', function() {addMeasurement('NETWORK_Img2', img.src);}); return img; };

    function handleNewImages(images) {
        images.forEach(img => {
            addMeasurement('NETWORK_Img', img.src);
        });
    }

    const loadedListener = (e) => { addMeasurement('NETWORK_Video_LoadedData', e.target.id); }
    const playingListener = (e) => { addMeasurement('NETWORK_Video_Playing', e.target.id); }

    function handleNewVideos(videos) {
        videos.forEach(video => {
            //video.style.opacity = 0.1;
            video.addEventListener("loadeddata", loadedListener);
            video.addEventListener("playing", playingListener );
        });
    }

    const observer = new MutationObserver(mutations => { // Create a MutationObserver to watch for added nodes
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG') {
                        handleNewImages([node]);
                    } else if (node.querySelectorAll) {
                        // Check for images within added containers
                        const imgs = node.querySelectorAll('img');
                        if (imgs.length > 0) {
                            handleNewImages(imgs);
                        }
                    }
                    if (node.tagName === 'VIDEO') {
                        handleNewVideos([node]);
                    } else if (node.querySelectorAll) {
                        // Check for images within added containers
                        const videos = node.querySelectorAll('video');
                        if (videos.length > 0) {
                            handleNewVideos(videos);
                        }
                    }
                });
            }
        });
    });

    window.addEventListener("load", () => {

        setTimeout( () => {
            document.body.appendChild(floatingBox);
            document.body.appendChild(measurementIcon);
        }, 1000);

        observer.observe(document.body, { // Start observing the document body for changes
            childList: true,
            subtree: true
        });

    });


    // User listeners
    document.addEventListener("click", (event) => { addMeasurement("NETWORK_User_Click", event.target); });
    document.addEventListener("mousedown", (event) => { addMeasurement("NETWORK_User_MouseDown", event.target); });
    document.addEventListener("mouseup", (event) => { addMeasurement("NETWORK_User_MouseUp", event.target); });
    document.addEventListener("touchstart", (event) => { addMeasurement("NETWORK_User_TouchStart", event.target); });
    document.addEventListener("touchend", (event) => { addMeasurement("NETWORK_User_TouchEnd", event.target); });

    // Request listeners
    const origFetch = fetch;
    window.fetch = (...args) => { addMeasurement("NETWORK_Fetch", ...args); return origFetch(...args); }

    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) { addMeasurement("NETWORK_Xhr", ...args); return origOpen.apply(this, args); }

    // Websocket listeners
    let wsList = []
    const origWsSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data)
    {
        if (!wsList.includes(this))
        {
            wsList.push(this);

            if (!filteredWs.test(this.url)) {
                let binaryCount = 0;
                let filteredMsgCount = 0;
                addMeasurement("NETWORK_Ws_Conn", this.url, this.protocols);
                this.addEventListener("open", (event) => { addMeasurement("NETWORK_Ws_Open", this.url); });
                this.addEventListener("close", (event) => { addMeasurement("NETWORK_Ws_Close", this.url); wsList.splice(wsList.indexOf(this),1); });

                this.addEventListener("message", (event) =>
                                         {
                    const isBinary = event.data instanceof ArrayBuffer;
                    const eventFilterTest = wsEventFilter.r.test(event.data);
                    if (event.data != 2 && ((isBinary && binaryCount++ < binaryWsPackageCountLimit) || (!isBinary && (!eventFilterTest || filteredMsgCount++ < wsEventFilter.limit))))
                    {
                        addMeasurement("NETWORK_Ws_Msg", this.url, event.data, isBinary);
                    }
                }
                                        );
            }
        }


        if (data != 3 && !filteredWs.test(this.url))
        {
            addMeasurement("NETWORK_Ws_Send", this.url, data);
        }

        if ( !(data instanceof ArrayBuffer) && injectWsSend.pattern.test(data))
        {
            data = data.replace(injectWsSend.pattern, injectWsSend.replacement);
        }

        return origWsSend.call(this, data);
    }


    const OrigWs = window.WebSocket;
    window.WebSocket = function (url, protocols)
    {
        let ws = new OrigWs(url, protocols);
        if (!filteredWs.test(url)) {
            let binaryCount = 0;
            let filteredMsgCount = 0;
            addMeasurement("NETWORK_Ws_Conn", url, protocols);
            ws.addEventListener("open", (event) => { addMeasurement("NETWORK_Ws_Open", url); });
            ws.addEventListener("close", (event) => { addMeasurement("NETWORK_Ws_Close", url); wsList.splice(wsList.indexOf(this),1); });

            ws.addEventListener("message", (event) =>
                {
                    const isBinary = event.data instanceof ArrayBuffer;
                    const eventFilterTest = wsEventFilter.r.test(event.data);
                    if (event.data != 2 && ((isBinary && binaryCount++ < binaryWsPackageCountLimit) || (!isBinary && (!eventFilterTest || filteredMsgCount++ < wsEventFilter.limit))))
                    {
                        addMeasurement("NETWORK_Ws_Msg", url, event.data, isBinary);
                    }
                }
            );
        }

        wsList.push(ws);
        return ws;
    }
})();