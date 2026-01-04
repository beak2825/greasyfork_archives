// ==UserScript==
// @name         OnePlusBBS QuickKey
// @description  一加社区快捷键
// @namespace    https://greasyfork.org/
// @author       choosezzz
// @version      3.3
// @match        https://www.oneplusbbs.com/forum*
// @match        https://www.oneplusbbs.com/thread*
// @match        https://www.oneplusbbs.com/home*
// @match        https://www.oneplusbbs.com/
// @icon         https://static.oneplus.cn/data/attachment/common/4c/common_121_icon.png
// @require      https://lib.baomitu.com/vue/2.6.14/vue.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/393351/OnePlusBBS%20QuickKey.user.js
// @updateURL https://update.greasyfork.org/scripts/393351/OnePlusBBS%20QuickKey.meta.js
// ==/UserScript==

function $id(doc_id) {
    return document.getElementById(doc_id);
}
function $class(class_name) {
	return document.getElementsByClassName(class_name);
}
var minAutoTime = 0.2;
var unitTime = 1540;
(function() {

    //发帖编辑框禁用脚本
    if (document.getElementById("editorbox") || document.getElementById("editorheader")) {
        return;
    }
    //settings
    appendSettingDiv();
    //css
    GM_addStyle("#setting_mount{font-size:15px;width:400px;z-index:999;background-color:white;position: fixed;top:35%;left:35%;border-radius:5px;box-shadow:3px 3px 10px red}");
    GM_addStyle("#setting_content{padding:2px;border-top:2px solid black;}");
    GM_addStyle(".setting_op{background:#34aff4;width:50px;padding:3px 20px;}.setting_op:hover{background:#EEDA0A;color:#ffffff;cursor:Pointer;}");
    GM_addStyle(".setting_menu{background:#3dfafe;width:50px;padding:2px 20px;}.setting_menu:hover{background:red;color:#ffffff;cursor:Pointer;}");
    GM_addStyle(".space_span{padding:3px 10px;}");
    GM_addStyle(".space_span_more{padding:3px 60px;}");
    GM_addStyle(".item_div{text-align:center;width:100%;margin:10px 0px}");
    //shadow div
    GM_addStyle("#shadow_div{z-index:9999;position: fixed;left:0;top:0;width:100%;height:100%;background:gray;opacity:0.5;}");
    //confirm div
    GM_addStyle("#confirm_div{font-size: 18px;position: fixed;background:#C4DDD9;z-index:10000;text-align:center;padding:20px 20px;top:35%;left:39%;border-radius:5px;box-shadow:3px 3px 5px red;}");
    GM_addStyle(".confirm_span{background:#2AA8;padding:3px 10px;border-radius:2px;margin:30px 30px;}");
    GM_addStyle(".confirm_span:hover{background:red;color:white;cursor:Pointer;}");
    //float menu div
    GM_addStyle("#float_menu{z-index:999;position: fixed;left:95%;top:55%;min-width:50px;}");
    GM_addStyle(".fast_menu{background:#FAD;text-align:center;padding:2px 5px;margin:1px 1px;border:1px solid red;border-radius:10px}");
    GM_addStyle(".fast_menu:hover{background:#DDD;color:blue;cursor:Pointer}");
    //自动刷新
    autoReflash();

    var href = window.location.href;
    //帖子页
    if (href.indexOf("thread-") != -1 || href.indexOf("viewthread") != -1) {
		var modMenu = $id("modmenu");
		if (!modMenu) {
			console.log("当前板块无权限");
			return;
		}
        autoScroll();
        appendConfirmDiv();
        appendFloatMenu();
    }
    document.onkeydown = function(event) {
        var href = window.location.href;
        var e = event || window.event;
        if (!e) {
            return;
        }
        if (e.ctrlKey && e.keyCode == 83) {
            stopDefault(e);
            settingApp.ctrlShow();
        }
        //个人主页
        if (href.search("homemod-space-uid*") != -1) {
            //Ctrl+Alt
            if (e.altKey && e.ctrlKey) {
                stopDefault(e);
                var uid = href.replace(/https:\/\/www.oneplusbbs.com\/homemod-space-uid-/g, "").replace(/.html/g, "");
                $id("a_sendpm_" + uid).click();
            }
        }

        //Ctrl+number
        if (((e.keyCode >= 49 && e.keyCode <= 57) || (e.keyCode >= 97 && e.keyCode <= 105)) && e.ctrlKey) {
            stopDefault(e);
            var msgId = e.keyCode - 96 < 0 ? e.keyCode - 48 : e.keyCode - 96;
            quickPaste(msgId);
        }

        //普通帖子页
        if (href.indexOf("thread-") != -1 || href.indexOf("viewthread") != -1) {
            handlePost(e);
        }

        //列表页
        if (href.indexOf("forum-") != -1 || href.indexOf("forumdisplay") != -1) {
            handleList(e);
        }

    }
})();

