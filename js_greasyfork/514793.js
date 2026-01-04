// ==UserScript==
// @name         sasurugaya
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  record the surugaya item you buy
// @author       longzai
// @match        https://www.suruga-ya.jp/search*
// @match        https://www.suruga-ya.jp/pcmypage/action_sell_search/detail*
// @match        https://www.suruga-ya.jp/product/detail/*
// @match        https://www.suruga-ya.jp/feature/timesale/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suruga-ya.jp
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514793/sasurugaya.user.js
// @updateURL https://update.greasyfork.org/scripts/514793/sasurugaya.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bought_items=GM_getValue('bought_items',{});
    unsafeWindow.bought_items=bought_items;
    var bought_items2=new Set(GM_getValue('bought_items2',[]));
    var bought_pages=GM_getValue('bought_pages',{});
    var tenpo_branch=GM_getValue('tenpo_branch',{'':'0001'});
    var item_data=GM_getValue('item_data',{});
    console.log(tenpo_branch);
    let div_item=$("div.item_box div.item");
    console.log(Object.keys(bought_items).length,bought_items2.size);
    console.log(div_item.length);
    let all_a_tag=$("a");
    all_a_tag.each((n,item)=>{
        //console.log(item,n);
        let h=item.getAttribute('href')
        if(h && h.includes('search_word=&')){
            item.setAttribute('href',h.replace('search_word=&','search_word=%E3%83%9E%E3%83%AA%E3%82%A2%E6%A7%98%E3%81%8C%E3%81%BF%E3%81%A6%E3%82%8B&'))
        }
                             })
    div_item.append((n)=>{var a=div_item[n].querySelector('div.title a');

                          var u=new URL(a.href);
                          var price_text='';
                          var b=u.pathname.split('/').pop();
                          console.log(b);
                          if (b in bought_items){price_text+=`<div style="color:red;">surugaya_bought_value:${bought_items[b]}</div> `}
                          if (bought_items2.has(b)){price_text+=`<div style="color:green;">outside_bought_value</div> `}
                          if (b in item_data){
                              for(var date in item_data[b]){
                                  price_text+=`<div style="color:blue;"> ${date}</div>`;
                                  var date_value=item_data[b][date]
                                  for(var key in date_value){
                                      price_text+=`<div style="color:black;">${key}:${date_value[key]}</div>`;
                                  }
                              }
                          }
                          if(a.href.includes('/product-other/')){return price_text;
                                                                }
                          else if(a.href.includes('/product/other/')){return price_text;
                                                                     }
                          else if (! a.href.includes('/product/detail/')){throw(a.href)}
                          var tenpo_cd=u.searchParams.get('tenpo_cd') || "";
                          //console.log(`<input type="checkbox" ${((b in bought_items) || bought_items2.has(b))?"":"checked"} class="addcartcheck" value1="${a.text}" value2="${a.href}" value3="${b}" tenpo_cd="${tenpo_cd}">`+price_text);
                          return `<input type="checkbox" ${((b in bought_items) || bought_items2.has(b))?"":"checked"} class="addcartcheck" value1="${a.text}" value2="${a.href}" value3="${b}" tenpo_cd="${tenpo_cd}">`+price_text;
                         }
                   );
    let addcartcheck=$(".addcartcheck");
    let trade_code=new URLSearchParams(window.location.search).get('trade_code');
    //addcartcheck.each((n)=>{addcartcheck[n].checked=true;});
    $('div.item div p a').on('click', function(event) {
        if (event.shiftKey) {
            event.preventDefault();
            console.log($(this).attr('href'),$(this).attr('href').split('?')[0]);
            window.open($(this).attr('href').split('?')[0], '_blank');
        }
    });

    let x=$('table.mgnT15 tbody tr');
    x.each((n)=>{if(n==0){return};var item1=x[n].children[0].textContent;x[n].children[0].innerHTML=`<a href="/product/detail/${item1}">${item1}</a>`});

    if (window.location.pathname.includes('product/detail/')){
        $("h1.h1_title_product").append((n)=>{
            var price_text='';
            var b=window.location.pathname.split('/').pop();
            if (b in bought_items){price_text+=`<div style="color:red;">surugaya_bought_value:${bought_items[b]}</div> `}
            if (bought_items2.has(b)){price_text+=`<div style="color:green;">outside_bought_value</div> `}
            if (b in item_data){
                for(var date in item_data[b]){
                    price_text+=`<div style="color:blue;"> ${date}</div>`;
                    var date_value=item_data[b][date]
                    for(var key in date_value){
                        price_text+=`<div style="color:black;">${key}:${date_value[key]}</div>`;
                    }
                }
            }
            return price_text;
        }
        )
    }
    async function kd(e){//q:添加到购物车,y:从购买页保存数据修改bought_items,i:从商品详情页设置branch_num,z:上传文件修改bought_items2(是否购买),x:取消全部选中,b:清除bought_items和bought_items2,m:上传文件修改item_data(爬虫文件,价格)
        let keycode=(window.event) ? e.which : e.keyCode;
        //console.log(keycode,String.fromCharCode(keycode).toLowerCase(),String.fromCharCode(keycode))
        if (e.ctrlKey && String.fromCharCode(keycode).toLowerCase()=='q')
        {
            var a1=0,a2=[],a3=[],a4=[];
            var p=[]
            addcartcheck.each((n)=>{
                var e=addcartcheck[n];
                console.log(`rem=${e.getAttribute("value3")}&tenpo_cd=${e.getAttribute("tenpo_cd")}&amount=1`);
                let tenpo_cd=e.getAttribute("tenpo_cd");
                if(! (tenpo_cd in tenpo_branch)){
                    a2.push(['未添加店铺',e.getAttribute("tenpo_cd"),e.getAttribute("value3")]);
                    return;
                }
                if (e.checked){
                    p.push( new Promise((resolve, reject) => {GM_xmlhttpRequest({
                        method:     "POST",
                        url:        "https://www.suruga-ya.jp/cargo/ajax_add",
                        data:       `rem=${e.getAttribute("value3")}&branch_number=${tenpo_branch[tenpo_cd]}&tenpo_cd=${tenpo_cd}&amount=1`,
                        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},
                        onload:     function (response) {
                            var s=JSON.parse(response.responseText);
                            if(s.status=='1') {a1+=1;e.checked=false;}
                            else{a2.push([e.getAttribute("value1"),e.getAttribute("value2"),s.data]);}
                            resolve();
                        },
                        onerror:    function (){
                            a3.push([e.getAttribute("value1"),e.getAttribute("value2")]);
                            resolve();
                        }
                    })
                    }
                    )
                    );
                }
                else{
                    a4.push([e.getAttribute("value1"),e.getAttribute("value2")]);
                }
            }
          )
            await Promise.all(p);
           console.log(`未选中${a4.length}个商品,选中${a1+a2.length+a3.length}个商品,其中成功添加${a1}个,添加失败${a2.length}个,未成功处理${a3.length}个`)
           console.log("添加失败的有:")
            a2.forEach((value)=>{console.log(value);});
           console.log("未成功处理的有:")
            a3.forEach((value)=>{console.log(value);});
           console.log("未选中的有:")
            a4.forEach((value)=>{console.log(value);});
       }
        else if (e.ctrlKey && String.fromCharCode(keycode).toLowerCase()=='y')
        {
            if(trade_code){bought_pages[trade_code]='y'};
            let x=$('table.mgnT15 tbody tr');
            if(x[0].children[0].textContent!='品番' || x[0].children[5].textContent!='数量' || x[0].children[8].textContent!='備考'){throw(x[0])}
            console.log(x.length-1,Object.keys(bought_items).length);
            var count1=0
            var count2=0
            var count3=0
            var count4=0
            var count5=0
            var p=[]
            x.each((n)=>{if(n==0) {return};
                         if(x[n].children.length!=9){return}
                         var item1=x[n].children[0].textContent;
                         p.push( new Promise((resolve, reject) => {GM_xmlhttpRequest({
                             method:     "GET",
                             url:        "https://www.suruga-ya.jp/product/detail/"+item1,
                             onload:     function (response) {
                                 var item=response.finalUrl
                                 if(item1!=item && item1 in bought_items){delete bought_items[item]}
                                 var u=new URL(response.finalUrl);
                                 item=u.pathname.split('/').pop();
                                 if(item1!=item && item1 in bought_items){delete bought_items[item1]}
                                 if(x[n].children[5].textContent==0)
                                 {
                                     count1+=1
                                     if(x[n].children[8].textContent.includes('キャンセル') || x[n].children[8].textContent.includes('在庫なし'))
                                     {
                                         count2+=1
                                         if (item in bought_items && bought_items[item]!=null){count3+=1;delete bought_items[item]}
                                     }
                                     else{
                                         throw(x[n],x[n].children[8].textContent);
                                     }
                                 }
                                 else{
                                     count4+=1
                                     if (!(item in bought_items)){count5+=1;bought_items[item]=x[n].children[4].textContent}
                                 }
                                 resolve();
                             },
                             onerror:    function (){
                                 console.log("reject: ",item1)
                                 reject();
                             }
                         })
                                                                  }
                                            )
                         );
                        }
                  );
            await Promise.all(p);
            console.log(count1,count2,count3,count4,count5)
            console.log(Object.keys(bought_items).length);
            GM_setValue('bought_items',bought_items);
            console.log(bought_items)
        }
        else if (e.ctrlKey && String.fromCharCode(keycode).toLowerCase()=='i'){
            if(window.location.pathname.includes('/product/detail/')){
                let tenpo_cd=$('input[name="tenpo_cd"]').attr('value');
                let branch_num=$('input[name="branch_number"]').attr('value');
                tenpo_branch[tenpo_cd]=branch_num;
                console.log(tenpo_branch);
                GM_setValue('tenpo_branch',tenpo_branch);
            }
        }
        else if (e.ctrlKey && String.fromCharCode(keycode).toLowerCase()=='z')
        {
            console.log('awegfaw');
            var lnk = document.createElement ('input');
            lnk.type="file"
            lnk.dispatchEvent (new MouseEvent ("click"));
            lnk.addEventListener('change',function(){
                console.log(lnk.files[0].name)
                var reader=new FileReader()
                reader.readAsText(lnk.files[0],'UTF-8')
                reader.onload=function(e){var item_list=JSON.parse(e.target.result);
                                          bought_items2=new Set()
                                          for(var item of item_list){bought_items2.add(item);}
                                         GM_setValue('bought_items2',Array.from(bought_items2));
                                         console.log(bought_items2.size);}
            }
            )

        }
        else if (e.ctrlKey && String.fromCharCode(keycode).toLowerCase()=='x')
        {
            addcartcheck.each((n)=>{addcartcheck[n].checked=false;})
        }
        else if (e.ctrlKey && String.fromCharCode(keycode).toLowerCase()=='b')
        {
            bought_items={};
            GM_setValue('bought_items',bought_items);
            bought_items2=new Set();
            GM_setValue('bought_items2',Array.from(bought_items2));
            console.log('clear success');
        }
        else if (e.ctrlKey && String.fromCharCode(keycode).toLowerCase()=='m')
        {
            console.log('awegfaw');
            var lnk = document.createElement ('input');
            lnk.type="file"
            lnk.dispatchEvent (new MouseEvent ("click"));
            lnk.addEventListener('change',function(){
                console.log(lnk.files[0].name)
                var reader=new FileReader()
                reader.readAsText(lnk.files[0],'UTF-8')
                reader.onload=function(e){var json_data=JSON.parse(e.target.result);
                                          item_data={}
                                          for(var key in json_data){item_data[key]=json_data[key]['date_price'];}
                                         GM_setValue('item_data',item_data);
            }
            }
            )
        }
        else if (e.ctrlKey && String.fromCharCode(keycode).toLowerCase()=='¿')
        {
            alert("ctrl+q:添加到购物车,y:从购买页保存数据修改bought_items,i:从商品详情页设置branch_num,z:上传文件修改bought_items2(是否购买),x:取消全部选中,b:清除bought_items和bought_items2,m:上传文件修改item_data(爬虫文件,价格)");
        }
    }
    document.addEventListener("keydown", kd);
    console.log("abc");
})();