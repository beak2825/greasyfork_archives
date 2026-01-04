// ==UserScript==
// @name         imcloudapp 私人主页/浏览器主页/收藏夹/云收藏/网址导航，网站配合插件使用更佳
// @namespace    https://openuserjs.org/users/knciik
// @version      1.0.2
// @copyright    2021, knciik (https://openuserjs.org/users/knciik)
// @license      Apache-2.0
// @author       knciik
// @match        *://www.imcloudapp.com/*
// @icon         data:image/png;base64,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 H2OjmLvjzWQynFZkqYBI0TuRhKRiy1RZWLMOinlYzBIpkcJzJs7X7ZOFsDe9Mk6QMHKqpCPk8OzG 9X+43rhhXnutVgAAAGBlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAMCAAIAAAAWAAAASlEQAAEA AAABAQAAAFERAAQAAAABAAALE1ESAAQAAAABAAALEwAAAABQaG90b3Nob3AgSUNDIHByb2ZpbGUA eOv7mQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0yMVQxOToxNjoxMSswMDowMEDrR0QAAAAl dEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMjFUMTk6MTY6MTErMDA6MDAxtv/4AAAAL3RFWHRleGlm OklDQ1Byb2ZpbGVEZXNjcmlwdG9yAFBob3Rvc2hvcCBJQ0MgcHJvZmlsZdTo0xEAAAAXdEVYdGV4 aWY6UGl4ZWxQZXJVbml0WAAyODM1C3yu4QAAABd0RVh0ZXhpZjpQaXhlbFBlclVuaXRZADI4MzXA IH1EAAAAEHRFWHRleGlmOlBpeGVsVW5pdAAxZZb/yQAAADh0RVh0aWNjOmNvcHlyaWdodABDb3B5 cmlnaHQgKGMpIDE5OTggSGV3bGV0dC1QYWNrYXJkIENvbXBhbnn5V3k3AAAAIXRFWHRpY2M6ZGVz Y3JpcHRpb24Ac1JHQiBJRUM2MTk2Ni0yLjFXrdpHAAAAJnRFWHRpY2M6bWFudWZhY3R1cmVyAElF QyBodHRwOi8vd3d3LmllYy5jaBx/AEwAAAA3dEVYdGljYzptb2RlbABJRUMgNjE5NjYtMi4xIERl ZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0JEU0ipAAAAAElFTkSuQmCC
// @grant        none
// @description  针对imcloudapp.com网页收藏夹，提供额外功能：图标透明度、网页标题、修改图标、搜索栏

// @ 插件开启后在左下角新增一个齿轮按钮，点击以打开插件配置
// @ 1. 图标透明度
// @	2. 网页标题
// @	3. 修改图标    开启后需要刷新页面，然后再图标右键点击编辑，弹出页面多出一个输入框，输入图片url链接或者base64图片编码
// @	4. 添加搜索栏

