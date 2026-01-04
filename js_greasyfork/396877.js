// ==UserScript==
// @name         MCBBS Emoticon Add
// @namespace    http://fang.blog.miri.site
// @version      Gamma 4.1.2
// @description  愉快的和朋友在论坛斗图吧！
// @author       Mr_Fang
// @match        https://*.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396877/MCBBS%20Emoticon%20Add.user.js
// @updateURL https://update.greasyfork.org/scripts/396877/MCBBS%20Emoticon%20Add.meta.js
// ==/UserScript==

(function() {
    var storage = window.localStorage;

    if(jq('.user_info_menu_btn').length>0) {
        jq('.user_info_menu_btn').append('<li><a id="mbea_setting">Emoticon Add 设置</a></li>');

        document.getElementById('mbea_setting').addEventListener('click',function(){
            showDialog('<style>.alert_right {background-image: none;padding-right: 0px;padding-left: 0px;}</style><div class=""><p><b>默认窗口位置</b> - 请输入1或0 <span style="color: gray; margin-left: 5px;" title="1 - 打开页面窗口默认最大化\n0 - 打开页面窗口默认最小化\n输入其它值则默认为0">[?]</span></p><input id="input_windowmode"  style="width: 340px;" value="' + storage.getItem('mbea_windowmode') + '"><br><br><p><b>按规定格式添加即可</b> - 点击确定保存 <span style="color: gray; margin-left: 5px;" title="语法与Markdown相同：\n![描述](图片URL)">[?]</span> <span id="mbea_BatchImport" style="color: gray; margin-left: 5px;" title="点击进入批量导入GUI">[+]</span></p><textarea id="input_setting" style="width: 340px;" rows="20">' + storage.getItem('mbea_setting') + '</textarea>保存后刷新即可生效</div>',
                       'right',
                       '<div style="line-height:30px;"><img src="https://s2.ax1x.com/2020/02/25/3twNzq.png" width="20px"> 设置 - MCBBS Emoticon Add</div>',
                       function() {
                storage["mbea_setting"] = document.getElementById("input_setting").value;
                storage["mbea_windowmode"] = document.getElementById("input_windowmode").value;
            }
                      );

            document.getElementById('mbea_BatchImport').addEventListener('click',function(){
                showDialog('<style>.alert_right {background-image: none;padding-right: 0px;padding-left: 0px;}</style><div class=""><p><b>EShare链接</b> - 请输入URL <span style="color: gray; margin-left: 5px;" title="请输入在Emall或EATool处获取的EShare链接">[?]</span></p><input id="mbea_piurl"  style="width: 340px;" value=""></div>',
                           'right',
                           '<div style="line-height:30px;"><img src="https://s2.ax1x.com/2020/02/25/3twNzq.png" width="20px"> 批量导入表情 - MCBBS Emoticon Add</div>',
                           function() {
                    console.log("批量导入:" + document.getElementById("mbea_piurl").value);
                    if(document.getElementById("mbea_piurl").value == ""){
                        console.log("piurl是空值！");
                        return false;
                    }
                    jq.ajax({
                        type:'get',
                        url:document.getElementById("mbea_piurl").value,
                        success:function(body,heads,status){
                            var piJSON = body;
                            var piStr = JSON.parse(piJSON);
                            piStr = Object.values(piStr);

                            console.log("成功导入JSON：\n包名：" + piStr[0]["PackName"] + "（"+ piStr[0]["Version"] +"）\n作者：" + piStr[0]["Author"]);
                            for(var i=0;i<piStr[1].length;i++){
                                storage["mbea_setting"] = storage["mbea_setting"] + "\n" + piStr[1][i];
                            }
                        }
                    });
                }
                          );
            })
        })
    }


    var list = "";
    var setting = "";

    setting = "[" + storage.getItem('mbea_setting') + "]";


    //阿方很菜的，不会批量替换，预计下个版本直接批量替换
    //console.log(setting);
    console.log(setting.split('\n').length);
    for(var l=0;l<setting.split('\n').length;l++){
        setting = setting.replace('![',"['");
        setting = setting.replace('](',"','");
        setting = setting.replace(')\n',"'],\n");
        //console.log(setting);
    }
    setting = setting.replace(')',"']");

    var arrayList = eval("(" + setting + ")");
    console.log(arrayList);

    for(var i=0;i<arrayList.length;i++){
        //list = list + '<div class="mbea_img"><img onclick="setCopy(\'[img]' + arrayList[i][1] + '[/img]\');" src="' + arrayList[i][1] + '" width="100%" title="' + arrayList[i][0] + '" ></div>';
        list = list + '<div onclick="setCopy(\'[img]' + arrayList[i][1] + '[/img]\', \'成功复制BBCode\');" class="mbea_img" style="background: url(\'' + arrayList[i][1] + '\') no-repeat center; background-size: cover;"><div class="hide">' + arrayList[i][0] + '</div></div>';
    };


    var display = false;
    var mbea_window_top = "95%";
    var window_mode = storage.getItem('mbea_windowmode');
    if(window_mode == "1"){
        display = true;
        mbea_window_top = "100px";
    }else{
        display = false;
        mbea_window_top = "95%";
    }

    jq("head").append(`
<style type="text/css">
	.mbea_img {
		height: 100px;
		width: 100px;
		background-color: aqua;
	}

	.mbea_img div.hide {
		display: none;
		position: none;
	}

	.mbea_img:hover div.hide {
		display: initial;
		z-index: 900;
		position: absolute;
		background: rgba(0, 0, 0, 0.6);
		padding: 2px;
	}

	.dialog {
		width: 250px;
		height: 250px;
		background-color: rgba(0, 0, 0, 0.3);
		-webkit-box-shadow: 1px 1px 3px #292929;
		-moz-box-shadow: 1px 1px 3px #292929;
		box-shadow: 1px 1px 3px #292929;
		margin: 10px;
		z-index: 899;
		position: fixed;
		left: 100px;
		top: ` + mbea_window_top + `;
		overflow: auto;
	}

	.dialog::-webkit-scrollbar {
		width: 4px;
		width: 4px;
	}

	.dialog::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.5);
	}

	.dialog-title {
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 12pt;
		font-weight: bold;
		padding: 4px 6px;
		cursor: move;
	}

	.dialog-content {
		padding: 4px;
		color: #fff;
	}

	div.mbea_img {
		width: 35px;
		height: 35px;
		display: inline-block;
		margin: 5px;
	}
</style>
<script type="text/javascript">
	var Dragging = function(validateHandler) { //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
		var draggingObj = null; //dragging Dialog
		var diffX = 0;
		var diffY = 0;

		function mouseHandler(e) {
			switch (e.type) {
				case 'mousedown':
					draggingObj = validateHandler(e); //验证是否为可点击移动区域
					if (draggingObj != null) {
						diffX = e.clientX - draggingObj.offsetLeft;
						diffY = e.clientY - draggingObj.offsetTop;
					}
					break;

				case 'mousemove':
					if (draggingObj) {
						draggingObj.style.left = (e.clientX - diffX) + 'px';
						draggingObj.style.top = (e.clientY - diffY) + 'px';
					}
					break;

				case 'mouseup':
					draggingObj = null;
					diffX = 0;
					diffY = 0;
					break;
			}
		};

		return {
			enable: function() {
				document.addEventListener('mousedown', mouseHandler);
				document.addEventListener('mousemove', mouseHandler);
				document.addEventListener('mouseup', mouseHandler);
			},
			disable: function() {
				document.removeEventListener('mousedown', mouseHandler);
				document.removeEventListener('mousemove', mouseHandler);
				document.removeEventListener('mouseup', mouseHandler);
			}
		}
	}

	function getDraggingDialog(e) {
		var target = e.target;
		while (target && target.className.indexOf('dialog-title') == -1) {
			target = target.offsetParent;
		}
		if (target != null) {
			return target.offsetParent;
		} else {
			return null;
		}
	}

	Dragging(getDraggingDialog).enable();
</script>
`);
    jq("body").prepend(`
<div id="dlgTest" class="dialog">
	<div class="dialog-title">自定义表情<span style="float: right;cursor: pointer;" onclick="jq('div.dialog').css('top','100px');"
		 title="最大化">[↑]</span><span style="float: right;cursor: pointer;" onclick="jq('div.dialog').css('top','95%');" title="最小化">[↓]</span></div>
	<div class="dialog-content">
		` + list + `
	</div>
</div>
`);

    document.onkeydown = function(e) {
        var keyCode = e.keyCode;
        var shiftKey = e.shiftKey;
        var ctrlKey = e.ctrlKey;
        if(ctrlKey && shiftKey && keyCode == 69) {
            if(display == true){
                jq('div.dialog').css('top','95%')
                display = false;
            }else{
                jq('div.dialog').css('top','100px')
                display = true;
            }
        }
    };
})();