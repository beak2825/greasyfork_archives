// ==UserScript==
// @name         临时倍速(按下按键临时改变视频速度)
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  一个按下键盘按键时改变视频速度松开还原的插件,可以自定义快捷键和自定义速度
// @author       CloudTree
// @grant        GM_setValue
// @grant		GM_getValue
// @grant        GM_registerMenuCommand
// @match        http://*/*
// @include      *
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/437728/%E4%B8%B4%E6%97%B6%E5%80%8D%E9%80%9F%28%E6%8C%89%E4%B8%8B%E6%8C%89%E9%94%AE%E4%B8%B4%E6%97%B6%E6%94%B9%E5%8F%98%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437728/%E4%B8%B4%E6%97%B6%E5%80%8D%E9%80%9F%28%E6%8C%89%E4%B8%8B%E6%8C%89%E9%94%AE%E4%B8%B4%E6%97%B6%E6%94%B9%E5%8F%98%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%29.meta.js
// ==/UserScript==

(function () {
	'use strict';
	/*-------------------对象---------------------------- */

	//储存用户设置
	var Data = (function () {
		//构造
		var NewData = function () {
			this.dataList = [];
			this.version = version;
			var that = this;
			var loaded = this.load();
			if (loaded === false) {
				this.defaultData();
				this.save();
			}
			eventLoop.addListener(function () {
				that.save()
			})
		}
		//----------私有对象--------
		//储存一套信息
		var DataCell = (function () {
			//构造
			var NewDataCell = function (archiveCell) {
				if (NewDataCell[archiveCell[0]]) {
					return new NewDataCell[archiveCell[0]](archiveCell);
				}
			};
			//创建一个shortTimeVup,用于临时加速
			NewDataCell.shortTimeVup = (function () {
				var NewShortTimeVup = function (archiveCell) {
					this.type = archiveCell[0];
					if (archiveCell.length > 1) {
						this.multiSpeed = new MultiSpeed(archiveCell[1]);
						this.comboKey = new ComboKey(archiveCell[2]);
					} else {
						this.multiSpeed = new MultiSpeed(3.5);
						this.comboKey = new ComboKey(["c"]);
					}
				};
				NewShortTimeVup.prototype.save = function () {
					var archiveCell = [];
					archiveCell.push(this.type);
					archiveCell.push(this.multiSpeed.save());
					archiveCell.push(this.comboKey.save());
					return archiveCell;
				}
				return NewShortTimeVup;
			})();
			return NewDataCell;
		})();
		/**
		 * -------基础data类型----
		 * 接口
		 * 构造()
		 * copyKey(event)从键盘事件中提取信息,提取成功返回"true",失败返回event.key.toLowerCase();
		 * newObj()返回一个新的实例
		 * copy(obj)复制同类实例的数据,成功返回true,失败返回false
		 * toString()返回用于显示的字符串
		 * save()返回用于存入储存中的数据
		 */
		// 储存倍速的信息
		var MultiSpeed = (function () {
			// 构造
			var NewMultiSpeed = function (speed) {
				this.speed = speed;
				this.str = "";
			}
			NewMultiSpeed.prototype.copyKey = function (event) {
				if (/^[\d]$/.test(event.key)) {
					this.str += event.key;
					this.speed = +this.str;
					return "true";
				} else if (event.key === ".") {
					if (/\./.test(this.str)) {
						return "true";
					} else {
						this.str += ".";
						this.speed = +this.str;
						return "true";
					}
				} else if (event.key === "Backspace") {
					this.str = this.str.replace(/.$/, "");
					this.speed = +this.str;
					return "true";
				} else if (event.key === "Delete") {
					this.str = "";
					this.speed = +this.str;
					return "true";
				}
				return event.key.toLowerCase();
			}
			//新建一个实例
			NewMultiSpeed.prototype.newObj = function () {
				return new NewMultiSpeed();
			}
			//用于从另一个实例中拷贝信息
			NewMultiSpeed.prototype.copy = function (obj) {
				if (obj.speed > 0 && obj.speed < 16) {
					this.speed = obj.speed;
				} else {
					this.speed = 3;
				}
				eventLoop.sendEvent();
				return true;
			};
			// 输出用于显示速度的字符串
			NewMultiSpeed.prototype.toString = function () {
				if (this.speed) {
					var str;
					// https://www.cnblogs.com/NazLee/p/11646023.html
					str = this.speed //.toFixed(2);
					// e.g. int 2 => "2.00" float 1.1 => "1.10"
					str = "\u2716 " + str;
					// e.g. "2.00" => "x 2.00"
					return str;
				} else {
					return ". . .";
				}
			}
			//输出用于储存的信息
			NewMultiSpeed.prototype.save = function () {
				return this.speed;
			}
			return NewMultiSpeed;
		})();
		// 储存组合键的对象的构造函数
		var ComboKey = (function () {
			// 静态成员
			var counter = 0,
				NewComboKey;
			// 新构造函数的实现(调用counter,创建了一个"闭包")
			NewComboKey = function ([key, shiftKey, ctrlKey, altKey]) {
				this.key = key ? key.toUpperCase() : "";
				this.shiftKey = shiftKey ? true : false;
				this.ctrlKey = ctrlKey ? true : false;
				this.altKey = altKey ? true : false;
				counter++;
			}
			// ----------------静态方法-------------
			// 获得实例总数
			NewComboKey.getCounter =
				NewComboKey.prototype.getCounter = function () {
					return counter;
				}
			// ---------------实例方法---------------
			//读取键盘事件
			NewComboKey.prototype.copyKey = function (event) {
				// if(event.key ===">"){
				// 	return event.key.toLowerCase();
				// }else
				if ((event.key.length < 2) && Boolean(event.key)) {
					this.key = event.key.toUpperCase();
					this.shiftKey = event.shiftKey;
					this.ctrlKey = event.ctrlKey;
					this.altKey = event.altKey;
					return "true";
				} else if (event.key === "Delete") {
					this.key = "";
					return "true";
				} else if (event.key === "Backspace") {
					this.key = null;
					return "true";
				} else {
					return event.key.toLowerCase();
				}
			}
			//新建一个实例
			NewComboKey.prototype.newObj = function () {
				return new NewComboKey([]);
			}
			//用于从另一个实例中拷贝信息
			NewComboKey.prototype.copy = function (obj) {
				if (obj.key) {
					this.key = obj.key.toUpperCase();
					this.shiftKey = obj.shiftKey;
					this.ctrlKey = obj.ctrlKey;
					this.altKey = obj.altKey;
					eventLoop.sendEvent();
					return true;
				}
				return false;
			};
			// 转为字符串
			NewComboKey.prototype.toString = function () {
				if (this.key) {
					var str = "";
					str += this.shiftKey ? "shift + " : "";
					str += this.ctrlKey ? "ctrl + " : "";
					str += this.altKey ? "alt + " : "";
					str += this.key ? this.key : "";
					//.toLowerCase()
					return str;
				} else {
					return ". . ."
				}
			}
			//输出用于储存的信息
			NewComboKey.prototype.save = function () {
				return [this.key, this.shiftKey, this.ctrlKey, this.altKey];
			}
			// 按下的键是否满足条件,支持返回true
			NewComboKey.prototype.isKeyDown = function (event) {
				var isDown = (this.key === event.key.toUpperCase()) &&
					(this.shiftKey === event.shiftKey) &&
					(this.ctrlKey === event.ctrlKey) &&
					(this.altKey === event.altKey);
				return isDown;
			};
			// 松开键后是否已不满足条件,不支持返回true
			NewComboKey.prototype.isKeyUp = function (event) {
				var isUp = (this.key === event.key.toUpperCase()) ||
					(this.shiftKey !== event.shiftKey) ||
					(this.ctrlKey !== event.ctrlKey) ||
					(this.altKey !== event.altKey);
				return isUp;
			}
			// 是否为有效组合键
			NewComboKey.prototype.isNormCombo = function (event) {
				return ((event.key.length < 2) && Boolean(event.key));
			}
			return NewComboKey;
		})();
		//---------实例方法---------
		//插入一套设置
		NewData.prototype.append = function (archiveCell, index) {
			if (index === undefined) {
				this.dataList.push(new DataCell(archiveCell))
			}
		};
		//删除一套设置
		NewData.prototype.delete = function () {};
		//读取储存中的数据
		NewData.prototype.load = function () {
			var archiveList = GM_getValue("data" + this.version);
			console.log(archiveList);
			if (archiveList) {
				archiveList.forEach(archiveCell => {
					this.append(archiveCell)
				});
				eventLoop.sendEvent();
				return true;
			} else {
				return false;
			}
		};
		//写入数据到储存中
		NewData.prototype.save = function () {
			var archiveList = [];
			for (let index = 0; index < this.dataList.length; index++) {
				archiveList.push(this.dataList[index].save());
			}
			GM_setValue("data" + this.version, archiveList);
			this.timeStamp = new Date().getTime();
			GM_setValue("timeStamp" + this.version, this.timeStamp)
		};
		//生成一套初始数据
		NewData.prototype.defaultData = function () {
			this.append(["shortTimeVup"])
		};
		//数据更新
		NewData.prototype.refresh = function () {};
		//---------私有方法---------
		return NewData;
	})();

	//用于实现功能
	var Controller = (function () {
		var NewController = function (dataObj) {
			//console.log("Controller 创建成功");
			this.dataObj = dataObj;
			this.controllerList = [];
			for (let index = 0; index < dataObj.dataList.length; index++) {
				let cell = dataObj.dataList[index]
				if (makeController[cell.type]) {
					this.controllerList.push(new makeController[cell.type](cell))
				}
			}
			//console.log(dataObj);
		};
		var makeController = {};
		makeController.shortTimeVup = (function () {
			//构造
			var NewShortTimeVup = function (dataCell) {
				var videoInitialSpeed = [];
				//保存数据
				this.dataCell = dataCell;
				//更改速度
				function speedChange(event) {
					//console.log(event);
					//console.log(dataCell.comboKey.isKeyDown(event));
					if (dataCell.comboKey.isKeyDown(event)) {
						//console.log(event);
						// 获取video列表
						var videoList = document.getElementsByTagName("video");
						for (let i = 0; i < videoList.length; i++) {
							// 如果速度未改变设置视频速度
							if (videoList[i].playbackRate != dataCell.multiSpeed.speed) {
								console.log(videoList[i] + "开始加速");
								videoInitialSpeed[i] = videoList[i].playbackRate;
								videoList[i].playbackRate = dataCell.multiSpeed.speed;
							}
						}
						document.body.removeEventListener("keydown", speedChange);
						document.body.addEventListener("keyup", speedRestore);
					}
				};

				//还原速度
				function speedRestore(event) {
					// console.log(event.key);
					if (dataCell.comboKey.isKeyUp(event)) {
						// 获取video列表
						var videoList = document.getElementsByTagName("video");
						for (let i = 0; i < videoList.length; i++) {
							console.log(videoList[i] + "停止加速");
							videoList[i].playbackRate = videoInitialSpeed[i];
							videoInitialSpeed[i] = undefined;
							//重新设定播放位置,用于解决音画不同步,导致卡顿
							//videoList[i].currentTime = videoList[i].currentTime;
						}
						document.body.addEventListener("keydown", speedChange);
						document.body.removeEventListener("keyup", speedRestore);
					}
				};
				document.body.addEventListener("keydown", speedChange);
				document.body.addEventListener("keyup", speedRestore);
			};
			return NewShortTimeVup;
		})();
		return NewController;
	})();

	//用户界面
	var Ui = (function () {
		//构造
		var NewUi = function (dataObj) {
			this.menu = NewDiv(document.body, myBodyStyle);
			//创建cardList,保存所有card
			this.cardList = [];
			//遍历datalist,并创建
			for (let index = 0; index < dataObj.dataList.length; index++) {
				this.cardList.push(new Card(dataObj.dataList[index], this.menu));
			}

			/*
					// 点击空白处隐藏菜单
					document.addEventListener("mousedown", nodeList.close);
					parent.onmousedown = function (event) {
						// 防止事件冒泡,导致菜单隐藏
						event.stopPropagation();
					}
					*/
			new closeButton(this.menu);
		}
		//-----------------私有对象----------------
		//生成一个卡片
		var Card = (function () {
			var NewCard = function (dataCell, parent) {
				if (newCardList[dataCell.type]) {
					return new newCardList[dataCell.type](dataCell, parent);
				}
			};
			//储存各种card构造函数的对象
			var newCardList = {};
			newCardList.shortTimeVup = (function () {
				var newShortTimeVup = function (dataCell, parent) {
					// 返回一个Menu对象
					//包含当前对象所有元素的对象
					var nodeList = {};
					this.nodeList = nodeList;
					// 生成"倍速:"
					this.speedInputDiv = new inputDiv(parent, "倍速:", dataCell.multiSpeed);
					// 生成"快捷键:"
					this.keyInputDiv = new inputDiv(parent, "快捷键:", dataCell.comboKey);
				};
				//-----------------------私有对象------------------------------
				//生成一个 完整的输入栏(包括标题,按键,占位符,输入栏)
				var inputDiv = (function () {
					//构造
					var Div = function (parent, title, value) {
						//包含当前对象所有元素的对象
						var nodeList = {};
						this.nodeList = nodeList;
						this.value = value;
						this.displayValue = value;
						var that = this;
						// 生成title
						nodeList.textDiv = NewDiv(parent, myTextStyle, title);
						// 生成输入栏
						nodeList.inputDiv = NewDiv(parent, myInputDivStyle);
						// 使能聚焦
						nodeList.inputDiv.tabIndex = 0;
						// 栏内按键
						nodeList.buttonDiv = NewDiv(nodeList.inputDiv, myInnerButtonStyle, "\u21BB");
						// 占位
						nodeList.buttonDiv2 = NewDiv(nodeList.inputDiv, myInnerButtonStyle, "\u21BB");
						nodeList.buttonDiv2.style.float = "left";
						nodeList.buttonDiv2.style.visibility = "hidden";
						// 分割线
						nodeList.boundaryDiv1 = NewDiv(parent, myBetweenLineStyle);
						// 绑定inputDiv的事件
						nodeList.inputDiv.addEventListener("focus", isFocus);
						nodeList.inputDiv.addEventListener("blur", isBlur);
						//绑定事件的函数
						//成为焦点时,创建value缓存,将显示值设置为value缓存
						function isFocus() {
							//新建一个按键缓存
							that.displayValue = value.newObj();
							that.refresh();
							//读取键盘事件
							document.body.addEventListener("keydown", copyKey);
							//设置栏内按键
							nodeList.buttonDiv.setText("\u2714");
							nodeList.buttonDiv.addEventListener("mouseup", save);
						}
						//取消焦点时,清除缓存.刷新显示值
						function isBlur() {
							//重新连接到实际value
							that.displayValue = that.value;
							that.refresh();
							// 停止读取键盘事件
							document.body.removeEventListener("keydown", copyKey);
							//设置栏内按键
							nodeList.buttonDiv.setText("\u21BB");
							nodeList.buttonDiv.removeEventListener("mouseup", save);
							console.log("blur!");
						}
						//value缓存读取输入值
						function copyKey(event) {
							var result = that.displayValue.copyKey(event);
							if (result === "true") {
								that.refresh();
							} else if (result === "escape") {
								nodeList.inputDiv.blur();
							} else if (result === "enter") {
								save();
							} else {}
						}
						//储存输入值
						function save() {
							that.value.copy(that.displayValue);
							nodeList.inputDiv.blur();
						}
					};
					//---------------实例方法-----------
					//设置内容
					Div.prototype.setText = function (text) {
						this.nodeList.inputDiv.setText(text);
						return this;
					}
					//刷新内容
					Div.prototype.refresh = function () {
						this.setText(this.displayValue.toString());
					}
					return Div;
					/*
						nodeList.speedInputDiv.onmousedown = function (event) {
							// 清空文本
							setDivText(nodeList.speedInputDiv);
							// 防止冒泡到Menu
							event.stopPropagation();
							// 如果点击别处,恢复原状
							parent.addEventListener("mousedown", openSetMenu);
						}
					*/
				})();
				//-----------------------实例方法------------------------------
				//刷新内容
				newShortTimeVup.prototype.refresh = function () {
					this.keyInputDiv.refresh();
					this.speedInputDiv.refresh();
				}
				return newShortTimeVup;
			})();
			return NewCard;
		})();
		// 生成一个设置过style的div
		// style格式注意addStyle内注释
		var NewDiv = (function () {
			//构造
			var Div = function (parent, style, text) {
				var div = document.createElement("div");
				parent.appendChild(div);
				div.setText = setText;
				if (style) {
					addStyle(div, style)
				};
				if (text) {
					div.setText(text)
				};
				return div;
			};
			//-------------------私有函数------------------
			//注入外联样式的函数
			var addStyle = (function () {
				// 给元素注入css的函数,
				// 构造函数接收element,styleStr//暂无,important
				// id插入element
				// stylrNode插入的style节点插入element
				// 私有静态变量
				var timeStamp = new Date().getTime();
				// 私有函数
				/*添加伪类名对应的类名,
				 *被替换的伪类前为my开头的class,
				 *名称中只能有-,_,a-z,A-Z,0-9*/
				function addPseudoInClass(style) {
					var regexp = /(\.my[a-z0-9\_\-]*):([a-z]+\b)/gi;
					var newSubStr = "$1:$2,$1.$2";
					return style.replace(regexp, newSubStr);
				};
				// 获得一个新时间戳
				// 生成不重复的时间戳
				function createTimeStamp() {
					var newTimeStamp = new Date().getTime();
					while (newTimeStamp == timeStamp) {
						newTimeStamp = new Date().getTime();
					}
					timeStamp = newTimeStamp;
					return newTimeStamp;
				};
				// 获取一个不会重复的id
				function createId() {
					var handName = "my-Video-Controller-";
					return handName +
						(createTimeStamp() * 36)
						.toString(36);
				};
				// 去掉字符串中的注释
				function delNote(str) {
					var regexp = /\/\*.*?\*\//g;
					return str.replace(regexp, "");
				}
				// 用id替换str中的my开头的class
				// 名称中只能有-,_,a-z,A-Z,0-9
				// id前不要加#,使用createId提供的id
				function classToId(style, id) {
					var regexp = /\.my[a-z][a-z0-9\_\-]*/gi;
					return style.replace(regexp, "#" + id);
				}
				// 将style注入head
				function injectStyle(style) {
					var myStyleNode = document.createElement("style");
					myStyleNode.innerHTML += style;
					document.head.appendChild(myStyleNode);
					return myStyleNode;
				}

				// 返回函数,形成闭包
				return function addStyle(elemt, styleStr) {
					// 设置元素id
					elemt.id = createId();
					// 去掉字符串中的注释
					styleStr = delNote(styleStr);
					// 添加伪类名对应的类名
					styleStr = addPseudoInClass(styleStr);
					// 用id替换str中的字母开头的class
					styleStr = classToId(styleStr, elemt.id);
					// 注入style
					elemt.styleNode = injectStyle(styleStr);
				}
			})();
			// 修改div内文本,如果text为空,则改为空
			function setText(text) {
				if (!this.textSpan) {
					this.textSpan = document.createElement("span");
					this.appendChild(this.textSpan);
				}
				this.textSpan.innerHTML = text;
				return this;
			}
			return Div;
		})();
		//生成关闭按钮
		var closeButton = (function () {
			var Div = function (parent) {
				this.buttonFClose = NewDiv(parent, myBackButtonStyle, "\u2716");
				this.buttonFClose.addEventListener("mouseup", function () {
					close(parent);
				});
			};
			return Div;
		})();
		//---------------私有变量------------------
		// 样式表
		{
			var myBodyStyle = ".myBodyStyle {/* 相对于视口定位的 */position: fixed;/* 设置相对视窗位置 */top: 50px;right: 50px;/* 透明背景 */background: #1112;/* 设置元素的堆叠顺序 */z-index: 99999;/* 毛玻璃特效 */backdrop-filter: blur(1.5px);/* 内边距 */Padding: 0px;/* 溢出部分隐藏 */overflow: hidden;/* 圆角 */border-radius: 5px;/* 宽度 */width: 250px;/* transition: all 250ms cubic-bezier(.02, .01, .47, 1); *//* 应用过渡属性的属性名称 */transition-property: all;/* 过渡效果的速度曲线 */transition-timing-function: ease;/* 过渡动画所需的时间 */transition-duration: 0.5s;/* 过渡效果开始作用之前需要等待的时间 */transition-delay: 0.1s;/* 设置字体 */font-family: 'Microsoft YaHei', 'Segoe UI Symbol';/* 行高 */line-height: 1.6;/* 字间距 */letter-spacing: 0.163em;/* 粗细 */font-weight: 400;/* 字形 */font-style: normal;}.myBodyStyle:hover {/* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */box-shadow: 5px 5px 8px 0px #0005;/* 毛玻璃特效 */backdrop-filter: blur(5px);/* 平移 */transform: translate(-1px, -1px);/* 过渡效果开始作用之前需要等待的时间 */transition-delay: 0s;}"
			var myTextStyle = ".myTextStyle {/* 宽度,高度 */width: 30%;height: 18px;/* 轮廓线 */border: 0;/* 转为块元素 */display: block;/* 外边距 *//* 上边 | 右边 | 下边 | 左边 */margin: 5px auto 5px 5px;/* 背景颜色 */background: #FFF;/* 内边距 */padding: 2px auto;/* 字号 */font-size: 12px;/* 圆角 */border-radius: 8px;/* 文字居中 */text-align: center;line-height: 150%;/* 禁止选中 */user-select: none;}"
			var myBetweenLineStyle = ".myBetweenLineStyle {/* 宽度,高度 */width: 90%;height: 4px;/* 轮廓线 */border: 0;/* 转为块元素 */display: block;/* 外边距 *//* 上边 | 右边 | 下边 | 左边 */margin: 7px auto;/* 毛玻璃特效 */backdrop-filter: blur(5px);/* 背景颜色 */background: #fff3;/* 圆角 */border-radius: 4px;}"
			var myBackButtonStyle = ".myBackButtonStyle {/* 宽度,高度 */width: 17px;height: 17px;/* 手形标志 */cursor: pointer;/* 背景颜色 */background: #FFF;/* 文字居中 */text-align: center;/* 字符大小 */font-size: 12px;/* 行高 */line-height: 1.4;/* 字间距 */letter-spacing: 0.011em;/* 粗细 */font-weight: 400;/* 字体样式 */font-style: normal;/* 字体颜色 */color: #999;/* 圆角 */border-radius: 100%;/* 外边距 *//* 上边 | 右边 | 下边 | 左边 */margin: 5px auto;/* 禁止选中 */user-select: none;/* 应用过渡属性的属性名称 */transition-property: all;/* 过渡效果的速度曲线 */transition-timing-function: ease;/* 过渡动画所需的时间 */transition-duration: 0.3s;/* 过渡效果开始作用之前需要等待的时间 */transition-delay: 0.1s;}.myBackButtonStyle:hover {/* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */box-shadow: 2px -2px 5px 0px #0005;/* 平移 放大 */transform: translate(-1px, -1px) rotate(0.25turn);/* 过渡动画所需的时间 */transition-duration: 0.2s;/* 过渡效果开始作用之前需要等待的时间 */transition-delay: 0s;}.myBackButtonStyle:active {/* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */box-shadow: none;/* 过渡动画所需的时间 */transition-duration: 0.1s;/* 平移 */transform: rotate(0.25turn);/* 过渡效果开始作用之前需要等待的时间 */transition-delay: 0s;}"
			var myInputDivStyle = ".myInputDivStyle {/* 隐藏输入光标 */caret-color: #0000;/* 隐藏多余 */overflow: hidden;/* 宽度,高度 */width: 96%;height: 22px;/* 手型标准 */cursor: pointer;/* 轮廓线 */border: 0;/* 转为块元素 */display: block;/* 外边距 */margin: 5px auto;/* 背景颜色 */background: #FFF;/* 内边距上边 | 右边 | 下边 | 左边*/padding: 2px auto;/* 字号 */font-size: 14px;/* 圆角 */border-radius: 8px;/* 文字居中 */text-align: center;/* 禁止选中 */user-select: none;/* 应用过渡属性的属性名称 */transition-property: all;/* 过渡效果的速度曲线 */transition-timing-function: ease;/* 过渡动画所需的时间 */transition-duration: 0.3s;/* 过渡效果开始作用之前需要等待的时间 */transition-delay: 0.1s;}.myInputDivStyle:hover,.myInputDivStyle:focus {/* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */box-shadow: 2px 2px 5px 0px #0005;/* 平移 放大 */transform: translate(-1px, -1px);/* 过渡动画所需的时间 */transition-duration: 0.2s;/* 过渡效果开始作用之前需要等待的时间 */transition-delay: 0s;}.myInputDivStyle:active {/* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */box-shadow: none;/* 过渡动画所需的时间 */transition-duration: 0.1s;/* 平移 */transform: none;/* 过渡效果开始作用之前需要等待的时间 */transition-delay: 0s;}.myInputDivStyle:focus {/* 颜色 | 样式 | 宽度 */outline: rgb(88, 88, 88) solid 1px;}"
			var myInnerButtonStyle = ".myInnerButtonStyle {/* 浮动 */float: right;/* 宽度,高度 */width: 17px;height: 17px;/* 背景颜色 */background: #888;/* 文字居中 */text-align: center;/* 字符大小 */font-size: 12px;/* 行高 */line-height: 1.2;/* 字间距 */letter-spacing: 0.011em;/* 粗细 */font-weight: 400;/* 字体样式 */font-style: normal;/* 字体颜色 */color: #eee;/* 圆角 */border-radius: 100%;/* 外边距上边 | 右边 | 下边 | 左边 */margin: 2px 4px 2px auto;/* 过渡动画所需的时间 */transition-duration: 0.5s;}.myInnerButtonStyle:hover {/* 背景颜色 */background: #666;}"
		}
		//-----------------实例方法-----------------
		//打开菜单
		NewUi.prototype.open = function () {
			open(this.menu);
			this.refresh();
		}
		//刷新菜单
		NewUi.prototype.refresh = function () {
			this.cardList.forEach(card => {
				card.refresh();
			});
		}
		//切换显示状态,建议改为rotateDisplay
		NewUi.prototype.overturnPlay = function () {
			if (this.menu.style.display) {
				this.open();
			} else {
				close(this.menu);
			}
		}

		//-----------------私有方法--------------------
		//显示div
		function open(div) {
			// (function () {
			//	 this.style.setProperty("display", "", "");
			// }).call(div)
			div.style.setProperty("display", "", "");
		}
		//隐藏div
		function close(div) {
			// (function () {
			//	 this.style.setProperty("display", "none", "");
			// }).call(div)
			div.style.setProperty("display", "none", "");
		}
		return NewUi;
	})();

	/*------------------------程序体---------------------------- */
	console.log("临时倍速 开始运行");
	//用于传递事件的载体
	var eventLoop = {};
	//发送和接收事件的载体
	eventLoop.eventLoop = document.createElement("div");
	//发出一个自定义事件
	eventLoop.sendEvent = function () {
		var myEvent = new Event("dataChange");
		this.eventLoop.dispatchEvent(myEvent);
	}
	//绑定函数到自己的自定义事件
	eventLoop.addListener = function (fun) {
		this.eventLoop.addEventListener("dataChange", fun);
	}
	//版本号,用于设置迁移
	var version = 0;
	// 火狐浏览器超过4倍速会没有声音,我没办法处理
	var myData = new Data();
	var myController = new Controller(myData);
	var myMenu;


	// 生成tampermonkey菜单
	GM_registerMenuCommand("显示设置面板", openSetMenu, '');

	/*--------------------------函数---------------------------*/
	// 显示设置面板
	function openSetMenu() {
		if (!myMenu) {
			myMenu = new Ui(myData);
			myMenu.open();
		} else {
			myMenu.overturnPlay();
		}
	}
})();