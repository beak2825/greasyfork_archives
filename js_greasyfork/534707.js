// ==UserScript==
// @name        まちがい探しボックス
// @namespace   Violentmonkey Scripts
// @match       https://game.yomipo.yomiuri.co.jp/spotdiff/game/*
// @match       https://game.yomipo.yomiuri.co.jp/spotdiff/result/*
// @match       https://game.yomipo.yomiuri.co.jp/spotdiff?*
// @match       https://game.yomipo.yomiuri.co.jp/spotdiff
// @match       https://general.game.pointmall.rakuten.net/spotdiff/game/*
// @match       https://general.game.pointmall.rakuten.net/spotdiff/result/*
// @match       https://general.game.pointmall.rakuten.net/spotdiff?*
// @match       https://general.game.pointmall.rakuten.net/spotdiff
// @grant       none
// @version     1.2.2
// @author      -
// @description 2024/5/28 16:27:18
// @downloadURL https://update.greasyfork.org/scripts/534707/%E3%81%BE%E3%81%A1%E3%81%8C%E3%81%84%E6%8E%A2%E3%81%97%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/534707/%E3%81%BE%E3%81%A1%E3%81%8C%E3%81%84%E6%8E%A2%E3%81%97%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9.meta.js
// ==/UserScript==

const isAuto = !!0;
const iseditisInsteAD = true;
const editStyle = true;
const hintColor = "green";

