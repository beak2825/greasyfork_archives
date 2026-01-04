// ==UserScript==
// @name        부동산 매물 가격 필터 for 월부_Upgrade / addClickFnc / shinhoLightFnc / 개인 커스텀 버전
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     1.1
// @author      모느나
// @description Please use with violentmonkey
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/458765/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%A7%A4%EB%AC%BC%20%EA%B0%80%EA%B2%A9%20%ED%95%84%ED%84%B0%20for%20%EC%9B%94%EB%B6%80_Upgrade%20%20addClickFnc%20%20shinhoLightFnc%20%20%EA%B0%9C%EC%9D%B8%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%EB%B2%84%EC%A0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/458765/%EB%B6%80%EB%8F%99%EC%82%B0%20%EB%A7%A4%EB%AC%BC%20%EA%B0%80%EA%B2%A9%20%ED%95%84%ED%84%B0%20for%20%EC%9B%94%EB%B6%80_Upgrade%20%20addClickFnc%20%20shinhoLightFnc%20%20%EA%B0%9C%EC%9D%B8%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%EB%B2%84%EC%A0%84.meta.js
// ==/UserScript==


new ClipboardJS('.copyBtn');

let isCreateCheckArea = false
let checkAreaValue = false

const AREA_CHECK = 'area_check';
const LOW_JEONSE_CHECK = 'low_jeonse_check'
const SEANGO_CHECK = 'seango_check'
const SHINHO_RADIO = 'shiho_radio'

const STORE_NAME = 'wolbu_price_filter'
const STORE_VALUE = { [AREA_CHECK]: false, [LOW_JEONSE_CHECK]: false, [SEANGO_CHECK]: false};

const SIGN_LOW_VALUE = 5;
const SIGN_MIDDLE_VALUE = 10;

const validityCheck = {
  [SHINHO_RADIO] : { isCreate : false,  value: 1 , defValue: [{val: 1, text: "X1"}, {val: 2, text: "X2"}, {val: 3, text: "X3"}], title: "신호등", type: "radio"}
  , [SEANGO_CHECK] : { isCreate : false,  value: false, title: "세안고포함", type: "check"}
  , [LOW_JEONSE_CHECK] : { isCreate : false,  value: false, title: "최저전세값", type: "check"}
  , [AREA_CHECK] : { isCreate : false,  value: false, title: "35평이상 포함", type: "check"}
}


// get local store value
function getStoreValue(id){

  let storeVal = localStorage.getItem(STORE_NAME);

  if(!storeVal){
    localStorage.setItem(STORE_NAME, JSON.stringify(STORE_VALUE) );
    storeVal = localStorage.getItem(STORE_NAME);
  }


  return JSON.parse(storeVal)[id]

}

// set local store value
function setStoreValue(id, val){

  let storeVal = localStorage.getItem(STORE_NAME)

  if(!storeVal)
      localStorage.setItem(STORE_NAME, JSON.stringify(STORE_VALUE) );

  let parseVal = JSON.parse(storeVal);
  parseVal[id] = val;
  localStorage.setItem(STORE_NAME, JSON.stringify(parseVal) );

}

function CheckBox(id, target){

  this.div_id = 'div_'+id;
  this.id = id;
  this.labelText = validityCheck[id].title;
  this.divEle = this.init();
  target.after(this.divEle);

  let storeVal = getStoreValue(this.id);
  validityCheck[id].value = storeVal
  document.querySelector('#'+id).checked = storeVal;

  document.querySelector('#'+id).addEventListener('change', function(e){
    validityCheck[id].value = this.checked;
    setStoreValue(id, this.checked)

  });
  validityCheck[id].isCreate = true;

}

CheckBox.prototype = {
  constructor : CheckBox
  , init: function(){

     const divEle = document.createElement('div');
     divEle.setAttribute('id', this.div_id)
     divEle.classList.add('filter_group', 'filter_group--size');
     divEle.style.margin= '6px 10px 0 0';
     divEle.innerHTML = '<input type="checkbox" name="type" id="'+this.id+'" class="checkbox_input" ><label for="'+this.id+'" class="checkbox_label">'+this.labelText+'</label>';
     return divEle;

  }
}



