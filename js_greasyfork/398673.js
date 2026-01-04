// ==UserScript==
// @name         115网盘显示文件SHA1
// @namespace    com.115wangpan.showsha1
// @version      0.8
// @description  显示网盘文件SHA1哈希值、批量复制文件SHA1值
// @author       YIU
// @icon         http://115.com/favicon.ico
// @match        http*://115.com/*ct=file*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/398673/115%E7%BD%91%E7%9B%98%E6%98%BE%E7%A4%BA%E6%96%87%E4%BB%B6SHA1.user.js
// @updateURL https://update.greasyfork.org/scripts/398673/115%E7%BD%91%E7%9B%98%E6%98%BE%E7%A4%BA%E6%96%87%E4%BB%B6SHA1.meta.js
// ==/UserScript==

let $ = unsafeWindow.$;

//* 显示SHA1(要显示的元素,列表类型[0列表型,1图标型])
function displaySha1(dom, listType){
	//由事件传入的dom元素可能是任何标签,只对含有sha1的文件元素显示sha1
	if(!dom.hasAttribute('sha1')){ return; }

	var sha1 = $(dom).attr('sha1');
	if(listType){
		//图标型、无法直接显示、只能在提示中显示
		if($(dom).find('em[gmflagsha1]').length > 0){
			$(dom).find('em[gmflagsha1]').remove();
			$(dom).find('em').css('padding-top','');
			$(dom).find('.file-name').css({'position':'', 'height':''});
		}
		if(dom.title.indexOf('\r')<1){
			var title = `\r\n${sha1}`;
			dom.title += title;
			$(dom).find('.file-name .name')[0].title += title;
		}
	}
	else if(listType < 1 && $(dom).find('em[gmflagsha1]').length < 1){
		//列表型
		$(dom).find('em').css('padding-top','6px');
		$(dom).find('.file-name').css({'position':'initial', 'height':'50px'});
		$(dom).find('.file-name').append(`<em gmflagsha1 style="position:absolute;padding-top:25px;color:#1a273466;font-size: x-small">${sha1}</em>`);
	}
}

