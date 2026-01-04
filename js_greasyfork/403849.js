// ==UserScript==
// @name         小幺鸡批量导入备注
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  全网收款批量导入小幺鸡备注插件！
// @author       简简简简
// @match        */xiaoyaoji/doc/*/edit
// @require       https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license      MIT
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/403849/%E5%B0%8F%E5%B9%BA%E9%B8%A1%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/403849/%E5%B0%8F%E5%B9%BA%E9%B8%A1%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
     debugger;
    //ajax 函数
    $._ajax_ = function (params) {
            if (params.data) {
                for (var key in params.data) {
                    if (params.data[key] === undefined || params.data[key] === null) {
                        delete params.data[key];
                    }
                }
            }
            var complete = params.complete;
            var success = params.success;
            params.complete = function (xhr, result) {
                if (result === 'error') {
                    if (xhr.readyState === 0) {
                        toastr.error('网络错误');
                    } else {
                        console.log(arguments)
                    }
                }
                if (complete) {
                    complete.apply(this, arguments);
                }
            };
            var expired = params.expired;
            params.success = function (rs) {
                if (rs.code === 0) {
                    if (success) {
                        success.apply(this, arguments);
                    }
                } else if (rs.code === -2) {
                    if (expired && expired(rs)) {
                        return true;
                    }
                    if (location.href.indexOf('/project/demo') !== -1) {
                        toastr.error('请登陆后尝试');
                        return true;
                    }
                    localStorage.setItem("token", "");
                    localStorage.setItem("user", "");
                    location.href = x.ctx + '/login?status=expired&refer=' + encodeURIComponent(location.href);
                } else {
                    toastr.error(rs.errorMsg);
                }
            };
            $.ajax(params);
        }

//传递待翻译数组 和 字典
	function convert(contentArray,dictionary){
		contentArray.map(function (item) {
		    //翻译字段
	            //如果当前父级item有子集children
                if(item.children instanceof Array){
                    console.log("当前内容"+item+"元素为数组"+"content为"+item.children+"字典为"+dictionary[item.name])
                    //有子集则只翻译其子集 不翻译自身
                    if(item.children!=null&&item.children.length>0){
                        //传递字段map 和结构相同的备注的map
                        if(dictionary.hasOwnProperty(item.name)){
                            //判断字典是否是数组
                            if(dictionary[item.name] instanceof Array){
                                convert(item.children,dictionary[item.name][0])
                            } else{
                              convert(item.children,dictionary[item.name])
                            }
                        }else{
                            //如果传的备注map和字段map结构不一致 就一层层去找
                            console.log("你的备注map和字段map结构不一致，只能一层层去找")
                            convert(item.children,dictionary)
                        }
                    }else{
                        //没有子集 则当前字段为普通字段
						            //字典中有此字段 则获取翻译资格
						if (dictionary.hasOwnProperty(item.name) ) {
						    item.description = dictionary[item.name]
						}else{
							//字典中找不到参数字段
							console.log("字典中无"+item.name+":此属性")
						}
                    }
                }
		})
	}


	//修改函数
    function set_description(doc, requectDict,responseDict) {
	    //获取待翻译的内容
		var content = JSON.parse(doc.content)
        console.log("待翻译的备注：")
        console.log(content)
		//翻译请求参数
        if(null!=requectDict){
           convert(content.requestArgs,requectDict)
        }

        //响应参数
        if(null!=responseDict){
           convert(content.responseArgs,responseDict)
        }

        doc.content = JSON.stringify(content)
        return doc
    }

    //post函数
    function post(url, data, success, error) {
        ajax({
            url: url,
            data: data,
            type: 'post',
            dataType: 'json',
            success: success,
            error: error
        });
    }

    function ajax (params) {
        var url = '' + params.url;
        params.url = x.ctx + url;
        params.xhrFields={withCredentials:true};
        $._ajax_(params);
    }
      //我修改后的提交函数
       function submit(requectDict,responseDict) {

          if (_isGlobal_) {
              unsafeWindow.submitProjectGlobal();
          } else {

              var doc = unsafeWindow.getDoc();
              //调用修改函数修改
              set_description(doc,requectDict,responseDict)
              var url = '/doc/' + _docId_;
              post(url, {
                  name: doc.name,
                  comment: "",
                  content: doc.content
              }, function () {
                  alert('操作成功');
              });
          }
       }
      //给节点设置这个函数


    unsafeWindow.getDoc = function(){
            var description = $('#api-description').html();
            docApp.content.description = description;
            alert("hahahahha")
            var content = JSON.stringify(docApp.content);
            return {
                name:docApp.doc.name,
                content:content
            };
        }
    //页面加载时调用
    window.onload = function () {
        window.doc = doc
        //添加一个按钮
		$('.xd-header').append("<button style='color: red;'  id='btnzzq' >批量导入备注！</button>")
        var btnzzq = document.getElementById("btnzzq");
        console.log("测试")
        console.log($('#sidebar'))

        btnzzq.onclick = function(){
            //提示框
            //第一个参数是提示文字，第二个参数是文本框中默认的内容
            var requectDict = prompt("请导入请求参数备注json","");
            var RequestDictJson = null;
            if(null!=requectDict&&requectDict!=''){
             //输出备注的格式
             alert("已获得请求参数备注:"+requectDict);
              RequestDictJson = JSON.parse(requectDict)
            }else{
              alert("请求参数备注为空！")
            }


            //第一个参数是提示文字，第二个参数是文本框中默认的内容
            var responseDict = prompt("请导入响应参数备注json","");
            var ResponseDictJson = null;
            if(null!=responseDict&&responseDict!=''){
             //输出备注的格式
             alert("已获得响应参数备注:"+responseDict);
                var msg = "";
                try{
                  ResponseDictJson = JSON.parse(responseDict)
                }catch(err){
                    console.log(err)
                    console.log(err.message);
                    alert("响应备注json解析失败！")
                }

            }else{
              alert("响应参数备注为空！")
            }
            doc = window.doc
            console.log(unsafeWindow.getDoc());
            if(null!=RequestDictJson||null!=ResponseDictJson){
                submit(RequestDictJson,ResponseDictJson)
            }else{
              alert("导入请求备注或响应备注后才能批量生成！")
            }

        }
      }
    // Your code here...
})();