function RadioBox(id, target){

  this.div_id = 'div_'+id;
  this.id = id;
  this.valArr = validityCheck[id].defValue;
  this.divEle = this.init();
  target.after(this.divEle);

  let storeVal = getStoreValue(this.id) || 1;
  validityCheck[id].value = storeVal;

  $("input:radio[name=signal]:radio[value='"+storeVal+"']").prop("checked", true);

  $('input[type=radio][name=signal]').change(function(){
    console.log($(this).val())
    validityCheck[id].value = $(this).val();
    setStoreValue(id, $(this).val())
  });

//   document.querySelector('#'+id).checked = storeVal;

//   document.querySelector('#'+id).addEventListener('change', function(e){
//     validityCheck[id].value = this.checked;
//     setStoreValue(id, this.checked)

//   });
  validityCheck[id].isCreate = true;

}

RadioBox.prototype = {
  constructor : RadioBox
  , init: function(){

     const divEle = document.createElement('div');
     divEle.setAttribute('id', this.div_id)
     divEle.classList.add('filter_group', 'filter_group--size');
     divEle.style.margin= '6px 10px 0 0';

     let radioBoxs = "";
     for( let i = 0; i < this.valArr.length; i++){

       let val = this.valArr[i];
       radioBoxs += `<input type="radio" name="signal" id="shinho_${i}" class="radio_input" value="${val.val}"><label for="shinho_${i}" class="radio_label" style="margin-right: 10px; padding-left: 20px;">${val.text}</label>`;
     }


     divEle.innerHTML = radioBoxs;
     return divEle;

  }
}



// 신호등 불빛 결정
function sinhoCheck(signalVal, gap){
  console.log('signalVal', signalVal)
  let multiple =  validityCheck[SHINHO_RADIO].value;
  let tootip = `${signalVal}% / ${gap}`

  if( signalVal < ( SIGN_LOW_VALUE * multiple ) ) return ['green', tootip];
  else if( signalVal <= ( SIGN_MIDDLE_VALUE * multiple ) ) return ['orange', tootip];
  return ['red', tootip]

}


//   상황에 따라 분기가 필요할 수도
function createBox(key, type){
  if( type === "check")
    new CheckBox(key, document.querySelector('.filter_btn_detail'));
  else
    new RadioBox(key, document.querySelector('.filter_btn_detail'));
}

function checkMandantoryCondition(size) {


    //  35평이상 포함여부 check
    //if(!validityCheck[AREA_CHECK].isCreate)      createCheckBox(AREA_CHECK);
    if( validityCheck[AREA_CHECK].value )   return true;


    // 35평 미만
    if (/\d+/g.exec(size) > (35 * 3.3)) {
        //console.log('Filtered by size - ', size);
        return false;
    }
    // todo : 300세대 미만, 용적률, 기타등등
    return true;
}

function getFloor(strFloor) {
    return strFloor.replace("층", "").split('/');
}

function checkItemCondition(tradeType, floor, spec) {

    //매매, 전세
    if (tradeType != "전세" && tradeType != "매매") {
        //console.log('Filtered by trade type - ', tradeType);
        return false;
    }

    // 세안고 제외
    if ( !validityCheck[SEANGO_CHECK].value && (spec.includes("끼고") || spec.includes("안고") || spec.includes("승계")) ) {
        //console.log('Filtered by spec - ', spec);
        return false;
    } else {
      //console.log('Allowed spec - ', spec);
    }

    // 층 - 전세의 경우 층에 관계없이 최고가 적용
    if (tradeType == "매매") {
        // 층 명확하지 않은 것 제외
        var _floorInfo = getFloor(floor);
        if (_floorInfo[0] == "저") {
            //console.log('Filtered by floor - ', _floorInfo);
            return false;
        }
        // 1층, 2층, 탑층 제외
        if ("1|2|3".indexOf(_floorInfo[0]) > -1 || _floorInfo[0] == _floorInfo[1]) {
            //console.log('Filtered by floor - ', _floorInfo);
            return false;
        }

        // 5층 이상 건물에서 3층 이하 제외
        if (_floorInfo[1] >= 5 && _floorInfo[0] <= 3) {
            //console.log('Filtered by floor - ', _floorInfo);
            return false;
        }
    }
    return true;
}

