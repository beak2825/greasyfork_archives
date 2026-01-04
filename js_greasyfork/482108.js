// ==UserScript==
// @name         收藏文章
// @version      1.0
// @description  收藏CSDN的文章到自己的collectwebsite上
// @author       caicaidexioabai
// @match        https://blog.csdn.net/*/article/details/*
// @icon         http://123.60.132.97/favicon.ico
// @license MIT
// @namespace https://greasyfork.org/users/1197712
// @downloadURL https://update.greasyfork.org/scripts/482108/%E6%94%B6%E8%97%8F%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/482108/%E6%94%B6%E8%97%8F%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 分类列表
    var categoryList = [];
    // 收藏图标对象
    var collect_a = {};
    // 获取当前网页的域名
    var currentDomain = window.location.hostname;
    // 定义要匹配的目标域名
    var targetDomain = "blog.csdn.net";
    // 构建正则表达式
    var domainPattern = new RegExp("^" + targetDomain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i");
    // 进行匹配
    var isValid = domainPattern.test(currentDomain);

    // 输出结果
    if (isValid) {
        csdn_create_icon();
    } else {
        console.log("当前域名不匹配。");
    }
    // 只对csdn有效的收藏图标
    function csdn_create_icon(){
        // 创建a标签
        collect_a = document.createElement('a');
        // 添加页面原生的css样式
        collect_a.className = 'option-box';
        // 创建a标签的内容和属性
        collect_a.href = '#';
        // 创建span标签
        var collect_span = document.createElement('span');
        // 添加页面原生的css样式以及style="display:flex;opacity:100;"
        collect_span.className = 'show-txt';
        collect_span.style.display='flex';
        collect_span.style.opacity= 1;
        // 文本内容
        collect_span.textContent = '收藏';
        // 将span追加到a标签中
        collect_a.appendChild(collect_span);
        // 获取页面 类名为csdn-side-toolbar 的div标签
        var page_div = document.querySelector('.csdn-side-toolbar');
        // 在具有指定类名的元素后面追加新的 div 元素
        // 获取容器中的所有a标签
        var links = page_div.querySelectorAll('a');
        // 获取最后一个a标签
        var lastLink = links[links.length - 1];
        // 在最后一个a标签后面追加新的 div 元素
        lastLink.parentNode.insertBefore(collect_a, lastLink.nextSibling);


    }



    // 创建表单容器
    var page_container = document.querySelector('.main_father');
    var formContainer = document.createElement('div');


    document.body.appendChild(formContainer);

    var inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '20px'; // 增加底边距
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column';
    inputContainer.style.textAlign = 'left';
    inputContainer.style.gap='10px';

    var usernameRow = document.createElement('div');
    usernameRow.style.display = 'flex';
    usernameRow.style.gap='10px';
    var usernameLabel = document.createElement('label');
    usernameLabel.textContent = '用户名：';

    var usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.placeholder = '请输入用户名';
    usernameInput.style.padding = '8px'; // 增加内边距

    usernameRow.appendChild(usernameLabel);
    usernameRow.appendChild(usernameInput);



    var passwordRow = document.createElement('div');
    passwordRow.style.display = 'flex';
    passwordRow.style.gap='10px';

    var passwordLabel = document.createElement('label');
    passwordLabel.textContent = '密码：';

    var passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = '请输入密码';
    passwordInput.style.padding = '8px'; // 增加内边距

    passwordRow.appendChild(passwordLabel);
    passwordRow.appendChild(passwordInput);
    // 错误提示
    var errorMessage = document.createElement('div');
    errorMessage.style.color = '#ff0000';
    errorMessage.style.marginTop = '5px';

    inputContainer.appendChild(usernameRow);
    inputContainer.appendChild(passwordRow);
    inputContainer.appendChild(errorMessage);

    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex'; // 设置为弹性布局
    buttonContainer.style.gap = '10px'; // 设置按钮之间的间距

    var loginButton = document.createElement('button');
    loginButton.textContent = '登录';
    loginButton.style.padding = '10px 20px'; // 增加内边距
    loginButton.style.backgroundColor = '#007bff'; // 浅蓝色
    loginButton.style.color = '#fff'; // 文字颜色为白色
    loginButton.style.border = 'none'; // 去除边框
    loginButton.style.borderRadius = '5px'; // 圆角
    loginButton.style.cursor = 'pointer'; // 添加指针样式
    loginButton.onclick = submitForm

    var closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.padding = '10px 20px'; // 增加内边距
    closeButton.style.backgroundColor = '#4caf50'; // 绿色
    closeButton.style.color = '#fff'; // 文字颜色为白色
    closeButton.style.border = 'none'; // 去除边框
    closeButton.style.borderRadius = '5px'; // 圆角、
    closeButton.style.cursor = 'pointer'; // 添加指针样式
    closeButton.onclick = submitClose

    buttonContainer.appendChild(loginButton);
    buttonContainer.appendChild(closeButton);

    formContainer.style.position = 'fixed';
    formContainer.style.top = '50%';
    formContainer.style.left = '50%';
    formContainer.style.transform = 'translate(-50%, -50%)';
    formContainer.style.display = 'none';
    formContainer.style.flexDirection = 'column';
    formContainer.style.alignItems = 'center';
    formContainer.style.justifyContent='center';
    formContainer.style.backgroundColor = '#f0f0f0'; // 浅灰色背景
    formContainer.style.padding = '20px';
    formContainer.style.borderRadius = '8px';
    formContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    formContainer.style.width = '400px';
    formContainer.style.height = '250px';
    formContainer.style.zIndex = '10000'; // 设置 z-index

    formContainer.appendChild(inputContainer);
    formContainer.appendChild(buttonContainer);


    // 分类下拉框
    // 创建下拉框
    // 创建表单元素
    var form = document.createElement('form');
    form.style.backgroundColor = '#f0f0f0'; // 浅灰色背景
    form.setAttribute('id', 'dynamic-form');

    // 创建分类名称标签和下拉框的容器
    var selectContainer = document.createElement('div');
    selectContainer.style.display = 'flex';
    selectContainer.style.alignItems = 'center'; // 垂直居中

    // 创建分类名称标签
    var nameLabel = document.createElement('label');
    nameLabel.textContent = '选择分类:';
    nameLabel.style.marginBottom = '10px'; // 调整下边距
    selectContainer.appendChild(nameLabel);

    // 创建下拉框
    var selectBox = document.createElement('select');
    selectBox.id = 'categorySelect';
    // 可以根据需要添加下拉框的选项






    // 将下拉框添加到容器中
    selectContainer.appendChild(selectBox);

    // 将容器添加到表单中
    form.appendChild(selectContainer);

    // 创建按钮容器
    var select_buttonContainer = document.createElement('div');
    select_buttonContainer.style.display = 'flex';
    select_buttonContainer.style.justifyContent = 'center'; // 水平居中
    select_buttonContainer.style.marginTop = '15px'; // 间距

    // 创建收藏按钮
    var submitButton = document.createElement('button');
    submitButton.textContent = '收藏';
    submitButton.style.marginRight = '10px';
    submitButton.addEventListener('click', function() {
        // 在这里可以添加收藏按钮的点击事件处理逻辑
        // 获取下拉框元素
        var dropdown = document.getElementById('categorySelect');
        // 获取标题标签
        var h1Element = document.getElementById('articleContentId');
        // 获取元素的内容
        var content = h1Element.textContent || h1Element.innerText;

        // 定义添加文章的对象
        var addArticle = {
            title:content,
            content:'来自CSDN友情提供，赞赞赞！',
            categoryId:dropdown.value,
            state:'已发布',
            url:window.location.href,
            urlState:'有',
        }
        // 定义formdata参数
        const fd = new FormData()
        fd.append('title', addArticle.title);
        fd.append('content', addArticle.content);
        fd.append('categoryId', addArticle.categoryId);
        fd.append('state', addArticle.state);
        fd.append('url', addArticle.url);
        fd.append('urlState', addArticle.urlState);
        fd.append('coverImg', '');

        console.log(fd);
        // 发送发布文章请求
        // CSDN提供的CORS代理服务
        //const corsProxyUrl = 'https://cors.bridged.cc/';
        //const push_article_url = 'http://localhost:8080/api/article';
        const push_article_url = 'http://123.60.132.97:8080/api/article';
        fetch(push_article_url,{
            method: 'POST',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('token')).data
            },
            referrerPolicy: 'no-referrer', // 设置 Referrer Policy
            body: fd,
        },true).then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
            .then(data => {
            // 登录失败
            if(data.code !== 0){
                errorMessage.textContent =data.message;
            }else{

                alert('收藏成功');
            }

        })
            .catch(error => {
            console.error('fetch 操作出现问题:', error);
        });

    });

    // 将按钮添加到按钮容器中
    select_buttonContainer.appendChild(submitButton);

    // 创建关闭按钮
    var select_closeButton = document.createElement('button');
    select_closeButton.textContent = '关闭';
    select_closeButton.addEventListener('click', function() {
        // 在这里可以添加关闭按钮的点击事件处理逻辑
        // 隐藏整个表单
        form.style.display = 'none';

    });

    // 将按钮添加到按钮容器中
    select_buttonContainer.appendChild(select_closeButton);

    // 将按钮容器添加到表单中
    form.appendChild(select_buttonContainer);

    // 将表单添加到页面中
    document.body.appendChild(form);

    // 动态创建和添加样式
    var dynamicStyle = document.createElement('style');
    dynamicStyle.textContent = `
    #dynamic-form {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      max-width: 300px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      width:300px;
      height:150px;
      z-index:10000;

    }

    label {
      margin-bottom: 5px; /* 调整下边距 */
      width:100px;
    }

    select {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }

    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #45a049;
    }
  `;

    // 将动态样式添加到 head 元素中
    document.head.appendChild(dynamicStyle);
    form.style.display = 'none';

    function submitClose(){
        formContainer.style.display = 'none';
        // 调整背景透明度
        page_container.style.backgroundColor = 'rgba(245, 246, 247, 1)';
    }

    // JavaScript 表单提交逻辑
    async function submitForm() {
        // 正则表达式
        var usernameRegex = /^\S{1,10}$/;
        var passwordRegex = /^\S{6,15}$/;
        // 获取输入框的内容
        var usernameValue = usernameInput.value;
        var passwordValue = passwordInput.value;

        // 验证用户名
        if (!usernameRegex.test(usernameValue)) {
            errorMessage.textContent ='用户名格式错误，请输入1到10个非空字符';
        }
        // 验证密码
        else if (!passwordRegex.test(passwordValue)) {
            errorMessage.textContent ='密码格式错误，请输入6到15个非空字符';
        }else{
            // 清空错误信息
            errorMessage.textContent = '';
            // 登录
            // 创建一个FormData的对象
            const formData = new FormData()
            formData.append('username', usernameValue)
            formData.append('password', passwordValue)
            // 登录url
            // CSDN提供的CORS代理服务
            const corsProxyUrl = 'https://cors.bridged.cc/';
            const login_url = 'http://123.60.132.97:8080/api/user/login';
            //const login_url = 'http://localhost:8080/api/user/login';
            // 发送登录的请求
            await fetch(login_url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                referrerPolicy: 'no-referrer', // 设置 Referrer Policy
                body: new URLSearchParams(formData).toString()
            }).then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.json();
            },true)
                .then(data => {
                // 登录失败
                if(data.code !== 0){
                    errorMessage.textContent =data.message;
                }else{
                    // 将token存储本地
                    try {
                        localStorage.setItem('token', JSON.stringify({time:Date.now(),data:data.data}));
                        console.log('Token存储成功');
                        errorMessage.textContent = '登录成功！！！';
                        // 等待两秒显示分类表单
                        setTimeout(()=>{
                            // 关闭登录表单
                            formContainer.style.display = 'none';
                            // 开启分类的表单
                            form.style.display = 'flex';
                            // 发送获取分类列表的请求
                            sendCategoryList(JSON.parse(localStorage.getItem('token')).data)
                        },2000);

                    } catch (error) {
                        console.error('token存储异常:', error);
                    }
                }

            })
                .catch(error => {
                console.error('fetch 操作出现问题:', error);
            });





        }

    }

    // 给collect_a标签绑定事件
    collect_a.addEventListener('click',function(){

        // 先获取本地存储
        var token = JSON.parse(localStorage.getItem('token'));
        // 判断是否登录
        if(!token){
            // 没登录
            // 弹出登录的form表单
            formContainer.style.display = 'flex';
            page_container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        }else if(Date.now() - token.time > 1000 * 3600){
            // token过期了，有效时长为1小时
            // 弹出登录的form表单
            formContainer.style.display = 'flex';
            page_container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        }else{
            form.style.display = 'flex';

            // 发送获取分类列表的请求
            console.log(token.data);
            sendCategoryList(token.data);

        }
    })
    // 发送获取分类列表的请求
    function sendCategoryList(tokenData){
        // CSDN提供的CORS代理服务
        //const corsProxyUrl = 'https://cors.bridged.cc/';
        //const category_info_url = 'http://localhost:8080/api/category';
        const category_info_url = 'http://123.60.132.97:8080/api/category';
        fetch(category_info_url,{
            method: 'GET',
            headers: {
                'Authorization': tokenData
            },
            referrerPolicy: 'no-referrer' // 设置 Referrer Policy
        },true).then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
            .then(data => {
            // 登录失败
            if(data.code !== 0){
                errorMessage.textContent =data.message;
            }else{


                categoryList = data.data;
                // 如果有选项了，先清除
                while (selectBox.firstChild) {
                    selectBox.removeChild(selectBox.firstChild);
                }
                // 获取select标签，根据返回值创建选项
                for (var i = 0; i < categoryList.length; i++) {

                    var option = document.createElement('option');
                    option.value = categoryList[i].id;
                    option.text = categoryList[i].categoryName;
                    selectBox.appendChild(option);
                }
            }

        })
            .catch(error => {
            console.error('fetch 操作出现问题:', error);
        });
    }






})();