function clickWithPos(element,posArg,eventType='mousedownup',dispTraceMode=0){
// 2022/01/21
// 2022/01/30 area修正
// 2022/02/14 dot area 時限でエレメント削除
// 2022/07/22 dot area 時限変更 eventTypeModeでクリックエリアなど表示の統合、イベント名などを引数に追加
// 2023/01/23 eventType のチェックを廃止 マニュアルでdown upを使いたいとき用
// 2023/04/08 オプション追加
// 2023/04/08 オプション追加 move
// 2023/06/04 mouseeventのオプション変更

//mkdot mkarea統合したい→した
//引数で変えられれば便利な候補:イベント名、対になるイベントを発生させるか、その遅延実行時間、dot エリアを表示させるか、ログ表示させるか、bubbles: false、cancelable: true

  // const tmpposArg = {
  //   left : 30,
  //   top : 520,
  //   width : 50,
  //   height : 30
  // }

  // eventType='click mousedownup pointerdownup'
  // dispTraceMode=0 非表示
  // dispTraceMode=1 ドット表示
  // dispTraceMode=2 エリア表示

  // const eventTypeList = ['click','mousedownup','pointerdownup'];
  // console.log('clickWithPos');
  const eventTypeList = {
    click : ["click",],
    mousemove : ["mousemove",],
    mousedown : ["mousedown"],
    mouseup   : ["mouseup"],
    mousedownup : ["mousedown","mouseup"],
    pointerdown : ["pointerdown"],
    pointermove : ["pointermove"],
    pointerup : ["pointerup"],
    pointerdownup : ["pointerdown","pointerup"],
    mousemovedownup : ["mousemove","mousedown","mouseup"]
  };

  const chkPosArg = ()=>{
    return typeof posArg == "object" && Object.keys(posArg).every(e=> typeof posArg[e] == "number" || (typeof posArg[e] == "string" && /^[\d\.]+(?:px|%)?$/.test(posArg[e])));
  }
  const chkEventType = ()=> Object.keys(eventTypeList).includes(eventType);
  const chkDispTraceMode = ()=> [0,1,2].includes(dispTraceMode);

  const editStyle = str =>{
    if(str){
      return Number(str.replace(/px/,""));
    }
  }

  const convertToNumber = (str,length) =>{
    if(typeof str == "string"){
      if(/^[\d\.]+%$/.test(str)){
        return Math.floor(Number(str.replace('%','')) * Number(length) / 100);
      }else{ //pxつきと文字列にした数字
        return Number(str.replace('px',''));
      }
    }else{
      if(str <= 1 && str >= 0){
        return Math.floor(str * Number(length));
      }else{
        return str;
      }
    }
  }

  //test時切り替え用
  // eventType = Object.keys(eventTypeList)[2];
  // dispTraceMode = 0;


  //初期化
  if(!chkPosArg()){
    // console.log('clickWithPos : posArgが正常でない。')
    posArg = {
      left : 0.5,
      top : 0.5,
      width : 0.1,
      height : 0.1
    };
  }
  // if(!chkEventType()){
  //   // console.log('clickWithPos : eventTypeが正常でない。')
  //   eventType = 'click';
  // }
  if(!chkDispTraceMode()){
    // console.log('clickWithPos : displayTraceが正常でない。')
    dispTraceMode = 0;
  }

  if(!element){
    console.log('clickWithPos : elementが正常でない。')
  }else{
    const eStyle = getComputedStyle(element,"");
    const ePos = element.getBoundingClientRect();
    const tmpPosWithoutPadding = {//border paddingを除いたelementのウインドウビューの左上からの位置と幅高さ
      left : ePos.left + editStyle(eStyle.borderLeftWidth) + editStyle(eStyle.paddingLeft),
      top : ePos.top + editStyle(eStyle.borderTopWidth) + editStyle(eStyle.paddingTop),
      width : ePos.width - (editStyle(eStyle.borderLeftWidth) + editStyle(eStyle.paddingLeft) + editStyle(eStyle.borderRightWidth) + editStyle(eStyle.paddingRight)),
      height : ePos.height - (editStyle(eStyle.borderTopWidth) + editStyle(eStyle.paddingTop) + editStyle(eStyle.borderBottomWidth) + editStyle(eStyle.paddingBottom))
    }
    const tmpClickArea = { //element内でクリックするエリア //%指定されていれば変換 pxつき文字列ならpx削除して代入
      left : convertToNumber(posArg.left,tmpPosWithoutPadding.width),
      top : convertToNumber(posArg.top,tmpPosWithoutPadding.height),
      clientX: undefined,
      clientY: undefined,
      width : convertToNumber(posArg.width,tmpPosWithoutPadding.width),
      height : convertToNumber(posArg.height,tmpPosWithoutPadding.height)
    }
    tmpClickArea.clientX = tmpPosWithoutPadding.left + tmpClickArea.left;
    tmpClickArea.clientY = tmpPosWithoutPadding.top + tmpClickArea.top;
    // console.log(tmpClickArea);

    const RandomNumXY = [Math.random(),Math.random()];

    const mouse_eventInit = {
      clientX: tmpClickArea.clientX + Math.floor(RandomNumXY[0] * tmpClickArea.width),
      clientY: tmpClickArea.clientY + Math.floor(RandomNumXY[1] * tmpClickArea.height),
      bubbles: true,
      // cancelable: false
      //2023/04/08変更
      cancelable: true,
      composed: true,
      // defaultPrevented: false,//falseにならない
      detail: 1,
      mozInputSource: 1,
      // returnValue: true,//trueにならない
      view: self.window
    }
    // mouse_eventInit.screenX = mouse_eventInit.clientX;
    // mouse_eventInit.screenY = mouse_eventInit.clientY;

    //2023/06/04変更
    // mouse_eventInit.layerX =mouse_eventInit.clientX - tmpPosWithoutPadding.left;
    // mouse_eventInit.layerY =mouse_eventInit.clientY - tmpPosWithoutPadding.top;

    // console.log(mouse_eventInit);

    const addButtonsOptionToMouse_eventInit =(buttons=1)=>{
      return Object.assign({buttons:buttons},mouse_eventInit);
    }

    const displayTrace = ()=>{
      const DOMIdName = 'displayTraceArea';
      const displaytime = 500;

      const DOMRect = document.body.getBoundingClientRect();
      let bodyRect ={};
      if(DOMRect){
        bodyRect.left = DOMRect.left;
        bodyRect.top = DOMRect.top;
      }

      let displayArea;
      if(dispTraceMode == 1){
         displayArea = {
          left : mouse_eventInit.clientX - bodyRect.left,
          top : mouse_eventInit.clientY - bodyRect.top,
          width : 3,
          height : 3
        }
      }else{
         displayArea = {
          left : tmpClickArea.clientX - bodyRect.left,
          top : tmpClickArea.clientY - bodyRect.top,
          width : tmpClickArea.width,
          height : tmpClickArea.height
        }
      }
      let style = `          #${DOMIdName}{
            position: absolute;
            z-index: 100;
            background-color: #ff000050;
            Left: ${displayArea.left}px;
            Top: ${displayArea.top}px;
            width: ${displayArea.width}px;
            height: ${displayArea.height}px;
          }`;
      let newStyle = document.createElement('style');
      newStyle.type = 'text/css';
      newStyle.innerText = style;
      document.getElementsByTagName('HEAD').item(0).appendChild(newStyle);
      if(document.getElementById(DOMIdName)){
      }else{
        const newDiv = document.createElement("div");
        newDiv.id = DOMIdName;
        document.body.appendChild(newDiv);
        let DOM = document.getElementById(DOMIdName);
        setTimeout(()=>{
          if(DOM) DOM.remove();
          DOM = null;
        },displaytime);
      }
    }

    // console.log(posArg);
    // console.log(`element : `,element)
    // console.log(`clientX : ${mouse_eventInit.clientX}`,`clientY : ${mouse_eventInit.clientY}`,`width : ${ePos.width}`,`height : ${ePos.height}`)
    // console.log(`width : ${ePos.width}`,`height : ${ePos.height}`)
    // console.log(`window.pageXOffset : ${window.pageXOffset}`,`ePos.left : ${ePos.left}`,`eStyle.borderLeftWidth : ${eStyle.borderLeftWidth}`,`eStyle.paddingLeft : ${eStyle.paddingLeft}`)
    // console.log(`window.pageYOffset : ${window.pageYOffset}`,`ePos.top : ${ePos.top}`,`eStyle.borderTopWidth : ${eStyle.borderTopWidth}`,`eStyle.paddingTop : ${eStyle.paddingTop}`)
    // console.log(`eStyle.borderLeftWidth : ${eStyle.borderLeftWidth}`,`ePoseStyle.paddingLeft : ${eStyle.paddingLeft}`,`eStyle.borderRightWidth : ${eStyle.borderRightWidth}`,`eStyle.paddingRight : ${eStyle.paddingRight}`)
    // console.log(`Left: ${tmpPosWithoutPadding.left}px,Top: ${tmpPosWithoutPadding.top}px,width: ${tmpPosWithoutPadding.width}px,height: ${tmpPosWithoutPadding.height}px`)


    if(dispTraceMode) displayTrace();
    if(chkEventType()){
      const readyEventType = eventTypeList[eventType].length > 2 ? eventTypeList[eventType].shift() : undefined;

      const firstEventType = eventTypeList[eventType][0];
      const secondEventType = eventTypeList[eventType][1];

      // const mousedown_event = new MouseEvent(firstEventType, mouse_eventInit);
      // const mouseup_event = new MouseEvent(secondEventType, mouse_eventInit);
      const mousedown_event = new MouseEvent(firstEventType, addButtonsOptionToMouse_eventInit(1));
      const mouseup_event = new MouseEvent(secondEventType, addButtonsOptionToMouse_eventInit(0));

      const dispatchMousedownup = ()=>{
        element.dispatchEvent(mousedown_event);
        if(secondEventType) setTimeout(()=>{element.dispatchEvent(mouseup_event)} , 1000 * 1/60);
      }

      // console.log('clickWithPos');
      if(readyEventType){
        element.dispatchEvent(new MouseEvent(readyEventType,addButtonsOptionToMouse_eventInit(0)));
        setTimeout(dispatchMousedownup,15);
      }else{
        dispatchMousedownup();
      }

    }else{
      // console.log('clickWithPos');
      element.dispatchEvent(new MouseEvent(eventType, mouse_eventInit))
    }
  }
}