function parsePrice(tradePrice) {
    tradePrice = tradePrice.replace(" ", "").replace(",", "");
    if (tradePrice.includes("억"))
        return parseInt(tradePrice.split("억")[0] * 10000) + (parseInt(tradePrice.split("억")[1]) || 0);
    else
        return parseInt(tradePrice)
}

function getPrice_WeolbuStandard() {


    let result = {};
    let dictPricePerSize = {};
    let tradeTypeValueFnc = function( tradeType, befVal, newVal){

      let price, floor, spec;

      if( tradeType === '매매'){
          price = befVal[0] > newVal[0] ? newVal[0] :  befVal[0]
          floor = befVal[0] > newVal[0] ? newVal[1] :  befVal[1]
      }else {

        if(validityCheck[LOW_JEONSE_CHECK].value)
          price = befVal[0] < newVal[0] ? befVal[0] : newVal[0]
        else
          price = befVal[0] < newVal[0] ? newVal[0] : befVal[0]

        floor = befVal[0] < newVal[0] ? newVal[1] : befVal[1]

      }

      return [price, floor, befVal[2]+newVal[2], ++befVal[3] ];

    }



    document.querySelectorAll("#articleListArea > div").forEach(function(ele) {
        // console.log( ele.querySelectorAll("div.info_area .line .spec")[0].innerText)
        let aptInfo = ele.querySelectorAll("div.info_area .line .spec")[0].innerText.split(", ");
        let size = aptInfo[0];  // 103/84m^2
        let floor = aptInfo[1]; // 3/10층
        let tradeType = ele.querySelector("div.price_line .type").innerText; // 매매, 전세
        let tradePrice = parsePrice(ele.querySelector("div.price_line .price").innerText); // 141000
        let spec = ele.querySelectorAll(" div.info_area > p:nth-child(2) > span")[0]; // 확장올수리, 정상입주, 수내중학군
        spec = spec ? spec.innerText : "";



        if( "매매|전세".indexOf(tradeType) > -1){
          if (!checkMandantoryCondition(size)) {
              return;
          }

          if (!(size in result)){
            result[size] = {'매매': 0, '전세': 0, '갭': 0, '전세가율': '-', '매매층': '-', '전세층': '-', '매매갯수': 0, '전세갯수': '0', '매매신': ''};
            dictPricePerSize[size] = {"매매": {}, "전세": {}};
          }

          if( !document.querySelector('#address_group2').checked){
            if( !dictPricePerSize[size][tradeType][aptInfo.join(',')] )
            {
              dictPricePerSize[size][tradeType][aptInfo.join(',')] = [tradePrice, getFloor(floor)[0], spec, 1]
            }
            else
            {
              let beforeValue = dictPricePerSize[size][tradeType][aptInfo.join(',')];
              let newValue = [tradePrice, getFloor(floor)[0], spec ];

              dictPricePerSize[size][tradeType][aptInfo.join(',')] = tradeTypeValueFnc(tradeType, beforeValue, newValue)

            }
          }
          else
          {
            if( !dictPricePerSize[size][tradeType][aptInfo.join(',')+"_"+tradePrice] )
            {
              dictPricePerSize[size][tradeType][aptInfo.join(',')+"_"+tradePrice] = [tradePrice, getFloor(floor)[0], spec, 1]
            }
            else
            {
              let beforeValue = dictPricePerSize[size][tradeType][aptInfo.join(',')+"_"+tradePrice];
              let newValue = [tradePrice, getFloor(floor)[0], spec ];

              dictPricePerSize[size][tradeType][aptInfo.join(',')+"_"+tradePrice] = tradeTypeValueFnc(tradeType, beforeValue, newValue)

            }
          }

        }

    });


    let isGrouped = document.querySelector('#address_group2').checked;

    for( let key in result){
      let sellObj = dictPricePerSize[key]['매매'];
      let liveObj = dictPricePerSize[key]['전세'];

      let sellCnt = !isGrouped ? Object.keys(sellObj).length : Object.entries(sellObj).reduce( (acc, [, item]) => (parseInt(acc) + parseInt(item[3])), 0 );
      let liveCnt = !isGrouped ? Object.keys(liveObj).length : Object.entries(liveObj).reduce( (acc, [, item]) => (parseInt(acc) + parseInt(item[3])), 0 );



      // console.log(JSON.parse(JSON.stringify(sellObj)));
      // console.log(sellCnt, liveCnt)

      for( let key in sellObj ){

        let aptObj = sellObj[key];

        // if (!checkItemCondition('매매', aptObj[1], aptObj[2])){
        if (!checkItemCondition('매매', key.split(",")[1], aptObj[2])){

          delete sellObj[key]
        }
      }

      let finalSellObj = Object.entries(sellObj).sort(([, a], [, b]) => a[0] - b[0]);
      let finalLivelObj = Object.entries(liveObj).sort(([, a], [, b]) => b[0] - a[0]);

      if(finalSellObj && finalSellObj.length){
        let sellPrice = finalSellObj[0][1][0];

        result[key]['매매'] = finalSellObj[0][1][0];
        result[key]['매매층'] = finalSellObj[0][1][1];


        // 신호등 기능
        if( isGrouped ){
          let compareObj = finalSellObj.filter( item => item[1][0] > sellPrice );

          if(compareObj && compareObj.length){

            let comparePrice =  compareObj[0][1][0];
            let compareRate = ( 100 - ( parseInt(sellPrice) / comparePrice * 100)).toFixed(1);

            console.log('비교값', result[key], comparePrice);
            result[key]['매매신'] = sinhoCheck(compareRate, comparePrice-parseInt(sellPrice) )
          }
        }


      }

      result[key]['매매갯수'] = sellCnt;

      if(finalLivelObj && finalLivelObj.length){
        let idx = validityCheck[LOW_JEONSE_CHECK].value ? finalLivelObj.length-1 : 0;

        result[key]['전세'] = finalLivelObj[idx][1][0];
        result[key]['전세층'] = finalLivelObj[idx][1][1];
        result[key]['전세갯수'] = liveCnt;

        result[key]['갭'] = parseInt(result[key]['매매']) - parseInt(result[key]['전세']);
        result[key]['전세가율'] = parseInt( parseInt(result[key]['전세']) / parseInt(result[key]['매매']) * 100) + "%";
      }
    }

    return result;
}

