// ==UserScript==
// @name         学习脚本（w 开启）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习看书，说明：选择txt文件将内容导入缓存    按键说明:A:上一页D:下一页W:显示S:隐藏   暂时只支持章节式 
// @author       Skity666
// @icon         https://www.google.com/s2/favicons?domain=lanhuapp.com
// @match        https://*/*
// @grant        none
// @require         https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435681/%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%88w%20%E5%BC%80%E5%90%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/435681/%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%88w%20%E5%BC%80%E5%90%AF%EF%BC%89.meta.js
// ==/UserScript==
jQuery.noConflict();
(function($) {
    '学习脚本';
    //dom加载完毕执行
			if (self == top) {
				$(document).ready(function() {
					//添加样式
					addGlobalStyle(`
			           .timebox {
							position: fixed;
							top: 100px;
							right: 100px;
							width: 200px;
							height: 350px;
							margin: 0;
							text-align: center;
							background-color: rgba(246, 246, 246, .5);
							border-radius: 10px;
			                z-index:99999;
                            display:none;
						}
						.setting{
							position: fixed;
							top: 100px;
							right: 100px;
							width: 200px;
							height: 350px;
							margin: 0;
							text-align: center;
							background-color: white;
							border-radius: 10px;
							z-index:100000;
							display:none;
						}
						#closeSetting{
							position: absolute;
							margin-left: 50px;
							margin-top: -25px;
						}
						.countTime {
							font-size: 20px;
						}

						#day,
						#time,
						#we {
							width: 100%;
							height: 30px;
							font-size: 25px;
							color: darkorchid;
							line-height: 30px;
						}
						#clear,#end,#start{
							width:50px;
							border-radius: 10px;
							border: 0;
							height:22px;
							background-color: aquamarine;
							outline:none;
						}
						#currentPage,#totalPage{
							width:50px;
							border-radius: 10px;
							border: 0;
							height:22px;
							background-color: aquamarine;
							outline:none;
							display: inline-block;
							float: left;
							font-size:10px;
						}
						#wrap-content {
						    columns: calc(100vw - 32px) 1;
						    column-gap: 16px;
						    height: 100%;
						    transition: .4s;
							text-align: left;
							text-indent: 2em;

						}
						#wrap{
							overflow: hidden;
                            height:100%;
						}
						#pageDiv{
							height:42px;
						}
						#operationText{
							text-align: left;
						}
						#chapterList{
							position:fixed;
                            top:30px;
							right:300px;
							height: 300px;
							width: 300px;
							overflow: auto;
						}
			    `);
					//添加盒子
					var box = $("<div class='setting'><div><span id='closeSetting'>关闭</span></div><input type='file' id='file'><p id='operationText'/></div><div class='timebox'><div class='day'><button id='settingBtn'>设置</button><button id='chapterBtn'>章节</button></div><p id='title'></p><div id='wrap'><div id='wrap-content'></div></div><div id='pageDiv'><p id='currentPage'></p><p id='totalPage'></p></div></div>");
					$("body").append(box);
                    //导入成功标识
                    let importFlag=false
					//导入获取小说内容，存入缓存
					function jsReadFiles(files) {
						if (files.length) {
							var file = files[0];
							var reader = new FileReader(); //new一个FileReader实例
							if (/text+/.test(file.type)) { //判断文件类型，是不是text类型
                                importFlag=false
								reader.onload = function() {
									localStorage.setItem("novel", this.result)
                                    console.log("导入成功")
                                    importFlag=true;
								}
								reader.readAsText(file);
							}
						}
					}
					let setting={
						//全局小说行 数组集合
						 array : [],
						 //全局小说标题 数组集合
						 titleArray : [],
						//当前页
						currentPage : 1,
						//将当前页再分成数页，当当前页
						curPage: 1,
						//当当前页总页数
						curPages : 1,
						//盒子宽度
						boxWidth : 1,
						// 全局行数
						lineNum:10,
						visiable:'',
						//按章节设置
						// rule:'第[^\x00-\xff]+章',
						rule:'第(一|二|三|四|五|六|七|八|九|十|百|千|万)+章',
						//是否是返回上一章
						isReturn:false
					}
					// 操作说明绑定
					$("#operationText").html("<p id='operationText'>说明：选择文件将内容导入缓存<br><br>按键说明:<br>A:上一页<br>D:下一页<br>W:显示<br>S:隐藏</p>")
					//初始化
					init()
					$('#file').change(function(e) {
						console.log(e.target.files)
						jsReadFiles(e.target.files)
						localStorage.setItem("currentPage", 1)
                        while(!importFlag){

                        }
						init()
					})
					//初始化
					function init() {
						let novel = localStorage.getItem("novel")
						setting.currentPage = parseInt(localStorage.getItem("currentPage"))||setting.currentPage
						setting.lineNum=localStorage.getItem("lineNum")||setting.lineNum

						setting.visiable=localStorage.getItem("visiable")||setting.visiable
						console.log("visiable",setting.visiable,localStorage.getItem("visiable"))
						$(".timebox").css({"display": setting.visiable});
						if (!novel) {
							return
						}
						let contentArray=[]
						let chapterArray=[]
						let array=novel.split("\r\n")
						const regExp=new RegExp(setting.rule)
						array.forEach((e,index)=>{
							{
								//如果是章节名
								if(regExp.test(e)){
									chapterArray.push(contentArray)
									setting.titleArray.push(contentArray[0])
									contentArray=[]
									contentArray.push(e)
								}else{
									contentArray.push(e)
									if(index==array.length-1){
										chapterArray.push(contentArray)
										setting.titleArray.push(contentArray[0])
									}
								}
							}
						})

						setting.array = chapterArray
						setView()
					}
					/**
					 * 设置页码  总行数  内容
					 */
					function setView() {
						localStorage.setItem("currentPage", setting.currentPage)
						console.log("长度", setting.array.length)
						console.log("页码", setting.currentPage)

						setting.curPages = 1
						let result = ''
						let chapterArray=setting.array[setting.currentPage]
						$("#title").text(chapterArray[0])
						for (let i = 0; i < chapterArray.length; i++) {
							result += "<p>" + chapterArray[i] + "</p>"
						}
						$("#wrap").html("<div id='wrap-content'></div>")
						$("#wrap-content").html(result)
						const pArray = $("#wrap-content").children()
						let last = pArray[pArray.length - 1]
						let maxLeft = last.offsetLeft;
						console.log("last", last.offsetTop, last.offsetHeight)
						let height = $("#wrap-content")[0].offsetHeight
						console.log("height", height)
						let isOut = last.offsetTop + last.offsetHeight > height ? 1 : 0
						setting.boxWidth = $("#wrap-content")[0].offsetWidth + 16
						setting.curPages = maxLeft / setting.boxWidth + 1 + isOut
						console.log("curPages",setting.curPages)
						if(setting.isReturn){
							setting.curPage = setting.curPages
						}else{
							setting.curPage = 1
						}
						go_page(setting.curPage)
						$("#currentPage").text(setting.currentPage+"/"+setting.array.length)
						$("#totalPage").text(setting.curPage+"/"+setting.curPages)

					}
					//上一页
					function go_left() {
						setting.curPage--
						if (setting.curPage < 1) {
							setting.curPage = 1
							if (setting.currentPage - 1 > 0) {
								setting.currentPage--;
								setting.isReturn=true
								setView()
							}
						} else {
							go_page(setting.curPage)
							$("#totalPage").text(setting.curPage+"/"+setting.curPages)
						}

					}

					function go_right() {
						setting.curPage++
						if (setting.curPage > setting.curPages) {
							setting.curPage = setting.curPages
							console.log("前往下一章",setting.currentPage,setting.array.length,setting.currentPage + 1 < setting.array.length)
							// debugger
							if (setting.currentPage + 1 < setting.array.length) {
								setting.currentPage++;
								setView()
							}
						} else {
							go_page(setting.curPage)
							$("#totalPage").text(setting.curPage+"/"+setting.curPages)
						}

					}
					/**
					 *前往第几页
					 */
					function go_page(curPage){
						let sr = `translateX(-${(setting.boxWidth) * (curPage-1)}px)`
						$("#wrap-content").css({
							"transform": sr
						})
					}
					// 打开或关闭设置页面
					function updateToSetting(str){
						$(".setting").css({
							"display":str
						})
					}
					//打开章节列表
					function openChapterList(){
						let chapterListBox=$("#chapterList")
						if(chapterListBox.length==1){
							let dispaly=chapterListBox.css("display")
							if(dispaly=="none"){
								$("#chapterList").css({
									"display":"block"
								})
							}else{
								$("#chapterList").css({
									"display":"none"
								})
							}
							return
						}

						let str=''
						setting.titleArray.forEach((e,index)=>{
							str+="<li data-id='"+index+"'>"+e+"  index:"+index+"</li>"
						})
						//添加盒子
						var box = $("<div id='chapterList'><ul>"+str+"</ul> </div>");
						$("body").append(box);
                        //章节列表
                        $("#chapterList li").click(function(e,index){
                            console.log(e,index)
                            let dataId=e.currentTarget.dataset.id
                            setting.currentPage=parseInt(dataId)
                            setView()
                        })
					}

					document.onkeydown = nextpage

					/**按钮事件
					 * @param {Object} event
					 */
					function nextpage(event) {
						event = event ? event : (window.event ? window.event : null);
						console.log(event.keyCode)
						var display =$('.timebox').css('display');
						console.log(display)
						if(display == 'none'){
							if (event.keyCode == 87) {
								$(".timebox").css({
									"display": "block"
								});
								//w键，打开显示
								setAttr("visiable","block")
							}
						}else{
							if (event.keyCode == 65) go_left(); //向左 a键
							if (event.keyCode == 68) go_right(); //向右  d键
							if (event.keyCode == 83) {
								$(".timebox").css({
									"display": "none"
								});
								$(".setting").css({
									"display": "none"
								});
								$("#chapterList").css({
									"display": "none"
								});
								setAttr("visiable","none")
								//s键，隐藏
							}
						}
					}
					//设置基础属性
					function setAttr(attr,value){
						setting[attr]=value
						localStorage.setItem(attr,value)
					}
					//拖拽时钟
					$(".timebox").mousedown(function() {
						//获取浏览器宽度
						var w = window.innerWidth
						var x = event.pageX
						var y = event.pageY

						//获取坐标，右边界和上边界
						var offX = parseInt(window.getComputedStyle(this)["right"]);
						var offY = parseInt(window.getComputedStyle(this)["top"]);
						//计算出鼠标坐标相对于右上方坐标的间距
						var offLX = w - x - offX;
						var offLY = y - offY;
						document.onmousemove = function() {
							$(".timebox").css("right", w - event.pageX - offLX + "px")

							$(".timebox").css("top", event.pageY - offLY + "px")

						}
						$(".timebox").mouseup(function() {
							document.onmousemove = null;

						})
					})
					// 设置和关闭按钮绑定事件
					$("#closeSetting").click(function(e){
						console.log("关闭")
						updateToSetting("none")
					})
					$("#settingBtn").click(function(e){
						console.log("设置")
						updateToSetting("block")
					})
					//章节
					$("#chapterBtn").click(function(e){
						openChapterList()
					})

					//当前页
					let i = 0
					$("#wrap").mousedown(function(e) {
						//e是点击事件的e,x是鼠标在该盒子里面x轴的位置
						let x = e.offsetX
						//以盒子中间线为界 右边为正，向左翻页
						//				  左边为负，向右翻页
						let endX = x - setting.boxWidth / 2
						//拖拽
						$("#wrap").mousemove(function(e) {
							// debugger
							// 获取鼠标移动后到文档左侧的距离 - 鼠标到拖拽物的距离 （就是移动后拖拽物的left值）
							var a = e.offsetX;
							var l = x - a;
							//l
							//>=0，向左翻页
							//为负，向右翻页
							var maxL = setting.boxWidth; // 右界临界点
							if (l >= maxL) {
								l = maxL;
							}
							endX = l;
							e.stopPropagation()
							e.preventDefault()

						})
						$("#wrap").mouseup(function() {
							//清除事件
							$("#wrap").unbind('mouseup');
							$("#wrap").unbind('mousemove');
							console.log("放开鼠标" + endX)
							console.log("页数", setting.curPages)
							//>=0，向左翻页
							//为负，向右翻页
							if (endX >= 0) {
								go_right()

							} else {
								go_left()

							}
						})
					})


				});
			}

			function addGlobalStyle(css) {
				var head, style;
				head = document.getElementsByTagName('head')[0];
				if (!head) {
					return;
				}
				style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = css;
				head.appendChild(style);
			}
    // Your code here...
})(jQuery);