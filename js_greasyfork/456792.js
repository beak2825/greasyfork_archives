// ==UserScript==
// @name         TT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  TT数据导出
// @author       YUNXI
// @license      YUNXI
// @match        https://partner.tiktokshop.com/affiliate-cmp/creator-marketplace
// @icon         https://1000logos.net/wp-content/uploads/2019/06/Tiktok_Logo.png
// @grant        none
// @require      https://unpkg.com/jquery
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://code.jquery.com/ui/1.10.4/jquery-ui.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @resource     element-plus    https://unpkg.com/element-plus/dist/index.css
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/456792/TT.user.js
// @updateURL https://update.greasyfork.org/scripts/456792/TT.meta.js
// ==/UserScript==
'use strict';

setTimeout(function(){
    var button = document.createElement("button")
    var button_css = "width: 100px;height: 50px;position: fixed;top: 150px;right: 100px;background-color: #4CAF50;color: white;text-align: center;text-decoration: none;"
    button.setAttribute("type", "button");
    button.style.cssText = button_css
    button.innerText="TT数据导出"
    button.onclick =function(){

        huoquID();
        //d();

    }
    document.querySelector("body").appendChild(button)
},200);

function huoquID(){
    //页数
    var yenum=3
    var ye=1
    let str = `红人名字,粉丝数量,30天平均播放量,联系方式1,联系方式2,所属国家,分类1,分类2,分类3\n`;
    for(ye=1;ye<yenum;ye++){
        var apimy="https://partner.tiktokshop.com/api/v1/oec/affiliate/creator/marketplace/4partner/recommendation?user_language=zh-CN&partner_id=7166507769141413638&aid=360019&app_name=i18n_ecom_alliance&device_id=0&fp=verify_lbbk2fyq_8fpmsAAG_67nj_4Afr_BgU5_2IYXrCooCJsQ&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/108.0.0.0+Safari/537.36&browser_online=true&timezone_name=Asia/Shanghai";
        var apigb="https://partner.tiktokshop.com/api/v1/oec/affiliate/creator/marketplace/4partner/recommendation?user_language=zh-CN&partner_id=7090836627790251778&aid=360019&app_name=i18n_ecom_alliance&device_id=0&fp=verify_lbbk2fyq_8fpmsAAG_67nj_4Afr_BgU5_2IYXrCooCJsQ&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML,+like+Gecko)+Chrome%2F108.0.0.0+Safari%2F537.36&browser_online=true&timezone_name=Asia%2FShanghai"
        var apitg="https://partner.tiktokshop.com/api/v1/oec/affiliate/creator/marketplace/4partner/recommendation?user_language=zh-CN&partner_id=7166507313187260165&aid=360019&app_name=i18n_ecom_alliance&device_id=0&fp=verify_lbbk2fyq_8fpmsAAG_67nj_4Afr_BgU5_2IYXrCooCJsQ&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML,+like+Gecko)+Chrome%2F108.0.0.0+Safari%2F537.36&browser_online=true&timezone_name=Asia%2FShanghai"
        var apiflb="https://partner.tiktokshop.com/api/v1/oec/affiliate/creator/marketplace/4partner/recommendation?user_language=zh-CN&partner_id=7166507769141462790&aid=360019&app_name=i18n_ecom_alliance&device_id=0&fp=verify_lbbk2fyq_8fpmsAAG_67nj_4Afr_BgU5_2IYXrCooCJsQ&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML,+like+Gecko)+Chrome%2F108.0.0.0+Safari%2F537.36&browser_online=true&timezone_name=Asia%2FShanghai"
        var apiyn="https://partner.tiktokshop.com/api/v1/oec/affiliate/creator/marketplace/4partner/recommendation?user_language=zh-CN&partner_id=7100753705477293829&aid=360019&app_name=i18n_ecom_alliance&device_id=0&fp=verify_lbbk2fyq_8fpmsAAG_67nj_4Afr_BgU5_2IYXrCooCJsQ&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML,+like+Gecko)+Chrome%2F108.0.0.0+Safari%2F537.36&browser_online=true&timezone_name=Asia%2FShanghai"
        var jsonData = [];
        var lx1,lx2;
        var data=JSON.stringify({"request":{"follower_genders":[],"follower_age_groups":[],"pagination":{"size":20,"page":ye}}})
        $.ajax({
            dataType: 'json',
            async : false,
            type: "POST",
            url: apimy,
            contentType: "application/json;charset=utf-8",
            data :data,
            success: function (res) {
                console.log(res)
                if(res.code == "0"){
                    console.log("导出第"+ye+"页");
                    //msg.info("导出第"+ye+"页")
                    TC()
                    // for(var ye=0;ye<res.data.next_pagination.total_page;ye++){
                    for(var j=0;j<res.data.profiles.length;j++){
                        // alert("导出第"+ye+"页"+",第"+j+1+"个数据")
                        //                     //账户id
                        //                     console.log(res.data.profiles.length);
                        //总共页数
                        //console.log(res.data.next_pagination.total_page)
                        //yenum=res.data.next_pagination.total_page;
                        console.log(res.data.profiles[j].creator_oecuid);
                        //账户名字
                        console.log(res.data.profiles[j].creator_name);
                        lx1=huoquyx(res.data.profiles[j].creator_oecuid);
                        console.log(res.data.profiles[j].region);
                        //分类
                        if(res.data.profiles[j].product_categories.length==3){
                            var fl1=res.data.profiles[j].product_categories[0];
                            var fl2=res.data.profiles[j].product_categories[1];
                            var fl3=res.data.profiles[j].product_categories[2];
                        }
                        if(res.data.profiles[j].product_categories.length==2){
                            fl1=res.data.profiles[j].product_categories[0];
                            fl2=res.data.profiles[j].product_categories[1];
                            fl2="没有第三分类";
                        }
                        if(res.data.profiles[j].product_categories.length==1){
                            fl1=res.data.profiles[j].product_categories[0];
                            fl2="没有第二分类";
                            fl3="没有第三分类";
                        }
                        jsonData.push({
                            'name':res.data.profiles[j].creator_name+',\t',
                            'fs':res.data.profiles[j].follower_cnt+',\t',
                            'bo':res.data.profiles[j].video_avg_view_cnt+',\t',
                            'lx1':lx1+',\t',
                            'gj':res.data.profiles[j].region+',\t',
                            'fl1':fl1+',\t',
                            'fl2':fl2+',\t',
                            'fl3':fl3+'\n',
                        });
                        for(let item in jsonData[j]){
                            console.log("这是第"+j+"个数据");
                            str+=`${jsonData[j][item]}`;
                        }
                        // }
                    }
                }

            }

        });
    }
    let url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    var link = document.createElement("a");
    var date1 = new Date();
    //date1=formatDate(date1);
    link.href = url;
    link.download = "TT数据"+date1+".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function huoquyx(id){
    var url1="https://partner.tiktokshop.com/api_sens/v1/affiliate/cmp/contact?creator_oecuid="+id+"&user_language=en&aid=360019&app_name=i18n_ecom_alliance&device_id=0&fp=verify_lezabihh_fAP4ppKg_7EnF_4cUz_AFmd_AZn2YcJSx1DR&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML,+like+Gecko)+Chrome%2F110.0.0.0+Safari%2F537.36&browser_online=true&timezone_name=Asia%2FShanghai&partner_id=7090836627790251778";
    var value1="没有联系方式"
    var value2="没有联系方式"
    $.ajax({
        dataType: 'json',
        async : false,
        type: "GET",
        url: url1,
        success: function (res) {
            if(res.code == "0"){
                //console.log(res.contact_info);
                var a=res.hasOwnProperty('contact_info')
                //console.log(a);
                if(a){
                    if(res.contact_info.length==1){
                        value1=res.contact_info[0].value+",\t\t没有联系方式";
                        //value2="没有联系方式";
                    }
                    else{
                        value1=res.contact_info[0].value+",\t\t"+res.contact_info[1].value;
                        //value2=res.contact_info[1].value;
                    }
                }
                else{
                    //console.log("没有联系方式");
                    value1="没有联系方式,\t\t没有联系方式";
                    //value2="没有联系方式";
                }
            }
            //console.log(value1);

        }
    })
    return value1;
    //return value2;
}

function TC(){
    var clearFlag = 0;
    var count = 3;//设置3秒后自动消失
    var showModal = function(){
        $("#my-modal-alert").toggle();//显示模态框

        $("#my-modal-alert").draggable({//设置模态框可拖动（需要引入jquery-ui.min.js）
            handle: ".modal-header"
        });

        clearFlag = self.setInterval("autoClose()",1000);//每过一秒调用一次autoClose方法
    }

    var autoClose = function(){
        if(count>0){
            $("#num").html(count + "秒后窗口将自动关闭");
            count--;
        }else if(count<=0){
            window.clearInterval(clearFlag);
            $("#num").html("");
            $("#my-modal-alert").fadeOut("slow");
            count = 3;
            $("#my-modal-alert").toggle();
        }
    }
}