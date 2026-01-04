/* eslint-disable no-undef */
// ==UserScript==
// @name         myAddToCart
// @namespace    http://huaqin.com/
// @version      0.12
// @description  方便抢购
// @author       Austin
// @match        http://shop.huaqin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446864/myAddToCart.user.js
// @updateURL https://update.greasyfork.org/scripts/446864/myAddToCart.meta.js
// ==/UserScript==
// 原系统已经定义 document.getElementById 为$

/* global $, searchArr:writable,autoSubmit:writable, directCheckout:writable*/

(function() {
    'use strict';
    window.initGlobalVar = function initGlobalVar()
    {
        // 初始化参数，是否直接 提交订单
        window.autoSubmit = (localStorage.getItem('AutoSubmit')||1)==1?true:false;
        // 初始化参数，是否略过购物车，直接到提交订单
        window.directCheckout = (localStorage.getItem('DirectCheckout')||1)==1?true:false;
        let regArrJSON = localStorage.getItem('searchInfo')||'[]';
        window.searchArr = JSON.parse(regArrJSON);
    }
    window.initGlobalVar();
    // 添加数量输入框
    var isList = attachControlPanel();
    // 有商品清单展示
    if(isList || location.href.indexOf('goods.php?id=')>-1 )
    {
        var bAutoFind = false ;// 自动查找开关
        var objArr = document.getElementsByClassName("goodsName");
        var bReloading = sessionStorage.getItem('bReloadState_'+location.href) == 1 ;
        if(objArr.length == 0 )
        {
           // 判断是否需要自动刷新,地址不同不同参数,没找到需要继续刷新
           if( bReloading )
           {
               // eslint-disable-next-line no-undef
               startReload();
           }
        }else
        {
            // 设置停止，并需要自动查找和提交
            if( bReloading )
            {
                sessionStorage.setItem('bReloadState_'+location.href,0);
                bAutoFind = true;
            }
        }
        for( var i=0;i<objArr.length;i++)
        {
            var oNode=document.createElement('span');
            oNode.innerHTML = "<span>数量:<input type='number' id='selfCount"+i+"' value='1' style='width:40px'></span>";
            objArr[i].appendChild(oNode);
            var sHTML = objArr[i].innerHTML;
            sHTML = sHTML.replace("addToCart(","_addToCart("+i+","); // 使用自定义 _addToCart 函数
            objArr[i].innerHTML = sHTML;
        }
        // 添加form对象
        if( document.forms['ECS_FORMBUY'] === undefined)
        {
            var oForm = document.createElement("div");
            oForm.innerHTML = '<form name="ECS_FORMBUY" id="ECS_FORMBUY"><input name="number" type="text" id="number" value="1" /></form>';//模拟数量
            document.body.appendChild(oForm);
        }
        // 添加theForm对象
        if( document.forms['theForm'] === undefined)
        {
            var oForm = document.createElement("div");
            oForm.innerHTML = 
			'<form action="flow.php" target="_blank" method="post" name="theForm" id="theForm"><input name="shipping" type="radio" value="9" checked="true" supportcod="1" insure="0" ><input name="need_insure" id="ECS_NEEDINSURE" type="checkbox"  value="1" disabled="true"><input type="radio" name="payment" value="4" checked="" iscod="0" onclick="selectPayment(this)"><input type="hidden" name="step" value="done"></form>'; // 提交的单子
            document.body.appendChild(oForm);
        }
        // 单独购买商品处添加按钮
        if(location.href.indexOf('goods.php?id=')>-1)
        {
            var html2 = document.querySelector('.padd').innerHTML;
            var strStaus= (autoSubmit?'直接提交订单':' ')+ (directCheckout?'直接到订单(略过购物车)':' ')
            document.querySelector('.padd').innerHTML = html2.replace('<img src="themes/ecmoban_jingdong/images/goumai2.gif">','<div class="shop">'+strStaus+'</div>')+' 提交方式可在分类模块的文字模式中设置'
        }
       // 添加自定义函数
        addSelfFuns();
        // 修改打开页面为新页面
        // eslint-disable-next-line no-undef
        var str = addToCartResponse.toString();
        str = str.replace("function addToCartResponse(result)", "window.addToCartResponse = function (result)");
        str = str.replace(/if \(result.error == 2\)\s*\{\s*if \(confirm\(result\.message\)\)/g, " if(result.error > 0){console.warn(result);document.title=result.goods_id+'|'+result.message;if (0)"); // 去掉弹框提示
        str = str.replace(/location\.href\s*=(.*);/ig, 'window.myOpen($1,"_blank");');
        str = str.replace("var cartInfo = document.getElementById", "if(typeof global_arr !='undefined'){global_count++;};var cartInfo = document.getElementById"); // 已经成功购买，可以计数
        //str = str.replace("if (result.error > 0)", "result.error=2;debugger;if (result.error > 0)");
        //console.log(str);
        eval(str);
        // 完成函数重定义
        if(bAutoFind)autoFindAndSubmit();
    }
    if(location.href.indexOf("flow.php?step=checkout")>-1)
    {
        // 自动提交订单
        if( autoSubmit && document.forms.theForm !=null )
        {
            console.log("init:"+autoSubmit);
            //document.forms.theForm.submit();
        }
    }
})();

function attachControlPanel()
{
    if(! ( document.forms.listform !=null && document.forms.listform.display.value=='text') )
    {
        return false;
    }
    // 有商品清单页面,并且是文字展示
    var strControlHTML = `<div style="padding:2px;width:320px;opacity: 0.8;position:fixed;top:30px;left:2px;background-color:blue;color:white;">
        <div style="background-color:green;cursor:pointer;" onclick="var obj=$('myControl').style;;obj.display=(obj.display=='none'?'block':'none')">点击折叠配置</div>
        <div style="min-height:300px;" id="myControl">
如果没有商品,自动刷新间隔<input type="number" id="numStartReload" style="width:30px" value="3" min="0">秒  刷新倒计时:<span id="countLeft">N/A</span><br/>
开始时间:<input type="number" id="idHour" style="width:30px" value="0" min="0" max="23">时<input type="number" id="idMin" style="width:30px" value="0" min="0" max="59">分<input type="number" id="idSec" style="width:30px" value="0" min="0" max="59">秒
<br/>
商品1正则表达式:<input type="text" id="autoGoodsName1" style="width:100px" value="" >
商品1数量:<input type="number" id="autoGoodsNum1" style="width:40px" value="1" min="1">
<br/>
商品2正则表达式:<input type="text" id="autoGoodsName2" style="width:100px" value="" >
商品2数量:<input type="number" id="autoGoodsNum2" style="width:40px" value="1" min="1">
<br/>
商品3正则表达式:<input type="text" id="autoGoodsName3" style="width:100px" value="" >
商品3数量:<input type="number" id="autoGoodsNum3" style="width:40px" value="1" min="1">
<br/>
商品4正则表达式:<input type="text" id="autoGoodsName4" style="width:100px" value="" >
商品4数量:<input type="number" id="autoGoodsNum4" style="width:40px" value="1" min="1">
<br/>
自动刷新和下单 <input id="btStartReload" type="button" onclick="startReload()" value='开始'/>
自动下单的匹配清单:<textarea id="txtBought" rows="3" cols="35"></textarea>
<hr/>
跳转页数<input type="number" id="numPage" style="width:30px" value="2" min="2"><input id="btStartReload" type="button" onclick="openNextPage()" value='跳页'> <label>默认流程 <input id="" type="radio" name="myAutoOptions" onclick="chgOpt()"/></label> <br/>

<label>略过购物车到提交页面，然后手动提交 <input id="ckDirectCheckout" type="radio" onclick="chgOpt()"  name="myAutoOptions" /></label><br/>

<label>在商品清单页面直接提交订单 <input id="ckAutoSubmit" type="radio" onclick="chgOpt()"  name="myAutoOptions"/></label><br/>

</div></div>`;
    var oNode=document.createElement('div');
    oNode.innerHTML =strControlHTML;
    document.body.append(oNode);

    // 初始值
    $('numStartReload').value = localStorage.getItem('iReloadDelay')||4;
    $('idHour').value = localStorage.getItem('iHour')||0;
    $('idMin').value = localStorage.getItem('iMin')||0;
    $('idSec').value = localStorage.getItem('iSec')||0;
    $('ckAutoSubmit').checked = autoSubmit;
    $('ckDirectCheckout').checked = directCheckout;

    for( var i=0;i<10;i++)
    {
        let obj = $('autoGoodsName'+(i+1));
        let obj2 = $('autoGoodsNum'+(i+1));
        if( obj != null && obj2!=null && searchArr[i]!=null)
        {
            obj.value = searchArr[i]['strReg'];
            obj2.value = searchArr[i]['num'];
        }
    }
    // 刷新函数
    window.countReload = function()
    {
		var  d = new Date();
		d.setHours($('idHour').value);
		d.setMinutes($('idMin').value);
		d.setSeconds($('idSec').value);
        $('countLeft').innerHTML = window.countNum;
        if(window.countNum<1 && (new Date()>d)){location.reload();}
        window.countNum = window.countNum -1;
    };
    window.startReload = function()
    {
        var countNum = $('numStartReload').value;
        window.countNum = countNum;
        localStorage.setItem('iReloadDelay',countNum);
        localStorage.setItem('iHour',$('idHour').value);
        localStorage.setItem('iMin',$('idMin').value);
        localStorage.setItem('iSec',$('idSec').value);
        var bReloadState=0;
        if(window.handleStartReload==null)
        {
            window.handleStartReload = setInterval( countReload ,1000);
            $('btStartReload').value="停止";
            bReloadState =1;
        }else
        {
            clearInterval(window.handleStartReload);
            window.handleStartReload =null;
            $('btStartReload').value="开始";
        }
        sessionStorage.setItem('bReloadState_'+location.href, bReloadState);
        // 保存搜索参数
        var regArr= [];
        for( var i=0;i<10;i++)
        {
            let obj = $('autoGoodsName'+(i+1));
            let obj2 = $('autoGoodsNum'+(i+1));
            if( obj != null && obj2!=null && obj.value !== '' )
            {
                regArr.push({'strReg':obj.value,'num':obj2.value});
            }
        }
        localStorage.setItem('searchInfo', JSON.stringify(regArr));
    };
    window.openNextPage = function()
    {
        var page =  '&page='+$('numPage').value;
        var s = location.href ;
        if( s.indexOf('page=')>-1)
        {
            s  = s.replace(/page=\d+/,page);
        }else{
            s  = s+page;
        }
        window.open( s ,'_blank');
    };
    window.chgOpt = function()
    {
        directCheckout = $('ckDirectCheckout').checked ;
        autoSubmit = $('ckAutoSubmit').checked ;
        localStorage.setItem('DirectCheckout',directCheckout?1:0);
        localStorage.setItem('AutoSubmit',autoSubmit?1:0);
    };
    return true;
}
function addSelfFuns()
{
        // 增加 _addToCart 函数
        window._addToCart = function(n,id,realNum)
        {
            // 取数量
            var obj = $("selfCount"+n);
            var num = 1; // 默认数量1
            if(obj!=null)
            {
                num = $("selfCount"+n).value;
            }
            if(typeof realNum =='number')
            {
                num = realNum;
            }
            document.forms['ECS_FORMBUY'].elements["number"].value= num;
            addToCart(id); // 调用原先函数
        };
        // 如果自动提交+忽略购物车，那么全自动完成
        window.myOpen = function( url , win )
        {
            // 原先如果是购物车的，改为直接跳转到订单提交页面
            if(directCheckout && url.indexOf('flow.php?step=cart') > -1 )
            {
                url = 'flow.php?step=checkout';
            }
            // 提交订单页面
            if( autoSubmit )
            {
                // 有提交模块
                if(document.forms.theForm!=null){
                //console.log("autoCommit theForm.submit");
				// 需要防止重复提交，用定时器
				if( window.handleSubmit != null ){clearInterval(window.handleSubmit);window.handleSubmit=null;}
                window.handleSubmit = setTimeout( function(){document.forms.theForm.submit();},1);
                return
                }
            }
            window.open(url , win);
        };
}
function autoFindAndSubmit()
{
    // 获取商品名称，id 清单
    var objArr = document.getElementsByClassName("goodsName");
    var goodsArr = [];
    for( var i=0;i<objArr.length;i++)
    {
        let obj = objArr[i].querySelector('div>a');
        var txt = obj.innerText;
        var goodId = 0;
        if( /goods.php\?id=(\d+)/.test(obj.href) )
        {
            goodId = RegExp.$1;
        }
        goodsArr.push({'goodId':goodId,'txt':txt});
    }
    $('txtBought').value = '';
    searchArr.forEach((item,index) =>
    {
        var re = new RegExp(item.strReg,'i');
        goodsArr.every( (good) =>
        {
            // 判断找到匹配
            if( re.test( good.txt ) )
            {
                // 去掉换行
                let txt = good.txt.replace(/\n/g,'');
                $('txtBought').value +='['+txt+'],'+item.num+'\n';
                document.forms['ECS_FORMBUY'].elements["number"].value= item.num;
                addToCart(good.goodId); // 调用加入购物车
                return false;
            }
            return true;
        });
    });
    if($('txtBought').value==='')
    {
        //没有匹配到需要的商品，可以自动自动刷新
        startReload();
    }
    console.log( goodsArr );
}


// 手工抢商品清单 控制台执行
/* eslint-disable no-undef */
// 步骤: 1. 安装 myAddToCart_v0.10 插件(替换系统函数) 2. 打开分类页面如 http://shop.huaqin.com/category.php?id=32 3. 选择显示方式“文字” 4.显示控件配置后，勾选“在商品清单页面直接提交订单” 5.设置页面允许打开新窗口 6. 控制台执行,手工抢商品清单脚本
/*
var global_count = 0, global_handle = null;
var global_arr = [1200]; //默认抢购商品的ID清单，多个商品时，有时提交会进行合并
var priceList = { '1200': 1 }  // 指定 ID抢购的数量，不填默认为1
var countingMS = 3 * 1000; // 3秒执行一次
function autoAddMyList() {
    console.log('autoAddMyList@' + new Date());
    // 如果购买多次需要停止
    if (global_count >= global_arr.length) {
        clearInterval(global_handle);
        global_handle = null;
        console.log('autoAddMyList Stopped@' + new Date());
        return;
    }
    for (var i = 0; i < global_arr.length; i++) {
        if (global_arr[i] > 0) {
            setTimeout(function (id) {
                let num = priceList[id] == null ? 1 : priceList[id];
                _addToCart(0, id, num);
            }(global_arr[i]), 100 * i); //
        }
    }
}
autoAddMyList(); // 第一次试运行
var intervalTime = 500, countingNum = 0;// 每个商品的间隔0.5秒
global_handle = setInterval(function () {
    var leftTime = (countingMS - countingNum * intervalTime) / 1000;
    document.title = leftTime + ' 已抢:' + global_count;
    countingNum++;
    if (leftTime <= 0) {
        autoAddMyList();
        countingNum = 0;
    }
}, intervalTime);// 执行探测轮询
function alert(s) { console.error('alert:' + s); } // 替换alert 防止阻塞
*/