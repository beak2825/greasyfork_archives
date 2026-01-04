// ==UserScript==
// @name         EDI Export Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  自用
// @author       bob
// @match        https://www.npedi.com/onesite*
// @icon         https://www.google.com/s2/favicons?domain=npedi.com
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/427078/EDI%20Export%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/427078/EDI%20Export%20Helper.meta.js
// ==/UserScript==
const data = {
  scoarri: {
    url: "https://www.npedi.com/onesite-api/scoarri/list",
    data: {
      type: "LOAD REPORT",
      ctnOperatorCode: "",
      ctnNo: "",
      blNo: "",
      ctnStatus: "",
    },
    portKey: "dischargePortCode"
  },
  scodeco: {
    url: "https://www.npedi.com/onesite-api/scodeco/list",
    data: {
      type: "GATE_IN REPORT",
      ctnOperatorCode: "",
      ctnNo: "",
      blNo: "",
    },
    portKey: "dlPortCode"
  }
};
(function () {
  'use strict';
  console.log("monkey");
  // Your code here...
  var style = document.createElement("style")
  style.innerHTML = `
    #MyApp{
  position: absolute;
  right: 10px;
  top: 40%;
  background-color: white;
  box-shadow: 0px 0px 10px 0px #13ce66;
  border-radius: 5px;
  padding: 4px;
    }
    .loading{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.8);
      text-align: center;
  font-size: 30px;
  line-height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
    }
    .loading.active{
      display:flex
    }
    #cmcc{
        width: 100%;
  margin: 2px 0;
    }
    `
  var div = document.createElement("div");
  div.id = "MyApp"
  div.innerHTML = `
<div class="loading"><span>正在处理...</span></div>
<div>
  <input id="cmcc" placeholder="船名/船次" value="" autocomplete="off"/>
</div>
<div>

</div>
<div class="btn-group">
  <button id="BtnScoarri" class="el-button el-button--primary el-button--small" type="button">装卸船导出</button>
  <button id="BtnScodeco" class="el-button el-button--primary el-button--small" type="button">进出门导出</button>
</div>`
  document.head.appendChild(style);
  document.body.appendChild(div);
  var a = document.getElementById("BtnScoarri");
  var d = document.getElementById("BtnScodeco");
  a.onclick = () => exportData("scoarri")
  d.onclick = () => exportData("scodeco")
  dragElement(document.getElementById("MyApp"));
})();
function dragTool(event) {

}

function toggleLoading(active) {
  var d = document.getElementsByClassName("loading")[0];
  if (active) {
    d.classList.remove("active");
  } else {
    d.classList.add("active");
  }

}

async function exportData(type) {
  try {
    console.log("开始导出数据" + type)
    toggleLoading()
    var val = document.getElementById("cmcc").value
    console.log("输入船名/船次的值" + val)
    var [vessel, voyage, vesselCode] = parseCode(val)
    var list = await getAllData(data[type].url, { ...data[type].data, vessel, voyage, vesselCode })
    var res = calculateResult(list, type);
    GM_setClipboard(res);
    toggleLoading(true)
    alert("成功");
  } catch (error) {
    toggleLoading(true)
    alert("复制失败请检查输入");
  }

}
function getToken() {
  return document.cookie.split(';').find(row => row.trim().startsWith('Web-Token='))
    .split('=')[1];
}
function parseCode(str) {
  var a = str.split("/")
  var b = a[1].split("-")
  return [a[0] || '', b[0] || '', b[1] || '']
}
async function getData(endpoint, param, pageNum, pageSize) {
  var url = new URL(endpoint);
  url.search = new URLSearchParams({ ...param, pageNum, pageSize })
  var resp = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      'pragma': 'no-cache',
      'cache-control': 'no-cache',
      "ediAuthorization": `Bearer ${getToken()}`
    }
  });
  var body = await resp.json()
  return {
    total: body.data.total,
    list: body.data.list
  }
}
async function getAllData(url, param) {
  var num = 1;
  var size = 500;
  var haveNext = true;
  var list = []
  while (haveNext) {
    var res = await getData(url, param, num, size)
    list = list.concat(res.list)
    if (num * size > res.total) {
      break;
    }
    num++;
    await sleep(1000);
  }
  return list;
}
function sleep(ms) {
  return new Promise((res, rej) => {
    setTimeout(res, ms)
  })
}
function getTun(ctnSizeType) {
  //等于l5gp是3
  if (ctnSizeType.toUpperCase() == "15GP") {
    return 3
  }
  //等于22开头是1
  if (/^22/.test(ctnSizeType)) {
    return 1
  }
  //其他是2
  return 2
}
function calculateResult(dataArray, type) {
  let operatorMap = {}
  let dlPortIdx = {}
  let dlPortArray = []
  let idx = 1
  let key = data[type].portKey
  //排除国际中转
  for (const data of dataArray.filter(p=>changeType(p.containerType)=="本地箱")) {
    if (!operatorMap[data.ctnOperatorCode])
      operatorMap[data.ctnOperatorCode] = {}

    if (!operatorMap[data.ctnOperatorCode][data[key]])
      operatorMap[data.ctnOperatorCode][data[key]] = 0
    //计算tun数
    let tun = getTun(data.ctnSizeType)
    operatorMap[data.ctnOperatorCode][data[key]] += tun
    if (!dlPortIdx[data[key]]) {
      dlPortIdx[data[key]] = idx
      dlPortArray.push(data[key])
      idx += 1
    }
  }
  //表头
  let content = "\t" + dlPortArray.join("\t") + "\n"

  for (const operatorName in operatorMap) {
    const operator = operatorMap[operatorName];
    content += operatorName
    for (const dlPort of dlPortArray) {
      content += `\t${operator[dlPort] != undefined ? operator[dlPort] : 0}`
    }
    content += "\n"
  }
  return content;
}

function _CopyToClipboard(content) {
  let temp = document.createElement('textarea');
  temp.value = content;
  document.body.appendChild(temp);
  temp.select();
  if (document.execCommand("copy")) {
    alert('复制成功');
  }
  else {
    alert('复制失败');
  }

  temp.remove()
}
function changeType(data) {
    var a = data
    return "N" == a ? "内支线" : "I" == a ? "国际中转" : "H" == a ? "海铁" : "L" == a ? "本地箱" : "其他"
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.right = "auto";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

