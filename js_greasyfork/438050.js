// ==UserScript==
// @name         SYUCT沈阳化工大学教务系统助手
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  教务系统自动填写账号密码，按下回车一键自动评教，iframe框架内显示看板娘功能
// @author       Yuhang Shang
// @match        *://*.syuct.edu.cn/*
// @icon         https://www.shangyuhang.icu/favicon/64_64.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438050/SYUCT%E6%B2%88%E9%98%B3%E5%8C%96%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438050/SYUCT%E6%B2%88%E9%98%B3%E5%8C%96%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //使用帮助
    //在使用脚本按键前：请先点击评教页面表格任意位置，使脚本能够获取焦点
    //按下回车键自动填写教师评价（随机一行是良好，其余行均为优秀）
    //如果您是采用复制粘贴代码的方式添加此脚本，这并不会影响脚本的任何功能，但是您可能无法接收到代码新版本的更新提醒，因此建议您从GreasyFork（油叉）上搜索并安装此脚本

    //=======================================
    //    请在此填写您的账号和密码
    //=======================================
    var your_username='你的账号';//此处填写你的学号
    var your_password='你的密码';//此处填写你的密码
    var op = true;//true表示原神启动，false表示不启动原神

    //全局变量
    var StudentLoginURL='default2.aspx';//学生登录页面url
    var iiframe;//用来获取内部iframe框架的变量
    var girl_link;//存储引入桌宠项目所需添加的link元素
    var girl_script;//存储引入桌宠项目所需添加的script元素
    var randNum;//随机数

    //键盘监听事件
    document.addEventListener('keydown', my);
    function my(e){
        if(e.keyCode==13){
            write();
        }
    }

    //自动评价功能
    function write(){
        //此时我默认前两列是大写，后面的列数都为小写，如果有4列以上的评教结构且非此规则的话，请告知我
        //查找有多少行
        let rows=document.querySelector('#DataGrid1').rows.length-1;
        //查找有多少列（减去前三列非填写项，2列大写情况）
        let colums = document.querySelector('#DataGrid1').rows[0].cells.length-3;
        //判断是单列评教还是多列评教
        if(colums == 1){
            singleWrite(rows,colums);
        }
        else{
            binaryWrite(rows,colums);
        }

        //随机一行为良好的备用代码
        //var final=document.getElementById('DataGrid1__ctl2_JS1');
        //final.value='良好';
        //点击保存按钮
        document.querySelector('#Button1').click();
    }

    //多列评教
    //二重循环遍历行列
    //要两次遍历，因为学校系统很愚蠢的第三列第四列又变为小写规则编号命名，我不理解
    function binaryWrite(rows,colums){
        //第一次遍历行列，大写形式
        for(let j=1;j<=2;j++){
            //先将所有行全填为优秀
            for(let i=0;i<rows;i++){
                let my_selector='#DataGrid1__ctl'+(i+2)+'_JS'+j;
                document.querySelector(my_selector).value='优秀';
                //console.log(my_selector);
            }
            //再随机一行填为良好
            randNum=randomNum(2,1+rows);
            let my_selector2='#DataGrid1__ctl'+randNum+'_JS'+j;
            document.querySelector(my_selector2).value='良好';
        }
        //第二次遍历行列，小写形式
        for(let j=3;j<=colums;j++){
            //先将所有行全填为优秀
            for(let i=0;i<rows;i++){
                let my_selector='#DataGrid1__ctl'+(i+2)+'_js'+j;
                document.querySelector(my_selector).value='优秀';
            }
            //再随机一行填为良好
            randNum=randomNum(2,1+rows);
            let my_selector2='#DataGrid1__ctl'+randNum+'_js'+j;
            document.querySelector(my_selector2).value='良好';
        }
    }

    //单列评教
    function singleWrite(rows,colums) {
        //先将所有行全填为优秀
        for(let i=0;i<rows;i++){
            let my_selector='#DataGrid1__ctl'+(i+2)+'_JS1';
            document.querySelector(my_selector).value='优秀';
            //console.log(my_selector);
        }
        //再随机一行填为良好
        randNum=randomNum(2,1+rows);
        let my_selector2='#DataGrid1__ctl'+randNum+'_JS1';
        document.querySelector(my_selector2).value='良好';
    }

    //随机函数，返回一个介于minNum和maxNum之间的值（包括两端边界）
     function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);break;
            default:
                return 0;break;
        }
    }

    //学生登录系统
    var windowURL = window.location.href;
    if (windowURL.indexOf(StudentLoginURL) != -1) {
        createGirl();
        document.querySelector('#txtUserName').value=your_username;
        document.querySelector('#TextBox2').value=your_password;
        if(op){
            genshin();
        }
    }

    //添加桌宠
    //createGirl();
    //window.onload=function {setTimeout(deleteGirl(),5000);}

    //判断是否有iframe框架
    if(iiframe = document.getElementById('iframeautoheight'))
    {
        //等待内部框架加载完毕再生成桌宠
        iiframe.onload=function(){
            //获取iframe窗口句柄
            iiframe = document.getElementById('iframeautoheight').contentWindow;
            //添加link元素
            girl_link = iiframe.document.createElement('link');
            girl_link.setAttribute('hreflang','zh');
            girl_link.setAttribute('rel','stylesheet');
            girl_link.setAttribute('href','https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css');
            girl_link.setAttribute('id','girl_link');
            iiframe.document.head.appendChild(girl_link);
            //添加script元素
            girl_script=iiframe.document.createElement('script');
            girl_script.setAttribute('src','https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js');
            girl_script.setAttribute('id','girl_script');
            iiframe.document.head.appendChild(girl_script);}

    }

    //在内嵌iframe页面删除桌宠
    function deleteGirl(){
        window.alert('delete');
        iiframe = document.getElementById('#iframeautoheight').contentWindow;
        iiframe.document.querySelector('#live2d').remove();
    }

    //左下角添加桌宠(全局作用，慎用)
    function createGirl(){
        var girl_link = document.createElement('link');
        girl_link.setAttribute('hreflang','zh');
        girl_link.setAttribute('rel','stylesheet');
        girl_link.setAttribute('href','https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css');
        document.head.appendChild(girl_link);
        var girl_script=document.createElement('script');
        girl_script.setAttribute('src','https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js');
        document.head.appendChild(girl_script);
    }

    //原神启动！
    function genshin(){
        //左栏图片
        var indexImg = document.querySelector('#form1 > div > div.login_left > img');
        indexImg.src = "https://i.imoe.xyz/optimizer/webp/22c19dfe47c54e7d2996c9f6be66180f";
        indexImg.style.width='120%';
        //底部版权说明
        document.querySelector('#form1 > div > div.login_copyright > span > span').textContent = '原神启动！';
        document.querySelector("#form1 > div > div.login_copyright > span > span").style.color = 'red';
        //顶部logo
        var indexLogo = document.querySelector('#form1 > div > div.login_logo > h3 > img');
        indexLogo.src = 'https://i.imoe.xyz/optimizer/raw/01H8HB35MNFC3VW8Y75BFAQMSC.png';
        //页面标题
        document.title = '原神启动！';
    }

})();