function appendSettingDiv() {
    var settingMount = document.createElement("div");
    settingMount.innerHTML = '<div id="setting_mount" v-show="isShow">' +
        //tips div
        '<div @mousedown="handleMove" @mouseover="handleOver" @mouseout="handleOut" style="padding: 3px;background: #aadcdf;text-align: center;">' +
        '<span>【使用 Ctrl+S 打开/关闭 设置选项】</span></div>' +
        '<div v-show="tips != null && tips.length!=0" style="border-top:2px solid black;text-align: center;background: red;font-size: 16px;color:yellow;">{{tips}}</div>' +
        //menu div
        '<div style="text-align: center;border-top: 2px solid black; padding: 2px 2px">' +
            '<span class="setting_menu" @click="quickKeySetting">快捷键设置</span><span class="space_span"></span>' +
            '<span class="setting_menu" @click="floatMenuSetting">悬浮菜单设置</span><span class="space_span"></span>' +
            '<span class="setting_menu" @click="otherSetting">其他设置</span>'+
        '</div>' +
        //main div start
        '<div id="setting_content" style="height: 250px">' +
            //quickKeySetting div
            '<div v-show="quickKeyShow" v-for="item of 9" :key="item" style="padding-left: 12px;padding-top: 2px;">' +
                '<span>Ctrl+{{item}}：</span>' +
                '<input type="text" style="width: 77%" v-model="quickMsg[item-1]"><span v-if="item==1" style="font-size:11px">✔</span>' +
            '</div>' +
            //floatMenuSetting div
            '<div v-show="floatMenuShow" style="padding: 19px 5px; text-align: left;">' +
            	'<div  v-for= "item of 5" >'+
          		'<div class="item_div" :key="item">'+
            	'#{{item}}: <input type="text" v-model="menuName[item-1]" style="width: 20%">'+
            	'操作原因 : <input type="text" v-model="menuReason[item-1]" style="width: 50%">'+
          		'</div></div>'+
        		'<span style="margin-left: 5px"></span>自动提交：<input type="checkbox" v-model="autoCommitDel" :checked="autoCommitDel" style="zoom:130%">'+
        		'<span v-show="autoCommitDel">提交延时：<input type="text" v-model="autoCommitDelTime" placeholder="秒" style="width: 25%"><sub style="color:red;">不能低于 ' + minAutoTime + ' s </sub></span>'+
            '</div>' +
            //otherSetting div
            '<div v-show="otherShow" style="padding-left: 12px;padding-top: 4px;">' +
                '定时刷新[秒]：<input type="number" v-model="reflashTime" style="width: 25%" min="300">' +
                '<input type="radio" name="reloadTarget" @click="currentPageReload" :checked="currentChecked"> 当前页面 ' +
                '<input type="radio" name="reloadTarget" @click="globalReload" :checked="globalChecked"> 全局' +
                '<br><hr>删除时自动勾选：<input type="checkbox" v-model="autoRecord" :checked="autoRecord" style="zoom:130%"> 违规登记 '+
                '<input type="checkbox" v-model="autoSend" :checked="autoSend" style="zoom:130%"> 通知作者' +
                '<br><hr>自动勾选延时：<input type="text" v-model="autoCheckTime" style="width: 25%"> 秒 <br><sub style="color:red;"> 不能低于 ' + minAutoTime + ' s , 功能异常时建议适当调整延时时间</sub>'+
                '<br><hr>自动定位到上一次操作位置：<input type="checkbox" v-model="autoScroll" :checked="autoScroll" style="zoom:130%">'+
            '</div>' +
        // main div end
        '</div>' +
        //save div
        '<div style="text-align: center;padding: 4px;border-top:2px solid black;">' +
            '<span class="setting_op" @click="ctrlShow">关闭</span>' +
            '<span class="space_span_more"> | </span>' +
            '<span class="setting_op" @click="saveSettings">{{saveTips}}</span>' +
        '</div>' +
        // all end
        '</div>';
    document.body.appendChild(settingMount);
}
var settingApp = new Vue({
    el: "#setting_mount",
    data: {
        isShow: false,
        tips: "",
        saveTips: "保存",
        quickMsg: ["请勿灌水或回复与帖子无关的内容", "请勿发布纯标题无内容贴"],
        reflashTime: 0,
        autoRecord: parseBoolean(localStorage.autoRecord),
        autoSend: parseBoolean(localStorage.autoSend),
        timeOut: 500,
        currentChecked: false,
        globalChecked: false,
        reloadTarget: window.location.href,
        quickKeyShow: true,
        floatMenuShow: false,
        otherShow: false,
        autoScroll: parseBoolean(localStorage.autoScroll),
        menuName:["灌水删除"],
        menuReason:["请勿灌水回帖"],
        autoCommitDel: parseBoolean(localStorage.autoCommitDel),
        autoCommitDelTime: minAutoTime,
        autoCheckTime: minAutoTime
    },
    methods: {
        ctrlShow: function() {
            this.isShow = !this.isShow;
            if (this.isShow) {
                let msg = getQuickMsg();
                if (null != msg) {
                    this.quickMsg = msg;
                }

                let currentReloadTime = localStorage.getItem(this.getUrlId());
                if (currentReloadTime) {
                    this.currentChecked = true;
                    this.reflashTime = currentReloadTime;
                } else {
                    this.globalChecked = true;
                    this.reflashTime = localStorage.reflashTime;
                }
                let menuNameArr = getArrFromStorage("menuName", "$");
                if (menuNameArr != null) {
                	this.menuName = menuNameArr;
                }
                let menuReasonArr = getArrFromStorage("menuReason", "$");
                if (menuReasonArr != null) {
                	this.menuReason = menuReasonArr;
                }
                if (localStorage.autoCommitDelTime) {
					this.autoCommitDelTime = localStorage.autoCommitDelTime;
                }
				if (localStorage.autoCheckTime) {
					this.autoCheckTime = localStorage.autoCheckTime;
				}
			}
        },
        handleOver: function(event) {
            let ev = event || window.event;
            let moveBar = event.target;
            moveBar.style.cursor = "move";
        },
        handleOut: function(event){
            let ev = event || window.event;
            let moveBar = event.target;
            moveBar.style.cursor = "default";
        },
        handleMove: function(event) {
            let ev = event || window.event;
            let moveBar = event.target;
            let Drag = moveBar.parentNode;
            let disX = ev.clientX - Drag.offsetLeft;
            let disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = (event) => {
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                let ev = event || window.event;
                Drag.style.left = ev.clientX - disX + "px";
                Drag.style.top = ev.clientY - disY + "px";
                moveBar.style.cursor = "move";
            };
            document.onmouseup = (event) => {
                document.onmousemove = null;
                document.onmouseup = null;
                moveBar.style.cursor = "default";
            };
        },
        quickKeySetting: function() {
            this.quickKeyShow = true;
            this.floatMenuShow = false;
            this.otherShow = false;
        },
        floatMenuSetting: function() {
            this.quickKeyShow = false;
            this.floatMenuShow = true;
            this.otherShow = false;
        },
        otherSetting: function() {
            this.quickKeyShow = false;
            this.floatMenuShow = false;
            this.otherShow = true;
        },
        saveSettings: function() {
            var result = this.quickMsg.join("$");
            localStorage.quickMsg = result;
            for(let i=0;i<this.menuName.length;i++){
            	if (this.menuName[i] == "") {
            		this.menuName.splice(i, 1);
            		this.menuName.splice(i, 1);
            	}
            }
            var menuName = this.menuName.join("$");
            localStorage.menuName = menuName;
            var menuReason = this.menuReason.join("$");
            localStorage.menuReason = menuReason;
            if (this.reflashTime <= 0) {
                this.reflashTime = 0;
                this.tips = "定时刷新时间配置无效，将不会启用自动刷新功能。";
                this.timeOut = 3000;
            }
            if (this.reflashTime > 0 && this.reflashTime < 60) {
                this.reflashTime = 60;
                this.tips = "为了更好的操作体验，自动刷新时间不能低于60s！！！";
                this.timeOut = 3000;
            }
            if (this.globalChecked) {
                localStorage.removeItem(this.getUrlId());
                localStorage.reflashTime = this.reflashTime;
            } else {
                localStorage.setItem(this.getUrlId(), this.reflashTime);
            }
            localStorage.autoSend = this.autoSend;
            localStorage.autoRecord = this.autoRecord;
            localStorage.autoScroll = this.autoScroll;
            localStorage.autoCommitDel = this.autoCommitDel;
            localStorage.autoCommitDelTime = this.autoCommitDelTime >= minAutoTime ? this.autoCommitDelTime : minAutoTime;
            localStorage.autoCheckTime = this.autoCheckTime >= minAutoTime ? this.autoCheckTime : minAutoTime;

            this.saveTips = "保存成功";
            setTimeout(() => {
                this.isShow = false;
                this.tips = "";
                this.saveTips = "保存";
            }, this.timeOut);
        },
        globalReload: function() {
            var reflashTime = localStorage.reflashTime;
            if (!reflashTime || isNaN(reflashTime) || reflashTime < 0) {
                reflashTime = 0;
            }
            this.globalChecked = true;
            this.currentChecked = false;
            this.reflashTime = reflashTime;
        },
        currentPageReload: function() {
            var currentReflashTime = localStorage.getItem(this.getUrlId());
            if (!currentReflashTime || isNaN(currentReflashTime) || currentReflashTime < 0) {
                currentReflashTime = 0;
            }
            this.globalChecked = false;
            this.currentChecked = true;
            this.reflashTime = currentReflashTime;
        },
        getUrlId: function() {
            var url = this.reloadTarget;
            if (!url || url.length <= 0) {
                return 0;
            }
            url = url.toLowerCase().replace("https://www.oneplusbbs.com/", "reload#");
            url = url.replace(".html", "#");
            return url;
        }
    }
});

