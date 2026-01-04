// ==UserScript==
// @name         中原工学院（中原工）校园网自动登录
// @namespace    We
// @version      0.4.1
// @description  中原工学院校园网自动登录，正常登录一次，之后校园网就会自动登录
// @author       We
// @match        *://1.1.1.1/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @downloadURL https://update.greasyfork.org/scripts/389970/%E4%B8%AD%E5%8E%9F%E5%B7%A5%E5%AD%A6%E9%99%A2%EF%BC%88%E4%B8%AD%E5%8E%9F%E5%B7%A5%EF%BC%89%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/389970/%E4%B8%AD%E5%8E%9F%E5%B7%A5%E5%AD%A6%E9%99%A2%EF%BC%88%E4%B8%AD%E5%8E%9F%E5%B7%A5%EF%BC%89%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    function login(a,b,c)//登录
    {
        document.getElementsByClassName("edit_lobo_cell")[1].value=a;//账号
        document.getElementsByClassName("edit_lobo_cell")[2].value=b;//密码
        document.getElementsByClassName("edit_lobo_cell")[3].value=c;//运营商
        ee(3);//调用网页中的登录函数
    }
	//将账号密码保存到本地
	function saveInfo(){
        if (window.localStorage.getItem("xxwuser")!==null){
			window.localStorage.removeItem("xxwuser");
		}
		if (window.localStorage.getItem("xxwpassword")!==null){
			window.localStorage.removeItem("xxwpassword");
		}
		if (window.localStorage.getItem("xxwyys")!==null){
			window.localStorage.removeItem("xxwyys");
		}

		window.localStorage.xxwuser=document.getElementsByClassName("edit_lobo_cell")[1].value;
		window.localStorage.xxwpassword=document.getElementsByClassName("edit_lobo_cell")[2].value;
		window.localStorage.xxwyys=document.getElementsByClassName("edit_lobo_cell")[3].value;
	}
	//删除保存在本地的账号密码
    function init(){
        Swal.fire({
            title: '提示',
            text: "确认初始化吗？",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                if (window.localStorage.getItem("xxwuser")!==null){
                    window.localStorage.removeItem("xxwuser");
                }
                if (window.localStorage.getItem("xxwpassword")!==null){
                    window.localStorage.removeItem("xxwpassword");
                }
                if (window.localStorage.getItem("xxwyys")!==null){
                    window.localStorage.removeItem("xxwyys");
                }
                Swal.fire({
                    icon: 'success',
                    title: '初始化成功！',

                })
            }
        })
    }
	//获取保存在本地的账号密码
	function getInfo(){
		var xxwuser=window.localStorage.getItem("xxwuser");
		var xxwpassword=window.localStorage.getItem("xxwpassword");
		var xxwyys=window.localStorage.getItem("xxwyys");
		return [xxwuser,xxwpassword,xxwyys]
	}
    //修改网页，登录时会调用保存
	function alterWebPage(){
		//添加初始化按钮
        var btn=document.createElement("INPUT");
        btn.name="mybtn";
        btn.type="button";
        btn.value="初始化";
        //这里的style是直接用的校园网登录按钮的style
        btn.onclick=init;
        btn.style="top: 600px; left: 127px; width: 180px; height: 30px; color: rgb(255, 255, 255); border-radius: 2px; text-align: center; padding: 6px; position: absolute; font-size: 16px; background-color: rgb(185, 66, 48);";
        document.body.appendChild(btn);
		//修改登录按钮，添加提示
		var tipStyle="top: 271px; left: 6px; width: auto; height: 40px; color: rgb(255,0,0); background-color: rgba(0, 0, 0, 0); font-size: 15px; right: auto; bottom: auto;";
		var loginBtn=document.getElementsByClassName("edit_lobo_cell")[0];
        if(loginBtn.value=="登 录"){
            loginBtn.value="保存并登录";
            loginBtn.onclick=saveInfo;
            var tip=document.getElementsByClassName("edit_cell edit_hyperlink ui-resizable-autohide")[0];
            tip.style=tipStyle;
            tip.lastElementChild.outerHTML='<a href="https://shimo.im/docs/pVGgt8PGCCxqHVhd/" target="_blank"><p>第一次使用需要手动登录一次，以后会自动登录，使用说明点击这里☜<br><br></p></a>';
        }
		//在注销页添加提示
        if(document.getElementsByClassName("edit_lobo_cell")[1].value=="注 销"||document.getElementsByClassName("edit_lobo_cell")[1].value=="返  回"){
            var tip1=document.getElementsByClassName("edit_cell edit_hyperlink")[0];
            tip1.style="top: 179px; left: 175px; width: auto; height: 40px; color: rgb(255,0,0); background-color: rgba(0, 0, 0, 0); font-size: 15px; right: auto; bottom: auto;";
            tip1.lastElementChild.outerHTML='<a href="https://shimo.im/docs/pVGgt8PGCCxqHVhd/" target="_blank"><p>使用说明点击这里☜<br><br></p></a>';
        }
	}
	//弹窗
	function againAlert(){
        let timerInterval
        const Toast = Swal.mixin({
            //toast: true,
            position: 'center',
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: true,
            onBeforeOpen: () => {
                //Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const b = content.querySelector('b')
                        if (b) {
                            b.textContent = Swal.getTimerLeft()
                        }
                    }
                }, 100)
            },
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        })
        Toast.fire({
            icon: 'info',
            title: '账号已经在其他设备登陆！',
            html: '<p><font size="3" face="arial" color="#FF7F50">默认3秒倒计时后自动顶掉其他设备的登陆，</br>你也可以点击立即登陆，也可以点击按钮或者</br>点击其他位置取消登陆</font></p></br>倒计时： <b></b> ms ',
            cancelButtonText:"取消登陆",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '立即登陆'
            //width: 400,
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
                window.open("http://1.1.1.1","_self");
            }else{
                if (result.value){
                    console.log('立即登陆')
                    window.open("http://1.1.1.1","_self");
                }else{
                    Swal.fire({
                        toast: true,
                        icon: 'error',
                        title: '自动登陆失败',
                        text: '用户手动取消登陆',
                        showConfirmButton: false,
                        background: '#FFE4E1',
                        timer:3000,
                        timerProgressBar: true,
                        onOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        },
                        //footer: '<a href>Why do I have this issue?</a>'
                    })
                }
            }
        })
    }

/*     async function sessionAlert(){
        const { value:cookie } = await Swal.fire({
            input: 'text',
            inputPlaceholder: '请输入Cookie',
            icon: 'info',
            title: '提示'
        })

       if(cookie){
           window.localStorage.xxwcookie=cookie;
       }
    }
 */

    window.onload =function(){//网页完全载入后执行

        alterWebPage();
		if(document.getElementsByClassName("edit_lobo_cell")[0].textContent=="inuse, login again"){//如果账号已经在其他设备登录，顶掉后，重新登录
			againAlert();
		}
		var info=getInfo();
		if(info[0]!==null&&info[1]!==null&&info[2]!==null){
			if(document.title=="上网登录窗"){//如果是登录页会调用登录函数
                login(info[0],info[1],info[2]);
			}
		}
    }

})();