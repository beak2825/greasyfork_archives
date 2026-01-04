// ==UserScript==
// @name         GeekHub upLoadImage
// @namespace    http://seamonster.me
// @version      0.1
// @description  快捷上传图片
// @author       SeaMonster
// @match        https://*.geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408727/GeekHub%20upLoadImage.user.js
// @updateURL https://update.greasyfork.org/scripts/408727/GeekHub%20upLoadImage.meta.js
// ==/UserScript==

(function() {
    var dialog = `
        <style>
		.toggleModal{
			padding: 10px 20px;
			color: white;
			background: #409EFF;
			border:none;
			box-shadow: 2px 3px 20px rgba(0,0,0,0.2);
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
		.mask{
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.4);
			z-index: 100;
			display: none;
		}
		.modal{
			position: fixed;
			top: 50%;
			left: 50%;
			width: 600px;
			transform: translate(-50%,-50%);
			border-radius: 5px;
			background: #fff;
			box-shadow: 2px 3px 20px rgba(0,0,0,0.2);
			z-index: 120;
			display: none;
		}
		.modal .modal-header{
			height: 50px;
			border-bottom: 1px solid #f5f5f5;
			padding: 0 15px;
		}
		.modal .modal-header p {
			line-height: 35px;
			display: inline-block;
		}
		.modal .modal-header .title{
			font-size: 18px;
			color: #333;
		}
		.modal .modal-header .close{
			float: right;
			font-size: 26px;
			margin-top: 5px;
			color: #9C9FA4;
			cursor: default;
		}
		.modal .modal-content{
			min-height: 100px;
padding:20px;
		}
		.modal .modal-footer .btn{
			padding: 0 20px;
			height: 36px;
			line-height: 36px;
			color: white;
			background: #409EFF;
			border: none;
		}
		.modal .modal-footer{
			border-top: 1px solid #f5f5f5;
			padding: 15px;
			text-align: right;

		}
		.container::after{
			content:"";
			display: block;
			clear: both;
		}
	</style>
<div class="container">
	<div class="modal">
		<div class="modal-header">
			<p class="title">SM图床快捷上传</p>
			<p class="close">×</p>
		</div>
		<div class="modal-content">
			<input id="lefile" type="file" style="display:none">
			<button type="button" class="btn btn-white" style="margin-left: 20px;" onclick="$('input[id=lefile]').click();">选择上传的图片</button>
			<span id="tips" style="color:#E74C3C;padding-left:10px;font-size:14px;"></span>
			<div style="padding-top:20px;height: 200px;">
				<div style="width: 40%; float: left;">
					<img src="https://i.loli.net/2020/08/14/BTfpzuk7PJGARhx.png" id="img" style="height:150px;">
				</div>
				<div style="width: 60%; float: left;">
					<input type="text" class="form-input" id="resUrl" value="" style="width:100%;">
					<button type="button" class="btn btn-blue" style="margin-top:15px;" onclick="copyText()">复制链接</button>
					<span id="copytips" style="color:#2ECC71;padding-left:10px;font-size:16px;"></span>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button class="close btn">关闭</button>
		</div>
	</div>
	<div class="mask"></div>
</div>

`
    $('body').append(dialog);
    var subhtml = $(".box.mt-5.p-3>form>.flex.items-center").html();
    subhtml += '<a class="btn btn-white" id="toggleModal" style="margin-left:10px;">上传图片</a>';
    $(".box.mt-5.p-3>form>.flex.items-center").html(subhtml);
    $('input[id=lefile]').change(function() {
		$("#tips").html("正在上传，请稍等....");
		var f = this.files[0];
		var formData = new FormData();
		formData.append('smfile', f);
        var xhr = new XMLHttpRequest();
var action = "https://sm.ms/api/v2/upload"; //上传服务的接口地址
xhr.open("POST", action);
xhr.send(formData); //发送表单数据
xhr.onreadystatechange = function(){
  if(xhr.readyState==4 && xhr.status==200){
    var resultObj = JSON.parse(xhr.responseText);
    //处理返回的数据......
      $("#tips").html("");
				var data = resultObj;
				if (data.code == "success") {
					var url = "![](" + data.data.url + ")";
					$("#resUrl").val(url);
					$("#img").attr("src", data.data.url);
				} else {
					var curl = "![](" + data.images + ")";
					$("#resUrl").val(curl);
					$("#img").attr("src", data.images);
				}
  }
}
		/*$.ajax({
			url: 'https://sm.ms/api/v2/upload',
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(data) {
				$("#tips").html("");
				data = $.parseJSON(data);
				if (data.code == "success") {
					var url = "![](" + data.data.url + ")";
					$("#resUrl").val(url);
					$("#img").attr("src", data.data.url);
				} else {
					var curl = "![](" + data.images + ")";
					$("#resUrl").val(curl);
					$("#img").attr("src", data.images);
				}
			},
			error: function(data) {
				console.log(data);
			}
		});*/
	});

	function copyText() {
		if ($("#resUrl").val() != "") {
			$("#copytips").html("复制成功");
		}
		setTimeout(function() {
			$("#copytips").html("");
		}, 2000);
		$("#resUrl").select();
		document.execCommand("Copy");
	}

})();

// 获取需要使用到的元素
var toggleModal = document.getElementById("toggleModal");
var container = document.getElementsByClassName("container")[0];
var mask = document.getElementsByClassName("mask")[0];
var modal = document.getElementsByClassName("modal")[0];
var closes = document.getElementsByClassName("close");
toggleModal.onclick = show;
closes[0].onclick = close;
closes[1].onclick = close;
function show(){
    mask.style.display = "block";
    modal.style.display = "block";
}
function close(){
    mask.style.display = "none";
    modal.style.display = "none";
}