// function writeArc(canvas,x,y,radius,fillColor){
//   // const canvas = document.getElementById('canvas');
//   if(!canvas){
//     console.log("canvas is not found.")
//   // }else{
//   //   console.log('canvas:' + canvas);
//   }
//   // const testString = ['2d','webgl','webgl2','webgpu','bitmaprenderer'];
//   // testString.forEach((cType)=>{
//   //   console.log(cType + ':' + canvas.getContext(cType));
//   // });//webgl2に変更した模様;
//   const ctx = canvas.getContext('2d');

//   // 点の位置
//   // const x = 100;
//   // const y = 50;

//   // 点の色
//   // const fillColor = '#f00';

//   // 点の大きさ (半径)
//   // const radius = 5;

//   // 描画
//   // console.log(x,y)
//   ctx.beginPath();
//   ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
//   ctx.fillStyle = fillColor;
//   ctx.fill();
// }

function writeRect(canvas, x, y, width, height, fillColor) {
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = fillColor;
  ctx.fill();
}

function shuffle(array) {
  return array.reduce((acc, curr, i) => {
    let j = Math.floor(Math.random() * (i + 1));
    [acc[i], acc[j]] = [acc[j], acc[i]];
    return acc;
  }, array);
}

function dispVer(){
  console.__log = console.log;
  console.log = function(){

    const v = arguments[0];
    if(typeof(v) == 'string'){
      if(/VER/.test(v)){
        document.title = v;
      }
    }
    return console.__log.apply(this, arguments);
  }
}