// 신호등 그리기
function makeShinhoDot(shinhoColor){

  let canvasDiv = document.createElement("div");
  canvasDiv.style.display = "inline"

  if(typeof shinhoColor === 'object'){
    canvasDiv.title = shinhoColor[1]
    shinhoColor = shinhoColor[0]
  }


  let canvas = document.createElement('canvas')
  canvas.width = 20
  canvas.height  = 20
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(8, 8, 4, 0, 2*Math.PI);
  ctx.stroke();
  ctx.fillStyle = shinhoColor;
  ctx.fill();
  canvasDiv.appendChild(canvas);
  return canvasDiv;

}


function addInfoToScreen(infos) {

    let isGrouped = document.querySelector('#address_group2').checked;
    var oldScreenInfo = document.querySelector("#summaryInfo > div.complex_summary_info > div.complex_price_info");
    if (oldScreenInfo)
        oldScreenInfo.remove();

    var screenInfo = document.createElement('div');
    screenInfo.setAttribute('class', 'complex_price_info');
    screenInfo.style.marginTop = "10px";

    let isFirst = true;

    for (let size in infos) {

        var strTradePriceInfo = (infos[size]['매매'] ? infos[size]['매매'] + "/" + infos[size]['매매층'] : "0/-");
        var strLeasePriceInfo = (infos[size]['전세'] ? infos[size]['전세'] + "/" + infos[size]['전세층'] : "0/-");

        var additionalInfos = [];
        if (infos[size]['매매'] && infos[size]['전세']) {
            additionalInfos.push(infos[size]['갭']);
            additionalInfos.push(infos[size]['전세가율']);
        }

        if (infos[size]['매매']) {
            var py = parseInt(/\d+/g.exec(size), 10) / 3.3;
            additionalInfos.push(parseInt(infos[size]['매매'] / py) + "/3.3m²");
        }

        var strAdditionalInfo = "";
        // if (additionalInfos.length > 0){

          // strAdditionalInfo += "  (" + additionalInfos.join(", ") + ")("+infos[size]['매매갯수']+"/"+infos[size]['전세갯수']+")";

          if(document.querySelector('#address_group2').checked)
            strAdditionalInfo += additionalInfos.length > 0 ? "  (" + additionalInfos.join(", ") + ")("+infos[size]['매매갯수']+"/"+infos[size]['전세갯수']+")" : "  ("+infos[size]['매매갯수']+"/"+infos[size]['전세갯수']+")";
          else
            strAdditionalInfo += additionalInfos.length > 0  ? "  (" + additionalInfos.join(", ") + ")" : "";


        // }

        //신호등 description
        if( isGrouped && isFirst ){

            let multiple =  validityCheck[SHINHO_RADIO].value;

            let shinhoDesc = document.querySelector("#summaryInfo > div.complex_summary_info > div.complex_trade_wrap > div > dl:nth-child(1)").cloneNode();
            shinhoDesc.setAttribute("added", true);
            let shinhoDt = document.createElement("dt")
            let greenDot = makeShinhoDot('green')
            let orangeDot = makeShinhoDot('orange')
            let redDot = makeShinhoDot('red')


            let greenDescEle = document.createElement("span")
            greenDescEle.innerHTML =`${SIGN_LOW_VALUE*multiple}%미만`;
            greenDescEle.style.margin = "0 8px 0 -3px";
            greenDescEle.classList.add('data');

            let orangeDescEle = document.createElement("span")
            orangeDescEle.innerHTML =`${SIGN_MIDDLE_VALUE*multiple}%미만`;
            orangeDescEle.style.margin  = "0 8px 0 -3px";
            orangeDescEle.classList.add('data');

            let redDescEle = document.createElement("span")
            redDescEle.innerHTML =`${SIGN_MIDDLE_VALUE*multiple}%이상`;
            redDescEle.style.margin  = "0 8px 0 -3px";
            redDescEle.classList.add('data');


            // yelloDot.appendChild(greenDescSpan)

            shinhoDt.appendChild(greenDot);
            shinhoDt.appendChild(greenDescEle);

            shinhoDt.appendChild(orangeDot);
            shinhoDt.appendChild(orangeDescEle);

            shinhoDt.appendChild(redDot);
            shinhoDt.appendChild(redDescEle);

            shinhoDesc.style.lineHeight = '1px';
            shinhoDesc.appendChild(shinhoDt);
            screenInfo.appendChild(shinhoDesc);
            isFirst = false;

        }


        var cloned = document.querySelector("#summaryInfo > div.complex_summary_info > div.complex_trade_wrap > div > dl:nth-child(1)").cloneNode(true);
        cloned.setAttribute("added", true);
        // cloned.getElementsByClassName("title")[0].innerText = size;

        let strTradePrice = parseFloat(parseInt(strTradePriceInfo.split("/")[0]) / 10000).toFixed(2);

        //let grpText  = `${jQuery('#summaryInfo > dl > dd:nth-child(6)').text().substr(2,2)}' ${jQuery('#complexTitle').text()}(${strTradePrice})`;

        // 시세지도용
        //let grpText  = `${jQuery('#complexTitle').text()}\n'${jQuery('#summaryInfo > dl > dd:nth-child(6)').text().substr(2,2)}y / ${jQuery('#summaryInfo > dl > dd:nth-child(2)').text()}`;

        // 시세트레킹 단지 선정
        // let grpText  = `${jQuery('#complexTitle').text()} / '${jQuery('#summaryInfo > dl > dd:nth-child(6)').text().substr(2,2)}y / ${jQuery('#summaryInfo > dl > dd:nth-child(2)').text()}`;

        // 평형비교용 : 문촌1단지우성|'94|31평|49000|35000
        // let grpText  = `${jQuery('#complexTitle').text()}|'${jQuery('#summaryInfo > dl > dd:nth-child(6)').text().substr(2,2)}`;

        // 1등뽑기용 : 하이파크시티일산아이파크1단지|693세대|2011년|33평|47500|35000
        //let grpText  = `${jQuery('#complexTitle').text()}|${jQuery('#summaryInfo > dl > dd:nth-child(2)').text()}|${jQuery('#summaryInfo > dl > dd:nth-child(6)').text().substr(0,4)}년`;

        // 시세그룹핑: 94' 문촌1단지우성 31평 (4.9)
         let grpText  = `${jQuery('#summaryInfo > dl > dd:nth-child(6)').text().substr(2,2)}' ${jQuery('#complexTitle').text()}`;

        // 투자전략 - 99' 두진하트리움 527세대 23평
        // let grpText  = `${jQuery('#summaryInfo > dl > dd:nth-child(6)').text().substr(2,2)}' ${jQuery('#complexTitle').text()} ${jQuery('#summaryInfo > dl > dd:nth-child(2)').text()} ${parseInt(parseInt(size.split("/")[0], 10) / 3.3)}평`;

        // 평계산
        let pyeongCal = `${parseInt(parseInt(size.split("/")[0], 10) / 3.3)}평`;

        // 평계산 - 1등뽑기용
        // let pyeongCal = `${parseInt(size.split("/")[0], 10)}|${parseInt(size.split("/")[1], 10)}|${parseInt(parseInt(size.split("/")[0], 10) / 3.3)}평|${parseInt(parseInt(size.split("/")[1], 10) / 3.3)}평`;
        //console.log(grpText)

        // 1등 뽑기할때 사용 금액
        //let aa = `${grpText}|${pyeongCal}|${strTradePriceInfo.split("/")[0]}|${strLeasePriceInfo.split("/")[0]}`;

        // 임보 - 랜드마크
        // let aa = ` ${grpText} / ${pyeongCal}`;


        // cloned.getElementsByClassName("title")[0].innerHTML = `<button class="copyBtn" data-clipboard-text="${strTradePriceInfo}/${strLeasePriceInfo}" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#555'" onMouseDown="this.style.color='#1F75FE'" onMouseUp="this.style.color='red'">${size}</button>
        //                                                        <button class="copyBtn" data-clipboard-text="${grpText}" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#555'" onMouseDown="this.style.color='#1F75FE'" onMouseUp="this.style.color='red'">G</button>` ;


        // 시세지도용
        //cloned.getElementsByClassName("title")[0].innerHTML = `<button class="copyBtn" data-clipboard-text="${pyeongCal} : ${strTradePriceInfo.split("/")[0]/10000} / ${strLeasePriceInfo.split("/")[0]/10000} / ${strAdditionalInfo.split(",")[1]}" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#555'" onMouseDown="this.style.color='#1F75FE'" onMouseUp="this.style.color='red'">${size}</button>
        //                                                       <button class="copyBtn" data-clipboard-text="${grpText}" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#555'" onMouseDown="this.style.color='#1F75FE'" onMouseUp="this.style.color='red'">G</button>` ;


        // 평형비교용 - 문촌1단지우성|892세대|1994년|31평|49000|35000
       //cloned.getElementsByClassName("title")[0].innerHTML = `<button class="copyBtn" data-clipboard-text="${aa}" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#555'" onMouseDown="this.style.color='#1F75FE'" onMouseUp="this.style.color='red'">${size}</button>
       //                                                       <button class="copyBtn" data-clipboard-text="${grpText}" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#555'" onMouseDown="this.style.color='#1F75FE'" onMouseUp="this.style.color='red'">G</button>` ;

        // 그룹핑용
        cloned.getElementsByClassName("title")[0].innerHTML = `<button class="copyBtn" data-clipboard-text="${grpText} ${pyeongCal} (${strTradePriceInfo.split("/")[0]/10000})" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#555'" onMouseDown="this.style.color='#1F75FE'" onMouseUp="this.style.color='red'">${size}</button>
                                                               <button class="copyBtn" data-clipboard-text="${grpText}" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='#555'" onMouseDown="this.style.color='#1F75FE'" onMouseUp="this.style.color='red'">G</button>` ;

        var trade = cloned.getElementsByClassName("data")[0];
        var lease = trade.cloneNode(true);
        var additionalInfo = trade.cloneNode(true);
        var delim = trade.cloneNode(true);

        // remove, then reordering (please make it more fancy)
        trade.innerText = strTradePriceInfo;
        trade.style.color = '#f34c59';
        lease.innerText = strLeasePriceInfo;
        lease.style.color = '#4c94e8';
        delim.innerText = " / ";
        delim.style.color = '#ffffff';
        additionalInfo.innerText = strAdditionalInfo;

        // remove, then reordering (please make it fancy..)
        cloned.removeChild(trade);

        cloned.appendChild(delim);
        cloned.appendChild(trade);
        cloned.appendChild(delim.cloneNode(true));
        cloned.appendChild(lease);
        cloned.appendChild(delim.cloneNode(true));
        cloned.appendChild(additionalInfo);

        if( isGrouped && infos[size]['매매'] !== 0 && infos[size]['매매신'] !== '')
          cloned.appendChild(makeShinhoDot(infos[size]['매매신']));

        cloned.style.lineHeight = '1px';
        screenInfo.appendChild(cloned);
    }

    document.querySelector("#summaryInfo > div.complex_summary_info").insertBefore(screenInfo, document.querySelector("#summaryInfo > div.complex_summary_info > div.complex_detail_link"))
}




