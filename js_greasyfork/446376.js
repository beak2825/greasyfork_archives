// ==UserScript==
// @name         ConfluenceAutoTools4HAT
// @namespace    http://www.akuvox.com/
// @version      1.60
// @description  take on the world!
// @author       andy.wang
// @match        http://know.xm.akubela.local/pages*
// @match        http://know.fz.akubela.local/pages*
// @match        http://192.168.13.7/pages*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/446376/ConfluenceAutoTools4HAT.user.js
// @updateURL https://update.greasyfork.org/scripts/446376/ConfluenceAutoTools4HAT.meta.js
// ==/UserScript==

function BtnClick_refresh_weektask_joyce(){
    console.log("更新本下周概览-婉琴")
    var url = "http://192.168.10.51:62180/jenkins_weektask_sqa_joyce";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}
function BtnClick_refresh_weektask_frank(){
    console.log("更新本下周概览-冯义")
    var url = "http://192.168.10.51:62180/jenkins_weektask_sqa_frank";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}
function BtnClick_refresh_weektask_sqa_andy(){
    console.log("质量更新本下周概览-居辉")
    var url = "http://192.168.10.51:62180/jenkins_weektask_sqa_andy";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}

function BtnClick_refresh_weekreport_joyce(){
    console.log("更新上周重点进展-婉琴")
    let url = "http://192.168.10.51:62180/jenkins_weekreport_sqa_joyce";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}
function BtnClick_refresh_weekreport_frank(){
    console.log("更新上周重点进展-冯义")
    let url = "http://192.168.10.51:62180/jenkins_weekreport_sqa_frank";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}
function BtnClick_refresh_weekreport_sqa_andy(){
    console.log("质量更新上周重点进展-居辉")
    let url = "http://192.168.10.51:62180/jenkins_weekreport_sqa_andy";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}

function BtnClick_refresh_nextweekreport_joyce(){
    console.log("更新下周总结-婉琴")
    let url = "http://192.168.10.51:62180/jenkins_weekreport_create_sqa_joyce";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}

function BtnClick_refresh_nextweekreport_frank(){
    console.log("更新下周总结-冯义")
    let url = "http://192.168.10.51:62180/jenkins_weekreport_create_sqa_frank";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}
function BtnClick_refresh_nextweekreport_sqa_andy(){
    console.log("质量更新下周总结-居辉")
    let url = "http://192.168.10.51:62180/jenkins_weekreport_create_sqa_andy";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}
function BtnClick_refresh_nextweekreport_sqateam(){
    console.log("质量更新下周总结-部门")
    let url = "http://192.168.10.51:62180/jenkins_nextweekreport_sqa";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}

