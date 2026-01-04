// ==UserScript==
// @name        Bangumi-Index-Batch-Edit
// @namespace    https://github.com/bangumi/scripts/liaune
// @author       binota，Liaune
// @license      MIT
// @description  批量添加目录条目，直接修改条目排序和评论，批量保存已修改的条目，可选择按当前列表顺序保存
// @include     /^https?:\/\/((bgm|bangumi)\.tv|chii\.in)\/index\/\d+/
// @version     1.1.1
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34284/Bangumi-Index-Batch-Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/34284/Bangumi-Index-Batch-Edit.meta.js
// ==/UserScript==

function postData(url, data) {
	return new Promise((resolve, reject) => {
		$.post(url,data,()=>{resolve()});
	});
}

function closeDialog() {
	$('#TB_overlay').remove();
	$('#TB_window').remove();
}

async function saveRelateItems(items) {
	for(let i = 0;i < items.length; i++) {
		let data = {
			content: items[i].content.trim(),
			formhash: formhash,
			order: items[i].order,
			submit: '提交'
		};
		await postData('/index/related/' + items[i].item_id + '/modify', data).then(()=> {
			console.log(i);
			$('#savenowOrder').html('保存中... (' + (i+1) + '/' + items.length +')');
			if(i == items.length-1){
				$('#savenowOrder').html('保存完毕...！');
				setTimeout(()=>{location.reload()}, 500);
			}
		});
	}
};

async function addRelateBatch(url, items){
	for(let i = 0;i < items.length; i++) {
		await postData(url, {add_related: items[i], formhash: formhash, submit: '添加新关联'}).then(()=> {
			console.log(i);
			$('#submit_list').val('添加中... (' + (i+1) + '/' + items.length +')');
			if(i == items.length-1){
				$('.bibeBox input[name="submit"]').val('添加完毕...！');
				setTimeout(()=>{location.reload()}, 500);
			}
		});
	}
}
//Check the owner of index, then insert the button for modify orders
if($('.idBadgerNeue a.avatar').attr('href').search($('.grp_box a.avatar').attr('href')) >= 0) {
    $('.grp_box .tip_j').append(` / <a id="modifyOrder" class="chiiBtn" href="javascript:;">批量编辑</a>`);
    $('#indexCatBox ul').append(`<li class="add"><a id="addRelateBatch" class="add thickbox" href="javascript:;"><span>+批量添加</span></a></li>`);
}

//Get formhash
const formhash = $('input[name="formhash"]').val();

 //make items sortable.
$.getScript('https://code.jquery.com/ui/1.11.4/jquery-ui.min.js',function(){
	console.log('getScript');
	$('#browserItemList').sortable({ handle: ".cover"});
	$('#columnSubjectBrowserA .browserList,#columnSubjectBrowserA .browserCrtList').sortable({ handle: ".avatar"});
});