function sortOnKeys(dict) {

  var tempDict = {};

  let sorted = jQuery('#complexOverviewList > div.list_contents > div.list_fixed > div.list_filter > div > div:nth-child(2) > div > div > ul > li label.checkbox_label')
      .map((idx, item) => {
      return item.innerText.replace('㎡', '');
    })


    let keys = Object.keys(dict)


    sorted.map( (idx, item) => {
      keys.map( (key) => {
        if( key.indexOf(item) === 0 ) tempDict[key] = dict[key]
      })
    })

    return tempDict;
}


var g_lastSelectedApt = "";

function addObserverIfDesiredNodeAvailable() {
    var target = document.getElementsByClassName('map_wrap')[0];
    var inDebounce;
    if (!target)
        return;

    //  35평이상 포함여부 check
    // if(!validityCheck[LOW_JEONSE_CHECK].isCreate)   createCheckBox(LOW_JEONSE_CHECK);
    // if(!validityCheck[SEANGO_CHECK].isCreate)       createCheckBox(SEANGO_CHECK);
    // if(!validityCheck[AREA_CHECK].isCreate)         createCheckBox(AREA_CHECK);

    for( let key in validityCheck){
      let obj = validityCheck[key]

      if( !obj.isCreate )
          createBox(key, obj.type)
    }

    jQuery(document).on('click', (e) => {

      if( jQuery(e.target).parents('a.item_link').length > 0 || e.target.className === 'complex_link')
        setTimeout((runFnc) => { jQuery('.detail_panel').css("left", "450px"); }, 500);

    });



    var observer = new MutationObserver(function(mutations) {

        mutations.forEach(function(mutation) {
            [].slice.call(mutation.addedNodes).forEach(function(addedNode) {
                //console.log('???');
                //console.log(addedNode.classList);

                if (!addedNode.classList ||
                    (!addedNode.classList.contains('infinite_scroll') && !addedNode.classList.contains('item'))) {
                    return;
                }

                if (!document.querySelector("#complexTitle")) {
                    console.log("Unexpected issues #1");
                    return;
                }

                if (document.querySelector("#complexTitle").innerText != g_lastSelectedApt) {
                    document.querySelectorAll("#summaryInfo > div.complex_summary_info > div.complex_trade_wrap > div > dl").forEach(function(ele) {
                        if (ele.hasAttribute("added"))
                            ele.remove();
                    });
                    g_lastSelectedApt = document.querySelector("#complexTitle").innerText;
                }



                //console.log('result ', result);
                document.querySelector("#complexOverviewList > div > div.item_area > div").scrollTop =
                  document.querySelector("#complexOverviewList > div > div.item_area > div").scrollHeight;

                //document.querySelector("#complexOverviewList > div > div.item_area > div").scrollTop = 0;
                 var runFnc = function (){

                    jQuery('.list_panel').css("width", "450px");
                    jQuery('.detail_panel').css("left", "450px");
                    result = getPrice_WeolbuStandard();
                    result = sortOnKeys(result);
                    addInfoToScreen(result);
                    document.querySelector(".item_list--article").scrollTop = 0;
                 }

                 if(inDebounce) clearTimeout(inDebounce)
                 inDebounce = setTimeout(runFnc, 500);


            });
        });
    });

    var config = {
        childList: true,
        subtree: true,
    };

    observer.observe(target, config);

}

addObserverIfDesiredNodeAvailable();