function appendConfirmDiv(){
	var confirmDiv = document.createElement("div");
	confirmDiv.innerHTML = '<div id="vue_confirm_div">'+
    '<div id="shadow_div" v-show="showConfirmDiv"></div>'+
    '<div id="confirm_div" v-show="showConfirmDiv">'+
      '<div>'+
        '<h2>是否执行删帖操作</h2>'+
        '<br><span class="confirm_span" @click="doDel">确认</span>'+
        '<span class="confirm_span" @click="cancelDel">取消</span>'+
        '<br><br><span class="confirm_span" @click="doDelAndOpen">确认&打开管理页面</span>'+
      '</div>'+
    '</div>'+
  '</div>';
  document.body.appendChild(confirmDiv);
}

var confirmApp = new Vue({
	el: "#vue_confirm_div",
	data: {
		showConfirmDiv: false,
		doDelTag: 0,
		clickEle: null,
		targetHref: null
	},
	methods: {
		doDel: function() {
			this.showConfirmDiv = false;
			this.doDelTag = 1;
			this.handelDel();
		},
		cancelDel: function() {
			this.showConfirmDiv = false;
			this.doDelTag = 2;
		},
		doDelAndOpen: function() {
			this.showConfirmDiv = false;
			this.doDelTag = 3;
			this.handelDel();
		},
		handelDel: function() {
			if (this.doDelTag == 1 && this.clickEle != null) {
				this.clickEle.click();
			}else if (this.doDelTag == 3 && this.clickEle != null && this.targetHref != null) {
				this.clickEle.click();
				var open = document.createElement("a");
				open.href=this.targetHref;
				open.target="_blank";
				open.click();
			}
			defaultQuickPaste();
        	return;
		}
	}
});
//悬浮菜单
function appendFloatMenu(){
	var floatMenuDiv = document.createElement("div");
	floatMenuDiv.innerHTML = '<div id="float_menu">'+
	'<div class="fast_menu" @click="opFastMenu" style="background:#FFF;border-radius:3px;border:1px solid black;">{{opTip}}</div>'+
    '<div class="fast_menu" v-for = "item of (menuName == null ? 0 : menuName.length)" @click="handleFastMenu(item)">'+
      '{{menuName[item-1]}}</div>'+
    '</div>';
    document.body.appendChild(floatMenuDiv);
    var checkInterval = setInterval(function(){
    	var check = document.querySelector("input[class='pc']:checked");
    	if (check) {
    		clearInterval(checkInterval);
    		let mdly = $id("mdly");
    		let left = mdly.getBoundingClientRect().left + 155;
    		let top = mdly.getBoundingClientRect().top -3;
    		$id("float_menu").style.left = left + "px";
    		$id("float_menu").style.top = top + "px";
    	}
    }, 350);
}