// @downloadURL https://update.greasyfork.org/scripts/428330/imcloudapp%20%E7%A7%81%E4%BA%BA%E4%B8%BB%E9%A1%B5%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%BB%E9%A1%B5%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BA%91%E6%94%B6%E8%97%8F%E7%BD%91%E5%9D%80%E5%AF%BC%E8%88%AA%EF%BC%8C%E7%BD%91%E7%AB%99%E9%85%8D%E5%90%88%E6%8F%92%E4%BB%B6%E4%BD%BF%E7%94%A8%E6%9B%B4%E4%BD%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/428330/imcloudapp%20%E7%A7%81%E4%BA%BA%E4%B8%BB%E9%A1%B5%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%BB%E9%A1%B5%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BA%91%E6%94%B6%E8%97%8F%E7%BD%91%E5%9D%80%E5%AF%BC%E8%88%AA%EF%BC%8C%E7%BD%91%E7%AB%99%E9%85%8D%E5%90%88%E6%8F%92%E4%BB%B6%E4%BD%BF%E7%94%A8%E6%9B%B4%E4%BD%B3.meta.js
// ==/UserScript==
(function() {
    'use strict';

	//本地数据保存
	var store =window.localStorage.getItem("imcloudapp_supper")

	var json = {
		alphacheck : false,
		alpha :100,
		modfiycheck:false,
		modfiy:null,
		iconcheck:false,
		seachcheck:false,
		seacher:1,
        bgmcheck:false,
        bgm:null,
		apps:{},
	}

	if(store && store != "null"){
		json = JSON.parse(store)
        console.log("读取到配置",json)
	}else{
		window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
        console.log("初始化配置")
	}

    var oldtitle = document.title //记录一下原本的title

	function setIconAlpha(al){
        var appitem_list = document.getElementsByClassName("appitem")
        for (var i=0;i<appitem_list.length;i++){
            var appitem = appitem_list[i]
            var icon = appitem.children[0]
            icon.style.opacity = al/100
        }

        var div1 = document.getElementById("my-seacher1")
        if(div1){
            div1.style.opacity = al/100
        }
	}

    function setSeacher(index){
        var div1 = document.getElementById("my-seacher1")
        var div2 = document.getElementById("my-seacher2")
        if(div1){
            div1.remove()
        }
        if(div2){
            div2.remove()
        }
        if(!index){
            return
        }

        var d1 = document.createElement("div")
        d1.id="my-seacher1"
        d1.style = `height:60px;width:30%;position:absolute;top:60px;left:35%;`
        d1.innerHTML = `
            <div class="searchInput ivu-input-wrapper ivu-input-wrapper-default ivu-input-type" style="margin-bottom: 10px;height:50px;">
              <span class="ivu-input-suffix" style="padding:0;height:50px;width:50px;">
               <button id="my-seacher-btn" style="height:100%;width:100%;border:none;border-left:2px solid #aabdf5;border-radius: 4px;background-size:50px;background-position:0;"></button>
              </span>
              <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
              <input id="my-seacher-word" autocomplete="off" spellcheck="false" type="text" placeholder="搜索" class="ivu-input ivu-input-default ivu-input-with-suffix"
                style="height:50px;color:#999;font-size:22px;" onkeypress="if(event.which === 13) document.getElementById('my-seacher-btn').click()">
            </div>
        `
        var vc = document.getElementsByClassName("page-launcher")[0]
        vc.insertBefore(d1,vc.children[0])

        if(json.alphacheck) {
          d1.style.opacity = json.alpha/100
        }

        if(json.alphaCheck){
           d1.style.opacity = json.alpha/100
        }

        var d2 = document.createElement("div")
        d2.style = `height:100px;width:100px;`
        d2.id="my-seacher2"
        var vContainer = document.getElementsByClassName("container")[0]
        vContainer.insertBefore(d2, vContainer.children[0]);

        setTimeout(function(){
            if(index == 1) {
                var btn = document.getElementById("my-seacher-btn")
                btn.style.backgroundImage="url(data:image/webp;base64,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)"
                btn.addEventListener("click",function(){
                    var input = document.getElementById("my-seacher-word")
                    var word = input.value
                    var url = "https://www.baidu.com/s?wd="+word
                    window.open(url, '_blank');
                })
            }else if (index == 2) {
                var btn = document.getElementById("my-seacher-btn")
                btn.style.backgroundImage="url(data:image/webp;base64,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)"
                btn.addEventListener("click",function(){
                    var input = document.getElementById("my-seacher-word")
                    var word = input.value
                    var url = "https://www.sogou.com/web?query="+word
                    window.open(url, '_blank');
                })
            }else if (index == 3){
                var btn = document.getElementById("my-seacher-btn")
                btn.style.backgroundImage="url(data:image/webp;base64,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)"
                btn.addEventListener("click",function(){
                    var input = document.getElementById("my-seacher-word")
                    var word = input.value
                    var url = "https://www.google.com.hk/search?q="+word
                    window.open(url, '_blank');
                })
            }else if (index == 4){
                var btn = document.getElementById("my-seacher-btn")
                btn.style.backgroundImage="url(data:image/webp;base64,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)"
                btn.addEventListener("click",function(){
                    var input = document.getElementById("my-seacher-word")
                    var word = input.value
                    var url = "https://cn.bing.com/search?q="+word
                    window.open(url, '_blank');
                })
            }
        },0)
    }

    function verifyUrlOrBase64(text){
        if(text == "" || text=="null" || !text){
            return false
        }

        var checkStr = text.substr(0,15).toLowerCase()
        var result = checkStr.startsWith("http://")
            || checkStr.startsWith("https://")
            || checkStr.startsWith("ftp://")
            || checkStr.startsWith("tftp://")
            || text.startsWith("//")
            || text.startsWith("data:image/")

        //console.log("verifyUrlOrBase64",text,checkStr,result)
        return result
    }

    function updateAppIcon(){
        var vGrid = document.getElementsByClassName("v-grid")[0];
        var appItems = vGrid.getElementsByClassName("appitem");
        var cache = {}
        for (var i=0;i<appItems.length;i++){
           var appitem = appItems[i]
           var name = appitem.querySelector("div.text span").innerHTML
           if(json.apps[name] && json.apps[name].icon && verifyUrlOrBase64(json.apps[name].icon)){
            //   console.log("updateAppIcon",name,json.apps[name].icon)
              cache[name] = json.apps[name]
              var vIcon = appitem.querySelector("div.icon")
              vIcon.style.backgroundImage="url("+json.apps[name].icon+")"
              var wordIcon = appitem.querySelector("span.icontext")
              if(wordIcon){
                  wordIcon.remove()
              }
           }
        }
        json.apps = cache //丢弃已删除的配置
        window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
    }

    function setAppIcon(){
       setTimeout(updateAppIcon,600)
       if(document.body.isAddAppIconListener) return

       document.body.addEventListener("DOMNodeInserted",function(event){
           if(!json.iconcheck){
               return
           }
           if(event.target.className=="v-transfer-dom"){
               setTimeout(function(){
                   var labels = event.target.getElementsByTagName("label")
                   for (var i=0;i<labels.length;i++){
                       var label = labels[i]
                       if(label.innerHTML=="请输入网址"){
                           //添加一个输入框
                           var form =event.target.getElementsByTagName("form")[0]
                        //   console.log(form)
                           var newDiv = document.createElement("div")
                           newDiv.className = "ivu-form-item"
                           newDiv.innerHTML = `
                           <label class="ivu-form-item-label">自定义图标路径(url链接 或 <a target="_blank" href="https://note.youdao.com/s/QTH5Ag73">base64编码</a>)</label>
	                       <div class="ivu-form-item-content">
		                     <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type">
			                   <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
			                   <input autocomplete="off" spellcheck="false" type="text" placeholder="" class="ivu-input ivu-input-default" />
			                 </div>
			               </div>`
                           form.append(newDiv)

                           var confirmBtn = event.target.getElementsByClassName("ivu-btn")[0]
                           confirmBtn.addEventListener("click",function(){
                              var inputs = form.getElementsByTagName("input")
                              var url = inputs[0].value
                              var name = inputs[1].value
                              var icon = inputs[2].value

                            //   console.log("确认",url,name,icon)
                              json.apps[name] = {
                                  url,icon
                              }
                              window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
                              setTimeout(updateAppIcon,100)
                           })

                           return
                       }
                   }
               },300)
           }
       })
       document.body.isAddAppIconListener = true
    }

    function init(){
        // 添加一个按钮
        var divcon = document.getElementsByClassName('base')[0]
        var divbtn = document.createElement('div')
        divbtn.style.backgroundImage = "url(data:image/webp;base64,UklGRiAFAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSCsDAAABoETbtqk92mXbthEbv/+ybdu2bcX6VLZj27Ztm6txz73fffla6UXEBGjHZpULioouqFJAh64A2HZ24VyFeV/hfGC1Kpxu1oQCOfD6X/B2veuA7efMb+s7u1z043qC1/94425O1fZXJ3TiPLY8LpWPIuLYC6VHgLJEjpkL0PcnzNWTsqluXTOtlhjwb2/cSxI4Yz6hgx47VTvL3avkwyGbCb083hcE9qypPA/OhXSIV9M3oaoiViz2FcXTi9aogxX1sHFWVkn+7Xyt6C2c7ko0BfRQ4ElP5T6+7co9fDt3BP5I5EJg6v6+65dsxl360t6W9pwJ3JrEWKBY9jXTCNzwtKVyYPbu8S4A/pT9IXl+YakJcE28LNDAakLeOasM6BbthPUwTOYN2Mv6dJtvcZ2h9kCtWHcBT1g9jHnX7yXtdct4Y9UZxl3A27G+h/UnGg/g9pU355AyNBb+i3Hm3R/+uQlGypzujDvAp17OzF2NTrD+j8/vOz+Pmtgp4+DVzhUKvMihntEeu37YBXncCLD+iJC95jqvGd94Lg0r8rQ3PnOmKPg3p4lxn6c8TgfjE2dc2C/ON8Y9cS70tDXuc9YcFrLrdOc942vPZWE1PE2NWg5XhZThNjTae+qG6bjrvxoGTN/V2WmmM2yngB7OWJmdgfFNbz9ZETsC9Rx95pDxpXHbGTtNgM6K/BjwrnHYMoeJ1Z2zhmLWMK4C3ol13HqYaOhhgy0js98NWof5vMwUUBZLOeAsQ+2M4H9l1gEGKfq1QCtLrfL5XnYT4I54u00ErrF054qQjW/sbNUBFuwdT1cCcw6wdFpujTUnc4a8g4CnlWQKGLWHJe1e99lPPn6rgQL/BjJK9DeAJr78WwL8lcizmMN2j7NrR8zPE6iGd0FZjNqj8NaP96UPvjojn5ObE/hbvItDoOudAbtcmiH48nhqvM7p/pMDU7q2/+a+B5r8320q5vftnXWlSvISICvdvMTJd9Vj0sfABUr2gu5FkrTL1b3zGXHnLpJUq8Ol2m6rvNPd1/vt4p1UkMusTTurUAdZU1Swn1g/Fc7524xrCkdVLigquqCKdmwCAFZQOCDOAQAAcA4AnQEqQABAAD5dJo5Fo6IhnPxOqDgFxLSADtLbwA/QCmi3AO6gl0L2X3L9qkhj5dweOEQpblRte+1TBU1DO8ljXpJ0GvNKcpT7+UZ+efQm55dGCGRVGpbKRoyhx90vne7/o8x+WLsuzyLOmBGW4LSIpwRCydSEN+qUAAD+rLJ/9G6XqUjL6VjdjsTFxoca4C9Hi7R+Rq6DSJWTT5ZgCACfj+GWS5OXqB/MWEbug2Jn9hZfJQKOElwKa7ZWPfdZDHXXC8JgbTsvHB3489BxMw6BBbbRJy+lBUh2lpZfK8cdAFGP+DTkCAWsS5qqevXjTd2fGZuXX3ypVTHjVxGpI0pZNs89g8ws6lEcn8+fTzGDjtrcaw8iNN7u5SElVtWzUizUgopqk4oWln1lMWgWL/a/1pXtc+Wf4ZiWRkHF2LYOHmc2BXzM9z3ZHyOC+HUyPWv27f/5OkjHCD0shxMnQIcfBn7+sJ5xj+OZzq+A5MrjXVNNA5IsVTvRrEUjUUApeKt6jUVihGi6Ex7G6zJdv/rNdyIsJZQBTEQV//K1N3Up6jMtLWugLi78fBql4iP4F3Zbra8w2kvhIAyvFqVzJZBL/+Vi3/5UbCVgAAAA)";
        divbtn.style.backgroundSize = "35px 35px"
        divbtn.style.backgroundRepeat = "no-repeat"
        divbtn.style.backgroundPosition = "9px 7px"

        //每次新版本编译后data-v-x会改变
        //读取父元素的data-v-x
        var htmltext = divcon.parentElement.innerHTML
        var datatext = htmltext.match(/data-v-[a-z0-9]{8}/g)[0]

		divbtn.setAttribute(datatext,"")
        divbtn.className = "btn self"
        divcon.appendChild(divbtn)

        //添加一个遮罩层
        var divtrans = document.createElement('div')
        divtrans.setAttribute("data-transfer",true)
        divtrans.className = "v-transfer-dom"
        divtrans.id = "mysetting"
        document.body.append(divtrans)

        divtrans.innerHTML = `
           <div class="ivu-drawer-mask" style="background-color: rgba(0, 0, 0, 0.2); display: none;" onclick="closeMyPanel()"></div>
           <div class="ivu-drawer-wrap ivu-drawer-hidden">
              <div class="ivu-drawer ivu-drawer-left" style="width: 470px;margin-left:50px;">
				<div class="ivu-drawer-content">

					<div class="ivu-drawer-header">
					 <div class="sidebar-header">
					  <div  class="btn left">
					   <i class="iconfont"></i>
					  </div>
					  <div class="title">
					   插件配置
					  </div>
					 </div>
					</div>

					<div class="ivu-drawer-body">
						<form id="mysettingForm">
							<div data-v-653a6582="" class="nav">
							  <!-- 图标透明度-->
							  <div data-v-653a6582="" class="item">
							    <span data-v-653a6582="" class="text transition"><input name="alphacheck" type="checkbox" value="0">&nbsp;&nbsp;启用图标透明度</span>
								<span data-v-653a6582="" class="text transition">&nbsp;&nbsp;&nbsp;&nbsp;透明度：&nbsp;&nbsp;&nbsp;<input name="alpha" type="range" min="0" max="100" value="100" style="height:5px;width:200px;"></span>
							  </div>

							  <!-- 网页title-->
							  <div data-v-653a6582="" class="item">
							    <span data-v-653a6582="" class="text transition"><input name="modfiycheck" type="checkbox" value="0">&nbsp;&nbsp;启用自定义网页标题</span>
								<span data-v-653a6582="" class="text transition">&nbsp;&nbsp;&nbsp;&nbsp;输入标题：<input name="modfiy" type="text" value="" placeholder ="我的主页" style="height:22px;width:200px;"></span>
							  </div>

							  <!-- 自定义图标-->
							  <div data-v-653a6582="" class="item">
							    <span data-v-653a6582="" class="text transition"><input name="iconcheck" type="checkbox" value="0">&nbsp;&nbsp;启用修改图标</span>
							  </div>

							  <!-- 启用搜索栏-->
							  <div data-v-653a6582="" class="item">
							    <span data-v-653a6582="" class="text transition"><input name="seachcheck" type="checkbox" value="0">&nbsp;&nbsp;启用搜索栏</span>
								<span data-v-653a6582="" class="text transition">&nbsp;&nbsp;&nbsp;&nbsp;搜索引擎：<select name="seacher" value="1" style="height:22px;width:200px;">
										<option value="1">百度</option>
										<option value="2">搜狗</option>
										<option value="3">谷歌google</option>
										<option value="4">必应bing</option>
									<select></span>
							  </div>

							  <!-- 启用背景音乐-->
							  <!--
                              <div data-v-653a6582="" class="item">
							    <span data-v-653a6582="" class="text transition"><input name="bgmcheck" type="checkbox" value="0">&nbsp;&nbsp;启用背景音乐</span>
								<span data-v-653a6582="" class="text transition">&nbsp;&nbsp;&nbsp;&nbsp;音乐连接：<input name="bgm" type="text" value="" placeholder ="url" style="height:22px;width:200px;"></span>
							  </div>
                              -->
							</div>
						</form>
						<div data-v-653a6582="" class="bottom">
						  <button data-v-653a6582="" type="button" class="btn-down ivu-btn ivu-btn-default ivu-btn-long ivu-btn-large">
						   <span>导入配置</span>
						  </button>
						  <button data-v-653a6582="" type="button" class="btn-upload ivu-btn ivu-btn-default ivu-btn-long ivu-btn-large">
						   <span>导出配置</span>
						  </button>
						  <button data-v-653a6582="" type="button" class="btn-close ivu-btn ivu-btn-default ivu-btn-long ivu-btn-large">
						   <span>关闭</span>
						  </button>
						</div>
					</div>
				</div>
			  <div>
           </div>
        `
        //添加一个模态框
        var divmodel = document.createElement('div')
        divmodel.setAttribute("data-transfer",true)
        divmodel.className = "v-transfer-dom"
        divmodel.id = "mysetting-upload"
        divmodel.style.display = "none"
        document.body.append(divmodel)

        divmodel.innerHTML = `
              <div class="ivu-modal-mask" style="z-index: 1003;"></div>
              <div class="ivu-modal-wrap  vertical-center-modal" style="z-index: 1003;" onclick="document.getElementById('mysetting-upload').style.display ='none'">
                <div class="ivu-modal" style="width: 520px;">
                  <div class="ivu-modal-content" onclick="event.stopPropagation();">
                    <a class="ivu-modal-close" onclick="document.getElementById('mysetting-upload').style.display ='none'">
                      <i class="ivu-icon ivu-icon-ios-close"></i>
                    </a>
                    <div class="ivu-modal-header">
                       <div class="ivu-modal-header-inner">导入配置</div>
                    </div>
                    <div class="ivu-modal-body">
                      <form autocomplete="off" class="ivu-form ivu-form-label-top">
                        <div class="ivu-form-item ivu-form-item-required">
                          <label class="ivu-form-item-label">请粘贴配置</label>
                            <div class="ivu-form-item-content">
                              <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type">
                                <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                <input id="my-setting-upload-value" autocomplete="off" spellcheck="false" type="text" placeholder="" class="ivu-input ivu-input-default" />
                              </div>
                            </div>
                          </div>
                        </form>
                    </div>
                    <div class="ivu-modal-footer">
                      <div style="height:80px;">
                        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-down" style="position:absolute;left:40%;bottom:15px;">
                          <span>确认</span>
                        </button>
                        <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-up" style="position:absolute;left:40%;bottom:15px;">
                          <span>确认</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`

		//自定义按钮点击事件
		divbtn.addEventListener("click",function(){
			divtrans.getElementsByClassName("ivu-drawer-mask")[0].style.display="block"
			divtrans.getElementsByClassName("ivu-drawer-wrap")[0].className = "ivu-drawer-wrap"
		})

		//点击wrap关闭
		divtrans.getElementsByClassName("ivu-drawer-wrap")[0].addEventListener("click",function(){
			divtrans.getElementsByClassName("ivu-drawer-mask")[0].style.display="none"
			divtrans.getElementsByClassName("ivu-drawer-wrap")[0].className = "ivu-drawer-wrap ivu-drawer-hidden"
		})
		divtrans.getElementsByClassName("ivu-drawer-left")[0].addEventListener("click",function(event){
			event.stopPropagation();
		})

		//点击关闭按钮
		divtrans.getElementsByClassName("btn-close")[0].addEventListener("click",function(){
			divtrans.getElementsByClassName("ivu-drawer-mask")[0].style.display="none"
			divtrans.getElementsByClassName("ivu-drawer-wrap")[0].className = "ivu-drawer-wrap ivu-drawer-hidden"
		})

        //点击导入
        divtrans.getElementsByClassName("btn-down")[0].addEventListener("click",function(){
            var title = divmodel.getElementsByClassName("ivu-modal-header-inner")[0]
            var input = divmodel.getElementsByClassName("ivu-input")[0]
            var tip = divmodel.getElementsByClassName("ivu-form-item-label")[0]
            divmodel.getElementsByClassName("ivu-btn-up")[0].style.display="none"
            divmodel.getElementsByClassName("ivu-btn-down")[0].style.display="block"

            title.innerHTML = "导入配置"
            tip.innerHTML = "请粘贴配置"
            input.value = ""
            divmodel.style.display = "block"
        })

        //点击导出
        divtrans.getElementsByClassName("btn-upload")[0].addEventListener("click",function(){
            var title = divmodel.getElementsByClassName("ivu-modal-header-inner")[0]
            var tip = divmodel.getElementsByClassName("ivu-form-item-label")[0]
            var input = divmodel.getElementsByClassName("ivu-input")[0]
            divmodel.getElementsByClassName("ivu-btn-down")[0].style.display="none"
            divmodel.getElementsByClassName("ivu-btn-up")[0].style.display="block"

            title.innerHTML = "导出配置"
            tip.innerHTML = "请复制并保存"
            input.value = window.localStorage.getItem("imcloudapp_supper")
            divmodel.style.display = "block"
        })

        //导入确定
        divmodel.getElementsByClassName("ivu-btn-down")[0].addEventListener("click",function(){
            var input = divmodel.getElementsByClassName("ivu-input")[0]
            var settingStr = input.value
            try{
                var settingObj = JSON.parse(settingStr)
                if(settingObj){
                    window.localStorage.setItem("imcloudapp_supper",settingStr)
                    alert("导入成功，请刷新页面")
                    divmodel.style.display = "none"
                    return
                }
            }catch(error){

            }
            alert("输入有误")
        })

        //导出确定
        divmodel.getElementsByClassName("ivu-btn-up")[0].addEventListener("click",function(){
            divmodel.style.display = "none"
        })

		//初始化插件配置页面
		setTimeout(function(){
			var list = divtrans.getElementsByTagName("input")
			var alphacheckElement = list[0]
			var alphaElement = list[1]
			var modfiycheckElement =list[2]
			var modfiyElement = list[3]
			var iconcheckElement = list[4]
			var seachcheckElement = list[5]
			var seacherElement = divtrans.getElementsByTagName("select")[0]
			//var bgmcheckElement =list[6]
			//var bgmElement = list[7]

			if (json.alphacheck) {
				alphacheckElement.checked = true
				alphaElement.value = json.alpha
				setIconAlpha(json.alpha)

			}else{
				alphaElement.parentElement.style.display="none"
			}

			if (json.modfiycheck) {
				modfiycheckElement.checked = true
				modfiyElement.value = json.modfiy
                document.title = json.modfiy
			}else{
				modfiyElement.parentElement.style.display="none"
			}

			if(json.iconcheck){
				iconcheckElement.checked = true
                setAppIcon()
			}

			if(json.seachcheck){
				seachcheckElement.checked = true
				seacherElement.value = json.seacher
                setSeacher(json.seacher)
			}else{
				seacherElement.parentElement.style.display="none"
			}

			//if(json.bgmcheck){
			//	bgmcheckElement.checked  = true
			//	bgmElement.value = json.bgm
			//}else{
			//	bgmElement.parentElement.style.display="none"
			//}

			//插件配置页面事件
			alphacheckElement.addEventListener("click",function(){
				json.alphacheck = alphacheckElement.checked
				if(json.alphacheck){
					alphaElement.parentElement.style.display = "block"
                    alphaElement.value = json.alpha
                    setIconAlpha(json.alpha)
				}else{
					alphaElement.parentElement.style.display = "none"
                    json.alpha = 100
                    setIconAlpha(100)
				}
                window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
			})

			alphaElement.addEventListener("change",function(){
				json.alpha = alphaElement.value
				window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
                setIconAlpha(json.alpha)
			})

			modfiycheckElement.addEventListener("click",function(){
				json.modfiycheck = modfiycheckElement.checked
				if(json.modfiycheck){
					modfiyElement.parentElement.style.display = "block";
                    modfiyElement.value = json.modfiy;

                    if( json.modfiy="" || json.modfiy=="null" || !json.modfiy){
                        console.log("不修改标题")
                    }else{
                        document.title = json.modfiy
                    }
				}else{
					modfiyElement.parentElement.style.display = "none"
                    document.title = oldtitle
                    modfiyElement.value =""
                    json.modfiy = ""
				}
                window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
			})

			modfiyElement.addEventListener("keyup",function(){
				json.modfiy = modfiyElement.value
				window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
				document.title = json.modfiy
			})

            iconcheckElement.addEventListener("click",function(){
                json.iconcheck = iconcheckElement.checked
                window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
                setTimeout("alert('请刷新页面')",10)
            })

            seachcheckElement.addEventListener("click",function(){
                json.seachcheck = seachcheckElement.checked
                window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))

                if(json.seachcheck){
					seacherElement.parentElement.style.display = "block"
                    seacherElement.value = json.seacher

                    setSeacher(json.seacher)
				}else{
					seacherElement.parentElement.style.display = "none"
                    setSeacher(null)
				}
            })

            seacherElement.addEventListener("change",function(){
                json.seacher = seacherElement.value
                window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))

                setSeacher(json.seacher)
            })

            //bgmcheckElement.addEventListener("click",function(){
            //    json.bgmcheck = bgmcheckElement.checked
            //    window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))

            //    if(json.bgmcheck){
			//		bgmElement.parentElement.style.display = "block"
            //        bgmElement.value = json.bgm
			//	}else{
			//		bgmElement.parentElement.style.display = "none"
			//	}
            //})

            //bgmElement.addEventListener("keyup",function(){
			//	json.bgm = bgmElement.value
			//	window.localStorage.setItem("imcloudapp_supper",JSON.stringify(json))
			//})
		},0)
    }

	//监听加载完成后添加控件
    window.addEventListener('load', function () {
        //加一个延时循环保证元素已经绘制结束
        var timer = setInterval(function(){
            console.log("循环检测")
            if(document.getElementsByClassName('base')[0]){
                init();console.log("第一次初始化")

                //var vm = document.querySelector("#app").__vue__
                //var vgrid = vm.$children[0].$children[0]
                //applist: vgrid.items {href,icon,name,sort,_id} / vgrid.$data.list

                if(document.body.isAddInitListener) return
                document.body.addEventListener("DOMNodeInserted",function(event){
                    if(event.target.className=="page-launcher"){
                        init();console.log("页面更新")
                    }
                });
                document.body.isAddInitListener = true
                clearInterval(timer)
            }
        },50)
    })
})();