$('#modifyOrder').click(function() {
    $(this).remove();
    $('.grp_box .tip_j').append('<a id="saveOrder" class="chiiBtn" href="#">保存修改</a>');
    $('.grp_box .tip_j').append('<a id="savenowOrder" class="chiiBtn" href="#">按当前列表顺序保存</a>');

    //insert comment_box if needs.
    $('#browserItemList .tools,#columnSubjectBrowserA .browserList .tools,#columnSubjectBrowserA .browserCrtList .tools').each(function() {
        let order = parseInt($(this).find('a').attr('order'));
        if($(this).parent().find('.text').length === 0){
            $('<div id="comment_box"><div class="item"><div style="float:none;" class="text_main_even"><div class="text"><br></div><div class="text_bottom"></div></div></div></div>').insertBefore($(this));
		}
		$(`<span class="tip">排序:</span><input id="modify_order" name="order" type="text" value=${order} class="inputtext" style="width:30px;height:15px">`).insertAfter($(this));
    });
    $('#browserItemList .text,#columnSubjectBrowserA .browserList .text,#columnSubjectBrowserA .browserCrtList .text').attr('contenteditable', 'true');
    let contents = [], item_ids = [], orders = [], items = [];
    $('#browserItemList > li,#columnSubjectBrowserA .browserList > li,#columnSubjectBrowserA .browserCrtList > div').each(function(i) {
        contents[i] = $(this).find('.text').text().trim();
        item_ids[i] = $(this).find('.tools :first-child').attr('id').match(/modify_(\d+)/)[1];
        orders[i] = parseInt($(this).find('input').attr('value'));
    });
    $('#saveOrder').click(function() {
        if(!confirm('确定要保存么？')) return;
        $(this).attr('disabled', 'disabled');
        $(this).html('保存中...');
        $('#browserItemList > li,#columnSubjectBrowserA .browserList > li,#columnSubjectBrowserA .browserCrtList > div').each(function(i) {
            let content = $(this).find('.text').text().trim();
            let item_id = $(this).find('.tools :first-child').attr('id').match(/modify_(\d+)/)[1];
            let order = parseInt($(this).find('input').attr('value'));
            if((order != orders[i])|(content != contents[i])){
                items.push({"item_id": item_id, "content": content, "order":order});
			}
        });
		saveRelateItems(items);
    });

    $('#savenowOrder').click(function() {
        if(!confirm('确定按当前列表顺序保存么？')) return;
        $(this).attr('disabled', 'disabled');
        $(this).html('保存中...');
        $('#browserItemList > li,#columnSubjectBrowserA .browserList > li,#columnSubjectBrowserA .browserCrtList > div').each(function(i) {
            let content = $(this).find('.text').text().trim();
            let item_id = $(this).find('.tools :first-child').attr('id').match(/modify_(\d+)/)[1];
			let order = i;
            if((order != orders[i])|(content != contents[i])){
                items.push({"item_id": item_id, "content": content, "order":order});
			}
        });
		saveRelateItems(items);
    });
});

$('#addRelateBatch').on('click', ()=> {
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_inline"></div>
<div id="TB_window" style="margin-left: -240px; width: 480px; margin-top: -100px; display: block;">
<div id="TB_title"><div id="TB_ajaxWindowTitle">批量添加关联条目</div><div id="TB_closeWindowButton" title="Close">X 关闭</div></div>
<div class="bibeBox" style="padding:10px">
<label>请输入url如 https://bgm.tv/subject/265，一行一个</label>
<textarea rows="10" class="quick" name="urls"></textarea>
</div>
<input class="inputBtn" value="添加关联" id="submit_list" type="submit">
</div></div>`;
	$('body').append(dialog);
	$('#submit_list').on('click', ()=> {
		$('#submit_list').val('添加关联中...');
		let url = $('#indexCatBox a')[0].href + '/add_related';
		let items = $('.bibeBox textarea').val().split('\n');
		addRelateBatch(url, items);
		//$('.bibeBox input[name="submit"]').val('添加完毕...！');
	});
	$('#TB_closeWindowButton').on('click', closeDialog);
});

/*$('#editRelateBatch').on('click', ()=> {
	let dialog = `<div id="TB_overlay" class="TB_overlayBG TB_inline"></div>
<div id="TB_window" style="margin-left: -240px; width: 480px; margin-top: -100px; display: block;">
<div id="TB_title"><div id="TB_ajaxWindowTitle">批量修改关联条目</div><div id="TB_closeWindowButton" title="Close">X 关闭</div></div>
<div class="bibeBox" style="padding:10px">
<label>请输入url如 https://bgm.tv/subject/265，一行一个</label>
<textarea rows="10" class="quick" name="urls"></textarea>
</div>
<input class="inputBtn" value="添加关联" id="submit_list" type="submit">
</div></div>`;
	$('body').append(dialog);
	$('#submit_list').on('click', ()=> {
		$('#submit_list').val('添加关联中...');
		let url = $('#indexCatBox a')[0].href + '/add_related';
		let items = $('.bibeBox textarea').val().split('\n');
		addRelateBatch(url, items);
		//$('.bibeBox input[name="submit"]').val('添加完毕...！');
	});
	$('#TB_closeWindowButton').on('click', closeDialog);
});*/



