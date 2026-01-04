// ==UserScript==
// @name         游侠中文游戏添加标记
// @namespace    游侠中文游戏添加标记
// @version      0.5
// @description  游侠游戏中文非正版分流的游戏列表加颜色标记,左下角可以自定义颜色和加粗
// @author       You
// @include      https://game.ali213.net/forum-77-*.html
// @icon         https://z3.ax1x.com/2021/12/03/oactfJ.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436497/%E6%B8%B8%E4%BE%A0%E4%B8%AD%E6%96%87%E6%B8%B8%E6%88%8F%E6%B7%BB%E5%8A%A0%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/436497/%E6%B8%B8%E4%BE%A0%E4%B8%AD%E6%96%87%E6%B8%B8%E6%88%8F%E6%B7%BB%E5%8A%A0%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

//点击关闭弹框
function closeBox(){
    //恢复默认数据
    let config = JSON.parse(localStorage.getItem("config"))//获取缓存的数据
    let showtext = document.getElementById("showtext")//演示文字
    let colorinput = document.getElementById("colorinput")//颜色选择框
    let checkbox = document.getElementById("checkinput")//粗体选择框

    let weight = config.weight?'bold':'normal'
    showtext.style.color = config.color//默认演示文字颜色
    showtext.style.fontWeight = weight//默认演示文字粗细
    colorinput.value = config.color//默认颜色选择器颜色
    checkbox.checked = config.weight//默认是否打勾
    let box = document.getElementById('box');//关闭弹框
    box.style.display = 'none'
}

//点击保存按钮
function saveStyle(){
    console.log("保存配置成功");
    let colorinput = document.getElementById("colorinput")//颜色选择框
    let checkbox = document.getElementById("checkinput")//粗体选择框

    let item = `{"color":"`+colorinput.value+`","weight":`+checkbox.checked+`}`
    localStorage.setItem("config",item)//缓存添加保存的配置配置
    setColor(colorinput.value,checkbox.checked)//设置游戏标签颜色和是否粗体

    let box = document.getElementById('box');//关闭弹框
    box.style.display = 'none'
}

//选择颜色框改变
function changeColor(el){
    let showtext = document.getElementById("showtext")//演示文字
    showtext.style.color = el.value//设置选择器颜色展示
    //console.dir(el.value)
}

//粗细选择框
function changeChecked(el){
    let weight = el.checked?'bold':'normal'
    let showtext = document.getElementById("showtext")//演示文字
    showtext.style.fontWeight = weight//设置选择器颜色展示
}

//添加按钮元素到页面
function addDom(color = "ff7e41",weight = true){
    //添加的元素
    let weightstyle = weight?'bold':'normal'
    let checked = weight?'checked':''
    document.body.innerHTML = document.body.innerHTML += `<div style="position: fixed;left:25px;bottom:35px;width: 200px;z-index:99999">
        <button type="button" class="btn btn-info" style="position: absolute;left: 0;bottom: 0;color: #fff;background-color: #5bc0de;border:none;text-align: center;font-size: 14px;border-radius:4px;padding:6px 12px;cursor: pointer;hover{color:red}"
            onclick="let box = document.getElementById('box');box.style.display = 'block'">设置标记</button>
        <div id="box"
            style="display:none;position: absolute;left: 0;bottom: 0;width: 200px;height: 200px;border-radius: 4px;background-color: #fff;padding-top: 20px;box-shadow:#e2e2e2 0px 0px 10px 1px;">
            <span class="glyphicon glyphicon-remove"
                style="position: absolute;right: 10px;top: 4px;font-size: 20px;cursor: pointer;" aria-hidden="true"
                onclick="closeBox()">✖</span>
            <div id="showtext" style="color:` + color + `;text-align: center;font-family: 'Microsoft YaHei',Tahoma,Helvetica,'SimSun',sans-serif;font-size:25px;margin-top: 10px;font-weight:` + weightstyle + `;">演示文字</div>
            <input type="color" id="colorinput" value=` + color + ` style="display: block;margin: 10px auto;" onchange="changeColor(this)">
            <div style="display: flex;justify-content: center;align-items: center;margin: 20px;">
                粗体:<input type="checkbox" id="checkinput" style="width: 15px;height: 15px;vertical-align:middle;margin: 0;" ` + checked + ` onchange="changeChecked(this)"/>
            </div>
            <button type="button" class="btn btn-info" style="display: block;margin: 0 auto;color: #fff;background-color: #5bc0de;border:none;text-align: center;font-size: 14px;border-radius:4px;padding:6px 12px;cursor: pointer;"
                onclick="saveStyle()">保存</button>
        </div>
    </div>`//添加dom到页面
}

//设置游戏标签颜色和是否粗体方法
function setColor(color = "ff7e41",weight = true){
	let array = document.getElementsByClassName("xst") //获取游戏列表的标签
    for (let i = 0; i < array.length; i++) {//遍历标签
		let text = array[i].innerText //获取每个标签的文本内容
			let hascn = text.indexOf("CN") > -1 ? true : false //判断是否包含简体 "CN"-- >
				let hastw = text.indexOf("TW") > -1 ? true : false //判断是否包含繁体 "TW"-- >
					let haszb = text.indexOf("正版分流") == -1 ? true : false //判断是否 不 包含 "正版分流"-- >
        if ((hascn || hastw) && haszb) {//判断文本是否包含 中文或繁体 且不包含正版分流-- >
				array[i].style.color = color //给符合条件的元素的文字添加淡橙色
					array[i].style.fontWeight = weight?"bold":"normal" //给符合条件的元素字体设置粗体
        }
	}
    console.log("设置样式成功")//提示
}


(function () {
    window.closeBox = closeBox//方法都绑定到window上
    window.saveStyle = saveStyle//方法都绑定到window上
    window.changeColor = changeColor//方法都绑定到window上
    window.changeChecked = changeChecked//方法都绑定到window上

    //检查缓存是否有配置
    let data = localStorage.getItem("config")//获取缓存的数据
    if(data){//判断配置是否有
        let config = JSON.parse(data)//json字符串转换成对象
        addDom(config.color,config.weight)//页面添加按钮
        setColor(config.color,config.weight)//设置游戏标签颜色和是否粗体
    }else{//如果没有配置则设置默认配置到缓存然后设置游戏标签颜色和是否粗体
        let item = `{"color":"#ff7e41","weight":true}`
        localStorage.setItem("config",item)//缓存添加默认配置
        addDom("#ff7e41",true)//页面添加按钮
        setColor("#ff7e41",true)//设置游戏标签颜色和是否粗体
    }
})();


