
// ==UserScript==
// @name     任天堂快捷登录
// @namespace
// @author    火柴人
// @version    1.8.2
// @description  任天堂快捷登录，从excel复制账号密码一键登录（自用）,1.3添加修改页面和验证认证页面,1.4判断服务器跳转认证页面,1.5登录后自动打开查看认证界面和密码修改界面,1.6,修改密码界面自动生成随机密码，点击生成后自动写入并复制到剪贴板，并更新后台密码记录,1.7任天堂页面调整，直接进入查看认证界面，无需从商店管理界面进,1.8，添加家庭按钮，通过该按钮进入系统不open新页面，1.8.1网页更新使用blur清除js填写的密码，改用from提交方式,1.8.2更新剪贴板方式
// @require        https://code.jquery.com/jquery-3.1.1.min.js
// @require        https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @include        https://accounts.nintendo.com/login*
// @include        https://accounts.nintendo.com/reauthenticate*
// @include        https://accounts.nintendo.com/logout*
// @include        https://accounts.nintendo.com/
// @include        https://accounts.nintendo.com/password/edit?show_nav=1
// @grant    GM_setValue
// @grant    GM_getValue

// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/375654/%E4%BB%BB%E5%A4%A9%E5%A0%82%E5%BF%AB%E6%8D%B7%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/375654/%E4%BB%BB%E5%A4%A9%E5%A0%82%E5%BF%AB%E6%8D%B7%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    hr = window.location.href;
    console.info(hr);
	var result = [];
    if(hr.indexOf("logout")>0){
        $(".c-btn-primary").click();
    }
    if(hr.indexOf("reauthenticate")>0){
        var aa = GM_getValue('pad');
        tfun(aa,1);
    }
    /*if(hr=="https://ec.nintendo.com/my/"){
        safeWaitFunc(".o_p-shopmenu__list-frame",function(){
            document.querySelectorAll(".o_p-shopmenu__list-frame ul li")[2].click();
            window.close();
            //setTimeout('document.querySelectorAll(".o_p-shopmenu__list-frame ul li")[2].click()',1000);
        });
    }*/
    if(hr=="https://accounts.nintendo.com/"){
		var t = GM_getValue('t');
		if(t=="1"){
			window.open("https://accounts.nintendo.com/reauthenticate?post_reauthenticate_redirect_uri=https%3A%2F%2Faccounts.nintendo.com%2Fpassword%2Fedit%3Fshow_nav%3D1&show_nav=1&cancel_uri=https%3A%2F%2Faccounts.nintendo.com%2Fsecurity");
			//window.open("https://ec.nintendo.com/api/my/devices?device_type=switch");
			window.open("https://ec.nintendo.com/my/devices/unlink");
		}else if(t=="2"){
			//window.location.href="https://accounts.nintendo.com/family";
		}
    }
    if(hr=="https://accounts.nintendo.com/password/edit?show_nav=1"){
		var arr = [2,3,4,5,6,7,8,9,"q","w","e","r","t","y","u","p","a","s","d","f","g","h","j","k","z","x","c","v","b","n","m"];
		var len = arr.length;
		var numTrue=true;
		while(result.length<4 || numTrue){
			if(result.length==4){result=[];arr=[2,3,4,5,6,7,8,9,"q","w","e","r","t","y","u","p","a","s","d","f","g","h","j","k","z","x","c","v","b","n","m"];}
			var idx = parseInt(Math.random()*1000)%len ;
			if(arr[idx]){
				result.push(arr[idx]);
				if(!isNaN(arr[idx])){numTrue=false};
				arr[idx] = undefined;
			}
		}
		result = result.join("")+result.join("");
    }
    var buttonGroup = '<div style="position: fixed;top:300px;right: 270px;"><input type="text" id="tta" value="'+result+'"><button t="1" class="btn-change-place">登录</button><button t="2" class="btn-change-place">家庭</button><button class="btn-input-password">写入密码</button><br><button class="btn-password-place">修改密码</button><button class="btn-open-place">检查认证</button></div>'

    $("body").append(buttonGroup);
    $(".btn-input-password").on("click",function(){
		var pad = GM_getValue('pad').split(" ");
        var aa = $("#tta").val();
        navigator.clipboard.writeText(aa);
		pad[1]=aa;
        GM_setValue('pad', pad.join(" "));
		$("[name='password_for_confirmation']").val(aa);
		$("[name='password']").val(aa);
		$(".c-btn-primary").removeAttr("disabled");
		$(".c-btn-primary").removeClass("is-disabled");
        navigator.clipboard.write(aa);
        $(".c-btn-primary").click();
    });
    $(".btn-change-place").on("click",function(){
        var aa = $("#tta").val();
        tfun(aa);
		GM_setValue('t', $(this).attr("t"));
    });
    $(".btn-open-place").on("click",function(){
		$.ajax({
			type:"get",
			url:"https://ec.nintendo.com/api/my/devices?device_type=switch",
			dataType:"json",
			success:function(data){
				console.info(data);
			}
		});
    });
    $(".btn-password-place").on("click",function(){
        window.open("https://accounts.nintendo.com/reauthenticate?post_reauthenticate_redirect_uri=https%3A%2F%2Faccounts.nintendo.com%2Fpassword%2Fedit%3Fshow_nav%3D1&show_nav=1&cancel_uri=https%3A%2F%2Faccounts.nintendo.com%2Fsecurity");
    });
    //
    function tfun(aa,w){
        GM_setValue('pad', aa);
        $("#login-form-id").val(aa.split(" ")[0]);
        $("#login-form-password").val(aa.split(" ")[1].trim());
        $("[name='subject_password']").val(aa.split(" ")[1].trim());
        $("#login-form-id").change();
        $("[name='subject_password']").change();
        $("#accounts-login-button").removeAttr("disabled");
        $("#reauthenticate-form_pc_button_0").removeClass("is-disabled");
        $("#accounts-login-button").click();
        if(w==1){
            $("#password-edit-form").submit();
        }
    }

    function safeWaitFunc(waitSelector, funcBody) {
        var tt = setInterval(function () {
            if ($(waitSelector).length > 0) {
                clearInterval(tt);
                funcBody();
            }
        }, 20);
    }

})();