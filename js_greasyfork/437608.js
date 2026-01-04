// ==UserScript==
// @name         alibaba助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  alibaba助手，用于
// @author       yin
// @match        https://hz-productposting.alibaba.com/*
// @match        https://post.alibaba.com/product/publish.htm?*&flag=autoopen
// @match        https://siteadmin.alibaba.com/detail/sellPreview.htm?*&flag=autoopenpreview
// @match        https://siteadmin.alibaba.com/*&flag=autosave
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437608/alibaba%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437608/alibaba%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 var deleteProductId = ''; //要删除的产品id

var mockJs=document.createElement('script');
mockJs.setAttribute("type","text/JavaScript");
mockJs.setAttribute("src", 'https://unpkg.com/http-request-mock/dist/http-request-mock.js');
document.getElementsByTagName('head')[0].appendChild(mockJs);

(function() {
    'use strict';
    console.log("插入脚本")
    var row = $("button.custom-batch-common").eq(0).parent();
        row.append('<input id="uniondeleteinput" placeholder="输入要删除的产品id" style="margin-right: 4px;width: 119px;height: 28px;position: relative;display: inline-block;top: 7px;"/>')
    row.append('<button type="button" id="uniondelete" class="next-btn next-medium next-btn-normal custom-batch-common" style="background-color: #f44336;color: #fff;"><span>删除商家推荐</span></button>')


    //row.append('<iframe src="" id="unioniframe" name="unioniframe" style="width:100%;height:200px"></iframe>')


    $("#uniondelete").on('click',function(){
        uniondelete();
    })

    function uniondelete() {
        deleteProductId = $("#uniondeleteinput").val();
        if(deleteProductId != ""){
            GM_setValue('deleteProductId', deleteProductId);
        }

        //获取选中行
        var selectrows = $(".next-checkbox-wrapper:not(.select-all).checked").parent().parent().parent()

        //获取选中id
        var selectIds = selectrows.find(".product-id");
        if(selectIds.length > 0){
            selectIds.each(function (i, element) {
                var id = $(element).text().split(":")[1].trim();
                window.open(selectrows.find("a[behavior=edit]").attr("href") + "&flag=autoopen") //打开编辑页面
            });
        }


        GM_xmlhttpRequest({
            method:"GET",
            url:"https://siteadmin.alibaba.com/detail/sellPreview.htm?pageId=20179905611&type=pc&t=1640013526593",
            onload:function(data){
                var el = document.createElement('html');
                el.innerHTML = data.response;
                var datastr = el.getElementsByTagName("script")[1].innerHTML;
                console.log()
                YSaveData();
            }
        })

        //保存
        function YSaveData(data){
            GM_xmlhttpRequest({
                method:"POST",
                url:"https://siteadmin.alibaba.com/detail/save_page?csrf_token=83e9a343-7bc0-4974-adce-e295db85f40e&ctoken=115aym4htvi2b",
                data:data,
                onload:function(data){
                    var el = document.createElement('html');
                    el.innerHTML = data.response;
                    console.log(el.getElementsByTagName("script")[1].innerHTML)

                }
            })
        }

        //$("#unioniframe").attr('src', "https://siteadmin.alibaba.com/detail/sellPreview.htm?pageId=20179905611&type=pc&t=1640013526593")

        //$("#unioniframe")[0].onload = function () {
        // console.log(window.frames["unioniframe"].document);
        // console.log($(window.frames["unioniframe"])[0].contentWindow.DETAIL_DECORATE_DATA)
        //};

    }

    function getUrlParam(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r!=null) return unescape(r[2]);
        return null; //返回参数值
    }

    var productName = "";

    //当前是 编辑页面
    if(getUrlParam('flag') == 'autoopen'){
        //自动跳转到
        console.log("自动跳转到预览页面")
        setInterval(function(){
            autoOpenPreview()
        },1000)

    }

    //当前是 内容编辑预览页面
    if(getUrlParam('flag') == 'autoopenpreview'){
          //自动跳转到
        console.log("自动跳转到内容编辑页面")
        setInterval(function(){
            autoOpenEdit()
        },1000)
    }

        //当前是 内容编辑页面
    if(getUrlParam('flag') == 'autosave'){
          //自动跳转到
        console.log("自动跳转到内容编辑页面")
       lanjie()
    }




    //自动打开内容编辑预览
    function autoOpenPreview(){
        productName = $("#productTitle").val();
        console.log($(".icbu-sell-iframe").attr('src'))
        window.location.href = ($(".icbu-sell-iframe").attr('src')+"&flag=autoopenpreview")
    }
    //自动打开内容编辑
    function autoOpenEdit(){
        var pageId = getUrlParam("pageId");
        var csrf_token = getCookie('c_csrf');
        console.log(pageId,csrf_token)
        console.log(`https://siteadmin.alibaba.com/detail/decorate.htm?scene=sell&lang=&from=&productName=${productName}&switcher=%7B%22autoMagicGray%22%3Atrue%7D&csrf_token=${csrf_token}&pageId=${pageId}&flag=autosave`)
        window.location.href = `https://siteadmin.alibaba.com/detail/decorate.htm?scene=sell&lang=&from=&productName=${productName}&switcher=%7B%22autoMagicGray%22%3Atrue%7D&csrf_token=${csrf_token}&pageId=${pageId}&flag=autosave`
    }

    console.log(getCookie('c_csrf'))
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

    //var jqueryJs=document.createElement('script');
    //jqueryJs.setAttribute("type","text/JavaScript");
    //jqueryJs.setAttribute("src", 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js');//'http://ajax.microsoft.com/ajax/jquery/jquery-1.4.min.js'
    //document.getElementsByTagName('head')[0].appendChild(jqueryJs);

    //拦截
    function lanjie(){
        var s = setInterval(function(){
        deleteProductId =GM_getValue('deleteProductId');
        console.log("hook",deleteProductId)
        if(typeof HttpRequestMock != "undefined"){
            var mocker = HttpRequestMock.setup();
            mocker.post('https://siteadmin.alibaba.com/detail/save_page', (requestInfo, mock) => {
                var pageid = requestInfo.body.substring(requestInfo.body.indexOf("&pageId"))
                var body = requestInfo.body.substring(11,requestInfo.body.length - 11);
                body = body.substring(0,body.lastIndexOf("&pageId"));
                body = decodeURIComponent(body);
                body = JSON.parse(body);
                body.bodyLayout.forEach(function(bodylay){
                    bodylay.grids.forEach(function(grid){
                        grid.modules.forEach(function(module){
                            if(module.componentKey == 'detailSellerRecommend'){
                                var products = module.formData.config.products
                                for(var i = 0; i < products.length; i++){
                                    if(products[i].id == deleteProductId){
                                        module.formData.config.products.splice(i,1);
                                    }
                                }
                            }
                        })
                    })
                })

                console.log(body)

                var changebody = "jsonParams=" + encodeURIComponent(JSON.stringify(body)) + pageid
                if (requestInfo.query.flag == 'change') {
                    //return mock.bypass();
                }else{
                    let csrf_token = requestInfo.query.csrf_token;
                    let ctoken = requestInfo.query.ctoken;
                     let testRequest = new Request(`/detail/save_page?csrf_token=${csrf_token}&ctoken=${ctoken}&_bx-v=1.1.20&flag=change`, {
                        method: 'post',
                        headers:requestInfo.headers,
                        body: changebody
                    })
                    fetch(testRequest).then(response => {
                        console.log(response)

                    })
                }

            });

            clearInterval(s)
        }


    },100)
    }



    /*====== 开始：辅助函数 ======*/

    /**
 * 休眠
 * @param time    休眠时间，单位秒
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsSleep(time, desc = 'obsSleep') {
        return new Promise(resolve => {
            //sleep
            setTimeout(() => {
                console.log(desc, time, 's')
                resolve(time)
            }, Math.floor(Math.abs(time) * 1000))
        })
    }

    /**
 * 监测页面地址
 * @param path    页面地址片段
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsIsPage(path, time = 0, desc = 'obsHasPage') {
        return new Promise(resolve => {
            //obs page
            let page = setInterval(() => {
                if (location.href.toLowerCase().indexOf(path.toLowerCase()) > -1) {
                    clearInterval(page)
                    if (time < 0) {
                        setTimeout(() => {
                            console.log(desc, path)
                            resolve(path)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        setTimeout(() => {
                            console.log(desc, path)
                            resolve(path)
                        }, Math.abs(time) * 1000)
                    } else {
                        console.log(desc, path)
                        resolve(path)
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 监测input节点设置内容
 * @param selector    CSS选择器
 * @param text        设置的内容
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsSetValue(selector, text, time = 0, desc = 'obsSetValue') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    clearInterval(timer)
                    if (time < 0) {
                        setTimeout(() => {
                            target.value = text
                            console.log(desc, text)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        target.value = text
                        setTimeout(() => {
                            console.log(desc, text)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else {
                        target.value = text
                        console.log(desc, text)
                        resolve(selector)
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 文本框是否有值，如果传入text且不为空则比较文本框的值
 * @param selector
 * @param text
 * @param time
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsHasValue(selector, text = '', time = 0, desc = 'obsHasValue') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    clearInterval(timer)
                    if (Math.abs(time) > 0) {
                        setTimeout(() => {
                            console.log(desc, text)
                            if (!!text) {
                                if (target.value == text) {
                                    resolve(selector)
                                }
                            } else {
                                if (target.value) {
                                    resolve(selector)
                                }
                            }
                        }, Math.abs(time) * 1000)
                    } else {
                        console.log(desc, text)
                        if (!!text) {
                            if (target.value == text) {
                                resolve(selector)
                            }
                        } else {
                            if (target.value) {
                                resolve(selector)
                            }
                        }
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 监测到节点后点击
 * @param selector    CSS选择器
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsClick(selector, time = 0, desc = 'obsClick') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    clearInterval(timer)
                    if (time < 0) {
                        setTimeout(() => {
                            target.click()
                            console.log(desc, selector)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        target.click()
                        setTimeout(() => {
                            console.log(desc, selector)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else {
                        target.click()
                        console.log(desc, selector)
                        resolve(selector)
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 监测节点是否存在
 * @param selector    CSS选择器
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsHas(selector, time = 0, desc = 'obsHas') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    clearInterval(timer)
                    if (Math.abs(time) > 0) {
                        setTimeout(() => {
                            console.log(desc, selector)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else {
                        console.log(desc, selector)
                        resolve(selector)
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 监测节点是否存在然后执行函数
 * @param selector
 * @param func
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsHasFunc(selector, func, time = 0, desc = 'obsHasFunc') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    clearInterval(timer)
                    if (time < 0) {
                        setTimeout(() => {
                            if (!!func) {
                                func()
                            }
                            console.log(desc, selector)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        if (!!func) {
                            func()
                        }
                        setTimeout(() => {
                            console.log(desc, selector)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else {
                        if (!!func) {
                            func()
                        }
                        console.log(desc, selector)
                        resolve(selector)
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 监测节点内容
 * @param selector    CSS选择器
 * @param text        节点内容
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsHasText(selector, text, time = 0, desc = 'obsHasText') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target && target.textContent.trim() == text) {
                    clearInterval(timer)
                    if (time < 0) {
                        setTimeout(() => {
                            console.log(desc, text)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        setTimeout(() => {
                            console.log(desc, text)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else {
                        console.log(desc, text)
                        resolve(selector)
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 监测节点内容点击
 * @param selector    CSS选择器
 * @param text        节点内容
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsHasTextClick(selector, text, time = 0, desc = 'text') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target && target.textContent.trim() == text) {
                    clearInterval(timer)
                    if (time < 0) {
                        setTimeout(() => {
                            target.click()
                            console.log(desc, text)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else if (time > 0) {
                        target.click()
                        setTimeout(() => {
                            console.log(desc, text)
                            resolve(selector)
                        }, Math.abs(time) * 1000)
                    } else {
                        target.click()
                        console.log(desc, text)
                        resolve(selector)
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 监测节点非内容
 * @param selector    Css选择器
 * @param text        节点内容
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsNotText(selector, text, time = 0, desc = 'not text') {
        return new Promise(resolve => {
            //obs node
            let timer = setInterval(() => {
                let target = document.querySelector(selector)
                if (!!target) {
                    if (target.textContent.trim() == text) {
                        return
                    } else {
                        clearInterval(timer)
                        if (time < 0) {
                            setTimeout(() => {
                                console.log(desc, text)
                                resolve(selector)
                            }, Math.abs(time) * 1000)
                        } else if (time > 0) {
                            setTimeout(() => {
                                console.log(desc, text)
                                resolve(selector)
                            }, Math.abs(time) * 1000)
                        } else {
                            console.log(desc, text)
                            resolve(selector)
                        }
                    }
                } else {
                    return
                }
            }, 100)
            })
    }

    /**
 * 函数返回真继续执行
 * @param func    函数，返回真继续执行
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsTrueFunc(func, time = 0, desc = 'func=>true') {
        return new Promise(resolve => {
            if (!!func) {
                if (time < 0) {
                    setTimeout(() => {
                        let ret = func()
                        if (ret) {
                            console.log(desc, ret)
                            resolve('func=>true')
                        }
                    }, Math.abs(time) * 1000)
                } else if (time > 0) {
                    let ret = func()
                    setTimeout(() => {
                        if (ret) {
                            console.log(desc, ret)
                            resolve('func=>true')
                        }
                    }, Math.abs(time) * 1000)
                } else {
                    let ret = func()
                    if (ret) {
                        console.log(desc, ret)
                        resolve('func=>true')
                    }
                }
            }
        })
    }

    /**
 * 执行函数
 * @param func    函数
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsFunc(func, time = 0, desc = 'func') {
        return new Promise(resolve => {
            if (!!func) {
                if (time < 0) {
                    setTimeout(() => {
                        func()
                        console.log(desc)
                        resolve('func')
                    }, Math.abs(time) * 1000)
                } else if (time > 0) {
                    func()
                    setTimeout(() => {
                        console.log(desc)
                        resolve('func')
                    }, Math.abs(time) * 1000)
                } else {
                    func()
                    console.log(desc)
                    resolve('func')
                }
            }
        })
    }

    /**
 * 变量为真继续执行
 * @param isTrue    bool变量
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
    function obsTrue(isTrue, time = 0, desc = 'true') {
        return new Promise(resolve => {
            if (!!isTrue) {
                if (time < 0) {
                    setTimeout(() => {
                        console.log(desc, isTrue);
                        resolve(isTrue)
                    }, Math.abs(time) * 1000)
                } else if (time > 0) {
                    setTimeout(() => {
                        console.log(desc, isTrue);
                        resolve(isTrue)
                    }, Math.abs(time) * 1000)
                } else {
                    console.log(desc, isTrue);
                    resolve(isTrue)
                }
            }
        })
    }

    /**
 * 随机字符串
 * @param e  长度
 * @returns {string}
 */
    function randStr(e = 12) {
        e = e || 32;
        // let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        let t = "abcdefghijkmnprstwxyz",
            a = t.length,
            n = "";
        for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }

    /**
 * 随机数字
 * @param e  长度
 * @returns {string}
 */
    function randNum(e = 12) {
        e = e || 32;
        // let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        let t = "123456789",
            a = t.length,
            n = "";
        for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }

    /**
 * 获取当前URL地址参数
 * @param name  参数名称
 * @returns {string|null}
 */
    function getUrlParam(name) {
        let reg = new RegExp("(.|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.href.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    /**
 * 加载style样式
 * @param style  style标签内容
 */
    function addStyleEle(style = '') {
        let css = document.createElement('style')
        css.innerHTML = style
        document.body.append(css)
    }

    /**
 * 加载css文件
 * @param url  css文件地址
 */
    function loadCssFile(url) {
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }

    /**
 * 加载js代码
 * @param code
 */
    function addScriptEle(code) {
        let script = document.createElement("script");
        script.type = "text/javascript";
        try {
            // firefox、safari、chrome和Opera
            script.appendChild(document.createTextNode(code));
        } catch (ex) {
            // IE早期的浏览器 ,需要使用script的text属性来指定javascript代码。
            script.text = code;
        }
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    /**
 * 加载js文件
 * @param url  js文件路径
 * @param callback  加载成功后执行的回调函数
 */
    function loadJsFile(url, callback) {
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        if (typeof (callback) == 'function') {
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    callback();
                    script.onload = script.onreadystatechange = null;
                }
            };
        }
        head.appendChild(script);
    }

    /**
 * 向页面中添加div
 * @param className   类名
 * @param innerHtml   内容
 * @param clickFunc   点击事件函数
 * @returns {HTMLDivElement}
 */
    function addDivEle(className = '', innerHtml = '', clickFunc = false, parentSelector = '') {
        // console.log('addDivEle.className', className)
        let div = document.createElement('div')
        div.className = className
        div.innerHTML = innerHtml
        if (typeof clickFunc == 'function') {
            div.onclick = clickFunc
        }
        // console.log('addDivEle.parentSelector', parentSelector)
        if (parentSelector.length > 0) {
            document.querySelector(parentSelector).append(div)
        } else {
            document.body.append(div)
        }
        return div
    }

    /**
 * 添加工具按钮
 * @param className   按钮类名
 * @param innerHtml   按钮内容
 * @param clickFunc   按钮点击事件
 * @param param       {}
 */
    function addToolBtn(className = '', innerHtml = '', clickFunc = false, param = {}) {
        let defaultParam = {
            yAlign: 'bottom',
            xAlign: 'left',
            boxSelector: '.monkeyToolBtnBox',
            btnSelector: '.monkeyToolBtn',
            //自定义盒子样式
            boxCss: '',
            //自定义按钮样式
            btnCss: '',
        }
        param = Object.assign({}, defaultParam, param)

        if (param.boxSelector && document.querySelector(param.boxSelector) == null) {
            addDivEle(param.boxSelector.replaceAll('\\.', ' '))
            // return;
            addStyleEle(`
    ${param.boxSelector} {
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      ${param.yAlign == 'top' ? 'top:0;bottom:auto;' : 'top:auto;bottom:0;'}
      ${param.xAlign == 'left' ? 'left:0;right:auto;' : 'left:auto;right:0;align-items: flex-end;'}
      line-height: 1;
      cursor: pointer;
      z-index: 999999;
      font-size: 15px;
      ${param.boxCss}
    }
    ${param.btnSelector} {
      border: 2px solid red;
      color: red;
      padding: 5px 10px;
      background: white;
      font-size: 15px;
      ${param.btnCss}
    }
  `)
        }
        addStyleEle(`
  ${param.btnSelector}.${className} {
    cursor: pointer;
    ${param.btnCss}
  }
  `)
        addDivEle(`${param.btnSelector.replaceAll('\\.', ' ')} ${className}`, innerHtml, clickFunc, param.boxSelector)
    }

    /**
 * 移除iframe页面元素，用于wifi劫持和去除iframe广告
 */
    function removeIframe() {
        let filter = new Object();
        filter.ad = function () {
            let tar = document.getElementsByTagName('iframe');
            let len = tar.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    tar[0].remove()
                }
            }
        }
        filter.timer = function () {
            let clean = setInterval(function () {
                if (document.getElementsByTagName('iframe').length == 0) {
                    clearInterval(clean)
                    console.log('清除')
                } else {
                    filter.ad()
                }
            }, 300)
            }
        filter.timer()
    }

    /**
 * 时间格式化
 * @param fmt  格式，yyyy-MM-dd hh:mm:ss.S
 * @returns {*}   时间字符串，2006-07-02 08:09:04.423
 * @constructor
 */
    Date.prototype.format = function (fmt) { //author: meizz
        let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /**
 * 替换全部匹配到的内容
 * @param FindText  需要查找的字符串
 * @param RepText   将要替换的字符串
 * @returns {string}
 */
    String.prototype.replaceAll = function (FindText, RepText) {
        let regExp = new RegExp(FindText, "g");
        return this.replace(regExp, RepText);
    }

    /**
 * 随机获取一个元素
 * @returns {*}
 */
    Array.prototype.sample = function () {
        return this[Math.floor(Math.random() * this.length)]
    }

    /*====== 结束：辅助函数 ======*/
    /*====== 你的代码 ======*/
})();