/*
    后记：
    Q：以后或许会补充的功能？（等有时间再写）
    A：1.网站崩溃则自动刷新，可快速进入学校网站（抢课专用！！！）
       2.自动计算学分绩点

    （以下内容仅为个人理解）
    Q：抢课的时候为什么进不去，和什么有关呢？
    A：我觉得这个肯定是正常的。
       从我所学的计算机网络知识来说，首先大家的计算机距离学校的网站的计算机服务器处于不同的计算机网络中，距离远的计算机自然需要经过更多节点的转发，自然就难进入一些。
       同时，即使是离得近也未必能进入，因为学校官网的服务器资源就这么多，抢课时那么多计算机同时去访问学校服务器，就像是DDoS攻击攻击一样，服务器自然就承受不住而崩溃了。
       而且，计算机在面临信道堵塞时候，也会采取抛弃数据的方法来减轻通信信道的堵塞，所以从计算机网络策略的角度来说，这样的现象是再正常不过的了。

    Q：那采用什么办法来快速进入选课界面呢？
    A：从原理上来说，只要学校的服务器依然是这样，访问人数依然这么大，就无法快速抢到课。
       但是嘛，原理上来说不行，也就是实际中可行。我之前是这样抢的：首先提前进入学校教务系统（防止等到大家都进的时候教务系统都进不了），然后点击选课的按钮，右键单击并选择“在新标签页中打开”，
       接着把你打开的新标签页的url记下来（也就是页面顶部地址栏的https://开头的那一整串内容）。然后，等到抢课的时候，粘贴到地址栏不断刷新页面尝试访问你之前复制的那个页面就好了。
       这种方法的原理上解释是：学校教务系统的设计是主页嵌套一个iframe框架的结构（F12查看页面代码即可看出），通过点击各个功能按钮，框架内部去加载相对应的页面资源。也就是说，我们想要访问选课界面，
       所需要经过的流程是：“访问教务系统首页→访问选课页面”，那么如果我们采用上述的方法直接粘贴对应的页面资源的url，也就是直接去访问选课页面而不用经过前面一步的访问教务系统首页，
       自然就要快很多（因为绝大多数人此时请求的资源也都在教务系统首页卡着），不断刷新页面自然可以迅速访问到，然后实现选课。

    Q：抢课脚本的原理是啥？
    A：我觉得能抢到课的原理是依靠高速多次的访问，不断去抢课才抢到的。
       如果写在这个脚本里的话，可以写一个自动帮助刷新页面的功能（脚本检测当前页面如果是error或者是乱码的话自动刷新，直到页面是正常访问到了为止）。
       代码思路也就是两个 if 条件就可以实现（前者判断url，此时是处于登录页还是教务系统首页，后者判断页面是否正常加载）。
       如此一来，你只需要打开多个网页就好，脚本会自动帮助你把每个页面都刷新成正常的页面。
       当然，由于作者本人选修课学分已经达到要求了，没有抢课需求，因此这个功能等有时间再写吧……
*/