function spotdiffMain(){
  let isRecievedAnswer = false;

  let canvasPointArray = [];
  let canvasPointArray2 = [];
  let clickOrderArray = [];
  let clickIdx = 0;
  // let chkReactionIdx = undefined;//idxの物がCM表示で押せてないかどうかを確認
  let clickCMTimer;
  const clickCMDelay = 5000;
  let canvas = null;
  let phase = 0;
  let autoMode = !!isAuto;

  const answerDelayMax = 7;
  const answerDelayMin = 1;

  let helpCanvas = null;
  const makeHelpCanvas = ()=>{
    const helpCanvasId = 'helpCanvas';
    if(helpCanvas !== null || document.querySelector('#' + helpCanvasId)){
      console.warn('すでにあるのでCanvasは再度作成しません');
      return false;
    }
    if(!canvas){
      canvas = document.querySelector('canvas');
    }
    helpCanvas = document.createElement('canvas');
    helpCanvas.width = canvas.width;
    helpCanvas.height = canvas.height;

    helpCanvas.id = helpCanvasId;
    const computedStyle = window.getComputedStyle(canvas);
    helpCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: ${computedStyle.width};
      height: ${computedStyle.height};
      z-index: 100;
      opacity: 0.4;
      pointer-events: none;
      `;
    const pElement = canvas.parentElement;
    if(pElement){
      pElement.style.cssText = `
        position: relative;
      `;
      pElement.appendChild(helpCanvas);
    }
    const style = document.createElement('style');
    style.textContent = `
      .hint_hidden {
        display: none;
      }
    `;
    document.head.appendChild(style);

  };

  const cmCloseBtn = {
    left : 67 / 372,
    top : 200 / 562,
    width : 245 / 372,
    height : 60 / 562
  }
  const startBtn = {
    // left : 63 / 336,
    // top : 327 / 506,
    // width : 222 / 336,
    // height : 63 / 506
    left : 63 / 364,
    top : 376 / 550,
    width : 240 / 364,
    height : 70 / 550
  }

  // const screenShotInfo = {
  //   width : 572,
  //   height : 864,
  //   pictureStartX : 21,
  //   pictureStartY : 501,
  //   pictureEndX : 553,
  //   pictureEndY : 857,
  // }
  // const screenShotInfo = {
  //   width : 372,
  //   height : 562,
  //   pictureStartX : 13,
  //   pictureStartY : 327,
  //   pictureEndX : 360,
  //   pictureEndY : 558,
  // }

// // 2024/08/22/1
//   const screenShotInfo = {
//     width : 372,
//     height : 562,
//     pictureStartX : 15,
//     pictureStartY : 323,
//     pictureEndX : 356,
//     pictureEndY : 550,
//   }
// // 2025/04/21/1
//   const screenShotInfo = {
//     width : 429.6,
//     height : 648,
//     pictureStartX : 16,
//     pictureStartY : 372,
//     pictureEndX : 411,
//     pictureEndY : 634,
//   }
// 2025/04/27/1
  const screenShotInfo = {
    width : 645,
    height : 972,
    pictureStartX : 27,
    pictureStartY : 559,
    pictureEndX : 617,
    pictureEndY : 951,
  }
  const answerFieldInfo = {
    width : 600,
    height : 400,
  }
  const clickNoize = 3;
  const clickMargin = 4;

  const pictureRatio = (screenShotInfo.pictureEndX - screenShotInfo.pictureStartX) / answerFieldInfo.width;

  $(document).ajaxSuccess(function(event, xhr, settings) {
      if(/spotdiffapi\/start\.json/.test(settings.url)){
        if(iseditisInsteAD){
          //よみぽ以外は青幕を表示するので以下の設定で表示しないように
          gameConfig.isInsteAD = false;
        }

        const resObj = JSON.parse(xhr.responseText);
//{"status":"OK","data":{"question":{"answer_json_array":[{"x_to":519,"y_to":374,"x_from":460,"y_from":327,"answer_number":1,"is_completed_answer":false},{"x_to":72,"y_to":381,"x_from":3,"y_from":326,"answer_number":2,"is_completed_answer":false},{"x_to":370,"y_to":364,"x_from":256,"y_from":284,"answer_number":3,"is_completed_answer":false},{"x_to":567,"y_to":310,"x_from":505,"y_from":278,"answer_number":4,"is_completed_answer":false},{"x_to":453,"y_to":347,"x_from":387,"y_from":258,"answer_number":5,"is_completed_answer":false},{"x_to":261,"y_to":297,"x_from":204,"y_from":243,"answer_number":6,"is_completed_answer":false},{"x_to":596,"y_to":289,"x_from":550,"y_from":233,"answer_number":7,"is_completed_answer":false},{"x_to":204,"y_to":244,"x_from":135,"y_from":197,"answer_number":8,"is_completed_answer":false},{"x_to":440,"y_to":254,"x_from":363,"y_from":197,"answer_number":9,"is_completed_answer":false},{"x_to":548,"y_to":237,"x_from":464,"y_from":170,"answer_number":10,"is_completed_answer":false},{"x_to":446,"y_to":168,"x_from":293,"y_from":102,"answer_number":11,"is_completed_answer":false},{"x_to":234,"y_to":124,"x_from":166,"y_from":82,"answer_number":12,"is_completed_answer":false},{"x_to":157,"y_to":58,"x_from":101,"y_from":0,"answer_number":13,"is_completed_answer":false},{"x_to":542,"y_to":34,"x_from":392,"y_from":4,"answer_number":14,"is_completed_answer":false},{"x_to":121,"y_to":260,"x_from":8,"y_from":149,"answer_number":15,"is_completed_answer":false},{"x_to":346,"y_to":252,"x_from":266,"y_from":172,"answer_number":16,"is_completed_answer":false}],"score_time":480,"total_time":960,"question_id":"90","question_file_name":"109_A.png","similar_file_name":"109_B.png","answer_json":"[{\u0022x_to\u0022: 519, \u0022y_to\u0022: 374, \u0022x_from\u0022: 460, \u0022y_from\u0022: 327, \u0022answer_number\u0022: 1}, {\u0022x_to\u0022: 72, \u0022y_to\u0022: 381, \u0022x_from\u0022: 3, \u0022y_from\u0022: 326, \u0022answer_number\u0022: 2}, {\u0022x_to\u0022: 370, \u0022y_to\u0022: 364, \u0022x_from\u0022: 256, \u0022y_from\u0022: 284, \u0022answer_number\u0022: 3}, {\u0022x_to\u0022: 567, \u0022y_to\u0022: 310, \u0022x_from\u0022: 505, \u0022y_from\u0022: 278, \u0022answer_number\u0022: 4}, {\u0022x_to\u0022: 453, \u0022y_to\u0022: 347, \u0022x_from\u0022: 387, \u0022y_from\u0022: 258, \u0022answer_number\u0022: 5}, {\u0022x_to\u0022: 261, \u0022y_to\u0022: 297, \u0022x_from\u0022: 204, \u0022y_from\u0022: 243, \u0022answer_number\u0022: 6}, {\u0022x_to\u0022: 596, \u0022y_to\u0022: 289, \u0022x_from\u0022: 550, \u0022y_from\u0022: 233, \u0022answer_number\u0022: 7}, {\u0022x_to\u0022: 204, \u0022y_to\u0022: 244, \u0022x_from\u0022: 135, \u0022y_from\u0022: 197, \u0022answer_number\u0022: 8}, {\u0022x_to\u0022: 440, \u0022y_to\u0022: 254, \u0022x_from\u0022: 363, \u0022y_from\u0022: 197, \u0022answer_number\u0022: 9}, {\u0022x_to\u0022: 548, \u0022y_to\u0022: 237, \u0022x_from\u0022: 464, \u0022y_from\u0022: 170, \u0022answer_number\u0022: 10}, {\u0022x_to\u0022: 446, \u0022y_to\u0022: 168, \u0022x_from\u0022: 293, \u0022y_from\u0022: 102, \u0022answer_number\u0022: 11}, {\u0022x_to\u0022: 234, \u0022y_to\u0022: 124, \u0022x_from\u0022: 166, \u0022y_from\u0022: 82, \u0022answer_number\u0022: 12}, {\u0022x_to\u0022: 157, \u0022y_to\u0022: 58, \u0022x_from\u0022: 101, \u0022y_from\u0022: 0, \u0022answer_number\u0022: 13}, {\u0022x_to\u0022: 542, \u0022y_to\u0022: 34, \u0022x_from\u0022: 392, \u0022y_from\u0022: 4, \u0022answer_number\u0022: 14}, {\u0022x_to\u0022: 121, \u0022y_to\u0022: 260, \u0022x_from\u0022: 8, \u0022y_from\u0022: 149, \u0022answer_number\u0022: 15}, {\u0022x_to\u0022: 346, \u0022y_to\u0022: 252, \u0022x_from\u0022: 266, \u0022y_from\u0022: 172, \u0022answer_number\u0022: 16}]","answer_count":"16","status":"1","created_at":"2024-02-07 18:20:27","updated_at":"2024-02-08 10:59:38"}}}
        const updateAt= resObj.data.updated_at;
        console.log(updateAt);
        const answer_array = resObj.data.question.answer_json_array;

        // const answer_array2 = JSON.parse(resObj.data.question?.answer_json);//同じだったので不要
        // console.log('answer_array',answer_array);
        const answerFieldPointArray = answer_array.map(e=>{
          const x = Math.floor((Number(e.x_to) + Number(e.x_from)) / 2);
          const y = Math.floor((Number(e.y_to) + Number(e.y_from)) / 2);
          return [x,y];
        });

        const answerFieldPointArray2 = answer_array.map(e=>{
          return {
            left:Number(e.x_from),
            top:Number(e.y_from),
            width:Number(e.x_to) - Number(e.x_from),
            height:Number(e.y_to) - Number(e.y_from)
          };
        });

        canvasPointArray = answerFieldPointArray.map(e=>{
          const x = screenShotInfo.pictureStartX + Math.floor(e[0] * pictureRatio);
          const y = screenShotInfo.pictureStartY + Math.floor(e[1] * pictureRatio);
          return [x,y];
        });

        canvasPointArray2 = answerFieldPointArray2.map(e=>{
          return {
            left:screenShotInfo.pictureStartX + Math.floor(e.left * pictureRatio),
            top:screenShotInfo.pictureStartY + Math.floor(e.top * pictureRatio),
            width:Math.floor(e.width * pictureRatio),
            height:Math.floor(e.height * pictureRatio)
          };
        });

        // console.log(`canvasPointArray:`,canvasPointArray);
        // console.log(`canvasPointArray2:`,canvasPointArray2);
        clickOrderArray = answer_array.map((e,idx)=>idx);
        clickOrderArray = shuffle(clickOrderArray);
        canvas = document.querySelector('canvas');
        phase = 1;
      }else if(/spotdiffapi\/answer\.json/.test(settings.url)){
        if(autoMode){
          clearTimeout(clickCMTimer);
          phase++;
          setTimeout(()=>{
            clickAnsidx(phase - 1);
            // clickAnsidx2(phase - 1);
          },1000 * Math.random() * (answerDelayMax - answerDelayMin) + 1000 * answerDelayMin);
        }
      }else if(/spotdiffapi\/finish\.json/.test(settings.url)){
        autoMode = false;
      }else{
        // console.log(event,xhr,settings);
      }
  });

  function clickCMCloseBtn(){
    if(!canvas){
      canvas = document.querySelector('canvas');
    }
    // clickWithPos(canvas,cmCloseBtn,'mousedownup',2);
    clickWithPos(canvas,cmCloseBtn,'pointerdownup',2);
  }
  function clickStartBtn(){
    if(!canvas){
      canvas = document.querySelector('canvas');
    }
    // clickWithPos(canvas,startBtn,'mousedownup',2);
    clickWithPos(canvas,startBtn,'pointerdownup',2);
  }

  function dispAns(){
    if(canvasPointArray2.length === 0) return false;
    if(!canvas) canvas = document.querySelector('canvas');
    if(!helpCanvas){
      makeHelpCanvas();
    }
    const length = canvasPointArray2.length;

    if(canvas && length != 0){
      console.log('dispAns');
      const width = canvas.width;
      const ratio = width / screenShotInfo.width;
      const color = hintColor;

      for(let i = 0; i < length; i++){
        if(ratio === 1){
          writeRect(helpCanvas, canvasPointArray2[i].left, canvasPointArray2[i].top, canvasPointArray2[i].width, canvasPointArray2[i].height, color);
        }else{
          writeRect(helpCanvas, Math.floor(canvasPointArray2[i].left * ratio), Math.floor(canvasPointArray2[i].top * ratio), Math.floor(canvasPointArray2[i].width * ratio), Math.floor(canvasPointArray2[i].height * ratio), color);
        }
      }
    }
  }
  function toggleDispAns(){
    if(!helpCanvas){
      dispAns();
    }else{
      if(!helpCanvas.classList.contains('hint_hidden')){
        helpCanvas.classList.add('hint_hidden');
      }else{
        helpCanvas.classList.remove('hint_hidden');
      }
    }
  }

  function chkAnswer(){
    clearTimeout(clickCMTimer);
    clickCMTimer = setTimeout(()=>{
      console.log('call chkAnswer');
      // clickCMCloseBtn();//一次的に
      setTimeout(()=>{clickAnsidx(phase - 1)},1000);
    },clickCMDelay);
  }
//   function clickAnsidx(num){
//     if(canvas && canvasPointArray.length != 0){
//       // console.log('dispAns');
//       const width = canvas.width;
//       const ratio = width / screenShotInfo.width;
//       const noizeWidth = clickNoize;
//       const noizeOffset = Math.floor(clickNoize / 2);
//       const length = canvasPointArray.length;
//       let i = clickOrderArray[clickIdx];
//       console.log(num);
//       // chkReactionIdx = clickIdx;
//       if(num){
//         i = clickOrderArray[num];
//         // chkReactionIdx = num;
//       }
//       if(length > i){
//         let pos = {
//           x : undefined,
//           y : undefined,
//           width : undefined,
//           height : undefined
//         }

//         // pos.x = Math.floor(canvasPointArray[i][0] * ratio) - noizeOffset;
//         // pos.y = Math.floor(canvasPointArray[i][1] * ratio) - noizeOffset;
//         // pos.width = noizeWidth;
//         // pos.height = noizeWidth;
//         pos.x = (canvasPointArray[i][0] - noizeOffset);
//         pos.y = (canvasPointArray[i][1] - noizeOffset);
//         pos.width = noizeWidth;
//         pos.height = noizeWidth;

//         console.log(width,ratio);
//         console.log(i,pos);

//         const ans = {
//           left : pos.x / screenShotInfo.width,
//           top : pos.y / screenShotInfo.height,
//           width : pos.width / screenShotInfo.width,
//           height : pos.height / screenShotInfo.height
//         }



//         chkAnswer();

//         clickWithPos(canvas,ans,'pointerdownup',2)

//         clickIdx++;
//       }
//     }
//   }

  function clickAnsidx(num){
    if(canvas && canvasPointArray.length != 0){
      // console.log('clickAnsidx2');

      let i = clickOrderArray[clickIdx];
      // console.log(num);
      if(num){
        i = clickOrderArray[num];
      }
      console.log(i);

      if(clickOrderArray.length > i){

        let ans = {
          left : ( canvasPointArray2[i].left + clickMargin ),
          top : ( canvasPointArray2[i].top + clickMargin ),
          width : ( canvasPointArray2[i].width - clickMargin * 2),
          height : ( canvasPointArray2[i].height - clickMargin * 2)
        }
        console.log(ans);
        ans = {
          left : (ans.left <= 0 ? 1 : ans.left) / screenShotInfo.width,
          top : (ans.top <= 0 ? 1 : ans.top) / screenShotInfo.height,
          width : (ans.width <= 0 ? 1 : ans.width) / screenShotInfo.width,
          height : (ans.height <= 0 ? 1 : ans.height) / screenShotInfo.height
        }


        chkAnswer();

        clickWithPos(canvas,ans,'pointerdownup',1);

        clickIdx++;
      }
    }
  }

  function chainKey(e){
    // console.log(e.code);
    if(e.code == 'Numpad0' || e.code == 'Space'){
      if(phase === 0){
        clickStartBtn();
      }else if(phase >= 1){
        // dispAns();
        gmoGame.scene.showHint();
      }
    }else if(e.code == 'Numpad1'){
      clickAnsidx();
    }else if(e.code == 'Numpad3'){
      toggleDispAns();
    }
  }

  function autoGame(){
    let obs = setInterval(()=>{
      if(phase === 0){
        clickStartBtn();
      }else if(phase >= 1){
        clearInterval(obs);
        setTimeout(()=>{
          clickAnsidx(phase - 1);
        },1000 * Math.random() * (answerDelayMax - answerDelayMin) + 1000 * answerDelayMin);
      }
    },5000);
  }
  document.addEventListener('keydown', chainKey);

  if(isAuto){
    dispVer();
    autoGame();
  }

}
function addStyleForSpotdiff(){
  (function() {
    const style = document.createElement('style');
    style.textContent = `
        .c-page-game__side,
        .c-page-game__footer {
            display:none !important;
        }
        .c-page-game__main {
            padding-bottom: unset;
            margin-left: unset;
            margin-right: unset;
        }
        #animation_container {
            width: unset !important;
            height: unset !important;
        }
        #gmoGame {
            width: unset !important;
            height: 100svh !important;
        }
    `;
    document.head.appendChild(style);
})();
}
function ini(){
  DOCURL = document.URL;
  if(/result/.test(DOCURL)){
    // document.querySelector('.btn-action').focus();
    const btnNextGame = document.querySelector('.btn-action');
    if(isAuto && btnNextGame){
      btnNextGame.click();
    }
    const links =  document.querySelectorAll('.c-result a');
    if(links.length > 0){
      addEventListener('keydown',(e)=>{
        const maxNum = Math.max(9,links.length);
        if(new RegExp('[1-' + maxNum + ']').test(e.key)){
           links[Number(e.key) - 1].focus();
        }
      });
    }
  }else if(/game\/.*/.test(DOCURL)){
    if(editStyle === true){
      addStyleForSpotdiff();
    }
    spotdiffMain();
  }else if(/spotdiff(?:\?.+|$)/.test(DOCURL)){

    const btnNextGame = document.querySelector('.btn-action');
    if(isAuto && btnNextGame){
      btnNextGame.click();
    }
    const btn = document.querySelector('.c-top-eyecatch__l-btn a');
    if(isAuto && btn){
      btn.focus();
      btn.click();
    }
  }
}

if(window.top === window.self){
  ini();
}