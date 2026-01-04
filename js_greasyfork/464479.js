// ==UserScript==
// @name         京东图片下载
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  下载京东图片
// @author       super
// @match        https://item.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @require      https://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464479/%E4%BA%AC%E4%B8%9C%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/464479/%E4%BA%AC%E4%B8%9C%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
'use strict';
GM_addStyle(`
      .modal {
      display: none;
      position: fixed;
      z-index: 9999;
      padding-top: 100px;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0, 0, 0);
      background-color: rgba(0, 0, 0, 0.4);
    }
    .modal-content {
      position: relative;
      background-color: #fefefe;
      margin: auto;
      padding: 0;
      border: 1px solid #888;
      width: 80%;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      -webkit-animation-name: animatetop;
      -webkit-animation-duration: 0.4s;
      animation-name: animatetop;
      animation-duration: 0.4s
    }
    @-webkit-keyframes animatetop {
      from {
        top: -300px;
        opacity: 0
      }to {
        top: 0;
        opacity: 1
      }
    }
    @keyframes animatetop {
      from {
        top: -300px;
        opacity: 0
      }to {
        top: 0;
        opacity: 1
      }
    }
    .closes {
      color: #000;
      float: right;
      font-size: 17px;
    }
    .closes:hover,
    .closes:focus {
      cursor: pointer;
    }
    .modal-header {
      margin:auto;
      padding: 2px 16px;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
    .modal-body {
      width: 90%;
      height: 200px;
      padding: 2px 16px;
      margin-left: 5%;
      margin-right: 5%;
    }
    .modal-footer {
      padding: 2px 16px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .modal-btn {
      height: 35px;
      width: 70px;
      background-color: aquamarine;
      float: right;
      border: aquamarine 0;
      border-radius: 10px;
    }
    #lab{
    display: block;
    width: 50px;
    height: 20px;
    border-radius: 5px;
    border: 1px salmon solid;
    text-align: center;
    float: left;
    margin-left: 5px;
    margin-top: 5px;
  }
  #lab input{
    display: none;
  }
  #lab span{
    user-select: none;
  }
    `);