var floatMenuApp = new Vue({
	el: "#float_menu",
	data: {
		menuName: getArrFromStorage("menuName", "$"),
		menuReason: getArrFromStorage("menuReason", "$"),
		autoCommitDel: parseBoolean(localStorage.autoCommitDel),
		autoCommitDelTime: localStorage.autoCommitDelTime,
		opOpen: true,
		opTip: "收起浮窗"
	},
	methods: {
		handleFastMenu: function(index) {
			var mdly = document.getElementById("mdly");
			if (mdly && mdly.style.display != "none") {
				recordScrollId();
				recordCount();
				var aList = mdly.getElementsByClassName("c")[0].getElementsByTagName("a");
				if (aList.length >= 3) {
					if (aList[2].innerHTML == "删除") {
						aList[2].click();
						let autoCheckTime = localStorage.autoCheckTime;
						if (!autoCheckTime && autoCheckTime < minAutoTime) {
							autoCheckTime = minAutoTime;
						}
						setTimeout(() => {
							var doc = quickPaste(0);
							if (doc) {
								autoChecked();
								doc.value = this.menuReason[index - 1];
								if (this.autoCommitDel) {
									this.autoCommitDelTime = this.autoCommitDelTime > minAutoTime ? this.autoCommitDelTime:minAutoTime;
									$id("modsubmit").innerHTML = this.autoCommitDelTime + "s自动提交";
									setTimeout(() => {
										$id("modsubmit").click();
									},this.autoCommitDelTime * unitTime);
								}
							};
						}, autoCheckTime * unitTime);
					}
				}
			} else {
				this.opTip = "请先勾选管理选项";
				setTimeout(() => {
					this.opTip = "收起浮窗";
				}, unitTime);
			}
		},
		opFastMenu: function() {
			if (this.opOpen) {
				this.opTip = "展开浮窗";
				this.menuName = [];
			} else {
				this.opTip = "收起浮窗";
				this.menuName = getArrFromStorage("menuName", "$");
			}
			this.opOpen = !this.opOpen;
		}
	}
});
function getQuickMsg() {

    var msg = localStorage.quickMsg;
    if (!msg || null == msg || msg.split("$id").length == 0) {
        settingApp.isShow = true;
        settingApp.tips = "请先设置快捷键对应的内容";
        setTimeout(function() {
            settingApp.tips = "";
        }, 2000);
        return null;
    } else {
        return msg.split("$");
    }
}

