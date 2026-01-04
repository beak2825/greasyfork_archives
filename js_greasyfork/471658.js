// ==UserScript==
// @name         超星图文数据共享(cjwk)
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  把页面上的部分信息抽取成JSON并放入剪切板,参考文件直接粘贴源数据，无需处理。
// @author       Ade
// @license      MIT
// @match        https://qikan.chaoxing.com/detail_*
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-1.11.min.js
// @downloadURL https://update.greasyfork.org/scripts/471658/%E8%B6%85%E6%98%9F%E5%9B%BE%E6%96%87%E6%95%B0%E6%8D%AE%E5%85%B1%E4%BA%AB%28cjwk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471658/%E8%B6%85%E6%98%9F%E5%9B%BE%E6%96%87%E6%95%B0%E6%8D%AE%E5%85%B1%E4%BA%AB%28cjwk%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('进入插件')
    class InitMethods {
        constructor(){
            this.imgList = []// 假设给定的数组名为data，包含多个对象，每个对象有imgurl和title属性
            this.newImageData = []// 定义一个空数组用于存储上传后的图片对象
        }
        //获取图文原始数据源
        getBasicData(){
            this.imgList = [];
            let dl =  $('.clearfix.articleImg dl');
            if(!dl.length){
               alert('暂无可复制数据')
               return $('.cjwk_copy_btn_img').hide()//没有图文不显示复制按钮
            }
             $("#overlay, #popup").fadeIn();
            let _this = this;//在 JavaScript 中，each 方法无法直接访问构造函数（constructor）中的 this,下面如果使用箭头函数那么jq的$就失效,就是上下文的问题
            dl.each(function() {
                let url = $(this).find('img').attr('src');
                let text = $(this).find('a').text();
                let imgObj = {};
                imgObj.imgurl = url;
                imgObj.title = text;
                _this.imgList.push(imgObj);
                //处理本地数据异步问题，数据抓取完成再执行上传
                if(_this.imgList.length==dl.length){
                    console.log('原始数据：',_this.imgList)
                    _this.asyncNewImg();
                }
            });
        }
        getDirectoryData(){
            // 获取菜单的HTML代码
            // const menuElement = document.querySelector('.muluBox');
            //const menuListNode = menuElement.querySelector('ul');
            //const menuListNode = $('.muluBox>ul')
            const menuList = $('.muluBox>ul>li');

            const menuData = { data: { menus: [] } };

            for (let i = 0; i < menuList.length; i++) {
                const menuItem = menuList[i];
                const link = menuItem.querySelector('a');
                const menuText = link.innerText.trim();

                let currentMenu = null;

                if (menuItem.querySelector('ul')) {
                    // Parent menu item with sub-menu
                    const subMenuItems = menuItem.querySelectorAll('ul > li');
                    const menuChildren = [];

                    for (let j = 0; j < subMenuItems.length; j++) {
                        const subMenuItem = subMenuItems[j];
                        const subLink = subMenuItem.querySelector('a');
                        const subMenuText = subLink.innerText.trim();

                        menuChildren.push({ text: subMenuText });
                    }

                    currentMenu = { text: menuText, children: menuChildren };
                } else {
                    // Single menu item
                    currentMenu = { text: menuText };
                }

                menuData.data.menus.push(currentMenu);
            }
            //const _menuData = {
           //   data:{
            //    menus:Array.from(new Set(menuData.data.menus))
           //   }
           // };
             GM_setClipboard(JSON.stringify(menuData), 'text');
            alert('目录数据处理成功,已复制')
            console.log(menuData)
            return JSON.stringify(menuData);

        }

        //定义一个函数用于上传图片并返回服务地址
        uploadImage(imgurl) {
            // 返回一个Promise对象，模拟异步操作
            return new Promise((resolve, reject)=> {
                // 创建一个FormData对象，用于发送图片数据
                let formData = new FormData();
                formData.append('fileUrl', imgurl);

                // 创建一个XMLHttpRequest对象
                let xhr = new XMLHttpRequest();

                // 监听上传过程的状态变化
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            // 图片上传成功，解析返回的服务地址
                            let response = JSON.parse(xhr.responseText);
                            let serviceUrl = response.fileName;

                            // 将服务地址传递给Promise对象的回调函数
                            resolve(serviceUrl);
                        } else {
                            // 图片上传失败，将错误信息传递给Promise对象的回调函数
                            reject(xhr.statusText);
                        }
                    }
                };

                // 打开一个POST请求，将图片数据发送到上传接口
                xhr.open('POST', 'https://wkapi.cjwk.cn/show/common/applyByUrl');
                // 发送FormData对象
                xhr.send(formData);
            });
        }
        //异步改为同步处理网络图片，确保图片顺序一致
        async asyncNewImg() {
            if(this.newImageData.length>0){
                console.error('兄弟，慢点搞，服务器顶不住')
            }
            this.newImageData = [];
            for (let i = 0; i < this.imgList.length; i++) {
                try {
                    const serviceUrl = await this.uploadImage(this.imgList[i].imgurl);

                    let newImage = {
                        serviceUrl: serviceUrl,
                        title: this.imgList[i].title
                    };

                    this.newImageData.push(newImage);

                    if (this.newImageData.length === this.imgList.length) {
                        $("#overlay, #popup").fadeOut();
                        GM_setClipboard(JSON.stringify(this.newImageData), 'text');
                        console.log(this.newImageData)
                        setTimeout(()=>{alert('图文数据处理成功,已复制')},500)
                    }
                } catch (error) {
                    alert('上传接口服务异常，多次尝试无果可联系危桑老师')
                    console.error('危桑，图片上传失败咋办:', error);
                }
            }
        }
        //创建自定义弹窗样式区域
        setCssDom_Fn(){
            //<button class='cjwk_copy_btn_all' title='复制图文和参考文献'>复制图文和参考文献</button>
			let _copy = `<div class='btn_warp'>
                             <button class='cjwk_copy_btn_men' title='复制目录'>复制目录</button>
                             <button class='cjwk_copy_btn_img' title='复制图片和标题'>复制图文</button>
                             <button class='cjwk_copy_btn_cat' title='复制参考文献'>复制参考文献</button>
                             <button class='cjwk_copy_btn_authorsUnit' title='复制作者单位'>复制作者单位</button>
                        </div>`;
			$('.readMulu').append(_copy);
			// 创建一个 <style> 元素
			var style = document.createElement('style');
			style.type = 'text/css';

			// 定义 CSS 样式
			var css = `
			/* 在这里编写你的 CSS 样式 */
			 #overlay {
			 position: fixed;
			 top: 0;
			 left: 0;
			 height: 100%;
			 width: 100%;
			 background-color: rgba(0, 0, 0, 0.5);
			 display: none;
		   }

		   #popup {
			 position: fixed;
			 top: 50%;
			 left: 50%;
			 transform: translate(-50%, -50%);
			 background-color: #fff;
			 padding: 20px;
			 box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
			 display: none;
		   }

		   #popup h2 {
			 margin-top: 0;
			 color:green;
			   -webkit-animation: flash 1s linear infinite;
			 animation: flash 1s linear infinite;
		   }

		   #closeBtn {
			 margin-top: 10px;
		   }
		   .btn_warp{
				position: fixed;
                display:flex;
                flex-direction: column;
				left: 280px;
				top: 43%;
		   }
           .btn_warp>button{
              	background-color: #f98c51;
				display: inline-block;
				height: 32px;
				width: auto;
				padding: 0 10px;
				font-size: 14px;
				text-indent: 0;
				text-align: center;
				color: #fff;
				line-height: 32px;
				font-family: Microsoft Yahei,serif;
				border-radius: 4px;
				overflow: visible;
				cursor:pointer;
				border:1px solid #ccc;
                margin-bottom:10px;
           }

           button.cjwk_copy_btn_img{
                background-color: #596adf;
           }
           button.cjwk_copy_btn_cat{
                background-color: #d759df;
           }
		   @-webkit-keyframes flash {
			 0% {
			   opacity: 1;
			 }
			 50% {
			   opacity: 0.1;
			 }
			 to {
			   opacity: 1;
			 }
		   }
		   @keyframes flash {
			 0% {
			   opacity: 1;
			 }
			 50% {
			   opacity: 0.1;
			 }
			 to {
			   opacity: 1;
			 }
		   }
		  `;

			// 将 CSS 样式添加到 <style> 元素中
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			// 将 <style> 元素插入到页面的 <head> 中
			document.head.appendChild(style);
		   let alertDom = `<button id="openBtn">打开弹窗</button>
			 <div id="overlay"></div>
			 <div id="popup">
			 <h2>疯狂处理中，请稍后......</h2>
			 </div>`
			$('body').append(alertDom);
		}
        //获取参考文献
        getLiteratureData(type=0){
            var result = '';
            var startElement = $('[data-meta-name="参考文献"]').length?$('[data-meta-name="参考文献"]'):$('[class="reference"]');
            var endElement = $('.title_translate');
            var currentElement = startElement.next(); // 获取下一个兄弟元素
            while (currentElement.length && !currentElement.is(endElement)) {
                result += currentElement.text().trim() + '\n'; // 获取文本内容并添加换行符
                currentElement = currentElement.next(); // 获取下一个兄弟元素
            }
            GM_setClipboard(result, 'text');
            if(result.length){
                 alert('文献数据处理成功,已复制')
                 console.log(result)
            }else{
                 alert('err,数据处理失败，请联系管理员')
            }
            return result||''
            let texts = [];
            if(type){ //默认只获取 [x] 这种开头的参考文献
                const regex = /^\[\d+\].*$/;
                $("p.content[name^='ref']")?.map(function() {
                    let text = $(this).text();
                    //return text.match(regex) ? text : ""+'\n';
                    if(text.match(regex)){
                      //texts+=text+'\n';
                      texts.push(text);
                    }
                }).get();
            }else{ //这是全部参考文献
                $("p.content[name^='ref']")?.map(function(item,index) {
                  texts.push($(this).text());
                }).get();
            }
            const _texts = Array.from(new Set(texts))?.join('\n')
            GM_setClipboard(_texts, 'text');
            alert('文献数据处理成功,已复制')
            console.log(texts)
            return _texts||''
        }
        parseArticlesAuthorsUnit() {
            let author_querySelector_1 = document.querySelectorAll('.F_name sup');
            let author_querySelector_2 = document.querySelectorAll('.F_name')[0];
            let unit_querySelector_1 = document.querySelectorAll('.Fmian1 td:nth-child(2) sup');
            let unit_querySelector_2 = document.querySelectorAll('.Fmian1 td:nth-child(2)')[0];
            let authorElements = author_querySelector_1.length?author_querySelector_1:[author_querySelector_2];
            let unitElements = unit_querySelector_1.length?unit_querySelector_1:[unit_querySelector_2];

            function isSignal(arr){//判断作者名是否包含，
                let newAuthorName = [],authorName = '';
                for (let i = 0; i < arr.length; i++) {
                    if(arr[i].innerText.includes(',')||arr[i].innerText.includes('，')){//三种情况，一个作者多个单位，多个作者多个单位，多个作者一个单位
                        let cn_en_str = ','
                        if(arr[i].innerText.includes(',')){
                            cn_en_str = ','
                        }else{
                            cn_en_str = '，'
                        }
                        newAuthorName = [...newAuthorName,...splitauth(arr[i],cn_en_str)]
                    }else{
                        let obj = {
                            authorName:getName(arr[i]),
                            serial:Number(arr[i].innerText)||1//单位标记,
                        }
                        newAuthorName.push(obj)
                    }
                }
                return newAuthorName;
            }

            function getName(str){//获取字符值

                const _str = str?.previousSibling?.nodeValue?.replace(/，/g,"").trim()
                return _str?_str:str.innerText;
            }

            function splitauth(str,emblem){//存在作者-单位一对多，作者-单位多对一，需要拆分作者
                let arr = [],_str = str.innerText?.split(emblem);
                for(let i=0;i<_str.length;i++ ){
                    let obj = {
                        authorName: emblem=='，'?_str[i]?.trim():getName(str),
                        serial:emblem=='，'?1:Number(_str[i])//作者标记
                    }
                    arr.push(obj)
                }
                return arr
            }
            function unitElementsEnums(params) {//单位枚举
                const arr = [];
                for (let i = 0; i < params?.length; i++) {
                    let unit = params[i]?.nextSibling?.nodeValue?.replace(/；/g,"")?.trim();
                    let obj = {
                        unitName: unit?unit:params[i]?.innerText,
                        serial:i+1//单位标记
                    }
                    arr.push(obj)
                }
                return arr;
            }

            function combinationData() {//数据组合
                const authors = isSignal(authorElements);//作者拆分后枚举
                const units = unitElementsEnums(unitElements);//单位枚举
                const newArrs = {
                    "articlesAuthors": []
                };//新数据
                for (let i = 0; i < authors.length; i++) {
                    let unitsName = '';
                    for (let j = 0; j < units.length; j++) {
                        if(authors[i].serial == units[j].serial){
                            unitsName = units[j].unitName;
                            break;
                        }
                    }
                    newArrs.articlesAuthors.push({
                        "authorName": authors[i].authorName,
                        "unitsName": unitsName
                    })
                }
                return newArrs;
            }
            const _texts = {"data":combinationData()};
            if(_texts?.data?.articlesAuthors?.length){
                GM_setClipboard(JSON.stringify(_texts), 'text');
                alert('作者单位数据处理成功,已复制')
            }else{
                alert('操作失败，请检查是否有原始数据')
            }
            console.log(_texts)
        }
    }
    //实例化插件
    const _initMethods = new InitMethods();
    //初始插件按钮相关
    _initMethods.setCssDom_Fn();
    //复制目录
    $('.cjwk_copy_btn_men').click(function(){
       _initMethods.getDirectoryData();
    })
     //复制原始图文数据
    $('.cjwk_copy_btn_img').click(function(){
      _initMethods.getBasicData();
    })
    //复制参考文献
    $('.cjwk_copy_btn_cat').click(function(){
       _initMethods.getLiteratureData();
    })
    //复制参考作者单位
    $('.cjwk_copy_btn_authorsUnit').click(function(){
       _initMethods.parseArticlesAuthorsUnit();
    })
	console.error('---------- 请给我们这些普通程序员多一点鼓励 ----------')
})();