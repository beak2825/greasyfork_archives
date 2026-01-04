// ==UserScript==
// @name         ConfluenceAutoTools4HAT
// @namespace    http://www.akuvox.com/
// @version      1.32
// @description  take on the world!
// @author       andy.wang
// @match        http://know.xm.akubela.local/pages*
// @match        http://192.168.13.7/pages*
// @match        http://192.168.10.27:81/zentao/bug-browse*
// @match        http://192.168.10.27:81/zentao/bug-view*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/467615/ConfluenceAutoTools4HAT.user.js
// @updateURL https://update.greasyfork.org/scripts/467615/ConfluenceAutoTools4HAT.meta.js
// ==/UserScript==

function BtnClick_refresh_weektask(){
    console.log("更新本下周概览")
    var url = "http://192.168.10.51:62180/jenkins_weektask";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}

function BtnClick_refresh_weektask_zixin(){
    console.log("更新本下周概览-紫馨")
    var url = "http://192.168.10.51:62180/jenkins_weektask_zixin";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}
function BtnClick_refresh_weektask_changfa(){
    console.log("更新本下周概览-长发")
    var url = "http://192.168.10.51:62180/jenkins_weektask_changfa";
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true, "", "");
    xhr.send();
}

function BtnClick_refresh_weekreport(){
    console.log("更新本周总结")
        let url = "http://192.168.10.51:62180/jenkins_thisweekreport";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}


function BtnClick_refresh_weekreport_zixin(){
    console.log("更新本周总结-紫馨")
        let url = "http://192.168.10.51:62180/jenkins_thisweekreport_zixin";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}

function BtnClick_refresh_weekreport_changfa(){
    console.log("更新本周总结-长发")
        let url = "http://192.168.10.51:62180/jenkins_thisweekreport_changfa";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}

function BtnClick_refresh_weekreport_andy(){
    console.log("更新本周总结-长发")
        let url = "http://192.168.10.51:62180/jenkins_thisweekreport_andy";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}


function BtnClick_refresh_nextweekreport(){
     console.log("更新下周总结")
        let url = "http://192.168.10.51:62180/jenkins_nextweekreport";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}

function BtnClick_refresh_nextweekreport_zixin(){
     console.log("更新下周总结-紫馨")
        let url = "http://192.168.10.51:62180/jenkins_nextweekreport_zixin";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}

function BtnClick_refresh_nextweekreport_changfa(){
     console.log("更新下周总结-长发")
        let url = "http://192.168.10.51:62180/jenkins_nextweekreport_changfa";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}

function BtnClick_refresh_nextweekreport_andy(){
     console.log("更新下周总结-长发")
        let url = "http://192.168.10.51:62180/jenkins_nextweekreport_andy";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}

function BtnClick_pktask_detect(){
     console.log("周PK任务监测")
        let url = "http://192.168.10.51:62180/jenkins_pktask_detect";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
}

function BtnClick_pktask_notify(){
     console.log("周PK任务监测")
        let url = "http://192.168.10.51:62180/jenkins_pktask_notify";
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
    if(val == "更新本下周概览")
    {
        BtnClick_refresh_weektask();
    }
    if(val == "更新本下周概览-紫馨")
    {
        BtnClick_refresh_weektask_zixin();
    }
    if(val == "更新本下周概览-长发")
    {
        BtnClick_refresh_weektask_changfa();
    }
    else if(val == "更新任务绩效到周绩效")
    {
        console.log("更新周绩效")
        let url = "http://192.168.10.51:62180/jenkins_weekscore";
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true, "", "");
        xhr.send();
    }
    else if(val == "更新上周重点进")
    {
        BtnClick_refresh_weekreport()
    }
    else if(val == "更新上周重点进展-紫馨")
    {
        BtnClick_refresh_weekreport_zixin()
    }
    else if(val == "更新上周重点进展-紫馨")
    {
        BtnClick_refresh_weekreport_changfa()
    }
    else if(val == "更新上周重点进展-居辉")
    {
        BtnClick_refresh_weekreport_andy()
    }
    else if(val == "更新本周总结")
    {
        BtnClick_refresh_nextweekreport()
    }
    else if(val == "更新本周总结-紫馨")
    {
        BtnClick_refresh_nextweekreport_zixin()
    }
    else if(val == "更新本周总结-长发")
    {
        BtnClick_refresh_nextweekreport_changfa()
    }
    else if(val == "更新本周总结-居辉")
    {
        BtnClick_refresh_nextweekreport_andy()
    }
    else if(val == "周PK任务监测")
    {
        BtnClick_pktask_detect()
    }
    else if(val == "周PK任务通知")
    {
        BtnClick_pktask_notify()
    }
}

