// ==UserScript==
// @name         京东VC传商品主图
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  qq806350554
// @author       qq806350554
// @match        https://vcgoods.jd.com/*
// @match        https://vc.shop.jd.com/product/publish/*
// @require      https://code.jquery.com/jquery-3.6.1.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue

// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/455026/%E4%BA%AC%E4%B8%9CVC%E4%BC%A0%E5%95%86%E5%93%81%E4%B8%BB%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455026/%E4%BA%AC%E4%B8%9CVC%E4%BC%A0%E5%95%86%E5%93%81%E4%B8%BB%E5%9B%BE.meta.js
// ==/UserScript==


// location = new Proxy(location, {
//     get: (target, name) => {
//    console.log('------------------');
//         console.log(name, target, "PROX");
//   console.log('------------------');
//         return target[name];
//     }
// });


if(window.location.href.indexOf('https://vc.shop.jd.com/product/publish/')==0){
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://code.jquery.com/jquery-3.6.1.js';
    head.appendChild(script);
}
(function() {
    'use strict';
        var dddd=`
#xundian{
    position: fixed;
    top: 10%;
    right: 10%;
    z-index: 9999;
}
#xundian_textarea {
    display: block;
    height: 100px;
    width: 115px;
}
#queding{
width: 115px;
}
div#url_div {
    border: 1px solid #ccc;
    border-radius: 5px;

    background: #f7f7f7;
}

a.url_li:hover {
    background: #a7a096;
    color: #fff;
}
a.url_li {
    display: block;
    padding-left: 5px;
    /* background-color: #f3f3f333; */
    color: #666;
    text-align: left;
    line-height: 24px;
    font-size: 12px;
    border-bottom: 1px solid #fff;
}

`
//     监听函数
var focus = new Event('focus');
var blur = new Event('blur');
var input = new Event('input');
var change = new Event('change');

//         定位到上传主图页面
var src='没有src'
        let set_time=setInterval(function(){
            if(document.getElementsByClassName('is-functional').length>1){
                if($("#en").val()=="1"){
                    document.querySelector("#mainImg > div.publishSchedule > label").click()//定时开关

                    var t12=setInterval(function(){
                        if(document.querySelector("#mainImg > div.publishSchedule > label > span.el-checkbox__label > div > input")){
                            var shurukuang=  document.querySelector("#mainImg > div.publishSchedule > label > span.el-checkbox__label > div > input")
                            shurukuang.value=$("#fabu").val()
                          shurukuang.dispatchEvent(focus);
                            shurukuang.dispatchEvent(input);
                            setTimeout(function(){
                                shurukuang.dispatchEvent(change);
                                shurukuang.dispatchEvent(blur);
                                document.querySelector("body > div.el-picker-panel.el-date-picker.el-popper.has-time > div.el-picker-panel__footer > button.el-button.el-picker-panel__link-btn.el-button--default.el-button--small.is-plain.is-auto-width").click()
                            },300)

                            clearInterval(t12)
                        }},100)


                   // document.querySelector("#mainImg > div.publishSchedule > label > span.el-checkbox__label > div > input").value='333'
                }
              
                src=document.querySelector("#mainImg > div.clearfix.posit > div.standard-img.clearfix > div.img-inner > div.inner-item > ul > div > div > span > li:nth-child(1) > div > img").src
                  console.log('----',$("#mainImg").offsetTop)
                var now=new Date();
             clearInterval(set_time)
                window.scrollTo(0,document.getElementById("mainImg").offsetTop);
                document.getElementsByClassName('el-icon-upload2')[0].click()
                document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > div.zone-info.clearfix > div.mr10.fl.el-input > input").value=GM_getValue('_sku')  //输入搜索框内容
                document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > div.zone-info.clearfix > div.mr10.fl.el-input > input").dispatchEvent(focus);
                document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > div.zone-info.clearfix > div.mr10.fl.el-input > input").dispatchEvent(input);
                document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > div.zone-info.clearfix > div.mr10.fl.el-input > input").dispatchEvent(change);
                document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > div.zone-info.clearfix > div.mr10.fl.el-input > input").dispatchEvent(blur);
                //选取第一个图片
                $('body').append(`<span id="duibi" style=" position: fixed;top: 0px;height: 20px;"><img src="`+document.querySelector("#mainImg > div.clearfix.posit > div.standard-img.clearfix > div.img-inner > div.inner-item > ul > div > div > span > li:nth-child(1) > div > img").src+`" height="300px"></span>`)
               setTimeout(function(){
               document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > ul > li:nth-child(1)").click()
               },500)
                 setTimeout(function(){
               document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > ul > li:nth-child(1)").click()
               },800)
                 setTimeout(function(){
               document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > ul > li:nth-child(1)").click()
                     $('#duibi').append(`<img src="`+document.querySelector("#mainImg > div.clearfix.posit > div.PublicComponent.imgzone-component-ware > div > ul > li:nth-child(1) > p.img-con.opacity3 > img").src.replace('s70x70','s300x300') +`" height="300px">`)

               },1000)



                //弹出浏览器文件框
            }
       //    console.log('定时器',document.getElementById("mainImg").offsetTop)
        },1000)


    
        var style = document.createElement("style");
        style.type = "text/css";
        var text = document.createTextNode(dddd);
        style.appendChild(text);
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    $("html").append(`<div id='xundian'>
<textarea id='xundian_textarea' o>`+GM_getValue('jiamisku')+`</textarea>
</div>`)
    $("#xundian").append(`<div id='url_div'></idv>`)
    $("#"+GM_getValue('ct_sku_click')+"").css('background','#999c98')
  //  $("#url_div").append( localStorage[ 'ct_sku_ul' ])
     $("#url_div").append( GM_getValue('ct_sku_ul'))
    $("#"+GM_getValue('ct_sku_click')+"").css('background','#999c98')
    var  _radio;
    var _value;
    GM_getValue('radio')?_radio=GM_getValue('radio'):''
    GM_getValue('radio')?_value=1:_value=0;
  // alert(GM_getValue('radio'))
 $("#xundian").prepend(`<input type="radio" name="radio" value='`+_value+`' id="en"  `+GM_getValue('radio')+`/>
<input type="input" class="pub_btn fabu1" value="`+GM_getValue('time')+`" id="fabu" disabled="disabled" style="background-color: #cdced1;" />`)

   var flag;
    GM_getValue('radio')?flag=false:flag=true;
    $("#en").click(function(id){
        var obj;
        var c=document.getElementById('en').value;

        if(c==0){
            obj=$('#fabu');
            obj.removeAttr("disabled");
            document.getElementById('en').value=1;
            $("#fabu").css("background-color","#fff")
            GM_setValue('radio','checked')
         GM_setValue('time',$("#fabu").val())
        }else{
            obj=$('#fabu');;
            obj.attr("disabled","disabled");
            document.getElementById('en').value=0;
              $("#fabu").css("background-color","#cdced1")
             GM_setValue('radio','')
                GM_setValue('time',currentTime())

        }
        this.checked = flag;
        flag = !flag;
   })




    $(".url_li").click(async function(){
        let aaa=await cx_kc(this.id)
        console.log(aaa)
        console.log('--------------',aaa)
   window.open("https://vcgoods.jd.com/sub_item" + '/item/initEditCategory?draftId=' + aaa, "_self");
      //  https://vc.shop.jd.com/404?draftId=a22370563a5d488fb10ffb1e56daaa04
      //   alert(kc_cl(this.id))

GM_setValue('ct_sku_click',this.id)
      //  localStorage[ 'ct_sku_click']=this.id
        GM_setClipboard(this.id+'.jpg');
        GM_setValue('_sku', this.id)//设置存储函数
    })

    $("#xundian_textarea").click(function(){
        kc_cl()})


        $("#xundian_textarea").bind('input propertychange',function(){
      // localStorage[ 'jiamisku' ]=$("#xundian_textarea").val()
            GM_setValue('jiamisku',$("#xundian_textarea").val())
         bianli()
    })


   async function  bianli(){

        $(".url_li").remove()
        var str=$("#xundian_textarea").val().replace(" ","").trim()
        str=$.trim(str);
        var arr =str.split('\n')
         for(var i=0;i<arr.length;i++){
             let lujing=''
             ////$("#url_div").append(`<a class='url_li' id='`+$.trim(arr[i])+`' href="`+ `javascript:editItem('`+$.trim(arr[i])+`')`+`">`+$.trim(arr[i])+`</a>`)
              $("#url_div").append(`<a class='url_li' id='`+$.trim(arr[i])+`' href="`+ `#`+`">`+$.trim(arr[i])+`</a>`)
        }

    //   localStorage[ 'ct_sku_ul' ]= $("#url_div").html()
      GM_setValue('ct_sku_ul',$("#url_div").html())

//GM_setClipboard(text);

   }
    // Your code here...

    //自动点击“继续发布”
    var t1=setInterval(function(){
        if(document.querySelector("#app > div > div.warp > div.clearfix > div.fr.main > div:nth-child(3) > div > div > div > div.score-r > div.dialog-footer > button")){
           document.querySelector("#app > div > div.warp > div.clearfix > div.fr.main > div:nth-child(3) > div > div > div > div.score-r > div.dialog-footer > button").click()
            clearInterval(t1)
        }
    },300)
       //自动点击“我的商品”
    var t2=setInterval(function(){
        if(window.location.href=="https://vcgoods.jd.com/sub_item/item/initApplyListPage"){
            var xindeurl=`https://vc.shop.jd.com/product/publish/15286/15286/213a114f9dfb4469acf1f133ccd308a3?isbp=0&vc3_subModuleId=M-ITEM-DRAFT&vc3_pageTitle=%E9%80%89%E6%8B%A9%E5%88%86%E7%B1%BB&vc3_moduleId=M-ITEM&imageBase=http%3A%2F%2Fimg30.360buyimg.com%2F&path=%2Fjs%2Fitem%2FinitEditCategory&isCanary=true`
            // window.open('https://vcgoods.jd.com/sub_item/item/initItemListPage','_self')
            $("#"+GM_getValue('ct_sku_click')+"+ .url_li").click()
         //   window.open(xindeurl,'_self')
            clearInterval(t2)
        }



 },300)
    //自动点击 ‘提交’
    var t3=setInterval(function(){
        if(document.querySelector("#mainImg > div.clearfix.posit > div.standard-img.clearfix > div.img-inner > div.inner-item > ul > div > div > span > li:nth-child(1) > div > img")){
        if(  document.querySelector("#mainImg > div.clearfix.posit > div.standard-img.clearfix > div.img-inner > div.inner-item > ul > div > div > span > li:nth-child(1) > div > img").src!=src){
//             console.log(document.querySelector("#mainImg > div.clearfix.posit > div.standard-img.clearfix > div.img-inner > div.inner-item > ul > div > div > span > li:nth-child(1) > div > img").src)
//             document.querySelector("#templateCom > div.buttonLayout > button.el-button.el-button--primary").click()


        //    alert(GM_getValue('_sku'))
            clearInterval(t3)
        }}
    },1000)


    // 设置localsorage





    //查询加密的id  json
//     function cx_kc(id){
//         return new Promise((resolve, reject) => {
//             fetch("https://vcgoods.jd.com/sub_item/item/editItem", {
//                 "headers": {
//                     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//                 },

//                 "body": "wareId="+id,
//                 "method": "POST",

//             }).then(function(data){return data.json()}).then(function(d){
//              console.log(d['draftId'])
//                 console.log('9999')

//             resolve( d['draftId'] )
//             });

//         })}

    function cx_kc(id){
         return new Promise((resolve, reject) =>{
        GM_xmlhttpRequest({
            method: "post",
            headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
            url: "https://vcgoods.jd.com/sub_item/item/editItem",
            data: "wareId="+id,
            onload: function(e) {
                //这里写处理函数
                console.log('88888888888888888888888')
                let aa=eval('(' + e.response + ')').draftId;
                console.log(aa)
                resolve (aa)
                console.log('88888888888888888888888')
            },
            onerror:    function(reponse) {
                console.log("错误: ", reponse);
            }
        }  )
             })
    }

    //查询加密的id  json的方法
    async function kc_cl(id){

        let text1=await cx_kc(id)
        return text1
          console.log('333')
            console.log(text1)

        }
   // alert(555)
    console.log('fffffffffffffffff');
kc_cl()
//获取当前时间
    function currentTime(){
var d = new Date(),str = '';
 str += d.getFullYear()+'/';
 str  += d.getMonth() + 1+'/';
 str  += d.getDate()+' ';
 str += d.getHours()+':';
 str  += d.getMinutes()+':';
str+= d.getSeconds()+'';
return str;
}
currentTime()
})();
