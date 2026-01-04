// ==UserScript==
// @name         蒲公英场控
// @namespace    pgy
// @version      1.2
// @description  蒲公英内部使用，微信kinglex
// @author       Kinglex
// @include      *://buyin.jinritemai.com*
// @match        https://www.tampermonkey.net/faq.php?version=4.9&ext=dhdg&updated=true
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402622/%E8%92%B2%E5%85%AC%E8%8B%B1%E5%9C%BA%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/402622/%E8%92%B2%E5%85%AC%E8%8B%B1%E5%9C%BA%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("123");
    $(function(){
        setTimeout(function () {
            add_kisu();
        }, 2000);

        //add_cc("3408670760242414712");
        //alert(idsss);


    });
    // Your code here...
})();

//加入kinglex工具
function add_kisu()
{
    //头部工具
    var kinglex_html='<div style="float: left;">';
    kinglex_html+='<div style="float: left;width: 300px;"><input placeholder="请输入商品ID或链接" type="text" class="ant-input" value="" id="good_id_kisu"></div>';
    //kinglex_html+='<div style="float: left;width: 300px;margin-left: 15px;"><form><input placeholder="请输入商品ID改价" type="text" class="ant-input" value="" id="good_id_kisu"></form></div>';
    kinglex_html+='<div style="float: left;">';
    kinglex_html+='<button type="button" class="ant-btn ant-btn-primary" id="btn_jianjie_kisu" style="margin-left: 10px;" onclike="btn_jianjie_click();"><span>讲解</span></button>';
    kinglex_html+='<button type="button" class="ant-btn " id="btn_gaijia_kisu" style="margin-left: 10px;"><span>改价</span></button>';
    kinglex_html+='</div></div>';
    $(".header .logo").after(kinglex_html);

    //讲解
    $("#btn_jianjie_kisu").click(function(){
        btn_jianjie_click();
    });
    //改价
    $("#btn_gaijia_kisu").click(function(){
        btn_gaijia_click();
    });


    //直播间商品快捷改价按钮


    $("#app .ant-table-content tbody tr").each(function(i,item){
        var goto_good_url='https://fxg.jinritemai.com/index.html#/ffa/goods/create?product_id=';
        var ggid_kisu=$(item).find('td').eq(3).html();
        goto_good_url+=ggid_kisu;
        var kinglex_html_bt='<a style="display: inline-block;width: 50px;line-height: 16px;font-weight: 600;text-align: center;" href="'+goto_good_url+'" target="_blank">改价</a>';
        $(item).find('td').eq(7).find('div').find('a:last').after(kinglex_html_bt);
        //alert(ggid_kisu);
    });

}

//讲解
function btn_jianjie_click()
{
    var good_id_text="";
    good_id_text=$("#good_id_kisu").val();
    add_cc(good_id_text);
}
//改价
function btn_gaijia_click()
{
    var good_id_text="";
    good_id_text=$("#good_id_kisu").val();
    var goodurls='https://fxg.jinritemai.com/index.html#/ffa/goods/create?product_id='+good_id_text;
    window.open(goodurls);
}


//获取抖音小店商品id对应的json数据
function getproduct_dy(dy_good_id) {
    var urls="https://buyin.jinritemai.com/api/shop/link?url=https:%2F%2Fhaohuo.jinritemai.com%2Fviews%2Fproduct%2Fdetail%3Fid%3D"+dy_good_id+"%26origin_type%3D604";
    $.get(urls,function(datas) {
        //alert( datas.data.images[0]);
    },"json"
         );

}

//加入橱窗并加入直播间商品
function add_cc(dy_good_id)
{
    var promotion_id_cc="";
    var url_img="";
    var urls="";

    if(!isNaN(dy_good_id)){
        //alert("是数字");
        //抖音小店
        urls="https://buyin.jinritemai.com/api/shop/link?url=https:%2F%2Fhaohuo.jinritemai.com%2Fviews%2Fproduct%2Fdetail%3Fid%3D"+dy_good_id+"%26origin_type%3D604";
    }else{
        //alert("不全是数字");
        //其他平台
        urls="https://buyin.jinritemai.com/api/shop/link?url="+encodeURIComponent(dy_good_id);
    }


    //alert(urls);
    $.get(urls,function(datas) {
        if(datas.code==0)
        {
            //获取商品信息
            promotion_id_cc=datas.data.promotion_id;
            url_img+=datas.data.images[0]+",";
            url_img+=datas.data.images[1]+",";
            url_img+=datas.data.images[2]+",";
            url_img+=datas.data.images[3]+",";
            url_img+=datas.data.images[4];

            //加入橱窗
            var urls_cc="https://buyin.jinritemai.com/api/shop/edit?"
            urls_cc+='elastic_img='+encodeURIComponent(url_img);
            urls_cc+="&elastic_title=%E8%A7%86%E9%A2%91%E5%90%8C%E6%AC%BE";
            urls_cc+="&promotion_id="+promotion_id_cc;

            $.get(urls_cc,function(datas) {
                if(datas.code==0)
                {
                    //alert("加橱窗成功");

                    //获取直播间商品的所有IDS
                    var promotion_ids_kisus='';//获取直播间中的商品IDS
                    var live_list_url='https://buyin.jinritemai.com/api/livepc/promotions/';
                    $.get(live_list_url,function(datas) {
                        if(datas.code==0)
                        {
                            //alert("获取直播间商品的所有IDS,成功");
                            let arrNew=new Array();
                            $.each(datas.data.promotions,function(i,item){
                                arrNew.push(item.promotion_id);
                            });
                            arrNew.push(promotion_id_cc);//当前的商品
                            promotion_ids_kisus=arrNew.join(',');


                            //绑定进直播间
                            var url_bind="https://buyin.jinritemai.com/api/livepc/author/bind?promotion_ids="+encodeURIComponent(promotion_ids_kisus);
                            $.post(url_bind,function(datas) {
                                if(datas.code==0)
                                {
                                    //alert("直播间商品绑定成功");

                                    //设置讲解
                                    var url_jj="https://buyin.jinritemai.com/api/livepc/author/setcurrent?promotion_id="+promotion_id_cc+"&cancel=false";
                                    //alert(url_jj);
                                    $.post(url_jj,function(datas) {
                                        window.location.href="https://buyin.jinritemai.com/dashboard/live/list";//设置讲解后跳转页面
                                    },"json"
                                          );

                                }else{
                                    alert("直播间商品绑定失败");
                                }
                            },"json"
                                  );


                        }else{
                            alert("获取直播间商品的所有IDS,失败");
                        }
                    },"json");

                }else{
                    alert("加橱窗失败");
                }
            },"json"
                 );

        }
        else
        {
            alert(datas.msg);
        }

    },"json");






}


