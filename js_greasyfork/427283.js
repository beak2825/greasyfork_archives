// ==UserScript==
// @name        语雀编辑器远程图片本地化
// @namespace   YuQue_editor_pic_localization
// @version     1.0.4
// @description 将语雀文章里面的远程图片本地化，以免远程图片失效后不能预览。
// @author      邓小明
// @icon        https://cdn.nlark.com/yuque/0/2021/png/191410/1617364659047-1f999db8-93f2-4264-b80a-58cd2d9d6eac.png
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at      document-end
// @grant       unsafeWindow
// @include     *://www.yuque.com/*/edit*
// @downloadURL https://update.greasyfork.org/scripts/427283/%E8%AF%AD%E9%9B%80%E7%BC%96%E8%BE%91%E5%99%A8%E8%BF%9C%E7%A8%8B%E5%9B%BE%E7%89%87%E6%9C%AC%E5%9C%B0%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/427283/%E8%AF%AD%E9%9B%80%E7%BC%96%E8%BE%91%E5%99%A8%E8%BF%9C%E7%A8%8B%E5%9B%BE%E7%89%87%E6%9C%AC%E5%9C%B0%E5%8C%96.meta.js
// ==/UserScript==

function addDiv(dom, html) {
	var element = document.createElement('div');
	element.innerHTML = html;
	document.querySelector(dom).appendChild(element);
}

$('body').append(
	'<div id="show_pic_number" style="position:fixed; bottom:145px; right: 25px; width:32px; z-index: 99999; background-color:#fff; padding: 5px; border-radius: 50%; cursor: pointer; box-shadow: 0px 1px 3px rgba(0,0,0,0.2);" title="本地化远程图片"><img src="https://cdn.nlark.com/yuque/0/2021/png/191410/1617382285933-47bdf44f-9ac5-477b-80d6-74d0e180d1b1.png" width="100%"></div>'
);
$('#show_pic_number').on('click', function() {
	show_pic_number();
	return false;
});

addDiv('html',
	'<div id="request_log" style=" width: 100%; max-height: 300px; overflow-y: auto; font-size: 12px; background-color: rgba(0,0,0,0.8); color: #fff; line-height: 130%; z-index: 999999; left: 0; bottom: 0; position:fixed; word-break:break-all;" ondblclick="this.innerHTML=\'\'" title="双击清空"></div>'
);


var yuque_config = unsafeWindow.appData;
var config = {
	id: yuque_config.doc.id,
	book: {
		id: yuque_config.book.id,
		creator_userid: yuque_config.book.creator_id,
		name: yuque_config.book.name,
		created_at: yuque_config.book.created_at,
		updated_at: yuque_config.book.updated_at
	},
	doc: {
		id: yuque_config.doc.book_id,
		creator_userid: yuque_config.doc.user_id,
		title: yuque_config.doc.title,
		slug: yuque_config.doc.slug,
		created_at: yuque_config.doc.created_at,
		updated_at: yuque_config.doc.updated_at
	},
	user: {
		id: yuque_config.me.id,
		login: yuque_config.me.login,
		nickname: yuque_config.me.name,
		avatar: yuque_config.me.avatar,
		email: yuque_config.me.email,
		mobile: yuque_config.me.mobile
	}
};
console.log('config', config);

var upload_url_param = {
	'attachable_type': 'Doc',
	'attachable_id': config.doc.id,
	'ctoken': get_cookie('yuque_ctoken'),
	'type': 'image',
};
var upload_url = 'https://www.yuque.com/api/upload/attach?' + $.param(upload_url_param);

/*
console.log('url_param', upload_url);
data.attachment_id
data.filename
data.url
*/
var remote_pic_list = new Array();
var remote_pic_list_original = new Array();

function show_pic_number() {
	remote_pic_list = [];
	remote_pic_list_original = [];
	$('.lake-content-editor-core .image').each(function() {
		if ($(this).attr('src').match(/^\/api\/filetransfer\/images\?url=/)) {
			if (!in_array($(this).data('raw-src'), remote_pic_list_original)) {
				remote_pic_list.push($(this).attr('src'));
				remote_pic_list_original.push($(this).data('raw-src'));
				$(this).attr('data-is-remote-pic', '1');
			}
		}
	});
	if (remote_pic_list.length > 0) {
		for (key in remote_pic_list) {
			replace_pic_url(remote_pic_list[key], remote_pic_list_original[key]);
		}
	} else {
		console.log('没有远程图片');
	}
}

function get_cookie(cname) {
	var name = cname + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return '';
}

function replace_pic_url(url, url_original) {
	fetch(url).then(response => {
		if (response.status == 200 && response.redirected == true) {
			var pic_dom = $('.lake-content-editor-core .image[data-raw-src="' + url_original + '"]');
			pic_dom.attr('data-raw-src', response.url).attr('src', response.url).removeAttr(
				'data-is-remote-pic');
			var pic_dom_parent = pic_dom.parents('span[data-lake-card="image"]');
			var card_data = $.parseJSON(decodeURIComponent(pic_dom_parent.data('card-value').substring(
				5)));
			card_data.src = response.url;
			pic_dom_parent.attr('data-card-value', 'data:' + encodeURIComponent(JSON.stringify(card_data)));
			pic_dom.parent('.lake-image-meta').siblings('.lake-image-editor').find('img').attr('src', response
				.url);
			if ($('.lake-content-editor-core .image[data-is-remote-pic=1]').size() == 0) {
				$('#lake-doc-publish-button').trigger("click");
				console.log('全部替换完，保存内容');
			}
		}
	});
}

function in_array(search, array) {
	for (var i in array) {
		if (array[i] == search) {
			return true;
		}
	}
	return false;
}
