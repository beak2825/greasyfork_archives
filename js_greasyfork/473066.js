// ==UserScript==
// @name         adarkroomGM悬浮菜单
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  在网页右上角创建悬浮点击菜单，当菜单太长时添加上一页和下一页按钮，每个菜单项添加点击事件
// @author       烽火
// @match        *://*/?lang=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473066/adarkroomGM%E6%82%AC%E6%B5%AE%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/473066/adarkroomGM%E6%82%AC%E6%B5%AE%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建菜单元素
    var menu = document.createElement('div');
    menu.innerText = '菜单'; // 菜单文本
    menu.style.backgroundColor = 'blue'; // 菜单背景颜色
    menu.style.color = 'white'; // 菜单字体颜色
    menu.style.position = 'fixed'; // 菜单定位方式
    menu.style.top = '10px'; // 距离网页顶部的距离
    menu.style.right = '10px'; // 距离网页右侧的距离
    menu.style.padding = '10px'; // 菜单内边距
    menu.style.borderRadius = '50%'; // 菜单圆角
    menu.style.cursor = 'pointer'; // 鼠标样式

    // 创建菜单列表元素及上一页/下一页按钮

    var menuList = document.createElement('ul');// 创建菜单列表元素

    // 设置菜单列表元素的样式属性
    menuList.style.position = 'fixed'; // 设置为固定定位，相对于浏览器窗口固定位置
    menuList.style.top = '40px'; // 设置距离页面顶部的位置为 40px
    menuList.style.right = '0'; // 设置距离页面右边缘的位置为 0
    menuList.style.backgroundColor = '#f1f1f1'; // 设置菜单列表的背景颜色为 #f1f1f1
    menuList.style.padding = '10px'; // 设置菜单列表的内边距为 10px
    menuList.style.borderRadius = '5px'; // 设置菜单列表的边框圆角为 5px
    menuList.style.display = 'none'; // 初始隐藏菜单列表，即不显示菜单列表


    // 定义菜单项
    var menuItems = [
        { title: '添加木头', action: function() { tjmt(); } },
        { title: '添加布料', action: function() { tjbl(); } },
        { title: '添加毛皮', action: function() { tjmp(); } },
        { title: '添加火把', action: function() { tjhb(); } },
        { title: '添加熏肉', action: function() { tjxr(); } },
        { title: '添加牙齿', action: function() { tjyc(); } },
        { title: '添加皮革', action: function() { tjpg(); } },
        { title: '添加符咒', action: function() { tjfz(); } },
        { title: '添加肉', action: function() { tjr(); } },
        { title: '添加诱饵', action: function() { tjre(); } },
        { title: '添加鳞片', action: function() { tjlp(); } },
        { title: '添加罗盘', action: function() { tjluop(); } },
        { title: '添加骨枪', action: function() { tjgq(); } },
        { title: '添加药剂', action: function() { tjyj(); } },
        { title: '添加', action: function() { tj(); } },
        { title: '添加', action: function() { tj(); } },
        { title: '添加', action: function() { tj(); } },
        { title: '添加', action: function() { tj(); } },
        { title: '添加', action: function() { tj(); } },
        { title: '添加0', action: function() { tj(); } }
    ];

    // 显示指定页的菜单项
    function displayMenuItems(page) {
        menuList.innerHTML = '';
        // 遍历每个菜单项
        for (var i = (page - 1) * 10; i < page * 10 && i < menuItems.length; i++) {
            var menuItem = document.createElement('li');// 创建一个新的菜单项元素
            menuItem.innerText = menuItems[i].title;// 设置菜单项的文本内容
            menuItem.addEventListener('click', menuItems[i].action);// 为菜单项添加点击事件处理程序
            menuList.appendChild(menuItem);// 将菜单项添加到菜单列表中
        }
    }

    // 添加上一页按钮
    var prev = document.createElement('button');
    prev.innerText = '上一页';
    prev.disabled = true; // 初始禁用上一页按钮
    prev.addEventListener('click', function() {
        currentPage--;
        if (currentPage === 1) {
            prev.disabled = true;
        }
        next.disabled = false;
        displayMenuItems(currentPage);//显示菜单项

        //不添加以下代码按下一页后无法再翻页
        menuList.appendChild(prev);//上一页按钮
        menuList.appendChild(next);//下一页按钮
        document.body.appendChild(menuList);//将翻页按钮添加到菜单项下
    });

    // 添加下一页按钮
    var next = document.createElement('button');
    next.innerText = '下一页';
    next.disabled = menuItems.length <= 5 ? true : false; // 菜单项数量小于等于5时，禁用下一页按钮
    next.addEventListener('click', function() {
        currentPage++;
        if (currentPage === totalPages) {
            next.disabled = true;
        }
        prev.disabled = false;
        displayMenuItems(currentPage);//显示菜单项

        //不添加以下代码按下一页后无法再翻页
        menuList.appendChild(prev);//上一页按钮
        menuList.appendChild(next);//下一页按钮
        document.body.appendChild(menuList);//将翻页按钮添加到菜单项下
    });

    // 将所有菜单项添加到菜单元素中
    var currentPage = 1;
    var totalPages = Math.ceil(menuItems.length / 5);
    
    if (currentPage === totalPages) { // 菜单项数量小于等于5时，禁用下一页按钮
        next.disabled = true;
    }
    displayMenuItems(currentPage);//显示菜单项
    //console.log(totalPages);// 调试输出菜单项数量

    // 添加菜单列表及按钮到页面中
    menuList.appendChild(prev);//上一页按钮
    menuList.appendChild(next);//下一页按钮
    document.body.appendChild(menu);//菜单项
    document.body.appendChild(menuList);//将翻页按钮添加到菜单项下

    // 添加菜单点击事件监听器
    var isMenuShown = false;
    menu.addEventListener('click', function() {
        isMenuShown = !isMenuShown;
        menuList.style.display = isMenuShown ? '' : 'none';
    });

    //添加木头函数
    function tjmt(){
        //添加木头代码
        $SM.add('stores.wood', 5000);
    };
    //添加布料函数
    function tjbl(){
        //添加布料代码
        $SM.add('stores.cloth', 1000);
    };
    //添加毛皮函数
    function tjmp(){
        //添加毛皮代码
        $SM.add('stores.fur', 1000);
    };
    //添加火把函数
    function tjhb(){
        //添加火把代码
        $SM.add('stores.torch', 1000);
    };
    //添加熏肉函数
    function tjxr(){
        //添加熏肉代码
        $SM.add('stores.cured meat', 5000);
    };
    //添加牙齿函数
    function tjyc(){
        //添加牙齿代码
        $SM.add('stores.teeth', 1000);
    };
    //添加皮革函数
    function tjpg(){
        //添加皮革代码
        $SM.add('stores.leather', 1000);
    };
    //添加符咒函数
    function tjfz(){
        //添加符咒代码
        $SM.add('stores.charm', 1000);
    };
    //添加肉函数
    function tjr(){
        //添加肉代码
        $SM.add('stores.meat', 1000);
    };
    //添加诱饵函数
    function tjre(){
        //添加诱饵代码
        $SM.add('stores.bait', 1000);
    };
    //添加鳞片函数
    function tjlp(){
        //添加鳞片代码
        $SM.add('stores.scales', 1000);
    };
    //添加罗盘函数
    function tjluop(){
        //添加罗盘代码
        $SM.add('stores.compass', 1000);
    };
    //添加骨枪函数
    function tjgq(){
        //添加骨枪代码
        $SM.add('stores.bone spear', 1000);
    };
    //添加药剂
    function tjyj(){
        //添加骨枪代码
        $SM.add('stores.medicine', 1000);
    };
})();