function BtnClick_andy(){
    console.log("BtnClick")
    var obj=document.getElementById('myselect');
    var index=obj.selectedIndex; //序号，取当前选中选项的序号
    var val = obj.options[index].text;
    console.log("BtnClick val:" + val)
    
    if(val == "更新本下周概览-婉琴")
    {
        BtnClick_refresh_weektask_joyce();
    }
    else if(val == "更新本下周概览-冯义")
    {
        BtnClick_refresh_weektask_frank();
    }
    else if(val == "质量更新周任务概览-居辉")
    {
        BtnClick_refresh_weektask_sqa_andy();
    }
    else if(val == "更新上周重点进展-婉琴")
    {
        BtnClick_refresh_weekreport_joyce()
    }
    else if(val == "更新上周重点进展-冯义")
    {
        BtnClick_refresh_weekreport_frank()
    }
    else if(val == "质量更新上周重点进展-居辉")
    {
        BtnClick_refresh_weekreport_sqa_andy()
    }
    else if(val == "更新本周总结-婉琴")
    {
        BtnClick_refresh_nextweekreport_joyce()
    }
    else if(val == "更新本周总结-冯义")
    {
        BtnClick_refresh_nextweekreport_frank()
    }
    else if(val == "质量更新本周总结-居辉")
    {
        BtnClick_refresh_nextweekreport_sqa_andy()
    }
    else if(val == "质量更新本周总结-部门")
    {
        BtnClick_refresh_nextweekreport_sqateam()
    }
    else if(val == "更新本下周概览-linux")
    {
        console.log("更新本下周概览-linux")
        let url = "http://192.168.10.51:62180/jenkins_weektask_linux";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新周重点进展-linux")
    {
        console.log("更新周重点进展-linux")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_refresh_linux";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "创建本周总结-linux")
    {
        console.log("创建本周总结-linux")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_create_linux";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新本下周概览-HA")
    {
        console.log("更新本下周概览-HA")
        let url = "http://192.168.10.51:62180/jenkins_weektask_ha";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新周重点进展-HA")
    {
        console.log("更新周重点进展-HA")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_refresh_ha";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "创建本周总结-HA")
    {
        console.log("创建本周总结-HA")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_create_ha";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新本下周概览-web")
    {
        console.log("更新本下周概览-web")
        let url = "http://192.168.10.51:62180/jenkins_weektask_web";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新周重点进展-web")
    {
        console.log("更新周重点进展-web")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_refresh_web";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "创建本周总结-web")
    {
        console.log("创建本周总结-web")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_create_web";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新本下周概览-安卓小屏")
    {
        console.log("更新本下周概览-安卓小屏")
        let url = "http://192.168.10.51:62180/jenkins_weektask_android";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新周重点进展-安卓小屏")
    {
        console.log("更新周重点进展-安卓小屏")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_refresh_android";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "创建本周总结-安卓小屏")
    {
        console.log("创建本周总结-安卓小屏")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_create_android";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新本下周概览-安卓大屏")
    {
        console.log("更新本下周概览-安卓大屏")
        let url = "http://192.168.10.51:62180/jenkins_weektask_android2";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新周重点进展-安卓大屏")
    {
        console.log("更新周重点进展-安卓大屏")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_refresh_android2";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "创建本周总结-安卓大屏")
    {
        console.log("创建本周总结-安卓大屏")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_create_android2";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新本下周概览-驱动")
    {
        console.log("更新本下周概览-驱动")
        let url = "http://192.168.10.51:62180/jenkins_weektask_driver";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新周重点进展-驱动")
    {
        console.log("更新周重点进展-驱动")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_refresh_driver";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "创建本周总结-驱动")
    {
        console.log("创建本周总结-驱动")
        let url = "http://192.168.10.51:62180/jenkins_weekreport_create_driver";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
}

function addselect_joyce(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-婉琴"));
    obj_elect.options.add(new Option("更新上周重点进展-婉琴"));
    obj_elect.options.add(new Option("更新本周总结-婉琴"));
    obj_elect.options.add(new Option("质量更新上周重点进展-居辉"));
    obj_elect.options.add(new Option("质量更新本周总结-居辉"));
    obj_elect.options.add(new Option("质量更新本周总结-部门"));
    obj_elect.options.add(new Option("更新本下周概览-冯义"));
    obj_elect.options.add(new Option("更新上周重点进展-冯义"));
    obj_elect.options.add(new Option("更新本周总结-冯义"));
}

function addselect_frank(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-冯义"));
    obj_elect.options.add(new Option("更新上周重点进展-冯义"));
    obj_elect.options.add(new Option("更新本周总结-冯义"));
}


function addselect_linux(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-linux"));
    obj_elect.options.add(new Option("更新周重点进展-linux"));
    obj_elect.options.add(new Option("创建本周总结-linux"));
}

function addselect_android(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-安卓小屏"));
    obj_elect.options.add(new Option("更新周重点进展-安卓小屏"));
    obj_elect.options.add(new Option("创建本周总结-安卓小屏"));
}

function addselect_android2(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-安卓大屏"));
    obj_elect.options.add(new Option("更新周重点进展-安卓大屏"));
    obj_elect.options.add(new Option("创建本周总结-安卓大屏"));
}

function addselect_web(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-web"));
    obj_elect.options.add(new Option("更新周重点进展-web"));
    obj_elect.options.add(new Option("创建本周总结-web"));
}

function addselect_driver(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-驱动"));
    obj_elect.options.add(new Option("更新周重点进展-驱动"));
    obj_elect.options.add(new Option("创建本周总结-驱动"));
}

function addselect_ha(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-HA"));
    obj_elect.options.add(new Option("更新周重点进展-HA"));
    obj_elect.options.add(new Option("创建本周总结-HA"));
}


function addselect_andy(obj_elect) {
    obj_elect.options.add(new Option("质量更新上周重点进展-居辉"));
    obj_elect.options.add(new Option("质量更新本周总结-居辉"));
    obj_elect.options.add(new Option("质量更新本周总结-部门"));

    addselect_linux(obj_elect);
    addselect_android(obj_elect);
    addselect_android2(obj_elect);
    addselect_web(obj_elect);
    addselect_driver(obj_elect);
    addselect_ha(obj_elect);
}

function addBtn(user) {
    var obj_ul = document.getElementsByClassName("aui-header-primary")[0].getElementsByTagName("ul");
    var li = document.createElement("li");
    li.className = "aui-buttons";

    var obj_elect = document.createElement("select");
    obj_elect.id = "myselect";
    obj_elect.className = "aui-button aui-button-primary";
    obj_elect.style.cssText = "width:200px;margin: 10px 0;padding: 2px 0;text-align:center;";

    if(user == 'andy')
    {
        addselect_andy(obj_elect)
    }
    else if(user == 'yaopeng.huang')
    {
        addselect_linux(obj_elect)
    }
    else if(user == 'sense')
    {
        addselect_web(obj_elect)
    }
    else if(user == 'ethan')
    {
        addselect_driver(obj_elect)
    }
    else if(user == 'zhonghao.le')
    {
        addselect_android(obj_elect)
    }
    else if(user == 'changfa.huang')
    {
        addselect_ha(obj_elect)
        addselect_android(obj_elect);
    }
    else if(user == 'frank')
    {
        addselect_frank(obj_elect)
    }
    else if(user == 'joyce.su')
    {
        addselect_joyce(obj_elect)
    }

    obj_ul[0].appendChild(obj_elect);

    var button = document.createElement("button");
    button.className = "aui-button aui-button-primary";
    button.id = 'myfilter';
    button.onclick = function() {
        BtnClick_andy();
    };
    var text1 = document.createTextNode("运行");
    button.appendChild(text1);
    obj_ul[0].appendChild(button);
    console.log(obj_ul)
};

function weekreport_deal() {
    console.log('xx_周总结')
    var tableJoiners = document.getElementsByClassName('confluenceTable')
    tableJoiners.forEach((item) => {
        let colgroup = item.getElementsByTagName('colgroup')[0]
        // 统一删除页面colgroup这个节点
        if (colgroup !== undefined) {
            item.removeChild(colgroup)
            item.removeAttribute('style')
        }
    })
    // 设置colgroup节点
    for (let tableIndex in tableJoiners) {
        // tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length 表格列数
        if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 2) {
            let newString = `<colgroup>
                  <col style="width: 180.0px;"/>
                   <col style="width: 820.0px;"/>
                 </colgroup>`
            tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
        }
        if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 3) {
            let newString = `<colgroup>
                   <col style="width: 120.0px;"/>
                   <col style="width: 150.0px;"/>
                  <col style="width: 730.0px;"/>
                 </colgroup>`
            tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
        }
        if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 4) {
            let newString = `<colgroup>
                   <col style="width: 150.0px;"/>
                   <col style="width: 350.0px;"/>
                   <col style="width: 150.0px;"/>
                   <col style="width: 350.0px;"/>
                 </colgroup>`
            tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
        }
        if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 5) {
            let newString = `<colgroup>
                   <col style="width: 150.0px;"/>
                   <col style="width: 330.0px;"/>
                   <col style="width: 90.0px;"/>
                   <col style="width: 330.0px;"/>
                   <col style="width: 100.0px;"/>
                 </colgroup>`
            tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
        }
        if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 6) {
            let newString = `<colgroup>
                   <col style="width: 100.0px;"/>
                   <col style="width: 250.0px;"/>
                   <col style="width: 250.0px;"/>
                   <col style="width: 250.0px;"/>
                   <col style="width: 250.0px;"/>
                   <col style="width: 100.0px;"/>
                 </colgroup>`
            tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
        }
        if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 7) {
            let newString = `<colgroup>
                   <col style="width: 100.0px;"/>
                   <col style="width: 200.0px;"/>
                   <col style="width: 200.0px;"/>
                   <col style="width: 200.0px;"/>
                   <col style="width: 250.0px;"/>
                   <col style="width: 250.0px;"/>
                   <col style="width: 100.0px;"/>
                 </colgroup>`
            tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
        }
        if (tableIndex == tableJoiners.length - 1) {
            tableJoiners[tableIndex].getElementsByClassName('confluenceTable')[0]

            tableJoiners[tableJoiners.length - 1].getElementsByTagName('td').forEach((item, index) => {
                if (parseInt(index / 6) % 2 == 0) {
                    // 偶数行
                    //item.style.backgroundColor = '#DEEBFF'
                } else {
                    // 奇数行
                    //item.style.backgroundColor = '#fff'
                }
            })
        }
    }
}

function androidissue_deal() {
   console.log('androidissue_deal 000')
    // 指定页面设置独立设置表格宽度，(页面id+宽度数组)，如果未存在页面id则按照下面通用宽度设置
  const pageMap = {
    67555923: [80, 80, 100, 100, 300, 700, 300, 200, 200, 200, 100, 100, 100, 200]
  }
  // 通用最大宽度
  const maxWidth = 200

  const params = new URLSearchParams(window.location.search)
  const pageId = params.get('pageId') || ''

  const widthList = pageMap?.[pageId] || null
  let modalStyle = ''

  if (widthList) {
    modalStyle = `
    tr {
      word-wrap:break-word;
      white-space:normal
    }
  `

    widthList.forEach((item, index) => {
      modalStyle += `
    tr th:nth-child(${index + 1}){
      max-width:${item}px
    }
    tr td:nth-child(${index + 1}){
      max-width:${item}px
    }
    `
    })
  } else {
    modalStyle = `
    tr {
      word-wrap:break-word;
      white-space:normal
    }

    tr th{
      max-width:${maxWidth}px
    }
    tr td{
      max-width:${maxWidth}px
    }
  `
  }

  const styleBlock = document.createElement('style')
  styleBlock.textContent = modalStyle
  document.head.appendChild(styleBlock)

    // === 新增第8列日志路径替换为链接 ===
// 可根据实际情况替换table选择器，如document.querySelectorAll("table")
document.querySelectorAll("table").forEach(table => {
  Array.from(table.rows).forEach((row, index) => {
    // 跳过表头（一般是第1行, 也可能多行表头，可再根据实际调整index条件）
    if(index === 0) return;

    let cell = row.cells[7]; // 第8列
    if (cell) {
      let text = cell.innerText || cell.textContent;
      const prefix = "X:/servers/fileserver/files/android/androidlogs/";
       if (text.startsWith(prefix)) {
        const relativePath = text.substring("X:/servers/fileserver/files/".length);
        const url = "http://192.168.10.52:60080/files/" + relativePath;
        cell.innerHTML = `<a href="${url}" target="_blank">${text}</a>`;
      } else if (text.startsWith('http://') || text.startsWith('https://')) {
        cell.innerHTML = `<a href="${text}" target="_blank">${text}</a>`;
      }
    }
  });
});

}


function monthreport_deal() {
    console.log('xx_月总结')
    var tableJoiners = document.getElementsByClassName('confluenceTable')
    tableJoiners.forEach((item) => {
        let colgroup = item.getElementsByTagName('colgroup')[0]
        // 统一删除页面colgroup这个节点
        if (colgroup !== undefined) {
            item.removeChild(colgroup)
            item.removeAttribute('style')
        }
    })
    // 设置colgroup节点
    for (let tableIndex in tableJoiners) {
        tableJoiners[0].style.marginLeft = '40px'
        if (tableJoiners.length === 7) {
            if (tableIndex == 0) {
                // 修改第一个表格
                let newString = `<colgroup>
                  <col style="width: 150.0px;"/>
                  <col style="width: 850.0px;"/>
                </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }

            if (tableIndex == 1) {
                // 修改第二个表格
                let newString = `<colgroup>
                  <col style="width: 50.0px;"/>
                  <col style="width: 200.0px;"/>
                  <col style="width: 80.0px;"/>
                  <col style="width: 250.0px;"/>
                  <col style="width: 80.0px;"/>
                  <col style="width: 100.0px;"/>
                  <col style="width: 230.0px;"/>
                </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableIndex == 2) {
                // 修改第三个表格
                let newString = `<colgroup>
                   <col style="width: 150.0px;"/>
                  <col style="width: 850.0px;"/>
                </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableIndex == 3) {
                // 修改第四个表格
                let newString = `<colgroup>
                   <col style="width: 150.0px;"/>
                  <col style="width: 250.0px;"/>
                  <col style="width: 250.0px;"/>
                  <col style="width: 350.0px;"/>
                </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableIndex == 4) {
                // 修改第五个表格
                let newString = `<colgroup>
                  <col style="width: 150.0px;"/>
                  <col style="width: 300.0px;"/>
                  <col style="width: 550.0px;"/>
                </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableIndex == 5) {
                // 修改第六个表格
                let newString = `<colgroup>
                  <col style="width: 50.0px;"/>
                  <col style="width: 200.0px;"/>
                  <col style="width: 80.0px;"/>
                  <col style="width: 250.0px;"/>
                  <col style="width: 90.0px;"/>
                  <col style="width: 100.0px;"/>
                  <col style="width: 230.0px;"/>
                </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableIndex == 6) {
                // 修改第七个表格
                let newString = `<colgroup>
                  <col style="width: 200.0px;"/>
                  <col style="width: 400.0px;"/>
                  <col style="width: 400.0px;"/>
                </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
        } else {
            // tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length 表格列数
            if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 2) {
                let newString = `<colgroup>
              <col style="width: 150.0px;"/>
               <col style="width: 850.0px;"/>
             </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 3) {
                let newString = `<colgroup>
               <col style="width: 150.0px;"/>
                  <col style="width: 300.0px;"/>
                  <col style="width: 550.0px;"/>
             </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 4) {
                let newString = `<colgroup>
               <col style="width: 150.0px;"/>
                  <col style="width: 250.0px;"/>
                  <col style="width: 250.0px;"/>
                  <col style="width: 350.0px;"/>
             </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 5) {
                let newString = `<colgroup>
               <col style="width: 150.0px;"/>
               <col style="width: 200.0px;"/>
               <col style="width: 200.0px;"/>
               <col style="width: 200.0px;"/>
               <col style="width: 250.0px;"/>
             </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 6) {
                let newString = `<colgroup>
               <col style="width: 100.0px;"/>
               <col style="width: 250.0px;"/>
               <col style="width: 200.0px;"/>
               <col style="width: 150.0px;"/>
               <col style="width: 150.0px;"/>
               <col style="width: 150.0px;"/>
             </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
            if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 7) {
                let newString = `<colgroup>
                  <col style="width: 50.0px;"/>
                  <col style="width: 200.0px;"/>
                  <col style="width: 100.0px;"/>
                  <col style="width: 250.0px;"/>
                  <col style="width: 80.0px;"/>
                  <col style="width: 90.0px;"/>
                  <col style="width: 230.0px;"/>
             </colgroup>`
                tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
            }
        }
    }
}


function bug_deal() {
    'use strict'
    setTimeout(()=>{
        const title = document.getElementById('title-text').querySelector('a')
        console.log(title.innerHTML)
        if (title.innerHTML.includes('bug')) {
            let trDomList = []
            const bigboxList = document.getElementsByClassName('table-wrap')
            bigboxList.forEach((item) => {
                trDomList = [...trDomList,...(item.getElementsByTagName('tbody')[0].getElementsByTagName('tr')||[])]
            })
            trDomList.forEach((item) => {
                let child = item.firstElementChild
                child.style.color = '#50c3fa'
                child.onclick = function (el) {
                    var lid = Number(child.innerHTML)
                    if (lid < 30000)
                    {
                        window.open(`http://192.168.10.17/zentao/story-view-${child.innerHTML}.html`)
                    }
                    else
                    {
                        window.open(`http://192.168.10.17/zentao/bug-view-${child.innerHTML}.html`)
                    }
                }
            })
        }
    },2000)
}

function bugstory_deal() {
    'use strict'
    setTimeout(()=>{
        const title = document.getElementById('title-text').querySelector('a')
        console.log(title.innerHTML)
        if (1|| title.innerHTML.includes('bug')) {
            let trDomList = []
            const bigboxList = document.getElementsByClassName('table-wrap')
            bigboxList.forEach((item) => {
                trDomList = [...trDomList,...(item.getElementsByTagName('tbody')[0].getElementsByTagName('tr')||[])]
            })
            trDomList.forEach((item) => {
                let child = item.firstElementChild
                child.style.color = '#50c3fa'
                child.onclick = function (el) {
                    window.open(`http://192.168.10.17/zentao/story-view-${child.innerHTML}.html`)
                }
            })
        }
    },2000)
}

function project_deal() {
    'use strict'
    setTimeout(()=>{
        const title = document.getElementById('title-text').querySelector('a')
        console.log(title.innerHTML)
        if (1) {
            let trDomList = []
            const bigboxList = document.getElementsByClassName('table-wrap')
            bigboxList.forEach((item) => {
                trDomList = [...trDomList,...(item.getElementsByTagName('tbody')[0].getElementsByTagName('tr')||[])]
            })
            trDomList.forEach((item) => {
                let child = item.firstElementChild
                child.style.color = '#50c3fa'
                child.onclick = function (el) {
                    window.open(`http://192.168.10.17/zentao/project-testtask-${child.innerHTML}.html`)
                }
            })
        }
    },2000)
}


function createBugTitile() {
    if(document.getElementsByClassName('auto-cursor-target')?.[0].innerText !== '机型bug') {
        return
    }

    const isCreateButton = () => {
        const titleButton = document.getElementsByClassName('auto-cursor-target')?.[0]
        var bt =document.createElement("button");           //createElement生成button对象
        bt.innerHTML = '展开选项';
        bt.onclick = function () {                          //绑定点击事件
            // document.getElementsByClassName('chosen-search-input')[0].click()
            // document.getElementsByClassName('chosen-search-input')[2].click()
            // const chosenArrr = document.getElementsByClassName('chosen-drop')
            // chosenArrr[0].style.left = '0'
            // chosenArrr[2].style.left = '0'

            // setTimeout(()=>{
            //     document.getElementsByClassName('date from text')[0].click();
            // },500)
            // 获取表格dom
            var table_index = 1
            var title = document.title;
            if(title.indexOf('未修复智能家居终端bug(禅道实时)') >= 0)
            {
                table_index = 2
            }

            const bugArray = []
            const bigboxList = document.getElementsByClassName('table-wrap')[table_index].getElementsByTagName('tbody')[0]
            let rowArray = bigboxList.getElementsByTagName('tr')
            for(let i = 0; i < rowArray.length; i++) {
                const rowObj = rowArray[i]
                if(rowObj.style.display !== 'none') {
                    const rowObj = rowArray[i]
                    const tdBug = rowObj.getElementsByTagName('td')[0]
                    bugArray.push(tdBug.innerText)
                }
            }
            bugArray.forEach((item) => {
                var lid = Number(item)
                if (lid < 30000)
                {
                    window.open(`http://192.168.10.17/zentao/story-view-${item}.html`)
                }
                else
                {
                    window.open(`http://192.168.10.17/zentao/bug-view-${item}.html`)
                }
            })

        };
        titleButton.appendChild(bt);
    }
    const isCheckAuto = () => {
        setTimeout(function () {
          const topSearch = document.getElementsByClassName('sortable-container ui-sortable')
          if(topSearch.length) {
            console.log('表格生成')
            isCreateButton()
          } else {
            console.log('表格未生成')
            isCheckAuto()
          }
        }, 500);
    }
    isCheckAuto()
}
/**
 * 创建bug未解决
 */
const createBugUnsolved = async () => {
    // 第一步获取机型
    const getData = async () => {
        return new Promise(async (resolve) => {
            const result = await fetch(`http://192.168.10.51:51081/api/zentao/getProduct`, {
                method: 'GET',
            })
            try {
                let res = await result.json()
                resolve(res)
            } catch (e) {
                resolve('')
            }
        })
    }
    const data = await getData()
    let selectHtml = ''
    data.result.forEach(v => {
        var bfound = false

        if(!bfound)
        {
            selectHtml = selectHtml + `<option value="${v.id}">${v.name}</option>`
        }
    })

    const topDom = document.querySelector('.aui-header-secondary')
    const addHtml = `
      <div style="margin-left: 5px;">
        <p>
            机型：
            <select name="country" class="aku-type-name">
              ${selectHtml}
            </select>
        </p>
      </div>
      <div class="aku-bug_button" style="cursor: pointer;
      color: #fff;
      background-color: #ed8b05;
      color: #f2edf2;
      padding: 5px;
      border-radius: 5px;
      margin-left: 5px;">生成bug文档</div>
    `
    //topDom.insertAdjacentHTML('beforebegin', addHtml)
    //const buttonDom = document.querySelector('.aku-bug_button')
    
}

(function() {
    //主函数开始
    //创建button

    console.log("ConfluenceAutoTools4HAT")
    console.log('window: %o', window);

    function timer_refresh(){
        console.log("timer_refresh")
        window.location.replace(window.location.href);
    }

    createBugUnsolved()

    //自己的方法
    function autoCloseNotice(){
        var obj_conf = document.getElementById("com-atlassian-confluence");
        if(!obj_conf)
        {
            return;
        }

        var obj = document.getElementById("aui-flag-container");
        if(!obj)
        {
            return;
        }
        console.log(obj)
        obj.remove();
    }

    function myinit(){

        var user = document.getElementsByTagName('meta')['ajs-remote-user'].getAttribute('content')
        console.log("user:" +user)
        addBtn(user)

        ///////////////////////// 以下是通用功能 /////////////////////////////////
        //setTimeout(timer_refresh, 10*600)
        autoCloseNotice();

        var title = document.title;
        console.log("document.title:%s", title)
        if(title.indexOf('家居终端软件部_周报') >= 0 || title.indexOf('紫馨组_周报') >= 0 || title.indexOf('长发组_周报') >= 0 || title.indexOf('居辉组_周报') >= 0 || title.indexOf('家居质量部_周报') >= 0 || title.indexOf('冯义组_周报') >= 0 || title.indexOf('婉琴组_周报') >= 0)
        {
            console.log("document.title222:%s", title)
            setTimeout(()=>{
                weekreport_deal();
            }, 1350)
        }
        else if(title.indexOf('月总结') >= 0)
        {
            setTimeout(()=>{
                monthreport_deal();
            }, 1350)
        }
        else if((title.indexOf('未修复bug(禅道实时)') >= 0) || (title.indexOf('历史概率bug(禅道实时)') >= 0) || (title.indexOf('智能家居终端bug') >= 0) || (title.indexOf('不予解决的bug清单') >= 0) || (title.indexOf('激活的bug清单') >= 0) || (title.indexOf('压测 bug清单') >= 0) || (title.indexOf('低级bug清单')>= 0)
                || (title.indexOf('重复的bug清单') >= 0) || (title.indexOf('P0 bug清单') >= 0)|| (title.indexOf('终端bug-产品') >= 0)|| (title.indexOf('终端bug-测试') >= 0)|| (title.indexOf('未修复家居终端的音视频驱动bug') >= 0)|| (title.indexOf('机型管控bug')>= 0)|| (title.indexOf('内部低级bug清单')>= 0)
                || (title.indexOf('不规范的bug清单')>= 0) || (title.indexOf('未修复智能家居APP-bug') >= 0)|| (title.indexOf('未修复智能家居云-bug') >= 0))
        {
            setTimeout(()=>{
                bug_deal();
            }, 1350)
            createBugTitile()
        }
        else if((title.indexOf('未修复智能家居终端需求bug类') >= 0) || (title.indexOf('研发管控需求') >= 0))
        {

            setTimeout(()=>{
                bugstory_deal();
            }, 1350)
            createBugTitile()
        }
        else if((title.indexOf('安卓关键问题查询--') >= 0))
        {
            setTimeout(()=>{
                androidissue_deal();
            }, 1350)
        }
        else if((title.indexOf('禅道项目查询') >= 0))
        {
            setTimeout(()=>{
                project_deal();
            }, 1350)
        }
    }

    if (navigator.userAgent.indexOf('Firefox') >= 0) {
        //firefox 不支持 window.onload 直接调用函数
        console.log("ConfluenceAutoTools4HAT2")
        myinit();
    } else {
        console.log("ConfluenceAutoTools4HAT3")
        window.onload = myinit();

    }

   
})();




