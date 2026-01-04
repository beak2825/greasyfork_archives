// ==UserScript==
// @name         Enhance Tool IV
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  RT
// @author       lyscop
// @match        *
// @include      *
// @grant        none
// ==/UserScript==
 
 
    
    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
    
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }
    
     const goodsId = {
      '初始': '62258de568314c57c17abef8',
      '封魔': '62281f1068314c57c17ac41b',
      '盟重': '623d3bf6a439b27b1c4dd973',
    }
    
    function getParams(data) {  // GET参数格式化
      const keys = Object.keys(data).sort()
      let params = keys.reduce((rst, v) => rst += `${v}=${data[v]}&`, '').slice(0, -1)
      return params
    }
    
    async function postData(url = '', data = {}, method = 'POST') {  // 接口请求封装
      let request = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
        body: JSON.stringify(data)
      }
      method === 'GET' && delete (request.body)
      let params = method === 'GET' ? '?' + getParams(data) : ''
      const response = await fetch(`http://119.91.99.233:8088/api/${url}${params}`, request);
      return response.json();
    }
    
    
    async function getGoodsNum(name) {
      const result = await postData('getGoods', {}, 'GET')
        .then(res => {
          console.log(res)
          let num = 0
          if (res.status === 200) {
            res.data.goodsList.forEach(item => {  // 遍历物品
              if (item.name === name) num = item.count
            })
          }
          return num
        });
      return result
    }
    


    // 自动皮卡丘 基尔加丹 巫妖王
    var wsBool = false;
    var gjBool = false;
    var pkqBool = false;
    var jdBool = false;
    var wywBool = false;
    var numpkq = 0;
    var numjd = 0;
    var numwyw = 0;
    function autoPKQ() {
        var HPP;
        var d = new Date();
        var nowTime;
        var gjmap = document.getElementById("ixxgjmap").value;
        //var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
        var btns = document.getElementsByClassName("ant-card-body")[5].getElementsByTagName("button");
        var btn = btns[btns.length-1];
        var wsEle = document.getElementsByClassName("ant-card-body")[5].getElementsByTagName("input")[7];
        var gjEle = document.getElementById('ixxgj');
        var newMap = document.getElementsByClassName("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[0]
        var aps = document.getElementsByClassName("ant-tabs-tabpane ant-tabs-tabpane-active")[0].getElementsByTagName("p");
        for(var p=0; p<aps.length; p++) {
            if(aps[p].innerHTML.split('：')[0] == 'HP') {
                HPP = aps[p].innerHTML.split("：")[1].split("/")[1];
            }
        }
        if(('0' +d.getHours().toString()).slice(-2) == '13' && ('0' +d.getMinutes().toString()).slice(-2) == '00') {
            //console.log('HP:' + HPP);
            nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
            if(HPP < 1800) {
                showMessage(nowTime + ' 血太少不打皮卡丘');
                pkqBool = true;
                return;
            }

            console.log(nowTime + ' 打皮卡丘啦');
            for(var q=0; q<3; q++) {
                //showMessage(nowTime + ' 打皮卡丘啦');
            }

            if(btn.innerText == "停止挂机"){
                btn.click();
            }
            sleep(1000);
            unsafeWindow.chuansong("盟重土城回城石");
                    /*postData('goods', { id: goodsId['盟重'] })
                      .then(data => {
                        console.log(data);
                    });*/
                   
                //ppx(97,115);
            sleep(1000);
            var ips = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("input");
            ips[0].value = 97;
            ips[0].dispatchEvent(new Event('input'));
            ips[1].value = 115;
            ips[1].dispatchEvent(new Event('input'));
            
            sleep(1000);
            var gobtns = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("button");
            gobtns[gobtns.length-1].click();
            sleep(1000);
            // 显示怪物列表
            document.getElementsByClassName("ant-card-body")[3].getElementsByClassName("ant-tabs-nav ant-tabs-nav-animated")[0].childNodes[1].childNodes[2].click();

            pkqBool = true;
            console.log(nowTime + ' pkqBool '+ pkqBool);
            sleep(1000);
            var ele1 = document.getElementsByClassName("ant-card-body")[3].getElementsByTagName("a");
            for(var v=0; v<ele1.length; v++) {
                if(ele1[v].innerText.split(' ')[1] == '皮卡丘') {
                    ele1[v].parentNode.parentNode.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[0].click();
                }
            }
            sleep(1000);
            btn.click();

            if(wsEle.checked) {
                wsEle.click();
                wsBool = true;
            }
            if(gjEle.checked) {
                gjEle.click();
                gjBool = true;
            }
            //pkqBool = true;
            //console.log(nowTime + ' pkqBool '+ pkqBool);
        }

        if(pkqBool && ('0' +d.getMinutes().toString()).slice(-2) > 10) {
            pkqBool = false;
            if(document.getElementById("map").innerText.indexOf("皮卡丘") == -1) {
                nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
                console.log(nowTime + '打鸡蛋啦');
                console.log(nowTime + ' pkqBool '+ pkqBool);
                for(var r=0; r<3; r++) {
                    //showMessage(nowTime + ' 打鸡蛋啦');
                }

                btn.click();
                unsafeWindow.chuansong("初始大陆回城石");
                /*postData('goods', { id: goodsId['初始'] })
                  .then(data => {
                    console.log(data);
                });*/
                //ppx(28,28);
                sleep(1000);
                var ips = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("input");
                ips[0].value = 28;
                ips[0].dispatchEvent(new Event('input'));
                ips[1].value = 32;
                ips[1].dispatchEvent(new Event('input'));
                sleep(1000);
                var btns = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("button");
                btns[btns.length-1].click();
                // 显示怪物列表
                document.getElementsByClassName("ant-card-body")[3].getElementsByClassName("ant-tabs-nav ant-tabs-nav-animated")[0].childNodes[1].childNodes[2].click();
                sleep(1000);
                var ele2 = document.getElementsByClassName("ant-card-body")[3].getElementsByTagName("a");
                for(var n=0; n<ele2.length; n++) {
                    if(ele2[n].innerText.split(' ')[1] == '基尔加丹') {
                        ele2[n].parentNode.parentNode.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[0].click();
                    }
                }
                sleep(1000);
                btn.click();
                jdBool = true;
                console.log(nowTime + ' jdBool '+ jdBool);
            }
        }
        if(jdBool && ('0' +d.getMinutes().toString()).slice(-2) > 25) {
            jdBool = false;
            if(document.getElementById("map").innerText.indexOf("基尔加丹") == -1) {
                
                nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
                console.log(nowTime + '打巫妖王啦');
                console.log(nowTime + ' jdBool '+jdBool);
                for(var s=0; s<3; s++) {
                    //showMessage(nowTime + ' 打巫妖王啦');
                }
                btn.click();
                sleep(1000);
                unsafeWindow.autoGo('终结之地', function(){
                    //var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
                    var btns = document.getElementsByClassName("ant-card-body")[5].getElementsByTagName("button");
                    var btn = btns[btns.length-1];
                    btn.click();
                });
                sleep(1000);
                if(document.getElementById("map").innerText.indexOf("巫妖王") > 0) {
                    wywBool = true;
                    console.log(nowTime + ' wywBool '+wywBool);
                    clearInterval(timer3);
                }
            }
        }
        if(wywBool &&
           ((('0' +d.getHours().toString()).slice(-2) == '13' && ('0' +d.getMinutes().toString()).slice(-2) > 40) ||
            (('0' +d.getHours().toString()).slice(-2) == '14' && ('0' +d.getMinutes().toString()).slice(-2) > 0))) {
            wywBool = false;
            
            if(document.getElementById("map").innerText.indexOf("巫妖王") == -1) {
                
                nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);

                console.log(nowTime + ' wywBool ' + wywBool);
                //showMessage(nowTime + ' 挂机啦');
                console.log(nowTime + ' 挂机啦');
                btn.click();
                sleep(1000);
                // 去挂机地图
                unsafeWindow.autoGo(gjmap, function(){
                    //var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
                    var btns = document.getElementsByClassName("ant-card-body")[5].getElementsByTagName("button");
                    var btn = btns[btns.length-1];
                    // 开始挂机
                    btn.click();
                });

                if(wsBool) {
                    wsEle.click();
                }
                if(gjBool) {
                    gjEle.click();
                }
            }
        }

    }
    setInterval(autoPKQ, 60000); //每分钟启动一次
 
 
    
    var wrapEle = document.createElement('div');
    wrapEle.id = "wrap";
    wrapEle.setAttribute('style', '' +
                         'position:fixed;' +
                         'right:0px;' +
                         'top:0px;' +
                         'width:300px;' +//最大宽度
                         //'padding:40px;' +
                         'background-color:rgba(255,255,255,0)!important;' +
                         'z-index:2147483647!important;' +//显示最顶层
                         '');
 
    //document.body.appendChild(wrapEle);//元素加入body 报错无法加入
    document.documentElement.appendChild(wrapEle);//元素加入body
 
    function showMessage(text) {
        const wrapDiv = document.getElementById("wrap");
        var div = document.createElement('div');
        div.setAttribute('style', '' +
                         'display:none!important;' +//去掉直接显示
                         'left:0px;' +
                         'top:0px;' +
                         'margin-left:auto;' +//table块靠右显示
                         //'position:absolute!important;' +
                         'font-size:22px!important;' +
                         'overflow:auto!important;' +
                         'background-color:rgba(255,255,255,0.7)!important;' +
                         'font-family:sans-serif,Arial!important;' +
                         'font-weight:normal!important;' +
                         'text-align:left!important;' +//左对齐
                         'color:#000!important;' +
                         'padding:0.1em 0.2em!important;' +
                         'border-radius:3px!important;' +
                         'border:1px solid #ccc!important;' +
                         //'max-width:350px!important;' +
                         'max-height:1216px!important;' +
                         'z-index:2147483647!important;' +
                         '');
 
        div.innerHTML = text;
        div.style.display = 'table';// 换行显示结果
        let fc = wrapDiv.firstElementChild
        if (fc) {
            wrapDiv.insertBefore(div,fc)
        } else {
            wrapDiv.appendChild(div);
        }
        setTimeout(() => {
            div.parentNode.removeChild(div);
        },6000)
    }