function addselect_andy(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览"));
    obj_elect.options.add(new Option("更新本下周概览-紫馨"));
    obj_elect.options.add(new Option("更新本下周概览-长发"));
    obj_elect.options.add(new Option("更新任务绩效到周绩效"));
    obj_elect.options.add(new Option("更新上周重点进展"));
    obj_elect.options.add(new Option("更新上周重点进展-紫馨"));
    obj_elect.options.add(new Option("更新上周重点进展-长发"));
    obj_elect.options.add(new Option("更新上周重点进展-居辉"));
    obj_elect.options.add(new Option("更新本周总结"));
    obj_elect.options.add(new Option("更新本周总结-紫馨"));
    obj_elect.options.add(new Option("更新本周总结-长发"));
    obj_elect.options.add(new Option("更新本周总结-居辉"));
    obj_elect.options.add(new Option("周PK任务监测"));
    obj_elect.options.add(new Option("周PK任务通知"));
}

function addselect_zixin(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-紫馨"));
    obj_elect.options.add(new Option("更新上周重点进展-紫馨"));
    obj_elect.options.add(new Option("更新本周总结-紫馨"));
    obj_elect.options.add(new Option("更新任务绩效到周绩效"));
}

function addselect_changfa(obj_elect) {
    obj_elect.options.add(new Option("更新本下周概览-长发"));
    obj_elect.options.add(new Option("更新上周重点进展-长发"));
    obj_elect.options.add(new Option("更新本周总结-长发"));
    obj_elect.options.add(new Option("更新任务绩效到周绩效"));
}

function addBtn(user) {
    var obj_ul = document.getElementsByClassName("aui-header-primary")[0].getElementsByTagName("ul");
    var li = document.createElement("li");
    li.className = "aui-buttons";

    var obj_elect = document.createElement("select");
    obj_elect.id = "myselect";
    obj_elect.className = "aui-button aui-button-primary";
    obj_elect.style.cssText = "width:150px;margin: 10px 0;padding: 2px 0;text-align:center;";

    if(user == 'andy')
        {
           addselect_andy(obj_elect)
        }
        else if(user == 'jane.liu')
        {
            addselect_zixin(obj_elect)
        }
        else if(user == 'changfa.huang')
        {
            addselect_changfa(obj_elect)
        }

    obj_ul[0].appendChild(obj_elect);

    var button = document.createElement("button");
    // button.style.cssText = "z-index: 9999; position: fixed ! important; width:100px;margin: 10px 0;padding: 2px 0;background: #e4cc78;";
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
                   <col style="width: 80.0px;"/>
                 </colgroup>`
      tableJoiners[tableIndex].insertAdjacentHTML('afterbegin', newString)
    }
    if (tableJoiners[tableIndex]?.rows?.item(0)?.cells?.length === 7) {
      let newString = `<colgroup>
                   <col style="width: 60.0px;"/>
                   <col style="width: 200.0px;"/>
                   <col style="width: 200.0px;"/>
                   <col style="width: 200.0px;"/>
                   <col style="width: 250.0px;"/>
                   <col style="width: 250.0px;"/>
                   <col style="width: 250.0px;"/>
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
        trDomList = item.getElementsByTagName('tbody')[0].getElementsByTagName('tr')
      })
      trDomList.forEach((item) => {
        let child = item.firstElementChild
        child.style.color = '#50c3fa'
        child.onclick = function (el) {
          window.open(`http://192.168.10.27:81/zentao/bug-view-${child.innerHTML}.html`)
        }
      })
    }
  },2000)
}

