// ==UserScript==
// @name         Steam Redeem Sub
// @namespace    Steam Redeem Sub
// @version      0.8
// @description  Steam激活Sub
// @author       HCLonely
// @include      /https?:\/\/store\.steampowered\.com\/account\/licenses\/(\?sub\=[\w\W]{0,})?/
// @include      *://steamdb.info/freepackages*
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @supportURL   https://blog.hclonely.com/posts/578f9be7/
// @homepage     https://blog.hclonely.com/posts/578f9be7/
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/388060/Steam%20Redeem%20Sub.user.js
// @updateURL https://update.greasyfork.org/scripts/388060/Steam%20Redeem%20Sub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url=window.location.href;

    //steamdb.info
    if(/https?:\/\/steamdb\.info\/freepackages\//.test(url)){//点击自动跳转到激活页面
        let activateConsole = function(e) {
            let sub=[];
            $("#freepackages span:visible").map(()=>{sub.push($(this).attr("data-subid"))});
            let freePackages=sub.join(",");
            window.open("https://store.steampowered.com/account/licenses/?sub=" + freePackages,"_self");
        };
        let fp=setInterval(()=>{
            if(document.getElementById("freepackages")){
                document.getElementById("freepackages").innerHTML=`<button>激活SUB</button>`+document.getElementById("freepackages").innerHTML;
                document.getElementById("freepackages").onclick=activateConsole;
                clearInterval(fp);
            }
        },1000);
    }else{
        function redeemSub(e){
            let subText=e||document.getElementById("gameSub").value;
            if(subText){
                let ownedPackages = {};
                jQuery( '.account_table a' ).each( function( i, el ){
                    let match = el.href.match( /javascript:RemoveFreeLicense\( ([0-9]+), '/ );
                    if( match !== null ){
                        ownedPackages[ +match[ 1 ] ] = true;
                    }
                } );
                //console.log(subText);
                let freePackages =subText.match(/[\d]{2,}/g);
                let i = 0,
                    loaded = 0,
                    packae = 0,
                    total = freePackages.length,
                    modal = swal( '正在执行…','请等待所有请求完成。 忽略所有错误，让它完成。' );
                for( ; i < total; i++ ){
                    packae = freePackages[ i ];
                    if( ownedPackages[ packae ] ){
                        loaded++;
                        continue;
                    }
                    jQuery.post('//store.steampowered.com/checkout/addfreelicense'+packae,{
                        action: 'add_to_cart',
                        sessionid: g_sessionID,
                        subid: packae
                    }).always( function(){
                        loaded++;
                        //modal.Dismiss();
                        if( loaded >= total ){
                            window.open("https://store.steampowered.com/account/licenses/","_self");
                        }else{
                            modal = swal( '正在激活…', '进度：' + loaded + '/' + total + '.' );
                        }
                    });
                }
            }
        }
        function cc(){
            jQuery.ajax({
                url:"//store.steampowered.com/cart/",
                type:"get",
                success:function(data){
                    if(data.match(/id\=\"usercountrycurrency_trigger\"[\w\W]*?\>[w\W]*?\<\/a/gim)){
                        let c=data.match(/id\=\"usercountrycurrency_trigger\"[\w\W]*?\>[w\W]*?\<\/a/gim)[0].replace(/id\=\"usercountrycurrency_trigger\"[\w\W]*?\>|\<\/a/g,"");
                        let thisC=data.match(/id\=\"usercountrycurrency\"[\w\W]*?value=\".*?\"/gim)[0].match(/value=\".*?\"/gim)[0].replace(/value=\"|\"/g,"");
                        let div=data.match(/\<div class=\"currency_change_options\"\>[\w\W]*?\<p/gim)[0].replace(/[\s]*?\<p/gim,"")+"</div>";
                        jQuery("body").append(`<div id="ccDiv" style="position:fixed;margin:auto;z-index: 1000;width:629px;height:228px;top:20px;bottom:20px;left:20px;right:20px;background-color:#232b34"><div class="newmodal_header_border"><div class="newmodal_header"><div class="newmodal_close"></div><div id="nowCountry" class="ellipsis" data-country="${thisC}" style="font-size:20px;">转换商店和钱包&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前国家/地区：${c}</div></div></div><div style="padding:20px">${div}</div></div>`);
                        jQuery(".currency_change_option").click(function(){changeCountry(jQuery(this).attr("data-country"))});
                        jQuery(".newmodal_close").click(()=>{jQuery("#ccDiv").remove()});
                    }else{
                        swal("需要挂相应地区的梯子！","","warning");
                    }
                },
                error:()=>{swal("获取当前国家/地区失败！","","error");}
            });
        }
        function changeCountry(country){
            jQuery.ajax({
                url:"//store.steampowered.com/country/setcountry",
                type:"post",
                data:{
                    sessionid:g_sessionID,
                    "cc":country
                },
                complete:function(data){
                    jQuery.ajax({
                        url:"//store.steampowered.com/cart/",
                        type:"get",
                        success:function(data){
                            let c=data.match(/id\=\"usercountrycurrency_trigger\"[\w\W]*?\>[w\W]*?\<\/a/gim)[0].replace(/id\=\"usercountrycurrency_trigger\"[\w\W]*?\>|\<\/a/g,"");
                            let thisC=data.match(/id\=\"usercountrycurrency\"[\w\W]*?value=\".*?\"/gim)[0].match(/value=\".*?\"/gim)[0].replace(/value=\"|\"/g,"");
                            let div=data.match(/\<div class=\"currency_change_options\"\>[\w\W]*?\<p/gim)[0].replace(/[\s]*?\<p/gim,"")+"</div>";
                            jQuery("#ccDiv").html(`<div class="newmodal_header_border"><div class="newmodal_header"><div class="newmodal_close"></div><div id="nowCountry" class="ellipsis" data-country="${thisC}" style="font-size:20px;">转换商店和钱包&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前国家/地区：${c}</div></div></div><div style="padding:20px">${div}</div>`);
                            jQuery(".currency_change_option").click(()=>{changeCountry(jQuery(this).attr("data-country"))});
                            jQuery(".newmodal_close").click(()=>{jQuery("#ccDiv").remove()});
                            thisC===country?swal("更换成功！","","success"):swal("更换失败！","","error");
                        },
                        error:()=>{swal("获取当前国家/地区失败！","","error");}
                    });
                }
            });
        }
        jQuery('h2.pageheader').parent().append('<div style="float: left;";>' +
                                              '<textarea class="registerkey_input_box_text" rows="1"' + 'name="product_key"' +
                                              ' id="gameSub" placeholder="输入SUB,多个SUB之间用英文逗号连接"' + 'value=""' + 'color:#fff;' +
                                              ' style="margin: 3px 0px 0px; width: 400px; height: 15px;background-color:#102634; padding: 6px 18px 6px 18px; font-weight:bold; color:#fff;"></textarea>' +
                                              ' &nbsp ' + '</div>' + '<a tabindex="300" class="btnv6_blue_hoverfade btn_medium"' +
                                              ' style="width: 95px; height: 30px;"' +
                                              ' id="buttonSUB"><span>激活SUB</span></a>'+ '<a tabindex="300" class="btnv6_blue_hoverfade btn_medium"' +
                                              ' style="width: 125px; height: 30px;"' +
                                              ' id="changeCountry"><span>更改国家/地区</span></a>');
        jQuery('#buttonSUB').click(()=>{redeemSub()});
        jQuery('#changeCountry').click(cc);
        if (url.includes("sub=")) setTimeout(()=>{redeemSub(url)},2000);
    }
})();
