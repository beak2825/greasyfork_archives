// ==UserScript==
// @name         shut up
// @namespace    https://bonk.io/
// @version      1.0
// @description  neon's bonk.io bonkery mod or nbbm waddahell (Fix)
// @author       iNeonz
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @downloadURL https://update.greasyfork.org/scripts/507543/shut%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/507543/shut%20up.meta.js
// ==/UserScript==

/*
gameframe-release.html
[{"id":72,"scale":0.11655788868665695,"angle":-63.490482330322266,"x":12.171428680419922,"y":-5.185714244842529,"flipX":false,"flipY":false,"color":1907997},{"id":81,"scale":0.092705637216568,"angle":-0.14270401000976562,"x":1.2428570985794067,"y":-9.814285278320312,"flipX":false,"flipY":false,"color":0},{"id":72,"scale":0.1436178982257843,"angle":-35.1854133605957,"x":3.9000000953674316,"y":-13.199999809265137,"flipX":false,"flipY":false,"color":1907997},{"id":84,"scale":0.2341306060552597,"angle":120.5300521850586,"x":4.671428680419922,"y":-1.2428570985794067,"flipX":false,"flipY":false,"color":658072},{"id":100,"scale":0.17248843610286713,"angle":523.9761962890625,"x":5.742857456207275,"y":0.7714285850524902,"flipX":false,"flipY":false,"color":0},{"id":84,"scale":0.2572248578071594,"angle":198.1577911376953,"x":0.5142856240272522,"y":8.828571319580078,"flipX":false,"flipY":false,"color":658072},{"id":78,"scale":0.19995847344398499,"angle":114.26380157470703,"x":2.2285714149475098,"y":3.6857142448425293,"flipX":false,"flipY":false,"color":0},{"id":80,"scale":0.019616663455963135,"angle":168.57809448242188,"x":-2.5714285373687744,"y":-1.9285714626312256,"flipX":false,"flipY":false,"color":6032640},{"id":80,"scale":0.022777527570724487,"angle":236.5100555419922,"x":-3.9000000953674316,"y":-1.2000000476837158,"flipX":false,"flipY":false,"color":6032640},{"id":78,"scale":0.06847567111253738,"angle":984.3223876953125,"x":-4.414285659790039,"y":-0.9857142567634583,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.1497318595647812,"angle":50.437191009521484,"x":-6,"y":-0.9428571462631226,"flipX":false,"flipY":false,"color":0},{"id":78,"scale":0.1135847419500351,"angle":684.7433471679688,"x":-0.4285714328289032,"y":-4.5428571701049805,"flipX":false,"flipY":false,"color":0},{"id":26,"scale":0.23429641127586365,"angle":502.44549560546875,"x":-5.485714435577393,"y":2.4000000953674316,"flipX":false,"flipY":false,"color":0},{"id":81,"scale":0.10330445319414139,"angle":191.5167236328125,"x":-8.614285469055176,"y":9.300000190734863,"flipX":false,"flipY":false,"color":1907997},{"id":100,"scale":0.2080022245645523,"angle":527.301513671875,"x":0.12857143580913544,"y":8.314285278320312,"flipX":false,"flipY":false,"color":0},{"id":26,"scale":0.654298722743988,"angle":354.9647521972656,"x":12.985713958740234,"y":5.357142925262451,"flipX":false,"flipY":true,"color":0}]'
*/

const originalSend = window.WebSocket.prototype.send;
let websocket;
let excludeWss = [];
let p2p;

console.log('lol');

