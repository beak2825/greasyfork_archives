// ==UserScript==
// @author      知乎@电工李达康
// @icon        https://cn.bing.com/sa/simg/bing_p_rr_teal_min.ico
// @name        必应Bing主页美化/集成百度搜索按钮 by 电工李达康
// @namespace   必应Bing主页美化/集成百度搜索按钮
// @description 必应Bing主页美化/集成百度搜索按钮，本人自用，欢迎反馈意见→知乎@电工李达康
// @include     *://cn.bing.com/
// @include     *://www.bing.com/
// @include     *://www.bing.com/?*
// @include     *://cn.bing.com/?*
// @run-at      document-start
// @version     1.4.3
// @grant       none
// @supportURL  https://www.zhihu.com/people/qizhenkang
// @note        更新时间      版本号              更新内容
// @note        2020/04/18 - 1.4.3 - 紧急修复52pojie坛友反馈不居中问题，时间及搜索栏已居中
// @note        2020/04/18 - 1.4.2 - 背景隐藏细节优化，当前版本为推荐使用版本
// @note        2020/04/18 - 1.4.1 - 紧急修复52pojie坛友反馈bug，当前版本为推荐使用版本
// @downloadURL https://update.greasyfork.org/scripts/400783/%E5%BF%85%E5%BA%94Bing%E4%B8%BB%E9%A1%B5%E7%BE%8E%E5%8C%96%E9%9B%86%E6%88%90%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%20by%20%E7%94%B5%E5%B7%A5%E6%9D%8E%E8%BE%BE%E5%BA%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/400783/%E5%BF%85%E5%BA%94Bing%E4%B8%BB%E9%A1%B5%E7%BE%8E%E5%8C%96%E9%9B%86%E6%88%90%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%20by%20%E7%94%B5%E5%B7%A5%E6%9D%8E%E8%BE%BE%E5%BA%B7.meta.js
// ==/UserScript==
// 