function getArrFromStorage(name,split){
	var storage = localStorage.getItem(name);
	if (!storage) {
		return null;
	}
	return storage.split(split);
}

function pasteMsg(element, msgArr, id) {
    if (msgArr == null || msgArr.length < id) {
        settingApp.isShow = true;
        settingApp.tips = "当前快捷键暂未定义任何内容，请自定义后使用";
        settingApp.quickMsg = msgArr;
        setTimeout(function() {
            settingApp.tips = "";
        }, 2000);
        return;
    }
    if (element && msgArr.length >= id) {
        if (msgArr[id - 1] == "") {
            settingApp.isShow = true;
            settingApp.quickMsg = msgArr;
            settingApp.tips = "当前快捷键暂未定义任何内容，请自定义后使用";
            setTimeout(function() {
                settingApp.tips = "";
            }, 2000);
            return;
        }
        element.value = msgArr[id - 1];
        return;
    }

}
//屏蔽默认快捷键
function stopDefault(e) {

    // W3C标准
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        //IE
        window.event.returnValue = false;
    }
    return false;
}

function defaultQuickPaste() {
	let autoCheckTime = localStorage.autoCheckTime;
	if (!autoCheckTime && autoCheckTime < minAutoTime) {
		autoCheckTime = minAutoTime;
	}
    setTimeout(function() {
        var doc = quickPaste(1);
        if (doc) {
            autoChecked();
        }
    }, autoCheckTime * unitTime);
}