window.WebSocket.prototype.send = function(args) {
    //RECIEVE EVENTS
    console.log(String(args));
    if(this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string"){
            if(!websocket){
                websocket = this;
            }
            if (args.startsWith('42[13')){
                let data = JSON.parse(args.slice(2));
                data[1].avatar.layers = [{"id":72,"scale":0.11655788868665695,"angle":-63.490482330322266,"x":12.171428680419922,"y":-5.185714244842529,"flipX":false,"flipY":false,"color":1907997},{"id":81,"scale":0.092705637216568,"angle":-0.14270401000976562,"x":1.2428570985794067,"y":-9.814285278320312,"flipX":false,"flipY":false,"color":0},{"id":72,"scale":0.1436178982257843,"angle":-35.1854133605957,"x":3.9000000953674316,"y":-13.199999809265137,"flipX":false,"flipY":false,"color":1907997},{"id":84,"scale":0.2341306060552597,"angle":120.5300521850586,"x":4.671428680419922,"y":-1.2428570985794067,"flipX":false,"flipY":false,"color":658072},{"id":100,"scale":0.17248843610286713,"angle":523.9761962890625,"x":5.742857456207275,"y":0.7714285850524902,"flipX":false,"flipY":false,"color":0},{"id":84,"scale":0.2572248578071594,"angle":198.1577911376953,"x":0.5142856240272522,"y":8.828571319580078,"flipX":false,"flipY":false,"color":658072},{"id":78,"scale":0.19995847344398499,"angle":114.26380157470703,"x":2.2285714149475098,"y":3.6857142448425293,"flipX":false,"flipY":false,"color":0},{"id":80,"scale":0.019616663455963135,"angle":168.57809448242188,"x":-2.5714285373687744,"y":-1.9285714626312256,"flipX":false,"flipY":false,"color":6032640},{"id":80,"scale":0.022777527570724487,"angle":236.5100555419922,"x":-3.9000000953674316,"y":-1.2000000476837158,"flipX":false,"flipY":false,"color":6032640},{"id":78,"scale":0.06847567111253738,"angle":984.3223876953125,"x":-4.414285659790039,"y":-0.9857142567634583,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.1497318595647812,"angle":50.437191009521484,"x":-6,"y":-0.9428571462631226,"flipX":false,"flipY":false,"color":0},{"id":78,"scale":0.1135847419500351,"angle":684.7433471679688,"x":-0.4285714328289032,"y":-4.5428571701049805,"flipX":false,"flipY":false,"color":0},{"id":26,"scale":0.23429641127586365,"angle":502.44549560546875,"x":-5.485714435577393,"y":2.4000000953674316,"flipX":false,"flipY":false,"color":0},{"id":81,"scale":0.10330445319414139,"angle":191.5167236328125,"x":-8.614285469055176,"y":9.300000190734863,"flipX":false,"flipY":false,"color":1907997},{"id":100,"scale":0.2080022245645523,"angle":527.301513671875,"x":0.12857143580913544,"y":8.314285278320312,"flipX":false,"flipY":false,"color":0},{"id":26,"scale":0.654298722743988,"angle":354.9647521972656,"x":12.985713958740234,"y":5.357142925262451,"flipX":false,"flipY":true,"color":0}];
                data[1].avatar.bc = 1907997;
                args = '42'+JSON.stringify(data);
            }
            if (args.startsWith('42[12')){
                let data = JSON.parse(args.slice(2));
                data[1].avatar.layers = [{"id":72,"scale":0.11655788868665695,"angle":-63.490482330322266,"x":12.171428680419922,"y":-5.185714244842529,"flipX":false,"flipY":false,"color":1907997},{"id":81,"scale":0.092705637216568,"angle":-0.14270401000976562,"x":1.2428570985794067,"y":-9.814285278320312,"flipX":false,"flipY":false,"color":0},{"id":72,"scale":0.1436178982257843,"angle":-35.1854133605957,"x":3.9000000953674316,"y":-13.199999809265137,"flipX":false,"flipY":false,"color":1907997},{"id":84,"scale":0.2341306060552597,"angle":120.5300521850586,"x":4.671428680419922,"y":-1.2428570985794067,"flipX":false,"flipY":false,"color":658072},{"id":100,"scale":0.17248843610286713,"angle":523.9761962890625,"x":5.742857456207275,"y":0.7714285850524902,"flipX":false,"flipY":false,"color":0},{"id":84,"scale":0.2572248578071594,"angle":198.1577911376953,"x":0.5142856240272522,"y":8.828571319580078,"flipX":false,"flipY":false,"color":658072},{"id":78,"scale":0.19995847344398499,"angle":114.26380157470703,"x":2.2285714149475098,"y":3.6857142448425293,"flipX":false,"flipY":false,"color":0},{"id":80,"scale":0.019616663455963135,"angle":168.57809448242188,"x":-2.5714285373687744,"y":-1.9285714626312256,"flipX":false,"flipY":false,"color":6032640},{"id":80,"scale":0.022777527570724487,"angle":236.5100555419922,"x":-3.9000000953674316,"y":-1.2000000476837158,"flipX":false,"flipY":false,"color":6032640},{"id":78,"scale":0.06847567111253738,"angle":984.3223876953125,"x":-4.414285659790039,"y":-0.9857142567634583,"flipX":false,"flipY":false,"color":0},{"id":75,"scale":0.1497318595647812,"angle":50.437191009521484,"x":-6,"y":-0.9428571462631226,"flipX":false,"flipY":false,"color":0},{"id":78,"scale":0.1135847419500351,"angle":684.7433471679688,"x":-0.4285714328289032,"y":-4.5428571701049805,"flipX":false,"flipY":false,"color":0},{"id":26,"scale":0.23429641127586365,"angle":502.44549560546875,"x":-5.485714435577393,"y":2.4000000953674316,"flipX":false,"flipY":false,"color":0},{"id":81,"scale":0.10330445319414139,"angle":191.5167236328125,"x":-8.614285469055176,"y":9.300000190734863,"flipX":false,"flipY":false,"color":1907997},{"id":100,"scale":0.2080022245645523,"angle":527.301513671875,"x":0.12857143580913544,"y":8.314285278320312,"flipX":false,"flipY":false,"color":0},{"id":26,"scale":0.654298722743988,"angle":354.9647521972656,"x":12.985713958740234,"y":5.357142925262451,"flipX":false,"flipY":true,"color":0}];
                data[1].avatar.bc = 1907997;
                args = '42'+JSON.stringify(data);
            }
        }

    }
    return originalSend.call(this,args);
}
