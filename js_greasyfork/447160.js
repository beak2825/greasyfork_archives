// ==UserScript==
// @name         Enhance Tool I
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  RT
// @author       lyscop
// @match        *
// @include      *
// @grant        none
// ==/UserScript==

    let isShowEff = GM_getValue('showEff', true);

    GM_registerMenuCommand('显示隐藏金币灵石效率', () => {
        GM_setValue('showEff', !isShowEff);
        isShowEff = GM_getValue('showEff', true);
        alert('金币灵石效率已' +
            (isShowEff ? '显示' : '隐藏') +
      '，请刷新'
        );
    });
 
    // dps显示x
    var DPSx=0;
    unsafeWindow.dpsx = function dpsx(){
        var aps = document.getElementsByClassName("ant-tabs-tabpane ant-tabs-tabpane-active")[0].getElementsByTagName("p");
        if(aps.length<20){
            return;
        }
        //计算是物理还是法术
        for(var p=0; p<aps.length; p++) {
            if(aps[p].innerHTML.split('：')[0] == '物理攻击') {
                var wgs = aps[p].innerText.split("：")[1].split("-");
            }
            if(aps[p].innerHTML.split('：')[0] == '物理暴击几率') {
                var wgjl = aps[p].innerText.split("：")[1].split("%")[0];
            }
            if(aps[p].innerHTML.split('：')[0] == '物理暴击倍率') {
                var wgbl = aps[p].innerText.split("：")[1].split("%")[0];
            }
            if(aps[p].innerHTML.split('：')[0] == '法术攻击') {
                var fgs = aps[p].innerText.split("：")[1].split("-");
            }
            if(aps[p].innerHTML.split('：')[0] == '法术暴击几率') {
                var fgjl = aps[p].innerText.split("：")[1].split("%")[0];
            }
            if(aps[p].innerHTML.split('：')[0] == '法术暴击倍率') {
                var fgbl = aps[p].innerText.split("：")[1].split("%")[0];
            }
        }
        var d = 0;
        if(wgs.length==1){
            return
        }
        if(parseInt(wgs[1])>parseInt(fgs[1])){
            d = (parseInt(wgs[0])+parseInt(wgs[1]))/2*parseInt(wgjl)*parseInt(wgbl)/10000;
        } else {
            d = (parseInt(fgs[0])+parseInt(fgs[1]))/2*parseInt(fgjl)*parseInt(fgbl)/10000;
        }
        d = d.toFixed(2);
        var txt = ""+d;
        if(DPSx == d){
            return;
        }
        if(DPSx!=0){
            var dx = d-DPSx;
            dx = dx.toFixed(2);
            if(d>DPSx){
                txt += "<span style='color: red;'>&nbsp;&nbsp;+"+dx+"</span>"
            } else {
                txt += "<span style='color: green;'>&nbsp;&nbsp;"+dx+"</span>"
            }
        }
        DPSx = d;
        document.getElementById("dps").innerHTML=txt;
    }
 
    // 升级所需时间x
    function upLevelx(){
        var href = window.location.href;
        if( href.indexOf("login")>0){
            return;
        }
        dpsx();
        //console.log("upup...");
        var ps = document.getElementsByClassName("ant-tabs-tabpane ant-tabs-tabpane-active")[0].getElementsByTagName("p");
        if(ps.length<4){
            return;
        }
        var elem;
        var title;
        for(var p=0; p<ps.length; p++) {
            if(ps[p].innerHTML.split('：')[0] == ' 经验') {
                elem = ps[p];
                title = elem.getAttribute("title");
            }
        }
 
        if(title){
            var all = title.split("/")[1];
            var now = title.split("/")[0];
            var xl = elem.nextSibling.innerText.split("：")[1];
            xl = xl.split("/")[0];
            var txt = "";
            if(xl>0) {
                var mins = (all-now)/xl;
                if(mins>60){
                    mins = mins/60;
                    txt += mins.toFixed(2)+"小时";
                } else {
                    txt += mins.toFixed(2)+"分钟";
                }
            }
            document.getElementById("levelUp").innerHTML=txt;
        }
    }
    setInterval(upLevelx, 5000);//每分钟检查一次
    
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
    
 
    var hour1;
    var gold1;
    var stone1;
    var yp1 = 0;
    var zfy1 = 0;
    var hour2;
    var gold2
    var stone2;
    var yp2 = 0;
    var zfy2 = 0;
    var goldData;
    var stoneData;
    var ypData;
    var zfyData;
    var effObj = {};
    var roleName;
    var strData="<div>";
    async function getData(){
        //getEffData();
        var strData1 = '';
        var d = new Date();
        var nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);

        var elem = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        roleName = document.getElementsByClassName('ant-card-head')[0].getElementsByClassName('ant-card-head-title')[0].innerHTML;

        if(('0' +d.getMinutes().toString()).slice(-2) == '00') {
            if(!GM_getValue(roleName).gold1) {
                hour1 = ('0' +d.getHours().toString()).slice(-2);

                for(var i=0; i<elem.length; i++) {
                    if(elem[i].innerHTML.split('：')[0] == '金币') {
                        gold1 = elem[i].innerHTML.split('：')[1];
                    }
                    if(elem[i].innerHTML.split('：')[0] == '灵石') {
                        stone1 = elem[i].innerHTML.split('：')[1];
                    }
                }

                yp1 = await getGoodsNum('妖魄');
                effObj = GM_getValue(roleName);
                effObj['hour1'] = hour1;
                effObj['gold1'] = gold1;
                effObj['stone1'] = stone1;
                effObj['yp1'] = yp1;
                GM_setValue(roleName, effObj);

                //GM_setValue('zfy1', zfy1);
                strData1 = "<span style='color:brown'>" + nowTime + "</span><br>记录当前数据<br>";

            } else {
                hour2 = ('0' +d.getHours().toString()).slice(-2);

                for(var p=0; p<elem.length; p++) {
                    if(elem[p].innerHTML.split('：')[0] == '金币') {
                        gold2 = elem[p].innerHTML.split('：')[1];
                    }
                    if(elem[p].innerHTML.split('：')[0] == '灵石') {
                        stone2 = elem[p].innerHTML.split('：')[1];
                    }
                }

                yp2 = await getGoodsNum('妖魄');
                if(hour2 - GM_getValue(roleName).hour1 == 1 || hour2 - GM_getValue(roleName).hour1 == -23) {
                    effObj = GM_getValue(roleName);
                    goldData = gold2 - GM_getValue(roleName).gold1;
                    stoneData = stone2 - GM_getValue(roleName).stone1;
                    ypData = yp2 - GM_getValue(roleName).yp1;
                    //zfyData = zfy2 - GM_getValue('zfy1');
                    if(goldData < 0) {
                        goldData = 0;
                        effObj['gold1'] = gold2;
                        GM_setValue(roleName, effObj);
                    }
                    if(stoneData < 0) {
                        stoneData = 0;
                        effObj['stone1'] = stone2;
                        GM_setValue(roleName, effObj);
                    }

                    if(ypData < 0) {
                        ypData = 0;
                        effObj['yp1'] = yp2;
                        GM_setValue(roleName, effObj);
                    }
                    if(zfyData < 0) {
                        //zfyData = 0;
                        //GM_setValue('zfy1', zfy2);
                    }
                    /*strData1 += "<span style='color:brown'>" + nowTime + "</span><br>每小时金币 " + goldData +
                        "<br>每小时灵石 " + stoneData + " / " + stone2 + " - " + GM_getValue('stone1') +
                         "<br>每小时妖魄 " + ypData + " / " + yp2 + " - " + GM_getValue('yp1') +
                         "<br>每小时祝福油 " + zfyData + " / " + zfy2 + " - " + GM_getValue('zfy1') + "<br>";*/
                    strData1 += "<span style='color:brown'>" + nowTime + "</span><br>每小时金币 " + goldData +
                        "<br>每小时灵石 " + stoneData + " / " + stone2 + " - " + GM_getValue(roleName).stone1 +
                        "<br>每小时妖魄 " + ypData + " / " + yp2 + " - " + GM_getValue(roleName).yp1 + "<br>";
                    effObj['hour1'] = hour2;
                    effObj['gold1'] = gold2;
                    effObj['stone1'] = stone2;
                    effObj['yp1'] = yp2;
                    GM_setValue(roleName, effObj);
                    //GM_setValue('zfy1', zfy2);

                } else {
                    effObj = GM_getValue(roleName);
                    effObj['hour1'] = hour2;
                    effObj['gold1'] = gold2;
                    effObj['stone1'] = stone2;
                    effObj['yp1'] = yp2;
                    GM_setValue(roleName, effObj);
                    //GM_setValue('zfy1', zfy2);
                    
                    strData1 += "<span style='color:brown'>" + nowTime + "</span><br>记录当前数据<br>";
                }
            }
            strData = strData1
            strData +="</div>";
            $("#ixxlog").append(strData);
            var ele = document.getElementById('ixxlog');
            //ele.scrollTop=500
            //ele.scrollTop = ele.scrollHeight;
            ele.scrollTop = ele.scrollHeight - ele.clientHeight;

        }
    }

    var goldDaily;
    var stoneDaily;
    var ypDaily;
    var zfyDaily;
    var strDailyData="<div>";
    async function getDailyData(){
        var strDailyData1 = '';
        var d = new Date();
        var nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
        var elem = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        roleName = document.getElementsByClassName('ant-card-head')[0].getElementsByClassName('ant-card-head-title')[0].innerHTML;
        if(('0' +d.getHours().toString()).slice(-2) == '21' && ('0' +d.getMinutes().toString()).slice(-2) == '00') {
            if(!GM_getValue(roleName).goldDaily) {
                effObj = GM_getValue(roleName);
                for(var i=0; i<elem.length; i++) {
                    if(elem[i].innerHTML.split('：')[0] == '金币') {
                        goldDaily = elem[i].innerHTML.split('：')[1];
                    }
                    if(elem[i].innerHTML.split('：')[0] == '灵石') {
                        stoneDaily = elem[i].innerHTML.split('：')[1];
                    }
                }

                ypDaily = yp1;
                effObj['goldDaily'] = goldDaily;
                effObj['stoneDaily'] = stoneDaily;
                effObj['ypDaily'] = ypDaily;
                GM_setValue(roleName, effObj);
                //GM_setValue('zfyDaily', zfyDaily);
                strDailyData1 = "<span style='color:orange'>" + nowTime + "</span><br>记录当日数据<br>";

            } else {
                effObj = GM_getValue(roleName);
                for(var p=0; p<elem.length; p++) {
                    if(elem[p].innerHTML.split('：')[0] == '金币') {
                        goldDaily = elem[p].innerHTML.split('：')[1];
                    }
                    if(elem[p].innerHTML.split('：')[0] == '灵石') {
                        stoneDaily = elem[p].innerHTML.split('：')[1];
                    }
                }

                ypDaily = yp2;
                goldData = goldDaily - GM_getValue(roleName).goldDaily;
                stoneData = stoneDaily - GM_getValue(roleName).stoneDaily;
                ypData = ypDaily - GM_getValue(roleName).ypDaily;
                //zfyData = zfyDaily - GM_getValue('zfyDaily');

                /*strDailyData1 += "<span style='color:orange'>" + nowTime + "</span><br>每日金币 " + goldData +
                    "<br>每日灵石 "+ stoneData + " / "+ stoneDaily + " - " + GM_getValue('stoneDaily') +
                    "<br>每日妖魄 "+ ypData + " / "+ ypDaily + " - " + GM_getValue('ypDaily') +
                    "<br>每日祝福油 "+ zfyData + " / "+ zfyDaily + " - " + GM_getValue('zfyDaily') + "<br>";*/
                strDailyData1 += "<span style='color:orange'>" + nowTime + "</span><br>每日金币 " + goldData +
                    "<br>每日灵石 "+ stoneData + " / "+ stoneDaily + " - " + GM_getValue(roleName).stoneDaily +
                    "<br>每日妖魄 "+ ypData + " / "+ ypDaily + " - " + GM_getValue(roleName).ypDaily + "<br>";

                effObj['goldDaily'] = goldDaily;
                effObj['stoneDaily'] = stoneDaily;
                effObj['ypDaily'] = ypDaily;
                GM_setValue(roleName, effObj);
                //GM_setValue('zfyDaily', zfyDaily);
            }
            strDailyData = strDailyData1;
            strDailyData +="</div>";
            $("#ixxlog").append(strDailyData);
            var ele = document.getElementById('ixxlog');
            ele.scrollTop = ele.scrollHeight - ele.clientHeight;
        }
    }

    // 计算效率
    var goldEff;
    var stoneEff;
    var hourEff;
    var minEff;
    var leave1;
    var leave2;
    var ft;
    var firstTime;
    var firstGold;
    var firstStone;
    var goldElt;
    var stoneElt;
    var resetAll = document.createElement('a');
    var goldTag = document.createElement('p');
    var stoneTag = document.createElement('p');
    var timeTag = document.createElement('p');
    function getEffDataInit() {
        var href = window.location.href;
        if( href.indexOf("login")>0){
            setTimeout(getEffDataInit, 1500);
            return;
        }
        if(!isShowEff) {
            return;
        }
        roleName = document.getElementsByClassName('ant-card-head')[0].getElementsByClassName('ant-card-head-title')[0].innerHTML;
        if(!GM_getValue(roleName)) {
            effObj['roleName'] = roleName;
            GM_setValue(roleName, effObj);
        }
        var elt = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        firstTime = Date.parse(new Date());
        effObj = GM_getValue(roleName);
        for(var i=0; i<elt.length; i++) {
            if(elt[i].innerHTML.split('：')[0] == '金币') {
                goldElt = elt[i];
                //console.log(goldElt);
                firstGold = elt[i].innerHTML.split('：')[1];
            }
            if(elt[i].innerHTML.split('：')[0] == '灵石') {
                stoneElt = elt[i];
                //console.log(goldElt);
                firstStone = elt[i].innerHTML.split('：')[1];
            }
        }
        resetAll.href = '#';
        //resetAll.onclick = 'resetAllData()'
        resetAll.onclick = function(){
            resetAllData()
        };
        resetAll.innerText = ' 重置All';
        goldTag.innerText = ' 效率：0/小时';
        stoneTag.innerText = ' 效率：0/小时';
        timeTag.innerText = ' 时长：0小时 0分钟';
        timeTag.title = '挂机时长';
        elt[0].append(resetAll);
        goldElt.nextSibling.parentNode.insertBefore(goldTag, goldElt.nextSibling);
        stoneElt.nextSibling.parentNode.insertBefore(stoneTag, stoneElt.nextSibling);
        elt[0].nextSibling.parentNode.insertBefore(timeTag, elt[0].nextSibling);

        effObj['ft'] = firstTime;
        effObj['firstTime'] = firstTime;
        effObj['firstGold'] = firstGold;
        effObj['firstStone'] = firstStone;
        GM_setValue(roleName, effObj);
        console.log(effObj)
        //console.log(firstGold + firstStone)
    }
    window.setTimeout(getEffDataInit, 2000);

    function resetAllData() {
        var newGoldEffTag;
        var newStoneTag;
        var nowTime = Date.parse(new Date());
        roleName = document.getElementsByClassName('ant-card-head')[0].getElementsByClassName('ant-card-head-title')[0].innerHTML;
        var elt = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        effObj = GM_getValue(roleName);
        for(var h =0; h<elt.length; h++) {
            if(elt[h].innerHTML.split('：')[0] == '金币') {
                newGoldEffTag = elt[h].nextSibling;
                firstGold = elt[h].innerHTML.split('：')[1];
            }
            if(elt[h].innerHTML.split('：')[0] == '灵石') {
                newStoneTag = elt[h].nextSibling;
                firstStone = elt[h].innerHTML.split('：')[1];
            }
        }
        newGoldEffTag.innerHTML = ' 效率：0/小时';
        newStoneTag.innerHTML = ' 效率：0/小时';
        console.log('ok')
        for(var i=0; i<elt.length; i++) {
            if(elt[i].innerHTML.split('：')[0] == ' 经验') {
                elt[i].nextSibling.childNodes[1].click();
            }
        }

        effObj['firstTime'] = nowTime;
        effObj['firstGold'] = firstGold;
        effObj['firstStone'] = firstStone;
        GM_setValue(roleName, effObj);
        clearInterval(effData);
        effData = setInterval(getEffData, 60000);
    }


    function getEffData(){
        var href = window.location.href;
        if( href.indexOf("login")>0){
            return;
        }
        if(!isShowEff) {
            return;
        }
        roleName = document.getElementsByClassName('ant-card-head')[0].getElementsByClassName('ant-card-head-title')[0].innerHTML;
        getData();
        window.setTimeout(function(){
            getDailyData();
        }, 500);

        effObj = GM_getValue(roleName);
        var elt = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        var nowTime = Date.parse(new Date());
        var nowGold;
        var nowStone;
        var newGoldEffTag;
        var newStoneTag;
        var newTimeTag;
        for(var j=0; j<elt.length; j++) {
            if(elt[j].innerHTML.split('：')[0] == '金币') {
                newGoldEffTag = elt[j].nextSibling;
                nowGold = elt[j].innerHTML.split('：')[1];
            }
            if(elt[j].innerHTML.split('：')[0] == '灵石') {
                newStoneTag = elt[j].nextSibling;
                nowStone = elt[j].innerHTML.split('：')[1];
            }
        }

        goldEff = parseInt((nowGold - GM_getValue(roleName).firstGold) / ((nowTime - GM_getValue(roleName).firstTime) / (3600 * 1000)));
        //console.log(goldEff);
        stoneEff = parseInt((nowStone - GM_getValue(roleName).firstStone) / ((nowTime - GM_getValue(roleName).firstTime) / (3600 * 1000)));
        //console.log(stoneEff);

        if(goldEff < 0) {
            goldEff = 0;
            effObj['firstTime'] = nowTime;
            effObj['firstGold'] = nowGold;
            effObj['firstStone'] = nowStone;
            GM_setValue(roleName, effObj);
        }
        if(stoneEff < 0) {
            stoneEff = 0;
            effObj['firstTime'] = nowTime;
            effObj['firstGold'] = nowGold;
            effObj['firstStone'] = nowStone;
            GM_setValue(roleName, effObj);
        }

        leave1 = (nowTime - GM_getValue(roleName).ft) % (24 * 3600 * 1000);
        hourEff = Math.floor(leave1 / (3600 * 1000));
        leave2 = leave1 % (3600 * 1000);
        minEff = Math.floor(leave2 / (60 * 1000)) + 1;
        //console.log(minEff)
        newGoldEffTag.innerHTML = ' 效率：' + goldEff + '/小时';
        newStoneTag.innerHTML = ' 效率：' + stoneEff + '/小时';
        elt[0].nextSibling.innerHTML = ' 时长：' + hourEff + '小时 ' + minEff + '分钟';

    }
    var effData = setInterval(getEffData, 60000); //每分钟启动一次
    