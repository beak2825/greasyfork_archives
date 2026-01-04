// ==UserScript==
// @name        test_for_naver_land
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     1.01
// @author      .
// @description Please use with violentmonkey
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457520/test_for_naver_land.user.js
// @updateURL https://update.greasyfork.org/scripts/457520/test_for_naver_land.meta.js
// ==/UserScript==




let isCreateCheckArea = false
let checkAreaValue = false

const AREA_CHECK = 'area_check';
const LOW_JEONSE_CHECK = 'low_jeonse_check'
const SEANGO_CHECK = 'seango_check'

const STORE_NAME = 'wolbu_price_filter'
const STORE_VALUE = { [AREA_CHECK]: true, [LOW_JEONSE_CHECK]: false, [SEANGO_CHECK]: true};

const validityCheck = {
  [AREA_CHECK] : { isCreate : false,  value: false, title: "35평이상 포함"}
  , [LOW_JEONSE_CHECK] : { isCreate : false,  value: false, title: "최저전세값"}
  , [SEANGO_CHECK] : { isCreate : false,  value: false, title: "세안고포함"}
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



//   상황에 따라 분기가 필요할 수도
function createCheckBox(type){

  new CheckBox(type, document.querySelector('.filter_btn_detail'));


//   // 35평이상 포함여부
//   if(type ===  AREA_CHECK ){
//     new CheckBox(type, document.querySelector('.filter_btn_detail'));
//   }
//   else if(type ===  LOW_JEONSE_CHECK ){
//     new CheckBox(type, document.querySelector('.filter_btn_detail'));
//   }

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
          price = befVal[0] < newVal[0] ? newVal[0] :  befVal[0]
          floor = befVal[0] < newVal[0] ? newVal[1] :  befVal[1]
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
            result[size] = {'매매': 0, '전세': 0, '갭': 0, '전세가율': '-', '매매층': '-', '전세층': '-', '매매갯수': 0, '전세갯수': '0' };
            dictPricePerSize[size] = {"매매": {}, "전세": {}};
          }

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

    });


    let isGrouped = document.querySelector('#address_group2').checked

    for( let key in result){
      let sellObj = dictPricePerSize[key]['매매'];
      let liveObj = dictPricePerSize[key]['전세'];

      let sellCnt = !isGrouped ? Object.keys(sellObj).length : Object.entries(sellObj).reduce( (acc, [, item]) => (parseInt(acc) + parseInt(item[3])), 0 );
      let liveCnt = !isGrouped ? Object.keys(liveObj).length : Object.entries(liveObj).reduce( (acc, [, item]) => (parseInt(acc) + parseInt(item[3])), 0 );



      // console.log(JSON.parse(JSON.stringify(sellObj)));
      // console.log(sellCnt, liveCnt)

      for( let key in sellObj ){

        let aptObj =  sellObj[key]

        if (!checkItemCondition('매매', aptObj[1], aptObj[2])){
          delete sellObj[key]
        }
      }

      let finalSellObj = Object.entries(sellObj).sort(([, a], [, b]) => a[0] - b[0]);
      let finalLivelObj = Object.entries(liveObj).sort(([, a], [, b]) => b[0] - a[0]);

      if(finalSellObj && finalSellObj.length){
        result[key]['매매'] = finalSellObj[0][1][0];
        result[key]['매매층'] = finalSellObj[0][1][1];
      }
      result[key]['매매갯수'] = sellCnt;

      if(finalLivelObj && finalLivelObj.length){
        let idx = 0;


        result[key]['전세'] = finalLivelObj[idx][1][0];
        result[key]['전세층'] = finalLivelObj[idx][1][1];
        result[key]['전세갯수'] = liveCnt;

        let idx2 = finalLivelObj.length-1;
        result[key]['전세2'] = finalLivelObj[idx2][1][0];
        result[key]['전세층2'] = finalLivelObj[idx2][1][1];

        result[key]['갭'] = parseInt(result[key]['매매']) - parseInt(result[key]['전세']);
        result[key]['전세가율'] = parseInt( parseInt(result[key]['전세']) / parseInt(result[key]['매매']) * 100) + "%";
      }


//       console.log('finalSellObj', finalSellObj);
//       console.log(finalLivelObj);
    }



    // console.log(dictPricePerSize);
    // console.log(result)

    return result;
}

