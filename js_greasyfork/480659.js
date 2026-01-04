// ==UserScript==
// @name         Fill Request ID
// @namespace    https://ad.oceanengine.com/oceanus/
// @description  巨量引擎-资产-转化-事件管理-联调工具-小程序API回传-启动参数自动填充
// @author       aboveseal/carp
// @version      1.0.0
// @match        https://ad.oceanengine.com/oceanus/event_manager/own/mini-program/*/debugging-tool?aadvid=*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480659/Fill%20Request%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/480659/Fill%20Request%20ID.meta.js
// ==/UserScript==

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
// 显示控件原码
// jquery.showtips.js
(function(jQuery) {
	jQuery.fn.showTips = function(options,elem){
		var config = {
			skin: "trips",
			content: $(this).attr("tips")||"弹出类型的气泡提示！", //气泡提示内容里面可以是HTML，默认显示自定义的提示内容
			width: "auto", //默认为auto，可以写具体尺寸如：200
			alignTo: ["right","center"], //箭头方向
			color: ["rgb(247, 206, 57)","#FFFEF4"], //这里是提示层的风格，第一个参数为提示边框颜色，第二个参数为提示背景颜色
			type: "html", //显示内容类型
      opacity: 0,
			trigger: "click", //默认为点击显示，show为初始化就显示，hover为经过显示，focus焦点显示，mouse跟随鼠标显示隐藏
			spacing: 10, //默认为箭头距离对象的尺寸
			customid: "", //自定义ID
			isclose: false, //是否显示关闭按钮
			success: null //成功后的回调函数
		};
		var opts = jQuery.extend(config, options);
		return this.each(function(){
			var that = jQuery(this),tipBox,tipId,selfH,selfW,conId,docW, spa = opts.spacing, skin=opts.skin;
			var Mathrandom = Math.floor(Math.random() * 9999999);
            var pmr = (opts.customid=="") ? Mathrandom :opts.customid.replace(/[#.]/, "");
			var pointer=opts.alignTo.length===1 ? ''+opts.alignTo[0]+'' : ''+opts.alignTo[0]+'-'+opts.alignTo[1]+'';

			if(typeof elem == 'string') {
				if(elem =="show"){
					jQuery('#tip'+pmr).show();
          jQuery("#con"+pmr).html(opts.content);
					showPosition(pointer,jQuery('#tip'+pmr));
					};
				if(elem =="hide"){jQuery('#tip'+pmr).hide()};
			};
			if(typeof elem == '' || typeof elem == undefined){return true};
			if(jQuery('#tip'+pmr).length==1){return false;}
			tipBox=jQuery('<div class="'+skin+' '+skin+'-'+pointer+'" id="tip'+pmr+'"><i></i><em></em><div class="'+skin+'con" id="con'+pmr+'"></div></div>').appendTo(document.body);
			tipId = jQuery("#tip"+pmr);
			conId = jQuery("#con"+pmr);

			var edgecolor='border-'+opts.alignTo[0]+'-color', tfi=tipId.find("i"), tfem=tipId.find("em"), tfiem=tipId.find("i,em");
			tipId.css({'position':'absolute',border:'1px solid','border-color':opts.color[0],'background-color':opts.color[1]});
			if(opts.alignTo[1]=='center'){
        var offpos=50;
        var percen="%";
      }else{
        offpos=5;
        percen="px";
      };
			tfiem.css({width:0,height:0,content:'','position':'absolute'})
			tfi.css({border:'8px solid transparent','z-index':5});
			tfem.css({border:'7px solid transparent','z-index':10});
			switch (pointer) {
				case 'top-center':
				case 'bottom-center':
				case 'top-left':
				case 'bottom-left':
					var poi="left";
					if(pointer=='top-center' || pointer=='bottom-center'){
						tfi.css({"margin-left":"-8px"});
						tfem.css({"margin-left":"-7px"});
					}
				    break;
				case 'left-center':
				case 'right-center':
				case 'left-top':
				case 'right-top':
					poi="top";
					if(pointer=='left-center' || pointer=='right-center'){
						tfi.css({"margin-top":"-8px"});
						tfem.css({"margin-top":"-7px"});
					}
				    break;
				default:
					  poi="right";
				    break;
			};

			if(pointer=='follow'){
				tfi.css({'border-bottom-color':opts.color[0],left:''+offpos+percen+'',bottom:'100%'});
				tfem.css({'border-bottom-color':opts.color[1],left:''+(offpos+(opts.alignTo[1]=='center'?0:1))+percen+'',bottom:'100%'});
			}else{
				tfi.css(edgecolor,opts.color[0]).css(poi,''+offpos+percen+'');
				tfem.css(edgecolor,opts.color[1]).css(poi,''+(offpos+(opts.alignTo[1]=='center'?0:1))+percen+'');
				tfiem.css(opts.alignTo[0],'100%');
			};

			switch (opts.type) {
				case 'html':
          conId.html(opts.content); break;
				case 'id':
				  var tempid=jQuery(opts.content) ,wrap = document.createElement("div");
					if(tempid.css("display") == "none"){
            tempid.css({display:"block"});
          }
					conId.append(tempid);
				  break;
			};
			if(opts.isclose){
				jQuery('<span class="'+skin+'close" id="close'+pmr+'">&times;</span>').appendTo(tipId);
				tipId.find("#close"+pmr+"").on("click",function(){tipId.hide();});
			}

			if(typeof opts.width === 'string'){
				docW = parseInt(document.body.clientWidth*(opts.width.replace('%','')/100));
				(typeof opts.width == 'auto' || typeof opts.width == '') ? tipBox.css({width:'auto'}) : tipBox.css({width:docW});
				tipBox.height();
			}else{
				tipBox.width(opts.width).height();
			}
            function showPosition(pointer,cell){
				var selfH = that.outerHeight(true), selfW = that.outerWidth(true);
				var post=that.offset().top, posl=that.offset().left;
				var tipCell=(cell=="" || cell==undefined) ? tipId : cell;
			    var tipH=tipCell.outerHeight(true), tipW=tipCell.outerWidth(true);

				switch (pointer) {
					case 'top-left': tipCell.css({top:post-tipH-spa,left:posl}); break;
					case 'top-center': tipCell.css({top:post-tipH-spa,left:posl-(tipW/2)+(selfW/2)}); break;
					case 'top-right': tipCell.css({top:post-tipH-spa,left:posl-(tipW-selfW)}); break;
					case 'bottom-left': tipCell.css({top:post+selfH+spa,left:posl}); break;
					case 'bottom-center': tipCell.css({top:post+selfH+spa,left:posl-(tipW/2)+(selfW/2)}); break;
					case 'bottom-right': tipCell.css({top:post+selfH+spa,left:posl-(tipW-selfW)}); break;
					case 'left-top': tipCell.css({top:post,left:posl-tipW-spa}); break;
					case 'left-center': tipCell.css({top:post-(tipH/2)+(selfH/2),left:posl-tipW-spa}); break;
					case 'right-top': tipCell.css({top:post,left:posl+selfW+spa}); break;
					case 'right-center': tipCell.css({top:post-(tipH/2)+(selfH/2),left:posl+selfW+spa}); break;
					case 'follow': that.mousemove(function(e) { tipCell.css({top:e.pageY + 30,left:e.pageX - 6}); }); break;
				};
			}
			tipBox.hide();
			switch (opts.trigger){
				case 'show': showPosition(pointer);tipBox.show();break;
                case 'click':that.click(function(){showPosition(pointer);tipBox.show();});break;
				case 'hover': that.hover(
          function(){
            showPosition(pointer);tipBox.show(); tipBox.on("mouseover",
            function(){
              jQuery(this).show()}
            ).on("mouseout",
                 function(){
                   jQuery(this).hide()
            })
         },function(){tipBox.hide();});break;
				case 'focus': that.focus(function(){
          showPosition(pointer);tipBox.show();
        });
          that.blur(function(){tipBox.hide();});
          break;
				case 'mouse':that.hover(function(){
          showPosition(pointer);tipBox.show();
        },function(){tipBox.hide();});
          break;
			};
			setTimeout(function(){opts.success && opts.success();}, 1);
		});
	}
})(jQuery);
// 显示控件调用代码
function showTips() {
	var config = {
		content: "<div style=\"font-size: small;margin: 5px;\">由于巨量控件限制，此处必须：<strong>复制粘贴(选中后Ctrl-c/Ctrl-v)<br/><br/><a onclick=\"javascript: document.getElementsByClassName('trips')[0].remove();\" style=\"color: blue;cursor: pointer;\">OK</a></div>",
		type: "html",
		alignTo: ["bottom", "center"],
		trigger: "show",
		isclose: false,
		color: ["#B2E281", "#B2E281"]
	};
	$("#show-requestid-warn-tip").showTips(config);
}

// 加载时劫持与input相关的动作，不劫持输入框input会被系统脚本清空
var oldadd = EventTarget.prototype.addEventListener
EventTarget.prototype.addEventListener = function (...args){

  if(args.length !== 0 && ['mouseover', 'mousedown', 'mouseout', 'mouseup', 'mousemove', 'blur'].includes(args[0])){
    console.log('劫持' + args[0]);
    return;
  }
  return oldadd.call(this,...args);
}

function sleep(d){
  for(var t = Date.now();Date.now() - t <= d;);
}

function campaingTrack(){
    return new Promise((resolve, reject) => {
      // 打开一个tab
    // 获取浏览器地址
    var currentUrl = window.location.href;
    // 按问号拆分url
    var q_url = currentUrl.split("?")
    // 获取?aadvid=xxxxx
    var param = q_url.lastItem
    // 按"/"拆分
    var paths = q_url[0].split("/")
    // 获取倒数第二参数
    // e.g: https://ad.oceanengine.com/oceanus/event_manager/own/mini-program/xxxx/debugging-tool
    var assets_id = paths[paths.length -2]
    // 获取监测链接的接口
    var trackUrl = "https://ad.oceanengine.com/event_manager/v2/api/track/list?"+param;
    // 使用Ajax获取
    var xhr = new XMLHttpRequest();
    xhr.open('POST', trackUrl);
    // 设置Header——必须设置否则不能通过验证
    xhr.setRequestHeader('Content-Type','application/json;charset=utf-8');
    xhr.setRequestHeader('platform','ad');
    xhr.setRequestHeader('Access-Control-Allow-Origin','*');
    // 发生POST请求
    xhr.send(JSON.stringify({
        "assets_id": parseInt(assets_id),
        "group_name": '',
        "page":1, "size": 10
    }))
    // 获取返回值
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var result = JSON.parse(xhr.responseText);
        // 按?截取获取path
        var action_track_url = result["data"]["track_groups"][0]["action_track_url"].split("?")[0].split("/");
        // 获取与B系统关联的ID
        resolve(action_track_url[action_track_url.length - 1]);
    }
  }
 })
}
async function getCampaingTrack(){
  var campaign_track_url = await campaingTrack();
  return campaign_track_url;
}

async function typeUrl(){
    var campaign_track_url_id = await getCampaingTrack();
// 定义选择器，用于找到你想要的元素
       var keySelector = 'input[placeholder="如name=lilei&age=18，不要以?或&开头"]';

       // 定义回调函数，当匹配的元素出现时，这个函数将被执行
       var callback = function(keyElements) {
         // 生成 UUID
         // var request_id = guidShort();
         // 将 UUID 填充到输入框中
         keyElements[0].focus();
         if(keyElements[0].value == ""){
           keyElements[0].value = "requestid=__REQUESTID__&campaign_track_url_id=" + campaign_track_url_id;
           keyElements[0].id = "show-requestid-warn-tip";
           console.info(keyElements[0].id);
           showTips();
         }

       };
      // 使用 waitForKeyElements.js 来等待元素出现
      waitForKeyElements(keySelector, callback);
}
typeUrl();