//复制SHA1界面方法
let UI_CopySHA1 = {
	'ui': null,
	'hasBind': false,
	'createCopy': function(type){
		let content = '';
		let contentTitle = '';
		let checkedItems = $('#js_data_list input[checked="checked"]').parent();
		let checkedItemsLast = checkedItems.length - 1;
		checkedItems.each(function(i){
			if(!this.hasAttribute('sha1')){return;}
			contentTitle = $(this).parents('.list-thumb').length > 0 ? $(this).attr('title').split('\n')[0] : $(this).attr('title');
			switch(type){
				case 1:
					content += `${contentTitle}\n${$(this).attr('sha1')}${(i != checkedItemsLast ? '\n' : '')}`;break;
				case 2:
					content += `${$(this).attr('sha1')}#${contentTitle}`;break;
				default:
					content += `${$(this).attr('sha1')}`;
			}
			content += i < checkedItemsLast ? '\n' : '';
		});
		return content;
	},
	'copySHA1': function(e, type){
		unsafeWindow.oofUtil.plug.copy.initNewCopy({
			btn_parent: e,
			txt: function(){
				return UI_CopySHA1.createCopy(type);
			},
			suc: function(){
				return unsafeWindow.TOP.Core.MinMessage.Show({
					text: "复制成功",
					type: "suc",
					timeout: 2e3
				});
			}
		});
	},
	'show': function(show){
		if(!this.ui){ this.createUI(); }
		if(show){ this.ui.show(); }
		else{ this.ui.hide(); }
	},
	'createUI': function(){
		if($('.header-name [gmflagcopysha1ui]').length > 0){return;}

		let hookmenu = false;
		let addmenu = $(`<div class="context-menu" style="top:50px;z-index:9999999;display:none;margin-left:-13px">
<em class="arrow-position" style="left:18px;" rel="js_float_arrow"><i class="arrow"></i><s class="arrow"></s></em>
<div class="cell-icon"><ul></ul></div></div>`).hover(
			function(){ hookmenu = !0; },
			function(){
				hookmenu = !1;
				setTimeout(function(){
					if(!hookmenu){addmenu.css('display','none');}
				},200);
			});

		let addmenuitem = $(`<li menu="copy_sha1_filename_u" style="display:list-item"><a href="javascript:;" style="">
<i class="icon-operate ifo-copy"></i><span>文件名在上</span></a></li>`);
		this.copySHA1(addmenuitem, 1);
		addmenu.find('ul').append(addmenuitem);

		addmenuitem = $(`<li menu="copy_sha1_filename_r" style="display:list-item"><a href="javascript:;">
<i class="icon-operate ifo-copy"></i><span>文件名在右</span></a></li>`);
		this.copySHA1(addmenuitem, 2);
		addmenu.find('ul').append(addmenuitem);

		addmenuitem = $(`<li menu="copy_sha1_only" style="display:list-item"><a href="javascript:;">
<i class="icon-operate ifo-copy"></i><span>只有SHA1</span></a></li>`);
		this.copySHA1(addmenuitem);
		addmenu.find('ul').append(addmenuitem);

		//绑定所有菜单事件
		addmenu.find('ul li').click(function(){hookmenu=false; addmenu.css('display','none');});
		addmenu.find('a').hover(
			function(){$(this).css('color','#fff');},
			function(){$(this).css('color','');}
		);

		let addbtn = $(`<a href="javascript:;" class="button btn-stroke" style="padding:0 10px;color:#2777F8;top:-2px">
<i class="icon-operate ifo-copy" style="background-position-y:-40px;margin:0 -3px 0 -2px"></i>
<span>复制SHA1</span></a>`).hover(
			function(){addmenu.css('display','block');},
			function(){
				setTimeout(function(){
					if(!hookmenu){addmenu.css('display','none');}
				},200);
			});

		//组合UI
		let copyui = $('<div gmflagcopysha1ui></div>');
		copyui.append(addbtn, addmenu);
		$('.header-name').append(copyui);
		this.ui = copyui;
	}
};

//绑定的事件
let Events = {
	'listChange': function(){
		//-- 文件列表变化
		//先解除先前绑定
		this.listChangeOff();
		$('#js_data_list').on("DOMSubtreeModified",function(e){
			//防止修改元素造成死循环
			Events.listChangeOff();
			displaySha1(e.target, $('#js_data_list').find('.list-thumb').length);

			//有文件列表时绑定文件勾选事件
			if($('#js_data_list ul li').length > 0 && !UI_CopySHA1.hasBind){
				Events.fileChecked();
			}else if($('#js_data_list ul li').length < 1 && UI_CopySHA1.hasBind){
				UI_CopySHA1.show(!1);
				UI_CopySHA1.ui = null;
				UI_CopySHA1.hasBind = !1;
			}
			//重新绑定本事件
			Events.listChange();
		});
	},
	'listChangeOff': function(){
		//-- 解除文件列表变化绑定事件
		$('#js_data_list').off("DOMSubtreeModified");
	},
	'fileChecked': function(){
		//-- 文件列表勾选
		let bindlist = $('#js_data_list ul')[0];
		let config = { attributes: true, attributeFilter:['checked'], subtree: true };
		if(!bindlist){return;}

		new MutationObserver(function(mutations){
			let isChecked = false;
			let forCount = 0;
			for(let mutation of mutations){
				if(forCount > 1){ break; }
				if(mutation.type === 'attributes' && mutation.target.parentNode && mutation.target.parentNode.hasAttribute('sha1')){
					isChecked = isChecked || mutation.target.checked;
					forCount += isChecked ? 1 : 0;
				}
			}
			UI_CopySHA1.show(isChecked);
		}).observe(bindlist, config);
		UI_CopySHA1.hasBind = !0;
	}
};

//* 执行开始
(function(){
	//绑定事件
	Events.listChange();
})();