function addInfoToScreen(infos) {

    var oldScreenInfo = document.querySelector("#summaryInfo > div.complex_summary_info > div.complex_price_info");
    if (oldScreenInfo)
        oldScreenInfo.remove();

    var screenInfo = document.createElement('div');
    screenInfo.setAttribute('class', 'complex_price_info');
    screenInfo.style.marginTop = "10px";

    for (let size in infos) {

        var strTradePriceInfo = (infos[size]['매매'] ? infos[size]['매매'] + "/" + infos[size]['매매층'] : "0/-");
        var strLeasePriceInfo = (infos[size]['전세'] ? infos[size]['전세'] + "/" + infos[size]['전세층'] : "0/-");
        var strLeasePriceInfo2 = (infos[size]['전세2'] ? infos[size]['전세2'] + "/" + infos[size]['전세층2'] : "0/-");

        var additionalInfos = [];
        if (infos[size]['매매'] && infos[size]['전세']) {
            additionalInfos.push(infos[size]['갭']);
            additionalInfos.push(infos[size]['전세가율']);
        }

        if (infos[size]['매매']) {
            var py = parseInt(/\d+/g.exec(size), 10) / 3.3;
            additionalInfos.push(parseInt(infos[size]['매매'] / py));
        }

        var strAdditionalInfo = "";
        // if (additionalInfos.length > 0){

          // strAdditionalInfo += "  (" + additionalInfos.join(", ") + ")("+infos[size]['매매갯수']+"/"+infos[size]['전세갯수']+")";

          if(document.querySelector('#address_group2').checked)
            strAdditionalInfo += additionalInfos.length > 0 ? "  (" + additionalInfos.join(", ") + ")("+infos[size]['매매갯수']+"/"+infos[size]['전세갯수']+")" : "  ("+infos[size]['매매갯수']+"/"+infos[size]['전세갯수']+")";
          else
            strAdditionalInfo += additionalInfos.length > 0  ? "  (" + additionalInfos.join(", ") + ")" : "";


        // }


        var cloned = document.querySelector("#summaryInfo > div.complex_summary_info > div.complex_trade_wrap > div > dl:nth-child(1)").cloneNode(true);
        cloned.setAttribute("added", true);
        cloned.getElementsByClassName("title")[0].innerText = size;

        var trade = cloned.getElementsByClassName("data")[0];
        var lease = trade.cloneNode(true);
        var lease2 = trade.cloneNode(true);
        var additionalInfo = trade.cloneNode(true);
        var delim = trade.cloneNode(true);

        // remove, then reordering (please make it more fancy)
        trade.innerText = strTradePriceInfo;
        trade.style.color = '#f34c59';
        lease.innerText = strLeasePriceInfo;
        lease.style.color = '#4c94e8';
        lease2.innerText = strLeasePriceInfo2;
        lease2.style.color = '#4c94e8';
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
        cloned.appendChild(lease2);
        cloned.appendChild(delim.cloneNode(true));
        cloned.appendChild(additionalInfo);

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
    if(!validityCheck[LOW_JEONSE_CHECK].isCreate)   createCheckBox(LOW_JEONSE_CHECK);
    if(!validityCheck[SEANGO_CHECK].isCreate)       createCheckBox(SEANGO_CHECK);
    if(!validityCheck[AREA_CHECK].isCreate)         createCheckBox(AREA_CHECK);

    jQuery(document).on('click', (e) => {

      if( jQuery(e.target).parents('a.item_link').length > 0 )
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
