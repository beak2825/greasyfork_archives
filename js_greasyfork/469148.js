//登录界面执行
function sgt_login(){
	//从localStorage取用户名和密码
	var user = localStorage.getItem('user');
	var pass = localStorage.getItem('pass');
	//双击用户名框  这个功能不需要了。
	$('#txtUserName').dblclick(function(){
		return  
		//如果user == 我的名字 那么返回
		if (user == '申高天'){
			return
		}
		//如果 1 在 localStorage的用户名里面，那么把1去掉
		if (user.indexOf("1")!=-1){
			user=user.slice(0,-1);
		}
		//post请求 POST登录
		$.post("/ajax/login.ashx",
			{u:user,IA_id:'2c7e53fbfc2e82a6d413095dd95bf6fe',p:pass,c:"38",orgcode:'睿博兴科'},
			function (data) {
				//转到主页
				window.location.href="http://49.72.111.82:8081/default.aspx#"
			});
	})
	//密码框按回车键
	$('#txtPassword').keypress(function(event){
		if(event.keyCode ==13){
			用户名密码保存操作()
		}
	})
	//点击登录按钮  把用户名和密码存在localStorage
	$('#btnLogin').click(function(){
		用户名密码保存操作()
	})
	function 用户名密码保存操作(){
		user_input=$('#txtUserName').val()
		pass_input=$('#txtPassword').val()
		if (user === null){
			if (user_input=='申高天'){
				localStorage.setItem('user','申高天1');
			}else{
				localStorage.setItem('user',user_input);
			}
			localStorage.setItem('pass',pass_input);
		}else if (user.indexOf("1")==-1){
			//如果 1 不在 localStorage的用户名里面，那么保存
			localStorage.setItem('user',user_input);
			localStorage.setItem('pass',pass_input);
		}
	}
}