function quickPaste(id) {

    var href = window.location.href;
    var quickMsg = getQuickMsg();
    //操作说明输入
    var mods = $id("fwin_mods");
    if (mods && mods.style.display != "none") {
        pasteMsg($id("reason"), quickMsg, id);
        return $id("reason");
    }
    //列表页
    var ftadmin = $id("floatlayout_topicadmin");
    if (ftadmin && ftadmin.style.display != "none") {
        pasteMsg($id("reason"), quickMsg, id);
        return $id("reason");
    }
    //回帖输入
    var reply = $id("fwin_reply");
    if (reply && reply.style.display != "none") {
        pasteMsg($id("postmessage"), quickMsg, id);
        return $id("postmessage");
    }
    //消息
    var showMsgBox = $id("fwin_showMsgBox");
    if (showMsgBox && showMsgBox.style.display != "none") {
        pasteMsg($id("pmmessage"), quickMsg, id);
        return $id("pmmessage");
    }
    //管理页面
    if (href.search("op=ban&uid=") != -1) {
        pasteMsg($id("ct").getElementsByClassName("pt")[0], quickMsg, id);
    }
}

//判断是否已显示操作选项
var cateShow = false;
//分类选项索引
var cateIndex = 0;

//移动操作
var moveShow = false;
//游乐园
var moveIndex = 21;

function handlePost(e) {

    // Ctrl + z 快速回复
    if (e.keyCode == 90 && e.ctrlKey) {
        stopDefault(e);
        $id("post_reply").click();
        defaultQuickPaste();
        return;
    }

    //获取操作列表
    var modMenu = $id("modmenu");
    if (!modMenu) {
        console.log("当前板块无权限");
        return;
    }
    var links = modMenu.getElementsByTagName("a");
    //Ctrl+D 快速删除
	if (e.keyCode == 68 && e.ctrlKey) {
		stopDefault(e);
		var mdly = $id("mdly");
		if (mdly && mdly.style.display != "none") {
			recordScrollId();
			var aList = mdly.getElementsByClassName("c")[0].getElementsByTagName("a");
			if (aList.length >= 3) {
				if (aList[2].innerHTML == "删除") {
					aList[2].click();
				}
			}
			defaultQuickPaste();
			return;
		} else {
			//增加二次确认
			confirmApp.showConfirmDiv = true;
			confirmApp.clickEle = links[0];
			let user_url = $class("authi xg1 xs2")[0].getElementsByTagName("a")[0].href;
			let uid = user_url.replace(/https:\/\/www.oneplusbbs.com\/homemod-space-uid-/g, "").replace(/.html/g, "");
			confirmApp.targetHref = "https://www.oneplusbbs.com/forum.php?mod=modcp&action=member&op=ban&uid=" + uid;
		}
	}
    //Ctrl+Alt 快速分类功能
    if (e.altKey && e.ctrlKey) {
        stopDefault(e);
        quickCate(links[10]);
        return;
    }
    //Ctrl+X 快速移动功能
    if (e.ctrlKey && e.keyCode == 88) {
        stopDefault(e);
        quickMove(links[9]);
        return;
    }
    resetCateAndMove();
}

function handleList(e) {
    var checkBoxs = document.getElementsByClassName("o");
    if (!checkBoxs || checkBoxs.length < 5) {
        console.log("此版块无权限");
    }
    var mdly = $id("mdly");
    if (mdly) {
        var ops = mdly.getElementsByTagName("p")[0].getElementsByTagName("a");
        if (!ops || ops.length < 3) {
            return;
        }
        // ctrl + alt
        if (e.altKey && e.ctrlKey) {
            stopDefault(e);
            quickCate(ops[2]);
            return;
        }
        // ctrl + x
        if (e.ctrlKey && e.keyCode == 88) {
            stopDefault(e);
            quickMove(ops[1]);
            return;
        }
        // ctrl + d
        if (e.keyCode == 68 && e.ctrlKey) {
            stopDefault(e);
            ops[0].click();
            defaultQuickPaste();
            return;
        }
        resetCateAndMove();
    }
}