$(function (){
    var images=[];
    var detailed_images=[];
    var moda =`<div id="myModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="closes">&#10006</span>
        <h2>选择没下载的图片</h2>
      </div>
      <div class="modal-body" id="modal-data">
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-btn" id='datadown'>下载
        </button>
      </div>
    </div>
  </div>`;
    var body_div = document.createElement('div');
    document.body.appendChild(body_div);
    body_div.innerHTML=moda;

    var modal = document.getElementById('myModal');
    function display(){
        var data = document.getElementById('modal-data');
        for (let i = 0; i <= detailed_images.length; i++) {
            let lab = document.createElement('label');
            let inp = document.createElement('input');
            let spa = document.createElement('span');
            inp.value = i;
            lab.setAttribute('id', 'lab');
            lab.onclick= function (){
                if($(this).find('input').prop('checked')){
                    $(this).css('background-color','#00FF7F');
                }
            else{
                    $(this).css('background-color','');
                }
            }
            inp.setAttribute('type', 'checkbox');
            inp.setAttribute('name', 'modaldata');
            spa.innerText = i+1;
            lab.appendChild(inp);
            lab.appendChild(spa);
            //lab.insertAdjacentText("beforeend", i+1+ '    ');
            data.appendChild(lab);
        }
        modal.style.display = 'block';
    }
    $(".closes").click(function(){
        modal.style.display = "none";
        $('.modal-body').empty();
    })
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            $('.modal-body').empty();
        }
    }
    //商品大图，颜色图下载函数
    function download(res,name){
        var x=new XMLHttpRequest();
        x.open("GET", res, true);
        x.responseType = 'blob';
        x.onload=function(e){
            var url = window.URL.createObjectURL(x.response);
            var a = document.createElement('a');
            a.href = url; a.download = name; a.click()
        }
        x.send();
    }
    //商品详细图下载函数
    var downloadImage = function(imgsrc, name) {
        //下载图片地址和图片名
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            let url = canvas.toDataURL("image/jpeg"); //得到图片的base64编码数据
            let a = document.createElement("a"); // 生成一个a元素
            let event = new MouseEvent("click"); // 创建一个单击事件
            a.download = name + 1; // 设置图片名称
            a.href = url; // 将生成的URL设置为a.href属性
            a.dispatchEvent(event); // 触发a的单击事件
        };
        image.src = imgsrc;
    }


    $('#datadown').click(function(){
        $("input[name='modaldata']:checked").each(function(){
            images.push($(this).val());
            $(this).attr("checked", false);
        });
        for(let i=0;i<=images.length;i++){
            downloadImage(detailed_images[images[i]],Number(images[i]));
        }
        images=[];
        modal.style.display = "none";
        $('.modal-body').empty();
    })

    function down(img){
        for(let i=0;i<=img.length;i++){
            downloadImage(img[i],i)
        }
    }

    setTimeout(function(){
        let btn = document.createElement("button");
        btn.id = "id001";
        btn.textContent = "主图";
        btn.style.width = "35px";
        btn.style.height = "40px";
        btn.style.align = "center";
        btn.style.backgroundColor="red";
        btn.addEventListener("click",get_image);
        let btn1 = document.createElement("button");
        btn1.id = "id002";
        btn1.textContent = "详细";
        btn1.style.width = "35px";
        btn1.style.height = "40px";
        btn1.style.align = "center";
        btn1.style.backgroundColor="red";
        btn1.addEventListener("click",get_detailed_images);
        let btn2 = document.createElement("button");
        btn2.id = "id003";
        btn2.textContent = "颜色";
        btn2.style.width = "35px";
        btn2.style.height = "40px";
        btn2.style.align = "center";
        btn2.style.backgroundColor="red";
        btn2.addEventListener("click",get_col);
        let btn3 = document.createElement("button");
        btn3.id = "id004";
        btn3.textContent = "缺图";
        btn3.style.width = "35px";
        btn3.style.height = "40px";
        btn3.style.align = "center";
        btn3.style.backgroundColor="red";
        btn3.addEventListener("click",display);
        let abs = document.getElementsByClassName('jdm-toolbar-tabs')[0];
        abs.appendChild(btn);
        abs.appendChild(btn1);
        abs.appendChild(btn3);
        abs.appendChild(btn2);
    },'1000');

    function get_image(){
        let image = $("ul[class='lh']")[0].children;
        for (let i of image){
            download((i.children[0].src).replace('n5','imgzone').replace('s54x54_',''),'');
            //images.push((i.children['0'].src).replace('n5','imgzone'));
        }
    }
    function get_col(){
        let imgs = $("img[width='40']");
        for(let i of Object.values(imgs)){
            if(i.src != undefined){
                download(i.src.replace('n9','imgzone').replace('s40x40_',''),i.alt);
            }

        }
    }
    function get_detailed_images(){
        var pd = $('td').find('img');
        var p_img = $('p').find('img');
        if(pd.length !=0 ){
            for(let i=0;i <= pd.length;i++){
                let item = pd.eq(i).attr('data-lazyload');
                detailed_images.push(item);
            }
        }
        else if( p_img.length != 0){
            for(let i=0;i <= p_img.length;i++){
                let item = p_img.eq(i).attr('data-lazyload');
                if (item == undefined){
                    item = p_img.eq(i).attr('src');
                }
                detailed_images.push(item)
            }
        }

        else{
            let xxt = document.getElementsByClassName('ssd-module');
            for(let f of xxt){
                let a = document.defaultView.getComputedStyle(f)['background-image'];
                a = a.substring(5);
                a = a.substring(0,a.lastIndexOf('"'));
                detailed_images.push(a);
            }
        }
        if(detailed_images.length == 0){
            let img = $('#J-detail-content').find('img');
            for(let f =0;f<=img.length;f++){
                let item = img.eq(f).attr('data-lazyload');
                if(item == undefined){
                    item = img.eq(f).attr('src');
                }
                detailed_images.push(item);
            }
        }
        //console.log(detailed_images);
        down(detailed_images);
    }

});