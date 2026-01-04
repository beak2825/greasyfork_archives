// ==UserScript==
// @name         通途
// @namespace    http://tampermonkey.net/
// @version      2.5.8
// @description  为途教务系统验证码识别
// @author       kaka
// @match        http://jwc.swjtu.edu.cn/service/login*
// @match        *://jiaowu.swjtu.edu.cn/service/login*
// @match        http://jwc.swjtu.edu.cn/vatuu/YouthIndexAction?setAction=index
// @match        http://jwc.polus.edu.cn/service/login*
// @match        http://jwc.abtu.edu.cn/service/login*
// @match        http://jwb.sqmc.edu.cn/service/login*
// @match        http://jwc.svtcc.edu.cn/service/login*
// @match        http://jwc.scuvc.com/service/login*
// @match        http://jwxt.stbu.edu.cn/service/login*
// @match        *.vatuu.com/service/login*
// @match        *.vvtuu.com/service/login*
// @connect      aip.baidubce.com
// @connect      localhost
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397912/%E9%80%9A%E9%80%94.user.js
// @updateURL https://update.greasyfork.org/scripts/397912/%E9%80%9A%E9%80%94.meta.js
// ==/UserScript==
(function() {
    'use strict';
  
    let setting = {//改一改这个，应该能用于其他网站，慢慢适配
        ////////////////////////////////////////////////////////////////////////////////////////////user-setting
        ran_img:function(){return document.querySelector("#randomPhoto > img")}, /*验证码图片元素*/
        ran_img_url:window.location.origin+'/vatuu/GetRandomNumberToJPEG?test='+new Date().getTime(),/*验证码图片请求url*/
        ran_text:function(){return document.getElementById('ranstring')},/*验证码填写元素*/
        other_data:['document.querySelector("#password")',/*其它必填项#######################自动处理，下次跟新再说（逃*/
                    'document.querySelector("#username")'],/*必须是字符串，目前想不到更好的解决办法*/
        submit:document.querySelector("#submit2"),/*登陆按钮*/
        add_onload_listener:1,//是否需要在切换验证码后对图片元素监听
        autologin:false,//自动登录开关
        //////////////////////////////////////////////////////////////////////////////////////////////other-setting
        nostop:true,/*错误后允许重试*/
        err_total:10, /*各环节允许最大错误*/
        debugger:0,//调试开关
        done:0,
        ocrurl: "https://aip.baidubce.com/rest/2.0/ocr/v1/webimage",//api地址
        ocrurl_1: "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic",//备用api
        apis:[['iKGARn6BhGgU82W9xzLUIatb','hES0Zae2iLdP1iotenC8zlGo9qA3r0Hc'],
             ],
    };
////////////////////////////////////////////////////////////////其它网址匹配
    if(/bslc.lib.swjtu.edu.cn/.test(window.location.href)){
        debug('lib')
    setting.ran_img= function(){return document.querySelector("#kaptcha")}
    setting.ran_text= function(){return document.querySelector("#code")}
    setting.ran_url= "https://bslc.lib.swjtu.edu.cn/uas/kaptcha.jpg"
    setting.other_data= ['document.querySelector("#userid")','document.querySelector("#password")']
    setting.submit= document.querySelector("#form1 > div:nth-child(10) > button")
         //setting.autologin=true,//自动登录开关
    }






    /////////////////////////////////////////////////////////////



    function autologin(){
        if(other_data_done()){/*其它信息也填了就登陆*/
            setting.submit.click();

        };

    };
    function add_onload(){
        if(setting.add_onload_listener){
        try{
            let img =setting.ran_img()//再次添加监听
            img.addEventListener("load",function(){
                get_random_img(function( bs64_str){
                    get_str(bs64_str)

                })
            })
        }catch(e){}
        }
    }
    function debug(){
        if(setting.debugger){
            const arg = Array.from(arguments);
            arg.unshift(`color: white; background-color:#2274A5`);
            arg.unshift('%c 通途:');
            console["info"].apply(console, arg);
        }
    }
    function enter_login(){
        document.onkeydown = function(ev){
            var e = ev || event;
            if(e.keyCode ==13){
                setting.submit.click();
            };
        }};
    function other_data_done(){
        if(eval(setting.other_data.join('.value&&')+'.value')){return true;};
    };

    function get_random_img(callback){
        setting.runing=1
        let img= setting.ran_img()
        debug(img)
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        let ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        let dataURL = canvas.toDataURL("image/"+ext);
        let bs64_str = dataURL.split(",")[1];
        callback(bs64_str);

    };
    function get_access_url(){
        let randomapi = setting.apis[setting.ran_api_num];
        return 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+randomapi[0]+'&client_secret='+randomapi[1]
    };

    function setCookie(cname, cvalue, exp) {
        var d = new Date();
        d.setTime(d.getTime() + (exp*1000)-5000);
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            };
            if (c.indexOf(name)  == 0) {
                return c.substring(name.length, c.length);
            };
        };
        return "";
    };

    function get_access(){
        debug("api-num",setting.ran_api_num)
        debug("api-url",setting.ocrurl)
        let access_token = getCookie("access_token_"+setting.ran_api_num);
        if (access_token != "") {/*access未过期*/
            setting.access_token =access_token;
        } else {
            try{
                GM_xmlhttpRequest({
                    method: "GET",
                    url:get_access_url(),
                    onload: function(response) {
                        let access_token =JSON.parse(this.responseText)["access_token"];
                        let expires =JSON.parse(this.responseText)["expires_in"];
                        setCookie("access_token_"+setting.ran_api_num, access_token, expires);
                        setting.access_token = access_token;
                    }
                });
            }catch(err){
                debug("response1",response.responseText)

                if( err_access_num<=setting.err_total){
                    err_access_num+=1;
                    get_access();
                }else{
                    setting.ran_text().placeholder = '失败，请自行输入';

                }
            }
        }

    }
    function get_str(bs64_str){
       if(setting.done){debug('已填写，取消操作')
                        return}
       let request_url = setting.ocrurl + "?access_token=" + setting.access_token;
        let data = 'image='+encodeURIComponent(bs64_str);
        /*alert(encodeURIComponent(bs64_str));*/
        GM_xmlhttpRequest({
            method: 'POST',
            url: request_url,
            data: data,
            headers: {
                'charset': 'UTF-8',
                "Content-Type": "text/plain"
            },
            onload: function(response) {
                /* console.log("baidu_response");*/
                debug(response.responseText)
                let temp =  JSON.parse(response.responseText);
                if(temp['error_code']==17){
                    debug('服务器请求超限',setting.ran_api_num)
                    let lastapi=setting.apis[setting.ran_api_num]
                    setting.apis[setting.ran_api_num]=0//标记超限的
                    debug(setting.apis)

                        for(let i=0;i<setting.apis.length;i++){

                            if(setting.apis[i]!=0){
                                setting.ran_api_num = i
                                get_random_img(function( bs64_str){
                                    get_access();
                                    get_str(bs64_str);
                                    throw "超限"
                                }
                                             )
                            }
                        }
                    setting.ocrurl= setting.ocrurl_1//使用备用识别url
                    setting.apis[setting.ran_api_num]=lastapi
                    get_random_img(function( bs64_str){
                                    get_access();
                                    get_str(bs64_str);

                                }
                                             )
                    setting.ran_text().placeholder = '今日请求超限';
                        debug('无可用')
                              return
                }else if(temp['error_code']&& temp['error_code']!= 18&& temp['error_code']!= 110){
                    setting.ran_text().placeholder = '服务器访问出错';
                    return
                }
                try{

                    let rand_str = temp['words_result'][0]['words'].trim();
                    debug("解析结果",rand_str)
                    if(rand_str.length == 4){
                        setting.ran_text().value = rand_str; /*填写验证码  */
                        if(other_data_done()&&setting.autologin){/*其它信息也填了就登陆*/
                            setting.submit.click();
                        };
                        debug('已填写')
                        setting.done=1
                        //add_onload()//添加监听
                    }else{  /*重来*/

                        throw "解析失败";

                    };
                }catch(err){
                    setTimeout(function(){
                        if(setting.nostop){
                            if(setting.err_num<=setting.err_total ){
                                setting.err_num+=1;
                                debug('重试次数：'+setting.err_num)
                                setting.ran_text().placeholder = '失败，重试中...';
                                //if(setting.done){debug('已填写，取消操作') return}
                                setting.ran_img().click()//切换验证码
                                add_onload()
                            }else{
                                setting.ran_text().placeholder = '失败，请自行输入';
                                return;
                            }
                        };

                    },200)

                };
            }
        });
    };
    function init(){
        setting.runing=0;
        setting.err_num = 1;
        let err_access_num = 1;
        setting.ran_api_num = Math.floor(Math.random() * setting.apis.length);
        enter_login();
        debug(setting.ran_text())
        //setting.ran_text().addEventListener('focus',function(){setting.nostop=false; setting.ran_text().placeholder = '检测到自行输入';})/*用户选择自己写时，阻止继续执行*/
    }
    function main(){
        let img =setting.ran_img()
        debug(img)
        img.addEventListener("load",function(){
            setting.ran_text().placeholder = '尝试获取验证码中';
            get_random_img(function( bs64_str){
                get_access();
                get_str(bs64_str);
            });
            /*setInterval(autologin,3000)//适合自己用*/
            autologin();/*针对浏览器预先填写的用户*/
            // setInterval(add_onload,10);目的是验证码错误后再次尝试，但好像有点问题，如何区分谁改的img标签，脚本还是源网页


        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    init();
    main();
    var yalert = window.alert
    function newalert(msg){
                  if('验证码输入不正确' == msg&&setting.nostop){
                     debug('检测到alert，验证码输入不正确,开始执行main',msg)
                      setting.ran_text().value = ''
                      setting.done = false
                      setting.autologin = true
                   setting.ran_img().click()//切换验证码
                   add_onload()
                   setting.err_num+=1;
                  }else{
                   yalert(msg)
                  }
 }
    unsafeWindow.alert = newalert
    let isrun= setInterval(function(){//发现会概率性不执行，推测是因为上面onload的锅，先加个检测
        console.log(setting.runing)
        if(setting.runing){
            clearInterval(isrun)
        }else{
            debug('run main')
            setting.ran_text().placeholder = '尝试获取验证码中';
            get_random_img(function( bs64_str){
                get_access();
                get_str(bs64_str);
            }
                          )
        }
    },100)

    })();