//自动刷新
function autoReflash() {
    var reflashTime = 0;
    var url = window.location.href;
    if (!url || url.length <= 0) {
        return 0;
    }
    url = url.toLowerCase().replace("https://www.oneplusbbs.com/", "reload#");
    url = url.replace(".html", "#");
    var currentReflashTime = parseInt(localStorage.getItem(url));
    if (!isNaN(currentReflashTime)) {
        reflashTime = currentReflashTime;
    } else {
        if (!localStorage.reflashTime) {
            reflashTime = 0;
        } else {
            reflashTime = parseInt(localStorage.getItem("reflashTime"));
        }
    }

    if (isNaN(reflashTime) || reflashTime <= 0) {
        return;
    }
    var title = document.title;
    var loopInterval = setInterval(function() {
        document.title = "【" + formatTime(reflashTime) + "】" + title;
        if (reflashTime === 0) {
            clearInterval(loopInterval);
            location.reload();
            return;
        }
        reflashTime--;
    }, 1000);
}

function formatTime(t) {
    if (isNaN(t)) return "";
    var s = "";
    var h = parseInt(t / 3600);
    s += (pad(h) + ":");
    t -= (3600 * h);
    var m = parseInt(t / 60);
    s += (pad(m) + ":");
    t -= (60 * m);
    s += pad(t);
    return s;
}

function pad(n) {
    return ("00" + n).slice(-2);
}

function autoChecked() {
    document.getElementById("crimerecord").checked = parseBoolean(localStorage.autoRecord);
    document.getElementById("sendreasonpm").checked = parseBoolean(localStorage.autoSend);
}
//快捷点击分类链接
function quickCate(ele) {
    if (!cateShow) {
        if (ele) {
            ele.click();
            cateShow = true;
        }
    } else {
        let types = $id("typeid");
        if (types && types.options.length > 0) {
            types.size = 9;
            types.onclick = function() {
                types.size = 1;
            };
            types.options[cateIndex].selected = "true";
            cateIndex++;
        }
        if (cateIndex == types.options.length) {
            cateIndex = 0;
        }
    }
}
//快捷点击移动链接
function quickMove(ele) {
    if (!moveShow) {
        if (ele) {
            ele.click();
            moveShow = true;
        }
    } else {
        var moveTo = $id("moveto");
        if (moveTo && moveTo.options.length > 0) {
            moveTo.size = 9;
            moveTo.onclick = function() {
                moveTo.size = 1;
            }
            moveTo.options[moveIndex].selected = "true";
            moveTo.onchange();
            //游乐园 <--> 轻摄影
            moveIndex = moveIndex == 21 ? 13 : 21;
        }

    }
}
//重置
function resetCateAndMove() {
    moveIndex = 21;
    cateIndex = 0;
    moveShow = false;
    cateShow = false;
}
function recordScrollId(){
    var threadId = getThreadId();
    if (threadId == null) {
        alert("处理自动定位失败，请记录当前连接，联系作者反馈");
        return;
    }
    var checkId = document.querySelector("input[class='pc']:checked").value;
    var nextCheckId = $id("post_" + checkId).previousSibling.id;
    sessionStorage.setItem(threadId, nextCheckId);
}

function recordCount(){
	var count = sessionStorage.count;
	if (!count) {
		count = 0;
	}
	count = (++count) % 100;
	unitTime = unitTime + count * 5;
	sessionStorage.count = count;
}
//自动定位到上次操作位置
function autoScroll(){
    if (parseBoolean(localStorage.autoScroll)) {
        var threadId = getThreadId();
        if (threadId != null) {
            var doc_id = sessionStorage.getItem(threadId);
            if (doc_id) {
                if (!$id(doc_id)) {
                    sessionStorage.removeItem(threadId);
                    return;
                }
                $id(doc_id).nextSibling.scrollIntoView({
                    behavior: "smooth",block: "center"
                });
            }
        }
    }
}
//获取帖子id
function getThreadId(){
    var url = window.location.href;
    var index = url.indexOf("thread-");
    if (index>=0) {
        index += 7;
    }else {
        index = url.indexOf("tid=");
        if (index >= 0) {
            index += 4;
        }
    }
    if (index >= 0) {
        return url.substring(index, index + 7);
    }
    return null;
}

function parseBoolean(item){
	if (!item) {
		return false;
	}
	var result = false;
	try {
		result = JSON.parse(item);
	} catch(e) {
		console.log("配置转换失败");
	}
	return result;
}