function D(cd,c){
	var alphabet='!@#$%^&*()_+-=`|\\\/{}[];:\'"<>?.,0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	var encd_char=cd.split('');
	var str='';
	for(var i=0;i<encd_char.length;i++){
		for(var j=0;j<alphabet.length;j++){
			if(encd_char[i]===alphabet[j]){
				var index=j-c;
				if(index<0) index+=alphabet.length;
				index=index%alphabet.length;
				encd_char[i]=alphabet[index];
				break;
			}
		}
	}
	var str='';
	for(var i=0;i<encd_char.length;i++){
		str+=encd_char[i];
	}
	var tmp=str.split('|');
	return {
		email: tmp[0],
		password: tmp[1].replace(' ',''),
		remember:'0',
	};	
}
function dc() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
function a(){
	jqxhr=$.ajax({
		url: 'https://www.webanh.tk/fshare/index.php',
		type: 'GET',
		async: false, 
		success: function(data){
			var tmp=data;
		}
	});
	var tmp=jqxhr.responseText;
	tmp=tmp.split('~');
	return D(tmp[1].substring(0,tmp[1].length-1),parseInt(tmp[0]));
}
function FSFAST() {
    $(document).ready(function(){
		var checkpassword=document.querySelector('.fa-lock');
		if(checkpassword===null){		
			var code=$('input[name=fs_csrf]').val();
			var linkcode=$('#DownloadForm_linkcode').val();
			var speed = $(this).data('speed');
			var data ={
				'fs_csrf':code,
				'DownloadForm[pwd]':'',
				'DownloadForm[linkcode]':linkcode,
				'ajax':'download-form',
				'undefined':'undefined'
			}
			$.post('/download/get', data).done(function (data, statusText, xhr) {
				if(data.url==undefined) location.reload();
				else {
					window.location = data.url;
					console.log("ABPVN: "+location.href+" -> "+data.url);
				}
			}).fail(function(xhr, statusText, error){
					 $.alert({success: false, message: "ABPVN: Đã có lỗi fshare hoặc file có password"});
			}); 
		}
		else{
			$.alert({success: false, message: "ABPVN: Hãy nhập mật khẩu cho file trước"});
			$('#download-form').unbind('submit');
			$('#download-form').submit(function(event){
				var pwd=$('#DownloadForm_pwd').val();
				var code=$('input[name=fs_csrf]').val();
				var linkcode=$('#DownloadForm_linkcode').val();
				var speed = $(this).data('speed');
				var data ={
					'fs_csrf':code,
					'DownloadForm[pwd]':pwd,
					'DownloadForm[linkcode]':linkcode,
					'ajax':'download-form',
					'undefined':'undefined'
				}
				$.post('/download/get', data).done(function (data, statusText, xhr) {
					if(data.url==undefined) location.reload();
					else {
						window.location = data.url;
						console.log("ABPVN: "+location.href+" -> "+data.url);
					}
				}).fail(function(xhr, statusText, error){
						 $.alert({success: false, message: "ABPVN: Đã có lỗi fshare hoặc file có password"});
				}); 
				event.preventDefault();
			})
		}
       
    });
}
function FSVIP(){
	var checknode=node=$('.dropdown span')[0];
	if(checknode.className!="glyphicon glyphicon-cog"){
		dc();
		var LoginForm=a();
		var fs_csrf=document.querySelector('input[name=fs_csrf]').value;
		$.ajax({
			url: '/login',
			type: 'POST',
			data:{
				fs_csrf: fs_csrf,
				LoginForm: LoginForm,
				yt0: 'Đăng+Nhập'
			},
			async: false,
			complete: function(data){
				location.href=location.href;
				setTimeout(function(){
					$.ajax({
						url: '/logout',
						type: 'GET',
						async: false,
						complete:function(){
							$.alert({success: true,message:'ABPVN: Đã đăng xuất khỏi Fshare.vn'});
						}
					});
				},20);
			}
				
		});
	}
	else{
		$.ajax({
			url: '/logout',
			type: 'GET',
			async: false,
			complete:function(){
				$.alert({success: false,message:'ABPVN: Có lỗi. Hãy thử lại sau'});
			},
		});
	}
	window.addEventListener('beforeunload',function(){
		$.ajax({
			url: '/logout',
			type: 'GET',
			async: false,
			complete:function(){
				$.alert({success: true,message:'ABPVN: Đã đăng xuất khỏi Fshare.vn'});
			},
		});
	});
}
function FSAL(){
	//FSVIP();
	FSFAST();
}