async function zentaoTable() {
    const userName = document.getElementById('userMenu').children[0].text.trim()

    const post = (bugid,username)=>{
        fetch('http://192.168.10.51:63183/postzentao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bugid,
                username,
            })
        })
    }

    const get = (bugid)=>{
        return new Promise(async (resolve)=>{
            const result = await fetch('http://192.168.10.51:63183/getzentao?bugid='+bugid, {
                method: 'GET',
            })
            try {
                const res = await result.json()

                resolve(res)
            } catch (e) {

                resolve({username:''})
            }
        })
    }

    const header = document.getElementsByTagName("tr")[0].children

    let index

    Array.from(header).forEach((item,i)=>{
        const text = item.querySelector('a')?item.querySelector('a').text.trim():''
        if(text==='ID'){
            index = i
        }
    })

    const table = document.getElementsByTagName("tr")

    Array.from(table).forEach(async(item,i)=>{
        const th = Array.from(item.children)
        var newNode
        if(i===0){
            newNode = document.createElement("th");
            newNode['data-flex'] = false;
            newNode['data-width'] = "140px";
            newNode.style = "width:140px";
            newNode.class = "w-actions {sorter:false}";
            newNode.innerHTML = "归属人名"
            item.insertBefore(newNode,th[th.length-1])
        }else if(i!==table.length-1){
            if(th[index]){
                const id = th[index].querySelector('a')?th[index].querySelector('a').text.trim():''
                const result = await get(id)
                newNode = document.createElement("td");
                newNode.innerHTML = result.username
                item.insertBefore(newNode,th[th.length-1])

                Array.from(item.children).forEach(td=>{
                    td.style="background: initial;"
                })
                if(result.username===userName){
                    item.style = "background: #8bbff3;"
                }else if(result.username){
                    item.style = "background: #fea;"
                }


                const handle = th[th.length-1].children
                handle[handle.length-1].innerHTML="我"
                handle[handle.length-1].href="javascript:;"
                handle[handle.length-1].addEventListener("click", function(){
                    post(id,userName)
                    newNode.innerHTML=userName
                    item.style = "background: #8bbff3;"
                });
            }
        }
    })
    // zentaoDetail...
    if( document.getElementById('modulemenu')){
        const id = document.getElementById('titlebar').querySelector('strong').textContent
        const element = document.getElementById('modulemenu').children[0];
        const name = document.createElement("li");
        const distribute = document.createElement("li");
        const result = await get(id)
        name.style="float: right;margin-ringt:10px"
        name.innerHTML = '<a href="javascript:;" id="distributeName">'+result.username+'</a>'
        distribute.style="float: right;"
        distribute.innerHTML = '<a href="javascript:;" >分配我</a>'
        element.appendChild(distribute)
        element.appendChild(name)
        distribute.addEventListener("click", function(){
            post(id,userName)
            document.getElementById('distributeName').innerHTML = userName
        });
    }
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

    zentaoTable()

    function myinit(){

        var user = document.getElementsByTagName('meta')['ajs-remote-user'].getAttribute('content')
        console.log("user:" +user)
        addBtn(user)

        ///////////////////////// 以下是通用功能 /////////////////////////////////
        //setTimeout(timer_refresh, 10*600)
        autoCloseNotice();

        var title = document.title;
        console.log("document.title:%s", title)
        if(title.indexOf('家居终端软件部_周报') >= 0 || title.indexOf('紫馨组_周报') >= 0 || title.indexOf('长发组_周报') >= 0 || title.indexOf('居辉组_周报') >= 0)
        {
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
        else if((title.indexOf('未修复bug(禅道实时)') >= 0) || (title.indexOf('历史概率bug(禅道实时)') >= 0) || (title.indexOf('智能家居终端bug') >= 0) || (title.indexOf('2023年全部bug(禅道实时)') >= 0 ))
        {
            setTimeout(()=>{
                bug_deal();
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