(function() {
  'use strict';
  
  // 全局变量
  var focusFlag = 1;
  

  

  function Element_killer(){  // 用来移除无用元素
    var footer = document.querySelector('#b_footer');   // 移除下方信息栏
    var top = document.querySelector('#hp_sw_hdr');     // 移除顶部信息栏
    var QR = document.querySelector('#showBingAppQR');  // 移除下方二维码
    var Binglogo = document.querySelector('#sbox');     // 移除搜索处Bing标志
    
    if(footer){
      footer.remove();// 移除下方信息栏
    }
    if(top){
      top.remove();// 移除顶部信息栏
    }
    if(QR){
      QR.nextElementSibling.remove();// 移除下方二维码
      QR.remove();
    }
    if(Binglogo){
      Binglogo.firstElementChild.remove(); // 移除搜索处Bing标志
      Binglogo.firstElementChild.remove();
    }
  }
  window.setTimeout(Element_killer,200);//移除下方信息栏
  
  //获得当前时间字符串str
  function GetTimeStr(){    
    var today = new Date();
    //分别取出年、月、日、时、分、秒
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    //如果是单个数，则前面补0
    month  = month<10  ? "0"+month : month;
    day  = day <10  ? "0"+day : day;
    hours  = hours<10  ? "0"+hours : hours;
    minutes = minutes<10 ? "0"+minutes : minutes;
    seconds = seconds<10 ? "0"+seconds : seconds;

    //构建要输出的字符串
    // var str = year+"年"+month+"月"+day+"日 "+hours+":"+minutes+":"+seconds;
    var str = "TIME "+hours+":"+minutes+":"+seconds;
    return str;
    
  }
    
  //
  // **********************************************************************************************
  // 
  // 初始化函数 - 时间显示初始化 - 百度搜索功能
  //
  // **********************************************************************************************
  //
  
  function Function_init(){ // 各附加功能初始化函数
    
    // 选择元素指定

    var sbox = document.querySelector('#sbox');           //  设置搜索框属性
    var searchbox= document.querySelector('#sb_form_q');  //  搜索框
    var BaiduButton = document.createElement('button'); //  创建“百度一下”按钮
    var BaiduSearchTag = sbox.appendChild(BaiduButton); //  添加“百度一下”按钮
    var hp_container = document.getElementById("hp_container");
    var TimeDiv = document.createElement("div");
    
    

    
    //
    //  **********************************************************
    //
    //  时间显示模块
    //  
    //  **********************************************************
    //
    if(TimeDiv){
      var str = GetTimeStr(); //  获得当前时间
      TimeDiv.innerHTML = str;//  内容信息
      TimeDiv.id = "TimeDiv";// 标签id
      TimeDiv.style.fontWeight = '400'; // 字体粗细
      TimeDiv.style.position = "absolute"; // 位置信息
      TimeDiv.style.zIndex = '100'; // 窗口置顶
      TimeDiv.style.top = "19%"; // 位置信息
      // TimeDiv.style.left = "38.5%"; // 位置信息
      TimeDiv.style.fontSize = "5em";// 字体大小
      // TimeDiv.style.fontFamily = 'Times New Roman';
      TimeDiv.style.color = "#F1F1F1E0";//字体白色
      TimeDiv.style.textAlign = "center";//居中
      TimeDiv.style.userSelect = "none";//鼠标无法选中
      TimeDiv.style.backgroundColor = '#000000B0'; //背景黑色

      // TimeDiv::after{
      //   'content': '';
      //   'width': '100%'';
      //   'height': '1px'; // 元素高度
      //   'position': 'absolute';
      //   'top': '100%'';
      //   'left': '0';
      //   'background-color': 'currentColor';
      //   'transform': 'scale(0)'';
      // }

      // 鼠标悬停效果
      function TimeDivMouseEnter(){    //鼠标进入
        TimeDiv.style.color = "#00002BE0";//字体黑色
        TimeDiv.style.backgroundColor = '#FFFFFF60'; //背景白色
        TimeDiv.style.fontWeight = '400'; // 字体粗细
        // TimeDiv.style.textDecoration = "underline";

      }
      // 鼠标悬停效果
      function TimeDivMouseLeave(){    //鼠标离开
        TimeDiv.style.color = "#F1F1F1E0";//字体白色
        TimeDiv.style.backgroundColor = '#000000B0'; //背景黑色
        TimeDiv.style.fontWeight = '400'; // 字体粗细
        // TimeDiv.style.textDecoration = "none";
      }
      function TimeDivDblClick(){
        var temp = TimeDiv.onmouseenter;
        TimeDiv.onmouseenter = TimeDiv.onmouseleave;
        TimeDiv.onmouseleave = temp;
      }
      TimeDiv.onmouseenter = TimeDivMouseEnter;
      TimeDiv.onmouseleave = TimeDivMouseLeave;
      TimeDiv.ondblclick = TimeDivDblClick;

      TimeDiv.style.transition = "all 0.25s";

      // TimeDiv.style.backgroundImage = '-webkit-gradient(linear, left top, right top,color-stop(0, #f22), color-stop(0.9, #ff2))';
      // TimeDiv.style.webkitBackgroundClip = 'text';
      // TimeDiv.style.webkitTextFillColor = 'transparent';
      TimeDiv.style.padding = '0.2em'; //边框设置
      TimeDiv.style.borderRadius = '0.35em';//背景圆角
      
      if(hp_container){ 
        hp_container.insertBefore(TimeDiv,hp_container.firstChild);// 添加元素
        if(TimeDiv){
          var hpWidth = hp_container.offsetWidth; // 设置居中
          TimeDiv.style.left = ((hpWidth - TimeDiv.offsetWidth) * 100 / (2 * hpWidth)) +"%";
        }
      }
    }
    
    
    //
    // **********************************************************************************************
    //
    //  百度搜索功能
    //
    // **********************************************************************************************
    //

    // 添加百度搜索按钮元素
    if(BaiduSearchTag){
      
      // 百度按钮功能及快捷键设置
      if(BaiduButton){
        function BaiduSearch(){ // 提交百度搜索函数
          if(searchbox){
            var keywords = searchbox.value.trim();
            var url = "https://www.baidu.com/s?ie=UTF-8&wd=" + encodeURIComponent(keywords);
            window.open(url, "_self");
          }
        }

        function BaiduSearch_KeyDown(){//百度搜索快捷键
          if(window.event.keyCode == 13 && window.event.ctrlKey){ // ctrl + Enter 快捷键 百度搜索
            BaiduSearch();
          }
        }
        // document.querySelector('#sb_go_par').onclick = BaiduSearch; // 设置百度搜索（借用定时器）

        BaiduButton.innerHTML = '百度一下'; // 按钮文字
        BaiduButton.onclick = BaiduSearch; //绑定点击事件
        if(searchbox){
           searchbox.onkeydown = BaiduSearch_KeyDown;//百度搜索快捷键设置
        }
      }
      
      
      // 以下为“百度”按钮样式设置
      // var BaiduSearchTag = document.querySelector('#BaiduSearchTag');
      BaiduSearchTag.style.position = "inherit"; // 位置跟随sbox
      BaiduSearchTag.style.zIndex = '100'; // 窗口置顶
      BaiduSearchTag.id = "BaiduSearchTag";// 标签id
      BaiduSearchTag.style.fontWeight = '400'; // 字体粗细
      // BaiduSearchTag.style.position = "fixed"; // 位置信息
      // BaiduSearchTag.style.top = "40.2%"; // 位置信息
      // BaiduSearchTag.style.left = "75.75%"; // 位置信息

      BaiduSearchTag.style.fontSize = "1.50em";// 字体大小
      // BaiduSearchTag.style.fontFamily = 'Times New Roman';
      BaiduSearchTag.style.color = "#000000";//字体颜色
      BaiduSearchTag.style.textAlign = "center";//居中
      BaiduSearchTag.style.backgroundColor = '#FFFFFFB0'; //背景颜色
      BaiduSearchTag.style.border = 'none';
      BaiduSearchTag.style.userSelect = "none";//鼠标无法选中



      // 鼠标点击效果
      function BaiduSearchTagMouseDown(){    //鼠标进入
        BaiduSearchTag.style.color = "#FFFFFF";//字体白色
        BaiduSearchTag.style.backgroundColor = '#000000B0'; //背景黑色
      }
      // 鼠标点击效果
      function BaiduSearchTagMouseUp(){    //鼠标离开
        BaiduSearchTag.style.color = "#000000";//字体黑色
        BaiduSearchTag.style.backgroundColor = '#FFFFFFB0'; //背景白色
      }
      // 鼠标进入效果
      function BaiduSearchTagMouseEnter(){    //鼠标进入
        BaiduSearchTag.style.color = "#DFDFDF";//字体白色
        BaiduSearchTag.style.backgroundColor = '#5F5F5FE0'; //背景白色略深
        BaiduSearchTag.style.boxShadow = "1px 0px 5px #DFDFDF, -1px 0px 5px #DFDFDF, 0px -1px 5px #DFDFDF, 0px 1px 5px #DFDFDF";//阴影效果
      }
      // 鼠标离开效果
      function BaiduSearchTagMouseLeave(){    //鼠标离开
        BaiduSearchTag.style.color = "#000000";//字体黑色
        BaiduSearchTag.style.backgroundColor = '#FFFFFFB0'; //背景白色
        BaiduSearchTag.style.boxShadow = "";
      }


      BaiduSearchTag.onmousedown = BaiduSearchTagMouseDown;
      BaiduSearchTag.onmouseup = BaiduSearchTagMouseUp;
      BaiduSearchTag.onmouseleave = BaiduSearchTagMouseLeave;
      BaiduSearchTag.onmouseenter = BaiduSearchTagMouseEnter;
      BaiduSearchTag.style.transition = 'box-shadow 0.25s';// 效果变换时间
    }
    
    

    
    // 搜索框属性设置
    if(searchbox){
      var SearchBoxForm = searchbox.parentElement;
      searchbox.style.backgroundColor  = "#FFFFFF00";// 搜索框透明
      SearchBoxForm.style.backgroundColor = "#FFFFFFa0";// 搜索框透明
      
      
      function FindFocus(){
        var focus_ovr = document.getElementById('focus_ovr');
        if(focus_ovr){
          focus_ovr.style.height = hp_container.clientHeight + 'px';
          console.log("提示：SearchboxFocus已找到focus_ovr。");
        }
        else{
          console.log("提示：SearchboxFocus未找到focus_ovr。");
        }
      }
      
      // 获得焦点时透明度减小效果
      function SearchboxFocus(){    // 获得焦点
        SearchBoxForm.style.backgroundColor = "#FFFFFFF0";// 搜索框透明
        setTimeout(FindFocus,150); // 此处延时是因focus_ovr需时间生成，否则找不到元素
      }
      // 失去焦点恢复
      function SearchboxBlur(){    // 失去焦点
        SearchBoxForm.style.backgroundColor = "#FFFFFF15";// 搜索框透明
      }
      // 鼠标滑过效果
      function SearchboxMouseOver(){    // 鼠标滑过
        if(document.activeElement.id == "sb_form_q"){
          // 焦点仍在搜索框 搜索框保持原样
        }
        else{
          SearchBoxForm.style.backgroundColor = "#FFFFFF65";// 搜索框透明
        }
      }
      // 鼠标离开效果
      function SearchboxMouseLeave(){    //鼠标离开
        if(document.activeElement.id == "sb_form_q"){
          // 焦点仍在搜索框 搜索框保持原样
        }
        else{
          SearchBoxForm.style.backgroundColor = "#FFFFFF15";// 搜索框恢复透明
        }
      }
      // searchbox.onmouseover = SearchboxMouseOver;
      searchbox.onblur = SearchboxBlur; // 失去焦点  -  这里需要注意Focus是针对searchbox的
      searchbox.onfocus = SearchboxFocus; // 获得焦点
      searchbox.onclick = SearchboxFocus;// 点击事件
      SearchBoxForm.onclick = SearchboxFocus; // 点击事件
      SearchBoxForm.onmouseover = SearchboxMouseOver; // 鼠标滑过
      SearchBoxForm.onmouseleave = SearchboxMouseLeave; // 鼠标离开 = 失去焦点
    }
    else{
      console.log("提示：未找到searchbox");
    }
    
    BaiduSearchTag.style.height = sbox.clientHeight + 'px'; // 按钮框高度
    BaiduSearchTag.style.width = "120px"; // 按钮框宽度
    // 搜索框位置设置
    if(sbox){ 
      sbox.style.top = "45%"; // 设置位置
      sbox.style.left = "31%";
      if(hp_container){
        var hpWidth = hp_container.offsetWidth;
        sbox.style.left = (hpWidth - sbox.offsetWidth - BaiduSearchTag.offsetWidth) * 100 / (2 *hpWidth) +"%";
      }
      // sbox.style.height = "2.45em"; // 按钮框高度
      // sbox.bind('DOMNodeInserted',function(){});
    }

  }
  
  //
  // **********************************************************************************************
  // 
  // 定时器函数，用以更新时间
  //
  // **********************************************************************************************
  //
  
  function showTime(){
    var str = GetTimeStr();
    var TimeDiv = document.getElementById("TimeDiv");
    if(TimeDiv){
      TimeDiv.innerHTML = str;
    }
  }
  
  //  窗口大小改变
  window.onresize = function(){
    if(BaiduSearchTag && sbox){
      BaiduSearchTag.style.height = sbox.clientHeight + 'px'; // 按钮框高度适配
    }
    
    // if(hp_container){ 
    //   var hpWidth = hp_container.offsetWidth; // 设置居中
    //   if(TimeDiv){
    //     TimeDiv.style.left = ((hpWidth - TimeDiv.offsetWidth) * 100 / (2 * hpWidth)) +"%";
    //   }
    //   if(sbox){
    //     sbox.style.left = ((hpWidth - sbox.offsetWidth) * 100 / (2 * hpWidth)) +"%";
    //   }
    // }
  }
  
  window.setTimeout(Function_init,200); // 初始化函数
  
  window.setInterval(showTime,1000); // 定时更新时间
  
})();


